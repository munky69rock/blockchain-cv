import * as Cookie from "cookie.js";
import * as React from "react";
import * as Web3 from "web3";

import { IMunky69rockCV } from "../contract-interfaces/IMunky69rockCV";

const styles = require("./Tip.css");

interface ITipProps {
  web3: Web3;
  contractInstance: IMunky69rockCV;
  isOwner: boolean;
}

interface ITipState {
  isShowingModal: boolean;
  isWaitingForMining: boolean;
  ether: string;
}

class Tip extends React.Component<ITipProps, ITipState> {
  constructor(props: ITipProps) {
    super(props);

    this.state = {
      isShowingModal: false,
      isWaitingForMining: false,
      ether: "",
    };

    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public async componentWillMount() {
    this.props.contractInstance.ReceivedFunds(
      {
        from: this.props.web3.eth.accounts[0],
      },
      {
        fromBlock: "latest",
        toBlock: "latest",
      },
    ).watch(async (err, args) => {
      if (err) {
        console.error(err);
        alert(`
Oops! Something wrong...

${err}
      `);
        return;
      }
      if (Cookie.get("txHash") === args.transactionHash) {
        return;
      }
      this.setState((state: ITipState): ITipState => {
        return {
          isShowingModal: false,
          isWaitingForMining: false,
          ether: "",
        };
      });
      Cookie.set("txHash", args.transactionHash, { expires: 365 });
      alert("Thank you!");
    });
  }

  public render() {
    if (!this.props.contractInstance) {
      return null;
    }

    return (
      <div className="text-center mb-5">
        <button
          className={styles.tipButton}
          onClick={this.onClick}
        >
          TIP ETHER
        </button>

        {this.state.isShowingModal &&
            <div className={styles.modal}>
              <div className={styles.closeModalButton}>
                <a
                  href="#"
                  onClick={this.onClick}
                  className={styles.closeModalButtonIcon}
                >
                  <i className="fa fa-close"/>
                </a>
              </div>
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="Ether"
                    min="0.0001"
                    step="0.0001"
                    value={this.state.ether}
                    onChange={this.onChange}
                    className="form-control"
                    style={{borderRadius: 0}}
                    disabled={this.state.isWaitingForMining}
                  />
                </div>
                {!this.state.isWaitingForMining ?
                  <div>
                    <a
                      href="#"
                      onClick={this.onClick}
                      className={styles.button}
                      style={{ border: "none" }}
                    >
                      Cancel
                    </a>
                    <input type="submit" className={styles.button} value=" Send "/>
                  </div>
                  :
                  <div className="text-muted text-center">
                    Waiting for mining...
                  </div>
                }
              </form>
            </div>
        }
      </div>
    );
  }

  private onClick(event: React.MouseEvent<HTMLElement>) {
    event.preventDefault();
    this.setState((state: ITipState): ITipState => {
      state.isShowingModal = !state.isShowingModal;
      return state;
    });
  }

  private async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      this.setState((state: ITipState): ITipState => {
        state.isWaitingForMining = true;
        return state;
      });
      await this.props.contractInstance.sendTransaction({
        from: this.props.web3.eth.accounts[0],
        value: this.props.web3.toWei(this.state.ether, "ether"),
      });
    } catch (err) {
      this.setState((state: ITipState): ITipState => {
        state.isWaitingForMining = false;
        return state;
      });
      if (/User denied transaction signature/.test(err)) {
        return;
      }
      console.error(err);
      alert(`
Oops! Something wrong...

${err}
      `);
    }
  }

  private onChange(event: React.FormEvent<HTMLInputElement>) {
    event.preventDefault();
    const ether = event.currentTarget.value;
    this.setState((state: ITipState): ITipState => {
      state.ether = ether;
      return state;
    });
  }
}

export { Tip };

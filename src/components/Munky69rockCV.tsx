import * as React from "react";
import * as TruffleContract from "truffle-contract";
import * as Web3 from "web3";

const Munky69rockCVContract = TruffleContract(require("../../build/contracts/Munky69rockCV.json"));
import { IMunky69rockCV } from "../contract-interfaces/IMunky69rockCV";
import { Educations } from "./Educations";
import { Experiences } from "./Experiences";
import { Footer } from "./Footer";
import { Links } from "./Links";
import { Metadata } from "./Metadata";
import { Profile } from "./Profile";
import { Skills } from "./Skills";

const styles = require("./Munky69rockCV.css");

interface IMunky69rockCVProps {
  web3: Web3;
}

interface IMunky69rockCVState {
  isOwner: boolean;
  isEditable: boolean;
}

class Munky69rockCV extends React.Component<IMunky69rockCVProps, IMunky69rockCVState> {
  private contractInstance: IMunky69rockCV;

  constructor(props: IMunky69rockCVProps) {
    super(props);

    this.state = {
      isOwner: false,
      isEditable: false,
    };

    this.onClick = this.onClick.bind(this);
  }

  public async componentWillMount() {
    Munky69rockCVContract.setProvider(this.props.web3.currentProvider);

    try {
      this.contractInstance = await Munky69rockCVContract.deployed();
    } catch (err) {
      console.error(err);
      alert(`
Could not fetch contract.

Requirements:
- MetaMask or MIST
- Main Ethereum Network
      `);
      return;
    }

    await this.load();
  }

  public render() {
    if (!this.contractInstance) {
      return <div className={styles.emptyView}/>;
    }

    return (
      <div className={styles.cv}>

        {this.state.isOwner &&
          <div className={styles.preview}>
            <button onClick={this.onClick} className="btn btn-primary">
              {this.state.isEditable ? "Preview" : "Quit Preview"}
            </button>
          </div>
        }

        <Profile web3={this.props.web3} contractInstance={this.contractInstance} isOwner={this.state.isEditable}/>
        <hr/>

        <div className="container mb-md-5">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <Experiences
                web3={this.props.web3}
                contractInstance={this.contractInstance}
                isOwner={this.state.isEditable}
              />
            </div>
            <div className="col-sm-12 col-md-6">
              <Educations
                web3={this.props.web3}
                contractInstance={this.contractInstance}
                isOwner={this.state.isEditable}
              />
            </div>
            <hr/>
          </div>
        </div>

        <div className="container mb-md-5">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <Skills
                web3={this.props.web3}
                contractInstance={this.contractInstance}
                isOwner={this.state.isEditable}
              />
            </div>
            <div className="col-sm-12 col-md-6">
              <Links
                web3={this.props.web3}
                contractInstance={this.contractInstance}
                isOwner={this.state.isEditable}
              />
            </div>
          </div>
        </div>

        <Metadata web3={this.props.web3} contractInstance={this.contractInstance} isOwner={this.state.isEditable}/>

        <Footer web3={this.props.web3} contractInstance={this.contractInstance} isOwner={this.state.isEditable}/>
      </div>
    );
  }

  private async isOwner(): Promise<boolean> {
    try {
      return await this.contractInstance.isOwner({ from: this.props.web3.eth.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  }

  private async load() {
    const isOwner = await this.isOwner();

    this.setState((state: IMunky69rockCVState): IMunky69rockCVState => {
      return {
        isOwner,
        isEditable: isOwner,
      };
    });
  }

  private onClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    this.setState((state: IMunky69rockCVState): IMunky69rockCVState => {
      state.isEditable = !state.isEditable;
      return state;
    });
  }
}

export { Munky69rockCV };

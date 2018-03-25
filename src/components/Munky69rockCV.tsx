import * as React from "react";
import * as TruffleContract from "truffle-contract";
import * as Web3 from "web3";

const Munky69rockCVContract = TruffleContract(require("../../build/contracts/Munky69rockCV.json"));
import { IMunky69rockCV } from "../contract-interfaces/IMunky69rockCV";
import { Educations } from "./Educations";
import { Experiences } from "./Experiences";
import { Links } from "./Links";
import { Metadata } from "./Metadata";
import { Profile } from "./Profile";
import { Skills } from "./Skills";
import { Tip } from "./Tip";

const styles = require("./Munky69rockCV.css");
const packageJson = require("../../package.json");

interface IMunky69rockCVProps {
  web3: Web3;
}

interface IMunky69rockCVState {
  lastUpdated?: Date;
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

    this.listenToEvents();

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

        <Tip web3={this.props.web3} contractInstance={this.contractInstance} isOwner={this.state.isEditable}/>

        <Metadata web3={this.props.web3} contractInstance={this.contractInstance} isOwner={this.state.isEditable}/>

        {/* TODO */}
        <div className="container text-center py-3">
          <p>LAST UPDATED: {this.state.lastUpdated && this.state.lastUpdated.toDateString()}</p>
          <div className="my-3">
            <a
              className="fa fa-github-alt text-white mr-2"
              href="https://github.com/munky69rock/ethereum-cv"
              target="_blank"
            />
            <a
              className="fa fa-twitter-square text-white mr-2"
              href={
                "https://twitter.com/intent/tweet?" +
                [
                  `url=${encodeURIComponent(location.href)}`,
                  `text=${encodeURIComponent(packageJson.description)}`,
                ].join("&")
              }
              onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                window.open(
                  event.currentTarget.href,
                  "twitter",
                  "width=650, height=450, menubar=no, toolbar=no, scrollbars=yes",
                );
              }}
            />
            <a
              className="fa fa-facebook-square text-white"
              href={`https://www.facebook.com/share.php?u=${encodeURIComponent(location.href)}`}
              onClick={(event: React.MouseEvent<HTMLAnchorElement>) => {
                event.preventDefault();
                window.open(
                  event.currentTarget.href,
                  "facebook",
                  "width=650, height=450, menubar=no, toolbar=no, scrollbars=yes",
                );
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  private async getLastUpdated(): Promise<Date> {
    try {
      return new Date((await this.contractInstance.getLastUpdated()).toNumber() * 1000);
    } catch (err) {
      console.error(err);
    }
  }

  private async isOwner(): Promise<boolean> {
    try {
      return await this.contractInstance.isOwner({ from: this.props.web3.eth.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  }

  private async load() {
    const [lastUpdated, isOwner]: [Date, boolean] = await Promise.all([
      this.getLastUpdated(),
      this.isOwner(),
    ]);

    this.setState((state: IMunky69rockCVState): IMunky69rockCVState => {
      return {
        lastUpdated,
        isOwner,
        isEditable: isOwner,
      };
    });
  }

  private listenToEvents() {
    const callback = async () => {
      console.log("cv updated");
      await this.load();
    };
    this.contractInstance.UpdatedProfile().watch(callback);
    this.contractInstance.UpdatedExperience().watch(callback);
    this.contractInstance.UpdatedEducation().watch(callback);
    this.contractInstance.UpdatedLink().watch(callback);
    this.contractInstance.UpdatedSkill().watch(callback);
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

import * as React from "react";
import * as Web3 from "web3";
import { IMunky69rockCV } from "../contract-interfaces/IMunky69rockCV";
import {Tip} from "./Tip";

const packageJson = require("../../package.json");

interface IFooterProps {
  web3: Web3;
  contractInstance: IMunky69rockCV;
  isOwner: boolean;
}

interface IFooterState {
  lastUpdated?: Date;
}

class Footer extends React.Component<IFooterProps, IFooterState> {
  constructor(props: IFooterProps) {
    super(props);
    this.state = {};
  }

  public async componentWillMount() {
    this.listenToEvents();
    await this.loadLastUpdated();
  }

  public render() {
    if (!this.state.lastUpdated) {
      return null;
    }

    return (
      <div className="container text-center py-3">
        <Tip web3={this.props.web3} contractInstance={this.props.contractInstance} isOwner={this.props.isOwner}/>

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
    );
  }

  private listenToEvents() {
    const callback = async () => {
      console.log("cv updated");
      await this.loadLastUpdated();
    };
    this.props.contractInstance.UpdatedProfile().watch(callback);
    this.props.contractInstance.UpdatedExperience().watch(callback);
    this.props.contractInstance.UpdatedEducation().watch(callback);
    this.props.contractInstance.UpdatedLink().watch(callback);
    this.props.contractInstance.UpdatedSkill().watch(callback);
  }

  private async getLastUpdated(): Promise<Date> {
    try {
      return new Date((await this.props.contractInstance.getLastUpdated()).toNumber() * 1000);
    } catch (err) {
      console.error(err);
    }
  }

  private async loadLastUpdated() {
    const lastUpdated = await this.getLastUpdated();

    this.setState((state: IFooterState): IFooterState => {
      return {
        lastUpdated,
      };
    });
  }
}

export { Footer };

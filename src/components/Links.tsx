import * as React from "react";

import {ILink, IListableWrapperProps} from "../contract-interfaces/IMunky69rockCV";
import {Link} from "./Link";

interface ILinksState {
  ids?: number[];
  isWaitingForMining: boolean;
  link?: ILink;
}

const styles = require("./Common.css");

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Links extends React.Component<IListableWrapperProps, ILinksState> {
  constructor(props: IListableWrapperProps) {
    super(props);
    if (props.isOwner) {
      this.state = {
        isWaitingForMining: false,
        link: {
          linkType: "",
          url: "",
        },
      };
    } else {
      this.state = {
        isWaitingForMining: false,
      };
    }
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  public async componentWillMount() {
    await this.loadIds();

    this.props.contractInstance.UpdatedLink().watch(async () => {
      console.log("link updated");
      await this.loadIds();
    });
  }

  public render() {
    if (!this.state.ids) {
      return null;
    }

    return (
      <div className="py-3">
        <h2 className={styles.name}>LINKS</h2>
        {this.state.ids.map((id) => {
          return <Link
            web3={this.props.web3}
            contractInstance={this.props.contractInstance}
            isOwner={this.props.isOwner}
            id={id}
            key={id}
          />;
        })}
        {this.props.isOwner &&
          <div className="container border py-3">
            {this.state.isWaitingForMining ?
                <div>
                  <span className="badge badge-secondary ml-2">Waiting for mining...</span>
                  <p className="text-muted">LinkType: {this.state.link.linkType}</p>
                  <p className="text-muted">URL: {this.state.link.url}</p>
                </div>
                :
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                      placeholder="Link Type"
                      type="text"
                      value={this.state.link.linkType}
                      onChange={this.onChange("linkType")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      placeholder="URL"
                      type="text"
                      value={this.state.link.url}
                      onChange={this.onChange("url")}
                      className="form-control"
                    />
                  </div>
                  <input type="submit" value="Add" className="btn btn-primary btn-sm"/>
                </form>
            }
          </div>
        }
      </div>
    );
  }

  private async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.addLink(
        this.state.link.linkType,
        this.state.link.url,
        { from: this.props.web3.eth.accounts[0] },
      );
      this.setState((state: ILinksState): ILinksState => {
        state.isWaitingForMining = true;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }

  private onChange(prop: string): (event: React.SyntheticEvent<HTMLElement>) => void {
    if (!functions[prop]) {
      functions[prop] = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.currentTarget;
        this.setState((state: ILinksState): ILinksState => {
          state.link[prop] = input.value;
          return state;
        });
      };
    }
    return functions[prop];
  }

  private async getIds(): Promise<number[]> {
    try {
      const count = (await this.props.contractInstance.getLinkCount()).toNumber();
      return Array(count).fill(undefined).map((_, i) => i);
    } catch (err) {
      console.error(err);
    }
  }

  private async loadIds(): Promise<void> {
    try {
      const ids = await this.getIds();
      this.setState((state: ILinksState): ILinksState => {
        state.ids = ids;
        if (this.props.isOwner) {
          state.link = {
            linkType: "",
            url: "",
          };
        }
        state.isWaitingForMining = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export { Links };

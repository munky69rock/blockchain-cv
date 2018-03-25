import * as React from "react";
import * as Web3 from "web3";

import {
  IMetadata, IMunky69rockCV,
} from "../contract-interfaces/IMunky69rockCV";

// const styles = require("./Munky69rockCV.css");

interface IMetadataProps {
  web3: Web3;
  contractInstance: IMunky69rockCV;
  isOwner: boolean;
}

interface IMetadataState {
  metadata?: IMetadata;
  hasDirtyTitle: boolean;
  hasDirtyAddress: boolean;
  hasDirtyDescription: boolean;
}

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Metadata extends React.Component<IMetadataProps, IMetadataState> {

  constructor(props: IMetadataProps) {
    super(props);
    this.state = {
      hasDirtyTitle: false,
      hasDirtyAddress: false,
      hasDirtyDescription: false,
    };

    this.onSubmitMetadataAddress = this.onSubmitMetadataAddress.bind(this);
    this.onSubmitMetadataTitle = this.onSubmitMetadataTitle.bind(this);
    this.onSubmitMetadataDescription = this.onSubmitMetadataDescription.bind(this);
  }

  public async componentWillMount() {

    this.props.contractInstance.UpdatedMetadata().watch(async () => {
      console.log("metadata updated");
      await this.loadMetadata();
    });

    await this.loadMetadata();
  }

  public render() {
    if (!this.props.isOwner || !this.state.metadata) {
      return null;
    }

    return (
      <div className="container">
        <div className="container py-3 mt-3 border">
          <h3>Metadata</h3>
          <form onSubmit={this.onSubmitMetadataTitle}>
            <div className="form-group">
              <label htmlFor="metadata-title">
                Title
                {this.state.hasDirtyTitle &&
                <span className="badge badge-secondary ml-2">Not Saved</span>
                }
              </label>
              <input
                id="metadata-title"
                type="text"
                value={this.state.metadata.title}
                onChange={this.onChange("title")}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Update" className="btn btn-primary btn-sm"/>
            </div>
          </form>
          <form onSubmit={this.onSubmitMetadataAddress}>
            <div className="form-group">
              <label htmlFor="metadata-address">
                Address
                {this.state.hasDirtyAddress &&
                <span className="badge badge-secondary ml-2">Not Saved</span>
                }
              </label>
              <input
                id="metadata-address"
                type="text"
                value={this.state.metadata.address}
                onChange={this.onChange("address")}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Update" className="btn btn-primary btn-sm"/>
            </div>
          </form>
          <form onSubmit={this.onSubmitMetadataDescription}>
            <div className="form-group">
              <label htmlFor="metadata-description">
                Description
                {this.state.hasDirtyDescription &&
                <span className="badge badge-secondary ml-2">Not Saved</span>
                }
              </label>
              <textarea
                id="metadata-description"
                value={this.state.metadata.description}
                onChange={this.onChange("description")}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input type="submit" value="Update" className="btn btn-primary btn-sm"/>
            </div>
          </form>
        </div>
      </div>
    );
  }

  private async getTitle(): Promise<string> {
    try {
      return await this.props.contractInstance.getTitle();
    } catch (err) {
      console.error(err);
    }
  }

  private async getDescription(): Promise<string> {
    try {
      return await this.props.contractInstance.getDescription();
    } catch (err) {
      console.error(err);
    }
  }

  private async getAddress(): Promise<string> {
    try {
      return await this.props.contractInstance.getAddress();
    } catch (err) {
      console.error(err);
    }
  }

  private async getMetaData(): Promise<IMetadata> {
    try {
      const [title, address, description] = await Promise.all([
        this.getTitle(),
        this.getAddress(),
        this.getDescription(),
      ]);
      return {
        title,
        address,
        description,
      };
    } catch (err) {
      console.error(err);
    }
  }

  private async loadMetadata() {
    const metadata = await this.getMetaData();
    this.setState((state: IMetadataState): IMetadataState => {
      return {
        metadata,
        hasDirtyTitle: false,
        hasDirtyAddress: false,
        hasDirtyDescription: false,
      };
    });
  }

  private async onSubmitMetadataTitle(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.setTitle(this.state.metadata.title,
        { from: this.props.web3.eth.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  }

  private async onSubmitMetadataAddress(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.setAddress(this.state.metadata.address,
        { from: this.props.web3.eth.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  }

  private async onSubmitMetadataDescription(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.setDescription(this.state.metadata.description,
        { from: this.props.web3.eth.accounts[0] });
    } catch (err) {
      console.error(err);
    }
  }

  private onChange(prop: string): (event: React.SyntheticEvent<HTMLElement>) => void {
    if (!functions[prop]) {
      functions[prop] = (event: React.ChangeEvent<HTMLInputElement>): void => {
        console.log(prop);
        const input = event.currentTarget;
        this.setState((state: IMetadataState): IMetadataState => {
          state.metadata[prop] = input.value;
          switch (prop) {
            case "title":
              state.hasDirtyTitle = true;
              break;
            case "address":
              state.hasDirtyAddress = true;
              break;
            case "description":
              state.hasDirtyDescription = true;
              break;
          }
          return state;
        });
      };
    }
    return functions[prop];
  }
}

export { Metadata };

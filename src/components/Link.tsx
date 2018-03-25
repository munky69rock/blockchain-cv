import * as React from "react";

import {ILink, IListableElementProps} from "../contract-interfaces/IMunky69rockCV";

interface ILinkState {
  link?: ILink;
  isEditing: boolean;
  isDirty: boolean;
}

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Link extends React.Component<IListableElementProps, ILinkState> {
  constructor(props: IListableElementProps) {
    super(props);
    this.state = {
      isEditing: false,
      isDirty: false,
    };
    this.onEdit = this.onEdit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  public async componentWillMount() {
    await this.loadExperience();

    this.props.contractInstance.UpdatedLink().watch(async () => {
      console.log("link updated");
      await this.loadExperience();
    });
  }

  public render() {
    if (!this.state.link) {
      return null;
    }

    return (
      <div>
        {this.state.isEditing ?
          <form onSubmit={this.onSubmit} className="form-inline mb-2">
            <input
              type="text"
              value={this.state.link.linkType}
              onChange={this.onChange("linkType")}
              className="form-control mr-2"
            />
            <input
              type="text"
              value={this.state.link.url}
              onChange={this.onChange("url")}
              className="form-control"
            />
            <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-sm">Cancel</a>
            <input type="submit" value="update" className="btn btn-primary btn-sm"/>
          </form>
          :
          <p>
            <i className={`fa fa-${this.state.link.linkType} mr-2 text-center`} style={{ width: "1rem" }}/>
            <a href={this.state.link.url} target="_blank" style={{ color: "#ccc" }}>{this.state.link.url}</a>
            {this.props.isOwner && this.state.isDirty &&
              <span className="badge badge-secondary">Not Saved</span>
            }
            {this.props.isOwner &&
            <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-primary btn-sm float-right">Edit</a>
            }
          </p>
        }
      </div>
    );
  }

  private onEdit(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    this.setState((state: ILinkState): ILinkState => {
      state.isEditing = !state.isEditing;
      return state;
    });
  }

  private async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.editLink(
        this.props.id,
        this.state.link.linkType,
        this.state.link.url,
        { from: this.props.web3.eth.accounts[0] },
      );
      this.setState((state: ILinkState): ILinkState => {
        state.isEditing = false;
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
        this.setState((state: ILinkState): ILinkState => {
          state.link[prop] = input.value;
          state.isDirty = true;
          return state;
        });
      };
    }
    return functions[prop];
  }

  private async getElement(): Promise<ILink> {
    try {
      const [linkType, url] = await this.props.contractInstance.getLink(this.props.id);
      return {
        linkType,
        url,
      };
    } catch (err) {
      console.error(err);
    }
  }

  private async loadExperience(): Promise<void> {
    try {
      const element = await this.getElement();
      this.setState((state: ILinkState): ILinkState => {
        state.link = element;
        state.isDirty = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export { Link };

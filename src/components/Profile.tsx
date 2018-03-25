import * as md5 from "blueimp-md5";
import * as React from "react";
import * as Web3 from "web3";

import { IMunky69rockCV, IProfile } from "../contract-interfaces/IMunky69rockCV";

const styles = require("./Profile.css");
const commonStyles = require("./Common.css");

interface IProfileProps {
  web3: Web3;
  contractInstance: IMunky69rockCV;
  isOwner: boolean;
}

interface IProfileState {
  profile?: IProfile;
  isEditing: boolean;
}

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Profile extends React.Component<IProfileProps, IProfileState> {
  constructor(props: IProfileProps) {
    super(props);
    this.state = {
      isEditing: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  public async componentWillMount() {
    await this.loadProfile();

    this.props.contractInstance.UpdatedProfile().watch(async () => {
      console.log("profile updated");
      await this.loadProfile();
    });
  }

  public render() {
    if (!this.state.profile) {
      return null;
    }

    return (
      <div className="container pt-5 pb-3">
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <div className={styles.thumbnailWrapper}>
                <img
                  src={`https://www.gravatar.com/avatar/${md5(this.state.profile.email)}?s=300`}
                  alt={this.state.profile.name}
                  className={styles.thumbnail}
                />
              </div>
            </div>

            {this.state.isEditing ?
              <form onSubmit={this.onSubmit} className="col-sm-12 col-md-6">
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Name"
                    value={this.state.profile.name}
                    onChange={this.onChange("name")}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    placeholder="Email"
                    value={this.state.profile.email}
                    onChange={this.onChange("email")}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Title"
                    value={this.state.profile.title}
                    onChange={this.onChange("title")}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    placeholder="Location"
                    value={this.state.profile.location}
                    onChange={this.onChange("location")}
                    className="form-control"
                  />
                </div>
                <div className="form-group">
                      <textarea
                        placeholder="Description"
                        value={this.state.profile.description}
                        onChange={this.onChange("description")}
                        className="form-control"
                      />
                </div>
                <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-sm">Cancel</a>
                <input type="submit" className="btn btn-primary btn-sm" value="Update"/>
              </form>
              :
              <div
                className="col-sm-12 col-md-6"
                style={{display: "flex", flexDirection: "column", justifyContent: "center"}}
              >
                <h1 className={commonStyles.name}>{this.state.profile.name}</h1>
                <p>{this.state.profile.title}</p>
                <p>{this.state.profile.location}</p>
                <p>{this.state.profile.email}</p>
                {this.props.isOwner &&
                <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-primary btn-sm">Edit</a>
                }
              </div>
            }
          </div>
      </div>
    );
  }

  private onEdit(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    this.setState((state: IProfileState): IProfileState => {
      state.isEditing = !state.isEditing;
      return state;
    });
  }

  private async getProfile(): Promise<IProfile> {
    try {
      const [name, email, title, location, description] = await this.props.contractInstance.getProfile();
      return {
        name,
        email,
        title,
        location,
        description,
      };
    } catch (err) {
      console.error(err);
    }
  }

  private async loadProfile() {
    const profile = await this.getProfile();
    this.setState((state: IProfileState): IProfileState => {
      state.profile = profile;
      return state;
    });
  }

  private async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.editProfile(
        this.state.profile.name,
        this.state.profile.email,
        this.state.profile.title,
        this.state.profile.location,
        this.state.profile.description,
        { from: this.props.web3.eth.accounts[0] });
      this.setState((state: IProfileState): IProfileState => {
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
        this.setState((state: IProfileState): IProfileState => {
          state.profile[prop] = input.value;
          return state;
        });
      };
    }
    return functions[prop];
  }
}

export { Profile };

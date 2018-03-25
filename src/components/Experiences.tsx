import * as React from "react";

import {IExperience, IListableWrapperProps} from "../contract-interfaces/IMunky69rockCV";
import { Experience } from "./Experience";

const styles = require("./Common.css");

interface IExperiencesState {
  ids?: number[];
  isWaitingForMining: boolean;
  experience?: IExperience;
}

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Experiences extends React.Component<IListableWrapperProps, IExperiencesState> {
  constructor(props: IListableWrapperProps) {
    super(props);
    if (props.isOwner) {
      this.state = {
        isWaitingForMining: false,
        experience: {
          name: "",
          role: "",
          startedOn: "",
          endedOn: "",
          description: "",
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

    this.props.contractInstance.UpdatedExperience().watch(async () => {
      console.log("experience updated");
      await this.loadIds();
    });
  }

  public render() {
    if (!this.state.ids) {
      return null;
    }

    return (
      <div className="py-3">
        <h2 className={styles.name}>WORK EXPERIENCES</h2>
        {this.state.ids.map((id) => {
          return <Experience
            web3={this.props.web3}
            contractInstance={this.props.contractInstance}
            isOwner={this.props.isOwner}
            id={id}
            key={id}
          />;
        })}

        {this.props.isOwner &&
          <div className="container border py-3 my-3">
            {this.state.isWaitingForMining ?
                <div>
                  <p className="text-muted">{this.state.experience.name}</p>
                  <p className="text-muted">{this.state.experience.role}</p>
                  <p className="text-muted">{this.state.experience.startedOn}</p>
                  <p className="text-muted">{this.state.experience.endedOn}</p>
                  <p className="text-muted">{this.state.experience.description}</p>
                </div>
                :
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Name"
                      value={this.state.experience.name}
                      onChange={this.onChange("name")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="text"
                      placeholder="Role"
                      value={this.state.experience.role}
                      onChange={this.onChange("role")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      placeholder="Start Date"
                      value={this.state.experience.startedOn}
                      onChange={this.onChange("startedOn")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      type="date"
                      placeholder="End Date"
                      value={this.state.experience.endedOn}
                      onChange={this.onChange("endedOn")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Description"
                      value={this.state.experience.description}
                      onChange={this.onChange("description")}
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
      await this.props.contractInstance.addExperience(
        this.state.experience.name,
        this.state.experience.role,
        this.state.experience.startedOn,
        this.state.experience.endedOn,
        this.state.experience.description,
        { from: this.props.web3.eth.accounts[0] },
      );
      this.setState((state: IExperiencesState): IExperiencesState => {
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
        this.setState((state: IExperiencesState): IExperiencesState => {
          state.experience[prop] = input.value;
          return state;
        });
      };
    }
    return functions[prop];
  }

  private async getIds(): Promise<number[]> {
    try {
      const count = (await this.props.contractInstance.getExperienceCount()).toNumber();
      return Array(count).fill(undefined).map((_, i) => i);
    } catch (err) {
      console.error(err);
    }
  }

  private async loadIds(): Promise<void> {
    try {
      const ids = await this.getIds();
      this.setState((state: IExperiencesState): IExperiencesState => {
        state.ids = ids;
        state.isWaitingForMining = false;
        if (this.props.isOwner) {
          state.experience = {
            name: "",
            role: "",
            startedOn: "",
            endedOn: "",
            description: "",
          };
        }
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export { Experiences };

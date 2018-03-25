import * as React from "react";

import {IEducation, IListableWrapperProps} from "../contract-interfaces/IMunky69rockCV";
import { Education } from "./Education";

interface IEducationsState {
  ids?: number[];
  isWaitingForMining: boolean;
  education?: IEducation;
}

const styles = require("./Common.css");

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Educations extends React.Component<IListableWrapperProps, IEducationsState> {
  constructor(props: IListableWrapperProps) {
    super(props);
    if (props.isOwner) {
      this.state = {
        isWaitingForMining: false,
        education: {
          name: "",
          fieldOfStudy: "",
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

    this.props.contractInstance.UpdatedEducation().watch(async () => {
      console.log("education updated");
      await this.loadIds();
    });
  }

  public render() {
    if (!this.state.ids) {
      return null;
    }

    return (
      <div className="py-3">
        <h2 className={styles.name}>EDUCATIONS</h2>
        {this.state.ids.map((id) => {
          return <Education
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
                  <span className="badge badge-secondary ml-2">Waiting for mining...</span>
                  <p className="text-muted">{this.state.education.name}</p>
                  <p className="text-muted">{this.state.education.fieldOfStudy}</p>
                  <p className="text-muted">{this.state.education.startedOn}</p>
                  <p className="text-muted">{this.state.education.endedOn}</p>
                  <p className="text-muted">{this.state.education.description}</p>
                </div>
                :
                <form onSubmit={this.onSubmit}>
                  <div className="form-group">
                    <input
                      placeholder="Name"
                      type="text"
                      value={this.state.education.name}
                      onChange={this.onChange("name")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      placeholder="Field Of Study"
                      type="text"
                      value={this.state.education.fieldOfStudy}
                      onChange={this.onChange("fieldOfStudy")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      placeholder="Start Date"
                      type="date"
                      value={this.state.education.startedOn}
                      onChange={this.onChange("startedOn")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <input
                      placeholder="End Date"
                      type="date"
                      value={this.state.education.endedOn}
                      onChange={this.onChange("endedOn")}
                      className="form-control"
                    />
                  </div>
                  <div className="form-group">
                    <textarea
                      placeholder="Description"
                      value={this.state.education.description}
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
      await this.props.contractInstance.addEducation(
        this.state.education.name,
        this.state.education.fieldOfStudy,
        this.state.education.startedOn,
        this.state.education.endedOn,
        this.state.education.description,
        { from: this.props.web3.eth.accounts[0] },
      );
      this.setState((state: IEducationsState): IEducationsState => {
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
        this.setState((state: IEducationsState): IEducationsState => {
          state.education[prop] = input.value;
          return state;
        });
      };
    }
    return functions[prop];
  }

  private async getIds(): Promise<number[]> {
    try {
      const count = (await this.props.contractInstance.getEducationCount()).toNumber();
      return Array(count).fill(undefined).map((_, i) => i);
    } catch (err) {
      console.error(err);
    }
  }

  private async loadIds(): Promise<void> {
    try {
      const ids = await this.getIds();
      this.setState((state: IEducationsState): IEducationsState => {
        state.ids = ids;
        state.isWaitingForMining = false;
        if (this.props.isOwner) {
          state.education = {
            name: "",
            fieldOfStudy: "",
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

export { Educations };

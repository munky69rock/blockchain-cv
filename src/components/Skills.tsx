import * as React from "react";

import {IListableWrapperProps} from "../contract-interfaces/IMunky69rockCV";
import {Skill} from "./Skill";

const styles = require("./Skills.css");
const commonStyles = require("./Common.css");

interface ISkillsState {
  ids?: number[];
  isWaitingForMining: boolean;
  skill?: string;
}

class Skills extends React.Component<IListableWrapperProps, ISkillsState> {
  constructor(props: IListableWrapperProps) {
    super(props);
    this.state = {
      isWaitingForMining: false,
    };
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  public async componentWillMount() {
    await this.loadIds();

    this.props.contractInstance.UpdatedSkill().watch(async () => {
      console.log("skill updated");
      await this.loadIds();
    });
  }

  public render() {
    if (!this.state.ids) {
      return null;
    }

    return (
      <div className="py-3">
        <h2 className={commonStyles.name}>SKILLS</h2>

        <div className={styles.skillsWrapper}>
          {this.state.ids.map((id) => {
            return <Skill
              web3={this.props.web3}
              contractInstance={this.props.contractInstance}
              isOwner={this.props.isOwner}
              id={id}
              key={id}
            />;
          })}
        </div>

        {this.props.isOwner &&
          <div className="container border py-3">
            {this.state.isWaitingForMining ?
              <div>
                <span className="text-muted">{this.state.skill}</span>
                <span className="badge badge-secondary ml-2">Waiting for mining...</span>
              </div>
              :
              <form onSubmit={this.onSubmit}>
                <div className="form-group">
                  <input
                    placeholder="Skill"
                    type="text"
                    value={this.state.skill}
                    onChange={this.onChange}
                    className="form-control"
                  />
                </div>
                <input
                  type="submit"
                  value="Add"
                  className="btn btn-primary btn-sm"
                />
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
      await this.props.contractInstance.addSkill(
        this.state.skill,
        { from: this.props.web3.eth.accounts[0] },
      );
      this.setState((state: ISkillsState): ISkillsState => {
        state.isWaitingForMining = true;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }

  private onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    this.setState((state: ISkillsState): ISkillsState => {
      state.skill = input.value;
      return state;
    });
  }

  private async getIds(): Promise<number[]> {
    try {
      const count = (await this.props.contractInstance.getSkillCount()).toNumber();
      return Array(count).fill(undefined).map((_, i) => i);
    } catch (err) {
      console.error(err);
    }
  }

  private async loadIds(): Promise<void> {
    try {
      const ids = await this.getIds();
      this.setState((state: ISkillsState): ISkillsState => {
        state.ids = ids;
        state.skill = "";
        state.isWaitingForMining = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export { Skills };

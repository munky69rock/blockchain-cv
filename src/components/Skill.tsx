import * as React from "react";

import {IListableElementProps} from "../contract-interfaces/IMunky69rockCV";

const styles = require("./Skill.css");

interface ISkillState {
  skill?: { value: string };
  isEditing: boolean;
  isDirty: boolean;
}

class Skill extends React.Component<IListableElementProps, ISkillState> {
  constructor(props: IListableElementProps) {
    super(props);
    this.state = {
      isEditing: false,
      isDirty: false,
    };
    this.onEdit = this.onEdit.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  public async componentWillMount() {
    await this.loadElement();

    this.props.contractInstance.UpdatedSkill().watch(async () => {
      console.log("skill updated");
      await this.loadElement();
    });
  }

  public render() {
    if (!this.state.skill) {
      return null;
    }

    if (this.state.isEditing) {
      return (
        <form onSubmit={this.onSubmit} className="p-3 border">
          <input type="text" value={this.state.skill.value} onChange={this.onChange} className="form-control"/>
          <div className="mt-3">
            {this.props.isOwner &&
            <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-sm">Cancel</a>
            }
            <input type="submit" value="update" className="btn btn-primary btn-sm"/>
          </div>
        </form>
      );
    }

    return (
      <div className={styles.skill}>
            {this.state.skill.value}
        {this.props.isOwner && this.state.isDirty &&
        <span className="badge badge-secondary ml-2">Not Saved</span>
        }
        {this.props.isOwner &&
        <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-primary btn-sm ml-2">Edit</a>
        }
      </div>
    );
  }

  private onEdit(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    this.setState((state: ISkillState): ISkillState => {
      state.isEditing = !state.isEditing;
      return state;
    });
  }

  private async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.editSkill(
        this.props.id,
        this.state.skill.value,
        { from: this.props.web3.eth.accounts[0] },
      );
      this.setState((state: ISkillState): ISkillState => {
        state.isEditing = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }

  private onChange(event: React.ChangeEvent<HTMLInputElement>) {
    const input = event.currentTarget;
    this.setState((state: ISkillState): ISkillState => {
      state.skill = { value: input.value };
      state.isDirty = true;
      return state;
    });
  }

  private async getElement(): Promise<string> {
    try {
      return await this.props.contractInstance.getSkill(this.props.id);
    } catch (err) {
      console.error(err);
    }
  }

  private async loadElement(): Promise<void> {
    try {
      const element = await this.getElement();
      this.setState((state: ISkillState): ISkillState => {
        state.skill = { value: element };
        state.isDirty = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export { Skill };

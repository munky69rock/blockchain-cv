import * as React from "react";

import {IExperience, IListableElementProps} from "../contract-interfaces/IMunky69rockCV";

interface IExperienceState {
  experience?: IExperience;
  isEditing: boolean;
  isDirty: boolean;
}

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Experience extends React.Component<IListableElementProps, IExperienceState> {
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
    await this.loadElement();

    this.props.contractInstance.UpdatedExperience().watch(async () => {
      console.log("experience updated");
      await this.loadElement();
    });
  }

  public render() {
    if (!this.state.experience) {
      return null;
    }

    return (
      <div>
        {this.state.isEditing ?
          <form onSubmit={this.onSubmit} className="container border py-3 my-3">
            <div className="form-group">
              <input
                placeholder="Name"
                type="text"
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
            <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-sm">Cancel</a>
            <input type="submit" value="update" className="btn btn-primary btn-sm"/>
          </form>
        : <div>
            <h3>{this.state.experience.name}</h3>
            <p>{this.state.experience.role}</p>
            <p>
              {this.state.experience.startedOn}
              <i className="fa fa-caret-right mx-2"/>
              {this.state.experience.endedOn}
              </p>
            {this.props.isOwner &&
              <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-primary btn-sm">Edit</a>
            }
          </div>
        }
      </div>
    );
  }

  private onEdit(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    this.setState((state: IExperienceState): IExperienceState => {
      state.isEditing = !state.isEditing;
      return state;
    });
  }

  private async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.editExperience(
        this.props.id,
        this.state.experience.name,
        this.state.experience.role,
        this.state.experience.startedOn,
        this.state.experience.endedOn,
        this.state.experience.description,
        { from: this.props.web3.eth.accounts[0] });
      this.setState((state: IExperienceState): IExperienceState => {
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
        this.setState((state: IExperienceState): IExperienceState => {
          state.experience[prop] = input.value;
          return state;
        });
      };
    }
    return functions[prop];
  }

  private async getElement(): Promise<IExperience> {
    try {
      const [name, role, startedOn, endedOn, description] =
        await this.props.contractInstance.getExperience(this.props.id);
      return {
        name,
        role,
        startedOn,
        endedOn,
        description,
      };
    } catch (err) {
      console.error(err);
    }
  }

  private async loadElement(): Promise<void> {
    try {
      const element = await this.getElement();
      this.setState((state: IExperienceState): IExperienceState => {
        state.experience = element;
        state.isDirty = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export { Experience };

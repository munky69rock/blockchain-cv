import * as React from "react";

import {IEducation, IListableElementProps} from "../contract-interfaces/IMunky69rockCV";

interface IEducationState {
  education?: IEducation;
  isEditing: boolean;
  isDirty: boolean;
}

const functions: { [key: string]: (event: React.SyntheticEvent<HTMLElement>) => void } = {};

class Education extends React.Component<IListableElementProps, IEducationState> {
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

    this.props.contractInstance.UpdatedEducation().watch(async () => {
      console.log("education updated");
      await this.loadElement();
    });
  }

  public render() {
    if (!this.state.education) {
      return null;
    }

    return (
      <div>
        {this.state.isEditing ?
          <form onSubmit={this.onSubmit} className="container border py-3 my-3">
            <div className="form-group">
              <input
                type="text"
                placeholder="Name"
                value={this.state.education.name}
                onChange={this.onChange("name")}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                placeholder="Field Of Study"
                value={this.state.education.fieldOfStudy}
                onChange={this.onChange("fieldOfStudy")}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="Start Date"
                value={this.state.education.startedOn}
                onChange={this.onChange("startedOn")}
                className="form-control"
              />
            </div>
            <div className="form-group">
              <input
                type="date"
                placeholder="End Date"
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
            <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-sm">Cancel</a>
            <input type="submit" value="update" className="btn btn-primary btn-sm"/>
          </form>
          :
          <div>
            <h3>{this.state.education.name}</h3>
            <p>{this.state.education.fieldOfStudy}</p>
            <p>
              {this.state.education.startedOn}
              <i className="fa fa-caret-right mx-2"/>
              {this.state.education.endedOn}
            </p>
            {this.props.isOwner &&
            <a href="javascript:void(0);" onClick={this.onEdit} className="btn btn-primary btn-sm">Edit</a>
            }
            {this.props.isOwner && this.state.isDirty &&
            <span className="badge badge-secondary">Not Saved</span>
            }
          </div>
        }
      </div>
    );
  }

  private onEdit(event: React.MouseEvent<HTMLAnchorElement>) {
    event.preventDefault();
    this.setState((state: IEducationState): IEducationState => {
      state.isEditing = !state.isEditing;
      return state;
    });
  }

  private onChange(prop: string): (event: React.SyntheticEvent<HTMLElement>) => void {
    if (!functions[prop]) {
      functions[prop] = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const input = event.currentTarget;
        this.setState((state: IEducationState): IEducationState => {
          state.education[prop] = input.value;
          state.isDirty = true;
          return state;
        });
      };
    }
    return functions[prop];
  }

  private async onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      await this.props.contractInstance.editEducation(
        this.props.id,
        this.state.education.name,
        this.state.education.fieldOfStudy,
        this.state.education.startedOn,
        this.state.education.endedOn,
        this.state.education.description,
        { from: this.props.web3.eth.accounts[0] });
      this.setState((state: IEducationState): IEducationState => {
        state.isEditing = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }

  private async getElement(): Promise<IEducation> {
    try {
      const [name, fieldOfStudy, startedOn, endedOn, description] =
        await this.props.contractInstance.getEducation(this.props.id);
      return {
        name,
        fieldOfStudy,
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
      this.setState((state: IEducationState): IEducationState => {
        state.education = element;
        state.isDirty = false;
        return state;
      });
    } catch (err) {
      console.error(err);
    }
  }
}

export { Education };

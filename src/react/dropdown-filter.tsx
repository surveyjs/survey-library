import * as React from "react";
import { DropdownListModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SurveyElementBase } from "./reactquestion_element";
import { Helpers } from "../helpers";

interface IDropdownFilterProps {
  model: DropdownListModel;
  cssClasses: any;
  id: string;
}

export class DropdownFilter extends SurveyElementBase<IDropdownFilterProps, any> {
  inputElement: HTMLInputElement | null;

  get model(): DropdownListModel {
    return this.props.model;
  }
  get cssClasses(): any {
    return this.props.cssClasses;
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateDomElement();
  }
  componentDidMount() {
    super.componentDidMount();
    this.updateDomElement();
  }
  updateDomElement() {
    if (!!this.inputElement) {
      const control: any = this.inputElement;
      const newValue = this.model.filterString;
      if (!Helpers.isTwoValueEquals(newValue, control.value)) {
        control.value = this.model.filterString;
      }
    }
  }
  onChange (e: any) {
    if (e.target === document.activeElement) {
      this.model.filterString = e.target.value;
    }
  }
  onKeyUp (e: any) {
    this.model.inputKeyUpHandler(e);
  }

  constructor(props: any) {
    super(props);
  }
  getStateElement() {
    return this.model;
  }
  render(): JSX.Element {
    if(!this.model.searchEnabled) return null;

    return (<input type="text"
      id={this.props.id}
      ref={(element) => (this.inputElement = element)}
      className={ this.cssClasses.filterStringInput }
      size={ !this.model.filterString ? 1 : undefined }
      onKeyUp={(e) => { this.onKeyUp(e); }}
      onChange={(e) => { this.onChange(e); }}
    ></input>);
  }
}

ReactQuestionFactory.Instance.registerQuestion("sv-dropdown-filter", (props) => {
  return React.createElement(DropdownFilter, props);
});
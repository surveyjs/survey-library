import { SurveyQuestionElementBase } from "./reactquestion_element";
import React from "react";
import { ReactElementFactory } from "./element-factory";
import { SurveyElementBase } from "./reactquestion_element";
import { SvgIcon } from "./components/svg-icon/svg-icon";
import {
  QuestionButtonGroupModel,
  ButtonGroupItemValue,
  ButtonGroupItemModel,
} from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionButtonGroup extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionButtonGroupModel {
    return this.questionBase as QuestionButtonGroupModel;
  }
  getStateElement() {
    return this.question;
  }
  renderElement() {
    const items = this.renderItems();
    return <div className={this.question.cssClasses.root}>{items}</div>;
  }
  renderItems() {
    return this.question.visibleChoices.map(
      (item: ButtonGroupItemValue, index: number) => {
        return (
          <SurveyButtonGroupItem
            key={this.question.inputId + "_" + index}
            item={item}
            question={this.question}
            index={index}
          ></SurveyButtonGroupItem>
        );
      }
    );
  }
}

export class SurveyButtonGroupItem extends SurveyElementBase<any, any> {
  public model: ButtonGroupItemModel;
  constructor(props: any) {
    super(props);
  }
  get index(): number {
    return this.props.index;
  }
  get question(): QuestionButtonGroupModel {
    return this.props.question;
  }
  get item(): ButtonGroupItemValue {
    return this.props.item;
  }
  getStateElement() {
    return this.item;
  }
  public renderElement() {
    this.model = new ButtonGroupItemModel(this.question, this.item, this.index);
    const icon = this.renderIcon();
    const input = this.renderInput();
    const caption = this.renderCaption();
    return (
      <label
        role="radio"
        className={this.model.css.label}
        title={this.model.caption.renderedHtml}
      >
        {input}
        <div className={this.model.css.decorator}>
          {icon}
          {caption}
        </div>
      </label>
    );
  }
  protected renderIcon() {
    if (!!this.model.iconName) {
      return (
        <SvgIcon
          className={this.model.css.icon}
          iconName={this.model.iconName}
          size={this.model.iconSize || 24}
        ></SvgIcon>
      );
    }
    return null;
  }
  protected renderInput() {
    return (
      <input
        className={this.model.css.control}
        id={this.model.id}
        type="radio"
        name={this.model.name}
        checked={this.model.selected}
        value={this.model.value}
        disabled={this.model.readOnly}
        onChange={() => {
          this.model.onChange();
        }}
        aria-required={this.model.isRequired}
        aria-label={this.model.caption.renderedHtml}
        aria-invalid={this.model.hasErrors}
        aria-errormessage={this.model.describedBy}
        role="radio"
      />
    );
  }
  protected renderCaption() {
    if (!this.model.showCaption) return null;
    let caption = this.renderLocString(this.model.caption);
    return (
      <span
        className={this.model.css.caption}
        title={this.model.caption.renderedHtml}
      >
        {caption}
      </span>
    );
  }
}

// ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
//   return React.createElement(SurveyQuestionButtonGroup, props);
// });

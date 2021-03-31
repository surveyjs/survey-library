import React from "react";
import { ReactElementFactory } from "../../element-factory";
import { SurveyElementBase } from "../../reactquestion_element";
import { SvgIcon } from "../svg-icon/svg-icon";
import { ButtonGroupItemModel } from "survey-core";

export class SurveyButtonGroupItem extends SurveyElementBase<any, any> {
  constructor(props: any) {
    super(props);
  }
  protected get model(): ButtonGroupItemModel {
    return this.props.model;
  }
  public render() {
    const icon = this.renderIcon();
    const input = this.renderInput();
    const caption = this.renderCaption();
    return (
      <label
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
        aria-describedby={this.model.describedBy}
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

ReactElementFactory.Instance.registerElement(
  "sv-button-group-item",
  (props) => {
    return React.createElement(SurveyButtonGroupItem, props);
  }
);

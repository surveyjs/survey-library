import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionImagePickerModel } from "../question_imagepicker";
import { ItemValue } from "../itemvalue";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionImagePicker extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.state = { choicesChanged: 0 };
    var self = this;
    this.question.choicesChangedCallback = function() {
      self.setState({ choicesChanged: self.state.choicesChanged + 1 });
    };
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected get question(): QuestionImagePickerModel {
    return this.questionBase as QuestionImagePickerModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  handleOnChange(event: any) {
    if (this.question.multiSelect) {
      if (event.target.checked) {
        this.question.value = this.question.value.concat(event.target.value);
      } else {
        var currValue = this.question.value;
        currValue.splice(this.question.value.indexOf(event.target.value), 1);
        this.question.value = currValue;
      }
    } else {
      this.question.value = event.target.value;
    }
    this.setState({ value: this.question.value });
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    return (
      <fieldset className={cssClasses.root}>
        {this.getItems(cssClasses)}
        <legend style={{ display: "none" }}>
          {this.question.locTitle.renderedHtml}
        </legend>
      </fieldset>
    );
  }
  protected getItems(cssClasses: any): Array<any> {
    var items = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = "item" + i;
      items.push(this.renderItem(key, item, i === 0, cssClasses));
    }
    return items;
  }
  protected get textStyle(): any {
    return { marginLeft: "3px", display: "inline", position: "static" };
  }
  private renderItem(
    key: string,
    item: ItemValue,
    isFirst: boolean,
    cssClasses: any
  ): JSX.Element {
    var isChecked = this.question.value === item.value;
    if (this.question.multiSelect) {
      isChecked = this.question.value.indexOf(item.value) !== -1;
    }
    return this.renderElement(key, item, isChecked, isFirst, cssClasses);
  }
  protected renderElement(
    key: string,
    item: ItemValue,
    isChecked: boolean,
    isFirst: boolean,
    cssClasses: any
  ): JSX.Element {
    var id = isFirst ? this.question.inputId : null;
    let itemClass =
      cssClasses.item +
      (this.question.colCount === 0
        ? " sv_q_imagepicker_inline"
        : " sv-q-col-" + this.question.colCount);

    if (isChecked) itemClass += " checked";
    var text = null;
    if (this.question.showLabel) {
      text = (
        <span
          title={item.text || item.value}
          className={this.question.cssClasses.itemText}
        >
          {item.text || item.value}
        </span>
      );
    }

    var style: any = { objectFit: this.question.imageFit };

    var control = null;
    if (this.question.contentMode === "image") {
      control = (
        <img
          className={cssClasses.image}
          src={item["imageLink"]}
          width={
            this.question.imageWidth
              ? this.question.imageWidth + "px"
              : undefined
          }
          height={
            this.question.imageHeight
              ? this.question.imageHeight + "px"
              : undefined
          }
          style={style}
        />
      );
    }
    if (this.question.contentMode === "video") {
      control = (
        <embed
          className={cssClasses.image}
          src={item["imageLink"]}
          width={
            this.question.imageWidth
              ? this.question.imageWidth + "px"
              : undefined
          }
          height={
            this.question.imageHeight
              ? this.question.imageHeight + "px"
              : undefined
          }
          style={style}
        />
      );
    }

    return (
      <div key={key} className={itemClass}>
        <label className={cssClasses.label}>
          <input
            style={{ display: "none" }}
            className={cssClasses.itemControl}
            id={id}
            type={this.question.multiSelect ? "checkbox" : "radio"}
            name={this.question.name + "_" + this.questionBase.id}
            checked={isChecked}
            value={item.value}
            disabled={this.isDisplayMode}
            onChange={this.handleOnChange}
            aria-label={this.question.locTitle.renderedHtml}
          />
          <div>
            {control}
            {text}
          </div>
        </label>
      </div>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("imagepicker", props => {
  return React.createElement(SurveyQuestionImagePicker, props);
});

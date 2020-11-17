import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionImagePickerModel } from "../question_imagepicker";
import { ItemValue } from "../itemvalue";
import { ReactQuestionFactory } from "./reactquestion_factory";

export class SurveyQuestionImagePicker extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected get question(): QuestionImagePickerModel {
    return this.questionBase as QuestionImagePickerModel;
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
  protected renderElement(): JSX.Element {
    var cssClasses = this.question.cssClasses;
    return (
      <fieldset className={cssClasses.root}>
        <legend aria-label={this.question.locTitle.renderedHtml} />
        {this.getItems(cssClasses)}
      </fieldset>
    );
  }
  protected getItems(cssClasses: any): Array<any> {
    var items = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = "item" + i;
      items.push(this.renderItem(key, item, cssClasses));
    }
    return items;
  }
  protected get textStyle(): any {
    return { marginLeft: "3px", display: "inline", position: "static" };
  }
  protected renderItem(
    key: string,
    item: ItemValue,
    cssClasses: any
  ): JSX.Element {
    var isChecked = this.question.isItemSelected(item);
    var id = this.question.inputId + "_" + item.value;
    var itemClass = this.question.getItemClass(item);
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
          alt={item.text || item.value}
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
            disabled={this.isDisplayMode || !item.isEnabled}
            onChange={this.handleOnChange}
            aria-label={this.question.locTitle.renderedHtml}
            aria-invalid={this.question.errors.length > 0}
            aria-describedby={
              this.question.errors.length > 0
                ? this.question.id + "_errors"
                : null
            }
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

ReactQuestionFactory.Instance.registerQuestion("imagepicker", (props) => {
  return React.createElement(SurveyQuestionImagePicker, props);
});

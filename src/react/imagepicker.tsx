import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestionelement";
import { QuestionImagePickerModel } from "../question_imagepicker";
import { ItemValue } from "../itemvalue";
import { ReactQuestionFactory } from "./reactquestionfactory";

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
  render(): JSX.Element {
    if (!this.question) return null;
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
    var isChecked = this.question.isItemSelected(item);
    var isDisabled = this.question.isReadOnly || !item.isEnabled;
    return this.renderElement(
      key,
      item,
      isChecked,
      isDisabled,
      isFirst,
      cssClasses
    );
  }
  private getItemClass(isChecked: boolean, isDisabled: boolean) {
    var cssClasses = this.question.cssClasses;
    var colCount = this.question.colCount;
    var itemClass =
      cssClasses.item +
      (colCount === 0 ? " " + cssClasses.itemInline : " sv-q-col-" + colCount);
    var allowHover = !isChecked && !isDisabled;
    if (isChecked) {
      itemClass += " " + cssClasses.itemChecked;
    }
    if (isDisabled) {
      itemClass += " " + cssClasses.itemDisabled;
    }
    if (allowHover) {
      itemClass += " " + cssClasses.itemHover;
    }
    return itemClass;
  }
  protected renderElement(
    key: string,
    item: ItemValue,
    isChecked: boolean,
    isDisabled: boolean,
    isFirst: boolean,
    cssClasses: any
  ): JSX.Element {
    var id = this.question.inputId + "_" + item.value;
    var itemClass = this.getItemClass(isChecked, isDisabled);
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
            aria-describedby={this.question.errors.length > 0 ? this.question.id + '_errors' : null}    
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

import * as React from "react";
import { SurveyElementBase, SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionImagePickerModel } from "survey-core";
import { ItemValue } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyModel } from "./reactsurveymodel";

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
        <legend
          role="radio"
          aria-label={this.question.locTitle.renderedHtml} />
        {this.getItems(cssClasses)}
      </fieldset>
    );
  }
  protected getItems(cssClasses: any): Array<any> {
    var items = [];
    for (var i = 0; i < this.question.visibleChoices.length; i++) {
      var item = this.question.visibleChoices[i];
      var key = this.question.name + "-" + item.value;
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
    var itemClass = this.question.getItemClass(item);
    var text = null;
    if (this.question.showLabel) {
      text = (
        <span
          title={item.locText.renderedHtml}
          className={this.question.cssClasses.itemText}
        >
          {item.text ? SurveyElementBase.renderLocString(item.locText) : item.value}
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
          width={ this.question.renderedImageWidth }
          height={ this.question.renderedImageHeight }
          alt={item.locText.renderedHtml}
          style={style}
        />
      );
    }
    if (this.question.contentMode === "video") {
      control = (
        <video controls
          className={cssClasses.image}
          src={item["imageLink"]}
          width={ this.question.renderedImageWidth }
          height={ this.question.renderedImageHeight }
          style={style}
        ></video>
      );
    }

    const renderedItem = (
      <div key={key} className={itemClass}>
        <label className={cssClasses.label}>
          <input
            style={{ display: "none" }}
            className={cssClasses.itemControl}
            id={this.question.getItemId(item)}
            type={this.question.inputType}
            name={this.question.questionName}
            checked={isChecked}
            value={item.value}
            disabled={!this.question.getItemEnabled(item)}
            onChange={this.handleOnChange}
            aria-required={this.question.ariaRequired}
            aria-label={this.question.ariaLabel}
            aria-invalid={this.question.ariaInvalid}
            aria-describedby={this.question.ariaDescribedBy}
          />
          <div className={this.question.cssClasses.itemDecorator}>
            <div className={this.question.cssClasses.imageContainer}>
              {control}
            </div>
            {text}
          </div>
        </label>
      </div>
    );
    const survey = this.question.survey as ReactSurveyModel;
    let wrappedItem = null;
    if(!!survey) {
      wrappedItem = survey.wrapItemValue(renderedItem, this.question, item);
    }
    return wrappedItem ?? renderedItem;
  }
}

ReactQuestionFactory.Instance.registerQuestion("imagepicker", (props) => {
  return React.createElement(SurveyQuestionImagePicker, props);
});

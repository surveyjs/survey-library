import * as React from "react";
import { ReactSurveyElement, SurveyElementBase, SurveyQuestionElementBase } from "./reactquestion_element";
import { QuestionImagePickerModel } from "survey-core";
import { ItemValue, SurveyModel } from "survey-core";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactSurveyElementsWrapper } from "./reactsurveymodel";

export class SurveyQuestionImagePicker extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
  }
  protected get question(): QuestionImagePickerModel {
    return this.questionBase as QuestionImagePickerModel;
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
    const renderedItem = <SurveyQuestionImagePickerItem key={key} question={this.question} item={item} cssClasses={cssClasses}></SurveyQuestionImagePickerItem>;
    const survey = this.question.survey as SurveyModel;
    let wrappedItem = null;
    if(!!survey) {
      wrappedItem = ReactSurveyElementsWrapper.wrapItemValue(survey, renderedItem, this.question, item);
    }
    return wrappedItem ?? renderedItem;
  }
}
export class SurveyQuestionImagePickerItem extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.handleOnChange = this.handleOnChange.bind(this);
  }
  protected getStateElement() {
    return this.item;
  }
  componentDidMount() {
    super.componentDidMount();
    this.reactOnStrChanged();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.item.locImageLink.onChanged = function () {};
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.reactOnStrChanged();
  }
  private reactOnStrChanged() {
    this.item.locImageLink.onChanged = () => {
      this.setState({ locImageLinkchanged: !!this.state && this.state.locImageLink ? this.state.locImageLink + 1 : 1 });
    };
  }
  protected get cssClasses() {
    return this.props.cssClasses;
  }

  protected get item() {
    return this.props.item;
  }

  protected get question() {
    return this.props.question;
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
    const item = this.item;
    const question = this.question;
    const cssClasses = this.cssClasses;
    var isChecked = question.isItemSelected(item);
    var itemClass = question.getItemClass(item);
    var text = null;
    if (question.showLabel) {
      text = (
        <span
          className={question.cssClasses.itemText}
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
          src={item.locImageLink.renderedHtml}
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
          src={item.locImageLink.renderedHtml}
          width={ this.question.renderedImageWidth }
          height={ this.question.renderedImageHeight }
          style={style}
        ></video>
      );
    }

    const renderedItem = (
      <div className={itemClass}>
        <label className={cssClasses.label}>
          <input
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
    return renderedItem;
  }
}

ReactQuestionFactory.Instance.registerQuestion("imagepicker", (props) => {
  return React.createElement(SurveyQuestionImagePicker, props);
});

import * as React from "react";
import { Question } from "../question";
import { SurveyElement, SurveyError, Base } from "../base";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { SurveyElementBase, ReactSurveyElement } from "./reactquestionelement";
import { SurveyCustomWidget } from "./custom-widget";
import { ReactElementFactory } from "./element-factory";

export interface ISurveyCreator {
  createQuestionElement(question: Question): JSX.Element;
  renderError(key: string, error: SurveyError, cssClasses: any): JSX.Element;
  questionTitleLocation(): string;
  questionErrorLocation(): string;
}

export class SurveyQuestion extends SurveyElementBase {
  public static renderQuestionBody(
    creator: ISurveyCreator,
    question: Question
  ): JSX.Element {
    if (!question.visible) return null;
    var customWidget = question.customWidget;
    if (!customWidget) {
      return creator.createQuestionElement(question);
    }
    return <SurveyCustomWidget creator={creator} question={question} />;
  }
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.question;
  }
  protected get question(): Question {
    return this.props.element;
  }
  private get creator(): ISurveyCreator {
    return this.props.creator;
  }
  componentDidMount() {
    super.componentDidMount();
    if (!!this.question) {
      this.question["react"] = this;
    }
    this.doAfterRender();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (!!this.question) {
      this.question["react"] = null;
    }
    var el: any = this.refs["root"];
    if (!!el) {
      el.removeAttribute("data-rendered");
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.doAfterRender();
  }
  private doAfterRender() {
    if (this.question) {
      var el: any = this.refs["root"];
      if (el && el.getAttribute("data-rendered") !== "r") {
        el.setAttribute("data-rendered", "r");
        el.setAttribute("name", this.question.name);
        this.question.afterRender(el);
      }
    }
  }
  render(): JSX.Element {
    var question = this.question;

    if (!question || !this.creator) return null;
    if (!question.isVisible) return null;
    var cssClasses = question.cssClasses;
    var questionRender = this.renderQuestion();
    var header = this.renderHeader(question);
    var headerTop = question.hasTitleOnLeftTop ? header : null;
    var headerBottom = question.hasTitleOnBottom ? header : null;
    var descriptionUnderInput = question.hasDescriptionUnderInput
      ? this.renderDescription(cssClasses, true)
      : null;
    let questionRootClass = question.cssRoot;

    var comment =
      question && question.hasComment ? this.renderComment(cssClasses) : null;
    var errorsTop =
      this.creator.questionErrorLocation() === "top"
        ? this.renderErrors(cssClasses, "top")
        : null;
    var errorsBottom =
      this.creator.questionErrorLocation() === "bottom"
        ? this.renderErrors(cssClasses, "bottom")
        : null;
    let rootStyle: { [index: string]: any } = {};
    if (question.renderWidth) {
      rootStyle["width"] = question.renderWidth;
      rootStyle["flexGrow"] = 1;
      rootStyle["flexShrink"] = 1;
      rootStyle["flexBasis"] = question.renderWidth;
      rootStyle["minWidth"] = question.minWidth;
      rootStyle["maxWidth"] = question.maxWidth;
    }
    if (!!question.paddingLeft) rootStyle["paddingLeft"] = question.paddingLeft;
    if (!!question.paddingRight)
      rootStyle["paddingRight"] = question.paddingRight;

    if (question.isReadOnly) {
      questionRootClass += " " + cssClasses.disabled;
    }

    return (
      <div
        ref="root"
        id={question.id}
        className={questionRootClass}
        style={rootStyle}
        role={question.ariaRole}
        aria-labelledby={question.hasTitle ? question.ariaTitleId : null}
      >
        {headerTop}
        <div className={question.cssContent}>
          {errorsTop}
          {questionRender}
          {comment}
          {errorsBottom}
          {descriptionUnderInput}
        </div>
        {headerBottom}
      </div>
    );
  }
  protected renderQuestion(): JSX.Element {
    return SurveyQuestion.renderQuestionBody(this.creator, this.question);
  }

  private TitleKeyIndex = 0;
  private TitleKeyPrefix = this.question.name + "-titleKey-";
  private getTitleKey = () => {
    this.TitleKeyIndex++;
    return this.TitleKeyPrefix + this.TitleKeyIndex;
  };

  protected renderTitle(cssClasses: any): JSX.Element {
    var getSpaceSpan = () => {
      return (
        <span data-key={this.getTitleKey()} key={this.getTitleKey()}>
          &nbsp;
        </span>
      );
    };

    var spans = [];
    if (this.question.isRequireTextOnStart) {
      spans.push(this.renderRequireText(cssClasses));
      spans.push(getSpaceSpan());
    }
    var questionNumber = this.question["no"];
    if (questionNumber) {
      spans.push(
        <span
          data-key={this.getTitleKey()}
          key={this.getTitleKey()}
          className={cssClasses.number}
          style={{ position: "static" }}
        >
          {questionNumber}
        </span>
      );
      spans.push(getSpaceSpan());
    }
    if (this.question.isRequireTextBeforeTitle) {
      spans.push(this.renderRequireText(cssClasses));
      spans.push(getSpaceSpan());
    }
    spans.push(
      SurveyElementBase.renderLocString(
        this.question.locTitle,
        null,
        this.getTitleKey()
      )
    );
    if (this.question.isRequireTextAfterTitle) {
      spans.push(getSpaceSpan());
      spans.push(this.renderRequireText(cssClasses));
    }
    return (
      <h5
        className={this.question.cssTitle}
        aria-label={this.question.locTitle.renderedHtml}
        id={this.question.ariaTitleId}
      >
        {spans}
      </h5>
    );
  }
  private renderRequireText(cssClasses: any): JSX.Element {
    return (
      <span
        data-key={this.getTitleKey()}
        key={this.getTitleKey()}
        className={cssClasses.requiredText}
      >
        {this.question.requiredText}
      </span>
    );
  }
  protected renderDescription(
    cssClasses: any,
    isUnderInput: boolean = false
  ): JSX.Element {
    var descriptionText = SurveyElementBase.renderLocString(
      this.question.locDescription
    );
    var className = isUnderInput
      ? cssClasses.descriptionUnderInput
      : cssClasses.description;
    return <div className={className}>{descriptionText}</div>;
  }
  protected renderComment(cssClasses: any): JSX.Element {
    // var commentText = SurveyElementBase.renderLocString(
    //   this.question.locCommentText
    // );
    var commentText = this.question.commentText;
    return (
      <div className={this.question.cssClasses.formGroup}>
        <div>{commentText}</div>
        <SurveyQuestionCommentItem
          question={this.question}
          cssClasses={cssClasses}
          otherCss={cssClasses.other}
          isDisplayMode={this.question.isReadOnly}
        />
      </div>
    );
  }
  protected renderHeader(question: Question): JSX.Element {
    var cssClasses = question.cssClasses;
    var title = question.hasTitle ? this.renderTitle(cssClasses) : null;
    var description = question.hasDescriptionUnderTitle
      ? this.renderDescription(cssClasses)
      : null;
    return (
      <div className={question.cssHeader}>
        {title}
        {description}
      </div>
    );
  }
  protected renderErrors(cssClasses: any, location: string): JSX.Element {
    return (
      <SurveyElementErrors
        element={this.question}
        cssClasses={cssClasses}
        creator={this.creator}
        location={location}
        id={this.question.id +"_errors"}
      />
    );
  }
}

ReactElementFactory.Instance.registerElement("question", (props) => {
  return React.createElement(SurveyQuestion, props);
});

export class SurveyElementErrors extends ReactSurveyElement {
  constructor(props: any) {
    super(props);
    this.state = this.getState();
  }
  protected get id(): string {
    return this.props.id;
  }
  protected get element(): SurveyElement {
    var element = this.props.element;
    return element instanceof SurveyElement ? element : null;
  }
  private get creator(): ISurveyCreator {
    return this.props.creator;
  }
  protected get location(): string {
    return this.props.location;
  }
  private getState(prevState: any = null) {
    return !prevState ? { error: 0 } : { error: prevState.error + 1 };
  }
  render(): JSX.Element {
    if (!this.element || this.element.errors.length == 0) return null;
    var errors = [];
    for (var i = 0; i < this.element.errors.length; i++) {
      var key = "error" + i;
      errors.push(
        this.creator.renderError(key, this.element.errors[i], this.cssClasses)
      );
    }
    var classes = this.cssClasses.error.root;

    if (this.location === "top") {
      classes += " " + this.cssClasses.error.locationTop;
    } else if (this.location === "bottom") {
      classes += " " + this.cssClasses.error.locationBottom;
    }

    return (
      <div role="alert" className={classes} id={this.id}>
        {errors}
      </div>
    );
  }
}

export class SurveyQuestionAndErrorsCell extends ReactSurveyElement {
  [index: string]: any;
  constructor(props: any) {
    super(props);
  }
  protected getStateElement(): Base {
    return this.question;
  }
  protected get question(): Question {
    return this.getQuestion();
  }
  protected get creator(): ISurveyCreator {
    return this.props.creator;
  }
  protected getQuestion(): Question {
    return this.props.question;
  }
  componentDidMount() {
    super.componentDidMount();
    this.doAfterRender();
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.question) {
      var el: any = this.refs["cell"];
      if (!!el) {
        el.removeAttribute("data-rendered");
      }
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.doAfterRender();
  }
  protected doAfterRender() {}
  protected getCellClass(): any {
    return null;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var errorsLocation = this.creator.questionErrorLocation();
    var errors = this.getShowErrors() ? (
      <SurveyElementErrors
        element={this.question}
        cssClasses={this.cssClasses}
        creator={this.creator}
        location={errorsLocation}
      />
    ) : null;
    var errorsTop = errorsLocation === "top" ? errors : null;
    var errorsBottom = errorsLocation === "bottom" ? errors : null;
    var renderedCell = this.renderQuestion();
    var style = this.getCellStyle();
    return (
      <td
        ref="cell"
        className={this.getCellClass() + " " + this.cssClasses.cell}
        headers={this.question.isVisible ? this.getHeaderText() : ""}
        style={style}
      >
        {errorsTop}
        {renderedCell}
        {errorsBottom}
      </td>
    );
  }
  protected getShowErrors(): boolean {
    return this.question.isVisible;
  }
  protected getCellStyle(): any {
    return null;
  }
  protected renderQuestion(): JSX.Element {
    return SurveyQuestion.renderQuestionBody(this.creator, this.question);
  }
  protected getHeaderText(): string {
    return !!this["cell"] ? this["cell"].column.locTitle.renderedHtml : "";
  }
}

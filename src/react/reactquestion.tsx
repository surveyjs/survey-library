import * as React from "react";
import { Question } from "../question";
import { SurveyElement, SurveyError } from "../base";
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
  protected question: Question;
  private creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.updateProps(props);
  }
  private updateProps(props: any) {
    this.creator = props.creator;
    this.question = props.element;
  }
  componentWillReceiveProps(nextProps: any) {
    this.unMakeBaseElementReact(this.question);
    this.updateProps(nextProps);
    this.makeBaseElementReact(this.question);
  }
  componentWillMount() {
    this.makeBaseElementReact(this.question);
  }
  componentDidMount() {
    if (!!this.question) {
      this.question["react"] = this;
    }
    this.doAfterRender();
  }
  componentWillUnmount() {
    if (!!this.question) {
      this.question["react"] = null;
    }
    this.unMakeBaseElementReact(this.question);
    var el: any = this.refs["root"];
    if (!!el) {
      el.removeAttribute("data-rendered");
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    this.doAfterRender();
  }
  private doAfterRender() {
    if (this.question) {
      var el: any = this.refs["root"];
      if (
        el &&
        this.question.survey &&
        el.getAttribute("data-rendered") !== "r"
      ) {
        el.setAttribute("data-rendered", "r");
        this.question.survey.afterRenderQuestion(this.question, el);
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
    var contentClass =
      question.cssClasses.content +
      (question.hasTitleOnLeft ? " " + question.cssClasses.contentLeft : "");
    let questionRootClass = question.cssMainRoot;
    if (question.cssClasses.small && !question.width) {
      questionRootClass += " " + question.cssClasses.small;
    }

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
    if (question.renderWidth) rootStyle["width"] = question.renderWidth;
    if (!!question.paddingLeft) rootStyle["paddingLeft"] = question.paddingLeft;
    if (!!question.paddingRight)
      rootStyle["paddingRight"] = question.paddingRight;
    return (
      <div
        ref="root"
        id={question.id}
        className={questionRootClass}
        style={rootStyle}
      >
        {headerTop}
        <div className={contentClass}>
          {errorsTop}
          {questionRender}
          {comment}
          {errorsBottom}
          {headerBottom}
        </div>
      </div>
    );
  }
  protected renderQuestion(): JSX.Element {
    return SurveyQuestion.renderQuestionBody(this.creator, this.question);
  }
  protected renderTitle(cssClasses: any): JSX.Element {
    var titleText = SurveyElementBase.renderLocString(this.question.locTitle);
    var number = null;
    var delimiter = null;
    var questionNumber = this.question["no"];
    if (questionNumber) {
      number = (
        <span className={cssClasses.number} style={{ position: "static" }}>
          {questionNumber}
        </span>
      );
      delimiter = <span className={cssClasses.number}>.{"\u00A0"}</span>;
    }
    return (
      <h5
        className={this.getTitleClass(this.question)}
        title={this.question.locTitle.renderedHtml}
      >
        {number}
        {delimiter}
        {titleText}
      </h5>
    );
  }
  private getTitleClass(element: Question) {
    var cssClasses = element.cssClasses;
    var result = cssClasses.title;

    if (!element.isEmpty()) {
      result += " " + cssClasses.titleOnAnswer;
    }

    if (element.errors.length > 0) {
      result += " " + cssClasses.titleOnError;
    }

    return result;
  }

  protected renderDescription(cssClasses: any): JSX.Element {
    if (this.question.locDescription.isEmpty) return null;
    var descriptionText = SurveyElementBase.renderLocString(
      this.question.locDescription
    );
    return <div className={cssClasses.description}>{descriptionText}</div>;
  }
  protected renderComment(cssClasses: any): JSX.Element {
    // var commentText = SurveyElementBase.renderLocString(
    //   this.question.locCommentText
    // );
    var commentText = this.question.commentText;
    return (
      <div className="form-group">
        <div>{commentText}</div>
        <SurveyQuestionCommentItem
          question={this.question}
          cssClasses={cssClasses}
          otherCss={cssClasses.other}
        />
      </div>
    );
  }
  protected renderHeader(question: Question): JSX.Element {
    var cssClasses = question.cssClasses;
    var title = question.hasTitle ? this.renderTitle(cssClasses) : null;
    var description = this.renderDescription(cssClasses);
    var headerClass = cssClasses.header;
    if (question.hasTitleOnTop) {
      headerClass += " " + cssClasses.headerTop;
    }
    if (question.hasTitleOnLeft) {
      headerClass += " " + cssClasses.headerLeft;
    }
    if (question.hasTitleOnBottom) {
      headerClass += " " + cssClasses.headerBottom;
    }
    return (
      <div className={headerClass}>
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
      />
    );
  }
}

ReactElementFactory.Instance.registerElement("question", props => {
  return React.createElement(SurveyQuestion, props);
});

export class SurveyElementErrors extends ReactSurveyElement {
  protected element: SurveyElement;
  private creator: ISurveyCreator;
  protected location: String;

  constructor(props: any) {
    super(props);
    this.setElement(props.element);
    this.state = this.getState();
    this.creator = props.creator;
    this.location = props.location;
  }
  componentWillReceiveProps(nextProps: any) {
    this.setElement(nextProps.element);
    this.setState(this.getState());
    this.creator = nextProps.creator;
    this.location = nextProps.location;
  }
  private setElement(element: any) {
    this.element = element instanceof SurveyElement ? element : null;
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
      <div role="alert" className={classes}>
        {errors}
      </div>
    );
  }
}

export class SurveyQuestionAndErrorsCell extends ReactSurveyElement {
  [index: string]: any;
  private questionValue: Question;
  protected creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
  }
  componentWillReceiveProps(nextProps: any) {
    if (this.question) {
      this.unMakeBaseElementReact(this.question);
    }
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
    if (this.question) {
      this.makeBaseElementReact(this.question);
    }
  }
  protected setProperties(nextProps: any) {
    this.question = nextProps.question;
    this.creator = nextProps.creator;
  }
  protected get question() {
    return this.questionValue;
  }
  protected set question(val: Question) {
    this.questionValue = val;
  }
  componentWillMount() {
    this.makeBaseElementReact(this.question);
  }
  componentDidMount() {
    this.doAfterRender();
  }
  componentWillUnmount() {
    if (this.question) {
      this.unMakeBaseElementReact(this.question);
      var el: any = this.refs["cell"];
      if (!!el) {
        el.removeAttribute("data-rendered");
      }
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    this.doAfterRender();
  }
  protected doAfterRender() {}
  protected getCellClass(): any {
    return null;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var errorsTop = (
      <SurveyElementErrors
        element={this.question}
        cssClasses={this.cssClasses}
        creator={this.creator}
        location={"top"}
      />
    );
    var errorsBottom = (
      <SurveyElementErrors
        element={this.question}
        cssClasses={this.cssClasses}
        creator={this.creator}
        location={"bottom"}
      />
    );
    var errorsTop =
      this.creator.questionErrorLocation() === "top" ? errorsTop : null;
    var errorsBottom =
      this.creator.questionErrorLocation() === "bottom" ? errorsBottom : null;
    var renderedCell = this.renderQuestion();
    return (
      <td
        ref="cell"
        className={this.getCellClass() + " " + this.cssClasses.cell}
        headers={
          this.question.isVisible && !!this["cell"]
            ? this["cell"].column.locTitle.renderedHtml
            : ""
        }
      >
        {errorsTop}
        {renderedCell}
        {errorsBottom}
      </td>
    );
  }
  private renderQuestion(): JSX.Element {
    return SurveyQuestion.renderQuestionBody(this.creator, this.question);
  }
}

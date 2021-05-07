import * as React from "react";
import { Question } from "survey-core";
import { SurveyElement, SurveyError, Base } from "survey-core";
import { SurveyQuestionCommentItem } from "./reactquestion_comment";
import { SurveyElementBase, ReactSurveyElement } from "./reactquestion_element";
import { SurveyCustomWidget } from "./custom-widget";
import { ReactElementFactory } from "./element-factory";
import { ReactSurveyModel } from "./reactsurveymodel";

export interface ISurveyCreator {
  createQuestionElement(question: Question): JSX.Element;
  renderError(key: string, error: SurveyError, cssClasses: any): JSX.Element;
  questionTitleLocation(): string;
  questionErrorLocation(): string;
}

export class SurveyQuestion extends SurveyElementBase<any, any> {
  private isNeedFocus = false;
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
  private rootRef: React.RefObject<HTMLDivElement>;
  constructor(props: any) {
    super(props);
    this.rootRef = React.createRef();
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
    var el = this.rootRef.current;
    if (!!el) {
      el.removeAttribute("data-rendered");
    }
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.doAfterRender();
  }
  private doAfterRender() {
    if (this.isNeedFocus) {
      this.question.clickTitleFunction();
      this.isNeedFocus = false;
    }
    if (this.question) {
      var el = this.rootRef.current;
      if (el && el.getAttribute("data-rendered") !== "r") {
        el.setAttribute("data-rendered", "r");
        el.setAttribute("name", this.question.name);
        if (this.question.afterRender) {
          this.question.afterRender(el);
        }
      }
    }
  }
  protected canRender(): boolean {
    return (
      super.canRender() &&
      !!this.question &&
      !!this.creator &&
      this.question.isVisible
    );
  }
  protected renderElement(): JSX.Element {
    var question = this.question;
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
    if (!!question.paddingLeft) rootStyle["paddingLeft"] = question.paddingLeft;
    if (!!question.paddingRight)
      rootStyle["paddingRight"] = question.paddingRight;

    var contentStyle = {
      display: !this.question.isCollapsed ? "block" : "none",
    };

    if (question.isReadOnly) {
      questionRootClass += " " + cssClasses.disabled;
    }

    return (
      <div
        ref={this.rootRef}
        id={question.id}
        className={questionRootClass}
        style={rootStyle}
        role={question.ariaRole}
        aria-labelledby={question.hasTitle ? question.ariaTitleId : null}
      >
        {headerTop}
        <div className={question.cssContent} style={contentStyle}>
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
  protected wrapElement(element: JSX.Element): JSX.Element {
    const survey: ReactSurveyModel = this.question.survey as ReactSurveyModel;
    let wrapper: JSX.Element;
    if (survey) {
      wrapper = survey.wrapElement(element, this.question);
    }
    return wrapper ?? element;
  }
  protected renderQuestion(): JSX.Element {
    return SurveyQuestion.renderQuestionBody(this.creator, this.question);
  }
  protected renderTitle(cssClasses: any): JSX.Element {
    const titleComponent = ReactElementFactory.Instance.createElement(
      this.question.getTitleComponentName(),
      { element: this.question, cssClasses: this.question.cssClasses }
    );
    return (
      <h5
        className={this.question.cssTitle}
        aria-label={this.question.locTitle.renderedHtml}
        id={this.question.ariaTitleId}
        onClick={() => {
          this.question.toggleState();
        }}
      >
        {titleComponent}
      </h5>
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
          isDisplayMode={this.question.isInputReadOnly}
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
      <div className={question.cssHeader} onClick={question.clickTitleFunction}>
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
        id={this.question.id + "_errors"}
      />
    );
  }
}

ReactElementFactory.Instance.registerElement("question", props => {
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
  protected canRender(): boolean {
    return !!this.element && this.element.hasVisibleErrors;
  }
  protected renderElement(): JSX.Element {
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
  protected cellRef: React.RefObject<HTMLTableCellElement>;
  constructor(props: any) {
    super(props);
    this.cellRef = React.createRef();
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
      var el = this.cellRef.current;
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
  protected canRender(): boolean {
    return !!this.question;
  }
  protected renderElement(): JSX.Element {
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
        ref={this.cellRef}
        className={this.getCellClass() + " " + this.cssClasses.cell}
        title={this.getHeaderText()}
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
    return "";
  }
}

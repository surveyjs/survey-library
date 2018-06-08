import * as React from "react";
import { QuestionBase } from "../questionbase";
import { Question } from "../question";
import { SurveyElement, SurveyError } from "../base";
import { SurveyQuestionCommentItem } from "./reactquestioncomment";
import { SurveyElementBase, ReactSurveyElement } from "./reactquestionelement";
import { SurveyCustomWidget } from "./custom-widget";

export interface ISurveyCreator {
  createQuestionElement(question: QuestionBase): JSX.Element;
  renderError(key: string, error: SurveyError, cssClasses: any): JSX.Element;
  questionTitleLocation(): string;
  questionErrorLocation(): string;
}

export class SurveyQuestion extends React.Component<any, any> {
  private questionBase: QuestionBase;
  protected question: Question;
  private creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setQuestion(props.question);
    this.state = this.getState();
    this.creator = props.creator;
  }
  componentWillReceiveProps(nextProps: any) {
    this.creator = nextProps.creator;
    this.setQuestion(nextProps.question);
    this.setState(this.getState());
  }
  private setQuestion(question) {
    this.questionBase = question;
    this.question = question instanceof Question ? question : null;
    this.questionBase.errorsChangedCallback = () => {
      var state = this.getState();
      state.error++;
      this.setState(state);
    };
  }
  private getState() {
    var value = this.question ? this.question.value : null;
    return {
      visible: this.questionBase.visible,
      value: value,
      error: 0,
      renderWidth: 0,
      visibleIndexValue: -1,
      isReadOnly: this.questionBase.isReadOnly
    };
  }
  componentDidMount() {
    if (this.questionBase) {
      var self = this;
      this.questionBase["react"] = self;
      this.questionBase.registerFunctionOnPropertiesValueChanged(
        ["renderWidth", "indent", "rightIndent"],
        function() {
          self.setState({ renderWidth: self.state.renderWidth + 1 });
        },
        "react"
      );
      this.questionBase.registerFunctionOnPropertyValueChanged(
        "visibleIndex",
        function() {
          self.setState({ visibleIndexValue: self.questionBase.visibleIndex });
        },
        "react"
      );
      this.questionBase.registerFunctionOnPropertyValueChanged(
        "isReadOnly",
        function() {
          self.setState({ isReadOnly: self.questionBase.isReadOnly });
        },
        "react"
      );
    }
    this.doAfterRender();
  }
  componentWillUnmount() {
    if (this.questionBase) {
      this.questionBase["react"] = null;
      this.questionBase.unRegisterFunctionOnPropertiesValueChanged(
        ["visibleIndex", "renderWidth", "indent", "rightIndent, isReadOnly"],
        "react"
      );
      var el: any = this.refs["root"];
      if (!!el) {
        el.removeAttribute("data-rendered");
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    this.doAfterRender();
  }
  private doAfterRender() {
    if (this.questionBase) {
      var el: any = this.refs["root"];
      if (
        el &&
        this.questionBase.survey &&
        el.getAttribute("data-rendered") !== "r"
      ) {
        el.setAttribute("data-rendered", "r");
        this.questionBase.survey.afterRenderQuestion(this.questionBase, el);
      }
    }
  }
  render(): JSX.Element {
    if (!this.questionBase || !this.creator) return null;
    if (!this.questionBase.visible) return null;
    var cssClasses = this.questionBase.cssClasses;
    var questionRender = this.renderQuestion();
    var title = this.questionBase.hasTitle
      ? this.renderTitle(cssClasses)
      : null;
    var description = this.renderDescription(cssClasses);
    var titleLocation = this.question ? this.question.getTitleLocation() : "";
    var titleTop = titleLocation === "top" ? title : null;
    var titleBottom = titleLocation === "bottom" ? title : null;
    var titleLeft = titleLocation === "left" ? title : null;
    var titleLeftClass = titleLocation === "left" ? "title-left" : null;
    var contentLeftClass = titleLocation === "left" ? "content-left" : null;
    var descriptionLeft = titleLocation === "left" ? description : null;
    var descriptionTop = titleLocation === "top" ? description : null;
    var descriptionBottom = titleLocation === "bottom" ? description : null;
    let questionRootClass =
      titleLocation === "left"
        ? cssClasses.mainRoot + " sv_qstn_left"
        : cssClasses.mainRoot;
    if (!!this.questionBase.errors && this.questionBase.errors.length > 0) {
      questionRootClass += " " + cssClasses.hasError;
    }
    var comment =
      this.question && this.question.hasComment
        ? this.renderComment(cssClasses)
        : null;
    var errors = this.renderErrors(cssClasses);
    var errorsTop =
      this.creator.questionErrorLocation() === "top" ? errors : null;
    var errorsBottom =
      this.creator.questionErrorLocation() === "bottom" ? errors : null;
    var paddingLeft =
      this.questionBase.indent > 0
        ? this.questionBase.indent * cssClasses.indent + "px"
        : null;
    var paddingRight =
      this.questionBase.rightIndent > 0
        ? this.questionBase.rightIndent * cssClasses.indent + "px"
        : null;
    let rootStyle = {};
    if (this.questionBase.renderWidth)
      rootStyle["width"] = this.questionBase.renderWidth;
    if (paddingLeft) rootStyle["paddingLeft"] = paddingLeft;
    if (paddingRight) rootStyle["paddingRight"] = paddingRight;

    return (
      <div
        ref="root"
        id={this.questionBase.id}
        className={questionRootClass}
        style={rootStyle}
      >
        <div className={titleLeftClass}>
          {titleTop}
          {descriptionTop}
          {titleLeft}
          {descriptionLeft}
        </div>

        <div className={contentLeftClass}>
          {errorsTop}
          {questionRender}
          {comment}
          {errorsBottom}
          {titleBottom}
          {descriptionBottom}
        </div>
      </div>
    );
  }
  protected renderQuestion(): JSX.Element {
    var customWidget = this.questionBase.customWidget;
    if (!customWidget) {
      return this.creator.createQuestionElement(this.questionBase);
    }
    return (
      <SurveyCustomWidget creator={this.creator} question={this.questionBase} />
    );
  }
  protected renderTitle(cssClasses: any): JSX.Element {
    var titleText = SurveyElementBase.renderLocString(this.question.locTitle);
    return <h5 className={cssClasses.title}>{titleText}</h5>;
  }
  protected renderDescription(cssClasses: any): JSX.Element {
    if (!this.questionBase.hasDescription) return null;
    var descriptionText = SurveyElementBase.renderLocString(
      this.question.locDescription
    );
    return <div className={cssClasses.description}>{descriptionText}</div>;
  }
  protected renderComment(cssClasses: any): JSX.Element {
    var commentText = SurveyElementBase.renderLocString(
      this.question.locCommentText
    );
    return (
      <div>
        <div>{commentText}</div>
        <SurveyQuestionCommentItem
          question={this.question}
          cssClasses={cssClasses}
        />
      </div>
    );
  }
  protected renderErrors(cssClasses: any): JSX.Element {
    return (
      <SurveyElementErrors
        element={this.question}
        cssClasses={cssClasses}
        creator={this.creator}
      />
    );
  }
}

export class SurveyElementErrors extends ReactSurveyElement {
  protected element: SurveyElement;
  private creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setElement(props.element);
    this.state = this.getState();
    this.creator = props.creator;
  }
  componentWillReceiveProps(nextProps: any) {
    this.setElement(nextProps.element);
    this.setState(this.getState());
    this.creator = nextProps.creator;
  }
  private setElement(element) {
    this.element = element instanceof SurveyElement ? element : null;
    if (this.element && !this.element.errorsChangedCallback) {
      this.element.errorsChangedCallback = () => {
        this.setState(this.getState(this.state));
      };
    }
  }
  private getState(prevState = null) {
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
    return (
      <div role="alert" className={this.cssClasses.error.root}>
        {errors}
      </div>
    );
  }
}

export class SurveyQuestionAndErrorsCell extends ReactSurveyElement {
  protected question: Question;
  protected creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
    this.state = this.getState();
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  protected setProperties(nextProps: any) {
    this.question = nextProps.question;
    this.creator = nextProps.creator;
  }
  private getState(increaseError: boolean = false): any {
    if (!this.question) return;
    var q = this.question;
    var error = !!this.state && !!this.state.error ? this.state.error : 0;
    if (increaseError) error++;
    return { isReadOnly: q.isReadOnly, visible: q.visible, error: error };
  }
  componentDidMount() {
    this.doAfterRender();
    if (this.question) {
      var self = this;
      this.question.registerFunctionOnPropertyValueChanged(
        "isReadOnly",
        function() {
          self.setState(self.getState());
        },
        "react"
      );
      this.question.registerFunctionOnPropertyValueChanged(
        "visible",
        function() {
          self.setState(self.getState());
        },
        "react"
      );
      this.question.errorsChangedCallback = () => {
        self.setState(self.getState(true));
      };
    }
  }
  componentWillUnmount() {
    if (this.question) {
      this.question.errorsChangedCallback = null;
      this.question.unRegisterFunctionOnPropertiesValueChanged(
        ["visible", "isReadOnly"],
        "react"
      );
      var el: any = this.refs["cell"];
      if (!!el) {
        el.removeAttribute("data-rendered");
      }
    }
  }
  componentDidUpdate(prevProps, prevState) {
    this.doAfterRender();
  }
  protected doAfterRender() {}
  protected getCellClass(): any {
    return null;
  }
  render(): JSX.Element {
    if (!this.question) return null;
    var errors = (
      <SurveyElementErrors
        element={this.question}
        cssClasses={this.cssClasses}
        creator={this.creator}
      />
    );
    var renderedCell = this.renderCell();
    return (
      <td ref="cell" className={this.getCellClass()}>
        {errors}
        {renderedCell}
      </td>
    );
  }
  renderCell(): JSX.Element {
    if (!this.question.visible) return null;
    var customWidget = this.question.customWidget;
    if (!customWidget) {
      return this.creator.createQuestionElement(this.question);
    }
    return (
      <SurveyCustomWidget creator={this.creator} question={this.question} />
    );
  }
}

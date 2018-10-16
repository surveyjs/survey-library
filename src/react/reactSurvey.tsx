import * as React from "react";
import { ReactSurveyModel } from "./reactsurveymodel";
import { SurveyPage } from "./reactpage";
import { SurveyNavigation } from "./reactSurveyNavigation";
import { SurveyError } from "../base";
import { Question } from "../question";
import { ISurveyCreator } from "./reactquestion";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { surveyCss } from "../defaultCss/cssstandard";
import { SurveyProgress } from "./reactSurveyProgress";
import { SurveyTimerPanel } from "./reacttimerpanel";
import { SurveyElementBase, SurveyLocString } from "./reactquestionelement";
import { PageModel } from "../page";

export class Survey extends React.Component<any, any>
  implements ISurveyCreator {
  public static get cssType(): string {
    return surveyCss.currentType;
  }
  public static set cssType(value: string) {
    surveyCss.currentType = value;
  }
  protected survey: ReactSurveyModel;
  private isCurrentPageChanged: boolean = false;
  constructor(props: any) {
    super(props);
    this.handleTryAgainClick = this.handleTryAgainClick.bind(this);
    this.state = this.getState();
    this.updateSurvey(props);
  }
  componentWillReceiveProps(nextProps: any) {
    this.setState(this.getState());
    this.updateSurvey(nextProps);
  }
  componentDidUpdate() {
    if (this.isCurrentPageChanged) {
      this.isCurrentPageChanged = false;
      this.survey.scrollToTopOnPageChange();
    }
  }
  componentDidMount() {
    var el = this.refs["root"];
    if (el && this.survey) this.survey.doAfterRenderSurvey(el);
    if (this.survey) {
      this.survey.startTimerFromUI();
    }
  }
  componentWillUnmount() {
    if (this.survey) {
      this.survey.stopTimer();
    }
  }
  doRender(): JSX.Element {
    var renderResult;
    if (this.survey.state == "completed") {
      renderResult = this.renderCompleted();
    } else if (this.survey.state == "completedbefore") {
      renderResult = this.renderCompletedBefore();
    } else if (this.survey.state == "loading") {
      renderResult = this.renderLoading();
    } else if (this.survey.state == "starting") {
      renderResult = this.renderStartPage();
    } else {
      renderResult = this.renderSurvey();
    }
    var title = this.renderTitle();

    return (
      <div ref="root" className={this.css.root}>
        <div className="sv_custom_header" />
        <div className="sv_container">
          {title}
          {renderResult}
        </div>
      </div>
    );
  }
  render(): JSX.Element {
    return this.doRender();
  }
  public get css(): any {
    return surveyCss.getCss();
  }
  public set css(value: any) {
    this.survey.mergeCss(value, this.css);
  }
  handleTryAgainClick(event: any) {
    this.survey.doComplete();
  }
  protected renderCompleted(): JSX.Element {
    if (!this.survey.showCompletedPage) return null;
    var completedState = null;
    if (this.survey.completedState) {
      var tryAgainButton = null;
      if (this.survey.completedState == "error") {
        var btnText = this.survey.getLocString("saveAgainButton");
        tryAgainButton = (
          <input
            type={"button"}
            value={btnText}
            className={this.css.saveData.saveAgainButton}
            onClick={this.handleTryAgainClick}
          />
        );
      }
      var css = this.css.saveData[this.survey.completedState];
      completedState = (
        <div className={this.css.saveData.root}>
          <div className={css}>
            <span>{this.survey.completedStateText}</span>
            {tryAgainButton}
          </div>
        </div>
      );
    }
    var htmlValue = { __html: this.survey.processedCompletedHtml };
    return (
      <div>
        <div
          dangerouslySetInnerHTML={htmlValue}
          className={[this.css.body, this.css.completedPage].join(" ")}
        />
        {completedState}
      </div>
    );
  }
  protected renderCompletedBefore(): JSX.Element {
    var htmlValue = { __html: this.survey.processedCompletedBeforeHtml };
    return (
      <div dangerouslySetInnerHTML={htmlValue} className={this.css.body} />
    );
  }
  protected renderLoading(): JSX.Element {
    var htmlValue = { __html: this.survey.processedLoadingHtml };
    return (
      <div dangerouslySetInnerHTML={htmlValue} className={this.css.body} />
    );
  }
  protected renderStartPage(): JSX.Element {
    var startedPage = this.survey.startedPage
      ? this.renderPage(this.survey.startedPage)
      : null;
    var pageId = this.survey.startedPage ? this.survey.startedPage.id : "";
    var startButton = this.renderNavigation();
    return (
      <div>
        <div id={pageId} className={this.css.body}>
          {startedPage}
          {startButton}
        </div>
      </div>
    );
  }
  protected renderSurvey(): JSX.Element {
    var currentPage = this.survey.currentPage
      ? this.renderPage(this.survey.currentPage)
      : null;
    var pageId = this.survey.currentPage ? this.survey.currentPage.id : "";
    var topProgress = this.survey.isShowProgressBarOnTop
      ? this.renderProgress(true)
      : null;
    var bottomProgress = this.survey.isShowProgressBarOnBottom
      ? this.renderProgress(false)
      : null;
    var buttons = currentPage ? this.renderNavigation() : null;
    if (!currentPage) {
      currentPage = this.renderEmptySurvey();
    }
    return (
      <div id={pageId} className={this.css.body}>
        {topProgress}
        {this.renderTimerPanel("top")}
        {currentPage}
        {this.renderTimerPanel("bottom")}
        {bottomProgress}
        {buttons}
      </div>
    );
  }
  protected renderTitle(): JSX.Element {
    let title = null;
    if (this.survey.title && this.survey.showTitle) {
      title = SurveyElementBase.renderLocString(this.survey.locTitle);
    }
    return title ? (
      <div className={this.css.header}>
        <h3>{title}</h3>
      </div>
    ) : null;
  }
  protected renderTimerPanel(location: string) {
    if (this.survey.showTimerPanel != location) return null;
    return <SurveyTimerPanel survey={this.survey} css={this.css} />;
  }
  protected renderPage(page: PageModel): JSX.Element {
    return (
      <SurveyPage
        survey={this.survey}
        page={page}
        css={this.css}
        creator={this}
      />
    );
  }
  protected renderProgress(isTop: boolean): JSX.Element {
    return <SurveyProgress survey={this.survey} css={this.css} isTop={isTop} />;
  }
  protected renderNavigation(): JSX.Element {
    return <SurveyNavigation survey={this.survey} css={this.css} />;
  }
  protected renderEmptySurvey(): JSX.Element {
    return <span>{this.survey.emptySurveyText}</span>;
  }

  protected updateSurvey(newProps: any) {
    if (newProps) {
      if (newProps.model) {
        this.survey = newProps.model;
      } else {
        if (newProps.json) {
          this.survey = new ReactSurveyModel(newProps.json);
        }
      }
    } else {
      this.survey = new ReactSurveyModel();
    }
    if (newProps) {
      for (var key in newProps) {
        if (key == "model" || key == "children") continue;
        if (key == "css") {
          this.survey.mergeCss(newProps.css, this.css);
          continue;
        }
        if (
          key.indexOf("on") == 0 &&
          this.survey[key] &&
          this.survey[key].add
        ) {
          let funcBody = newProps[key];
          let func = function(sender: any, options: any) {
            funcBody(sender, options);
          };
          this.survey[key].add(func);
        } else {
          this.survey[key] = newProps[key];
        }
      }
    }

    //set the first page
    var dummy = this.survey.currentPage;

    this.setSurveyEvents(newProps);
  }
  private getState() {
    return { pageIndexChange: 0, isCompleted: false, modelChanged: 0 };
  }
  protected setSurveyEvents(newProps: any) {
    var self = this;
    this.survey.renderCallback = function() {
      self.setState({ modelChanged: self.state.modelChanged + 1 });
    };
    this.survey.onComplete.add(sender => {
      self.setState({ isCompleted: true });
    });
    this.survey.onPartialSend.add(sender => {
      self.setState(self.state);
    });
    this.survey.onCurrentPageChanged.add((sender, options) => {
      self.isCurrentPageChanged = true;
      self.setState({ pageIndexChange: self.state.pageIndexChange + 1 });
    });
    this.survey.onVisibleChanged.add((sender, options) => {
      if (options.question && options.question.react) {
        var state = options.question.react.state;
        state.visible = options.question.visible;
        options.question.react.setState(state);
      }
    });
    this.survey.onValueChanged.add((sender, options) => {
      if (options.question && options.question.react) {
        var state = options.question.react.state;
        state.value = options.value;
        options.question.react.setState(state);
      }
      if (newProps && newProps.data)
        newProps.data[options.name] = options.value;
    });
  }

  //ISurveyCreator
  public createQuestionElement(question: Question): JSX.Element {
    return ReactQuestionFactory.Instance.createQuestion(
      question.getTemplate(),
      {
        question: question,
        isDisplayMode: question.isReadOnly,
        creator: this
      }
    );
  }
  public renderError(
    key: string,
    error: SurveyError,
    cssClasses: any
  ): JSX.Element {
    return (
      <div key={key} className={cssClasses.error.item}>
        <SurveyLocString locStr={error.locText} />
      </div>
    );
  }
  public questionTitleLocation(): string {
    return this.survey.questionTitleLocation;
  }
  public questionErrorLocation(): string {
    return this.survey.questionErrorLocation;
  }
}

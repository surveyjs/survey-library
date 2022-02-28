import * as React from "react";
import { Base, Question, PageModel, SurveyError, StylesManager, surveyCss, Helpers, doKey2ClickUp, SvgRegistry, SurveyModel } from "survey-core";
import { SurveyPage } from "./page";
import { ISurveyCreator } from "./reactquestion";
import { SurveyElementBase } from "./reactquestion_element";
import { SurveyLocStringViewer } from "./string-viewer";
import { SurveyHeader } from "./components/survey-header/survey-header";
import { SurveyTimerPanel } from "./reacttimerpanel";
import { SurveyNavigation } from "./reactSurveyNavigation";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactElementFactory } from "./element-factory";
import { doKey2ClickDown } from "../utils/utils";

export class Survey extends SurveyElementBase<any, any>
  implements ISurveyCreator {
  private previousJSON = {};
  private rootRef: React.RefObject<HTMLDivElement>;
  public static get cssType(): string {
    return surveyCss.currentType;
  }
  public static set cssType(value: string) {
    StylesManager.applyTheme(value);
  }
  protected survey: SurveyModel;

  private rootNodeId: string; // root dom node ID attr
  private rootNodeClassName: string; // root dom node class

  constructor(props: any) {
    super(props);
    this.handleTryAgainClick = this.handleTryAgainClick.bind(this);
    this.createSurvey(props);
    this.updateSurvey(props, {});
    this.rootRef = React.createRef();
    this.rootNodeId = props.id || null;
    this.rootNodeClassName = props.className || "";
  }
  protected getStateElement(): Base {
    return this.survey;
  }
  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    if (this.isModelJSONChanged(nextProps)) {
      this.createSurvey(nextProps);
      this.updateSurvey(nextProps, {});
    }
    return true;
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateSurvey(this.props, prevProps);
  }
  componentDidMount() {
    super.componentDidMount();
    var el = this.rootRef.current;
    if (el && this.survey) this.survey.afterRenderSurvey(el);
    if (this.survey) {
      this.survey.startTimerFromUI();
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    if (this.survey) {
      this.survey.stopTimer();
    }
  }
  doRender(): JSX.Element {
    SvgRegistry.renderIcons();
    let renderResult: JSX.Element;
    if (this.survey.state == "completed") {
      renderResult = this.renderCompleted();
    } else if (this.survey.state == "completedbefore") {
      renderResult = this.renderCompletedBefore();
    } else if (this.survey.state == "loading") {
      renderResult = this.renderLoading();
    } else {
      renderResult = this.renderSurvey();
    }
    const header: JSX.Element = <SurveyHeader survey={this.survey}></SurveyHeader>;
    const onSubmit = function (event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
    };
    let customHeader: JSX.Element = <div className="sv_custom_header" />;
    if (this.survey.hasLogo) {
      customHeader = null;
    }
    const cssClasses = this.rootNodeClassName ? this.rootNodeClassName + " " + this.css.root : this.css.root;

    return (
      <div id={this.rootNodeId} ref={this.rootRef} className={cssClasses}>
        <form onSubmit={onSubmit}>
          {customHeader}
          <div className={this.css.container}>
            {header}
            {renderResult}
          </div>
        </form>
      </div>
    );
  }
  protected renderElement(): JSX.Element {
    return this.doRender();
  }
  public get css(): any {
    return this.survey.css;
  }
  public set css(value: any) {
    this.survey.css = value;
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
      <React.Fragment>
        <div
          dangerouslySetInnerHTML={htmlValue}
          className={this.survey.completedCss}
        />
        {completedState}
      </React.Fragment>
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
  protected renderSurvey(): JSX.Element {
    var activePage = this.survey.activePage
      ? this.renderPage(this.survey.activePage)
      : null;
    const isStaring = this.survey.isShowStartingPage;
    var pageId = this.survey.activePage ? this.survey.activePage.id : "";
    var topProgress = this.survey.isShowProgressBarOnTop && !isStaring
      ? this.renderProgress(true)
      : null;
    var bottomProgress = this.survey.isShowProgressBarOnBottom && !isStaring
      ? this.renderProgress(false)
      : null;
    let className = this.survey.bodyCss;
    if (!activePage) {
      className = this.css.bodyEmpty;
      activePage = this.renderEmptySurvey();
    }
    return (
      <div
        id={pageId}
        className={className}
      >
        {topProgress}
        {this.renderTimerPanel("top")}
        {this.renderNavigation("top")}
        {activePage}
        {this.renderTimerPanel("bottom")}
        {bottomProgress}
        {this.renderNavigation("bottom")}
      </div>
    );
  }
  protected renderTimerPanel(location: string) {
    if(this.survey.isShowStartingPage) return null;
    if (location === "top" && !this.survey.isTimerPanelShowingOnTop)
      return null;
    if (location === "bottom" && !this.survey.isTimerPanelShowingOnBottom)
      return null;
    return <SurveyTimerPanel timerModel={this.survey.timerModel} />;
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
    return ReactElementFactory.Instance.createElement(
      "sv-progress-" + this.survey.progressBarType.toLowerCase(),
      { survey: this.survey, css: this.css, isTop: isTop }
    );
  }
  protected renderNavigation(navPosition: string): JSX.Element {
    if (
      this.survey.isNavigationButtonsShowing !== "both" &&
      (this.survey.isNavigationButtonsShowing === "none" ||
        this.survey.isNavigationButtonsShowing !== navPosition)
    ) {
      return null;
    }
    return <SurveyNavigation survey={this.survey} css={this.css} />;
  }
  protected renderEmptySurvey(): JSX.Element {
    return <span>{this.survey.emptySurveyText}</span>;
  }
  protected createSurvey(newProps: any) {
    if (!newProps) newProps = {};
    this.previousJSON = {};
    if (newProps) {
      if (newProps.model) {
        this.survey = newProps.model;
      } else {
        if (newProps.json) {
          this.previousJSON = newProps.json;
          this.survey = new SurveyModel(newProps.json);
        }
      }
    } else {
      this.survey = new SurveyModel();
    }
    if (!!newProps.css) {
      this.survey.css = this.css;
    }
    this.setSurveyEvents();
  }
  private isModelJSONChanged(newProps: any): boolean {
    if (!!newProps["model"]) {
      return this.survey !== newProps["model"];
    }
    if (!!newProps["json"]) {
      return !Helpers.isTwoValueEquals(newProps["json"], this.previousJSON);
    }
    return false;
  }
  protected updateSurvey(newProps: any, oldProps?: any) {
    if (!newProps) return;
    oldProps = oldProps || {};
    for (var key in newProps) {
      if (key == "model" || key == "children" || key == "json") {
        continue;
      }
      if (key == "css") {
        this.survey.mergeValues(newProps.css, this.survey.getCss());
        this.survey["updateElementCss"]();
        continue;
      }
      if (newProps[key] === oldProps[key]) continue;
      if (key.indexOf("on") == 0 && this.survey[key] && this.survey[key].add) {
        if (!!oldProps[key]) {
          this.survey[key].remove(oldProps[key]);
        }
        this.survey[key].add(newProps[key]);
      } else {
        this.survey[key] = newProps[key];
      }
    }
  }
  protected setSurveyEvents() {
    var self = this;

    this.survey.renderCallback = function () {
      var counter =
        !!self.state && !!self.state.modelChanged ? self.state.modelChanged : 0;
      self.setState({ modelChanged: counter + 1 });
    };
    this.survey.onPartialSend.add((sender) => {
      if (!!self.state) {
        self.setState(self.state);
      }
    });
  }

  //ISurveyCreator
  public createQuestionElement(question: Question): JSX.Element {
    return ReactQuestionFactory.Instance.createQuestion(
      !question.isDefaultRendering || question.isDefaultRendering()
        ? question.getTemplate()
        : question.getComponentName(),
      {
        question: question,
        isDisplayMode: question.isInputReadOnly,
        creator: this,
      }
    );
  }
  public renderError(
    key: string,
    error: SurveyError,
    cssClasses: any
  ): JSX.Element {
    return (
      <div key={key}>
        <span className={cssClasses.error.icon} aria-hidden="true" />
        <span className={cssClasses.error.item}>
          <SurveyLocStringViewer locStr={error.locText} />
        </span>
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

ReactElementFactory.Instance.registerElement("survey", (props) => {
  return React.createElement(Survey, props);
});

export function attachKey2click(element: JSX.Element, viewModel?: any, options = { processEsc: true }): JSX.Element {
  if (!!viewModel && viewModel.disableTabStop) {
    return React.cloneElement(element, { tabIndex: -1 });
  }
  return React.cloneElement(
    element,
    {
      tabIndex: 0,
      onKeyUp: (evt: KeyboardEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        doKey2ClickUp(evt, options);
        return false;
      },
      onKeyDown: (evt: any) => doKey2ClickDown(evt, options)
    }
  );
}
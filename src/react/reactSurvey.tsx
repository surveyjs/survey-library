import * as React from "react";
import { Base, Question, PageModel, SurveyError, StylesManager, surveyCss, Helpers, doKey2ClickUp, SvgRegistry, SurveyModel, doKey2ClickBlur, doKey2ClickDown, IAttachKey2clickOptions } from "survey-core";
import { SurveyPage } from "./page";
import { ISurveyCreator } from "./reactquestion";
import { SurveyElementBase } from "./reactquestion_element";
import { SurveyLocStringViewer } from "./string-viewer";
import { SurveyHeader } from "./components/survey-header/survey-header";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { ReactElementFactory } from "./element-factory";
import { BrandInfo } from "./components/brand-info";
import { NotifierComponent } from "./components/notifier";
import { ComponentsContainer } from "./components/components-container";
import { SvgBundleComponent } from "./svgbundle";

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
    this.createSurvey(props);
    this.updateSurvey(props, {});
    this.rootRef = React.createRef();
    this.rootNodeId = props.id || null;
    this.rootNodeClassName = props.className || "";
  }
  protected getStateElement(): Base {
    return this.survey;
  }
  private isSurveyUpdated = false;
  private onSurveyUpdated() {
    if (!!this.survey) {
      const el = this.rootRef.current;
      if (!!el) this.survey.afterRenderSurvey(el);
      this.survey.startTimerFromUI();
    }
  }
  shouldComponentUpdate(nextProps: any, nextState: any) {
    if (!super.shouldComponentUpdate(nextProps, nextState)) return false;
    if (this.isModelJSONChanged(nextProps)) {
      this.destroySurvey();
      this.createSurvey(nextProps);
      this.updateSurvey(nextProps, {});
      this.isSurveyUpdated = true;
    }
    return true;
  }
  componentDidUpdate(prevProps: any, prevState: any) {
    super.componentDidUpdate(prevProps, prevState);
    this.updateSurvey(this.props, prevProps);
    if(this.isSurveyUpdated) {
      this.onSurveyUpdated();
      this.isSurveyUpdated = false;
    }
  }
  componentDidMount() {
    super.componentDidMount();
    this.onSurveyUpdated();
  }
  destroySurvey() {
    if (this.survey) {
      this.survey.renderCallback = undefined as any;
      this.survey.onPartialSend.clear();
      this.survey.stopTimer();
      this.survey.destroyResizeObserver();
    }
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.destroySurvey();
  }
  doRender(): JSX.Element {
    let renderResult: JSX.Element | null;
    if (this.survey.state == "completed") {
      renderResult = this.renderCompleted();
    } else if (this.survey.state == "completedbefore") {
      renderResult = this.renderCompletedBefore();
    } else if (this.survey.state == "loading") {
      renderResult = this.renderLoading();
    } else if (this.survey.state == "empty") {
      renderResult = this.renderEmptySurvey();
    } else {
      renderResult = this.renderSurvey();
    }
    const backgroundImage = !!this.survey.backgroundImage ? <div className={this.css.rootBackgroundImage} style={this.survey.backgroundImageStyle}></div> : null;
    const header: JSX.Element | null = this.survey.headerView === "basic" ? <SurveyHeader survey={this.survey}></SurveyHeader> : null;

    const onSubmit = function (event: React.FormEvent<HTMLFormElement>) {
      event.preventDefault();
    };
    let customHeader: JSX.Element | null = <div className="sv_custom_header" />;
    if (this.survey.hasLogo) {
      customHeader = null;
    }
    const rootCss = this.survey.getRootCss();
    const cssClasses = this.rootNodeClassName ? this.rootNodeClassName + " " + rootCss : rootCss;

    return (
      <div id={this.rootNodeId} ref={this.rootRef} className={cssClasses} style={this.survey.themeVariables}>
        {this.survey.needRenderIcons ? <SvgBundleComponent></SvgBundleComponent> : null }
        <div className={this.survey.wrapperFormCss}>
          {backgroundImage}
          <form onSubmit={onSubmit}>
            {customHeader}
            <div className={this.css.container}>
              {header}
              <ComponentsContainer survey={this.survey} container={"header"} needRenderWrapper={false}></ComponentsContainer>
              {renderResult}
              <ComponentsContainer survey={this.survey} container={"footer"} needRenderWrapper={false}></ComponentsContainer>
            </div>
          </form>
          { this.survey.showBrandInfo ? <BrandInfo/> : null }
          <NotifierComponent notifier={this.survey.notifier} ></NotifierComponent>
        </div>
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
  protected renderCompleted(): JSX.Element | null {
    if (!this.survey.showCompletedPage) return null;

    var htmlValue = { __html: this.survey.processedCompletedHtml };
    return (
      <React.Fragment>
        <div
          dangerouslySetInnerHTML={htmlValue}
          className={this.survey.completedCss}
        />
        <ComponentsContainer survey={this.survey} container={"completePage"} needRenderWrapper={false}></ComponentsContainer>
      </React.Fragment>
    );
  }
  protected renderCompletedBefore(): JSX.Element {
    var htmlValue = { __html: this.survey.processedCompletedBeforeHtml };
    return (
      <div dangerouslySetInnerHTML={htmlValue} className={this.survey.completedBeforeCss} />
    );
  }
  protected renderLoading(): JSX.Element {
    var htmlValue = { __html: this.survey.processedLoadingHtml };
    return (
      <div dangerouslySetInnerHTML={htmlValue} className={this.survey.loadingBodyCss} />
    );
  }
  protected renderSurvey(): JSX.Element {
    var activePage = this.survey.activePage
      ? this.renderPage(this.survey.activePage)
      : null;
    const isStaring = this.survey.isShowStartingPage;
    var pageId = this.survey.activePage ? this.survey.activePage.id : "";

    let className = this.survey.bodyCss;
    const style: any = {};
    if(!!this.survey.renderedWidth) {
      style.maxWidth = this.survey.renderedWidth;
    }
    return (
      <div className={this.survey.bodyContainerCss}>
        <ComponentsContainer survey={this.survey} container={"left"}></ComponentsContainer>
        <div className="sv-components-column sv-components-column--expandable">
          <ComponentsContainer survey={this.survey} container={"center"}></ComponentsContainer>
          <div
            id={pageId}
            className={className}
            style={style}
          >
            <ComponentsContainer survey={this.survey} container={"contentTop"}></ComponentsContainer>
            {activePage}
            <ComponentsContainer survey={this.survey} container={"contentBottom"}></ComponentsContainer>
          </div>
        </div>
        <ComponentsContainer survey={this.survey} container={"right"}></ComponentsContainer>
      </div>
    );
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
  protected renderEmptySurvey(): JSX.Element {
    return <div className={this.css.bodyEmpty}>{this.survey.emptySurveyText}</div>;
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
        this.survey["updateNavigationCss"]();
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
  public createQuestionElement(question: Question): JSX.Element | null {
    return ReactQuestionFactory.Instance.createQuestion(question.isDefaultRendering() ? question.getTemplate() : question.getComponentName(),
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
    cssClasses: any,
    element?: any
  ): JSX.Element {
    return ReactElementFactory.Instance.createElement(this.survey.questionErrorComponent, { key: key, error, cssClasses, element });
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

export function attachKey2click(element: JSX.Element, viewModel?: any, options: IAttachKey2clickOptions = { processEsc: true, disableTabStop: false }): JSX.Element {
  if ((!!viewModel && viewModel.disableTabStop) || (!!options && options.disableTabStop)) {
    return React.cloneElement(element, { tabIndex: -1 });
  }
  options = { ...options };
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
      onKeyDown: (evt: any) => doKey2ClickDown(evt, options),
      onBlur: (evt: any) => doKey2ClickBlur(evt)
    }
  );
}
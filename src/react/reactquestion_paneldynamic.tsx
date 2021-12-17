import * as React from "react";
import { SurveyQuestionElementBase } from "./reactquestion_element";
import { SurveyModel, QuestionPanelDynamicModel } from "survey-core";
import { SurveyPanel } from "./panel";
import { ReactQuestionFactory } from "./reactquestion_factory";
import { SvgIcon } from "./components/svg-icon/svg-icon";

export class SurveyQuestionPanelDynamic extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.handleOnPanelAddClick = this.handleOnPanelAddClick.bind(this);
    this.handleOnPanelPrevClick = this.handleOnPanelPrevClick.bind(this);
    this.handleOnPanelNextClick = this.handleOnPanelNextClick.bind(this);
    this.handleOnRangeChange = this.handleOnRangeChange.bind(this);
  }
  protected get question(): QuestionPanelDynamicModel {
    return this.questionBase as QuestionPanelDynamicModel;
  }
  componentDidMount() {
    super.componentDidMount();
    this.setState({ panelCounter: 0 });
    const self: SurveyQuestionPanelDynamic = this;
    this.question.panelCountChangedCallback = function () {
      self.updateQuestionRendering();
    };
    this.question.currentIndexChangedCallback = function () {
      self.updateQuestionRendering();
    };
    this.question.renderModeChangedCallback = function () {
      self.updateQuestionRendering();
    };
  }
  componentWillUnmount() {
    super.componentWillUnmount();
    this.question.panelCountChangedCallback = null;
    this.question.currentIndexChangedCallback = null;
    this.question.renderModeChangedCallback = null;
  }
  private updateQuestionRendering() {
    this.setState({
      panelCounter: this.state ? this.state.panelCounter + 1 : 1,
    });
  }
  handleOnPanelAddClick(event: any) {
    this.question.addPanelUI();
  }
  handleOnPanelPrevClick(event: any) {
    this.question.goToPrevPanel();
  }
  handleOnPanelNextClick(event: any) {
    this.question.goToNextPanel();
  }
  handleOnRangeChange(event: any) {
    this.question.currentIndex = event.target.value;
  }
  protected renderElement(): JSX.Element {
    const panels = [];
    if (this.question.isRenderModeList) {
      for (let i = 0; i < this.question.panels.length; i++) {
        const panel = this.question.panels[i];
        panels.push(
          <SurveyQuestionPanelDynamicItem
            key={panel.id}
            element={panel}
            question={this.question}
            index={i}
            cssClasses={this.question.cssClasses}
            isDisplayMode={this.isDisplayMode}
            creator={this.creator}
          />
        );
      }
    } else {
      if (this.question.currentPanel != null) {
        const panel = this.question.currentPanel;
        panels.push(
          <SurveyQuestionPanelDynamicItem
            key={this.question.currentIndex}
            element={panel}
            question={this.question}
            index={this.question.currentIndex}
            cssClasses={this.question.cssClasses}
            isDisplayMode={this.isDisplayMode}
            creator={this.creator}
          />
        );
      }
    }
    const btnAdd: JSX.Element = this.question.isRenderModeList
      ? this.renderAddRowButton()
      : null;
    const navTop: JSX.Element = this.question.isProgressTopShowing
      ? this.renderNavigator()
      : null;
    const navBottom: JSX.Element = this.question.isProgressBottomShowing
      ? this.renderNavigator()
      : null;

    const style: any = {};
    if (this.question.horizontalScroll) {
      style["overflowX"] = "scroll";
    }
    const navV2 = this.renderNavigatorV2();
    const noEntriesPlaceholder = this.renderPlaceholder();
    return (
      <div className={this.question.cssClasses.root}>
        {noEntriesPlaceholder}
        {navTop}
        <div style={style}>{panels}</div>
        {navBottom}
        {btnAdd}
        {navV2}
      </div>
    );
  }
  protected renderNavigator(): JSX.Element {
    const range: JSX.Element = this.question.isRangeShowing ? this.renderRange() : null;
    const btnPrev: JSX.Element = this.rendrerPrevButton();
    const btnNext: JSX.Element = this.rendrerNextButton();
    const btnAdd: JSX.Element = this.renderAddRowButton();
    const progressClass: string = this.question.isProgressTopShowing
      ? this.question.cssClasses.progressTop
      : this.question.cssClasses.progressBottom;
    return (
      <div style={{ clear: "both" }} className={progressClass}>
        <div className={this.question.cssClasses.progressContainer}>
          {btnPrev}
          {range}
          {btnNext}
        </div>
        {btnAdd}
        {this.renderProgressText()}
      </div>
    );
  }
  private renderProgressText(): JSX.Element {
    return (<div className={this.question.cssClasses.progressText}>
      {this.question.progressText}
    </div>);
  }

  protected rendrerPrevButton() {
    return (
      <div title={this.question.panelPrevText} onClick={this.handleOnPanelPrevClick}>
        <SvgIcon
          className={this.question.getPrevButtonCss()}
          iconName={this.question.cssClasses.progressBtnIcon}
          size={"auto"}
        >
        </SvgIcon>
      </div>
    );
  }
  protected rendrerNextButton() {
    return (
      <div title={this.question.panelNextText} onClick={this.handleOnPanelNextClick}>
        <SvgIcon
          className={this.question.getNextButtonCss()}
          iconName={this.question.cssClasses.progressBtnIcon}
          size={"auto"}
        >
        </SvgIcon>
      </div>
    );
  }

  protected renderRange(): JSX.Element {
    const getProgress = () => {
      const rangeMax: number = this.question.panelCount - 1;
      return (this.question.currentIndex / rangeMax) * 100 + "%";
    };

    return (
      <div className={this.question.cssClasses.progress}>
        <div
          className={this.question.cssClasses.progressBar}
          style={{ width: getProgress() }}
          role="progressbar"
        />
      </div>
    );
  }
  protected renderAddRowButton(): JSX.Element {
    if (!this.question.canAddPanel) return null;
    return (
      <button type="button" className={this.question.getAddButtonCss()} onClick={this.handleOnPanelAddClick} >
        <span className={this.question.cssClasses.buttonAddText}> {this.question.panelAddText} </span>
        <span></span>
      </button>
    );
  }
  protected renderNavigatorV2(): JSX.Element {
    if(this.question.panelCount === 0) return null;
    const range: JSX.Element = this.question.isRangeShowing && !this.question.isProgressTopShowing ? this.renderRange() : null;
    const addBtn = this.renderAddRowButton();
    const prevBtn = this.rendrerPrevButton();
    const nextBtn = this.rendrerNextButton();
    const progressText = this.renderProgressText();
    if(!this.question.cssClasses.footer) {
      return null;
    }
    return (<div className={this.question.cssClasses.footer}>
      {range}
      <hr className={this.question.cssClasses.separator} />
      <div className={this.question.cssClasses.footerButtonsContainer}>
        {addBtn}
        {!this.question.isRenderModeList ? <div className={this.question.cssClasses.progressContainer}>
          {prevBtn}
          {progressText}
          {nextBtn}
        </div> : null}
      </div>
    </div>);
  }
  protected renderPlaceholder(): JSX.Element {
    if(this.question.getShowNoEntriesPlaceholder()) {
      return (
        <div className={this.question.cssClasses.noEntriesPlaceholder}>
          <span>{this.renderLocString(this.question.locNoEntriesText)}</span>
          {this.renderAddRowButton()}
        </div>
      );
    }
    return null;
  }
}

export class SurveyQuestionPanelDynamicItem extends SurveyPanel {
  constructor(props: any) {
    super(props);
    this.handleOnPanelRemoveClick = this.handleOnPanelRemoveClick.bind(this);
  }
  private get question(): QuestionPanelDynamicModel {
    return this.props.question;
  }
  private get index(): number {
    return this.props.index;
  }
  protected getSurvey(): SurveyModel {
    return !!this.question ? (this.question.survey as SurveyModel) : null;
  }
  protected getCss(): any {
    const survey = this.getSurvey();
    return !!survey ? survey.getCss() : {};
  }
  handleOnPanelRemoveClick(event: any) {
    this.question.removePanelUI(this.index);
  }
  public render() {
    const panel: JSX.Element = super.render();
    const removeButton: JSX.Element = this.renderButton();
    const separator: JSX.Element = this.question.isRenderModeList && this.index < this.question.panelCount - 1 ?
      (<hr className={this.question.cssClasses.separator} />) : null;
    return (
      <>
        <div className={this.question.getPanelWrapperCss()}>
          {panel}
          {removeButton}
        </div>
        {separator}
      </>
    );
  }
  protected renderButton(): JSX.Element {
    if (
      !this.question.canRemovePanel ||
      (this.question.isRenderModeList && this.panel.isCollapsed)
    )
      return null;
    return (
      <button
        className={this.question.getPanelRemoveButtonCss()}
        onClick={this.handleOnPanelRemoveClick}
        type="button">
        <span
          className={this.question.cssClasses.buttonRemoveText}
        > {this.question.panelRemoveText}
        </span>
        <span
          className={this.question.cssClasses.iconRemove}
        ></span>
      </button>
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("paneldynamic", props => {
  return React.createElement(SurveyQuestionPanelDynamic, props);
});

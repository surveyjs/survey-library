import * as React from "react";
import {
  ReactSurveyElement,
  SurveyQuestionElementBase
} from "./reactquestionelement";
import {
  QuestionPanelDynamicModel,
  QuestionPanelDynamicItem
} from "../question_paneldynamic";
import { PanelModel } from "../panel";
import { SurveyPanel } from "./panel";
import { ISurveyCreator } from "./reactquestion";
import { ReactQuestionFactory } from "./reactquestionfactory";
import { SurveyModel } from "../survey";
import { Question } from "../question";

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
    var self = this;
    this.question.panelCountChangedCallback = function() {
      self.updateQuestionRendering();
    };
    this.question.currentIndexChangedCallback = function() {
      self.updateQuestionRendering();
    };
    this.question.renderModeChangedCallback = function() {
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
      panelCounter: this.state ? this.state.panelCounter + 1 : 1
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
  render(): JSX.Element {
    if (!this.question) return null;
    var cssClasses = this.question.cssClasses;
    var panels = [];
    if (this.question.isRenderModeList) {
      for (var i = 0; i < this.question.panels.length; i++) {
        var panel = this.question.panels[i];
        panels.push(
          <SurveyQuestionPanelDynamicItem
            key={panel.id}
            element={panel}
            question={this.question}
            index={i}
            cssClasses={cssClasses}
            isDisplayMode={this.isDisplayMode}
            creator={this.creator}
          />
        );
      }
    } else {
      if (this.question.currentPanel != null) {
        var panel = this.question.currentPanel;
        panels.push(
          <SurveyQuestionPanelDynamicItem
            key={this.question.currentIndex}
            element={panel}
            question={this.question}
            index={this.question.currentIndex}
            cssClasses={cssClasses}
            isDisplayMode={this.isDisplayMode}
            creator={this.creator}
          />
        );
      }
    }
    var btnDeleteTD = !this.isDisplayMode ? <td /> : null;
    var btnAdd = this.question.isRenderModeList
      ? this.renderAddRowButton()
      : null;
    var navTop = this.question.isProgressTopShowing
      ? this.renderNavigator(cssClasses)
      : null;
    var navBottom = this.question.isProgressBottomShowing
      ? this.renderNavigator(cssClasses)
      : null;

    var style: any = {};
    if (this.question.horizontalScroll) {
      style["overflowX"] = "scroll";
    }

    return (
      <div className={cssClasses.root}>
        {navTop}
        <div style={style}>{panels}</div>
        {navBottom}
        {btnAdd}
      </div>
    );
  }
  protected renderNavigator(cssClasses: any): JSX.Element {
    var range = this.question.isRangeShowing ? this.renderRange() : null;
    var btnPrev = this.rendrerPrevButton();
    var btnNext = this.rendrerNextButton();
    var btnAdd = this.renderAddRowButton();
    var progressClass = this.question.isProgressTopShowing
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
        <div className={this.question.cssClasses.progressText}>
          {this.question.progressText}
        </div>
      </div>
    );
  }

  protected rendrerPrevButton() {
    var getButtonPrevCss = (question: Question) => {
      var btnClasses = question.cssClasses.buttonPrev;
      if (!question.isPrevButtonShowing) {
        btnClasses += " " + question.cssClasses.buttonPrev + "--disabled";
      }
      return btnClasses;
    };

    return (
      <div title={this.question.panelPrevText}>
        <svg
          viewBox="0 0 10 10"
          className={getButtonPrevCss(this.question)}
          onClick={this.handleOnPanelPrevClick}
        >
          <polygon points="2,2 0,4 5,9 10,4 8,2 5,5 " />
        </svg>
      </div>
    );
  }
  protected rendrerNextButton() {
    var getButtonNextCss = function(question: Question) {
      var btnClasses = question.cssClasses.buttonNext;
      if (!question.isNextButtonShowing) {
        btnClasses += " " + question.cssClasses.buttonNext + "--disabled";
      }
      return btnClasses;
    };

    return (
      <div title={this.question.panelNextText}>
        <svg
          viewBox="0 0 10 10"
          className={getButtonNextCss(this.question)}
          onClick={this.handleOnPanelNextClick}
        >
          <polygon points="2,2 0,4 5,9 10,4 8,2 5,5 " />
        </svg>
      </div>
    );
  }

  protected renderRange(): JSX.Element {
    var getProgress = () => {
      var rangeMax = this.question.panelCount - 1;
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

    var classes =
      this.question.cssClasses.button +
      " " +
      this.question.cssClasses.buttonAdd;

    if (this.question.renderMode === "list") {
      classes += " " + this.question.cssClasses.buttonAdd + "--list-mode";
    }

    return (
      <input
        className={classes}
        type="button"
        onClick={this.handleOnPanelAddClick}
        value={this.question.panelAddText}
      />
    );
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
    var survey = this.getSurvey();
    return !!survey ? survey.getCss() : {};
  }
  handleOnPanelRemoveClick(event: any) {
    this.question.removePanelUI(this.index);
  }
  protected renderBottom(): JSX.Element {
    if (!this.question) return null;
    var hr =
      this.question.isRenderModeList &&
      this.index < this.question.panelCount - 1 ? (
        <hr className={this.question.cssClasses.separator} />
      ) : null;
    var removeButton = this.renderButton();
    return (
      <div>
        {removeButton}
        {hr}
      </div>
    );
  }
  protected renderButton(): JSX.Element {
    if (
      !this.question.canRemovePanel ||
      (this.question.isRenderModeList && this.panel.isCollapsed)
    )
      return null;
    var style = { marginTop: "5px" };
    return (
      <input
        className={
          this.question.cssClasses.button +
          " " +
          this.question.cssClasses.buttonRemove
        }
        style={style}
        type="button"
        onClick={this.handleOnPanelRemoveClick}
        value={this.question.panelRemoveText}
      />
    );
  }
}

ReactQuestionFactory.Instance.registerQuestion("paneldynamic", props => {
  return React.createElement(SurveyQuestionPanelDynamic, props);
});

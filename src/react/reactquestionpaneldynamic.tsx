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
import { SurveyPanel } from "./reactpage";
import { ISurveyCreator } from "./reactquestion";
import { surveyCss } from "../defaultCss/cssstandard";
import { ReactQuestionFactory } from "./reactquestionfactory";

export class SurveyQuestionPanelDynamic extends SurveyQuestionElementBase {
  constructor(props: any) {
    super(props);
    this.setProperties(props);
  }
  protected get question(): QuestionPanelDynamicModel {
    return this.questionBase as QuestionPanelDynamicModel;
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  componentDidMount() {
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
    this.question.panelCountChangedCallback = null;
    this.question.currentIndexChangedCallback = null;
    this.question.renderModeChangedCallback = null;
  }
  private setProperties(nextProps: any) {
    this.handleOnPanelAddClick = this.handleOnPanelAddClick.bind(this);
    this.handleOnPanelPrevClick = this.handleOnPanelPrevClick.bind(this);
    this.handleOnPanelNextClick = this.handleOnPanelNextClick.bind(this);
    this.handleOnRangeChange = this.handleOnRangeChange.bind(this);
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
    this.question.currentIndex--;
  }
  handleOnPanelNextClick(event: any) {
    this.question.currentIndex++;
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
            panel={panel}
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
            panel={panel}
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
      ? this.renderAddRowButton(cssClasses, { marginTop: "5px" })
      : null;
    var navTop = this.question.isProgressTopShowing
      ? this.renderNavigator(cssClasses)
      : null;
    var navBottom = this.question.isProgressBottomShowing
      ? this.renderNavigator(cssClasses)
      : null;
    return (
      <div className={cssClasses.root}>
        {navTop}
        {panels}
        {navBottom}
        {btnAdd}
      </div>
    );
  }
  protected renderNavigator(cssClasses: any): JSX.Element {
    var style = { float: "left", margin: "5px" };
    var range = this.question.isRangeShowing ? this.renderRange(style) : null;
    var btnPrev = this.question.isPrevButtonShowing
      ? this.renderButton(
          this.question.panelPrevText,
          cssClasses,
          style,
          this.handleOnPanelPrevClick
        )
      : null;
    var btnNext = this.question.isNextButtonShowing
      ? this.renderButton(
          this.question.panelNextText,
          cssClasses,
          style,
          this.handleOnPanelNextClick
        )
      : null;
    var btnAdd = this.renderAddRowButton(cssClasses, style);
    return (
      <div>
        {range}
        {btnPrev}
        {btnNext}
        {btnAdd}
      </div>
    );
  }
  protected renderRange(style: any): JSX.Element {
    var updatedStyle: { [index: string]: any } = { width: "25%" }; //TODO 25%.
    for (var attr in style) updatedStyle[attr] = style[attr];
    return (
      <input
        style={updatedStyle}
        type="range"
        onChange={this.handleOnRangeChange}
        min={0}
        max={this.question.panelCount - 1}
        value={this.question.currentIndex}
      />
    );
  }
  protected renderAddRowButton(cssClasses: any, style: any): JSX.Element {
    if (!this.question.canAddPanel) return null;
    return this.renderButton(
      this.question.panelAddText,
      cssClasses,
      style,
      this.handleOnPanelAddClick
    );
  }
  protected renderButton(
    text: string,
    cssClasses: any,
    style: any,
    onClick: any
  ): JSX.Element {
    return (
      <input
        className={cssClasses.button + " " + cssClasses.buttonAdd}
        style={style}
        type="button"
        onClick={onClick}
        value={text}
      />
    );
  }
}

export class SurveyQuestionPanelDynamicItem extends ReactSurveyElement {
  private panel: PanelModel;
  private question: QuestionPanelDynamicModel;
  private index: number;
  protected creator: ISurveyCreator;
  constructor(props: any) {
    super(props);
    this.setProperties(props);
  }
  componentWillReceiveProps(nextProps: any) {
    super.componentWillReceiveProps(nextProps);
    this.setProperties(nextProps);
  }
  private setProperties(nextProps: any) {
    this.panel = nextProps.panel;
    this.question = nextProps.question;
    this.index = nextProps.index;
    this.creator = nextProps.creator;
    this.handleOnPanelRemoveClick = this.handleOnPanelRemoveClick.bind(this);
  }
  handleOnPanelRemoveClick(event: any) {
    this.question.removePanelUI(this.index);
  }
  render(): JSX.Element {
    if (!this.panel) return null;
    this.question.survey;
    var panel = (
      <SurveyPanel
        key={this.index}
        panel={this.panel}
        css={surveyCss.getCss()}
        survey={this.question.survey}
        creator={this.creator}
      />
    );
    var hr =
      this.question.isRenderModeList &&
      this.index < this.question.panelCount - 1 ? (
        <hr />
      ) : null;
    var removeButton = this.renderButton();
    return (
      <div>
        {panel}
        {removeButton}
        {hr}
      </div>
    );
  }
  protected renderButton(): JSX.Element {
    if (!this.question.canRemovePanel) return null;
    var style = { marginTop: "5px" };
    return (
      <input
        className={this.cssClasses.button + " " + this.cssClasses.buttonRemove}
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

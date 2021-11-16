import * as React from "react";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";

export class SurveyNavigation extends SurveyNavigationBase {
  private mouseDownPage: any = null;
  constructor(props: any) {
    super(props);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleNextMouseDown = this.handleNextMouseDown.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleCompleteClick = this.handleCompleteClick.bind(this);
    this.handlePreviewClick = this.handlePreviewClick.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
  }
  handlePrevClick(event: any) {
    this.survey.prevPage();
  }
  handleNextClick(event: any) {
    if (!!this.mouseDownPage && this.mouseDownPage !== this.survey.currentPage)
      return;
    this.mouseDownPage = null;
    this.survey.nextPage();
  }
  handleNextMouseDown(event: any) {
    this.mouseDownPage = this.survey.currentPage;
    return this.survey.navigationMouseDown();
  }
  handleMouseDown(event: any) {
    return this.survey.navigationMouseDown();
  }
  handleCompleteClick(event: any) {
    this.survey.completeLastPage();
  }
  handlePreviewClick(event: any) {
    this.survey.showPreview();
  }
  handleStartClick(event: any) {
    this.survey.start();
  }
  render(): JSX.Element {
    if (!this.survey || this.survey.isNavigationButtonsShowing === "none")
      return null;
    var isStartedPage = this.survey.state === "starting";
    var prevButton =
      this.survey.isShowPrevButton
        ? this.renderButton(
          this.handlePrevClick,
          this.handleMouseDown,
          this.survey.pagePrevText,
          this.survey.cssNavigationPrev
        )
        : null;
    var nextButton =
      this.survey.isShowNextButton
        ? this.renderButton(
          this.handleNextClick,
          this.handleNextMouseDown,
          this.survey.pageNextText,
          this.survey.cssNavigationNext
        )
        : null;
    var completeButton =
      this.survey.isCompleteButtonVisible
        ? this.renderButton(
          this.handleCompleteClick,
          this.handleMouseDown,
          this.survey.completeText,
          this.survey.cssNavigationComplete
        )
        : null;
    var previewButton =
      !isStartedPage &&
      this.survey.isLastPage &&
      this.survey.isPreviewButtonVisible
        ? this.renderButton(
          this.handlePreviewClick,
          this.handleMouseDown,
          this.survey.previewText,
          this.survey.cssNavigationPreview
        )
        : null;
    var startButton = isStartedPage
      ? this.renderButton(
        this.handleStartClick,
        null,
        this.survey.startSurveyText,
        this.survey.cssNavigationStart
      )
      : null;
    return (
      <div className={this.css.footer}>
        {startButton}
        {prevButton}
        {nextButton}
        {previewButton}
        {completeButton}
      </div>
    );
  }
  protected renderButton(
    click: any,
    mouseDown: any,
    text: string,
    btnClassName: string
  ): JSX.Element {
    var style = { marginRight: "5px" };
    return (
      <input
        className={btnClassName}
        style={style}
        type="button"
        onMouseDown={mouseDown}
        onClick={click}
        value={text}
      />
    );
  }
}

import * as React from "react";
import { SurveyModel } from "../survey";
import { SurveyNavigationBase } from "./reactSurveyNavigationBase";

export class SurveyNavigation extends SurveyNavigationBase {
  constructor(props: any) {
    super(props);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handleCompleteClick = this.handleCompleteClick.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
  }
  handlePrevClick(event) {
    this.survey.prevPage();
  }
  handleNextClick(event) {
    this.survey.nextPage();
  }
  handleCompleteClick(event) {
    this.survey.completeLastPage();
  }
  handleStartClick(event) {
    this.survey.start();
  }
  render(): JSX.Element {
    if (!this.survey || !this.survey.isNavigationButtonsShowing) return null;
    var isStartedPage = this.survey.state === "starting";
    var prevButton =
      !isStartedPage && !this.survey.isFirstPage && this.survey.isShowPrevButton
        ? this.renderButton(
            this.handlePrevClick,
            this.survey.pagePrevText,
            this.css.navigation.prev
          )
        : null;
    var nextButton =
      !isStartedPage && !this.survey.isLastPage
        ? this.renderButton(
            this.handleNextClick,
            this.survey.pageNextText,
            this.css.navigation.next
          )
        : null;
    var completeButton =
      !isStartedPage && this.survey.isLastPage && this.survey.isEditMode
        ? this.renderButton(
            this.handleCompleteClick,
            this.survey.completeText,
            this.css.navigation.complete
          )
        : null;
    var startButton = isStartedPage
      ? this.renderButton(
          this.handleStartClick,
          this.survey.startSurveyText,
          this.css.navigationButton.start
        )
      : null;
    return (
      <div className={this.css.footer}>
        {startButton}
        {prevButton}
        {nextButton}
        {completeButton}
      </div>
    );
  }
  protected renderButton(
    click: any,
    text: string,
    btnClassName: string
  ): JSX.Element {
    var style = { marginRight: "5px" };
    var className =
      this.css.navigationButton + (btnClassName ? " " + btnClassName : "");
    return (
      <input
        className={className}
        style={style}
        type="button"
        onClick={click}
        value={text}
      />
    );
  }
}

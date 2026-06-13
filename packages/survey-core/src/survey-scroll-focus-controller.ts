import { Base } from "./base";
import { IElement } from "./base-interfaces";
import { PageModel } from "./page";
import { Question } from "./question";

export interface ISurveyScrollFocusHost {
  readonly activePage: PageModel;
  currentPage: PageModel;
  currentSingleElement: IElement;
  readonly autoFocusFirstQuestion: boolean;
  readonly skippedPages: Array<{ from: any, to: any }>;
  isCurrentPageRendering: boolean;
}

export class SurveyScrollFocusController extends Base {
  private focusingQuestionInfo: { question: Question, onError: boolean };

  private survey: ISurveyScrollFocusHost;

  constructor(survey: ISurveyScrollFocusHost) {
    super();
    this.survey = survey;
  }

  public get isFocusingQuestion(): boolean {
    return !!this.focusingQuestionInfo;
  }
  public focusQuestionByInstance(question: Question, onError: boolean = false): boolean {
    if (!question || !question.isVisible || !question.page) return false;
    const oldQuestion = this.focusingQuestionInfo?.question;
    if (oldQuestion === question) return false;
    const survey = this.survey;
    this.focusingQuestionInfo = { question: question, onError: onError };
    const curElement = survey.currentSingleElement;
    survey.skippedPages.push({ from: curElement || survey.currentPage, to: curElement ? question : question.page });
    const isNeedWaitForPageRendered = survey.activePage !== question.page && !question.page.isStartPage;
    if (isNeedWaitForPageRendered) {
      survey.currentPage = <PageModel>question.page;
    }
    survey.currentSingleElement = question;
    if (!isNeedWaitForPageRendered) {
      this.focusQuestionInfo();
    }
    return true;
  }
  public focusQuestionInfo(): void {
    const question = this.focusingQuestionInfo?.question;
    if (!!question && !question.isDisposed) {
      question.focus(this.focusingQuestionInfo.onError);
    }
    this.focusingQuestionInfo = undefined;
  }
  public focusFirstQuestion(): void {
    if (this.focusingQuestionInfo) return;
    const page = this.survey.activePage;
    if (page) {
      page.scrollToTop();
      page.focusFirstQuestion();
    }
  }
  public scrollToTopOnPageChange(doScroll: boolean = true): void {
    const survey = this.survey;
    const page = survey.activePage;
    if (!page) return;
    if (doScroll) {
      page.scrollToTop();
    }
    if (survey.isCurrentPageRendering && survey.autoFocusFirstQuestion && !this.focusingQuestionInfo) {
      page.focusFirstQuestion();
      survey.isCurrentPageRendering = false;
    }
  }
}

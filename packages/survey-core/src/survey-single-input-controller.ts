import { Base } from "./base";
import { IElement, ISurveyElement } from "./base-interfaces";
import { PageModel } from "./page";
import { Question } from "./question";
import { CurrentPageChangedEvent } from "./survey-events-api";

export interface ISurveySingleInputHost {
  visiblePages: Array<PageModel>;
  currentPage: PageModel;
  autoFocusFirstQuestion: boolean;
  questionsOnPageMode: string;
  isSingleVisibleQuestion: boolean;
  isSingleVisibleInput: boolean;
  onCurrentPageChanged: { fire(sender: any, options: CurrentPageChangedEvent): void };
  createPageChangeEventOptions(newValue: PageModel, oldValue: PageModel, newQuestion?: Question, oldQuestion?: Question): CurrentPageChangedEvent;
  currentPageChanging(options: any, onSuccess: () => void): void;
  updateButtonsVisibility(): void;
  sendPartialResult(): void;
  checkTriggers(key: any, isOnNextPage: boolean, isOnComplete?: boolean, isOnNavigation?: boolean, name?: string): void;
  validateSingleElement(el: Question, onComplete: (hasErrors: boolean) => void): boolean;
}

export class SurveySingleInputController extends Base {
  private elementValue: IElement;

  private survey: ISurveySingleInputHost;

  constructor(survey: ISurveySingleInputHost) {
    super();
    this.survey = survey;
  }

  public get currentSingleElement(): IElement {
    return this.elementValue;
  }
  public set currentSingleElement(val: IElement) {
    const survey = this.survey;
    if (!!val && val.isQuestion && this.isSingleVisibleQuestionVal(survey.questionsOnPageMode)) {
      while(val.parent && val.parent.isPanel) {
        val = <IElement>(<any>val.parent);
      }
    }
    const oldVal = this.currentSingleElement;
    if (val !== oldVal) {
      const valQuestion = val?.isQuestion ? <Question>val : undefined;
      const oldValQuestion = oldVal?.isQuestion ? <Question>oldVal : undefined;
      const page = <PageModel>(<any>val)?.page;
      const options: any = !!page && !!oldVal ? survey.createPageChangeEventOptions(page, <PageModel>(<any>oldVal).page, valQuestion, oldValQuestion) : undefined;
      const changingFunc = () => {
        this.elementValue = val;
        if (!!val) {
          if (survey.isSingleVisibleInput && val.isQuestion) {
            (<Question>val).onSetAsSingleInput();
          }
          page.updateRows();
          if (page !== survey.currentPage) {
            survey.currentPage = page;
          } else {
            if (!!valQuestion && survey.autoFocusFirstQuestion) {
              valQuestion.focus();
            }
          }
          survey.updateButtonsVisibility();
          if (!!options) {
            survey.onCurrentPageChanged.fire(survey, options);
          }
        } else {
          survey.visiblePages.forEach(page => page.updateRows());
        }
      };

      if (!options) {
        changingFunc();
      } else {
        survey.currentPageChanging(options, changingFunc);
      }
    }
  }
  public isSingleVisibleQuestionVal(val: string): boolean {
    return val === "questionPerPage" || val === "questionOnPage";
  }
  private getSingleElements(includeEl?: IElement): Array<IElement> {
    const res = new Array<IElement>();
    const pages = this.survey.visiblePages;
    const isSingleInput = this.survey.isSingleVisibleInput;
    for (var i: number = 0; i < pages.length; i++) {
      const p = pages[i];
      if (!p.isStartPage) {
        const els: Array<any> = [];
        if (isSingleInput) {
          p.addQuestionsToList(els, true);
        } else {
          p.elements.forEach(el => els.push(el));
        }
        els.forEach(el => { if (el === includeEl || el.isVisible) res.push(el); });
      }
    }
    return res;
  }
  public changeCurrentSingleElementOnVisibilityChanged(): void {
    const el = this.currentSingleElement;
    if (!el || el.isVisible) return;
    const els = this.getSingleElements(el);
    const index = els.indexOf(el);
    const newEl = (index > 0) ? els[index - 1] : (index < els.length - 1 ? els[index + 1] : undefined);
    this.currentSingleElement = newEl;
  }
  public moveToFirstElement(): void {
    const els = this.getSingleElements();
    if (els.length > 0) {
      this.currentSingleElement = els[0];
    }
  }
  public performNext(): boolean {
    const survey = this.survey;
    const q: any = this.currentSingleElement;
    if (!q) return false;
    if (survey.isSingleVisibleInput) {
      if (!q.validateSingleInput()) return false;
      if (q.nextSingleInput()) {
        survey.updateButtonsVisibility();
        return true;
      }
    }
    const res = survey.validateSingleElement(q, (hasErrors: boolean) => {
      if (!hasErrors) {
        this.performNextAfterValidation(q);
      }
    });
    return res === true;
  }
  private performNextAfterValidation(q: Question): boolean {
    this.survey.sendPartialResult();
    const questions = this.getSingleElements();
    const index = questions.indexOf(q);
    if (index < 0 || index === questions.length - 1) return false;
    let keys: any = {};
    if (q.isQuestion) {
      keys[q.name] = q.value;
    } else {
      if (q.isPanel) {
        keys = q.getValue();
      }
    }
    this.survey.checkTriggers(keys, true, false, true, q.name);
    if (q === this.currentSingleElement) {
      this.currentSingleElement = questions[index + 1];
    }
  }
  public prevPageSingleElement(curElement: IElement): boolean {
    if (this.survey.isSingleVisibleInput) {
      if ((<Question>curElement).prevSingleInput()) {
        this.survey.updateButtonsVisibility();
        return true;
      }
    }
    const questions = this.getSingleElements();
    const index = questions.indexOf(curElement);
    if (index === 0) return false;
    this.currentSingleElement = questions[index - 1];
    return true;
  }
  public getFirstLastElementState(): { isFirst?: boolean, isLast?: boolean } {
    let fVal: boolean | undefined = undefined;
    let lVal: boolean | undefined = undefined;
    const q = this.currentSingleElement;
    if (!!q) {
      let isFirstInput = true;
      let isLastInput = true;
      if (this.survey.isSingleVisibleInput) {
        const inputState = (<Question>q).getSingleInputElementPos();
        if (inputState !== 0) {
          isFirstInput = inputState === -1;
          isLastInput = inputState === 1;
        }
      }
      const questions = this.getSingleElements();
      const index = questions.indexOf(q);
      if (index >= 0) {
        fVal = isFirstInput && index === 0;
        lVal = isLastInput && index === questions.length - 1;
      }
    }
    return { isFirst: fVal, isLast: lVal };
  }
  public changeCurrentPage(newPage: PageModel): boolean {
    const curEl = this.currentSingleElement;
    if (!!curEl && newPage !== (<any>curEl).page) {
      this.currentSingleElement = newPage.getFirstVisibleElement();
      return true;
    }
    return false;
  }
  public setCurrentElement(val: ISurveyElement): void {
    const page = (<any>val).page;
    if (!!page && !this.survey.isSingleVisibleQuestion) {
      this.survey.currentPage = page;
    } else {
      this.currentSingleElement = <IElement>val;
    }
  }
  public resetToFirstElement(): void {
    if (this.currentSingleElement) {
      const questions = this.getSingleElements();
      this.currentSingleElement = questions.length > 0 ? questions[0] : undefined;
    }
  }
  public syncWithCurrentPage(): void {
    const el: any = this.currentSingleElement;
    const curPage = this.survey.currentPage;
    if (!!el && !!curPage && el.page !== curPage) {
      this.currentSingleElement = curPage.getFirstVisibleElement();
    }
  }
  public onCancelPreview(): void {
    const page = <PageModel>(<any>this.currentSingleElement)?.page;
    if (!!page) {
      page.updateRows();
      this.survey.currentPage = page;
    }
  }
}

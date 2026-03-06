import type { Question } from "./question";
import { QuestionSingleInputSummary } from "./questionSingleInputSummary";
import { LocalizableString } from "./localizablestring";
import { Action } from "./actions/action";
import { ActionContainer } from "./actions/container";
import { ISurveySingleInput } from "./base-interfaces";

export class QuestionSingleInputBehavior {
  private isSingleInputSummaryShown: boolean;

  constructor(protected question: Question) {}

  protected get isSingleInputMode(): boolean {
    return this.question.singleInput?.isSingleVisibleInput;
  }

  public get isSingleInputActive(): boolean {
    if (!this.isSingleInputMode) return false;
    const ssQ = this.question.singleInput.currentSingleQuestion;
    return !!ssQ && ssQ === this.rootParentQuestion;
  }

  protected getPropertyValue(name: string, defaultValue?: any, calcFunc?: ()=> any): any {
    return this.question.getPropertyValue(name, defaultValue, calcFunc);
  }
  protected resetPropertyValue(name: string): void {
    this.question.resetPropertyValue(name);
  }
  protected get survey(): ISurveySingleInput {
    return this.question.singleInput;
  }
  private calculateSingleInputQuestion(): Question {
    if (!this.isSingleInputActive) {
      return undefined;
    }
    const questions = this.getSingleInputQuestions();
    if (Array.isArray(questions) && questions.length > 0) {
      const q = questions[0];
      this.onBeforeSetSingleInputQuestion(q);
      return q;
    }
    return undefined;
  }

  //#region singleInput
  public get singleInputQuestion(): Question {
    if (!this.isSingleInputMode) return undefined;
    return this.getPropertyValue("singleInputQuestion", undefined, () => this.calculateSingleInputQuestion());
  }

  public get currentSingleInputQuestion(): Question {
    let res = this.singleInputQuestion;
    while(!!res && !!res.singleInputQuestion && res.singleInputQuestion !== res) {
      res = res.singleInputQuestion;
    }
    return res;
  }

  public get currentSingleInputParentQuestion(): Question {
    const q = this.currentSingleInputQuestion;
    if (!q) return this.question;
    if (q.singleInputQuestion === q) return q;
    return q.parentQuestion || this.question;
  }

  public get singleInputSummary(): QuestionSingleInputSummary {
    return this.getPropertyValue("singleInputSummary", undefined, () => {
      if (!this.supportNestedSingleInput()) return undefined;
      const q = this.singleInputQuestion;
      if (!q || q !== this.question) return undefined;
      const res = this.createSingleInputSummary();
      if (!!res) {
        this.calcSingleInputActions();
        this.resetPropertyValue("singleInputLocTitle");
      }
      return res;
    });
  }

  protected createSingleInputSummary(): QuestionSingleInputSummary {
    return undefined;
  }

  private get rootParentQuestion(): Question {
    return this.question.rootParentQuestion;
  }

  private getParentQuestions(): Array<Question> {
    const res = new Array<Question>();
    let q: Question = this.question;
    while(!!q.parentQuestion) {
      res.push(q.parentQuestion);
      q = q.parentQuestion;
    }
    return res;
  }

  public focusSingleInput(onError: boolean): void {
    this.survey.currentSingleQuestion = this.rootParentQuestion;
    const parents = this.getParentQuestions();
    for (let i = parents.length - 1; i >= 1; i--) {
      if (i === parents.length - 1) {
        parents[i].singleInputBehavior.setSingleInputQuestion(parents[i - 1]);
      }
    }
    if (parents.length > 0) {
      parents[0].singleInputBehavior.setSingleInputQuestion(this.question);
    }
    this.question.focusInputElement(onError);
  }

  public resetSingleInput(): void {
    this.resetSingleInputCore();
  }

  private resetSingleInputCore(): void {
    const prev = this.getPropertyValue("singleInputQuestion");
    this.resetPropertyValue("singleInputQuestion");
    if (!!prev) {
      this.onSingleInputChanged();
    }
  }

  protected onSingleInputChanged(resetSummary: boolean = true): void {
    if (resetSummary) {
      this.resetSingleInputSummary();
    }
    this.singleInputLocTitle?.strChanged();
    this.resetPropertyValue("singleInputLocTitle");
    this.calcSingleInputActions();
    this.survey?.updateNavigationElements();
  }

  public resetSingleInputSummary(): void {
    this.singleInputSummary?.dispose();
    this.resetPropertyValue("singleInputSummary");
  }

  public validateSingleInput(): boolean {
    const q = this.currentSingleInputQuestion;
    if (!q) return true;
    return q.validate(true, true);
  }

  public getSingleInputElementPos(): number {
    if (this.singleInputQuestion === this.question) return 0;
    const pQ = this.currentSingleInputParentQuestion;
    if (pQ !== this.question) {
      let res = pQ.getSingleInputElementPos();
      if (res === 2) return 2;
    }
    const q = this.singleInputQuestion;
    const questions = this.getSingleInputQuestions();
    if (questions.length < 2) return 0;
    let index = questions.indexOf(q);
    return index === 0 ? -1 : (index >= questions.length - 1 ? 1 : 2);
  }

  public singleInputOnAddItem(isOnDataChanging: boolean): void {
    if (this.isSingleInputActive) {
      if (isOnDataChanging && this.singleInputSummary) {
        this.resetSingleInputSummary();
      } else {
        this.setSingleQuestionOnChange(Number.MAX_VALUE);
      }
    }
  }

  public singleInputOnRemoveItem(index: number): void {
    if (this.isSingleInputActive) {
      if (!this.singleInputSummary) {
        this.setSingleQuestionOnChange(index);
      } else {
        this.onSingleInputChanged();
      }
    }
  }

  protected getSingleQuestionOnChange(index: number): Question { return null; }

  private setSingleQuestionOnChange(index: number): void {
    const q = this.getSingleQuestionOnChange(index);
    if (!!q) {
      this.setSingleInputQuestion(q);
    } else {
      this.resetSingleInput();
    }
  }

  public onSetAsSingleInput(): void {
    this.isSingleInputSummaryShown = false;
    const needReset = !this.question.wasRendered || this.singleInputSummary;
    this.question.onFirstRendering();
    if (needReset) {
      this.resetSingleInputSummary();
      this.resetPropertyValue("singleInputQuestion");
      this.resetPropertyValue("singleInputLocTitle");
    }
  }

  public nextSingleInput(): boolean {
    return this.nextPrevSingleInput(1);
  }

  public prevSingleInput(): boolean {
    return this.nextPrevSingleInput(-1);
  }

  public getSingleInputAddText(): string {
    const q = this.currentSingleInputQuestion;
    if (!q) return undefined;
    if (!!q.singleInputSummary) return this.getBehavior(q).getSingleInputAddTextCore();
    const qs = this.getSingleInputQuestions();
    const len = Array.isArray(qs) ? qs.length : 0;
    if (len > 0 && qs[len - 1] === q) return this.getSingleInputAddTextCore();
    return undefined;
  }

  public singleInputAddItem(checkErrors?: boolean): void {
    if (!checkErrors || this.validateSingleInput()) {
      this.getBehavior(this.currentSingleInputQuestion).singleInputAddItemCore();
    }
  }

  public get singleInputLocTitle(): LocalizableString {
    return this.getPropertyValue("singleInputLocTitle", undefined, () => {
      return this.getSingleQuestionLocTitle();
    });
  }
  public getLocTitle(): LocalizableString {
    return this.isSingleInputActive ? this.singleInputLocTitle : null;
  }
  public get singleInputActions(): ActionContainer {
    return this.getPropertyValue("singleInputActions", undefined, () => {
      return this.createSingleInputActions();
    });
  }

  public get singleInputHasActions(): boolean {
    return this.getPropertyValue("singleInputHasActions", undefined, () => {
      return this.createSingleInputActions();
    });
  }

  public get singleInputHideHeader(): boolean {
    const childQ = this.singleInputQuestion?.singleInputQuestion;
    return !!childQ && this.singleInputQuestion !== this.question;
  }

  private set singleInputHasActionsValue(val: boolean) {
    this.question.setPropertyValue("singleInputHasActions", val);
  }

  private get singleInputParentQuestion(): Question {
    return this.singleInputQuestion?.parentQuestion || this.question;
  }

  private createSingleInputActions() {
    if ((<any>this.survey)?.currentSingleQuestion !== this.question) return undefined;
    const singleInputActions = new ActionContainer();
    singleInputActions.actions = this.getSingleQuestionActions();
    return singleInputActions;
  }

  public calcSingleInputActions(): void {
    if (!!this.question.parentQuestion) {
      this.getBehavior(this.question.parentQuestion).calcSingleInputActions();
    } else {
      const actions = this.getSingleQuestionActions();
      if (this.singleInputActions) {
        this.singleInputActions.actions = actions;
      }
      this.question.setPropertyValue("singleInputHasActions", actions.length > 0 ? true : undefined);
    }
  }

  private getSingleQuestionActions(): Array<Action> {
    const res = new Array<Action>();
    const p = this.currentSingleInputParentQuestion;
    if (!p || p === this.question) return res;
    const pBehavior = this.getBehavior(p);
    const pSQs = pBehavior.getSingleInputQuestions();
    const qs = new Array<Question>();
    let summaryQ = undefined;
    if (pSQs.length > 1 && pSQs[0] === p) {
      summaryQ = p;
      qs.push(p);
    }
    let pQ = p.parentQuestion;
    while(!!pQ) {
      qs.push(pQ);
      pQ = pQ.parentQuestion;
    }
    for (let i = qs.length - 1; i >= 0; i--) {
      const q = qs[i];
      if (q !== summaryQ) {
        const title = q.singleInputLocTitle;
        const action = new Action({ id: "single-action" + q.id, locTitle: title,
          css: this.question.cssClasses.breadcrumbsItem,
          innerCss: this.question.cssClasses.breadcrumbsItemButton,
          action: () => {
            this.getBehavior(q).singleInputMoveToFirst();
          }
        });

        action.cssClasses = {};
        res.push(action);
      }
    }
    return res;
  }

  public singleInputMoveToFirst(): void {
    const q = this.singleInputQuestion;
    if (!!q && q !== this.question) {
      this.getBehavior(q).singleInputMoveToFirst();
    }
    this.singleInputMoveToFirstCore();
  }

  protected singleInputMoveToFirstCore(): void {}

  private getSingleQuestionLocTitle(): LocalizableString {
    return !this.singleInputSummary ? this.getSingleQuestionLocTitleCore() : undefined;
  }

  protected getSingleQuestionLocTitleCore(): LocalizableString {
    return undefined;
  }

  private supportNestedSingleInput(): boolean {
    return this.survey?.supportsNestedSingleInput(this.question);
  }

  public getSingleInputQuestions(): Array<Question> {
    if (!this.supportNestedSingleInput()) return [];
    const question = this.getPropertyValue("singleInputQuestion");
    if (question === this.question) return [this.question];
    const res = this.getSingleInputQuestionsCore(question, !question || !this.isSingleInputSummaryShown);
    if (this.survey) {
      this.survey.updateNestedSingleQuestions(this.question, res);
    }
    res.forEach(q => { if (q !== this.question)this.onSingleInputQuestionAdded(q); });
    return res;
  }

  protected getSingleInputQuestionsCore(question: Question, checkDynamic: boolean): Array<Question> {
    return this.question.getNestedQuestions(true, false);
  }

  protected onSingleInputQuestionAdded(question: Question): void {}

  public fillSingleInputQuestionsInContainer(res: Array<Question>, innerQuestion: Question): void {}

  public getSingleInputQuestionsForDynamic(question: Question, arr: Array<Question>): Array<Question> {
    const res = new Array<Question>();
    if (!!question && question !== this.question && arr.indexOf(question) < 0) {
      this.fillSingleInputQuestionsInContainer(res, question);
    }
    arr.forEach(q => res.push(q));
    if (this.isSingleInputSummaryShown && res.length > 0) {
      res.unshift(this.question);
    }
    res.push(this.question);
    return res;
  }

  public getSingleInputAddTextCore(): string { return undefined; }

  public singleInputAddItemCore(): void {}

  private setSingleInputQuestionCore(question: Question): void {
    this.onBeforeSetSingleInputQuestion(question);
    this.question.setPropertyValue("singleInputQuestion", question);
  }

  private onBeforeSetSingleInputQuestion(question: Question): void {
    question.onFirstRendering();
    if (question === this.question) {
      this.isSingleInputSummaryShown = true;
    }
  }

  public setSingleInputQuestion(question: Question, onPrev?: boolean): void {
    if (this.singleInputQuestion !== question) {
      this.setSingleInputQuestionCore(question);
      this.onSingleInputChanged(!onPrev || question !== this.question);
    }
  }

  private nextPrevSingleInput(skip: number): boolean {
    let pQ = this.currentSingleInputParentQuestion;
    while(!!pQ && pQ !== this.question) {
      const res = this.getBehavior(pQ).nextPrevSingleInputCore(skip);
      if (res) return true;
      pQ = pQ.parentQuestion;
    }
    return this.nextPrevSingleInputCore(skip);
  }

  public nextPrevSingleInputCore(skip: number): boolean {
    const q = this.singleInputQuestion;
    if (!q) return false;
    const questions = this.getSingleInputQuestions();
    let index = questions.indexOf(q);
    if (index < 0) {
      if (questions.length === 0) return false;
      index = 0;
      skip = 0;
    }
    index += skip;
    if (index < 0 || index >= questions.length) return false;
    this.setSingleInputQuestion(questions[index], skip < 0);
    return true;
  }
  //#endregion

  protected getBehavior(q: Question): QuestionSingleInputBehavior {
    return (<any>q).singleInputBehavior;
  }
}

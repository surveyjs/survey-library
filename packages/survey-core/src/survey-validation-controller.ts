import { Helpers } from "./helpers";
import { PageModel } from "./page";
import { PanelModelBase } from "./panel";
import { Question, ValidationContext } from "./question";
import { SurveyError } from "./survey-error";
import { CustomError } from "./error";
import { ServerValidateQuestionsEvent, ValidatePageEvent } from "./survey-events-api";

export interface ISurveyValidationHost {
  activePage: PageModel;
  currentPage: PageModel;
  visiblePages: Array<PageModel>;
  isLastPage: boolean;
  autoFocusFirstError: boolean;
  isValidateOnComplete: boolean;
  isValidateOnValueChanging: boolean;
  isValidateOnValueChanged: boolean;
  onValidatePage: { isEmpty: boolean, fire(sender: any, options: ValidatePageEvent): void };
  onServerValidateQuestions: { isEmpty: boolean, length: number, fireByCreatingOptions(sender: any, createOptions: () => ServerValidateQuestionsEvent): void };
  canSkipValidation(doComplete: boolean, isPreview?: boolean): boolean;
  getServerValidationData(allData: boolean): { [index: string]: any };
  proceedWithNavigation(doComplete: boolean, isPreview: boolean): void;
  navigateAfterServerValidation(isPreview: boolean, page: PageModel): void;
  setIsValidatingOnServer(val: boolean): void;
}

export class SurveyValidationController {
  private serverValidationEventCount: number;

  private survey: ISurveyValidationHost;

  constructor(survey: ISurveyValidationHost) {
    this.survey = survey;
  }

  private get isValidateOnValueChange(): boolean {
    return this.survey.isValidateOnValueChanged || this.survey.isValidateOnValueChanging;
  }

  //#region Validation primitives
  public validateElements(elements: Array<PanelModelBase | Question>, fireCallback: boolean = true, focusFirstError: boolean = false, onAsyncValidation?: (hasErrors: boolean) => void, changeCurrentPage?: boolean): boolean {
    if (!!onAsyncValidation) {
      fireCallback = true;
    }
    const callbackResult = !!onAsyncValidation ? (res: boolean) => { onAsyncValidation(!res); } : undefined;
    const context = new ValidationContext({ fireCallback: fireCallback, focusOnFirstError: focusFirstError, callbackResult: callbackResult, changeCurrentPage: !!changeCurrentPage });
    for (const element of elements) {
      element.validateElement(context);
    }
    context.finish();
    return context.runningResult;
  }
  /**
   * Core page validation logic. Handles async callbacks and event firing.
   */
  public validatePage(page: PageModel, isFocusOnFirstError?: boolean, onAsyncValidation?: (hasErrors: boolean) => void): boolean {
    if (isFocusOnFirstError === undefined) {
      isFocusOnFirstError = this.survey.autoFocusFirstError;
    }
    if (!page) return true;

    let callback: any = undefined;
    let syncCallbackHasErrors: boolean | undefined;

    if (onAsyncValidation) {
      callback = (res: boolean) => {
        if (syncCallbackHasErrors === undefined) {
          syncCallbackHasErrors = !res;
        } else {
          const handlerHasErrors = this.fireValidatedErrorsOnPage(page);
          onAsyncValidation(!res || handlerHasErrors);
        }
      };
    }

    const res = page.validate(true, isFocusOnFirstError, callback);

    if (syncCallbackHasErrors === undefined && onAsyncValidation) {
      syncCallbackHasErrors = false;
      return res;
    }

    const handlerHasErrors = this.fireValidatedErrorsOnPage(page);
    if (onAsyncValidation && syncCallbackHasErrors !== undefined) {
      onAsyncValidation(syncCallbackHasErrors || handlerHasErrors);
    }

    return res && !handlerHasErrors;
  }
  /**
   * Fires the onValidatePage event for any errors on the page.
   * Returns true if the event handler added new errors.
   */
  private fireValidatedErrorsOnPage(page: PageModel): boolean {
    if (this.survey.onValidatePage.isEmpty || !page) return false;

    const questionsOnPage = new Array<Question>();
    page.questions.forEach(q => {
      q.getNestedQuestions(true, true, true).forEach(nQ => questionsOnPage.push(nQ));
    });
    const questions = new Array<Question>();
    const errors = new Array<SurveyError>();

    for (let i = 0; i < questionsOnPage.length; i++) {
      const q = questionsOnPage[i];
      if (q.errors.length > 0) {
        questions.push(q);
        for (let j = 0; j < q.errors.length; j++) {
          errors.push(q.errors[j]);
        }
      }
    }

    const errorsCountBeforeFire = errors.length;
    this.survey.onValidatePage.fire(this.survey, {
      questions: questions,
      errors: errors,
      page: page,
    });

    return errors.length > errorsCountBeforeFire;
  }
  //#endregion

  //#region Validation orchestration (navigation flow)
  /**
   * Validates before allowing page navigation. Decides what validation is needed
   * based on checkErrorsMode and other validation settings.
   */
  public validateOnNavigate(doComplete: boolean, isPreview?: boolean): boolean {
    if (this.survey.canSkipValidation(doComplete, isPreview)) {
      this.survey.proceedWithNavigation(doComplete, isPreview);
      return true;
    }

    const onAsyncValidationComplete = (hasErrors: boolean) => {
      if (!hasErrors) {
        this.survey.proceedWithNavigation(doComplete, isPreview);
      }
    };

    if (this.survey.isValidateOnComplete) {
      return this.validateAllPagesBeforeCompletion(onAsyncValidationComplete);
    }

    return this.validateCurrentPageBeforeNavigation(onAsyncValidationComplete);
  }
  /**
   * Validates the current page before proceeding with navigation.
   */
  private validateCurrentPageBeforeNavigation(onComplete: (hasErrors: boolean) => void): boolean {
    return this.validatePage(this.survey.activePage, true, onComplete) !== false;
  }
  /**
   * Validates all pages before completion (when using onComplete validation mode).
   * Returns false if validation has async operations, true if validation complete.
   */
  private validateAllPagesBeforeCompletion(onComplete: (hasErrors: boolean) => void): boolean {
    // On non-final pages, skip validation and proceed
    if (!this.survey.isLastPage) {
      this.survey.proceedWithNavigation(true, false);
      return true;
    }

    // On final page, validate all pages
    return this.validateElements(this.survey.visiblePages, true, this.survey.autoFocusFirstError, onComplete, true) !== true;
  }
  //#endregion

  //#region Page navigation validation
  /**
   * Validates all pages between `startIndex` and `targetIndex` (exclusive).
   */
  public validateIntermediatePages(startIndex: number, targetIndex: number): boolean {
    for (let i = startIndex; i < targetIndex; i++) {
      const page = this.survey.visiblePages[i];
      if (!page.validate(true, true)) return false;
      page.passed = true;
    }
    return true;
  }
  //#endregion

  //#region Server validation
  public doServerValidation(doComplete: boolean, isPreview: boolean = false, page?: PageModel): boolean {
    const serverValidateEvent = this.survey.onServerValidateQuestions;
    if (!serverValidateEvent || serverValidateEvent.isEmpty) return false;
    if (!doComplete && this.survey.isValidateOnComplete) return false;
    this.survey.setIsValidatingOnServer(true);
    const isFunc = typeof serverValidateEvent === "function";
    this.serverValidationEventCount = !isFunc ? serverValidateEvent.length : 1;
    if (isFunc) {
      (<Function><any>serverValidateEvent)(this.survey, this.createServerValidationOptions(doComplete, isPreview, page));
    } else {
      serverValidateEvent.fireByCreatingOptions(this.survey, () => { return this.createServerValidationOptions(doComplete, isPreview, page); });
    }
    return true;
  }
  private createServerValidationOptions(doComplete: boolean, isPreview: boolean, page: PageModel): ServerValidateQuestionsEvent {
    var self = this;
    const options = {
      data: <{ [index: string]: any }>{},
      errors: {},
      survey: <any>this.survey,
      complete: function () {
        self.completeServerValidation(options, isPreview, page);
      },
    };
    options.data = this.survey.getServerValidationData(doComplete && this.survey.isValidateOnComplete);
    return options;
  }
  private completeServerValidation(options: any, isPreview: boolean, page: PageModel) {
    if (this.serverValidationEventCount > 1) {
      this.serverValidationEventCount--;
      if (!!options && !!options.errors && Object.keys(options.errors).length === 0) return;
    }
    this.serverValidationEventCount = 0;
    this.survey.setIsValidatingOnServer(false);
    if (!options && !options.survey) return;
    var self = options.survey;
    let isValid = true;
    if (options.errors) {
      var hasToFocus = this.survey.autoFocusFirstError;
      for (var name in options.errors) {
        var question = self.getQuestionByName(name);
        if (question && question["errors"]) {
          isValid = false;
          question.addError(new CustomError(options.errors[name], <any>this.survey));
          if (hasToFocus) {
            hasToFocus = false;
            if (!!question.page) {
              this.survey.currentPage = question.page;
            }
            question.focus(true);
          }
        }
      }
      this.fireValidatedErrorsOnPage(this.survey.currentPage);
    }
    if (isValid) {
      this.survey.navigateAfterServerValidation(isPreview, page);
    }
  }
  //#endregion

  //#region Question value change validation
  /**
   * Validates a question when its value changes, respecting validation settings.
   */
  public validateQuestionOnValueChanged(question: Question): void {
    if (this.shouldValidateQuestionOnChange(question)) {
      this.validateQuestionOnValueChangedCore(question);
      return;
    }

    this.validateParentPanelsIfNeeded(question.parent);
  }
  /**
   * Determines if a question should be validated when its value changes.
   */
  private shouldValidateQuestionOnChange(question: Question): boolean {
    return (
      this.survey.isValidateOnValueChanged ||
      question.getAllErrors().length > 0
    );
  }
  /**
   * Validates parent panels up the hierarchy if they have errors.
   */
  private validateParentPanelsIfNeeded(parent: any): void {
    let panelParent = parent as PanelModelBase;
    while(!!panelParent) {
      if (panelParent.errors && panelParent.errors.length > 0) {
        panelParent.validateContainerOnly();
        return;
      }
      panelParent = panelParent.parent as PanelModelBase;
    }
  }
  /**
   * Core validation logic for a question value change.
   * Fires page events if needed.
   */
  private validateQuestionOnValueChangedCore(question: Question): boolean {
    const oldErrorCount = question.getAllErrors().length;
    const res = question.validate(
      true,
      false,
      !this.survey.isValidateOnValueChanging,
      undefined,
      this.survey.isValidateOnValueChanging
    );

    if (
      !!question.page &&
      this.isValidateOnValueChange &&
      (oldErrorCount > 0 || question.getAllErrors().length > 0)
    ) {
      this.fireValidatedErrorsOnPage(question.page as PageModel);
    }

    return res;
  }
  /**
   * Validates multiple questions bound to the same value.
   * Used when multiple questions share a value name.
   */
  public validateQuestionsOnValueChanging(questions: Array<Question>, newValue: any): boolean {
    let res = true;
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!Helpers.isTwoValueEquals(q.valueForSurvey, newValue)) {
        q.value = newValue;
      }
      res = this.validateQuestionOnValueChangedCore(q) && res && q.errors.length === 0;
    }
    return res;
  }
  //#endregion
}

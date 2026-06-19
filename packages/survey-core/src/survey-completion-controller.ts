import { HashTable } from "./helpers";
import { DomDocumentHelper } from "./global_variables_utils";
import { PageModel } from "./page";
import { settings } from "./settings";
import { Trigger } from "./trigger";
import { CompleteEvent, CompletingEvent } from "./survey-events-api";

export interface ISurveyCompletionHost {
  isCompleted: boolean;
  isNavigationBlocked: boolean;
  currentPage: PageModel;
  cookieName: string;
  surveyPostId: string;
  onComplete: { fire(sender: any, options: CompleteEvent): void };
  onCompleting: { fire(sender: any, options: CompletingEvent, onComplete?: () => void, onFirstAsync?: () => void): void };
  setCompletedState(value: string, text: string): void;
  notify(message: string, type: string): void;
  sendResult(): void;
  navigateTo(): void;
}

export class SurveyCompletionController {
  private completedByTriggers: HashTable<any>;

  private survey: ISurveyCompletionHost;

  constructor(survey: ISurveyCompletionHost) {
    this.survey = survey;
  }

  public doComplete(isCompleteOnTrigger: boolean = false, completeTrigger?: Trigger): boolean | undefined {
    const survey = this.survey;
    if (survey.isCompleted) return;

    return this.checkOnCompletingEvent(isCompleteOnTrigger, completeTrigger, (allow: boolean) => {
      if (allow) {
        survey.isCompleted = true;
        this.saveDataOnComplete(isCompleteOnTrigger, completeTrigger);
        this.setCookie();
      } else {
        survey.isCompleted = false;
      }
    });
  }

  public saveDataOnComplete(isCompleteOnTrigger: boolean = false, completeTrigger?: Trigger): void {
    const survey = this.survey;
    let previousCookie = this.hasCookie;
    const showSaveInProgress = (text: string) => {
      savingDataStarted = true;
      survey.setCompletedState("saving", text);
    };
    const showSaveError = (text: string) => {
      survey.setCompletedState("error", text);
    };
    const showSaveSuccess = (text: string) => {
      survey.setCompletedState("success", text);
      survey.navigateTo();
    };
    const clearSaveMessages = (text: string) => {
      survey.setCompletedState("", "");
    };
    var savingDataStarted = false;
    var onCompleteOptions = {
      isCompleteOnTrigger: isCompleteOnTrigger,
      completeTrigger: completeTrigger,
      showSaveInProgress: showSaveInProgress,
      showSaveError: showSaveError,
      showSaveSuccess: showSaveSuccess,
      clearSaveMessages: clearSaveMessages,
      //Obsolete functions
      showDataSaving: showSaveInProgress,
      showDataSavingError: showSaveError,
      showDataSavingSuccess: showSaveSuccess,
      showDataSavingClear: clearSaveMessages
    };
    survey.onComplete.fire(survey, onCompleteOptions);
    if (!previousCookie && survey.surveyPostId) {
      survey.sendResult();
    }
    if (!savingDataStarted) {
      survey.navigateTo();
    }
  }

  private checkOnCompletingEvent(isCompleteOnTrigger: boolean, completeTrigger: Trigger, onComplete: (allow: boolean) => void): boolean | undefined {
    const survey = this.survey;
    let result: boolean | undefined = undefined;
    const options: CompletingEvent = {
      allowComplete: true,
      allow: true,
      isCompleteOnTrigger: isCompleteOnTrigger,
      completeTrigger: completeTrigger
    };
    const doCompleteFunc = () => {
      survey.isNavigationBlocked = false;
      const allow = options.allowComplete && options.allow;
      if (!!options.message) {
        survey.notify(options.message, allow ? "success" : "error");
      }
      result = allow;
      onComplete(allow);
    };
    survey.onCompleting.fire(survey, options, doCompleteFunc, () => survey.isNavigationBlocked = true);
    return result;
  }

  public canBeCompleted(trigger: Trigger, isCompleted: boolean): boolean {
    if (!settings.triggers.changeNavigationButtonsOnComplete) return false;
    const prevCanBeCompleted = this.canBeCompletedByTrigger;
    if (!this.completedByTriggers)this.completedByTriggers = {};
    if (isCompleted) {
      this.completedByTriggers[trigger.id] = { trigger: trigger, pageId: this.survey.currentPage?.id };
    } else {
      delete this.completedByTriggers[trigger.id];
    }
    return prevCanBeCompleted !== this.canBeCompletedByTrigger;
  }

  public get canBeCompletedByTrigger(): boolean {
    if (!this.completedByTriggers) return false;
    const keys = Object.keys(this.completedByTriggers);
    if (keys.length === 0) return false;
    const id = this.survey.currentPage?.id;
    if (!id) return true;
    for (let i = 0; i < keys.length; i++) {
      if (id === this.completedByTriggers[keys[i]].pageId) return true;
    }
    return false;
  }

  public get completedTrigger(): Trigger {
    if (!this.canBeCompletedByTrigger) return undefined;
    const key = Object.keys(this.completedByTriggers)[0];
    return this.completedByTriggers[key].trigger;
  }

  public resetCompletedByTriggers(): void {
    this.completedByTriggers = undefined;
  }

  public get hasCookie(): boolean {
    const cookieName = this.survey.cookieName;
    if (!cookieName) return false;
    const cookies = DomDocumentHelper.getCookie();
    return !!cookies && cookies.indexOf(cookieName + "=true") > -1;
  }
  public setCookie(): void {
    const cookieName = this.survey.cookieName;
    if (!cookieName) return;
    DomDocumentHelper.setCookie(cookieName + "=true; expires=Fri, 31 Dec 9999 0:0:0 GMT");
  }
  public deleteCookie(): void {
    const cookieName = this.survey.cookieName;
    if (!cookieName) return;
    DomDocumentHelper.setCookie(cookieName + "=;");
  }
}

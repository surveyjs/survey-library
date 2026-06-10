import { Base } from "./base";
import { HashTable } from "./helpers";
import { PageModel } from "./page";
import { settings } from "./settings";
import { Trigger } from "./trigger";
import { CompleteEvent, CompletingEvent } from "./survey-events-api";

export interface ISurveyCompletionHost {
  isCompleted: boolean;
  isNavigationBlocked: boolean;
  currentPage: PageModel;
  hasCookie: boolean;
  surveyPostId: string;
  triggersRunner: { checkOnPageTriggers(isOnComplete: boolean): void };
  onComplete: { fire(sender: any, options: CompleteEvent): void };
  onCompleting: { fire(sender: any, options: CompletingEvent, onComplete?: () => void, onFirstAsync?: () => void): void };
  setCompletedState(value: string, text: string): void;
  notify(message: string, type: string): void;
  stopTimer(): void;
  notifyQuestionsOnHidingContent(page: PageModel): void;
  cancelPreview(): void;
  clearUnusedValues(): void;
  setCookie(): void;
  sendResult(): void;
  navigateTo(): void;
}

export class SurveyCompletionController extends Base {
  private completedByTriggers: HashTable<any>;

  private survey: ISurveyCompletionHost;

  constructor(survey: ISurveyCompletionHost) {
    super();
    this.survey = survey;
  }

  public doComplete(isCompleteOnTrigger: boolean = false, completeTrigger?: Trigger): boolean | undefined {
    const survey = this.survey;
    if (survey.isCompleted) return;

    return this.checkOnCompletingEvent(isCompleteOnTrigger, completeTrigger, (allow: boolean) => {
      if (allow) {
        survey.triggersRunner.checkOnPageTriggers(true);
        survey.stopTimer();
        survey.notifyQuestionsOnHidingContent(survey.currentPage);
        survey.isCompleted = true;
        survey.cancelPreview();
        survey.clearUnusedValues();
        this.saveDataOnComplete(isCompleteOnTrigger, completeTrigger);
        survey.setCookie();
      } else {
        survey.isCompleted = false;
      }
    });
  }

  public saveDataOnComplete(isCompleteOnTrigger: boolean = false, completeTrigger?: Trigger): void {
    const survey = this.survey;
    let previousCookie = survey.hasCookie;
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
}

import { Event } from "./base";

export var surveyTimerFunctions = {
  setTimeout: function(func: () => any): number {
    return window.setTimeout(func, 1000);
  },
  clearTimeout: function(timerId: number) {
    window.clearTimeout(timerId);
  }
};

export class SurveyTimer {
  private static instanceValue: SurveyTimer = null;
  public static get instance() {
    if (!SurveyTimer.instanceValue) {
      SurveyTimer.instanceValue = new SurveyTimer();
    }
    return SurveyTimer.instanceValue;
  }
  private listenerCounter = 0;
  private timerId = -1;
  public onTimer: Event<() => any, any> = new Event<() => any, any>();
  public start(func: () => any = null) {
    if (func) {
      this.onTimer.add(func);
    }
    if (this.timerId < 0) {
      this.timerId = surveyTimerFunctions.setTimeout(() => {
        this.doTimer();
      });
    }
    this.listenerCounter++;
  }
  public stop(func: () => any = null) {
    if (func) {
      this.onTimer.remove(func);
    }
    this.listenerCounter--;
    if (this.listenerCounter == 0 && this.timerId > -1) {
      surveyTimerFunctions.clearTimeout(this.timerId);
      this.timerId = -1;
    }
  }
  public doTimer() {
    if (this.timerId < 0) return;
    this.onTimer.fire(this, {});
    this.timerId = surveyTimerFunctions.setTimeout(() => {
      this.doTimer();
    });
  }
}

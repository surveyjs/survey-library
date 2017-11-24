import { Event } from "./base";

export var surveyTimerFunctions = {
  setInterval: function(func: () => any): number {
    return window.setInterval(func, 1000);
  },
  clearInterval: function(timerId: number) {
    window.clearInterval(timerId);
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
      var self = this;
      this.timerId = surveyTimerFunctions.setInterval(function() {
        self.doTimer();
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
      surveyTimerFunctions.clearInterval(this.timerId);
      this.timerId = -1;
    }
  }
  public doTimer() {
    if (this.timerId < 0) return;
    this.onTimer.fire(this, {});
  }
}

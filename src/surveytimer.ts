import { Event } from "./base";

export var surveyTimerFunctions = {
  setTimeout: (func: () => any): number => {
    return surveyTimerFunctions.safeTimeOut(func, 1000);
  },
  clearTimeout: (timerId: number): void => {
    clearTimeout(timerId);
  },
  safeTimeOut: (func:() => any, delay: number): number | any => {
    if (delay <= 0) {
      func();
      return 0;
    } else {
      return setTimeout(func, delay);
    }
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
  public onTimer: Event<() => any, SurveyTimer, any> = new Event<() => any, SurveyTimer, any>();
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
    if(this.onTimer.isEmpty || this.listenerCounter == 0) {
      this.timerId = -1;
    }
    if (this.timerId < 0) return;
    const prevItem = this.timerId;
    this.onTimer.fire(this, {});
    //We have to check that we have the same timerId
    //It could be changed during events execution and it will lead to double timer events
    if(prevItem !== this.timerId) return;
    this.timerId = surveyTimerFunctions.setTimeout(() => {
      this.doTimer();
    });
  }
}

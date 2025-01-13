import { EventBase } from "./base";

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
  },
  now(): number { return Date.now(); }
};

export interface SurveyTimerEvent {
  seconds: number;
}

export class SurveyTimer {
  private static instanceValue: SurveyTimer = null;
  public static get instance(): SurveyTimer {
    if (!SurveyTimer.instanceValue) {
      SurveyTimer.instanceValue = new SurveyTimer();
    }
    return SurveyTimer.instanceValue;
  }
  private listenerCounter = 0;
  private timerId = -1;
  private prevTimeInMs: number;
  public onTimerTick: EventBase<SurveyTimer, SurveyTimerEvent> = new EventBase<SurveyTimer, SurveyTimerEvent>();
  public onTimer: EventBase<SurveyTimer, SurveyTimerEvent> = this.onTimerTick;
  public start(func: (timer: SurveyTimer, options: SurveyTimerEvent) => void = null): void {
    if (func) {
      this.onTimerTick.add(func);
    }
    this.prevTimeInMs = surveyTimerFunctions.now();
    if (this.timerId < 0) {
      this.timerId = surveyTimerFunctions.setTimeout(() => {
        this.doTimer();
      });
    }
    this.listenerCounter++;
  }
  public stop(func: (timer: SurveyTimer, options: SurveyTimerEvent) => any = null): void {
    if (func) {
      this.onTimerTick.remove(func);
    }
    this.listenerCounter--;
    if (this.listenerCounter == 0 && this.timerId > -1) {
      surveyTimerFunctions.clearTimeout(this.timerId);
      this.timerId = -1;
    }
  }
  public doTimer(): void {
    if(this.onTimerTick.isEmpty || this.listenerCounter == 0) {
      this.timerId = -1;
    }
    if (this.timerId < 0) return;
    const newTimer = surveyTimerFunctions.now();
    let seconds = Math.floor((newTimer - this.prevTimeInMs) / 1000);
    this.prevTimeInMs = newTimer;
    if(seconds < 0) {
      seconds = 1;
    }
    const prevItem = this.timerId;
    this.onTimerTick.fire(this, { seconds: seconds });
    //We have to check that we have the same timerId
    //It could be changed during events execution and it will lead to double timer events
    if(prevItem !== this.timerId) return;
    this.timerId = surveyTimerFunctions.setTimeout(() => {
      this.doTimer();
    });
  }
}

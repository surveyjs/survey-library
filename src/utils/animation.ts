import { debounce } from "./taskmanager";

export interface AnimationOptions<T> {
  classes: T;
  onBeforeRunAnimation?: (element: HTMLElement) => void;
}

export interface IAnimationConsumer<T extends Array<any> = []> {
  getLeaveOptions(...args: T): OnLeaveOptions;
  getEnterOptions(...args: T): OnEnterOptions;
  getAnimatedElement(...args: T): HTMLElement;
  isAnimationEnabled(): boolean;
}

export type OnEnterOptions = AnimationOptions<{ onEnter: string }>;
export type OnLeaveOptions = AnimationOptions<{ onLeave: string, onHide: string }>;

export class AnimationUtils {
  private getMsFromRule(value: string) {
    if (value === "auto") return 0;
    return Number(value.slice(0, -1).replace(",", ".")) * 1000;
  }
  private getAnimationsCount(element: HTMLElement) {
    let animationName = "";
    if(getComputedStyle) {
      animationName = getComputedStyle(element).animationName;
    }
    return (animationName && animationName != "none" ? animationName.split(", ").length : 0);
  }
  private getAnimationDuration(element: HTMLElement): number {
    const style = getComputedStyle(element);
    const delays = style["animationDelay"].split(", ");
    const durations = style["animationDuration"].split(", ");
    let duration = 0;
    for (let i = 0; i < Math.max(durations.length, delays.length); i ++) {
      duration += this.getMsFromRule(durations[i % durations.length]) + this.getMsFromRule(delays[i % delays.length]);
    }
    return duration;
  }
  private cancelQueue: Array<() => void> = [];

  protected onAnimationEnd(element: HTMLElement, update: (event?: AnimationEvent) => void): void {
    let cancelTimeout: any;
    const callback = (event?: AnimationEvent) => {
      update(event);
      clearTimeout(cancelTimeout);
      element.removeEventListener("animationend", onAnimationEndCallback);
    };
    this.cancelQueue.push(callback);
    const onAnimationEndCallback = (event: AnimationEvent) => {
      if(event.target == event.currentTarget && --animationsCount <= 0) {
        callback(event);
        this.cancelQueue.splice(this.cancelQueue.indexOf(callback), 1);
      }
    };
    let animationsCount = this.getAnimationsCount(element);
    if(animationsCount > 0) {
      animationsCount = this.getAnimationsCount(element);
      element.addEventListener("animationend", onAnimationEndCallback);
      cancelTimeout = setTimeout(() => {
        callback();
      }, this.getAnimationDuration(element) + 1);
    } else {
      update();
    }
  }

  protected beforeAnimationRun(element: HTMLElement, options: OnEnterOptions | OnLeaveOptions): void {
    if(element) {
      options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
    }
  }
  protected runLeaveAnimation(element: HTMLElement, options: OnLeaveOptions, callback: () => void): void {
    if(element) {
      element.classList.add(options.classes.onLeave);
      const onAnimationEndCallback = (event?: any) => {
        element.classList.remove(options.classes.onLeave);
        if(!!event) element.classList.add(options.classes.onHide);
        callback();
        if(!!event) setTimeout(() => {
          element.classList.remove(options.classes.onHide);
        }, 1);
      };
      this.onAnimationEnd(element, onAnimationEndCallback);
    } else {
      callback();
    }
  }
  protected runEnterAnimation(element: HTMLElement, options: OnEnterOptions): void {
    if(element) {
      element.classList.add(options.classes.onEnter);
      this.onAnimationEnd(element, () => {
        element.classList.remove(options.classes.onEnter);
      });
    }
  }

  public cancel(): void {
    this.cancelQueue.forEach(func => func());
    this.cancelQueue = [];
  }
}

export class AnimationPropertyUtils extends AnimationUtils {
  public onEnter(getElement: () => HTMLElement, options: OnEnterOptions): void {
    requestAnimationFrame(() => {
      const element = getElement();
      this.beforeAnimationRun(element, options);
      this.runEnterAnimation(element, options);
    });
  }
  public onLeave(getElement: () => HTMLElement, callback: () => void, options: OnLeaveOptions): void {
    const element = getElement();
    this.beforeAnimationRun(element, options);
    this.runLeaveAnimation(element, options, callback);
  }
}
export class AnimationGroupUtils<T> extends AnimationUtils {
  public onEnter(getElement: (el: T) => HTMLElement, getOptions: (el: T) => OnEnterOptions, elements: Array<T>): void {
    requestAnimationFrame(() => {
      elements.forEach((el) => {
        this.beforeAnimationRun(getElement(el), getOptions(el));
      });
      elements.forEach((el) => {
        this.runEnterAnimation(getElement(el), getOptions(el));
      });
    });
  }
  public onLeave(getElement: (el: T) => HTMLElement, callback: () => void, getOptions: (el: T) => OnLeaveOptions, elements: Array<T>): void {
    elements.forEach((el) => {
      this.beforeAnimationRun(getElement(el), getOptions(el));
    });
    elements.forEach((el) => {
      this.runLeaveAnimation(getElement(el), getOptions(el), callback);
    });
  }
}

abstract class AnimationProperty<T, S extends Array<any> = []> {
  constructor(protected animationOptions: IAnimationConsumer<S>, protected update: (val: T) => void, protected getCurrentValue: () => T) {
  }
  protected animation: AnimationUtils;
  protected abstract _sync(newValue: T): void;
  private _debouncedSync = debounce((newValue: T) => {
    this.animation.cancel();
    this._sync(newValue);
  })
  sync(newValue: T): void {
    if(this.animationOptions.isAnimationEnabled()) {
      this._debouncedSync.run(newValue);
    } else {
      this.update(newValue);
    }
  }
  cancel() {
    this.animation.cancel();
    this._debouncedSync.cancel();
  }
}

export class AnimationBoolean extends AnimationProperty<boolean> {
  protected animation: AnimationPropertyUtils = new AnimationPropertyUtils();
  protected _sync(newValue: boolean): void {
    if(newValue !== this.getCurrentValue()) {
      if(newValue) {
        this.update(newValue);
        this.animation.onEnter(() => this.animationOptions.getAnimatedElement(), this.animationOptions.getEnterOptions());
      } else {
        this.animation.onLeave(() => this.animationOptions.getAnimatedElement(), () => {
          this.update(newValue);
        }, this.animationOptions.getLeaveOptions());
      }
    } else {
      this.update(newValue);
    }
  }
}

export class AnimationGroup<T> extends AnimationProperty<Array<T>, [T]> {
  protected animation: AnimationGroupUtils<T> = new AnimationGroupUtils();
  protected _sync (newValue: Array<T>): void {
    const oldValue = this.getCurrentValue();
    const itemsToAdd = newValue.filter(el => oldValue.indexOf(el) < 0);
    const deletedItems = oldValue.filter(el => newValue.indexOf(el) < 0);
    this.animation.onEnter((el) => this.animationOptions.getAnimatedElement(el), (el) => this.animationOptions.getEnterOptions(el), itemsToAdd);
    if (itemsToAdd.length == 0 && deletedItems?.length > 0) {
      let counter = deletedItems.length;
      this.animation.onLeave((el) => this.animationOptions.getAnimatedElement(el), () => {
        if (--counter <= 0) {
          this.update(newValue);
        }
      }, (el) => this.animationOptions.getLeaveOptions(el), deletedItems);
    } else {
      this.update(newValue);
    }
  }
}
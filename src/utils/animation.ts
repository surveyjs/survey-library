import { DomWindowHelper } from "../global_variables_utils";
import { debounce } from "./taskmanager";

export interface AnimationOptions{
  cssClass: string;
  onBeforeRunAnimation?: (element: HTMLElement) => void;
  onAfterRunAnimation?: (element: HTMLElement) => void;
}

export interface IAnimationConsumer<T extends Array<any> = []> {
  getLeaveOptions(...args: T): AnimationOptions;
  getEnterOptions(...args: T): AnimationOptions;
  getAnimatedElement(...args: T): HTMLElement;
  isAnimationEnabled(): boolean;
}

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
      duration = Math.max(duration, this.getMsFromRule(durations[i % durations.length]) + this.getMsFromRule(delays[i % delays.length]));
    }
    return duration;
  }
  private cancelQueue: Array<() => void> = [];

  protected onAnimationEnd(element: HTMLElement, callback: (isCancel?: boolean) => void, options: AnimationOptions): void {
    let cancelTimeout: any;
    let animationsCount = this.getAnimationsCount(element);
    const onEndCallback = (isCancel: boolean = true) => {
      options.onAfterRunAnimation && options.onAfterRunAnimation(element);
      callback(isCancel);
      clearTimeout(cancelTimeout);
      this.cancelQueue.splice(this.cancelQueue.indexOf(onEndCallback), 1);
      element.removeEventListener("animationend", onAnimationEndCallback);
    };
    const onAnimationEndCallback = (event: AnimationEvent) => {
      if(event.target == event.currentTarget && --animationsCount <= 0) {
        onEndCallback(false);
      }
    };
    if(animationsCount > 0) {
      element.addEventListener("animationend", onAnimationEndCallback);
      this.cancelQueue.push(onEndCallback);
      cancelTimeout = setTimeout(() => {
        onEndCallback(false);
      }, this.getAnimationDuration(element) + 10);
    } else {
      callback(true);
    }
  }

  protected beforeAnimationRun(element: HTMLElement, options: AnimationOptions | AnimationOptions): void {
    if(element) {
      options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
    }
  }
  protected runLeaveAnimation(element: HTMLElement, options: AnimationOptions, callback: () => void): void {
    if(element && options.cssClass) {
      element.classList.add(options.cssClass);
      const onAnimationEndCallback = (isCancel?: boolean) => {
        callback();
        if(isCancel) {
          element.classList.remove(options.cssClass);
        } else {
          DomWindowHelper.requestAnimationFrame(() => {
            DomWindowHelper.requestAnimationFrame(() => {
              element.classList.remove(options.cssClass);
            });
          });
        }
      };
      this.onAnimationEnd(element, onAnimationEndCallback, options);
    } else {
      callback();
    }
  }
  protected runEnterAnimation(element: HTMLElement, options: AnimationOptions): void {
    if(element && options.cssClass) {
      element.classList.add(options.cssClass);
      this.onAnimationEnd(element, () => {
        element.classList.remove(options.cssClass);
      }, options);
    }
  }

  public cancel(): void {
    this.cancelQueue.forEach(func => func());
    this.cancelQueue = [];
  }
}

export class AnimationPropertyUtils extends AnimationUtils {
  public onEnter(getElement: () => HTMLElement, options: AnimationOptions): void {
    const callback = () => {
      const element = getElement();
      this.beforeAnimationRun(element, options);
      this.runEnterAnimation(element, options);
    };
    DomWindowHelper.requestAnimationFrame(() => {
      if(getElement()) {
        callback();
      } else {
        DomWindowHelper.requestAnimationFrame(callback);
      }
    });
  }
  public onLeave(getElement: () => HTMLElement, callback: () => void, options: AnimationOptions): void {
    const element = getElement();
    this.beforeAnimationRun(element, options);
    this.runLeaveAnimation(element, options, callback);
  }
}
export class AnimationGroupUtils<T> extends AnimationUtils {
  public onEnter(getElement: (el: T) => HTMLElement, getOptions: (el: T) => AnimationOptions, elements: Array<T>): void {
    if(elements.length == 0) return;
    DomWindowHelper.requestAnimationFrame(() => {
      const callback = () => {
        elements.forEach((el) => {
          this.beforeAnimationRun(getElement(el), getOptions(el));
        });
        elements.forEach((el) => {
          this.runEnterAnimation(getElement(el), getOptions(el));
        });
      };
      if(!getElement(elements[0])) {
        DomWindowHelper.requestAnimationFrame(callback);
      } else {
        callback();
      }
    });
  }
  public onLeave(getElement: (el: T) => HTMLElement, callback: () => void, getOptions: (el: T) => AnimationOptions, elements: Array<T>): void {
    elements.forEach((el) => {
      this.beforeAnimationRun(getElement(el), getOptions(el));
    });
    let counter = elements.length;
    const onEndCallback = () => {
      if (--counter <= 0) {
        callback();
      }
    };
    elements.forEach((el) => {
      this.runLeaveAnimation(getElement(el), getOptions(el), onEndCallback);
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
      this.animation.onLeave((el) => this.animationOptions.getAnimatedElement(el), () => {
        this.update(newValue);
      }, (el) => this.animationOptions.getLeaveOptions(el), deletedItems);
    } else {
      this.update(newValue);
    }
  }
}

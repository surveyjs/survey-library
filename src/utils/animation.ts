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
  private reflow(element: HTMLElement) {
    return element.offsetHeight;
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

  private addCancelCallback(callback: () => void) {
    this.cancelQueue.push(callback);
  }
  private removeCancelCallback(callback: () => void) {
    if(this.cancelQueue.indexOf(callback) >= 0) {
      this.cancelQueue.splice(this.cancelQueue.indexOf(callback), 1);
    }
  }

  protected onAnimationEnd(element: HTMLElement, callback: (isCancel?: boolean) => void, options: AnimationOptions): void {
    let cancelTimeout: any;
    let animationsCount = this.getAnimationsCount(element);
    const onEndCallback = (isCancel: boolean = true) => {
      options.onAfterRunAnimation && options.onAfterRunAnimation(element);
      callback(isCancel);
      clearTimeout(cancelTimeout);
      this.removeCancelCallback(onEndCallback);
      element.removeEventListener("animationend", onAnimationEndCallback);
    };
    const onAnimationEndCallback = (event: AnimationEvent) => {
      if(event.target == event.currentTarget && --animationsCount <= 0) {
        onEndCallback(false);
      }
    };
    if(animationsCount > 0) {
      element.addEventListener("animationend", onAnimationEndCallback);
      this.addCancelCallback(onEndCallback);
      cancelTimeout = setTimeout(() => {
        onEndCallback(false);
      }, this.getAnimationDuration(element) + 10);
    } else {
      callback(true);
    }
  }

  protected beforeAnimationRun(element: HTMLElement, options: AnimationOptions | AnimationOptions): void {
    if(element && options) {
      options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
    }
  }
  private getCssClasses(options: AnimationOptions) {
    return options.cssClass.replace(/\s+$/, "").split(/\s+/);
  }
  protected runAnimation(element: HTMLElement, options: AnimationOptions, callback: (isCancel?: boolean) => void): void {
    if(element && options.cssClass) {
      this.reflow(element);
      this.getCssClasses(options).forEach((cssClass) => {
        element.classList.add(cssClass);
      });
      this.onAnimationEnd(element, callback, options);
    } else {
      callback(true);
    }
  }
  protected clearHtmlElement(element: HTMLElement, options: AnimationOptions): void {
    if(element && options.cssClass) {
      this.getCssClasses(options).forEach((cssClass) => {
        element.classList.remove(cssClass);
      });
    }
  }

  protected onNextRender(callback: () => void, runEarly?: () => boolean, isCancel: boolean = false): void {
    if(!isCancel && DomWindowHelper.isAvailable()) {
      const cancelCallback = () => {
        callback();
        cancelAnimationFrame(latestRAF);
      };
      let latestRAF = DomWindowHelper.requestAnimationFrame(() => {
        if(runEarly && runEarly()) {
          callback();
          this.removeCancelCallback(cancelCallback);
        } else {
          latestRAF = DomWindowHelper.requestAnimationFrame(() => {
            callback();
            this.removeCancelCallback(cancelCallback);
          });
        }
      });
      this.addCancelCallback(cancelCallback);
    } else {
      callback();
    }
  }

  public cancel(): void {
    const cancelQueue = [].concat(this.cancelQueue);
    cancelQueue.forEach(callback => callback());
    this.cancelQueue = [];
  }
}

export class AnimationPropertyUtils extends AnimationUtils {
  public onEnter(options: IAnimationConsumer): void {
    this.onNextRender(
      () => {
        const htmlElement = options.getAnimatedElement();
        const enterOptions = options.getEnterOptions();
        this.beforeAnimationRun(htmlElement, enterOptions);
        this.runAnimation(htmlElement, enterOptions, () => {
          this.clearHtmlElement(htmlElement, enterOptions);
        });
      },
      () => !!options.getAnimatedElement());
  }
  public onLeave(options: IAnimationConsumer, callback: () => void): void {
    const htmlElement = options.getAnimatedElement();
    const leaveOptions = options.getLeaveOptions();
    this.beforeAnimationRun(htmlElement, leaveOptions);
    this.runAnimation(htmlElement, leaveOptions, (isCancel) => {
      callback();
      this.onNextRender(() => {
        this.clearHtmlElement(htmlElement, leaveOptions);
      }, undefined, isCancel);
    });
  }
}
export class AnimationGroupUtils<T> extends AnimationUtils {
  public runGroupAnimation(options: IAnimationConsumer<[T]>, addedElements: Array<T>, removedElements: Array<T>, callback?: () => void): void {
    this.onNextRender(
      () => {
        const addedHtmlElements = addedElements.map((el) => options.getAnimatedElement(el));
        const enterOptions = addedElements.map((el) => options.getEnterOptions(el));
        const removedHtmlElements = removedElements.map((el) => options.getAnimatedElement(el));
        const leaveOptions = removedElements.map((el) => options.getLeaveOptions(el));
        addedElements.forEach((_, i) => {
          this.beforeAnimationRun(addedHtmlElements[i], enterOptions[i]);
        });
        removedElements.forEach((_, i) => {
          this.beforeAnimationRun(removedHtmlElements[i], leaveOptions[i]);
        });
        let counter = addedElements.length + removedElements.length;
        const onAnimationEndCallback = (isCancel: boolean) => {
          if(--counter <=0) {
            callback && callback();
            this.onNextRender(() => {
              addedElements.forEach((_, i) => {
                this.clearHtmlElement(addedHtmlElements[i], enterOptions[i]);
              });
              removedElements.forEach((_, i) => {
                this.clearHtmlElement(removedHtmlElements[i], leaveOptions[i]);
              });
            }, undefined, isCancel);
          }
        };
        addedElements.forEach((_, i) => {
          this.runAnimation(addedHtmlElements[i], enterOptions[i], onAnimationEndCallback);
        });
        removedElements.forEach((_, i) => {
          this.runAnimation(removedHtmlElements[i], leaveOptions[i], onAnimationEndCallback);
        });
      },
      () => addedElements.length == 0 || addedElements.some(el => !!options.getAnimatedElement(el)));
  }
}

export abstract class AnimationProperty<T, S extends Array<any> = []> {
  constructor(protected animationOptions: IAnimationConsumer<S>, protected update: (val: T, isTempUpdate?: boolean) => void, protected getCurrentValue: () => T) {
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
      this.cancel();
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
        this.animation.onEnter(this.animationOptions);
      } else {
        this.animation.onLeave(this.animationOptions, () => {
          this.update(newValue);
        });
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
    if (itemsToAdd.length == 0 && deletedItems?.length > 0) {
      this.animation.runGroupAnimation(this.animationOptions, [], deletedItems, () => this.update(newValue));
    } else {
      this.update(newValue);
      this.animation.runGroupAnimation(this.animationOptions, itemsToAdd, []);
    }
  }
}
export class AnimationTab<T> extends AnimationProperty<Array<T>, [T]> {
  protected animation: AnimationGroupUtils<T> = new AnimationGroupUtils();
  constructor(animationOptions: IAnimationConsumer<[T]>, update: (val: Array<T>, isTempUpdate?: boolean) => void, getCurrentValue: () => Array<T>, protected mergeValues?: (newValue: Array<T>, oldValue: Array<T>) => Array<T>) {
    super(animationOptions, update, getCurrentValue);
  }
  protected _sync(newValue: [T]): void {
    const oldValue = [].concat(this.getCurrentValue());
    if(oldValue[0] !== newValue[0]) {
      const tempValue = !!this.mergeValues ? this.mergeValues(newValue, oldValue) : [].concat(oldValue, newValue);
      this.update(tempValue, true);
      this.animation.runGroupAnimation(this.animationOptions, newValue, oldValue, () => {
        this.update(newValue);
      });
    } else {
      this.update(newValue);
    }
  }
}
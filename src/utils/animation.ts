import { DomWindowHelper } from "../global_variables_utils";
import { debounce } from "./taskmanager";
import { compareArrays } from "./utils";

export interface AnimationOptions{
  cssClass: string;
  onBeforeRunAnimation?: (element: HTMLElement) => void;
  onAfterRunAnimation?: (element: HTMLElement) => void;
}

export interface IAnimationConsumer<T extends Array<any> = []> {
  getLeaveOptions?(...args: T): AnimationOptions;
  getEnterOptions?(...args: T): AnimationOptions;
  getAnimatedElement(...args: T): HTMLElement;
  isAnimationEnabled(): boolean;
}

interface IGroupAnimationInfo {
  isReorderingRunning: boolean;
  isDeletingRunning: boolean;
  isAddingRunning: boolean;
}
export interface IAnimationGroupConsumer<T> extends IAnimationConsumer<[T]> {
  getLeaveOptions?(item: T, info? : IGroupAnimationInfo): AnimationOptions;
  getEnterOptions?(item: T, info?: IGroupAnimationInfo): AnimationOptions;
  getReorderOptions?(item: T, movedForward: boolean, info?: IGroupAnimationInfo): AnimationOptions;
  getKey?: (item: T) => any;
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
    if(element && options?.cssClass) {
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
        const enterOptions: AnimationOptions = options.getEnterOptions ? options.getEnterOptions() : {} as any;
        this.beforeAnimationRun(htmlElement, enterOptions);
        this.runAnimation(htmlElement, enterOptions, () => {
          this.clearHtmlElement(htmlElement, enterOptions);
        });
      },
      () => !!options.getAnimatedElement());
  }
  public onLeave(options: IAnimationConsumer, callback: () => void): void {
    const htmlElement = options.getAnimatedElement();
    const leaveOptions: AnimationOptions = options.getLeaveOptions ? options.getLeaveOptions() : {} as any;
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
  public runGroupAnimation(options: IAnimationGroupConsumer<T>, addedItems: Array<T>, removedItems: Array<T>, reorderedItems: Array<{ item: T, movedForward: boolean }>, callback?: () => void): void {
    this.onNextRender(
      () => {
        const info: IGroupAnimationInfo = {
          isAddingRunning: addedItems.length > 0,
          isDeletingRunning: removedItems.length > 0,
          isReorderingRunning: reorderedItems.length > 0
        };
        const addedHtmlElements = addedItems.map((el) => options.getAnimatedElement(el));
        const enterOptions: Array<AnimationOptions> = addedItems.map((el) => options.getEnterOptions ? options.getEnterOptions(el, info) : {} as any);
        const removedHtmlElements = removedItems.map((el) => options.getAnimatedElement(el));
        const leaveOptions: Array<AnimationOptions> = removedItems.map((el) => options.getLeaveOptions ? options.getLeaveOptions(el, info) : {} as any);
        const reorderedHtmlElements = reorderedItems.map(el => options.getAnimatedElement(el.item));
        const reorderedOptions: Array<AnimationOptions> = reorderedItems.map(el => options.getReorderOptions ? options.getReorderOptions(el.item, el.movedForward, info) : {} as any);
        addedItems.forEach((_, i) => {
          this.beforeAnimationRun(addedHtmlElements[i], enterOptions[i]);
        });
        removedItems.forEach((_, i) => {
          this.beforeAnimationRun(removedHtmlElements[i], leaveOptions[i]);
        });
        reorderedItems.forEach((_, i) => {
          this.beforeAnimationRun(reorderedHtmlElements[i], reorderedOptions[i]);
        });
        let counter = addedItems.length + removedItems.length + reorderedHtmlElements.length;
        const onAnimationEndCallback = (isCancel: boolean) => {
          if(--counter <=0) {
            callback && callback();
            this.onNextRender(() => {
              addedItems.forEach((_, i) => {
                this.clearHtmlElement(addedHtmlElements[i], enterOptions[i]);
              });
              removedItems.forEach((_, i) => {
                this.clearHtmlElement(removedHtmlElements[i], leaveOptions[i]);
              });
              reorderedItems.forEach((_, i) => {
                this.clearHtmlElement(reorderedHtmlElements[i], reorderedOptions[i]);
              });
            }, undefined, isCancel);
          }
        };
        addedItems.forEach((_, i) => {
          this.runAnimation(addedHtmlElements[i], enterOptions[i], onAnimationEndCallback);
        });
        removedItems.forEach((_, i) => {
          this.runAnimation(removedHtmlElements[i], leaveOptions[i], onAnimationEndCallback);
        });
        reorderedItems.forEach((_, i) => {
          this.runAnimation(reorderedHtmlElements[i], reorderedOptions[i], onAnimationEndCallback);
        });
      },
      () => (addedItems.length == 0 || addedItems.some(el => !!options.getAnimatedElement(el))) && (reorderedItems.length == 0 || reorderedItems.some(el => !!options.getAnimatedElement(el.item))));
  }
}

export abstract class AnimationProperty<T, S extends IAnimationConsumer<any> = IAnimationConsumer> {
  constructor(protected animationOptions: S, protected update: (val: T, isTempUpdate?: boolean) => void, protected getCurrentValue: () => T) {
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

export class AnimationGroup<T> extends AnimationProperty<Array<T>, IAnimationGroupConsumer<T>> {
  protected animation: AnimationGroupUtils<T> = new AnimationGroupUtils();
  protected _sync (newValue: Array<T>): void {
    const oldValue = this.getCurrentValue();
    try {
      const { addedItems, deletedItems, reorderedItems, mergedItems } = compareArrays(oldValue, newValue, this.animationOptions.getKey ?? ((item: T) => item));
      if(deletedItems.length <= 0 || reorderedItems.length > 0 || addedItems.length > 0) this.update(mergedItems);
      this.animation.runGroupAnimation(this.animationOptions, addedItems, deletedItems, reorderedItems, () => {
        if(deletedItems.length > 0) {
          this.update(newValue);
        }
      });
    } catch {
      this.update(newValue);
    }
  }
}
export class AnimationTab<T> extends AnimationProperty<Array<T>, IAnimationGroupConsumer<T>> {
  protected animation: AnimationGroupUtils<T> = new AnimationGroupUtils();
  constructor(animationOptions: IAnimationGroupConsumer<T>, update: (val: Array<T>, isTempUpdate?: boolean) => void, getCurrentValue: () => Array<T>, protected mergeValues?: (newValue: Array<T>, oldValue: Array<T>) => Array<T>) {
    super(animationOptions, update, getCurrentValue);
  }
  protected _sync(newValue: [T]): void {
    const oldValue = [].concat(this.getCurrentValue());
    if(oldValue[0] !== newValue[0]) {
      const tempValue = !!this.mergeValues ? this.mergeValues(newValue, oldValue) : [].concat(oldValue, newValue);
      this.update(tempValue, true);
      this.animation.runGroupAnimation(this.animationOptions, newValue, oldValue, [], () => {
        this.update(newValue);
      });
    } else {
      this.update(newValue);
    }
  }
}
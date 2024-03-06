import { settings } from "../settings";
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

export class Animation {
  protected isAnimationExists(element: HTMLElement): boolean {
    let animationName = "";
    if(getComputedStyle) {
      animationName = getComputedStyle(element).animationName;
    }
    return animationName && animationName != "none";
  }
  protected onAnimationEnd(element: HTMLElement, update: () => void): void {
    const callback = () => {
      update();
      element.removeEventListener("animationend", onAnimationEndCallback);
    };
    this.cancelQueue.push(callback);

    const onAnimationEndCallback = (event: AnimationEvent) => {
      if(event.target == event.currentTarget) {
        callback();
        this.cancelQueue.splice(this.cancelQueue.indexOf(callback), 1);
      }
    };
    if(this.isAnimationExists(element)) {
      element.addEventListener("animationend", onAnimationEndCallback);
    } else {
      update();
    }
  }
  private cancelQueue: Array<() => void> = [];
  private beforeEnterAnimationRunQueue: Array<() => void> = [];
  private enterAnimationQueue: Array<() => void> = [];
  private onEnterAnimationSheduled: boolean;
  public onEnter(getElement: () => HTMLElement, options: OnEnterOptions): void {
    this.beforeEnterAnimationRunQueue.push(() => {
      const element = getElement();
      if(element) {
        options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
      }
    });
    this.enterAnimationQueue.push(() => {
      const element = getElement();
      if(element) {
        element.classList.add(options.classes.onEnter);
        this.onAnimationEnd(element, () => {
          element.classList.remove(options.classes.onEnter);
        });
      }
    });
    if(!this.onEnterAnimationSheduled) {
      requestAnimationFrame(() => {
        const element = getElement();
        if(element) {
          this.beforeEnterAnimationRunQueue.forEach(func => func());
          this.beforeEnterAnimationRunQueue = [];
          this.enterAnimationQueue.forEach(func => func());
          this.enterAnimationQueue= [];
          this.onEnterAnimationSheduled = false;
        }
      });
      this.onEnterAnimationSheduled = true;
    }
  }

  public onLeave(getElement: () => HTMLElement, callback: () => void, options: OnLeaveOptions): void {
    const element = getElement();
    if(element) {
      options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
      requestAnimationFrame(() => {
        element.classList.add(options.classes.onLeave);
        const onAnimationEndCallback = () => {
          element.classList.remove(options.classes.onLeave);
          element.classList.add(options.classes.onHide);
          callback();
          setTimeout(() => {
            element.classList.remove(options.classes.onHide);
          }, 1);
        };
        this.onAnimationEnd(element, onAnimationEndCallback);
      });
    } else {
      callback();
    }
  }
  public cancel() {
    this.beforeEnterAnimationRunQueue = [];
    this.enterAnimationQueue = [];
    this.cancelQueue.forEach(func => func());
    this.cancelQueue = [];
  }
}
abstract class AnimationProperty<T, S extends Array<any> = []> {
  public allowEmptyAnimation: boolean = false;
  constructor(protected animationOptions: IAnimationConsumer<S>, protected update: (val: T) => void) {
  }
  protected animation = new Animation();
  protected abstract _sync(newValue: T, oldValue: T): void;
  private _debouncedSync = debounce((newValue: T, oldValue: T) => {
    this.animation.cancel();
    this._sync(newValue, oldValue);
  })
  sync(newValue: T, oldValue: T): void {
    if(this.animationOptions.isAnimationEnabled()) {
      this._debouncedSync.run(newValue, oldValue);
    } else {
      this.update(newValue);
    }
  }
  cancel() {
    this._debouncedSync.cancel();
  }
}

export class AnimationBoolean extends AnimationProperty<boolean> {
  protected _sync(newValue: boolean, oldValue: boolean): void {
    if(newValue !== oldValue) {
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
  protected _sync (newValue: Array<T>, oldValue: Array<T>): void {
    const itemsToAdd = newValue.filter(el => oldValue.indexOf(el) < 0);
    const deletedItems = oldValue.filter(el => newValue.indexOf(el) < 0);

    if(!this.allowEmptyAnimation && itemsToAdd.length == newValue.length) {
      this.update(newValue);
      return;
    }
    itemsToAdd?.forEach((item) =>
      this.animation.onEnter(
        () => this.animationOptions.getAnimatedElement(item),
        this.animationOptions.getEnterOptions(item)
      )
    );
    if (deletedItems?.length > 0) {
      let counter = deletedItems.length;
      deletedItems.forEach((item) => {
        this.animation.onLeave(
          () => this.animationOptions.getAnimatedElement(item),
          () => {
            if (--counter <= 0) {
              this.update(newValue);
            }
          },
          this.animationOptions.getLeaveOptions(item)
        );
      });
    } else {
      this.update(newValue);
    }
  }
}
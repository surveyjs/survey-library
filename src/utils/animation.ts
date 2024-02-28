import { settings } from "../settings";
import { debounce } from "./taskmanager";

export interface AnimationOptions<T> {
  classes: T;
  onBeforeRunAnimation?: (element: HTMLElement) => void;
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

  protected onAnimationEnd(element: HTMLElement, callback: () => void): void {
    const onAnimationEndCallback = () => {
      callback();
      element.removeEventListener("animationend", onAnimationEndCallback);
    };
    if(this.isAnimationExists(element)) {
      element.addEventListener("animationend", onAnimationEndCallback);
    } else {
      onAnimationEndCallback();
    }
  }

  public onEnter(getElement: () => HTMLElement, options: OnEnterOptions): void {
    requestAnimationFrame(() => {
      const element = getElement();
      if(element) {
        options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
        element.classList.add(options.classes.onEnter);
        this.onAnimationEnd(element, () => {
          element.classList.remove(options.classes.onEnter);
        });
      }
    });
  }

  public onLeave(getElement: () => HTMLElement, callback: () => void, options: OnLeaveOptions): void {
    const element = getElement();
    if(element) {
      options.onBeforeRunAnimation && options.onBeforeRunAnimation(element);
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
    } else {
      callback();
    }
  }
}

export class AnimationCollection<T> {
  constructor(private animationOptions: { onEnter: OnEnterOptions, onLeave: OnLeaveOptions, getElement: (el: T) => HTMLElement }, private update: (arr: Array<T>) => void) {
  }
  private _sync (newValue: Array<T>, oldValue: Array<T>) {
    const itemsToAdd = newValue.filter(el => oldValue.indexOf(el) < 0);
    const deletedItems = oldValue.filter(el => newValue.indexOf(el) < 0);

    if(itemsToAdd.length == newValue.length) {
      this.update(newValue);
      return;
    }
    itemsToAdd?.forEach((item) =>
      new Animation().onEnter(
        () => this.animationOptions.getElement(item),
        this.animationOptions.onEnter
      )
    );
    if (deletedItems?.length > 0) {
      let counter = deletedItems.length;
      deletedItems.forEach((item) => {
        new Animation().onLeave(
          () => this.animationOptions.getElement(item),
          () => {
            if (--counter <= 0) {
              this.update(newValue);
            }
          },
          this.animationOptions.onLeave
        );
      });
    } else {
      this.update(newValue);
    }
  }
  private _debouncedSync = debounce((newValue: Array<T>, oldValue: Array<T>) => {
    this._sync(newValue, oldValue);
  })
  sync(newValue: Array<T>, oldValue: Array<T>): void {
    if(settings.animationEnabled) {
      this._debouncedSync.run(newValue, oldValue);
    } else {
      this.update(newValue);
    }
  }
  cancel() {
    this._debouncedSync.cancel();
  }
}
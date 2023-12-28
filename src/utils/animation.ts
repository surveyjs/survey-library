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
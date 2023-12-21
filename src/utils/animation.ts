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

  public onEnter(getElement: () => HTMLElement, classes: { onEnter: string }): void {
    requestAnimationFrame(() => {
      const element = getElement();
      if(element) {
        element.classList.add(classes.onEnter);
        this.onAnimationEnd(element, () => {
          element.classList.remove(classes.onEnter);
        });
      }
    });
  }

  public onLeave(getElement: () => HTMLElement, callback: () => void, classes: { onLeave: string, onHide: string }): void {
    const element = getElement();
    if(element) {
      element.classList.add(classes.onLeave);
      const onAnimationEndCallback = () => {
        element.classList.remove(classes.onLeave);
        element.classList.add(classes.onHide);
        callback();
        setTimeout(() => {
          element.classList.remove(classes.onHide);
        }, 1);
      };
      this.onAnimationEnd(element, onAnimationEndCallback);
    } else {
      callback();
    }
  }
}
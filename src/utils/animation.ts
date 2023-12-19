export class Animation {
  public onEnter(getElement: () => HTMLElement, classes: { onEnter: string }): void {
    requestAnimationFrame(() => {
      const element = getElement();
      if(element) {
        element.classList.add(classes.onEnter);
        const onAnimationEnd = () => {
          element.classList.remove(classes.onEnter);
          element.removeEventListener("animationend", onAnimationEnd);
        };
        element.addEventListener("animationend", onAnimationEnd);
      }
    });
  }

  public onLeave(getElement: () => HTMLElement, callback: () => void, classes: { onLeave: string, onHide: string }): void {
    const element = getElement();
    if(element) {
      element.classList.add(classes.onLeave);
      const onAnimationEnd = () => {
        element.classList.remove(classes.onLeave);
        element.classList.add(classes.onHide);
        callback();
        setTimeout(() => {
          element.classList.remove(classes.onHide);
        }, 1);
        element.removeEventListener("animationend", onAnimationEnd);
      };
      element.addEventListener("animationend", onAnimationEnd);
    } else {
      callback();
    }
  }
}
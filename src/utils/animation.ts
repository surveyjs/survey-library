export class Animation {
  public onEnter(element: HTMLElement, classes: { onEnter: string }): void {
    requestAnimationFrame(() => {
      element.classList.add(classes.onEnter);
      const onAnimationEnd = () => {
        element.classList.remove(classes.onEnter);
        element.removeEventListener("animationend", onAnimationEnd);
      };
      element.addEventListener("animationend", onAnimationEnd);
    });
  }

  public onLeave(element: HTMLElement, callback: () => void, classes: { onLeave: string, onHide: string }): void {
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
  }
}
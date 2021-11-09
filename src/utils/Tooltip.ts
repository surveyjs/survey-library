export class TooltipManager {
  constructor(private targetElement: HTMLElement, private tooltipElement: HTMLElement) {
    targetElement.addEventListener("mousemove", this.onMouseMoveCallback);
  }
  dispose() {
    this.targetElement.removeEventListener("mousemove", this.onMouseMoveCallback);
  }

  private onMouseMoveCallback = (e: any) => {
    this.tooltipElement.style.left = e.clientX + 12 + "px";
    this.tooltipElement.style.top = e.clientY + 12 + "px";
  }
}
export class TooltipManager {
  private targetElement: HTMLElement;
  constructor(private tooltipElement: HTMLElement) {
    this.targetElement = tooltipElement.parentElement;
    this.targetElement.addEventListener("mousemove", this.onMouseMoveCallback);
  }
  dispose() {
    this.targetElement.removeEventListener("mousemove", this.onMouseMoveCallback);
  }

  private onMouseMoveCallback = (e: any) => {
    this.tooltipElement.style.left = e.clientX + 12 + "px";
    this.tooltipElement.style.top = e.clientY + 12 + "px";
  }
}
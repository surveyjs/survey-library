import { DomDocumentHelper, DomWindowHelper } from "../global_variables_utils";

export class ResizeManager {
  private originalMouseX: number;
  private originalMouseY: number;
  private originalWidth: number;
  private originalHeight: number;
  private mouseDevice: "mouse" | "pointer" | "touch";
  private events = {
    "mousedown": { "touch": "touchend", "mouse": "mousedown", "pointer": "pointerdown" },
    "mouseup": { "touch": "touchstart", "mouse": "mouseup", "pointer": "pointerup" },
    "mousemove": { "touch": "touchmove", "mouse": "mousemove", "pointer": "pointermove" },
  };
  constructor(private anchor: HTMLElement, private target: HTMLElement, private mode: "both" | "horizontal" | "vertical") {
    this.init();
  }
  private isEventSupported(eventName: string) {
    const document = DomDocumentHelper.getDocument();
    if (!document) return false;
    let el = document.createElement("div");
    eventName = "on" + eventName;
    let isSupported = (eventName in el);
    if (!isSupported) {
      el.setAttribute(eventName, "return;");
      isSupported = typeof el[eventName] == "function";
    }
    el = null;
    return isSupported;
  }
  private getEventPrefix() {
    if (this.mouseDevice === undefined) {
      if (this.isEventSupported("pointerdown")) {
        this.mouseDevice = "pointer";
      } else if (this.isEventSupported("touchstart")) {
        this.mouseDevice = "touch";
      } else if (this.isEventSupported("mousedown")) {
        this.mouseDevice = "mouse";
      }
    }
    return this.mouseDevice;
  }
  private getMouseEvent(eventName: string): string {
    return this.events[eventName][this.getEventPrefix()];
  }
  private onMouseDownListener = (e: any) => {
    const window = DomWindowHelper.getWindow();
    if (!window) return;
    e.preventDefault();
    this.originalWidth = this.target.offsetWidth;
    this.originalHeight = this.target.offsetHeight;
    this.originalMouseY = e.pageY;
    this.originalMouseX = e.pageX;
    window.addEventListener(this.getMouseEvent("mousemove"), this.resize);
    window.addEventListener(this.getMouseEvent("mouseup"), this.stopResize);
  };
  private resize = (e: any) => {
    if (this.mode !== "horizontal") {
      this.target.style.height = (this.originalHeight + e.pageY - this.originalMouseY) + "px";
      this.target.style.height = this.target.offsetHeight + "px";
    }
    if (this.mode !== "vertical") {
      this.target.style.width = (this.originalWidth + e.pageX - this.originalMouseX) + "px";
      this.target.style.width = this.target.offsetWidth + "px";
    }

  };
  private stopResize = (e: any) => {
    const window = DomWindowHelper.getWindow();
    if (!window) return;
    window.removeEventListener(this.getMouseEvent("mousemove"), this.resize);
    window.removeEventListener(this.getMouseEvent("mouseup"), this.stopResize);
  };
  private init() {
    this.anchor.addEventListener(this.getMouseEvent("mousedown"), this.onMouseDownListener);
  }

  public dispose(): void {
    this.anchor.removeEventListener(this.getMouseEvent("mousedown"), this.onMouseDownListener);
    this.anchor = undefined;
    this.target = undefined;
  }
}
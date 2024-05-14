import { IsTouch } from "./devices";
import { DomDocumentHelper } from "../global_variables_utils";

export class DragOrClickHelper {
  private pointerDownEvent:any;
  private currentTarget: any;
  private startX: any;
  private startY: any;
  private currentX: any;
  private currentY: any;
  private itemModel: any;

  constructor(private dragHandler: any) { }

  public onPointerDown(pointerDownEvent: any, itemModel?: any) {
    if (IsTouch) {
      this.dragHandler(pointerDownEvent, pointerDownEvent.currentTarget, itemModel); //TODO handle inside in the library's drag drop core, need refactoring
      return;
    }
    this.pointerDownEvent = pointerDownEvent;
    this.currentTarget = pointerDownEvent.currentTarget;
    this.startX = pointerDownEvent.pageX;
    this.startY = pointerDownEvent.pageY;
    DomDocumentHelper.addEventListener("pointermove", this.tryToStartDrag);
    this.currentTarget.addEventListener("pointerup", this.onPointerUp);
    this.itemModel = itemModel;
  }

  private onPointerUp = (pointerUpEvent: any) => {
    this.clearListeners();
  }

  private tryToStartDrag = (pointerMoveEvent: any) => {
    this.currentX = pointerMoveEvent.pageX;
    this.currentY = pointerMoveEvent.pageY;
    if (this.isMicroMovement) return;

    this.clearListeners();

    this.dragHandler(this.pointerDownEvent, this.currentTarget, this.itemModel);
    return true;
  };

  // see https://stackoverflow.com/questions/6042202/how-to-distinguish-mouse-click-and-drag
  private get isMicroMovement() {
    const delta = 10;
    const diffX = Math.abs(this.currentX - this.startX);
    const diffY = Math.abs(this.currentY - this.startY);
    return diffX < delta && diffY < delta;
  }
  private clearListeners() {
    if (!this.pointerDownEvent) return;
    DomDocumentHelper.removeEventListener("pointermove", this.tryToStartDrag);
    this.currentTarget.removeEventListener("pointerup", this.onPointerUp);
  }
}
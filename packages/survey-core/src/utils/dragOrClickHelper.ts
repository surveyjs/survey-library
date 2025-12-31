import { IsTouch } from "./devices";

export interface ITargets {
  target: HTMLElement; currentTarget: HTMLElement;
}

export class DragOrClickHelper<T = any> {
  private pointerDownEvent:any;
  private targets: ITargets;
  private startX: any;
  private startY: any;
  private currentX: any;
  private currentY: any;
  private itemModel: any;

  private rootNode: Document | ShadowRoot | null = null;

  constructor(public dragHandler: (event: PointerEvent, targets: ITargets, item?: T) => void, public preventOnTouch = true) { }

  public onPointerDown(pointerDownEvent: PointerEvent, itemModel?: T) {
    this.targets = { currentTarget: pointerDownEvent.currentTarget as HTMLElement, target: pointerDownEvent.target as HTMLElement };
    if (IsTouch && this.preventOnTouch) {
      this.dragHandler(pointerDownEvent, this.targets, itemModel); //TODO handle inside in the library's drag drop core, need refactoring
      return;
    }
    this.pointerDownEvent = pointerDownEvent;
    this.startX = pointerDownEvent.pageX;
    this.startY = pointerDownEvent.pageY;
    const root = this.targets.currentTarget.getRootNode();
    if (!(root instanceof Document || root instanceof ShadowRoot)) return;
    root.addEventListener("pointermove", this.tryToStartDrag);
    this.rootNode = root;
    this.targets.currentTarget.addEventListener("pointerup", this.onPointerUp);
    this.itemModel = itemModel;
  }

  private onPointerUp = (pointerUpEvent: any) => {
    this.clearListeners();
  };

  private tryToStartDrag = (pointerMoveEvent: any) => {
    this.currentX = pointerMoveEvent.pageX;
    this.currentY = pointerMoveEvent.pageY;
    if (this.isMicroMovement) return;

    this.clearListeners();

    this.dragHandler(this.pointerDownEvent, this.targets, this.itemModel);
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
    this.rootNode?.removeEventListener("pointermove", this.tryToStartDrag);
    this.targets.currentTarget.getRootNode().removeEventListener("pointermove", this.tryToStartDrag);
    this.targets.currentTarget.removeEventListener("pointerup", this.onPointerUp);
  }
}

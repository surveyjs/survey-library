import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { IsMobile } from "../utils/devices";
import { DomDocumentHelper } from "../global_variables_utils";
export class DragDropRankingChoices extends DragDropChoices {
  protected get draggedElementType(): string {
    return "ranking-item";
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement,
    event: PointerEvent
  ): HTMLElement {
    const draggedElementShortcut: any = DomDocumentHelper.createElement("div");
    if(!draggedElementShortcut) return;

    draggedElementShortcut.className = this.shortcutClass + " sv-ranking-shortcut";

    const isDeepClone = true;
    const clone = <HTMLElement>draggedElementNode.cloneNode(isDeepClone);
    draggedElementShortcut.appendChild(clone);

    const rect = draggedElementNode.getBoundingClientRect();
    draggedElementShortcut.shortcutXOffset = event.clientX - rect.x;
    draggedElementShortcut.shortcutYOffset = event.clientY - rect.y;

    if (this.parentElement && this.parentElement.useFullItemSizeForShortcut) {
      draggedElementShortcut.style.width = draggedElementNode.offsetWidth + "px";
      draggedElementShortcut.style.height = draggedElementNode.offsetHeight + "px";
    }

    return draggedElementShortcut;
  }

  private get shortcutClass(): string {
    return new CssClassBuilder()
      .append(this.parentElement.cssClasses.root)
      .append(this.parentElement.cssClasses.rootMobileMod, IsMobile)
      .toString();
  }

  protected getDropTargetByDataAttributeValue(dataAttributeValue: string): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  private isDragOverRootNode: boolean = false;

  protected findDropTargetNodeByDragOverNode(dragOverNode: HTMLElement): HTMLElement {
    this.isDragOverRootNode = this.getIsDragOverRootNode(dragOverNode);
    return super.findDropTargetNodeByDragOverNode(dragOverNode);
  }

  private getIsDragOverRootNode(dragOverNode: HTMLElement) {
    // dragOverNode might be <path></path> for example and the className prop is obj
    return typeof dragOverNode.className === "string" &&
      dragOverNode.className.indexOf("sv-ranking") !== -1;
  }

  protected isDropTargetValid(
    dropTarget: ItemValue,
    dropTargetNode?: HTMLElement
  ): boolean {
    const choices = this.parentElement.rankingChoices;

    const dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    if (draggedElementIndex > dropTargetIndex && dropTargetNode.classList.contains("sv-dragdrop-moveup")) {
      this.parentElement.dropTargetNodeMove = null;
      return false;
    }

    if (draggedElementIndex < dropTargetIndex && dropTargetNode.classList.contains("sv-dragdrop-movedown")) {
      this.parentElement.dropTargetNodeMove = null;
      return false;
    }

    if (choices.indexOf(dropTarget) === -1)
      // shouldn't allow to drop on "adorners" (selectall, none, other)
      return false;

    return true;
  }
  protected calculateIsBottom(clientY: number): boolean {
    const choices = this.parentElement.rankingChoices;
    return (
      choices.indexOf(this.dropTarget) - choices.indexOf(this.draggedElement) >
      0
    );
  }

  protected doDragOver = (): any => {
    const node = this.domAdapter.draggedElementShortcut.querySelector<HTMLElement>(".sv-ranking-item");
    node.style.cursor = "grabbing";
  };

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    const choices = this.parentElement.rankingChoices;
    const dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    choices.splice(draggedElementIndex, 1);
    choices.splice(dropTargetIndex, 0, this.draggedElement);
    this.parentElement.setPropertyValue("rankingChoices", choices);
    //return;
    this.updateDraggedElementShortcut(dropTargetIndex + 1);

    if (draggedElementIndex !== dropTargetIndex) {
      dropTargetNode.classList.remove("sv-dragdrop-moveup");
      dropTargetNode.classList.remove("sv-dragdrop-movedown");
      this.parentElement.dropTargetNodeMove = null;
    }

    if (draggedElementIndex > dropTargetIndex) {
      this.parentElement.dropTargetNodeMove = "down";
    }

    if (draggedElementIndex < dropTargetIndex) {
      this.parentElement.dropTargetNodeMove = "up";
    }
  }

  protected updateDraggedElementShortcut(newIndex: number) {
    const newIndexText = newIndex !== null ? newIndex + "" : "";
    // TODO should avoid direct DOM manipulation, do through the frameworks instead
    const indexNode: HTMLElement = this.domAdapter.draggedElementShortcut.querySelector(
      ".sv-ranking-item__index"
    );
    indexNode.innerText = newIndexText;
  }

  protected ghostPositionChanged(): void {
    this.parentElement.currentDropTarget = this.draggedElement;
    super.ghostPositionChanged();
  }

  protected doBanDropHere = (): any => {
    if (this.isDragOverRootNode) {
      this.allowDropHere = true;
      return;
    }

    const node = this.domAdapter.draggedElementShortcut.querySelector<HTMLElement>(".sv-ranking-item");
    node.style.cursor = "not-allowed";
  };

  protected doDrop(): any {
    this.parentElement.setValue();
    return this.parentElement;
  }

  public clear(): void {
    if(!!this.parentElement) {
      this.parentElement.dropTargetNodeMove = null;
      this.parentElement.updateRankingChoices(true);
    }
    super.clear();
  }
}

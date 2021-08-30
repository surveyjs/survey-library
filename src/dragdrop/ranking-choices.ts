import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
export class DragDropRankingChoices extends DragDropChoices {

  protected createDraggedElementShortcut(text: string, draggedElementNode: HTMLElement) {
    const draggedElementShortcut = document.createElement("div");
    // draggedElementShortcut.innerText = text;
    draggedElementShortcut.style.cssText =
        ` 
          cursor: grabbing;
          position: absolute;
          z-index: 1000;
          border-radius: 36px;
          min-width: 100px;
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
          background-color: white;
          padding-right: 16px;
          padding-left: 20px;
        `;

    const isDeepClone = true;
    const clone = draggedElementNode.cloneNode(isDeepClone);
    draggedElementShortcut.appendChild(clone);

    return draggedElementShortcut;
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: string
  ): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  protected isDropTargetValid(dropTarget: ItemValue): boolean {
    const choices = this.parentElement.visibleChoices;

    // shouldn't allow to drop on "adorners" (selectall, none, other)
    if (choices.indexOf(dropTarget) === -1) return false;

    return true;
  }

  protected afterDragOver(): void {
    const choices = this.parentElement.choices;
    const dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    choices.splice(draggedElementIndex, 1);
    choices.splice(dropTargetIndex, 0, this.draggedElement);
    this.parentElement.setValue();
    this.updateDraggedElementShortcut(dropTargetIndex + 1);
  }

  private updateDraggedElementShortcut(newIndex: number) {
    const newIndexText = newIndex + "";
    // TODO should avoid direct DOM manipulation, do through the frameworks instead
    const indexNode:HTMLElement = this.draggedElementShortcut.querySelector(".sv-ranking-item__index");
    indexNode.innerText = newIndexText;
  }

  protected ghostPositionChanged(): void {
    this.parentElement.currentDragTarget = this.draggedElement;
    super.ghostPositionChanged();
  }

  protected doDrop = (): any => {
    super.doDrop();
    this.parentElement.setValue();
    return this.parentElement;
  };
}

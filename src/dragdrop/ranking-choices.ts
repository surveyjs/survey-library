import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
export class DragDropRankingChoices extends DragDropChoices {
  protected get draggedElementType(): string {
    return "ranking-item";
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement
  ): HTMLElement {
    const draggedElementShortcut = document.createElement("div");
    // draggedElementShortcut.innerText = text;
    draggedElementShortcut.style.cssText = ` 
          cursor: grabbing;
          position: absolute;
          z-index: 1000;
          border-radius: 36px;
          min-width: 100px;
          box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
          background-color: white;
          padding-right: 16px;
          padding-left: 20px;
          font-family: "Open Sans";
        `;

    const isDeepClone = true;
    const clone = <HTMLElement>draggedElementNode.cloneNode(isDeepClone);
    draggedElementShortcut.appendChild(clone);

    return draggedElementShortcut;
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: string
  ): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  protected isDropTargetValid(
    dropTarget: ItemValue,
    isBottom: boolean,
    dropTargetNode?: HTMLElement
  ): boolean {
    const choices = this.parentElement.rankingChoices;

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

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    const choices = this.parentElement.rankingChoices;
    const dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    choices.splice(draggedElementIndex, 1);
    choices.splice(dropTargetIndex, 0, this.draggedElement);
    this.parentElement.setPropertyValue("rankingChoices", choices);
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

  private updateDraggedElementShortcut(newIndex: number) {
    const newIndexText = newIndex + "";
    // TODO should avoid direct DOM manipulation, do through the frameworks instead
    const indexNode: HTMLElement = this.draggedElementShortcut.querySelector(
      ".sv-ranking-item__index"
    );
    indexNode.innerText = newIndexText;
  }

  protected ghostPositionChanged(): void {
    this.parentElement.currentDropTarget = this.draggedElement;
    super.ghostPositionChanged();
  }

  protected doDrop = (): any => {
    this.parentElement.setValue();
    return this.parentElement;
  };

  protected handleEscapeButton = (event: KeyboardEvent): void => {
    if (event.keyCode == 27) {
      this.parentElement.updateRankingChoices();
      this.clear();
    }
  };

  protected doClear = (): void => {
    this.parentElement.dropTargetNodeMove = null;
  };
}

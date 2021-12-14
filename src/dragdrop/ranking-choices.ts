import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { IsMobile } from "../utils/is-mobile";
export class DragDropRankingChoices extends DragDropChoices {
  protected get draggedElementType(): string {
    return "ranking-item";
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement
  ): HTMLElement {
    const draggedElementShortcut = document.createElement("div");
    draggedElementShortcut.className = this.shortcutClass;
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

  private get shortcutClass(): string {
    return new CssClassBuilder()
      .append(this.parentElement.cssClasses.root)
      .append(this.parentElement.cssClasses.rootMobileMod, IsMobile)
      .toString();
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: string
  ): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  private isDragOverRootNode: boolean = false;

  protected findDropTargetNodeByDragOverNode(
    dragOverNode: HTMLElement
  ): HTMLElement {
    this.isDragOverRootNode = dragOverNode.className.indexOf("sv-ranking") !== -1;
    return dragOverNode.closest(this.dropTargetDataAttributeName);
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
    const node = this.draggedElementShortcut.querySelector(".sv-ranking-item");
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

  protected doBanDropHere = (): any => {
    if (this.isDragOverRootNode) {
      this.allowDropHere = true;
      return;
    }

    const node = this.draggedElementShortcut.querySelector(".sv-ranking-item");
    node.style.cursor = "not-allowed";
  };

  protected doDrop = (): any => {
    this.parentElement.setValue();
    return this.parentElement;
  };

  protected doClear = (): void => {
    this.parentElement.dropTargetNodeMove = null;
    this.parentElement.updateRankingChoices();
  };
}

import { QuestionRankingModel } from "src/question_ranking";
import { ItemValue } from "../itemvalue";
import { QuestionSelectBase } from "../question_baseselect";
import { DragDropCore } from "./core";

export class DragDropChoices extends DragDropCore<QuestionSelectBase> {
  protected get draggedElementType(): string {
    return "item-value";
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement,
    event: PointerEvent
  ): HTMLElement {
    if (this.parentElement.getType() === "imagepicker") {
      return this.createImagePickerShortcut(text, draggedElementNode, event);
    }
    const draggedElementShortcut:any = document.createElement("div");
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
          font-family: "Open Sans";
        `;

    const isDeepClone = true;
    const clone = <HTMLElement>(
      draggedElementNode
        .closest("[data-sv-drop-target-item-value]")
        .cloneNode(isDeepClone)
    );
    const controlsNode: HTMLElement = clone.querySelector(".svc-item-value-controls");
    controlsNode.style.display = "block";

    clone.classList.remove("svc-item-value--moveup");
    clone.classList.remove("svc-item-value--movedown");
    this.draggedElement.isDragDropMoveDown = false;
    this.draggedElement.isDragDropMoveUp = false;

    draggedElementShortcut.appendChild(clone);

    const rect = draggedElementNode.getBoundingClientRect();
    draggedElementShortcut.shortcutXOffset = event.clientX - rect.x;
    draggedElementShortcut.shortcutYOffset = event.clientY - rect.y;

    this.isBottom = null;

    return draggedElementShortcut;
  }

  private createImagePickerShortcut(text: string, draggedElementNode: HTMLElement, event: PointerEvent) {
    const draggedElementShortcut:any = document.createElement("div");
    draggedElementShortcut.style.cssText = ` 
      cursor: grabbing;
      position: absolute;
      z-index: 1000;
      box-shadow: 0px 8px 16px rgba(0, 0, 0, 0.1);
      padding: 4px;
      border-radius: 4px;
      background: white;
    `;

    const itemValueNode = draggedElementNode.closest("[data-sv-drop-target-item-value]");
    const controlsNode: HTMLElement = itemValueNode.querySelector(".svc-image-item-value-controls");
    const imageContainerNode:any = itemValueNode.querySelector(".sd-imagepicker__image-container");
    const imageNode:any = itemValueNode.querySelector("img");

    controlsNode.style.display = "none";
    imageContainerNode.style.width = imageNode.width + "px";
    imageContainerNode.style.height = imageNode.height + "px";

    imageNode.style.objectFit = "cover";
    imageNode.style.borderRadius = "4px";

    draggedElementShortcut.appendChild(imageNode);

    return draggedElementShortcut;
  }

  protected findDropTargetNodeByDragOverNode(
    dragOverNode: HTMLElement
  ): HTMLElement {
    const result: HTMLElement = dragOverNode.closest(
      this.dropTargetDataAttributeName
    );
    return result;
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: string
  ): ItemValue {
    let dragOverChoice;

    dragOverChoice = this.parentElement.choices.filter(
      (choice: ItemValue) => "" + choice.value == dataAttributeValue
    )[0];

    return dragOverChoice;
  }

  private getVisibleChoices() {
    const parent = this.parentElement;
    if (parent.getType() === "ranking") return <QuestionRankingModel>parent.rankingChoices;
    return parent.visibleChoices;
  }

  protected isDropTargetValid(
    dropTarget: ItemValue
  ): boolean {
    const choices = this.getVisibleChoices();

    if (this.parentElement.getType() !== "imagepicker") {
      const dropTargetIndex = choices.indexOf(this.dropTarget);
      const draggedElementIndex = choices.indexOf(this.draggedElement);

      if (draggedElementIndex > dropTargetIndex && this.dropTarget.isDragDropMoveUp) {
        this.dropTarget.isDragDropMoveUp = false;
        return false;
      }

      if (draggedElementIndex < dropTargetIndex && this.dropTarget.isDragDropMoveDown) {
        this.dropTarget.isDragDropMoveDown = false;
        return false;
      }
    }

    // shouldn't allow to drop on "adorners" (selectall, none, other)
    if (choices.indexOf(dropTarget) === -1) return false;

    return true;
  }

  protected calculateIsBottom(clientY: number): boolean {
    const choices = this.getVisibleChoices();
    return (
      choices.indexOf(this.dropTarget) - choices.indexOf(this.draggedElement) >
      0
    );
  }

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    if (this.isDropTargetDoesntChanged(this.isBottom)) return;
    if (this.dropTarget === this.draggedElement) return;

    const choices = this.getVisibleChoices();
    const dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    choices.splice(draggedElementIndex, 1);
    choices.splice(dropTargetIndex, 0, this.draggedElement);

    if (this.parentElement.getType() === "imagepicker") return;

    if (draggedElementIndex !== dropTargetIndex) {
      dropTargetNode.classList.remove("svc-item-value--moveup");
      dropTargetNode.classList.remove("svc-item-value--movedown");
      this.dropTarget.isDragDropMoveDown = false;
      this.dropTarget.isDragDropMoveUp = false;
    }

    if (draggedElementIndex > dropTargetIndex) {
      this.dropTarget.isDragDropMoveDown = true;
    }

    if (draggedElementIndex < dropTargetIndex) {
      this.dropTarget.isDragDropMoveUp = true;
    }
    super.ghostPositionChanged();
  }

  protected doDrop(): any {
    const choices = this.parentElement.choices;
    const filteredChoices = this.getVisibleChoices().filter((item: any) => {
      return choices.indexOf(item) !== -1;
    });

    const oldIndex = choices.indexOf(this.draggedElement);
    let newIndex = filteredChoices.indexOf(this.draggedElement);

    choices.splice(oldIndex, 1);
    choices.splice(newIndex, 0, this.draggedElement);

    return this.parentElement;
  }

  protected doClear(): void {
    this.updateVisibleChoices();
  }

  private updateVisibleChoices() {
    const parent = this.parentElement;
    this.parentElement.getType() === "ranking" ?
      parent.updateRankingChoices() :
      parent["updateVisibleChoices"]();
  }
}

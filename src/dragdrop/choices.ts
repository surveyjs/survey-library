import { ItemValue } from "../itemvalue";
import { QuestionSelectBase } from "../question_baseselect";
import { DragDropCore } from "./core";

export class DragDropChoices extends DragDropCore<QuestionSelectBase> {
  protected get draggedElementType(): string {
    return "item-value";
  }

  protected getShortcutText(draggedElement: ItemValue): string {
    return draggedElement.text;
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
        `;

    const isDeepClone = true;
    const clone = <HTMLElement>(
      draggedElementNode
        .closest("[data-sv-drop-target-item-value]")
        .cloneNode(isDeepClone)
    );
    draggedElementShortcut.appendChild(clone);

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

  protected isDropTargetValid(
    dropTarget: ItemValue,
    isBottom: boolean,
    dropTargetNode?: HTMLElement
  ): boolean {
    const choices = this.parentElement.choices;

    if (this.dropTarget === this.draggedElement) return false;

    // shouldn't allow to drop on "adorners" (selectall, none, other)
    if (choices.indexOf(dropTarget) === -1) return false;

    return true;
  }

  protected calculateIsBottom(clientY: number): boolean {
    const choices = this.parentElement.choices;
    return (
      choices.indexOf(this.dropTarget) - choices.indexOf(this.draggedElement) >
      0
    );
  }

  protected doDrop(): any {
    const isTop = !this.isBottom;
    const choices = this.parentElement.choices;
    const oldIndex = choices.indexOf(this.draggedElement);
    let newIndex = choices.indexOf(this.dropTarget);

    if (oldIndex < newIndex && isTop) {
      newIndex--;
    } else if (oldIndex > newIndex && this.isBottom) {
      newIndex++;
    }

    choices.splice(oldIndex, 1);
    choices.splice(newIndex, 0, this.draggedElement);

    return this.parentElement;
  }
}

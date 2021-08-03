import { ItemValue } from "survey-core";
import { DragDropCore } from "./core";

export class DragDropChoices extends DragDropCore {
  protected get draggedElementType(): string {
    return "item-value";
  }

  protected getShortcutText() {
    return this.draggedElement.text;
  }

  protected getDropTargetByName(dragOverElementName: string) {
    let dragOverChoice;

    dragOverChoice = this.parentElement.choices.filter(
      (choice: ItemValue) => choice.value === dragOverElementName
    )[0];

    return dragOverChoice;
  }

  protected findDropTargetNodeByDragOverNode(dragOverNode: Element): HTMLElement {
    return dragOverNode.querySelector(this.dropTargetDataAttributeName);
  }

  protected isDropTargetValid(dropTarget: any, isBottom: boolean) {
    const choices = this.parentElement.choices;

    // shouldn't allow to drop on "adorners" (selectall, none, other)
    if (choices.indexOf(dropTarget) === -1) {
      this.banDropHere();
      return false;
    }

    return true;
  }

  protected calculateIsBottom(clientY: number): boolean {
    const choices = this.parentElement.choices;
    let isBottom;
    //drag over next item
    if (
      choices.indexOf(this.dropTarget) -
        choices.indexOf(this.draggedElement) ===
      1
    ) {
      isBottom = true;
    }

    //drag over prev item
    if (
      choices.indexOf(this.draggedElement) -
        choices.indexOf(this.dropTarget) ===
      1
    ) {
      isBottom = false;
    }

    return isBottom;
  }

  protected doDrop = () => {
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
  };
}

import { ItemValue } from "survey-core";
import { DragDropCore } from "./core";

export class DragDropChoices extends DragDropCore {
  protected get draggedElementType(): string {
    return "item-value";
  }

  protected getShortcutText(draggedElement: any) {
    return draggedElement.text;
  }

  protected getDropTargetByDataAttributeValue(dataAttributeValue: string) {
    let dragOverChoice;

    dragOverChoice = this.parentElement.choices.filter(
      (choice: ItemValue) => choice.value === dataAttributeValue
    )[0];

    return dragOverChoice;
  }

  protected isDropTargetValid(dropTarget: any) {
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
    return (
      choices.indexOf(this.dropTarget) - choices.indexOf(this.draggedElement) >
      0
    );
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

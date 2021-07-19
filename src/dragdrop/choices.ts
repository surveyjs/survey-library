import { ItemValue } from "survey-core";
import { DragDropCore } from "./core";

export class DragDropChoices extends DragDropCore {
  protected get draggedElementType(): string {
    return "item-value";
  }

  protected getDragOverElementByName(dragOverElementName: string) {
    let dragOverChoice;

    dragOverChoice = this.parentElement.choices.filter(
      (choice: ItemValue) => choice.value === dragOverElementName
    )[0];

    return dragOverChoice;
  }
}

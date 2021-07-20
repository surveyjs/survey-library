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

  protected doDragOver(
    dropTargetSurveyElement: any,
    isBottom: boolean,
    isEdge: boolean
  ) {
    const choices = this.parentElement.choices;

    // shouldn't allow to drop on "adorners" (selectall, none, other)
    if (choices.indexOf(dropTargetSurveyElement) === -1) {
      this.banDropHere();
      return;
    }

    //drag over next item
    if (
      choices.indexOf(dropTargetSurveyElement) -
        choices.indexOf(this.draggedElement) ===
      1
    ) {
      isBottom = true;
    }

    //drag over prev item
    if (
      choices.indexOf(this.draggedElement) -
        choices.indexOf(dropTargetSurveyElement) ===
      1
    ) {
      isBottom = false;
    }

    if (dropTargetSurveyElement === this.draggedElement) {
      this.banDropHere();
      return true;
    }

    if (
      dropTargetSurveyElement === this.dropTargetSurveyElement &&
      isEdge === this.isEdge &&
      isBottom === this.isBottom
    )
      return;

    this.dropTargetSurveyElement = dropTargetSurveyElement;
    this.isEdge = isEdge;
    this.isBottom = isBottom;
  }

  protected doDrop = () => {
    const isTop = !this.isBottom;
    const choices = this.parentElement.choices;
    const oldIndex = choices.indexOf(this.draggedElement);
    let newIndex = choices.indexOf(this.dropTargetSurveyElement);

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

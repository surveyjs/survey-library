import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
export class DragDropRankingChoices extends DragDropChoices {
  protected getShortcutText(draggedElement: ItemValue): string {
    const index = this.parentElement.ran;
    return draggedElement.text;
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

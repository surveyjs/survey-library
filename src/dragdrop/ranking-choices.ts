import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
export class DragDropRankingChoices extends DragDropChoices {
  protected getShortcutText(draggedElement: ItemValue): string {
    const index = this.parentElement.ran;
    return draggedElement.text;
  }

  protected getDropTargetByDataAttributeValue(dataAttributeValue: string): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  protected doDrop = ():any => {
    super.doDrop();
    this.parentElement.setValue();
    return this.parentElement;
  };
}

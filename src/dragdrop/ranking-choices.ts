import { ItemValue } from "src/itemvalue";
import { DragDropChoices } from "./choices";
export class DragDropRankingChoices extends DragDropChoices {
  protected getDropTargetByDataAttributeValue(dataAttributeValue: string): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  protected doDrop = ():any => {
    super.doDrop();
    this.parentElement.setValue();
    return this.parentElement;
  };
}

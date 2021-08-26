import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
export class DragDropRankingChoices extends DragDropChoices {
  private prevDropTargetNode: HTMLElement = null;

  protected getShortcutText(draggedElement: ItemValue): string {
    const index = this.parentElement.ran;
    return draggedElement.text;
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: string
  ): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  protected doDragOver(dropTargetNode: HTMLElement): void {
    if (this.prevDropTargetNode) return;
    dropTargetNode.className += " sv-ranking-item--ghost";
    this.prevDropTargetNode = dropTargetNode;
  }

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    const node = this.prevDropTargetNode;
    node.className = node.className.replace(" sv-ranking-item--ghost", "");
    this.prevDropTargetNode = null;
  }

  protected doDrop = (): any => {
    super.doDrop();
    this.parentElement.setValue();
    return this.parentElement;
  };
}

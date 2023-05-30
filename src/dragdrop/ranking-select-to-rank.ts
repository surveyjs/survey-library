import { ItemValue, QuestionRankingModel } from "survey-core";
import { DragDropRankingChoices } from "./ranking-choices";

export class DragDropRankingSelectToRank extends DragDropRankingChoices {
  protected findDropTargetNodeByDragOverNode(
    dragOverNode: HTMLElement
  ): HTMLElement {
    if (this.parentElement.isEmpty()) {
      const toContainer: HTMLElement = dragOverNode.closest("[data-ranking='to-container']");
      if (!!toContainer) {
        return toContainer;
      } else {
        return null;
      }
    }

    return super.findDropTargetNodeByDragOverNode(dragOverNode);
  }

  protected getDropTargetByDataAttributeValue(dataAttributeValue: string): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue] || this.parentElement.unRankingChoices[dataAttributeValue];
  }

  protected getDropTargetByNode(
    dropTargetNode: HTMLElement,
    event: PointerEvent
  ): any {
    if (dropTargetNode.dataset.ranking === "to-container") {
      return "to-container";
    }

    if (dropTargetNode.closest("[data-ranking='from-container']")) {
      return "from-container";
    }

    return super.getDropTargetByNode(dropTargetNode, event);
  }

  protected isDropTargetValid(
    dropTarget: ItemValue | string,
    dropTargetNode?: HTMLElement
  ): boolean {
    if (dropTarget === "to-container" || dropTarget === "from-container") {
      return true;
    } else {
      return super.isDropTargetValid(<ItemValue>dropTarget, dropTargetNode);
    }
  }

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    const questionModel: any = this.parentElement;

    let rankingChoices = this.parentElement.rankingChoices;
    let unRankingChoices = this.parentElement.unRankingChoices;
    let fromIndex;
    let toIndex;

    if (this.isDraggedElementUnranked) {
      fromIndex = unRankingChoices.indexOf(this.draggedElement);
      if (rankingChoices.length === 0) {
        toIndex = 0;
      } else {
        toIndex = rankingChoices.indexOf(this.dropTarget);
      }
      this.selectToRank(questionModel, fromIndex, toIndex);
      this.doUIEffects(dropTargetNode, fromIndex, toIndex);
      return;
    }

    if (this.isDraggedElementRanked && this.isDropTargetRanked) {
      fromIndex = rankingChoices.indexOf(this.draggedElement);
      toIndex = rankingChoices.indexOf(this.dropTarget);
      this.reorderRankedItem(questionModel, fromIndex, toIndex);
      this.doUIEffects(dropTargetNode, fromIndex, toIndex);
      return;
    }

    if (this.isDraggedElementRanked && !this.isDropTargetRanked) {
      fromIndex = rankingChoices.indexOf(this.draggedElement);
      if (unRankingChoices.length === 0) {
        toIndex = 0;
      } else {
        toIndex = unRankingChoices.indexOf(this.dropTarget);
      }
      this.unselectFromRank(questionModel, fromIndex);
      this.doUIEffects(dropTargetNode, fromIndex, toIndex);
      return;
    }
  }

  private doUIEffects(dropTargetNode: HTMLElement, fromIndex: number, toIndex:number) {
    this.updateDraggedElementShortcut(toIndex + 1);

    if (fromIndex !== toIndex) {
      dropTargetNode.classList.remove("sv-dragdrop-moveup");
      dropTargetNode.classList.remove("sv-dragdrop-movedown");
      this.parentElement.dropTargetNodeMove = null;
    }

    if (fromIndex > toIndex) {
      this.parentElement.dropTargetNodeMove = "down";
    }

    if (fromIndex < toIndex) {
      this.parentElement.dropTargetNodeMove = "up";
    }
  }

  private get isDraggedElementRanked() {
    return this.parentElement.rankingChoices.indexOf(this.draggedElement) !== -1;
  }

  private get isDropTargetRanked() {
    return this.parentElement.rankingChoices.indexOf(this.dropTarget) !== -1;
  }

  private get isDraggedElementUnranked() {
    return !this.isDraggedElementRanked;
  }

  private get isDropTargetUnranked() {
    return !this.isDropTargetRanked;
  }

  // protected doClear = (): void => {
  //   this.parentElement.dropTargetNodeMove = null;
  //   this.parentElement.updateRankingChoices(true);
  //   this.parentElement["updateVisibleChoices"]();
  // };

  public selectToRank(questionModel: QuestionRankingModel, fromIndex: number, toIndex: number): void {
    const rankingChoices = questionModel.rankingChoices;
    const unRankingChoices = questionModel.unRankingChoices;
    const item = unRankingChoices[fromIndex];

    rankingChoices.splice(toIndex, 0, item);
    questionModel.setPropertyValue("rankingChoices", rankingChoices);
  }

  public unselectFromRank(questionModel: QuestionRankingModel, fromIndex: number) {
    const rankingChoices = questionModel.rankingChoices;
    rankingChoices.splice(fromIndex, 1);
    questionModel.setPropertyValue("rankingChoices", rankingChoices);
  }

  public reorderRankedItem(questionModel: QuestionRankingModel, fromIndex: number, toIndex: number): void {
    const rankingChoices = questionModel.rankingChoices;
    const item = rankingChoices[fromIndex];

    rankingChoices.splice(fromIndex, 1);
    rankingChoices.splice(toIndex, 0, item);
    questionModel.setPropertyValue("rankingChoices", rankingChoices);
  }
}

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

  protected getDropTargetByNode(
    dropTargetNode: HTMLElement,
    event: PointerEvent
  ): any {
    if (dropTargetNode.dataset.ranking === "to-container") {
      return "to-container";
    }

    return super.getDropTargetByNode(dropTargetNode, event);
  }

  protected isDropTargetValid(
    dropTarget: ItemValue | string,
    dropTargetNode?: HTMLElement
  ): boolean {
    if (dropTarget === "to-container") {
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

    if (this.dropTarget === "to-container" && rankingChoices.length === 0) {
      fromIndex = unRankingChoices.indexOf(this.draggedElement);
      toIndex = 0;
      this.selectToRank(questionModel, fromIndex, toIndex);
      this.doUIEffects(dropTargetNode, fromIndex, toIndex);
      return;
    }

    if (!this.isDraggedElementOrdered && this.isDropTargetElementOrdered) {
      fromIndex = unRankingChoices.indexOf(this.draggedElement);
      toIndex = rankingChoices.indexOf(this.dropTarget);
      this.selectToRank(questionModel, fromIndex, toIndex);
      this.doUIEffects(dropTargetNode, fromIndex, toIndex);
      return;
    }

    if (this.isDraggedElementOrdered && this.isDropTargetElementOrdered) {
      fromIndex = rankingChoices.indexOf(this.draggedElement);
      toIndex = rankingChoices.indexOf(this.dropTarget);
      unRankingChoices.splice(fromIndex, 1);
      rankingChoices.splice(toIndex, 0, this.draggedElement);
      this.parentElement.setPropertyValue("rankingChoices", rankingChoices);
      this.doUIEffects(dropTargetNode, fromIndex, toIndex);
      return;
    }

    if (this.isDraggedElementOrdered && !this.isDropTargetElementOrdered) {
      fromIndex = rankingChoices.indexOf(this.draggedElement);
      toIndex = unRankingChoices.indexOf(this.dropTarget);
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

  private get isDraggedElementOrdered() {
    return this.parentElement.rankingChoices.indexOf(this.draggedElement) !== -1;
  }

  private get isDropTargetElementOrdered() {
    return this.parentElement.rankingChoices.indexOf(this.dropTarget) !== -1;
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
}

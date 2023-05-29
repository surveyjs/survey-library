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
    let choices = this.parentElement.rankingChoices;
    const unRankingChoices = this.parentElement.unRankingChoices;
    let dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    // visibleChoices.splice(visibleChoices.indexOf(this.draggedElement), 1);
    // rankingChoices.splice(0, 0, this.draggedElement);
    // parentElement.setPropertyValue("rankingChoices", rankingChoices);

    if (this.dropTarget === "to-container" && choices.length === 0) {
      unRankingChoices.splice(unRankingChoices.indexOf(this.draggedElement), 1);
      dropTargetIndex = 0;
      // choices.splice(1, 0, this.draggedElement);
      //this.parentElement.setPropertyValue("rankingChoices", choices);
      //this.updateDraggedElementShortcut(1);
      //return;
    }

    if (this.isDraggedElementOrdered || this.dropTarget === "from-container") {
      choices.splice(draggedElementIndex, 1);
    }

    if (this.dropTarget === "to-container") {
      choices.splice(dropTargetIndex, 0, this.draggedElement);
    } else {
      unRankingChoices.splice(dropTargetIndex, 0, this.draggedElement);
    }

    this.parentElement.setPropertyValue("rankingChoices", choices);
    //return;
    this.updateDraggedElementShortcut(dropTargetIndex + 1);

    if (draggedElementIndex !== dropTargetIndex) {
      dropTargetNode.classList.remove("sv-dragdrop-moveup");
      dropTargetNode.classList.remove("sv-dragdrop-movedown");
      this.parentElement.dropTargetNodeMove = null;
    }

    if (draggedElementIndex > dropTargetIndex) {
      this.parentElement.dropTargetNodeMove = "down";
    }

    if (draggedElementIndex < dropTargetIndex) {
      this.parentElement.dropTargetNodeMove = "up";
    }
  }

  private get isDraggedElementOrdered() {
    return this.parentElement.rankingChoices.indexOf(this.draggedElement) !== -1;
  }

  private get isDraggedElementUnordered() {
    return !this.isDraggedElementOrdered;
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

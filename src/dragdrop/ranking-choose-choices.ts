import { ItemValue } from "survey-core";
import { DragDropRankingChoices } from "./ranking-choices";

export class DragDropRankingChooseChoices extends DragDropRankingChoices {
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
    const rankingModel = this.parentElement;
    const rankingChoices = rankingModel.rankingChoices;

    if (this.dropTarget === "to-container" && rankingChoices.length === 0) {
      const choices = rankingChoices;
      choices.splice(0, 0, this.draggedElement);
      rankingModel.setPropertyValue("rankingChoices", choices);
      return;
    }

    // if (this.isDraggedElementOrdered) {

    //   // TODO
    //   const choices = rankingChoices;
    //   const dropTargetIndex = choices.indexOf(this.dropTarget);
    //   const draggedElementIndex = choices.indexOf(this.draggedElement);

    //   choices.splice(draggedElementIndex, 1);
    //   choices.splice(dropTargetIndex, 0, this.draggedElement);
    //   choices.splice(dropTargetIndex + 1, 0, this.dropTarget);
    //   rankingModel.setPropertyValue("rankingChoices", choices);
    //   //return;
    //   super.updateDraggedElementShortcut(dropTargetIndex + 1);

    //   if (draggedElementIndex !== dropTargetIndex) {
    //     dropTargetNode.classList.remove("sv-dragdrop-moveup");
    //     dropTargetNode.classList.remove("sv-dragdrop-movedown");
    //     rankingModel.dropTargetNodeMove = null;
    //   }

    //   if (draggedElementIndex > dropTargetIndex) {
    //     rankingModel.dropTargetNodeMove = "down";
    //   }

    //   if (draggedElementIndex < dropTargetIndex) {
    //     rankingModel.dropTargetNodeMove = "up";
    //   }

    //   return;

    //   //EO TODO

    // }
  }

  private isDraggedElementOrdered() {
    return this.parentElement.rankingChoices.indexOf(this.draggedElement) !== -1;
  }

  private isDraggedElementUnordered() {
    return !this.isDraggedElementOrdered;
  }
}

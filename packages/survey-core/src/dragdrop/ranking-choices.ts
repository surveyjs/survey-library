import { ItemValue } from "../itemvalue";
import { DragDropChoices } from "./choices";
import { CssClassBuilder } from "../utils/cssClassBuilder";
import { IsMobile } from "../utils/devices";
import { DomDocumentHelper } from "../global_variables_utils";
import { QuestionRankingModel } from "../question_ranking";
export class DragDropRankingChoices extends DragDropChoices {
  protected get draggedElementType(): string {
    return "ranking-item";
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement,
    event: PointerEvent
  ): HTMLElement {
    const draggedElementShortcut: any = DomDocumentHelper.createElement("div");
    if(!draggedElementShortcut) return;

    draggedElementShortcut.className = this.shortcutClass + " sv-ranking-shortcut";

    const isDeepClone = true;
    const clone = <HTMLElement>draggedElementNode.cloneNode(isDeepClone);
    draggedElementShortcut.appendChild(clone);

    const rect = draggedElementNode.getBoundingClientRect();

    draggedElementShortcut.style.left = rect.x;
    draggedElementShortcut.style.top = rect.y;
    this.domAdapter.rootElement.append(draggedElementShortcut);
    const shortcutHeight = draggedElementShortcut.offsetHeight;
    let clientY = event.clientY;

    if (clientY > rect.y + shortcutHeight) {
      clientY = rect.y + shortcutHeight - 10; //TODO
    }

    draggedElementShortcut.shortcutXOffset = event.clientX - rect.x;
    draggedElementShortcut.shortcutYOffset = clientY - rect.y;

    if (this.parentElement && this.parentElement.useFullItemSizeForShortcut) {
      draggedElementShortcut.style.width = draggedElementNode.offsetWidth + "px";
      draggedElementShortcut.style.height = draggedElementNode.offsetHeight + "px";
    }

    return draggedElementShortcut;
  }

  private get shortcutClass(): string {
    return new CssClassBuilder()
      .append(this.parentElement.cssClasses.root)
      .append(this.parentElement.cssClasses.rootMobileMod, IsMobile)
      .toString();
  }

  protected getDropTargetByDataAttributeValue(dataAttributeValue: string): ItemValue {
    return this.parentElement.rankingChoices[dataAttributeValue];
  }

  private isDragOverRootNode: boolean = false;

  protected findDropTargetNodeByDragOverNode(dragOverNode: HTMLElement): HTMLElement {
    this.isDragOverRootNode = this.getIsDragOverRootNode(dragOverNode);
    return super.findDropTargetNodeByDragOverNode(dragOverNode);
  }

  private getIsDragOverRootNode(dragOverNode: HTMLElement) {
    // dragOverNode might be <path></path> for example and the className prop is obj
    return typeof dragOverNode.className === "string" &&
      dragOverNode.className.indexOf("sv-ranking") !== -1;
  }

  protected isDropTargetValid(
    dropTarget: ItemValue,
    dropTargetNode?: HTMLElement
  ): boolean {
    const choices = this.parentElement.rankingChoices;
    if (choices.indexOf(dropTarget) === -1)
      // shouldn't allow to drop on "adorners" (selectall, none, other)
      return false;

    return true;
  }
  protected calculateIsBottom(clientY: number, dropTargetNode?: HTMLElement): boolean {
    if(this.dropTarget instanceof ItemValue && this.draggedElement !== this.dropTarget) {
      return super.calculateIsBottom(clientY, dropTargetNode);
    }
    return false;
  }

  protected doDragOver = (): any => {
    const node = this.domAdapter.draggedElementShortcut.querySelector<HTMLElement>(".sv-ranking-item");
    node.style.cursor = "grabbing";
  };
  public getIndices(model: any, fromChoicesArray: Array<ItemValue>, toChoicesArray: Array<ItemValue>) {
    let fromIndex = fromChoicesArray.indexOf(this.draggedElement);
    let toIndex = toChoicesArray.indexOf(this.dropTarget);
    if(fromIndex < 0 && !!this.draggedElement) {
      this.draggedElement = ItemValue.getItemByValue(fromChoicesArray, this.draggedElement.value) || this.draggedElement;
      fromIndex = fromChoicesArray.indexOf(this.draggedElement);
    }
    if (toIndex === -1) {
      const length = model.value.length;
      toIndex = length;
    } else if(fromChoicesArray == toChoicesArray) {
      if(!this.isBottom && fromIndex < toIndex) toIndex--;
      if(this.isBottom && fromIndex > toIndex) toIndex ++;
    } else if(fromChoicesArray != toChoicesArray) {
      if(this.isBottom) toIndex++;
    }

    return { fromIndex, toIndex };
  }

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    const { fromIndex, toIndex } = this.getIndices(this.parentElement, this.parentElement.rankingChoices, this.parentElement.rankingChoices);
    this.reorderRankedItem(this.parentElement as QuestionRankingModel, fromIndex, toIndex);
  }

  public reorderRankedItem = (questionModel: QuestionRankingModel, fromIndex: number, toIndex: number): void => {
    if(fromIndex == toIndex) return;
    const rankingChoices = questionModel.rankingChoices;
    const item = rankingChoices[fromIndex];
    questionModel.isValueSetByUser = true;

    rankingChoices.splice(fromIndex, 1);
    rankingChoices.splice(toIndex, 0, item);

    this.updateDraggedElementShortcut(toIndex + 1);
  }

  protected updateDraggedElementShortcut(newIndex: number) {
    if(this.domAdapter?.draggedElementShortcut) {
      const newIndexText = newIndex !== null ? newIndex + "" : "";
      // TODO should avoid direct DOM manipulation, do through the frameworks instead
      const indexNode: HTMLElement = this.domAdapter.draggedElementShortcut.querySelector(
        ".sv-ranking-item__index"
      );
      indexNode.innerText = newIndexText;
    }
  }

  protected ghostPositionChanged(): void {
    this.parentElement.currentDropTarget = this.draggedElement;
    super.ghostPositionChanged();
  }

  protected doBanDropHere = (): any => {
    if (this.isDragOverRootNode) {
      this.allowDropHere = true;
      return;
    }

    const node = this.domAdapter.draggedElementShortcut.querySelector<HTMLElement>(".sv-ranking-item");
    node.style.cursor = "not-allowed";
  };

  protected doDrop(): any {
    this.parentElement.setValue();
    return this.parentElement;
  }

  public clear(): void {
    if(!!this.parentElement) {
      this.parentElement.dropTargetNodeMove = null;
      this.parentElement.updateRankingChoices(true);
    }
    super.clear();
  }
}

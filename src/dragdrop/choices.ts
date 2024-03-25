import { QuestionRankingModel } from "../question_ranking";
import { ImageItemValue } from "../question_imagepicker";
import { ItemValue } from "../itemvalue";
import { QuestionSelectBase } from "../question_baseselect";
import { DragDropCore } from "./core";
import { DomDocumentHelper } from "../global_variables_utils";

export class DragDropChoices extends DragDropCore<QuestionSelectBase> {
  private imagepickerControlsNode: HTMLElement;

  protected get draggedElementType(): string {
    return "item-value";
  }

  protected createDraggedElementShortcut(
    text: string,
    draggedElementNode: HTMLElement,
    event: PointerEvent
  ): HTMLElement {
    if (this.parentElement.getType() === "imagepicker") {
      return this.createImagePickerShortcut(this.draggedElement, text, draggedElementNode, event);
    }
    const draggedElementShortcut: any = DomDocumentHelper.createElement("div");
    if(!draggedElementShortcut) return;

    // draggedElementShortcut.innerText = text;
    draggedElementShortcut.style.cssText = ` 
          cursor: grabbing;
          position: absolute;
          z-index: 10000;
          font-family: var(--sjs-font-family, var(--font-family, var(--sjs-default-font-family)));
        `;

    const isDeepClone = true;
    const clone = <HTMLElement>(
      draggedElementNode
        .closest("[data-sv-drop-target-item-value]")
        .cloneNode(isDeepClone)
    );
    clone.style.cssText = `
      min-width: 100px;
      box-shadow: var(--sjs-shadow-large, 0px 8px 16px 0px rgba(0, 0, 0, 0.1)), var(--sjs-shadow-medium, 0px 2px 6px 0px rgba(0, 0, 0, 0.1));
      background-color: var(--sjs-general-backcolor, var(--background, #fff));
      border-radius: calc(4.5 * var(--sjs-base-unit, var(--base-unit, 8px)));
      padding-right: calc(2* var(--sjs-base-unit, var(--base-unit, 8px)));
      margin-left: 0;
    `;

    const dragIcon: any = clone.querySelector(".svc-item-value-controls__drag-icon");
    dragIcon.style.visibility = "visible";

    const removeIcon: any = clone.querySelector(".svc-item-value-controls__remove");
    removeIcon.style.backgroundColor = "transparent";

    clone.classList.remove("svc-item-value--moveup");
    clone.classList.remove("svc-item-value--movedown");
    this.draggedElement.isDragDropMoveDown = false;
    this.draggedElement.isDragDropMoveUp = false;

    draggedElementShortcut.appendChild(clone);

    const rect = draggedElementNode.getBoundingClientRect();
    draggedElementShortcut.shortcutXOffset = event.clientX - rect.x;
    draggedElementShortcut.shortcutYOffset = event.clientY - rect.y;

    this.isBottom = null;

    return draggedElementShortcut;
  }

  private createImagePickerShortcut(item: ImageItemValue, text: string, draggedElementNode: HTMLElement, event: PointerEvent) {
    const draggedElementShortcut: any = DomDocumentHelper.createElement("div");
    if(!draggedElementShortcut) return;

    draggedElementShortcut.style.cssText = ` 
      cursor: grabbing;
      position: absolute;
      z-index: 10000;
      box-shadow: var(--sjs-shadow-large, 0px 8px 16px 0px rgba(0, 0, 0, 0.1)), var(--sjs-shadow-medium, 0px 2px 6px 0px rgba(0, 0, 0, 0.1));
      background-color: var(--sjs-general-backcolor, var(--background, #fff));
      padding: calc(0.5 * var(--sjs-base-unit, var(--base-unit, 8px)));
      border-radius: calc(0.5 * var(--sjs-base-unit, var(--base-unit, 8px)));
    `;

    const itemValueNode = draggedElementNode.closest("[data-sv-drop-target-item-value]");
    this.imagepickerControlsNode = itemValueNode.querySelector(".svc-image-item-value-controls");
    const imageContainerNode: any = itemValueNode.querySelector(".sd-imagepicker__image-container");
    let imageNode: any = itemValueNode.querySelector(item.imageLink ? "img" : ".sd-imagepicker__no-image").cloneNode(true);

    if (!!this.imagepickerControlsNode) {
      this.imagepickerControlsNode.style.display = "none";
    }
    imageContainerNode.style.width = imageNode.width + "px";
    imageContainerNode.style.height = imageNode.height + "px";

    imageNode.style.objectFit = "cover";
    imageNode.style.borderRadius = "4px";

    draggedElementShortcut.appendChild(imageNode);

    return draggedElementShortcut;
  }

  protected getDropTargetByDataAttributeValue(
    dataAttributeValue: string
  ): ItemValue {
    let dragOverChoice;

    dragOverChoice = this.parentElement.choices.filter(
      (choice: ItemValue) => "" + choice.value == dataAttributeValue
    )[0];

    return dragOverChoice;
  }

  private getVisibleChoices() {
    const parent = this.parentElement;
    if (parent.getType() === "ranking") {
      if (parent.selectToRankEnabled) {
        return parent.visibleChoices;
      } else {
        return <QuestionRankingModel>parent.rankingChoices;
      }
    }
    return parent.visibleChoices;
  }

  protected doDragOver = (): any => {
    if (this.parentElement.getType() === "imagepicker") return;
    const node = this.domAdapter.draggedElementShortcut.querySelector<HTMLElement>(".svc-item-value-controls__button");
    node.style.cursor = "grabbing";
  };

  protected isDropTargetValid(
    dropTarget: ItemValue,
    dropTargetNode?: HTMLElement
  ): boolean {
    const choices = this.getVisibleChoices();

    if (this.parentElement.getType() !== "imagepicker") {
      const dropTargetIndex = choices.indexOf(this.dropTarget);
      const draggedElementIndex = choices.indexOf(this.draggedElement);

      if (draggedElementIndex > dropTargetIndex && this.dropTarget.isDragDropMoveUp) {
        this.dropTarget.isDragDropMoveUp = false;
        return false;
      }

      if (draggedElementIndex < dropTargetIndex && this.dropTarget.isDragDropMoveDown) {
        this.dropTarget.isDragDropMoveDown = false;
        return false;
      }
    }

    // shouldn't allow to drop on "adorners" (selectall, none, other)
    if (choices.indexOf(dropTarget) === -1) return false;

    return true;
  }

  protected doBanDropHere = (): any => {
    if (this.parentElement.getType() === "imagepicker") return;
    const node = this.domAdapter.draggedElementShortcut.querySelector<HTMLElement>(".svc-item-value-controls__button");
    node.style.cursor = "not-allowed";
  };

  protected calculateIsBottom(clientY: number): boolean {
    const choices = this.getVisibleChoices();
    return (
      choices.indexOf(this.dropTarget) - choices.indexOf(this.draggedElement) >
      0
    );
  }

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    if (this.isDropTargetDoesntChanged(this.isBottom)) return;

    const choices = this.getVisibleChoices();
    const dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    choices.splice(draggedElementIndex, 1);
    choices.splice(dropTargetIndex, 0, this.draggedElement);

    if (this.parentElement.getType() === "imagepicker") return;

    if (draggedElementIndex !== dropTargetIndex) {
      dropTargetNode.classList.remove("svc-item-value--moveup");
      dropTargetNode.classList.remove("svc-item-value--movedown");
      this.dropTarget.isDragDropMoveDown = false;
      this.dropTarget.isDragDropMoveUp = false;
    }

    if (draggedElementIndex > dropTargetIndex) {
      this.dropTarget.isDragDropMoveDown = true;
    }

    if (draggedElementIndex < dropTargetIndex) {
      this.dropTarget.isDragDropMoveUp = true;
    }
    super.ghostPositionChanged();
  }

  protected doDrop(): any {
    const choices = this.parentElement.choices;
    const filteredChoices = this.getVisibleChoices().filter((item: any) => {
      return choices.indexOf(item) !== -1;
    });

    const oldIndex = choices.indexOf(this.draggedElement);
    let newIndex = filteredChoices.indexOf(this.draggedElement);

    choices.splice(oldIndex, 1);
    choices.splice(newIndex, 0, this.draggedElement);

    return this.parentElement;
  }

  public clear(): void {
    if(!!this.parentElement) {
      this.updateVisibleChoices(this.parentElement);
    }
    if (!!this.imagepickerControlsNode) {
      this.imagepickerControlsNode.style.display = "flex";
      this.imagepickerControlsNode = null;
    }
    super.clear();
  }

  private updateVisibleChoices(parent: any) {
    parent.getType() === "ranking" ?
      parent.updateRankingChoices() :
      parent["updateVisibleChoices"]();
  }
}

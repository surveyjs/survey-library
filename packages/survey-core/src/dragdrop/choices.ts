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
    if (!draggedElementShortcut) return;

    // draggedElementShortcut.innerText = text;
    draggedElementShortcut.className = "sv-drag-drop-choices-shortcut";

    const isDeepClone = true;
    const clone = <HTMLElement>(
      draggedElementNode
        .closest("[data-sv-drop-target-item-value]")
        .cloneNode(isDeepClone)
    );
    clone.classList.add("sv-drag-drop-choices-shortcut__content");

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

    if (typeof this.onShortcutCreated === "function") {
      this.onShortcutCreated(draggedElementShortcut);
    }

    return draggedElementShortcut;
  }

  public onShortcutCreated: (node: HTMLElement) => void;

  private createImagePickerShortcut(item: ImageItemValue, text: string, draggedElementNode: HTMLElement, event: PointerEvent) {
    const draggedElementShortcut: any = DomDocumentHelper.createElement("div");
    if (!draggedElementShortcut) return;

    draggedElementShortcut.classList.add("sv-drag-drop-image-picker-shortcut");

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

  protected isDropTargetDoesntChanged(newIsBottom: boolean): boolean {
    return (
      this.dropTarget === this.prevDropTarget && newIsBottom === this.isBottom
    );
  }

  protected calculateIsBottom(clientY: number, dropTargetNode?: HTMLElement): boolean {
    const rect = dropTargetNode.getBoundingClientRect();
    return clientY >= rect.y + rect.height / 2;
  }

  protected afterDragOver(dropTargetNode: HTMLElement): void {
    //if (this.isDropTargetDoesntChanged(this.isBottom)) return;

    const choices = this.getVisibleChoices();
    const dropTargetIndex = choices.indexOf(this.dropTarget);
    const draggedElementIndex = choices.indexOf(this.draggedElement);

    if (draggedElementIndex < dropTargetIndex && this.isBottom === true) {
      // drag "down"
      choices.splice(draggedElementIndex, 1);
      choices.splice(dropTargetIndex, 0, this.draggedElement);
    } else if (draggedElementIndex > dropTargetIndex && this.isBottom === false) {
      // drag "up"
      choices.splice(dropTargetIndex, 1);
      choices.splice(draggedElementIndex, 0, this.dropTarget);
    } else {
      return;
    }

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
    if (!!this.parentElement) {
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

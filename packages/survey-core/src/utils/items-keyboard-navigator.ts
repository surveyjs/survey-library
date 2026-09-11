import { ElementHelper } from "../element-helper";
import { DomDocumentHelper } from "../global_variables_utils";
import { getElement, getRootNode, preventDefaults } from "./dom-utils";

// A question that renders a group of items (rating buttons, radio buttons) and wants
// arrow keys to move focus without changing the value. See ItemsKeyboardNavigator.
export interface IKeyboardNavigableItems {
  keyboardItemsCount: number;
  focusedItemIndex: number;
  isKeyboardItemsReadOnly: boolean;
  isKeyboardItemsRtl: boolean;
  getKeyboardItemId(index: number): string;
  isKeyboardItemEnabled(index: number): boolean;
  isKeyboardItemSelected(index: number): boolean;
  selectKeyboardItem(index: number): void;
}

// Implements the WAI-ARIA composite widget keyboard pattern with a roving tabindex:
// the group has a single tab stop, arrow keys move focus between the items, and
// the Space or Enter key selects the focused item.
export class ItemsKeyboardNavigator {
  constructor(private owner: IKeyboardNavigableItems) { }

  public getItemTabIndex(index: number): number {
    return index === this.getActiveItemIndex() ? 0 : -1;
  }
  public onItemFocusIn(index: number): void {
    this.owner.focusedItemIndex = index;
  }
  public onItemKeyDown(index: number, event: any): void {
    if (index < 0 || this.owner.keyboardItemsCount <= 0 || !event) return;
    const key = event.key;
    const keyCode = event.keyCode;
    if (key === " " || key === "Spacebar" || keyCode === 32 || key === "Enter" || keyCode === 13) {
      preventDefaults(event);
      if (!this.owner.isKeyboardItemsReadOnly && this.owner.isKeyboardItemEnabled(index)) {
        this.owner.selectKeyboardItem(index);
      }
      return;
    }
    const newIndex = this.getItemIndexByKey(index, key, keyCode);
    if (newIndex < 0) return;
    // The default action of an arrow key within a native radio group is to select the
    // next radio button, so it has to be suppressed even when focus does not move.
    preventDefaults(event);
    if (newIndex !== index) {
      this.focusItem(newIndex, event.target);
    }
  }
  // The item that keeps the group's tab stop: the last focused one, otherwise the
  // selected one, otherwise the first item a user can interact with.
  private getActiveItemIndex(): number {
    const count = this.owner.keyboardItemsCount;
    if (count <= 0) return -1;
    const focusedIndex = this.owner.focusedItemIndex;
    if (focusedIndex >= 0 && focusedIndex < count) return focusedIndex;
    for (let i = 0; i < count; i++) {
      if (this.owner.isKeyboardItemSelected(i)) return i;
    }
    const firstEnabledIndex = this.getEnabledItemIndex(0, 1);
    return firstEnabledIndex >= 0 ? firstEnabledIndex : 0;
  }
  private getItemIndexByKey(index: number, key: string, keyCode: number): number {
    const count = this.owner.keyboardItemsCount;
    if (key === "Home" || keyCode === 36) return this.getEnabledItemIndex(0, 1);
    if (key === "End" || keyCode === 35) return this.getEnabledItemIndex(count - 1, -1);
    const isRtl = this.owner.isKeyboardItemsRtl;
    let delta = 0;
    if (key === "ArrowUp" || keyCode === 38) delta = -1;
    else if (key === "ArrowDown" || keyCode === 40) delta = 1;
    else if (key === "ArrowLeft" || keyCode === 37) delta = isRtl ? 1 : -1;
    else if (key === "ArrowRight" || keyCode === 39) delta = isRtl ? -1 : 1;
    else return -1;
    return this.getEnabledItemIndex(index + delta, delta);
  }
  private getEnabledItemIndex(startIndex: number, delta: number): number {
    const count = this.owner.keyboardItemsCount;
    let index = startIndex;
    for (let i = 0; i < count; i++) {
      if (index < 0) index = count - 1;
      if (index >= count) index = 0;
      if (this.owner.isKeyboardItemEnabled(index)) return index;
      index += delta;
    }
    return -1;
  }
  private focusItem(index: number, sourceElement: any): void {
    this.owner.focusedItemIndex = index;
    if (!DomDocumentHelper.isAvailable()) return;
    ElementHelper.focusElement(this.getItemElement(index, sourceElement));
  }
  // The items may be rendered into a shadow root, so look them up relative to the
  // element the keyboard event came from rather than in the document.
  private getItemElement(index: number, sourceElement: any): Element {
    const elementId = this.owner.getKeyboardItemId(index);
    const rootNode = !!sourceElement?.getRootNode ? getRootNode(sourceElement) : null;
    if (!rootNode) return getElement(elementId);
    return rootNode.querySelector(`#${CSS.escape(elementId)}`);
  }
}

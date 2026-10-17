import { ItemValue } from "../itemvalue";
import { settings } from "../settings";
import { choiceKeyCodeHasLongerMatch, choiceKeyCodeToIndex, indexToChoiceKeyCode } from "./choice-key-codes";
import { KeySequenceBuffer } from "./key-sequence-buffer";
import { Scope } from "./scope";

export interface IChoiceShortcutsOwner {
  readonly canShowChoiceKeys: boolean;
  readonly isDesignMode: boolean;
  getChoiceKeyItems(): Array<ItemValue>;
  getItemEnabled(item: ItemValue): boolean;
  getItemId(item: ItemValue): string;
  selectByChoiceKey(item: ItemValue): void;
}

export class ChoiceShortcuts {
  private keys: KeySequenceBuffer = new KeySequenceBuffer();
  private keyedItems: Array<ItemValue> = [];
  private applyScope = new Scope();

  constructor(private owner: IChoiceShortcutsOwner) {}

  public get canUse(): boolean {
    return this.owner.canShowChoiceKeys && !this.owner.isDesignMode;
  }

  // uniqueId, not the choice value: rebuilt items keep the same value and would
  // otherwise produce the same state, so the badges would never be written again.
  public buildState(): string {
    const items = this.owner.getChoiceKeyItems();
    if (!this.owner.canShowChoiceKeys) return "";
    const parts = new Array<string>(items.length);
    for (let i = 0; i < items.length; i++) {
      parts[i] = items[i].uniqueId + "=" + indexToChoiceKeyCode(i + 1);
    }
    return parts.join(";");
  }

  public applyBadges(): void {
    if (this.applyScope.isActive) return;
    this.applyScope.run(() => {
      const next = new Map<ItemValue, string>();
      if (this.owner.canShowChoiceKeys) {
        const items = this.owner.getChoiceKeyItems();
        for (let i = 0; i < items.length; i++) {
          next.set(items[i], indexToChoiceKeyCode(i + 1));
        }
      }
      const previous = this.keyedItems;
      for (let i = 0; i < previous.length; i++) {
        if (!next.has(previous[i])) {
          previous[i].setPropertyValue("choiceKey", "");
        }
      }
      next.forEach((code, item) => {
        if (item.getPropertyValue("choiceKey") !== code) {
          item.setPropertyValue("choiceKey", code);
        }
      });
      this.keyedItems = Array.from(next.keys());
    });
  }

  public badge(item: ItemValue): string {
    if (!item || !this.owner.canShowChoiceKeys) return "";
    return item.getPropertyValue("choiceKey") || "";
  }

  public onKeyDown(event: any): void {
    if (!this.canUse) return;
    if (!event || event.ctrlKey || event.altKey || event.metaKey || event.repeat || event.isComposing || event.keyCode === 229) return;
    if (!this.isKeyboardTarget(event.target)) return;
    const letter = this.readLetter(event);
    if (!letter) {
      this.keys.reset();
      return;
    }
    if (event.preventDefault) event.preventDefault();
    this.appendLetter(letter);
  }

  public onFocusOut(event: any): void {
    if (this.isKeyboardTarget(event?.relatedTarget)) return;
    this.keys.reset();
  }

  public dispose(): void {
    this.keys.reset();
    this.keyedItems = [];
  }

  private isKeyboardTarget(target: any): boolean {
    if (!target || String(target.tagName || "").toLowerCase() !== "input") return false;
    if (!/^(radio|checkbox)$/i.test(String(target.type || ""))) return false;
    const id = target.id;
    if (!id) return false;
    const items = this.owner.getChoiceKeyItems();
    for (let i = 0; i < items.length; i++) {
      if (this.owner.getItemId(items[i]) === id) return true;
    }
    return false;
  }

  private readLetter(event: any): string {
    const key = event?.key;
    return typeof key === "string" && /^[a-z]$/i.test(key) ? key.toUpperCase() : "";
  }

  private appendLetter(letter: string): void {
    const code = this.keys.append(letter);
    const count = this.owner.getChoiceKeyItems().length;
    const index = choiceKeyCodeToIndex(code);
    if (index < 1 || index > count) {
      this.keys.reset();
      return;
    }
    if (choiceKeyCodeHasLongerMatch(code, count)) {
      this.keys.waitAndApply((pending) => {
        if (!pending || !this.canUse) return;
        this.applyCode(pending);
      }, settings.keyboardInputTimeout);
      return;
    }
    this.keys.reset();
    this.applyCode(code);
  }

  private applyCode(code: string): void {
    if (!this.canUse) return;
    const items = this.owner.getChoiceKeyItems();
    const index = choiceKeyCodeToIndex(code);
    if (index < 1 || index > items.length) return;
    const item = items[index - 1];
    if (!this.owner.getItemEnabled(item)) {
      this.keys.reset();
      return;
    }
    this.owner.selectByChoiceKey(item);
  }
}

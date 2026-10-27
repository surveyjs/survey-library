import { ItemValue } from "../src/itemvalue";
import { ChoiceShortcuts, IChoiceShortcutsOwner } from "../src/utils/choice-shortcuts";
import { expect, test } from "vitest";

class ChoiceShortcutOwner implements IChoiceShortcutsOwner {
  public canShowChoiceKeys = true;
  public isDesignMode = false;
  public items: Array<ItemValue> = [];
  public enabled = true;
  public selected: ItemValue;
  public getChoiceKeyItems(): Array<ItemValue> {
    return this.items;
  }
  public getItemEnabled(): boolean {
    return this.enabled;
  }
  public getItemId(item: ItemValue): string {
    return "item-" + item.value;
  }
  public selectByChoiceKey(item: ItemValue): void {
    this.selected = item;
  }
}

function input(owner: ChoiceShortcutOwner, item: ItemValue): HTMLInputElement {
  return { tagName: "input", type: "radio", id: owner.getItemId(item) } as HTMLInputElement;
}

test("ChoiceShortcuts badges follow the current item instances", () => {
  const owner = new ChoiceShortcutOwner();
  owner.items = [new ItemValue("a"), new ItemValue("b")];
  const shortcuts = new ChoiceShortcuts(owner);
  const firstState = shortcuts.buildState();
  shortcuts.applyBadges();
  expect(shortcuts.badge(owner.items[0])).toBe("A");
  expect(shortcuts.badge(owner.items[1])).toBe("B");

  owner.items = [new ItemValue("a"), new ItemValue("b")];
  expect(shortcuts.buildState()).not.toBe(firstState);
  shortcuts.applyBadges();
  expect(shortcuts.badge(owner.items[0])).toBe("A");
  expect(shortcuts.badge(owner.items[1])).toBe("B");
});

test("ChoiceShortcuts selects a choice by letter and ignores keys in design mode", () => {
  const owner = new ChoiceShortcutOwner();
  owner.items = [new ItemValue("a"), new ItemValue("b")];
  const shortcuts = new ChoiceShortcuts(owner);
  const prevented = { called: false };
  shortcuts.onKeyDown({
    key: "b",
    target: input(owner, owner.items[0]),
    preventDefault: () => { prevented.called = true; }
  });
  expect(prevented.called).toBe(true);
  expect(owner.selected).toBe(owner.items[1]);

  owner.isDesignMode = true;
  owner.selected = undefined;
  shortcuts.onKeyDown({
    key: "a",
    target: input(owner, owner.items[0]),
    preventDefault: () => { prevented.called = true; }
  });
  expect(owner.selected).toBeUndefined();
});

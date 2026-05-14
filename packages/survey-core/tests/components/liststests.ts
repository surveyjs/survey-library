import { ListModel } from "../../src/list";

import { describe, test, expect } from "vitest";
test("Check goToItemsMethod works correctly", () => {
  const list = new ListModel({ items: <Array<any>>[{ title: "item" }], onSelectionChanged: () => { }, allowSelection: false } as any);
  const element = document.createElement("div");
  element.className = "sv-list__container";
  element.innerHTML = "<div><input/></div><div></div><ul><li tabindex='0'></li></ul>";
  const input = element.querySelector("input");
  const listElement = element.querySelector("li");
  document.body.appendChild(element);
  const event = {
    target: input,
    key: "ArrowDown",
    preventDefault: () => {}
  };
  list.goToItems(<any>event);
  expect(document.activeElement).toBe(listElement);
  element.remove();
});
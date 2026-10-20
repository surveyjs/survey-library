import { describe, test, expect, vi } from "vitest";
import { ArrayValueChoices } from "../src/utils/array-value-choices";

describe("ArrayValueChoices", () => {
  test("projects one choice per record that has a value in the value field", () => {
    const choices = new ArrayValueChoices();
    const val = [{ id: 1, name: "a" }, { id: "", name: "b" }, { id: "  ", name: "c" }, { name: "d" }, "not an object", null, { id: 0, name: "e" }];
    expect(choices.getChoices(val, 0, "id", "name"), "#1").toEqual([{ value: 1, text: "a" }, { value: 0, text: "e" }]);
    expect(choices.getChoices(val, 0, "id", ""), "#2: no text field, no text").toEqual([{ value: 1, text: undefined }, { value: 0, text: undefined }]);
  });
  test("takes the first key of every record when the value field is empty", () => {
    const choices = new ArrayValueChoices();
    expect(choices.getChoices([{ a: 1, b: 2 }, { b: 3 }, {}], 0, "", "")).toEqual([{ value: 1, text: undefined }, { value: 3, text: undefined }]);
  });
  test("returns no choices for a value that is not an array", () => {
    const choices = new ArrayValueChoices();
    expect(choices.getChoices(undefined, 0, "id", ""), "#1").toEqual([]);
    expect(choices.getChoices({ id: 1 }, 0, "id", ""), "#2").toEqual([]);
  });
  test("projects once per value and revision", () => {
    const choices = new ArrayValueChoices();
    const projections = vi.spyOn(<any>choices, "createChoices");
    const val = [{ id: 1 }];
    const first = choices.getChoices(val, 0, "id", "");
    expect(choices.getChoices(val, 0, "id", ""), "#1: the same instance").toBe(first);
    expect(projections.mock.calls.length, "#2: one projection").toBe(1);
  });
  test("keeps one projection per pair of value and text fields", () => {
    const choices = new ArrayValueChoices();
    const projections = vi.spyOn(<any>choices, "createChoices");
    const val = [{ id: 1, name: "a", title: "A" }];
    const byName = choices.getChoices(val, 0, "id", "name");
    const byTitle = choices.getChoices(val, 0, "id", "title");
    expect(byName, "#1").toEqual([{ value: 1, text: "a" }]);
    expect(byTitle, "#2").toEqual([{ value: 1, text: "A" }]);
    expect(choices.getChoices(val, 0, "id", "name"), "#3: the first pair is still cached").toBe(byName);
    expect(projections.mock.calls.length, "#4").toBe(2);
  });
  test("a value updated in place is projected again on a new revision", () => {
    const choices = new ArrayValueChoices();
    const val = [{ id: 1 }];
    choices.getChoices(val, 0, "id", "");
    val.push({ id: 2 });
    expect(choices.getChoices(val, 0, "id", "").length, "#1: the same revision does not see the change").toBe(1);
    expect(choices.getChoices(val, 1, "id", ""), "#2").toEqual([{ value: 1, text: undefined }, { value: 2, text: undefined }]);
  });
  test("returns the previous instance when a new value projects to the same choices", () => {
    const choices = new ArrayValueChoices();
    const first = choices.getChoices([{ id: 1, name: "a", other: "x" }], 0, "id", "name");
    expect(choices.getChoices([{ id: 1, name: "a", other: "y" }], 1, "id", "name"), "#1: another field changed").toBe(first);
    const changed = choices.getChoices([{ id: 1, name: "b", other: "y" }], 2, "id", "name");
    expect(changed, "#2: the text changed").not.toBe(first);
    expect(changed, "#3").toEqual([{ value: 1, text: "b" }]);
  });
  test("compares the choices exactly: a change of case or a trailing space is a new choice", () => {
    const choices = new ArrayValueChoices();
    const first = choices.getChoices([{ id: "k" }], 0, "id", "");
    const upper = choices.getChoices([{ id: "K" }], 1, "id", "");
    expect(upper, "#1: case").not.toBe(first);
    const spaced = choices.getChoices([{ id: "K " }], 2, "id", "");
    expect(spaced, "#2: trailing space").not.toBe(upper);
    expect(spaced, "#3").toEqual([{ value: "K ", text: undefined }]);
  });
});

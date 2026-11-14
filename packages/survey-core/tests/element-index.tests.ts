import { describe, test, expect } from "vitest";
import { ElementIndex } from "../src/element-index";

// The index reads three members of an element, so a plain object stands for a question, a panel or a page.
const question = (name: string, valueName?: string): any => {
  const res: any = { name: name, valueName: valueName, isQuestion: true, kind: "question" };
  res.getValueName = (): string => res.valueName !== undefined ? res.valueName : res.name;
  return res;
};
const panel = (name: string, key: string = ""): any => ({ name: name, isQuestion: false, kind: "panel", getValueName: (): string => key });
const isQuestion = (el: any): boolean => el.kind === "question";
const isPanel = (el: any): boolean => el.kind === "panel";

describe("ElementIndex: elements by name and questions by value name", () => {
  test("an element is found by its name and its kind", () => {
    const index = new ElementIndex();
    const q1 = question("q1");
    const p1 = panel("p1");
    index.add(q1);
    index.add(p1);
    expect(index.find("q1", isQuestion)).toBe(q1);
    expect(index.find("p1", isPanel)).toBe(p1);
    expect(index.find("q1", isPanel), "another kind").toBeNull();
    expect(index.find("nothing", isQuestion)).toBeNull();
    expect(index.find("", isQuestion)).toBeNull();
    expect(index.find(undefined, isQuestion)).toBeNull();
  });
  test("a question and a panel share a name: each kind finds its own", () => {
    const index = new ElementIndex();
    const q = question("same");
    const p = panel("same");
    index.add(q);
    index.add(p);
    expect(index.find("same", isQuestion)).toBe(q);
    expect(index.find("same", isPanel)).toBe(p);
  });
  test("letter case: the exact name only, unless asked", () => {
    const index = new ElementIndex();
    const q1 = question("Q1");
    index.add(q1);
    expect(index.find("q1", isQuestion)).toBeNull();
    expect(index.find("q1", isQuestion, true, true)).toBe(q1);
    expect(index.find("q1", isQuestion, true, false)).toBe(q1);
  });
  test("letter case ignored, the exact name first: the element with the exact name wins", () => {
    const index = new ElementIndex();
    const lower = question("name");
    const upper = question("NAME");
    index.add(lower);
    index.add(upper);
    expect(index.find("NAME", isQuestion, true, true)).toBe(upper);
    expect(index.find("Name", isQuestion, true, true), "no exact name: the first one").toBe(lower);
  });
  test("letter case ignored, not the exact name first: the first element wins", () => {
    const index = new ElementIndex();
    const lower = panel("name");
    const upper = panel("NAME");
    index.add(lower);
    index.add(upper);
    expect(index.find("NAME", isPanel, true, false)).toBe(lower);
    expect(index.find("NAME", isPanel, false, false), "the exact name only").toBe(upper);
  });
  test("two elements under one name: the order added", () => {
    const index = new ElementIndex();
    const first = question("q");
    const second = question("q");
    index.add(first);
    index.add(second);
    expect(index.find("q", isQuestion)).toBe(first);
    index.remove(first);
    expect(index.find("q", isQuestion)).toBe(second);
    index.add(first);
    expect(index.find("q", isQuestion), "added again: after the other").toBe(second);
  });
  test("an element added twice is held once", () => {
    const index = new ElementIndex();
    const q = question("q", "v");
    index.add(q);
    index.add(q);
    expect(index.getQuestionsByValueName("v")).toEqual([q]);
    index.remove(q);
    expect(index.find("q", isQuestion)).toBeNull();
    expect(index.getQuestionsByValueName("v")).toEqual([]);
  });
  test("removing an element takes no name: the index knows what it holds it under", () => {
    const index = new ElementIndex();
    const q = question("q1", "v1");
    index.add(q);
    q.name = "q2";
    q.valueName = "v2";
    index.remove(q);
    expect(index.find("q1", isQuestion)).toBeNull();
    expect(index.getQuestionsByValueName("v1")).toEqual([]);
  });
  test("removing an element the index does not hold does nothing", () => {
    const index = new ElementIndex();
    const q = question("q");
    index.add(q);
    index.remove(question("q"));
    index.remove(panel("q"));
    expect(index.find("q", isQuestion)).toBe(q);
    expect(index.getQuestionsByValueName("q")).toEqual([q]);
  });
  test("a changed name or value name: removed and added again", () => {
    const index = new ElementIndex();
    const q = question("q1", "v1");
    index.add(q);
    q.name = "q2";
    q.valueName = "v2";
    index.remove(q);
    index.add(q);
    expect(index.find("q1", isQuestion)).toBeNull();
    expect(index.find("q2", isQuestion)).toBe(q);
    expect(index.find("Q2", isQuestion, true, true)).toBe(q);
    expect(index.getQuestionsByValueName("v1")).toEqual([]);
    expect(index.getQuestionsByValueName("v2")).toEqual([q]);
  });
  test("an element added under a new name leaves its old name", () => {
    const index = new ElementIndex();
    const q = question("q1", "v1");
    index.add(q);
    q.name = "q2";
    q.valueName = "v2";
    index.add(q);
    expect(index.find("q1", isQuestion)).toBeNull();
    expect(index.find("q2", isQuestion)).toBe(q);
    expect(index.getQuestionsByValueName("v1")).toEqual([]);
    expect(index.getQuestionsByValueName("v2")).toEqual([q]);
  });
  test("renamed: an element the index holds moves to its new name", () => {
    const index = new ElementIndex();
    const p = panel("p1");
    index.add(p);
    p.name = "p2";
    index.renamed(p);
    expect(index.find("p1", isPanel)).toBeNull();
    expect(index.find("p2", isPanel)).toBe(p);
    expect(index.find("P2", isPanel, true)).toBe(p);
  });
  test("renamed: a question whose value name is its name moves under both", () => {
    const index = new ElementIndex();
    const q = question("q1");
    index.add(q);
    q.name = "q2";
    index.renamed(q);
    expect(index.find("q1", isQuestion)).toBeNull();
    expect(index.find("q2", isQuestion)).toBe(q);
    expect(index.getQuestionsByValueName("q1")).toEqual([]);
    expect(index.getQuestionsByValueName("q2")).toEqual([q]);
  });
  test("renamed: a changed value name alone is not looked at", () => {
    const index = new ElementIndex();
    const q = question("q1", "v1");
    index.add(q);
    q.valueName = "v2";
    index.renamed(q);
    expect(index.getQuestionsByValueName("v1")).toEqual([q]);
    expect(index.getQuestionsByValueName("v2")).toEqual([]);
  });
  test("two names that differ in letter case: removing one keeps the other found", () => {
    const index = new ElementIndex();
    const upper = question("Q");
    const lower = question("q");
    index.add(upper);
    index.add(lower);
    expect(index.find("q", isQuestion, true, false)).toBe(upper);
    index.remove(upper);
    expect(index.find("Q", isQuestion)).toBeNull();
    expect(index.find("Q", isQuestion, true, true)).toBe(lower);
    expect(index.find("q", isQuestion, true, false)).toBe(lower);
    expect(index.getQuestionsByValueName("Q", true)).toEqual([lower]);
  });
  test("renamed: an element the index does not hold is not added", () => {
    const index = new ElementIndex();
    const p = panel("p1");
    p.name = "p2";
    index.renamed(p);
    expect(index.find("p2", isPanel)).toBeNull();
  });
  test("renamed: an unchanged name keeps the element's place", () => {
    const index = new ElementIndex();
    const first = panel("p");
    const second = panel("p");
    index.add(first);
    index.add(second);
    index.renamed(first);
    expect(index.find("p", isPanel)).toBe(first);
    first.name = "other";
    index.renamed(first);
    first.name = "p";
    index.renamed(first);
    expect(index.find("p", isPanel), "renamed away and back: after the other").toBe(second);
  });
  test("an element without a name is held, and found once it gets one", () => {
    const index = new ElementIndex();
    const p = panel("");
    const q = question(undefined, "v");
    index.add(p);
    index.add(q);
    expect(index.find("", isPanel)).toBeNull();
    p.name = "p1";
    index.renamed(p);
    expect(index.find("p1", isPanel)).toBe(p);
    q.name = "q1";
    index.renamed(q);
    expect(index.find("q1", isQuestion)).toBe(q);
  });
  test("questions by value name: the exact name, or letter case ignored", () => {
    const index = new ElementIndex();
    const q1 = question("q1", "Shared");
    const q2 = question("q2", "Shared");
    const q3 = question("q3", "shared");
    const q4 = question("q4");
    [q1, q2, q3, q4].forEach(q => index.add(q));
    expect(index.getQuestionsByValueName("Shared")).toEqual([q1, q2]);
    expect(index.getQuestionsByValueName("shared")).toEqual([q3]);
    expect(index.getQuestionsByValueName("SHARED")).toEqual([]);
    expect(index.getQuestionsByValueName("SHARED", true)).toEqual([q1, q2, q3]);
    expect(index.getQuestionsByValueName("q4"), "no valueName: the name").toEqual([q4]);
    expect(index.getQuestionsByValueName("q1"), "a name is no value name").toEqual([]);
    expect(index.getQuestionsByValueName("")).toEqual([]);
  });
  test("a question without a value name, and a panel with a key, are not held by value name", () => {
    const index = new ElementIndex();
    const q = question("q", "");
    const p = panel("p", "key");
    index.add(q);
    index.add(p);
    expect(index.find("q", isQuestion)).toBe(q);
    expect(index.getQuestionsByValueName("q")).toEqual([]);
    expect(index.getQuestionsByValueName("key")).toEqual([]);
  });
  test("a name that is an Object.prototype member finds nothing (Bug#11858)", () => {
    const index = new ElementIndex();
    index.add(question("q1"));
    ["constructor", "toString", "valueOf", "hasOwnProperty", "__proto__"].forEach(name => {
      expect(index.find(name, isQuestion), name).toBeNull();
      expect(index.find(name, isQuestion, true, true), name).toBeNull();
      expect(index.getQuestionsByValueName(name), name).toEqual([]);
      expect(index.getQuestionsByValueName(name, true), name).toEqual([]);
    });
    const q = question("constructor", "toString");
    index.add(q);
    expect(index.find("constructor", isQuestion)).toBe(q);
    expect(index.getQuestionsByValueName("toString")).toEqual([q]);
    const proto = question("__proto__");
    index.add(proto);
    expect(index.find("__proto__", isQuestion)).toBe(proto);
    expect(index.find("__PROTO__", isQuestion, true, true)).toBe(proto);
    expect(index.getQuestionsByValueName("__proto__")).toEqual([proto]);
    index.remove(proto);
    expect(index.find("__proto__", isQuestion)).toBeNull();
    expect(index.getQuestionsByValueName("__proto__")).toEqual([]);
  });
  test("clear: nothing is held", () => {
    const index = new ElementIndex();
    const q = question("q", "v");
    const p = panel("p");
    index.add(q);
    index.add(p);
    index.clear();
    expect(index.find("q", isQuestion)).toBeNull();
    expect(index.find("p", isPanel)).toBeNull();
    expect(index.getQuestionsByValueName("v")).toEqual([]);
    p.name = "p2";
    index.renamed(p);
    expect(index.find("p2", isPanel), "not held any more: a rename does not add it").toBeNull();
    index.add(q);
    expect(index.find("q", isQuestion)).toBe(q);
  });
});

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

describe("ElementIndex: elements by name", () => {
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
});

describe("ElementIndex by name: names and stamps", () => {
  test("an element added twice is held once, under one stamp", () => {
    const index = new ElementIndex();
    const q = question("q", "v");
    index.add(q);
    const stamp = index.getStamp(q);
    index.add(q);
    expect(index.getStamp(q)).toBe(stamp);
    expect(index.getHeldValueName(q)).toBe("v");
    index.remove(q);
    expect(index.find("q", isQuestion)).toBeNull();
    expect(index.getStamp(q)).toBeUndefined();
    expect(index.getHeldValueName(q)).toBeUndefined();
  });
  test("removing takes no name, and removing an element the index does not hold does nothing", () => {
    const index = new ElementIndex();
    const q = question("q1", "v1");
    index.add(q);
    index.remove(question("q1"));
    index.remove(panel("q1"));
    expect(index.find("q1", isQuestion)).toBe(q);
    q.name = "q2";
    index.remove(q);
    expect(index.find("q1", isQuestion)).toBeNull();
    expect(index.find("q2", isQuestion)).toBeNull();
  });
  test("an element added under a new name leaves its old name", () => {
    const index = new ElementIndex();
    const q = question("q1", "v1");
    index.add(q);
    q.name = "q2";
    index.add(q);
    expect(index.find("q1", isQuestion)).toBeNull();
    expect(index.find("q2", isQuestion)).toBe(q);
    expect(index.find("Q2", isQuestion, true, true)).toBe(q);
  });
  test("stamps: the order added by value name; another value name gives a new stamp, the same one keeps it", () => {
    const index = new ElementIndex();
    const q1 = question("q1", "v");
    const q2 = question("q2", "v");
    index.add(q1);
    index.add(q2);
    expect(index.getStamp(q1) < index.getStamp(q2)).toBe(true);
    q1.name = "q1x";
    index.add(q1);
    expect(index.getStamp(q1) < index.getStamp(q2), "a new name alone keeps the stamp").toBe(true);
    q1.valueName = "w";
    index.add(q1);
    expect(index.getHeldValueName(q1)).toBe("w");
    expect(index.getStamp(q1) > index.getStamp(q2), "another value name: a new stamp").toBe(true);
    q1.valueName = "x";
    index.renamed(q1);
    expect(index.getHeldValueName(q1), "renamed does not look at a value name alone").toBe("w");
    index.remove(q2);
    index.add(q2);
    expect(index.getStamp(q2) > index.getStamp(q1), "added again: a new stamp").toBe(true);
    const p = panel("p", "key");
    index.add(p);
    expect(index.getStamp(p), "a panel has no stamp").toBeUndefined();
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
  });
  test("a name that is an Object.prototype member finds nothing (Bug#11858)", () => {
    const index = new ElementIndex();
    index.add(question("q1"));
    ["constructor", "toString", "valueOf", "hasOwnProperty", "__proto__"].forEach(name => {
      expect(index.find(name, isQuestion), name).toBeNull();
      expect(index.find(name, isQuestion, true, true), name).toBeNull();
    });
    const proto = question("__proto__");
    index.add(proto);
    expect(index.find("__proto__", isQuestion)).toBe(proto);
    expect(index.find("__PROTO__", isQuestion, true, true)).toBe(proto);
    index.remove(proto);
    expect(index.find("__proto__", isQuestion)).toBeNull();
  });
  test("forEachHeld gives each element once; clear holds nothing", () => {
    const index = new ElementIndex();
    const q = question("q", "v");
    const p = panel("p");
    const other = panel("P");
    [q, p, other].forEach(el => index.add(el));
    const held: Array<any> = [];
    index.forEachHeld(el => held.push(el));
    expect(held).toHaveLength(3);
    expect(held.indexOf(q) > -1 && held.indexOf(p) > -1 && held.indexOf(other) > -1).toBe(true);
    index.clear();
    expect(index.find("q", isQuestion)).toBeNull();
    expect(index.find("p", isPanel)).toBeNull();
    expect(index.getStamp(q)).toBeUndefined();
    const after: Array<any> = [];
    index.forEachHeld(el => after.push(el));
    expect(after).toEqual([]);
    p.name = "p2";
    index.renamed(p);
    expect(index.find("p2", isPanel), "not held any more: a rename does not add it").toBeNull();
    index.add(q);
    expect(index.find("q", isQuestion)).toBe(q);
  });
});

describe("ElementIndex by key: a data scope's instance", () => {
  test("questions and containers by key: questions first on one key; the scopes of the containers", () => {
    const index = new ElementIndex();
    const q = question("a");
    const scope = { name: "scope" };
    const p: any = panel("p", "a");
    p.getDataScope = (): any => scope;
    index.addKeyed(p, "a");
    index.addKeyed(q, "a");
    expect(index.getElements("a")).toEqual([q, p]);
    expect(index.getQuestions("a")).toEqual([q]);
    expect(index.getScopes("a")).toEqual([scope]);
    expect(index.elements, "the order added").toEqual([p, q]);
    expect(index.find("a", isQuestion), "no names are held by key").toBeNull();
  });
  test("an element is held once; one without a key is in elements only", () => {
    const index = new ElementIndex();
    const q = question("q");
    const noName = question(undefined, "");
    index.addKeyed(q, "q");
    index.addKeyed(q, "q");
    index.addKeyed(noName, "");
    expect(index.elements).toEqual([q, noName]);
    expect(index.getQuestions("q")).toEqual([q]);
    expect(index.getQuestions("")).toEqual([]);
    expect(index.has(noName)).toBe(true);
    expect(index.getHeldKey(noName)).toBe("");
    index.removeKeyed(noName);
    index.removeKeyed(question("q"));
    expect(index.elements).toEqual([q]);
    expect(index.has(noName)).toBe(false);
  });
  test("letter case, and keys that are Object.prototype members", () => {
    const index = new ElementIndex();
    const upper = question("A");
    const lower = question("a");
    index.addKeyed(upper, "A");
    index.addKeyed(lower, "a");
    expect(index.getQuestions("a")).toEqual([lower]);
    expect(index.getQuestions("a", true)).toEqual([upper, lower]);
    ["constructor", "toString", "__proto__"].forEach(name => {
      expect(index.getElements(name), name).toEqual([]);
      expect(index.getQuestions(name, true), name).toEqual([]);
    });
    const proto = question("__proto__");
    index.addKeyed(proto, "__proto__");
    expect(index.getQuestions("__proto__")).toEqual([proto]);
    index.removeKeyed(upper);
    expect(index.getQuestions("A", true), "the other letter case stays").toEqual([lower]);
  });
  test("without a rank a key's list follows elements: reKey keeps the place in elements", () => {
    const index = new ElementIndex();
    const q1 = question("q1", "v");
    const q2 = question("q2", "w");
    const q3 = question("q3", "v");
    [q1, q2, q3].forEach(q => index.addKeyed(q, q.getValueName()));
    expect(index.getQuestions("v")).toEqual([q1, q3]);
    index.reKey(q2, "v");
    expect(index.elements).toEqual([q1, q2, q3]);
    expect(index.getQuestions("v"), "in the order of elements").toEqual([q1, q2, q3]);
    expect(index.getQuestions("w")).toEqual([]);
    index.reKey(q1, "w");
    expect(index.getQuestions("v")).toEqual([q2, q3]);
    expect(index.getQuestions("V", true)).toEqual([q2, q3]);
    expect(index.getHeldKey(q1)).toBe("w");
    index.reKey(question("q4"), "v");
    expect(index.getQuestions("v"), "an element it does not hold is not added").toEqual([q2, q3]);
  });
  test("with a rank a key's list is in rank order; no rank goes last", () => {
    const ranks = new Map<any, number>();
    const index = new ElementIndex((el: any) => ranks.get(el));
    const q1 = question("q1", "v");
    const q2 = question("q2", "v");
    const q3 = question("q3", "v");
    ranks.set(q1, 1);
    ranks.set(q2, 2);
    index.addKeyed(q2, "v");
    index.addKeyed(q3, "v");
    index.addKeyed(q1, "v");
    expect(index.getQuestions("v")).toEqual([q1, q2, q3]);
    expect(index.elements, "elements: the order added").toEqual([q2, q3, q1]);
    ranks.set(q2, 5);
    index.reKey(q2, "w");
    index.reKey(q2, "v");
    expect(index.getQuestions("v")).toEqual([q1, q2, q3]);
  });
});

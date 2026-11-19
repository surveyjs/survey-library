import { describe, test, expect } from "vitest";
import { settings } from "../../src/settings";
import { ChangedKeys, IValueGetterNameInfo } from "../../src/conditions/conditionProcessValue";
import { ExpressionRunner } from "../../src/expressions/expressionRunner";

describe("ChangedKeys: did any of these names change", () => {
  test("unknown keys skip nothing", () => {
    const keys = new ChangedKeys();
    expect(keys.isUnknown, "isUnknown").toBe(true);
    expect(keys.isAnyChanged(["a"]), "a name").toBe(true);
    expect(keys.isAnyChanged([]), "no names").toBe(true);
    expect(keys.hasKey("a"), "hasKey").toBe(true);
    expect(keys.canSkip(new ExpressionRunner("{a} = 1")), "a runner").toBe(false);
    keys.setKey("a", 1);
    expect(keys.isUnknown, "a key set on unknown keys keeps them unknown").toBe(true);
  });
  test("a name that is not a key did not change", () => {
    const keys = new ChangedKeys({ a: 1 });
    expect(keys.isUnknown, "isUnknown").toBe(false);
    expect(keys.isAnyChanged(["b"]), "b").toBe(false);
    expect(keys.isAnyChanged(["b", "a"]), "b, a").toBe(true);
    expect(keys.isAnyChanged([]), "no names").toBe(false);
  });
  test("a built-in name always counts as changed, but only as a one-item path", () => {
    const keys = new ChangedKeys({ a: 1 });
    expect(keys.isAnyChanged(["pageno"]), "pageno").toBe(true);
    expect(keys.isAnyChanged(["correctAnswers"]), "correctAnswers").toBe(true);
    expect(keys.isAnyChanged(["pageno.x"]), "pageno.x").toBe(false);
  });
  test("an element property reference always counts as changed, by the prefix of the moment", () => {
    const keys = new ChangedKeys({ a: 1 });
    expect(keys.isAnyChanged(["$q1.isVisible"]), "$q1.isVisible").toBe(true);
    const prev = settings.expressionElementPropertyPrefix;
    settings.expressionElementPropertyPrefix = "@";
    try {
      expect(keys.isAnyChanged(["$q1.isVisible"]), "prefix @: $q1.isVisible").toBe(false);
      expect(keys.isAnyChanged(["@q1.isVisible"]), "prefix @: @q1.isVisible").toBe(true);
    } finally {
      settings.expressionElementPropertyPrefix = prev;
    }
  });
  test("names and keys match in any letter case", () => {
    const keys = new ChangedKeys({ Age: 1 });
    expect(keys.isAnyChanged(["age"]), "age").toBe(true);
    expect(keys.isAnyChanged(["AGE"]), "AGE").toBe(true);
    expect(keys.hasKey("aGe"), "hasKey aGe").toBe(true);
    expect(keys.hasKey("name"), "hasKey name").toBe(false);
  });
  test("a path under a key: the shortest key prefix decides, by the old and new values", () => {
    const keys = new ChangedKeys({ m: { oldValue: { r1: { x: 1 }, r2: 1 }, newValue: { r1: { x: 1 }, r2: 2 } } });
    expect(keys.isAnyChanged(["m.r1.x"]), "m.r1.x is the same").toBe(false);
    expect(keys.isAnyChanged(["M.R2"]), "M.R2 differs").toBe(true);
    expect(keys.isAnyChanged(["m"]), "the key itself").toBe(true);
    expect(new ChangedKeys({ m: { r1: 1 } }).isAnyChanged(["m.r1"]), "a plain value: the path counts as changed").toBe(true);
  });
  test("an unwrapped name changes with its base name", () => {
    const keys = new ChangedKeys({ q1: 1 });
    expect(keys.isAnyChanged(["q1-unwrapped"]), "q1-unwrapped").toBe(true);
    expect(keys.isAnyChanged(["Q1-unwrapped.x"]), "Q1-unwrapped.x").toBe(true);
    expect(keys.isAnyChanged(["q2-unwrapped"]), "q2-unwrapped").toBe(false);
  });
  test("a cleared key: a path under it counts as changed only with the flag", () => {
    const keys = new ChangedKeys({ m: undefined });
    expect(keys.isAnyChanged(["m.r1"]), "no flag").toBe(false);
    expect(keys.isAnyChanged(["m.r1"], false), "flag off").toBe(false);
    expect(keys.isAnyChanged(["m.r1"], true), "flag on").toBe(true);
    expect(keys.isAnyChanged(["m"]), "the key itself, no flag").toBe(true);
  });
  test("a key added during the pass is seen by the next check", () => {
    const raw: any = { a: 1 };
    const keys = new ChangedKeys(raw);
    expect(keys.isAnyChanged(["b"]), "before: b").toBe(false);
    expect(keys.hasKey("B"), "before: hasKey B").toBe(false);
    keys.setKey("B", 2);
    expect(raw.B, "written into the keys object").toBe(2);
    expect(keys.isAnyChanged(["b"]), "after: b").toBe(true);
    expect(keys.hasKey("b"), "after: hasKey b").toBe(true);
  });
  test("a key set again is read with its new value", () => {
    const keys = new ChangedKeys({ m: { oldValue: { x: 1 }, newValue: { x: 1 } } });
    expect(keys.isAnyChanged(["m.x"]), "the same").toBe(false);
    keys.setKey("m", { oldValue: { x: 1 }, newValue: { x: 2 } });
    expect(keys.isAnyChanged(["m.x"]), "differs").toBe(true);
  });
  test("context names are checked next to the keys and always count as changed", () => {
    const raw: any = { a: 1 };
    const keys = new ChangedKeys(raw);
    const context = { row: {}, rowIndex: {} };
    expect(keys.isAnyChanged(["row.q1"], false, undefined, context), "row.q1").toBe(true);
    expect(keys.isAnyChanged(["ROWINDEX"], false, undefined, context), "ROWINDEX").toBe(true);
    expect(keys.isAnyChanged(["row-unwrapped"], false, undefined, context), "row-unwrapped").toBe(true);
    expect(keys.isAnyChanged(["panel.q1"], false, undefined, context), "panel.q1").toBe(false);
    expect(keys.isAnyChanged(["row.q1"]), "without the context").toBe(false);
    expect(Object.keys(raw), "the keys stay as they are").toEqual(["a"]);
  });
  test("canSkip: a function without variable parameters, or no variables, is never skipped", () => {
    const keys = new ChangedKeys({ a: 1 });
    expect(keys.canSkip(new ExpressionRunner("{b} = 1")), "{b}").toBe(true);
    expect(keys.canSkip(new ExpressionRunner("{a} = 1")), "{a}").toBe(false);
    expect(keys.canSkip(new ExpressionRunner("today() > {b}")), "today()").toBe(false);
    expect(keys.canSkip(new ExpressionRunner("1 = 1")), "no variables").toBe(false);
    expect(keys.canSkip(null, ["b"]), "names given").toBe(true);
    expect(keys.canSkip(null, []), "no names given").toBe(false);
  });
  test("names are parsed once into the shared map and the runner's slots", () => {
    const shared = new Map<string, IValueGetterNameInfo>();
    const runner = new ExpressionRunner("{b} = 1");
    new ChangedKeys({ a: 1 }, shared).canSkip(runner);
    const item = runner.getVariablesInfo()[0];
    expect(item.name, "the runner's slot").toBe("b");
    expect(shared.get("b"), "the shared item").toBe(item);
    const other = new ExpressionRunner("{b} = 2");
    new ChangedKeys({ c: 1 }, shared).canSkip(other);
    expect(other.getVariablesInfo()[0], "another runner gets the shared item").toBe(item);
  });
});

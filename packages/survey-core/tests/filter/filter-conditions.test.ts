import { describe, test, expect } from "vitest";
import { getConditionOperatorTitle } from "../../src/filter/filter-conditions";

describe("getConditionOperatorTitle", () => {
  test("returns the English title for each condition operator", () => {
    expect(getConditionOperatorTitle("empty"), "#1").toBe("Empty");
    expect(getConditionOperatorTitle("notempty"), "#2").toBe("Not empty");
    expect(getConditionOperatorTitle("equal"), "#3").toBe("Equals");
    expect(getConditionOperatorTitle("notequal"), "#4").toBe("Does not equal");
    expect(getConditionOperatorTitle("contains"), "#5").toBe("Contains");
    expect(getConditionOperatorTitle("notcontains"), "#6").toBe("Does not contain");
    expect(getConditionOperatorTitle("anyof"), "#7").toBe("Any of");
    expect(getConditionOperatorTitle("noneof"), "#8").toBe("None of");
    expect(getConditionOperatorTitle("allof"), "#9").toBe("All of");
    expect(getConditionOperatorTitle("greater"), "#10").toBe("Greater than");
    expect(getConditionOperatorTitle("less"), "#11").toBe("Less than");
    expect(getConditionOperatorTitle("greaterorequal"), "#12").toBe("Greater than or equal to");
    expect(getConditionOperatorTitle("lessorequal"), "#13").toBe("Less than or equal to");
  });
  // German has no translation of these keys yet, so the lookup must fall back to English rather
  // than return the key name or undefined.
  test("a locale without a translation falls back to English", () => {
    expect(getConditionOperatorTitle("equal", "de")).toBe("Equals");
  });
  // An operator the table does not know (a future operator, a typo) has no title to look up, so the
  // best it can do is echo the operator name back rather than return undefined.
  test("an unknown operator falls back to its own name", () => {
    expect(getConditionOperatorTitle("regex")).toBe("regex");
  });
});

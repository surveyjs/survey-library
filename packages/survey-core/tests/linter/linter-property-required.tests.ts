import { describe, test, expect } from "vitest";
import { ComponentCollection, Serializer } from "survey-core";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { REQUIRED_FIXTURES } from "./lint-fixtures";

// The surveys are the ones linter-runtime-parity compares against the deserializer: what the
// finding says and what the runtime does are read off one and the same JSON.

function findings(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "property/required");
}

describe("property/required", () => {
  test("a question without a name", () => {
    const res = findings(REQUIRED_FIXTURES.questionWithoutName.json);
    expect(res).toHaveLength(1);
    expect(res[0].path).toBe("pages[0].elements[0]");
    expect(res[0].severity).toBe("error");
    expect(res[0].reason).toBe("missing");
    expect(res[0].messageData).toEqual({ reason: "missing", key: "name", className: "text", name: undefined });
    expect(res[0].elementName).toBeUndefined();
    expect(res[0].message).toContain("\"name\"");
  });
  test("an empty name is missing, the way the deserializer reads it", () => {
    expect(findings(REQUIRED_FIXTURES.emptyName.json).map(f => f.path)).toEqual(["elements[0]"]);
  });
  test("a column and a multiple-text item without a name", () => {
    const res = findings(REQUIRED_FIXTURES.columnAndItemWithoutName.json);
    expect(res.map(f => f.path + ":" + f.messageData.key + "@" + f.messageData.className)).toEqual([
      "elements[0].columns[0]:name@matrixdropdowncolumn",
      "elements[1].items[0]:name@multipletextitem",
    ]);
  });
  test("a calculated value without a name", () => {
    const res = findings(REQUIRED_FIXTURES.calculatedValueWithoutName.json);
    expect(res.map(f => f.path + ":" + f.messageData.key + "@" + f.messageData.className)).toEqual([
      "calculatedValues[0]:name@calculatedvalue",
    ]);
  });
  test("a multiple-text question without items", () => {
    const res = findings(REQUIRED_FIXTURES.multipleTextWithoutItems.json);
    expect(res.map(f => f.messageData.key)).toEqual(["items"]);
  });
  test("triggers without their target names", () => {
    const res = findings(REQUIRED_FIXTURES.triggersWithoutTargets.json);
    expect(res.map(f => f.path + ":" + f.messageData.key)).toEqual([
      "triggers[0]:setToName", "triggers[1]:fromName", "triggers[2]:gotoName",
    ]);
  });
  test("a choice without a value is not reported - itemvalue is left to the runtime", () => {
    expect(findings(REQUIRED_FIXTURES.choiceWithoutValue.json)).toHaveLength(0);
  });
  test("a required property with a default value is not reported", () => {
    Serializer.addProperty("text", { name: "!withDefault", default: "x" });
    try {
      expect(findings({ elements: [{ type: "text", name: "q1" }] })).toHaveLength(0);
    } finally {
      Serializer.removeProperty("text", "withDefault");
    }
  });
  test("a custom required property is read from the serializer", () => {
    Serializer.addProperty("checkbox", { name: "!foo" });
    try {
      const res = findings({ elements: [{ type: "checkbox", name: "q1", choices: ["a"] }] });
      expect(res.map(f => f.messageData.key)).toEqual(["foo"]);
    } finally {
      Serializer.removeProperty("checkbox", "foo");
    }
  });
  test("a component question without a name is reported", () => {
    ComponentCollection.Instance.add({ name: "reqcomp", questionJSON: { type: "text" } });
    try {
      expect(findings({ elements: [{ type: "reqcomp" }] }).map(f => f.path)).toEqual(["elements[0]"]);
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("a survey with every required property is clean", () => {
    expect(findings(REQUIRED_FIXTURES.complete.json)).toHaveLength(0);
  });
});

// The runtime trims and lower-cases a question name, so a number or a boolean written for it
// stops the survey from loading - and used to stop the linter too, in the walker's name maps.
describe("property/required - a name that is not a string", () => {
  test("a numeric question name is reported at the name key, spelled out as the fix", () => {
    const res = findings({ elements: [{ type: "text", name: <any>5 }] });
    expect(res).toHaveLength(1);
    expect(res[0].reason).toBe("notAString");
    expect(res[0].severity).toBe("error");
    expect(res[0].path).toBe("elements[0].name");
    expect(res[0].messageData).toEqual({
      reason: "notAString", key: "name", className: "text", name: "5", value: 5,
    });
    expect(res[0].elementName).toBe("5");
    expect(res[0].message).toBe("The name of the text is 5, not a string - the survey cannot load it.");
    expect(res[0].fix).toEqual({
      reason: "setName", edits: [{ op: "set", path: "elements[0].name", value: "5" }],
    });
  });
  test("a column, an item and a calculated value with such a name are reported, and nothing throws", () => {
    const res = findings({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: <any>1 }] },
        { type: "multipletext", name: "mt1", items: [{ name: <any>true }] },
      ],
      calculatedValues: [{ name: <any>7, expression: "1" }],
    });
    expect(res.map(f => f.path)).toEqual([
      "calculatedValues[0].name", "elements[0].columns[0].name", "elements[1].items[0].name",
    ]);
    expect(res.every(f => f.reason === "notAString")).toBe(true);
  });
  test("a page and a panel with such a name are reported too - the runtime trims a name whatever it belongs to", () => {
    const res = findings({
      pages: [{ name: <any>1, elements: [{ type: "panel", name: <any>5, elements: [{ type: "text", name: "q1" }] }] }],
    });
    expect(res.map(f => f.path).sort()).toEqual(["pages[0].elements[0].name", "pages[0].name"]);
    expect(res.every(f => f.reason === "notAString")).toBe(true);
    expect(res.map(f => f.messageData.className).sort()).toEqual(["page", "panel"]);
    expect(res.map(f => f.fix.edits[0].value).sort()).toEqual(["1", "5"]);
  });
  test("the name is indexed by its spelling, so a reference to it resolves", () => {
    const result = lintSurvey({
      elements: [{ type: "text", name: <any>5 }, { type: "text", name: "q2", visibleIf: "{5} = 1" }],
    });
    expect(result.findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(0);
  });
});

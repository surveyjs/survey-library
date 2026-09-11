import { describe, test, expect } from "vitest";
import { ComponentCollection, Serializer } from "survey-core";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function findings(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "property/required");
}

describe("property/required", () => {
  test("a question without a name", () => {
    const res = findings({ elements: [{ type: "text" }] });
    expect(res).toHaveLength(1);
    expect(res[0].path).toBe("elements[0]");
    expect(res[0].severity).toBe("error");
    expect(res[0].reason).toBe("missing");
    expect(res[0].messageData).toEqual({ reason: "missing", key: "name", className: "text", name: undefined });
    expect(res[0].elementName).toBeUndefined();
    expect(res[0].message).toContain("\"name\"");
  });
  test("an empty name is missing, the way the deserializer reads it", () => {
    expect(findings({ elements: [{ type: "text", name: "" }] }).map(f => f.path)).toEqual(["elements[0]"]);
  });
  test("a column, a multiple-text item and a calculated value without a name", () => {
    const res = findings({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ cellType: "text" }] },
        { type: "multipletext", name: "mt1", items: [{ title: "t" }] },
      ],
      calculatedValues: [{ expression: "1" }],
    });
    expect(res.map(f => f.path + ":" + f.messageData.key + "@" + f.messageData.className)).toEqual([
      "calculatedValues[0]:name@calculatedvalue",
      "elements[0].columns[0]:name@matrixdropdowncolumn",
      "elements[1].items[0]:name@multipletextitem",
    ]);
  });
  test("a multiple-text question without items", () => {
    const res = findings({ elements: [{ type: "multipletext", name: "mt1" }] });
    expect(res.map(f => f.messageData.key)).toEqual(["items"]);
  });
  test("triggers without their target names", () => {
    const res = findings({
      elements: [{ type: "text", name: "q1" }],
      triggers: [
        { type: "setvalue", expression: "{q1} = 1", setValue: 2 },
        { type: "copyvalue", expression: "{q1} = 1", setToName: "q1" },
        { type: "skip", expression: "{q1} = 1" },
      ],
    });
    expect(res.map(f => f.path + ":" + f.messageData.key)).toEqual([
      "triggers[0]:setToName", "triggers[1]:fromName", "triggers[2]:gotoName",
    ]);
  });
  test("a choice without a value is not reported - itemvalue is left to the runtime", () => {
    expect(findings({ elements: [{ type: "checkbox", name: "q1", choices: [{ text: "a" }] }] })).toHaveLength(0);
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
    expect(findings({
      pages: [{ elements: [
        { type: "text", name: "q1" },
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }] },
        { type: "multipletext", name: "mt1", items: [{ name: "i1" }] },
      ] }],
      calculatedValues: [{ name: "cv", expression: "1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "q1" }],
    })).toHaveLength(0);
  });
});

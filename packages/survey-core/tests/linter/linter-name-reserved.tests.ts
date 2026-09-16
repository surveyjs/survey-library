import { describe, test, expect } from "vitest";
import { applyFix, ILintFinding, ISurveyLintOptions, lintSurvey } from "../../src/linter/index";

const RESERVED = [
  "constructor", "__proto__", "toString", "valueOf", "hasOwnProperty", "isPrototypeOf",
  "propertyIsEnumerable", "toLocaleString", "__defineGetter__", "__defineSetter__",
  "__lookupGetter__", "__lookupSetter__",
];

function byRule(json: any, options?: ISurveyLintOptions): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => f.ruleId === "name/reserved");
}

describe("name/reserved - question names", () => {
  test("every member of Object.prototype is reported as a question name", () => {
    RESERVED.forEach(name => {
      const findings = byRule({ elements: [{ type: "text", name: name }] });
      expect(findings, name).toHaveLength(1);
      expect(findings[0].reason).toBe("questionName");
      expect(findings[0].severity).toBe("error");
      expect(findings[0].path).toBe("elements[0].name");
      expect(findings[0].messageData).toEqual({ reason: "questionName", name: name });
      expect(findings[0].elementName).toBe(name);
      expect(findings[0].elementType).toBe("text");
      expect(findings[0].message).toBe("The name \"" + name + "\" is reserved - a member of Object.prototype.");
    });
  });
  test("the comparison ignores case: every spelling of a member is reserved", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "ToString" },
        { type: "text", name: "tostring" },
        { type: "text", name: "Constructor" },
        { type: "text", name: "__PROTO__" },
      ],
    });
    expect(findings.map(f => f.messageData.name)).toEqual(["ToString", "tostring", "Constructor", "__PROTO__"]);
    expect(findings[0].message).toBe("The name \"ToString\" is reserved - a member of Object.prototype.");
  });
  test("the comparison trims: the runtime trims a name before it keys anything by it", () => {
    const findings = byRule({ elements: [{ type: "text", name: " toString " }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe(" toString ");
  });
  test("a dotted key that contains a member is an ordinary key", () => {
    expect(byRule({
      elements: [{ type: "text", name: "toString.x" }, { type: "text", name: "a.toString" }],
    })).toHaveLength(0);
  });
  test("a question inside a dynamic panel template or a detail panel is reported at its own path", () => {
    const findings = byRule({
      elements: [
        { type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "toString" }] },
        {
          type: "matrixdropdown", name: "m", rows: ["r1"], columns: [{ name: "c1" }],
          detailPanelMode: "underRow", detailElements: [{ type: "text", name: "valueOf" }],
        },
      ],
    });
    expect(findings.map(f => f.path)).toEqual([
      "elements[0].templateElements[0].name", "elements[1].detailElements[0].name",
    ]);
  });
  test("a name and a valueName that are both reserved are two findings, and only the name gets a fix", () => {
    const findings = byRule({ elements: [{ type: "text", name: "toString", valueName: "valueOf" }] });
    expect(findings.map(f => f.reason)).toEqual(["questionName", "valueName"]);
    expect(findings[0].fix).toBeDefined();
    expect(findings[1].fix).toBeUndefined();
  });
  test("a page and a panel may carry the name - neither is a data key", () => {
    expect(byRule({
      pages: [{
        name: "toString",
        elements: [{ type: "panel", name: "valueOf", elements: [{ type: "text", name: "q1" }] }],
      }],
    })).toHaveLength(0);
  });
  test("an element with no name is left to property/required", () => {
    expect(byRule({ elements: [{ type: "text" }] })).toHaveLength(0);
  });
});

describe("name/reserved - valueName", () => {
  test("a reserved valueName is reported at the valueName key, without a fix", () => {
    const findings = byRule({ elements: [{ type: "text", name: "q1", valueName: "hasOwnProperty" }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("valueName");
    expect(findings[0].path).toBe("elements[0].valueName");
    expect(findings[0].messageData).toEqual({ reason: "valueName", name: "q1", valueName: "hasOwnProperty" });
    expect(findings[0].elementName).toBe("q1");
    expect(findings[0].elementType).toBe("text");
    expect(findings[0].fix).toBeUndefined();
    expect(findings[0].message).toBe(
      "The valueName \"hasOwnProperty\" of \"q1\" is reserved - a member of Object.prototype.");
  });
});

describe("name/reserved - matrix columns", () => {
  test("a column of a dynamic or a dropdown matrix is reported at its name, with a fix", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }, { name: "toString" }] },
        { type: "matrixdropdown", name: "m2", rows: ["r1"], columns: [{ name: "constructor" }] },
      ],
    });
    expect(findings.map(f => f.path)).toEqual(["elements[0].columns[1].name", "elements[1].columns[0].name"]);
    expect(findings[0].reason).toBe("columnName");
    expect(findings[0].messageData).toEqual({ reason: "columnName", name: "toString", matrixName: "m1" });
    expect(findings[0].elementName).toBe("toString");
    expect(findings[0].elementType).toBe("matrixdropdowncolumn");
    expect(findings[0].message).toBe("The column \"toString\" of \"m1\" is reserved - a member of Object.prototype.");
    expect(findings[0].fix.edits).toEqual([{ op: "set", path: "elements[0].columns[1].name", value: "question1" }]);
    expect(findings[1].fix.edits[0].value).toBe("question2");
  });
  test("the columns of a single-choice matrix are values, not keys", () => {
    expect(byRule({
      elements: [{ type: "matrix", name: "m", rows: ["r1"], columns: ["toString", "c2"] }],
    })).toHaveLength(0);
  });
});

describe("name/reserved - matrix rows", () => {
  test("a row of a single-choice or a dropdown matrix is reported at the row, without a fix", () => {
    const findings = byRule({
      elements: [
        { type: "matrix", name: "m1", rows: ["r1", "toString"], columns: ["c1"] },
        { type: "matrixdropdown", name: "m2", rows: [{ value: "valueOf", text: "Value" }], columns: [{ name: "c1" }] },
      ],
    });
    expect(findings.map(f => f.path)).toEqual(["elements[0].rows[1]", "elements[1].rows[0].value"]);
    expect(findings[0].reason).toBe("rowValue");
    expect(findings[0].messageData).toEqual({ reason: "rowValue", name: "m1", rowValue: "toString" });
    expect(findings[0].elementName).toBe("m1");
    expect(findings[0].elementType).toBe("matrix");
    expect(findings[0].fix).toBeUndefined();
    expect(findings[0].message).toBe("The row \"toString\" of \"m1\" is reserved - a member of Object.prototype.");
    expect(findings[1].messageData.rowValue).toBe("valueOf");
  });
  test("the row index is the one written in the JSON, whatever the walker dropped", () => {
    const findings = byRule({
      elements: [{ type: "matrix", name: "m", rows: [null, 5, "toString"], columns: ["c1"] }],
    });
    expect(findings.map(f => f.path)).toEqual(["elements[0].rows[2]"]);
  });
  test("a dynamic matrix has no rows to check", () => {
    expect(byRule({
      elements: [{ type: "matrixdynamic", name: "m", rows: ["toString"], columns: [{ name: "c1" }] }],
    })).toHaveLength(0);
  });
});

describe("name/reserved - multiple text items", () => {
  test("an item is reported at its name, with a fix", () => {
    const findings = byRule({
      elements: [{ type: "multipletext", name: "mt", items: [{ name: "a" }, { name: "hasOwnProperty" }] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("itemName");
    expect(findings[0].path).toBe("elements[0].items[1].name");
    expect(findings[0].messageData).toEqual({ reason: "itemName", name: "hasOwnProperty", questionName: "mt" });
    expect(findings[0].elementName).toBe("hasOwnProperty");
    expect(findings[0].elementType).toBe("multipletextitem");
    expect(findings[0].message).toBe("The item \"hasOwnProperty\" of \"mt\" is reserved - a member of Object.prototype.");
    expect(findings[0].fix.edits).toEqual([{ op: "set", path: "elements[0].items[1].name", value: "question1" }]);
  });
});

describe("name/reserved - calculated values", () => {
  test("a calculated value is reported at its name, with a fix", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "toString", expression: "{q1} + 1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("calculatedValueName");
    expect(findings[0].path).toBe("calculatedValues[0].name");
    expect(findings[0].messageData).toEqual({ reason: "calculatedValueName", name: "toString" });
    expect(findings[0].elementName).toBe("toString");
    expect(findings[0].elementType).toBe("calculatedvalue");
    expect(findings[0].message).toBe("The calculated value \"toString\" is reserved - a member of Object.prototype.");
    expect(findings[0].fix.edits).toEqual([{ op: "set", path: "calculatedValues[0].name", value: "question1" }]);
  });
});

describe("name/reserved - configuration and repair", () => {
  test("the rule can be switched off", () => {
    expect(byRule({ elements: [{ type: "text", name: "toString" }] }, { rules: { "name/reserved": "off" } }))
      .toHaveLength(0);
  });
  test("a finding can be suppressed by element name", () => {
    const result = lintSurvey({ elements: [{ type: "text", name: "toString" }] },
      { suppress: [{ elementName: "toString" }] });
    expect(result.findings.filter(f => f.ruleId === "name/reserved")).toHaveLength(0);
    expect(result.suppressedCount).toBe(1);
  });
  test("the host spells the new name, and the repaired JSON lints clean", () => {
    const json = { elements: [{ type: "text", name: "toString" }] };
    const finding = byRule(json, { newElementName: () => "frage1" })[0];
    expect(finding.fix.edits[0].value).toBe("frage1");
    const fixed = applyFix(json, finding.fix);
    expect(fixed.elements[0].name).toBe("frage1");
    expect(byRule(fixed)).toHaveLength(0);
    // the input is never touched
    expect(json.elements[0].name).toBe("toString");
  });
  test("the position marker of an annotated JSON is neither a name nor a row", () => {
    const pos = { start: 0, end: 1 };
    const findings = byRule({
      pos: pos,
      elements: [
        {
          type: "matrixdropdown", name: "m", pos: pos,
          rows: [{ value: "toString", text: "T", pos: pos }], columns: [{ name: "c1", pos: pos }],
        },
        { type: "multipletext", name: "mt", pos: pos, items: [{ name: "a", pos: pos }] },
      ],
    });
    expect(findings.map(f => f.path)).toEqual(["elements[0].rows[0].value"]);
  });
});

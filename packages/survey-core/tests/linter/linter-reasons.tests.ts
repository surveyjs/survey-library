import { describe, test, expect } from "vitest";
import {
  getRules, lintSurvey, ILintFinding, SurveyLintHintReasons, SurveyLintReasons,
  SurveyLintReproductionReasons,
} from "../../src/linter/index";

function findingsOf(json: any, ruleId: string): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

// One fixture per (ruleId, reason): the table is only useful if every value in it is actually
// produced by a rule, and every value a rule produces is in it.
const CASES: Array<{ ruleId: string, reason: string, json: any }> = [
  {
    ruleId: "expression/syntax", reason: "unparsable",
    json: { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", visibleIf: "{q1} ===" }] },
  },
  {
    ruleId: "reference/unknown", reason: "notFound",
    json: { elements: [{ type: "text", name: "q1", visibleIf: "{nope} = 1" }] },
  },
  {
    ruleId: "reference/unknown", reason: "inContainer",
    json: {
      elements: [
        { type: "paneldynamic", name: "members", templateElements: [{ type: "text", name: "inner" }] },
        { type: "text", name: "q2", visibleIf: "{members[0].nope} = 1" },
      ],
    },
  },
  {
    ruleId: "reference/unknown", reason: "scopedUnknown",
    json: {
      elements: [{
        type: "matrixdynamic", name: "m",
        columns: [{ name: "col1" }, { name: "col2", visibleIf: "{row.nosuchcol} = 1" }],
      }],
    },
  },
  {
    ruleId: "reference/self", reason: "selfReference",
    json: { elements: [{ type: "text", name: "q1", visibleIf: "{q1} notempty" }] },
  },
  {
    ruleId: "name/duplicate", reason: "elementNames",
    json: { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1" }] },
  },
  {
    ruleId: "name/duplicate", reason: "calculatedValueNames",
    json: {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "cv", expression: "1" }, { name: "cv", expression: "2" }],
    },
  },
  {
    ruleId: "name/duplicate", reason: "calculatedValueShadowsElement",
    json: {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "q1", expression: "1" }],
    },
  },
  {
    ruleId: "element/unknown-type", reason: "unknownType",
    json: { elements: [{ type: "nosuchtype", name: "q1" }] },
  },
  {
    ruleId: "expression/unknown-function", reason: "notRegistered",
    json: {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "nosuchfn() = 1" },
      ],
    },
  },
  {
    ruleId: "cycle/calculated-value", reason: "self",
    json: {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "cv", expression: "{cv} + 1" }],
    },
  },
  {
    ruleId: "cycle/calculated-value", reason: "loop",
    json: {
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [
        { name: "a", expression: "{b} + 1" },
        { name: "b", expression: "{a} + 1" },
      ],
    },
  },
  {
    ruleId: "cycle/trigger", reason: "self",
    json: {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "q1", setValue: 1 }],
    },
  },
  {
    ruleId: "cycle/trigger", reason: "loop",
    json: {
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [
        { type: "setvalue", expression: "{q2} notempty", setToName: "q1", setValue: 1 },
        { type: "setvalue", expression: "{q1} notempty", setToName: "q2", setValue: 1 },
      ],
    },
  },
  {
    ruleId: "expression/unknown-choice", reason: "notAmongChoices",
    json: {
      elements: [
        { type: "dropdown", name: "q1", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{q1} = 'zzz'" },
      ],
    },
  },
  {
    ruleId: "expression/unknown-choice", reason: "noChoiceContains",
    json: {
      elements: [
        { type: "dropdown", name: "q1", choices: ["apple", "banana"] },
        { type: "text", name: "q2", visibleIf: "{q1} contains 'zzz'" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "no-value",
    json: {
      elements: [
        { type: "html", name: "banner" },
        { type: "text", name: "q2", visibleIf: "{banner} > 0" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "non-scalar",
    json: {
      elements: [
        { type: "checkbox", name: "tags", choices: ["a"] },
        { type: "text", name: "q2", visibleIf: "{tags} > 3" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "boolean-ordering",
    json: {
      elements: [
        { type: "boolean", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} > 0" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "text-ordering",
    json: {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} > 3" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "date-vs-number",
    json: {
      elements: [
        { type: "text", name: "birth", inputType: "date" },
        { type: "text", name: "q2", visibleIf: "{birth} < 2007" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "number-vs-string",
    json: {
      elements: [
        { type: "text", name: "age", inputType: "number" },
        { type: "text", name: "q2", visibleIf: "{age} > 'ten'" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "array-vs-scalar",
    json: {
      elements: [
        { type: "checkbox", name: "tags", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{tags} = 'a'" },
      ],
    },
  },
  {
    ruleId: "expression/type-mismatch", reason: "boolean-vs-const",
    json: {
      elements: [
        { type: "boolean", name: "agree" },
        { type: "text", name: "q2", visibleIf: "{agree} = 'yes'" },
      ],
    },
  },
  {
    ruleId: "expression/contradiction", reason: "alwaysFalse",
    json: { elements: [{ type: "text", name: "q1", visibleIf: "1 = 2" }] },
  },
  {
    ruleId: "expression/contradiction", reason: "alwaysFalseViaConstants",
    json: {
      calculatedValues: [{ name: "c1", expression: "1 + 1" }],
      elements: [{ type: "text", name: "q1", visibleIf: "{c1} = 5" }],
    },
  },
  {
    ruleId: "expression/contradiction", reason: "outOfRange",
    json: {
      elements: [
        { type: "text", name: "age", inputType: "number", min: 1, max: 5 },
        { type: "text", name: "q1", visibleIf: "{age} > 10" },
      ],
    },
  },
  {
    ruleId: "expression/contradiction", reason: "unsatisfiable",
    json: {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'a' and {q1} = 'b'" },
      ],
    },
  },
  {
    ruleId: "expression/meaningless-condition", reason: "alwaysTrue",
    json: { elements: [{ type: "text", name: "q1", visibleIf: "1 = 1" }] },
  },
  {
    ruleId: "expression/meaningless-condition", reason: "alwaysTrueViaConstants",
    json: {
      calculatedValues: [{ name: "c1", expression: "1 + 1" }],
      elements: [{ type: "text", name: "q1", visibleIf: "{c1} = 2" }],
    },
  },
  {
    ruleId: "expression/meaningless-condition", reason: "notABoolean",
    json: {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} + 1" },
      ],
    },
  },
  {
    ruleId: "expression/meaningless-condition", reason: "meaninglessFragment",
    json: {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 1 or 2 = 2" },
      ],
    },
  },
  {
    ruleId: "choices/dead-source", reason: "missing",
    json: { elements: [{ type: "dropdown", name: "q1", choicesFromQuestion: "nope" }] },
  },
  {
    ruleId: "choices/dead-source", reason: "self",
    json: { elements: [{ type: "dropdown", name: "q1", choicesFromQuestion: "q1" }] },
  },
  {
    ruleId: "choices/dead-source", reason: "not-a-source",
    json: {
      elements: [
        { type: "text", name: "src" },
        { type: "dropdown", name: "q1", choicesFromQuestion: "src" },
      ],
    },
  },
  {
    ruleId: "choices/dead-source", reason: "missing-field",
    json: {
      elements: [
        { type: "matrixdynamic", name: "src", columns: [{ name: "col1" }] },
        {
          type: "dropdown", name: "q1", choicesFromQuestion: "src",
          choiceValuesFromQuestion: "nosuchcol",
        },
      ],
    },
  },
  {
    ruleId: "trigger/unknown-target", reason: "pageNotFound",
    json: {
      pages: [{ name: "p1", elements: [{ type: "text", name: "q1" }] }],
      triggers: [{ type: "visible", expression: "{q1} notempty", pages: ["nosuchpage"] }],
    },
  },
  {
    ruleId: "trigger/unknown-target", reason: "segmentNotFound",
    json: {
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "text", name: "src" },
      ],
      triggers: [{
        type: "copyvalue", expression: "{src} notempty", setToName: "m1[0].col9", fromName: "src",
      }],
    },
  },
  {
    ruleId: "trigger/unknown-target", reason: "rootNotFound",
    json: {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "nope", setValue: 1 }],
    },
  },
  {
    ruleId: "trigger/unknown-type", reason: "unknownType",
    json: {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "nosuchtrigger", expression: "{q1} notempty" }],
    },
  },
  {
    ruleId: "trigger/unknown-type", reason: "noType",
    json: { elements: [{ type: "text", name: "q1" }], triggers: [{ expression: "{q1} notempty" }] },
  },
  {
    ruleId: "value/not-a-choice", reason: "defaultValue",
    json: { elements: [{ type: "dropdown", name: "q1", choices: ["a", "b"], defaultValue: "z" }] },
  },
  {
    ruleId: "value/not-a-choice", reason: "correctAnswer",
    json: { elements: [{ type: "dropdown", name: "q1", choices: ["a", "b"], correctAnswer: "z" }] },
  },
  {
    ruleId: "value/not-a-choice", reason: "defaultRowValue",
    json: {
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "col1", cellType: "dropdown", choices: ["a"] }],
        defaultRowValue: { col1: "z" },
      }],
    },
  },
  {
    ruleId: "value/not-a-choice", reason: "defaultPanelValue",
    json: {
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "dropdown", name: "q1", choices: ["a"] }],
        defaultPanelValue: { q1: "z" },
      }],
    },
  },
  {
    ruleId: "value/not-a-choice", reason: "unknownRowKey",
    json: {
      elements: [{
        type: "matrix", name: "m1", rows: ["r1"], columns: [1, 2],
        defaultValue: { rX: 1 },
      }],
    },
  },
  {
    ruleId: "value/not-a-choice", reason: "unknownColumnKey",
    json: {
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }],
        defaultValue: [{ colX: 1 }],
      }],
    },
  },
  {
    ruleId: "value/not-a-choice", reason: "unknownQuestionKey",
    json: {
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "q1" }],
        defaultValue: [{ qX: 1 }],
      }],
    },
  },
  {
    ruleId: "value/not-a-choice", reason: "copyValueShape",
    json: {
      elements: [
        { type: "checkbox", name: "src", choices: ["a"] },
        { type: "dropdown", name: "dst", choices: ["a"] },
      ],
      triggers: [{ type: "copyvalue", expression: "{src} notempty", fromName: "src", setToName: "dst" }],
    },
  },
  {
    ruleId: "value/not-a-choice", reason: "copyValueNoOverlap",
    json: {
      elements: [
        { type: "dropdown", name: "src", choices: ["a"] },
        { type: "dropdown", name: "dst", choices: ["b"] },
      ],
      triggers: [{ type: "copyvalue", expression: "{src} notempty", fromName: "src", setToName: "dst" }],
    },
  },
  {
    ruleId: "value/not-a-choice", reason: "triggerSetValue",
    json: {
      elements: [{ type: "text", name: "q1" }, { type: "dropdown", name: "q2", choices: ["a"] }],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "q2", setValue: "z" }],
    },
  },
  {
    ruleId: "cycle/value-write", reason: "self",
    json: { elements: [{ type: "text", name: "q1", resetValueIf: "{q1} = 'x'" }] },
  },
  {
    ruleId: "cycle/value-write", reason: "loop",
    json: {
      elements: [
        { type: "text", name: "a", setValueExpression: "{b} + 1" },
        { type: "text", name: "b", setValueExpression: "{a} + 1" },
      ],
    },
  },
  {
    ruleId: "reference/unknown", reason: "keyNameNotFound",
    json: {
      elements: [{
        type: "matrixdynamic", name: "m1", keyName: "colX", columns: [{ name: "col1" }],
      }],
    },
  },
  {
    ruleId: "element/count-contradiction", reason: "minAboveMax",
    json: {
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        minRowCount: 5, maxRowCount: 3,
      }],
    },
  },
  {
    ruleId: "element/count-contradiction", reason: "countOutOfBounds",
    json: {
      elements: [{
        type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "q" }],
        panelCount: 0, minPanelCount: 2,
      }],
    },
  },
  {
    ruleId: "choices/duplicate", reason: "duplicateValue",
    json: { elements: [{ type: "dropdown", name: "q1", choices: ["a", "a"] }] },
  },
  {
    ruleId: "choices/duplicate", reason: "specialItemCollision",
    json: { elements: [{ type: "dropdown", name: "q1", choices: ["a", "none"], showNoneItem: true }] },
  },
  {
    ruleId: "element/never-visible", reason: "dependsOnDeadValue",
    json: {
      elements: [
        { type: "text", name: "q1", visibleIf: "1 = 2" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'yes'" },
      ],
    },
  },
  {
    ruleId: "page/empty", reason: "emptyTemplate",
    json: { elements: [{ type: "paneldynamic", name: "pd", templateElements: [] }] },
  },
  {
    ruleId: "page/empty", reason: "noElements",
    json: { pages: [{ name: "p1", elements: [] }] },
  },
  {
    ruleId: "page/empty", reason: "noRenderableElements",
    json: { pages: [{ name: "p1", elements: [{ type: "text", name: "q1", visible: false }] }] },
  },
  {
    ruleId: "page/empty", reason: "detailElementsHidden",
    json: {
      elements: [{
        type: "matrixdropdown", name: "m1", rows: ["r1"], columns: [{ name: "c1" }],
        detailElements: [{ type: "text", name: "d1" }],
      }],
    },
  },
];

describe("linter reasons - the (ruleId, reason) table", () => {
  test("the table lists exactly the registered rules", () => {
    expect(Object.keys(SurveyLintReasons).sort()).toEqual(getRules().map(r => r.id).sort());
  });
  test("every entry maps a key to itself, so a typo cannot go unnoticed", () => {
    Object.keys(SurveyLintReasons).forEach(ruleId => {
      const table = SurveyLintReasons[ruleId];
      Object.keys(table).forEach(key => expect(table[key]).toBe(key));
    });
    Object.keys(SurveyLintHintReasons).forEach(key => {
      expect(SurveyLintHintReasons[key]).toBe(key);
    });
    Object.keys(SurveyLintReproductionReasons).forEach(key => {
      expect(SurveyLintReproductionReasons[key]).toBe(key);
    });
  });
  test("the tables are frozen - the values are public API", () => {
    expect(Object.isFrozen(SurveyLintReasons)).toBe(true);
    expect(Object.isFrozen(SurveyLintHintReasons)).toBe(true);
    Object.keys(SurveyLintReasons).forEach(ruleId => {
      expect(Object.isFrozen(SurveyLintReasons[ruleId])).toBe(true);
    });
  });
});

describe("linter reasons - every reason is reachable", () => {
  CASES.forEach(entry => {
    test(entry.ruleId + " / " + entry.reason, () => {
      const findings = findingsOf(entry.json, entry.ruleId);
      expect(findings.length).toBeGreaterThan(0);
      expect(findings.map(f => f.reason)).toContain(entry.reason);
    });
  });
  test("the cases cover every value of the table", () => {
    const covered: { [ruleId: string]: { [reason: string]: boolean } } = {};
    CASES.forEach(entry => {
      if (!covered[entry.ruleId]) covered[entry.ruleId] = {};
      covered[entry.ruleId][entry.reason] = true;
    });
    const missing: Array<string> = [];
    Object.keys(SurveyLintReasons).forEach(ruleId => {
      Object.keys(SurveyLintReasons[ruleId]).forEach(reason => {
        if (!covered[ruleId] || !covered[ruleId][reason]) missing.push(ruleId + "/" + reason);
      });
    });
    expect(missing).toEqual([]);
  });
});

describe("linter reasons - every finding carries one", () => {
  test("no fixture produces a finding without a reason from its rule's table", () => {
    const bad: Array<string> = [];
    CASES.forEach(entry => {
      lintSurvey(entry.json).findings.forEach(finding => {
        const table = SurveyLintReasons[finding.ruleId];
        if (!finding.reason || !table || !table[finding.reason]) {
          bad.push(finding.ruleId + " -> " + finding.reason);
        }
      });
    });
    expect(bad).toEqual([]);
  });
  test("a reproduction, when present, carries a reason from its table", () => {
    const bad: Array<string> = [];
    CASES.forEach(entry => {
      lintSurvey(entry.json).findings.forEach(finding => {
        if (!finding.reproduction) return;
        const reason = finding.reproduction.reason;
        if (!reason || !SurveyLintReproductionReasons[reason]) {
          bad.push(finding.ruleId + " -> " + reason);
        }
      });
    });
    expect(bad).toEqual([]);
  });
});

describe("linter reasons - the scope hint", () => {
  test("an inactive row scope reports the hint reason and the variable it is about", () => {
    const findings = findingsOf({
      elements: [{ type: "text", name: "q1", visibleIf: "{row.col1} = 1" }],
    }, "reference/unknown");
    expect(findings).toHaveLength(1);
    expect(findings[0].hint).toEqual({ reason: SurveyLintHintReasons.rowScopePrefix, name: "row" });
    expect(findings[0].message).toContain("matrix cell");
  });
  test("an inactive panel scope reports the panelScopePrefix hint", () => {
    const findings = findingsOf({
      elements: [{ type: "text", name: "q1", visibleIf: "{panel.q} = 1" }],
    }, "reference/unknown");
    expect(findings).toHaveLength(1);
    expect(findings[0].hint.reason).toBe(SurveyLintHintReasons.panelScopePrefix);
    expect(findings[0].message).toContain("dynamic panel");
  });
  test("a name that only needs its row prefix reports the matrixColumn hint", () => {
    const findings = findingsOf({
      elements: [{
        type: "matrixdynamic", name: "m",
        columns: [{ name: "col1" }, { name: "col2", visibleIf: "{col1} = 1" }],
      }],
    }, "reference/unknown");
    expect(findings).toHaveLength(1);
    expect(findings[0].hint).toEqual({ reason: SurveyLintHintReasons.matrixColumn, name: "col1" });
  });
  test("a plain unresolved name carries no hint", () => {
    const findings = findingsOf({
      elements: [{ type: "text", name: "q1", visibleIf: "{nope} = 1" }],
    }, "reference/unknown");
    expect(findings).toHaveLength(1);
    expect(findings[0].hint).toBeUndefined();
  });
});

describe("linter reasons - the data a localized message needs", () => {
  test("reference/unknown inContainer reports the container type and the root name", () => {
    const findings = findingsOf({
      elements: [
        { type: "paneldynamic", name: "members", templateElements: [{ type: "text", name: "inner" }] },
        { type: "text", name: "q2", visibleIf: "{members[0].nope} = 1" },
      ],
    }, "reference/unknown");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.root).toBe("members");
    expect(findings[0].messageData.containerType).toBe("paneldynamic");
    expect(findings[0].message).toContain("paneldynamic");
  });
  test("choices/dead-source missing-field reports the source type", () => {
    const findings = findingsOf({
      elements: [
        { type: "matrixdynamic", name: "src", columns: [{ name: "col1" }] },
        {
          type: "dropdown", name: "q1", choicesFromQuestion: "src",
          choiceValuesFromQuestion: "nosuchcol",
        },
      ],
    }, "choices/dead-source");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.sourceType).toBe("matrixdynamic");
  });
  test("trigger/unknown-target segmentNotFound reports what the noun depends on", () => {
    const findings = findingsOf({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "text", name: "src" },
      ],
      triggers: [{
        type: "copyvalue", expression: "{src} notempty", setToName: "m1[0].col9", fromName: "src",
      }],
    }, "trigger/unknown-target");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.containerType).toBe("matrixdynamic");
    expect(findings[0].messageData.segmentIndex).toBe(1);
    expect(findings[0].messageData.root).toBe("m1");
    expect(findings[0].message).toContain("has no column");
  });
  test("expression/type-mismatch reports the element name the detail is about", () => {
    const findings = findingsOf({
      elements: [
        { type: "text", name: "q1", valueName: "income" },
        { type: "text", name: "q2", visibleIf: "{income} > 3" },
      ],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("income");
    expect(findings[0].messageData.recordName).toBe("q1");
  });
  test("expression/type-mismatch reports a reason for its prose suggestion", () => {
    const findings = findingsOf({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{tags} = 'a'" },
      ],
    }, "expression/type-mismatch");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.suggestionReason).toBe("useContainsOrAnyof");
  });
  test("cycle/trigger reports the loop members unformatted", () => {
    const findings = findingsOf({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [
        { type: "setvalue", expression: "{q2} notempty", setToName: "q1", setValue: 1 },
        { type: "setvalue", expression: "{q1} notempty", setToName: "q2", setValue: 1 },
      ],
    }, "cycle/trigger");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.members).toEqual([
      { path: "triggers[0]", type: "setvalue", setToName: "q1" },
      { path: "triggers[1]", type: "setvalue", setToName: "q2" },
    ]);
    expect(findings[0].messageData.setToName).toBe("q1");
    // the loop is recorded the way cycle/calculated-value records it: identities, closed
    expect(findings[0].messageData.cycle).toEqual(["triggers[0]", "triggers[1]", "triggers[0]"]);
    expect(findings[0].messageData.names).toEqual(["triggers[0]", "triggers[1]"]);
    expect(findings[0].messageData.labels).toEqual([
      "triggers[0] (setvalue -> q1)", "triggers[1] (setvalue -> q2)",
    ]);
  });
  test("cycle/calculated-value reports the loop without the repeated first name", () => {
    const findings = findingsOf({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [
        { name: "a", expression: "{b} + 1" },
        { name: "b", expression: "{a} + 1" },
      ],
    }, "cycle/calculated-value");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.cycle).toEqual(["a", "b", "a"]);
    expect(findings[0].messageData.names).toEqual(["a", "b"]);
  });
});

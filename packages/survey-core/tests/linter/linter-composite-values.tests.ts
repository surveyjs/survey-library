import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "value/not-a-choice");
}

describe("composite defaultValue - single-choice matrix", () => {
  test("an unknown row key and an alien column value are both flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrix", name: "m1", rows: ["quality", "price"], columns: [1, 2, 3],
        defaultValue: { quality: 5, speed: 1 },
      }],
    });
    expect(findings).toHaveLength(2);
    const reasons = findings.map(f => f.reason).sort();
    expect(reasons).toEqual(["defaultValue", "unknownRowKey"]);
  });
  test("a correctAnswer cell outside the columns is flagged with its own reason", () => {
    const findings = byRule({
      elements: [{
        type: "matrix", name: "m1", rows: ["quality"], columns: [1, 2, 3],
        correctAnswer: { quality: 9 },
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("correctAnswer");
  });
  test("a valid matrix defaultValue is clean", () => {
    expect(byRule({
      elements: [{
        type: "matrix", name: "m1", rows: ["quality", "price"], columns: [1, 2, 3],
        defaultValue: { quality: 1, price: 3 },
      }],
    })).toHaveLength(0);
  });
});

describe("composite defaultValue - matrixdropdown", () => {
  const columns = [{ name: "col1", cellType: "dropdown", choices: ["a", "b"] }];
  test("an alien cell value and an unknown column key are both flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdropdown", name: "m2", rows: ["r1"], columns: columns,
        defaultValue: { r1: { col1: "zzz", colX: "a" } },
      }],
    });
    expect(findings).toHaveLength(2);
    const reasons = findings.map(f => f.reason).sort();
    expect(reasons).toEqual(["defaultValue", "unknownColumnKey"]);
  });
  test("an unknown row key is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdropdown", name: "m2", rows: ["r1"], columns: columns,
        defaultValue: { rX: { col1: "a" } },
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownRowKey");
  });
  test("a valid matrixdropdown defaultValue is clean", () => {
    expect(byRule({
      elements: [{
        type: "matrixdropdown", name: "m2", rows: ["r1"], columns: columns,
        defaultValue: { r1: { col1: "a" } },
      }],
    })).toHaveLength(0);
  });
  test("a text column accepts any value", () => {
    expect(byRule({
      elements: [{
        type: "matrixdropdown", name: "m2", rows: ["r1"],
        columns: [{ name: "note", cellType: "text" }],
        defaultValue: { r1: { note: "anything" } },
      }],
    })).toHaveLength(0);
  });
});

describe("composite defaultValue - matrixdynamic", () => {
  const columns = [{ name: "col1", cellType: "dropdown", choices: ["a", "b"] }];
  test("an alien cell value and a column typo across rows are both flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m3", columns: columns,
        defaultValue: [{ col1: "zzz" }, { colTypo: "a" }],
      }],
    });
    expect(findings).toHaveLength(2);
    const reasons = findings.map(f => f.reason).sort();
    expect(reasons).toEqual(["defaultValue", "unknownColumnKey"]);
  });
  test("defaultRowValue is validated with its own reason", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m4", columns: columns,
        defaultRowValue: { col1: "zzz", colTypo: "a" },
      }],
    });
    expect(findings).toHaveLength(2);
    const reasons = findings.map(f => f.reason).sort();
    expect(reasons).toEqual(["defaultRowValue", "unknownColumnKey"]);
  });
  test("a valid defaultRowValue is clean", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m4", columns: columns,
        defaultRowValue: { col1: "a" },
      }],
    })).toHaveLength(0);
  });
});

describe("composite defaultValue - paneldynamic", () => {
  const template = [{ type: "dropdown", name: "q1", choices: ["x", "y"] }];
  test("an alien value and an unknown template question are both flagged", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p1", templateElements: template,
        defaultValue: [{ q1: "zzz", qTypo: "x" }],
      }],
    });
    expect(findings).toHaveLength(2);
    const reasons = findings.map(f => f.reason).sort();
    expect(reasons).toEqual(["defaultValue", "unknownQuestionKey"]);
  });
  test("defaultPanelValue is validated with its own reason", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p2", templateElements: template,
        defaultPanelValue: { q1: "zzz", qTypo: "x" },
      }],
    });
    expect(findings).toHaveLength(2);
    const reasons = findings.map(f => f.reason).sort();
    expect(reasons).toEqual(["defaultPanelValue", "unknownQuestionKey"]);
  });
  test("a comment key next to its question is allowed", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p3", templateElements: template,
        defaultPanelValue: { "q1": "x", "q1-Comment": "note" },
      }],
    })).toHaveLength(0);
  });
  test("a valueName of a template question is a valid key", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p4",
        templateElements: [{ type: "text", name: "q1", valueName: "v1" }],
        defaultPanelValue: { v1: "anything" },
      }],
    })).toHaveLength(0);
  });
  test("a question nested in a template panel is a valid key", () => {
    expect(byRule({
      elements: [{
        type: "paneldynamic", name: "p5",
        templateElements: [{ type: "panel", name: "inner", elements: [
          { type: "text", name: "q2" },
        ] }],
        defaultPanelValue: { q2: "anything" },
      }],
    })).toHaveLength(0);
  });
});

describe("composite values - shapes left alone", () => {
  test("a non-object composite defaultValue is not decomposed", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m5",
        columns: [{ name: "col1" }], defaultValue: "oops",
      }],
    })).toHaveLength(0);
  });
  test("defaultRowValue on a question without columns is ignored", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", defaultRowValue: { a: 1 } }],
    })).toHaveLength(0);
  });
});

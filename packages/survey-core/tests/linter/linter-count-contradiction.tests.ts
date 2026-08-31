import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "element/count-contradiction");
}

describe("element/count-contradiction - matrixdynamic", () => {
  test("minRowCount above maxRowCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        minRowCount: 5, maxRowCount: 3,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
    expect(findings[0].severity).toBe("warning");
  });
  test("rowCount above maxRowCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        rowCount: 10, maxRowCount: 3,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("countOutOfBounds");
  });
  test("rowCount below minRowCount is flagged", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        rowCount: 1, minRowCount: 3,
      }],
    })).toHaveLength(1);
  });
  test("a count checked against a default bound stays silent", () => {
    expect(byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c" }], rowCount: 500 },
        { type: "matrixdynamic", name: "m2", columns: [{ name: "c" }], minRowCount: 5 },
      ],
    })).toHaveLength(0);
  });
  test("a consistent authored triple is clean", () => {
    expect(byRule({
      elements: [{
        type: "matrixdynamic", name: "m1", columns: [{ name: "c" }],
        rowCount: 3, minRowCount: 1, maxRowCount: 5,
      }],
    })).toHaveLength(0);
  });
});

describe("element/count-contradiction - paneldynamic", () => {
  test("panelCount below minPanelCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "q" }],
        panelCount: 0, minPanelCount: 2,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("countOutOfBounds");
  });
  test("minPanelCount above maxPanelCount is flagged", () => {
    const findings = byRule({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [{ type: "text", name: "q" }],
        minPanelCount: 5, maxPanelCount: 2,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
  });
  test("count props on an unrelated question type are ignored", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", rowCount: 10, maxRowCount: 3 }],
    })).toHaveLength(0);
  });
});

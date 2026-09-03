import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";
import { withSettings } from "./lint-test-helpers";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "name/shadowing");
}

describe("name/shadowing - built-in variables", () => {
  test("a question named after a built-in variable is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "pageno" },
        { type: "text", name: "q2", visibleIf: "{pageno} > 1" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("builtInVariable");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].messageData.builtIn.toLowerCase()).toBe("pageno");
    expect(findings[0].messageData.nameKind).toBe("name");
  });
  test("a valueName shadowing a built-in variable is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", valueName: "locale" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.nameKind).toBe("valueName");
  });
  test("a calculated value shadowing a built-in variable is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "correctAnswers", expression: "1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.nameKind).toBe("calculatedValue");
  });
  test("a matrix column may carry the name - its scope resolves first", () => {
    expect(byRule({
      elements: [{ type: "matrixdynamic", name: "m1", columns: [{ name: "locale" }] }],
    })).toHaveLength(0);
  });
  test("ordinary names are clean", () => {
    expect(byRule({ elements: [{ type: "text", name: "page" }] })).toHaveLength(0);
  });
});

describe("name/shadowing - valueName over an element name", () => {
  test("a valueName equal to another question's name is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", valueName: "q2" }, { type: "comment", name: "q2" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("valueNameShadowsElement");
    expect(findings[0].messageData.otherName).toBe("q2");
    expect(findings[0].related.map(r => r.path).sort()).toEqual(["elements[0]", "elements[1]"]);
  });
  test("two questions deliberately sharing a valueName stay clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "shared" },
        { type: "text", name: "q2", valueName: "shared" },
      ],
    })).toHaveLength(0);
  });
  test("a valueName repeating the question's own name is clean", () => {
    expect(byRule({ elements: [{ type: "text", name: "q1", valueName: "q1" }] })).toHaveLength(0);
  });
  test("a shadowed question that has its own valueName writes elsewhere", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "q2" },
        { type: "text", name: "q2", valueName: "elsewhere" },
      ],
    })).toHaveLength(0);
  });
});

describe("name/shadowing - derived data keys", () => {
  test("a name colliding with a comment key is flagged", () => {
    const findings = byRule({
      elements: [
        { type: "text", name: "q1", showCommentArea: true },
        { type: "text", name: "q1-Comment" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("commentKeyCollision");
    expect(findings[0].messageData.base).toBe("q1");
  });
  test("the other-item comment counts as a comment writer", () => {
    expect(byRule({
      elements: [
        { type: "dropdown", name: "q1", choices: ["a"], showOtherItem: true },
        { type: "text", name: "q1-Comment" },
      ],
    })).toHaveLength(1);
  });
  test("a question that writes no comment leaves the key free", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1-Comment" }],
    })).toHaveLength(0);
  });
  test("a customized commentSuffix is honoured", () => {
    withSettings({ commentSuffix: "_note" }, () => {
      expect(byRule({
        elements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q1_note" },
        ],
      })).toHaveLength(1);
    });
  });
  test("a name colliding with a matrix totals key is flagged", () => {
    const findings = byRule({
      elements: [
        {
          type: "matrixdynamic", name: "m1",
          columns: [{ name: "c1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "text", name: "m1-total" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("totalKeyCollision");
    expect(findings[0].messageData.base).toBe("m1");
  });
  test("a matrix without totals leaves the key free", () => {
    expect(byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }] },
        { type: "text", name: "m1-total" },
      ],
    })).toHaveLength(0);
  });
  test("the collision is found through a valueName too", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", valueName: "shared", showCommentArea: true },
        { type: "text", name: "q2", valueName: "shared-Comment" },
      ],
    })).toHaveLength(1);
  });
});

describe("name/shadowing - a variable over a question", () => {
  test("a setvalue trigger writing a variable named after a question is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{
        type: "setvalue", expression: "{q2} = 1", setToName: "q1", setValue: "done", isVariable: true,
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("variableShadowsQuestion");
    expect(findings[0].path).toBe("triggers[0].setToName");
    expect(findings[0].messageData.name).toBe("q1");
  });
  test("a trigger writing the question value itself is clean", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }],
      triggers: [{ type: "setvalue", expression: "{q2} = 1", setToName: "q1", setValue: "done" }],
    })).toHaveLength(0);
  });
  test("a variable that names no question is clean", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q2" }],
      triggers: [{
        type: "setvalue", expression: "{q2} = 1", setToName: "flag", setValue: 1, isVariable: true,
      }],
    })).toHaveLength(0);
  });
});

describe("name/shadowing - configuration", () => {
  test("duplicate names stay with name/duplicate", () => {
    const result = lintSurvey({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q1" }],
    });
    expect(result.findings.filter(f => f.ruleId === "name/shadowing")).toHaveLength(0);
    expect(result.findings.filter(f => f.ruleId === "name/duplicate").length).toBeGreaterThan(0);
  });
  test("the rule can be switched off", () => {
    const result = lintSurvey(
      { elements: [{ type: "text", name: "locale" }] },
      { rules: { "name/shadowing": "off" } });
    expect(result.findings.filter(f => f.ruleId === "name/shadowing")).toHaveLength(0);
  });
});

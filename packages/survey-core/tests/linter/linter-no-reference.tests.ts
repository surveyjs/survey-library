import { describe, test, expect } from "vitest";
import { getRules, lintSurvey, ILintFinding, ISurveyLintOptions } from "../../src/linter/index";

const RULE_ID = "expression/no-reference";
const ON: ISurveyLintOptions = { rules: { [RULE_ID]: "warning" } };

function findingsOf(json: any, options: ISurveyLintOptions = ON, ruleId: string = RULE_ID): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => f.ruleId === ruleId);
}

// A question guarded by the condition under test, next to the questions a condition can read.
function guardedBy(condition: string): any {
  return {
    elements: [
      { type: "text", name: "age", inputType: "number" },
      { type: "text", name: "birthdate", inputType: "date" },
      { type: "text", name: "q", visibleIf: condition },
    ],
  };
}

describe("expression/no-reference", () => {
  test("is off by default: a lone constant switches an element off on purpose", () => {
    expect(getRules().filter(r => r.id === RULE_ID)).toEqual([{ id: RULE_ID, defaultSeverity: "off" }]);
    expect(findingsOf(guardedBy("false"), {})).toEqual([]);
    expect(findingsOf(guardedBy("today() > '2026-12-31'"), {})).toEqual([]);
  });
  test("a condition that reads no question or variable", () => {
    ["false", "true", "today() > '2026-12-31'"].forEach(condition => {
      const findings = findingsOf(guardedBy(condition));
      expect(findings, condition).toHaveLength(1);
      expect(findings[0].severity).toBe("warning");
      expect(findings[0].reason).toBe("noReference");
      expect(findings[0].path).toBe("elements[2].visibleIf");
      expect(findings[0].elementName).toBe("q");
      expect(findings[0].messageData).toEqual({ expression: condition, prop: "visibleIf", reason: "noReference" });
      expect(findings[0].message).toBe("The visibleIf \"" + condition + "\" does not read any question or variable.");
    });
  });
  test("the message makes no claim that the result never changes", () => {
    const findings = findingsOf(guardedBy("today() > '2026-12-31'"));
    expect(findings[0].message).not.toMatch(/always|never/);
  });
  test("a condition built from constants keeps its more specific warning, without a second one", () => {
    const all = lintSurvey(guardedBy("1 = 1"), ON).findings
      .filter(f => f.ruleId === RULE_ID || f.ruleId === "expression/meaningless-condition");
    expect(all.map(f => f.ruleId + "/" + f.reason)).toEqual(["expression/meaningless-condition/alwaysTrue"]);
    expect(all[0].severity).toBe("warning");
    expect(findingsOf(guardedBy("1 = 2"))).toEqual([]);
  });
  test("no warning for a condition that reads a question", () => {
    expect(findingsOf(guardedBy("{age} > 1"))).toEqual([]);
    expect(findingsOf(guardedBy("age({birthdate}) >= 18"))).toEqual([]);
    expect(findingsOf(guardedBy("{age} > 1 or true"))).toEqual([]);
  });
  test("no warning for a condition that reads a cell of the same row", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "items",
        columns: [
          { name: "quantity", cellType: "text", inputType: "number" },
          { name: "price", cellType: "text", inputType: "number", visibleIf: "{row.quantity} > 0" },
        ],
      }],
    };
    expect(findingsOf(json)).toEqual([]);
  });
  test("an element a function names as a string is read", () => {
    const json = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2", visibleIf: "isContainerReady('page1')" }] },
      ],
    };
    expect(findingsOf(json)).toEqual([]);
  });
  test("a variable is read", () => {
    const json = { elements: [{ type: "text", name: "q", visibleIf: "{tier} = 'gold'" }] };
    expect(findingsOf(json, { ...ON, knownVariables: ["tier"] })).toEqual([]);
  });
  test("conditions of triggers and of the survey are checked too", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "complete", expression: "true" }],
      completedHtmlOnCondition: [{ expression: "false", html: "x" }],
    };
    expect(findingsOf(json).map(f => f.path).sort()).toEqual(["completedHtmlOnCondition[0].expression", "triggers[0].expression"]);
  });
  test("a value expression may be a constant", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", defaultValueExpression: "1" },
        { type: "expression", name: "e1", expression: "today()" },
        { type: "expression", name: "e2", expression: "iif(true, 1, 2)" },
      ],
      calculatedValues: [{ name: "c1", expression: "1 + 1" }],
    };
    expect(findingsOf(json)).toEqual([]);
  });
});

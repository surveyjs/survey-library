import { describe, test, expect } from "vitest";
import { Model } from "survey-core";
import { lintSurvey } from "../../src/linter/index";

describe("inArray conditions match runtime item lookup", () => {
  ["matrixdynamic", "paneldynamic"].forEach(type => {
    test(type + " filters read bare item keys before survey values", () => {
      const container = type === "matrixdynamic"
        ? { type: type, name: "items", columns: [{ name: "amount", cellType: "text", inputType: "number" }] }
        : { type: type, name: "items", templateElements: [{ type: "text", name: "amount", inputType: "number" }] };
      const json: any = {
        elements: [
          container,
          { type: "text", name: "amount", inputType: "number", max: 0 },
          { type: "text", name: "threshold", inputType: "number" },
          { type: "expression", name: "total", expression: "sumInArray({items}, 'amount', '{amount} > {threshold}')" },
        ],
      };
      const survey = new Model(json);
      survey.data = { items: [{ amount: 3 }, { amount: -1 }], amount: -10, threshold: 0 };
      expect(survey.getValue("total")).toBe(3);
      expect(lintSurvey(json).findings).toHaveLength(0);
      json.elements[3].expression = "sumInArray({items}, 'amount', '{amount} > 0')";
      expect(lintSurvey(json).findings).toHaveLength(0);
      json.elements[1].name = "surveyAmount";
      expect(lintSurvey(json).findings).toHaveLength(0);
      json.elements[3].expression = "sumInArray({items}, 'amount', '{missing} > 0')";
      expect(lintSurvey(json).findings.filter(f => f.ruleId === "reference/unknown")).toHaveLength(1);
    });
  });

  test("a false filter does not make its question or page unreachable", () => {
    const json = {
      pages: [
        { name: "input", elements: [{ type: "matrixdynamic", name: "items", columns: [{ name: "amount", cellType: "text" }] }] },
        { name: "result", elements: [{ type: "text", name: "target", visibleIf: "sumInArray({items}, 'amount', '1 = 2') = 0" }] },
        { name: "next", elements: [{ type: "text", name: "dependent", visibleIf: "{target} notempty" }] },
      ],
    };
    const survey = new Model(json);
    survey.data = { items: [{ amount: 3 }], target: "answer" };
    expect(survey.getQuestionByName("target").isVisible).toBe(true);
    expect(survey.getPageByName("result").isVisible).toBe(true);
    expect(survey.getQuestionByName("dependent").isVisible).toBe(true);
    const findings = lintSurvey(json).findings;
    expect(findings.filter(f => f.ruleId === "page/empty" || f.ruleId === "element/never-visible")).toHaveLength(0);
    const contradictions = findings.filter(f => f.ruleId === "expression/contradiction");
    expect(contradictions).toHaveLength(1);
    expect(contradictions[0].path).toBe("pages[1].elements[0].visibleIf.inArray[0]");
    expect(contradictions[0].message).toContain("filter");
    expect(contradictions[0].message).not.toContain("never shown");
  });
});

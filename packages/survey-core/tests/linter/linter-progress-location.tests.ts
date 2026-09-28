import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "progress/incompatible-location");
}

const question = { elements: [{ type: "text", name: "q1" }] };

describe("progress/incompatible-location", () => {
  test("belowheader with an advanced header and question progress is flagged", () => {
    const findings = byRule({
      ...question,
      headerView: "advanced",
      showProgressBar: true,
      progressBarType: "questions",
      progressBarLocation: "belowheader",
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("belowHeader");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("progressBarLocation");
    expect(findings[0].messageData.progressBarType).toBe("questions");
    expect(findings[0].messageData.headerView).toBe("advanced");
    expect(findings[0].fix).toBeUndefined();
  });
  test("an undefined headerView is the advanced default", () => {
    const findings = byRule({
      ...question,
      showProgressBar: true,
      progressBarType: "requiredQuestions",
      progressBarLocation: "belowHeader",
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.headerView).toBe("advanced");
    expect(findings[0].messageData.location).toBe("belowHeader");
  });
  test("correct answers are flagged the same way", () => {
    expect(byRule({
      ...question,
      progressBarType: "correctQuestions",
      progressBarLocation: "belowheader",
    })).toHaveLength(1);
  });
  test("the legacy showProgressBar string is the location when none is written", () => {
    const findings = byRule({
      ...question,
      progressBarType: "questions",
      showProgressBar: "belowHeader",
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("showProgressBar");
  });
  test("an explicit location wins over the legacy string", () => {
    expect(byRule({
      ...question,
      progressBarType: "questions",
      showProgressBar: "belowheader",
      progressBarLocation: "bottom",
    })).toHaveLength(0);
  });
  test("pages progress stays compatible with an advanced header", () => {
    expect(byRule({
      ...question,
      headerView: "advanced",
      showProgressBar: true,
      progressBarType: "pages",
      progressBarLocation: "belowheader",
    })).toHaveLength(0);
  });
  test("a basic header stays compatible with question progress", () => {
    expect(byRule({
      ...question,
      headerView: "basic",
      showProgressBar: true,
      progressBarType: "questions",
      progressBarLocation: "belowheader",
    })).toHaveLength(0);
  });
  test("another location is not flagged", () => {
    expect(byRule({
      ...question,
      progressBarType: "questions",
      progressBarLocation: "aboveheader",
    })).toHaveLength(0);
  });
  test("the default progress type is pages, so a bare belowheader is clean", () => {
    expect(byRule({
      ...question,
      showProgressBar: true,
      progressBarLocation: "belowheader",
    })).toHaveLength(0);
  });
});

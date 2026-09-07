import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";

// "imagemap" registers only in the Serializer (no ElementFactory entry), but
// ElementFactory.createElement falls back to Serializer classes, so surveys with
// it load and run at runtime - including visibleIf/enableIf on its areas, which
// ItemValue.runConditionsForItems evaluates.
describe("imagemap questions", () => {
  test("imagemap is a known question type", () => {
    const res = lintSurvey({ elements: [{ type: "imagemap", name: "q1" }] });
    expect(res.findings.filter(f => f.ruleId === "element/unknown-type")).toHaveLength(0);
  });
  test("broken area conditions are reported", () => {
    const res = lintSurvey({
      elements: [{
        type: "imagemap",
        name: "q1",
        areas: [{ value: "a", visibleIf: "{typo} = 1" }],
      }],
    });
    const unknown = res.findings.filter(f => f.ruleId === "reference/unknown");
    expect(unknown).toHaveLength(1);
    expect(unknown[0].path).toContain("areas[0]");
  });
  test("valid area conditions are clean", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "q0" },
        { type: "imagemap", name: "q1", areas: [{ value: "a", visibleIf: "{q0} notempty" }] },
      ],
    });
    expect(res.findings).toHaveLength(0);
  });
});

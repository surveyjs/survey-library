import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === "mask/mismatch");
}

describe("mask/mismatch - the mask type", () => {
  test("an unknown maskType is flagged with a suggestion", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", maskType: "datetim", maskSettings: { pattern: "m/d/y" } }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownMaskType");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].suggestion).toBe("datetime");
    expect(findings[0].path).toBe("elements[0].maskType");
  });
  test("settings keys are not judged while the type itself is unknown", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", maskType: "nosuch", maskSettings: { precision: 2 } }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownMaskType");
  });
  test("every registered mask type is clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1", maskType: "pattern", maskSettings: { pattern: "99-99" } },
        { type: "text", name: "q2", maskType: "numeric", maskSettings: { precision: 2 } },
        { type: "text", name: "q3", maskType: "currency", maskSettings: { prefix: "$ " } },
        {
          type: "text", name: "q4", maskType: "datetime",
          maskSettings: { pattern: "mm/dd/yyyy", min: "2020-01-01" },
        },
      ],
    })).toHaveLength(0);
  });
});

describe("mask/mismatch - the settings object", () => {
  test("a key of another mask class is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", maskType: "numeric", maskSettings: { pattern: "9999" } }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownSettingsKey");
    expect(findings[0].messageData.key).toBe("pattern");
    expect(findings[0].path).toBe("elements[0].maskSettings.pattern");
  });
  test("a misspelled key carries a suggestion", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", maskType: "numeric", maskSettings: { precission: 2 } }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("precision");
  });
  test("settings without a mask type keep only saveMaskedValue", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", maskSettings: { precision: 2, min: 0 } }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("settingsWithoutMask");
    expect(findings[0].messageData.keys.sort()).toEqual(["min", "precision"]);
  });
  test("saveMaskedValue alone is legal without a mask type", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", maskSettings: { saveMaskedValue: true } }],
    })).toHaveLength(0);
  });
  test("the key order does not decide the class", () => {
    const findings = byRule({
      elements: [{
        type: "multipletext", name: "mt1",
        items: [{ name: "i1", maskSettings: { pattern: "99" }, maskType: "numeric" }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownSettingsKey");
  });
});

describe("mask/mismatch - a mask that never applies", () => {
  test("a mask outside the text and tel inputTypes is inert", () => {
    const findings = byRule({
      elements: [{
        type: "text", name: "q1", inputType: "number", maskType: "numeric",
        maskSettings: { precision: 2 },
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("maskInertForInputType");
    expect(findings[0].messageData.inputType).toBe("number");
  });
  test("tel keeps its mask", () => {
    expect(byRule({
      elements: [{
        type: "text", name: "q1", inputType: "tel", maskType: "pattern",
        maskSettings: { pattern: "+9 (999) 999-99-99" },
      }],
    })).toHaveLength(0);
  });
  test("datetime bounds without a pattern are inert", () => {
    const findings = byRule({
      elements: [{
        type: "text", name: "q1", maskType: "datetime",
        maskSettings: { min: "2020-01-01", max: "2025-12-31" },
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minMaxWithoutPattern");
  });
  test("a numeric mask with min above max is flagged", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1", maskType: "numeric", maskSettings: { min: 100, max: 10 } }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("minAboveMax");
  });
  test("a currency mask inherits the numeric bounds check", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", maskType: "currency", maskSettings: { min: 100, max: 10 } }],
    })).toHaveLength(1);
  });
  test("a consistent numeric mask is clean", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", maskType: "numeric", maskSettings: { min: 0, max: 100 } }],
    })).toHaveLength(0);
  });
});

describe("mask/mismatch - ownership", () => {
  test("a matrix column with a text cell carries a mask", () => {
    const findings = byRule({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "c1", cellType: "text", maskType: "numeric", maskSettings: { pattern: "9" } }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].columns[0].maskSettings.pattern");
  });
  test("property/unknown stays out of maskSettings", () => {
    const result = lintSurvey({
      elements: [{ type: "text", name: "q1", maskType: "numeric", maskSettings: { pattern: "9999" } }],
    });
    expect(result.findings.filter(f => f.ruleId === "property/unknown")).toHaveLength(0);
    expect(result.findings.filter(f => f.ruleId === "mask/mismatch")).toHaveLength(1);
  });
});

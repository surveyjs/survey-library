import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";
import { ILintFinding } from "../../src/linter/types";

// The runtime resolves {q1-Comment}: setComment stores the value under
// name + settings.commentSuffix in the values hash, and getFilteredValues exposes
// every hash key to expressions. Matrix totals live under
// getValueName() + settings.matrix.totalsSuffix - both suffixes are configurable.
const unknownRefs = (findings: Array<ILintFinding>) =>
  findings.filter(f => f.ruleId === "reference/unknown");

describe("comment and total suffix references", () => {
  test("{q1-Comment} resolves for an existing question", () => {
    const res = lintSurvey({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a", "b"], showCommentArea: true },
        { type: "text", name: "q2", visibleIf: "{q1-Comment} notempty" },
      ],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("comment ref is a plain string: no type/choice findings against the base question", () => {
    const res = lintSurvey({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{q1-Comment} = 'hello'" },
      ],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("{v1-Comment} resolves through valueName", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "q1", valueName: "v1" },
        { type: "text", name: "q2", visibleIf: "{v1-Comment} notempty" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("comment ref for a missing question is still reported", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{nope-Comment} notempty" }],
    });
    expect(unknownRefs(res.findings)).toHaveLength(1);
  });
  test("custom commentSuffix via options.settings", () => {
    const json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1-Note} notempty" },
        { type: "text", name: "q3", visibleIf: "{q1-Comment} notempty" },
      ],
    };
    const byDefault = lintSurvey(json);
    expect(unknownRefs(byDefault.findings)).toHaveLength(1); // only {q1-Note}
    const res = lintSurvey(json, { settings: { commentSuffix: "-Note" } });
    const unknown = unknownRefs(res.findings);
    expect(unknown).toHaveLength(1); // only {q1-Comment}
    expect(unknown[0].messageData.name).toBe("q1-Comment");
  });
  test("default -total suffix keeps working", () => {
    const res = lintSurvey({
      elements: [
        { type: "matrixdynamic", name: "m", columns: [{ name: "col1" }] },
        { type: "text", name: "q2", visibleIf: "{m-total.col1} > 0" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("custom matrix totalsSuffix via options.settings", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m", columns: [{ name: "col1" }] },
        { type: "text", name: "q2", visibleIf: "{m_sum.col1} > 0" },
        { type: "text", name: "q3", visibleIf: "{m-total.col1} > 0" },
      ],
    };
    const byDefault = lintSurvey(json);
    expect(unknownRefs(byDefault.findings)).toHaveLength(1); // only {m_sum.col1}
    const res = lintSurvey(json, { settings: { matrix: { totalsSuffix: "_sum" } } });
    const unknown = unknownRefs(res.findings);
    expect(unknown).toHaveLength(1); // only {m-total.col1}
    expect(unknown[0].messageData.name).toBe("m-total.col1");
  });
  test("column sub-path is still validated after a custom totals suffix", () => {
    const res = lintSurvey({
      elements: [
        { type: "matrixdynamic", name: "m", columns: [{ name: "col1" }] },
        { type: "text", name: "q2", visibleIf: "{m_sum.col2} > 0" },
      ],
    }, { settings: { matrix: { totalsSuffix: "_sum" } } });
    const unknown = unknownRefs(res.findings);
    expect(unknown).toHaveLength(1);
    expect(unknown[0].suggestion).toBe("col1");
  });
});

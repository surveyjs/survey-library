import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";
import { ILintFinding } from "../../src/linter/types";

// The runtime resolver supports question names that themselves contain dots:
// ValueGetterContextCore.checkValueByPath re-joins progressively longer dotted
// prefixes and tries the LONGEST first (isSearchNameRevert). See the runtime
// regression tests "visibleIf, allow dot in question name" in surveytests.ts.
// The linter must mirror that instead of always resolving segments[0].
const unknownRefs = (findings: Array<ILintFinding>) =>
  findings.filter(f => f.ruleId === "reference/unknown");

describe("dotted names in references", () => {
  test("reference to a question whose name contains a dot resolves", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "address.city" },
        { type: "text", name: "q2", visibleIf: "{address.city} notempty" },
      ],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("deeply dotted question name resolves", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "q1.1.2.3" },
        { type: "text", name: "q2", visibleIf: "{q1.1.2.3} = 'a'" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("longest registered name wins over first segment plus sub-path", () => {
    const res = lintSurvey({
      elements: [
        { type: "multipletext", name: "address", items: [{ name: "street" }] },
        { type: "text", name: "address.city" },
        { type: "text", name: "q2", visibleIf: "{address.city} notempty" },
        { type: "text", name: "q3", visibleIf: "{address.street} notempty" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("dotted valueName resolves", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "q1", valueName: "person.age" },
        { type: "text", name: "q2", visibleIf: "{person.age} > 18" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("dotted calculated value name resolves", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{totals.sum} > 0" },
      ],
      calculatedValues: [{ name: "totals.sum", expression: "{q1} * 2" }],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("dotted known variable resolves", () => {
    const res = lintSurvey(
      { elements: [{ type: "text", name: "q1", visibleIf: "{user.role} = 'admin'" }] },
      { knownVariables: ["user.role"] });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("indexed access after a dotted root: {a.b[0].inner}", () => {
    const res = lintSurvey({
      elements: [
        { type: "paneldynamic", name: "a.b", templateElements: [{ type: "text", name: "inner" }] },
        { type: "text", name: "q2", visibleIf: "{a.b[0].inner} notempty" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("sub-path validation still applies after the dotted root", () => {
    const res = lintSurvey({
      elements: [
        { type: "paneldynamic", name: "a.b", templateElements: [{ type: "text", name: "inner" }] },
        { type: "text", name: "q2", visibleIf: "{a.b[0].iner} notempty" },
      ],
    });
    const unknown = unknownRefs(res.findings);
    expect(unknown).toHaveLength(1);
    expect(unknown[0].suggestion).toBe("inner");
  });
  test("an index inside the dotted prefix is a sub-path walk, not part of a name", () => {
    // {a[0].b} must not resolve to a question literally named "a.b"
    const res = lintSurvey({
      elements: [
        { type: "text", name: "a.b" },
        { type: "text", name: "q2", visibleIf: "{a[0].b} notempty" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(1);
  });
  test("trailing .length works on a dotted name", () => {
    const res = lintSurvey({
      elements: [
        { type: "checkbox", name: "a.b", choices: ["x", "y"] },
        { type: "text", name: "q2", visibleIf: "{a.b.length} > 0" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("genuinely unknown dotted reference is reported with a full-name suggestion", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "address.city" },
        { type: "text", name: "q2", visibleIf: "{address.cty} notempty" },
      ],
    });
    const unknown = unknownRefs(res.findings);
    expect(unknown).toHaveLength(1);
    expect(unknown[0].suggestion).toBe("address.city");
  });
  test("panel-scoped inner names with dots resolve", () => {
    const res = lintSurvey({
      elements: [{
        type: "paneldynamic",
        name: "pd",
        templateElements: [
          { type: "text", name: "x.y" },
          { type: "text", name: "other", visibleIf: "{panel.x.y} notempty" },
        ],
      }],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("row-scoped column names with dots resolve", () => {
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic",
        name: "m",
        columns: [
          { name: "col.a" },
          { name: "other", visibleIf: "{row.col.a} notempty" },
        ],
      }],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
});

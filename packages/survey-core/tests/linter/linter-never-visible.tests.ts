import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, ruleId = "element/never-visible"): Array<ILintFinding> {
  return lintSurvey(json).findings.filter(f => f.ruleId === ruleId);
}

const dead = { type: "text", name: "q9", visibleIf: "1 = 2" };

describe("element/never-visible - the cascade", () => {
  test("a condition requiring a value of a never-visible question is dead", () => {
    const findings = byRule({
      elements: [
        dead,
        { type: "text", name: "q10", visibleIf: "{q9} = 'yes'" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("dependsOnDeadValue");
    expect(findings[0].elementName).toBe("q10");
    expect(findings[0].related[0].elementName).toBe("q9");
  });
  test("the cascade runs down a chain", () => {
    const findings = byRule({
      elements: [
        dead,
        { type: "text", name: "q10", visibleIf: "{q9} = 'yes'" },
        { type: "text", name: "q11", visibleIf: "{q10} notempty" },
      ],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.elementName).sort()).toEqual(["q10", "q11"]);
  });
  test("the element with the contradictory visibleIf itself is not re-reported", () => {
    const findings = byRule({ elements: [dead] });
    expect(findings).toHaveLength(0);
  });
  test("a question inside a never-visible panel is a dead dependency too", () => {
    const findings = byRule({
      elements: [
        { type: "panel", name: "p1", visibleIf: "1 = 2", elements: [
          { type: "text", name: "qIn" },
        ] },
        { type: "text", name: "q10", visibleIf: "{qIn} = 'yes'" },
      ],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].elementName).toBe("q10");
  });
  test("a cascade-dead page is empty for page/empty", () => {
    const findings = byRule({
      pages: [
        { name: "p1", elements: [dead] },
        { name: "p2", elements: [{ type: "text", name: "q10", visibleIf: "{q9} = 'yes'" }] },
      ],
    }, "page/empty");
    // p1: its only question hides itself; p2: its only question dies through the cascade
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.elementName).sort()).toEqual(["p1", "p2"]);
    findings.forEach(f => expect(f.reason).toBe("noRenderableElements"));
  });
});

describe("element/never-visible - what stops the cascade", () => {
  const guarded = { type: "text", name: "q10", visibleIf: "{q9} = 'yes'" };
  test("an empty check on a dead question holds, so nothing is dead", () => {
    expect(byRule({
      elements: [
        dead,
        { type: "text", name: "q10", visibleIf: "{q9} empty" },
      ],
    })).toHaveLength(0);
  });
  test("a defaultValue keeps the dead question's value alive", () => {
    expect(byRule({
      elements: [{ ...dead, defaultValue: "yes" }, guarded],
    })).toHaveLength(0);
  });
  test("a defaultValueExpression keeps the value alive", () => {
    expect(byRule({
      elements: [{ ...dead, defaultValueExpression: "'yes'" }, guarded],
    })).toHaveLength(0);
  });
  test("a trigger target keeps the value alive", () => {
    expect(byRule({
      elements: [dead, guarded, { type: "text", name: "x" }],
      triggers: [{ type: "setvalue", expression: "{x} notempty", setToName: "q9", setValue: "yes" }],
    })).toHaveLength(0);
  });
  test("a bindings source keeps the value alive", () => {
    expect(byRule({
      elements: [
        dead, guarded,
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c" }], bindings: { rowCount: "q9" } },
      ],
    })).toHaveLength(0);
  });
  test("an ambiguous name is not reasoned about", () => {
    expect(byRule({
      elements: [dead, { type: "text", name: "q9" }, guarded],
    })).toHaveLength(0);
  });
  test("an expression question computes its value even when invisible", () => {
    expect(byRule({
      elements: [
        { type: "expression", name: "q9", expression: "1 + 1", visibleIf: "1 = 2" },
        guarded,
      ],
    })).toHaveLength(0);
  });
  test("an or-branch on a live question keeps the condition undecided", () => {
    expect(byRule({
      elements: [
        dead,
        { type: "text", name: "other" },
        { type: "text", name: "q10", visibleIf: "{q9} = 'yes' or {other} = 1" },
      ],
    })).toHaveLength(0);
  });
  test("a statically hidden question is not a cascade source", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q9", visible: false },
        guarded,
      ],
    })).toHaveLength(0);
  });
});

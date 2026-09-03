import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function findingsOf(json: any, ruleId?: string): Array<ILintFinding> {
  const all = lintSurvey(json).findings;
  return ruleId ? all.filter(f => f.ruleId === ruleId) : all;
}

// Two plain questions and a dropdown, so a condition can contradict itself in several ways.
function guardedBy(condition: string): any {
  return {
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "text", name: "guarded", visibleIf: condition },
    ],
  };
}

function verdictOf(condition: string): string | undefined {
  const findings = findingsOf(guardedBy(condition)).filter(f =>
    f.ruleId === "expression/contradiction" || f.ruleId === "expression/meaningless-condition");
  if (findings.length === 0) return undefined;
  expect(findings).toHaveLength(1);
  return findings[0].ruleId + "/" + findings[0].reason;
}

describe("one reference asked for two things at once", () => {
  test("two different values", () => {
    expect(verdictOf("{q1} = 'a' and {q1} = 'b'"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("a value and its negation", () => {
    expect(verdictOf("{q1} = 'a' and {q1} <> 'a'"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("empty and not empty", () => {
    expect(verdictOf("{q1} empty and {q1} notempty"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("empty and a concrete value", () => {
    expect(verdictOf("{q1} empty and {q1} = 'a'"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("the contradiction is found through a chain of ands", () => {
    expect(verdictOf("{q2} notempty and {q1} = 'a' and {q1} = 'b'"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("the name is matched case-insensitively, like the runtime does", () => {
    expect(verdictOf("{q1} = 'a' and {Q1} = 'b'"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("the finding names the reference and the values it cannot hold at once", () => {
    const findings = findingsOf(guardedBy("{q1} = 'a' and {q1} = 'b'"), "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.conflicts).toEqual([
      { name: "q1", kind: "equalValues", values: ["a", "b"] },
    ]);
    expect(findings[0].message).toContain("q1");
  });
});

describe("what is not a contradiction", () => {
  test("the same requirement twice", () => {
    expect(verdictOf("{q1} = 'a' and {q1} = 'a'")).toBeUndefined();
  });
  test("two different references", () => {
    expect(verdictOf("{q1} = 'a' and {q2} = 'b'")).toBeUndefined();
  });
  test("alternatives, not requirements", () => {
    expect(verdictOf("{q1} = 'a' or {q1} = 'b'")).toBeUndefined();
  });
  test("a branch of an or is only asked about on its own", () => {
    expect(verdictOf("{q2} notempty and ({q1} = 'a' or {q1} = 'b')")).toBeUndefined();
  });
  test("a tautology is left alone - an unanswered question makes both sides false", () => {
    expect(verdictOf("{q1} = 'a' or {q1} <> 'a'")).toBeUndefined();
  });
  test("notempty next to a value is consistent", () => {
    expect(verdictOf("{q1} notempty and {q1} = 'a'")).toBeUndefined();
  });
  test("two negations are consistent", () => {
    expect(verdictOf("{q1} <> 'a' and {q1} <> 'b'")).toBeUndefined();
  });
  test("values that compare equal at runtime are one requirement", () => {
    expect(verdictOf("{q1} = 1 and {q1} = '1'")).toBeUndefined();
  });
  test("different rows of one matrix are different references", () => {
    const findings = findingsOf({
      elements: [
        { type: "matrix", name: "m", rows: ["r1", "r2"], columns: ["c1", "c2"] },
        { type: "text", name: "guarded", visibleIf: "{m.r1} = 'c1' and {m.r2} = 'c2'" },
      ],
    }, "expression/contradiction");
    expect(findings).toHaveLength(0);
  });
  test("an unresolved reference is left to reference/unknown", () => {
    expect(verdictOf("{nope} = 'a' and {nope} = 'b'")).toBeUndefined();
  });
});

describe("bounds a condition puts on one reference itself", () => {
  test("two bounds that leave nothing between them", () => {
    expect(verdictOf("{q1} > 10 and {q1} < 5"))
      .toBe("expression/contradiction/unsatisfiable");
    expect(verdictOf("{q1} > 10 and {q1} <= 10"))
      .toBe("expression/contradiction/unsatisfiable");
    expect(verdictOf("{q1} >= 5 and {q1} < 5"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("a value outside a bound the same condition demands", () => {
    expect(verdictOf("{q1} = 3 and {q1} > 5"))
      .toBe("expression/contradiction/unsatisfiable");
    expect(verdictOf("{q1} = 3 and {q1} >= 3")).toBeUndefined();
  });
  test("the sides may be written either way round", () => {
    expect(verdictOf("10 < {q1} and 5 > {q1}"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("bounds that do leave room", () => {
    expect(verdictOf("{q1} > 5 and {q1} < 10")).toBeUndefined();
    expect(verdictOf("{q1} > 5 and {q1} > 10")).toBeUndefined();
    expect(verdictOf("{q1} >= 5 and {q1} <= 5")).toBeUndefined();
  });
  test("the finding names the bounds that clash", () => {
    const findings = findingsOf(guardedBy("{q1} > 10 and {q1} < 5"), "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.conflicts).toEqual([
      { name: "q1", kind: "impossibleBounds", values: [10, 5] },
    ]);
    expect(findings[0].message).toContain("above 10 and below 5");
  });
});

describe("a comparison against an empty set", () => {
  test("anyof of nothing can never hold", () => {
    expect(verdictOf("{q1} anyof []")).toBe("expression/contradiction/unsatisfiable");
  });
  test("it is found inside a branch too", () => {
    expect(verdictOf("{q2} notempty and {q1} anyof []"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("a non-empty set is a normal comparison", () => {
    expect(verdictOf("{q1} anyof ['a', 'b']")).toBeUndefined();
  });
  test("the finding says which reference was asked for nothing", () => {
    const findings = findingsOf(guardedBy("{q1} anyof []"), "expression/contradiction");
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.conflicts).toEqual([{ name: "q1", kind: "emptySet" }]);
    expect(findings[0].message).toContain("no value at all");
  });
});

describe("the bounds of a question and the ones a condition states work together", () => {
  function withBounded(condition: string): any {
    return {
      elements: [
        { type: "text", name: "age", inputType: "number", min: 1, max: 5 },
        { type: "text", name: "q2" },
        { type: "text", name: "guarded", visibleIf: condition },
      ],
    };
  }
  function boundedVerdictOf(condition: string): string | undefined {
    const findings = findingsOf(withBounded(condition)).filter(f =>
      f.ruleId === "expression/contradiction" || f.ruleId === "expression/meaningless-condition");
    if (findings.length === 0) return undefined;
    expect(findings).toHaveLength(1);
    return findings[0].ruleId + "/" + findings[0].reason;
  }
  test("a conjunct the question bounds rule out sinks the condition", () => {
    // no pair of conjuncts contradicts the other; the question is what rules one of them out
    expect(boundedVerdictOf("{age} > 3 and {age} > 10"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("a conjunct outside the bounds is reported as such, not as a self-contradiction", () => {
    expect(boundedVerdictOf("{q2} notempty and {age} = 7"))
      .toBe("expression/contradiction/outOfRange");
  });
  test("conjuncts that contradict each other inside the bounds are still reported", () => {
    expect(boundedVerdictOf("{age} > 4 and {age} < 2"))
      .toBe("expression/contradiction/unsatisfiable");
  });
  test("a condition the bounds allow is left alone", () => {
    expect(boundedVerdictOf("{age} > 2 and {age} < 5")).toBeUndefined();
  });
});

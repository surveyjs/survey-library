import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function findingsOf(json: any, ruleId?: string): Array<ILintFinding> {
  const all = lintSurvey(json).findings;
  return ruleId ? all.filter(f => f.ruleId === ruleId) : all;
}

function notAChoiceOf(json: any): Array<ILintFinding> {
  return findingsOf(json, "value/not-a-choice");
}

describe("a value the author wrote next to the question", () => {
  test("a defaultValue outside the choices", () => {
    const findings = notAChoiceOf({
      elements: [{ type: "dropdown", name: "q1", choices: ["a", "b"], defaultValue: "z" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("defaultValue");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("elements[0].defaultValue");
    expect(findings[0].elementName).toBe("q1");
    expect(findings[0].messageData.values).toEqual(["z"]);
    expect(findings[0].messageData.available).toEqual(["a", "b"]);
  });
  test("a correctAnswer outside the choices", () => {
    const findings = notAChoiceOf({
      elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b"], correctAnswer: "z" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("correctAnswer");
    expect(findings[0].path).toBe("elements[0].correctAnswer");
  });
  test("a multi-select value is checked item by item", () => {
    const findings = notAChoiceOf({
      elements: [{ type: "checkbox", name: "q1", choices: ["a", "b"], defaultValue: ["a", "z"] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.values).toEqual(["z"]);
  });
  test("a value among the choices is fine", () => {
    expect(notAChoiceOf({
      elements: [{ type: "dropdown", name: "q1", choices: ["a", "b"], defaultValue: "a" }],
    })).toHaveLength(0);
  });
  test("the special items count as choices", () => {
    expect(notAChoiceOf({
      elements: [{ type: "radiogroup", name: "q1", choices: ["a"], showOtherItem: true, defaultValue: "other" }],
    })).toHaveLength(0);
  });
  test("the domains added for conditions apply here too", () => {
    expect(notAChoiceOf({
      elements: [{ type: "rating", name: "r", rateValues: [1, 2, 3], defaultValue: 11 }],
    })).toHaveLength(1);
    expect(notAChoiceOf({
      elements: [{ type: "boolean", name: "b", valueTrue: "yes", valueFalse: "no", defaultValue: "maybe" }],
    })).toHaveLength(1);
  });
});

describe("a value a trigger writes", () => {
  test("setValue outside the choices of its target", () => {
    const findings = notAChoiceOf({
      elements: [{ type: "text", name: "q1" }, { type: "dropdown", name: "q2", choices: ["a", "b"] }],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "q2", setValue: "z" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("triggerSetValue");
    expect(findings[0].path).toBe("triggers[0].setValue");
    expect(findings[0].messageData.values).toEqual(["z"]);
  });
  test("a matrix cell target is resolved to its column", () => {
    const findings = notAChoiceOf({
      elements: [
        { type: "text", name: "q1" },
        { type: "matrixdynamic", name: "m", columns: [{ name: "col1", cellType: "dropdown", choices: ["a"] }] },
      ],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "m[0].col1", setValue: "z" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.values).toEqual(["z"]);
  });
  test("a setValue the target can hold is fine", () => {
    expect(notAChoiceOf({
      elements: [{ type: "text", name: "q1" }, { type: "dropdown", name: "q2", choices: ["a", "b"] }],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "q2", setValue: "a" }],
    })).toHaveLength(0);
  });
  test("a missing target is left to trigger/unknown-target", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} notempty", setToName: "nope", setValue: "z" }],
    };
    expect(notAChoiceOf(json)).toHaveLength(0);
    expect(findingsOf(json, "trigger/unknown-target")).toHaveLength(1);
  });
});

describe("what this rule stays out of", () => {
  test("a question whose choices the JSON does not list", () => {
    expect(notAChoiceOf({
      elements: [{ type: "dropdown", name: "q1", choicesByUrl: { url: "https://x/y" }, defaultValue: "z" }],
    })).toHaveLength(0);
  });
  test("an empty or boolean value proves nothing", () => {
    expect(notAChoiceOf({
      elements: [{ type: "dropdown", name: "q1", choices: ["a"], defaultValue: "" }],
    })).toHaveLength(0);
    expect(notAChoiceOf({
      elements: [{ type: "dropdown", name: "q1", choices: ["a"], defaultValue: true }],
    })).toHaveLength(0);
  });
  test("a question with no modelled set of values", () => {
    expect(notAChoiceOf({
      elements: [{ type: "text", name: "q1", defaultValue: "anything" }],
    })).toHaveLength(0);
  });
});

describe("value/not-a-choice - copyvalue compatibility", () => {
  test("copying a multi-select array into a single-value question is flagged", () => {
    const findings = findingsOf({
      elements: [
        { type: "checkbox", name: "tags", choices: ["a", "b"] },
        { type: "dropdown", name: "city", choices: ["msk", "spb"] },
      ],
      triggers: [{ type: "copyvalue", expression: "{tags} notempty", fromName: "tags", setToName: "city" }],
    }, "value/not-a-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("copyValueShape");
  });
  test("copying between disjoint choice sets is flagged", () => {
    const findings = findingsOf({
      elements: [
        { type: "dropdown", name: "src", choices: ["a", "b"] },
        { type: "dropdown", name: "dst", choices: ["x", "y"] },
      ],
      triggers: [{ type: "copyvalue", expression: "{src} notempty", fromName: "src", setToName: "dst" }],
    }, "value/not-a-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("copyValueNoOverlap");
  });
  test("disjoint multi-select sets are flagged too", () => {
    const findings = findingsOf({
      elements: [
        { type: "checkbox", name: "src", choices: ["a", "b"] },
        { type: "checkbox", name: "dst", choices: ["x", "y"] },
      ],
      triggers: [{ type: "copyvalue", expression: "{src} notempty", fromName: "src", setToName: "dst" }],
    }, "value/not-a-choice");
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("copyValueNoOverlap");
  });
  test("an overlapping value keeps the copy legitimate", () => {
    expect(findingsOf({
      elements: [
        { type: "dropdown", name: "src", choices: ["a", "b"] },
        { type: "dropdown", name: "dst", choices: ["a", "c"] },
      ],
      triggers: [{ type: "copyvalue", expression: "{src} notempty", fromName: "src", setToName: "dst" }],
    }, "value/not-a-choice")).toHaveLength(0);
  });
  test("a source without a known domain stays undecided", () => {
    expect(findingsOf({
      elements: [
        { type: "text", name: "src" },
        { type: "dropdown", name: "dst", choices: ["a", "b"] },
      ],
      triggers: [{ type: "copyvalue", expression: "{src} notempty", fromName: "src", setToName: "dst" }],
    }, "value/not-a-choice")).toHaveLength(0);
  });
  test("unresolved names are trigger/unknown-target territory", () => {
    expect(findingsOf({
      elements: [{ type: "dropdown", name: "dst", choices: ["a"] }],
      triggers: [{ type: "copyvalue", expression: "{dst} empty", fromName: "nosuch", setToName: "dst" }],
    }, "value/not-a-choice")).toHaveLength(0);
  });
});

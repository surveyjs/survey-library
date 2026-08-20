import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, options?: any): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => f.ruleId === "trigger/unknown-target");
}

describe("trigger/unknown-target", () => {
  test("setvalue setToName to a missing question is an error with reproduction", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "q2", setValue: "x" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("error");
    expect(findings[0].path).toBe("triggers[0].setToName");
    expect(findings[0].suggestion).toBe("q1");
    expect(findings[0].reproduction.steps[0]).toEqual({ set: { q1: 1 } });
  });
  test("knownVariables silences setToName", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "myVar", setValue: "x" }],
    }, { knownVariables: ["myVar"] })).toHaveLength(0);
  });
  test("calculated value names are valid targets", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "cv1", expression: "1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "cv1", setValue: "x" }],
    })).toHaveLength(0);
  });
  test("copyvalue validates both setToName and fromName", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "copyvalue", expression: "{q1} = 1", setToName: "missing1", fromName: "missing2" }],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.path).sort()).toEqual(["triggers[0].fromName", "triggers[0].setToName"]);
  });
  test("skip gotoName must be a question, not a panel", () => {
    const findings = byRule({
      elements: [
        { type: "panel", name: "p1", elements: [{ type: "text", name: "q1" }] },
      ],
      triggers: [{ type: "skip", expression: "{q1} = 1", gotoName: "p1" }],
    });
    expect(findings).toHaveLength(1);
  });
  test("skip gotoName to an existing question is clean", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
      triggers: [{ type: "skip", expression: "{q1} = 1", gotoName: "q2" }],
    })).toHaveLength(0);
  });
  test("visible trigger validates pages and questions arrays", () => {
    const findings = byRule({
      pages: [{ name: "page1", elements: [{ type: "text", name: "q1" }] }],
      triggers: [{
        type: "visible", expression: "{q1} = 1",
        pages: ["page1", "page9"], questions: ["q1", "q9"],
      }],
    });
    expect(findings).toHaveLength(2);
    expect(findings.map(f => f.path).sort()).toEqual(["triggers[0].pages[1]", "triggers[0].questions[1]"]);
  });
  test("indexed setToName into a dynamic panel validates the inner name", () => {
    const base = {
      elements: [
        { type: "paneldynamic", name: "panel1", templateElements: [{ type: "text", name: "inner" }] },
        { type: "text", name: "src" },
      ],
      triggers: [{
        type: "copyvalue", expression: "{src} notempty",
        setToName: "panel1[0].inner", fromName: "src",
      }],
    };
    expect(byRule(base)).toHaveLength(0);
    const bad = JSON.parse(JSON.stringify(base));
    bad.triggers[0].setToName = "panel1[0].innr";
    const findings = byRule(bad);
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("inner");
  });
  test("indexed setToName into a matrixdynamic validates the column", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "col1" }] },
        { type: "text", name: "src" },
      ],
      triggers: [{
        type: "copyvalue", expression: "{src} notempty",
        setToName: "m1[0].col9", fromName: "src",
      }],
    });
    expect(findings).toHaveLength(1);
  });
  test("legacy trigger with 'trigger' suffix in type is normalized", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvaluetrigger", expression: "{q1} = 1", setToName: "missing", setValue: 1 }],
    });
    expect(findings).toHaveLength(1);
  });
  test("valueName is a valid target", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", valueName: "income" },
      ],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "income", setValue: 5 }],
    })).toHaveLength(0);
  });
});

describe("trigger/unknown-type", () => {
  // an unrecognized trigger type used to be silently half-processed: only its
  // expression was scanned, while targets and cycle detection skipped it
  test("a misspelled trigger type is reported with a suggestion", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1" }],
      triggers: [
        { type: "setvalu", expression: "{q1} = 1", setToName: "nope", setToValue: 5 },
        { type: "complete", expression: "{q1} = 2" },
      ],
    });
    const findings = res.findings.filter(f => f.ruleId === "trigger/unknown-type");
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("triggers[0]");
    expect(findings[0].suggestion).toBe("setvalue");
  });
});

describe("trigger/unknown-target uses the shared resolver", () => {
  test("a target whose name contains dots resolves", () => {
    expect(byRule({
      elements: [{ type: "text", name: "address.city" }],
      triggers: [{ type: "setvalue", expression: "{address.city} = 1", setToName: "address.city", setToValue: 2 }],
    })).toHaveLength(0);
    const findings = byRule({
      elements: [{ type: "text", name: "address.city" }],
      triggers: [{ type: "setvalue", expression: "{address.city} = 1", setToName: "address.cty", setToValue: 2 }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("address.city");
  });
  test("comment and total data keys are accepted as targets", () => {
    expect(byRule({
      elements: [
        { type: "text", name: "q1" },
        { type: "matrixdynamic", name: "m", columns: [{ name: "col1" }] },
      ],
      triggers: [
        { type: "copyvalue", expression: "{q1} = 1", setToName: "q1-Comment", fromName: "m-total.col1" },
      ],
    })).toHaveLength(0);
  });
  test("sub-paths into a multipletext target are validated", () => {
    const findings = byRule({
      elements: [{ type: "multipletext", name: "mt1", items: [{ name: "itemA" }] }],
      triggers: [{ type: "setvalue", expression: "{mt1.itemA} = 1", setToName: "mt1.itemB", setToValue: 2 }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("itemA");
  });
  test("page suggestions stay filtered to pages", () => {
    const findings = byRule({
      pages: [{ name: "page1", elements: [{ type: "text", name: "pge2" }] }],
      triggers: [{ type: "visible", expression: "{pge2} = 1", pages: ["pge1"] }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("page1");
  });
  test("expression-only sugar is not applied to target names", () => {
    // a ":" name is skipped inside expressions, but as a target it is just a bad name
    expect(byRule({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "a:b", setToValue: 2 }],
    })).toHaveLength(1);
    // navigation resolves by name only, never by valueName
    expect(byRule({
      elements: [{ type: "text", name: "q1", valueName: "v1" }],
      triggers: [{ type: "skip", expression: "{q1} = 1", gotoName: "v1" }],
    })).toHaveLength(1);
  });
});

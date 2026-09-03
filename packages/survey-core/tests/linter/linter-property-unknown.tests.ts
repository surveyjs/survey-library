import { describe, test, expect } from "vitest";
import { lintSurvey, ILintFinding } from "../../src/linter/index";

function byRule(json: any, options?: any): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => f.ruleId === "property/unknown");
}

describe("property/unknown - misspelled keys", () => {
  test("a misspelled question property is flagged with a suggestion", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", visibileIf: "{q1} = 1" }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownProperty");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("elements[1].visibileIf");
    expect(findings[0].suggestion).toBe("visibleIf");
    expect(findings[0].messageData.key).toBe("visibileIf");
    expect(findings[0].elementName).toBe("q2");
  });
  test("a key that differs only in case is unknown too", () => {
    const findings = byRule({ elements: [{ type: "text", name: "q1", visibleif: "1 = 1" }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("visibleIf");
  });
  test("a misspelled survey property is flagged", () => {
    const findings = byRule({ titlee: "My survey", elements: [{ type: "text", name: "q1" }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("titlee");
    expect(findings[0].suggestion).toBe("title");
    expect(findings[0].messageData.className).toBe("survey");
  });
  test("keys of pages, panels and triggers are checked", () => {
    const findings = byRule({
      pages: [{
        name: "p1", nosuchpageprop: 1,
        elements: [{ type: "panel", name: "pan1", nosuchpanelprop: 1, elements: [] }],
      }],
      triggers: [{ type: "complete", expression: "1=1", nosuchtriggerprop: 1 }],
    });
    expect(findings.map(f => f.path).sort())
      .toEqual(["pages[0].elements[0].nosuchpanelprop", "pages[0].nosuchpageprop", "triggers[0].nosuchtriggerprop"]);
  });
  test("keys of a matrix column, a multipletext item and a validator are checked", () => {
    const findings = byRule({
      elements: [
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", nosuchcolumnprop: 1 }] },
        { type: "multipletext", name: "mt1", items: [{ name: "i1", nosuchitemprop: 1 }] },
        { type: "text", name: "q1", validators: [{ type: "text", nosuchvalidatorprop: 1 }] },
      ],
    });
    expect(findings).toHaveLength(3);
  });
  test("an object-form choice is checked, a scalar one has no keys", () => {
    const findings = byRule({
      elements: [{
        type: "dropdown", name: "q1",
        choices: ["a", { value: "b", text: "B", nosuchchoiceprop: 1 }],
      }],
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].path).toBe("elements[0].choices[1].nosuchchoiceprop");
  });
  test("calculated values and choicesByUrl are checked", () => {
    const findings = byRule({
      elements: [{ type: "dropdown", name: "q1", choicesByUrl: { url: "https://x", nosuchurlprop: 1 } }],
      calculatedValues: [{ name: "cv", expression: "1", nosuchcvprop: 1 }],
    });
    expect(findings).toHaveLength(2);
  });
});

describe("property/unknown - what stays clean", () => {
  test("a survey using every kind of registered key is clean", () => {
    expect(byRule({
      title: "t", showQuestionNumbers: "off", checkErrorsMode: "onValueChanged",
      pages: [{
        name: "p1",
        elements: [
          { type: "text", name: "q1", inputType: "number", min: 1, max: 5, isRequired: true },
          { type: "dropdown", name: "q2", choices: [{ value: "a", text: "A" }], showOtherItem: true },
          {
            type: "matrixdynamic", name: "m1", rowCount: 2,
            columns: [{ name: "c1", cellType: "text", title: "C" }],
          },
          { type: "paneldynamic", name: "p2", templateElements: [{ type: "text", name: "inner" }] },
        ],
      }],
      triggers: [{ type: "setvalue", expression: "{q1} > 1", setToName: "q2", setValue: "a" }],
      calculatedValues: [{ name: "cv", expression: "{q1} + 1", includeIntoResult: true }],
    })).toHaveLength(0);
  });
  test("an alternativeName is a real key", () => {
    expect(byRule({
      questions: [{ type: "checkbox", name: "q1", choices: ["a"], hasOther: true, hasNone: true }],
    })).toHaveLength(0);
  });
  test("a localized value in object form is not walked as an object", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", title: { default: "Hi", de: "Hallo" } }],
    })).toHaveLength(0);
  });
  test("free-form values are not walked", () => {
    expect(byRule({
      elements: [
        { type: "matrixdropdown", name: "m1", rows: ["r1"], columns: [{ name: "c1" }],
          defaultValue: { r1: { c1: "whatever" } } },
        { type: "text", name: "q1", bindings: { visible: "q2" } },
      ],
    })).toHaveLength(0);
  });
  test("an element of an unknown type is left to element/unknown-type", () => {
    expect(byRule({
      elements: [{ type: "nosuchtype", name: "q1", whatever: 1 }],
    })).toHaveLength(0);
  });
  test("a custom component is not judged by the core's properties", () => {
    expect(byRule(
      { elements: [{ type: "mycomp", name: "q1", myOwnProp: 1 }] },
      { components: { mycomp: { questionJSON: { type: "text" } } } })).toHaveLength(0);
  });
  test("maskSettings keys belong to the mask rule", () => {
    expect(byRule({
      elements: [{
        type: "text", name: "q1", maskType: "numeric", maskSettings: { nosuchmaskprop: 1 },
      }],
    })).toHaveLength(0);
  });
  test("the position marker the serializer writes is skipped", () => {
    expect(byRule({
      elements: [{ type: "text", name: "q1", pos: { start: 0, end: 10 } }],
    })).toHaveLength(0);
  });
});

describe("property/unknown - configuration", () => {
  test("the rule can be switched off", () => {
    const result = lintSurvey(
      { elements: [{ type: "text", name: "q1", nosuchprop: 1 }] },
      { rules: { "property/unknown": "off" } });
    expect(result.findings.filter(f => f.ruleId === "property/unknown")).toHaveLength(0);
  });
  test("a finding is suppressed by path prefix", () => {
    const result = lintSurvey(
      { elements: [{ type: "text", name: "q1", nosuchprop: 1 }] },
      { suppress: [{ ruleId: "property/unknown", path: "elements[0].*" }] });
    expect(result.findings.filter(f => f.ruleId === "property/unknown")).toHaveLength(0);
  });
});

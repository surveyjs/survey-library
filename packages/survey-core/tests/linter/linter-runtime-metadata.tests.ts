// The linter reads the serializer registry at runtime instead of a hardcoded catalog,
// so whatever the application registered is analyzed like a core property or type.
import "survey-core";
import { Serializer } from "../../src/jsonobject";
import { ComponentCollection } from "../../src/question_custom";
import { describe, test, expect, afterEach } from "vitest";
import { lintSurvey } from "../../src/linter/index";
import { LintMetadata } from "../../src/linter/metadata";

describe("linter reads the serializer registry", () => {
  afterEach(() => {
    Serializer.removeProperty("question", "myVisibleIf");
    Serializer.removeProperty("question", "myScore");
    if (!!ComponentCollection.Instance.getCustomQuestionByName("my-widget")) {
      ComponentCollection.Instance.remove("my-widget");
    }
  });

  test("a custom condition property is analyzed like a core one", () => {
    Serializer.addProperty("question", "myVisibleIf:condition");
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", myVisibleIf: "{nope} = 1" }],
    });
    const unknown = res.findings.filter(f => f.ruleId === "reference/unknown");
    expect(unknown).toHaveLength(1);
    expect(unknown[0].path).toBe("elements[0].myVisibleIf");
  });

  test("a custom expression property is analyzed like a core one", () => {
    Serializer.addProperty("question", "myScore:expression");
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", myScore: "unknownFunc({q1})" }],
    });
    expect(res.findings.filter(f => f.ruleId === "expression/unknown-function")).toHaveLength(1);
  });

  test("a registered composite component is not an unknown type", () => {
    ComponentCollection.Instance.add({
      name: "my-widget",
      questionJSON: { type: "text" },
    });
    const res = lintSurvey({ elements: [{ type: "my-widget", name: "q1" }] });
    expect(res.findings.filter(f => f.ruleId === "element/unknown-type")).toHaveLength(0);
  });

  test("a matrix column picks up the expression properties of its cell type", () => {
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "c1", cellType: "expression", expression: "{nope} + 1" }],
      }],
    });
    const unknown = res.findings.filter(f => f.ruleId === "reference/unknown");
    expect(unknown).toHaveLength(1);
    expect(unknown[0].path).toBe("elements[0].columns[0].expression");
  });

  // the container keys and the class-name suffixes come from the property metadata
  // (alternativeName / classNamePart), not from literals in the linter
  test("container array keys come from the serializer", () => {
    const metadata = new LintMetadata();
    expect(metadata.getElementsKeys()).toEqual(["elements", "questions"]);
    expect(metadata.getTemplateElementsKeys()).toEqual(["templateElements", "questions"]);
  });

  test("class-name suffixes come from the serializer", () => {
    const metadata = new LintMetadata();
    expect(metadata.getClassNamePart("survey", "triggers", "fallback")).toBe("trigger");
    expect(metadata.getClassNamePart("question", "validators", "fallback")).toBe("validator");
    // an unregistered property falls back, so the walker keeps working
    expect(metadata.getClassNamePart("survey", "nosuchprop", "fallback")).toBe("fallback");
    expect(metadata.normalizeTriggerType("SetValueTrigger")).toBe("setvalue");
    expect(metadata.normalizeTriggerType("setvalue")).toBe("setvalue");
  });

  test("a validator type is accepted with and without the class-name suffix", () => {
    const metadata = new LintMetadata();
    const props = (type: string) => metadata.getValidatorExpressionProps(type).map(p => p.name);
    expect(props("expression")).toContain("expression");
    expect(props("expressionvalidator")).toContain("expression");
  });

  test("a text column still picks up min/maxValueExpression", () => {
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [{ name: "c1", cellType: "text", minValueExpression: "{nope}" }],
      }],
    });
    const unknown = res.findings.filter(f => f.ruleId === "reference/unknown");
    expect(unknown).toHaveLength(1);
    expect(unknown[0].path).toBe("elements[0].columns[0].minValueExpression");
  });
});

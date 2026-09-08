import { ISurveyVariablePreset, ISurveyVariablePresets, SurveyVariablePresets } from "survey-core";
import { SurveyModel } from "../src/survey";
import { ISurveyVariableValidationResult, SurveyVariablePresets as SurveyVariablePresetsFromSrc } from "../src/variablePresets";

import { describe, expect, test, vi } from "vitest";

// The variable definition is one ordinary survey JSON: its top-level questions are the variables the
// host sets, and everything known about a variable - its type, its choices, its validators - is read
// from the question. The companion is the one implementation of those rules; the tester and the
// linter only differ in how they report what it says.

describe("SurveyVariablePresets (issue #11814)", () => {
  const definition = {
    elements: [
      { type: "dropdown", name: "tier", choices: ["gold", "silver"] },
      { type: "text", name: "years", inputType: "number", min: 1, max: 50 },
      { type: "text", name: "code", validators: [{ type: "regex", regex: "^[A-Z]{3}$", text: "Bad code" }] },
    ]
  };

  test("variable names: name, valueName, survey order, nested questions excluded", () => {
    const presets = new SurveyVariablePresets({
      definition: {
        elements: [
          { type: "text", name: "q1" },
          { type: "text", name: "q2", valueName: "role" },
          { type: "text", name: "q3", valueName: "role" },
          { type: "paneldynamic", name: "sites", templateElements: [{ type: "text", name: "city" }] },
          { type: "matrixdynamic", name: "rows", columns: [{ name: "col1" }] },
        ]
      }
    });
    expect(presets.hasDefinition).toBe(true);
    // "role" once: two questions sharing a valueName are one variable, as they are one data key. The
    // panel and the matrix are variables themselves; the questions inside them produce no root key.
    expect(presets.getVariableNames()).toEqual(["q1", "role", "sites", "rows"]);
    expect(presets.getVariableQuestion("role").name).toEqual("q2");
    presets.dispose();
  });
  test("variable lookup is case-insensitive, preset lookup is case-sensitive", () => {
    const presets = new SurveyVariablePresets({
      definition: { elements: [{ type: "text", name: "Tier" }] },
      presets: [{ name: "Gold", variables: { Tier: "gold" } }, <ISurveyVariablePreset>{ variables: {} }]
    });
    expect(presets.hasVariable("Tier")).toBe(true);
    expect(presets.hasVariable("tier")).toBe(true);
    expect(presets.hasVariable("TIER")).toBe(true);
    expect(presets.hasVariable("role")).toBe(false);
    expect(presets.hasVariable(undefined)).toBe(false);
    expect(presets.getVariableQuestion("tier").name).toEqual("Tier");
    expect(presets.getVariableQuestion("role")).toBeUndefined();
    // The nameless entry is no preset: it can never be looked up.
    expect(presets.getPresetNames()).toEqual(["Gold"]);
    expect(presets.getPreset("Gold").variables).toEqual({ Tier: "gold" });
    expect(presets.getPreset("gold")).toBeUndefined();
    expect(presets.getPreset("unknown")).toBeUndefined();
    presets.dispose();
  });
  test("the container handed in is neither cloned nor changed", () => {
    const source: ISurveyVariablePresets = {
      definition: { elements: [{ type: "dropdown", name: "tier", choices: ["gold"] }] },
      presets: [{ name: "Gold", variables: { tier: "gold" } }]
    };
    const before = JSON.stringify(source);
    const presets = new SurveyVariablePresets(source);
    expect(presets.source).toBe(source);
    presets.getVariableNames();
    presets.getPreset("Gold");
    presets.validateVariables({ tier: "platinum" });
    presets.dispose();
    // The definition model is built from a deep copy: the serializer normalizes what it loads and the
    // container belongs to the host.
    expect(JSON.stringify(source)).toEqual(before);
  });
  test("no definition, a definition that is not an object, and a disposed companion", () => {
    const check = (presets: SurveyVariablePresets): void => {
      expect(presets.hasDefinition).toBe(false);
      expect(presets.getVariableNames()).toEqual([]);
      expect(presets.hasVariable("tier")).toBe(false);
      expect(presets.getVariableQuestion("tier")).toBeUndefined();
      const res = presets.validateVariables({ tier: "gold" });
      expect(res.unknownVariables).toEqual(["tier"]);
      expect(res.errors).toEqual([]);
      expect(res.isValid).toBe(false);
    };
    expect(new SurveyVariablePresets().source).toEqual({});
    check(new SurveyVariablePresets());
    check(new SurveyVariablePresets({ presets: [{ name: "Gold", variables: {} }] }));
    check(new SurveyVariablePresets({ definition: "surveyJson" }));
    check(new SurveyVariablePresets({ definition: [{ type: "text", name: "tier" }] }));
    const disposed = new SurveyVariablePresets({
      definition: { elements: [{ type: "text", name: "tier" }] },
      presets: [{ name: "Gold", variables: { tier: "gold" } }]
    });
    expect(disposed.hasVariable("tier")).toBe(true);
    disposed.dispose();
    check(disposed);
    // The presets are plain data: they need no model and keep working.
    expect(disposed.getPreset("Gold").variables).toEqual({ tier: "gold" });
    disposed.dispose();
  });
  test("validateVariables: a valid record", () => {
    const presets = new SurveyVariablePresets({ definition: definition });
    const res = presets.validateVariables({ tier: "gold", years: 10, code: "ABC" });
    expect(res.unknownVariables).toEqual([]);
    expect(res.errors).toEqual([]);
    expect(res.isValid).toBe(true);
    presets.dispose();
  });
  test("validateVariables: a non-object argument is nothing to check", () => {
    const presets = new SurveyVariablePresets({ definition: definition });
    [undefined, null, "gold", 5, true].forEach(variables => {
      const res = presets.validateVariables(variables);
      expect(res.unknownVariables).toEqual([]);
      expect(res.errors).toEqual([]);
      expect(res.isValid).toBe(true);
    });
    presets.dispose();
  });
  test("validateVariables: a value outside the choices of a question that is not required", () => {
    const presets = new SurveyVariablePresets({ definition: definition });
    const res = presets.validateVariables({ tier: "platinum" });
    expect(res.unknownVariables).toEqual([]);
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].variable).toEqual("tier");
    expect(res.errors[0].question).toEqual("tier");
    expect(res.errors[0].errors).toHaveLength(1);
    expect(res.errors[0].errors[0].indexOf("platinum") > -1).toBe(true);
    expect(res.isValid).toBe(false);
    // keepIncorrectValues: without it the survey would clear the value instead of reporting it, and
    // the record would validate clean.
    expect(presets.getVariableQuestion("tier").value).toEqual("platinum");
    presets.dispose();
  });
  test("validateVariables: one alien element among valid ones in a checkbox", () => {
    const presets = new SurveyVariablePresets({
      definition: { elements: [{ type: "checkbox", name: "roles", choices: ["admin", "user"] }] }
    });
    const res = presets.validateVariables({ roles: ["admin", "alien", "user"] });
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].variable).toEqual("roles");
    expect(res.errors[0].errors).toHaveLength(1);
    expect(res.errors[0].errors[0].indexOf("alien") > -1).toBe(true);
    expect(presets.validateVariables({ roles: ["admin", "user"] }).isValid).toBe(true);
    presets.dispose();
  });
  test("validateVariables: the built-in items a question shows are choices", () => {
    const presets = new SurveyVariablePresets({
      definition: {
        elements: [
          { type: "dropdown", name: "tier", choices: ["gold"], showNoneItem: true },
          // The other answer of a question that stores it in its own value is deliberately not a
          // choice: the question maps it back to the "other" item itself.
          { type: "dropdown", name: "source", choices: ["web"], showOtherItem: true, storeOthersAsComment: false },
        ]
      }
    });
    expect(presets.validateVariables({ tier: "none", source: "a partner referral" }).isValid).toBe(true);
    presets.dispose();
  });
  test("validateVariables: the definition's own validators", () => {
    const presets = new SurveyVariablePresets({ definition: definition });
    const res = presets.validateVariables({ years: 99, code: "xx" });
    expect(res.errors).toHaveLength(2);
    expect(res.errors[0].variable).toEqual("years");
    expect(res.errors[0].errors[0].indexOf("50") > -1).toBe(true);
    expect(res.errors[1].variable).toEqual("code");
    expect(res.errors[1].errors).toEqual(["Bad code"]);
    expect(res.isValid).toBe(false);
    presets.dispose();
  });
  test("validateVariables: a required variable that the record leaves out", () => {
    const presets = new SurveyVariablePresets({
      definition: { elements: [{ type: "text", name: "tier", isRequired: true }] }
    });
    const res = presets.validateVariables({});
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].variable).toEqual("tier");
    expect(res.errors[0].errors).toEqual(["Response required."]);
    presets.dispose();
  });
  test("validateVariables: a nested error is reported on the variable that owns it", () => {
    const presets = new SurveyVariablePresets({
      definition: {
        elements: [{
          type: "paneldynamic", name: "sites",
          templateElements: [{ type: "text", name: "city", isRequired: true }]
        }]
      }
    });
    const res = presets.validateVariables({ sites: [{ country: "de" }] });
    // getAllErrors(), not errors: the dynamic panel keeps its own errors empty and reports through the
    // nested question. The variable is the unit the host sets, so the error is attributed to it.
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].variable).toEqual("sites");
    expect(res.errors[0].question).toEqual("sites");
    expect(res.errors[0].errors).toEqual(["Response required."]);
    presets.dispose();
  });
  test("validateVariables: known keys are canonicalized to the definition's spelling", () => {
    const presets = new SurveyVariablePresets({ definition: definition });
    // The value hash is case-sensitive: { Tier: "gold" } assigned as written would leave the
    // definition question "tier" empty.
    expect(presets.validateVariables({ Tier: "gold" }).isValid).toBe(true);
    expect(presets.getVariableQuestion("tier").value).toEqual("gold");
    // Two keys differing only by case are one variable: the last one in input order wins.
    expect(presets.validateVariables({ tier: "gold", TIER: "silver" }).isValid).toBe(true);
    expect(presets.getVariableQuestion("tier").value).toEqual("silver");
    presets.dispose();
  });
  test("validateVariables: an unknown key is listed and is not assigned", () => {
    const presets = new SurveyVariablePresets({
      definition: { elements: [{ type: "text", name: "q1", valueName: "role" }] }
    });
    // The variable is the data key the question produces, so the question's own name is not one.
    const res = presets.validateVariables({ q1: "admin", role: "user" });
    expect(res.unknownVariables).toEqual(["q1"]);
    expect(res.errors).toEqual([]);
    expect(res.isValid).toBe(false);
    expect(presets.getVariableQuestion("role").value).toEqual("user");
    presets.dispose();
  });
  test("validateVariables: the model is reset between calls", () => {
    const presets = new SurveyVariablePresets({ definition: definition });
    expect(presets.validateVariables({ tier: "platinum", code: "xx" }).errors).toHaveLength(2);
    const res = presets.validateVariables({ tier: "gold", code: "ABC" });
    expect(res.errors).toEqual([]);
    expect(res.isValid).toBe(true);
    presets.dispose();
  });
  test("validateVariables: the errors are read after the survey has stored them", () => {
    // The guard for validate(fireCallback: true): Question.validateElementCore assigns question.errors
    // only under that flag, so with false every question would read as clean here.
    const presets = new SurveyVariablePresets({
      definition: { elements: [{ type: "text", name: "tier", isRequired: true }] }
    });
    const res = presets.validateVariables({});
    expect(res.errors).toHaveLength(1);
    expect(presets.getVariableQuestion("tier").errors).toHaveLength(1);
    presets.dispose();
  });
  test("validateVariables: a question hidden by a visibleIf is not validated", () => {
    const presets = new SurveyVariablePresets({
      definition: {
        elements: [
          { type: "dropdown", name: "tier", choices: ["gold", "silver"] },
          { type: "text", name: "discount", isRequired: true, visibleIf: "{tier} = 'gold'" },
        ]
      }
    });
    // How a definition author says "this variable applies only when ...".
    expect(presets.validateVariables({ tier: "silver" }).isValid).toBe(true);
    const res = presets.validateVariables({ tier: "gold" });
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].variable).toEqual("discount");
    // The errors of a question the next call hides do not leak into its verdict.
    expect(presets.validateVariables({ tier: "silver" }).isValid).toBe(true);
    presets.dispose();
  });
  test("the definition model reads the clock it is given", () => {
    const presets = new SurveyVariablePresets({
      definition: { elements: [{ type: "expression", name: "year", expression: "currentYear()" }] }
    }, { dateProvider: { now: (): number => new Date(2035, 4, 17).getTime() } });
    expect(presets.getVariableQuestion("year").value).toEqual(2035);
    expect(presets.validateVariables({}).isValid).toBe(true);
    expect(presets.getVariableQuestion("year").value).toEqual(2035);
    presets.dispose();
  });
  test("the definition model is built once", () => {
    const spy = vi.spyOn(SurveyModel.prototype, "fromJSON");
    const presets = new SurveyVariablePresets({ definition: definition });
    presets.getVariableNames();
    presets.getVariableNames();
    presets.hasVariable("tier");
    presets.validateVariables({ tier: "gold" });
    expect(spy).toHaveBeenCalledTimes(1);
    presets.dispose();
    // A disposed companion never builds a second model.
    presets.getVariableNames();
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
  test("a definition model the host built is used as it is", () => {
    const spy = vi.spyOn(SurveyModel.prototype, "fromJSON");
    const model = new SurveyModel({
      elements: [
        { type: "dropdown", name: "tier", choices: ["gold", "silver"] },
        { type: "text", name: "q1", valueName: "role", isRequired: true },
      ]
    });
    spy.mockClear();
    // The model wins over the JSON definition, which is then never loaded.
    const presets = new SurveyVariablePresets({ definition: definition }, { definitionModel: model });
    expect(presets.hasDefinition).toBe(true);
    expect(presets.getVariableNames()).toEqual(["tier", "role"]);
    expect(presets.getVariableQuestion("ROLE")).toBe(model.getQuestionByName("q1"));
    expect(spy).toHaveBeenCalledTimes(0);
    const res = presets.validateVariables({ tier: "platinum" });
    expect(res.errors).toHaveLength(2);
    expect(res.errors[0].variable).toEqual("tier");
    expect(res.errors[1].variable).toEqual("role");
    expect(presets.validateVariables({ tier: "gold", role: "admin" }).isValid).toBe(true);
    expect(spy).toHaveBeenCalledTimes(0);
    spy.mockRestore();
    presets.dispose();
    // The model belongs to the host: it is not disposed here, and the companion no longer reads it.
    expect(model.isDisposed).toBe(false);
    expect(model.getQuestionByName("tier").value).toEqual("gold");
    expect(presets.hasDefinition).toBe(false);
    expect(presets.getVariableNames()).toEqual([]);
    model.dispose();
  });
  test("a definition model gets what the verdict depends on: the flag and the clock", () => {
    const model = new SurveyModel({
      elements: [
        { type: "dropdown", name: "tier", choices: ["gold"] },
        { type: "expression", name: "year", expression: "currentYear()" },
      ]
    });
    // The host turned it off, and a cleared value would validate clean: the instrument needs it on.
    model.keepIncorrectValues = false;
    const presets = new SurveyVariablePresets(undefined,
      { definitionModel: model, dateProvider: { now: (): number => new Date(2035, 4, 17).getTime() } });
    const res = presets.validateVariables({ tier: "platinum" });
    expect(res.errors).toHaveLength(1);
    expect(res.errors[0].errors[0].indexOf("platinum") > -1).toBe(true);
    expect(model.getQuestionByName("tier").value).toEqual("platinum");
    expect(model.getQuestionByName("year").value).toEqual(2035);
    presets.dispose();
    model.dispose();
  });
  test("the companion and its interfaces come from the package entry", () => {
    expect(SurveyVariablePresets).toBe(SurveyVariablePresetsFromSrc);
    const source: ISurveyVariablePresets = {
      definition: { elements: [{ type: "text", name: "tier" }] },
      presets: [{ name: "Gold", description: "the gold tier", variables: { tier: "gold" } }]
    };
    const presets = new SurveyVariablePresets(source);
    const preset: ISurveyVariablePreset = presets.getPreset("Gold");
    const res: ISurveyVariableValidationResult = presets.validateVariables(preset.variables);
    expect(res.isValid).toBe(true);
    presets.dispose();
  });
});

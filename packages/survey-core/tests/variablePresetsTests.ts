import { ISurveyVariablePreset, ISurveyVariablePresets, SurveyVariablePresets } from "survey-core";
import { SurveyModel } from "../src/survey";
import { getLocaleString } from "../src/surveyStrings";
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
  test("validateVariables: a record with no prototype is checked like a plain object", () => {
    // What a careful consumer hands over: the tester builds its resolved variables with
    // Object.create(null), so that a variable named "constructor" cannot read back off a prototype.
    const variables: any = Object.create(null);
    variables.tier = "platinum";
    variables.role = "admin";
    const presets = new SurveyVariablePresets({ definition: definition });
    const res = presets.validateVariables(variables);
    expect(res.unknownVariables).toEqual(["role"]);
    expect(res.errors.length).toBe(1);
    expect(res.isValid).toBe(false);
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

// Nested data (prompt 15, decisions V1-V4): the definition's data is the shape of the variables, so a
// panel or a page that nests describes an object variable.
describe("SurveyVariablePresets with a nested definition", () => {
  const nestedDefinition = (dataNesting?: string, withValueName: boolean = true): any => {
    const panel: any = { type: "panel", name: "user", title: "User", elements: [
      { type: "dropdown", name: "tier", title: "Tier", choices: ["gold", "silver"], isRequired: true },
      { type: "text", name: "name", title: "Name" }] };
    if (withValueName) panel.valueName = "users";
    const res: any = { elements: [panel, { type: "text", name: "role" }] };
    if (!!dataNesting) res.dataNesting = dataNesting;
    return res;
  };
  const create = (definition: any): SurveyVariablePresets => new SurveyVariablePresets({ definition: definition });
  const notInChoices = (val: string): string => (<any>getLocaleString("variableValueNotInChoices"))["format"](val);

  test.each(["auto", "panel"])("V1/V3: names are the root keys, paths the leaves (%s)", mode => {
    const presets = create(nestedDefinition(mode));
    expect(presets.getVariableNames()).toEqual(["users", "role"]);
    expect(presets.getVariablePaths()).toEqual(["users.tier", "users.name", "role"]);
    presets.dispose();
  });
  test("V1: \"panel\" mode keys a panel without valueName by its name", () => {
    const presets = create(nestedDefinition("panel", false));
    expect(presets.getVariableNames()).toEqual(["user", "role"]);
    expect(presets.getVariablePaths()).toEqual(["user.tier", "user.name", "role"]);
    expect(presets.getVariableQuestion("user.tier").name).toBe("tier");
    presets.dispose();
  });
  test.each(["page", "panelAndPage"])("V1: in \"%s\" mode the root elements land on page1", mode => {
    const presets = create(nestedDefinition(mode));
    expect(presets.getVariableNames()).toEqual(["page1"]);
    expect(presets.getVariablePaths()).toEqual(["page1.users.tier", "page1.users.name", "page1.role"]);
    expect(presets.getVariableElement("page1").getType()).toBe("page");
    expect(presets.getVariableQuestion("page1.users.tier").name).toBe("tier");
    const res = presets.validateVariables({ page1: { users: { tier: "gold" }, role: "a" } });
    expect(res).toEqual({ unknownVariables: [], errors: [], isValid: true });
    presets.dispose();
  });
  test("\"none\": the definition is flat, as today", () => {
    const presets = create(nestedDefinition("none"));
    expect(presets.getVariableNames()).toEqual(["tier", "name", "role"]);
    expect(presets.getVariablePaths()).toEqual(["tier", "name", "role"]);
    expect(presets.hasVariable("users")).toBe(false);
    expect(presets.validateVariables({ tier: "gold" }).isValid).toBe(true);
    presets.dispose();
  });
  test("V2/V3: lookups by root key and by path", () => {
    const presets = create(nestedDefinition());
    expect(presets.hasVariable("users")).toBe(true);
    expect(presets.getVariableQuestion("users")).toBeUndefined();
    expect(presets.getVariableElement("users").name).toBe("user");
    expect(presets.hasVariable("users.tier")).toBe(true);
    expect(presets.getVariableQuestion("users.tier").name).toBe("tier");
    expect(presets.getVariableElement("users.tier").name).toBe("tier");
    expect(presets.hasVariable("Users.Tier")).toBe(true);
    expect(presets.getVariableQuestion("Users.Tier").name).toBe("tier");
    expect(presets.getVariableElement("USERS").name).toBe("user");
    // an inner question is no variable: the host never sets it at the root
    expect(presets.hasVariable("tier")).toBe(false);
    expect(presets.getVariableQuestion("tier")).toBeUndefined();
    expect(presets.getVariableElement("tier")).toBeUndefined();
    expect(presets.hasVariable("users.nope")).toBe(false);
    expect(presets.getVariableQuestion("users.nope")).toBeUndefined();
    expect(presets.getVariableElement("users.nope")).toBeUndefined();
    expect(presets.hasVariable("role")).toBe(true);
    expect(presets.getVariableElement("role").name).toBe("role");
    expect(presets.getVariableElement(undefined)).toBeUndefined();
    expect(presets.getVariableElement("")).toBeUndefined();
    presets.dispose();
  });
  test("a flat definition: the paths are the names, and a dotted key is no variable", () => {
    const presets = create({ elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", valueName: "a.b" },
      { type: "text", name: "c.d" }] });
    expect(presets.getVariableNames()).toEqual(["q1"]);
    expect(presets.getVariablePaths()).toEqual(["q1"]);
    expect(presets.hasVariable("a.b")).toBe(false);
    expect(presets.getVariableQuestion("a.b")).toBeUndefined();
    expect(presets.getDottedKeyElements().map(el => el.name)).toEqual(["q2", "c.d"]);
    expect(presets.validateVariables({ q1: 1, "a.b": 2 })).toEqual({ unknownVariables: ["a.b"], errors: [], isValid: false });
    presets.dispose();
  });
  test("no definition and a disposed companion have no paths", () => {
    expect(new SurveyVariablePresets().getVariablePaths()).toEqual([]);
    const presets = create(nestedDefinition());
    presets.getVariablePaths();
    presets.dispose();
    expect(presets.getVariablePaths()).toEqual([]);
    expect(presets.getVariableElement("users")).toBeUndefined();
  });
  test("V4: a valid nested preset", () => {
    const presets = create(nestedDefinition());
    const res = presets.validateVariables({ users: { tier: "gold", name: "Ann" }, role: "admin" });
    expect(res).toEqual({ unknownVariables: [], errors: [], isValid: true });
    presets.dispose();
  });
  test("V4: keys are mapped to the definition's spelling at every level", () => {
    const presets = create(nestedDefinition());
    expect(presets.validateVariables({ Users: { Tier: "gold" } })).toEqual({ unknownVariables: [], errors: [], isValid: true });
    presets.dispose();
  });
  test("V4: an inner value outside the choices is reported on its path", () => {
    const presets = create(nestedDefinition());
    const res = presets.validateVariables({ users: { tier: "bronze" } });
    expect(res.isValid).toBe(false);
    expect(res.errors).toEqual([{ variable: "users.tier", question: "tier", errors: [notInChoices("bronze")] }]);
    presets.dispose();
  });
  test("V4: a missing required inner value, and a missing or null object variable", () => {
    const presets = create(nestedDefinition());
    [{ users: { name: "Ann" } }, {}, { users: null }].forEach(vars => {
      const res = presets.validateVariables(vars);
      expect(res.unknownVariables).toEqual([]);
      expect(res.errors).toEqual([{ variable: "users.tier", question: "tier", errors: ["Response required."] }]);
    });
    presets.dispose();
  });
  test("V4: an unknown inner key is a path in the input's spelling", () => {
    const presets = create(nestedDefinition());
    let res = presets.validateVariables({ users: { tier: "gold", nope: 1 } });
    expect(res.unknownVariables).toEqual(["users.nope"]);
    expect(res.errors).toEqual([]);
    expect(res.isValid).toBe(false);
    res = presets.validateVariables({ Users: { Tier: "gold", Nope: 1 }, other: 2 });
    expect(res.unknownVariables).toEqual(["Users.Nope", "other"]);
    presets.dispose();
  });
  test.each([["a string", "gold"], ["a number", 5], ["an array", ["gold"]]])("V4: %s for an object variable is one error", (_, val) => {
    const presets = create(nestedDefinition());
    const res = presets.validateVariables({ users: val, role: "a" });
    expect(res.unknownVariables).toEqual([]);
    expect(res.errors).toEqual([{ variable: "users", question: "user", errors: ["The value is incorrect."] }]);
    expect(res.isValid).toBe(false);
    presets.dispose();
  });
  test("V4: a flat value of an inner question is an unknown root key", () => {
    const presets = create(nestedDefinition());
    const res = presets.validateVariables({ tier: "gold", users: { tier: "gold" } });
    expect(res.unknownVariables).toEqual(["tier"]);
    expect(res.errors).toEqual([]);
    presets.dispose();
  });
  test("two levels: a panel with valueName in a page with valueName", () => {
    const presets = create({ pages: [{ name: "p1", valueName: "page", elements: [
      { type: "panel", name: "user", valueName: "users", elements: [{ type: "text", name: "tier", isRequired: true }] },
      { type: "text", name: "role" }] }] });
    expect(presets.getVariableNames()).toEqual(["page"]);
    expect(presets.getVariablePaths()).toEqual(["page.users.tier", "page.role"]);
    expect(presets.getVariableElement("page").name).toBe("p1");
    expect(presets.getVariableElement("page.users").name).toBe("user");
    expect(presets.getVariableQuestion("Page.Users.Tier").name).toBe("tier");
    expect(presets.validateVariables({ page: { users: { tier: "x" } } }).isValid).toBe(true);
    let res = presets.validateVariables({ page: { users: "x", nope: 1 } });
    expect(res.unknownVariables).toEqual(["page.nope"]);
    expect(res.errors).toEqual([{ variable: "page.users", question: "user", errors: ["The value is incorrect."] }]);
    res = presets.validateVariables({ page: { users: {} } });
    expect(res.errors).toEqual([{ variable: "page.users.tier", question: "tier", errors: ["Response required."] }]);
    presets.dispose();
  });
  test("N5: a dynamic panel is one variable; inside a nesting panel it is one path", () => {
    const presets = create({ elements: [
      { type: "paneldynamic", name: "sites", templateElements: [{ type: "text", name: "city" },
        { type: "panel", name: "addr", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
      { type: "panel", name: "user", valueName: "users", elements: [
        { type: "paneldynamic", name: "items", templateElements: [{ type: "text", name: "item" }] }] }] });
    expect(presets.getVariableNames()).toEqual(["sites", "users"]);
    expect(presets.getVariablePaths()).toEqual(["sites", "users.items"]);
    expect(presets.hasVariable("sites.city")).toBe(false);
    expect(presets.hasVariable("sites.address")).toBe(false);
    expect(presets.getVariableQuestion("users.items").name).toBe("items");
    const res = presets.validateVariables({ sites: [{ city: "Oslo", address: { street: "Main" } }], users: { items: [{ item: "a" }] } });
    expect(res).toEqual({ unknownVariables: [], errors: [], isValid: true });
    presets.dispose();
  });
  test("D4: two containers with one key are one variable with the leaves of both", () => {
    const presets = create({ elements: [
      { type: "panel", name: "p1", valueName: "users", elements: [{ type: "text", name: "tier" }] },
      { type: "text", name: "role" },
      { type: "panel", name: "p2", valueName: "users", elements: [{ type: "text", name: "name", isRequired: true }] }] });
    expect(presets.getVariableNames()).toEqual(["users", "role"]);
    expect(presets.getVariablePaths()).toEqual(["users.tier", "role", "users.name"]);
    expect(presets.getVariableElement("users").name).toBe("p1");
    expect(presets.getVariableQuestion("users.name").name).toBe("name");
    expect(presets.validateVariables({ users: { tier: "a", name: "b" } }).isValid).toBe(true);
    expect(presets.validateVariables({ users: { tier: "a" } }).errors).toEqual(
      [{ variable: "users.name", question: "name", errors: ["Response required."] }]);
    presets.dispose();
  });
  test("a dotted inner key declares no variable, and nothing inside a dotted container does", () => {
    const presets = create({ elements: [{ type: "panel", name: "user", valueName: "users", elements: [
      { type: "text", name: "q1", valueName: "a.b", isRequired: true }, { type: "text", name: "q2", valueName: "a" },
      { type: "panel", name: "xy", valueName: "x.y", elements: [
        { type: "text", name: "z", isRequired: true },
        { type: "panel", name: "inner", valueName: "w.v", elements: [{ type: "text", name: "t" }] }] }] }] });
    expect(presets.getVariablePaths()).toEqual(["users.a"]);
    expect(presets.hasVariable("users.a.b")).toBe(false);
    expect(presets.hasVariable("users.x")).toBe(false);
    expect(presets.hasVariable("users.x.y.z")).toBe(false);
    expect(presets.getVariableQuestion("users.a").name).toBe("q2");
    // the outer dotted container is the defect; what lies inside it is not listed again
    expect(presets.getDottedKeyElements().map(el => el.name)).toEqual(["q1", "xy"]);
    // an input key is never split, and a required question under a dotted key reports nothing
    expect(presets.validateVariables({ users: { "A.B": "x", a: "y" } })).toEqual(
      { unknownVariables: ["users.A.B"], errors: [], isValid: false });
    expect(presets.validateVariables({ users: { a: "y" } })).toEqual({ unknownVariables: [], errors: [], isValid: true });
    presets.dispose();
    expect(presets.getDottedKeyElements()).toEqual([]);
  });
  test("a dotted key beside the nesting chain that spells it: only the chain is a variable", () => {
    const presets = create({ elements: [{ type: "panel", name: "user", valueName: "users", elements: [
      { type: "text", name: "ab", valueName: "a.b" },
      { type: "panel", name: "pa", valueName: "a", elements: [{ type: "text", name: "b" }] }] }] });
    expect(presets.getVariablePaths()).toEqual(["users.a.b"]);
    expect(presets.getVariableQuestion("users.a.b").name).toBe("b");
    expect(presets.getDottedKeyElements().map(el => el.name)).toEqual(["ab"]);
    presets.dispose();
  });
  test("a dotted key of a definition model the host built is no variable either", () => {
    const model = new SurveyModel({ elements: [{ type: "text", name: "ok" }, { type: "text", name: "no.pe" }] });
    const presets = new SurveyVariablePresets({}, { definitionModel: model });
    expect(presets.getVariableNames()).toEqual(["ok"]);
    expect(presets.getDottedKeyElements().map(el => el.name)).toEqual(["no.pe"]);
    presets.dispose();
    model.dispose();
  });
  test("runtime round trip: a preset's variables applied to an edited survey", () => {
    const presets = new SurveyVariablePresets({ definition: nestedDefinition(), presets: [
      { name: "Gold", variables: { users: { tier: "gold", name: "Ann" }, role: "admin" } },
      { name: "Silver", variables: { users: { tier: "silver", name: "Bob" }, role: "user" } }] });
    presets.getPresetNames().forEach(name => expect(presets.validateVariables(presets.getPreset(name).variables).isValid).toBe(true));
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1", visibleIf: "{users.tier} = 'gold'", title: "Hi {users.name}" },
        { type: "expression", name: "e1", expression: "{users.tier}" }],
      calculatedValues: [{ name: "greeting", expression: "{users.name} + '!'" }] });
    const q1 = survey.getQuestionByName("q1");
    survey.setVariables(presets.getPreset("Gold").variables);
    expect(q1.isVisible).toBe(true);
    expect(q1.locTitle.renderedHtml).toBe("Hi Ann");
    expect(survey.getQuestionByName("e1").value).toBe("gold");
    expect(survey.getVariable("greeting")).toBe("Ann!");
    survey.setVariables(presets.getPreset("Silver").variables);
    expect(q1.isVisible).toBe(false);
    expect(q1.locTitle.renderedHtml).toBe("Hi Bob");
    expect(survey.getQuestionByName("e1").value).toBe("silver");
    expect(survey.getVariable("greeting")).toBe("Bob!");
    survey.setVariables({ users: { tier: "gold" } });
    expect(q1.isVisible).toBe(true);
    // The clear is asserted through runCondition only: a visibleIf, an expression question and a title
    // keep the old object value after setVariables({}, true), while a flat variable updates (a known
    // runtime defect, also on master; report-15, open points).
    survey.setVariables({}, true);
    expect(survey.getVariable("users")).toBeUndefined();
    expect(survey.runCondition("{users.tier} empty")).toBe(true);
    survey.dispose();
    presets.dispose();
  });
});

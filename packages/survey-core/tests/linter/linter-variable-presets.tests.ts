import { describe, test, expect, vi } from "vitest";
import { SurveyModel, SurveyVariablePresets } from "survey-core";
import { ILintFinding, ISurveyLintOptions, lintSurvey } from "../../src/linter/index";
import { allRules } from "../../src/linter/rules/index";

function byRule(json: any, ruleId: string, options?: ISurveyLintOptions): Array<ILintFinding> {
  return lintSurvey(json, options).findings.filter(f => f.ruleId === ruleId);
}
function refs(json: any, options?: ISurveyLintOptions): Array<ILintFinding> {
  return byRule(json, "reference/unknown", options);
}
function collisions(json: any, options?: ISurveyLintOptions): Array<ILintFinding> {
  return byRule(json, "variable/collision", options);
}
function presetFindings(json: any, options?: ISurveyLintOptions): Array<ILintFinding> {
  return byRule(json, "variable/preset", options);
}

const TIER_DEFINITION = { elements: [{ type: "text", name: "tier" }] };
const EMPTY_SURVEY = { elements: [{ type: "text", name: "q1" }] };

describe("reference/unknown and the variable definition (issue #11814)", () => {
  test("without any option a host variable is still unknown - today's behaviour", () => {
    const findings = refs({ elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 'gold'" }] });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("tier");
  });
  test("a variable of the definition resolves", () => {
    expect(refs({ elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 'gold'" }] },
      { variablePresets: { definition: TIER_DEFINITION } })).toHaveLength(0);
  });
  test("knownVariables keep working with no definition", () => {
    expect(refs({ elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 'gold'" }] },
      { knownVariables: ["tier"] })).toHaveLength(0);
  });
  test("the two sources are a union", () => {
    expect(refs({ elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 'gold' and {role} = 'admin'" }] },
      { knownVariables: ["role"], variablePresets: { definition: TIER_DEFINITION } })).toHaveLength(0);
  });
  test("a typo is suggested from the definition names", () => {
    // the shared edit-distance cutoff is adaptive (two edits from six characters up), and a
    // transposition costs two - so this is what a swapped pair has to look like to be suggested
    const findings = refs({ elements: [{ type: "text", name: "q1", visibleIf: "{customerTeir} = 'gold'" }] },
      { variablePresets: { definition: { elements: [{ type: "text", name: "customerTier" }] } } });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("customerTier");
  });
  test("the variable is the data key: a valueName wins over the question name", () => {
    const options: ISurveyLintOptions = {
      variablePresets: { definition: { elements: [{ type: "text", name: "q1", valueName: "tier" }] } },
    };
    expect(refs({ elements: [{ type: "text", name: "x", visibleIf: "{tier} = 'gold'" }] }, options)).toHaveLength(0);
    const findings = refs({ elements: [{ type: "text", name: "x", visibleIf: "{q1} = 'gold'" }] }, options);
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("q1");
  });
  test("only the top level of the definition is a variable", () => {
    const options: ISurveyLintOptions = {
      variablePresets: {
        definition: {
          elements: [{
            type: "paneldynamic", name: "panelVar",
            templateElements: [{ type: "text", name: "x" }],
          }],
        },
      },
    };
    // the panel is the one variable; the question inside its template writes no root data key
    expect(refs({ elements: [{ type: "text", name: "q1", visibleIf: "{panelVar} notempty" }] }, options)).toHaveLength(0);
    const findings = refs({ elements: [{ type: "text", name: "q1", visibleIf: "{x} notempty" }] }, options);
    expect(findings).toHaveLength(1);
    // a dotted reference resolves on its root, exactly as a knownVariables one does
    expect(refs({ elements: [{ type: "text", name: "q1", visibleIf: "{panelVar.x} notempty" }] }, options)).toHaveLength(0);
  });
  test("names match case-insensitively, as setVariable stores them", () => {
    expect(refs({ elements: [{ type: "text", name: "q1", visibleIf: "{TIER} = 'gold'" }] },
      { variablePresets: { definition: TIER_DEFINITION } })).toHaveLength(0);
  });
  test("a definition variable is a valid trigger target", () => {
    const json = {
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "tier", isVariable: true, setValue: "gold" }],
    };
    expect(byRule(json, "trigger/unknown-target")).toHaveLength(1);
    expect(byRule(json, "trigger/unknown-target", { variablePresets: { definition: TIER_DEFINITION } })).toHaveLength(0);
  });
  test("the unknown-target hint mentions the variable definition", () => {
    const findings = byRule({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "nope", setValue: 1 }],
    }, "trigger/unknown-target");
    expect(findings).toHaveLength(1);
    expect(findings[0].message).toContain("declare it in the variable definition");
  });
  test("expression/type-mismatch treats a definition variable like a known variable", () => {
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "{years} > 5" }] };
    const options: ISurveyLintOptions = {
      variablePresets: { definition: { elements: [{ type: "text", name: "years", inputType: "number" }] } },
    };
    expect(byRule(json, "expression/type-mismatch", options)).toHaveLength(0);
    expect(refs(json, options)).toHaveLength(0);
  });
});

describe("variable/collision (issue #11814)", () => {
  const definitionOptions: ISurveyLintOptions = { variablePresets: { definition: TIER_DEFINITION } };
  test("a survey question writing the variable's data key", () => {
    const findings = collisions({ elements: [{ type: "text", name: "tier" }] }, definitionOptions);
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("questionShadowed");
    expect(findings[0].severity).toBe("error");
    expect(findings[0].path.endsWith(".name")).toBe(true);
    expect(findings[0].elementName).toBe("tier");
    expect(findings[0].elementType).toBe("text");
    expect(findings[0].messageData).toMatchObject({
      name: "tier", variable: "tier", kind: "question", definitionQuestion: "tier",
    });
    expect(findings[0].related).toEqual([{ path: "variablePresets.definition", elementName: "tier" }]);
    expect(findings[0].message).toContain("setVariable");
  });
  test("a valueName spelling the key is reported on the valueName", () => {
    const findings = collisions({ elements: [{ type: "text", name: "q1", valueName: "tier" }] }, definitionOptions);
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("questionShadowed");
    expect(findings[0].path.endsWith(".valueName")).toBe(true);
    expect(findings[0].elementName).toBe("q1");
  });
  test.each(["html", "image"])("a display-only %s element stores no answer to collide with", type => {
    expect(collisions({ elements: [{ type: type, name: "tier" }] }, definitionOptions)).toHaveLength(0);
    expect(collisions({
      elements: [{ type: type, name: "display", valueName: "tier" }],
    }, definitionOptions)).toHaveLength(0);
  });
  test("a calculated value writes the same slot", () => {
    const findings = collisions({
      elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "tier", expression: "1 + 1" }],
    }, definitionOptions);
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("calculatedValueShadowed");
    expect(findings[0].path).toBe("calculatedValues[0]");
    expect(findings[0].messageData.kind).toBe("calculatedValue");
  });
  test("a question inside a dynamic panel template writes no root data key", () => {
    expect(collisions({
      elements: [{ type: "paneldynamic", name: "pd", templateElements: [{ type: "text", name: "tier" }] }],
    }, definitionOptions)).toHaveLength(0);
  });
  test("a matrix column named after the variable is not a collision either", () => {
    expect(collisions({
      elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "tier" }] }],
    }, definitionOptions)).toHaveLength(0);
  });
  test("a question whose valueName moves its key away is not reported under its name", () => {
    expect(collisions({
      elements: [{ type: "text", name: "tier", valueName: "somethingElse" }],
    }, definitionOptions)).toHaveLength(0);
  });
  test("the match is case-insensitive", () => {
    const findings = collisions({ elements: [{ type: "text", name: "Tier" }] }, definitionOptions);
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("Tier");
    expect(findings[0].messageData.variable).toBe("tier");
  });
  test("off by construction without a definition", () => {
    expect(collisions({ elements: [{ type: "text", name: "tier" }] })).toHaveLength(0);
    expect(collisions({ elements: [{ type: "text", name: "tier" }] },
      { knownVariables: ["tier"] })).toHaveLength(0);
    expect(collisions({ elements: [{ type: "text", name: "tier" }] },
      { variablePresets: { presets: [{ name: "gold", variables: {} }] } })).toHaveLength(0);
  });
  test("a definition variable spelling a built-in is left to the definition's own lint", () => {
    expect(collisions({ elements: [{ type: "text", name: "q1" }] },
      { variablePresets: { definition: { elements: [{ type: "text", name: "pageno" }] } } })).toHaveLength(0);
  });
  test("a setvalue trigger deliberately sharing the variable is not a collision", () => {
    const findings = collisions({
      elements: [{ type: "text", name: "q1" }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "tier", isVariable: true, setValue: "gold" }],
    }, definitionOptions);
    expect(findings).toHaveLength(0);
  });
  test("the severity is overridable like any other rule's", () => {
    const findings = collisions({ elements: [{ type: "text", name: "tier" }] },
      { variablePresets: { definition: TIER_DEFINITION }, rules: { "variable/collision": "warning" } });
    expect(findings).toHaveLength(1);
    expect(findings[0].severity).toBe("warning");
    expect(collisions({ elements: [{ type: "text", name: "tier" }] },
      { variablePresets: { definition: TIER_DEFINITION }, rules: { "variable/collision": "off" } })).toHaveLength(0);
  });
});

describe("variable/preset (issue #11814)", () => {
  const DEFINITION = {
    elements: [
      { type: "dropdown", name: "tier", choices: ["basic", "gold"] },
      { type: "text", name: "years", inputType: "number", max: 99 },
    ],
  };
  test("a preset the definition accepts is clean", () => {
    const result = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 'gold' and {years} > 5" }],
    }, {
      variablePresets: {
        definition: DEFINITION,
        presets: [{ name: "gold customer", variables: { tier: "gold", years: 12 } }],
      },
    });
    expect(result.findings).toEqual([]);
  });
  test("a value outside the choices of an optional dropdown", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: {
        definition: DEFINITION,
        presets: [{ name: "gold customer", variables: { tier: "platinum" } }],
      },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("invalidValue");
    expect(findings[0].severity).toBe("warning");
    expect(findings[0].path).toBe("variablePresets.presets[0].variables.tier");
    expect(findings[0].message).toContain("gold customer");
    expect(findings[0].message).toContain("tier");
    expect(findings[0].messageData).toMatchObject({ preset: "gold customer", variable: "tier", question: "tier" });
    expect(findings[0].messageData.errors.length).toBe(1);
    expect(findings[0].related).toEqual([{ path: "variablePresets.definition", elementName: "tier" }]);
  });
  test("a value outside the bounds of the definition question", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: { definition: DEFINITION, presets: [{ name: "p", variables: { years: 120 } }] },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("invalidValue");
    expect(findings[0].path).toBe("variablePresets.presets[0].variables.years");
  });
  test.each([
    { name: "tier" },
    { name: "customerTier", valueName: "tier" },
  ])("an invalid value's path preserves the preset key's case ($name)", question => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: {
        definition: { elements: [{ type: "dropdown", ...question, choices: ["gold"] }] },
        presets: [{ name: "p", variables: { Tier: "platinum" } }],
      },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("invalidValue");
    expect(findings[0].path).toBe("variablePresets.presets[0].variables.Tier");
    expect(findings[0].messageData).toMatchObject({ variable: "tier", question: question.name });
    expect(findings[0].related).toEqual([{ path: "variablePresets.definition", elementName: question.name }]);
  });
  test("case variants report on the last key, whose value is validated", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: {
        definition: DEFINITION,
        presets: [
          { name: "invalid", variables: { tier: "gold", Tier: "platinum" } },
          { name: "valid", variables: { tier: "platinum", Tier: "gold" } },
        ],
      },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("invalidValue");
    expect(findings[0].path).toBe("variablePresets.presets[0].variables.Tier");
  });
  test("the full verdict of the definition, validators included", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: {
        definition: {
          elements: [{
            type: "text", name: "code",
            validators: [{ type: "regex", regex: "^[A-Z]{3}$", text: "Three capital letters." }],
          }],
        },
        presets: [{ name: "p", variables: { code: "ab" } }],
      },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("invalidValue");
    expect(findings[0].messageData.errors).toEqual(["Three capital letters."]);
  });
  test("a required variable a preset leaves out is reported on the missing key", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: {
        definition: { elements: [{ type: "text", name: "tier", isRequired: true }] },
        presets: [{ name: "p", variables: {} }],
      },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("invalidValue");
    expect(findings[0].path).toBe("variablePresets.presets[0].variables.tier");
  });
  test("a key the definition does not declare", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: { definition: DEFINITION, presets: [{ name: "p", variables: { teir: "gold" } }] },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("unknownVariable");
    expect(findings[0].path).toBe("variablePresets.presets[0].variables.teir");
    expect(findings[0].messageData).toEqual({ reason: "unknownVariable", preset: "p", variable: "teir" });
  });
  test("a misspelled key carries the closest declared name", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: { definition: DEFINITION, presets: [{ name: "p", variables: { tierr: "gold" } }] },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].suggestion).toBe("tier");
    expect(findings[0].message).toContain("Did you mean \"tier\"?");
  });
  test("two presets sharing a name, reported on the second", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: {
        presets: [{ name: "gold", variables: {} }, { name: "gold", variables: {} }],
      },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("duplicateName");
    expect(findings[0].path).toBe("variablePresets.presets[1]");
    expect(findings[0].related).toEqual([{ path: "variablePresets.presets[0]" }]);
  });
  test("preset names are case-sensitive", () => {
    expect(presetFindings(EMPTY_SURVEY, {
      variablePresets: { presets: [{ name: "gold", variables: {} }, { name: "Gold", variables: {} }] },
    })).toHaveLength(0);
  });
  test("structural defects", () => {
    const notAnArray = presetFindings(EMPTY_SURVEY, { variablePresets: { presets: <any>{} } });
    expect(notAnArray).toHaveLength(1);
    expect(notAnArray[0].reason).toBe("presetsNotAnArray");
    expect(notAnArray[0].path).toBe("variablePresets.presets");

    const notAnObject = presetFindings(EMPTY_SURVEY, { variablePresets: { presets: <any>["gold"] } });
    expect(notAnObject).toHaveLength(1);
    expect(notAnObject[0].reason).toBe("presetNotAnObject");
    expect(notAnObject[0].path).toBe("variablePresets.presets[0]");

    const noName = presetFindings(EMPTY_SURVEY, { variablePresets: { presets: <any>[{ variables: {} }] } });
    expect(noName).toHaveLength(1);
    expect(noName[0].reason).toBe("presetNameMissing");
    expect(noName[0].path).toBe("variablePresets.presets[0]");

    const noVariables = presetFindings(EMPTY_SURVEY, { variablePresets: { presets: <any>[{ name: "gold" }] } });
    expect(noVariables).toHaveLength(1);
    expect(noVariables[0].reason).toBe("presetVariablesNotAnObject");
    expect(noVariables[0].path).toBe("variablePresets.presets[0].variables");
  });
  test("a definition that is not an object stops the rest", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: { definition: <any>"x", presets: [{ name: "p", variables: { teir: 1 } }] },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("definitionNotAnObject");
    expect(findings[0].path).toBe("variablePresets.definition");
  });
  test("without a definition only the structural reasons and duplicateName run", () => {
    const findings = presetFindings(EMPTY_SURVEY, {
      variablePresets: {
        presets: [
          { name: "gold", variables: { anything: "at all" } },
          { name: "gold", variables: {} },
        ],
      },
    });
    expect(findings.map(f => f.reason)).toEqual(["duplicateName"]);
  });
  test("an empty definition and an empty container are valid and declare nothing", () => {
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 1" }] };
    // a container with no definition, a definition with no question, and an empty host model:
    // the variable table is empty in all three, which is not a defect of its own
    [
      <ISurveyLintOptions>{ variablePresets: {} },
      <ISurveyLintOptions>{ variablePresets: { definition: {} } },
      <ISurveyLintOptions>{ variablePresets: { definition: { elements: [] } } },
      <ISurveyLintOptions>{ variableDefinitionModel: new SurveyModel() },
    ].forEach(options => {
      expect(presetFindings(json, options)).toHaveLength(0);
      expect(collisions(json, options)).toHaveLength(0);
      // and nothing suddenly resolves
      expect(refs(json, options)).toHaveLength(1);
    });
  });
  test("the rule does nothing without the option", () => {
    expect(presetFindings(EMPTY_SURVEY)).toHaveLength(0);
    expect(presetFindings(EMPTY_SURVEY, { knownVariables: ["tier"] })).toHaveLength(0);
  });
  test("the container itself must be an object", () => {
    expect(() => lintSurvey(EMPTY_SURVEY, { variablePresets: <any>"x" })).toThrow(TypeError);
    expect(() => lintSurvey(EMPTY_SURVEY, { variablePresets: <any>[] })).toThrow(TypeError);
    expect(() => lintSurvey(EMPTY_SURVEY, { variablePresets: <any>new SurveyModel() })).toThrow(TypeError);
    expect(() => lintSurvey(EMPTY_SURVEY, { variablePresets: undefined })).not.toThrow();
  });
  test("a variableDefinitionModel must be a SurveyModel", () => {
    expect(() => lintSurvey(EMPTY_SURVEY, { variableDefinitionModel: <any>"x" })).toThrow(TypeError);
    expect(() => lintSurvey(EMPTY_SURVEY, { variableDefinitionModel: <any>{ pages: [] } })).toThrow(TypeError);
  });
  test("the definition is linted separately, by the host", () => {
    const definition = { elements: [{ type: "text", name: "pageno" }] };
    // nothing is reported on it through the option
    expect(lintSurvey(EMPTY_SURVEY, { variablePresets: { definition: definition } })
      .findings.filter(f => f.ruleId === "name/shadowing")).toHaveLength(0);
    // and everything is reported when the host lints it as the survey it is
    const own = lintSurvey(definition).findings.filter(f => f.ruleId === "name/shadowing");
    expect(own).toHaveLength(1);
    expect(own[0].reason).toBe("builtInVariable");
  });
});

describe("variableDefinitionModel (issue #11814)", () => {
  const DEFINITION = { elements: [{ type: "dropdown", name: "tier", choices: ["basic", "gold"] }] };
  const SURVEY = { elements: [{ type: "text", name: "tier", visibleIf: "{tier} = 'gold'" }] };
  const PRESETS = [{ name: "gold customer", variables: { tier: "platinum" } }];

  test("a model and its JSON produce the same findings", () => {
    const fromJson = lintSurvey(SURVEY, {
      variablePresets: { definition: DEFINITION, presets: PRESETS },
    });
    const model = new SurveyModel(DEFINITION);
    const fromModel = lintSurvey(SURVEY, {
      variableDefinitionModel: model, variablePresets: { presets: PRESETS },
    });
    expect(fromModel.findings).toEqual(fromJson.findings);
    // the three kinds of finding the definition takes part in are all decided here
    expect(fromModel.findings.some(f => f.ruleId === "variable/collision")).toBe(true);
    expect(fromModel.findings.some(f => f.ruleId === "variable/preset")).toBe(true);
    expect(fromModel.findings.some(f => f.ruleId === "reference/unknown")).toBe(false);
    model.dispose();
  });
  test("the model wins over the JSON definition", () => {
    const model = new SurveyModel(TIER_DEFINITION);
    const findings = refs({
      elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 1 and {x} = 2" }],
    }, {
      variableDefinitionModel: model,
      variablePresets: { definition: { elements: [{ type: "text", name: "x" }] } },
    });
    expect(findings).toHaveLength(1);
    expect(findings[0].messageData.name).toBe("x");
    model.dispose();
  });
  test("a JSON definition that is not an object is not reported next to a model", () => {
    const model = new SurveyModel(TIER_DEFINITION);
    expect(presetFindings(EMPTY_SURVEY, {
      variableDefinitionModel: model, variablePresets: { definition: <any>"x" },
    })).toHaveLength(0);
    model.dispose();
  });
  test("what only a model can carry: choices assigned in code", () => {
    const model = new SurveyModel({ elements: [{ type: "dropdown", name: "tier" }] });
    (<any>model.getQuestionByName("tier")).choices = ["basic", "gold"];
    const outside = presetFindings(EMPTY_SURVEY, {
      variableDefinitionModel: model,
      variablePresets: { presets: [{ name: "p", variables: { tier: "platinum" } }] },
    });
    expect(outside).toHaveLength(1);
    expect(outside[0].reason).toBe("invalidValue");
    expect(presetFindings(EMPTY_SURVEY, {
      variableDefinitionModel: model,
      variablePresets: { presets: [{ name: "p", variables: { tier: "gold" } }] },
    })).toHaveLength(0);
    model.dispose();
  });
  test("a model alone, without a variablePresets object", () => {
    const model = new SurveyModel(TIER_DEFINITION);
    const options: ISurveyLintOptions = { variableDefinitionModel: model };
    expect(refs({ elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 1" }] }, options)).toHaveLength(0);
    expect(collisions({ elements: [{ type: "text", name: "tier" }] }, options)).toHaveLength(1);
    expect(presetFindings({ elements: [{ type: "text", name: "tier" }] }, options)).toHaveLength(0);
    model.dispose();
  });
  test("the model is borrowed, not owned", () => {
    const model = new SurveyModel(TIER_DEFINITION);
    const spy = vi.spyOn(model, "dispose");
    const options: ISurveyLintOptions = {
      variableDefinitionModel: model,
      variablePresets: { presets: [{ name: "p", variables: { tier: "gold" } }] },
    };
    const first = lintSurvey(SURVEY, options);
    expect(spy).not.toHaveBeenCalled();
    expect(model.getAllQuestions()).toHaveLength(1);
    const second = lintSurvey(SURVEY, options);
    expect(second.findings).toEqual(first.findings);
    spy.mockRestore();
    model.dispose();
  });
  test("the documented side effect: the model holds the last checked preset's values", () => {
    const model = new SurveyModel({
      elements: [{ type: "text", name: "tier" }, { type: "text", name: "years", inputType: "number" }],
    });
    lintSurvey(EMPTY_SURVEY, {
      variableDefinitionModel: model,
      variablePresets: {
        presets: [
          { name: "first", variables: { tier: "basic", years: 1 } },
          { name: "last", variables: { tier: "gold", years: 12 } },
        ],
      },
    });
    expect(model.data).toEqual({ tier: "gold", years: 12 });
    expect(model.getAllQuestions().map(q => q.name)).toEqual(["tier", "years"]);
    model.dispose();
  });
});

describe("variable presets isolation (issue #11814)", () => {
  test("two runs with different definitions do not leak into each other", () => {
    const withTier = { variablePresets: { definition: TIER_DEFINITION } };
    const withRole = { variablePresets: { definition: { elements: [{ type: "text", name: "role" }] } } };
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 1" }] };
    expect(refs(json, withTier)).toHaveLength(0);
    expect(refs(json, withRole)).toHaveLength(1);
    expect(refs(json, withTier)).toHaveLength(0);
  });
  test("a model run and a JSON run do not leak into each other either", () => {
    const model = new SurveyModel({ elements: [{ type: "text", name: "role" }] });
    const json = { elements: [{ type: "text", name: "q1", visibleIf: "{tier} = 1" }] };
    expect(refs(json, { variableDefinitionModel: model })).toHaveLength(1);
    expect(refs(json, { variablePresets: { definition: TIER_DEFINITION } })).toHaveLength(0);
    expect(refs(json, { variableDefinitionModel: model })).toHaveLength(1);
    model.dispose();
  });
  test("the container is not mutated by a run", () => {
    const container = {
      definition: { elements: [{ type: "dropdown", name: "tier", choices: ["basic", "gold"] }] },
      presets: [{ name: "gold customer", variables: { tier: "platinum" } }],
    };
    const before = JSON.parse(JSON.stringify(container));
    lintSurvey({ elements: [{ type: "text", name: "tier" }] }, { variablePresets: container });
    expect(JSON.parse(JSON.stringify(container))).toEqual(before);
  });
  test("the run's companion is disposed, also when a rule throws", () => {
    const spy = vi.spyOn(SurveyVariablePresets.prototype, "dispose");
    const model = new SurveyModel(TIER_DEFINITION);
    const modelSpy = vi.spyOn(model, "dispose");
    const options: ISurveyLintOptions = { variableDefinitionModel: model };
    lintSurvey(EMPTY_SURVEY, options);
    expect(spy).toHaveBeenCalledTimes(1);

    const rule = allRules[0];
    const original = rule.run;
    rule.run = () => { throw new Error("a rule threw"); };
    try {
      expect(() => lintSurvey(EMPTY_SURVEY, options)).toThrow("a rule threw");
    } finally {
      rule.run = original;
    }
    expect(spy).toHaveBeenCalledTimes(2);
    // and the host model survived both disposals
    expect(modelSpy).not.toHaveBeenCalled();
    expect(model.getAllQuestions()).toHaveLength(1);
    spy.mockRestore();
    modelSpy.mockRestore();
    model.dispose();
  });
});

// Nested data (prompt 15, decision V5): the definition describes an object variable, set as
// { users: { tier, name } } and read as {users.tier}.
describe("the linter with a nested variable definition", () => {
  const NESTED_DEFINITION = { elements: [
    { type: "panel", name: "user", valueName: "users", title: "User", elements: [
      { type: "dropdown", name: "tier", title: "Tier", choices: ["gold", "silver"], isRequired: true },
      { type: "text", name: "name", title: "Name" }] },
    { type: "text", name: "role" }] };
  const nestedOptions = (presets?: Array<any>): ISurveyLintOptions =>
    ({ variablePresets: { definition: NESTED_DEFINITION, presets: presets } });
  const withCondition = (expr: string): any => ({ elements: [{ type: "text", name: "q1", visibleIf: expr }] });

  test("{users} is the object and {users.tier} its field, in any letter case", () => {
    const json = { elements: [
      { type: "text", name: "q1", visibleIf: "{users.tier} = 'gold' and {Users.Tier} = 'gold' and {users} notempty and {role} = 'a'",
        title: "Hi {users.name}" },
      { type: "expression", name: "e1", expression: "{users.name} + '!'" }],
    calculatedValues: [{ name: "cv", expression: "{users.tier}" }] };
    expect(lintSurvey(json, nestedOptions()).findings).toEqual([]);
  });
  test("an unknown field of an object variable is reported with the closest field", () => {
    const findings = refs(withCondition("{users.nope} = 1"), nestedOptions());
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("notFound");
    expect(findings[0].messageData.name).toBe("users.nope");
    expect(findings[0].suggestion).toBe("users.name");
    expect(findings[0].fix.edits).toEqual([{ op: "set", path: "elements[0].visibleIf", value: "{users.name} = 1" }]);
  });
  test("an inner question is no variable: {tier} suggests users.tier", () => {
    const findings = refs(withCondition("{tier} = 'gold'"), nestedOptions());
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("notFound");
    expect(findings[0].messageData.name).toBe("tier");
    expect(findings[0].suggestion).toBe("users.tier");
  });
  test("a dotted key of a flat definition is no variable: {a.b} is unknown and nothing suggests it", () => {
    const options: ISurveyLintOptions = { variablePresets: { definition: { elements: [{ type: "text", name: "x", valueName: "a.b" }] },
      presets: [{ name: "P", variables: { b: 1, "a.b": 2 } }] } };
    const findings = refs(withCondition("{b} = 1 and {a.b} = 1"), options);
    expect(findings.map(f => f.messageData.name)).toEqual(["b", "a.b"]);
    expect(findings.map(f => f.suggestion)).toEqual([undefined, undefined]);
    const preset = presetFindings(EMPTY_SURVEY, options);
    expect(preset.map(f => f.reason + " @ " + f.path)).toEqual([
      "unknownVariable @ variablePresets.presets[0].variables.a.b",
      "unknownVariable @ variablePresets.presets[0].variables.b"]);
    expect(byRule(EMPTY_SURVEY, "variable/dotted-key", options).map(f => f.reason)).toEqual(["questionKey"]);
  });
  test("a path below a question field is not checked, as for a flat variable", () => {
    expect(refs(withCondition("{users.tier.length} > 1 and {role.x} = 1"), nestedOptions())).toHaveLength(0);
  });
  test("two levels, and a dotted inner valueName that declares nothing", () => {
    const options: ISurveyLintOptions = { variablePresets: { definition: { pages: [{ name: "p1", valueName: "page", elements: [
      { type: "panel", name: "user", valueName: "users", elements: [
        { type: "text", name: "tier" }, { type: "text", name: "q2", valueName: "a.b" }] }] }] } } };
    expect(refs(withCondition("{page.users.tier} = 1 and {page.users} notempty"), options)).toHaveLength(0);
    const findings = refs(withCondition("{page.users.tiir} = 1 and {page.user.tier} = 1 and {page.users.a} = 1 and {page.users.a.b} = 1"), options);
    expect(findings.map(f => f.messageData.name)).toEqual(["page.users.tiir", "page.user.tier", "page.users.a", "page.users.a.b"]);
    expect(findings[0].suggestion).toBe("page.users.tier");
  });
  test("a knownVariables entry of the same name keeps the object unchecked", () => {
    const options = nestedOptions();
    options.knownVariables = ["users"];
    expect(refs(withCondition("{users.nope} = 1"), options)).toHaveLength(0);
  });
  test("choice checks against a definition variable are not added, flat or nested", () => {
    const flat: ISurveyLintOptions = { variablePresets: { definition: { elements: [{ type: "dropdown", name: "tier", choices: ["gold"] }] } } };
    expect(lintSurvey(withCondition("{tier} = 'bronze'"), flat).findings).toEqual([]);
    expect(lintSurvey(withCondition("{users.tier} = 'bronze'"), nestedOptions()).findings).toEqual([]);
  });
  test("variable/preset: an unknown field is reported on its path", () => {
    const findings = presetFindings(EMPTY_SURVEY, nestedOptions([
      { name: "Gold", variables: { users: { tier: "gold", nope: 1 }, tier: "gold" } }]));
    expect(findings.map(f => f.reason + " @ " + f.path)).toEqual([
      "unknownVariable @ variablePresets.presets[0].variables.tier",
      "unknownVariable @ variablePresets.presets[0].variables.users.nope"]);
    expect(findings[1].messageData).toMatchObject({ preset: "Gold", variable: "users.nope" });
    expect(findings[1].suggestion).toBe("users.name");
    expect(findings[0].suggestion).toBe("users.tier");
  });
  test("variable/preset: an invalid field value is reported at its path in the input's spelling", () => {
    const findings = presetFindings(EMPTY_SURVEY, nestedOptions([
      { name: "Bronze", variables: { Users: { Tier: "bronze" } } },
      { name: "NoTier", variables: { USERS: { name: "Ann" } } },
      { name: "NotAnObject", variables: { users: "gold" } }]));
    expect(findings.map(f => f.reason + " @ " + f.path)).toEqual([
      "invalidValue @ variablePresets.presets[0].variables.Users.Tier",
      "invalidValue @ variablePresets.presets[1].variables.USERS.tier",
      "invalidValue @ variablePresets.presets[2].variables.users"]);
    expect(findings[0].messageData).toMatchObject({ variable: "users.tier", question: "tier" });
    expect(findings[0].related).toEqual([{ path: "variablePresets.definition", elementName: "tier" }]);
    expect(findings[2].messageData).toMatchObject({ variable: "users", question: "user", errors: ["The value is incorrect."] });
    expect(findings[2].related).toEqual([{ path: "variablePresets.definition", elementName: "user" }]);
  });
  test("variable/preset: a dotted input key spelling a field's path does not take the field's findings", () => {
    const options: ISurveyLintOptions = { variablePresets: {
      definition: { elements: [
        { type: "panel", name: "user", valueName: "users", elements: [{ type: "text", name: "tier", isRequired: true }] }] },
      presets: [{ name: "P", variables: { "Users.Tier": 1, users: { TIER: "" } } }] } };
    const findings = presetFindings(EMPTY_SURVEY, options);
    expect(findings.map(f => f.reason + " @ " + f.path)).toEqual([
      "unknownVariable @ variablePresets.presets[0].variables.Users.Tier",
      "invalidValue @ variablePresets.presets[0].variables.users.TIER"]);
    expect(findings[1].messageData).toMatchObject({ variable: "users.tier", question: "tier" });
    // the declared field it spells is not offered back as a suggestion
    expect(findings[0].suggestion).toBeUndefined();
    expect(findings[0].message).toBe("Preset \"P\" sets \"Users.Tier\", which the variable definition does not declare.");
  });
  test("variable/preset: a valid nested preset is clean", () => {
    expect(presetFindings(EMPTY_SURVEY, nestedOptions([
      { name: "Gold", variables: { users: { tier: "gold", name: "Ann" }, role: "admin" } }]))).toEqual([]);
  });
  test("variable/collision: a root question named after the object variable collides, an inner name does not", () => {
    const findings = collisions({ elements: [{ type: "text", name: "users" }, { type: "text", name: "tier" }] }, nestedOptions());
    expect(findings).toHaveLength(1);
    expect(findings[0].reason).toBe("questionShadowed");
    expect(findings[0].messageData).toMatchObject({ name: "users", variable: "users", definitionQuestion: "user" });
    expect(findings[0].related).toEqual([{ path: "variablePresets.definition", elementName: "user" }]);
  });
  test("variable/collision: a calculated value named after the object variable", () => {
    const findings = collisions({ elements: [{ type: "text", name: "q1" }],
      calculatedValues: [{ name: "users", expression: "1" }, { name: "tier", expression: "1" }] }, nestedOptions());
    expect(findings.map(f => f.reason)).toEqual(["calculatedValueShadowed"]);
    expect(findings[0].messageData).toMatchObject({ variable: "users", definitionQuestion: "user" });
  });
  test("name/shadowing: a container key equal to the object variable", () => {
    const json = { elements: [{ type: "panel", name: "p", valueName: "users", elements: [{ type: "text", name: "street" }] }] };
    const findings = byRule(json, "name/shadowing", nestedOptions());
    expect(findings.map(f => f.reason + " @ " + f.path)).toEqual(["containerKeyShadowed @ elements[0].valueName"]);
    expect(findings[0].messageData.kind).toBe("variable");
  });
});

describe("variable/dotted-key", () => {
  const dottedKeys = (options: ISurveyLintOptions): Array<ILintFinding> => byRule(EMPTY_SURVEY, "variable/dotted-key", options);
  const withDefinition = (definition: any): ISurveyLintOptions => ({ variablePresets: { definition: definition } });

  test("a question whose data key holds a dot is reported on the definition", () => {
    const findings = dottedKeys(withDefinition({ elements: [
      { type: "text", name: "tier" }, { type: "text", name: "q2", valueName: "a.b" }, { type: "dropdown", name: "c.d" }] }));
    expect(findings.map(f => f.reason + " @ " + f.path)).toEqual([
      "questionKey @ variablePresets.definition", "questionKey @ variablePresets.definition"]);
    expect(findings.map(f => f.severity)).toEqual(["error", "error"]);
    expect(findings[0].messageData).toMatchObject({ name: "q2", key: "a.b", property: "valueName", elementType: "text" });
    expect(findings[1].messageData).toMatchObject({ name: "c.d", key: "c.d", property: "name", elementType: "dropdown" });
    expect(findings[0].related).toEqual([{ path: "variablePresets.definition", elementName: "q2" }]);
    expect(findings[0].message).toBe("The variable definition question \"q2\" has the data key \"a.b\", which holds a dot. " +
      "A variable key cannot hold one, so the question declares no variable.");
  });
  test("a nesting panel or page whose key holds a dot is reported once, not its questions", () => {
    const findings = dottedKeys(withDefinition({ pages: [
      { name: "p1", elements: [{ type: "panel", name: "user", valueName: "us.ers", elements: [
        { type: "text", name: "tier" }, { type: "text", name: "x.y" }] }] },
      { name: "p2", valueName: "pa.ge", elements: [{ type: "text", name: "role" }] }] }));
    expect(findings.map(f => f.reason + " " + f.messageData.name + " " + f.messageData.key)).toEqual([
      "containerKey user us.ers", "containerKey p2 pa.ge"]);
    expect(findings[1].message).toBe("The variable definition page \"p2\" has the data key \"pa.ge\", which holds a dot. " +
      "A variable key cannot hold one, so the page declares no object variable and none of its questions is a variable.");
  });
  test("a numeric valueName is still reported as the valueName", () => {
    const findings = dottedKeys(withDefinition({ elements: [{ type: "text", name: "q1", valueName: 1.5 }] }));
    expect(findings.map(f => f.messageData)).toMatchObject([{ name: "q1", key: "1.5", property: "valueName" }]);
  });
  test("a dotted panel name that writes no key is not reported", () => {
    // without a valueName a panel does not nest in the default mode, so its name is no data key
    expect(dottedKeys(withDefinition({ elements: [
      { type: "panel", name: "a.b", elements: [{ type: "text", name: "tier" }] }] }))).toEqual([]);
  });
  test("a definition model is checked too; no definition reports nothing", () => {
    const model = new SurveyModel({ elements: [{ type: "text", name: "a.b" }] });
    const findings = dottedKeys({ variablePresets: {}, variableDefinitionModel: model });
    expect(findings.map(f => f.messageData.name)).toEqual(["a.b"]);
    model.dispose();
    expect(dottedKeys({ variablePresets: { presets: [] } })).toEqual([]);
    expect(dottedKeys({})).toEqual([]);
  });
});

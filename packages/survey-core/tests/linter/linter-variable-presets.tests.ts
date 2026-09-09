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

import { ILintRule, LintContext } from "../rule";
import { equalsCI } from "../expression-utils";
import { CalculatedValueRecord, ElementRecord, SurveyIndex } from "../symbols";
import { ILintRelated } from "../types";
import { SurveyLintReasons } from "../reasons";

const reasons = SurveyLintReasons["variable/collision"];

// The definition is a document of its own, and the companion holds it as a model rather than as
// JSON paths, so a finding addresses it coarsely: the path names the definition, elementName the
// question in it. Computing "pages[i].elements[j]" out of the model's structure is not worth the
// code for a pointer a UI resolves by name anyway - and a host that handed in a model has no JSON
// document for such a path to address in the first place.
const DEFINITION_PATH = "variablePresets.definition";

function definitionRelated(questionName: string): Array<ILintRelated> {
  return [{ path: DEFINITION_PATH, elementName: questionName }];
}

function dataNameOf(record: ElementRecord): string {
  return record.valueName || record.name;
}

// Only a root question shares a data key with a host variable: a question inside a dynamic panel
// template or a matrix cell writes into its container's value, and its name is addressed through
// that container's scope. Display-only elements have no value to overwrite.
function isRootDataKey(record: ElementRecord, name: string): boolean {
  return record.kind === "question" && record.scope.length === 0 && record.valueType.shape !== "none" &&
    equalsCI(dataNameOf(record), name);
}

// findByDataName's order - a name answers before a valueName - narrowed to the records that
// really write the key. findByDataName itself answers with the first record registered under the
// name, which may be a template question that writes no root key at all.
function findRootDataQuestion(index: SurveyIndex, name: string): ElementRecord | undefined {
  const named = index.byName.get(name).filter(record => isRootDataKey(record, name));
  if (named.length > 0) return named[0];
  return index.byValueName.get(name).filter(record => isRootDataKey(record, name))[0];
}

function reportQuestion(ctx: LintContext, variable: string, definitionQuestion: string,
  record: ElementRecord): void {
  const dataName = dataNameOf(record);
  const prop = record.valueName ? "valueName" : "name";
  ctx.report({
    message: "The variable definition declares \"" + variable + "\", which is also the data key of " +
      "question \"" + record.name + "\" - setVariable(\"" + dataName + "\") deletes the answer " +
      "stored under that key, and {" + dataName + "} answers the host value from then on.",
    path: record.path + "." + prop,
    reason: reasons.questionShadowed,
    messageData: {
      name: dataName, variable: variable, kind: "question",
      definitionQuestion: definitionQuestion,
    },
    elementName: record.name,
    elementType: record.type,
    related: definitionRelated(definitionQuestion),
  });
}

function reportCalculatedValue(ctx: LintContext, variable: string, definitionQuestion: string,
  record: CalculatedValueRecord): void {
  ctx.report({
    message: "The variable definition declares \"" + variable + "\", which is also the name of " +
      "calculated value \"" + record.name + "\" - a calculated value stores its result through " +
      "setVariable too, so both write the same slot and whichever runs last wins.",
    path: record.path,
    reason: reasons.calculatedValueShadowed,
    messageData: {
      name: record.name, variable: variable, kind: "calculatedValue",
      definitionQuestion: definitionQuestion,
    },
    elementName: record.name,
    elementType: "calculatedvalue",
    related: definitionRelated(definitionQuestion),
  });
}

// A host variable and a survey data key of the same name are not two things that happen to be
// spelled alike: the survey stores answers in valuesHash, setVariable() deletes valuesHash[name]
// before storing the variable (src/survey.ts, "delete this.valuesHash[name]"), and the value
// getter consults the variables hash before the data. So the respondent's answer is gone the
// moment the host injects the variable, and every {name} reads the host value from then on.
//
// Off by construction when no definition was given: the name table is empty.
export const variableCollisionRule: ILintRule = {
  id: "variable/collision",
  defaultSeverity: "error",
  run(ctx: LintContext): void {
    const presets = ctx.variablePresets;
    if (!presets) return;
    ctx.index.definitionVariables.forEach(variable => {
      const definitionQuestion = presets.getVariableQuestion(variable);
      if (!definitionQuestion) return;
      const question = findRootDataQuestion(ctx.index, variable);
      if (!!question) {
        reportQuestion(ctx, variable, definitionQuestion.name, question);
      }
      const calculatedValue = ctx.index.calculatedValues.get(variable);
      if (!!calculatedValue) {
        reportCalculatedValue(ctx, variable, definitionQuestion.name, calculatedValue);
      }
    });
  },
};

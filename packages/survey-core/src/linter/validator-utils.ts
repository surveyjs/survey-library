import { LintContext } from "./rule";
import { ElementRecord, getEffectiveType } from "./symbols";
import { getClassChain, isDescendantOf } from "./metadata";
import { getInputType } from "./value-types";
import { ILintResolvedSettings } from "./lint-settings";

// One validator as the JSON writes it. The three classes carrying a "validators" array -
// question, matrix column, multiple-text item - are all element records, so the arrays are
// reached from the index without the walker keeping records of its own.
export interface ValidatorEntry {
  type: string;
  json: any;
  path: string;
  owner: ElementRecord;
}

// The inputTypes each validator applies to, mirroring QuestionTextModel.getSupportedValidators
// (question_text.ts): the same narrowing, over the type read from the JSON.
const TEXT_INPUT_TYPES = ["text", "email", "tel", "password", "url"];
const VALIDATOR_INPUT_TYPES: { [validator: string]: Array<string> } = {
  text: TEXT_INPUT_TYPES,
  regex: TEXT_INPUT_TYPES,
  email: ["email"],
  numeric: ["number", "range"],
};

// The question class a validator is judged against: a matrix column validates its cell, and a
// multiple-text item is edited by a text question.
export function getValidatorOwnerType(record: ElementRecord): string {
  return record.kind === "multipletextitem" ? "text" : getEffectiveType(record);
}

// Question.getSupportedValidators, read off the JSON instead of a built model: the settings
// entry of every class up the chain, then the inputType narrowing a text question applies.
export function getSupportedValidators(record: ElementRecord,
  lintSettings: ILintResolvedSettings): Array<string> {
  const type = getValidatorOwnerType(record);
  const res: Array<string> = [];
  getClassChain(type).forEach(className => {
    const supported = lintSettings.supportedValidators[className];
    if (!Array.isArray(supported)) return;
    supported.forEach(name => {
      if (res.indexOf(name) < 0) res.push(name);
    });
  });
  if (type !== "text" && !isDescendantOf(type, "text")) return res;
  const inputType = getInputType(record.json);
  return res.filter(name => {
    const inputTypes = VALIDATOR_INPUT_TYPES[name];
    return !inputTypes || inputTypes.indexOf(inputType) > -1;
  });
}

export function forEachValidator(ctx: LintContext, cb: (entry: ValidatorEntry) => void): void {
  ctx.index.allElements.forEach(record => {
    const validators = record.json ? record.json.validators : undefined;
    if (!Array.isArray(validators)) return;
    validators.forEach((validator, i) => {
      if (!validator || typeof validator !== "object") return;
      cb({
        type: typeof validator.type === "string" ? validator.type : "",
        json: validator,
        path: record.path + ".validators[" + i + "]",
        owner: record,
      });
    });
  });
}

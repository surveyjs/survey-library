import { LintContext } from "./rule";
import { ElementRecord, getEffectiveType } from "./symbols";

// One validator as the JSON writes it. The three classes carrying a "validators" array -
// question, matrix column, multiple-text item - are all element records, so the arrays are
// reached from the index without the walker keeping records of its own.
export interface ValidatorEntry {
  type: string;
  json: any;
  path: string;
  owner: ElementRecord;
}

// The question class a validator is judged against: a matrix column validates its cell, and a
// multiple-text item is edited by a text question.
export function getValidatorOwnerType(record: ElementRecord): string {
  return record.kind === "multipletextitem" ? "text" : getEffectiveType(record);
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

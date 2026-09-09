import type { IQuestionChoiceDescription, IQuestionConstraints } from "survey-core";
import type { IInterviewItem } from "./interview-types";

// The answers of a batch call as a JSON Schema, so that an agent's function-calling API constrains
// what it may send instead of the interview refusing it afterwards. Draft 2020-12 keywords only, and
// no "$schema": every provider that accepts a schema accepts this subset, and none of them fetches
// the meta-schema at run time.
//
// It is built from the item records alone - the same records describeAll() renders - and never takes
// a second look at the model: what the text says and what the schema says can then not disagree.
// Being a function of the current state, it is also the answer to "what may be sent now": an agent
// that answers hasPet sees petType in the next schema and not before.

// A bound the model expresses as a date has no JSON Schema keyword: draft 2020-12 dropped
// formatMinimum. It goes into the description as text, which is where an agent reads it anyway.
const DATE_FORMATS: { [inputType: string]: string } = {
  "datetime-local": "date-time",
  "time": "time",
};

export function createAnswerSchema(items: Array<IInterviewItem>, commentSuffix: string): any {
  const properties: any = {};
  const required: Array<string> = [];
  items.forEach(item => {
    // A container and a question with no plain input are in the document, so the agent knows they
    // exist, and never in the schema: there is no value it could send for either.
    if (item.unsupported === true) return;
    properties[item.name] = createProperty(item);
    if (!!item.comment) {
      properties[item.name + commentSuffix] = createCommentProperty(item);
    }
    // A disabled item is offered read-only rather than left out, so an agent is told the question
    // exists and that an enableIf currently refuses it - and it is never demanded.
    if (item.required === true && item.disabled !== true) {
      required.push(item.name);
    }
  });
  return { type: "object", properties: properties, required: required, additionalProperties: false };
}

function createProperty(item: IInterviewItem): any {
  const res: any = { title: item.title };
  const notes: Array<string> = [];
  addValueType(res, item);
  addConstraints(res, item, notes);
  const description = getDescription(item, notes);
  if (!!description) res.description = description;
  if (item.disabled === true) res.readOnly = true;
  return res;
}

// The "other" choice is a value like any other, and the text that belongs with it is a second
// property named the way the model names it in the data - <name> + settings.commentSuffix - so the
// key the schema advertises is the key answerAll() routes to question.comment.
function createCommentProperty(item: IInterviewItem): any {
  return { type: "string", description: "The free-text comment that belongs with the answer to " + item.name + "." };
}

// One rule for every question that offers a set of values: enum. A boolean question therefore comes
// out as enum: [true, false] - or as its valueTrue/valueFalse pair - rather than as type: boolean,
// and there is no case to get wrong.
function addValueType(res: any, item: IInterviewItem): void {
  const choices = getEnumChoices(item);
  if (item.valueType === "array") {
    res.type = "array";
    if (!!choices) res.items = { enum: choices };
    res.uniqueItems = true;
    return;
  }
  if (!!choices) {
    res.enum = choices;
    return;
  }
  if (item.valueType === "number") {
    res.type = "number";
    return;
  }
  if (item.valueType === "boolean") {
    res.type = "boolean";
    return;
  }
  if (item.valueType === "date") {
    res.type = "string";
    res.format = DATE_FORMATS[item.inputType] || "date";
    return;
  }
  res.type = "string";
  // inputType "email" validates as an address without putting an EmailValidator in the list, so it
  // reaches the record as an input type and nothing else. The constraint is real all the same.
  if (item.inputType === "email") res.format = "email";
}

function getEnumChoices(item: IInterviewItem): Array<any> {
  if (item.choicesUnknown === true) return undefined;
  // A rating reports its items under rateValues; every other pick-one question under choices.
  const items: Array<IQuestionChoiceDescription> = item.choices || item.rateValues;
  return !!items && items.length > 0 ? items.map(choice => choice.value) : undefined;
}

function addConstraints(res: any, item: IInterviewItem, notes: Array<string>): void {
  const constraints: IQuestionConstraints = item.constraints;
  if (!constraints) return;
  addBound(res, item, notes, "minimum", "min", constraints.min);
  addBound(res, item, notes, "maximum", "max", constraints.max);
  if (constraints.minLength !== undefined) res.minLength = constraints.minLength;
  if (constraints.maxLength !== undefined) res.maxLength = constraints.maxLength;
  if (constraints.minCount !== undefined) res.minItems = constraints.minCount;
  if (constraints.maxCount !== undefined) res.maxItems = constraints.maxCount;
  if (constraints.regex !== undefined) res.pattern = constraints.regex;
  if (constraints.format === "email") res.format = "email";
  // multipleOf counts from zero and the model's step counts from min, so the two agree only when
  // there is no lower bound or it is zero. Anywhere else the step goes unreported rather than wrong.
  if (constraints.step !== undefined && (constraints.min === undefined || constraints.min === 0)) {
    res.multipleOf = constraints.step;
  }
  if (!!constraints.mask) {
    notes.push("mask " + constraints.mask.type + (!!constraints.mask.pattern ? " " + constraints.mask.pattern : ""));
  }
  if (!!constraints.expression) {
    notes.push("expression " + constraints.expression);
  }
}

function addBound(res: any, item: IInterviewItem, notes: Array<string>, keyword: string,
  label: string, value: any): void {
  if (value === undefined || value === null || value === "") return;
  const num = item.valueType === "date" ? undefined : toNumber(value);
  if (num === undefined) {
    notes.push(label + " " + String(value));
    return;
  }
  res[keyword] = num;
}

function toNumber(value: any): number {
  if (typeof value === "number") return isFinite(value) ? value : undefined;
  if (typeof value === "string" && value !== "" && !isNaN(Number(value))) return Number(value);
  return undefined;
}

// The question's own description first, then whatever had no keyword to go into, in brackets after
// it. With no description of its own the notes are the description: "min 2020-01-01, max 2030-12-31".
function getDescription(item: IInterviewItem, notes: Array<string>): string {
  if (notes.length === 0) return item.description;
  const text = notes.join(", ");
  return !!item.description ? item.description + " (" + text + ")" : text;
}

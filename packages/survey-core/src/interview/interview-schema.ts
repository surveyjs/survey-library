import type { IQuestionChoiceDescription, IQuestionConstraints } from "survey-core";
import type { IInterviewEntry, IInterviewItem, IInterviewRow } from "./interview-types";

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
    properties[item.name] = createItemProperty(item, commentSuffix);
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

// A fixed-shape container is one object with a fixed set of keys, and the schema says so: an object
// of field properties for a multiple text, a composite and a single-choice matrix, an object of row
// objects for a matrix dropdown, "additionalProperties: false" at every level. The English of the
// description is fixed on purpose - it is read by the agent's model and not by the interviewee, the
// rule that already holds for the tool descriptions.
const FIELDS_DESCRIPTION = "An object of fields. Send only the fields to change; the others are left " +
  "as they are.";
const ROWS_DESCRIPTION = "An object of rows, each an object of fields. Send only the fields to change; " +
  "the others are left as they are.";

function createItemProperty(item: IInterviewItem, commentSuffix: string): any {
  // canAdd is on a dynamic container and on nothing else, entries and template only when there is
  // something to say: an empty container that takes no template still answers to a list.
  if (item.canAdd !== undefined) return createRecordsProperty(item, commentSuffix);
  if (!!item.rows) return createRowsProperty(item, commentSuffix);
  if (!!item.fields) return createFieldsProperty(item, commentSuffix);
  return createProperty(item);
}

function createRowsProperty(item: IInterviewItem, commentSuffix: string): any {
  const properties: any = {};
  item.rows.forEach((row: IInterviewRow) => {
    properties[row.name] = {
      title: row.title,
      type: "object",
      properties: createFieldProperties(row.fields, commentSuffix),
      additionalProperties: false,
    };
  });
  return createObjectProperty(item, ROWS_DESCRIPTION, properties);
}

// A dynamic container is a list of entry records, and the schema says so: one element schema for
// every position, "null" next to it for "remove the entry here", and maxItems where a position can
// never exist. No minItems - a patch is legitimately shorter than the minimum - and the minimum goes
// into the description text the way a date bound does.
function createRecordsProperty(item: IInterviewItem, commentSuffix: string): any {
  const count = !!item.entries ? item.entries.length : 0;
  const constraints: any = item.constraints || {};
  const notes: Array<string> = [];
  if (constraints.minCount !== undefined) notes.push("min " + constraints.minCount);
  if (constraints.maxCount !== undefined) notes.push("max " + constraints.maxCount);
  let text = "A list of entries by position. An object updates the entry at that position (send only " +
    "the fields to change); a position past the current " + count +
    (count === 1 ? " entry" : " entries") + " adds one; null removes the entry at that position; " +
    "positions not sent are left as they are.";
  if (notes.length > 0) text += " (" + notes.join(", ") + ")";
  const res: any = { title: item.title };
  res.description = !!item.description ? item.description + " " + text : text;
  res.type = "array";
  if (constraints.maxCount !== undefined) res.maxItems = constraints.maxCount;
  // anyOf with { type: "null" }, not type: ["object", "null"]: the strict function-calling modes
  // accept the first and not always the second.
  res.items = { anyOf: [createEntryProperty(item, commentSuffix), { type: "null" }] };
  if (item.disabled === true) res.readOnly = true;
  return res;
}

// One element schema serves every position, so its properties are the union - by field name - of the
// template records and the fields of every entry that exists: an entry's conditional field has to be
// sendable, and so has a field a new entry will have.
function createEntryProperty(item: IInterviewItem, commentSuffix: string): any {
  const order: Array<string> = [];
  const byName: { [name: string]: Array<IInterviewItem> } = {};
  const collect = (field: IInterviewItem) => {
    if (field.unsupported === true) return;
    if (!byName[field.name]) {
      byName[field.name] = [];
      order.push(field.name);
    }
    byName[field.name].push(field);
  };
  (item.template || []).forEach(collect);
  (item.entries || []).forEach((entry: IInterviewEntry) => entry.fields.forEach(collect));
  const properties: any = {};
  order.forEach(name => {
    const fields = byName[name];
    properties[name] = createNullable(mergeProperties(fields.map(field => createProperty(field))));
    if (fields.some(field => !!field.comment)) {
      properties[name + commentSuffix] = createNullable(createCommentProperty(fields[0]));
    }
  });
  // No required inside: a patch sends only what changes, and what is required is in the document and
  // enforced at complete().
  return { type: "object", properties: properties, additionalProperties: false };
}

// Two descriptions of one field name disagree - a template dropdown offering A and an entry whose
// choicesFromQuestion offers B - and the schema is widened, never narrowed: a schema that rejected a
// value one entry accepts would refuse the agent before the interview could, and the per-field checks
// at write time, against that entry's own choices, stay the gate.
const LOOSEST_LOW = ["minimum", "minLength", "minItems"];
const LOOSEST_HIGH = ["maximum", "maxLength", "maxItems"];
// A keyword the descriptions cannot agree on is dropped for that field.
const MUST_AGREE = ["type", "pattern", "format", "uniqueItems", "multipleOf", "readOnly"];

function mergeProperties(list: Array<any>): any {
  if (list.length === 1) return list[0];
  const first = list[0];
  const res: any = {};
  if (first.title !== undefined) res.title = first.title;
  MUST_AGREE.forEach(key => {
    const value = first[key];
    if (value !== undefined && list.every(property => isSameValue(property[key], value))) {
      res[key] = value;
    }
  });
  // enum only while every description offers one: a name that is a free text somewhere is not bounded
  // by the choices it has elsewhere.
  if (list.every(property => Array.isArray(property.enum))) {
    res.enum = unionValues(list.map(property => property.enum));
  }
  if (list.every(property => !!property.items && Array.isArray(property.items.enum))) {
    res.items = { enum: unionValues(list.map(property => property.items.enum)) };
  }
  LOOSEST_LOW.forEach(key => {
    if (list.every(property => typeof property[key] === "number")) {
      res[key] = Math.min.apply(Math, list.map(property => property[key]));
    }
  });
  LOOSEST_HIGH.forEach(key => {
    if (list.every(property => typeof property[key] === "number")) {
      res[key] = Math.max.apply(Math, list.map(property => property[key]));
    }
  });
  const description = list.map(property => property.description).filter(text => !!text)[0];
  if (!!description) res.description = description;
  return res;
}

function isSameValue(left: any, right: any): boolean {
  return JSON.stringify(left) === JSON.stringify(right);
}

function unionValues(lists: Array<Array<any>>): Array<any> {
  const res: Array<any> = [];
  const seen: { [key: string]: boolean } = {};
  lists.forEach(list => list.forEach(value => {
    const key = JSON.stringify(value);
    if (seen[key] === true) return;
    seen[key] = true;
    res.push(value);
  }));
  return res;
}

function createFieldsProperty(item: IInterviewItem, commentSuffix: string): any {
  return createObjectProperty(item, FIELDS_DESCRIPTION, createFieldProperties(item.fields, commentSuffix));
}

function createObjectProperty(item: IInterviewItem, text: string, properties: any): any {
  const res: any = { title: item.title };
  res.description = !!item.description ? item.description + " " + text : text;
  res.type = "object";
  res.properties = properties;
  res.additionalProperties = false;
  if (item.disabled === true) res.readOnly = true;
  return res;
}

// No "required" inside: a patch sends only what changes, and what is required is in the document and
// enforced at complete(). An unsupported field - a container nested inside this one, a file - is left
// out: there is no value an agent could send for it.
function createFieldProperties(fields: Array<IInterviewItem>, commentSuffix: string): any {
  const res: any = {};
  fields.forEach(field => {
    if (field.unsupported === true) return;
    res[field.name] = createNullable(createProperty(field));
    if (!!field.comment) {
      res[field.name + commentSuffix] = createNullable(createCommentProperty(field));
    }
  });
  return res;
}

// A field is cleared by sending null for it, and a schema that forbids null would refuse the agent
// before the interview could. "anyOf" with { type: "null" } rather than type: ["string", "null"]:
// the strict function-calling modes accept the first and not always the second.
function createNullable(property: any): any {
  return { anyOf: [property, { type: "null" }] };
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

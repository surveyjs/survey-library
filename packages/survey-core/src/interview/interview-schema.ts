import type { IInterviewEntry, IInterviewItem, IInterviewRow } from "./interview-types";
import type { IQuestionChoiceDescription, IQuestionConstraints, IQuestionMask } from "./question-description";
import { createNameLookup, setOwnValue } from "./interview-address";

// The answers of a batch call as a JSON Schema, so that an agent's function-calling API constrains
// what it may send instead of the interview refusing it afterwards. Draft 2020-12 keywords only, and
// no "$schema": every provider that accepts a schema accepts this subset, and none of them fetches
// the meta-schema at run time.
//
// It is built from the item records alone - the same records describeAll() renders - and never takes
// a second look at the model: what the text says and what the schema says can then not disagree.
// Being a function of the current state, it is also the answer to "what may be sent now": an agent
// that answers hasPet sees petType in the next schema and not before.

// JSON Schema's "date-time" and "time" want seconds and an offset, and "date" wants a day. These
// inputs produce none of them, the model stores what they produce, and no format says "a month" or
// "a week". So the shape goes into the description as text, which is where an agent reads it anyway.
// A bound the model expresses as a date has no keyword either - draft 2020-12 dropped formatMinimum -
// and goes there too.
const DATE_SHAPES: { [inputType: string]: string } = {
  "datetime-local": "YYYY-MM-DDTHH:mm[:ss]",
  "time": "HH:mm[:ss]",
  "month": "YYYY-MM",
  "week": "YYYY-Www",
};
// The questions whose value is a set. Everything else with an array value is not one: the two ends of
// a range slider may be equal.
const SET_TYPES = ["checkbox", "tagbox", "ranking"];

export function createAnswerSchema(items: Array<IInterviewItem>, commentSuffix: string): any {
  const properties: any = {};
  const required: Array<string> = [];
  items.forEach(item => {
    // A container and a question with no plain input are in the document, so the agent knows they
    // exist, and never in the schema: there is no value it could send for either.
    if (item.unsupported === true) return;
    setOwnValue(properties, item.name, createItemProperty(item, commentSuffix));
    if (!!item.comment) {
      setOwnValue(properties, item.name + commentSuffix, createCommentProperty(item));
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

// "isNested" - the property of a field inside a container rather than of a root key. It changes one
// thing, the text of a list: a nested list serves every entry of its owner, and their inner lists
// have different counts.
function createItemProperty(item: IInterviewItem, commentSuffix: string, isNested?: boolean): any {
  // canAdd is on a dynamic container and on nothing else, entries and template only when there is
  // something to say: an empty container that takes no template still answers to a list.
  if (isRecordsItem(item)) return createRecordsProperty(item, commentSuffix, isNested === true);
  if (!!item.rows) return createRowsProperty(item, commentSuffix);
  if (!!item.fields) return createFieldsProperty(item, commentSuffix);
  return createProperty(item);
}

function isRecordsItem(item: IInterviewItem): boolean {
  return item.canAdd !== undefined;
}

function isContainerItem(item: IInterviewItem): boolean {
  return isRecordsItem(item) || !!item.rows || !!item.fields;
}

function createRowsProperty(item: IInterviewItem, commentSuffix: string): any {
  const properties: any = {};
  item.rows.forEach((row: IInterviewRow) => {
    setOwnValue(properties, row.name, {
      title: row.title,
      type: "object",
      properties: createFieldProperties(row.fields, commentSuffix),
      additionalProperties: false,
    });
  });
  return createObjectProperty(item, ROWS_DESCRIPTION, properties);
}

// A dynamic container is a list of entry records, and the schema says so: one element schema for
// every position, "null" next to it for "remove the entry here", and maxItems where a position can
// never exist. No minItems - a patch is legitimately shorter than the minimum - and the minimum goes
// into the description text the way a date bound does. A root list names its current count; a nested
// one serves every entry of its owner, whose inner lists have different counts, and names none.
function createRecordsProperty(item: IInterviewItem, commentSuffix: string, isNested: boolean): any {
  const constraints: any = item.constraints || {};
  const notes: Array<string> = [];
  if (constraints.minCount !== undefined) notes.push("min " + constraints.minCount);
  if (constraints.maxCount !== undefined) notes.push("max " + constraints.maxCount);
  let text = "A list of entries by position. An object updates the entry at that position (send only " +
    "the fields to change); " + getAddText(item, isNested) + "; null removes the entry at that " +
    "position; positions not sent are left as they are.";
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

function getAddText(item: IInterviewItem, isNested: boolean): string {
  if (isNested) return "a position past the entries the document lists for this entry adds one";
  const count = !!item.entries ? item.entries.length : 0;
  return "a position past the current " + count + (count === 1 ? " entry" : " entries") + " adds one";
}

// One element schema serves every position, so its properties are the union - by field name - of the
// template records and the fields of every entry that exists: an entry's conditional field has to be
// sendable, and so has a field a new entry will have.
function createEntryProperty(item: IInterviewItem, commentSuffix: string): any {
  const fields: Array<IInterviewItem> = (item.template || []).slice();
  (item.entries || []).forEach((entry: IInterviewEntry) => entry.fields.forEach(field => fields.push(field)));
  // No required inside: a patch sends only what changes, and what is required is in the document and
  // enforced at complete().
  return { type: "object", properties: createFieldProperties(fields, commentSuffix), additionalProperties: false };
}

// Two descriptions of one field name disagree - a template dropdown offering A and an entry whose
// choicesFromQuestion offers B - and the schema is widened, never narrowed: a schema that rejected a
// value one entry accepts would refuse the agent before the interview could, and the per-field checks
// at write time, against that entry's own choices, stay the gate.
const LOOSEST_LOW = ["minimum", "minLength", "minItems"];
const LOOSEST_HIGH = ["maximum", "maxLength", "maxItems"];
// A keyword the descriptions cannot agree on is dropped for that field.
const MUST_AGREE = ["type", "anyOf", "pattern", "format", "uniqueItems", "multipleOf", "readOnly"];

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
// enforced at complete(). An unsupported field - a file, a container below the depth ceiling - is left
// out: there is no value an agent could send for it.
//
// The properties are the union, by field name, of the records given: one record per name for the
// fields of one container, and several for the element schema of a list, whose template and entries
// each describe the same name. A field that is a container yields the same array or object property
// its root twin yields, nested where the field sits.
function createFieldProperties(fields: Array<IInterviewItem>, commentSuffix: string): any {
  const order: Array<string> = [];
  const byName = createNameLookup<Array<IInterviewItem>>();
  fields.forEach(field => {
    if (field.unsupported === true) return;
    if (!byName[field.name]) {
      byName[field.name] = [];
      order.push(field.name);
    }
    byName[field.name].push(field);
  });
  const res: any = {};
  order.forEach(name => {
    const group = byName[name];
    const property = createUnionProperty(group, commentSuffix);
    if (property === undefined) return;
    setOwnValue(res, name, createNullable(property));
    // A container takes no comment key: the suffix belongs to a field one level further down.
    if (!group.some(isContainerItem) && group.some(field => !!field.comment)) {
      setOwnValue(res, name + commentSuffix, createNullable(createCommentProperty(group[0])));
    }
  });
  return res;
}

// Two descriptions of one name - a template's declaration and an entry's live record - are merged at
// the level of the records rather than of the schemas: mergeProperties widens scalar keywords and
// cannot widen a nested "properties" map. So a group that holds a container is rebuilt as one
// synthetic record, and the property of that record merges the next level down by the same rule.
function createUnionProperty(group: Array<IInterviewItem>, commentSuffix: string): any {
  const containers = group.filter(isContainerItem);
  if (containers.length === 0) return mergeProperties(group.map(field => createProperty(field)));
  // A name that is a plain field in one record and a container in another is left out: a survey
  // cannot express that, and a schema is not the place to guess which of the two an agent will meet.
  if (containers.length < group.length) return undefined;
  const record = createUnionRecord(containers);
  return !!record ? createItemProperty(record, commentSuffix, true) : undefined;
}

// A dynamic container: the template of every record and the fields of every entry of every record,
// as one template - the entries' own fields are as sendable as the template's. A fixed-shape one: the
// fields of every record, or the rows merged by row name. The loosest bound of the records survives,
// as for every other bound of a union. Containers of different kinds under one name are left out.
function createUnionRecord(records: Array<IInterviewItem>): IInterviewItem | undefined {
  const first = records[0];
  if (records.length === 1) return first;
  const res: IInterviewItem = { ...first };
  if (records.every(isRecordsItem)) {
    const template: Array<IInterviewItem> = [];
    records.forEach(record => {
      (record.template || []).forEach(field => template.push(field));
      (record.entries || []).forEach(entry => entry.fields.forEach(field => template.push(field)));
    });
    delete res.entries;
    res.template = template;
    res.constraints = mergeCounts(records);
    if (res.constraints === undefined) delete res.constraints;
    return res;
  }
  if (records.every(record => !!record.rows)) {
    const rows: Array<IInterviewRow> = [];
    records.forEach(record => record.rows.forEach(row => {
      const same = rows.filter(item => item.name === row.name)[0];
      if (!same) {
        rows.push({ name: row.name, title: row.title, fields: row.fields.slice() });
      } else {
        row.fields.forEach(field => same.fields.push(field));
      }
    }));
    res.rows = rows;
    return res;
  }
  if (records.every(record => !!record.fields && !record.rows && !isRecordsItem(record))) {
    const fields: Array<IInterviewItem> = [];
    records.forEach(record => record.fields.forEach(field => fields.push(field)));
    res.fields = fields;
    return res;
  }
  return undefined;
}

// minCount only while every record has one, and then the lowest; maxCount the same, the highest.
function mergeCounts(records: Array<IInterviewItem>): any {
  const res: any = {};
  const lows = records.map(record => !!record.constraints ? record.constraints.minCount : undefined);
  const highs = records.map(record => !!record.constraints ? record.constraints.maxCount : undefined);
  if (lows.every(value => typeof value === "number")) res.minCount = Math.min.apply(Math, lows);
  if (highs.every(value => typeof value === "number")) res.maxCount = Math.max.apply(Math, highs);
  return Object.keys(res).length > 0 ? res : undefined;
}

// A field is cleared by sending null for it, and a schema that forbids null would refuse the agent
// before the interview could. "anyOf" with { type: "null" } rather than type: ["string", "null"]:
// the strict function-calling modes accept the first and not always the second. A property that is
// already a union - a mask that saves its text takes a number or a string - gets null as one more
// branch, not a union nested in a union.
function createNullable(property: any): any {
  if (!Array.isArray(property.anyOf)) return { anyOf: [property, { type: "null" }] };
  const res: any = {};
  Object.keys(property).forEach(key => res[key] = property[key]);
  res.anyOf = property.anyOf.concat([{ type: "null" }]);
  return res;
}

function createProperty(item: IInterviewItem): any {
  const res: any = { title: item.title };
  const notes: Array<string> = [];
  addValueType(res, item, notes);
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
function addValueType(res: any, item: IInterviewItem, notes: Array<string>): void {
  const choices = getEnumChoices(item);
  if (item.valueType === "array") {
    res.type = "array";
    if (!!choices) res.items = { enum: choices };
    // A range slider holds [lo, hi]; its bounds go into this element schema.
    if (item.type === "slider") res.items = { type: "number" };
    if (SET_TYPES.indexOf(item.type) >= 0) res.uniqueItems = true;
    return;
  }
  if (!!choices) {
    res.enum = choices;
    return;
  }
  if (addMaskType(res, item, notes)) return;
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
    const shape = DATE_SHAPES[item.inputType];
    if (!!shape) {
      notes.push(shape);
    } else {
      res.format = "date";
    }
    return;
  }
  res.type = "string";
  // inputType "email" validates as an address without putting an EmailValidator in the list, so it
  // reaches the record as an input type and nothing else. The constraint is real all the same.
  if (item.inputType === "email") res.format = "email";
}

// The model reports "string" as the value type of every masked question, and a mask stores something
// else: a numeric or currency mask a number - and with saveMaskedValue the text it shows, which the
// model also makes of a number it is given - a datetime mask an ISO string in its valueFormat, or the
// shown text with saveMaskedValue. The mask's bounds go where its value type takes them. A pattern
// mask, and a datetime mask that stores nothing readable, keep the "mask" note of addConstraints().
function addMaskType(res: any, item: IInterviewItem, notes: Array<string>): boolean {
  const mask: IQuestionMask = !!item.constraints ? item.constraints.mask : undefined;
  if (!isTypedMask(mask)) return false;
  if (mask.type === "datetime") {
    res.type = "string";
    notes.push(mask.saveMaskedValue === true ? mask.pattern : mask.valueFormat + " (shown as " + mask.pattern + ")");
    if (!isEmptyBound(mask.min)) notes.push("min " + String(mask.min));
    if (!isEmptyBound(mask.max)) notes.push("max " + String(mask.max));
    return true;
  }
  const num: any = { type: "number" };
  if (typeof mask.min === "number") num.minimum = mask.min;
  if (typeof mask.max === "number") num.maximum = mask.max;
  const separators = "(decimal " + JSON.stringify(mask.decimalSeparator) + ", thousands " +
    JSON.stringify(mask.thousandsSeparator) + ")";
  if (mask.saveMaskedValue === true) {
    res.anyOf = [num, { type: "string" }];
    notes.push(mask.type + (!!mask.example ? ", as " + mask.example : "") + " " + separators);
  } else {
    Object.keys(num).forEach(key => res[key] = num[key]);
    notes.push(mask.type + (!!mask.example ? ", shown as " + mask.example : "") + " " + separators);
  }
  return true;
}

function isTypedMask(mask: IQuestionMask): boolean {
  if (!mask) return false;
  return mask.type === "numeric" || mask.type === "currency" || (mask.type === "datetime" && !!mask.valueFormat);
}

function isEmptyBound(value: any): boolean {
  return value === undefined || value === null || value === "";
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
  // The bounds of an array value - a range slider's - bound its elements.
  const bounded = res.type === "array" && !!res.items ? res.items : res;
  addBound(bounded, item, notes, "minimum", "min", constraints.min);
  addBound(bounded, item, notes, "maximum", "max", constraints.max);
  if (constraints.minLength !== undefined) res.minLength = constraints.minLength;
  if (constraints.maxLength !== undefined) res.maxLength = constraints.maxLength;
  if (constraints.minCount !== undefined) res.minItems = constraints.minCount;
  if (constraints.maxCount !== undefined) res.maxItems = constraints.maxCount;
  if (constraints.regex !== undefined) {
    // A pattern has no flags, and a case-sensitive one would refuse what the model accepts.
    if (constraints.regexFlags === "i") {
      notes.push("regex /" + constraints.regex + "/i");
    } else {
      res.pattern = constraints.regex;
    }
  }
  if (constraints.format === "email") res.format = "email";
  // multipleOf only where the model checks the step - a number input - and only for an integer step.
  // The model scales value and step to integers and counts from zero, whatever min is; multipleOf
  // counts from zero too, but fails 0.3 for 0.1 on float error. Every other step - a fraction, a range
  // input or a slider, whose step the model does not check - is said in the description.
  if (constraints.step !== undefined) {
    if (item.inputType === "number" && Math.floor(constraints.step) === constraints.step) {
      res.multipleOf = constraints.step;
    } else {
      notes.push("step " + constraints.step);
    }
  }
  if (!!constraints.mask && !isTypedMask(constraints.mask)) {
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

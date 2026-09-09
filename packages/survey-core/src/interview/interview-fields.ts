import { Helpers, describeQuestion } from "survey-core";
import type { Question } from "survey-core";
import type { IInterviewError, IInterviewItem, IInterviewRow } from "./interview-types";
import { formatAddressSegment, getAddress } from "./interview-address";
import { isContainerQuestion } from "./interview-items";
import { isAction } from "./interview-summary";
import {
  badActionError, badRecordError, notAChoiceError, notANumberError, notAskableError,
  unknownQuestionError,
} from "./interview-errors";

// The inputs a container holds, as batch fields. A fixed-shape container is one whose value is a
// single object with a fixed set of keys - the keys are the survey's structure and nothing is added
// or removed: a single-choice matrix ({ row: column }), a matrix dropdown
// ({ row: { column: value } }), a multiple text ({ item: value }) and a composite component
// ({ question: value }). An agent sends the object the way it appears in data and gets the fields
// described the way a question is described.
//
// Everything here reads the live structure - the synthesized row questions, the rows and their
// cells, the editors, the content panel - and never the single-mode inventory or the mode's
// navigation list: onCheckSingleInputPerPageMode and onGetLoopQuestions tune single mode only, and
// batch mode works per field whatever the host did to the mode's nesting. The inventory keeps one
// job for a container - the change report is still taken over its addresses, so a visibleIf inside
// a composite fired by a field write reports "address.street" as before.
//
// What is nested inside a container is listed and never filled: a dynamic panel or a matrix in a
// composite's content panel, a multiple text in a composite. There is no recursion here.

export interface IInterviewField {
  // The key of the object an agent sends: the field's own name inside the container or the row,
  // never the address.
  name: string;
  // Where an error about the field is reported - the address the inventory knows it under.
  address: string;
  question: Question;
  item: IInterviewItem;
}

export interface IInterviewFieldRow {
  name: string;
  title: string;
  address: string;
  fields: Array<IInterviewField>;
}

// The two dynamic containers - a value that is a list growing and shrinking - are not fixed-shape;
// they are filled per entry by tier 08 and reported as unsupported until then. Duck-typed, the way
// the address grammar duck-types the same shapes: a custom type registered under another name still
// holds panels one adds and removes.
export function isFixedShapeContainer(question: Question): boolean {
  const target: any = question;
  if (!target) return false;
  if (typeof target.addPanel === "function" || typeof target.addRow === "function") return false;
  // The one container whose inputs are not questions of the JSON: the mode synthesizes a radiogroup
  // or a checkbox per row, with the columns as its choices.
  if (isSingleChoiceMatrix(target)) return true;
  if (Array.isArray(target.visibleRows)) return true;
  // A composite holds a panel of content questions and a multiple text a list of items with an
  // editor each. Both are asked by the shape they declare and not by what they hold right now: a
  // multiple text a survey left without items is still one object with no keys, and not a question
  // whose plain value an agent could send.
  if (!!target.contentPanel || typeof target.getItemByName === "function") return true;
  // A plain question and a single custom component name nothing here and are not containers at all.
  return question.getNestedQuestions(false, false).length > 0;
}

function isSingleChoiceMatrix(question: any): boolean {
  return !!question && typeof question.getMatrixSingleInputQuestions === "function";
}

// Two levels, because the value of a matrix dropdown has two: the row name, then the column name.
// undefined for every other container - its fields are flat, because its value is.
export function getContainerRows(container: Question, address: string): Array<IInterviewFieldRow> | undefined {
  const target: any = container;
  if (isSingleChoiceMatrix(target) || !Array.isArray(target.visibleRows)) return undefined;
  const res: Array<IInterviewFieldRow> = [];
  target.visibleRows.forEach((row: any) => {
    const name = getRowName(row);
    if (name === undefined) return;
    const rowAddress = address + "." + formatAddressSegment({ name: name });
    res.push({
      name: name,
      title: getRowTitle(row) || name,
      address: rowAddress,
      fields: createFields(getVisibleRowQuestions(row), rowAddress),
    });
  });
  return res;
}

// The inputs the container holds, in its own order: the synthesized row questions of a single-choice
// matrix, the editors of a multiple text, the content questions of a composite. A matrix dropdown
// answers through its rows instead.
export function getContainerFields(container: Question, address: string): Array<IInterviewField> {
  return createFields(getContainerQuestions(container), address);
}

// Every field of the container, rows flattened: what the predicates read and what a write reports.
export function getContainerInputs(container: Question, address: string): Array<IInterviewField> {
  const rows = getContainerRows(container, address);
  if (!rows) return getContainerFields(container, address);
  const res: Array<IInterviewField> = [];
  rows.forEach(row => row.fields.forEach(field => res.push(field)));
  return res;
}

function getContainerQuestions(container: Question): Array<Question> {
  const target: any = container;
  if (isSingleChoiceMatrix(target)) {
    // One radiogroup or checkbox per visible row, named after the row and cached on the matrix: the
    // very list single mode walks, so both modes write through the same objects.
    const rows = target.getMatrixSingleInputQuestions(undefined, true);
    return Array.isArray(rows) ? rows : [];
  }
  return container.getNestedQuestions(true, false);
}

// The names the container knows, invisible ones included. A key that names one of them was not
// invented by the agent - the survey hid it - and that is a different statement than "there is no
// such field".
function getContainerNames(container: Question): Array<string> {
  const target: any = container;
  if (isSingleChoiceMatrix(target)) return getRowItemNames(target);
  return container.getNestedQuestions(false, false).map(question => question.name);
}

function getRowNames(container: Question): Array<string> {
  return getRowItemNames(<any>container);
}

function getRowItemNames(target: any): Array<string> {
  const rows: Array<any> = Array.isArray(target.rows) ? target.rows : [];
  const res: Array<string> = [];
  rows.forEach(row => {
    if (!!row && row.value !== undefined && row.value !== null) res.push(String(row.value));
  });
  return res;
}

function getVisibleRowQuestions(row: any): Array<Question> {
  // The cells in column order, then the questions of the detail panel once the model has created
  // that panel - the interview never opens one itself.
  return Array.isArray(row.visibleQuestions) ? row.visibleQuestions : [];
}

function getAllRowQuestions(row: any): Array<Question> {
  return Array.isArray(row.questions) ? row.questions : [];
}

function getRowName(row: any): string | undefined {
  const name = !!row ? row.rowName : undefined;
  if (name === undefined || name === null || String(name) === "") return undefined;
  return String(name);
}

function getRowTitle(row: any): string | undefined {
  const locText = !!row ? row.locText : undefined;
  const res = !!locText ? locText.textOrHtml : undefined;
  return typeof res === "string" && res.length > 0 ? res : undefined;
}

function createFields(questions: Array<Question>, address: string): Array<IInterviewField> {
  const res: Array<IInterviewField> = [];
  questions.forEach(question => {
    const field = createField(question, address);
    if (!!field) res.push(field);
  });
  return res;
}

function createField(question: Question, address: string): IInterviewField | undefined {
  const item = createFieldItem(question);
  // undefined from the describer means read-only by property: nobody can ever answer it, so it is
  // not a field at all - the rule the inventory applies to a root.
  if (!item) return undefined;
  return {
    name: question.name,
    address: getAddress(question) || (address + "." + formatAddressSegment({ name: question.name })),
    question: question,
    item: item,
  };
}

// A batch record is the tier-01 record minus one key: the describer's "items" - the nested records of
// a multiple text and a composite - is dropped and "fields" takes its place, one key for "the inputs
// inside" in this tier and in tier 08. Single-mode records keep "items" untouched.
export function createBatchItem(question: Question): IInterviewItem | undefined {
  const description = describeQuestion(question);
  if (!description) return undefined;
  const res: IInterviewItem = { ...description };
  delete res.items;
  return res;
}

function createFieldItem(question: Question): IInterviewItem | undefined {
  const res = createBatchItem(question);
  if (!res) return undefined;
  if (isContainerQuestion(question)) {
    // A container inside a container is listed where it sits and never filled: a key for it is
    // refused, and it has no fields of its own.
    res.unsupported = true;
    res.reason = "batch";
  }
  return res;
}

// The records the document renders: the describer's keys, then the value the field holds now and the
// first error text it carries. Both are keys of a field and of nothing else - a field sits where the
// document put it, so there is no "entry" breadcrumb to write.
export function getFieldItems(fields: Array<IInterviewField>): Array<IInterviewItem> {
  return fields.map(field => {
    const item = field.item;
    const value = getFieldValue(field);
    if (value !== undefined) item.value = value;
    const error = getFieldError(field);
    if (!!error) item.error = error;
    return item;
  });
}

export function getRowRecords(rows: Array<IInterviewFieldRow>): Array<IInterviewRow> {
  return rows.map(row => ({ name: row.name, title: row.title, fields: getFieldItems(row.fields) }));
}

// The same form answer() reports and takes back: the plain value, or { value, comment } when the
// field accepts a comment and one is set.
function getFieldValue(field: IInterviewField): any {
  const question = field.question;
  if (question.isEmpty()) return undefined;
  const value = question.value;
  if (!field.item.comment) return value;
  const comment = question.comment;
  return !!comment ? { value: value, comment: comment } : value;
}

function getFieldError(field: IInterviewField): string | undefined {
  const errors = field.question.errors;
  return errors.length > 0 ? errors[0].getText() : undefined;
}

// The batch twin of a plain question's "not empty": the container's value holds something.
export function isContainerAnswered(container: Question): boolean {
  return !container.isEmpty();
}

// A read of persisted state, never a validation run (tier 04). An empty optional field does not
// make the container invalid, exactly as an empty optional root is not an error.
export function isContainerValid(container: Question, fields: Array<IInterviewField>): boolean {
  if (container.errors.length > 0 || container.hasRequiredError()) return false;
  return !fields.some(field => field.question.errors.length > 0 || field.question.hasRequiredError());
}

export interface IFieldWriteResult {
  errors: Array<IInterviewError>;
  written: Array<IInterviewField>;
}

// One key of a batch whose item is a fixed-shape container. Patch semantics: keys not sent are left
// as they are, null or undefined for the whole thing writes nothing and clears nothing, and a field
// is cleared by sending null for that field. The interview never clears what it was not told to
// clear, which is the rule tier 08 repeats for the entries of a dynamic container.
export function writeContainerValue(container: Question, address: string, value: any,
  commentSuffix: string): IFieldWriteResult {
  const res: IFieldWriteResult = { errors: [], written: [] };
  if (value === undefined || value === null) return res;
  if (!isPlainObject(value)) {
    res.errors.push(badRecordError(address, value));
    return res;
  }
  if (!getContainerRows(container, address)) {
    writeFields(res, value, commentSuffix, {
      address: address,
      getFields: () => getContainerFields(container, address),
      getNames: () => getContainerNames(container),
    });
    return res;
  }
  writeRows(res, container, address, value, commentSuffix);
  return res;
}

// The first level of a matrix dropdown is the row, mirroring data. A row value that is not a plain
// object is badRecord at the row's own address; null and undefined leave the row alone, as they do
// the container.
function writeRows(res: IFieldWriteResult, container: Question, address: string, values: any,
  commentSuffix: string): void {
  const rows = getContainerRows(container, address);
  const order: { [name: string]: number } = {};
  rows.forEach((row, index) => { order[row.name] = index; });
  sortKeys(Object.keys(values), key => order[key]).forEach(key => {
    const value = values[key];
    const row = rows.filter(item => item.name === key)[0];
    if (!row) {
      res.errors.push(getUnknownKeyError(address, key, getRowNames(container), rows.map(item => item.name)));
      return;
    }
    if (value === undefined || value === null) return;
    if (!isPlainObject(value)) {
      res.errors.push(badRecordError(row.address, value));
      return;
    }
    writeFields(res, value, commentSuffix, {
      address: row.address,
      // Re-read per write: a cell an earlier key of the same object revealed is written in the same
      // call, and the row is looked up again in case the visible rows moved under it.
      getFields: () => getRowFields(container, address, row.name),
      getNames: () => getRowFieldNames(container, row.name),
    });
  });
}

function getRowFields(container: Question, address: string, name: string): Array<IInterviewField> {
  const row = (getContainerRows(container, address) || []).filter(item => item.name === name)[0];
  return !!row ? row.fields : [];
}

function getRowFieldNames(container: Question, name: string): Array<string> {
  const rows: Array<any> = Array.isArray((<any>container).visibleRows) ? (<any>container).visibleRows : [];
  const row = rows.filter(item => getRowName(item) === name)[0];
  return !!row ? getAllRowQuestions(row).map(question => question.name) : [];
}

interface IFieldOwner {
  address: string;
  getFields: () => Array<IInterviewField>;
  getNames: () => Array<string>;
}

interface IFieldWrite {
  name: string;
  hasValue: boolean;
  value?: any;
  hasComment: boolean;
  comment?: any;
  // the key as the agent wrote it, for the message of a refused comment key
  commentKey?: string;
}

// The keys of one object, written in the container's field order and not in the order the object
// happens to carry them: a setValueIf or a trigger that reads an earlier field must see it first,
// and an agent's object is a set of answers rather than a sequence of gestures. A comment lands with
// the field it belongs to, right after its value.
function writeFields(res: IFieldWriteResult, values: any, commentSuffix: string, owner: IFieldOwner): void {
  const fields = owner.getFields();
  const order: { [name: string]: number } = {};
  fields.forEach((field, index) => { order[field.name] = index; });
  const writes = groupKeys(values, fields, commentSuffix);
  sortKeys(Object.keys(writes), key => order[key]).forEach(name => {
    writeField(res, writes[name], owner);
  });
}

function groupKeys(values: any, fields: Array<IInterviewField>,
  commentSuffix: string): { [name: string]: IFieldWrite } {
  const res: { [name: string]: IFieldWrite } = {};
  const get = (name: string): IFieldWrite => {
    if (!res[name]) res[name] = { name: name, hasValue: false, hasComment: false };
    return res[name];
  };
  Object.keys(values).forEach(key => {
    // A field name wins over a comment key: a field really called "note-Comment" is answered by its
    // own name, and only a key that names no field is read as the comment of one that does.
    if (fields.some(field => field.name === key) || !isCommentKey(key, commentSuffix)) {
      const write = get(key);
      write.hasValue = true;
      write.value = values[key];
      return;
    }
    const write = get(key.substring(0, key.length - commentSuffix.length));
    write.hasComment = true;
    write.comment = values[key];
    write.commentKey = key;
  });
  return res;
}

function isCommentKey(key: string, commentSuffix: string): boolean {
  return !!commentSuffix && key.length > commentSuffix.length &&
    key.substring(key.length - commentSuffix.length) === commentSuffix;
}

// Resolved immediately before its own write, against the container as it is at that moment: an
// earlier key of the same object may have revealed the field, hidden it, turned it off, or moved the
// choices the value is checked against. One bad field skips that field; the rest of the object is
// written.
function writeField(res: IFieldWriteResult, write: IFieldWrite, owner: IFieldOwner): void {
  const fields = owner.getFields();
  const field = fields.filter(item => item.name === write.name)[0];
  if (!field) {
    const key = write.hasValue ? write.name : write.commentKey;
    res.errors.push(getUnknownKeyError(owner.address, key, owner.getNames(),
      fields.map(item => item.name)));
    return;
  }
  if (field.item.unsupported === true) {
    res.errors.push(notAskableError(field.address,
      field.item.reason === "batch" ? "batch" : "unsupported"));
    return;
  }
  if (field.item.disabled === true) {
    res.errors.push(notAskableError(field.address, "disabled"));
    return;
  }
  if (write.hasValue) {
    const prepared = prepareValue(field.item, field.address, write.value);
    if (!!prepared.error) {
      res.errors.push(prepared.error);
      return;
    }
    field.question.value = prepared.value;
    if (prepared.hasComment) field.question.comment = prepared.comment;
  }
  if (write.hasComment) {
    if (!field.item.comment) {
      // The model would store a comment for any question; a key the field does not advertise is a
      // mistake the agent has to hear about, and the value it came with is written all the same.
      res.errors.push(unknownQuestionError(
        owner.address + "." + formatAddressSegment({ name: write.commentKey }),
        fields.map(item => item.name)));
    } else {
      field.question.comment = write.comment;
    }
  }
  res.written.push(field);
  // Validated one field at a time, before the next write: an expression validator reads the data as
  // it is now, and running them all at the end would validate against a later state.
  field.question.validate(true);
}

// A key the survey knows and is not asking for, or a key that names nothing at all. The first is a
// hidden field or a hidden row - the survey hid it, the agent did not invent it - and the second is
// answered with the list of what the container does offer.
function getUnknownKeyError(address: string, key: string, known: Array<string>,
  offered: Array<string>): IInterviewError {
  const name = address + "." + formatAddressSegment({ name: key });
  if (known.indexOf(key) >= 0) return notAskableError(name, "hidden");
  return unknownQuestionError(name, offered);
}

// Stable: the keys the container knows come first, in its own field order, and the ones it does not
// keep the order the object carried them in, so the refusals read in the order they were written.
function sortKeys(keys: Array<string>, getOrder: (key: string) => number): Array<string> {
  return keys.map((key, index) => ({ key: key, index: index, order: getOrder(key) }))
    .sort((a, b) => {
      const left = a.order === undefined ? Number.MAX_VALUE : a.order;
      const right = b.order === undefined ? Number.MAX_VALUE : b.order;
      return left !== right ? left - right : a.index - b.index;
    })
    .map(entry => entry.key);
}

export interface IPreparedValue {
  value?: any;
  comment?: string;
  hasComment?: boolean;
  error?: IInterviewError;
}

// The checks the model cannot make. It accepts any value a caller assigns - what keeps a respondent
// from entering an impossible one is the UI, which offers a list of choices and a numeric field.
// A text consumer has neither, so the same three mistakes are caught here, each with a code the
// consumer can act on, and nothing is written when one of them fires. The tester's
// checkValueEnterable exists for the same reason. One implementation: single mode checks an item
// with it, batch mode a root, and the field write above a field.
export function prepareValue(item: IInterviewItem, address: string, value: any): IPreparedValue {
  if (isAction(value)) {
    return { error: badActionError(address, value.action) };
  }
  const res: IPreparedValue = { value: value };
  if (!!item.comment && isCommentValue(value)) {
    res.value = value.value;
    res.comment = value.comment;
    res.hasComment = true;
  }
  // A voice consumer says "Dog" for a checkbox and means ["Dog"]. Wrapping is silent: there is no
  // other reading of a scalar for a question whose value is an array.
  if (item.valueType === "array" && res.value !== undefined && res.value !== null &&
    !Array.isArray(res.value)) {
    res.value = [res.value];
  }
  const choicesError = checkChoices(item, address, res.value);
  if (!!choicesError) return { error: choicesError };
  const numberError = checkNumber(item, address, res.value);
  if (!!numberError) return { error: numberError };
  return res;
}

function isCommentValue(value: any): boolean {
  return isPlainObject(value) && value.value !== undefined && typeof value.comment === "string";
}

export function isPlainObject(value: any): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// Only when the set can be enumerated: choices that are still loading from a web service, or that a
// lazy-loading dropdown fetches page by page, are described as choicesUnknown and nothing is checked
// against them. "other" and "none" are choices like any other - they are in the described list.
function checkChoices(item: IInterviewItem, address: string, value: any): IInterviewError {
  if (!item.choices || item.choicesUnknown || Helpers.isValueEmpty(value)) return undefined;
  const available = item.choices.map(choice => choice.value);
  const values: Array<any> = Array.isArray(value) ? value : [value];
  for (let i = 0; i < values.length; i++) {
    if (!available.some(choice => Helpers.isTwoValueEquals(choice, values[i]))) {
      return notAChoiceError(address, values[i], available);
    }
  }
  return undefined;
}

function checkNumber(item: IInterviewItem, address: string, value: any): IInterviewError {
  if (item.valueType !== "number" || typeof value !== "string" || value === "") return undefined;
  return Helpers.isNumber(value) ? undefined : notANumberError(address, value);
}

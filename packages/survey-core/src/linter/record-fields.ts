import { getCheckboxItemFields } from "survey-core";
import { CapturingScopeFrame, CIMap, CIMultiMap, ElementRecord, getCapturingFrame, getEffectiveType, ITEM_FIELD_TYPE,
  MergedObjectKeys, ScopeFrame, SurveyIndex } from "./symbols";
import { isDescendantOf } from "./metadata";

// Questions on one data key share one value: the runtime binds them by getValueName() - the
// valueName, else the name - whichever of them declares the valueName. A dynamic panel's or a
// dynamic matrix's value is an array of objects every sharing question adds its fields to (a
// checkbox with object items, another dynamic panel or matrix); an object value (multiple text,
// matrix, matrixdropdown) gets keys from every sharing question. Sharing stays within one data
// scope: a question of a dynamic-panel template or of a matrix row keys its panel's or row's
// record, never the survey's.
//
// So a dynamic panel or a matrix has two maps, and every check reads the one the runtime reads:
// - its sub-elements by NAME (getSubElementNames, getFrameNames) - a question lookup: a
//   carry-forward source (findQuestionByName), displayValue/propertyValue (getQuestionByName);
// - the FIELDS of one panel/row object by data key (getItemFields, getFrameItemFields) - a value
//   path: {row.x}, {panel.x}, {q[0].x}, keyName, inArray names, default value keys, totals.

// The key a question stores its value under.
export function getDataKey(record: ElementRecord): string {
  return record.valueName || record.name;
}

// The template questions of a dynamic panel or the columns (detail-panel elements included) of a
// matrix, by name.
export function getSubElementNames(record: ElementRecord): CIMultiMap<ElementRecord> | undefined {
  return record.templateNames || record.matrixColumns;
}

// The elements of a dynamic-panel template or a matrix row, by name.
export function getFrameNames(frame: CapturingScopeFrame): CIMultiMap<ElementRecord> {
  return frame.kind === "panelDynamic" ? frame.templateNames : frame.columns;
}

// The questions (and columns) of a panel's or row's record by data key, built once per scope.
function getFrameDataKeys(frame: CapturingScopeFrame): CIMultiMap<ElementRecord> {
  if (!frame.dataKeys) {
    const keys = new CIMultiMap<ElementRecord>();
    getFrameNames(frame).forEach(records => records.forEach(record => {
      if (record.kind === "question" || record.kind === "column") keys.add(getDataKey(record), record);
    }));
    frame.dataKeys = keys;
  }
  return frame.dataKeys;
}

// The questions writing a data key of a data scope: a dynamic-panel template or a matrix row
// (frame), or the survey data.
export function getDataKeyRecords(index: SurveyIndex, frame: CapturingScopeFrame | undefined, key: string): Array<ElementRecord> {
  if (!!frame) return getFrameDataKeys(frame).get(key);
  return index.byName.get(key).filter(record => record.kind === "question" && !record.valueName)
    .concat(index.byValueName.get(key));
}

// The record itself first, then every other question (or matrix column) of its data scope on the
// same data key.
function getSharingQuestions(index: SurveyIndex, record: ElementRecord): Array<ElementRecord> {
  const others = getDataKeyRecords(index, getCapturingFrame(record.scope), getDataKey(record));
  return [record].concat(others.filter(other => other !== record));
}

// What one object of the question's value is: a panel/row/item of an array ("array"), or a row
// of a matrixdropdown ("row"). Only questions of one kind add fields to each other's objects.
function getItemKind(record: ElementRecord): "array" | "row" | undefined {
  // a column of a matrix row shares the row key with a detail-panel question of the same key
  if (record.kind !== "question" && record.kind !== "column") return undefined;
  const type = getEffectiveType(record);
  if (type === "paneldynamic" || type === "matrixdynamic" || type === "imagemap" ||
    isDescendantOf(type, "checkbox")) return "array";
  if (type === "matrixdropdown") return "row";
  return undefined;
}

function getItemFieldRecord(record: ElementRecord, field: string): ElementRecord {
  if (!record.itemFieldRecords) record.itemFieldRecords = new CIMap<ElementRecord>();
  let res = record.itemFieldRecords.get(field);
  if (!res) {
    res = {
      name: field, type: ITEM_FIELD_TYPE, kind: "question", path: record.path, json: {},
      parent: record, scope: [], isUnknownType: false, valueType: { shape: "scalar", scalarType: "any" },
    };
    record.itemFieldRecords.set(field, res);
  }
  return res;
}

// The fields this question writes into one object: its template questions and its columns
// (detail-panel questions included) under the key each stores its value by - a panel inside a
// template holds no value and keeps its name - and for a checkbox or an image map with object
// items the fields of such an item.
function addOwnItemFields(record: ElementRecord, res: CIMultiMap<ElementRecord>): void {
  const subs = getSubElementNames(record);
  if (subs) {
    subs.forEach((records, name) => records.forEach(sub => {
      res.add(sub.kind === "question" && !!sub.valueName ? sub.valueName : name, sub);
    }));
    return;
  }
  const json = record.json || {};
  const valuePropertyName = typeof json.valuePropertyName === "string" ? json.valuePropertyName : "";
  const type = getEffectiveType(record);
  let fields: Array<string>;
  if (type === "imagemap") {
    // an image map wraps a selected area into an object only while it selects several
    // (QuestionImageMapModel.mapItemToggle); multiSelect defaults to true
    fields = json.multiSelect !== false && !!valuePropertyName ? [valuePropertyName] : [];
  } else if (isDescendantOf(type, "tagbox")) {
    // a tag box shows a comment area on its "Other" item alone (QuestionTagboxModel.supportMultipleComment),
    // so a choice comment never turns its items into objects
    fields = getCheckboxItemFields(valuePropertyName, []);
  } else {
    fields = getCheckboxItemFields(valuePropertyName, json.choices);
  }
  fields.forEach(field => res.add(field, getItemFieldRecord(record, field)));
}

const OBJECT_TYPES = ["multipletext", "matrix", "matrixdropdown"];

function isObjectValued(record: ElementRecord): boolean {
  return record.kind === "question" && OBJECT_TYPES.indexOf(getEffectiveType(record)) > -1;
}

// The rows a matrixdropdown lists; undefined when the JSON lists none (rows set in code), so any
// row may be one of them.
function getListedRows(record: ElementRecord): Array<string> | undefined {
  if (!record.json || !Array.isArray(record.json.rows)) return undefined;
  return (record.matrixRowValues || []).map(row => String(row));
}

function listsRow(rows: Array<string> | undefined, row: string): boolean {
  return !rows || rows.some(listed => listed.toLowerCase() === row.toLowerCase());
}

// A matrixdropdown row reads the record of that row only (RowsDynamicDataSource.readStoredAt),
// so a row key holds the columns of the matrixdropdowns that list the row.
function annotateMergedObject(record: ElementRecord, partners: Array<ElementRecord>): void {
  const merged: MergedObjectKeys = { keys: [], rowFields: new CIMap<CIMultiMap<ElementRecord>>() };
  partners.forEach(partner => {
    if (partner.multipleTextItems) merged.keys.push(...partner.multipleTextItems.names());
    if (Array.isArray(partner.matrixRowValues)) merged.keys.push(...partner.matrixRowValues.map(row => String(row)));
  });
  const dropdowns = partners.filter(partner => getEffectiveType(partner) === "matrixdropdown");
  dropdowns.forEach(dropdown => (getListedRows(dropdown) || []).forEach(row => {
    if (merged.rowFields.has(row)) return;
    const fields = new CIMultiMap<ElementRecord>();
    dropdowns.forEach(other => {
      if (listsRow(getListedRows(other), row)) addOwnItemFields(other, fields);
    });
    merged.rowFields.set(row, fields);
  }));
  const ownRows = getEffectiveType(record) === "matrixdropdown" ? getListedRows(record) : undefined;
  if (!!ownRows) {
    const readers = dropdowns.filter(dropdown => dropdown === record ||
      ownRows.some(row => listsRow(getListedRows(dropdown), row)));
    if (readers.length < dropdowns.length) {
      merged.ownRowFields = new CIMultiMap<ElementRecord>();
      readers.forEach(dropdown => addOwnItemFields(dropdown, merged.ownRowFields));
    }
  }
  record.mergedObject = merged;
}

// A template or detail-panel question with a valueName stores its value under another key than its name.
function isReKeyed(record: ElementRecord): boolean {
  let res = false;
  getSubElementNames(record).forEach((records, name) => {
    if (!res) res = records.some(sub => sub.kind === "question" && !!sub.valueName && sub.valueName.toLowerCase() !== name.toLowerCase());
  });
  return res;
}

// Set only where the fields differ from the name map, which getItemFields reads otherwise.
function annotateItemFields(record: ElementRecord, sharing: Array<ElementRecord>): void {
  const kind = getItemKind(record);
  const partners = sharing.filter(question => question !== record && !!kind && getItemKind(question) === kind);
  if (partners.length === 0 && !isReKeyed(record)) return;
  const fields = new CIMultiMap<ElementRecord>();
  [record].concat(partners).forEach(question => addOwnItemFields(question, fields));
  record.itemFields = fields;
}

// Run once the index is complete: a question may share its value with one declared after it.
export function annotateSharedValues(index: SurveyIndex): void {
  index.allElements.forEach(record => {
    const holdsSubElements = !!getSubElementNames(record);
    const objectValued = isObjectValued(record);
    if (!holdsSubElements && !objectValued) return;
    const sharing = getSharingQuestions(index, record);
    if (holdsSubElements) annotateItemFields(record, sharing);
    if (objectValued) {
      const partners = sharing.filter(isObjectValued);
      if (partners.length > 1) annotateMergedObject(record, partners);
    }
  });
}

// The fields one panel/row object of a dynamic panel or matrix holds; every check that reads a
// field of such an object ({panel.x}, {row.x}, {q[0].x}, keyName, carry-forward fields, inArray
// names, default value keys) asks this, not the template or the columns.
export function getItemFields(record: ElementRecord): CIMultiMap<ElementRecord> | undefined {
  return record.itemFields || getSubElementNames(record);
}

// The fields the object of a {row.x}/{panel.x} scope holds.
export function getFrameItemFields(frame: ScopeFrame): CIMultiMap<ElementRecord> | undefined {
  if (frame.kind !== "panelDynamic" && frame.kind !== "matrixRow") return undefined;
  const merged = frame.owner.mergedObject;
  return !!merged && !!merged.ownRowFields ? merged.ownRowFields : getItemFields(frame.owner);
}

// The fields of the total row: a total cell per column of the matrix itself
// (MatrixDropdownTotalRowModel), none for a detail-panel question.
export function getTotalFields(record: ElementRecord): CIMultiMap<ElementRecord> | undefined {
  const columns = record.matrixColumns;
  if (!columns) return undefined;
  let hasDetailElements = false;
  columns.forEach(records => {
    if (records.some(sub => sub.kind !== "column")) hasDetailElements = true;
  });
  if (!hasDetailElements) return columns;
  const res = new CIMultiMap<ElementRecord>();
  columns.forEach((records, name) => records.forEach(sub => {
    if (sub.kind === "column") res.add(name, sub);
  }));
  return res;
}

// The fields of the object a matrixdropdown value keeps under one row key; undefined for a key
// that holds no such object (a multiple-text item or a single-choice matrix row).
export function getRowFields(record: ElementRecord, rowKey: string): CIMultiMap<ElementRecord> | undefined {
  if (!!record.mergedObject) return record.mergedObject.rowFields.get(rowKey);
  return getEffectiveType(record) === "matrixdropdown" ? getItemFields(record) : undefined;
}

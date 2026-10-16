import { getCheckboxItemFields } from "survey-core";
import { CIMap, CIMultiMap, ElementRecord, getCapturingFrame, getEffectiveType, ITEM_FIELD_TYPE, MergedObjectKeys,
  ScopeFrame, SurveyIndex } from "./symbols";
import { isDescendantOf } from "./metadata";

// Questions on one data key share one value: the runtime binds them by getValueName() - the
// valueName, else the name - whichever of them declares the valueName. A dynamic panel's or a
// dynamic matrix's value is an array of objects every sharing question adds its fields to (a
// checkbox with object items, another dynamic panel or matrix); an object value (multiple text,
// matrix, matrixdropdown) gets keys from every sharing question. Sharing stays within one data
// scope: a question of a dynamic-panel template or of a matrix row keys its panel's or row's
// record, never the survey's.

function getDataKey(record: ElementRecord): string {
  return record.valueName || record.name;
}

function sameKey(a: string, b: string): boolean {
  return !!a && !!b && a.toLowerCase() === b.toLowerCase();
}

// The record itself first, then every other question of its data scope on the same data key.
function getSharingQuestions(index: SurveyIndex, record: ElementRecord): Array<ElementRecord> {
  const key = getDataKey(record);
  const res: Array<ElementRecord> = [record];
  const add = (other: ElementRecord): void => {
    if (other.kind === "question" && res.indexOf(other) < 0 && sameKey(getDataKey(other), key)) res.push(other);
  };
  const frame = getCapturingFrame(record.scope);
  if (!frame) {
    index.byName.get(key).forEach(add);
    index.byValueName.get(key).forEach(add);
  } else {
    const names = frame.kind === "panelDynamic" ? frame.templateNames : frame.columns;
    names.forEach(records => records.forEach(add));
  }
  return res;
}

// What one object of the question's value is: a panel/row/item of an array ("array"), or a row
// of a matrixdropdown ("row"). Only questions of one kind add fields to each other's objects.
function getItemKind(record: ElementRecord): "array" | "row" | undefined {
  if (record.kind !== "question") return undefined;
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
  const subs = record.templateNames || record.matrixColumns;
  if (subs) {
    subs.forEach((records, name) => records.forEach(sub => {
      res.add(sub.kind === "question" && !!sub.valueName ? sub.valueName : name, sub);
    }));
    return;
  }
  const json = record.json || {};
  const valuePropertyName = typeof json.valuePropertyName === "string" ? json.valuePropertyName : "";
  const fields = getEffectiveType(record) === "imagemap"
    ? (valuePropertyName ? [valuePropertyName] : [])
    : getCheckboxItemFields(valuePropertyName, json.choices);
  fields.forEach(field => res.add(field, getItemFieldRecord(record, field)));
}

const OBJECT_TYPES = ["multipletext", "matrix", "matrixdropdown"];

function isObjectValued(record: ElementRecord): boolean {
  return record.kind === "question" && OBJECT_TYPES.indexOf(getEffectiveType(record)) > -1;
}

function annotateMergedObject(record: ElementRecord, partners: Array<ElementRecord>): void {
  const merged: MergedObjectKeys = { keys: [], dropdownRows: [], columns: new CIMultiMap<ElementRecord>() };
  partners.forEach(partner => {
    if (partner.multipleTextItems) merged.keys.push(...partner.multipleTextItems.names());
    if (!Array.isArray(partner.matrixRowValues)) return;
    const rows = partner.matrixRowValues.map(row => String(row));
    merged.keys.push(...rows);
    if (getEffectiveType(partner) === "matrixdropdown") {
      merged.dropdownRows.push(...rows);
      addOwnItemFields(partner, merged.columns);
    }
  });
  record.mergedObject = merged;
}

// Run once the index is complete: a question may share its value with one declared after it.
export function annotateSharedValues(index: SurveyIndex): void {
  index.allElements.forEach(record => {
    const holdsSubElements = !!record.templateNames || !!record.matrixColumns;
    const objectValued = isObjectValued(record);
    if (!holdsSubElements && !objectValued) return;
    const sharing = getSharingQuestions(index, record);
    if (holdsSubElements) {
      const kind = getItemKind(record);
      const fields = new CIMultiMap<ElementRecord>();
      sharing.forEach(question => {
        if (question === record || (!!kind && getItemKind(question) === kind)) addOwnItemFields(question, fields);
      });
      record.itemFields = fields;
    }
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
  return record.itemFields || record.templateNames || record.matrixColumns;
}

// The fields the object of a {row.x}/{panel.x} scope holds.
export function getFrameItemFields(frame: ScopeFrame): CIMultiMap<ElementRecord> | undefined {
  if (frame.kind === "panelDynamic") return getItemFields(frame.owner) || frame.templateNames;
  if (frame.kind === "matrixRow") return getItemFields(frame.owner) || frame.columns;
  return undefined;
}

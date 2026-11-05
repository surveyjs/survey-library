import { Question } from "../../src/question";
import { QuestionSelectBase } from "../../src/question_baseselect";
import { QuestionTextModel } from "../../src/question_text";
import { QuestionRatingModel } from "../../src/question_rating";
import { QuestionBooleanModel } from "../../src/question_boolean";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { MatrixDropdownRowModelBase } from "../../src/question_matrixdropdownbase";
import { QuestionMatrixDropdownRenderedCell, QuestionMatrixDropdownRenderedRow } from "../../src/question_matrixdropdownrendered";
import { ActionContainer } from "../../src/actions/container";
import { Action } from "../../src/actions/action";

/* What a question kept for another record has to look like: the state a question built for that record
   shows to the respondent, to a renderer and to the survey. A records question that rebinds its objects
   instead of re-creating them (a matrix row on a sort or a page move, see matrix-rebind-rows.test.ts)
   compares each of its questions with the one a fresh build gives. The Dynamic Panel compares the
   questions of its panels the same way. */
export function getQuestionState(q: Question): any {
  const res: any = {
    name: q.name, type: q.getType(), value: q.value, comment: q.comment, displayValue: q.displayValue,
    isEmpty: q.isEmpty(), isAnswered: q.isAnswered, isValueDefault: q.isValueDefault,
    isValueChangedDirectly: !!q["isValueChangedDirectly"], isFocusEmpty: !!q["isFocusEmpty"],
    errors: q.errors.map((error: any): string => error.getText()),
    isVisible: q.isVisible, isReadOnly: q.isReadOnly, isRequired: q.isRequired,
    rootCss: q.getRootCss()
  };
  if (typeof (<any>q).getControlClass === "function") res.controlCss = (<any>q).getControlClass();
  if (q instanceof QuestionSelectBase) {
    res.visibleChoices = q.visibleChoices.map((item: any): any => item.value);
    res.isOtherSelected = q.isOtherSelected;
    res.renderedValue = q.renderedValue;
  }
  if (q instanceof QuestionTextModel) {
    res.inputValue = q.inputValue;
  }
  if (q instanceof QuestionRatingModel) {
    res.rateValues = q.visibleRateValues.map((item: any): any => item.value);
    res.renderedValue = q.renderedValue;
  }
  if (q instanceof QuestionBooleanModel) {
    res.booleanValue = q.booleanValue;
  }
  // Read on both sides: the list model is created on the first read.
  const listModel = typeof q["getDropdownListModel"] === "function" ? q["dropdownListModel"] : undefined;
  if (!!listModel) {
    res.dropdown = {
      inputString: listModel.inputStringRendered, filterString: listModel.filterString, hintString: listModel.hintString,
      isPopupVisible: listModel.popupModel.isVisible, ariaExpanded: listModel.ariaExpanded
    };
  }
  return res;
}
/* Every field a question holds itself - its own fields and its stored properties - for the fields
   getQuestionState does not read: a private field a rebind does not reset (a value a hidden choice keeps,
   a remembered "other" text) is invisible to the public state. Plain values only: an object of a class
   is a helper, created lazily on one side and not the other, and the helpers that hold per-record state
   are read by getQuestionState. An empty value (false, "", null, [], {}) counts as no value: a fresh
   question has never set a field a rebound one has set back to empty, and a stored property is read
   with its default. A field that differs for a reason goes on this list with the reason; a new field
   that keeps something of the old record has to be reset (Question.resetForAnotherRecord). */
const ignoredQuestionFields: { [name: string]: string } = {
  "#id": "the instance is kept, and with it its id, as the row keeps its id",
  "uniqueIdValue": "the instance number",
  "valueRevision": "counts the value writes of the instance",
  "asyncRunIdCounter": "counts the async runs of the instance",
  "isCustomWidgetRequested": "the custom widget lookup is cached per instance; it depends on the question's type and properties"
};
function getFieldValue(val: any, depth: number): any {
  if (val === null || val === false || val === "" || typeof val === "function") return undefined;
  if (typeof val !== "object") return val;
  if (Array.isArray(val)) {
    const items = val.map((item: any): any => depth > 2 ? "[item]" : getFieldValue(item, depth + 1));
    return items.length > 0 ? items : undefined;
  }
  if (Object.getPrototypeOf(val) !== Object.prototype) return undefined;
  if (depth > 2) return "{object}";
  const res: any = {};
  Object.keys(val).forEach((key: string): void => {
    const item = getFieldValue(val[key], depth + 1);
    if (item !== undefined) res[key] = item;
  });
  return Object.keys(res).length > 0 ? res : undefined;
}
/* A stored property as the question reads it: through its getter when it has one, which applies the
   default and recomputes what the hash caches (isVisible). */
function readStoredProperty(q: Question, key: string): any {
  for (let proto = Object.getPrototypeOf(q); !!proto; proto = Object.getPrototypeOf(proto)) {
    const descriptor = Object.getOwnPropertyDescriptor(proto, key);
    if (!!descriptor) return !!descriptor.get ? q[key] : q.getPropertyValue(key);
  }
  return q.getPropertyValue(key);
}
// The stored properties of a question by name; a choice's comment is named by the instance id of its item, so it goes by the choice value.
function getStoredProperties(q: Question): any {
  const res: any = {};
  const hash = q["propertyHash"];
  Object.keys(hash).forEach((key: string): void => { res[key] = key; });
  if (q instanceof QuestionSelectBase) {
    // The visible choices too: under choicesFromQuestion they are copies, not the question's choices.
    q.choices.concat(q.visibleChoices).forEach((item: any): void => {
      const key = "other_" + item.uniqueId;
      if (key in res) {
        delete res[key];
        res["comment of " + item.value] = key;
      }
    });
  }
  return res;
}
// The fields that differ between a rebound question and the one a fresh build gives: { name: [rebound, fresh] }.
export function getQuestionFieldDiffs(q: Question, fresh: Question): any {
  const res: any = {};
  const union = (a: any, b: any): Array<string> => Object.keys(a).concat(Object.keys(b).filter((key: string): boolean => !(key in a)));
  const compare = (prefix: string, keys: Array<string>, read: (obj: Question, key: string) => any): void => {
    keys.forEach((key: string): void => {
      const name = prefix + key;
      if (key === "propertyHash" || ignoredQuestionFields[name] !== undefined) return;
      const val = getFieldValue(read(q, key), 0);
      const freshVal = getFieldValue(read(fresh, key), 0);
      if (JSON.stringify(val) !== JSON.stringify(freshVal)) res[name] = [val, freshVal];
    });
  };
  compare("", union(q, fresh), (obj: Question, key: string): any => obj[key]);
  const stored = getStoredProperties(q);
  const freshStored = getStoredProperties(fresh);
  compare("#", union(stored, freshStored), (obj: Question, key: string): any => {
    const hashKey = (obj === q ? stored : freshStored)[key];
    // A property the other question has not stored is read with its default; a choice comment it has not stored is empty.
    if (hashKey === undefined) return key.indexOf("comment of ") === 0 ? undefined : readStoredProperty(obj, key);
    return readStoredProperty(obj, hashKey);
  });
  return res;
}
// The action ids of a row's action cells and the class of every cell, as the rendered table holds them.
function getRenderedRowState(renderedRow: QuestionMatrixDropdownRenderedRow): any {
  return {
    className: renderedRow.className,
    cells: renderedRow.cells.map((cell: QuestionMatrixDropdownRenderedCell): any => {
      if (!cell.isActionsCell) return cell.className;
      const container = <ActionContainer>cell.item.value;
      return container.actions.map((action: Action): any => [action.id, action.enabled, action.visible, action.ariaLabel]);
    })
  };
}
/* The rows of a matrix, the table it renders and the totals. The table is read only when it is built:
   reading it builds it. */
export function getMatrixState(matrix: QuestionMatrixDynamicModel): any {
  const table = matrix.getPropertyValueWithoutDefault("renderedTable");
  const res: any = {
    rows: matrix.visibleRows.map((row: MatrixDropdownRowModelBase): any => ({
      visibleIndex: row.visibleIndex, rowIndex: (<any>row).rowIndex, text: row.text, isVisible: row.isVisible,
      shortcutText: (<any>row).shortcutText, value: row.value,
      cells: row.cells.map((cell: any): any => getQuestionState(cell.question))
    })),
    pageIndex: matrix.pageIndex, pageCount: matrix.pageCount, isAnswered: matrix.isAnswered
  };
  if (!!table) {
    res.table = table.rows.filter((row: QuestionMatrixDropdownRenderedRow): boolean => !!row.row && !row.isDetailRow)
      .map((row: QuestionMatrixDropdownRenderedRow): any => getRenderedRowState(row));
  }
  if (matrix.hasTotal) {
    res.totals = matrix.visibleTotalRow.cells.map((cell: any): any => cell.question.value);
  }
  return res;
}

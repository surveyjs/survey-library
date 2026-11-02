import { settings } from "survey-core";
import type { Question } from "survey-core";

// The one place that knows a dynamic container is a dynamic panel or a dynamic matrix. To the interview
// the two are the same thing, a list of entries that grows and shrinks, and the model spells it twice:
// visiblePanels / visibleRows, panelCount / rowCount, addPanel / addRow. Every read or write that
// depends on the spelling is here, with the branch inside, and the rest of the interview asks these
// functions. A leaf: it imports nothing of the interview, so every module may import it.

// Static panels inside an entry, not containers: the bound only stops a cycle in a broken model. It is
// not the ceiling of interview-address.ts, and importing that one would close an import cycle.
const MAX_PANEL_WALK = 20;

// Duck-typed, as the tester duck-types the same shapes: a dynamic container is known by the fact that
// it holds entries one adds, not by a table of type strings that a custom question type registered
// under another name would fall out of. A question, because PanelModelBase declares an addPanel of its
// own, so a page, a static panel and the panel of an entry all have one, and the panel of an entry
// does reach these checks (interview-address.ts isEntryMissing). isQuestion reads nothing and builds
// nothing.
function isQuestionWith(question: any, method: string): boolean {
  return !!question && question.isQuestion === true && typeof question[method] === "function";
}

export function isDynamicPanel(question: any): boolean {
  return isQuestionWith(question, "addPanel");
}

export function isDynamicMatrix(question: any): boolean {
  return isQuestionWith(question, "addRow");
}

// A container whose value is a list that grows and shrinks - a dynamic panel, a dynamic matrix - filled
// per entry (interview-records.ts). Its entries a respondent adds and removes one at a time, so it owns
// a summary step: the list of entries with add / remove / edit that the mode itself offers. By the
// method alone, never by visiblePanels or visibleRows: reading either builds the entries of a question
// nobody has rendered, and a template's own nested question must never be built by a look.
export function isDynamicContainer(question: any): boolean {
  return isDynamicPanel(question) || isDynamicMatrix(question);
}

// A dynamic panel or a dynamic matrix whose records belong to a data source (the records layer's
// public "dataSource"). The source owns them: the question refuses writes to its value, it may page
// them on its own terms, and the records are in survey.data only for some sources. The interview does
// not support it yet (OPEN 32): the container is one unsupported item with reason "dataSource", in
// both modes, and nothing below it is an item. Duck-typed, as hasChoiceElements is.
export function hasDataSource(question: Question): boolean {
  const target: any = question;
  return !!target && !!target.dataSource;
}

// What the interviewee sees, in the order they see it: visiblePanels with templateVisibleIf applied,
// visibleRows with rowsVisibleIf applied. Read on a live container only: the first read builds the
// entries of a container nobody has rendered.
export function getEntryObjects(container: Question): Array<any> {
  const target: any = container;
  const res = isDynamicPanel(target) ? target.visiblePanels : target.visibleRows;
  return Array.isArray(res) ? res : [];
}

// The position, among the entries shown, of the entry that holds the child. -1 when no shown entry
// does: a cell of a total row, a row a rowsVisibleIf hides.
export function getEntryIndexOf(container: Question, child: any): number {
  const entries = getEntryObjects(container);
  if (!isDynamicPanel(container)) {
    // The cell's own row: setSurveyImpl(row) is what a cell question was built with, so "data" is the
    // row it belongs to.
    return entries.indexOf(child.data);
  }
  // The question may sit in a static panel inside the panel of the dynamic panel, so the parent chain
  // is walked until one of the panels is reached.
  let node = child.parent;
  for (let depth = 0; depth < MAX_PANEL_WALK && !!node; depth++) {
    const index = entries.indexOf(node);
    if (index > -1) return index;
    node = node.parent;
  }
  return -1;
}

// Whether an add or a remove actually happened. The visible list is the wrong thing to count with: a
// new panel a templateVisibleIf hides never appears in it although the container did grow.
export function getEntryCount(container: Question): number {
  const target: any = container;
  return isDynamicPanel(target) ? target.panelCount : target.rowCount;
}

export function canAddEntry(container: Question): boolean {
  const target: any = container;
  // False at the maximum count, with adding turned off, in read-only state, and under a
  // panelCountExpression / rowCountExpression - the count is then the expression's, and records
  // cannot change it.
  return isDynamicPanel(target) ? target.canAddPanel === true : target.canAddRow === true;
}

// The very reads the summary step's remove button is built from.
export function canRemoveEntry(container: Question, entry: any): boolean {
  const target: any = container;
  if (isDynamicPanel(target)) return target.canRemovePanel === true;
  return target.canRemoveRows === true && target.canRemoveRow(entry) === true;
}

// The limit the model checks every add against (canAddPanel / canAddRow): the maximum, capped by the
// global setting while the list does not page - and it never pages in single-input mode, which the
// interview keeps the survey in. Not the description's maxCount, which leaves out a ceiling the survey
// never set.
export function getMaxEntryCount(container: Question): number {
  const target: any = container;
  return isDynamicPanel(target)
    ? Math.min(target.maxPanelCount, settings.panel.maxPanelCount)
    : Math.min(target.maxRowCount, settings.matrix.maxRowCount);
}

export function getMinEntryCount(container: Question): number {
  const target: any = container;
  const min = isDynamicPanel(target) ? target.minPanelCount : target.minRowCount;
  return typeof min === "number" ? min : 0;
}

// Not singleInputAddItem(), addPanelUI() or addRowUI(): those are the mode's and the UI's gestures -
// canLeaveCurrentPanel, focus, moving the current input - and this is a data write.
export function addEntry(container: Question): any {
  const target: any = container;
  if (isDynamicPanel(target)) {
    // A negative index appends in every display mode; runAdditionalActions left off means no focus,
    // no animation and no canAddPanel check of its own, which is why the interview checks first.
    return target.addPanel(-1);
  }
  // addRow checks canAddRow itself, fires onMatrixRowAdding, and shows the detail panel when
  // detailPanelShowOnAdding says so. It returns nothing, so the new row is the one allRows did not hold
  // before - not the last of visibleRows: a rowsVisibleIf may hide the new row, and the last visible
  // one is then an existing entry the add's values would overwrite. allRows, because a hidden row is
  // still the row this add created, and a new panel a templateVisibleIf hides is patched the same way.
  const before: Array<any> = getAllRows(target).slice();
  target.addRow(false);
  const added = getAllRows(target).filter(row => before.indexOf(row) < 0);
  return added.length > 0 ? added[added.length - 1] : undefined;
}

function getAllRows(matrix: any): Array<any> {
  return Array.isArray(matrix.allRows) ? matrix.allRows : [];
}

export function removeEntry(container: Question, entry: any): void {
  const target: any = container;
  if (isDynamicPanel(target)) {
    // confirmDelete left undefined: the non-UI branch, no dialog - and nobody answers a dialog in Node.
    target.removePanel(entry);
    return;
  }
  // The index is the row's position now, not the one the agent sent; false skips the prompt. The call
  // still checks canRemoveRows and notifies the single-input mode.
  const index = target.visibleRows.indexOf(entry);
  if (index >= 0) target.removeRow(index, false);
}

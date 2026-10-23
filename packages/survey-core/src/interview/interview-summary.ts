import type { Question } from "survey-core";
import type { IInterviewAction, IInterviewError, IInterviewSummary } from "./interview-types";
import {
  badActionIndexError, cannotAddError, cannotRemoveError, notAnActionError, unknownActionError,
} from "./interview-errors";

// The summary step of a dynamic panel or a dynamic matrix: the list of entries with add / remove /
// edit that the mode itself offers a respondent, described as an item and answered with an action.
//
// Everything here is the model's. The entry titles are the localized strings the summary shows (the
// processed templateTitle, "Panel 2", "Row 1", a row name), the add caption is the model's
// addPanelText / addRowText, and the "no entries" line is the question's own noEntriesText /
// noRowsText. The interview phrases nothing and decides nothing about the order or the content of
// the list - see overview 2.1: if the step seems to need something the mode does not offer, the fix
// goes into the mode, for the UI too.
//
// The model builds the summary only for the container that is the current single input
// (QuestionSingleInputBehavior.singleInputSummary returns undefined otherwise), so the description
// is read for the item that is current and not for every summary step of the inventory. That is the
// only item whose summary a document ever renders.

export function getSummaryDescription(container: Question): IInterviewSummary {
  const summary: any = container.singleInputSummary;
  const addText = container.getSingleInputAddText();
  // Built key by key rather than declared in one literal: the keys come out in the order the
  // document reads in - the entries first, then whether another one may be added.
  const res: Partial<IInterviewSummary> = {};
  const items: Array<any> = !!summary && Array.isArray(summary.items) ? summary.items : [];
  if (items.length > 0) {
    res.entries = items.map((item, index) => ({
      index: index,
      title: getText(item.locText),
      canRemove: item.showRemove === true,
    }));
  } else if (!!summary) {
    // The question's own "there is nothing here yet" line, localized. Written instead of an empty
    // entries list: a consumer that has to say something has the sentence the UI would show.
    res.noEntriesText = getText(summary.noEntry);
  }
  res.canAdd = !!addText;
  if (!!addText) res.addText = addText;
  return <IInterviewSummary>res;
}

export interface ISummaryActionResult {
  error?: IInterviewError;
  // "done" is the only action the model has no notion of: it is the interviewee saying the container
  // is finished, which the interview remembers in its skipped set (tier 04 3).
  isDone?: boolean;
  // "edit" moved the model into an entry the rule would not have picked - that entry is answered and
  // valid. The result of this one call follows the model instead of the rule.
  followsModel?: boolean;
}

export function applySummaryAction(container: Question, address: string, value: any): ISummaryActionResult {
  if (!isAction(value)) return { error: notAnActionError(address) };
  const action: IInterviewAction = value;
  switch(action.action) {
    case "done": return { isDone: true };
    case "add": return addEntry(container, address);
    case "remove": return removeEntry(container, address, action.index);
    case "edit": return editEntry(container, address, action.index);
  }
  return { error: unknownActionError(address, action.action) };
}

export function isAction(value: any): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value) && typeof value.action === "string";
}

function addEntry(container: Question, address: string): ISummaryActionResult {
  // getSingleInputAddText() is the model's own answer to "may an entry be added": it returns the
  // caption when canAddPanel / canAddRow is true and undefined when it is not.
  if (!container.getSingleInputAddText()) return { error: cannotAddError(address) };
  // false, not true: the entries that exist have already been validated by the interview, and
  // checkErrors would run validateSingleInput() on the summary step itself.
  container.singleInputAddItem(false);
  return {};
}

// Not btnRemove.action(): that is removePanelUI / removeRowUI, which consult confirmDelete and hand
// a populated entry to confirmActionAsync - a dialog nobody answers in Node, so the removal would
// stay pending forever. The data-level calls do the removal itself; asking "remove X?" first is the
// consumer's job, and a chat or a voice front end is where that question belongs.
function removeEntry(container: Question, address: string, index: any): ISummaryActionResult {
  const entries = getEntries(container);
  if (!isEntryIndex(index, entries.length)) {
    return { error: badActionIndexError(address, "remove", index, entries.length) };
  }
  // The entry's own remove button is the model's answer to "may this one go": it is absent when
  // canRemovePanel / canRemoveRow says no.
  if (entries[index].showRemove !== true) return { error: cannotRemoveError(address, index) };
  const target: any = container;
  if (typeof target.removePanel === "function" && Array.isArray(target.visiblePanels)) {
    // confirmDelete left undefined: the non-UI branch goes straight to removePanelCore.
    target.removePanel(target.visiblePanels[index]);
    return {};
  }
  if (typeof target.removeRow === "function") {
    // false skips the prompt; the call still checks canRemoveRows and notifies the single-input mode.
    target.removeRow(index, false);
  }
  return {};
}

function editEntry(container: Question, address: string, index: any): ISummaryActionResult {
  const entries = getEntries(container);
  if (!isEntryIndex(index, entries.length)) {
    return { error: badActionIndexError(address, "edit", index, entries.length) };
  }
  // singInputEditPanel / singleInputEditRow: the model moves to the entry's first question.
  entries[index].btnEdit.action();
  return { followsModel: true };
}

function getEntries(container: Question): Array<any> {
  const summary: any = container.singleInputSummary;
  return !!summary && Array.isArray(summary.items) ? summary.items : [];
}

function isEntryIndex(index: any, count: number): boolean {
  return typeof index === "number" && index >= 0 && index < count && Math.floor(index) === index;
}

function getText(locString: any): string {
  const res = !!locString ? locString.textOrHtml : undefined;
  return typeof res === "string" ? res : "";
}

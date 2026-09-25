import { Helpers, Question, QuestionPanelDynamicModel } from "survey-core";
import { getCollabString } from "../collaboration-strings";

// One recorded edit, as the history keeps it.
//
// Identity is a SNAPSHOT, not a reference into the roster: a peer is dropped from the
// roster the moment they leave (PresenceRoster.removePeer), and "Ann changed Budget"
// has to stay readable after Ann has gone. It is the same reason identity travels in
// the presence envelope rather than inside the state.
export interface IHistoryEntry {
  // Monotonic within a session; the list key, and what makes two edits of the same
  // question at the same millisecond distinguishable.
  id: number;
  at: number;
  // null means this participant. The plugin never learns its own client id - `init`
  // carries one but only the host reads it - and does not need to: "you" is not a
  // name, and the bar has never painted the local participant either.
  clientId: string | null;
  // "" when the author is not in the roster: a relay that stamps no `from`, a peer
  // with presence switched off, or a value that outran its sender's first presence.
  name: string;
  // 0 is the theme's reserved "unknown user" grey, which is exactly what an author
  // we cannot resolve should be painted.
  colorIndex: number;
  questionName: string;
  isComment: boolean;
  // The question title as it read when the edit landed, so a log entry keeps making
  // sense after a title expression re-evaluates.
  title: string;
  text: string;
}

// A history entry holds a DESCRIPTION of the value, never the value.
//
// A file or a signature answer is its own content when storeDataAsText is on - megabytes
// of base64 - and a session-long log of those would be a memory leak with a UI on top.
export const MAX_HISTORY_TEXT = 80;

function truncate(text: string): string {
  if (text.length <= MAX_HISTORY_TEXT) return text;
  return text.substring(0, MAX_HISTORY_TEXT - 1) + "\u2026";
}

function isPlainObject(value: any): boolean {
  return !!value && typeof value === "object" && value.constructor === Object;
}

// What an answer holds once the parts holding nothing are dropped - empty cells, rows,
// panels, fields - or undefined when nothing is left.
//
// Emptier than Helpers.isValueEmpty, which counts [{}, {}] as an answer. A matrix keeps
// its rows when their cells are cleared, and value-normalize pads the value up to the
// row count, so rows holding nothing are how an unanswered matrix looks on the wire.
function contentOf(value: any): any {
  if (Array.isArray(value)) {
    const items = value.map(contentOf).filter((item) => item !== undefined);
    return items.length > 0 ? items : undefined;
  }
  if (isPlainObject(value)) {
    const res: { [key: string]: any } = {};
    Object.keys(value).forEach((key) => {
      const item = contentOf(value[key]);
      if (item !== undefined) res[key] = item;
    });
    return Object.keys(res).length > 0 ? res : undefined;
  }
  return Helpers.isValueEmpty(value) ? undefined : value;
}

function isEmptyValue(value: any): boolean {
  return contentOf(value) === undefined;
}

// Did the answer change in anything a participant can read? Adding or removing a row
// that holds nothing changes the value and leaves the answer as it was. Case counts:
// survey-core's own comparison ignores it by default, a reader does not.
export function hasSameContent(a: any, b: any): boolean {
  return Helpers.isTwoValueEquals(contentOf(a), contentOf(b), false, true, false);
}

const CONTENT_TYPES = ["file", "signaturepad"];

// Does the question hold a file or a signature anywhere inside it? Such an answer is
// data rather than text - base64 or a storage URL, depending on storeDataAsText - so the
// log says only that it changed. Decided by the question, not by the shape of its value:
// a signature stored as a URL is a plain string, indistinguishable from a text answer.
//
// A single-question custom type keeps its content OUTSIDE getNestedQuestions, hence
// contentQuestion.
function holdsFileContent(question: Question): boolean {
  if (CONTENT_TYPES.indexOf(question.getType()) > -1) return true;
  const content: Question = (question as any).contentQuestion;
  if (!!content && holdsFileContent(content)) return true;
  return childrenOf(question).some(holdsFileContent);
}

// A dynamic panel builds its panels only once its page is rendered, so on a page this
// participant has not opened getNestedQuestions is empty while the value is full. Its
// template always exists - and holds each question once, however many panels there are.
function childrenOf(question: Question): Array<Question> {
  if (question.isDescendantOf("paneldynamic")) return (question as QuestionPanelDynamicModel).template.questions;
  return question.getNestedQuestions(false, false, false);
}

// A matrix, a dynamic panel, multiple text and a composite have an OBJECT for a display
// value - or an array of them - keyed by what the participant reads: row, column, item
// and field titles. String() makes "[object Object]" of it, so it is spelled out instead:
// "key: value" joined by ",", rows and panels by ";", and a nested group in brackets.
function describeDisplay(display: any): string {
  if (isEmptyValue(display)) return "";
  if (Array.isArray(display)) {
    const parts = display.map(describeDisplay).filter((text) => !!text);
    return parts.join(display.some(isPlainObject) ? "; " : ", ");
  }
  if (isPlainObject(display)) {
    return Object.keys(display).map((key) => {
      const text = describeDisplay(display[key]);
      if (!text) return "";
      return key + ": " + (isGroup(display[key]) ? "(" + text + ")" : text);
    }).filter((text) => !!text).join(", ");
  }
  return String(display);
}

// Brackets only where the nested text would otherwise run into its neighbours: a lone
// answer reads fine without them.
function isGroup(value: any): boolean {
  if (isPlainObject(value)) return true;
  if (!Array.isArray(value)) return false;
  return value.some(isPlainObject) || value.filter((item) => !isEmptyValue(item)).length > 1;
}

export function describeValue(question: Question | null, value: any, isComment: boolean): string {
  if (isEmptyValue(value)) return getCollabString("collabHistoryCleared");
  if (isComment) return truncate(String(value));
  if (!!question) {
    // See MAX_HISTORY_TEXT.
    if (holdsFileContent(question)) return getCollabString("collabHistoryChanged");
    // What the participant sees rather than what travels: a choice reads as its text,
    // not as its value.
    const display = describeDisplay(question.displayValue);
    if (!!display) return truncate(display);
  }
  // No question to ask, or one that shows none of this value (a matrix row hidden by
  // rowsVisibleIf): the value itself - spelled out if it is a structure.
  if (typeof value === "object") return truncate(describeDisplay(value));
  const serialized = JSON.stringify(value);
  return truncate(serialized === undefined ? String(value) : serialized);
}

// Who to put in front of an entry. Resolved here rather than in the bar so that a
// host rendering its own list words it the same way.
export function historyAuthorLabel(entry: IHistoryEntry): string {
  if (entry.clientId === null) return getCollabString("collabHistoryYou");
  return entry.name || getCollabString("collabHistoryUnknown");
}

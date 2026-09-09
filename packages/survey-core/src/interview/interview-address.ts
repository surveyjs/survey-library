import type { Question, SurveyModel } from "survey-core";

// The address of an input: the string that names it in answer(name, value), in errors[].name and in
// the answered map. A plain question name at the top level, "medications[0].dose" for a question of
// the first panel of a dynamic panel, "items[0].quantity" for a cell of a dynamic matrix,
// "matrix.row1.column1" for a cell of a matrix dropdown, "contact.email" for an item of a multiple
// text or a question of a composite component, and any nesting of those - "orders[1].items[0].sku".
//
// It is the same grammar as the tester's target names (SurveyTestTargets.nameOf / resolve,
// src/tester/test-targets.ts). The two are twins that must stay in step, and they are separate on
// purpose: a sub-bundle imports nothing but "survey-core" (overview 2.5), so neither can import the
// other, and unifying them by moving the grammar into survey-core is a later task. A test in
// tests/interview/interviewAddressTests.ts pins the two against each other over a nested fixture.
//
// Two differences from the tester, both deliberate:
//   - an entry is indexed over what the interviewee sees - visiblePanels / visibleRows, the very list
//     the summary step numbers and the "remove" and "edit" actions index - where the tester indexes
//     panels. With templateVisibleIf hiding a panel the two disagree, and so does the index into the
//     data; an interview that emitted an address the summary step cannot act on would be worse.
//   - a segment that carries a ".", a "[", a "]" or a quote is written as a double-quoted JSON
//     string ('contact."e.mail"'), which the tester's grammar has no form for at all.
//
// The interview composes an address nowhere else: getAddress() writes them and resolveAddress()
// reads them.

// A path is a chain of containers, not a recursion; the ceiling only stops a cycle in a broken model
// from hanging the caller. Same value as the tester's MAX_TARGET_DEPTH.
const MAX_ADDRESS_DEPTH = 20;
// A segment is written bare unless it carries one of the characters the grammar itself uses.
const BARE_SEGMENT_REGEX = /^[^.[\]"]+$/;
const DIGITS_REGEX = /^\d+$/;

export interface IInterviewAddressSegment {
  name: string;
  // the entry of a dynamic container the next segment lives in
  index?: number;
}

export interface IInterviewAddressResolution {
  question?: Question;
  // The text is malformed, or an index is past the number of entries there are now. The second is
  // not "unknown": the address is well formed and the entry simply does not exist yet, and the way
  // to make it exist is the summary step's "add" action, not an answer to an address.
  isBad?: boolean;
}

export function formatAddressSegment(segment: IInterviewAddressSegment): string {
  return quoteSegment(segment.name) + (segment.index === undefined ? "" : "[" + segment.index + "]");
}

export function formatAddress(segments: Array<IInterviewAddressSegment>): string {
  return segments.map(formatAddressSegment).join(".");
}

// Derived from the model, never remembered: the input the mode handed out is walked up through
// parentQuestion, and each hop contributes the container's name plus what identifies the entry the
// input sits in. Returns undefined when a container of the chain cannot be addressed at all - the
// caller then has no address for that input rather than one that resolves to something else.
export function getAddress(question: Question): string | undefined {
  if (!question || !question.name) return undefined;
  let path = quoteSegment(question.name);
  let current: any = question;
  for (let depth = 0; depth < MAX_ADDRESS_DEPTH; depth++) {
    const parent: any = current.parentQuestion;
    if (!parent) return path;
    if (!parent.name) return undefined;
    const segment = getContainerSegment(parent, current);
    if (segment === undefined) return undefined;
    path = quoteSegment(parent.name) + segment + "." + path;
    current = parent;
  }
  return undefined;
}

// What identifies, inside the parent, the entry the child belongs to. "" for a container whose
// children are named and unique - a multiple text, a composite, a single-choice matrix, whose
// synthesized row question is named after the row.
function getContainerSegment(parent: any, child: any): string | undefined {
  if (isDynamicPanel(parent)) {
    const index = getPanelIndex(parent, child);
    return index < 0 ? undefined : "[" + index + "]";
  }
  // The one container whose inputs are not questions of the JSON: the mode synthesizes a radiogroup
  // or a checkbox per row, named after the row, so the row needs no segment of its own.
  if (isSingleChoiceMatrix(parent)) return "";
  const rows = getVisibleRows(parent);
  if (!!rows) {
    // The cell's own row: setSurveyImpl(row) is what a cell question was built with, so "data" is
    // the row it belongs to.
    const index = rows.indexOf(child.data);
    if (index >= 0) {
      if (isDynamicMatrix(parent)) return "[" + index + "]";
      const rowName = getRowName(rows[index]);
      return rowName === undefined ? undefined : "." + quoteSegment(rowName);
    }
  }
  return "";
}

// The question may sit in a static panel inside the panel of the dynamic panel, so the parent chain
// is walked until one of the panels is reached - the walk getPanelByQuestion does
// (src/question_paneldynamic.ts).
function getPanelIndex(panelDynamic: any, child: any): number {
  const panels: Array<any> = panelDynamic.visiblePanels;
  if (!Array.isArray(panels)) return -1;
  let node = child.parent;
  for (let depth = 0; depth < MAX_ADDRESS_DEPTH && !!node; depth++) {
    const index = panels.indexOf(node);
    if (index > -1) return index;
    node = node.parent;
  }
  return -1;
}

// Duck-typed, as the tester duck-types the same three shapes: the address grammar knows a dynamic
// panel by the fact that it holds panels one adds and removes, not by a table of type strings that
// a custom question type registered under another name would fall out of.
function isDynamicPanel(question: any): boolean {
  return !!question && typeof question.addPanel === "function" && Array.isArray(question.panels);
}

function isDynamicMatrix(question: any): boolean {
  return !!question && typeof question.addRow === "function" && Array.isArray(question.visibleRows);
}

function isSingleChoiceMatrix(question: any): boolean {
  return !!question && typeof question.getMatrixSingleInputQuestions === "function";
}

function getVisibleRows(question: any): Array<any> | undefined {
  return !!question && Array.isArray(question.visibleRows) ? question.visibleRows : undefined;
}

function getRowName(row: any): string | undefined {
  const name = !!row ? row.rowName : undefined;
  if (name === undefined || name === null || String(name) === "") return undefined;
  return String(name);
}

function quoteSegment(name: string): string {
  return BARE_SEGMENT_REGEX.test(name) ? name : JSON.stringify(name);
}

// The grammar, read back. Returns undefined for anything the format does not accept: an empty
// segment, an unterminated quote, an index that is not a run of digits, a stray bracket.
export function parseAddress(text: string): Array<IInterviewAddressSegment> | undefined {
  if (typeof text !== "string" || text.length === 0) return undefined;
  const res: Array<IInterviewAddressSegment> = [];
  let pos = 0;
  while(pos < text.length) {
    const name = readSegmentName(text, pos);
    if (!name) return undefined;
    pos = name.pos;
    const segment: IInterviewAddressSegment = { name: name.value };
    if (text.charAt(pos) === "[") {
      const close = text.indexOf("]", pos);
      const digits = close < 0 ? "" : text.substring(pos + 1, close);
      if (close < 0 || !DIGITS_REGEX.test(digits)) return undefined;
      segment.index = parseInt(digits, 10);
      pos = close + 1;
    }
    res.push(segment);
    if (pos === text.length) return res;
    if (text.charAt(pos) !== ".") return undefined;
    pos++;
    // A trailing "." has no segment after it.
    if (pos === text.length) return undefined;
  }
  return undefined;
}

function readSegmentName(text: string, pos: number): { value: string, pos: number } | undefined {
  if (text.charAt(pos) === "\"") {
    let i = pos + 1;
    while(i < text.length) {
      const char = text.charAt(i);
      if (char === "\\") { i += 2; continue; }
      if (char === "\"") {
        try {
          const value = JSON.parse(text.substring(pos, i + 1));
          return typeof value === "string" && value.length > 0 ? { value: value, pos: i + 1 } : undefined;
        } catch(e) {
          return undefined;
        }
      }
      i++;
    }
    return undefined;
  }
  let end = pos;
  while(end < text.length && ".[]\"".indexOf(text.charAt(end)) < 0) {
    end++;
  }
  return end > pos ? { value: text.substring(pos, end), pos: end } : undefined;
}

// The live structure, not the mode's navigation list and not the interview's inventory: a revisit
// may name a question of a panel that is complete and valid, which getSingleInputQuestions() leaves
// out, and the answer to "does this address name anything at all" must not depend on where the
// respondent happens to stand.
export function resolveAddress(survey: SurveyModel, text: string): IInterviewAddressResolution {
  const segments = parseAddress(text);
  if (!segments) return { isBad: true };
  let current: any = undefined;
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i];
    current = i === 0 ? (<any>survey).getQuestionByName(segment.name) : resolveChild(current, segment.name);
    if (!current) return {};
    if (segment.index !== undefined) {
      const entries = getEntries(current);
      // An index on something that holds no entries is a malformed address, and an index past the
      // entries there are now is one too: the summary step's "add" is how an entry comes into being.
      if (!entries || segment.index >= entries.length) return { isBad: true };
      current = entries[segment.index];
    }
  }
  // A panel of a dynamic panel or a row of a matrix is a container, not an input: "medications[0]"
  // names something real and answers nothing.
  return isQuestion(current) ? { question: current } : {};
}

function resolveChild(obj: any, name: string): any {
  if (!obj) return undefined;
  if (isSingleChoiceMatrix(obj)) {
    return findByName(obj.getMatrixSingleInputQuestions(undefined, true), name);
  }
  const rows = getVisibleRows(obj);
  if (!!rows && !isDynamicMatrix(obj)) {
    const row = findRowByName(rows, name);
    if (!!row) return row;
  }
  // A panel and a row of a matrix both answer getQuestionByName, and a row answers it for its cells
  // and for the questions of its detail panel.
  if (typeof obj.getQuestionByName === "function") {
    const question = obj.getQuestionByName(name);
    if (!!question) return question;
  }
  // A multiple text names its editors, a composite its content questions.
  if (typeof obj.getNestedQuestions === "function") {
    return findByName(obj.getNestedQuestions(true, false), name);
  }
  return undefined;
}

function getEntries(obj: any): Array<any> | undefined {
  if (isDynamicPanel(obj)) return obj.visiblePanels;
  if (isDynamicMatrix(obj)) return obj.visibleRows;
  return undefined;
}

function findByName(questions: Array<any>, name: string): any {
  if (!Array.isArray(questions)) return undefined;
  for (let i = 0; i < questions.length; i++) {
    if (!!questions[i] && questions[i].name === name) return questions[i];
  }
  return undefined;
}

function findRowByName(rows: Array<any>, name: string): any {
  for (let i = 0; i < rows.length; i++) {
    if (getRowName(rows[i]) === name) return rows[i];
  }
  return undefined;
}

// getValueType() is declared by Question and by nothing else the resolution can land on: a panel of
// a dynamic panel and a row of a matrix are both containers of questions and neither has one.
function isQuestion(obj: any): boolean {
  return !!obj && typeof obj.getValueType === "function";
}

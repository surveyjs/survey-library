import { describeQuestion } from "survey-core";
import type { Question, SurveyModel } from "survey-core";
import type { IInterviewItem } from "./interview-types";
import { getAddress } from "./interview-address";
import { getSummaryDescription } from "./interview-summary";

// The inventory: everything the interview can address, in document order, derived from the
// structure of the survey and recomputed on every call - the model is the state and nothing here is
// cached.
//
// It is deliberately not the mode's own navigation list. root.singleInputBehavior
// .getSingleInputQuestions() answers "what do I walk the respondent through next", and it depends on
// where the respondent already is: once a dynamic container's summary step has been shown it returns
// the container alone, and a dynamic panel lists only the panels that are incomplete or invalid.
// That is right for walking forward and useless as a record of what exists - reading it to build
// progress, the answered map or the change report would make all three depend on navigation. So the
// inventory is built from the structure (getNestedQuestions, which is navigation-free) and the
// navigation list is never read at all; what the interview does with the mode is move it, through
// makeInputCurrent().
//
// The container-specific parts live next door: interview-address.ts derives the address of a nested
// input from the model, interview-summary.ts describes a summary step and runs its actions.

// The types whose entries a respondent adds and removes one at a time, and which therefore own a
// summary step: the list of entries with add / remove / edit that the mode itself offers.
const DYNAMIC_CONTAINER_TYPES = ["paneldynamic", "matrixdynamic"];
// A single-choice matrix is the one type whose inputs are not questions of the JSON: the mode
// synthesizes one radiogroup or checkbox per row, with the columns as its choices.
const MATRIX_TYPE = "matrix";

export interface IInterviewInput {
  // The string that names this input in answer(name, value), in errors[].name and in the answered
  // map: the question name at the top level, "medications[0].dose" below it (interview-address.ts).
  address: string;
  // The question a value is written to and read from, and whose errors are the item's errors.
  question: Question;
  // The top-level question the input belongs to - the one the mode makes current.
  root: Question;
  // A dynamic container's summary step: an item that takes an action, not a value.
  isSummary: boolean;
  item: IInterviewItem;
}

export function getInterviewInputs(survey: SurveyModel): Array<IInterviewInput> {
  const res: Array<IInterviewInput> = [];
  getRootQuestions(survey).forEach(root => addInputs(survey, root, root, res));
  return res;
}

// What getSingleElements() would return: the visible questions of the visible, non-start pages, flat
// and in document order. A start page is a UI concept the mode skips, so its questions are never
// items - createInterview has already left it (tier 02).
export function getRootQuestions(survey: SurveyModel): Array<Question> {
  return survey.getAllQuestions().filter(question => question.isVisibleInSurvey && !isOnStartPage(question));
}

export function isOnStartPage(question: Question): boolean {
  const page: any = question.page;
  return !!page && page.isStartPage === true;
}

function addInputs(survey: SurveyModel, question: Question, root: Question, res: Array<IInterviewInput>): void {
  // The host turned nesting off for this question through onCheckSingleInputPerPageMode: the
  // container is one input holding the whole array or object, exactly as the mode would show it.
  if (!survey.supportsNestedSingleInput(question)) {
    addInput(question, root, res);
    return;
  }
  if (question.getType() === MATRIX_TYPE) {
    getMatrixRowInputs(question).forEach(row => addInput(row, root, res));
    return;
  }
  // Structural and navigation-free: a dynamic panel yields the visible questions of every visible
  // panel, a matrix its cells row by row, a multiple text its editors, a composite its content
  // questions. Empty means the question is an input of its own - unless it is a dynamic container,
  // which has no nested question until an entry is added and whose summary step is exactly what the
  // interviewee is shown in the meantime.
  const isDynamic = DYNAMIC_CONTAINER_TYPES.indexOf(question.getType()) >= 0;
  const children = question.getNestedQuestions(true, false);
  // The host's onGetLoopQuestions edits the nested list - drops a question, reorders them - and the
  // mode asks it before walking a container. The inventory is built from the structure and not from
  // the mode's list (see above), so it asks the same question itself, or a question the host removed
  // would still be an item here and would still be asked for.
  survey.updateNestedSingleQuestions(question, children);
  if (children.length === 0 && !isDynamic) {
    addInput(question, root, res);
    return;
  }
  children.forEach(child => addInputs(survey, child, root, res));
  if (isDynamic) {
    // The summary step sits last, where the mode puts it.
    addInput(question, root, res, true);
  }
}

// A root whose value is not one plain answer: the mode splits it into the nested questions a
// respondent fills one at a time. Batch mode (tier 05) writes one value per question and therefore
// reports such a root instead of filling it; single mode walks its inputs. The dynamic types are
// named because a dynamic panel with no panels yet, or a matrix with no rows, has no nested question
// at this instant and is a container all the same.
export function isContainerQuestion(question: Question): boolean {
  const type = question.getType();
  if (type === MATRIX_TYPE || DYNAMIC_CONTAINER_TYPES.indexOf(type) >= 0) return true;
  return question.getNestedQuestions(true, false).length > 0;
}

// The containers whose own errors no item carries. A dynamic panel and a dynamic matrix are not
// among them - their summary step is an item and it is the container itself - but a single-choice
// matrix, a matrix dropdown, a multiple text and a composite are: their nested questions are the
// items and the container is nowhere, so RequiredInAllRowsError, EachRowUniqueError and a
// required-and-empty container would go unreported at completion. Collected by walking up from the
// inputs, so a container nested inside another one is found too.
export function getUnreportedContainers(inputs: Array<IInterviewInput>): Array<IInterviewContainer> {
  const seen: { [id: string]: boolean } = {};
  const res: Array<IInterviewContainer> = [];
  inputs.forEach(input => { seen[input.question.id] = true; });
  inputs.forEach(input => {
    let parent = input.question.parentQuestion;
    for (let depth = 0; depth < MAX_CONTAINER_DEPTH && !!parent; depth++) {
      if (seen[parent.id] !== true) {
        seen[parent.id] = true;
        const address = getAddress(parent);
        if (!!address) res.push({ address: address, question: parent });
      }
      parent = parent.parentQuestion;
    }
  });
  return res;
}

export interface IInterviewContainer {
  address: string;
  question: Question;
}

// Deep enough for any nesting a survey can express; it only stops a cycle in a broken model.
const MAX_CONTAINER_DEPTH = 20;

function getMatrixRowInputs(question: Question): Array<Question> {
  const rows = (<any>question).getMatrixSingleInputQuestions(undefined, true);
  return Array.isArray(rows) ? rows : [];
}

function addInput(question: Question, root: Question, res: Array<IInterviewInput>, isSummary?: boolean): void {
  const address = getAddress(question);
  // A container the address grammar cannot walk - a model shape no version of it addresses - has no
  // item rather than one nobody could answer or report an error against.
  if (!address) return;
  const item = createItem(question, address, root, !!isSummary);
  // undefined from the describer means read-only by property: nobody can ever answer it, so it is
  // not an item at all. A question that carries an enableIf comes back described as disabled, is an
  // item, and is never made current.
  if (!item) return;
  res.push({
    address: address,
    question: question,
    root: root,
    isSummary: !!isSummary,
    item: item,
  });
}

function createItem(question: Question, address: string, root: Question, isSummary: boolean): IInterviewItem {
  const description = describeQuestion(question);
  if (!description) return undefined;
  // The describer's key order is the order the document renders, so the record is copied and only
  // "name" is replaced in place; anything added lands after the described keys.
  const res: IInterviewItem = { ...description };
  res.name = address;
  if (question !== root) {
    const entry = getEntryTitle(root);
    if (!!entry) res.entry = entry;
  }
  if (isSummary) {
    // The key is placed here and filled by updateCurrentItem(), so that a summary step renders its
    // entries in the same position whichever call built the item. The model only builds the summary
    // for the container that is the current single input, and the current item is the one the
    // interview has just moved the model to.
    res.summary = undefined;
  }
  return res;
}

// The keys of an item that are read off the model's current single input, and are therefore right
// only for the item that is current: the entry breadcrumb (the mode processes templateTitle for the
// panel it is standing in) and the summary of a container (the model builds it for that container
// alone). Called once the model has been moved to the input, never during a bare read.
export function updateCurrentItem(input: IInterviewInput): void {
  if (input.isSummary) {
    input.item.summary = getSummaryDescription(input.question);
    return;
  }
  if (input.question === input.root) return;
  const entry = getEntryTitle(input.root);
  if (!!entry) input.item.entry = entry;
}

// The model's own localized breadcrumb for the entry a nested input belongs to - "Panel 2", the
// processed templateTitle, "Row 1", a row name. The interview has no prose of its own to put here,
// and the string a UI on the same model shows above the input is exactly this one.
function getEntryTitle(root: Question): string {
  const locTitle: any = root.singleInputLocTitle;
  const res = !!locTitle ? locTitle.textOrHtml : undefined;
  return typeof res === "string" && res.length > 0 ? res : undefined;
}

// Askable: the interviewee can be asked for this value now. A disabled item is listed by batch mode
// so an agent knows the question exists; an unsupported one - a file, a signature - is listed so a
// consumer can say it is there. Neither is ever made current.
export function isAskableInput(input: IInterviewInput): boolean {
  return !input.item.disabled && !input.item.unsupported;
}

// A summary step is answered when the interviewee said so - the "done" action, which the interview
// remembers in its skipped set. Never because the container holds a value: an optional dynamic panel
// with two entries is not finished until the person says it is, which is exactly what the mode does
// by keeping the summary in front of them.
export function isInputAnswered(input: IInterviewInput, isSkipped: boolean): boolean {
  if (input.isSummary) return isSkipped;
  return isSkipped || !input.question.isEmpty();
}

// A read of persisted state, never a validation run. validate(false) would compute the answer and
// discard it - and it starts the asynchronous validators over on every call, so a plain scan of the
// items would restart them (overview 2.2). What is read here is what an earlier validate(true) left
// on the question, plus hasRequiredError(), which is synchronous by construction.
export function isInputValid(input: IInterviewInput): boolean {
  return input.question.errors.length === 0 && !input.question.hasRequiredError();
}

// The localized texts the rendered UI shows for the same errors. "errors", not getAllErrors(): a
// scalar input answers for itself, and a container's collected errors belong to its own items.
export function getInputErrors(input: IInterviewInput): Array<string> {
  return input.question.errors.map(error => error.getText());
}

// The interview selects its own next input (the issue's rule) and then tells the model, so that
// survey.currentSingleQuestion and its currentSingleInputQuestion always agree with current(): a UI
// rendering the same model shows the input the interview is asking for.
export function makeInputCurrent(survey: SurveyModel, input: IInterviewInput): void {
  if (!input) return;
  if (input.question === input.root) {
    survey.currentSingleQuestion = input.root;
  } else {
    // Sets the root current and walks setSingleInputQuestion down the whole parent chain; its final
    // focusInputElement is a no-op with no DOM. A container nested inside another one is reached the
    // same way: it is a nested input of its parent before it is a container of its own.
    input.question.singleInputBehavior.focusSingleInput(false);
  }
  if (input.isSummary) {
    // A dynamic container is its own last input, and the mode builds the summary - the entries,
    // their remove buttons, the add caption - only while that is where it stands.
    input.question.singleInputBehavior.setSingleInputQuestion(input.question);
  }
}

// What answer() reports back for an answered item. An item that accepts a comment - "other", a
// comment area - reports the object form, the same shape answer() takes.
export function getAnsweredValue(input: IInterviewInput): any {
  const value = input.question.value;
  if (!input.item.comment) return value;
  const comment = input.question.comment;
  return !!comment ? { value: value, comment: comment } : value;
}

// Validators run only with fireCallback = true, and only when an input is written, at creation for
// an input that already holds a value, and at completion. validateSingleInput() is the mode's own
// call and validates the leaf it considers current; for every other input - a revisit, a dependent
// input, a plain root the mode has no nested leaf for - the question validates itself.
export function validateInput(survey: SurveyModel, input: IInterviewInput): void {
  const root = input.root;
  if (input.isSummary) {
    // The container's own errors - MinRowCountError, a required container with no entries, a
    // duplicated key - are what a summary step reports, and they are written by validating the
    // container itself after every add and every remove.
    input.question.validate(true);
    return;
  }
  if (survey.currentSingleQuestion === root &&
    root.singleInputBehavior.currentSingleInputQuestion === input.question) {
    root.validateSingleInput();
    return;
  }
  input.question.validate(true);
}

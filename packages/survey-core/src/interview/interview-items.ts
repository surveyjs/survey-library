import { describeQuestion } from "survey-core";
import type { Question, SurveyModel } from "survey-core";
import type { IInterviewItem } from "./interview-types";
import { MAX_NESTING_DEPTH, getAddress } from "./interview-address";
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
  getRootQuestions(survey).forEach(root => addInputs(survey, root, root, 0, res));
  return res;
}

// What getSingleElements() would return: the visible questions of the visible, non-start pages, flat
// and in document order. A start page is a UI concept the mode skips, so its questions are never
// items - createInterview has already left it (tier 02).
//
// Plus the questions inside the selected choices of a radiogroup or a checkbox, right after their
// owner. The model keeps their values at the top level of data under their own names, so they are
// roots of their own - a question a visibleIf panel holds, the condition being the choice - and not
// nested inputs of the owner, whose value stays the plain choice. getSingleElements() does not list
// them and neither does getAllQuestions() without includeNested (which, with it, renders every page
// and walks into every container), so the inventory finds them itself.
export function getRootQuestions(survey: SurveyModel): Array<Question> {
  const res: Array<Question> = [];
  survey.getAllQuestions().forEach(question => {
    // getAllQuestions() never lists a question inside a choice today. Should a later version put them
    // in the page list, they are still listed by the choice walk alone: once, after their owner, and
    // only while their choice is selected - the page list would list them after a deselection too,
    // since their own visibility never changes.
    if (!question.isVisibleInSurvey || isOnStartPage(question) || !!getDirectChoiceOwner(question)) return;
    res.push(question);
    addChoiceQuestions(question, res, 0);
  });
  return res;
}

// The one switch is the choice's isPanelShowing, which the model sets on every value write whether
// or not anything renders. A choice-panel question's own visibility is not the switch: it stays
// visible after the choice is deselected, because the panel is what hides. So a question exists for
// the interview while both hold, and never on the second alone. item.panel creates the panel on first
// access and is read only once isPanelShowing said yes - selecting the choice has created it by then
// - so the inventory creates nothing.
function addChoiceQuestions(owner: Question, res: Array<Question>, depth: number): void {
  // Only for a question that belongs to no entry. The model gives a choice panel the survey as its
  // data provider and no parentQuestion, so the questions of a select question inside a dynamic panel,
  // a detail panel or a composite would write to the top level of data, one key shared by every
  // entry - an address that told the truth about the data would share one value across entries, and
  // one that told the truth about the structure would name a key the model never writes. Those
  // questions stay out until ChoiceItem.setPanelSurvey (src/question_baseselect.ts) hands the panel the
  // owner's data provider and parent question; this condition is the one to drop then, and the
  // address grammar and the entry fields pick the questions up as they are. The questions of a choice
  // have no parentQuestion either, so a radiogroup inside a choice passes it too.
  if (!!owner.parentQuestion || depth >= MAX_NESTING_DEPTH || !hasChoiceElements(owner)) return;
  const choices: Array<any> = (<any>owner).visibleChoices;
  if (!Array.isArray(choices)) return;
  choices.forEach(choice => {
    if (!choice || choice.isPanelShowing !== true) return;
    const panel: any = choice.panel;
    // panel.questions flattens the static panels inside the choice, in document order.
    const questions: Array<Question> = !!panel && Array.isArray(panel.questions) ? panel.questions : [];
    // A question sits in one panel, and a choice's panel belongs to one choice, so nothing is listed
    // twice.
    questions.forEach(question => {
      if (!question.isVisibleInSurvey) return;
      res.push(question);
      addChoiceQuestions(question, res, depth + 1);
    });
  });
}

// The two types whose choices may hold questions - a radiogroup and a checkbox - say so through
// supportElementsInChoice(); a dropdown, a tagbox and a ranking say false and have no panels.
// Duck-typed on the method, the way isDynamicContainer duck-types addPanel.
export function hasChoiceElements(question: Question): boolean {
  const target: any = question;
  return !!target && typeof target.supportElementsInChoice === "function" &&
    target.supportElementsInChoice() === true;
}

// The select question whose selected choice holds the question, and for a choice inside a choice the
// outermost one; undefined for a question that is in no choice. Derived from the model, never
// remembered: the question's parents are walked up through the static panels to the choice panel,
// which carries its choice (ChoiceItem.createPanel sets "choiceItem" on it, a plain property), and the
// choice names its owner.
export function getChoiceOwner(question: Question): Question | undefined {
  let res: Question = undefined;
  let owner = getDirectChoiceOwner(question);
  for (let depth = 0; depth < MAX_NESTING_DEPTH && !!owner; depth++) {
    res = owner;
    owner = getDirectChoiceOwner(owner);
  }
  return res;
}

function getDirectChoiceOwner(question: Question): Question | undefined {
  let node: any = !!question ? question.parent : undefined;
  // Static panels: the bound only stops a cycle.
  for (let depth = 0; depth < MAX_NESTING_DEPTH && !!node; depth++) {
    const choice = node.choiceItem;
    if (!!choice) return choice.choiceOwner || undefined;
    node = node.parent;
  }
  return undefined;
}

export function isOnStartPage(question: Question): boolean {
  const page: any = question.page;
  return !!page && page.isStartPage === true;
}

// "depth" is the number of containers above the question (interview-address.ts): a root is at 0.
function addInputs(survey: SurveyModel, question: Question, root: Question, depth: number,
  res: Array<IInterviewInput>): void {
  // The host turned nesting off for this question through onCheckSingleInputPerPageMode: the
  // container is one input holding the whole array or object, exactly as the mode would show it. A
  // select question with choice questions is one input too, for the reason isContainerQuestion gives.
  if (!survey.supportsNestedSingleInput(question) || hasChoiceElements(question)) {
    addInput(question, root, res);
    return;
  }
  const isMatrix = question.getType() === MATRIX_TYPE;
  const isDynamic = DYNAMIC_CONTAINER_TYPES.indexOf(question.getType()) >= 0;
  // Structural and navigation-free: a dynamic panel yields the visible questions of every visible
  // panel, a matrix its cells row by row, a multiple text its editors, a composite its content
  // questions. Empty means the question is an input of its own - unless it is a dynamic container,
  // which has no nested question until an entry is added and whose summary step is exactly what the
  // interviewee is shown in the meantime.
  const children = isMatrix ? getMatrixRowInputs(question) : question.getNestedQuestions(true, false);
  if (depth >= MAX_NESTING_DEPTH && (isMatrix || isDynamic || children.length > 0)) {
    // A container at the ceiling is not walked into, and it is not an item either - not its summary
    // step, not its whole value: nothing below the ceiling exists for the interview, in either mode.
    return;
  }
  if (isMatrix) {
    children.forEach(row => addInput(row, root, res));
    return;
  }
  // The host's onGetLoopQuestions edits the nested list - drops a question, reorders them - and the
  // mode asks it before walking a container. The inventory is built from the structure and not from
  // the mode's list (see above), so it asks the same question itself, or a question the host removed
  // would still be an item here and would still be asked for.
  survey.updateNestedSingleQuestions(question, children);
  if (children.length === 0 && !isDynamic) {
    addInput(question, root, res);
    return;
  }
  children.forEach(child => addInputs(survey, child, root, depth + 1, res));
  if (isDynamic) {
    // The summary step sits last, where the mode puts it.
    addInput(question, root, res, true);
  }
}

// A root whose value is not one plain answer: the mode splits it into the nested questions a
// respondent fills one at a time. Batch mode asks it once per root, to tell a plain root from one it
// describes as a container (interview-batch.ts); what a field inside a container is, is decided by
// the shape of the question and not here (interview-fields.ts). The dynamic types are named because a
// dynamic panel with no panels yet, or a matrix with no rows, has no nested question at this instant
// and is a container all the same.
export function isContainerQuestion(question: Question): boolean {
  // A select question whose choices hold questions is never a container, whatever
  // getNestedQuestions() answers for it: its value is a choice, and the questions of its choices are
  // roots of their own (getRootQuestions). Today the fall-through below says the same only because the
  // model lists a choice panel's questions with includeNested alone; a model that listed them like
  // every other container does would otherwise turn a radiogroup into a container overnight.
  if (hasChoiceElements(question)) return false;
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
    for (let depth = 0; depth < MAX_NESTING_DEPTH && !!parent; depth++) {
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

// Validating a radiogroup or a checkbox validates the questions of its selected choices with it
// (QuestionSelectBase.validateElementCore), so the write that selects a choice puts "Response
// required." on the question the choice has just revealed - an input nobody has asked for yet, and
// the next current() would carry the error. An input inside a choice that is empty, that the call did
// not touch and that carried no error before the call is therefore left as it was: the rule a summary
// step and a batch record already apply to the entries validating a container reaches. An
// unanswered required input is an error at complete(), not the moment its choice is selected.
export function clearUntouchedChoiceErrors(inputs: Array<IInterviewInput>,
  isTouched: (input: IInterviewInput) => boolean): void {
  inputs.forEach(input => {
    const question = input.question;
    if (question.errors.length === 0 || !question.isEmpty() || isTouched(input)) return;
    if (!!getChoiceOwner(input.root)) question.clearErrors();
  });
}

// The localized texts the rendered UI shows for the same errors. "errors", not getAllErrors(): a
// scalar input answers for itself, and a container's collected errors belong to its own items.
export function getInputErrors(input: IInterviewInput): Array<string> {
  return input.question.errors.map(error => error.getText());
}

// The interview selects its own next input (the issue's rule) and then tells the model, so that
// survey.currentSingleQuestion and its currentSingleInputQuestion always agree with current(): a UI
// rendering the same model shows the input the interview is asking for.
//
// A root inside a choice is the exception: the mode's navigation list (getSingleElements()) does not
// know it, and while such a question is the model's current the survey does not consider itself at
// the end - a survey with an onServerValidateQuestions handler validates and then stays running. So
// the model's current for it is its choice's owner - the outermost one - which is also what a UI on
// the same model shows: the panel under its choice. current() is unaffected: it is derived from the
// inventory, never read off the model.
export function makeInputCurrent(survey: SurveyModel, input: IInterviewInput): void {
  if (!input) return;
  const owner = getChoiceOwner(input.root);
  if (input.question === input.root) {
    survey.currentSingleQuestion = owner || input.root;
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
  // A container inside a choice has just been walked into as the model's current; its own
  // single-input state - the nested input, the summary - is cached on it and survives the move.
  if (!!owner && survey.currentSingleQuestion !== owner) {
    survey.currentSingleQuestion = owner;
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

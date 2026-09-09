import { describeQuestion } from "survey-core";
import type { Question, SurveyModel } from "survey-core";
import type { IInterviewItem } from "./interview-types";
import {
  IInterviewInput, getInputErrors, getRootQuestions, isContainerQuestion, isInputValid, isOnStartPage,
} from "./interview-items";

// Batch mode is single mode's inventory read at the root level. An agent that fills a whole form in
// one turn writes one plain value per question, so the unit here is the root - the question a JSON
// key names - and not the nested input single mode walks. A root that holds more than one value (a
// dynamic panel, a matrix, a multiple text, a composite) is therefore listed and not filled; a root
// whose value no text consumer can produce (a file, a signature) is listed too, and the two are told
// apart by the "reason" key: "batch" means this version cannot fill it and a later one may, no
// reason at all means nothing ever will.

export interface IInterviewBatchEntry {
  address: string;
  item: IInterviewItem;
  // The input a value is written to and whose errors the item reports. Absent for a container: batch
  // mode has no address for the questions inside one, and no way to write the whole thing at once.
  input?: IInterviewInput;
}

export function getBatchEntries(survey: SurveyModel, inputs: Array<IInterviewInput>): Array<IInterviewBatchEntry> {
  const res: Array<IInterviewBatchEntry> = [];
  getRootQuestions(survey).forEach(root => {
    const own = inputs.filter(input => input.root === root);
    // One input, and it is the root itself: the root is a plain question, whatever the mode would
    // have done with a container in its place.
    const single = own.length === 1 && own[0].question === root && !own[0].isSummary ? own[0] : undefined;
    if (!!single && !isBatchContainer(root, single.item)) {
      res.push({ address: single.address, item: single.item, input: single });
      return;
    }
    const item = createRootItem(root);
    if (!item) return;
    item.unsupported = true;
    item.reason = "batch";
    res.push({ address: item.name, item: item });
  });
  return res;
}

// valueType "object" as well as the structural test: a host that turned nesting off through
// onCheckSingleInputPerPageMode folds a container back into one input holding the whole object, and
// that input is still not one plain value.
function isBatchContainer(root: Question, item: IInterviewItem): boolean {
  return isContainerQuestion(root) || item.valueType === "object";
}

function createRootItem(question: Question): IInterviewItem | undefined {
  // undefined means read-only by property: nobody can ever answer it, so it is not an item at all -
  // the same rule the inventory applies. A root's address is its own name, so nothing is rewritten.
  const description = describeQuestion(question);
  return !!description ? { ...description } : undefined;
}

// The document of batch mode: everything that still needs work, plus everything the agent has to be
// told about even though it cannot act on it. An item that is answered and valid is left out - the
// agent is not asked to confirm what it already sent - while a disabled or unsupported one is always
// listed, because "this question exists and you cannot fill it" is the only way to say so.
export function getBatchItems(entries: Array<IInterviewBatchEntry>): Array<IInterviewItem> {
  const res: Array<IInterviewItem> = [];
  entries.forEach(entry => {
    if (!isListedInBatch(entry)) return;
    if (!!entry.input) {
      const errors = getInputErrors(entry.input);
      // The first error text goes on the record, next to the value the agent has to correct; the
      // full list is the errors section of the document.
      if (errors.length > 0) entry.item.error = errors[0];
    }
    res.push(entry.item);
  });
  return res;
}

function isListedInBatch(entry: IInterviewBatchEntry): boolean {
  if (entry.item.unsupported === true || entry.item.disabled === true || !entry.input) return true;
  // Skipping is a single-mode gesture: an agent that wants to leave a question blank leaves it
  // blank, so the skipped set is not consulted here and a skipped item is still listed.
  return entry.input.question.isEmpty() || !isInputValid(entry.input);
}

export function findBatchEntry(entries: Array<IInterviewBatchEntry>, address: string): IInterviewBatchEntry {
  return entries.filter(entry => entry.address === address)[0];
}

export function getBatchAddresses(entries: Array<IInterviewBatchEntry>): Array<string> {
  return entries.filter(entry => isBatchWritable(entry)).map(entry => entry.address);
}

export function isBatchWritable(entry: IInterviewBatchEntry): boolean {
  return !!entry.input && entry.item.disabled !== true && entry.item.unsupported !== true;
}

// One write of a batch may hide or disable a question a later write of the same batch names, and it
// may move the choices a later value is checked against (choicesFromQuestion, choicesVisibleIf). So
// every entry is described again immediately before its own write, and the answer is checked against
// the state the earlier writes left behind, not the state the call started in.
export function refreshBatchEntry(entry: IInterviewBatchEntry): IInterviewBatchEntry {
  const input = entry.input;
  if (!input) return undefined;
  const question = input.question;
  if (!question.isVisibleInSurvey || isOnStartPage(question)) return undefined;
  const item = createRootItem(question);
  if (!item) return undefined;
  return {
    address: entry.address,
    item: item,
    input: { address: entry.address, question: question, root: input.root, isSummary: false, item: item },
  };
}

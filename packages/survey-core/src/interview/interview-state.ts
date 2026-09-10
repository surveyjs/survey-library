import { describeQuestion } from "survey-core";
import type { SurveyModel } from "survey-core";
import type { IInterviewChanges } from "./interview-types";
import { IInterviewInput, isOnStartPage } from "./interview-items";

// The state the model has no notion of, and the "before" picture every mutating call is compared
// against. Two things live here: the set of addresses the interviewee chose to skip, and the
// snapshot / diff pair that turns one write into the change report the issue asks for.

// One address as it was at a moment in time. "visible" is what makes the report possible at all: a
// question that is not an item yet has to have a "before" entry, or becoming visible would be
// indistinguishable from having always been there.
export interface IInterviewStateEntry {
  address: string;
  required: boolean;
  visible: boolean;
}

// The model knows nothing about "skipped": a question a respondent walked past is simply empty. The
// interview remembers the gesture, because the input it asks next must not be the one it was just
// told to leave alone.
export class InterviewSkipped {
  private items: { [address: string]: boolean } = {};

  public has(address: string): boolean {
    return this.items[address] === true;
  }
  public add(address: string): void {
    this.items[address] = true;
  }
  public remove(address: string): void {
    delete this.items[address];
  }
  public clear(): void {
    this.items = {};
  }
}

// The inventory as it is now, plus every root that is currently invisible. The invisible ones carry
// no value and cannot be answered, and they are here for one reason: so that a question a write
// makes visible has something to be compared with.
export function takeSnapshot(survey: SurveyModel, inputs: Array<IInterviewInput>): Array<IInterviewStateEntry> {
  const res: Array<IInterviewStateEntry> = [];
  const seen: { [address: string]: boolean } = {};
  inputs.forEach(input => {
    seen[input.address] = true;
    res.push({ address: input.address, required: input.item.required === true, visible: true });
  });
  survey.getAllQuestions().forEach(question => {
    if (question.isVisibleInSurvey || isOnStartPage(question) || seen[question.name] === true) return;
    // Described rather than read property by property: "required" means whatever the description
    // layer says it means, here and in the items, or the two would drift. includeReadOnly, because
    // an invisible question that is also read-only still has to have a "before" entry.
    const description = describeQuestion(question, { includeReadOnly: true });
    if (!description) return;
    seen[question.name] = true;
    res.push({ address: question.name, required: description.required === true, visible: false });
  });
  return res;
}

// The union of the two snapshots, reported in item order: the "after" order for what appeared or
// became required, the "before" order for what is no longer there to order by.
//
// becameRequired compares the pair (visible, required), not "required" alone: a question that is
// required in the JSON and invisible was not being asked for, so the write that reveals it does make
// it required as far as the interviewee is concerned - which is why the issue's transcript lists
// petType in becameVisible and in becameRequired at once.
export function diffSnapshots(before: Array<IInterviewStateEntry>, after: Array<IInterviewStateEntry>): IInterviewChanges {
  const beforeMap = toMap(before);
  const afterMap = toMap(after);
  const res: IInterviewChanges = { becameVisible: [], becameHidden: [], becameRequired: [] };
  after.forEach(entry => {
    if (!entry.visible) return;
    const was = beforeMap[entry.address];
    if (!was || !was.visible) {
      res.becameVisible.push(entry.address);
    }
    if (entry.required && (!was || !was.visible || !was.required)) {
      res.becameRequired.push(entry.address);
    }
  });
  before.forEach(entry => {
    if (!entry.visible) return;
    const is = afterMap[entry.address];
    if (!is || !is.visible) {
      res.becameHidden.push(entry.address);
    }
  });
  return res;
}

export function noChanges(): IInterviewChanges {
  return { becameVisible: [], becameHidden: [], becameRequired: [] };
}

function toMap(entries: Array<IInterviewStateEntry>): { [address: string]: IInterviewStateEntry } {
  const res: { [address: string]: IInterviewStateEntry } = {};
  entries.forEach(entry => { res[entry.address] = entry; });
  return res;
}

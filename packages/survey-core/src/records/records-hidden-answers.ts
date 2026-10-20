import { settings } from "../settings";
import { ConditionRunner } from "../conditions/conditionRunner";
import { IRecordIndexFollower, RecordIndexEvent, isRecordListChange, toKnownRemap } from "./records-index-followers";
import type { HashTable } from "../helpers";
import type { ISurvey } from "../base-interfaces";
import type { Question } from "../question";
import type { PanelModelBase } from "../panel";
import type { LocalDynamicDataSource } from "../dynamic-data/dynamic-data-sources";
import type { IDynamicDataRecordScope } from "../dynamic-data/dynamic-data-record-visibility";
import type { IRecordElementVisibility, QuestionRecordItem } from "../question_records";

// What the hidden-answer tracker reads from the records question.
export interface IHiddenAnswerTrackerOwner {
  getSurvey(): ISurvey;
  readonly areInvisibleElementsShowing: boolean;
  readonly isRemoteData: boolean;
  // The source the record state keys are read from (getRecordStateKey).
  readonly recordsSource: LocalDynamicDataSource;
  getStoredRecords(): any;
  // A records value as an array of records: [] for any other value.
  asRecords(value: any): Array<any>;
  getRecordTemplateQuestion(key: string): Question;
  getRecordConditionalInputs(): Array<Question>;
  canRecordQuestionBeCleared(q: Question, reason: string): boolean;
  canCleanRecordsWithoutObjects(): boolean;
  createRecordVisibilityScope(properties: HashTable<any>): IDynamicDataRecordScope;
  collectRecordChangesWithoutObjects(properties: HashTable<any>, clean: (index: number, record: any, visibility: IRecordElementVisibility) => any,
    onItem?: (index: number, record: any, item: QuestionRecordItem) => void): Array<{ index: number, record: any }>;
  isRecordInputContainerVisible(visibility: IRecordElementVisibility, q: Question): boolean;
  removeRecordAnswer(record: any, cleared: any, name: string): any;
  writeRecordChanges(changes: Array<{ index: number, record: any }>): void;
  keepsHiddenAnswerStates(oldCount: number, newCount: number): boolean;
  // The built objects with the key their record's hidden-answer state is kept under.
  forEachBuiltRecordItem(func: (key: any, item: QuestionRecordItem) => void): void;
}

// The visibility flags of an input in a record, kept by HiddenAnswerTracker.clearHiddenAnswersWithoutObjects.
const HIDDEN_ANSWER_SELF = 1;
const HIDDEN_ANSWER_CONTAINER = 2;
// The flags taken before an assignment builds objects anew, and the objects that existed then (takeHiddenAnswerFlags).
export interface IHiddenAnswerFlags {
  inputs: Array<Question>;
  items: Set<QuestionRecordItem>;
  flags: Map<any, HashTable<number>>;
}
function getHiddenAnswerFlags(isSelfVisible: boolean, isContainerVisible: boolean): number {
  return (isSelfVisible ? HIDDEN_ANSWER_SELF : 0) | (isContainerVisible ? HIDDEN_ANSWER_CONTAINER : 0);
}
export function isHiddenAnswerContainerVisible(isVisible: (el: PanelModelBase) => boolean, q: Question, container: PanelModelBase): boolean {
  for (let el = <PanelModelBase>q.parent; !!el && el !== container && !el.isPage; el = <PanelModelBase>el.parent) {
    if (!isVisible(el)) return false;
  }
  return true;
}

/* clearIfInvisible "onHidden" / "onHiddenContainer" under paging in memory. A question of a row or a
   panel clears its answer when it turns from visible to hidden, never because it is built hidden; a
   record without an object has no question to do it, so the transition is followed over the stored
   record, for the inputs the type names (getRecordConditionalInputs) whose own effective mode clears
   on hiding - the survey's setting or the question's clearIfInvisible. Each input keeps two flags per
   record: the question's own visibility and that of the panels around it (up to
   getRecordInputContainer). A built question clears for its own hiding under either mode, and for a
   hidden container only under "onHiddenContainer"; the pass does the same. A record that has an
   object takes its flags from the object's questions, so the history goes on when it loses the
   object; a record seen for the first time is only noted. On a transition the input's key and its
   comment go, as clearValue() removes them; the writes of one run go in one batch of the list.
   The flags are kept per record (the source's getRecordStateKey): by record index for the array types, shifted by
   the question's own insert, remove and move and kept across an assignment from outside as a built
   object keeps them (followAssignment).
   Cost: the walk's (collectRecordChangesWithoutObjects), per condition run of the question, while an
   input clears on hiding. */
export class HiddenAnswerTracker implements IRecordIndexFollower {
  private states: Map<any, HashTable<number>>;
  constructor(private owner: IHiddenAnswerTrackerOwner) { }
  // The flags kept per record; undefined before the first walk.
  public get hiddenAnswerStates(): Map<any, HashTable<number>> {
    return this.states;
  }
  /* The visibility of a template element - a question of a record, a panel around it - in a record that
     has no object: its visible, or its visibleIf run over the record (the record item is the {row} /
     {panel} variable, see createRecordVisibilityScope); once per element and record, one runner per
     expression text. reset names the record the next answers are about. */
  public createRecordElementVisibility(properties: HashTable<any>): IRecordElementVisibility {
    const survey = this.owner.getSurvey();
    const scope = this.owner.createRecordVisibilityScope(properties);
    const runners = new Map<string, ConditionRunner>();
    // The result of a condition that reads no record variable, computed once for the run. One that calls
    // a function is kept per element: the function may read this.question.
    const recordIndependent = new Map<string, boolean>();
    const recordIndependentOfElement = new Map<Question | PanelModelBase, Map<string, boolean>>();
    const getRecordIndependent = (el: Question | PanelModelBase, runner: ConditionRunner): Map<string, boolean> => {
      if (!runner.hasFunction()) return recordIndependent;
      if (!recordIndependentOfElement.has(el)) recordIndependentOfElement.set(el, new Map<string, boolean>());
      return recordIndependentOfElement.get(el);
    };
    let visibility = new Map<Question | PanelModelBase, boolean>();
    return {
      reset: (index: number, record: any): void => {
        scope.item.reset(index, record);
        visibility = new Map<Question | PanelModelBase, boolean>();
      },
      isVisible: (el: Question | PanelModelBase): boolean => {
        let res = visibility.get(el);
        if (res !== undefined) return res;
        const expression = !!el.visibleIf ? survey.beforeExpressionRunning(el, "visibleIf", el.visibleIf) : "";
        if (!expression) {
          res = el.visible;
        } else {
          let runner = runners.get(expression);
          if (!runner) {
            runner = new ConditionRunner(expression);
            runners.set(expression, runner);
          }
          const independent = getRecordIndependent(el, runner);
          res = independent.get(expression);
          if (res === undefined) {
            scope.properties["question"] = el;
            res = runner.runContext(scope.item.getValueGetterContext(), scope.properties) === true;
            if (!this.readsRecordVariable(runner))independent.set(expression, res);
          }
        }
        visibility.set(el, res);
        return res;
      }
    };
  }
  /* The variables the runner reports name a record: the record item and its neighbours ({row}, {panel},
     ...), the index variables, or a field of the record. */
  private readsRecordVariable(runner: ConditionRunner): boolean {
    const names = settings.expressionVariables;
    const roots = [names.row, names.prevRow, names.nextRow, names.rowIndex, names.visibleRowIndex, names.rowValue, names.rowName,
      names.rowTitle, names.panel, names.prevPanel, names.nextPanel, names.parentPanel, names.panelIndex, names.visiblePanelIndex];
    return runner.getVariables().some((name: string): boolean => {
      const root = name.split(/[.[]/)[0];
      return roots.indexOf(root) > -1 || !!this.owner.getRecordTemplateQuestion(root);
    });
  }
  public clearHiddenAnswersWithoutObjects(properties: HashTable<any>): void {
    const owner = this.owner;
    if (!owner.canCleanRecordsWithoutObjects()) return;
    const inputs = owner.getRecordConditionalInputs().filter((q: Question): boolean => owner.canRecordQuestionBeCleared(q, "onHidden"));
    if (inputs.length === 0) return;
    if (!this.states)this.states = new Map<any, HashTable<number>>();
    const states = this.states;
    const source = owner.recordsSource;
    owner.writeRecordChanges(owner.collectRecordChangesWithoutObjects(properties, (index: number, record: any, visibility: IRecordElementVisibility): any => {
      const key = source["getRecordStateKey"](index, record);
      const prevState = states.get(key);
      const state: HashTable<number> = {};
      let cleared: any = undefined;
      inputs.forEach((q: Question): void => {
        const name = q.getValueName();
        const flags = this.getRecordInputFlags(visibility, q);
        state[name] = flags;
        if (!prevState || !this.isHiddenAnswerCleared(q, prevState[name], flags)) return;
        cleared = owner.removeRecordAnswer(record, cleared, name);
      });
      states.set(key, state);
      return cleared;
    }, (index: number, record: any, item: QuestionRecordItem): void => {
      states.set(source["getRecordStateKey"](index, record), this.getItemHiddenAnswerState(item, inputs));
    }));
  }
  // The visibility flags of an input in a record without an object: its own and that of the panels around it.
  private getRecordInputFlags(visibility: IRecordElementVisibility, q: Question): number {
    return getHiddenAnswerFlags(visibility.isVisible(q), this.owner.isRecordInputContainerVisible(visibility, q));
  }
  // The flags a built object's questions give the inputs (see clearHiddenAnswersWithoutObjects).
  private getItemHiddenAnswerState(item: QuestionRecordItem, inputs: Array<Question>): HashTable<number> {
    const state: HashTable<number> = {};
    inputs.forEach((input: Question): void => {
      const name = input.getValueName();
      const q = item.getQuestionsByValueName(name)[0];
      if (!q) return;
      state[name] = getHiddenAnswerFlags(q.visible, isHiddenAnswerContainerVisible((el: PanelModelBase): boolean => el.visible, q, null));
    });
    return state;
  }
  // A transition that clears: the question hid itself, or - under "onHiddenContainer" - a panel around it hid.
  private isHiddenAnswerCleared(q: Question, prev: number, flags: number): boolean {
    if (prev === undefined) return false;
    if ((prev & HIDDEN_ANSWER_SELF) && !(flags & HIDDEN_ANSWER_SELF)) return true;
    return (prev & HIDDEN_ANSWER_CONTAINER) && !(flags & HIDDEN_ANSWER_CONTAINER) && this.owner.canRecordQuestionBeCleared(q, "onHiddenContainer");
  }
  /* The question's own insert, remove and move renumber the flags kept by record index; the end of an
     assignment from outside keeps them as the objects keep theirs. */
  public follow(event: RecordIndexEvent): void {
    if (isRecordListChange(event)) {
      this.remap(toKnownRemap(event.remap));
    } else if (event.kind === "valueAssigned") {
      this.followAssignment(event.oldRecords.length, event.newRecords.length);
    }
  }
  private remap(remap: (index: number) => number): void {
    const states = this.states;
    if (!states || states.size === 0) return;
    const res = new Map<any, HashTable<number>>();
    states.forEach((state: HashTable<number>, key: any): void => {
      const newKey = typeof key === "number" ? remap(key) : key;
      if (newKey !== -1) res.set(newKey, state);
    });
    this.states = res;
  }
  /* An assignment from outside: the flags a built object would keep are kept. By default (the panel)
     the panels at the positions that stay keep theirs; a type that rebuilds its objects drops them
     (keepsHiddenAnswerStates). */
  private followAssignment(oldCount: number, newCount: number): void {
    const states = this.states;
    if (!states || states.size === 0) return;
    const keep = this.owner.keepsHiddenAnswerStates(oldCount, newCount);
    Array.from(states.keys()).forEach((key: any): void => {
      if (typeof key === "number" && (!keep || key >= newCount)) states.delete(key);
    });
  }
  /* An assignment from outside that builds objects anew (decideViewAgain) - a sort that moves a
     record, a page that turns stale, a record that joins the page - builds them before the conditions
     of that assignment run. The question of a new object is built hidden, and a question built hidden
     keeps its answer: the answer the old object would have cleared on hiding stayed. So the flags each
     record had before - its object's, else the walk's (clearHiddenAnswersWithoutObjects) - are taken
     first, and an object that is new afterwards compares them with its own questions: a transition
     clears the answer as the question clears it on hiding. The objects that stay have not run the
     assignment's conditions yet, so they find no transition here and clear when they run them. Not
     taken where the type does not keep the visibility its objects remember (keepsHiddenAnswerStates):
     the dynamic matrix rebuilds its rows, as released, for any other record count. */
  public takeHiddenAnswerFlags(oldRecords: any): IHiddenAnswerFlags {
    const owner = this.owner;
    if (!owner.getSurvey() || owner.areInvisibleElementsShowing || owner.isRemoteData) return undefined;
    if (!owner.keepsHiddenAnswerStates(owner.asRecords(oldRecords).length, owner.asRecords(owner.getStoredRecords()).length)) return undefined;
    const inputs = owner.getRecordConditionalInputs().filter((q: Question): boolean => owner.canRecordQuestionBeCleared(q, "onHidden"));
    if (inputs.length === 0) return undefined;
    const flags = new Map<any, HashTable<number>>();
    if (!!this.states) {
      this.states.forEach((state: HashTable<number>, key: any): void => { flags.set(key, state); });
    }
    const items = new Set<QuestionRecordItem>();
    owner.forEachBuiltRecordItem((key: any, item: QuestionRecordItem): void => {
      items.add(item);
      flags.set(key, this.getItemHiddenAnswerState(item, inputs));
    });
    return { inputs: inputs, items: items, flags: flags };
  }
  public clearAnswersHiddenInNewObjects(taken: IHiddenAnswerFlags): void {
    this.owner.forEachBuiltRecordItem((key: any, item: QuestionRecordItem): void => {
      const prevState = taken.flags.get(key);
      if (taken.items.has(item) || !prevState) return;
      const state = this.getItemHiddenAnswerState(item, taken.inputs);
      taken.inputs.forEach((input: Question): void => {
        const name = input.getValueName();
        if (!this.isHiddenAnswerCleared(input, prevState[name], state[name])) return;
        const q = item.getQuestionsByValueName(name)[0];
        const isSelfHidden = (prevState[name] & HIDDEN_ANSWER_SELF) && !(state[name] & HIDDEN_ANSWER_SELF);
        if (!!q) q.clearValueIfInvisible(isSelfHidden ? "onHidden" : "onHiddenContainer");
      });
    });
  }
}

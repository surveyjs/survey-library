import { HashTable, Helpers } from "../helpers";
import { Question, ValidationContext } from "../question";
import { ValueScope } from "../utils/scope";
import type { ISurveyData } from "../base-interfaces";
import type { PanelModelBase } from "../panel";
import type { ItemValue } from "../itemvalue";
import type { DynamicDataList } from "../dynamic-data/dynamic-data-list";
import type { IRecordCleanupObject, QuestionRecordItem } from "../question_records";

// What the records clean-up reads from the records question.
export interface IRecordCleanupRunnerOwner {
  getDataList(): DynamicDataList;
  readonly isPagedByList: boolean;
  readonly isRemoteData: boolean;
  isEmpty(): boolean;
  forEachRecordItem(indexes: Array<number>, func: (index: number, item: QuestionRecordItem, position: number) => void): void;
  getListRecordAt(index: number): any;
  // The records a clean-up pass changed, written in one batch of the list as the question's own change.
  writeRecordChanges(changes: Array<{ index: number, record: any }>): void;
  getRecordUnknownKeys(recordIndex: number, record: any, item: QuestionRecordItem): Array<string>;
  getRecordTemplateQuestion(key: string): Question;
  createRecordCleanupObject(index: number, record: any): IRecordCleanupObject;
  getDataFilteredProperties(): HashTable<any>;
  // A template question the clean-up does not judge.
  isRecordCleanupSkipped(question: Question): boolean;
}

// The record keys a temporary object's clean-up of a template question writes: its answer and comment, and the answers of the questions in its choices.
function getRecordCleanupKeys(template: Question): Array<string> {
  const res: Array<string> = [];
  const questions = template.isDescendantOf("selectbase") ? template.getNestedQuestions(false, true, true) : [template];
  questions.forEach((q: Question): void => { res.push(q.getValueName(), Helpers.getCommentKey(q.getValueName())); });
  return res;
}
/* The completion clean-up of a template question that only an object of the record can run: the
   choices of a select question differ by record - choicesVisibleIf, choicesEnableIf, a choice with its
   own visibleIf or enableIf, a choice with elements (their answers go with it), choicesFromQuestion
   naming a question of the record (container) or one the survey does not hold. Any other question is
   judged over its stored answer (Question.getAnswerCleanupAtComplete). */
function isRecordCleanupByObject(template: Question, container: PanelModelBase): boolean {
  if (!template.isDescendantOf("selectbase")) return false;
  if (!!template.getPropertyValue("choicesVisibleIf") || !!template.getPropertyValue("choicesEnableIf")) return true;
  const choices: Array<ItemValue> = template.getPropertyValue("choices") || [];
  if (choices.some((item: ItemValue): boolean => !!item.visibleIf || !!item.enableIf || item.hasElements)) return true;
  const from: string = template.getPropertyValue("choicesFromQuestion");
  return !!from && (!!container.getQuestionByName(from) || !template.survey || !template.survey.getQuestionByName(from));
}

/* The incorrect answers of the records that have no object - the records of the pages never opened
   or left - cleared as their own objects would clear them, so that the result equals the unpaged
   one. The keys no question stores go (getRecordUnknownKeys). For each record a temporary object of
   the type is built for a copy of it, as a page build builds one (createRecordCleanupObject): the
   same factory and the survey's creation events (onMatrixCellCreating, onMatrixCellCreated,
   onQuestionCreated), the detail panel of a matrix that has one. It is loaded without writes, its
   conditions run, and its own released clearIncorrectValues() writes into the copy
   (recordCleanupScope); then it is disposed. It is not attached to the rows or panels and no add event
   fires.
   - A record the filter excludes keeps its answers, as it does without paging.
   - An assigned source is skipped, as every survey clean-up skips a source-owned question.
   - Kept as they are (isRecordCleanupSkipped): an answer whose choices come from a request
     (choicesByUrl, lazy loading) - no request is sent -, the value of a question that holds records
     of its own, whose clean-up does not run without an object, and a file question's value - no
     download starts. The object is built without them, or with them still loading, and their
     values are copied back unchanged.
   - A handler that changes the records during the walk wins: a cleaned copy is written only to a
     record whose stored object is still the one the walk read.
   Cost: one object per record without an object, only on an explicit clearIncorrectValues (the
   unpaged question builds one per record too). The JSON the objects are built from is made once per
   walk (getRecordCleanupJson). The changed records are written in one batch. */
export class RecordCleanupRunner {
  /* The record a temporary object of the clean-up judges: the object reads and writes a copy of it,
     never the list. item is the object once it is built; while it is built (isBuilding) the object the
     type does not know is it, and its writes are dropped - a build loads the record without writing. */
  private recordCleanupScope = new ValueScope<{ index: number, copy: any, item: ISurveyData, isBuilding: boolean }>();
  /* The JSON the temporary objects are built from (build), made once per walk and parsed for each
     object: an object shares no value or error with the next one. Outside a walk it is made each time. */
  private recordCleanupWalkScope = new ValueScope<{ json: string }>();
  constructor(private owner: IRecordCleanupRunnerOwner) { }

  public clearIncorrectValuesWithoutObjects(): void {
    this.cleanRecordsWithoutObjectsBy((cleanupObject: IRecordCleanupObject): void => cleanupObject.clearIncorrectValues());
  }
  /* Each record without an object cleaned by a temporary object of the type (cleanRecordWithObject):
     clean runs one of the object's own released clean-ups. Only a question the list pages in memory has
     such records to clean, and a source-owned one is skipped, as every survey clean-up skips it. */
  private cleanRecordsWithoutObjectsBy(clean: (cleanupObject: IRecordCleanupObject) => void): void {
    if (!this.owner.isPagedByList || this.owner.isRemoteData || this.owner.isEmpty()) return;
    this.recordCleanupWalkScope.run({ json: undefined }, (): void => {
      this.cleanRecordsWithoutObjects((index: number, record: any): any => this.cleanRecordWithObject(index, record, clean));
    });
  }
  /* The completion clean-up of each record without an object, as a built object of the template
     (container) runs it (clean): what its questions' own clearValueIfInvisibleCore adds to the invisible
     answers the value-only pass has cleared. A question whose clean-up does not depend on the record is
     judged over its stored answer (Question.getAnswerCleanupAtComplete). A temporary object is built
     only for a record with a question it cannot judge that way (isRecordCleanupByObject, or an answer
     only a built question can tell), and only the answers of those questions are taken from it
     (getRecordCleanupKeys). The record keeps what an object adds by being built and not by its
     clean-up - its computed values and the keys no question stores: a record without an object is
     not built at completion, while the unpaged question has built each one on load. Paging leaves
     the validation and the computed values of a page never opened undone; this clean-up is not
     part of that and covers every record (Andrew's decision 2026-10-12). */
  public cleanRecordsWithoutObjectsAtComplete(container: PanelModelBase, clean: (cleanupObject: IRecordCleanupObject) => void): void {
    const owner = this.owner;
    if (!owner.isPagedByList || owner.isRemoteData || owner.isEmpty()) return;
    const questions = container.questions.filter((q: Question): boolean => !owner.isRecordCleanupSkipped(q));
    const byObject = questions.filter((q: Question): boolean => isRecordCleanupByObject(q, container));
    this.recordCleanupWalkScope.run({ json: undefined }, (): void => {
      this.cleanRecordsWithoutObjects((index: number, record: any): any => {
        let res = Object.assign({}, record);
        const objectQuestions = [].concat(byObject);
        questions.forEach((q: Question): void => {
          if (byObject.indexOf(q) > -1) return;
          const key = q.getValueName();
          const cleanup = q["getAnswerCleanupAtComplete"](record[key]);
          if (cleanup === undefined) objectQuestions.push(q);
          if (cleanup === "clear") delete res[key];
        });
        if (objectQuestions.length === 0) return res;
        const cleaned = this.cleanRecordWithObject(index, record, clean);
        objectQuestions.forEach((q: Question): void => {
          getRecordCleanupKeys(q).forEach((key: string): void => {
            if (cleaned[key] === undefined) {
              delete res[key];
            } else {
              res[key] = cleaned[key];
            }
          });
        });
        return res;
      });
    });
  }
  /* The records without an object that the view creates, each passed to clean (which returns the
     cleaned record), and the changed ones written back - only where the stored object is still the one
     clean read: a handler that ran inside it may have changed the records. */
  private cleanRecordsWithoutObjects(clean: (index: number, record: any) => any): void {
    const owner = this.owner;
    const list = owner.getDataList();
    const read: Array<{ index: number, record: any, cleared: any }> = [];
    owner.forEachRecordItem(list.getCreatedIndexes(), (index: number, item: QuestionRecordItem): void => {
      const record = owner.getListRecordAt(index);
      if (!!item || !Helpers.isValueObject(record, true)) return;
      read.push({ index: index, record: record, cleared: clean(index, record) });
    });
    const changes: Array<{ index: number, record: any }> = [];
    read.forEach((entry: { index: number, record: any, cleared: any }): void => {
      if (Helpers.isTwoValueEquals(entry.cleared, entry.record)) return;
      if (entry.index >= list.loadedCount || owner.getListRecordAt(entry.index) !== entry.record) return;
      changes.push({ index: entry.index, record: entry.cleared });
    });
    owner.writeRecordChanges(changes);
  }
  // The copy a temporary object reads; isUnknownItem: the type does not know the item as one of its objects.
  public getRecordCleanupCopy(item: ISurveyData, isUnknownItem: boolean): any {
    const cleanup = this.recordCleanupScope.value;
    return !!cleanup && (cleanup.item === item || !cleanup.item && isUnknownItem) ? cleanup.copy : undefined;
  }
  /* A write of a temporary object goes into its copy (an empty value removes the key, as a write of
     a row or a panel does), or nowhere while it is built. Returns false for any other object. */
  public writeRecordCleanupCopy(item: ISurveyData, isUnknownItem: boolean, name: string, val: any): boolean {
    const copy = this.getRecordCleanupCopy(item, isUnknownItem);
    if (copy === undefined) return false;
    if (this.recordCleanupScope.value.isBuilding) return true;
    if (Helpers.isValueEmpty(val)) {
      delete copy[name];
    } else {
      copy[name] = Helpers.getUnbindValue(val);
    }
    return true;
  }
  // A temporary object is being built: the types build the questions the clean-up skips without starting their requests.
  public get isRecordCleanupBuilding(): boolean {
    const cleanup = this.recordCleanupScope.value;
    return !!cleanup && cleanup.isBuilding;
  }
  // The record index of a temporary object, -1 for any other object.
  public getRecordCleanupIndex(item: ISurveyData, isUnknownItem: boolean): number {
    return this.getRecordCleanupCopy(item, isUnknownItem) !== undefined ? this.recordCleanupScope.value.index : -1;
  }
  /* A copy of the record, cleaned by a temporary object of the type (clearIncorrectValuesWithoutObjects):
     clean runs the object's own released clean-up. */
  public cleanRecordWithObject(index: number, record: any, clean: (cleanupObject: IRecordCleanupObject) => void): any {
    const owner = this.owner;
    const copy = Object.assign({}, record);
    owner.getRecordUnknownKeys(index, record, undefined).forEach((key: string): void => { delete copy[key]; });
    const cleanup = { index: index, copy: copy, item: <ISurveyData>undefined, isBuilding: true };
    let cleanupObject: IRecordCleanupObject = undefined;
    try {
      this.recordCleanupScope.run(cleanup, (): void => {
        cleanupObject = owner.createRecordCleanupObject(index, copy);
        if (!cleanupObject) return;
        cleanup.item = cleanupObject.item;
        // Loaded: what its conditions and its clean-up change is written into the copy, as a built object writes it.
        cleanup.isBuilding = false;
        cleanupObject.runCondition(owner.getDataFilteredProperties());
        clean(cleanupObject);
      });
    } finally {
      if (!!cleanupObject) cleanupObject.dispose();
    }
    if (!cleanupObject) return record;
    // What the clean-up does not judge is copied back as it was.
    Object.keys(record).forEach((key: string): void => {
      const template = owner.getRecordTemplateQuestion(key);
      if (!!template && owner.isRecordCleanupSkipped(template)) copy[key] = record[key];
    });
    return copy;
  }
  public getRecordCleanupJson(build: () => any): any {
    const walk = this.recordCleanupWalkScope.value;
    if (!walk) return build();
    if (walk.json === undefined) walk.json = JSON.stringify(build());
    return JSON.parse(walk.json);
  }
  /* The quiet validation of such an object (IRecordCleanupObject.validate): nothing is shown and no
     callback fires. validate runs the object's validation into the context; false when a question of
     the object has an error. */
  public validateRecordObjectQuietly(validate: (context: ValidationContext) => boolean): boolean {
    const context = new ValidationContext({ fireCallback: false });
    const res = validate(context);
    context.finish();
    return res !== false && context.runningResult !== false;
  }
}

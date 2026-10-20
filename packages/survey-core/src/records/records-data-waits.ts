import type { IQuestion, ISurvey } from "../base-interfaces";
import type { ValidationContext } from "../question";
import type { ISurveyDynamicDataWrites } from "../interfaces/survey-callbacks";
import type { DynamicDataErrorOperation } from "../dynamic-data/dynamic-data-interfaces";

// What the data waits read from the records question.
export interface IRecordsDataWaitsOwner {
  // The question the survey is told about.
  readonly question: IQuestion;
  readonly id: string;
  readonly isDisposed: boolean;
  readonly survey: ISurvey;
  // The question's data is read or written: QuestionRecordsModel.isDynamicDataRunning.
  isDataRunning(): boolean;
  // A write the assigned source has not answered.
  isWriting(): boolean;
  // The question validated again into a context it held.
  validate(context: ValidationContext): void;
}

/* The survey side that waits for the writes of a records question (ISurveyDynamicDataWrites). It is
   not part of ISurvey, and SurveyModel keeps it private, so a survey is asked for it by its member: a
   custom ISurvey without it is never asked to wait. */
function getSurveyDynamicDataWrites(survey: ISurvey): ISurveyDynamicDataWrites {
  const writes = <ISurveyDynamicDataWrites><any>survey;
  return !!writes && typeof writes.dynamicDataWritesChanged === "function" ? writes : undefined;
}

/* A validation that answers through a callback - complete, the next page, the preview,
   validate(callback) - waits while the question's data is read or written: the records the source
   has not brought yet, or not taken yet, cannot be validated. The context waits for the question
   (addElement) until the list settles - its last read or write answered or failed, or a new source,
   or none, was assigned and its first read committed - then the question is validated again into
   it. A write that never settles keeps the context waiting, and so does a write of a replaced
   source that never settles (the new source is read after it); a disposed question releases it. A
   synchronous validation (isCurrentPageValid, validate() without a callback) answers at once, as
   before.
   The survey keeps the records questions that have unanswered writes, and a completion waits for
   them (ISurveyDynamicDataWrites). It is told when the first write starts (onWritesStarted) and when
   the writes have settled with everything else the source was asked for, as the validation waits
   for. A disposed question and one that leaves its survey are taken off. */
export class RecordsDataWaits {
  private waits: Array<{ context: ValidationContext, id: string }>;
  /* Each registration has an id of its own: the validation a release runs again can register the same
     context while the release still has to remove the registration it ends. */
  private waitCount: number = 0;
  // The survey that was told the question writes.
  private reportedWritesSurvey: ISurvey;
  // A write reported to the survey was rejected by the source (onSourceError).
  private hasRejectedWrite: boolean;
  constructor(private owner: IRecordsDataWaitsOwner) { }

  public wait(context: ValidationContext): void {
    if (!context.hasCallback || context.isOnValueChanged || context.isOnValueChanging || !this.owner.isDataRunning()) return;
    if (!this.waits)this.waits = [];
    if (this.waits.some(wait => wait.context === context)) return;
    this.waitCount++;
    const id = this.owner.id + "_data_" + this.waitCount;
    this.waits.push({ context: context, id: id });
    context.addElement(id);
  }
  // The list settled: the held contexts are validated again, and the survey is told.
  public onDataSettled(): void {
    try {
      if (!!this.waits && !this.owner.isDataRunning()) {
        this.release(true);
      }
    } finally {
      this.reportPendingWrites();
    }
  }
  /* Every held context is released, also when the validation of one throws: the first error is
     rethrown once all of them are released. */
  public release(isValidated: boolean): void {
    const waits = this.waits;
    this.waits = undefined;
    if (!waits) return;
    let error: { error: any } = undefined;
    waits.forEach((wait: { context: ValidationContext, id: string }): void => {
      try {
        if (isValidated) {
          this.owner.validate(wait.context);
        }
      } catch(e) {
        if (!error) error = { error: e };
      } finally {
        wait.context.removeElement(wait.id);
      }
    });
    if (!!error) throw error.error;
  }
  // An error of the source: a write it rejected releases a completion that waits for the writes.
  public onSourceError(operation: DynamicDataErrorOperation): void {
    if (operation !== "read" && !!this.reportedWritesSurvey) {
      this.hasRejectedWrite = true;
    }
  }
  public onWritesStarted(): void {
    if (!this.reportedWritesSurvey)this.reportPendingWrites();
  }
  // The question moved to another survey, or left it.
  public onSurveyChanged(survey: ISurvey): void {
    if (this.reportedWritesSurvey !== undefined && this.reportedWritesSurvey !== survey)this.reportPendingWrites();
  }
  public reportPendingWrites(): void {
    const survey = !this.owner.isDisposed && this.owner.isWriting() ? this.owner.survey : undefined;
    const reported = this.reportedWritesSurvey;
    if (survey === reported) return;
    this.reportedWritesSurvey = survey;
    const isFailed = !!this.hasRejectedWrite;
    this.hasRejectedWrite = false;
    const oldWrites = getSurveyDynamicDataWrites(reported);
    if (!!oldWrites) oldWrites.dynamicDataWritesChanged(this.owner.question, false, isFailed);
    const newWrites = getSurveyDynamicDataWrites(survey);
    if (!!newWrites) newWrites.dynamicDataWritesChanged(this.owner.question, true);
  }
}

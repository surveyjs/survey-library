import { SurveyModel } from "survey-core";
import type { Question } from "survey-core";
import { settle } from "./interview-async";
import { renderInterviewDocument } from "./render";
import {
  IInterview, IInterviewChanges, IInterviewCompleteResult, IInterviewDocument, IInterviewError,
  IInterviewItem, IInterviewOptions, IInterviewResult, IInterviewToolDefinition, IInterviewToolOptions,
} from "./interview-types";
import {
  IInterviewContainer, IInterviewInput, getAnsweredValue, getInputErrors, getInterviewInputs,
  getUnreportedContainers, isAskableInput, isInputAnswered, isInputValid, makeInputCurrent,
  updateCurrentItem, validateInput,
} from "./interview-items";
import { resolveAddress } from "./interview-address";
import { applySummaryAction } from "./interview-summary";
import {
  IInterviewBatchEntry, findBatchEntry, getBatchAddresses, getBatchCurrent, getBatchEntries,
  getBatchItems, isBatchWritable, refreshBatchEntry,
} from "./interview-batch";
import { IPreparedValue, isPlainObject, prepareValue, writeContainerValue } from "./interview-fields";
import { createAnswerSchema } from "./interview-schema";
import { InterviewToolNames, getToolBaseName, getToolDefinitions } from "./interview-tools";
import { InterviewSkipped, diffSnapshots, noChanges, takeSnapshot } from "./interview-state";
import {
  InterviewErrorCodes, badAddressError, badRecordError, completionBlockedError, notAskableError,
  nothingToAnswerError, requiredCannotSkipError, surveyCompletedError, unknownQuestionError,
  unknownToolError,
} from "./interview-errors";

// The interview conducts one SurveyModel the integrator owns (overview 2.6). It sets exactly one
// property of that model - questionsOnPageMode, the mode it drives - and never disposes it, so the
// same model may be rendered by a UI at the same time and everything else on it stays whatever the
// developer configured. Nothing is cached: a value written past the interview, by that UI or by the
// host's own code, is seen on the next call.
export class Interview implements IInterview {
  // The interview's own state, the part the model has no notion of: which optional items the
  // interviewee chose to skip, and (tier 06) which summary steps were marked done. dispose() drops
  // it; the model is left alone.
  private skipped = new InterviewSkipped();
  // The one input the selection rule is suspended for: the entry a summary step's "edit" action
  // opened. That entry is answered and valid, so the rule would walk straight past it, and the
  // interviewee has just asked to see it. It is dropped by the next call that writes anything, which
  // is where the rule resumes.
  private editingQuestion: Question;
  private timeoutValue: number;

  constructor(private surveyValue: SurveyModel, options?: IInterviewOptions) {
    this.timeoutValue = !!options ? options.timeout : undefined;
  }

  public get survey(): SurveyModel {
    return this.surveyValue;
  }
  public get data(): any {
    return this.surveyValue.data;
  }
  protected get timeout(): number {
    return this.timeoutValue;
  }

  // Called once by createInterview, before the instance is handed out. The model is put into the
  // mode the interview drives and, if it is showing a start page, started: the start page is a UI
  // concept that getSingleElements() skips, so an interview would otherwise never ask its questions
  // and never get past it.
  public async initialize(): Promise<void> {
    const survey: any = this.surveyValue;
    // Setting the property re-runs onQuestionsOnPageModeChanged, which resets the single-input state
    // of every question and makes the first root current. A model already in the mode keeps whatever
    // input its owner navigated to.
    if (survey.questionsOnPageMode !== "inputPerPage") {
      survey.questionsOnPageMode = "inputPerPage";
    }
    if (survey.state === "starting" && !survey.start()) {
      throw createStartPageError(survey);
    }
    await this.settleSurvey();
    // A model resumed from data may already hold a value that violates a validator. Validators only
    // ever run with fireCallback = true, so unless they are run here that input would be reported
    // valid until something wrote to it - and the interview would ask for the next input instead of
    // the wrong one.
    const inputs = this.getInputs();
    inputs.forEach(input => {
      if (isAskableInput(input) && !input.question.isEmpty()) {
        input.question.validate(true);
      }
    });
    await this.settleSurvey();
    this.makeCurrent(this.getInputs());
  }

  // The issue's rule: the first item, in order, that can be asked and is either unanswered or
  // invalid. A synchronous read of settled state - it never moves the model, never validates and
  // never starts anything.
  public current(): IInterviewItem | null {
    return this.getCurrentItem(this.getInputs());
  }

  public describe(): string {
    return renderInterviewDocument(this.createDocument(this.getInputs()));
  }

  public answer(value: any): Promise<IInterviewResult>;
  public answer(name: string, value: any): Promise<IInterviewResult>;
  public answer(nameOrValue: any, value?: any): Promise<IInterviewResult> {
    // Two arguments mean a revisit by address; one means "the input you just asked me for". The
    // count is what tells them apart: answer(undefined) is a value, not a missing name.
    const hasName = arguments.length > 1;
    return this.answerCore(hasName ? nameOrValue : undefined, hasName ? value : nameOrValue, hasName);
  }

  // Skipping is a single-mode gesture and it lives only in the interview: the model has no notion of
  // it, and the value - if the input already held one - stays. "Skip" means "move on", not "erase".
  public async skip(): Promise<IInterviewResult> {
    if (this.isCompleted()) return this.createErrorResult(surveyCompletedError(), []);
    const inputs = this.getInputs();
    const target = this.getCurrentInput(inputs);
    if (!target) return this.createErrorResult(nothingToAnswerError(), inputs);
    if (target.item.required === true) {
      // Required means asked. The same item stays current, so a consumer that loops on current()
      // does not spin past it.
      return this.createErrorResult(requiredCannotSkipError(target.address), inputs);
    }
    this.skipped.add(target.address);
    this.editingQuestion = undefined;
    await this.settleSurvey();
    const after = this.getInputs();
    this.makeCurrent(after);
    return this.createResult(after, noChanges(), []);
  }

  public async complete(): Promise<IInterviewCompleteResult> {
    const survey = this.surveyValue;
    if (this.isCompleted()) {
      // Completing a completed survey is not an error, it is a no-op with the same answer.
      return { completed: true, errors: [], data: survey.data, completedHtml: survey.processedCompletedHtml };
    }
    let inputs = this.getInputs();
    inputs.forEach(input => { if (isAskableInput(input)) input.question.validate(true); });
    // A container whose own errors no item carries - a single-choice matrix, a matrix dropdown, a
    // multiple text, a composite - validates itself here, or a RequiredInAllRowsError would keep the
    // model from completing while the interview reported nothing to correct.
    getUnreportedContainers(inputs).forEach(container => container.question.validate(true));
    await this.settleSurvey();
    inputs = this.getInputs();
    let errors = this.collectErrors(inputs);
    if (errors.length > 0) {
      // A required input that was never answered is an error here and nowhere else: the interview
      // cannot know the person is done until every required input holds a value.
      return { completed: false, errors: errors, data: survey.data, completedHtml: "" };
    }
    this.makeCurrent(inputs);
    // tryComplete(), not doComplete(): server validation lives only on this path -
    // doCurrentPageComplete(true) -> validateOnNavigate -> doServerValidation(true), which fires
    // onServerValidateQuestions and blocks until the host calls options.complete(). doComplete()
    // skips it, and a survey whose host validates on a server would be completed behind its back.
    survey.tryComplete();
    await this.settleSurvey();
    const completed = this.isCompleted();
    // Server validation puts its errors on the questions, so they are read back the same way every
    // other error is.
    errors = this.collectErrors(inputs);
    if (!completed && errors.length === 0) {
      errors = [completionBlockedError()];
    }
    return {
      completed: completed,
      errors: errors,
      data: survey.data,
      completedHtml: completed ? survey.processedCompletedHtml : "",
    };
  }

  // Everything an agent still has to work on, in one document. A synchronous read of settled state,
  // like describe(): it never moves the model and never validates.
  public describeAll(): string {
    return renderInterviewDocument(this.createDocument(this.getInputs(), undefined, undefined, true));
  }

  // The batch write. Every key is resolved first, the accepted ones are ordered by item order and
  // then written one at a time, each re-checked against the state its predecessors left behind. A key
  // that fails is skipped and the rest are written: one bad answer of a turn must not throw away the
  // good ones, and the errors say which key was refused and why.
  public async answerAll(values: { [address: string]: any }): Promise<IInterviewResult> {
    if (this.isCompleted()) return this.createErrorResult(surveyCompletedError(), [], true);
    const inputs = this.getInputs();
    const entries = getBatchEntries(this.surveyValue, inputs);
    const resolved = resolveBatchValues(entries, values, this.surveyValue.commentSuffix);
    const errors = resolved.errors;
    if (resolved.writes.length === 0) {
      return this.createResult(inputs, noChanges(), errors, true);
    }
    const before = takeSnapshot(this.surveyValue, inputs);
    // The same rule as in single mode: an expression validator or a min/max bound may depend on a
    // value this batch writes, and a stale error would keep an input listed forever.
    const wereInvalid = inputs.filter(input => input.question.errors.length > 0);
    const written: IBatchWritten = { addresses: {}, containers: [] };
    resolved.writes.forEach(write => {
      this.writeBatchValue(write, written).forEach(error => errors.push(error));
    });
    wereInvalid.forEach(input => {
      if (written.addresses[input.address] !== true && input.question.isVisibleInSurvey) {
        input.question.validate(true);
      }
    });
    // One settle for the whole batch: the asynchronous validators and expressions of every write
    // drain together instead of one call per key.
    await this.settleSurvey();
    const after = this.getInputs();
    this.makeCurrent(after);
    after.forEach(input => {
      if (written.addresses[input.address] !== true) return;
      getInputErrors(input).forEach(message => errors.push({ name: input.address, message: message }));
    });
    // A container's own errors sit on the container and on no item, so they are read from it
    // directly, under its own address, after the fields it holds have reported theirs.
    written.containers.forEach(container => {
      container.question.errors.forEach(error => {
        errors.push({ name: container.address, message: error.getText() });
      });
    });
    return this.createResult(after, diffSnapshots(before, takeSnapshot(this.surveyValue, after)), errors, true);
  }

  public getAnswerSchema(): any {
    const entries = getBatchEntries(this.surveyValue, this.getInputs());
    return createAnswerSchema(getBatchItems(entries), this.surveyValue.commentSuffix);
  }

  public getTools(options?: IInterviewToolOptions): Array<IInterviewToolDefinition> {
    return getToolDefinitions(this.getAnswerSchema(), options);
  }

  public callTool(name: string, args: any): Promise<any> {
    // The prefix getTools() was given is the host's, and the definitions are plain data that nothing
    // remembers, so a name is recognized by what it ends with.
    switch(getToolBaseName(name)) {
      case InterviewToolNames.describe: return Promise.resolve(this.describeAll());
      case InterviewToolNames.answer: return this.answerAll(args || {});
      case InterviewToolNames.complete: return this.complete();
    }
    return Promise.reject(unknownToolError(name));
  }

  public dispose(): void {
    this.skipped.clear();
    this.editingQuestion = undefined;
  }

  private async answerCore(name: string, value: any, hasName: boolean): Promise<IInterviewResult> {
    if (this.isCompleted()) return this.createErrorResult(surveyCompletedError(), []);
    const inputs = this.getInputs();
    const target = hasName ? this.findInput(inputs, name) : this.getCurrentInput(inputs);
    if (!target) {
      return this.createErrorResult(hasName
        ? this.createAddressError(inputs, name)
        : nothingToAnswerError(), inputs);
    }
    if (!isAskableInput(target)) {
      return this.createErrorResult(
        notAskableError(target.address, target.item.disabled ? "disabled" : "unsupported"), inputs);
    }
    // The summary step of a dynamic container takes an action - add, remove, edit, done - and not a
    // value: the entries are grown and shrunk through the model's own summary, which is what the UI
    // offers a respondent.
    if (target.isSummary) return this.answerSummary(target, value, inputs);
    const prepared = prepareValue(target.item, target.address, value);
    if (!!prepared.error) {
      // Nothing was written, so nothing changed: the result carries the one coded error and the same
      // current item.
      return this.createErrorResult(prepared.error, inputs);
    }
    const before = takeSnapshot(this.surveyValue, inputs);
    // An expression validator or a min/max bound may depend on the value about to be written, so
    // every input that holds an error now is re-validated after the write. Stale errors would
    // otherwise keep an input current forever.
    const wereInvalid = inputs.filter(input => input !== target && input.question.errors.length > 0);
    this.write(target, prepared);
    // Validation comes before the settle: it is what starts the asynchronous validators the settle
    // waits for.
    validateInput(this.surveyValue, target);
    wereInvalid.forEach(input => {
      // A visibleIf that hid an input cleared its errors on its own; validating it again would only
      // put a required error back on a question nobody can see.
      if (input.question.isVisibleInSurvey) input.question.validate(true);
    });
    await this.settleSurvey();
    const after = this.getInputs();
    this.makeCurrent(after);
    const errors = getInputErrors(target).map(message => ({ name: target.address, message: message }));
    return this.createResult(after, diffSnapshots(before, takeSnapshot(this.surveyValue, after)), errors);
  }

  // An action on a summary step. Adding, removing and editing an entry are the model's own gestures
  // and they are run through the model (interview-summary.ts); the interview adds only "done", which
  // the model has no notion of - an optional container with entries in it is not finished until the
  // interviewee says so, exactly as the mode keeps the summary in front of them.
  private async answerSummary(target: IInterviewInput, value: any,
    inputs: Array<IInterviewInput>): Promise<IInterviewResult> {
    // The model builds a container's summary - the entries, their remove buttons, the add caption -
    // only for the container that is its current single input, so the step is made current before it
    // is acted on. A call that answers this step is a write, and moving the model is what every
    // write ends with anyway.
    makeInputCurrent(this.surveyValue, target);
    const before = takeSnapshot(this.surveyValue, inputs);
    const wereInvalid = inputs.filter(input => input !== target && input.question.errors.length > 0);
    const hadErrors: { [id: string]: boolean } = {};
    wereInvalid.forEach(input => { hadErrors[input.question.id] = true; });
    const applied = applySummaryAction(target.question, target.address, value);
    if (!!applied.error) {
      // No entry was added, removed or opened, so nothing changed: the one coded error and the same
      // current item. The model goes back to that item - it was moved here only to read the summary.
      this.makeCurrent(inputs);
      return this.createErrorResult(applied.error, inputs);
    }
    this.editingQuestion = undefined;
    if (applied.isDone === true) {
      this.skipped.add(target.address);
    } else {
      // Growing, shrinking or revisiting the list re-opens it: a "done" said earlier was about the
      // list as it was then, and the interviewee gets the summary back when the new entry is filled.
      this.skipped.remove(target.address);
      // MinRowCountError, a duplicated key, a required container that has just lost its last entry:
      // the container's own errors are written by validating it after every add and every remove.
      validateInput(this.surveyValue, target);
      // Validating the container validates its entries with it, and that would put "Response
      // required." on an input nobody has been asked for yet - a freshly added entry is empty by
      // definition. An input that carried no error before the action and is still empty is left as
      // it was: an unanswered required input becomes an error at complete(), not the moment its
      // entry comes into being.
      this.getInputs().forEach(input => {
        if (input.question === target.question) return;
        if (hadErrors[input.question.id] !== true && input.question.isEmpty() &&
          input.question.errors.length > 0) {
          input.question.clearErrors();
        }
      });
      wereInvalid.forEach(input => {
        if (input.question.isVisibleInSurvey) input.question.validate(true);
      });
    }
    await this.settleSurvey();
    const after = this.getInputs();
    // "edit" is the one gesture whose current follows the model instead of the rule: the entry it
    // opens is answered and valid, so the rule would walk straight past it, and the interviewee has
    // just asked to see it. It stays current until something is written, and the rule resumes there.
    if (applied.followsModel === true) {
      this.editingQuestion = this.getModelLeaf();
    }
    this.makeCurrent(after);
    const errors = getInputErrors(target).map(message => ({ name: target.address, message: message }));
    return this.createResult(after, diffSnapshots(before, takeSnapshot(this.surveyValue, after)), errors);
  }

  // Where the model stands now: the leaf of the single-input mode, the input a UI on the same model
  // would be showing.
  private getModelLeaf(): Question {
    const root = this.surveyValue.currentSingleQuestion;
    if (!root) return undefined;
    return root.singleInputBehavior.currentSingleInputQuestion || root;
  }

  // One key of a batch, written against the state the earlier keys left behind. The item is
  // described again here rather than trusted from the resolution pass: an earlier write may have
  // hidden it, an enableIf may have turned it off, and choicesFromQuestion or choicesVisibleIf may
  // have moved the set the value is checked against.
  private writeBatchValue(write: IBatchWrite, written: IBatchWritten): Array<IInterviewError> {
    const address = write.entry.address;
    const fresh = refreshBatchEntry(write.entry);
    if (!fresh) return [notAskableError(address, "hidden")];
    if (!isBatchWritable(fresh)) {
      return [notAskableError(address, fresh.item.disabled === true ? "disabled" : "hidden")];
    }
    if (!!fresh.container) return this.writeBatchContainer(fresh.container, address, write, written);
    const question = fresh.input.question;
    if (write.hasValue) {
      const prepared = prepareValue(fresh.input.item, address, write.value);
      if (!!prepared.error) return [prepared.error];
      question.value = prepared.value;
      if (prepared.hasComment) question.comment = prepared.comment;
    }
    if (write.hasComment) question.comment = write.comment;
    this.markWritten(written, address);
    // Validated one key at a time, before the next write: an expression validator reads the data as
    // it is now, and running them all at the end would validate against a later state.
    question.validate(true);
    return [];
  }

  // A fixed-shape container takes one object of field values, and the fields are written one at a
  // time in the container's own order (interview-fields.ts). Nothing here is an address: the keys of
  // the object are the field names the document lists, and the errors are reported under the
  // addresses those fields have in the inventory.
  private writeBatchContainer(container: Question, address: string, write: IBatchWrite,
    written: IBatchWritten): Array<IInterviewError> {
    if (!write.hasValue) return [];
    const value = write.value;
    if (value !== undefined && value !== null && !isPlainObject(value)) {
      return [badRecordError(address, value)];
    }
    const res = writeContainerValue(container, address, value, this.surveyValue.commentSuffix);
    res.written.forEach(field => this.markWritten(written, field.address));
    if (res.written.length > 0) {
      // RequiredInAllRowsError, EachRowUniqueError and a required container left empty are the
      // container's own errors, and no field write puts them anywhere. complete() runs the same
      // validation on the containers no item carries (getUnreportedContainers).
      container.validate(true);
      written.containers.push({ address: address, question: container });
    }
    return res.errors;
  }

  // An answer un-skips, exactly as in single mode, and it ends an "edit" the same way.
  private markWritten(written: IBatchWritten, address: string): void {
    this.skipped.remove(address);
    this.editingQuestion = undefined;
    written.addresses[address] = true;
  }

  // Through the question, never through survey.data: a top-level question routes into
  // SurveyModel.setValue and a nested one into its panel or its row, so triggers, setValueIf,
  // calculated values and conditions run at every level, exactly as they do for a respondent.
  private write(target: IInterviewInput, prepared: IPreparedValue): void {
    target.question.value = prepared.value;
    if (prepared.hasComment) {
      target.question.comment = prepared.comment;
    }
    // An answer un-skips: the interviewee changed their mind about leaving it alone.
    this.skipped.remove(target.address);
    // The entry an "edit" opened has been answered: the selection rule takes over again.
    this.editingQuestion = undefined;
  }

  private getInputs(): Array<IInterviewInput> {
    return getInterviewInputs(this.surveyValue);
  }

  private findInput(inputs: Array<IInterviewInput>, name: string): IInterviewInput {
    const direct = inputs.filter(input => input.address === name)[0];
    if (!!direct) return direct;
    // The same input written differently - a segment quoted that need not be, or the other way
    // round. The address is resolved against the live model and the item is then found by identity,
    // so the grammar has one reading and the inventory one entry per input.
    const resolved = resolveAddress(this.surveyValue, name);
    if (!resolved.question) return undefined;
    return inputs.filter(input => input.question === resolved.question)[0];
  }

  // Two different mistakes, and a consumer acts on them differently. "badAddress": the text is not
  // an address at all, or it indexes an entry that does not exist - the answer to which is the "add"
  // action of a summary step, not another address. "unknownQuestion": the address is well formed and
  // names nothing that is being asked for, and the message lists what is.
  private createAddressError(inputs: Array<IInterviewInput>, name: string): IInterviewError {
    const resolved = resolveAddress(this.surveyValue, name);
    return resolved.isBad === true
      ? badAddressError(name)
      : unknownQuestionError(name, this.getAskableAddresses(inputs));
  }

  private getAskableAddresses(inputs: Array<IInterviewInput>): Array<string> {
    return inputs.filter(input => isAskableInput(input)).map(input => input.address);
  }

  private isCompleted(): boolean {
    return this.surveyValue.state === "completed";
  }

  private isAnswered(input: IInterviewInput): boolean {
    if (this.skipped.has(input.address) && input.item.required === true) {
      // A skipped item that a requiredIf turned required leaves the set: required means asked.
      this.skipped.remove(input.address);
    }
    return isInputAnswered(input, this.skipped.has(input.address));
  }

  private getCurrentInput(inputs: Array<IInterviewInput>): IInterviewInput {
    if (this.isCompleted()) return undefined;
    if (!!this.editingQuestion) {
      const editing = inputs.filter(input => input.question === this.editingQuestion &&
        isAskableInput(input))[0];
      if (!!editing) return editing;
      // The entry it belonged to is gone, or the input is no longer being asked for.
      this.editingQuestion = undefined;
    }
    return inputs.filter(input => isAskableInput(input) &&
      (!this.isAnswered(input) || !isInputValid(input)))[0];
  }

  private getCurrentItem(inputs: Array<IInterviewInput>): IInterviewItem | null {
    const input = this.getCurrentInput(inputs);
    if (!input) return null;
    // The two keys that are read off the model's current single input - the entry breadcrumb and a
    // container's summary - are filled here, for the one item that is current, because the model has
    // just been moved to it.
    updateCurrentItem(input);
    const errors = getInputErrors(input);
    // The first error text goes on the record, where a consumer reads it next to the value it has to
    // correct; the full list is the errors section of the document.
    if (errors.length > 0) input.item.error = errors[0];
    return input.item;
  }

  // The interview selects and then tells the model. When there is nothing left to ask, the model is
  // moved to the last input instead of to nothing: that is where a respondent stands when they press
  // Complete, and the model's completion path checks it - a survey with an onServerValidateQuestions
  // handler does not complete unless the mode considers itself at the end.
  private makeCurrent(inputs: Array<IInterviewInput>): void {
    const input = this.getCurrentInput(inputs) || getLastAskableInput(inputs);
    makeInputCurrent(this.surveyValue, input);
  }

  private collectErrors(inputs: Array<IInterviewInput>): Array<IInterviewError> {
    const res: Array<IInterviewError> = [];
    inputs.forEach(input => {
      if (!isAskableInput(input)) return;
      getInputErrors(input).forEach(message => res.push({ name: input.address, message: message }));
    });
    getUnreportedContainers(inputs).forEach((container: IInterviewContainer) => {
      container.question.errors.forEach(error => {
        res.push({ name: container.address, message: error.getText() });
      });
    });
    return res;
  }

  private getProgress(inputs: Array<IInterviewInput>): { answered: number, remainingRequired: number } {
    let answered = 0;
    let remainingRequired = 0;
    inputs.forEach(input => {
      if (input.isSummary) return;
      const isDone = this.isAnswered(input) && isInputValid(input);
      if (isDone) answered++;
      if (!isDone && isAskableInput(input) && input.item.required === true) remainingRequired++;
    });
    return { answered: answered, remainingRequired: remainingRequired };
  }

  // The whole map, in item order. The issue calls it "a short answered: map"; a consumer that wants
  // it short truncates it - the interview does not guess which answers matter. A skipped item is not
  // in it: it holds whatever it held, and the interviewee said they did not want to answer it.
  private getAnswered(inputs: Array<IInterviewInput>): { [address: string]: any } {
    const res: { [address: string]: any } = {};
    inputs.forEach(input => {
      if (input.question.isEmpty()) return;
      if (input.isSummary) {
        // The container's whole value - the array of panels, the array of rows - under its own
        // address, once the interviewee said the list is done. Its inputs stay listed under their own
        // addresses either way, so a consumer can read the answers at whichever level it works at.
        if (this.isAnswered(input)) res[input.address] = input.question.value;
        return;
      }
      if (this.skipped.has(input.address)) return;
      res[input.address] = getAnsweredValue(input);
    });
    return res;
  }

  // The same document in both modes, down to one key: single mode says which item is current, batch
  // mode lists every item that still needs work. Everything else - the title, the progress, the
  // answers so far, the changes and the errors of the call - is the same thing said the same way.
  private createDocument(inputs: Array<IInterviewInput>, changes?: IInterviewChanges,
    errors?: Array<IInterviewError>, isBatch?: boolean): IInterviewDocument {
    const res: IInterviewDocument = {
      title: this.surveyValue.processedTitle,
      progress: this.getProgress(inputs),
      answered: this.getAnswered(inputs),
    };
    // A bare describe() carries neither: they are the consequences of one call, and a document that
    // is not the answer to a call has no call to report on.
    if (!!changes) res.changes = changes;
    if (!!errors) res.errors = errors;
    if (isBatch === true) {
      res.items = getBatchItems(getBatchEntries(this.surveyValue, inputs));
    } else {
      res.current = this.getCurrentItem(inputs);
    }
    return res;
  }

  private createResult(inputs: Array<IInterviewInput>, changes: IInterviewChanges,
    errors: Array<IInterviewError>, isBatch?: boolean): IInterviewResult {
    const document = this.createDocument(inputs, changes, errors, isBatch);
    return {
      errors: errors,
      becameVisible: changes.becameVisible,
      becameHidden: changes.becameHidden,
      becameRequired: changes.becameRequired,
      // Filled in batch mode too, and there it is the loop condition: the first item of the document
      // an agent may still write to. "No errors and nothing became visible" is not a condition - an
      // agent that answers one of two required questions produces neither and is not done. It is the
      // loop condition said directly rather than single mode's current, which parts ways with it
      // once containers are in play: an empty optional item of a multiple text keeps single mode on
      // that item while the container is answered, valid and not listed, and the loop would spin.
      current: isBatch === true ? getBatchCurrent(document.items) : document.current,
      describe: renderInterviewDocument(document),
    };
  }

  private createErrorResult(error: IInterviewError, inputs: Array<IInterviewInput>,
    isBatch?: boolean): IInterviewResult {
    return this.createResult(inputs, noChanges(), [error], isBatch);
  }

  private settleSurvey(): Promise<void> {
    return settle(this.surveyValue, this.timeoutValue);
  }
}

// The mode has no "no input is current" state that is still completable, so the end of the interview
// is the last input a respondent could stand on.
function getLastAskableInput(inputs: Array<IInterviewInput>): IInterviewInput {
  const askable = inputs.filter(input => isAskableInput(input));
  return askable[askable.length - 1];
}

// What one batch call has written: the addresses whose persisted errors the result reports, and the
// containers whose own errors it reports next to them.
interface IBatchWritten {
  addresses: { [address: string]: boolean };
  containers: Array<IInterviewContainer>;
}

interface IBatchWrite {
  entry: IInterviewBatchEntry;
  order: number;
  hasValue: boolean;
  value?: any;
  hasComment: boolean;
  comment?: string;
}

// Every key of the object, resolved before anything is written. A key is an item address or an
// address plus the model's own comment suffix - the batch twin of single mode's { value, comment },
// and the key getAnswerSchema() advertises.
//
// The accepted keys are then ordered by item order and not by the order the object happens to carry:
// a trigger or a setValueIf that depends on an earlier question must see it first, and an agent's
// batch is a set of answers, not a sequence of gestures. A comment lands with the item it belongs to.
function resolveBatchValues(entries: Array<IInterviewBatchEntry>, values: { [address: string]: any },
  commentSuffix: string): { writes: Array<IBatchWrite>, errors: Array<IInterviewError> } {
  const errors: Array<IInterviewError> = [];
  const byAddress: { [address: string]: IBatchWrite } = {};
  const writes: Array<IBatchWrite> = [];
  const askable = getBatchAddresses(entries);
  Object.keys(values || {}).forEach(key => {
    const target = findBatchTarget(entries, key, commentSuffix);
    if (!target) {
      errors.push(unknownQuestionError(key, askable));
      return;
    }
    const entry = target.entry;
    if (!isBatchWritable(entry)) {
      errors.push(notAskableError(entry.address, getNotWritableReason(entry)));
      return;
    }
    let write = byAddress[entry.address];
    if (!write) {
      write = { entry: entry, order: entries.indexOf(entry), hasValue: false, hasComment: false };
      byAddress[entry.address] = write;
      writes.push(write);
    }
    if (target.isComment) {
      write.hasComment = true;
      write.comment = values[key];
    } else {
      write.hasValue = true;
      write.value = values[key];
    }
  });
  writes.sort((a, b) => a.order - b.order);
  return { writes: writes, errors: errors };
}

function getNotWritableReason(entry: IInterviewBatchEntry): "disabled" | "unsupported" | "batch" {
  if (entry.item.disabled === true) return "disabled";
  return entry.item.reason === "batch" ? "batch" : "unsupported";
}

// An address wins over a comment key: a question really named "note-Comment" is answered by its own
// name, and only a key that names no item at all is tried as the comment of one that does.
function findBatchTarget(entries: Array<IInterviewBatchEntry>, key: string,
  commentSuffix: string): { entry: IInterviewBatchEntry, isComment: boolean } {
  const direct = findBatchEntry(entries, key);
  if (!!direct) return { entry: direct, isComment: false };
  if (!commentSuffix || key.length <= commentSuffix.length) return undefined;
  if (key.substring(key.length - commentSuffix.length) !== commentSuffix) return undefined;
  const owner = findBatchEntry(entries, key.substring(0, key.length - commentSuffix.length));
  // Only for an item that accepts one: the model would store a comment for any question, and a key
  // the item does not advertise is a mistake the agent has to hear about. Never for a container:
  // there the suffix belongs to a field, one level down inside the object, so "contact-Comment"
  // names nothing.
  if (!owner || !!owner.container || !owner.item.comment) return undefined;
  return { entry: owner, isComment: true };
}

// A SurveyModel instance is used as is - a subclass is an instance too, and the interview reads and
// writes it through the public Question/SurveyModel surface only, so a subclass is transparent. A
// plain object is JSON and becomes a model with nothing else configured: the convenience form for a
// survey that needs no setup. Anything a developer wants set - locale, data, variables, providers,
// events - means building the model themselves and passing it.
export function createInterview(survey: SurveyModel | any, options?: IInterviewOptions): Promise<IInterview> {
  let model: SurveyModel;
  try {
    model = toSurveyModel(survey);
  } catch(error) {
    return Promise.reject(error);
  }
  const interview = new Interview(model, options);
  return interview.initialize().then(() => interview);
}

function toSurveyModel(survey: SurveyModel | any): SurveyModel {
  if (survey instanceof SurveyModel) {
    if (survey.isDisposed) throw createTypeError("the SurveyModel passed to it is disposed");
    return survey;
  }
  if (!!survey && typeof survey === "object" && !Array.isArray(survey)) {
    return new SurveyModel(survey);
  }
  throw createTypeError("it received " + describeArgument(survey));
}

function createTypeError(what: string): TypeError {
  return new TypeError("createInterview accepts a SurveyModel instance or a survey JSON object, and " +
    what + ". Parse JSON text with JSON.parse first, and build the model yourself when it needs a " +
    "locale, data, variables, providers or event handlers.");
}

function describeArgument(survey: any): string {
  if (survey === null) return "null";
  if (Array.isArray(survey)) return "an array";
  return "a value of type \"" + typeof survey + "\"";
}

// start() validates the start page and returns false when a required question on it is empty. Those
// questions are never items - getSingleElements() skips the start page - so the interview cannot ask
// them; the owner answers them or turns firstPageIsStartPage off before the hand-over. The model is
// left in the "starting" state.
function createStartPageError(survey: any): Error {
  const names = getStartPageErrorNames(survey);
  const error: any = new Error("The survey is showing its start page and start() refused to leave it" +
    (names.length > 0 ? ": " + names.join(", ") + " " + (names.length === 1 ? "has" : "have") + " an error" : "") +
    ". Questions of a start page are never asked by the interview. Answer them, or set " +
    "firstPageIsStartPage to false, before createInterview.");
  error.code = InterviewErrorCodes.startPageIncomplete;
  error.names = names;
  return error;
}

function getStartPageErrorNames(survey: any): Array<string> {
  const page = survey.startPage;
  if (!page) return [];
  return page.questions.filter((question: any) => question.errors.length > 0)
    .map((question: any) => question.name);
}

import { Helpers, SurveyModel } from "survey-core";
import { settle } from "./interview-async";
import { renderInterviewDocument } from "./render";
import {
  IInterview, IInterviewChanges, IInterviewCompleteResult, IInterviewDocument, IInterviewError,
  IInterviewItem, IInterviewOptions, IInterviewResult, IInterviewToolDefinition, IInterviewToolOptions,
} from "./interview-types";
import {
  IInterviewInput, getAnsweredValue, getInputErrors, getInterviewInputs, isAskableInput,
  isInputAnswered, isInputValid, makeInputCurrent, validateInput,
} from "./interview-items";
import {
  IInterviewBatchEntry, findBatchEntry, getBatchAddresses, getBatchEntries, getBatchItems,
  isBatchWritable, refreshBatchEntry,
} from "./interview-batch";
import { createAnswerSchema } from "./interview-schema";
import { InterviewToolNames, getToolBaseName, getToolDefinitions } from "./interview-tools";
import { InterviewSkipped, diffSnapshots, noChanges, takeSnapshot } from "./interview-state";
import {
  InterviewErrorCodes, badActionError, completionBlockedError, notAChoiceError, notANumberError,
  notAskableError, nothingToAnswerError, requiredCannotSkipError, surveyCompletedError,
  unknownQuestionError, unknownToolError,
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
    const written: { [address: string]: boolean } = {};
    resolved.writes.forEach(write => {
      const error = this.writeBatchValue(write, written);
      if (!!error) errors.push(error);
    });
    wereInvalid.forEach(input => {
      if (written[input.address] !== true && input.question.isVisibleInSurvey) input.question.validate(true);
    });
    // One settle for the whole batch: the asynchronous validators and expressions of every write
    // drain together instead of one call per key.
    await this.settleSurvey();
    const after = this.getInputs();
    this.makeCurrent(after);
    after.forEach(input => {
      if (written[input.address] !== true) return;
      getInputErrors(input).forEach(message => errors.push({ name: input.address, message: message }));
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
  }

  private async answerCore(name: string, value: any, hasName: boolean): Promise<IInterviewResult> {
    if (this.isCompleted()) return this.createErrorResult(surveyCompletedError(), []);
    const inputs = this.getInputs();
    const target = hasName ? this.findInput(inputs, name) : this.getCurrentInput(inputs);
    if (!target) {
      return this.createErrorResult(hasName
        ? unknownQuestionError(name, this.getAskableAddresses(inputs))
        : nothingToAnswerError(), inputs);
    }
    if (!isAskableInput(target)) {
      return this.createErrorResult(
        notAskableError(target.address, target.item.disabled ? "disabled" : "unsupported"), inputs);
    }
    const prepared = prepareValue(target, value);
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

  // One key of a batch, written against the state the earlier keys left behind. The item is
  // described again here rather than trusted from the resolution pass: an earlier write may have
  // hidden it, an enableIf may have turned it off, and choicesFromQuestion or choicesVisibleIf may
  // have moved the set the value is checked against.
  private writeBatchValue(write: IBatchWrite, written: { [address: string]: boolean }): IInterviewError {
    const address = write.entry.address;
    const fresh = refreshBatchEntry(write.entry);
    if (!fresh) return notAskableError(address, "hidden");
    if (!isBatchWritable(fresh)) {
      return notAskableError(address, fresh.item.disabled === true ? "disabled" : "hidden");
    }
    const question = fresh.input.question;
    if (write.hasValue) {
      const prepared = prepareValue(fresh.input, write.value);
      if (!!prepared.error) return prepared.error;
      question.value = prepared.value;
      if (prepared.hasComment) question.comment = prepared.comment;
    }
    if (write.hasComment) question.comment = write.comment;
    // An answer un-skips, exactly as in single mode.
    this.skipped.remove(address);
    written[address] = true;
    // Validated one key at a time, before the next write: an expression validator reads the data as
    // it is now, and running them all at the end would validate against a later state.
    question.validate(true);
    return undefined;
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
  }

  private getInputs(): Array<IInterviewInput> {
    return getInterviewInputs(this.surveyValue);
  }

  private findInput(inputs: Array<IInterviewInput>, name: string): IInterviewInput {
    return inputs.filter(input => input.address === name)[0];
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
    return inputs.filter(input => isAskableInput(input) &&
      (!this.isAnswered(input) || !isInputValid(input)))[0];
  }

  private getCurrentItem(inputs: Array<IInterviewInput>): IInterviewItem | null {
    const input = this.getCurrentInput(inputs);
    if (!input) return null;
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
      if (input.isSummary || this.skipped.has(input.address) || input.question.isEmpty()) return;
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
      // Filled in batch mode too, and there it is the loop condition: non-null while some askable
      // item is still unanswered or invalid. "No errors and nothing became visible" is not - an
      // agent that answers one of two required questions produces neither and is not done.
      current: isBatch === true ? this.getCurrentItem(inputs) : document.current,
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
  // the item does not advertise is a mistake the agent has to hear about.
  if (!owner || !owner.item.comment) return undefined;
  return { entry: owner, isComment: true };
}

interface IPreparedValue {
  value?: any;
  comment?: string;
  hasComment?: boolean;
  error?: IInterviewError;
}

// The checks the model cannot make. It accepts any value a caller assigns - what keeps a respondent
// from entering an impossible one is the UI, which offers a list of choices and a numeric field.
// A text consumer has neither, so the same three mistakes are caught here, each with a code the
// consumer can act on, and nothing is written when one of them fires. The tester's
// checkValueEnterable exists for the same reason.
function prepareValue(target: IInterviewInput, value: any): IPreparedValue {
  if (isActionValue(value)) {
    return { error: badActionError(target.address, value.action) };
  }
  const res: IPreparedValue = { value: value };
  if (!!target.item.comment && isCommentValue(value)) {
    res.value = value.value;
    res.comment = value.comment;
    res.hasComment = true;
  }
  // A voice consumer says "Dog" for a checkbox and means ["Dog"]. Wrapping is silent: there is no
  // other reading of a scalar for a question whose value is an array.
  if (target.item.valueType === "array" && res.value !== undefined && res.value !== null &&
    !Array.isArray(res.value)) {
    res.value = [res.value];
  }
  const choicesError = checkChoices(target, res.value);
  if (!!choicesError) return { error: choicesError };
  const numberError = checkNumber(target, res.value);
  if (!!numberError) return { error: numberError };
  return res;
}

function isActionValue(value: any): boolean {
  return isPlainObject(value) && typeof value.action === "string";
}

function isCommentValue(value: any): boolean {
  return isPlainObject(value) && value.value !== undefined && typeof value.comment === "string";
}

function isPlainObject(value: any): boolean {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

// Only when the set can be enumerated: choices that are still loading from a web service, or that a
// lazy-loading dropdown fetches page by page, are described as choicesUnknown and nothing is checked
// against them. "other" and "none" are choices like any other - they are in the described list.
function checkChoices(target: IInterviewInput, value: any): IInterviewError {
  const item = target.item;
  if (!item.choices || item.choicesUnknown || Helpers.isValueEmpty(value)) return undefined;
  const available = item.choices.map(choice => choice.value);
  const values: Array<any> = Array.isArray(value) ? value : [value];
  for (let i = 0; i < values.length; i++) {
    if (!available.some(choice => Helpers.isTwoValueEquals(choice, values[i]))) {
      return notAChoiceError(target.address, values[i], available);
    }
  }
  return undefined;
}

function checkNumber(target: IInterviewInput, value: any): IInterviewError {
  if (target.item.valueType !== "number" || typeof value !== "string" || value === "") return undefined;
  return Helpers.isNumber(value) ? undefined : notANumberError(target.address, value);
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

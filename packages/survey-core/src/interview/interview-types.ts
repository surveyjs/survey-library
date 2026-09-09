import type { SurveyModel } from "survey-core";
import type { IQuestionDescription } from "survey-core";

// The public surface of survey-core/interview. Everything the six tiers of issue #11818 add is
// declared here, so a later tier fills in behavior and never changes a shape a consumer already
// reads. Nothing the SurveyModel can express appears in the options (overview 2.6): data, locale,
// variables, providers and events are set on the model by its owner before it is handed over.
export interface IInterviewOptions {
  // milliseconds to wait for getRunningAsyncOperations() to drain; 0 = do not wait
  timeout?: number;
}

// An item the interviewee can be asked: one single input of the model's inputPerPage mode
// (overview 2.1). "name" is the address (overview 1); the description fields come from the core's
// question description layer; the rest is filled by tier 04 (plain questions) and tier 06 (nested
// inputs, summary steps).
export interface IInterviewItem extends IQuestionDescription {
  name: string;
  // nested input: the model's localized entry title ("Panel 2", "Row 1", a row name)
  entry?: string;
  // a dynamic container's summary step (tier 06)
  summary?: IInterviewSummary;
  // batch mode, a fixed-shape container: the inputs it holds, each described the way a question is,
  // under the name a key of the object carries. It replaces the describer's "items" in a batch
  // record; a single-mode record keeps "items" and never has "fields".
  fields?: Array<IInterviewItem>;
  // batch mode, a matrix dropdown: two levels, because its value has two - the row, then the fields
  // of that row.
  rows?: Array<IInterviewRow>;
  // batch mode, a dynamic container: the entries it holds now, one record per entry, in the order
  // the interviewee sees them.
  entries?: Array<IInterviewEntry>;
  // batch mode, a dynamic container: what a new entry takes - the template, described. A declaration
  // and not a live entry: an entry's own fields are the truth once it exists.
  template?: Array<IInterviewItem>;
  // batch mode, a dynamic container: whether another entry may be added right now
  canAdd?: boolean;
  // batch mode, a field of a container: the value it holds now, in the form answer() takes back
  // ({ value, comment } when a comment is set)
  value?: any;
  // batch mode, next to unsupported: "batch" says this version cannot fill the item and a later one
  // may - a dynamic panel, a matrix, a multiple text, a composite. No reason at all says nothing
  // ever will: a file to upload, a signature to draw.
  reason?: "batch";
  // single mode: the current item's first error text, if any
  error?: string;
}

// One row of a matrix dropdown in a batch document: the key of the first level of the object, the
// row's own localized text, and the cells (plus the questions of a detail panel the model has
// created) as fields.
export interface IInterviewRow {
  name: string;
  title: string;
  fields: Array<IInterviewItem>;
}

// One entry of a dynamic container in a batch document: its position - which is what a value of
// answerAll() addresses - whether it may be removed, and the questions the entry holds as fields.
export interface IInterviewEntry {
  index: number;
  canRemove: boolean;
  fields: Array<IInterviewItem>;
}

export interface IInterviewSummary {
  // one per entry the container holds now; absent when it holds none, and then noEntriesText says so
  entries?: Array<{ index: number, title: string, canRemove: boolean }>;
  canAdd: boolean;
  // the model's localized add-button text, when canAdd
  addText?: string;
  // the container's own localized "no entries yet" line, when it holds none
  noEntriesText?: string;
}

// What answer() accepts for a summary step, instead of a value.
export interface IInterviewAction {
  action: "add" | "remove" | "edit" | "done";
  // remove / edit
  index?: number;
}

export interface IInterviewError {
  name: string;
  message: string;
  // present only for errors the interview raises itself (tier 04 table)
  code?: string;
}

export interface IInterviewChanges {
  becameVisible: Array<string>;
  becameHidden: Array<string>;
  becameRequired: Array<string>;
}

export interface IInterviewResult extends IInterviewChanges {
  errors: Array<IInterviewError>;
  current: IInterviewItem | null;
  describe: string;
}

export interface IInterviewCompleteResult {
  completed: boolean;
  errors: Array<IInterviewError>;
  data: any;
  completedHtml: string;
}

// The plain object every describe()/describeAll() renders (tier 03 defines the text form), and the
// object getSingleDocument()/getBatchDocument() hand a host that wants the same state as data. It
// holds nothing but strings, numbers, booleans, plain objects and arrays - no model object, no
// function, no cycle - so JSON.stringify() on it is the JSON representation of the very document the
// YAML was rendered from. tests/interview/interviewJsonTests.ts pins that.
export interface IInterviewDocument {
  title: string;
  progress: { answered: number, remainingRequired: number };
  answered?: { [address: string]: any };
  changes?: Partial<IInterviewChanges>;
  errors?: Array<IInterviewError>;
  // single mode
  current?: IInterviewItem | null;
  // batch mode
  items?: Array<IInterviewItem>;
}

export interface IInterview {
  readonly survey: SurveyModel;
  readonly data: any;
  current(): IInterviewItem | null;
  describe(): string;
  getSingleDocument(): IInterviewDocument;
  answer(value: any): Promise<IInterviewResult>;
  answer(name: string, value: any): Promise<IInterviewResult>;
  skip(): Promise<IInterviewResult>;
  complete(): Promise<IInterviewCompleteResult>;
  describeAll(): string;
  getBatchDocument(): IInterviewDocument;
  answerAll(values: { [address: string]: any }): Promise<IInterviewResult>;
  getAnswerSchema(): any;
  getTools(options?: IInterviewToolOptions): Array<IInterviewToolDefinition>;
  callTool(name: string, args: any): Promise<any>;
  dispose(): void;
}

export interface IInterviewToolOptions {
  // prepended to every tool name, so that one server can expose several surveys through one set of
  // tools; callTool() takes the prefixed name back
  prefix?: string;
}

export interface IInterviewToolDefinition {
  name: string;
  description: string;
  // JSON Schema object; MCP shape, usable for function calling as-is
  inputSchema: any;
}

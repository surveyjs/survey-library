import { EventBase, SurveyModel } from "survey-core";
import { IPresencePeer } from "../presence/presence-envelope";
import { decodeValueKey } from "../data/value-record";
import { describeValue, IHistoryEntry } from "./history-entry";

export interface IHistoryOptions {
  // How many entries a session keeps. Oldest first out.
  historyLimit?: number;
  // Consecutive edits of one question by one author within this window collapse.
  historyMergeMs?: number;
}

export const DEFAULT_HISTORY_LIMIT = 200;
export const DEFAULT_HISTORY_MERGE_MS = 1500;

// Who changed what, for the lifetime of one connection.
//
// Deliberately NOT a persisted log and NOT a relayed one: the server keeps a snapshot
// map, `init` replaces the local state wholesale, and neither carries authorship. So
// the history starts empty on every `init` and describes only what this participant
// has WITNESSED - which is the honest scope, and the one that costs nothing on the
// wire (the attribution rides on `from`, a field the relay already stamps).
//
// It owns no DOM and no transport: the plugin feeds it and the bar reads `entries`.
export class HistoryController {
  public onChanged: EventBase<HistoryController, { entries: ReadonlyArray<IHistoryEntry> }> =
    new EventBase<HistoryController, { entries: ReadonlyArray<IHistoryEntry> }>();

  private list: Array<IHistoryEntry> = [];
  private nextId = 1;
  private disposed = false;

  constructor(private survey: SurveyModel, private options: IHistoryOptions = {}) {}

  public get entries(): ReadonlyArray<IHistoryEntry> {
    return this.list;
  }

  // `author` is null for our own edit. An author we cannot resolve is a peer with an
  // empty name and slot 0, never null: "someone else" and "you" must not collapse.
  public record(author: IPresencePeer | null, key: string, value: any): void {
    if (this.disposed || typeof key !== "string") return;
    const decoded = decodeValueKey(key);
    const question = this.survey.getQuestionByValueName(decoded.name);
    // The wire key carries a valueName; everything that points AT the question - the
    // overlay mark, the scroll on click - addresses it by name.
    const questionName = (!!question && question.name) || decoded.name;
    const text = describeValue(question, value, decoded.isComment);
    const clientId = !!author ? author.clientId : null;
    const at = Date.now();

    // Typing is one onValueChanged per keystroke when textUpdateMode is "onTyping",
    // so without this a single sentence would be a page of history. Only the tail is
    // merged, which keeps the list chronological.
    const last = this.list[this.list.length - 1];
    if (!!last && last.clientId === clientId && last.questionName === questionName &&
      last.isComment === decoded.isComment && at - last.at <= this.mergeMs) {
      last.at = at;
      last.text = text;
      this.changed();
      return;
    }

    this.list.push({
      id: this.nextId++,
      at,
      clientId,
      name: !!author ? author.name : "",
      colorIndex: !!author ? author.colorIndex : 0,
      questionName,
      isComment: decoded.isComment,
      title: (!!question && question.title) || questionName,
      text,
    });
    // A session can run for hours. An unbounded log is exactly what the protocol
    // refused when it chose a snapshot map over an append-only one.
    if (this.list.length > this.limit)this.list.splice(0, this.list.length - this.limit);
    this.changed();
  }

  // Every `init` is authoritative and replaces the whole state, so entries recorded
  // before it describe a state that no longer exists.
  public clear(): void {
    if (this.list.length === 0) return;
    this.list = [];
    this.changed();
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.list = [];
  }

  private get limit(): number {
    return this.options.historyLimit ?? DEFAULT_HISTORY_LIMIT;
  }

  private get mergeMs(): number {
    return this.options.historyMergeMs ?? DEFAULT_HISTORY_MERGE_MS;
  }

  private changed(): void {
    this.onChanged.fire(this, { entries: this.list });
  }
}

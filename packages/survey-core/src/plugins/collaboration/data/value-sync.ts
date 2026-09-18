import { EventBase, Question, SurveyModel } from "survey-core";
import { IInitMessage, IValueMessage } from "../collab-messages";
import { decodeValueKey, encodeValueKey, MAX_VALUE_CHARS } from "./value-record";
import { normalizeOutgoingValue, syncMatrixRowCount } from "./value-normalize";
import { commitFocusedEditor } from "./editor-commit";

export interface IValueSyncOptions {
  maxValueChars?: number;
  // Raised when a value is refused for being too large, so the host can word the
  // message. Default: an English sentence put on the question as an error.
  onValueTooLarge?: (question: Question | null, key: string) => void;
}

// Answer synchronisation: local edits out, peer edits in.
//
// Convergence is last write wins per key, on a single ordered stream. There is no CRDT
// and no operational transform: for filling a form the collaborative state IS a flat
// key -> value map, and a per-key register is exactly what that needs.
export class ValueSyncController {
  public onMessage: EventBase<ValueSyncController, { message: IValueMessage }> = new EventBase<ValueSyncController, { message: IValueMessage }>();

  // The question name currently being applied from a peer, if any.
  private applyingName: string | null = null;
  // Set while a whole authoritative state is being adopted: nothing is emitted at all.
  private loading = false;
  private detachHandlers: Array<() => void> = [];

  constructor(private survey: SurveyModel, private options: IValueSyncOptions = {}) {
    const onLocalChange = (_sender: SurveyModel, options: { name: string, value: any }) => {
      this.emitName(options.name, options.value);
    };
    // Adding or removing an EMPTY matrixdynamic row changes only rowCount - no value is
    // written and onValueChanged stays silent - so the row events are synced too. Both
    // fire AFTER rowCount is updated, so the pad below yields an array of the new length.
    // A non-empty row also writes the value, producing a second identical emit; harmless
    // (last write wins, and the same-value setValue on peers is a no-op), so no dedup.
    const onRowsChanged = (_sender: SurveyModel, options: { question: Question }) => {
      const name = options.question.getValueName();
      this.emitName(name, this.survey.getValue(name));
    };
    survey.onValueChanged.add(onLocalChange);
    survey.onMatrixRowAdded.add(onRowsChanged);
    survey.onMatrixRowRemoved.add(onRowsChanged);
    this.detachHandlers.push(() => {
      survey.onValueChanged.remove(onLocalChange);
      survey.onMatrixRowAdded.remove(onRowsChanged);
      survey.onMatrixRowRemoved.remove(onRowsChanged);
    });
  }

  public get isApplying(): boolean {
    return this.applyingName !== null || this.loading;
  }

  // A peer changed one value.
  //
  // The echo guard is the question NAME being applied, not a blanket "a remote change is
  // in flight" flag. survey-core routinely writes OTHER questions as a consequence of the
  // one being applied (clearIncorrectValues, triggers, clearInvisibleValues), and those
  // are genuine local changes the peers have to hear about: suppressing them too would
  // leave every client to re-derive the cascade on its own, and to diverge in silence
  // when it cannot.
  public applyValue(message: IValueMessage): void {
    if (!message || typeof message.key !== "string") return;
    const decoded = decodeValueKey(message.key);
    // Before the guard is armed, so the rescued text goes out as the local edit it is.
    commitFocusedEditor(this.survey);
    this.applyingName = decoded.name;
    try {
      if (decoded.isComment) {
        this.survey.setComment(decoded.name, message.value);
      } else {
        this.survey.setValue(decoded.name, message.value);
        syncMatrixRowCount(this.survey, decoded.name, message.value);
      }
    } finally {
      this.applyingName = null;
    }
  }

  // The authoritative full state. Emits NOTHING, and erases keys the state does not
  // contain - it is a replacement, not a merge.
  //
  // Suppression is wholesale rather than per key on purpose: applying values one by one
  // would let the cascade of the first value (clearInvisibleValues, triggers) travel to
  // the peers as an "edit" before the second value had even been applied.
  public applyState(message: IInitMessage): void {
    const values = message && message.values;
    this.loading = true;
    try {
      // One assignment rather than setValue/setComment per key: survey.data clears the
      // whole values hash first, which is exactly the "replace, do not merge" semantics,
      // and it leaves no intermediate state for a re-render to catch.
      const suffix = this.survey.commentSuffix;
      const data: any = {};
      if (!!values) {
        Object.keys(values).forEach((key) => {
          const decoded = decodeValueKey(key);
          data[decoded.isComment ? decoded.name + suffix : decoded.name] = values[key];
        });
      }
      this.survey.data = data;
    } finally {
      this.loading = false;
    }
  }

  // The whole current state in the shape init.values carries. Not sugar over
  // survey.data: comments there are keyed by the LOCAL survey.commentSuffix, and the wire
  // needs the protocol one.
  public getState(): { [key: string]: any } {
    const data = this.survey.data || {};
    const suffix = this.survey.commentSuffix;
    const res: { [key: string]: any } = {};
    Object.keys(data).forEach((key) => {
      if (!!suffix && key.length > suffix.length && key.substring(key.length - suffix.length) === suffix) {
        res[encodeValueKey(key.substring(0, key.length - suffix.length), true)] = data[key];
      } else {
        res[key] = data[key];
      }
    });
    return res;
  }

  public dispose(): void {
    this.detachHandlers.forEach((detach) => detach());
    this.detachHandlers = [];
  }

  private emitName(name: string, value: any): void {
    if (this.loading) return;
    const suffix = this.survey.commentSuffix;
    const isComment = !!suffix && name.length > suffix.length &&
      name.substring(name.length - suffix.length) === suffix;
    const baseName = isComment ? name.substring(0, name.length - suffix.length) : name;
    if (baseName === this.applyingName) return;
    const outgoing = isComment ? value : normalizeOutgoingValue(this.survey, baseName, value);
    this.emit(encodeValueKey(baseName, isComment), outgoing);
  }

  private emit(key: string, value: any): void {
    const serialized = JSON.stringify(value);
    const limit = this.options.maxValueChars || MAX_VALUE_CHARS;
    if (serialized !== undefined && serialized.length > limit) {
      const decoded = decodeValueKey(key);
      const question = this.survey.getQuestionByValueName(decoded.name);
      if (!!this.options.onValueTooLarge) {
        this.options.onValueTooLarge(question, key);
      } else if (!!question) {
        question.addError("This answer is too large to share with the other participants.");
      }
      return;
    }
    this.onMessage.fire(this, { message: { type: "value", key: key, value: value } });
  }
}

import { EventBase, Question, QuestionMatrixDynamicModel, settings, SurveyModel } from "survey-core";
import { IInitMessage, IValueMessage } from "../collab-messages";
import { decodeSurveyName, decodeValueKey, encodeValueKey, IDecodedKey } from "./value-record";
import { normalizeOutgoingValue, syncMatrixRowCount, withNestedMatrixRows } from "./value-normalize";
import { commitFocusedEditor, ICommittedEditor, writeEditorText } from "./editor-commit";

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

  constructor(private survey: SurveyModel) {
    const onLocalChange = (_sender: SurveyModel, options: { name: string, value: any }) => {
      this.emitName(options.name, options.value);
    };
    // Adding or removing an EMPTY matrixdynamic row changes only rowCount - no value is
    // written and onValueChanged stays silent - so the row events are synced too. Both
    // fire AFTER rowCount is updated, so the pad below yields an array of the new length.
    // A non-empty row also writes the value, producing a second identical emit; harmless
    // (last write wins, and the same-value setValue on peers is a no-op), so no dedup.
    // The event carries the matrix itself, which inside a composite is NOT a key of
    // survey.data: its rows live in the composite's object. Emitting its own value name
    // would put a phantom top-level key on the wire and leave the row unshared, so the
    // owner of the key is what gets emitted - and the new row is padded into its object,
    // because an empty row writes no value to pad.
    const onRowsChanged = (_sender: SurveyModel, options: { question: Question }) => {
      const matrix = options.question;
      const owner = matrix.rootParentQuestion;
      const name = owner.getValueName();
      // Silence rather than a phantom key: a container that does not reach survey.data
      // under this name (a single-question custom type nests its content WITHOUT a
      // parentQuestion, so the climb stops short) would otherwise put a key nobody can
      // interpret into the room, and it would outlive the session in the stored state.
      if (this.survey.getQuestionByValueName(name) !== owner) return;
      const value = this.survey.getValue(name);
      this.emitName(name, owner === matrix ? value : withNestedMatrixRows(value, matrix as QuestionMatrixDynamicModel));
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
    const rescued = commitFocusedEditor(this.survey);
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
    // A composite travels as ONE object under one key, so a peer editing any other field
    // of it replaces the field being typed in as well - the rescue above would be undone
    // and the text lost on the very client that authored it. Putting it back keeps the
    // caret's own field with the typist and everything else with the peer.
    //
    // Outside the guard on purpose: the peers have just been told the composite has no
    // such text, so this has to reach them as the local edit it is.
    if (this.isSilentlyOverwritten(rescued, decoded, message.value)) {
      writeEditorText(rescued as ICommittedEditor);
    }
  }

  // Did applying the peer's value wipe the field under the caret WITHOUT the peer saying
  // anything about it?
  //
  // Only a composite can do that: its whole object rides one key, so a peer answering any
  // other field of it arrives carrying nothing for this one. A question whose own key was
  // answered is a plain conflict, and there the peer still wins exactly as before - which
  // is also what keeps two people typing in one field from bouncing a value between them
  // for ever, each restoring their own text on every message.
  private isSilentlyOverwritten(rescued: ICommittedEditor | null, decoded: IDecodedKey, value: any): boolean {
    if (!rescued || rescued.topName !== decoded.name) return false;
    if (rescued.question === rescued.top || rescued.question.isDisposed) return false;
    if (!value || typeof value !== "object" || Array.isArray(value)) return false;
    const suffix = rescued.field === "comment" ? settings.commentSuffix : "";
    return !(rescued.question.getValueName() + suffix in value);
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
      const decoded = decodeSurveyName(key, suffix);
      res[encodeValueKey(decoded.name, decoded.isComment)] = data[key];
    });
    return res;
  }

  public dispose(): void {
    this.detachHandlers.forEach((detach) => detach());
    this.detachHandlers = [];
  }

  private emitName(name: string, value: any): void {
    if (this.loading) return;
    const decoded = decodeSurveyName(name, this.survey.commentSuffix);
    if (decoded.name === this.applyingName) return;
    const outgoing = decoded.isComment ? value : normalizeOutgoingValue(this.survey, decoded.name, value);
    this.emit(encodeValueKey(decoded.name, decoded.isComment), outgoing);
  }

  // No size limit here: the relay knows its own frame limit and enforces it.
  private emit(key: string, value: any): void {
    this.onMessage.fire(this, { message: { type: "value", key: key, value: value } });
  }
}

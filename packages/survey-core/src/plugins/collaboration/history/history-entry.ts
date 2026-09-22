import { Question } from "survey-core";
import { getCollabString } from "../collaboration-strings";

// One recorded edit, as the history keeps it.
//
// Identity is a SNAPSHOT, not a reference into the roster: a peer is dropped from the
// roster the moment they leave (PresenceRoster.removePeer), and "Ann changed Budget"
// has to stay readable after Ann has gone. It is the same reason identity travels in
// the presence envelope rather than inside the state.
export interface IHistoryEntry {
  // Monotonic within a session; the list key, and what makes two edits of the same
  // question at the same millisecond distinguishable.
  id: number;
  at: number;
  // null means this participant. The plugin never learns its own client id - `init`
  // carries one but only the host reads it - and does not need to: "you" is not a
  // name, and the bar has never painted the local participant either.
  clientId: string | null;
  // "" when the author is not in the roster: a relay that stamps no `from`, a peer
  // with presence switched off, or a value that outran its sender's first presence.
  name: string;
  // 0 is the theme's reserved "unknown user" grey, which is exactly what an author
  // we cannot resolve should be painted.
  colorIndex: number;
  questionName: string;
  isComment: boolean;
  // The question title as it read when the edit landed, so a log entry keeps making
  // sense after a title expression re-evaluates.
  title: string;
  text: string;
}

// A history entry holds a DESCRIPTION of the value, never the value.
//
// A file question's answer is its own content when storeDataAsText is on - up to
// MAX_VALUE_CHARS (16 MiB) of base64 - and a session-long log of those would be a
// memory leak with a UI on top.
export const MAX_HISTORY_TEXT = 80;

function truncate(text: string): string {
  if (text.length <= MAX_HISTORY_TEXT) return text;
  return text.substring(0, MAX_HISTORY_TEXT - 1) + "\u2026";
}

function isEmptyValue(value: any): boolean {
  if (value === undefined || value === null || value === "") return true;
  return Array.isArray(value) && value.length === 0;
}

export function describeValue(question: Question | null, value: any, isComment: boolean): string {
  if (isEmptyValue(value)) return getCollabString("collabHistoryCleared");
  if (isComment) return truncate(String(value));
  if (!!question) {
    // Names only. See MAX_HISTORY_TEXT.
    if (question.getType() === "file") {
      const files: Array<any> = Array.isArray(value) ? value : [value];
      return truncate(files.map((file) => (!!file && file.name) || "?").join(", "));
    }
    // What the participant sees rather than what travels: a choice reads as its text,
    // not as its value.
    const display = question.displayValue;
    if (!isEmptyValue(display)) return truncate(String(display));
  }
  const serialized = JSON.stringify(value);
  return truncate(serialized === undefined ? String(value) : serialized);
}

// Who to put in front of an entry. Resolved here rather than in the bar so that a
// host rendering its own list words it the same way.
export function historyAuthorLabel(entry: IHistoryEntry): string {
  if (entry.clientId === null) return getCollabString("collabHistoryYou");
  return entry.name || getCollabString("collabHistoryUnknown");
}

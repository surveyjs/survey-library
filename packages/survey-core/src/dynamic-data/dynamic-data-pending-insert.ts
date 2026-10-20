/* An insert a keyed source has not answered yet, and how its answer merges with the record the client
   kept writing meanwhile. The channel registers and settles the entries; the list merges them into the
   window and into the updates queued behind them. */

/* Keyed source only: an insert that has not answered yet. record is the window object of the new
   record - what the answer is matched by, re-pointed by every write (see repointPendingInsert).
   clientFields are the fields the client owns: the ones the insert sent and every one a write
   changed since, deleted fields included. The answer's other fields are the ones the server filled
   in.
   The entry is also the record's identity until the key is known: a write made to the record while
   the insert is in flight is queued with the entry and reads key when it runs, which the chain
   orders after the insert has settled (applyInsertAnswer). keyField is the field of the source the
   insert was sent to - the list's own getter follows whatever source it holds by then. */
export interface IPendingInsert {
  record: any;
  clientFields: Array<string>;
  keyField: string;
  key: any;
  answer: any;
  isSettled: boolean;
}
/* The client owns the fields it sent or changed while the insert was in flight, the server owns
   the rest, and the key belongs to the server. So the answer contributes only the fields outside
   clientFields - a field the client cleared is missing from its record and must stay missing, not
   come back as the value the insert sent - and its key is applied last, over anything the client
   record holds in the key field: that is the one field the client never overrules. The window
   merge and the payload of an update queued behind the insert are both made here, so that they
   cannot drift apart. clientFields is the ownership the client record goes with: the window merge
   takes everything the client has owned so far (the entry's), a queued update the fields owned
   when it was made (getOwnedFields). Called only once the entry has the key (and the answer). */
export function mergeInsertAnswer(entry: IPendingInsert, clientRecord: any, clientFields: Array<string> = entry.clientFields): any {
  const res: any = {};
  const answer = entry.answer;
  Object.keys(answer).forEach((field: string): void => {
    if (clientFields.indexOf(field) < 0) res[field] = answer[field];
  });
  Object.assign(res, clientRecord);
  res[entry.keyField] = entry.key;
  return res;
}
/* The fields the client owns as of the write being made, taken right after it reached the window.
   A later write widens entry.clientFields, and must not change what an earlier queued update
   sends: that update's snapshot does not hold the later field, so the wider set would drop the
   server's value of it from the payload - blanking a server-filled field until the later update
   lands, and for good when that one fails. */
export function getOwnedFields(pending: IPendingInsert): Array<string> {
  return !!pending ? pending.clientFields.slice() : undefined;
}
/* The record an update sends. A write that resolved its key normally sends the record as it is.
   One queued behind the insert of its record sends it merged with the insert's answer: a
   whole-record update of the snapshot alone would blank the fields the server filled in, and it
   would carry no key. Called when the update runs, so the answer is known. */
export function getUpdatePayload(pending: IPendingInsert, record: any, ownedFields: Array<string>): any {
  return !!pending ? mergeInsertAnswer(pending, record, ownedFields) : record;
}

// The sentence fragments several rules build the same way. A message is prose, not API - what
// a host localizes on is the (ruleId, reason) pair and messageData - but a defect of one kind
// should read the same however many rules can find it.

// The typo advice, with the fallback a rule gives when nothing is close enough to suggest.
export function didYouMean(suggestion?: string, fallback?: string): string {
  if (suggestion) return " Did you mean \"" + suggestion + "\"?";
  return fallback ? " " + fallback : "";
}

// A value as a message names it. JSON form, so that the type stays visible: the string "5"
// and the number 5 are different answers to "which values can this hold", and a message that
// prints both as 5 hides the very defect the reader is looking for.
export function quoteValue(value: any): string {
  const res = JSON.stringify(value);
  // JSON.stringify answers undefined for undefined and for a function
  return res === undefined ? String(value) : res;
}

export function quoteValues(values: Array<any>): string {
  return values.map(quoteValue).join(", ");
}

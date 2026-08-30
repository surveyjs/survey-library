import { ElementRecord, ParsedRef, SurveyIndex } from "./symbols";
import { getSpecialChoiceValues } from "./value-types";

// The set of values a reference can hold, when the JSON pins it down completely.
export interface ValueSetDomain {
  kind: "set";
  record: ElementRecord;
  // every value the runtime can produce, special items included
  values: Array<any>;
  // what the author actually listed, for the "Available: ..." part of a message
  listed: Array<any>;
}

export type ValueDomain = ValueSetDomain;

// Undefined whenever the set is not exhaustive - a value may then come from anywhere and
// nothing can be concluded from a value being absent.
export function getValueDomain(ref: ParsedRef, index: SurveyIndex): ValueDomain | undefined {
  const record = ref.resolvedTo;
  if (!record || record.isUnknownType) return undefined;
  // subpath references ({q.item1}) compare against the sub-element, which we do not model
  if (ref.status === "resolved" && ref.segments.length > 1) return undefined;
  const info = record.choicesInfo;
  if (!info) return undefined;
  if (info.hasChoicesByUrl || info.lazy || info.carryForwardFrom ||
    info.carryForwardValuesFrom || info.staticValues.length === 0) return undefined;
  return {
    kind: "set",
    record: record,
    values: info.staticValues.concat(getSpecialChoiceValues(info, index.settings)),
    listed: info.staticValues,
  };
}

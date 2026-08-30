// Public API surface shared by every converter.
//
// Individual converters are reached through their subpath exports so a consumer
// pulls in only what they use:
//   import { convert } from "survey-converter/formio";
//   import { convert } from "survey-converter/json-schema";
//
// This root entry re-exports the shared report contract and error types.

export {
  REPORT_VERSION,
  REPORT_BUCKETS,
  ReportBuilder,
  formatReport,
  bucketCount,
  shouldFail
} from "./report";
export type {
  ReportBucket,
  ReportEntry,
  ConversionReport,
  ConversionResult
} from "./report";

export { ConverterError, UnparseableInputError, WrongFormatError } from "./errors";

export type {
  SurveyJSON,
  SurveyJSONPage,
  SurveyJSONPanel,
  SurveyJSONElement
} from "./types";

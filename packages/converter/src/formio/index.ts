// Form.io -> SurveyJS converter.
//
// Status: SCAFFOLD. Format detection, the report plumbing, and the settled
// mechanical mappings are here. The full component-tree walk is built by the
// work described in `promts/01-formio.md` - search for `PROMPT 01` markers.
//
// Form.io has no published JSON Schema of its form definition; the shape is the
// TypeScript types in `@formio/core`. We vendor a snapshot under
// `src/formio/vendor/` and diff it on a schedule (see `promts/03-eval-corpus.md`).

import { ConversionResult, ReportBuilder } from "../report";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { SurveyJSON } from "../types";
import { FormioCodes } from "./codes";

const SOURCE = "formio";

/** The subset of a Form.io form we rely on for detection. Structural only. */
interface FormioForm {
  display?: string; // "form" | "wizard" | "pdf"
  components?: FormioComponent[];
  [key: string]: unknown;
}

interface FormioComponent {
  type?: string;
  key?: string;
  components?: FormioComponent[]; // container/panel children
  columns?: unknown[]; // layout
  [key: string]: unknown;
}

/**
 * Recognize a Form.io form definition. A Form.io form is an object with a
 * `components` array; wizards additionally have `display: "wizard"`. We use
 * this to reject wrong-format input loudly (a JSON Schema, a SurveyJS JSON)
 * before attempting any conversion.
 */
function assertFormioForm(input: unknown): asserts input is FormioForm {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new UnparseableInputError("Form.io input must be a JSON object.");
  }
  const form = input as FormioForm;
  if (!Array.isArray(form.components)) {
    // A JSON Schema has `properties`; a SurveyJS survey has `pages`/`elements`.
    // Neither has a top-level `components` array - steer the caller.
    throw new WrongFormatError(
      "Input does not look like a Form.io form (missing top-level `components` array). " +
        "If this is a JSON Schema, use survey-converter/json-schema."
    );
  }
}

/**
 * Convert a Form.io form definition to SurveyJS survey JSON.
 *
 * Never throws on an unsupported construct - those are recorded in the report.
 * Throws `UnparseableInputError` / `WrongFormatError` only for input that is
 * not a Form.io form at all.
 */
export function convert(input: unknown): ConversionResult<SurveyJSON> {
  assertFormioForm(input);
  const report = new ReportBuilder(SOURCE);

  // PROMPT 01: walk `input.components`, mapping each component to a SurveyJS
  // element. Settled decisions to honor (see promts/01-formio.md):
  //   - `conditional`            -> `visibleIf`               (mechanical)
  //   - `customConditional`      -> report UNSUPPORTED via FormioCodes.CUSTOM_CONDITIONAL,
  //                                 path + count only, never the JS source.
  //   - `validate.custom`        -> report FormioCodes.CUSTOM_VALIDATION, likewise.
  //   - data grid                -> dynamic panel (matrixdynamic?) - decide + document.
  //   - wizard pages             -> `pages`; a plain form -> a single page.
  //   - unknown component type   -> FormioCodes.UNKNOWN_COMPONENT (drift alarm).
  const output: SurveyJSON = {
    pages: []
  };

  return { output, report: report.build() };
}

export { FormioCodes } from "./codes";
export type { ConversionResult } from "../report";

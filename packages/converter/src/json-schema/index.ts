// JSON Schema (family) -> SurveyJS converter.
//
// Status: SCAFFOLD. Full walk is built by `promts/02-json-schema.md`
// (search `PROMPT 02`).
//
// The data schema is JSON Schema and is common across the family. Presentation
// diverges and is layered on top of the same data walk:
//   - JSONForms UI Schema  -> highest fidelity, do first
//   - RJSF `uiSchema`      -> widget hints / ordering, partial
//   - Uniforms             -> no layout data; flat form from the data schema only
//
// "Free via JSON Schema" cases (OpenAPI 3.1 request bodies, Zod/Yup/TypeBox
// bridges, ngx-formly JSON Schema mode, ...) are documentation only - anything
// that emits JSON Schema already converts here. See promts/04-docs-*.

import { ConversionResult, ReportBuilder } from "../report";
import { UnparseableInputError, WrongFormatError } from "../errors";
import { SurveyJSON } from "../types";
import { JsonSchemaCodes } from "./codes";

const SOURCE = "json-schema";

interface JsonSchemaDoc {
  type?: string | string[];
  properties?: Record<string, unknown>;
  $ref?: string;
  allOf?: unknown[];
  oneOf?: unknown[];
  anyOf?: unknown[];
  [key: string]: unknown;
}

/** Optional presentation layer paired with the data schema. */
export interface JsonSchemaInput {
  /** The JSON Schema data document (required). */
  schema: JsonSchemaDoc;
  /** JSONForms UI Schema, RJSF uiSchema, etc. Optional; flat form without it. */
  uiSchema?: unknown;
}

function isSchemaLike(value: unknown): value is JsonSchemaDoc {
  if (value === null || typeof value !== "object" || Array.isArray(value)) return false;
  const s = value as JsonSchemaDoc;
  // A JSON Schema object schema declares `properties`, or `type`, or a
  // composition keyword. Enough to reject a Form.io form (`components`) or a
  // SurveyJS survey (`pages`).
  return (
    typeof s.properties === "object" ||
    typeof s.type === "string" ||
    Array.isArray(s.type) ||
    Array.isArray(s.allOf) ||
    Array.isArray(s.oneOf) ||
    Array.isArray(s.anyOf) ||
    typeof s.$ref === "string"
  );
}

function normalizeInput(input: unknown): JsonSchemaInput {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new UnparseableInputError("JSON Schema input must be a JSON object.");
  }
  // Accept either a bare schema or a { schema, uiSchema } envelope.
  const maybeEnvelope = input as JsonSchemaInput;
  const schema = isSchemaLike(maybeEnvelope.schema) ? maybeEnvelope.schema : (input as JsonSchemaDoc);
  if (!isSchemaLike(schema)) {
    throw new WrongFormatError(
      "Input does not look like a JSON Schema (no `properties`, `type`, or composition keyword). " +
        "If this is a Form.io form, use survey-converter/formio."
    );
  }
  return {
    schema,
    uiSchema: isSchemaLike(maybeEnvelope.schema) ? maybeEnvelope.uiSchema : undefined
  };
}

/**
 * Convert a JSON Schema (optionally with a UI schema) to SurveyJS survey JSON.
 *
 * Never throws on an unsupported keyword - those are recorded in the report.
 * Throws only for input that is not a JSON Schema at all.
 */
export function convert(input: unknown): ConversionResult<SurveyJSON> {
  const { schema, uiSchema } = normalizeInput(input);
  const report = new ReportBuilder(SOURCE);

  // PROMPT 02: walk `schema.properties` into questions; layer `uiSchema` for
  // widget/order/layout. Decided-and-documented modelling (see the doc header
  // in promts/02-json-schema.md):
  //   - if/then/else            -> visibleIf on <question|panel|page> (document which)
  //   - oneOf + discriminator   -> dynamic panel or page (decide)
  //   - dependencies            -> ?
  //   - allOf                   -> merge semantics
  //   - remote $ref             -> DROPPED_REMOTE_REF (client-side, out of scope)
  void uiSchema;
  void schema;

  const output: SurveyJSON = {
    elements: []
  };

  return { output, report: report.build() };
}

export { JsonSchemaCodes } from "./codes";
export type { ConversionResult } from "../report";

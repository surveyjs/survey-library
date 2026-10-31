// The conversion oracle.
//
// The authoritative acceptance test for every converter is not "does the output
// match a golden JSON" -- it is "does the output construct a survey-core
// `SurveyModel` with ZERO errors AND does that model actually materialize every
// element the converter emitted". survey-core is the only thing that knows what
// valid SurveyJS JSON is, so we use it as the oracle. It is imported ONLY from
// test code (this helper and the `*.spec.ts` files); the shipped library keeps
// zero runtime dependencies. This directory is excluded from the build
// (`tsconfig.build.json`) so survey-core never enters the published typings.
//
// Shared by the hand fixtures (`src/<converter>/*.spec.ts`) and the scraped
// corpus specs (step 03) so both hold the output to the same bar.

import { SurveyModel } from "survey-core";
import { expect } from "vitest";

// Container arrays a SurveyJS element tree can nest children under. Walking these
// lets us enumerate every declared element (top-level, panels, and the template
// of dynamic panels/matrices) by (type, name).
const CONTAINER_KEYS = ["pages", "elements", "templateElements", "rows"] as const;

/**
 * Collect the `name` of every element node (an object carrying BOTH a string
 * `type` and a string `name`) reachable in a SurveyJS JSON tree, depth-first.
 * Used on both the converter output (what we asked survey-core to build) and on
 * `survey.toJSON()` (what survey-core actually built) to compare the two.
 */
export function collectElementNames(node: unknown, acc: string[] = []): string[] {
  if (!node || typeof node !== "object") return acc;
  const obj = node as Record<string, unknown>;
  if (typeof obj.type === "string" && typeof obj.name === "string") acc.push(obj.name);
  for (const key of CONTAINER_KEYS) {
    const arr = obj[key];
    if (Array.isArray(arr)) for (const child of arr) collectElementNames(child, acc);
  }
  return acc;
}

/**
 * Assert that `surveyJson`:
 *
 *   1. constructs a survey-core `SurveyModel` with no schema errors.
 *      `survey.jsonErrors` is `null` (or empty) on clean input and an array of
 *      `{ type, message, ... }` when SurveyJS rejects a construct (e.g. an
 *      unknown or missing question `type`, an unknown property). Failures
 *      surface the offending error messages.
 *
 *   2. materializes every element the converter emitted. A construct can pass
 *      (1) yet be silently dropped by survey-core with NO error -- an empty
 *      `{ pages: [] }` reports zero errors and zero questions, and a malformed
 *      element can vanish without an error too. `survey.toJSON()` reflects ONLY
 *      what the model actually built, so any name present in the converter
 *      output but absent from the round-trip was dropped: the JSON loaded, but
 *      it did not create the needed elements. That is a converter bug, and this
 *      is where it is caught.
 *
 * Returns the constructed `SurveyModel` so callers can make further assertions
 * (e.g. a non-empty check keyed on the source's input field count).
 */
export function assertConstructsCleanly(surveyJson: unknown, label = "survey"): SurveyModel {
  const survey = new SurveyModel(surveyJson as object);

  const errors = survey.jsonErrors ?? [];
  const messages = errors.map((e) => `${(e as { type?: string }).type ?? "error"}: ${(e as { message?: string }).message ?? ""}`);
  expect(errors.length, `${label} produced survey-core jsonErrors:\n  ${messages.join("\n  ")}`).toBe(0);

  const declared = collectElementNames(surveyJson);
  const materialized = new Set(collectElementNames(survey.toJSON()));
  const dropped = declared.filter((name) => !materialized.has(name));
  expect(
    dropped.length,
    `${label}: survey-core loaded the JSON without error but did not materialize element(s) the converter emitted (silently dropped): ${dropped.join(", ")}`
  ).toBe(0);

  return survey;
}

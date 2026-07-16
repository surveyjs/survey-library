// The conversion oracle.
//
// The authoritative acceptance test for every converter is not "does the output
// match a golden JSON" -- it is "does the output construct a survey-core
// `SurveyModel` with ZERO errors". survey-core is the only thing that knows what
// valid SurveyJS JSON is, so we use it as the oracle. It is imported ONLY from
// test code (this helper and the `*.spec.ts` files); the shipped library keeps
// zero runtime dependencies. This directory is excluded from the build
// (`tsconfig.build.json`) so survey-core never enters the published typings.
//
// Shared by the hand fixtures (`src/<converter>/*.spec.ts`) and the scraped
// corpus specs (step 03) so both hold the output to the same bar.

import { SurveyModel } from "survey-core";
import { expect } from "vitest";

/**
 * Assert that `surveyJson` constructs a survey-core `SurveyModel` with no
 * schema errors. `survey.jsonErrors` is `null` (or empty) on clean input and an
 * array of `{ type, message, ... }` when SurveyJS rejects a construct (e.g. an
 * unknown question `type`). Failures surface the offending error messages.
 */
export function assertConstructsCleanly(surveyJson: unknown, label = "survey"): SurveyModel {
  const survey = new SurveyModel(surveyJson as object);
  const errors = survey.jsonErrors ?? [];
  const messages = errors.map((e) => `${(e as { type?: string }).type ?? "error"}: ${(e as { message?: string }).message ?? ""}`);
  expect(errors.length, `${label} produced survey-core jsonErrors:\n  ${messages.join("\n  ")}`).toBe(0);
  return survey;
}

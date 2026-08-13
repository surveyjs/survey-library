// The public surface of "survey-core/tester". It is a separate entry point on purpose: an
// application that only renders a survey never loads any of it, and nothing under src/ outside
// src/tester/ imports from here. entries/index.ts does not reference this file.

export type {
  ISurveyTests,
  ISurveyTest,
  ISurveyTestStep,
  ISurveyTestCheck,
  ISurveyTestOptions,
  ISurveyTestStart,
  ISurveyTestStartDefinition,
  ISurveyTestCommandParams,
} from "../src/tester/test-json";

export type {
  ISurveyTestsResult,
  ISurveyTestResult,
  ISurveyTestStepResult,
  ISurveyTestCheckResult,
  ISurveyTestIssue,
  ISurveyTestSummary,
  SurveyTestStatus,
  SurveyTestSeverity,
} from "../src/tester/test-result";
export { SurveyTestIssueCodes } from "../src/tester/test-result";

export { SurveyTestRunner } from "../src/tester/test-runner";
export { SurveyTestValidator } from "../src/tester/test-validator";
export { SurveyTestCommandFactory } from "../src/tester/test-commands";
export { SurveyTestCheckFactory } from "../src/tester/test-checks";

// The handler interfaces, so that an integrator can register a command or a check of their own.
// SurveyTestPayloadType and SurveyTestTargetKind travel with them: a handler cannot be written
// without naming the payload type it accepts and the target kinds it applies to.
export type { ISurveyTestCommand, SurveyTestPayloadType } from "../src/tester/test-commands";
export type { ISurveyTestCheckHandler, ISurveyTestCheckOutcome } from "../src/tester/test-checks";
export type { ISurveyTestContext, ISurveyTestTarget, SurveyTestTargetKind } from "../src/tester/test-context";

import { ISurveyTestOptions, ISurveyTests } from "../src/tester/test-json";
import { ISurveyTestsResult } from "../src/tester/test-result";
import { SurveyTestRunner } from "../src/tester/test-runner";

// The two-line path for the common case. The definition comes first and separately: a suite never
// embeds it, so the same suite runs against an edited definition and the same definition against
// several suites.
export function runSurveyTests(survey: any, tests: ISurveyTests,
  options?: ISurveyTestOptions): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(survey, tests, options).run();
}

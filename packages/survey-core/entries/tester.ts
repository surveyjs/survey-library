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

// The inverse of target resolution, for a recorder or a test generator that starts from a live model
// object and needs the name a case addresses it by. It is the same grammar as the forward direction,
// so a name it returns is a name the runner resolves back to that object.
export { SurveyTestTargets } from "../src/tester/test-targets";
export type { ISurveyTestTargetContext } from "../src/tester/test-targets";

// Authoring helpers: the small rules of the format that a case editor has to obey and would otherwise
// have to restate. Every one of them is the very code the validator and the runner use.
export { parseSurveyTestStep, getSurveyTestStepCommandNames } from "../src/tester/test-authoring";
export type { ISurveyTestParsedStep } from "../src/tester/test-authoring";
export { isValidTestPayload, getTestPayloadTypeText, isCommandAllowedForKind } from "../src/tester/test-commands";

// The runtime form of what the string unions above declare, and the three names the format fixes, so
// that a UI can enumerate them instead of hard-coding a copy. All of it is frozen.
export { SurveyTestPayloadTypes } from "../src/tester/test-commands";
export { SurveyTestTargetKinds } from "../src/tester/test-targets";
export {
  STEP_METADATA_KEYS as SurveyTestStepMetadataKeys,
  CHECK_COMMAND_NAME as SurveyTestCheckCommandName,
  RESERVED_TARGET_SURVEY as SurveyTestSurveyTargetName,
} from "../src/tester/test-json";

// The handler interfaces, so that an integrator can register a command or a check of their own.
// SurveyTestPayloadType and SurveyTestTargetKind travel with them: a handler cannot be written
// without naming the payload type it accepts and the target kinds it applies to.
export type { ISurveyTestCommand, SurveyTestPayloadType } from "../src/tester/test-commands";
export type { ISurveyTestCheckHandler, ISurveyTestCheckOutcome } from "../src/tester/test-checks";
export type { ISurveyTestContext } from "../src/tester/test-context";
export type { ISurveyTestTarget, SurveyTestTargetKind } from "../src/tester/test-targets";

// The execution contract: how the model of a test is created and what a host is told while the run
// progresses. A headless caller passes none of it.
export type {
  ISurveyTestExecutionOptions,
  ISurveyTestModelFactoryContext,
  SurveyTestModelFactory,
  SurveyTestExecutionObserver,
  SurveyTestExecutionEvent,
  SurveyTestExecutionEventType,
  ISurveyTestRunStartedEvent,
  ISurveyTestRunCompletedEvent,
  ISurveyTestTestStartedEvent,
  ISurveyTestSurveyCreatedEvent,
  ISurveyTestTestCompletedEvent,
  ISurveyTestStepStartedEvent,
  ISurveyTestStepCompletedEvent,
  ISurveyTestTargetStartedEvent,
  ISurveyTestTargetCompletedEvent,
  ISurveyTestCheckCompletedEvent,
  ISurveyTestIssueAddedEvent,
} from "../src/tester/test-execution";

import { ISurveyTestOptions, ISurveyTests } from "../src/tester/test-json";
import { ISurveyTestsResult } from "../src/tester/test-result";
import { ISurveyTestExecutionOptions } from "../src/tester/test-execution";
import { SurveyTestRunner } from "../src/tester/test-runner";

// The two-line path for the common case. The definition comes first and separately: a suite never
// embeds it, so the same suite runs against an edited definition and the same definition against
// several suites. It is the survey JSON, never a SurveyModel: the runner creates the model of every
// test itself, and executionOptions is where an application configures the one it creates.
export function runSurveyTests(surveyJson: any, tests: ISurveyTests,
  options?: ISurveyTestOptions, executionOptions?: ISurveyTestExecutionOptions): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(surveyJson, tests, options).run(executionOptions);
}

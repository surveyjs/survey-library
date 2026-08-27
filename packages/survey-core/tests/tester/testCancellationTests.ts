import { settings, SurveyModel } from "survey-core";
import { ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { ISurveyTestContext, ISurveyTestTarget } from "../../src/tester/test-context";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { ISurveyTestCommand, SurveyTestCommandFactory } from "../../src/tester/test-commands";
import { ISurveyTestCheckHandler, SurveyTestCheckFactory } from "../../src/tester/test-checks";
import { ISurveyTestExecutionOptions, SurveyTestExecutionEvent } from "../../src/tester/test-execution";

import { afterEach, describe, expect, test } from "vitest";

// Stopping a run: the caller presses Stop, the run ends at the next safe boundary and what it already
// produced stays exactly as it was reported. Nothing is invented for what never ran.

const savedCommands: { [name: string]: ISurveyTestCommand } = {};
const savedChecks: { [name: string]: ISurveyTestCheckHandler } = {};
function registerCommand(command: ISurveyTestCommand): void {
  if (!(command.name in savedCommands)) {
    savedCommands[command.name] = SurveyTestCommandFactory.Instance.get(command.name);
  }
  SurveyTestCommandFactory.Instance.register(command);
}
function registerCheck(check: ISurveyTestCheckHandler): void {
  if (!(check.name in savedChecks)) {
    savedChecks[check.name] = SurveyTestCheckFactory.Instance.get(check.name);
  }
  SurveyTestCheckFactory.Instance.register(check);
}
afterEach(() => {
  Object.keys(savedCommands).forEach(name => {
    const prev = savedCommands[name];
    if (!!prev) SurveyTestCommandFactory.Instance.register(prev);
    else SurveyTestCommandFactory.Instance.unregister(name);
    delete savedCommands[name];
  });
  Object.keys(savedChecks).forEach(name => {
    const prev = savedChecks[name];
    if (!!prev) SurveyTestCheckFactory.Instance.register(prev);
    else SurveyTestCheckFactory.Instance.unregister(name);
    delete savedChecks[name];
  });
});

const twoQuestionSurvey = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2" },
  ],
};

function delay(ms: number = 0): Promise<void> {
  return new Promise<void>(resolve => { setTimeout(resolve, ms); });
}
function run(survey: any, tests: any, executionOptions?: ISurveyTestExecutionOptions): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(survey, tests).run(executionOptions);
}
function codes(issues: Array<ISurveyTestIssue>): Array<string> {
  return issues.map(issue => issue.code);
}
function allIssues(result: ISurveyTestResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.steps.forEach(step => step.issues.forEach(issue => res.push(issue)));
  return res;
}
function statuses(result: ISurveyTestsResult): Array<string> {
  return result.tests.map(test => test.status);
}
function stepStatuses(result: ISurveyTestResult): Array<string> {
  return result.steps.map(step => step.status);
}

describe("SurveyTestRunner: stopping a run", () => {
  test("A signal that is already aborted runs nothing and announces nothing", async () => {
    const log: Array<string> = [];
    const controller = new AbortController();
    controller.abort();
    let models = 0;
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" } }] }],
    }, {
      signal: controller.signal,
      createSurvey: (surveyJson: any): SurveyModel => { models++; return new SurveyModel(surveyJson); },
      onEvent: (event: SurveyTestExecutionEvent): void => { log.push(event.type); },
    });
    expect(result.status, "the suite is canceled").toEqual("canceled");
    expect(result.tests, "no test produced a result").toEqual([]);
    expect(result.issues, "stopping a run is not an error of the case").toEqual([]);
    expect(models, "no model was built").toEqual(0);
    expect(log, "a run that never started has no boundary events").toEqual([]);
    expect(result.summary.total, "the summary counts what ran").toEqual(0);
  });
  test("Stopping before the first test starts leaves the suite with no test result", async () => {
    const log: Array<string> = [];
    const controller = new AbortController();
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "first", steps: [{ set: { q1: "a" } }] },
        { name: "second", steps: [{ set: { q2: "b" } }] },
      ],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        log.push(event.type);
        if (event.type === "runStarted") controller.abort();
      },
    });
    expect(result.status).toEqual("canceled");
    expect(result.tests, "no test was entered").toEqual([]);
    expect(log, "the run that did start is completed").toEqual(["runStarted", "runCompleted"]);
    expect(result.summary, "nothing is counted").toEqual({
      total: 0, passed: 0, failed: 0, errored: 0, skipped: 0, canceled: 0, checks: 0, failedChecks: 0, warnings: 0,
    });
  });
  test("Stopping while an observer delays a step cancels that step and that test", async () => {
    const log: Array<string> = [];
    const controller = new AbortController();
    let survey: SurveyModel = undefined;
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [
          { set: { q1: "a" } },
          { set: { q2: "b" } },
          { expect: { q2: { value: "b" } } },
        ],
      }],
    }, {
      signal: controller.signal,
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        log.push(event.type + (event.type === "stepStarted" ? " " + event.stepIndex : ""));
        if (event.type === "surveyCreated") survey = event.survey;
        // The host is holding the run between two commands and the user presses Stop.
        if (event.type === "stepStarted" && event.stepIndex === 1) {
          await delay(0);
          controller.abort();
          await delay(0);
        }
      },
    });
    expect(result.status, "the suite is canceled").toEqual("canceled");
    const testResult = result.tests[0];
    expect(testResult.status, "the test the run was in is canceled").toEqual("canceled");
    expect(stepStatuses(testResult), "the step it was holding is canceled, the one before it is not")
      .toEqual(["passed", "canceled"]);
    expect(testResult.steps.length, "the third step was never created").toEqual(2);
    expect(survey.getValue("q2"), "the command of the canceled step never ran").toEqual(undefined);
    expect(survey.getValue("q1"), "what ran before it stays").toEqual("a");
    expect(allIssues(testResult), "stopping a run adds no issue").toEqual([]);
    expect(log, "the step and the test that started are completed").toEqual([
      "runStarted", "testStarted", "surveyCreated",
      "stepStarted 0", "targetStarted", "targetCompleted", "stepCompleted",
      "stepStarted 1", "stepCompleted",
      "testCompleted", "runCompleted",
    ]);
  });
  test("An asynchronous command that observes the signal ends the run where it returns", async () => {
    const seen: Array<boolean> = [];
    const controller = new AbortController();
    registerCommand({
      name: "setSlowly",
      payloadType: "string",
      run: async (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): Promise<void> => {
        await delay(5);
        // The handler cooperates: it does not touch the model once the run has been stopped.
        seen.push(!!context.signal && context.signal.aborted);
        if (!!context.signal && context.signal.aborted) return;
        target.obj.value = params;
      },
    });
    let survey: SurveyModel = undefined;
    const promise = run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [{ setSlowly: { q1: "a" } }, { setSlowly: { q2: "b" } }],
      }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") survey = event.survey;
        // Stop the run while the command of the second step is in flight.
        if (event.type === "targetStarted" && event.target === "q2") {
          delay(1).then(() => controller.abort());
        }
      },
    });
    const result = await promise;
    expect(result.status).toEqual("canceled");
    expect(seen, "the running handler saw the stop, the one before it did not").toEqual([false, true]);
    expect(stepStatuses(result.tests[0]), "the step the handler belonged to is canceled")
      .toEqual(["passed", "canceled"]);
    expect(survey.getValue("q1"), "the first command took effect").toEqual("a");
    expect(survey.getValue("q2"), "the cooperating handler changed nothing").toEqual(undefined);
    expect(allIssues(result.tests[0]), "a stopped handler is not a broken case").toEqual([]);
  });
  test("A handler that rejects because it was stopped is cancellation, not an error", async () => {
    const controller = new AbortController();
    registerCommand({
      name: "setSlowly",
      payloadType: "string",
      run: async (context: ISurveyTestContext): Promise<void> => {
        await delay(5);
        // What an aborted fetch does: it rejects with an error of its own.
        if (!!context.signal && context.signal.aborted) throw new Error("aborted");
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ setSlowly: { q1: "a" } }] }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "targetStarted") delay(1).then(() => controller.abort());
      },
    });
    expect(result.status).toEqual("canceled");
    expect(result.tests[0].status).toEqual("canceled");
    expect(stepStatuses(result.tests[0])).toEqual(["canceled"]);
    expect(allIssues(result.tests[0]), "the rejection of a stopped handler is not reported").toEqual([]);
  });
  test("Stopping between two targets of one command leaves the second one untouched", async () => {
    const log: Array<string> = [];
    const controller = new AbortController();
    let survey: SurveyModel = undefined;
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a", q2: "b" } }] }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "targetStarted" || event.type === "targetCompleted") {
          log.push(event.type + " " + event.target);
        } else {
          log.push(event.type);
        }
        if (event.type === "surveyCreated") survey = event.survey;
        if (event.type === "targetCompleted" && event.target === "q1") controller.abort();
      },
    });
    expect(result.status).toEqual("canceled");
    expect(stepStatuses(result.tests[0])).toEqual(["canceled"]);
    expect(survey.getValue("q1"), "the target that ran took effect").toEqual("a");
    expect(survey.getValue("q2"), "the target after the stop never ran").toEqual(undefined);
    expect(log, "the target that ran is completed, the next one never starts").toEqual([
      "runStarted", "testStarted", "surveyCreated", "stepStarted",
      "targetStarted q1", "targetCompleted q1",
      "stepCompleted", "testCompleted", "runCompleted",
    ]);
  });
  test("Stopping after some checks have completed keeps them and runs no more", async () => {
    const controller = new AbortController();
    const ran: Array<string> = [];
    registerCheck({
      name: "slowValue",
      kinds: ["question"],
      payloadType: "string",
      check: async (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        ran.push(target.name + " " + expected);
        await delay(5);
        // The second check stops the run while it is being awaited.
        if (expected === "a") controller.abort();
        return { passed: target.obj.value === expected, actual: target.obj.value };
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [
          { set: { q1: "a" } },
          { expect: { q1: { value: "a", slowValue: "a", empty: false } } },
          { expect: { q1: { value: "a" } } },
        ],
      }],
    }, { signal: controller.signal });
    expect(result.status).toEqual("canceled");
    const testResult = result.tests[0];
    expect(stepStatuses(testResult), "the step the check belonged to is canceled").toEqual(["passed", "canceled"]);
    expect(testResult.steps.length, "the step after it was never created").toEqual(2);
    const checks = testResult.steps[1].checks;
    expect(checks.map(check => check.check), "the checks that completed are kept, in order")
      .toEqual(["value", "slowValue"]);
    expect(checks.every(check => check.passed), "and they keep their outcome").toBeTruthy();
    expect(ran, "the check after the stop never ran").toEqual(["q1 a"]);
  });
  test("A canceled check result is still announced before the canceled step ends", async () => {
    const log: Array<string> = [];
    const controller = new AbortController();
    registerCheck({
      name: "slowValue",
      kinds: ["question"],
      payloadType: "string",
      check: async (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        await delay(5);
        controller.abort();
        return { passed: true, actual: expected };
      },
    });
    await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { slowValue: "a" } } }] }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        log.push(event.type === "checkCompleted" ? "checkCompleted " + event.result.check : event.type);
      },
    });
    expect(log, "what the handler produced is announced, and the target it ran in is completed").toEqual([
      "runStarted", "testStarted", "surveyCreated", "stepStarted", "targetStarted",
      "checkCompleted slowValue", "targetCompleted", "stepCompleted", "testCompleted", "runCompleted",
    ]);
  });
  test("A target the run was stopped in front of has no targetCompleted", async () => {
    const controller = new AbortController();
    const log: Array<string> = [];
    let survey: SurveyModel = undefined;
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" } }] }],
    }, {
      signal: controller.signal,
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        log.push(event.type);
        if (event.type === "surveyCreated") survey = event.survey;
        // The host is holding the run on the element it just highlighted.
        if (event.type === "targetStarted") {
          await delay(0);
          controller.abort();
        }
      },
    });
    expect(result.status).toEqual("canceled");
    expect(survey.getValue("q1"), "the command of the held target never ran").toEqual(undefined);
    expect(log, "the target that never ran is not completed").toEqual([
      "runStarted", "testStarted", "surveyCreated", "stepStarted", "targetStarted",
      "stepCompleted", "testCompleted", "runCompleted",
    ]);
  });
  test("No later test runs and the tests that finished keep their own status", async () => {
    const controller = new AbortController();
    const names: Array<string> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "passes", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "fails", steps: [{ expect: { q1: { value: "nothing" } } }] },
        { name: "canceled", steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }] },
        { name: "never runs", steps: [{ expect: { q1: { empty: true } } }] },
      ],
    }, {
      signal: controller.signal,
      createSurvey: (surveyJson: any, context: any): SurveyModel => {
        names.push(context.test.name);
        return new SurveyModel(surveyJson);
      },
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "stepCompleted" && event.testIndex === 2) controller.abort();
      },
    });
    expect(result.status, "the suite is canceled whatever the tests before it reported").toEqual("canceled");
    expect(statuses(result), "the results before the stop are intact")
      .toEqual(["passed", "failed", "canceled"]);
    expect(names, "the test after the stop never reached the factory").toEqual(["passes", "fails", "canceled"]);
    const canceledTest = result.tests[2];
    expect(stepStatuses(canceledTest), "the step that finished before the stop keeps its status")
      .toEqual(["passed"]);
    expect(result.summary, "the counters describe what actually ran").toEqual({
      total: 3, passed: 1, failed: 1, errored: 0, skipped: 0, canceled: 1, checks: 2, failedChecks: 1, warnings: 0,
    });
  });
  test("Nothing the tester installed survives a canceled run", async () => {
    const prevHook = settings.onDateCreated;
    const controller = new AbortController();
    let survey: SurveyModel = undefined;
    registerCommand({
      name: "setSlowly",
      payloadType: "string",
      run: async (): Promise<void> => { await delay(5); },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ setSlowly: { q1: "a" } }] }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") survey = event.survey;
        if (event.type === "targetStarted") delay(1).then(() => controller.abort());
      },
    });
    expect(result.status).toEqual("canceled");
    expect(settings.onDateCreated, "the date hook is restored").toBe(prevHook);
    const fresh = new SurveyModel(twoQuestionSurvey);
    expect(survey.onValueChanged.length, "the diagnostics are detached").toEqual(fresh.onValueChanged.length);
    expect(survey.onTriggerExecuted.length, "the diagnostics are detached").toEqual(fresh.onTriggerExecuted.length);
    expect(survey.onCurrentPageChanged.length, "the cache subscription is removed")
      .toEqual(fresh.onCurrentPageChanged.length);
    expect(survey.onMatrixRowAdded.length, "the cache subscription is removed")
      .toEqual(fresh.onMatrixRowAdded.length);
  });
  test("runCompleted carries the canceled result the caller receives", async () => {
    const controller = new AbortController();
    let announced: ISurveyTestsResult = undefined;
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" } }, { set: { q2: "b" } }] }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "stepCompleted") controller.abort();
        if (event.type === "runCompleted") announced = event.result;
      },
    });
    expect(announced, "the completed result is the final one").toBe(result);
    expect(announced.status).toEqual("canceled");
    expect(announced.summary.canceled, "the summary of the event is the resolved one").toEqual(1);
  });
  test("The lifecycle events of the canceled objects carry the canceled results", async () => {
    const controller = new AbortController();
    const seen: Array<string> = [];
    await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" } }, { set: { q2: "b" } }] }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "stepStarted" && event.stepIndex === 1) controller.abort();
        if (event.type === "stepCompleted") seen.push("step " + event.stepIndex + " " + event.result.status);
        if (event.type === "testCompleted") seen.push("test " + event.result.status);
        if (event.type === "runCompleted") seen.push("run " + event.result.status);
      },
    });
    expect(seen, "a host can finish its presentation from the events alone")
      .toEqual(["step 0 passed", "step 1 canceled", "test canceled", "run canceled"]);
  });
  test("runTest() reports the canceled test on its own", async () => {
    const controller = new AbortController();
    const log: Array<string> = [];
    const result = await new SurveyTestRunner(twoQuestionSurvey, undefined).runTest(
      { name: "single", steps: [{ set: { q1: "a" } }, { set: { q2: "b" } }] },
      {
        signal: controller.signal,
        onEvent: (event: SurveyTestExecutionEvent): void => {
          log.push(event.type);
          if (event.type === "stepCompleted") controller.abort();
        },
      });
    expect(result.status).toEqual("canceled");
    expect(stepStatuses(result), "only the step that finished is kept").toEqual(["passed"]);
    expect(log[log.length - 1], "the test that started is completed").toEqual("testCompleted");
    expect(allIssues(result)).toEqual([]);
  });
  test("runTest() is canceled when the stop comes in the completion of its last step", async () => {
    const controller = new AbortController();
    const log: Array<string> = [];
    const result = await new SurveyTestRunner(twoQuestionSurvey, undefined).runTest(
      { name: "single", steps: [{ set: { q1: "a" } }, { set: { q2: "b" } }] },
      {
        signal: controller.signal,
        // The host is holding the run on the completion of the step that happens to be the last one.
        onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
          log.push(event.type);
          if (event.type === "stepCompleted" && event.stepIndex === 1) {
            await delay(0);
            controller.abort();
          }
        },
      });
    expect(result.status, "a test the caller stopped is not a passed one").toEqual("canceled");
    expect(stepStatuses(result), "the steps that did finish keep their own status").toEqual(["passed", "passed"]);
    expect(allIssues(result), "stopping a run adds no issue").toEqual([]);
    expect(log[log.length - 1], "the test that started is completed").toEqual("testCompleted");
  });
  test("The last test of a suite is canceled when the stop comes in the completion of its last step", async () => {
    const controller = new AbortController();
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "passes", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "canceled", steps: [{ set: { q1: "a" } }] },
      ],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "stepCompleted" && event.testIndex === 1) controller.abort();
      },
    });
    expect(result.status).toEqual("canceled");
    expect(statuses(result), "the suite and its last test say the same thing").toEqual(["passed", "canceled"]);
    expect(stepStatuses(result.tests[1]), "the step that finished before the stop keeps its status")
      .toEqual(["passed"]);
    expect(result.summary.canceled, "the counters describe the stop").toEqual(1);
    expect(result.summary.passed).toEqual(1);
  });
  test("A step that failed before the stop keeps its own status inside the canceled test", async () => {
    const controller = new AbortController();
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "fails", steps: [{ expect: { q1: { value: "nothing" } } }] }],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "stepCompleted") controller.abort();
      },
    });
    expect(result.status, "the suite is canceled").toEqual("canceled");
    expect(statuses(result), "the test the caller stopped is canceled whatever its steps found")
      .toEqual(["canceled"]);
    expect(stepStatuses(result.tests[0]), "and what the step found is kept on the step").toEqual(["failed"]);
    expect(result.summary, "a canceled test is counted once, as canceled").toEqual({
      total: 1, passed: 0, failed: 0, errored: 0, skipped: 0, canceled: 1, checks: 1, failedChecks: 1, warnings: 0,
    });
  });
  test("runTest() with an aborted signal announces nothing", async () => {
    const controller = new AbortController();
    controller.abort();
    const log: Array<string> = [];
    const result = await new SurveyTestRunner(twoQuestionSurvey, undefined).runTest(
      { name: "single", steps: [{ set: { q1: "a" } }] },
      { signal: controller.signal, onEvent: (event: SurveyTestExecutionEvent): void => { log.push(event.type); } });
    expect(result.status).toEqual("canceled");
    expect(result.steps, "no step was created").toEqual([]);
    expect(log, "a test that never started has no event pair").toEqual([]);
  });
  test("A stopped run still reports a case that was already broken", async () => {
    const controller = new AbortController();
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "broken", steps: [{ set: { unknown: "a" } }] },
        { name: "canceled", steps: [{ set: { q1: "a" } }, { set: { q2: "b" } }] },
      ],
    }, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "stepStarted" && event.testIndex === 1 && event.stepIndex === 1) controller.abort();
      },
    });
    expect(statuses(result), "the error of the first test is not turned into cancellation")
      .toEqual(["error", "canceled"]);
    expect(codes(allIssues(result.tests[0]))).toEqual([SurveyTestIssueCodes.unknownTarget]);
    expect(result.summary.errored, "it is still counted as errored").toEqual(1);
    expect(result.summary.canceled).toEqual(1);
  });
  test("A run that is never stopped is exactly the run without a signal", async () => {
    const controller = new AbortController();
    const suite = {
      name: "same",
      tests: [
        { name: "passes", steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }] },
        { name: "fails", steps: [{ expect: { q2: { value: "b" } } }] },
        { name: "skipped", disabled: true, steps: [{ expect: { q1: { empty: true } } }] },
        { name: "broken", steps: [{ expect: { q1: { colour: "red" } } }] },
      ],
    };
    const plain: Array<string> = [];
    const watched: Array<string> = [];
    const withoutSignal = await run(twoQuestionSurvey, suite, {
      onEvent: (event: SurveyTestExecutionEvent): void => { plain.push(event.type); },
    });
    const withSignal = await run(twoQuestionSurvey, suite, {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => { watched.push(event.type); },
    });
    expect(withSignal, "a signal nobody aborts changes nothing").toEqual(withoutSignal);
    expect(watched, "and it changes no event").toEqual(plain);
    expect(withoutSignal.status).toEqual("error");
    expect(statuses(withoutSignal)).toEqual(["passed", "failed", "skipped", "error"]);
  });
});

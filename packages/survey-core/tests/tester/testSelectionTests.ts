import { SurveyModel } from "../../src/survey";
import { ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { ISurveyTestExecutionOptions, SurveyTestExecutionEvent } from "../../src/tester/test-execution";
import { ISurveyTest } from "../../src/tester/test-json";

import { describe, expect, test } from "vitest";

// Running a part of a suite: the caller says which entries this run holds, and everything else stays
// exactly as it was. The suite is not copied, not re-flagged and not re-indexed, and what is left out
// is absent rather than reported as something the author disabled.

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
function names(result: ISurveyTestsResult): Array<string> {
  return result.tests.map(test => test.name);
}
function statuses(result: ISurveyTestsResult): Array<string> {
  return result.tests.map(test => test.status);
}
function allIssues(result: ISurveyTestResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.steps.forEach(step => step.issues.forEach(issue => res.push(issue)));
  return res;
}
// Four entries that cover every outcome a selected test can have: passing, failing, disabled by the
// author and structurally broken.
function createSuite(): any {
  return {
    name: "suite",
    tests: [
      { name: "passes", steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }] },
      { name: "fails", steps: [{ expect: { q2: { value: "b" } } }] },
      { name: "disabled", disabled: true, steps: [{ set: { q1: "c" } }] },
      { name: "broken", steps: [{ set: { q1: "a" }, complete: { survey: true } }] },
    ],
  };
}
function selectByName(...selected: Array<string>): (test: ISurveyTest, testIndex: number) => boolean {
  return (test: ISurveyTest): boolean => selected.indexOf(test.name) > -1;
}

describe("SurveyTestRunner: selecting the tests of a run", () => {
  test("No filter runs the whole suite, exactly as before", async () => {
    const suite = createSuite();
    const plain = await run(twoQuestionSurvey, suite);
    const filtered = await run(twoQuestionSurvey, suite, { testFilter: () => true });
    expect(filtered, "a filter that selects everything changes nothing").toEqual(plain);
    expect(statuses(plain)).toEqual(["passed", "failed", "skipped", "error"]);
    expect(plain.summary.total).toEqual(4);
  });
  test("A filter that selects everything produces the same events in the same order", async () => {
    const suite = createSuite();
    const plainLog: Array<string> = [];
    const filteredLog: Array<string> = [];
    const log = (into: Array<string>) => (event: SurveyTestExecutionEvent): void => {
      into.push(event.type + ("testIndex" in event && event.testIndex !== undefined ? " " + event.testIndex : ""));
    };
    await run(twoQuestionSurvey, suite, { onEvent: log(plainLog) });
    await run(twoQuestionSurvey, suite, { onEvent: log(filteredLog), testFilter: () => true });
    expect(filteredLog).toEqual(plainLog);
  });
  test("Selecting one test of four produces one result", async () => {
    const result = await run(twoQuestionSurvey, createSuite(), { testFilter: selectByName("fails") });
    expect(names(result), "only the selected test produced a result").toEqual(["fails"]);
    expect(statuses(result)).toEqual(["failed"]);
    expect(result.status, "the suite reports what the test it held reported").toEqual("failed");
    expect(result.summary.total, "the summary counts the results, and there is one").toEqual(1);
    expect(result.summary.failed).toEqual(1);
    expect(result.summary.skipped, "nothing was skipped: the others are not in this run").toEqual(0);
    expect(result.summary.passed).toEqual(0);
    expect(result.summary.errored).toEqual(0);
  });
  test("An unselected test is absent rather than skipped", async () => {
    const log: Array<SurveyTestExecutionEvent> = [];
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: selectByName("passes"),
      onEvent: (event: SurveyTestExecutionEvent): void => { log.push(event); },
    });
    expect(names(result)).toEqual(["passes"]);
    expect(result.summary, "every counter describes the one test that ran").toEqual({
      total: 1, passed: 1, failed: 0, errored: 0, skipped: 0, canceled: 0, checks: 1, failedChecks: 0, warnings: 0,
    });
    const testIndexes = log.filter(event => (event as any).testIndex !== undefined)
      .map(event => (event as any).testIndex);
    expect(testIndexes.every(index => index === 0), "no event belongs to an unselected test").toBe(true);
    expect(log.filter(event => event.type === "testStarted").length, "one test was entered").toEqual(1);
    expect(log.filter(event => event.type === "surveyCreated").length, "one model was built").toEqual(1);
  });
  test("A selected test the author disabled is still skipped", async () => {
    const result = await run(twoQuestionSurvey, createSuite(), { testFilter: selectByName("disabled") });
    expect(names(result)).toEqual(["disabled"]);
    expect(statuses(result), "disabled is the author's decision, and the filter does not speak for it")
      .toEqual(["skipped"]);
    expect(result.summary.total).toEqual(1);
    expect(result.summary.skipped).toEqual(1);
    expect(result.status, "a suite of one skipped test passed").toEqual("passed");
  });
  test("A selected test that is structurally broken still errors", async () => {
    const result = await run(twoQuestionSurvey, createSuite(), { testFilter: selectByName("broken") });
    expect(names(result)).toEqual(["broken"]);
    expect(statuses(result)).toEqual(["error"]);
    expect(codes(result.tests[0].issues)).toEqual([SurveyTestIssueCodes.stepHasSeveralCommands]);
    expect(result.status).toEqual("error");
    expect(result.summary.total).toEqual(1);
    expect(result.summary.errored).toEqual(1);
  });
  test("Selecting an arbitrary set keeps the original suite indices in every event", async () => {
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, createSuite(), {
      // The first and the last entry: nothing is renumbered to make them 0 and 1.
      testFilter: (test: ISurveyTest, testIndex: number): boolean => testIndex === 0 || testIndex === 3,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "testStarted" || event.type === "testCompleted") {
          log.push(event.type + " " + event.testIndex);
        }
      },
    });
    expect(names(result)).toEqual(["passes", "broken"]);
    expect(log).toEqual(["testStarted 0", "testCompleted 0", "testStarted 3", "testCompleted 3"]);
  });
  test("A runtime issue of a selected test keeps the path of its original suite index", async () => {
    const suite = {
      tests: [
        { name: "first", steps: [{ set: { q1: "a" } }] },
        { name: "second", steps: [{ set: { nothing: "a" } }] },
      ],
    };
    const issues: Array<ISurveyTestIssue> = [];
    const result = await run(twoQuestionSurvey, suite, {
      testFilter: (test: ISurveyTest, testIndex: number): boolean => testIndex === 1,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "issueAdded") issues.push(event.issue);
      },
    });
    expect(statuses(result)).toEqual(["error"]);
    expect(codes(allIssues(result.tests[0]))).toEqual([SurveyTestIssueCodes.unknownTarget]);
    expect(issues.length).toEqual(1);
    // The structural path a validator issue would carry is not involved here, but the event index is
    // the one the suite document uses.
    expect(codes(issues)).toEqual([SurveyTestIssueCodes.unknownTarget]);
  });
  test("A structural issue of a selected test keeps the path of its original suite index", async () => {
    const paths: Array<string> = [];
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: selectByName("broken"),
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "issueAdded") paths.push(event.testIndex + " " + event.issue.path);
      },
    });
    expect(result.tests[0].issues[0].path, "the fourth entry of the suite is still tests[3]")
      .toEqual("tests[3].steps[0]");
    expect(paths).toEqual(["3 tests[3].steps[0]"]);
  });
  test("A validation issue of an unselected test reaches neither the result nor the events", async () => {
    const suite = {
      tests: [
        { name: "good", steps: [{ set: { q1: "a" } }] },
        { name: "bad", steps: [{ nonsense: { q1: "a" }, set: { q2: "b" } }] },
      ],
    };
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, suite, {
      testFilter: selectByName("good"),
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "issueAdded") log.push(event.issue.code);
      },
    });
    expect(result.status).toEqual("passed");
    expect(result.issues, "what a test outside this run holds is not a suite issue").toEqual([]);
    expect(result.tests.length).toEqual(1);
    expect(result.tests[0].issues).toEqual([]);
    expect(log, "nothing was announced for a test that is not in this run").toEqual([]);
  });
  test("The filter is called once per suite entry, in suite order, with the original objects", async () => {
    const suite = createSuite();
    const seen: Array<any> = [];
    await run(twoQuestionSurvey, suite, {
      testFilter: (test: ISurveyTest, testIndex: number): boolean => {
        seen.push({ index: testIndex, name: test.name, same: test === suite.tests[testIndex] });
        return testIndex === 1;
      },
    });
    expect(seen).toEqual([
      { index: 0, name: "passes", same: true },
      { index: 1, name: "fails", same: true },
      { index: 2, name: "disabled", same: true },
      { index: 3, name: "broken", same: true },
    ]);
  });
  test("The suite, its tests and its starts are not changed by a filtered run", async () => {
    const suite = {
      name: "suite",
      starts: [{ name: "answered", data: { q1: "a" } }],
      options: { now: "2024-05-05T00:00:00" },
      tests: [
        { name: "passes", start: "answered", steps: [{ expect: { q1: { value: "a" } } }] },
        { name: "fails", steps: [{ expect: { q2: { value: "b" } } }] },
        { name: "disabled", disabled: true, steps: [{ set: { q1: "c" } }] },
      ],
    };
    const before = JSON.stringify(suite);
    const testsArray = suite.tests;
    const firstTest = suite.tests[0];
    const result = await run(twoQuestionSurvey, suite, { testFilter: selectByName("passes") });
    expect(result.status).toEqual("passed");
    expect(JSON.stringify(suite), "the suite the caller handed in is untouched").toEqual(before);
    expect(suite.tests, "the tests array is the same array").toBe(testsArray);
    expect(suite.tests[0], "the test object is the same object").toBe(firstTest);
    expect((suite.tests[1] as any).disabled, "an unselected test is not flagged as disabled").toBe(undefined);
  });
  test("A filter that selects nothing runs nothing and the suite passes", async () => {
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: () => false,
      onEvent: (event: SurveyTestExecutionEvent): void => { log.push(event.type); },
    });
    expect(result.tests).toEqual([]);
    expect(result.status, "a run that holds nothing has nothing to report").toEqual("passed");
    expect(result.summary.total).toEqual(0);
    expect(log, "the boundaries of a suite run are emitted whatever it holds").toEqual(["runStarted", "runCompleted"]);
  });
  test("A falsy result other than false leaves the test out as well", async () => {
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: ((test: ISurveyTest, testIndex: number): any => testIndex === 0 ? 1 : undefined) as any,
    });
    expect(names(result)).toEqual(["passes"]);
  });
});

describe("SurveyTestRunner: the planned run on runStarted", () => {
  test("An unfiltered run plans every entry of the suite", async () => {
    let planned: any = undefined;
    const result = await run(twoQuestionSurvey, createSuite(), {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runStarted") planned = { count: event.plannedTestCount, indexes: event.plannedTestIndexes };
      },
    });
    expect(planned, "a disabled and a broken test are planned: they produce a result")
      .toEqual({ count: 4, indexes: [0, 1, 2, 3] });
    expect(result.summary.total).toEqual(4);
  });
  test("A filtered run plans the selected entries, by their original indices", async () => {
    let planned: any = undefined;
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: (test: ISurveyTest, testIndex: number): boolean => testIndex !== 1,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runStarted") planned = { count: event.plannedTestCount, indexes: event.plannedTestIndexes };
      },
    });
    expect(planned).toEqual({ count: 3, indexes: [0, 2, 3] });
    expect(result.summary.total, "the plan and the results agree when nothing stops the run").toEqual(3);
  });
  test("The planned indexes are a copy: a host that changes them changes nothing", async () => {
    let planned: Array<number> = undefined;
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: (test: ISurveyTest, testIndex: number): boolean => testIndex < 2,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runStarted") {
          planned = event.plannedTestIndexes;
          planned.push(99);
        }
      },
    });
    expect(planned).toEqual([0, 1, 99]);
    expect(names(result)).toEqual(["passes", "fails"]);
  });
  test("A suite that cannot run at all plans nothing", async () => {
    let planned: any = undefined;
    const result = await run(twoQuestionSurvey, { tests: [] }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runStarted") planned = { count: event.plannedTestCount, indexes: event.plannedTestIndexes };
      },
    });
    expect(planned).toEqual({ count: 0, indexes: [] });
    expect(result.status).toEqual("error");
    expect(codes(result.issues)).toEqual([SurveyTestIssueCodes.testsMissing]);
  });
  test("A stopped run holds fewer results than it planned", async () => {
    const controller = new AbortController();
    let planned = -1;
    const result = await run(twoQuestionSurvey, createSuite(), {
      signal: controller.signal,
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runStarted") planned = event.plannedTestCount;
        if (event.type === "testCompleted" && event.testIndex === 0) controller.abort();
      },
    });
    expect(planned, "the plan describes what the run was going to do").toEqual(4);
    expect(result.status).toEqual("canceled");
    expect(result.summary.total, "the summary counts what it actually produced").toEqual(1);
    expect(names(result)).toEqual(["passes"]);
  });
});

describe("SurveyTestRunner: a selection filter that fails", () => {
  test("A throwing filter becomes one suite issue and nothing runs", async () => {
    const log: Array<string> = [];
    let seen = 0;
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: (test: ISurveyTest, testIndex: number): boolean => {
        seen++;
        if (testIndex === 1) throw new Error("no idea");
        return true;
      },
      onEvent: (event: SurveyTestExecutionEvent): void => { log.push(event.type); },
    });
    expect(seen, "the selection stops at the entry that threw").toEqual(2);
    expect(result.status).toEqual("error");
    expect(result.tests, "not even the entry that was already selected runs").toEqual([]);
    expect(codes(result.issues)).toEqual([SurveyTestIssueCodes.unexpectedError]);
    expect(result.issues[0].message).toEqual("The function that selects the tests of this run failed: no idea");
    expect(result.summary.total).toEqual(0);
    expect(log, "the run is bracketed and the failure is announced inside it")
      .toEqual(["runStarted", "issueAdded", "runCompleted"]);
  });
  test("A throwing filter does not reject the run and builds no model", async () => {
    let models = 0;
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: (): boolean => { throw new Error("boom"); },
      createSurvey: (surveyJson: any): SurveyModel => { models++; return new SurveyModel(surveyJson); },
    });
    expect(models, "nothing was created for a run that never selected a test").toEqual(0);
    expect(result.status).toEqual("error");
    expect(codes(result.issues)).toEqual([SurveyTestIssueCodes.unexpectedError]);
  });
  test("A throwing filter plans nothing and publishes no test-level issue", async () => {
    let planned = -1;
    const result = await run(twoQuestionSurvey, createSuite(), {
      testFilter: (): boolean => { throw new Error("boom"); },
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runStarted") planned = event.plannedTestCount;
      },
    });
    expect(planned, "a run that could not decide what it holds plans nothing").toEqual(0);
    // The suite holds a structurally broken test, and no test is in this run: what the validator found
    // in it belongs to a test that never ran, so the suite does not inherit it.
    expect(codes(result.issues)).toEqual([SurveyTestIssueCodes.unexpectedError]);
  });
  test("A malformed suite is not made runnable by filtering out the entry that shows it", async () => {
    let calls = 0;
    const result = await run(twoQuestionSurvey, { tests: [{ name: "ok", steps: [] }, "not a test"] }, {
      testFilter: (test: ISurveyTest, testIndex: number): boolean => { calls++; return testIndex === 0; },
    });
    expect(calls, "the root shape is not a test-level problem, but this one is: the filter still runs").toEqual(2);
    expect(result.tests.length, "the entry that is not an object is a broken test, not a broken suite").toEqual(1);
    expect(result.status).toEqual("passed");
    const brokenSuite = await run(twoQuestionSurvey, { tests: {} }, {
      testFilter: (): boolean => { throw new Error("never called"); },
    });
    expect(brokenSuite.status, "a suite whose root shape is wrong never reaches the filter").toEqual("error");
    expect(codes(brokenSuite.issues)).toEqual([SurveyTestIssueCodes.testsMissing]);
  });
});

describe("SurveyTestRunner: the teardown order of a run", () => {
  test("The teardown of a test completes before its testCompleted", async () => {
    const log: Array<string> = [];
    const survey: Array<SurveyModel> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" } }] }],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") survey.push(event.survey);
        if (event.type === "testCompleted" || event.type === "runCompleted") {
          // A model the tester has released reports nothing to it any more: setting a value here
          // reaches no diagnostics and adds no issue.
          if (survey.length > 0) survey[0].setValue("q2", "z");
          log.push(event.type);
        }
      },
    });
    expect(log).toEqual(["testCompleted", "runCompleted"]);
    expect(result.status, "what the released model did afterwards belongs to nobody").toEqual("passed");
    expect(result.tests[0].issues).toEqual([]);
    expect(survey[0].getValue("q2"), "a host that kept the model keeps a usable model").toEqual("z");
  });
  test("The run promise settles after runCompleted", async () => {
    const log: Array<string> = [];
    await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" } }] }],
    }, {
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        if (event.type === "runCompleted") {
          await delay(0);
          log.push("runCompleted");
        }
      },
    });
    log.push("settled");
    expect(log).toEqual(["runCompleted", "settled"]);
  });
  test("runTest has no run-level events and is not filtered", async () => {
    const log: Array<string> = [];
    const runner = new SurveyTestRunner(twoQuestionSurvey, createSuite());
    const result = await runner.runTest(createSuite().tests[1], {
      // A single test is selected by the caller, so the suite filter has no say in it.
      testFilter: (): boolean => false,
      onEvent: (event: SurveyTestExecutionEvent): void => { log.push(event.type); },
    });
    expect(result.name).toEqual("fails");
    expect(result.status).toEqual("failed");
    expect(log).toEqual([
      "testStarted", "surveyCreated", "stepStarted", "targetStarted", "checkCompleted", "targetCompleted",
      "stepCompleted", "testCompleted",
    ]);
  });
});

import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { ISurveyTestIssue, ISurveyTestResult, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { ISurveyTestContext, ISurveyTestTarget } from "../../src/tester/test-context";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { ISurveyTestCommand, SurveyTestCommandFactory } from "../../src/tester/test-commands";
import { ISurveyTestCheckHandler, SurveyTestCheckFactory } from "../../src/tester/test-checks";
import {
  ISurveyTestExecutionOptions, ISurveyTestModelFactoryContext, SurveyTestExecutionEvent,
} from "../../src/tester/test-execution";

import { afterEach, describe, expect, test } from "vitest";

// The execution contract: the run is genuinely asynchronous, the model of every test comes from a
// factory the host may replace, and the host hears about every operation before the next one starts.

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
// Lets a run that is not awaited reach the point where it waits for something of ours.
function settle(): Promise<void> {
  return delay(0);
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

describe("SurveyTestRunner: asynchronous handlers", () => {
  test("A synchronous suite produces the same result with an observer and without one", async () => {
    const suite = {
      name: "same",
      tests: [
        { name: "passes", steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }] },
        { name: "fails", steps: [{ expect: { q2: { value: "b" } } }] },
        { name: "skipped", disabled: true, steps: [{ expect: { q1: { empty: true } } }] },
      ],
    };
    const plain = await run(twoQuestionSurvey, suite);
    const observed = await run(twoQuestionSurvey, suite, { onEvent: () => delay(0) });
    expect(observed, "watching a run does not change it").toEqual(plain);
    expect(plain.status).toEqual("failed");
  });
  test("An asynchronous command is finished before the next step starts", async () => {
    const order: Array<string> = [];
    registerCommand({
      name: "setLater",
      payloadType: "string",
      run: async (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): Promise<void> => {
        await delay(5);
        order.push("command");
        target.obj.value = params;
      },
    });
    registerCheck({
      name: "valueNow",
      kinds: ["question"],
      payloadType: "string",
      check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        order.push("check");
        return { passed: target.obj.value === expected, actual: target.obj.value };
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [{ setLater: { q1: "a" } }, { expect: { q1: { valueNow: "a" } } }],
      }],
    });
    expect(result.status, "the check sees what the awaited command did").toEqual("passed");
    expect(order, "the command finished before the check ran").toEqual(["command", "check"]);
  });
  test("An asynchronous check is awaited and produces its result", async () => {
    registerCheck({
      name: "valueLater",
      kinds: ["question"],
      payloadType: "string",
      check: async (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        await delay(5);
        const actual = target.obj.value;
        return { passed: actual === expected, actual: actual, message: actual === expected ? undefined : "no" };
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [{ set: { q1: "a" } }, { expect: { q1: { valueLater: "a" }, q2: { valueLater: "b" } } }],
      }],
    });
    expect(result.status, "the failing asynchronous check is reported").toEqual("failed");
    const checks = result.tests[0].steps[1].checks;
    expect(checks.map(check => check.passed), "both outcomes are recorded in order").toEqual([true, false]);
    expect(checks[1].actual, "the outcome of the promise is the result").toEqual(undefined);
  });
  test("Targets and checks run one after the other, in the order the case writes them", async () => {
    const order: Array<string> = [];
    // The first target waits the longest: parallel execution would report them the other way round.
    const delays: { [name: string]: number } = { q1: 15, q2: 5 };
    registerCommand({
      name: "setLater",
      payloadType: "string",
      run: async (context: ISurveyTestContext, target: ISurveyTestTarget, params: any): Promise<void> => {
        await delay(delays[target.name]);
        order.push("set " + target.name);
        target.obj.value = params;
      },
    });
    registerCheck({
      name: "slow",
      kinds: ["question"],
      payloadType: "number",
      check: async (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        await delay(expected);
        order.push("check " + target.name + " " + expected);
        return { passed: true, actual: expected };
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [
          { setLater: { q1: "a", q2: "b" } },
          { expect: { q2: { slow: 15 }, q1: { slow: 5 } } },
        ],
      }],
    });
    expect(result.status, "everything ran").toEqual("passed");
    expect(order, "targets and checks keep the order of the case")
      .toEqual(["set q1", "set q2", "check q2 15", "check q1 5"]);
  });
  test("A rejected command and a rejected check become the same issue a thrown one does", async () => {
    registerCommand({
      name: "failsLater",
      payloadType: "none",
      run: async (): Promise<void> => {
        await delay(0);
        throw new Error("the command gave up");
      },
    });
    registerCheck({
      name: "failsLater",
      kinds: ["question"],
      payloadType: "boolean",
      check: async () => {
        await delay(0);
        throw new Error("the check gave up");
      },
    });
    const commandResult = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ failsLater: { q1: true } }] }],
    });
    const commandIssues = allIssues(commandResult.tests[0]);
    expect(codes(commandIssues), "the rejection is an unexpected error").toEqual([SurveyTestIssueCodes.unexpectedError]);
    expect(commandIssues[0].message.indexOf("the command gave up") > -1, "the message is kept").toBeTruthy();
    expect(commandResult.tests[0].status, "the test errors").toEqual("error");
    const checkResult = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { failsLater: true } } }] }],
    });
    const checkIssues = allIssues(checkResult.tests[0]);
    expect(codes(checkIssues), "the rejected check is an unexpected error too")
      .toEqual([SurveyTestIssueCodes.unexpectedError]);
    expect(checkIssues[0].message.indexOf("the check gave up") > -1, "the message is kept").toBeTruthy();
  });
  test("Nothing the tester installed survives an asynchronous failure", async () => {
    const prevHook = settings.onDateCreated;
    let survey: SurveyModel = undefined;
    registerCommand({
      name: "failsLater",
      payloadType: "none",
      run: async (): Promise<void> => {
        await delay(0);
        throw new Error("the command gave up");
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ failsLater: { q1: true } }] }],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") survey = event.survey;
      },
    });
    expect(result.tests[0].status, "the test errors").toEqual("error");
    expect(settings.onDateCreated, "the date hook is restored").toBe(prevHook);
    // A model subscribes to some of its own events, so the counts of an untouched one are the baseline.
    const fresh = new SurveyModel(twoQuestionSurvey);
    expect(survey.onValueChanged.length, "the diagnostics are detached").toEqual(fresh.onValueChanged.length);
    expect(survey.onTriggerExecuted.length, "the diagnostics are detached").toEqual(fresh.onTriggerExecuted.length);
    expect(survey.onCurrentPageChanged.length, "the cache subscription is removed")
      .toEqual(fresh.onCurrentPageChanged.length);
    expect(survey.onMatrixRowAdded.length, "the cache subscription is removed")
      .toEqual(fresh.onMatrixRowAdded.length);
  });
});

describe("SurveyTestRunner: the lifecycle events", () => {
  function describeEvent(event: SurveyTestExecutionEvent): string {
    switch(event.type) {
      case "testStarted": return "testStarted " + event.testIndex;
      case "surveyCreated": return "surveyCreated " + event.testIndex;
      case "testCompleted": return "testCompleted " + event.testIndex;
      case "stepStarted": return "stepStarted " + event.stepIndex;
      case "stepCompleted": return "stepCompleted " + event.stepIndex + " " + event.result.command;
      case "targetStarted": return "targetStarted " + event.command + " " + event.target;
      case "targetCompleted": return "targetCompleted " + event.command + " " + event.target;
      case "checkCompleted": return "checkCompleted " + event.result.target + " " + event.result.check;
      case "issueAdded": return "issueAdded " + event.issue.code;
    }
    return event.type;
  }
  test("The events of a passing test come in the documented order", async () => {
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [
          { set: { q1: "a", q2: "b" } },
          { expect: { q1: { value: "a" } } },
        ],
      }],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.status).toEqual("passed");
    expect(log).toEqual([
      "runStarted",
      "testStarted 0",
      "surveyCreated 0",
      "stepStarted 0",
      "targetStarted set q1",
      "targetCompleted set q1",
      "targetStarted set q2",
      "targetCompleted set q2",
      "stepCompleted 0 set",
      "stepStarted 1",
      "targetStarted expect q1",
      "checkCompleted q1 value",
      "targetCompleted expect q1",
      "stepCompleted 1 expect",
      "testCompleted 0",
      "runCompleted",
    ]);
  });
  test("A skipped and a broken test are announced without a model", async () => {
    const log: Array<string> = [];
    await run(twoQuestionSurvey, {
      tests: [
        { name: "skipped", disabled: true, steps: [{ expect: { q1: { empty: true } } }] },
        { name: "broken", steps: [] },
      ],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(log, "no survey is created for either of them").toEqual([
      "runStarted",
      "testStarted 0", "testCompleted 0",
      "testStarted 1", "issueAdded stepsMissing", "testCompleted 1",
      "runCompleted",
    ]);
  });
  test("The structural issue of a test is announced inside that test", async () => {
    const events: Array<SurveyTestExecutionEvent> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "broken", steps: [{ set: { q1: "a" }, expect: { q1: { value: "a" } } }] },
        { name: "runs", steps: [{ expect: { q1: { empty: true } } }] },
      ],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { events.push(event); } });
    expect(result.tests[0].status).toEqual("error");
    expect(result.tests[1].status, "the broken case does not stop the suite").toEqual("passed");
    const issues = events.filter(event => event.type === "issueAdded");
    expect(issues.length, "the issue is announced once").toEqual(1);
    const issue: any = issues[0];
    expect(issue.issue.code).toEqual(SurveyTestIssueCodes.stepHasSeveralCommands);
    expect(issue.testIndex, "it belongs to the test that carries it").toEqual(0);
    expect("stepIndex" in issue, "it was not raised inside a running step").toBeFalsy();
    expect(issue.issue, "the announced issue is the one on the result").toBe(result.tests[0].issues[0]);
  });
  test("A suite-level issue is announced between runStarted and runCompleted", async () => {
    const log: Array<string> = [];
    const events: Array<SurveyTestExecutionEvent> = [];
    const result = await run(twoQuestionSurvey, { tests: [] }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        log.push(describeEvent(event));
        events.push(event);
      },
    });
    expect(result.status).toEqual("error");
    expect(log).toEqual(["runStarted", "issueAdded testsMissing", "runCompleted"]);
    const issue: any = events[1];
    expect(issue.testIndex, "it belongs to no test").toBeUndefined();
    expect(issue.issue, "the announced issue is the one on the result").toBe(result.issues[0]);
  });
  test("A structural warning is announced and does not stop the test that carries it", async () => {
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "same", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "same", steps: [{ expect: { q2: { empty: true } } }] },
      ],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.status, "a warning does not stop the suite").toEqual("passed");
    expect(log.indexOf("issueAdded duplicateTestName"), "it is announced inside the second test")
      .toEqual(log.indexOf("testStarted 1") + 1);
    expect(log.indexOf("surveyCreated 1"), "the test still runs").toBeGreaterThan(0);
  });
  test("A broken suite announces the issues of its tests as well", async () => {
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, {
      starts: [{ name: "s" }, { name: "s" }],
      tests: [{ name: "t", steps: [] }],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.status).toEqual("error");
    expect(log, "no test runs, so nothing else can carry them").toEqual([
      "runStarted",
      "issueAdded duplicateStartName",
      "issueAdded stepsMissing",
      "runCompleted",
    ]);
    expect(codes(result.issues)).toEqual([SurveyTestIssueCodes.duplicateStartName, SurveyTestIssueCodes.stepsMissing]);
  });
  test("A missing survey definition is announced", async () => {
    const log: Array<string> = [];
    const result = await run(undefined, {
      tests: [{ name: "t", steps: [{ expect: { q1: { empty: true } } }] }],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.status).toEqual("error");
    expect(log).toEqual(["runStarted", "issueAdded surveyMissing", "runCompleted"]);
  });
  test("runTest announces the missing survey definition as well", async () => {
    const log: Array<string> = [];
    const runner = new SurveyTestRunner(undefined, { tests: [] });
    const result = await runner.runTest({ name: "t", steps: [{ expect: { q1: { empty: true } } }] },
      { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.status).toEqual("error");
    expect(log).toEqual(["issueAdded surveyMissing"]);
  });
  test("runTest announces the structural issue of the test it was given", async () => {
    const log: Array<string> = [];
    const runner = new SurveyTestRunner(twoQuestionSurvey, { tests: [] });
    const result = await runner.runTest({ name: "t", steps: [] },
      { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.status).toEqual("error");
    expect(log).toEqual(["testStarted undefined", "issueAdded stepsMissing", "testCompleted undefined"]);
  });
  test("An issue and a check result are announced inside the step that produced them", async () => {
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [{ expect: { q1: { value: "a", colour: "red" } } }],
      }],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.tests[0].status).toEqual("error");
    expect(log).toEqual([
      "runStarted",
      "testStarted 0",
      "surveyCreated 0",
      "stepStarted 0",
      "targetStarted expect q1",
      "checkCompleted q1 value",
      "issueAdded unknownCheck",
      "targetCompleted expect q1",
      "stepCompleted 0 expect",
      "testCompleted 0",
      "runCompleted",
    ]);
    const issueEvents = log.filter(entry => entry.indexOf("issueAdded") === 0);
    expect(issueEvents.length, "the issue is announced once").toEqual(1);
  });
  test("The event of a failing command carries the issue and no targetCompleted", async () => {
    const log: Array<string> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { unknown: "a" } }] }],
    }, { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(describeEvent(event)); } });
    expect(result.tests[0].status).toEqual("error");
    expect(log).toEqual([
      "runStarted",
      "testStarted 0",
      "surveyCreated 0",
      "stepStarted 0",
      "targetStarted set unknown",
      "issueAdded unknownTarget",
      "stepCompleted 0 set",
      "testCompleted 0",
      "runCompleted",
    ]);
  });
  test("runCompleted carries the result the caller receives", async () => {
    let announced: ISurveyTestsResult = undefined;
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { empty: true } } }] }],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runCompleted") announced = event.result;
      },
    });
    expect(announced, "the completed result is the final one").toBe(result);
    expect(announced.summary.checks).toEqual(1);
  });
  test("An awaited callback holds the run until it resolves", async () => {
    const log: Array<string> = [];
    let release: () => void = undefined;
    const gate = new Promise<void>(resolve => { release = resolve; });
    let survey: SurveyModel = undefined;
    const promise = run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [
          { expect: { q1: { empty: true } } },
          { set: { q1: "a" } },
          { expect: { q1: { value: "a" } } },
        ],
      }],
    }, {
      onEvent: async (event: SurveyTestExecutionEvent): Promise<void> => {
        log.push(event.type + (event.type === "stepStarted" ? " " + event.stepIndex : ""));
        if (event.type === "surveyCreated") survey = event.survey;
        if (event.type === "stepStarted" && event.stepIndex === 1) await gate;
      },
    });
    await settle();
    expect(log[log.length - 1], "the run waits inside the callback of the second step").toEqual("stepStarted 1");
    expect(survey.getValue("q1"), "the command of the held step has not run").toEqual(undefined);
    release();
    const result = await promise;
    expect(result.status, "the run finishes once the callback resolves").toEqual("passed");
    expect(survey.getValue("q1"), "the held step ran afterwards").toEqual("a");
  });
  test("A callback that fails is reported where it failed and leaves nothing installed", async () => {
    const prevHook = settings.onDateCreated;
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" } }] }],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "targetStarted") throw new Error("the host gave up");
      },
    });
    expect(result.status, "the run reports an error instead of rejecting").toEqual("error");
    const issues = allIssues(result.tests[0]);
    expect(codes(issues), "the failure of the host is an unexpected error")
      .toEqual([SurveyTestIssueCodes.unexpectedError]);
    expect(issues[0].message.indexOf("the host gave up") > -1, "the message is kept").toBeTruthy();
    expect(settings.onDateCreated, "the date hook is restored").toBe(prevHook);
  });
  test("A callback that fails outside a test errors the suite", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { empty: true } } }] }],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "runStarted") throw new Error("the host gave up");
      },
    });
    expect(result.status, "the suite errors").toEqual("error");
    expect(codes(result.issues)).toEqual([SurveyTestIssueCodes.unexpectedError]);
    expect(result.tests.length, "no test runs").toEqual(0);
  });
  test("runTest() announces the test it runs and no run boundary", async () => {
    const log: Array<string> = [];
    const result = await new SurveyTestRunner(twoQuestionSurvey, undefined).runTest(
      { name: "t", steps: [{ expect: { q1: { empty: true } } }] },
      { onEvent: (event: SurveyTestExecutionEvent): void => { log.push(event.type); } });
    expect(result.status).toEqual("passed");
    expect(log, "a single test has no suite around it").toEqual([
      "testStarted", "surveyCreated", "stepStarted", "targetStarted", "checkCompleted",
      "targetCompleted", "stepCompleted", "testCompleted",
    ]);
  });
});

describe("SurveyTestRunner: the model factory", () => {
  test("The default factory creates one fresh model per enabled runnable test", async () => {
    const models: Array<SurveyModel> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "first", steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }] },
        { name: "second", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "skipped", disabled: true, steps: [{ expect: { q1: { empty: true } } }] },
      ],
    }, {
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") models.push(event.survey);
      },
    });
    expect(statuses(result), "the second test does not see the answer of the first")
      .toEqual(["passed", "passed", "skipped"]);
    expect(models.length, "one model per runnable test").toEqual(2);
    expect(models[0] instanceof SurveyModel).toBeTruthy();
    expect(models[0] === models[1], "the two models are different objects").toBeFalsy();
  });
  test("The model the factory returns is the one the commands run on", async () => {
    let created: SurveyModel = undefined;
    let used: SurveyModel = undefined;
    registerCommand({
      name: "captureSurvey",
      allowSurvey: true,
      allowElement: false,
      payloadType: "none",
      run: (context: ISurveyTestContext): void => { used = context.survey; },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ captureSurvey: { survey: true } }] }],
    }, {
      createSurvey: (surveyJson: any): SurveyModel => {
        created = new SurveyModel(surveyJson);
        return created;
      },
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") {
          expect(event.survey, "surveyCreated exposes the model of the factory").toBe(created);
        }
      },
    });
    expect(result.status).toEqual("passed");
    expect(used, "the commands run on it").toBe(created);
  });
  test("A synchronous factory configures the model before the variables, the start and the steps", async () => {
    const seen: Array<any> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        variables: { region: "eu" },
        start: { data: { q2: "start" } },
        steps: [{ set: { q1: "typed" } }, { expect: { q1: { value: "TYPED" }, q2: { value: "START" } } }],
      }],
    }, {
      createSurvey: (surveyJson: any): SurveyModel => {
        const survey = new SurveyModel(surveyJson);
        survey.onValueChanging.add((sender: any, options: any) => {
          seen.push(sender.getVariable("region"));
          options.value = String(options.value).toUpperCase();
        });
        return survey;
      },
    });
    expect(result.status, "the handler of the factory saw every value").toEqual("passed");
    expect(seen, "the handler was installed before the start data and before the steps")
      .toEqual(["eu", "eu"]);
  });
  test("An asynchronous factory is awaited", async () => {
    const order: Array<string> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { value: "made later" } } }] }],
    }, {
      createSurvey: async (surveyJson: any): Promise<SurveyModel> => {
        await delay(5);
        order.push("created");
        const survey = new SurveyModel(surveyJson);
        survey.setValue("q1", "made later");
        return survey;
      },
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "surveyCreated") order.push("announced");
        if (event.type === "stepStarted") order.push("step");
      },
    });
    expect(result.status, "the steps ran on the model the promise resolved to").toEqual("passed");
    expect(order).toEqual(["created", "announced", "step"]);
  });
  test("Every call gets its own clone of the survey JSON and the context of its test", async () => {
    const definition = { elements: [{ type: "text", name: "q1" }] };
    const pristine = JSON.parse(JSON.stringify(definition));
    const seenJson: Array<any> = [];
    const seenContexts: Array<ISurveyTestModelFactoryContext> = [];
    const result = await run(definition, {
      options: { locale: "de" },
      tests: [
        { name: "first", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "second", options: { randomSeed: 7 }, steps: [{ expect: { q1: { empty: true } } }] },
      ],
    }, {
      createSurvey: (surveyJson: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
        seenJson.push(surveyJson);
        seenContexts.push(context);
        // A factory that edits what it was handed must not reach the next test.
        surveyJson.elements[0].title = "edited " + context.testIndex;
        return new SurveyModel(surveyJson);
      },
    });
    expect(statuses(result)).toEqual(["passed", "passed"]);
    expect(seenJson[0] === seenJson[1], "the two calls get two objects").toBeFalsy();
    expect(seenJson[1].elements[0].title, "the second clone is untouched by the first call").toEqual("edited 1");
    expect(definition, "the definition of the caller is untouched").toEqual(pristine);
    expect(seenContexts.map(context => context.testIndex), "each call knows its index").toEqual([0, 1]);
    expect(seenContexts.map(context => context.test.name)).toEqual(["first", "second"]);
    expect(seenContexts[0].options, "the resolved options of the test").toEqual({ locale: "de" });
    expect(seenContexts[1].options, "the options of the test merge over the suite")
      .toEqual({ locale: "de", randomSeed: 7 });
  });
  test("A disabled test and a broken one never reach the factory", async () => {
    let calls = 0;
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "disabled", disabled: true, steps: [{ expect: { q1: { empty: true } } }] },
        { name: "broken", steps: [] },
        { name: "runs", steps: [{ expect: { q1: { empty: true } } }] },
      ],
    }, {
      createSurvey: (surveyJson: any): SurveyModel => {
        calls++;
        return new SurveyModel(surveyJson);
      },
    });
    expect(statuses(result)).toEqual(["skipped", "error", "passed"]);
    expect(calls, "only the runnable test builds a model").toEqual(1);
  });
  test("A factory that fails errors its own test and the suite goes on", async () => {
    const models: Array<SurveyModel> = [];
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "first", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "second", steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }] },
      ],
    }, {
      createSurvey: (surveyJson: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
        if (context.testIndex === 0) throw new Error("no connection");
        const survey = new SurveyModel(surveyJson);
        models.push(survey);
        return survey;
      },
    });
    expect(statuses(result), "only the test of the failed call errors").toEqual(["error", "passed"]);
    expect(codes(result.tests[0].issues)).toEqual([SurveyTestIssueCodes.surveyFactoryFailed]);
    expect(result.tests[0].issues[0].message.indexOf("no connection") > -1, "the message is kept").toBeTruthy();
    expect(result.tests[0].steps, "no step of the broken test ran").toEqual([]);
    expect(models.length, "the next test still gets a model of its own").toEqual(1);
  });
  test("A rejected factory is reported like a thrown one", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { empty: true } } }] }],
    }, {
      createSurvey: async (): Promise<SurveyModel> => {
        await delay(0);
        throw new Error("no connection");
      },
    });
    expect(result.tests[0].status).toEqual("error");
    expect(codes(result.tests[0].issues)).toEqual([SurveyTestIssueCodes.surveyFactoryFailed]);
  });
  test("A factory that returns something else is reported", async () => {
    const suite = { tests: [{ name: "t", steps: [{ expect: { q1: { empty: true } } }] }] };
    const nothing = await run(twoQuestionSurvey, suite, { createSurvey: (): any => undefined });
    expect(codes(nothing.tests[0].issues)).toEqual([SurveyTestIssueCodes.surveyFactoryInvalidResult]);
    const other = await run(twoQuestionSurvey, suite, { createSurvey: (): any => ({ pages: [] }) });
    expect(codes(other.tests[0].issues)).toEqual([SurveyTestIssueCodes.surveyFactoryInvalidResult]);
    expect(other.tests[0].status).toEqual("error");
  });
  test("A model handed out twice is reported instead of running two tests on one state", async () => {
    let shared: SurveyModel = undefined;
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "first", steps: [{ set: { q1: "a" } }] },
        { name: "second", steps: [{ expect: { q1: { empty: true } } }] },
      ],
    }, {
      createSurvey: (surveyJson: any): SurveyModel => {
        if (!shared) shared = new SurveyModel(surveyJson);
        return shared;
      },
    });
    expect(statuses(result), "the first test runs, the second reports the reuse").toEqual(["passed", "error"]);
    expect(codes(result.tests[1].issues)).toEqual([SurveyTestIssueCodes.surveyFactoryInvalidResult]);
  });
  test("The factory of runTest() gets no index and the test it runs", async () => {
    const seen: Array<ISurveyTestModelFactoryContext> = [];
    const result = await new SurveyTestRunner(twoQuestionSurvey, undefined).runTest(
      { name: "single", options: { locale: "fr" }, steps: [{ expect: { q1: { empty: true } } }] },
      {
        createSurvey: (surveyJson: any, context: ISurveyTestModelFactoryContext): SurveyModel => {
          seen.push(context);
          return new SurveyModel(surveyJson);
        },
      });
    expect(result.status).toEqual("passed");
    expect(seen.length).toEqual(1);
    expect(seen[0].testIndex, "a single test has no index").toEqual(undefined);
    expect(seen[0].test.name).toEqual("single");
    expect(seen[0].options).toEqual({ locale: "fr" });
  });
});

describe("SurveyTestRunner: runTest() and run() agree", () => {
  const brokenTests: Array<any> = [
    { name: "no steps", test: { name: "t", steps: [] } },
    { name: "two commands in a step", test: { name: "t", steps: [{ set: { q1: "a" }, clear: { q1: true } }] } },
    { name: "an unknown start", test: { name: "t", start: "nowhere", steps: [{ expect: { q1: { empty: true } } }] } },
  ];
  brokenTests.forEach(entry => {
    test("A test with " + entry.name + " is reported the same way by both entry points", async () => {
      const single = await new SurveyTestRunner(twoQuestionSurvey, undefined).runTest(entry.test);
      const suite = await run(twoQuestionSurvey, { tests: [entry.test] });
      const inSuite = suite.tests[0];
      expect(single.status, "the same status").toEqual(inSuite.status);
      expect(codes(allIssues(single)), "the same issues").toEqual(codes(allIssues(inSuite)));
      expect(single.status).toEqual("error");
    });
  });
});

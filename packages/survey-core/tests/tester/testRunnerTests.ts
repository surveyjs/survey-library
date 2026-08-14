import { settings } from "../../src/settings";
import { SurveyModel } from "../../src/survey";
import { ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { ISurveyTestContext, ISurveyTestTarget } from "../../src/tester/test-context";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { ISurveyTestCommand, SurveyTestCommandFactory } from "../../src/tester/test-commands";
import { ISurveyTestCheckHandler, SurveyTestCheckFactory } from "../../src/tester/test-checks";
import { CHECK_COMMAND_NAME } from "../../src/tester/test-json";

import { afterEach, describe, expect, test } from "vitest";

// Registrations never leak out of a test: whatever was registered under the same name before is put
// back afterwards, so a stand-in for a command that a later prompt adds cannot delete the real one.
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

// Stand-ins for the built-ins that prompts 03 and 04 add. They exist so this step can pin the runner
// behaviour they depend on (applicability, custom registrations); they are not the real ones.
function registerVisibleCheck(): void {
  registerCheck({
    name: "visible",
    kinds: ["question", "panel", "page"],
    payloadType: "boolean",
    check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
      const actual = target.obj.isVisible;
      return { passed: actual === expected, actual: actual };
    },
  });
}
function registerNoValuesCheck(): void {
  registerCheck({
    name: "noValues",
    kinds: ["survey"],
    payloadType: "stringArray",
    check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
      const data = context.survey.data;
      const present = (<Array<string>>expected).filter(name => data[name] !== undefined);
      return { passed: present.length === 0, actual: present };
    },
  });
}

const insuranceSurvey = {
  elements: [
    { type: "radiogroup", name: "hasInsurance", choices: ["yes", "no"] },
    { type: "text", name: "insuranceProvider", visibleIf: "{hasInsurance} = 'yes'" },
  ],
};
const twoQuestionSurvey = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2" },
  ],
};
const twoPageSurvey = {
  pages: [
    { name: "page1", elements: [{ type: "text", name: "q1" }] },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
    { name: "page3", visibleIf: "{q1} = 'open'", elements: [{ type: "text", name: "q3" }] },
  ],
};

function run(survey: any, tests: any, options?: any): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(survey, tests, options).run();
}
function allIssues(result: ISurveyTestsResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.tests.forEach(test => {
    test.issues.forEach(issue => res.push(issue));
    test.steps.forEach(step => step.issues.forEach(issue => res.push(issue)));
  });
  return res;
}
function codes(issues: Array<ISurveyTestIssue>): Array<string> {
  return issues.map(issue => issue.code);
}
function statuses(result: ISurveyTestsResult): Array<string> {
  return result.tests.map(test => test.status);
}

describe("SurveyTestRunner: the step loop", () => {
  test("The canonical example passes end to end", async () => {
    const result = await run(insuranceSurvey, {
      name: "Insurance",
      tests: [{
        name: "Declining insurance leaves the provider empty",
        steps: [
          { set: { hasInsurance: "no" } },
          { name: "the provider is not answered", expect: { hasInsurance: { value: "no" }, insuranceProvider: { value: null } } },
        ],
      }],
    });
    expect(result.status, "the suite passes").toEqual("passed");
    expect(result.name, "the suite name is carried over").toEqual("Insurance");
    expect(statuses(result), "the test passes").toEqual(["passed"]);
    expect(result.summary, "the summary is complete").toEqual({
      total: 1, passed: 1, failed: 0, errored: 0, skipped: 0, checks: 2, failedChecks: 0, warnings: 0,
    });
    const steps = result.tests[0].steps;
    expect(steps.map(step => step.command), "every step records its command").toEqual(["set", CHECK_COMMAND_NAME]);
    expect(steps[1].name, "the step metadata is carried over").toEqual("the provider is not answered");
    expect(steps[1].checks[0], "the first check").toEqual({
      target: "hasInsurance", check: "value", expected: "no", actual: "no", passed: true, message: undefined, details: undefined,
      // Every result for an element carries the path of the node it is about, so a caller can link
      // a check back into the definition whether it passed or not.
      jsonPath: "pages[0].elements[0]",
    });
  });
  test("A failing check fails the test and the later steps still run", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "failing check",
        steps: [
          { set: { q1: "a" } },
          { expect: { q1: { value: "b" } } },
          { set: { q2: "c" } },
          { expect: { q2: { value: "c" } } },
        ],
      }],
    });
    expect(result.status, "the suite fails").toEqual("failed");
    const test0 = result.tests[0];
    expect(test0.status, "the test fails").toEqual("failed");
    expect(test0.steps.length, "every step runs").toEqual(4);
    expect(test0.steps.map(step => step.status), "only the failing step fails")
      .toEqual(["passed", "failed", "passed", "passed"]);
    const check = test0.steps[1].checks[0];
    expect(check.passed, "the check did not pass").toBeFalsy();
    expect(check.expected, "the expected value").toEqual("b");
    expect(check.actual, "the actual value").toEqual("a");
    expect(check.message.indexOf("\"a\"") > -1, "the message states what happened").toBeTruthy();
    expect(test0.steps[1].index, "the step index").toEqual(1);
    expect(result.summary.checks, "two checks ran").toEqual(2);
    expect(result.summary.failedChecks, "one of them failed").toEqual(1);
  });
  test("stopOnFirstFailure stops the test but never the suite", async () => {
    const result = await run(twoQuestionSurvey, {
      options: { stopOnFirstFailure: true },
      tests: [
        {
          name: "stops",
          steps: [
            { expect: { q1: { value: "a" } } },
            { set: { q2: "c" } },
          ],
        },
        { name: "still runs", steps: [{ expect: { q1: { value: null } } }] },
      ],
    });
    expect(result.tests[0].steps.length, "the test stops at the first failure").toEqual(1);
    expect(statuses(result), "the second test runs anyway").toEqual(["failed", "passed"]);
    expect(result.status, "the suite fails").toEqual("failed");
  });
  test("An errored test does not stop the suite", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "errors", steps: [{ set: { noSuchQuestion: 1 } }] },
        { name: "passes", steps: [{ expect: { q1: { value: null } } }] },
      ],
    });
    expect(statuses(result), "the second test runs anyway").toEqual(["error", "passed"]);
    expect(result.status, "the suite errors").toEqual("error");
    expect(result.summary.total, "two tests").toEqual(2);
    expect(result.summary.passed, "one passed").toEqual(1);
    expect(result.summary.errored, "one errored").toEqual(1);
    expect(result.summary.failed, "none failed").toEqual(0);
  });
  test("A disabled test is skipped and its survey is never built", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "disabled",
        disabled: true,
        steps: [{ set: { q1: "a" } }, { set: { noSuchQuestion: 1 } }],
      }],
    });
    expect(statuses(result), "the test is skipped").toEqual(["skipped"]);
    expect(result.tests[0].steps.length, "no step runs").toEqual(0);
    expect(codes(allIssues(result)), "the unknown target of a skipped test is never reported").toEqual([]);
    expect(result.status, "the suite passes").toEqual("passed");
    expect(result.summary.skipped, "one test is skipped").toEqual(1);
  });
  test("set goes in the way a respondent enters a value", async () => {
    const result = await run({
      calculatedValues: [{ name: "calc", expression: "{q1} + 1", includeIntoResult: true }],
      triggers: [{ type: "setvalue", expression: "{q1} = 10", setToName: "q2", setValue: "by the trigger" }],
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2" },
      ],
    }, {
      tests: [{
        name: "the trigger and the calculated value run",
        steps: [
          { set: { q1: 10 } },
          { expect: { q2: { value: "by the trigger" } } },
        ],
      }],
    });
    expect(statuses(result), "the test passes").toEqual(["passed"]);
  });
  test("set addresses a question inside a dynamic panel", async () => {
    const result = await run({
      elements: [{
        type: "paneldynamic", name: "panelDynamic", panelCount: 2,
        templateElements: [{ type: "text", name: "dq1" }],
      }],
    }, {
      tests: [{
        name: "two panels hold two values",
        steps: [
          { set: { "panelDynamic[0].dq1": "first", "panelDynamic[1].dq1": "second" } },
          { expect: { "panelDynamic[0].dq1": { value: "first" }, "panelDynamic[1].dq1": { value: "second" } } },
        ],
      }],
    });
    expect(statuses(result), "the test passes").toEqual(["passed"]);
  });
  test("A step that is not exactly one command is a case error", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "two commands", steps: [{ set: { q1: "a" }, expect: { q1: { value: "a" } } }] }],
    });
    expect(codes(allIssues(result)), "the malformed step is reported")
      .toEqual([SurveyTestIssueCodes.stepHasSeveralCommands]);
    expect(result.tests[0].status, "the test errors").toEqual("error");
  });
});

describe("SurveyTestRunner: the survey definition", () => {
  test("Each test gets a fresh survey and the definition is never mutated", async () => {
    const definition = JSON.parse(JSON.stringify(twoQuestionSurvey));
    const pristine = JSON.parse(JSON.stringify(twoQuestionSurvey));
    const result = await run(definition, {
      tests: [
        { name: "sets a value", steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }] },
        { name: "sees an empty survey", steps: [{ expect: { q1: { value: null } } }] },
      ],
    });
    expect(statuses(result), "both tests pass").toEqual(["passed", "passed"]);
    expect(definition, "the definition is not touched by the run").toEqual(pristine);
  });
  test("A SurveyModel instance is accepted and is left untouched", async () => {
    const survey = new SurveyModel(twoPageSurvey);
    survey.data = { q1: "kept" };
    survey.currentPageNo = 1;
    const result = await run(survey, {
      tests: [{
        name: "runs over a copy",
        steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" } } }],
      }],
    });
    expect(statuses(result), "the test passes").toEqual(["passed"]);
    expect(survey.data, "the data of the caller's model is untouched").toEqual({ q1: "kept" });
    expect(survey.currentPageNo, "the current page of the caller's model is untouched").toEqual(1);
    expect(survey.state, "the state of the caller's model is untouched").toEqual("running");
  });
  test("A missing survey definition is a suite error and no test runs", async () => {
    const suite = { tests: [{ name: "t", steps: [{ set: { q1: "a" } }] }] };
    const results = [await run(undefined, suite), await run(null, suite), await run("a survey", suite)];
    results.forEach(result => {
      expect(result.status, "the suite errors").toEqual("error");
      expect(codes(result.issues), "the missing definition is reported").toEqual([SurveyTestIssueCodes.surveyMissing]);
      expect(result.tests.length, "no test runs").toEqual(0);
    });
  });
  test("A structurally broken suite errors before any survey is built", async () => {
    const result = await run(twoQuestionSurvey, { tests: [] });
    expect(result.status, "the suite errors").toEqual("error");
    expect(codes(result.issues), "the structural issue is reported").toEqual([SurveyTestIssueCodes.testsMissing]);
    expect(result.tests.length, "no test runs").toEqual(0);
  });
  test("A structurally broken test errors while the others run", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [
        { name: "broken", steps: [{}] },
        { name: "fine", steps: [{ expect: { q1: { value: null } } }] },
      ],
    });
    expect(statuses(result), "only the broken test errors").toEqual(["error", "passed"]);
    expect(codes(result.tests[0].issues), "the structural issue is on the test").toEqual([SurveyTestIssueCodes.stepEmpty]);
  });
});

describe("SurveyTestRunner: options, variables and start", () => {
  test("Options merge per key and the resolved object is reported", async () => {
    const result = await run(twoQuestionSurvey, {
      options: { stopOnFirstFailure: true, locale: "de" },
      tests: [
        { name: "inherits the root options", steps: [{ expect: { q1: { value: null } } }] },
        {
          name: "overrides one option",
          options: { locale: "fr" },
          steps: [{ expect: { q1: { value: null } } }],
        },
        {
          name: "escapes a root true",
          options: { stopOnFirstFailure: false },
          steps: [
            { expect: { q1: { value: "a" } } },
            { expect: { q2: { value: null } } },
          ],
        },
      ],
    }, { randomSeed: 7 });
    expect(result.tests[0].options, "the root options apply to a test that sets none")
      .toEqual({ randomSeed: 7, stopOnFirstFailure: true, locale: "de" });
    expect(result.tests[1].options, "a test option overrides the root one")
      .toEqual({ randomSeed: 7, stopOnFirstFailure: true, locale: "fr" });
    expect(result.tests[2].options.stopOnFirstFailure, "a test can override an option back to its default").toBeFalsy();
    expect(result.tests[2].steps.length, "the test does not stop at the first failure").toEqual(2);
  });
  test("Variables merge per name and the resolved dictionary is reported", async () => {
    registerVisibleCheck();
    const survey = {
      elements: [
        { type: "text", name: "q1", visibleIf: "{region} = 'us'" },
        { type: "text", name: "q2" },
      ],
    };
    const result = await run(survey, {
      variables: { region: "eu", tier: "gold" },
      tests: [
        {
          name: "overrides one variable",
          variables: { region: "us" },
          steps: [{ expect: { q1: { visible: true } } }],
        },
        { name: "inherits every variable", steps: [{ expect: { q1: { visible: false } } }] },
      ],
    });
    expect(statuses(result), "both tests pass").toEqual(["passed", "passed"]);
    expect(result.tests[0].variables, "the test keeps the root variable it did not restate")
      .toEqual({ region: "us", tier: "gold" });
    expect(result.tests[1].variables, "a test that declares none gets the root ones")
      .toEqual({ region: "eu", tier: "gold" });
  });
  test("Variables seed expressions without appearing in the result data", async () => {
    registerVisibleCheck();
    registerNoValuesCheck();
    const result = await run({
      elements: [{ type: "text", name: "q1", visibleIf: "{region} = 'us'" }],
    }, {
      variables: { region: "us" },
      tests: [{
        name: "a variable is not an answer",
        steps: [{ expect: { q1: { visible: true }, survey: { noValues: ["region"] } } }],
      }],
    });
    expect(statuses(result), "the test passes").toEqual(["passed"]);
    expect(result.tests[0].steps[0].checks.length, "both checks ran").toEqual(2);
  });
  test("Variables are applied before the data of a start", async () => {
    const result = await run({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", defaultValueExpression: "{tier}" },
      ],
    }, {
      variables: { tier: "gold" },
      tests: [{
        name: "a default value expression sees the variable",
        start: { data: { q1: "a" } },
        steps: [{ expect: { q2: { value: "gold" } } }],
      }],
    });
    expect(statuses(result), "the test passes").toEqual(["passed"]);
  });
  test("A variable set mid-test does not leak into the next test", async () => {
    registerVisibleCheck();
    // A test helper, not a built-in: setting a variable mid-run is not a command of the format, but
    // the survey a test runs against must still start from the resolved variables every time.
    registerCommand({
      name: "setVariableForTest",
      allowSurvey: true,
      allowElement: false,
      payloadType: "nameMap",
      run: (context: ISurveyTestContext, target: ISurveyTestTarget, params: any) => {
        Object.keys(params).forEach(name => context.survey.setVariable(name, params[name]));
      },
    });
    const survey = { elements: [{ type: "text", name: "q1", visibleIf: "{region} = 'us'" }] };
    const result = await run(survey, {
      variables: { region: "eu" },
      tests: [
        {
          name: "overrides the variable mid-test",
          steps: [
            { expect: { q1: { visible: false } } },
            { setVariableForTest: { survey: { region: "us" } } },
            { expect: { q1: { visible: true } } },
          ],
        },
        { name: "starts from the resolved variables again", steps: [{ expect: { q1: { visible: false } } }] },
      ],
    });
    expect(statuses(result), "both tests pass").toEqual(["passed", "passed"]);
  });
  test("A referenced start is cloned per test and never mutated", async () => {
    const startEntry = {
      name: "midFlow",
      data: { q1: "start" },
    };
    const pristine = JSON.parse(JSON.stringify(startEntry));
    const suite = {
      starts: [startEntry],
      tests: [
        {
          name: "mutates the survey",
          start: "midFlow",
          steps: [
            { expect: { q1: { value: "start" } } },
            { set: { q2: "added by the first test" } },
          ],
        },
        {
          name: "begins from the same state",
          start: "midFlow",
          steps: [
            { expect: { q1: { value: "start" } } },
            { expect: { q2: { value: null } } },
          ],
        },
      ],
    };
    const result = await run(twoQuestionSurvey, suite);
    expect(statuses(result), "both tests pass").toEqual(["passed", "passed"]);
    expect(startEntry, "the starts entry is not touched by the run").toEqual(pristine);
    expect(result.tests[0].startName, "the reference is recorded").toEqual("midFlow");
    expect(result.tests[0].start, "the resolved start is recorded").toEqual({ data: { q1: "start" } });
    expect(result.tests[0].start === result.tests[1].start, "the two tests do not share the resolved start").toBeFalsy();
  });
  test("An inline start carries no name, and an absent start means an empty survey", async () => {
    const result = await run(twoQuestionSurvey, {
      tests: [
        {
          name: "inline",
          start: { data: { q1: "inline" } },
          steps: [{ expect: { q1: { value: "inline" } } }],
        },
        { name: "no start", steps: [{ expect: { q1: { value: null } } }] },
      ],
    });
    expect(statuses(result), "both tests pass").toEqual(["passed", "passed"]);
    expect(result.tests[0].startName, "an inline start has no name").toBeUndefined();
    expect(result.tests[1].start, "a test without a start records none").toBeUndefined();
  });
  test("dataMode: \"input\" runs the triggers, \"restore\" does not, and \"input\" is the default", async () => {
    const survey = {
      calculatedValues: [{ name: "calc", expression: "{q1} + 1", includeIntoResult: true }],
      triggers: [{ type: "setvalue", expression: "{q1} = 10", setToName: "q2", setValue: "by the trigger" }],
      elements: [
        { type: "text", name: "q1", inputType: "number" },
        { type: "text", name: "q2" },
      ],
    };
    const suite = {
      starts: [
        { name: "asInput", data: { q1: 10 }, dataMode: "input" },
        { name: "asRestore", data: { q1: 10 }, dataMode: "restore" },
        { name: "asDefault", data: { q1: 10 } },
      ],
      tests: [
        {
          name: "input runs the trigger",
          start: "asInput",
          steps: [{ expect: { q2: { value: "by the trigger" } } }],
        },
        {
          name: "restore does not run the trigger",
          start: "asRestore",
          steps: [{ expect: { q2: { value: null } } }],
        },
        {
          name: "input is the default",
          start: "asDefault",
          steps: [{ expect: { q2: { value: "by the trigger" } } }],
        },
      ],
    };
    const result = await run(survey, suite);
    expect(statuses(result), "every test passes").toEqual(["passed", "passed", "passed"]);
    expect(result.tests[1].start.dataMode, "the resolved start records the mode").toEqual("restore");
  });
  test("startPage puts the survey on a page by name", async () => {
    registerCheck({
      name: "currentPage",
      kinds: ["survey"],
      payloadType: "string",
      check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        const actual = context.survey.currentPage.name;
        return { passed: actual === expected, actual: actual };
      },
    });
    const result = await run(twoPageSurvey, {
      tests: [
        {
          name: "starts on page2",
          start: { startPage: "page2" },
          steps: [{ expect: { survey: { currentPage: "page2" } } }],
        },
        {
          name: "starts on an unknown page",
          start: { startPage: "noSuchPage" },
          steps: [{ expect: { survey: { currentPage: "page1" } } }],
        },
        {
          name: "starts on a page hidden by the data",
          start: { startPage: "page3" },
          steps: [{ expect: { survey: { currentPage: "page3" } } }],
        },
        {
          name: "starts on a page the data makes visible",
          start: { data: { q1: "open" }, startPage: "page3" },
          steps: [{ expect: { survey: { currentPage: "page3" } } }],
        },
      ],
    });
    expect(statuses(result), "only the two broken starts error")
      .toEqual(["passed", "error", "error", "passed"]);
    expect(codes(result.tests[1].issues), "an unknown page name").toEqual([SurveyTestIssueCodes.unknownStartPage]);
    expect(codes(result.tests[2].issues), "an invisible page").toEqual([SurveyTestIssueCodes.startPageNotVisible]);
    expect(result.tests[1].steps.length, "a broken start runs no step").toEqual(0);
  });
});

describe("SurveyTestRunner: determinism", () => {
  test("A case that depends on today() passes whatever the machine date is", async () => {
    registerVisibleCheck();
    const survey = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "currentYear() = 2024" },
      ],
    };
    const suite = { tests: [{ name: "pinned now", steps: [{ expect: { q2: { visible: true } } }] }] };
    const result = await run(survey, suite);
    expect(statuses(result), "the default now is 2024-01-01").toEqual(["passed"]);
    const shifted = await run(survey, suite, { now: "2030-06-01T00:00:00" });
    expect(shifted.tests[0].steps[0].checks[0].passed, "another now changes what the survey computes").toBeFalsy();
  });
  test("Running the same suite twice yields equal results", async () => {
    const suite = {
      tests: [{
        name: "twice",
        steps: [{ set: { q1: "a" } }, { expect: { q1: { value: "a" }, q2: { value: "b" } } }],
      }],
    };
    const first = await run(twoQuestionSurvey, suite);
    const second = await run(twoQuestionSurvey, suite);
    expect(second, "the two runs are equal").toEqual(first);
  });
  test("settings.onDateCreated is restored after a run, including after a case that throws", async () => {
    const prevHook = settings.onDateCreated;
    await run(twoQuestionSurvey, { tests: [{ name: "t", steps: [{ expect: { q1: { value: null } } }] }] });
    expect(settings.onDateCreated, "the previous hook is restored").toBe(prevHook);
    registerCommand({
      name: "throws",
      payloadType: "none",
      run: () => { throw new Error("something went wrong inside the model"); },
    });
    const result = await run(twoQuestionSurvey, { tests: [{ name: "t", steps: [{ throws: { q1: true } }] }] });
    expect(settings.onDateCreated, "the previous hook is restored after a throwing case").toBe(prevHook);
    const issues = allIssues(result);
    expect(codes(issues), "the exception becomes a case error").toEqual([SurveyTestIssueCodes.unexpectedError]);
    expect(issues[0].message.indexOf("something went wrong inside the model") > -1,
      "the message of the original error is kept").toBeTruthy();
    expect(result.tests[0].status, "the test errors").toEqual("error");
  });
});

describe("SurveyTestRunner: the registries", () => {
  test("An unknown command and an unknown check name the valid alternatives", async () => {
    const unknownCommand = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ jump: { q1: true } }] }],
    });
    const commandIssue = allIssues(unknownCommand)[0];
    expect(commandIssue.code, "the command is unknown").toEqual(SurveyTestIssueCodes.unknownCommand);
    expect(commandIssue.message.indexOf("\"set\"") > -1 || commandIssue.message.indexOf("set") > -1,
      "the message lists the valid commands").toBeTruthy();
    const unknownCheck = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { colour: "red" } } }] }],
    });
    const checkIssue = allIssues(unknownCheck)[0];
    expect(checkIssue.code, "the check is unknown").toEqual(SurveyTestIssueCodes.unknownCheck);
    expect(checkIssue.message.indexOf("value") > -1, "the message lists the valid checks").toBeTruthy();
  });
  test("A command and a check used against a kind they do not support are reported", async () => {
    registerCommand({
      name: "complete",
      allowSurvey: true,
      allowElement: false,
      payloadType: "none",
      run: () => { },
    });
    registerCheck({
      name: "state",
      kinds: ["survey"],
      payloadType: "string",
      check: (context: ISurveyTestContext) => ({ passed: true, actual: context.survey.state }),
    });
    const commandResult = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ complete: { q1: true } }] }],
    });
    const commandIssue = allIssues(commandResult)[0];
    expect(commandIssue.code, "complete does not apply to a question").toEqual(SurveyTestIssueCodes.commandNotApplicable);
    expect(commandIssue.message.indexOf("set") > -1, "the message lists the commands of a question").toBeTruthy();
    const checkResult = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { state: "running" } } }] }],
    });
    const checkIssue = allIssues(checkResult)[0];
    expect(checkIssue.code, "state does not apply to a question").toEqual(SurveyTestIssueCodes.checkNotApplicable);
    expect(checkIssue.message.indexOf("value") > -1, "the message lists the checks of a question").toBeTruthy();
  });
  test("set does not apply to a survey, a page or a panel", async () => {
    const surveyTarget = await run(twoPageSurvey, { tests: [{ name: "t", steps: [{ set: { survey: 1 } }] }] });
    expect(codes(allIssues(surveyTarget)), "the survey is not settable")
      .toEqual([SurveyTestIssueCodes.commandNotApplicable]);
    const pageTarget = await run(twoPageSurvey, { tests: [{ name: "t", steps: [{ set: { page1: 1 } }] }] });
    expect(codes(allIssues(pageTarget)), "a page is not settable")
      .toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
  test("expect is an ordinary registry entry", () => {
    const names = SurveyTestCommandFactory.Instance.getNames();
    expect(names.indexOf(CHECK_COMMAND_NAME) > -1, "expect is registered as a command").toBeTruthy();
    expect(names, "the names are sorted").toEqual([].concat(names).sort());
    expect(SurveyTestCommandFactory.Instance.get(CHECK_COMMAND_NAME).paramsKind,
      "its parameters are checks").toEqual("checks");
    expect(SurveyTestCheckFactory.Instance.getNames().indexOf("value") > -1, "value is registered as a check").toBeTruthy();
  });
  test("A custom command produces checks of its own", async () => {
    registerCommand({
      name: "checkTwice",
      payloadType: "none",
      run: (context: ISurveyTestContext, target: ISurveyTestTarget) => {
        context.addCheckResult({ target: target.name, check: "first", expected: true, actual: true, passed: true });
        context.addCheckResult({ target: target.name, check: "second", expected: true, actual: false, passed: false });
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ checkTwice: { q1: true } }] }],
    });
    const step = result.tests[0].steps[0];
    expect(step.command, "the step records the custom command").toEqual("checkTwice");
    expect(step.checks.map(check => check.check), "both checks are recorded").toEqual(["first", "second"]);
    expect(step.status, "the step fails").toEqual("failed");
    expect(result.tests[0].status, "a custom command can fail the test").toEqual("failed");
  });
  test("Registering and unregistering a custom check restores the previous state", async () => {
    const namesBefore = SurveyTestCheckFactory.Instance.getNames();
    SurveyTestCheckFactory.Instance.register({
      name: "isEmpty",
      kinds: ["question"],
      payloadType: "boolean",
      check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        const actual = target.obj.isEmpty();
        return { passed: actual === expected, actual: actual };
      },
    });
    const result = await run(twoQuestionSurvey, {
      tests: [{ name: "t", steps: [{ expect: { q1: { isEmpty: true } } }] }],
    });
    expect(statuses(result), "the custom check runs").toEqual(["passed"]);
    SurveyTestCheckFactory.Instance.unregister("isEmpty");
    expect(SurveyTestCheckFactory.Instance.getNames(), "the registry is back to its previous state").toEqual(namesBefore);
    expect(SurveyTestCheckFactory.Instance.get("isEmpty"), "the check is gone").toBeUndefined();
  });
  test("One expect step over two targets with two checks each yields four results in case order", async () => {
    registerVisibleCheck();
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [
          { set: { q1: "a" } },
          {
            expect: {
              q1: { value: "wrong", visible: true },
              q2: { value: null, visible: true },
            },
          },
        ],
      }],
    });
    const checks = result.tests[0].steps[1].checks;
    expect(checks.map(check => check.target + "." + check.check), "the results follow the case order")
      .toEqual(["q1.value", "q1.visible", "q2.value", "q2.visible"]);
    expect(checks.map(check => check.passed), "a failure does not prevent the others")
      .toEqual([false, true, true, true]);
    expect(result.tests[0].status, "the test fails").toEqual("failed");
  });
  test("An unknown check inside an expect step does not stop its siblings", async () => {
    registerVisibleCheck();
    const result = await run(twoQuestionSurvey, {
      tests: [{
        name: "t",
        steps: [{ expect: { q1: { colour: "red", visible: true, value: null } } }],
      }],
    });
    const step = result.tests[0].steps[0];
    expect(codes(step.issues), "the unknown check is reported once").toEqual([SurveyTestIssueCodes.unknownCheck]);
    expect(step.issues[0].step, "the issue names its step").toEqual(0);
    expect(step.checks.map(check => check.check), "the sibling checks still produce results")
      .toEqual(["visible", "value"]);
    expect(step.status, "the step errors").toEqual("error");
    expect(result.tests[0].status, "the test errors").toEqual("error");
  });
});

describe("SurveyTestRunner: a single test", () => {
  test("A valid test runs", async () => {
    const result = await new SurveyTestRunner(insuranceSurvey, undefined).runTest({
      name: "Declining insurance leaves the provider empty",
      steps: [
        { set: { hasInsurance: "no" } },
        { expect: { insuranceProvider: { value: null } } },
      ],
    });
    expect(result.status, "the test passes").toEqual("passed");
    expect(result.steps.map(step => step.command), "both steps ran").toEqual(["set", CHECK_COMMAND_NAME]);
    expect(result.issues, "nothing is reported").toEqual([]);
  });
  test("A structurally broken test errors instead of passing", async () => {
    const result = await new SurveyTestRunner(insuranceSurvey, undefined).runTest({ name: "t", steps: [] });
    expect(result.status, "an empty test is never a passing one").toEqual("error");
    expect(codes(result.issues), "the missing steps are reported").toEqual([SurveyTestIssueCodes.stepsMissing]);
    expect(result.issues[0].path, "the issue is pathed from the test itself").toEqual("test");
    expect(result.steps, "no step ran").toEqual([]);
  });
  test("A test-level structural error is reported before the test runs", async () => {
    const result = await new SurveyTestRunner(twoQuestionSurvey, undefined).runTest(<any>{
      steps: [{ set: { q1: "a" }, expect: { q1: { value: "a" } } }],
    });
    expect(result.status, "the test errors").toEqual("error");
    expect(codes(result.issues), "both the name and the step are reported")
      .toEqual([SurveyTestIssueCodes.testNameMissing, SurveyTestIssueCodes.stepHasSeveralCommands]);
    expect(result.issues[1].path, "the issue names its step").toEqual("test.steps[0]");
    expect(result.steps, "the survey is never touched").toEqual([]);
  });
  test("A named start resolves against the suite of the runner", async () => {
    const runner = new SurveyTestRunner(twoPageSurvey, {
      starts: [{ name: "opened", data: { q1: "open" } }],
      tests: [],
    });
    const passed = await runner.runTest({ name: "t", start: "opened", steps: [{ expect: { q1: { value: "open" } } }] });
    expect(passed.status, "the referenced start is applied").toEqual("passed");
    const errored = await runner.runTest({ name: "t", start: "opend", steps: [{ expect: { q1: { value: "open" } } }] });
    expect(errored.status, "an unknown start errors").toEqual("error");
    expect(codes(errored.issues), "the unresolved reference is reported once")
      .toEqual([SurveyTestIssueCodes.unknownStartReference]);
    expect(errored.issues[0].suggestion, "the closest name is suggested").toEqual("Did you mean \"opened\"?");
  });
  test("A missing survey definition still wins over a broken test", async () => {
    const result = await new SurveyTestRunner(undefined, undefined).runTest({ name: "t", steps: [] });
    expect(result.status, "the test errors").toEqual("error");
    expect(codes(result.issues), "the missing survey is the only issue").toEqual([SurveyTestIssueCodes.surveyMissing]);
  });
});

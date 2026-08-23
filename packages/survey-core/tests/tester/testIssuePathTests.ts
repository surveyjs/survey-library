import { ISurveyTestContext } from "../../src/tester/test-context";
import { ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { SurveyTestCommandFactory } from "../../src/tester/test-commands";
import { SurveyTestExecutionEvent } from "../../src/tester/test-execution";
import { SurveyModel } from "../../src/survey";

import { afterAll, beforeAll, describe, expect, test } from "vitest";

// Where an issue belongs in the case document, for every issue execution produces. A downloaded result
// is read without the events that announced it, so the path has to be on the issue itself: a host that
// rebuilt it from the transient indexes of an event would be the only thing that could say where a
// runtime failure happened.

// Two helper commands, not built-ins: one throws where survey-core would, the other raises an issue of
// its own with a path only a handler could know.
const THROWS = "throwForPathTest";
const PATHED = "issueWithOwnPathForPathTest";
const HANDLER_PATH = "tests[0].steps[0]." + PATHED + ".survey";

beforeAll(() => {
  SurveyTestCommandFactory.Instance.register({
    name: THROWS,
    allowSurvey: true,
    allowElement: false,
    payloadType: "none",
    run: (): void => { throw new Error("boom"); },
  });
  SurveyTestCommandFactory.Instance.register({
    name: PATHED,
    allowSurvey: true,
    allowElement: false,
    payloadType: "none",
    run: (context: ISurveyTestContext): void => {
      context.addIssue({
        severity: "warning", code: "customPathedIssue", message: "The handler knows where this belongs.",
        path: HANDLER_PATH,
      });
    },
  });
});
afterAll(() => {
  SurveyTestCommandFactory.Instance.unregister(THROWS);
  SurveyTestCommandFactory.Instance.unregister(PATHED);
});

const onePage = { elements: [{ type: "text", name: "q1" }] };
const survey = {
  pages: [
    { name: "page1", elements: [{ type: "text", name: "q1" }, { type: "text", name: "hidden", visible: false }] },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};

function allIssues(result: ISurveyTestsResult): Array<ISurveyTestIssue> {
  const res: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.tests.forEach(test => {
    test.issues.forEach(issue => res.push(issue));
    test.steps.forEach(step => step.issues.forEach(issue => res.push(issue)));
  });
  return res;
}
function issueOf(result: ISurveyTestsResult, code: string): ISurveyTestIssue {
  return allIssues(result).filter(issue => issue.code === code)[0];
}
function pathOf(result: ISurveyTestsResult, code: string): string {
  const issue = issueOf(result, code);
  expect(issue, "the run produced a " + code + " issue; it produced: " +
    allIssues(result).map(item => item.code).join(", ")).toBeTruthy();
  return issue.path;
}
function run(definition: any, tests: any, options?: any): Promise<ISurveyTestsResult> {
  return new SurveyTestRunner(definition, tests, options).run();
}
function oneTest(steps: Array<any>, extra?: any): any {
  return { tests: [Object.assign({ name: "t", steps: steps }, extra || {})] };
}

describe("A runtime issue inside a step carries the path of that step", () => {
  test("A target that resolves to nothing", async () => {
    const result = await run(survey, oneTest([
      { set: { q1: "a" } },
      { expect: { nope: { value: "a" } } },
    ]));
    expect(pathOf(result, SurveyTestIssueCodes.unknownTarget)).toEqual("tests[0].steps[1]");
  });
  test("A check that does not exist", async () => {
    const result = await run(survey, oneTest([{ expect: { q1: { nope: 1 } } }]));
    expect(pathOf(result, SurveyTestIssueCodes.unknownCheck)).toEqual("tests[0].steps[0]");
  });
  test("A check that does not apply to the target", async () => {
    const result = await run(survey, oneTest([{ expect: { q1: { rowCount: 1 } } }]));
    expect(pathOf(result, SurveyTestIssueCodes.checkNotApplicable)).toEqual("tests[0].steps[0]");
  });
  test("A command that does not exist", async () => {
    const result = await run(survey, oneTest([{ set: { q1: "a" } }, { nope: { survey: true } }]));
    expect(pathOf(result, SurveyTestIssueCodes.unknownCommand)).toEqual("tests[0].steps[1]");
  });
  test("A feasibility issue: an interaction no respondent could perform", async () => {
    const result = await run(survey, oneTest([{ set: { q1: "a" } }, { set: { hidden: "b" } }]));
    expect(pathOf(result, SurveyTestIssueCodes.elementNotVisible)).toEqual("tests[0].steps[1]");
  });
  test("A feasibility issue about an element on another page", async () => {
    const result = await run(survey, oneTest([{ set: { q2: "a" } }]));
    expect(pathOf(result, SurveyTestIssueCodes.elementNotOnCurrentPage)).toEqual("tests[0].steps[0]");
  });
  test("A warning", async () => {
    const result = await run(survey, oneTest([{ setDirectly: { hidden: "b" } }]));
    expect(pathOf(result, SurveyTestIssueCodes.setWhileHidden)).toEqual("tests[0].steps[0]");
  });
  test("An unexpected error from a handler", async () => {
    const result = await run(survey, oneTest([{ set: { q1: "a" } }, { [THROWS]: { survey: true } }]));
    expect(pathOf(result, SurveyTestIssueCodes.unexpectedError)).toEqual("tests[0].steps[1]");
  });
  test("An asynchronous operation that never finishes", async () => {
    // The handler never calls options.complete(), so the survey stays in server validation and the
    // "complete" command of the second step is the one that times out.
    const result = await new SurveyTestRunner(onePage, oneTest([
      { set: { q1: "a" } },
      { complete: { survey: true } },
    ]), { asyncTimeout: 20 }).run({
      createSurvey: (json: any): SurveyModel => {
        const model = new SurveyModel(json);
        model.onServerValidateQuestions.add(() => {});
        return model;
      },
    });
    expect(pathOf(result, SurveyTestIssueCodes.asyncOperationTimeout)).toEqual("tests[0].steps[1]");
  });
});

describe("A runtime issue outside a step carries the path of the test", () => {
  test("A start that names a page the survey does not have", async () => {
    const result = await run(survey, oneTest([{ expect: { q1: { empty: true } } }],
      { start: { startPage: "nope" } }));
    expect(pathOf(result, SurveyTestIssueCodes.unknownStartPage)).toEqual("tests[0]");
  });
  test("A start that names a page this state cannot reach", async () => {
    const conditional = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", visibleIf: "{q1} = 'yes'", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    const result = await run(conditional, oneTest([{ expect: { q1: { empty: true } } }],
      { start: { startPage: "page2" } }));
    expect(pathOf(result, SurveyTestIssueCodes.startPageNotVisible)).toEqual("tests[0]");
  });
  test("An element named after the reserved target", async () => {
    const reserved = { elements: [{ type: "text", name: "survey" }] };
    const result = await run(reserved, oneTest([{ expect: { survey: { state: "running" } } }]));
    expect(pathOf(result, SurveyTestIssueCodes.reservedTargetName)).toEqual("tests[0]");
  });
  test("A model factory that fails", async () => {
    const result = await new SurveyTestRunner(survey, oneTest([{ expect: { q1: { empty: true } } }])).run({
      createSurvey: (): SurveyModel => { throw new Error("no model"); },
    });
    expect(pathOf(result, SurveyTestIssueCodes.surveyFactoryFailed)).toEqual("tests[0]");
  });
  test("The second test of a suite is addressed by its own index", async () => {
    const result = await run(survey, {
      tests: [
        { name: "ok", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "broken", steps: [{ expect: { nope: { value: 1 } } }] },
      ],
    });
    expect(pathOf(result, SurveyTestIssueCodes.unknownTarget)).toEqual("tests[1].steps[0]");
  });
  test("A filtered run keeps the original suite index", async () => {
    const result = await new SurveyTestRunner(survey, {
      tests: [
        { name: "skipped", steps: [{ expect: { q1: { empty: true } } }] },
        { name: "broken", steps: [{ expect: { nope: { value: 1 } } }] },
      ],
    }).run({ testFilter: (test: any, index: number) => index === 1 });
    expect(pathOf(result, SurveyTestIssueCodes.unknownTarget)).toEqual("tests[1].steps[0]");
  });
});

describe("runTest() addresses its test by the word \"test\"", () => {
  test("A step issue", async () => {
    const runner = new SurveyTestRunner(survey, { tests: [] });
    const result = await runner.runTest({ name: "t", steps: [{ set: { q1: "a" } }, { expect: { nope: { value: 1 } } }] });
    const issue = result.steps[1].issues[0];
    expect(issue.code).toEqual(SurveyTestIssueCodes.unknownTarget);
    expect(issue.path).toEqual("test.steps[1]");
  });
  test("A test-level issue", async () => {
    const runner = new SurveyTestRunner(survey, { tests: [] });
    const result = await runner.runTest({
      name: "t", start: { startPage: "nope" }, steps: [{ expect: { q1: { empty: true } } }],
    });
    expect(result.issues[0].code).toEqual(SurveyTestIssueCodes.unknownStartPage);
    expect(result.issues[0].path).toEqual("test");
  });
  test("A missing survey definition is reported on the test it was asked to run", async () => {
    const runner = new SurveyTestRunner(undefined, { tests: [] });
    const result = await runner.runTest({ name: "t", steps: [{ expect: { q1: { empty: true } } }] });
    expect(result.issues[0].code).toEqual(SurveyTestIssueCodes.surveyMissing);
    expect(result.issues[0].path).toEqual("test");
  });
  test("The validator paths of runTest() are unchanged", async () => {
    const runner = new SurveyTestRunner(survey, { tests: [] });
    const result = await runner.runTest({ name: "t", steps: [{}] });
    expect(result.issues[0].code).toEqual(SurveyTestIssueCodes.stepEmpty);
    expect(result.issues[0].path).toEqual("test.steps[0]");
  });
});

describe("A more specific path always wins", () => {
  test("A handler that knows where its issue belongs keeps its own path", async () => {
    const result = await run(survey, oneTest([{ [PATHED]: { survey: true } }]));
    const issue = issueOf(result, "customPathedIssue");
    expect(issue.path, "the step path would have been less specific").toEqual(HANDLER_PATH);
  });
  test("A validation issue keeps the path the validator gave it", async () => {
    const result = await run(survey, {
      tests: [{ name: "t", steps: [{ set: { q1: "a" }, clear: { q1: true } }] }],
    });
    const issue = issueOf(result, SurveyTestIssueCodes.stepHasSeveralCommands);
    expect(issue.path).toEqual("tests[0].steps[0]");
  });
  test("A check payload issue keeps the target-level path of the validator", async () => {
    const result = await run(survey, oneTest([{ expect: { q1: "a" } }]));
    const issue = issueOf(result, SurveyTestIssueCodes.expectTargetNotAnObject);
    expect(issue.path, "the validator addressed the target inside the step").toEqual("tests[0].steps[0].expect.q1");
  });
});

describe("A genuinely suite-level issue is not given a case path", () => {
  test("A missing survey definition", async () => {
    const result = await run(undefined, oneTest([{ expect: { q1: { empty: true } } }]));
    expect(result.issues[0].code).toEqual(SurveyTestIssueCodes.surveyMissing);
    expect(result.issues[0].path, "no node of the case caused it").toBeUndefined();
  });
  test("A SurveyModel passed where the JSON belongs", async () => {
    const result = await run(new SurveyModel(survey), oneTest([{ expect: { q1: { empty: true } } }]));
    expect(result.issues[0].code).toEqual(SurveyTestIssueCodes.surveyJsonExpected);
    expect(result.issues[0].path).toBeUndefined();
  });
  test("A selection filter that throws", async () => {
    const result = await new SurveyTestRunner(survey, oneTest([{ expect: { q1: { empty: true } } }])).run({
      testFilter: (): boolean => { throw new Error("bad filter"); },
    });
    const issue = result.issues.filter(item => item.code === SurveyTestIssueCodes.unexpectedError)[0];
    expect(issue.message.indexOf("selects the tests") > -1, issue.message).toBeTruthy();
    expect(issue.path, "the host failed, not a case").toBeUndefined();
  });
});

describe("The path an event announces is the path the result holds", () => {
  test("Every issueAdded carries the very object the result keeps, path included", async () => {
    const announced: Array<ISurveyTestIssue> = [];
    const result = await new SurveyTestRunner(survey, {
      tests: [
        { name: "broken", steps: [{ set: { q1: "a" } }, { expect: { nope: { value: 1 } } }] },
        { name: "start", start: { startPage: "nope" }, steps: [{ expect: { q1: { empty: true } } }] },
        { name: "warned", steps: [{ setDirectly: { hidden: "b" } }] },
      ],
    }).run({
      onEvent: (event: SurveyTestExecutionEvent): void => {
        if (event.type === "issueAdded") announced.push(event.issue);
      },
    });
    const kept = allIssues(result);
    expect(announced.length, "every issue of the result was announced").toEqual(kept.length);
    expect(announced.map(issue => issue.code).sort()).toEqual(kept.map(issue => issue.code).sort());
    announced.forEach(issue => {
      expect(kept.indexOf(issue) > -1, "the announced object is the object the result holds: " + issue.code)
        .toBeTruthy();
      expect(!!issue.path, "the announced issue is self-describing: " + issue.code).toBeTruthy();
    });
    expect(announced.filter(issue => issue.code === SurveyTestIssueCodes.unknownTarget)[0].path)
      .toEqual("tests[0].steps[1]");
    expect(announced.filter(issue => issue.code === SurveyTestIssueCodes.unknownStartPage)[0].path)
      .toEqual("tests[1]");
    expect(announced.filter(issue => issue.code === SurveyTestIssueCodes.setWhileHidden)[0].path)
      .toEqual("tests[2].steps[0]");
  });
  test("The step index of an issue and its path address the same step", async () => {
    const result = await run(survey, oneTest([
      { set: { q1: "a" } },
      { expect: { q1: { nope: 1 } } },
    ]));
    const issue = issueOf(result, SurveyTestIssueCodes.unknownCheck);
    expect(issue.step, "the transient index").toEqual(1);
    expect(issue.path, "and the path that survives the download").toEqual("tests[0].steps[1]");
  });
});

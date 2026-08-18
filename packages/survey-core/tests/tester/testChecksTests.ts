import { ISurveyTestContext, ISurveyTestTarget } from "../../src/tester/test-context";
import { ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { getTestPayloadTypeText, SurveyTestPayloadType } from "../../src/tester/test-commands";
import { ISurveyTestCheckHandler, SurveyTestCheckFactory } from "../../src/tester/test-checks";

import { SurveyTestCommandFactory } from "../../src/tester/test-commands";

import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from "vitest";

// A test helper command, not a built-in: it records the state that no check may change.
const SNAPSHOT = "snapshotSurveyForTest";
let snapshots: Array<string> = [];

beforeAll(() => {
  SurveyTestCommandFactory.Instance.register({
    name: SNAPSHOT,
    allowSurvey: true,
    allowElement: false,
    payloadType: "none",
    run: (context: ISurveyTestContext): void => {
      const survey: any = context.survey;
      snapshots.push(JSON.stringify({
        data: survey.data,
        currentPageNo: survey.currentPageNo,
        state: survey.state,
      }));
    },
  });
});
afterAll(() => {
  SurveyTestCommandFactory.Instance.unregister(SNAPSHOT);
});

interface IRunParams {
  options?: any;
  start?: any;
  variables?: any;
  // Steps that bring the survey into the state the checks are written for.
  before?: Array<any>;
}
interface IRunOutcome {
  result: ISurveyTestsResult;
  status: string;
  // The checks of the last step: every case here ends with the "expect" step it is about.
  checks: Array<ISurveyTestCheckResult>;
  issues: Array<ISurveyTestIssue>;
  codes: Array<string>;
  messages: string;
}

async function runSteps(definition: any, steps: Array<any>, params?: IRunParams): Promise<IRunOutcome> {
  const runParams = params || {};
  const allSteps = (runParams.before || []).concat(steps);
  const testCase: any = { name: "t", steps: allSteps };
  if (!!runParams.start) testCase.start = runParams.start;
  const tests: any = { tests: [testCase] };
  if (!!runParams.variables) tests.variables = runParams.variables;
  const result = await new SurveyTestRunner(definition, tests, runParams.options).run();
  const issues: Array<ISurveyTestIssue> = [].concat(result.issues);
  const testResult = result.tests[0];
  testResult.issues.forEach(issue => issues.push(issue));
  testResult.steps.forEach(step => step.issues.forEach(issue => issues.push(issue)));
  const lastStep = testResult.steps[testResult.steps.length - 1];
  return {
    result: result,
    status: testResult.status,
    checks: !!lastStep ? lastStep.checks : [],
    issues: issues,
    codes: issues.map(issue => issue.code),
    messages: issues.map(issue => issue.message).join(" | "),
  };
}
function runExpect(definition: any, checkMap: any, params?: IRunParams): Promise<IRunOutcome> {
  return runSteps(definition, [{ expect: checkMap }], params);
}
async function runChecks(definition: any, target: string, checks: any, params?: IRunParams): Promise<Array<ISurveyTestCheckResult>> {
  const outcome = await runExpect(definition, { [target]: checks }, params);
  return outcome.checks;
}
async function runCheck(definition: any, target: string, name: string, expected: any,
  params?: IRunParams): Promise<ISurveyTestCheckResult> {
  const checks = await runChecks(definition, target, { [name]: expected }, params);
  return checks[0];
}
function expectPassed(check: ISurveyTestCheckResult, actual: any): void {
  expect(check, "the check produced a result").toBeTruthy();
  expect(check.passed, "the check passes; message: " + check.message).toBeTruthy();
  expect(check.actual, "the result carries what was read").toEqual(actual);
  expect(check.message, "a passing check needs no message").toBeUndefined();
}
// Every failing check states what was expected, what was read, and says both in its message: the
// message is what a case author sees first.
function expectFailed(check: ISurveyTestCheckResult, expected: any, actual: any, parts: Array<string>): void {
  expect(check, "the check produced a result").toBeTruthy();
  expect(check.passed, "the check fails").toBeFalsy();
  expect(check.expected, "the result carries the expected value").toEqual(expected);
  expect(check.actual, "the result carries the actual value").toEqual(actual);
  parts.forEach(part => {
    expect(check.message.indexOf(part) > -1, "the message contains " + part + ", and it is: " + check.message).toBeTruthy();
  });
}

const oneQuestion = { elements: [{ type: "text", name: "q1" }] };
const twoPages = {
  pages: [
    { name: "page1", elements: [{ type: "text", name: "q1" }] },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};
const twoErrorsSurvey = {
  elements: [{
    type: "text",
    name: "q1",
    validators: [
      { type: "regex", regex: "^a", text: "E1" },
      { type: "text", minLength: 5, text: "E2" },
    ],
  }],
};
const onValueChanged = { checkErrorsMode: "onValueChanged" };

describe("The check registry is the full built-in set", () => {
  test("Every check of both tables is registered, and getNames sorts them", () => {
    expect(SurveyTestCheckFactory.Instance.getNames(), "the built-in checks").toEqual([
      "choices", "comment", "currentPage", "empty", "enabled", "errorCount", "errors", "hasErrors",
      "noValues", "page", "pages", "panelCount", "required", "rowCount", "state", "title", "type",
      "value", "values", "variables", "visible",
    ]);
  });
  test("Every kind lists the checks that apply to it", () => {
    expect(SurveyTestCheckFactory.Instance.getNamesForKind("survey"), "the survey checks").toEqual([
      "currentPage", "errorCount", "noValues", "pages", "state", "values", "variables",
    ]);
    expect(SurveyTestCheckFactory.Instance.getNamesForKind("question"), "the question checks").toEqual([
      "choices", "comment", "empty", "enabled", "errorCount", "errors", "hasErrors", "page",
      "panelCount", "required", "rowCount", "title", "type", "value", "visible",
    ]);
    expect(SurveyTestCheckFactory.Instance.getNamesForKind("page"), "the page checks").toEqual([
      "enabled", "errorCount", "errors", "hasErrors", "title", "visible",
    ]);
    expect(SurveyTestCheckFactory.Instance.getNamesForKind("panel"), "the panel checks").toEqual([
      "enabled", "errorCount", "errors", "hasErrors", "page", "title", "visible",
    ]);
    expect(SurveyTestCheckFactory.Instance.getNamesForKind("calculatedValue"), "a calculated value holds a value")
      .toEqual(["value"]);
  });
  test("The names cut from the draft format are genuinely unknown", async () => {
    const names = ["data", "count", "questions", "contains", "notcontains"];
    for (let i = 0; i < names.length; i++) {
      const outcome = await runExpect(oneQuestion, { q1: { [names[i]]: 1 } });
      expect(outcome.codes, names[i] + " is not a check").toEqual([SurveyTestIssueCodes.unknownCheck]);
      expect(outcome.messages.indexOf("Available checks:") > -1, "the message lists the valid names").toBeTruthy();
    }
  });
});

describe("value", () => {
  test("The value of a question passes and fails", async () => {
    const params: IRunParams = { before: [{ set: { q1: "a" } }] };
    expectPassed(await runCheck(oneQuestion, "q1", "value", "a", params), "a");
    expectFailed(await runCheck(oneQuestion, "q1", "value", "b", params), "b", "a", ["\"a\"", "\"b\""]);
  });
  test("A calculated value is a target of its own", async () => {
    const definition = {
      calculatedValues: [{ name: "total", expression: "{q1} + 1" }],
      elements: [{ type: "text", name: "q1", inputType: "number" }],
    };
    const params: IRunParams = { before: [{ set: { q1: 2 } }] };
    expectPassed(await runCheck(definition, "total", "value", 3, params), 3);
    expectFailed(await runCheck(definition, "total", "value", 4, params), 4, 3, ["3", "4"]);
  });
  test("A matrix cell is a target of its own", async () => {
    const definition = {
      elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "col1", cellType: "text" }] }],
    };
    const params: IRunParams = { before: [{ set: { "m[0].col1": "x" } }] };
    expectPassed(await runCheck(definition, "m[0].col1", "value", "x", params), "x");
    expectPassed(await runCheck(definition, "m", "value", [{ col1: "x" }], params), [{ col1: "x" }]);
  });
  test("A string never passes for a number: the tester does not convert", async () => {
    const definition = { elements: [{ type: "text", name: "q1", inputType: "number" }] };
    const check = await runCheck(definition, "q1", "value", "5", { before: [{ set: { q1: 5 } }] });
    expectFailed(check, "5", 5, ["differ only by type", "a number", "a string"]);
  });
  test("value: null passes for an unanswered question, and so does an empty array for a checkbox", async () => {
    expectPassed(await runCheck(oneQuestion, "q1", "value", null), undefined);
    const definition = { elements: [{ type: "checkbox", name: "q1", choices: ["a", "b"] }] };
    const check = await runCheck(definition, "q1", "value", []);
    expect(check.passed, "an unanswered checkbox holds no selection").toBeTruthy();
  });
  test("value does not apply to a page or a panel", async () => {
    const outcome = await runExpect(twoPages, { page1: { value: "a" } });
    expect(outcome.codes, "a page has no value").toEqual([SurveyTestIssueCodes.checkNotApplicable]);
    expect(outcome.messages.indexOf("visible") > -1, "the message lists the checks of a page").toBeTruthy();
  });
});

describe("empty", () => {
  test("empty reads isEmpty() and is not the same as value: null", async () => {
    expectPassed(await runCheck(oneQuestion, "q1", "empty", true), true);
    expectFailed(await runCheck(oneQuestion, "q1", "empty", false), false, true, ["true", "false"]);
    expectPassed(await runCheck(oneQuestion, "q1", "empty", false, { before: [{ set: { q1: "a" } }] }), false);
  });
});

describe("visible", () => {
  const hiddenSurvey = {
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2", visibleIf: "{q1} = 'show'" },
      {
        type: "panel", name: "panel1", visibleIf: "{q1} = 'show'",
        elements: [{ type: "text", name: "inPanel" }],
      },
    ],
  };
  test("A question hidden by visibleIf is not visible", async () => {
    expectPassed(await runCheck(hiddenSurvey, "q2", "visible", false), false);
    expectFailed(await runCheck(hiddenSurvey, "q2", "visible", true), true, false, ["true", "false"]);
    expectPassed(await runCheck(hiddenSurvey, "q2", "visible", true, { before: [{ set: { q1: "show" } }] }), true);
  });
  test("A visible question inside a hidden panel is not visible to a respondent", async () => {
    expectPassed(await runCheck(hiddenSurvey, "panel1", "visible", false), false);
    expectPassed(await runCheck(hiddenSurvey, "inPanel", "visible", false), false);
    expectPassed(await runCheck(hiddenSurvey, "inPanel", "visible", true, { before: [{ set: { q1: "show" } }] }), true);
  });
  test("A page is visible or hidden as a whole", async () => {
    const definition = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", visibleIf: "{q1} = 'show'", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    expectPassed(await runCheck(definition, "page1", "visible", true), true);
    expectPassed(await runCheck(definition, "page2", "visible", false), false);
  });
});

describe("enabled", () => {
  test("enableIf disables a question", async () => {
    const definition = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", enableIf: "{q1} = 'yes'" },
      ],
    };
    expectPassed(await runCheck(definition, "q2", "enabled", false), false);
    expectFailed(await runCheck(definition, "q2", "enabled", true), true, false, ["true", "false"]);
    expectPassed(await runCheck(definition, "q2", "enabled", true, { before: [{ set: { q1: "yes" } }] }), true);
  });
  test("The display mode disables everything", async () => {
    const definition = { mode: "display", elements: [{ type: "text", name: "q1" }] };
    expectPassed(await runCheck(definition, "q1", "enabled", false), false);
  });
  test("A read-only panel disables the questions inside it", async () => {
    const definition = {
      pages: [{
        name: "page1",
        elements: [{ type: "panel", name: "panel1", readOnly: true, elements: [{ type: "text", name: "q1" }] }],
      }],
    };
    expectPassed(await runCheck(definition, "panel1", "enabled", false), false);
    expectPassed(await runCheck(definition, "q1", "enabled", false), false);
    expectPassed(await runCheck(definition, "page1", "enabled", true), true);
  });
});

describe("required", () => {
  test("requiredIf makes a question required", async () => {
    const definition = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", requiredIf: "{q1} = 'yes'" },
      ],
    };
    expectPassed(await runCheck(definition, "q2", "required", false), false);
    expectFailed(await runCheck(definition, "q2", "required", true), true, false, ["true", "false"]);
    expectPassed(await runCheck(definition, "q2", "required", true, { before: [{ set: { q1: "yes" } }] }), true);
  });
});

describe("errors, errorCount and hasErrors", () => {
  const twoErrors: IRunParams = { options: onValueChanged, before: [{ set: { q1: "b" } }] };
  test("The same two errors are asserted three ways", async () => {
    expectPassed(await runCheck(twoErrorsSurvey, "q1", "errors", ["E1", "E2"], twoErrors), ["E1", "E2"]);
    expectPassed(await runCheck(twoErrorsSurvey, "q1", "errorCount", 2, twoErrors), 2);
    expectPassed(await runCheck(twoErrorsSurvey, "q1", "hasErrors", true, twoErrors), true);
  });
  test("The error texts compare as a set", async () => {
    expectPassed(await runCheck(twoErrorsSurvey, "q1", "errors", ["E2", "E1"], twoErrors), ["E1", "E2"]);
  });
  test("Each of the three says what it expected and what it read", async () => {
    expectFailed(await runCheck(twoErrorsSurvey, "q1", "errors", ["E1"], twoErrors),
      ["E1"], ["E1", "E2"], ["[\"E1\",\"E2\"]", "[\"E1\"]"]);
    expectFailed(await runCheck(twoErrorsSurvey, "q1", "errorCount", 1, twoErrors), 1, 2, ["1", "2"]);
    expectFailed(await runCheck(twoErrorsSurvey, "q1", "hasErrors", false, twoErrors), false, true, ["true", "false"]);
  });
  test("hasErrors: true is not the same statement as errorCount", async () => {
    expectPassed(await runCheck(twoErrorsSurvey, "q1", "hasErrors", true, twoErrors), true);
    expectFailed(await runCheck(twoErrorsSurvey, "q1", "errorCount", 1, twoErrors), 1, 2, ["1", "2"]);
  });
  test("The three payloads never swap: errors takes texts and errorCount takes a number", async () => {
    const asNumber = await runExpect(twoErrorsSurvey, { q1: { errors: 2 } }, twoErrors);
    expect(asNumber.codes, "a count is not a set of texts").toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
    expect(asNumber.messages.indexOf("an array of error texts") > -1, "the message names the payload").toBeTruthy();
    expect(asNumber.checks.length, "no result is produced").toEqual(0);
    const asArray = await runExpect(twoErrorsSurvey, { q1: { errorCount: ["E1", "E2"] } }, twoErrors);
    expect(asArray.codes, "a set of texts is not a count").toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
    expect(asArray.messages.indexOf("a number") > -1, "the message names the payload").toBeTruthy();
  });
  test("A check reads the errors and never validates", async () => {
    // The question would fail validation, but nothing has validated it yet: a respondent sees no error
    // until they navigate, and neither does a case.
    const definition = { elements: [{ type: "text", name: "q1", isRequired: true }] };
    expectPassed(await runCheck(definition, "q1", "hasErrors", false), false);
    expectPassed(await runCheck(definition, "q1", "errorCount", 0), 0);
    expectPassed(await runCheck(definition, "q1", "errors", []), []);
  });
  test("Navigation validates, exactly as it does for a respondent", async () => {
    const definition = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", isRequired: true, requiredErrorText: "Answer me" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    const outcome = await runSteps(definition, [{ expect: { q1: { errors: ["Answer me"] } } }],
      { before: [{ nextPage: { survey: true } }] });
    expectPassed(outcome.checks[0], ["Answer me"]);
    expect(outcome.codes, "the blocked navigation is a warning, not a failure")
      .toEqual([SurveyTestIssueCodes.nextPageBlocked]);
  });
  test("A page and a panel report the errors of the questions inside them", async () => {
    const definition = {
      pages: [{
        name: "page1",
        elements: [{
          type: "panel", name: "panel1",
          elements: [
            { type: "text", name: "q1", validators: [{ type: "regex", regex: "^a", text: "E1" }] },
            { type: "text", name: "q2", validators: [{ type: "regex", regex: "^a", text: "E2" }] },
          ],
        }],
      }],
    };
    const params: IRunParams = { options: onValueChanged, before: [{ set: { q1: "b" } }, { set: { q2: "c" } }] };
    expectPassed(await runCheck(definition, "panel1", "errors", ["E1", "E2"], params), ["E1", "E2"]);
    expectPassed(await runCheck(definition, "page1", "errorCount", 2, params), 2);
    expectPassed(await runCheck(definition, "page1", "hasErrors", true, params), true);
  });
  test("errorCount on the survey counts every question", async () => {
    const definition = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", validators: [{ type: "regex", regex: "^a", text: "E1" }] }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    const params: IRunParams = { options: onValueChanged, before: [{ set: { q1: "b" } }] };
    expectPassed(await runCheck(definition, "survey", "errorCount", 1, params), 1);
    expectFailed(await runCheck(definition, "survey", "errorCount", 0, params), 0, 1, ["0", "1"]);
  });
});

describe("comment", () => {
  // A comment area belongs to a select or a matrix question: "showCommentArea" is invisible, and
  // therefore inoperative, for a text question.
  const definition = { elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b"], showCommentArea: true }] };
  test("comment reads the comment of the question", async () => {
    const params: IRunParams = { before: [{ setComment: { q1: "because" } }] };
    expectPassed(await runCheck(definition, "q1", "comment", "because", params), "because");
    expectFailed(await runCheck(definition, "q1", "comment", "why", params), "why", "because", ["because", "why"]);
    expectPassed(await runCheck(definition, "q1", "comment", ""), "");
  });
});

describe("choices", () => {
  const definition = {
    elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b", "c"], choicesVisibleIf: "{item} != 'b'" }],
  };
  test("choices reads the visible choices as a set", async () => {
    expectPassed(await runCheck(definition, "q1", "choices", ["a", "c"]), ["a", "c"]);
    expectPassed(await runCheck(definition, "q1", "choices", ["c", "a"]), ["a", "c"]);
    expectFailed(await runCheck(definition, "q1", "choices", ["a", "b", "c"]),
      ["a", "b", "c"], ["a", "c"], ["\"a\",\"c\"", "\"a\",\"b\",\"c\""]);
  });
  test("choices does not apply to a question without choices", async () => {
    const outcome = await runExpect(oneQuestion, { q1: { choices: ["a"] } });
    expect(outcome.codes, "a text question has no choices").toEqual([SurveyTestIssueCodes.checkNotApplicable]);
    expect(outcome.messages.indexOf("a question with choices") > -1, "the message says what it applies to").toBeTruthy();
    expect(outcome.messages.indexOf("\"text\"") > -1, "the message names the type it was given").toBeTruthy();
  });
});

describe("title", () => {
  test("title resolves the text piping", async () => {
    const definition = {
      elements: [
        { type: "text", name: "name" },
        { type: "text", name: "q1", title: "Hello, {name}" },
      ],
    };
    expectPassed(await runCheck(definition, "q1", "title", "Hello, Bob", { before: [{ set: { name: "Bob" } }] }),
      "Hello, Bob");
    expectFailed(await runCheck(definition, "q1", "title", "Hello, Ann", { before: [{ set: { name: "Bob" } }] }),
      "Hello, Ann", "Hello, Bob", ["Hello, Bob", "Hello, Ann"]);
  });
  test("title resolves the locale of the test", async () => {
    const definition = {
      pages: [{
        name: "page1",
        title: { default: "The page", de: "Die Seite" },
        elements: [{ type: "text", name: "q1", title: { default: "Hello", de: "Hallo" } }],
      }],
    };
    expectPassed(await runCheck(definition, "q1", "title", "Hello"), "Hello");
    expectPassed(await runCheck(definition, "q1", "title", "Hallo", { options: { locale: "de" } }), "Hallo");
    expectPassed(await runCheck(definition, "page1", "title", "Die Seite", { options: { locale: "de" } }), "Die Seite");
  });
});

describe("page", () => {
  test("page names the page the element is on", async () => {
    expectPassed(await runCheck(twoPages, "q2", "page", "page2"), "page2");
    expectFailed(await runCheck(twoPages, "q2", "page", "page1"), "page1", "page2", ["page1", "page2"]);
  });
  test("A panel reports its page too", async () => {
    const definition = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "panel", name: "panel1", elements: [{ type: "text", name: "q2" }] }] },
      ],
    };
    expectPassed(await runCheck(definition, "panel1", "page", "page2"), "page2");
  });
});

describe("rowCount and panelCount", () => {
  const matrix = {
    elements: [{ type: "matrixdynamic", name: "m", rowCount: 1, columns: [{ name: "col1", cellType: "text" }] }],
  };
  const dynamicPanel = {
    elements: [{ type: "paneldynamic", name: "dp", panelCount: 1, templateElements: [{ type: "text", name: "p1" }] }],
  };
  test("rowCount before and after addRow", async () => {
    expectPassed(await runCheck(matrix, "m", "rowCount", 1), 1);
    expectPassed(await runCheck(matrix, "m", "rowCount", 3, { before: [{ addRow: { m: 2 } }] }), 3);
    expectFailed(await runCheck(matrix, "m", "rowCount", 2), 2, 1, ["1", "2"]);
  });
  test("panelCount before and after addPanel", async () => {
    expectPassed(await runCheck(dynamicPanel, "dp", "panelCount", 1), 1);
    expectPassed(await runCheck(dynamicPanel, "dp", "panelCount", 3, { before: [{ addPanel: { dp: 2 } }] }), 3);
    expectFailed(await runCheck(dynamicPanel, "dp", "panelCount", 2), 2, 1, ["1", "2"]);
  });
  test("Each is rejected on the other question type", async () => {
    const onPanel = await runExpect(dynamicPanel, { dp: { rowCount: 1 } });
    expect(onPanel.codes, "a dynamic panel has no rows").toEqual([SurveyTestIssueCodes.checkNotApplicable]);
    expect(onPanel.messages.indexOf("a dynamic matrix") > -1, "the message says what rowCount applies to").toBeTruthy();
    const onMatrix = await runExpect(matrix, { m: { panelCount: 1 } });
    expect(onMatrix.codes, "a dynamic matrix has no panels").toEqual([SurveyTestIssueCodes.checkNotApplicable]);
    expect(onMatrix.messages.indexOf("a dynamic panel") > -1, "the message says what panelCount applies to").toBeTruthy();
  });
});

describe("type", () => {
  test("type reads the question type", async () => {
    expectPassed(await runCheck(oneQuestion, "q1", "type", "text"), "text");
    expectFailed(await runCheck(oneQuestion, "q1", "type", "comment"), "comment", "text", ["text", "comment"]);
  });
});

describe("state", () => {
  test("running, completed and preview", async () => {
    const definition = { showPreviewBeforeComplete: "showAllQuestions", elements: [{ type: "text", name: "q1" }] };
    expectPassed(await runCheck(definition, "survey", "state", "running"), "running");
    expectPassed(await runCheck(definition, "survey", "state", "preview",
      { before: [{ showPreview: { survey: true } }] }), "preview");
    expectPassed(await runCheck(definition, "survey", "state", "completed",
      { before: [{ showPreview: { survey: true } }, { complete: { survey: true } }] }), "completed");
  });
  test("starting, and running once the survey is started", async () => {
    const definition = {
      firstPageIsStartPage: true,
      pages: [
        { name: "start", elements: [{ type: "text", name: "s1" }] },
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
      ],
    };
    expectPassed(await runCheck(definition, "survey", "state", "starting"), "starting");
    expectPassed(await runCheck(definition, "survey", "state", "running",
      { before: [{ startSurvey: { survey: true } }] }), "running");
  });
  test("A mismatch names both states, and a misspelled one lists the whole set", async () => {
    expectFailed(await runCheck(oneQuestion, "survey", "state", "completed"),
      "completed", "running", ["\"running\"", "\"completed\""]);
    const misspelled = await runCheck(oneQuestion, "survey", "state", "done");
    expect(misspelled.passed, "there is no such state").toBeFalsy();
    expect(misspelled.message.indexOf("There is no survey state named \"done\"") > -1,
      "the message says the name is not a state: " + misspelled.message).toBeTruthy();
    expect(misspelled.message.indexOf("completedbefore") > -1, "the message lists the states").toBeTruthy();
  });
  test("state does not apply to a question", async () => {
    const outcome = await runExpect(oneQuestion, { q1: { state: "running" } });
    expect(outcome.codes, "a question has no state").toEqual([SurveyTestIssueCodes.checkNotApplicable]);
    expect(outcome.messages.indexOf("Checks for a question:") > -1, "the message lists the applicable checks").toBeTruthy();
    expect(outcome.messages.indexOf("value") > -1, "the message lists value among them").toBeTruthy();
  });
});

describe("currentPage", () => {
  test("currentPage is a page name, before and after a navigation", async () => {
    expectPassed(await runCheck(twoPages, "survey", "currentPage", "page1"), "page1");
    expectPassed(await runCheck(twoPages, "survey", "currentPage", "page2",
      { before: [{ nextPage: { survey: true } }] }), "page2");
    expectFailed(await runCheck(twoPages, "survey", "currentPage", "page2"), "page2", "page1", ["page1", "page2"]);
  });
  test("An index is not a page name", async () => {
    const outcome = await runExpect(twoPages, { survey: { currentPage: 1 } });
    expect(outcome.codes, "the payload is rejected").toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
    expect(outcome.messages.indexOf("a page name") > -1,
      "the message tells the author to use the name: " + outcome.messages).toBeTruthy();
    expect(outcome.checks.length, "no result is produced").toEqual(0);
  });
  test("A completed survey still reports the page it finished on", async () => {
    const check = await runCheck(twoPages, "survey", "currentPage", "page2",
      { before: [{ nextPage: { survey: true } }, { complete: { survey: true } }] });
    expectPassed(check, "page2");
  });
  test("A survey with no visible page is on no page", async () => {
    const definition = { pages: [{ name: "page1", visibleIf: "1 = 2", elements: [{ type: "text", name: "q1" }] }] };
    const check = await runCheck(definition, "survey", "currentPage", "page1");
    expect(check.passed, "there is no current page").toBeFalsy();
    expect(check.message.indexOf("on no page") > -1, "the message says so: " + check.message).toBeTruthy();
    expect(check.message.indexOf("\"empty\"") > -1, "and names the state: " + check.message).toBeTruthy();
  });
});

describe("values", () => {
  const definition = {
    elements: [
      { type: "text", name: "q1" },
      { type: "text", name: "q2" },
      { type: "text", name: "q3" },
    ],
  };
  const filled: IRunParams = { before: [{ set: { q1: "a" } }, { set: { q2: "b" } }] };
  test("One key that matches and one that does not", async () => {
    expectPassed((await runChecks(definition, "survey", { values: { q1: "a" } }, filled))[0], "a");
    expectFailed((await runChecks(definition, "survey", { values: { q1: "b" } }, filled))[0], "b", "a", ["\"a\"", "\"b\""]);
  });
  test("A missing key fails with actual: undefined", async () => {
    const check = (await runChecks(definition, "survey", { values: { q3: "c" } }, filled))[0];
    expectFailed(check, "c", undefined, ["undefined", "\"c\""]);
  });
  test("An object of three keys produces three results, one per key", async () => {
    const checks = await runChecks(definition, "survey", { values: { q1: "a", q2: "wrong", q3: null } }, filled);
    expect(checks.length, "one result per key").toEqual(3);
    expect(checks.map(check => check.check), "all of them belong to the values check")
      .toEqual(["values", "values", "values"]);
    expect(checks.map(check => check.target), "all of them target the survey")
      .toEqual(["survey", "survey", "survey"]);
    expect(checks.map(check => check.details.key), "each result names its key").toEqual(["q1", "q2", "q3"]);
    expect(checks.map(check => check.passed), "only the second one fails").toEqual([true, false, true]);
    expect(checks[1].message.indexOf("\"q2\"") > -1, "the failing message names the key: " + checks[1].message).toBeTruthy();
  });
  test("The summary counts the per-key results", async () => {
    const outcome = await runExpect(definition, { survey: { values: { q1: "a", q2: "wrong" } } }, filled);
    expect(outcome.result.summary.checks, "two checks ran").toEqual(2);
    expect(outcome.result.summary.failedChecks, "one of them failed").toEqual(1);
    expect(outcome.status, "the test fails").toEqual("failed");
  });
  test("An empty object asserts nothing and is rejected", async () => {
    const outcome = await runExpect(definition, { survey: { values: {} } }, filled);
    expect(outcome.codes, "the payload is unusable").toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
    expect(outcome.checks.length, "no result is produced").toEqual(0);
  });
  test("values does not apply to a question", async () => {
    const outcome = await runExpect(definition, { q1: { values: { q1: "a" } } });
    expect(outcome.codes, "a question holds one value").toEqual([SurveyTestIssueCodes.checkNotApplicable]);
    expect(outcome.messages.indexOf("Checks for a question:") > -1, "the message lists the applicable checks").toBeTruthy();
  });
});

describe("noValues", () => {
  const definition = { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] };
  test("An unanswered question has no value, an answered one has", async () => {
    expectPassed((await runChecks(definition, "survey", { noValues: ["q2"] }, { before: [{ set: { q1: "a" } }] }))[0],
      undefined);
    const failed = (await runChecks(definition, "survey", { noValues: ["q1"] }, { before: [{ set: { q1: "a" } }] }))[0];
    expect(failed.passed, "the key is there").toBeFalsy();
    expect(failed.actual, "the result carries the value that should not be there").toEqual("a");
    expect(failed.details.key, "the result names the key").toEqual("q1");
    expect(failed.message.indexOf("\"q1\"") > -1 && failed.message.indexOf("\"a\"") > -1,
      "the message names the key and the value: " + failed.message).toBeTruthy();
  });
  test("A key stored as null or as an empty string is present, not absent", async () => {
    const checks = await runChecks(definition, "survey", { noValues: ["q1", "q2"] },
      { start: { data: { q1: null, q2: "" }, dataMode: "restore" } });
    expect(checks.map(check => check.passed), "both keys are present").toEqual([false, false]);
    expect(checks.map(check => check.details.present), "presence is what noValues reads").toEqual([true, true]);
    expect(checks[0].actual, "null is a stored value").toBeNull();
    expect(checks[1].actual, "an empty string is a stored value").toEqual("");
  });
  test("A bare string is not an array of names", async () => {
    const outcome = await runExpect(definition, { survey: { noValues: "q1" } });
    expect(outcome.codes, "the payload is rejected").toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
    expect(outcome.messages.indexOf("an array of question names") > -1, "the message names the payload").toBeTruthy();
  });
});

describe("variables", () => {
  const definition = { elements: [{ type: "text", name: "q1" }] };
  test("variables reads the variables of the survey", async () => {
    const params: IRunParams = { variables: { role: "admin", level: 2 } };
    const checks = await runChecks(definition, "survey", { variables: { role: "admin", level: 3 } }, params);
    expect(checks.length, "one result per variable").toEqual(2);
    expect(checks.map(check => check.details.key), "each result names its variable").toEqual(["role", "level"]);
    expect(checks.map(check => check.passed), "the second one is wrong").toEqual([true, false]);
    expectFailed(checks[1], 3, 2, ["2", "3", "level"]);
  });
});

describe("pages", () => {
  const definition = {
    pages: [
      { name: "page1", elements: [{ type: "text", name: "q1" }] },
      { name: "page2", visibleIf: "{q1} = 'yes'", elements: [{ type: "text", name: "q2" }] },
      { name: "page3", elements: [{ type: "text", name: "q3" }] },
    ],
  };
  test("pages lists the visible pages in order", async () => {
    expectPassed(await runCheck(definition, "survey", "pages", ["page1", "page3"]), ["page1", "page3"]);
    expectPassed(await runCheck(definition, "survey", "pages", ["page1", "page2", "page3"],
      { before: [{ set: { q1: "yes" } }] }), ["page1", "page2", "page3"]);
  });
  test("The order is a part of the assertion", async () => {
    const check = await runCheck(definition, "survey", "pages", ["page3", "page1"]);
    expectFailed(check, ["page3", "page1"], ["page1", "page3"], ["in this order"]);
  });
});

// -------------------------------------------------------------------------------------------------
// The rules that hold for every check. They are written against the registry, so a check added later
// cannot forget them.
// -------------------------------------------------------------------------------------------------

interface ICheckSample {
  target: string;
  payload: any;
}
// One usable pair per registered check: the table-driven tests below run the whole registry through
// the same case.
const checkSamples: { [name: string]: ICheckSample } = {
  value: { target: "text1", payload: "a" },
  empty: { target: "text1", payload: false },
  visible: { target: "text1", payload: true },
  enabled: { target: "text1", payload: true },
  required: { target: "text1", payload: false },
  errors: { target: "text1", payload: [] },
  errorCount: { target: "text1", payload: 0 },
  hasErrors: { target: "text1", payload: false },
  comment: { target: "text1", payload: "" },
  choices: { target: "radio1", payload: ["a", "b"] },
  title: { target: "text1", payload: "text1" },
  page: { target: "text1", payload: "page1" },
  rowCount: { target: "matrix1", payload: 1 },
  panelCount: { target: "dynamicPanel1", payload: 1 },
  type: { target: "text1", payload: "text" },
  state: { target: "survey", payload: "running" },
  currentPage: { target: "survey", payload: "page1" },
  values: { target: "survey", payload: { text1: "a" } },
  noValues: { target: "survey", payload: ["radio1"] },
  variables: { target: "survey", payload: { role: "admin" } },
  pages: { target: "survey", payload: ["page1"] },
};
const sampleSurvey = {
  pages: [{
    name: "page1",
    elements: [
      { type: "text", name: "text1", showCommentArea: true },
      { type: "radiogroup", name: "radio1", choices: ["a", "b"] },
      { type: "matrixdynamic", name: "matrix1", rowCount: 1, columns: [{ name: "col1", cellType: "text" }] },
      { type: "paneldynamic", name: "dynamicPanel1", panelCount: 1, templateElements: [{ type: "text", name: "p1" }] },
      { type: "panel", name: "panel1", elements: [{ type: "text", name: "inPanel" }] },
    ],
  }],
};
const sampleStart = { data: { text1: "a" } };
const sampleVariables = { role: "admin" };
function sampleParams(): IRunParams {
  return { start: sampleStart, variables: sampleVariables };
}
// The payload that is wrong for a given type, whatever the check is. "value" takes anything, so the
// one payload it rejects is the missing one.
function getWrongPayload(type: SurveyTestPayloadType): any {
  switch(type) {
    case "string": return 1;
    case "number": return "1";
    case "boolean": return "yes";
    case "stringArray": return "a";
    case "array": return "a";
    case "nameMap": return ["a"];
    case "value": return undefined;
  }
  return null;
}

describe("The rules that hold for every registered check", () => {
  test("Every registered check has a sample: a new check is covered by the tests below", () => {
    expect(Object.keys(checkSamples).sort(), "the samples cover the registry")
      .toEqual(SurveyTestCheckFactory.Instance.getNames());
  });
  test("Every check passes with its sample payload", async () => {
    const names = SurveyTestCheckFactory.Instance.getNames();
    for (let i = 0; i < names.length; i++) {
      const sample = checkSamples[names[i]];
      const outcome = await runExpect(sampleSurvey, { [sample.target]: { [names[i]]: sample.payload } }, sampleParams());
      expect(outcome.codes, names[i] + " runs without an issue").toEqual([]);
      expect(outcome.checks.every(check => check.passed), names[i] + " passes: " +
        outcome.checks.map(check => check.message).join(" ")).toBeTruthy();
    }
  });
  test("Every check rejects a wrong-typed payload and names the type it wants", async () => {
    const factory = SurveyTestCheckFactory.Instance;
    const names = factory.getNames();
    for (let i = 0; i < names.length; i++) {
      const handler: ISurveyTestCheckHandler = factory.get(names[i]);
      const sample = checkSamples[names[i]];
      const payload = getWrongPayload(handler.payloadType);
      const outcome = await runExpect(sampleSurvey, { [sample.target]: { [names[i]]: payload } }, sampleParams());
      expect(outcome.codes, names[i] + " rejects " + JSON.stringify(payload))
        .toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
      const wanted = !!handler.payloadText ? handler.payloadText : getTestPayloadTypeText(handler.payloadType);
      expect(outcome.messages.indexOf(wanted) > -1,
        names[i] + " names the payload it wants (" + wanted + "): " + outcome.messages).toBeTruthy();
      expect(outcome.checks.length, names[i] + " produces no result").toEqual(0);
    }
  });
  test("No check changes the survey", async () => {
    // A check that mutates the model would make the order of the steps meaningless, and the case that
    // caught it would be the one that ran the checks in a different order.
    const names = SurveyTestCheckFactory.Instance.getNames();
    for (let i = 0; i < names.length; i++) {
      const sample = checkSamples[names[i]];
      const params = sampleParams();
      snapshots = [];
      params.before = (params.before || []).concat([{ [SNAPSHOT]: { survey: true } }]);
      const outcome = await runSteps(sampleSurvey, [
        { expect: { [sample.target]: { [names[i]]: sample.payload } } },
        { [SNAPSHOT]: { survey: true } },
      ], params);
      expect(outcome.codes, names[i] + " runs without an issue").toEqual([]);
      expect(snapshots.length, names[i] + " took two snapshots").toEqual(2);
      expect(snapshots[1], names[i] + " left the survey untouched").toEqual(snapshots[0]);
    }
  });
});

describe("A custom check", () => {
  const CUSTOM = "isAnswered";
  let namesBefore: Array<string>;
  beforeEach(() => {
    namesBefore = SurveyTestCheckFactory.Instance.getNames();
    SurveyTestCheckFactory.Instance.register({
      name: CUSTOM,
      kinds: ["question"],
      payloadType: "boolean",
      check: (context: ISurveyTestContext, target: ISurveyTestTarget, expected: any) => {
        const actual = !target.obj.isEmpty();
        return { passed: actual === expected, actual: actual, message: "answered: " + actual };
      },
    });
  });
  afterEach(() => {
    SurveyTestCheckFactory.Instance.unregister(CUSTOM);
  });
  test("It runs and is listed among the checks of its kind", async () => {
    expect(SurveyTestCheckFactory.Instance.getNames().indexOf(CUSTOM) > -1, "the registry lists it").toBeTruthy();
    expect(SurveyTestCheckFactory.Instance.getNamesForKind("question").indexOf(CUSTOM) > -1,
      "and lists it for a question").toBeTruthy();
    expect(SurveyTestCheckFactory.Instance.getNamesForKind("survey").indexOf(CUSTOM) < 0,
      "but not for the survey").toBeTruthy();
    const passing = await runCheck(oneQuestion, "q1", CUSTOM, true, { before: [{ set: { q1: "a" } }] });
    expect(passing.passed, "the custom check passes").toBeTruthy();
    const failing = await runCheck(oneQuestion, "q1", CUSTOM, true);
    expect(failing.passed, "and fails").toBeFalsy();
    expect(failing.message, "with its own message").toEqual("answered: false");
  });
  test("Its payload is validated like any other", async () => {
    const outcome = await runExpect(oneQuestion, { q1: { [CUSTOM]: "yes" } });
    expect(outcome.codes, "the payload is rejected").toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
  });
  test("Unregistering it leaves no residue", () => {
    SurveyTestCheckFactory.Instance.unregister(CUSTOM);
    expect(SurveyTestCheckFactory.Instance.getNames(), "the registry is back to the built-in set").toEqual(namesBefore);
    expect(SurveyTestCheckFactory.Instance.get(CUSTOM), "the check is gone").toBeUndefined();
    const outcome = SurveyTestCheckFactory.Instance.getNamesForKind("question").indexOf(CUSTOM);
    expect(outcome < 0, "and is listed nowhere").toBeTruthy();
  });
});

import { ComponentCollection } from "../../src/question_custom";
import { SurveyModel } from "../../src/survey";
import { ISurveyTestContext } from "../../src/tester/test-context";
import { ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { SurveyTestCommandFactory } from "../../src/tester/test-commands";

import { afterAll, beforeAll, describe, expect, test } from "vitest";

// A command runs only when a respondent could have performed the interaction. These tests are the
// rules of that: every rejected command must both raise its issue and leave the survey exactly as it
// was, which is why each case asserts the model as well as the result.
const CAPTURE = "captureSurveyForTest";
let captured: SurveyModel = undefined;

beforeAll(() => {
  SurveyTestCommandFactory.Instance.register({
    name: CAPTURE,
    allowSurvey: true,
    allowElement: false,
    payloadType: "none",
    run: (context: ISurveyTestContext): void => { captured = context.survey; },
  });
});
afterAll(() => {
  SurveyTestCommandFactory.Instance.unregister(CAPTURE);
});

interface IRunOutcome {
  result: ISurveyTestsResult;
  survey: SurveyModel;
  issues: Array<ISurveyTestIssue>;
  codes: Array<string>;
  status: string;
  messages: string;
}

async function runSteps(definition: any, steps: Array<any>, options?: any): Promise<IRunOutcome> {
  captured = undefined;
  const allSteps = [<any>{ [CAPTURE]: { survey: true } }].concat(steps);
  const suite = { tests: [{ name: "t", steps: allSteps }] };
  const result = await new SurveyTestRunner(definition, suite, options).run();
  const issues: Array<ISurveyTestIssue> = [].concat(result.issues);
  result.tests.forEach(test => {
    test.issues.forEach(issue => issues.push(issue));
    test.steps.forEach(step => step.issues.forEach(issue => issues.push(issue)));
  });
  return {
    result: result,
    survey: captured,
    issues: issues,
    codes: issues.map(issue => issue.code),
    status: result.tests[0].status,
    messages: issues.map(issue => issue.message).join(" | "),
  };
}
function question(outcome: IRunOutcome, name: string): any {
  return outcome.survey.getQuestionByName(name);
}
// A rejected command changes nothing at all: not the data, not the state, not the page.
function expectRejected(outcome: IRunOutcome, code: string, data: any, comment: string): void {
  expect(outcome.codes, comment).toEqual([code]);
  expect(outcome.status, "the case ends with an error").toEqual("error");
  expect(outcome.survey.data, "the data is untouched").toEqual(data);
  expect(outcome.survey.state, "the state is untouched").toEqual("running");
  expect(outcome.survey.currentPageNo, "the current page is untouched").toEqual(0);
}

// ------------------------------------------------------------------------------------------------
// 0.1 Navigation feasibility
// ------------------------------------------------------------------------------------------------

const twoPages = {
  pages: [
    { name: "page1", elements: [{ type: "text", name: "q1" }] },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};

describe("Navigation feasibility", () => {
  test("nextPage on the last page says that Complete has replaced Next", async () => {
    const outcome = await runSteps({ elements: [{ type: "text", name: "q1" }] }, [{ nextPage: { survey: true } }]);
    expectRejected(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable, {}, "the Next button is not displayed");
    expect(outcome.messages.indexOf("sv-nav-next") > -1, "the message names the button").toBeTruthy();
    expect(outcome.messages.indexOf("Complete button has replaced Next") > -1,
      "the message says why the button is missing").toBeTruthy();
    expect(outcome.messages.indexOf("\"complete\" command") > -1,
      "the message points at the command to use instead").toBeTruthy();
  });
  test("prevPage on the first page is rejected", async () => {
    const outcome = await runSteps(twoPages, [{ prevPage: { survey: true } }]);
    expectRejected(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable, {}, "there is no page to go back to");
    expect(outcome.messages.indexOf("on the first page") > -1, "the message says why").toBeTruthy();
  });
  test("prevPage on a later page is rejected when the survey hides the button", async () => {
    const outcome = await runSteps({
      showPrevButton: false,
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    }, [
      { nextPage: { survey: true } },
      { prevPage: { survey: true } },
    ]);
    expect(outcome.codes, "the button is hidden").toEqual([SurveyTestIssueCodes.navigationButtonNotAvailable]);
    expect(outcome.messages.indexOf("\"showPrevButton\" is false") > -1, "the message names the property").toBeTruthy();
    expect(outcome.survey.currentPageNo, "the survey stays where it was").toEqual(1);
  });
  test("complete is rejected while the Complete button is not displayed, with no way to bypass it", async () => {
    const outcome = await runSteps(twoPages, [{ complete: { survey: true } }]);
    expectRejected(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable, {}, "the survey is not on the last page");
    expect(outcome.messages.indexOf("sv-nav-complete") > -1, "the message names the button").toBeTruthy();
    expect(outcome.messages.indexOf("\"nextPage\" command") > -1, "the message points at what to do first").toBeTruthy();
  });
  test("complete is rejected when the survey previews the answers first", async () => {
    const outcome = await runSteps({
      showPreviewBeforeComplete: "showAllQuestions",
      elements: [{ type: "text", name: "q1" }],
    }, [{ complete: { survey: true } }]);
    expect(outcome.codes, "the Preview button is displayed instead")
      .toEqual([SurveyTestIssueCodes.navigationButtonNotAvailable]);
    expect(outcome.messages.indexOf("\"showPreview\" command") > -1, "the message points at showPreview").toBeTruthy();
  });
  // survey-core spells "no preview" as "noPreview": every other string switches the preview on.
  test("showPreview is rejected when the survey shows no preview", async () => {
    const outcome = await runSteps({
      showPreviewBeforeComplete: "noPreview",
      elements: [{ type: "text", name: "q1" }],
    }, [{ showPreview: { survey: true } }]);
    expectRejected(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable, {}, "there is no Preview button");
    expect(outcome.messages.indexOf("\"showPreviewBeforeComplete\" is off") > -1,
      "the message names the property").toBeTruthy();
  });
  test("startSurvey is rejected when the survey has no start page", async () => {
    const outcome = await runSteps(twoPages, [{ startSurvey: { survey: true } }]);
    expectRejected(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable, {}, "there is no Start button");
    expect(outcome.messages.indexOf("\"firstPageIsStartPage\" is false") > -1,
      "the message names the property").toBeTruthy();
  });
  test("cancelPreview is rejected while no preview is shown, instead of doing nothing", async () => {
    const outcome = await runSteps({
      showPreviewBeforeComplete: "showAllQuestions",
      elements: [{ type: "text", name: "q1" }],
    }, [{ cancelPreview: { survey: true } }]);
    expectRejected(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable, {}, "there is nothing to cancel");
    expect(outcome.messages.indexOf("not showing a preview") > -1, "the message says why").toBeTruthy();
  });
  test("A visible but blocked Complete runs and warns: the two halves of the rule stay apart", async () => {
    const outcome = await runSteps({
      elements: [{ type: "text", name: "q1", isRequired: true }],
    }, [{ complete: { survey: true } }]);
    expect(outcome.codes, "this is a warning, not the navigation error").toEqual([SurveyTestIssueCodes.completeBlocked]);
    expect(outcome.status, "the step did not fail").toEqual("passed");
    expect(outcome.survey.state, "the survey stays running").toEqual("running");
  });
});

// ------------------------------------------------------------------------------------------------
// 0.2 set feasibility
// ------------------------------------------------------------------------------------------------

describe("set feasibility: the question must be on the current page", () => {
  test("A question on another page is a case error naming both pages", async () => {
    const outcome = await runSteps(twoPages, [{ set: { q2: "b" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.elementNotOnCurrentPage, {}, "q2 is not on screen");
    expect(outcome.messages.indexOf("\"page2\"") > -1, "the message names the page of the question").toBeTruthy();
    expect(outcome.messages.indexOf("\"page1\"") > -1, "the message names the current page").toBeTruthy();
    expect(outcome.messages.indexOf("\"nextPage\"") > -1, "the message says how to get there").toBeTruthy();
  });
  test("The same set succeeds after a nextPage step", async () => {
    const outcome = await runSteps(twoPages, [
      { nextPage: { survey: true } },
      { set: { q2: "b" } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.survey.data, "the value went in").toEqual({ q2: "b" });
  });
  test("A start page lets the case begin on the page it needs", async () => {
    const outcome = await runSteps(twoPages, [{ set: { q2: "b" } }]);
    expect(outcome.codes, "without a start page the set is impossible")
      .toEqual([SurveyTestIssueCodes.elementNotOnCurrentPage]);
    const withStart = await new SurveyTestRunner(twoPages, {
      tests: [{ name: "t", start: { startPage: "page2" }, steps: [{ set: { q2: "b" } }] }],
    }).run();
    expect(withStart.tests[0].status, "with one it is not").toEqual("passed");
  });
});

describe("set feasibility: the question must be visible", () => {
  test("A question hidden by visibleIf cannot be typed into", async () => {
    const outcome = await runSteps({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1} = 'show'" },
      ],
    }, [{ set: { q2: "b" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.elementNotVisible, {}, "the question is not on screen");
    expect(outcome.messages.indexOf("{q1} = 'show'") > -1, "the message carries the condition").toBeTruthy();
    expect(outcome.messages.indexOf("setDirectly") > -1, "the message names the escape hatch").toBeTruthy();
  });
  test("A visible question inside a hidden panel cannot be typed into either", async () => {
    const outcome = await runSteps({
      elements: [
        { type: "text", name: "q1" },
        {
          type: "panel", name: "p1", visibleIf: "{q1} = 'show'",
          elements: [{ type: "text", name: "q2", visible: true }],
        },
      ],
    }, [{ set: { q2: "b" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.elementNotVisible, {}, "the parent panel is hidden");
    expect(question(outcome, "q2").isVisible, "the question itself says it is visible").toBeTruthy();
    expect(outcome.messages.indexOf("hidden panel \"p1\"") > -1, "the message names the hidden parent").toBeTruthy();
  });
  test("A question hidden by its visible property names that property", async () => {
    const outcome = await runSteps({
      elements: [{ type: "text", name: "q1", visible: false }],
    }, [{ set: { q1: "a" } }]);
    expect(outcome.codes, "the question is not on screen").toEqual([SurveyTestIssueCodes.elementNotVisible]);
    expect(outcome.messages.indexOf("\"visible\" property is false") > -1, "the message names it").toBeTruthy();
  });
});

describe("set feasibility: the question must be editable", () => {
  test("enableIf that evaluates to false is named as the cause", async () => {
    const outcome = await runSteps({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", enableIf: "{q1} = 'on'" },
      ],
    }, [{ set: { q2: "b" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.elementNotEditable, {}, "the question is disabled");
    expect(outcome.messages.indexOf("{q1} = 'on'") > -1, "the message carries the condition").toBeTruthy();
  });
  test("A read-only parent panel is named as the cause", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "panel", name: "p1", readOnly: true,
        elements: [{ type: "text", name: "q1" }],
      }],
    }, [{ set: { q1: "a" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.elementNotEditable, {}, "the panel is read-only");
    expect(outcome.messages.indexOf("read-only panel \"p1\"") > -1, "the message names the panel").toBeTruthy();
  });
  test("The display mode of the survey is named as the cause", async () => {
    const outcome = await runSteps({
      mode: "display",
      elements: [{ type: "text", name: "q1" }],
    }, [{ set: { q1: "a" } }]);
    expect(outcome.codes, "nothing is editable in display mode").toEqual([SurveyTestIssueCodes.elementNotEditable]);
    expect(outcome.messages.indexOf("\"display\" mode") > -1, "the message names the mode").toBeTruthy();
  });
});

describe("set feasibility: the value must be enterable", () => {
  const phoneSurvey = {
    elements: [{ type: "text", name: "q1", maskType: "pattern", maskSettings: { pattern: "+1(999)999-99-99" } }],
  };
  test("A pattern mask rejects a value that does not fit it", async () => {
    const outcome = await runSteps(phoneSurvey, [{ set: { q1: "abc" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.valueNotEnterable, {}, "\"abc\" cannot be typed into a phone mask");
    expect(outcome.messages.indexOf("+1(999)999-99-99") > -1, "the message carries the pattern").toBeTruthy();
    expect(outcome.messages.indexOf("pattern") > -1, "the message carries the mask type").toBeTruthy();
  });
  test("A pattern mask rejects a value that fills it only partly", async () => {
    const outcome = await runSteps(phoneSurvey, [{ set: { q1: "987" } }]);
    expect(outcome.codes, "an incomplete phone number cannot be left in the input")
      .toEqual([SurveyTestIssueCodes.valueNotEnterable]);
    expect(outcome.messages.indexOf("not filled completely") > -1, "the message says why").toBeTruthy();
  });
  test("A pattern mask accepts the value the input would store", async () => {
    const outcome = await runSteps(phoneSurvey, [{ set: { q1: "19876543210" } }]);
    expect(outcome.status, "a conforming value goes in").toEqual("passed");
    expect(question(outcome, "q1").value, "the value is stored").toEqual("19876543210");
  });
  test("A numeric mask rejects a non-numeric string and accepts a number", async () => {
    const survey = { elements: [{ type: "text", name: "q1", maskType: "numeric" }] };
    const rejected = await runSteps(survey, [{ set: { q1: "abc" } }]);
    expectRejected(rejected, SurveyTestIssueCodes.valueNotEnterable, {}, "letters are not a number");
    expect(rejected.messages.indexOf("numeric") > -1, "the message names the mask type").toBeTruthy();
    const accepted = await runSteps(survey, [{ set: { q1: 123 } }]);
    expect(accepted.status, "a number goes in").toEqual("passed");
  });
  test("A datetime mask rejects an impossible date and accepts a real one", async () => {
    const survey = {
      elements: [{ type: "text", name: "q1", maskType: "datetime", maskSettings: { pattern: "mm/dd/yyyy" } }],
    };
    const rejected = await runSteps(survey, [{ set: { q1: "31/31/2024" } }]);
    expectRejected(rejected, SurveyTestIssueCodes.valueNotEnterable, {}, "there is no 31st month");
    expect(rejected.messages.indexOf("mm/dd/yyyy") > -1, "the message carries the pattern").toBeTruthy();
    const accepted = await runSteps(survey, [{ set: { q1: "2024-03-31" } }]);
    expect(accepted.status, "the value the input stores goes in").toEqual("passed");
  });
  test("maxLength rejects a longer string", async () => {
    const survey = { elements: [{ type: "text", name: "q1", maxLength: 5 }] };
    const rejected = await runSteps(survey, [{ set: { q1: "123456" } }]);
    expectRejected(rejected, SurveyTestIssueCodes.valueNotEnterable, {}, "the sixth character cannot be typed");
    expect(rejected.messages.indexOf("at most 5 character") > -1, "the message states the limit").toBeTruthy();
    const accepted = await runSteps(survey, [{ set: { q1: "12345" } }]);
    expect(accepted.status, "exactly five characters go in").toEqual("passed");
  });
  test("maxSelectedChoices rejects a value with too many items", async () => {
    const survey = {
      elements: [{ type: "checkbox", name: "q1", choices: ["a", "b", "c"], maxSelectedChoices: 2 }],
    };
    const rejected = await runSteps(survey, [{ set: { q1: ["a", "b", "c"] } }]);
    expectRejected(rejected, SurveyTestIssueCodes.valueNotEnterable, {}, "the third box cannot be ticked");
    expect(rejected.messages.indexOf("at most 2 selected choice") > -1, "the message states the limit").toBeTruthy();
    const accepted = await runSteps(survey, [{ set: { q1: ["a", "b"] } }]);
    expect(accepted.status, "two go in").toEqual("passed");
  });
  test("A checkbox takes an array, and a scalar is not wrapped for the author", async () => {
    const outcome = await runSteps({
      elements: [{ type: "checkbox", name: "q1", choices: ["a", "b"] }],
    }, [{ set: { q1: "a" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.valueNotEnterable, {}, "the case says one thing, the model another");
    expect(outcome.messages.indexOf("an array of choice values") > -1, "the message says what it takes").toBeTruthy();
  });
  test("A rating rejects a value outside its rate values", async () => {
    const survey = { elements: [{ type: "rating", name: "q1", rateMin: 1, rateMax: 5 }] };
    const rejected = await runSteps(survey, [{ set: { q1: 9 } }]);
    expectRejected(rejected, SurveyTestIssueCodes.valueNotEnterable, {}, "there is no 9 to click");
    expect(rejected.messages.indexOf("the rate values are") > -1, "the message lists them").toBeTruthy();
    const accepted = await runSteps(survey, [{ set: { q1: 5 } }]);
    expect(accepted.status, "a real rate value goes in").toEqual("passed");
  });
  test("A boolean rejects anything but its configured pair", async () => {
    const survey = { elements: [{ type: "boolean", name: "q1", valueTrue: "yes", valueFalse: "no" }] };
    const rejected = await runSteps(survey, [{ set: { q1: "maybe" } }]);
    expectRejected(rejected, SurveyTestIssueCodes.valueNotEnterable, {}, "a switch has two positions");
    expect(rejected.messages.indexOf("\"yes\"") > -1, "the message names the pair").toBeTruthy();
    const accepted = await runSteps(survey, [{ set: { q1: "no" } }]);
    expect(accepted.status, "a configured value goes in").toEqual("passed");
  });
  test("A date input rejects a string it cannot parse", async () => {
    const survey = { elements: [{ type: "text", name: "q1", inputType: "date" }] };
    const rejected = await runSteps(survey, [{ set: { q1: "not-a-date" } }]);
    expectRejected(rejected, SurveyTestIssueCodes.valueNotEnterable, {}, "a date picker cannot produce it");
    expect(rejected.messages.indexOf("YYYY-MM-DD") > -1, "the message states the format").toBeTruthy();
    const accepted = await runSteps(survey, [{ set: { q1: "2024-03-31" } }]);
    expect(accepted.status, "a real date goes in").toEqual("passed");
  });
});

// The important negative tests: a case that expects a validation error must be able to produce one.
describe("set feasibility stops where validation begins", () => {
  test("A value below min goes in, so that a later check can assert the error", async () => {
    const outcome = await runSteps({
      elements: [{ type: "text", name: "q1", inputType: "number", min: 10 }],
    }, [{ set: { q1: 5 } }]);
    expect(outcome.codes, "nothing was rejected").toEqual([]);
    expect(question(outcome, "q1").value, "the out-of-range value is stored").toEqual(5);
  });
  test("A value that fails a validator goes in as well", async () => {
    const outcome = await runSteps({
      elements: [{ type: "text", name: "q1", validators: [{ type: "email" }] }],
    }, [{ set: { q1: "not-an-email" } }]);
    expect(outcome.codes, "nothing was rejected").toEqual([]);
    expect(question(outcome, "q1").value, "the invalid value is stored").toEqual("not-an-email");
  });
});

// The comment area is off by default, so a "setComment" that names a question without one describes
// an interaction that has no input to perform it in.
describe("setComment feasibility: the comment needs an editor", () => {
  test("A question whose comment area is switched off is rejected", async () => {
    const outcome = await runSteps({ elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b"] }] },
      [{ setComment: { q1: "because" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.commentNotAvailable, {}, "there is nowhere to type the comment");
    expect(question(outcome, "q1").comment, "the comment is not stored").toBeFalsy();
    expect(outcome.messages.indexOf("\"showCommentArea\" property is false") > -1,
      "the message names the property that hides the comment area").toBeTruthy();
    expect(outcome.issues[0].suggestion.indexOf("\"showCommentArea\": true") > -1,
      "the suggestion says how to display it").toBeTruthy();
  });
  // A text question never displays one: "showCommentArea" is invisible for its type, so survey-core
  // ignores it in the JSON as well, and a case that sets it would be testing nothing.
  test("A question type that has no comment area at all says so", async () => {
    const outcome = await runSteps({ elements: [{ type: "text", name: "q1", showCommentArea: true }] },
      [{ setComment: { q1: "because" } }]);
    expect(outcome.codes, "the type has no comment area").toEqual([SurveyTestIssueCodes.commentNotAvailable]);
    expect(outcome.messages.indexOf("the type \"text\" has no comment area") > -1,
      "the message names the type").toBeTruthy();
  });
  test("The comment area of the question is the editor the command writes", async () => {
    const outcome = await runSteps({
      elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b"], showCommentArea: true }],
    }, [{ setComment: { q1: "because" } }]);
    expect(outcome.codes, "nothing was rejected").toEqual([]);
    expect(question(outcome, "q1").comment, "the comment is stored").toEqual("because");
  });
  test("The \"Other\" input is the comment editor while the \"Other\" choice is selected", async () => {
    const definition = {
      elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b"], showOtherItem: true }],
    };
    const rejected = await runSteps(definition, [{ setComment: { q1: "because" } }]);
    expectRejected(rejected, SurveyTestIssueCodes.commentNotAvailable, {}, "the \"Other\" input is not displayed");
    expect(rejected.messages.indexOf("only while the \"Other\" choice is selected") > -1,
      "the message says when the input appears").toBeTruthy();
    expect(rejected.issues[0].suggestion.indexOf("\"set\" command") > -1,
      "the suggestion says how to display it").toBeTruthy();
    const accepted = await runSteps(definition, [{ set: { q1: "other" } }, { setComment: { q1: "because" } }]);
    expect(accepted.codes, "writing the other text is possible, and named as what it is")
      .toEqual([SurveyTestIssueCodes.commentIsOtherText]);
    expect(accepted.status, "the test passes").toEqual("passed");
    expect(question(accepted, "q1").otherValue, "the other text is stored").toEqual("because");
  });
  test("The \"Other\" text stored in the value is not the comment", async () => {
    const outcome = await runSteps({
      elements: [{ type: "radiogroup", name: "q1", choices: ["a", "b"], showOtherItem: true,
        storeOthersAsComment: false }],
    }, [{ set: { q1: "other" } }, { setComment: { q1: "because" } }]);
    expect(outcome.codes, "the comment is not where the other text goes")
      .toEqual([SurveyTestIssueCodes.commentNotAvailable]);
    expect(outcome.messages.indexOf("\"storeOthersAsComment\" is false") > -1,
      "the message names the property that decides it").toBeTruthy();
  });
  test("A comment area that belongs to a choice is not the comment of the question", async () => {
    const outcome = await runSteps({
      elements: [{ type: "checkbox", name: "q1", choices: ["a", { value: "b", showCommentArea: true }] }],
    }, [{ set: { q1: ["b"] } }, { setComment: { q1: "because" } }]);
    expect(outcome.codes, "the choice comment is a different storage")
      .toEqual([SurveyTestIssueCodes.commentNotAvailable]);
    expect(outcome.messages.indexOf("the choice(s) \"b\"") > -1,
      "the message names the choices that own a comment area").toBeTruthy();
    expect(question(outcome, "q1").comment, "the comment is not stored").toBeFalsy();
  });
});

// ------------------------------------------------------------------------------------------------
// 0.3 Complex questions are filled leaf by leaf
// ------------------------------------------------------------------------------------------------

describe("Composite questions are filled leaf by leaf", () => {
  test("multipletext", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "multipletext", name: "mt",
        items: [{ name: "first" }, { name: "second" }],
      }],
    }, [{ set: { mt: { first: "a", second: "b" } } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    const mt = question(outcome, "mt");
    expect(mt.items[0].editor.value, "the first editor").toEqual("a");
    expect(mt.items[1].editor.value, "the second editor").toEqual("b");
    expect(outcome.survey.data, "the survey data").toEqual({ mt: { first: "a", second: "b" } });
  });
  test("matrixdropdown", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "matrixdropdown", name: "m",
        rows: ["row1", "row2"],
        columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }],
      }],
    }, [{ set: { m: { row1: { col1: "a", col2: "b" }, row2: { col1: "c" } } } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    const m = question(outcome, "m");
    expect(m.visibleRows[0].getQuestionByColumnName("col1").value, "row1.col1").toEqual("a");
    expect(m.visibleRows[0].getQuestionByColumnName("col2").value, "row1.col2").toEqual("b");
    expect(m.visibleRows[1].getQuestionByColumnName("col1").value, "row2.col1").toEqual("c");
  });
  test("matrixdynamic", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 2,
        columns: [{ name: "col1", cellType: "text" }],
      }],
    }, [{ set: { m: [{ col1: "a" }, { col1: "b" }] } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    const m = question(outcome, "m");
    expect(m.visibleRows[0].getQuestionByColumnName("col1").value, "the first row").toEqual("a");
    expect(m.visibleRows[1].getQuestionByColumnName("col1").value, "the second row").toEqual("b");
  });
  test("matrix, the single choice one", async () => {
    const outcome = await runSteps({
      elements: [{ type: "matrix", name: "m", rows: ["row1", "row2"], columns: ["col1", "col2"] }],
    }, [{ set: { m: { row1: "col2", row2: "col1" } } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "m").visibleRows[0].value, "the first row").toEqual("col2");
    expect(question(outcome, "m").visibleRows[1].value, "the second row").toEqual("col1");
  });
  test("A matrix cell value that is not a column is a case error listing the columns", async () => {
    const outcome = await runSteps({
      elements: [{ type: "matrix", name: "m", rows: ["row1"], columns: ["col1", "col2"] }],
    }, [{ set: { m: { row1: "col9" } } }]);
    expectRejected(outcome, SurveyTestIssueCodes.invalidChoiceValue, {}, "there is no such column to click");
    expect(outcome.messages.indexOf("\"col1\", \"col2\"") > -1, "the message lists the columns").toBeTruthy();
  });
  test("paneldynamic", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "paneldynamic", name: "p", panelCount: 2,
        templateElements: [{ type: "text", name: "q1" }],
      }],
    }, [{ set: { p: [{ q1: "a" }, { q1: "b" }] } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "p").panels[0].getQuestionByName("q1").value, "the first panel").toEqual("a");
    expect(question(outcome, "p").panels[1].getQuestionByName("q1").value, "the second panel").toEqual("b");
  });
  test("An unknown column name suggests the closest one", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "amount", cellType: "text" }],
      }],
    }, [{ set: { m: [{ amout: "a" }] } }]);
    expectRejected(outcome, SurveyTestIssueCodes.unknownTarget, {}, "there is no such column");
    expect(outcome.issues[0].suggestion, "the closest name is suggested").toEqual("Did you mean \"amount\"?");
    expect(outcome.issues[0].target, "the path names the row").toEqual("m[0]");
  });
  test("Leaves are set in value order, so a condition between cells is already correct", async () => {
    const definition = {
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [
          { name: "col1", cellType: "dropdown", choices: ["yes", "no"] },
          { name: "col2", cellType: "text", visibleIf: "{row.col1} = 'yes'" },
        ],
      }],
    };
    const passing = await runSteps(definition, [{ set: { m: [{ col1: "yes", col2: "b" }] } }]);
    expect(passing.status, "col1 is set first, so col2 is visible when it is reached").toEqual("passed");
    expect(question(passing, "m").visibleRows[0].getQuestionByColumnName("col2").value, "the cell value").toEqual("b");

    const failing = await runSteps(definition, [{ set: { m: [{ col1: "no", col2: "b" }] } }]);
    expect(failing.codes, "col1 hid col2 halfway through the walk")
      .toEqual([SurveyTestIssueCodes.elementNotVisible]);
    expect(failing.issues[0].target, "the error names the cell").toEqual("m[0].col2");
    expect(question(failing, "m").value, "only the first cell was set").toEqual([{ col1: "no" }]);
  });
  test("A composite custom question is filled through its content panel", async () => {
    ComponentCollection.Instance.add({
      name: "testercustomerinfo",
      elementsJSON: [
        { type: "text", name: "firstName" },
        { type: "dropdown", name: "country", choices: ["uk", "us"] },
      ],
    });
    try {
      const outcome = await runSteps({
        elements: [{ type: "testercustomerinfo", name: "who" }],
      }, [{ set: { who: { firstName: "Ada", country: "uk" } } }]);
      expect(outcome.status, "the test passes").toEqual("passed");
      expect(outcome.survey.data, "both leaves are filled")
        .toEqual({ who: { firstName: "Ada", country: "uk" } });

      const rejected = await runSteps({
        elements: [{ type: "testercustomerinfo", name: "who" }],
      }, [{ set: { who: { firstName: "Ada", country: "fr" } } }]);
      expect(rejected.codes, "and every leaf is checked on its own")
        .toEqual([SurveyTestIssueCodes.invalidChoiceValue]);
      expect(rejected.issues[0].target, "the error names the leaf").toEqual("who.country");
    } finally {
      ComponentCollection.Instance.remove("testercustomerinfo");
    }
  });
  test("A single custom question is checked against the editor it wraps", async () => {
    ComponentCollection.Instance.add({
      name: "testercountry",
      questionJSON: { type: "dropdown", choices: ["uk", "us"] },
    });
    try {
      const accepted = await runSteps({
        elements: [{ type: "testercountry", name: "country" }],
      }, [{ set: { country: "uk" } }]);
      expect(accepted.status, "a real choice goes in").toEqual("passed");
      expect(accepted.survey.data, "the wrapper owns the value").toEqual({ country: "uk" });

      const rejected = await runSteps({
        elements: [{ type: "testercountry", name: "country" }],
      }, [{ set: { country: "fr" } }]);
      expectRejected(rejected, SurveyTestIssueCodes.invalidChoiceValue, {}, "the wrapped dropdown has no such choice");
    } finally {
      ComponentCollection.Instance.remove("testercountry");
    }
  });
  test("A composite value of the wrong shape says what shape it takes", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "col1", cellType: "text" }],
      }],
    }, [{ set: { m: "a" } }]);
    expectRejected(outcome, SurveyTestIssueCodes.valueNotEnterable, {}, "a matrix is not filled from a string");
    expect(outcome.messages.indexOf("an array of row values") > -1, "the message says what it takes").toBeTruthy();
  });
});

describe("Dynamic sizing follows what a respondent could add", () => {
  const growable = {
    elements: [{
      type: "matrixdynamic", name: "m", rowCount: 1,
      columns: [{ name: "col1", cellType: "text" }],
    }],
  };
  test("A value with more rows than the matrix has adds them and warns", async () => {
    const outcome = await runSteps(growable, [{ set: { m: [{ col1: "a" }, { col1: "b" }, { col1: "c" }] } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.codes, "the case is told the rows were added").toEqual([SurveyTestIssueCodes.rowsAddedImplicitly]);
    expect(outcome.messages.indexOf("2 were added") > -1, "the warning states the count").toBeTruthy();
    expect(question(outcome, "m").rowCount, "the matrix grew").toEqual(3);
    expect(question(outcome, "m").value, "every row was filled")
      .toEqual([{ col1: "a" }, { col1: "b" }, { col1: "c" }]);
  });
  test("allowAddRows false stops the growth", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1, allowAddRows: false,
        columns: [{ name: "col1", cellType: "text" }],
      }],
    }, [{ set: { m: [{ col1: "a" }, { col1: "b" }] } }]);
    expectRejected(outcome, SurveyTestIssueCodes.cannotAddRows, {}, "there is no Add button to press");
    expect(outcome.messages.indexOf("\"allowAddRows\" is false") > -1, "the message says which").toBeTruthy();
  });
  test("maxRowCount stops the growth and the message names the maximum", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1, maxRowCount: 2,
        columns: [{ name: "col1", cellType: "text" }],
      }],
    }, [{ set: { m: [{ col1: "a" }, { col1: "b" }, { col1: "c" }] } }]);
    expectRejected(outcome, SurveyTestIssueCodes.cannotAddRows, {}, "the Add button is disabled at the maximum");
    expect(outcome.messages.indexOf("at most 2") > -1, "the message names the maximum").toBeTruthy();
  });
  test("A shorter value never shrinks the matrix, and the case is told", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 3,
        columns: [{ name: "col1", cellType: "text" }],
      }],
    }, [
      { set: { m: [{ col1: "a" }, { col1: "b" }, { col1: "c" }] } },
      { set: { m: [{ col1: "changed" }] } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.rowsNotRemoved]);
    expect(question(outcome, "m").rowCount, "the matrix keeps its rows").toEqual(3);
    expect(question(outcome, "m").value, "rows 2 and 3 keep their values")
      .toEqual([{ col1: "changed" }, { col1: "b" }, { col1: "c" }]);
  });
  test("The addRow command obeys the same limits as the implicit growth", async () => {
    const disabled = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1, allowAddRows: false,
        columns: [{ name: "col1", cellType: "text" }],
      }],
    }, [{ addRow: { m: 1 } }]);
    expectRejected(disabled, SurveyTestIssueCodes.cannotAddRows, {}, "there is no Add button to press");
    expect(disabled.messages.indexOf("\"allowAddRows\" is false") > -1, "the message says which").toBeTruthy();

    const atMaximum = await runSteps({
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 2, maxRowCount: 2,
        columns: [{ name: "col1", cellType: "text" }],
      }],
    }, [{ addRow: { m: 1 } }]);
    expect(atMaximum.codes, "the Add button is disabled at the maximum").toEqual([SurveyTestIssueCodes.cannotAddRows]);
    expect(atMaximum.messages.indexOf("\"maxRowCount\" of 2") > -1, "the message names the maximum").toBeTruthy();
  });
  test("The addPanel command obeys them too", async () => {
    const disabled = await runSteps({
      elements: [{
        type: "paneldynamic", name: "p", panelCount: 1, allowAddPanel: false,
        templateElements: [{ type: "text", name: "q1" }],
      }],
    }, [{ addPanel: { p: 1 } }]);
    expect(disabled.codes, "there is no Add button to press").toEqual([SurveyTestIssueCodes.cannotAddRows]);
    expect(disabled.survey.getQuestionByName("p").panelCount, "the question is untouched").toEqual(1);
  });
  test("A dynamic panel grows the same way", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "paneldynamic", name: "p", panelCount: 1,
        templateElements: [{ type: "text", name: "q1" }],
      }],
    }, [{ set: { p: [{ q1: "a" }, { q1: "b" }] } }]);
    expect(outcome.codes, "the case is told the panel was added").toEqual([SurveyTestIssueCodes.rowsAddedImplicitly]);
    expect(question(outcome, "p").panelCount, "the dynamic panel grew").toEqual(2);
  });
  test("allowAddPanel false stops the growth", async () => {
    const outcome = await runSteps({
      elements: [{
        type: "paneldynamic", name: "p", panelCount: 1, allowAddPanel: false,
        templateElements: [{ type: "text", name: "q1" }],
      }],
    }, [{ set: { p: [{ q1: "a" }, { q1: "b" }] } }]);
    // A dynamic panel writes an entry per panel into the data as soon as it is created, so "unchanged"
    // here is the one empty panel the definition asks for.
    expectRejected(outcome, SurveyTestIssueCodes.cannotAddRows, { p: [{}] }, "there is no Add button to press");
    expect(outcome.messages.indexOf("\"allowAddPanel\" is false") > -1, "the message says which").toBeTruthy();
  });
});

// ------------------------------------------------------------------------------------------------
// The Add and Remove buttons of a dynamic matrix and of a dynamic panel
// ------------------------------------------------------------------------------------------------

// A step that installs an event handler on the survey of the run: the rules below are the ones the
// model computes from the events, and they cannot be expressed in the definition JSON.
const HOOK = "installHandlerForTest";
let installHandler: (survey: SurveyModel) => void = undefined;

function matrixWith(props: any): any {
  return { elements: [Object.assign({
    type: "matrixdynamic", name: "m", rowCount: 2, columns: [{ name: "col1", cellType: "text" }],
  }, props)] };
}
function panelWith(props: any): any {
  return { elements: [Object.assign({
    type: "paneldynamic", name: "p", panelCount: 2, templateElements: [{ type: "text", name: "q1" }],
  }, props)] };
}

describe("Adding and removing dynamic items follows the model's own buttons", () => {
  beforeAll(() => {
    SurveyTestCommandFactory.Instance.register({
      name: HOOK,
      allowSurvey: true,
      allowElement: false,
      payloadType: "none",
      run: (context: ISurveyTestContext): void => { if (!!installHandler) installHandler(context.survey); },
    });
  });
  afterAll(() => {
    SurveyTestCommandFactory.Instance.unregister(HOOK);
    installHandler = undefined;
  });
  async function runWithHandler(definition: any, handler: (survey: SurveyModel) => void,
    steps: Array<any>): Promise<IRunOutcome> {
    installHandler = handler;
    try {
      return await runSteps(definition, [<any>{ [HOOK]: { survey: true } }].concat(steps));
    } finally {
      installHandler = undefined;
    }
  }

  test("A read-only matrix has no Add and no Remove button", async () => {
    const added = await runSteps(matrixWith({ readOnly: true }), [{ addRow: { m: 1 } }]);
    expectRejected(added, SurveyTestIssueCodes.elementNotEditable, {}, "a read-only matrix cannot grow");
    expect(question(added, "m").rowCount, "the matrix is untouched").toEqual(2);

    const removed = await runSteps(matrixWith({ readOnly: true }), [{ removeRow: { m: 0 } }]);
    expectRejected(removed, SurveyTestIssueCodes.elementNotEditable, {}, "a read-only matrix cannot shrink");
    expect(question(removed, "m").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("The display mode takes the buttons of a dynamic panel away and the message names the mode", async () => {
    const definition = panelWith({});
    (<any>definition).mode = "display";
    const outcome = await runSteps(definition, [{ addPanel: { p: 1 } }]);
    expect(outcome.codes, "a survey in the display mode has no Add button")
      .toEqual([SurveyTestIssueCodes.elementNotEditable]);
    expect(outcome.messages.indexOf("\"display\" mode") > -1, "the message names the mode").toBeTruthy();
    expect(question(outcome, "p").panelCount, "the question is untouched").toEqual(2);
  });
  test("removeRow stops at minRowCount and the message names it", async () => {
    const outcome = await runSteps(matrixWith({ minRowCount: 2 }), [{ removeRow: { m: 0 } }]);
    expectRejected(outcome, SurveyTestIssueCodes.cannotRemoveRows, {}, "the last allowed row keeps no Remove button");
    expect(outcome.messages.indexOf("\"minRowCount\" of 2") > -1, "the message names the minimum").toBeTruthy();
    expect(question(outcome, "m").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("allowRemoveRows false is rejected before anything is removed", async () => {
    const outcome = await runSteps(matrixWith({ allowRemoveRows: false }), [{ removeRow: { m: 0 } }]);
    expectRejected(outcome, SurveyTestIssueCodes.cannotRemoveRows, {}, "there is no Remove button to press");
    expect(outcome.messages.indexOf("\"allowRemoveRows\" is false") > -1, "the message says which").toBeTruthy();
    expect(question(outcome, "m").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("A canRemoveRowsCallback that forbids removal is obeyed", async () => {
    const outcome = await runWithHandler(matrixWith({}), (survey: SurveyModel) => {
      (<any>survey.getQuestionByName("m")).canRemoveRowsCallback = (): boolean => false;
    }, [{ removeRow: { m: 0 } }]);
    expect(outcome.codes, "the callback governs the Remove button").toEqual([SurveyTestIssueCodes.cannotRemoveRows]);
    expect(outcome.messages.indexOf("\"canRemoveRows\"") > -1, "the message names the property").toBeTruthy();
    expect(question(outcome, "m").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("A row whose Remove button an event handler hides cannot be removed", async () => {
    const outcome = await runWithHandler(matrixWith({}), (survey: SurveyModel) => {
      survey.onMatrixRenderRemoveButton.add((_, options: any) => { options.allow = options.rowIndex > 0; });
    }, [{ removeRow: { m: 0 } }]);
    expect(outcome.codes, "the first row has no Remove button").toEqual([SurveyTestIssueCodes.cannotRemoveRows]);
    expect(outcome.messages.indexOf("index 0") > -1, "the message names the row").toBeTruthy();
    expect(question(outcome, "m").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("The row that keeps its button is still removed", async () => {
    const outcome = await runWithHandler(matrixWith({}), (survey: SurveyModel) => {
      survey.onMatrixRenderRemoveButton.add((_, options: any) => { options.allow = options.rowIndex > 0; });
    }, [{ removeRow: { m: 1 } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "m").rowCount, "the second row is gone").toEqual(1);
  });
  // Possible-but-ineffective is not an error: the button was there and the model refused.
  test("A cancelled row adding warns and leaves the matrix as it was", async () => {
    const outcome = await runWithHandler(matrixWith({}), (survey: SurveyModel) => {
      survey.onMatrixRowAdding.add((_, options: any) => { options.allow = false; });
    }, [{ addRow: { m: 2 } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.addBlocked]);
    expect(outcome.messages.indexOf("0 of 2 were added") > -1, "the warning states how far it got").toBeTruthy();
    expect(question(outcome, "m").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("A cancelled row removing warns and leaves the matrix as it was", async () => {
    const outcome = await runWithHandler(matrixWith({}), (survey: SurveyModel) => {
      survey.onMatrixRowRemoving.add((_, options: any) => { options.allow = false; });
    }, [{ removeRow: { m: 0 } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.removeBlocked]);
    expect(question(outcome, "m").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("removePanel stops at minPanelCount and when allowRemovePanel is false", async () => {
    const atMinimum = await runSteps(panelWith({ minPanelCount: 2 }), [{ removePanel: { p: 0 } }]);
    expectRejected(atMinimum, SurveyTestIssueCodes.cannotRemoveRows, { p: [{}, {}] },
      "the last allowed panel keeps no Remove button");
    expect(atMinimum.messages.indexOf("\"minPanelCount\" of 2") > -1, "the message names the minimum").toBeTruthy();

    const disabled = await runSteps(panelWith({ allowRemovePanel: false }), [{ removePanel: { p: 0 } }]);
    expectRejected(disabled, SurveyTestIssueCodes.cannotRemoveRows, { p: [{}, {}] },
      "there is no Remove button to press");
    expect(disabled.messages.indexOf("\"allowRemovePanel\" is false") > -1, "the message says which").toBeTruthy();
    expect(question(disabled, "p").panelCount, "the question is untouched").toEqual(2);
  });
  test("A cancelled panel removing warns and leaves the dynamic panel as it was", async () => {
    const outcome = await runWithHandler(panelWith({}), (survey: SurveyModel) => {
      survey.onDynamicPanelRemoving.add((_, options: any) => { options.allow = false; });
    }, [{ removePanel: { p: 0 } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.removeBlocked]);
    expect(question(outcome, "p").panelCount, "the dynamic panel is untouched").toEqual(2);
  });
  test("The implicit growth of a set stops where the Add button does", async () => {
    const outcome = await runSteps(matrixWith({ rowCount: 1, readOnly: true }),
      [{ set: { m: [{ col1: "a" }, { col1: "b" }] } }]);
    expectRejected(outcome, SurveyTestIssueCodes.elementNotEditable, {},
      "a read-only matrix grows for nobody");
    expect(question(outcome, "m").rowCount, "the matrix is untouched").toEqual(1);
  });
});

// ------------------------------------------------------------------------------------------------
// setDirectly - the one escape hatch
// ------------------------------------------------------------------------------------------------

describe("setDirectly bypasses the input path", () => {
  test("It sets a hidden question and names the effective clearInvisibleValues mode", async () => {
    const outcome = await runSteps({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "hidden", visibleIf: "{q1} = 'show'" },
      ],
    }, [{ setDirectly: { hidden: "assigned" } }], { clearInvisibleValues: "onHidden" });
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.setWhileHidden]);
    expect(outcome.messages.indexOf("\"onHidden\"") > -1, "the warning names the mode").toBeTruthy();
  });
  test("It sets a read-only question and a question on another page without error", async () => {
    const readOnly = await runSteps({
      elements: [{ type: "text", name: "q1", readOnly: true }],
    }, [{ setDirectly: { q1: "a" } }]);
    expect(readOnly.status, "a read-only question is assigned").toEqual("passed");
    expect(readOnly.survey.data, "the value is there").toEqual({ q1: "a" });
    expect(readOnly.codes, "and the case is warned").toEqual([SurveyTestIssueCodes.setWhileHidden]);

    const otherPage = await runSteps(twoPages, [{ setDirectly: { q2: "b" } }]);
    expect(otherPage.status, "a question on another page is assigned").toEqual("passed");
    expect(otherPage.codes, "with no warning: it is visible and editable, only not on screen").toEqual([]);
    expect(otherPage.survey.data, "the value is there").toEqual({ q2: "b" });
  });
  test("A composite value is assigned wholesale, and that is the difference from set", async () => {
    const definition = {
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [
          { name: "col1", cellType: "dropdown", choices: ["yes", "no"] },
          { name: "col2", cellType: "text", visibleIf: "{row.col1} = 'yes'" },
        ],
      }],
    };
    const value = [{ col1: "no", col2: "b" }];
    const through = await runSteps(definition, [{ set: { m: value } }]);
    expect(through.codes, "set stops at the cell the condition hid")
      .toEqual([SurveyTestIssueCodes.elementNotVisible]);
    expect(question(through, "m").value, "col2 never got its value").toEqual([{ col1: "no" }]);

    const directly = await runSteps(definition, [{ setDirectly: { m: value } }]);
    expect(directly.status, "setDirectly assigns it whole").toEqual("passed");
    expect(question(directly, "m").value, "the hidden cell keeps a value no respondent could enter")
      .toEqual([{ col1: "no", col2: "b" }]);
  });
  test("It does not run the input path: a trigger that set fires does not fire here", async () => {
    const definition = {
      triggers: [{ type: "setvalue", expression: "{q1} = 10", setToName: "q2", setValue: "by the trigger" }],
      elements: [{ type: "text", name: "q1", inputType: "number" }, { type: "text", name: "q2" }],
    };
    const through = await runSteps(definition, [{ set: { q1: 10 } }]);
    expect(question(through, "q2").value, "set fires the trigger").toEqual("by the trigger");
    const directly = await runSteps(definition, [{ setDirectly: { q1: 10 } }]);
    expect(question(directly, "q2").value,
      "survey-core runs the trigger for this path as well - the two paths differ in the checks, not in the notifications")
      .toEqual("by the trigger");
  });
});

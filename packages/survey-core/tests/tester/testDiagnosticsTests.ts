import { QuestionTextModel, settings, SurveyModel } from "survey-core";
import { ISurveyTestContext } from "../../src/tester/test-context";
import {
  getClosestName, getExpressionTrace, getJsonPath, getRowIndex,
} from "../../src/tester/test-diagnostics";
import { ISurveyTestCheckResult, ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { SurveyTestCommandFactory } from "../../src/tester/test-commands";

import { afterAll, beforeAll, describe, expect, test } from "vitest";

// A helper command, not a built-in: it records everything a diagnostic is forbidden to change.
const SNAPSHOT = "snapshotSurveyForDiagnostics";
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
        state: survey.state,
        currentPageNo: survey.currentPageNo,
        visibility: survey.getAllQuestions().map((question: any) => question.name + ":" + question.isVisible),
      }));
    },
  });
});
afterAll(() => {
  SurveyTestCommandFactory.Instance.unregister(SNAPSHOT);
});

interface IRunOutcome {
  result: ISurveyTestsResult;
  status: string;
  steps: Array<any>;
  checks: Array<ISurveyTestCheckResult>;
  issues: Array<ISurveyTestIssue>;
  codes: Array<string>;
}

async function runSteps(definition: any, steps: Array<any>, params?: { options?: any, start?: any }): Promise<IRunOutcome> {
  const runParams = params || {};
  const testCase: any = { name: "t", steps: steps };
  if (!!runParams.start) testCase.start = runParams.start;
  const result = await new SurveyTestRunner(definition, { tests: [testCase] }, runParams.options).run();
  const testResult = result.tests[0];
  const issues: Array<ISurveyTestIssue> = [].concat(result.issues);
  testResult.issues.forEach(issue => issues.push(issue));
  testResult.steps.forEach(step => step.issues.forEach(issue => issues.push(issue)));
  const lastStep = testResult.steps[testResult.steps.length - 1];
  return {
    result: result,
    status: testResult.status,
    steps: testResult.steps,
    checks: !!lastStep ? lastStep.checks : [],
    issues: issues,
    codes: issues.map(issue => issue.code),
  };
}
function findIssue(outcome: IRunOutcome, code: string): ISurveyTestIssue {
  return outcome.issues.filter(issue => issue.code === code)[0];
}

// -----------------------------------------------------------------------------------------------

const insuranceSurvey = {
  pages: [{
    name: "page1",
    elements: [
      { type: "radiogroup", name: "hasInsurance", choices: ["yes", "no"] },
      { type: "text", name: "insuranceProvider", visibleIf: "{hasInsurance} notempty" },
    ],
  }],
};

describe("getJsonPath: the node of the definition a result is about", () => {
  const definition = {
    pages: [
      { name: "page1", elements: [{ type: "text", name: "q1", validators: [{ type: "numeric", minValue: 1 }] }] },
      {
        name: "page2",
        elements: [
          { type: "text", name: "q2" },
          {
            type: "panel", name: "outer", elements: [
              { type: "panel", name: "inner", elements: [{ type: "text", name: "deep" }] },
            ],
          },
          {
            type: "matrixdynamic", name: "matrix", rowCount: 2,
            columns: [{ name: "col1", cellType: "text" }, { name: "col2", cellType: "text" }],
          },
          {
            type: "paneldynamic", name: "panels", panelCount: 2,
            templateElements: [{ type: "text", name: "inPanel" }],
          },
        ],
      },
    ],
    triggers: [{ type: "complete", expression: "{q1} = 1" }],
    calculatedValues: [{ name: "calc", expression: "{q1} + 1" }],
  };
  const survey = new SurveyModel(definition);

  test("A question of the second page", () => {
    expect(getJsonPath(survey.getQuestionByName("q2"))).toEqual("pages[1].elements[0]");
  });
  test("A question inside two nested panels", () => {
    expect(getJsonPath(survey.getQuestionByName("deep")))
      .toEqual("pages[1].elements[1].elements[0].elements[0]");
  });
  test("A property of an element is appended to its path", () => {
    expect(getJsonPath(survey.getQuestionByName("q2"), "visibleIf")).toEqual("pages[1].elements[0].visibleIf");
  });
  test("A matrix column, and a cell that carries its row index in the details instead of in the path", () => {
    const matrix: any = survey.getQuestionByName("matrix");
    expect(getJsonPath(matrix.columns[0].templateQuestion), "the column template")
      .toEqual("pages[1].elements[2].columns[0]");
    const cell = matrix.visibleRows[1].getQuestionByColumnName("col2");
    expect(getJsonPath(cell), "a cell is the column it belongs to").toEqual("pages[1].elements[2].columns[1]");
    expect(getRowIndex(cell), "the row does not exist in the definition, its index does").toEqual(1);
  });
  test("A dynamic panel template question, and a question of a created panel", () => {
    const panels: any = survey.getQuestionByName("panels");
    expect(getJsonPath(panels.templateElements[0]), "the template question")
      .toEqual("pages[1].elements[3].templateElements[0]");
    const inPanel = panels.panels[1].getQuestionByName("inPanel");
    expect(getJsonPath(inPanel), "a created panel holds copies of the same node")
      .toEqual("pages[1].elements[3].templateElements[0]");
    expect(getRowIndex(inPanel), "the panel index travels in the details").toEqual(1);
  });
  test("A validator, a trigger and a calculated value", () => {
    const q1: any = survey.getQuestionByName("q1");
    expect(getJsonPath(q1.validators[0])).toEqual("pages[0].elements[0].validators[0]");
    expect(getJsonPath(survey.triggers[0])).toEqual("triggers[0]");
    expect(getJsonPath(survey.calculatedValues[0], "expression")).toEqual("calculatedValues[0].expression");
  });
  test("A page and the survey itself", () => {
    expect(getJsonPath(survey.pages[1])).toEqual("pages[1]");
    expect(getJsonPath(survey)).toEqual("");
  });
  // Never a guess: a caller that gets "" knows there is no node to open.
  test("A detached question has no path", () => {
    expect(getJsonPath(new QuestionTextModel("orphan"))).toEqual("");
    expect(getJsonPath(undefined)).toEqual("");
  });
});

describe("getClosestName", () => {
  test("A near miss is offered, a name that resembles nothing is not", () => {
    expect(getClosestName("hasInsurace", ["hasInsurance", "claimAmount"])).toEqual("hasInsurance");
    expect(getClosestName("zzzzzzzz", ["hasInsurance", "claimAmount"])).toEqual("");
    expect(getClosestName("maybe", ["yes", "no"])).toEqual("");
  });
  // Six edits apart, and still the name the author meant.
  test("A candidate the name contains is offered whatever its distance", () => {
    expect(getClosestName("excessAmount", ["excess", "claimAmount"])).toEqual("excess");
  });
  test("The name itself is never suggested", () => {
    expect(getClosestName("excess", ["excess"])).toEqual("");
  });
});

describe("Expression traces", () => {
  test("A failing visible check points at visibleIf and carries what it read", async () => {
    const outcome = await runSteps(insuranceSurvey, [
      { set: { hasInsurance: "no" } },
      { expect: { insuranceProvider: { visible: false } } },
    ]);
    const check = outcome.checks[0];
    expect(check.passed, "the question is visible").toBeFalsy();
    expect(check.jsonPath, "the path points at the expression, not at the question")
      .toEqual("pages[0].elements[1].visibleIf");
    expect(check.details.expression.expression).toEqual("{hasInsurance} notempty");
    expect(check.details.expression.values, "only the names the expression reads")
      .toEqual({ hasInsurance: "no" });
    expect(check.details.expression.result, "re-evaluated to the value that decided it").toEqual(true);
  });
  test("A passing check carries no trace at all", async () => {
    const outcome = await runSteps(insuranceSurvey, [
      { set: { hasInsurance: "no" } },
      { expect: { insuranceProvider: { visible: true } } },
    ]);
    const check = outcome.checks[0];
    expect(check.passed, "the check passes").toBeTruthy();
    expect(check.details, "a passing suite pays for no diagnostics").toBeUndefined();
    expect(check.jsonPath, "the path is still there: it costs a lookup, not an evaluation")
      .toEqual("pages[0].elements[1]");
  });
  test("A name that no question, calculated value or variable defines is reported with the near miss", async () => {
    const definition = {
      elements: [
        { type: "text", name: "claimAmount", inputType: "number" },
        { type: "text", name: "excess", inputType: "number" },
      ],
      calculatedValues: [{ name: "payout", expression: "{claimAmount} - {excessAmount}" }],
    };
    const outcome = await runSteps(definition, [
      { set: { claimAmount: 500 } },
      { expect: { payout: { value: 400 } } },
    ]);
    const check = outcome.checks[0];
    expect(check.passed, "the calculated value is not 400").toBeFalsy();
    expect(check.jsonPath).toEqual("calculatedValues[0].expression");
    const trace = check.details.expression;
    expect(trace.expression).toEqual("{claimAmount} - {excessAmount}");
    expect(trace.values.claimAmount, "the value that was read").toEqual(500);
    expect(Object.prototype.hasOwnProperty.call(trace.values, "excessAmount"),
      "the name that was read is listed even though it has no value").toBeTruthy();
    expect(trace.values.excessAmount).toBeUndefined();
    expect(trace.unknownNames, "\"excessAmount\" is never set").toEqual(["excessAmount"]);
    expect(trace.suggestions.excessAmount, "the closest match").toEqual("excess");
  });
  test("An existing but unanswered question is not reported as a name that does not exist", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2", visibleIf: "{q1} notempty" }],
    });
    const trace = getExpressionTrace(survey.getQuestionByName("q2"), "{q1} notempty");
    expect(trace.unknownNames, "q1 exists, it is only empty").toBeUndefined();
    expect(trace.result).toEqual(false);
  });
  test("A trace neither changes the survey nor runs for a step that passes", async () => {
    snapshots = [];
    const outcome = await runSteps(insuranceSurvey, [
      { set: { hasInsurance: "no" } },
      { [SNAPSHOT]: { survey: true } },
      { expect: { insuranceProvider: { visible: false, enabled: false, value: "x" } } },
      { [SNAPSHOT]: { survey: true } },
    ]);
    expect(outcome.status, "the step failed, so every diagnostic ran").toEqual("failed");
    expect(snapshots.length).toEqual(2);
    expect(snapshots[1], "data, state, currentPageNo and the visibility of every question are untouched")
      .toEqual(snapshots[0]);
  });
});

describe("Name suggestions", () => {
  test("An unknown target suggests the name the case meant", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ set: { hasInsurace: "no" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.unknownTarget);
    expect(issue, "the case cannot run").toBeTruthy();
    expect(issue.suggestion).toEqual("Did you mean \"hasInsurance\"?");
  });
  test("A target that resembles nothing gets no suggestion", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ set: { zzzzzzzz: "no" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.unknownTarget);
    expect(issue.suggestion, "an invented name is worse than none").toBeUndefined();
  });
  test("An invalid choice lists the available ones and suggests nothing when nothing is close", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ set: { hasInsurance: "maybe" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.invalidChoiceValue);
    expect(issue.data.choices).toEqual(["yes", "no"]);
    expect(issue.suggestion).toBeUndefined();
    expect(issue.jsonPath).toEqual("pages[0].elements[0]");
  });
  test("An unresolved start reference suggests the name of an existing start", async () => {
    const result = await new SurveyTestRunner(insuranceSurvey, {
      starts: [{ name: "midFlows", data: {} }],
      tests: [{ name: "t", start: "midFlow", steps: [{ expect: { survey: { state: "running" } } }] }],
    }).run();
    const issue = result.tests[0].issues.filter(item => item.code === SurveyTestIssueCodes.unknownStartReference)[0];
    expect(issue, "the reference is reported before the test runs").toBeTruthy();
    expect(issue.suggestion).toEqual("Did you mean \"midFlows\"?");
  });
  test("An unknown start page suggests a page name", async () => {
    const definition = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "summary", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    const outcome = await runSteps(definition, [{ expect: { survey: { state: "running" } } }],
      { start: { startPage: "sumary" } });
    const issue = findIssue(outcome, SurveyTestIssueCodes.unknownStartPage);
    expect(issue.data.pages, "the names it could have used").toEqual(["page1", "summary"]);
    expect(issue.suggestion).toEqual("Did you mean \"summary\"?");
  });
});

describe("Blocked navigation and completion", () => {
  const requiredSurvey = {
    pages: [{
      name: "page1",
      elements: [
        { type: "radiogroup", name: "hasInsurance", choices: ["yes", "no"] },
        { type: "text", name: "insuranceProvider", isRequired: true },
      ],
    }],
  };
  test("The warning lists every blocking question, and the failing state check repeats it", async () => {
    const outcome = await runSteps(requiredSurvey, [
      { set: { hasInsurance: "no" } },
      { complete: { survey: true } },
      { expect: { survey: { state: "completed" } } },
    ]);
    const warning = findIssue(outcome, SurveyTestIssueCodes.completeBlocked);
    expect(warning.severity, "a blocked completion is not a case error").toEqual("warning");
    expect(warning.data.page).toEqual("page1");
    const blocking = warning.data.questions;
    expect(blocking.length).toEqual(1);
    expect(blocking[0].name).toEqual("insuranceProvider");
    expect(blocking[0].jsonPath).toEqual("pages[0].elements[1]");
    expect(blocking[0].isRequired).toEqual(true);
    expect(blocking[0].isVisible).toEqual(true);
    expect(blocking[0].isEmpty).toEqual(true);
    expect(blocking[0].errors.length, "the texts a respondent would see").toEqual(1);
    const check = outcome.checks[0];
    expect(check.passed).toBeFalsy();
    expect(check.actual).toEqual("running");
    expect(check.details.blockedBy.command, "the command that was blocked").toEqual("complete");
    expect(check.details.blockedBy.page).toEqual("page1");
    expect(check.details.blockedBy.questions[0].name, "the reader is looking at the check, not at the command")
      .toEqual("insuranceProvider");
  });
  test("A blocked next page is attached to a failing currentPage check", async () => {
    const definition = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", isRequired: true }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    const outcome = await runSteps(definition, [
      { nextPage: { survey: true } },
      { expect: { survey: { currentPage: "page2" } } },
    ]);
    expect(outcome.codes).toContain(SurveyTestIssueCodes.nextPageBlocked);
    expect(outcome.checks[0].details.blockedBy.questions[0].name).toEqual("q1");
  });
  // A command that runs after the blocked one describes a new action, and the old diagnosis stops
  // explaining what happens next.
  test("The blocking data does not survive the next command", async () => {
    const outcome = await runSteps(requiredSurvey, [
      { complete: { survey: true } },
      { set: { insuranceProvider: "Acme" } },
      { expect: { survey: { state: "completed" } } },
    ]);
    const check = outcome.checks[0];
    expect(check.passed, "the survey is still running").toBeFalsy();
    expect(!!check.details && check.details.blockedBy, "nothing blocked the last action").toBeFalsy();
  });
});

describe("Trigger and clearing attribution", () => {
  test("A failing values check names the trigger that wrote the value", async () => {
    const definition = {
      elements: [
        { type: "text", name: "claimAmount", inputType: "number" },
        { type: "text", name: "payout", inputType: "number" },
      ],
      triggers: [{ type: "setvalue", expression: "{claimAmount} notempty", setToName: "payout", setValue: 0 }],
    };
    const outcome = await runSteps(definition, [
      { set: { claimAmount: 500 } },
      { expect: { survey: { values: { payout: 500 } } } },
    ]);
    const check = outcome.checks[0];
    expect(check.passed, "the trigger overwrote the value").toBeFalsy();
    expect(check.actual).toEqual(0);
    const triggers = check.details.triggers;
    expect(triggers.length).toEqual(1);
    expect(triggers[0].triggerType, "the type as the definition writes it").toEqual("setvalue");
    expect(triggers[0].expression).toEqual("{claimAmount} notempty");
    expect(triggers[0].jsonPath).toEqual("triggers[0]");
    expect(triggers[0].stepIndex, "the step that caused it").toEqual(0);
  });
  test("A step that fires nothing attaches nothing", async () => {
    const outcome = await runSteps({
      elements: [{ type: "text", name: "q1" }],
    }, [
      { set: { q1: "a" } },
      { expect: { survey: { state: "completed" } } },
    ]);
    const check = outcome.checks[0];
    expect(check.passed).toBeFalsy();
    expect(!!check.details && check.details.triggers).toBeFalsy();
  });
  test("A value cleared as invisible explains the values failure of the same step", async () => {
    const definition = {
      elements: [
        { type: "radiogroup", name: "hasInsurance", choices: ["yes", "no"] },
        { type: "text", name: "insuranceProvider", visibleIf: "{hasInsurance} = 'yes'" },
      ],
    };
    const outcome = await runSteps(definition, [
      { set: { hasInsurance: "yes" } },
      { set: { insuranceProvider: "Acme" } },
      { set: { hasInsurance: "no" } },
      { complete: { survey: true } },
      { expect: { survey: { values: { insuranceProvider: "Acme" } } } },
    ], { options: { clearInvisibleValues: "onComplete" } });
    const check = outcome.checks[0];
    expect(check.passed, "the value is gone").toBeFalsy();
    expect(check.details.clearedBy.name).toEqual("insuranceProvider");
    expect(check.details.clearedBy.clearInvisibleValues).toEqual("onComplete");
    expect(check.details.clearedBy.jsonPath).toEqual("pages[0].elements[1]");
    const lastStep = outcome.steps[outcome.steps.length - 1];
    expect(lastStep.issues.map((issue: ISurveyTestIssue) => issue.code),
      "the warning is in the results of the step that needed it")
      .toEqual([SurveyTestIssueCodes.valueClearedAsInvisible]);
  });
  test("A survey that clears nothing produces no clearing warning", async () => {
    const outcome = await runSteps(insuranceSurvey, [
      { set: { hasInsurance: "no" } },
      { complete: { survey: true } },
      { expect: { survey: { values: { hasInsurance: "yes" } } } },
    ], { options: { clearInvisibleValues: "onComplete" } });
    expect(outcome.checks[0].passed).toBeFalsy();
    expect(outcome.codes).not.toContain(SurveyTestIssueCodes.valueClearedAsInvisible);
  });
});

describe("Feasibility errors say what the input would have accepted", () => {
  test("A navigation button names the boolean that was false and the command to use instead", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ nextPage: { survey: true } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable);
    expect(issue.data.button).toEqual("sv-nav-next");
    expect(issue.data.flag).toEqual("isShowNextButton");
    expect(issue.data.flagValue).toEqual(false);
    expect(issue.data.page).toEqual("page1");
    expect(issue.data.useCommand, "the last page completes, it does not move on").toEqual("complete");
  });
  test("A question of another page carries both page names and its own path", async () => {
    const definition = {
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    };
    const outcome = await runSteps(definition, [{ set: { q2: "a" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.elementNotOnCurrentPage);
    expect(issue.data.page).toEqual("page2");
    expect(issue.data.currentPage).toEqual("page1");
    expect(issue.jsonPath).toEqual("pages[1].elements[0]");
  });
  test("A hidden question carries the expression that hid it, with its values", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ set: { insuranceProvider: "Acme" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.elementNotVisible);
    expect(issue.jsonPath).toEqual("pages[0].elements[1].visibleIf");
    expect(issue.data.visibleIf).toEqual("{hasInsurance} notempty");
    expect(issue.data.expression.values).toEqual({ hasInsurance: undefined });
    expect(issue.data.expression.result).toEqual(false);
  });
  test("A read-only question carries the enableIf that disabled it", async () => {
    const definition = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", enableIf: "{q1} notempty" },
      ],
    };
    const outcome = await runSteps(definition, [{ set: { q2: "a" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.elementNotEditable);
    expect(issue.jsonPath).toEqual("pages[0].elements[1].enableIf");
    expect(issue.data.enableIf).toEqual("{q1} notempty");
    expect(issue.data.expression.result).toEqual(false);
  });
  test("A masked input carries the mask settings that rejected the value", async () => {
    const definition = {
      elements: [{ type: "text", name: "claimAmount", maskType: "numeric" }],
    };
    const outcome = await runSteps(definition, [{ set: { claimAmount: "about 500" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.valueNotEnterable);
    expect(issue.data.maskType).toEqual("numeric");
    expect(issue.data.maskSettings.decimalSeparator, "the effective settings, defaults included").toEqual(".");
    expect(issue.data.maskSettings.precision).toEqual(2);
    expect(issue.jsonPath).toEqual("pages[0].elements[0]");
  });
  test("A too long value carries the limit and the length it had", async () => {
    const definition = { elements: [{ type: "text", name: "q1", maxLength: 3 }] };
    const outcome = await runSteps(definition, [{ set: { q1: "abcdef" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.valueNotEnterable);
    expect(issue.data.maxLength).toEqual(3);
    expect(issue.data.length).toEqual(6);
  });
  test("A rating carries the values it accepts", async () => {
    const definition = { elements: [{ type: "rating", name: "r1", rateMax: 3 }] };
    const outcome = await runSteps(definition, [{ set: { r1: 7 } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.valueNotEnterable);
    expect(issue.data.rateValues).toEqual([1, 2, 3]);
  });
});

// Every code the tester can produce is a member of the exported constant: a code that is not there
// cannot be localised by the Builder, and adding one without exporting it must fail here.
describe("Issue codes", () => {
  test("The exported set is exactly the one the tester produces", () => {
    expect(Object.keys(SurveyTestIssueCodes)).toEqual([
      "notAnObject", "testsMissing", "testNameMissing", "duplicateTestName", "stepsMissing",
      "stepNotAnObject", "stepEmpty", "stepHasSeveralCommands", "unknownStepKey",
      "commandParamsNotAnObject", "expectNotAnObject", "expectTargetNotAnObject", "expectEmpty",
      "optionsNotAnObject", "variablesNotAnObject", "startsNotAnArray", "startNotAnObject",
      "startNameMissing", "duplicateStartName", "unknownStartReference", "startHasReservedKey",
      "invalidDataMode", "invalidStartPage",
      "functionsNotAnObject", "functionStubNotAnObject", "functionStubHasNoResult",
      "functionStubResultsInvalid", "functionStubDelayNotAsync", "webNotAnObject",
      "webStubNotAnObject", "webStubHasNoResponse", "unknownStubKey",
      "surveyMissing", "surveyJsonExpected", "surveyFactoryFailed", "surveyFactoryInvalidResult",
      "reservedTargetName", "unknownTarget", "ambiguousTarget", "unknownCommand",
      "unknownCheck", "commandNotApplicable", "checkNotApplicable", "invalidCommandParams",
      "invalidCheckPayload", "unknownStartPage", "startPageNotVisible", "asyncOperationTimeout",
      "unexpectedError", "functionStubConflict",
      "navigationButtonNotAvailable", "elementNotOnCurrentPage", "elementNotVisible",
      "elementNotEditable", "commentNotAvailable", "valueNotEnterable", "invalidChoiceValue",
      "cannotAddRows", "cannotRemoveRows",
      "completeBlocked", "nextPageBlocked", "showPreviewBlocked", "addBlocked", "removeBlocked", "rowsAddedImplicitly",
      "rowsNotRemoved", "setWhileHidden", "commentIsOtherText", "choicesNotVerifiable",
      "valueClearedAsInvisible",
      "webRequestNotStubbed", "functionStubFailed", "unknownFunctionCalled",
    ]);
  });
  test("Every code is its own name, so a result can be read without the constant", () => {
    Object.keys(SurveyTestIssueCodes).forEach(key => {
      expect((<any>SurveyTestIssueCodes)[key], key).toEqual(key);
    });
  });
});

// The blocks in the issue are one rendering of the result object. Each test below pulls every fact of
// one block out of the result, so that a renderer needs to add nothing of its own.
describe("The renderings in issue #11692", () => {
  test("\"insuranceProvider\" expected hidden, is visible", async () => {
    const outcome = await runSteps(insuranceSurvey, [
      { set: { hasInsurance: "no" } },
      { expect: { insuranceProvider: { visible: false } } },
    ]);
    const step = outcome.steps[1];
    const check = step.checks[0];
    // Step 2 - expect insuranceProvider.visible
    expect(step.index + 1).toEqual(2);
    expect(step.command).toEqual("expect");
    expect(check.target).toEqual("insuranceProvider");
    expect(check.check).toEqual("visible");
    // "insuranceProvider" expected hidden, is visible.
    expect(check.expected).toEqual(false);
    expect(check.actual).toEqual(true);
    // visibleIf: {hasInsurance} notempty / evaluated with: { hasInsurance: "no" } -> true
    expect(check.details.expression.expression).toEqual("{hasInsurance} notempty");
    expect(check.details.expression.values).toEqual({ hasInsurance: "no" });
    expect(check.details.expression.result).toEqual(true);
    // at pages[0].elements[1].visibleIf
    expect(check.jsonPath).toEqual("pages[0].elements[1].visibleIf");
  });
  test("Expected state \"completed\", got \"running\" - page page1 did not pass validation", async () => {
    const definition = {
      pages: [{
        name: "page1",
        elements: [{ type: "text", name: "insuranceProvider", isRequired: true }],
      }],
    };
    const outcome = await runSteps(definition, [
      { complete: { survey: true } },
      { expect: { survey: { state: "completed" } } },
    ]);
    const check = outcome.checks[0];
    expect(check.expected).toEqual("completed");
    expect(check.actual).toEqual("running");
    // Page "page1" did not pass validation.
    expect(check.details.blockedBy.page).toEqual("page1");
    // Blocking: "insuranceProvider" is required, visible, and empty.
    const blocking = check.details.blockedBy.questions[0];
    expect(blocking.name).toEqual("insuranceProvider");
    expect(blocking.isRequired).toEqual(true);
    expect(blocking.isVisible).toEqual(true);
    expect(blocking.isEmpty).toEqual(true);
  });
  test("Cannot set \"hasInsurace\" - did you mean \"hasInsurance\"", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ set: { hasInsurace: "no" } }]);
    const step = outcome.steps[0];
    expect(step.command, "Step 1 - set").toEqual("set");
    const issue = step.issues[0];
    expect(issue.severity).toEqual("error");
    expect(issue.code).toEqual(SurveyTestIssueCodes.unknownTarget);
    expect(issue.target).toEqual("hasInsurace");
    expect(issue.suggestion).toEqual("Did you mean \"hasInsurance\"?");
  });
  test("\"maybe\" is not an available choice for \"hasInsurance\" - available: yes, no", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ set: { hasInsurance: "maybe" } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.invalidChoiceValue);
    expect(issue.target).toEqual("hasInsurance");
    expect(issue.data.value).toEqual("maybe");
    expect(issue.data.choices).toEqual(["yes", "no"]);
  });
  test("The Next button is not displayed on page \"page1\" - use complete", async () => {
    const outcome = await runSteps(insuranceSurvey, [{ nextPage: { survey: true } }]);
    const issue = findIssue(outcome, SurveyTestIssueCodes.navigationButtonNotAvailable);
    expect(issue.data.command).toEqual("nextPage");
    expect(issue.data.page).toEqual("page1");
    expect(issue.data.flag).toEqual("isShowNextButton");
    expect(issue.data.useCommand).toEqual("complete");
  });
  // Expected state "running", got "completed". Fired: triggers[0] (complete).
  test("A zero claim does not end the survey", async () => {
    const definition = {
      elements: [
        { type: "text", name: "claimAmount", inputType: "number" },
        { type: "text", name: "note" },
      ],
      triggers: [{ type: "complete", expression: "{claimAmount} empty" }],
    };
    // A Complete trigger runs on navigation unless the host asks for it on every value change, and the
    // issue's case is the second one. 0 is not empty for the expression engine (Helpers.isValueEmpty
    // returns false for it), so the answer is cleared instead: the diagnostic is the same one.
    const prev = settings.triggers.executeCompleteOnValueChanged;
    settings.triggers.executeCompleteOnValueChanged = true;
    try {
      const outcome = await runSteps(definition, [
        { set: { claimAmount: 500 } },
        { clear: { claimAmount: true } },
        { expect: { survey: { state: "running" } } },
      ]);
      const check = outcome.checks[0];
      expect(check.expected).toEqual("running");
      expect(check.actual).toEqual("completed");
      const fired = check.details.triggers[0];
      expect(fired.jsonPath).toEqual("triggers[0]");
      expect(fired.triggerType).toEqual("complete");
      expect(fired.expression).toEqual("{claimAmount} empty");
    } finally {
      settings.triggers.executeCompleteOnValueChanged = prev;
    }
  });
  test("\"excess\" is set while hidden and may be cleared on completion", async () => {
    const definition = {
      elements: [
        { type: "radiogroup", name: "hasInsurance", choices: ["yes", "no"] },
        { type: "text", name: "excess", visibleIf: "{hasInsurance} = 'yes'" },
      ],
    };
    const outcome = await runSteps(definition, [{ setDirectly: { excess: 100 } }],
      { options: { clearInvisibleValues: "onComplete" } });
    const issue = findIssue(outcome, SurveyTestIssueCodes.setWhileHidden);
    expect(issue.severity).toEqual("warning");
    expect(issue.data.target).toEqual("excess");
    expect(issue.data.clearInvisibleValues).toEqual("onComplete");
  });
});

// The trace of a failed check reads the expression, it does not run it. Running one that calls a
// function would call that function a second time: the stub dispatcher routes by survey and its cache
// is off on purpose, so a stub that reports a failure would report it twice and a handler the
// application supplied would run twice - from a step that performs no command at all.
describe("Expression traces never re-run what they explain", () => {
  const stubbedExpression = {
    elements: [
      { type: "text", name: "trigger" },
      { type: "text", name: "q1", visibleIf: "boom() = 1" },
    ],
  };
  test("A step that only checks produces no issue of the stub's own", async () => {
    const result = await new SurveyTestRunner(stubbedExpression, {
      functions: { boom: { async: false, error: "handler exploded" } },
      tests: [{
        name: "trace",
        steps: [
          { name: "act", set: { trigger: "x" } },
          { name: "check", expect: { q1: { visible: true } } },
        ],
      }],
    }).run();
    const steps = result.tests[0].steps;
    expect(steps[0].issues.map(issue => issue.code), "the command called the stub")
      .toEqual([SurveyTestIssueCodes.functionStubFailed]);
    expect(steps[1].issues.map(issue => issue.code), "the check did not call it again").toEqual([]);
  });
  test("The trace of an expression that calls a function reports the values without a result", () => {
    const survey = new SurveyModel({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "someFunc({q1}) = 1" },
      ],
    });
    survey.setValue("q1", "a");
    const trace = getExpressionTrace(survey.getQuestionByName("q2"), "someFunc({q1}) = 1");
    expect(trace.values, "the values it reads are still reported").toEqual({ q1: "a" });
    expect(trace.result, "and the result is not computed by running it").toBeUndefined();
  });
});

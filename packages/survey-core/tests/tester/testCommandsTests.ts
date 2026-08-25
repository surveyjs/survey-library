import { SurveyModel } from "../../src/survey";
import { ISurveyTestContext } from "../../src/tester/test-context";
import { ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { SurveyTestCommandFactory } from "../../src/tester/test-commands";

import { afterAll, beforeAll, describe, expect, test } from "vitest";

// A test helper command, not a built-in: it hands the live SurveyModel of the run to the test so that
// the assertions can be made on the model and not only on the result object. It runs as the first
// step of every case, so the model is available even when a later step ends the case with an error.
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

const twoQuestions = {
  elements: [
    { type: "text", name: "q1" },
    { type: "text", name: "q2" },
  ],
};
const twoPages = {
  pages: [
    { name: "page1", elements: [{ type: "text", name: "q1" }] },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};

describe("The command registry is the full built-in set", () => {
  test("Every built-in command is registered and listed in a stable order", () => {
    const names = SurveyTestCommandFactory.Instance.getNames().filter(name => name !== CAPTURE);
    expect(names, "every command of the format is registered").toEqual([
      "addPanel", "addRow", "cancelPreview", "clear", "complete", "expect", "nextPage", "prevPage",
      "removePanel", "removeRow", "set", "setComment", "setDirectly", "showPreview", "startSurvey",
    ]);
  });
  test("The survey and the element command lists do not overlap except for expect", () => {
    const forSurvey = SurveyTestCommandFactory.Instance.getNamesForKind("survey").filter(name => name !== CAPTURE);
    const forQuestion = SurveyTestCommandFactory.Instance.getNamesForKind("question");
    expect(forSurvey, "the survey commands").toEqual([
      "cancelPreview", "complete", "expect", "nextPage", "prevPage", "showPreview", "startSurvey",
    ]);
    expect(forQuestion, "the element commands").toEqual([
      "addPanel", "addRow", "clear", "expect", "removePanel", "removeRow", "set", "setComment", "setDirectly",
    ]);
  });
  test("The names cut from the draft format are genuinely unknown", async () => {
    const names = ["goToPage", "validate", "mergeData", "setDynamicProperty", "setVariable"];
    for (let i = 0; i < names.length; i++) {
      const outcome = await runSteps(twoQuestions, [{ [names[i]]: { survey: true } }]);
      expect(outcome.codes, names[i] + " is not a command").toContain(SurveyTestIssueCodes.unknownCommand);
      expect(outcome.messages.indexOf("Available commands:") > -1, "the message lists the valid names").toBeTruthy();
    }
  });
});

describe("set", () => {
  test("The happy path stores the value on the model", async () => {
    const outcome = await runSteps(twoQuestions, [{ set: { q1: "a", q2: "b" } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "q1").value, "the first value").toEqual("a");
    expect(question(outcome, "q2").value, "the second value").toEqual("b");
    expect(outcome.survey.data, "the survey data").toEqual({ q1: "a", q2: "b" });
  });
  test("set on a survey target is not applicable", async () => {
    const outcome = await runSteps(twoQuestions, [{ set: { survey: "a" } }]);
    expect(outcome.codes, "the command does not apply to the survey").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
  test("set on a page target is not applicable", async () => {
    const outcome = await runSteps(twoPages, [{ set: { page1: "a" } }]);
    expect(outcome.codes, "the command does not apply to a page").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
  test("set runs the triggers, exactly as a respondent's input does", async () => {
    const outcome = await runSteps({
      triggers: [{ type: "setvalue", expression: "{q1} = 10", setToName: "q2", setValue: "by the trigger" }],
      elements: [{ type: "text", name: "q1", inputType: "number" }, { type: "text", name: "q2" }],
    }, [
      { set: { q1: 10 } },
      { expect: { q2: { value: "by the trigger" } } },
    ]);
    expect(outcome.status, "the trigger ran").toEqual("passed");
    expect(question(outcome, "q2").value, "the trigger wrote the value").toEqual("by the trigger");
  });
  test("A value that is not among the choices is a case error listing the choices", async () => {
    const outcome = await runSteps({
      elements: [{ type: "radiogroup", name: "q1", choices: ["yes", "no"] }],
    }, [{ set: { q1: "maybe" } }]);
    expect(outcome.codes, "the value is not a choice").toEqual([SurveyTestIssueCodes.invalidChoiceValue]);
    expect(outcome.messages.indexOf("\"yes\", \"no\"") > -1, "the message lists the choices").toBeTruthy();
    expect(question(outcome, "q1").isEmpty(), "nothing was assigned").toBeTruthy();
  });
  test("The other choice passes when the question enables it", async () => {
    const outcome = await runSteps({
      elements: [{ type: "radiogroup", name: "q1", choices: ["yes", "no"], hasOther: true }],
    }, [{ set: { q1: "other" } }]);
    expect(outcome.status, "\"other\" is a real choice here").toEqual("passed");
    expect(question(outcome, "q1").value, "the value is stored").toEqual("other");
  });
  test("The other choice is rejected when the question does not enable it", async () => {
    const outcome = await runSteps({
      elements: [{ type: "radiogroup", name: "q1", choices: ["yes", "no"] }],
    }, [{ set: { q1: "other" } }]);
    expect(outcome.codes, "\"other\" is not offered").toEqual([SurveyTestIssueCodes.invalidChoiceValue]);
  });
  test("Choices loaded from a web service are not verified, and the case is told so", async () => {
    const globalAny: any = globalThis;
    const savedXhr = globalAny.XMLHttpRequest;
    globalAny.XMLHttpRequest = class {
      public status: number = 200;
      public response: string = "[]";
      public onload: () => void;
      public open(): void {}
      public setRequestHeader(): void {}
      public send(): void { this.onload(); }
    };
    try {
      const outcome = await runSteps({
        elements: [{ type: "dropdown", name: "q1", choicesByUrl: { url: "https://surveyjs.io/api/countries" } }],
      }, [{ set: { q1: "Neverland" } }]);
      expect(outcome.status, "the value goes in").toEqual("passed");
      expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.choicesNotVerifiable]);
    } finally {
      globalAny.XMLHttpRequest = savedXhr;
    }
  });
});

describe("setDirectly", () => {
  test("It assigns a value a respondent cannot enter and warns about it", async () => {
    const outcome = await runSteps({
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "hidden", visibleIf: "{q1} = 'show'" },
      ],
    }, [{ setDirectly: { hidden: "assigned" } }]);
    expect(outcome.status, "the step does not fail").toEqual("passed");
    expect(question(outcome, "hidden").value, "the value is assigned").toEqual("assigned");
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.setWhileHidden]);
    expect(outcome.messages.indexOf("onComplete") > -1, "the effective clearInvisibleValues mode is named").toBeTruthy();
  });
  test("A visible question is assigned without a warning", async () => {
    const outcome = await runSteps(twoQuestions, [{ setDirectly: { q1: "a" } }]);
    expect(outcome.codes, "no warning").toEqual([]);
    expect(question(outcome, "q1").value, "the value is assigned").toEqual("a");
  });
  test("setDirectly on a survey target is not applicable", async () => {
    const outcome = await runSteps(twoQuestions, [{ setDirectly: { survey: "a" } }]);
    expect(outcome.codes, "the command does not apply to the survey").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
});

describe("clear", () => {
  test("It clears one question and leaves the others alone", async () => {
    const outcome = await runSteps(twoQuestions, [
      { set: { q1: "a", q2: "b" } },
      { clear: { q1: true } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.survey.data, "only q1 is gone").toEqual({ q2: "b" });
  });
  test("It is not a survey command: restarting a survey mid-case is a second test", async () => {
    const outcome = await runSteps(twoQuestions, [{ clear: { survey: true } }]);
    expect(outcome.codes, "the command does not apply to the survey").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
    expect(outcome.messages.indexOf("Commands for a survey:") > -1, "the message lists the survey commands").toBeTruthy();
  });
  test("Its payload is true and nothing else", async () => {
    const outcome = await runSteps(twoQuestions, [{ clear: { q1: { keepComment: true } } }]);
    expect(outcome.codes, "an object is not a synonym of true").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(outcome.messages.indexOf("\"keepComment\"") > -1, "the message names the offending key").toBeTruthy();
  });
});

describe("setComment", () => {
  test("The happy path stores the comment", async () => {
    const outcome = await runSteps({
      elements: [{ type: "radiogroup", name: "q1", choices: ["yes", "no"], showCommentArea: true }],
    }, [{ setComment: { q1: "because" } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "q1").comment, "the comment is stored").toEqual("because");
    expect(outcome.survey.data["q1-Comment"], "the comment reaches the data").toEqual("because");
  });
  test("It takes a string and nothing else", async () => {
    const outcome = await runSteps(twoQuestions, [{ setComment: { q1: 42 } }]);
    expect(outcome.codes, "a number is not a comment").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(outcome.messages.indexOf("a string") > -1, "the message states what was expected").toBeTruthy();
  });
  test("setComment on a survey target is not applicable", async () => {
    const outcome = await runSteps(twoQuestions, [{ setComment: { survey: "a" } }]);
    expect(outcome.codes, "the command does not apply to the survey").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
});

const dynamicMatrix = {
  elements: [{
    type: "matrixdynamic", name: "m1", rowCount: 1,
    columns: [{ cellType: "text", name: "col1" }],
  }],
};
const dynamicPanel = {
  elements: [{
    type: "paneldynamic", name: "panel", panelCount: 1,
    templateElements: [{ type: "text", name: "q1" }],
  }],
};

describe("addRow and removeRow", () => {
  test("addRow grows the matrix by the given count", async () => {
    const outcome = await runSteps(dynamicMatrix, [{ addRow: { m1: 2 } }]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "m1").rowCount, "two rows were added").toEqual(3);
  });
  test("A following set lands in the new row", async () => {
    const outcome = await runSteps(dynamicMatrix, [
      { addRow: { m1: 1 } },
      { set: { "m1[1].col1": "second" } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "m1").value, "the value landed in the new row").toEqual([{}, { col1: "second" }]);
  });
  test("removeRow shrinks the matrix", async () => {
    const outcome = await runSteps(dynamicMatrix, [
      { addRow: { m1: 2 } },
      { removeRow: { m1: 0 } },
    ]);
    expect(question(outcome, "m1").rowCount, "one row is gone").toEqual(2);
  });
  test("Removing an index the matrix does not have is a case error", async () => {
    const outcome = await runSteps(dynamicMatrix, [
      { addRow: { m1: 1 } },
      { removeRow: { m1: 5 } },
    ]);
    expect(outcome.codes, "the index is out of range").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(outcome.messages.indexOf("between 0 and 1") > -1, "the message states the range").toBeTruthy();
    expect(question(outcome, "m1").rowCount, "the matrix is untouched").toEqual(2);
  });
  test("addRow always takes a number, never true", async () => {
    const outcome = await runSteps(dynamicMatrix, [{ addRow: { m1: true } }]);
    expect(outcome.codes, "true is not a count").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(outcome.messages.indexOf("a number") > -1, "the message states what was expected").toBeTruthy();
  });
  test("A count of zero is rejected: a command that changes nothing is a mistake", async () => {
    const outcome = await runSteps(dynamicMatrix, [{ addRow: { m1: 0 } }]);
    expect(outcome.codes, "zero is not a count").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
  });
  test("addRow on a question that is not a dynamic matrix names the actual type", async () => {
    const outcome = await runSteps(twoQuestions, [{ addRow: { q1: 1 } }]);
    expect(outcome.codes, "the command does not apply").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
    expect(outcome.messages.indexOf("\"text\"") > -1, "the message names the actual question type").toBeTruthy();
  });
  test("addRow on a dynamic panel names the actual type as well", async () => {
    const outcome = await runSteps(dynamicPanel, [{ addRow: { panel: 1 } }]);
    expect(outcome.codes, "a dynamic panel has panels, not rows").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
    expect(outcome.messages.indexOf("\"paneldynamic\"") > -1, "the message names the actual question type").toBeTruthy();
  });
});

describe("addPanel and removePanel", () => {
  test("addPanel grows the dynamic panel and a following set lands in the new panel", async () => {
    const outcome = await runSteps(dynamicPanel, [
      { addPanel: { panel: 1 } },
      { set: { "panel[1].q1": "second" } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(question(outcome, "panel").panelCount, "one panel was added").toEqual(2);
    expect(question(outcome, "panel").value, "the value landed in the new panel").toEqual([{}, { q1: "second" }]);
  });
  test("removePanel shrinks the dynamic panel", async () => {
    const outcome = await runSteps(dynamicPanel, [
      { addPanel: { panel: 2 } },
      { removePanel: { panel: 0 } },
    ]);
    expect(question(outcome, "panel").panelCount, "one panel is gone").toEqual(2);
  });
  test("Removing an index the dynamic panel does not have is a case error", async () => {
    const outcome = await runSteps(dynamicPanel, [{ removePanel: { panel: 5 } }]);
    expect(outcome.codes, "the index is out of range").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(question(outcome, "panel").panelCount, "the question is untouched").toEqual(1);
  });
  test("addPanel on a question that is not a dynamic panel names the actual type", async () => {
    const outcome = await runSteps(dynamicMatrix, [{ addPanel: { m1: 1 } }]);
    expect(outcome.codes, "the command does not apply").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
    expect(outcome.messages.indexOf("\"matrixdynamic\"") > -1, "the message names the actual question type").toBeTruthy();
  });
});

describe("complete", () => {
  test("The happy path completes the survey", async () => {
    const outcome = await runSteps(twoQuestions, [
      { set: { q1: "a" } },
      { complete: { survey: true } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.survey.state, "the survey is complete").toEqual("completed");
  });
  test("A required empty question blocks completion without failing the step", async () => {
    const outcome = await runSteps({
      elements: [{ type: "text", name: "q1", isRequired: true }],
    }, [{ complete: { survey: true } }]);
    expect(outcome.status, "the step did not fail: the respondent really pressed Complete").toEqual("passed");
    expect(outcome.survey.state, "the survey stays running").toEqual("running");
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.completeBlocked]);
    expect(outcome.messages.indexOf("q1") > -1, "the warning names the blocking question").toBeTruthy();
  });
  test("The same case completes once the question is answered", async () => {
    const outcome = await runSteps({
      elements: [{ type: "text", name: "q1", isRequired: true }],
    }, [
      { set: { q1: "a" } },
      { complete: { survey: true } },
    ]);
    expect(outcome.codes, "nothing blocked it").toEqual([]);
    expect(outcome.survey.state, "the survey is complete").toEqual("completed");
  });
  test("A leftover force parameter is reported instead of being ignored", async () => {
    const outcome = await runSteps(twoQuestions, [{ complete: { survey: { force: true } } }]);
    expect(outcome.codes, "the payload is wrong").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(outcome.messages.indexOf("\"force\"") > -1, "the message names the offending key").toBeTruthy();
    expect(outcome.survey.state, "the survey is untouched").toEqual("running");
  });
  test("A force parameter written as a target is an unknown target", async () => {
    const outcome = await runSteps(twoQuestions, [{ complete: { force: true } }]);
    expect(outcome.codes, "\"force\" is read as a target name").toEqual([SurveyTestIssueCodes.unknownTarget]);
    expect(outcome.survey.state, "the survey is untouched").toEqual("running");
  });
  test("complete on a question target is not applicable", async () => {
    const outcome = await runSteps(twoQuestions, [{ complete: { q1: true } }]);
    expect(outcome.codes, "the command applies to the survey only").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
});

describe("nextPage and prevPage", () => {
  test("nextPage moves to the next page and prevPage moves back", async () => {
    const outcome = await runSteps(twoPages, [
      { nextPage: { survey: true } },
      { set: { q2: "b" } },
      { prevPage: { survey: true } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.survey.currentPage.name, "the survey is back on page 1").toEqual("page1");
    expect(outcome.survey.data, "the value entered on page 2 is kept").toEqual({ q2: "b" });
  });
  test("A blocked nextPage keeps the page and warns", async () => {
    const outcome = await runSteps({
      pages: [
        { name: "page1", elements: [{ type: "text", name: "q1", isRequired: true }] },
        { name: "page2", elements: [{ type: "text", name: "q2" }] },
      ],
    }, [{ nextPage: { survey: true } }]);
    expect(outcome.status, "the step did not fail").toEqual("passed");
    expect(outcome.codes, "the case is warned").toEqual([SurveyTestIssueCodes.nextPageBlocked]);
    expect(outcome.survey.currentPage.name, "the survey stays on page 1").toEqual("page1");
  });
  test("nextPage on a question target is not applicable", async () => {
    const outcome = await runSteps(twoPages, [{ nextPage: { q1: true } }]);
    expect(outcome.codes, "the command applies to the survey only").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
  test("nextPage takes true and nothing else", async () => {
    const outcome = await runSteps(twoPages, [{ nextPage: { survey: 1 } }]);
    expect(outcome.codes, "1 is not true").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
  });
});

const previewSurvey = {
  showPreviewBeforeComplete: "showAllQuestions",
  elements: [{ type: "text", name: "q1" }],
};

describe("showPreview and cancelPreview", () => {
  test("showPreview switches the state and cancelPreview switches it back", async () => {
    const outcome = await runSteps(previewSurvey, [
      { set: { q1: "a" } },
      { showPreview: { survey: true } },
      { cancelPreview: { survey: true } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.survey.state, "the survey is running again").toEqual("running");
  });
  test("The preview state is reported while the preview is shown", async () => {
    const outcome = await runSteps(previewSurvey, [{ showPreview: { survey: true } }]);
    expect(outcome.survey.state, "the survey previews the answers").toEqual("preview");
  });
  test("showPreview on a question target is not applicable", async () => {
    const outcome = await runSteps(previewSurvey, [{ showPreview: { q1: true } }]);
    expect(outcome.codes, "the command applies to the survey only").toEqual([SurveyTestIssueCodes.commandNotApplicable]);
  });
});

describe("startSurvey", () => {
  test("It leaves the start page of a survey that has one", async () => {
    const outcome = await runSteps({
      firstPageIsStartPage: true,
      pages: [
        { name: "start", elements: [{ type: "html", name: "intro" }] },
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
      ],
    }, [
      { startSurvey: { survey: true } },
      { set: { q1: "a" } },
    ]);
    expect(outcome.status, "the test passes").toEqual("passed");
    expect(outcome.survey.state, "the survey is running").toEqual("running");
    expect(outcome.survey.data, "the first page is now reachable").toEqual({ q1: "a" });
  });
  test("startSurvey takes true and nothing else", async () => {
    const outcome = await runSteps({
      firstPageIsStartPage: true,
      pages: [
        { name: "start", elements: [{ type: "html", name: "intro" }] },
        { name: "page1", elements: [{ type: "text", name: "q1" }] },
      ],
    }, [{ startSurvey: { survey: { skipValidation: true } } }]);
    expect(outcome.codes, "an object is not true").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(outcome.messages.indexOf("\"skipValidation\"") > -1, "the message names the offending key").toBeTruthy();
  });
});

// This trio documents how a case asserts validation without a "validate" command.
describe("Validation errors are navigation-driven", () => {
  const survey = {
    elements: [{ type: "text", name: "q1", inputType: "number", validators: [{ type: "numeric", minValue: 10 }] }],
  };
  test("An invalid value produces no error under the default checkErrorsMode", async () => {
    const outcome = await runSteps(survey, [{ set: { q1: 5 } }]);
    expect(question(outcome, "q1").value, "the value went in").toEqual(5);
    expect(question(outcome, "q1").errors.length, "no error yet").toEqual(0);
  });
  test("A blocked complete produces the error", async () => {
    const outcome = await runSteps(survey, [
      { set: { q1: 5 } },
      { complete: { survey: true } },
    ]);
    expect(outcome.codes, "completion was blocked").toEqual([SurveyTestIssueCodes.completeBlocked]);
    expect(question(outcome, "q1").errors.length, "the error is there").toEqual(1);
    expect(outcome.survey.state, "the survey stays running").toEqual("running");
  });
  test("checkErrorsMode onValueChanged produces the error right after set", async () => {
    const outcome = await runSteps(survey, [{ set: { q1: 5 } }], { checkErrorsMode: "onValueChanged" });
    expect(question(outcome, "q1").errors.length, "the error is there without navigating").toEqual(1);
  });
});

describe("A command that throws never escapes run()", () => {
  test("An exception from survey-core becomes an unexpectedError issue", async () => {
    SurveyTestCommandFactory.Instance.register({
      name: "throwsForTest",
      allowSurvey: true,
      allowElement: false,
      payloadType: "none",
      run: (): void => { throw new Error("boom"); },
    });
    try {
      const outcome = await runSteps(twoQuestions, [{ throwsForTest: { survey: true } }]);
      expect(outcome.status, "the test errors").toEqual("error");
      expect(outcome.codes, "the exception is reported as an unexpected error")
        .toEqual([SurveyTestIssueCodes.unexpectedError]);
      expect(outcome.messages.indexOf("boom") > -1, "the message carries the exception text").toBeTruthy();
    } finally {
      SurveyTestCommandFactory.Instance.unregister("throwsForTest");
    }
  });
});

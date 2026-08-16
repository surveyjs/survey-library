import { SurveyModel } from "../../src/survey";
import { ISurveyTestIssue, ISurveyTestsResult, SurveyTestIssueCodes } from "../../src/tester/test-result";
import { ISurveyTestContext, ISurveyTestTarget, SurveyTestCaseError, SurveyTestContext } from "../../src/tester/test-context";
import { SurveyTestRunner } from "../../src/tester/test-runner";
import { SurveyTestCommandFactory } from "../../src/tester/test-commands";
import { SurveyTestCheckFactory } from "../../src/tester/test-checks";

import { afterEach, beforeEach, describe, expect, test } from "vitest";

const targetSurvey = {
  calculatedValues: [{ name: "calc1", expression: "1 + 2" }],
  pages: [
    {
      name: "page1",
      elements: [
        { type: "text", name: "q1" },
        {
          type: "panel", name: "staticPanel",
          elements: [{ type: "text", name: "inPanel" }],
        },
        {
          type: "paneldynamic", name: "panelDynamic", panelCount: 2,
          templateElements: [{ type: "text", name: "dq1" }],
        },
        {
          type: "matrixdynamic", name: "matrixDynamic", rowCount: 2,
          columns: [{ name: "col1", cellType: "text" }],
        },
        {
          type: "matrixdropdown", name: "matrixDropdown", rows: ["row1", "row2"],
          columns: [{ name: "col1", cellType: "text" }],
        },
      ],
    },
    { name: "page2", elements: [{ type: "text", name: "q2" }] },
  ],
};

interface ITestContextInfo {
  context: SurveyTestContext;
  issues: Array<ISurveyTestIssue>;
}

function createContext(definition: any = targetSurvey): ITestContextInfo {
  const issues: Array<ISurveyTestIssue> = [];
  const context = new SurveyTestContext({}, { name: "target test", steps: [] }, issues);
  // The runner creates the model through its factory and hands it over; a context test does it itself.
  context.setupSurvey(new SurveyModel(JSON.parse(JSON.stringify(definition))));
  return { context: context, issues: issues };
}
function resolveError(context: SurveyTestContext, name: string): ISurveyTestIssue {
  try {
    context.resolveTarget(name);
  } catch(e) {
    if (e instanceof SurveyTestCaseError) return e.issue;
    throw e;
  }
  return undefined;
}
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

describe("SurveyTestContext: target resolution", () => {
  test("A question, a panel, a page and a calculated value resolve by name", () => {
    const info = createContext();
    const context = info.context;
    try {
      const question = context.resolveTarget("q1");
      expect(question.kind, "q1 is a question").toEqual("question");
      expect(question.obj, "q1 is the model question").toBe(context.survey.getQuestionByName("q1"));
      expect(question.name, "the target keeps the name as written").toEqual("q1");
      const panel = context.resolveTarget("staticPanel");
      expect(panel.kind, "staticPanel is a panel").toEqual("panel");
      expect(panel.obj, "staticPanel is the model panel").toBe(context.survey.getPanelByName("staticPanel"));
      const page = context.resolveTarget("page2");
      expect(page.kind, "page2 is a page").toEqual("page");
      expect(page.obj, "page2 is the model page").toBe(context.survey.getPageByName("page2"));
      const calculated = context.resolveTarget("calc1");
      expect(calculated.kind, "calc1 is a calculated value").toEqual("calculatedValue");
      expect(calculated.obj, "calc1 is the model calculated value").toBe(context.survey.getCalculatedValueByName("calc1"));
    } finally {
      context.teardown();
    }
  });
  test("\"survey\" resolves to the survey model", () => {
    const info = createContext();
    try {
      const target = info.context.resolveTarget("survey");
      expect(target.kind, "the kind is survey").toEqual("survey");
      expect(target.obj, "the object is the model").toBe(info.context.survey);
    } finally {
      info.context.teardown();
    }
  });
  test("A question inside a static panel resolves by its own name", () => {
    const info = createContext();
    try {
      const target = info.context.resolveTarget("inPanel");
      expect(target.kind, "the panel question is a question").toEqual("question");
      expect(target.obj, "it is the model question").toBe(info.context.survey.getQuestionByName("inPanel"));
    } finally {
      info.context.teardown();
    }
  });
  test("An index addresses the panels of a dynamic panel", () => {
    const info = createContext();
    const context = info.context;
    try {
      const first = context.resolveTarget("panelDynamic[0].dq1");
      const second = context.resolveTarget("panelDynamic[1].dq1");
      expect(first.obj === second.obj, "two panels hold two different questions").toBeFalsy();
      first.obj.value = "a";
      second.obj.value = "b";
      expect(context.resolveTarget("panelDynamic[0].dq1").obj.value, "the first panel value").toEqual("a");
      expect(context.resolveTarget("panelDynamic[1].dq1").obj.value, "the second panel value").toEqual("b");
    } finally {
      context.teardown();
    }
  });
  test("A bare index resolves to the panel of a dynamic panel and to the row of a matrix", () => {
    const info = createContext();
    const context = info.context;
    try {
      const panel = context.resolveTarget("panelDynamic[1]");
      expect(panel.kind, "a dynamic panel item is a panel").toEqual("panel");
      expect(panel.obj, "it is the model panel").toBe((<any>context.survey.getQuestionByName("panelDynamic")).panels[1]);
      const row = context.resolveTarget("matrixDynamic[1]");
      expect(row.obj, "it is the model row").toBe((<any>context.survey.getQuestionByName("matrixDynamic")).visibleRows[1]);
    } finally {
      context.teardown();
    }
  });
  test("A matrix cell resolves by index and by row name", () => {
    const info = createContext();
    const context = info.context;
    try {
      const dynamicCell = context.resolveTarget("matrixDynamic[0].col1");
      expect(dynamicCell.kind, "a cell is a question").toEqual("question");
      expect(dynamicCell.obj, "it is the cell question of the first row")
        .toBe((<any>context.survey.getQuestionByName("matrixDynamic")).visibleRows[0].getQuestionByColumnName("col1"));
      const dropdownCell = context.resolveTarget("matrixDropdown.row1.col1");
      expect(dropdownCell.obj, "it is the cell question of the row named row1")
        .toBe((<any>context.survey.getQuestionByName("matrixDropdown")).visibleRows[0].getQuestionByColumnName("col1"));
    } finally {
      context.teardown();
    }
  });
  test("An unknown name and an index out of range produce unknownTarget", () => {
    const info = createContext();
    const context = info.context;
    try {
      const unknown = resolveError(context, "noSuchQuestion");
      expect(unknown.code, "an unknown name").toEqual(SurveyTestIssueCodes.unknownTarget);
      expect(unknown.message.indexOf("noSuchQuestion") > -1, "the message names the failing segment").toBeTruthy();
      const outOfRange = resolveError(context, "panelDynamic[5].dq1");
      expect(outOfRange.code, "an index out of range").toEqual(SurveyTestIssueCodes.unknownTarget);
      expect(outOfRange.message.indexOf("panelDynamic") > -1, "the message names the failing segment").toBeTruthy();
      expect(outOfRange.message.indexOf("2 item(s)") > -1, "the message states how many items there are").toBeTruthy();
      const unknownChild = resolveError(context, "panelDynamic[0].noSuchQuestion");
      expect(unknownChild.code, "an unknown name inside a container").toEqual(SurveyTestIssueCodes.unknownTarget);
      expect(unknownChild.message.indexOf("panelDynamic[0]") > -1, "the message names the prefix that resolved").toBeTruthy();
      const notIndexed = resolveError(context, "q1[0]");
      expect(notIndexed.code, "an index on an element without indexed children").toEqual(SurveyTestIssueCodes.unknownTarget);
      const malformed = resolveError(context, "q1[");
      expect(malformed.code, "a malformed path").toEqual(SurveyTestIssueCodes.unknownTarget);
    } finally {
      context.teardown();
    }
  });
  test("A question and a page with the same name: the question wins and a warning is recorded", () => {
    const info = createContext({
      pages: [
        { name: "sameName", elements: [{ type: "text", name: "sameName" }] },
      ],
    });
    const context = info.context;
    try {
      const target = context.resolveTarget("sameName");
      expect(target.kind, "the question wins").toEqual("question");
      expect(codes(info.issues), "the ambiguity is recorded").toEqual([SurveyTestIssueCodes.ambiguousTarget]);
      expect(info.issues[0].severity, "it is a warning, not an error").toEqual("warning");
    } finally {
      context.teardown();
    }
  });
  test("The target cache never hands out a stale object", () => {
    const info = createContext();
    const context = info.context;
    const survey = context.survey;
    try {
      const question = context.resolveTarget("q1");
      survey.currentPage = survey.getPageByName("page2");
      expect(context.resolveTarget("q1").obj, "the question is the live one after a page change")
        .toBe(survey.getQuestionByName("q1"));
      expect(question.obj, "the cached question is the same model object").toBe(survey.getQuestionByName("q1"));
      const dynamicPanel: any = survey.getQuestionByName("panelDynamic");
      context.resolveTarget("panelDynamic[0].dq1");
      dynamicPanel.removePanel(0);
      expect(context.resolveTarget("panelDynamic[0].dq1").obj, "the question is the live one after a panel is removed")
        .toBe(dynamicPanel.panels[0].getQuestionByName("dq1"));
    } finally {
      context.teardown();
    }
  });
});

describe("SurveyTestRunner: targets in a case", () => {
  test("An element named \"survey\" ends the test before any step runs", async () => {
    const result = await run({ elements: [{ type: "text", name: "survey" }] }, {
      tests: [{
        name: "reserved",
        steps: [{ set: { survey: 1 } }, { expect: { survey: { value: 1 } } }],
      }],
    });
    expect(result.status, "the suite errors").toEqual("error");
    expect(result.tests[0].status, "the test errors").toEqual("error");
    expect(result.tests[0].steps.length, "no step runs").toEqual(0);
    expect(codes(result.tests[0].issues), "the reserved name is reported")
      .toEqual([SurveyTestIssueCodes.reservedTargetName]);
  });
  test("An unknown target is a case error in expect exactly as it is in set", async () => {
    const suite = (command: any) => ({ tests: [{ name: "unknown target", steps: [command] }] });
    const setResult = await run(targetSurvey, suite({ set: { noSuchQuestion: 1 } }));
    expect(codes(allIssues(setResult)), "set reports an unknown target")
      .toEqual([SurveyTestIssueCodes.unknownTarget]);
    expect(setResult.tests[0].status, "the test errors").toEqual("error");
    const expectResult = await run(targetSurvey, suite({ expect: { noSuchQuestion: { value: 1 } } }));
    expect(codes(allIssues(expectResult)), "expect reports an unknown target")
      .toEqual([SurveyTestIssueCodes.unknownTarget]);
    expect(expectResult.tests[0].status, "the test errors").toEqual("error");
    expect(expectResult.tests[0].steps[0].checks.length, "no check is produced").toEqual(0);
  });
});

describe("SurveyTestRunner: the payload is checked before the handler runs", () => {
  let calls: Array<string>;
  beforeEach(() => {
    calls = [];
    SurveyTestCommandFactory.Instance.register({
      name: "addRow",
      payloadType: "number",
      run: (context: ISurveyTestContext, target: ISurveyTestTarget) => { calls.push("addRow:" + target.name); },
    });
    SurveyTestCheckFactory.Instance.register({
      name: "visible",
      payloadType: "boolean",
      check: (context: ISurveyTestContext, target: ISurveyTestTarget) => {
        calls.push("visible:" + target.name);
        return { passed: true, actual: true };
      },
    });
  });
  afterEach(() => {
    SurveyTestCommandFactory.Instance.unregister("addRow");
    SurveyTestCheckFactory.Instance.unregister("visible");
  });
  test("A command payload of the wrong type produces invalidCommandParams", async () => {
    const result = await run(targetSurvey, {
      tests: [{ name: "bad params", steps: [{ addRow: { matrixDynamic: true } }] }],
    });
    const issues = allIssues(result);
    expect(codes(issues), "the payload is rejected").toEqual([SurveyTestIssueCodes.invalidCommandParams]);
    expect(issues[0].message.indexOf("a number") > -1, "the message names the expected type").toBeTruthy();
    expect(calls, "the handler is never called").toEqual([]);
  });
  test("A check payload of the wrong type produces invalidCheckPayload", async () => {
    const result = await run(targetSurvey, {
      tests: [{ name: "bad expected", steps: [{ expect: { q1: { visible: "yes" } } }] }],
    });
    const issues = allIssues(result);
    expect(codes(issues), "the expected value is rejected").toEqual([SurveyTestIssueCodes.invalidCheckPayload]);
    expect(issues[0].message.indexOf("a boolean") > -1, "the message names the expected type").toBeTruthy();
    expect(calls, "the handler is never called").toEqual([]);
    expect(result.tests[0].steps[0].checks.length, "no check result is produced").toEqual(0);
  });
});

import { SurveyModel } from "../src/survey";
import { ConditionRunner } from "../src/conditions/conditionRunner";
import { FunctionFactory, registerFunction, IFunctionRegistration } from "../src/functionsfactory";
import { ConsoleWarnings } from "../src/console-warnings";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { lintSurvey } from "../src/linter/index";

import { describe, test, expect } from "vitest";

const surveyJson = {
  elements: [
    { type: "text", name: "q" },
    { type: "text", name: "t", visibleIf: "hasValue('q')" },
  ],
};
// How a case puts its value into the survey: setValue, or survey.data = { q: v }
type HowSet = "setValue" | "data";
interface IValueCase {
  title: string;
  apply: (survey: SurveyModel, how: HowSet) => void;
  expected: { setValue: boolean, data: boolean };
}
function setCase(title: string, value: any, expected: { setValue: boolean, data: boolean }): IValueCase {
  return {
    title: title,
    apply: (survey: SurveyModel, how: HowSet): void => {
      if (how === "setValue") {
        survey.setValue("q", value);
      } else {
        survey.data = { q: value };
      }
    },
    expected: expected,
  };
}
const valueCases: Array<IValueCase> = [
  { title: "unset", apply: (survey: SurveyModel, how: HowSet): void => { if (how === "data") survey.data = {}; }, expected: { setValue: false, data: false } },
  setCase("\"\"", "", { setValue: false, data: true }),
  setCase("null", null, { setValue: false, data: true }),
  setCase("{}", {}, { setValue: false, data: true }),
  setCase("[]", [], { setValue: false, data: true }),
  setCase("0", 0, { setValue: true, data: true }),
  setCase("false", false, { setValue: true, data: true }),
  setCase("\"x\"", "x", { setValue: true, data: true }),
  {
    title: "set, then cleared by setValue(\"q\", \"\")",
    apply: (survey: SurveyModel, how: HowSet): void => {
      if (how === "setValue") {
        survey.setValue("q", "x");
      } else {
        survey.data = { q: "x" };
      }
      expect(survey.getQuestionByName("t").isVisible, "before the clear").toBe(true);
      survey.setValue("q", "");
    },
    expected: { setValue: false, data: false },
  },
];

describe("hasValue('name') expression function", () => {
  (["setValue", "data"] as Array<HowSet>).forEach(how => {
    valueCases.forEach(item => {
      test("q is " + item.title + ", through " + how, () => {
        const survey = new SurveyModel(surveyJson);
        item.apply(survey, how);
        const expected = item.expected[how];
        expect(survey.getQuestionByName("t").isVisible, "visibleIf").toBe(expected);
        expect(new ConditionRunner("hasValue('q')").runValues({}, survey.getFilteredProperties()), "ConditionRunner with the survey").toBe(expected);
        // a standalone runner reads the values it is given: the survey's data here
        expect(new ConditionRunner("hasValue('q')").runValues(survey.data), "standalone ConditionRunner").toBe(expected);
      });
    });
  });
  test("a standalone ConditionRunner reads the values passed to runValues", () => {
    const runner = new ConditionRunner("hasValue('q')");
    expect(runner.runValues({})).toBe(false);
    expect(runner.runValues({ q: "" })).toBe(true);
    expect(runner.runValues({ q: null })).toBe(true);
    expect(runner.runValues({ q: [] })).toBe(true);
    expect(runner.runValues({ other: 1 })).toBe(false);
    expect(new ConditionRunner("hasValue('pd[0].q1')").runValues({ pd: [{ q1: null }] })).toBe(true);
    expect(new ConditionRunner("hasValue('pd[1].q1')").runValues({ pd: [{ q1: null }] })).toBe(false);
    expect(new ConditionRunner("hasValue('m.r1.c1')").runValues({ m: { r1: { c1: "" } } })).toBe(true);
  });
  test("the name is matched ignoring letter case, as {Q} reads q", () => {
    const survey = new SurveyModel(surveyJson);
    survey.data = { q: "" };
    expect(new ConditionRunner("hasValue('Q')").runValues({}, survey.getFilteredProperties())).toBe(true);
    expect(new ConditionRunner("hasValue('Q')").runValues({ q: "" })).toBe(true);
  });
  test("a variable and a calculated value are not keys of the data unless the stored data holds the name", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q" }],
      calculatedValues: [
        { name: "calc", expression: "1", includeIntoResult: true },
        { name: "calc2", expression: "2" },
      ],
    });
    survey.setVariable("v", "");
    expect(survey.getVariable("calc")).toBe(1);
    const run = (name: string): boolean => new ConditionRunner("hasValue('" + name + "')").runValues({}, survey.getFilteredProperties());
    expect(run("v"), "variable").toBe(false);
    expect(run("calc"), "calculated value in the result").toBe(false);
    expect(run("calc2"), "calculated value").toBe(false);
    survey.setValue("v", "x");
    expect(run("v"), "the same name as a data key").toBe(true);
  });
  test("a dynamic panel item: hasValue('panel.q1') reads the current panel, hasValue('pd[0].q1') a panel by index", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic", name: "pd",
          templateElements: [
            { type: "text", name: "q1" },
            { type: "text", name: "q2", visibleIf: "hasValue('panel.q1')" },
          ],
        },
      ],
    });
    survey.data = { pd: [{ q1: "" }, {}] };
    const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
    const q2Visible = (index: number): boolean => pd.panels[index].getQuestionByName("q2").isVisible;
    expect(q2Visible(0), "panel 0 holds q1: \"\"").toBe(true);
    expect(q2Visible(1), "panel 1 holds no q1").toBe(false);
    pd.panels[1].getQuestionByName("q1").value = "x";
    expect(q2Visible(1), "panel 1 q1 set").toBe(true);
    pd.panels[1].getQuestionByName("q1").value = "";
    expect(q2Visible(1), "panel 1 q1 cleared: the key is deleted").toBe(false);
    const run = (name: string): boolean => new ConditionRunner("hasValue('" + name + "')").runValues({}, survey.getFilteredProperties());
    expect(run("pd[0].q1")).toBe(true);
    expect(run("pd[1].q1")).toBe(false);
    expect(run("pd[5].q1"), "no such panel").toBe(false);
    expect(run("pd[-2].q1"), "a negative index counts from the end").toBe(true);
    expect(run("pd"), "the panel's own key").toBe(true);
  });
  test("a matrix cell: hasValue('m.r1.c1') and, in a row, hasValue('row.c1')", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdropdown", name: "m", rows: ["r1", "r2"],
          columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "text", visibleIf: "hasValue('row.c1')" }],
        },
        { type: "matrixdynamic", name: "md", rowCount: 0, columns: [{ name: "c1", cellType: "text" }] },
      ],
    });
    // 0 rather than "": a matrix drops the empty cells of its loaded value when it builds its rows
    survey.data = { m: { r1: { c1: 0 } }, md: [{ c1: 0 }, {}] };
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("m");
    const rows = matrix.visibleRows;
    const run = (name: string): boolean => new ConditionRunner("hasValue('" + name + "')").runValues({}, survey.getFilteredProperties());
    expect(run("m.r1.c1")).toBe(true);
    expect(run("m.r2.c1")).toBe(false);
    expect(run("m.r1.c2")).toBe(false);
    expect(run("md[0].c1"), "a dynamic matrix row by index").toBe(true);
    expect(run("md[1].c1")).toBe(false);
    expect(rows[0].getQuestionByColumnName("c2").isVisible, "row r1 holds c1").toBe(true);
    expect(rows[1].getQuestionByColumnName("c2").isVisible, "row r2 holds no c1").toBe(false);
    rows[1].getQuestionByColumnName("c1").value = "x";
    expect(rows[1].getQuestionByColumnName("c2").isVisible, "row r2 c1 set").toBe(true);
    rows[1].getQuestionByColumnName("c1").value = "";
    expect(rows[1].getQuestionByColumnName("c2").isVisible, "row r2 c1 cleared: the key is deleted").toBe(false);
  });
  test("a custom function registered as hasValue after load wins over the built-in", () => {
    const builtIn: IFunctionRegistration = FunctionFactory.Instance.getRegistrations().filter(r => r.name === "hasValue")[0];
    expect(!!builtIn, "hasValue is a built-in").toBe(true);
    const survey = new SurveyModel(surveyJson);
    try {
      FunctionFactory.Instance.register("hasValue", (params: any[]): any => params[0] === "q");
      expect(new ConditionRunner("hasValue('q')").runValues({}, survey.getFilteredProperties()), "custom").toBe(true);
      expect(new ConditionRunner("hasValue('other')").runValues({ other: 1 }), "custom").toBe(false);
      // unregister removes the name, as it does for every built-in
      FunctionFactory.Instance.unregister("hasValue");
      expect(FunctionFactory.Instance.hasFunction("hasValue")).toBe(false);
    } finally {
      registerFunction(builtIn);
    }
    expect(new ConditionRunner("hasValue('q')").runValues({}, survey.getFilteredProperties()), "the built-in again").toBe(false);
    expect(new ConditionRunner("hasValue('other')").runValues({ other: 1 }), "the built-in again").toBe(true);
  });
  test("hasValue() with no argument or a non-text argument is false and does not throw", () => {
    const survey = new SurveyModel(surveyJson);
    survey.data = { q: "", "1": "" };
    const warnings: Array<string> = [];
    const prevWarn = ConsoleWarnings.warn;
    ConsoleWarnings.warn = (text: string) => { warnings.push(text); };
    try {
      ["hasValue()", "hasValue(1)", "hasValue(true)", "hasValue({q})", "hasValue('')"].forEach(expression => {
        expect(new ConditionRunner(expression).runValues({}, survey.getFilteredProperties()), expression + ", with the survey").toBe(false);
        expect(new ConditionRunner(expression).runValues({ q: "", "1": "" }), expression + ", standalone").toBe(false);
      });
    } finally {
      ConsoleWarnings.warn = prevWarn;
    }
    expect(warnings).toEqual([]);
  });
  test("the linter knows hasValue: expression/unknown-function reads the registered functions", () => {
    const findings = lintSurvey({ elements: [{ type: "text", name: "q" }, { type: "text", name: "t", visibleIf: "hasValue('q') and hasValu('q')" }] }).findings
      .filter(f => f.ruleId === "expression/unknown-function");
    expect(findings.map(f => f.messageData.functionName)).toEqual(["hasValu"]);
    expect(findings[0].suggestion).toBe("hasValue");
  });
  test("hasValue is described", () => {
    const reg = FunctionFactory.Instance.getRegistrations().filter(r => r.name === "hasValue")[0];
    expect(reg.returnType).toBe("boolean");
    expect(reg.resultDependsOn).toBe("survey");
    expect(reg.parameters.map(p => p.name + ":" + p.type)).toEqual(["name:string"]);
    expect(!!reg.description).toBe(true);
  });
});

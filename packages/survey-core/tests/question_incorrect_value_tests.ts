import { SurveyModel } from "../src/survey";
import { Helpers } from "../src/helpers";
import { IncorrectValueError } from "../src/error";
import { describe, expect, test, vi } from "vitest";

// The server flow: assign a payload from an untrusted client and check it. setData() assigns it and
// reports its issues, isValueCorrect() reports and never modifies the data; clearIncorrectValues()
// removes what they report. validate() is the respondent-facing validation and reports none of it; on
// a select question it still clears an unknown choice, as it always did.
function checkValue(question: any, value: any): { isCorrect: boolean, issueCount: number, isValid: boolean, errorTypes: Array<string>, dataAfterValidate: any, dataAfterClear: any } {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
  const survey = new SurveyModel({ elements: [Helpers.createCopy({ name: "q", ...question })] });
  const issueCount = survey.setData({ q: value }).length;
  const q = survey.getQuestionByName("q");
  const isCorrect = q.isValueCorrect();
  const isValid = survey.validate(false, false);
  const dataAfterValidate = Helpers.createCopy(survey.data);
  q.validate(true);
  const errorTypes = q.getAllErrors().map(error => error.getErrorType());
  survey.clearIncorrectValues(true);
  const res = { isCorrect, issueCount, isValid, errorTypes, dataAfterValidate, dataAfterClear: survey.data };
  warn.mockRestore();
  return res;
}
function createSurvey(question: any): SurveyModel {
  return new SurveyModel({ elements: [Helpers.createCopy({ name: "q", ...question })] });
}
const dynamicMatrix = { type: "matrixdynamic", columns: [{ name: "c", cellType: "text" }] };
const dynamicPanel = { type: "paneldynamic", templateElements: [{ type: "text", name: "t" }] };
const matrixJson = { type: "matrix", rows: ["r1"], columns: ["c1"] };
const matrixDropdownJson = { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] };
const multipleTextJson = { type: "multipletext", items: [{ name: "i1" }] };
// label, question, a value that mixes a known and an unknown key, the value after clearing, the location of the key
const unknownKeyCases: Array<[string, any, any, any, string]> = [
  ["matrixdynamic", dynamicMatrix, [{ c: "x", zzz: 1 }], [{ c: "x" }], "q[0].zzz"],
  ["paneldynamic", dynamicPanel, [{ t: "x", zzz: 1 }], [{ t: "x" }], "q[0].zzz"],
  ["matrix", matrixJson, { r1: "c1", zz: "c1" }, { r1: "c1" }, "q.zz"],
  ["matrixdropdown", matrixDropdownJson, { r1: { c: 1 }, zz: { c: 2 } }, { r1: { c: 1 } }, "q.zz"],
  ["multipletext", multipleTextJson, { i1: "a", zz: "x" }, { i1: "a" }, "q.zz"],
];

describe("Question.isValueCorrect", () => {
  test("An incorrect value is reported by isValueCorrect() and setData(), never by validate()", () => {
    const cases: Array<[string, any, any]> = [
      ["number text <- \"abc\"", { type: "text", inputType: "number" }, "abc"],
      ["number text <- object", { type: "text", inputType: "number" }, { x: 1 }],
      ["date text <- garbage", { type: "text", inputType: "date" }, "not-a-date"],
      ["boolean <- 'maybe'", { type: "boolean" }, "maybe"],
      ["radiogroup <- array", { type: "radiogroup", choices: ["a", "b"] }, ["a"]],
      ["radiogroup <- unknown", { type: "radiogroup", choices: ["a", "b"] }, "z"],
      ["dropdown <- object", { type: "dropdown", choices: ["a", "b"] }, { x: 1 }],
      ["checkbox <- unknown", { type: "checkbox", choices: ["a", "b"] }, ["a", "z"]],
      ["rating <- out of range", { type: "rating", rateMax: 5 }, 99],
      ["file <- number", { type: "file" }, 5],
      ["matrixdynamic <- string", dynamicMatrix, "oops"],
      ["matrixdynamic <- object", dynamicMatrix, { a: 1 }],
      ["matrixdynamic <- scalar rows", dynamicMatrix, ["x", 5]],
      ["paneldynamic <- string", dynamicPanel, "oops"],
      ["paneldynamic <- scalar panels", dynamicPanel, ["x", 5]],
      ["matrix <- string", { type: "matrix", rows: ["r1"], columns: ["c1"] }, "oops"],
      ["matrix <- unknown column", { type: "matrix", rows: ["r1"], columns: ["c1"] }, { r1: "zz" }],
      ["matrixdropdown <- scalar row", { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] }, { r1: "oops" }],
      ["multipletext <- string", { type: "multipletext", items: [{ name: "i1" }] }, "oops"],
    ];
    cases.forEach(([label, question, value]) => {
      const res = checkValue(question, value);
      expect(res.isCorrect, label + ": isValueCorrect").toBe(false);
      expect(res.issueCount > 0, label + ": setData").toBe(true);
      expect(res.isValid, label + ": validate() passes").toBe(true);
      expect(res.errorTypes, label + ": validate() sets no error").toEqual([]);
    });
  });
  test("validate() does not modify the data, except that a select question clears an unknown choice as before", () => {
    const untouched: Array<[string, any, any]> = [
      ["number text <- \"abc\"", { type: "text", inputType: "number" }, "abc"],
      ["boolean <- 'maybe'", { type: "boolean" }, "maybe"],
      ["rating <- out of range", { type: "rating", rateMax: 5 }, 99],
      ["matrixdynamic <- string", dynamicMatrix, "oops"],
      ["matrix <- unknown column", matrixJson, { r1: "zz" }],
      ["multipletext <- unknown item", multipleTextJson, { i1: "a", zz: "x" }],
    ];
    untouched.forEach(([label, question, value]) => {
      const res = checkValue(question, value);
      expect(res.dataAfterValidate, label + ": validate does not modify the data").toEqual({ q: value });
    });
    const cleared: Array<[string, any, any, any]> = [
      ["radiogroup <- unknown", { type: "radiogroup", choices: ["a", "b"] }, "z", {}],
      ["checkbox <- unknown", { type: "checkbox", choices: ["a", "b"] }, ["a", "z"], { q: ["a"] }],
    ];
    cleared.forEach(([label, question, value, expected]) => {
      const res = checkValue(question, value);
      expect(res.dataAfterValidate, label + ": validate(false) clears the unknown choice").toEqual(expected);
    });
  });
  test("A nested incorrect value is reported by the nested question", () => {
    const cases: Array<[string, any, any]> = [
      ["matrixdynamic bad cell", { type: "matrixdynamic", columns: [{ name: "c", cellType: "dropdown", choices: ["a"] }] }, [{ c: "z" }]],
      ["paneldynamic bad nested", { type: "paneldynamic", templateElements: [{ type: "dropdown", name: "t", choices: ["a"] }] }, [{ t: "z" }]],
      ["multipletext bad item", { type: "multipletext", items: [{ name: "i1", inputType: "number" }] }, { i1: "abc" }],
    ];
    cases.forEach(([label, question, value]) => {
      const res = checkValue(question, value);
      expect(res.issueCount, label + ": one issue").toBe(1);
      expect(res.isValid, label + ": validate() passes").toBe(true);
    });
  });
  test("A correct value is not reported", () => {
    const cases: Array<[string, any, any]> = [
      ["text", { type: "text" }, "abc"],
      ["number text", { type: "text", inputType: "number" }, 5],
      ["number text as string", { type: "text", inputType: "number" }, "5"],
      ["date text", { type: "text", inputType: "date" }, "2024-05-17"],
      ["time text", { type: "text", inputType: "time" }, "10:30"],
      ["comment", { type: "comment" }, "abc"],
      ["boolean", { type: "boolean" }, false],
      ["boolean valueTrue", { type: "boolean", valueTrue: "yes", valueFalse: "no" }, "no"],
      ["radiogroup", { type: "radiogroup", choices: ["a", "b"] }, "a"],
      ["radiogroup none", { type: "radiogroup", choices: ["a", "b"], showNoneItem: true }, "none"],
      ["checkbox", { type: "checkbox", choices: ["a", "b"], showNoneItem: true }, ["none"]],
      ["tagbox", { type: "tagbox", choices: [1, 2, 3] }, [1, 3]],
      ["ranking", { type: "ranking", choices: ["a", "b"] }, ["b", "a"]],
      ["rating", { type: "rating", rateMax: 5 }, 3],
      ["file", { type: "file" }, [{ name: "f.txt", type: "text/plain", content: "data:text/plain;base64,YQ==" }]],
      ["file as url string", { type: "file" }, "https://surveyjs.io/files/a.png"],
      ["matrixdynamic", dynamicMatrix, [{ c: "x" }, {}]],
      ["paneldynamic", dynamicPanel, [{ t: "x" }]],
      ["matrix", { type: "matrix", rows: ["r1", 2], columns: ["c1", 5] }, { r1: "c1", 2: 5 }],
      ["matrixdropdown", { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] }, { r1: { c: 1 } }],
      ["multipletext", { type: "multipletext", items: [{ name: "i1" }] }, { i1: "x" }],
    ];
    cases.forEach(([label, question, value]) => {
      const res = checkValue(question, value);
      expect(res.isCorrect, label + ": isValueCorrect").toBe(true);
      expect(res.issueCount, label + ": setData").toBe(0);
      expect(res.isValid, label + ": validate").toBe(true);
      expect(res.dataAfterClear, label + ": clearIncorrectValues keeps the value").toEqual({ q: value });
    });
  });
  test("clearIncorrectValues() removes an incorrect value and never throws", () => {
    const cases: Array<[string, any, any, any]> = [
      ["boolean <- 'maybe'", { type: "boolean" }, "maybe", {}],
      ["radiogroup <- array", { type: "radiogroup", choices: ["a", "b"] }, ["a"], {}],
      ["file <- number", { type: "file" }, 5, {}],
      ["matrixdynamic <- string", dynamicMatrix, "oops", {}],
      ["matrixdynamic <- scalar rows", dynamicMatrix, ["x", 5], {}],
      ["paneldynamic <- string", dynamicPanel, "oops", {}],
      ["paneldynamic <- scalar panels", dynamicPanel, ["x", 5], {}],
      ["matrix <- string", { type: "matrix", rows: ["r1"], columns: ["c1"] }, "oops", {}],
      ["matrixdropdown <- scalar row", { type: "matrixdropdown", rows: ["r1", "r2"], columns: [{ name: "c", cellType: "text" }] },
        { r1: "oops", r2: { c: 1 } }, { q: { r2: { c: 1 } } }],
      ["multipletext <- string", { type: "multipletext", items: [{ name: "i1" }] }, "oops", {}],
      ["multipletext <- unknown item", { type: "multipletext", items: [{ name: "i1" }] }, { i1: "a", zz: "x" }, { q: { i1: "a" } }],
      ["checkbox <- unknown", { type: "checkbox", choices: ["a", "b"] }, ["a", "z"], { q: ["a"] }],
    ];
    cases.forEach(([label, question, value, expected]) => {
      const res = checkValue(question, value);
      expect(res.dataAfterClear, label).toEqual(expected);
    });
  });
  test("keepIncorrectValues keeps an unknown choice through validate() and clearIncorrectValues(); isValueCorrect() still reports it", () => {
    const survey = new SurveyModel({ elements: [{ type: "dropdown", name: "q", choices: ["a", "b"] }] });
    survey.keepIncorrectValues = true;
    survey.data = { q: "z" };
    expect(survey.getQuestionByName("q").isValueCorrect(), "isValueCorrect ignores keepIncorrectValues").toBe(false);
    expect(survey.validate(false, false), "validate passes").toBe(true);
    expect(survey.data, "validate keeps the value").toEqual({ q: "z" });
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues keeps the value").toEqual({ q: "z" });
    const perQuestion = new SurveyModel({ elements: [{ type: "dropdown", name: "q", choices: ["a", "b"] }] });
    (<any>perQuestion.getQuestionByName("q")).keepIncorrectValues = true;
    perQuestion.data = { q: "z" };
    expect(perQuestion.validate(false, false), "the question-level flag: validate passes").toBe(true);
    perQuestion.clearIncorrectValues(true);
    expect(perQuestion.data, "the question-level flag: the value is kept").toEqual({ q: "z" });
  });
  test("Questions that share a valueName know the keys of each other", () => {
    const cases: Array<[string, Array<any>, any, any]> = [
      ["multipletext",
        [{ type: "multipletext", name: "q1", valueName: "shared", items: [{ name: "a" }] }, { type: "multipletext", name: "q2", valueName: "shared", items: [{ name: "b" }] }],
        { a: "one", b: "two" }, { a: "one", b: "two", zz: "x" }],
      ["matrix",
        [{ type: "matrix", name: "q1", valueName: "shared", rows: ["r1"], columns: ["a", "b"] }, { type: "matrix", name: "q2", valueName: "shared", rows: ["r2"], columns: ["b", "c"] }],
        { r1: "a", r2: "c" }, { r1: "a", r2: "c", zz: "a" }],
      ["matrixdropdown",
        [{ type: "matrixdropdown", name: "q1", valueName: "shared", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] },
          { type: "matrixdropdown", name: "q2", valueName: "shared", rows: ["r2"], columns: [{ name: "c", cellType: "text" }] }],
        { r1: { c: 1 }, r2: { c: 2 } }, { r1: { c: 1 }, r2: { c: 2 }, zz: { c: 3 } }],
    ];
    cases.forEach(([label, elements, value, valueWithUnknownKey]) => {
      const survey = new SurveyModel({ elements: elements });
      // A key owned by the sibling question is never an unknown key.
      expect(survey.setData({ shared: value }), label + ": the shared value is correct").toEqual([]);
      survey.clearIncorrectValues(true);
      expect(survey.data, label + ": clearIncorrectValues keeps the shared value").toEqual({ shared: value });
      expect(survey.setData({ shared: valueWithUnknownKey }).length, label + ": setData() reports it once").toBe(1);
      expect(survey.validate(false, false), label + ": validate() does not report a key that nobody owns").toBe(true);
      survey.clearIncorrectValues(true);
      expect(survey.data, label + ": clearIncorrectValues removes the key that nobody owns").toEqual({ shared: value });
    });
  });
  test("A matrix detail panel question with valueName is a known key", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "q", columns: [{ name: "c", cellType: "text" }],
        detailPanelMode: "underRow", detailElements: [{ type: "text", name: "detail", valueName: "stored" }, { type: "text", name: "detail2" }]
      }]
    });
    const value = [{ c: "x", stored: "y", detail2: "z" }];
    expect(survey.setData({ q: value }), "setData").toEqual([]);
    const q = survey.getQuestionByName("q");
    expect(q.isValueCorrect(), "isValueCorrect").toBe(true);
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues keeps the detail values").toEqual({ q: value });
    // The name of a detail question that stores its value under a valueName is not a known key.
    const issues = survey.setData({ q: [{ c: "x", detail: "y" }] });
    expect(q.isValueCorrect(), "the question name is not the key when valueName is set").toBe(false);
    expect(q.isValueCorrect({ unknownProperties: false }), "with the check off").toBe(true);
    expect(issues.length, "one issue").toBe(1);
    expect(issues[0].type, "the issue type").toBe("unknownProperty");
    expect(issues[0].path, "the issue location").toBe("q[0].detail");
    // The invariant: what setData() reports, clearIncorrectValues() removes.
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues removes what was reported").toEqual({ q: [{ c: "x" }] });
    expect(survey.setData(survey.data), "no issue after clearing").toEqual([]);
  });
  test("An unknown key is reported by isValueCorrect() and setData(), not by validate(), and clearIncorrectValues() removes it", () => {
    unknownKeyCases.forEach(([label, question, value, cleared, path]) => {
      const res = checkValue(question, value);
      expect(res.isCorrect, label + ": isValueCorrect").toBe(false);
      expect(res.issueCount, label + ": one issue").toBe(1);
      expect(res.isValid, label + ": validate").toBe(true);
      expect(res.errorTypes, label + ": no error").toEqual([]);
      expect(res.dataAfterValidate, label + ": validate does not modify the data").toEqual({ q: value });
      expect(res.dataAfterClear, label + ": clearIncorrectValues removes the unknown key").toEqual({ q: cleared });
      const survey = createSurvey(question);
      const issues = survey.setData({ q: value });
      expect(issues[0].type, label + ": the issue type").toBe("unknownProperty");
      expect(issues[0].path, label + ": the issue location").toBe(path);
      expect(survey.data, label + ": setData() keeps the data as given").toEqual({ q: value });
      expect(survey.getQuestionByName("q").isValueCorrect({ unknownProperties: false }), label + ": with the check off").toBe(true);
    });
  });
  test("The checks reach the nested questions", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "q",
        templateElements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }]
      }]
    });
    const issues = survey.setData({ q: [{ m: [{ c: "x", zzz: 1 }] }] });
    expect(survey.validate(false, false), "not reported by validate()").toBe(true);
    expect(issues.length, "reported in a nested matrix").toBe(1);
    expect(issues[0].path, "the issue location").toBe("q[0].m[0].zzz");
    const matrix = survey.getQuestionByName("q").panels[0].getQuestionByName("m");
    expect(issues[0].question, "the issue question").toBe(matrix);
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues removes the nested key").toEqual({ q: [{ m: [{ c: "x" }] }] });
  });
  test("IncorrectValueError is available to a consumer that turns an issue into a question error", () => {
    const survey = createSurvey(dynamicMatrix);
    const issue = survey.setData({ q: [{ c: "x", zzz: 1 }] })[0];
    const q = survey.getQuestionByName("q");
    const withKeys = new IncorrectValueError(null, q, issue.type, [issue.path]);
    expect(withKeys.getErrorType()).toBe("incorrectvalue");
    expect(withKeys.check).toBe("unknownProperty");
    expect(withKeys.getText()).toBe("The value contains unknown keys: q[0].zzz.");
    expect(new IncorrectValueError(null, q).getText(), "the default text").toBe("The value is incorrect.");
    expect(q.errors.length, "the library itself sets no such error").toBe(0);
  });
  test("choiceValues: false does not report an unknown choice", () => {
    const survey = createSurvey({ type: "dropdown", choices: ["a", "b"] });
    expect(survey.setData({ q: "z" }, { reportInvalidChoiceValues: false }), "not reported by setData()").toEqual([]);
    expect(survey.getQuestionByName("q").isValueCorrect(), "reported by default").toBe(false);
    expect(survey.getQuestionByName("q").isValueCorrect({ choiceValues: false }), "isValueCorrect").toBe(true);
  });
  test("A text or comment question keeps a value of another shape, a question derived from it may store it", () => {
    const cases: Array<[string, any, any]> = [
      ["text <- object", { type: "text" }, { x: 1 }],
      ["comment <- object", { type: "comment" }, { type: "text", name: "q1" }],
      ["comment <- array", { type: "comment" }, [1, 2]],
    ];
    cases.forEach(([label, question, value]) => {
      const res = checkValue(question, value);
      expect(res.isCorrect, label + ": isValueCorrect").toBe(true);
      expect(res.issueCount, label + ": setData").toBe(0);
      expect(res.dataAfterClear, label + ": clearIncorrectValues keeps the value").toEqual({ q: value });
    });
  });
  test("A value that is not survey data, an instance of a class, is not reported", () => {
    class CustomValue {
      constructor(public id: number) { }
    }
    const survey = new SurveyModel({ elements: [{ type: "text", name: "q" }] });
    const q = survey.getQuestionByName("q");
    q.value = new CustomValue(1);
    // setData() cannot deliver a class instance: its JSON round trip turns it into a plain object.
    expect(q.isValueCorrect(), "isValueCorrect").toBe(true);
    survey.clearIncorrectValues(true);
    expect(q.value instanceof CustomValue, "clearIncorrectValues keeps the value").toBe(true);
  });
  test("The incorrect value warning has a space before the value", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
    const survey = new SurveyModel({ elements: [dynamicMatrix].map(q => ({ name: "q", ...q })) });
    survey.getQuestionByName("q").value = "oops";
    expect(warn.mock.calls[0][0]).toBe("An attempt to assign an incorrect value \"oops\" to the following question: \"q\"");
    warn.mockRestore();
  });
});

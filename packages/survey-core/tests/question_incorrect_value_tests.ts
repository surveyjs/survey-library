import { SurveyModel } from "../src/survey";
import { Helpers } from "../src/helpers";
import { describe, expect, test, vi } from "vitest";

// The server flow: assign a payload from an untrusted client and validate it.
// isValueCorrect()/validate() must not modify the data, clearIncorrectValues() removes what they report.
function checkValue(question: any, value: any): { isCorrect: boolean, isValid: boolean, errorTypes: Array<string>, dataAfterValidate: any, dataAfterClear: any } {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
  const survey = new SurveyModel({ elements: [Helpers.createCopy({ name: "q", ...question })] });
  survey.data = { q: value };
  const q = survey.getQuestionByName("q");
  const isCorrect = q.isValueCorrect();
  const isValid = survey.validate(false, false);
  const dataAfterValidate = Helpers.createCopy(survey.data);
  q.validate(true);
  const errorTypes = q.getAllErrors().map(error => error.getErrorType());
  survey.clearIncorrectValues(true);
  const res = { isCorrect, isValid, errorTypes, dataAfterValidate, dataAfterClear: survey.data };
  warn.mockRestore();
  return res;
}
function createSurvey(question: any, value: any): SurveyModel {
  const survey = new SurveyModel({ elements: [Helpers.createCopy({ name: "q", ...question })] });
  survey.data = { q: JSON.parse(JSON.stringify(value)) };
  return survey;
}
function getIncorrectValueErrors(question: any): Array<any> {
  return question.getAllErrors().filter((error: any) => error.getErrorType() === "incorrectvalue");
}
const dynamicMatrix = { type: "matrixdynamic", columns: [{ name: "c", cellType: "text" }] };
const dynamicPanel = { type: "paneldynamic", templateElements: [{ type: "text", name: "t" }] };
const matrixJson = { type: "matrix", rows: ["r1"], columns: ["c1"] };
const matrixDropdownJson = { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] };
const multipleTextJson = { type: "multipletext", items: [{ name: "i1" }] };
// label, question, a value that mixes a known and an unknown key, the value after clearing, the reported keys
const unknownKeyCases: Array<[string, any, any, any, Array<string>]> = [
  ["matrixdynamic", dynamicMatrix, [{ c: "x", zzz: 1 }], [{ c: "x" }], ["0.zzz"]],
  ["paneldynamic", dynamicPanel, [{ t: "x", zzz: 1 }], [{ t: "x" }], ["0.zzz"]],
  ["matrix", matrixJson, { r1: "c1", zz: "c1" }, { r1: "c1" }, ["zz"]],
  ["matrixdropdown", matrixDropdownJson, { r1: { c: 1 }, zz: { c: 2 } }, { r1: { c: 1 } }, ["zz"]],
  ["multipletext", multipleTextJson, { i1: "a", zz: "x" }, { i1: "a" }, ["zz"]],
];

describe("Question.isValueCorrect", () => {
  test("An incorrect value is reported by validate() and the data is not modified", () => {
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
      expect(res.isValid, label + ": validate").toBe(false);
      expect(res.dataAfterValidate, label + ": validate does not modify data").toEqual({ q: value });
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
      expect(res.isValid, label + ": validate").toBe(false);
      expect(res.dataAfterValidate, label + ": validate does not modify data").toEqual({ q: value });
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
      expect(res.isValid, label + ": validate").toBe(true);
      expect(res.dataAfterClear, label + ": clearIncorrectValues keeps the value").toEqual({ q: value });
    });
  });
  test("validate() adds the 'incorrectvalue' error", () => {
    const res = checkValue(dynamicMatrix, "oops");
    expect(res.errorTypes).toEqual(["incorrectvalue"]);
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
  test("keepIncorrectValues turns off the choices check", () => {
    const survey = new SurveyModel({ elements: [{ type: "dropdown", name: "q", choices: ["a", "b"] }] });
    survey.keepIncorrectValues = true;
    survey.data = { q: "z" };
    expect(survey.getQuestionByName("q").isValueCorrect()).toBe(true);
    expect(survey.validate(false, false)).toBe(true);
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
      survey.data = { shared: value };
      // A key owned by the sibling question is never an unknown key.
      expect(survey.validate(false, false), label + ": the shared value is correct").toBe(true);
      expect(survey.validate({ fireCallback: false, valueChecks: { unknownKeys: true } }), label + ": the shared value is correct with unknownKeys").toBe(true);
      survey.clearIncorrectValues(true);
      expect(survey.data, label + ": clearIncorrectValues keeps the shared value").toEqual({ shared: value });
      survey.data = { shared: JSON.parse(JSON.stringify(valueWithUnknownKey)) };
      expect(survey.validate(false, false), label + ": a key that nobody owns is not reported by default").toBe(true);
      expect(survey.validate({ fireCallback: false, valueChecks: { unknownKeys: true } }), label + ": a key that nobody owns is reported with unknownKeys").toBe(false);
      survey.clearIncorrectValues(true);
      expect(survey.data, label + ": clearIncorrectValues removes the key that nobody owns").toEqual({ shared: value });
      // The default checks do not stop clearing either.
      survey.data = { shared: JSON.parse(JSON.stringify(valueWithUnknownKey)) };
      expect(survey.validate(false, false), label + ": not reported by default, again").toBe(true);
      survey.clearIncorrectValues(true);
      expect(survey.data, label + ": clearIncorrectValues removes it with the default checks").toEqual({ shared: value });
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
    survey.data = { q: value };
    const q = survey.getQuestionByName("q");
    expect(q.isValueCorrect(), "isValueCorrect").toBe(true);
    expect(survey.validate(false, false), "validate").toBe(true);
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues keeps the detail values").toEqual({ q: value });
    // The name of a detail question that stores its value under a valueName is not a known key.
    survey.data = { q: [{ c: "x", detail: "y" }] };
    expect(q.isValueCorrect(), "not reported by default").toBe(true);
    expect(q.isValueCorrect({ unknownKeys: true }), "the question name is not the key when valueName is set").toBe(false);
    expect(survey.validate({ fireCallback: true, valueChecks: { unknownKeys: true } }), "validate").toBe(false);
    expect(getIncorrectValueErrors(q)[0].keys, "the reported keys").toEqual(["0.detail"]);
    // The invariant: what validate() reports, clearIncorrectValues() removes.
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues removes what was reported").toEqual({ q: [{ c: "x" }] });
    expect(survey.validate({ fireCallback: false, valueChecks: { unknownKeys: true } }), "valid after clearing").toBe(true);
  });
  test("By default an unknown key is not reported and clearIncorrectValues() removes it", () => {
    unknownKeyCases.forEach(([label, question, value, cleared]) => {
      const res = checkValue(question, value);
      expect(res.isCorrect, label + ": isValueCorrect").toBe(true);
      expect(res.isValid, label + ": validate").toBe(true);
      expect(res.errorTypes, label + ": no error").toEqual([]);
      expect(res.dataAfterValidate, label + ": validate does not modify the data").toEqual({ q: value });
      expect(res.dataAfterClear, label + ": clearIncorrectValues removes the unknown key").toEqual({ q: cleared });
    });
  });
  test("An unknown key is reported when the unknownKeys check is on", () => {
    unknownKeyCases.forEach(([label, question, value, cleared, keys]) => {
      // Route 1: the options form of validate().
      let survey = createSurvey(question, value);
      expect(survey.validate({ fireCallback: false, valueChecks: { unknownKeys: true } }), label + ": validate(options)").toBe(false);
      expect(survey.data, label + ": validate(options) does not modify the data").toEqual({ q: value });
      // Route 2: the survey-level default with the positional form.
      survey = createSurvey(question, value);
      survey.validationValueChecks = { unknownKeys: true };
      expect(survey.validate(false, false), label + ": validationValueChecks").toBe(false);
      expect(survey.data, label + ": validate does not modify the data").toEqual({ q: value });
      // Route 3: question.isValueCorrect().
      survey = createSurvey(question, value);
      const q = survey.getQuestionByName("q");
      expect(q.isValueCorrect(), label + ": isValueCorrect by default").toBe(true);
      expect(q.isValueCorrect({ unknownKeys: true }), label + ": isValueCorrect({ unknownKeys: true })").toBe(false);
      // The error names the check and the keys.
      expect(survey.validate({ valueChecks: { unknownKeys: true } }), label + ": validate with errors").toBe(false);
      const errors = getIncorrectValueErrors(q);
      expect(errors.length, label + ": one incorrectvalue error").toBe(1);
      expect(errors[0].check, label + ": error.check").toBe("unknownKeys");
      expect(errors[0].keys, label + ": error.keys").toEqual(keys);
      expect(errors[0].getText(), label + ": error text").toBe("The value contains unknown keys: " + keys.join(", ") + ".");
      // The invariant: what validate() reports, clearIncorrectValues() removes.
      survey.clearIncorrectValues(true);
      expect(survey.data, label + ": clearIncorrectValues removes the reported keys").toEqual({ q: cleared });
      expect(survey.validate({ fireCallback: false, valueChecks: { unknownKeys: true } }), label + ": valid after clearing").toBe(true);
    });
  });
  test("The checks reach the nested questions", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "paneldynamic", name: "q",
        templateElements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "c", cellType: "text" }] }]
      }]
    });
    survey.data = { q: [{ m: [{ c: "x", zzz: 1 }] }] };
    expect(survey.validate(false, false), "not reported by default").toBe(true);
    expect(survey.validate({ fireCallback: true, valueChecks: { unknownKeys: true } }), "reported in a nested matrix").toBe(false);
    const matrix = survey.getQuestionByName("q").panels[0].getQuestionByName("m");
    expect(getIncorrectValueErrors(matrix)[0].keys, "the reported keys").toEqual(["0.zzz"]);
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues removes the nested key").toEqual({ q: [{ m: [{ c: "x" }] }] });
  });
  test("error.check names the failed check", () => {
    const cases: Array<[string, any, any, string]> = [
      ["number text <- abc", { type: "text", inputType: "number" }, "abc", "valueType"],
      ["boolean <- 'maybe'", { type: "boolean" }, "maybe", "valueType"],
      ["matrixdynamic <- string", dynamicMatrix, "oops", "valueType"],
      ["rating <- out of range", { type: "rating", rateMax: 5 }, 99, "choices"],
      ["matrix <- unknown column", matrixJson, { r1: "zz" }, "choices"],
    ];
    cases.forEach(([label, question, value, check]) => {
      const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
      const survey = createSurvey(question, value);
      const q = survey.getQuestionByName("q");
      expect(survey.validate(true, false), label + ": validate").toBe(false);
      const errors = getIncorrectValueErrors(q);
      expect(errors.length, label + ": one incorrectvalue error").toBe(1);
      expect(errors[0].check, label + ": error.check").toBe(check);
      expect(errors[0].keys, label + ": error.keys").toEqual([]);
      expect(errors[0].getText(), label + ": error text").toBe("The value is incorrect.");
      warn.mockRestore();
    });
  });
  test("valueChecks: { choices: false } does not report an unknown choice", () => {
    const survey = createSurvey({ type: "dropdown", choices: ["a", "b"] }, "z");
    expect(survey.validate({ fireCallback: false }), "reported by default").toBe(false);
    expect(survey.validate({ fireCallback: false, valueChecks: { choices: false } }), "not reported").toBe(true);
    expect(survey.getQuestionByName("q").isValueCorrect({ choices: false }), "isValueCorrect").toBe(true);
  });
  test("keepIncorrectValues suppresses the choices and unknownKeys checks but not valueType", () => {
    let survey = createSurvey({ type: "dropdown", choices: ["a", "b"] }, "z");
    survey.keepIncorrectValues = true;
    expect(survey.validate({ fireCallback: false, valueChecks: { choices: true } }), "choices").toBe(true);
    survey = createSurvey(matrixJson, { r1: "c1", zz: "c1" });
    survey.keepIncorrectValues = true;
    expect(survey.validate({ fireCallback: false, valueChecks: { unknownKeys: true } }), "unknownKeys").toBe(true);
    const warn = vi.spyOn(console, "warn").mockImplementation(() => { });
    survey = createSurvey({ type: "text", inputType: "number" }, "abc");
    survey.keepIncorrectValues = true;
    expect(survey.validate({ fireCallback: false }), "valueType").toBe(false);
    warn.mockRestore();
  });
  test("The checks of a call are merged over survey.validationValueChecks", () => {
    const survey = createSurvey(multipleTextJson, { i1: "a", zz: "x" });
    survey.validationValueChecks = { unknownKeys: true };
    expect(survey.validate(false, false), "the survey default is used").toBe(false);
    expect(survey.validate({ fireCallback: false, valueChecks: { unknownKeys: false } }), "the call turns it off").toBe(true);
    const q = survey.getQuestionByName("q");
    expect(q.isValueCorrect({ unknownKeys: false }), "isValueCorrect turns it off").toBe(true);
    // A per-call unknownKeys does not switch the other checks off.
    const other = createSurvey({ type: "dropdown", choices: ["a", "b"] }, "z");
    expect(other.validate({ fireCallback: false, valueChecks: { unknownKeys: true } }), "choices stays on").toBe(false);
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
      expect(res.isValid, label + ": validate").toBe(true);
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
    expect(q.isValueCorrect(), "isValueCorrect").toBe(true);
    expect(survey.validate(false, false), "validate").toBe(true);
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

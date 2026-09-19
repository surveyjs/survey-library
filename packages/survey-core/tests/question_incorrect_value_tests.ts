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
const dynamicMatrix = { type: "matrixdynamic", columns: [{ name: "c", cellType: "text" }] };
const dynamicPanel = { type: "paneldynamic", templateElements: [{ type: "text", name: "t" }] };

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
      ["matrixdynamic <- unknown column", dynamicMatrix, [{ c: "x", zzz: 1 }]],
      ["paneldynamic <- string", dynamicPanel, "oops"],
      ["paneldynamic <- scalar panels", dynamicPanel, ["x", 5]],
      ["paneldynamic <- unknown question", dynamicPanel, [{ t: "x", zzz: 1 }]],
      ["matrix <- string", { type: "matrix", rows: ["r1"], columns: ["c1"] }, "oops"],
      ["matrix <- unknown row", { type: "matrix", rows: ["r1"], columns: ["c1"] }, { zz: "c1" }],
      ["matrix <- unknown column", { type: "matrix", rows: ["r1"], columns: ["c1"] }, { r1: "zz" }],
      ["matrixdropdown <- unknown row", { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] }, { zz: { c: 1 } }],
      ["matrixdropdown <- scalar row", { type: "matrixdropdown", rows: ["r1"], columns: [{ name: "c", cellType: "text" }] }, { r1: "oops" }],
      ["multipletext <- string", { type: "multipletext", items: [{ name: "i1" }] }, "oops"],
      ["multipletext <- unknown item", { type: "multipletext", items: [{ name: "i1" }] }, { zz: "x" }],
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
      expect(survey.validate(false, false), label + ": the shared value is correct").toBe(true);
      survey.clearIncorrectValues(true);
      expect(survey.data, label + ": clearIncorrectValues keeps the shared value").toEqual({ shared: value });
      survey.data = { shared: valueWithUnknownKey };
      expect(survey.validate(false, false), label + ": a key that nobody owns is incorrect").toBe(false);
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
    survey.data = { q: value };
    const q = survey.getQuestionByName("q");
    expect(q.isValueCorrect(), "isValueCorrect").toBe(true);
    expect(survey.validate(false, false), "validate").toBe(true);
    survey.clearIncorrectValues(true);
    expect(survey.data, "clearIncorrectValues keeps the detail values").toEqual({ q: value });
    survey.data = { q: [{ c: "x", detail: "y" }] };
    expect(q.isValueCorrect(), "the question name is not the key when valueName is set").toBe(false);
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

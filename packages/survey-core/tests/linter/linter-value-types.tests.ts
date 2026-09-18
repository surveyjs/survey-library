import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { getValueTypeInfo } from "../../src/linter/value-types";
// The question types of the table register themselves on import.
import "../../src/question_text";
import "../../src/question_comment";
import "../../src/question_boolean";
import "../../src/question_radiogroup";
import "../../src/question_dropdown";
import "../../src/question_checkbox";
import "../../src/question_tagbox";
import "../../src/question_ranking";
import "../../src/question_file";
import "../../src/question_signaturepad";
import "../../src/question_imagepicker";
import "../../src/question_rating";
import "../../src/question_slider";
import "../../src/question_matrix";
import "../../src/question_matrixdropdown";
import "../../src/question_matrixdynamic";
import "../../src/question_paneldynamic";
import "../../src/question_multipletext";

describe("the linter's value types agree with the model", () => {
  test("Question.getValueType() agrees with the linter's JSON-side table", () => {
    const elements: Array<any> = [
      { type: "text", name: "t1" },
      { type: "text", name: "t2", inputType: "number" },
      { type: "text", name: "t3", inputType: "date" },
      { type: "text", name: "t4", inputType: "week" },
      { type: "comment", name: "c1" },
      { type: "boolean", name: "b1" },
      { type: "radiogroup", name: "r1", choices: ["a", "b"] },
      { type: "dropdown", name: "d1", choices: [1, 2] },
      { type: "checkbox", name: "ch1", choices: ["a"] },
      { type: "tagbox", name: "tg1", choices: ["a"] },
      { type: "ranking", name: "rk1", choices: ["a"] },
      { type: "file", name: "f1" },
      { type: "signaturepad", name: "s1" },
      { type: "imagepicker", name: "ip1", choices: [{ value: "a", imageLink: "a.png" }] },
      { type: "imagepicker", name: "ip2", multiSelect: true, choices: [{ value: "a", imageLink: "a.png" }] },
      { type: "rating", name: "ra1" },
      { type: "rating", name: "ra2", rateValues: ["low", "high"] },
      { type: "slider", name: "sl1" },
      { type: "slider", name: "sl2", sliderType: "range" },
      { type: "matrix", name: "m1", rows: ["r"], columns: ["c"] },
      { type: "matrixdropdown", name: "m2", rows: ["r"], columns: [{ name: "c" }] },
      { type: "matrixdynamic", name: "m3", columns: [{ name: "c" }] },
      { type: "paneldynamic", name: "p1", templateElements: [{ type: "text", name: "q" }] },
      { type: "multipletext", name: "mt1", items: [{ name: "i1" }] },
    ];
    const survey = new SurveyModel({ elements: elements });
    elements.forEach(json => {
      const own = survey.getQuestionByName(json.name).getValueType();
      const info = getValueTypeInfo(json.type, json);
      // The linter has no opinion on a shape it calls "none" or "unknown", nor on a scalar it
      // cannot pin to one type; everywhere else the two tables must say the same thing.
      const expected = info.shape === "scalar" ? (info.scalarType === "any" ? undefined : info.scalarType) :
        (info.shape === "array" || info.shape === "object" ? info.shape : undefined);
      if (expected !== undefined) {
        expect(own, json.name + " agrees with the linter").toBe(expected);
      }
    });
  });
});

import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { Serializer } from "../../src/jsonobject";

describe("isFilterable and allowFiltering", () => {
  test("the types that cannot be filtered say so", () => {
    const survey = new SurveyModel({ elements: [
      { type: "text", name: "q1" }, { type: "expression", name: "q2", expression: "1" },
      { type: "checkbox", name: "q3", choices: [1, 2] }, { type: "file", name: "q4" },
      { type: "html", name: "q5" }, { type: "multipletext", name: "q6", items: [{ name: "i1" }] },
      { type: "paneldynamic", name: "q7" }] });
    const isFilterable = (name: string): boolean => (<any>survey.getQuestionByName(name)).isFilterable;
    expect(isFilterable("q1"), "#1: text").toBe(true);
    expect(isFilterable("q2"), "#2: an expression stores a real value").toBe(true);
    expect(isFilterable("q3"), "#3: an array of choices is filtered with anyof").toBe(true);
    expect(isFilterable("q4"), "#4: only the file UI can produce it").toBe(false);
    expect(isFilterable("q5"), "#5: it stores nothing").toBe(false);
    expect(isFilterable("q6"), "#6: a record of its own, its items are the fields").toBe(false);
    expect(isFilterable("q7"), "#7: a table of its own").toBe(false);
  });
  test("allowFiltering defaults to true, serializes when set and is per column", () => {
    const survey = new SurveyModel({ elements: [{ type: "matrixdynamic", name: "m", columns: [
      { name: "c1" }, { name: "c2", allowFiltering: false }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.columns[0].allowFiltering, "#1").toBe(true);
    expect(matrix.columns[1].allowFiltering, "#2").toBe(false);
    expect(matrix.toJSON().columns[0].allowFiltering, "#3: the default is not emitted").toBe(undefined);
    expect(matrix.toJSON().columns[1].allowFiltering, "#4").toBe(false);
  });
  test("the property grid shows allowFiltering only where it applies", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "c1" }] },
      { type: "file", name: "f" }, { type: "text", name: "t" }] });
    const prop = Serializer.findProperty("question", "allowFiltering");
    expect(prop.isVisible("", survey.getQuestionByName("t")), "#1").toBe(true);
    expect(prop.isVisible("", survey.getQuestionByName("f")), "#2").toBe(false);
    const colProp = Serializer.findProperty("matrixdropdowncolumn", "allowFiltering");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(colProp.isVisible("", matrix.columns[0]), "#3").toBe(true);
  });
});

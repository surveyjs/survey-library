import { ProcessValue } from "../src/conditions/conditionProcessValue";
import { Serializer } from "../src/jsonobject";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { SurveyModel } from "../src/survey";

import { describe, test, expect } from "vitest";
describe("Survey_QuestionMultipleText", () => {
  test("Check rows building (errors top)", () => {
    const question = new QuestionMultipleTextModel("multipletext");
    question.addItem("item1", "Item1");
    question.addItem("item2", "Item2");
    question.addItem("item3", "Item3");
    let rows = question.getRows();
    expect(rows.length).toBe(6);

    expect(rows[0].cells.length).toBe(1);
    expect(rows[0].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[0].cells[0].item).toBe(question.items[0]);

    expect(rows[1].cells.length).toBe(1);
    expect(rows[1].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[1].cells[0].item).toBe(question.items[0]);

    expect(rows[2].cells.length).toBe(1);
    expect(rows[2].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[2].cells[0].item).toBe(question.items[1]);

    expect(rows[3].cells.length).toBe(1);
    expect(rows[3].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[3].cells[0].item).toBe(question.items[1]);

    expect(rows[4].cells.length).toBe(1);
    expect(rows[4].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[4].cells[0].item).toBe(question.items[2]);

    expect(rows[5].cells.length).toBe(1);
    expect(rows[5].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[5].cells[0].item).toBe(question.items[2]);

    question.colCount = 2;
    rows = question.getRows();

    expect(rows.length).toBe(4);

    expect(rows[0].cells.length).toBe(2);
    expect(rows[0].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[0].cells[0].item).toBe(question.items[0]);
    expect(rows[0].cells[1].isErrorsCell).toBeTruthy();
    expect(rows[0].cells[1].item).toBe(question.items[1]);

    expect(rows[1].cells.length).toBe(2);
    expect(rows[1].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[1].cells[0].item).toBe(question.items[0]);
    expect(rows[1].cells[1].isErrorsCell).toBeFalsy();
    expect(rows[1].cells[1].item).toBe(question.items[1]);

    expect(rows[2].cells.length).toBe(1);
    expect(rows[2].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[2].cells[0].item).toBe(question.items[2]);

    expect(rows[3].cells.length).toBe(1);
    expect(rows[3].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[3].cells[0].item).toBe(question.items[2]);
  });

  test("Check rows building (errors bottom)", () => {
    const question = new QuestionMultipleTextModel("multipletext");
    question.addItem("item1", "Item1");
    question.addItem("item2", "Item2");
    question.addItem("item3", "Item3");
    question.itemErrorLocation = "bottom";
    let rows = question.getRows();
    expect(rows.length).toBe(6);

    expect(rows[0].cells.length).toBe(1);
    expect(rows[0].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[0].cells[0].item).toBe(question.items[0]);

    expect(rows[1].cells.length).toBe(1);
    expect(rows[1].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[1].cells[0].item).toBe(question.items[0]);

    expect(rows[2].cells.length).toBe(1);
    expect(rows[2].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[2].cells[0].item).toBe(question.items[1]);

    expect(rows[3].cells.length).toBe(1);
    expect(rows[3].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[3].cells[0].item).toBe(question.items[1]);

    expect(rows[4].cells.length).toBe(1);
    expect(rows[4].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[4].cells[0].item).toBe(question.items[2]);

    expect(rows[5].cells.length).toBe(1);
    expect(rows[5].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[5].cells[0].item).toBe(question.items[2]);

    question.colCount = 2;
    rows = question.getRows();

    expect(rows.length).toBe(4);

    expect(rows[0].cells.length).toBe(2);
    expect(rows[0].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[0].cells[0].item).toBe(question.items[0]);
    expect(rows[0].cells[1].isErrorsCell).toBeFalsy();
    expect(rows[0].cells[1].item).toBe(question.items[1]);

    expect(rows[1].cells.length).toBe(2);
    expect(rows[1].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[1].cells[0].item).toBe(question.items[0]);
    expect(rows[1].cells[1].isErrorsCell).toBeTruthy();
    expect(rows[1].cells[1].item).toBe(question.items[1]);

    expect(rows[2].cells.length).toBe(1);
    expect(rows[2].cells[0].isErrorsCell).toBeFalsy();
    expect(rows[2].cells[0].item).toBe(question.items[2]);

    expect(rows[3].cells.length).toBe(1);
    expect(rows[3].cells[0].isErrorsCell).toBeTruthy();
    expect(rows[3].cells[0].item).toBe(question.items[2]);
  });

  test("Check rows rebuilding", () => {
    const question = new QuestionMultipleTextModel("multipletext");
    let changeCount = 0;
    question.registerFunctionOnPropertyValueChanged("rows", () => {
      changeCount++;
    });
    question.addItem("item1", "Item1");
    question.addItem("item2", "Item2");
    question.addItem("item3", "Item3");
    expect(changeCount).toBe(3);
    question.getRows();
    expect(changeCount).toBe(3);
    question.itemErrorLocation = "bottom";
    expect(changeCount).toBe(4);
    question.colCount = 2;
    expect(changeCount).toBe(5);
    question.titleLocation = "left";
    question.getRows();
    expect(changeCount).toBe(5);
  });

  test("Check error row visibility", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "test",
          colCount: 2,
          items: [
            {
              name: "item1",
              isRequired: true,
              title: "Item"
            },
            {
              name: "item2",
              isRequired: true,
              title: "Item"
            }
          ]
        }
      ]
    });
    const question = <QuestionMultipleTextModel>survey.getAllQuestions()[0];
    expect(question.getRows()[0].isVisible).toBeFalsy();
    survey.tryComplete();
    expect(question.getRows()[0].isVisible).toBeTruthy();
    question.items[0].editor.value = "test";
    expect(question.getRows()[0].isVisible).toBeTruthy();
    question.items[1].editor.value = "test";
    expect(question.getRows()[0].isVisible).toBeFalsy();
  });
  test("Load min/maxValueExpression from JSON", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            {
              name: "item1",
              minValueExpression: 1,
              maxValueExpression: 10,
            }
          ]
        }
      ]
    });
    const question = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    expect(question.items[0].minValueExpression).toBe(1);
    expect(question.items[0].maxValueExpression).toBe(10);
  });
  test("min/maxValueExpression executing", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            {
              name: "item1"
            },
            {
              name: "item2",
              minValueExpression: "{q1.item1}"
            }
          ]
        }
      ]
    });
    const q1 = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    q1.items[0].value = 10;
    q1.items[1].value = 5;
    expect(q1.items[1].editor.validate(), "min is 10").toBe(false);
  });
  test("defaultValueExpression executing", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            {
              name: "item1"
            },
            {
              name: "item2"
            },
            {
              name: "item3",
              defaultValueExpression: "{q1.item1} + {q1.item2}"
            }
          ]
        }
      ]
    });
    const q1 = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    q1.items[0].value = 10;
    q1.items[1].value = 5;
    expect(q1.items[2].editor.value, "Calculated correctly").toBe(15);
  });
  test("Make inputSize invisible by default", () => {
    const prop = Serializer.findProperty("multipletext", "inputSize");
    expect(prop.visible).toBe(false);
  });
  test("mutltipletext fromJSON, bug#9400", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            {
              name: "item1"
            },
            {
              name: "item2"
            },
            {
              name: "item3",
              defaultValueExpression: "{q1.item1} + {q1.item2}"
            }
          ]
        }
      ]
    });
    const q1 = <QuestionMultipleTextModel>survey.getQuestionByName("q1");
    const q2 = <QuestionMultipleTextModel>survey.currentPage.addNewQuestion("multipletext", "q2");
    expect(q2.rows.length, "rows #1").toBe(2 * 2);
    const json = q1.toJSON();
    delete json["name"];
    q2.fromJSON(json);
    expect(q2.items.length, "items").toBe(3);
    expect(q2.rows.length, "rows # 2").toBe(3 * 2);
  });
  test("Make inputSize invisible by default", () => {
    const prop = Serializer.findProperty("multipletext", "inputSize");
    expect(prop.visible).toBe(false);
  });
  test("ProcessValue.hasValue to access multipletext in design mode", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "multipletext",
          name: "q1",
          items: [
            {
              name: "a",
            },
            {
              name: "b",
            }
          ]
        },
        { type: "text", name: "q2" }
      ]
    });
    survey.setDesignMode(true);
    const q2 = survey.getQuestionByName("q2");
    const q2Context = q2.getValueGetterContext();
    const processValue = new ProcessValue(q2Context);
    expect(processValue.hasValue("q1.a"), "#1").toBe(true);
    expect(processValue.hasValue("q1.c"), "#2").toBe(false);
    expect(processValue.hasValue("q1.b"), "#3").toBe(true);
  });
});

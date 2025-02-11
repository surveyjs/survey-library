import { Serializer } from "../src/jsonobject";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Survey_QuestionMultipleText");

QUnit.test("Check rows building (errors top)", (assert) => {
  const question = new QuestionMultipleTextModel("multipletext");
  question.addItem("item1", "Item1");
  question.addItem("item2", "Item2");
  question.addItem("item3", "Item3");
  let rows = question.getRows();
  assert.equal(rows.length, 6);

  assert.equal(rows[0].cells.length, 1);
  assert.ok(rows[0].cells[0].isErrorsCell);
  assert.equal(rows[0].cells[0].item, question.items[0]);

  assert.equal(rows[1].cells.length, 1);
  assert.notOk(rows[1].cells[0].isErrorsCell);
  assert.equal(rows[1].cells[0].item, question.items[0]);

  assert.equal(rows[2].cells.length, 1);
  assert.ok(rows[2].cells[0].isErrorsCell);
  assert.equal(rows[2].cells[0].item, question.items[1]);

  assert.equal(rows[3].cells.length, 1);
  assert.notOk(rows[3].cells[0].isErrorsCell);
  assert.equal(rows[3].cells[0].item, question.items[1]);

  assert.equal(rows[4].cells.length, 1);
  assert.ok(rows[4].cells[0].isErrorsCell);
  assert.equal(rows[4].cells[0].item, question.items[2]);

  assert.equal(rows[5].cells.length, 1);
  assert.notOk(rows[5].cells[0].isErrorsCell);
  assert.equal(rows[5].cells[0].item, question.items[2]);

  question.colCount = 2;
  rows = question.getRows();

  assert.equal(rows.length, 4);

  assert.equal(rows[0].cells.length, 2);
  assert.ok(rows[0].cells[0].isErrorsCell);
  assert.equal(rows[0].cells[0].item, question.items[0]);
  assert.ok(rows[0].cells[1].isErrorsCell);
  assert.equal(rows[0].cells[1].item, question.items[1]);

  assert.equal(rows[1].cells.length, 2);
  assert.notOk(rows[1].cells[0].isErrorsCell);
  assert.equal(rows[1].cells[0].item, question.items[0]);
  assert.notOk(rows[1].cells[1].isErrorsCell);
  assert.equal(rows[1].cells[1].item, question.items[1]);

  assert.equal(rows[2].cells.length, 1);
  assert.ok(rows[2].cells[0].isErrorsCell);
  assert.equal(rows[2].cells[0].item, question.items[2]);

  assert.equal(rows[3].cells.length, 1);
  assert.notOk(rows[3].cells[0].isErrorsCell);
  assert.equal(rows[3].cells[0].item, question.items[2]);
});

QUnit.test("Check rows building (errors bottom)", (assert) => {
  const question = new QuestionMultipleTextModel("multipletext");
  question.addItem("item1", "Item1");
  question.addItem("item2", "Item2");
  question.addItem("item3", "Item3");
  question.itemErrorLocation = "bottom";
  let rows = question.getRows();
  assert.equal(rows.length, 6);

  assert.equal(rows[0].cells.length, 1);
  assert.notOk(rows[0].cells[0].isErrorsCell);
  assert.equal(rows[0].cells[0].item, question.items[0]);

  assert.equal(rows[1].cells.length, 1);
  assert.ok(rows[1].cells[0].isErrorsCell);
  assert.equal(rows[1].cells[0].item, question.items[0]);

  assert.equal(rows[2].cells.length, 1);
  assert.notOk(rows[2].cells[0].isErrorsCell);
  assert.equal(rows[2].cells[0].item, question.items[1]);

  assert.equal(rows[3].cells.length, 1);
  assert.ok(rows[3].cells[0].isErrorsCell);
  assert.equal(rows[3].cells[0].item, question.items[1]);

  assert.equal(rows[4].cells.length, 1);
  assert.notOk(rows[4].cells[0].isErrorsCell);
  assert.equal(rows[4].cells[0].item, question.items[2]);

  assert.equal(rows[5].cells.length, 1);
  assert.ok(rows[5].cells[0].isErrorsCell);
  assert.equal(rows[5].cells[0].item, question.items[2]);

  question.colCount = 2;
  rows = question.getRows();

  assert.equal(rows.length, 4);

  assert.equal(rows[0].cells.length, 2);
  assert.notOk(rows[0].cells[0].isErrorsCell);
  assert.equal(rows[0].cells[0].item, question.items[0]);
  assert.notOk(rows[0].cells[1].isErrorsCell);
  assert.equal(rows[0].cells[1].item, question.items[1]);

  assert.equal(rows[1].cells.length, 2);
  assert.ok(rows[1].cells[0].isErrorsCell);
  assert.equal(rows[1].cells[0].item, question.items[0]);
  assert.ok(rows[1].cells[1].isErrorsCell);
  assert.equal(rows[1].cells[1].item, question.items[1]);

  assert.equal(rows[2].cells.length, 1);
  assert.notOk(rows[2].cells[0].isErrorsCell);
  assert.equal(rows[2].cells[0].item, question.items[2]);

  assert.equal(rows[3].cells.length, 1);
  assert.ok(rows[3].cells[0].isErrorsCell);
  assert.equal(rows[3].cells[0].item, question.items[2]);
});

QUnit.test("Check rows rebuilding", (assert) => {
  const question = new QuestionMultipleTextModel("multipletext");
  let changeCount = 0;
  question.registerFunctionOnPropertyValueChanged("rows", () => {
    changeCount++;
  });
  question.addItem("item1", "Item1");
  question.addItem("item2", "Item2");
  question.addItem("item3", "Item3");
  assert.equal(changeCount, 3);
  question.getRows();
  assert.equal(changeCount, 3);
  question.itemErrorLocation = "bottom";
  assert.equal(changeCount, 4);
  question.colCount = 2;
  assert.equal(changeCount, 5);
  question.titleLocation = "left";
  question.getRows();
  assert.equal(changeCount, 5);
});

QUnit.test("Check error row visibility", (assert) => {
  const survey = new SurveyModel({
    questions: [
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
  assert.notOk(question.getRows()[0].isVisible);
  survey.tryComplete();
  assert.ok(question.getRows()[0].isVisible);
  question.items[0].editor.value = "test";
  assert.ok(question.getRows()[0].isVisible);
  question.items[1].editor.value = "test";
  assert.notOk(question.getRows()[0].isVisible);
});
QUnit.test("Load min/maxValueExpression from JSON", (assert) => {
  const survey = new SurveyModel({
    questions: [
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
  assert.equal(question.items[0].minValueExpression, 1);
  assert.equal(question.items[0].maxValueExpression, 10);
});
QUnit.test("min/maxValueExpression executing", (assert) => {
  const survey = new SurveyModel({
    questions: [
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
  assert.equal(q1.items[1].editor.hasErrors(), true);
});
QUnit.test("defaultValueExpression executing", (assert) => {
  const survey = new SurveyModel({
    questions: [
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
  assert.equal(q1.items[2].editor.value, 15, "Calculated correctly");
});
QUnit.test("Make inputSize invisible by default", (assert) => {
  const prop = Serializer.findProperty("multipletext", "inputSize");
  assert.strictEqual(prop.visible, false);
});
QUnit.test("mutltipletext fromJSON, bug#9400", (assert) => {
  const survey = new SurveyModel({
    questions: [
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
  assert.equal(q2.rows.length, 2 * 2, "rows #1");
  const json = q1.toJSON();
  delete json["name"];
  q2.fromJSON(json);
  assert.equal(q2.items.length, 3, "items");
  assert.equal(q2.rows.length, 3 * 2, "rows # 2");
});
QUnit.test("Make inputSize invisible by default", (assert) => {
  const prop = Serializer.findProperty("multipletext", "inputSize");
  assert.strictEqual(prop.visible, false);
});
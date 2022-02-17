import { SurveyModel } from "../src/survey";

import { QuestionSelectBase } from "../src/question_baseselect";
import { settings } from "../src/settings";
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { QuestionImagePickerModel } from "../src/question_imagepicker";
import { QuestionButtonGroupModel } from "../src/question_buttongroup";

export default QUnit.module("baseselect");

function getValuesInColumns(question: QuestionSelectBase) {
  return question.columns.map((column) => column.map((choice) => choice.value));
}

QUnit.test("Check QuestionSelectBase columns property", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        choices: ["Item1", "Item2", "Item3", "Item4", "Item5"],
        colCount: 3,
      },
    ],
  };
  var survey = new SurveyModel(json);

  var question = <QuestionSelectBase>survey.getAllQuestions()[0];
  var columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item4"], ["Item2", "Item5"], ["Item3"]],
    "check showItemsBy row"
  );
  settings.showItemsInOrder = "column";
  columns = getValuesInColumns(question);
  assert.deepEqual(
    columns,
    [["Item1", "Item2"], ["Item3", "Item4"], ["Item5"]],
    "check showItemsBy column"
  );
});
QUnit.test("Set ", function (assert) {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "q1",
        choicesByUrl: {
          path: "path1",
          valueName: "val1",
        },
      },
      {
        type: "checkbox",
        name: "q2",
        choicesByUrl: {
          path: "path2",
          titleName: "title1",
        },
      },
    ],
  };
  var survey = new SurveyModel(json);
  var q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  var q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  q2.choicesByUrl = q1.choicesByUrl;
  assert.equal(q2.choicesByUrl.path, "path1", "path set correctly");
  assert.equal(q2.choicesByUrl.valueName, "val1", "valueName set correctly");
  assert.equal(q2.choicesByUrl.titleName, "", "titleName is cleard");
});
QUnit.test("check allowhover class in design mode", (assert) => {
  var json = {
    questions: [
      {
        type: "checkbox",
        name: "q1",
        choices: ["Item 1"],
      },
    ],
  };
  const survey = new SurveyModel(json);
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  q1.cssClasses.itemHover = "sv_q_checkbox_hover";
  const item = q1.visibleChoices[0];
  assert.ok(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") != -1);
  survey.setDesignMode(true);
  assert.ok(q1.getItemClass(item).indexOf("sv_q_checkbox_hover") == -1);
});
QUnit.test("check item value type", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "dropdown",
        name: "q1",
        choices: ["Item 1"],
      },
      {
        type: "imagepicker",
        name: "q2",
        choices: ["Item 1"],
      },
      {
        type: "buttongroup",
        name: "q3",
        choices: ["Item 1"],
      },
    ],
  });
  const q1 = <QuestionSelectBase>survey.getQuestionByName("q1");
  const q2 = <QuestionSelectBase>survey.getQuestionByName("q2");
  const q3 = <QuestionSelectBase>survey.getQuestionByName("q3");
  assert.equal(q1.choices[0].getType(), "itemvalue", "load dropdown");
  assert.equal(q1.choices[0].value, "Item 1", "load dropdown, value");
  assert.equal(q2.choices[0].getType(), "imageitemvalue", "load imagepicker");
  assert.equal(q2.choices[0].value, "Item 1", "load imagepicker value");
  assert.equal(q3.choices[0].getType(), "buttongroupitemvalue", "load buttongroup");
  assert.equal(q3.choices[0].value, "Item 1", "load buttongroup value");
  assert.equal(q1.createItemValue(1).getType(), "itemvalue", "create dropdown item");
  assert.equal(q1.createItemValue(1).value, 1, "create dropdown, value");
  assert.equal(q2.createItemValue(1).getType(), "imageitemvalue", "create imagepicker item");
  assert.equal(q2.createItemValue(1).value, 1, "create imagepicker, value");
  assert.equal(q3.createItemValue(1).getType(), "buttongroupitemvalue", "create buttongroup item");
  assert.equal(q3.createItemValue(1).value, 1, "create buttongroup, value");
});

QUnit.test("check item locstring owner and name", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: ["Item 1"],
      }]
  });

  var question = survey.getQuestionByName("q1") as any;
  assert.equal(question.locTitle.owner.getType(), "radiogroup", "Owner for radio question title is radiogroup");
  assert.equal(question.locTitle.name, "title", "Name for radio question title is title");
  var itemValue = (question.choices[0]);
  assert.equal(itemValue.locText.owner.getType(), "itemvalue", "Owner for radio question item text is itemvalue");
  assert.equal(itemValue.locText.name, "text", "Name for radio question item text is text");
});

QUnit.test("check onShowingChoiceItem event", (assert) => {
  const survey = new SurveyModel({
    questions: [
      {
        type: "radiogroup",
        name: "q1",
        choices: [{ value: "Item1", visibleIf: "1 = 2" }, "Item2", "Item3"],
        hasNone: true,
        hasOther: true
      }]
  });

  const question = <QuestionRadiogroupModel>survey.getQuestionByName("q1");
  assert.equal(question.visibleChoices.length, 4);
  assert.equal(question.visibleChoices[0].value, "Item2");
  assert.equal(question.visibleChoices[1].value, "Item3");
  assert.equal(question.visibleChoices[2].value, "other");
  assert.equal(question.visibleChoices[3].value, "none");

  survey.onShowingChoiceItem.add((sender, options) => {
    if (options.question.name !== "q1") return;
    options.visible = ["Item1", "Item2"].indexOf(options.item.value) > -1;
  });

  assert.equal(question.visibleChoices.length, 2);
  assert.equal(question.visibleChoices[0].value, "Item1");
  assert.equal(question.visibleChoices[1].value, "Item2");
});
import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { DragDropChoices } from "../src/dragdrop/choices";
import { DragDropRankingChoices } from "../src/dragdrop/ranking-choices";
import { DragDropRankingSelectToRank } from "../src/dragdrop/ranking-select-to-rank";
import { SurveyModel } from "../src/survey";
import { ItemValue } from "../src/itemvalue";
import { ImageItemValue } from "../src/question_imagepicker";
import { Question } from "../src/question";
import { QuestionSelectBase } from "../src/question_baseselect";
import { DragDropCore } from "../src/dragdrop/core";
import { DragDropDOMAdapter } from "../src/dragdrop/dom-adapter";
import { QuestionRankingModel } from "../src/question_ranking";

export default QUnit.module("DragDropHelper Tests");

function getNewQuestion(choices?: string[]) {
  const json = {
    questions: [
      {
        type: "checkbox",
        name: "Question 1",
        choices: choices || ["item1", "item2", "item3", "item4"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  return <QuestionSelectBase>survey.getAllQuestions()[0];
}

QUnit.test("drop", function (assert) {
  let ddHelper = new DragDropChoices(null);
  const dropTargetNode = document.createElement("div");
  const afterDragOver = ddHelper["afterDragOver"].bind(ddHelper);

  let question = getNewQuestion();
  let item1 = question.choices[0];
  let item2 = question.choices[1];
  let item3 = question.choices[2];
  let item4 = question.choices[3];

  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item1;
  ddHelper["dropTarget"] = <any>item3;
  ddHelper["domAdapter"]["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  afterDragOver(dropTargetNode);
  assert.deepEqual(
    question.visibleChoices.map((c) => c.value),
    ["item2", "item3", "item1", "item4"]
  );
  ddHelper["allowDropHere"] = true;
  ddHelper["drop"]();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item3", "item1", "item4"]
  );

  question = getNewQuestion();
  item1 = question.choices[0];
  item2 = question.choices[1];
  item3 = question.choices[2];
  item4 = question.choices[3];
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item4;
  ddHelper["dropTarget"] = <any>item3;
  ddHelper["domAdapter"]["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  afterDragOver(dropTargetNode);
  assert.deepEqual(
    question.visibleChoices.map((c) => c.value),
    ["item1", "item2", "item4", "item3"]
  );
  ddHelper["allowDropHere"] = true;
  ddHelper["drop"]();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item1", "item2", "item4", "item3"]
  );

  question = getNewQuestion();
  item1 = question.choices[0];
  item2 = question.choices[1];
  item3 = question.choices[2];
  item4 = question.choices[3];
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item1;
  ddHelper["dropTarget"] = <any>item2;
  ddHelper["domAdapter"]["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  afterDragOver(dropTargetNode);
  assert.deepEqual(
    question.visibleChoices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );
  ddHelper["allowDropHere"] = true;
  ddHelper["drop"]();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );
});

QUnit.test("dropTargetDataAttributeName for choices", function (assert) {
  let ddHelper: any = new DragDropChoices(null);

  ddHelper.draggedElement = new ItemValue(null);
  assert.equal(
    ddHelper.dropTargetDataAttributeName,
    "[data-sv-drop-target-item-value]"
  );
});

QUnit.test("choices: onDragStart and onDragEnd events", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "radiogroup",
        name: "q",
        choices: ["item1", "item2", "item3"],
      },
    ],
  });
  const question: QuestionRadiogroupModel = <QuestionRadiogroupModel>(
    survey.getQuestionByName("q")
  );
  let beforeCount = 0;
  let afterCount = 0;
  let draggedElementParent;

  const ddHelper: any = new DragDropChoices(survey);
  ddHelper.onDragStart.add((sender, options) => {
    beforeCount++;
  });
  ddHelper.onDragEnd.add((sender, options) => {
    afterCount++;
    draggedElementParent = options.draggedElement;
  });
  ddHelper.parentElement = question;
  ddHelper.draggedElement = question.choices[2];

  ddHelper["domAdapter"]["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  ddHelper["drop"]();
  assert.equal(beforeCount, 1);
  assert.equal(afterCount, 1);
  assert.equal(draggedElementParent.name, "q");
});

QUnit.test("DragDropRankingChoices shortcutClass getter", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["item1", "item2", "item3"],
      },
    ],
  });
  let dndRanking: any = new DragDropRankingChoices(null);
  dndRanking.parentElement = survey.getQuestionByName("q");

  assert.equal(dndRanking.shortcutClass, "sv-ranking");
});

QUnit.test("DragDropRankingChoices getIsDragOverRootNode", function (assert) {
  let dndRanking: any = new DragDropRankingChoices(null);
  let result;

  result = dndRanking.getIsDragOverRootNode(document.createElement("path"));
  assert.equal(result, false);

  const rootNode = document.createElement("div");
  rootNode.className = "someclass sv-ranking someclass2";
  result = dndRanking.getIsDragOverRootNode(rootNode);
  assert.equal(result, true);
});

QUnit.test("LongTap", function (assert) {
  let count = 0;
  const survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        longTap: false,
        choices: ["item1", "item2", "item3"],
      },
    ],
  });
  let dndRanking: any = new DragDropRankingChoices(null);
  dndRanking.parentElement = survey.getQuestionByName("q");

  dndRanking.parentElement.registerPropertyChangedHandlers(["rankingChoices"], () => { count++; });

  dndRanking.parentElement.dropTargetNodeMove = null;
  dndRanking.parentElement.updateRankingChoices(true);

  assert.equal(count, 2, "After update w/o longs tap");
  count = 0;

  dndRanking.parentElement.longTap = true;
  dndRanking.parentElement.dropTargetNodeMove = null;
  dndRanking.parentElement.updateRankingChoices(true);

  assert.equal(count, 2, "After update with longs tap");
});

QUnit.test("DragDrop shortcutCoordinates", function (assert) {
  let dnd: any = new DragDropDOMAdapter(null);

  const currentXCoordinate = 20;
  const shortcutWidth = 20;
  const shortcutXOffset = 10;
  const shortcutRightCoordinate = dnd["getShortcutRightCoordinate"](currentXCoordinate, shortcutWidth, shortcutXOffset);
  assert.equal(shortcutRightCoordinate, 20 + 20 - 10);

  const currentYCoordinate = 10;
  const shortcutHeight = 10;
  const shortcutYOffset = 5;
  const shortcutBottomCoordinate = dnd["getShortcutBottomCoordinate"](currentYCoordinate, shortcutHeight, shortcutYOffset);
  assert.equal(shortcutBottomCoordinate, 10 + 10 - 5);
});

QUnit.test("createImagePickerShortcut", function (assert) {
  let ddHelper = new DragDropChoices();
  let item = new ImageItemValue("a");

  const createImagePickerShortcut = ddHelper["createImagePickerShortcut"];
  const testElement = document.body.appendChild(document.createElement("div"));
  testElement.innerHTML = "<div data-sv-drop-target-item-value=\"camel\"><div class=\"sd-imagepicker__image-container\"><div class=\"sd-imagepicker__no-image\"></div><div class=\"svc-image-item-value-controls\"></div>";
  const draggedElement1 = testElement.querySelector(".sd-imagepicker__image-container") as HTMLElement;
  let result1 = createImagePickerShortcut(item, "", draggedElement1, null);
  assert.equal(result1.querySelectorAll(".sd-imagepicker__no-image").length, 1);

  item.imageLink = "#";
  testElement.innerHTML = "<div data-sv-drop-target-item-value=\"camel\"><div class=\"sd-imagepicker__image-container\"><img src=\"#\"></div><div class=\"svc-image-item-value-controls\"></div>";
  const draggedElement2 = testElement.querySelector(".sd-imagepicker__image-container") as HTMLElement;
  let result2 = createImagePickerShortcut(item, "", draggedElement2, null);
  assert.equal(result2.querySelectorAll("img").length, 1);
});

// selectToRankEnabled
function createRankingQuestionModel(withDefaultValue = false) {
  const json = {
    "selectToRankEnabled": true,
    "choices": [
      "11",
      "22",
      "33"
    ]
  };

  if (withDefaultValue) {
    json["defaultValue"] = ["33", "22"];
  }

  const model = new QuestionRankingModel("qr1");
  model.fromJSON(json);
  return model;
}

QUnit.test("DragDropRankingSelectToRank : selectToRankEnabled", function (assert) {
  const dndModel = new DragDropRankingSelectToRank();
  const questionModel = createRankingQuestionModel();

  dndModel.selectToRank(questionModel, 1, 0);
  assert.equal(questionModel.unRankingChoices.length, 2, "unRankingChoices count");
  assert.equal(questionModel.rankingChoices.length, 1, "rankingChoices count");
});

QUnit.test("DragDropRankingSelectToRank unselectFromRank", function (assert) {
  const withDefaultValue = true;
  const dndModel = new DragDropRankingSelectToRank();
  const questionModel = createRankingQuestionModel(withDefaultValue);

  dndModel.unselectFromRank(questionModel, 1);
  assert.equal(questionModel.unRankingChoices.length, 2, "unRankingChoices count");
  assert.equal(questionModel.rankingChoices.length, 1, "rankingChoices count");
});

QUnit.test("DragDropRankingSelectToRank reorderRankedItem", function (assert) {
  const withDefaultValue = true;
  const dndModel = new DragDropRankingSelectToRank();
  const questionModel = createRankingQuestionModel(withDefaultValue);

  dndModel.reorderRankedItem(questionModel, 0, 1);
  assert.equal(questionModel.rankingChoices[0].value, "22", "item 1 is correct");
  assert.equal(questionModel.rankingChoices[1].value, "33", "item 2 is correct");
  assert.equal(questionModel.rankingChoices.length, 2, "rankingChoices count");
});
// EO selectToRankEnabled
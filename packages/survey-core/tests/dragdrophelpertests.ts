import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { DragDropChoices } from "../src/dragdrop/choices";
import { DragDropRankingChoices } from "../src/dragdrop/ranking-choices";
import { DragDropRankingSelectToRank } from "../src/dragdrop/ranking-select-to-rank";
import { SurveyModel } from "../src/survey";
import { ItemValue } from "../src/itemvalue";
import { ImageItemValue } from "../src/question_imagepicker";
import { QuestionSelectBase } from "../src/question_baseselect";
import { DragDropDOMAdapter } from "../src/dragdrop/dom-adapter";
import { settings } from "../src/settings";
import { QuestionRankingModel } from "../src/question_ranking";
import { DragDropMatrixRows } from "../src/dragdrop/matrix-rows";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";

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

function getNewRankingQuestion() {
  const json = {
    questions: [
      {
        type: "ranking",
        name: "Question 1",
        choices: ["item1", "item2", "item3"],
      },
    ],
  };
  const survey = new SurveyModel(json);
  return <QuestionSelectBase>survey.getAllQuestions()[0];
}

QUnit.test("drop", function (assert) {
  let ddHelper = new DragDropChoices(undefined);
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
  ddHelper["isBottom"] = true;
  afterDragOver(dropTargetNode);
  assert.deepEqual(
    question.visibleChoices.map((c) => c.value),
    ["item2", "item3", "item1", "item4"]
  );
  ddHelper["allowDropHere"] = true;
  ddHelper["drop"]();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item3", "item1", "item4"],
    "this!"
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
  ddHelper["isBottom"] = false;
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
  ddHelper["isBottom"] = true;
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

  dropTargetNode.remove();
});

QUnit.test("dropTargetDataAttributeName for choices", function (assert) {
  let ddHelper: any = new DragDropChoices(undefined);

  ddHelper.draggedElement = new ItemValue(null);
  assert.equal(
    ddHelper.dropTargetDataAttributeName,
    "[data-sv-drop-target-item-value]"
  );
});

QUnit.test("choices: onDragStart, onDragEnd, onDragClear events", function (assert) {
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
  let clearCount = 0;
  let draggedElementParent;

  const ddHelper: any = new DragDropChoices(survey);
  ddHelper.onDragStart.add((sender, options) => {
    beforeCount++;
  });
  ddHelper.onDragEnd.add((sender, options) => {
    afterCount++;
    draggedElementParent = options.draggedElement;
  });
  ddHelper.onDragClear.add((sender, options) => {
    clearCount++;
  });

  ddHelper.parentElement = question;
  ddHelper.draggedElement = question.choices[2];

  ddHelper["createDraggedElementShortcut"] = ()=>{};
  ddHelper.dragInit(null, ddHelper.draggedElement, ddHelper.parentElement, document.createElement("div"));
  assert.equal(beforeCount, 1);
  ddHelper["allowDropHere"] = true;
  ddHelper["domAdapter"]["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["drop"]();
  assert.equal(afterCount, 1);
  assert.equal(draggedElementParent.name, "q");
  ddHelper["clear"]();
  assert.equal(clearCount, 1);
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
  let dndRanking: any = new DragDropRankingChoices(undefined);
  dndRanking.parentElement = survey.getQuestionByName("q");

  assert.equal(dndRanking.shortcutClass, "sv-ranking");
});

QUnit.test("DragDropRankingChoices getIsDragOverRootNode", function (assert) {
  let dndRanking: any = new DragDropRankingChoices(undefined);
  let result;

  let pathElement = document.createElement("path");
  result = dndRanking.getIsDragOverRootNode(pathElement);
  assert.equal(result, false);

  const rootNode = document.createElement("div");
  rootNode.className = "someclass sv-ranking someclass2";
  result = dndRanking.getIsDragOverRootNode(rootNode);
  assert.equal(result, true);

  pathElement.remove();
  rootNode.remove();
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
  let dndRanking: any = new DragDropRankingChoices(undefined);
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
  let dnd: any = new DragDropDOMAdapter(null as any);

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

QUnit.test("DragDropDOMAdapter documentOrShadowRoot", function (assert) {
  let dndDomAdapter: any = new DragDropDOMAdapter(<any>null);
  assert.equal(dndDomAdapter.documentOrShadowRoot, document);

  let node = document.createElement("div");
  node.attachShadow({ mode: "open" });
  document.body.appendChild(node);
  let shadowRoot = <Document | ShadowRoot>node.shadowRoot;
  settings.environment.root = shadowRoot;
  assert.equal(dndDomAdapter.documentOrShadowRoot, shadowRoot);
  settings.environment.root = document;
  document.body.removeChild(node);
});

QUnit.test("createImagePickerShortcut", function (assert) {
  let ddHelper = new DragDropChoices();
  let item = new ImageItemValue("a");

  const createImagePickerShortcut = ddHelper["createImagePickerShortcut"].bind(ddHelper);
  const element = document.createElement("div");
  const testElement = document.body.appendChild(element);
  testElement.innerHTML = "<div data-sv-drop-target-item-value=\"camel\"><div class=\"sd-imagepicker__image-container\"><div class=\"sd-imagepicker__no-image\"></div><div class=\"svc-image-item-value-controls\"></div>";
  const draggedElement1 = testElement.querySelector(".sd-imagepicker__image-container") as HTMLElement;
  let result1 = createImagePickerShortcut(item, "", draggedElement1, null);
  assert.equal(result1.querySelectorAll(".sd-imagepicker__no-image").length, 1);

  item.imageLink = "#";
  testElement.innerHTML = "<div data-sv-drop-target-item-value=\"camel\"><div class=\"sd-imagepicker__image-container\"><img src=\"#\"></div><div class=\"svc-image-item-value-controls\"></div>";
  const draggedElement2 = testElement.querySelector(".sd-imagepicker__image-container") as HTMLElement;
  let result2 = createImagePickerShortcut(item, "", draggedElement2, null);
  assert.equal(result2.querySelectorAll("img").length, 1);
  element.remove();
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
  dndModel["parentElement"] = questionModel;

  dndModel.reorderRankedItem(questionModel, 0, 1);
  assert.equal(questionModel.rankingChoices[0].value, "22", "item 1 is correct");
  assert.equal(questionModel.rankingChoices[1].value, "33", "item 2 is correct");
  assert.equal(questionModel.rankingChoices.length, 2, "rankingChoices count");
});

QUnit.test("DragDropRankingSelectToRank getIndices", function (assert) {
  const withDefaultValue = true;
  const dndModel = new DragDropRankingSelectToRank();
  const questionModel = createRankingQuestionModel(withDefaultValue);
  let toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.unRankingChoices).toIndex;
  assert.equal(toIndex, 2);
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
  assert.equal(toIndex, 2);

  dndModel.draggedElement = questionModel.rankingChoices[0];
  dndModel.dropTarget = questionModel.rankingChoices[1];
  dndModel["_isBottom"] = false;
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
  assert.equal(toIndex, 0);

  dndModel.draggedElement = questionModel.rankingChoices[0];
  dndModel.dropTarget = questionModel.rankingChoices[1];
  dndModel["_isBottom"] = true;
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
  assert.equal(toIndex, 1);

  dndModel.draggedElement = questionModel.rankingChoices[1];
  dndModel.dropTarget = questionModel.rankingChoices[0];
  dndModel["_isBottom"] = false;
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
  assert.equal(toIndex, 0);

  dndModel.draggedElement = questionModel.rankingChoices[1];
  dndModel.dropTarget = questionModel.rankingChoices[0];
  dndModel["_isBottom"] = true;
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
  assert.equal(toIndex, 1);

  dndModel.dropTarget = questionModel.unRankingChoices[0];
  dndModel.draggedElement = questionModel.rankingChoices[1];
  dndModel["_isBottom"] = true;
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.unRankingChoices).toIndex;
  assert.equal(toIndex, 1);

  dndModel["_isBottom"] = false;
  dndModel.dropTarget = questionModel.unRankingChoices[0];
  dndModel.draggedElement = questionModel.rankingChoices[1];
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.unRankingChoices).toIndex;
  assert.equal(toIndex, 0);

  questionModel.value = ["11", "22", "33"];
  dndModel.draggedElement = questionModel.rankingChoices[0];
  dndModel.dropTarget = questionModel.rankingChoices[1];
  dndModel["_isBottom"] = true;
  toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
  assert.equal(toIndex, 1);
});
// EO selectToRankEnabled

QUnit.test("rows: check matrixdynamic d&d", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        allowRowsDragAndDrop: true,
        name: "q",
        columns: ["Col1"],
        rowCount: 3,
        choices: ["item1", "item2", "item3"],
      },
    ]
  });
  const question: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("q")
  );

  const ddHelper = new DragDropMatrixRows(survey);

  let draggedRow = question.visibleRows[1];
  let dropRow = question.visibleRows[2];

  ddHelper["parentElement"] = question;
  ddHelper.draggedElement = draggedRow;
  ddHelper["onStartDrag"]();
  ddHelper["createDraggedElementShortcut"]("", <any>undefined, <any>undefined);
  assert.equal(ddHelper["fromIndex"], 1);
  assert.ok(question.renderedTable.rows[3].isGhostRow);

  ddHelper.dropTarget = dropRow;
  ddHelper.isBottom = true;
  ddHelper["afterDragOver"](<any>undefined);
  assert.equal(ddHelper["toIndex"], 3);
  assert.strictEqual(question.renderedTable.rows[4].row, dropRow);
  assert.ok(question.renderedTable.rows[5].isGhostRow);
  assert.strictEqual(question.renderedTable.rows[5].row, draggedRow);

  ddHelper["doDrop"]();
  ddHelper.clear();
  assert.strictEqual(question.renderedTable.rows[3].row, question.visibleRows[1]);
  assert.strictEqual(question.renderedTable.rows[5].row, question.visibleRows[2]);

  draggedRow = question.visibleRows[2];
  dropRow = question.visibleRows[0];

  ddHelper["parentElement"] = question;
  ddHelper.draggedElement = draggedRow;
  ddHelper["onStartDrag"]();
  ddHelper["createDraggedElementShortcut"]("", <any>undefined, <any>undefined);
  assert.equal(ddHelper["fromIndex"], 2);
  assert.ok(question.renderedTable.rows[5].isGhostRow);

  ddHelper.dropTarget = dropRow;
  ddHelper.isBottom = false;
  ddHelper["afterDragOver"](<any>undefined);
  assert.equal(ddHelper["toIndex"], 0);
  assert.strictEqual(question.renderedTable.rows[2].row, dropRow);
  assert.ok(question.renderedTable.rows[1].isGhostRow);
  assert.strictEqual(question.renderedTable.rows[1].row, draggedRow);

  ddHelper["doDrop"]();
  ddHelper.clear();
  assert.strictEqual(question.renderedTable.rows[1].row, question.visibleRows[0]);
  assert.strictEqual(question.renderedTable.rows[3].row, question.visibleRows[1]);
});

QUnit.test("rows: check matrixdynamic d&d between different matrices", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        allowRowsDragAndDrop: true,
        name: "q1",
        columns: ["Col1"],
        defaultValue: [{ Col1: "item1" }, { Col1: "item2" }, { Col1: "item3" }],
        rowCount: 3,
        choices: ["item1", "item2", "item3"],
      },
      {
        type: "matrixdynamic",
        allowRowsDragAndDrop: true,
        name: "q2",
        columns: ["Col1"],
        defaultValue: [{ Col1: "item4" }, { Col1: "item5" }, { Col1: "item6" }],
        rowCount: 3,
        choices: ["item4", "item5", "item6"],
      }
    ]
  });
  const question1: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("q1")
  );
  const question2: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("q2")
  );

  let allowDragDrop = false;
  survey.onMatrixRowDragOver.add((_, o) => {
    o.allow = allowDragDrop && o.fromMatrix == question1 && o.toMatrix == question2;
  });

  const ddHelper = new DragDropMatrixRows(survey);

  // Drag row from first matrix to second
  let draggedRow = question1.visibleRows[1];
  let dropRow = question2.visibleRows[1];

  ddHelper["parentElement"] = question1;
  ddHelper.draggedElement = draggedRow;
  ddHelper.dropTarget = dropRow;
  ddHelper["onStartDrag"]();
  ddHelper["createDraggedElementShortcut"]("", <any>undefined, <any>undefined);
  assert.equal(ddHelper["fromIndex"], 1);
  assert.ok(question1.renderedTable.rows[3].isGhostRow);

  ddHelper.dropTarget = dropRow;
  assert.equal(ddHelper["toIndex"], null);
  assert.ok(question1.renderedTable.rows[3].isGhostRow);
  assert.strictEqual(question2.renderedTable.rows.length, 6);

  allowDragDrop = true;
  ddHelper.isBottom = true;
  ddHelper["afterDragOver"](<any>undefined);
  assert.equal(ddHelper["toIndex"], 2);
  assert.strictEqual(question2.renderedTable.rows[3].row, dropRow);
  assert.strictEqual(question2.renderedTable.rows.length, 7);
  assert.ok(question2.renderedTable.rows[4].isGhostRow);
  assert.strictEqual(question2.renderedTable.rows[4].row, draggedRow);

  ddHelper["doDrop"]();
  ddHelper.clear();

  // Verify row was moved correctly
  assert.equal(question1.visibleRows.length, 2, "First matrix has two rows left");
  assert.equal(question2.visibleRows.length, 4, "Second matrix has four rows");
  assert.deepEqual(question1.value, [{ "Col1": "item1" }, { "Col1": "item3" }], "Dragged row is gone from first matrix");
  assert.deepEqual(question2.value, [{ "Col1": "item4" }, { "Col1": "item5" }, { "Col1": "item2" }, { "Col1": "item6" }], "Dragged row is now in second matrix");
});

QUnit.test("rows: check matrixdynamic d&d between different matrices in detail panels", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        allowRowsDragAndDrop: true,
        name: "q1",
        columns: ["Col1"],
        defaultValue: [{ Col1: "item1" }, { Col1: "item2" }],
        rowCount: 1,
        choices: ["item1"],
        detailPanelMode: "underRow",
        detailElements: [
          {
            type: "matrixdynamic",
            allowRowsDragAndDrop: true,
            name: "q1_detail",
            columns: ["Col1"],
            defaultValue: [{ Col1: "detail1" }, { Col1: "detail2" }],
            rowCount: 2,
            choices: ["detail1", "detail2"]
          }
        ]
      }
    ]
  });

  const q = survey.getQuestionByName("q1");
  q.visibleRows[0].showDetailPanel();
  q.visibleRows[1].showDetailPanel();

  const question1Detail: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    q.visibleRows[0].detailPanel.getQuestionByName("q1_detail")
  );
  const question2Detail: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    q.visibleRows[1].detailPanel.getQuestionByName("q1_detail")
  );

  let allowDragDrop = false;
  survey.onMatrixRowDragOver.add((_, o) => {
    o.allow = allowDragDrop;
  });

  const ddHelper = new DragDropMatrixRows(survey);

  let draggedRow = question1Detail.visibleRows[0];
  let dropRow = question2Detail.visibleRows[1];

  ddHelper["parentElement"] = question1Detail;
  ddHelper.draggedElement = draggedRow;
  ddHelper.dropTarget = dropRow;
  ddHelper["onStartDrag"]();
  ddHelper["createDraggedElementShortcut"]("", <any>undefined, <any>undefined);

  const matrixRowMap = ddHelper["matrixRowMap"] as { [key: string]: { row: any, matrix: QuestionMatrixDynamicModel } };
  const expectedRowCount = q.visibleRows.length + question1Detail.visibleRows.length + question2Detail.visibleRows.length;
  assert.equal(Object.keys(matrixRowMap).length, expectedRowCount, "matrixRowMap should contain rows from detail matrices");

  const row1id = question1Detail.visibleRows[0].id;
  const row2id = question2Detail.visibleRows[1].id;

  assert.ok(matrixRowMap[row1id].matrix == question1Detail, "question1Detail should be in matrixRowMap");
  assert.ok(matrixRowMap[row2id].matrix == question2Detail, "question2Detail should be in matrixRowMap");
});

QUnit.test("ranking selectToRank for ChoicesDND(creator)", function (assert) {
  const json = {
    questions: [
      {
        type: "ranking",
        name: "q1",
        selectToRankEnabled: true,
        choices: ["item1", "item2", "item3", "item4"]
      },
    ],
  };
  const survey = new SurveyModel(json);

  let ddHelper:any = new DragDropChoices(survey);
  ddHelper.parentElement = survey.getQuestionByName("q1");
  assert.equal(ddHelper["getChoices"]().length, 4);
});

QUnit.test("DragDropDOMAdapter: getNodeIndexInParent", function (assert) {
  const parent = document.createElement("div");
  const child1 = document.createElement("div");
  const child2 = document.createElement("div");

  parent.appendChild(child1);
  parent.appendChild(child2);

  const ddengine: any = null;
  let domAdapter: any = new DragDropDOMAdapter(ddengine);
  assert.equal(domAdapter.getNodeIndexInParent(child1), 0);
  assert.equal(domAdapter.getNodeIndexInParent(child2), 1);
});

QUnit.test("DragDropDOMAdapter: insertNodeToParentAtIndex", function (assert) {
  const parent = document.createElement("div");
  const child1 = document.createElement("div");
  const child2 = document.createElement("div");

  parent.appendChild(child1);

  const ddengine: any = null;
  let domAdapter: any = new DragDropDOMAdapter(ddengine);
  domAdapter.insertNodeToParentAtIndex(parent, child2, 0);

  assert.equal(domAdapter.getNodeIndexInParent(child2), 0);
  assert.equal(domAdapter.getNodeIndexInParent(child1), 1);
});

QUnit.test("check rootContainer", function (assert) {
  let h1 = document.createElement("h1");
  let h2 = document.createElement("h2");
  let survey:any = { rootElement: h1 };
  let creator:any = { rootElement: h2 };
  let dd: any = new DragDropChoices(survey);
  assert.equal(dd.getRootElement(survey), h1);
  assert.equal(dd.getRootElement(survey, creator), h2);
});

QUnit.test("getChoices", function (assert) {
  let ddHelper = new DragDropChoices(undefined);

  let questionSelectBase = getNewQuestion();
  ddHelper["parentElement"] = <any>questionSelectBase;
  assert.deepEqual(
    ddHelper["getChoices"](),
    questionSelectBase.visibleChoices
  );

  let questionRanking = getNewRankingQuestion();
  ddHelper["parentElement"] = <any>questionRanking;
  assert.deepEqual(
    ddHelper["getChoices"](),
    questionRanking.rankingChoices
  );
  questionRanking.selectToRankEnabled = true;
  ddHelper["parentElement"] = <any>questionRanking;
  assert.deepEqual(
    ddHelper["getChoices"](),
    questionRanking.unRankingChoices
  );
});

QUnit.test("DragDropMatrixRows matrix row drag and drop", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        name: "matrix1",
        allowRowReorder: true,
        columns: [{ name: "col1" }]
      },
      {
        type: "matrixdynamic",
        name: "matrix2",
        allowRowReorder: false,
        columns: [{ name: "col1" }]
      },
      {
        type: "matrixdynamic",
        name: "matrix3",
        allowRowReorder: true,
        columns: [{ name: "col1" }]
      }
    ]
  });

  const ddHelper = new DragDropMatrixRows(survey);
  const matrix1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix1");
  const matrix2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix2");
  const matrix3 = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix3");

  // Test when no onMatrixRowDragOver event is set
  ddHelper["parentElement"] = matrix1;
  ddHelper.draggedElement = matrix1.visibleRows[0];
  ddHelper["onStartDrag"]();

  // Verify matrixRowMap contains only matrix1 rows
  const matrixRowMap = ddHelper["matrixRowMap"] as { [key: string]: { row: any, matrix: QuestionMatrixDynamicModel } };
  assert.equal(Object.keys(matrixRowMap).length, matrix1.visibleRows.length, "Only matrix1 rows should be in matrixRowMap");

  for (const key in matrixRowMap) {
    const { matrix } = matrixRowMap[key];
    assert.equal(matrix, matrix1, "All rows should belong to matrix1");
  }

  // Test when onMatrixRowDragOver event is set
  survey.onMatrixRowDragOver.add((sender, options) => {
    options.allow = true;
  });

  ddHelper.clear();
  ddHelper["parentElement"] = matrix1;
  ddHelper.draggedElement = matrix1.visibleRows[0];
  ddHelper["onStartDrag"]();

  // Verify matrixRowMap contains rows from both matrix1 and matrix3
  const matrixRowMap2 = ddHelper["matrixRowMap"] as { [key: string]: { row: any, matrix: QuestionMatrixDynamicModel } };
  const expectedRowCount = matrix1.visibleRows.length + matrix3.visibleRows.length;
  assert.equal(Object.keys(matrixRowMap2).length, expectedRowCount, "matrixRowMap should contain rows from both matrix1 and matrix3");

  const matricesInMap = new Set<QuestionMatrixDynamicModel>();
  for (const key in matrixRowMap2) {
    matricesInMap.add(matrixRowMap2[key].matrix);
  }

  assert.ok(matricesInMap.has(matrix1), "matrix1 should be in matrixRowMap");
  assert.ok(matricesInMap.has(matrix3), "matrix3 should be in matrixRowMap");
  assert.notOk(matricesInMap.has(matrix2), "matrix2 should not be in matrixRowMap");
});

QUnit.test("rows: check matrixdynamic d&d to empty matrix", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "matrixdynamic",
        allowRowsDragAndDrop: true,
        name: "q1",
        columns: ["Col1"],
        defaultValue: [{ Col1: "item1" }, { Col1: "item2" }, { Col1: "item3" }],
        rowCount: 3,
        choices: ["item1", "item2", "item3"],
      },
      {
        type: "matrixdynamic",
        allowRowsDragAndDrop: true,
        name: "q2",
        columns: ["Col1"],
        rowCount: 0,
        choices: ["item4", "item5", "item6"],
      }
    ]
  });
  const question1: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("q1")
  );
  const question2: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("q2")
  );

  let allowDragDrop = false;
  survey.onMatrixRowDragOver.add((_, o) => {
    o.allow = allowDragDrop && o.fromMatrix == question1 && o.toMatrix == question2;
  });

  const ddHelper = new DragDropMatrixRows(survey);

  // Drag row from first matrix to empty second matrix
  let draggedRow = question1.visibleRows[1];

  ddHelper["parentElement"] = question1;
  ddHelper.draggedElement = draggedRow;
  ddHelper["onStartDrag"]();
  ddHelper["createDraggedElementShortcut"]("", <any>undefined, <any>undefined);
  assert.equal(ddHelper["fromIndex"], 1);
  assert.ok(question1.renderedTable.rows[3].isGhostRow);

  // Set drop target to empty matrix (no specific row)
  ddHelper.dropTarget = question2;
  assert.equal(ddHelper["toIndex"], null);
  assert.ok(question1.renderedTable.rows[3].isGhostRow);
  assert.strictEqual(question2.renderedTable.rows.length, 1);

  allowDragDrop = true;
  ddHelper.isBottom = true;
  ddHelper["afterDragOver"](<any>undefined);
  assert.equal(ddHelper["toIndex"], 0);
  assert.strictEqual(question2.renderedTable.rows.length, 2);
  assert.ok(question2.renderedTable.rows[0].isGhostRow);
  assert.strictEqual(question2.renderedTable.rows[0].row, draggedRow);

  ddHelper["doDrop"]();
  ddHelper.clear();

  // Verify row was moved correctly to empty matrix
  assert.equal(question1.visibleRows.length, 2, "First matrix has two rows left");
  assert.equal(question2.visibleRows.length, 1, "Second matrix has one row");
  assert.deepEqual(question1.value, [{ "Col1": "item1" }, { "Col1": "item3" }], "Dragged row is gone from first matrix");
  assert.deepEqual(question2.value, [{ "Col1": "item2" }], "Dragged row is now in second matrix");
});
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

import { describe, test, expect } from "vitest";
describe("DragDropHelper Tests", () => {
  function getNewQuestion(choices?: string[]) {
    const json = {
      elements: [
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
      elements: [
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

  test("drop", () => {
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
    expect(question.visibleChoices.map((c) => c.value)).toEqual(["item2", "item3", "item1", "item4"]);
    ddHelper["allowDropHere"] = true;
    ddHelper["drop"]();
    expect(question.choices.map((c) => c.value), "this!").toEqual(["item2", "item3", "item1", "item4"]);

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
    expect(question.visibleChoices.map((c) => c.value)).toEqual(["item1", "item2", "item4", "item3"]);
    ddHelper["allowDropHere"] = true;
    ddHelper["drop"]();
    expect(question.choices.map((c) => c.value)).toEqual(["item1", "item2", "item4", "item3"]);

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
    expect(question.visibleChoices.map((c) => c.value)).toEqual(["item2", "item1", "item3", "item4"]);
    ddHelper["allowDropHere"] = true;
    ddHelper["drop"]();
    expect(question.choices.map((c) => c.value)).toEqual(["item2", "item1", "item3", "item4"]);

    dropTargetNode.remove();
  });

  test("dropTargetDataAttributeName for choices", () => {
    let ddHelper: any = new DragDropChoices(undefined);

    ddHelper.draggedElement = new ItemValue(null);
    expect(ddHelper.dropTargetDataAttributeName).toBe("[data-sv-drop-target-item-value]");
  });

  test("choices: onDragStart, onDragEnd, onDragClear events", () => {
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
    expect(beforeCount).toBe(1);
    ddHelper["allowDropHere"] = true;
    ddHelper["domAdapter"]["draggedElementShortcut"] = document.body.appendChild(
      document.createElement("div")
    );
    ddHelper["drop"]();
    expect(afterCount).toBe(1);
    expect(draggedElementParent.name).toBe("q");
    ddHelper["clear"]();
    expect(clearCount).toBe(1);
  });

  test("DragDropRankingChoices shortcutClass getter", () => {
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

    expect(dndRanking.shortcutClass).toBe("sv-ranking");
  });

  test("DragDropRankingChoices getIsDragOverRootNode", () => {
    let dndRanking: any = new DragDropRankingChoices(undefined);
    let result;

    let pathElement = document.createElement("path");
    result = dndRanking.getIsDragOverRootNode(pathElement);
    expect(result).toBe(false);

    const rootNode = document.createElement("div");
    rootNode.className = "someclass sv-ranking someclass2";
    result = dndRanking.getIsDragOverRootNode(rootNode);
    expect(result).toBe(true);

    pathElement.remove();
    rootNode.remove();
  });

  test("LongTap", () => {
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

    expect(count, "After update w/o longs tap").toBe(2);
    count = 0;

    dndRanking.parentElement.longTap = true;
    dndRanking.parentElement.dropTargetNodeMove = null;
    dndRanking.parentElement.updateRankingChoices(true);

    expect(count, "After update with longs tap").toBe(2);
  });

  test("DragDrop shortcutCoordinates", () => {
    let dnd: any = new DragDropDOMAdapter(null as any);

    const currentXCoordinate = 20;
    const shortcutWidth = 20;
    const shortcutXOffset = 10;
    const shortcutRightCoordinate = dnd["getShortcutRightCoordinate"](currentXCoordinate, shortcutWidth, shortcutXOffset);
    expect(shortcutRightCoordinate).toBe(20 + 20 - 10);

    const currentYCoordinate = 10;
    const shortcutHeight = 10;
    const shortcutYOffset = 5;
    const shortcutBottomCoordinate = dnd["getShortcutBottomCoordinate"](currentYCoordinate, shortcutHeight, shortcutYOffset);
    expect(shortcutBottomCoordinate).toBe(10 + 10 - 5);
  });

  test("DragDropDOMAdapter documentOrShadowRoot", () => {
    let dndDomAdapter: any = new DragDropDOMAdapter(<any>null);
    expect(dndDomAdapter.documentOrShadowRoot).toBe(document);

    let node = document.createElement("div");
    node.attachShadow({ mode: "open" });
    document.body.appendChild(node);
    let shadowRoot = <Document | ShadowRoot>node.shadowRoot;
    settings.environment.root = shadowRoot;
    expect(dndDomAdapter.documentOrShadowRoot).toBe(shadowRoot);
    settings.environment.root = document;
    document.body.removeChild(node);
  });

  test("createImagePickerShortcut", () => {
    let ddHelper = new DragDropChoices();
    let item = new ImageItemValue("a");

    const createImagePickerShortcut = ddHelper["createImagePickerShortcut"].bind(ddHelper);
    const element = document.createElement("div");
    const testElement = document.body.appendChild(element);
    testElement.innerHTML = "<div data-sv-drop-target-item-value=\"camel\"><div class=\"sd-imagepicker__image-container\"><div class=\"sd-imagepicker__no-image\"></div><div class=\"svc-image-item-value-controls\"></div>";
    const draggedElement1 = testElement.querySelector(".sd-imagepicker__image-container") as HTMLElement;
    let result1 = createImagePickerShortcut(item, "", draggedElement1, null);
    expect(result1.querySelectorAll(".sd-imagepicker__no-image").length).toBe(1);

    item.imageLink = "#";
    testElement.innerHTML = "<div data-sv-drop-target-item-value=\"camel\"><div class=\"sd-imagepicker__image-container\"><img src=\"#\"></div><div class=\"svc-image-item-value-controls\"></div>";
    const draggedElement2 = testElement.querySelector(".sd-imagepicker__image-container") as HTMLElement;
    let result2 = createImagePickerShortcut(item, "", draggedElement2, null);
    expect(result2.querySelectorAll("img").length).toBe(1);
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

  test("DragDropRankingSelectToRank : selectToRankEnabled", () => {
    const dndModel = new DragDropRankingSelectToRank();
    const questionModel = createRankingQuestionModel();

    dndModel.selectToRank(questionModel, 1, 0);
    expect(questionModel.unRankingChoices.length, "unRankingChoices count").toBe(2);
    expect(questionModel.rankingChoices.length, "rankingChoices count").toBe(1);
  });

  test("DragDropRankingSelectToRank unselectFromRank", () => {
    const withDefaultValue = true;
    const dndModel = new DragDropRankingSelectToRank();
    const questionModel = createRankingQuestionModel(withDefaultValue);

    dndModel.unselectFromRank(questionModel, 1);
    expect(questionModel.unRankingChoices.length, "unRankingChoices count").toBe(2);
    expect(questionModel.rankingChoices.length, "rankingChoices count").toBe(1);
  });

  test("DragDropRankingSelectToRank reorderRankedItem", () => {
    const withDefaultValue = true;
    const dndModel = new DragDropRankingSelectToRank();
    const questionModel = createRankingQuestionModel(withDefaultValue);
    dndModel["parentElement"] = questionModel;

    dndModel.reorderRankedItem(questionModel, 0, 1);
    expect(questionModel.rankingChoices[0].value, "item 1 is correct").toBe("22");
    expect(questionModel.rankingChoices[1].value, "item 2 is correct").toBe("33");
    expect(questionModel.rankingChoices.length, "rankingChoices count").toBe(2);
  });

  test("DragDropRankingSelectToRank getIndices", () => {
    const withDefaultValue = true;
    const dndModel = new DragDropRankingSelectToRank();
    const questionModel = createRankingQuestionModel(withDefaultValue);
    let toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.unRankingChoices).toIndex;
    expect(toIndex).toBe(2);
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
    expect(toIndex).toBe(2);

    dndModel.draggedElement = questionModel.rankingChoices[0];
    dndModel.dropTarget = questionModel.rankingChoices[1];
    dndModel["_isBottom"] = false;
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
    expect(toIndex).toBe(0);

    dndModel.draggedElement = questionModel.rankingChoices[0];
    dndModel.dropTarget = questionModel.rankingChoices[1];
    dndModel["_isBottom"] = true;
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
    expect(toIndex).toBe(1);

    dndModel.draggedElement = questionModel.rankingChoices[1];
    dndModel.dropTarget = questionModel.rankingChoices[0];
    dndModel["_isBottom"] = false;
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
    expect(toIndex).toBe(0);

    dndModel.draggedElement = questionModel.rankingChoices[1];
    dndModel.dropTarget = questionModel.rankingChoices[0];
    dndModel["_isBottom"] = true;
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
    expect(toIndex).toBe(1);

    dndModel.dropTarget = questionModel.unRankingChoices[0];
    dndModel.draggedElement = questionModel.rankingChoices[1];
    dndModel["_isBottom"] = true;
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.unRankingChoices).toIndex;
    expect(toIndex).toBe(1);

    dndModel["_isBottom"] = false;
    dndModel.dropTarget = questionModel.unRankingChoices[0];
    dndModel.draggedElement = questionModel.rankingChoices[1];
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.unRankingChoices).toIndex;
    expect(toIndex).toBe(0);

    questionModel.value = ["11", "22", "33"];
    dndModel.draggedElement = questionModel.rankingChoices[0];
    dndModel.dropTarget = questionModel.rankingChoices[1];
    dndModel["_isBottom"] = true;
    toIndex = dndModel.getIndices(questionModel, questionModel.rankingChoices, questionModel.rankingChoices).toIndex;
    expect(toIndex).toBe(1);
  });
  // EO selectToRankEnabled

  test("rows: check matrixdynamic d&d", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          allowRowReorder: true,
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
    expect(ddHelper["fromIndex"]).toBe(1);
    expect(question.renderedTable.rows[3].isGhostRow).toBeTruthy();

    ddHelper.dropTarget = dropRow;
    ddHelper.isBottom = true;
    ddHelper["afterDragOver"](<any>undefined);
    expect(ddHelper["toIndex"]).toBe(3);
    expect(question.renderedTable.rows[4].row).toBe(dropRow);
    expect(question.renderedTable.rows[5].isGhostRow).toBeTruthy();
    expect(question.renderedTable.rows[5].row).toBe(draggedRow);

    ddHelper["doDrop"]();
    ddHelper.clear();
    expect(question.renderedTable.rows[3].row).toBe(question.visibleRows[1]);
    expect(question.renderedTable.rows[5].row).toBe(question.visibleRows[2]);

    draggedRow = question.visibleRows[2];
    dropRow = question.visibleRows[0];

    ddHelper["parentElement"] = question;
    ddHelper.draggedElement = draggedRow;
    ddHelper["onStartDrag"]();
    ddHelper["createDraggedElementShortcut"]("", <any>undefined, <any>undefined);
    expect(ddHelper["fromIndex"]).toBe(2);
    expect(question.renderedTable.rows[5].isGhostRow).toBeTruthy();

    ddHelper.dropTarget = dropRow;
    ddHelper.isBottom = false;
    ddHelper["afterDragOver"](<any>undefined);
    expect(ddHelper["toIndex"]).toBe(0);
    expect(question.renderedTable.rows[2].row).toBe(dropRow);
    expect(question.renderedTable.rows[1].isGhostRow).toBeTruthy();
    expect(question.renderedTable.rows[1].row).toBe(draggedRow);

    ddHelper["doDrop"]();
    ddHelper.clear();
    expect(question.renderedTable.rows[1].row).toBe(question.visibleRows[0]);
    expect(question.renderedTable.rows[3].row).toBe(question.visibleRows[1]);
  });

  test("rows: check matrixdynamic d&d with expanded details, Bug#10472", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          allowRowReorder: true,
          name: "q",
          columns: ["Col1"],
          rowCount: 3,
          choices: ["item1", "item2", "item3"],
          "detailElements": [
            {
              "type": "text",
              "name": "a1",
            },
            {
              "type": "text",
              "name": "a2",
            }
          ],
          "detailPanelMode": "underRow",
        },
      ]
    });
    const question: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    survey.getQuestionByName("q")
  );

    const ddHelper = new DragDropMatrixRows(survey);

    const draggedRow = question.visibleRows[2];
    draggedRow.showDetailPanel();
    const dropRow = question.visibleRows[1];

    ddHelper["parentElement"] = question;
    ddHelper.draggedElement = draggedRow;
    ddHelper["onStartDrag"]();
    ddHelper["createDraggedElementShortcut"]("", <any>undefined, <any>undefined);
    expect(ddHelper["fromIndex"]).toBe(2);

    ddHelper.dropTarget = dropRow;
    ddHelper.isBottom = true;
    ddHelper["afterDragOver"](<any>undefined);

    ddHelper["doDrop"]();
    ddHelper.clear();
    expect(question.visibleRows[1].isDetailPanelShowing, "row[1] collapsed").toBeFalsy();
    expect(question.visibleRows[2].isDetailPanelShowing, "row[2] expanded").toBeFalsy();
  });

  test("rows: check matrixdynamic d&d with expanded detail panel", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          allowRowReorder: true,
          name: "q",
          columns: ["Col1"],
          rowCount: 3,
          choices: ["item1", "item2", "item3"],
          detailPanelMode: "underRow",
          detailElements: [
            {
              type: "text",
              name: "q1_detail",
            }
          ]
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
    expect(ddHelper["fromIndex"]).toBe(1);
    expect(question.renderedTable.rows[3].isGhostRow).toBeTruthy();

    ddHelper.dropTarget = dropRow;
    ddHelper.isBottom = true;
    ddHelper["afterDragOver"](<any>undefined);
    expect(ddHelper["toIndex"]).toBe(3);

    dropRow.showDetailPanel();
    ddHelper["afterDragOver"](<any>undefined);
    expect(ddHelper["toIndex"]).toBe(2);
  });

  test("rows: check matrixdynamic d&d between different matrices", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          allowRowReorder: true,
          name: "q1",
          columns: ["Col1"],
          defaultValue: [{ Col1: "item1" }, { Col1: "item2" }, { Col1: "item3" }],
          rowCount: 3,
          choices: ["item1", "item2", "item3"],
        },
        {
          type: "matrixdynamic",
          allowRowReorder: true,
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
    expect(ddHelper["fromIndex"]).toBe(1);
    expect(question1.renderedTable.rows[3].isGhostRow).toBeTruthy();

    ddHelper.dropTarget = dropRow;
    expect(ddHelper["toIndex"]).toBeNull();
    expect(question1.renderedTable.rows[3].isGhostRow).toBeTruthy();
    expect(question2.renderedTable.rows.length).toBe(6);

    allowDragDrop = true;
    ddHelper.isBottom = true;
    ddHelper["afterDragOver"](<any>undefined);
    expect(ddHelper["toIndex"]).toBe(2);
    expect(question2.renderedTable.rows[3].row).toBe(dropRow);
    expect(question2.renderedTable.rows.length).toBe(7);
    expect(question2.renderedTable.rows[4].isGhostRow).toBeTruthy();
    expect(question2.renderedTable.rows[4].row).toBe(draggedRow);

    ddHelper["doDrop"]();
    ddHelper.clear();

    // Verify row was moved correctly
    expect(question1.visibleRows.length, "First matrix has two rows left").toBe(2);
    expect(question2.visibleRows.length, "Second matrix has four rows").toBe(4);
    expect(question1.value, "Dragged row is gone from first matrix").toEqual([{ "Col1": "item1" }, { "Col1": "item3" }]);
    expect(question2.value, "Dragged row is now in second matrix").toEqual([{ "Col1": "item4" }, { "Col1": "item5" }, { "Col1": "item2" }, { "Col1": "item6" }]);
  });

  test("rows: check events matrixdynamic d&d between different matrices in detail panels", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "q1",
              "defaultValue": [
                {
                  "Col1": "1",
                  "q_detail": [
                    {
                      "Col1": "detail1"
                    },
                    {
                      "Col1": "detail2"
                    }
                  ]
                },
                {
                  "Col1": "2",
                  "q_detail": [
                    {
                      "Col1": "detail3"
                    },
                    {
                      "Col1": "detail4"
                    }
                  ]
                }
              ],
              "columns": [
                {
                  "name": "Col1"
                }
              ],
              "detailElements": [
                {
                  "type": "matrixdynamic",
                  "name": "q_detail",
                  "columns": [
                    {
                      "name": "Col1"
                    }
                  ],
                  "choices": [
                    "detail1",
                    "detail2"
                  ],
                  "cellType": "text",
                  "allowRowReorder": true
                }
              ],
              "detailPanelMode": "underRow",
              "choices": [
                "item1"
              ],
              "cellType": "text",
              "allowRowReorder": true
            }
          ]
        }
      ]
    });

    const changes: string[] = [];
    survey.onValueChanged.add((_, o) => changes.push(o.value));

    const q = survey.getQuestionByName("q1");
    q.visibleRows[0].showDetailPanel();
    q.visibleRows[1].showDetailPanel();

    const question1Detail: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    q.visibleRows[0].detailPanel.getQuestionByName("q_detail")
  );
    const question2Detail: QuestionMatrixDynamicModel = <QuestionMatrixDynamicModel>(
    q.visibleRows[1].detailPanel.getQuestionByName("q_detail")
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
    expect(Object.keys(matrixRowMap).length, "matrixRowMap should contain rows from detail matrices").toBe(expectedRowCount);

    const row1id = question1Detail.visibleRows[0].id;
    const row2id = question2Detail.visibleRows[1].id;

    expect(matrixRowMap[row1id].matrix == question1Detail, "question1Detail should be in matrixRowMap").toBeTruthy();
    expect(matrixRowMap[row2id].matrix == question2Detail, "question2Detail should be in matrixRowMap").toBeTruthy();

    allowDragDrop = true;
    ddHelper.isBottom = true;
    ddHelper["afterDragOver"](<any>undefined);

    ddHelper["doDrop"]();
    ddHelper.clear();

    expect(question1Detail.value, "Dragged row is gone from first matrix").toEqual([{ "Col1": "detail2" }]);
    expect(question2Detail.value, "Dragged row is now in second matrix").toEqual([{ "Col1": "detail3" }, { "Col1": "detail4" }, { "Col1": "detail1" }]);

    const firstEvent = changes[0];
    const lastEvent = changes[changes.length - 1];
    expect(firstEvent[0]["q_detail"].length, "first delete (source changed)").toBe(1);
    expect(firstEvent[1]["q_detail"].length, "first delete (target not changed)").toBe(2);
    expect(lastEvent[0]["q_detail"].length, "second insert (source not changed)").toBe(1);
    expect(lastEvent[1]["q_detail"].length, "second insert (target changed)").toBe(3);
  });

  test("ranking selectToRank for ChoicesDND(creator)", () => {
    const json = {
      elements: [
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
    expect(ddHelper["getChoices"]().length).toBe(4);
  });

  test("DragDropDOMAdapter: getNodeIndexInParent", () => {
    const parent = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");

    parent.appendChild(child1);
    parent.appendChild(child2);

    const ddengine: any = null;
    let domAdapter: any = new DragDropDOMAdapter(ddengine);
    expect(domAdapter.getNodeIndexInParent(child1)).toBe(0);
    expect(domAdapter.getNodeIndexInParent(child2)).toBe(1);
  });

  test("DragDropDOMAdapter: insertNodeToParentAtIndex", () => {
    const parent = document.createElement("div");
    const child1 = document.createElement("div");
    const child2 = document.createElement("div");

    parent.appendChild(child1);

    const ddengine: any = null;
    let domAdapter: any = new DragDropDOMAdapter(ddengine);
    domAdapter.insertNodeToParentAtIndex(parent, child2, 0);

    expect(domAdapter.getNodeIndexInParent(child2)).toBe(0);
    expect(domAdapter.getNodeIndexInParent(child1)).toBe(1);
  });

  test("check rootContainer", () => {
    let h1 = document.createElement("h1");
    let h2 = document.createElement("h2");
    let survey:any = { rootElement: h1 };
    let creator:any = { rootElement: h2 };
    let dd: any = new DragDropChoices(survey);
    expect(dd.getRootElement(survey)).toBe(h1);
    expect(dd.getRootElement(survey, creator)).toBe(h2);
  });

  test("getChoices", () => {
    let ddHelper = new DragDropChoices(undefined);

    let questionSelectBase = getNewQuestion();
    ddHelper["parentElement"] = <any>questionSelectBase;
    expect(ddHelper["getChoices"]()).toEqual(questionSelectBase.visibleChoices);

    let questionRanking = getNewRankingQuestion();
    ddHelper["parentElement"] = <any>questionRanking;
    expect(ddHelper["getChoices"]()).toEqual(questionRanking.rankingChoices);
    questionRanking.selectToRankEnabled = true;
    ddHelper["parentElement"] = <any>questionRanking;
    expect(ddHelper["getChoices"]()).toEqual(questionRanking.unRankingChoices);
  });

  test("DragDropMatrixRows matrix row drag and drop", () => {
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
    expect(Object.keys(matrixRowMap).length, "Only matrix1 rows should be in matrixRowMap").toBe(matrix1.visibleRows.length);

    for (const key in matrixRowMap) {
      const { matrix } = matrixRowMap[key];
      expect(matrix, "All rows should belong to matrix1").toBe(matrix1);
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
    expect(Object.keys(matrixRowMap2).length, "matrixRowMap should contain rows from both matrix1 and matrix3").toBe(expectedRowCount);

    const matricesInMap = new Set<QuestionMatrixDynamicModel>();
    for (const key in matrixRowMap2) {
      matricesInMap.add(matrixRowMap2[key].matrix);
    }

    expect(matricesInMap.has(matrix1), "matrix1 should be in matrixRowMap").toBeTruthy();
    expect(matricesInMap.has(matrix3), "matrix3 should be in matrixRowMap").toBeTruthy();
    expect(matricesInMap.has(matrix2), "matrix2 should not be in matrixRowMap").toBeFalsy();
  });

  test("rows: check matrixdynamic d&d to empty matrix", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic",
          allowRowReorder: true,
          name: "q1",
          columns: ["Col1"],
          defaultValue: [{ Col1: "item1" }, { Col1: "item2" }, { Col1: "item3" }],
          rowCount: 3,
          choices: ["item1", "item2", "item3"],
        },
        {
          type: "matrixdynamic",
          allowRowReorder: true,
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
    expect(ddHelper["fromIndex"]).toBe(1);
    expect(question1.renderedTable.rows[3].isGhostRow).toBeTruthy();

    // Set drop target to empty matrix (no specific row)
    ddHelper.dropTarget = question2;
    expect(ddHelper["toIndex"]).toBeNull();
    expect(question1.renderedTable.rows[3].isGhostRow).toBeTruthy();
    expect(question2.renderedTable.rows.length).toBe(1);

    allowDragDrop = true;
    ddHelper.isBottom = true;
    ddHelper["afterDragOver"](<any>undefined);
    expect(ddHelper["toIndex"]).toBe(0);
    expect(question2.renderedTable.rows.length).toBe(2);
    expect(question2.renderedTable.rows[0].isGhostRow).toBeTruthy();
    expect(question2.renderedTable.rows[0].row).toBe(draggedRow);

    ddHelper["doDrop"]();
    ddHelper.clear();

    // Verify row was moved correctly to empty matrix
    expect(question1.visibleRows.length, "First matrix has two rows left").toBe(2);
    expect(question2.visibleRows.length, "Second matrix has one row").toBe(1);
    expect(question1.value, "Dragged row is gone from first matrix").toEqual([{ "Col1": "item1" }, { "Col1": "item3" }]);
    expect(question2.value, "Dragged row is now in second matrix").toEqual([{ "Col1": "item2" }]);
  });
});

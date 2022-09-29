import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { DragDropSurveyElements } from "../src/dragdrop/survey-elements";
import { DragDropChoices } from "../src/dragdrop/choices";
import { DragDropRankingChoices } from "../src/dragdrop/ranking-choices";
import { SurveyModel } from "../src/survey";
import { ItemValue } from "../src/itemvalue";
import { Question } from "../src/question";
import { QuestionSelectBase } from "../src/question_baseselect";
import { DragDropCore } from "../src/dragdrop/core";

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
  const drop = ddHelper["drop"];
  const afterDragOver = ddHelper["afterDragOver"].bind(ddHelper);

  let question = getNewQuestion();
  let item1 = question.choices[0];
  let item2 = question.choices[1];
  let item3 = question.choices[2];
  let item4 = question.choices[3];

  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item1;
  ddHelper["dropTarget"] = <any>item3;
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  afterDragOver(dropTargetNode);
  assert.deepEqual(
    question.visibleChoices.map((c) => c.value),
    ["item2", "item3", "item1", "item4"]
  );
  ddHelper["allowDropHere"] = true;
  drop();
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
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  afterDragOver(dropTargetNode);
  assert.deepEqual(
    question.visibleChoices.map((c) => c.value),
    ["item1", "item2", "item4", "item3"]
  );
  ddHelper["allowDropHere"] = true;
  drop();
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
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  afterDragOver(dropTargetNode);
  assert.deepEqual(
    question.visibleChoices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );
  ddHelper["allowDropHere"] = true;
  drop();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );
});

QUnit.test("calculateVerticalMiddleOfHTMLElement", function (assert) {
  let ddHelper = new DragDropSurveyElements(null);
  const calculateVerticalMiddleOfHTMLElement = ddHelper["calculateVerticalMiddleOfHTMLElement"];
  const testElement = document.body.appendChild(document.createElement("div"));
  (<any>testElement).getBoundingClientRect = () => ({
    y: 10,
    height: 100,
  });

  let result = calculateVerticalMiddleOfHTMLElement(testElement);
  assert.deepEqual(result, 60);
});

QUnit.test("calculateIsBottom", function (assert) {
  let ddHelper = new DragDropSurveyElements(null);
  const testElement = document.body.appendChild(document.createElement("div"));
  (<any>testElement).getBoundingClientRect = () => ({
    y: 100,
    height: 100,
  });

  let result = ddHelper["calculateIsBottom"](150, testElement);
  assert.equal(result, true);

  result = ddHelper["calculateIsBottom"](100, testElement);
  assert.equal(result, false);
});

QUnit.test("calculateIsEdge", function (assert) {
  DragDropSurveyElements.edgeHeight = 20;
  let ddHelper = new DragDropSurveyElements(null);
  const testElement = document.body.appendChild(document.createElement("div"));
  (<any>testElement).getBoundingClientRect = () => ({
    top: 100,
    bottom: 300
  });

  let result = ddHelper["calculateIsEdge"](testElement, 100);
  assert.equal(result, true);

  result = ddHelper["calculateIsEdge"](testElement, 121);
  assert.equal(result, false);
  result = ddHelper["calculateIsEdge"](testElement, 150);
  assert.equal(result, false);
  result = ddHelper["calculateIsEdge"](testElement, 279);
  assert.equal(result, false);

  result = ddHelper["calculateIsEdge"](testElement, 280);
  assert.equal(result, true);
});

QUnit.test("calculateIsRight", function (assert) {
  let ddHelper = new DragDropSurveyElements(null);
  const testElement = document.body.appendChild(document.createElement("div"));
  (<any>testElement).getBoundingClientRect = () => ({
    x: 100,
    width: 100,
  });

  let result = ddHelper["calculateIsRight"](150, testElement);
  assert.equal(result, true);

  result = ddHelper["calculateIsRight"](100, testElement);
  assert.equal(result, false);
});

// QUnit.test("calculateIsRight", function (
//   assert
// ) {
//   const survey = new SurveyModel(
//     {
//       "logoPosition": "right",
//       "pages": [
//         {
//           "name": "page1",
//           "elements": [
//             {
//               "type": "text",
//               "name": "question1"
//             },
//             {
//               "type": "text",
//               "name": "question2",
//               "startWithNewLine": false
//             },
//             {
//               "type": "text",
//               "name": "question3"
//             }
//           ]
//         }
//       ]
//     }
//   );
//   let dropTarget = survey.getQuestionByName("question2");
//   let draggedElement = survey.getQuestionByName("question3");

//   const ddHelper: any = new DragDropSurveyElements(<any>survey);

//   ddHelper.parentElement = survey.pages[0];
//   ddHelper.dropTarget = dropTarget;
//   ddHelper.draggedElement = draggedElement;

//   let isRight = ddHelper.calculateIsRight();

//   assert.equal(isRight, true);
// });

QUnit.test("dropTargetDataAttributeName for choices", function (assert) {
  let ddHelper: any = new DragDropChoices(null);

  ddHelper.draggedElement = new ItemValue(null);
  assert.equal(
    ddHelper.dropTargetDataAttributeName,
    "[data-sv-drop-target-item-value]"
  );
});

QUnit.test("dropTargetDataAttributeName for questions", function (assert) {
  let ddHelper: any = new DragDropSurveyElements(null);

  ddHelper.draggedElement = new Question(null);
  assert.equal(
    ddHelper.dropTargetDataAttributeName,
    "[data-sv-drop-target-survey-element]"
  );
});

QUnit.test("choices: onBeforeDrop and onAfterDrop events", function (assert) {
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
  ddHelper.onBeforeDrop.add((sender, options) => {
    beforeCount++;
  });
  ddHelper.onAfterDrop.add((sender, options) => {
    afterCount++;
    draggedElementParent = options.draggedElement;
  });
  ddHelper.parentElement = question;
  ddHelper.draggedElement = question.choices[2];

  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  ddHelper["drop"]();
  assert.equal(beforeCount, 1);
  assert.equal(afterCount, 1);
  assert.equal(draggedElementParent.name, "q");
});

QUnit.test("surveyelement: onBeforeDrop and onAfterDrop events", function (
  assert
) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
      },
      {
        type: "text",
        name: "q2",
      },
    ],
  });
  const question1 = survey.getQuestionByName("q1");
  const question2 = survey.getQuestionByName("q2");
  let beforeCount = 0;
  let afterCount = 0;
  let draggedElement;

  const ddHelper: any = new DragDropSurveyElements(survey);
  ddHelper.onBeforeDrop.add((sender, options) => {
    beforeCount++;
  });
  ddHelper.onAfterDrop.add((sender, options) => {
    afterCount++;
    draggedElement = options.draggedElement;
  });
  ddHelper.parentElement = survey.pages[0];
  ddHelper.dropTarget = {};
  ddHelper.draggedElement = question2;
  ddHelper.dropTarget = question1;

  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  ddHelper["drop"]();
  assert.equal(beforeCount, 1);
  assert.equal(afterCount, 1);
  assert.equal(draggedElement.name, "q2");

  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = false;
  ddHelper["drop"]();
  assert.equal(beforeCount, 1);
  assert.equal(afterCount, 1);
});

QUnit.test("allowDropHere", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "text",
        name: "q1",
      },
      {
        type: "text",
        name: "q2",
      },
    ],
  });
  const question = survey.getQuestionByName("q2");
  let beforeCount = 0;
  let afterCount = 0;

  const ddHelper: any = new DragDropSurveyElements(survey);
  ddHelper.onBeforeDrop.add((sender, options) => {
    beforeCount++;
  });
  ddHelper.onAfterDrop.add((sender, options) => {
    afterCount++;
  });
  ddHelper.parentElement = survey.pages[0];
  ddHelper.dropTarget = {};
  ddHelper.draggedElement = question;

  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = false;
  ddHelper["drop"]();
  assert.equal(beforeCount, 0);
  assert.equal(afterCount, 0);
});

QUnit.test("SurveyElements: isDropTargetValid", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "paneldynamic",
        name: "q1",
      },
      {
        type: "text",
        name: "q2",
      }
    ],
  });
  const pd = survey.getQuestionByName("q1");
  const ddHelper: any = new DragDropSurveyElements(survey);

  ddHelper.dropTarget = null;
  assert.equal(ddHelper.isDropTargetValid(null), false, "dropTarget should be");

  ddHelper.draggedElement = pd;
  ddHelper.dropTarget = pd;
  assert.equal(ddHelper.isDropTargetValid(), false, "can't drop to itself");
  ddHelper.dropTarget = pd.template;
  assert.equal(ddHelper.isDropTargetValid(), false, "can't drop to itself (pd template)");

  ddHelper.draggedElement = survey.getQuestionByName("q2");
  ddHelper.dropTarget = pd;
  assert.equal(ddHelper.isDropTargetValid(), true, "dropTarget is valid");

  ddHelper.dropTarget = pd.template;
  assert.equal(ddHelper.isDropTargetValid(), true, "dropTarget is valid (pd template)");
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
  dndRanking.doClear();

  assert.equal(count, 2);
  count = 0;

  dndRanking.parentElement.longTap = true;
  dndRanking.doClear();
  assert.equal(count, 2);
});

QUnit.test("DragDrop shortcutCoordinates", function (assert) {
  let dnd: any = new DragDropChoices(null);

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

QUnit.test("surveyelement: calcTargetRowMultiple for paneldynamic", function (
  assert
) {
  const survey = new SurveyModel({
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "paneldynamic",
            "name": "paneldynamic1",
            "templateElements": [
              {
                "type": "text",
                "name": "text1"
              },
              {
                "type": "text",
                "name": "text2",
                "startWithNewLine": false
              }
            ]
          }
        ]
      }
    ]
  });

  const paneldynamic1 = survey.getQuestionByName("paneldynamic1");
  const text1 = paneldynamic1.template.elements[0];
  const text2 = paneldynamic1.template.elements[1];

  const ddHelper: any = new DragDropSurveyElements(<any>survey);
  ddHelper.isEdge = true;
  ddHelper.draggedElement = text1;
  ddHelper.dropTarget = text2;

  assert.equal(ddHelper["calcTargetRowMultiple"](), true);
});

QUnit.test("surveyelement: calcTargetRowMultiple for paneldynamic 2", function (
  assert
) {
  const json = {
    "logoPosition": "right",
    "pages": [
      {
        "name": "page1",
        "elements": [
          {
            "type": "paneldynamic",
            "name": "question2",
            "title": "paneldynamic",
            "templateElements": [
              {
                "type": "panel",
                "name": "panel1",
                "elements": [
                  {
                    "type": "rating",
                    "name": "question3"
                  },
                  {
                    "type": "rating",
                    "name": "question4",
                    "startWithNewLine": false
                  }
                ],
                "title": "panel"
              }
            ]
          },
          {
            "type": "rating",
            "name": "question1"
          }
        ]
      }
    ]
  };
  const survey = new SurveyModel(json);

  const paneldynamic = survey.getQuestionByName("question2");
  const question3 = paneldynamic.template.elements[0].elements[0];
  const question1 = survey.getQuestionByName("question1");

  question3.__page = survey.pages[0];

  const ddHelper: any = new DragDropSurveyElements(<any>survey);
  ddHelper.isEdge = true;
  ddHelper.draggedElement = question1;
  ddHelper.dropTarget = question3;

  //debugger;

  ddHelper["calcTargetRowMultiple"]();

  assert.ok(ddHelper.dropTarget.__page);
});
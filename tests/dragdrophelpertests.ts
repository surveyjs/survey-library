import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { DragDropSurveyElements } from "../src/dragdrop/survey-elements";
import { DragDropChoices } from "../src/dragdrop/choices";
import { DragDropRankingChoices } from "../src/dragdrop/ranking-choices";
import { SurveyModel } from "../src/survey";
import { ItemValue } from "../src/itemvalue";
import { Question } from "../src/question";
import { QuestionSelectBase } from "../src/question_baseselect";

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

QUnit.test("calculateMiddleOfHTMLElement", function (assert) {
  let ddHelper = new DragDropSurveyElements(null);
  const calculateMiddleOfHTMLElement = ddHelper["calculateMiddleOfHTMLElement"];
  const testElement = document.body.appendChild(document.createElement("div"));
  (<any>testElement).getBoundingClientRect = () => ({
    y: 10,
    height: 100,
  });

  let result = calculateMiddleOfHTMLElement(testElement);
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
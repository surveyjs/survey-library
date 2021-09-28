import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { DragDropSurveyElements } from "../src/dragdrop/survey-elements";
import { DragDropChoices } from "../src/dragdrop/choices";
import { SurveyModel } from "../src/survey";
import { ItemValue } from "../src/itemvalue";
import { Question } from "../src/question";

export default QUnit.module("DragDropHelper Tests");

QUnit.test("drop", function (assert) {
  let ddHelper = new DragDropChoices(null);
  const drop = ddHelper["drop"];

  debugger;
  const item1 = { value: "item1" };
  const item2 = { value: "item2" };
  const item3 = { value: "item3" };
  const item4 = { value: "item4" };

  let question = { choices: [item1, item2, item3, item4], visibleChoices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = true;
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item1;
  ddHelper["dropTarget"] = <any>item3;
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  drop();

  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item3", "item1", "item4"]
  );

  question = { choices: [item1, item2, item3, item4], visibleChoices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = false;
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item1;
  ddHelper["dropTarget"] = <any>item3;
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  drop();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );

  question = { choices: [item1, item2, item3, item4], visibleChoices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = true;
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item4;
  ddHelper["dropTarget"] = <any>item3;
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  drop();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item1", "item2", "item3", "item4"]
  );

  question = { choices: [item1, item2, item3, item4], visibleChoices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = false;
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item4;
  ddHelper["dropTarget"] = <any>item3;
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  drop();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item1", "item2", "item4", "item3"]
  );

  question = { choices: [item1, item2, item3, item4], visibleChoices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = true;
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item1;
  ddHelper["dropTarget"] = <any>item2;
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  drop();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );
  question = { choices: [item1, item2, item3, item4], visibleChoices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = false;
  ddHelper["parentElement"] = <any>question;
  ddHelper["draggedElement"] = <any>item1;
  ddHelper["dropTarget"] = <any>item2;
  ddHelper["draggedElementShortcut"] = document.body.appendChild(
    document.createElement("div")
  );
  ddHelper["allowDropHere"] = true;
  drop();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item1", "item2", "item3", "item4"]
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
    y: 100,
    height: 100,
  });

  let result = ddHelper["calculateIsEdge"](testElement, 100);
  assert.equal(result, true);

  result = ddHelper["calculateIsEdge"](testElement, 131);
  assert.equal(result, false);
  result = ddHelper["calculateIsEdge"](testElement, 150);
  assert.equal(result, false);
  result = ddHelper["calculateIsEdge"](testElement, 169);
  assert.equal(result, false);

  result = ddHelper["calculateIsEdge"](testElement, 200);
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
  const question = survey.getQuestionByName("q2");
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
  ddHelper.draggedElement = question;

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

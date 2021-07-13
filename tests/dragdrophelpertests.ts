import { QuestionRadiogroupModel } from "../src/question_radiogroup";
import { DragDropHelper } from "../src/dragdrophelper";
import { SurveyModel } from "../src/survey";
import { ItemValue } from "../src/itemvalue";
import { Question } from "../src/question";

export default QUnit.module("DragDropHelper Tests");

QUnit.test("doDropItemValue", function(assert) {
  let ddHelper = new DragDropHelper(null);
  const doDropItemValue = ddHelper["doDropItemValue"];

  const item1 = { value: "item1" };
  const item2 = { value: "item2" };
  const item3 = { value: "item3" };
  const item4 = { value: "item4" };

  let question = { choices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = true;
  ddHelper["itemValueParentQuestion"] = <any>question;
  ddHelper["draggedSurveyElement"] = <any>item1;
  ddHelper["dropTargetSurveyElement"] = <any>item3;
  doDropItemValue();

  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item3", "item1", "item4"]
  );

  question = { choices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = false;
  ddHelper["itemValueParentQuestion"] = <any>question;
  ddHelper["draggedSurveyElement"] = <any>item1;
  ddHelper["dropTargetSurveyElement"] = <any>item3;
  doDropItemValue();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );

  question = { choices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = true;
  ddHelper["itemValueParentQuestion"] = <any>question;
  ddHelper["draggedSurveyElement"] = <any>item4;
  ddHelper["dropTargetSurveyElement"] = <any>item3;
  doDropItemValue();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item1", "item2", "item3", "item4"]
  );

  question = { choices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = false;
  ddHelper["itemValueParentQuestion"] = <any>question;
  ddHelper["draggedSurveyElement"] = <any>item4;
  ddHelper["dropTargetSurveyElement"] = <any>item3;
  doDropItemValue();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item1", "item2", "item4", "item3"]
  );

  question = { choices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = true;
  ddHelper["itemValueParentQuestion"] = <any>question;
  ddHelper["draggedSurveyElement"] = <any>item1;
  ddHelper["dropTargetSurveyElement"] = <any>item2;
  doDropItemValue();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item2", "item1", "item3", "item4"]
  );
  question = { choices: [item1, item2, item3, item4] };
  ddHelper["isBottom"] = false;
  ddHelper["itemValueParentQuestion"] = <any>question;
  ddHelper["draggedSurveyElement"] = <any>item1;
  ddHelper["dropTargetSurveyElement"] = <any>item2;
  doDropItemValue();
  assert.deepEqual(
    question.choices.map((c) => c.value),
    ["item1", "item2", "item3", "item4"]
  );
});

QUnit.test("calculateMiddleOfHTMLElement", function(assert) {
  let ddHelper = new DragDropHelper(null);
  const calculateMiddleOfHTMLElement = ddHelper["calculateMiddleOfHTMLElement"];
  const testElement = document.createElement("div");
  (<any>testElement).getBoundingClientRect = () => ({
    y: 10,
    height: 100,
  });

  let result = calculateMiddleOfHTMLElement(testElement);
  assert.deepEqual(result, 60);
});

QUnit.test("calculateIsBottom", function(assert) {
  let ddHelper = new DragDropHelper(null);
  const testElement = document.createElement("div");
  (<any>testElement).getBoundingClientRect = () => ({
    y: 100,
    height: 100,
  });

  let result = ddHelper["calculateIsBottom"](testElement, 150);
  assert.equal(result, true);

  result = ddHelper["calculateIsBottom"](testElement, 100);
  assert.equal(result, false);
});

QUnit.test("calculateIsEdge", function(assert) {
  DragDropHelper.edgeHeight = 20;
  let ddHelper = new DragDropHelper(null);
  const testElement = document.createElement("div");
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

QUnit.test("isItemValueBeingDragged for itemvalue and it descendants", function(
  assert
) {
  let ddHelper: any = new DragDropHelper(null);

  ddHelper.draggedSurveyElement = new ItemValue(null);
  assert.equal(ddHelper.isItemValueBeingDragged(), true);
});

QUnit.test(
  "dropTargetDataAttributeName for itemvalue and it descendants",
  function(assert) {
    let ddHelper: any = new DragDropHelper(null);

    ddHelper.draggedSurveyElement = new ItemValue(null);
    assert.equal(
      ddHelper.dropTargetDataAttributeName,
      "[data-svc-drop-target-item-value]"
    );

    ddHelper.draggedSurveyElement = new Question(null);
    assert.equal(
      ddHelper.dropTargetDataAttributeName,
      "[data-svc-drop-target-element-name]"
    );
  }
);

QUnit.test("itemvalue: onBeforeDrop and onAfterDrop events", function(assert) {
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

  const ddHelper: any = new DragDropHelper(survey);
  ddHelper.onBeforeDrop.add((sender, options) => {
    beforeCount++;
  });
  ddHelper.onAfterDrop.add((sender, options) => {
    afterCount++;
    draggedElementParent = options.draggedElement;
  });
  ddHelper.itemValueParentQuestion = question;
  ddHelper.draggedSurveyElement = question.choices[2];

  ddHelper["doDropItemValue"]();
  assert.equal(beforeCount, 1);
  assert.equal(afterCount, 1);
  assert.equal(draggedElementParent.name, "q");
});

QUnit.test("surveyelement: onBeforeDrop and onAfterDrop events", function(
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

  const ddHelper: any = new DragDropHelper(survey);
  ddHelper.onBeforeDrop.add((sender, options) => {
    beforeCount++;
  });
  ddHelper.onAfterDrop.add((sender, options) => {
    afterCount++;
    draggedElement = options.draggedElement;
  });
  ddHelper.pageOrPanel = survey.pages[0];
  ddHelper.dropTargetSurveyElement = {};
  ddHelper.draggedSurveyElement = question;

  ddHelper["doDropSurveyElement"]();
  assert.equal(beforeCount, 1);
  assert.equal(afterCount, 1);
  assert.equal(draggedElement.name, "q2");
});

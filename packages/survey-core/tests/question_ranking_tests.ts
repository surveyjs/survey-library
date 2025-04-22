import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRankingModel } from "../src/question_ranking";
import { SurveyModel } from "../src/survey";
import { settings as Settings, settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { sassFalse } from "sass";

export default QUnit.module("question ranking");

QUnit.test("Ranking: Base ", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
      },
    ],
  });
  var rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q1");

  assert.deepEqual(
    rankingQuestion.rankingChoices.map((c)=>c.value),
    ["a", "b", "c"],
    "rankingChoices returns visibleChoices if empty value"
  );

  rankingQuestion.value = ["c", "b", "a"];
  assert.deepEqual(
    rankingQuestion.rankingChoices.map((c)=>c.value),
    ["c", "b", "a"],
    "rankingChoices returns visibleChoices if empty value"
  );
});

QUnit.test("Ranking: predefined Survey data", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
      },
    ],
  });
  survey.data = { q1: ["b", "a", "c"] };
  var q1 = <QuestionRankingModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, ["b", "a", "c"]);
  assert.deepEqual(q1.isEmpty(), false);
  assert.deepEqual(
    q1.rankingChoices.map(item => item.value),
    ["b", "a", "c"]
  );

  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: [
          {
            value: "1",
            text: "a",
          },
          {
            value: "2",
            text: "b",
          },
          {
            value: "3",
            text: "c",
          },
        ],
      },
    ],
  });
  survey.data = { q1: ["3", "2", "1"] };
  var q1 = <QuestionRankingModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, ["3", "2", "1"]);
  assert.deepEqual(q1.isEmpty(), false);
  assert.deepEqual(
    q1.rankingChoices.map(item => item.text),
    ["c", "b", "a"]
  );
  assert.deepEqual(
    q1.rankingChoices.map(item => item.value),
    ["3", "2", "1"]
  );
});

QUnit.test("Ranking: check removing other from visibleChoices", function(
  assert
) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
        hasOther: true,
      },
    ],
  });
  var rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q1");
  assert.deepEqual(rankingQuestion.rankingChoices.length, 3);
});

QUnit.test("Ranking: Carry Forward", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5] },
      {
        type: "ranking",
        name: "q2",
        choicesFromQuestion: "q1",
        choicesFromQuestionMode: "selected",
      },
    ],
  });
  var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  var q2 = <QuestionRankingModel>survey.getQuestionByName("q2");

  assert.deepEqual(q2.rankingChoices, []);
  assert.deepEqual(q2.isEmpty(), true);

  q1.value = [2, 3];
  q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
  assert.deepEqual(q2.isEmpty(), false);
  assert.deepEqual(survey.data, {
    q1: [2, 3],
    q2: [2, 3],
  });

  // ranking question with only one choice doesn't make sense
  q1.value = ["2"];
  assert.deepEqual(q2.isEmpty(), false);
  assert.deepEqual(survey.data, {
    q1: [2],
  });

  q1.value = [];
  assert.deepEqual(q2.isEmpty(), true);
  assert.deepEqual(
    q2.rankingChoices.map(item => item.text),
    []
  );

  q1.value = [2, 3];
  q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
  assert.deepEqual(q2.isEmpty(), false);
  assert.deepEqual(survey.data, {
    q1: [2, 3],
    q2: [2, 3],
  });
});
QUnit.test("Ranking: Carry Forward and hasOther", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5], hasOther: true },
      {
        type: "ranking",
        name: "q2",
        choicesFromQuestion: "q1",
        choicesFromQuestionMode: "selected",
      },
    ],
  });
  var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  var q2 = <QuestionRankingModel>survey.getQuestionByName("q2");

  assert.deepEqual(q2.rankingChoices, []);
  assert.deepEqual(q2.isEmpty(), true);

  q1.value = [2, 3, "other"];
  assert.equal(q2.visibleChoices.length, 2, "2, 3 other is empty");
  q1.comment = "someText";
  assert.equal(q2.visibleChoices.length, 3, "2, 3 and other");
  assert.equal(q2.visibleChoices[2].value, "other", "other value");
  assert.equal(q2.visibleChoices[2].text, "someText", "other text");
});
QUnit.test("Ranking: Carry Forward and unrankIfChoicesChanged", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5], hasOther: true },
      {
        type: "ranking",
        name: "q2",
        choicesFromQuestion: "q1",
        choicesFromQuestionMode: "selected",
      },
    ],
  });
  var checkboxQuestion = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  var rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q2");

  checkboxQuestion.value = [1];
  checkboxQuestion.value = [1, 2];
  assert.equal(rankingQuestion.value.length, 0, "rank items by default");

  checkboxQuestion.value = [1, 2, 3];
  assert.equal(rankingQuestion.value.length, 0, "unrank items after choices changed");

  rankingQuestion["isValueSetByUser"] = true;
  rankingQuestion.value = [1, 2, 3];
  checkboxQuestion.value = [1, 2];
  assert.equal(rankingQuestion.value.length, 2, "after user's arrengement unrank should stop working");
});

QUnit.test("Ranking: Carry Forward: Default Value", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        "type": "checkbox",
        "name": "q1",
        "defaultValue": [1, 2, 3],
        "choices": [1, 2, 3, 4]
      },
      {
        "type": "ranking",
        "name": "q2",
        "defaultValue": [1, 2, 3],
        "choicesFromQuestion": "q1",
        "choicesFromQuestionMode": "selected"
      }
    ]
  });
  var q1 = <QuestionCheckboxModel>survey.getQuestionByName("q1");
  var q2 = <QuestionRankingModel>survey.getQuestionByName("q2");

  assert.deepEqual(survey.data, {
    q1: [1, 2, 3],
    q2: [1, 2, 3],
  });

  q1.value = [1, 2];

  assert.deepEqual(survey.data, {
    q1: [1, 2],
    q2: [1, 2],
  });
});

QUnit.test("Ranking: Carry Forward: Data", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        "type": "checkbox",
        "name": "q1",
        "choices": [1, 2, 3, 4, 5]
      },
      {
        "type": "ranking",
        "name": "q2",
        "choicesFromQuestion": "q1",
        "choicesFromQuestionMode": "selected"
      }
    ]
  });

  survey.data = {
    "q1": [1, 2, 3],
    "q2": [3, 2, 1]
  };

  assert.deepEqual(survey.data, {
    q1: [1, 2, 3],
    q2: [3, 2, 1],
  });
});

QUnit.test("Ranking: CorrectAnswer, Bug#3720", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b"],
        correctAnswer: ["b", "a"]
      },
    ],
  });
  var q = <QuestionRankingModel>survey.getQuestionByName("q1");
  q.value = ["a", "b"];
  assert.equal(q.isAnswerCorrect(), false, "Answer is not correct");
  q.value = ["b", "a"];
  assert.equal(q.isAnswerCorrect(), true, "Answer is correct");
});

QUnit.test("Ranking: ReadOnlyMode ", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["a", "b", "c"],
      },
    ],
  });

  var target = document.createElement("div");
  var q = <QuestionRankingModel>survey.getQuestionByName("q");
  var choise = q.choices[0];

  assert.equal(q["isAllowStartDrag"](target, choise), true);

  survey.mode = "display";
  assert.equal(q["isAllowStartDrag"](target, choise), false);

  survey.mode = "edit";
  assert.equal(q["isAllowStartDrag"](target, choise), true);
  choise.enabled = false;
  assert.equal(q["isAllowStartDrag"](target, choise), false);
});

QUnit.test("Ranking: design mode", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["a", "b", "c"],
      },
    ],
  });

  var upCalled = 0, downCalled = 0, preventDefaultCalled = 0;
  var q = <QuestionRankingModel>survey.getQuestionByName("q");
  q["focusItem"] = () => {};
  q.dragDropRankingChoices = {
    reorderRankedItem: (question, fromIndex: number, toIndex: number) => {
      if(fromIndex < toIndex) {
        downCalled++;
      } else if(fromIndex > toIndex) {
        upCalled++;
      }
    }
  } as any;
  function preventDefault() { preventDefaultCalled++; }

  q.handleKeydown(<any>{ key: "ArrowUp", preventDefault: preventDefault }, q.choices[1]);
  assert.equal(upCalled, 1);
  assert.equal(downCalled, 0);
  assert.equal(preventDefaultCalled, 1);

  q.handleKeydown(<any>{ key: "ArrowDown", preventDefault: preventDefault }, q.choices[1]);
  assert.equal(upCalled, 1);
  assert.equal(downCalled, 1);
  assert.equal(preventDefaultCalled, 2);

  survey["_isDesignMode"] = true;
  q.handleKeydown(<any>{ key: "ArrowUp", preventDefault: preventDefault }, q.choices[1]);
  q.handleKeydown(<any>{ key: "ArrowDown", preventDefault: preventDefault }, q.choices[1]);
  assert.equal(upCalled, 1);
  assert.equal(downCalled, 1);
  assert.equal(preventDefaultCalled, 2);
});

QUnit.test("Ranking: selectToRank key navigation with animation", function (assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["a", "b", "c"],
        selectToRankEnabled: true
      },
    ],
  });

  const q = <QuestionRankingModel>survey.getAllQuestions()[0];
  q["focusItem"] = () => {};
  (window as any).event = { preventDefault: () => {} };

  settings.animationEnabled = true;
  q.handleKeydown(<any>{ key: " ", preventDefault: () => {} }, q.choices[1]);
  assert.deepEqual(q.unRankingChoices.map((item) => item.value), ["a", "c"]);
  assert.deepEqual(q.rankingChoices.map((item) => item.value), ["b"]);

  q.handleKeydown(<any>{ key: " ", preventDefault: () => {} }, q.choices[0]);
  assert.deepEqual(q.unRankingChoices.map((item) => item.value), ["c"]);
  assert.deepEqual(q.rankingChoices.map((item) => item.value), ["b", "a"]);

  q.handleKeydown(<any>{ key: " ", preventDefault: () => {} }, q.choices[1]);
  assert.deepEqual(q.unRankingChoices.map((item) => item.value), ["b", "c"]);
  assert.deepEqual(q.rankingChoices.map((item) => item.value), ["a"]);

  q.handleKeydown(<any>{ key: " ", preventDefault: () => {} }, q.choices[0]);
  assert.deepEqual(q.unRankingChoices.map((item) => item.value), ["a", "b", "c"]);
  assert.deepEqual(q.rankingChoices.map((item) => item.value), []);

  (window as any).event = undefined;
  settings.animationEnabled = false;
});

QUnit.test("Ranking: check renderedRankingChoices are updated when rankingChoices changing", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["a", "b", "c"],
      },
    ],
  });
  const question = <QuestionRankingModel>survey.getAllQuestions()[0];
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["a", "b", "c"]);
  question.value = ["b", "a", "c"];
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["b", "a", "c"]);
  question.value = ["a", "c", "b"];
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["a", "c", "b"]);
  question.value = undefined;
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["a", "b", "c"]);
  question.rankingChoices.pop();
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["a", "b"]);
  question.rankingChoices.push(new ItemValue("c"));
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["a", "b", "c"]);
});

QUnit.test("Ranking: check rendered rankingChoices and unRankingChoices are updated when rankingChoices and unRankingChoices changing", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["a", "b", "c"],
        selectToRankEnabled: true
      },
    ],
  });
  const question = <QuestionRankingModel>survey.getAllQuestions()[0];
  assert.deepEqual(question.renderedUnRankingChoices.map(item => item.value), ["a", "b", "c"]);
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), []);
  question.value = ["b", "c"];
  assert.deepEqual(question.renderedUnRankingChoices.map(item => item.value), ["a"]);
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["b", "c"]);
  question.value = ["c", "b"];
  assert.deepEqual(question.renderedUnRankingChoices.map(item => item.value), ["a"]);
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["c", "b"]);
  question.value = ["a"];
  assert.deepEqual(question.renderedUnRankingChoices.map(item => item.value), ["b", "c"]);
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), ["a"]);
  question.value = undefined;
  assert.deepEqual(question.renderedUnRankingChoices.map(item => item.value), ["a", "b", "c"]);
  assert.deepEqual(question.renderedRankingChoices.map(item => item.value), []);
  question.unRankingChoices.pop();
  assert.deepEqual(question.renderedUnRankingChoices.map(item => item.value), ["a", "b"]);
  question.unRankingChoices.push(new ItemValue("c"));
  assert.deepEqual(question.renderedUnRankingChoices.map(item => item.value), ["a", "b", "c"]);
});

QUnit.test("Ranking: test animation options", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q",
        choices: ["a", "b"],
        selectToRankEnabled: true
      },
    ],
  });
  const question = <QuestionRankingModel>survey.getAllQuestions()[0];
  question.value = ["a"];
  const rcAnimationOptions = question["getChoicesAnimationOptions"](true);
  const ucAnimationOptions = question["getChoicesAnimationOptions"](false);

  //test isAnimationEnabled
  question["domNode"] = document.createElement("div");
  settings.animationEnabled = true;
  question.enableOnElementRerenderedEvent();
  assert.ok(rcAnimationOptions.isAnimationEnabled());
  question.disableOnElementRerenderedEvent();
  assert.notOk(rcAnimationOptions.isAnimationEnabled());
  question.enableOnElementRerenderedEvent();
  assert.ok(rcAnimationOptions.isAnimationEnabled());
  question["domNode"] = undefined as any;
  assert.notOk(rcAnimationOptions.isAnimationEnabled());
  question["domNode"] = document.createElement("div");
  assert.ok(rcAnimationOptions.isAnimationEnabled());
  question.visible = false;
  assert.notOk(rcAnimationOptions.isAnimationEnabled());
  question.visible = true;
  assert.ok(rcAnimationOptions.isAnimationEnabled());
  settings.animationEnabled = false;
  assert.notOk(rcAnimationOptions.isAnimationEnabled());
  settings.animationEnabled = true;
  assert.ok(rcAnimationOptions.isAnimationEnabled());

  //test enterOptions
  assert.equal(rcAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding");
  assert.equal(ucAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding");

  assert.equal(rcAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding");
  assert.equal(ucAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding");

  question.selectToRankAreasLayout = "vertical";

  assert.equal(rcAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding");
  assert.equal(ucAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding");

  assert.equal(rcAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding-empty");
  assert.equal(ucAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-adding-empty");

  //test leave options
  question.selectToRankAreasLayout = "horizontal";
  assert.equal(rcAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing");
  assert.equal(ucAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing");

  assert.equal(rcAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing");
  assert.equal(ucAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing");

  question.selectToRankAreasLayout = "vertical";

  assert.equal(rcAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing");
  assert.equal(ucAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing");

  assert.equal(rcAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing-empty");
  assert.equal(ucAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass, "sv-ranking-item--animate-item-removing-empty");

  //test reorder options
  question.value = ["a", "b"];
  question.currentDropTarget = question.rankingChoices[0];

  assert.equal(rcAnimationOptions.getReorderOptions(question.rankingChoices[0], false).cssClass, "");
  assert.equal(rcAnimationOptions.getReorderOptions(question.rankingChoices[0], true).cssClass, "");

  assert.equal(rcAnimationOptions.getReorderOptions(question.rankingChoices[1], false).cssClass, "sv-dragdrop-moveup");
  assert.equal(rcAnimationOptions.getReorderOptions(question.rankingChoices[1], true).cssClass, "sv-dragdrop-movedown");

  settings.animationEnabled = false;
});

QUnit.test("Ranking: rankingDragHandleArea Setting ", function(assert) {
  let result;
  let dragStartTargetNode;

  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
      },
    ],
  });
  var rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q1");
  const iconHoverClass = rankingQuestion.cssClasses.itemIconHoverMod;

  Settings.rankingDragHandleArea = "icon"; // 1
  dragStartTargetNode = document.createElement("div");
  result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
  assert.equal(result, false);

  dragStartTargetNode.classList.add(iconHoverClass);
  result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
  assert.equal(result, true);

  Settings.rankingDragHandleArea = "entireItem"; // 2
  result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
  assert.equal(result, true);

  dragStartTargetNode.classList.remove(iconHoverClass);
  result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
  assert.equal(result, true);

  Settings.rankingDragHandleArea = "some"; // 3
  result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
  assert.equal(result, true);

  dragStartTargetNode.remove();
});
QUnit.test("Ranking: isItemSelected() returns always true for optimization", function(assert) {
  let result;
  let dragStartTargetNode;

  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: ["a", "b", "c"],
      },
    ],
  });
  const rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q1");
  assert.equal(rankingQuestion.isItemSelected(rankingQuestion.choices[0]), true, "#1");
  rankingQuestion.value = ["b", "c", "a"];
  assert.equal(rankingQuestion.isItemSelected(rankingQuestion.choices[0]), true, "#2");
});

QUnit.test("Ranking: separateSpecialChoices ", function (assert) {
  const prop = "separateSpecialChoices";
  assert.ok(Serializer.findProperty("checkbox", prop).visible, "checkbox separateSpecialChoices is visible");
  assert.notOk(Serializer.findProperty("ranking", prop).visible, "ranking separateSpecialChoices is invisible");
});
QUnit.test("Ranking: items visibleIf and value, Bug#5959", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "checkbox", name: "q1", choices: [1, 2] },
      {
        type: "ranking",
        name: "q2",
        choices: [
          { value: "a", visibleIf: "{q1} contains 1" },
          { value: "b", visibleIf: "{q1} contains 1" },
          { value: "c", visibleIf: "{q1} contains 2" },
          { value: "d", visibleIf: "{q1} contains 2" },
        ]
      }
    ]
  });
  var q1 = survey.getQuestionByName("q1");
  q1.value = [1, 2];
  var q2 = <QuestionRankingModel>survey.getQuestionByName("q2");
  q2.value = ["c", "d", "a", "b"];
  q1.value = [1];
  assert.deepEqual(q2.value, [], "value is correct");
  assert.equal(q2.rankingChoices.length, 2, "2 items are shown");
});
QUnit.test("Ranking: strict compare, Bug#6644", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "ranking", name: "q1", choices: ["a", "b", "c"] },
      { type: "text", name: "q2", visibleIf: "{q1} = ['b', 'c', 'a']"
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.isVisible, false, "not visible initially");
  q1.value = ["a", "b", "c"];
  assert.equal(q2.isVisible, false, "not visible #2");
  q1.value = ["b", "c", "a"];
  assert.equal(q2.isVisible, true, "visible #3");
  q1.value = ["a", "c", "b"];
  assert.equal(q2.isVisible, false, "not visible #3");
});
QUnit.test("Ranking: strict compare with not equal, Bug#7298", function(assert) {
  var survey = new SurveyModel({
    elements: [
      { type: "ranking", name: "q1", choices: ["a", "b", "c"] },
      { type: "text", name: "q2", visibleIf: "{q1} != ['b', 'c', 'a']"
      }
    ]
  });
  const q1 = survey.getQuestionByName("q1");
  const q2 = survey.getQuestionByName("q2");
  assert.equal(q2.isVisible, true, "visible initially");
  q1.value = ["b", "c", "a"];
  assert.equal(q2.isVisible, false, "not visible #2");
  q1.value = ["a", "c", "b"];
  assert.equal(q2.isVisible, true, "visible #3");
});

QUnit.test("Ranking: disabledItem", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: [
          "a",
          {
            "value": "b",
            "enableIf": "False"
          },
          "c"
        ]
      }
    ]
  });
  const rankingQuestion = survey.getQuestionByName("q1");
  const disabledItem = rankingQuestion.choices[1];

  assert.equal(rankingQuestion.canStartDragDueItemEnabled(disabledItem), false, "can't start drag disabled item");
  assert.equal(rankingQuestion.getItemTabIndex(disabledItem), undefined, "can't move disabled item via keyboard");
});

QUnit.test("Ranking: disabledItem with selectToRank and maxSelectedChoices", function(assert) {
  var survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        selectToRankEnabled: true,
        choices: [
          "a",
          "b",
          "c"
        ],
        maxSelectedChoices: 1,
        defaultValue: ["a"]
      }
    ]
  });
  const rankingQuestion = survey.getQuestionByName("q1");
  const rankedItem = rankingQuestion.rankingChoices[0];

  assert.equal(
    rankingQuestion.canStartDragDueItemEnabled(rankedItem),
    true,
    "should be able to start drag rankedItem item for uranking action"
  );
});

// selectToRankEnabled
function createRankingQuestionModel(selectToRankEnabled = false, withDefaultValue = false) {
  const json = {
    "choices": [
      "11",
      "22",
      "33"
    ]
  };

  if (selectToRankEnabled) {
    json["selectToRankEnabled"] = true;
  }

  if (withDefaultValue) {
    json["defaultValue"] = ["33", "22"];
  }

  const model = new QuestionRankingModel("qr1");
  model.fromJSON(json);
  return model;
}

QUnit.test("selectToRankEnabled : initial", function (assert) {
  const selectToRankEnabled = true;
  const questionModel = createRankingQuestionModel(selectToRankEnabled);
  assert.equal(questionModel.unRankingChoices.length, 3, "unRankingChoices count");
  assert.equal(questionModel.rankingChoices.length, 0, "rankingChoices count");
});

QUnit.test("selectToRankEnabled : defaultValue", function (assert) {
  const selectToRankEnabled = true;
  const withDefaultValue = true;
  const questionWithDefaultValueModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);
  assert.equal(questionWithDefaultValueModel.unRankingChoices.length, 1, "unRankingChoices count");
  assert.equal(questionWithDefaultValueModel.rankingChoices.length, 2, "rankingChoices count");
});

QUnit.test("selectToRankEnabled : checkMaxSelectedChoicesUnreached", function (assert) {
  const selectToRankEnabled = true;
  const withDefaultValue = false;
  const questionModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);

  assert.equal(questionModel.checkMaxSelectedChoicesUnreached(), true, "without MaxSelectedChoices");

  questionModel.maxSelectedChoices = 2;
  questionModel.value = ["11", "22"];
  assert.equal(questionModel.checkMaxSelectedChoicesUnreached(), false, "MaxSelectedChoices limit reached");
});

QUnit.test("selectToRankEnabled : checkMaxSelectedChoices and handleKeydownSelectToRank", function (assert) {
  const selectToRankEnabled = true;
  const withDefaultValue = true;
  const questionModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);

  questionModel.maxSelectedChoices = 2;
  const fakeEvent:any = { key: " ", preventDefault: ()=>{} };
  questionModel.handleKeydownSelectToRank(fakeEvent, questionModel.unRankingChoices[0], " ", false);

  assert.equal(questionModel.value.length, 2, "can't add due to MaxSelectedChoices");

  questionModel.handleKeydownSelectToRank(fakeEvent, questionModel.rankingChoices[0], " ", false);

  assert.equal(questionModel.value.length, 1, "unrank with MaxSelectedChoices");
});

QUnit.test("Ranking: renderedSelectToRankAreasLayout", function (assert) {
  const selectToRankEnabled = true;
  const withDefaultValue = false;
  const questionModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);

  assert.equal(questionModel.selectToRankAreasLayout, "horizontal", "default");
  assert.equal(questionModel.renderedSelectToRankAreasLayout, "horizontal", "default");

  questionModel.selectToRankAreasLayout = "vertical";
  assert.equal(questionModel.selectToRankAreasLayout, "vertical", "set vertical");
  assert.equal(questionModel.renderedSelectToRankAreasLayout, "vertical", "set vertical");

  questionModel.isMobileMode = ()=>{ return true; }; // set mobile env

  assert.equal(questionModel.selectToRankAreasLayout, "vertical", "set vertical");
  assert.equal(questionModel.renderedSelectToRankAreasLayout, "vertical", "'vertical' by default on mobile");

  questionModel.selectToRankAreasLayout = "horizontal";
  assert.equal(questionModel.selectToRankAreasLayout, "horizontal", "default");
  assert.equal(questionModel.renderedSelectToRankAreasLayout, "vertical", "'vertical' always on mobile");
});

QUnit.test("Ranking: check SelectToRankEmptyRankedAreaText & SelectToRankEmptyUnrankedAreaText properties", (assert) => {
  let json: any = {
    questions: [
      {
        "type": "ranking",
        "name": "question1",
        "selectToRankEmptyRankedAreaText": "empty ranked",
        "selectToRankEmptyUnrankedAreaText": "empty unranked",
        "choices": [
          "Item 1",
          "Item 2",
          "Item 3"
        ]
      }
    ],
  };
  let survey = new SurveyModel(json);
  let question = <QuestionRankingModel>survey.getAllQuestions()[0];

  const rankedProp = Serializer.getProperty("ranking", "selectToRankEmptyRankedAreaText");
  const unrankedProp = Serializer.getProperty("ranking", "selectToRankEmptyUnrankedAreaText");

  assert.equal(rankedProp.isVisible("", question), false);
  assert.equal(unrankedProp.isVisible("", question), false);

  question.selectToRankEnabled = true;
  assert.equal(rankedProp.isVisible("", question), true);
  assert.equal(unrankedProp.isVisible("", question), true);

  assert.equal(question.selectToRankEmptyRankedAreaText, "empty ranked");
  assert.equal(question.selectToRankEmptyUnrankedAreaText, "empty unranked");
});
QUnit.test("Response is reset on changing questionsOnPageMode", (assert) => {
  const survey = new SurveyModel({
    elements: [
      {
        type: "ranking",
        name: "q1",
        choices: [1, 2, 3]
      },
    ],
  });
  survey.data = { q1: [3, 1, 2] };
  survey.questionsOnPageMode = "singlePage";
  const q1 = <QuestionRankingModel>survey.getQuestionByName("q1");
  assert.deepEqual(q1.value, [3, 1, 2], "#1");
  assert.deepEqual(q1.renderedValue, [3, 1, 2], "#2");
  assert.deepEqual(q1.rankingChoices[0].value, 3, "#3");
  assert.deepEqual(q1.renderedRankingChoices[0].value, 3, "#4");
});
// EO selectToRankEnabled
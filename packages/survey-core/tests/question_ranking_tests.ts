import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionRankingModel } from "../src/question_ranking";
import { SurveyModel } from "../src/survey";
import { settings as Settings, settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";
import { ItemValue } from "../src/itemvalue";
import { sassFalse } from "sass";

import { describe, test, expect } from "vitest";
describe("question ranking", () => {
  test("Ranking: Base ", () => {
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

    expect(rankingQuestion.rankingChoices.map((c)=>c.value), "rankingChoices returns visibleChoices if empty value").toEqual(["a", "b", "c"]);

    rankingQuestion.value = ["c", "b", "a"];
    expect(rankingQuestion.rankingChoices.map((c)=>c.value), "rankingChoices returns visibleChoices if empty value").toEqual(["c", "b", "a"]);
  });

  test("Ranking: predefined Survey data", () => {
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
    expect([...(q1.value)]).toEqual(["b", "a", "c"]);
    expect(q1.isEmpty()).toEqual(false);
    expect(q1.rankingChoices.map(item => item.value)).toEqual(["b", "a", "c"]);

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
    expect([...(q1.value)]).toEqual(["3", "2", "1"]);
    expect(q1.isEmpty()).toEqual(false);
    expect(q1.rankingChoices.map(item => item.text)).toEqual(["c", "b", "a"]);
    expect(q1.rankingChoices.map(item => item.value)).toEqual(["3", "2", "1"]);
  });

  test("Ranking: check removing other from visibleChoices", () => {
    var survey = new SurveyModel({
      elements: [
        {
          type: "ranking",
          name: "q1",
          choices: ["a", "b", "c"],
          showOtherItem: true,
        },
      ],
    });
    var rankingQuestion = <QuestionRankingModel>survey.getQuestionByName("q1");
    expect(rankingQuestion.rankingChoices.length).toEqual(3);
  });

  test("Ranking: Carry Forward", () => {
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

    expect([...(q2.rankingChoices)]).toEqual([]);
    expect(q2.isEmpty()).toEqual(true);

    q1.value = [2, 3];
    q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
    expect(q2.isEmpty()).toEqual(false);
    expect(survey.data).toEqual({
      q1: [2, 3],
      q2: [2, 3],
    });

    // ranking question with only one choice doesn't make sense
    q1.value = ["2"];
    expect(q2.isEmpty()).toEqual(false);
    expect(survey.data).toEqual({
      q1: [2],
    });

    q1.value = [];
    expect(q2.isEmpty()).toEqual(true);
    expect(q2.rankingChoices.map(item => item.text)).toEqual([]);

    q1.value = [2, 3];
    q2.value = q2.rankingChoices.map(choice => choice.text); //imitate user's drag drop from the ui
    expect(q2.isEmpty()).toEqual(false);
    expect(survey.data).toEqual({
      q1: [2, 3],
      q2: [2, 3],
    });
  });
  test("Ranking: Carry Forward and showOtherItem", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5], showOtherItem: true },
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

    expect([...(q2.rankingChoices)]).toEqual([]);
    expect(q2.isEmpty()).toEqual(true);

    q1.value = [2, 3, "other"];
    expect(q2.visibleChoices.length, "2, 3 other is empty").toBe(2);
    q1.otherValue = "someText";
    expect(q2.visibleChoices.length, "2, 3 and other").toBe(3);
    expect(q2.visibleChoices[2].value, "other value").toBe("other");
    expect(q2.visibleChoices[2].text, "other text").toBe("someText");
  });
  test("Ranking: Carry Forward and unrankIfChoicesChanged", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "checkbox", name: "q1", choices: [1, 2, 3, 4, 5], showOtherItem: true },
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
    expect(rankingQuestion.value.length, "rank items by default").toBe(0);

    checkboxQuestion.value = [1, 2, 3];
    expect(rankingQuestion.value.length, "unrank items after choices changed").toBe(0);

    rankingQuestion["isValueSetByUser"] = true;
    rankingQuestion.value = [1, 2, 3];
    checkboxQuestion.value = [1, 2];
    expect(rankingQuestion.value.length, "after user's arrengement unrank should stop working").toBe(2);
  });

  test("Ranking: Carry Forward: Default Value", () => {
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

    expect(survey.data).toEqual({
      q1: [1, 2, 3],
      q2: [1, 2, 3],
    });

    q1.value = [1, 2];

    expect(survey.data).toEqual({
      q1: [1, 2],
      q2: [1, 2],
    });
  });

  test("Ranking: Carry Forward: Data", () => {
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

    expect(survey.data).toEqual({
      q1: [1, 2, 3],
      q2: [3, 2, 1],
    });
  });

  test("Ranking: CorrectAnswer, Bug#3720", () => {
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
    expect(q.isAnswerCorrect(), "Answer is not correct").toBe(false);
    q.value = ["b", "a"];
    expect(q.isAnswerCorrect(), "Answer is correct").toBe(true);
  });

  test("Ranking: ReadOnlyMode ", () => {
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

    expect(q["isAllowStartDrag"](target, choise)).toBe(true);

    survey.readOnly = true;
    expect(q["isAllowStartDrag"](target, choise)).toBe(false);

    survey.readOnly = false;
    expect(q["isAllowStartDrag"](target, choise)).toBe(true);
    choise.enabled = false;
    expect(q["isAllowStartDrag"](target, choise)).toBe(false);
  });

  test("Ranking: design mode", () => {
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
        if (fromIndex < toIndex) {
          downCalled++;
        } else if (fromIndex > toIndex) {
          upCalled++;
        }
      }
    } as any;
    function preventDefault() { preventDefaultCalled++; }

    q.handleKeydown(<any>{ key: "ArrowUp", preventDefault: preventDefault }, q.choices[1]);
    expect(upCalled).toBe(1);
    expect(downCalled).toBe(0);
    expect(preventDefaultCalled).toBe(1);

    q.handleKeydown(<any>{ key: "ArrowDown", preventDefault: preventDefault }, q.choices[1]);
    expect(upCalled).toBe(1);
    expect(downCalled).toBe(1);
    expect(preventDefaultCalled).toBe(2);

    survey["_isDesignMode"] = true;
    q.handleKeydown(<any>{ key: "ArrowUp", preventDefault: preventDefault }, q.choices[1]);
    q.handleKeydown(<any>{ key: "ArrowDown", preventDefault: preventDefault }, q.choices[1]);
    expect(upCalled).toBe(1);
    expect(downCalled).toBe(1);
    expect(preventDefaultCalled).toBe(2);
  });

  test("Ranking: selectToRank key navigation with animation", () => {
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
    expect(q.unRankingChoices.map((item) => item.value)).toEqual(["a", "c"]);
    expect(q.rankingChoices.map((item) => item.value)).toEqual(["b"]);

    q.handleKeydown(<any>{ key: " ", preventDefault: () => {} }, q.choices[0]);
    expect(q.unRankingChoices.map((item) => item.value)).toEqual(["c"]);
    expect(q.rankingChoices.map((item) => item.value)).toEqual(["b", "a"]);

    q.handleKeydown(<any>{ key: " ", preventDefault: () => {} }, q.choices[1]);
    expect(q.unRankingChoices.map((item) => item.value)).toEqual(["b", "c"]);
    expect(q.rankingChoices.map((item) => item.value)).toEqual(["a"]);

    q.handleKeydown(<any>{ key: " ", preventDefault: () => {} }, q.choices[0]);
    expect(q.unRankingChoices.map((item) => item.value)).toEqual(["a", "b", "c"]);
    expect(q.rankingChoices.map((item) => item.value)).toEqual([]);

    (window as any).event = undefined;
    settings.animationEnabled = false;
  });

  test("Ranking: check renderedRankingChoices are updated when rankingChoices changing", () => {
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
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["a", "b", "c"]);
    question.value = ["b", "a", "c"];
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["b", "a", "c"]);
    question.value = ["a", "c", "b"];
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["a", "c", "b"]);
    question.value = undefined;
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["a", "b", "c"]);
    question.rankingChoices.pop();
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["a", "b"]);
    question.rankingChoices.push(new ItemValue("c"));
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["a", "b", "c"]);
  });

  test("Ranking: check rendered rankingChoices and unRankingChoices are updated when rankingChoices and unRankingChoices changing", () => {
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
    expect(question.renderedUnRankingChoices.map(item => item.value)).toEqual(["a", "b", "c"]);
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual([]);
    question.value = ["b", "c"];
    expect(question.renderedUnRankingChoices.map(item => item.value)).toEqual(["a"]);
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["b", "c"]);
    question.value = ["c", "b"];
    expect(question.renderedUnRankingChoices.map(item => item.value)).toEqual(["a"]);
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["c", "b"]);
    question.value = ["a"];
    expect(question.renderedUnRankingChoices.map(item => item.value)).toEqual(["b", "c"]);
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual(["a"]);
    question.value = undefined;
    expect(question.renderedUnRankingChoices.map(item => item.value)).toEqual(["a", "b", "c"]);
    expect(question.renderedRankingChoices.map(item => item.value)).toEqual([]);
    question.unRankingChoices.pop();
    expect(question.renderedUnRankingChoices.map(item => item.value)).toEqual(["a", "b"]);
    question.unRankingChoices.push(new ItemValue("c"));
    expect(question.renderedUnRankingChoices.map(item => item.value)).toEqual(["a", "b", "c"]);
  });

  test("Ranking: test animation options", () => {
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
    expect(rcAnimationOptions.isAnimationEnabled()).toBeTruthy();
    question.disableOnElementRerenderedEvent();
    expect(rcAnimationOptions.isAnimationEnabled()).toBeFalsy();
    question.enableOnElementRerenderedEvent();
    expect(rcAnimationOptions.isAnimationEnabled()).toBeTruthy();
    question["domNode"] = undefined as any;
    expect(rcAnimationOptions.isAnimationEnabled()).toBeFalsy();
    question["domNode"] = document.createElement("div");
    expect(rcAnimationOptions.isAnimationEnabled()).toBeTruthy();
    question.visible = false;
    expect(rcAnimationOptions.isAnimationEnabled()).toBeFalsy();
    question.visible = true;
    expect(rcAnimationOptions.isAnimationEnabled()).toBeTruthy();
    settings.animationEnabled = false;
    expect(rcAnimationOptions.isAnimationEnabled()).toBeFalsy();
    settings.animationEnabled = true;
    expect(rcAnimationOptions.isAnimationEnabled()).toBeTruthy();

    //test enterOptions
    expect(rcAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding");
    expect(ucAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding");

    expect(rcAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding");
    expect(ucAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding");

    question.selectToRankAreasLayout = "vertical";

    expect(rcAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding");
    expect(ucAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding");

    expect(rcAnimationOptions.getEnterOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding-empty");
    expect(ucAnimationOptions.getEnterOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-adding-empty");

    //test leave options
    question.selectToRankAreasLayout = "horizontal";
    expect(rcAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing");
    expect(ucAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing");

    expect(rcAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing");
    expect(ucAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing");

    question.selectToRankAreasLayout = "vertical";

    expect(rcAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing");
    expect(ucAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing");

    expect(rcAnimationOptions.getLeaveOptions(question.rankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing-empty");
    expect(ucAnimationOptions.getLeaveOptions(question.unRankingChoices[0]).cssClass).toBe("sv-ranking-item--animate-item-removing-empty");

    //test reorder options
    question.value = ["a", "b"];
    question.currentDropTarget = question.rankingChoices[0];

    expect(rcAnimationOptions.getReorderOptions(question.rankingChoices[0], false).cssClass).toBe("");
    expect(rcAnimationOptions.getReorderOptions(question.rankingChoices[0], true).cssClass).toBe("");

    expect(rcAnimationOptions.getReorderOptions(question.rankingChoices[1], false).cssClass).toBe("sv-dragdrop-moveup");
    expect(rcAnimationOptions.getReorderOptions(question.rankingChoices[1], true).cssClass).toBe("sv-dragdrop-movedown");

    settings.animationEnabled = false;
  });

  test("Ranking: rankingDragHandleArea Setting ", () => {
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
    expect(result).toBe(false);

    dragStartTargetNode.classList.add(iconHoverClass);
    result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
    expect(result).toBe(true);

    Settings.rankingDragHandleArea = "entireItem"; // 2
    result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
    expect(result).toBe(true);

    dragStartTargetNode.classList.remove(iconHoverClass);
    result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
    expect(result).toBe(true);

    Settings.rankingDragHandleArea = "some"; // 3
    result = rankingQuestion["isDragStartNodeValid"](dragStartTargetNode);
    expect(result).toBe(true);

    dragStartTargetNode.remove();
  });
  test("Ranking: isItemSelected() returns always true for optimization", () => {
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
    expect(rankingQuestion.isItemSelected(rankingQuestion.choices[0]), "#1").toBe(true);
    rankingQuestion.value = ["b", "c", "a"];
    expect(rankingQuestion.isItemSelected(rankingQuestion.choices[0]), "#2").toBe(true);
  });

  test("Ranking: separateSpecialChoices ", () => {
    const prop = "separateSpecialChoices";
    expect(Serializer.findProperty("checkbox", prop).visible, "checkbox separateSpecialChoices is visible").toBeTruthy();
    expect(Serializer.findProperty("ranking", prop).visible, "ranking separateSpecialChoices is invisible").toBeFalsy();
  });
  test("Ranking: items visibleIf and value, Bug#5959", () => {
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
    expect([...(q2.value)], "value is correct").toEqual([]);
    expect(q2.rankingChoices.length, "2 items are shown").toBe(2);
  });
  test("Ranking: strict compare, Bug#6644", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "ranking", name: "q1", choices: ["a", "b", "c"] },
        { type: "text", name: "q2", visibleIf: "{q1} = ['b', 'c', 'a']"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.isVisible, "not visible initially").toBe(false);
    q1.value = ["a", "b", "c"];
    expect(q2.isVisible, "not visible #2").toBe(false);
    q1.value = ["b", "c", "a"];
    expect(q2.isVisible, "visible #3").toBe(true);
    q1.value = ["a", "c", "b"];
    expect(q2.isVisible, "not visible #3").toBe(false);
  });
  test("Ranking: strict compare with not equal, Bug#7298", () => {
    var survey = new SurveyModel({
      elements: [
        { type: "ranking", name: "q1", choices: ["a", "b", "c"] },
        { type: "text", name: "q2", visibleIf: "{q1} != ['b', 'c', 'a']"
        }
      ]
    });
    const q1 = survey.getQuestionByName("q1");
    const q2 = survey.getQuestionByName("q2");
    expect(q2.isVisible, "visible initially").toBe(true);
    q1.value = ["b", "c", "a"];
    expect(q2.isVisible, "not visible #2").toBe(false);
    q1.value = ["a", "c", "b"];
    expect(q2.isVisible, "visible #3").toBe(true);
  });

  test("Ranking: disabledItem", () => {
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

    expect(rankingQuestion.canStartDragDueItemEnabled(disabledItem), "can't start drag disabled item").toBe(false);
    expect(rankingQuestion.getItemTabIndex(disabledItem), "can't move disabled item via keyboard").toBeUndefined();
  });

  test("Ranking: disabledItem with selectToRank and maxSelectedChoices", () => {
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

    expect(rankingQuestion.canStartDragDueItemEnabled(rankedItem), "should be able to start drag rankedItem item for uranking action").toBe(true);
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

  test("selectToRankEnabled : initial", () => {
    const selectToRankEnabled = true;
    const questionModel = createRankingQuestionModel(selectToRankEnabled);
    expect(questionModel.unRankingChoices.length, "unRankingChoices count").toBe(3);
    expect(questionModel.rankingChoices.length, "rankingChoices count").toBe(0);
  });

  test("selectToRankEnabled : defaultValue", () => {
    const selectToRankEnabled = true;
    const withDefaultValue = true;
    const questionWithDefaultValueModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);
    expect(questionWithDefaultValueModel.unRankingChoices.length, "unRankingChoices count").toBe(1);
    expect(questionWithDefaultValueModel.rankingChoices.length, "rankingChoices count").toBe(2);
  });

  test("selectToRankEnabled : checkMaxSelectedChoicesUnreached", () => {
    const selectToRankEnabled = true;
    const withDefaultValue = false;
    const questionModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);

    expect(questionModel.checkMaxSelectedChoicesUnreached(), "without MaxSelectedChoices").toBe(true);

    questionModel.maxSelectedChoices = 2;
    questionModel.value = ["11", "22"];
    expect(questionModel.checkMaxSelectedChoicesUnreached(), "MaxSelectedChoices limit reached").toBe(false);
  });

  test("selectToRankEnabled : checkMaxSelectedChoices and handleKeydownSelectToRank", () => {
    const selectToRankEnabled = true;
    const withDefaultValue = true;
    const questionModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);

    questionModel.maxSelectedChoices = 2;
    const fakeEvent:any = { key: " ", preventDefault: ()=>{} };
    questionModel.handleKeydownSelectToRank(fakeEvent, questionModel.unRankingChoices[0], " ", false);

    expect(questionModel.value.length, "can't add due to MaxSelectedChoices").toBe(2);

    questionModel.handleKeydownSelectToRank(fakeEvent, questionModel.rankingChoices[0], " ", false);

    expect(questionModel.value.length, "unrank with MaxSelectedChoices").toBe(1);
  });

  test("Ranking: renderedSelectToRankAreasLayout", () => {
    const selectToRankEnabled = true;
    const withDefaultValue = false;
    const questionModel = createRankingQuestionModel(selectToRankEnabled, withDefaultValue);

    expect(questionModel.selectToRankAreasLayout, "default").toBe("horizontal");
    expect(questionModel.renderedSelectToRankAreasLayout, "default").toBe("horizontal");

    questionModel.selectToRankAreasLayout = "vertical";
    expect(questionModel.selectToRankAreasLayout, "set vertical").toBe("vertical");
    expect(questionModel.renderedSelectToRankAreasLayout, "set vertical").toBe("vertical");

    questionModel.isMobileMode = ()=>{ return true; }; // set mobile env

    expect(questionModel.selectToRankAreasLayout, "set vertical").toBe("vertical");
    expect(questionModel.renderedSelectToRankAreasLayout, "'vertical' by default on mobile").toBe("vertical");

    questionModel.selectToRankAreasLayout = "horizontal";
    expect(questionModel.selectToRankAreasLayout, "default").toBe("horizontal");
    expect(questionModel.renderedSelectToRankAreasLayout, "'vertical' always on mobile").toBe("vertical");
  });

  test("Ranking: check SelectToRankEmptyRankedAreaText & SelectToRankEmptyUnrankedAreaText properties", () => {
    let json: any = {
      elements: [
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

    expect(rankedProp.isVisible("", question)).toBe(false);
    expect(unrankedProp.isVisible("", question)).toBe(false);

    question.selectToRankEnabled = true;
    expect(rankedProp.isVisible("", question)).toBe(true);
    expect(unrankedProp.isVisible("", question)).toBe(true);

    expect(question.selectToRankEmptyRankedAreaText).toBe("empty ranked");
    expect(question.selectToRankEmptyUnrankedAreaText).toBe("empty unranked");
  });
  test("Response is reset on changing questionsOnPageMode", () => {
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
    expect([...(q1.value)], "#1").toEqual([3, 1, 2]);
    expect([...(q1.renderedValue)], "#2").toEqual([3, 1, 2]);
    expect(q1.rankingChoices[0].value, "#3").toEqual(3);
    expect(q1.renderedRankingChoices[0].value, "#4").toEqual(3);
  });
  // EO selectToRankEnabled

  test("A11Y", () => {
    expect(new QuestionRankingModel("q1").ariaRole, "aria-role").toEqual("group");
  });
});

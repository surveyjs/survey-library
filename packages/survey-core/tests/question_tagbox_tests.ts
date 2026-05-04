import { SurveyModel } from "../src/survey";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { PopupDropdownViewModel } from "../src/popup-dropdown-view-model";
import { _setIsTouch } from "../src/utils/devices";
import { settings } from "../src/settings";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { PageModel } from "../src/page";
import { IAction } from "../src/actions/action";
import { describe, test, expect, vi } from "vitest";
describe("Tagbox question", () => {
  const jsonTagbox = {
    elements: [{
      type: "tagbox",
      name: "question1",
      showOtherItem: "true",
      choices: [
        "item1",
        "item2",
        "item3",
        "item4",
        "item5",
        "item6",
        "item7",
        "item8",
        "item9",
        "item10",
        "item11",
        "item12",
        "item13",
        "item14",
        "item15",
        "item16",
        "item17",
        "item18",
        "item19",
        "item20",
        "item21",
        "item22",
        "item23",
        "item24",
        "item25",
        "item26",
        "item27"
      ]
    }]
  };

  test("clearValue", () => {
    const json = {
      elements: [
        {
          "type": "tagbox",
          "name": "q1",
          "showOtherItem": true,
          "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
        }]
    };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;

    expect(question.value.length, "init").toBe(0);
    expect(dropdownListModel.filterString, "init").toBe("");
    expect(dropdownListModel.inputStringRendered, "init").toBe("");
    expect(dropdownListModel.hintString, "init").toBe("");

    question.value = [2];
    dropdownListModel.inputStringRendered = "i";
    expect(question.value.length).toBe(1);
    expect(question.selectedChoices.length).toBe(1);
    expect(dropdownListModel.filterString).toBe("i");
    expect(dropdownListModel.inputStringRendered).toBe("i");
    expect(dropdownListModel.hintString).toBe("item 1");

    question.clearValue();

    expect(question.value.length, "after clear").toBe(0);
    expect(dropdownListModel.filterString, "after clear").toBe("");
    expect(dropdownListModel.inputStringRendered, "after clear").toBe("");
    expect(dropdownListModel.hintString, "after clear").toBe("");
  });

  test("Tagbox DropdownListModel with MultiListModel", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();
  });

  test("DropdownListModel with MultiListModel and defaultValue", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        defaultValue: ["item1"],
        choices: [
          "item1",
          "item2",
          "item3",
          "item4"
        ]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.actions.length).toBe(4);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.isItemSelected(list.actions[0])).toBe(true);
    expect(list.isItemSelected(list.actions[3])).toBe(false);
    expect(question.value).toEqualValues(["item1"]);

    list.onItemClick(list.actions[0]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(0);
    expect(list.isItemSelected(list.actions[0])).toBe(false);
    expect(list.isItemSelected(list.actions[3])).toBe(false);
    expect(question.value).toEqualValues([]);

    list.onItemClick(list.actions[3]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.isItemSelected(list.actions[0])).toBe(false);
    expect(list.isItemSelected(list.actions[3])).toBe(true);
    expect(question.value).toEqualValues(["item4"]);

    list.onItemClick(list.actions[0]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(2);
    expect(list.isItemSelected(list.actions[0])).toBe(true);
    expect(list.isItemSelected(list.actions[3])).toBe(true);
    expect(question.value).toEqualValues(["item4", "item1"]);
  });

  const jsonTagboxWithSelectAll = {
    elements: [{
      type: "tagbox",
      name: "question1",
      showOtherItem: "true",
      showNoneItem: "true",
      showSelectAllItem: "true",
      choices: [
        "item1",
        "item2",
        "item3",
        "item4",
        "item5"
      ]
    }]
  };

  test("Select SelectAll", () => {
    const survey = new SurveyModel(jsonTagboxWithSelectAll);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.actions.length).toBe(8);
    expect(list.selectedItems.length).toBe(0);

    const selectAllItem = list.actions[0];
    const item1 = list.actions[1];
    expect(selectAllItem.id).toBe("selectall");
    expect(item1.id).toBe("item1");

    list.onItemClick(selectAllItem); // select all items
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(5);
    expect(question.value, "question.value isSelectAll").toEqualValues(["item1", "item2", "item3", "item4", "item5"]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "list.selectedItems.length").toBe(6);

    list.onItemClick(item1); // 4 elements out of 5 are selected
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(4);
    expect(question.value, "question.value").toEqualValues(["item2", "item3", "item4", "item5"]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "list.selectedItems.length").toBe(4);

    list.onItemClick(selectAllItem); // select all items
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(5);
    expect(question.value, "question.value  isSelectAll").toEqualValues(["item1", "item2", "item3", "item4", "item5"]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "list.selectedItems.length").toBe(6);

    list.onItemClick(selectAllItem); // reset all items
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(0);
    expect(question.value, "question.value").toEqualValues([]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "list.selectedItems.length").toBe(0);
  });

  test("Select None item", () => {
    const survey = new SurveyModel(jsonTagboxWithSelectAll);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.actions.length).toBe(8);
    expect(list.selectedItems.length).toBe(0);

    const item1 = list.actions[1];
    const noneItem = list.actions[6];
    expect(item1.id).toBe("item1");
    expect(noneItem.id).toBe("none");

    list.onItemClick(item1); // 1 element out of 5 is selected
    expect(question.selectedItems.length, "item1 selected").toBe(1);
    expect(question.value, "item1 selected").toEqualValues(["item1"]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "item1 selected").toBe(1);

    list.onItemClick(noneItem); // reset all items
    expect(question.selectedItems.length, "none selected").toBe(1);
    expect(question.value, "none selected").toEqualValues(["none"]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "none selected").toBe(1);

    list.onItemClick(item1); // 1 element out of 5 is selected
    expect(question.selectedItems.length, "item1 selected").toBe(1);
    expect(question.value, "item1 selected").toEqualValues(["item1"]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "item1 selected").toBe(1);
  });

  test("Tagbox hideSelectedItems property default false", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        defaultValue: ["item1"],
        choices: [
          "item1",
          "item2",
          "item3",
          "item4"
        ]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    expect(list.actions.length).toBe(4);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.actions[0].visible).toBe(true);
    expect(list.actions[3].visible).toBe(true);
    expect(question.value).toEqualValues(["item1"]);

    list.onItemClick(list.actions[0]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(0);
    expect(list.actions[0].visible).toBe(true);
    expect(list.actions[3].visible).toBe(true);
    expect(question.value).toEqualValues([]);

    list.onItemClick(list.actions[3]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.actions[0].visible).toBe(true);
    expect(list.actions[3].visible).toBe(true);
    expect(question.value).toEqualValues(["item4"]);

    list.onItemClick(list.actions[0]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(2);
    expect(list.actions[0].visible).toBe(true);
    expect(list.actions[3].visible).toBe(true);
    expect(question.value).toEqualValues(["item4", "item1"]);
  });

  test("Tagbox hideSelectedItems property set is true", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        defaultValue: ["item1"],
        choices: [
          "item1",
          "item2",
          "item3",
          "item4"
        ]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    question.hideSelectedItems = true;

    expect(list.actions.length).toBe(4);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.actions[0].visible).toBe(false);
    expect(list.actions[3].visible).toBe(true);
    expect(question.value).toEqualValues(["item1"]);

    list.onItemClick(list.actions[0]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(0);
    expect(list.actions[0].visible).toBe(true);
    expect(list.actions[3].visible).toBe(true);
    expect(question.value).toEqualValues([]);

    list.onItemClick(list.actions[3]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.actions[0].visible).toBe(true);
    expect(list.actions[3].visible).toBe(false);
    expect(question.value).toEqualValues(["item4"]);

    list.onItemClick(list.actions[0]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(2);
    expect(list.actions[0].visible).toBe(false);
    expect(list.actions[3].visible).toBe(false);
    expect(question.value).toEqualValues(["item4", "item1"]);
  });

  function getNumberArray(skip = 1, count = 25, filter = ""): Array<any> {
    const result: Array<any> = [];
    let index = skip;
    while((skip + result.length) < (skip + count)) {
      const displayText = "DisplayText_" + index;
      if (!!filter) {
        if (displayText.toLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1) {
          result.push({ value: index, text: displayText });
        }
      } else {
        result.push({ value: index, text: displayText });
      }
      index++;
    }
    return result;
  }

  const onChoicesLazyLoadCallbackTimeOut = 5;
  const callbackTimeOutDelta = 1;

  const callback = (_, opt) => {
    setTimeout(() => {
      doneCallback(opt);
    }, onChoicesLazyLoadCallbackTimeOut);
  };

  const doneCallback = (opt) => {
    const total = opt.filter == "888" ? 17 : 70;
    if (opt.skip + opt.take < total) {
      opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), total);
    } else {
      opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip, opt.filter), total);
    }
  };

  test("lazy loading: several loading", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(30);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[29].value).toBe(30);

    question.dropdownListModel["updateQuestionChoices"]();
    doneCallback(opts[1]);
    expect(question.choices.length).toBe(60);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[59].value).toBe(60);

    question.dropdownListModel["updateQuestionChoices"]();
    doneCallback(opts[2]);
    expect(question.choices.length).toBe(70);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[69].value).toBe(70);
  });

  test("lazy loading + change filter string + dropdownSearchDelay", () => {
    vi.useFakeTimers();
    try {
      const newValueDebouncedInputValue = 2 * onChoicesLazyLoadCallbackTimeOut;

      const json = {
        elements: [{
          "type": "tagbox",
          "name": "q1",
          "choicesLazyLoadEnabled": true
        }]
      };
      const survey = new SurveyModel(json);
      survey.onChoicesLazyLoad.add(callback);

      const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
      expect(question.choicesLazyLoadEnabled).toBe(true);
      expect(question.choices.length).toBe(0);

      question.dropdownListModel.popupModel.show();
      expect(question.choices.length, "show popup before request").toBe(0);

      vi.advanceTimersByTime(onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
      expect(question.choices.length, "show popup after request").toBe(25);
      expect(question.choices[0].value, "show popup after request").toBe(1);
      settings.dropdownSearchDelay = newValueDebouncedInputValue;
      question.dropdownListModel.filterString = "2";
      vi.advanceTimersByTime(callbackTimeOutDelta);
      expect(question.choices.length, "filter is 2").toBe(25);
      expect(question.choices[0].value, "filter is 2").toBe(1);
      settings.dropdownSearchDelay = newValueDebouncedInputValue;
      question.dropdownListModel.filterString = "22";
      vi.advanceTimersByTime(callbackTimeOutDelta);
      expect(question.choices.length, "filter is 22 before request").toBe(25);
      expect(question.choices[0].value, "filter is 22 before request").toBe(1);

      vi.advanceTimersByTime(2 * (onChoicesLazyLoadCallbackTimeOut + newValueDebouncedInputValue));
      expect(question.choices.length, "filter is 22 after request").toBe(25);
      expect(question.choices[0].value, "filter is 22 after request").toBe(22);

      settings.dropdownSearchDelay = 0;
    } finally {
      settings.dropdownSearchDelay = 0;
      vi.useRealTimers();
    }
  });

  test("storeOthersAsComment is false", assert => {
    const json = {
      "storeOthersAsComment": false,
      "elements": [
        {
          "type": "tagbox",
          "name": "q1",
          "showOtherItem": true
        }
      ],
      "showQuestionNumbers": false
    };
    const survey = new SurveyModel(json);
    survey.onChoicesLazyLoad.add(callback);

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.visibleChoices.length).toBe(1);
    expect(question.visibleChoices[0].id).toBe("other");
    expect(question.visibleChoices[0].value).toBe("other");

    question.renderedValue = ["other"];
    expect(question.value, "#1").toEqualValues(["other"]);
    question.otherValue = "text1";
    expect(question.value, "#2").toEqualValues(["text1"]);
    expect(survey.data, "#3").toEqualValues({ q1: ["text1"] });
  });

  test("lazy loading: storeOthersAsComment is false", assert => {
    const json = {
      "storeOthersAsComment": false,
      "elements": [
        {
          "type": "tagbox",
          "name": "q1",
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 75,
          "showOtherItem": true
        }
      ],
      "showQuestionNumbers": false
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.visibleChoices.length).toBe(1);
    expect(question.visibleChoices[0].id).toBe("other");
    expect(question.visibleChoices[0].value).toBe("other");

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.visibleChoices.length).toBe(71);
    expect(question.visibleChoices[0].value).toBe(1);
    expect(question.visibleChoices[69].value).toBe(70);
    expect(question.visibleChoices[70].id).toBe("other");
    expect(question.visibleChoices[70].value).toBe("other");

    question.renderedValue = ["other"];
    expect(question.value, "#1").toEqualValues(["other"]);
    question.otherValue = "text1";
    expect(question.value, "#2").toEqualValues(["text1"]);
    expect(survey.data, "#3").toEqualValues({ q1: ["text1"] });
  });
  test("lazy loading: A value disappears when open tagbox popup again", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const list: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(30);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[29].value).toBe(30);

    list.flushUpdates();
    list.onItemClick(list.renderedActions[28]);
    expect(question.value).toEqualValues([29]);
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedItems[0].value).toBe(29);

    question.dropdownListModel["updateQuestionChoices"]();
    doneCallback(opts[1]);
    expect(question.choices.length).toBe(60);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[59].value).toBe(60);

    list.flushUpdates();
    list.onItemClick(list.renderedActions[55]);
    expect(question.value).toEqualValues([29, 56]);
    expect(question.selectedItems.length, "selected items length 1").toBe(2);
    expect(question.selectedItems[0].value, "selected items[0] value 29 1").toBe(29);
    expect(question.selectedItems[0].text, "selected items[0] text 29 1").toBe("DisplayText_29");
    expect(question.selectedItems[1].value, "selected items[1] value 56 1").toBe(56);
    expect(question.selectedItems[1].text, "selected items[1] value 56 1").toBe("DisplayText_56");

    question.dropdownListModel.popupModel.hide();
    expect(question.value).toEqualValues([29, 56]);
    expect(question.selectedItems.length, "selected items length 2").toBe(2);
    expect(question.selectedItems[0].value, "selected items[0] value 29 2").toBe(29);
    expect(question.selectedItems[0].text, "selected items[0] text 29 2").toBe("DisplayText_29");
    expect(question.selectedItems[1].value, "selected items[1] value 56 2").toBe(56);
    expect(question.selectedItems[1].text, "selected items[1] value 56 2").toBe("DisplayText_56");

    question.dropdownListModel.popupModel.show();
    expect(question.value).toEqualValues([29, 56]);
    expect(question.selectedItems.length, "selected items length 3").toBe(2);
    expect(question.selectedItems[0].value, "selected items[0] value 29 3").toBe(29);
    expect(question.selectedItems[0].text, "selected items[0] text 29 3").toBe("DisplayText_29");
    expect(question.selectedItems[1].value, "selected items[1] value 56 3").toBe(56);
    expect(question.selectedItems[1].text, "selected items[1] value 56 3").toBe("DisplayText_56");

    doneCallback(opts[2]);
    expect(question.value).toEqualValues([29, 56]);
    expect(question.selectedItems.length, "selected items length 4").toBe(2);
    expect(question.selectedItems[0].value, "selected items[0] value 29 4").toBe(29);
    expect(question.selectedItems[0].text, "selected items[0] text 29 4").toBe("DisplayText_29");
    expect(question.selectedItems[1].value, "selected items[1] value 56 4").toBe(56);
    expect(question.selectedItems[1].text, "selected items[1] value 56 4").toBe("DisplayText_56");
    expect(question.choices.length).toBe(30);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[29].value).toBe(30);
  });

  function getObjectArray(skip = 1, count = 25): Array<{ value: any, text: string }> {
    const result: Array<{ value: any, text: string }> = [];
    for (let index = skip; index < (skip + count); index++) {
      result.push({ value: index, text: "DisplayText_" + index });
    }
    return result;
  }
  test("lazy loading + onGetChoiceDisplayValue: defaultValue", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "defaultValue": [52, 55],
        "choicesLazyLoadEnabled": true
      },
      {
        "type": "text",
        "name": "q2",
        "title": "{q1}"
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const questionTitle = <QuestionTagboxModel>survey.getAllQuestions()[1];
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);
    expect(question.value).toEqualValues([52, 55]);
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(2);
    expect(question.selectedItems[0].value, "question.selectedItems[0] value").toBe(52);
    expect(question.selectedItems[0].text, "question.selectedItems[0] text").toBe("DisplayText_52");
    expect(question.selectedItems[1].value, "question.selectedItems[1] value").toBe(55);
    expect(question.selectedItems[1].text, "question.selectedItems[1] text").toBe("DisplayText_55");
    expect(questionTitle.locTitle.textOrHtml, "display text is correct").toBe("DisplayText_52, DisplayText_55");

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[24].value).toBe(25);
    expect(question.value).toEqualValues([52, 55]);
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(2);
    expect(question.selectedItems[0].value, "question.selectedItems[0] value").toBe(52);
    expect(question.selectedItems[0].text, "question.selectedItems[0] text").toBe("DisplayText_52");
    expect(question.selectedItems[1].value, "question.selectedItems[1] value").toBe(55);
    expect(question.selectedItems[1].text, "question.selectedItems[1] text").toBe("DisplayText_55");
  });

  test("lazy loading + onGetChoiceDisplayValue: defaultValue is object", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "defaultValue": [{ id: 52 }, { id: 55 }],
        "choicesLazyLoadEnabled": true
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item.id)));
      }
    });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);
    expect(question.value).toEqualValues([{ id: 52 }, { id: 55 }]);
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(2);
    expect(question.selectedItems[0].value.id, "question.selectedItems[0] value").toBe(52);
    expect(question.selectedItems[0].text, "question.selectedItems[0] text").toBe("DisplayText_52");
    expect(question.selectedItems[1].value.id, "question.selectedItems[1] value").toBe(55);
    expect(question.selectedItems[1].text, "question.selectedItems[1] text").toBe("DisplayText_55");

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[24].value).toBe(25);
    expect(question.value).toEqualValues([{ id: 52 }, { id: 55 }]);
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(2);
    expect(question.selectedItems[0].value.id, "question.selectedItems[0] value").toBe(52);
    expect(question.selectedItems[0].text, "question.selectedItems[0] text").toBe("DisplayText_52");
    expect(question.selectedItems[1].value.id, "question.selectedItems[1] value").toBe(55);
    expect(question.selectedItems[1].text, "question.selectedItems[1] text").toBe("DisplayText_55");
  });

  test("lazy loading + onGetChoiceDisplayValue: set survey data", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });
    survey.data = { "q1": [52, 55] };

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);
    expect(question.value).toEqualValues([52, 55]);
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(2);
    expect(question.selectedItems[0].value, "question.selectedItems[0] value").toBe(52);
    expect(question.selectedItems[0].text, "question.selectedItems[0] text").toBe("DisplayText_52");
    expect(question.selectedItems[1].value, "question.selectedItems[1] value").toBe(55);
    expect(question.selectedItems[1].text, "question.selectedItems[1] text").toBe("DisplayText_55");

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[24].value).toBe(25);
    expect(question.value).toEqualValues([52, 55]);
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(2);
    expect(question.selectedItems[0].value, "question.selectedItems[0] value").toBe(52);
    expect(question.selectedItems[0].text, "question.selectedItems[0] text").toBe("DisplayText_52");
    expect(question.selectedItems[1].value, "question.selectedItems[1] value").toBe(55);
    expect(question.selectedItems[1].text, "question.selectedItems[1] text").toBe("DisplayText_55");

    question.renderedValue = [52, 55, 10];
    expect(question.value).toEqualValues([52, 55, 10]);
    expect(question.selectedItems.length, "question.selectedItems.length").toBe(3);
    expect(question.selectedItems[0].value, "question.selectedItems[0] value").toBe(52);
    expect(question.selectedItems[0].text, "question.selectedItems[0] text").toBe("DisplayText_52");
    expect(question.selectedItems[1].value, "question.selectedItems[1] value").toBe(55);
    expect(question.selectedItems[1].text, "question.selectedItems[1] text").toBe("DisplayText_55");
    expect(question.selectedItems[2].value, "question.selectedItems[2] value").toBe(10);
    expect(question.selectedItems[2].text, "question.selectedItems[2] text").toBe("DisplayText_10");
  });

  test("lazy loading data is lost: defaultValue", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "defaultValue": [52, 55],
        "choicesLazyLoadEnabled": true
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    expect(survey.data, "before doComplete before item load").toEqualValues({ "q1": [52, 55] });
    survey.doComplete();
    expect(survey.data, "after doComplete before item load").toEqualValues({ "q1": [52, 55] });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);
    expect(question.value).toEqualValues([52, 55]);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(25);
    expect(question.value).toEqualValues([52, 55]);

    expect(survey.data, "before doComplete after item load").toEqualValues({ "q1": [52, 55] });
    survey.doComplete();
    expect(survey.data, "after doComplete after item load").toEqualValues({ "q1": [52, 55] });
  });

  test("lazy loading data is lost: set survey data", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });
    survey.data = { "q1": [52, 55] };
    expect(survey.data, "before doComplete before item load").toEqualValues({ "q1": [52, 55] });
    survey.doComplete();
    expect(survey.data, "after doComplete before item load").toEqualValues({ "q1": [52, 55] });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.choices.length).toBe(0);
    expect(question.value).toEqualValues([52, 55]);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(25);
    expect(question.value).toEqualValues([52, 55]);

    question.renderedValue = [52, 55, 10];
    expect(question.value).toEqualValues([52, 55, 10]);
    expect(survey.data, "before doComplete after item load").toEqualValues({ "q1": [52, 55, 10] });
    survey.doComplete();
    expect(survey.data, "after doComplete after item load").toEqualValues({ "q1": [52, 55, 10] });
  });

  test("lazy loading + change filter string", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const itemsSettings = question.dropdownListModel["itemsSettings"];

    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);
    expect(itemsSettings.skip).toBe(0);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(0);
    expect(itemsSettings.items.length).toBe(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[24].value).toBe(25);
    expect(itemsSettings.skip).toBe(25);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(70);
    expect(itemsSettings.items.length).toBe(25);

    question.dropdownListModel.filterString = "2";
    doneCallback(opts[1]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(2);
    expect(question.choices[24].value).toBe(123);
    expect(itemsSettings.skip).toBe(25);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(70);
    expect(itemsSettings.items.length).toBe(25);

    question.dropdownListModel.filterString = "22";
    doneCallback(opts[2]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(22);
    expect(question.choices[24].value).toBe(1223);
    expect(itemsSettings.skip).toBe(25);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(70);
    expect(itemsSettings.items.length).toBe(25);
  });

  test("lazy loading + change listModel filter string", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const itemsSettings = question.dropdownListModel["itemsSettings"];
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);
    expect(itemsSettings.skip).toBe(0);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(0);
    expect(itemsSettings.items.length).toBe(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(1);
    expect(question.choices[24].value).toBe(25);
    expect(itemsSettings.skip).toBe(25);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(70);
    expect(itemsSettings.items.length).toBe(25);

    listModel.filterString = "2";
    doneCallback(opts[1]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(2);
    expect(question.choices[24].value).toBe(123);
    expect(itemsSettings.skip).toBe(25);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(70);
    expect(itemsSettings.items.length).toBe(25);

    listModel.filterString = "22";
    doneCallback(opts[2]);
    expect(question.choices.length).toBe(25);
    expect(question.choices[0].value).toBe(22);
    expect(question.choices[24].value).toBe(1223);
    expect(itemsSettings.skip).toBe(25);
    expect(itemsSettings.take).toBe(25);
    expect(itemsSettings.totalCount).toBe(70);
    expect(itemsSettings.items.length).toBe(25);
  });

  test("Check tagbox in mobile mode with closeOnSelect true", assert => {
    _setIsTouch(true);
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "closeOnSelect": false,
        "choices": ["Item 1", "Item 2", "Item 3"]
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popupModel = dropdownListModel.popupModel;
    const popupViewModel = new PopupDropdownViewModel(popupModel);
    const doneAction = popupViewModel.footerToolbar.actions[1];
    const cancelAction = popupViewModel.footerToolbar.actions[0];
    const listModel = dropdownListModel["listModel"];
    const actions = listModel.actions;

    popupModel.show();
    expect(doneAction.enabled).toBeFalsy();
    listModel.onItemClick(actions[0]);
    expect(doneAction.enabled).toBeTruthy();
    doneAction.action();
    expect(question.value).toEqualValues(["Item 1"]);

    popupModel.show();
    expect(doneAction.enabled).toBeFalsy();
    listModel.onItemClick(actions[1]);
    expect(doneAction.enabled).toBeTruthy();
    expect(question.value).toEqualValues(["Item 1", "Item 2"]);
    cancelAction.action();
    expect(question.value).toEqualValues(["Item 1"]);

    popupModel.show();
    expect(doneAction.enabled).toBeFalsy();
    listModel.onItemClick(actions[0]);
    expect(doneAction.enabled).toBeTruthy();
    doneAction.action();
    expect(question.value).toEqualValues([]);
    _setIsTouch(false);
  });
  test("Tagbox focusFirstInputSelector mobile && hideSelectedItems", () => {
    _setIsTouch(true);
    const survey = new SurveyModel({
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "hideSelectedItems": false,
        "choices": ["Item 1", "Item 2", "Item 3"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popupModel = dropdownListModel.popupModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    popupModel.isVisible = true;
    expect(popupModel.focusFirstInputSelector, "value = undefined && isTouch = true && hideSelectedItems = false").toBe(".sv-list__item");

    list.onItemClick(list.actions[0]);
    popupModel.isVisible = false;

    popupModel.isVisible = true;
    expect(popupModel.focusFirstInputSelector, "isTouch=true && value = 'item1' && hideSelectedItems = false").toBe(".sv-list__item--selected");

    list.onItemClick(list.actions[0]);
    question.hideSelectedItems = true;

    popupModel.isVisible = false;

    popupModel.isVisible = true;
    expect(popupModel.focusFirstInputSelector, "value = undefined && isTouch = true && hideSelectedItems = true").toBe(".sv-list__item");

    list.onItemClick(list.actions[0]);
    popupModel.isVisible = false;

    popupModel.isVisible = true;
    expect(popupModel.focusFirstInputSelector, "isTouch=true && value = 'item1' && hideSelectedItems = true").toBe(".sv-list__item");
    _setIsTouch(false);
  });

  test("Tagbox closeOnSelect", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        showOtherItem: "true",
        choices: [
          "item1",
          "item2",
          "item3",
          "item4",
          "item5"
        ]
      },
      {
        type: "tagbox",
        name: "question2",
        showOtherItem: "true",
        closeOnSelect: true,
        choices: [
          "item1",
          "item2",
          "item3",
          "item4",
          "item5"
        ]
      },
      {
        type: "tagbox",
        name: "question3",
        showOtherItem: "true",
        closeOnSelect: "false",
        choices: [
          "item1",
          "item2",
          "item3",
          "item4",
          "item5"
        ]
      },
      {
        type: "tagbox",
        name: "question4",
        showOtherItem: "true",
        closeOnSelect: "true",
        choices: [
          "item1",
          "item2",
          "item3",
          "item4",
          "item5"
        ]
      }]
    });
    const question1 = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const question2 = <QuestionTagboxModel>survey.getAllQuestions()[1];
    const question3 = <QuestionTagboxModel>survey.getAllQuestions()[2];
    const question4 = <QuestionTagboxModel>survey.getAllQuestions()[3];
    expect(question1.closeOnSelect).toBe(false);
    expect(question2.closeOnSelect).toBe(true);
    expect(question3.closeOnSelect).toBe(false);
    expect(question4.closeOnSelect).toBe(true);
  });

  test("Tagbox settings.tagboxCloseOnSelect", () => {
    settings.tagboxCloseOnSelect = true;
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        choices: [
          "item1",
          "item2",
          "item3",
          "item4",
          "item5"
        ]
      },
      {
        type: "tagbox",
        name: "question2",
        choices: [
          "item1",
          "item2",
          "item3",
          "item4",
          "item5"
        ]
      }]
    });
    const question1 = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const question2 = <QuestionTagboxModel>survey.getAllQuestions()[1];
    expect(question1.closeOnSelect).toBe(true);
    expect(question2.closeOnSelect).toBe(true);
    settings.tagboxCloseOnSelect = false;
  });

  test("maxSelectedChoices in tagbox", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        maxSelectedChoices: 2,
        defaultValue: ["item1"],
        choices: [
          "item1",
          "item2",
          "item3",
          "item4"
        ]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    expect(list.actions.length).toBe(4);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.actions[0].enabled).toBe(true);
    expect(list.actions[1].enabled).toBe(true);
    expect(list.actions[2].enabled).toBe(true);
    expect(list.actions[3].enabled).toBe(true);
    expect(question.value).toEqualValues(["item1"]);

    list.onItemClick(list.actions[1]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(2);
    expect(list.actions[0].enabled).toBe(true);
    expect(list.actions[1].enabled).toBe(true);
    expect(list.actions[2].enabled).toBe(false);
    expect(list.actions[3].enabled).toBe(false);
    expect(question.value).toEqualValues(["item1", "item2"]);

    list.onItemClick(list.actions[3]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(2);
    expect(list.actions[0].enabled).toBe(true);
    expect(list.actions[1].enabled).toBe(true);
    expect(list.actions[2].enabled).toBe(false);
    expect(list.actions[3].enabled).toBe(false);
    expect(question.value).toEqualValues(["item1", "item2"]);

    list.onItemClick(list.actions[1]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(1);
    expect(list.actions[0].enabled).toBe(true);
    expect(list.actions[1].enabled).toBe(true);
    expect(list.actions[2].enabled).toBe(true);
    expect(list.actions[3].enabled).toBe(true);
    expect(question.value).toEqualValues(["item1"]);
  });

  test("reset filterstring after select item", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        defaultValue: ["item1"],
        choices: [
          "item1",
          "item2",
          "item3",
          "item4"
        ]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    list.flushUpdates();
    expect(list.actions.length).toBe(4);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(4);
    expect(dropdownListModel.inputStringRendered).toBe("");
    expect(dropdownListModel.filterString).toBe("");

    dropdownListModel.inputStringRendered = "1";
    list.flushUpdates();
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(1);
    expect(dropdownListModel.inputStringRendered).toBe("1");
    expect(dropdownListModel.filterString).toBe("1");

    list.onItemClick(list.renderedActions.filter(item => list.isItemVisible(item))[0]);
    list.flushUpdates();
    expect(dropdownListModel.inputStringRendered).toBe("");
    expect(dropdownListModel.filterString).toBe("");
  });

  test("TagBox displays a value which doesn't exist in a list of choices #6293", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        choices: ["Item 1", "Item 2", "Item 3"]
      }]
    });
    survey.data = {
      question1: ["value1"]
    };
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.value.length).toBe(1);
    expect(question.selectedChoices.length).toBe(0);
    expect(survey.data).toEqualValues({
      "question1": ["value1"],
    });
  });

  test("TagBox displays a value as Other if it doesn't exist in a list of choices", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        showOtherItem: true,
        choices: ["Item 1", "Item 2", "Item 3"]
      }]
    });
    survey.data = {
      question1: ["value1"]
    };
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.value.length).toBe(1);
    expect(question.selectedChoices.length).toBe(1);
    expect(question.selectedChoices[0].id).toBe("other");
    expect(survey.data).toEqualValues({
      question1: ["value1"],
      "question1-Comment": "value1"
    });
  });
  test("TagBox displays a value if list of choices is empty", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        choices: ["Item 1", "Item 2", "Item 3"]
      }]
    });
    survey.data = {
      question1: ["Item 1"]
    };
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.value.length).toBe(1);
    expect(question.value[0]).toBe("Item 1");
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedItems[0].id).toBe("Item 1");

    question.setPropertyValue("visibleChoices", []);
    expect(question.value.length).toBe(1);
    expect(question.value[0]).toBe("Item 1");
    expect(question.selectedItems.length).toBe(0);
  });
  test("TagBox readOnlyText property should be reactive, Bug#6830", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "q1",
        placeholder: {
          default: "en-sel",
          de: "de-sel"
        },
        choices: ["Item 1", "Item 2", "Item 3"]
      }]
    });
    const q = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(q.readOnlyText, "Empty en").toBe("en-sel");
    expect(q.dropdownListModel.filterStringPlaceholder, "dropdownlist en").toBe("en-sel");
    q.value = ["Item 1"];
    expect(q.readOnlyText, "has value").toBe("Item 1");
    q.clearValue();
    expect(q.readOnlyText, "Empty en, #2").toBe("en-sel");
    survey.locale = "de";
    expect(q.readOnlyText, "Empty de").toBe("de-sel");
    expect(q.dropdownListModel.filterStringPlaceholder, "dropdownlist de").toBe("de-sel");
    survey.locale = "";
    expect(q.readOnlyText, "Empty en, #3").toBe("en-sel");
    expect(q.dropdownListModel.filterStringPlaceholder, "dropdownlist en, #3").toBe("en-sel");
  });

  test("Test update readOnlyText after onGetChoiceDisplayValue", () => {
    const json = {
      elements: [
        {
          name: "q1",
          type: "tagbox",
          choicesLazyLoadEnabled: true,
          defaultValue: ["FRA"],
        },
      ],
    };
    const survey = new SurveyModel(json);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      options.setItems(["France"]);
    });

    expect(question.value).toEqualValues(["FRA"]);
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedItems[0].value).toBe("FRA");
    expect(question.selectedItems[0].text).toBe("France");
    expect(question.readOnlyText, "readOnlyText").toBe("France");
  });

  test("question.showClearButton", assert => {
    const json = {
      elements: [
        {
          "type": "tagbox",
          "name": "q1",
          "placeholder": "New placeholder",
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen"
          ]
        }]
    };
    const survey = new SurveyModel(json);
    const q = <QuestionTagboxModel>survey.getQuestionByName("q1");
    expect(q.showClearButton, "question is empty").toBe(false);
    q.value = "Ford";
    expect(q.showClearButton, "question is not empty").toBe(true);
    q.allowClear = false;
    expect(q.showClearButton, "allowClear is false").toBe(false);
    q.allowClear = true;
    survey.setDesignMode(true);
    expect(q.showClearButton, "Creator V2").toBe(true);
  });
  test("lazy loading: maxSelectedChoices limit stops working if you clear the value", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "defaultValue": [1],
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30,
        "maxSelectedChoices": 2
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.value).toEqualValues([1]);
    expect(question.choices.length).toBe(30);
    for (let index = 0; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is enabled before clear").toBeTruthy();
    }

    list.onItemClick(list.actions[1]);
    expect(question.value).toEqualValues([1, 2]);
    expect(list.actions[0].enabled, "action 1 is enabled before clear").toBeTruthy();
    expect(list.actions[1].enabled, "action 2 is enabled before clear").toBeTruthy();
    for (let index = 2; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is disabled before clear").toBeFalsy();
    }
    question.dropdownListModel.popupModel.hide();
    question.dropdownListModel.onClear({
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    });

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[1]);
    expect(question.value, "question value is empty").toEqualValues([]);
    list.onItemClick(list.actions[0]);
    expect(question.value, "question value is [1]").toEqualValues([1]);

    for (let index = 0; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is enabled after clear").toBeTruthy();
    }

    list.onItemClick(list.actions[1]);
    expect(question.value, "question value is [1, 2] after clear").toEqualValues([1, 2]);
    expect(list.actions[0].enabled, "action 1 is enabled after clear").toBeTruthy();
    expect(list.actions[1].enabled, "action 2 is enabled after clear").toBeTruthy();
    for (let index = 2; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is disabled after clear").toBeFalsy();
    }
  });
  test("lazy loading & maxSelectedChoices: Items remains disabled when unselecting choices within a drop-down list", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "defaultValue": [1],
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30,
        "maxSelectedChoices": 2
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(question.choicesLazyLoadEnabled).toBe(true);
    expect(question.choices.length).toBe(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.value).toEqualValues([1]);
    expect(question.choices.length).toBe(30);
    for (let index = 0; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is enabled before unselecting choice").toBeTruthy();
    }

    list.onItemClick(list.actions[1]);
    expect(question.value).toEqualValues([1, 2]);
    expect(list.actions[0].enabled, "action 1 is enabled before unselecting choice").toBeTruthy();
    expect(list.actions[1].enabled, "action 2 is enabled before unselecting choice").toBeTruthy();
    for (let index = 2; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is disabled before unselecting choice").toBeFalsy();
    }
    question.dropdownListModel.popupModel.hide;
    question.dropdownListModel.popupModel.show();
    expect(question.value, "question value is [1, 2]").toEqualValues([1, 2]);
    expect(list.actions[0].enabled, "action 1 is enabled").toBeTruthy();
    expect(list.actions[1].enabled, "action 2 is enabled").toBeTruthy();
    for (let index = 2; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is disabled").toBeFalsy();
    }

    list.onItemClick(list.actions[1]);
    expect(question.value, "question value is [1]").toEqualValues([1]);
    for (let index = 0; index < list.actions.length - 1; index++) {
      expect(list.actions[index].enabled, list.actions[index].id + " is enabled after unselecting choice").toBeTruthy();
    }
  });
  test("Can clear tagbox value", assert => {
    const json = {
      elements: [{
        "type": "matrixdynamic",
        "name": "detailTable",
        "columns": [
          {
            "name": "showDetails",
          }
        ],
        "detailElements": [
          {
            "type": "tagbox",
            "name": "detailTypes",
            "visibleIf": "{row.showDetails} = 'true'",
            "clearIfInvisible": "onHidden",
            "requiredIf": "{row.showDetails} = 'true'",
            "choices": ["a", "b"]
          }
        ],
        "detailPanelMode": "underRow",
        "cellType": "text"
      }
      ]
    };
    const survey = new SurveyModel(json);

    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const row = matrix.visibleRows[0];
    row.showDetailPanel();
    const question = row.getQuestionByName("detailTypes");
    expect(question, "There is no exception").toBeTruthy();
  });

  test("Check readOnly tagbox with markdown", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "tagbox",
          name: "q1",
          choices: [
            "item1",
            "item2",
            "item3",
            "item4"
          ]
        }
      ]
    });
    survey.onGetQuestionDisplayValue.add((sender, options) => {
      const strs = options.displayValue.split(",");
      options.displayValue = strs.join(" | ");
    });
    const q1 = survey.getQuestionByName("q1") as QuestionTagboxModel;

    survey.readOnly = true;
    survey.data = { q1: ["item1", "item2", "item3"] };

    expect(q1.displayValue).toBe("item1 |  item2 |  item3");
    expect(q1.readOnlyText).toBe("item1 |  item2 |  item3");
  });

  test("Tagbox searchmode filter options", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        searchEnabled: true,
        searchMode: "startsWith",
        choices: [
          "abc",
          "abd",
          "cab",
          "efg"
        ]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.searchMode).toBe("startsWith");
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    dropdownListModel.filterString = "ab";
    list.flushUpdates();
    const getfilteredItems = () => list.renderedActions.filter(item => list.isItemVisible(item));

    expect(list.renderedActions.length).toBe(4);
    expect(getfilteredItems().length).toBe(2);

    question.searchMode = "contains";
    list.flushUpdates();
    expect(list.renderedActions.length).toBe(4);
    expect(getfilteredItems().length).toBe(3);
  });

  test("Tagbox readonly", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        readOnly: true,
        choices: [
          "1",
          "2",
          "3"
        ],
        "showSelectAllItem": true
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.readOnlyText).toBe("Select...");
  });
  test("Create tag box in the code, dropdownListModel instance", () => {
    const survey = new SurveyModel();
    const question = new QuestionTagboxModel("q1");
    const page = new PageModel("page1");
    page.addQuestion(question);
    expect(!!question["dropdownListModelValue"], "It is not created yet #1").toBeFalsy();
    survey.addPage(page);
    expect(!!question["dropdownListModelValue"], "It is not created yet #2").toBeFalsy();
    expect(!!question.dropdownListModel, "It is created on demand").toBeTruthy();
  });
  test("Create tag box from json, dropdownListModel instance", () => {
    const survey = new SurveyModel({
      elements: [{ type: "tagbox", name: "q1" }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.dropdownListModel, "It is created").toBeTruthy();
  });

  test("Prevoiusly selected options disappear", () => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "defaultValue": [5],
        "choicesLazyLoadEnabled": true
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(question.value, "question value").toEqualValues([5]);
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedChoices.length).toBe(1);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    dropdownListModel.inputStringRendered = "777";
    expect(question.value, "question value").toEqualValues([5]);
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedChoices.length).toBe(1);
    doneCallback(opts[1]);
    list.onItemClick(list.actions[0]);
    expect(question.value, "question value").toEqualValues([5, 777]);
    expect(question.selectedItems.length).toBe(2);
    expect(question.selectedChoices.length).toBe(2);
    doneCallback(opts[2]);
    dropdownListModel.inputStringRendered = "888";
    expect(question.value, "question value").toEqualValues([5, 777]);
    expect(question.selectedItems.length).toBe(2);
    expect(question.selectedChoices.length).toBe(2);
    doneCallback(opts[3]);
    expect(question.value, "question value").toEqualValues([5, 777]);
    expect(question.selectedItems.length).toBe(2);
    expect(question.selectedChoices.length).toBe(2);
  });

  test("The new selected value is replaced with the the default value while searching #8751", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "closeOnSelect": true,
        "choicesLazyLoadEnabled": true,
        "defaultValue": [222],
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(question.value, "question value #1").toEqualValues([222]);
    expect(question.selectedChoices.length).toBe(1);

    dropdownListModel.onClear(null);
    expect(question.value, "question value #2").toEqualValues([]);
    expect(question.selectedChoices.length).toBe(0);
    dropdownListModel.inputStringRendered = "999";
    doneCallback(opts[0]);
    expect(question.value, "question value #3").toEqualValues([]);
    expect(question.selectedChoices.length).toBe(0);
    doneCallback(opts[1]);
    list.onItemClick(list.actions[0]);
    expect(question.value, "question value #4").toEqualValues([999]);
    expect(question.selectedChoices.length).toBe(1);
    expect(question.selectedChoices[0].value, "question.selectedChoices[0] value #1").toBe(999);
    doneCallback(opts[2]);
    expect(question.value, "question value #5").toEqualValues([999]);
    expect(question.selectedChoices.length).toBe(1);
    expect(question.selectedChoices[0].value, "question.selectedChoices[0] value #2").toBe(999);
  });

  test("The new selected value is always replaced with the the first selected value while searching #8751", assert => {
    const json = {
      elements: [{
        "type": "tagbox",
        "name": "q1",
        "closeOnSelect": true,
        "choicesLazyLoadEnabled": true,
      }]
    };
    const survey = new SurveyModel(json);
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(question.value, "question value is empty").toEqualValues([]);
    expect(question.selectedChoices.length).toBe(0);

    dropdownListModel.inputStringRendered = "222";
    doneCallback(opts[0]);
    list.onItemClick(list.actions[0]);
    expect(question.value, "question value #1").toEqualValues([222]);
    expect(question.selectedChoices.length).toBe(1);
    doneCallback(opts[1]);
    dropdownListModel.onClear(null);
    expect(question.value, "question value #2").toEqualValues([]);
    expect(question.selectedChoices.length).toBe(0);
    doneCallback(opts[2]);
    dropdownListModel.inputStringRendered = "999";
    expect(question.value, "question value #3").toEqualValues([]);
    expect(question.selectedChoices.length).toBe(0);
    doneCallback(opts[3]);
    list.onItemClick(list.actions[0]);
    expect(question.value, "question value #4").toEqualValues([999]);
    expect(question.selectedChoices.length).toBe(1);
    expect(question.selectedChoices[0].value, "question.selectedChoices[0] value #1").toBe(999);
    doneCallback(opts[4]);
    expect(question.value, "question value #5").toEqualValues([999]);
    expect(question.selectedChoices.length).toBe(1);
    expect(question.selectedChoices[0].value, "question.selectedChoices[0] value #2").toBe(999);
  });
  test("rendering actions id", assert => {
    const json = {
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: false,
        choices: ["Item1", "Item2"]
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionTagboxModel>survey.getQuestionByName("q1");
    expect(question["dropdownListModelValue"], "It is not created yet").toBeFalsy();
    question.id = "el1";
    const listModel = question.popupModel.contentComponentData.model as MultiSelectListModel;
    listModel.flushUpdates();
    const actions = listModel.renderedActions;
    expect(actions.length, "two actions").toBe(2);
    expect((<IAction>actions[0]).elementId, "elementId, action1").toBe("el1i_listItem1");
    expect((<IAction>actions[1]).elementId, "elementId, action2").toBe("el1i_listItem2");
    expect((<IAction>actions[0]).disableTabStop, "disableTabStop, action1").toBe(true);
    expect((<IAction>actions[1]).disableTabStop, "disableTabStop, action2").toBe(true);
  });
  test("List actions disableTabStop", assert => {
    const json = {
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: true,
        choices: ["Item1", "Item2"]
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionTagboxModel>survey.getQuestionByName("q1");
    question.dropdownListModel.inputStringRendered = "o";
    const listModel = question.popupModel.contentComponentData.model as MultiSelectListModel;
    listModel.flushUpdates();
    const actions = listModel.renderedActions;
    expect(actions.length, "two actions").toBe(2);
    expect((<IAction>actions[0]).disableTabStop, "disableTabStop, action1").toBe(true);
    expect((<IAction>actions[1]).disableTabStop, "disableTabStop, action2").toBe(true);
  });

  test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: false", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: "false",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testExistValue = "item2";
    const testCustomValue = "item10";
    listModel.flushUpdates();

    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toBe(false);
    expect(dropdownListModel.inputStringRendered, "#1 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#1 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#1 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(4);

    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toBe(false);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#2 listModel is empty").toBe(true);
    expect(listModel.actions.length, "#2 listModel.actions").toBe(4);

    question.allowCustomChoices = true;
    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#3 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#3 customValue").toBe(testCustomValue);
    expect(listModel.isEmpty, "#3 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#3 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#3 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#3 custom item text").toBe("Create \"item10\" item...");
    expect(listModel.actions[4].visible, "#3 custom item visible").toBe(true);

    dropdownListModel.inputStringRendered = testExistValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#4 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#4 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#4 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#4 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#4 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#4 custom item text").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#4 custom item invisible").toBe(false);

    dropdownListModel.inputStringRendered = testExistValue + "test";
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#5 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#5 customValue").toBe(testExistValue + "test");
    expect(listModel.isEmpty, "#5 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#5 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#5 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#5 custom item text").toBe("Create \"item2test\" item...");
    expect(listModel.actions[4].visible, "#5 custom item visible").toBe(true);
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toBe(true);

    dropdownListModel.popupModel.hide();
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#6 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#6 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#6 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#6 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#6 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#6 custom item text").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#6 custom item invisible").toBe(false);
  });

  test("allowCustomChoices: Add custom value if searchEnabled: false", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: false, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testCustomValue = "item10";

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(listModel.actions.length, "#1 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#1 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#1 custom item visible").toBe(true);
    expect(question.value.length, "#1 question.value").toBe(0);
    expect(question.selectedItems.length, "#1 question.selectedItems").toBe(0);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toBe(4);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.actions.length, "#2 listModel.actions").toBe(6);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toBe(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toBe(testCustomValue);
    expect(listModel.actions[5].id, "#2 custom item id").toBe("newCustomItem");
    expect(listModel.actions[5].visible, "#2 custom item invisible").toBe(false);
    expect(question.value.length, "#2 question.value.length").toBe(1);
    expect(question.value, "#2 question.value").toEqualValues([testCustomValue]);
    expect(question.selectedItems.length, "#2 question.selectedItems.length").toBe(1);
    expect(question.selectedItems[0].id, "#2 question.selectedItems").toBe(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toBe(5);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toBe(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: [testCustomValue] });

    listModel.onItemClick(listModel.actions[1]);
    expect(dropdownListModel.inputStringRendered, "#3 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#3 customValue").toBeUndefined();
    expect(listModel.actions.length, "#3 listModel.actions").toBe(6);
    expect(listModel.actions[0].id, "#3 custom value add into list - id").toBe(testCustomValue);
    expect(listModel.actions[0].title, "#3 custom value add into list - title").toBe(testCustomValue);
    expect(listModel.actions[5].id, "#3 custom item id").toBe("newCustomItem");
    expect(listModel.actions[5].visible, "#3 custom item invisible").toBe(false);
    expect(question.value.length, "#3 question.value.length").toBe(2);
    expect(question.value, "#3 question.value").toEqualValues([testCustomValue, "item1"]);
    expect(question.selectedItems.length, "#3 question.selectedItems.length").toBe(2);
    expect(question.selectedItems[0].id, "#3 question.selectedItems").toBe(testCustomValue);
    expect(question.visibleChoices.length, "#3 question.visibleChoices").toBe(5);
    expect(question.visibleChoices[0].value, "#3 question.visibleChoices[0]").toBe(testCustomValue);
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: [testCustomValue, "item1"] });

    survey.tryComplete();
    expect(survey.data, "#4 survey.data").toEqualValues({ q1: [testCustomValue, "item1"] });
  });

  test("allowCustomChoices: inputStringRendered isn't reset after backspace, if searchEnabled: false", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: "false", allowCustomChoices: "true",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const testCustomValue1 = "item101";

    const event = {
      keyCode: 8,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    dropdownListModel.inputStringRendered = testCustomValue1;
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#1 customValue").toBe(testCustomValue1);
    expect(dropdownListModel.hintStringPrefix, "#1 hintStringPrefix").toBe("");
    expect(dropdownListModel.hintStringSuffix, "#1 hintStringSuffix").toBe("");

    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#2 customValue not empty").toBeTruthy();
    expect(dropdownListModel.hintStringPrefix, "#2 hintStringPrefix").toBe("");
    expect(dropdownListModel.hintStringSuffix, "#2 hintStringSuffix").toBe("");
  });

  test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: "true",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testExistValue = "item2";
    const testCustomValue = "item10";

    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toBe(false);
    expect(dropdownListModel.inputStringRendered, "#1 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#1 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#1 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(4);

    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toBe(false);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#2 listModel is empty").toBe(true);
    expect(listModel.actions.length, "#2 listModel.actions").toBe(4);

    question.allowCustomChoices = true;
    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#3 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#3 customValue").toBe(testCustomValue);
    expect(listModel.isEmpty, "#3 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#3 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#3 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#3 custom item text").toBe("Create \"item10\" item...");
    expect(listModel.actions[4].visible, "#3 custom item visible").toBe(true);

    dropdownListModel.inputStringRendered = testExistValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#4 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#4 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#4 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#4 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#4 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#4 custom item text").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#4 custom item invisible").toBe(false);

    dropdownListModel.inputStringRendered = testExistValue + "test";
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#5 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#5 customValue").toBe(testExistValue + "test");
    expect(listModel.isEmpty, "#5 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#5 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#5 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#5 custom item text").toBe("Create \"item2test\" item...");
    expect(listModel.actions[4].visible, "#5 custom item visible").toBe(true);
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toBe(true);

    dropdownListModel.popupModel.hide();
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#6 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#6 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#6 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#6 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#6 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#6 custom item text").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#6 custom item invisible").toBe(false);
  });

  test("allowCustomChoices: Add custom value if searchEnabled: true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: true, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testCustomValue = "item10";

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(listModel.actions.length, "#1 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#1 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#1 custom item visible").toBe(true);
    expect(question.value.length, "#1 question.value").toBe(0);
    expect(question.selectedItems.length, "#1 question.selectedItems").toBe(0);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toBe(4);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.actions.length, "#2 listModel.actions").toBe(6);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toBe(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toBe(testCustomValue);
    expect(listModel.actions[5].id, "#2 custom item id").toBe("newCustomItem");
    expect(listModel.actions[5].visible, "#2 custom item invisible").toBe(false);
    expect(question.value.length, "#2 question.value.length").toBe(1);
    expect(question.value, "#2 question.value").toEqualValues([testCustomValue]);
    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(1);
    expect(question.selectedItems[0].id, "#2 question.selectedItems").toBe(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toBe(5);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toBe(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: [testCustomValue] });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: [testCustomValue] });
  });

  test("allowCustomChoices: hintString with custom value if searchEnabled: true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: "true", allowCustomChoices: "true",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const testCustomValue1 = "item101";
    const testCustomValue2 = "item10";

    dropdownListModel.inputStringRendered = testCustomValue1;
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#1 customValue").toBe(testCustomValue1);
    expect(dropdownListModel.hintStringPrefix, "#1 hintStringPrefix").toBe("");
    expect(dropdownListModel.hintStringSuffix, "#1 hintStringSuffix").toBe("");

    dropdownListModel.inputStringRendered = testCustomValue2;
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#2 customValue").toBe(testCustomValue2);
    expect(dropdownListModel.hintStringPrefix, "#2 hintStringPrefix").toBe("");
    expect(dropdownListModel.hintStringSuffix, "#2 hintStringSuffix").toBe("");
  });

  test("allowCustomChoices: Option to create item not available if item exist (case-insensitive).", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: "true", allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testExistValue = "item2";

    dropdownListModel.inputStringRendered = testExistValue.toUpperCase();
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#1 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#1 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(4);
  });

  test("allowCustomChoices: onCreateCustomChoiceItem event.", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: true, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    survey.onCreateCustomChoiceItem.add(((sender, options) => {
      if (options.item.value === "item10") {
        options.item.text = options.item.value.toUpperCase();
      } else {
        options.allow = false;
      }
    }));
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testCustomValue = "item10";
    const testCustomValueUpperCase = testCustomValue.toUpperCase();

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(question.value.length, "#1 question.value").toBe(0);
    expect(question.selectedItems.length, "#1 question.selectedItems").toBe(0);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.actions[4]);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe("");
    expect(question.value.length, "#2 question.value.length").toBe(1);
    expect(question.value, "#2 question.value").toEqualValues([testCustomValue]);
    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(1);
    expect(question.selectedItems[0].value, "#2 question.selectedItems[0].id").toBe(testCustomValue);
    expect(question.selectedItems[0].text, "#2 question.selectedItems.text").toBe(testCustomValueUpperCase);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: [testCustomValue] });
    expect(listModel.actions[5].id, "#2 custom item id").toBe("newCustomItem");
    expect(listModel.actions[5].title, "#2 custom item text").toBe("newCustomItem");
    expect(listModel.actions[5].visible, "#2 custom item invisible").toBe(false);

    dropdownListModel.inputStringRendered = testCustomValue + "1";
    expect(question.value.length, "#3 question.value.length").toBe(1);
    expect(question.value, "#3 question.value").toEqualValues([testCustomValue]);

    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(1);
    expect(question.selectedItems[0].value, "#3 question.selectedItems[0].id").toBe(testCustomValue);
    expect(question.selectedItems[0].text, "#3 question.selectedItems.text").toBe(testCustomValueUpperCase);
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: [testCustomValue] });

    listModel.onItemClick(listModel.actions[5]);
    expect(dropdownListModel.inputStringRendered, "#4 inputStringRendered").toBe("");
    expect(question.value.length, "#4 question.value.length").toBe(1);
    expect(question.value, "#4 question.value").toEqualValues([testCustomValue]);

    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(1);
    expect(question.selectedItems[0].value, "#4 question.selectedItems[0].id").toBe(testCustomValue);
    expect(question.selectedItems[0].text, "#4 question.selectedItems.text").toBe(testCustomValueUpperCase);
    expect(survey.data, "#4 survey.data").toEqualValues({ q1: [testCustomValue] });
    expect(listModel.actions[5].id, "#4 custom item id").toBe("newCustomItem");
    expect(listModel.actions[5].title, "#4 custom item text").toBe("newCustomItem");
    expect(listModel.actions[5].visible, "#4 custom item invisible").toBe(false);
  });

  test("allowCustomChoices: Possibility of creating an element with custom value if choicesLazyLoadEnabled is true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: "true",
        "choicesLazyLoadEnabled": true, "choicesLazyLoadPageSize": 25
      }]
    });
    const locCallback = (opt: any) => {
      if (!!opt.filter && opt.filter !== "DisplayText_2") {
        opt.setItems([], 0);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), 55);
      }
    };
    let opts: Array<any> = [];
    survey.onChoicesLazyLoad.add((_, opt) => {
      opts.push(opt);
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testExistValue = "DisplayText_2";
    const testCustomValue1 = "customItem1";
    const testCustomValue2 = "customItem2";

    dropdownListModel.popupModel.show();
    locCallback(opts[0]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toBe(false);
    expect(dropdownListModel.inputStringRendered, "#1 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#1 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#1 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(26);

    dropdownListModel.inputStringRendered = testCustomValue1;
    locCallback(opts[1]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toBe(false);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe(testCustomValue1);
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#2 listModel is empty").toBe(true);
    expect(listModel.actions.length, "#2 listModel.actions").toBe(0);

    question.allowCustomChoices = true;
    dropdownListModel.inputStringRendered = testCustomValue2;
    locCallback(opts[2]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#3 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#3 customValue").toBe(testCustomValue2);
    expect(listModel.isEmpty, "#3 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#3 listModel.actions").toBe(1);
    expect(listModel.actions[0].id, "#3 custom item id").toBe("newCustomItem");
    expect(listModel.actions[0].title, "#3 custom item text").toBe("Create \"customItem2\" item...");
    expect(listModel.actions[0].visible, "#3 custom item visible").toBe(true);

    dropdownListModel.inputStringRendered = testExistValue;
    locCallback(opts[3]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#4 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#4 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#4 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#4 listModel.actions").toBe(27);
    expect(listModel.actions[25].id, "#4 custom item id").toBe("newCustomItem");
    expect(listModel.actions[25].title, "#4 custom item text").toBe("newCustomItem");
    expect(listModel.actions[25].visible, "#4 custom item invisible").toBe(false);

    dropdownListModel.inputStringRendered = testExistValue + "test";
    locCallback(opts[4]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#5 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#5 customValue").toBe(testExistValue + "test");
    expect(listModel.isEmpty, "#5 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#5 listModel.actions").toBe(1);
    expect(listModel.actions[0].id, "#5 custom item id").toBe("newCustomItem");
    expect(listModel.actions[0].title, "#5 custom item text").toBe("Create \"DisplayText_2test\" item...");
    expect(listModel.actions[0].visible, "#5 custom item visible").toBe(true);
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toBe(true);

    dropdownListModel.popupModel.hide();
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#6 allowCustomChoices").toBe(true);
    expect(dropdownListModel.customValue, "#6 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#6 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#6 listModel.actions").toBe(1);
    expect(listModel.actions[0].id, "#6 custom item id").toBe("newCustomItem");
    expect(listModel.actions[0].title, "#6 custom item text").toBe("newCustomItem");
    expect(listModel.actions[0].visible, "#6 custom item invisible").toBe(false);
  });

  test("allowCustomChoices: Add custom value if choicesLazyLoadEnabled is true", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "tagbox",
              "name": "country",
              "title": "Select a country",
              "choicesLazyLoadEnabled": true,
              "choicesLazyLoadPageSize": 25,
              "allowCustomChoices": true,
            }
          ]
        }
      ]
    });
    const locCallback = (opt: any) => {
      if (!!opt.filter) {
        opt.setItems([], 0);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), 55);
      }
    };
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => {
      opts.push(opt);
    });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testCustomValue = "testCustomValue";

    expect(question.visibleChoices.length).toBe(0);

    question.dropdownListModel.popupModel.show();
    locCallback(opts[0]);
    expect(question.visibleChoices.length).toBe(25);

    dropdownListModel.inputStringRendered = testCustomValue;
    locCallback(opts[1]);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(1);
    expect(listModel.actions[0].id, "#1 custom item id").toBe("newCustomItem");
    expect(listModel.actions[0].visible, "#1 custom item visible").toBe(true);
    expect(question.value.length, "#1 question.value").toBe(0);
    expect(question.selectedItems.length, "#1 question.selectedItems").toBe(0);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toBe(0);
    expect(survey.data, "#1 survey.data").toEqualValues({});
    expect(dropdownListModel.popupModel.isVisible, "#1 popupModel.isVisible").toBe(true);

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    locCallback(opts[2]);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.actions.length, "#2 listModel.actions").toBe(28);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toBe(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toBe(testCustomValue);
    expect(listModel.actions[26].id, "#2 custom item id").toBe("newCustomItem");
    expect(listModel.actions[26].visible, "#2 custom item invisible").toBe(false);
    expect(listModel.actions[27].id, "#2 loadingIndicator id").toBe("loadingIndicator");
    expect(listModel.actions[27].visible, "#2 loadingIndicator invisible").toBe(true);
    expect(question.value.length, "#2 question.value.length").toBe(1);
    expect(question.value, "#2 question.value").toEqualValues([testCustomValue]);
    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(1);
    expect(question.selectedItems[0].id, "#2 question.selectedItems").toBe(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toBe(26);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toBe(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ country: [testCustomValue] });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ country: [testCustomValue] });
  });

  test("allowCustomChoices: Filter choices if choicesLazyLoadEnabled is true", () => {
    const survey = new SurveyModel({
      "elements": [
        {
          "type": "tagbox",
          "name": "country",
          "title": "Select a country",
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 25,
          "allowCustomChoices": true,
        }
      ]
    });
    let callback;
    survey.onChoicesLazyLoad.add((sender, options) => {
      let result: any = [];
      callback = (filter) => {
        result = !!filter ? [] : getNumberArray();
        options.setItems(result, result.length);
      };
    });

    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testCustomValue = "testCustomValue";

    dropdownListModel.popupModel.show();
    callback(dropdownListModel.filterString);
    expect(listModel.actions.length, "#0 listModel.actions").toBe(26);
    expect(listModel.actions[25].id, "#0 added item id").toBe("newCustomItem");
    expect(listModel.isItemVisible(listModel.actions[25]), "#0 added item hide").toBe(false);

    dropdownListModel.inputStringRendered = testCustomValue;
    callback(dropdownListModel.filterString);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(1);
    expect(listModel.actions[0].id, "#1 custom item id").toBe("newCustomItem");
    expect(listModel.isItemVisible(listModel.actions[0]), "#1 custom item visible").toBe(true);

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    dropdownListModel.inputStringRendered = testCustomValue + "_1";
    callback(dropdownListModel.filterString);
    expect(listModel.actions.length, "#2 listModel.actions").toBe(2);
    expect(listModel.actions[0].id, "#2 added item id").toBe("testCustomValue");
    expect(listModel.isItemVisible(listModel.actions[0]), "#2 added item visible").toBe(true);
    expect(listModel.actions[1].id, "#2 custom item id").toBe("newCustomItem");
    expect(listModel.isItemVisible(listModel.actions[1]), "#2 custom item visible").toBe(true);
  });

  test("allowCustomChoices: Possibility of creating an element with custom value (mobile mode)", () => {
    _setIsTouch(true);
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: false, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testExistValue = "item2";
    const testCustomValue = "item10";
    listModel.flushUpdates();

    expect(dropdownListModel.customValue, "#1 customValue").toBeUndefined();
    expect(listModel.searchEnabled, "#1 listModel searchEnabled").toBe(true);
    expect(listModel.isEmpty, "#1 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#1 listModel.actions").toBe(4);

    listModel.filterString = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#3 customValue").toBe(testCustomValue);
    expect(listModel.isEmpty, "#3 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#3 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#3 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#3 custom item text").toBe("Create \"item10\" item...");
    expect(listModel.actions[4].visible, "#3 custom item visible").toBe(true);

    listModel.filterString = testExistValue;
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#4 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#4 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#4 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#4 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#4 custom item text").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#4 custom item invisible").toBe(false);

    listModel.filterString = testExistValue + "test";
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#5 customValue").toBe(testExistValue + "test");
    expect(listModel.isEmpty, "#5 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#5 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#5 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#5 custom item text").toBe("Create \"item2test\" item...");
    expect(listModel.actions[4].visible, "#5 custom item visible").toBe(true);
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toBe(true);

    dropdownListModel.popupModel.hide();
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#6 customValue").toBeUndefined();
    expect(listModel.isEmpty, "#6 listModel is not empty").toBe(false);
    expect(listModel.actions.length, "#6 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#6 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].title, "#6 custom item text").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#6 custom item invisible").toBe(false);

    _setIsTouch(false);
  });

  test("allowCustomChoices: Add custom value (mobile mode)", () => {
    _setIsTouch(true);

    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "tagbox", searchEnabled: true, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const testCustomValue = "item10";

    listModel.filterString = testCustomValue;
    expect(listModel.actions.length, "#1 listModel.actions").toBe(5);
    expect(listModel.actions[4].id, "#1 custom item id").toBe("newCustomItem");
    expect(listModel.actions[4].visible, "#1 custom item visible").toBe(true);
    expect(question.value.length, "#1 question.value").toBe(0);
    expect(question.selectedItems.length, "#1 question.selectedItems").toBe(0);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toBe(4);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toBe("");
    expect(dropdownListModel.customValue, "#2 customValue").toBeUndefined();
    expect(listModel.actions.length, "#2 listModel.actions").toBe(6);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toBe(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toBe(testCustomValue);
    expect(listModel.actions[5].id, "#2 custom item id").toBe("newCustomItem");
    expect(listModel.actions[5].visible, "#2 custom item invisible").toBe(false);
    expect(question.value.length, "#2 question.value.length").toBe(1);
    expect(question.value, "#2 question.value").toEqualValues([testCustomValue]);
    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(1);
    expect(question.selectedItems[0].id, "#2 question.selectedItems").toBe(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toBe(5);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toBe(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: [testCustomValue] });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: [testCustomValue] });

    _setIsTouch(false);
  });
  test("tagbox vs selectAll and isExclusive", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "tagbox",
          name: "q1",
          choices: ["apple", "banana", { value: "none2", isExclusive: true }, "orange"],
          showNoneItem: true,
          showSelectAllItem: true
        }
      ]
    });
    const q = <QuestionTagboxModel>survey.getQuestionByName("q1");
    const listModel: MultiSelectListModel = q.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    listModel.onItemClick(<any>q.selectAllItem);
    expect(q.value, "#1").toEqualValues(["apple", "banana", "orange"]);
    expect(q.isAllSelected, "#3, all is selected").toBe(true);
    listModel.onItemClick(q.choices[2]);
    expect(q.value, "#4").toEqualValues(["none2"]);
    expect(q.isAllSelected, "#5, all is not selected").toBe(false);
    listModel.onItemClick(<any>q.selectAllItem);
    expect(q.value, "#6").toEqualValues(["apple", "banana", "orange"]);
    listModel.onItemClick(<any>q.noneItem);
    expect(q.value, "#7").toEqualValues(["none"]);
    listModel.onItemClick(q.choices[2]);
    expect(q.value, "#8").toEqualValues(["none2"]);
    listModel.onItemClick(q.choices[0]);
    expect(q.value, "#10").toEqualValues(["apple"]);

    q.renderedValue = ["apple", "none2"];
    expect(q.value, "#11").toEqualValues(["none2"]);
    q.renderedValue = ["none2", "none"];
    expect(q.value, "#12").toEqualValues(["none"]);
  });

  test("lazy loading + isReady", () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;
      const survey = new SurveyModel({ elements: [{ "type": "tagbox", "name": "q1", "choicesLazyLoadEnabled": true }] });
      survey.onChoicesLazyLoad.add((_, options) => {
        options.setItems(getNumberArray(1, 25), 25);
      });

      const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
      expect(question.choicesLazyLoadEnabled, "#1").toBe(true);
      expect(question.choices.length, "#1").toBe(0);
      expect(question.isReady, "#1").toBe(true);

      question.waitForQuestionIsReady(() => {
        expect(question.choices.length, "#2").toBe(25);
        expect(question.isReady, "#2").toBe(true);
        done();
      });
    });
  });
  test("Tagbox doesn't support showCommentArea functionality", assert => {
    const survey = new SurveyModel(
      { elements: [{ "type": "tagbox", "name": "q1", "choices": [{ value: 1, showCommentArea: true }] }] });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.choices.length, "#1").toBe(1);
    expect(question.choices[0].showCommentArea, "#1").toBe(false);
    question.choices[0].showCommentArea = true;
    expect(question.choices[0].showCommentArea, "#2").toBe(false);
    expect(question.otherItem.showCommentArea, "#3").toBe(true);
  });
  test("Tagbox otherItem works correctly", assert => {
    const survey = new SurveyModel(
      { elements: [{ "type": "tagbox", "name": "q1", "choices": [1, 2, 3], showOtherItem: true }] });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    expect(question.otherItem.showCommentArea, "otherItem showCommentArea is true").toBe(true);
    expect(question.otherItem.isCommentShowing, "#1").toBe(false);
    question.renderedValue = [1, "other"];
    expect(question.otherItem.isCommentShowing, "#2").toBe(true);
    question.renderedValue = [2];
    expect(question.otherItem.isCommentShowing, "#3").toBe(false);
  });

  test("TagBox becomes unresponsive when 0 is selected", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            { "type": "tagbox", "name": "question1", "choices": [0, 1, 2] }
          ]
        }
      ]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    expect(list.actions.length).toBe(3);
    expect(question.value, "#1").toEqualValues([]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "#2").toBe(0);

    list.onItemClick(list.actions[0]);
    expect(question.value, "#3").toEqualValues([0]);
    expect(list.actions.filter(item => list.isItemSelected(item)).length, "#4").toBe(1);
  });

  test("allowCustomChoices: custom choices from survey.data", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox", name: "q1", allowCustomChoices: true, choices: [
          "Long battery life",
          "Plenty of storage capacity",
          "High-quality camera",
          "Powerful CPU",
          "Large screen size",
          "High durability",
          "Low price",
        ],
      },]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const customValue = "test";
    const questionValue = ["Powerful CPU", "Low price", customValue];
    const data = { q1: questionValue };
    survey.data = data;

    expect(question.value.length, "#1 question.value.length").toBe(3);
    expect(question.value).toEqualValues(questionValue);
    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(3);
    expect(question.selectedItems[2].id, "#1 question.selectedItem").toBe(customValue);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toBe(8);
    expect(listModel.actions.length, "listModel.actions.length").toBe(9);
    expect(listModel.actions[0].id, "#1 new custom item").toBe(customValue);
    expect(listModel.actions[0].visible, "#1 new custom item visible").toBe(true);
    expect(survey.data, "#1 survey.data").toEqualValues(data);
  });

  test("allowCustomChoices: custom choices with displayName from survey.data", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox", name: "q1", allowCustomChoices: true, choices: [
          { value: "LBL", text: "Long battery life" },
          { value: "PSC", text: "Plenty of storage capacity" },
          { value: "HQC", text: "High-quality camera" },
          { value: "PCPU", text: "Powerful CPU" },
          { value: "LSS", text: "Large screen size" },
          { value: "HDUR", text: "High durability" },
          { value: "LP", text: "Low price" },
        ],
      },]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const listModel: MultiSelectListModel = question.dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const customValue = "test";
    const questionValue = ["PCPU", "LP", customValue];
    const data = { q1: questionValue };
    survey.data = data;

    expect(question.value.length, "#1 question.value.length").toBe(3);
    expect(question.value).toEqualValues(questionValue);
    expect(question.selectedItems.length, "#1 question.selectedItems.length").toBe(3);
    expect(question.selectedItems[0].id, "#1 question.selectedItem 0").toBe("PCPU");
    expect(question.selectedItems[0].title, "#1 question.selectedItem 0").toBe("Powerful CPU");
    expect(question.selectedItems[1].id, "#1 question.selectedItem 1").toBe("LP");
    expect(question.selectedItems[1].title, "#1 question.selectedItem 1").toBe("Low price");
    expect(question.selectedItems[2].id, "#1 question.selectedItem 2").toBe(customValue);
    expect(question.selectedItems[2].title, "#1 question.selectedItem 2").toBe(customValue);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toBe(8);
    expect(listModel.actions.length, "listModel.actions.length").toBe(9);
    expect(listModel.actions[0].id, "#1 new custom item").toBe(customValue);
    expect(listModel.actions[0].visible, "#1 new custom item visible").toBe(true);
    expect(survey.data, "#1 survey.data").toEqualValues(data);
  });
  test("Select All and Deselect All text", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox", name: "q1", showSelectAllItem: true, choices: [1]
      },]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const item = question.selectAllItem;
    question.clickItemHandler(item);
    expect(item.title, "default select all text").toBe("Select All");
    question.clickItemHandler(item);
    expect(item.title, "default deselect all text").toBe("Deselect all");
    question.clickItemHandler(item);
    expect(item.title, "default select all text after clear").toBe("Select All");
    question.clickItemHandler(item);
    expect(item.title, "default deselect all text after set value").toBe("Deselect all");
  });

  test("auto-select focused item on Tab", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const focusedItem = "item1";

    dropdownListModel.inputStringRendered = "item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before Tab").toEqualValues([]);
    expect(question.selectedItems.length).toBe(0);
    expect(list.visibleItems.length).toBe(3);

    const event = { keyCode: 9, preventDefault: () => { }, stopPropagation: () => { } };
    dropdownListModel.keyHandler(event);

    expect(question.value, "custom value selected on Tab").toEqualValues([focusedItem]);
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedItems[0]?.value, "selectedItem is item1").toBe(focusedItem);
    expect(list.visibleItems.length).toBe(3);
  });

  test("auto-select custom item on Tab", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: true,
        allowCustomChoices: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const customValue = "abc";

    dropdownListModel.inputStringRendered = customValue;
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before Tab").toEqualValues([]);
    expect(question.selectedItems.length).toBe(0);
    expect(list.visibleItems.length, "only custom item visible").toBe(1);
    expect(list.visibleItems[0].id, "visible item is custom").toBe("newCustomItem");

    const event = { keyCode: 9, preventDefault: () => { }, stopPropagation: () => { } };
    dropdownListModel.keyHandler(event);

    expect(question.value, "custom value selected on Tab").toEqualValues([customValue]);
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedItems[0]?.value, "selectedItem is custom").toBe(customValue);
    expect(list.visibleItems.length).toBe(4);
    expect(list.visibleItems[0].id).toBe(customValue);
  });

  test("auto-select custom item on blur", () => {
    settings.dropdownSaveOnOutsideClick = true;

    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: true,
        allowCustomChoices: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const customValue = "abc";

    dropdownListModel.inputStringRendered = customValue;
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before blur").toEqualValues([]);
    expect(question.selectedItems.length).toBe(0);
    expect(list.visibleItems.length, "only custom item visible").toBe(1);

    dropdownListModel.onBlur({ target: null, relatedTarget: document.createElement("div"), stopPropagation: () => { } });

    expect(question.value, "custom value selected on blur").toEqualValues([customValue]);
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedItems[0]?.value, "selectedItem is custom").toBe(customValue);
    expect(list.visibleItems.length).toBe(4);
    expect(list.visibleItems[0].id).toBe(customValue);

    settings.dropdownSaveOnOutsideClick = false;
  });

  test("focused item is not selected on blur, settings.dropdownSaveOnOutsideClick = false", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    dropdownListModel.inputStringRendered = "item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before blur").toEqualValues([]);
    expect(question.selectedItems.length).toBe(0);
    expect(list.visibleItems.length).toBe(3);

    dropdownListModel.onBlur({ target: null, relatedTarget: document.createElement("div"), stopPropagation: () => { } });

    expect(question.value, "value empty after blur").toEqualValues([]);
    expect(question.selectedItems.length).toBe(0);
    expect(list.visibleItems.length).toBe(3);
  });

  test("auto-select focused item on blur, settings.dropdownSaveOnOutsideClick = true ", () => {
    settings.dropdownSaveOnOutsideClick = true;

    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    const focusedItem = "item1";

    dropdownListModel.inputStringRendered = "item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before blur").toEqualValues([]);
    expect(question.selectedItems.length).toBe(0);
    expect(list.visibleItems.length).toBe(3);

    dropdownListModel.onBlur({ target: null, relatedTarget: document.createElement("div"), stopPropagation: () => { } });

    expect(question.value).toEqualValues([focusedItem]), "focused item is selected on blur";
    expect(question.selectedItems.length).toBe(1);
    expect(question.selectedItems[0]?.value, "selectedItem is focused item").toBe(focusedItem);
    expect(list.visibleItems.length).toBe(3);

    settings.dropdownSaveOnOutsideClick = false;
  });
  test("Test createCustomChoiceText property, Issue#11041", () => {

    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "q1",
        searchEnabled: true,
        allowCustomChoices: true,
        choices: ["item1", "item2", "item3"],
        createCustomChoiceText: "Add \"{0}\" as a new"
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    dropdownListModel.inputStringRendered = "new Item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();
    expect(dropdownListModel.customItemValue.text, "customItemValue is set correctly").toBe("Add \"new Item\" as a new");

  });
});

import { SurveyModel } from "../src/survey";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { PopupDropdownViewModel } from "../src/popup-dropdown-view-model";
import { _setIsTouch } from "../src/utils/devices";
import { settings } from "../src/settings";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { PageModel } from "../src/page";
import { IAction } from "../src/actions/action";
export default QUnit.module("Tagbox question");

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

QUnit.test("clearValue", assert => {
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

  assert.equal(question.value.length, 0, "init");
  assert.equal(dropdownListModel.filterString, "", "init");
  assert.equal(dropdownListModel.inputStringRendered, "", "init");
  assert.equal(dropdownListModel.hintString, "", "init");

  question.value = [2];
  dropdownListModel.inputStringRendered = "i";
  assert.equal(question.value.length, 1);
  assert.equal(question.selectedChoices.length, 1);
  assert.equal(dropdownListModel.filterString, "i");
  assert.equal(dropdownListModel.inputStringRendered, "i");
  assert.equal(dropdownListModel.hintString, "item 1");

  question.clearValue();

  assert.equal(question.value.length, 0, "after clear");
  assert.equal(dropdownListModel.filterString, "", "after clear");
  assert.equal(dropdownListModel.inputStringRendered, "", "after clear");
  assert.equal(dropdownListModel.hintString, "", "after clear");
});

QUnit.test("Tagbox DropdownListModel with MultiListModel", (assert) => {
  const survey = new SurveyModel(jsonTagbox);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.ok(question.popupModel.contentComponentData.model instanceof MultiSelectListModel);
});

QUnit.test("DropdownListModel with MultiListModel and defaultValue", (assert) => {
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
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel);

  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
  assert.equal(list.actions.length, 4);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.isItemSelected(list.actions[0]), true);
  assert.equal(list.isItemSelected(list.actions[3]), false);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 0);
  assert.equal(list.isItemSelected(list.actions[0]), false);
  assert.equal(list.isItemSelected(list.actions[3]), false);
  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[3]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.isItemSelected(list.actions[0]), false);
  assert.equal(list.isItemSelected(list.actions[3]), true);
  assert.deepEqual(question.value, ["item4"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 2);
  assert.equal(list.isItemSelected(list.actions[0]), true);
  assert.equal(list.isItemSelected(list.actions[3]), true);
  assert.deepEqual(question.value, ["item4", "item1"]);
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

QUnit.test("Select SelectAll", (assert) => {
  const survey = new SurveyModel(jsonTagboxWithSelectAll);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  const dropdownListModel = question.dropdownListModel;
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel);

  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
  assert.equal(list.actions.length, 8);
  assert.equal(list.selectedItems.length, 0);

  const selectAllItem = list.actions[0];
  const item1 = list.actions[1];
  assert.equal(selectAllItem.id, "selectall");
  assert.equal(item1.id, "item1");

  list.onItemClick(selectAllItem); // select all items
  assert.equal(question.selectedItems.length, 5, "question.selectedItems.length");
  assert.deepEqual(question.value, ["item1", "item2", "item3", "item4", "item5"], "question.value isSelectAll");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 6, "list.selectedItems.length");

  list.onItemClick(item1); // 4 elements out of 5 are selected
  assert.equal(question.selectedItems.length, 4, "question.selectedItems.length");
  assert.deepEqual(question.value, ["item2", "item3", "item4", "item5"], "question.value");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 4, "list.selectedItems.length");

  list.onItemClick(selectAllItem); // select all items
  assert.equal(question.selectedItems.length, 5, "question.selectedItems.length");
  assert.deepEqual(question.value, ["item1", "item2", "item3", "item4", "item5"], "question.value  isSelectAll");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 6, "list.selectedItems.length");

  list.onItemClick(selectAllItem); // reset all items
  assert.equal(question.selectedItems.length, 0, "question.selectedItems.length");
  assert.deepEqual(question.value, [], "question.value");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 0, "list.selectedItems.length");
});

QUnit.test("Select None item", (assert) => {
  const survey = new SurveyModel(jsonTagboxWithSelectAll);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  const dropdownListModel = question.dropdownListModel;
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel);

  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
  assert.equal(list.actions.length, 8);
  assert.equal(list.selectedItems.length, 0);

  const item1 = list.actions[1];
  const noneItem = list.actions[6];
  assert.equal(item1.id, "item1");
  assert.equal(noneItem.id, "none");

  list.onItemClick(item1); // 1 element out of 5 is selected
  assert.equal(question.selectedItems.length, 1, "item1 selected");
  assert.deepEqual(question.value, ["item1"], "item1 selected");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1, "item1 selected");

  list.onItemClick(noneItem); // reset all items
  assert.equal(question.selectedItems.length, 1, "none selected");
  assert.deepEqual(question.value, ["none"], "none selected");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1, "none selected");

  list.onItemClick(item1); // 1 element out of 5 is selected
  assert.equal(question.selectedItems.length, 1, "item1 selected");
  assert.deepEqual(question.value, ["item1"], "item1 selected");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1, "item1 selected");
});

QUnit.test("Tagbox hideSelectedItems property default false", (assert) => {
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

  assert.equal(list.actions.length, 4);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 0);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[3]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, ["item4"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 2);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, ["item4", "item1"]);
});

QUnit.test("Tagbox hideSelectedItems property set is true", (assert) => {
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

  assert.equal(list.actions.length, 4);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.actions[0].visible, false);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 0);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[3]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, false);
  assert.deepEqual(question.value, ["item4"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 2);
  assert.equal(list.actions[0].visible, false);
  assert.equal(list.actions[3].visible, false);
  assert.deepEqual(question.value, ["item4", "item1"]);
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

QUnit.test("lazy loading: several loading", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 30);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[29].value, 30);

  question.dropdownListModel["updateQuestionChoices"]();
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 60);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[59].value, 60);

  question.dropdownListModel["updateQuestionChoices"]();
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 70);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[69].value, 70);
});

QUnit.test("lazy loading + change filter string + dropdownSearchDelay", assert => {
  const newValueDebouncedInputValue = 2 * onChoicesLazyLoadCallbackTimeOut;
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const done4 = assert.async();

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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  assert.equal(question.choices.length, 0, "show popup before request");

  setTimeout(() => {
    assert.equal(question.choices.length, 25, "show popup after request");
    assert.equal(question.choices[0].value, 1, "show popup after request");
    settings.dropdownSearchDelay = newValueDebouncedInputValue;
    question.dropdownListModel.filterString = "2";
    setTimeout(() => {
      assert.equal(question.choices.length, 25, "filter is 2");
      assert.equal(question.choices[0].value, 1, "filter is 2");
      settings.dropdownSearchDelay = newValueDebouncedInputValue;
      question.dropdownListModel.filterString = "22";
      setTimeout(() => {
        assert.equal(question.choices.length, 25, "filter is 22 before request");
        assert.equal(question.choices[0].value, 1, "filter is 22 before request");

        setTimeout(() => {
          assert.equal(question.choices.length, 25, "filter is 22 after request");
          assert.equal(question.choices[0].value, 22, "filter is 22 after request");

          settings.dropdownSearchDelay = 0;
          done4();
        }, onChoicesLazyLoadCallbackTimeOut + newValueDebouncedInputValue);
        done3();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("storeOthersAsComment is false", assert => {
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
  assert.equal(question.visibleChoices.length, 1);
  assert.equal(question.visibleChoices[0].id, "other");
  assert.equal(question.visibleChoices[0].value, "other");

  question.renderedValue = ["other"];
  assert.deepEqual(question.value, ["other"], "#1");
  question.otherValue = "text1";
  assert.deepEqual(question.value, ["text1"], "#2");
  assert.deepEqual(survey.data, { q1: ["text1"] }, "#3");
});

QUnit.test("lazy loading: storeOthersAsComment is false", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.visibleChoices.length, 1);
  assert.equal(question.visibleChoices[0].id, "other");
  assert.equal(question.visibleChoices[0].value, "other");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.visibleChoices.length, 71);
  assert.equal(question.visibleChoices[0].value, 1);
  assert.equal(question.visibleChoices[69].value, 70);
  assert.equal(question.visibleChoices[70].id, "other");
  assert.equal(question.visibleChoices[70].value, "other");

  question.renderedValue = ["other"];
  assert.deepEqual(question.value, ["other"], "#1");
  question.otherValue = "text1";
  assert.deepEqual(question.value, ["text1"], "#2");
  assert.deepEqual(survey.data, { q1: ["text1"] }, "#3");
});
QUnit.test("lazy loading: A value disappears when open tagbox popup again", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 30);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[29].value, 30);

  list.flushUpdates();
  list.onItemClick(list.renderedActions[28]);
  assert.deepEqual(question.value, [29]);
  assert.equal(question.selectedItems.length, 1);
  assert.equal(question.selectedItems[0].value, 29);

  question.dropdownListModel["updateQuestionChoices"]();
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 60);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[59].value, 60);

  list.flushUpdates();
  list.onItemClick(list.renderedActions[55]);
  assert.deepEqual(question.value, [29, 56]);
  assert.equal(question.selectedItems.length, 2, "selected items length 1");
  assert.equal(question.selectedItems[0].value, 29, "selected items[0] value 29 1");
  assert.equal(question.selectedItems[0].text, "DisplayText_29", "selected items[0] text 29 1");
  assert.equal(question.selectedItems[1].value, 56, "selected items[1] value 56 1");
  assert.equal(question.selectedItems[1].text, "DisplayText_56", "selected items[1] value 56 1");

  question.dropdownListModel.popupModel.hide();
  assert.deepEqual(question.value, [29, 56]);
  assert.equal(question.selectedItems.length, 2, "selected items length 2");
  assert.equal(question.selectedItems[0].value, 29, "selected items[0] value 29 2");
  assert.equal(question.selectedItems[0].text, "DisplayText_29", "selected items[0] text 29 2");
  assert.equal(question.selectedItems[1].value, 56, "selected items[1] value 56 2");
  assert.equal(question.selectedItems[1].text, "DisplayText_56", "selected items[1] value 56 2");

  question.dropdownListModel.popupModel.show();
  assert.deepEqual(question.value, [29, 56]);
  assert.equal(question.selectedItems.length, 2, "selected items length 3");
  assert.equal(question.selectedItems[0].value, 29, "selected items[0] value 29 3");
  assert.equal(question.selectedItems[0].text, "DisplayText_29", "selected items[0] text 29 3");
  assert.equal(question.selectedItems[1].value, 56, "selected items[1] value 56 3");
  assert.equal(question.selectedItems[1].text, "DisplayText_56", "selected items[1] value 56 3");

  doneCallback(opts[2]);
  assert.deepEqual(question.value, [29, 56]);
  assert.equal(question.selectedItems.length, 2, "selected items length 4");
  assert.equal(question.selectedItems[0].value, 29, "selected items[0] value 29 4");
  assert.equal(question.selectedItems[0].text, "DisplayText_29", "selected items[0] text 29 4");
  assert.equal(question.selectedItems[1].value, 56, "selected items[1] value 56 4");
  assert.equal(question.selectedItems[1].text, "DisplayText_56", "selected items[1] value 56 4");
  assert.equal(question.choices.length, 30);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[29].value, 30);
});

function getObjectArray(skip = 1, count = 25): Array<{ value: any, text: string }> {
  const result: Array<{ value: any, text: string }> = [];
  for (let index = skip; index < (skip + count); index++) {
    result.push({ value: index, text: "DisplayText_" + index });
  }
  return result;
}
QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.deepEqual(question.value, [52, 55]);
  assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");
  assert.equal(questionTitle.locTitle.textOrHtml, "DisplayText_52, DisplayText_55", "display text is correct");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.deepEqual(question.value, [52, 55]);
  assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");
});

QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue is object", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.deepEqual(question.value, [{ id: 52 }, { id: 55 }]);
  assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value.id, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value.id, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.deepEqual(question.value, [{ id: 52 }, { id: 55 }]);
  assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value.id, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value.id, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");
});

QUnit.test("lazy loading + onGetChoiceDisplayValue: set survey data", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.deepEqual(question.value, [52, 55]);
  assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.deepEqual(question.value, [52, 55]);
  assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");

  question.renderedValue = [52, 55, 10];
  assert.deepEqual(question.value, [52, 55, 10]);
  assert.equal(question.selectedItems.length, 3, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");
  assert.equal(question.selectedItems[2].value, 10, "question.selectedItems[2] value");
  assert.equal(question.selectedItems[2].text, "DisplayText_10", "question.selectedItems[2] text");
});

QUnit.test("lazy loading data is lost: defaultValue", assert => {
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

  assert.deepEqual(survey.data, { "q1": [52, 55] }, "before doComplete before item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": [52, 55] }, "after doComplete before item load");

  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.deepEqual(question.value, [52, 55]);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.deepEqual(question.value, [52, 55]);

  assert.deepEqual(survey.data, { "q1": [52, 55] }, "before doComplete after item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": [52, 55] }, "after doComplete after item load");
});

QUnit.test("lazy loading data is lost: set survey data", assert => {
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
  assert.deepEqual(survey.data, { "q1": [52, 55] }, "before doComplete before item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": [52, 55] }, "after doComplete before item load");

  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.equal(question.choices.length, 0);
  assert.deepEqual(question.value, [52, 55]);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.deepEqual(question.value, [52, 55]);

  question.renderedValue = [52, 55, 10];
  assert.deepEqual(question.value, [52, 55, 10]);
  assert.deepEqual(survey.data, { "q1": [52, 55, 10] }, "before doComplete after item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": [52, 55, 10] }, "after doComplete after item load");
});

QUnit.test("lazy loading + change filter string", assert => {
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

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 70);
  assert.equal(itemsSettings.items.length, 25);

  question.dropdownListModel.filterString = "2";
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 2);
  assert.equal(question.choices[24].value, 123);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 70);
  assert.equal(itemsSettings.items.length, 25);

  question.dropdownListModel.filterString = "22";
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 22);
  assert.equal(question.choices[24].value, 1223);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 70);
  assert.equal(itemsSettings.items.length, 25);
});

QUnit.test("lazy loading + change listModel filter string", assert => {
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

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 70);
  assert.equal(itemsSettings.items.length, 25);

  listModel.filterString = "2";
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 2);
  assert.equal(question.choices[24].value, 123);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 70);
  assert.equal(itemsSettings.items.length, 25);

  listModel.filterString = "22";
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 22);
  assert.equal(question.choices[24].value, 1223);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 70);
  assert.equal(itemsSettings.items.length, 25);
});

QUnit.test("Check tagbox in mobile mode with closeOnSelect true", assert => {
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
  assert.notOk(doneAction.enabled);
  listModel.onItemClick(actions[0]);
  assert.ok(doneAction.enabled);
  doneAction.action();
  assert.deepEqual(question.value, ["Item 1"]);

  popupModel.show();
  assert.notOk(doneAction.enabled);
  listModel.onItemClick(actions[1]);
  assert.ok(doneAction.enabled);
  assert.deepEqual(question.value, ["Item 1", "Item 2"]);
  cancelAction.action();
  assert.deepEqual(question.value, ["Item 1"]);

  popupModel.show();
  assert.notOk(doneAction.enabled);
  listModel.onItemClick(actions[0]);
  assert.ok(doneAction.enabled);
  doneAction.action();
  assert.deepEqual(question.value, []);
  _setIsTouch(false);
});
QUnit.test("Tagbox focusFirstInputSelector mobile && hideSelectedItems", (assert) => {
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
  assert.equal(popupModel.focusFirstInputSelector, ".sv-list__item", "value = undefined && isTouch = true && hideSelectedItems = false");

  list.onItemClick(list.actions[0]);
  popupModel.isVisible = false;

  popupModel.isVisible = true;
  assert.equal(popupModel.focusFirstInputSelector, ".sv-list__item--selected", "isTouch=true && value = 'item1' && hideSelectedItems = false");

  list.onItemClick(list.actions[0]);
  question.hideSelectedItems = true;

  popupModel.isVisible = false;

  popupModel.isVisible = true;
  assert.equal(popupModel.focusFirstInputSelector, ".sv-list__item", "value = undefined && isTouch = true && hideSelectedItems = true");

  list.onItemClick(list.actions[0]);
  popupModel.isVisible = false;

  popupModel.isVisible = true;
  assert.equal(popupModel.focusFirstInputSelector, ".sv-list__item", "isTouch=true && value = 'item1' && hideSelectedItems = true");
  _setIsTouch(false);
});

QUnit.test("Tagbox closeOnSelect", (assert) => {
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
  assert.equal(question1.closeOnSelect, false);
  assert.equal(question2.closeOnSelect, true);
  assert.equal(question3.closeOnSelect, false);
  assert.equal(question4.closeOnSelect, true);
});

QUnit.test("Tagbox settings.tagboxCloseOnSelect", (assert) => {
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
  assert.equal(question1.closeOnSelect, true);
  assert.equal(question2.closeOnSelect, true);
  settings.tagboxCloseOnSelect = false;
});

QUnit.test("maxSelectedChoices in tagbox", function (assert) {
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

  assert.equal(list.actions.length, 4);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.actions[0].enabled, true);
  assert.equal(list.actions[1].enabled, true);
  assert.equal(list.actions[2].enabled, true);
  assert.equal(list.actions[3].enabled, true);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[1]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 2);
  assert.equal(list.actions[0].enabled, true);
  assert.equal(list.actions[1].enabled, true);
  assert.equal(list.actions[2].enabled, false);
  assert.equal(list.actions[3].enabled, false);
  assert.deepEqual(question.value, ["item1", "item2"]);

  list.onItemClick(list.actions[3]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 2);
  assert.equal(list.actions[0].enabled, true);
  assert.equal(list.actions[1].enabled, true);
  assert.equal(list.actions[2].enabled, false);
  assert.equal(list.actions[3].enabled, false);
  assert.deepEqual(question.value, ["item1", "item2"]);

  list.onItemClick(list.actions[1]);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1);
  assert.equal(list.actions[0].enabled, true);
  assert.equal(list.actions[1].enabled, true);
  assert.equal(list.actions[2].enabled, true);
  assert.equal(list.actions[3].enabled, true);
  assert.deepEqual(question.value, ["item1"]);
});

QUnit.test("reset filterstring after select item", (assert) => {
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
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel);

  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
  list.flushUpdates();
  assert.equal(list.actions.length, 4);
  assert.equal(list.renderedActions.filter(item => list.isItemVisible(item)).length, 4);
  assert.equal(dropdownListModel.inputStringRendered, "");
  assert.equal(dropdownListModel.filterString, "");

  dropdownListModel.inputStringRendered = "1";
  list.flushUpdates();
  assert.equal(list.renderedActions.filter(item => list.isItemVisible(item)).length, 1);
  assert.equal(dropdownListModel.inputStringRendered, "1");
  assert.equal(dropdownListModel.filterString, "1");

  list.onItemClick(list.renderedActions.filter(item => list.isItemVisible(item))[0]);
  list.flushUpdates();
  assert.equal(dropdownListModel.inputStringRendered, "");
  assert.equal(dropdownListModel.filterString, "");
});

QUnit.test("TagBox displays a value which doesn't exist in a list of choices #6293", (assert) => {
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
  assert.equal(question.value.length, 1);
  assert.equal(question.selectedChoices.length, 0);
  assert.deepEqual(survey.data, {
    "question1": ["value1"],
  });
});

QUnit.test("TagBox displays a value as Other if it doesn't exist in a list of choices", (assert) => {
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
  assert.equal(question.value.length, 1);
  assert.equal(question.selectedChoices.length, 1);
  assert.equal(question.selectedChoices[0].id, "other");
  assert.deepEqual(survey.data, {
    question1: ["value1"],
    "question1-Comment": "value1"
  });
});
QUnit.test("TagBox displays a value if list of choices is empty", (assert) => {
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
  assert.equal(question.value.length, 1);
  assert.equal(question.value[0], "Item 1");
  assert.equal(question.selectedItems.length, 1);
  assert.equal(question.selectedItems[0].id, "Item 1");

  question.setPropertyValue("visibleChoices", []);
  assert.equal(question.value.length, 1);
  assert.equal(question.value[0], "Item 1");
  assert.equal(question.selectedItems.length, 0);
});
QUnit.test("TagBox readOnlyText property should be reactive, Bug#6830", (assert) => {
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
  assert.equal(q.readOnlyText, "en-sel", "Empty en");
  assert.equal(q.dropdownListModel.filterStringPlaceholder, "en-sel", "dropdownlist en");
  q.value = ["Item 1"];
  assert.equal(q.readOnlyText, "Item 1", "has value");
  q.clearValue();
  assert.equal(q.readOnlyText, "en-sel", "Empty en, #2");
  survey.locale = "de";
  assert.equal(q.readOnlyText, "de-sel", "Empty de");
  assert.equal(q.dropdownListModel.filterStringPlaceholder, "de-sel", "dropdownlist de");
  survey.locale = "";
  assert.equal(q.readOnlyText, "en-sel", "Empty en, #3");
  assert.equal(q.dropdownListModel.filterStringPlaceholder, "en-sel", "dropdownlist en, #3");
});

QUnit.test("Test update readOnlyText after onGetChoiceDisplayValue", function (assert) {
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

  assert.deepEqual(question.value, ["FRA"]);
  assert.equal(question.selectedItems.length, 1);
  assert.equal(question.selectedItems[0].value, "FRA");
  assert.equal(question.selectedItems[0].text, "France");
  assert.equal(question.readOnlyText, "France", "readOnlyText");
});

QUnit.test("question.showClearButton", assert => {
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
  assert.equal(q.showClearButton, false, "question is empty");
  q.value = "Ford";
  assert.equal(q.showClearButton, true, "question is not empty");
  q.allowClear = false;
  assert.equal(q.showClearButton, false, "allowClear is false");
  q.allowClear = true;
  survey.setDesignMode(true);
  assert.equal(q.showClearButton, true, "Creator V2");
});
QUnit.test("lazy loading: maxSelectedChoices limit stops working if you clear the value", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.deepEqual(question.value, [1]);
  assert.equal(question.choices.length, 30);
  for (let index = 0; index < list.actions.length - 1; index++) {
    assert.ok(list.actions[index].enabled, list.actions[index].id + " is enabled before clear");
  }

  list.onItemClick(list.actions[1]);
  assert.deepEqual(question.value, [1, 2]);
  assert.ok(list.actions[0].enabled, "action 1 is enabled before clear");
  assert.ok(list.actions[1].enabled, "action 2 is enabled before clear");
  for (let index = 2; index < list.actions.length - 1; index++) {
    assert.notOk(list.actions[index].enabled, list.actions[index].id + " is disabled before clear");
  }
  question.dropdownListModel.popupModel.hide();
  question.dropdownListModel.onClear({
    keyCode: 0,
    preventDefault: () => { },
    stopPropagation: () => { }
  });

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[1]);
  assert.deepEqual(question.value, [], "question value is empty");
  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, [1], "question value is [1]");

  for (let index = 0; index < list.actions.length - 1; index++) {
    assert.ok(list.actions[index].enabled, list.actions[index].id + " is enabled after clear");
  }

  list.onItemClick(list.actions[1]);
  assert.deepEqual(question.value, [1, 2], "question value is [1, 2] after clear");
  assert.ok(list.actions[0].enabled, "action 1 is enabled after clear");
  assert.ok(list.actions[1].enabled, "action 2 is enabled after clear");
  for (let index = 2; index < list.actions.length - 1; index++) {
    assert.notOk(list.actions[index].enabled, list.actions[index].id + " is disabled after clear");
  }
});
QUnit.test("lazy loading & maxSelectedChoices: Items remains disabled when unselecting choices within a drop-down list", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.deepEqual(question.value, [1]);
  assert.equal(question.choices.length, 30);
  for (let index = 0; index < list.actions.length - 1; index++) {
    assert.ok(list.actions[index].enabled, list.actions[index].id + " is enabled before unselecting choice");
  }

  list.onItemClick(list.actions[1]);
  assert.deepEqual(question.value, [1, 2]);
  assert.ok(list.actions[0].enabled, "action 1 is enabled before unselecting choice");
  assert.ok(list.actions[1].enabled, "action 2 is enabled before unselecting choice");
  for (let index = 2; index < list.actions.length - 1; index++) {
    assert.notOk(list.actions[index].enabled, list.actions[index].id + " is disabled before unselecting choice");
  }
  question.dropdownListModel.popupModel.hide;
  question.dropdownListModel.popupModel.show();
  assert.deepEqual(question.value, [1, 2], "question value is [1, 2]");
  assert.ok(list.actions[0].enabled, "action 1 is enabled");
  assert.ok(list.actions[1].enabled, "action 2 is enabled");
  for (let index = 2; index < list.actions.length - 1; index++) {
    assert.notOk(list.actions[index].enabled, list.actions[index].id + " is disabled");
  }

  list.onItemClick(list.actions[1]);
  assert.deepEqual(question.value, [1], "question value is [1]");
  for (let index = 0; index < list.actions.length - 1; index++) {
    assert.ok(list.actions[index].enabled, list.actions[index].id + " is enabled after unselecting choice");
  }
});
QUnit.test("Can clear tagbox value", assert => {
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
  assert.ok(question, "There is no exception");
});

QUnit.test("Check readOnly tagbox with markdown", function (assert) {
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

  assert.equal(q1.displayValue, "item1 |  item2 |  item3");
  assert.equal(q1.readOnlyText, "item1 |  item2 |  item3");
});

QUnit.test("Tagbox searchmode filter options", (assert) => {
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
  assert.equal(question.searchMode, "startsWith");
  const dropdownListModel = question.dropdownListModel;
  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

  dropdownListModel.filterString = "ab";
  list.flushUpdates();
  const getfilteredItems = () => list.renderedActions.filter(item => list.isItemVisible(item));

  assert.equal(list.renderedActions.length, 4);
  assert.equal(getfilteredItems().length, 2);

  question.searchMode = "contains";
  list.flushUpdates();
  assert.equal(list.renderedActions.length, 4);
  assert.equal(getfilteredItems().length, 3);
});

QUnit.test("Tagbox readonly", (assert) => {
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
  assert.equal(question.readOnlyText, "Select...");
});
QUnit.test("Create tag box in the code, dropdownListModel instance", (assert) => {
  const survey = new SurveyModel();
  const question = new QuestionTagboxModel("q1");
  const page = new PageModel("page1");
  page.addQuestion(question);
  assert.notOk(!!question["dropdownListModelValue"], "It is not created yet #1");
  survey.addPage(page);
  assert.notOk(!!question["dropdownListModelValue"], "It is not created yet #2");
  assert.ok(!!question.dropdownListModel, "It is created on demand");
});
QUnit.test("Create tag box from json, dropdownListModel instance", (assert) => {
  const survey = new SurveyModel({
    elements: [{ type: "tagbox", name: "q1" }]
  });
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.ok(question.dropdownListModel, "It is created");
});

QUnit.test("Prevoiusly selected options disappear", (assert) => {
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
  assert.deepEqual(question.value, [5], "question value");
  assert.equal(question.selectedItems.length, 1);
  assert.equal(question.selectedChoices.length, 1);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  dropdownListModel.inputStringRendered = "777";
  assert.deepEqual(question.value, [5], "question value");
  assert.equal(question.selectedItems.length, 1);
  assert.equal(question.selectedChoices.length, 1);
  doneCallback(opts[1]);
  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, [5, 777], "question value");
  assert.equal(question.selectedItems.length, 2);
  assert.equal(question.selectedChoices.length, 2);
  doneCallback(opts[2]);
  dropdownListModel.inputStringRendered = "888";
  assert.deepEqual(question.value, [5, 777], "question value");
  assert.equal(question.selectedItems.length, 2);
  assert.equal(question.selectedChoices.length, 2);
  doneCallback(opts[3]);
  assert.deepEqual(question.value, [5, 777], "question value");
  assert.equal(question.selectedItems.length, 2);
  assert.equal(question.selectedChoices.length, 2);
});

QUnit.test("The new selected value is replaced with the the default value while searching #8751", assert => {
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
  assert.deepEqual(question.value, [222], "question value #1");
  assert.equal(question.selectedChoices.length, 1);

  dropdownListModel.onClear(null);
  assert.deepEqual(question.value, [], "question value #2");
  assert.equal(question.selectedChoices.length, 0);
  dropdownListModel.inputStringRendered = "999";
  doneCallback(opts[0]);
  assert.deepEqual(question.value, [], "question value #3");
  assert.equal(question.selectedChoices.length, 0);
  doneCallback(opts[1]);
  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, [999], "question value #4");
  assert.equal(question.selectedChoices.length, 1);
  assert.equal(question.selectedChoices[0].value, 999, "question.selectedChoices[0] value #1");
  doneCallback(opts[2]);
  assert.deepEqual(question.value, [999], "question value #5");
  assert.equal(question.selectedChoices.length, 1);
  assert.equal(question.selectedChoices[0].value, 999, "question.selectedChoices[0] value #2");
});

QUnit.test("The new selected value is always replaced with the the first selected value while searching #8751", assert => {
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
  assert.deepEqual(question.value, [], "question value is empty");
  assert.equal(question.selectedChoices.length, 0);

  dropdownListModel.inputStringRendered = "222";
  doneCallback(opts[0]);
  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, [222], "question value #1");
  assert.equal(question.selectedChoices.length, 1);
  doneCallback(opts[1]);
  dropdownListModel.onClear(null);
  assert.deepEqual(question.value, [], "question value #2");
  assert.equal(question.selectedChoices.length, 0);
  doneCallback(opts[2]);
  dropdownListModel.inputStringRendered = "999";
  assert.deepEqual(question.value, [], "question value #3");
  assert.equal(question.selectedChoices.length, 0);
  doneCallback(opts[3]);
  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, [999], "question value #4");
  assert.equal(question.selectedChoices.length, 1);
  assert.equal(question.selectedChoices[0].value, 999, "question.selectedChoices[0] value #1");
  doneCallback(opts[4]);
  assert.deepEqual(question.value, [999], "question value #5");
  assert.equal(question.selectedChoices.length, 1);
  assert.equal(question.selectedChoices[0].value, 999, "question.selectedChoices[0] value #2");
});
QUnit.test("rendering actions id", assert => {
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
  assert.notOk(question["dropdownListModelValue"], "It is not created yet");
  question.id = "el1";
  const listModel = question.popupModel.contentComponentData.model as MultiSelectListModel;
  listModel.flushUpdates();
  const actions = listModel.renderedActions;
  assert.equal(actions.length, 2, "two actions");
  assert.equal((<IAction>actions[0]).elementId, "el1i_listItem1", "elementId, action1");
  assert.equal((<IAction>actions[1]).elementId, "el1i_listItem2", "elementId, action2");
  assert.equal((<IAction>actions[0]).disableTabStop, true, "disableTabStop, action1");
  assert.equal((<IAction>actions[1]).disableTabStop, true, "disableTabStop, action2");
});
QUnit.test("List actions disableTabStop", assert => {
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
  assert.equal(actions.length, 2, "two actions");
  assert.equal((<IAction>actions[0]).disableTabStop, true, "disableTabStop, action1");
  assert.equal((<IAction>actions[1]).disableTabStop, true, "disableTabStop, action2");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: false", function (assert) {
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

  assert.equal(dropdownListModel.allowCustomChoices, false, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, "", "#1 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");

  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, false, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.isEmpty, true, "#2 listModel is empty");
  assert.equal(listModel.actions.length, 4, "#2 listModel.actions");

  question.allowCustomChoices = true;
  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#3 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue, "#3 customValue");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#3 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item10\" item...", "#3 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#3 custom item visible");

  dropdownListModel.inputStringRendered = testExistValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#4 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#4 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#4 custom item invisible");

  dropdownListModel.inputStringRendered = testExistValue + "test";
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#5 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#5 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#5 custom item visible");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");

  dropdownListModel.popupModel.hide();
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#6 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#6 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#6 custom item invisible");
});

QUnit.test("allowCustomChoices: Add custom value if searchEnabled: false", function (assert) {
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
  assert.equal(listModel.actions.length, 5, "#1 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[4].visible, true, "#1 custom item visible");
  assert.equal(question.value.length, 0, "#1 question.value");
  assert.equal(question.selectedItems.length, 0, "#1 question.selectedItems");
  assert.equal(question.visibleChoices.length, 4, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.inputStringRendered, "", "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 6, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[5].visible, false, "#2 custom item invisible");
  assert.equal(question.value.length, 1, "#2 question.value.length");
  assert.deepEqual(question.value, [testCustomValue], "#2 question.value");
  assert.equal(question.selectedItems.length, 1, "#2 question.selectedItems.length");
  assert.equal(question.selectedItems[0].id, testCustomValue, "#2 question.selectedItems");
  assert.equal(question.visibleChoices.length, 5, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#2 survey.data");

  listModel.onItemClick(listModel.actions[1]);
  assert.equal(dropdownListModel.inputStringRendered, "", "#3 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#3 customValue");
  assert.equal(listModel.actions.length, 6, "#3 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#3 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#3 custom value add into list - title");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[5].visible, false, "#3 custom item invisible");
  assert.equal(question.value.length, 2, "#3 question.value.length");
  assert.deepEqual(question.value, [testCustomValue, "item1"], "#3 question.value");
  assert.equal(question.selectedItems.length, 2, "#3 question.selectedItems.length");
  assert.equal(question.selectedItems[0].id, testCustomValue, "#3 question.selectedItems");
  assert.equal(question.visibleChoices.length, 5, "#3 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#3 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: [testCustomValue, "item1"] }, "#3 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { q1: [testCustomValue, "item1"] }, "#4 survey.data");
});

QUnit.test("allowCustomChoices: inputStringRendered isn't reset after backspace, if searchEnabled: false", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, true, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue1, "#1 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#1 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#1 hintStringSuffix");

  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.allowCustomChoices, true, "#2 allowCustomChoices");
  assert.ok(dropdownListModel.customValue, "#2 customValue not empty");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#2 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#2 hintStringSuffix");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: true", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, false, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, "", "#1 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");

  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, false, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.isEmpty, true, "#2 listModel is empty");
  assert.equal(listModel.actions.length, 4, "#2 listModel.actions");

  question.allowCustomChoices = true;
  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#3 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue, "#3 customValue");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#3 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item10\" item...", "#3 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#3 custom item visible");

  dropdownListModel.inputStringRendered = testExistValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#4 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#4 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#4 custom item invisible");

  dropdownListModel.inputStringRendered = testExistValue + "test";
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#5 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#5 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#5 custom item visible");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");

  dropdownListModel.popupModel.hide();
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#6 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#6 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#6 custom item invisible");
});

QUnit.test("allowCustomChoices: Add custom value if searchEnabled: true", function (assert) {
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
  assert.equal(listModel.actions.length, 5, "#1 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[4].visible, true, "#1 custom item visible");
  assert.equal(question.value.length, 0, "#1 question.value");
  assert.equal(question.selectedItems.length, 0, "#1 question.selectedItems");
  assert.equal(question.visibleChoices.length, 4, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.inputStringRendered, "", "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 6, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[5].visible, false, "#2 custom item invisible");
  assert.equal(question.value.length, 1, "#2 question.value.length");
  assert.deepEqual(question.value, [testCustomValue], "#2 question.value");
  assert.equal(question.selectedItems.length, 1, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[0].id, testCustomValue, "#2 question.selectedItems");
  assert.equal(question.visibleChoices.length, 5, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#3 survey.data");
});

QUnit.test("allowCustomChoices: hintString with custom value if searchEnabled: true", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, true, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue1, "#1 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#1 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#1 hintStringSuffix");

  dropdownListModel.inputStringRendered = testCustomValue2;
  assert.equal(dropdownListModel.allowCustomChoices, true, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue2, "#2 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#2 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#2 hintStringSuffix");
});

QUnit.test("allowCustomChoices: Option to create item not available if item exist (case-insensitive).", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, true, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");
});

QUnit.test("allowCustomChoices: onCreateCustomChoiceItem event.", function (assert) {
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
  assert.equal(question.value.length, 0, "#1 question.value");
  assert.equal(question.selectedItems.length, 0, "#1 question.selectedItems");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.actions[4]);
  assert.equal(dropdownListModel.inputStringRendered, "", "#2 inputStringRendered");
  assert.equal(question.value.length, 1, "#2 question.value.length");
  assert.deepEqual(question.value, [testCustomValue], "#2 question.value");
  assert.equal(question.selectedItems.length, 1, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, testCustomValue, "#2 question.selectedItems[0].id");
  assert.equal(question.selectedItems[0].text, testCustomValueUpperCase, "#2 question.selectedItems.text");
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#2 survey.data");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[5].title, "newCustomItem", "#2 custom item text");
  assert.equal(listModel.actions[5].visible, false, "#2 custom item invisible");

  dropdownListModel.inputStringRendered = testCustomValue + "1";
  assert.equal(question.value.length, 1, "#3 question.value.length");
  assert.deepEqual(question.value, [testCustomValue], "#3 question.value");

  assert.equal(question.selectedItems.length, 1, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, testCustomValue, "#3 question.selectedItems[0].id");
  assert.equal(question.selectedItems[0].text, testCustomValueUpperCase, "#3 question.selectedItems.text");
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#3 survey.data");

  listModel.onItemClick(listModel.actions[5]);
  assert.equal(dropdownListModel.inputStringRendered, "", "#4 inputStringRendered");
  assert.equal(question.value.length, 1, "#4 question.value.length");
  assert.deepEqual(question.value, [testCustomValue], "#4 question.value");

  assert.equal(question.selectedItems.length, 1, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, testCustomValue, "#4 question.selectedItems[0].id");
  assert.equal(question.selectedItems[0].text, testCustomValueUpperCase, "#4 question.selectedItems.text");
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#4 survey.data");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[5].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[5].visible, false, "#4 custom item invisible");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value if choicesLazyLoadEnabled is true", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, false, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, "", "#1 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 26, "#1 listModel.actions");

  dropdownListModel.inputStringRendered = testCustomValue1;
  locCallback(opts[1]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, false, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue1, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.isEmpty, true, "#2 listModel is empty");
  assert.equal(listModel.actions.length, 0, "#2 listModel.actions");

  question.allowCustomChoices = true;
  dropdownListModel.inputStringRendered = testCustomValue2;
  locCallback(opts[2]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#3 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue2, "#3 customValue");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 1, "#3 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[0].title, "Create \"customItem2\" item...", "#3 custom item text");
  assert.equal(listModel.actions[0].visible, true, "#3 custom item visible");

  dropdownListModel.inputStringRendered = testExistValue;
  locCallback(opts[3]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#4 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 27, "#4 listModel.actions");
  assert.equal(listModel.actions[25].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[25].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[25].visible, false, "#4 custom item invisible");

  dropdownListModel.inputStringRendered = testExistValue + "test";
  locCallback(opts[4]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#5 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 1, "#5 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[0].title, "Create \"DisplayText_2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[0].visible, true, "#5 custom item visible");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");

  dropdownListModel.popupModel.hide();
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#6 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 1, "#6 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[0].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[0].visible, false, "#6 custom item invisible");
});

QUnit.test("allowCustomChoices: Add custom value if choicesLazyLoadEnabled is true", function (assert) {
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

  assert.equal(question.visibleChoices.length, 0);

  question.dropdownListModel.popupModel.show();
  locCallback(opts[0]);
  assert.equal(question.visibleChoices.length, 25);

  dropdownListModel.inputStringRendered = testCustomValue;
  locCallback(opts[1]);
  assert.equal(listModel.actions.length, 1, "#1 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[0].visible, true, "#1 custom item visible");
  assert.equal(question.value.length, 0, "#1 question.value");
  assert.equal(question.selectedItems.length, 0, "#1 question.selectedItems");
  assert.equal(question.visibleChoices.length, 0, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#1 popupModel.isVisible");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  locCallback(opts[2]);
  assert.equal(dropdownListModel.inputStringRendered, "", "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 28, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[26].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[26].visible, false, "#2 custom item invisible");
  assert.equal(listModel.actions[27].id, "loadingIndicator", "#2 loadingIndicator id");
  assert.equal(listModel.actions[27].visible, true, "#2 loadingIndicator invisible");
  assert.equal(question.value.length, 1, "#2 question.value.length");
  assert.deepEqual(question.value, [testCustomValue], "#2 question.value");
  assert.equal(question.selectedItems.length, 1, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[0].id, testCustomValue, "#2 question.selectedItems");
  assert.equal(question.visibleChoices.length, 26, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { country: [testCustomValue] }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { country: [testCustomValue] }, "#3 survey.data");
});

QUnit.test("allowCustomChoices: Filter choices if choicesLazyLoadEnabled is true", function (assert) {
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
  assert.equal(listModel.actions.length, 26, "#0 listModel.actions");
  assert.equal(listModel.actions[25].id, "newCustomItem", "#0 added item id");
  assert.equal(listModel.isItemVisible(listModel.actions[25]), false, "#0 added item hide");

  dropdownListModel.inputStringRendered = testCustomValue;
  callback(dropdownListModel.filterString);
  assert.equal(listModel.actions.length, 1, "#1 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.isItemVisible(listModel.actions[0]), true, "#1 custom item visible");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  dropdownListModel.inputStringRendered = testCustomValue + "_1";
  callback(dropdownListModel.filterString);
  assert.equal(listModel.actions.length, 2, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, "testCustomValue", "#2 added item id");
  assert.equal(listModel.isItemVisible(listModel.actions[0]), true, "#2 added item visible");
  assert.equal(listModel.actions[1].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.isItemVisible(listModel.actions[1]), true, "#2 custom item visible");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value (mobile mode)", function (assert) {
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

  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.searchEnabled, true, "#1 listModel searchEnabled");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");

  listModel.filterString = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, testCustomValue, "#3 customValue");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#3 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item10\" item...", "#3 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#3 custom item visible");

  listModel.filterString = testExistValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#4 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#4 custom item invisible");

  listModel.filterString = testExistValue + "test";
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#5 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#5 custom item visible");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");

  dropdownListModel.popupModel.hide();
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#6 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#6 custom item invisible");

  _setIsTouch(false);
});

QUnit.test("allowCustomChoices: Add custom value (mobile mode)", function (assert) {
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
  assert.equal(listModel.actions.length, 5, "#1 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[4].visible, true, "#1 custom item visible");
  assert.equal(question.value.length, 0, "#1 question.value");
  assert.equal(question.selectedItems.length, 0, "#1 question.selectedItems");
  assert.equal(question.visibleChoices.length, 4, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.inputStringRendered, "", "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 6, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[5].visible, false, "#2 custom item invisible");
  assert.equal(question.value.length, 1, "#2 question.value.length");
  assert.deepEqual(question.value, [testCustomValue], "#2 question.value");
  assert.equal(question.selectedItems.length, 1, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[0].id, testCustomValue, "#2 question.selectedItems");
  assert.equal(question.visibleChoices.length, 5, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { q1: [testCustomValue] }, "#3 survey.data");

  _setIsTouch(false);
});
QUnit.test("tagbox vs selectAll and isExclusive", (assert) => {
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
  assert.deepEqual(q.value, ["apple", "banana", "orange"], "#1");
  assert.equal(q.isAllSelected, true, "#3, all is selected");
  listModel.onItemClick(q.choices[2]);
  assert.deepEqual(q.value, ["none2"], "#4");
  assert.equal(q.isAllSelected, false, "#5, all is not selected");
  listModel.onItemClick(<any>q.selectAllItem);
  assert.deepEqual(q.value, ["apple", "banana", "orange"], "#6");
  listModel.onItemClick(<any>q.noneItem);
  assert.deepEqual(q.value, ["none"], "#7");
  listModel.onItemClick(q.choices[2]);
  assert.deepEqual(q.value, ["none2"], "#8");
  listModel.onItemClick(q.choices[0]);
  assert.deepEqual(q.value, ["apple"], "#10");

  q.renderedValue = ["apple", "none2"];
  assert.deepEqual(q.value, ["none2"], "#11");
  q.renderedValue = ["none2", "none"];
  assert.deepEqual(q.value, ["none"], "#12");
});

QUnit.test("lazy loading + isReady", assert => {
  const done = assert.async();
  const survey = new SurveyModel({ elements: [{ "type": "tagbox", "name": "q1", "choicesLazyLoadEnabled": true }] });
  survey.onChoicesLazyLoad.add((_, options) => {
    options.setItems(getNumberArray(1, 25), 25);
  });

  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true, "#1");
  assert.equal(question.choices.length, 0, "#1");
  assert.equal(question.isReady, true, "#1");

  question.waitForQuestionIsReady(() => {
    assert.equal(question.choices.length, 25, "#2");
    assert.equal(question.isReady, true, "#2");
    done();
  });
});
QUnit.test("Tagbox doesn't support showCommentArea functionality", assert => {
  const survey = new SurveyModel(
    { elements: [{ "type": "tagbox", "name": "q1", "choices": [{ value: 1, showCommentArea: true }] }] });
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.equal(question.choices.length, 1, "#1");
  assert.equal(question.choices[0].showCommentArea, false, "#1");
  question.choices[0].showCommentArea = true;
  assert.equal(question.choices[0].showCommentArea, false, "#2");
  assert.equal(question.otherItem.showCommentArea, true, "#3");
});
QUnit.test("Tagbox otherItem works correctly", assert => {
  const survey = new SurveyModel(
    { elements: [{ "type": "tagbox", "name": "q1", "choices": [1, 2, 3], showOtherItem: true }] });
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.equal(question.otherItem.isCommentShowing, false, "#1");
  question.renderedValue = [1, "other"];
  assert.equal(question.otherItem.isCommentShowing, true, "#2");
  question.renderedValue = [2];
  assert.equal(question.otherItem.isCommentShowing, false, "#3");
});

QUnit.test("TagBox becomes unresponsive when 0 is selected", (assert) => {
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

  assert.equal(list.actions.length, 3);
  assert.deepEqual(question.value, [], "#1");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 0, "#2");

  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, [0], "#3");
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 1, "#4");
});

QUnit.test("allowCustomChoices: custom choices from survey.data", function (assert) {
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

  assert.equal(question.value.length, 3, "#1 question.value.length");
  assert.deepEqual(question.value, questionValue);
  assert.equal(question.selectedItems.length, 3, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[2].id, customValue, "#1 question.selectedItem");
  assert.equal(question.visibleChoices.length, 8, "#1 question.visibleChoices");
  assert.equal(listModel.actions.length, 9, "listModel.actions.length");
  assert.equal(listModel.actions[0].id, customValue, "#1 new custom item");
  assert.equal(listModel.actions[0].visible, true, "#1 new custom item visible");
  assert.deepEqual(survey.data, data, "#1 survey.data");
});

QUnit.test("allowCustomChoices: custom choices with displayName from survey.data", function (assert) {
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

  assert.equal(question.value.length, 3, "#1 question.value.length");
  assert.deepEqual(question.value, questionValue);
  assert.equal(question.selectedItems.length, 3, "#1 question.selectedItems.length");
  assert.equal(question.selectedItems[0].id, "PCPU", "#1 question.selectedItem 0");
  assert.equal(question.selectedItems[0].title, "Powerful CPU", "#1 question.selectedItem 0");
  assert.equal(question.selectedItems[1].id, "LP", "#1 question.selectedItem 1");
  assert.equal(question.selectedItems[1].title, "Low price", "#1 question.selectedItem 1");
  assert.equal(question.selectedItems[2].id, customValue, "#1 question.selectedItem 2");
  assert.equal(question.selectedItems[2].title, customValue, "#1 question.selectedItem 2");
  assert.equal(question.visibleChoices.length, 8, "#1 question.visibleChoices");
  assert.equal(listModel.actions.length, 9, "listModel.actions.length");
  assert.equal(listModel.actions[0].id, customValue, "#1 new custom item");
  assert.equal(listModel.actions[0].visible, true, "#1 new custom item visible");
  assert.deepEqual(survey.data, data, "#1 survey.data");
});
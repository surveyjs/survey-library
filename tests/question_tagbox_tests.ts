import { SurveyModel } from "../src/survey";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { PopupBaseViewModel } from "../src/popup-view-model";
import { _setIsTouch } from "../src/utils/devices";

export default QUnit.module("Tagbox question");

const jsonTagbox = {
  questions: [{
    type: "tagbox",
    name: "question1",
    hasOther: "true",
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

QUnit.test("Tagbox DropdownListModel with MultiListModel", (assert) => {
  const survey = new SurveyModel(jsonTagbox);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.ok(question.popupModel.contentComponentData.model instanceof MultiSelectListModel);
});

QUnit.test("DropdownListModel with MultiListModel and defaultValue", (assert) => {
  const survey = new SurveyModel({
    questions: [{
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
  questions: [{
    type: "tagbox",
    name: "question1",
    hasOther: "true",
    hasNone: "true",
    hasSelectAll: "true",
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
    questions: [{
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
    questions: [{
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

function getNumberArray(skip = 1, count = 25): Array<number> {
  const result: Array<number> = [];
  for (let index = skip; index < (skip + count); index++) {
    result.push(index);
  }
  return result;
}

const callback = (_, opt) => {
  const total = 70;
  setTimeout(() => {
    if (opt.skip + opt.take < total) {
      opt.setItems(getNumberArray(opt.skip + 1, opt.take), total);
    } else {
      opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip), total);
    }
  }, 500);
};

QUnit.test("lazy loading: several loading", assert => {
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const json = {
    questions: [{
      "type": "tagbox",
      "name": "q1",
      "choicesLazyLoadEnabled": true,
      "choicesLazyLoadPageSize": 30
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.toggleVisibility();
  setTimeout(() => {
    assert.equal(question.choices.length, 30);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[29].value, 30);

    question.dropdownListModel["updateQuestionChoices"]();
    setTimeout(() => {
      assert.equal(question.choices.length, 60);
      assert.equal(question.choices[0].value, 1);
      assert.equal(question.choices[59].value, 60);

      question.dropdownListModel["updateQuestionChoices"]();
      setTimeout(() => {
        assert.equal(question.choices.length, 70);
        assert.equal(question.choices[0].value, 1);
        assert.equal(question.choices[69].value, 70);

        done3();
      }, 550);

      done2();
    }, 550);

    done1();
  }, 550);
});

function getObjectArray(skip = 1, count = 25): Array<number> {
  const result: Array<any> = [];
  for (let index = skip; index < (skip + count); index++) {
    result.push({ value: index, text: "DisplayText_" + index });
  }
  return result;
}

QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue", assert => {
  const done = assert.async();
  const json = {
    questions: [{
      "type": "tagbox",
      "name": "q1",
      "defaultValue": [52, 55],
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((sender, options) => {
    const total = 55;
    setTimeout(() => {
      if (options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    }, 500);
  });
  survey.onGetChoiceDisplayValue.add((sender, options) => {
    if (options.question.name == "q1") {
      options.setItems(options.values.map(item => ("DisplayText_" + item)));
    }
  });

  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.deepEqual(question.value, [52, 55]);
  assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
  assert.equal(question.selectedItems[0].value, 52, "question.selectedItems[0] value");
  assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
  assert.equal(question.selectedItems[1].value, 55, "question.selectedItems[1] value");
  assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");

  question.dropdownListModel.popupModel.isVisible = true;
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);
    assert.deepEqual(question.value, [52, 55]);
    assert.equal(question.selectedItems.length, 2, "question.selectedItems.length");
    assert.equal(question.selectedItems[0].value, 52, "question.selectedItems[0] value");
    assert.equal(question.selectedItems[0].text, "DisplayText_52", "question.selectedItems[0] text");
    assert.equal(question.selectedItems[1].value, 55, "question.selectedItems[1] value");
    assert.equal(question.selectedItems[1].text, "DisplayText_55", "question.selectedItems[1] text");
    done();
  }, 550);
});

QUnit.test("lazy loading + onGetChoiceDisplayValue: set survey data", assert => {
  const done = assert.async();
  const json = {
    questions: [{
      "type": "tagbox",
      "name": "q1",
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((sender, options) => {
    const total = 55;
    setTimeout(() => {
      if (options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    }, 500);
  });
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

  question.dropdownListModel.popupModel.isVisible = true;
  setTimeout(() => {
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
    done();
  }, 550);
});

QUnit.test("Check tagbox in mobile mode with closeOnSelect true", assert => {
  _setIsTouch(true);
  const json = {
    questions: [{
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
  const popupViewModel = new PopupBaseViewModel(popupModel);
  const doneAction = popupViewModel.footerToolbar.actions[0];
  const cancelAction = popupViewModel.footerToolbar.actions[1];
  const listModel = dropdownListModel["listModel"];
  const actions = listModel.actions;

  popupModel.toggleVisibility();
  assert.notOk(doneAction.enabled);
  listModel.onItemClick(actions[0]);
  assert.ok(doneAction.enabled);
  doneAction.action();
  assert.deepEqual(question.value, ["Item 1"]);

  popupModel.toggleVisibility();
  assert.notOk(doneAction.enabled);
  listModel.onItemClick(actions[1]);
  assert.ok(doneAction.enabled);
  assert.deepEqual(question.value, ["Item 1", "Item 2"]);
  cancelAction.action();
  assert.deepEqual(question.value, ["Item 1"]);

  popupModel.toggleVisibility();
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
    questions: [{
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
  debugger;

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
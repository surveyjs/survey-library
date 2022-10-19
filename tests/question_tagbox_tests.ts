import { SurveyModel } from "../src/survey";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { MultiSelectListModel } from "../src/multiSelectListModel";

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
  assert.equal(list.selectedItems.length, 1);
  assert.equal(list.actions[0].active, true);
  assert.equal(list.actions[3].active, false);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.selectedItems.length, 0);
  assert.equal(list.actions[0].active, false);
  assert.equal(list.actions[3].active, false);
  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[3]);
  assert.equal(list.selectedItems.length, 1);
  assert.equal(list.actions[0].active, false);
  assert.equal(list.actions[3].active, true);
  assert.deepEqual(question.value, ["item4"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.selectedItems.length, 2);
  assert.equal(list.actions[0].active, true);
  assert.equal(list.actions[3].active, true);
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
  assert.equal(list.selectedItems.length, 6, "list.selectedItems.length");

  list.onItemClick(item1); // 4 elements out of 5 are selected
  assert.equal(question.selectedItems.length, 4, "question.selectedItems.length");
  assert.deepEqual(question.value, ["item2", "item3", "item4", "item5"], "question.value");
  assert.equal(list.selectedItems.length, 4, "list.selectedItems.length");

  list.onItemClick(selectAllItem); // select all items
  assert.equal(question.selectedItems.length, 5, "question.selectedItems.length");
  assert.deepEqual(question.value, ["item1", "item2", "item3", "item4", "item5"], "question.value  isSelectAll");
  assert.equal(list.selectedItems.length, 6, "list.selectedItems.length");

  list.onItemClick(selectAllItem); // reset all items
  assert.equal(question.selectedItems.length, 0, "question.selectedItems.length");
  assert.deepEqual(question.value, [], "question.value");
  assert.equal(list.selectedItems.length, 0, "list.selectedItems.length");
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
  assert.equal(list.selectedItems.length, 1, "item1 selected");

  list.onItemClick(noneItem); // reset all items
  assert.equal(question.selectedItems.length, 1, "none selected");
  assert.deepEqual(question.value, ["none"], "none selected");
  assert.equal(list.selectedItems.length, 1, "none selected");

  list.onItemClick(item1); // 1 element out of 5 is selected
  assert.equal(question.selectedItems.length, 1, "item1 selected");
  assert.deepEqual(question.value, ["item1"], "item1 selected");
  assert.equal(list.selectedItems.length, 1, "item1 selected");
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
  assert.equal(list.selectedItems.length, 1);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.selectedItems.length, 0);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[3]);
  assert.equal(list.selectedItems.length, 1);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, ["item4"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.selectedItems.length, 2);
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
  assert.equal(list.selectedItems.length, 1);
  assert.equal(list.actions[0].visible, false);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.selectedItems.length, 0);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, true);
  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[3]);
  assert.equal(list.selectedItems.length, 1);
  assert.equal(list.actions[0].visible, true);
  assert.equal(list.actions[3].visible, false);
  assert.deepEqual(question.value, ["item4"]);

  list.onItemClick(list.actions[0]);
  assert.equal(list.selectedItems.length, 2);
  assert.equal(list.actions[0].visible, false);
  assert.equal(list.actions[3].visible, false);
  assert.deepEqual(question.value, ["item4", "item1"]);
});

function getNumberArray(skip = 1, count = 25): Array<number> {
  const result:Array<number> = [];
  for(let index = skip; index < (skip + count); index++) {
    result.push(index);
  }
  return result;
}

const callback = (_, opt) => {
  const total = 70;
  setTimeout(() => {
    if(opt.skip + opt.take < total) {
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
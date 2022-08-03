import { DropdownListModel } from "../src/dropdownListModel";
import { DropdownMultiSelectListModel } from "../src/dropdownMultiSelectListModel";
import { ListModel } from "../src/list";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { SurveyModel } from "../src/survey";

export default QUnit.module("DropdownListModel");

const jsonDropdown = {
  questions: [{
    type: "dropdown",
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
QUnit.test("DropdownListModel with ListModel", (assert) => {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof ListModel);

  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  assert.equal(list.actions.length, 28);

  list.onItemClick(list.actions[0]);
  assert.equal(question.value, "item1");
  assert.equal(list.selectedItem, list.actions[0]);
  assert.equal(list.actions[0].active, true);

  list.onItemClick(list.actions[3]);
  assert.equal(question.value, "item4");
  assert.equal(list.selectedItem, list.actions[3]);
  assert.equal(list.actions[0].active, false);
  assert.equal(list.actions[3].active, true);

  dropdownListModel.onClear(new Event("click"));
  assert.equal(question.value, undefined);
  assert.equal(list.selectedItem, undefined);
  assert.equal(list.actions[0].active, false);
  assert.equal(list.actions[3].active, false);
});

QUnit.test("DropdownListModel with MultiListModel", (assert) => {
  const survey = new SurveyModel(jsonTagbox);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownMultiSelectListModel(question);
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel);

  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
  assert.equal(list.actions.length, 28);
  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, ["item1"]);

  list.onItemClick(list.actions[3]);
  assert.deepEqual(question.value, ["item1", "item4"]);

  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, ["item4"]);

  dropdownListModel.onClear(new Event("click"));
  assert.equal(question.value.length, 0);
});

QUnit.test("DropdownListModel with MultiListModel state actions", (assert) => {
  const survey = new SurveyModel(jsonTagbox);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownMultiSelectListModel(question);
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel);

  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
  assert.equal(list.actions.length, 28);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions[0].active, true);
  assert.equal(list.actions[3].active, false);

  list.onItemClick(list.actions[3]);
  assert.equal(list.actions[0].active, true);
  assert.equal(list.actions[3].active, true);

  list.onItemClick(list.actions[0]);
  assert.equal(list.actions[0].active, false);
  assert.equal(list.actions[3].active, true);

  dropdownListModel.onClear(new Event("click"));
  assert.equal(list.actions[0].active, false);
  assert.equal(list.actions[3].active, false);
});
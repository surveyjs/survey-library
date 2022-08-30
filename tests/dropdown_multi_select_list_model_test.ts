import { DropdownMultiSelectListModel } from "../src/dropdownMultiSelectListModel";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { SurveyModel } from "../src/survey";

export default QUnit.module("DropdownListModel");

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
function getVisibleActionByIndex(list: MultiSelectListModel, index: number) {
  const array = list.renderedActions.filter(item => list.isItemVisible(item));
  return array[index];
}

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

QUnit.test("DropdownListModel with MultiListModel & searchEnabled false", (assert) => {
  const survey = new SurveyModel({
    questions: [{
      type: "tagbox",
      name: "question1",
      hasOther: "true",
      searchEnabled: "false",
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
  });
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  const dropdownListModel = question.dropdownListModel;
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel);

  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
  assert.equal(list.showFilter, false, "list.showFilter false");
  assert.equal(dropdownListModel.searchEnabled, false, "dropdownListModel.searchEnabled false");

  question.searchEnabled = true;
  assert.equal(list.showFilter, false, "list.showFilter false");
  assert.equal(dropdownListModel.searchEnabled, true, "dropdownListModel.searchEnabled true");
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

QUnit.test("open/hide tagbox popup after start/end filtration", function (assert) {
  const survey = new SurveyModel(jsonTagbox);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownMultiSelectListModel(question);
  const popup = dropdownListModel.popupModel;
  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

  assert.equal(popup.isVisible, false, "popup.isVisible 1");
  assert.equal(dropdownListModel.filterString, "", "filterString 1");

  dropdownListModel.filterString = "1";
  assert.equal(popup.isVisible, true, "popup.isVisible 2");

  list.onItemClick(getVisibleActionByIndex(list, 3));
  assert.equal(popup.isVisible, true, "popup.isVisible 3");
  assert.equal(dropdownListModel.filterString, "", "filterString 3");
  assert.deepEqual(question.value, ["item12"], "question.value before onClear");

  dropdownListModel.onClear(new Event("click"));
  assert.equal(dropdownListModel.filterString, "", "filterString after onClear");
  assert.deepEqual(question.value, [], "question.value after onClear");
});

QUnit.test("remove last selected item", function (assert) {
  const survey = new SurveyModel(jsonTagbox);
  const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownMultiSelectListModel(question);
  const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

  assert.deepEqual(question.value, []);

  list.onItemClick(list.actions[3]);
  list.onItemClick(list.actions[0]);
  assert.deepEqual(question.value, ["item4", "item1"]);

  dropdownListModel.removeLastSelectedItem();
  assert.deepEqual(question.value, ["item4"]);

  dropdownListModel.removeLastSelectedItem();
  assert.equal(question.value.length, 0);

  dropdownListModel.removeLastSelectedItem();
  assert.equal(question.value.length, 0);
});
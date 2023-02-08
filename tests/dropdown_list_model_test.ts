import { DropdownListModel } from "../src/dropdownListModel";
import { ListModel } from "../src/list";
import { PopupModel } from "../src/popup";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { SurveyModel } from "../src/survey";
import { _setIsTouch } from "../src/utils/devices";

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
function getVisibleActionByIndex(list: ListModel, index: number) {
  const array = list.renderedActions.filter(item => list.isItemVisible(item));
  return array[index];
}

QUnit.test("DropdownListModel with ListModel", (assert) => {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof ListModel);

  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  assert.equal(list.actions.length, 28);

  list.onItemClick(list.actions[0]);
  assert.equal(question.value, "item1");
  assert.ok(list.isItemSelected(list.actions[0]));

  list.onItemClick(list.actions[3]);
  assert.equal(question.value, "item4");
  assert.ok(list.isItemSelected(list.actions[3]));
  assert.equal(list.isItemSelected(list.actions[0]), false);

  dropdownListModel.onClear(new Event("click"));
  assert.equal(question.value, undefined);
  assert.equal(list.actions.filter(item => list.isItemSelected(item)).length, 0);
});

QUnit.test("DropdownListModel focusFirstInputSelector", (assert) => {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const popupModel = dropdownListModel.popupModel;
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  list.showFilter = true;

  popupModel.isVisible = true;
  assert.equal(list.actions.length, 28);
  assert.equal(question.value, undefined, "question.value");
  assert.equal(list.showFilter, true, "list.showFilter");
  assert.equal(popupModel.isVisible, true, "popupModel.isVisible");
  assert.equal(popupModel.focusFirstInputSelector, "", "showFilter=true && value = undefined");

  list.onItemClick(list.actions[0]);
  popupModel.isVisible = true;
  assert.equal(question.value, "item1", "question.value");
  assert.equal(list.showFilter, true, "list.showFilter");
  assert.equal(popupModel.isVisible, true, "popupModel.isVisible");
  assert.equal(popupModel.focusFirstInputSelector, "", "showFilter=true && value = 'item1'");

  popupModel.isVisible = false;
  dropdownListModel.onClear(new Event("click"));
  popupModel.isVisible = true;
  assert.equal(list.actions.length, 28);
  assert.equal(question.value, undefined, "question.value");
  assert.equal(list.showFilter, true, "list.showFilter");
  assert.equal(popupModel.isVisible, true, "popupModel.isVisible");
  assert.equal(popupModel.focusFirstInputSelector, "", "showFilter=true && value = undefined");

  popupModel.isVisible = false;
  list.setItems(list.actions.slice(0, 9));
  list.showFilter = false;
  popupModel.isVisible = true;
  assert.equal(list.actions.length, 9);
  assert.equal(question.value, undefined, "question.value");
  assert.equal(list.showFilter, false, "list.showFilter");
  assert.equal(popupModel.isVisible, true, "popupModel.isVisible");
  assert.equal(popupModel.focusFirstInputSelector, "", "showFilter=false && value = undefined");

  list.onItemClick(list.actions[0]);
  popupModel.isVisible = true;
  assert.equal(question.value, "item1", "question.value");
  assert.equal(list.showFilter, false, "list.showFilter");
  assert.equal(popupModel.isVisible, true, "popupModel.isVisible");
  assert.equal(popupModel.focusFirstInputSelector, ".sv-list__item--selected", "showFilter=false && value = 'item1'");
});
QUnit.test("DropdownListModel with ListModel & searchEnabled false", (assert) => {
  const survey = new SurveyModel({
    questions: [{
      type: "dropdown",
      name: "question1",
      searchEnabled: "false",
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
  });
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = question.dropdownListModel;
  assert.ok(dropdownListModel.popupModel.contentComponentData.model instanceof ListModel);

  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  assert.equal(list.actions.length, 28);
  assert.equal(list.showFilter, false, "list.showFilter false");
  assert.equal(dropdownListModel.searchEnabled, false, "dropdownListModel.searchEnabled false");

  question.searchEnabled = true;
  assert.equal(list.showFilter, false, "list.showFilter false");
  assert.equal(dropdownListModel.searchEnabled, true, "dropdownListModel.searchEnabled true");
});

QUnit.test("filterString test", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  assert.equal(list.renderedActions.length, 28);
  assert.equal(list.renderedActions.filter(item => list.isItemVisible(item)).length, 28);

  dropdownListModel.filterString = "1";
  assert.equal(list.renderedActions.length, 28);
  assert.equal(list.renderedActions.filter(item => list.isItemVisible(item)).length, 12);

  dropdownListModel.filterString = "11";
  assert.equal(list.renderedActions.length, 28);
  assert.equal(list.renderedActions.filter(item => list.isItemVisible(item)).length, 1);

  dropdownListModel.filterString = "110";
  assert.equal(list.renderedActions.length, 28);
  assert.equal(list.renderedActions.filter(item => list.isItemVisible(item)).length, 0);
});

QUnit.test("open/hide dropdown popup after start/end filtration", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const popup = dropdownListModel.popupModel;
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  assert.equal(popup.isVisible, false, "popup.isVisible 1");
  assert.equal(dropdownListModel.filterString, "", "filterString 1");

  dropdownListModel.filterString = "1";
  assert.equal(popup.isVisible, true, "popup.isVisible 2");

  list.onItemClick(getVisibleActionByIndex(list, 3));
  assert.equal(popup.isVisible, false, "popup.isVisible 3");
  assert.equal(dropdownListModel.filterString, "", "filterString 2");
  assert.equal(question.value, "item12", "question.value");

  dropdownListModel.onClear(new Event("click"));
  assert.equal(dropdownListModel.filterString, "", "filterString after onClear");
  assert.equal(question.value, undefined, "question.value after onClear");
});

QUnit.test("Check list classes with onUpdateQuestionCssClasses", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  survey.css = {
    list: {
      itemSelected: "original-class-selected"
    },
    dropdown: {
      list: {
        item: "original-class"
      }
    }
  };
  survey.onUpdateQuestionCssClasses.add(function (survey, options) {
    var classes = options.cssClasses;
    classes.list = {
      item: classes.list.item += " custom-class",
      itemSelected: classes.list.itemSelected += " custom-class-selected"
    };
  });
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  question.dropdownListModel = dropdownListModel;
  question.onFirstRendering();
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  assert.equal(list.cssClasses.item, "original-class custom-class");
  assert.equal(list.cssClasses.itemSelected, "original-class-selected custom-class-selected");
});

QUnit.test("Check overlay popup when IsTouch is true", function (assert) {
  _setIsTouch(true);
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const popup: PopupModel = dropdownListModel.popupModel;
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  assert.equal(list.searchEnabled, true);
  assert.equal(list.showSearchClearButton, true);
  assert.equal(popup.displayMode, "overlay");
  assert.ok(popup.isFocusedContent);
  assert.notOk(popup.setWidthByTarget);
  popup.isVisible = true;
  assert.ok(popup.isVisible);
  dropdownListModel.onBlur(null);
  assert.ok(popup.isVisible);
  _setIsTouch(false);
});
QUnit.test("Check dropdown list model is updated from value", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  question.value = "item1";
  assert.ok(list.isItemSelected(list.actions.filter(item => item.id === "item1")[0]));
  question.value = "item2";
  assert.ok(list.isItemSelected(list.actions.filter(item => item.id === "item2")[0]));
});
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
QUnit.test("DropdownListModel focusFirstInputSelector mobile", (assert) => {
  _setIsTouch(true);
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const popupModel = dropdownListModel.popupModel;
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  popupModel.isVisible = true;
  assert.equal(popupModel.focusFirstInputSelector, ".sv-list__item", "value = undefined && isTouch = true");

  list.onItemClick(list.actions[0]);
  popupModel.isVisible = false;

  popupModel.isVisible = true;
  assert.equal(popupModel.focusFirstInputSelector, ".sv-list__item--selected", "isTouch=true && value = 'item1'");
  _setIsTouch(false);
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

  assert.equal(dropdownListModel.inputMode, "text");
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
  assert.equal(dropdownListModel.inputMode, "none");
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

QUnit.test("filterString and focusedItem", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  assert.equal(dropdownListModel.inputMode, "text");
  assert.equal(list.renderedActions.length, 28);
  assert.equal(list.renderedActions.filter(item => list.isItemVisible(item)).length, 28);

  dropdownListModel.filterString = "1";
  assert.equal(list.focusedItem.id, "item1");

  dropdownListModel.filterString = "";
  question.value = "item11";
  dropdownListModel.filterString = "1";
  assert.equal(list.focusedItem.id, "item11");
});

QUnit.test("hintString test", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  assert.equal(dropdownListModel.inputMode, "text");
  assert.notOk(dropdownListModel.showHintPrefix, "no filter, hint prefix hidden");
  assert.notOk(dropdownListModel.showHintString, "no filter, hint hidden");

  dropdownListModel.inputStringRendered = "It";
  assert.notOk(dropdownListModel.showHintPrefix, "filter from start, hint prefix hidden");
  assert.ok(dropdownListModel.showHintString, "filter from start, hint visible");
  assert.equal(dropdownListModel.hintString, "item1", "filter from start, hint string correct");
  assert.equal(dropdownListModel.hintStringSuffix, "em1", "filter from start, hint suffix correct");

  dropdownListModel.inputStringRendered = "te";
  assert.ok(dropdownListModel.showHintPrefix, "filter from middle, hint prefix visible");
  assert.ok(dropdownListModel.showHintString, "filter from middle, hint visible");
  assert.equal(dropdownListModel.hintStringPrefix, "i", "filter from middle, hint prefix correct");
  assert.equal(dropdownListModel.hintStringSuffix, "m1", "filter from middle, hint suffix correct");

  dropdownListModel.inputStringRendered = "zzz";
  assert.notOk(dropdownListModel.showHintPrefix, "wrong filter, hint prefix hidden");
  assert.notOk(dropdownListModel.showHintString, "wrong filter, hint hidden");

  question.value = "item3";
  dropdownListModel.inputStringRendered = "it";
  assert.notOk(dropdownListModel.showHintPrefix, "filter from start with value, hint prefix hidden");
  assert.ok(dropdownListModel.showHintString, "filter from start with value, hint visible");
  assert.equal(dropdownListModel.hintStringSuffix, "em3", "filter from start with value, hint suffix correct");
});

QUnit.test("hintString test - no search", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  question.searchEnabled = false;

  assert.equal(dropdownListModel.inputMode, "text");
  assert.notOk(dropdownListModel.showHintString, "no search, hint hidden");
});

QUnit.test("dropdown keyboard tests", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  const event = {
    keyCode: 0,
    preventDefault: () => { },
    stopPropagation: () => { }
  };

  assert.equal(dropdownListModel.inputString, "", "inputString default is empty");
  assert.equal(dropdownListModel.hintString, "", "hintString default is empty");
  assert.notOk(dropdownListModel.popupModel.isVisible, "popup is not visible by default");

  // TODO: change this behaviour (show popup on UP key)
  event.keyCode = 38;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on first UP");
  assert.equal(dropdownListModel.hintString, "", "hintString still empty on first UP");
  assert.notOk(dropdownListModel.popupModel.isVisible, "popup is still hidden on first UP");

  event.keyCode = 40;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on first DOWN");
  assert.equal(dropdownListModel.hintString, "item1", "hintString changed on first DOWN");
  assert.ok(dropdownListModel.showHintString, "hintString already shown on first DOWN");
  assert.ok(dropdownListModel.popupModel.isVisible, "popup is visible on first DOWN");

  event.keyCode = 40;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on second DOWN");
  assert.equal(dropdownListModel.hintString, "item2", "hintString changed on second DOWN");
  assert.equal(question.value, undefined, "value not changed on second DOWN");

  event.keyCode = 38;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on UP");
  assert.equal(dropdownListModel.hintString, "item1", "hintString changed on UP");
  assert.equal(question.value, undefined, "value not changed on UP");

  event.keyCode = 27;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString cleared on Escape");
  assert.equal(dropdownListModel.hintString, "", "hintString cleared on Escape");
  assert.equal(question.value, undefined, "value not changed on Escape");
  assert.notOk(dropdownListModel.popupModel.isVisible, "popup is not visible on Escape");

  event.keyCode = 13;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on first Enter");
  assert.equal(dropdownListModel.hintString, "item1", "hintString changed on first Enter");
  assert.equal(question.value, undefined, "value not changed on first Enter");
  assert.ok(dropdownListModel.popupModel.isVisible, "popup shown on first Enter");

  event.keyCode = 13;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "item1", "inputString changed on Enter");
  assert.ok(!dropdownListModel.hintString || dropdownListModel.hintString == dropdownListModel.inputString, "hintString empty or equal to inputString on Enter");
  assert.equal(question.value, "item1", "value  changed on Enter");
  assert.notOk(dropdownListModel.popupModel.isVisible, "popup is not visible on Enter");

  event.keyCode = 40;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "item1", "inputString is set on DOWN again");
  assert.equal(dropdownListModel.hintString, "item1", "hintString is set on DOWN again");
  assert.ok(dropdownListModel.popupModel.isVisible, "popup is visible on DOWN again");

  event.keyCode = 40;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "item2", "inputString is changed on DOWN one more time");
  assert.equal(dropdownListModel.hintString, "item2", "hintString is changed too on DOWN one more time");
  assert.ok(!dropdownListModel.hintString || dropdownListModel.hintString == dropdownListModel.inputString, "hintString empty or equal to inputString on DOWN one more time");

  event.keyCode = 27;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "item1", "inputString rolled back on Esc");
  assert.equal(dropdownListModel.hintString, "item1", "hintString equal to inputString when rolled back on Esc");
  assert.equal(question.value, "item1", "value rolled back on Esc");
});

QUnit.test("dropdown keyboard tests - empty question, search disabled", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  const event = {
    keyCode: 0,
    preventDefault: () => { },
    stopPropagation: () => { }
  };

  question.searchEnabled = false;
  assert.equal(dropdownListModel.inputString, "", "inputString default is empty");
  assert.equal(dropdownListModel.hintString, "", "hintString default is empty");
  assert.notOk(dropdownListModel.popupModel.isVisible, "popup is not visible by default");

  // TODO: change this behaviour (show popup on UP key)
  event.keyCode = 38;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on first UP");
  assert.equal(dropdownListModel.hintString, "", "hintString still empty on first UP");
  assert.notOk(dropdownListModel.popupModel.isVisible, "popup is still hidden on first UP");

  event.keyCode = 40;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on first DOWN");
  assert.equal(dropdownListModel.hintString, "item1", "hintString changed on first DOWN");
  assert.ok(dropdownListModel.showHintString, "hintString already shown on first DOWN");
  assert.ok(dropdownListModel.popupModel.isVisible, "popup is visible on first DOWN");

  event.keyCode = 40;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on second DOWN");
  assert.equal(dropdownListModel.hintString, "item2", "hintString changed on second DOWN");
  assert.equal(question.value, undefined, "value not changed on second DOWN");

  event.keyCode = 38;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString still empty on UP");
  assert.equal(dropdownListModel.hintString, "item1", "hintString changed on UP");
  assert.equal(question.value, undefined, "value not changed on UP");

  event.keyCode = 27;
  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputString, "", "inputString cleared on Escape");
  assert.equal(dropdownListModel.hintString, "", "hintString cleared on Escape");
  assert.equal(question.value, undefined, "value not changed on Escape");
  assert.notOk(dropdownListModel.popupModel.isVisible, "popup is not visible on Escape");
});

QUnit.test("always show invisible hint part", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  question.value = "item1";
  dropdownListModel.onFocus(null);
  assert.notOk(dropdownListModel.showHintPrefix, "input equal to value, hint prefix hidden");
  assert.ok(dropdownListModel.showHintString, "input equal to value, hint visible");
  assert.equal(dropdownListModel.hintString, "item1", "input equal to value, hint string should be set on focus");
  assert.equal(dropdownListModel.hintStringSuffix, "", "input equal to value, hint suffix empty");

  dropdownListModel["listModel"].onItemClick(dropdownListModel["listModel"].actions[4]);
  assert.notOk(dropdownListModel.showHintPrefix, "list click, hint prefix hidden");
  assert.ok(dropdownListModel.showHintString, "list click, hint visible");
  assert.equal(dropdownListModel.hintString, "item5", "list click, hint string should be set on click");
  assert.equal(dropdownListModel.hintStringSuffix, "", "list click, hint suffix empty");
});

QUnit.test("change selection on keyboard", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  dropdownListModel.onClick(null);
  assert.equal(list.actions.filter(a => (a as any).selected).length, 0, "no selected items when no value");
  assert.notOk(question.selectedItemLocText, "no selected text when no value");

  dropdownListModel.changeSelectionWithKeyboard(false);
  assert.equal(list.actions.filter(a => (a as any).selected).length, 0, "still no selected items when no value");
  assert.notOk(question.selectedItemLocText, "still no selected text when no value");
  dropdownListModel.onClick(null);

  question.value = "item1";
  dropdownListModel.onClick(null);
  assert.equal(question.value, "item1");
  assert.equal((list.actions.filter(a => (a as any).selected)[0] as any).value, "item1");
  assert.equal(question.selectedItemLocText.calculatedText, "item1");

  dropdownListModel.changeSelectionWithKeyboard(false);
  assert.equal(question.value, "item1");
  assert.equal((list.actions.filter(a => (a as any).selected)[0] as any).value, "item2");
  assert.equal(question.selectedItemLocText.calculatedText, "item2", "selected item is changed too on DOWN one more time");

  dropdownListModel.changeSelectionWithKeyboard(false);
  assert.equal(question.value, "item1");
  assert.equal((list.actions.filter(a => (a as any).selected)[0] as any).value, "item3");
  assert.equal(question.selectedItemLocText.calculatedText, "item3", "selected item is changed too on DOWN one more time");

  (dropdownListModel as any).onHidePopup();
  assert.equal(question.selectedItemLocText.calculatedText, "item1");
});

QUnit.test("filtering on question with value", function (assert) {
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

  question.value = "item1";

  dropdownListModel.onClick(null);
  assert.equal((list.actions.filter(a => (a as any).selected)[0] as any).value, "item1");
  assert.equal(dropdownListModel.inputStringRendered, "item1", "input string is set to value");
  dropdownListModel.changeSelectionWithKeyboard(false);
  assert.equal((list.actions.filter(a => (a as any).selected)[0] as any).value, "item2", "selected item changed");
  assert.equal(dropdownListModel.inputStringRendered, "item2", "input string rendered changed");

  dropdownListModel.inputStringRendered = "i";
  assert.equal(list.actions.filter(a => (a as any).selected).length, 0, "no selected items when filtering");

  dropdownListModel.changeSelectionWithKeyboard(false);
  assert.equal(list.actions.filter(a => (a as any).selected).length, 0, "no selected items when filtering and move key");

});

QUnit.test("hintString letter case", function (assert) {
  const survey = new SurveyModel({
    questions: [{
      type: "dropdown",
      name: "question1",
      hasOther: "true",
      choices: [
        "AbcAbc",
        "cAbcAb",
        "caBcaB",
      ]
    }]
  });
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = new DropdownListModel(question);

  dropdownListModel.inputStringRendered = "Ab";
  assert.equal(dropdownListModel.hintString, "AbcAbc");
  dropdownListModel.changeSelectionWithKeyboard(false);
  assert.equal(dropdownListModel.hintString, "cAbcAb");
  assert.equal(dropdownListModel.inputStringRendered, "Ab");
  dropdownListModel.changeSelectionWithKeyboard(false);
  assert.equal(dropdownListModel.hintString, "caBcaB");
  assert.equal(dropdownListModel.inputStringRendered, "aB");
});
import { DropdownListModel } from "../src/dropdownListModel";
import { ListModel } from "../src/list";
import { PopupModel } from "../src/popup";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { SurveyModel } from "../src/survey";
import { _setIsTouch } from "../src/utils/devices";
import { PopupDropdownViewModel } from "../src/popup-dropdown-view-model";

import { describe, test, expect } from "vitest";
describe("DropdownListModel", () => {
  const jsonDropdown = {
    elements: [{
      type: "dropdown",
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
  function getVisibleActionByIndex(list: ListModel, index: number) {
    const array = list.renderedActions.filter(item => list.isItemVisible(item));
    return array[index];
  }

  test("DropdownListModel with ListModel", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof ListModel).toBeTruthy();

    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    expect(list.actions.length).toBe(28);

    list.onItemClick(list.actions[0]);
    expect(question.value).toBe("item1");
    expect(list.isItemSelected(list.actions[0])).toBeTruthy();

    list.onItemClick(list.actions[3]);
    expect(question.value).toBe("item4");
    expect(list.isItemSelected(list.actions[3])).toBeTruthy();
    expect(list.isItemSelected(list.actions[0])).toBe(false);

    dropdownListModel.onClear(new Event("click"));
    expect(question.value).toBeUndefined();
    expect(list.actions.filter(item => list.isItemSelected(item)).length).toBe(0);
  });

  test("DropdownListModel focusFirstInputSelector", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popupModel = dropdownListModel.popupModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    list.showFilter = true;

    popupModel.isVisible = true;
    expect(list.actions.length).toBe(28);
    expect(question.value, "question.value").toBeUndefined();
    expect(list.showFilter, "list.showFilter").toBe(true);
    expect(popupModel.isVisible, "popupModel.isVisible").toBe(true);
    expect(popupModel.focusFirstInputSelector, "showFilter=true && value = undefined").toBe("");

    list.onItemClick(list.actions[0]);
    popupModel.isVisible = true;
    expect(question.value, "question.value").toBe("item1");
    expect(list.showFilter, "list.showFilter").toBe(true);
    expect(popupModel.isVisible, "popupModel.isVisible").toBe(true);
    expect(popupModel.focusFirstInputSelector, "showFilter=true && value = 'item1'").toBe("");

    popupModel.isVisible = false;
    dropdownListModel.onClear(new Event("click"));
    popupModel.isVisible = true;
    expect(list.actions.length).toBe(28);
    expect(question.value, "question.value").toBeUndefined();
    expect(list.showFilter, "list.showFilter").toBe(true);
    expect(popupModel.isVisible, "popupModel.isVisible").toBe(true);
    expect(popupModel.focusFirstInputSelector, "showFilter=true && value = undefined").toBe("");

    popupModel.isVisible = false;
    list.setItems(list.actions.slice(0, 9));
    list.showFilter = false;
    popupModel.isVisible = true;
    expect(list.actions.length).toBe(9);
    expect(question.value, "question.value").toBeUndefined();
    expect(list.showFilter, "list.showFilter").toBe(false);
    expect(popupModel.isVisible, "popupModel.isVisible").toBe(true);
    expect(popupModel.focusFirstInputSelector, "showFilter=false && value = undefined").toBe("");

    list.onItemClick(list.actions[0]);
    popupModel.isVisible = true;
    expect(question.value, "question.value").toBe("item1");
    expect(list.showFilter, "list.showFilter").toBe(false);
    expect(popupModel.isVisible, "popupModel.isVisible").toBe(true);
    expect(popupModel.focusFirstInputSelector, "showFilter=false && value = 'item1'").toBe(".sv-list__item--selected");
  });
  test("DropdownListModel focusFirstInputSelector mobile", () => {
    _setIsTouch(true);
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popupModel = dropdownListModel.popupModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    popupModel.isVisible = true;
    expect(popupModel.focusFirstInputSelector, "value = undefined && isTouch = true").toBe(".sv-list__item");

    list.onItemClick(list.actions[0]);
    popupModel.isVisible = false;

    popupModel.isVisible = true;
    expect(popupModel.focusFirstInputSelector, "isTouch=true && value = 'item1'").toBe(".sv-list__item--selected");
    _setIsTouch(false);
  });
  test("DropdownListModel with ListModel & searchEnabled false", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        searchEnabled: "false",
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
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof ListModel).toBeTruthy();

    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    expect(list.actions.length).toBe(28);
    expect(list.showFilter, "list.showFilter false").toBe(false);
    expect(dropdownListModel.searchEnabled, "dropdownListModel.searchEnabled false").toBe(false);

    question.searchEnabled = true;
    expect(list.showFilter, "list.showFilter false").toBe(false);
    expect(dropdownListModel.searchEnabled, "dropdownListModel.searchEnabled true").toBe(true);
  });

  test("filterString test", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    list.flushUpdates();

    expect(dropdownListModel.inputMode).toBe("text");
    expect(list.renderedActions.length).toBe(28);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(28);

    dropdownListModel.filterString = "1";
    expect(list.renderedActions.length).toBe(28);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(12);

    dropdownListModel.filterString = "11";
    expect(list.renderedActions.length).toBe(28);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(1);

    dropdownListModel.filterString = "110";
    expect(list.renderedActions.length).toBe(28);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(0);
  });

  test("filterString supports ASCII and Turkish dotted i search", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        choices: ["ADIYAMAN", "ANKARA", "ISTANBUL"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    list.flushUpdates();

    dropdownListModel.filterString = "adi";
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "search by adi").toBe(1);
    expect(list.renderedActions.filter(item => list.isItemVisible(item))[0].title, "adi matches ADIYAMAN").toBe("ADIYAMAN");

    dropdownListModel.filterString = "adı";// eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length, "search by adı").toBe(1);// eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(list.renderedActions.filter(item => list.isItemVisible(item))[0].title, "adı matches ADIYAMAN").toBe("ADIYAMAN");// eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  });

  test("open/hide dropdown popup after start/end filtration", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popup = dropdownListModel.popupModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    list.flushUpdates();

    expect(popup.isVisible, "popup.isVisible 1").toBe(false);
    expect(dropdownListModel.filterString, "filterString 1").toBe("");

    dropdownListModel.filterString = "1";
    expect(popup.isVisible, "popup.isVisible 2").toBe(true);

    list.onItemClick(getVisibleActionByIndex(list, 3));
    expect(popup.isVisible, "popup.isVisible 3").toBe(false);
    expect(dropdownListModel.filterString, "filterString 2").toBe("");
    expect(question.value, "question.value").toBe("item12");

    dropdownListModel.onClear(new Event("click"));
    expect(dropdownListModel.filterString, "filterString after onClear").toBe("");
    expect(question.value, "question.value after onClear").toBeUndefined();
  });

  test("hide dropdown on clear", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popup = dropdownListModel.popupModel;

    popup.isVisible = true;
    dropdownListModel.onClear(new Event("click"));
    expect(popup.isVisible, "hide popup after onClear").toBeFalsy();
  });

  test("hide component on input entering symbols", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    question.inputFieldComponent = "component-name";
    question.value = "Ford";
    expect(question.showInputFieldComponent).toBeTruthy();
    dropdownListModel.inputStringRendered = "abc";
    expect(question.showInputFieldComponent).toBeFalsy();
  });

  test("Check list classes with onUpdateQuestionCssClasses", () => {
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
    const dropdownListModel = question.dropdownListModel;
    question.dropdownListModel = dropdownListModel;
    expect(question.cssClassesValue).toBeTruthy();
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    expect(list.cssClasses.item).toBe("original-class custom-class");
    expect(list.cssClasses.itemSelected).toBe("original-class-selected custom-class-selected");
  });

  test("Check overlay popup when IsTouch is true", () => {
    _setIsTouch(true);
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popup: PopupModel = dropdownListModel.popupModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    expect(dropdownListModel.inputMode).toBe("none");
    expect(list.searchEnabled).toBe(true);
    expect(list.showSearchClearButton).toBe(true);
    expect(popup.displayMode).toBe("overlay");
    expect(popup.getDisplayMode()).toBe("menu-popup-overlay");
    expect(popup.isFocusedContent).toBeTruthy();
    expect(popup.setWidthByTarget).toBeFalsy();
    popup.isVisible = true;
    expect(popup.isVisible).toBeTruthy();
    dropdownListModel.onBlur(null);
    expect(popup.isVisible).toBeTruthy();
    _setIsTouch(false);
  });
  test("Check dropdown list model is updated from value", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    question.value = "item1";
    expect(list.isItemSelected(list.actions.filter(item => item.id === "item1")[0])).toBeTruthy();
    question.value = "item2";
    expect(list.isItemSelected(list.actions.filter(item => item.id === "item2")[0])).toBeTruthy();
  });

  test("filterString and focusedItem", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    list.flushUpdates();

    expect(dropdownListModel.inputMode).toBe("text");
    expect(list.renderedActions.length).toBe(28);
    expect(list.renderedActions.filter(item => list.isItemVisible(item)).length).toBe(28);

    dropdownListModel.filterString = "1";
    expect(list.focusedItem.id).toBe("item1");

    dropdownListModel.filterString = "";
    question.value = "item11";
    dropdownListModel.filterString = "1";
    expect(list.focusedItem.id).toBe("item11");
  });

  test("hintString test", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    expect(dropdownListModel.inputMode).toBe("text");
    expect(dropdownListModel.showHintPrefix, "no filter, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "no filter, hint hidden").toBeFalsy();

    dropdownListModel.inputStringRendered = "It";
    expect(dropdownListModel.showHintPrefix, "filter from start, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "filter from start, hint visible").toBeTruthy();
    expect(dropdownListModel.hintString, "filter from start, hint string correct").toBe("item1");
    expect(dropdownListModel.hintStringSuffix, "filter from start, hint suffix correct").toBe("em1");

    dropdownListModel.inputStringRendered = "te";
    expect(dropdownListModel.showHintPrefix, "filter from middle, hint prefix visible").toBeTruthy();
    expect(dropdownListModel.showHintString, "filter from middle, hint visible").toBeTruthy();
    expect(dropdownListModel.hintStringPrefix, "filter from middle, hint prefix correct").toBe("i");
    expect(dropdownListModel.hintStringSuffix, "filter from middle, hint suffix correct").toBe("m1");

    dropdownListModel.inputStringRendered = "zzz";
    expect(dropdownListModel.showHintPrefix, "wrong filter, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "wrong filter, shown hidden").toBeTruthy();

    question.value = "item3";
    dropdownListModel.inputStringRendered = "it";
    expect(dropdownListModel.showHintPrefix, "filter from start with value, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "filter from start with value, hint visible").toBeTruthy();
    expect(dropdownListModel.hintStringSuffix, "filter from start with value, hint suffix correct").toBe("em3");
  });

  test("showHintString for zero values", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        showOtherItem: "true",
        searchEnabled: false,
        choices: [
          0,
          "1"]
      }
      ]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    dropdownListModel.inputStringRendered = "1";
    question.value = 0;
    expect(dropdownListModel.showHintString, "no hint").toBeFalsy();
  });

  test("hintString test - no search", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    question.searchEnabled = false;

    expect(dropdownListModel.inputMode).toBe("text");
    expect(dropdownListModel.showHintString, "no search, hint hidden").toBeFalsy();
  });

  test("hintString test - clear, see nothing", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    question.value = "item12";
    dropdownListModel.onFocus(null);
    dropdownListModel.inputStringRendered = "";
    expect(dropdownListModel.showHintString).toBeFalsy();
    expect(question.showSelectedItemLocText).toBeFalsy();
    dropdownListModel.onBlur({ stopPropagation: () => { } });
    expect(question.showSelectedItemLocText).toBeTruthy();
  });

  test("dropdown keyboard tests", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popupViewModel = new PopupDropdownViewModel(dropdownListModel.popupModel); // need for popupModel.onHide
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    expect(dropdownListModel.inputString, "inputString default is empty").toBe("");
    expect(dropdownListModel.hintString, "hintString default is empty").toBe("");
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible by default").toBeFalsy();

    // TODO: change this behaviour (show popup on UP key)
    event.keyCode = 38;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on first UP").toBe("");
    expect(dropdownListModel.hintString, "hintString still empty on first UP").toBe("");
    expect(dropdownListModel.popupModel.isVisible, "popup is still hidden on first UP").toBeFalsy();

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on first DOWN").toBe("");
    expect(dropdownListModel.hintString, "hintString changed on first DOWN").toBe("item1");
    expect(dropdownListModel.showHintString, "hintString already shown on first DOWN").toBeTruthy();
    expect(dropdownListModel.popupModel.isVisible, "popup is visible on first DOWN").toBeTruthy();

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on second DOWN").toBe("");
    expect(dropdownListModel.hintString, "hintString changed on second DOWN").toBe("item2");
    expect(question.value, "value not changed on second DOWN").toBeUndefined();

    event.keyCode = 38;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on UP").toBe("");
    expect(dropdownListModel.hintString, "hintString changed on UP").toBe("item1");
    expect(question.value, "value not changed on UP").toBeUndefined();

    event.keyCode = 27;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString cleared on Escape").toBe("");
    expect(dropdownListModel.hintString, "hintString cleared on Escape").toBe("");
    expect(question.value, "value not changed on Escape").toBeUndefined();
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible on Escape").toBeFalsy();

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on keydown").toBe("");
    expect(dropdownListModel.hintString, "hintString changed on keydown").toBe("item1");
    expect(question.value, "value not changed on keydown").toBeUndefined();
    expect(dropdownListModel.popupModel.isVisible, "popup shown on keydown").toBeTruthy();

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString changed on Enter").toBe("item1");
    expect(!dropdownListModel.hintString || dropdownListModel.hintString == dropdownListModel.inputString, "hintString empty or equal to inputString on Enter").toBeTruthy();
    expect(question.value, "value  changed on Enter").toBe("item1");
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible on Enter").toBeFalsy();

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is set on DOWN again").toBe("item1");
    expect(dropdownListModel.hintString, "hintString is set on DOWN again").toBe("item1");
    expect(dropdownListModel.popupModel.isVisible, "popup is visible on DOWN again").toBeTruthy();

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is changed on DOWN one more time").toBe("item2");
    expect(dropdownListModel.hintString, "hintString is changed too on DOWN one more time").toBe("item2");
    expect(!dropdownListModel.hintString || dropdownListModel.hintString == dropdownListModel.inputString, "hintString empty or equal to inputString on DOWN one more time").toBeTruthy();

    event.keyCode = 27;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString rolled back on Esc").toBe("item1");
    expect(dropdownListModel.hintString, "hintString equal to inputString when rolled back on Esc").toBe("item1");
    expect(question.value, "value rolled back on Esc").toBe("item1");
  });

  test("dropdown incorrect popup open test", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    question.defaultValue = "item22";
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    dropdownListModel.onFocus(null);

    expect(dropdownListModel.inputString, "inputString is item22").toBe("item22");
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible by default").toBeFalsy();

    dropdownListModel.inputStringRendered = "item2";
    expect(dropdownListModel.inputString, "inputString is item2").toBe("item2");
    expect(dropdownListModel.hintString, "hintString is item22").toBe("item22");
    expect(dropdownListModel.popupModel.isVisible, "popup is visible").toBeTruthy();

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is item22 on Enter").toBe("item22");
    expect(dropdownListModel.popupModel.isVisible, "popup is hidden").toBeFalsy();

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is item22 on Enter again").toBe("item22");
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible 2").toBeFalsy();
  });

  test("dropdown incorrect popup open test: lazy load", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        defaultValue: "item12",
        choicesLazyLoadEnabled: true
      }
      ]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    survey.onChoicesLazyLoad.add((sender, options) => {
      var result: any = [];
      for (let index = 3; index < 23; index++) {
        result.push({ value: "item" + index, text: "item" + index });
      }
      result = result.filter(i => i.text.indexOf(options.filter) != -1);
      options.setItems(result, result.length);
    });
    survey.onGetChoiceDisplayValue.add((_, options) => {
      options.setItems(options.values);
    });

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    question.showSelectedItemLocText;
    expect(question.showSelectedItemLocText, "check showSelectedItemLocText to raise onGetChoiceDisplayValue event").toBe(true);
    dropdownListModel.onFocus(null);

    expect(dropdownListModel.inputString, "inputString is item12").toBe("item12");
    expect(dropdownListModel.hintString, "hintString is item12").toBe("item12");
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible by default").toBeFalsy();

    dropdownListModel.inputStringRendered = "item2";
    expect(dropdownListModel.inputString, "inputString is item1").toBe("item2");
    expect(dropdownListModel.hintString, "hintString is item20").toBe("item20");
    expect(dropdownListModel.popupModel.isVisible, "popup is visible").toBeTruthy();

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is item22 on Enter").toBe("item20");

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is item22 on Enter again").toBe("item20");
  });

  test("lazy load & hintString test", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        defaultValue: "item52",
        choicesLazyLoadEnabled: true
      }
      ]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    let callback;
    survey.onChoicesLazyLoad.add((sender, options) => {
      var result: any = [];
      for (let index = 46; index < 55; index++) {
        result.push({ value: "item" + index, text: "item" + index });
      }
      result = result.filter(i => i.text.indexOf(options.filter) != -1);
      callback = () => { options.setItems(result, result.length); };
    });
    survey.onGetChoiceDisplayValue.add((_, options) => {
      options.setItems(options.values);
    });
    dropdownListModel.inputStringRendered = "4";
    expect(dropdownListModel.hintStringSuffix, "hintStringSuffix empty").toBe("");
    callback();
    expect(dropdownListModel.hintString, "hintString is item46").toBe("item46");
    expect(dropdownListModel.hintStringSuffix, "hintStringSuffix is 6").toBe("6");
  });

  test("dropdown incorrect popup open test: lazy load, many items", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        defaultValue: "item500",
        choicesLazyLoadEnabled: true
      }
      ]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    survey.onChoicesLazyLoad.add((sender, options) => {
      var result: any = [];
      for (let index = 3; index < 1000; index++) {
        result.push({ value: "item" + index, text: "item" + index });
      }
      result = result.filter(i => i.text.indexOf(options.filter) != -1);
      var res1 = result.slice(options.skip, options.take + options.skip);
      options.setItems(res1, result.length);
    });
    survey.onGetChoiceDisplayValue.add((_, options) => {
      options.setItems(options.values);
    });

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    question.showSelectedItemLocText;
    expect(question.showSelectedItemLocText, "check showSelectedItemLocText to raise onGetChoiceDisplayValue event").toBe(true);
    dropdownListModel.onFocus(null);

    expect(dropdownListModel.inputString, "inputString is item500").toBe("item500");

    dropdownListModel.inputStringRendered = "item900";
    expect(dropdownListModel.inputString, "inputString is item900").toBe("item900");
    expect(dropdownListModel.hintString, "hintString is item900").toBe("item900");

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is item900 on Enter").toBe("item900");

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString is item900 on Enter again").toBe("item900");
  });

  test("dropdown keyboard tests - empty question, search disabled", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    question.searchEnabled = false;
    expect(dropdownListModel.inputString, "inputString default is empty").toBe("");
    expect(dropdownListModel.hintString, "hintString default is empty").toBe("");
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible by default").toBeFalsy();

    // TODO: change this behaviour (show popup on UP key)
    event.keyCode = 38;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on first UP").toBe("");
    expect(dropdownListModel.hintString, "hintString still empty on first UP").toBe("");
    expect(dropdownListModel.popupModel.isVisible, "popup is still hidden on first UP").toBeFalsy();

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on first DOWN").toBe("");
    expect(dropdownListModel.hintString, "hintString changed on first DOWN").toBe("item1");
    expect(dropdownListModel.showHintString, "hintString already shown on first DOWN").toBeTruthy();
    expect(dropdownListModel.popupModel.isVisible, "popup is visible on first DOWN").toBeTruthy();

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on second DOWN").toBe("");
    expect(dropdownListModel.hintString, "hintString changed on second DOWN").toBe("item2");
    expect(question.value, "value not changed on second DOWN").toBeUndefined();

    event.keyCode = 38;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString still empty on UP").toBe("");
    expect(dropdownListModel.hintString, "hintString changed on UP").toBe("item1");
    expect(question.value, "value not changed on UP").toBeUndefined();

    event.keyCode = 27;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputString, "inputString cleared on Escape").toBe("");
    expect(dropdownListModel.hintString, "hintString cleared on Escape").toBe("");
    expect(question.value, "value not changed on Escape").toBeUndefined();
    expect(dropdownListModel.popupModel.isVisible, "popup is not visible on Escape").toBeFalsy();
  });

  test("always show invisible hint part", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    question.value = "item1";
    dropdownListModel.onFocus(null);
    expect(dropdownListModel.showHintPrefix, "input equal to value, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "input equal to value, hint visible").toBeTruthy();
    expect(dropdownListModel.hintString, "input equal to value, hint string should be set on focus").toBe("item1");
    expect(dropdownListModel.hintStringSuffix, "input equal to value, hint suffix empty").toBe("");

    dropdownListModel["listModel"].onItemClick(dropdownListModel["listModel"].actions[4]);
    expect(dropdownListModel.showHintPrefix, "list click, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "list click, hint visible").toBeTruthy();
    expect(dropdownListModel.hintString, "list click, hint string should be set on click").toBe("item5");
    expect(dropdownListModel.hintStringSuffix, "list click, hint suffix empty").toBe("");
  });

  test("change selection on keyboard", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const popupViewModel = new PopupDropdownViewModel(dropdownListModel.popupModel); // need for popupModel.onHide
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    dropdownListModel.onClick(null);
    expect(list.actions.filter(a => (a as any).selected).length, "no selected items when no value").toBe(0);
    expect(question.selectedItemLocText, "no selected text when no value").toBeFalsy();

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(list.actions.filter(a => (a as any).selected).length, "still no selected items when no value").toBe(0);
    expect(question.selectedItemLocText, "still no selected text when no value").toBeFalsy();
    dropdownListModel.onClick(null);

    question.value = "item1";
    dropdownListModel.onClick(null);
    expect(question.value).toBe("item1");
    expect((list.actions.filter(a => (a as any).selected)[0] as any).value).toBe("item1");
    expect(question.selectedItemLocText.calculatedText).toBe("item1");

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(question.value).toBe("item1");
    expect((list.actions.filter(a => (a as any).selected)[0] as any).value).toBe("item2");
    expect(question.selectedItemLocText.calculatedText, "selected item is changed too on DOWN one more time").toBe("item2");

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(question.value).toBe("item1");
    expect((list.actions.filter(a => (a as any).selected)[0] as any).value).toBe("item3");
    expect(question.selectedItemLocText.calculatedText, "selected item is changed too on DOWN one more time").toBe("item3");

    (dropdownListModel as any).onHidePopup();
    expect(question.selectedItemLocText.calculatedText).toBe("item1");
  });

  test("filtering on question with value", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    question.value = "item1";

    dropdownListModel.onClick(null);
    expect((list.actions.filter(a => (a as any).selected)[0] as any).value).toBe("item1");
    expect(dropdownListModel.inputStringRendered, "input string is set to value").toBe("item1");
    dropdownListModel.changeSelectionWithKeyboard(false);
    expect((list.actions.filter(a => (a as any).selected)[0] as any).value, "selected item changed").toBe("item2");
    expect(dropdownListModel.inputStringRendered, "input string rendered changed").toBe("item2");

    dropdownListModel.inputStringRendered = "i";
    expect(list.actions.filter(a => (a as any).selected).length, "no selected items when filtering").toBe(0);

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(list.actions.filter(a => (a as any).selected).length, "no selected items when filtering and move key").toBe(0);

  });

  test("hintString letter case", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        showOtherItem: "true",
        choices: [
          "AbcAbc",
          "cAbcAb",
          "caBcaB",
        ]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;

    dropdownListModel.inputStringRendered = "Ab";
    expect(dropdownListModel.hintString).toBe("AbcAbc");
    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(dropdownListModel.hintString).toBe("cAbcAb");
    expect(dropdownListModel.inputStringRendered).toBe("Ab");
    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(dropdownListModel.hintString).toBe("caBcaB");
    expect(dropdownListModel.inputStringRendered).toBe("aB");
  });

  test("Survey Markdown - dropdown and other option", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionDropdownModel("q1");
    page.addQuestion(q1);
    q1.choices = [
      { value: 1, text: "text1markdown" },
      { value: 2, text: "text2markdown" },
    ];
    q1.showOtherItem = true;
    survey.onTextMarkdown.add(function (survey, options) {
      options.html = options.text;
    });

    q1.value = 2;
    const dropdownListModel = q1.dropdownListModel;

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(dropdownListModel.hintString, "no hint on start").toBe("");
    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(dropdownListModel.hintString).toBe("Other (describe)");
    dropdownListModel.changeSelectionWithKeyboard(true);
    expect(dropdownListModel.hintString, "no hint again").toBe("");
  });

  test("Survey Markdown - dropdown and input string", () => {
    var survey = new SurveyModel();
    var page = survey.addNewPage("Page 1");
    var q1 = new QuestionDropdownModel("q1");
    page.addQuestion(q1);
    q1.choices = [
      { value: 1, text: "#text1markdown" },
      { value: 2, text: "#text2markdown" },
    ];
    survey.onTextMarkdown.add(function (survey, options) {
      options.html = options.text.replace(/#/g, "*<hr>");
    });

    q1.value = 2;
    const dropdownListModel = q1.dropdownListModel;

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(dropdownListModel.inputString).toBe("*text2markdown");
    dropdownListModel.changeSelectionWithKeyboard(true);
    expect(dropdownListModel.inputString).toBe("*text1markdown");
  });

  test("placeholderRendered", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        choices: ["item1", "item2", "item3", "item4", "item5",]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.hintString, "hintString #1").toBe("");
    expect(dropdownListModel.placeholderRendered, "placeholderRendered #1").toBe("Select...");

    dropdownListModel.inputStringRendered = "it";
    expect(dropdownListModel.hintString, "hintString #2").toBe("item1");
    expect(dropdownListModel.placeholderRendered, "placeholderRendered #2").toBe("");

    dropdownListModel.inputStringRendered = "";
    expect(dropdownListModel.placeholderRendered, "placeholderRendered #3").toBe("Select...");

    question.readOnly = true;
    expect(dropdownListModel.placeholderRendered, "placeholderRendered #4").toBe("");

    question.readOnly = false;
    expect(dropdownListModel.placeholderRendered, "placeholderRendered #5").toBe("Select...");

    question.value = "item2";
    expect(dropdownListModel.placeholderRendered, "placeholderRendered #6").toBe("");
  });

  test("lazy loading clear value", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "country",
        "title": "Select a country",
        "isRequired": true,
        "defaultValue": "FRA",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 40
      }]
    });

    survey.onGetChoiceDisplayValue.add((_, options) => {
      options.setItems(["France"]);
    });
    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(question.showSelectedItemLocText, "showSelectedItemLocText").toBe(true);
    event.keyCode = 40;
    dropdownListModel.keyHandler(event);

    expect(dropdownListModel.inputStringRendered, "inputString").toBe("France");

    dropdownListModel.inputStringRendered = "";

    expect(dropdownListModel.hintString, "hintString").toBe("");
    expect(dropdownListModel.inputStringRendered).toBe("");
  });

  test("Dropdown should not be open on click in design mode", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.popupModel).toBeTruthy();

    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    expect(list.actions.length).toBe(28);
    expect(dropdownListModel.popupModel.isVisible).toBeFalsy();
    dropdownListModel.onClick(new Event("click"));
    expect(dropdownListModel.popupModel.isVisible).toBeTruthy();
    dropdownListModel.onClick(new Event("click"));
    expect(dropdownListModel.popupModel.isVisible).toBeFalsy();
    survey.setDesignMode(true);

    dropdownListModel.onClick(new Event("click"));
    expect(dropdownListModel.popupModel.isVisible).toBeFalsy();
  });

  test("Dropdown should not be open on click in preview mode", () => {
    const survey = new SurveyModel(jsonDropdown);
    survey.showPreview();

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    const dropdownListModel = question.dropdownListModel;
    const popupModel = dropdownListModel.popupModel;
    expect(popupModel.isVisible).toBeFalsy();
    dropdownListModel.onClick(new Event("click"));
    expect(popupModel.isVisible).toBeFalsy();
  });

  test("Dropdown should not be open on click in read-only mode", () => {
    const survey = new SurveyModel(jsonDropdown);
    survey.readOnly = true;

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    const dropdownListModel = question.dropdownListModel;
    const popupModel = dropdownListModel.popupModel;
    expect(popupModel.isVisible).toBeFalsy();
    dropdownListModel.onClick(new Event("click"));
    expect(popupModel.isVisible).toBeFalsy();
  });

  test("order & locale change", () => {
    const survey = new SurveyModel({ elements: [
      { type: "dropdown", name: "q1", choicesOrder: "asc",
        choices: [{ value: "A", text: { default: "AA", de: "BAA" } },
          { value: "B", text: { default: "BB", de: "ABB" } }] }
    ] });
    const question = <QuestionDropdownModel>survey.getQuestionByName("q1");
    let list: ListModel = question.popupModel.contentComponentData.model as ListModel;
    expect(list.actions.length, "Two items").toBe(2);
    expect(list.actions[0].id, "action[0].id").toBe("A");
    expect(list.actions[1].id, "action[1].id").toBe("B");
    survey.locale = "de";
    list = question.popupModel.contentComponentData.model as ListModel;
    expect(list.actions.length, "Two items").toBe(2);
    expect(list.actions[0].id, "action[0].id, de").toBe("B");
    expect(list.actions[1].id, "action[1].id, de").toBe("A");
  });
  test("DropdownListModel filterReadOnly", () => {
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.filterReadOnly).toBeTruthy();
    dropdownListModel.onFocus(null);
    expect(dropdownListModel.filterReadOnly).toBeFalsy();
    dropdownListModel.onBlur({ stopPropagation: () => { } });
    expect(dropdownListModel.filterReadOnly).toBeTruthy();
  });
  test("DropdownListModel in panel filterString change callback", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "paneldynamic",
          name: "p",
          templateElements: [
            {
              type: "dropdown",
              name: "country",
              choicesLazyLoadEnabled: true,
              showOtherItem: true,
            },
          ],
        },
      ],
      showQuestionNumbers: false,
    });
    const question = <QuestionPanelDynamicModel>survey.getAllQuestions()[0];
    question.addPanel();

    const dropdownListModel = (question.panels[0].elements[0] as QuestionDropdownModel).dropdownListModel;
    dropdownListModel["listModel"].filterString = "abc";
    expect(dropdownListModel.filterString).toBe("abc");
  });
  test("DropdownListModel filter options", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        searchEnabled: true,
        choices: [
          "abc",
          "abd",
          "cab",
          "efg"
        ]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    list.flushUpdates();

    dropdownListModel.filterString = "ab";
    const getfilteredItems = () => list.renderedActions.filter(item => list.isItemVisible(item));

    expect(list.renderedActions.length).toBe(4);
    expect(getfilteredItems().length).toBe(3);

    question.searchMode = "startsWith";
    expect(list.renderedActions.length).toBe(4);
    expect(getfilteredItems().length).toBe(2);
  });

  test("DropdownListModel filter event", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        searchEnabled: true,
        choices: [
          "abcd",
          "abdd",
          "cabd",
          "efab"
        ]
      }]
    });

    survey.onChoicesSearch.add((sender, options) => {
      options.filteredChoices = options.choices.filter(item => item.text.indexOf(options.filter) + options.filter.length == item.text.length);
    });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    list.flushUpdates();

    dropdownListModel.filterString = "ab";
    const getfilteredItems = () => list.renderedActions.filter(item => list.isItemVisible(item));

    expect(list.renderedActions.length).toBe(4);
    expect(getfilteredItems().length).toBe(1);

    question.searchMode = "startsWith";
    expect(list.renderedActions.length).toBe(4);
    expect(getfilteredItems().length).toBe(1);
  });

  test("DropdownListModel buttons", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "q1",
        defaultValue: "item1",
        searchEnabled: true,
        choices: ["item1", "item2", "item3", "item4", "item5"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const editorButtons = dropdownListModel["editorButtons"];

    expect(editorButtons.actions.length).toBe(2);
    expect(editorButtons.actions[0].id).toBe("clear");
    expect(editorButtons.actions[1].id).toBe("chevron");

    const clearButton = editorButtons.actions[0];
    const chevronButton = editorButtons.actions[1];

    expect(clearButton.locTitle.text, "clearButton title #1").toBe("Clear");
    expect(clearButton.enabled, "clearButton enabled #1").toBe(true);
    expect(clearButton.visible, "clearButton visible #1").toBe(true);

    expect(chevronButton.locTitle.text, "chevronButton title #1").toBe("Select");
    expect(chevronButton.enabled, "chevronButton enabled #1").toBe(true);
    expect(chevronButton.visible, "chevronButton visible #1").toBe(true);

    survey.showPreview(); // preview state
    expect(clearButton.locTitle.text, "clearButton title #2").toBe("Clear");
    expect(clearButton.enabled, "clearButton enabled #2").toBe(false);
    expect(clearButton.visible, "clearButton visible #2").toBe(false);

    expect(chevronButton.locTitle.text, "chevronButton title #2").toBe("Select");
    expect(chevronButton.enabled, "chevronButton enabled #2").toBe(false);
    expect(chevronButton.visible, "chevronButton visible #2").toBe(false);

    survey.cancelPreview();
    survey.readOnly = true; // readOnly state
    expect(clearButton.locTitle.text, "clearButton title #3").toBe("Clear");
    expect(clearButton.enabled, "clearButton enabled #3").toBe(false);
    expect(clearButton.visible, "clearButton visible #3").toBe(false);

    expect(chevronButton.locTitle.text, "chevronButton title #3").toBe("Select");
    expect(chevronButton.enabled, "chevronButton enabled #3").toBe(false);
    expect(chevronButton.visible, "chevronButton visible #3").toBe(true);

    survey.readOnly = false;
    survey.locale = "de";
    expect(clearButton.locTitle.text, "clearButton title #4").toBe("Auswahl entfernen");
    expect(clearButton.enabled, "clearButton enabled #4").toBe(true);
    expect(clearButton.visible, "clearButton visible #4").toBe(true);

    expect(chevronButton.locTitle.text, "chevronButton title #4").toBe("Auswählen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(chevronButton.enabled, "chevronButton enabled #4").toBe(true);
    expect(chevronButton.visible, "chevronButton visible #4").toBe(true);

    survey.locale = "";
    survey.data = {}; // question empty
    expect(clearButton.locTitle.text, "clearButton title #5").toBe("Clear");
    expect(clearButton.enabled, "clearButton enabled #5").toBe(true);
    expect(clearButton.visible, "clearButton visible #5").toBe(false);

    expect(chevronButton.locTitle.text, "chevronButton title #5").toBe("Select");
    expect(chevronButton.enabled, "chevronButton enabled #5").toBe(true);
    expect(chevronButton.visible, "chevronButton visible #5").toBe(true);
  });

  test("DropdownListModel with ListModel & allowCustomChoices true", () => {
    _setIsTouch(true);
    try {
      const survey = new SurveyModel({
        elements: [{
          "type": "dropdown",
          "name": "current-car",
          "choices": ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota"],
          "allowCustomChoices": true
        }]
      });
      const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
      const dropdownListModel = question.dropdownListModel;
      expect(dropdownListModel.popupModel.contentComponentData.model instanceof ListModel).toBeTruthy();

      const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
      expect(list.actions.length).toBe(9);
      expect(list.showFilter, "list.showFilter true").toBe(true);
    } finally {
      _setIsTouch(false);
    }
  });
});

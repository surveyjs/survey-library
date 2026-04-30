import { DropdownMultiSelectListModel } from "../src/dropdownMultiSelectListModel";
import { MultiSelectListModel } from "../src/multiSelectListModel";
import { QuestionTagboxModel } from "../src/question_tagbox";
import { SurveyModel } from "../src/survey";
import { _setIsTouch } from "../src/utils/devices";

import { describe, test, expect } from "vitest";
describe("DropdownMultiListModel", () => {
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
  function getVisibleActionByIndex(list: MultiSelectListModel, index: number) {
    const array = list.renderedActions.filter(item => list.isItemVisible(item));
    return array[index];
  }

  test("DropdownListModel with MultiListModel", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.actions.length).toLooseEqual(28);
    expect(question.value).toEqualValues([]);

    list.onItemClick(list.actions[0]);
    expect(question.value).toEqualValues(["item1"]);

    list.onItemClick(list.actions[3]);
    expect(question.value).toEqualValues(["item1", "item4"]);

    list.onItemClick(list.actions[0]);
    expect(question.value).toEqualValues(["item4"]);

    dropdownListModel.onClear(new Event("click"));
    expect(question.value.length).toLooseEqual(0);
  });

  test("DropdownListModel with MultiListModel & searchEnabled false", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        showOtherItem: "true",
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
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.showFilter, "list.showFilter false").toLooseEqual(false);
    expect(dropdownListModel.searchEnabled, "dropdownListModel.searchEnabled false").toLooseEqual(false);

    question.searchEnabled = true;
    expect(list.showFilter, "list.showFilter false").toLooseEqual(false);
    expect(dropdownListModel.searchEnabled, "dropdownListModel.searchEnabled true").toLooseEqual(true);
  });

  test("DropdownListModel with MultiListModel state actions", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.actions.length).toLooseEqual(28);

    list.onItemClick(list.actions[0]);
    expect(list.isItemSelected(list.actions[0])).toLooseEqual(true);
    expect(list.isItemSelected(list.actions[3])).toLooseEqual(false);

    list.onItemClick(list.actions[3]);
    expect(list.isItemSelected(list.actions[0])).toLooseEqual(true);
    expect(list.isItemSelected(list.actions[3])).toLooseEqual(true);

    list.onItemClick(list.actions[0]);
    expect(list.isItemSelected(list.actions[0])).toLooseEqual(false);
    expect(list.isItemSelected(list.actions[3])).toLooseEqual(true);

    dropdownListModel.onClear(new Event("click"));
    expect(list.isItemSelected(list.actions[0])).toLooseEqual(false);
    expect(list.isItemSelected(list.actions[3])).toLooseEqual(false);
  });

  test("open/hide tagbox popup after start/end filtration", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const popup = dropdownListModel.popupModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    list.flushUpdates();

    expect(popup.isVisible, "popup.isVisible 1").toLooseEqual(false);
    expect(dropdownListModel.filterString, "filterString 1").toLooseEqual("");

    dropdownListModel.filterString = "1";
    expect(popup.isVisible, "popup.isVisible 2").toLooseEqual(true);

    list.onItemClick(getVisibleActionByIndex(list, 3));
    expect(popup.isVisible, "popup.isVisible 3").toLooseEqual(true);
    expect(dropdownListModel.filterString, "filterString 3").toLooseEqual("");
    expect(question.value, "question.value before onClear").toEqualValues(["item12"]);

    dropdownListModel.onClear(new Event("click"));
    expect(dropdownListModel.filterString, "filterString after onClear").toLooseEqual("");
    expect(question.value, "question.value after onClear").toEqualValues([]);
  });

  test("remove last selected item", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    expect(question.value).toEqualValues([]);

    list.onItemClick(list.actions[3]);
    list.onItemClick(list.actions[0]);
    expect(question.value).toEqualValues(["item4", "item1"]);

    dropdownListModel.removeLastSelectedItem();
    expect(question.value).toEqualValues(["item4"]);

    dropdownListModel.removeLastSelectedItem();
    expect(question.value.length).toLooseEqual(0);

    dropdownListModel.removeLastSelectedItem();
    expect(question.value.length).toLooseEqual(0);
  });

  test("filterStringPlaceholder", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    question.defaultValue = ["item1"];
    const dropdownListModel = question.dropdownListModel as DropdownMultiSelectListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("");

    dropdownListModel.onClear(new Event("click"));
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("Select...");

    list.onItemClick(list.actions[3]);
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("");

    question.clearValue();
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("Select...");

    question.value = ["item2"];
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("");
  });

  test("hintString test", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    expect(dropdownListModel.inputMode).toLooseEqual("text");
    expect(dropdownListModel.showHintPrefix, "no filter, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "no filter, hint hidden").toBeFalsy();

    dropdownListModel.inputStringRendered = "It";
    expect(dropdownListModel.showHintPrefix, "filter from start, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "filter from start, hint visible").toBeTruthy();
    expect(dropdownListModel.hintString, "filter from start, hint string correct").toLooseEqual("item1");
    expect(dropdownListModel.hintStringSuffix, "filter from start, hint suffix correct").toLooseEqual("em1");

    dropdownListModel.inputStringRendered = "te";
    expect(dropdownListModel.showHintPrefix, "filter from middle, hint prefix visible").toBeTruthy();
    expect(dropdownListModel.showHintString, "filter from middle, hint visible").toBeTruthy();
    expect(dropdownListModel.hintStringPrefix, "filter from middle, hint prefix correct").toLooseEqual("i");
    expect(dropdownListModel.hintStringSuffix, "filter from middle, hint suffix correct").toLooseEqual("m1");

    dropdownListModel.inputStringRendered = "zzz";
    expect(dropdownListModel.showHintPrefix, "wrong filter, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "wrong filter, hint visible").toBeTruthy();

    list.onItemClick(list.actions[2]);
    expect(dropdownListModel.showHintPrefix, "filter from start with value, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "filter from start with value, hint not visible").toBeFalsy();
    expect(dropdownListModel.inputStringRendered, "inputStringRendered is empty").toBeFalsy();

    dropdownListModel.inputStringRendered = "it";
    expect(dropdownListModel.showHintPrefix, "filter from start with value, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "filter from start with value, hint visible").toBeTruthy();
    expect(dropdownListModel.hintStringSuffix, "filter from start with value, hint suffix correct").toLooseEqual("em1");
  });

  test("tagbox keyboard tests", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    question.value = ["item2"];
    expect(dropdownListModel.inputString, "inputString default is empty").toLooseEqual("");
    expect(dropdownListModel.hintString, "hintString default is empty").toLooseEqual("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.showHintPrefix, "item2 showHintPrefix").toBeFalsy();
    expect(dropdownListModel.showHintString, "item2 showHintString").toBeFalsy();
    expect(dropdownListModel.inputString, "item2 inputString").toLooseEqual("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.showHintPrefix, "item3 showHintPrefix").toBeFalsy();
    expect(dropdownListModel.showHintString, "item3 showHintString").toBeTruthy();
    expect(dropdownListModel.inputString, "item3 inputString").toLooseEqual("");
    expect(dropdownListModel.hintString, "item3 hintString").toLooseEqual("item3");

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.showHintPrefix, "showHintPrefix").toBeFalsy();
    expect(dropdownListModel.showHintString, "showHintString").toBeFalsy();
    expect(dropdownListModel.inputString, "inputString").toLooseEqual("");
  });

  test("reset placeholder on in-list focus change", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);

    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("Select...");

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("");
  });

  test("tagbox using space", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    expect(dropdownListModel.inputString, "inputString default is empty").toLooseEqual("");
    expect(dropdownListModel.hintString, "hintString default is empty").toLooseEqual("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect(question.value).toEqualValues(["item1"]);

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect(question.value).toEqualValues([]);

    dropdownListModel.inputStringRendered = "item";
    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect(question.value).toEqualValues([]);
  });

  test("tagbox hint after deselect", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    const event = {
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    expect(dropdownListModel.inputString, "inputString default is empty").toLooseEqual("");
    expect(dropdownListModel.hintString, "hintString default is empty").toLooseEqual("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.hintString, "item3 hintString").toLooseEqual("item1");

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect(question.value).toEqualValues(["item1"]);

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect(question.value).toEqualValues([]);
    expect(dropdownListModel.hintString, "item3 hintString again").toLooseEqual("item1");
  });

  test("tagbox placeholder not updated", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("Select...");

    question.placeholder = "Choose...";
    expect(dropdownListModel.filterStringPlaceholder).toLooseEqual("Choose...");
  });

  test("Hide popup if hideSelectedItems and click 'Select All'", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "tagbox",
        name: "question1",
        showSelectAllItem: true,
        hideSelectedItems: true,
        choices: ["item1", "item2", "item3", "item4", "item5", "item6", "item7", "item8", "item9", "item10"]
      }]
    });
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.actions.length).toLooseEqual(11);
    expect(question.value).toEqualValues([]);

    dropdownListModel.popupModel.show();
    expect(dropdownListModel.popupModel.isVisible).toLooseEqual(true);
    expect(list.actions[0].title).toLooseEqual("Select All");

    list.onItemClick(list.actions[0]);
    expect(question.value.length).toEqualValues(10);
    expect(dropdownListModel.popupModel.isVisible).toLooseEqual(false);
    expect(list.actions[0].title).toLooseEqual("Deselect all");
  });

  test("DropdownListModel with MultiListModel & allowCustomChoices true", () => {
    _setIsTouch(true);
    try {
      const survey = new SurveyModel({
        elements: [{
          "type": "tagbox",
          "name": "current-car",
          "choices": ["Ford", "Vauxhall", "Volkswagen", "Nissan", "Audi", "Mercedes-Benz", "BMW", "Peugeot", "Toyota"],
          "allowCustomChoices": true
        }]
      });
      const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
      const dropdownListModel = question.dropdownListModel;
      expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

      const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
      expect(list.actions.length).toLooseEqual(9);
      expect(list.showFilter, "list.showFilter true").toLooseEqual(true);
    } finally {
      _setIsTouch(false);
    }
  });
});

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
    expect(list.actions.length).toBe(28);
    expect([...(question.value)]).toEqual([]);

    list.onItemClick(list.actions[0]);
    expect([...(question.value)]).toEqual(["item1"]);

    list.onItemClick(list.actions[3]);
    expect([...(question.value)]).toEqual(["item1", "item4"]);

    list.onItemClick(list.actions[0]);
    expect([...(question.value)]).toEqual(["item4"]);

    dropdownListModel.onClear(new Event("click"));
    expect(question.value.length).toBe(0);
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
    expect(list.showFilter, "list.showFilter false").toBe(false);
    expect(dropdownListModel.searchEnabled, "dropdownListModel.searchEnabled false").toBe(false);

    question.searchEnabled = true;
    expect(list.showFilter, "list.showFilter false").toBe(false);
    expect(dropdownListModel.searchEnabled, "dropdownListModel.searchEnabled true").toBe(true);
  });

  test("DropdownListModel with MultiListModel state actions", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    expect(dropdownListModel.popupModel.contentComponentData.model instanceof MultiSelectListModel).toBeTruthy();

    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(list.actions.length).toBe(28);

    list.onItemClick(list.actions[0]);
    expect(list.isItemSelected(list.actions[0])).toBe(true);
    expect(list.isItemSelected(list.actions[3])).toBe(false);

    list.onItemClick(list.actions[3]);
    expect(list.isItemSelected(list.actions[0])).toBe(true);
    expect(list.isItemSelected(list.actions[3])).toBe(true);

    list.onItemClick(list.actions[0]);
    expect(list.isItemSelected(list.actions[0])).toBe(false);
    expect(list.isItemSelected(list.actions[3])).toBe(true);

    dropdownListModel.onClear(new Event("click"));
    expect(list.isItemSelected(list.actions[0])).toBe(false);
    expect(list.isItemSelected(list.actions[3])).toBe(false);
  });

  test("open/hide tagbox popup after start/end filtration", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const popup = dropdownListModel.popupModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    list.flushUpdates();

    expect(popup.isVisible, "popup.isVisible 1").toBe(false);
    expect(dropdownListModel.filterString, "filterString 1").toBe("");

    dropdownListModel.filterString = "1";
    expect(popup.isVisible, "popup.isVisible 2").toBe(true);

    list.onItemClick(getVisibleActionByIndex(list, 3));
    expect(popup.isVisible, "popup.isVisible 3").toBe(true);
    expect(dropdownListModel.filterString, "filterString 3").toBe("");
    expect([...(question.value)], "question.value before onClear").toEqual(["item12"]);

    dropdownListModel.onClear(new Event("click"));
    expect(dropdownListModel.filterString, "filterString after onClear").toBe("");
    expect([...(question.value)], "question.value after onClear").toEqual([]);
  });

  test("remove last selected item", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

    expect([...(question.value)]).toEqual([]);

    list.onItemClick(list.actions[3]);
    list.onItemClick(list.actions[0]);
    expect([...(question.value)]).toEqual(["item4", "item1"]);

    dropdownListModel.removeLastSelectedItem();
    expect([...(question.value)]).toEqual(["item4"]);

    dropdownListModel.removeLastSelectedItem();
    expect(question.value.length).toBe(0);

    dropdownListModel.removeLastSelectedItem();
    expect(question.value.length).toBe(0);
  });

  test("filterStringPlaceholder", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    question.defaultValue = ["item1"];
    const dropdownListModel = question.dropdownListModel as DropdownMultiSelectListModel;
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;
    expect(dropdownListModel.filterStringPlaceholder).toBe("");

    dropdownListModel.onClear(new Event("click"));
    expect(dropdownListModel.filterStringPlaceholder).toBe("Select...");

    list.onItemClick(list.actions[3]);
    expect(dropdownListModel.filterStringPlaceholder).toBe("");

    question.clearValue();
    expect(dropdownListModel.filterStringPlaceholder).toBe("Select...");

    question.value = ["item2"];
    expect(dropdownListModel.filterStringPlaceholder).toBe("");
  });

  test("hintString test", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);
    const list: MultiSelectListModel = dropdownListModel.popupModel.contentComponentData.model as MultiSelectListModel;

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
    expect(dropdownListModel.showHintString, "wrong filter, hint visible").toBeTruthy();

    list.onItemClick(list.actions[2]);
    expect(dropdownListModel.showHintPrefix, "filter from start with value, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "filter from start with value, hint not visible").toBeFalsy();
    expect(dropdownListModel.inputStringRendered, "inputStringRendered is empty").toBeFalsy();

    dropdownListModel.inputStringRendered = "it";
    expect(dropdownListModel.showHintPrefix, "filter from start with value, hint prefix hidden").toBeFalsy();
    expect(dropdownListModel.showHintString, "filter from start with value, hint visible").toBeTruthy();
    expect(dropdownListModel.hintStringSuffix, "filter from start with value, hint suffix correct").toBe("em1");
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
    expect(dropdownListModel.inputString, "inputString default is empty").toBe("");
    expect(dropdownListModel.hintString, "hintString default is empty").toBe("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.showHintPrefix, "item2 showHintPrefix").toBeFalsy();
    expect(dropdownListModel.showHintString, "item2 showHintString").toBeFalsy();
    expect(dropdownListModel.inputString, "item2 inputString").toBe("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.showHintPrefix, "item3 showHintPrefix").toBeFalsy();
    expect(dropdownListModel.showHintString, "item3 showHintString").toBeTruthy();
    expect(dropdownListModel.inputString, "item3 inputString").toBe("");
    expect(dropdownListModel.hintString, "item3 hintString").toBe("item3");

    event.keyCode = 13;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.showHintPrefix, "showHintPrefix").toBeFalsy();
    expect(dropdownListModel.showHintString, "showHintString").toBeFalsy();
    expect(dropdownListModel.inputString, "inputString").toBe("");
  });

  test("reset placeholder on in-list focus change", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = new DropdownMultiSelectListModel(question);

    expect(dropdownListModel.filterStringPlaceholder).toBe("Select...");

    dropdownListModel.changeSelectionWithKeyboard(false);
    expect(dropdownListModel.filterStringPlaceholder).toBe("");
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

    expect(dropdownListModel.inputString, "inputString default is empty").toBe("");
    expect(dropdownListModel.hintString, "hintString default is empty").toBe("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect([...(question.value)]).toEqual(["item1"]);

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect([...(question.value)]).toEqual([]);

    dropdownListModel.inputStringRendered = "item";
    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect([...(question.value)]).toEqual([]);
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

    expect(dropdownListModel.inputString, "inputString default is empty").toBe("");
    expect(dropdownListModel.hintString, "hintString default is empty").toBe("");

    event.keyCode = 40;
    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.hintString, "item3 hintString").toBe("item1");

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect([...(question.value)]).toEqual(["item1"]);

    event.keyCode = 32;
    dropdownListModel.keyHandler(event);
    expect([...(question.value)]).toEqual([]);
    expect(dropdownListModel.hintString, "item3 hintString again").toBe("item1");
  });

  test("tagbox placeholder not updated", () => {
    const survey = new SurveyModel(jsonTagbox);
    const question = <QuestionTagboxModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    expect(dropdownListModel.filterStringPlaceholder).toBe("Select...");

    question.placeholder = "Choose...";
    expect(dropdownListModel.filterStringPlaceholder).toBe("Choose...");
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
    expect(list.actions.length).toBe(11);
    expect([...(question.value)]).toEqual([]);

    dropdownListModel.popupModel.show();
    expect(dropdownListModel.popupModel.isVisible).toBe(true);
    expect(list.actions[0].title).toBe("Select All");

    list.onItemClick(list.actions[0]);
    expect(question.value.length).toEqual(10);
    expect(dropdownListModel.popupModel.isVisible).toBe(false);
    expect(list.actions[0].title).toBe("Deselect all");
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
      expect(list.actions.length).toBe(9);
      expect(list.showFilter, "list.showFilter true").toBe(true);
    } finally {
      _setIsTouch(false);
    }
  });
});

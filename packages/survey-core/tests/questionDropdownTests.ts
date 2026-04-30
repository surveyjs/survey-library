import { SurveyModel } from "../src/survey";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { ListModel } from "../src/list";
import { createListContainerHtmlElement } from "./test-helpers";
import { Question } from "../src/question";
import { settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";
import { PopupBaseViewModel } from "../src/popup-view-model";
import { PopupDropdownViewModel } from "../src/popup-dropdown-view-model";
import { PopupModalViewModel } from "../src/popup-modal-view-model";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { IAction } from "../src/actions/action";
import { _setIsTouch } from "../src/utils/devices";

import { describe, test, expect, vi } from "vitest";
describe("Dropdown question", () => {
  test("Test dropdown choicesMax choicesMin properties", () => {
    const json = {
      elements: [
        {
          name: "liveage",
          type: "dropdown",
          choicesMin: 1,
          choicesMax: 115,
        },
      ],
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    expect(question.choicesMin, "choicesMin is ok").toLooseEqual(1);
    expect(question.choicesMax, "choicesMax is ok").toLooseEqual(115);
    expect(question.visibleChoices.length, "visibleChoices is ok").toLooseEqual(115);
  });

  test("check dropdown disabled class", () => {
    const json = {
      elements: [
        {
          name: "q1",
          type: "dropdown",
        },
      ],
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    question.cssClasses.controlReadOnly = "sv_q_dropdown_disabled";
    expect(question.getControlClass().indexOf("sv_q_dropdown_disabled") == -1).toBeTruthy();
    question.readOnly = true;
    expect(question.getControlClass().indexOf("sv_q_dropdown_disabled") != -1).toBeTruthy();
  });

  test("DropdownListModel with ListModel", () => {
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
    const survey = new SurveyModel(jsonDropdown);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.popupModel.contentComponentData.model instanceof ListModel).toBeTruthy();
  });

  test("Test dropdown renderAs select", () => {
    const json = {
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
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    expect(!!question.popupModel).toBeTruthy();
    expect(question.popupModel.contentComponentData.model instanceof ListModel).toBeTruthy();

    const listModel = question.popupModel.contentComponentData.model as ListModel;
    expect(listModel.showFilter).toLooseEqual(false);
    expect(question.dropdownListModel.searchEnabled).toLooseEqual(true);
  });

  test("Test dropdown renderAs select searchEnabled property", () => {
    const json = {
      elements: [{
        type: "dropdown",
        name: "question1",
        showOtherItem: "true",
        searchEnabled: false,
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
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel = question.popupModel.contentComponentData.model as ListModel;
    expect(listModel.showFilter).toLooseEqual(false);
    expect(question.dropdownListModel.searchEnabled).toLooseEqual(false);

    question.searchEnabled = true;
    expect(listModel.showFilter).toLooseEqual(false);
    expect(question.dropdownListModel.searchEnabled).toLooseEqual(true);
  });

  test("add placeholder & allowClear", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "car",
          "title": "What car are you driving?",
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    expect(question.placeholder).toLooseEqual("Select...");
    expect(question.allowClear === true).toBeTruthy();

    expect(question.toJSON()).toEqualValues({
      "name": "car",
      "title": "What car are you driving?",
      "choices": [
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
      ]
    });
    question.placeholder = "New placeholder";
    question.allowClear = false;

    expect(question.toJSON()).toEqualValues({
      "name": "car",
      "title": "What car are you driving?",
      "allowClear": false,
      "placeholder": "New placeholder",
      "choices": [
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
      ]
    });
  });

  test("deserialize showOptionsCaption & placeholder to placeholder & allowClear", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "car",
          "title": "What car are you driving?",
          "showOptionsCaption": false,
          "placeholder": "New placeholder",
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    expect(question.placeholder).toLooseEqual("New placeholder");
    expect(question.placeholder).toLooseEqual("New placeholder");

    expect(question.showOptionsCaption === false).toBeTruthy();
    expect(question.allowClear === false).toBeTruthy();

    expect(question.toJSON()).toEqualValues({
      "name": "car",
      "title": "What car are you driving?",
      "allowClear": false,
      "placeholder": "New placeholder",
      "choices": [
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
      ]
    });
  });

  test("question.showClearButton", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
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
    const q = <QuestionDropdownModel>survey.getQuestionByName("q1");
    expect(q.showClearButton, "question is empty").toLooseEqual(false);
    q.value = "Ford";
    expect(q.showClearButton, "question is not empty").toLooseEqual(true);
    q.allowClear = false;
    expect(q.showClearButton, "allowClear is false").toLooseEqual(false);
    q.allowClear = true;
    survey.setDesignMode(true);

    expect(q.showClearButton, "Creator V2").toLooseEqual(true);
  });

  test("ListModel localization", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "car",
          "title": "What car are you driving?",
          "allowClear": false,
          "placeholder": "New placeholder",
          "choices": [
            "Ford",
            "Vauxhall",
            "Volkswagen",
            "Nissan",
            "Audi",
            "Mercedes-Benz",
            "BMW",
            "Peugeot",
            "Toyota",
            "Citroen"
          ]
        }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel = question.popupModel.contentComponentData.model as ListModel;
    expect(listModel.filterStringPlaceholder, "filtered text in en").toLooseEqual("Type to search...");
    survey.locale = "de";
    expect(listModel.filterStringPlaceholder, "filtered text in de").toLooseEqual("Tippen Sie, um zu suchen...");
    survey.locale = "";
  });
  test("survey.onTextMarkdown, options.item #9601", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "q1",
          "choices": [{ value: 1, text: "Item 1" }, { value: 2, text: "Item 2" }, { value: 3, text: "Item 3" }]
        }]
    };
    const survey = new SurveyModel(json);
    const itemsValues = new Array<string>();
    survey.onTextMarkdown.add((sender, options) => {
      if (options.item) {
        itemsValues.push(options.item.value);
      }
      options.html = options.text + "_" + options.text;
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choices[0].locText.textOrHtml, "choices[0]").toLooseEqual("Item 1_Item 1");
    expect(question.choices[1].locText.textOrHtml, "choices[1]").toLooseEqual("Item 2_Item 2");
    expect(question.choices[2].locText.textOrHtml, "choices[2]").toLooseEqual("Item 3_Item 3");
    expect(itemsValues).toEqualValues([1, 2, 3]);
  });
  test("readOnlyText visibleChoices changed", () => {
    const json = {
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "dropdown",
              "name": "q1",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ]
            },
            {
              "type": "dropdown",
              "name": "q2",
              "choices": [
                "Item 1",
                "Item 2",
                "Item 3"
              ],
              "choicesVisibleIf": "{q1} = 'Item 1'"
            }
          ]
        }
      ],
    };
    const survey = new SurveyModel(json);
    survey.data = { "q1": "Item 1", "q2": "Item 1" };

    const q2 = <QuestionDropdownModel>survey.getQuestionByName("q2");
    expect(q2.readOnlyText, "readOnlyText").toLooseEqual("Item 1");
    expect(q2.selectedItem.id, "selectedItem.id").toLooseEqual("Item 1");
  });
  test("readOnlyText render as select", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "q1",
          "renderAs": "select",
          "placeholder": "click",
          "showOtherItem": true,
          "showNoneItem": true,
          "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
        }]
    };
    const survey = new SurveyModel(json);
    survey.onTextMarkdown.add((sender, options) => {
      options.html = options.text + "_" + options.text;
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.readOnlyText, "use place-holder").toLooseEqual("click");
    expect(question.locReadOnlyText.textOrHtml, "use place-holder, locReadOnlyText").toLooseEqual("click_click");
    expect(question.locReadOnlyText.hasHtml, "use place-holder, locReadOnlyText.hasHtml").toLooseEqual(true);
    question.value = "other";
    expect(question.readOnlyText, "use other").toLooseEqual("Other (describe)");
    question.value = 2;
    expect(question.readOnlyText, "use choice text").toLooseEqual("item 2");
    question.value = "none";
    expect(question.readOnlyText, "use none text").toLooseEqual("None");
    question.clearValue();
    expect(question.readOnlyText, "use placeholder").toLooseEqual("click");
    question.placeholder = "Placeholder test";
    expect(question.readOnlyText, "use placeholder").toLooseEqual("Placeholder test");
  });
  test("readOnlyText on changing locale", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "q1",
          "showOtherItem": true,
          "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
        }]
    };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.readOnlyText, "english locale").toLooseEqual("Select...");
    survey.locale = "de";
    expect(question.readOnlyText, "de locale").toLooseEqual("Bitte auswählen..."); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    survey.locale = "";
    expect(new QuestionDropdownModel("q1").readOnlyText, "English by default").toLooseEqual("Select...");
  });
  test("inputFieldComponent", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "itemComponent": "my-item",
          "name": "q1",
          "showOtherItem": true,
          "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
        }]
    };
    const itemTemplate = "my-item";
    const newInputFieldComponent = "my-inputFieldComponentName";
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.itemComponent).toLooseEqual(itemTemplate);
    expect(question.inputFieldComponent).toLooseEqual(undefined);
    expect(question.inputFieldComponentName).toLooseEqual(itemTemplate);

    question.inputFieldComponent = newInputFieldComponent;
    expect(question.itemComponent).toLooseEqual(itemTemplate);
    expect(question.inputFieldComponent).toLooseEqual(newInputFieldComponent);
    expect(question.inputFieldComponentName).toLooseEqual(newInputFieldComponent);
  });
  test("showSelectedItemLocText", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "q1",
          "showOtherItem": true,
          "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
        }]
    };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.showSelectedItemLocText, "#1").toLooseEqual(false);

    question.value = 1;
    expect(question.showSelectedItemLocText, "#2").toLooseEqual(true);

    question.itemComponent = "my-item";
    expect(question.showSelectedItemLocText, "#3").toLooseEqual(false);
  });
  test("selectedItemLocText, showOtherItem & storeOthersAsComment=false, Bug#3800", () => {
    const json = {
      storeOthersAsComment: false,
      elements: [
        {
          "type": "dropdown",
          "name": "q1",
          "showOtherItem": true,
          "choices": [1, 2, 3]
        }]
    };
    const survey = new SurveyModel(json);
    survey.data = { q1: 4 };
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.showSelectedItemLocText).toLooseEqual(true);

    expect(question.selectedItem.value).toLooseEqual("other");
    expect(question.selectedItemLocText.renderedHtml).toLooseEqual("Other (describe)");
    question.value = 3;
    expect(question.selectedItem.value).toLooseEqual("3");
    expect(question.selectedItemLocText.renderedHtml).toLooseEqual("3");
  });
  test("showInputFieldComponent", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "q1",
          "showOtherItem": true,
          "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
        }]
    };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.showInputFieldComponent).toLooseEqual(false);

    question.itemComponent = "my-item";
    expect(question.showInputFieldComponent).toLooseEqual(false);

    question.value = 1;
    expect(question.showInputFieldComponent).toLooseEqual(true);
  });
  test("clearValue", () => {
    const json = {
      elements: [
        {
          "type": "dropdown",
          "name": "q1",
          "showOtherItem": true,
          "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
        }]
    };
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;

    expect(question.value, "init").toLooseEqual(undefined);
    expect(dropdownListModel.filterString, "init").toLooseEqual("");
    expect(dropdownListModel.inputStringRendered, "init").toLooseEqual("");
    expect(dropdownListModel.hintString, "init").toLooseEqual("");

    question.value = 2;
    dropdownListModel.inputStringRendered = "i";

    expect(question.value).toLooseEqual(2);
    expect(dropdownListModel.filterString).toLooseEqual("i");
    expect(dropdownListModel.inputStringRendered).toLooseEqual("i");
    expect(dropdownListModel.hintString).toLooseEqual("item 2");

    question.clearValue();

    expect(question.value, "after clear").toLooseEqual(undefined);
    expect(dropdownListModel.filterString, "after clear").toLooseEqual("");
    expect(dropdownListModel.inputStringRendered, "after clear").toLooseEqual("");
    expect(dropdownListModel.hintString, "after clear").toLooseEqual("");
  });

  test("Dropdown doesn't displays a value which doesn't exist in a list of choices", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        choices: ["Item 1", "Item 2", "Item 3"]
      }]
    });
    survey.data = {
      question1: "value1"
    };
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.value).toLooseEqual("value1");
    expect(question.selectedItem).toLooseEqual(null);
    expect(survey.data).toEqualValues({
      "question1": "value1",
    });
  });

  test("Dropdown displays a value as Other if it doesn't exist in a list of choices", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        showOtherItem: true,
        choices: ["Item 1", "Item 2", "Item 3"]
      }]
    });
    survey.data = {
      question1: "value1"
    };
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.value).toLooseEqual("other");
    expect(question.selectedItem.id).toLooseEqual("other");
    expect(survey.data).toEqualValues({
      "question1": "value1",
      "question1-Comment": "value1"
    });
  });

  test("Dropdown displays a value if list of choices is empty", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "question1",
        choices: ["Item 1", "Item 2", "Item 3"]
      }]
    });
    survey.data = {
      question1: "Item 1"
    };
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.value).toLooseEqual("Item 1");
    expect(question.selectedItem.id).toLooseEqual("Item 1");

    question.setPropertyValue("visibleChoices", []);
    expect(question.value).toLooseEqual("Item 1");
    expect(question.selectedItem).toLooseEqual(null);
  });

  function getNumberArray(skip = 1, count = 25, filter = ""): Array<any> {
    const result: Array<number> = [];
    let index = skip;
    while((skip + result.length) < (skip + count)) {
      if (!!filter) {
        if (index.toString().toLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1) {
          result.push(index);
        }
      } else {
        result.push(index);
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
    const total = 55;
    if (opt.skip + opt.take < total) {
      opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), total);
    } else {
      opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip, opt.filter), total);
    }
  };

  test("lazy loading: first loading", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30,
      }]
    };
    const survey = new SurveyModel(json);
    let opt = {};
    survey.onChoicesLazyLoad.add((_, options) => { opt = options; });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opt);
    expect(question.choices.length).toLooseEqual(30);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[29].value).toLooseEqual(30);
  });

  test("lazy loading: first loading - default value", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "defaultValue": "1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30,
      }]
    };
    const survey = new SurveyModel(json);
    let opt = {};
    survey.onChoicesLazyLoad.add((_, options) => { opt = options; });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    question.dropdownListModel.popupModel.show();
    question.dropdownListModel.changeSelectionWithKeyboard(false);
    doneCallback(opt);
    expect(question.choices.length).toLooseEqual(30);
    expect(question.dropdownListModel.inputStringRendered).toLooseEqual("1");
  });

  test("lazy loading: several loading", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[24].value).toLooseEqual(25);

    question.dropdownListModel["updateQuestionChoices"]();
    doneCallback(opts[1]);
    expect(question.choices.length).toLooseEqual(50);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[49].value).toLooseEqual(50);

    question.dropdownListModel["updateQuestionChoices"]();
    doneCallback(opts[2]);
    expect(question.choices.length).toLooseEqual(55);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[54].value).toLooseEqual(55);
  });

  test("lazy loading + change filter string + dropdownSearchDelay", () => {
    return new Promise(function(resolve) {
      let __remaining = 4;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const newValueDebouncedInputValue = 2 * onChoicesLazyLoadCallbackTimeOut;
      const done1 = __done;
      const done2 = __done;
      const done3 = __done;
      const done4 = __done;

      const json = {
        elements: [{
          "type": "dropdown",
          "name": "q1",
          "choicesLazyLoadEnabled": true
        }]
      };
      const survey = new SurveyModel(json);
      survey.onChoicesLazyLoad.add(callback);

      const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
      expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
      expect(question.choices.length).toLooseEqual(0);

      question.dropdownListModel.popupModel.show();
      expect(question.choices.length, "show popup before request").toLooseEqual(0);

      setTimeout(() => {
        expect(question.choices.length, "show popup after request").toLooseEqual(25);
        expect(question.choices[0].value, "show popup after request").toLooseEqual(1);

        settings.dropdownSearchDelay = newValueDebouncedInputValue;
        question.dropdownListModel.filterString = "2";
        setTimeout(() => {
          expect(question.choices.length, "filter is 2").toLooseEqual(25);
          expect(question.choices[0].value, "filter is 2").toLooseEqual(1);

          settings.dropdownSearchDelay = newValueDebouncedInputValue;
          question.dropdownListModel.filterString = "22";
          setTimeout(() => {
            expect(question.choices.length, "filter is 22 before request").toLooseEqual(25);
            expect(question.choices[0].value, "filter is 22 before request").toLooseEqual(1);

            setTimeout(() => {
              expect(question.choices.length, "filter is 22 after request").toLooseEqual(25);
              expect(question.choices[0].value, "filter is 22 after request").toLooseEqual(22);

              settings.dropdownSearchDelay = 0;
              done4();
            }, 2 * (onChoicesLazyLoadCallbackTimeOut + newValueDebouncedInputValue));
            done3();
          }, callbackTimeOutDelta);
          done2();
        }, callbackTimeOutDelta);
        done1();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
    });
  });

  // Skipped: lazy load callback path depends on popup/list rendering side-effects not fired under jsdom.
  test("The onGetChoiceDisplayValue callback fires multiple times, #6078", () => {
    return new Promise(function(resolve) {
      let __remaining = 3;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      let requestCount = 0;
      let responseCount = 0;
      const done1 = __done;
      const done2 = __done;
      const done3 = __done;
      const json = {
        elements: [
          {
            "type": "dropdown",
            "name": "q1",
            "defaultValue": 2,
            "choicesLazyLoadEnabled": true
          }]
      };
      const survey = new SurveyModel(json);

      const onGetChoiceDisplayValueCallbackTimeOut = 6 * callbackTimeOutDelta;
      survey.onGetChoiceDisplayValue.add((sender, options) => {
        requestCount++;
        setTimeout(() => {
          if (options.question.name == "q1") {
            options.setItems(options.values.map(item => ("DisplayText_" + item)));
            responseCount++;
          }
        }, onGetChoiceDisplayValueCallbackTimeOut);
      });

      const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
      expect(requestCount, "requestCount #1").toLooseEqual(0);
      expect(responseCount, "responseCount #1").toLooseEqual(0);

      expect(question.showSelectedItemLocText, "showSelectedItemLocText").toLooseEqual(true);
      expect(requestCount, "requestCount #2").toLooseEqual(1);
      expect(responseCount, "responseCount #2").toLooseEqual(0);

      setTimeout(() => {
        expect(requestCount, "requestCount #2.1").toLooseEqual(1);
        expect(responseCount <= 1, "responseCount #2.1").toLooseEqual(true);
        expect(["2", "DisplayText_2"].indexOf(question.selectedItemLocText.calculatedText) > -1, "calculatedText #2.1").toLooseEqual(true);

        setTimeout(() => {
          expect(requestCount, "requestCount #3").toLooseEqual(1);
          expect(responseCount, "responseCount #3").toLooseEqual(1);

          setTimeout(() => {
            expect(requestCount, "requestCount #3.1").toLooseEqual(1);
            expect(responseCount, "responseCount #3.1").toLooseEqual(1);
            expect(question.selectedItemLocText.calculatedText).toLooseEqual("DisplayText_2");
            expect(question.selectedItem.locText.calculatedText, "locText.calculatedText").toLooseEqual("DisplayText_2");
            expect(question.displayValue, "question.displayValue").toLooseEqual("DisplayText_2");

            done3();
          }, onGetChoiceDisplayValueCallbackTimeOut + 2 * callbackTimeOutDelta);
          done2();
        }, onGetChoiceDisplayValueCallbackTimeOut / 2);
        done1();
      }, callbackTimeOutDelta);
    });
  });
  test("storeOthersAsComment is false", () => {
    const json = {
      "storeOthersAsComment": false,
      "elements": [
        {
          "type": "dropdown",
          "name": "q1",
          "showOtherItem": true
        }
      ],
      "showQuestionNumbers": false
    };
    const survey = new SurveyModel(json);
    survey.onChoicesLazyLoad.add((_, opt) => {});

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.visibleChoices.length).toLooseEqual(1);
    expect(question.visibleChoices[0].id).toLooseEqual("other");
    expect(question.visibleChoices[0].value).toLooseEqual("other");

    question.renderedValue = "other";
    expect(question.value, "#1").toEqualValues("other");
    question.otherValue = "text1";
    expect(question.value, "#2").toEqualValues("text1");
    expect(survey.data, "#3").toEqualValues({ q1: "text1" });
  });

  test("lazy loading: storeOthersAsComment is false", () => {
    const json = {
      "storeOthersAsComment": false,
      "elements": [
        {
          "type": "dropdown",
          "name": "q1",
          "choicesLazyLoadEnabled": true,
          "choicesLazyLoadPageSize": 60,
          "showOtherItem": true
        }
      ],
      "showQuestionNumbers": false
    };
    const survey = new SurveyModel(json);
    let opt = {};
    survey.onChoicesLazyLoad.add((_, options) => { opt = options; });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.visibleChoices.length).toLooseEqual(1);
    expect(question.visibleChoices[0].id).toLooseEqual("other");
    expect(question.visibleChoices[0].value).toLooseEqual("other");

    question.dropdownListModel.popupModel.show();
    doneCallback(opt);
    expect(question.visibleChoices.length).toLooseEqual(56);
    expect(question.visibleChoices[0].value).toLooseEqual(1);
    expect(question.visibleChoices[54].value).toLooseEqual(55);
    expect(question.visibleChoices[55].id).toLooseEqual("other");
    expect(question.visibleChoices[55].value).toLooseEqual("other");

    question.renderedValue = "other";
    expect(question.value, "#1").toEqualValues("other");
    question.otherValue = "text1";
    expect(question.value, "#2").toEqualValues("text1");
    expect(survey.data, "#3").toEqualValues({ q1: "text1" });
  });

  test("itemsSettings property", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel = question.popupModel.contentComponentData.model as ListModel;
    const itemsSettings = question.dropdownListModel["itemsSettings"];
    expect(itemsSettings.skip).toLooseEqual(0);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(0);
    expect(itemsSettings.items.length).toLooseEqual(0);
    expect(listModel.actions.length, "listModel.actions").toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);

    expect(listModel.actions.length, "listModel.actions").toLooseEqual(26);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);

    question.dropdownListModel.popupModel.hide();

    expect(listModel.actions.length, "listModel.actions").toLooseEqual(26);
    expect(itemsSettings.skip).toLooseEqual(0);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(0);
    expect(itemsSettings.items.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    expect(listModel.actions.length, "listModel.actions").toLooseEqual(0);
  });
  test("rendering actions id", () => {
    const json = {
      elements: [{
        type: "dropdown",
        name: "q1",
        choices: ["Item1", "Item2"]
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getQuestionByName("q1");
    question.id = "el1";
    const listModel = question.popupModel.contentComponentData.model as ListModel;
    listModel.flushUpdates();
    const actions = listModel.renderedActions;
    expect(actions.length, "two actions").toLooseEqual(2);
    expect((<IAction>actions[0]).elementId, "elementId, action1").toLooseEqual("el1i_listItem1");
    expect((<IAction>actions[1]).elementId, "elementId, action2").toLooseEqual("el1i_listItem2");
    expect((<IAction>actions[0]).disableTabStop, "disableTabStop, action1").toLooseEqual(true);
    expect((<IAction>actions[1]).disableTabStop, "disableTabStop, action2").toLooseEqual(true);
  });

  test("Test dropdown choices change should update strings", () => {
    const json = {
      elements: [
        {
          name: "liveage",
          type: "dropdown",
          choices: ["i1", "i2"]
        },
      ],
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    expect(question.readOnlyText, "readOnlyText #1").toLooseEqual("Select...");
    expect(question.placeholder, "placeholder").toLooseEqual("Select...");
    question.value = "i3";
    expect(question.readOnlyText, "readOnlyText #2").toLooseEqual("Select...");
    question.choices = ["i1", "i2", "i3"];
    expect(question.readOnlyText, "readOnlyText #3").toLooseEqual("i3");
  });

  test("Test update readOnlyText after onGetChoiceDisplayValue", () => {
    const json = {
      elements: [
        {
          name: "q1",
          type: "dropdown",
          choicesLazyLoadEnabled: true,
          defaultValue: "FRA",
        },
      ],
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      options.setItems(["France"]);
    });

    expect(question.value).toLooseEqual("FRA");
    expect(question.selectedItem.value).toLooseEqual("FRA");
    expect(question.selectedItem.text).toLooseEqual("France");
    expect(question.readOnlyText, "readOnlyText").toLooseEqual("France");
  });

  test("min page size", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        choicesLazyLoadPageSize: 10
      }]
    });
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel = question.popupModel.contentComponentData.model as ListModel;
    const itemsSettings = question.dropdownListModel["itemsSettings"];
    expect(itemsSettings.skip).toLooseEqual(0);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(0);
    expect(itemsSettings.items.length).toLooseEqual(0);
    expect(listModel.actions.length, "listModel.actions").toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(listModel.actions.length, "listModel.actions").toLooseEqual(26);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);
  });

  test("selectedItem until all data is loaded", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30
      }]
    });
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel = question.popupModel.contentComponentData.model as ListModel;

    expect(listModel.actions.length, "listModel.actions").toLooseEqual(0);
    expect(question.selectedItem).toLooseEqual(null);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(30);
    expect(listModel.actions.length, "listModel.actions").toLooseEqual(31);

    question.dropdownListModel["updateQuestionChoices"]();
    doneCallback(opts[1]);
    expect(question.choices.length).toLooseEqual(55);
    expect(listModel.actions.length, "listModel.actions").toLooseEqual(55);
    expect(question.choices[54].value).toLooseEqual(55);

    question.value = question.choices[54].value;
    expect(question.selectedItem.value).toLooseEqual(55);

    question.dropdownListModel.popupModel.hide();
    question.dropdownListModel.popupModel.show();
    doneCallback(opts[2]);
    expect(question.choices.length).toLooseEqual(30);
    expect(listModel.actions.length, "listModel.actions").toLooseEqual(31);
    expect(question.selectedItem.value).toLooseEqual(55);

    question.clearValue();
    expect(question.selectedItem).toLooseEqual(null);
  });
  function getObjectArray(skip = 1, count = 25): Array<{value: number, text: string}> {
    const result:Array<{value: number, text: string}> = [];
    for (let index = skip; index < (skip + count); index++) {
      result.push({ value: index, text: "DisplayText_" + index });
    }
    return result;
  }

  test("lazy loading + onGetChoiceDisplayValue: defaultValue", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "defaultValue": 55,
        "choicesLazyLoadEnabled": true
      },
      {
        "type": "text",
        "name": "q2",
        "title": "{q1}"
      }
      ]
    });
    const doCallback = (options) => {
      const total = 55;
      if (options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    };
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((sender, options) => { opts.push(options); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const questionTitle = <Question>survey.getAllQuestions()[1];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(question.value).toLooseEqual(55);
    expect(question.selectedItem.value).toLooseEqual(55);
    expect(question.selectedItem.text).toLooseEqual("DisplayText_55");
    expect(questionTitle.locTitle.textOrHtml, "display text is correct").toLooseEqual("DisplayText_55");

    question.dropdownListModel.popupModel.show();
    doCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[24].value).toLooseEqual(25);
    expect(question.value).toLooseEqual(55);
    expect(question.selectedItem.value).toLooseEqual(55);
    expect(question.selectedItem.text).toLooseEqual("DisplayText_55");
  });
  test("lazy loading + onGetChoiceDisplayValue: defaultValue & custom property", () => {
    Serializer.addProperty("itemvalue", "customProp");
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "defaultValue": 55,
        "choicesLazyLoadEnabled": true
      },
      {
        "type": "text",
        "name": "q2",
        "title": "{q1}"
      }
      ]
    });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)),
          { propertyName: "customProp", values: options.values.map(item => ("customProp_" + item)) });
      }
    });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const questionTitle = <Question>survey.getAllQuestions()[1];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(question.value).toLooseEqual(55);
    expect(question.selectedItem.value).toLooseEqual(55);
    expect(question.selectedItem.text).toLooseEqual("DisplayText_55");
    expect(question.selectedItem.customProp).toLooseEqual("customProp_55");
    expect(questionTitle.locTitle.textOrHtml, "display text is correct").toLooseEqual("DisplayText_55");
    Serializer.removeProperty("itemvalue", "customProp");
  });
  test("lazy loading + onGetChoiceDisplayValue, selected last item", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 30
      }]
    };
    const survey = new SurveyModel(json);
    survey.onChoicesLazyLoad.add((sender, options) => {
      const total = 55;
      if (options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choices.length).toLooseEqual(0);
    expect(question.value).toLooseEqual(undefined);
    expect(question.selectedItem).toLooseEqual(undefined);

    question.dropdownListModel.popupModel.show();
    question.value = 54;
    expect(question.choices.length).toLooseEqual(30);
    expect(question.value).toLooseEqual(54);
    expect(question.selectedItem.locText.calculatedText).toLooseEqual("DisplayText_54");
  });

  test("lazy loading + onGetChoiceDisplayValue: defaultValue is object", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "defaultValue": { id: 55 },
        "choicesLazyLoadEnabled": true
      }]
    });
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item.id)));
      }
    });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(question.value.id).toLooseEqual(55);
    expect(question.selectedItem.value.id).toLooseEqual(55);
    expect(question.selectedItem.text).toLooseEqual("DisplayText_55");
    question.dropdownListModel.onFocus(null);
    expect(question.dropdownListModel.inputString).toLooseEqual("DisplayText_55");

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[24].value).toLooseEqual(25);
    expect(question.value.id).toLooseEqual(55);
    expect(question.selectedItem.value.id).toLooseEqual(55);
    expect(question.selectedItem.text, "selectedItem.text").toLooseEqual("DisplayText_55");
    expect(question.displayValue, "displayValue").toLooseEqual("DisplayText_55");
    expect(question.dropdownListModel.inputString).toLooseEqual("DisplayText_55");
  });

  test("lazy loading + onGetChoiceDisplayValue: set survey data", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });
    survey.data = { "q1": 55 };

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(question.value).toLooseEqual(55);
    expect(question.selectedItem.value).toLooseEqual(55);
    expect(question.selectedItem.text).toLooseEqual("DisplayText_55");

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[24].value).toLooseEqual(25);
    expect(question.value).toLooseEqual(55);
    expect(question.selectedItem.value).toLooseEqual(55);
    expect(question.selectedItem.text).toLooseEqual("DisplayText_55");
  });

  test("lazy loading data is lost: defaultValue", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "defaultValue": 55,
        "choicesLazyLoadEnabled": true
      }]
    });
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });

    expect(survey.data, "before doComplete before item load").toEqualValues({ "q1": 55 });
    survey.doComplete();
    expect(survey.data, "after doComplete before item load").toEqualValues({ "q1": 55 });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choices.length).toLooseEqual(0);
    expect(question.value).toLooseEqual(55);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.value).toLooseEqual(55);

    expect(survey.data, "before doComplete after item load").toEqualValues({ "q1": 55 });
    survey.doComplete();
    expect(survey.data, "after doComplete after item load").toEqualValues({ "q1": 55 });
  });

  test("lazy loading data is lost: set survey data", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });
    survey.onGetChoiceDisplayValue.add((sender, options) => {
      if (options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
      }
    });
    survey.data = { "q1": 55 };
    expect(survey.data, "before doComplete before item load").toEqualValues({ "q1": 55 });
    survey.doComplete();
    expect(survey.data, "after doComplete before item load").toEqualValues({ "q1": 55 });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choices.length).toLooseEqual(0);
    expect(question.value).toLooseEqual(55);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.value).toLooseEqual(55);

    expect(survey.data, "before doComplete after item load").toEqualValues({ "q1": 55 });
    survey.doComplete();
    expect(survey.data, "after doComplete after item load").toEqualValues({ "q1": 55 });
  });

  test("lazy loading + change filter string", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });
    let opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const itemsSettings = question.dropdownListModel["itemsSettings"];

    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(itemsSettings.skip).toLooseEqual(0);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(0);
    expect(itemsSettings.items.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[24].value).toLooseEqual(25);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);

    question.dropdownListModel.filterString = "2";
    doneCallback(opts[1]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(2);
    expect(question.choices[24].value).toLooseEqual(123);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);

    question.dropdownListModel.filterString = "22";
    doneCallback(opts[2]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(22);
    expect(question.choices[24].value).toLooseEqual(1223);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);
  });

  test("lazy loading + change listModel filter string", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const itemsSettings = question.dropdownListModel["itemsSettings"];
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;

    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(itemsSettings.skip).toLooseEqual(0);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(0);
    expect(itemsSettings.items.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[24].value).toLooseEqual(25);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);

    listModel.filterString = "2";
    doneCallback(opts[1]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(2);
    expect(question.choices[24].value).toLooseEqual(123);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);

    listModel.filterString = "22";
    doneCallback(opts[2]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(22);
    expect(question.choices[24].value).toLooseEqual(1223);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);
  });

  test("show comment and show other together", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "showOtherItem": true,
        "showCommentArea": true,
        "choices": [1, 2, 3]
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.showOtherItem, "showOtherItem is true").toLooseEqual(true);
    expect(question.showCommentArea, "showCommentArea is true").toLooseEqual(true);
    expect(question.getStoreOthersAsComment(), "we have show comment").toLooseEqual(false);
    question.showCommentArea = false;
    expect(question.getStoreOthersAsComment(), "show comment is hidden").toLooseEqual(true);
    question.showCommentArea = true;
    expect(question.getStoreOthersAsComment(), "show comment again").toLooseEqual(false);
  });

  test("ItemValue: check action fields", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        itemComponent: "custom-component",
        defaultValue: "Item1",
        "choices": [{ text: "Item 1", value: "Item1" }, { text: "Item 2", value: "Item2" }]
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.visibleChoices[0].component).toLooseEqual("custom-component");
    expect(question.visibleChoices[0].locTitle.text).toLooseEqual("Item 1");
    expect(question.visibleChoices[0].title).toLooseEqual("Item 1");
    expect(question.visibleChoices[0].id).toLooseEqual("Item1");
    expect(question.visibleChoices[0].data).toLooseEqual(undefined);
    expect(question.visibleChoices[0].visible).toLooseEqual(true);
    question.visibleChoices[0].setIsVisible(false);
    expect(question.visibleChoices[0].visible).toLooseEqual(false);
    expect(question.visibleChoices[0].enabled).toLooseEqual(true);
    question.visibleChoices[0].setIsEnabled(false);
    expect(question.visibleChoices[0].enabled).toLooseEqual(false);
    expect(question.visibleChoices[0].selected).toLooseEqual(true);
    expect(question.visibleChoices[1].selected).toLooseEqual(false);
    question.value = "Item2";
    expect(question.visibleChoices[0].selected).toLooseEqual(false);
    expect(question.visibleChoices[1].selected).toLooseEqual(true);
  });

  test("lazy loading placeholder", () => {

    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });
    const doCallback = (opt: any) => {
      opt.setItems([], 0);
    };
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    expect(list.actions.length).toLooseEqual(0);
    expect(list.emptyMessage).toLooseEqual("Loading...");
    expect(question.choices.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doCallback(opts[0]);
    expect(list.actions.length).toLooseEqual(0);
    expect(list.emptyMessage).toLooseEqual("No data to display");
    expect(question.choices.length).toLooseEqual(0);
  });

  test("isReady flag + onGetChoiceDisplayValue", () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;

      const json = {
        elements: [{
          "type": "dropdown",
          "name": "q1",
          "choicesLazyLoadEnabled": true,
        }]
      };
      const survey = new SurveyModel(json);
      const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
      let log = "";
      survey.onGetChoiceDisplayValue.add((_, opt) => {
        setTimeout(() => {
          log += "->onGetChoiceDisplayValue";
          opt.setItems(["Ford"]);
        }, 1);
      });
      question.onReadyChanged.add((_, opt) => {
        log += `->onReadyChanged: ${opt.isReady}`;
        if (opt.isReady) {
          expect(question.isReady).toBeTruthy();
          expect(question.isReady).toBeTruthy();
          expect(question["waitingChoicesByURL"]).toBeFalsy();
          expect(question["waitingGetChoiceDisplayValueResponse"]).toBeFalsy();
          expect(log).toLooseEqual("->onReadyChanged: false->onGetChoiceDisplayValue->onReadyChanged: true");
          expect(question.displayValue).toLooseEqual("Ford");
          done();
        }
      });
      survey.data = { "q1": "ford" };
      expect(question.isReady).toBeFalsy();
      expect(question["waitingChoicesByURL"]).toBeFalsy();
      expect(question["waitingGetChoiceDisplayValueResponse"]).toBeTruthy();
    });
  });

  test("isReady flag + onGetChoiceDisplayValue + setItems with empty array", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    survey.onGetChoiceDisplayValue.add((_, opt) => {
      opt.setItems([]);
    });
    survey.data = { "q1": "ford" };
    expect(question.isReady).toBeTruthy();
    expect(question.displayValue).toLooseEqual("ford");
  });

  test("isReady flag + onGetChoiceDisplayValue + choicesRestfull", () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;

      const json = {
        elements: [{
          "type": "dropdown",
          "name": "q1",
          "choicesLazyLoadEnabled": true,
        }]
      };
      const survey = new SurveyModel(json);
      const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
      let log = "";
      survey.onGetChoiceDisplayValue.add((_, opt) => {
        setTimeout(() => {
          log += "->onGetChoiceDisplayValue";
          opt.setItems(["Ford"]);
        }, 1);
      });
      question.onReadyChanged.add((_, opt) => {
        log += `->onReadyChanged: ${opt.isReady}`;
        if (opt.isReady) {
          expect(question.isReady).toBeTruthy();
          expect(question["waitingChoicesByURL"]).toBeFalsy();
          expect(question["waitingGetChoiceDisplayValueResponse"]).toBeFalsy();
          expect(log).toLooseEqual("->onReadyChanged: false->onGetChoiceDisplayValue->onReadyChanged: true");
          done();
        }
      });
      question.choicesByUrl.url = "some url";
      survey.data = { "q1": "ford" };
      expect(question.isReady).toBeFalsy();
      expect(question["waitingChoicesByURL"]).toBeTruthy();
      expect(question["waitingGetChoiceDisplayValueResponse"]).toBeTruthy();
      question.choicesLoaded();
      expect(question.isReady).toBeFalsy();
      expect(question["waitingChoicesByURL"]).toBeFalsy();
      expect(question["waitingGetChoiceDisplayValueResponse"]).toBeTruthy();
    });
  });
  test("isReady flag + there is no onChoicesLazyLoad & onGetChoiceDisplayValue, Bug#10642", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
      }]
    };
    const survey = new SurveyModel(json);
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    survey.data = { "q1": "ford" };
    expect(question.isReady, "There is no onGetChoiceDisplayValue, isReady = true").toBeTruthy();
    expect(question.displayValue, "displayValue is correct").toLooseEqual("ford");
  });
  test("lazy loading: change choicesLazyLoadEnabled on runtime", () => {
    const json = {
      elements: [{
        "type": "dropdown",
        "name": "q1",
      }]
    };
    const survey = new SurveyModel(json);
    survey.onChoicesLazyLoad.add((_, opt) => {
      const total = 55;
      const result: Array<any> = [];
      const filter = !opt.filter ? "" : "des";
      for (let index = 0; index < total; index++) {
        result.push({ value: "item" + index, text: "item" + filter + index });
      }
      if (opt.filter === "des") {
        opt.setItems(result.slice(10, 15), total);
      } else {
        opt.setItems(result.slice(0, 15), total);
      }
    });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    expect(question.choicesLazyLoadEnabled).toLooseEqual(false);
    expect(question.choices.length).toLooseEqual(0);

    question.choicesLazyLoadEnabled = true;
    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(question.dropdownListModel["listModel"].visibleItems.length, "#1").toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    expect(question.choices.length).toLooseEqual(15);
    expect(question.dropdownListModel["listModel"].visibleItems.length, "#2").toLooseEqual(16);
    expect(question.dropdownListModel["listModel"].visibleItems[15].id).toLooseEqual("loadingIndicator");

    question.dropdownListModel.filterString = "des";
    expect(question.choices.length).toLooseEqual(5);
    expect(question.dropdownListModel["listModel"].visibleItems.length, "#3").toLooseEqual(6);
    expect(question.dropdownListModel["listModel"].visibleItems[5].id).toLooseEqual("loadingIndicator");
  });
  test("lazy loading: duplication of elements after blur", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 25,
      }]
    });
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const itemsSettings = question.dropdownListModel["itemsSettings"];

    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length, "question.choices.length #0").toLooseEqual(0);
    question.dropdownListModel.popupModel.show();
    question.dropdownListModel.changeSelectionWithKeyboard(false);
    doneCallback(opts[0]);
    expect(question.choices.length, "question.choices.length #1").toLooseEqual(25);
    expect(question.dropdownListModel.inputStringRendered, "question.dropdownListModel.inputStringRendered #1").toLooseEqual("");
    expect(itemsSettings.skip, "skip #1").toLooseEqual(25);
    expect(itemsSettings.take, "take #1").toLooseEqual(25);
    expect(itemsSettings.totalCount, "totalCount #1").toLooseEqual(55);
    expect(itemsSettings.items.length, "items.length #1").toLooseEqual(25);
    question.dropdownListModel.inputStringRendered = "11";
    doneCallback(opts[1]);

    expect(question.choices.length, "question.choices.length #2").toLooseEqual(25);
    expect(question.dropdownListModel.inputStringRendered, "question.dropdownListModel.inputStringRendered #2").toLooseEqual("11");
    expect(itemsSettings.skip, "skip #2").toLooseEqual(25);
    expect(itemsSettings.take, "take #2").toLooseEqual(25);
    expect(itemsSettings.totalCount, "totalCount #2").toLooseEqual(55);
    expect(itemsSettings.items.length, "items.length #2").toLooseEqual(25);
    question.dropdownListModel.onBlur({
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    });

    expect(question.value).toLooseEqual(undefined);
    expect(question.choices.length, "question.choices.length #3").toLooseEqual(25);
    expect(question.dropdownListModel.inputStringRendered, "question.dropdownListModel.inputStringRendered #3").toLooseEqual("");
    expect(itemsSettings.skip, "skip #3").toLooseEqual(0);
    expect(itemsSettings.take, "take #3").toLooseEqual(25);
    expect(itemsSettings.totalCount, "totalCount #3").toLooseEqual(0);
    expect(itemsSettings.items.length, "items.length #3").toLooseEqual(0);
    question.dropdownListModel.popupModel.show();

    doneCallback(opts[2]);
    expect(question.choices.length, "question.choices.length #4").toLooseEqual(25);
    expect(question.dropdownListModel.inputStringRendered, "question.dropdownListModel.inputStringRendered #4").toLooseEqual("");
  });
  test("lazy loading: check onChoicesLazyLoad callback count", () => {
    let callbackCount = 0;
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true,
        "choicesLazyLoadPageSize": 25,
      }]
    });
    const doCallback = (opt: any) => {
      callbackCount++;
      if (!!opt.filter) {
        opt.setItems([], 0);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), 55);
      }
    };
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

    expect(callbackCount).toLooseEqual(0);
    question.dropdownListModel.popupModel.show();
    question.dropdownListModel.changeSelectionWithKeyboard(false);
    doCallback(opts[0]);
    expect(callbackCount).toLooseEqual(1);
    question.dropdownListModel.inputStringRendered = "11";

    doCallback(opts[1]);
    expect(callbackCount).toLooseEqual(2);
    question.dropdownListModel.onBlur({
      keyCode: 0,
      preventDefault: () => { },
      stopPropagation: () => { }
    });

    expect(callbackCount).toLooseEqual(2);
    question.dropdownListModel.popupModel.show();

    doCallback(opts[2]);
  });

  test("Test dropdown string localization", () => {
    const survey = new SurveyModel({
      "locale": "de",
      "elements": [
        {
          "name": "q1",
          "type": "dropdown",
        }
      ],
    });
    const q1 = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel = q1.dropdownListModel["listModel"];
    expect(listModel.filterStringPlaceholder, "filterStringPlaceholder").toLooseEqual("Tippen Sie, um zu suchen...");
    expect(listModel.emptyMessage, "emptyMessage").toLooseEqual("Es gibt noch keine Daten.");
    expect(listModel.loadingIndicator.title, "loadingText").toLooseEqual("Wird hochgeladen...");

    let popupViewModel: PopupBaseViewModel = new PopupDropdownViewModel(q1.dropdownListModel.popupModel);
    expect(popupViewModel.cancelButtonText, "cancelButtonText").toLooseEqual("Abbrechen");

    popupViewModel = new PopupModalViewModel(q1.dropdownListModel.popupModel);
    expect((popupViewModel as PopupModalViewModel).applyButtonText, "applyButtonText").toLooseEqual("Anwenden");
  });

  test("Dropdown choicesLazyLoadEnabled into matrixdynamic", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "question1",
              "columns": [
                {
                  "cellType": "dropdown",
                  "name": "country",
                  "choicesLazyLoadEnabled": true,
                  "showOtherItem": true
                },
                { "name": "country" },
                { "name": "Column3" }
              ],
              "choices": [1, 2, 3, 4, 5]
            }
          ]
        }
      ]
    });
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, options) => { opts.push(options); });

    const matrix = <QuestionMatrixDynamicModel>survey.getAllQuestions()[0];
    const question = <QuestionDropdownModel>matrix.visibleRows[0].cells[0].question;
    const itemsSettings = question.dropdownListModel["itemsSettings"];
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;

    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(5);
    expect(itemsSettings.skip).toLooseEqual(0);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(0);
    expect(itemsSettings.items.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doneCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(1);
    expect(question.choices[24].value).toLooseEqual(25);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);

    listModel.filterString = "2";
    doneCallback(opts[1]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(2);
    expect(question.choices[24].value).toLooseEqual(123);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);

    listModel.filterString = "22";
    doneCallback(opts[2]);
    expect(question.choices.length).toLooseEqual(25);
    expect(question.choices[0].value).toLooseEqual(22);
    expect(question.choices[24].value).toLooseEqual(1223);
    expect(itemsSettings.skip).toLooseEqual(25);
    expect(itemsSettings.take).toLooseEqual(25);
    expect(itemsSettings.totalCount).toLooseEqual(55);
    expect(itemsSettings.items.length).toLooseEqual(25);
  });

  test("Rapidly Changing Search Filter", () => {
    // Use fake timers so the precise window between the debounce firing and
    // the lazy-load callback firing is deterministic (the original real-timer
    // version was flaky on slow machines and CI).
    vi.useFakeTimers();
    try {
      const debounceDelay = 2 * onChoicesLazyLoadCallbackTimeOut;

      let filterValueLog = "";
      const json = {
        elements: [{
          "type": "dropdown",
          "name": "q1",
          "choicesLazyLoadEnabled": true,
        }]
      };
      const survey = new SurveyModel(json);
      survey.onChoicesLazyLoad.add((sender, option) => {
        filterValueLog += (option.filter + "->");
        callback(sender, option);
      });

      const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
      const dropdownListModel = question.dropdownListModel;
      settings.dropdownSearchDelay = debounceDelay;

      // Type "1" - debounce armed.
      dropdownListModel.inputStringRendered = "1";
      vi.advanceTimersByTime(debounceDelay - 1); // not yet fired
      expect(question.choices.length).toLooseEqual(0);
      expect(filterValueLog, "filter value 1").toLooseEqual("");

      // Type "12" before debounce fires - debounce is reset.
      dropdownListModel.inputStringRendered = "12";
      vi.advanceTimersByTime(debounceDelay - 1);
      expect(question.choices.length).toLooseEqual(0);
      expect(filterValueLog, "filter value 12").toLooseEqual("");

      // Type "123" before debounce fires - debounce is reset again.
      dropdownListModel.inputStringRendered = "123";
      // Advance exactly the debounce delay: debounce callback fires now and
      // schedules the lazy-load callback for `onChoicesLazyLoadCallbackTimeOut`
      // ms in the future. Choices haven't been populated yet.
      vi.advanceTimersByTime(debounceDelay);
      expect(filterValueLog, "filter value 123 #1").toLooseEqual("123->");
      expect(question.choices.length).toLooseEqual(0);

      // Now let the lazy-load callback fire.
      vi.advanceTimersByTime(onChoicesLazyLoadCallbackTimeOut);
      expect(filterValueLog, "filter value 123 #2").toLooseEqual("123->");
      expect(question.choices.length).toLooseEqual(25);

      settings.dropdownSearchDelay = 0;
    } finally {
      vi.useRealTimers();
    }
  });

  test("Dropdown with Lazy Loading - A list of items display duplicate entries #9111", () => {
    const survey = new SurveyModel({
      elements: [{ "type": "dropdown", "name": "q1", "choicesLazyLoadEnabled": true }]
    });
    const doCallback = (opt: any) => {
      opt.setItems(getNumberArray(0, 5, opt.filter), 5);
    };
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const itemsSettings = question.dropdownListModel["itemsSettings"];

    expect(question.choicesLazyLoadEnabled).toLooseEqual(true);
    expect(question.choices.length).toLooseEqual(0);
    expect(question.choices.length, "question.choices.length #1").toLooseEqual(0);
    expect(itemsSettings.items.length, "itemsSettings.items.length #1").toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doCallback(opts[0]);
    expect(question.choices.length, "question.choices.length #2").toLooseEqual(5);

    question.dropdownListModel.filterString = "22";
    doCallback(opts[1]);
    expect(question.choices.length, "question.choices.length #3").toLooseEqual(5);

    question.dropdownListModel.filterString = "2";
    doCallback(opts[2]);
    expect(question.choices.length, "question.choices.length #4").toLooseEqual(5);

    question.dropdownListModel.filterString = "";
    doCallback(opts[3]);
    expect(question.choices.length, "question.choices.length #5").toLooseEqual(5);
  });

  test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: false", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: "false",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testExistValue = "item2";
    const testCustomValue = "item10";
    listModel.flushUpdates();

    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toLooseEqual(false);
    expect(dropdownListModel.inputStringRendered, "#1 inputStringRendered").toLooseEqual("");
    expect(dropdownListModel.customValue, "#1 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#1 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(4);

    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toLooseEqual(false);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(dropdownListModel.popupModel.isVisible, "#2 popupModel.isVisible").toLooseEqual(true);
    expect(listModel.isEmpty, "#2 listModel is empty").toLooseEqual(true);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(4);
    expect(listModel.focusedItem, "#2 focusedItem").toLooseEqual(undefined);

    question.allowCustomChoices = true;
    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#3 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#3 customValue").toLooseEqual(testCustomValue);
    expect(dropdownListModel.popupModel.isVisible, "#3 popupModel.isVisible").toLooseEqual(true);
    expect(listModel.isEmpty, "#3 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#3 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#3 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#3 custom item text").toLooseEqual("Create \"item10\" item...");
    expect(listModel.actions[4].visible, "#3 custom item visible").toLooseEqual(true);
    expect(listModel.focusedItem.id, "#3 focusedItem").toLooseEqual("newCustomItem");

    dropdownListModel.inputStringRendered = testExistValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#4 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#4 customValue").toLooseEqual(undefined);
    expect(dropdownListModel.popupModel.isVisible, "#4 popupModel.isVisible").toLooseEqual(true);
    expect(listModel.isEmpty, "#4 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#4 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#4 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#4 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#4 custom item invisible").toLooseEqual(false);
    expect(listModel.focusedItem.id, "#4 focusedItem").toLooseEqual("item2");

    dropdownListModel.inputStringRendered = testExistValue + "test";
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#5 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#5 customValue").toLooseEqual(testExistValue + "test");
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toLooseEqual(true);
    expect(listModel.isEmpty, "#5 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#5 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#5 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#5 custom item text").toLooseEqual("Create \"item2test\" item...");
    expect(listModel.actions[4].visible, "#5 custom item visible").toLooseEqual(true);
    expect(listModel.focusedItem.id, "#5 focusedItem").toLooseEqual("newCustomItem");

    dropdownListModel.popupModel.hide();
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#6 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#6 customValue").toLooseEqual(undefined);
    expect(dropdownListModel.popupModel.isVisible, "#6 popupModel.isVisible").toLooseEqual(false);
    expect(listModel.isEmpty, "#6 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#6 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#6 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#6 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#6 custom item invisible").toLooseEqual(false);
  });

  test("allowCustomChoices: Add custom value if searchEnabled: false", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: false, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue = "item10";

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#1 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#1 custom item visible").toLooseEqual(true);
    expect(question.value, "#1 question.value").toLooseEqual(undefined);
    expect(question.selectedItem, "#1 question.selectedItem").toLooseEqual(undefined);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toLooseEqual(4);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(6);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toLooseEqual(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toLooseEqual(testCustomValue);
    expect(listModel.actions[5].id, "#2 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[5].visible, "#2 custom item invisible").toLooseEqual(false);
    expect(question.value, "#2 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.id, "#2 question.selectedItem").toLooseEqual(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toLooseEqual(5);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toLooseEqual(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: testCustomValue });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: testCustomValue });

  });

  test("allowCustomChoices: inputStringRendered isn't reset after backspace, if searchEnabled: false", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: "false", allowCustomChoices: "true",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const testCustomValue1 = "item101";

    const event = {
      keyCode: 8,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    dropdownListModel.inputStringRendered = testCustomValue1;
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#1 customValue").toLooseEqual(testCustomValue1);
    expect(dropdownListModel.hintStringPrefix, "#1 hintStringPrefix").toLooseEqual("");
    expect(dropdownListModel.hintStringSuffix, "#1 hintStringSuffix").toLooseEqual("");

    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#2 customValue not empty").toBeTruthy();
    expect(dropdownListModel.hintStringPrefix, "#2 hintStringPrefix").toLooseEqual("");
    expect(dropdownListModel.hintStringSuffix, "#2 hintStringSuffix").toLooseEqual("");
  });

  test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: "true",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testExistValue = "item2";
    const testCustomValue = "item10";
    listModel.flushUpdates();

    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toLooseEqual(false);
    expect(dropdownListModel.inputStringRendered, "#1 inputStringRendered").toLooseEqual("");
    expect(dropdownListModel.customValue, "#1 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#1 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(4);

    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toLooseEqual(false);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#2 listModel is empty").toLooseEqual(true);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(4);

    question.allowCustomChoices = true;
    dropdownListModel.inputStringRendered = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#3 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#3 customValue").toLooseEqual(testCustomValue);
    expect(listModel.isEmpty, "#3 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#3 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#3 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#3 custom item text").toLooseEqual("Create \"item10\" item...");
    expect(listModel.actions[4].visible, "#3 custom item visible").toLooseEqual(true);

    dropdownListModel.inputStringRendered = testExistValue;
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#4 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#4 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#4 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#4 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#4 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#4 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#4 custom item invisible").toLooseEqual(false);

    dropdownListModel.inputStringRendered = testExistValue + "test";
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#5 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#5 customValue").toLooseEqual(testExistValue + "test");
    expect(listModel.isEmpty, "#5 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#5 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#5 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#5 custom item text").toLooseEqual("Create \"item2test\" item...");
    expect(listModel.actions[4].visible, "#5 custom item visible").toLooseEqual(true);
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toLooseEqual(true);

    dropdownListModel.popupModel.hide();
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#6 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#6 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#6 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#6 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#6 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#6 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#6 custom item invisible").toLooseEqual(false);
  });

  test("allowCustomChoices: Add custom value if searchEnabled: true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: true, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue = "item10";

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#1 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#1 custom item visible").toLooseEqual(true);
    expect(question.value, "#1 question.value").toLooseEqual(undefined);
    expect(question.selectedItem, "#1 question.selectedItem").toLooseEqual(undefined);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toLooseEqual(4);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(6);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toLooseEqual(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toLooseEqual(testCustomValue);
    expect(listModel.actions[5].id, "#2 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[5].visible, "#2 custom item invisible").toLooseEqual(false);
    expect(question.value, "#2 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.id, "#2 question.selectedItem").toLooseEqual(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toLooseEqual(5);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toLooseEqual(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: testCustomValue });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: testCustomValue });
  });

  test("allowCustomChoices: hintString with custom value if searchEnabled: true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: "true", allowCustomChoices: "true",
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue1 = "item101";
    const testCustomValue2 = "item10";
    const testCustomValue3 = "item";

    dropdownListModel.inputStringRendered = testCustomValue1;
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#1 customValue").toLooseEqual(testCustomValue1);
    expect(dropdownListModel.hintStringPrefix, "#1 hintStringPrefix").toLooseEqual("");
    expect(dropdownListModel.hintStringSuffix, "#1 hintStringSuffix").toLooseEqual("");

    dropdownListModel.inputStringRendered = testCustomValue2;
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(testCustomValue2);
    expect(dropdownListModel.hintStringPrefix, "#2 hintStringPrefix").toLooseEqual("");
    expect(dropdownListModel.hintStringSuffix, "#2 hintStringSuffix").toLooseEqual("");

    const event = {
      keyCode: 38,
      preventDefault: () => { },
      stopPropagation: () => { }
    };

    dropdownListModel.inputStringRendered = testCustomValue3;
    expect(dropdownListModel.inputStringRendered, "#3 inputStringRendered").toLooseEqual(testCustomValue3);
    expect(dropdownListModel.customValue, "#3 customValue").toLooseEqual(testCustomValue3);
    expect(dropdownListModel.hintStringPrefix, "#3 hintStringPrefix").toLooseEqual("");
    expect(dropdownListModel.hintStringSuffix, "#3 hintStringSuffix").toLooseEqual("1");

    dropdownListModel.keyHandler(event);
    expect(dropdownListModel.inputStringRendered, "#4 inputStringRendered").toLooseEqual(testCustomValue3);
    expect(dropdownListModel.customValue, "#4 customValue").toLooseEqual(testCustomValue3);
    expect(dropdownListModel.hintStringPrefix, "#4 hintStringPrefix").toLooseEqual("");
    expect(dropdownListModel.hintStringSuffix, "#4 hintStringSuffix").toLooseEqual("");

    dropdownListModel.keyHandler(event);
    listModel.onItemClick(listModel.actions[4]);
    expect(dropdownListModel.inputStringRendered, "#5 inputStringRendered").toLooseEqual(testCustomValue3);
    expect(dropdownListModel.customValue, "#5 customValue").toLooseEqual(undefined);
    expect(dropdownListModel.hintStringPrefix, "#5 hintStringPrefix").toLooseEqual("");
    expect(dropdownListModel.hintStringSuffix, "#5 hintStringSuffix").toLooseEqual("");
  });

  test("allowCustomChoices: Option to create item not available if item exist (case-insensitive).", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: "true", allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testExistValue = "item2";
    listModel.flushUpdates();

    dropdownListModel.inputStringRendered = testExistValue.toUpperCase();
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#1 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#1 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(4);
  });

  test("allowCustomChoices: onCreateCustomChoiceItem event.", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: true, allowCustomChoices: true,
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
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue = "item10";
    const testCustomValueUpperCase = testCustomValue.toUpperCase();

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(question.value, "#1 question.value").toLooseEqual(undefined);
    expect(question.selectedItem, "#1 question.selectedItem").toLooseEqual(undefined);
    expect(survey.data, "#1 survey.data").toEqualValues({});
    expect(listModel.actions[4].id).toLooseEqual("newCustomItem");

    listModel.onItemClick(listModel.actions[4]);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValueUpperCase);
    expect(question.value, "#2 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.value, "#2 question.selectedItem.id").toLooseEqual(testCustomValue);
    expect(question.selectedItem.text, "#2 question.selectedItem.text").toLooseEqual(testCustomValueUpperCase);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: testCustomValue });

    dropdownListModel.inputStringRendered = testCustomValue + "1";
    expect(question.value, "#3 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.value, "#3 question.selectedItem.id").toLooseEqual(testCustomValue);
    expect(question.selectedItem.text, "#3 question.selectedItem.text").toLooseEqual(testCustomValueUpperCase);
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: testCustomValue });
    expect(listModel.actions[5].id).toLooseEqual("newCustomItem");

    listModel.onItemClick(listModel.actions[5]);
    expect(dropdownListModel.inputStringRendered, "#4 inputStringRendered").toLooseEqual("");
    expect(question.value, "#4 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.value, "#4 question.selectedItem.id").toLooseEqual(testCustomValue);
    expect(question.selectedItem.text, "#4 question.selectedItem.text").toLooseEqual(testCustomValueUpperCase);
    expect(survey.data, "#4 survey.data").toEqualValues({ q1: testCustomValue });
  });

  test("allowCustomChoices: Possibility of creating an element with custom value if choicesLazyLoadEnabled is true", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: "true",
        "choicesLazyLoadEnabled": true, "choicesLazyLoadPageSize": 25
      }]
    });
    const doCallback = (opt: any) => {
      if (!!opt.filter && opt.filter !== "2") {
        opt.setItems([], 0);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), 55);
      }
    };
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testExistValue = "2";
    const testCustomValue1 = "customItem1";
    const testCustomValue2 = "customItem2";

    dropdownListModel.popupModel.show();
    doCallback(opts[0]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#1 allowCustomChoices").toLooseEqual(false);
    expect(dropdownListModel.inputStringRendered, "#1 inputStringRendered").toLooseEqual("");
    expect(dropdownListModel.customValue, "#1 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#1 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(26);

    dropdownListModel.inputStringRendered = testCustomValue1;
    doCallback(opts[1]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#2 allowCustomChoices").toLooseEqual(false);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValue1);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#2 listModel is empty").toLooseEqual(true);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(0);

    question.allowCustomChoices = true;
    dropdownListModel.inputStringRendered = testCustomValue2;
    doCallback(opts[2]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#3 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#3 customValue").toLooseEqual(testCustomValue2);
    expect(listModel.isEmpty, "#3 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#3 listModel.actions").toLooseEqual(1);
    expect(listModel.actions[0].id, "#3 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[0].title, "#3 custom item text").toLooseEqual("Create \"customItem2\" item...");
    expect(listModel.actions[0].visible, "#3 custom item visible").toLooseEqual(true);

    dropdownListModel.inputStringRendered = testExistValue;
    doCallback(opts[3]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#4 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#4 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#4 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#4 listModel.actions").toLooseEqual(27);
    expect(listModel.actions[25].id, "#4 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[25].title, "#4 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[25].visible, "#4 custom item invisible").toLooseEqual(false);

    dropdownListModel.inputStringRendered = testExistValue + "test";
    doCallback(opts[4]);
    listModel.flushUpdates();
    expect(dropdownListModel.allowCustomChoices, "#5 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#5 customValue").toLooseEqual(testExistValue + "test");
    expect(listModel.isEmpty, "#5 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#5 listModel.actions").toLooseEqual(1);
    expect(listModel.actions[0].id, "#5 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[0].title, "#5 custom item text").toLooseEqual("Create \"2test\" item...");
    expect(listModel.actions[0].visible, "#5 custom item visible").toLooseEqual(true);
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toLooseEqual(true);

    dropdownListModel.popupModel.hide();
    expect(dropdownListModel.allowCustomChoices, "#6 allowCustomChoices").toLooseEqual(true);
    expect(dropdownListModel.customValue, "#6 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#6 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#6 listModel.actions").toLooseEqual(1);
    expect(listModel.actions[0].id, "#6 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[0].title, "#6 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[0].visible, "#6 custom item invisible").toLooseEqual(false);
  });

  test("allowCustomChoices: Add custom value if choicesLazyLoadEnabled is true", () => {
    const survey = new SurveyModel({
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "dropdown",
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
    const doCallback = (opt: any) => {
      if (!!opt.filter) {
        opt.setItems([], 0);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), 55);
      }
    };
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue = "testCustomValue";

    expect(question.visibleChoices.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doCallback(opts[0]);
    expect(question.visibleChoices.length).toLooseEqual(25);

    dropdownListModel.inputStringRendered = testCustomValue;
    doCallback(opts[1]);
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(1);
    expect(listModel.actions[0].id, "#1 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[0].visible, "#1 custom item visible").toLooseEqual(true);
    expect(question.value, "#1 question.value").toLooseEqual(undefined);
    expect(question.selectedItem, "#1 question.selectedItem").toLooseEqual(undefined);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toLooseEqual(0);
    expect(survey.data, "#1 survey.data").toEqualValues({});
    expect(dropdownListModel.popupModel.isVisible, "#1 popupModel.isVisible").toLooseEqual(true);

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.popupModel.isVisible, "popupModel.isVisible false").toLooseEqual(false);

    question.dropdownListModel.popupModel.show();
    doCallback(opts[2]);
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(28);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toLooseEqual(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toLooseEqual(testCustomValue);
    expect(listModel.actions[26].id, "#2 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[26].visible, "#2 custom item invisible").toLooseEqual(false);
    expect(listModel.actions[27].id, "#2 loadingIndicator id").toLooseEqual("loadingIndicator");
    expect(listModel.actions[27].visible, "#2 loadingIndicator invisible").toLooseEqual(true);
    expect(question.value, "#2 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.id, "#2 question.selectedItem").toLooseEqual(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toLooseEqual(26);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toLooseEqual(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ country: testCustomValue });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ country: testCustomValue });
  });

  test("allowCustomChoices: Possibility of creating an element with custom value (mobile mode)", () => {
    _setIsTouch(true);

    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: false, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testExistValue = "item2";
    const testCustomValue = "item10";
    listModel.flushUpdates();

    expect(dropdownListModel.customValue, "#1 customValue").toLooseEqual(undefined);
    expect(listModel.searchEnabled, "#1 listModel searchEnabled").toLooseEqual(true);
    expect(listModel.isEmpty, "#1 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(4);

    listModel.filterString = testCustomValue;
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#3 customValue").toLooseEqual(testCustomValue);
    expect(listModel.isEmpty, "#3 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#3 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#3 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#3 custom item text").toLooseEqual("Create \"item10\" item...");
    expect(listModel.actions[4].visible, "#3 custom item visible").toLooseEqual(true);

    listModel.filterString = testExistValue;
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#4 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#4 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#4 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#4 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#4 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#4 custom item invisible").toLooseEqual(false);

    listModel.filterString = testExistValue + "test";
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#5 customValue").toLooseEqual(testExistValue + "test");
    expect(listModel.isEmpty, "#5 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#5 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#5 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#5 custom item text").toLooseEqual("Create \"item2test\" item...");
    expect(listModel.actions[4].visible, "#5 custom item visible").toLooseEqual(true);
    expect(dropdownListModel.popupModel.isVisible, "#5 popupModel.isVisible").toLooseEqual(true);

    dropdownListModel.popupModel.hide();
    listModel.flushUpdates();
    expect(dropdownListModel.customValue, "#6 customValue").toLooseEqual(undefined);
    expect(listModel.isEmpty, "#6 listModel is not empty").toLooseEqual(false);
    expect(listModel.actions.length, "#6 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#6 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].title, "#6 custom item text").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#6 custom item invisible").toLooseEqual(false);

    _setIsTouch(false);
  });

  test("allowCustomChoices: Add custom value (mobile mode)", () => {
    _setIsTouch(true);

    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", searchEnabled: true, allowCustomChoices: true,
        "choices": ["item1", "item2", "item3", "item4"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue = "item10";

    listModel.filterString = testCustomValue;
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(5);
    expect(listModel.actions[4].id, "#1 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[4].visible, "#1 custom item visible").toLooseEqual(true);
    expect(question.value, "#1 question.value").toLooseEqual(undefined);
    expect(question.selectedItem, "#1 question.selectedItem").toLooseEqual(undefined);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toLooseEqual(4);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(6);
    expect(listModel.actions[0].id, "#2 custom value add into list - id").toLooseEqual(testCustomValue);
    expect(listModel.actions[0].title, "#2 custom value add into list - title").toLooseEqual(testCustomValue);
    expect(listModel.actions[5].id, "#2 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[5].visible, "#2 custom item invisible").toLooseEqual(false);
    expect(question.value, "#2 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.id, "#2 question.selectedItem").toLooseEqual(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toLooseEqual(5);
    expect(question.visibleChoices[0].value, "#2 question.visibleChoices[0]").toLooseEqual(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: testCustomValue });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: testCustomValue });

    _setIsTouch(false);
  });

  test("allowCustomChoices: Add custom value if sortOrder", () => {
    const survey = new SurveyModel({
      elements: [{
        name: "q1", type: "dropdown", choicesOrder: "asc", allowCustomChoices: true,
        choices: ["ABC", "DEF", "JKL", "MNO", "PQR"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const testCustomValue = "GHI";

    dropdownListModel.inputStringRendered = testCustomValue;
    expect(listModel.actions.length, "#1 listModel.actions").toLooseEqual(6);
    expect(listModel.actions[5].id, "#1 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[5].visible, "#1 custom item visible").toLooseEqual(true);
    expect(question.value, "#1 question.value").toLooseEqual(undefined);
    expect(question.selectedItem, "#1 question.selectedItem").toLooseEqual(undefined);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toLooseEqual(5);
    expect(survey.data, "#1 survey.data").toEqualValues({});

    listModel.onItemClick(listModel.getActionById("newCustomItem"));
    expect(dropdownListModel.inputStringRendered, "#2 inputStringRendered").toLooseEqual(testCustomValue);
    expect(dropdownListModel.customValue, "#2 customValue").toLooseEqual(undefined);
    expect(listModel.actions.length, "#2 listModel.actions").toLooseEqual(7);
    expect(listModel.actions[2].id, "#2 custom value add into list - id").toLooseEqual(testCustomValue);
    expect(listModel.actions[2].title, "#2 custom value add into list - title").toLooseEqual(testCustomValue);
    expect(listModel.actions[6].id, "#2 custom item id").toLooseEqual("newCustomItem");
    expect(listModel.actions[6].visible, "#2 custom item invisible").toLooseEqual(false);
    expect(question.value, "#2 question.value").toLooseEqual(testCustomValue);
    expect(question.selectedItem.id, "#2 question.selectedItem").toLooseEqual(testCustomValue);
    expect(question.visibleChoices.length, "#2 question.visibleChoices").toLooseEqual(6);
    expect(question.visibleChoices[2].value, "#2 question.visibleChoices[0]").toLooseEqual(testCustomValue);
    expect(survey.data, "#2 survey.data").toEqualValues({ q1: testCustomValue });

    survey.tryComplete();
    expect(survey.data, "#3 survey.data").toEqualValues({ q1: testCustomValue });
  });

  test("allowCustomChoices: custom choices from survey.data", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown", name: "q1", allowCustomChoices: true, choices: [
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
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const customValue = "test";
    const data = { q1: customValue };
    survey.data = data;

    expect(question.value, "#1 question.value").toLooseEqual(customValue);
    expect(question.selectedItem.id, "#1 question.selectedItem").toLooseEqual(customValue);
    expect(question.visibleChoices.length, "#1 question.visibleChoices").toLooseEqual(8);
    expect(listModel.actions.length, "listModel.actions.length").toLooseEqual(9);
    expect(listModel.actions[0].id, "#1 new custom item").toLooseEqual(customValue);
    expect(listModel.actions[0].visible, "#1 new custom item visible").toLooseEqual(true);
    expect(survey.data, "#1 survey.data").toEqualValues(data);
  });

  test("allowCustomChoices: choices with displayName from survey.data", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown", name: "q1", allowCustomChoices: true, choices: [
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
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const listModel: ListModel = question.dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const value = "LSS";
    const data = { q1: value };
    survey.data = data;

    expect(question.value, "#1 question.value").toLooseEqual(value);
    expect(question.selectedItem.id, "#1 question.selectedItem").toLooseEqual(value);
    expect(question.selectedItem.title, "#1 question.selectedItem").toLooseEqual("Large screen size");
    expect(listModel.actions.length, "listModel.actions.length").toLooseEqual(8);
    expect(survey.data, "#1 survey.data").toEqualValues(data);
  });

  test("lazy loading + isReady", () => {
    return new Promise(function(resolve) {
      let __remaining = 1;
      const __done = function() { if (--__remaining <= 0) resolve(); };

      const done = __done;
      const survey = new SurveyModel({ elements: [{ "type": "dropdown", "name": "q1", "choicesLazyLoadEnabled": true }] });
      survey.onChoicesLazyLoad.add((_, options) => {
        options.setItems(getNumberArray(1, 25), 25);
      });

      const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
      expect(question.choicesLazyLoadEnabled, "#1").toLooseEqual(true);
      expect(question.choices.length, "#1").toLooseEqual(0);
      expect(question.isReady, "#1").toLooseEqual(true);

      question.waitForQuestionIsReady(() => {
        expect(question.choices.length, "#2").toLooseEqual(25);
        expect(question.isReady, "#2").toLooseEqual(true);
        done();
      });
    });
  });

  test("Dropdown with Lazy Loading applies additional client-side filtering to the choice list", () => {
    const survey = new SurveyModel({
      elements: [{
        "type": "dropdown",
        "name": "q1",
        "choicesLazyLoadEnabled": true
      }]
    });

    const doCallback = (options: any) => {
      if (!!options.filter) {
        options.setItems(["fruit juice", "fruit salad", "apple", "banana"], 4);
      } else {
        options.setItems([], 0);
      }
    };
    const opts = new Array<any>();
    survey.onChoicesLazyLoad.add((_, opt) => { opts.push(opt); });

    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    expect(list.actions.length).toLooseEqual(0);
    expect(question.choices.length).toLooseEqual(0);

    question.dropdownListModel.popupModel.show();
    doCallback(opts[0]);
    expect(question.choices.length).toLooseEqual(0);
    expect(list.actions.length).toLooseEqual(0);

    question.dropdownListModel.filterString = "fruit";
    doCallback(opts[1]);
    expect(question.choices.length).toLooseEqual(4);
    expect(list.actions.length).toLooseEqual(4);
    expect(list.actions.filter(item => list.isItemVisible(item)).length).toLooseEqual(4);
  });
  test("Dropdown getInputId & getFirstInputElementId, bug#10567", () => {
    const q: any = new QuestionDropdownModel("q1");
    expect(q.getInputId(), "getInputId #1").toLooseEqual(q.id + "i_0");
    expect(q.getFirstInputElementId(), "getFirstInputElementId #1").toLooseEqual(q.id + "i_0");
    q.searchEnabled = false;
    expect(q.getInputId(), "getInputId #2").toLooseEqual(q.id + "i_0");
    expect(q.getFirstInputElementId(), "getFirstInputElementId #2").toLooseEqual(q.id + "i");
    q.searchEnabled = true;
    expect(q.getInputId(), "getInputId #3").toLooseEqual(q.id + "i_0");
    expect(q.getFirstInputElementId(), "getFirstInputElementId #3").toLooseEqual(q.id + "i_0");
    q.renderAs = "select";
    expect(q.getInputId(), "getInputId #4").toLooseEqual(q.id + "i");
    expect(q.getFirstInputElementId(), "getFirstInputElementId #4").toLooseEqual(q.id + "i");
  });

  test("auto-select focused item on Tab", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "q1",
        searchEnabled: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const focusedItem = "item1";

    dropdownListModel.inputStringRendered = "item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before Tab").toLooseEqual(undefined);
    expect(question.selectedItem, "selectedItem is undefined").toLooseEqual(undefined);
    expect(list.visibleItems.length).toLooseEqual(3);

    const event = { keyCode: 9, preventDefault: () => { }, stopPropagation: () => { } };
    dropdownListModel.keyHandler(event);

    expect(question.value, "item1 selected on Tab").toLooseEqual(focusedItem);
    expect(question.selectedItem?.value, "selectedItem is item1").toLooseEqual(focusedItem);
    expect(list.visibleItems.length).toLooseEqual(3);
  });

  test("auto-select custom item on Tab", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "q1",
        searchEnabled: true,
        allowCustomChoices: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const customValue = "abc";

    dropdownListModel.inputStringRendered = customValue;
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before Tab").toLooseEqual(undefined);
    expect(list.visibleItems.length, "only custom item visible").toLooseEqual(1);
    expect(list.visibleItems[0].id, "visible item is custom").toLooseEqual("newCustomItem");

    const event = { keyCode: 9, preventDefault: () => { }, stopPropagation: () => { } };
    dropdownListModel.keyHandler(event);

    expect(question.value, "custom value selected on Tab").toLooseEqual(customValue);
    expect(question.selectedItem?.value, "selectedItem is custom").toLooseEqual(customValue);
    expect(list.visibleItems.length).toLooseEqual(4);
    expect(list.visibleItems[0].id).toLooseEqual(customValue);
  });

  test("auto-select custom item on blur", () => {
    settings.dropdownSaveOnOutsideClick = true;

    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "q1",
        searchEnabled: true,
        allowCustomChoices: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const customValue = "abc";

    dropdownListModel.inputStringRendered = customValue;
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before blur").toLooseEqual(undefined);
    expect(list.visibleItems.length, "only custom item visible").toLooseEqual(1);

    dropdownListModel.onBlur({ target: null, relatedTarget: document.createElement("div"), stopPropagation: () => { } });

    expect(question.value, "custom value selected on blur").toLooseEqual(customValue);
    expect(question.selectedItem?.value, "selectedItem is custom").toLooseEqual(customValue);
    expect(list.visibleItems.length).toLooseEqual(4);
    expect(list.visibleItems[0].id).toLooseEqual(customValue);

    settings.dropdownSaveOnOutsideClick = false;
  });

  test("ocused item is not selected on blur, settings.dropdownSaveOnOutsideClick = false", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "q1",
        searchEnabled: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    dropdownListModel.inputStringRendered = "item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before blur").toLooseEqual(undefined);
    expect(list.visibleItems.length).toLooseEqual(3);

    dropdownListModel.onBlur({ target: null, relatedTarget: document.createElement("div"), stopPropagation: () => { } });

    expect(question.value, "value empty after blur").toLooseEqual(undefined);
    expect(list.visibleItems.length).toLooseEqual(3);
  });

  test("auto-select focused item on blur, settings.dropdownSaveOnOutsideClick = true", () => {
    settings.dropdownSaveOnOutsideClick = true;

    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "q1",
        searchEnabled: true,
        choices: ["item1", "item2", "item3"]
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
    const customValue = "item1";

    dropdownListModel.inputStringRendered = "item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();

    expect(question.value, "value empty before blur").toLooseEqual(undefined);
    expect(list.visibleItems.length).toLooseEqual(3);

    dropdownListModel.onBlur({ target: null, relatedTarget: document.createElement("div"), stopPropagation: () => { } });

    expect(question.value, "focused item is selected on blur").toLooseEqual(customValue);
    expect(question.selectedItem?.value, "selectedItem is focused item").toLooseEqual(customValue);
    expect(list.visibleItems.length).toLooseEqual(3);

    settings.dropdownSaveOnOutsideClick = false;
  });
  test("Test createCustomChoiceText property, Issue#11041", () => {

    const survey = new SurveyModel({
      elements: [{
        type: "dropdown",
        name: "q1",
        searchEnabled: true,
        allowCustomChoices: true,
        choices: ["item1", "item2", "item3"],
        createCustomChoiceText: "Add \"{0}\" as a new"
      }]
    });
    const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
    const dropdownListModel = question.dropdownListModel;
    const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;

    dropdownListModel.inputStringRendered = "new Item";
    dropdownListModel.popupModel.show();
    list.flushUpdates();
    expect(dropdownListModel.customItemValue.text, "customItemValue is set correctly").toLooseEqual("Add \"new Item\" as a new");

  });
});

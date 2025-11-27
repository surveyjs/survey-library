import { SurveyModel } from "../src/survey";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { ListModel } from "../src/list";
import { createListContainerHtmlElement } from "./utilstests";
import { Question } from "../src/question";
import { settings } from "../src/settings";
import { Serializer } from "../src/jsonobject";
import { PopupBaseViewModel } from "../src/popup-view-model";
import { PopupDropdownViewModel } from "../src/popup-dropdown-view-model";
import { PopupModalViewModel } from "../src/popup-modal-view-model";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { IAction } from "../src/actions/action";
import { _setIsTouch } from "../src/utils/devices";

export default QUnit.module("Dropdown question");

QUnit.test("Test dropdown choicesMax choicesMin properties", function (assert) {
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

  assert.equal(question.choicesMin, 1, "choicesMin is ok");
  assert.equal(question.choicesMax, 115, "choicesMax is ok");
  assert.equal(question.visibleChoices.length, 115, "visibleChoices is ok");
});

QUnit.test("check dropdown disabled class", function (assert) {
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
  assert.ok(question.getControlClass().indexOf("sv_q_dropdown_disabled") == -1);
  question.readOnly = true;
  assert.ok(question.getControlClass().indexOf("sv_q_dropdown_disabled") != -1);
});

QUnit.test("DropdownListModel with ListModel", (assert) => {
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
  assert.ok(question.popupModel.contentComponentData.model instanceof ListModel);
});

QUnit.test("Test dropdown renderAs select", assert => {
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

  assert.ok(!!question.popupModel);
  assert.ok(question.popupModel.contentComponentData.model instanceof ListModel);

  const listModel = question.popupModel.contentComponentData.model as ListModel;
  assert.equal(listModel.showFilter, false);
  assert.equal(question.dropdownListModel.searchEnabled, true);
});

QUnit.test("Test dropdown renderAs select searchEnabled property", assert => {
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
  assert.equal(listModel.showFilter, false);
  assert.equal(question.dropdownListModel.searchEnabled, false);

  question.searchEnabled = true;
  assert.equal(listModel.showFilter, false);
  assert.equal(question.dropdownListModel.searchEnabled, true);
});

QUnit.test("add placeholder & allowClear", assert => {
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

  assert.equal(question.placeholder, "Select...");
  assert.ok(question.allowClear === true);

  assert.deepEqual(question.toJSON(), {
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

  assert.deepEqual(question.toJSON(), {
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

QUnit.test("deserialize showOptionsCaption & placeholder to placeholder & allowClear", assert => {
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

  assert.equal(question.placeholder, "New placeholder");
  assert.equal(question.placeholder, "New placeholder");

  assert.ok(question.showOptionsCaption === false);
  assert.ok(question.allowClear === false);

  assert.deepEqual(question.toJSON(), {
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

QUnit.test("question.showClearButton", assert => {
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
  assert.equal(q.showClearButton, false, "question is empty");
  q.value = "Ford";
  assert.equal(q.showClearButton, true, "question is not empty");
  q.allowClear = false;
  assert.equal(q.showClearButton, false, "allowClear is false");
  q.allowClear = true;
  survey.setDesignMode(true);

  assert.equal(q.showClearButton, true, "Creator V2");
});

QUnit.test("ListModel localization", assert => {
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
  assert.equal(listModel.filterStringPlaceholder, "Type to search...", "filtered text in en");
  survey.locale = "de";
  assert.equal(listModel.filterStringPlaceholder, "Tippen Sie, um zu suchen...", "filtered text in de");
  survey.locale = "";
});
QUnit.test("survey.onTextMarkdown, options.item #9601", assert => {
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
  assert.equal(question.choices[0].locText.textOrHtml, "Item 1_Item 1", "choices[0]");
  assert.equal(question.choices[1].locText.textOrHtml, "Item 2_Item 2", "choices[1]");
  assert.equal(question.choices[2].locText.textOrHtml, "Item 3_Item 3", "choices[2]");
  assert.deepEqual(itemsValues, [1, 2, 3]);
});
QUnit.test("readOnlyText visibleChoices changed", assert => {
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
  assert.equal(q2.readOnlyText, "Item 1", "readOnlyText");
  assert.equal(q2.selectedItem.id, "Item 1", "selectedItem.id");
});
QUnit.test("readOnlyText render as select", assert => {
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
  assert.equal(question.readOnlyText, "click", "use place-holder");
  question.value = "other";
  assert.equal(question.readOnlyText, "Other (describe)", "use other");
  question.value = 2;
  assert.equal(question.readOnlyText, "item 2", "use choice text");
  question.value = "none";
  assert.equal(question.readOnlyText, "None", "use none text");
  question.clearValue();
  assert.equal(question.readOnlyText, "click", "use placeholder");
  question.placeholder = "Placeholder test";
  assert.equal(question.readOnlyText, "Placeholder test", "use placeholder");
});
QUnit.test("readOnlyText on changing locale", assert => {
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
  assert.equal(question.readOnlyText, "Select...", "english locale");
  survey.locale = "de";
  assert.equal(question.readOnlyText, "Bitte auswählen...", "de locale"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
  survey.locale = "";
  assert.equal(new QuestionDropdownModel("q1").readOnlyText, "Select...", "English by default");
});
QUnit.test("inputFieldComponent", assert => {
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
  assert.equal(question.itemComponent, itemTemplate);
  assert.equal(question.inputFieldComponent, undefined);
  assert.equal(question.inputFieldComponentName, itemTemplate);

  question.inputFieldComponent = newInputFieldComponent;
  assert.equal(question.itemComponent, itemTemplate);
  assert.equal(question.inputFieldComponent, newInputFieldComponent);
  assert.equal(question.inputFieldComponentName, newInputFieldComponent);
});
QUnit.test("showSelectedItemLocText", assert => {
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
  assert.equal(question.showSelectedItemLocText, false, "#1");

  question.value = 1;
  assert.equal(question.showSelectedItemLocText, true, "#2");

  question.itemComponent = "my-item";
  assert.equal(question.showSelectedItemLocText, false, "#3");
});
QUnit.test("selectedItemLocText, showOtherItem & storeOthersAsComment=false, Bug#3800", assert => {
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
  assert.equal(question.showSelectedItemLocText, true);

  assert.equal(question.selectedItem.value, "other");
  assert.equal(question.selectedItemLocText.renderedHtml, "Other (describe)");
  question.value = 3;
  assert.equal(question.selectedItem.value, "3");
  assert.equal(question.selectedItemLocText.renderedHtml, "3");
});
QUnit.test("showInputFieldComponent", assert => {
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
  assert.equal(question.showInputFieldComponent, false);

  question.itemComponent = "my-item";
  assert.equal(question.showInputFieldComponent, false);

  question.value = 1;
  assert.equal(question.showInputFieldComponent, true);
});
QUnit.test("clearValue", assert => {
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

  assert.equal(question.value, undefined, "init");
  assert.equal(dropdownListModel.filterString, "", "init");
  assert.equal(dropdownListModel.inputStringRendered, "", "init");
  assert.equal(dropdownListModel.hintString, "", "init");

  question.value = 2;
  dropdownListModel.inputStringRendered = "i";

  assert.equal(question.value, 2);
  assert.equal(dropdownListModel.filterString, "i");
  assert.equal(dropdownListModel.inputStringRendered, "i");
  assert.equal(dropdownListModel.hintString, "item 2");

  question.clearValue();

  assert.equal(question.value, undefined, "after clear");
  assert.equal(dropdownListModel.filterString, "", "after clear");
  assert.equal(dropdownListModel.inputStringRendered, "", "after clear");
  assert.equal(dropdownListModel.hintString, "", "after clear");
});

QUnit.test("Dropdown doesn't displays a value which doesn't exist in a list of choices", (assert) => {
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
  assert.equal(question.value, "value1");
  assert.equal(question.selectedItem, null);
  assert.deepEqual(survey.data, {
    "question1": "value1",
  });
});

QUnit.test("Dropdown displays a value as Other if it doesn't exist in a list of choices", (assert) => {
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
  assert.equal(question.value, "other");
  assert.equal(question.selectedItem.id, "other");
  assert.deepEqual(survey.data, {
    "question1": "value1",
    "question1-Comment": "value1"
  });
});

QUnit.test("Dropdown displays a value if list of choices is empty", (assert) => {
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
  assert.equal(question.value, "Item 1");
  assert.equal(question.selectedItem.id, "Item 1");

  question.setPropertyValue("visibleChoices", []);
  assert.equal(question.value, "Item 1");
  assert.equal(question.selectedItem, null);
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

QUnit.test("lazy loading: first loading", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opt);
  assert.equal(question.choices.length, 30);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[29].value, 30);
});

QUnit.test("lazy loading: first loading - default value", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  question.dropdownListModel.popupModel.show();
  question.dropdownListModel.changeSelectionWithKeyboard(false);
  doneCallback(opt);
  assert.equal(question.choices.length, 30);
  assert.equal(question.dropdownListModel.inputStringRendered, "1");
});

QUnit.test("lazy loading: several loading", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);

  question.dropdownListModel["updateQuestionChoices"]();
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 50);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[49].value, 50);

  question.dropdownListModel["updateQuestionChoices"]();
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 55);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[54].value, 55);
});

QUnit.test("lazy loading + change filter string + dropdownSearchDelay", assert => {
  const newValueDebouncedInputValue = 2 * onChoicesLazyLoadCallbackTimeOut;
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const done4 = assert.async();

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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  assert.equal(question.choices.length, 0, "show popup before request");

  setTimeout(() => {
    assert.equal(question.choices.length, 25, "show popup after request");
    assert.equal(question.choices[0].value, 1, "show popup after request");

    settings.dropdownSearchDelay = newValueDebouncedInputValue;
    question.dropdownListModel.filterString = "2";
    setTimeout(() => {
      assert.equal(question.choices.length, 25, "filter is 2");
      assert.equal(question.choices[0].value, 1, "filter is 2");

      settings.dropdownSearchDelay = newValueDebouncedInputValue;
      question.dropdownListModel.filterString = "22";
      setTimeout(() => {
        assert.equal(question.choices.length, 25, "filter is 22 before request");
        assert.equal(question.choices[0].value, 1, "filter is 22 before request");

        setTimeout(() => {
          assert.equal(question.choices.length, 25, "filter is 22 after request");
          assert.equal(question.choices[0].value, 22, "filter is 22 after request");

          settings.dropdownSearchDelay = 0;
          done4();
        }, onChoicesLazyLoadCallbackTimeOut + newValueDebouncedInputValue);
        done3();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("The onGetChoiceDisplayValue callback fires multiple times, #6078", assert => {
  let requestCount = 0;
  let responseCount = 0;
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
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
  assert.equal(requestCount, 0, "requestCount #1");
  assert.equal(responseCount, 0, "responseCount #1");

  assert.equal(question.showSelectedItemLocText, true, "showSelectedItemLocText");
  assert.equal(requestCount, 1, "requestCount #2");
  assert.equal(responseCount, 0, "responseCount #2");

  setTimeout(() => {
    assert.equal(requestCount, 1, "requestCount #2.1");
    assert.equal(responseCount <= 1, true, "responseCount #2.1");
    assert.equal(["2", "DisplayText_2"].indexOf(question.selectedItemLocText.calculatedText) > -1, true, "calculatedText #2.1");

    setTimeout(() => {
      assert.equal(requestCount, 1, "requestCount #3");
      assert.equal(responseCount, 1, "responseCount #3");

      setTimeout(() => {
        assert.equal(requestCount, 1, "requestCount #3.1");
        assert.equal(responseCount, 1, "responseCount #3.1");
        assert.equal(question.selectedItemLocText.calculatedText, "DisplayText_2");
        assert.equal(question.selectedItem.locText.calculatedText, "DisplayText_2", "locText.calculatedText");
        assert.equal(question.displayValue, "DisplayText_2", "question.displayValue");

        done3();
      }, onGetChoiceDisplayValueCallbackTimeOut + 2 * callbackTimeOutDelta);
      done2();
    }, onGetChoiceDisplayValueCallbackTimeOut / 2);
    done1();
  }, callbackTimeOutDelta);
});
QUnit.test("storeOthersAsComment is false", assert => {
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
  assert.equal(question.visibleChoices.length, 1);
  assert.equal(question.visibleChoices[0].id, "other");
  assert.equal(question.visibleChoices[0].value, "other");

  question.renderedValue = "other";
  assert.deepEqual(question.value, "other", "#1");
  question.otherValue = "text1";
  assert.deepEqual(question.value, "text1", "#2");
  assert.deepEqual(survey.data, { q1: "text1" }, "#3");
});

QUnit.test("lazy loading: storeOthersAsComment is false", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.visibleChoices.length, 1);
  assert.equal(question.visibleChoices[0].id, "other");
  assert.equal(question.visibleChoices[0].value, "other");

  question.dropdownListModel.popupModel.show();
  doneCallback(opt);
  assert.equal(question.visibleChoices.length, 56);
  assert.equal(question.visibleChoices[0].value, 1);
  assert.equal(question.visibleChoices[54].value, 55);
  assert.equal(question.visibleChoices[55].id, "other");
  assert.equal(question.visibleChoices[55].value, "other");

  question.renderedValue = "other";
  assert.deepEqual(question.value, "other", "#1");
  question.otherValue = "text1";
  assert.deepEqual(question.value, "text1", "#2");
  assert.deepEqual(survey.data, { q1: "text1" }, "#3");
});

QUnit.test("itemsSettings property", assert => {
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
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);
  assert.equal(listModel.actions.length, 0, "listModel.actions");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);

  assert.equal(listModel.actions.length, 26, "listModel.actions");
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);

  question.dropdownListModel.popupModel.hide();

  assert.equal(listModel.actions.length, 26, "listModel.actions");
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);

  question.dropdownListModel.popupModel.show();
  assert.equal(listModel.actions.length, 0, "listModel.actions");
});
QUnit.test("rendering actions id", assert => {
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
  assert.equal(actions.length, 2, "two actions");
  assert.equal((<IAction>actions[0]).elementId, "el1i_listItem1", "elementId, action1");
  assert.equal((<IAction>actions[1]).elementId, "el1i_listItem2", "elementId, action2");
  assert.equal((<IAction>actions[0]).disableTabStop, true, "disableTabStop, action1");
  assert.equal((<IAction>actions[1]).disableTabStop, true, "disableTabStop, action2");
});

QUnit.test("Test dropdown choices change should update strings", function (assert) {
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

  assert.equal(question.readOnlyText, "Select...", "readOnlyText #1");
  question.value = "i3";
  assert.equal(question.readOnlyText, "Select...", "readOnlyText #2");
  question.choices = ["i1", "i2", "i3"];
  assert.equal(question.readOnlyText, "i3", "readOnlyText #3");
});

QUnit.test("Test update readOnlyText after onGetChoiceDisplayValue", function (assert) {
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

  assert.equal(question.value, "FRA");
  assert.equal(question.selectedItem.value, "FRA");
  assert.equal(question.selectedItem.text, "France");
  assert.equal(question.readOnlyText, "France", "readOnlyText");
});

QUnit.test("min page size", assert => {
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
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);
  assert.equal(listModel.actions.length, 0, "listModel.actions");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(listModel.actions.length, 26, "listModel.actions");
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);
});

QUnit.test("selectedItem until all data is loaded", assert => {
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

  assert.equal(listModel.actions.length, 0, "listModel.actions");
  assert.equal(question.selectedItem, null);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 30);
  assert.equal(listModel.actions.length, 31, "listModel.actions");

  question.dropdownListModel["updateQuestionChoices"]();
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 55);
  assert.equal(listModel.actions.length, 55, "listModel.actions");
  assert.equal(question.choices[54].value, 55);

  question.value = question.choices[54].value;
  assert.equal(question.selectedItem.value, 55);

  question.dropdownListModel.popupModel.hide();
  question.dropdownListModel.popupModel.show();
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 30);
  assert.equal(listModel.actions.length, 31, "listModel.actions");
  assert.equal(question.selectedItem.value, 55);

  question.clearValue();
  assert.equal(question.selectedItem, null);
});
function getObjectArray(skip = 1, count = 25): Array<{value: number, text: string}> {
  const result:Array<{value: number, text: string}> = [];
  for (let index = skip; index < (skip + count); index++) {
    result.push({ value: index, text: "DisplayText_" + index });
  }
  return result;
}

QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(question.value, 55);
  assert.equal(question.selectedItem.value, 55);
  assert.equal(question.selectedItem.text, "DisplayText_55");
  assert.equal(questionTitle.locTitle.textOrHtml, "DisplayText_55", "display text is correct");

  question.dropdownListModel.popupModel.show();
  doCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(question.value, 55);
  assert.equal(question.selectedItem.value, 55);
  assert.equal(question.selectedItem.text, "DisplayText_55");
});
QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue & custom property", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(question.value, 55);
  assert.equal(question.selectedItem.value, 55);
  assert.equal(question.selectedItem.text, "DisplayText_55");
  assert.equal(question.selectedItem.customProp, "customProp_55");
  assert.equal(questionTitle.locTitle.textOrHtml, "DisplayText_55", "display text is correct");
  Serializer.removeProperty("itemvalue", "customProp");
});
QUnit.test("lazy loading + onGetChoiceDisplayValue, selected last item", assert => {
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
  assert.equal(question.choices.length, 0);
  assert.equal(question.value, undefined);
  assert.equal(question.selectedItem, undefined);

  question.dropdownListModel.popupModel.show();
  question.value = 54;
  assert.equal(question.choices.length, 30);
  assert.equal(question.value, 54);
  assert.equal(question.selectedItem.locText.calculatedText, "DisplayText_54");
});

QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue is object", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(question.value.id, 55);
  assert.equal(question.selectedItem.value.id, 55);
  assert.equal(question.selectedItem.text, "DisplayText_55");
  question.dropdownListModel.onFocus(null);
  assert.equal(question.dropdownListModel.inputString, "DisplayText_55");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(question.value.id, 55);
  assert.equal(question.selectedItem.value.id, 55);
  assert.equal(question.selectedItem.text, "DisplayText_55", "selectedItem.text");
  assert.equal(question.displayValue, "DisplayText_55", "displayValue");
  assert.equal(question.dropdownListModel.inputString, "DisplayText_55");
});

QUnit.test("lazy loading + onGetChoiceDisplayValue: set survey data", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(question.value, 55);
  assert.equal(question.selectedItem.value, 55);
  assert.equal(question.selectedItem.text, "DisplayText_55");

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(question.value, 55);
  assert.equal(question.selectedItem.value, 55);
  assert.equal(question.selectedItem.text, "DisplayText_55");
});

QUnit.test("lazy loading data is lost: defaultValue", assert => {
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

  assert.deepEqual(survey.data, { "q1": 55 }, "before doComplete before item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": 55 }, "after doComplete before item load");

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.choices.length, 0);
  assert.equal(question.value, 55);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.value, 55);

  assert.deepEqual(survey.data, { "q1": 55 }, "before doComplete after item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": 55 }, "after doComplete after item load");
});

QUnit.test("lazy loading data is lost: set survey data", assert => {
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
  assert.deepEqual(survey.data, { "q1": 55 }, "before doComplete before item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": 55 }, "after doComplete before item load");

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.choices.length, 0);
  assert.equal(question.value, 55);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.value, 55);

  assert.deepEqual(survey.data, { "q1": 55 }, "before doComplete after item load");
  survey.doComplete();
  assert.deepEqual(survey.data, { "q1": 55 }, "after doComplete after item load");
});

QUnit.test("lazy loading + change filter string", assert => {
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

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);

  question.dropdownListModel.filterString = "2";
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 2);
  assert.equal(question.choices[24].value, 123);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);

  question.dropdownListModel.filterString = "22";
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 22);
  assert.equal(question.choices[24].value, 1223);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);
});

QUnit.test("lazy loading + change listModel filter string", assert => {
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

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);

  listModel.filterString = "2";
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 2);
  assert.equal(question.choices[24].value, 123);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);

  listModel.filterString = "22";
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 22);
  assert.equal(question.choices[24].value, 1223);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);
});

QUnit.test("show comment and show other together", assert => {
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
  assert.equal(question.showOtherItem, true, "showOtherItem is true");
  assert.equal(question.showCommentArea, true, "showCommentArea is true");
  assert.equal(question.getStoreOthersAsComment(), false, "we have show comment");
  question.showCommentArea = false;
  assert.equal(question.getStoreOthersAsComment(), true, "show comment is hidden");
  question.showCommentArea = true;
  assert.equal(question.getStoreOthersAsComment(), false, "show comment again");
});

QUnit.test("ItemValue: check action fields", assert => {
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
  assert.equal(question.visibleChoices[0].component, "custom-component");
  assert.equal(question.visibleChoices[0].locTitle.text, "Item 1");
  assert.equal(question.visibleChoices[0].title, "Item 1");
  assert.equal(question.visibleChoices[0].id, "Item1");
  assert.equal(question.visibleChoices[0].data, undefined);
  assert.equal(question.visibleChoices[0].visible, true);
  question.visibleChoices[0].setIsVisible(false);
  assert.equal(question.visibleChoices[0].visible, false);
  assert.equal(question.visibleChoices[0].enabled, true);
  question.visibleChoices[0].setIsEnabled(false);
  assert.equal(question.visibleChoices[0].enabled, false);
  assert.equal(question.visibleChoices[0].selected, true);
  assert.equal(question.visibleChoices[1].selected, false);
  question.value = "Item2";
  assert.equal(question.visibleChoices[0].selected, false);
  assert.equal(question.visibleChoices[1].selected, true);
});

QUnit.test("lazy loading placeholder", assert => {

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
  assert.equal(list.actions.length, 0);
  assert.equal(list.emptyMessage, "Loading...");
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doCallback(opts[0]);
  assert.equal(list.actions.length, 0);
  assert.equal(list.emptyMessage, "No data to display");
  assert.equal(question.choices.length, 0);
});

QUnit.test("isReady flag + onGetChoiceDisplayValue", assert => {
  const done = assert.async();

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
      assert.ok(question.isReady);
      assert.ok(question.isReady);
      assert.notOk(question["waitingChoicesByURL"]);
      assert.notOk(question["waitingGetChoiceDisplayValueResponse"]);
      assert.equal(log, "->onReadyChanged: false->onGetChoiceDisplayValue->onReadyChanged: true");
      assert.equal(question.displayValue, "Ford");
      done();
    }
  });
  survey.data = { "q1": "ford" };
  assert.notOk(question.isReady);
  assert.notOk(question["waitingChoicesByURL"]);
  assert.ok(question["waitingGetChoiceDisplayValueResponse"]);
});

QUnit.test("isReady flag + onGetChoiceDisplayValue + setItems with empty array", assert => {
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
  assert.ok(question.isReady);
  assert.equal(question.displayValue, "ford");
});

QUnit.test("isReady flag + onGetChoiceDisplayValue + choicesRestfull", assert => {
  const done = assert.async();

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
      assert.ok(question.isReady);
      assert.notOk(question["waitingChoicesByURL"]);
      assert.notOk(question["waitingGetChoiceDisplayValueResponse"]);
      assert.equal(log, "->onReadyChanged: false->onGetChoiceDisplayValue->onReadyChanged: true");
      done();
    }
  });
  question.choicesByUrl.url = "some url";
  survey.data = { "q1": "ford" };
  assert.notOk(question.isReady);
  assert.ok(question["waitingChoicesByURL"]);
  assert.ok(question["waitingGetChoiceDisplayValueResponse"]);
  question.choicesLoaded();
  assert.notOk(question.isReady);
  assert.notOk(question["waitingChoicesByURL"]);
  assert.ok(question["waitingGetChoiceDisplayValueResponse"]);
});
QUnit.test("isReady flag + there is no onChoicesLazyLoad & onGetChoiceDisplayValue, Bug#10642", assert => {
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
  assert.ok(question.isReady, "There is no onGetChoiceDisplayValue, isReady = true");
  assert.equal(question.displayValue, "ford", "displayValue is correct");
});
QUnit.test("lazy loading: change choicesLazyLoadEnabled on runtime", assert => {
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
  assert.equal(question.choicesLazyLoadEnabled, false);
  assert.equal(question.choices.length, 0);

  question.choicesLazyLoadEnabled = true;
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(question.dropdownListModel["listModel"].visibleItems.length, 0, "#1");

  question.dropdownListModel.popupModel.show();
  assert.equal(question.choices.length, 15);
  assert.equal(question.dropdownListModel["listModel"].visibleItems.length, 16, "#2");
  assert.equal(question.dropdownListModel["listModel"].visibleItems[15].id, "loadingIndicator");

  question.dropdownListModel.filterString = "des";
  assert.equal(question.choices.length, 5);
  assert.equal(question.dropdownListModel["listModel"].visibleItems.length, 6, "#3");
  assert.equal(question.dropdownListModel["listModel"].visibleItems[5].id, "loadingIndicator");
});
QUnit.test("lazy loading: duplication of elements after blur", assert => {
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

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0, "question.choices.length #0");
  question.dropdownListModel.popupModel.show();
  question.dropdownListModel.changeSelectionWithKeyboard(false);
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25, "question.choices.length #1");
  assert.equal(question.dropdownListModel.inputStringRendered, "", "question.dropdownListModel.inputStringRendered #1");
  assert.equal(itemsSettings.skip, 25, "skip #1");
  assert.equal(itemsSettings.take, 25, "take #1");
  assert.equal(itemsSettings.totalCount, 55, "totalCount #1");
  assert.equal(itemsSettings.items.length, 25, "items.length #1");
  question.dropdownListModel.inputStringRendered = "11";
  doneCallback(opts[1]);

  assert.equal(question.choices.length, 25, "question.choices.length #2");
  assert.equal(question.dropdownListModel.inputStringRendered, "11", "question.dropdownListModel.inputStringRendered #2");
  assert.equal(itemsSettings.skip, 25, "skip #2");
  assert.equal(itemsSettings.take, 25, "take #2");
  assert.equal(itemsSettings.totalCount, 55, "totalCount #2");
  assert.equal(itemsSettings.items.length, 25, "items.length #2");
  question.dropdownListModel.onBlur({
    keyCode: 0,
    preventDefault: () => { },
    stopPropagation: () => { }
  });

  assert.equal(question.value, undefined);
  assert.equal(question.choices.length, 25, "question.choices.length #3");
  assert.equal(question.dropdownListModel.inputStringRendered, "", "question.dropdownListModel.inputStringRendered #3");
  assert.equal(itemsSettings.skip, 0, "skip #3");
  assert.equal(itemsSettings.take, 25, "take #3");
  assert.equal(itemsSettings.totalCount, 0, "totalCount #3");
  assert.equal(itemsSettings.items.length, 0, "items.length #3");
  question.dropdownListModel.popupModel.show();

  doneCallback(opts[2]);
  assert.equal(question.choices.length, 25, "question.choices.length #4");
  assert.equal(question.dropdownListModel.inputStringRendered, "", "question.dropdownListModel.inputStringRendered #4");
});
QUnit.test("lazy loading: check onChoicesLazyLoad callback count", assert => {
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

  assert.equal(callbackCount, 0);
  question.dropdownListModel.popupModel.show();
  question.dropdownListModel.changeSelectionWithKeyboard(false);
  doCallback(opts[0]);
  assert.equal(callbackCount, 1);
  question.dropdownListModel.inputStringRendered = "11";

  doCallback(opts[1]);
  assert.equal(callbackCount, 2);
  question.dropdownListModel.onBlur({
    keyCode: 0,
    preventDefault: () => { },
    stopPropagation: () => { }
  });

  assert.equal(callbackCount, 2);
  question.dropdownListModel.popupModel.show();

  doCallback(opts[2]);
});

QUnit.test("Test dropdown string localization", function (assert) {
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
  assert.equal(listModel.filterStringPlaceholder, "Tippen Sie, um zu suchen...", "filterStringPlaceholder");
  assert.equal(listModel.emptyMessage, "Es gibt noch keine Daten.", "emptyMessage");
  assert.equal(listModel.loadingIndicator.title, "Wird hochgeladen...", "loadingText");

  let popupViewModel: PopupBaseViewModel = new PopupDropdownViewModel(q1.dropdownListModel.popupModel);
  assert.equal(popupViewModel.cancelButtonText, "Abbrechen", "cancelButtonText");

  popupViewModel = new PopupModalViewModel(q1.dropdownListModel.popupModel);
  assert.equal((popupViewModel as PopupModalViewModel).applyButtonText, "Anwenden", "applyButtonText");
});

QUnit.test("Dropdown choicesLazyLoadEnabled into matrixdynamic", function (assert) {
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

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 5);
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);

  question.dropdownListModel.popupModel.show();
  doneCallback(opts[0]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 1);
  assert.equal(question.choices[24].value, 25);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);

  listModel.filterString = "2";
  doneCallback(opts[1]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 2);
  assert.equal(question.choices[24].value, 123);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);

  listModel.filterString = "22";
  doneCallback(opts[2]);
  assert.equal(question.choices.length, 25);
  assert.equal(question.choices[0].value, 22);
  assert.equal(question.choices[24].value, 1223);
  assert.equal(itemsSettings.skip, 25);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 55);
  assert.equal(itemsSettings.items.length, 25);
});

QUnit.test("Rapidly Changing Search Filter", (assert) => {
  const newValueDebouncedInputValue = 2 * onChoicesLazyLoadCallbackTimeOut;

  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const done4 = assert.async();
  let filterValue = "";
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

  filterValue = "1";
  settings.dropdownSearchDelay = newValueDebouncedInputValue;
  dropdownListModel.inputStringRendered = filterValue;
  setTimeout(() => {
    assert.equal(question.choices.length, 0);
    assert.equal(filterValueLog, "", "filter value 1");

    filterValue += "2";
    settings.dropdownSearchDelay = newValueDebouncedInputValue;
    dropdownListModel.inputStringRendered = filterValue;
    setTimeout(() => {
      assert.equal(question.choices.length, 0);
      assert.equal(filterValueLog, "", "filter value 12");

      filterValue += "3";
      settings.dropdownSearchDelay = newValueDebouncedInputValue;
      dropdownListModel.inputStringRendered = filterValue;
      setTimeout(() => {
        assert.equal(filterValueLog, "123->", "filter value 123 #1");
        assert.equal(question.choices.length, 0);

        setTimeout(() => {
          assert.equal(filterValueLog, "123->", "filter value 123 #2");
          assert.equal(question.choices.length, 25);

          settings.dropdownSearchDelay = 0;
          done4();
        }, callbackTimeOutDelta + onChoicesLazyLoadCallbackTimeOut);
        done3();
      }, callbackTimeOutDelta + newValueDebouncedInputValue);
      done2();
    }, callbackTimeOutDelta);
    done1();
  }, callbackTimeOutDelta);
});

QUnit.test("Dropdown with Lazy Loading - A list of items display duplicate entries #9111", assert => {
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

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(question.choices.length, 0, "question.choices.length #1");
  assert.equal(itemsSettings.items.length, 0, "itemsSettings.items.length #1");

  question.dropdownListModel.popupModel.show();
  doCallback(opts[0]);
  assert.equal(question.choices.length, 5, "question.choices.length #2");

  question.dropdownListModel.filterString = "22";
  doCallback(opts[1]);
  assert.equal(question.choices.length, 5, "question.choices.length #3");

  question.dropdownListModel.filterString = "2";
  doCallback(opts[2]);
  assert.equal(question.choices.length, 5, "question.choices.length #4");

  question.dropdownListModel.filterString = "";
  doCallback(opts[3]);
  assert.equal(question.choices.length, 5, "question.choices.length #5");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: false", function (assert) {
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

  assert.equal(dropdownListModel.allowCustomChoices, false, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, "", "#1 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");

  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, false, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#2 popupModel.isVisible");
  assert.equal(listModel.isEmpty, true, "#2 listModel is empty");
  assert.equal(listModel.actions.length, 4, "#2 listModel.actions");
  assert.equal(listModel.focusedItem, undefined, "#2 focusedItem");

  question.allowCustomChoices = true;
  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#3 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue, "#3 customValue");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#3 popupModel.isVisible");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#3 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item10\" item...", "#3 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#3 custom item visible");
  assert.equal(listModel.focusedItem.id, "newCustomItem", "#3 focusedItem");

  dropdownListModel.inputStringRendered = testExistValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#4 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#4 popupModel.isVisible");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#4 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#4 custom item invisible");
  assert.equal(listModel.focusedItem.id, "item2", "#4 focusedItem");

  dropdownListModel.inputStringRendered = testExistValue + "test";
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#5 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#5 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#5 custom item visible");
  assert.equal(listModel.focusedItem.id, "newCustomItem", "#5 focusedItem");

  dropdownListModel.popupModel.hide();
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#6 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(dropdownListModel.popupModel.isVisible, false, "#6 popupModel.isVisible");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#6 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#6 custom item invisible");
});

QUnit.test("allowCustomChoices: Add custom value if searchEnabled: false", function (assert) {
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
  assert.equal(listModel.actions.length, 5, "#1 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[4].visible, true, "#1 custom item visible");
  assert.equal(question.value, undefined, "#1 question.value");
  assert.equal(question.selectedItem, undefined, "#1 question.selectedItem");
  assert.equal(question.visibleChoices.length, 4, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 6, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[5].visible, false, "#2 custom item invisible");
  assert.equal(question.value, testCustomValue, "#2 question.value");
  assert.equal(question.selectedItem.id, testCustomValue, "#2 question.selectedItem");
  assert.equal(question.visibleChoices.length, 5, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#3 survey.data");

});

QUnit.test("allowCustomChoices: inputStringRendered isn't reset after backspace, if searchEnabled: false", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, true, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue1, "#1 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#1 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#1 hintStringSuffix");

  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.allowCustomChoices, true, "#2 allowCustomChoices");
  assert.ok(dropdownListModel.customValue, "#2 customValue not empty");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#2 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#2 hintStringSuffix");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value if searchEnabled: true", function (assert) {
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

  assert.equal(dropdownListModel.allowCustomChoices, false, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, "", "#1 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");

  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, false, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.isEmpty, true, "#2 listModel is empty");
  assert.equal(listModel.actions.length, 4, "#2 listModel.actions");

  question.allowCustomChoices = true;
  dropdownListModel.inputStringRendered = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#3 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue, "#3 customValue");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#3 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item10\" item...", "#3 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#3 custom item visible");

  dropdownListModel.inputStringRendered = testExistValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#4 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#4 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#4 custom item invisible");

  dropdownListModel.inputStringRendered = testExistValue + "test";
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#5 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#5 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#5 custom item visible");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");

  dropdownListModel.popupModel.hide();
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#6 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#6 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#6 custom item invisible");
});

QUnit.test("allowCustomChoices: Add custom value if searchEnabled: true", function (assert) {
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
  assert.equal(listModel.actions.length, 5, "#1 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[4].visible, true, "#1 custom item visible");
  assert.equal(question.value, undefined, "#1 question.value");
  assert.equal(question.selectedItem, undefined, "#1 question.selectedItem");
  assert.equal(question.visibleChoices.length, 4, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 6, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[5].visible, false, "#2 custom item invisible");
  assert.equal(question.value, testCustomValue, "#2 question.value");
  assert.equal(question.selectedItem.id, testCustomValue, "#2 question.selectedItem");
  assert.equal(question.visibleChoices.length, 5, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#3 survey.data");
});

QUnit.test("allowCustomChoices: hintString with custom value if searchEnabled: true", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, true, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue1, "#1 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#1 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#1 hintStringSuffix");

  dropdownListModel.inputStringRendered = testCustomValue2;
  assert.equal(dropdownListModel.allowCustomChoices, true, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue2, "#2 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#2 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#2 hintStringSuffix");

  const event = {
    keyCode: 38,
    preventDefault: () => { },
    stopPropagation: () => { }
  };

  dropdownListModel.inputStringRendered = testCustomValue3;
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue3, "#3 inputStringRendered");
  assert.equal(dropdownListModel.customValue, testCustomValue3, "#3 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#3 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "1", "#3 hintStringSuffix");

  dropdownListModel.keyHandler(event);
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue3, "#4 inputStringRendered");
  assert.equal(dropdownListModel.customValue, testCustomValue3, "#4 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#4 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#4 hintStringSuffix");

  dropdownListModel.keyHandler(event);
  listModel.onItemClick(listModel.actions[4]);
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue3, "#5 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#5 customValue");
  assert.equal(dropdownListModel.hintStringPrefix, "", "#5 hintStringPrefix");
  assert.equal(dropdownListModel.hintStringSuffix, "", "#5 hintStringSuffix");
});

QUnit.test("allowCustomChoices: Option to create item not available if item exist (case-insensitive).", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, true, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");
});

QUnit.test("allowCustomChoices: onCreateCustomChoiceItem event.", function (assert) {
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
  assert.equal(question.value, undefined, "#1 question.value");
  assert.equal(question.selectedItem, undefined, "#1 question.selectedItem");
  assert.deepEqual(survey.data, {}, "#1 survey.data");
  assert.equal(listModel.actions[4].id, "newCustomItem");

  listModel.onItemClick(listModel.actions[4]);
  assert.equal(dropdownListModel.inputStringRendered, testCustomValueUpperCase, "#2 inputStringRendered");
  assert.equal(question.value, testCustomValue, "#2 question.value");
  assert.equal(question.selectedItem.value, testCustomValue, "#2 question.selectedItem.id");
  assert.equal(question.selectedItem.text, testCustomValueUpperCase, "#2 question.selectedItem.text");
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#2 survey.data");

  dropdownListModel.inputStringRendered = testCustomValue + "1";
  assert.equal(question.value, testCustomValue, "#3 question.value");
  assert.equal(question.selectedItem.value, testCustomValue, "#3 question.selectedItem.id");
  assert.equal(question.selectedItem.text, testCustomValueUpperCase, "#3 question.selectedItem.text");
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#3 survey.data");
  assert.equal(listModel.actions[5].id, "newCustomItem");

  listModel.onItemClick(listModel.actions[5]);
  assert.equal(dropdownListModel.inputStringRendered, "", "#4 inputStringRendered");
  assert.equal(question.value, testCustomValue, "#4 question.value");
  assert.equal(question.selectedItem.value, testCustomValue, "#4 question.selectedItem.id");
  assert.equal(question.selectedItem.text, testCustomValueUpperCase, "#4 question.selectedItem.text");
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#4 survey.data");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value if choicesLazyLoadEnabled is true", function (assert) {
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
  assert.equal(dropdownListModel.allowCustomChoices, false, "#1 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, "", "#1 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 26, "#1 listModel.actions");

  dropdownListModel.inputStringRendered = testCustomValue1;
  doCallback(opts[1]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, false, "#2 allowCustomChoices");
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue1, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.isEmpty, true, "#2 listModel is empty");
  assert.equal(listModel.actions.length, 0, "#2 listModel.actions");

  question.allowCustomChoices = true;
  dropdownListModel.inputStringRendered = testCustomValue2;
  doCallback(opts[2]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#3 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testCustomValue2, "#3 customValue");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 1, "#3 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[0].title, "Create \"customItem2\" item...", "#3 custom item text");
  assert.equal(listModel.actions[0].visible, true, "#3 custom item visible");

  dropdownListModel.inputStringRendered = testExistValue;
  doCallback(opts[3]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#4 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 27, "#4 listModel.actions");
  assert.equal(listModel.actions[25].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[25].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[25].visible, false, "#4 custom item invisible");

  dropdownListModel.inputStringRendered = testExistValue + "test";
  doCallback(opts[4]);
  listModel.flushUpdates();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#5 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 1, "#5 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[0].title, "Create \"2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[0].visible, true, "#5 custom item visible");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");

  dropdownListModel.popupModel.hide();
  assert.equal(dropdownListModel.allowCustomChoices, true, "#6 allowCustomChoices");
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 1, "#6 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[0].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[0].visible, false, "#6 custom item invisible");
});

QUnit.test("allowCustomChoices: Add custom value if choicesLazyLoadEnabled is true", function (assert) {
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

  assert.equal(question.visibleChoices.length, 0);

  question.dropdownListModel.popupModel.show();
  doCallback(opts[0]);
  assert.equal(question.visibleChoices.length, 25);

  dropdownListModel.inputStringRendered = testCustomValue;
  doCallback(opts[1]);
  assert.equal(listModel.actions.length, 1, "#1 listModel.actions");
  assert.equal(listModel.actions[0].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[0].visible, true, "#1 custom item visible");
  assert.equal(question.value, undefined, "#1 question.value");
  assert.equal(question.selectedItem, undefined, "#1 question.selectedItem");
  assert.equal(question.visibleChoices.length, 0, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#1 popupModel.isVisible");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.popupModel.isVisible, false, "popupModel.isVisible false");

  question.dropdownListModel.popupModel.show();
  doCallback(opts[2]);
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 28, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[26].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[26].visible, false, "#2 custom item invisible");
  assert.equal(listModel.actions[27].id, "loadingIndicator", "#2 loadingIndicator id");
  assert.equal(listModel.actions[27].visible, true, "#2 loadingIndicator invisible");
  assert.equal(question.value, testCustomValue, "#2 question.value");
  assert.equal(question.selectedItem.id, testCustomValue, "#2 question.selectedItem");
  assert.equal(question.visibleChoices.length, 26, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { country: testCustomValue }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { country: testCustomValue }, "#3 survey.data");
});

QUnit.test("allowCustomChoices: Possibility of creating an element with custom value (mobile mode)", function (assert) {
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

  assert.equal(dropdownListModel.customValue, undefined, "#1 customValue");
  assert.equal(listModel.searchEnabled, true, "#1 listModel searchEnabled");
  assert.equal(listModel.isEmpty, false, "#1 listModel is not empty");
  assert.equal(listModel.actions.length, 4, "#1 listModel.actions");

  listModel.filterString = testCustomValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, testCustomValue, "#3 customValue");
  assert.equal(listModel.isEmpty, false, "#3 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#3 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#3 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item10\" item...", "#3 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#3 custom item visible");

  listModel.filterString = testExistValue;
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, undefined, "#4 customValue");
  assert.equal(listModel.isEmpty, false, "#4 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#4 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#4 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#4 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#4 custom item invisible");

  listModel.filterString = testExistValue + "test";
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, testExistValue + "test", "#5 customValue");
  assert.equal(listModel.isEmpty, false, "#5 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#5 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#5 custom item id");
  assert.equal(listModel.actions[4].title, "Create \"item2test\" item...", "#5 custom item text");
  assert.equal(listModel.actions[4].visible, true, "#5 custom item visible");
  assert.equal(dropdownListModel.popupModel.isVisible, true, "#5 popupModel.isVisible");

  dropdownListModel.popupModel.hide();
  listModel.flushUpdates();
  assert.equal(dropdownListModel.customValue, undefined, "#6 customValue");
  assert.equal(listModel.isEmpty, false, "#6 listModel is not empty");
  assert.equal(listModel.actions.length, 5, "#6 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#6 custom item id");
  assert.equal(listModel.actions[4].title, "newCustomItem", "#6 custom item text");
  assert.equal(listModel.actions[4].visible, false, "#6 custom item invisible");

  _setIsTouch(false);
});

QUnit.test("allowCustomChoices: Add custom value (mobile mode)", function (assert) {
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
  assert.equal(listModel.actions.length, 5, "#1 listModel.actions");
  assert.equal(listModel.actions[4].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[4].visible, true, "#1 custom item visible");
  assert.equal(question.value, undefined, "#1 question.value");
  assert.equal(question.selectedItem, undefined, "#1 question.selectedItem");
  assert.equal(question.visibleChoices.length, 4, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 6, "#2 listModel.actions");
  assert.equal(listModel.actions[0].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[0].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[5].visible, false, "#2 custom item invisible");
  assert.equal(question.value, testCustomValue, "#2 question.value");
  assert.equal(question.selectedItem.id, testCustomValue, "#2 question.selectedItem");
  assert.equal(question.visibleChoices.length, 5, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[0].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#3 survey.data");

  _setIsTouch(false);
});

QUnit.test("allowCustomChoices: Add custom value if sortOrder", function (assert) {
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
  assert.equal(listModel.actions.length, 6, "#1 listModel.actions");
  assert.equal(listModel.actions[5].id, "newCustomItem", "#1 custom item id");
  assert.equal(listModel.actions[5].visible, true, "#1 custom item visible");
  assert.equal(question.value, undefined, "#1 question.value");
  assert.equal(question.selectedItem, undefined, "#1 question.selectedItem");
  assert.equal(question.visibleChoices.length, 5, "#1 question.visibleChoices");
  assert.deepEqual(survey.data, {}, "#1 survey.data");

  listModel.onItemClick(listModel.getActionById("newCustomItem"));
  assert.equal(dropdownListModel.inputStringRendered, testCustomValue, "#2 inputStringRendered");
  assert.equal(dropdownListModel.customValue, undefined, "#2 customValue");
  assert.equal(listModel.actions.length, 7, "#2 listModel.actions");
  assert.equal(listModel.actions[2].id, testCustomValue, "#2 custom value add into list - id");
  assert.equal(listModel.actions[2].title, testCustomValue, "#2 custom value add into list - title");
  assert.equal(listModel.actions[6].id, "newCustomItem", "#2 custom item id");
  assert.equal(listModel.actions[6].visible, false, "#2 custom item invisible");
  assert.equal(question.value, testCustomValue, "#2 question.value");
  assert.equal(question.selectedItem.id, testCustomValue, "#2 question.selectedItem");
  assert.equal(question.visibleChoices.length, 6, "#2 question.visibleChoices");
  assert.equal(question.visibleChoices[2].value, testCustomValue, "#2 question.visibleChoices[0]");
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#2 survey.data");

  survey.tryComplete();
  assert.deepEqual(survey.data, { q1: testCustomValue }, "#3 survey.data");
});

QUnit.test("allowCustomChoices: custom choices from survey.data", function (assert) {
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

  assert.equal(question.value, customValue, "#1 question.value");
  assert.equal(question.selectedItem.id, customValue, "#1 question.selectedItem");
  assert.equal(question.visibleChoices.length, 8, "#1 question.visibleChoices");
  assert.equal(listModel.actions.length, 9, "listModel.actions.length");
  assert.equal(listModel.actions[0].id, customValue, "#1 new custom item");
  assert.equal(listModel.actions[0].visible, true, "#1 new custom item visible");
  assert.deepEqual(survey.data, data, "#1 survey.data");
});

QUnit.test("allowCustomChoices: choices with displayName from survey.data", function (assert) {
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

  assert.equal(question.value, value, "#1 question.value");
  assert.equal(question.selectedItem.id, value, "#1 question.selectedItem");
  assert.equal(question.selectedItem.title, "Large screen size", "#1 question.selectedItem");
  assert.equal(listModel.actions.length, 8, "listModel.actions.length");
  assert.deepEqual(survey.data, data, "#1 survey.data");
});

QUnit.test("lazy loading + isReady", assert => {
  const done = assert.async();
  const survey = new SurveyModel({ elements: [{ "type": "dropdown", "name": "q1", "choicesLazyLoadEnabled": true }] });
  survey.onChoicesLazyLoad.add((_, options) => {
    options.setItems(getNumberArray(1, 25), 25);
  });

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true, "#1");
  assert.equal(question.choices.length, 0, "#1");
  assert.equal(question.isReady, true, "#1");

  question.waitForQuestionIsReady(() => {
    assert.equal(question.choices.length, 25, "#2");
    assert.equal(question.isReady, true, "#2");
    done();
  });
});

QUnit.test("Dropdown with Lazy Loading applies additional client-side filtering to the choice list", assert => {
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
  assert.equal(list.actions.length, 0);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  doCallback(opts[0]);
  assert.equal(question.choices.length, 0);
  assert.equal(list.actions.length, 0);

  question.dropdownListModel.filterString = "fruit";
  doCallback(opts[1]);
  assert.equal(question.choices.length, 4);
  assert.equal(list.actions.length, 4);
  assert.equal(list.actions.filter(item => list.isItemVisible(item)).length, 4);
});
QUnit.test("Dropdown getInputId & getFirstInputElementId, bug#10567", assert => {
  const q: any = new QuestionDropdownModel("q1");
  assert.equal(q.getInputId(), q.id + "i_0", "getInputId #1");
  assert.equal(q.getFirstInputElementId(), q.id + "i_0", "getFirstInputElementId #1");
  q.searchEnabled = false;
  assert.equal(q.getInputId(), q.id + "i_0", "getInputId #2");
  assert.equal(q.getFirstInputElementId(), q.id + "i", "getFirstInputElementId #2");
  q.searchEnabled = true;
  assert.equal(q.getInputId(), q.id + "i_0", "getInputId #3");
  assert.equal(q.getFirstInputElementId(), q.id + "i_0", "getFirstInputElementId #3");
  q.renderAs = "select";
  assert.equal(q.getInputId(), q.id + "i", "getInputId #4");
  assert.equal(q.getFirstInputElementId(), q.id + "i", "getFirstInputElementId #4");
});
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

export default QUnit.module("Dropdown question");

QUnit.test("Test dropdown choicesMax choicesMin properties", function (assert) {
  const json = {
    questions: [
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
    questions: [
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
  const survey = new SurveyModel(jsonDropdown);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.ok(question.popupModel.contentComponentData.model instanceof ListModel);
});

QUnit.test("Test dropdown renderAs select", assert => {
  const json = {
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
    questions: [{
      type: "dropdown",
      name: "question1",
      hasOther: "true",
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
    questions: [
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

QUnit.test("deserialize showOptionsCaption & optionsCaption to placeholder & allowClear", assert => {
  const json = {
    questions: [
      {
        "type": "dropdown",
        "name": "car",
        "title": "What car are you driving?",
        "showOptionsCaption": false,
        "optionsCaption": "New optionsCaption",
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

  assert.equal(question.placeholder, "New optionsCaption");
  assert.equal(question.optionsCaption, "New optionsCaption");

  assert.ok(question.showOptionsCaption === false);
  assert.ok(question.allowClear === false);

  assert.deepEqual(question.toJSON(), {
    "name": "car",
    "title": "What car are you driving?",
    "allowClear": false,
    "placeholder": "New optionsCaption",
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
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "optionsCaption": "New optionsCaption",
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
    questions: [
      {
        "type": "dropdown",
        "name": "car",
        "title": "What car are you driving?",
        "showOptionsCaption": false,
        "optionsCaption": "New optionsCaption",
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
QUnit.test("readOnlyText default", assert => {
  const json = {
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "placeholder": "click",
        "hasOther": true,
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
  assert.equal(question.readOnlyText, "", "use other");
  question.value = "none";
  assert.equal(question.readOnlyText, "", "use none text");
  question.value = 2;
  assert.equal(question.readOnlyText, "", "use choice text");
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
  assert.equal(q2.readOnlyText, "");
  assert.equal(q2.selectedItem.id, "Item 1");
});
QUnit.test("readOnlyText render as select", assert => {
  const json = {
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "renderAs": "select",
        "placeholder": "click",
        "hasOther": true,
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
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "hasOther": true,
        "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
      }]
  };
  const survey = new SurveyModel();
  survey.setDesignMode(true);
  survey.fromJSON(json);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.readOnlyText, "Select...", "english locale");
  survey.locale = "de";
  assert.equal(question.readOnlyText, "Bitte auswählen...", "de locale");
  survey.locale = "";
  assert.equal(new QuestionDropdownModel("q1").readOnlyText, "Select...", "English by default");
});
QUnit.test("inputFieldComponent", assert => {
  const json = {
    questions: [
      {
        "type": "dropdown",
        "itemComponent": "my-item",
        "name": "q1",
        "hasOther": true,
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
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "hasOther": true,
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
QUnit.test("selectedItemLocText, hasOther & storeOthersAsComment=false, Bug#3800", assert => {
  const json = {
    storeOthersAsComment: false,
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "hasOther": true,
        "choices": [1, 2, 3],
        showOtherItem: true
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
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "hasOther": true,
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
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "hasOther": true,
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

QUnit.test("hasScroll property", assert => {
  const json = {
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "hasOther": true,
        "choices": [{ value: 1, text: "item 1" }, { value: 2, text: "item 2" }, { value: 3, text: "item 3" }]
      }]
  };
  const survey = new SurveyModel();
  survey.fromJSON(json);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const element = createListContainerHtmlElement();
  question.dropdownListModel["listModel"].initListContainerHtmlElement(element);

  assert.equal(question.dropdownListModel.hasScroll, false);

  question.dropdownListModel["listModel"].hasVerticalScroller = true;
  assert.equal(question.dropdownListModel.hasScroll, true);

  document.body.removeChild(element);
});

QUnit.test("Dropdown doesn't displays a value which doesn't exist in a list of choices", (assert) => {
  const survey = new SurveyModel({
    questions: [{
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
    questions: [{
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
    questions: [{
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
  while ((skip + result.length) < (skip + count)) {
    if (!!filter) {
      if (index.toString().toLowerCase().indexOf(filter.toLocaleLowerCase()) !== -1) {
        result.push(index);
      }
    }
    else {
      result.push(index);
    }
    index++;
  }
  return result;
}

const onChoicesLazyLoadCallbackTimeOut = 5;
const callbackTimeOutDelta = 1;

const callback = (_, opt) => {
  const total = 55;
  setTimeout(() => {
    if(opt.skip + opt.take < total) {
      opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), total);
    } else {
      opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip, opt.filter), total);
    }
  }, onChoicesLazyLoadCallbackTimeOut);
};

QUnit.test("lazy loading: first loading", assert => {
  const done = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true,
      "choicesLazyLoadPageSize": 30,
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  setTimeout(() => {
    assert.equal(question.choices.length, 30);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[29].value, 30);
    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading: first loading - default value", assert => {
  const done = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "defaultValue": "1",
      "choicesLazyLoadEnabled": true,
      "choicesLazyLoadPageSize": 30,
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  question.dropdownListModel.popupModel.show();
  question.dropdownListModel.changeSelectionWithKeyboard(false);
  setTimeout(() => {
    assert.equal(question.choices.length, 30);
    assert.equal(question.dropdownListModel.inputStringRendered, "1");
    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading: several loading", assert => {
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const json = {
    questions: [{
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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);

    question.dropdownListModel["updateQuestionChoices"]();
    setTimeout(() => {
      assert.equal(question.choices.length, 50);
      assert.equal(question.choices[0].value, 1);
      assert.equal(question.choices[49].value, 50);

      question.dropdownListModel["updateQuestionChoices"]();
      setTimeout(() => {
        assert.equal(question.choices.length, 55);
        assert.equal(question.choices[0].value, 1);
        assert.equal(question.choices[54].value, 55);

        done3();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading + change filter string + dropdownSearchDelay ", assert => {
  const newValueDebouncedInputValue = 2 * onChoicesLazyLoadCallbackTimeOut;
  const oldValueDebouncedInputValue = settings.dropdownSearchDelay;
  settings.dropdownSearchDelay = newValueDebouncedInputValue;
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const done4 = assert.async();

  const json = {
    questions: [{
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

    question.dropdownListModel.filterString = "2";
    setTimeout(() => {
      assert.equal(question.choices.length, 25, "filter is 2");
      assert.equal(question.choices[0].value, 1, "filter is 2");

      question.dropdownListModel.filterString = "22";
      setTimeout(() => {
        assert.equal(question.choices.length, 25, "filter is 22 before request");
        assert.equal(question.choices[0].value, 1, "filter is 22 before request");

        setTimeout(() => {
          assert.equal(question.choices.length, 25, "filter is 22 after request");
          assert.equal(question.choices[0].value, 22, "filter is 22 after request");

          settings.dropdownSearchDelay = oldValueDebouncedInputValue;
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
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "defaultValue": 2,
        "choicesLazyLoadEnabled": true
      }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);
  survey.onGetChoiceDisplayValue.add((sender, options) => {
    requestCount++;
    setTimeout(() => {
      if(options.question.name == "q1") {
        options.setItems(options.values.map(item => ("DisplayText_" + item)));
        responseCount++;
      }
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
  });

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(requestCount, 0, "requestCount #1");
  assert.equal(responseCount, 0, "responseCount #1");

  assert.equal(question.showSelectedItemLocText, true, "showSelectedItemLocText");
  assert.equal(requestCount, 1, "requestCount #2");
  assert.equal(responseCount, 0, "responseCount #2");

  setTimeout(() => {
    assert.equal(requestCount, 1, "requestCount #2.1");
    assert.equal(responseCount, 0, "responseCount #2.1");
    assert.equal(question.selectedItemLocText.calculatedText, "2");

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
      }, onChoicesLazyLoadCallbackTimeOut + 2 * callbackTimeOutDelta);
      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
    done1();
  }, onChoicesLazyLoadCallbackTimeOut);
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
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.visibleChoices.length, 1);
  assert.equal(question.visibleChoices[0].id, "other");
  assert.equal(question.visibleChoices[0].value, "other");

  question.renderedValue = "other";
  assert.deepEqual(question.value, "other", "#1");
  question.comment = "text1";
  assert.deepEqual(question.value, "text1", "#2");
  assert.deepEqual(survey.data, { q1: "text1" }, "#3");
});

QUnit.test("lazy loading: storeOthersAsComment is false", assert => {
  const done = assert.async();
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
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.visibleChoices.length, 1);
  assert.equal(question.visibleChoices[0].id, "other");
  assert.equal(question.visibleChoices[0].value, "other");

  question.dropdownListModel.popupModel.show();
  setTimeout(() => {
    assert.equal(question.visibleChoices.length, 56);
    assert.equal(question.visibleChoices[0].value, 1);
    assert.equal(question.visibleChoices[54].value, 55);
    assert.equal(question.visibleChoices[55].id, "other");
    assert.equal(question.visibleChoices[55].value, "other");

    question.renderedValue = "other";
    assert.deepEqual(question.value, "other", "#1");
    question.comment = "text1";
    assert.deepEqual(question.value, "text1", "#2");
    assert.deepEqual(survey.data, { q1: "text1" }, "#3");
    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("itemsSettings property", assert => {
  const done1 = assert.async();
  const done2 = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const listModel = question.popupModel.contentComponentData.model as ListModel;
  const itemsSettings = question.dropdownListModel["itemsSettings"];
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);
  assert.equal(listModel.actions.length, 0, "listModel.actions");

  question.dropdownListModel.popupModel.show();

  setTimeout(() => {
    assert.equal(listModel.actions.length, 26, "listModel.actions");
    assert.equal(itemsSettings.skip, 25);
    assert.equal(itemsSettings.take, 25);
    assert.equal(itemsSettings.totalCount, 55);
    assert.equal(itemsSettings.items.length, 25);

    question.dropdownListModel.popupModel.hide();

    setTimeout(() => {
      assert.equal(listModel.actions.length, 26, "listModel.actions");
      assert.equal(itemsSettings.skip, 0);
      assert.equal(itemsSettings.take, 25);
      assert.equal(itemsSettings.totalCount, 0);
      assert.equal(itemsSettings.items.length, 0);

      question.dropdownListModel.popupModel.show();
      assert.equal(listModel.actions.length, 0, "listModel.actions");

      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});
QUnit.test("rendering actions id", assert => {
  const json = {
    questions: [{
      type: "dropdown",
      name: "q1",
      choices: ["Item1", "Item2"]
    }]
  };
  const survey = new SurveyModel(json);
  const question = <QuestionDropdownModel>survey.getQuestionByName("q1");
  question.id = "el1";
  const listModel = question.popupModel.contentComponentData.model as ListModel;
  const actions = listModel.renderedActions;
  assert.equal(actions.length, 2, "two actions");
  assert.equal((<IAction>actions[0]).elementId, "el1i_listItem1", "elementId, action1");
  assert.equal((<IAction>actions[1]).elementId, "el1i_listItem2", "elementId, action2");
  assert.equal((<IAction>actions[0]).disableTabStop, true, "disableTabStop, action1");
  assert.equal((<IAction>actions[1]).disableTabStop, true, "disableTabStop, action2");
});

QUnit.test("Test dropdown choices change should update strings", function (assert) {
  const json = {
    questions: [
      {
        name: "liveage",
        type: "dropdown",
        choices: ["i1", "i2"]
      },
    ],
  };
  const survey = new SurveyModel(json);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

  assert.equal(question.readOnlyText, "Select...");
  question.value = "i3";
  assert.equal(question.readOnlyText, "Select...");
  question.choices = ["i1", "i2", "i3"];
  assert.equal(question.readOnlyText, "");
});

QUnit.test("min page size", assert => {
  const done1 = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true,
      choicesLazyLoadPageSize: 10
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const listModel = question.popupModel.contentComponentData.model as ListModel;
  const itemsSettings = question.dropdownListModel["itemsSettings"];
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);
  assert.equal(listModel.actions.length, 0, "listModel.actions");

  question.dropdownListModel.popupModel.show();

  setTimeout(() => {
    assert.equal(listModel.actions.length, 26, "listModel.actions");
    assert.equal(itemsSettings.skip, 25);
    assert.equal(itemsSettings.take, 25);
    assert.equal(itemsSettings.totalCount, 55);
    assert.equal(itemsSettings.items.length, 25);

    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("selectedItem until all data is loaded", assert => {
  const done = assert.async(3);

  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true,
      "choicesLazyLoadPageSize": 30
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const listModel = question.popupModel.contentComponentData.model as ListModel;

  assert.equal(listModel.actions.length, 0, "listModel.actions");
  assert.equal(question.selectedItem, null);

  question.dropdownListModel.popupModel.show();
  setTimeout(() => {
    assert.equal(question.choices.length, 30);
    assert.equal(listModel.actions.length, 31, "listModel.actions");

    question.dropdownListModel["updateQuestionChoices"]();
    setTimeout(() => {
      assert.equal(question.choices.length, 55);
      assert.equal(listModel.actions.length, 55, "listModel.actions");
      assert.equal(question.choices[54].value, 55);

      question.value = question.choices[54].value;
      assert.equal(question.selectedItem.value, 55);

      question.dropdownListModel.popupModel.hide();
      question.dropdownListModel.popupModel.show();

      setTimeout(() => {
        assert.equal(question.choices.length, 30);
        assert.equal(listModel.actions.length, 31, "listModel.actions");
        assert.equal(question.selectedItem.value, 55);

        question.clearValue();
        assert.equal(question.selectedItem, null);

        done();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

      done();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

});
function getObjectArray(skip = 1, count = 25): Array<{value: number, text: string}> {
  const result:Array<{value: number, text: string}> = [];
  for(let index = skip; index < (skip + count); index++) {
    result.push({ value: index, text: "DisplayText_" + index });
  }
  return result;
}

QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue", assert => {
  const done = assert.async();
  const json = {
    questions: [{
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
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((sender, options) => {
    const total = 55;
    setTimeout(() => {
      if(options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    }, onChoicesLazyLoadCallbackTimeOut);
  });
  survey.onGetChoiceDisplayValue.add((sender, options) => {
    if(options.question.name == "q1") {
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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);
    assert.equal(question.value, 55);
    assert.equal(question.selectedItem.value, 55);
    assert.equal(question.selectedItem.text, "DisplayText_55");
    done();
  }, onChoicesLazyLoadCallbackTimeOut);
});
QUnit.test("lazy loading + onGetChoiceDisplayValue: defaultValue & custom property", assert => {
  Serializer.addProperty("itemvalue", "customProp");
  const survey = new SurveyModel({
    questions: [{
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
    if(options.question.name == "q1") {
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
    questions: [{
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
  const done = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "defaultValue": { id: 55 },
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((sender, options) => {
    const total = 55;
    setTimeout(() => {
      if(options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    }, onChoicesLazyLoadCallbackTimeOut);
  });
  survey.onGetChoiceDisplayValue.add((sender, options) => {
    if(options.question.name == "q1") {
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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);
    assert.equal(question.value.id, 55);
    assert.equal(question.selectedItem.value.id, 55);
    assert.equal(question.selectedItem.text, "DisplayText_55", "selectedItem.text");
    assert.equal(question.displayValue, "DisplayText_55", "displayValue");
    assert.equal(question.dropdownListModel.inputString, "DisplayText_55");
    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading + onGetChoiceDisplayValue: set survey data", assert => {
  const done = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((sender, options) => {
    const total = 55;
    setTimeout(() => {
      if(options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    }, onChoicesLazyLoadCallbackTimeOut);
  });
  survey.onGetChoiceDisplayValue.add((sender, options) => {
    if(options.question.name == "q1") {
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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);
    assert.equal(question.value, 55);
    assert.equal(question.selectedItem.value, 55);
    assert.equal(question.selectedItem.text, "DisplayText_55");
    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading data is lost: defaultValue", assert => {
  const done = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "defaultValue": 55,
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((sender, options) => {
    const total = 55;
    setTimeout(() => {
      if(options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    }, onChoicesLazyLoadCallbackTimeOut);
  });
  survey.onGetChoiceDisplayValue.add((sender, options) => {
    if(options.question.name == "q1") {
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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.value, 55);

    assert.deepEqual(survey.data, { "q1": 55 }, "before doComplete after item load");
    survey.doComplete();
    assert.deepEqual(survey.data, { "q1": 55 }, "after doComplete after item load");

    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading data is lost: set survey data", assert => {
  const done = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((sender, options) => {
    const total = 55;
    setTimeout(() => {
      if(options.skip + options.take < total) {
        options.setItems(getObjectArray(options.skip + 1, options.take), total);
      } else {
        options.setItems(getObjectArray(options.skip + 1, total - options.skip), total);
      }
    }, onChoicesLazyLoadCallbackTimeOut);
  });
  survey.onGetChoiceDisplayValue.add((sender, options) => {
    if(options.question.name == "q1") {
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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.value, 55);

    assert.deepEqual(survey.data, { "q1": 55 }, "before doComplete after item load");
    survey.doComplete();
    assert.deepEqual(survey.data, { "q1": 55 }, "after doComplete after item load");

    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading + change filter string", assert => {
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const itemsSettings = question.dropdownListModel["itemsSettings"];

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(itemsSettings.skip, 0);
  assert.equal(itemsSettings.take, 25);
  assert.equal(itemsSettings.totalCount, 0);
  assert.equal(itemsSettings.items.length, 0);

  question.dropdownListModel.popupModel.show();
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);
    assert.equal(itemsSettings.skip, 25);
    assert.equal(itemsSettings.take, 25);
    assert.equal(itemsSettings.totalCount, 55);
    assert.equal(itemsSettings.items.length, 25);

    question.dropdownListModel.filterString = "2";
    setTimeout(() => {
      assert.equal(question.choices.length, 25);
      assert.equal(question.choices[0].value, 2);
      assert.equal(question.choices[24].value, 123);
      assert.equal(itemsSettings.skip, 25);
      assert.equal(itemsSettings.take, 25);
      assert.equal(itemsSettings.totalCount, 55);
      assert.equal(itemsSettings.items.length, 25);

      question.dropdownListModel.filterString = "22";
      setTimeout(() => {
        assert.equal(question.choices.length, 25);
        assert.equal(question.choices[0].value, 22);
        assert.equal(question.choices[24].value, 1223);
        assert.equal(itemsSettings.skip, 25);
        assert.equal(itemsSettings.take, 25);
        assert.equal(itemsSettings.totalCount, 55);
        assert.equal(itemsSettings.items.length, 25);

        done3();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("lazy loading + change listModel filter string", assert => {
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);

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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);
    assert.equal(itemsSettings.skip, 25);
    assert.equal(itemsSettings.take, 25);
    assert.equal(itemsSettings.totalCount, 55);
    assert.equal(itemsSettings.items.length, 25);

    listModel.filterString = "2";
    setTimeout(() => {
      assert.equal(question.choices.length, 25);
      assert.equal(question.choices[0].value, 2);
      assert.equal(question.choices[24].value, 123);
      assert.equal(itemsSettings.skip, 25);
      assert.equal(itemsSettings.take, 25);
      assert.equal(itemsSettings.totalCount, 55);
      assert.equal(itemsSettings.items.length, 25);

      listModel.filterString = "22";
      setTimeout(() => {
        assert.equal(question.choices.length, 25);
        assert.equal(question.choices[0].value, 22);
        assert.equal(question.choices[24].value, 1223);
        assert.equal(itemsSettings.skip, 25);
        assert.equal(itemsSettings.take, 25);
        assert.equal(itemsSettings.totalCount, 55);
        assert.equal(itemsSettings.items.length, 25);

        done3();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("show comment and show other together", assert => {
  const json = {
    questions: [{
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
  assert.equal(question.showCommentArea, true, "hasComment is true");
  assert.equal(question.getStoreOthersAsComment(), false, "we have show comment");
  question.showCommentArea = false;
  assert.equal(question.getStoreOthersAsComment(), true, "show comment is hidden");
  question.showCommentArea = true;
  assert.equal(question.getStoreOthersAsComment(), false, "show comment again");
});

QUnit.test("ItemValue: check action fields", assert => {
  const json = {
    questions: [{
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
  assert.equal(question.visibleChoices[0].data, question.visibleChoices[0]);
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
  const done = assert.async(2);

  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((_, opt) => {
    setTimeout(() => { opt.setItems([], 0); }, onChoicesLazyLoadCallbackTimeOut);
  });

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const dropdownListModel = question.dropdownListModel;
  const list: ListModel = dropdownListModel.popupModel.contentComponentData.model as ListModel;
  assert.equal(list.actions.length, 0);
  assert.equal(list.emptyMessage, "Loading...");
  assert.equal(question.choices.length, 0);

  question.dropdownListModel.popupModel.show();
  setTimeout(() => {
    assert.equal(list.actions.length, 0);
    assert.equal(list.emptyMessage, "No data to display");
    assert.equal(question.choices.length, 0);

    setTimeout(() => {

      done();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("isReady flag + onGetChoiceDisplayValue", assert => {
  const done = assert.async();

  const json = {
    questions: [{
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
    if(opt.isReady) {
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
    questions: [{
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
    questions: [{
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
    if(opt.isReady) {
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

QUnit.test("lazy loading: change choicesLazyLoadEnabled on runtime", assert => {
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((_, opt) => {
    const total = 55;
    const result: Array<any> = [];
    for (let index = 0; index < total; index++) {
      result.push({ value: "item" + index, text: "item" + index });
    }
    if(opt.filter === "des") {
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
  const done = assert.async(4);
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true,
      "choicesLazyLoadPageSize": 25,
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add(callback);
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const itemsSettings = question.dropdownListModel["itemsSettings"];

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0, "question.choices.length #0");
  question.dropdownListModel.popupModel.show();
  question.dropdownListModel.changeSelectionWithKeyboard(false);
  setTimeout(() => {
    assert.equal(question.choices.length, 25, "question.choices.length #1");
    assert.equal(question.dropdownListModel.inputStringRendered, "", "question.dropdownListModel.inputStringRendered #1");
    assert.equal(itemsSettings.skip, 25, "skip #1");
    assert.equal(itemsSettings.take, 25, "take #1");
    assert.equal(itemsSettings.totalCount, 55, "totalCount #1");
    assert.equal(itemsSettings.items.length, 25, "items.length #1");
    question.dropdownListModel.inputStringRendered = "11";

    setTimeout(() => {
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

      setTimeout(() => {
        assert.equal(question.value, undefined);
        assert.equal(question.choices.length, 25, "question.choices.length #3");
        assert.equal(question.dropdownListModel.inputStringRendered, "", "question.dropdownListModel.inputStringRendered #3");
        assert.equal(itemsSettings.skip, 0, "skip #3");
        assert.equal(itemsSettings.take, 25, "take #3");
        assert.equal(itemsSettings.totalCount, 0, "totalCount #3");
        assert.equal(itemsSettings.items.length, 0, "items.length #3");
        question.dropdownListModel.popupModel.show();

        setTimeout(() => {
          assert.equal(question.choices.length, 25, "question.choices.length #4");
          assert.equal(question.dropdownListModel.inputStringRendered, "", "question.dropdownListModel.inputStringRendered #4");

          done();
        }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
        done();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
      done();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});
QUnit.test("lazy loading: check onChoicesLazyLoad callback count", assert => {
  const done = assert.async(4);
  let callbackCount = 0;
  const json = {
    questions: [{
      "type": "dropdown",
      "name": "q1",
      "choicesLazyLoadEnabled": true,
      "choicesLazyLoadPageSize": 25,
    }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((_, opt) => {
    const total = 55;
    setTimeout(() => {
      callbackCount++;
      if(opt.skip + opt.take < total) {
        opt.setItems(getNumberArray(opt.skip + 1, opt.take, opt.filter), total);
      } else {
        opt.setItems(getNumberArray(opt.skip + 1, total - opt.skip, opt.filter), total);
      }
    }, onChoicesLazyLoadCallbackTimeOut);
  });
  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];

  assert.equal(callbackCount, 0);
  question.dropdownListModel.popupModel.show();
  question.dropdownListModel.changeSelectionWithKeyboard(false);
  setTimeout(() => {
    assert.equal(callbackCount, 1);
    question.dropdownListModel.inputStringRendered = "11";

    setTimeout(() => {
      assert.equal(callbackCount, 2);
      question.dropdownListModel.onBlur({
        keyCode: 0,
        preventDefault: () => { },
        stopPropagation: () => { }
      });

      setTimeout(() => {
        assert.equal(callbackCount, 2);
        question.dropdownListModel.popupModel.show();

        setTimeout(() => {
          assert.equal(callbackCount, 3);

          done();
        }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
        done();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
      done();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
    done();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
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
  assert.equal(listModel.loadingText, "Wird hochgeladen...", "loadingText");

  let popupViewModel: PopupBaseViewModel = new PopupDropdownViewModel(q1.dropdownListModel.popupModel);
  assert.equal(popupViewModel.cancelButtonText, "Abbrechen", "cancelButtonText");

  popupViewModel = new PopupModalViewModel(q1.dropdownListModel.popupModel);
  assert.equal((popupViewModel as PopupModalViewModel).applyButtonText, "Anwenden", "applyButtonText");
});

QUnit.test("Dropdown choicesLazyLoadEnabled into matrixdynamic", function (assert) {
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
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
  survey.onChoicesLazyLoad.add(callback);

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
  setTimeout(() => {
    assert.equal(question.choices.length, 25);
    assert.equal(question.choices[0].value, 1);
    assert.equal(question.choices[24].value, 25);
    assert.equal(itemsSettings.skip, 25);
    assert.equal(itemsSettings.take, 25);
    assert.equal(itemsSettings.totalCount, 55);
    assert.equal(itemsSettings.items.length, 25);

    listModel.filterString = "2";
    setTimeout(() => {
      assert.equal(question.choices.length, 25);
      assert.equal(question.choices[0].value, 2);
      assert.equal(question.choices[24].value, 123);
      assert.equal(itemsSettings.skip, 25);
      assert.equal(itemsSettings.take, 25);
      assert.equal(itemsSettings.totalCount, 55);
      assert.equal(itemsSettings.items.length, 25);

      listModel.filterString = "22";
      setTimeout(() => {
        assert.equal(question.choices.length, 25);
        assert.equal(question.choices[0].value, 22);
        assert.equal(question.choices[24].value, 1223);
        assert.equal(itemsSettings.skip, 25);
        assert.equal(itemsSettings.take, 25);
        assert.equal(itemsSettings.totalCount, 55);
        assert.equal(itemsSettings.items.length, 25);

        done3();
      }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

      done2();
    }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);

    done1();
  }, onChoicesLazyLoadCallbackTimeOut + callbackTimeOutDelta);
});

QUnit.test("Rapidly Changing Search Filter", (assert) => {
  const newValueDebouncedInputValue = 2 * onChoicesLazyLoadCallbackTimeOut;
  const oldValueDebouncedInputValue = settings.dropdownSearchDelay;
  settings.dropdownSearchDelay = newValueDebouncedInputValue;

  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const done4 = assert.async();
  let filterValue = "";
  let filterValueLog = "";
  const json = {
    questions: [{
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
  dropdownListModel.inputStringRendered = filterValue;
  setTimeout(() => {
    assert.equal(question.choices.length, 0);
    assert.equal(filterValueLog, "", "filter value 1");

    filterValue += "2";
    dropdownListModel.inputStringRendered = filterValue;
    setTimeout(() => {
      assert.equal(question.choices.length, 0);
      assert.equal(filterValueLog, "", "filter value 12");

      filterValue += "3";
      dropdownListModel.inputStringRendered = filterValue;
      setTimeout(() => {
        assert.equal(filterValueLog, "123->", "filter value 123 #1");
        assert.equal(question.choices.length, 0);

        setTimeout(() => {
          assert.equal(filterValueLog, "123->", "filter value 123 #2");
          assert.equal(question.choices.length, 25);

          settings.dropdownSearchDelay = oldValueDebouncedInputValue;
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
  const done1 = assert.async();
  const done2 = assert.async();
  const done3 = assert.async();
  const done4 = assert.async();
  const newValueDebouncedInputValue = onChoicesLazyLoadCallbackTimeOut;
  const oldValueDebouncedInputValue = settings.dropdownSearchDelay;
  settings.dropdownSearchDelay = newValueDebouncedInputValue;

  const json = {
    questions: [{ "type": "dropdown", "name": "q1", "choicesLazyLoadEnabled": true }]
  };
  const survey = new SurveyModel(json);
  survey.onChoicesLazyLoad.add((_, opt) => {
    setTimeout(() => {
      opt.setItems(getNumberArray(0, 5, opt.filter), 5);
    }, onChoicesLazyLoadCallbackTimeOut);
  });

  const question = <QuestionDropdownModel>survey.getAllQuestions()[0];
  const itemsSettings = question.dropdownListModel["itemsSettings"];

  assert.equal(question.choicesLazyLoadEnabled, true);
  assert.equal(question.choices.length, 0);
  assert.equal(question.choices.length, 0, "question.choices.length #1");
  assert.equal(itemsSettings.items.length, 0, "itemsSettings.items.length #1");

  question.dropdownListModel.popupModel.show();
  setTimeout(() => {
    assert.equal(question.choices.length, 5, "question.choices.length #2");

    question.dropdownListModel.filterString = "22";
    setTimeout(() => {
      assert.equal(question.choices.length, 5, "question.choices.length #3");

      question.dropdownListModel.filterString = "2";
      setTimeout(() => {
        assert.equal(question.choices.length, 5, "question.choices.length #4");

        question.dropdownListModel.filterString = "";
        setTimeout(() => {
          assert.equal(question.choices.length, 5, "question.choices.length #5");

          settings.dropdownSearchDelay = oldValueDebouncedInputValue;
          done4();
        }, onChoicesLazyLoadCallbackTimeOut + newValueDebouncedInputValue + callbackTimeOutDelta);

        done3();
      }, callbackTimeOutDelta);

      done2();
    }, onChoicesLazyLoadCallbackTimeOut + newValueDebouncedInputValue + callbackTimeOutDelta);

    done1();
  }, onChoicesLazyLoadCallbackTimeOut + newValueDebouncedInputValue + callbackTimeOutDelta);
});
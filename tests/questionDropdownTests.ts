import { SurveyModel } from "../src/survey";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { ListModel } from "../src/list";

export default QUnit.module("choicesRestful");

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
  question.cssClasses.controlDisabled = "sv_q_dropdown_disabled";
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
    // questions: [{
    //   type: "dropdown",
    //   // renderAs: "select",
    //   name: "question1",
    //   hasOther: "true",
    //   dropdownWidthMode: "contentWidth",
    //   choices: [
    //     "item1",
    //     "item2",
    //     "item3",
    //     "item4",
    //     "item5"
    //   ]
    // }]

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
  assert.equal(listModel.filterStringPlaceholder, "Tippe um zu suchen...", "filtered text in de");
  survey.locale = "";
});
QUnit.test("readOnlyText", assert => {
  const json = {
    questions: [
      {
        "type": "dropdown",
        "name": "q1",
        "placeholder": "click",
        "hasOther": true,
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
  assert.equal(question.readOnlyText, "", "use choice text");
  question.renderAs = "select";
  assert.equal(question.readOnlyText, "item 2", "use choice text");
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
  assert.equal(question.showSelectedItemLocText, false);

  question.value = 1;
  assert.equal(question.showSelectedItemLocText, true);

  question.itemComponent = "my-item";
  assert.equal(question.showSelectedItemLocText, false);
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
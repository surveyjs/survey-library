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

QUnit.test("Test dropdown renderAs select", assert => {
  const json = {
    questions: [{
      type: "dropdown",
      renderAs: "select",
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
  assert.equal(listModel.needFilter, true);
});

QUnit.test("Test dropdown renderAs select denySearch property", assert => {
  const json = {
    questions: [{
      type: "dropdown",
      renderAs: "select",
      name: "question1",
      hasOther: "true",
      denySearch: true,
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
  assert.equal(listModel.needFilter, false);

  question.denySearch = false;
  assert.equal(listModel.needFilter, true);
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

  assert.equal(question.placeholder, "Choose...");
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


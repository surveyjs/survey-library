import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionTextModel } from "../src/question_text";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Separate locales");

QUnit.test("Check separate locales functionality in text question", function (assert) {
  const question = new QuestionTextModel("q1");
  question.inputType = "date";
  question.visibleIf = "{q2} = 1";
  question.title = "Title";
  question.locTitle.setLocaleText("de", "Titel");
  question.locTitle.setLocaleText("fr", "Titre");
  question.description = "Description";
  question.locDescription.setLocaleText("de", "Beschreibung");
  question.locDescription.setLocaleText("fr", "La description");

  assert.deepEqual(question.toJSON({ storeLocaleStrings: false }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
  }, "storeLocalizableStrings: none");
  assert.deepEqual(question.toJSON({ storeLocaleStrings: true }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
    title: {
      default: "Title",
      de: "Titel",
      fr: "Titre",
    },
    description: {
      default: "Description",
      de: "Beschreibung",
      fr: "La description",
    },
  }, "storeLocalizableStrings: all");
  assert.deepEqual(question.toJSON({ storeLocaleStrings: true, locales: ["de"] }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
    title: "Titel",
    description: "Beschreibung",
  }, "storeLocalizableStrings: selected with one locale");
  assert.deepEqual(question.toJSON({ locales: ["de", "fr"] }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
    title: { de: "Titel", fr: "Titre" },
    description: { de: "Beschreibung", fr: "La description" },
  }, "storeLocalizableStrings: selected with two locales");
  assert.deepEqual(question.getLocalizationJSON(), {
    name: "q1",
    title: { default: "Title", de: "Titel", fr: "Titre" },
    description: { default: "Description", de: "Beschreibung", fr: "La description" },
  }, "storeLocalizableStrings: stringsOnly without selectedLocales");
  assert.deepEqual(question.getLocalizationJSON(["de"]), {
    name: "q1",
    title: "Titel",
    description: "Beschreibung",
  }, "storeLocalizableStrings: stringsOnly with one locale");
  assert.deepEqual(question.getLocalizationJSON(["de", "fr"]), {
    name: "q1",
    title: { de: "Titel", fr: "Titre" },
    description: { de: "Beschreibung", fr: "La description" },
  }, "storeLocalizableStrings: stringsOnly with two locales");
});
QUnit.test("get separate locales for survey", function (assert) {
  const survey = new SurveyModel({
    title: { default: "Survey Title", de: "Umfrage Titel", fr: "Titre de l." },
    elements: [
      {
        type: "text",
        name: "q1",
        title: { default: "Title", de: "Titel", fr: "Titre" },
        description: { default: "Description", de: "Beschreibung", fr: "La description" },
      },
    ],
  });
  assert.deepEqual(survey.toJSON({ storeLocaleStrings: false }), {
    pages: [{ name: "page1", elements: [
      {
        type: "text",
        name: "q1",
      },
    ] }] }, "storeLocalizableStrings: none");
  assert.deepEqual(survey.getLocalizationJSON(["de"]), {
    locale: "de",
    title: "Umfrage Titel",
    pages: [{ name: "page1", elements: [
      {
        type: "text",
        name: "q1",
        title: "Titel",
        description: "Beschreibung",
      },
    ] }] }, "storeLocalizableStrings: selected with one locale");
  assert.deepEqual(survey.toJSON({ locales: ["de", "fr"] }), {
    title: { de: "Umfrage Titel", fr: "Titre de l." },
    pages: [{ name: "page1", elements: [
      {
        type: "text",
        name: "q1",
        title: { de: "Titel", fr: "Titre" },
        description: { de: "Beschreibung", fr: "La description" },
      },
    ] }] }, "storeLocalizableStrings: selected with two locales");
});
QUnit.test("Add separate locales in survey", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }]
  });
  const allLocales = {
    title: { default: "Survey Title", de: "Umfrage Titel", fr: "Titre de l." },
    elements: [
      { name: "q1", type: "text", title: { default: "Title", de: "Titel", fr: "Titre" },
        description: { default: "Description", de: "Beschreibung", fr: "La description" } }
    ]
  };
  survey.mergeLocalizationJSON(allLocales, ["de"]);
  assert.equal(survey.locale, "", "keep locale the same");
  assert.deepEqual(survey.toJSON(), {
    title: { de: "Umfrage Titel" },
    pages: [{
      "name": "page1",
      elements: [{ type: "text", name: "q1", title: { de: "Titel" }, description: { de: "Beschreibung" } }]
    }]
  }, "merge de locale correctly");
});
QUnit.test("Add separate locales in survey with one locale only", function (assert) {
  const survey = new SurveyModel({
    elements: [{ type: "text", name: "q1" }]
  });
  const deStrings = {
    locale: "de",
    title: "Umfrage Titel",
    elements: [
      { name: "q1", type: "text", title: "Titel",
        description: "Beschreibung" }
    ]
  };
  survey.mergeLocalizationJSON(deStrings);
  assert.equal(survey.locale, "", "keep locale the same");
  assert.deepEqual(survey.toJSON(), {
    title: { de: "Umfrage Titel" },
    pages: [{
      "name": "page1",
      elements: [{ type: "text", name: "q1", title: { de: "Titel" }, description: { de: "Beschreibung" } }]
    }]
  }, "merge de locale correctly");
});
QUnit.test("Get separate locale strings for choices", function (assert) {
  const question = new QuestionDropdownModel("q1");
  question.choices = [
    { value: 1, text: "One" },
    { value: 2, text: "Two" },
    { value: 3, text: "Three" },
    2, 3, "Four",
    { value: 5, text: "Five" }
  ];
  question.choices[0].locText.setLocaleText("de", "Eins");
  question.choices[0].locText.setLocaleText("fr", "Un");
  question.choices[2].locText.setLocaleText("de", "Drei");
  assert.deepEqual(question.getLocalizationJSON(["de"]), {
    name: "q1",
    choices: [
      { value: 1, text: "Eins" },
      2,
      { value: 3, text: "Drei" },
    ],
  }, "get choices locale strings for one locale");
});
QUnit.test("Get separate locale strings for completedHtmlOnCondition", function (assert) {
  const survey = new SurveyModel({
    completedHtmlOnCondition: [
      {
        expression: "{q1} = 1",
        html: "test"
      },
      {
        expression: "{q1} = 2",
        html: { default: "You are winner!", de: "Sie sind ein Gewinner!", fr: "Vous tes un gagnant!" }
      },
      {
        expression: "{q1} = 3",
        html: { default: "You are loser!", fr: "Vous tes un perdant!" }
      }
    ]
  });
  assert.deepEqual(survey.getLocalizationJSON(["de"]), {
    locale: "de",
    completedHtmlOnCondition: [
      {},
      {
        html: "Sie sind ein Gewinner!"
      },
    ]
  }, "get completedHtmlOnCondition locale strings for one locale");
});
QUnit.test("Merge with separate locale strings for completedHtmlOnCondition", function (assert) {
  const survey = new SurveyModel({
    completedHtmlOnCondition: [
      {
        expression: "{q1} = 1",
      },
      {
        expression: "{q1} = 2",
      },
      {
        expression: "{q1} = 3",
      }
    ]
  });
  survey.mergeLocalizationJSON({
    locale: "de",
    completedHtmlOnCondition: [
      {},
      {
        html: "Sie sind ein Gewinner!"
      },
    ]
  });
  assert.deepEqual(survey.toJSON(), {
    completedHtmlOnCondition: [
      {
        expression: "{q1} = 1",
      },
      {
        expression: "{q1} = 2",
        html: { de: "Sie sind ein Gewinner!" }
      },
      {
        expression: "{q1} = 3",
      }
    ]
  }, "merge completedHtmlOnCondition locale strings for one locale");
});
QUnit.test("Merge with separate locale strings for slider.customLabels, Bug#10764", function (assert) {
  const survey = new SurveyModel({
    elements: [
      {
        type: "slider",
        name: "q1",
        customLabels: [
          { value: 1, text: { default: "Very bad", de: "Sehr schlecht" } },
          { value: 5, text: { default: "Very good", de: "Sehr gut" } },
        ]
      }
    ]
  });
  const plainJSON = survey.toJSON({ storeLocaleStrings: false });
  const enJSON = survey.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["default"] });
  const deJSON = survey.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["de"] });
  assert.deepEqual(plainJSON.pages[0].elements[0], {
    type: "slider",
    name: "q1",
    customLabels: [1, 5]
  }, "plain JSON");
  assert.deepEqual(enJSON.pages[0].elements[0], {
    type: "slider",
    name: "q1",
    customLabels: [
      { text: "Very bad" },
      { text: "Very good" },
    ]
  }, "en JSON");
  assert.equal(deJSON.locale, "de", "de locale");
  assert.deepEqual(deJSON.pages[0].elements[0], {
    type: "slider",
    name: "q1",
    customLabels: [
      { text: "Sehr schlecht" },
      { text: "Sehr gut" },
    ]
  }, "de JSON");
  const mergedSurvey = new SurveyModel(plainJSON);
  mergedSurvey.mergeLocalizationJSON(enJSON);
  assert.deepEqual(mergedSurvey.toJSON().pages[0].elements[0], {
    type: "slider",
    name: "q1",
    customLabels: [
      { value: 1, text: "Very bad" },
      { value: 5, text: "Very good" },
    ]
  }, "merged JSON vs en JSON");
  mergedSurvey.mergeLocalizationJSON(deJSON);
  assert.deepEqual(mergedSurvey.toJSON().pages[0].elements[0], {
    type: "slider",
    name: "q1",
    customLabels: [
      { value: 1, text: { default: "Very bad", de: "Sehr schlecht" } },
      { value: 5, text: { default: "Very good", de: "Sehr gut" } },
    ]
  }, "merged JSON vs de JSON");
});
QUnit.test("Merge with separate locale strings for matrix.cells, Bug#10767", (assert) => {
  const survey = new SurveyModel({
    elements: [{
      type: "matrix",
      name: "q1",
      columns: ["col1"],
      rows: ["row1"],
      cells: { row1: { col1: { default: "text", de: "text-de" } } }
    }]
  });
  const question = <QuestionMatrixModel>survey.getQuestionByName("q1");
  assert.deepEqual(question.toJSON({ storeLocaleStrings: false }), {
    name: "q1",
    columns: ["col1"],
    rows: ["row1"],
  }, "storeLocalizableStrings: none");
  assert.deepEqual(question.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["default"] }), {
    name: "q1",
    cells: { row1: { col1: "text" } }
  }, "storeLocalizableStrings: default");
  assert.deepEqual(question.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["de"] }), {
    name: "q1",
    cells: { row1: { col1: "text-de" } }
  }, "storeLocalizableStrings: de");
  const mergedSurvey = new SurveyModel({
    elements: [{
      type: "matrix",
      name: "q1",
      columns: ["col1"],
      rows: ["row1"],
    }]
  });
  mergedSurvey.mergeLocalizationJSON(survey.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["default"] }));
  mergedSurvey.mergeLocalizationJSON(survey.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["de"] }));
  assert.deepEqual(mergedSurvey.getQuestionByName("q1").toJSON(), {
    name: "q1",
    columns: ["col1"],
    rows: ["row1"],
    cells: { row1: { col1: { default: "text", de: "text-de" } } }
  }, "merged JSON");
});

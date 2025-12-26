import { QuestionDropdownModel } from "../src/question_dropdown";
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
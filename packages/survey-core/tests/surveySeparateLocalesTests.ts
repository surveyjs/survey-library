import { Question } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { SurveyModel } from "../src/survey";

export default QUnit.module("Separate locales");

QUnit.test("Check separate locales functionality", function (assert) {
  const question = new QuestionTextModel("q1");
  question.inputType = "date";
  question.visibleIf = "{q2} = 1";
  question.title = "Title";
  question.locTitle.setLocaleText("de", "Titel");
  question.locTitle.setLocaleText("fr", "Titre");
  question.description = "Description";
  question.locDescription.setLocaleText("de", "Beschreibung");
  question.locDescription.setLocaleText("fr", "La description");

  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "none" }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
  }, "storeLocalizableStrings: none");
  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "selected" }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
  }, "storeLocalizableStrings: selected without selectedLocales");
  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "all" }), {
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
  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "selected", selectedLocales: ["de"] }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
    title: "Titel",
    description: "Beschreibung",
  }, "storeLocalizableStrings: selected with one locale");
  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "selected", selectedLocales: ["de", "fr"] }), {
    name: "q1",
    inputType: "date",
    visibleIf: "{q2} = 1",
    title: { de: "Titel", fr: "Titre" },
    description: { de: "Beschreibung", fr: "La description" },
  }, "storeLocalizableStrings: selected with two locales");
  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "stringsOnly" }), {
    name: "q1",
    title: { default: "Title", de: "Titel", fr: "Titre" },
    description: { default: "Description", de: "Beschreibung", fr: "La description" },
  }, "storeLocalizableStrings: stringsOnly without selectedLocales");
  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "stringsOnly", selectedLocales: ["de"] }), {
    name: "q1",
    title: "Titel",
    description: "Beschreibung",
  }, "storeLocalizableStrings: stringsOnly with one locale");
  assert.deepEqual(question.toJSON({ storeLocalizableStrings: "stringsOnly", selectedLocales: ["de", "fr"] }), {
    name: "q1",
    title: { de: "Titel", fr: "Titre" },
    description: { de: "Beschreibung", fr: "La description" },
  }, "storeLocalizableStrings: stringsOnly with two locales");

});

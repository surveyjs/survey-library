import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionTextModel } from "../src/question_text";
import { SurveyModel } from "../src/survey";
import { surveyLocalization } from "../src/surveyStrings";

import { describe, test, expect } from "vitest";
describe("Separate locales", () => {
  test("Check separate locales functionality in text question", () => {
    const question = new QuestionTextModel("q1");
    question.inputType = "date";
    question.visibleIf = "{q2} = 1";
    question.title = "Title";
    question.locTitle.setLocaleText("de", "Titel");
    question.locTitle.setLocaleText("fr", "Titre");
    question.description = "Description";
    question.locDescription.setLocaleText("de", "Beschreibung");
    question.locDescription.setLocaleText("fr", "La description");

    expect(question.toJSON({ storeLocaleStrings: false }), "storeLocalizableStrings: none").toEqualValues({
      name: "q1",
      inputType: "date",
      visibleIf: "{q2} = 1",
    });
    expect(question.toJSON({ storeLocaleStrings: true }), "storeLocalizableStrings: all").toEqualValues({
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
    });
    expect(question.toJSON({ storeLocaleStrings: true, locales: ["de"] }), "storeLocalizableStrings: selected with one locale").toEqualValues({
      name: "q1",
      inputType: "date",
      visibleIf: "{q2} = 1",
      title: "Titel",
      description: "Beschreibung",
    });
    expect(question.toJSON({ locales: ["de", "fr"] }), "storeLocalizableStrings: selected with two locales").toEqualValues({
      name: "q1",
      inputType: "date",
      visibleIf: "{q2} = 1",
      title: { de: "Titel", fr: "Titre" },
      description: { de: "Beschreibung", fr: "La description" },
    });
    expect(question.getLocalizationJSON(), "storeLocalizableStrings: stringsOnly without selectedLocales").toEqualValues({
      name: "q1",
      title: { default: "Title", de: "Titel", fr: "Titre" },
      description: { default: "Description", de: "Beschreibung", fr: "La description" },
    });
    expect(question.getLocalizationJSON(["de"]), "storeLocalizableStrings: stringsOnly with one locale").toEqualValues({
      name: "q1",
      title: "Titel",
      description: "Beschreibung",
    });
    expect(question.getLocalizationJSON(["de", "fr"]), "storeLocalizableStrings: stringsOnly with two locales").toEqualValues({
      name: "q1",
      title: { de: "Titel", fr: "Titre" },
      description: { de: "Beschreibung", fr: "La description" },
    });
  });
  test("get separate locales for survey", () => {
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
    expect(survey.toJSON({ storeLocaleStrings: false }), "storeLocalizableStrings: none").toEqualValues({
      pages: [{ name: "page1", elements: [
        {
          type: "text",
          name: "q1",
        },
      ] }] });
    expect(survey.getLocalizationJSON(["de"]), "storeLocalizableStrings: selected with one locale").toEqualValues({
      locale: "de",
      title: "Umfrage Titel",
      pages: [{ name: "page1", elements: [
        {
          type: "text",
          name: "q1",
          title: "Titel",
          description: "Beschreibung",
        },
      ] }] });
    expect(survey.toJSON({ locales: ["de", "fr"] }), "storeLocalizableStrings: selected with two locales").toEqualValues({
      title: { de: "Umfrage Titel", fr: "Titre de l." },
      pages: [{ name: "page1", elements: [
        {
          type: "text",
          name: "q1",
          title: { de: "Titel", fr: "Titre" },
          description: { de: "Beschreibung", fr: "La description" },
        },
      ] }] });
  });
  test("Add separate locales in survey", () => {
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
    expect(survey.locale, "keep locale the same").toLooseEqual("");
    expect(survey.toJSON(), "merge de locale correctly").toEqualValues({
      title: { de: "Umfrage Titel" },
      pages: [{
        "name": "page1",
        elements: [{ type: "text", name: "q1", title: { de: "Titel" }, description: { de: "Beschreibung" } }]
      }]
    });
  });
  test("Add separate locales in survey with one locale only", () => {
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
    expect(survey.locale, "keep locale the same").toLooseEqual("");
    expect(survey.toJSON(), "merge de locale correctly").toEqualValues({
      title: { de: "Umfrage Titel" },
      pages: [{
        "name": "page1",
        elements: [{ type: "text", name: "q1", title: { de: "Titel" }, description: { de: "Beschreibung" } }]
      }]
    });
  });
  test("Get separate locale strings for choices", () => {
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
    expect(question.getLocalizationJSON(["de"]), "get choices locale strings for one locale").toEqualValues({
      name: "q1",
      choices: [
        { value: 1, text: "Eins" },
        2,
        { value: 3, text: "Drei" },
      ],
    });
  });
  test("Get separate locale strings for completedHtmlOnCondition", () => {
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
    expect(survey.getLocalizationJSON(["de"]), "get completedHtmlOnCondition locale strings for one locale").toEqualValues({
      locale: "de",
      completedHtmlOnCondition: [
        {},
        {
          html: "Sie sind ein Gewinner!"
        },
      ]
    });
  });
  test("Merge with separate locale strings for completedHtmlOnCondition", () => {
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
    expect(survey.toJSON(), "merge completedHtmlOnCondition locale strings for one locale").toEqualValues({
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
    });
  });
  test("Merge with separate locale strings for slider.customLabels, Bug#10764", () => {
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
    expect(plainJSON.pages[0].elements[0], "plain JSON").toEqualValues({
      type: "slider",
      name: "q1",
      customLabels: [1, 5]
    });
    expect(enJSON.pages[0].elements[0], "en JSON").toEqualValues({
      type: "slider",
      name: "q1",
      customLabels: [
        { text: "Very bad" },
        { text: "Very good" },
      ]
    });
    expect(deJSON.locale, "de locale").toLooseEqual("de");
    expect(deJSON.pages[0].elements[0], "de JSON").toEqualValues({
      type: "slider",
      name: "q1",
      customLabels: [
        { text: "Sehr schlecht" },
        { text: "Sehr gut" },
      ]
    });
    const mergedSurvey = new SurveyModel(plainJSON);
    mergedSurvey.mergeLocalizationJSON(enJSON);
    expect(mergedSurvey.toJSON().pages[0].elements[0], "merged JSON vs en JSON").toEqualValues({
      type: "slider",
      name: "q1",
      customLabels: [
        { value: 1, text: "Very bad" },
        { value: 5, text: "Very good" },
      ]
    });
    mergedSurvey.mergeLocalizationJSON(deJSON);
    expect(mergedSurvey.toJSON().pages[0].elements[0], "merged JSON vs de JSON").toEqualValues({
      type: "slider",
      name: "q1",
      customLabels: [
        { value: 1, text: { default: "Very bad", de: "Sehr schlecht" } },
        { value: 5, text: { default: "Very good", de: "Sehr gut" } },
      ]
    });
  });
  test("Merge with separate locale strings for matrix.cells, Bug#10767", () => {
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
    expect(question.toJSON({ storeLocaleStrings: false }), "storeLocalizableStrings: none").toEqualValues({
      name: "q1",
      columns: ["col1"],
      rows: ["row1"],
    });
    expect(question.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["default"] }), "storeLocalizableStrings: default").toEqualValues({
      name: "q1",
      cells: { row1: { col1: "text" } }
    });
    expect(question.toJSON({ storeLocaleStrings: "stringsOnly", locales: ["de"] }), "storeLocalizableStrings: de").toEqualValues({
      name: "q1",
      cells: { row1: { col1: "text-de" } }
    });
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
    expect(mergedSurvey.getQuestionByName("q1").toJSON(), "merged JSON").toEqualValues({
      name: "q1",
      columns: ["col1"],
      rows: ["row1"],
      cells: { row1: { col1: { default: "text", de: "text-de" } } }
    });
  });
  test("getLocalizationJSON with default locale key ('en') should produce same result as 'default', Bug#11037", () => {
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
    const defaultLocale = surveyLocalization.defaultLocale;
    expect(defaultLocale, "default locale is 'en'").toLooseEqual("en");
    const jsonDefault = survey.getLocalizationJSON(["default"]);
    const jsonEn = survey.getLocalizationJSON(["en"]);
    expect(jsonEn, "getLocalizationJSON(['en']) returns default English strings").toEqualValues({
      locale: "en",
      title: "Survey Title",
      pages: [{ name: "page1", elements: [
        {
          type: "text",
          name: "q1",
          title: "Title",
          description: "Description",
        },
      ] }]
    });
    expect(jsonDefault.title, "titles match").toLooseEqual(jsonEn.title);
    expect(jsonDefault.pages[0].elements[0].title, "question titles match").toLooseEqual(jsonEn.pages[0].elements[0].title);
    expect(jsonDefault.pages[0].elements[0].description, "descriptions match").toLooseEqual(jsonEn.pages[0].elements[0].description);
  });
  test("mergeLocalizationJSON with 'en' locale should merge into default locale, Bug#11037", () => {
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
    expect(surveyLocalization.defaultLocale, "default locale is 'en'").toLooseEqual("en");
    survey.mergeLocalizationJSON(allLocales, ["en"]);
    expect(survey.locale, "keep locale the same").toLooseEqual("");
    expect(survey.toJSON(), "merge en locale correctly into default").toEqualValues({
      title: "Survey Title",
      pages: [{
        "name": "page1",
        elements: [{ type: "text", name: "q1", title: "Title", description: "Description" }]
      }]
    });
    survey.mergeLocalizationJSON(allLocales, ["de"]);
    expect(survey.toJSON(), "merge de locale after en merge").toEqualValues({
      title: { default: "Survey Title", de: "Umfrage Titel" },
      pages: [{
        "name": "page1",
        elements: [{ type: "text", name: "q1", title: { default: "Title", de: "Titel" }, description: { default: "Description", de: "Beschreibung" } }]
      }]
    });
  });
});

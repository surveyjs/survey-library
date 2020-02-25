import { surveyLocalization } from "../src/surveyStrings";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";

import "../src/localization/russian";
import "../src/localization/french";
import "../src/localization/finnish";
import "../src/localization/german";
import "../src/localization/swedish";
import "../src/localization/czech";

export default QUnit.module("LocalizationsTests");

QUnit.test("get default strings", function(assert) {
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "en";
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "unknown";
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "";
});
QUnit.test("add new localization", function(assert) {
  var newLoc = { pageNextText: "Mynext" };
  surveyLocalization.locales["myen"] = newLoc;
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "myen";
  assert.equal(surveyLocalization.getString("pageNextText"), "Mynext");
  assert.equal(surveyLocalization.getString("pagePrevText"), "Previous");
  surveyLocalization.currentLocale = "";
});
QUnit.test("make german as a default location", function(assert) {
  assert.equal(
    surveyLocalization.getString("pagePrevText"),
    "Previous",
    "Get English string"
  );
  surveyLocalization.defaultLocale = "de";
  assert.equal(
    surveyLocalization.getString("pagePrevText"),
    "Zurück",
    "Get German string"
  );
  surveyLocalization.defaultLocale = "en";
  assert.equal(
    surveyLocalization.getString("pagePrevText"),
    "Previous",
    "Get English string again"
  );
});
QUnit.test("set german localization", function(assert) {
  var locales = surveyLocalization.getLocales();
  assert.ok(locales.indexOf("en") > -1, "has en");
  assert.ok(locales.indexOf("de") > -1, "has de");
});
QUnit.test("set german localization", function(assert) {
  var survey = new SurveyModel();
  survey.locale = "de";
  assert.equal(survey.completeText, "Abschließen");
  surveyLocalization.currentLocale = "";
});
QUnit.test("set finnish localization", function(assert) {
  var locales = surveyLocalization.getLocales();
  assert.ok(locales.indexOf("en") > -1, "has en");
  assert.ok(locales.indexOf("fi") > -1, "has fi");
});
QUnit.test("set finnish localization", function(assert) {
  var survey = new SurveyModel();
  survey.locale = "fi";
  assert.equal(survey.completeText, "Valmis");
  surveyLocalization.currentLocale = "";
});
QUnit.test("set swedish localization", function(assert) {
  var locales = surveyLocalization.getLocales();
  assert.ok(locales.indexOf("en") > -1, "has en");
  assert.ok(locales.indexOf("sv") > -1, "has sv");
});
QUnit.test("set swedish localization", function(assert) {
  var survey = new SurveyModel();
  survey.locale = "sv";
  assert.equal(survey.completeText, "Färdig");
  surveyLocalization.currentLocale = "";
});
QUnit.test("Supported locales", function(assert) {
  var localesCounts = surveyLocalization.getLocales().length;
  surveyLocalization.supportedLocales = ["en", "de"];
  assert.equal(
    surveyLocalization.getLocales().length,
    2 + 1,
    "We support only two locales now"
  );
  surveyLocalization.supportedLocales = null;
  assert.equal(
    surveyLocalization.getLocales().length,
    localesCounts,
    "Support all locales"
  );
});
QUnit.test("Do not have empty locale", function(assert) {
  var survey = new SurveyModel();
  surveyLocalization.defaultLocale = "de";
  survey.title = "Title_DE";
  survey.locale = "en";
  survey.title = "Title_EN";
  survey.locale = "";
  assert.deepEqual(survey.toJSON(), {
    title: { en: "Title_EN", default: "Title_DE" }
  });
  surveyLocalization.defaultLocale = "en";
});

QUnit.test("Do not serialize default locale", function(assert) {
  var survey = new SurveyModel();
  surveyLocalization.defaultLocale = "de";
  survey.locale = "de";
  assert.deepEqual(survey.toJSON(), {});
  survey.locale = "";
  surveyLocalization.defaultLocale = "en";
});

QUnit.test(
  "surveyLocalization returns empty on currentLocale if it equals to defaultLocale",
  function(assert) {
    assert.equal(
      surveyLocalization.currentLocale,
      "",
      "It is empty by default"
    );
    surveyLocalization.currentLocale = "de";
    assert.equal(surveyLocalization.currentLocale, "de", "It is 'de'");
    surveyLocalization.defaultLocale = "de";
    assert.equal(surveyLocalization.currentLocale, "", "It is empty again");
    surveyLocalization.defaultLocale = "en";
    assert.equal(surveyLocalization.currentLocale, "de", "It is 'de' again");
    surveyLocalization.currentLocale = "";
    var survey = new SurveyModel();
    survey.locale = "en";
    assert.equal(survey.locale, "", "Locale is empty, since 'en' is default");
  }
);

QUnit.test("Fix the bug, when the default locale is set as specific", function(
  assert
) {
  var json = {
    elements: [
      {
        type: "text",
        name: "q1",
        title: {
          en: "English 1"
        }
      }
    ]
  };
  var survey = new SurveyModel(json);
  var question = <Question>survey.getQuestionByName("q1");
  assert.equal(
    question.locTitle.renderedHtml,
    "English 1",
    "Get the english locale"
  );
});

QUnit.test("Return English localization texts if text not exist", function(
  assert
) {
  surveyLocalization.locales["en"]["custom_test_key"] = "item";
  var oldDl = surveyLocalization.defaultLocale;
  var oldCl = surveyLocalization.currentLocale;
  surveyLocalization.defaultLocale = "de";
  surveyLocalization.currentLocale = "de";
  assert.equal(surveyLocalization.getString("custom_test_key"), "item");
  surveyLocalization.defaultLocale = oldDl;
  surveyLocalization.currentLocale = oldCl;
});

QUnit.test(
  "Czech locale is 'cs', but support the old one 'cz', Bug #2004",
  function(assert) {
    var oldDl = surveyLocalization.defaultLocale;
    var oldCl = surveyLocalization.currentLocale;
    surveyLocalization.currentLocale = "cz";
    assert.equal(surveyLocalization.currentLocale, "cs", "sz => sc, current");
    surveyLocalization.defaultLocale = "cz";
    assert.equal(surveyLocalization.defaultLocale, "cs", "sz => sc, default");
    assert.equal(
      surveyLocalization.getString("pagePrevText"),
      "Předchozí",
      "Set locale correctly"
    );
    surveyLocalization.defaultLocale = oldDl;
    surveyLocalization.currentLocale = oldCl;
  }
);

import { surveyLocalization } from "../src/surveyStrings";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";

import "../src/localization/russian";
import "../src/localization/french";
import "../src/localization/finnish";
import "../src/localization/german";
import "../src/localization/swedish";
import "../src/localization/czech";
import "../src/localization/portuguese";
import "../src/localization/portuguese-br";
import { QuestionCheckboxBase } from "../src/question_baseselect";
import { englishStrings } from "../src/localization/english";

export default QUnit.module("LocalizationsTests");

QUnit.test("get default strings", function(assert) {
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "en";
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "unknown";
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "";
});
QUnit.test("get default strings for unknown default locale", function(assert) {
  surveyLocalization.defaultLocale = "unknown";
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "en";
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "unknown";
  assert.equal(surveyLocalization.getString("pageNextText"), "Next");
  surveyLocalization.currentLocale = "";
  surveyLocalization.defaultLocale = "en";
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
  assert.equal(survey.completeText, "Complete");
  survey.locale = "de";
  assert.equal(survey.completeText, "Abschließen");
  survey.locale = "";
  assert.equal(survey.completeText, "Complete");
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
  assert.equal(survey.completeText, "Slutför");
  surveyLocalization.currentLocale = "";
});
QUnit.test("Supported locales + removeDefaultLoc", function(assert) {
  var localesCounts = surveyLocalization.getLocales().length;
  surveyLocalization.supportedLocales = ["en", "de"];
  assert.equal(
    surveyLocalization.getLocales().length,
    2 + 1,
    "We support only two locales now"
  );
  assert.deepEqual(
    surveyLocalization.getLocales(true),
    ["", "de"],
    "We remove 'en' locales"
  );
  surveyLocalization.supportedLocales = null;
  assert.equal(
    surveyLocalization.getLocales().length,
    localesCounts,
    "Support all locales"
  );
  assert.equal(
    surveyLocalization.getLocales(true).length,
    localesCounts - 1,
    "Support all locales, but without en"
  );
});
QUnit.test("getLocales & showNamesInEnglish, #8694", function(assert) {
  assert.equal(surveyLocalization.getLocaleName("de", false), "deutsch", "#1");
  assert.equal(surveyLocalization.getLocaleName("de", true), "German", "#2");
  assert.equal(surveyLocalization.getLocaleName("de"), "deutsch", "#3");
  surveyLocalization.showNamesInEnglish = true;
  assert.equal(surveyLocalization.getLocaleName("de"), "German", "#4");
  surveyLocalization.showNamesInEnglish = false;
  assert.equal(surveyLocalization.getLocaleName("de"), "deutsch", "#5");
});

QUnit.test("Do not have empty locale", function(assert) {
  var survey = new SurveyModel();
  surveyLocalization.defaultLocale = "de";
  survey.title = "Title_DE";
  survey.locale = "en";
  survey.title = "Title_EN";
  survey.locale = "";
  assert.deepEqual(survey.toJSON(), {
    title: { en: "Title_EN", default: "Title_DE" },
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
          en: "English 1",
        },
      },
    ],
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
QUnit.test(
  "Do not change currentLocale on changing survey.locale",
  function(assert) {
    const survey1 = new SurveyModel({});
    const survey2 = new SurveyModel({});
    assert.equal(survey1.locale, "", "Use the default locale, survey1");
    assert.equal(survey2.locale, "", "Use the default locale, survey2");
    survey1.locale = "de";
    assert.equal(survey1.locale, "de", "de locale, survey1");
    assert.equal(survey2.locale, "", "Use the default locale, survey2");
    survey2.locale = "fr";
    assert.equal(survey1.locale, "de", "de locale, survey1");
    assert.equal(survey2.locale, "fr", "fr locale, survey2");
    assert.equal(surveyLocalization.currentLocale, "", "Do not change the current locale");
  }
);
QUnit.test(
  "Check object locale on changing survey locale",
  function(assert) {
    const survey = new SurveyModel({ elements: [{ type: "checkbox", name: "q1", choices: [1, 2] }] });
    const question = <QuestionCheckboxBase>survey.getQuestionByName("q1");
    assert.equal(question.getLocale(), "", "question has English locale right now");
    survey.locale = "de";
    assert.equal(question.survey.getLocale(), "de", "question survey has Deutsch locale");
    assert.equal(question.getLocale(), "de", "question has Deutsch locale right now");
  }
);
QUnit.test("Clear localization locale value if it equals to default and it is not empty and default is empty", function(assert) {
  let survey = new SurveyModel({ title: { de: "Hallo" } });
  surveyLocalization.defaultLocale = "de";
  assert.equal(survey.title, "Hallo", "Get the correct value");
  let counter = 0;
  survey.locTitle.onChanged = () => { counter++; };
  survey.title = "";
  assert.equal(survey.title, "", "Value is cleared");
  assert.equal(counter, 1, "str changed is fired");

  survey = new SurveyModel({ title: { de: "Hallo" } });
  surveyLocalization.defaultLocale = "de";
  assert.equal(survey.title, "Hallo", "Get the correct value, #2");
  survey.title = "Hello";
  assert.equal(survey.title, "Hello", "Value set correctly, #3");

  surveyLocalization.defaultLocale = "en";
});

QUnit.test("Support language dialect", function(assert) {
  assert.equal(surveyLocalization.getString("pagePrevText", "pt-br"), "Anterior", "get from pt");
  assert.equal(surveyLocalization.getString("loadingFile", "pt-br"), "Carregando...", "get from pt-br");
});

QUnit.test("Support language dialect & current locale", function(assert) {
  const locABABTest = {
    prop1: "Prop1 ABABTest",
    prop2: "Prop2 ABABTest",
  };
  const locABTest = {
    prop2: "Prop2 ABTest",
    prop3: "Prop3 ABTest",
  };
  const locCDCDTest = {
    prop3: "Prop3 CDCDTest",
    prop4: "Prop4 CDCDTest",
  };
  const locCDTest = {
    prop4: "Prop4 CDTest",
    prop5: "Prop5 CDTest",
  };
  const locEFEFTest = {
    prop5: "Prop5 EFEFTest",
    prop6: "Prop6 EFEFTest",
  };
  const locEFTest = {
    prop6: "Prop5 EFTest",
    prop7: "Prop7 EFTest",
  };
  englishStrings["prop7"] = "Prop7 EnTest";
  englishStrings["prop8"] = "Prop8 EnTest";
  surveyLocalization.locales["ab-AB"] = locABABTest;
  surveyLocalization.locales["ab"] = locABTest;
  surveyLocalization.locales["cd-CD"] = locCDCDTest;
  surveyLocalization.locales["cd"] = locCDTest;
  surveyLocalization.locales["ef-EF"] = locEFEFTest;
  surveyLocalization.locales["ef"] = locEFTest;
  surveyLocalization.defaultLocale = "ef-EF";
  surveyLocalization.currentLocale = "cd-CD";
  assert.equal(surveyLocalization.getString("prop1", "ab-AB"), "Prop1 ABABTest", "prop1");
  assert.equal(surveyLocalization.getString("prop2", "ab-AB"), "Prop2 ABABTest", "prop2");
  assert.equal(surveyLocalization.getString("prop3", "ab-AB"), "Prop3 ABTest", "prop3");
  assert.equal(surveyLocalization.getString("prop4", "ab-AB"), "Prop4 CDCDTest", "prop4");
  assert.equal(surveyLocalization.getString("prop5", "ab-AB"), "Prop5 CDTest", "prop5");
  assert.equal(surveyLocalization.getString("prop6", "ab-AB"), "Prop6 EFEFTest", "prop6");
  assert.equal(surveyLocalization.getString("prop7", "ab-AB"), "Prop7 EFTest", "prop7");
  assert.equal(surveyLocalization.getString("prop8", "ab-AB"), "Prop8 EnTest", "prop8");

  surveyLocalization.defaultLocale = "en";
  surveyLocalization.currentLocale = "";
  delete surveyLocalization.locales["ab-AB"];
  delete surveyLocalization.locales["ab"];
  delete surveyLocalization.locales["cd-CD"];
  delete surveyLocalization.locales["cd"];
  delete surveyLocalization.locales["ef-EF"];
  delete surveyLocalization.locales["ef"];
});
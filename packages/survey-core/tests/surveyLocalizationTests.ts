import { surveyLocalization } from "../src/surveyStrings";
import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";

import "../src/localization/russian";
import "../src/localization/french";
import "../src/localization/finnish";
import "../src/localization/german";
import "../src/localization/swedish";
import "../src/localization/czech";
import "../src/localization/serbian";
import "../src/localization/ukrainian";
import "../src/localization/portuguese";
import "../src/localization/portuguese-br";
import "../src/localization/greek";
import { QuestionCheckboxBase } from "../src/question_baseselect";
import { englishStrings } from "../src/localization/english";

import { describe, test, expect } from "vitest";
describe("LocalizationsTests", () => {
  test("get default strings", () => {
    expect(surveyLocalization.getString("pageNextText")).toBe("Next");
    surveyLocalization.currentLocale = "en";
    expect(surveyLocalization.getString("pageNextText")).toBe("Next");
    surveyLocalization.currentLocale = "unknown";
    expect(surveyLocalization.getString("pageNextText")).toBe("Next");
    surveyLocalization.currentLocale = "";
  });
  test("get default strings for unknown default locale", () => {
    surveyLocalization.defaultLocale = "unknown";
    expect(surveyLocalization.getString("pageNextText")).toBe("Next");
    surveyLocalization.currentLocale = "en";
    expect(surveyLocalization.getString("pageNextText")).toBe("Next");
    surveyLocalization.currentLocale = "unknown";
    expect(surveyLocalization.getString("pageNextText")).toBe("Next");
    surveyLocalization.currentLocale = "";
    surveyLocalization.defaultLocale = "en";
  });
  test("add new localization", () => {
    var newLoc = { pageNextText: "Mynext" };
    surveyLocalization.locales["myen"] = newLoc;
    expect(surveyLocalization.getString("pageNextText")).toBe("Next");
    surveyLocalization.currentLocale = "myen";
    expect(surveyLocalization.getString("pageNextText")).toBe("Mynext");
    expect(surveyLocalization.getString("pagePrevText")).toBe("Previous");
    surveyLocalization.currentLocale = "";
  });
  test("make german as a default location", () => {
    expect(surveyLocalization.getString("pagePrevText"), "Get English string").toBe("Previous");
    surveyLocalization.defaultLocale = "de";
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/only-english-or-code
    expect(surveyLocalization.getString("pagePrevText"), "Get German string").toBe("Zurück");
    surveyLocalization.defaultLocale = "en";
    expect(surveyLocalization.getString("pagePrevText"), "Get English string again").toBe("Previous");
  });
  test("set german localization", () => {
    var locales = surveyLocalization.getLocales();
    expect(locales.indexOf("en") > -1, "has en").toBeTruthy();
    expect(locales.indexOf("de") > -1, "has de").toBeTruthy();
  });
  test("set german localization", () => {
    var survey = new SurveyModel();
    expect(survey.completeText).toBe("Complete");
    survey.locale = "de";
    expect(survey.completeText).toBe("Abschließen"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    survey.locale = "";
    expect(survey.completeText).toBe("Complete");
  });
  test("set finnish localization", () => {
    var locales = surveyLocalization.getLocales();
    expect(locales.indexOf("en") > -1, "has en").toBeTruthy();
    expect(locales.indexOf("fi") > -1, "has fi").toBeTruthy();
  });
  test("set finnish localization", () => {
    var survey = new SurveyModel();
    survey.locale = "fi";
    expect(survey.completeText).toBe("Valmis");
    surveyLocalization.currentLocale = "";
  });
  test("set swedish localization", () => {
    var locales = surveyLocalization.getLocales();
    expect(locales.indexOf("en") > -1, "has en").toBeTruthy();
    expect(locales.indexOf("sv") > -1, "has sv").toBeTruthy();
  });
  test("set swedish localization", () => {
    var survey = new SurveyModel();
    survey.locale = "sv";
    expect(survey.completeText).toBe("Slutför"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    surveyLocalization.currentLocale = "";
  });
  test("Supported locales + removeDefaultLoc", () => {
    var localesCounts = surveyLocalization.getLocales().length;
    surveyLocalization.supportedLocales = ["en", "de"];
    expect(surveyLocalization.getLocales().length, "We support only two locales now").toBe(2 + 1);
    expect(surveyLocalization.getLocales(true), "We remove 'en' locales").toEqual(["", "de"]);
    surveyLocalization.supportedLocales = null;
    expect(surveyLocalization.getLocales().length, "Support all locales").toBe(localesCounts);
    expect(surveyLocalization.getLocales(true).length, "Support all locales, but without en").toBe(localesCounts - 1);
  });
  test("getLocales & showNamesInEnglish, #8694", () => {
    expect(surveyLocalization.getLocaleName("de", false), "#1").toBe("deutsch");
    expect(surveyLocalization.getLocaleName("de", true), "#2").toBe("German");
    expect(surveyLocalization.getLocaleName("de"), "#3").toBe("deutsch");
    surveyLocalization.showNamesInEnglish = true;
    expect(surveyLocalization.getLocaleName("de"), "#4").toBe("German");
    surveyLocalization.showNamesInEnglish = false;
    expect(surveyLocalization.getLocaleName("de"), "#5").toBe("deutsch");
  });

  test("Do not have empty locale", () => {
    var survey = new SurveyModel();
    surveyLocalization.defaultLocale = "de";
    survey.title = "Title_DE";
    survey.locale = "en";
    survey.title = "Title_EN";
    survey.locale = "";
    expect(survey.toJSON()).toEqual({
      title: { en: "Title_EN", default: "Title_DE" },
    });
    surveyLocalization.defaultLocale = "en";
  });

  test("Do not serialize default locale", () => {
    var survey = new SurveyModel();
    surveyLocalization.defaultLocale = "de";
    survey.locale = "de";
    expect(survey.toJSON()).toEqual({});
    survey.locale = "";
    surveyLocalization.defaultLocale = "en";
  });

  test("surveyLocalization returns empty on currentLocale if it equals to defaultLocale", () => {
    expect(surveyLocalization.currentLocale, "It is empty by default").toBe("");
    surveyLocalization.currentLocale = "de";
    expect(surveyLocalization.currentLocale, "It is 'de'").toBe("de");
    surveyLocalization.defaultLocale = "de";
    expect(surveyLocalization.currentLocale, "It is empty again").toBe("");
    surveyLocalization.defaultLocale = "en";
    expect(surveyLocalization.currentLocale, "It is 'de' again").toBe("de");
    surveyLocalization.currentLocale = "";
    var survey = new SurveyModel();
    survey.locale = "en";
    expect(survey.locale, "Locale is empty, since 'en' is default").toBe("");
  });

  test("Fix the bug, when the default locale is set as specific", () => {
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
    expect(question.locTitle.renderedHtml, "Get the english locale").toBe("English 1");
  });

  test("Return English localization texts if text not exist", () => {
    surveyLocalization.locales["en"]["custom_test_key"] = "item";
    var oldDl = surveyLocalization.defaultLocale;
    var oldCl = surveyLocalization.currentLocale;
    surveyLocalization.defaultLocale = "de";
    surveyLocalization.currentLocale = "de";
    expect(surveyLocalization.getString("custom_test_key")).toBe("item");
    surveyLocalization.defaultLocale = oldDl;
    surveyLocalization.currentLocale = oldCl;
  });

  test("Czech locale is 'cs', but support the old one 'cz', Bug #2004", () => {
    var oldDl = surveyLocalization.defaultLocale;
    var oldCl = surveyLocalization.currentLocale;
    surveyLocalization.currentLocale = "cz";
    expect(surveyLocalization.currentLocale, "sz => sc, current").toBe("cs");
    surveyLocalization.defaultLocale = "cz";
    expect(surveyLocalization.defaultLocale, "sz => sc, default").toBe("cs");
    expect(surveyLocalization.getString("pagePrevText"), "Set locale correctly").toBe("Předchozí"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    surveyLocalization.defaultLocale = oldDl;
    surveyLocalization.currentLocale = oldCl;
  });
  test("Seribian locale is 'sr', but support the old/incorrect one 'rs', Bug #10053", () => {
    var oldDl = surveyLocalization.defaultLocale;
    var oldCl = surveyLocalization.currentLocale;
    surveyLocalization.currentLocale = "rs";
    expect(surveyLocalization.currentLocale, "rs => sr, current").toBe("sr");
    surveyLocalization.defaultLocale = "rs";
    expect(surveyLocalization.defaultLocale, "rs => sr, default").toBe("sr");
    expect(surveyLocalization.getString("pagePrevText"), "Set locale correctly").toBe("Nazad");
    surveyLocalization.defaultLocale = oldDl;
    surveyLocalization.currentLocale = oldCl;
  });
  test("Ukraine locale is 'uk', but support the old one 'ua', Bug #9908", () => {
    var oldDl = surveyLocalization.defaultLocale;
    var oldCl = surveyLocalization.currentLocale;
    surveyLocalization.currentLocale = "ua";
    expect(surveyLocalization.currentLocale, "ua => uk, current").toBe("uk");
    surveyLocalization.defaultLocale = "ua";
    expect(surveyLocalization.defaultLocale, "ua => uk, default").toBe("uk");
    expect(surveyLocalization.getString("pagePrevText"), "Set locale correctly").toBe("Назад"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    surveyLocalization.defaultLocale = oldDl;
    surveyLocalization.currentLocale = oldCl;
  });
  test("Greek locale is 'el', but support the old one 'gr', Bug #10156", () => {
    var oldDl = surveyLocalization.defaultLocale;
    var oldCl = surveyLocalization.currentLocale;
    surveyLocalization.currentLocale = "gr";
    expect(surveyLocalization.currentLocale, "gr => el, current").toBe("el");
    surveyLocalization.defaultLocale = "gr";
    expect(surveyLocalization.defaultLocale, "gr => el, default").toBe("el");
    expect(surveyLocalization.getString("pagePrevText"), "Set locale correctly").toBe("Προηγούμενο"); // eslint-disable-line surveyjs/eslint-plugin-i18n/only-english-or-code
    surveyLocalization.defaultLocale = oldDl;
    surveyLocalization.currentLocale = oldCl;
  });
  test("Do not change currentLocale on changing survey.locale", () => {
    const survey1 = new SurveyModel({});
    const survey2 = new SurveyModel({});
    expect(survey1.locale, "Use the default locale, survey1").toBe("");
    expect(survey2.locale, "Use the default locale, survey2").toBe("");
    survey1.locale = "de";
    expect(survey1.locale, "de locale, survey1").toBe("de");
    expect(survey2.locale, "Use the default locale, survey2").toBe("");
    survey2.locale = "fr";
    expect(survey1.locale, "de locale, survey1").toBe("de");
    expect(survey2.locale, "fr locale, survey2").toBe("fr");
    expect(surveyLocalization.currentLocale, "Do not change the current locale").toBe("");
  });
  test("Check object locale on changing survey locale", () => {
    const survey = new SurveyModel({ elements: [{ type: "checkbox", name: "q1", choices: [1, 2] }] });
    const question = <QuestionCheckboxBase>survey.getQuestionByName("q1");
    expect(question.getLocale(), "question has English locale right now").toBe("");
    survey.locale = "de";
    expect(question.survey.getLocale(), "question survey has Deutsch locale").toBe("de");
    expect(question.getLocale(), "question has Deutsch locale right now").toBe("de");
  });
  test("Clear localization locale value if it equals to default and it is not empty and default is empty", () => {
    let survey = new SurveyModel({ title: { de: "Hallo" } });
    surveyLocalization.defaultLocale = "de";
    expect(survey.title, "Get the correct value").toBe("Hallo");
    let counter = 0;
    survey.locTitle.onChanged = () => { counter++; };
    survey.title = "";
    expect(survey.title, "Value is cleared").toBe("");
    expect(counter, "str changed is fired").toBe(1);

    survey = new SurveyModel({ title: { de: "Hallo" } });
    surveyLocalization.defaultLocale = "de";
    expect(survey.title, "Get the correct value, #2").toBe("Hallo");
    survey.title = "Hello";
    expect(survey.title, "Value set correctly, #3").toBe("Hello");

    surveyLocalization.defaultLocale = "en";
  });

  test("Support language dialect", () => {
    expect(surveyLocalization.getString("pagePrevText", "pt-br"), "get from pt").toBe("Anterior");
    expect(surveyLocalization.getString("loadingFile", "pt-br"), "get from pt-br").toBe("Carregando...");
  });

  test("Support language dialect & current locale", () => {
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
    expect(surveyLocalization.getString("prop1", "ab-AB"), "prop1").toBe("Prop1 ABABTest");
    expect(surveyLocalization.getString("prop2", "ab-AB"), "prop2").toBe("Prop2 ABABTest");
    expect(surveyLocalization.getString("prop3", "ab-AB"), "prop3").toBe("Prop3 ABTest");
    expect(surveyLocalization.getString("prop4", "ab-AB"), "prop4").toBe("Prop4 CDCDTest");
    expect(surveyLocalization.getString("prop5", "ab-AB"), "prop5").toBe("Prop5 CDTest");
    expect(surveyLocalization.getString("prop6", "ab-AB"), "prop6").toBe("Prop6 EFEFTest");
    expect(surveyLocalization.getString("prop7", "ab-AB"), "prop7").toBe("Prop7 EFTest");
    expect(surveyLocalization.getString("prop8", "ab-AB"), "prop8").toBe("Prop8 EnTest");

    surveyLocalization.defaultLocale = "en";
    surveyLocalization.currentLocale = "";
    delete surveyLocalization.locales["ab-AB"];
    delete surveyLocalization.locales["ab"];
    delete surveyLocalization.locales["cd-CD"];
    delete surveyLocalization.locales["cd"];
    delete surveyLocalization.locales["ef-EF"];
    delete surveyLocalization.locales["ef"];
  });
});

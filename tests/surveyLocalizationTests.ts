import {surveyLocalization} from "../src/surveyStrings";
import {SurveyModel} from "../src/survey";

import '../src/localization/russian';
import '../src/localization/french';
import '../src/localization/finnish';
import '../src/localization/german';
import '../src/localization/swedish';

export default QUnit.module("LocalizationsTests");

QUnit.test("get default strings", function (assert) {
    assert.equal(surveyLocalization.getString("pageNextText"), "Next");
    surveyLocalization.currentLocale = "en";
    assert.equal(surveyLocalization.getString("pageNextText"), "Next");
    surveyLocalization.currentLocale = "unknown";
    assert.equal(surveyLocalization.getString("pageNextText"), "Next");
    surveyLocalization.currentLocale = "";
});
QUnit.test("add new localization", function (assert) {
    var newLoc = { pageNextText: "Mynext" };
    surveyLocalization.locales["myen"] = newLoc;
    assert.equal(surveyLocalization.getString("pageNextText"), "Next");
    surveyLocalization.currentLocale = "myen";
    assert.equal(surveyLocalization.getString("pageNextText"), "Mynext");
    assert.equal(surveyLocalization.getString("pagePrevText"), "Previous");
    surveyLocalization.currentLocale = "";
});
QUnit.test("make german as a default location", function (assert) {
    assert.equal(surveyLocalization.getString("pagePrevText"), "Previous", "Get English string");
    surveyLocalization.defaultLocale = "de";
    assert.equal(surveyLocalization.getString("pagePrevText"), "Zurück", "Get German string");
    surveyLocalization.defaultLocale = "en";
    assert.equal(surveyLocalization.getString("pagePrevText"), "Previous", "Get English string again");
});
QUnit.test("set german localization", function (assert) {
    var locales = surveyLocalization.getLocales();
    assert.ok(locales.indexOf("en") > -1, "has en");
    assert.ok(locales.indexOf("de") > -1, "has de");
});
QUnit.test("set german localization", function (assert) {
    var survey = new SurveyModel();
    survey.locale = "de";
    assert.equal(survey.completeText, "Fertig");
    surveyLocalization.currentLocale = "";
});
QUnit.test("set finnish localization", function (assert) {
    var locales = surveyLocalization.getLocales();
    assert.ok(locales.indexOf("en") > -1, "has en");
    assert.ok(locales.indexOf("fi") > -1, "has fi");
});
QUnit.test("set finnish localization", function (assert) {
    var survey = new SurveyModel();
    survey.locale = "fi";
    assert.equal(survey.completeText, "Valmis");
    surveyLocalization.currentLocale = "";
});
QUnit.test("set swedish localization", function (assert) {
    var locales = surveyLocalization.getLocales();
    assert.ok(locales.indexOf("en") > -1, "has en");
    assert.ok(locales.indexOf("sv") > -1, "has sv");
});
QUnit.test("set swedish localization", function (assert) {
    var survey = new SurveyModel();
    survey.locale = "sv";
    assert.equal(survey.completeText, "Färdig");
    surveyLocalization.currentLocale = "";
});
QUnit.test("Supported locales", function (assert) {
    var localesCounts = surveyLocalization.getLocales().length;
    surveyLocalization.supportedLocales = ["en", "de"];
    assert.equal(surveyLocalization.getLocales().length, 2 + 1, "We support only two locales now");
    surveyLocalization.supportedLocales = null;
    assert.equal(surveyLocalization.getLocales().length, localesCounts, "Support all locales");
});

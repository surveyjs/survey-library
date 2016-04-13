/// <reference path="../src/surveyStrings.ts" />
module Survey.LocalizationsTests {
    QUnit.module("LocalizationsTests");

    QUnit.test("get default strings", function (assert) {
        assert.equal(surveyLocalization.getString("pageNextText"), "Next");
        surveyLocalization.currentLocale = "en";
        assert.equal(surveyLocalization.getString("pageNextText"), "Next");
        surveyLocalization.currentLocale = "unknown";
        assert.equal(surveyLocalization.getString("pageNextText"), "Next");
    });
    QUnit.test("add new localization", function (assert) {
        var newLoc = { pageNextText: "Mynext" };
        surveyLocalization.locales["myen"] = newLoc;
        assert.equal(surveyLocalization.getString("pageNextText"), "Next");
        surveyLocalization.currentLocale = "myen";
        assert.equal(surveyLocalization.getString("pageNextText"), "Mynext");
        assert.equal(surveyLocalization.getString("pagePrevText"), "Previous");
    });

}
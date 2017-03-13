import {Selector, ClientFunction} from 'testcafe';

export const frameworks = ['knockout'/*, 'knockout/bootstrap', 'react/standard', 'react/bootstrap'*/];
export const url = 'http://127.0.0.1:8080/testCafe/';

export const initSurvey = ClientFunction((json) => {
    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    Survey.Survey.cssType = "bootstrap";

    var model = new Survey.Model(json);

    model.onComplete.add(function (model) {
        window.SurveyResult = model.data;
    });

    model.render("surveyElement");
    window.survey = model;
});

export const getSurveyResult = ClientFunction(() => window.SurveyResult);

export const setOptions = ClientFunction((questionName, modValue) => {
    var mergeOptions = function (obj1, obj2) {
        for (var attrname in obj2) {
            obj1[attrname] = obj2[attrname];
        }
    };
    var q = survey.getQuestionByName(questionName || 'car');
    mergeOptions(q, modValue);
    survey.render();
});
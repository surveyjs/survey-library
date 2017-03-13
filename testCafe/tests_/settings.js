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


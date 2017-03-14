import {Selector, ClientFunction} from 'testcafe';

export const frameworks = [
        //'knockout',
        'react'
    ];
export const url = 'http://127.0.0.1:8080/examples/';

export const initSurvey = ClientFunction((framework, json) => {
    Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
    Survey.Survey.cssType = "bootstrap";

    var model = new Survey.Model(json);

    var surveyComplete = function (model) {
        window.SurveyResult = model.data;
    };

    document.getElementById("surveyElement").innerHTML = "";
    if(framework === "knockout") {
        model.onComplete.add(surveyComplete);
        model.render("surveyElement");
    }
    else if(framework === "react") {
        ReactDOM.render(React.createElement(Survey.Survey, { model: model, onComplete: surveyComplete }), document.getElementById("surveyElement"));
    }

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
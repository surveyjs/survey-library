import { Selector, ClientFunction } from "testcafe";

export const frameworks = ["knockout", "jquery", "react", "vue"];
export const url = "http://127.0.0.1:8080/examples/";

export const initSurvey = ClientFunction(
  (framework, json) => {


    var model = new Survey.Model(json);

    var surveyComplete = function (model) {
      window.SurveyResult = model.data;
    };
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      document.getElementById("surveyElement").innerHTML = "";
      model.render("surveyElement");
    } else if (framework === "jquery") {
      document.getElementById("surveyElement").innerHTML = "";
      $("#surveyElement").Survey({ model: model });
    } else if (framework === "react") {
      document.getElementById("surveyElement").innerHTML = "";
      ReactDOM.render(
        React.createElement(Survey.Survey, {
          model: model,
          onComplete: surveyComplete
        }),
        document.getElementById("surveyElement")
      );
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<survey :survey='survey'/>";
      !!window.vueApp && vueApp.$destroy();
      window.vueApp = new Vue({
        el: "#surveyElement",
        data: { survey: model }
      });
    }

    window.survey = model;
  }
);

export const getSurveyResult = ClientFunction(() => window.SurveyResult);

export const setOptions = ClientFunction((questionName, modValue) => {
  var mergeOptions = function (obj1, obj2) {
    for (var attrname in obj2) {
      obj1[attrname] = obj2[attrname];
    }
  };
  var q = survey.getQuestionByName(questionName || "car");
  mergeOptions(q, modValue);
  survey.render();
});

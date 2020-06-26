import { frameworks, url, setOptions, getSurveyResult } from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `customCss`;
const initSurvey = ClientFunction((framework, json) => {
  Survey.defaultBootstrapCss.navigationButton = "btn btn-primary";
  Survey.StylesManager.applyTheme("bootstrap");

  var model = new Survey.Model(json);

  model.onComplete.add(function(model) {
    window.SurveyResult = model.data;
  });

  var myCss = {
    matrix: { root: "table table-striped" },
    navigationButton: "button btn-lg"
  };

  if (framework === "knockout") {
    model.css = myCss;
    model.render("surveyElement");
  } else if (framework === "react") {
    ReactDOM.render(
      React.createElement(Survey.Survey, { model: model, css: myCss }),
      document.getElementById("surveyElement")
    );
  } else if (framework === "vue") {
    model.css = myCss;
    var app = new Vue({
      el: "#surveyElement",
      data: {
        survey: model
      }
    });
  } else if (framework === "jquery") {
    $("#surveyElement").Survey({
      model: model,
      css: myCss
    });
  } else if (framework === "angular") {
    function onAngularComponentInit() {
      Survey.SurveyNG.render("surveyElement", {
        model: model,
        css: myCss
      });
    }
    var HelloApp = ng.core
      .Component({
        selector: "ng-app",
        template:
          '<div id="surveyContainer" class="survey-container contentcontainer codecontainer">' +
          '<div id="surveyElement"></div></div>'
      })
      .Class({
        constructor: function() {},
        ngOnInit: function() {
          onAngularComponentInit();
        }
      });
    document.addEventListener("DOMContentLoaded", function() {
      ng.platformBrowserDynamic.bootstrap(HelloApp);
    });
  }

  window.survey = model;
});

const json = {
  questions: [
    {
      type: "matrix",
      name: "Quality",
      title:
        "Please indicate if you agree or disagree with the following statements",
      columns: [
        { value: 1, text: "Strongly Disagree" },
        { value: 2, text: "Disagree" },
        { value: 3, text: "Neutral" },
        { value: 4, text: "Agree" },
        { value: 5, text: "Strongly Agree" }
      ],
      rows: [
        { value: "affordable", text: "Product is affordable" },
        { value: "does what it claims", text: "Product does what it claims" },
        {
          value: "better than others",
          text: "Product is better than other products on the market"
        },
        { value: "easy to use", text: "Product is easy to use" }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`check custom class`, async t => {
    const isCustomClassExist = ClientFunction(() =>
      document
        .querySelector(`input[value="Complete"]`)
        .classList.contains(`btn-lg`)
    );
    assert(await isCustomClassExist());
  });
});

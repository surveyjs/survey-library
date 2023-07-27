import { frameworks, url } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "customCss";
const initSurvey = ClientFunction((framework, json) => {
  window["Survey"].defaultBootstrapCss.navigationButton = "btn btn-primary";
  window["Survey"].StylesManager.applyTheme("bootstrap");

  var model = new window["Survey"].Model(json);

  model.onComplete.add(function (model) {
    window["SurveyResult"] = model.data;
  });

  var myCss = {
    matrix: { root: "table table-striped" },
    navigationButton: "button btn-lg",
  };

  if (framework === "knockout") {
    model.css = myCss;
    model.render("surveyElement");
  } else if (framework === "react") {
    window["ReactDOM"].render(
      window["React"].createElement(window["Survey"].Survey, {
        model: model,
        css: myCss,
      }),
      document.getElementById("surveyElement")
    );
  } else if (framework === "vue") {
    model.css = myCss;
    var app = new window["Vue"]({
      el: "#surveyElement",
      data: {
        survey: model,
      },
    });
  } else if (framework === "angular" || framework === "vue3") {
    model.css = myCss;
    window.setSurvey(model);
  }
  window["survey"] = model;
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
        { value: 5, text: "Strongly Agree" },
      ],
      rows: [
        { value: "affordable", text: "Product is affordable" },
        { value: "does what it claims", text: "Product does what it claims" },
        {
          value: "better than others",
          text: "Product is better than other products on the market",
        },
        { value: "easy to use", text: "Product is easy to use" },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("check custom class", async (t) => {
    await t
      .expect(Selector('input[value="Complete"]').classNames)
      .contains("btn-lg");
  });
});

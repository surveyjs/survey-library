import { frameworks, url, getSurveyResult } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "popupSurvey";
const initPopupSurvey = ClientFunction(
  (framework, json) => {
    // eslint-disable-next-line no-console
    console.error = (msg) => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.warn = (msg) => {
      throw new Error(msg);
    };
    // eslint-disable-next-line no-console
    console.log("surveyjs console.error and console.warn override");

    const model = new window["Survey"].Model(json);
    const surveyComplete = function (model) {
      window["SurveyResult"] = model.data;
      document.getElementById("surveyResultElement").innerHTML = JSON.stringify(
        model.data
      );
    };
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      const popupSurvey = new window["Survey"].PopupSurvey(undefined, model);
      popupSurvey.show();
    } else if (framework === "react") {
      document.getElementById("surveyElement").innerHTML = "";
      window["ReactDOM"].render(
        window["React"].createElement(window["Survey"].PopupSurvey, {
          model: model,
          onComplete: surveyComplete,
        }),
        document.getElementById("surveyElement")
      );
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<popup-survey :survey='survey'/>";
      !!window["vueApp"] && window["vueApp"].$destroy();
      window["vueApp"] = new window["Vue"]({
        el: "#surveyElement",
        data: { survey: model },
      });
    } else if (framework === "angular") {
      window.setSurvey(model);
    }
    window["survey"] = model;
  }
);

const json = {
  title: "Car survey",
  questions: [
    {
      type: "checkbox",
      name: "car",
      title: "What car are you driving?",
      isRequired: true,
      colCount: 4,
      choices: [
        "None",
        "Ford",
        "Vauxhall",
        "Volkswagen",
        "Nissan",
        "Audi",
        "Mercedes-Benz",
        "BMW",
        "Peugeot",
        "Toyota",
        "Citroen"
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initPopupSurvey(framework, json);
    }
  );

  test.only("Show Popup", async t => {
    let surveyResult;
    const titleSelector = Selector("span").withText("Car survey");
    await t
      .expect(titleSelector.visible).ok()
      .click(titleSelector)
      .click(Selector(".sv_q_checkbox_control_label").withText("Nissan"))
      .click(Selector(".sv_q_checkbox_control_label").withText("Audi"))
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql(["Nissan", "Audi"]);
    await t.expect(titleSelector.exists).notOk();
  });
});

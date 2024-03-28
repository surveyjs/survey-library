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
    window["Survey"].settings.animationEnabled = false;
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
    } else if (framework === "angular" || framework == "vue3") {
      window.setSurvey(model, true, false);
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

  test("Show Popup", async t => {
    let surveyResult;
    const expandCollapseButton = Selector(".sv_window_button_collapse");
    await t
      .expect(expandCollapseButton.visible).ok()
      .click(expandCollapseButton)
      .click(Selector(".sv_q_checkbox_control_label").withText("Nissan"))
      .click(Selector(".sv_q_checkbox_control_label").withText("Audi"))
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.car).eql(["Nissan", "Audi"]);
    await t.expect(expandCollapseButton.exists).notOk();
  });

  test("Check popup styles", async t => {
    await t.resizeWindow(1000, 600);
    const expandCollapseButton = Selector(".sv_window_button_collapse");
    const getStyleWidthInPercents = ClientFunction((prop) => {
      return document.querySelector(".sv_window").style[prop];
    });
    await t
      .expect(expandCollapseButton.visible).ok()
      .click(expandCollapseButton);

    await t
      .expect(getStyleWidthInPercents("width")).eql("60%")
      .expect(getStyleWidthInPercents("max-width")).eql("60%");

    await ClientFunction(() => window["survey"].width = "455px")();

    await t
      .expect(getStyleWidthInPercents("width")).eql("455px")
      .expect(getStyleWidthInPercents("max-width")).eql("455px");
  });
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`;
  test("Check dropdown-popups hiding during parent survey popup scrolling", async t => {
    await t.resizeWindow(1000, 500);
    await initPopupSurvey(framework, {
      title: "Survey title",
      elements: [
        {
          type: "dropdown",
          name: "q1",
          choices: ["Item1", "Item2"]
        },
        {
          type: "dropdown",
          name: "q1",
          choices: ["Item1", "Item2"]
        },
        {
          type: "dropdown",
          name: "q1",
          choices: ["Item1", "Item2"]
        },
        {
          type: "dropdown",
          name: "q1",
          choices: ["Item1", "Item2"]
        }
      ]
    });
    const expandCollapseButton = Selector(".sv_window_button_collapse");
    await t.click(expandCollapseButton)
      .click(Selector(".sv_q_dropdown__filter-string-input"))
      .expect(Selector(".sv-popup__container").filterVisible().exists).ok()
      .scroll(Selector(".sv_window").filterVisible(), "bottom")
      .expect(Selector(".sv-popup__container").filterVisible().exists).notOk();
  });
});
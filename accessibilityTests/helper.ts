import { ClientFunction, Selector } from "testcafe";
// eslint-disable-next-line no-undef
const minimist = require("minimist");

// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2));
const environment = args.env;

export const frameworks = environment
  ? [environment]
  : ["knockout", "react", "vue"];
export const url = "http://127.0.0.1:8080/examples_test/default/";
export const urlV2 = "http://127.0.0.1:8080/examples_test/default/";
export const url_test = "http://127.0.0.1:8080/examples_test/";
export const FLOAT_PRECISION = 0.01;

export const initSurvey = ClientFunction(
  (framework, json, events?, isDesignMode?, props?) => {
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

    json["showQuestionNumbers"] = "on";
    const model = new window["Survey"].Model(json);
    model.setDesignMode(isDesignMode);
    const surveyComplete = function (model) {
      window["SurveyResult"] = model.data;
      document.getElementById("surveyResultElement").innerHTML = JSON.stringify(
        model.data
      );
    };
    if (!!events) {
      for (var str in events) {
        model[str].add(events[str]);
      }
    }
    if (!!props) {
      for (var key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      document.getElementById("surveyElement").innerHTML = "";
      model.render("surveyElement");
    } else if (framework === "react") {
      if(!!(window as any).root) {
        (window as any).root.unmount();
      }
      const root = (window as any).ReactDOMClient.createRoot(document.getElementById("surveyElement"));
      window["root"] = root;
      root.render(
        (window as any).React.createElement((window as any).React.StrictMode,
          { children: (window as any).React.createElement((window as any).SurveyReact.Survey, { model: model, onComplete: surveyComplete }) }),
      );
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<survey :survey='survey'/>";
      !!window["vueApp"] && window["vueApp"].$destroy();
      window["vueApp"] = new window["Vue"]({
        el: "#surveyElement",
        data: { survey: model },
      });
    } else if (framework === "survey-js-ui") {
      document.getElementById("surveyElement").innerHTML = "";
      (window as any).SurveyUI.renderSurvey(model, document.getElementById("surveyElement"));
    } else if (framework === "angular" || framework == "vue3") {
      (window as any).setSurvey(model);
    }
    window["survey"] = model;
  }
);

// https://www.deque.com/axe/core-documentation/api-documentation/#overview
export const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice", "section508", "wcag412"];

export const axeContext = { include: [[".sd-page"]] };
export const axeOptions = {
  runOnly: {
    type: "tag",
    values: axeTags
  },
  rules: {
    //https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
    "color-contrast": {
      enabled: false
    },
    "document-title": {
      enabled: false
    },
    "landmark-one-main": {
      enabled: false
    },
    "page-has-heading-one": {
      enabled: false
    },
    "region": {
      enabled: false
    }
  }
};

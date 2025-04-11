import { Page } from "@playwright/test";
import { RunOptions } from "axe-core";

const environment = process.env.env;

export const frameworks = environment
  ? [environment]
  : ["knockout", "react", "vue"];
export const url = "http://127.0.0.1:8080/examples_test/default/";
export const urlV2 = "http://127.0.0.1:8080/examples_test/default/";
export const url_test = "http://127.0.0.1:8080/examples_test/";
export const FLOAT_PRECISION = 0.01;

export const initSurvey = async (page: Page, framework: string, json: any, isDesignMode?: boolean, props?: any) => {
  await page.evaluate(([framework, json, isDesignMode, props]) => {
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
    const self: any = window;
    const model = new self.Survey.Model(json);
    model.setDesignMode(isDesignMode);
    const surveyComplete = function (model) {
      window["SurveyResult"] = model.data;
      (document.getElementById("surveyResultElement") as HTMLElement).innerHTML = JSON.stringify(
        model.data
      );
    };
    if (!!props) {
      for (var key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);
    const surveyElement: HTMLElement = document.getElementById("surveyElement") as HTMLElement;
    if (framework === "survey-js-ui") {
      surveyElement.innerHTML = "";
      self.SurveyUI.renderSurvey(model, surveyElement);
    } else if (framework === "react") {
      if (!!self.root) {
        self.root.unmount();
      }
      const root = window["ReactDOMClient"].createRoot(document.getElementById("surveyElement"));
      window["root"] = root;
      root.render(
        self.React.createElement(self.React.StrictMode, { children: self.React.createElement(self.SurveyReact.Survey, { model: model, onComplete: surveyComplete }) }),
      );
    } else if (framework === "angular" || framework == "vue3") {
      self.window.setSurvey(model);
    }
    window["survey"] = model;
  }, [framework, json, isDesignMode, props]);
};

// https://www.deque.com/axe/core-documentation/api-documentation/#overview
export const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "best-practice", "section508", "wcag412"];

export const axeContext = ".sd-page";
export const axeOptions: RunOptions = {
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

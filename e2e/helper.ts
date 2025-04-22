import type { Locator, Page } from "@playwright/test";
import { expect } from "@playwright/test";

const minimist = require("minimist");

// eslint-disable-next-line no-undef
const args = minimist(process.argv.slice(2));
const environment = args.env;

export const frameworks = environment
  ? [environment]
  : ["knockout", "react", "vue"/*, "jquery-ui"*/];

// eslint-disable-next-line no-console
//console.log("Frameworks: " + frameworks.join(", "));
export const url = "http://127.0.0.1:8080/examples_test/default/";
export const urlV2 = "http://127.0.0.1:8080/examples_test/defaultV2/";
export const url_test = "http://127.0.0.1:8080/examples_test/";
export const FLOAT_PRECISION = 0.01;

export const applyTheme = async (page: Page, theme: string) => {
  await page.evaluate((theme) => {
    window["Survey"].StylesManager.applyTheme(theme);
  }, theme);
};
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

    //!!!TODO!!!
    //window["Survey"].settings.animationEnabled = false;
    const model = new window["Survey"].Model(json);
    model.setDesignMode(isDesignMode);
    const surveyComplete = function (model) {
      window["SurveyResult"] = model.data;
      document.getElementById("surveyResultElement").innerHTML = JSON.stringify(
        model.data
      );
    };
    if (!!props) {
      for (var key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);

    if (framework === "knockout") {
      document.getElementById("surveyElement").innerHTML = "";
      model.render("surveyElement");
    } else if (framework === "jquery-ui") {
      document.getElementById("surveyElement").innerHTML = "";
      window["$"]("#surveyElement").Survey({
        model: model
      });
    } else if (framework === "survey-js-ui") {
      document.getElementById("surveyElement").innerHTML = "";
      SurveyUI.renderSurvey(model, document.getElementById("surveyElement"));
    } else if (framework === "react") {
      if (!!window.root) {
        window.root.unmount();
      }
      const root = window["ReactDOM"].createRoot(document.getElementById("surveyElement"));
      window["root"] = root;
      root.render(
        React.createElement(React.StrictMode, { children: React.createElement(SurveyReact.Survey, { model: model, onComplete: surveyComplete }) }),
      );
    } else if (framework === "vue") {
      document.getElementById("surveyElement").innerHTML =
        "<survey :survey='survey'/>";
      !!window["vueApp"] && window["vueApp"].$destroy();
      window["vueApp"] = new window["Vue"]({
        el: "#surveyElement",
        data: { survey: model },
      });
    } else if (framework === "angular" || framework == "vue3") {
      window.setSurvey(model);
    }
    window["survey"] = model;
  }, [framework, json, isDesignMode, props]);
};

export async function checkSurveyData(page: Page, json: any): Promise<void> {
  const data = await page.evaluate(() => { return window["survey"].data; });
  await expect(data).toStrictEqual(json);
}

export async function getSurveyData(page) {
  return await page.evaluate(() => { return window["survey"].data; });
}

export async function getSurveyResult(page) {
  return await page.evaluate(() => {
    return window["SurveyResult"];
  });
}

export async function getQuestionValue(page) {
  return await page.evaluate(() => {
    return window["survey"].getAllQuestions()[0].value;
  });
}

export async function getQuestionJson(page) {
  return await page.evaluate(() => {
    return JSON.stringify(window["survey"].getAllQuestions()[0].toJSON());
  });
}

export async function checkSurveyWithEmptyQuestion(page) {
  const requiredMessage = page.locator(".sv-string-viewer").getByText("Response required.");
  await expect(requiredMessage).toHaveCount(0);
  await page.locator("input[value=Complete]").click();
  await expect(requiredMessage).toHaveCount(1);
  const surveyResult = await getSurveyResult(page);
  expect(surveyResult).toEqual(undefined);
}

export async function getData(page) {
  return await page.evaluate(() => {
    return window["survey"].data;
  });
}

export async function setRowItemFlowDirection(page) {
  await page.evaluate(() => {
    window["Survey"].settings.itemFlowDirection = "row";
  });
}

export async function visibleInViewport(page, locator: Locator) {
  const rect = await locator.boundingBox();
  return await page.evaluate((rect) => {
    return (
      rect?.y >= 0 &&
      rect?.x >= 0 &&
      rect?.y + rect?.height <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect?.x + rect?.width <= (window.innerWidth || document.documentElement.clientWidth)
    );
  }, rect);
}

import type { Locator, Page } from "@playwright/test";
import { expect, test as baseTest } from "@playwright/test";

const environment = process.env.env;

export const frameworks = environment
  ? [environment]
  : ["angular", "react", "vue3"/*, "js-ui"*/];

// eslint-disable-next-line no-console
//console.log("Frameworks: " + frameworks.join(", "));
export const url = "http://127.0.0.1:8080/examples_test/default/";
export const urlV2 = "http://127.0.0.1:8080/examples_test/default/";
export const url_test = "http://127.0.0.1:8080/examples_test/";
export const FLOAT_PRECISION = 0.01;

export async function compareScreenshot(page: Page, elementSelector: string | undefined, screenshotName: string, elementIndex = 0) {
  await page.addStyleTag({
    content: "textarea::-webkit-resizer { visibility: hidden !important; }"
  });

  if (!!elementSelector) {
    const element = page.locator(elementSelector).filter({ visible: true });
    await expect.soft(element.nth(elementIndex)).toBeVisible();
    await expect.soft(element.nth(elementIndex)).toHaveScreenshot(screenshotName, {
      timeout: 10000
    });
  } else {
    await expect.soft(page).toHaveScreenshot(screenshotName, {
      timeout: 10000
    });
  }
}

export function getVisibleListItemByText(page: Page, text: string): Locator {
  return page.locator(".sv-popup__container").filter({ visible: true }).locator(`text=${text}`);
}

export async function resetFocusToBody(page: Page): Promise<void> {
  await page.evaluate(() => {
    if (!!document.activeElement) {
      document.activeElement.blur();
    }
    document.body.focus();
  });
}

export const applyTheme = async (page: Page, theme: string) => {
  await page.evaluate((theme) => {
    // window["Survey"].StylesManager.applyTheme(theme);
  }, theme);
};
export const initSurvey = async (page: Page, framework: string, json: any, isDesignMode?: boolean, props?: any) => {
  if (!!props) {
    Object.keys(props).forEach(name => {
      if (typeof props[name] == "function") {
        throw new Error(`Function '${name}' is passed over serialization boundary.`);
      }
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
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

    window["Survey"].settings.animationEnabled = false;
    const self: any = window;
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

    const surveyElement: HTMLElement = document.getElementById("surveyElement") as HTMLElement;
    if (framework === "js-ui") {
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

    // if (framework === "react") {
    //   if (!!window.root) {
    //     window.root.unmount();
    //   }
    //   const root = window["ReactDOM"].createRoot(document.getElementById("surveyElement"));
    //   window["root"] = root;
    //   root.render(
    //     React.createElement(React.StrictMode, { children: React.createElement(SurveyReact.Survey, { model: model, onComplete: surveyComplete }) }),
    //   );
    // }

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

export async function visibleInViewport (page, locator: Locator) {
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
export const test = baseTest.extend<{page: void, skipJSErrors: boolean}>({
  skipJSErrors: [false, { option: false }],
  page: async ({ page, skipJSErrors }, use) => {
    const errors: Array<Error> = [];
    page.addListener("pageerror", (error) => {
      errors.push(error);
    });
    await use(page);
    if (!skipJSErrors) {
      expect(errors).toHaveLength(0);
    }
  }
});
export { expect };
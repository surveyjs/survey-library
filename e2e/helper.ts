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

export async function compareScreenshot(page: Page, elementSelector: string | Locator | undefined, screenshotName: string, elementIndex = 0, maxDiffPixels?:number) {
  let currentElement = elementSelector;
  if (!!currentElement && typeof currentElement == "string") {
    currentElement = page.locator(currentElement);
  }

  const options: {timeout: number, maxDiffPixels?: number} = {
    timeout: 10000
  };

  if (maxDiffPixels) options.maxDiffPixels = maxDiffPixels;

  if (!!currentElement) {
    const element = (<Locator>currentElement).filter({ visible: true });
    await expect.soft(element.nth(elementIndex)).toBeVisible();
    await expect.soft(element.nth(elementIndex)).toHaveScreenshot(screenshotName, options);
  } else {
    await expect.soft(page).toHaveScreenshot(screenshotName, options);
  }
}

export function getVisibleListItemByText(page: Page, text: string): Locator {
  return page.locator(".sv-popup__container").filter({ visible: true }).getByRole("option", { name: text, exact: true });
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
    // (window as any).Survey.StylesManager.applyTheme(theme);
  }, theme);
};
export const initSurvey = async (page: Page, framework: string, json: any, isDesignMode?: boolean, props?: any, afterInitializeModelCallback?: () => Promise<void>) => {
  if (!!props) {
    Object.keys(props).forEach(name => {
      if (typeof props[name] == "function") {
        throw new Error(`Function '${name}' is passed over serialization boundary.`);
      }
    });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.evaluate(([json, isDesignMode, props]) => {
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

    (window as any).Survey.settings.animationEnabled = false;
    const model = new (window as any).Survey.Model(json);
    model.allowResizeComment = false;
    model.setDesignMode(isDesignMode);
    const surveyComplete = function (model) {
      (window as any).SurveyResult = model.data;
      // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
      document.getElementById("surveyResultElement")!.innerHTML = JSON.stringify(
        model.data
      );
    };
    if (!!props) {
      for (var key in props) {
        model[key] = props[key];
      }
    }
    model.onComplete.add(surveyComplete);
    (window as any).survey = model;
  }, [json, isDesignMode, props]);
  afterInitializeModelCallback && await afterInitializeModelCallback();
  await page.evaluate(([framework]) => {
    const self: any = window;
    const model = self.survey;
    // eslint-disable-next-line surveyjs/eslint-plugin-i18n/allowed-in-shadow-dom
    const surveyElement: HTMLElement = document.getElementById("surveyElement") as HTMLElement;
    if (framework === "survey-js-ui") {
      surveyElement.innerHTML = "";

      const container = surveyElement;
      const shadowRoot = container.attachShadow({ mode: "open" });
      const rootElement = document.createElement("div");
      const styles = document.createElement("style");
      styles.textContent = `
        *,
        ::after,
        ::before {
            box-sizing: border-box;
        }
      `;
      shadowRoot.appendChild(styles);
      const surveyLink = document.createElement("link");
      surveyLink.setAttribute("rel", "stylesheet");
      surveyLink.setAttribute("href", "../../node_modules/survey-core/survey-core.min.css");
      shadowRoot.appendChild(surveyLink);
      shadowRoot.appendChild(rootElement);

      self.SurveyUI.renderSurvey(model, rootElement);

    } else if (framework === "react") {
      if (!!self.root) {
        self.root.unmount();
      }
      const root = (window as any).ReactDOMClient.createRoot((window as any).survey.rootElement.getRootNode().getElementById("surveyElement"));
      (window as any).root = root;
      root.render(
        self.React.createElement(self.React.StrictMode, { children: self.React.createElement(self.SurveyReact.Survey, { model: model }) }),
      );
    } else if (framework === "angular" || framework == "vue3") {
      self.window.setSurvey(model);
    }
  }, [framework, json, isDesignMode, props]);
};

export async function checkSurveyData(page: Page, json: any): Promise<void> {
  const data = await page.evaluate(() => { return (window as any).survey.data; });
  await expect(data).toStrictEqual(json);
}

export async function getSurveyData(page: Page) {
  return await page.evaluate(() => { return (window as any).survey.data; });
}

export async function getSurveyResult(page: Page) {
  return await page.evaluate(() => {
    return (window as any).SurveyResult;
  });
}

export async function getQuestionValue(page: Page) {
  return await page.evaluate(() => {
    return (window as any).survey.getAllQuestions()[0].value;
  });
}

export async function getQuestionJson(page: Page) {
  return await page.evaluate(() => {
    return JSON.stringify((window as any).survey.getAllQuestions()[0].toJSON());
  });
}

export async function getPanelJson(page: Page) {
  return await page.evaluate(() => {
    return JSON.stringify((window as any).survey.getAllPanels()[0].toJSON());
  });
}

export async function setOptions(page: Page, questionName: string, modValue: any) {
  await page.evaluate(([questionName, modValue]) => {
    const mergeOptions = function (obj1, obj2) {
      for (const attrname in obj2) {
        obj1[attrname] = obj2[attrname];
      }
    };
    const q = (window as any).survey.getQuestionByName(questionName);
    mergeOptions(q, modValue);
  }, [questionName, modValue]);
}

export async function checkSurveyWithEmptyQuestion(page: Page) {
  const requiredMessage = page.locator(".sv-string-viewer").getByText("Response required.");
  await expect(requiredMessage).toHaveCount(0);
  await page.locator("input[value=Complete]").click();
  await expect(requiredMessage).toHaveCount(1);
  const surveyResult = await getSurveyResult(page);
  expect(surveyResult).toEqual(undefined);
}

export async function getData(page: Page) {
  return await page.evaluate(() => {
    return (window as any).survey.data;
  });
}

export async function setData(page: Page, newData: any) {
  await page.evaluate((newData) => {
    (window as any).survey.data = newData;
    (window as any).survey.render();
  }, newData);
}

export async function getTimeZone(page: Page): Promise<string> {
  return await page.evaluate(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  });
}

export async function setRowItemFlowDirection(page: Page) {
  await page.evaluate(() => {
    (window as any).Survey.settings.itemFlowDirection = "row";
  });
}

export async function visibleInViewport (page: Page, locator: Locator) {
  const rect = await locator.boundingBox();
  return await page.evaluate((rect) => {
    return (
      rect?.y >= 0 &&
      rect?.x >= 0 &&
      rect?.y + rect?.height <= (window.innerHeight || (window as any).survey.rootElement.getRootNode().querySelector("div")!.clientHeight) &&
      rect?.x + rect?.width <= (window.innerWidth || (window as any).survey.rootElement.getRootNode().querySelector("div")!.clientWidth)
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
interface IDragToElementAdditionalOptions {
  elementPosition?: {x: number, y: number};
  targetPosition?: {x: number, y: number};
  steps?: number;
}

interface IDragToElementOptions {
  page: Page;
  element: Locator;
  target: Locator;
  options?: IDragToElementAdditionalOptions;
}

export async function doDrag({ page, element, target, options }: IDragToElementOptions):Promise<void> {
  if (options?.elementPosition) {
    await element.hover({
      force: true,
      position: {
        x: options.elementPosition?.x,
        y: options.elementPosition?.y
      }
    });
  } else {
    await element.hover({ force: true });
  }
  await page.mouse.down();
  await target.scrollIntoViewIfNeeded();
  const { x, y, width, height } = await <any>target.boundingBox();
  const targetPositionX = x + (options?.targetPosition?.x || width / 2);
  const targetPositionY = y + (options?.targetPosition?.y || height / 2);
  await page.mouse.move(targetPositionX, targetPositionY, { steps: options?.steps || 20 });
}

export async function doDragDrop(options : IDragToElementOptions):Promise<void> {
  await doDrag(options);
  await options.page.mouse.up();
}

export async function waitUntilAllImagesLoad(page: Page): Promise<void> {
  //https://github.com/microsoft/playwright/issues/6046
  for (const img of await page.getByRole("img").all()) {
    await expect(img).toHaveJSProperty("complete", true);
    await expect(img).not.toHaveJSProperty("naturalWidth", 0);
  }
}

export { expect };

import { ClientFunction } from "testcafe";
import { createScreenshotsComparer } from "devextreme-screenshot-comparer";

export const getSurveyJSFramework = ClientFunction(() => {
  return window["surveyJSFramework"];
});

export const explicitErrorHandler = ClientFunction(() => { window.addEventListener("error", e => {
  if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
    e.message === "ResizeObserver loop limit exceeded") {
    e.stopImmediatePropagation();
  } });
});

export const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

export async function checkElementScreenshot(screenshotName: string, element: Selector, t: TestController): Promise<void> {
  const comparer = createScreenshotsComparer(t);
  await t
    .wait(1000)
    .expect(element.visible).ok("element is invisible for " + screenshotName);
  await comparer.takeScreenshot(screenshotName, element, screenshotComparerOptions);
  await t
    .expect(comparer.compareResults.isValid())
    .ok(comparer.compareResults.errorMessages());
}

//devextreme-screenshot-comparer options
export const screenshotComparerOptions = {
  path: "./tests",
  screenshotsRelativePath: "../visualRegressionTests/screenshots",
  destinationRelativePath: "../visualRegressionTests/artifacts",
  enableTextMask: true,
  textMaskRadius: 5,
  textDiffTreshold: 0.5,
  maskRadius: 5,
  attempts: 2,
  attemptTimeout: 500,
  looksSameComparisonOptions: {
    strict: false,
    tolerance: 8,
    ignoreAntialiasing: true,
    antialiasingTolerance: 8,
    ignoreCaret: true,
  },
  textComparisonOptions: {
    strict: false,
    ignoreAntialiasing: true,
    ignoreCaret: true,
  },
  generatePatch: false,
  highlightColor: { r: 0xff, g: 0, b: 0xff },
};

export { initSurvey, frameworks, url, url_test } from "../testCafe/helper";

import { ClientFunction, Selector } from "testcafe";
import { createScreenshotsComparer, ScreenshotsComparer } from "devextreme-screenshot-comparer";

export const getSurveyJSFramework = ClientFunction(() => {
  return window["surveyJSFramework"];
});

export const explicitErrorHandler = ClientFunction(() => {
  window.addEventListener("error", e => {
    if (e.message === "ResizeObserver loop completed with undelivered notifications." ||
      e.message === "ResizeObserver loop limit exceeded") {
      e.stopImmediatePropagation();
    }
  });
});

export const applyTheme = ClientFunction(theme => {
  (<any>window).Survey.StylesManager.applyTheme(theme);
});

export const resetFocusToBody = ClientFunction(() => { document.body.focus(); });

export async function wrapVisualTest(t: TestController, fn: (t: TestController, comparer: ScreenshotsComparer) => Promise<any>): Promise<void> {
  const comparer = createScreenshotsComparer(t);

  await fn(t, comparer);

  await t
    .expect(comparer.compareResults.isValid())
    .ok(comparer.compareResults.errorMessages());
}

export async function takeElementScreenshot(screenshotName: string, element: Selector | string | null, t: TestController, comparer: ScreenshotsComparer): Promise<void> {
  await t.wait(1000);
  if(!!element) {
    await t.expect(Selector(element).visible).ok("element is invisible for " + screenshotName);
  }
  await comparer.takeScreenshot(screenshotName, element, screenshotComparerOptions);
}

export async function resetHoverToBody(t: TestController): Promise<void> {
  await t.hover(Selector("body"), { offsetX: 0, offsetY: 0 });
}

//devextreme-screenshot-comparer options
export const screenshotComparerOptions = {
  path: "./tests",
  screenshotsRelativePath: "../visualRegressionTests/screenshots",
  destinationRelativePath: "../visualRegressionTests/artifacts",
  enableTextMask: true,
  textMaskRadius: 2,
  textDiffTreshold: 0.5,
  maskRadius: 2,
  attempts: 2,
  attemptTimeout: 500,
  looksSameComparisonOptions: {
    strict: false,
    tolerance: 1,
    ignoreAntialiasing: true,
    antialiasingTolerance: 3,
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

export { initSurvey, initSurveyPopup, frameworks, url, url_test, setOptions } from "../testCafe/helper";

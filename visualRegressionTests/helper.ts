import { ClientFunction } from "testcafe";
export const getSurveyJSFramework = ClientFunction(() => {
  return window["surveyJSFramework"];
});

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

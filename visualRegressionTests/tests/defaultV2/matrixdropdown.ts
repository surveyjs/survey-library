import { Selector, ClientFunction } from "testcafe";
import { url, frameworks, initSurvey, url_test, applyTheme, takeElementScreenshot, wrapVisualTest, resetFocusToBody, resetHoverToBody } from "../../helper";

const title = "Matrixdropdown Screenshot";

fixture`${title}`.page`${url}`.beforeEach(async (t) => {

});

const theme = "defaultV2";

frameworks.forEach(framework => {
  fixture`${framework} ${title} ${theme}`.page`${url_test}${theme}/${framework}`.beforeEach(async t => {
    await applyTheme(theme);
  });
  test("Column requiredIf and vertical layout", async (t) => {
    await wrapVisualTest(t, async (t, comparer) => {
      await t.resizeWindow(900, 900);
      await initSurvey(framework, {
        "focusFirstQuestionAutomatic": true,
        "elements": [{
          "type": "radiogroup",
          "name": "question2",
          "defaultValue": "Item1",
          "choices": [
            "Item1",
            "Item2",
            "Item3"
          ]
        },
        {
          "type": "matrixdropdown",
          "name": "question1",
          "columns": [
            {
              "name": "Column 1",
              "cellType": "text",
              "requiredIf": "{question2} = 'Item1'"
            }
          ],
          "columnLayout": "vertical",
          "rows": [
            "Row 1",
            "Row 2"
          ]
        }] }
      );
      const matrixdynamicRoot = Selector(".sd-question").nth(1);
      await takeElementScreenshot("matrixdropdown-column-required.png", matrixdynamicRoot, t, comparer);
      await t.pressKey("down");
      await takeElementScreenshot("matrixdropdown-column-non-required.png", matrixdynamicRoot, t, comparer);
      await t.pressKey("up");
      await takeElementScreenshot("matrixdropdown-column-required.png", matrixdynamicRoot, t, comparer);
    });
  });
});
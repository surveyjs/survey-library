import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "RequiredIf property";

const themeName = "defaultV2";

const json = {
  elements: [
    { type: "radiogroup", name: "a", choices: ["item1", "item2", "item3"] },
    { type: "text", name: "b", requiredIf: "{a} = 'item1'" },
    {
      type: "matrixdynamic", name: "c", rowCount: 2,
      columns: [
        { cellType: "text", name: "col1", requiredIf: "{a} = 'item2'" }
      ]
    },
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`
    .beforeEach(async (t) => {
      await applyTheme(themeName);
      await initSurvey(framework, json);
      await t.resizeWindow(1000, 1000);
    });
  test("check requriedIf for standard question", async (t) => {
    const requiredText = Selector("span").withText("*");
    await t.expect(requiredText.exists).notOk();
    await t.click("input[value=item1]");
    await t.expect(requiredText.exists).ok();
    await t.click("input[value=item3]");
    await t.expect(requiredText.exists).notOk();
  });
  test("check requriedIf for matrix column", async (t) => {
    const requiredText = Selector("span").withText("*");
    await t.expect(requiredText.exists).notOk();
    await t.click("input[value=item2]");
    await t.expect(requiredText.exists).ok();
    await t.click("input[value=item3]");
    await t.expect(requiredText.exists).notOk();
  });
});


import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "questions isAnswered title style";

const json = {
  elements: [
    { type: "radiogroup", name: "q1", choices: ["item 1", "item 2"], showClearButton: true },
    { type: "radiogroup", name: "q2", choices: ["item 3", "item 4"], defaultValue: "item 3" },
    { type: "checkbox", name: "q3", choices: ["item 5", "item 6"] },
    { type: "checkbox", name: "q4", choices: ["item 7", "item 8"], defaultValue: ["item 7"] },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title} modern`
    .page`${url_test}modern/${framework}`.beforeEach(async (t) => {
    await applyTheme("modern");
    await initSurvey(framework, json);
  });

  test("Check is Answered title css class", async (t) => {
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q1").exists).notOk();
    await t.click(Selector("span").withText("item 1"));
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q1").exists).ok();
    await t.click(Selector("input[value=Clear]"));
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q1").exists).notOk();

    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q2").exists).ok();
    await t.click(Selector("span").withText("item 3"));
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q2").exists).ok();

    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q3").exists).notOk();
    await t.click(Selector("span").withText("item 5"));
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q3").exists).ok();
    await t.click(Selector("span").withText("item 5"));
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q3").exists).notOk();

    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q4").exists).ok();
    await t.click(Selector("span").withText("item 8"));
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q4").exists).ok();
    await t.click(Selector("span").withText("item 7"));
    await t.click(Selector("span").withText("item 8"));
    await t.expect(Selector("h5.sv-question__title--answer").find("span").withText("q4").exists).notOk();
  });
});

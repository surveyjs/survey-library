import { url_test, initSurvey, getSurveyResult, frameworks } from "../helper";
import { Selector, ClientFunction } from "testcafe";
const title = "Custom Components";
const themeName = "defaultV2";
const json = {
  "elements": [
    {
      type: "nps",
      name: "q1"
    }
  ]
};

const registerNPSComponet = ClientFunction(() => {
  window["Survey"].ComponentCollection.Instance.add({
    //Unique component name. It becomes a new question type. Please note, it should be written in lowercase.
    name: "nps", //The text that shows on toolbox
    title: "NPS Rating", //The actual question that will do the job
    questionJSON: {
      type: "rating",
      rateValues: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      minRateDescription: "Very unlikely",
      maxRateDescription: "Very likely",
      displayMode: "auto"
    }
  });
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url_test}${themeName}/${framework}`.beforeEach(
    async t => {
    }
  );
  test("Show rating in component as dropdown", async t => {
    const questionDropdownSelect = Selector(".sd-input.sd-dropdown");
    await t.resizeWindow(500, 600);
    await registerNPSComponet();
    await initSurvey(framework, json);

    await t
      .click(questionDropdownSelect)
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("down")
      .pressKey("enter");

    await t.click(Selector("input[value='Complete']"));

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.q1).eql(3);
  });
});
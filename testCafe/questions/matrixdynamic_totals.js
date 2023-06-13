import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "matrixdynamic totals";

const json2 = {
  "pages": [
    {
      "name": "page1",
      "elements": [
        {
          "type": "matrixdynamic",
          "name": "question1",
          "columns": [
            {
              "name": "Column 1",
              "cellType": "text",
              "totalType": "sum",
              "inputType": "number"
            }
          ],
          "choices": [
            1,
            2,
            3,
            4,
            5
          ]
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json2);
    }
  );

  test("calc totals", async (t) => {
    await ClientFunction(() =>
      window["survey"].data = { "question1": [{ "Column 1": 12345 }, { "Column 1": 67890 }] }
    )();
    await t.expect(Selector("div").withText("80235").visible).ok();

  });
});

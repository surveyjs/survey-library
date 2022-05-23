import { frameworks, url, initSurvey, getSurveyResult, checkSurveyWithEmptyQuestion } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "dropdownRestful";

const json = {
  questions: [
    {
      type: "dropdown",
      name: "country",
      title: "Select the country...",
      isRequired: true,
      choicesByUrl: {
        //url: "http://services.groupkt.com/country/get/all",
        url: "http://127.0.0.1:8080/testCafe/countriesMock.json",
        path: "RestResponse;result",
        valueName: "name",
      },
    },
  ],
};

export const changeValue = ClientFunction(() => {
  var q = window["survey"].getQuestionByName("country");
  q.choicesByUrl.valueName = "alpha2_code";
  q.choicesByUrl.titleName = "name";
  q.choicesByUrl.run();
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("choose empty", async t => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async t => {
    let surveyResult;

    await t
      .wait(1000)
      .click("select")
      .click("option[value=Cuba]")
      .click("input[value=Complete]");

    surveyResult = await getSurveyResult();
    await t.expect(surveyResult.country).eql("Cuba");
  });

  test("change \"value\" in the returned json", async t => {
    await t
      .wait(1000)
      .expect(Selector(".sv_row select option[value=\"Cuba\"]").exists).ok()
      .expect(Selector(".sv_row select option[value=\"CU\"]").exists).notOk();
    await changeValue();

    await t
      .expect(Selector(".sv_row select option[value=\"Cuba\"]").exists).notOk()
      .expect(Selector(".sv_row select option[value=\"CU\"]").exists).ok()
      .click("select")
      .click(Selector("option").withText("Cuba"))
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.country).eql("CU");
  });
});

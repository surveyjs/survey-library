import { frameworks, url, initSurvey, getSurveyResult, checkSurveyWithEmptyQuestion, getListItemByText, completeButton, getData, setData } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "dropdownRestful";

const jsonRenderAsSelect = {
  elements: [
    {
      type: "dropdown",
      renderAs: "select",
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
      await initSurvey(framework, jsonRenderAsSelect);
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
      .expect(Selector(".sd-row select option[value=\"Cuba\"]").exists).ok()
      .expect(Selector(".sd-row select option[value=\"CU\"]").exists).notOk();
    await changeValue();

    await t
      .expect(Selector(".sd-row select option[value=\"Cuba\"]").exists).notOk()
      .expect(Selector(".sd-row select option[value=\"CU\"]").exists).ok()
      .click("select")
      .click(Selector("option").withText("Cuba"))
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.country).eql("CU");
  });
});

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, {
        elements: [
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
      });
    }
  );

  const questionDropdownSelect = Selector(".sd-dropdown");

  test("choose empty", async t => {
    await checkSurveyWithEmptyQuestion(t);
  });

  test("choose value", async t => {
    await t
      .wait(1000)
      .click(questionDropdownSelect)
      .click(getListItemByText("Cuba"))
      .click(completeButton);

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.country).eql("Cuba");
  });

  test("change \"value\" in the returned json", async t => {
    await t
      .wait(1000)
      .click(questionDropdownSelect)
      .click(getListItemByText("Cuba"));

    let surveyData = await getData();
    await t.expect(surveyData.country).eql("Cuba");

    await changeValue();
    await t
      .click(questionDropdownSelect)
      .click(getListItemByText("Cuba"));

    surveyData = await getData();
    await t.expect(surveyData.country).eql("CU");

    await t.click(completeButton);
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.country).eql("CU");
  });
});
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, {
        elements: [
          {
            type: "tagbox",
            name: "q1",
            choicesByUrl: {
              //url: "http://services.groupkt.com/country/get/all",
              url: "http://127.0.0.1:8080/testCafe/countriesMock.json",
              path: "RestResponse;result",
              valueName: "name",
            },
          },
          {
            type: "dropdown",
            name: "q2",
            choicesFromQuestion: "q1",
            choicesFromQuestionMode: "selected"
          }
        ],
      });
    }
  );
  test("Carry forward for choicesByUrl", async t => {
    const questionDropdownSelect = Selector(".sd-dropdown");
    const popupContainer = Selector(".sv-popup__container").filterVisible();

    await setData({ q1: ["United States", "Romania"], q2: "Romania" });
    await t
      .wait(1000)
      .click(questionDropdownSelect)
      .expect(getListItemByText("Romania").exists).ok()
      .click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.q2).eql("Romania");
  });
});
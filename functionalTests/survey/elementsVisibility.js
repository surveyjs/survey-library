import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "Elements Visibility";

const json = {
  pages: [
    {
      elements: [
        { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
        {
          type: "text",
          name: "q2",
          defaultValue: "q2Value",
          visibleIf: "{q1} = 'Yes'",
        },
      ],
    },
    {
      elements: [{ type: "text", name: "q3", visibleIf: "{q1} = 'Yes'" }],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, undefined, {
        showInvisibleElements: true,
      });
    }
  );

  test("showInvisibleElements = true", async (t) => {
    await t.expect(Selector("input[value=Complete]").visible).notOk();
    await t.expect(Selector("input[value=Next]").visible).ok();
    await t.expect(Selector("input[value=Next]").visible).ok();
    await t.expect(Selector("span").withText("2.").visible).ok();
  });
});
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );
  test("make element on another page visible", async (t) => {
    await t.expect(Selector("input[value=Complete]").visible).ok();
    const yesChoice = Selector('input[value="Yes"]');
    const noChoice = Selector('input[value="No"]');
    await t.click(yesChoice).expect(yesChoice.checked).ok();
    await t.expect(Selector("input[value=Complete]").visible).notOk();
    await t.expect(Selector("input[value=Next]").visible).ok();
    await t.click(noChoice).expect(noChoice.checked).ok();
    await t.expect(Selector("input[value=Complete]").visible).ok();
  });
});

const json2 = {
  pages: [
    {
      elements: [
        { type: "text", name: "q0" },
        { type: "radiogroup", name: "q1", choices: ["Yes", "No"] },
        {
          type: "text",
          name: "q2",
          defaultValue: "q2Value",
          visibleIf: "{q1} = 'No'",
        },
      ],
    },
  ],
};
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json2);
    }
  );

  test("test focus after visibility change", async (t) => {
    const noChoice = Selector('input[value="No"]');
    await t
      .expect(Selector("div[data-name=q2]").visible)
      .notOk()
      .click(noChoice)
      .expect(noChoice.checked)
      .ok();
    await t.expect(Selector("div[data-name=q2]").visible).ok();
    await t
      .expect(
        ClientFunction(() => {
          return (
            document.activeElement ==
            document.querySelector('input[value="No"]')
          );
        })()
      )
      .ok();
  });
});

const json3 = {
  elements: [
    {
      type: "text",
      name: "country",
    },
    {
      type: "html",
      name: "requesting",
      html: "The data is requesting",
      visibleIf: "{request_processing} = true",
    },
    {
      type: "text",
      name: "name_official",
      readOnly: true,
      visibleIf: "{name_official} notempty",
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json3);
    }
  );

  test("Bug #4302 check that element root styles applies correctly after element becomes visible", async (t) => {
    await ClientFunction(() => {
      var survey = window.survey;
      var officialName = "name_official";
      survey.setVariable("request_processing", true);
      setTimeout(() => {
        survey.setValue(officialName, "Full Country Name");
        survey.setVariable("hasError", false);
        survey.setVariable("request_processing", false);
      }, 0);
    })();
    await t
      .expect(
        Selector(
          "div[style*=\"flex: 1 1 100%\"] div[data-name='name_official']"
        ).exists
      )
      .ok();
  });
});

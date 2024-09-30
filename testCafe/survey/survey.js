import { frameworks, url_test, initSurvey, applyTheme } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
const title = "Survey";

var json = {
  questionsOnPageMode: "questionPerPage",
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "radiogroup",
          name: "question1",
          choices: ["Item 1", "Item 2", "Item 3"]
        }
      ]
    },
    {
      name: "page2",
      elements: [
        {
          type: "radiogroup",
          name: "question2",
          choices: ["Item 1", "Item 2", "Item 3"]
        }
      ]
    }
  ]
};

const themeName = "defaultV2";

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`.beforeEach(async (t) => {
    await applyTheme(themeName);
    await initSurvey(framework, json);
    await t.resizeWindow(1600, 900);
  });
  test("Update survey via fromJSON", async (t) => {
    const updateSurvey = ClientFunction(() => {
      window.survey.data = { question1: "Item 1" };
      var newJson = {
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "radiogroup",
                isRequired: true,
                name: "question1",
                choices: ["Item 1", "Item 2", "Item 3"]
              }
            ]
          }
        ]
      };
      window.survey.fromJSON(newJson);
    });
    await t
      .expect(Selector("span").withText("question1").visible).ok();
    await t
      .wait(500);
    await updateSurvey();
    await t
      .wait(500);
    await updateSurvey();
    await t
      .wait(500)
      .expect(Selector("span").withText("question1").visible).ok();
  });
  test("Change questionsOnPageMode", async (t) => {
    await t.expect(Selector("span").withText("question1").visible).ok();
    await ClientFunction(() => {
      window.survey.questionsOnPageMode = "singlePage";
    })();
    await t.expect(Selector("span").withText("question1").visible).ok();
    await ClientFunction(() => {
      window.survey.questionsOnPageMode = "questionPerPage";
    })();
    await t.expect(Selector("span").withText("question1").visible).ok();
    await ClientFunction(() => {
      window.survey.questionsOnPageMode = "standard";
    })();
    await t.expect(Selector("span").withText("question1").visible).ok();
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`
    .page`${url_test}${themeName}/${framework}`.beforeEach(async (t) => {
    await t.resizeWindow(1600, 900);
  });
  test("Check matrix fail when showing preview", async (t) => {
    await initSurvey(framework, {
      showPreviewBeforeComplete: "showAnsweredQuestions",
      elements: [
        {
          type: "matrixdropdown",
          name: "framework-ratings",
          title: "Please leave your feedback about JavaScript frameworks",
          columnMinWidth: "130px",
          columns: [
            {
              name: "usage",
              title: "Do you use the framework?",
              cellType: "radiogroup",
              choices: ["Yes", "No"],
              defaultValue: "Yes",
            },
            {
              name: "experience",
              title: "How long have you used it?",
              choices: [
                { text: "3-5 years", value: 4 },
                { text: "1-2 years", value: 1.5 },
                { text: "Less than a year", value: 0.5 },
              ],
              enableIf: "{row.usage} = 'Yes'",
            },
            {
              name: "strengths",
              title: "Which are the framework's main strengths?",
              cellType: "checkbox",
              choices: [
                "Scalability",
                "Performance",
                "Complete functionality",
                "Learning materials",
                "Strong community",
              ],
              colCount: 1,
              enableIf: "{row.usage} = 'Yes'",
            },
            {
              name: "free-form-feedback",
              title: "Describe what you like and dislike about the framework",
              cellType: "comment",
              enableIf: "{row.usage} = 'Yes'",
            },
            {
              name: "rating",
              title: "Rate your experience with the framework",
              cellType: "rating",
              rateValues: [
                { text: "Excelent", value: 5 },
                { text: "Good", value: 4 },
                { text: "Average", value: 3 },
                { text: "Fair", value: 2 },
                { text: "Poor", value: 1 },
              ],
              displayMode: "dropdown",
              enableIf: "{row.usage} = 'Yes'",
            },
          ],
          rows: [
            { text: "Angular", value: "angular" },
            { text: "React", value: "react" },
            { text: "Vue.js", value: "vue" },
          ],
          transposeData: true,
        },
      ],
      showQuestionNumbers: false,
    });
    await t.click("#sv-nav-preview input");
    await t.click("#sv-nav-complete input");
  });
  test("Do not show advanced header if not set headerView === 'advanced'", async (t) => {
    await initSurvey(framework, {
      "title": "NPS Survey Question",
      "logo": "https://api.surveyjs.io/private/Surveys/files?name=bdf16c7e-fa1e-4e31-9d82-a6df1982c224",
      "logoWidth": "200px",
      "logoHeight": "80px",
      "logoFit": "cover",
      "logoPosition": "right",
      "elements": [
        {
          "type": "rating",
          "name": "nps-score",
          "title": "On a scale from 0 to 10, how likely are you to recommend us to a friend or colleague?",
          "rateMin": 0,
          "rateMax": 10,
          "minRateDescription": "Very unlikely",
          "maxRateDescription": "Very likely"
        },
      ],
    });
    await applyTheme({
      backgroundImage:
        "https://api.surveyjs.io/private/Surveys/files?name=4ffde38f-2bb3-4f57-aa0d-d5c7003e8ab1",
      backgroundImageFit: "cover",
      backgroundImageAttachment: "scroll",
      header: {
        height: 256,
        inheritWidthFrom: "container",
        textAreaWidth: 512,
        overlapEnabled: false,
        backgroundImageOpacity: 1,
        backgroundImageFit: "cover",
        logoPositionX: "right",
        logoPositionY: "top",
        titlePositionX: "left",
        titlePositionY: "bottom",
        descriptionPositionX: "left",
        descriptionPositionY: "bottom",
      },
      themeName: "molisana",
      isPanelless: false,
      colorPalette: "light",
      cssVariables: {
      },
    });
    await t.expect(Selector(".sd-title").visible).ok();
    await t.expect(Selector(".sv-header").visible).notOk();
  });
});
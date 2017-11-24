import {
  frameworks,
  url,
  setOptions,
  initSurvey,
  getSurveyResult
} from "../settings";
import { Selector, ClientFunction } from "testcafe";
const assert = require("assert");
const title = `panel`;

var json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "comment",
          name: "question1"
        },
        {
          type: "panel",
          elements: [
            {
              type: "checkbox",
              choices: [
                {
                  value: "1",
                  text: "first item"
                },
                {
                  value: "2",
                  text: "second item"
                },
                {
                  value: "3",
                  text: "third item"
                }
              ],
              name: "question2"
            },
            {
              type: "panel",
              elements: [
                {
                  type: "dropdown",
                  choices: [
                    {
                      value: "1",
                      text: "first item"
                    },
                    {
                      value: "2",
                      text: "second item"
                    },
                    {
                      value: "3",
                      text: "third item"
                    }
                  ],
                  name: "question3"
                },
                {
                  type: "rating",
                  name: "question4"
                }
              ],
              innerIndent: 1,
              name: "panel2"
            }
          ],
          innerIndent: 1,
          name: "panel1"
        }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test(`titles and margins`, async t => {
    let surveyResult;
    const getTitle1 = Selector(() => document.querySelectorAll("div"), {
      text: "question1",
      visibilityCheck: true,
      timeout: 1000
    });
    const getTitle2 = Selector(() => document.querySelectorAll("div"), {
      text: "question2",
      visibilityCheck: true,
      timeout: 1000
    });
    const getTitle3 = Selector(() => document.querySelectorAll("div"), {
      text: "question3",
      visibilityCheck: true,
      timeout: 1000
    });
    const getTitle4 = Selector(() => document.querySelectorAll("div"), {
      text: "question4",
      visibilityCheck: true,
      timeout: 1000
    });

    const getPanelsCountByMargin = ClientFunction(
      () => document.querySelectorAll('div[style*="padding-left: 20px"]').length
    );

    assert(await getTitle1());
    assert(await getTitle2());
    assert(await getTitle3());
    assert(await getTitle4());

    assert.equal(await getPanelsCountByMargin(), 2);
  });
});

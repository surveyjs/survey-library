import { frameworks, url, initSurvey, url_test } from "../helper";
import { ClientFunction, fixture, test } from "testcafe";
import { createElement } from "react";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "afterRenderQuestionEvent";

const json = {
  pages: [
    {
      elements: [
        {
          name: "question4a",
          type: "radiogroup",
          title: "4 (a) question 4a ",
          choices: [
            {
              text: "Yes",
              value: "valueYes",
            },
            {
              text: "No",
              value: "valueNo",
            },
          ],
        },
        {
          name: "question4b",
          visibleIf: "{question4a} = 'valueYes'",
          type: "radiogroup",
          title: "4 (b) Test question 4b",
          choices: [
            {
              text: "Yes",
              value: "BA17018_02_01",
            },
            {
              text: "No",
              value: "BA17018_02_02",
            },
          ],
        },
      ],
      name: "sectionTest",
    },
  ],
  title: "Test Sample",
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      var f = function (survey, options) {
        if (options.question.name == "question4a") {
          var title = options.htmlElement.querySelector("input[value='valueYes']");
          title.style.color = "tomato";
        }
        if (options.question.name == "question4b") {
          options.htmlElement.style.border = "1px solid #CCC";
        }
      };
      var events = { onAfterRenderQuestion: f };

      await initSurvey(framework, json, events);
    }
  );

  test("afterRenderQuestion fires for initially hidden questions", async (t) => {
    const isTitleOk = ClientFunction(
      () => document.querySelector("input[value='valueYes']").style.color === "tomato"
    );
    const getQuestionCount = ClientFunction(
      () => document.querySelectorAll(".sv_q.sv_qstn").length
    );
    const isBorderOk = ClientFunction(
      () =>
        document.querySelectorAll(".sv_q.sv_qstn")[1].style.border ===
        "1px solid rgb(204, 204, 204)"
    );

    assert.equal(await getQuestionCount(), 1);
    await t.click("input[value=valueYes]");
    assert.equal(await getQuestionCount(), 2);
    assert.ok(await isBorderOk());
    assert.ok(await isTitleOk());
  });
});

frameworks.forEach((framework) => {
  const setSurvey = ClientFunction((json, windowName) => {
    window[windowName] = new window["Survey"].Model(json);
    window.setSurvey(window[windowName]);
  });
  const prepare = ClientFunction(
    (framework) => {
      if (framework === "react") {
        document.getElementById("surveyElement").innerHTML = "";
        const App = () => {
          let [survey, setSurvey] = window["React"].useState(undefined);
          window.setSurvey = setSurvey;
          if(!!survey) {
            // eslint-disable-next-line react/react-in-jsx-scope, no-undef, react/jsx-no-undef
            return <Survey.Survey model={survey}></Survey.Survey>;
          } else {
            return null;
          }
        };
        window["ReactDOM"].render(
          // eslint-disable-next-line react/react-in-jsx-scope
          <App></App>,
          document.getElementById("surveyElement")
        );
      }
    }
  );
  const checkResizeObserverExists = ClientFunction((modelName) => {
    return !!window[modelName].resizeObserver;
  });
  fixture`${framework} ${title}`.page`${url_test}defaultV2/${framework}`.beforeEach(async () => {
    await prepare(framework);
  });
  (framework === "angular" || framework === "react" ? test : test.skip)("Check that survey calls afterRender if model changed", async (t) => {
    await setSurvey({}, "model1");
    await t.expect(await checkResizeObserverExists("model1")).ok();
    await setSurvey({}, "model2");
    await t.expect(await checkResizeObserverExists("model2")).ok();
    await t.expect(await checkResizeObserverExists("model1")).notOk();
  });
});

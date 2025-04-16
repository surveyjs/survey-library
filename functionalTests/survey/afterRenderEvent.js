import { frameworks, url, initSurvey } from "../helper";
import { ClientFunction, fixture, test, Selector } from "testcafe";
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

// frameworks.forEach((framework) => {
//   fixture`${framework} ${title}`.page`${url}${framework}`;

//   test("afterRenderQuestion fires for initially hidden questions", async (t) => {

//     var f = function (survey, options) {
//       if (options.question.name == "question4a") {
//         var title = options.htmlElement.querySelector("input[value='valueYes']");
//         title.style.color = "tomato";
//       }
//       if (options.question.name == "question4b") {
//         options.htmlElement.style.border = "1px solid #CCC";
//       }
//     };

//     await initSurvey(framework, json, { onAfterRenderQuestion: f });
//     const questionSelector = Selector(".sd-question");
//     await t
//       .expect(questionSelector.count).eql(1)
//       .click("input[value=valueYes]")

//       .expect(questionSelector.count).eql(2)
//       .expect(Selector("input[value='valueYes']").getStyleProperty("color")).eql("rgb(255, 99, 71)")
//       .expect(questionSelector.nth(1).getStyleProperty("border-top-color")).eql("rgb(204, 204, 204)")
//       .expect(questionSelector.nth(1).getStyleProperty("border-top-style")).eql("solid")
//       .expect(questionSelector.nth(1).getStyleProperty("border-top-width")).eql("1px");
//   });
// });

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
          if (!!survey) {
            return <SurveyReact.Survey model={survey}></SurveyReact.Survey>;
          } else {
            return null;
          }
        };

        window["ReactDOMClient"].createRoot(document.getElementById("surveyElement")).render(
          <App></App>
        );
      }
    }
  );
  const checkResizeObserverExists = ClientFunction((modelName) => {
    return !!window[modelName].resizeObserver;
  });
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(async () => {
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
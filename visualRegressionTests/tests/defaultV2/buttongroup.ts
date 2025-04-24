// import { Selector, ClientFunction } from "testcafe";
// import { url, frameworks, initSurvey, wrapVisualTest, takeElementScreenshot } from "../../helper";

// const title = "ButtonGroup Screenshot";

// fixture`${title}`.page`${url}`.beforeEach(async (t) => {

// });

// const registerButtongroup = ClientFunction((framework) => {
//   const Survey = (<any>window).Survey;
//   Survey.QuestionFactory.Instance.registerQuestion("buttongroup", (name) => {
//     return new Survey.QuestionButtonGroupModel(name);
//   });
//   if (framework === "react") {
//     (<any>window).SurveyReact.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
//       return (<any>window).React.createElement((<any>window).SurveyReact.SurveyQuestionButtonGroup, props);
//     });
//   }
//   if (framework === "jquery-ui") {
//     const SurveyJquery = (<any>window).SurveyJquery;
//     const preact = SurveyJquery["preact"];
//     SurveyJquery.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
//       return preact.createElement(SurveyJquery.SurveyQuestionButtonGroup, props);
//     });
//   }
//   if (framework === "survey-js-ui") {
//     const SurveyUI = (<any>window).SurveyUI;
//     const preact = SurveyUI["preact"];
//     SurveyUI.ReactQuestionFactory.Instance.registerQuestion("buttongroup", props => {
//       return preact.createElement(SurveyUI.SurveyQuestionButtonGroup, props);
//     });
//   }
//   if (framework === "knockout") {
//     Survey.Serializer.overrideClassCreator("buttongroup", function () {
//       return new Survey.QuestionButtonGroup("");
//     });

//     Survey.QuestionFactory.Instance.registerQuestion("buttongroup", (name) => {
//       var q = new Survey.QuestionButtonGroup(name);
//       q.choices = Survey.QuestionFactory.DefaultChoices;
//       return q;
//     });

//   }
// });

// frameworks.forEach(framework => {
//   fixture`${framework} ${title}`.page`${url}${framework}`;
//   test("Check buttongroup question", async (t) => {
//     await wrapVisualTest(t, async (t, comparer) => {
//       await t.resizeWindow(1920, 1080);
//       await registerButtongroup(framework);
//       if (framework === "vue" || framework === "angular") {
//         return;
//       }
//       await initSurvey(framework, {
//         showQuestionNumbers: "off",
//         widthMode: "static",
//         questions: [
//           {
//             type: "buttongroup",
//             title: "Where are you living?",
//             name: "buttongroup_question",
//             choices: ["Greece", "US", "UK", "Spain"]
//           },
//         ]
//       });
//       const questionRoot = Selector(".sd-question");
//       const item = Selector(".sv-button-group__item").nth(2);
//       const focusBody = ClientFunction(() => { document.body.focus(); });
//       await focusBody();
//       await takeElementScreenshot("buttongroup-question.png", questionRoot, t, comparer);
//       await ClientFunction(() => { (<HTMLEmbedElement>document.querySelector(".sv-button-group__item:nth-child(2)")).focus(); })();
//       await takeElementScreenshot("buttongroup-question-focused.png", questionRoot, t, comparer);
//       await focusBody();
//       await t.hover(item);
//       await takeElementScreenshot("buttongroup-question-hovered.png", questionRoot, t, comparer);
//       await focusBody();
//       await ClientFunction(() => {
//         (<any>window).survey.getQuestionByName("buttongroup_question").value = "UK";
//       })();
//       await takeElementScreenshot("buttongroup-question-answered.png", questionRoot, t, comparer);
//     });
//   });
// });
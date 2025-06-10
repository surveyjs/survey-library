// import { Selector, ClientFunction } from "testcafe";
// import { url, frameworks, initSurvey, setOptions, takeElementScreenshot, wrapVisualTest, resetFocusToBody } from "../../helper";

// const title = "Expression Screenshot";

// fixture`${title}`.page`${url}`.beforeEach(async (t) => {

// });

// frameworks.forEach(framework => {
//   fixture`${framework} ${title}`
//     .page`${url}${framework}`;

//   test("Check expression question", async (t) => {
//     await wrapVisualTest(t, async (t, comparer) => {
//       await t.resizeWindow(1920, 1080);
//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         questions: [
//           {
//             "type": "expression",
//             "name": "q1",
//             "title": "Question1",
//             "titleLocation": "left",
//             "expression": "123"
//           },
//           {
//             "type": "expression",
//             "name": "q2",
//             "title": "Question2",
//             "expression": "123"
//           },
//         ],
//         "focusFirstQuestionAutomatic": true
//       });
//       await takeElementScreenshot("expression-title-left.png", Selector(".sd-question[data-name=q1]"), t, comparer);
//       await takeElementScreenshot("expression-title-top.png", Selector(".sd-question[data-name=q2]"), t, comparer);
//     });
//   });

//   test("Expression text breaks into lines", async (t) => {
//     await wrapVisualTest(t, async (t, comparer) => {
//       await t.resizeWindow(1920, 1080);
//       await ClientFunction(() => {
//         function currentTestDate() {
//           return new Date(2024, 5, 30, 9, 10, 36);
//         }
//         window["Survey"].FunctionFactory.Instance.register("currentTestDate", currentTestDate);
//       })();

//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         "logoPosition": "right",
//         "pages": [
//           {
//             "name": "page1",
//             "elements": [
//               {
//                 "type": "text",
//                 "name": "question1"
//               },
//               {
//                 "type": "expression",
//                 "name": "question2",
//                 "startWithNewLine": false,
//                 "expression": "currentTestDate()"
//               }
//             ]
//           }
//         ],
//         "widthMode": "static",
//         "width": "800px"
//       });
//       await takeElementScreenshot("expression-word-breaks.png", Selector(".sd-question[data-name=question2]"), t, comparer);
//     });
//   });

// });


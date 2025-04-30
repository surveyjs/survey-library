// import { Selector, ClientFunction } from "testcafe";
// import { url, frameworks, initSurveyPopup, takeElementScreenshot, wrapVisualTest } from "../../helper";

// const title = "Survey Popup Screenshot";

// fixture`${title}`.page`${url}`;

// const json = {
//   "title": "Send Feedback to the SurveyJS team",
//   "description": "Need help? Visit our support page.",
//   "pages": [
//     {
//       "name": "page1",
//       "elements": [
//         {
//           "type": "comment",
//           "name": "feedback",
//           "title": "Describe your feedback",
//           "isRequired": true
//         }
//       ]
//     }
//   ],
//   "showQuestionNumbers": "off"
// };

// frameworks.forEach(framework => {
//   fixture`${framework} ${title}`
//     .page`${url}${framework}`;

//   test("Check Survey-Popup", async (t) => {
//     await wrapVisualTest(t, async (t, comparer) => {
//       await t.resizeWindow(1920, 1080);
//       await initSurveyPopup(framework, json);
//       await takeElementScreenshot("survey-popup.png", Selector(".sv_window"), t, comparer);
//       await t.click(".sv_window_button_collapse");
//       await takeElementScreenshot("survey-popup--collapsed.png", Selector(".sv_window"), t, comparer);
//     });
//   });

//   test("Check Survey-Popup Full Screen Mode", async (t) => {
//     await wrapVisualTest(t, async (t, comparer) => {
//       await t.resizeWindow(1920, 1080);
//       await initSurveyPopup(framework, json);
//       await t.click(".sv_window_button_full_screen");
//       await takeElementScreenshot("survey-popup--full-screen.png", Selector(".sv_window"), t, comparer);
//     });
//   });
// });
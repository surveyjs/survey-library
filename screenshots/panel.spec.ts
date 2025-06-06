// import { test, expect } from "@playwright/test";
// import { url, frameworks, initSurvey } from "../../visualRegressionTests/helper";

// const title = "Panel Screenshot";

// frameworks.forEach(framework => {
//   test.describe(`${framework} ${title}`, () => {
//     test.beforeEach(async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//     });

//     test("Check oridinary panel", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1080 });
//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         focusFirstQuestionAutomatic: true,
//         width: "900px",
//         questions: [
//           {
//             type: "panel",
//             name: "delivery_details",
//             title: "Please, specify the delivery details.",
//             minWidth: "708px",
//             maxWidth: "708px",
//             width: "708px",
//             elements: [
//               {
//                 type: "radiogroup",
//                 name: "delivery_agent",
//                 title: "Delivery agent",
//                 choices: ["DHL", "Pony Express", "FedEx"]
//               },
//               {
//                 type: "boolean",
//                 name: "delivery_speed",
//                 title: "Do you like to get the order as fast as it possible?"
//               }
//             ]
//           },
//         ]
//       });
//       const panelRoot = page.locator(".sd-panel");
//       await expect(panelRoot).toHaveScreenshot("panel.png");
//     });

//     test("Check panel with elements in one line", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1080 });
//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         width: "900px",
//         questions: [
//           {
//             type: "panel",
//             name: "delivery_details",
//             title: "Contact",
//             minWidth: "780px",
//             maxWidth: "780px",
//             width: "780px",
//             elements: [
//               {
//                 type: "text",
//                 name: "question_with_num",
//                 title: "Personal information"
//               },
//               {
//                 type: "text",
//                 name: "question_with_num",
//                 startWithNewLine: false,
//                 title: "Contact information"
//               },
//               {
//                 type: "text",
//                 name: "question_with_num",
//                 startWithNewLine: false,
//                 title: "Other information"
//               },
//             ]
//           },
//         ]
//       });
//       await page.evaluate(() => document.body.focus());
//       const panelRoot = page.locator(".sd-panel");
//       await expect(panelRoot).toHaveScreenshot("panel-elements-one-row.png");
//     });

//     test("Check panel expand/collapse", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1080 });
//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         width: "900px",
//         questions: [
//           {
//             type: "panel",
//             name: "delivery_details",
//             title: "Please, specify the delivery details.",
//             minWidth: "708px",
//             maxWidth: "708px",
//             width: "708px",
//             state: "collapsed",
//             elements: [
//               {
//                 type: "radiogroup",
//                 name: "delivery_agent",
//                 title: "Delivery agent",
//                 choices: ["DHL", "Pony Express", "FedEx"]
//               },
//               {
//                 type: "boolean",
//                 name: "delivery_speed",
//                 title: "Do you like to get the order as fast as it possible?"
//               }
//             ]
//           },
//         ]
//       });

//       const panelRoot = page.locator(".sd-panel");
//       await expect(panelRoot).toHaveScreenshot("panel-collapse.png");
//       await panelRoot.locator(".sd-panel__title").click();
//       await expect(panelRoot).toHaveScreenshot("panel-expand.png");
//     });

//     test("Check panel expand/collapse - rtl", async ({ page }) => {
//       await page.evaluate(() => {
//         document.body.setAttribute("dir", "rtl");
//       });

//       await page.setViewportSize({ width: 1920, height: 1080 });
//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         width: "900px",
//         questions: [
//           {
//             type: "panel",
//             name: "details",
//             title: "Please answer",
//             minWidth: "708px",
//             maxWidth: "708px",
//             width: "708px",
//             state: "collapsed",
//             elements: [
//               {
//                 type: "text",
//                 name: "question",
//               }
//             ]
//           },
//         ]
//       });

//       const panelRoot = page.locator(".sd-panel");
//       await expect(panelRoot).toHaveScreenshot("panel-collapse-rtl.png");
//       await panelRoot.locator(".sd-panel__title").click();
//       await expect(panelRoot).toHaveScreenshot("panel-expand-rtl.png");

//       await page.setViewportSize({ width: 400, height: 1080 });
//       await expect(panelRoot).toHaveScreenshot("panel-expand-mobile-rtl.png");

//       await page.evaluate(() => {
//         document.body.setAttribute("dir", "ltr");
//       });
//     });

//     test("Check invisible panel when showInvisibleElements: true", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1080 });
//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         width: "900px",
//         questions: [
//           {
//             type: "panel",
//             name: "delivery_details",
//             title: "Please, specify the delivery details.",
//             minWidth: "708px",
//             maxWidth: "708px",
//             width: "708px",
//             visible: false,
//             elements: [
//               {
//                 type: "radiogroup",
//                 name: "delivery_agent",
//                 title: "Delivery agent",
//                 choices: ["DHL", "Pony Express", "FedEx"]
//               },
//               {
//                 type: "boolean",
//                 name: "delivery_speed",
//                 title: "Do you like to get the order as fast as it possible?"
//               }
//             ]
//           },
//         ]
//       });
//       const panelRoot = page.locator(".sd-panel");
//       await page.evaluate(() => { (window as any).survey.showInvisibleElements = true; });
//       await page.evaluate(() => document.body.focus());
//       await expect(panelRoot).toHaveScreenshot("panel-invisible.png");
//     });
//   });
// });
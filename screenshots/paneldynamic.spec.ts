// import { test, expect } from "@playwright/test";
// import { url, frameworks, initSurvey } from "../../visualRegressionTests/helper";

// const title = "Paneldynamic Screenshot";

// var json = {
//   showQuestionNumbers: "off",
//   width: "900px",
//   questions: [
//     {
//       type: "paneldynamic",
//       name: "applications",
//       title: "What application do you use?",
//       renderMode: "progressTop",
//       templateTitle: "{panel.application}",
//       templateElements: [
//         {
//           name: "application",
//           type: "dropdown",
//           title: "Application",
//           defaultValue: "Adobe Photoshop",
//           choices: [
//             "Adobe Photoshop",
//           ],
//         },
//         {
//           name: "often",
//           type: "radiogroup",
//           title: "How often do you use this applications?",
//           choices: ["Rare", "Sometimes", "Always"]
//         }
//       ],
//       panelCount: 2,
//       noEntriesText: "You can add as many applications as you want.\nJust click the button below to start.",
//       panelAddText: "Add application",
//       panelRemoveText: "Remove application",
//       maxWidth: "768px",
//       minWidth: "768px",
//       width: "768px"
//     },
//   ]
// };

// frameworks.forEach(framework => {
//   test.describe(`${framework} ${title}`, () => {
//     test.beforeEach(async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await initSurvey(framework, json);
//     });

//     test("Paneldynamic progressTop mode", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1080 });
//       const paneldynamicRoot = page.locator(".sd-question--paneldynamic");

//       await page.evaluate(() => {
//         (window as any).survey.getQuestionByName("applications").currentIndex = 2;
//       });
//       await expect(paneldynamicRoot).toHaveScreenshot("paneldynamic-progress-top.png");

//       await page.evaluate(() => {
//         (window as any).survey.getAllQuestions()[0].allowRemovePanel = false;
//       });
//       await expect(paneldynamicRoot).toHaveScreenshot("paneldynamic-without-remove-button.png");

//       await page.evaluate(() => {
//         (window as any).survey.getAllQuestions()[0].allowRemovePanel = true;
//         (window as any).survey.getQuestionByName("applications").legacyNavigation = true;
//       });
//       await expect(paneldynamicRoot).toHaveScreenshot("paneldynamic-progress-top-legacy-navigation.png");

//       await page.evaluate(() => {
//         (window as any).survey.getQuestionByName("applications").panelCount = 0;
//       });
//       await expect(paneldynamicRoot).toHaveScreenshot("paneldynamic-empty.png");
//     });

//     test("Paneldynamic list mode", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1920 });
//       const paneldynamicRoot = page.locator(".sd-question--paneldynamic");

//       await page.evaluate(() => {
//         document.body.focus();
//         (window as any).survey.getQuestionByName("applications").renderMode = "list";
//       });
//       await expect(paneldynamicRoot).toHaveScreenshot("paneldynamic-list.png");
//     });
//   });
// });

// frameworks.forEach(framework => {
//   test.describe(`${framework} ${title}`, () => {
//     test.beforeEach(async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await initSurvey(framework, json, {
//         onGetPanelFooterActions: (_, opt) => {
//           opt.actions.push({
//             title: "Duplicate",
//             action: () => { }
//           });
//         }
//       });
//     });

//     test("Check paneldynamic with custom actions", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1080 });
//       const paneldynamicRoot = page.locator(".sd-question--paneldynamic");

//       await page.evaluate(() => {
//         document.body.focus();
//       });
//       await expect(paneldynamicRoot).toHaveScreenshot("paneldynamic-with-custom-actions.png");
//     });
//   });
// });

// frameworks.forEach(framework => {
//   const json = {
//     showQuestionNumbers: "on",
//     elements: [
//       {
//         type: "panel",
//         title: "Panel",
//         elements: [
//           {
//             type: "paneldynamic",
//             name: "nested_paneldynamic",
//             title: "Paneldynamic",
//             panelCount: 1,
//             templateElements: [{
//               name: "q2",
//               title: "Text question",
//               type: "text"
//             }]
//           },
//           {
//             type: "paneldynamic",
//             name: "nested_paneldynamic2",
//             title: "Paneldynamic",
//             startWithNewLine: false,
//             panelCount: 1,
//             templateElements: [{
//               name: "q2",
//               title: "Text question",
//               type: "text"
//             }]
//           }
//         ]
//       }
//     ]
//   };

//   test.describe(`${framework} ${title}`, () => {
//     test.beforeEach(async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await initSurvey(framework, json);
//     });

//     test("Two Paneldynamics in one row", async ({ page }) => {
//       await page.setViewportSize({ width: 1920, height: 1920 });
//       await page.evaluate(() => {
//         document.body.focus();
//       });
//       await expect(page.locator(".sd-panel")).toHaveScreenshot("two-paneldynamic-in-one-row.png");
//     });
//   });
// });

// frameworks.forEach(framework => {
//   const json = {
//     showQuestionNumbers: "on",
//     "logoPosition": "right",
//     "pages": [
//       {
//         "name": "page1",
//         "elements": [
//           {
//             type: "paneldynamic",
//             name: "relatives",
//             title: "Panel Dynamic",
//             renderMode: "tab",
//             templateTitle: "Information about: {panel.relativeType}",
//             templateElements: [
//               {
//                 name: "relativeType",
//                 type: "dropdown",
//                 title: "Relative",
//                 choices: [
//                   "father",
//                   "mother",
//                   "brother",
//                   "sister",
//                   "son",
//                   "daughter"
//                 ],
//                 isRequired: true
//               },
//               {
//                 name: "isalive",
//                 type: "radiogroup",
//                 title: "Alive?",
//                 startWithNewLine: false,
//                 isRequired: true,
//                 colCount: 0,
//                 choices: ["Yes", "No"]
//               },
//               {
//                 name: "liveage",
//                 type: "dropdown",
//                 title: "Age",
//                 isRequired: true,
//                 startWithNewLine: false,
//                 visibleIf: "{panel.isalive} = 'Yes'",
//                 choicesMin: 1,
//                 choicesMax: 115
//               },
//               {
//                 name: "deceasedage",
//                 type: "dropdown",
//                 title: "Deceased Age",
//                 isRequired: true,
//                 startWithNewLine: false,
//                 visibleIf: "{panel.isalive} = 'No'",
//                 choices: [
//                   {
//                     value: -1,
//                     text: "Unknown"
//                   }
//                 ],
//                 choicesMin: 1,
//                 choicesMax: 115
//               },
//               {
//                 name: "causeofdeathknown",
//                 type: "radiogroup",
//                 title: "Cause of Death Known?",
//                 isRequired: true,
//                 colCount: 0,
//                 startWithNewLine: false,
//                 visibleIf: "{panel.isalive} = 'No'",
//                 choices: ["Yes", "No"]
//               },
//               {
//                 name: "causeofdeath",
//                 type: "text",
//                 title: "Cause of Death",
//                 isRequired: true,
//                 startWithNewLine: false,
//                 visibleIf:
//                   "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
//               }
//             ],
//             panelCount: 2,
//             panelAddText: "Add a blood relative",
//             panelRemoveText: "Remove the relative"
//           }
//         ]
//       }
//     ]
//   };

//   test.describe(`${framework} ${title}`, () => {
//     test.beforeEach(async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await initSurvey(framework, json);
//     });

//     test("Navigation panel by tabs", async ({ page }) => {
//       await page.setViewportSize({ width: 1280, height: 900 });
//       await page.evaluate(() => {
//         document.body.focus();
//       });
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("paneldynamic-tabs-with-title.png");

//       await page.hover("button:has-text('Panel 2')");
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("paneldynamic-tabs-hover-tab.png");

//       await page.evaluate(() => {
//         (window as any).survey.getQuestionByName("relatives").titleLocation = "hidden";
//       });
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("paneldynamic-tabs-without-title.png");

//       await page.evaluate(() => {
//         (window as any).survey.getQuestionByName("relatives").panelCount = 15;
//       });
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("paneldynamic-tabs-responsiveness.png");

//       await page.hover(".sv-dots");
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("paneldynamic-tabs-responsiveness-hover.png");
//     });
//   });
// });

// frameworks.forEach(framework => {
//   const json = {
//     showQuestionNumbers: "on",
//     "logoPosition": "right",
//     "pages": [
//       {
//         "name": "page1",
//         "elements": [
//           {
//             type: "paneldynamic",
//             name: "relatives",
//             title: "Panel Dynamic",
//             templateTitle: "Information about: {panel.relativeType}",
//             templateElements: [
//               {
//                 name: "relativeType",
//                 type: "dropdown",
//                 title: "Relative",
//                 choices: [
//                   "father",
//                   "mother",
//                   "brother",
//                   "sister",
//                   "son",
//                   "daughter"
//                 ],
//                 isRequired: true
//               },
//               {
//                 name: "isalive",
//                 type: "radiogroup",
//                 title: "Alive?",
//                 startWithNewLine: false,
//                 isRequired: true,
//                 colCount: 0,
//                 choices: ["Yes", "No"]
//               },
//               {
//                 name: "liveage",
//                 type: "dropdown",
//                 title: "Age",
//                 isRequired: true,
//                 startWithNewLine: false,
//                 visibleIf: "{panel.isalive} = 'Yes'",
//                 choicesMin: 1,
//                 choicesMax: 115
//               },
//               {
//                 name: "deceasedage",
//                 type: "dropdown",
//                 title: "Deceased Age",
//                 isRequired: true,
//                 startWithNewLine: false,
//                 visibleIf: "{panel.isalive} = 'No'",
//                 choices: [
//                   {
//                     value: -1,
//                     text: "Unknown"
//                   }
//                 ],
//                 choicesMin: 1,
//                 choicesMax: 115
//               },
//               {
//                 name: "causeofdeathknown",
//                 type: "radiogroup",
//                 title: "Cause of Death Known?",
//                 isRequired: true,
//                 colCount: 0,
//                 startWithNewLine: false,
//                 visibleIf: "{panel.isalive} = 'No'",
//                 choices: ["Yes", "No"]
//               },
//               {
//                 name: "causeofdeath",
//                 type: "text",
//                 title: "Cause of Death",
//                 isRequired: true,
//                 startWithNewLine: false,
//                 visibleIf:
//                   "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
//               }
//             ],
//             panelCount: 1,
//             maxPanelCount: 1,
//             minPanelCount: 1
//           }
//         ]
//       }
//     ]
//   };

//   test.describe(`${framework} ${title}`, () => {
//     test.beforeEach(async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await initSurvey(framework, json);
//     });

//     test("Paneldynamic without buttons", async ({ page }) => {
//       await page.setViewportSize({ width: 1280, height: 900 });
//       await page.evaluate(() => {
//         document.body.focus();
//       });
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("paneldynamic-without-buttons.png");
//     });
//   });
// });

// frameworks.forEach(framework => {
//   const json = {
//     showQuestionNumbers: "on",
//     "focusFirstQuestionAutomatic": true,
//     "pages": [
//       {
//         "name": "page1",
//         "elements": [{
//           "type": "paneldynamic",
//           "panelCount": 1,
//           "name": "question1",
//           "templateElements": [
//             {
//               "type": "text",
//               "name": "question2"
//             }
//           ],
//           "confirmDelete": true
//         }]
//       }
//     ]
//   };

//   test.describe(`${framework} ${title}`, () => {
//     test.beforeEach(async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await initSurvey(framework, json);
//     });

//     test("Paneldynamic confirm dialog", async ({ page }) => {
//       await page.setViewportSize({ width: 1280, height: 900 });
//       await page.keyboard.press("a");
//       await page.keyboard.press("b");
//       await page.keyboard.press("c");
//       await page.keyboard.press("Tab");
//       await page.click(".sd-paneldynamic__remove-btn");
//       await expect(page.locator(".sv-popup--confirm .sv-popup__body-content")).toHaveScreenshot("paneldynamic-confirm-dialog.png");

//       await page.evaluate(() => {
//         const applyButton = document.querySelector("#apply");
//         const spanText = applyButton?.querySelector("span");
//         if (spanText) spanText.innerText = "A very long long long long long text";
//       });
//       await expect(page.locator(".sv-popup--confirm .sv-popup__body-content")).toHaveScreenshot("paneldynamic-confirm-dialog--long-button-text.png");
//     });
//   });
// });

// frameworks.forEach(framework => {
//   test.describe(`${framework} ${title}`, () => {
//     test("tab focused state for panel dynamic", async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await page.setViewportSize({ width: 1280, height: 900 });
//       await initSurvey(framework, {
//         showQuestionNumbers: "on",
//         "pages": [
//           {
//             "name": "page1",
//             "elements": [
//               {
//                 "type": "paneldynamic",
//                 "name": "question1",
//                 "templateElements": [
//                   {
//                     "type": "text",
//                     "name": "question2"
//                   }
//                 ],
//                 "panelCount": 4,
//                 "minPanelCount": 4,
//                 "renderMode": "tab"
//               }
//             ]
//           }
//         ]
//       });
//       await page.click("button[title='Panel 1']");
//       await page.keyboard.press("Tab");
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("paneldynamic-focused-tab.png");
//     });

//     test("Comment bottom padding in dynamic panel", async ({ page }) => {
//       await page.goto(`${url}${framework}`);
//       await page.setViewportSize({ width: 800, height: 600 });
//       const json = {
//         "pages": [
//           {
//             "name": "page1",
//             "elements": [
//               {
//                 "type": "paneldynamic",
//                 "name": "question1",
//                 "showCommentArea": true,
//                 "panelCount": 1,
//                 "templateElements": [
//                   {
//                     "type": "text",
//                     "name": "question2"
//                   }
//                 ]
//               }
//             ]
//           }
//         ],
//         "showQuestionNumbers": "off"
//       };

//       await initSurvey(framework, json);
//       await page.waitForTimeout(100);
//       await expect(page.locator(".sd-question--paneldynamic")).toHaveScreenshot("panel-dynamic-comment.png");
//     });
//   });
// });
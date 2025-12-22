import { frameworks, url, initSurvey, getSurveyResult, getQuestionJson, getVisibleListItemByText, test, expect } from "../helper";

const title = "paneldynamic";

const json = {
  pages: [
    {
      name: "page1",
      elements: [
        {
          type: "paneldynamic",
          name: "relatives",
          title: "Please enter all blood relatives you know",
          displayMode: "carousel",
          defaultValue: [
            { relativeType: "father" },
            { relativeType: "mother" },
          ],
          templateTitle: "Information about: {panel.relativeType}",
          templateElements: [
            {
              name: "relativeType",
              type: "dropdown",
              title: "Relative",
              choices: [
                "father",
                "mother",
                "brother",
                "sister",
                "son",
                "daughter",
              ],
              isRequired: true,
            },
            {
              name: "isalive",
              type: "radiogroup",
              title: "Alive?",
              startWithNewLine: false,
              isRequired: true,
              colCount: 0,
              choices: ["Yes", "No"],
            },
            {
              name: "liveage",
              type: "dropdown",
              title: "Age",
              isRequired: true,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'Yes'",
              choicesMin: 1,
              choicesMax: 115,
            },
            {
              name: "deceasedage",
              type: "dropdown",
              title: "Deceased Age",
              isRequired: true,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: [
                {
                  value: -1,
                  text: "Unknown",
                },
              ],
              choicesMin: 1,
              choicesMax: 115,
            },
            {
              name: "causeofdeathknown",
              type: "radiogroup",
              title: "Cause of Death Known?",
              isRequired: true,
              colCount: 0,
              startWithNewLine: false,
              visibleIf: "{panel.isalive} = 'No'",
              choices: ["Yes", "No"],
            },
            {
              name: "causeofdeath",
              type: "text",
              title: "Cause of Death",
              isRequired: true,
              startWithNewLine: false,
              visibleIf:
                "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'",
            },
            {
              type: "panel",
              name: "moreInfo",
              state: "expanded",
              title: "Detail Information about: {panel.relativeType}",
              elements: [
                {
                  type: "matrixdynamic",
                  name: "relativeillness",
                  title: "Describe the illness or condition.",
                  rowCount: 0,
                  columns: [
                    {
                      name: "illness",
                      cellType: "dropdown",
                      title: "Illness/Condition",
                      choices: [
                        "Cancer",
                        "Heart Disease",
                        "Diabetes",
                        "Stroke/TIA",
                        "High Blood Pressure",
                        "High Cholesterol or Triglycerides",
                        "Liver Disease",
                        "Alcohol or Drug Abuse",
                        "Anxiety, Depression or Psychiatric Illness",
                        "Tuberculosis",
                        "Anesthesia Complications",
                        "Genetic Disorder",
                        "Other - describe",
                      ],
                      isRequired: true,
                    },
                    {
                      name: "description",
                      cellType: "text",
                      title: "Describe",
                      isRequired: true,
                    },
                  ],
                },
              ],
            },
          ],
          addPanelText: "Add a blood relative",
          removePanelText: "Remove the relative",
        },
      ],
    },
  ],
};

const json3 = {
  autoFocusFirstQuestion: true,
  elements: [
    {
      type: "matrixdynamic",
      name: "matrix",
      valueName: "a",
      columns: [
        { cellType: "text", name: "col1" }
      ]
    },
    {
      type: "paneldynamic",
      name: "panel",
      valueName: "a",
      templateElements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2" },
      ],
      templateVisibleIf: "{panel.col1}='a'",
      displayMode: "tab",
      templateTabTitle: "#{visiblePanelIndex}-{panelIndex}"
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(`${url}${framework}`);
    });

    test("fill panel dynamic and add new panel", async ({ page }) => {
      await initSurvey(page, framework, json);
      const relativeTypeDropdown = page.locator("div[data-name='relativeType'] .sd-dropdown");
      const ageDropdown = page.locator("div[data-name='liveage'] .sd-dropdown");
      const deceasedAgeDropdown = page.locator("div[data-name='deceasedage'] .sd-dropdown");
      const relativeillnessDropdown = page.locator("div[data-name='relativeillness'] .sd-dropdown");

      const nextButtonSelector = page.locator("button[title='Next']");
      const prevButtonSelector = page.locator("button[title='Previous']");

      const addRowSelector = page.locator("button").locator("span").filter({ hasText: "Add Row" });

      await page.locator("label").filter({ hasText: "Yes" }).locator("span").first().click();

      await ageDropdown.click();
      await getVisibleListItemByText(page, "72").click();
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await expect(ageDropdown.locator(".sv-string-viewer")).toHaveText("72");

      await nextButtonSelector.click();
      await page.locator("label").filter({ hasText: "Yes" }).locator("span").first().click();

      await ageDropdown.click();
      await getVisibleListItemByText(page, "65").click();
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await expect(ageDropdown.locator(".sv-string-viewer")).toHaveText("65");

      await page.locator(".sd-paneldynamic__add-btn").filter({ hasText: "Add a blood relative" }).click();

      await relativeTypeDropdown.click();
      await getVisibleListItemByText(page, "sister").click();
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await expect(relativeTypeDropdown.locator(".sv-string-viewer")).toHaveText("sister");
      await page.locator("label").filter({ hasText: "No" }).locator("span").first().click();

      await deceasedAgeDropdown.click();
      await getVisibleListItemByText(page, "42").click();
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await expect(deceasedAgeDropdown.locator(".sv-string-viewer")).toHaveText("42");
      await page.getByLabel("Cause of Death Known?").locator("div").filter({ hasText: "No" }).click();
      await prevButtonSelector.click();
      await prevButtonSelector.click();

      await addRowSelector.click();

      await relativeillnessDropdown.click();
      await getVisibleListItemByText(page, "Diabetes").click();
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await expect(relativeillnessDropdown.locator(".sv-string-viewer")).toHaveText("Diabetes");
      await page.locator("td[title=\"Describe\"] input[type=\"text\"]").fill("Type 2");
      await page.locator("body").click({ position: { x: 1, y: 1 } });

      await nextButtonSelector.click();
      await page.getByRole("button", { name: "Remove the relative" }).click();
      await page.locator(".sd-navigation__complete-btn").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        relatives: [
          {
            relativeType: "father",
            isalive: "Yes",
            liveage: 72,
            relativeillness: [
              {
                illness: "Diabetes",
                description: "Type 2",
              },
            ],
          },
          {
            relativeType: "sister",
            isalive: "No",
            causeofdeathknown: "No",
            deceasedage: 42
          },
        ],
      });
    });

    test("click on panel title state editable", async ({ page }) => {
      await initSurvey(page, framework, json, true);
      const newTitle = "MyText";
      const outerSelector = ".sd-question__title";
      const innerSelector = ".sv-string-editor";
      await page.locator(outerSelector).first().click();
      await page.locator(outerSelector + " " + innerSelector).first().fill(newTitle);
      await page.locator("body").click({ position: { x: 0, y: 0 } });

      const questionJson = JSON.parse(await getQuestionJson(page));
      expect(questionJson.title).toBe(newTitle);
    });

    test("Add new panels", async ({ page }) => {
      const json2 = {
        elements: [
          {
            type: "paneldynamic",
            name: "panel",
            displayMode: "carousel",
            progressBarLocation: "topBottom",
            templateElements: [
              { type: "text", name: "q1" },
            ],
          },
        ],
      };
      await initSurvey(page, framework, json2);
      const addNewSelector = page.getByRole("button", { name: "Add new" });
      const textSelector = page.locator("input[type='text']");
      await addNewSelector.click();
      await textSelector.fill("1");
      await addNewSelector.click();
      await textSelector.fill("2");
      await addNewSelector.click();
      await textSelector.fill("3");
      await addNewSelector.click();
      await textSelector.fill("4");
      await addNewSelector.click();
      await textSelector.fill("5");
      await page.locator("input[title='Complete']").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.panel).toEqual([{ q1: "1" }, { q1: "2" }, { q1: "3" }, { q1: "4" }, { q1: "5" }]);
    });

    test("templateVisibleIf", async ({ page }) => {
      await initSurvey(page, framework, json3);
      const addNewSelector = page.getByRole("button", { name: "Add new" });
      await expect(addNewSelector).toHaveCount(1);
      await expect(page.locator("span").filter({ hasText: "#1-2" })).not.toBeVisible();
      await page.waitForTimeout(500);
      await page.keyboard.press("b");
      await page.keyboard.press("Tab");
      await expect(addNewSelector).toHaveCount(1);
      await page.keyboard.press("Tab");
      await page.keyboard.press("a");
      await page.keyboard.press("Tab");
      await expect(addNewSelector).toHaveCount(1);
      await expect(page.locator("span").filter({ hasText: "#1-2" })).toBeVisible();
    });

    test("templateVisibleIf displayMode: list", async ({ page }) => {
      await initSurvey(page, framework, json3);
      await page.evaluate(() => {
        (window as any).survey.getQuestionByName("panel").displayMode = "list";
      });
      const titleSelector = page.locator("span").filter({ hasText: "q1" });
      await expect(titleSelector).toHaveCount(0);
      await page.keyboard.press("b");
      await page.keyboard.press("Tab");
      await expect(titleSelector).toHaveCount(0);
      await page.keyboard.press("Tab");
      await page.keyboard.press("a");
      await page.keyboard.press("Tab");
      await expect(titleSelector).toHaveCount(1);
    });

    test("restful checkbox with showOtherItem & storeOthersAsComment set to false in panel dynamic", async ({ page }) => {
      const jsonCheckboxRestFul = {
        storeOthersAsComment: false,
        elements: [
          {
            name: "panel",
            type: "paneldynamic",
            templateElements: [{
              type: "checkbox",
              name: "q1",
              choicesByUrl: {
                url: "http://127.0.0.1:8080/test-resources/countriesMock.json",
                path: "RestResponse;result",
                valueName: "name",
              },
              "showOtherItem": true
            }]
          }
        ]
      };
      await initSurvey(page, framework, jsonCheckboxRestFul);
      await page.evaluate((data) => {
        window["survey"].data = data;
        window["survey"].render();
      }, { "panel": [{ "q1": ["newCountry"] }] });
      await expect(page.locator("textarea").first()).toHaveValue("newCountry");
    });

    test("Check valueName for two paneldynamics - #6584", async ({ page }) => {
      await initSurvey(page, framework, {
        logoPosition: "right",
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "paneldynamic",
                name: "panel1",
                valueName: "sharedData",
                templateElements: [
                  {
                    type: "text",
                    name: "name",
                    defaultValueExpression: '({panelindex} + 1) +  " name"'
                  },
                ],
              },
              {
                type: "paneldynamic",
                name: "panel2",
                valueName: "sharedData",
                templateElements: [
                  {
                    type: "matrixdynamic",
                    name: "matrix1",
                    rowCount: 1,
                    columns: [
                      {
                        name: "b_eil_nr",
                        cellType: "text",
                        readOnly: true,
                        defaultValueExpression: "{panelindex} + 1",
                        inputType: "number"
                      },
                      {
                        name: "b_name",
                        cellType: "text",
                        readOnly: true,
                        defaultValueExpression: "{panel.name}"
                      }
                    ],
                    cellType: "text"
                  }
                ]
              }
            ]
          }
        ]
      });
      await page.getByRole("button", { name: "Add new" }).first().click();
      await page.locator("input[value='Complete']").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        sharedData: [
          {
            matrix1: [
              {
                b_eil_nr: 1,
                b_name: "1 name"
              }
            ],
            name: "1 name"
          }
        ]
      });
    });
    test("Reactive addPanelText/removePanelText - #7658", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            type: "paneldynamic",
            name: "panel1",
            panelCount: 2,
            displayMode: "tab",
            newPanelPosition: "next",
            templateElements: [
              {
                type: "text",
                name: "name"
              },
            ],
          }
        ]
      });
      await page.evaluate(() => {
        const q = (window as any).survey.getQuestionByName("panel1");
        q.addPanelText = "#Add#";
        q.removePanelText = "#Remove#";
      });
      await expect(page.locator("button").filter({ hasText: "#Add#" })).toBeVisible();
      await expect(page.locator("button").filter({ hasText: "#Remove#" })).toBeVisible();
    });
    test("Focus first input on adding a new panel", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            type: "paneldynamic",
            name: "panel1",
            panelCount: 0,
            newPanelPosition: "next",
            templateElements: [
              {
                type: "text",
                name: "name"
              },
            ],
          }
        ]
      });
      await page.locator("button").filter({ hasText: "Add" }).click();
      await page.keyboard.type("123");
      await page.locator("button").filter({ hasText: "Add" }).click();
      await page.keyboard.type("456");
      await page.locator("button").filter({ hasText: "Add" }).click();
      await page.keyboard.type("789");
      await page.locator(".sd-navigation__complete-btn").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        panel1: [{ name: "123" }, { name: "456" }, { name: "789" }]
      });
    });
    test("Focus first input on adding a new panel, displayMode='tab'", async ({ page }) => {
      await initSurvey(page, framework, {
        elements: [
          {
            type: "paneldynamic",
            name: "panel1",
            panelCount: 0,
            displayMode: "tab",
            newPanelPosition: "next",
            templateElements: [
              {
                type: "text",
                name: "name"
              },
            ],
          }
        ]
      });
      await page.locator("button").filter({ hasText: "Add" }).click();
      await page.waitForTimeout(1000);
      await page.keyboard.type("123");
      await page.locator("button").filter({ hasText: "Add" }).click();
      await page.waitForTimeout(1000);
      await page.keyboard.type("456");
      await page.locator("button").filter({ hasText: "Add" }).click();
      await page.waitForTimeout(1000);
      await page.keyboard.type("789");
      await page.locator(".sd-navigation__complete-btn").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        panel1: [{ name: "123" }, { name: "456" }, { name: "789" }]
      });
    });
    test("Check dynamic panel actionbar responsivity", async ({ page }) => {
      await initSurvey(page, framework, {
        "logoPosition": "right",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "question1",

                "templateElements": [
                  {
                    "type": "text",
                    "name": "question2"
                  }
                ],
                "displayMode": "tab"
              }
            ]
          }
        ]
      });
      for (let i = 0; i < 10; i++) {
        await page.getByRole("button", { name: "Add new" }).click();
      }
      await expect(page.getByRole("button", { name: "More" })).toBeVisible();
    });
    test("Focus first input on adding a new panel by keyboard", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "paneldynamic",
            name: "panel1",
            panelCount: 0,
            templateElements: [
              {
                type: "text",
                name: "name"
              },
            ],
          }
        ]
      });
      await expect(page.getByRole("button", { name: "Add new" })).toBeFocused();
      await page.keyboard.press("Space");
      await expect(page.getByRole("textbox", { name: "name" })).toBeFocused();
      await page.keyboard.type("123");
      await page.locator(".sd-navigation__complete-btn").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ panel1: [{ name: "123" }] });
    });
    test("Focus first input on removing and adding panels, #8940", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "paneldynamic",
            name: "panel1",
            panelCount: 3,
            templateElements: [
              {
                type: "text",
                name: "name",
                defaultValue: "abc"
              },
            ],
          }
        ]
      });
      await expect(page.getByRole("textbox", { name: "name" }).first()).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await expect(page.getByRole("button", { name: "Add new" })).toBeFocused();
      await page.keyboard.press("Space");
      await expect(page.getByRole("textbox", { name: "name" }).first()).toBeFocused();
      await page.keyboard.type("123");
      await page.locator(".sd-navigation__complete-btn").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ panel1: [{ name: "abc123" }] });
    });

    test("checkbox vs valuePropertyName and rendering panels, Bug#10633", async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      const json = {
        elements: [
          {
            type: "checkbox",
            name: "q1",
            choices: ["apple", "banana", "orange"],
            valueName: "data1",
            valuePropertyName: "fruit"
          },
          {
            type: "paneldynamic",
            name: "panel",
            valueName: "data1",
            templateTitle: "{panel.fruit}",
            templateElements: [
              { type: "text", name: "panel_q1" },
            ],
            allowRemovePanel: false,
            allowAddPanel: false
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        window["Survey"].settings.animationEnabled = true;
      });
      await expect(page.locator("input[type=text]")).toHaveCount(0);
      await page.locator(".sd-item__control-label").getByText("apple").click();
      await expect(page.locator("input[type=text]")).toHaveCount(1);
      await page.locator(".sd-item__control-label").getByText("orange").click();
      await expect(page.locator("input[type=text]")).toHaveCount(2);
      await page.keyboard.press("Tab");
      await page.keyboard.type("I eat apple");
      await page.keyboard.press("Tab");
      await page.keyboard.type("I eat orange");

      await page.click("input[value=Complete]");
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
        "data1": [
          {
            "fruit": "apple",
            "panel_q1": "I eat apple"
          },
          {
            "fruit": "orange",
            "panel_q1": "I eat orange"
          }
        ]
      });
    });

  });
});


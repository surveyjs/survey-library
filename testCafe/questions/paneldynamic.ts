import { applyTheme, frameworks, url, url_test, initSurvey, getSurveyResult, getQuestionJson,
  getDynamicPanelRemoveButton, getListItemByText, completeButton, setData } from "../helper";
import { Selector, ClientFunction } from "testcafe";
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
          renderMode: "progressTop",
          defaultValue: [
            {
              relativeType: "father",
            },
            {
              relativeType: "mother",
            },
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
                        "Other – describe",
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
          panelAddText: "Add a blood relative",
          panelRemoveText: "Remove the relative",
        },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("fill panel dynamic and add new panel", async (t) => {
    const relativeTypeDropdown = Selector("div[data-name='relativeType'] .sv_q_dropdown_control");
    const ageDropdown = Selector("div[data-name='liveage'] .sv_q_dropdown_control");
    const deceasedAgeDropdown = Selector("div[data-name='deceasedage'] .sv_q_dropdown_control");
    const relativeillnessDropdown = Selector("div[data-name='relativeillness'] .sv_q_dropdown_control");

    const addRowSelector = Selector("button").find("span").withText("Add Row");

    await t.click("input[value=\"Yes\"]")

      .click(ageDropdown)
      .click(getListItemByText("72"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })
      .expect(ageDropdown.find(".sv-string-viewer").textContent).eql("72")

      .click(".sv-paneldynamic__next-btn")
      .click("input[value=\"Yes\"]")

      .click(ageDropdown)
      .click(getListItemByText("65"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })
      .expect(ageDropdown.find(".sv-string-viewer").textContent).eql("65")

      .click(Selector(".sv-paneldynamic__add-btn").withText("Add a blood relative"))

      .click(relativeTypeDropdown)
      .click(getListItemByText("sister"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })
      .expect(relativeTypeDropdown.find(".sv-string-viewer").textContent).eql("sister")
      .click("input[value=\"No\"]")

      .click(deceasedAgeDropdown)
      .click(getListItemByText("42"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })
      .expect(deceasedAgeDropdown.find(".sv-string-viewer").textContent).eql("42")
      .click("div[data-name='causeofdeathknown'] input[value=\"No\"]")
      .click(".sv-paneldynamic__prev-btn")
      .click(".sv-paneldynamic__prev-btn")

      .click(addRowSelector)

      .click(relativeillnessDropdown)
      .click(getListItemByText("Diabetes"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })
      .expect(relativeillnessDropdown.find(".sv-string-viewer").textContent).eql("Diabetes")
      .typeText("td[title=\"Describe\"] input[type=\"text\"]", "Type 2")
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })

      .click(".sv-paneldynamic__next-btn")
      .click(getDynamicPanelRemoveButton("Please enter all blood relatives you know", "Remove the relative"))

      .click(completeButton);

    await t.expect(await getSurveyResult()).eql({
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
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json, undefined, true);
    }
  );

  test("click on panel title state editable", async (t) => {
    const newTitle = "MyText";
    const outerSelector = ".sv_p_title";
    const innerSelector = ".sv-string-editor";
    await t
      .click(outerSelector)
      .typeText(outerSelector + " " + innerSelector, newTitle, { replace: true })
      .click("body", { offsetX: 0, offsetY: 0 });

    const json = JSON.parse(await getQuestionJson());
    await t.expect(json.title).eql(newTitle);
  });
});

const json2 = {
  elements: [
    {
      type: "paneldynamic",
      name: "panel",
      renderMode: "progressTopBottom",
      templateElements: [
        { type: "text", name: "q1" },
      ],
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url_test}defaultV2/${framework}`.beforeEach(
    async (t) => {
      await applyTheme("defaultV2");
      await initSurvey(framework, json2);
    }
  );

  test("Add new panels", async (t) => {
    const addNewSelector = Selector("span").withText("Add new");
    const textSelector = Selector("input[type='text']");
    await t
      .click(addNewSelector)
      .typeText(textSelector, "1")
      .click(addNewSelector)
      .typeText(textSelector, "2")
      .click(addNewSelector)
      .typeText(textSelector, "3")
      .click(addNewSelector)
      .typeText(textSelector, "4")
      .click(addNewSelector)
      .typeText(textSelector, "5")
      .click("input[title='Complete']");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.panel).eql([{ q1: "1" }, { q1: "2" }, { q1: "3" }, { q1: "4" }, { q1: "5" }]);
  });
});

const json3 = {
  focusFirstQuestionAutomatic: true,
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
      renderMode: "tab",
      templateTabTitle: "#{visiblePanelIndex}-{panelIndex}"
    },
  ],
};
frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url_test}defaultV2/${framework}`.beforeEach(
    async (t) => {
      await applyTheme("defaultV2");
      await initSurvey(framework, json3);
    }
  );

  test("templateVisibleIf", async (t) => {
    const addNewSelector = Selector("button").withText("Add new");
    await t
      .expect(addNewSelector.count).eql(1)
      .expect(Selector("span").withText("#1-2").visible).notOk()
      .pressKey("b")
      .pressKey("tab")
      .expect(addNewSelector.count).eql(1)
      .pressKey("tab")
      .pressKey("a")
      .pressKey("tab")
      .expect(addNewSelector.count).eql(1)
      .expect(Selector("span").withText("#1-2").visible).ok();
  });
  test("templateVisibleIf renderMode: list", async (t) => {
    await ClientFunction(() => {
      (window as any).survey.getQuestionByName("panel").renderMode = "list";
    })();
    const titleSelector = Selector("span").withText("q1");
    await t
      .expect(titleSelector.count).eql(0)
      .pressKey("b")
      .pressKey("tab")
      .expect(titleSelector.count).eql(0)
      .pressKey("tab")
      .pressKey("a")
      .pressKey("tab")
      .expect(titleSelector.count).eql(1);
  });
});
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
          url: "http://127.0.0.1:8080/testCafe/countriesMock.json",
          path: "RestResponse;result",
          valueName: "name",
        },
        "showOtherItem": true
      }]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url_test}defaultV2/${framework}`.beforeEach(
    async (t) => {
    }
  );

  test("restful checkbox with showOtherItem & storeOthersAsComment set to false in panel dynamic", async (t) => {
    await initSurvey(framework, jsonCheckboxRestFul);
    await setData({ "panel": [{ "q1": ["newCountry"] }] });
    await t
      .expect(Selector("textarea").value).eql("newCountry");
  });

  test("Check valueName for two paneldynamics - #6584", async (t) => {
    await initSurvey(framework, {
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
    await t.click(Selector("button").withText("Add new")).click("input[value='Complete']").expect(getSurveyResult()).eql({
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
  test("Reactive panelAddText/panelRemoveText - #7658", async (t) => {
    const changeButtonsText = ClientFunction(
      () => {
        const q = window["survey"].getQuestionByName("panel1");
        q.panelAddText = "#Add#";
        q.panelRemoveText = "#Remove#";
      }
    );
    await initSurvey(framework, {
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 2,
          renderMode: "tab",
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
    await changeButtonsText();
    await t.expect(Selector("button").withText("#Add#").exists).ok();
    await t.expect(Selector("button").withText("#Remove#").exists).ok();
  });
  test("Focus first input on adding a new panel", async (t) => {
    await initSurvey(framework, {
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
    await t.click(Selector("button").withText("Add"))
      .pressKey("1 2 3")
      .click(Selector("button").withText("Add"))
      .pressKey("4 5 6")
      .click(Selector("button").withText("Add"))
      .pressKey("7 8 9")
      .click(Selector(".sd-navigation__complete-btn"));

    await t.expect(await getSurveyResult()).eql({
      panel1: [{ name: "123" }, { name: "456" }, { name: "789" }]
    });
  });
  test("Focus first input on adding a new panel, renderMode='tab'", async (t) => {
    await initSurvey(framework, {
      elements: [
        {
          type: "paneldynamic",
          name: "panel1",
          panelCount: 0,
          renderMode: "tab",
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
    await t.click(Selector("button").withText("Add"))
      .pressKey("1 2 3")
      .click(Selector("button").withText("Add"))
      .pressKey("4 5 6")
      .click(Selector("button").withText("Add"))
      .pressKey("7 8 9")
      .click(Selector(".sd-navigation__complete-btn"));

    await t.expect(await getSurveyResult()).eql({
      panel1: [{ name: "123" }, { name: "456" }, { name: "789" }]
    });
  });
  test("Check dynamic panel actionbar responsivity", async (t) => {
    await initSurvey(framework, {
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
              "renderMode": "tab"
            }
          ]
        }
      ]
    });
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));
    await t.click(Selector("button").withText("Add new"));

    await t.expect(Selector(".sv-action.sv-dots").visible).ok();
  });

});
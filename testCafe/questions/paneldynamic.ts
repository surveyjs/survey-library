import { frameworks, url, initSurvey, getSurveyResult, getQuestionJson, getDynamicPanelRemoveButton } from "../helper";
import { Selector } from "testcafe";
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
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("fill panel dynamic and add new panel", async (t) => {
    const addRowFunc = function (strings, ...values) {
      return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
    };
    const relativeTypeSelect = Selector("div[name='relativeType'] select");
    const relativeTypeOption = relativeTypeSelect.find("option");
    const ageSelect = Selector("div[name='liveage'] select");
    const ageOption = ageSelect.find("option");
    const deceasedAgeSelect = Selector("div[name='deceasedage'] select");
    const deceasedAgeOption = deceasedAgeSelect.find("option");
    const addRowSelector = Selector("button");
    const relativeillnessSelect = Selector("div[name='relativeillness'] select");
    const relativeillnessOption = relativeillnessSelect.find("option");

    await t.click("input[value=\"Yes\"]")

      .click(ageSelect)
      .click(ageOption.withText("72"))
      .expect(ageSelect.value).eql("72")

      .click(".sv-paneldynamic__next-btn")
      .click("input[value=\"Yes\"]")

      .click(ageSelect)
      .click(ageOption.withText("65"))
      .expect(ageSelect.value).eql("65")

      .click(Selector(".sv-paneldynamic__add-btn").withText("Add a blood relative"))

      .click(relativeTypeSelect)
      .click(relativeTypeOption.withText("sister"))
      .expect(relativeTypeSelect.value).eql("sister")
      .click("input[value=\"No\"]")

      .click(deceasedAgeSelect)
      .click(deceasedAgeOption.withText("42"))
      .expect(deceasedAgeSelect.value).eql("42")
      .click("div[name='causeofdeathknown'] input[value=\"No\"]")
      .click(".sv-paneldynamic__prev-btn")
      .click(".sv-paneldynamic__prev-btn")

      .click(addRowSelector.find("span").withText("Add row"))

      .click(relativeillnessSelect)
      .click(relativeillnessOption.withText("Diabetes"))
      .expect(relativeillnessSelect.value).eql("Diabetes")
      .typeText("div[name='relativeillness'] input[type=\"text\"]", "Type 2")

      .click(".sv-paneldynamic__next-btn")
      .click(getDynamicPanelRemoveButton("Please enter all blood relatives you know", "Remove the relative"))

      .click("input[value=Complete]");

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
  fixture`${framework} ${title}`.page`${url}${framework}.html`.beforeEach(
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

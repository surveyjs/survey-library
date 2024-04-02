import { fixture, test, Selector } from "testcafe";
import { frameworks, url, initSurvey, getSurveyResult, getListItemByText, completeButton } from "../helper";
const title = "matrixdropdown";

const json = {
  questions: [
    {
      type: "matrixdropdown",
      name: "frameworksRate",
      title: "Please tells us your opinion about JavaScript MVVM frameworks",
      choices: ["Excelent", "Good", "Average", "Fair", "Poor"],
      columns: [
        {
          name: "using",
          title: "Do you use it?",
          choices: ["Yes", "No"],
          cellType: "radiogroup"
        },
        {
          name: "experience",
          title: "How long do you use it?",
          cellType: "dropdown",
          choices: [
            { value: 5, text: "3-5 years" },
            { value: 2, text: "1-2 years" },
            {
              value: 1,
              text: "less than a year"
            }
          ]
        },
        {
          name: "strength",
          title: "What is main strength?",
          choices: ["Easy", "Compact", "Fast", "Powerfull"],
          cellType: "checkbox"
        },
        {
          name: "knowledge",
          title: "Please describe your experience",
          cellType: "text"
        },
        { name: "rate", title: "Please rate the framework itself" }
      ],
      rows: [
        { value: "angularv1", text: "angularjs v1.x" },
        { value: "angularv2", text: "angularjs v2" },
        { value: "knockoutjs" },
        { value: "reactjs" }
      ]
    }
  ]
};

frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json);
    }
  );

  test("choose several values", async t => {
    const questionDropdownClassName = ".sv_q_dropdown_control";
    const Angular1Row = Selector(".sv_matrix_row").nth(0);
    const KnockoutRow = Selector(".sv_matrix_row").nth(2);

    // answer for row 1
    await t
      .click(Angular1Row.find(".sv_q_radiogroup_control_item[value=Yes]"))
      .click(Angular1Row.find(questionDropdownClassName).nth(0))
      .click(getListItemByText("2"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })
      .click(Angular1Row.find(".sv_q_checkbox_control_item[value=Fast]"))
      .typeText(Angular1Row.find(".sv_q_text_root"), "why hello world so hard")
      .click(Angular1Row.find(questionDropdownClassName).nth(1))
      .click(getListItemByText("Excelent"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 });
    // answer for row 3
    await t
      .click(KnockoutRow.find(".sv_q_radiogroup_control_item[value=No]"))
      .click(KnockoutRow.find(questionDropdownClassName).nth(0))
      .click(getListItemByText("5"))
      .click(Selector("body"), { offsetX: 1, offsetY: 1 })
      .click(KnockoutRow.find(".sv_q_checkbox_control_item[value=Easy]"))
      .click(KnockoutRow.find(".sv_q_checkbox_control_item[value=Powerfull]"))
      .typeText(KnockoutRow.find(".sv_q_text_root"), "it is not 2016")
      .click(KnockoutRow.find(questionDropdownClassName).nth(1))
      .click(getListItemByText("Good"));

    await t.click(completeButton);

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.frameworksRate.angularv1).eql({
      using: "Yes",
      knowledge: "why hello world so hard",
      rate: "Excelent",
      strength: ["Fast"],
      experience: 2
    });

    await t.expect(surveyResult.frameworksRate.knockoutjs).eql({
      knowledge: "it is not 2016",
      rate: "Good",
      strength: ["Easy", "Powerfull"],
      experience: 5,
      using: "No"
    });
  });
});

const json2 = {
  "focusFirstQuestionAutomatic": true,
  "elements": [{
    "type": "radiogroup",
    "name": "question2",
    "defaultValue": "Item1",
    "choices": [
      "Item1",
      "Item2",
      "Item3"
    ]
  },
  {
    "type": "matrixdropdown",
    "name": "question1",
    "columns": [
      {
        "name": "Column 1",
        "cellType": "text",
        "requiredIf": "{question2} = 'Item1'"
      }
    ],
    "columnLayout": "vertical",
    "rows": [
      "Row 1",
      "Row 2"
    ]
  }]
};
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json2);
    }
  );

  test("Column requiredIf and vertical layout", async t => {
    const requiredSpan = Selector("span").withExactText("*");
    await t.expect(requiredSpan.exists).ok();
    await t.pressKey("down");
    await t.expect(requiredSpan.exists).notOk();
    await t.pressKey("up");
    await t.expect(requiredSpan.exists).ok();
  });
});

const json3 = {
  "elements": [
    {
      "type": "matrixdropdown",
      "name": "question1",
      "columns": [
        {
          "name": "Column 1"
        },
        {
          "name": "Column 2"
        },
        {
          "name": "Column 3"
        },
        {
          "name": "Column 4"
        },
        {
          "name": "Column 5"
        },
        {
          "name": "Column 6"
        },
        {
          "name": "Column 7"
        },
        {
          "name": "Column 8"
        },
        {
          "name": "Column 9"
        },
        {
          "name": "Column 10",
          "isRequired": true
        }
      ],
      "choices": [
        1,
        2,
        3,
        4,
        5
      ],
      "rows": [
        "Row 1",
        "Row 2"
      ]
    }
  ]
};
frameworks.forEach(framework => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async t => {
      await initSurvey(framework, json3);
    }
  );
  test("Make a horizontal scroll to show a column with an error", async t => {
    function filterIsInViewport(node) {
      const rect = node.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }
    const requiredSpan = Selector("span").withExactText("Response required.");
    await t.click("input[value=Complete]")
      .expect(Selector(requiredSpan).filter(filterIsInViewport).exists).ok();
  });
});

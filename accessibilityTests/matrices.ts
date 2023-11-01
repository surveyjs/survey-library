import { frameworks, url, initSurvey, axeTags, axeContext, axeOptions } from "./helper";
import { fixture, test } from "testcafe";
import { axeCheck, createReport } from "axe-testcafe";
const title = "matrices";

frameworks.forEach((framework) => {
  fixture`${framework} a11y:${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
    }
  );

  test("axe check matrix", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "matrix",
          name: "Quality",
          title: "Matrix",
          columns: [
            {
              value: 1,
              text: "Strongly Disagree"
            },
            {
              value: 2,
              text: "Disagree"
            },
            {
              value: 3,
              text: "Neutral"
            },
            {
              value: 4,
              text: "Agree"
            },
            {
              value: 5,
              text: "Strongly Agree"
            }
          ],
          rows: [
            {
              value: "affordable",
              text: "Product is affordable"
            },
            {
              value: "does what it claims",
              text: "Product does what it claims"
            },
            {
              value: "better than others",
              text: "Product is better than other products on the market"
            },
            {
              value: "easy to use",
              text: "Product is easy to use"
            }
          ]
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check matrixdropdown", async (t) => {
    const axeOptionsIgnoreMinor = {
      runOnly: {
        type: "tag",
        values: axeTags
      },
      rules: {
        //https://github.com/dequelabs/axe-core/blob/develop/doc/rule-descriptions.md
        "color-contrast": {
          enabled: false
        },
        "document-title": {
          enabled: false
        },
        "landmark-one-main": {
          enabled: false
        },
        "page-has-heading-one": {
          enabled: false
        },
        "region": {
          enabled: false
        },
        // Skip one minor case for listbox role in checkbox fieldset
        "aria-allowed-role": {
          enabled: false
        },
      }
    };
    await initSurvey(framework, {
      "elements": [
        {
          type: "matrixdropdown",
          name: "frameworksRate",
          title: "Matrix Dropdown",
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
              choices: [
                {
                  value: 5,
                  text: "3-5 years"
                },
                {
                  value: 2,
                  text: "1-2 years"
                },
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
            {
              name: "rate",
              title: "Please rate the framework itself"
            }
          ],
          rows: [
            {
              value: "angularv1",
              text: "angularjs v1.x"
            },
            {
              value: "angularv2",
              text: "angularjs v2"
            },
            {
              value: "knockoutjs"
            },
            {
              value: "reactjs"
            }
          ]
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptionsIgnoreMinor);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
  test("axe check matrixdynamic", async (t) => {
    await initSurvey(framework, {
      "elements": [
        {
          type: "matrixdynamic",
          name: "teachersRate",
          title: "Matrix Dynamic",
          addRowText: "Add Subject",
          horizontalScroll: true,
          columnMinWidth: "130px",
          columnColCount: 1,
          cellType: "radiogroup",
          choices: [
            {
              value: 1,
              text: "Yes"
            },
            {
              value: 0,
              text: "Sometimes"
            },
            {
              value: -1,
              text: "No"
            }
          ],
          columns: [
            {
              name: "subject",
              cellType: "dropdown",
              title: "Select a subject",
              isRequired: true,
              minWidth: "300px",
              choices: [
                "English: American Literature",
                "English: British and World Literature",
                "Math: Consumer Math",
                "Math: Practical Math",
                "Math: Developmental Algebra",
                "Math: Continuing Algebra",
                "Math: Pre-Algebra",
                "Math: Algebra",
                "Math: Geometry",
                "Math: Integrated Mathematics",
                "Science: Physical Science",
                "Science: Earth Science",
                "Science: Biology",
                "Science: Chemistry",
                "History: World History",
                "History: Modern World Studies",
                "History: U.S. History",
                "History: Modern U.S. History",
                "Social Sciences: U.S. Government and Politics",
                "Social Sciences: U.S. and Global Economics",
                "World Languages: Spanish",
                "World Languages: French",
                "World Languages: German",
                "World Languages: Latin",
                "World Languages: Chinese",
                "World Languages: Japanese"
              ]
            },
            {
              name: "explains",
              title: "Clearly explains the objectives"
            },
            {
              name: "interesting",
              title: "Makes class interesting"
            },
            {
              "name": "Column 2",
              "cellType": "boolean"
            },
            {
              name: "effective",
              title: "Uses class time effectively"
            },
            {
              name: "knowledge",
              title: "Knows the subject matter"
            },
            {
              name: "recognition",
              title: "Recognizes and acknowledges effort"
            },
            {
              name: "inform",
              title: "Keeps me informed of my progress"
            },
            {
              name: "opinion",
              title: "Encourages and accepts different opinions"
            },
            {
              name: "respect",
              title: "Has the respect of the student"
            },
            {
              name: "cooperation",
              title: "Encourages cooperation and participation"
            },
            {
              name: "parents",
              title: "Communicates with my parents"
            },
            {
              name: "selfthinking",
              title: "Encourages me to think for myself"
            },
            {
              name: "frusturation",
              cellType: "comment",
              title: "Is there anything about this class that frustrates you?",
              minWidth: "250px"
            },
            {
              name: "likeTheBest",
              cellType: "comment",
              title: "What do you like best about this class and/or teacher?",
              minWidth: "250px"
            },
            {
              name: "improvements",
              cellType: "comment",
              title:
                "What do you wish this teacher would do differently that would improve this class?",
              minWidth: "250px"
            }
          ],
          rowCount: 2
        },
      ]
    });
    const { error, violations } = await axeCheck(t, axeContext, axeOptions);
    await t.expect(violations.length === 0).ok(createReport(violations));
  });
});
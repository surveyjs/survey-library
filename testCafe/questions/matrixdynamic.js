import { frameworks, url, initSurvey, getSurveyResult } from "../helper";
import { Selector, ClientFunction, fixture, test } from "testcafe";
// eslint-disable-next-line no-undef
const assert = require("assert");
const title = "matrixdynamic";

const json = {
  questions: [
    {
      type: "matrixdynamic",
      name: "teachersRate",
      title: "Please rate your teachers",
      addRowText: "Add Subject",
      addRowLocation: "top",
      horizontalScroll: true,
      columnMinWidth: "120px",
      columnColCount: 1,
      cellType: "radiogroup",
      choices: [
        { value: 1, text: "Yes" },
        { value: 0, text: "Sometimes" },
        { value: -1, text: "No" },
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
            "World Languages: Japanese",
          ],
        },
        { name: "explains", title: "Clearly explains the objectives" },
        { name: "interesting", title: "Makes class interesting" },
        { name: "effective", title: "Uses class time effectively" },
        { name: "knowledge", title: "Knows the subject matter" },
        { name: "recognition", title: "Recognizes and acknowledges effort" },
        { name: "inform", title: "Keeps me informed of my progress" },
        { name: "opinion", title: "Encourages and accepts different opinions" },
        { name: "respect", title: "Has the respect of the student" },
        {
          name: "cooperation",
          title: "Encourages cooperation and participation",
        },
        { name: "parents", title: "Communicates with my parents" },
        { name: "selfthinking", title: "Encourages me to think for myself" },
        {
          name: "frusturation",
          cellType: "comment",
          title: "Is there anything about this class that frustrates you?",
          minWidth: "250px",
        },
        {
          name: "likeTheBest",
          cellType: "comment",
          title: "What do you like best about this class and/or teacher?",
          minWidth: "250px",
        },
        {
          name: "improvements",
          cellType: "comment",
          title:
            "What do you wish this teacher would do differently that would improve this class?",
          minWidth: "250px",
        },
        {
          name: "bool",
          cellType: "boolean",
        },
      ],
      rowCount: 2,
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json);
    }
  );

  test("choose empty", async (t) => {
    const matrixRow = Selector(".sv_matrix_row");
    const getRequiredElement = (rowIndex) => {
      return matrixRow.nth(rowIndex).find(".sv-string-viewer").withText("Response required.");
    };

    await t
      .expect(getRequiredElement(0).exists).notOk()
      .expect(getRequiredElement(1).exists).notOk()

      .click("input[value=Complete]")
      .expect(getRequiredElement(0).visible).ok()
      .expect(getRequiredElement(1).visible).ok();

    let surveyResult = await getSurveyResult();
    await t.expect(typeof surveyResult).eql("undefined");

    await t
      .click(matrixRow.nth(0).find("select"))
      .click(matrixRow.nth(0).find("select option[value=\"Science: Physical Science\"]"))

      .click("input[value=Complete]")
      .expect(getRequiredElement(0).exists).notOk()
      .expect(getRequiredElement(1).visible).ok();

    surveyResult = await getSurveyResult();
    await t.expect(typeof surveyResult).eql("undefined");
  });

  test("choose several values", async (t) => {
    const matrixCellSelector = function (strings, ...values) {
      return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
    };
    const fillTheRow = async function (rowNumber) {
      await t
        .click(`${matrixCellSelector`${rowNumber}${1}`} select`)
        .click(`${matrixCellSelector`${rowNumber}${1}`} select option[value="Science: Physical Science"]`);

      for (let i = 2; i < 13; i++) {
        // answer radios
        await t.click(`${matrixCellSelector`${rowNumber}${i}`} label input`);
      }

      await t // answer comments
        .typeText(`${matrixCellSelector`${rowNumber}${13}`} textarea`, "Wombats")
        .typeText(`${matrixCellSelector`${rowNumber}${14}`} textarea`, "Wombats")
        .typeText(`${matrixCellSelector`${rowNumber}${15}`} textarea`, "Wombats");
    };

    await fillTheRow(1);
    await fillTheRow(2);

    await t.click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult).eql({
      teachersRate: [
        {
          frusturation: "Wombats",
          likeTheBest: "Wombats",
          improvements: "Wombats",
          explains: 1,
          interesting: 1,
          effective: 1,
          knowledge: 1,
          recognition: 1,
          inform: 1,
          opinion: 1,
          respect: 1,
          cooperation: 1,
          parents: 1,
          selfthinking: 1,
          subject: "Science: Physical Science",
        },
        {
          frusturation: "Wombats",
          likeTheBest: "Wombats",
          improvements: "Wombats",
          explains: 1,
          interesting: 1,
          effective: 1,
          knowledge: 1,
          recognition: 1,
          inform: 1,
          opinion: 1,
          respect: 1,
          cooperation: 1,
          parents: 1,
          selfthinking: 1,
          subject: "Science: Physical Science",
        }
      ]
    });
  });

  test("remove row", async (t) => {
    const getRowCount = ClientFunction(
      () => document.querySelectorAll("tbody > tr").length
    );
    const oldCount = await getRowCount();
    const matrixCellSelector = function (strings, ...values) {
      return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
    };

    await t
      .click(`${matrixCellSelector`${1}${1}`} select`)
      .click(
        `${matrixCellSelector`${1}${1}`} select option[value="Science: Physical Science"]`
      )
      .click(`${matrixCellSelector`${2}${1}`} select`)
      .click(
        `${matrixCellSelector`${2}${1}`} select option[value="Science: Chemistry"]`
      )
      .click(
        Selector(`${matrixCellSelector`${2}${17}`} button[type=button]`).withText(
          "Remove"
        )
      );

    const newCount = await getRowCount();
    assert(newCount === oldCount - 1);

    await t.click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    assert.equal(surveyResult.teachersRate.length, 1);
  });

  test("add row", async (t) => {
    const getRowCount = ClientFunction(
      () => document.querySelectorAll("tbody > tr").length
    );
    const oldCount = await getRowCount();
    const matrixCellSelector = function (strings, ...values) {
      return `tbody > tr:nth-child(${values[0]}) > td:nth-child(${values[1]})`;
    };

    await t
      .click(Selector("button[type=button]").withText("Add Subject"))
      .click(`${matrixCellSelector`${1}${1}`} select`)
      .click(
        `${matrixCellSelector`${1}${1}`} select option[value="Science: Physical Science"]`
      )
      .click(`${matrixCellSelector`${2}${1}`} select`)
      .click(
        `${matrixCellSelector`${2}${1}`} select option[value="Science: Chemistry"]`
      )
      .click(`${matrixCellSelector`${3}${1}`} select`)
      .click(
        `${matrixCellSelector`${3}${1}`} select option[value="Math: Algebra"]`
      );

    const newCount = await getRowCount();
    assert(newCount === oldCount + 1);

    await t.click("input[value=Complete]");

    const surveyResult = await getSurveyResult();
    assert.equal(surveyResult.teachersRate.length, 3);
  });
});

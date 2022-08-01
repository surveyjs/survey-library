import { frameworks, url, initSurvey, getSurveyResult, getListItemByText, completeButton } from "../helper";
import { Selector, fixture, test } from "testcafe";
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

  const questionDropdownSelect = Selector(".sv_q_dropdown_control");

  test("choose empty", async (t) => {
    const matrixRow = Selector(".sv_matrix_row");
    const getRequiredElement = (rowIndex) => {
      return matrixRow.nth(rowIndex).find(".sv-string-viewer").withText("Response required.");
    };

    await t
      .expect(getRequiredElement(0).exists).notOk()
      .expect(getRequiredElement(1).exists).notOk()

      .click(completeButton)
      .expect(getRequiredElement(0).visible).ok()
      .expect(getRequiredElement(1).visible).ok();

    let surveyResult = await getSurveyResult();
    await t.expect(typeof surveyResult).eql("undefined");

    await t
      .click(questionDropdownSelect.nth(0))
      .click(getListItemByText("Science: Physical Science"))

      .click(completeButton)
      .expect(getRequiredElement(0).exists).notOk()
      .expect(getRequiredElement(1).visible).ok();

    surveyResult = await getSurveyResult();
    await t.expect(typeof surveyResult).eql("undefined");
  });

  test("choose several values", async (t) => {
    const fillTheRow = async function (rowNumber) {
      await t
        .click(questionDropdownSelect.nth(rowNumber))
        .click(getListItemByText("Science: Physical Science"));

      for (let i = 0; i < 11; i++) {
        // answer radios
        await t.click(Selector(".sv_matrix_row").nth(rowNumber).find(".sv_matrix_cell .sv_q_radiogroup_control_item[value='1']").nth(i));
      }

      await t // answer comments
        .typeText(Selector(".sv_matrix_row").nth(rowNumber).find("textarea").nth(0), "Wombats")
        .typeText(Selector(".sv_matrix_row").nth(rowNumber).find("textarea").nth(1), "Wombats")
        .typeText(Selector(".sv_matrix_row").nth(rowNumber).find("textarea").nth(2), "Wombats");
    };

    await fillTheRow(0);
    await fillTheRow(1);

    await t.click(completeButton);

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
    await t
      .expect(Selector(".sv_matrix_row").count).eql(2)

      .click(questionDropdownSelect.nth(0))
      .click(getListItemByText("Science: Physical Science"))

      .click(questionDropdownSelect.nth(1))
      .click(getListItemByText("Science: Chemistry"))

      .click(Selector(".sv_matrix_dynamic_button .sv-string-viewer").nth(1).withText("Remove"))
      .expect(Selector(".sv_matrix_row").count).eql(1);

    await t.click(completeButton);

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.teachersRate.length).eql(1);
  });

  test("add row", async (t) => {
    await t.resizeWindow(1920, 1080);
    await t
      .expect(Selector(".sv_matrix_row").count).eql(2)
      .click(Selector("button[type=button]").withText("Add Subject"))
      .expect(Selector(".sv_matrix_row").count).eql(3)

      .click(questionDropdownSelect.nth(0))
      .click(getListItemByText("Science: Physical Science"))

      .click(questionDropdownSelect.nth(1))
      .click(getListItemByText("Science: Chemistry"))

      .click(questionDropdownSelect.nth(2))
      .click(getListItemByText("Math: Algebra"))

      .click(completeButton);

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.teachersRate.length).eql(3);
  });
});

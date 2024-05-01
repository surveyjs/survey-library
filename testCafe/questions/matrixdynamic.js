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
    const getRowsCount = () => {
      return matrixRow.count;
    };

    await t
      .expect(getRowsCount()).eql(2)
      .click(completeButton)
      .expect(getRowsCount()).eql(4)
      .expect(getRequiredElement(0).visible).ok()
      .expect(getRequiredElement(2).visible).ok();

    let surveyResult = await getSurveyResult();
    await t.expect(typeof surveyResult).eql("undefined");
    await t
      .click(questionDropdownSelect.nth(0))
      .click(getListItemByText("Science: Physical Science"))
      .click(completeButton)
      .expect(getRowsCount()).eql(3)
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

const json2 = {
  elements: [
    {
      type: "dropdown",
      name: "q1",
      choicesMin: 1,
      choicesMax: 10,
    },
    {
      type: "matrixdynamic",
      name: "q2",
      bindings: {
        rowCount: "q1",
      },
      columns: [
        {
          name: "name",
        },
      ],
      cellType: "text",
      allowAddRows: false,
      allowRemoveRows: false,
      rowCount: 0,
    },
  ],
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json2);
    }
  );
  test("bindings rowCount", async (t) => {
    const questionDropdownSelect = Selector(".sv_q_dropdown_control");
    const clearButton = Selector(".sv_q_dropdown_clean-button");

    await t.resizeWindow(1920, 1080);
    await t
      .expect(Selector(".sv_matrix_row").count).eql(0)
      .click(questionDropdownSelect)
      .click(Selector(".sv-list__item span").withText("3").filterVisible())
      .expect(Selector(".sv_matrix_row").count).eql(3)
      .click(clearButton)
      .expect(Selector(".sv_matrix_row").count).eql(0)
      .click(questionDropdownSelect)
      .click(Selector(".sv-list__item span").withText("5").filterVisible())
      .expect(Selector(".sv_matrix_row").count).eql(5);
  });
});
const json3 = {
  "elements": [
    {
      "type": "matrixdynamic",
      "name": "matrix",
      "allowRowsDragAndDrop": true,
      "columnLayout": "vertical",
      "columns": [
        { cellType: "text", name: "col1" },
        { cellType: "text", name: "col2" },
      ],
      "rowCount": 2,
      defaultValue: [{ col1: 1 }, { col1: 2 }]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json3);
    }
  );
  test("bindings rowCount", async (t) => {
    const removeButton = Selector(".sv_matrix_dynamic_button .sv-string-viewer").nth(1).withText("Remove");
    await t.resizeWindow(1920, 1080);
    await t
      .click(removeButton)
      .click(completeButton);
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.matrix.length).eql(1);
  });
});
const json4 = {
  "textUpdateMode": "onTyping",
  "focusFirstQuestionAutomatic": true,
  "elements": [
    {
      "type": "matrixdynamic",
      "name": "matrix",
      "rowCount": 1,
      "columns": [
        {
          "name": "col1",
          "cellType": "text"
        },
        {
          "name": "col2",
          "cellType": "text"
        },
        {
          "name": "col3",
          "cellType": "text",
          "visibleIf": "false"
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json4);
    }
  );
  test("column.visibleIf returns always false and rebuilding table", async (t) => {
    await t.resizeWindow(1920, 1080);
    await t.pressKey("a b c")
      .pressKey("tab")
      .pressKey("e d f")
      .click(completeButton);
    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.matrix).eql([{ col1: "abc", col2: "edf" }]);
  });
});

const json5 = {
  "locale": "de",
  "elements": [
    {
      "type": "matrixdynamic",
      "name": "matrix",
      "defaultValue": [{ col1: 1 }, { col1: 2 }, { col1: 3 }],
      "confirmDelete": true,
      "columns": [
        {
          "name": "col1",
          "cellType": "text"
        }
      ]
    }
  ]
};

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, json5);
    }
  );
  test("remove row vs confirmDelete and differerent locale", async (t) => {
    await t
      .expect(Selector(".sv_matrix_row").count).eql(3)
      .click(Selector(".sv_matrix_dynamic_button .sv-string-viewer").nth(1).withText("Entfernen"))
      .click(Selector("span").withExactText("Abbrechen"))
      .expect(Selector(".sv_matrix_row").count).eql(3)
      .click(Selector(".sv_matrix_dynamic_button .sv-string-viewer").nth(1).withText("Entfernen"))
      .click(Selector("span").withExactText("OK"))
      .expect(Selector(".sv_matrix_row").count).eql(2);
  });
});


import { frameworks, url, initSurvey, getSurveyResult, getListItemByText, completeButton } from "../helper";
import { ClientFunction, Selector, fixture, test } from "testcafe";
const title = "matrixdynamic";

const matrixRowSelector = Selector(".sd-table__row");
const matrixButton = Selector(".sd-matrixdynamic__btn");
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
      await t.resizeWindow(1920, 1080);
      await initSurvey(framework, json);
    }
  );

  const questionDropdownSelect = Selector(".sd-dropdown");

  test("choose empty", async (t) => {
    const getRequiredElement = (rowIndex) => {
      return matrixRowSelector.nth(rowIndex).find(".sv-string-viewer").withText("Response required.");
    };
    const getRowsCount = () => {
      return matrixRowSelector.count;
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
        await t.click(matrixRowSelector.nth(rowNumber).find(".sd-table__cell .sd-radio__control[value='1']").nth(i));
      }

      await t // answer comments
        .typeText(matrixRowSelector.nth(rowNumber).find("textarea").nth(0), "Wombats")
        .typeText(matrixRowSelector.nth(rowNumber).find("textarea").nth(1), "Wombats")
        .typeText(matrixRowSelector.nth(rowNumber).find("textarea").nth(2), "Wombats");
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
      .expect(matrixRowSelector.count).eql(2)
      .click(questionDropdownSelect.nth(0))
      .wait(500)
      .click(getListItemByText("Science: Physical Science"))

      .click(questionDropdownSelect.nth(1))
      .wait(500)
      .click(getListItemByText("Science: Chemistry"))
      .click(matrixButton.nth(1).withAttribute("title", "Remove"))
      .wait(500)
      .expect(matrixRowSelector.count).eql(1);

    await t.click(completeButton);

    const surveyResult = await getSurveyResult();
    await t.expect(surveyResult.teachersRate.length).eql(1);
  });

  test("add row", async (t) => {
    await t.resizeWindow(1920, 1080);
    await t
      .expect(matrixRowSelector.count).eql(2)
      .click(Selector("button[type=button]").withText("Add Subject"))
      .expect(matrixRowSelector.count).eql(3)

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
    const questionDropdownSelect = Selector(".sd-dropdown");
    const clearButton = Selector(".sd-dropdown_clean-button");
    await t.resizeWindow(1920, 1080);
    await t
      .expect(matrixRowSelector.count).eql(0)
      .click(questionDropdownSelect)
      .click(Selector(".sv-list__item span").withText("3").filterVisible())
      .expect(matrixRowSelector.count).eql(3)
      .click(clearButton)
      .expect(matrixRowSelector.count).eql(0)
      .click(questionDropdownSelect)
      .click(Selector(".sv-list__item span").withText("5").filterVisible())
      .expect(matrixRowSelector.count).eql(5);
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
    const removeButton = matrixButton.nth(1).withAttribute("title", "Remove");
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
      .expect(matrixRowSelector.count).eql(3)
      .click(matrixButton.nth(1).withAttribute("title", "Entfernen"))
      .click(Selector("span").withExactText("Abbrechen"))
      .expect(matrixRowSelector.count).eql(3)
      .wait(100)
      .click(matrixButton.nth(1).withAttribute("title", "Entfernen"))
      .click(Selector("span").withExactText("OK"))
      .expect(matrixRowSelector.count).eql(2);
  });
});

frameworks.forEach((framework) => {
  fixture`${framework} ${title}`.page`${url}${framework}`.beforeEach(
    async (t) => {
      await initSurvey(framework, {
        "elements": [
          {
            "type": "matrixdynamic",
            "name": "matrix",
            "rowCount": 3,
            "allowRemoveRows": false,
            "columns": [
              {
                "name": "col1",
                "cellType": "text"
              },
              {
                "name": "col2",
                "cellType": "text",
                "visibleIf": "{row.col1} = 1"
              }
            ]
          }
        ]
      });
    }
  );
  test("visibleIf columns", async (t) => {
    const textSelector = Selector("input").withAttribute("type", "text").filterVisible();
    await t
      .expect(textSelector.count).eql(3)
      .typeText(textSelector.nth(0), "1")
      .pressKey("Tab")
      .expect(textSelector.count).eql(4)
      .typeText(textSelector.nth(2), "1")
      .pressKey("Tab")
      .expect(textSelector.count).eql(5)
      .typeText(textSelector.nth(4), "1")
      .pressKey("Tab")
      .expect(textSelector.count).eql(6);
  });

  test("visibleIf columns mobile", async (t) => {
    const textSelector = Selector("input").withAttribute("type", "text").filterVisible();
    await ClientFunction(() => window.survey.setIsMobile(true))();
    await t.resizeWindow(600, 1080);
    await t
      .expect(Selector("tbody tr").nth(0).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(1).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(2).find("td").count).eql(2)
      .typeText(textSelector.nth(0), "1", { paste: true })
      .pressKey("Tab")
      .expect(Selector("tbody tr").nth(0).find("td").count).eql(4)
      .expect(Selector("tbody tr").nth(1).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(2).find("td").count).eql(2)
      .typeText(textSelector.nth(0), "0", { paste: true })
      .pressKey("Tab")
      .expect(Selector("tbody tr").nth(0).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(1).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(2).find("td").count).eql(2)
      .typeText(textSelector.nth(1), "1", { paste: true })
      .pressKey("Tab")
      .expect(Selector("tbody tr").nth(0).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(1).find("td").count).eql(4)
      .expect(Selector("tbody tr").nth(2).find("td").count).eql(2)
      .typeText(textSelector.nth(1), "0", { paste: true })
      .pressKey("Tab")
      .expect(Selector("tbody tr").nth(0).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(1).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(2).find("td").count).eql(2)
      .typeText(textSelector.nth(2), "1", { paste: true })
      .pressKey("Tab")
      .expect(Selector("tbody tr").nth(0).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(1).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(2).find("td").count).eql(4)
      .typeText(textSelector.nth(2), "0", { paste: true })
      .pressKey("Tab")
      .expect(Selector("tbody tr").nth(0).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(1).find("td").count).eql(2)
      .expect(Selector("tbody tr").nth(2).find("td").count).eql(2);
  });
});

frameworks.forEach((framework) => {
  if(framework == "vue") return;
  fixture`${framework} ${title}`.page`${url}${framework}`;

  test("Focus remove or add button removing", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 3,
          columns: [
            {
              cellType: "text",
              name: "name",
              defaultValue: "abc"
            },
          ],
        }
      ]
    });

    await t.pressKey("tab tab tab")
      .pressKey("space")
      .wait(200)
      .pressKey("space")
      .wait(200)
      .pressKey("space")
      .wait(200)
      .pressKey("space")
      .pressKey("1 2 3")
      .click(completeButton);

    await t.expect(await getSurveyResult()).eql({ matrix: [{ name: "abc123" }] });
  });
  test("Focus remove or add button removing for horizontal columns layout", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      focusFirstQuestionAutomatic: true,
      elements: [
        {
          type: "matrixdynamic",
          transposeData: true,
          name: "matrix",
          rowCount: 3,
          columns: [
            {
              cellType: "text",
              name: "name",
              defaultValue: "abc"
            },
          ],
        }
      ]
    });

    await t.pressKey("tab tab tab")
      .pressKey("space")
      .wait(200)
      .pressKey("space")
      .wait(200)
      .pressKey("space")
      .wait(200)
      .pressKey("space")
      .pressKey("1 2 3")
      .click(completeButton);

    await t.expect(await getSurveyResult()).eql({ matrix: [{ name: "abc123" }] });
  });
  test("Editing cell loses focus when a dependent column appears, Bug#9233", async (t) => {
    await t.resizeWindow(1920, 1080);
    await initSurvey(framework, {
      textUpdateMode: "onTyping",
      elements: [
        {
          type: "matrixdynamic",
          name: "matrix",
          rowCount: 1,
          columns: [
            {
              name: "col1",
              visibleIf: "{row.col2} notempty",
              cellType: "text"
            },
            {
              name: "col2",
              cellType: "text"
            },
            {
              name: "col3",
              visibleIf: "{row.col2} notempty",
              cellType: "text"
            }
          ]
        }
      ]
    });

    const inputs = Selector("input[type=text");
    await t.expect(inputs.count).eql(1)
      .click(inputs.nth(0))
      .pressKey("a")
      .expect(inputs.count).eql(3)
      .pressKey("b c")
      .click(completeButton);

    await t.expect(await getSurveyResult()).eql({ matrix: [{ col2: "abc" }] });
  });
  test("show/hide details mobile", async (t) => {
    await initSurvey(framework, {
      "title": "TEST",
      "description": "TEST",
      "logoPosition": "right",
      "pages": [
        {
          "name": "page1",
          "elements": [
            {
              "type": "matrixdynamic",
              "name": "matrix",
              "titleLocation": "hidden",
              "verticalAlign": "top",
              "columns": [
                {
                  "name": "header",
                  "cellType": "text",
                },
              ],
              "detailElements": [
                {
                  "name": "detail",
                  "type": "text",
                },
              ],
              "detailPanelMode": "underRowSingle",
              "cellType": "text",
              "rowCount": 1,
              "addRowLocation": "top",
              "hideColumnsIfEmpty": true,
              "detailPanelShowOnAdding": true
            }
          ]
        }
      ],
      "showNavigationButtons": "none",
      "showQuestionNumbers": "off"
    });
    await t.resizeWindow(600, 1080);
    await t.click(Selector("button").withText("Add Row"));
    await t.expect(Selector("#show-detail-mobile").filterVisible().nth(0).innerText).contains("Show Details");
    await t.expect(Selector("#show-detail-mobile").filterVisible().nth(1).innerText).contains("Hide Details");

    await t.click(Selector("#show-detail-mobile button").filterVisible().nth(0));
    await t.expect(Selector("#show-detail-mobile").filterVisible().nth(0).innerText).contains("Hide Details");
    await t.expect(Selector("#show-detail-mobile").filterVisible().nth(1).innerText).contains("Show Details");
  });
});
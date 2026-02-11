import { frameworks, url, initSurvey, getSurveyResult, getVisibleListItemByText, test, expect, setData, getData, doDragDrop } from "../helper";

const title = "matrixdynamic";

const json = {
  elements: [
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
        { name: "cooperation", title: "Encourages cooperation and participation" },
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
          title: "What do you wish this teacher would do differently that would improve this class?",
          minWidth: "250px",
        },
        { name: "bool", cellType: "boolean" },
      ],
      rowCount: 2,
    },
  ],
};

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, json);
    });

    test("choose empty", async ({ page }) => {
      const matrixRowSelector = page.locator(".sd-table__row");
      const questionDropdownSelect = page.locator(".sd-dropdown");

      const getRequiredElement = (rowIndex) => {
        return matrixRowSelector.nth(rowIndex).locator(".sv-string-viewer").filter({ hasText: "Response required." });
      };
      const getRowsCount = async () => {
        return await matrixRowSelector.count();
      };

      expect(await getRowsCount()).toBe(2);
      await page.locator("input[value=Complete]").click();
      expect(await getRowsCount()).toBe(4);
      await expect(getRequiredElement(0)).toBeVisible();
      await expect(getRequiredElement(2)).toBeVisible();

      let surveyResult = await getSurveyResult(page);
      expect(typeof surveyResult).toBe("undefined");
      await questionDropdownSelect.nth(0).click();
      await getVisibleListItemByText(page, "Science: Physical Science").click();
      await page.locator("input[value=Complete]").click();
      expect(await getRowsCount()).toBe(3);
      await expect(getRequiredElement(1)).toBeVisible();

      surveyResult = await getSurveyResult(page);
      expect(typeof surveyResult).toBe("undefined");
    });

    test("choose several values", async ({ page }) => {
      const matrixRowSelector = page.locator(".sd-table__row");
      const questionDropdownSelect = page.locator(".sd-dropdown");

      const fillTheRow = async function (rowNumber: number) {
        await questionDropdownSelect.nth(rowNumber).click();
        await getVisibleListItemByText(page, "Science: Physical Science").click();

        for (let i = 0; i < 11; i++) {
          // answer radios
          await matrixRowSelector.nth(rowNumber).locator("label").filter({ hasText: "Yes" }).nth(i).click();
        }

        // answer comments
        await matrixRowSelector.nth(rowNumber).locator("textarea").nth(0).fill("Wombats");
        await matrixRowSelector.nth(rowNumber).locator("textarea").nth(1).fill("Wombats");
        await matrixRowSelector.nth(rowNumber).locator("textarea").nth(2).fill("Wombats");
      };

      await fillTheRow(0);
      await fillTheRow(1);

      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({
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

    test("remove row", async ({ page }) => {
      const matrixRowSelector = page.locator(".sd-table__row");
      const matrixButton = page.locator(".sd-matrixdynamic__btn");
      const questionDropdownSelect = page.locator(".sd-dropdown");

      expect(await matrixRowSelector.count()).toBe(2);
      await questionDropdownSelect.nth(0).click();
      await page.waitForTimeout(500);
      await getVisibleListItemByText(page, "Science: Physical Science").click();

      await questionDropdownSelect.nth(1).click();
      await page.waitForTimeout(500);
      await getVisibleListItemByText(page, "Science: Chemistry").click();
      await page.locator(".sd-matrixdynamic__btn[title='Remove']").nth(1).click();
      await page.waitForTimeout(500);
      expect(await matrixRowSelector.count()).toBe(1);

      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.teachersRate.length).toBe(1);
    });

    test("add row", async ({ page }) => {
      const matrixRowSelector = page.locator(".sd-table__row");
      const questionDropdownSelect = page.locator(".sd-dropdown");

      expect(await matrixRowSelector.count()).toBe(2);
      await page.locator("button[type=button]").filter({ hasText: "Add Subject" }).click();
      expect(await matrixRowSelector.count()).toBe(3);

      await questionDropdownSelect.nth(0).click();
      await getVisibleListItemByText(page, "Science: Physical Science").click();

      await questionDropdownSelect.nth(1).click();
      await getVisibleListItemByText(page, "Science: Chemistry").click();

      await questionDropdownSelect.nth(2).click();
      await getVisibleListItemByText(page, "Math: Algebra").click();

      await page.locator("input[value=Complete]").click();

      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.teachersRate.length).toBe(3);
    });
  });
});

frameworks.forEach((framework) => {
  if (framework == "vue") return;

  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("Focus remove or add button removing", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
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
      await expect(page.locator(".sd-formbox__input").first()).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await expect(page.getByRole("textbox", { name: "row 1, column name" })).toBeFocused();
      await page.keyboard.press("1");
      await page.keyboard.press("2");
      await page.keyboard.press("3");
      await page.locator("input[value=Complete]").click();

      expect(await getSurveyResult(page)).toEqual({ matrix: [{ name: "abc123" }] });
    });

    test("Focus remove or add button removing - no header", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
        elements: [
          {
            type: "matrixdynamic",
            name: "matrix",
            "showHeader": false,
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
      await expect(page.locator(".sd-formbox__input").first()).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await expect(page.getByRole("textbox", { name: "row 1, column name" })).toBeFocused();
      await page.keyboard.press("1");
      await page.keyboard.press("2");
      await page.keyboard.press("3");
      await page.locator("input[value=Complete]").click();

      expect(await getSurveyResult(page)).toEqual({ matrix: [{ name: "abc123" }] });
    });

    test("Focus remove or add button removing for horizontal columns layout", async ({ page }) => {
      await initSurvey(page, framework, {
        autoFocusFirstQuestion: true,
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
      await expect(page.locator(".sd-formbox__input").first()).toBeFocused();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await page.waitForTimeout(200);
      await page.keyboard.press("Space");
      await expect(page.getByRole("textbox", { name: "row 1, column name" })).toBeFocused();
      await page.keyboard.press("1");
      await page.keyboard.press("2");
      await page.keyboard.press("3");
      await page.locator("input[value=Complete]").click();

      expect(await getSurveyResult(page)).toEqual({ matrix: [{ name: "abc123" }] });
    });

    test("Editing cell loses focus when a dependent column appears, Bug#9233", async ({ page }) => {
      await initSurvey(page, framework, {
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

      const inputs = page.locator("input[type='text']");
      expect(await inputs.count()).toBe(1);
      await inputs.nth(0).click();
      await page.keyboard.press("a");
      expect(await inputs.count()).toBe(3);
      await page.keyboard.press("b");
      await page.keyboard.press("c");
      await page.locator("input[value=Complete]").click();

      expect(await getSurveyResult(page)).toEqual({ matrix: [{ col2: "abc" }] });
    });

    test("show/hide details mobile", async ({ page }) => {
      await initSurvey(page, framework, {
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
                "columns": [{ "name": "header", "cellType": "text" }],
                "detailElements": [{ "name": "detail", "type": "text" }],
                "detailPanelMode": "underRowSingle",
                "cellType": "text",
                "rowCount": 1,
                "addRowButtonLocation": "top",
                "hideColumnsIfEmpty": true,
                "detailPanelShowOnAdding": true
              }
            ]
          }
        ],
        "showNavigationButtons": false,
        "showQuestionNumbers": "off"
      });
      await page.setViewportSize({ width: 600, height: 1080 });
      await page.waitForTimeout(500);
      await page.locator("button").filter({ hasText: "Add Row" }).click();
      await expect(page.locator("button[title='Show Details']").filter({ visible: true }).first()).toContainText("Show Details");
      await expect(page.locator("button[title='Hide Details']").filter({ visible: true }).first()).toContainText("Hide Details");

      await page.locator("button[title='Show Details']").filter({ visible: true }).first().click();
      await expect(page.locator("button[title='Hide Details']").filter({ visible: true }).first()).toContainText("Hide Details");
      await expect(page.locator("button[title='Show Details']").filter({ visible: true }).first()).toContainText("Show Details");
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });

    test("bindings rowCount", async ({ page }) => {
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
      await initSurvey(page, framework, json2);

      const matrixRowSelector = page.locator(".sd-table__row");
      const questionDropdownSelect = page.locator(".sd-dropdown");
      const clearButton = page.locator(".sd-editor-clean-button");

      expect(await matrixRowSelector.count()).toBe(0);
      await questionDropdownSelect.click();
      await page.locator(".sv-list__item span").filter({ hasText: "3" }).filter({ visible: true }).click();
      expect(await matrixRowSelector.count()).toBe(3);
      await clearButton.click();
      expect(await matrixRowSelector.count()).toBe(0);
      await questionDropdownSelect.click();
      await page.locator(".sv-list__item span").filter({ hasText: "5" }).filter({ visible: true }).click();
      expect(await matrixRowSelector.count()).toBe(5);
    });

    test("remove row with transposeData", async ({ page }) => {
      const json3 = {
        "elements": [
          {
            "type": "matrixdynamic",
            "name": "matrix",
            "allowRowsDragAndDrop": true,
            "transposeData": true,
            "columns": [
              { cellType: "text", name: "col1" },
              { cellType: "text", name: "col2" },
            ],
            "rowCount": 2,
            defaultValue: [{ col1: 1 }, { col1: 2 }]
          }
        ]
      };
      await initSurvey(page, framework, json3);

      const removeButton = page.locator(".sd-matrixdynamic__btn[title='Remove']").nth(1);
      await removeButton.click();
      await page.locator("input[value=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.matrix.length).toBe(1);
    });

    test("column.visibleIf returns always false and rebuilding table", async ({ page }) => {
      const json4 = {
        "textUpdateMode": "onTyping",
        "autoFocusFirstQuestion": true,
        "elements": [
          {
            "type": "matrixdynamic",
            "name": "matrix",
            "rowCount": 1,
            "columns": [
              { "name": "col1", "cellType": "text" },
              { "name": "col2", "cellType": "text" },
              { "name": "col3", "cellType": "text", "visibleIf": "false" }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json4);
      await expect(page.locator(".sd-formbox__input").first()).toBeFocused();

      await page.keyboard.press("a");
      await page.keyboard.press("b");
      await page.keyboard.press("c");
      await page.keyboard.press("Tab");
      await page.keyboard.press("e");
      await page.keyboard.press("d");
      await page.keyboard.press("f");
      await page.locator("input[value=Complete]").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult.matrix).toEqual([{ col1: "abc", col2: "edf" }]);
    });

    test("remove row vs confirmDelete and differerent locale", async ({ page }) => {
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
      await initSurvey(page, framework, json5);

      const matrixRowSelector = page.locator(".sd-table__row");
      const matrixButton = page.locator(".sd-matrixdynamic__btn");
      expect(await matrixRowSelector.count()).toBe(3);
      await page.locator(".sd-matrixdynamic__btn[title='Entfernen']").nth(1).click();
      await page.locator("span").filter({ hasText: /^Abbrechen$/ }).click();
      expect(await matrixRowSelector.count()).toBe(3);
      await page.waitForTimeout(100);
      await page.locator(".sd-matrixdynamic__btn[title='Entfernen']").nth(1).click();
      await page.locator("span").filter({ hasText: /^OK$/ }).click();
      expect(await matrixRowSelector.count()).toBe(2);
    });

    test("visibleIf columns", async ({ page }) => {
      await initSurvey(page, framework, {
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

      const textSelector = page.locator("input[type='text']").filter({ visible: true });
      expect(await textSelector.count()).toBe(3);
      await textSelector.nth(0).fill("1");
      await page.keyboard.press("Tab");
      expect(await textSelector.count()).toBe(4);
      await textSelector.nth(2).fill("1");
      await page.keyboard.press("Tab");
      expect(await textSelector.count()).toBe(5);
      await textSelector.nth(4).fill("1");
      await page.keyboard.press("Tab");
      expect(await textSelector.count()).toBe(6);
    });

    test("visibleIf columns mobile", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 1080 });
      await initSurvey(page, framework, {
        "elements": [
          {
            "type": "matrixdynamic",
            "name": "matrix",
            "rowCount": 3,
            "allowRemoveRows": false,
            "columns": [
              { "name": "col1", "cellType": "text" },
              { "name": "col2", "cellType": "text", "visibleIf": "{row.col1} = 1" }
            ]
          }
        ]
      });
      await page.evaluate(() => (window as any).survey.setIsMobile(true));
      await page.waitForTimeout(500);

      const textSelector = page.locator("input[type='text']").filter({ visible: true });
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(2);
      await textSelector.nth(0).fill("1");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(4);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(2);
      await textSelector.nth(0).fill("0");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(2);
      await textSelector.nth(1).fill("1");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(4);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(2);
      await textSelector.nth(1).fill("0");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(2);
      await textSelector.nth(2).fill("1");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(4);
      await textSelector.nth(2).fill("0");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(2);
    });

    test("Clear value from UI & defaultValueExpression in cells, Bug#10436", async ({ page }) => {
      const json = {
        elements: [
          { type: "matrixdynamic", name: "matrix", rowCount: 3,
            columns: [
              { name: "col1", cellType: "dropdown", defaultValueExpression: "1", choices: [{ value: 1, text: "item 1" }] }
            ]
          }
        ]
      };
      await initSurvey(page, framework, json);
      const clearButtons = page.locator("button[title='Clear']");
      await expect(clearButtons).toHaveCount(3);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(2);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(1);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(0);

      await page.click("input[value=Complete]");
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ });
    });

    test("Matrix is not re-create rows on setting value after the matrix value is empty array, Bug#10622", async ({ page }) => {
      const json = {
        elements: [
          { type: "matrixdynamic", name: "matrix", rowCount: 2,
            columns: [{ name: "col1", cellType: "text", defaultValue: "abc" }]
          }
        ]
      };
      await initSurvey(page, framework, json);
      const removeButtons = page.locator("button[title='Remove']");
      await expect(removeButtons).toHaveCount(2);
      await removeButtons.nth(0).click();
      await expect(removeButtons).toHaveCount(1);
      await removeButtons.nth(0).click();
      await expect(removeButtons).toHaveCount(0);
      await page.evaluate(() => {
        window.survey.getQuestionByName("matrix").value = [{ col1: "row1" }];
      });
      await page.waitForTimeout(500);
      expect(await page.getByRole("textbox", { name: "row 0, column col1" }).inputValue()).toBe("row1");
      await expect(removeButtons).toHaveCount(1);

      await page.click("input[value=Complete]");
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ matrix: [{ col1: "row1" }] });
    });
    test("Matrix focus the first visible and enabled cell on focusing matrix, Bug#10657", async ({ page }) => {
      const json = {
        elements: [
          { type: "text", name: "q1" },
          { type: "matrixdynamic", name: "matrix", rowCount: 1,
            columns: [{ name: "col1", cellType: "text", visible: false }, { name: "col2", cellType: "text" }]
          }
        ]
      };
      await initSurvey(page, framework, json);
      await page.evaluate(() => {
        window.survey.getQuestionByName("matrix").focus();
      });
      await page.waitForTimeout(500);
      await page.keyboard.type("row1col2");
      await page.keyboard.press("Tab");

      await page.click("input[value=Complete]");
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ matrix: [{ col2: "row1col2" }] });
    });
    test("DnD: Matrixdynamic inside Matrixdynamic", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      const json = {
        "elements": [
          {
            "type": "matrixdynamic",
            "name": "parent",
            "columns": [
              {
                "name": "parent-text",
                "cellType": "text"
              }
            ],
            "detailElements": [
              {
                "type": "matrixdynamic",
                "name": "child",
                "columns": [
                  {
                    "name": "child-text",
                    "cellType": "text",
                  }
                ],
                "rowCount": 2,
                "allowRowReorder": true
              }
            ],
            "detailPanelMode": "underRowSingle",
            "detailPanelShowOnAdding": true,
            "rowCount": 2,
            "allowRowReorder": true
          }
        ]
      };

      const data = {
        "parent": [
          {
            "parent-text": "parent text 1",
            "child": [
              {
                "child-text": "child text 1"
              },
              {
                "child-text": "child text 2"
              }
            ]
          },
          {
            "parent-text": "parent text 2"
          }
        ]
      };

      await initSurvey(page, framework, json);
      await setData(page, data);

      await page.getByRole("button", { name: "Show Details" }).first().click();
      const row1 = page.locator(".sd-matrixdynamic .sd-matrixdynamic tbody tr").nth(0);
      const row2 = page.locator(".sd-matrixdynamic .sd-matrixdynamic tbody tr").nth(1);
      const dragIcon = row1.locator(".sd-table__cell--drag .sd-drag-element__svg");

      await row1.hover();
      await doDragDrop({ page, element: dragIcon, target: row2 });

      expect(await getData(page)).toEqual({
        "parent": [
          {
            "parent-text": "parent text 1",
            "child": [
              {
                "child-text": "child text 2"
              },
              {
                "child-text": "child text 1"
              },
            ]
          },
          {
            "parent-text": "parent text 2"
          }
        ]
      });
    });
  });
});

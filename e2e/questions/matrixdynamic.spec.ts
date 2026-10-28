import { frameworks, url, initSurvey, getSurveyResult, getVisibleSelectListItemByText, test, expect, setData, getData, doDragDrop, getButtonByText } from "../helper";

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
      await getButtonByText(page, "Complete").click();
      expect(await getRowsCount()).toBe(4);
      await expect(getRequiredElement(0)).toBeVisible();
      await expect(getRequiredElement(2)).toBeVisible();

      let surveyResult = await getSurveyResult(page);
      expect(typeof surveyResult).toBe("undefined");
      await questionDropdownSelect.nth(0).click();
      await getVisibleSelectListItemByText(page, "Science: Physical Science").click();
      await getButtonByText(page, "Complete").click();
      expect(await getRowsCount()).toBe(3);
      await expect(getRequiredElement(1)).toBeVisible();

      surveyResult = await getSurveyResult(page);
      expect(typeof surveyResult).toBe("undefined");
    });

    test("choose several values", async ({ page }) => {
      const matrixRowSelector = page.locator(".sd-table__row");
      const questionDropdownSelect = page.locator(".sd-dropdown");

      const fillTheRow = async function (rowNumber: number) {
        await questionDropdownSelect.nth(rowNumber).scrollIntoViewIfNeeded();
        await questionDropdownSelect.nth(rowNumber).click();
        await getVisibleSelectListItemByText(page, "Science: Physical Science").click();

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

      await getButtonByText(page, "Complete").click();

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
      await getVisibleSelectListItemByText(page, "Science: Physical Science").click();

      await questionDropdownSelect.nth(1).click();
      await page.waitForTimeout(500);
      await getVisibleSelectListItemByText(page, "Science: Chemistry").click();
      await page.locator(".sd-matrixdynamic__btn[title='Remove']").nth(1).click();
      await page.waitForTimeout(500);
      expect(await matrixRowSelector.count()).toBe(1);

      await getButtonByText(page, "Complete").click();

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
      await getVisibleSelectListItemByText(page, "Science: Physical Science").click();

      await questionDropdownSelect.nth(1).click();
      await getVisibleSelectListItemByText(page, "Science: Chemistry").click();

      await questionDropdownSelect.nth(2).click();
      await getVisibleSelectListItemByText(page, "Math: Algebra").click();

      await getButtonByText(page, "Complete").click();

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
      await getButtonByText(page, "Complete").click();

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
      await getButtonByText(page, "Complete").click();

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
      await getButtonByText(page, "Complete").click();

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
      await getButtonByText(page, "Complete").click();

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
      await expect(getButtonByText(page, "Show Details").filter({ visible: true }).first()).toContainText("Show Details");
      await expect(getButtonByText(page, "Hide Details").filter({ visible: true }).first()).toContainText("Hide Details");

      await getButtonByText(page, "Show Details").filter({ visible: true }).first().click();
      await expect(getButtonByText(page, "Hide Details").filter({ visible: true }).first()).toContainText("Hide Details");
      await expect(getButtonByText(page, "Show Details").filter({ visible: true }).first()).toContainText("Show Details");
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
      await getVisibleSelectListItemByText(page, "3").click();
      expect(await matrixRowSelector.count()).toBe(3);
      await clearButton.click();
      expect(await matrixRowSelector.count()).toBe(0);
      await questionDropdownSelect.click();
      await getVisibleSelectListItemByText(page, "5").click();
      expect(await matrixRowSelector.count()).toBe(5);
    });

    test("page move keeps rendering the rows it replaced until they are dropped", async ({ page }) => {
      // The rows a page move replaces are disposed. A UI that renders asynchronously (Angular) checks
      // their cells once more before it drops them: a disposed dropdown cell made that check throw.
      const defaultValue: Array<any> = [];
      for (let i = 0; i < 5; i++) defaultValue.push({ id: i, kind: "a", tags: ["x"] });
      await initSurvey(page, framework, {
        elements: [
          {
            type: "matrixdynamic",
            name: "matrix",
            pageSize: 2,
            defaultValue: defaultValue,
            columns: [
              { name: "id", cellType: "text" },
              { name: "kind", cellType: "dropdown", choices: ["a", "b", "c"] },
              { name: "tags", cellType: "tagbox", choices: ["x", "y"] },
            ],
          },
        ],
      });
      const firstId = page.locator("td[title='id'] input").first();
      const firstKind = page.locator("td[title='kind'] .sd-dropdown").first();
      const goToPage = async (next: boolean) => {
        await page.evaluate((next) => {
          const matrix = (window as any).survey.getQuestionByName("matrix");
          next ? matrix.nextPage() : matrix.prevPage();
        }, next);
      };

      await expect(firstId).toHaveValue("0");
      await firstKind.click();
      await getVisibleSelectListItemByText(page, "b").click();
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await expect(firstKind.locator(".sv-string-viewer")).toHaveText("b");

      await goToPage(true);
      await expect(firstId).toHaveValue("2");
      await firstKind.click();
      await getVisibleSelectListItemByText(page, "c").click();
      // The dropdown that has the focus leaves the page.
      await goToPage(false);
      await page.locator("body").click({ position: { x: 1, y: 1 } });
      await expect(firstId).toHaveValue("0");
      await expect(firstKind.locator(".sv-string-viewer")).toHaveText("b");

      const data = await getData(page);
      expect(data.matrix.map((row: any) => row.kind)).toEqual(["b", "a", "c", "a", "a"]);
    });

    test("the pager moves the pages through its buttons and its page dropdown", async ({ page }) => {
      const defaultValue: Array<any> = [];
      for (let i = 1; i <= 25; i++) defaultValue.push({ id: "row" + i });
      await initSurvey(page, framework, {
        elements: [
          {
            type: "matrixdynamic",
            name: "matrix",
            pageSize: 2,
            defaultValue: defaultValue,
            columns: [{ name: "id", cellType: "text" }],
          },
        ],
      });
      const pager = page.locator(".sd-pager");
      const firstId = page.locator("td[title='id'] input").first();

      await expect(firstId).toHaveValue("row1");
      await expect(pager.locator("button[title='First']")).toBeDisabled();
      await expect(pager.locator("button[title='Previous']")).toBeDisabled();
      await expect(pager.locator(".sd-pager__total")).toHaveText("of 13");
      await pager.locator("button[title='Next']").click();
      await expect(firstId).toHaveValue("row3");
      await pager.locator("button[title='Last']").click();
      await expect(firstId).toHaveValue("row25");
      await expect(pager.locator("button[title='Last']")).toBeDisabled();
      await pager.locator("button[title='First']").click();
      await expect(firstId).toHaveValue("row1");
      await expect(pager.locator("button[title='First']")).toBeDisabled();
      await pager.getByRole("button", { name: "Page 1 of 13" }).click();
      await page.getByRole("menuitemradio", { name: "3", exact: true }).click();
      await expect(firstId).toHaveValue("row5");
      await expect(pager.getByRole("button", { name: "Page 3 of 13" }).locator(".sd-action__title")).toHaveText("3");
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
      await getButtonByText(page, "Complete").click();
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
      await getButtonByText(page, "Complete").click();
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
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(1);
      await textSelector.nth(0).fill("1");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(1);
      await textSelector.nth(0).fill("0");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(1);
      await textSelector.nth(1).fill("1");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(2);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(1);
      await textSelector.nth(1).fill("0");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(1);
      await textSelector.nth(2).fill("1");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(2);
      await textSelector.nth(2).fill("0");
      await page.keyboard.press("Tab");
      expect(await page.locator("tbody tr").nth(0).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(1).locator("td").count()).toBe(1);
      expect(await page.locator("tbody tr").nth(2).locator("td").count()).toBe(1);
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
      const clearButtons = getButtonByText(page, "Clear");
      await expect(clearButtons).toHaveCount(3);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(2);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(1);
      await clearButtons.nth(0).click();
      await expect(clearButtons).toHaveCount(0);

      await getButtonByText(page, "Complete").click();
      const surveyResult = await getSurveyResult(page);
      expect(surveyResult).toEqual({ matrix: [{}, {}, {}] });
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
      const removeButtons = getButtonByText(page, "Remove");
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

      await getButtonByText(page, "Complete").click();
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

      await getButtonByText(page, "Complete").click();
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
      const dragIcon = row1.locator(".sd-drag-element__svg");

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

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title} sortable headers`, () => {
    const sortJson = (extra?: any): any => ({
      elements: [Object.assign({
        type: "matrixdynamic",
        name: "matrix",
        allowSort: true,
        allowRowReorder: true,
        rowCount: 0,
        columns: [
          { name: "product", cellType: "text" },
          { name: "price", cellType: "text", inputType: "number" },
        ],
        defaultValue: [
          { product: "b", price: 20 },
          { product: "a", price: 30 },
          { product: "c", price: 10 },
        ],
      }, extra)],
    });
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });
    const prices = async (page): Promise<Array<string>> =>
      page.locator(".sd-table__row input[type=number]").evaluateAll((inputs: Array<HTMLInputElement>) => inputs.map((input) => input.value));
    const ariaSorts = async (page): Promise<Array<string | null>> =>
      page.locator("thead th").evaluateAll((cells: Array<HTMLElement>) => cells.map((cell) => cell.getAttribute("aria-sort")));

    test("a click on a header sorts by its column: highest first, lowest first, then the original order", async ({ page }) => {
      await initSurvey(page, framework, sortJson());
      const priceHeader = page.locator("thead th").nth(1);
      const priceButton = priceHeader.locator("button");
      const dragHandles = page.locator(".sd-table__row .sd-drag-element__svg");
      expect(await dragHandles.count()).toBe(3);
      expect(await prices(page)).toEqual(["20", "30", "10"]);

      await priceButton.click();
      expect(await prices(page)).toEqual(["30", "20", "10"]);
      await expect(priceHeader).toHaveAttribute("aria-sort", "descending");
      expect(await dragHandles.count()).toBe(0);

      await priceButton.click();
      expect(await prices(page)).toEqual(["10", "20", "30"]);
      await expect(priceHeader).toHaveAttribute("aria-sort", "ascending");

      await priceButton.click();
      expect(await prices(page)).toEqual(["20", "30", "10"]);
      expect((await ariaSorts(page)).filter((value) => value !== null)).toEqual([]);
      expect(await dragHandles.count()).toBe(3);
    });

    for (const key of ["Enter", "Space"]) {
      test(`${key} on a focused header sorts and keeps the focus on its button`, async ({ page }) => {
        await initSurvey(page, framework, sortJson());
        const priceHeader = page.locator("thead th").nth(1);
        const priceButton = priceHeader.locator("button");
        const dragHandles = page.locator(".sd-table__row .sd-drag-element__svg");
        await page.locator("thead th").nth(0).locator("button").focus();
        await page.keyboard.press("Tab");
        await expect(priceButton).toBeFocused();

        await page.keyboard.press(key);
        expect(await prices(page)).toEqual(["30", "20", "10"]);
        await expect(priceHeader).toHaveAttribute("aria-sort", "descending");
        await expect(priceButton).toBeFocused();
        expect(await dragHandles.count()).toBe(0);

        await page.keyboard.press(key);
        expect(await prices(page)).toEqual(["10", "20", "30"]);
        await expect(priceHeader).toHaveAttribute("aria-sort", "ascending");
        await expect(priceButton).toBeFocused();

        await page.keyboard.press(key);
        expect(await prices(page)).toEqual(["20", "30", "10"]);
        expect((await ariaSorts(page)).filter((value) => value !== null)).toEqual([]);
        await expect(priceButton).toBeFocused();
        expect(await dragHandles.count()).toBe(3);
      });
    }

    test("the whole header cell is the click target", async ({ page }) => {
      await initSurvey(page, framework, sortJson({
        allowRowReorder: false,
        columns: [
          { name: "product", cellType: "text", title: "A product title long enough to wrap to a second line", width: "160px" },
          { name: "price", cellType: "text", inputType: "number" },
        ],
      }));
      const priceHeader = page.locator("thead th").nth(1);
      const productHeader = page.locator("thead th").nth(0);
      const priceBox = await priceHeader.boundingBox();
      const productBox = await productHeader.boundingBox();
      expect(productBox.height > 60, "the product title wraps").toBeTruthy();
      expect(Math.abs(priceBox.height - productBox.height) < 1, "the row decides the height").toBeTruthy();

      // Inside what was the cell's padding, near the top-left corner.
      await page.mouse.click(priceBox.x + 3, priceBox.y + 3);
      expect(await prices(page)).toEqual(["30", "20", "10"]);
      // Near the bottom edge of the short header, below its title.
      await page.mouse.click(priceBox.x + priceBox.width / 2, priceBox.y + priceBox.height - 3);
      expect(await prices(page)).toEqual(["10", "20", "30"]);
    });

    test("Shift-click sorts by a second column; only the first one has aria-sort", async ({ page }) => {
      await initSurvey(page, framework, sortJson({ maxSortLevel: 2, defaultValue: [
        { product: "b", price: 20 },
        { product: "a", price: 20 },
        { product: "c", price: 10 },
      ] }));
      const priceHeader = page.locator("thead th").nth(1);
      const productHeader = page.locator("thead th").nth(0);
      await priceHeader.locator("button").click();
      await productHeader.locator("button").click({ modifiers: ["Shift"] });
      const products = await page.locator(".sd-table__row input[type=text]").evaluateAll((inputs: Array<HTMLInputElement>) => inputs.map((input) => input.value));
      expect(products).toEqual(["a", "b", "c"]);
      await expect(priceHeader).toHaveAttribute("aria-sort", "descending");
      await expect(productHeader).not.toHaveAttribute("aria-sort");
      const describedBy = await productHeader.locator("button").getAttribute("aria-describedby");
      expect(await page.locator(`[id="${describedBy}"]`).textContent()).toBe("Sorted by price (High - Low), then by product (Alphabet, A - Z)");
    });

    test("a click without Shift on the second sorted column turns it around in place, then removes it", async ({ page }) => {
      await initSurvey(page, framework, sortJson({ maxSortLevel: 2, defaultValue: [
        { product: "b", price: 20 },
        { product: "c", price: 20 },
        { product: "a", price: 20 },
        { product: "d", price: 10 },
      ] }));
      const priceHeader = page.locator("thead th").nth(1);
      const productHeader = page.locator("thead th").nth(0);
      const products = async (): Promise<Array<string>> =>
        page.locator(".sd-table__row input[type=text]").evaluateAll((inputs: Array<HTMLInputElement>) => inputs.map((input) => input.value));

      await priceHeader.locator("button").click();
      expect(await products()).toEqual(["b", "c", "a", "d"]);

      await productHeader.locator("button").click({ modifiers: ["Shift"] });
      expect(await products()).toEqual(["a", "b", "c", "d"]);

      await productHeader.locator("button").click();
      expect(await products()).toEqual(["c", "b", "a", "d"]);
      await expect(priceHeader.locator(".sd-table__header-sort--desc")).toHaveCount(1);
      await expect(productHeader.locator(".sd-table__header-sort--desc")).toHaveCount(1);
      await expect(priceHeader).toHaveAttribute("aria-sort", "descending");
      await expect(productHeader).not.toHaveAttribute("aria-sort");

      await productHeader.locator("button").click();
      expect(await products()).toEqual(["b", "c", "a", "d"]);
      await expect(productHeader.locator(".sd-table__header-sort--none")).toHaveCount(1);
      await expect(priceHeader).toHaveAttribute("aria-sort", "descending");
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title} sort bar`, () => {
    const barJson = (extra?: any): any => ({
      elements: [Object.assign({
        type: "matrixdynamic",
        name: "matrix",
        title: "Products",
        allowSort: true,
        showSortBar: "always",
        rowCount: 0,
        columns: [
          { name: "product", title: "Product", cellType: "text" },
          { name: "category", title: "Category", cellType: "dropdown", choices: ["tools", "toys"] },
          { name: "price", title: "Price", cellType: "text", inputType: "number" },
          { name: "discontinued", title: "Discontinued", cellType: "boolean" },
        ],
        defaultValue: [
          { product: "b", category: "toys", price: 20, discontinued: false },
          { product: "a", category: "tools", price: 30, discontinued: true },
          { product: "c", category: "toys", price: 10, discontinued: false },
        ],
      }, extra)],
    });
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1920, height: 1080 });
    });
    const prices = async (page): Promise<Array<string>> =>
      page.locator(".sd-table__row input[type=number]").evaluateAll((inputs: Array<HTMLInputElement>) => inputs.map((input) => input.value));
    const headerBar = (page) => page.locator(".sd-question__header .sd-matrixdynamic__sort-bar");
    const fieldButton = (page) => page.getByRole("button", { name: /^Sort field/ });
    const directionButton = (page) => page.getByRole("button", { name: /^Sort order/ });
    const listItem = (page, text: string) =>
      page.locator(".sv-popup__container").filter({ visible: true }).getByRole("menuitemradio", { name: text, exact: true });

    test("a field pick sorts by it, a direction pick flips it and Default restores the stored order", async ({ page }) => {
      await initSurvey(page, framework, barJson());
      await expect(headerBar(page)).toBeVisible();
      await expect(fieldButton(page).locator(".sd-action__title")).toHaveText("Product");
      await expect(directionButton(page).locator(".sd-action__title")).toHaveText("Default");
      expect(await prices(page)).toEqual(["20", "30", "10"]);

      await fieldButton(page).click();
      await listItem(page, "Price").click();
      expect(await prices(page)).toEqual(["30", "20", "10"]);
      await expect(fieldButton(page).locator(".sd-action__title")).toHaveText("Price");
      await expect(directionButton(page).locator(".sd-action__title")).toHaveText("High - Low");
      await expect(page.locator("thead th").nth(2)).toHaveAttribute("aria-sort", "descending");

      await directionButton(page).click();
      await listItem(page, "Low - High").click();
      expect(await prices(page)).toEqual(["10", "20", "30"]);

      await directionButton(page).click();
      await listItem(page, "Default").click();
      expect(await prices(page)).toEqual(["20", "30", "10"]);
      await expect(fieldButton(page).locator(".sd-action__title")).toHaveText("Price");
      await expect(directionButton(page).locator(".sd-action__title")).toHaveText("Default");
    });

    test("the field list opens and picks with the keyboard", async ({ page }) => {
      await initSurvey(page, framework, barJson());
      await fieldButton(page).focus();
      await page.keyboard.press("Enter");
      // The list takes the focus on the selected item.
      await expect(listItem(page, "Product")).toBeFocused();
      await page.keyboard.press("ArrowDown");
      await page.keyboard.press("ArrowDown");
      await expect(listItem(page, "Price")).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(fieldButton(page).locator(".sd-action__title")).toHaveText("Price");
      await expect(fieldButton(page)).toBeFocused();
      expect(await prices(page)).toEqual(["30", "20", "10"]);
    });

    test("a click on a dropdown opens its list and does not collapse the question", async ({ page }) => {
      await initSurvey(page, framework, barJson({ state: "expanded" }));
      await fieldButton(page).click();
      await expect(listItem(page, "Price")).toBeVisible();
      await expect(page.locator(".sd-table")).toBeVisible();
      await listItem(page, "Price").click();
      await expect(page.locator(".sd-table")).toBeVisible();
      await directionButton(page).click();
      await expect(listItem(page, "Low - High")).toBeVisible();
      await listItem(page, "Low - High").click();
      await expect(page.locator(".sd-table")).toBeVisible();
      expect(await prices(page)).toEqual(["10", "20", "30"]);
    });

    test("with a hidden title the bar shows above the records", async ({ page }) => {
      await initSurvey(page, framework, barJson({ titleLocation: "hidden" }));
      await expect(headerBar(page)).toHaveCount(0);
      await expect(page.locator(".sd-matrixdynamic__sort-bar-top .sd-matrixdynamic__sort-bar")).toBeVisible();
      await fieldButton(page).click();
      await listItem(page, "Price").click();
      expect(await prices(page)).toEqual(["30", "20", "10"]);
    });
    // Several levels: four rows whose product order inside a category differs from the stored order.
    const levelsJson = (extra?: any): any => barJson(Object.assign({
      columns: [
        { name: "product", title: "Product", cellType: "text" },
        { name: "category", title: "Category", cellType: "text" },
        { name: "price", title: "Price", cellType: "text", inputType: "number" },
      ],
      defaultValue: [
        { product: "c", category: "toys", price: 10 },
        { product: "a", category: "tools", price: 30 },
        { product: "b", category: "toys", price: 20 },
        { product: "d", category: "toys", price: 5 },
      ],
    }, extra));
    const products = async (page): Promise<Array<string>> =>
      page.locator(".sd-table__row").evaluateAll((rows: Array<HTMLElement>) => rows.map((row) => (row.querySelector("input[type=text]") as HTMLInputElement).value));
    // The first level keeps the names of a bar with one level; a later level's names carry its number.
    const levelButton = (page, label: string, level: number) =>
      page.getByRole("button", { name: level === 1 ? new RegExp("^" + label + " (?!\\d)") : new RegExp("^" + label + " " + level + " ") });
    const levelField = (page, level: number) => levelButton(page, "Sort field", level);
    const levelDirection = (page, level: number) => levelButton(page, "Sort order", level);
    const removeButton = (page, level: number) => page.getByRole("button", { name: "Remove sort level " + level, exact: true });
    const addButton = (page) => page.getByRole("button", { name: "Add sort level", exact: true });

    test("\"+\" adds the next field as a second level, a level changes alone, and its remove button takes it out", async ({ page }) => {
      await initSurvey(page, framework, levelsJson({ maxSortLevel: 3 }));
      await expect(addButton(page)).toBeDisabled();
      await levelField(page, 1).click();
      await listItem(page, "Category").click();
      expect(await products(page)).toEqual(["a", "c", "b", "d"]);

      await addButton(page).click();
      await expect(levelField(page, 2).locator(".sd-action__title")).toHaveText("Product");
      await expect(levelDirection(page, 2).locator(".sd-action__title")).toHaveText("Alphabet, A - Z");
      expect(await products(page)).toEqual(["a", "b", "c", "d"]);

      await levelDirection(page, 2).click();
      await listItem(page, "Alphabet, Z - A").click();
      expect(await products(page)).toEqual(["a", "d", "c", "b"]);
      await expect(levelField(page, 1).locator(".sd-action__title")).toHaveText("Category");

      await removeButton(page, 2).click();
      await expect(levelField(page, 2)).toHaveCount(0);
      expect(await products(page)).toEqual(["a", "c", "b", "d"]);
    });

    test("the keyboard: \"+\" keeps the focus, a removed level hands it to the level before, and \"+\" that hides hands it to the new level", async ({ page }) => {
      await initSurvey(page, framework, levelsJson({ maxSortLevel: 3, sortCriteria: [{ field: "category", direction: "asc" }] }));
      await levelDirection(page, 1).focus();
      await page.keyboard.press("Tab");
      await expect(addButton(page)).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(levelField(page, 2).locator(".sd-action__title")).toHaveText("Product");
      await expect(addButton(page)).toBeFocused();

      await removeButton(page, 2).focus();
      await page.keyboard.press("Enter");
      await expect(levelField(page, 2)).toHaveCount(0);
      await expect(levelField(page, 1)).toBeFocused();

      // The limit: the third level hides "+".
      await addButton(page).focus();
      await page.keyboard.press("Enter");
      await expect(addButton(page)).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(addButton(page)).toHaveCount(0);
      await expect(levelField(page, 3).locator(".sd-action__title")).toHaveText("Price");
      await expect(levelField(page, 3)).toBeFocused();
    });

    test("the keyboard: \"+\" that uses the last offered field hands the focus to the new level", async ({ page }) => {
      await initSurvey(page, framework, levelsJson({ maxSortLevel: 3, sortCriteria: [{ field: "category", direction: "asc" }],
        columns: [
          { name: "product", title: "Product", cellType: "text" },
          { name: "category", title: "Category", cellType: "text" },
          { name: "price", title: "Price", cellType: "text", inputType: "number", allowSort: false },
        ] }));
      await addButton(page).focus();
      await page.keyboard.press("Enter");
      await expect(addButton(page)).toHaveCount(0);
      await expect(levelField(page, 2).locator(".sd-action__title")).toHaveText("Product");
      await expect(levelField(page, 2)).toBeFocused();
    });

    test("on a phone three levels scroll sideways, and a dropdown of the last level opens under its button", async ({ page }) => {
      await page.setViewportSize({ width: 420, height: 900 });
      await initSurvey(page, framework, levelsJson({ maxSortLevel: 3, sortCriteria: [
        { field: "category", direction: "asc" }, { field: "product", direction: "asc" }, { field: "price", direction: "desc" }] }));
      const bar = headerBar(page);
      await expect(bar).toBeVisible();
      const layout = await bar.evaluate((el: HTMLElement) => [el.scrollWidth > el.clientWidth, getComputedStyle(el).overflowX, getComputedStyle(el).flexWrap]);
      expect(layout).toEqual([true, "auto", "nowrap"]);
      const button = levelDirection(page, 3);
      /* The respondent scrolls the row, then taps: a dropdown closes when a scroll box around it scrolls, and the
         scroll event of a scroll made with the tap would arrive after the popup opened. */
      await button.scrollIntoViewIfNeeded();
      await bar.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));
      expect(await bar.evaluate((el: HTMLElement) => el.scrollLeft)).toBeGreaterThan(0);
      await button.click();
      const popup = page.locator(".sv-popup__container").filter({ visible: true });
      await expect(popup.getByRole("menuitemradio", { name: "Low - High", exact: true })).toBeVisible();
      const buttonBox = await button.boundingBox();
      const popupBox = await popup.boundingBox();
      expect(popupBox!.y).toBeGreaterThanOrEqual(buttonBox!.y + buttonBox!.height - 1);
      expect(popupBox!.x < buttonBox!.x + buttonBox!.width && popupBox!.x + popupBox!.width > buttonBox!.x).toBe(true);
      await popup.getByRole("menuitemradio", { name: "Low - High", exact: true }).click();
      await expect(button.locator(".sd-action__title")).toHaveText("Low - High");
    });
  });
});

frameworks.forEach((framework) => {
  test.describe(`${framework} ${title} sort bar: More... and the sort dialog`, () => {
    // The design's frame: a long title and five sortable columns.
    const moreJson = (extra?: any): any => ({
      elements: [Object.assign({
        type: "matrixdynamic",
        name: "matrix",
        title: "Health Product - Long Title for Example",
        allowSort: true,
        showSortBar: "always",
        maxSortLevel: 4,
        rowCount: 0,
        columns: [
          { name: "product", title: "Product", cellType: "text" },
          { name: "category", title: "Category", cellType: "text" },
          { name: "price", title: "Price, USD", cellType: "text", inputType: "number" },
          { name: "quantity", title: "Quantity per Unit", cellType: "text" },
          { name: "stock", title: "In Stock", cellType: "text", inputType: "number" },
        ],
        sortCriteria: [{ field: "category", direction: "asc" }, { field: "product", direction: "desc" }, { field: "price", direction: "asc" }],
        defaultValue: [
          { product: "c", category: "toys", price: 10, quantity: "1 box", stock: 3 },
          { product: "a", category: "tools", price: 30, quantity: "2 boxes", stock: 1 },
          { product: "b", category: "toys", price: 20, quantity: "3 boxes", stock: 2 },
          { product: "d", category: "toys", price: 5, quantity: "4 boxes", stock: 4 },
        ],
      }, extra)],
    });
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
      await page.setViewportSize({ width: 1024, height: 900 });
    });
    const products = async (page): Promise<Array<string>> =>
      page.locator(".sd-table__row").evaluateAll((rows: Array<HTMLElement>) => rows.map((row) => (row.querySelector("input[type=text]") as HTMLInputElement).value));
    const headerBar = (page) => page.locator(".sd-question__header .sd-matrixdynamic__sort-bar");
    const levelButton = (page, label: string, level: number) =>
      headerBar(page).getByRole("button", { name: level === 1 ? new RegExp("^" + label + " (?!\\d)") : new RegExp("^" + label + " " + level + " ") });
    const levelField = (page, level: number) => levelButton(page, "Sort field", level);
    const levelDirection = (page, level: number) => levelButton(page, "Sort order", level);
    const moreButton = (page) => headerBar(page).getByRole("button", { name: "Show all sort levels", exact: true });
    const addButton = (page) => page.getByRole("button", { name: "Add sort level", exact: true });
    const dialog = (page) => page.locator(".sv-popup--records-sort");
    const dialogRows = (page) => dialog(page).locator(".sd-sort-dialog__row");
    const rowField = (page, row: number) => dialogRows(page).nth(row - 1).locator("button").nth(0);
    const rowDirection = (page, row: number) => dialogRows(page).nth(row - 1).locator("button").nth(1);
    const dialogButton = (page, text: string) => dialog(page).locator(".sv-popup__body-footer").getByRole("button", { name: text, exact: true });
    const listItem = (page, text: string) =>
      page.locator(".sv-popup--menu-popup .sv-popup__container").filter({ visible: true }).getByRole("menuitemradio", { name: text, exact: true });
    const rowsShown = async (page): Promise<Array<Array<string>>> =>
      dialogRows(page).evaluateAll((rows: Array<HTMLElement>) => rows.map((row) =>
        Array.prototype.map.call(row.querySelectorAll(".sd-action__title"), (el: Element): string => el.textContent) as Array<string>));
    const sortOf = async (page): Promise<any> => page.evaluate(() => (window as any).survey.getQuestionByName("matrix").sortCriteria
      .map((item: any) => ({ field: item.field, direction: item.direction })));
    // The bar is transparent until its first fit.
    const waitForFit = async (page): Promise<void> => {
      await expect(headerBar(page)).toBeVisible();
      await expect(headerBar(page)).not.toHaveAttribute("style", /opacity/);
    };
    // The aria-label (or the text) of the focused element, read through a shadow root.
    const focusedName = async (page): Promise<string> => page.evaluate(() => {
      let el: any = document.activeElement;
      while(!!el && !!el.shadowRoot && !!el.shadowRoot.activeElement) el = el.shadowRoot.activeElement;
      return !!el ? el.getAttribute("aria-label") || el.textContent : "";
    });

    test("a level that does not fit is behind More... and comes back on a wider window; the dialog sorts on Apply", async ({ page }) => {
      await initSurvey(page, framework, moreJson());
      await waitForFit(page);
      await expect(moreButton(page)).toBeVisible();
      await expect(levelField(page, 3)).toHaveCount(0);
      await expect(levelField(page, 1)).toBeVisible();
      await page.setViewportSize({ width: 1440, height: 900 });
      await expect(levelField(page, 3)).toBeVisible();
      await expect(moreButton(page)).toHaveCount(0);
      await page.setViewportSize({ width: 1024, height: 900 });
      await expect(moreButton(page)).toBeVisible();

      await moreButton(page).click();
      await expect(dialog(page).locator(".sv-popup__body-header")).toHaveText("Sort by");
      expect(await rowsShown(page)).toEqual([["Category", "Alphabet, A - Z"], ["Product", "Alphabet, Z - A"], ["Price, USD", "Low - High"]]);
      await rowDirection(page, 2).click();
      await listItem(page, "Alphabet, A - Z").click();
      await expect(dialog(page)).toBeVisible();
      await dialogButton(page, "Add New").click();
      expect(await rowsShown(page)).toEqual([["Category", "Alphabet, A - Z"], ["Product", "Alphabet, A - Z"], ["Price, USD", "Low - High"], ["Quantity per Unit", "\u2014"]]);
      await expect(dialogButton(page, "Add New")).toHaveCount(0);
      await rowDirection(page, 4).click();
      await listItem(page, "Alphabet, Z - A").click();
      expect(await sortOf(page), "a draft sorts nothing").toEqual([{ field: "category", direction: "asc" }, { field: "product", direction: "desc" }, { field: "price", direction: "asc" }]);
      await dialogButton(page, "Apply").click();
      await expect(dialog(page)).toHaveCount(0);
      expect(await sortOf(page)).toEqual([{ field: "category", direction: "asc" }, { field: "product", direction: "asc" },
        { field: "price", direction: "asc" }, { field: "quantity", direction: "desc" }]);
      expect(await products(page)).toEqual(["a", "b", "c", "d"]);
      await expect(levelDirection(page, 1).locator(".sd-action__title")).toHaveText("Alphabet, A - Z");
      await expect(moreButton(page)).toBeVisible();

      await moreButton(page).click();
      await rowDirection(page, 1).click();
      await listItem(page, "Default").click();
      await page.keyboard.press("Escape");
      await expect(dialog(page)).toHaveCount(0);
      expect((await sortOf(page)).length).toBe(4);
      expect(await products(page)).toEqual(["a", "b", "c", "d"]);
    });

    test("the keyboard: Enter on More... opens the dialog on row 1, Esc closes an open list and then the dialog", async ({ page }) => {
      await initSurvey(page, framework, moreJson());
      await waitForFit(page);
      await addButton(page).focus();
      await page.keyboard.press("Shift+Tab");
      await expect(moreButton(page)).toBeFocused();
      await page.keyboard.press("Enter");
      await expect(rowField(page, 1)).toBeFocused();
      const tabOrder: Array<string> = [];
      for (let i = 0; i < 10; i++) {
        await page.keyboard.press("Tab");
        tabOrder.push(await focusedName(page));
      }
      expect(tabOrder).toEqual(["Sort order Alphabet, A - Z", "Sort field 2 Product", "Sort order 2 Alphabet, Z - A", "Remove sort level 2",
        "Sort field 3 Price, USD", "Sort order 3 Low - High", "Remove sort level 3", "Add New", "Apply", "Sort field Category"]);
      await rowDirection(page, 1).focus();
      await page.keyboard.press("Enter");
      // The list takes the focus on its first item, as in the bar.
      await expect(listItem(page, "Default")).toBeFocused();
      await page.keyboard.press("Escape");
      await expect(listItem(page, "Default")).toHaveCount(0);
      await expect(dialog(page)).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(dialog(page)).toHaveCount(0);
      await expect(moreButton(page)).toBeFocused();
    });

    test("a dropdown of a row opens over the dialog, and a pick in its list keeps the dialog open", async ({ page }) => {
      await initSurvey(page, framework, moreJson());
      await waitForFit(page);
      await moreButton(page).click();
      await rowField(page, 3).click();
      const item = listItem(page, "In Stock");
      await expect(item).toBeVisible();
      const box = await item.boundingBox();
      const isOnTop = await page.evaluate(({ x, y }) => {
        let el: any = document.elementFromPoint(x, y);
        while(!!el && !!el.shadowRoot && !!el.shadowRoot.elementFromPoint(x, y) && el.shadowRoot.elementFromPoint(x, y) !== el) el = el.shadowRoot.elementFromPoint(x, y);
        return !!el && !!el.closest("[role=menuitemradio]");
      }, { x: box!.x + box!.width / 2, y: box!.y + box!.height / 2 });
      expect(isOnTop, "the list is above the overlay").toBe(true);
      await item.click();
      await expect(dialog(page)).toBeVisible();
      await expect(rowField(page, 3).locator(".sd-action__title")).toHaveText("In Stock");
      await dialog(page).locator(".sv-popup__close-button").click();
      await expect(dialog(page)).toHaveCount(0);
      expect((await sortOf(page))[2]).toEqual({ field: "price", direction: "asc" });
    });

    test("\"+\" adds a level that does not fit: More... shows, the level is in the dialog, and the focus goes to More...", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await initSurvey(page, framework, moreJson());
      await waitForFit(page);
      await expect(moreButton(page)).toHaveCount(0);
      await addButton(page).focus();
      await page.keyboard.press("Enter");
      await expect(addButton(page)).toHaveCount(0);
      await expect(moreButton(page)).toBeVisible();
      await expect(moreButton(page)).toBeFocused();
      await page.keyboard.press("Enter");
      expect((await rowsShown(page))[3]).toEqual(["Quantity per Unit", "Alphabet, A - Z"]);
    });

    test("\"+\" adds a level that fits: the focus goes to the new level's field", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 900 });
      await initSurvey(page, framework, moreJson({ title: "Products" }));
      await waitForFit(page);
      await addButton(page).focus();
      await page.keyboard.press("Enter");
      await expect(addButton(page)).toHaveCount(0);
      await expect(moreButton(page)).toHaveCount(0);
      await expect(levelField(page, 4)).toBeFocused();
    });

    test("a longer label pushes a level behind More..., a shorter one brings it back", async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      const json = moreJson();
      json.elements[0].columns[3].title = "Quantity per Unit, in Boxes";
      await initSurvey(page, framework, json);
      await waitForFit(page);
      await expect(levelField(page, 3)).toBeVisible();
      await expect(moreButton(page)).toHaveCount(0);
      await levelField(page, 2).click();
      await listItem(page, "Quantity per Unit, in Boxes").click();
      await expect(levelField(page, 2).locator(".sd-action__title")).toHaveText("Quantity per Unit, in Boxes");
      await expect(moreButton(page)).toBeVisible();
      await expect(levelField(page, 3)).toHaveCount(0);
      expect(await headerBar(page).evaluate((el: HTMLElement) => el.scrollWidth - el.clientWidth), "the bar does not overflow").toBeLessThanOrEqual(0);
      await levelField(page, 2).click();
      await listItem(page, "Product").click();
      await expect(levelField(page, 3)).toBeVisible();
      await expect(moreButton(page)).toHaveCount(0);
    });

    test("the focus after the dialog: level 1's field when an Apply leaves no More...", async ({ page }) => {
      await initSurvey(page, framework, moreJson());
      await waitForFit(page);
      await moreButton(page).click();
      await dialogRows(page).nth(2).getByRole("button", { name: /^Remove sort level/ }).click();
      await dialogRows(page).nth(1).getByRole("button", { name: /^Remove sort level/ }).click();
      await dialogButton(page, "Apply").click();
      await expect(dialog(page)).toHaveCount(0);
      await expect(moreButton(page)).toHaveCount(0);
      await expect(levelField(page, 1)).toBeFocused();
    });

    test("the focus after the dialog: level 1's field when the window grows while it is open", async ({ page }) => {
      await initSurvey(page, framework, moreJson());
      await waitForFit(page);
      await moreButton(page).click();
      await expect(rowField(page, 1)).toBeFocused();
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.keyboard.press("Escape");
      await expect(dialog(page)).toHaveCount(0);
      await expect(moreButton(page)).toHaveCount(0);
      await expect(levelField(page, 1)).toBeFocused();
    });

    test("on a phone there is no More...: every level shows and the row scrolls", async ({ page }) => {
      await page.setViewportSize({ width: 420, height: 900 });
      await initSurvey(page, framework, moreJson());
      await expect(headerBar(page)).toBeVisible();
      await expect(levelField(page, 3)).toHaveCount(1);
      await expect(moreButton(page)).toHaveCount(0);
      const layout = await headerBar(page).evaluate((el: HTMLElement) => [el.scrollWidth > el.clientWidth, getComputedStyle(el).overflowX]);
      expect(layout).toEqual([true, "auto"]);
    });
  });
});

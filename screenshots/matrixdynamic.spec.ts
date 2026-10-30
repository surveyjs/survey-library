import { test, expect } from "@playwright/test";
import { frameworks, url, initSurvey, compareScreenshot, resetFocusToBody, doDrag, setData, doDragDrop } from "../e2e/helper";

const title = "Matrixdynamic Screenshot";

frameworks.forEach(framework => {
  test.describe(`${framework} ${title}`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });

    // The pager shares the footer row with the Add Row button: the screenshots check the gap between them.
    [{ name: "desktop", width: 1920 }, { name: "mobile", width: 420 }].forEach(viewport => {
      test(`Matrixdynamic pager, ${viewport.name}`, async ({ page }) => {
        await page.setViewportSize({ width: viewport.width, height: 1080 });
        await initSurvey(page, framework, {
          showQuestionNumbers: false,
          elements: [{
            type: "matrixdynamic",
            name: "matrix",
            title: "Question title",
            pageSize: 1,
            defaultValue: Array.from({ length: 12 }, (_, i) => ({ name: "Row " + (i + 1) })),
            columns: [{ name: "name", cellType: "text" }]
          }]
        });
        await resetFocusToBody(page);
        await compareScreenshot(page, page.locator(".sd-question--matrixdynamic"), `matrixdynamic-pager-12-pages-${viewport.name}.png`);
        // The footer row: the buttons on the left and the pager on the right; on a phone the buttons stack above it.
        await page.evaluate(() => {
          (window as any).survey.getQuestionByName("matrix").toolbar.addAction({ id: "custom", title: "Custom Action", action: () => { } });
        });
        await compareScreenshot(page, page.locator(".sd-question--matrixdynamic"), `matrixdynamic-pager-custom-action-${viewport.name}.png`);
      });
    });

    test("Matrixdynamic empty placeholder", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        width: "900px",
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            hideColumnsIfEmpty: true,
            noRowsText: "There is no records yet.\nClick the button below to add a new record.",
            addRowText: "Add New Record",
            rowCount: 0,
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px"
          }
        ]
      });
      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-empty.png");
    });

    // The sortable headers: an unsorted column under the pointer (the quiet sort icon), an ascending
    // and a descending column (arrows in the hovered chip).
    test("Matrixdynamic sortable headers", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [{
          type: "matrixdynamic",
          name: "matrix",
          title: "Question title",
          allowSort: true,
          maxSortLevel: 2,
          sortCriteria: [{ field: "price", direction: "desc" }, { field: "category", direction: "asc" }],
          rowCount: 0,
          defaultValue: [
            { product: "Lamp", category: "Home", price: 30 },
            { product: "Chair", category: "Home", price: 120 },
            { product: "Pen", category: "Office", price: 2 }
          ],
          columns: [
            { name: "product", title: "Product", cellType: "text" },
            { name: "category", title: "Category", cellType: "text" },
            { name: "price", title: "Price", cellType: "text", inputType: "number" }
          ]
        }]
      });
      await resetFocusToBody(page);
      await page.locator("thead th").nth(0).hover();
      await compareScreenshot(page, page.locator(".sd-question--matrixdynamic thead"), "matrixdynamic-sortable-headers.png");
    });

    // A sort by two levels while more are allowed: each arrow shows its level. The last column is the
    // narrowest a header gets, with a long title that wraps beside a ranked indicator.
    test("Matrixdynamic sortable headers with level numbers", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [{
          type: "matrixdynamic",
          name: "matrix",
          title: "Question title",
          allowSort: true,
          maxSortLevel: 3,
          sortCriteria: [{ field: "product", direction: "desc" }, { field: "category", direction: "desc" }, { field: "units", direction: "asc" }],
          rowCount: 0,
          defaultValue: [
            { product: "Syrup Montana", category: "Condiments", price: 22, units: "36 boxes" },
            { product: "Chang", category: "Beverages", price: 15, units: "12 bottles" },
            { product: "Guarana", category: "Supplements", price: 10, units: "8 jars" }
          ],
          columns: [
            { name: "product", title: "Product", cellType: "text" },
            { name: "category", title: "Category", cellType: "text" },
            { name: "price", title: "Price, USD", cellType: "text", inputType: "number" },
            { name: "units", title: "Quantity per Unit, as shipped to the store", cellType: "text", width: "120px" }
          ]
        }]
      });
      await resetFocusToBody(page);
      await compareScreenshot(page, page.locator(".sd-question--matrixdynamic thead"), "matrixdynamic-sortable-headers-ranks.png");
    });

    test("Check Matrixdynamic", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        width: "900px",
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              { "name": "Column 1", "title": "Framework" },
              { "name": "Column 2", "title": "How long do you use it?" },
              { "name": "Column 3", "title": "What is main strength?" }],
            addRowText: "Add a New Record",
            rowCount: 3,
            maxWidth: "768px",
            minWidth: "768px",
            width: "768px"
          },
        ]
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic.png");
    });

    test("Check Matrixdynamic vertical", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "matrixdynamic",
            name: "Current Level of Function",
            transposeData: true,
            rowCount: 3,
            columns: [
              {
                name: "Date",
                title: "Date",
                cellType: "text",
                inputType: "date"
              }, {
                name: "AmbDistance",
                title: "Amb Distance",
                cellType: "text"
              }, {
                name: "Amb Assistance",
                cellType: "dropdown",
                choices: ["D", "MAX", "MOD", "MIN"]
              }, {
                name: "Standing Tolerance",
                cellType: "text"
              }, {
                name: "UE Strength",
                cellType: "text"
              }, {
                name: "Cognitive Function",
                cellType: "comment"
              }
            ],
            choices: [1],
            cellType: "comment",
            addRowText: "Add Date +",
            removeRowText: "Remove",
            maxWidth: "800px",
            minWidth: "800px",
            width: "800px"
          }
        ]
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-vertical.png");
    });

    test("Check Matrixdynamic errors inside cells", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        width: "900px",
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              {
                "name": "Column 1",
                "isRequired": true,
                "title": "Framework"
              },
              {
                "name": "Column 2",
                "title": "How long do you use it?"
              },
              {
                "name": "Column 3",
                "isRequired": true,
                "title": "What is main strength?"
              },
            ],
            addRowText: "Add a New Record",
            rowCount: 3,
            maxWidth: "724px",
            minWidth: "724px",
            width: "724px"
          },
        ]
      });
      const matrixdynamicRoot = page.locator(".sd-question");
      await page.click(".sd-navigation__complete-btn");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-errors-in-cell.png");
    });

    test("Check Matrixdynamic errors inside cells bottom", async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await initSurvey(page, framework, {
        questionErrorLocation: "bottom",
        showQuestionNumbers: false,
        width: "900px",
        elements: [
          {
            type: "matrixdynamic",
            name: "frameworks",
            title: "Please tells us your opinion about JavaScript MVVM frameworks.",
            columns: [
              {
                "name": "Column 1",
                "isRequired": true,
                "title": "Framework"
              },
              {
                "name": "Column 2",
                "title": "How long do you use it?"
              },
              {
                "name": "Column 3",
                "isRequired": true,
                "title": "What is main strength?"
              },
            ],
            addRowText: "Add a New Record",
            rowCount: 3,
            maxWidth: "724px",
            minWidth: "724px",
            width: "724px"
          },
        ]
      });
      const matrixdynamicRoot = page.locator(".sd-question");
      await page.click(".sd-navigation__complete-btn");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-errors-in-cell-bottom.png");
    });

    test("Check Matrixdynamic with allowRowReorder", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "pages": [{
          "name": "page1",
          "elements": [{
            "type": "matrixdynamic",
            "name": "relatives",
            "title": "Please enter all blood relatives you know",
            "columns": [
              { "name": "relativeType", "title": "Relative", "cellType": "dropdown", "isRequired": true, "choices": ["father", "mother", "brother", "sister", "son", "daughter"] },
              { "name": "firstName", "title": "First name", "cellType": "text", "isRequired": true },
              { "name": "lastName", "title": "Last name", "cellType": "text", "isRequired": true }
            ],
            "detailElements": [
              { "type": "radiogroup", "name": "isalive", "startWithNewLine": false, "title": "Alive?", "isRequired": true, "choices": ["Yes", "No"], "colCount": 0 },
              { "type": "dropdown", "name": "liveage", "visibleIf": "{row.isalive} = 'Yes'", "startWithNewLine": false, "title": "Age", "isRequired": true, "choicesMin": 1, "choicesMax": 115 },
              { "type": "dropdown", "name": "deceasedage", "visibleIf": "{row.isalive} = 'No'", "startWithNewLine": false, "title": "Deceased Age", "isRequired": true, "choices": [{ "value": -1, "text": "Unknown" }], "choicesMin": 1, "choicesMax": 115 },
              { "type": "radiogroup", "name": "causeofdeathknown", "visibleIf": "{row.isalive} = 'No'", "startWithNewLine": false, "title": "Cause of Death Known?", "isRequired": true, "choices": ["Yes", "No"], "colCount": 0 },
              { "type": "text", "name": "causeofdeath", "visibleIf": "{row.isalive} = 'No' and {row.causeofdeathknown} = 'Yes'", "startWithNewLine": false, "title": "Cause of Death", "isRequired": true }
            ],
            "detailPanelMode": "underRow",
            "addRowText": "Add a blood relative",
            "removeRowText": "Remove the relative",
            "allowRowReorder": true
          }]
        }],
        "checkErrorsMode": "onValueChanged"
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await matrixdynamicRoot.locator(".sd-table__row").first().hover();
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-allowRowsDragAndDrop.png");
    });

    test("Check Matrixdynamic with allowRowReorder & lockedRowCount=1", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [{
          type: "matrixdynamic",
          name: "question1",
          allowRowReorder: true,
          defaultValue: [{ col1: "Row1 value" }, { col1: "Row2 value" }, { col1: "Row3 value" }],
          columns: [{ "name": "col1", "title": "Column 1", "cellType": "text" }]
        }]
      });

      await page.evaluate(() => { (window as any).survey.getAllQuestions()[0].lockedRowCount = 1; });

      const matrixdynamicRoot = page.locator(".sd-question");
      await matrixdynamicRoot.locator(".sd-table__row").nth(0).hover();
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-allowRowsDragAndDrop-lockedRowCount.png");

      await matrixdynamicRoot.locator(".sd-table__row").nth(1).hover();
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-allowRowsDragAndDrop-lockedRowCount-2.png");

      await page.evaluate(() => { (window as any).survey.getAllQuestions()[0].allowRowReorder = false; });
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-lockedRowCount.png");
    });

    test("Check Matrixdynamic drag handle focused from the keyboard", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        elements: [{
          type: "matrixdynamic",
          name: "question1",
          allowRowReorder: true,
          defaultValue: [{ col1: "Row1 value" }, { col1: "Row2 value" }, { col1: "Row3 value" }],
          columns: [{ "name": "col1", "title": "Column 1", "cellType": "text" }]
        }]
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await matrixdynamicRoot.locator(".sd-table__row input").first().focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Tab");
      await expect(page.getByRole("button", { name: "Move row 2", exact: true })).toBeFocused();
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-drag-handle-focused.png");
    });

    test("Check Matrixdynamic delete confirm dialog", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "question1",
                "defaultValue": [
                  { "Column 1": 1, "Column 2": 2, "Column 3": 3 },
                  { "Column 1": 4, "Column 2": 5, "Column 3": 5 }
                ],
                "columns": [{ "name": "Column 1" }, { "name": "Column 2" }, { "name": "Column 3" }],
                "choices": [1, 2, 3, 4, 5],
                "confirmDelete": true
              }
            ]
          }
        ]
      });

      const confirmDelete = page.locator(".sv-popup--confirm .sv-popup__container");
      await page.click(".sd-matrixdynamic__remove-btn");
      await compareScreenshot(page, confirmDelete, "matrixdynamic-delete-confirm-dialog.png");
      await page.click("span:text('Cancel')");

      await page.setViewportSize({ width: 375, height: 667 });
      await page.click(".sd-matrixdynamic__remove-btn");
      await compareScreenshot(page, confirmDelete, "matrixdynamic-delete-confirm-dialog-mobile.png");
    });

    test("Check matrixdropdown with showInMultipleColumns", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        "showQuestionNumbers": "off",
        "elements": [
          {
            "type": "matrixdropdown",
            "name": "Feelings",
            "title": "What do your feel?",
            "columns": [
              {
                "name": "col1",
                "cellType": "radiogroup",
                "showInMultipleColumns": true,
                "isRequired": true,
                "choices": [
                  "Strongly disagree",
                  "Disagree",
                  "Neutral",
                  "Agree",
                  "Strongly agree"
                ]
              },
            ],
            "rows": [
              "Excited",
              "Enthusiastic",
              "Open"
            ]
          }
        ]
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-show-in-multiple-columns.png");
    });

    test("Check Matrixdynamic with totals", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            type: "matrixdynamic",
            name: "orderList",
            addRowText: "Add new item",
            columns: [
              {
                name: "phone_model",
                title: "Phone model",
                totalType: "count",
                totalFormat: "Items count: {0}",
              }
            ]
          }
        ]
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdynamic-with-totals.png");
    });

    test("Check Matrixdropdown with totals", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: false,
        elements: [
          {
            "type": "matrixdropdown",
            "name": "question1",
            "columns": [
              {
                "name": "col1",
                "cellType": "text",
                "inputType": "number",
                "defaultValueExpression": "{rowIndex}",
                "totalType": "sum"
              },
              {
                "name": "col2",
                "cellType": "text",
                "inputType": "number",
                "defaultValueExpression": "{rowIndex} + 5",
                "totalType": "sum"
              },
              {
                "name": "col3",
                "cellType": "text",
                "inputType": "number",
                "defaultValueExpression": "{rowIndex} + 10",
                "totalType": "sum"
              }
            ],
            "rows": [
              "Row 1",
              "Row 2",
              "Row 3"
            ],
            "totalText": "Total:"
          }
        ]
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdropdown-with-totals.png");
    });

    test("Check MatrixDynamic totals alignment", async ({ page }) => {
      await page.setViewportSize({ width: 1280, height: 1100 });
      await initSurvey(page, framework, {
        showQuestionNumbers: true,
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "matrixdynamic",
                name: "question1",
                title: "Select Your Coffee",
                columns: [
                  {
                    name: "coffee",
                    title: "Coffee",
                    cellType: "dropdown",
                    isRequired: true,
                    isUnique: true,
                    storeOthersAsComment: true,
                    choices: [
                      { value: "espresso", text: "Espresso", },
                      { value: "ristretto", text: "Ristretto", },
                      { value: "macchiato", text: "Macchiato", },
                    ],
                  },
                  {
                    name: "price",
                    title: "Price",
                    cellType: "expression",
                    expression:
                      "iif({row.coffee} = 'ristretto' or {row.coffee} = 'macchiato' or {row.coffee} = 'cappuchino', '2.5', iif({row.coffee} = 'flatWhite' or {row.coffee} = 'latte', 3, 2))\n",
                  },
                  {
                    name: "amount",
                    title: "Num of Items",
                    cellType: "dropdown",
                    totalType: "sum",
                    choicesMin: 1,
                    choicesMax: 10,
                  },
                  {
                    name: "totalPerRow",
                    title: "Total",
                    cellType: "expression",
                    totalType: "sum",
                    totalDisplayStyle: "currency",
                    totalAlignment: "center",
                    expression: "{row.price} * {row.amount}",
                  },
                ],
                rowCount: 1,
                maxRowCount: 6,
                defaultRowValue: {
                  coffeeItem: "2",
                  coffee: "espresso",
                  price: 2,
                  amount: 1,
                  totalPerRow: 2,
                },
                addRowButtonLocation: "topBottom",
                addRowText: "Add Coffee",
              },
            ],
          },
        ],
      });

      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdropdown-with-totals-alignment.png");
    });

    test("Check matrixdropdown mobile with rating", async ({ page }) => {
      await page.setViewportSize({ width: 600, height: 800 });
      await initSurvey(page, framework, {
        logoPosition: "right",
        pages: [
          {
            name: "page1",
            elements: [
              {
                type: "matrixdropdown",
                name: "q1",
                columns: [
                  {
                    name: "rating",
                    cellType: "rating",
                    rateCount: 10,
                    rateMax: 10,
                    displayMode: "buttons"
                  },
                ],
                rows: ["Row 1", "Row 2", "Row 3"],
              },
            ],
          },
        ],
        widthMode: "responsive",
      });
      const matrixdynamicRoot = page.locator(".sd-question");
      await compareScreenshot(page, matrixdynamicRoot, "matrixdropdown-rating-mobile.png");
    });
  });
});
frameworks.forEach(framework => {
  test.describe(`${framework} ${title} sort bar`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    const sortBarJson = {
      showQuestionNumbers: false,
      elements: [{
        type: "matrixdynamic",
        name: "matrix",
        title: "Products",
        allowSort: true,
        showSortBar: "always",
        rowCount: 0,
        defaultValue: [
          { product: "Lamp", category: "Home", price: 30 },
          { product: "Chair", category: "Home", price: 120 },
          { product: "Pen", category: "Office", price: 2 }
        ],
        columns: [
          { name: "product", title: "Product", cellType: "text" },
          { name: "category", title: "Category", cellType: "text" },
          { name: "price", title: "Price", cellType: "text", inputType: "number" }
        ]
      }]
    };
    // The bar at the end of the title row on a desktop and under the title on a phone, each with the direction list open.
    for (const size of [{ name: "desktop", width: 1000, height: 600 }, { name: "mobile", width: 420, height: 700 }]) {
      test(`Matrixdynamic sort bar, ${size.name}`, async ({ page }) => {
        await page.setViewportSize({ width: size.width, height: size.height });
        await initSurvey(page, framework, sortBarJson);
        await page.getByRole("button", { name: /^Sort field/ }).click();
        await page.locator(".sv-popup__container").filter({ visible: true }).getByRole("menuitemradio", { name: "Price", exact: true }).click();
        await page.getByRole("button", { name: /^Sort order/ }).click();
        await expect(page.locator(".sv-popup__container").filter({ visible: true }).getByRole("menuitemradio", { name: "Low - High", exact: true })).toBeVisible();
        await page.mouse.move(0, 0);
        await compareScreenshot(page, undefined, `matrixdynamic-sort-bar-${size.name}.png`);
      });
    }
    // Two levels at the end of the title row: Sort by, two groups, the remove button of the second one and "+".
    test("Matrixdynamic sort bar with two levels, desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      const json = JSON.parse(JSON.stringify(sortBarJson));
      Object.assign(json.elements[0], { maxSortLevel: 3, sortCriteria: [{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }] });
      await initSurvey(page, framework, json);
      await expect(page.getByRole("button", { name: "Remove sort level 2", exact: true })).toBeVisible();
      await page.mouse.move(0, 0);
      await compareScreenshot(page, undefined, "matrixdynamic-sort-bar-levels-desktop.png");
    });
    // Two levels at the limit of two: "+" stays, disabled.
    test("Matrixdynamic sort bar with a disabled \"+\", desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      const json = JSON.parse(JSON.stringify(sortBarJson));
      Object.assign(json.elements[0], { maxSortLevel: 2, sortCriteria: [{ field: "product", direction: "asc" }, { field: "category", direction: "desc" }] });
      await initSurvey(page, framework, json);
      await expect(page.getByRole("button", { name: "Add sort level", exact: true })).toBeDisabled();
      await page.mouse.move(0, 0);
      await compareScreenshot(page, undefined, "matrixdynamic-sort-bar-add-disabled-desktop.png");
    });
  });
});

frameworks.forEach(framework => {
  test.describe(`${framework} ${title} sort bar: "..." and the sort dialog`, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    // The design's frame: a long title and five sortable columns.
    const moreJson = (sortCriteria: Array<any>): any => ({
      showQuestionNumbers: false,
      elements: [{
        type: "matrixdynamic",
        name: "matrix",
        title: "Health Product - Long Title for Example",
        allowSort: true,
        showSortBar: "always",
        maxSortLevel: 6,
        rowCount: 0,
        sortCriteria: sortCriteria,
        defaultValue: [
          { product: "Syrup Montana", category: "Condiments", price: 22, quantity: "36 boxes", stock: 160 },
          { product: "Chang", category: "Beverages", price: 15, quantity: "12 bottles", stock: 23 },
          { product: "Guarana", category: "Supplements", price: 10, quantity: "8 jars", stock: 0 }
        ],
        columns: [
          { name: "product", title: "Product", cellType: "text" },
          { name: "category", title: "Category", cellType: "text" },
          { name: "price", title: "Price, USD", cellType: "text", inputType: "number" },
          { name: "quantity", title: "Quantity per Unit", cellType: "text" },
          { name: "stock", title: "In Stock", cellType: "text", inputType: "number" },
          { name: "discontinued", title: "Discontinued", cellType: "boolean" }
        ]
      }]
    });
    const headerBar = (page) => page.locator(".sd-question__header .sd-question__sort-bar");
    const moreButton = (page) => page.getByRole("button", { name: "Show all sort levels", exact: true });
    // Three levels at 1280px: the third one is behind "...", which takes the place of "+" after a separator.
    test("Matrixdynamic sort bar with \"...\", desktop", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 600 });
      await initSurvey(page, framework, moreJson([{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }, { field: "price", direction: "asc" }]));
      await expect(moreButton(page)).toBeVisible();
      await expect(headerBar(page)).not.toHaveAttribute("style", /opacity/);
      await page.mouse.move(0, 0);
      await compareScreenshot(page, ".sd-question", "matrixdynamic-sort-bar-more-desktop.png");
    });
    // The dialog with five rows, as in the design: two levels and three rows added with Add New, which stays.
    test("Matrixdynamic sort dialog with five rows", async ({ page }) => {
      await page.setViewportSize({ width: 1000, height: 800 });
      await initSurvey(page, framework, moreJson([{ field: "product", direction: "asc" }, { field: "category", direction: "asc" }]));
      await page.evaluate(() => { (window as any).survey.getQuestionByName("matrix").recordsBar.sortActions.getActionById("sv-sort-more").action(); });
      const dialog = page.locator(".sv-popup--records-sort");
      for (let i = 0; i < 3; i++) {
        await dialog.getByRole("button", { name: "Add New", exact: true }).click();
      }
      await expect(dialog.locator(".sd-sort-dialog__row")).toHaveCount(5);
      await expect(dialog.getByRole("button", { name: "Add New", exact: true })).toBeVisible();
      await resetFocusToBody(page);
      await page.mouse.move(0, 0);
      await compareScreenshot(page, ".sv-popup--records-sort .sv-popup__container", "matrixdynamic-sort-dialog.png");
    });
  });
});

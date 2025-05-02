import { frameworks, url, initSurvey, test, expect } from "../helper";
import { QuestionCheckbox, QuestionText, QuestionRating, QuestionDropdown, QuestionComment } from "../questionHelper";
import { Survey } from "../surveyHelper";

const title = "infinite-loop";

frameworks.forEach((framework) => {
  test.describe(title + " - " + framework, () => {
    test.beforeEach(async ({ page }) => {
      await page.goto(`${url}${framework}`);
    });
    test("Multiple text", async ({ page }) => {
      await initSurvey(page, framework, {
        "questionsOnPageMode": "inputPerPage",
        "elements": [
          { "type": "multipletext",
            "name": "carInfo", "items": [
              { "name": "years", "title": "How long did you drive the car?", "isRequired": true, "inputType": "number" },
              { "name": "design", "title": "How do you like the design?", "isRequired": true, "inputType": "number" },
              { "name": "quality", "title": "How do rate the quality of the car?", "isRequired": true, "inputType": "number" }]
          }]
      });
      await new QuestionText(page, "years").fill("3");
      await new Survey(page).nextPage();
      await new QuestionText(page, "design").fill("4");
      await new Survey(page).nextPage();
      await new QuestionText(page, "quality").fill("5");
      await new Survey(page).complete();
      await new Survey(page).checkData({ carInfo: { years: 3, design: 4, quality: 5 } });
    });
    test("Checkbox vs Matrix dropdown", async ({ page }) => {
      await initSurvey(page, framework, {
        "title": "A list of selected checkboxes generates a list of selected items. Ford, vw, opel, 1, 2, 3",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "checkbox",
                "name": "car",
                "title": "Which cars have you been driven?",
                "isRequired": true,
                "choices": [
                  "Audi",
                  "BMW",
                  "Citroen",
                  "Ford",
                  "Mercedes-Benz",
                  "Nissan",
                  "Peugeot",
                  "Tesla",
                  "Toyota",
                  "Vauxhall",
                  "Volkswagen"
                ],
                "colCount": 3
              },
              {
                "type": "matrixdropdown",
                "name": "carInfo",
                "visibleIf": "{car.length} > 0",
                "title": "Please tell us more about the car you have driven",
                "rowsVisibleIf": "{car} contains {item}",
                "columns": [
                  {
                    "name": "years",
                    "title": "How long did you drive the car?",
                    "cellType": "text",
                    "isRequired": true,
                    "inputType": "number"
                  },
                  {
                    "name": "design",
                    "title": "How do you like the design?",
                    "cellType": "rating",
                    "isRequired": true
                  },
                  {
                    "name": "quality",
                    "title": "How do rate the quality of the car?",
                    "cellType": "rating",
                    "isRequired": true
                  }
                ],
                "rows": [
                  {
                    "value": "Audi",
                    "text": "Please tell us more about Audi"
                  },
                  "BMW",
                  "Citroen",
                  "Ford",
                  "Mercedes-Benz",
                  "Nissan",
                  "Peugeot",
                  "Tesla",
                  "Toyota",
                  "Vauxhall",
                  "Volkswagen"
                ]
              }
            ]
          }
        ],
        "questionsOnPageMode": "inputPerPage"
      });
      await new QuestionCheckbox(page, "car").clickByText("Audi");
      await new QuestionCheckbox(page, "car").clickByText("Ford");
      await new Survey(page).nextPage();
      await new QuestionCheckbox(page, "car").checkQuestionValue(["Audi", "Ford"]);
      await new QuestionText(page, "years").fill("3");
      await new Survey(page).nextPage();
      await new QuestionRating(page, "design").clickItemByText("3");
      await new Survey(page).nextPage();
      await new QuestionRating(page, "quality").clickItemByText("3");
      await new Survey(page).nextPage();
      await new QuestionText(page, "years").fill("5");
      await new Survey(page).nextPage();
      await new QuestionRating(page, "design").clickItemByText("5");
      await new Survey(page).nextPage();
      await new QuestionRating(page, "quality").clickItemByText("5");
      await new Survey(page).checkData({ car: ["Audi", "Ford"], carInfo: { Audi: { years: 3, design: 3, quality: 3 }, Ford: { years: 5, design: 5, quality: 5 } } });
      await new Survey(page).prevPage();
      await new Survey(page).prevPage();
      await new QuestionText(page, "years").fill("4");
      await new Survey(page).nextPage();
      await new QuestionRating(page, "design").clickItemByText("4");
      await new Survey(page).nextPage();
      await new QuestionRating(page, "quality").clickItemByText("4");
      await new Survey(page).complete();
      await new Survey(page).checkData({ car: ["Audi", "Ford"], carInfo: { Audi: { years: 3, design: 3, quality: 3 }, Ford: { years: 4, design: 4, quality: 4 } } });
    });
    test("Panel Dynamic", async ({ page }) => {
      await initSurvey(page, framework, {
        "title": "Open ended list like with https://surveyjs.io/form-library/examples/duplicate-group-of-fields-in-form/reactjs",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "vacation-info",
                "title": "Enter information about your vacations",
                "templateElements": [
                  {
                    "type": "dropdown",
                    "name": "country",
                    "title": "Select a country",
                    "isRequired": true,
                    "defaultDisplayValue": "[not selected]",
                    "choicesByUrl": {
                      "url": "https://surveyjs.io/api/CountriesExample",
                      "valueName": "name"
                    }
                  },
                  {
                    "type": "text",
                    "name": "start-date",
                    "title": "Select a vacation start date",
                    "defaultValueExpression": "today()",
                    "isRequired": true,
                    "inputType": "date"
                  },
                  {
                    "type": "text",
                    "name": "end-date",
                    "title": "Select a vacation end date",
                    "defaultValueExpression": "today(10)",
                    "isRequired": true,
                    "validators": [
                      {
                        "type": "expression",
                        "text": "End date should be greater than start date",
                        "expression": "{panel.start-date} < {panel.end-date}"
                      }
                    ],
                    "inputType": "date"
                  },
                  {
                    "type": "html",
                    "name": "days-spent",
                    "readOnly": true,
                    "html": "<b>Days spent in {panel.country}</b>: {panel.diffdays}"
                  },
                  {
                    "type": "expression",
                    "name": "diffdays",
                    "visible": false,
                    "expression": "iif({panel.start-date} < {panel.end-date}, diffDays({panel.start-date}, {panel.end-date}), 0)"
                  }
                ],
                "templateTitle": "Vacation to {panel.country}, duration {panel.diffdays} days",
                "maxPanelCount": 10,
                "addPanelText": "Add vacation"
              },
              {
                "type": "comment",
                "name": "comments",
                "title": "Please tells us about your best vacation"
              }
            ]
          }
        ],
        "questionsOnPageMode": "inputPerPage"
      });

      await page.getByText("Add vacation").first().click();
      await new QuestionDropdown(page, "country").selectItemByText("Germany");
      await new Survey(page).nextPage();
      await new QuestionText(page, "start-date").fill("2023-01-01");
      await new Survey(page).nextPage();
      await new QuestionText(page, "end-date").fill("2023-01-16");
      await new Survey(page).nextPage();
      await expect(page.getByText("Vacation to Germany, duration 15 days")).toBeVisible();
      await new Survey(page).nextPage();
      await expect(page.getByText("Enter information about your vacations")).toBeVisible();
      await expect(page.getByText("Vacation to Germany, duration 15 days")).toBeVisible();
      await new Survey(page).clicNavigatorButton("Add vacation");
      await new QuestionDropdown(page, "country").selectItemByText("Italy");
      await new Survey(page).nextPage();
      await new QuestionText(page, "start-date").fill("2024-04-04");
      await new Survey(page).nextPage();
      await new QuestionText(page, "end-date").fill("2024-04-12");
      await new Survey(page).nextPage();
      const italyTest = "Vacation to Italy, duration 8 days";
      await expect(page.getByText(italyTest)).toBeVisible();
      await new Survey(page).nextPage();
      await expect(page.getByText("Enter information about your vacations")).toBeVisible();
      await expect(page.getByText("Vacation to Germany, duration 15 days")).toBeVisible();
      await expect(page.getByText(italyTest)).toBeVisible();
      await new Survey(page).checkData({ "vacation-info": [
        { country: "Germany", "start-date": "2023-01-01", "end-date": "2023-01-16", diffdays: 15 },
        { country: "Italy", "start-date": "2024-04-04", "end-date": "2024-04-12", diffdays: 8 }] });
      await page.getByText("Vacation to Germany, duration 15 days").hover();
      await page.getByTitle("Edit").first().click();
      await new Survey(page).nextPage();
      await new Survey(page).nextPage();
      await new QuestionText(page, "end-date").fill("2023-01-26");
      await new Survey(page).nextPage();
      await expect(page.getByText("Vacation to Germany, duration 25 days")).toBeVisible();
      await new Survey(page).nextPage();
      await expect(page.getByText("Enter information about your vacations")).toBeVisible();
      await expect(page.getByText("Vacation to Germany, duration 25 days")).toBeVisible();
      await expect(page.getByText(italyTest)).toBeVisible();
      await new Survey(page).checkData({ "vacation-info": [
        { country: "Germany", "start-date": "2023-01-01", "end-date": "2023-01-26", diffdays: 25 },
        { country: "Italy", "start-date": "2024-04-04", "end-date": "2024-04-12", diffdays: 8 }] });
      await page.getByText(italyTest).hover();
      await page.getByTitle("Remove").last().click();
      await new Survey(page).nextPage();
      await new QuestionComment(page, "comments").fill("My best vacation was in Greece");
      await new Survey(page).complete();
      await new Survey(page).checkData({ "vacation-info": [{ country: "Germany", "start-date": "2023-01-01", "end-date": "2023-01-26" }],
        comments: "My best vacation was in Greece" });
    });
    test("Matrix Dynamic vs PanelDynamic", async ({ page }) => {
      await initSurvey(page, framework, {
        "title": "Employment History (merging answers from several previous questions)",
        "pages": [
          {
            "name": "employers-page",
            "elements": [
              {
                "type": "matrixdynamic",
                "name": "employerNames",
                "title": "Please add your previous and current employers",
                "valueName": "employers",
                "isRequired": true,
                "showHeader": false,
                "columns": [
                  {
                    "name": "employee-name",
                    "cellType": "text",
                    "isRequired": true,
                    "defaultDisplayValue": "[not set]"
                  }
                ],
                "singleInputTitleTemplate": "Employee name: {row.employee-name}",
                "rowCount": 1,
                "minRowCount": 1,
                "addRowText": "Add Employer"
              },
              {
                "type": "paneldynamic",
                "name": "employers_info",
                "title": "Details",
                "valueName": "employers",
                "templateElements": [
                  {
                    "type": "panel",
                    "name": "panel_employer_address",
                    "elements": [
                      {
                        "type": "text",
                        "name": "jobTitle",
                        "title": "Job Title",
                        "titleLocation": "left",
                        "isRequired": true
                      },
                      {
                        "type": "text",
                        "name": "city",
                        "startWithNewLine": false,
                        "title": "City",
                        "titleLocation": "left"
                      },
                      {
                        "type": "comment",
                        "name": "jobDescription",
                        "startWithNewLine": false,
                        "title": "Description",
                        "description": "Describe your achievements. If possible, use numbers/facts (e.g., Achieved X, Measured by Y)",
                        "placeholder": "e.g. Implemented a new digital marketing strategy that increased website traffic by 50% and improved lead generation by 30% over a period of six months.",
                        "autoGrow": true
                      }
                    ]
                  }
                ],
                "templateTitle": "Employer: {panel.employee-name}",
                "allowAddPanel": false,
                "allowRemovePanel": false
              }
            ]
          }
        ],
        "questionsOnPageMode": "inputPerPage"
      });
      await expect(page.getByText("Employee name: [not set]")).toBeVisible();
      await new QuestionText(page, "employee-name").fill("John Doe");
      await page.keyboard.press("Tab");
      const employee1 = "Employee name: John Doe";
      const employeesTitle = "Please add your previous and current employers";
      await expect(page.getByText(employee1)).toBeVisible();
      await new Survey(page).nextPage();
      await expect(page.getByText(employeesTitle)).toBeVisible();
      await expect(page.getByText(employee1)).toBeVisible();
      await new Survey(page).clicNavigatorButton("Add Employer");
      await new QuestionText(page, "employee-name").fill("John Smith");
      await page.keyboard.press("Tab");
      const employee2 = "Employee name: John Smith";
      await new Survey(page).nextPage();
      await expect(page.getByText(employeesTitle)).toBeVisible();
      await expect(page.getByText(employee1)).toBeVisible();
      await expect(page.getByText(employee2)).toBeVisible();
      await new Survey(page).nextPage();

      await expect(page.getByText("Employer: John Doe")).toBeVisible();
      await new QuestionText(page, "jobTitle").fill("Software Engineer");
      await new Survey(page).nextPage();
      await expect(page.getByText("Employer: John Doe")).toBeVisible();
      await new QuestionText(page, "city").fill("New York");
      await new Survey(page).nextPage();
      await new Survey(page).nextPage();
      await expect(page.getByText("Employer: John Smith")).toBeVisible();
      await new QuestionText(page, "jobTitle").fill("Product manager");
      await new Survey(page).nextPage();
      await expect(page.getByText("Employer: John Smith")).toBeVisible();
      await new QuestionText(page, "city").fill("Texas");
      await new Survey(page).nextPage();
      await new QuestionComment(page, "jobDescription").fill("Some text here");
      await new Survey(page).nextPage();

      await expect(page.getByText("Details")).toBeVisible();
      await expect(page.getByText("Employer: John Doe")).toBeVisible();
      await expect(page.getByText("Employer: John Smith")).toBeVisible();

      await new Survey(page).prevPage();
      await expect(page.getByText(employeesTitle)).toBeVisible();
      await new Survey(page).nextPage();
      await expect(page.getByText("Details")).toBeVisible();
      await new Survey(page).complete();
      await new Survey(page).checkData({
        employers: [{ "employee-name": "John Doe", jobTitle: "Software Engineer", city: "New York" },
          { "employee-name": "John Smith", jobTitle: "Product manager", city: "Texas", jobDescription: "Some text here" }] });
    });
    test("Panel Dynamic vs nested Matrix Dynamic", async ({ page }) => {
      await initSurvey(page, framework, {
        "title": "Nested loops (very important):",
        "pages": [
          {
            "name": "page1",
            "elements": [
              {
                "type": "paneldynamic",
                "name": "department",
                "title": "Please list all departments in your company along with their employees",
                "templateElements": [
                  {
                    "type": "text",
                    "name": "name",
                    "title": "Department name",
                    "defaultDisplayValue": "[not set]"
                  },
                  {
                    "type": "matrixdynamic",
                    "name": "employeeList",
                    "title": "Please add employees to the department",
                    "columns": [
                      {
                        "name": "name",
                        "title": "Name",
                        "cellType": "text",
                        "isRequired": true,
                        "defaultDisplayValue": "[not set]"
                      },
                      {
                        "name": "startWorkAt",
                        "title": "Started work at",
                        "cellType": "text",
                        "inputType": "date"
                      }
                    ],
                    "singleInputTitleTemplate": "Employee name: {row.name}",
                    "rowCount": 0,
                    "addRowText": "Add Employee",
                    "removeRowText": "Remove Employee"
                  }
                ],
                "templateTitle": "Department: {panel.name}",
                "panelCount": 1,
                "addPanelText": "Add Department"
              }
            ]
          }
        ],
        "questionsOnPageMode": "inputPerPage"
      });
      await expect(page.getByText("Department: [not set]")).toBeVisible();
      await new QuestionText(page, "name").fill("Sales");
      await page.keyboard.press("Tab");
      const department1 = "Department: Sales";
      const employeesTitle = "Please add employees to the department";
      await expect(page.getByText(department1)).toBeVisible();
      await new Survey(page).nextPage();
      await expect(page.getByText(department1)).toBeVisible();
      await expect(page.getByText(employeesTitle)).toBeVisible();
      await new Survey(page).clicNavigatorButton("Add Employee");
      await expect(page.getByText("Employee name: [not set]")).toBeVisible();
      await new QuestionText(page, "name").fill("Jon Snow");
      await page.keyboard.press("Tab");
      await expect(page.getByText("Employee name: Jon Snow")).toBeVisible();
      await new Survey(page).nextPage();
      await new QuestionText(page, "startWorkAt").fill("2023-05-01");
      await new Survey(page).nextPage();
      await expect(page.getByText(department1)).toBeVisible();
      await expect(page.getByText(employeesTitle)).toBeVisible();
      await expect(page.getByText("Employee name: Jon Snow")).toBeVisible();
      await new Survey(page).clicNavigatorButton("Add Employee");
      await new QuestionText(page, "name").fill("John Doe");
      await new Survey(page).nextPage();
      await new QuestionText(page, "startWorkAt").fill("2024-10-10");
      await new Survey(page).nextPage();
      await expect(page.getByText(department1)).toBeVisible();
      await expect(page.getByText(employeesTitle)).toBeVisible();
      await expect(page.getByText("Employee name: Jon Snow")).toBeVisible();
      await expect(page.getByText("Employee name: John Doe")).toBeVisible();

      await page.getByText(department1).click();
      await expect(page.getByText(department1)).toBeVisible();
      await expect(page.getByText("Department name")).toBeVisible();
      await new Survey(page).nextPage();
      await expect(page.getByText(employeesTitle)).toBeVisible();
      await new Survey(page).nextPage();

      await expect(page.getByText("Please list all departments in your company along with their employees")).toBeVisible();
      await expect(page.getByText(department1)).toBeVisible();
      await new Survey(page).complete();
      await new Survey(page).checkData({ department: [{ name: "Sales", employeeList: [{ name: "Jon Snow", startWorkAt: "2023-05-01" }, { name: "John Doe", startWorkAt: "2024-10-10" }] }] });
    });
  });
});
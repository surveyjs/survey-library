function init() {
  //Add the price property into choices
  Survey.Serializer.addProperty("itemvalue", "price:number");

  var getItemPrice = function (params) {
    //this.row property available in cells of dropdown and dynamic matrices questions
    var question = !!this.row
      ? this.row.getQuestionByColumnName(params[0])
      : null;
    //if we can't find a question inside the cell (by row and column name) then return
    if (!question) return 0;

    //get the selected item/choice
    var selItem = question.selectedItem;
    //return 0 if a user did not select the item yet.
    return !!selItem ? selItem.price : 0;
  };
  //Register the custom function
  Survey.FunctionFactory.Instance.register("getItemPrice", getItemPrice);

  var json = {
    showProgressBar: "both",
    title: "Survey New Design Test",
    logo: "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg",
    logoPosition: "left",
    questions: [
      {
        name: "signature",
        type: "signaturepad",
        title: "Sign here",
        isRequired: true
      },
      {
        name: "name",
        type: "text",
        title: "Text",
        placeHolder: "Jon Snow",
        isRequired: true
      },
      {
        name: "birthdate",
        type: "text",
        inputType: "date",
        title: "Text Date",
        isRequired: true
      },
      {
        name: "color",
        type: "text",
        inputType: "color",
        title: "Text Color"
      },
      {
        name: "email",
        type: "text",
        inputType: "email",
        title: "Text Email",
        placeHolder: "jon.snow@nightwatch.org",
        isRequired: true,
        validators: [
          {
            type: "email"
          }
        ]
      },
      {
        type: "dropdown",
        name: "cars",
        title: "Dropdown",
        isRequired: true,
        showNoneItem: true,
        colCount: 4,
        choices: [
          "Ford",
          "Vauxhall",
          "Volkswagen",
          "Nissan",
          "Audi",
          "Mercedes-Benz",
          "BMW",
          "Peugeot",
          "Toyota",
          "Citroen"
        ]
      },
      {
        type: "checkbox",
        name: "car",
        title: "Checkbox",
        showSelectAllItem: true,
        isRequired: true,
        showNoneItem: true,
        colCount: 4,
        choices: [
          "Ford",
          "Vauxhall",
          "Volkswagen",
          "Nissan",
          "Audi",
          "Mercedes-Benz",
          "BMW",
          "Peugeot",
          "Toyota",
          "Citroen"
        ]
      },
      {
        type: "radiogroup",
        name: "carss",
        title: "Radiogroup",
        isRequired: true,
        colCount: 4,
        choices: [
          "None",
          "Ford",
          "Vauxhall",
          "Volkswagen",
          "Nissan",
          "Audi",
          "Mercedes-Benz",
          "BMW",
          "Peugeot",
          "Toyota",
          "Citroen"
        ]
      },
      {
        type: "image",
        name: "banner",
        imageHeight: "300px",
        imageWidth: "450px",
        imageLink:
          "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
      },
      {
        type: "imagepicker",
        name: "choosepicture",
        title: "Imagepicker",
        imageHeight: "150px",
        imageWidth: "225px",
        choices: [
          {
            value: "lion",
            imageLink:
              "https://surveyjs.io/Content/Images/examples/image-picker/lion.jpg"
          },
          {
            value: "giraffe",
            imageLink:
              "https://surveyjs.io/Content/Images/examples/image-picker/giraffe.jpg"
          },
          {
            value: "panda",
            imageLink:
              "https://surveyjs.io/Content/Images/examples/image-picker/panda.jpg"
          },
          {
            value: "camel",
            imageLink:
              "https://surveyjs.io/Content/Images/examples/image-picker/camel.jpg"
          }
        ]
      },
      {
        type: "boolean",
        name: "bool",
        title: "Boolean",
        label: "Are you 21 or older?",
        isRequired: true
      },
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
      {
        type: "matrix",
        name: "planningPerformance",
        title: "Matrix Rubric",
        columns: [
          "Ineffective",
          "Improvement Necessary",
          "Effective",
          "Highly Effective"
        ],
        rows: [
          {
            value: "dataToPlan",
            text: "Utilizes Assessment Data to Plan"
          },
          {
            value: "ambitiousGoals",
            text: "Ambitious and Measurable Achievement Goal"
          },
          {
            value: "developsStandards",
            text:
              "Develops Standards.<br/>Based Unit Plans and Assessments.<br/>Evaluation Values."
          },
          {
            value: "createsObjective",
            text: "Creates Objective - Driven Lesson Plans and Assessments"
          }
        ],
        cells: {
          dataToPlan: {
            Ineffective:
              "Teacher rarely or never uses formal and informal assessment data when planning",
            "Improvement Necessary":
              "Teacher uses formal and informal assessment data to formulate <br/> - Achievement goals, unit plans, or lesson plans, but not all of these",
            Effective:
              "Teacher uses formal and informal assessment data to formulate <br/>- Achievement goals, unit plans, and lesson plans",
            "Highly Effective":
              "Teacher uses formal and informal assessment data to formulate achievement goals, unit plans, and lesson plans<br/>- Incorporates differentiated instructional strategies in planning to reach every student at his/her level of understanding"
          },
          ambitiousGoals: {
            Ineffective:
              "Teacher rarely or never develops achievement goals for the class, or goals are developed but are too general to be helpful for planning purposes",
            "Improvement Necessary":
              "Teacher develops an annual student achievement goalthat lacks one or more of these traits:<br/>- Measurable<br/>- Aligned to content standards<br/>- Includes benchmarks to help monitor learning and inform interventions throughout the year",
            Effective:
              "Teacher develops an annual student achievement goal that<br/>- Is measurable<br/>- Is aligned to content standards<br/>- Includes benchmarks to help monitor learning and inform interventions throughout the year",
            "Highly Effective":
              "Teacher develops an annual student achievement goal that<br/>- Is measurable<br/>- Is aligned to content standards where applicable<br/>- Includes benchmarks to help monitor learning and informinterventions throughout the year"
          },
          developsStandards: {
            Ineffective:
              "Teacher rarely or never plans by identifying content standards that students will master in each unit, or there is little to no evidence that teacher plans units at all",
            "Improvement Necessary":
              "Based on achievement goals, teacher plans units but omits one or more of these steps:<br/>- Identifying content standards that students will master in each unit<br/>- Creating assessments before planning units<br/>- Allocating an instructionally appropriate amount of time for each unit",
            Effective:
              "Based on achievement goals, teacher plans units by<br/>- Identifying content standards that students will master in each unit<br/>- Creating assessments before each unit begins for backwards planning<br/>- Allocating an instructionally appropriate amount of time for each unit",
            "Highly Effective":
              "Based on achievement goals, teacher plans units by<br/>- Identifying content standards that students will master in each unit<br/>- Creating assessments before each unit begins for backwards planning<br/>- Allocating an instructionally appropriate amount of time for each unit"
          },
          createsObjective: {
            Ineffective:
              "Teacher rarely or never uses a system to track student assessment/progress data and/or has an ineffective grading system",
            "Improvement Necessary":
              "Teacher uses a data tracking system to record student assessment / progress data and maintain a grading system but fails in one or more of the following steps<br/>- Use data to analyze student progress toward mastery or to plan future lessons / units<br/>- Have a grading system that appropriately aligns with student learning goals",
            Effective:
              "Teacher uses an effective data tracking system for<br/>- Recording student assessment / progress data<br/>- Analyzing student progress towards mastery and planning future lessons/units accordingly<br/>- Maintaining a grading system aligned to student learning goals",
            "Highly Effective":
              "Teacher uses an effective data tracking system that<br/>- Records student assessment / progress data<br/>- Analyzes student progress toward mastery and plans future lessons/units accordingly<br/>- Maintains a grading system aligned to student learning goals"
          }
        }
      },
      {
        type: "matrix Dropdown",
        name: "frameworksRate",
        title: "Matrixdropdown",
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
      {
        type: "matrixdynamic",
        name: "Current Level of Function",
        title: "Matrix Dynamic (vertical columns)",
        columnLayout: "vertical",
        minRowCount: 1,
        maxRowCount: 5,
        columns: [
          {
            name: "Date",
            title: "Date",
            cellType: "text",
            inputType: "date"
          },
          {
            name: "AmbDistance",
            title: "Amb Distance",
            cellType: "text"
          },
          {
            name: "Amb Assistance",
            cellType: "dropdown",
            choices: ["D", "MAX", "MOD", "MIN"]
          },
          {
            name: "Standing Tolerance",
            cellType: "text"
          },
          {
            name: "UE Strength",
            cellType: "text"
          },
          {
            name: "Cognitive Function",
            cellType: "comment"
          }
        ],
        choices: [1],
        cellType: "comment",
        confirmDelete: true,
        addRowText: "Add Date +",
        removeRowText: "Remove"
      },
      {
        type: "matrixdynamic",
        name: "orderList",
        rowCount: 1,
        minRowCount: 1,
        title: "Matrix Dynamic (totals)",
        addRowText: "Add new item",
        columns: [
          {
            name: "id",
            title: "Id",
            cellType: "expression",
            expression: "{rowIndex}"
          },
          {
            name: "phone_model",
            title: "Phone model",
            isRequired: true,
            totalType: "count",
            totalFormat: "Items count: {0}",
            choices: [
              {
                value: "iPhone7-32",
                text: "iPhone 7, 32GB",
                price: 449
              },
              {
                value: "iPhone7-128",
                text: "iPhone 7, 128GB",
                price: 549
              },
              {
                value: "iPhone7Plus-32",
                text: "iPhone 7 Plus, 32GB",
                price: 569
              },
              {
                value: "iPhone7Plus-128",
                text: "iPhone 7 Plus, 128GB",
                price: 669
              },
              {
                value: "iPhone8-64",
                text: "iPhone 8, 64GB",
                price: 599
              },
              {
                value: "iPhone8-256",
                text: "iPhone 8, 256GB",
                price: 749
              },
              {
                value: "iPhone8Plus-64",
                text: "iPhone 8 Plus, 64GB",
                price: 699
              },
              {
                value: "iPhone8Plus-256",
                text: "iPhone 8 Plus, 256GB",
                price: 849
              },
              {
                value: "iPhoneXR-64",
                text: "iPhone XR, 64GB",
                price: 749
              },
              {
                value: "iPhoneXR-128",
                text: "iPhone XR, 128GB",
                price: 799
              },
              {
                value: "iPhoneXR-256",
                text: "iPhone XR, 256GB",
                price: 899
              },
              {
                value: "iPhoneXS-64",
                text: "iPhone XS, 64GB",
                price: 999
              },
              {
                value: "iPhoneXS-256",
                text: "iPhone XS, 256GB",
                price: 1149
              },
              {
                value: "iPhoneXS-512",
                text: "iPhone XS, 512GB",
                price: 1349
              },
              {
                value: "iPhoneXSMAX-64",
                text: "iPhone XS Max, 64GB",
                price: 1099
              },
              {
                value: "iPhoneXSMAX-256",
                text: "iPhone XS Max, 256GB",
                price: 1249
              },
              {
                value: "iPhoneXSMAX-512",
                text: "iPhone XS, 512GB",
                price: 1449
              }
            ]
          },
          {
            name: "price",
            title: "Price",
            cellType: "expression",
            expression: "getItemPrice('phone_model')",
            displayStyle: "currency"
          },
          {
            name: "quantity",
            title: "Quantity",
            isRequired: true,
            cellType: "text",
            inputType: "number",
            totalType: "sum",
            totalFormat: "Total phones: {0}",
            validators: [
              {
                type: "numeric",
                minValue: 1,
                maxValue: 100
              }
            ]
          },
          {
            name: "total",
            title: "Total",
            cellType: "expression",
            expression: "{row.quantity} * {row.price}",
            displayStyle: "currency",
            totalType: "sum",
            totalDisplayStyle: "currency",
            totalFormat: "Total: {0}"
          }
        ]
      },
      {
        name: "vatProcents",
        type: "text",
        title: "VAT (in %)",
        defaultValue: 20,
        inputType: "number",
        validators: [
          {
            type: "numeric",
            minValue: 0,
            maxValue: 40
          }
        ]
      },
      {
        name: "vatTotal",
        type: "expression",
        title: "VAT",
        expression: "{orderList-total.total} * {vatProcents} / 100",
        displayStyle: "currency",
        startWithNewLine: false
      },
      {
        name: "total",
        type: "expression",
        title: "Total",
        expression: "{orderList-total.total} + {vatTotal}",
        displayStyle: "currency",
        startWithNewLine: false
      },
      {
        type: "multipletext",
        name: "pricelimit",
        title: "Multipletext",
        colCount: 2,
        items: [
          {
            name: "mostamount",
            title: "Most amount you would every pay for a product like ours"
          },
          {
            name: "leastamount",
            title: "The least amount you would feel comfortable paying"
          }
        ]
      },
      {
        type: "rating",
        name: "satisfaction",
        title: "Rating",
        minRateDescription: "Not Satisfied",
        maxRateDescription: "Completely satisfied"
      },
      {
        type: "comment",
        name: "suggestions",
        title: "Comment"
      },
      {
        type: "file",
        title: "File",
        name: "image",
        storeDataAsText: false,
        showPreview: true,
        imageWidth: 150,
        maxSize: 102400
      },
      {
        type: "panel",
        title: "Panel",
        innerIndent: 1,
        elements: [
          {
            type: "checkbox",
            choices: [
              {
                value: "1",
                text: "Customer relationship"
              },
              {
                value: "2",
                text: "Service quality"
              },
              {
                value: "3",
                text: "Support response time"
              }
            ],
            name: "What should be improved?"
          },
          {
            type: "comment",
            name: "suggestions",
            title: "What would make you more satisfied with the Product?"
          }
        ]
      },
      {
        type: "paneldynamic",
        name: "relatives",
        title: "Panel Dynamic",
        renderMode: "progressTop",
        templateTitle: "Information about: {panel.relativeType}",
        templateElements: [
          {
            name: "relativeType",
            type: "dropdown",
            title: "Relative",
            choices: [
              "father",
              "mother",
              "brother",
              "sister",
              "son",
              "daughter"
            ],
            isRequired: true
          },
          {
            name: "isalive",
            type: "radiogroup",
            title: "Alive?",
            startWithNewLine: false,
            isRequired: true,
            colCount: 0,
            choices: ["Yes", "No"]
          },
          {
            name: "liveage",
            type: "dropdown",
            title: "Age",
            isRequired: true,
            startWithNewLine: false,
            visibleIf: "{panel.isalive} = 'Yes'",
            choicesMin: 1,
            choicesMax: 115
          },
          {
            name: "deceasedage",
            type: "dropdown",
            title: "Deceased Age",
            isRequired: true,
            startWithNewLine: false,
            visibleIf: "{panel.isalive} = 'No'",
            choices: [
              {
                value: -1,
                text: "Unknown"
              }
            ],
            choicesMin: 1,
            choicesMax: 115
          },
          {
            name: "causeofdeathknown",
            type: "radiogroup",
            title: "Cause of Death Known?",
            isRequired: true,
            colCount: 0,
            startWithNewLine: false,
            visibleIf: "{panel.isalive} = 'No'",
            choices: ["Yes", "No"]
          },
          {
            name: "causeofdeath",
            type: "text",
            title: "Cause of Death",
            isRequired: true,
            startWithNewLine: false,
            visibleIf:
              "{panel.isalive} = 'No' and {panel.causeofdeathknown} = 'Yes'"
          },
          {
            type: "panel",
            name: "moreInfo",
            state: "expanded",
            title: "Detail Information about: {panel.relativeType}",
            elements: [
              {
                type: "matrixdynamic",
                name: "relativeillness",
                title: "Describe the illness or condition.",
                rowCount: 0,
                columns: [
                  {
                    name: "illness",
                    cellType: "dropdown",
                    title: "Illness/Condition",
                    choices: [
                      "Cancer",
                      "Heart Disease",
                      "Diabetes",
                      "Stroke/TIA",
                      "High Blood Pressure",
                      "High Cholesterol or Triglycerides",
                      "Liver Disease",
                      "Alcohol or Drug Abuse",
                      "Anxiety, Depression or Psychiatric Illness",
                      "Tuberculosis",
                      "Anesthesia Complications",
                      "Genetic Disorder",
                      "Other – describe"
                    ],
                    isRequired: true
                  },
                  {
                    name: "description",
                    cellType: "text",
                    title: "Describe",
                    isRequired: true
                  }
                ]
              }
            ]
          }
        ],
        panelCount: 2,
        panelAddText: "Add a blood relative",
        panelRemoveText: "Remove the relative"
      },
      {
        type: "panel",
        title: "Expression Example Panel",
        innerIndent: 1,
        elements: [
          {
            type: "paneldynamic",
            name: "items",
            title: "Items",
            keyName: "name",
            showQuestionNumbers: "none",
            templateTitle: "item #{panelIndex}",
            templateElements: [
              {
                type: "text",
                name: "name",
                title: "Name:",
                isRequired: true
              },
              {
                type: "text",
                name: "cost",
                inputType: "number",
                title: "Item Cost:",
                isRequired: true,
                startWithNewLine: false
              },
              {
                type: "text",
                name: "vendor",
                title: "Vendor:",
                isRequired: true
              },
              {
                type: "text",
                name: "quantity",
                inputType: "number",
                title: "Quantity:",
                isRequired: true,
                startWithNewLine: false
              },
              {
                type: "text",
                name: "link",
                title: "Link:",
                isRequired: true
              },
              {
                type: "expression",
                name: "total",
                title: "Total Item Cost:",
                expression: "{panel.cost} * {panel.quantity}",
                displayStyle: "currency",
                currency: "EUR",
                startWithNewLine: false
              }
            ],
            minPanelCount: 1,
            panelAddText: "Add another  item",
            panelRemoveText: "Remove item"
          },
          {
            type: "panel",
            title: "Totals",
            elements: [
              {
                type: "expression",
                name: "totalQuantity",
                title: "Total  Quantity:",
                expression: "sumInArray({items}, 'quantity'"
              },
              {
                type: "expression",
                name: "totalCost",
                title: "Total Cost:",
                expression: "sumInArray({items}, 'total'",
                displayStyle: "currency",
                currency: "EUR",
                startWithNewLine: false
              }
            ]
          }
        ]
      }
    ]
  };

  //Survey.StylesManager.applyTheme("default");
  //Survey.StylesManager.applyTheme("modern");
  Survey.StylesManager.applyTheme("defaultV2");

  var model = new Survey.Model(json);
  window.survey = model;

  function onAngularComponentInit() {
    Survey.SurveyNG.render("surveyElement", { model: model });
  }
  var HelloApp = ng.core
    .Component({
      selector: "ng-app",
      template:
        '<div id="surveyContainer" class="survey-container contentcontainer codecontainer">' +
        '<div id="surveyElement"></div></div>'
    })
    .Class({
      constructor: function () { },
      ngOnInit: function () {
        onAngularComponentInit();
      }
    });
  document.addEventListener("DOMContentLoaded", function () {
    ng.platformBrowserDynamic.bootstrap(HelloApp);
  });
}

if (!window["%hammerhead%"]) {
  init();
}
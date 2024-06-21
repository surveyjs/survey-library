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
    "title": "Patient intake form",
    "logoPosition": "right",
    "pages": [
      {
        "name": "personal-information",
        "elements": [
          {
            "type": "text",
            "name": "first-name",
            "title": "First name"
          },
          {
            "type": "text",
            "name": "last-name",
            "startWithNewLine": false,
            "title": "Last name"
          },
          {
            "type": "dropdown",
            "name": "nationality",
            "title": "Nationality",
            "choices": [
              "Item 1",
              "Item 2",
              "Item 3"
            ],
            "choicesByUrl": {
              "url": "https://surveyjs.io/api/CountriesExample"
            }
          },
          // {
          //   "type": "text",
          //   "name": "ssn",
          //   "visibleIf": "{nationality} = 'United States'",
          //   "startWithNewLine": false,
          //   "title": "Social security number",
          //   "description": "You SSN must be a 9-digit number.",
          //   "descriptionLocation": "underInput",
          //   "inputType": "number",
          //   "min": 9,
          //   "max": 9
          // },
          {
            "type": "text",
            "name": "birthday",
            "title": "Date of birth",
            "inputType": "date"
          },
          // {
          //   "type": "boolean",
          //   "name": "driving-license",
          //   "visibleIf": "age({birthday}) >= 16",
          //   "startWithNewLine": false,
          //   "title": "Do you drive have a driving license?"
          // },
          // {
          //   "type": "dropdown",
          //   "name": "driving-experience",
          //   "visibleIf": "age({birthday}) >= 16",
          //   "startWithNewLine": false,
          //   "title": "How many years of driving experience do you have?",
          //   "choices": [
          //     {
          //       "value": "Item 1",
          //       "text": "Less than a year"
          //     },
          //     {
          //       "value": "Item 2",
          //       "text": "1-5 years"
          //     },
          //     {
          //       "value": "Item 4",
          //       "text": "Over 5 years"
          //     }
          //   ]
          // }
        ],
        // "title": "Personal information"
      },
      // {
      //   "name": "contact-information-page",
      //   "elements": [
      //     {
      //       "type": "multipletext",
      //       "name": "contact-information",
      //       "titleLocation": "hidden",
      //       "items": [
      //         {
      //           "name": "address",
      //           "inputType": "tel",
      //           "title": "Address"
      //         },
      //         {
      //           "name": "email",
      //           // "isRequired": true,
      //           "inputType": "email",
      //           "title": "Email address"
      //         },
      //         {
      //           "name": "phone-number",
      //           // "isRequired": true,
      //           "title": "Phone number"
      //         }
      //       ],
      //       "itemTitleWidth": "130"
      //     },
      //     {
      //       "type": "radiogroup",
      //       "name": "provide-emergency-contact",
      //       "title": "Would you like to provide your emergency contact?",
      //       "choices": [
      //         {
      //           "value": "yes",
      //           "text": "Yes"
      //         },
      //         {
      //           "value": "no",
      //           "text": "No"
      //         }
      //       ]
      //     },
      //     {
      //       "type": "paneldynamic",
      //       "name": "emergency-contact",
      //       "title": "Emergency contact information",
      //       "enableIf": "{provide-emergency-contact} = 'yes'",
      //       "templateElements": [
      //         {
      //           "type": "text",
      //           "name": "full-name",
      //           "title": "Full name",
      //           "requiredIf": "{provide-emergency-contact} = 'yes'"
      //         },
      //         {
      //           "type": "text",
      //           "name": "relationship",
      //           "startWithNewLine": false,
      //           "title": "Relationship"
      //         },
      //         {
      //           "type": "text",
      //           "name": "phone-number",
      //           "title": "Phone number",
      //           "inputType": "tel",
      //           "autocomplete": "tel"
      //         },
      //         {
      //           "type": "text",
      //           "name": "address",
      //           "startWithNewLine": false,
      //           "title": "Address"
      //         }
      //       ],
      //       "templateTabTitle": "{panelIndex} Primary Emergency Contact",
      //       "panelCount": 1,
      //       "minPanelCount": 1,
      //       "maxPanelCount": 2,
      //       "panelAddText": "Add 2nd Primary Emergency Contact",
      //       "renderMode": "tab"
      //     },
      //     {
      //       "type": "checkbox",
      //       "name": "order-receipt",
      //       "title": "Where would you like us to send the order receipt?",
      //       "choices": [
      //         {
      //           "value": "phone-number",
      //           "text": "Phone number"
      //         },
      //         {
      //           "value": "email",
      //           "text": "Email"
      //         },
      //         {
      //           "value": "no-receipt",
      //           "text": "No receipt"
      //         }
      //       ]
      //     },
      //     {
      //       "type": "text",
      //       "name": "receipt-phone-number",
      //       "title": "Text receipt to:",
      //       "titleLocation": "left",
      //       "resetValueIf": "{order-receipt} notcontains 'phone-number'",
      //       "setValueIf": "{order-receipt} anyof ['phone-number']",
      //       "setValueExpression": "{contact-information.phone-number}",
      //       "inputType": "tel"
      //     },
      //     {
      //       "type": "text",
      //       "name": "receipt-email",
      //       "startWithNewLine": false,
      //       "title": "Email receipt to:",
      //       "titleLocation": "left",
      //       "resetValueIf": "{order-receipt} notcontains 'email'",
      //       "setValueIf": "{order-receipt} anyof ['email']",
      //       "setValueExpression": "{contact-information.email}",
      //       "inputType": "email"
      //     }
      //   ],
      //   "title": "Contact information"
      // }
    ],
    "triggers": [
      {
        "type": "skip",
        "expression": "{nationality} <> 'United States'",
        "gotoName": "birthday"
      }
    ],
    "showQuestionNumbers": "off",
    "completeText": "Submit",
    // "questionsOnPageMode": "singlePage",
    "widthMode": "static",
    "width": "1000",
    "showPreviewBeforeComplete": "showAllQuestions"
  };

  //Survey.StylesManager.applyTheme("default");
  //Survey.StylesManager.applyTheme("modern");
  // Survey.StylesManager.applyTheme("defaultV2");

  var model = new Survey.Model(json);
  // model.mode = "display";
  model.data = {
    "first-name": "John",
    "last-name": "Smith",
    "nationality": "United States",
    "birthday": "1982-10-16"
  };
  //model.setDesignMode(true);
  window.survey = model;

  model.onUploadFiles
    .add(function (survey, options) {
      options.callback("success", options.files.map(function (file) {
        return {
          file: file,
          content: "https://surveyjs.io/Content/Images/design/Logo.svg"
        };
      }));
    });

  ReactDOM.render(
    <SurveyReact.Survey model={model} />,
    document.getElementById("surveyElement")
  );
}

if (!window["%hammerhead%"]) {
  init();
}
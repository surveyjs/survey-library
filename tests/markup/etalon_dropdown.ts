import { _setIsTouch, Question, settings } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [
    {
      name: "Test Dropdown question markup",
      json: {
        questions: [
          {
            "type": "dropdown",
            "renderAs": "select",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown"
    },
    {
      name: "Test Dropdown question markup Show options caption false",
      json: {
        questions: [
          {
            "type": "dropdown",
            "renderAs": "select",
            "name": "name",
            "title": "Question title",
            "showOptionsCaption": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown-show"
    },
    {
      name: "Test Dropdown question markup Other option",
      json: {
        questions: [
          {
            "type": "dropdown",
            "renderAs": "select",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            "hasOther": true,
            "defaultValue": "other",
            "otherText": "Other (describe)",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown-other"
    },
    {
      name: "Test Dropdown question renderAs select markup Read only",
      json: {
        mode: "display",
        questions: [
          {
            "type": "dropdown",
            "renderAs": "select",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown-renderAs-select-readonly"
    },
    {
      name: "Test Dropdown question renderAs select Readonly selected",
      json: {
        mode: "display",
        questions: [
          {
            "type": "dropdown",
            "renderAs": "select",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            "defaultValue": "item1",
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown-renderAs-select-readonly-selected"
    },
    {
      name: "Test Dropdown question markup Read only",
      json: {
        mode: "display",
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown-readonly"
    },
    {
      name: "Test Dropdown question markup Read only with value",
      json: {
        mode: "display",
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            defaultValue: "item1",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "dropdown-readonly-with-value"
    },
    {
      name: "Test Dropdown Select question markup",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "allowClear": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden",
          }
        ]
      },
      snapshot: "dropdown-select",
    }, {
      name: "Test Dropdown Select question markup - touch",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "allowClear": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden",
          }
        ]
      },
      before: () => {
        _setIsTouch(true);
      },
      after: () => {
        _setIsTouch(false);
      },
      snapshot: "dropdown-select-mobile",
    },
    {
      name: "Test Dropdown Select question with clear button markup",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden",
            defaultValue: "item1",
          }
        ]
      },
      snapshot: "dropdown-select-clear-button",
    },
    {
      name: "Test Dropdown question with markdown markup",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "defaultValue": "cat",
            "choices": [
              {
                "value": "dog",
                "text": "Dog: ![A dog](https://surveyjs.io/Content/Images/examples/markdown/dog.svg =14x14)"
              }, {
                "value": "cat",
                "text": "Cat: ![A cat](https://surveyjs.io/Content/Images/examples/markdown/cat.svg =14x14)"
              }, {
                "value": "parrot",
                "text": "Parrot ![A parrot](https://surveyjs.io/Content/Images/examples/markdown/parrot.svg =14x14)"
              }
            ],
            titleLocation: "hidden",
          }
        ]
      },
      snapshot: "dropdown-with-markdown",
    },
    {
      name: "Test Dropdown question with other selected item",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "showOtherItem": true,
            "defaultValue": "other",
            "choices": [
              "Ford",
              "Vauxhall",
              "Volkswagen",
            ],
            titleLocation: "hidden",
          }
        ]
      },
      snapshot: "dropdown-with-other-value",
    },
    {
      name: "Test Dropdown question with none selected item",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "showNoneItem": true,
            "defaultValue": "none",
            "choices": [
              "Ford",
              "Vauxhall",
              "Volkswagen",
            ],
            titleLocation: "hidden",
          }
        ]
      },
      snapshot: "dropdown-with-none-value",
    },
    {
      name: "Test Dropdown question input string",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "searchEnabled": true,
            "choices": [
              "Ford",
              "Vauxhall",
              "Volkswagen",
            ],
            titleLocation: "hidden",
          }
        ]
      },
      initSurvey: (survey) => {
        survey.focusFirstQuestionAutomatic = false;
        survey.getQuestionByName("name")["popupModel"];
        survey.getQuestionByName("name")["dropdownListModel"].inputStringRendered = "o";
      },
      timeout: 300,
      removeIds: true,
      snapshot: "dropdown-input-string",
    },
    {
      name: "Test Dropdown question without textWrapEnabled",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "textWrapEnabled": false,
            "choices": [
              "Ford",
              "Vauxhall",
              "Volkswagen",
            ],
            titleLocation: "hidden",
          }
        ]
      },
      initSurvey: (survey) => {
        survey.focusFirstQuestionAutomatic = false;
        survey.getQuestionByName("name")["popupModel"];
        survey.getQuestionByName("name")["dropdownListModel"].inputStringRendered = "o";
      },
      timeout: 300,
      removeIds: true,
      snapshot: "dropdown-without-textWrapEnabled",
    },
    {
      name: "Test Dropdown question input focused",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "searchEnabled": true,
            "choices": [
              "Ford",
              "Vauxhall",
              "Volkswagen",
            ],
            titleLocation: "hidden",
          }
        ]
      },
      initSurvey: (survey) => {
        survey.focusFirstQuestionAutomatic = false;
        survey.getQuestionByName("name")["popupModel"];
        survey.getQuestionByName("name")["dropdownListModel"].focused = true;
      },
      timeout: 300,
      removeIds: true,
      snapshot: "dropdown-input-focused",
    },
    {
      name: "Test dropdown aria-expanded",
      json: {
        questions: [
          {
            "type": "dropdown",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      before: () => {
        Question["questionCounter"] = 100; },
      initSurvey: (survey) => {
        const dropdown = survey.getQuestionByName("name");
        dropdown["popupModel"].isVisible = true;
      },
      snapshot: "dropdown-aria-expanded"
    }
  ]
);
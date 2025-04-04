import { _setIsTouch, _setIsTablet, ListModel } from "survey-core";
import { registerMarkupTests } from "./helper";

let oldMinCount = 0;

registerMarkupTests(
  [
    {
      name: "Test Tagbox question markup",
      json: {
        questions: [
          {
            "type": "tagbox",
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
      removeIds: true,
      snapshot: "tagbox"
    },
    {
      name: "Test Tagbox question markup - touch",
      json: {
        questions: [
          {
            "type": "tagbox",
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
        _setIsTouch(true);
        _setIsTablet(true);
        oldMinCount = ListModel.MINELEMENTCOUNT;
        ListModel.MINELEMENTCOUNT = 2;
      },
      after: () => {
        _setIsTouch(false);
        _setIsTablet(undefined);
        ListModel.MINELEMENTCOUNT = oldMinCount;
      },
      removeIds: true,
      snapshot: "tagbox-mobile"
    }, {
      name: "Test Tagbox question markup",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            defaultValue: "item1",
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-selected"
    }, {
      name: "Test Tagbox question markup Read only",
      json: {
        mode: "display",
        questions: [
          {
            "type": "tagbox",
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
      snapshot: "tagbox-readonly"
    }, {
      name: "Test Tagbox question markup Read only with value",
      json: {
        mode: "display",
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "defaultValue": ["item1", "item3"],
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      snapshot: "tagbox-readonly-with-value"
    }, {
      name: "Test Tagbox question markup disabled with value",
      json: {
        questions: [
          {
            "type": "tagbox",
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
      removeIds: true,
      initSurvey: (survey) => survey.setDesignMode(true),
      snapshot: "tagbox-disabled-with-value"
    }, {
      name: "Test Tagbox question without clear button markup",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "allowClear": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-without-clear-button",
    },
    {
      name: "Test Tagbox question without textWrapEnabled",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "textWrapEnabled": false,
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-without-textWrapEnabled"
    },
    {
      name: "Test Tagbox question searchEnabled false markup",
      json: {
        questions: [
          {
            "type": "tagbox",
            "name": "name",
            "title": "Question title",
            "searchEnabled": "false",
            "choices": [
              "item1",
              "item2",
              "item3"
            ],
            titleLocation: "hidden"
          }
        ]
      },
      removeIds: true,
      snapshot: "tagbox-without-search",
    },
  ]);
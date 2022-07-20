import { StylesManager } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test radiogroup question markup",
    json: {
      questions: [
        {
          "type": "radiogroup",
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
    snapshot: "radiogroup",
  },
  {
    name: "Test radiogroup question markup Other option",
    json: {
      questions: [
        {
          "type": "radiogroup",
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
    snapshot: "radiogroup-other",
  },
  {
    name: "Test radiogroup question markup Read only",
    json: {
      mode: "display",
      questions: [
        {
          "type": "radiogroup",
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
    snapshot: "radiogroup-readonly",
  },
  {
    name: "Test radiogroup question Readonly selected",
    json: {
      mode: "display",
      questions: [
        {
          "type": "radiogroup",
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
    snapshot: "radiogroup-readonly-selected",
  },
  {
    name: "Test radiogroup V2 theme",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    snapshot: "radiogroup-v2",
  },
  {
    name: "Test radiogroup modern theme",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    before: () => StylesManager.applyTheme("modern"),
    after: () => StylesManager.applyTheme("default"),
    snapshot: "radiogroup-modern",
  },
  {
    name: "Test radiogroup clear button",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "radiogroup-clear",
  },
  {
    name: "Test radiogroup columns",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 2,
          "choices": [
            "item1",
            "item2"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "radiogroup-columns",
  },
  {
    name: "Test radiogroup columns in mobile mode",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 2,
          "isMobile": true,
          "choices": [
            "item1",
            "item2",
            "item3"
          ],
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "radiogroup-columns-mobile",
    initSurvey: survey => survey.setIsMobile(true),
  },
  {
    name: "Test radiogroup columns with header and footer",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 2,
          "choices": [
            "item1",
            "item2"
          ],
          hasNone: true,
          hasOther: true,
          titleLocation: "hidden",
          separateSpecialChoices: true
        }
      ]
    },
    snapshot: "radiogroup-columns-head-foot",
  },
  {
    name: "Test radiogroup columns with no header and footer",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 2,
          "choices": [
            "item1",
            "item2"
          ],
          hasNone: true,
          hasOther: true,
          separateSpecialChoices: false,
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "radiogroup-columns-no-head-foot",
  },
  {
    name: "Test radiogroup row with header and footer",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 0,
          "choices": [
            "item1",
            "item2"
          ],
          hasNone: true,
          hasOther: true,
          titleLocation: "hidden",
          separateSpecialChoices: true
        }
      ]
    },
    snapshot: "radiogroup-row-head-foot",
  },
  {
    name: "Test radiogroup row with no header and footer",
    json: {
      questions: [
        {
          "type": "radiogroup",
          "name": "name",
          "title": "Question title",
          "showClearButton": true,
          "colCount": 0,
          "choices": [
            "item1",
            "item2"
          ],
          hasNone: true,
          hasOther: true,
          separateSpecialChoices: false,
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "radiogroup-row-no-head-foot",
  }
  ]
);
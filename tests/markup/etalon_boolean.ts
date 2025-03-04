import { settings } from "survey-core";
import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test Boolean question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "boolean",
  },
  {
    name: "Test Boolean question markup: Readonly",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "boolean-readonly",
  },
  {
    name: "Test Boolean question markup: Disabled",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "boolean-disabled",
    initSurvey: (survey) => survey.setDesignMode(true),
  },
  {
    name: "Test Boolean question markup Default V2",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "boolean-v2",
  },
  {
    name: "Test Boolean question markup with value Default V2",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          defaultValue: true,
          title: "Question title",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "boolean-value-v2",
  },
  {
    name: "Test Boolean Checkbox question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: "true",
          renderAs: "checkbox"
        }
      ]
    },

    snapshot: "boolean-checkbox-defaultV2",
  },
  {
    name: "Test Boolean Checkbox question markup: Readonly",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          readOnly: true,
          title: "Question title",
          titleLocation: "hidden",
          defaultValue: "true",
          renderAs: "checkbox"
        }
      ]
    },

    snapshot: "boolean-checkbox-readonly-defaultV2",
  },
  {
    name: "Test Boolean Checkbox question markup: Disabled",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "checkbox"
        }
      ]
    },
    snapshot: "boolean-checkbox-disabled",
    initSurvey: (survey) => survey.setDesignMode(true),
  },
  {
    name: "Test Boolean Checkbox defaultV2",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "checkbox"
        }
      ]
    },
    snapshot: "boolean-checkbox",
  },
  {
    name: "Test Boolean Checkbox question markup - use svgIcon",
    json: {
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "checkbox"
        }
      ]
    },
    initSurvey: survey => {
      survey.css = { boolean: { svgIconId: "#test-icon" } };
      survey.getAllQuestions()[0].updateElementCss();
    },
    snapshot: "boolean-checkbox-custom-icon",
  },
  {
    name: "Test Boolean Radio question markup",
    json: {
      questions: [
        {
          name: "name",
          defaultValue: true,
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "radio"
        }
      ]
    },
    snapshot: "boolean-radio",
  },
  {
    name: "Test Boolean question Radio markup Default V2",
    json: {
      questions: [
        {
          name: "name",
          defaultValue: false,
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-v2",

  },
  {
    name: "Test Boolean Radio with true/false values question markup",
    json: {
      questions: [
        {
          name: "name",
          defaultValue: true,
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          "valueTrue": "true_val",
          "valueFalse": "false_val",
          renderAs: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-values",
  },
  {
    name: "Test Boolean Radio question markup: Readonly",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-readonly",
  },
  {
    name: "Test Boolean Radio question markup: Disabled",
    json: {
      mode: "display",
      questions: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          renderAs: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-disabled",
    initSurvey: (survey) => survey.setDesignMode(true),
  },
  ]
);
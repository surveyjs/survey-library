import { StylesManager } from "survey-core";
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    snapshot: "boolean-checkbox-defaultV2",
  },
  {
    name: "Test Boolean Checkbox question markup",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
    snapshot: "boolean-checkbox-disabled-defaultV2",
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
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
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
  ]
);
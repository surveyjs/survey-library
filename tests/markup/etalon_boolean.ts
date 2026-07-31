import { registerMarkupTests } from "./helper";

registerMarkupTests(
  [{
    name: "Test Boolean question markup",
    json: {
      elements: [
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
      elements: [
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
      elements: [
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
      elements: [
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
      elements: [
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
      elements: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          useTitleAsLabel: true,
          defaultValue: "true",
          displayMode: "checkbox"
        }
      ]
    },

    snapshot: "boolean-checkbox-defaultV2",
  },
  {
    name: "Test Boolean Checkbox question markup: Required",
    json: {
      elements: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          useTitleAsLabel: true,
          isRequired: true,
          displayMode: "checkbox"
        },
      ]
    },
    snapshot: "boolean-checkbox-defaultV2-required",
  },
  {
    name: "Test Boolean Checkbox question markup: Readonly",
    json: {
      elements: [
        {
          name: "name",
          type: "boolean",
          readOnly: true,
          title: "Question title",
          useTitleAsLabel: true,
          defaultValue: "true",
          displayMode: "checkbox"
        }
      ]
    },

    snapshot: "boolean-checkbox-readonly-defaultV2",
  },
  {
    name: "Test Boolean Checkbox question markup: Disabled",
    json: {
      mode: "display",
      elements: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          useTitleAsLabel: true,
          displayMode: "checkbox"
        }
      ]
    },
    snapshot: "boolean-checkbox-disabled",
    initSurvey: (survey) => survey.setDesignMode(true),
  },
  {
    name: "Test Boolean Checkbox defaultV2",
    json: {
      elements: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          useTitleAsLabel: true,
          displayMode: "checkbox"
        }
      ]
    },
    snapshot: "boolean-checkbox",
  },
  {
    name: "Test Boolean Checkbox question markup - use svgIcon",
    json: {
      elements: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          useTitleAsLabel: true,
          displayMode: "checkbox"
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
      elements: [
        {
          name: "name",
          defaultValue: true,
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          displayMode: "radio"
        }
      ]
    },
    snapshot: "boolean-radio",
  },
  {
    name: "Test Boolean question Radio markup Default V2",
    json: {
      elements: [
        {
          name: "name",
          defaultValue: false,
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          displayMode: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-v2",

  },
  {
    name: "Test Boolean Radio with true/false values question markup",
    json: {
      elements: [
        {
          name: "name",
          defaultValue: "true_val",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          "valueTrue": "true_val",
          "valueFalse": "false_val",
          displayMode: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-values",
  },
  {
    name: "Test Boolean Radio question markup: Readonly",
    json: {
      mode: "display",
      elements: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          displayMode: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-readonly",
  },
  {
    name: "Test Boolean Radio question markup: Disabled",
    json: {
      mode: "display",
      elements: [
        {
          name: "name",
          type: "boolean",
          title: "Question title",
          titleLocation: "hidden",
          displayMode: "radio"
        }
      ]
    },
    snapshot: "boolean-radio-disabled",
    initSurvey: (survey) => survey.setDesignMode(true),
  },
  {
    name: "Test Boolean Switch question markup: defaultValue true",
    json: {
      elements: [
        {
          type: "boolean",
          name: "q1",
          useTitleAsLabel: true,
          defaultValue: true,
          displayMode: "switch"
        }
      ]
    },
    snapshot: "boolean-switch-value-true",
  },
  {
    name: "Test Boolean Switch question markup: defaultValue false",
    json: {
      elements: [
        {
          type: "boolean",
          name: "q1",
          useTitleAsLabel: true,
          defaultValue: false,
          displayMode: "switch"
        }
      ]
    },
    snapshot: "boolean-switch-value-false",
  },
  {
    name: "Test Boolean Switch question markup: defaultValue true, readOnly",
    json: {
      elements: [
        {
          type: "boolean",
          name: "q1",
          useTitleAsLabel: true,
          defaultValue: true,
          readOnly: true,
          displayMode: "switch"
        }
      ]
    },
    snapshot: "boolean-switch-value-true-readonly",
  },
  {
    name: "Test Boolean Switch question markup: defaultValue false, readOnly",
    json: {
      elements: [
        {
          type: "boolean",
          name: "q1",
          useTitleAsLabel: true,
          defaultValue: false,
          readOnly: true,
          displayMode: "switch"
        }
      ]
    },
    snapshot: "boolean-switch-value-false-readonly",
  },
  {
    name: "Test Boolean Switch question markup: useTitleAsLabel is true by default",
    json: {
      elements: [
        {
          type: "boolean",
          name: "q1",
          title: "Question title",
          displayMode: "switch"
        }
      ]
    },
    snapshot: "boolean-switch-title-as-label",
  },
  {
    name: "Test Boolean Switch question markup: useTitleAsLabel is false",
    json: {
      elements: [
        {
          type: "boolean",
          name: "q1",
          title: "Question title",
          displayMode: "switch",
          useTitleAsLabel: false
        }
      ]
    },
    snapshot: "boolean-switch-no-label",
  },
  ]
);
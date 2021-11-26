import { StylesManager } from "../../src/stylesmanager";
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
          renderAs: "checkbox"
        }
      ]
    },
    snapshot: "boolean-checkbox",
  },
  ]
);
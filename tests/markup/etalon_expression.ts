import { StylesManager } from "survey-core";
import { registerMarkupTest } from "./helper";

registerMarkupTest(
  {
    name: "Test Expression question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "expression",
          expression: "123",
          titleLocation: "hidden"
        }
      ]
    },
    snapshot: "expression",
    removeIds: true,
    before: () => StylesManager.applyTheme("defaultV2"),
    after: () => StylesManager.applyTheme("default"),
  });
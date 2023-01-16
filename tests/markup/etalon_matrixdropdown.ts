import { registerMarkupTests } from "./helper";
import { StylesManager } from "survey-core";

registerMarkupTests(
  [
    {
      name: "Test matrixdropdown with showInMultipleColumns",
      json: {
        elements: [
          {
            titleLocation: "hidden",
            type: "matrixdropdown",
            name: "matrix",
            rows: ["row1"],
            columns: [
              {
                "name": "col1",
                "cellType": "radiogroup",
                "showInMultipleColumns": true,
                "isRequired": true,
                "choices": [
                  "Item 1",
                ]
              },
              {
                "name": "col2",
                "cellType": "checkbox",
                "showInMultipleColumns": true,
                "isRequired": true,
                "choices": [
                  "Item 1",
                  "Item 2",
                ]
              }
            ]
          },
        ],
      },
      before: () => StylesManager.applyTheme("defaultV2"),
      after: () => StylesManager.applyTheme("default"),
      snapshot: "matrixdynamic-show-in-multiple-columns"
    }
  ]
);


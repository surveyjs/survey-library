import { settings } from "../../src/settings";
import { StylesManager } from "../../src/stylesmanager";
import { registerMarkupTests } from "./helper";
export * from "./etalon_image";
export * from "./etalon_text";
export * from "./etalon_dropdown";
export * from "./etalon_checkbox";
export * from "./etalon_radiogroup";
export * from "./etalon_imagepicker";
export * from "./etalon_comment";
export * from "./etalon_boolean";
export * from "./etalon_rating";
export * from "./etalon_multipletext";
export * from "./etalon_file";
export { markupTests } from "./helper";

registerMarkupTests([
  // #region HTML question
  {
    name: "Test HTML question markup",
    json: {
      questions: [
        {
          name: "name",
          type: "html",
          html: "HTML content here",
          title: "Question title",
        }
      ]
    },
    etalon: "<div>HTML content here</div>"
  },
]);
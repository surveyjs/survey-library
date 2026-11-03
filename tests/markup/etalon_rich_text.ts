import { registerMarkupTests } from "./helper";

registerMarkupTests([
  {
    name: "Test rich text comment markup",
    json: {
      elements: [
        {
          type: "comment",
          name: "name",
          title: "Question title",
          titleLocation: "hidden",
          textFormat: "markdown",
          placeholder: "Type and format text"
        }
      ]
    },
    snapshot: "rich-text-comment"
  }
]);

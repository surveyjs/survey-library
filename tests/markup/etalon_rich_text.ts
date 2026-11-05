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
  },
  {
    name: "Test rich text comment read-only markup",
    json: {
      elements: [{
        type: "comment", name: "name", title: "Question title", titleLocation: "hidden",
        textFormat: "markdown", readOnly: true, defaultValue: "**bold**"
      }]
    },
    snapshot: "rich-text-readonly"
  },
  {
    name: "Test rich text comment display markup",
    json: {
      mode: "display",
      elements: [{
        type: "comment", name: "name", title: "Question title", titleLocation: "hidden",
        textFormat: "markdown", defaultValue: "**bold**"
      }]
    },
    snapshot: "rich-text-display"
  },
  {
    name: "Test rich text comment disabled markup",
    json: {
      elements: [{
        type: "comment", name: "name", title: "Question title", titleLocation: "hidden",
        textFormat: "markdown", enableIf: "false", defaultValue: "**bold**"
      }]
    },
    snapshot: "rich-text-disabled"
  },
  {
    name: "Test rich text comment source mode markup",
    json: {
      elements: [{
        type: "comment", name: "name", title: "Question title", titleLocation: "hidden",
        textFormat: "html", defaultValue: "<p style=\"color:red\">Red</p>"
      }]
    },
    snapshot: "rich-text-source"
  },
  {
    name: "Test rich text comment html format markup",
    json: {
      elements: [{
        type: "comment", name: "name", title: "Question title", titleLocation: "hidden",
        textFormat: "html"
      }]
    },
    snapshot: "rich-text-html"
  },
  {
    name: "Test rich text comment inline markup",
    json: {
      elements: [{
        type: "comment", name: "name", title: "Question title", titleLocation: "hidden",
        textFormat: "markdown", acceptCarriageReturn: false
      }]
    },
    snapshot: "rich-text-inline"
  }
]);

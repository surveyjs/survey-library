// Class names for the rich text question. The question keeps the comment theme
// classes (getCssType is "comment") and these names are added beside them.
// Wrappers read them from question.cssClasses. They are not part of core defaultCss.
export const richTextCss = {
  editor: "sd-rich-text",
  area: "sd-rich-text__area",
  display: "sd-rich-text__content",
  toolbar: "sd-rich-text__toolbar",
  footer: "sd-action-bar sd-action-bar--small-size",
  footerSpace: "sd-action-bar__item--space",
  source: "sd-rich-text sd-rich-text--source",
  notice: "sd-rich-text__notice",
  editAnyway: "sd-rich-text__edit-anyway",
  toolbarNone: "sd-rich-text--toolbar-none",
  toolbarOnFocus: "sd-rich-text--toolbar-on-focus",
  toolbarOnSelection: "sd-rich-text--toolbar-on-selection",
  toolbarStatic: "sd-rich-text--toolbar-static",
  toolbarOpen: "sd-rich-text--toolbar-open",
  grip: "sd-rich-text__grip"
};

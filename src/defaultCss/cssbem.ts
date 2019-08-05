import { surveyCss } from "./cssstandard";
export var bemCss = {
  root: "sv-main sv_default_css",
  header: "sv-header",
  body: "sv-body",
  bodyEmpty: "sv-body sv-body--empty",
  footer: "sv-container__sv-footer sv-footer",
  navigationButton: "",
  completedPage: "sv-completed-page",
  navigation: {
    complete: "sv-btn sv-footer__sv-btn-complete",
    prev: "sv-btn sv-footer__sv-btn-prev",
    next: "sv-btn sv-footer__sv-btn-next",
    start: "sv-btn sv-footer__sv-btn-start"
  },
  progress: "sv-progress",
  progressBar: "sv-progress__bar",
  page: {
    root: "sv-page__root",
    title: "sv-page__title",
    description: "sv-page__description"
  },
  row: "sv-page__row sv-row",
  question: {
    mainRoot: "sv-question sv-page__sv-question",
    flowRoot: "sv-question sv-page__sv-question sv-page__sv-question--flow",
    titleLeftRoot: "",
    titleContainer: "sv-question__title-container",
    title: "sv-question__title",
    number: "sv-question__num",
    description: "sv-question__description",
    comment: "sv-question__comment",
    required: "sv-question--required",
    titleRequired: "sv-question__title--required",
    hasError: "sv-question--has-error",
    indent: 20,
    footer: "sv-question__footer"
  },
  error: {
    root: "sv-erbox",
    icon: "",
    item: "",
    locationTop: "sv-erbox_location_top",
    locationBottom: "sv-erbox_location_bottom"
  },
  checkbox: {
    root: "sv-select-base",
    item: "sv-item sv-select-base__item",
    label: "sv-label sv-select-base__label",
    itemControl: " sv-checkbox sv-item__control",
    controlLabel: "sv-item__control-label",
    materialDecorator: "",
    other: "",
    column: "sv-select-base__column"
  },
  radiogroup: {
    root: "sv-select-base",
    item: "sv-item sv-select-base__item",
    label: "sv-label sv-select-base__label",
    itemControl: "sv-radio sv-item__control",
    controlLabel: "sv-item__control-label",
    materialDecorator: "",
    other: "",
    clearButton: "",
    column: "sv-select-base__column"
  },
  text: "sv-question__text",
  window: {
    root: "sv-window",
    body: "sv-content",
    header: {
      root: "sv-window__title",
      title: "",
      button: "",
      buttonExpanded: "",
      buttonCollapsed: ""
    }
  }
};

surveyCss["bem"] = bemCss;

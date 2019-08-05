import { surveyCss } from "./cssstandard";
export var bemCss = {
  root: "sv-main",
  header: "sv-header",
  body: "sv-body",
  bodyEmpty: "sv-body sv-body--empty",
  footer: "sv-container__sv-footer sv-footer",
  navigationButton: "",
  completedPage: "sv-completed-page",
  navigation: {
    complete: "sv-btn sv-footer__btn-complete",
    prev: "sv-btn sv-footer__btn-prev",
    next: "sv-btn sv-footer__btn-next",
    start: "sv-btn sv-footer__btn-start"
  },
  progress: "sv-progress",
  progressBar: "sv-progress__bar",
  page: {
    root: "sv-page__root",
    title: "sv-page__title",
    description: "sv-page__description"
  },
  pageTitle: "sv-page__title",
  pageDescription: "sv-page__description",
  row: "sv-page__row sv-row",
  question: {
    mainRoot: "sv-question sv-row__question",
    flowRoot: "sv-question sv-row__question sv-row__question--flow",
    content: "sv-question__content",
    titleLeftRoot: "",
    titleContainer: "sv-question__title-container",
    titleOnError: "sv-question__title-container--error",
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
    root: "",
    icon: "",
    item: "",
    locationTop: "sv-question__erbox sv-erbox--location--top",
    locationBottom: "sv-question__erbox --location--bottom"
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
  text: "sv-question__text"
};

surveyCss["bem"] = bemCss;

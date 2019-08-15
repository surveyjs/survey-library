import { surveyCss } from "./cssstandard";
export var bemCss = {
  root: "sv-main",
  header: "sv-title sv-container__title",
  body: "sv-body",
  bodyEmpty: "sv-body sv-body--empty",
  footer: "sv-container__sv-footer sv-footer",
  navigationButton: "",
  completedPage: "sv-completed-page",
  navigation: {
    complete: "sv-btn sv-footer__btn--location--right",
    prev: "sv-btn sv-footer__btn--location--left",
    next: "sv-btn sv-footer__btn--location--right",
    start: "sv-btn sv-footer__btn--location--right"
  },
  progress: "sv-progress",
  progressBar: "sv-progress__bar",
  page: {
    root: "sv-page__root",
    title: "sv-page__title",
    description: "sv-page__description"
  },
  pageTitle: "sv-title sv-page__title",
  pageDescription: "sv-page__description",
  row: "sv-page__row sv-row",
  question: {
    mainRoot: "sv-question sv-row__question",
    flowRoot: "sv-question sv-row__question sv-row__question--flow",
    asCell: "sv-table__cell sv-question--cell",
    content: "sv-question__content",
    titleLeftRoot: "",
    titleContainer: "sv-question__title-container",
    title: "sv-title sv-question__title",
    number: "sv-question__num",
    description: "sv-question__description",
    comment: "sv-question__comment",
    required: "sv-question--required",
    titleRequired: "sv-question__title--required",
    hasError: "sv-question--has-error",
    hasAnswer: "sv-question--has-answer",
    indent: 20,
    footer: "sv-question__footer"
  },
  error: {
    root: "",
    icon: "",
    item: "",
    locationTop: "sv-question__erbox sv-erbox--location--top",
    locationBottom: "sv-question__erbox sv-question__erbox--location--bottom"
  },
  checkbox: {
    root: "sv-select-base",
    item: "sv-select-base__item",
    itemInline: "sv-select-base__item--inline",
    label: "sv-select-base__label",
    itemControl: "sv-check-item sv-checkbox  sv-select-base__control",
    controlLabel: "sv-select-base__control-label",
    materialDecorator: "",
    other: "",
    column: "sv-select-base__column"
  },
  radiogroup: {
    root: "sv-select-base",
    item: "sv-item sv-select-base__item",
    itemInline: "sv-select-base__item--inline",
    label: "sv-select-base__label",
    itemControl: "sv-check-item sv-radio sv-select-base__control",
    controlLabel: "sv-select-base__control-label",
    materialDecorator: "",
    other: "",
    clearButton: "",
    column: "sv-select-base__column"
  },
  text: {
    root: "sv-text sv-question__input",
    small: "sv-row__question--small"
  },
  dropdown: {
    small: "sv-row__question--small",
    root: "",
    control: "sv-dropdown sv-question__input",
    selectWrapper: "",
    other: "sv_q_dd_other"
  },
  matrixdropdown: {
    root: "sv-table sv-matrix-dropdown",
    cell: "sv-table__cell",
    headerCell: "sv-table__cell sv-table__cell--header"
  },
  matrix: {
    root: "sv-table",
    cell: "sv-table__cell",
    headerCell: "sv-table__cell sv-table__cell--header",
    itemValue: " sv-check-item sv-radio sv-matrix__control",
    cellText: "sv-matrix__cell-text",
    cellTextSelected: "sv-matrix__cell-text--selected"
  }
};

surveyCss["bem"] = bemCss;

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
  panel: {
    title: "",
    description: "",
    container: ""
  },
  progress: "sv-progress",
  progressBar: "sv-progress__bar",
  page: {
    root: "sv-page sv-body__page",
    title: "sv-page__title",
    description: "sv-page__description"
  },
  pageTitle: "sv-title sv-page__title",
  pageDescription: "sv-page sv-page__description",
  row: "sv-row",
  question: {
    mainRoot: "sv-question sv-row__question",
    flowRoot: "sv-question sv-row__question sv-row__question--flow",
    asCell: "sv-table__cell sv-question--cell",
    content: "sv-question__content",
    titleLeftRoot: "",
    titleContainer: "sv-question__title-container",
    title: "sv-title sv-question__title",
    number: "sv-question__num",
    description: "sv-description sv-question__description",
    comment: "sv-question__comment",
    required: "sv-question--required",
    titleRequired: "sv-question__title--required",
    hasError: "sv-question--has-error",
    hasAnswer: "sv-question--has-answer",
    indent: 20,
    footer: "sv-question__footer",
    scroll: "sv-scroll"
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
    item: "sv-checkbox sv-select-base__item",
    itemInline: "sv-select-base__item--inline",
    label: "sv-select-base__label",
    itemControl: "sv-checkbox__control",
    itemDecorator: "sv-checkbox__decorator sv-select-base__control",
    controlLabel: "sv-select-base__control-label",
    materialDecorator: "",
    other: "",
    column: "sv-select-base__column"
  },
  radiogroup: {
    root: "sv-select-base",
    item: "sv-radio sv-select-base__item",
    itemInline: "sv-select-base__item--inline",
    label: "sv-select-base__label",
    itemControl: "sv-radio__control",
    itemDecorator: "sv-radio__decorator sv-select-base__control",
    controlLabel: "sv-select-base__control-label",
    materialDecorator: "",
    other: "",
    clearButton: "sv-btn",
    column: "sv-select-base__column"
  },
  boolean: {
    root: "sv-select-base",
    item: "sv-select-base__item",
    control: "sv-boolean__control",
    yesMark: "sv-boolean__yes-mark",
    noMark: "sv-boolean__no-mark",
    undefinedMark: "sv-boolean__undefined-mark",
    itemDecorator: "sv-boolean__decorator sv-select-base__control",
    label: "sv-boolean sv-select-base__control-label",
    materialDecorator: "checkbox-material"
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
  imagepicker: {
    root: "sv-imagepicker",
    item: "sv-imagepicker__item",
    itemInline: "sv-imagepicker__item--inline",
    label: "",
    itemControl: "sv-imagepicker__control",
    image: "sv-imagepicker__image",
    itemText: "sv-imagepicker__text",
    clearButton: "sv-btn"
  },
  matrix: {
    root: "sv-table",
    cell: "sv-table__cell",
    headerCell: "sv-table__cell sv-table__cell--header",
    label: "sv-radio sv-matrix__label",
    itemValue: " sv-radio__control",
    itemDecorator: "sv-radio__decorator sv-matrix__control ",
    cellText: "sv-matrix__cell-text",
    cellTextSelected: "sv-matrix__cell-text--selected",
    scroll: "sv-scroll"
  },
  matrixdropdown: {
    root: "sv-table sv-matrix-dropdown",
    cell: "sv-table__cell",
    headerCell: "sv-table__cell sv-table__cell--header"
  },
  matrixdynamic: {
    root: "sv-table sv-matrixdynamic",
    cell: "sv-table__cell",
    headerCell: "sv-table__cell sv-table__cell--header",
    button: "sv-btn",
    buttonAdd: "sv-matrixdynamic__btn--add",
    buttonRemove: "sv-matrixdynamic__btn--remove",
    iconAdd: "",
    iconRemove: "",
    scroll: "sv-scroll"
  },
  rating: {
    root: "sv-rating",
    item: "sv-rating__item",
    selected: "sv-rating__item--selected",
    minText: "sv-rating__min-text",
    itemText: "sv-rating__item-text",
    maxText: "sv-rating__max-text",
    disabled: "sv-rating--disabled"
  },
  expression: "",
  file: {
    root: "",
    placeholderInput: "",
    preview: "",
    removeButton: "",
    fileInput: "",
    removeFile: ""
  },
  saveData: {
    root: "",
    saving: "",
    error: "",
    success: "",
    saveAgainButton: ""
  },
  window: {
    root: "",
    body: "",
    header: {
      root: "",
      title: "",
      button: "",
      buttonExpanded: "",
      buttonCollapsed: ""
    }
  }
};

surveyCss["bem"] = bemCss;

import { surveyCss } from "./cssstandard";
export var bemCss = {
  root: "sv-root-bem",
  container: "sv-container-bem",
  header: "sv-title sv-container__title",
  body: "sv-body",
  bodyEmpty: "sv-body sv-body--empty",
  footer: "sv-footer sv-body__footer",
  navigationButton: "",
  completedPage: "sv-completed-page",
  navigation: {
    complete: "sv-btn sv-footer__complete-btn",
    prev: "sv-btn sv-footer__prev-btn",
    next: "sv-btn sv-footer__next-btn",
    start: "sv-btn sv-footer__start-btn"
  },
  panel: {
    title: "sv-title sv-panel__title",
    titleExpandable: "sv-panel__title--expandable",
    description: "sv-description sv-panel__description",
    container: "sv-panel sv-row__panel",
    icon: "sv-panel__icon",
    iconExpanded: "sv-panel__icon--expanded"
  },
  paneldynamic: {
    navigation: "sv-paneldynamic__navigation",
    title: "sv-title sv-question__title",
    button: "sv-btn",
    buttonRemove: "sv-paneldynamic__remove-btn",
    buttonAdd: "sv-paneldynamic__add-btn",
    progressTop: "sv-paneldynamic__progress sv-paneldynamic__progress--top",
    progressBottom:
      "sv-paneldynamic__progress sv-paneldynamic__progress--bottom",
    buttonPrev: "sv-paneldynamic__prev-btn",
    buttonNext: "sv-paneldynamic__next-btn",
    progressContainer: "sv-paneldynamic__progress-container",
    progress: "sv-progress",
    progressBar: "sv-progress__bar",
    progressText: "sv-paneldynamic__progress-text"
  },
  progress: "sv-progress sv-body__progress",
  progressBar: "sv-progress__bar",
  progressText: "sv-progress__text",
  page: {
    root: "sv-page sv-body__page",
    title: "sv-page__title",
    description: "sv-description sv-page__description"
  },
  pageTitle: "sv-title sv-page__title",
  pageDescription: "sv-description sv-page__description",
  row: "sv-row",
  question: {
    mainRoot: "sv-question sv-row__question",
    flowRoot: "sv-question sv-row__question sv-row__question--flow",
    asCell: "sv-table__cell",
    header: "sv-question__header",
    headerLeft: "sv-question__header--left",
    headerTop: "sv-question__header--top",
    headerBottom: "sv-question__header--bottom",
    content: "sv-question__content",
    contentLeft: "sv-question__content--left",
    titleLeftRoot: "",
    titleOnAnswer: "sv-question__title--answer",
    titleOnError: "sv-question__title--error",
    title: "sv-title sv-question__title",
    number: "sv-question__num",
    description: "sv-description sv-question__description",
    comment: "sv-comment",
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
    root: "sv-selectbase",
    item: "sv-item sv-checkbox sv-selectbase__item",
    itemInline: "sv-selectbase__item--inline",
    label: "sv-selectbase__label",
    itemControl: "sv-visuallyhidden sv-item__control sv-checkbox__control",
    itemDecorator: "sv-item__svg sv-checkbox__svg",
    controlLabel: "sv-item__control-label",
    materialDecorator: "sv-item__decorator sv-checkbox__decorator",
    other: "sv-comment",
    column: "sv-selectbase__column"
  },
  radiogroup: {
    root: "sv-selectbase",
    item: "sv-item sv-radio sv-selectbase__item",
    itemInline: "sv-selectbase__item--inline",
    label: "sv-selectbase__label",
    itemControl: "sv-visuallyhidden sv-item__control sv-radio__control",
    itemDecorator: "sv-item__svg sv-radio__svg",
    controlLabel: "sv-item__control-label",
    materialDecorator: "sv-item__decorator sv-radio__decorator",
    other: "sv-comment",
    clearButton: "sv-btn sv-selectbase__clear-btn",
    column: "sv-selectbase__column"
  },
  boolean: {
    root: "sv-selectbase",
    item: "sv-item sv-boolean sv-selectbase__label",
    control: "sv-visuallyhidden sv-item__control sv-boolean__control",
    checkedMark: "sv-boolean__checked-path",
    uncheckedMark: "sv-boolean__unchecked-path",
    undefinedMark: "sv-boolean__undefined-path",
    itemDecorator: "sv-item__svg  sv-boolean__svg",
    label: "sv-item__control-label",
    materialDecorator: "sv-item__decorator sv-boolean__decorator "
  },
  text: {
    root: "sv-text",
    small: "sv-row__question--small",
    onError: "sv-text--error"
  },
  multipletext: {
    root: "sv-multipletext",
    item: "sv-multipletext__item",
    itemTitle: "sv-multipletext__item-title",
    row: "sv-multipletext__row",
    cell: "sv-multipletext__cell"
  },
  dropdown: {
    root: "",
    small: "sv-row__question--small",
    control: "sv-dropdown",
    selectWrapper: "",
    other: "sv-comment",
    onError: "sv-dropdown--error"
  },
  imagepicker: {
    root: "sv-imagepicker",
    item: "sv-imagepicker__item",
    itemInline: "sv-imagepicker__item--inline",
    label: "sv-imagepicker__label",
    itemControl: "sv-imagepicker__control",
    image: "sv-imagepicker__image",
    itemText: "sv-imagepicker__text",
    clearButton: "sv-btn"
  },
  matrix: {
    root: "sv-table",
    cell: "sv-table__cell sv-matrix__cell",
    headerCell: "sv-table__cell sv-table__cell--header",
    label: "sv-item sv-radio sv-matrix__label",
    itemValue: "sv-visuallyhidden sv-item__control sv-radio__control",
    materialDecorator: "sv-item__decorator sv-radio__decorator",
    itemDecorator: "sv-item__svg sv-radio__svg",
    cellText: "sv-matrix__cell-text",
    cellTextSelected: "sv-matrix__cell-text--selected"
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
    buttonAdd: "sv-matrixdynamic__add-btn",
    buttonRemove: "sv-matrixdynamic__remove-btn",
    iconAdd: "",
    iconRemove: ""
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
  comment: {
    root: "sv-comment",
    small: "sv-row__question--small"
  },
  expression: "",

  file: {
    root: "sv-file",
    placeholderInput: "sv-visuallyhidden",
    preview: "sv-file__preview",
    highlighted: "sv-file--highlighted",
    fileDecorator: "sv-file__decorator",
    fileInput: "sv-visuallyhidden",
    noFileChosen: "sv-description sv-file__no-file-chosen",
    chooseFile: "sv-btn sv-file__choose-btn",
    disabled: "sv-file__choose-btn--disabled",
    removeButton: "sv-btn sv-file__clean-btn",
    removeFile: "sv-file__remove-file"
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

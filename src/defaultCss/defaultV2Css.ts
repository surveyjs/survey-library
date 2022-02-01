import { surveyCss } from "./cssstandard";

export var defaultV2Css = {
  root: "sd-root-modern",
  container: "sd-container-modern",
  header: "sd-title sd-container-modern__title",
  body: "sd-body",
  bodyEmpty: "sd-body sd-body--empty",
  footer: "sd-footer sd-body__navigation sd-clearfix",
  title: "sd-title",
  description: "sd-description",
  logo: "sd-logo",
  logoImage: "sd-logo__image",
  headerText: "sd-header__text",
  navigationButton: "",
  completedPage: "sd-completedpage",
  navigation: {
    complete: "sd-btn sd-btn--action sd-navigation__complete-btn",
    prev: "sd-btn sd-navigation__prev-btn",
    next: "sd-btn sd-navigation__next-btn",
    start: "sd-btn sd-navigation__start-btn",
    preview: "sd-btn sd-navigation__preview-btn",
    edit: "sd-btn sd-navigation__edit-btn"
  },
  panel: {
    title: "sd-title sd-panel__title",
    titleExpandable: "sd-element__title--expandable",
    titleExpanded: "sd-element__title--expanded",
    titleCollapsed: "sd-element__title--collapsed",
    titleOnExpand: "sd-panel__title--expanded",
    titleOnError: "sd-panel__title--error",
    description: "sd-description sd-panel__description",
    container: "sd-element sd-element--complex sd-panel sd-row__panel",
    withFrame: "sd-element--with-frame",
    content: "sd-panel__content",
    icon: "sd-panel__icon",
    iconExpanded: "sd-panel__icon--expanded",
    footer: "sd-panel__footer",
    requiredText: "sd-panel__required-text",
    header: "sd-panel__header sd-element__header sd-element__header--location-top",
    collapsed: "sd-element--collapsed",
    nested: "sd-element--nested",
    invisible: "sd-element--invisible"
  },
  paneldynamic: {
    mainRoot: "sd-element  sd-question sd-question--paneldynamic sd-element--complex sd-question--complex sd-row__question",
    empty: "sd-question--empty",
    root: "sd-paneldynamic",
    navigation: "sd-paneldynamic__navigation",
    title: "sd-title sd-question__title",
    button: "sd-action sd-paneldynamic__btn",
    buttonRemove: "sd-action--negative sd-paneldynamic__remove-btn",
    buttonAdd: "sd-paneldynamic__add-btn",
    progressTop: "sd-paneldynamic__progress sd-paneldynamic__progress--top",
    progressBottom:
      "sd-paneldynamic__progress sd-paneldynamic__progress--bottom",
    buttonPrev: "sd-paneldynamic__prev-btn sd-action--icon sd-action",
    buttonNext: "sd-paneldynamic__next-btn sd-action--icon sd-action",
    progressContainer: "sd-paneldynamic__progress-container",
    progress: "sd-progress",
    progressBar: "sd-progress__bar",
    progressText: "sd-paneldynamic__progress-text",
    separator: "sd-paneldynamic__separator",
    panelWrapper: "sd-paneldynamic__panel-wrapper",
    footer: "sd-paneldynamic__footer",
    footerButtonsContainer: "sd-paneldynamic__buttons-container",
    panelWrapperInRow: "sd-paneldynamic__panel-wrapper--in-row",
    progressBtnIcon: "icon-progressbuttonv2",
    noEntriesPlaceholder: "sd-paneldynamic__placeholder sd-question__placeholder"
  },
  progress: "sd-progress sd-body__progress",
  progressBar: "sd-progress__bar",
  progressText: "sd-progress__text",
  progressTextInBar: "sd-hidden",
  page: {
    root: "sd-page sd-body__page",
    title: "sd-title sd-page__title",
    description: "sd-description sd-page__description"
  },
  pageTitle: "sd-title sd-page__title",
  pageDescription: "sd-description sd-page__description",
  row: "sd-row sd-clearfix",
  rowMultiple: "sd-row--multiple",
  question: {
    mainRoot: "sd-element sd-question sd-row__question",
    flowRoot: "sd-element sd-question sd-row__question sd-row__question--flow",
    withFrame: "sd-element--with-frame",
    asCell: "sd-table__cell",
    answered: "sd-question--answered",
    header: "sd-question__header sd-element__header",
    headerLeft: "sd-question__header--location--left",
    headerTop: "sd-question__header--location-top sd-element__header--location-top",
    headerBottom: "sd-question__header--location--bottom",
    content: "sd-question__content",
    contentLeft: "sd-question__content--left",
    titleLeftRoot: "",
    titleOnAnswer: "sd-question__title--answer",
    titleOnError: "sd-question__title--error",
    title: "sd-title sd-question__title",
    titleExpandable: "sd-element__title--expandable",
    titleExpanded: "sd-element__title--expanded",
    titleCollapsed: "sd-element__title--collapsed",
    requiredText: "sd-question__required-text",
    number: "sd-question__num",
    description: "sd-description sd-question__description",
    descriptionUnderInput: "sd-description sd-question__description",
    comment: "sd-input sd-comment",
    other: "sd-input sd-comment",
    required: "sd-question--required",
    titleRequired: "sd-question__title--required",
    indent: 20,
    footer: "sd-question__footer",
    formGroup: "sd-question__form-group",
    hasError: "sd-question--error",
    disabled: "sd-question--disabled",
    collapsed: "sd-element--collapsed",
    nested: "sd-element--nested",
    invisible: "sd-element--invisible"
  },
  image: {
    mainRoot: "sd-question sd-question--image",
    root: "sd-image",
    image: "sd-image__image",
    withFrame: ""
  },
  html: {
    mainRoot: "sd-question sd-row__question sd-question--html",
    root: "sd-html",
    withFrame: ""
  },
  error: {
    root: "sd-question__erbox",
    icon: "",
    item: "",
    tooltip: "sd-question__erbox--tooltip",
    aboveQuestion: "sd-question__erbox--above-question",
    locationTop: "sd-question__erbox--location--top",
    locationBottom: "sd-question__erbox--location--bottom"
  },
  checkbox: {
    root: "sd-selectbase",
    rootMultiColumn: "sd-selectbase--multi-column",
    item: "sd-item sd-checkbox sd-selectbase__item",
    itemOnError: "sd-item--error",
    itemSelectAll: "sd-checkbox--selectall",
    itemNone: "sd-checkbox--none",
    itemDisabled: "sd-item--disabled sd-checkbox--disabled",
    itemChecked: "sd-item--checked sd-checkbox--checked",
    itemHover: "sd-item--allowhover sd-checkbox--allowhover",
    itemInline: "sd-selectbase__item--inline",
    label: "sd-selectbase__label",
    labelChecked: "",
    itemControl: "sd-visuallyhidden sd-item__control sd-checkbox__control",
    itemDecorator: "sd-item__svg sd-checkbox__svg",
    itemSvgIconId: "#icon-v2check",
    controlLabel: "sd-item__control-label",
    materialDecorator: "sd-item__decorator sd-checkbox__decorator",
    other: "sd-input sd-comment sd-selectbase__other",
    column: "sd-selectbase__column"
  },
  radiogroup: {
    root: "sd-selectbase",
    rootMultiColumn: "sd-selectbase--multi-column",
    item: "sd-item sd-radio sd-selectbase__item",
    itemOnError: "sd-item--error",
    itemInline: "sd-selectbase__item--inline",
    label: "sd-selectbase__label",
    labelChecked: "",
    itemDisabled: "sd-item--disabled sd-radio--disabled",
    itemChecked: "sd-item--checked sd-radio--checked",
    itemHover: "sd-item--allowhover sd-radio--allowhover",
    itemControl: "sd-visuallyhidden sd-item__control sd-radio__control",
    itemDecorator: "sd-item__svg sd-radio__svg",
    controlLabel: "sd-item__control-label",
    materialDecorator: "sd-item__decorator sd-radio__decorator",
    other: "sd-input sd-comment sd-selectbase__other",
    clearButton: "sd-btn sd-selectbase__clear-btn",
    column: "sd-selectbase__column"
  },
  boolean: {
    mainRoot: "sd-element sd-question sd-row__question sd-question--boolean",
    root: "sv_qcbc sv_qbln",
    item: "sd-boolean",
    itemOnError: "sd-boolean--error",
    control: "sd-boolean__control sd-visuallyhidden",
    itemChecked: "sd-boolean--checked",
    itemIndeterminate: "sd-boolean--indeterminate",
    itemDisabled: "sd-boolean--disabled",
    label: "sd-boolean__label",
    switch: "sd-boolean__switch",
    disabledLabel: "sd-checkbox__label--disabled",
    itemDecorator: "sd-checkbox__hidden",
    materialDecorator: "sd-checkbox__rectangle",
    sliderText: "sd-boolean__thumb-text",
    slider: "sd-boolean__thumb"
  },
  text: {
    root: "sd-input sd-text",
    small: "sd-row__question--small",
    controlDisabled: "sd-input--disabled",
    onError: "sd-input--error"
  },
  multipletext: {
    root: "sd-multipletext",
    itemLabel: "sd-multipletext__item-container sd-input",
    itemLabelOnError: "sd-multipletext__item-container--error",
    item: "sd-multipletext__item",
    itemTitle: "sd-multipletext__item-title",
    row: "sd-multipletext__row",
    cell: "sd-multipletext__cell"
  },
  dropdown: {
    root: "sd-selectbase",
    small: "sd-row__question--small",
    control: "sd-input sd-dropdown",
    selectWrapper: "",
    other: "sd-input sd-comment sd-selectbase__other",
    onError: "sd-input--error",
    label: "sd-selectbase__label",
    item: "sd-item sd-radio sd-selectbase__item",
    itemDisabled: "sd-item--disabled sd-radio--disabled",
    itemChecked: "sd-item--checked sd-radio--checked",
    itemHover: "sd-item--allowhover sd-radio--allowhover",
    itemControl: "sd-visuallyhidden sd-item__control sd-radio__control",
    itemDecorator: "sd-item__svg sd-radio__svg",
    controlDisabled: "sd-input--disabled",
    controlLabel: "sd-item__control-label",
    controlEmpty: "sd-dropdown--empty",
    materialDecorator: "sd-item__decorator sd-radio__decorator"
  },
  imagepicker: {
    mainRoot: "sd-element sd-question sd-row__question",
    root: "sd-imagepicker",
    item: "sd-imagepicker__item",
    itemOnError: "sd-imagepicker__item--error",
    itemInline: "sd-imagepicker__item--inline",
    itemChecked: "sd-imagepicker__item--checked",
    itemDisabled: "sd-imagepicker__item--disabled",
    itemHover: "sd-imagepicker__item--allowhover",
    label: "sd-imagepicker__label",
    itemDecorator: "sd-imagepicker__item-decorator",
    imageContainer: "sd-imagepicker__image-container",
    itemControl: "sd-imagepicker__control",
    image: "sd-imagepicker__image",
    itemText: "sd-imagepicker__text",
    clearButton: "sd-btn",
    other: "sd-input sd-comment"
  },
  matrix: {
    mainRoot: "sd-element sd-question sd-row__question sd-element--complex sd-question--complex sd-question--table",
    tableWrapper: "sd-matrix",
    root: "sd-table",
    rowError: "sd-matrix__row--error",
    cell: "sd-table__cell sd-matrix__cell",
    headerCell: "sd-table__cell sd-table__cell--header",
    label: "sd-item sd-radio sd-matrix__label",
    itemOnError: "sd-item--error",
    itemValue: "sd-visuallyhidden sd-item__control sd-radio__control",
    itemChecked: "sd-item--checked sd-radio--checked",
    itemDisabled: "sd-item--disabled sd-radio--disabled",
    itemHover: "sd-radio--allowhover",
    materialDecorator: "sd-item__decorator sd-radio__decorator",
    itemDecorator: "sd-item__svg sd-radio__svg",
    cellText: "sd-matrix__text",
    cellTextSelected: "sd-matrix__text--checked",
    cellTextDisabled: "sd-matrix__text--disabled"
  },
  matrixdropdown: {
    mainRoot: "sd-element sd-question sd-row__question sd-element--complex sd-question--complex sd-question--table",
    root: "sd-table",
    cell: "sd-table__cell",
    headerCell: "sd-table__cell sd-table__cell--header",
    rowTextCell: "sd-table__cell sd-table__cell--row-text",
    detailButton: "sd-table__cell--detail-button",
    detailButtonExpanded: "sd-table__cell--detail-button--expanded",
    detailIcon: "sd-detail-panel__icon",
    detailIconExpanded: "sd-detail-panel__icon--expanded",
    detailIconId: "icon-expanddetail",
    detailIconExpandedId: "icon-collapsedetail",
    actionsCell: "sd-table__cell sd-table__cell--actions",
    emptyCell: "sd-table__cell--empty",
    verticalCell: "sd-table__cell--vertical",
    cellQuestionWrapper: "sd-table__question-wrapper"
  },
  matrixdynamic: {
    mainRoot: "sd-element sd-question sd-row__question sd-element--complex sd-question--complex sd-question--table",
    empty: "sd-question--empty",
    root: "sd-table sd-matrixdynamic",
    cell: "sd-table__cell",
    headerCell: "sd-table__cell sd-table__cell--header",
    rowTextCell: "sd-table__cell sd-table__cell--row-text",
    button: "sd-action sd-matrixdynamic__btn",
    detailRow: "sd-table__row sd-table__row--detail",
    detailButton: "sd-table__cell--detail-button",
    detailButtonExpanded: "sd-table__cell--detail-button--expanded",
    detailIcon: "sd-detail-panel__icon",
    detailIconExpanded: "sd-detail-panel__icon--expanded",
    detailIconId: "icon-expanddetail",
    detailIconExpandedId: "icon-collapsedetail",
    detailPanelCell: "sd-table__cell--detail-panel",
    actionsCell: "sd-table__cell sd-table__cell--actions",
    buttonAdd: "sd-matrixdynamic__add-btn",
    buttonRemove: "sd-action--negative sd-matrixdynamic__remove-btn",
    iconAdd: "",
    iconRemove: "",
    footer: "sd-matrixdynamic__footer",
    emptyRowsSection: "sd-matrixdynamic__placeholder sd-question__placeholder",
    iconDrag: "sv-matrixdynamic__drag-icon",
    ghostRow: "sv-matrix-row--drag-drop-ghost-mod",
    emptyCell: "sd-table__cell--empty",
    verticalCell: "sd-table__cell--vertical",
    cellQuestionWrapper: "sd-table__question-wrapper"
  },
  rating: {
    root: "sd-rating",
    item: "sd-rating__item",
    itemOnError: "sd-rating__item--error",
    itemHover: "sd-rating__item--allowhover",
    selected: "sd-rating__item--selected",
    minText: "sd-rating__item-text sd-rating__min-text",
    itemText: "sd-rating__item-text",
    maxText: "sd-rating__item-text sd-rating__max-text",
    itemDisabled: "sd-rating__item--disabled"
  },
  comment: {
    root: "sd-input sd-comment",
    small: "sd-row__question--small",
    controlDisabled: "sd-input--disabled",
    onError: "sd-input--error"
  },
  expression: "",
  file: {
    root: "sd-file",
    other: "sd-input sd-comment",
    placeholderInput: "sd-visuallyhidden",
    preview: "sd-file__preview",
    fileSign: "",
    fileList: "sd-file__list",
    fileSignBottom: "sd-file__sign",
    fileDecorator: "sd-file__decorator",
    onError: "sd-file__decorator--error",
    fileDecoratorDrag: "sd-file__decorator--drag",
    fileInput: "sd-visuallyhidden",
    noFileChosen: "sd-description sd-file__no-file-chosen",
    chooseFile: "sd-file__choose-btn",
    chooseFileAsText: "sd-action sd-file__choose-btn--text",
    chooseFileAsIcon: "sd-context-btn sd-file__choose-btn--icon",
    chooseFileIconId: "icon-choosefile",
    disabled: "sd-file__choose-btn--disabled",
    removeButton: "",
    removeButtonBottom: "sd-context-btn sd-context-btn--negative sd-file__btn sd-file__clean-btn",
    removeButtonIconId: "icon-clear",
    removeFile: "sd-hidden",
    removeFileSvg: "",
    removeFileSvgIconId: "icon-delete",
    wrapper: "sd-file__wrapper",
    defaultImage: "sd-file__default-image",
    removeFileButton: "sd-context-btn sd-context-btn--negative sd-file__remove-file-button",
    dragAreaPlaceholder: "sd-file__drag-area-placeholder",
    imageWrapper: "sd-file__image-wrapper",
    single: "sd-file--single",
    singleImage: "sd-file--single-image"
  },
  signaturepad: {
    mainRoot: "sd-element sd-question sd-question--signature sd-row__question",
    root: "sd-signaturepad sjs_sp_container",
    small: "sd-row__question--small",
    controls: "sjs_sp_controls sd-signaturepad__controls",
    placeholder: "sjs_sp_placeholder",
    clearButton: "sjs_sp_clear sd-context-btn sd-context-btn--negative sd-signaturepad__clear",
    clearButtonIconId: "icon-clear"
  },
  saveData: {
    root: "",
    saving: "",
    error: "",
    success: "",
    saveAgainButton: ""
  },
  window: {
    root: "sv_window",
    body: "sv_window_content",
    header: {
      root: "sv_window_title",
      title: "",
      button: "",
      buttonExpanded: "",
      buttonCollapsed: ""
    }
  },
  ranking: {
    root: "sv-ranking",
    rootMobileMod: "sv-ranking--mobile",
    rootDragMod: "sv-ranking--drag",
    rootDisabled: "sv-ranking--disabled",
    item: "sv-ranking-item",
    itemContent: "sv-ranking-item__content",
    itemIndex: "sv-ranking-item__index",
    // itemText: "sv-ranking-item__text",
    controlLabel: "sv-ranking-item__text",
    itemGhostNode: "sv-ranking-item__ghost",
    itemIconContainer: "sv-ranking-item__icon-container",
    itemIcon: "sv-ranking-item__icon",
    itemIconHoverMod: "sv-ranking-item__icon--hover",
    itemIconFocusMod: "sv-ranking-item__icon--focus",
    itemGhostMod: "sv-ranking-item--ghost",
    itemDragMod: "sv-ranking--drag",
    itemOnError: "sv-ranking-item--error",
  },
  actionBar: {
    root: "sd-action-bar",
    item: "sd-action",
    itemPressed: "sd-action--pressed",
    itemAsIcon: "sd-action--icon",
    itemIcon: "sd-action__icon"
  }
};

surveyCss["defaultV2"] = defaultV2Css;

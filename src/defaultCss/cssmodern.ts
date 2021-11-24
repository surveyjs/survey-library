import { surveyCss } from "./cssstandard";
export var modernCss = {
  root: "sv-root-modern",
  container: "sv-container-modern",
  header: "sv-title sv-container-modern__title",
  headerClose: "sv-container-modern__close",
  body: "sv-body",
  bodyEmpty: "sv-body sv-body--empty",
  footer: "sv-footer sv-body__footer sv-clearfix",
  title: "",
  description: "",
  logo: "sv-logo",
  logoImage: "sv-logo__image",
  headerText: "sv-header__text",
  navigationButton: "",
  completedPage: "sv-completedpage",
  navigation: {
    complete: "sv-btn sv-footer__complete-btn",
    prev: "sv-btn sv-footer__prev-btn",
    next: "sv-btn sv-footer__next-btn",
    start: "sv-btn sv-footer__start-btn",
    preview: "sv-btn sv-footer__preview-btn",
    edit: "sv-btn sv-footer__edit-btn",
  },
  panel: {
    title: "sv-title sv-panel__title",
    titleExpandable: "sv-panel__title--expandable",
    titleOnError: "sv-panel__title--error",
    description: "sv-description sv-panel__description",
    container: "sv-panel sv-row__panel",
    content: "sv-panel__content",
    icon: "sv-panel__icon",
    iconExpanded: "sv-panel__icon--expanded",
    footer: "sv-panel__footer",
    requiredText: "sv-panel__required-text",
    number: "sv-question__num",
  },
  paneldynamic: {
    root: "sv-paneldynamic",
    navigation: "sv-paneldynamic__navigation",
    title: "sv-title sv-question__title",
    button: "sv-btn",
    buttonRemove: "sv-paneldynamic__remove-btn",
    buttonRemoveRight: "sv-paneldynamic__remove-btn--right",
    buttonAdd: "sv-paneldynamic__add-btn",
    progressTop: "sv-paneldynamic__progress sv-paneldynamic__progress--top",
    progressBottom:
      "sv-paneldynamic__progress sv-paneldynamic__progress--bottom",
    buttonPrev: "sv-paneldynamic__prev-btn",
    buttonNext: "sv-paneldynamic__next-btn",
    progressContainer: "sv-paneldynamic__progress-container",
    progress: "sv-progress",
    progressBar: "sv-progress__bar",
    progressText: "sv-paneldynamic__progress-text",
    separator: "sv-paneldynamic__separator",
    panelWrapper: "sv-paneldynamic__panel-wrapper",
    panelWrapperInRow: "sv-paneldynamic__panel-wrapper--in-row",
    separatorV2: "sv-hidden",
    footer: "sv-hidden"
  },
  progress: "sv-progress sv-body__progress",
  progressBar: "sv-progress__bar",
  progressText: "sv-progress__text",
  progressTextInBar: "sv-hidden",
  progressButtonsContainerCenter: "sv_progress-buttons__container-center",
  progressButtonsContainer: "sv_progress-buttons__container",
  progressButtonsImageButtonLeft: "sv_progress-buttons__image-button-left",
  progressButtonsImageButtonRight: "sv_progress-buttons__image-button-right",
  progressButtonsImageButtonHidden: "sv_progress-buttons__image-button--hidden",
  progressButtonsListContainer: "sv_progress-buttons__list-container",
  progressButtonsList: "sv_progress-buttons__list",
  progressButtonsListElementPassed: "sv_progress-buttons__list-element--passed",
  progressButtonsListElementCurrent:
    "sv_progress-buttons__list-element--current",
  progressButtonsListElementNonClickable:
    "sv_progress-buttons__list-element--nonclickable",
  progressButtonsPageTitle: "sv_progress-buttons__page-title",
  progressButtonsPageDescription: "sv_progress-buttons__page-description",
  page: {
    root: "sv-page sv-body__page",
    title: "sv-title sv-page__title",
    description: "sv-description sv-page__description",
  },
  pageTitle: "sv-title sv-page__title",
  pageDescription: "sv-description sv-page__description",
  row: "sv-row sv-clearfix",
  question: {
    mainRoot: "sv-question sv-row__question",
    flowRoot: "sv-question sv-row__question sv-row__question--flow",
    asCell: "sv-table__cell",
    header: "sv-question__header",
    headerLeft: "sv-question__header--location--left",
    headerTop: "sv-question__header--location--top",
    headerBottom: "sv-question__header--location--bottom",
    content: "sv-question__content",
    contentLeft: "sv-question__content--left",
    titleLeftRoot: "",
    answered: "sv-question--answered",
    titleOnAnswer: "sv-question__title--answer",
    titleOnError: "sv-question__title--error",
    title: "sv-title sv-question__title",
    titleExpandable: "sv-question__title--expandable",
    icon: "sv-question__icon",
    iconExpanded: "sv-question__icon--expanded",
    requiredText: "sv-question__required-text",
    number: "sv-question__num",
    description: "sv-description sv-question__description",
    descriptionUnderInput: "sv-description sv-question__description",
    comment: "sv-comment",
    required: "sv-question--required",
    titleRequired: "sv-question__title--required",
    indent: 20,
    footer: "sv-question__footer",
    formGroup: "sv-question__form-group",
    hasError: "",
    disabled: "sv-question--disabled",
  },
  image: { root: "sv-image", image: "sv_image_image" },
  error: {
    root: "sv-question__erbox",
    icon: "",
    item: "",
    locationTop: "sv-question__erbox--location--top",
    locationBottom: "sv-question__erbox--location--bottom",
  },
  checkbox: {
    root: "sv-selectbase",
    item: "sv-item sv-checkbox sv-selectbase__item",
    itemSelectAll: "sv-checkbox--selectall",
    itemNone: "sv-checkbox--none",
    itemDisabled: "sv-item--disabled sv-checkbox--disabled",
    itemChecked: "sv-checkbox--checked",
    itemHover: "sv-checkbox--allowhover",
    itemInline: "sv-selectbase__item--inline",
    label: "sv-selectbase__label",
    labelChecked: "",
    itemControl: "sv-visuallyhidden sv-item__control",
    itemDecorator: "sv-item__svg sv-checkbox__svg",
    controlLabel: "sv-item__control-label",
    materialDecorator: "sv-item__decorator sv-selectbase__decorator sv-checkbox__decorator",
    other: "sv-comment sv-question__other",
    column: "sv-selectbase__column",
  },
  ranking: {
    root: "sv-ranking",
    rootMobileMod: "sv-ranking--mobile",
    rootDragMod: "sv-ranking--drag",
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
    itemDragMod: "sv-ranking-item--drag",
  },
  radiogroup: {
    root: "sv-selectbase",
    item: "sv-item sv-radio sv-selectbase__item",
    itemInline: "sv-selectbase__item--inline",
    label: "sv-selectbase__label",
    labelChecked: "",
    itemDisabled: "sv-item--disabled sv-radio--disabled",
    itemChecked: "sv-radio--checked",
    itemHover: "sv-radio--allowhover",
    itemControl: "sv-visuallyhidden sv-item__control",
    itemDecorator: "sv-item__svg sv-radio__svg",
    controlLabel: "sv-item__control-label",
    materialDecorator: "sv-item__decorator sv-selectbase__decorator sv-radio__decorator",
    other: "sv-comment sv-question__other",
    clearButton: "sv-btn sv-selectbase__clear-btn",
    column: "sv-selectbase__column",
  },
  buttongroup: {
    root: "sv-button-group",
    item: "sv-button-group__item",
    itemIcon: "sv-button-group__item-icon",
    itemDecorator: "sv-button-group__item-decorator",
    itemCaption: "sv-button-group__item-caption",
    itemSelected: "sv-button-group__item--selected",
    itemHover: "sv-button-group__item--hover",
    itemDisabled: "sv-button-group__item--disabled",
    itemControl: "sv-visuallyhidden",
  },
  boolean: {
    root: "sv_qbln",
    small: "sv-row__question--small",
    item: "sv-boolean sv-item",
    control: "sv-visuallyhidden",
    itemChecked: "sv-boolean--checked",
    itemIndeterminate: "sv-boolean--indeterminate",
    itemDisabled: "sv-item--disabled sv-boolean--disabled",
    switch: "sv-boolean__switch",
    slider: "sv-boolean__slider",
    label: "sv-boolean__label ",
    disabledLabel: "sv-boolean__label--disabled",
    materialDecorator: "sv-item__decorator sv-boolean__decorator ",
    itemDecorator: "sv-item__svg  sv-boolean__svg",
    checkedPath: "sv-boolean__checked-path",
    uncheckedPath: "sv-boolean__unchecked-path",
    indeterminatePath: "sv-boolean__indeterminate-path",
  },
  text: {
    root: "sv-text",
    small: "sv-row__question--small",
    onError: "sv-text--error",
  },
  multipletext: {
    root: "sv-multipletext",
    item: "sv-multipletext__item",
    itemLabel: "sv-multipletext__item-label",
    itemTitle: "sv-multipletext__item-title",
    row: "sv-multipletext__row",
    cell: "sv-multipletext__cell",
  },
  dropdown: {
    root: "",
    small: "sv-row__question--small",
    control: "sv-dropdown",
    selectWrapper: "",
    other: "sv-comment sv-question__other",
    onError: "sv-dropdown--error",
  },
  imagepicker: {
    root: "sv-imagepicker",
    item: "sv-imagepicker__item",
    itemInline: "sv-imagepicker__item--inline",
    itemChecked: "sv-imagepicker__item--checked",
    itemDisabled: "sv-imagepicker__item--disabled",
    itemHover: "sv-imagepicker__item--allowhover",
    label: "sv-imagepicker__label",
    itemControl: "sv-imagepicker__control",
    image: "sv-imagepicker__image",
    itemText: "sv-imagepicker__text",
    clearButton: "sv-btn",
    other: "sv-comment sv-question__other",
  },
  matrix: {
    tableWrapper: "sv-matrix",
    root: "sv-table sv-matrix-root",
    rowError: "sv-matrix__row--error",
    cell: "sv-table__cell sv-matrix__cell",
    headerCell: "sv-table__cell sv-table__cell--header",
    label: "sv-item sv-radio sv-matrix__label",
    itemValue: "sv-visuallyhidden sv-item__control sv-radio__control",
    itemChecked: "sv-radio--checked",
    itemDisabled: "sv-item--disabled sv-radio--disabled",
    itemHover: "sv-radio--allowhover",
    materialDecorator: "sv-item__decorator sv-radio__decorator",
    itemDecorator: "sv-item__svg sv-radio__svg",
    cellText: "sv-matrix__text",
    cellTextSelected: "sv-matrix__text--checked",
    cellTextDisabled: "sv-matrix__text--disabled",
  },
  matrixdropdown: {
    root: "sv-table sv-matrixdropdown",
    cell: "sv-table__cell",
    headerCell: "sv-table__cell sv-table__cell--header",
    row: "sv-table__row",
    rowAdditional: "sv-table__row--additional",
    detailRow: "sv-table__row--detail",
    detailRowText: "sv-table__cell--detail-rowtext",
    detailCell: "sv-table__cell--detail",
    choiceCell: "sv-table__cell--choice",
    detailButton: "sv-table__cell--detail-button",
    detailButtonExpanded: "sv-table__cell--detail-button--expanded",
    detailIcon: "sv-detail-panel__icon",
    detailIconExpanded: "sv-detail-panel__icon--expanded",
    detailPanelCell: "sv-table__cell--detail-panel",
    actionsCell: "sv-table__cell sv-table__cell--actions",
  },
  matrixdynamic: {
    root: "sv-table sv-matrixdynamic",
    cell: "sv-table__cell",
    headerCell: "sv-table__cell sv-table__cell--header",
    button: "sv-btn",
    buttonAdd: "sv-matrixdynamic__add-btn",
    buttonRemove: "sv-matrixdynamic__remove-btn",
    iconAdd: "",
    iconRemove: "",
    iconDrag: "sv-matrixdynamic__drag-icon",
    row: "sv-table__row",
    detailRow: "sv-table__row--detail",
    detailCell: "sv-table__cell--detail",
    choiceCell: "sv-table__cell--choice",
    detailButton: "sv-table__cell--detail-button",
    detailButtonExpanded: "sv-table__cell--detail-button--expanded",
    detailIcon: "sv-detail-panel__icon",
    detailIconExpanded: "sv-detail-panel__icon--expanded",
    detailPanelCell: "sv-table__cell--detail-panel",
    actionsCell: "sv-table__cell sv-table__cell--actions",
    emptyRowsSection: "sv-table__empty--rows--section",
    emptyRowsText: "sv-table__empty--rows--text",
    emptyRowsButton: "",
    dragDropGhostPositionTop: "sv-matrix__drag-drop-ghost-position-top",
    dragDropGhostPositionBottom: "sv-matrix__drag-drop-ghost-position-bottom",
  },
  rating: {
    root: "sv-rating",
    item: "sv-rating__item",
    selected: "sv-rating__item--selected",
    minText: "sv-rating__min-text",
    itemText: "sv-rating__item-text",
    maxText: "sv-rating__max-text",
    itemDisabled: "sv-rating--disabled",
  },
  comment: {
    root: "sv-comment",
    small: "sv-row__question--small",
  },
  expression: "",
  file: {
    root: "sv-file",
    other: "sv-comment sv-question__other",
    placeholderInput: "sv-visuallyhidden",
    preview: "sv-file__preview",
    fileSign: "sv-hidden",
    fileSignBottom: "sv-file__sign",
    fileDecorator: "sv-file__decorator",
    fileInput: "sv-visuallyhidden",
    noFileChosen: "sv-description sv-file__no-file-chosen",
    chooseFile: "sv-btn sv-file__choose-btn",
    controlDisabled: "sv-file__choose-btn--disabled",
    removeButton: "sv-hidden",
    removeButtonBottom: "sv-btn sv-file__clean-btn",
    removeFile: "sv-hidden",
    removeFileSvg: "sv-file__remove-svg",
    wrapper: "sv-file__wrapper",
    dragAreaPlaceholder: "sv-hidden",
    fileList: "",
    defaultImage: "sv-hidden"
  },
  signaturepad: {
    root: "sv-signaturepad sjs_sp_container",
    small: "sv-row__question--small",
    controls: "sjs_sp_controls",
    placeholder: "sjs_sp_placeholder",
    clearButton: "sjs_sp_clear",
  },
  saveData: {
    root: "",
    saving: "",
    error: "",
    success: "",
    saveAgainButton: "",
  },
  window: {
    root: "sv_window",
    body: "sv_window_content",
    header: {
      root: "sv_window_title",
      title: "",
      button: "",
      buttonExpanded: "",
      buttonCollapsed: "",
    },
  },
};

surveyCss["modern"] = modernCss;

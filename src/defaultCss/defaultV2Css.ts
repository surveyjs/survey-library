export var surveyCss: any = {
  currentType: "",
  getCss: function () {
    var loc = this.currentType ? this[this.currentType] : defaultV2Css;
    if (!loc) loc = defaultV2Css;
    return loc;
  },
  getAvailableThemes: function () {
    return Object.keys(this).filter(propertyName => ["currentType", "getCss", "getAvailableThemes"].indexOf(propertyName) === -1);
  }
};

export var defaultV2Css = {
  root: "sd-root-modern",
  rootProgress: "sd-progress",
  rootMobile: "sd-root-modern--mobile",
  rootAnimationDisabled: "sd-root-modern--animation-disabled",
  rootReadOnly: "sd-root--readonly",
  rootCompact: "sd-root--compact",
  rootFitToContainer: "sd-root-modern--full-container",
  rootWrapper: "sd-root-modern__wrapper",
  rootWrapperFixed: "sd-root-modern__wrapper--fixed",
  rootWrapperHasImage: "sd-root-modern__wrapper--has-image",
  rootBackgroundImage: "sd-root_background-image",
  container: "sd-container-modern",
  header: "sd-title sd-container-modern__title",
  bodyContainer: "sv-components-row",
  body: "sd-body",
  bodyWithTimer: "sd-body--with-timer",
  clockTimerRoot: "sd-timer",
  clockTimerRootTop: "sd-timer--top",
  clockTimerRootBottom: "sd-timer--bottom",
  clockTimerProgress: "sd-timer__progress",
  clockTimerProgressAnimation: "sd-timer__progress--animation",
  clockTimerTextContainer: "sd-timer__text-container",
  clockTimerMinorText: "sd-timer__text--minor",
  clockTimerMajorText: "sd-timer__text--major",
  bodyEmpty: "sd-body sd-body--empty",
  bodyLoading: "sd-body--loading",
  footer: "sd-footer sd-body__navigation sd-clearfix",
  title: "sd-title",
  description: "sd-description",
  logo: "sd-logo",
  logoImage: "sd-logo__image",
  headerText: "sd-header__text",
  headerClose: "sd-hidden",
  navigationButton: "",
  bodyNavigationButton: "sd-btn",
  completedPage: "sd-completedpage",
  completedBeforePage: "sd-completed-before-page",
  timerRoot: "sd-body__timer",
  navigation: {
    complete: "sd-btn--action sd-navigation__complete-btn",
    prev: "sd-navigation__prev-btn",
    next: "sd-navigation__next-btn",
    start: "sd-navigation__start-btn",
    preview: "sd-navigation__preview-btn",
    edit: "sd-btn sd-btn--small",
  },
  panel: {
    contentEnter: "sd-element__content--enter",
    contentLeave: "sd-element__content--leave",
    enter: "sd-element-wrapper--enter",
    leave: "sd-element-wrapper--leave",
    asPage: "sd-panel--as-page",
    number: "sd-element__num",
    title: "sd-title sd-element__title sd-panel__title",
    titleExpandable: "sd-element__title--expandable",
    titleNumInline: "sd-element__title--num-inline",
    titleExpanded: "sd-element__title--expanded",
    titleCollapsed: "sd-element__title--collapsed",
    titleDisabled: "sd-element__title--disabled",
    titleOnExpand: "sd-panel__title--expanded",
    titleOnError: "sd-panel__title--error",
    titleBar: "sd-action-title-bar",
    description: "sd-description sd-panel__description",
    container: "sd-element sd-element--complex sd-panel sd-row__panel",
    withFrame: "sd-element--with-frame",
    content: "sd-element__content sd-panel__content",
    icon: "sd-panel__icon",
    iconExpanded: "sd-panel__icon--expanded",
    footer: "sd-panel__footer",
    requiredText: "sd-panel__required-text",
    header: "sd-panel__header sd-element__header sd-element__header--location-top",
    collapsed: "sd-element--collapsed",
    expanded: "sd-element--expanded",
    expandable: "sd-element--expandable",
    expandableAnimating: "sd-elemenet--expandable--animating",
    nested: "sd-element--nested sd-element--nested-with-borders",
    invisible: "sd-element--invisible",
    navigationButton: "",
    compact: "sd-element--with-frame sd-element--compact",
    errorsContainer: "sd-panel__errbox sd-element__erbox sd-element__erbox--above-element"
  },
  paneldynamic: {
    mainRoot: "sd-element  sd-question sd-question--paneldynamic sd-element--complex sd-question--complex sd-row__question",
    empty: "sd-question--empty",
    root: "sd-paneldynamic",
    iconRemove: "sd-hidden",
    navigation: "sd-paneldynamic__navigation",
    title: "sd-title sd-element__title sd-question__title",
    header: "sd-paneldynamic__header sd-element__header",
    headerTab: "sd-paneldynamic__header-tab",
    button: "sd-action sd-paneldynamic__btn",
    buttonRemove: "sd-action--negative sd-paneldynamic__remove-btn",
    buttonAdd: "sd-paneldynamic__add-btn",
    buttonPrev: "sd-paneldynamic__prev-btn sd-action--icon sd-action",
    buttonPrevDisabled: "sd-action--disabled",
    buttonNextDisabled: "sd-action--disabled",
    buttonNext: "sd-paneldynamic__next-btn sd-action--icon sd-action",
    progressContainer: "sd-paneldynamic__progress-container",
    progress: "sd-progress",
    progressBar: "sd-progress__bar",
    nested: "sd-element--nested sd-element--nested-with-borders",
    progressText: "sd-paneldynamic__progress-text",
    separator: "sd-paneldynamic__separator",
    panelWrapper: "sd-paneldynamic__panel-wrapper",
    footer: "sd-paneldynamic__footer",
    panelFooter: "sd-paneldynamic__panel-footer",
    footerButtonsContainer: "sd-paneldynamic__buttons-container",
    panelsContainer: "sd-paneldynamic__panels-container",
    panelWrapperInRow: "sd-paneldynamic__panel-wrapper--in-row",
    panelWrapperEnter: "sd-paneldynamic__panel-wrapper--enter",
    panelWrapperLeave: "sd-paneldynamic__panel-wrapper--leave",
    panelWrapperList: "sd-paneldynamic__panel-wrapper--list",
    progressBtnIcon: "icon-progressbuttonv2",
    noEntriesPlaceholder: "sd-paneldynamic__placeholder sd-question__placeholder",
    compact: "sd-element--with-frame sd-element--compact",
    tabsRoot: "sd-tabs-toolbar",
    tabsLeft: "sd-tabs-toolbar--left",
    tabsRight: "sd-tabs-toolbar--right",
    tabsCenter: "sd-tabs-toolbar--center",
    tabs: {
      item: "sd-tab-item",
      itemPressed: "sd-tab-item--pressed",
      itemAsIcon: "sd-tab-item--icon",
      itemIcon: "sd-tab-item__icon",
      itemTitle: "sd-tab-item__title"
    }
  },
  progress: "sd-progress sd-body__progress",
  progressTop: "sd-body__progress--top",
  progressBottom: "sd-body__progress--bottom",
  progressBar: "sd-progress__bar",
  progressText: "sd-progress__text",
  progressButtonsRoot: "sd-progress-buttons",
  progressButtonsNumbered: "sd-progress-buttons--numbered",
  progressButtonsFitSurveyWidth: "sd-progress-buttons--fit-survey-width",
  progressButtonsContainerCenter: "sd-progress-buttons__container-center",
  progressButtonsContainer: "sd-progress-buttons__container",
  progressButtonsConnector: "sd-progress-buttons__connector",
  progressButtonsButton: "sd-progress-buttons__button",
  progressButtonsButtonBackground: "sd-progress-buttons__button-background",
  progressButtonsButtonContent: "sd-progress-buttons__button-content",
  progressButtonsHeader: "sd-progress-buttons__header",
  progressButtonsFooter: "sd-progress-buttons__footer",
  progressButtonsImageButtonLeft: "sd-progress-buttons__image-button-left",
  progressButtonsImageButtonRight: "sd-progress-buttons__image-button-right",
  progressButtonsImageButtonHidden: "sd-progress-buttons__image-button--hidden",
  progressButtonsListContainer: "sd-progress-buttons__list-container",
  progressButtonsList: "sd-progress-buttons__list",
  progressButtonsListElementPassed: "sd-progress-buttons__list-element--passed",
  progressButtonsListElementCurrent:
    "sd-progress-buttons__list-element--current",
  progressButtonsListElementNonClickable:
    "sd-progress-buttons__list-element--nonclickable",
  progressButtonsPageTitle: "sd-progress-buttons__page-title",
  progressButtonsPageDescription: "sd-progress-buttons__page-description",
  progressTextInBar: "sd-hidden",
  page: {
    root: "sd-page sd-body__page",
    emptyHeaderRoot: "sd-page__empty-header",
    title: "sd-title sd-page__title",
    description: "sd-description sd-page__description",
    errorsContainer: "sd-page__errbox"
  },
  pageTitle: "sd-title sd-page__title",
  pageDescription: "sd-description sd-page__description",
  row: "sd-row sd-clearfix",
  rowMultiple: "sd-row--multiple",
  rowCompact: "sd-row--compact",
  rowEnter: "sd-row--enter",
  rowDelayedEnter: "sd-row--delayed-enter",
  rowLeave: "sd-row--leave",
  rowReplace: "sd-row--replace",
  pageRow: "sd-page__row",
  question: {
    contentEnter: "sd-element__content--enter",
    contentLeave: "sd-element__content--leave",
    enter: "sd-element-wrapper--enter",
    leave: "sd-element-wrapper--leave",
    mainRoot: "sd-element sd-question sd-row__question",
    flowRoot: "sd-element sd-question sd-row__question sd-row__question--flow",
    withFrame: "sd-element--with-frame",
    asCell: "sd-table__cell",
    answered: "sd-question--answered",
    header: "sd-question__header sd-element__header",
    headerLeft: "sd-question__header--location--left",
    headerTop: "sd-question__header--location-top sd-element__header--location-top",
    headerBottom: "sd-question__header--location--bottom",
    content: "sd-element__content sd-question__content",
    contentSupportContainerQueries: "sd-question__content--support-container-queries",
    contentLeft: "sd-question__content--left",
    titleNumInline: "sd-element__title--num-inline",
    titleLeftRoot: "sd-question--left",
    titleTopRoot: "sd-question--title-top",
    descriptionUnderInputRoot: "sd-question--description-under-input",
    titleBottomRoot: "sd-question--title-bottom",
    titleOnAnswer: "sd-question__title--answer",
    titleEmpty: "sd-question__title--empty",
    titleOnError: "sd-question__title--error",
    title: "sd-title sd-element__title sd-question__title",
    titleExpandable: "sd-element__title--expandable",
    titleExpanded: "sd-element__title--expanded",
    titleCollapsed: "sd-element__title--collapsed",
    titleDisabled: "sd-element__title--disabled",
    titleReadOnly: "sd-element__title--readonly",
    titleBar: "sd-action-title-bar",
    requiredText: "sd-question__required-text",
    number: "sd-element__num",
    description: "sd-description sd-question__description",
    descriptionUnderInput: "sd-description sd-question__description sd-question__description--under-input",
    comment: "sd-input sd-comment",
    other: "sd-input sd-comment",
    required: "sd-question--required",
    titleRequired: "sd-question__title--required",
    indent: 20,
    footer: "sd-question__footer",
    commentArea: "sd-question__comment-area",
    formGroup: "sd-question__form-group",
    hasError: "sd-question--error",
    hasErrorTop: "sd-question--error-top",
    hasErrorBottom: "sd-question--error-bottom",
    collapsed: "sd-element--collapsed",
    expandable: "sd-element--expandable",
    expandableAnimating: "sd-elemenet--expandable--animating",
    expanded: "sd-element--expanded",
    nested: "sd-element--nested",
    invisible: "sd-element--invisible",
    composite: "sd-element--complex sd-composite",
    disabled: "sd-question--disabled",
    readOnly: "sd-question--readonly",
    preview: "sd-question--preview",
    noPointerEventsMode: "sd-question--no-pointer-events",
    errorsContainer: "sd-element__erbox sd-question__erbox",
    errorsContainerTop: "sd-element__erbox--above-element sd-question__erbox--above-question",
    errorsContainerBottom: "sd-question__erbox--below-question"
  },
  image: {
    mainRoot: "sd-question sd-question--image",
    root: "sd-image",
    image: "sd-image__image",
    adaptive: "sd-image__image--adaptive",
    noImage: "sd-image__no-image",
    noImageSvgIconId: "icon-no-image",
    withFrame: ""
  },
  html: {
    mainRoot: "sd-question sd-row__question sd-question--html",
    root: "sd-html",
    withFrame: "",
    nested: "sd-element--nested sd-html--nested"
  },
  error: {
    root: "sd-error",
    icon: "",
    item: "",
    locationTop: "",
    locationBottom: ""
  },
  checkbox: {
    root: "sd-selectbase",
    rootMobile: "sd-selectbase--mobile",
    rootRow: "sd-selectbase--row",
    rootMultiColumn: "sd-selectbase--multi-column",
    item: "sd-item sd-checkbox sd-selectbase__item",
    itemEnter: "sd-item--enter",
    itemLeave: "sd-item--leave",
    itemOnError: "sd-item--error",
    itemSelectAll: "sd-checkbox--selectall",
    itemNone: "sd-checkbox--none",
    itemDisabled: "sd-item--disabled sd-checkbox--disabled",
    itemReadOnly: "sd-item--readonly sd-checkbox--readonly",
    itemPreview: "sd-item--preview sd-checkbox--preview",
    itemPreviewSvgIconId: "#icon-v2check",
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
    column: "sd-selectbase__column",
  },
  radiogroup: {
    root: "sd-selectbase",
    rootMobile: "sd-selectbase--mobile",
    rootRow: "sd-selectbase--row",
    rootMultiColumn: "sd-selectbase--multi-column",
    item: "sd-item sd-radio sd-selectbase__item",
    itemOnError: "sd-item--error",
    itemInline: "sd-selectbase__item--inline",
    label: "sd-selectbase__label",
    labelChecked: "",
    itemEnter: "sd-item--enter",
    itemLeave: "sd-item--leave",
    itemDisabled: "sd-item--disabled sd-radio--disabled",
    itemReadOnly: "sd-item--readonly sd-radio--readonly",
    itemPreview: "sd-item--preview sd-radio--preview",
    itemPreviewSvgIconId: "#icon-v2check",
    itemChecked: "sd-item--checked sd-radio--checked",
    itemHover: "sd-item--allowhover sd-radio--allowhover",
    itemControl: "sd-visuallyhidden sd-item__control sd-radio__control",
    itemDecorator: "sd-item__svg sd-radio__svg",
    controlLabel: "sd-item__control-label",
    materialDecorator: "sd-item__decorator sd-radio__decorator",
    other: "sd-input sd-comment sd-selectbase__other",
    clearButton: "",
    column: "sd-selectbase__column"
  },
  boolean: {
    mainRoot: "sd-element sd-question sd-row__question sd-question--boolean",
    root: "sv_qcbc sv_qbln sd-scrollable-container sd-boolean-root",
    rootRadio: "sv_qcbc sv_qbln sd-scrollable-container sd-scrollable-container--compact",
    item: "sd-boolean",
    itemOnError: "sd-boolean--error",
    control: "sd-boolean__control sd-visuallyhidden",
    itemChecked: "sd-boolean--checked",
    itemExchanged: "sd-boolean--exchanged",
    itemIndeterminate: "sd-boolean--indeterminate",
    itemDisabled: "sd-boolean--disabled",
    itemReadOnly: "sd-boolean--readonly",
    itemPreview: "sd-boolean--preview",
    itemHover: "sd-boolean--allowhover",
    label: "sd-boolean__label",
    labelTrue: "sd-boolean__label--true",
    labelFalse: "sd-boolean__label--false",
    switch: "sd-boolean__switch",
    disabledLabel: "sd-checkbox__label--disabled",
    labelReadOnly: "sd-checkbox__label--readonly",
    labelPreview: "sd-checkbox__label--preview",
    sliderText: "sd-boolean__thumb-text",
    slider: "sd-boolean__thumb",
    sliderGhost: "sd-boolean__thumb-ghost",
    //radio
    radioItem: "sd-item",
    radioItemChecked: "sd-item--checked sd-radio--checked",
    radioItemDisabled: "sd-item--disabled sd-radio--disabled",
    radioItemReadOnly: "sd-item--readonly sd-radio--readonly",
    radioItemPreview: "sd-item--preview sd-radio--preview",
    itemPreviewSvgIconId: "#icon-v2check",
    radioLabel: "sd-selectbase__label",
    radioControlLabel: "sd-item__control-label",
    radioFieldset: "sd-selectbase",
    itemRadioDecorator: "sd-item__svg sd-radio__svg",
    materialRadioDecorator: "sd-item__decorator sd-radio__decorator",
    itemRadioControl: "sd-visuallyhidden sd-item__control sd-radio__control",
    //end radio
    //checkbox
    rootCheckbox: "sd-selectbase",
    checkboxItem: "sd-item sd-selectbase__item sd-checkbox",
    checkboxLabel: "sd-selectbase__label",
    checkboxItemOnError: "sd-item--error",
    checkboxItemIndeterminate: "sd-checkbox--intermediate",
    checkboxItemChecked: "sd-item--checked sd-checkbox--checked",
    checkboxItemDecorator: "sd-item__svg sd-checkbox__svg",
    checkboxItemDisabled: "sd-item--disabled sd-checkbox--disabled",
    checkboxItemReadOnly: "sd-item--readonly sd-checkbox--readonly",
    checkboxItemPreview: "sd-item--preview sd-checkbox--preview",
    controlCheckbox: "sd-visuallyhidden sd-item__control sd-checkbox__control",
    checkboxMaterialDecorator: "sd-item__decorator sd-checkbox__decorator",
    checkboxControlLabel: "sd-item__control-label",
    svgIconCheckedId: "#icon-v2check",
  },
  text: {
    root: "sd-input sd-text",
    small: "sd-row__question--small",
    controlDisabled: "sd-input--disabled",
    controlReadOnly: "sd-input--readonly",
    controlPreview: "sd-input--preview",
    constrolWithCharacterCounter: "sd-text__character-counter",
    characterCounterBig: "sd-text__character-counter--big",
    content: "sd-text__content sd-question__content",
    remainingCharacterCounter: "sd-remaining-character-counter",
    onError: "sd-input--error"
  },
  multipletext: {
    root: "sd-multipletext",
    rootMobile: "sd-multipletext--mobile",
    itemLabel: "sd-multipletext__item-container sd-input",
    itemLabelReadOnly: "sd-input--readonly",
    itemLabelDisabled: "sd-input--disabled",
    itemLabelPreview: "sd-input--preview",
    itemLabelOnError: "sd-multipletext__item-container--error",
    itemLabelAllowFocus: "sd-multipletext__item-container--allow-focus",
    itemLabelAnswered: "sd-multipletext__item-container--answered",
    itemWithCharacterCounter: "sd-multipletext-item__character-counter",
    item: "sd-multipletext__item",
    itemTitle: "sd-multipletext__item-title",
    content: "sd-multipletext__content sd-question__content",
    row: "sd-multipletext__row",
    cell: "sd-multipletext__cell",
    cellError: "sd-multipletext__cell--error",
    cellErrorTop: "sd-multipletext__cell--error-top",
    cellErrorBottom: "sd-multipletext__cell--error-bottom"
  },
  dropdown: {
    root: "sd-selectbase",
    popup: "sv-dropdown-popup",
    small: "sd-row__question--small",
    selectWrapper: "sv-dropdown_select-wrapper",
    other: "sd-input sd-comment sd-selectbase__other",
    onError: "sd-input--error",
    label: "sd-selectbase__label",
    itemEnter: "sd-item--enter",
    itemLeave: "sd-item--leave",
    item: "sd-item sd-radio sd-selectbase__item",
    itemDisabled: "sd-item--disabled sd-radio--disabled",
    itemChecked: "sd-item--checked sd-radio--checked",
    itemHover: "sd-item--allowhover sd-radio--allowhover",
    itemControl: "sd-visuallyhidden sd-item__control sd-radio__control",
    itemDecorator: "sd-item__svg sd-radio__svg",
    cleanButton: "sd-dropdown_clean-button",
    cleanButtonSvg: "sd-dropdown_clean-button-svg",
    cleanButtonIconId: "icon-clear",
    chevronButton: "sd-dropdown_chevron-button",
    chevronButtonSvg: "sd-dropdown_chevron-button-svg",
    chevronButtonIconId: "icon-chevron",
    control: "sd-input sd-dropdown",
    controlInputFieldComponent: "sd-dropdown__input-field-component",
    controlValue: "sd-dropdown__value",
    controlDisabled: "sd-input--disabled",
    controlReadOnly: "sd-input--readonly",
    controlPreview: "sd-input--preview",
    controlEmpty: "sd-dropdown--empty",
    controlLabel: "sd-item__control-label",
    filterStringInput: "sd-dropdown__filter-string-input",
    materialDecorator: "sd-item__decorator sd-radio__decorator",
    hintPrefix: "sd-dropdown__hint-prefix",
    hintSuffix: "sd-dropdown__hint-suffix"
  },
  imagepicker: {
    mainRoot: "sd-element sd-question sd-row__question",
    root: "sd-selectbase sd-imagepicker",
    rootColumn: "sd-imagepicker--column",
    item: "sd-imagepicker__item",
    itemOnError: "sd-imagepicker__item--error",
    itemInline: "sd-imagepicker__item--inline",
    itemChecked: "sd-imagepicker__item--checked",
    itemDisabled: "sd-imagepicker__item--disabled",
    itemReadOnly: "sd-imagepicker__item--readonly",
    itemPreview: "sd-imagepicker__item--preview",
    itemHover: "sd-imagepicker__item--allowhover",
    label: "sd-imagepicker__label",
    itemDecorator: "sd-imagepicker__item-decorator",
    imageContainer: "sd-imagepicker__image-container",
    itemControl: "sd-imagepicker__control sd-visuallyhidden",
    image: "sd-imagepicker__image",
    itemText: "sd-imagepicker__text",
    other: "sd-input sd-comment",
    itemNoImage: "sd-imagepicker__no-image",
    itemNoImageSvgIcon: "sd-imagepicker__no-image-svg",
    itemNoImageSvgIconId: "icon-no-image",
    column: "sd-selectbase__column sd-imagepicker__column",
    checkedItemDecorator: "sd-imagepicker__check-decorator",
    checkedItemSvgIcon: "sd-imagepicker__check-icon",
    checkedItemSvgIconId: "icon-v2check_24x24",
  },
  matrix: {
    mainRoot: "sd-element sd-question sd-row__question sd-element--complex sd-question--complex sd-question--table",
    tableWrapper: "sd-matrix sd-table-wrapper",
    root: "sd-table sd-matrix__table",
    columnsAutoWidth: "sd-table--columnsautowidth",
    noHeader: "sd-table--no-header",
    rootVerticalAlignTop: "sd-table--align-top",
    rootVerticalAlignMiddle: "sd-table--align-middle",
    rootAlternateRows: "sd-table--alternate-rows",
    rowError: "sd-matrix__row--error",
    cell: "sd-table__cell sd-matrix__cell",
    row: "sd-table__row",
    rowDisabled: "sd-table__row-disabled",
    rowReadOnly: "sd-table__row-readonly",
    headerCell: "sd-table__cell sd-table__cell--header",
    rowTextCell: "sd-table__cell sd-matrix__cell sd-table__cell--row-text",
    label: "sd-item sd-radio sd-matrix__label",
    itemOnError: "sd-item--error",
    itemValue: "sd-visuallyhidden sd-item__control sd-radio__control",
    itemChecked: "sd-item--checked sd-radio--checked",
    itemDisabled: "sd-item--disabled sd-radio--disabled",
    itemReadOnly: "sd-item--readonly sd-radio--readonly",
    itemPreview: "sd-item--preview sd-radio--preview",
    itemPreviewSvgIconId: "#icon-v2check",
    itemHover: "sd-radio--allowhover",
    materialDecorator: "sd-item__decorator sd-radio__decorator",
    itemDecorator: "sd-item__svg sd-radio__svg",
    cellText: "sd-matrix__text",
    cellTextSelected: "sd-matrix__text--checked",
    cellTextDisabled: "sd-matrix__text--disabled",
    cellResponsiveTitle: "sd-matrix__responsive-title",
    compact: "sd-element--with-frame sd-element--compact"
  },
  matrixdropdown: {
    mainRoot: "sd-element sd-question sd-row__question sd-element--complex sd-question--complex sd-question--table",
    rootScroll: "sd-question--scroll",
    root: "sd-table sd-matrixdropdown",
    columnsAutoWidth: "sd-table--columnsautowidth",
    noHeader: "sd-table--no-header",
    hasFooter: "sd-table--has-footer",
    rootVerticalAlignTop: "sd-table--align-top",
    rootVerticalAlignMiddle: "sd-table--align-middle",
    tableWrapper: "sd-table-wrapper",
    rootAlternateRows: "sd-table--alternate-rows",
    cell: "sd-table__cell",
    cellResponsiveTitle: "sd-table__responsive-title",
    errorsCell: "sd-table__cell--error",
    errorsCellTop: "sd-table__cell--error-top",
    errorsCellBottom: "sd-table__cell--error-bottom",
    itemCell: "sd-table__cell--item",
    row: "sd-table__row",
    rowDelayedEnter: "sd-table__row--delayed-enter",
    rowEnter: "sd-table__row--enter",
    rowLeave: "sd-table__row--leave",
    expandedRow: "sd-table__row--expanded",
    rowHasPanel: "sd-table__row--has-panel",
    rowHasEndActions: "sd-table__row--has-end-actions",
    headerCell: "sd-table__cell sd-table__cell--header",
    rowTextCell: "sd-table__cell sd-table__cell--row-text",
    footerCell: "sd-table__cell sd-table__cell--footer",
    footerTotalCell: "sd-table__cell sd-table__cell--footer-total",
    columnTitleCell: "sd-table__cell--column-title",
    cellRequiredText: "sd-question__required-text",
    detailButton: "sd-table__cell--detail-button",
    detailButtonExpanded: "sd-table__cell--detail-button--expanded",
    detailIcon: "sd-detail-panel__icon",
    detailIconExpanded: "sd-detail-panel__icon--expanded",
    detailIconId: "icon-expanddetail",
    detailIconExpandedId: "icon-collapsedetail",
    detailPanelCell: "sd-table__cell--detail-panel",
    detailRowCell: "sd-table__cell--detail",
    actionsCellPrefix: "sd-table__cell-action",
    actionsCell: "sd-table__cell sd-table__cell--actions",
    actionsCellDrag: "sd-table__cell--drag",
    emptyCell: "sd-table__cell--empty",
    verticalCell: "sd-table__cell--vertical",
    cellQuestionWrapper: "sd-table__question-wrapper",
    compact: "sd-element--with-frame sd-element--compact"
  },
  matrixdynamic: {
    mainRoot: "sd-element sd-question sd-row__question sd-element--complex sd-question--complex sd-question--table",
    rootScroll: "sd-question--scroll",
    empty: "sd-question--empty",
    root: "sd-table sd-matrixdynamic",
    columnsAutoWidth: "sd-table--columnsautowidth",
    noHeader: "sd-table--no-header",
    hasFooter: "sd-table--has-footer",
    tableWrapper: "sd-table-wrapper",
    rootAlternateRows: "sd-table--alternate-rows",
    content: "sd-matrixdynamic__content sd-question__content",
    cell: "sd-table__cell",
    cellResponsiveTitle: "sd-table__responsive-title",
    row: "sd-table__row",
    rowDelayedEnter: "sd-table__row--delayed-enter",
    rowEnter: "sd-table__row--enter",
    rowLeave: "sd-table__row--leave",
    rowHasPanel: "sd-table__row--has-panel",
    rowHasEndActions: "sd-table__row--has-end-actions",
    expandedRow: "sd-table__row--expanded",
    itemCell: "sd-table__cell--item",
    headerCell: "sd-table__cell sd-table__cell--header",
    rowTextCell: "sd-table__cell sd-table__cell--row-text",
    footerCell: "sd-table__cell sd-table__cell--footer",
    columnTitleCell: "sd-table__cell--column-title",
    cellRequiredText: "sd-question__required-text",
    button: "sd-action sd-matrixdynamic__btn",
    detailRow: "sd-table__row sd-table__row--detail",
    detailButton: "sd-table__cell--detail-button",
    detailButtonExpanded: "sd-table__cell--detail-button--expanded",
    detailIcon: "sd-detail-panel__icon",
    detailIconExpanded: "sd-detail-panel__icon--expanded",
    detailIconId: "icon-expanddetail",
    detailIconExpandedId: "icon-collapsedetail",
    detailPanelCell: "sd-table__cell--detail-panel",
    detailRowCell: "sd-table__cell--detail",
    actionsCellPrefix: "sd-table__cell-action",
    actionsCell: "sd-table__cell sd-table__cell--actions",
    actionsCellDrag: "sd-table__cell--drag",
    buttonAdd: "sd-matrixdynamic__add-btn",
    buttonRemove: "sd-action--negative sd-matrixdynamic__remove-btn",
    iconAdd: "sd-hidden",
    iconRemove: "",
    dragElementDecorator: "sd-drag-element__svg",
    iconDragElement: "#icon-v2dragelement_16x16",
    footer: "sd-matrixdynamic__footer",
    footerTotalCell: "sd-table__cell sd-table__cell--footer-total",
    emptyRowsSection: "sd-matrixdynamic__placeholder sd-question__placeholder",
    iconDrag: "sv-matrixdynamic__drag-icon",
    ghostRow: "sv-matrix-row--drag-drop-ghost-mod",
    emptyCell: "sd-table__cell--empty",
    verticalCell: "sd-table__cell--vertical",
    cellQuestionWrapper: "sd-table__question-wrapper",
    errorsCell: "sd-table__cell--error",
    errorsCellTop: "sd-table__cell--error-top",
    errorsCellBottom: "sd-table__cell--error-bottom",
    compact: "sd-element--with-frame sd-element--compact",
  },
  rating: {
    rootDropdown: "sd-scrollable-container sd-scrollable-container--compact sd-selectbase",
    root: "sd-scrollable-container sd-rating",
    rootWrappable: "sd-rating--wrappable",
    rootLabelsTop: "sd-rating--labels-top",
    rootLabelsBottom: "sd-rating--labels-bottom",
    rootLabelsDiagonal: "sd-rating--labels-diagonal",
    item: "sd-rating__item",
    itemOnError: "sd-rating__item--error",
    itemHover: "sd-rating__item--allowhover",
    selected: "sd-rating__item--selected",
    itemStar: "sd-rating__item-star",
    itemStarOnError: "sd-rating__item-star--error",
    itemStarHover: "sd-rating__item-star--allowhover",
    itemStarSelected: "sd-rating__item-star--selected",
    itemStarDisabled: "sd-rating__item-star--disabled",
    itemStarReadOnly: "sd-rating__item-star--readonly",
    itemStarPreview: "sd-rating__item-star--preview",
    itemStarHighlighted: "sd-rating__item-star--highlighted",
    itemStarUnhighlighted: "sd-rating__item-star--unhighlighted",
    itemStarSmall: "sd-rating__item-star--small",
    itemSmiley: "sd-rating__item-smiley",
    itemSmileyOnError: "sd-rating__item-smiley--error",
    itemSmileyHover: "sd-rating__item-smiley--allowhover",
    itemSmileySelected: "sd-rating__item-smiley--selected",
    itemSmileyDisabled: "sd-rating__item-smiley--disabled",
    itemSmileyReadOnly: "sd-rating__item-smiley--readonly",
    itemSmileyPreview: "sd-rating__item-smiley--preview",
    itemSmileyHighlighted: "sd-rating__item-star--highlighted",
    itemSmileyScaleColored: "sd-rating__item-smiley--scale-colored",
    itemSmileyRateColored: "sd-rating__item-smiley--rate-colored",
    itemSmileySmall: "sd-rating__item-smiley--small",
    minText: "sd-rating__item-text sd-rating__min-text",
    itemText: "sd-rating__item-text",
    maxText: "sd-rating__item-text sd-rating__max-text",
    itemDisabled: "sd-rating__item--disabled",
    itemReadOnly: "sd-rating__item--readonly",
    itemPreview: "sd-rating__item--preview",
    itemFixedSize: "sd-rating__item--fixed-size",
    control: "sd-input sd-dropdown",
    itemSmall: "sd-rating--small",
    selectWrapper: "sv-dropdown_select-wrapper",
    controlValue: "sd-dropdown__value",
    controlDisabled: "sd-input--disabled",
    controlReadOnly: "sd-input--readonly",
    controlPreview: "sd-input--preview",
    controlEmpty: "sd-dropdown--empty",
    filterStringInput: "sd-dropdown__filter-string-input",
    chevronButton: "sd-dropdown_chevron-button",
    chevronButtonSvg: "sd-dropdown_chevron-button-svg",
    chevronButtonIconId: "icon-chevron",
    popup: "sv-dropdown-popup",
    onError: "sd-input--error",
  },
  comment: {
    root: "sd-input sd-comment",
    small: "sd-row__question--small",
    controlDisabled: "sd-input--disabled",
    controlReadOnly: "sd-input--readonly",
    controlPreview: "sd-input--preview",
    content: "sd-comment__content sd-question__content",
    remainingCharacterCounter: "sd-remaining-character-counter",
    onError: "sd-input--error"
  },
  expression: "sd-expression",
  file: {
    root: "sd-file",
    rootDragging: "sd-file--dragging",
    rootAnswered: "sd-file--answered",
    rootDisabled: "sd-file--disabled",
    rootReadOnly: "sd-file--readonly",
    rootPreview: "sd-file--preview",
    other: "sd-input sd-comment",
    placeholderInput: "sd-visuallyhidden",
    previewItem: "sd-file__preview-item",
    fileSign: "",
    fileList: "sd-file__list",
    fileSignBottom: "sd-file__sign",
    dragArea: "sd-file__drag-area",
    dragAreaActive: "sd-file__drag-area--active",
    fileDecorator: "sd-file__decorator",
    onError: "sd-file__decorator--error",
    fileDecoratorDrag: "sd-file__decorator--drag",
    fileInput: "sd-visuallyhidden",
    noFileChosen: "sd-description sd-file__no-file-chosen",
    chooseFile: "sd-file__choose-btn",
    chooseFileAsText: "sd-action sd-file__choose-btn--text",
    chooseFileAsTextDisabled: "sd-action--disabled",
    chooseFileAsIcon: "sd-file__choose-btn--icon",
    chooseFileIconId: "icon-choosefile",
    disabled: "sd-file__choose-btn--disabled",
    controlDisabled: "sd-file__choose-file-btn--disabled",
    //todo: remove it in v2
    removeButton: "sd-context-btn--negative",
    removeButtonBottom: "",
    //
    removeButtonIconId: "icon-clear",
    removeFile: "sd-hidden",
    removeFileSvg: "",
    removeFileSvgIconId: "icon-close_16x16",
    wrapper: "sd-file__wrapper",
    defaultImage: "sd-file__default-image",
    defaultImageIconId: "icon-defaultfile",
    leftIconId: "icon-arrowleft",
    rightIconId: "icon-arrowright",
    removeFileButton: "sd-context-btn--small sd-context-btn--with-border sd-context-btn--colorful sd-context-btn--negative sd-file__remove-file-button",
    dragAreaPlaceholder: "sd-file__drag-area-placeholder",
    imageWrapper: "sd-file__image-wrapper",
    imageWrapperDefaultImage: "sd-file__image-wrapper--default-image",
    single: "sd-file--single",
    singleImage: "sd-file--single-image",
    mobile: "sd-file--mobile",
    videoContainer: "sd-file__video-container",
    contextButton: "sd-context-btn",
    video: "sd-file__video",
    actionsContainer: "sd-file__actions-container",
    closeCameraButton: "sd-file__close-camera-button",
    changeCameraButton: "sd-file__change-camera-button",
    takePictureButton: "sd-file__take-picture-button",
    loadingIndicator: "sd-file__loading-indicator",
  },
  signaturepad: {
    mainRoot: "sd-element sd-question sd-question--signature sd-row__question",
    root: "sd-signaturepad sjs_sp_container",
    small: "sd-row__question--small",
    controls: "sjs_sp_controls sd-signaturepad__controls",
    placeholder: "sjs_sp_placeholder",
    canvas: "sjs_sp_canvas sd-signaturepad__canvas",
    backgroundImage: "sjs_sp__background-image sd-signaturepad__background-image",
    clearButton: "sjs_sp_clear sd-context-btn sd-context-btn--negative sd-signaturepad__clear",
    clearButtonIconId: "icon-clear",
    loadingIndicator: "sd-signaturepad__loading-indicator"
  },
  saveData: {
    root: "sv-save-data_root",
    rootWithButtons: "sv-save-data_root--with-buttons",
    info: "sv-save-data_info",
    error: "sv-save-data_error",
    success: "sv-save-data_success",
    button: "sv-save-data_button",
    shown: "sv-save-data_root--shown"
  },
  window: {
    root: "sv_window",
    rootCollapsedMod: "sv_window--collapsed",
    rootFullScreenMode: "sv_window--full-screen",
    rootContent: "sv_window_root-content",
    body: "sv_window_content",
    header: {
      root: "sv_window_header",
      titleCollapsed: "sv_window_header_title_collapsed",
      buttonsContainer: "sv_window_buttons_container",
      button: "sv_window_button",
      buttonExpanded: "",
      buttonCollapsed: "",
      collapseButton: "sv_window_button sv_window_button_collapse",
      closeButton: "sv_window_button sv_window_button_close",
      fullScreenButton: "sv_window_button sv_window_button_full_screen"
    }
  },
  ranking: {
    root: "sv-ranking",
    rootMobileMod: "sv-ranking--mobile",
    rootDragMod: "sv-ranking--drag",
    rootDisabled: "sd-ranking--disabled",
    rootReadOnly: "sd-ranking--readonly",
    rootPreview: "sd-ranking--preview",
    rootDesignMode: "sv-ranking--design-mode",
    rootDragHandleAreaIcon: "sv-ranking--drag-handle-area-icon",
    rootSelectToRankMod: "sv-ranking--select-to-rank",
    rootSelectToRankEmptyValueMod: "sv-ranking--select-to-rank-empty-value",
    rootSelectToRankAlignVertical: "sv-ranking--select-to-rank-vertical",
    rootSelectToRankAlignHorizontal: "sv-ranking--select-to-rank-horizontal",
    item: "sv-ranking-item",
    itemContent: "sv-ranking-item__content sd-ranking-item__content",
    itemIndex: "sv-ranking-item__index sd-ranking-item__index",
    itemIndexEmptyMode: "sv-ranking-item__index--empty sd-ranking-item__index--empty",
    // itemText: "sv-ranking-item__text",
    itemDisabled: "sv-ranking-item--disabled",
    itemReadOnly: "sv-ranking-item--readonly",
    itemPreview: "sv-ranking-item--preview",
    controlLabel: "sv-ranking-item__text",
    itemGhostNode: "sv-ranking-item__ghost",
    itemIconContainer: "sv-ranking-item__icon-container",
    itemIcon: "sv-ranking-item__icon",
    itemIconHoverMod: "sv-ranking-item__icon--hover",
    itemIconFocusMod: "sv-ranking-item__icon--focus",
    itemGhostMod: "sv-ranking-item--ghost",
    itemDragMod: "sv-ranking--drag",
    itemOnError: "sv-ranking-item--error",
    container: "sv-ranking__container",
    containerEmptyMode: "sv-ranking__container--empty",
    containerFromMode: "sv-ranking__container--from",
    containerToMode: "sv-ranking__container--to",
    containerPlaceholder: "sv-ranking__container-placeholder",
    containersDivider: "sv-ranking__containers-divider",
  },
  buttongroup: {
    root: "sv-button-group",
    item: "sv-button-group__item",
    itemIcon: "sv-button-group__item-icon",
    itemDecorator: "sv-button-group__item-decorator",
    itemCaption: "sv-button-group__item-caption",
    itemHover: "sv-button-group__item--hover",
    itemSelected: "sv-button-group__item--selected",
    itemDisabled: "sv-button-group__item--disabled",
    itemControl: "sv-visuallyhidden",
  },
  list: {
    root: "sv-list__container sd-list",
    item: "sv-list__item sd-list__item",
    itemBody: "sv-list__item-body sd-list__item-body",
    itemSelected: "sv-list__item--selected sd-list__item--selected",
    itemFocused: "sv-list__item--focused sd-list__item--focused",
  },
  actionBar: {
    root: "sd-action-bar",
    item: "sd-action",
    defaultSizeMode: "",
    smallSizeMode: "",
    itemPressed: "sd-action--pressed",
    itemAsIcon: "sd-action--icon",
    itemIcon: "sd-action__icon",
    itemTitle: "sd-action__title",
  },
  variables: {
    mobileWidth: "--sd-mobile-width",
    themeMark: "--sv-defaultV2-mark"
  },
  tagbox: {
    root: "sd-selectbase",
    popup: "sv-dropdown-popup",
    small: "sd-row__question--small",
    selectWrapper: "sv-dropdown_select-wrapper",
    other: "sd-input sd-comment sd-selectbase__other",
    onError: "sd-input--error",
    label: "sd-selectbase__label",
    itemSvgIconId: "#icon-v2check",
    item: "sd-item sd-checkbox sd-selectbase__item",
    itemDisabled: "sd-item--disabled sd-checkbox--disabled",
    itemChecked: "sd-item--checked sd-checkbox--checked",
    itemHover: "sd-item--allowhover sd-checkbox--allowhover",
    itemControl: "sd-visuallyhidden sd-item__control sd-checkbox__control",
    itemDecorator: "sd-item__svg sd-checkbox__svg",
    cleanButton: "sd-tagbox_clean-button sd-dropdown_clean-button",
    cleanButtonSvg: "sd-tagbox_clean-button-svg sd-dropdown_clean-button-svg",
    cleanButtonIconId: "icon-clear",
    cleanItemButton: "sd-tagbox-item_clean-button",
    cleanItemButtonSvg: "sd-tagbox-item_clean-button-svg",
    cleanItemButtonIconId: "icon-clear_16x16",
    chevronButton: "sd-dropdown_chevron-button",
    chevronButtonSvg: "sd-dropdown_chevron-button-svg",
    chevronButtonIconId: "icon-chevron",
    control: "sd-input sd-tagbox sd-dropdown",
    controlValue: "sd-tagbox__value sd-dropdown__value",
    controlValueItems: "sd-tagbox__value-items",
    placeholderInput: "sd-tagbox__placeholder",
    controlEditable: "sd-input--editable",
    controlDisabled: "sd-input--disabled",
    controlReadOnly: "sd-input--readonly",
    controlPreview: "sd-input--preview",
    controlEmpty: "sd-dropdown--empty sd-tagbox--empty",
    controlLabel: "sd-item__control-label",
    filterStringInput: "sd-tagbox__filter-string-input sd-dropdown__filter-string-input",
    materialDecorator: "sd-item__decorator sd-checkbox__decorator",
    hint: "sd-tagbox__hint",
    hintPrefix: "sd-dropdown__hint-prefix sd-tagbox__hint-prefix",
    hintSuffix: "sd-dropdown__hint-suffix sd-tagbox__hint-suffix",
    hintSuffixWrapper: "sd-tagbox__hint-suffix-wrapper"
  },
};

export const defaultV2ThemeName = "defaultV2";
surveyCss[defaultV2ThemeName] = defaultV2Css;
export var surveyCss: any = {
  currentType: "",
  getCss: function() {
    var loc = this.currentType ? this[this.currentType] : defaultStandardCss;
    if (!loc) loc = defaultStandardCss;
    return loc;
  }
};

export var defaultStandardCss = {
  root: "sv_main sv_default_css",
  container: "sv_container",
  header: "sv_header",
  body: "sv_body",
  bodyEmpty: "sv_body sv_body_empty",
  footer: "sv_nav",
  title: "",
  description: "",
  logo: "sv_logo",
  logoImage: "sv_logo__image",
  headerText: "sv_header__text",
  navigationButton: "",
  completedPage: "sv_completed_page",
  navigation: {
    complete: "sv_complete_btn",
    prev: "sv_prev_btn",
    next: "sv_next_btn",
    start: "sv_start_btn",
    preview: "sv_preview_btn",
    edit: "sv_edit_btn",
  },
  progress: "sv_progress",
  progressBar: "sv_progress_bar",
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
    root: "sv_p_root",
    title: "sv_page_title",
    description: "",
  },
  // TODO: move to the page object
  pageTitle: "sv_page_title",
  pageDescription: "",
  row: "sv_row",
  question: {
    mainRoot: "sv_q sv_qstn",
    flowRoot: "sv_q_flow sv_qstn",
    header: "",
    headerLeft: "title-left",
    content: "",
    contentLeft: "content-left",
    titleLeftRoot: "sv_qstn_left",
    requiredText: "sv_q_required_text",
    title: "sv_q_title",
    titleExpandable: "sv_q_title_expandable",
    number: "sv_q_num",
    description: "sv_q_description",
    comment: "",
    required: "",
    titleRequired: "",
    hasError: "",
    indent: 20,
    footer: "sv_q_footer",
    formGroup: "form-group",
    asCell: "sv_matrix_cell",
    icon: "sv_question_icon",
    iconExpanded: "sv_expanded",
    disabled: "sv_q--disabled",
  },
  panel: {
    title: "sv_p_title",
    titleExpandable: "sv_p_title_expandable",
    titleOnError: "",
    icon: "sv_panel_icon",
    iconExpanded: "sv_expanded",
    description: "sv_p_description",
    container: "sv_p_container",
    footer: "sv_p_footer",
    number: "sv_q_num",
    requiredText: "sv_q_required_text",
  },
  error: {
    root: "sv_q_erbox",
    icon: "",
    item: "",
    locationTop: "sv_qstn_error_top",
    locationBottom: "sv_qstn_error_bottom",
  },

  boolean: {
    root: "sv_qcbc sv_qbln",
    item: "sv-boolean",
    control: "sv-visuallyhidden",
    itemChecked: "sv-boolean--checked checked",
    itemIndeterminate: "sv-boolean--indeterminate",
    itemDisabled: "sv-boolean--disabled",
    switch: "sv-boolean__switch",
    slider: "sv-boolean__slider",
    label: "sv-boolean__label ",
    disabledLabel: "sv-boolean__label--disabled",
    materialDecorator: "sv-item__decorator sv-boolean__decorator",
    itemDecorator: "sv-item__svg sv-boolean__svg",
    checkedPath: "sv-boolean__checked-path",
    uncheckedPath: "sv-boolean__unchecked-path",
    indeterminatePath: "sv-boolean__indeterminate-path",
  },
  checkbox: {
    root: "sv_qcbc sv_qcbx",
    item: "sv_q_checkbox",
    itemSelectAll: "sv_q_checkbox_selectall",
    itemNone: "sv_q_checkbox_none",
    itemChecked: "checked",
    itemInline: "sv_q_checkbox_inline",
    label: "sv_q_checkbox_label",
    labelChecked: "",
    itemControl: "sv_q_checkbox_control_item",
    itemDecorator: "sv-hidden",
    controlLabel: "sv_q_checkbox_control_label",
    other: "sv_q_other sv_q_checkbox_other",
    column: "sv_q_select_column",
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
  comment: "",
  dropdown: {
    root: "",
    control: "sv_q_dropdown_control",
    selectWrapper: "sv_select_wrapper",
    other: "sv_q_dd_other",
  },
  html: { root: "" },
  image: { root: "sv_q_image", image: "sv_image_image" },
  matrix: {
    root: "sv_q_matrix",
    label: "sv_q_m_label",
    itemChecked: "checked",
    itemDecorator: "sv-hidden",
    cell: "sv_q_m_cell",
    cellText: "sv_q_m_cell_text",
    cellTextSelected: "sv_q_m_cell_selected",
    cellLabel: "sv_q_m_cell_label",
  },
  matrixdropdown: {
    root: "sv_q_matrix_dropdown",
    cell: "sv_matrix_cell",
    headerCell: "sv_matrix_cell_header",
    row: "sv_matrix_row",
    rowAdditional: "sv-matrix__row--additional",
    detailRow: "sv_matrix_detail_row",
    detailRowText: "sv_matrix_cell_detail_rowtext",
    detailCell: "sv_matrix_cell_detail",
    choiceCell: "sv-table__cell--choice",
    detailButton: "sv_matrix_cell_detail_button",
    detailButtonExpanded: "sv_matrix_cell_detail_button_expanded",
    detailIcon: "sv_detail_panel_icon",
    detailIconExpanded: "sv_detail_expanded",
    detailPanelCell: "sv_matrix_cell_detail_panel",
    actionsCell: "sv_matrix_cell sv_matrix_cell_actions",
  },
  matrixdynamic: {
    root: "sv_q_matrix_dynamic",
    button: "sv_matrix_dynamic_button",
    buttonAdd: "",
    buttonRemove: "",
    iconAdd: "",
    iconRemove: "",
    iconDrag: "sv-matrixdynamic__drag-icon",
    cell: "sv_matrix_cell",
    headerCell: "sv_matrix_cell_header",
    row: "sv_matrix_row",
    detailRow: "sv_matrix_detail_row",
    detailCell: "sv_matrix_cell_detail",
    choiceCell: "sv-table__cell--choice",
    detailButton: "sv_matrix_cell_detail_button",
    detailButtonExpanded: "sv_matrix_cell_detail_button_expanded",
    detailIcon: "sv_detail_panel_icon",
    detailIconExpanded: "sv_detail_expanded",
    detailPanelCell: "sv_matrix_cell_detail_panel",
    actionsCell: "sv_matrix_cell sv_matrix_cell_actions",
    emptyRowsSection: "sv_matrix_empty_rows_section",
    emptyRowsText: "sv_matrix_empty_rows_text",
    emptyRowsButton: "",
    dragDropGhostPositionTop: "sv-matrix__drag-drop-ghost-position-top",
    dragDropGhostPositionBottom: "sv-matrix__drag-drop-ghost-position-bottom",
  },
  paneldynamic: {
    root: "sv_panel_dynamic",
    title: "sv_p_title",
    button: "",
    buttonAdd: "sv-paneldynamic__add-btn",
    buttonRemove: "sv_p_remove_btn",
    buttonRemoveRight: "sv_p_remove_btn_right",
    buttonPrev: "sv-paneldynamic__prev-btn",
    buttonNext: "sv-paneldynamic__next-btn",
    progressContainer: "sv-paneldynamic__progress-container",
    progress: "sv-progress",
    progressBar: "sv-progress__bar",
    progressText: "sv-paneldynamic__progress-text",
    panelWrapper: "sv_p_wrapper",
    panelWrapperInRow: "sv_p_wrapper_in_row",
    separatorV2: "sv-hidden",
    footer: "",
    progressBtnIcon: "icon-progressbutton"
  },
  multipletext: {
    root: "sv_q_mt",
    itemTitle: "sv_q_mt_title",
    item: "sv_q_mt_item",
    row: "sv_q_mt_row",
    itemLabel: "sv_q_mt_label",
    itemValue: "sv_q_mt_item_value sv_q_text_root",
  },
  radiogroup: {
    root: "sv_qcbc",
    item: "sv_q_radiogroup",
    itemChecked: "checked",
    itemInline: "sv_q_radiogroup_inline",
    itemDecorator: "sv-hidden",
    label: "sv_q_radiogroup_label",
    labelChecked: "",
    itemControl: "sv_q_radiogroup_control_item",
    controlLabel: "",
    other: "sv_q_other sv_q_radiogroup_other",
    clearButton: "sv_q_radiogroup_clear",
    column: "sv_q_select_column",
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
  imagepicker: {
    root: "sv_imgsel",
    item: "sv_q_imgsel",
    itemChecked: "checked",
    label: "sv_q_imgsel_label",
    itemControl: "sv_q_imgsel_control_item",
    image: "sv_q_imgsel_image",
    itemInline: "sv_q_imagepicker_inline",
    itemText: "sv_q_imgsel_text",
    clearButton: "sv_q_radiogroup_clear",
  },
  rating: {
    root: "sv_q_rating",
    item: "sv_q_rating_item",
    selected: "active",
    minText: "sv_q_rating_min_text",
    itemText: "sv_q_rating_item_text",
    maxText: "sv_q_rating_max_text",
  },
  text: "sv_q_text_root",
  expression: "",
  file: {
    root: "sv_q_file",
    placeholderInput: "sv-visuallyhidden",
    preview: "sv_q_file_preview",
    removeButton: "sv_q_file_remove_button",
    fileInput: "sv-visuallyhidden",
    removeFile: "sv_q_file_remove",
    removeFileSvg: "sv-hidden",
    fileDecorator: "sv-file__decorator",
    fileSignBottom: "sv-hidden",
    removeButtonBottom: "sv-hidden",
    chooseFile: "sv_q_file_choose_button",
    noFileChosen: "sv_q_file_placeholder",
    dragAreaPlaceholder: "sv-hidden",
    fileList: "",
    defaultImage: "sv-hidden",
  },
  signaturepad: {
    root: "sv_q_signaturepad sjs_sp_container",
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

surveyCss["standard"] = defaultStandardCss;

export var surveyCss: any = {
  currentType: "",
  getCss: function () {
    var loc = this.currentType ? this[this.currentType] : bemCss;
    if (!loc) loc = bemCss;
    return loc;
  }
};

export var bemCss = {
  root: "sv-main sv_default_css",
  header: "sv-header",
  body: "sv-body",
  bodyEmpty: "sv-body sv-body_empty",
  footer: "sv-nav",
  navigationButton: "",
  completedPage: "sv-completed-page",
  navigation: {
    complete: "sv-btn sv-btn_complete",
    prev: "sv-btn sv-btn_type_prev",
    next: "sv-btn sv-btn_type_next",
    start: "sv-btn sv-btn_type_start"
  },
  progress: "sv-progress",
  progressBar: "sv-progress-bar",
  page: {
    root: "sv-page__root",
    title: "sv-page__title",
    description: "sv-description sv-description_location_page"
  },
  // TODO: move to the page object
  pageTitle: "sv-title sv-title_location_page",
  pageDescription: "sv-page__description",
  row: "sv-page__row",
  question: {
    mainRoot: "sv-question sv-page__question",
    flowRoot: "sv-body__root sv-body",
    titleLeftRoot: "sv-body__sv-question__title sv-body__sv-question__title_left",
    title: "sv-question__title",
    number: "sv-question__num",
    description: "sv-question__description",
    comment: "",
    required: "",
    titleRequired: "",
    hasError: "",
    indent: 20,
    footer: "sv-question__footer"
  },
  panel: {
    root: "sv_container sv-page__panel",
    title: "sv-panel__title",
    description: "sv-panel__description",
    container: "sv-description__container"
  },
  error: {
    root: "sv-erbox",
    icon: "",
    item: "",
    locationTop: "sv-erbox_location_top",
    locationBottom: "sv-erbox_location_bottom"
  },

  boolean: {
    root: "sv-question-boolean",
    item: "sv-checkbox sv-checkbox_boolean",
    label: "",
    materialDecorator: "checkbox-material"
  },
  checkbox: {
    root: "sv-question-checkbox",
    item: "sv-checkbox",
    label: "sv-label",
    itemControl: "sv-checkbox-control-item",
    controlLabel: "sv-checkbox-control-label",
    materialDecorator: "checkbox-material",
    other: "sv-other sv-checkbox_other",
    column: "sv-select-column"
  },
  comment: "",
  dropdown: {
    root: "",
    control: "sv_q_dropdown_control",
    selectWrapper: "sv_select_wrapper",
    other: "sv_q_dd_other"
  },
  html: { root: "" },
  matrix: {
    root: "sv-matrix",
    label: "sv-label",
    cellText: "sv-cell-text",
    cellTextSelected: "sv-cell-text_selected",
    cellLabel: "sv-label_cell"
  },
  matrixdropdown: { root: "sv_q_matrix_dropdown" },
  matrixdynamic: {
    root: "sv-matrix sv-matrix_dynamic",
    button: "sv-button sv-button_type_matrix",
    buttonAdd: "",
    buttonRemove: "",
    iconAdd: "",
    iconRemove: ""
  },
  paneldynamic: {
    root: "sv-panel-dynamic",
    title: "sv-title sv_title_panel",
    button: "",
    buttonPrev: "",
    buttonNext: "",
    buttonAdd: "",
    buttonRemove: ""
  },
  multipletext: {
    root: "sv-multitext",
    itemTitle: "sv_q_mt_title",
    row: "sv_q_mt_row",
    itemValue: "sv_q_mt_item_value sv_q_text_root"
  },
  radiogroup: {
    root: "sv-radiogroup",
    item: "sv-radiogroup",
    label: "sv-label",
    itemControl: "sv_q_radiogroup_control_item",
    controlLabel: "",
    materialDecorator: "circle",
    other: "sv_q_other sv_q_radiogroup_other",
    clearButton: "sv_q_radiogroup_clear",
    column: "sv_q_select_column"
  },
  imagepicker: {
    root: "sv-imagepicker",
    item: "sv-imgsel",
    label: "sv",
    itemControl: "sv_q_imgsel_control_item",
    image: "sv_q_imgsel_image",
    itemText: "sv_q_imgsel_text",
    clearButton: "sv_q_radiogroup_clear"
  },
  rating: {
    root: "sv-rating",
    item: "sv-item sv-item_location_rating",
    selected: "active",
    minText: "sv-min-text",
    itemText: "sv-item-text sv-item-text_location_rating",
    maxText: "sv-max-text"
  },
  text: "sv-text",
  expression: "",
  file: {
    root: "sv-file",
    placeholderInput: "sv-placeholder",
    preview: "sv-preview",
    removeButton: "sv-remove-button",
    fileInput: "sv-file-input",
    removeFile: "sv-remove-file"
  },
  saveData: {
    root: "",
    saving: "",
    error: "",
    success: "",
    saveAgainButton: ""
  },
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

surveyCss["standard"] = bemCss;

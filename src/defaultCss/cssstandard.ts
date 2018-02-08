export var surveyCss = {
  currentType: "",
  getCss: function() {
    var loc = this.currentType ? this[this.currentType] : defaultStandardCss;
    if (!loc) loc = defaultStandardCss;
    return loc;
  }
};

export var defaultStandardCss = {
  root: "sv_main sv_default_css",
  header: "sv_header",
  body: "sv_body",
  footer: "sv_nav",
  navigationButton: "",
  completedPage: "sv_completed_page",
  navigation: {
    complete: "sv_complete_btn",
    prev: "sv_prev_btn",
    next: "sv_next_btn",
    start: "sv_start_btn"
  },
  progress: "sv_progress",
  progressBar: "sv_progress_bar",
  page: {
    root: "sv_p_root",
    title: "",
    description: ""
  },
  // TODO: move to the page object
  pageTitle: "sv_page_title",
  pageDescription: "",
  row: "sv_row",
  question: {
    mainRoot: "sv_q sv_qstn",
    title: "sv_q_title",
    description: "sv_q_description",
    comment: "",
    required: "",
    titleRequired: "",
    indent: 20,
    footer: "sv_q_footer"
  },
  panel: { title: "sv_p_title", description: "", container: "sv_p_container" },
  error: { root: "sv_q_erbox", icon: "", item: "" },

  boolean: { root: "sv_qcbc sv_qbln", item: "sv_q_checkbox" },
  checkbox: {
    root: "sv_qcbc sv_qcbx",
    item: "sv_q_checkbox",
    label: "sv_q_checkbox_label",
    itemControl: "sv_q_checkbox_control_item",
    controlLabel: "sv_q_checkbox_control_label",
    other: "sv_q_other sv_q_checkbox_other"
  },
  comment: "",
  dropdown: {
    root: "",
    control: "sv_q_dropdown_control",
    selectWrapper: "sv_select_wrapper",
    other: "sv_q_other"
  },
  matrix: { root: "sv_q_matrix", label: "sv_q_m_label" },
  matrixdropdown: { root: "sv_q_matrix_dropdown" },
  matrixdynamic: {
    root: "sv_q_matrix_dynamic",
    button: "sv_matrix_dynamic_button"
  },
  paneldynamic: { root: "sv_panel_dynamic", title: "sv_p_title", button: "" },
  multipletext: {
    root: "sv_q_mt",
    itemTitle: "sv_q_mt_title",
    row: "sv_q_mt_row",
    itemValue: "sv_q_mt_item_value sv_q_text_root"
  },
  radiogroup: {
    root: "sv_qcbc",
    item: "sv_q_radiogroup",
    label: "sv_q_radiogroup_label",
    itemControl: "sv_q_radiogroup_control_item",
    controlLabel: "",
    other: "sv_q_other sv_q_radiogroup_other"
  },
  rating: {
    root: "sv_q_rating",
    item: "sv_q_rating_item",
    selected: "active",
    minText: "sv_q_rating_min_text",
    itemText: "sv_q_rating_item_text",
    maxText: "sv_q_rating_max_text"
  },
  text: "sv_q_text_root",
  expression: "",
  file: {
    root: "sv_q_file",
    placeholderInput: "sv_q_file_placeholder",
    preview: "sv_q_file_preview",
    removeButton: "sv_q_file_remove_button"
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
  }
};

surveyCss["standard"] = defaultStandardCss;

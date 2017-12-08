export var surveyCss = {
  currentType: "",
  getCss: function() {
    var loc = this.currentType ? this[this.currentType] : defaultStandardCss;
    if (!loc) loc = defaultStandardCss;
    return loc;
  }
};

export var defaultStandardCss = {
  root: "sv_main",
  header: "",
  body: "sv_body",
  footer: "sv_nav",
  navigationButton: "",
  navigation: {
    complete: "sv_complete_btn",
    prev: "sv_prev_btn",
    next: "sv_next_btn",
    start: "sv_start_btn"
  },
  progress: "sv_progress",
  progressBar: "",
  pageTitle: "sv_p_title",
  pageDescription: "",
  row: "sv_row",
  question: {
    mainRoot: "sv_q sv_qstn",
    title: "sv_q_title",
    description: "sv_q_description",
    comment: "",
    required: "",
    titleRequired: "",
    indent: 20
  },
  panel: { title: "sv_p_title", description: "", container: "sv_p_container" },
  error: { root: "sv_q_erbox", icon: "", item: "" },

  boolean: { root: "sv_qcbc sv_qbln", item: "sv_q_checkbox" },
  checkbox: {
    root: "sv_qcbc sv_qcbx",
    item: "sv_q_checkbox",
    itemControl: "",
    controlLabel: "",
    other: "sv_q_other sv_q_checkbox_other"
  },
  comment: "",
  dropdown: { root: "", control: "", other: "sv_q_other" },
  matrix: { root: "sv_q_matrix", label: "sv_q_m_label" },
  matrixdropdown: { root: "sv_q_matrix" },
  matrixdynamic: { root: "table", button: "" },
  paneldynamic: { root: "", button: "" },
  multipletext: {
    root: "",
    itemTitle: "",
    row: "",
    itemValue: "sv_q_mt_item_value"
  },
  radiogroup: {
    root: "sv_qcbc",
    item: "sv_q_radiogroup",
    label: "",
    itemControl: "",
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
  text: "",
  expression: "",
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

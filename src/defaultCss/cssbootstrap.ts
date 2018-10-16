import { surveyCss } from "./cssstandard";

export var defaultBootstrapCss = {
  root: "sv_main sv_bootstrap_css",
  header: "panel-heading card-header",
  body: "panel-body card-block mt-4",
  footer: "panel-footer card-footer",
  navigationButton: "",
  completedPage: "",
  navigation: {
    complete: "btn sv_complete_btn",
    prev: "btn sv_prev_btn",
    next: "btn sv_next_btn",
    start: "btn sv_start_btn"
  },
  progress: "progress center-block mx-auto mb-4",
  progressBar: "progress-bar",
  page: {
    root: "",
    title: "",
    description: ""
  },
  pageTitle: "",
  pageDescription: "small",
  row: "sv_row",
  question: {
    mainRoot: "sv_qstn",
    title: "",
    description: "small",
    comment: "form-control",
    required: "",
    titleRequired: "",
    hasError: "has-error",
    indent: 20
  },
  panel: {
    title: "sv_p_title",
    description: "small",
    container: "sv_p_container"
  },
  error: {
    root: "alert alert-danger",
    icon: "glyphicon glyphicon-exclamation-sign",
    item: ""
  },

  boolean: {
    root: "sv_qbln form-inline checkbox",
    item: "",
    label: "",
    materialDecorator: "checkbox-material"
  },
  checkbox: {
    root: "sv_qcbc sv_qcbx form-inline",
    item: "checkbox",
    itemControl: "",
    controlLabel: "",
    materialDecorator: "checkbox-material",
    other: "sv_q_checkbox_other form-control"
  },
  comment: "form-control",
  dropdown: {
    root: "",
    control: "form-control",
    other: "sv_q_dd_other form-control"
  },
  matrix: {
    root: "table sv_q_matrix",
    label: "sv_q_m_label",
    cellText: "sv_q_m_cell_text",
    cellTextSelected: "sv_q_m_cell_selected bg-primary",
    cellLabel: "sv_q_m_cell_label"
  },
  matrixdropdown: { root: "table" },
  matrixdynamic: {
    root: "table",
    button: "button",
    buttonAdd: "",
    buttonRemove: ""
  },
  paneldynamic: {
    root: "",
    button: "button",
    buttonPrev: "",
    buttonNext: "",
    buttonAdd: "",
    buttonRemove: ""
  },
  multipletext: {
    root: "table",
    itemTitle: "",
    itemValue: "sv_q_mt_item_value form-control"
  },
  radiogroup: {
    root: "sv_qcbc form-inline",
    item: "radio",
    label: "",
    itemControl: "",
    controlLabel: "",
    materialDecorator: "circle",
    other: "sv_q_radiogroup_other form-control",
    clearButton: "sv_q_radiogroup_clear button"
  },
  imagepicker: {
    root: "sv_imgsel",
    item: "sv_q_imgsel",
    label: "sv_q_imgsel_label",
    itemControl: "sv_q_imgsel_control_item",
    image: "sv_q_imgsel_image",
    itemText: "sv_q_imgsel_text",
    clearButton: "sv_q_radiogroup_clear"
  },
  rating: {
    root: "btn-group",
    item: "btn btn-default btn-secondary",
    selected: "active",
    minText: "sv_q_rating_min_text",
    itemText: "sv_q_rating_item_text",
    maxText: "sv_q_rating_max_text"
  },
  text: "form-control",
  expression: "form-control",
  file: {
    root: "sv_q_file",
    placeholderInput: "sv_q_file_placeholder",
    preview: "sv_q_file_preview",
    removeButton: "sv_q_file_remove_button",
    fileInput: "sv_q_file_input",
    removeFile: "sv_q_file_remove"
  },
  saveData: {
    root: "",
    saving: "alert alert-info",
    error: "alert alert-danger",
    success: "alert alert-success",
    saveAgainButton: ""
  },
  window: {
    root: "modal-content",
    body: "modal-body",
    header: {
      root: "modal-header panel-title",
      title: "pull-left",
      button: "glyphicon pull-right",
      buttonExpanded: "glyphicon pull-right glyphicon-chevron-up",
      buttonCollapsed: "glyphicon pull-right glyphicon-chevron-down"
    }
  }
};
(<any>surveyCss)["bootstrap"] = defaultBootstrapCss;

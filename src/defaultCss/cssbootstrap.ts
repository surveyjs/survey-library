import { surveyCss } from "./cssstandard";

export var defaultBootstrapCss = {
  root: "sv_main sv_bootstrap_css",
  header: "panel-heading card-header",
  body: "panel-body card-block mt-4",
  bodyEmpty: "panel-body card-block mt-4 sv_body_empty",
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
    flowRoot: "sv_q_flow sv_qstn",
    header: "",
    headerLeft: "title-left",
    content: "",
    contentLeft: "content-left",
    titleLeftRoot: "sv_qstn_left",
    title: "",
    number: "sv_q_num",
    description: "small",
    comment: "form-control",
    required: "",
    titleRequired: "",
    hasError: "has-error",
    indent: 20
  },
  panel: {
    title: "sv_p_title",
    titleExpandable: "sv_p_title_expandable",
    description: "small sv_p_description",
    container: "sv_p_container"
  },
  error: {
    root: "alert alert-danger",
    icon: "glyphicon glyphicon-exclamation-sign",
    item: "",
    locationTop: "sv_qstn_error_top",
    locationBottom: "sv_qstn_error_bottom"
  },
  boolean: {
    root: "sv_qbln form-inline checkbox",
    item: "",
    itemDecorator: "sv-hidden",
    label: "",
    materialDecorator: "checkbox-material"
  },
  checkbox: {
    root: "sv_qcbc sv_qcbx form-inline",
    item: "checkbox",
    itemInline: "sv_q_checkbox_inline",
    itemControl: "",
    itemDecorator: "sv-hidden",
    controlLabel: "",
    materialDecorator: "checkbox-material",
    other: "sv_q_checkbox_other form-control",
    column: "sv_q_select_column"
  },
  comment: "form-control",
  dropdown: {
    root: "",
    control: "form-control",
    other: "sv_q_dd_other form-control"
  },
  html: { root: "" },
  matrix: {
    root: "table sv_q_matrix",
    label: "sv_q_m_label",
    itemDecorator: "sv-hidden",
    cellText: "sv_q_m_cell_text",
    cellTextSelected: "sv_q_m_cell_selected bg-primary",
    cellLabel: "sv_q_m_cell_label"
  },
  matrixdropdown: { root: "table" },
  matrixdynamic: {
    root: "table",
    button: "button",
    buttonAdd: "",
    buttonRemove: "",
    iconAdd: "",
    iconRemove: ""
  },
  paneldynamic: {
    root: "",
    navigation: "sv-paneldynamic__navigation",
    progressTop: "sv-paneldynamic__progress sv-paneldynamic__progress--top",
    progressBottom:
      "sv-paneldynamic__progress sv-paneldynamic__progress--bottom",
    title: "sv-title sv-question__title",
    button: "button",
    buttonAdd: "button sv-paneldynamic__add-btn",
    buttonRemove: "button sv-paneldynamic__remove-btn",
    buttonPrev: "sv-paneldynamic__prev-btn",
    buttonNext: "sv-paneldynamic__next-btn",
    progressContainer: "sv-paneldynamic__progress-container",
    progress: "sv-progress",
    progressBar: "sv-progress__bar",
    progressText: "sv-progress__text"
  },
  multipletext: {
    root: "table",
    itemTitle: "",
    itemValue: "sv_q_mt_item_value form-control"
  },
  radiogroup: {
    root: "sv_qcbc form-inline",
    item: "radio",
    itemInline: "sv_q_radiogroup_inline",
    label: "",
    itemControl: "",
    itemDecorator: "sv-hidden",
    controlLabel: "",
    materialDecorator: "circle",
    other: "sv_q_radiogroup_other form-control",
    clearButton: "sv_q_radiogroup_clear button",
    column: "sv_q_select_column"
  },
  imagepicker: {
    root: "sv_imgsel",
    item: "sv_q_imgsel",
    itemInline: "sv_q_imagepicker_inline",
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
    maxText: "sv_q_rating_max_text",
    disabled: ""
  },
  text: "form-control",
  expression: "form-control",
  file: {
    root: "sv_q_file",
    placeholderInput: "sv_q_file_placeholder",
    preview: "sv_q_file_preview",
    removeButton: "sv_q_file_remove_button",
    fileInput: "sv_q_file_input",
    removeFile: "sv_q_file_remove",
    fileDecorator: "sv-hidden"
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

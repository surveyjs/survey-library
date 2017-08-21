import {surveyCss} from "./cssstandard";

export var defaultBootstrapMaterialCss = {
    root: "",
    header: "panel-heading",
    body: "panel-body",
    footer: "panel-footer",
    navigationButton: "", navigation: { complete: "sv_complete_btn", prev: "sv_prev_btn", next: "sv_next_btn" },
    progress: "progress center-block", progressBar: "progress-bar",
    pageTitle: "",
    row: "",
    question: { mainRoot: "form-group", title: "", description: "", comment: "form-control", required: "", titleRequired: "", indent: 20 },
    error: { root: "alert alert-danger", icon: "glyphicon glyphicon-exclamation-sign", item: "" },

    checkbox: { root: "form-inline", item: "checkbox", other: "" },
    comment: "form-control",
    dropdown: { root: "", control: "form-control", other: "" },
    matrix: { root: "table", row: "form-group", label: "radio-inline", itemValue: "form-control" },
    matrixdropdown: { root: "table", itemValue: "form-group" },
    matrixdynamic: { root: "table", button: "button" },
    paneldynamic: { root: "", button: "button" },
    multipletext: { root: "table", itemTitle: "", row: "form-group", itemValue: "form-control" },
    radiogroup: { root: "form-inline", item: "radio-inline", label: "radio-inline", other: "" },
    rating: { root: "btn-group", item: "btn btn-default" },
    text: "form-control",
    saveData: {root: "", saving: "alert alert-info", error: "alert alert-danger", success: "alert alert-success", saveAgainButton: ""},
    window: {
        root: "modal-content", body: "modal-body",
        header: {
            root: "modal-header panel-title", title: "pull-left", button: "glyphicon pull-right",
            buttonExpanded: "glyphicon pull-right glyphicon-chevron-up", buttonCollapsed: "glyphicon pull-right glyphicon-chevron-down"
        }
    }
};
surveyCss["bootstrapmaterial"] = defaultBootstrapMaterialCss;
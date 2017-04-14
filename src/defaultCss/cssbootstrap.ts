import {surveyCss} from "./cssstandard";

export var defaultBootstrapCss = {
    root: "",
    header: "panel-heading",
    body: "panel-body",
    footer: "panel-footer",
    navigationButton: "", navigation: { complete: "", prev: "", next: "" },
    progress: "progress center-block", progressBar: "progress-bar",
    pageTitle: "",
    row: "",
    question: { root: "form-group", title: "", comment: "form-control", indent: 20 },
    error: { root: "alert alert-danger", icon: "glyphicon glyphicon-exclamation-sign", item: "" },

    checkbox: { root: "form-inline", item: "checkbox", other: "" },
    comment: "form-control",
    dropdown: { root: "", control: "form-control" },
    matrix: { root: "table", row: "form-group", label: "radio", itemValue: "form-control" },
    matrixdropdown: { root: "table", itemValue: "form-group" },
    matrixdynamic: { root: "table", button: "button" },
    multipletext: { root: "table", itemTitle: "", row: "form-group", itemValue: "form-control" },
    radiogroup: { root: "form-inline", item: "radio", label: "", other: "" },
    rating: { root: "btn-group", item: "btn btn-default" },
    text: "form-control",
    window: {
        root: "modal-content", body: "modal-body",
        header: {
            root: "modal-header panel-title", title: "pull-left", button: "glyphicon pull-right",
            buttonExpanded: "glyphicon pull-right glyphicon-chevron-up", buttonCollapsed: "glyphicon pull-right glyphicon-chevron-down"
        }
    }
};
surveyCss["bootstrap"] = defaultBootstrapCss;
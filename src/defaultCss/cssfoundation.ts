import {surveyCss} from "./cssstandard";

export var defaultFoundationCss = {
    root: "card",
    header: "card-divider",
    body: "card-section",
    footer: "",
    navigationButton: "",
    navigation: { complete: "sv_complete_btn button", prev: "sv_prev_btn button", next: "sv_next_btn button" },
    progress: "progress center-block", progressBar: "progress",
    pageTitle: "",
    row: "",
    question: { root: "", title: "", comment: "", indent: 20 },
    error: { root: "alert alert-danger", icon: "glyphicon glyphicon-exclamation-sign", item: "" },
    checkbox: { root: "", item: "checkbox", other: "" },
    comment: "",
    dropdown: { root: "", control: "" },
    matrix: { root: "table" },
    matrixdropdown: { root: "table" },
    matrixdynamic: { root: "table", button: "button" },
    multipletext: { root: "table", itemTitle: "", itemValue: "" },
    radiogroup: { root: "", item: "radio", label: "", other: "" },
    rating: { root: "button-group", item: "button" },
    text: "",
    window: {
        root: "modal-content", body: "modal-body",
        header: {
            root: "modal-header panel-title", title: "pull-left", button: "glyphicon pull-right",
            buttonExpanded: "glyphicon pull-right glyphicon-chevron-up", buttonCollapsed: "glyphicon pull-right glyphicon-chevron-down"
        }
    }
};
surveyCss["foundation"] = defaultFoundationCss;

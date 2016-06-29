module Survey {
    export var defaultBootstrapCss = {
        header: "panel-heading",
        body: "panel-body",
        footer: "panel-footer",
        navigationButton: "button",
        progress: "progress center-block",
        pageTitle: "",
        question: { root: "", title: "", comment: "form-control", indent: 20 },
        error: { root: "alert alert-danger", item: "glyphicon glyphicon-exclamation-sign" },

        checkbox: { root: "form-inline", item: "checkbox", other: "" },
        comment: "form-control",
        dropdown: "form-control",
        matrix: { root: "table" },
        matrixdropdown: { root: "table" },
        multipletext: { root: "table", itemTitle: "", itemValue: "form-control" },
        radiogroup: { root: "form-inline", item: "radio", other: "" },
        rating: { root: "btn-group", item: "btn btn-default" },
        text: "form-control"
    };
}
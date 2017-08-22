export var surveyCss = {
    currentType: "",
    getCss: function () {
        var loc = this.currentType ? this[this.currentType] : defaultStandardCss;
        if (!loc) loc = defaultStandardCss;
        return loc;
    },
};

export var defaultStandardCss = {
    root: "sv_main",
    header: "",
    body: "sv_body",
    footer: "sv_nav",
    navigationButton: "", navigation: { complete: "sv_complete_btn", prev:"sv_prev_btn", next: "sv_next_btn"},
    progress: "sv_progress", progressBar: "",
    pageTitle: "sv_p_title",
    row: "sv_row",
    question: { mainRoot: "sv_q", title: "sv_q_title", description: "sv_q_description", comment: "", required: "", titleRequired: "", indent: 20 },
    error: { root: "sv_q_erbox", icon: "", item: "" },

    checkbox: { root: "sv_qcbc", item: "sv_q_checkbox", other: "sv_q_other" },
    comment: "",
    dropdown: { root: "", control: "", other: "sv_q_other" },
    matrix: { root: "sv_q_matrix" },
    matrixdropdown: { root: "sv_q_matrix" },
    matrixdynamic: { root: "table", button: "" },
    paneldynamic: { root: "", button: "" },
    multipletext: { root: "", itemTitle: "", row: "", itemValue: "" },
    radiogroup: { root: "sv_qcbc", item: "sv_q_radiogroup", label: "", other: "sv_q_other" },
    rating: { root: "sv_q_rating", item: "sv_q_rating_item" },
    text: "",
    saveData: {root: "", saving: "", error: "", success: "", saveAgainButton: ""},
    window: {
        root: "sv_window", body: "sv_window_content",
        header: {
            root: "sv_window_title", title: "", button: "", buttonExpanded: "", buttonCollapsed: ""
        }
    }
};

surveyCss["standard"] = defaultStandardCss;

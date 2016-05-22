/// <reference path="template.ko.html.ts" />
/// <reference path="../kosurvey.ts" />
module Survey {
    export class Survey extends SurveyBase {
        constructor(jsonObj: any = null, renderedElement: any = null, css: any = null) {
            super(jsonObj, renderedElement, css);
        }
        protected getTemplate(): string { return template.ko.html; }
        protected createCssObject(): any {
            return {
                root: "sv_main",
                header: "",
                body: "sv_body",
                footer: "sv_nav",
                navigationButton: "",
                progress: "sv_progress",
                pageTitle: "sv_p_title",
                question: { root: "sv_q", title: "sv_q_title", comment: "" },
                error: { root: "sv_q_erbox", item: "" },

                checkbox: { root: "sv_qcbc", item: "sv_q_checkbox", other: "sv_q_other" },
                comment: "",
                dropdown: "",
                matrix: { root: "sv_q_matrix" },
                matrixdropdown: { root: "sv_q_matrix" },
                multipletext: { root: "", itemTitle: "", itemValue: "" },
                radiogroup: { root: "sv_qcbc", item: "sv_q_radiogroup", other: "sv_q_other" },
                rating: { root: "sv_q_rating", item: "" },
                text: ""
            };
        }
    }
}

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
                header: "panel-heading",
                body: "panel-body",
                footer: "panel-footer",
                navigationButton: "button",
                progress: "progress center-block",
                pageTitle: "",
                question: { root: "", title: "", comment: "form-control" },
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
    }
}

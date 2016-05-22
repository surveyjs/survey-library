/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurvey.tsx" />
/// <reference path="reactSurveyProgressBootstrap.tsx" />

class ReactSurvey extends ReactSurveyBase {
    constructor(props: any) {
        super(props);
    }
    public renderError(key: string, errorText: string): JSX.Element {
        return <div  key={key}>
                <span className={this.css.error.item} aria-hidden="true"></span>
                <span> {errorText}</span>
            </div>
    }
    protected renderProgress(isTop: Boolean): JSX.Element {
        return <ReactSurveyProgress survey = {this.survey} css={this.css} isTop = {isTop} />;
    }
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
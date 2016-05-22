/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="reactSurveyProgressStandard.tsx" />

class ReactSurvey extends ReactSurveyBase {
    constructor(props: any) {
        super(props);
    }
    protected renderProgress(isTop: Boolean): JSX.Element {
        return <ReactSurveyProgress survey = {this.survey} css={this.css} isTop = {isTop} />;
    }
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
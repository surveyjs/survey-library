/// <reference path="../reactSurvey.tsx" />
/// <reference path="reactSurveyProgressBootstrap.tsx" />
/// <reference path="../../defaultCss/cssbootstrap.ts" />

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
    protected createCssObject(): any { return Survey.defaultBootstrapCss; }
}
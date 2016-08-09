/// <reference path="../../../typings/index.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurveyProgress.tsx" />

class ReactSurveyProgress extends ReactSurveyProgressBase {
    constructor(props: any) {
        super(props);
    }
    render(): JSX.Element {
        var style = this.isTop ? {} : { marginTop: "10px", marginBottom: "5px" };
        return (<div className={this.css.progress} style={ style }>{this.progressText}</div>);
    }
}
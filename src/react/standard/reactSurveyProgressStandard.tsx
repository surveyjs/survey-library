/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurveyProgress.tsx" />

class ReactSurveyProgress extends ReactSurveyProgressBase {
    constructor(props: any) {
        super(props);
    }
    render(): JSX.Element {
        var style = this.isTop ? {} : { marginTop: "10px" };
        return (<div className="sv_progress" style={ style }>{this.progressText}</div>);
    }
}
/// <reference path="../../../typings/react/react.d.ts" />
/// <reference path="../../survey.ts" />
/// <reference path="../reactSurveyProgress.tsx" />

class ReactSurveyProgress extends ReactSurveyProgressBase {
    constructor(props: any) {
        super(props);
    }
    render(): JSX.Element {
        var style = this.isTop ? { width: "60%" } : { width: "60%", marginTop:"10px"};
        var progressStyle = {width: this.progress + "%"};
        return (<div className="progress center-block" style={style}>
            <div style={progressStyle} className="progress-bar" role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <span>{this.progressText}</span>
            </div>
        </div>);
    }
}
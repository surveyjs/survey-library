/// <reference path="../../typings/index.d.ts" />
/// <reference path="../survey.ts" />

class ReactSurveyProgress extends React.Component<any, any> {
    private survey: Survey.SurveyModel;
    protected isTop: boolean;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.survey = props.survey;
        this.css = props.css;
        this.isTop = props.isTop;
    }
    componentWillReceiveProps(nextProps: any) {
        this.survey = nextProps.survey;
        this.css = nextProps.css;
        this.isTop = nextProps.isTop;
    }
    protected get progress(): number { return this.survey.getProgress(); }
    protected get progressText(): string { return this.survey.progressText; }
    render(): JSX.Element {
        var style = this.isTop ? { width: "60%" } : { width: "60%", marginTop: "10px" };
        var progressStyle = { width: this.progress + "%" };
        return (<div className={this.css.progress} style={style}>
            <div style={progressStyle} className={this.css.progressBar} role="progressbar" aria-valuemin="0" aria-valuemax="100">
                <span>{this.progressText}</span>
                </div>
            </div>);
    }
}
import ReactSurveyProgressBase from '../reactSurveyProgress';

export class ReactSurveyProgress extends ReactSurveyProgressBase {
    constructor(props: any) {
        super(props);
    }
    render(): JSX.Element {
        var style = this.isTop ? {} : { marginTop: "10px", marginBottom: "5px" };
        return (<div className={this.css.progress} style={ style }>{this.progressText}</div>);
    }
}
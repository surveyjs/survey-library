import ReactSurvey from './reactSurveyStandard';

export default class ReactSurveyWindow extends ReactSurvey {
    private title: string;
    constructor(props: any) {
        super(props);
        this.handleOnExpanded = this.handleOnExpanded.bind(this);
    }
    handleOnExpanded(event) {
        this.state.expanded = !this.state.expanded;
        this.setState(this.state);
    }
    render(): JSX.Element {
        if (this.state.hidden) return null;
        var header = this.renderHeader();
        var body = this.state.expanded ? this.renderBody() : null;
        return <div className="sv_window">
            {header}
            {body}
            </div>;
        
    }
    protected renderHeader(): JSX.Element {
        var styleA = { width: "100%" };
        return <div className="sv_window_title">
            <a href="#" onClick={this.handleOnExpanded} style={styleA}>
                <span>{this.title}</span>
            </a>
        </div>;
    }
    protected renderBody(): JSX.Element {
        return <div class="sv_window_content">
        {this.renderSurvey() }
            </div>
    }
    protected updateSurvey(newProps: any) {
        super.updateSurvey(newProps);
        this.title = newProps.title ? newProps.title : this.survey.title;
        var hasExpanded = newProps["expanded"] ? newProps.expanded : false;
        this.state = { expanded: hasExpanded, hidden: false };
        var self = this;
        this.survey.onComplete.add(function (s: Survey.SurveyModel) {
            self.state.hidden = true;
            self.setState(self.state);
        });
    }
}
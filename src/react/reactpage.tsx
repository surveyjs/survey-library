/// <reference path="../survey.ts" />
/// <reference path="../../typings/react/react.d.ts" />
class ReactSurveyPage extends React.Component<any, any> {
    private page: Survey.PageModel;
    private survey: Survey.SurveyModel;
    constructor(props: any) {
        super(props);
        this.page = props.page;
        this.survey = props.survey;
    }
    componentWillReceiveProps(nextProps: any) {
        this.page = nextProps.page;
        this.survey = nextProps.survey;
    }
    render(): JSX.Element {
        if (this.page == null || this.survey == null) return;
        var title = this.renderTitle();
        var questions = [];
        for (var i = 0; i < this.page.questions.length; i++) {
            var question = this.page.questions[i];
            questions.push(<ReactSurveyQuestion key={question.name} question={question} />);
        }
        return (
            <div>
                {title}
                {questions}
            </div>
        );
    }
    renderTitle(): JSX.Element {
        if (!this.page.title || !this.survey.showPageTitles) return null;
        var text = this.page.title;
        if (this.page.num > 0) {
            text = this.page.num + ". " + text;
        }
        return (<div class="sv_p_title">{text}</div>);
    }
}
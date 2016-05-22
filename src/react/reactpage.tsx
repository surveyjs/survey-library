/// <reference path="../survey.ts" />
/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="reactquestion.tsx" />
class ReactSurveyPage extends React.Component<any, any> {
    private page: Survey.PageModel;
    private survey: Survey.SurveyModel;
    private creator: Survey.IReactSurveyCreator;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.page = props.page;
        this.survey = props.survey;
        this.creator = props.creator;
        this.css = props.css;
    }
    componentWillReceiveProps(nextProps: any) {
        this.page = nextProps.page;
        this.survey = nextProps.survey;
        this.creator = nextProps.creator;
        this.css = nextProps.css;
    }
    render(): JSX.Element {
        if (this.page == null || this.survey == null || this.creator == null) return;
        var title = this.renderTitle();
        var questions = [];
        for (var i = 0; i < this.page.questions.length; i++) {
            var question = this.page.questions[i];
            questions.push(this.createQuestion(question));
        }
        return (
            <div>
                {title}
                {questions}
                </div>
        );
    }
    protected createQuestion(question: Survey.QuestionBase): JSX.Element {
        return <ReactSurveyQuestion key={question.name} question={question} creator={this.creator} css={this.css} />;
    }
    protected renderTitle(): JSX.Element {
        if (!this.page.title || !this.survey.showPageTitles) return null;
        var text = this.page.processedTitle;
        if (this.page.num > 0) {
            text = this.page.num + ". " + text;
        }
        return (<h4 className={this.css.pageTitle}>{text}</h4>);
    }
}
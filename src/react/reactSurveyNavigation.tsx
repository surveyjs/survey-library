export default class ReactSurveyNavigation extends React.Component<any, any> {
    private survey: Survey.SurveyModel;
    protected css: any;
    constructor(props: any) {
        super(props);
        this.survey = props.survey;
        this.css = props.css;
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleCompleteClick = this.handleCompleteClick.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        this.survey = nextProps.survey;
        this.css = nextProps.css;
    }
    handlePrevClick(event) {
        this.survey.prevPage();
    }
    handleNextClick(event) {
        this.survey.nextPage();
    }
    handleCompleteClick(event) {
        this.survey.completeLastPage();
    }
    render(): JSX.Element {
        if (!this.survey) return null;
        var prevButton = !this.survey.isFirstPage ? this.renderButton(this.handlePrevClick, this.survey.pagePrevText, this.css.navigation.prev) : null;
        var nextButton = !this.survey.isLastPage ? this.renderButton(this.handleNextClick, this.survey.pageNextText, this.css.navigation.next) : null;
        var completeButton = this.survey.isLastPage ? this.renderButton(this.handleCompleteClick, this.survey.completeText, this.css.navigation.complete) : null;
        return (
            <div className={this.css.footer}>
                {prevButton}
                {nextButton}
                {completeButton}
                </div>
        );
    }
    protected renderButton(click: any, text: string, btnClassName: string): JSX.Element {
        var style = { marginRight: "5px" };
        var className = this.css.navigationButton + (btnClassName ? ' ' + btnClassName : "");
        return <input className={className} style={style} type="button" onClick={click} value={text} />;
    }
}
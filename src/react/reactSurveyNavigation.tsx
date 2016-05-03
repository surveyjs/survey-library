class ReactSurveyNavigationBase extends React.Component<any, any> {
    private survey: Survey.SurveyModel;
    constructor(props: any) {
        super(props);
        this.survey = props.survey;
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handleCompleteClick = this.handleCompleteClick.bind(this);
    }
    componentWillReceiveProps(nextProps: any) {
        this.survey = nextProps.survey;
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
        var prevButton = !this.survey.isFirstPage ? this.renderButton(this.handlePrevClick, this.survey.pagePrevText) : null;
        var nextButton = !this.survey.isLastPage ? this.renderButton(this.handleNextClick, this.survey.pageNextText) : null;
        var completeButton = this.survey.isLastPage ? this.renderButton(this.handleCompleteClick, this.survey.completeText) : null;
        return (
            <div className={this.mainClassName}>
                {prevButton}
                {nextButton}
                {completeButton}
                </div>
        );
    }
    protected renderButton(click: any, text: string): JSX.Element {
        var style = { marginRight: "5px" };
        return <input className={this.buttonClassName} style={style} type="button" onClick={click} value={text} />;
    }
    protected get mainClassName() { return ""; }
    protected get buttonClassName() { return ""; }
}
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
class ReactSurveyBase extends React.Component<any, any> {
    private survey: Survey.SurveyModel;
    constructor(props: any) {
        super(props);
        this.updateSurvey(props);
    }
    componentWillReceiveProps(nextProps: any) {
        this.updateSurvey(nextProps);
    }
    render(): JSX.Element {
        var title = this.survey.title && this.survey.showTitle ? <h2>{this.survey.title}</h2> : null;
        var currentPage = this.survey.currentPage ? <ReactSurveyPage survey={this.survey} page={this.survey.currentPage} /> : null;
        var buttons = (currentPage) ? <ReactSurveyButtons survey = {this.survey} /> : null;
        if (!currentPage) {
            currentPage = <span>There is no any visible page or visible question in the survey.</span>;
        }

        return (
            <div className="sv_main">
            {title}
            {currentPage}
            {buttons}
            </div>
        );
    }
    private updateSurvey(newProps: any) {
        if (newProps && newProps.json) {
            this.survey = new Survey.SurveyModel(newProps.json);
        } else {
            this.survey = new Survey.SurveyModel();
        }
        if (newProps && newProps.data) {
            this.survey.data = newProps.data;
        }
        //TODO
        this.survey.currentPage = this.survey.visiblePages.length > 0 ? this.survey.visiblePages[0] : null;
        var self = this;
        this.survey.onCurrentPageChanged.add((sender, options) => {
            self.changeState();
        });
        this.survey.onVisibleChanged.add((sender, options) => {
            if (options.question && options.question.react) {
                options.question.react.forceUpdate(); //TODO
            }
        });
        this.survey.onValueChanged.add((sender, options) => {
            if (!newProps) return;
            if (newProps.data) {
                newProps.data[options.name] = options.value;
            }
            if (newProps.onValueChanged) {
                newProps.onValueChanged(sender, options);
            }
        });
    }
    private changeState() {
        this.forceUpdate(); //probably change it later.
    }
}

class ReactSurveyButtons extends React.Component<any, any> {
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
        var prevButton = !this.survey.isFirstPage ? <input type="button" onClick={this.handlePrevClick} value={this.survey.pagePrevText} /> : null;
        var nextButton = !this.survey.isLastPage ? <input type="button" onClick={this.handleNextClick} value={this.survey.pageNextText} /> : null;
        var completeButton = this.survey.isLastPage ? <input type="button" onClick={this.handleCompleteClick} value={this.survey.completeText} /> : null;
        return (
            <div className="sv_nav">
                {prevButton}
                {nextButton}
                {completeButton}
                </div>
        );
    }
}

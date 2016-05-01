/// <reference path="../../typings/react/react.d.ts" />
/// <reference path="../survey.ts" />

class ReactSurveyProgressBase extends React.Component<any, any> {
    private survey: Survey.SurveyModel;
    protected isTop: boolean;
    constructor(props: any) {
        super(props);
        this.survey = props.survey;
        this.isTop = props.isTop;
    }
    componentWillReceiveProps(nextProps: any) {
        this.survey = nextProps.survey;
        this.isTop = nextProps.isTop;
    }
    protected get progress(): number { return this.survey.getProgress(); }
    protected get progressText(): string { return this.survey.progressText; }
}
export default class ReactSurveyProgressBase extends React.Component<any, any> {
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
}
import {Base, IQuestion, IConditionRunner, ISurveyData, ISurvey, HashTable} from './base';
import {JsonObject} from './jsonobject';
import {ConditionRunner} from './conditions';

export class QuestionBase extends Base implements IQuestion, IConditionRunner {
    private static questionCounter = 100;
    private static getQuestionId(): string {
        return "sq_" + QuestionBase.questionCounter++;
    }
    protected data: ISurveyData;
    protected survey: ISurvey;
    private conditionRunner: ConditionRunner = null;
    public visibleIf: string = "";
    private idValue: string;
    private visibleValue: boolean = true;
    public startWithNewLine: boolean = true;
    private visibleIndexValue: number = -1;
    public width: string = "";
    private renderWidthValue: string = "";
    private rightIndentValue: number = 0;
    public indent: number = 0;
    focusCallback: () => void;
    renderWidthChangedCallback: () => void;
    rowVisibilityChangedCallback: () => void;
    visibilityChangedCallback: () => void;
    visibleIndexChangedCallback: () => void;

    constructor(public name: string) {
        super();
        this.idValue = QuestionBase.getQuestionId();
        this.onCreating();
    }
    public get visible(): boolean { return this.visibleValue; }
    public set visible(val: boolean) {
        if (val == this.visible) return;
        this.visibleValue = val;
        this.fireCallback(this.visibilityChangedCallback);
        this.fireCallback(this.rowVisibilityChangedCallback);
        if (this.survey) {
            this.survey.questionVisibilityChanged(<IQuestion>this, this.visible);
        }
    }
    public get visibleIndex(): number { return this.visibleIndexValue; }
    public hasErrors(fireCallback: boolean = true): boolean { return false; }
    public get hasTitle(): boolean { return false; }
    public get hasComment(): boolean { return false; }
    public get id(): string { return this.idValue; }
    public get renderWidth(): string { return this.renderWidthValue; }
    public set renderWidth(val: string) {
        if (val == this.renderWidth) return;
        this.renderWidthValue = val;
        this.fireCallback(this.renderWidthChangedCallback);
    }
    public get rightIndent(): number { return this.rightIndentValue; }
    public set rightIndent(val: number) {
        if (val == this.rightIndent) return;
        this.rightIndentValue = val;
        this.fireCallback(this.renderWidthChangedCallback);
    }
    public focus() {
        var el = document.getElementById(this.id);
        if (!el || !el.scrollIntoView) return;
        var elemTop = el.getBoundingClientRect().top;
        if (elemTop < 0) {
            el.scrollIntoView();
            this.fireCallback(this.focusCallback);
        }
    }
    setData(newValue: ISurveyData) {
        this.data = newValue;
        this.survey = (newValue && newValue["questionAdded"]) ? <ISurvey>newValue : null;
        this.onSetData();
    }
    protected fireCallback(callback: () => void) {
        if (callback) callback();
    }
    protected onSetData() { }
    protected onCreating() { }
    public runCondition(values: HashTable<any>) {
        if (!this.visibleIf) return;
        if (!this.conditionRunner) this.conditionRunner = new ConditionRunner(this.visibleIf);
        this.conditionRunner.expression = this.visibleIf;
        this.visible = this.conditionRunner.run(values);
    }
    //IQuestion
    onSurveyValueChanged(newValue: any) {
    }
    onSurveyLoad() {
    }
    setVisibleIndex(value: number) {
        if (this.visibleIndexValue == value) return;
        this.visibleIndexValue = value;
        this.fireCallback(this.visibleIndexChangedCallback);
    }
    supportGoNextPageAutomatic() { return false; }
}
JsonObject.metaData.addClass("questionbase", ["!name", { name: "visible:boolean", default: true }, "visibleIf:text",
    { name: "width" }, { name: "startWithNewLine:boolean", default: true}, {name: "indent:number", default: 0, choices: [0, 1, 2, 3]}]);
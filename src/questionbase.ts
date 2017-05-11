import {Base, IQuestion, IConditionRunner, ISurveyData, ISurvey, HashTable, Event} from './base';
import {QuestionCustomWidget} from './questionCustomWidgets';
import {JsonObject} from './jsonobject';
import {ConditionRunner} from './conditions';
import {ILocalizableOwner} from "./localizablestring";

/**
 * A base class for all questions. QuestionBase doesn't have information about title, values, errors and so on.
 * Those properties are defined in the Question class.
 */
export class QuestionBase extends Base implements IQuestion, IConditionRunner, ILocalizableOwner {
    private static questionCounter = 100;
    private static getQuestionId(): string {
        return "sq_" + QuestionBase.questionCounter++;
    }
    protected data: ISurveyData = null;
    private surveyValue: ISurvey = null;
    private conditionRunner: ConditionRunner = null;
    public customWidget: QuestionCustomWidget;
    public customWidgetData = { isNeedRender: true };
    public visibleIf: string = "";
    private idValue: string;
    private visibleValue: boolean = true;
    private startWithNewLineValue: boolean = true;
    private visibleIndexValue: number = -1;
    public width: string = "";
    private renderWidthValue: string = "";
    private rightIndentValue: number = 0;
    public indent: number = 0;
    public localeChanged: Event<(sender: QuestionBase) => any, any> = new Event<(sender: QuestionBase) => any, any>();
    focusCallback: () => void;
    renderWidthChangedCallback: () => void;
    rowVisibilityChangedCallback: () => void;
    startWithNewLineChangedCallback: () => void;
    visibilityChangedCallback: () => void;
    visibleIndexChangedCallback: () => void;
    readOnlyChangedCallback: () => void;

    constructor(public name: string) {
        super();
        this.idValue = QuestionBase.getQuestionId();
        this.onCreating();
    }
    public get isPanel(): boolean { return false; }
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
    public get isVisible(): boolean { return this.visible || (this.survey && this.survey.isDesignMode); }
    public get isReadOnly() { return true; }
    public get visibleIndex(): number { return this.visibleIndexValue; }
    public hasErrors(fireCallback: boolean = true): boolean { return false; }
    public get currentErrorCount(): number { return 0; }
    public get hasTitle(): boolean { return false; }
    public get hasInput(): boolean { return false; }
    public get hasComment(): boolean { return false; }
    public get id(): string { return this.idValue; }
    public get startWithNewLine(): boolean { return this.startWithNewLineValue; }
    public set startWithNewLine(value: boolean) {
        if(this.startWithNewLine == value) return;
        this.startWithNewLineValue = value;
        if(this.startWithNewLineChangedCallback) this.startWithNewLineChangedCallback();
    }
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
    public focus(onError: boolean = false) { }
    setData(newValue: ISurveyData) {
        this.data = newValue;
        if(newValue && newValue["questionAdded"]) {
            this.surveyValue = <ISurvey>newValue;
        }
        this.onSetData();
    }
    public get survey(): ISurvey { return this.surveyValue; }
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
    public onSurveyValueChanged(newValue: any) {
    }
    public onSurveyLoad() {
    }
    public setVisibleIndex(value: number) {
        if (this.visibleIndexValue == value) return;
        this.visibleIndexValue = value;
        this.fireCallback(this.visibleIndexChangedCallback);
    }
    public supportGoNextPageAutomatic() { return false; }
    public clearUnusedValues() {}
    public onLocaleChanged() {
        this.localeChanged.fire(this, this.getLocale());
    }
    onReadOnlyChanged() {
        
    }
    //ILocalizableOwner
    public getLocale(): string { return this.data ? (<ILocalizableOwner><any>this.data).getLocale() : ""; }
    public getMarkdownHtml(text: string)  { return this.data ? (<ILocalizableOwner><any>this.data).getMarkdownHtml(text) : null; }
}
JsonObject.metaData.addClass("questionbase", ["!name", { name: "visible:boolean", default: true }, "visibleIf:expression",
    { name: "width" }, { name: "startWithNewLine:boolean", default: true}, {name: "indent:number", default: 0, choices: [0, 1, 2, 3]}]);

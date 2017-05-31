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
    /**
     * The link to the custom widget.
     */
    public customWidget: QuestionCustomWidget;
    customWidgetData = { isNeedRender: true };
    /**
     * An expression that returns true or false. If it returns a true the Question becomes visible and if it returns false the Panel becomes invisible. The library perform the expression on survey start and on changing a question value. If the property is empty then visible property is used.
     * @see visible
     */
    public visibleIf: string = "";
    private idValue: string;
    private visibleValue: boolean = true;
    private startWithNewLineValue: boolean = true;
    private visibleIndexValue: number = -1;
    /**
     * Use it to set the specific width to the question.
     */
    public width: string = "";
    private renderWidthValue: string = "";
    private rightIndentValue: number = 0;
    private indentValue: number = 0;
    /**
     * The event is fired when the survey change it's locale
     * @see SurveyModel.locale
     */
    public localeChanged: Event<(sender: QuestionBase) => any, any> = new Event<(sender: QuestionBase) => any, any>();
    focusCallback: () => void;
    renderWidthChangedCallback: () => void;
    rowVisibilityChangedCallback: () => void;
    startWithNewLineChangedCallback: () => void;
    visibilityChangedCallback: () => void;
    visibleIndexChangedCallback: () => void;
    readOnlyChangedCallback: () => void;
    surveyLoadCallback: () => void;

    constructor(public name: string) {
        super();
        this.idValue = QuestionBase.getQuestionId();
        this.onCreating();
    }
    /**
     * Always returns false.
     */
    public get isPanel(): boolean { return false; }
    /**
     * Use it to get/set the question visibility.
     * @see visibleIf
     */
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
    /**
     * Returns true if the question is visible or survey is in design mode right now.
     */
    public get isVisible(): boolean { return this.visible || (this.survey && this.survey.isDesignMode); }
    /**
     * Returns true if there is no input in the question. It always returns true for html question or survey is in 'display' mode.
     * @see QuestionHtmlModel
     * @see SurveyModel.mode
     * @see Question.readOnly
     */
    public get isReadOnly() { return true; }
    /**
     * Returns the visible index of the question in the survey. It can be from 0 to all visible questions count - 1
     */
    public get visibleIndex(): number { return this.visibleIndexValue; }
    /**
     * Returns true if there is at least one error on question validation.
     * @param fireCallback set it to true to show error in UI
     */
    public hasErrors(fireCallback: boolean = true): boolean { return false; }
    /**
     * Returns the number of erros on validation.
     */
    public get currentErrorCount(): number { return 0; }
    /**
     * Returns false if the question doesn't have a title property, for example: QuestionHtmlModel
     */
    public get hasTitle(): boolean { return false; }
    /**
     * Returns false if the question doesn't have an input element, for example: QuestionHtmlModel
     */
    public get hasInput(): boolean { return false; }
    /**
     * Returns true, if you can have a comment for the question.
     */
    public get hasComment(): boolean { return false; }
    /**
     * Returns the unique identificator. It is generated automatically.
     */
    public get id(): string { return this.idValue; }
    /**
     * The Question renders on the new line if the property is true. If the property is false, the question tries to render on the same line/row with a previous question/panel.
     */
    public get startWithNewLine(): boolean { return this.startWithNewLineValue; }
    public set startWithNewLine(value: boolean) {
        if(this.startWithNewLine == value) return;
        this.startWithNewLineValue = value;
        if(this.startWithNewLineChangedCallback) this.startWithNewLineChangedCallback();
    }
    /**
     * The rendered width of the question.
     */
    public get renderWidth(): string { return this.renderWidthValue; }
    public set renderWidth(val: string) {
        if (val == this.renderWidth) return;
        this.renderWidthValue = val;
        this.fireCallback(this.renderWidthChangedCallback);
    }
    /**
     * Set it different from 0 to increase the left padding.
     */
    public get indent(): number { return this.indentValue; }
    public set indent(val: number) {
        if (val == this.indent) return;
        this.indentValue = val;
        this.fireCallback(this.renderWidthChangedCallback);
    }
    /**
     * Set it different from 0 to increase the right padding.
     */
    public get rightIndent(): number { return this.rightIndentValue; }
    public set rightIndent(val: number) {
        if (val == this.rightIndent) return;
        this.rightIndentValue = val;
        this.fireCallback(this.renderWidthChangedCallback);
    }
    /**
     * Focus the question input.
     * @param onError Focus if there is an error.
     */
    public focus(onError: boolean = false) { }
    setData(newValue: ISurveyData) {
        this.data = newValue;
        if(newValue && newValue["questionAdded"]) {
            this.surveyValue = <ISurvey>newValue;
        }
        this.onSetData();
    }
    /**
     * Returns the survey object.
     */
    public get survey(): ISurvey { return this.surveyValue; }
    protected fireCallback(callback: () => void) {
        if (callback) callback();
    }
    protected onSetData() { }
    protected onCreating() { }
    /**
     * Run visibleIf expression. If visibleIf is not empty, then the results of performing the expression (true or false) set to the visible property.
     * @param values Typically survey results
     * @see visible
     * @see visibleIf
     */
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
        this.fireCallback(this.surveyLoadCallback);
    }
    protected get isLoadingFromJson(): boolean { return this.survey && this.survey.isLoadingFromJson; }
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
    onReadOnlyChanged() {}
    onAnyValueChanged(){}
    //ILocalizableOwner
    /**
     * Returns the current survey locale
     * @see SurveyModel.locale
     */
    public getLocale(): string { return this.data ? (<ILocalizableOwner><any>this.data).getLocale() : ""; }
    public getMarkdownHtml(text: string)  { return this.data ? (<ILocalizableOwner><any>this.data).getMarkdownHtml(text) : null; }
}
JsonObject.metaData.addClass("questionbase", ["!name", { name: "visible:boolean", default: true }, "visibleIf:expression",
    { name: "width" }, { name: "startWithNewLine:boolean", default: true}, {name: "indent:number", default: 0, choices: [0, 1, 2, 3]}]);

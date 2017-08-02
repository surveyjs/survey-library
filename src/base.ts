export interface HashTable<T> {
    [key: string]: T;
}
export interface ISurveyData {
    getValue(name: string): any;
    setValue(name: string, newValue: any);
    getComment(name: string): string;
    setComment(name: string, newValue: string);
    getAllValues(): any;
}
export interface ITextProcessor {
    processText(text: string, returnDisplayValue: boolean): string;
    processTextEx(text: string): any;
}
export interface ISurvey extends ITextProcessor {
    currentPage: IPage;
    pageVisibilityChanged(page: IPage, newValue: boolean);
    questionVisibilityChanged(question: IQuestion, newValue: boolean);
    questionAdded(question: IQuestion, index: number, parentPanel: any, rootPanel: any);
    panelAdded(panel: IElement, index: number, parentPanel: any, rootPanel: any);
    questionRemoved(question: IQuestion);
    panelRemoved(panel: IElement);
    validateQuestion(name: string): SurveyError;
    processHtml(html: string): string;
    isDisplayMode: boolean;
    isDesignMode: boolean;
    isLoadingFromJson: boolean;
    requiredText: string;
    questionStartIndex: string;
    questionTitleLocation: string;
    getQuestionTitleTemplate(): string;
    storeOthersAsComment: boolean;
    uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
    updateQuestionCssClasses(question: IQuestion, cssClasses: any);
    afterRenderQuestion(question: IQuestion, htmlElement);
    afterRenderPanel(panel: IElement, htmlElement);
    matrixRowAdded(question: IQuestion);
    matrixCellCreated(question: IQuestion, options: any);
    matrixCellValueChanged(question: IQuestion, options: any);
    matrixCellValidate(question: IQuestion, options: any): SurveyError;
}
export interface ISurveyImpl {
    geSurveyData(): ISurveyData;
    getSurvey(): ISurvey;
    getTextProcessor(): ITextProcessor;
}
export interface IConditionRunner {
    runCondition(values: HashTable<any>);
}
export interface ISurveyElement {
    setSurveyImpl(value: ISurveyImpl);
}
export interface IElement  extends IConditionRunner, ISurveyElement{
    name: string;
    visible: boolean;
    isVisible: boolean;
    rowVisibilityChangedCallback: () => void;
    startWithNewLineChangedCallback: () => void;
    renderWidth: string;
    width: string;
    rightIndent: number;
    startWithNewLine: boolean;
    isPanel: boolean;
    onSurveyLoad();
    onLocaleChanged();
    onAnyValueChanged(name: string);
}

export interface IQuestion extends IElement {
    hasTitle: boolean;
    setVisibleIndex(value: number);
    onSurveyValueChanged(newValue: any);
    onReadOnlyChanged();
    supportGoNextPageAutomatic(): boolean;
    clearUnusedValues();
    displayValue: any;
}
export interface IPanel extends IElement {
}
export interface IPage extends IConditionRunner {
    visible: boolean;
    onSurveyLoad();
}
/**
 * The base class for SurveyJS objects.
 */
export class Base {
    public static commentPrefix: string = "-Comment";
    /**
     * A static methods that returns true if a value underfined, null, empty string or empty array.
     * @param value 
     */
    public static isValueEmpty(value: any) {
        if (Array.isArray(value) && value.length === 0) return true;
        if(value && (typeof value === 'string' || value instanceof String)) {
            value = value.trim();
        }
        return !value && value !== 0 && value !== false;
    }
    protected isLoadingFromJsonValue: boolean = false;
    /**
     * Returns the type of the object as a string as it represents in the json.
     */
    public getType(): string {
        throw new Error('This method is abstract');
    }
    /**
     * Returns true if the object is loading from Json at the current moment.
     */
    public get isLoadingFromJson() { return this.isLoadingFromJsonValue; }
    startLoadingFromJson() {
        this.isLoadingFromJsonValue = true;
    }
    endLoadingFromJson() {
        this.isLoadingFromJsonValue = false;
    }
    protected isTwoValueEquals(x: any, y: any): boolean {
        if (x === y) return true;
        if (!(x instanceof Object) || !(y instanceof Object)) return false;
        for (var p in x) {
            if (!x.hasOwnProperty(p)) continue;
            if (!y.hasOwnProperty(p)) return false;
            if (x[p] === y[p]) continue;
            if (typeof (x[p]) !== "object") return false;
            if (!this.isTwoValueEquals(x[p], y[p])) return false;
        }
        for (p in y) {
            if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) return false;
        }
        return true;
    }
}
export class SurveyError {
    public getText(): string {
        throw new Error('This method is abstract');
    }
}

export var SurveyPageId: string;
SurveyPageId = "sq_page";

export class SurveyElement extends Base implements ISurveyElement {
    private surveyImplValue: ISurveyImpl;
    private surveyDataValue: ISurveyData;
    private surveyValue: ISurvey;
    private textProcessorValue: ITextProcessor;
    private selectedElementInDesignValue: SurveyElement = this;
    public static ScrollElementToTop(elementId: string): boolean {
        if (!elementId) return false;
        var el = document.getElementById(elementId);
        if (!el || !el.scrollIntoView) return false;
        var elemTop = el.getBoundingClientRect().top;
        if (elemTop < 0)  el.scrollIntoView();
        return elemTop < 0;
    }
    public static GetFirstNonTextElement(elements: any) {
        if (!elements || !elements.length) return;
        for (var i = 0; i < elements.length; i++) {
            if (elements[i].nodeName != "#text" && elements[i].nodeName != "#comment") return elements[i];
        }
        return null;
    }
    public static FocusElement(elementId: string): boolean {
        if (!elementId) return false;
        var el = document.getElementById(elementId);
        if (el) {
            el.focus();
            return true;
        }
        return false;
    }
    public setSurveyImpl(value: ISurveyImpl) {
        this.surveyImplValue = value;
        if(!this.surveyImplValue) return;
        this.surveyDataValue = this.surveyImplValue.geSurveyData();
        this.surveyValue = this.surveyImplValue.getSurvey();
        this.textProcessorValue = this.surveyImplValue.getTextProcessor();
        this.onSetData();
    }
    protected get surveyImpl() { return this.surveyImplValue; }
    public get data(): ISurveyData { return this.surveyDataValue; }
    /**
     * Returns the survey object.
     */
    public get survey(): ISurvey { return this.surveyValue; }
    public get isLoadingFromJson() { 
        if(this.survey) return this.survey.isLoadingFromJson;
        return this["isLoadingFromJsonValue"]; //TODO for some reson compiler does not see public Base.isLoadingFromJson.
    }
    public getElementsInDesign(includeHidden: boolean = false): Array<IElement> { return []; }
    public get selectedElementInDesign(): SurveyElement { return this.selectedElementInDesignValue; }
    public set selectedElementInDesign(val: SurveyElement) { this.selectedElementInDesignValue = val; }

    public onSurveyLoad() {}        
    endLoadingFromJson() {
        super.endLoadingFromJson();
        if(!this.survey) {
            this.onSurveyLoad();
        }
    }
    protected get textProcessor() : ITextProcessor { return this.textProcessorValue; }
    protected onSetData() { }    
}

export class Event<T extends Function, Options>  {
    private callbacks: Array<T>;
    public get isEmpty(): boolean { return this.callbacks == null || this.callbacks.length == 0; }
    public fire(sender: any, options: Options) {
        if (this.callbacks == null) return;
        for (var i = 0; i < this.callbacks.length; i ++) {
            var callResult = this.callbacks[i](sender, options);

        }
    }
    public add(func: T) {
        if (this.callbacks == null) {
            this.callbacks = new Array<T>();
        }
        this.callbacks.push(func);
    }
    public remove(func: T) {
        if (this.callbacks == null) return;
        var index = this.callbacks.indexOf(func, 0);
        if (index != undefined) {
            this.callbacks.splice(index, 1);
        }
    }
}

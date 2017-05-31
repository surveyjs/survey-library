export interface HashTable<T> {
    [key: string]: T;
}
export interface ISurveyData {
    getValue(name: string): any;
    setValue(name: string, newValue: any);
    getComment(name: string): string;
    setComment(name: string, newValue: string);
}
export interface ITextProcessor {
    processText(text: string): string;
    processTextEx(text: string): any;
}
export interface ISurvey extends ISurveyData, ITextProcessor {
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
    getQuestionTitleTemplate(): string;
    storeOthersAsComment: boolean;
    uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
    afterRenderQuestion(question: IQuestion, htmlElement);
    afterRenderPanel(panel: IElement, htmlElement);
    matrixRowAdded(question: IQuestion);
    matrixCellCreated(question: IQuestion, options: any);
    matrixCellValueChanged(question: IQuestion, options: any);
}
export interface IConditionRunner {
    runCondition(values: HashTable<any>);
}
export interface IElement  extends IConditionRunner{
    name: string;
    visible: boolean;
    isVisible: boolean;
    setData(newValue: ISurveyData);
    rowVisibilityChangedCallback: () => void;
    startWithNewLineChangedCallback: () => void;
    renderWidth: string;
    width: string;
    rightIndent: number;
    startWithNewLine: boolean;
    isPanel: boolean;
    onSurveyLoad();
    onLocaleChanged();
}

export interface IQuestion extends IElement {
    hasTitle: boolean;
    setVisibleIndex(value: number);
    onSurveyValueChanged(newValue: any);
    onReadOnlyChanged();
    supportGoNextPageAutomatic(): boolean;
    clearUnusedValues();
    onAnyValueChanged();
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
    /**
     * A static methods that returns true if a value underfined, null, empty string or empty array.
     * @param value 
     */
    public static isValueEmpty(value: any) {
        if (Array.isArray(value) && value.length === 0) return true;
        return !value && value !== 0 && value !== false;
    }
    /**
     * Returns the type of the object as a string as it represents in the json.
     */
    public getType(): string {
        throw new Error('This method is abstract');
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
export class SurveyElement {
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

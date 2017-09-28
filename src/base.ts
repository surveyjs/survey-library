import {ILocalizableOwner, LocalizableString} from "./localizablestring";
import {HashTable, Helpers} from "./helpers";
import {ItemValue} from "./itemvalue";
import {CustomPropertiesCollection} from "./jsonobject";

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
    panelVisibilityChanged(panel: IPanel, newValue: boolean);
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
    questionErrorLocation: string;
    getQuestionTitleTemplate(): string;
    storeOthersAsComment: boolean;
    uploadFile(name: string, file: File, storeDataAsText: boolean, uploadingCallback: (status: string) => any): boolean;
    updateQuestionCssClasses(question: IQuestion, cssClasses: any);
    afterRenderQuestion(question: IQuestion, htmlElement);
    afterRenderPanel(panel: IElement, htmlElement);
    afterRenderPage(htmlElement);
    matrixRowAdded(question: IQuestion);
    matrixRowRemoved(question: IQuestion, rowIndex: number, row: any);
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
    updateCustomWidgets();
}

export interface IQuestion extends IElement {
    hasTitle: boolean;
    setVisibleIndex(value: number): number;
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
    public isValueEmpty(value: any) {
        return Helpers.isValueEmpty(value);
    }

    private propertyHash = {};
    private localizableStrings = {};
    private arraysInfo = {};
    private onPropChangeFunctions = [];
    protected isLoadingFromJsonValue: boolean = false;
    public onPropertyChanged: Event<(sender: Base, options: any) => any, any> = new Event<(sender: Base, options: any) => any, any>();
    setPropertyValueCoreHandler: (propertiesHash: any, name: string, val: any) => void;
    public constructor() {
        CustomPropertiesCollection.createProperties(this);
    }
    /**
     * Returns the type of the object as a string as it represents in the json.
     */
    public getType(): string { return "base"; }
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
    public onLocaleChanged() {
        for(let key in this.arraysInfo) {
            let item = this.arraysInfo[key];
            if(item && item.isItemValues) {
                var arr = this.getPropertyValue(key);
                if(arr) ItemValue.NotifyArrayOnLocaleChanged(arr);
            }
        }
        for(let key in this.localizableStrings) {
            let item = this.getLocalizableString(key);
            if(item) item.onChanged();
        }
     }
    /**
     * Returns the property value by name
     * @param name property name
     */
    public getPropertyValue(name: string, defaultValue: any = null): any { 
        var res = this.propertyHash[name];
        if(this.isValueEmpty(res) && defaultValue != null) return defaultValue;
        return res; 
    }
    protected setPropertyValueCore(propertiesHash: any, name: string, val: any) {
        if(this.setPropertyValueCoreHandler) this.setPropertyValueCoreHandler(propertiesHash, name, val);
        else propertiesHash[name] = val;
    }
    /**
     * set property value
     * @param name property name
     * @param val new property value
     */
    public setPropertyValue(name: string, val: any) { 
        var oldValue = this.propertyHash[name];
        if(oldValue && Array.isArray(oldValue)) {
            if(this.isTwoValueEquals(oldValue, val)) return;
            var arrayInfo = this.arraysInfo[name];
            this.setArray(oldValue, val, arrayInfo ? arrayInfo.isItemValues : false, arrayInfo ? arrayInfo.onPush : null);
            this.propertyValueChanged(name, oldValue, oldValue);
        } else {
            this.setPropertyValueCore(this.propertyHash, name, val);
            if(!this.isTwoValueEquals(oldValue, val)) {
                this.propertyValueChanged(name, oldValue, val);
            }
        }
    }
    protected propertyValueChanged(name: string, oldValue: any, newValue: any) {
        if(this.isLoadingFromJson) return;
        this.onPropertyChanged.fire(this, {name: name, oldValue: oldValue, newValue: newValue});
        for(var i = 0; i < this.onPropChangeFunctions.length; i ++) {
            if(this.onPropChangeFunctions[i].name == name) this.onPropChangeFunctions[i].func();
        }
    }
    /**
     * Register a function that will be called on a property chagned
     * @param name the property name
     * @param func the function wiht no parameters
     */
    public registerFunctionOnPropertyValueChanged(name: string, func: any) {
        this.onPropChangeFunctions.push({name: name, func: func});
    }
    protected createLocalizableString(name: string, owner: ILocalizableOwner, useMarkDown: boolean = false): LocalizableString {
        var locStr = new LocalizableString(owner, useMarkDown);
        this.localizableStrings[name] = locStr;
        return locStr;
    }
    protected getLocalizableString(name: string): LocalizableString {
        return this.localizableStrings[name];
    }
    protected getLocalizableStringText(name: string, defaultStr: string = ""): string {
        var locStr = this.getLocalizableString(name);
        if(!locStr) return "";
        var res = locStr.text;
        return res ? res : defaultStr;
    }
    protected setLocalizableStringText(name: string, value: string) {
        var locStr = this.getLocalizableString(name);
        if(!locStr) return;
        var oldValue = locStr.text;
        if(oldValue === value) return;
        locStr.text = value;
        this.propertyValueChanged(name, oldValue, value);
    }
    protected createItemValues(name: string): Array<any> {
        var self = this;
        var result = this.createNewArray(name, function(item) { item.locOwner = self;} );
        this.arraysInfo[name].isItemValues = true;
        return result;
    }
    protected createNewArray(name: string, onPush: any = null, onRemove: any = null): Array<any> {
        var newArray = new Array<any>();
        this.setPropertyValueCore(this.propertyHash, name, newArray);
        this.arraysInfo[name] = { onPush: onPush, isItemValues : false };
        var self = this;
        newArray.push = function (value): number { 
            var result = Array.prototype.push.call(newArray, value);
            if(onPush) onPush(value);
            self.propertyValueChanged(name, newArray, newArray);
            return result;
        };
        newArray.pop = function (): number { 
            var result = Array.prototype.pop.call(newArray);
            if(onRemove) onRemove(result);
            self.propertyValueChanged(name, newArray, newArray);
            return result;
        };
        newArray.splice = function (start?: number, deleteCount?: number, ...items: any[]): any[] {
            if(!start) start = 0;
            if(!deleteCount) deleteCount = 0;
            var deletedItems = [];
            for(var i = 0; i < deleteCount; i ++) {
                if(i + start >= newArray.length) continue;
                deletedItems.push(newArray[i + start]);
            }
            var result = Array.prototype.splice.call(newArray, start, deleteCount, ... items);
            if(!items) items = [];
            if(onRemove) {
                for(var i = 0; i < deletedItems.length; i ++) {
                    onRemove(deletedItems[i])
                }
            }
            if(onPush) {
                for(var i = 0; i < items.length; i ++) {
                    onPush(items[i], start + i);
                }
            }
            self.propertyValueChanged(name, newArray, newArray);
            return result;
         };
        
        return newArray;
    }
    protected setArray(src: any[], dest: any[], isItemValues: boolean, onPush: any) {
        src.length = 0;
        if(!dest) return;
        for(var i = 0; i < dest.length; i ++) {
            if(isItemValues) {
                var item = dest[i];
                item = new ItemValue(null);
                item.setData(dest[i]);
                Array.prototype.push.call(src, item);
            } else {
                Array.prototype.push.call(src, dest[i]);
            }
            if(onPush) onPush(src[i]);
        }
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
    public static setVisibleIndex(questions: Array<IQuestion>, index: number, showIndex: boolean): number {
        var startIndex = index;
        for(var i = 0; i < questions.length; i ++) {
            var q = questions[i];
            if(!showIndex || !q.visible || !q.hasTitle) {
                q.setVisibleIndex(-1);
            } else {
                index += q.setVisibleIndex(index);
            }
        }
        return index - startIndex;
    }
    
    protected get surveyImpl() { return this.surveyImplValue; }
    public get data(): ISurveyData { return this.surveyDataValue; }
    /**
     * Returns the survey object.
     */
    public get survey(): ISurvey { return this.surveyValue; }
    public get isLoadingFromJson() { 
        if(this.survey) return this.survey.isLoadingFromJson;
        return this.isLoadingFromJsonValue;
    }
    public getElementsInDesign(includeHidden: boolean = false): Array<IElement> { return []; }
    public get selectedElementInDesign(): SurveyElement { return this.selectedElementInDesignValue; }
    public set selectedElementInDesign(val: SurveyElement) { this.selectedElementInDesignValue = val; }
    public updateCustomWidgets() { }

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
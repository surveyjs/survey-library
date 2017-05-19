import {JsonObject} from "./jsonobject";
import {Base, IPage, IConditionRunner, ISurvey, ISurveyData, IElement, IQuestion, HashTable, SurveyElement, SurveyPageId} from "./base";
import {QuestionBase} from "./questionbase";
import {ConditionRunner} from "./conditions";
import {QuestionFactory} from "./questionfactory";
import {ILocalizableOwner, LocalizableString} from "./localizablestring";

export class QuestionRowModel {
    private visibleValue: boolean;
    visibilityChangedCallback: () => void;
    constructor(public panel: PanelModelBase) {
        this.visibleValue = panel.data && panel.data.isDesignMode;
    }
    public elements: Array<IElement> = [];
    //TODO remove after updating react and vue
    public get questions(): Array<IElement> { return this.elements;}
    public get visible(): boolean { return this.visibleValue; }
    public set visible(val: boolean) {
        if (val == this.visible) return;
        this.visibleValue = val;
        this.onVisibleChanged();
    }
    public updateVisible() {
        this.visible = this.calcVisible();
        this.setWidth();
    }
    public addElement(q: IElement) {
        this.elements.push(q);
        this.updateVisible();
    }
    protected onVisibleChanged() {
        if (this.visibilityChangedCallback) this.visibilityChangedCallback();
    }
    private setWidth() {
        var visCount = this.getVisibleCount();
        if (visCount == 0) return;
        var counter = 0;
        for (var i = 0; i < this.elements.length; i++)
            if (this.elements[i].isVisible) {
                var q = this.elements[i];
                q.renderWidth = q.width ? q.width : Math.floor(100 / visCount) + '%';
                q.rightIndent = counter < visCount - 1 ? 1 : 0;
                counter++;
            }
    }
    private getVisibleCount(): number {
        var res = 0;
        for (var i = 0; i < this.elements.length; i++) {
            if (this.elements[i].isVisible) res++;
        }
        return res;
    }
    private calcVisible(): boolean { return this.getVisibleCount() > 0; }
}

/**
 * A base class for a Panel and Page objects.
 */
export class PanelModelBase extends Base implements IConditionRunner, ILocalizableOwner {
    private static panelCounter = 100;
    private static getPanelId(): string {
        return "sp_" + PanelModelBase.panelCounter++;
    }

    private dataValue: ISurvey = null;
    private idValue: string;
    private rowValues: Array<QuestionRowModel> = null;
    private conditionRunner: ConditionRunner = null;
    private elementsValue: Array<IElement> = new Array<IElement>();
    private isQuestionsReady: boolean = false;
    private questionsValue: Array<QuestionBase> = new Array<QuestionBase>();
    /**
     * A parent element. It is always null for the Page object and always not null for the Panel object. Panel object may contain Questions and other Panels.
     */
    public parent: PanelModelBase = null;
    /**
     * An expression that returns true or false. If it returns a true the Panel becomes visible and if it returns false the Panel becomes invisible. The library perform the expression on survey start and on changing a question value. If the property is empty then visible property is used.
     * @see visible
     */
    public visibleIf: string = "";
    rowsChangedCallback: () => void;
    private locTitleValue: LocalizableString;
    private visibleValue: boolean = true;
    constructor(public name: string = "") {
        super();
        this.idValue = PanelModelBase.getPanelId();
        this.locTitleValue = new LocalizableString(this, true);
        var self = this;
        this.locTitleValue.onRenderedHtmlCallback = function(text) { return self.getRendredTitle(text); };
        this.elementsValue.push = function (value): number { return self.doOnPushElement(this, value); };
        this.elementsValue.splice = function (start?: number, deleteCount?: number, ...items: QuestionBase[]): QuestionBase[] {
            return self.doSpliceElements(this, start, deleteCount, ...items);
        };
    }
    get data(): ISurvey { return this.dataValue; }
    set data(value: ISurvey) {
        if(this.dataValue === value) return;
        this.dataValue = value;
        for(var i = 0; i < this.elements.length; i ++) {
            this.elements[i].setData(value);
        }
    }
    /**
     * PanelModel or PageModel title property.
     */
    public get title(): string { return this.locTitle.text; }
    public set title(newValue: string) {
        this.locTitle.text = newValue;
    }
    get locTitle(): LocalizableString { return this.locTitleValue; }
    getLocale(): string { return this.data ? (<ILocalizableOwner><any>this.data).getLocale() : ""; }
    getMarkdownHtml(text: string)  { return this.data ? (<ILocalizableOwner><any>this.data).getMarkdownHtml(text) : null; }
    /**
     * A unique element identificator. It is generated automatically.
     */
    public get id(): string { return this.idValue; }
    /**
     * Returns true if the current object is Panel. Returns false if the current object is Page (a root Panel).
     */
    public get isPanel(): boolean { return false; }
    /**
     * Returns the list of all questions located in the Panel/Page, including in the nested Panels.
     * @see QuestionBase
     * @see elements
     */
    public get questions(): Array<QuestionBase> {
        if(!this.isQuestionsReady) {
            this.questionsValue = [];
            for(var i = 0; i < this.elements.length; i ++) {
                var el = this.elements[i];
                if(el.isPanel) {
                    var qs = (<PanelModel>el).questions;
                    for(var j = 0; j < qs.length; j ++) {
                        this.questionsValue.push(qs[j]);
                    }
                } else {
                    this.questionsValue.push(<QuestionBase>el);
                }
            }
            this.isQuestionsReady = true;
        }

        return this.questionsValue;
    }
    private markQuestionListDirty() {
        this.isQuestionsReady = false;
        if(this.parent) this.parent.markQuestionListDirty();
    }
    /**
     * Returns the list of the elements in the object, Panel/Page. Elements can be questions or panels. The function doesn't return elements in the nested Panels.
     */
    public get elements(): Array<IElement> { return this.elementsValue; }
    /**
     * Returns true if the current element belongs to the Panel/Page. It looks in nestede Panels as well.
     * @param element
     * @see PanelModel
     */
    public containsElement(element: IElement): boolean {
        for(var i = 0; i < this.elements.length; i ++) {
            var el: any = this.elements[i];
            if(el == element) return true;
            if(el.isPanel) {
                if((<PanelModelBase>el).containsElement(element)) return true;
            }
        }
        return false;
    }
    /**
     * Returns true, if there is an error on this Page or inside the current Panel
     * @param fireCallback set it to true, to show errors in UI
     * @param focuseOnFirstError set it to true to focuse on the first question that doesn't pass the validation
     */
    public hasErrors(fireCallback: boolean = true, focuseOnFirstError: boolean = false): boolean {
        var result = false;
        var firstErrorQuestion = null;
        var visibleQuestions = [];
        this.addQuestionsToList(visibleQuestions, true);
        for (var i = 0; i < visibleQuestions.length; i++) {
            var question = visibleQuestions[i];
            if(question.isReadOnly) continue;
            if (question.hasErrors(fireCallback)) {
                if (focuseOnFirstError && firstErrorQuestion == null) {
                    firstErrorQuestion = question;
                }
                result = true;
            }
        }
        if (firstErrorQuestion) firstErrorQuestion.focus(true);
        return result;
    }
    /**
     * Fill list array with the questions.
     * @param list 
     * @param visibleOnly set it to true to get visible questions only
     */
    public addQuestionsToList(list: Array<IQuestion>, visibleOnly: boolean = false) {
        if (visibleOnly && !this.visible) return;
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            if (visibleOnly && !el.visible) continue;
            if(el.isPanel) {
                (<PanelModel>el).addQuestionsToList(list, visibleOnly);
            }
            else {
                list.push(<IQuestion>el);
            }
        }
    }
    get rows(): Array<QuestionRowModel> {
        if(!this.rowValues) {
            this.rowValues = this.buildRows();
        }
        return this.rowValues;
    }
    /**
     * Returns true if the current object is Page and it is the current page.
     */
    public get isActive() { return (!this.data) || this.data.currentPage == this.root; }
    protected get root(): PanelModelBase {
        var res = <PanelModelBase>this;
        while(res.parent) res = res.parent;
        return res;
    }
    protected createRow(): QuestionRowModel { return new QuestionRowModel(this); }
    onSurveyLoad() {
        for(var i = 0; i < this.elements.length; i ++) {
            this.elements[i].onSurveyLoad();
        }
        if(this.rowsChangedCallback) this.rowsChangedCallback();
    }
    protected get isLoadingFromJson(): boolean { return this.data && this.data.isLoadingFromJson; }
    protected onRowsChanged() {
        this.rowValues = null;
        if(this.rowsChangedCallback && !this.isLoadingFromJson) this.rowsChangedCallback();
    }
    private get isDesignMode() { return this.data && this.data.isDesignMode; }
    private doOnPushElement(list: Array<IElement>, value: IElement) {
        var result = Array.prototype.push.call(list, value);
        this.markQuestionListDirty();
        this.onAddElement(value, list.length);
        this.onRowsChanged();
        return result;
    }
    private doSpliceElements(list: Array<IElement>, start?: number, deleteCount?: number, ...items: IElement[]) {
        if(!start) start = 0;
        if(!deleteCount) deleteCount = 0;
        var deletedQuestions = [];
        for(var i = 0; i < deleteCount; i ++) {
            if(i + start >= list.length) continue;
            deletedQuestions.push(list[i + start]);
        }
        var result = Array.prototype.splice.call(list, start, deleteCount, ... items);
        this.markQuestionListDirty();
        if(!items) items = [];
        for(var i = 0; i < deletedQuestions.length; i ++) {
            this.onRemoveElement(deletedQuestions[i])
        }
        for(var i = 0; i < items.length; i ++) {
            this.onAddElement(items[i], start + i);
        }
        this.onRowsChanged();
        return result;
    }
    private onAddElement(element: IElement, index: number) {
        if(element.isPanel) {
            var p = <PanelModel>element;
            p.data = this.data;
            p.parent = this;
            if(this.data) {
                this.data.panelAdded(p, index, this, this.root);
            }
        } else {
            if(this.data) {
                var q = <QuestionBase>element;
                q.setData(this.data);
                this.data.questionAdded(q, index, this, this.root);
            }
        }
        var self = this;
        element.rowVisibilityChangedCallback = function () { self.onElementVisibilityChanged(element); }
        element.startWithNewLineChangedCallback = function () { self.onElementStartWithNewLineChanged(element); }
    }
    private onRemoveElement(element: IElement) {
        if(!element.isPanel) {
            if(this.data) this.data.questionRemoved(<QuestionBase>element);
        } else {
            if(this.data) this.data.panelRemoved(element);
        }
    }
    private onElementVisibilityChanged(element: any) {
        if (this.rowValues) {
            this.updateRowsVisibility(element);
        }
        if(this.parent) {
            this.parent.onElementVisibilityChanged(this);
        }
    }
    private onElementStartWithNewLineChanged(element: any) {
        this.onRowsChanged();
    }
    private updateRowsVisibility(element: any)  {
        for (var i = 0; i < this.rowValues.length; i++) {
            var row = this.rowValues[i];
            if (row.elements.indexOf(element) > -1) {
                row.updateVisible();
                break;
            }
        }
    }
    private buildRows(): Array<QuestionRowModel> {
        var result = new Array<QuestionRowModel>();
        var lastRowVisibleIndex = -1;
        var self = this;
        for (var i = 0; i < this.elements.length; i++) {
            var el = this.elements[i];
            var isNewRow = i == 0 || el.startWithNewLine;
            var row = isNewRow ? this.createRow() : result[result.length - 1];
            if(isNewRow) result.push(row);
            row.addElement(el);
        }
        for (var i = 0; i < result.length; i++) {
            result[i].updateVisible();
        }
        return result;
    }
    /**
     * Returns rendered title text or html.
     */
    public get processedTitle() {
        return this.getRendredTitle(this.locTitle.textOrHtml);
    }
    protected getRendredTitle(str: string): string {
        if(!str && this.isPanel && this.isDesignMode) return "[" + this.name + "]";
        return this.data != null ? this.data.processText(str) : str;
    }
    /**
     * Use it to get/set the object visibility.
     * @see visibleIf
     */
    public get visible(): boolean { return this.visibleValue; }
    public set visible(value: boolean) {
        if (value === this.visible) return;
        this.visibleValue = value;
        this.onVisibleChanged();
    }
    protected onVisibleChanged() {

    }
    /**
     * Returns true if object is visible or survey is in design mode right now.
     */
    public get isVisible(): boolean {  return (this.data && this.data.isDesignMode) || this.getIsPageVisible(null); }
    getIsPageVisible(exceptionQuestion: IQuestion): boolean {
        if (!this.visible) return false;
        for (var i = 0; i < this.questions.length; i++) {
            if (this.questions[i] == exceptionQuestion) continue;
            if (this.questions[i].visible) return true;
        }
        return false;
    }
    /**
     * Add an elememnt into Panel or Page.
     * @param element 
     * @param index element index in the elements array
     */
    public addElement(element: IElement, index: number = -1) {
        if (element == null) return;
        if (index < 0 || index >= this.elements.length) {
            this.elements.push(element);
        } else {
            this.elements.splice(index, 0, element);
        }
    }
    /**
     * Add a question into Panel or Page.
     * @param question 
     * @param index element index in the elements array
     */
    public addQuestion(question: QuestionBase, index: number = -1) {
        this.addElement(question, index);
    }
    /**
     * Add a panel into Panel or Page.
     * @param panel 
     * @param index element index in the elements array
     */
    public addPanel(panel: PanelModel, index: number = -1) {
        this.addElement(panel, index);
    }
    /**
     * Creates a new question and adds it into the end of the elements list.
     * @param questionType the possible values are: "text", "checkbox", "dropdown", "matrix", "html", "matrixdynamic", "matrixdropdown" and so on.
     * @param name a question name
     */
    public addNewQuestion(questionType: string, name: string): QuestionBase {
        var question = QuestionFactory.Instance.createQuestion(questionType, name);
        this.addQuestion(question);
        return question;
    }
    /**
     * Creates a new panel and adds it inot the end of the elements list.
     * @param name a panel name
     */
    public addNewPanel(name: string): PanelModel {
        var panel = this.createNewPanel(name);
        this.addPanel(panel);
        return panel;
    }
    protected createNewPanel(name: string): PanelModel {
        return new PanelModel(name);
    }
    /**
     * Remove an element (Panel or Question) from the elements list.
     * @param element 
     * @see elements
     */
    public removeElement(element: IElement): boolean {
        var index = this.elements.indexOf(element);
        if (index < 0) {
            for(var i = 0; i < this.elements.length; i ++) {
                var el = this.elements[i];
                if(el.isPanel && (<PanelModelBase>(<any>el)).removeElement(element)) return true;
            }
            return false;
        }
        this.elements.splice(index, 1);
        return true;
    }
    /**
     * Remove question  from the elements list.
     * @param question 
     * @see elements
     * @see removeElement
     */
    public removeQuestion(question: QuestionBase) {
        this.removeElement(question);
    }
    runCondition(values: HashTable<any>) {
        for(var i = 0; i < this.elements.length; i ++) {
            this.elements[i].runCondition(values);
        }
        if (!this.visibleIf) return;
        if (!this.conditionRunner) this.conditionRunner = new ConditionRunner(this.visibleIf);
        this.conditionRunner.expression = this.visibleIf;
        this.visible = this.conditionRunner.run(values);
    }
    onLocaleChanged() {
        for(var i = 0; i < this.elements.length; i ++) {
            this.elements[i].onLocaleChanged()
        }
        this.locTitle.onChanged();
    }
}

/**
 * A container element, similar to the Page objects. However, unlike the Page, Panel can't be a root. 
 * It may contain questions and other panels.
 */
export class PanelModel extends PanelModelBase implements IElement {
    private renderWidthValue: string;
    private rightIndentValue: number;
    /**
     * The Panel width.
     */
    public width: string;
    private innerIndentValue: number = 0;
    private startWithNewLineValue: boolean = true;
    renderWidthChangedCallback: () => void;
    rowVisibilityChangedCallback: () => void;
    startWithNewLineChangedCallback: () => void;
    constructor(public name: string = "") {
        super(name);
    }
    public getType(): string { return "panel"; }
    public setData(newValue: ISurveyData) {
        this.data = <ISurvey>newValue;
    }
    public get isPanel(): boolean { return true; }
    /**
     * The inner indent. Set this property to increase the panel content margin. 
     */
    public get innerIndent(): number { return this.innerIndentValue; }
    public set innerIndent(val: number) {
        if (val == this.innerIndentValue) return;
        this.innerIndentValue = val;
        if(this.renderWidthChangedCallback) this.renderWidthChangedCallback();
    }
    get renderWidth(): string { return this.renderWidthValue; }
    set renderWidth(val: string) {
        if (val == this.renderWidth) return;
        this.renderWidthValue = val;
        if(this.renderWidthChangedCallback) this.renderWidthChangedCallback();
    }
    /**
     * The Panel renders on the new line if the property is true. If the property is false, the panel tries to render on the same line/row with a previous question/panel.
     */
    public get startWithNewLine(): boolean { return this.startWithNewLineValue; }
    public set startWithNewLine(value: boolean) {
        if(this.startWithNewLine == value) return;
        this.startWithNewLineValue = value;
        if(this.startWithNewLineChangedCallback) this.startWithNewLineChangedCallback();
    }
    /**
     * The right indent of the Panel.
     */
    public get rightIndent(): number { return this.rightIndentValue; }
    public set rightIndent(val: number) {
        if (val == this.rightIndent) return;
        this.rightIndentValue = val;
        if(this.renderWidthChangedCallback) this.renderWidthChangedCallback();
    }
    protected onVisibleChanged() {
        if(this.rowVisibilityChangedCallback) this.rowVisibilityChangedCallback();
    }
}

JsonObject.metaData.addClass("panel", ["name",  { name: "elements", alternativeName: "questions", baseClassName: "question", visible: false },
    { name: "startWithNewLine:boolean", default: true}, { name: "visible:boolean", default: true }, "visibleIf:expression", 
    { name: "title:text", serializationProperty: "locTitle" }, {name: "innerIndent:number", default: 0, choices: [0, 1, 2, 3]}], function () { return new PanelModel(); });

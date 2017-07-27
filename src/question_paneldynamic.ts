import {IElement, Base, ISurveyData, HashTable} from "./base";
import {surveyLocalization} from "./surveyStrings";
import {LocalizableString} from "./localizablestring";
import {Question} from "./question";
import {PanelModel} from "./panel";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";

export interface IQuestionPanelDynamicData {
    getPanelItemData(item: QuestionPanelDynamicItem): any;
    setPanelItemData(item: QuestionPanelDynamicItem, name: string, val: any);
}

export class QuestionPanelDynamicItem implements ISurveyData {
    private panelValue: PanelModel;
    private data: IQuestionPanelDynamicData;
    constructor(data: IQuestionPanelDynamicData, panel: PanelModel) {
        this.data = data;
        this.panelValue = panel;
        this.panel.setData(this);
    }
    public get panel(): PanelModel { return this.panelValue; }
    public runCondition(values: HashTable<any>) {
        this.panel.runCondition(values);
    }
    public getValue(name: string): any {
        var values = this.data.getPanelItemData(this);
        return values[name];
    }
    public setValue(name: string, newValue: any) {
        this.data.setPanelItemData(this, name, newValue);
    }
    public getComment(name: string): string {
        var result = this.getValue(name + Base.commentPrefix);
        return result ? result : "";
    }
    public setComment(name: string, newValue: string) {
        this.setValue(name + Base.commentPrefix, newValue);
    }
    getAllValues() : any { return this.data.getPanelItemData(this); }
}

export class QuestionPanelDynamicModel extends Question implements IQuestionPanelDynamicData {
    public static MaxPanelCount = 100;
    private templateValue: PanelModel = new PanelModel();
    private panelsValue: Array<QuestionPanelDynamicItem> = new Array<QuestionPanelDynamicItem>();
    private loadingPanelCount: number = 0;
    private minPanelCountValue = 0;
    private maxPanelCountValue = QuestionPanelDynamicModel.MaxPanelCount;
    private locAddPanelTextValue: LocalizableString;
    private locRemovePanelTextValue: LocalizableString;

    constructor(public name: string) {
        super(name);
        var self = this;
        this.template.rowsChangedCallback = function() { self.templateOnRowsChanged(); }
        this.locAddPanelTextValue = new LocalizableString(this);
        this.locRemovePanelTextValue = new LocalizableString(this);
    }
    private templateOnRowsChanged() {
        if(this.isLoadingFromJson) return;
        this.rebuildPanels();
    }
    public getType(): string {
        return "paneldynamic";
    }
    public get template(): PanelModel { return this.templateValue; }
    public get templateElements(): Array<IElement> { return this.template.elements; }
    public get templateTitle(): string { return this.template.title; }
    public set templateTitle(newValue: string) {
        this.template.title = newValue;
    }
    get locTemplateTitle(): LocalizableString { return this.template.locTitle; }

    public get panels(): Array<QuestionPanelDynamicItem> { return this.panelsValue; }
    public get panelCount(): number { return this.isLoadingFromJson ? this.loadingPanelCount : this.panels.length; }
    public set panelCount(val: number) {
        if(val < 0) return;
        if(this.isLoadingFromJson) {
            this.loadingPanelCount = val;
            return;
        }
        if(val == this.panels.length) return;
        for(let i = this.panelCount; i < val; i ++) {
            this.panels.push(this.createNewItem());
        }
        if(val < this.panelCount) this.panels.splice(val, this.panelCount - val);
        this.setValueBasedOnPanelCount();
        this.reRunCondition();
    }
    private setValueBasedOnPanelCount() {
        var value = this.value;
        if(!value || !Array.isArray(value)) value = [];
        if(value.length == this.panelCount) return;
        for(var i = value.length; i < this.panelCount; i ++) value.push({});
        if(value.length > this.panelCount) value.splice(this.panelCount, value.length - this.panelCount);
        this.value = value;
    }
    public get minPanelCount() : number { return this.minPanelCountValue; }
    public set minPanelCount(value : number) {
        if(value < 0) value = 0;
        if(value == this.minPanelCount || value > this.maxPanelCount) return;
        this.minPanelCountValue = value;
        if(this.panelCount < value) this.panelCount = value;
    }
    public get maxPanelCount() : number { return this.maxPanelCountValue; }
    public set maxPanelCount(value : number) {
        if(value <= 0) return;
        if(value > QuestionPanelDynamicModel.MaxPanelCount) value = QuestionPanelDynamicModel.MaxPanelCount;
        if(value == this.maxPanelCount || value < this.minPanelCount) return;
        this.maxPanelCountValue = value;
        if(this.panelCount > value) this.panelCount = value;
    }
    public get canAddPanel() : boolean { return this.panelCount < this.maxPanelCount; }
    public get canRemovePanel() : boolean { return this.panelCount > this.minPanelCount; }
    public get addPanelText() { return this.locAddPanelText.text ? this.locAddPanelText.text : surveyLocalization.getString("addRow"); } //TODO addPanel
    public set addPanelText(value: string) { this.locAddPanelText.text = value; }
    get locAddPanelText() { return this.locAddPanelTextValue; }
    /**
     * Use this property to change the default value of remove row button text.
     */
    public get removePanelText() { return this.locRemovePanelText.text ? this.locRemovePanelText.text : surveyLocalization.getString("removeRow"); } //TODO rempvePanel
    public set removePanelText(value: string) { this.locRemovePanelText.text = value; }
    get locRemovePanelText() { return this.locRemovePanelTextValue; }

    public rebuildPanels() {
        var items = new Array<QuestionPanelDynamicItem>();
        for(var i = 0; i  < this.panelCount; i ++) {
            items.push(this.createNewItem());
        }
        this.panelsValue = items;
        this.reRunCondition();
    }
    public addPanel(): QuestionPanelDynamicItem {
        if(!this.canAddPanel) return null;
        this.panelCount ++;
        return this.panels[this.panelCount - 1];
    }
    public removePanel(index: number) {
        if(!this.canRemovePanel) return;
        if(index < 0 || index >= this.panelCount) return;
        this.panels.splice(index, 1);
        var value = this.value;
        if(!value || !Array.isArray(value) || index >= value.length) return;
        value.splice(index, 1);
        this.value = value;
    }
    public onSurveyLoad() {
        if(this.loadingPanelCount > 0) {
            this.panelCount = this.loadingPanelCount;
        }
        super.onSurveyLoad();
    }
    public runCondition(values: HashTable<any>) {
        super.runCondition(values);
        this.runPanelsCondition(values);
    }
    private reRunCondition() {
        if(!this.survey) return;
        this.runCondition(this.survey.getAllValues());
    }
    protected runPanelsCondition(values: HashTable<any>) {
        var newValues = {};
        if (values && values instanceof Object) {
            newValues = JSON.parse(JSON.stringify(values));
        }
        for(var i = 0; i < this.panels.length; i ++) {
            newValues["panel"] = this.getPanelItemData(this.panels[i]);
            this.panels[i].runCondition(newValues);
        }
    }
    public hasErrors(fireCallback: boolean = true): boolean {
        var errosInPanels = this.hasErrorInPanels(fireCallback);
        return super.hasErrors(fireCallback) || errosInPanels;
    }
    private hasErrorInPanels(fireCallback: boolean): boolean {
        var res = false;
        for (var i = 0; i < this.panels.length; i++) {
            var panel = this.panels[i].panel;
            res = panel.hasErrors(fireCallback) || res;
        }
        return res;
    }
    protected createNewItem(): QuestionPanelDynamicItem {
        return new QuestionPanelDynamicItem(this, this.createNewPanel());
    }
    protected createNewPanel(): PanelModel {
        var panel = this.createNewPanelObject();
        var jObj = new JsonObject();
        var json = jObj.toJsonObject(this.template);
        jObj.toObject(json, panel);
        return panel;
    }   
    protected createNewPanelObject(): PanelModel {
        return new PanelModel();
    }
    protected onValueChanged() {
        var val = this.value;
        var newPanelCount = val && Array.isArray(val) ? val.length : 0;
        if (newPanelCount <= this.panelCount) return;
        this.panelCount = newPanelCount;
    }
    //IQuestionPanelDynamicData 
    getPanelItemData(item: QuestionPanelDynamicItem): any {
        var index = this.panels.indexOf(item);
        if(index < 0) return {};
        var qValue = this.value;
        if(!qValue || !Array.isArray(qValue) || qValue.length <= index) return {};
        return qValue[index];
    }
    setPanelItemData(item: QuestionPanelDynamicItem, name: string, val: any) {
        var index = this.panels.indexOf(item);
        if(index < 0) return;
        var qValue = this.value;
        if(!qValue || !Array.isArray(qValue) || qValue.length <= index) return;
        if(!qValue[index]) qValue[index] = {};
        qValue[index][name] = val;
    }
}

JsonObject.metaData.addClass("paneldynamic", [{name: "templateElements", alternativeName: "questions", visible: false}, 
    {name: "templateTitle:text", serializationProperty: "locTemplateTitle"}, {name: "panelCount", default: 0},
    { name: "minPanelCount:number", default: 0 }, { name: "maxPanelCount:number", default: QuestionPanelDynamicModel.MaxPanelCount },
    { name: "addPanelText", serializationProperty: "locAddPanelText" }, { name: "removePanelText", serializationProperty: "locRemovePaelText" }],
    function () { return new QuestionPanelDynamicModel(""); }, "question");
QuestionFactory.Instance.registerQuestion("paneldynamic", (name) => { var q = new QuestionPanelDynamicModel(name); q.template.addNewQuestion("text", "question1"); q.template.addNewQuestion("text", "question2"); return q; });
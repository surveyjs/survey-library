import {IElement, Base, ISurveyData} from "./base";
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
    private templateValue: PanelModel = new PanelModel();
    private panelsValue: Array<QuestionPanelDynamicItem> = new Array<QuestionPanelDynamicItem>();
    private loadingPanelCount: number = 0;
    constructor(public name: string) {
        super(name);
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
        if(this.isLoadingFromJson) {
            this.loadingPanelCount = val;
            return;
        }
        if(val == this.panels.length) return;
        var curLength = this.panels.length;
        for(var i = curLength; i < val; i ++) {
            this.addPanel();
        }
    }
    public addPanel(): QuestionPanelDynamicItem {
        var panel = new QuestionPanelDynamicItem(this, this.createNewPanel());
        this.panels.push(panel);
        return panel;
    }
    public onSurveyLoad() {
        if(this.loadingPanelCount > 0) {
            this.panelCount = this.loadingPanelCount;
        }
        super.onSurveyLoad();
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
    {name: "templateTitle:text", serializationProperty: "locTemplateTitle"}, 
    {name: "panelCount", default: 0}], function () { return new QuestionPanelDynamicModel(""); }, "question");
QuestionFactory.Instance.registerQuestion("paneldynamic", (name) => { var q = new QuestionPanelDynamicModel(name); q.template.addNewQuestion("text", "question1"); q.template.addNewQuestion("text", "question2"); return q; });
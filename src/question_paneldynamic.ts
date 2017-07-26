import {IElement, Base} from "./base";
import {surveyLocalization} from "./surveyStrings";
import {LocalizableString} from "./localizablestring";
import {Question} from "./question";
import {PanelModel} from "./panel";
import {JsonObject} from "./jsonobject";

export class QuestionPanelDynamicItem {
    private panelValue: PanelModel;
    constructor(panel: PanelModel) {
        this.panelValue = panel;
    }
    public get panel(): PanelModel { return this.panelValue; }
}

export class QuestionPanelDynamicModel extends Question {
    private templateValue: PanelModel = new PanelModel();
    private panelsValue: Array<QuestionPanelDynamicItem> = new Array<QuestionPanelDynamicItem>();
    constructor(public name: string) {
        super(name);
    }
    public getType(): string {
        return "paneldynamic";
    }
    public get template(): PanelModel { return this.templateValue; }
    public get elements(): Array<IElement> { return this.template.elements; }
    public get panels(): Array<QuestionPanelDynamicItem> { return this.panelsValue; }
    public get panelCount(): number { return this.panels.length; }
    public set panelCount(val: number) {
        if(val == this.panels.length) return;
        var curLength = this.panels.length;
        for(var i = curLength; i < val; i ++) {
            this.addPanel();
        }
    }
    public addPanel(): QuestionPanelDynamicItem {
        var panel = new QuestionPanelDynamicItem(this.createNewPanel());
        this.panels.push(panel);
        return panel;
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
}
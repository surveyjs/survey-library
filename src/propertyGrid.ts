import {Base} from "./base";
import {JsonObjectProperty, Serializer} from "./jsonobject";
import { SurveyModel } from "./survey";

export class PropertyGridModel {
    private static panelNameIndex = 0;
    private surveyValue: SurveyModel;
    private objValue: Base;
    constructor(obj: Base) {
        this.objValue = obj;
        this.surveyValue = this.createSurvey();
        this.survey.editingObj = obj;
    }
    public get obj() { return this.objValue; }
    public get survey() { return this.surveyValue;}
    protected createSurvey(): SurveyModel {
        return new SurveyModel(this.createJSON())
    }
    protected createJSON(): any {
        var props = Serializer.getPropertiesByObj(this.obj);
        var panels: any = {};
        var isFirstPanel = true;
        for(var i = 0; i < props.length; i ++) {
            var propJSON = this.createQuestionJSON(props[i]);
            if(!propJSON) continue;
            var category = props[i].category;
            if(!category) category = "general";
            var panel = panels[category];
            if(!panel) {
                panel = this.createPanelJSON(category, isFirstPanel);
                panels[category] = panel;
                isFirstPanel = false;
            }
            panel.elements.push(propJSON);
        }
        var json: any = {
            showNavigationButtons: "none",
            elements: []
        };
        for(var key in panels) {
            json.elements.push(panels[key]);
        }
        return json;
    }
    private createPanelJSON(category: string, isFirstPanel: boolean): any {
        return {
            type: "panel",
            name: "property_grid_category" + (PropertyGridModel.panelNameIndex ++).toString(),
            title: category,
            state: isFirstPanel? "expanded" : "collapsed",
            elements: []
        }
    }
    private createQuestionJSON(prop: JsonObjectProperty): any {
        var json = this.createQuestionJSONProps(prop);
        if(!json) return null;
        json.name = prop.name;
        json.visible = prop.visible;
        return json;
    }
    private createQuestionJSONProps(prop: JsonObjectProperty): any {
        if(prop.type == "string" && prop.hasChoices) {
            return {type: "dropdown", showOptionsCaption: false, choices: prop.getChoices(this.obj)};
        }
        if(prop.type == "string") return {type: "text"};        
        if(prop.type == "text") return {type: "comment"};
        if(prop.type == "itemvalue[]") {
            return {
                type: "matrixdynamic",
                cellType: "text",
                columns: [{name: "value"}, {name: "text"}]
            }
        }
        return null;
    }
}

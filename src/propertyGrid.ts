import { fromJson } from 'angular';
import { getJSON } from 'jquery';
import {Base} from "./base";
import {JsonObjectProperty, Serializer} from "./jsonobject";
import { Question } from './question';
import { QuestionMatrixDynamicModel } from './question_matrixdynamic';
import { SurveyModel } from "./survey";

export interface IPropertyGridEditor {
    fit(prop: JsonObjectProperty): boolean;
    getJSON(obj: Base, prop: JsonObjectProperty): any;
    onCreated?: (obj: Base, question: Question, prop: JsonObjectProperty) => void;
}

export var PropertyGridEditorCollection = {
    editors : new Array<IPropertyGridEditor>(),
    register(editor: IPropertyGridEditor) {
        this.editors.push(editor);
    },
    getEditor(prop: JsonObjectProperty): IPropertyGridEditor {
        for(var i = this.editors.length - 1; i >= 0; i--) {
            if(this.editors[i].fit(prop)) return this.editors[i];
        }
        return null;
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        var res = this.getEditor(prop);
        return !!res ? res.getJSON(obj, prop) : null;
    },
    onCreated(obj: Base, question: Question, prop: JsonObjectProperty): any {
        var res = this.getEditor(prop);
        if(!!res && !!res.onCreated) {
            res.onCreated(obj, question, prop);
        }
    }
}

export class PropertyGridModel {
    private static panelNameIndex = 0;
    private surveyValue: SurveyModel;
    private objValue: Base;
    public objValueChangedCallback: () => void;
    constructor(obj: Base) {
        this.obj = obj;
    }
    public get obj() { return this.objValue; }
    public set obj(value: Base) {
        if(this.objValue != value) {
            this.objValue = value;
            this.surveyValue = this.createSurvey();
            this.onQuestionsCreated();
            this.survey.editingObj = value;
            if(this.objValueChangedCallback) {
                this.objValueChangedCallback();
            }
        }
    }
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
    private onQuestionsCreated() {
        var properties = Serializer.getPropertiesByObj(this.obj);
        var props: any = {};
        for(var i = 0; i < properties.length; i ++) {
            props[properties[i].name] = properties[i];
        }
        var questions = this.survey.getAllQuestions();
        for(var i = 0; i < questions.length; i ++) {
            var q = questions[i];
            var prop = props[q.name];
            PropertyGridEditorCollection.onCreated(this.obj, questions[i], props[questions[i].name]);
        }
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
        var json = PropertyGridEditorCollection.getJSON(this.obj, prop);
        if(!json) return null;
        json.name = prop.name;
        json.visible = prop.visible;
        return json;
    }
}
PropertyGridEditorCollection.register({
    fit(prop: JsonObjectProperty): boolean{
        return prop.type == "boolean" || prop.type == "switch";
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return {type: "boolean", default: false};
    } 
});
PropertyGridEditorCollection.register({
    fit(prop: JsonObjectProperty): boolean{
        return prop.type == "string";
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return {type: "text"};
    }
});
PropertyGridEditorCollection.register({
    fit(prop: JsonObjectProperty): boolean{
        return prop.type == "text";
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return {type: "comment"};
    }
});
PropertyGridEditorCollection.register({
    fit(prop: JsonObjectProperty): boolean{
        return prop.type == "text" && prop.hasChoices;
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return {type: "dropdown", showOptionsCaption: false, choices: prop.getChoices(this.obj)};
    }
});
PropertyGridEditorCollection.register({
    fit(prop: JsonObjectProperty): boolean{
        return prop.type == "itemvalue[]";
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return {
            type: "matrixdynamic",
            cellType: "text",
            columns: [{name: "value"}, {name: "text"}]
        };
    },
    /*
    onCreated(obj: Base, question: Question, prop: JsonObjectProperty) {
        var matrix = <QuestionMatrixDynamicModel>question;

    }*/
});
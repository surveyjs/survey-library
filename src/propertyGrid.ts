import { fromJson } from 'angular';
import { getJSON } from 'jquery';
import {Base} from "./base";
import { ItemValue } from './itemvalue';
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
    fitHash : {},
    register(editor: IPropertyGridEditor) {
        this.editors.push(editor);
    },
    getEditor(prop: JsonObjectProperty): IPropertyGridEditor {
        var fitEd = this.fitHash[prop.id];
        if(!!fitEd) return fitEd;
        for(var i = this.editors.length - 1; i >= 0; i--) {
            if(this.editors[i].fit(prop)) {
                this.fitHash[prop.id] = this.editors[i]; 
                return this.editors[i];
            }
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

class SurveyHelper {
    public static getNewName(objs: Array<any>, keyPropName: string, baseName: string): string {
        var hash: any = {};
        for (var i = 0; i < objs.length; i++) {
            hash[objs[i][keyPropName]] = true;
        }
        var num = 1;
        while (true) {
        if (!hash[baseName + num.toString()]) break;
        num++;
        }
        return baseName + num.toString();
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
            PropertyGridEditorCollection.onCreated(this.obj, q, prop);
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
        return prop.type == "string" && prop.hasChoices;
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return {type: "dropdown", showOptionsCaption: false, choices: prop.getChoices(this.obj)};
    }
});
function getColumnPropertyJSON(className: string, propName: string): any {
    var prop = Serializer.findProperty(className, propName);
    if(!prop) return null;
    var json = PropertyGridEditorCollection.getJSON(null, prop);
    if(!json) return null;
    json.name = prop.name;
    if(!!json.type) {
        json.cellType = json.type;
        delete json.type;
    }
    return json;
}
function getColumnsJSON(className: string, propNames: Array<string>): Array<any> {
    var res: Array<any> = [];
    for(var i = 0; i < propNames.length; i ++) {
        var columnJSON = getColumnPropertyJSON(className, propNames[i]);
        if(!!columnJSON) {
            res.push(columnJSON);
        }
    }
    return res;
}
function getMatrixJSON(prop: JsonObjectProperty, propNames: Array<string>): any {
    return {
        type: "matrixdynamic",
        cellType: "text",
        columns: getColumnsJSON(prop.className, propNames)
    };
}
function createNewItem(matrix: QuestionMatrixDynamicModel, prop: JsonObjectProperty, keyPropName: string): Base {
    var newName = SurveyHelper.getNewName(matrix.value, keyPropName, prop.getBaseValue());
    var item = Serializer.createClass(prop.className, {keyPropName: newName});
    matrix.value.push(item);
    return item;    
}
PropertyGridEditorCollection.register({
    fit(prop: JsonObjectProperty): boolean{
        return prop.type == "itemvalue[]";
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return getMatrixJSON(prop, ["value", "text"]);
    },
    onCreated(obj: Base, question: Question, prop: JsonObjectProperty) {
        question.onGetValueForNewRowCallBack = (sender: QuestionMatrixDynamicModel): any => {
            return createNewItem(sender, prop, "value");
        }
    }
});
PropertyGridEditorCollection.register({
    fit(prop: JsonObjectProperty): boolean{
        return prop.type == "matrixdropdowncolumns";
    },
    getJSON(obj: Base, prop: JsonObjectProperty): any {
        return getMatrixJSON(prop, ["cellType", "name", "title"]);
    },
    onCreated(obj: Base, question: Question, prop: JsonObjectProperty) {
        question.onGetValueForNewRowCallBack = (sender: QuestionMatrixDynamicModel): any => {
            return createNewItem(sender, prop, "name");
        }
    }
});
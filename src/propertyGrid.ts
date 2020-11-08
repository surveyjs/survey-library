import { fromJson } from "angular";
import { getJSON } from "jquery";
import { Base } from "./base";
import { ItemValue } from "./itemvalue";
import { JsonObjectProperty, Serializer } from "./jsonobject";
import { Question } from "./question";
import { MatrixDropdownRowModelBase } from "./question_matrixdropdownbase";
import { QuestionMatrixDynamicModel } from "./question_matrixdynamic";
import { PanelModel, PanelModelBase } from "./panel";
import { SurveyModel } from "./survey";

export interface IPropertyGridEditor {
  fit(prop: JsonObjectProperty): boolean;
  getJSON(obj: Base, prop: JsonObjectProperty): any;
  onCreated?: (
    propertyGrid: PropertyGridModel,
    obj: Base,
    question: Question,
    prop: JsonObjectProperty
  ) => void;
}

export var PropertyGridEditorCollection = {
  editors: new Array<IPropertyGridEditor>(),
  fitHash: {},
  register(editor: IPropertyGridEditor) {
    this.editors.push(editor);
  },
  getEditor(prop: JsonObjectProperty): IPropertyGridEditor {
    var fitEd = this.fitHash[prop.id];
    if (!!fitEd) return fitEd;
    for (var i = this.editors.length - 1; i >= 0; i--) {
      if (this.editors[i].fit(prop)) {
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
  onCreated(
    propertyGrid: PropertyGridModel,
    obj: Base,
    question: Question,
    prop: JsonObjectProperty
  ): any {
    var res = this.getEditor(prop);
    if (!!res && !!res.onCreated) {
      res.onCreated(propertyGrid, obj, question, prop);
    }
  },
};

class SurveyHelper {
  public static getNewName(
    objs: Array<any>,
    keyPropName: string,
    baseName: string
  ): string {
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
  public get obj() {
    return this.objValue;
  }
  public set obj(value: Base) {
    if (this.objValue != value) {
      this.objValue = value;
      this.surveyValue = this.createSurvey(this.getSurveyJSON());
      var page = this.surveyValue.createNewPage("p1");
      this.setupObjPanel(page, this.obj, false);
      this.survey.addPage(page);
      this.survey.editingObj = value;
      if (this.objValueChangedCallback) {
        this.objValueChangedCallback();
      }
    }
  }
  public get survey() {
    return this.surveyValue;
  }
  protected createSurvey(json: any): SurveyModel {
    return new SurveyModel(json);
  }
  protected getSurveyJSON(): any {
    return {
      showNavigationButtons: "none",
    };
  }
  public setupObjPanel(panel: PanelModelBase, obj: Base, isNextedObj: boolean) {
    panel.fromJSON(this.createJSON(obj, isNextedObj));
    this.onQuestionsCreated(panel, obj);
  }
  private createJSON(obj: Base, isNextedObj: boolean): any {
    var props = Serializer.getPropertiesByObj(obj);
    var panels: any = {};
    var isFirstPanel = true;
    for (var i = 0; i < props.length; i++) {
      var propJSON = this.createQuestionJSON(obj, props[i]);
      if (!propJSON) continue;
      var category = props[i].category;
      if (!category) category = "general";
      var panel = panels[category];
      if (!panel) {
        panel = this.createPanelJSON(category, isFirstPanel);
        panels[category] = panel;
        isFirstPanel = false;
      }
      panel.elements.push(propJSON);
    }
    var json: any = {
      elements: [],
    };
    for (var key in panels) {
      if (key == "general" && isNextedObj) {
        var els = panels[key].elements;
        for (var i = 0; i < els.length; i++) {
          json.elements.push(els[i]);
        }
      } else {
        json.elements.push(panels[key]);
      }
    }
    return json;
  }
  private onQuestionsCreated(panel: PanelModelBase, obj: Base) {
    var properties = Serializer.getPropertiesByObj(obj);
    var props: any = {};
    for (var i = 0; i < properties.length; i++) {
      props[properties[i].name] = properties[i];
    }
    var questions = panel.questions;
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var prop = props[q.name];
      PropertyGridEditorCollection.onCreated(this, obj, q, prop);
    }
  }
  private createPanelJSON(category: string, isFirstPanel: boolean): any {
    return {
      type: "panel",
      name:
        "property_grid_category" +
        (PropertyGridModel.panelNameIndex++).toString(),
      title: category,
      state: isFirstPanel ? "expanded" : "collapsed",
      elements: [],
    };
  }
  private createQuestionJSON(obj: Base, prop: JsonObjectProperty): any {
    var json = PropertyGridEditorCollection.getJSON(obj, prop);
    if (!json) return null;
    json.name = prop.name;
    json.visible = prop.visible;
    return json;
  }
}
PropertyGridEditorCollection.register({
  fit(prop: JsonObjectProperty): boolean {
    return prop.type == "boolean" || prop.type == "switch";
  },
  getJSON(obj: Base, prop: JsonObjectProperty): any {
    return { type: "boolean", default: false };
  },
});
PropertyGridEditorCollection.register({
  fit(prop: JsonObjectProperty): boolean {
    return prop.type == "string";
  },
  getJSON(obj: Base, prop: JsonObjectProperty): any {
    return { type: "text" };
  },
});
PropertyGridEditorCollection.register({
  fit(prop: JsonObjectProperty): boolean {
    return prop.type == "text";
  },
  getJSON(obj: Base, prop: JsonObjectProperty): any {
    return { type: "comment" };
  },
});
PropertyGridEditorCollection.register({
  fit(prop: JsonObjectProperty): boolean {
    return prop.type == "string" && prop.hasChoices;
  },
  getJSON(obj: Base, prop: JsonObjectProperty): any {
    return {
      type: "dropdown",
      showOptionsCaption: false,
      choices: prop.getChoices(this.obj),
    };
  },
});
function getColumnPropertyJSON(className: string, propName: string): any {
  var prop = Serializer.findProperty(className, propName);
  if (!prop) return null;
  var json = PropertyGridEditorCollection.getJSON(null, prop);
  if (!json) return null;
  json.name = prop.name;
  if (!!json.type) {
    json.cellType = json.type;
    delete json.type;
  }
  return json;
}
function getColumnsJSON(
  className: string,
  propNames: Array<string>
): Array<any> {
  var res: Array<any> = [];
  for (var i = 0; i < propNames.length; i++) {
    var columnJSON = getColumnPropertyJSON(className, propNames[i]);
    if (!!columnJSON) {
      res.push(columnJSON);
    }
  }
  return res;
}
function getMatrixJSON(
  prop: JsonObjectProperty,
  propNames: Array<string>
): any {
  return {
    type: "matrixdynamic",
    detailPanelMode: "default",
    cellType: "text",
    rowCount: 0,
    columns: getColumnsJSON(prop.className, propNames),
  };
}
function createNewItem(
  matrix: QuestionMatrixDynamicModel,
  prop: JsonObjectProperty,
  keyPropName: string
): Base {
  var newName = SurveyHelper.getNewName(
    matrix.value,
    keyPropName,
    prop.getBaseValue()
  );
  var item = Serializer.createClass(prop.className, { keyPropName: newName });
  matrix.value.push(item);
  return item;
}
function setupMatrixQuestion(
  propertyGrid: PropertyGridModel,
  matrix: QuestionMatrixDynamicModel
) {
  matrix.onHasDetailPanelCallback = (
    row: MatrixDropdownRowModelBase
  ): boolean => {
    return true;
  };
  matrix.onCreateDetailPanelCallback = (
    row: MatrixDropdownRowModelBase,
    panel: PanelModel
  ) => {
    propertyGrid.setupObjPanel(panel, row.editingObj, true);
  };
}
PropertyGridEditorCollection.register({
  fit(prop: JsonObjectProperty): boolean {
    return prop.type == "itemvalue[]";
  },
  getJSON(obj: Base, prop: JsonObjectProperty): any {
    return getMatrixJSON(prop, ["value", "text"]);
  },
  onCreated(
    propertyGrid: PropertyGridModel,
    obj: Base,
    question: Question,
    prop: JsonObjectProperty
  ) {
    question.onGetValueForNewRowCallBack = (
      sender: QuestionMatrixDynamicModel
    ): any => {
      return createNewItem(sender, prop, "value");
    };
    setupMatrixQuestion(propertyGrid, <QuestionMatrixDynamicModel>question);
  },
});
PropertyGridEditorCollection.register({
  fit(prop: JsonObjectProperty): boolean {
    return prop.type == "matrixdropdowncolumns";
  },
  getJSON(obj: Base, prop: JsonObjectProperty): any {
    return getMatrixJSON(prop, ["cellType", "name", "title"]);
  },
  onCreated(
    propertyGrid: PropertyGridModel,
    obj: Base,
    question: Question,
    prop: JsonObjectProperty
  ) {
    question.onGetValueForNewRowCallBack = (
      sender: QuestionMatrixDynamicModel
    ): any => {
      return createNewItem(sender, prop, "name");
    };
    setupMatrixQuestion(propertyGrid, <QuestionMatrixDynamicModel>question);
  },
});

import { describe, test, expect } from "vitest";
import { Serializer } from "../src/jsonobject";
import { Question } from "../src/question";
import { SurveyModel } from "../src/survey";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";

// The metadata the matrix and dynamic panel types expose, written out in full. Any change to a
// property name, default, visibility or order fails here. Where an inherited property is declared
// is deliberately left out: only what the concrete types expose is pinned.

interface IPropertyEntry {
  name: string;
  default?: any;
  visible: boolean;
}

const concreteTypes = ["matrix", "matrixdropdown", "matrixdynamic", "paneldynamic"];

function createQuestion(type: string): Question {
  switch(type) {
    case "matrix": return new QuestionMatrixModel("q1");
    case "matrixdropdown": return new QuestionMatrixDropdownModel("q1");
    case "matrixdynamic": return new QuestionMatrixDynamicModel("q1");
    case "paneldynamic": return new QuestionPanelDynamicModel("q1");
  }
  return null;
}
// The only non-primitive defaults are the empty item-value arrays of rows, columns and choices;
// they are compared as the plain JSON of what defaultValue returns.
function toEntry(prop: { name: string, defaultValue: any, visible: boolean }): IPropertyEntry {
  const defaultValue = prop.defaultValue;
  const res: IPropertyEntry = { name: prop.name, visible: prop.visible };
  if (defaultValue !== undefined) {
    res.default = defaultValue !== null && typeof defaultValue === "object" ? JSON.parse(JSON.stringify(defaultValue)) : defaultValue;
  }
  return res;
}
// The serializer order: toJSON() writes the properties in it. An entry without "default" has an
// undefined default value.
const expectedMergedProperties: { [type: string]: Array<IPropertyEntry> } = {
  matrix: [
    { name: "name", visible: true },
    { name: "state", default: "default", visible: true },
    { name: "visible", default: true, visible: true },
    { name: "useDisplayValuesInDynamicTexts", default: true, visible: true },
    { name: "visibleIf", visible: true },
    { name: "width", visible: true },
    { name: "minWidth", visible: true },
    { name: "maxWidth", visible: true },
    { name: "colSpan", visible: false },
    { name: "effectiveColSpan", visible: true },
    { name: "startWithNewLine", default: true, visible: true },
    { name: "indent", default: 0, visible: true },
    { name: "page", visible: true },
    { name: "title", visible: true },
    { name: "titleLocation", default: "default", visible: true },
    { name: "showTitle", visible: true },
    { name: "description", visible: true },
    { name: "descriptionLocation", default: "default", visible: true },
    { name: "showNumber", default: true, visible: true },
    { name: "hideNumber", visible: false },
    { name: "valueName", visible: true },
    { name: "enableIf", visible: true },
    { name: "resetValueIf", visible: true },
    { name: "setValueIf", visible: true },
    { name: "setValueExpression", visible: true },
    { name: "defaultValue", visible: true },
    { name: "defaultValueExpression", visible: true },
    { name: "correctAnswer", visible: true },
    { name: "clearIfInvisible", default: "default", visible: true },
    { name: "isRequired", visible: true },
    { name: "requiredIf", visible: true },
    { name: "requiredErrorText", visible: true },
    { name: "errorLocation", default: "default", visible: true },
    { name: "readOnly", visible: true },
    { name: "allowFiltering", default: true, visible: true },
    { name: "validators", visible: true },
    { name: "bindings", visible: true },
    { name: "renderAs", default: "default", visible: false },
    { name: "showCommentArea", visible: true },
    { name: "commentText", visible: true },
    { name: "commentPlaceholder", visible: true },
    { name: "defaultDisplayValue", visible: true },
    { name: "randomize", default: true, visible: false },
    { name: "randomizeCategory", visible: false },
    { name: "columnsVisibleIf", visible: true },
    { name: "rowsVisibleIf", visible: true },
    { name: "columnMinWidth", visible: true },
    { name: "showHeader", default: true, visible: true },
    { name: "verticalAlign", default: "middle", visible: true },
    { name: "alternateRows", default: false, visible: true },
    { name: "displayMode", default: "auto", visible: false },
    { name: "rowTitleWidth", visible: true },
    { name: "columns", default: [], visible: true },
    { name: "rows", default: [], visible: true },
    { name: "cells", visible: true },
    { name: "rowOrder", default: "initial", visible: true },
    { name: "eachRowRequired", visible: true },
    { name: "eachRowUnique", visible: true },
    { name: "hideIfRowsEmpty", visible: true },
    { name: "cellComponent", default: "survey-matrix-cell", visible: false },
    { name: "cellType", default: "radio", visible: true },
  ],
  matrixdropdown: [
    { name: "name", visible: true },
    { name: "state", default: "default", visible: true },
    { name: "visible", default: true, visible: true },
    { name: "useDisplayValuesInDynamicTexts", default: true, visible: true },
    { name: "visibleIf", visible: true },
    { name: "width", visible: true },
    { name: "minWidth", visible: true },
    { name: "maxWidth", visible: true },
    { name: "colSpan", visible: false },
    { name: "effectiveColSpan", visible: true },
    { name: "startWithNewLine", default: true, visible: true },
    { name: "indent", default: 0, visible: true },
    { name: "page", visible: true },
    { name: "title", visible: true },
    { name: "titleLocation", default: "default", visible: true },
    { name: "showTitle", visible: true },
    { name: "description", visible: true },
    { name: "descriptionLocation", default: "default", visible: true },
    { name: "showNumber", default: true, visible: true },
    { name: "hideNumber", visible: false },
    { name: "valueName", visible: true },
    { name: "enableIf", visible: true },
    { name: "resetValueIf", visible: true },
    { name: "setValueIf", visible: true },
    { name: "setValueExpression", visible: true },
    { name: "defaultValue", visible: true },
    { name: "defaultValueExpression", visible: true },
    { name: "correctAnswer", visible: true },
    { name: "clearIfInvisible", default: "default", visible: true },
    { name: "isRequired", visible: true },
    { name: "requiredIf", visible: true },
    { name: "requiredErrorText", visible: true },
    { name: "errorLocation", default: "default", visible: true },
    { name: "readOnly", visible: true },
    { name: "allowFiltering", default: true, visible: true },
    { name: "validators", visible: true },
    { name: "bindings", visible: true },
    { name: "renderAs", default: "default", visible: false },
    { name: "showCommentArea", visible: true },
    { name: "commentText", visible: true },
    { name: "commentPlaceholder", visible: true },
    { name: "defaultDisplayValue", visible: true },
    { name: "randomize", default: true, visible: false },
    { name: "randomizeCategory", visible: false },
    { name: "columnsVisibleIf", visible: true },
    { name: "rowsVisibleIf", visible: true },
    { name: "columnMinWidth", visible: true },
    { name: "showHeader", default: true, visible: true },
    { name: "verticalAlign", default: "middle", visible: true },
    { name: "alternateRows", default: false, visible: true },
    { name: "displayMode", default: "auto", visible: false },
    { name: "columns", visible: true },
    { name: "columnLayout", visible: false },
    { name: "transposeData", visible: true },
    { name: "detailElements", visible: false },
    { name: "detailPanelMode", default: "none", visible: true },
    { name: "cellErrorLocation", default: "default", visible: true },
    { name: "detailErrorLocation", default: "default", visible: true },
    { name: "horizontalScroll", visible: false },
    { name: "choices", default: [], visible: true },
    { name: "placeholder", visible: true },
    { name: "keyDuplicationError", visible: true },
    { name: "singleInputTitleTemplate", visible: true },
    { name: "cellType", default: "dropdown", visible: true },
    { name: "columnColCount", default: 0, visible: true },
    { name: "allowAdaptiveActions", default: false, visible: false },
    { name: "rows", default: [], visible: true },
    { name: "rowTitleWidth", visible: true },
    { name: "totalText", visible: true },
    { name: "hideIfRowsEmpty", visible: true },
    { name: "rowOrder", default: "initial", visible: true },
    { name: "rowsPerPage", default: 0, visible: false },
    { name: "sortBy", default: "", visible: false },
    { name: "filterExpression", default: "", visible: false },
  ],
  matrixdynamic: [
    { name: "name", visible: true },
    { name: "state", default: "default", visible: true },
    { name: "visible", default: true, visible: true },
    { name: "useDisplayValuesInDynamicTexts", default: true, visible: true },
    { name: "visibleIf", visible: true },
    { name: "width", visible: true },
    { name: "minWidth", visible: true },
    { name: "maxWidth", visible: true },
    { name: "colSpan", visible: false },
    { name: "effectiveColSpan", visible: true },
    { name: "startWithNewLine", default: true, visible: true },
    { name: "indent", default: 0, visible: true },
    { name: "page", visible: true },
    { name: "title", visible: true },
    { name: "titleLocation", default: "default", visible: true },
    { name: "showTitle", visible: true },
    { name: "description", visible: true },
    { name: "descriptionLocation", default: "default", visible: true },
    { name: "showNumber", default: true, visible: true },
    { name: "hideNumber", visible: false },
    { name: "valueName", visible: true },
    { name: "enableIf", visible: true },
    { name: "resetValueIf", visible: true },
    { name: "setValueIf", visible: true },
    { name: "setValueExpression", visible: true },
    { name: "defaultValue", visible: true },
    { name: "defaultValueExpression", visible: true },
    { name: "correctAnswer", visible: true },
    { name: "clearIfInvisible", default: "default", visible: true },
    { name: "isRequired", visible: true },
    { name: "requiredIf", visible: true },
    { name: "requiredErrorText", visible: true },
    { name: "errorLocation", default: "default", visible: true },
    { name: "readOnly", visible: true },
    { name: "allowFiltering", default: true, visible: true },
    { name: "validators", visible: true },
    { name: "bindings", visible: true },
    { name: "renderAs", default: "default", visible: false },
    { name: "showCommentArea", visible: true },
    { name: "commentText", visible: true },
    { name: "commentPlaceholder", visible: true },
    { name: "defaultDisplayValue", visible: true },
    { name: "randomize", default: true, visible: false },
    { name: "randomizeCategory", visible: false },
    { name: "columnsVisibleIf", visible: true },
    { name: "rowsVisibleIf", visible: true },
    { name: "columnMinWidth", visible: true },
    { name: "showHeader", default: true, visible: true },
    { name: "verticalAlign", default: "middle", visible: true },
    { name: "alternateRows", default: false, visible: true },
    { name: "displayMode", default: "auto", visible: false },
    { name: "columns", visible: true },
    { name: "columnLayout", visible: false },
    { name: "transposeData", visible: true },
    { name: "detailElements", visible: false },
    { name: "detailPanelMode", default: "none", visible: true },
    { name: "cellErrorLocation", default: "default", visible: true },
    { name: "detailErrorLocation", default: "default", visible: true },
    { name: "horizontalScroll", visible: false },
    { name: "choices", default: [], visible: true },
    { name: "placeholder", visible: true },
    { name: "keyDuplicationError", visible: true },
    { name: "singleInputTitleTemplate", visible: true },
    { name: "cellType", default: "dropdown", visible: true },
    { name: "columnColCount", default: 0, visible: true },
    { name: "allowAdaptiveActions", default: false, visible: false },
    { name: "allowAddRows", default: true, visible: true },
    { name: "allowRemoveRows", default: true, visible: true },
    { name: "rowCount", default: 2, visible: true },
    { name: "rowCountExpression", visible: true },
    { name: "minRowCount", default: 0, visible: true },
    { name: "maxRowCount", default: 1000, visible: true },
    { name: "keyName", visible: true },
    { name: "defaultRowValue", visible: true },
    { name: "copyDefaultValueFromLastEntry", visible: true },
    { name: "confirmDelete", visible: true },
    { name: "confirmDeleteText", visible: true },
    { name: "addRowButtonLocation", default: "default", visible: true },
    { name: "addRowText", visible: true },
    { name: "removeRowText", visible: true },
    { name: "hideColumnsIfEmpty", visible: true },
    { name: "noRowsText", visible: true },
    { name: "detailPanelShowOnAdding", visible: true },
    { name: "allowRowReorder", visible: true },
    { name: "rowsPerPage", default: 0, visible: false },
    { name: "allowSortRows", default: false, visible: false },
    { name: "sortBy", default: "", visible: false },
    { name: "filterExpression", default: "", visible: false },
  ],
  paneldynamic: [
    { name: "name", visible: true },
    { name: "state", default: "default", visible: true },
    { name: "visible", default: true, visible: true },
    { name: "useDisplayValuesInDynamicTexts", default: true, visible: true },
    { name: "visibleIf", visible: true },
    { name: "width", visible: true },
    { name: "minWidth", visible: true },
    { name: "maxWidth", visible: true },
    { name: "colSpan", visible: false },
    { name: "effectiveColSpan", visible: true },
    { name: "startWithNewLine", default: true, visible: true },
    { name: "indent", default: 0, visible: true },
    { name: "page", visible: true },
    { name: "title", visible: true },
    { name: "titleLocation", default: "default", visible: true },
    { name: "showTitle", visible: true },
    { name: "description", visible: true },
    { name: "descriptionLocation", default: "default", visible: true },
    { name: "showNumber", default: true, visible: true },
    { name: "hideNumber", visible: false },
    { name: "valueName", visible: true },
    { name: "enableIf", visible: true },
    { name: "resetValueIf", visible: true },
    { name: "setValueIf", visible: true },
    { name: "setValueExpression", visible: true },
    { name: "defaultValue", visible: true },
    { name: "defaultValueExpression", visible: true },
    { name: "correctAnswer", visible: true },
    { name: "clearIfInvisible", default: "default", visible: true },
    { name: "isRequired", visible: true },
    { name: "requiredIf", visible: true },
    { name: "requiredErrorText", visible: true },
    { name: "errorLocation", default: "default", visible: true },
    { name: "readOnly", visible: true },
    { name: "allowFiltering", default: true, visible: true },
    { name: "validators", visible: true },
    { name: "bindings", visible: true },
    { name: "renderAs", default: "default", visible: false },
    { name: "showCommentArea", visible: true },
    { name: "commentText", visible: true },
    { name: "commentPlaceholder", visible: true },
    { name: "defaultDisplayValue", visible: true },
    { name: "randomize", default: true, visible: false },
    { name: "randomizeCategory", visible: false },
    { name: "templateElements", visible: false },
    { name: "templateTitle", visible: true },
    { name: "templateTabTitle", visible: true },
    { name: "tabTitlePlaceholder", visible: true },
    { name: "templateDescription", visible: true },
    { name: "noEntriesText", visible: true },
    { name: "allowAddPanel", default: true, visible: true },
    { name: "allowRemovePanel", default: true, visible: true },
    { name: "newPanelPosition", default: "last", visible: true },
    { name: "panelCount", default: 0, visible: true },
    { name: "panelCountExpression", visible: true },
    { name: "minPanelCount", default: 0, visible: true },
    { name: "maxPanelCount", default: 100, visible: true },
    { name: "defaultPanelValue", visible: true },
    { name: "copyDefaultValueFromLastEntry", visible: true },
    { name: "panelsState", default: "default", visible: true },
    { name: "keyName", visible: true },
    { name: "keyDuplicationError", visible: true },
    { name: "confirmDelete", visible: true },
    { name: "confirmDeleteText", visible: true },
    { name: "addPanelText", visible: true },
    { name: "removePanelText", visible: true },
    { name: "prevPanelText", visible: true },
    { name: "nextPanelText", visible: true },
    { name: "showQuestionNumbers", default: "off", visible: true },
    { name: "questionStartIndex", visible: true },
    { name: "renderMode", visible: false },
    { name: "panelsPerPage", default: 0, visible: false },
    { name: "sortBy", default: "", visible: false },
    { name: "filterExpression", default: "", visible: false },
    { name: "displayMode", default: "list", visible: true },
    { name: "showProgressBar", default: true, visible: true },
    { name: "progressBarLocation", default: "top", visible: true },
    { name: "tabAlign", default: "center", visible: true },
    { name: "templateQuestionTitleLocation", default: "default", visible: true },
    { name: "templateQuestionTitleWidth", visible: true },
    { name: "templateErrorLocation", default: "default", visible: true },
    { name: "templateVisibleIf", visible: true },
    { name: "removePanelButtonLocation", default: "bottom", visible: true },
  ],
};
// The properties each class registers itself, in registration order, and its serializer parent.
// They show a registration that moves between one of these classes and its parent while the
// merged list stays the same.
const expectedOwnRegistrations: { [type: string]: { parentName: string, properties: Array<string> } } = {
  matrixdropdown: {
    parentName: "matrixdropdownbase",
    properties: ["rows", "rowsVisibleIf", "rowTitleWidth", "totalText", "hideIfRowsEmpty", "rowOrder", "rowsPerPage", "sortBy", "filterExpression"]
  },
  matrixdynamic: {
    parentName: "matrixdropdownbase",
    properties: [
      "allowAddRows", "allowRemoveRows", "rowCount", "rowCountExpression", "minRowCount", "maxRowCount",
      "keyName", "defaultRowValue", "copyDefaultValueFromLastEntry", "confirmDelete", "confirmDeleteText",
      "addRowButtonLocation", "addRowText", "removeRowText", "hideColumnsIfEmpty", "noRowsText",
      "detailPanelShowOnAdding", "allowRowReorder",
      "rowsPerPage", "allowSortRows", "sortBy", "filterExpression"
    ]
  },
  paneldynamic: {
    parentName: "question",
    properties: [
      "showCommentArea", "templateElements", "templateTitle", "templateTabTitle", "tabTitlePlaceholder",
      "templateDescription", "noEntriesText", "allowAddPanel", "allowRemovePanel", "newPanelPosition",
      "panelCount", "panelCountExpression", "minPanelCount", "maxPanelCount", "defaultPanelValue",
      "copyDefaultValueFromLastEntry", "panelsState", "keyName", "keyDuplicationError", "confirmDelete",
      "confirmDeleteText", "addPanelText", "removePanelText", "prevPanelText", "nextPanelText",
      "showQuestionNumbers", "questionStartIndex", "renderMode",
      "panelsPerPage", "sortBy", "filterExpression",
      "displayMode", "showProgressBar", "progressBarLocation", "tabAlign", "templateQuestionTitleLocation",
      "templateQuestionTitleWidth", "templateErrorLocation", "templateVisibleIf", "removePanelButtonLocation"
    ]
  }
};
const ancestors = ["question", "matrixdropdownbase", "matrix", "matrixdropdown", "matrixdynamic", "paneldynamic"];
// Serializer.isDescendantOf(type, ancestor) for each ancestor above, in that order.
const expectedAncestry: { [type: string]: Array<boolean> } = {
  matrix: [true, false, true, false, false, false],
  matrixdropdown: [true, true, false, true, false, false],
  matrixdynamic: [true, true, false, false, true, false],
  paneldynamic: [true, false, false, false, false, true],
  matrixdropdownbase: [true, true, false, false, false, false],
};

describe("Matrix and dynamic panel serializer metadata", () => {
  test("each type exposes the same properties with the same defaults, visibility and order", () => {
    concreteTypes.forEach(type => {
      expect(Serializer.getProperties(type).map(prop => toEntry(prop)), type).toEqual(expectedMergedProperties[type]);
    });
  });
  test("a created question has the same properties as its serializer class", () => {
    concreteTypes.forEach(type => {
      const names = Serializer.getPropertiesByObj(createQuestion(type)).map(prop => prop.name);
      expect(names, type).toEqual(Serializer.getProperties(type).map(prop => prop.name));
    });
  });
  test("the dropdown matrices and the dynamic panel keep their own registrations and parents", () => {
    Object.keys(expectedOwnRegistrations).forEach(type => {
      const classInfo = Serializer.findClass(type);
      expect({ parentName: classInfo.parentName, properties: classInfo.properties.map(prop => prop.name) }, type)
        .toEqual(expectedOwnRegistrations[type]);
    });
  });
  test("each type descends from the same classes", () => {
    const actual: { [type: string]: Array<boolean> } = {};
    Object.keys(expectedAncestry).forEach(type => {
      actual[type] = ancestors.map(ancestor => Serializer.isDescendantOf(type, ancestor));
    });
    expect(actual).toEqual(expectedAncestry);
  });
  test("a created question answers isDescendantOf(\"matrixdropdownbase\") the way the linter and Creator ask it", () => {
    const actual: { [type: string]: boolean } = {};
    concreteTypes.forEach(type => {
      actual[type] = createQuestion(type).isDescendantOf("matrixdropdownbase");
    });
    expect(actual).toEqual({ matrix: false, matrixdropdown: true, matrixdynamic: true, paneldynamic: false });
  });
  test("a property added to matrixdropdownbase reaches both dropdown matrices and no other type", () => {
    const propName = "matrixDropdownBaseProbe";
    try {
      const prop = Serializer.addProperty("matrixdropdownbase", { name: propName, default: "probe-default" });
      expect(prop).toBeTruthy();
      expect(prop.name).toBe(propName);
      expect(Serializer.findProperty("matrixdropdown", propName)).toBe(prop);
      expect(Serializer.findProperty("matrixdynamic", propName)).toBe(prop);
      expect(Serializer.findProperty("matrix", propName)).toBeUndefined();
      expect(Serializer.findProperty("paneldynamic", propName)).toBeUndefined();

      ["matrixdropdown", "matrixdynamic"].forEach(type => {
        const question = <any>createQuestion(type);
        expect(question[propName], type + ": default").toBe("probe-default");
        question[propName] = "probe-value";
        expect(question[propName], type + ": assigned").toBe("probe-value");
        expect(question.toJSON()[propName], type + ": toJSON").toBe("probe-value");

        const fromJson = <any>createQuestion(type);
        fromJson.fromJSON({ name: "q2", [propName]: "from-json" });
        expect(fromJson[propName], type + ": fromJSON").toBe("from-json");

        const survey = new SurveyModel({ elements: [{ type: type, name: "q3", [propName]: "from-survey" }] });
        const loaded = <any>survey.getQuestionByName("q3");
        expect(loaded[propName], type + ": survey JSON").toBe("from-survey");
        expect(loaded.toJSON()[propName], type + ": survey JSON, toJSON").toBe("from-survey");
      });
      ["matrix", "paneldynamic"].forEach(type => {
        const survey = new SurveyModel({ elements: [{ type: type, name: "q1", [propName]: "from-survey" }] });
        expect(survey.getQuestionByName("q1").toJSON()[propName], type).toBeUndefined();
      });
    } finally {
      Serializer.removeProperty("matrixdropdownbase", propName);
    }
    expect(Serializer.findProperty("matrixdropdown", propName)).toBeUndefined();
    expect(Serializer.findProperty("matrixdynamic", propName)).toBeUndefined();
    concreteTypes.forEach(type => {
      expect(Serializer.getProperties(type).map(prop => prop.name), type)
        .toEqual(expectedMergedProperties[type].map(entry => entry.name));
    });
  });
});

import { describe, test, expect, afterEach, vi } from "vitest";
import { SurveyModel } from "../src/survey";
import { Serializer, JsonObject } from "../src/jsonobject";
import { ConsoleWarnings } from "../src/console-warnings";
import { QuestionTextModel } from "../src/question_text";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { propertyDefaultsState } from "../src/survey-property-defaults-state";

export * from "../src/question_text";
export * from "../src/question_checkbox";
export * from "../src/question_imagepicker";
export * from "../src/question_matrixdynamic";
export * from "../src/question_paneldynamic";
export * from "../src/question_multipletext";
export * from "../src/question_dropdown";
export * from "../src/validator";
export * from "../src/trigger";
export * from "../src/mask/mask_numeric";

const surveys: Array<SurveyModel> = [];
function create(json?: any, options?: any): SurveyModel {
  const survey = new SurveyModel(json, options);
  surveys.push(survey);
  return survey;
}
function withLayer(classes: any, json?: any): SurveyModel {
  return create(json, { propertyDefaults: { classes: classes } });
}
afterEach(() => {
  while(surveys.length > 0) surveys.pop().dispose();
  vi.restoreAllMocks();
});

describe("Per-survey property defaults", () => {
  test("A class override applies to its survey only", () => {
    const json = { elements: [{ type: "text", name: "q1" }] };
    const s = withLayer({ question: { titleLocation: "left" } }, json);
    const plain = create(json);
    const q = s.getQuestionByName("q1");
    expect(q.titleLocation).toBe("left");
    expect(plain.getQuestionByName("q1").titleLocation).toBe("default");
    expect(q.descriptionLocation).toBe("default");
    expect(q.startWithNewLine).toBe(true);
  });
  test("Inheritance: the nearest class with an entry wins", () => {
    const json = { elements: [{ type: "text", name: "q1" }, { type: "dropdown", name: "q2" }] };
    const s = withLayer({ question: { titleLocation: "left" }, text: { titleLocation: "bottom" } }, json);
    expect(s.getQuestionByName("q1").titleLocation).toBe("bottom");
    expect(s.getQuestionByName("q2").titleLocation).toBe("left");
  });
  test("A parent entry reaches a child that declares its own default", () => {
    const json = { elements: [{ type: "imagepicker", name: "q1" }, { type: "checkbox", name: "q2" }] };
    const s = withLayer({ checkboxbase: { colCount: 3 } }, json);
    expect(s.getQuestionByName("q1").colCount).toBe(3);
    expect(s.getQuestionByName("q2").colCount).toBe(3);
    const s2 = withLayer({ checkboxbase: { colCount: 3 }, imagepicker: { colCount: 0 } }, json);
    expect(s2.getQuestionByName("q1").colCount).toBe(0);
    expect(s2.getQuestionByName("q2").colCount).toBe(3);
  });
  test("A Serializer.getProperty copy does not change which entry applies", () => {
    Serializer.getProperty("text", "titleLocation");
    try {
      const s = withLayer({ question: { titleLocation: "left" } }, { elements: [{ type: "text", name: "q1" }] });
      expect(s.getQuestionByName("q1").titleLocation).toBe("left");
    } finally {
      Serializer.removeProperty("text", "titleLocation");
      Serializer.findClass("question").resetAllProperties();
    }
    expect(Serializer.findProperty("text", "titleLocation")).toBe(Serializer.findProperty("question", "titleLocation"));
  });
  test("A standalone element reads the defaults of the survey it is added to", () => {
    const s = withLayer({ question: { titleLocation: "left" } }, { elements: [] });
    const other = create({ elements: [] });
    const q = new QuestionTextModel("q1");
    expect(q.titleLocation).toBe("default");
    s.pages.length === 0 && s.addNewPage("p1");
    other.addNewPage("p1");
    s.pages[0].addElement(q);
    expect(q.titleLocation).toBe("left");
    s.pages[0].removeElement(q);
    other.pages[0].addElement(q);
    expect(q.titleLocation).toBe("default");
  });
  test("The survey's own properties", () => {
    const s = withLayer({ survey: { showProgressBar: true, questionsOnPageMode: "singlePage" } });
    const plain = create();
    expect(s.showProgressBar).toBe(true);
    expect(s.questionsOnPageMode).toBe("singlePage");
    expect(plain.showProgressBar).toBe(false);
    expect(plain.questionsOnPageMode).toBe("standard");
  });
  test("Owned objects: a validator, a trigger, a calculated value, matrix rows", () => {
    const json = {
      elements: [
        { type: "text", name: "q1", validators: [{ type: "numeric" }] },
        { type: "matrixdynamic", name: "m1", columns: [{ name: "c1" }] }
      ],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "q2" }],
      calculatedValues: [{ name: "v1", expression: "1" }]
    };
    const s = withLayer({
      surveyvalidator: { notificationType: "warning" },
      setvaluetrigger: { isVariable: true },
      calculatedvalue: { includeIntoResult: true },
      matrixdynamic: { rowCount: 5 }
    }, json);
    const plain = create(json);
    expect(s.getQuestionByName("q1").validators[0].notificationType).toBe("warning");
    expect(plain.getQuestionByName("q1").validators[0].notificationType).toBe("error");
    expect((<any>s.triggers[0]).isVariable).toBe(true);
    expect((<any>plain.triggers[0]).isVariable).toBe(false);
    expect(s.calculatedValues[0].includeIntoResult).toBe(true);
    expect(plain.calculatedValues[0].includeIntoResult).toBe(false);
    expect((<QuestionMatrixDynamicModel>s.getQuestionByName("m1")).visibleRows.length).toBe(5);
    expect((<QuestionMatrixDynamicModel>plain.getQuestionByName("m1")).visibleRows.length).toBe(2);
  });
  test("An item value", () => {
    const json = { elements: [{ type: "checkbox", name: "q1", choices: [1, 2] }] };
    const s = withLayer({ itemvalue: { randomize: false } }, json);
    const plain = create(json);
    expect(s.getQuestionByName("q1").choices[0].randomize).toBe(false);
    expect(plain.getQuestionByName("q1").choices[0].randomize).toBe(true);
    expect(s.toJSON()).toEqual(plain.toJSON());
  });
  test("propertyDefaults() before fromJSON affects everything loaded", () => {
    const s = create();
    s.propertyDefaults({ classes: { question: { titleLocation: "left" } } });
    s.fromJSON({ elements: [{ type: "text", name: "q1" }] });
    expect(s.getQuestionByName("q1").titleLocation).toBe("left");
  });
  test("propertyDefaults() after the load changes later reads only", () => {
    const json = { pages: [{ elements: [{ type: "text", name: "q1" }] }, { elements: [{ type: "text", name: "q2" }] }] };
    const s = create(json);
    expect(s.visiblePages.length).toBe(2);
    s.propertyDefaults({ classes: { question: { titleLocation: "left" }, survey: { questionsOnPageMode: "singlePage" } } });
    expect(s.getQuestionByName("q1").titleLocation).toBe("left");
    expect(s.questionsOnPageMode).toBe("singlePage");
    // Layout built at load is not rebuilt
    expect(s.visiblePages.length).toBe(2);
  });
  describe("Serialization", () => {
    const layer = {
      question: { titleLocation: "left" },
      text: { inputType: "number" },
      surveyvalidator: { notificationType: "warning" },
      calculatedvalue: { includeIntoResult: true },
      setvaluetrigger: { isVariable: true },
      masksettings: { saveMaskedValue: true },
      numericmask: { precision: 5 },
      multipletextitem: { inputType: "number" }
    };
    const json = {
      pages: [{
        name: "page1",
        elements: [
          { type: "text", name: "q1", validators: [{ type: "numeric" }, { type: "expression", expression: "{q1} > 1" }] },
          { type: "text", name: "q2", maskType: "numeric" },
          { type: "text", name: "q3" },
          { type: "matrixdynamic", name: "m1", columns: [{ name: "c1", cellType: "text" }, { name: "c2", cellType: "dropdown", choices: [1, 2] }] },
          { type: "paneldynamic", name: "pd1", templateElements: [{ type: "text", name: "pq1" }] },
          { type: "multipletext", name: "mt1", items: [{ name: "i1" }] }
        ]
      }],
      triggers: [{ type: "setvalue", expression: "{q1} = 1", setToName: "q3" }],
      calculatedValues: [{ name: "v1", expression: "1" }]
    };
    test("S.toJSON() equals the JSON of the same definition without the layer", () => {
      const s = withLayer(layer, json);
      const plain = create(json);
      expect(s.toJSON()).toEqual(plain.toJSON());
      expect(s.toJSON()).toEqual(json);
    });
    test("A text question with no mask writes no maskSettings", () => {
      const s = withLayer(layer, json);
      expect(s.getQuestionByName("q3").toJSON().maskSettings).toBeUndefined();
    });
    test("Matrix cells read the layer and store nothing", () => {
      const s = withLayer(layer, json);
      const m = <QuestionMatrixDynamicModel>s.getQuestionByName("m1");
      const cellQ = m.visibleRows[0].cells[0].question;
      expect(cellQ.getType()).toBe("text");
      expect((<any>cellQ).inputType).toBe("number");
      expect((<any>cellQ).getPropertyValueWithoutDefault("inputType")).toBeUndefined();
      const colJson = m.columns[0].toJSON();
      expect(colJson.titleLocation).toBeUndefined();
      expect(colJson.inputType).toBeUndefined();
    });
    test("After S.toJSON(), the objects still read the layer", () => {
      const s = withLayer(layer, json);
      s.toJSON();
      expect(s.getQuestionByName("q1").titleLocation).toBe("left");
      expect((<any>s.getQuestionByName("q1")).inputType).toBe("number");
      expect(s.getQuestionByName("q1").validators[0].notificationType).toBe("warning");
      expect(s.calculatedValues[0].includeIntoResult).toBe(true);
    });
    test("A value equal to the survey's default is not written; a survey with the same defaults reads it back", () => {
      const explicitJson = {
        pages: [{
          name: "page1",
          elements: [
            { type: "text", name: "q1", titleLocation: "left", inputType: "number", validators: [{ type: "numeric", notificationType: "warning" }] }
          ]
        }],
        calculatedValues: [{ name: "v1", expression: "1", includeIntoResult: true }]
      };
      const s = withLayer(layer, explicitJson);
      const res = s.toJSON();
      expect(res).toEqual({
        pages: [{ name: "page1", elements: [{ type: "text", name: "q1", validators: [{ type: "numeric" }] }] }],
        calculatedValues: [{ name: "v1", expression: "1" }]
      });
      const same = withLayer(layer, res);
      const q = same.getQuestionByName("q1");
      expect(q.titleLocation).toBe("left");
      expect((<any>q).inputType).toBe("number");
      expect(q.validators[0].notificationType).toBe("warning");
      expect(same.calculatedValues[0].includeIntoResult).toBe(true);
      // The JSON follows the survey's defaults, as it follows the global defaults: a survey without them reads the global ones
      expect(create(res).getQuestionByName("q1").titleLocation).toBe("default");
    });
    test("A value set in code equal to the survey's default is not written", () => {
      const s = withLayer({ question: { titleLocation: "left", readOnly: true } }, { elements: [{ type: "text", name: "q1" }] });
      const q = s.getQuestionByName("q1");
      q.titleLocation = "left";
      q.readOnly = true;
      expect(q.toJSON().titleLocation).toBeUndefined();
      expect(q.toJSON().readOnly).toBeUndefined();
    });
    test("A value equal to the global default but not to the layer is written; equal to both is omitted", () => {
      const s = withLayer({ question: { titleLocation: "left" } }, { elements: [{ type: "text", name: "q1" }, { type: "text", name: "q2" }] });
      const q = s.getQuestionByName("q1");
      q.titleLocation = "default";
      expect(q.titleLocation).toBe("default");
      expect(q.toJSON().titleLocation).toBe("default");
      const q2 = s.getQuestionByName("q2");
      q2.descriptionLocation = "default";
      expect(q2.toJSON().descriptionLocation).toBeUndefined();
    });
    test("A copy loaded with the survey's defaults keeps an explicit global default", () => {
      const s = withLayer({ question: { titleLocation: "left" } }, { elements: [{ type: "text", name: "q1", titleLocation: "default" }] });
      const q = s.getQuestionByName("q1");
      expect(q.titleLocation).toBe("default");
      const copyJson = new JsonObject().toJsonObject(q);
      expect(copyJson.titleLocation).toBe("default");
      const copy = new QuestionTextModel("q2");
      new JsonObject().toObject(copyJson, copy, { propertyDefaults: s.getOwnPropertyDefaults() });
      s.pages[0].addElement(copy);
      expect(copy.titleLocation).toBe("default");
      // Without the option the copy compares its JSON with the global defaults while it loads
      const copy2 = new QuestionTextModel("q3");
      new JsonObject().toObject(copyJson, copy2);
      s.pages[0].addElement(copy2);
      expect(copy2.titleLocation).toBe("left");
    });
    test("clone() and dynamic panels keep an explicit global default", () => {
      const s = withLayer({ question: { titleLocation: "left" } }, {
        elements: [
          { type: "text", name: "q1", titleLocation: "default" },
          { type: "paneldynamic", name: "pd1", panelCount: 1, templateElements: [{ type: "text", name: "t1", titleLocation: "default" }, { type: "text", name: "t2" }] }
        ]
      });
      const cl = <any>s.getQuestionByName("q1").clone();
      cl.name = "q1c";
      s.pages[0].addElement(cl);
      expect(cl.titleLocation).toBe("default");
      const pd: any = s.getQuestionByName("pd1");
      expect(pd.panels[0].getQuestionByName("t1").titleLocation).toBe("default");
      expect(pd.panels[0].getQuestionByName("t2").titleLocation).toBe("left");
      pd.addPanel();
      expect(pd.panels[1].getQuestionByName("t1").titleLocation).toBe("default");
    });
  });
  test("An unknown class or property and a non-primitive value warn and are ignored", () => {
    const warn = vi.spyOn(ConsoleWarnings, "warn").mockImplementation(() => {});
    const s = withLayer({ questio: { titleLocation: "left" }, question: { titleLocaton: "left", titleLocation: "left", startWithNewLine: {} } },
      { elements: [{ type: "text", name: "q1" }] });
    expect(s.getQuestionByName("q1").titleLocation).toBe("left");
    expect(s.getQuestionByName("q1").startWithNewLine).toBe(true);
    const texts = warn.mock.calls.map(c => c[0]);
    expect(texts.length).toBe(3);
    expect(texts[0].indexOf("questio") > -1).toBe(true);
    expect(texts[1].indexOf("question.titleLocaton") > -1).toBe(true);
    expect(texts[2].indexOf("question.startWithNewLine") > -1).toBe(true);
  });
  test("settings({ propertyDefaults }) warns; the constructor option does not", () => {
    const warn = vi.spyOn(ConsoleWarnings, "warn").mockImplementation(() => {});
    const s = withLayer({ question: { titleLocation: "left" } });
    expect(warn).not.toHaveBeenCalled();
    s.settings(<any>{ propertyDefaults: { classes: {} } });
    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn.mock.calls[0][0].indexOf("survey.propertyDefaults()") > -1).toBe(true);
  });
  test("Class names are matched in lower case", () => {
    const s = withLayer({ Question: { titleLocation: "left" } }, { elements: [{ type: "text", name: "q1" }] });
    expect(s.getQuestionByName("q1").titleLocation).toBe("left");
  });
  test("Merge and removal", () => {
    const start = propertyDefaultsState.liveLayerCount;
    const s = create({ elements: [{ type: "text", name: "q1" }] });
    const q = s.getQuestionByName("q1");
    s.propertyDefaults({ classes: { question: { titleLocation: "left" } } });
    s.propertyDefaults({ classes: { question: { descriptionLocation: "underInput" } } });
    expect(q.titleLocation).toBe("left");
    expect(q.descriptionLocation).toBe("underInput");
    expect(propertyDefaultsState.liveLayerCount).toBe(start + 1);
    s.propertyDefaults({ classes: { question: { titleLocation: undefined } } });
    expect(q.titleLocation).toBe("default");
    expect(q.descriptionLocation).toBe("underInput");
    s.propertyDefaults({ classes: { question: undefined, survey: { showProgressBar: true } } });
    expect(q.descriptionLocation).toBe("default");
    expect(s.showProgressBar).toBe(true);
    expect(propertyDefaultsState.liveLayerCount).toBe(start + 1);
    s.propertyDefaults({ classes: undefined });
    expect(s.showProgressBar).toBe(false);
    expect(propertyDefaultsState.liveLayerCount).toBe(start);
    expect(s.getOwnPropertyDefaults()).toBeUndefined();
  });
  test("dispose() decrements the count once; a survey without a layer never increments it", () => {
    const start = propertyDefaultsState.liveLayerCount;
    const plain = new SurveyModel({ elements: [{ type: "text", name: "q1" }] });
    expect(propertyDefaultsState.liveLayerCount).toBe(start);
    plain.dispose();
    expect(propertyDefaultsState.liveLayerCount).toBe(start);
    const s = new SurveyModel(null, { propertyDefaults: { classes: { question: { titleLocation: "left" } } } });
    expect(propertyDefaultsState.liveLayerCount).toBe(start + 1);
    s.dispose();
    expect(propertyDefaultsState.liveLayerCount).toBe(start);
    s.dispose();
    expect(propertyDefaultsState.liveLayerCount).toBe(start);
  });
  describe("Matrices", () => {
    test("A cell keeps an explicit column value equal to the global default", () => {
      const json = {
        elements: [{ type: "matrixdynamic", name: "m1", rowCount: 1,
          columns: [{ name: "c1", cellType: "text", inputType: "text" }, { name: "c2", cellType: "text" }] }]
      };
      const s = withLayer({ text: { inputType: "number" } }, json);
      const m = <QuestionMatrixDynamicModel>s.getQuestionByName("m1");
      const cell1: any = m.visibleRows[0].cells[0].question;
      const cell2: any = m.visibleRows[0].cells[1].question;
      expect(cell1.inputType).toBe("text");
      expect(cell1.getPropertyValueWithoutDefault("inputType")).toBe("text");
      expect(cell2.inputType).toBe("number");
      expect(cell2.getPropertyValueWithoutDefault("inputType")).toBeUndefined();
      const same = withLayer({ text: { inputType: "number" } }, s.toJSON());
      expect((<any>(<QuestionMatrixDynamicModel>same.getQuestionByName("m1")).visibleRows[0].cells[0].question).inputType).toBe("text");
      m.rowCount = 2;
      expect((<any>m.visibleRows[1].cells[0].question).inputType).toBe("text");
    });
    test("Detail template questions read the matrix survey's layer", () => {
      const json = {
        elements: [{ type: "matrixdynamic", name: "m1", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
          detailElements: [{ type: "text", name: "d1", titleLocation: "default" }, { type: "text", name: "d2" }] }]
      };
      const s = withLayer({ question: { titleLocation: "left" } }, json);
      const m = <QuestionMatrixDynamicModel>s.getQuestionByName("m1");
      expect(m.detailPanel.getQuestionByName("d1").titleLocation).toBe("default");
      expect(m.detailPanel.getQuestionByName("d2").titleLocation).toBe("left");
      const row = m.visibleRows[0];
      row.showDetailPanel();
      expect(row.detailPanel.getQuestionByName("d1").titleLocation).toBe("default");
      expect(row.detailPanel.getQuestionByName("d2").titleLocation).toBe("left");
      expect(s.toJSON().pages[0].elements[0].detailElements).toEqual(json.elements[0].detailElements);
      const same = withLayer({ question: { titleLocation: "left" } }, s.toJSON());
      const prow = (<QuestionMatrixDynamicModel>same.getQuestionByName("m1")).visibleRows[0];
      prow.showDetailPanel();
      expect(prow.detailPanel.getQuestionByName("d1").titleLocation).toBe("default");
    });
  });
});

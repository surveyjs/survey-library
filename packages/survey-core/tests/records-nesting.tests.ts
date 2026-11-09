import { SurveyModel } from "../src/survey";
import { Question } from "../src/question";
import { PanelModel } from "../src/panel";
import { Serializer } from "../src/jsonobject";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { MatrixDropdownRowModelBase } from "../src/question_matrixdropdownbase";
import { PanelDataScope } from "../src/panel-data-scope";
import { ValueGetter } from "../src/conditions/conditionProcessValue";
import { describe, test, expect } from "vitest";

// Records nesting 02: a panel with valueName inside a dynamic panel's template or a matrix's detail panel keeps its
// questions' values in an object inside the record (decisions RN1-RN7).

const pdJson = (extra?: any, inner?: Array<any>): any => Object.assign({ elements: [
  { type: "paneldynamic", name: "items", templateElements: [
    { type: "text", name: "title" },
    { type: "panel", name: "p1", valueName: "address", elements: inner || [{ type: "text", name: "street" }] }
  ] }
] }, extra || {});
const matrixJson = (extra?: any, type: string = "matrixdynamic"): any => Object.assign({ elements: [
  Object.assign({ type: type, name: "rows", detailPanelMode: "underRow", columns: [{ name: "col1", cellType: "text" }],
    detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] },
  type === "matrixdropdown" ? { rows: ["r1", "r2"] } : { rowCount: 0 })
] }, extra || {});
const pdOf = (survey: SurveyModel): QuestionPanelDynamicModel => <QuestionPanelDynamicModel>survey.getQuestionByName("items");
const matrixOf = (survey: SurveyModel): QuestionMatrixDynamicModel => <QuestionMatrixDynamicModel>survey.getQuestionByName("rows");
const inPanel = (panel: PanelModel, name: string): Question => <Question>panel.getQuestionByName(name);
const detailOf = (row: MatrixDropdownRowModelBase, name: string): Question => {
  row.showDetailPanel();
  return <Question>row.detailPanel.getQuestionByName(name);
};

describe("records nesting: a dynamic panel", () => {
  test("typing, question.value, survey.setValue, survey.data and mergeData give the nested record", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "title").value = "A";
    inPanel(pd.panels[0], "street").value = "Main St";
    expect(survey.data, "#1 typing").toEqual({ items: [{ title: "A", address: { street: "Main St" } }] });
    expect(pd.value, "#2").toEqual([{ title: "A", address: { street: "Main St" } }]);

    pd.value = [{ title: "B", address: { street: "S2" } }, { address: { street: "S3" } }];
    expect(inPanel(pd.panels[0], "street").value, "#3 question.value").toBe("S2");
    expect(inPanel(pd.panels[1], "street").value, "#4").toBe("S3");
    expect(inPanel(pd.panels[1], "title").isEmpty(), "#5").toBe(true);

    survey.setValue("items", [{ title: "C", address: { street: "S4" } }]);
    expect(pd.panels.length, "#6 survey.setValue").toBe(1);
    expect(inPanel(pd.panels[0], "street").value, "#7").toBe("S4");

    survey.data = { items: [{ title: "D", address: { street: "S5" } }] };
    expect(inPanel(pd.panels[0], "street").value, "#8 survey.data").toBe("S5");
    expect(inPanel(pd.panels[0], "title").value, "#9").toBe("D");

    survey.mergeData({ items: [{ title: "E", address: { street: "S6" } }] });
    expect(inPanel(pd.panels[0], "street").value, "#10 mergeData").toBe("S6");

    inPanel(pd.panels[0], "street").clearValue();
    expect(survey.data, "#11 the empty object is removed").toEqual({ items: [{ title: "E" }] });
  });
  test("the inner question's scope, its value scope and its data path (RN4)", () => {
    const survey = new SurveyModel(pdJson());
    survey.data = { items: [{ title: "A", address: { street: "x" } }] };
    const panel = pdOf(survey).panels[0];
    const p1 = <PanelModel>panel.getElementByName("p1");
    const street = inPanel(panel, "street");
    const title = inPanel(panel, "title");
    expect(p1.isDataNesting, "#1").toBe(true);
    expect(street.data instanceof PanelDataScope, "#2").toBe(true);
    expect(street.getValueScope(), "#3 the panel's scope").toBe(p1.getDataScope());
    expect(street.getDataPath(), "#4 relative to the record").toEqual(["address", "street"]);
    expect(p1.getDataPath(), "#5").toEqual(["address"]);
    expect(title.getValueScope(), "#6 a question directly in a record answers the survey").toBe(survey);
    expect(pdOf(survey).template.getDataScope(), "#7 the record panel itself never nests (RN6)").toBeFalsy();
    expect(panel.getDataScope(), "#8").toBeFalsy();
  });
  test("a panel without valueName stays transparent, and two levels nest", () => {
    const survey = new SurveyModel(pdJson(undefined, [
      { type: "panel", name: "plain", elements: [{ type: "text", name: "zip" }] },
      { type: "panel", name: "p2", valueName: "b", elements: [{ type: "text", name: "street" }] }
    ]));
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "zip").value = "z";
    inPanel(pd.panels[0], "street").value = "s";
    expect(survey.data).toEqual({ items: [{ address: { zip: "z", b: { street: "s" } } }] });
    expect(inPanel(pd.panels[0], "street").getDataPath()).toEqual(["address", "b", "street"]);
    survey.data = { items: [{ address: { zip: "z2", b: { street: "s2" } } }] };
    expect(inPanel(pd.panels[0], "zip").value).toBe("z2");
    expect(inPanel(pd.panels[0], "street").value).toBe("s2");
  });
  test("dataNesting modes follow RN3: only valueName nests in a record, \"none\" switches it off", () => {
    const json = (mode: string): any => pdJson({ dataNesting: mode }, [
      { type: "text", name: "street" },
      { type: "panel", name: "plain", elements: [{ type: "text", name: "zip" }] }
    ]);
    ["auto", "panel", "page", "panelAndPage"].forEach(mode => {
      const survey = new SurveyModel(json(mode));
      const pd = pdOf(survey);
      pd.addPanel();
      inPanel(pd.panels[0], "street").value = "s";
      inPanel(pd.panels[0], "zip").value = "z";
      const value = survey.getValue("items") || (survey.data.page1 || {}).items;
      expect(value, mode).toEqual([{ address: { street: "s", zip: "z" } }]);
    });
    const none = new SurveyModel(json("none"));
    const pd = pdOf(none);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(none.data, "none").toEqual({ items: [{ street: "s" }] });
  });
  test("records added, removed, sorted and paged keep each record's nested object", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "b", address: { street: "B" } }, { title: "a", address: { street: "A" } }, { title: "c", address: { street: "C" } }] };
    pd.addPanel();
    inPanel(pd.panels[3], "street").value = "D";
    expect(pd.value[3], "#1 added").toEqual({ address: { street: "D" } });
    pd.removePanel(0);
    expect(pd.value.map((r: any) => r.address.street), "#2 removed").toEqual(["A", "C", "D"]);
    expect(pd.panels.map(p => inPanel(p, "street").value), "#3").toEqual(["A", "C", "D"]);
    pd.sortCriteria = [{ field: "title", direction: "desc" }];
    expect(pd.panels.map(p => inPanel(p, "street").value), "#4 sorted").toEqual(["C", "A", "D"]);
    inPanel(pd.panels[0], "street").value = "C2";
    expect(pd.value.map((r: any) => r.address.street), "#5 a sorted panel writes into its record").toEqual(["A", "C2", "D"]);
    pd.sortCriteria = [];
    pd.pageSize = 2;
    pd.pageIndex = 1;
    expect(pd.panels.map(p => inPanel(p, "street").value), "#6 paged").toEqual(["D"]);
  });
  test("display value, isEmpty, clearIncorrectValues keeps the container key, removes an unknown key inside it", () => {
    const survey = new SurveyModel(pdJson(undefined, [{ type: "dropdown", name: "kind", choices: [{ value: 1, text: "One" }] }]));
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "A", address: { kind: 1, foo: 2 }, bar: 3 }] };
    expect(pd.isEmpty(), "#1").toBe(false);
    expect(pd.getDisplayValue(false), "#2 the nested object is formatted by its questions").toEqual([{ title: "A", address: { kind: "One", foo: 2 }, bar: 3 }]);
    pd.clearIncorrectValues();
    expect(survey.data, "#3").toEqual({ items: [{ title: "A", address: { kind: 1 } }] });
  });
  test("setData() reports unknown keys inside a record's object with the path (D6)", () => {
    const survey = new SurveyModel(pdJson());
    const issues = survey.setData({ items: [{ title: "A", address: { street: "s", foo: 1 }, bar: 2 }] });
    expect(issues.map(issue => issue.type + ":" + issue.path).sort()).toEqual(["unknownProperty:items[0].address.foo", "unknownProperty:items[0].bar"]);
  });
  test("defaults inside the object land in the object", () => {
    const survey = new SurveyModel(pdJson(undefined, [{ type: "text", name: "street", defaultValue: "def" }]));
    const pd = pdOf(survey);
    pd.addPanel();
    expect(survey.data).toEqual({ items: [{ address: { street: "def" } }] });
  });
  test("events: one onValueChanged and one onDynamicPanelValueChanged per inner write", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    pd.addPanel();
    const changed: Array<string> = [];
    const panelChanged: Array<string> = [];
    survey.onValueChanged.add((_, o) => changed.push(o.name + "=" + JSON.stringify(o.value)));
    survey.onDynamicPanelValueChanged.add((_, o) => panelChanged.push(o.name + "=" + JSON.stringify(o.value)));
    inPanel(pd.panels[0], "street").value = "x";
    expect(changed).toEqual(["items=[{\"address\":{\"street\":\"x\"}}]"]);
    expect(panelChanged, "the inner question's name and value, as for a question directly in the panel").toEqual(["street=\"x\""]);
  });
  test("expressions: {panel.address.street}, {panel.address}, {street} and {title} inside the nesting panel, {prevPanel.address.street}", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "items", templateElements: [
        { type: "text", name: "title" },
        { type: "panel", name: "p1", valueName: "address", elements: [
          { type: "text", name: "street" },
          { type: "expression", name: "inner1", expression: "{street} + '-' + {panel.title}" },
          { type: "expression", name: "inner2", expression: "{title}" }
        ] },
        { type: "expression", name: "direct2", expression: "{title}" },
        { type: "expression", name: "e1", expression: "{panel.address.street}" },
        { type: "expression", name: "e2", expression: "{prevPanel.address.street}" },
        { type: "text", name: "vis", visibleIf: "{panel.address.street} = 'show'" },
        { type: "text", name: "t1", title: "Street: {panel.address.street}" }
      ] }
    ] });
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "A", address: { street: "S1" } }, { title: "B", address: { street: "show" } }] };
    const p0 = pd.panels[0];
    const p1 = pd.panels[1];
    expect(inPanel(p0, "e1").value, "#1").toBe("S1");
    expect(inPanel(p0, "inner1").value, "#2").toBe("S1-A");
    expect(inPanel(p0, "inner2").value, "#2a {title} resolves as for a question directly in the panel").toBe(inPanel(p0, "direct2").value);
    expect(inPanel(p1, "e2").value, "#3").toBe("S1");
    expect(inPanel(p0, "vis").isVisible, "#4").toBe(false);
    expect(inPanel(p1, "vis").isVisible, "#5").toBe(true);
    inPanel(p0, "street").value = "show";
    expect(inPanel(p0, "e1").value, "#6 a dependency re-runs").toBe("show");
    expect(inPanel(p0, "vis").isVisible, "#7").toBe(true);
    expect(inPanel(p0, "inner1").value, "#8").toBe("show-A");
    expect(inPanel(p1, "e2").value, "#9 the next panel re-runs").toBe("show");
    expect(inPanel(p0, "t1").locTitle.renderedHtml, "#10 text piping").toBe("Street: show");
    const ctx = (<any>p0.data).getValueGetterContext();
    expect(new ValueGetter().getValue("panel.address", ctx), "#11 the object").toEqual({ street: "show", inner1: "show-A" });
  });
  test("a trigger in the record writes into an inner question; a calculated value over a record's nested field", () => {
    const survey = new SurveyModel({
      calculatedValues: [{ name: "firstStreet", expression: "{items[0].address.street}" }],
      elements: [
        { type: "paneldynamic", name: "items", templateElements: [
          { type: "text", name: "title", setValueIf: "{panel.address.street} = 'x'", setValueExpression: "'set'" },
          { type: "panel", name: "p1", valueName: "address", elements: [
            { type: "text", name: "street" },
            { type: "text", name: "city", setValueIf: "{panel.title} = 'go'", setValueExpression: "'Oslo'" }
          ] }
        ] },
        { type: "expression", name: "calc", expression: "{firstStreet}" }
      ] });
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "x";
    expect(inPanel(pd.panels[0], "title").value, "#1").toBe("set");
    inPanel(pd.panels[0], "title").value = "go";
    expect(inPanel(pd.panels[0], "city").value, "#2").toBe("Oslo");
    expect(pd.value, "#3").toEqual([{ title: "go", address: { street: "x", city: "Oslo" } }]);
    expect(survey.getQuestionByName("calc").value, "#4").toBe("x");
  });
  test("clearInvisibleValues / clearIfInvisible: a hidden nesting panel inside a record is cleared as a plain one is", () => {
    // Inside a record a hidden panel's questions are cleared on completion; a question's clearIfInvisible
    // "onHidden" does not clear them when their panel hides. Both as for a panel without valueName.
    const create = (valueName: string, clearInvisibleValues: string, clearIfInvisible: string): SurveyModel => {
      const survey = new SurveyModel({ clearInvisibleValues: clearInvisibleValues, elements: [
        { type: "paneldynamic", name: "items", templateElements: [
          { type: "text", name: "title" },
          { type: "panel", name: "p1", valueName: valueName, visibleIf: "{panel.title} != 'hide'", elements: [
            { type: "text", name: "street", clearIfInvisible: clearIfInvisible }, { type: "text", name: "city" }] }
        ] }
      ] });
      const pd = pdOf(survey);
      pd.addPanel();
      inPanel(pd.panels[0], "street").value = "s";
      inPanel(pd.panels[0], "city").value = "c";
      inPanel(pd.panels[0], "title").value = "hide";
      return survey;
    };
    const completed = create("address", "onComplete", "default");
    completed.doComplete();
    expect(completed.data, "#1 the empty object is removed").toEqual({ items: [{ title: "hide" }] });
    const flatCompleted = create(undefined, "onComplete", "default");
    flatCompleted.doComplete();
    expect(flatCompleted.data, "#2 flat").toEqual({ items: [{ title: "hide" }] });
    expect(create("address", "none", "onHidden").data, "#3").toEqual({ items: [{ title: "hide", address: { street: "s", city: "c" } }] });
    expect(create(undefined, "none", "onHidden").data, "#4 flat").toEqual({ items: [{ title: "hide", street: "s", city: "c" }] });
  });
  test("checkErrorsMode \"onValueChanging\": an invalid inner value is not written", () => {
    const survey = new SurveyModel(pdJson({ checkErrorsMode: "onValueChanging" },
      [{ type: "text", name: "street", validators: [{ type: "numeric", minValue: 10 }] }]));
    const pd = pdOf(survey);
    pd.addPanel();
    const street = inPanel(pd.panels[0], "street");
    street.value = 5;
    expect(street.errors.length, "#1").toBe(1);
    expect(survey.data, "#2 the panel's empty record only").toEqual({ items: [{}] });
    street.value = 20;
    expect(street.errors.length, "#3").toBe(0);
    expect(survey.data, "#4").toEqual({ items: [{ address: { street: 20 } }] });
  });
  test("survey.clearEmptyValues() inside a record's object", () => {
    const survey = new SurveyModel(pdJson(undefined, [{ type: "text", name: "street" }, { type: "text", name: "city" }]));
    survey.data = { items: [{ title: "A", address: { street: "", city: "c" } }] };
    survey.clearEmptyValues();
    expect(survey.data).toEqual({ items: [{ title: "A", address: { city: "c" } }] });
    expect(inPanel(pdOf(survey).panels[0], "city").value).toBe("c");
  });
  test("runtime: valueName set and cleared on a panel inside a template's panel, dataNesting switched to \"none\" (D8)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    survey.data = { items: [{ street: "flat" }] };
    const pd = pdOf(survey);
    const p1 = <PanelModel>pd.panels[0].getElementByName("p1");
    p1.valueName = "address";
    expect(p1.isDataNesting, "#1").toBe(true);
    expect(inPanel(pd.panels[0], "street").isEmpty(), "#2 reads from the new place").toBe(true);
    inPanel(pd.panels[0], "street").value = "nested";
    expect(survey.data, "#3 the old key stays").toEqual({ items: [{ street: "flat", address: { street: "nested" } }] });
    p1.valueName = "";
    expect(inPanel(pd.panels[0], "street").value, "#4 reads the flat key again").toBe("flat");

    p1.valueName = "address";
    expect(inPanel(pd.panels[0], "street").value, "#5").toBe("nested");
    survey.dataNesting = "none";
    expect(p1.isDataNesting, "#6").toBe(false);
    expect(inPanel(pd.panels[0], "street").value, "#7").toBe("flat");
    survey.dataNesting = "auto";
    expect(inPanel(pd.panels[0], "street").value, "#8").toBe("nested");
  });
  test("a template valueName change reaches the panels built after it", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "items", templateElements: [
        { type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }
      ] }
    ] });
    const pd = pdOf(survey);
    (<PanelModel>pd.template.getElementByName("p1")).valueName = "address";
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(survey.data).toEqual({ items: [{ address: { street: "s" } }] });
  });
  test("sort fields: a question inside a nesting panel is not offered (RN5)", () => {
    const survey = new SurveyModel(pdJson({}, [{ type: "text", name: "street" }]));
    const pd = pdOf(survey);
    pd.allowSort = true;
    const fields = pd.getDesignSortFields().map(f => f.field);
    expect(fields).toEqual(["title"]);
    survey.data = { items: [{ title: "b", address: { street: "1" } }, { title: "a", address: { street: "2" } }] };
    pd.sortCriteria = [{ field: "street", direction: "asc" }];
    expect(pd.panels.map(p => inPanel(p, "title").value), "an unknown field is ignored").toEqual(["b", "a"]);
  });
});

describe("records nesting: a matrix detail panel", () => {
  ["matrixdynamic", "matrixdropdown"].forEach(type => {
    test(type + ": typing, question.value and survey.data give the nested record", () => {
      const survey = new SurveyModel(matrixJson(undefined, type));
      const matrix = matrixOf(survey);
      if (type === "matrixdynamic") matrix.addRow();
      const row = matrix.visibleRows[0];
      row.getQuestionByColumnName("col1").value = 1;
      detailOf(row, "street").value = "Main St";
      const expected = [{ col1: 1, address: { street: "Main St" } }];
      const value = type === "matrixdynamic" ? expected : { r1: expected[0] };
      expect(survey.data, "#1").toEqual({ rows: value });
      expect(row.value, "#2 the row value").toEqual(expected[0]);
      expect(row.isEmpty, "#3").toBe(false);

      const newValue = type === "matrixdynamic" ? [{ col1: 2, address: { street: "S2" } }] : { r1: { col1: 2, address: { street: "S2" } } };
      matrix.value = newValue;
      const row2 = matrix.visibleRows[0];
      expect(row2.getQuestionByColumnName("col1").value, "#4").toBe(2);
      expect(detailOf(row2, "street").value, "#5 a detail panel created after the record is set reads it").toBe("S2");

      survey.data = { rows: type === "matrixdynamic" ? [{ address: { street: "S3" } }] : { r1: { address: { street: "S3" } } } };
      expect(detailOf(matrix.visibleRows[0], "street").value, "#6").toBe("S3");
      detailOf(matrix.visibleRows[0], "street").clearValue();
      // A dynamic matrix keeps its empty records (Bug#12147); a dropdown matrix drops an empty row.
      expect(survey.data, "#7 the empty object is removed").toEqual(type === "matrixdynamic" ? { rows: [{}] } : {});
    });
  });
  test("the detail question's data path is relative to the row (RN4); a cell keeps the survey", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    matrix.addRow();
    const row = matrix.visibleRows[0];
    const street = detailOf(row, "street");
    expect(street.getDataPath()).toEqual(["address", "street"]);
    expect(row.getQuestionByColumnName("col1").getValueScope()).toBe(survey);
    expect(row.detailPanel.getDataScope(), "the detail panel itself never nests (RN6)").toBeFalsy();
  });
  test("events: one onMatrixCellValueChanged and one onValueChanged per inner write", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    matrix.addRow();
    const row = matrix.visibleRows[0];
    const street = detailOf(row, "street");
    const cells: Array<string> = [];
    const changing: Array<string> = [];
    const changed: Array<string> = [];
    survey.onMatrixCellValueChanged.add((_, o) => cells.push(o.columnName + "=" + JSON.stringify(o.value)));
    survey.onMatrixCellValueChanging.add((_, o) => changing.push(o.columnName + "=" + JSON.stringify(o.value)));
    survey.onValueChanged.add((_, o) => changed.push(o.name));
    street.value = "x";
    expect(changing, "#1 the container key and the object").toEqual(["address={\"street\":\"x\"}"]);
    expect(cells, "#2").toEqual(["address={\"street\":\"x\"}"]);
    expect(changed, "#3").toEqual(["rows"]);
  });
  test("onMatrixCellValueChanging changes the object: the inner question follows", () => {
    const survey = new SurveyModel(matrixJson());
    survey.onMatrixCellValueChanging.add((_, o) => {
      if (o.columnName === "address") o.value = { street: o.value.street.toUpperCase() };
    });
    const matrix = matrixOf(survey);
    matrix.addRow();
    const street = detailOf(matrix.visibleRows[0], "street");
    street.value = "abc";
    expect(survey.data).toEqual({ rows: [{ address: { street: "ABC" } }] });
    expect(street.value).toBe("ABC");
  });
  test("expressions: {row.address.street} and {row.address}; a calculated value over a row's nested field", () => {
    const survey = new SurveyModel({
      calculatedValues: [{ name: "firstStreet", expression: "{rows[0].address.street}" }],
      elements: [
        { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow",
          columns: [{ name: "col1", cellType: "expression", expression: "{row.address.street}" }],
          detailElements: [
            { type: "panel", name: "p1", valueName: "address", elements: [
              { type: "text", name: "street" }, { type: "expression", name: "inner1", expression: "{street} + '!'" }] },
            { type: "expression", name: "d1", expression: "{row.address.street}" }
          ] },
        { type: "expression", name: "calc", expression: "{firstStreet}" }
      ] });
    const matrix = matrixOf(survey);
    const row = matrix.visibleRows[0];
    detailOf(row, "street").value = "S";
    expect(row.getQuestionByColumnName("col1").value, "#1").toBe("S");
    expect(detailOf(row, "d1").value, "#2").toBe("S");
    expect(detailOf(row, "inner1").value, "#3").toBe("S!");
    expect(survey.getQuestionByName("calc").value, "#4").toBe("S");
    expect(new ValueGetter().getValue("row.address", row.getValueGetterContext()), "#5").toEqual({ street: "S", inner1: "S!" });
  });
  test("clearIncorrectValues keeps the container key; setData() reports an unknown key inside it", () => {
    const survey = new SurveyModel(matrixJson());
    const issues = survey.setData({ rows: [{ col1: "1", address: { street: "s", foo: 1 } }] });
    expect(issues.map(issue => issue.type + ":" + issue.path).sort()).toEqual(["unknownProperty:rows[0].address.foo"]);
    const matrix = matrixOf(survey);
    matrix.clearIncorrectValues();
    expect(survey.data).toEqual({ rows: [{ col1: "1", address: { street: "s" } }] });
    expect(matrix.getDisplayValue(false)).toEqual([{ col1: "1", address: { street: "s" } }]);
  });
  test("checkErrorsMode \"onValueChanging\": an invalid detail value is not written", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanging", elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [
          { type: "text", name: "street", validators: [{ type: "numeric", minValue: 10 }] }] }] }
    ] });
    const street = detailOf(matrixOf(survey).visibleRows[0], "street");
    street.value = 5;
    expect(street.errors.length, "#1").toBe(1);
    expect(survey.data, "#2 the matrix's empty record only").toEqual({ rows: [{}] });
    street.value = 20;
    expect(survey.data, "#3").toEqual({ rows: [{ address: { street: 20 } }] });
  });
  test("defaults inside the detail panel's object", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street", defaultValue: "def" }] }] }
    ] });
    const row = matrixOf(survey).visibleRows[0];
    expect(detailOf(row, "street").value).toBe("def");
    expect(row.value).toEqual({ address: { street: "def" } });
  });
  test("rows sorted keep each record's nested object", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    survey.data = { rows: [{ col1: "b", address: { street: "B" } }, { col1: "a", address: { street: "A" } }] };
    matrix.sortCriteria = [{ field: "col1", direction: "asc" }];
    expect(matrix.visibleRows.map(r => detailOf(r, "street").value)).toEqual(["A", "B"]);
    detailOf(matrix.visibleRows[0], "street").value = "A2";
    expect(survey.data).toEqual({ rows: [{ col1: "b", address: { street: "B" } }, { col1: "a", address: { street: "A2" } }] });
  });
  test("sort fields: a question inside a nesting detail panel is not offered (RN5)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "rows", allowSort: true, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "text", name: "flat" }, { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }] }
    ] });
    expect(matrixOf(survey).getDesignSortFields().map(f => f.field)).toEqual(["col1", "flat"]);
  });
  test("runtime: valueName set and cleared on a detail panel's inner panel, dataNesting \"none\" (D8)", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "col1" }],
        detailElements: [{ type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }] }
    ] });
    survey.data = { rows: [{ street: "flat" }] };
    const row = matrixOf(survey).visibleRows[0];
    const street = detailOf(row, "street");
    const p1 = <PanelModel>row.detailPanel.getElementByName("p1");
    p1.valueName = "address";
    expect(street.isEmpty(), "#1").toBe(true);
    street.value = "nested";
    expect(survey.data, "#2 the old key stays").toEqual({ rows: [{ street: "flat", address: { street: "nested" } }] });
    p1.valueName = "";
    expect(street.value, "#3").toBe("flat");
    p1.valueName = "address";
    survey.dataNesting = "none";
    expect(detailOf(matrixOf(survey).visibleRows[0], "street").value, "#4").toBe("flat");
  });
  test("getRecordDataNestingKey of a panel in the detail panel template follows the survey's dataNesting", () => {
    // The template is attached to no survey: the key reads the mode through the matrix (Creator prompt 04).
    const survey = new SurveyModel(matrixJson({ dataNesting: "none" }));
    const p1 = <PanelModel>matrixOf(survey).detailPanel.getElementByName("p1");
    expect(p1.getRecordDataNestingKey(), "#1 none").toBe("");
    survey.dataNesting = "auto";
    expect(p1.getRecordDataNestingKey(), "#2 auto").toBe("address");
    const pd = new SurveyModel(pdJson({ dataNesting: "none" }));
    const pdPanel = <PanelModel>(<QuestionPanelDynamicModel>pd.getQuestionByName("items")).template.getElementByName("p1");
    expect(pdPanel.getRecordDataNestingKey(), "#3 a dynamic panel's template, none").toBe("");
  });
});

describe("records nesting: more records", () => {
  test("records filtered keep each record's nested object", () => {
    const survey = new SurveyModel(pdJson());
    const pd = pdOf(survey);
    survey.data = { items: [{ title: "a", address: { street: "A" } }, { title: "b", address: { street: "B" } }] };
    pd.filterExpression = "{title} = 'b'";
    expect(pd.panels.map(p => inPanel(p, "street").value), "#1").toEqual(["B"]);
    inPanel(pd.panels[0], "street").value = "B2";
    expect(survey.data, "#2").toEqual({ items: [{ title: "a", address: { street: "A" } }, { title: "b", address: { street: "B2" } }] });
    pd.filterExpression = "";
    expect(pd.panels.map(p => inPanel(p, "street").value), "#3").toEqual(["A", "B2"]);
  });
  test("clearIncorrectValues reaches a record that has no panel (paged)", () => {
    const survey = new SurveyModel(pdJson({}, [{ type: "dropdown", name: "kind", choices: [1, 2] }]));
    const pd = pdOf(survey);
    pd.pageSize = 1;
    survey.data = { items: [{ address: { kind: 1, foo: 1 } }, { address: { kind: 5, bar: 2 }, baz: 3 }] };
    expect(pd.panels.length, "#1 one panel on the page").toBe(1);
    pd.clearIncorrectValues();
    expect(survey.data, "#2").toEqual({ items: [{ address: { kind: 1 } }, {}] });
  });
  test("two nesting panels on one key in a record share its object (D4)", () => {
    const survey = new SurveyModel(pdJson({}, [{ type: "text", name: "street" }]));
    const pd = pdOf(survey);
    pd.template.addNewQuestion("text", "zip");
    const p2 = new PanelModel("p2");
    p2.valueName = "address";
    p2.addNewQuestion("text", "street2").valueName = "street";
    pd.template.addElement(p2);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(inPanel(pd.panels[0], "street2").value, "#1 the other panel's question follows").toBe("s");
    inPanel(pd.panels[0], "street2").value = "s2";
    expect(inPanel(pd.panels[0], "street").value, "#2").toBe("s2");
    expect(survey.data, "#3").toEqual({ items: [{ address: { street: "s2" } }] });
  });
  test("a question named like the container key inside the panel (D4: allowed)", () => {
    const survey = new SurveyModel(matrixJson());
    const matrix = matrixOf(survey);
    (<PanelModel>matrix.detailPanel.getElementByName("p1")).addNewQuestion("text", "address");
    matrix.addRow();
    const row = matrix.visibleRows[0];
    detailOf(row, "address").value = "inner";
    expect(survey.data).toEqual({ rows: [{ address: { address: "inner" } }] });
  });
  test("auto-advance: a question inside a record's nesting panel answers as one directly in the record (RN4)", () => {
    const create = (valueName: string): SurveyModel => new SurveyModel({ autoAdvanceEnabled: true, pages: [
      { elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
        { type: "panel", name: "p1", valueName: valueName, elements: [{ type: "rating", name: "rate" }] }] }] },
      { elements: [{ type: "text", name: "q2" }] }
    ] });
    [undefined, "address"].forEach(valueName => {
      const survey = create(valueName);
      const rate = inPanel(pdOf(survey).panels[0], "rate");
      expect(rate["isAutoAdvanceOwner"], String(valueName)).toBe(false);
      rate.value = 3;
      expect(survey.currentPageNo, String(valueName)).toBe(0);
    });
  });
  test("review: dataNesting \"none\" switched to \"auto\" at runtime nests the existing panels too (D8)", () => {
    const survey = new SurveyModel(pdJson({ dataNesting: "none" }));
    survey.data = { items: [{ title: "A", street: "flat" }] };
    const pd = pdOf(survey);
    expect(inPanel(pd.panels[0], "street").value, "#1").toBe("flat");
    survey.dataNesting = "auto";
    expect((<PanelModel>pd.panels[0].getElementByName("p1")).isDataNesting, "#2").toBe(true);
    expect(inPanel(pd.panels[0], "street").isEmpty(), "#3 reads from the new place").toBe(true);
    inPanel(pd.panels[0], "street").value = "typed";
    expect(survey.data, "#4").toEqual({ items: [{ title: "A", street: "flat", address: { street: "typed" } }] });
    survey.dataNesting = "none";
    expect(inPanel(pd.panels[0], "street").value, "#5").toBe("flat");
  });
  test("review: a valueName set on a built panel keeps its object through clearIncorrectValues", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [
      { type: "panel", name: "p1", elements: [{ type: "text", name: "street" }] }] }] });
    const pd = pdOf(survey);
    (<PanelModel>pd.panels[0].getElementByName("p1")).valueName = "address";
    inPanel(pd.panels[0], "street").value = "s";
    pd.clearIncorrectValues();
    expect(survey.data).toEqual({ items: [{ address: { street: "s" } }] });
  });
  test("review: a column named like an inner question does not hide the writer from onValueChanging validation", () => {
    const survey = new SurveyModel({ checkErrorsMode: "onValueChanging", elements: [
      { type: "matrixdynamic", name: "rows", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "street" }],
        detailElements: [{ type: "panel", name: "p1", valueName: "address", elements: [
          { type: "text", name: "street", validators: [{ type: "numeric", minValue: 10 }] }] }] }
    ] });
    const row = matrixOf(survey).visibleRows[0];
    row.showDetailPanel();
    const inner = <Question>(<PanelModel>row.detailPanel.getElementByName("p1")).getQuestionByName("street");
    inner.value = 5;
    expect(inner.errors.length, "#1").toBe(1);
    expect(survey.data, "#2").toEqual({ rows: [{}] });
  });
  test("records without a nesting panel keep the released key rules", () => {
    const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "items", templateElements: [
      { type: "panel", name: "plain", elements: [{ type: "text", name: "street" }] }] }] });
    const issues = survey.setData({ items: [{ street: "s", foo: 1 }] });
    expect(issues.map(issue => issue.type + ":" + issue.path)).toEqual(["unknownProperty:items[0].foo"]);
    expect(pdOf(survey).getDisplayValue(false)).toEqual([{ street: "s", foo: 1 }]);
  });
});

describe("records nesting: where a panel may nest", () => {
  test("isInsideRecord() and the valueName editor: shown inside a dynamic panel and a detail panel, hidden on the record panel and in a composite", async () => {
    const { ComponentCollection } = await import("../src/question_custom");
    ComponentCollection.Instance.add({ name: "nestingcomp", elementsJSON: [
      { type: "panel", name: "cin", elements: [{ type: "text", name: "cq" }] }
    ] });
    try {
      const prop = Serializer.findProperty("panel", "valueName");
      const json = { elements: [
        { type: "paneldynamic", name: "pd", panelCount: 1, templateElements: [{ type: "panel", name: "pin", elements: [{ type: "text", name: "q1" }] }] },
        { type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow", columns: [{ name: "c1" }],
          detailElements: [{ type: "panel", name: "din", elements: [{ type: "text", name: "q2" }] }] },
        { type: "nestingcomp", name: "comp" }
      ] };
      [false, true].forEach(isDesign => {
        const survey = new SurveyModel();
        if (isDesign) survey.setDesignMode(true);
        survey.fromJSON(json);
        const label = isDesign ? "design: " : "runtime: ";
        const pd = <QuestionPanelDynamicModel>survey.getQuestionByName("pd");
        const pdPanel = isDesign ? pd.template : pd.panels[0];
        expect(prop.isVisible("", pdPanel), label + "the record panel").toBe(false);
        expect(prop.isVisible("", pdPanel.getElementByName("pin")), label + "a panel inside a dynamic panel").toBe(true);
        const m = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
        const detail = isDesign ? m.detailPanel : (() => { m.visibleRows[0].showDetailPanel(); return m.visibleRows[0].detailPanel; })();
        expect(prop.isVisible("", detail), label + "the detail panel").toBe(false);
        expect(prop.isVisible("", detail.getElementByName("din")), label + "a panel inside a detail panel").toBe(true);
        const content = (<any>survey.getQuestionByName("comp")).contentPanel;
        expect(prop.isVisible("", content.getElementByName("cin")), label + "a panel in a composite").toBe(false);
      });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("the designer's templates never nest", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON(Object.assign(pdJson(), { elements: pdJson().elements.concat(matrixJson().elements) }));
    const pd = pdOf(survey);
    expect((<PanelModel>pd.template.getElementByName("p1")).isDataNesting, "dynamic panel template").toBe(false);
    expect((<PanelModel>matrixOf(survey).detailPanel.getElementByName("p1")).isDataNesting, "detail panel template").toBe(false);
  });
  test("a composite stays flat (N5)", async () => {
    const { ComponentCollection } = await import("../src/question_custom");
    ComponentCollection.Instance.add({ name: "nestingcomp2", elementsJSON: [
      { type: "panel", name: "inner", valueName: "address", elements: [{ type: "text", name: "street" }] }
    ] });
    try {
      const survey = new SurveyModel({ elements: [{ type: "paneldynamic", name: "items", panelCount: 1, templateElements: [{ type: "nestingcomp2", name: "c1" }] }] });
      const c1: any = pdOf(survey).panels[0].getQuestionByName("c1");
      c1.contentPanel.getQuestionByName("street").value = "x";
      expect(survey.data).toEqual({ items: [{ c1: { street: "x" } }] });
    } finally {
      ComponentCollection.Instance.clear();
    }
  });
  test("a nesting panel inside a nesting panel at the survey level holds a dynamic panel whose records nest too", () => {
    const survey = new SurveyModel({ elements: [
      { type: "panel", name: "outer", valueName: "o", elements: [
        { type: "paneldynamic", name: "items", templateElements: [
          { type: "panel", name: "p1", valueName: "address", elements: [{ type: "text", name: "street" }] }
        ] }
      ] }
    ] });
    const pd = pdOf(survey);
    pd.addPanel();
    inPanel(pd.panels[0], "street").value = "s";
    expect(survey.data).toEqual({ o: { items: [{ address: { street: "s" } }] } });
  });
});

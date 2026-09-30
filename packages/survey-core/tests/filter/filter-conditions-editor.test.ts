import { describe, test, expect } from "vitest";
import { createFilter, createSurvey, createBound } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { FilterConditionsEditor } from "../../src/filter/filter-conditions-editor";
import { getFilterFieldDefaultOperator } from "../../src/filter/filter-conditions";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { settings } from "../../src/settings";

function createControl(over: any = {}): QuestionFilterModel {
  return <QuestionFilterModel>createSurvey(over).getQuestionByName("f1");
}
function operatorQ(editor: FilterConditionsEditor, index: number = 0): Question {
  return editor.survey.getQuestionByName("f" + index + "_operator");
}
function valueQ(editor: FilterConditionsEditor, index: number = 0): Question {
  return editor.survey.getQuestionByName("f" + index + "_value");
}

describe("FilterConditionsEditor: the editor survey", () => {
  test("one page, no navigation, no numbers, the control's locale; a panel per field titled by it", () => {
    const survey = createSurvey();
    survey.locale = "de";
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const editor = q.createFastModeEditor("country");
    const s = editor.survey;
    expect(s.pages.length, "#1").toBe(1);
    expect(s.showNavigationButtons, "#2").toBe(false);
    expect(s.showQuestionNumbers, "#3").toBe("off");
    expect(s.locale, "#4").toBe("de");
    const panel = <PanelModel>s.getPanelByName("f0");
    expect(!!panel, "#5").toBe(true);
    expect(panel.locTitle.textOrHtml, "#6").toBe("country");
    expect(panel.elements.map((e) => e.name), "#7").toEqual(["f0_operator", "f0_value"]);
    expect(operatorQ(editor).getType(), "#8").toBe("dropdown");
    expect(editor.isRawExpression, "#9").toBe(false);
    editor.dispose();
    survey.locale = "";
  });
  test("an unknown field name gives no editor", () => {
    const q = createControl();
    expect(q.createFastModeEditor("unknown") === undefined, "#1").toBe(true);
    expect(q.createFastModeEditor("") === undefined, "#2").toBe(true);
  });
  test("a field hidden from fast mode gives no fast mode editor", () => {
    const q = createFilter({ fields: [{ name: "name" }, { name: "country", showInFastMode: false }] });
    expect(q.createFastModeEditor("country") === undefined, "#1").toBe(true);
    const editor = q.createFastModeEditor("name");
    expect(!!editor, "#2: a shown field still gets one").toBe(true);
    editor.dispose();
  });
  test("the second field of a duplicate valueName gives no fast mode editor", () => {
    const q = createFilter({ fields: [{ name: "country" }, { name: "country2", valueName: "country" }] });
    expect(q.createFastModeEditor("country2") === undefined, "#1").toBe(true);
    const editor = q.createFastModeEditor("country");
    expect(!!editor, "#2: the first one does").toBe(true);
    editor.dispose();
  });
  test("operator titles are the English labels in the operators' order", () => {
    const q = createControl();
    const editor = q.createFastModeEditor("country");
    const choices = (<any>operatorQ(editor)).choices;
    expect(choices.map((c) => c.value), "#1").toEqual(q.getFieldOperators("country"));
    const titles: { [op: string]: string } = {};
    choices.forEach((c) => { titles[c.value] = c.text; });
    expect(titles["empty"], "#2").toBe("Empty");
    expect(titles["notempty"], "#3").toBe("Not empty");
    expect(titles["equal"], "#4").toBe("Equals");
    expect(titles["notequal"], "#5").toBe("Does not equal");
    expect(titles["anyof"], "#6").toBe("Any of");
    expect(titles["noneof"], "#7").toBe("None of");
    const ageEditor = q.createFastModeEditor("age");
    const ageTitles: { [op: string]: string } = {};
    (<any>operatorQ(ageEditor)).choices.forEach((c) => { ageTitles[c.value] = c.text; });
    expect(ageTitles["greater"], "#8").toBe("Greater than");
    expect(ageTitles["lessorequal"], "#9").toBe("Less than or equal to");
    editor.dispose();
    ageEditor.dispose();
  });
});

describe("FilterConditionsEditor: prefill", () => {
  test("from the active preset's conditions", () => {
    const q = createControl({ items: [{ name: "adults", expression: "{age} > 18 and {country} = 'de'" }] });
    const age = q.createFastModeEditor("age");
    expect(operatorQ(age).value, "#1").toBe("greater");
    expect(valueQ(age).value, "#2").toBe(18);
    const country = q.createFastModeEditor("country");
    expect(operatorQ(country).value, "#3").toBe("equal");
    expect(valueQ(country).value, "#4").toBe("de");
    expect(valueQ(country).getType(), "#5").toBe("dropdown");
    expect(q.ownConditions, "#6: opening an editor is not an edit").toBe(undefined);
    age.dispose();
    country.dispose();
  });
  test("a field with no condition starts with its default operator and no value", () => {
    const q = createControl();
    const editor = q.createFastModeEditor("country");
    expect(operatorQ(editor).value, "#1").toBe(getFilterFieldDefaultOperator(q.getFieldByName("country")));
    expect(valueQ(editor).isEmpty(), "#2").toBe(true);
    editor.dispose();
  });
  test("a preset that does not decompose opens empty and reports isRawExpression", () => {
    const q = createControl({ items: [{ name: "edges", expression: "{age} < 18 or {age} > 35" }], defaultItem: "edges" });
    const editor = q.createFastModeEditor("age");
    expect(editor.isRawExpression, "#1").toBe(true);
    expect(operatorQ(editor).value, "#2").toBe(getFilterFieldDefaultOperator(q.getFieldByName("age")));
    expect(valueQ(editor).isEmpty(), "#3").toBe(true);
    expect(q.filterExpression, "#4: nothing written").toBe("{age} < 18 or {age} > 35");
    editor.dispose();
  });
});

describe("FilterConditionsEditor: fast mode writes every change at once", () => {
  test("setting the value changes the control's filterExpression", () => {
    const q = createFilter();
    const editor = q.createFastModeEditor("age");
    operatorQ(editor).value = "greater";
    expect(q.filterExpression, "#1: no value yet - no condition").toBe("");
    valueQ(editor).value = 21;
    expect(q.filterExpression, "#2").toBe("{age} > 21");
    expect(q.getFieldCondition("age"), "#3").toEqual({ field: "age", operator: "greater", value: 21 });
    operatorQ(editor).value = "less";
    expect(valueQ(editor).value, "#4: same editor type - the value is kept").toBe(21);
    expect(q.filterExpression, "#5").toBe("{age} < 21");
    editor.dispose();
  });
  test("anyof on a dropdown field edits with a checkbox; changing the editor type drops the value", () => {
    const q = createFilter();
    const editor = q.createFastModeEditor("country");
    operatorQ(editor).value = "equal";
    valueQ(editor).value = "de";
    expect(q.filterExpression, "#1").toBe("{country} = 'de'");
    operatorQ(editor).value = "anyof";
    const value = valueQ(editor);
    expect(value.getType(), "#2").toBe("checkbox");
    expect((<any>value).visibleChoices.map((c) => c.value), "#3").toEqual(["de", "fr", "gb"]);
    expect(value.isEmpty(), "#4: dropdown -> checkbox does not keep the value").toBe(true);
    expect(q.getFieldCondition("country"), "#5: the condition is cleared with it").toBe(undefined);
    expect(q.filterExpression, "#6").toBe("");
    value.value = ["fr"];
    expect(q.filterExpression, "#7").toBe("{country} anyof ['fr']");
    editor.dispose();
  });
  test("empty hides the value question and sets the condition", () => {
    const q = createFilter();
    const editor = q.createFastModeEditor("country");
    operatorQ(editor).value = "empty";
    expect(valueQ(editor).isVisible, "#1").toBe(false);
    expect(q.getFieldCondition("country"), "#2").toEqual({ field: "country", operator: "empty", value: undefined });
    expect(q.filterExpression, "#3").toBe("{country} empty");
    operatorQ(editor).value = "notempty";
    expect(q.filterExpression, "#4").toBe("{country} notempty");
    operatorQ(editor).value = "equal";
    expect(valueQ(editor).isVisible, "#5").toBe(true);
    expect(q.getFieldCondition("country"), "#6: equal with no value is no condition").toBe(undefined);
    editor.dispose();
  });
  test("clearing the value removes the condition", () => {
    const q = createControl({ items: [{ name: "adults", expression: "{age} > 18 and {country} = 'de'" }] });
    const editor = q.createFastModeEditor("country");
    valueQ(editor).clearValue();
    expect(q.getFieldCondition("country"), "#1").toBe(undefined);
    expect(q.filterExpression, "#2: the preset's other condition stays").toBe("{age} > 18");
    editor.dispose();
  });
  test("a change that leaves no condition where there was none writes nothing", () => {
    const q = createControl();
    const editor = q.createFastModeEditor("country");
    operatorQ(editor).value = "notequal";
    expect(q.ownConditions, "#1").toBe(undefined);
    expect(q.filterExpression, "#2").toBe("{age} > 18");
    editor.dispose();
  });
  test("a bound control's field is edited the same way", () => {
    const survey = createBound();
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const editor = q.createFastModeEditor("country");
    operatorQ(editor).value = "equal";
    valueQ(editor).value = "fr";
    expect(q.filterExpression, "#1").toBe("{country} = 'fr'");
    expect((<any>survey.getQuestionByName("m")).visibleRows.length, "#2").toBe(1);
    editor.dispose();
  });
  test("multi-value values are written in the field's choice order, unknown values after them", () => {
    const q = createFilter();
    const editor = q.createFastModeEditor("country");
    operatorQ(editor).value = "anyof";
    valueQ(editor).value = ["gb", "de"];
    expect(q.getFieldCondition("country"), "#1").toEqual({ field: "country", operator: "anyof", value: ["de", "gb"] });
    valueQ(editor).value = ["xx", "gb", "yy", "de"];
    expect(q.getFieldCondition("country").value, "#2").toEqual(["de", "gb", "xx", "yy"]);
    editor.dispose();
  });
});

describe("FilterConditionsEditor: read-only", () => {
  test("design mode: the editor is display-only and writes nothing", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [{ type: "filter", name: "f1", fields: [{ name: "age", fieldType: "text", inputType: "number" }] }] });
    const q = <QuestionFilterModel>survey.getQuestionByName("f1");
    const editor = q.createFastModeEditor("age");
    expect(editor.survey.mode, "#1").toBe("display");
    operatorQ(editor).value = "greater";
    valueQ(editor).value = 21;
    expect(q.ownConditions, "#2").toBe(undefined);
    editor.dispose();
  });
  test("an ai preset: display-only, and nothing changes the filter", () => {
    const q = createControl({ items: [{ name: "smart", type: "ai", expression: "{age} > 18" }], defaultItem: "smart" });
    const editor = q.createFastModeEditor("age");
    expect(editor.survey.mode, "#1").toBe("display");
    operatorQ(editor).value = "less";
    valueQ(editor).value = 5;
    expect(q.ownConditions, "#2").toBe(undefined);
    expect(q.filterExpression, "#3").toBe("{age} > 18");
    editor.dispose();
  });
});

describe("FilterConditionsEditor: dispose", () => {
  test("dispose() disposes the editor survey and stops writing", () => {
    const q = createFilter();
    const editor = q.createFastModeEditor("age");
    const s = editor.survey;
    const operator = operatorQ(editor);
    const value = valueQ(editor);
    editor.dispose();
    expect(s.isDisposed, "#1").toBe(true);
    expect(editor.isDisposed, "#2").toBe(true);
    operator.value = "greater";
    value.value = 21;
    expect(q.ownConditions, "#3: a disposed editor writes nothing").toBe(undefined);
    expect(q.filterExpression, "#4").toBe("");
    editor.dispose();
  });
});
describe("FilterConditionsEditor: rendering the rebuilt value question", () => {
  test("an operator change swaps the value row at once, even with animations on", () => {
    settings.animationEnabled = true;
    try {
      const q = createControl();
      const editor = q.createFastModeEditor("age");
      const panel = <PanelModel>editor.survey.getPanelByName("f0");
      panel.enableOnElementRerenderedEvent();
      expect(panel.animationAllowed, "#1: animations do run in the editor").toBe(true);
      operatorQ(editor).value = "less";
      const elements = panel.visibleRows.map(row => row.elements.map(el => el.name).join(","));
      expect(elements, "#2: the old value row is gone, the new one is in").toEqual(["f0_operator", "f0_value"]);
      expect(panel.visibleRows[1].elements[0], "#3: and it is the live question").toBe(valueQ(editor));
      editor.dispose();
    } finally {
      settings.animationEnabled = false;
    }
  });
});
describe("FilterConditionsEditor: the editor survey inside another survey", () => {
  test("renders compact: no frames of its own", () => {
    const editor = createControl().createFastModeEditor("age");
    expect(editor.survey.isCompact, "#1").toBe(true);
    editor.dispose();
  });
  test("its popups measure the space of the survey the control is in", () => {
    const q = createControl();
    const root = document.createElement("div");
    (<any>q.survey).rootElement = root;
    const editor = q.createFastModeEditor("country");
    const popup = (<any>valueQ(editor)).dropdownListModel.popupModel;
    popup.isVisible = true;
    expect(popup.getAreaCallback, "#1").toBeTruthy();
    expect(popup.getAreaCallback(document.createElement("div")), "#2").toBe(root);
    editor.dispose();
  });
  test("a popup's own area callback is kept", () => {
    const q = createControl();
    (<any>q.survey).rootElement = document.createElement("div");
    const editor = q.createFastModeEditor("country");
    const own = document.createElement("div");
    const popup = (<any>valueQ(editor)).dropdownListModel.popupModel;
    popup.getAreaCallback = () => own;
    popup.isVisible = true;
    expect(popup.getAreaCallback(document.createElement("div")), "#1").toBe(own);
    editor.dispose();
  });
  test("with no rendered survey the area is left to the popup", () => {
    const q = createControl();
    const editor = q.createFastModeEditor("country");
    const popup = (<any>valueQ(editor)).dropdownListModel.popupModel;
    popup.isVisible = true;
    expect(popup.getAreaCallback(document.createElement("div")), "#1").toBe(undefined);
    editor.dispose();
  });
});

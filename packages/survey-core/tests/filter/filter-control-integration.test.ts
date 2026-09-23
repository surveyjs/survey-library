import { describe, test, expect } from "vitest";
import { createBound } from "./filter-test-helpers";
import { SurveyModel } from "../../src/survey";
import { QuestionFilterModel } from "../../src/question_filter";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";

describe("Filter control: bound mode", () => {
  test("the control writes its expression into the matrix as a filter part", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }], filterExpression: "{country} notempty" },
      { type: "filter", name: "f1", source: "m", items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    matrix.value = [{ country: "de" }, { country: "fr" }, { country: "" }];
    control.toggleItem("de");
    expect(matrix.visibleRows.length, "#1").toBe(1);
    expect(matrix.filterExpression, "#2: the authored part is untouched").toBe("{country} notempty");
  });
  test("the control takes its fields from the source columns", () => {
    const survey = createBound();
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(control.getFilterFields().map((f: any) => f.name)).toEqual(["country", "price"]);
  });
  test("onFilterChanged carries the expression and the source, after the rows were recomputed", () => {
    const survey = createBound();
    const raised: Array<any> = [];
    survey.onFilterChanged.add((_, options) => {
      raised.push({ expression: options.filterExpression, source: options.sourceQuestion.name,
        rows: (<QuestionMatrixDynamicModel>options.sourceQuestion).visibleRows.length });
    });
    (<QuestionFilterModel>survey.getQuestionByName("f1")).toggleItem("de");
    expect(raised.length, "#1").toBe(1);
    expect(raised[0].expression, "#2").toBe("{country} = 'de'");
    expect(raised[0].rows, "#3: the source was updated before the event").toBe(1);
    expect(raised[0].source, "#4").toBe("m");
  });
  test("a standalone control raises onFilterChanged with no source question", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1",
      fields: [{ name: "age" }], items: [{ name: "adults", expression: "{age} > 18" }] }] });
    const raised: Array<any> = [];
    survey.onFilterChanged.add((_, options) => {
      raised.push({ expression: options.filterExpression, source: options.sourceQuestion,
        question: options.question.name });
    });
    (<QuestionFilterModel>survey.getQuestionByName("f1")).toggleItem("adults");
    expect(raised.length, "#1").toBe(1);
    expect(raised[0].expression, "#2").toBe("{age} > 18");
    expect(raised[0].source, "#3: nothing is bound").toBe(undefined);
    expect(raised[0].question, "#4").toBe("f1");
  });
  test("a source that is not a matrix or a panel does nothing", () => {
    const survey = new SurveyModel({ elements: [{ type: "text", name: "t" },
      { type: "filter", name: "f1", source: "t", items: [{ name: "a", expression: "{x} = 1" }] }] });
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.toggleItem("a");
    expect(control.getFilterFields(), "#1").toEqual([]);
    expect(control.filterExpression, "#2: it still composes its own").toBe("{x} = 1");
  });
  test("two controls filter the same matrix without overwriting each other", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }, { name: "price" }] },
      { type: "filter", name: "f1", source: "m", items: [{ name: "de", expression: "{country} = 'de'" }] },
      { type: "filter", name: "f2", source: "m", items: [{ name: "cheap", expression: "{price} < 100" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de", price: 50 }, { country: "de", price: 500 }, { country: "fr", price: 50 }];
    const f1 = <QuestionFilterModel>survey.getQuestionByName("f1");
    const f2 = <QuestionFilterModel>survey.getQuestionByName("f2");
    f1.toggleItem("de");
    expect(matrix.visibleRows.length, "#1").toBe(2);
    f2.toggleItem("cheap");
    expect(matrix.visibleRows.length, "#2: both parts apply").toBe(1);
    f1.toggleItem("de");
    expect(matrix.visibleRows.length, "#3: clearing one leaves the other").toBe(2);
  });
  test("a disposed control clears its part", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.toggleItem("de");
    const key = (<any>control).controlFilterKey;
    expect(matrix.getControlFilter(key), "#1").toBe("{country} = 'de'");
    control.dispose();
    expect(matrix.getControlFilter(key), "#2").toBe("");
    expect(matrix.visibleRows.length, "#3: and the rows came back").toBe(3);
  });
  test("re-pointing source detaches the old question and attaches the new one", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", columns: [{ name: "country" }] },
      { type: "matrixdynamic", name: "m2", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", source: "m1", items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const m1 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m1");
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    m1.value = [{ country: "de" }, { country: "fr" }];
    m2.value = [{ country: "de" }, { country: "fr" }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    const key = (<any>control).controlFilterKey;
    control.toggleItem("de");
    expect(m1.visibleRows.length, "#1").toBe(1);
    control.source = "m2";
    expect(m1.getControlFilter(key), "#2: the old question keeps no ghost filter").toBe("");
    expect(m1.visibleRows.length, "#3").toBe(2);
    expect(m2.visibleRows.length, "#4: and the new one is filtered").toBe(1);
  });
  test("re-pointing source recomposes the expression before it is written anywhere", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m1", columns: [{ name: "country" }] },
      { type: "matrixdynamic", name: "m2", columns: [{ name: "city" }] },
      { type: "filter", name: "f1", source: "m1", showSearch: true,
        items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const m2 = <QuestionMatrixDynamicModel>survey.getQuestionByName("m2");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.toggleItem("de");
    control.searchString = "xx";
    const raised: Array<any> = [];
    survey.onFilterChanged.add((_, options) => {
      raised.push({ expression: options.filterExpression,
        source: !!options.sourceQuestion ? options.sourceQuestion.name : "" });
    });
    control.source = "m2";
    const expected = "({country} = 'de') and ({city} contains 'xx')";
    expect(raised.length, "#1: one move, one event").toBe(1);
    expect(raised[0].expression, "#2: the search quotes the fields of the source it moved to")
      .toBe(expected);
    expect(raised[0].source, "#3").toBe("m2");
    expect(m2.getControlFilter((<any>control).controlFilterKey), "#4: and that is what was written")
      .toBe(expected);
  });
  test("an applicable defaultItem raises the event while the survey loads", () => {
    const survey = new SurveyModel();
    const raised: Array<any> = [];
    survey.onFilterChanged.add((_, options) => {
      raised.push({ expression: options.filterExpression,
        source: !!options.sourceQuestion ? options.sourceQuestion.name : "" });
    });
    survey.fromJSON({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", source: "m", defaultItem: "de",
        items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    expect(raised.length, "#1: the effective filter is X from the first query on").toBe(1);
    expect(raised[0].expression, "#2").toBe("{country} = 'de'");
    expect(raised[0].source, "#3").toBe("m");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(matrix.getControlFilter((<any>control).controlFilterKey), "#4: and the matrix carries it")
      .toBe("{country} = 'de'");
  });
  test("a field is found by its own name before another field's value path", () => {
    const survey = new SurveyModel({ elements: [{ type: "filter", name: "f1", items: [],
      fields: [{ name: "x", valueName: "y" }, { name: "y" }] }] });
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(control.getFieldByName("y").name, "#1: the name wins over another field's valueName")
      .toBe("y");
    expect(control.getFieldByName("x").valueName, "#2: and the other one is still reachable")
      .toBe("y");
  });
  test("a control on a later page filters a matrix on the first one", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "country" }] }] },
      { name: "p2", elements: [{ type: "filter", name: "f1", source: "m",
        items: [{ name: "de", expression: "{country} = 'de'" }], defaultItem: "de" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de" }, { country: "fr" }];
    expect(matrix.visibleRows.length, "#1: resolved by name across pages, not by the visible page").toBe(1);
  });
  test("a control on the first page filters a matrix on a later one", () => {
    const survey = new SurveyModel({ pages: [
      { name: "p1", elements: [{ type: "filter", name: "f1", source: "m",
        items: [{ name: "de", expression: "{country} = 'de'" }], defaultItem: "de" }] },
      { name: "p2", elements: [{ type: "matrixdynamic", name: "m", columns: [{ name: "country" }] }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    matrix.value = [{ country: "de" }, { country: "fr" }];
    expect(matrix.visibleRows.length, "#1: the control loads before the matrix and is not lost").toBe(1);
  });
  test("renaming the control does not leave a ghost filter", () => {
    const survey = createBound();
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.toggleItem("de");
    const before = matrix.visibleRows.length;
    control.name = "renamed";
    expect(matrix.getControlFilterKeys(), "#1: the key is the id, so the rename changes nothing")
      .toEqual([(<any>control).controlFilterKey]);
    expect(matrix.visibleRows.length, "#2").toBe(before);
  });
  test("a control bound to a dynamic panel filters its panels", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 3,
        templateElements: [{ type: "text", name: "country" }] },
      { type: "filter", name: "f1", source: "p", items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.value = [{ country: "de" }, { country: "fr" }, { country: "de" }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(control.getFilterFields().map((f: any) => f.valueName), "#1").toEqual(["country"]);
    control.toggleItem("de");
    expect(panel.visiblePanels.length, "#2").toBe(2);
    expect(panel.getControlFilter((<any>control).controlFilterKey), "#3")
      .toBe("{country} = 'de'");
  });
  test("design mode never reaches the source", () => {
    const survey = new SurveyModel();
    survey.setDesignMode(true);
    survey.fromJSON({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", source: "m", defaultItem: "de",
        items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    expect(matrix.getControlFilterKeys(), "#1").toEqual([]);
    control.toggleItem("de");
    expect(matrix.getControlFilterKeys(), "#2: a click in the designer filters nothing").toEqual([]);
    expect(control.filterExpression, "#3").toBe("");
  });
  test("a control whose source names nothing keeps composing its own expression", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "m", columns: [{ name: "country" }] },
      { type: "filter", name: "f1", source: "nosuchquestion",
        items: [{ name: "de", expression: "{country} = 'de'" }] }] });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.toggleItem("de");
    expect(control.filterExpression, "#1").toBe("{country} = 'de'");
    expect(matrix.getControlFilterKeys(), "#2: nothing was written anywhere").toEqual([]);
  });
  test("the whole scenario: a bound control, its search, its events and its saved state", () => {
    const survey = new SurveyModel({ elements: [
      { type: "matrixdynamic", name: "orders", filterExpression: "{price} notempty", columns: [
        { name: "country", cellType: "dropdown",
          choices: [{ value: "de", text: "Germany" }, { value: "fr", text: "France" }] },
        { name: "price", cellType: "text", inputType: "number" }] },
      { type: "filter", name: "f", source: "orders", showSearch: true,
        items: [{ name: "cheap", expression: "{price} < 100" }] }] });
    const raised: Array<string> = [];
    survey.onFilterChanged.add((_, options) => { raised.push(options.filterExpression); });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("orders");
    matrix.value = [{ country: "de", price: 50 }, { country: "fr", price: 500 }, { country: "de", price: null }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f");
    expect(control.getFilterFields().map((f: any) => f.name), "#1: the source columns").toEqual(["country", "price"]);
    expect(matrix.visibleRows.length, "#2: the authored filter alone").toBe(2);
    control.toggleItem("cheap");
    expect(matrix.visibleRows.length, "#3: and the control on top of it").toBe(1);
    control.searchString = "Germ";
    expect(control.filterExpression, "#4: the item and the search over every field")
      .toBe("({price} < 100) and ({country} anyof ['de'] or {price} contains 'Germ')");
    expect(matrix.filterExpression, "#5: the authored expression is untouched").toBe("{price} notempty");
    expect(survey.uiState.questions["f"], "#6: what the respondent did is saved state")
      .toEqual({ filter: { activeItem: "cheap", searchString: "Germ" } });
    expect(raised, "#7: nothing was raised while the survey loaded")
      .toEqual(["{price} < 100", "({price} < 100) and ({country} anyof ['de'] or {price} contains 'Germ')"]);
  });
  test("searchFields name a bound nested field by its dotted value path", () => {
    const survey = new SurveyModel({ elements: [
      { type: "paneldynamic", name: "p", panelCount: 2, templateElements: [
        { type: "multipletext", name: "mt", items: [{ name: "city" }] }] },
      { type: "filter", name: "f1", source: "p", showSearch: true, searchFields: ["mt.city"],
        items: [] }] });
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("p");
    panel.value = [{ mt: { city: "Berlin" } }, { mt: { city: "Paris" } }];
    const control = <QuestionFilterModel>survey.getQuestionByName("f1");
    control.searchString = "Ber";
    expect(control.filterExpression, "#1").toBe("{mt.city} contains 'Ber'");
    expect(panel.visiblePanels.length, "#2").toBe(1);
  });
});

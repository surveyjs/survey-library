import { describe, test, expect } from "vitest";
import { SurveyModel } from "../../src/survey";
import { Question } from "../../src/question";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { IValueGetterInfo } from "../../src/conditions/conditionProcessValue";

export * from "../../src/question_text";

/* matrixdynamic and paneldynamic behave the same (step 22,
   promts/dynamic-data-list/22-same-behaviour-matrix-panel.md). Every scenario runs for both questions
   with the same records; only the names of the authored properties differ. */
interface IDynamicKind {
  name: string;
  // The authored names of the same thing on the two questions.
  pageSize: string;
  itemCount: string;
  visibleIf: string;
  variable: string;
  // The property that lists the columns / template questions, and one text item of it.
  items: string;
  textItem(name: string, props?: any): any;
  json(extra: any): any;
}
const matrixKind: IDynamicKind = {
  name: "matrixdynamic",
  pageSize: "rowsPerPage",
  itemCount: "rowCount",
  visibleIf: "rowsVisibleIf",
  variable: "row",
  items: "columns",
  textItem: (name: string, props?: any): any => Object.assign({ name: name, cellType: "text" }, props),
  json: (extra: any): any => Object.assign({
    type: "matrixdynamic", name: "q",
    columns: [{ name: "x", cellType: "text" }, { name: "y", cellType: "text" }]
  }, extra)
};
const panelKind: IDynamicKind = {
  name: "paneldynamic",
  pageSize: "panelsPerPage",
  itemCount: "panelCount",
  visibleIf: "templateVisibleIf",
  variable: "panel",
  items: "templateElements",
  textItem: (name: string, props?: any): any => Object.assign({ type: "text", name: name }, props),
  json: (extra: any): any => Object.assign({
    type: "paneldynamic", name: "q",
    templateElements: [{ type: "text", name: "x" }, { type: "text", name: "y" }]
  }, extra)
};
const kinds = [matrixKind, panelKind];

type DynamicQuestion = QuestionMatrixDynamicModel | QuestionPanelDynamicModel;
function createSurvey(kind: IDynamicKind, records: Array<any>, extra: any = {}, elements: Array<any> = []): SurveyModel {
  const props = Object.assign({}, extra);
  props[kind.itemCount] = records.length;
  const survey = new SurveyModel({ elements: [kind.json(props)].concat(elements) });
  survey.data = { q: records };
  return survey;
}
function getQuestion(survey: SurveyModel): DynamicQuestion {
  return <DynamicQuestion>survey.getQuestionByName("q");
}
// What {q[index].name} asks the question's context for.
function readItem(question: Question, index: number, name: string): IValueGetterInfo {
  return question.getValueGetterContext().getValue({ path: [{ name: name }], index: index, isRoot: false });
}
// A row or a panel answers through its question's context; a record read as a value has no question.
function isAnsweredByQuestion(res: IValueGetterInfo): boolean {
  const context: any = !!res ? res.context : undefined;
  if (!context || typeof context.getQuestion !== "function") return false;
  const q = context.getQuestion();
  return !!q && q.isQuestion === true;
}
function records(...values: Array<string>): Array<any> {
  return values.map((x: string): any => ({ x: x, y: x.toUpperCase() }));
}

describe("F1: {q[i]} names a record for both questions", () => {
  kinds.forEach((kind: IDynamicKind) => {
    describe(kind.name, () => {
      test("F1.1 no view: the index is the record", () => {
        const survey = createSurvey(kind, records("a", "b", "c"));
        const question = getQuestion(survey);
        for (let i = 0; i < 3; i++) {
          const res = readItem(question, i, "x");
          expect(res.isFound, "#found " + i).toBe(true);
          expect(res.value, "#value " + i).toBe(["a", "b", "c"][i]);
          expect(isAnsweredByQuestion(res), "#by the row/panel " + i).toBe(true);
        }
        expect(survey.runExpression("{q[1].x}"), "#expression").toBe("b");
      });
      test("F1.2 a filter hides record 0: the index still counts records", () => {
        const survey = createSurvey(kind, records("a", "b", "c"), { filterExpression: "{x} != 'a'" });
        const question = getQuestion(survey);
        const res0 = readItem(question, 0, "x");
        expect(res0.isFound, "#1").toBe(true);
        expect(res0.value, "#2: record 0, not the first row/panel shown").toBe("a");
        expect(isAnsweredByQuestion(res0), "#3: it has no row/panel, it is read as a value").toBe(false);
        const res1 = readItem(question, 1, "x");
        expect(res1.value, "#4").toBe("b");
        expect(isAnsweredByQuestion(res1), "#5: record 1 has a row/panel and it answers").toBe(true);
        expect(survey.runExpression("{q[2].y}"), "#6").toBe("C");
      });
      /* A cell expression that runs while the matrix builds its rows (allRows answers [] then) reads a
         record that has no row, filtered out here, as a value, as the panel does. Before step 22 the
         matrix answered "not found" while building and the first row shown afterwards: 'b'. */
      test("F1.2a under a filter, an item being built reads a record that has no row/panel", () => {
        const extra: any = { filterExpression: "{x} != 'a'" };
        extra[kind.items] = [kind.textItem("x"), kind.textItem("d", { defaultValueExpression: "{q[0].x}" })];
        const survey = createSurvey(kind, records("a", "b", "c"), extra);
        const question = getQuestion(survey);
        // The matrix builds its rows on demand, the panel its panels at once.
        if (question instanceof QuestionMatrixDynamicModel) expect(question.visibleRows.length, "#0").toBe(2);
        const value = <Array<any>>survey.getValue("q");
        expect(value.map((record: any): any => record.d), "#1: record 0's x for every item built").toEqual([undefined, "a", "a"]);
      });
      test("F1.3 a descending sort: the index still counts records", () => {
        const survey = createSurvey(kind, records("a", "b", "c"), { sortBy: "x-" });
        const question = getQuestion(survey);
        expect(readItem(question, 0, "x").value, "#1: record 0, not the first one shown").toBe("a");
        expect(readItem(question, 2, "x").value, "#2").toBe("c");
        expect(isAnsweredByQuestion(readItem(question, 0, "x")), "#3: every record has a row/panel").toBe(true);
        expect(survey.runExpression("{q[0].x}"), "#4").toBe("a");
      });
      test("F1.4 paging: a record off the page is read as a value", () => {
        const extra: any = {};
        extra[kind.pageSize] = 2;
        const survey = createSurvey(kind, records("a", "b", "c", "d"), extra);
        const question = getQuestion(survey);
        const res3 = readItem(question, 3, "x");
        expect(res3.isFound, "#1").toBe(true);
        expect(res3.value, "#2").toBe("d");
        expect(isAnsweredByQuestion(res3), "#3: off the page").toBe(false);
        const res1 = readItem(question, 1, "x");
        expect(res1.value, "#4").toBe("b");
        expect(isAnsweredByQuestion(res1), "#5: on the page").toBe(true);
        expect(survey.runExpression("{q[3].y}"), "#6").toBe("D");
      });
      test("F1.5 an index past the last record is not found", () => {
        const survey = createSurvey(kind, records("a", "b", "c"));
        expect(readItem(getQuestion(survey), 3, "x").isFound, "#1: no view").toBe(false);
        const extra: any = { filterExpression: "{x} != 'a'" };
        extra[kind.pageSize] = 2;
        const paged = createSurvey(kind, records("a", "b", "c"), extra);
        expect(readItem(getQuestion(paged), 3, "x").isFound, "#2: filter and paging").toBe(false);
        expect(readItem(getQuestion(paged), 2, "x").isFound, "#3: the last record").toBe(true);
      });
      test("F1.7 an expression elsewhere in the survey follows the record under a filter", () => {
        const data = [{ x: "a", f: "hide" }, { x: "b", f: "" }, { x: "c", f: "" }];
        const survey = createSurvey(kind, data, { filterExpression: "{f} != 'hide'" },
          [{ type: "text", name: "t", visibleIf: "{q[0].x} = 'a'" }]);
        const t = survey.getQuestionByName("t");
        expect(survey.runExpression("{q[0].x}"), "#1").toBe("a");
        expect(t.isVisible, "#2: record 0 is read, not the first one shown").toBe(true);
        survey.setValue("q", [{ x: "z", f: "hide" }, { x: "a", f: "" }, { x: "c", f: "" }]);
        expect(survey.runExpression("{q[0].x}"), "#3").toBe("z");
        expect(t.isVisible, "#4: the value change re-evaluates it").toBe(false);
        survey.setValue("q", [{ x: "a", f: "hide" }, { x: "b", f: "" }, { x: "c", f: "" }]);
        expect(t.isVisible, "#5").toBe(true);
      });
    });
  });
  test("F1.6 matrix only: a padded record off the page is the default row value", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "matrixdynamic", name: "q", rowCount: 3, rowsPerPage: 2, defaultRowValue: { x: "d" },
        columns: [{ name: "x", cellType: "text" }]
      }]
    });
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("q");
    matrix.value = [{ x: "a" }];
    expect(matrix.rowCount, "#1").toBe(3);
    const res = readItem(matrix, 2, "x");
    expect(res.isFound, "#2").toBe(true);
    expect(res.value, "#3: the padded record").toBe("d");
    expect(isAnsweredByQuestion(res), "#4: off the page, read as a value").toBe(false);
    expect(readItem(matrix, 3, "x").isFound, "#5: past rowCount").toBe(false);
  });
  test("F1.8 a panel reaches a filtered matrix that shares its valueName through the bound-question path", () => {
    const survey = new SurveyModel({
      elements: [
        {
          type: "matrixdynamic", name: "matrix", valueName: "data", rowCount: 3, filterExpression: "{x} != 'a'",
          columns: [{ name: "x", cellType: "text" }, { name: "y", cellType: "text" }]
        },
        {
          type: "paneldynamic", name: "panel", valueName: "data", panelCount: 3,
          templateElements: [
            { type: "text", name: "x" },
            { type: "text", name: "t", visibleIf: "{panel.y} = 'B'" }
          ]
        }
      ]
    });
    survey.data = { data: records("a", "b", "c") };
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("panel");
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("matrix");
    expect(matrix.visibleRows.length, "#1: the filter hides record 0's row").toBe(2);
    const visibility = panel.panels.map(p => p.getQuestionByName("t").isVisible);
    expect(visibility, "#2: panel 1 reads record 1's y through the matrix, not record 2's").toEqual([false, true, false]);
  });
});

describe("F2: the record visibility under paging goes through onExpressionRunning", () => {
  kinds.forEach((kind: IDynamicKind) => {
    describe(kind.name, () => {
      function createPaged(expression: string, onRunning?: (options: any) => void, showInvisible?: boolean): SurveyModel {
        const extra: any = {};
        extra[kind.pageSize] = 2;
        extra[kind.visibleIf] = expression;
        const props = Object.assign({}, extra);
        props[kind.itemCount] = 4;
        const survey = new SurveyModel({ elements: [kind.json(props)] });
        if (showInvisible) survey.showInvisibleElements = true;
        if (onRunning) {
          survey.onExpressionRunning.add((_: SurveyModel, options: any) => {
            if ((<any>options.element).name === "q" && options.propertyName === kind.visibleIf) {
              onRunning(options);
            }
          });
        }
        survey.data = { q: records("a", "b", "c", "d") };
        return survey;
      }
      function pageXs(question: DynamicQuestion): Array<any> {
        if (question instanceof QuestionMatrixDynamicModel) {
          return question.rowsOnPage.map(r => r.getQuestionByName("x").value);
        }
        return question.panelsOnPage.map(p => p.getQuestionByName("x").value);
      }
      const v = kind.variable;
      test("F2.1 a handler that rewrites the expression hides the record, and the page follows", () => {
        const survey = createPaged("{" + v + ".x} != 'zzz'", (options: any) => {
          options.expression = "{" + v + ".x} != 'a'";
        });
        const question = getQuestion(survey);
        expect(question.getDataList().visibleCount, "#1: record 0 is hidden").toBe(3);
        expect(question.pageCount, "#2").toBe(2);
        expect(pageXs(question), "#3").toEqual(["b", "c"]);
      });
      test("F2.2 allow = false: every record is visible", () => {
        const survey = createPaged("{" + v + ".x} != 'a'", (options: any) => {
          options.allow = false;
        });
        const question = getQuestion(survey);
        expect(question.getDataList().visibleCount, "#1").toBe(4);
        expect(question.pageCount, "#2").toBe(2);
        expect(pageXs(question), "#3").toEqual(["a", "b"]);
      });
      test("F2.3 the handler is called, and a value change the expression reads calls it again", () => {
        let counter = 0;
        const survey = createPaged("{" + v + ".x} != {hidden}", () => { counter++; });
        expect(counter, "#1").toBeGreaterThan(0);
        const before = counter;
        survey.setValue("hidden", "b");
        expect(counter, "#2").toBeGreaterThan(before);
        expect(getQuestion(survey).getDataList().visibleCount, "#3").toBe(3);
      });
      test("F2.4 no handler: the expression runs as authored", () => {
        const survey = createPaged("{" + v + ".x} != 'a'");
        const question = getQuestion(survey);
        expect(question.getDataList().visibleCount, "#1").toBe(3);
        expect(question.pageCount, "#2").toBe(2);
        expect(pageXs(question), "#3").toEqual(["b", "c"]);
      });
      test("F2.5 the handler is called while invisible elements are shown", () => {
        let counter = 0;
        const survey = createPaged("{" + v + ".x} != 'a'", () => { counter++; }, true);
        expect(counter, "#1").toBeGreaterThan(0);
        expect(getQuestion(survey).getDataList().visibleCount, "#2: every record is shown").toBe(4);
      });
    });
  });
});

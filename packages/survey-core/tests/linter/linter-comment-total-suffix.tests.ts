import { describe, test, expect } from "vitest";
import { lintSurvey } from "../../src/linter/index";
import { ILintFinding } from "../../src/linter/types";
import { SurveyModel } from "../../src/survey";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { withSettings } from "./lint-test-helpers";

// The runtime resolves {q1-Comment}: setComment stores the value under
// name + settings.commentSuffix in the values hash, and getFilteredValues exposes
// every hash key to expressions. Matrix totals live under
// getValueName() + settings.matrix.totalsSuffix - both suffixes are configurable.
const unknownRefs = (findings: Array<ILintFinding>) =>
  findings.filter(f => f.ruleId === "reference/unknown");

describe("comment and total suffix references", () => {
  test("{q1-Comment} resolves for an existing question", () => {
    const res = lintSurvey({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a", "b"], showCommentArea: true },
        { type: "text", name: "q2", visibleIf: "{q1-Comment} notempty" },
      ],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("comment ref is a plain string: no type/choice findings against the base question", () => {
    const res = lintSurvey({
      elements: [
        { type: "checkbox", name: "q1", choices: ["a", "b"] },
        { type: "text", name: "q2", visibleIf: "{q1-Comment} = 'hello'" },
      ],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("{v1-Comment} resolves through valueName", () => {
    const res = lintSurvey({
      elements: [
        { type: "text", name: "q1", valueName: "v1" },
        { type: "text", name: "q2", visibleIf: "{v1-Comment} notempty" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("comment ref for a missing question is still reported", () => {
    const res = lintSurvey({
      elements: [{ type: "text", name: "q1", visibleIf: "{nope-Comment} notempty" }],
    });
    expect(unknownRefs(res.findings)).toHaveLength(1);
  });
  test("custom commentSuffix from settings", () => {
    const json = {
      elements: [
        { type: "text", name: "q1" },
        { type: "text", name: "q2", visibleIf: "{q1-Note} notempty" },
        { type: "text", name: "q3", visibleIf: "{q1-Comment} notempty" },
      ],
    };
    const byDefault = lintSurvey(json);
    expect(unknownRefs(byDefault.findings)).toHaveLength(1); // only {q1-Note}
    withSettings({ commentSuffix: "-Note" }, () => {
      const unknown = unknownRefs(lintSurvey(json).findings);
      expect(unknown).toHaveLength(1); // only {q1-Comment}
      expect(unknown[0].messageData.name).toBe("q1-Comment");
    });
  });
  test("default -total suffix keeps working", () => {
    const res = lintSurvey({
      elements: [
        { type: "matrixdynamic", name: "m", columns: [{ name: "col1" }] },
        { type: "text", name: "q2", visibleIf: "{m-total.col1} > 0" },
      ],
    });
    expect(unknownRefs(res.findings)).toHaveLength(0);
  });
  test("custom matrix totalsSuffix from settings", () => {
    const json = {
      elements: [
        { type: "matrixdynamic", name: "m", columns: [{ name: "col1" }] },
        { type: "text", name: "q2", visibleIf: "{m_sum.col1} > 0" },
        { type: "text", name: "q3", visibleIf: "{m-total.col1} > 0" },
      ],
    };
    const byDefault = lintSurvey(json);
    expect(unknownRefs(byDefault.findings)).toHaveLength(1); // only {m_sum.col1}
    withSettings({ "matrix.totalsSuffix": "_sum" }, () => {
      const unknown = unknownRefs(lintSurvey(json).findings);
      expect(unknown).toHaveLength(1); // only {m-total.col1}
      expect(unknown[0].messageData.name).toBe("m-total.col1");
    });
  });
  test("column sub-path is still validated after a custom totals suffix", () => {
    withSettings({ "matrix.totalsSuffix": "_sum" }, () => {
      const res = lintSurvey({
        elements: [
          { type: "matrixdynamic", name: "m", columns: [{ name: "col1" }] },
          { type: "text", name: "q2", visibleIf: "{m_sum.col2} > 0" },
        ],
      });
      const unknown = unknownRefs(res.findings);
      expect(unknown).toHaveLength(1);
      expect(unknown[0].suggestion).toBe("col1");
    });
  });
  test("{row.col-Comment} resolves inside a matrix row", () => {
    // the row value carries "col1" and "col1-Comment" side by side
    // (question_matrixdropdownbase.ts), so the condition is live
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [
          { name: "col1", cellType: "text", showCommentArea: true },
          { name: "col2", cellType: "text", visibleIf: "{row.col1-Comment} notempty" },
        ],
      }],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("{panel.q-Comment} resolves inside a dynamic panel", () => {
    const res = lintSurvey({
      elements: [{
        type: "paneldynamic", name: "p1",
        templateElements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q2", visibleIf: "{panel.q1-Comment} notempty" },
        ],
      }],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("{panel.q-Comment} resolves inside a static panel", () => {
    const res = lintSurvey({
      elements: [{
        type: "panel", name: "pnl",
        elements: [
          { type: "text", name: "q1", showCommentArea: true },
          { type: "text", name: "q2", visibleIf: "{panel.q1-Comment} notempty" },
        ],
      }],
    });
    expect(res.findings).toHaveLength(0);
  });
  test("a comment suffix on an unknown inner name is still flagged", () => {
    const res = lintSurvey({
      elements: [{
        type: "matrixdynamic", name: "m1",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text", visibleIf: "{row.nosuch-Comment} notempty" },
        ],
      }],
    });
    expect(unknownRefs(res.findings)).toHaveLength(1);
  });
  test("the total row is keyed off valueName when the matrix declares one", () => {
    // the runtime writes the total row under getValueName() + totalsSuffix
    const totalSurvey = (ref: string) => ({
      elements: [
        {
          type: "matrixdynamic", name: "m1", valueName: "mv",
          columns: [{ name: "col1", cellType: "text", inputType: "number", totalType: "sum" }],
        },
        { type: "text", name: "q2", visibleIf: ref },
      ],
    });
    expect(lintSurvey(totalSurvey("{mv-total.col1} > 0")).findings).toHaveLength(0);
    expect(unknownRefs(lintSurvey(totalSurvey("{mv-total.nosuchcol} > 0")).findings)).toHaveLength(1);
  });

  // MatrixDropdownTotalRowModel builds a total cell per column of the matrix; a detail panel has none
  test("the total row holds the matrix's own columns, never a detail-panel question", () => {
    const totals = (ref: string, where: "column" | "survey") => ({
      elements: [
        {
          type: "matrixdynamic", name: "m", detailPanelMode: "underRow",
          columns: [{ name: "c1", cellType: "text", inputType: "number", totalType: "sum" },
            { name: "c2", cellType: "text", visibleIf: where === "column" ? ref : undefined }],
          detailElements: [{ type: "text", name: "d1" }],
        },
        { type: "text", name: "q2", visibleIf: where === "survey" ? ref : undefined },
      ],
    });
    expect(unknownRefs(lintSurvey(totals("{totalRow.c1} > 0", "column")).findings)).toHaveLength(0);
    expect(unknownRefs(lintSurvey(totals("{totalRow.d1} > 0", "column")).findings).map(f => f.reason + " @" + f.path))
      .toEqual(["scopedUnknown @elements[0].columns[1].visibleIf"]);
    expect(unknownRefs(lintSurvey(totals("{m-total.c1} > 0", "survey")).findings)).toHaveLength(0);
    expect(unknownRefs(lintSurvey(totals("{m-total.d1} > 0", "survey")).findings).map(f => f.reason + " @" + f.path))
      .toEqual(["inContainer @elements[1].visibleIf"]);
  });
});

// A matrix inside a dynamic panel or a matrix row writes its total row into that panel's/row's
// object under getValueName() + settings.matrix.totalsSuffix (onTotalValueChanged), and the
// record accepts the key (isRecordKeyOfType) - issue #12117.
describe("totals keys inside a panel or row object", () => {
  const notAChoice = (findings: Array<ILintFinding>) =>
    findings.filter(f => f.ruleId === "value/not-a-choice");
  const quality = {
    type: "matrixdropdown", name: "quality", rows: ["accurate", "timely"],
    columns: [{ name: "rating", cellType: "rating", rateValues: [1, 2, 3, 4, 5], totalType: "avg" }],
  };
  const reviews = (props: any, extraElements: Array<any> = []) => ({
    elements: [{
      type: "paneldynamic", name: "review_list", panelCount: 1,
      templateElements: [quality].concat(extraElements), ...props,
    }],
  });
  const cells = { accurate: { rating: 1 }, timely: { rating: 5 } };
  const issueTypes = (json: any, value: any) =>
    new SurveyModel(json).setData({ review_list: value }).map(issue => issue.type + " @" + issue.path);

  test("a totals key of a template matrix in defaultValue is not reported (#12117)", () => {
    const value = [{ quality: cells, "quality-total": { rating: 3 } }];
    const json = reviews({ defaultValue: value });
    expect(notAChoice(lintSurvey(json).findings)).toHaveLength(0);
    expect(issueTypes(json, value)).toEqual([]);
    // the runtime writes the key itself
    const survey = new SurveyModel(reviews({}));
    survey.setValue("review_list", [{ quality: cells }]);
    expect(survey.data.review_list[0]["quality-total"]).toEqual({ rating: 3 });
  });
  test("a totals key of a missing question is still reported", () => {
    const value = [{ quality: cells, "qualityX-total": { rating: 3 } }];
    const json = reviews({ defaultValue: value });
    const findings = notAChoice(lintSurvey(json).findings);
    expect(findings.map(f => f.reason + ": " + f.messageData.key)).toEqual(["unknownQuestionKey: qualityX-total"]);
    expect(issueTypes(json, value)).toEqual(["unknownProperty @review_list[0].qualityX-total"]);
  });
  test("a totals key in defaultPanelValue is not reported", () => {
    const panelValue = { quality: cells, "quality-total": { rating: 3 } };
    const json = reviews({ defaultPanelValue: panelValue });
    expect(notAChoice(lintSurvey(json).findings)).toHaveLength(0);
    expect(issueTypes(json, [panelValue])).toEqual([]);
  });
  test("a totals key of a detail-panel matrix in a matrixdynamic row is not reported", () => {
    const value = [{ c: "a", dm: { r1: { x: 2 } }, "dm-total": { x: 2 } }];
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m", detailPanelMode: "underRow",
        columns: [{ name: "c", cellType: "text" }],
        detailElements: [{
          type: "matrixdropdown", name: "dm", rows: ["r1"],
          columns: [{ name: "x", cellType: "text", inputType: "number", totalType: "sum" }],
        }],
        defaultValue: value,
      }],
    };
    expect(notAChoice(lintSurvey(json).findings)).toHaveLength(0);
    expect(new SurveyModel(json).setData({ m: value })).toEqual([]);
  });
  test("{panel.matrix-total.column} resolves inside a dynamic panel", () => {
    const json = reviews({}, [{ type: "expression", name: "avg", expression: "{panel.quality-total.rating}" }]);
    expect(unknownRefs(lintSurvey(json).findings)).toHaveLength(0);
    const survey = new SurveyModel(json);
    survey.setValue("review_list", [{ quality: cells }]);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("review_list");
    expect(panel.panels[0].getQuestionByName("avg").value).toBe(3);
  });
  test("an unknown total column under {panel.matrix-total} is reported", () => {
    const json = reviews({}, [{ type: "expression", name: "avg", expression: "{panel.quality-total.ratng}" }]);
    const unknown = unknownRefs(lintSurvey(json).findings);
    expect(unknown.map(f => f.reason)).toEqual(["scopedUnknown"]);
    expect(unknown[0].suggestion).toBe("rating");
    const survey = new SurveyModel(json);
    survey.setValue("review_list", [{ quality: cells }]);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("review_list");
    expect(panel.panels[0].getQuestionByName("avg").isEmpty()).toBe(true);
  });
  test("a custom totalsSuffix keys the panel object too", () => {
    withSettings({ "matrix.totalsSuffix": "_sum" }, () => {
      const custom = [{ quality: cells, "quality_sum": { rating: 3 } }];
      const byDefault = [{ quality: cells, "quality-total": { rating: 3 } }];
      expect(notAChoice(lintSurvey(reviews({ defaultValue: custom })).findings)).toHaveLength(0);
      expect(issueTypes(reviews({}), custom)).toEqual([]);
      expect(notAChoice(lintSurvey(reviews({ defaultValue: byDefault })).findings).map(f => f.messageData.key))
        .toEqual(["quality-total"]);
      expect(issueTypes(reviews({}), byDefault)).toEqual(["unknownProperty @review_list[0].quality-total"]);
    });
  });
  test("{panel.q1-total} of a template question that is no matrix is reported", () => {
    const json = reviews({}, [{ type: "text", name: "q1" },
      { type: "expression", name: "e", expression: "{panel.q1-total}" }]);
    expect(unknownRefs(lintSurvey(json).findings).map(f => f.reason)).toEqual(["scopedUnknown"]);
    // only a matrix writes a totals key
    const survey = new SurveyModel(json);
    survey.setValue("review_list", [{ quality: cells, q1: "abc" }]);
    const panel = <QuestionPanelDynamicModel>survey.getQuestionByName("review_list");
    expect(panel.panels[0].getQuestionByName("e").isEmpty()).toBe(true);
    expect(survey.data.review_list[0]["q1-total"]).toBeUndefined();
  });
  test("{totalRow.c1-total} is reported: the total row holds no totals key", () => {
    const json = {
      elements: [{
        type: "matrixdynamic", name: "m", rowCount: 1,
        columns: [{ name: "c1", cellType: "text", inputType: "number", totalType: "sum" },
          { name: "c2", cellType: "expression", expression: "{totalRow.c1-total}" }],
      }],
    };
    expect(unknownRefs(lintSurvey(json).findings).map(f => f.reason + " @" + f.path))
      .toEqual(["scopedUnknown @elements[0].columns[1].expression"]);
    const survey = new SurveyModel(json);
    survey.setValue("m", [{ c1: 5 }]);
    const matrix = <QuestionMatrixDynamicModel>survey.getQuestionByName("m");
    expect(matrix.visibleRows[0].cells[1].question.isEmpty()).toBe(true);
  });
  // a matrix of a detail panel keeps its total row to itself: the row record accepts the key, but
  // nothing writes it there
  const detailMatrix = (props: any) => ({
    elements: [{
      type: "matrixdynamic", name: "m", rowCount: 1, detailPanelMode: "underRow",
      columns: [{ name: "c", cellType: "text" }],
      detailElements: [{
        type: "matrixdropdown", name: "dm", rows: ["r1"],
        columns: [{ name: "x", cellType: "text", inputType: "number", totalType: "sum" }],
      }],
      ...props,
    }],
  });
  test("{row.dm-total.x} of a detail-panel matrix is reported", () => {
    const json = detailMatrix({});
    json.elements[0].columns.push({ name: "e", cellType: "expression", expression: "{row.dm-total.x}" } as any);
    expect(unknownRefs(lintSurvey(json).findings).map(f => f.reason)).toEqual(["scopedUnknown"]);
    const survey = new SurveyModel(json);
    survey.setValue("m", [{ c: "a", dm: { r1: { x: 2 } } }]);
    const row = (<QuestionMatrixDynamicModel>survey.getQuestionByName("m")).visibleRows[0];
    row.showDetailPanel();
    expect(row.cells[1].question.isEmpty()).toBe(true);
    expect(survey.data.m[0]["dm-total"]).toBeUndefined();
  });
  test("a totals key of a detail-panel matrix in defaultRowValue is not reported", () => {
    const rowValue = { c: "a", dm: { r1: { x: 2 } }, "dm-total": { x: 2 } };
    const json = detailMatrix({ defaultRowValue: rowValue });
    expect(notAChoice(lintSurvey(json).findings)).toHaveLength(0);
    expect(new SurveyModel(json).setData({ m: [rowValue] })).toEqual([]);
  });
});

import { SurveyModel } from "../src/survey";
import { Question, readOnlyViewEmptyText } from "../src/question";
import { QuestionTextModel } from "../src/question_text";
import { QuestionCheckboxModel } from "../src/question_checkbox";
import { QuestionCommentModel } from "../src/question_comment";
import { QuestionDropdownModel } from "../src/question_dropdown";
import { QuestionBooleanModel } from "../src/question_boolean";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionMatrixDropdownModel } from "../src/question_matrixdropdown";
import { QuestionMatrixDynamicModel } from "../src/question_matrixdynamic";
import { QuestionMatrixModel } from "../src/question_matrix";
import { QuestionRatingModel } from "../src/question_rating";
import { QuestionMultipleTextModel } from "../src/question_multipletext";
import { QuestionPanelDynamicModel } from "../src/question_paneldynamic";
import { QuestionFileModel } from "../src/question_file";
import { QuestionHtmlModel } from "../src/question_html";
import { PanelModel } from "../src/panel";
import { RendererFactory } from "../src/rendererFactory";
import { Serializer } from "../src/jsonobject";
import { describe, test, expect, afterEach } from "vitest";

describe("readOnlyMode", () => {
  test("readOnlyMode is visible only when readOnly is true", () => {
    ["question", "panel", "survey"].forEach(className => {
      const prop = Serializer.findProperty(className, "readOnlyMode");
      expect(prop.isVisible("", { readOnly: false })).toBe(false);
      expect(prop.isVisible("", { readOnly: true })).toBe(true);
    });
  });

  afterEach(() => {
    if (RendererFactory.Instance.getRenderer("question", "view") !== "default") {
      RendererFactory.Instance.unregisterRenderer("question", "view");
    }
  });

  test("defaults keep the current read-only look", () => {
    const survey = new SurveyModel({
      elements: [{ type: "text", name: "q", readOnly: true, defaultValue: "A" }]
    });
    const q = <QuestionTextModel>survey.getQuestionByName("q");
    expect(survey.readOnlyMode).toBe("readonly");
    expect(survey.getReadOnlyMode()).toBe("readonly");
    expect(q.readOnlyMode).toBe("default");
    expect(q.getReadOnlyMode()).toBe("readonly");
    expect(q.isViewMode).toBe(false);
    expect(q.viewDisplayText).toBe("A");
  });

  test("survey view mode shows text only while the question is read-only", () => {
    const survey = new SurveyModel({
      readOnlyMode: "view",
      elements: [{ type: "text", name: "q", defaultValue: "A" }]
    });
    const q = <QuestionTextModel>survey.getQuestionByName("q");
    expect(q.isViewMode).toBe(false);
    survey.readOnly = true;
    expect(q.isViewMode).toBe(true);
    expect(q.getPropertyValue("isViewMode")).toBe(true);
    expect(q.viewDisplayText).toBe("A");
  });

  test("empty view text is a dash", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [
        { type: "text", name: "q" },
        { type: "comment", name: "c", showCommentArea: true }
      ]
    });
    const q = <Question>survey.getQuestionByName("q");
    const comment = <QuestionCommentModel>survey.getQuestionByName("c");
    expect(q.viewDisplayText).toBe(readOnlyViewEmptyText);
    expect(q.viewDisplayText).toBe("\u2014");
    comment.showCommentArea = true;
    comment.comment = "";
    expect(comment.getCommentViewText()).toBe("\u2014");
    comment.comment = "note";
    expect(comment.getCommentViewText()).toBe("note");
  });

  test("question and panel can override the survey mode", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [
        { type: "text", name: "kept", readOnlyMode: "readonly", defaultValue: "A" },
        {
          type: "panel",
          name: "p",
          readOnlyMode: "readonly",
          elements: [{ type: "text", name: "inside", defaultValue: "B" }]
        }
      ]
    });
    const kept = <Question>survey.getQuestionByName("kept");
    const inside = <Question>survey.getQuestionByName("inside");
    expect(kept.getReadOnlyMode()).toBe("readonly");
    expect(kept.isViewMode).toBe(false);
    expect(inside.getReadOnlyMode()).toBe("readonly");
    expect(inside.isViewMode).toBe(false);

    const panel = <PanelModel>survey.getPanelByName("p");
    panel.readOnlyMode = "view";
    expect(inside.getReadOnlyMode()).toBe("view");
    expect(inside.isViewMode).toBe(true);
    expect(inside.getPropertyValue("isViewMode")).toBe(true);
  });

  test("a read-only panel inside an editable survey can use view mode", () => {
    const survey = new SurveyModel({
      elements: [{
        type: "panel",
        name: "p",
        readOnly: true,
        readOnlyMode: "view",
        elements: [{ type: "text", name: "q", defaultValue: "Card" }]
      }]
    });
    const q = <Question>survey.getQuestionByName("q");
    expect(q.isReadOnly).toBe(true);
    expect(q.isViewMode).toBe(true);
    expect(q.viewDisplayText).toBe("Card");
  });

  test("design mode stays editable-looking", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [{ type: "text", name: "q", defaultValue: "A" }]
    });
    survey.setDesignMode(true);
    const q = <Question>survey.getQuestionByName("q");
    expect(q.isViewMode).toBe(false);
  });

  test("preview uses the survey read-only mode", () => {
    const survey = new SurveyModel({
      readOnlyMode: "view",
      showPreviewBeforeComplete: true,
      elements: [{ type: "text", name: "q", defaultValue: "A" }]
    });
    expect(survey.showPreview()).toBe(true);
    const q = <Question>survey.getQuestionByName("q");
    expect(q.isReadOnly).toBe(true);
    expect(q.isViewMode).toBe(true);
  });

  test("choice display value is a single string", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [{
        type: "checkbox",
        name: "q",
        choices: ["One", "Two"],
        defaultValue: ["One", "Two"]
      }, {
        type: "dropdown",
        name: "d",
        choices: [{ value: "a", text: "Alpha" }],
        defaultValue: "a"
      }]
    });
    const checkbox = <QuestionCheckboxModel>survey.getQuestionByName("q");
    const dropdown = <QuestionDropdownModel>survey.getQuestionByName("d");
    expect(checkbox.viewDisplayText).toBe("One, Two");
    expect(dropdown.viewDisplayText).toBe("Alpha");
  });

  test("view mode switches the component name", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [
        { type: "text", name: "q", defaultValue: "A" },
        { type: "boolean", name: "b", defaultValue: true },
        { type: "html", name: "h", html: "<b>stay</b>" },
        { type: "matrix", name: "m", columns: ["C"], rows: ["R"] }
      ]
    });
    const q = <Question>survey.getQuestionByName("q");
    const booleanQuestion = <QuestionBooleanModel>survey.getQuestionByName("b");
    const html = <QuestionHtmlModel>survey.getQuestionByName("h");
    const matrix = <QuestionMatrixModel>survey.getQuestionByName("m");
    expect(q.getComponentName()).toBe("default");
    RendererFactory.Instance.registerRenderer("question", "view", "sv-question-view");
    expect(q.getComponentName()).toBe("sv-question-view");
    expect(q.isDefaultRendering()).toBe(false);
    expect(booleanQuestion.getComponentName()).toBe("sv-question-view");
    expect(booleanQuestion.viewDisplayText).toBe(booleanQuestion.locLabelTrue.textOrHtml);
    expect(html.getComponentName()).toBe("default");
    expect(matrix.getComponentName()).toBe("default");
    expect(matrix.isViewMode).toBe(true);
  });

  test("matrix cells, multiple text editors and dynamic panels inherit view mode", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [{
        type: "matrixdropdown",
        name: "matrix",
        columns: [
          { name: "col1", cellType: "text" },
          { name: "col2", cellType: "text", readOnlyMode: "readonly" }
        ],
        rows: ["row1"],
        defaultValue: { row1: { col1: "Hello", col2: "Stay" } }
      }, {
        type: "matrixdynamic",
        name: "dynamic",
        columns: [{ name: "col1", cellType: "text" }],
        rowCount: 1,
        defaultValue: [{ col1: "Row" }]
      }, {
        type: "multipletext",
        name: "multi",
        items: [{ name: "item1" }],
        defaultValue: { item1: "Item" }
      }, {
        type: "paneldynamic",
        name: "panels",
        panelCount: 1,
        templateElements: [{ type: "text", name: "inner" }],
        defaultValue: [{ inner: "Panel" }]
      }, {
        type: "file",
        name: "file"
      }]
    });
    RendererFactory.Instance.registerRenderer("question", "view", "sv-question-view");
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const viewCell = matrix.visibleRows[0].cells[0].question;
    const readonlyCell = matrix.visibleRows[0].cells[1].question;
    expect(viewCell.isViewMode).toBe(true);
    expect(viewCell.viewDisplayText).toBe("Hello");
    expect(viewCell.getComponentName()).toBe("sv-question-view");
    expect(readonlyCell.getReadOnlyMode()).toBe("readonly");
    expect(readonlyCell.isViewMode).toBe(false);

    const dynamic = <QuestionMatrixDynamicModel>survey.getQuestionByName("dynamic");
    expect(dynamic.canAddRow).toBe(false);
    expect(dynamic.canRemoveRows).toBe(false);
    expect(dynamic.visibleRows[0].cells[0].question.isViewMode).toBe(true);
    expect(dynamic.visibleRows[0].cells[0].question.viewDisplayText).toBe("Row");

    const multiple = <QuestionMultipleTextModel>survey.getQuestionByName("multi");
    expect(multiple.getComponentName()).toBe("default");
    expect(multiple.items[0].editor.isViewMode).toBe(true);
    expect(multiple.items[0].editor.viewDisplayText).toBe("Item");

    const panels = <QuestionPanelDynamicModel>survey.getQuestionByName("panels");
    expect(panels.canAddPanel).toBe(false);
    expect(panels.canRemovePanel).toBe(false);
    const inner = panels.panels[0].getQuestionByName("inner");
    expect(inner.isViewMode).toBe(true);
    expect(inner.viewDisplayText).toBe("Panel");

    const file = <QuestionFileModel>survey.getQuestionByName("file");
    expect(file.isViewMode).toBe(true);
    expect(file.getComponentName()).toBe("default");
    expect(file.showFileDecorator).toBe(false);
    expect(file.viewDisplayText).toBe("\u2014");
  });

  test("stars and smileys in view mode drop min and max labels and stay left aligned", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [
        { type: "rating", name: "stars", rateType: "stars", minRateDescription: "Bad", maxRateDescription: "Good", defaultValue: 3 },
        { type: "rating", name: "smileys", rateType: "smileys", minRateDescription: "Bad", maxRateDescription: "Good", defaultValue: 4 },
        { type: "rating", name: "labels", rateType: "labels", minRateDescription: "Bad", maxRateDescription: "Good", defaultValue: 2 }
      ]
    });
    const stars = <QuestionRatingModel>survey.getQuestionByName("stars");
    const smileys = <QuestionRatingModel>survey.getQuestionByName("smileys");
    const labels = <QuestionRatingModel>survey.getQuestionByName("labels");
    expect(stars.hasMinLabel).toBe(false);
    expect(stars.hasMaxLabel).toBe(false);
    expect(stars.ratingRootCss).toContain("sd-rating--view");
    expect(smileys.hasMinLabel).toBe(false);
    expect(smileys.hasMaxLabel).toBe(false);
    expect(smileys.ratingRootCss).toContain("sd-rating--view");
    expect(labels.hasMinLabel).toBe(true);
    expect(labels.ratingRootCss).not.toContain("sd-rating--view");

    const editable = new SurveyModel({
      elements: [{ type: "rating", name: "stars", rateType: "stars", minRateDescription: "Bad", maxRateDescription: "Good" }]
    });
    const editableStars = <QuestionRatingModel>editable.getQuestionByName("stars");
    expect(editableStars.hasMinLabel).toBe(true);
    expect(editableStars.ratingRootCss).not.toContain("sd-rating--view");
  });

  test("changing the survey mode updates nested questions", () => {
    const survey = new SurveyModel({
      readOnly: true,
      elements: [{
        type: "matrixdropdown",
        name: "matrix",
        columns: [{ name: "col1", cellType: "text" }],
        rows: ["row1"]
      }]
    });
    const matrix = <QuestionMatrixDropdownModel>survey.getQuestionByName("matrix");
    const cell = matrix.visibleRows[0].cells[0].question;
    expect(cell.isViewMode).toBe(false);
    survey.readOnlyMode = "view";
    expect(cell.isViewMode).toBe(true);
    expect(cell.getPropertyValue("isViewMode")).toBe(true);
  });

  test("single-select matrix uses preview checkmarks in view mode", () => {
    const survey = new SurveyModel({
      readOnly: true,
      elements: [{
        type: "matrix",
        name: "single",
        columns: ["Column 1", "Column 2"],
        rows: ["Row 1"],
        defaultValue: { "Row 1": "Column 1" }
      }, {
        type: "matrix",
        name: "multi",
        cellType: "checkbox",
        columns: ["Column 1", "Column 2"],
        rows: ["Row 1"],
        defaultValue: { "Row 1": ["Column 1"] }
      }]
    });
    const single = <QuestionMatrixModel>survey.getQuestionByName("single");
    const multi = <QuestionMatrixModel>survey.getQuestionByName("multi");
    const singleRow = single.visibleRows[0];
    const checked = single.visibleColumns[0];
    const unchecked = single.visibleColumns[1];
    expect(single.getItemSvgIcon(singleRow, checked)).toBe("#icon-radio-16x16");
    expect(single.getItemClass(singleRow, checked)).toContain("sd-radio--readonly");

    survey.readOnlyMode = "view";
    expect(single.getItemSvgIcon(singleRow, checked)).toBe("#icon-check-16x16");
    expect(single.getItemSvgIcon(singleRow, unchecked)).toBe("#icon-check-16x16");
    expect(single.getItemClass(singleRow, checked)).toContain("sd-radio--preview");
    expect(single.getItemClass(singleRow, checked)).not.toContain("sd-radio--readonly");
    expect(single.getItemClass(singleRow, unchecked)).toContain("sd-radio--preview");

    const multiRow = multi.visibleRows[0];
    const multiChecked = multi.visibleColumns[0];
    const multiUnchecked = multi.visibleColumns[1];
    expect(multi.getItemSvgIcon(multiRow, multiChecked)).toBe("#icon-check-16x16");
    expect(multi.getItemSvgIcon(multiRow, multiUnchecked)).toBe("#icon-radio-16x16");
    expect(multi.getItemClass(multiRow, multiChecked)).toContain("sd-checkbox--readonly");
    expect(multi.getItemClass(multiRow, multiChecked)).not.toContain("sd-checkbox--preview");

    const preview = new SurveyModel({
      showPreviewBeforeComplete: true,
      elements: [{
        type: "matrix",
        name: "single",
        columns: ["Column 1", "Column 2"],
        rows: ["Row 1"],
        defaultValue: { "Row 1": "Column 1" }
      }]
    });
    preview.showPreview();
    const previewMatrix = <QuestionMatrixModel>preview.getQuestionByName("single");
    const previewRow = previewMatrix.visibleRows[0];
    expect(previewMatrix.getItemSvgIcon(previewRow, previewMatrix.visibleColumns[0])).toBe("#icon-check-16x16");
    expect(previewMatrix.getItemClass(previewRow, previewMatrix.visibleColumns[0])).toContain("sd-radio--preview");
  });

  test("multiple text view mode drops the formbox frame", () => {
    const survey = new SurveyModel({
      readOnly: true,
      elements: [{
        type: "multipletext",
        name: "q",
        items: [{ name: "text1" }]
      }]
    });
    const question = <QuestionMultipleTextModel>survey.getQuestionByName("q");
    expect(question.getItemLabelCss(question.items[0])).toContain("sd-formbox--readonly");
    survey.readOnlyMode = "view";
    const viewCss = question.getItemLabelCss(question.items[0]);
    expect(viewCss).toContain("sd-formbox--view");
    expect(viewCss).not.toContain("sd-formbox--readonly");
  });

  test("stars and smileys stay compact icons in view mode", () => {
    const survey = new SurveyModel({
      readOnly: true,
      readOnlyMode: "view",
      elements: [
        { type: "rating", name: "stars", rateType: "stars", defaultValue: 4 },
        { type: "rating", name: "smileys", rateType: "smileys", defaultValue: 4 },
        { type: "rating", name: "labels", defaultValue: 4 },
        { type: "rating", name: "dropdown", displayMode: "dropdown", rateType: "stars", defaultValue: 4 }
      ]
    });
    const stars = <QuestionRatingModel>survey.getQuestionByName("stars");
    const smileys = <QuestionRatingModel>survey.getQuestionByName("smileys");
    const labels = <QuestionRatingModel>survey.getQuestionByName("labels");
    const dropdown = <QuestionRatingModel>survey.getQuestionByName("dropdown");
    RendererFactory.Instance.registerRenderer("question", "view", "sv-question-view");
    RendererFactory.Instance.registerRenderer("rating", "dropdown", "sv-rating-dropdown");
    try {
      expect(stars.viewModeCssClass).toBe("sd-view");
      expect(stars.getComponentName()).toBe("default");
      expect(stars.itemSmallMode).toBe(true);
      expect(stars.itemStarIcon).toBe("icon-rating-star-small");
      expect(stars.itemTabIndex).toBe(-1);
      expect(smileys.getComponentName()).toBe("default");
      expect(smileys.itemSmallMode).toBe(true);
      expect(smileys.itemTabIndex).toBe(-1);
      expect(smileys.ratingRootCss).toContain("sd-rating--small");
      expect(labels.getComponentName()).toBe("sv-question-view");
      expect(labels.itemTabIndex).toBeUndefined();
      expect(labels.itemSmallMode).toBeFalsy();
      expect(dropdown.getComponentName()).toBe("default");
      expect(dropdown.itemSmallMode).toBe(true);
    } finally {
      RendererFactory.Instance.unregisterRenderer("rating", "dropdown");
    }
  });
});

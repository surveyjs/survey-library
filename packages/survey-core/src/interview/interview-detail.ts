import type { Question, SurveyModel } from "survey-core";
import { MAX_NESTING_DEPTH } from "./interview-address";

// The one place a row's detail panel is brought into being. A row of a matrix creates its detail
// panel lazily: until something asks for it, row.questions and row.visibleQuestions are the cells
// alone, and so are row.getQuestionByName and the inventory's walk. Left to the model, the panel of a
// row appears at the row's first validation - so the first document of a matrix with a detail panel
// would list the cells only, and a row a batch adds could not take its detail fields in the call that
// adds it. The interview therefore creates the missing panels itself.
//
// Only inside a mutating call, and before that call settles. Creating a panel is not behavior-free:
// the host's onCreateDetailPanelCallback fires, every detail question's surveyLoadCallback runs, a
// defaultValue is written into the row's data and a choicesByUrl request goes out. All of that is
// fine in a call that settles before it reads, and none of it is fine in a read: current(),
// describeAll() and every describer read row.visibleQuestions / row.getQuestionByName as they did
// before, and see the detail questions because this module ran first.
//
// It creates a panel through row.showDetailPanel(), the public gesture a respondent's click runs,
// because the model offers no other public way to create one. The price is a UI state change: the row
// is expanded (with detailPanelMode "underRowSingle" the previously expanded row collapses), the
// matrix builds its rendered table, and onMatrixDetailPanelVisibleChanged fires for the row. The panel
// survives a later collapse - hideDetailPanel() keeps it - so the questions stay readable whatever a
// UI on the same model does afterwards. A panel that exists is never shown again: a row is expanded
// at most once, by the call that made it visible.
//
// A leaf: nothing here imports another module of the interview but the ceiling, and nothing that
// describes, predicates or builds the inventory imports this one. interview.ts runs the pass at the
// start of every settle, and interview-records.ts creates the panel of the one entry a batch record
// is about to write, which is a mutation inside a mutating call too.

// hasPanel reads hasDetailPanel(row), which honors detailPanelMode, detailElements and the survey's
// onHasDetailPanelCallback: a row the host excluded gets no panel from the interview either.
export function ensureRowDetailPanel(row: any): void {
  if (!row || typeof row.showDetailPanel !== "function") return;
  if (!!row.detailPanel || row.hasPanel !== true) return;
  row.showDetailPanel();
}

// The materialization pass: the panel of every visible row that has one, in every matrix the
// interview can reach. Per question the panels come first and the nested questions second, so a matrix
// inside a panel this pass has just created is reached in the same pass. Idempotent: a second pass
// over the same model creates nothing.
export function ensureDetailPanels(survey: SurveyModel): void {
  // The roots getSingleElements() would return (interview-items.ts getRootQuestions, repeated here to
  // keep this module a leaf): the visible questions of the visible, non-start pages.
  survey.getAllQuestions().forEach(question => {
    if (!question.isVisibleInSurvey || isOnStartPage(question)) return;
    ensureInQuestion(question, 0);
  });
}

// "depth" is the number of containers above the question (interview-address.ts). A container at the
// ceiling is not described inside, so no panel of its rows is created either.
function ensureInQuestion(question: Question, depth: number): void {
  if (depth >= MAX_NESTING_DEPTH) return;
  const target: any = question;
  if (Array.isArray(target.visibleRows)) {
    target.visibleRows.forEach((row: any) => ensureRowDetailPanel(row));
  }
  if (typeof target.addPanel === "function") {
    // The first read builds the panels of a dynamic panel nobody has rendered, and the nested walk
    // below reads the ones already built: a matrix in a panel nobody has read yet is reached all the
    // same, in the call that made the panel exist.
    const panels = target.visiblePanels;
    if (!Array.isArray(panels)) return;
  }
  question.getNestedQuestions(true, false).forEach(child => ensureInQuestion(child, depth + 1));
}

function isOnStartPage(question: Question): boolean {
  const page: any = question.page;
  return !!page && page.isStartPage === true;
}

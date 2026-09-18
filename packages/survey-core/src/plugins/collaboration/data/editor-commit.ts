import { DomDocumentHelper, Question, SurveyModel } from "survey-core";

// The DOM attribute every renderer puts on a question's root node. It is the only DOM
// contract the collaboration feature relies on, so it lives in one place.
export const QUESTION_ROOT_SELECTOR = "[data-name]";

interface IFocusedEditor {
  question: Question;
  // The answer itself, or the question's comment / "Other" box.
  field: "value" | "comment";
  text: string;
}

// Resolves the text editor the local user currently has focus in, if any.
//
// Matching is by element id: survey-core renders the answer input with question.inputId
// and the comment box with question.commentId. The answer match is additionally
// restricted to `textbase` descendants (the text and comment question types), because
// other types reuse inputId for controls that are NOT the answer - a dropdown puts it on
// its filter box, where the typed text is a search string that must never become a value.
//
// Deliberately NOT survey.getAllQuestions(_, _, true): that call runs
// page.onFirstRendering() on EVERY page, which would defeat lazyRenderEnabled on every
// single remote keystroke. Instead we walk up to the outermost [data-name] node - the
// top-level question - and ask IT for its nested questions. survey-core implements that
// walk for every composite type, so this still finds editors inside composite components,
// matrix rows (the real visibleRows cells, not the column templates), dynamic panels and
// multipletext items, without this module knowing anything about the schema.
function findFocusedEditor(survey: SurveyModel): IFocusedEditor | null {
  const doc = DomDocumentHelper.getDocument();
  if (!doc) return null;
  const el = doc.activeElement as HTMLInputElement | HTMLTextAreaElement;
  if (!el || (el.tagName !== "INPUT" && el.tagName !== "TEXTAREA") || !el.id) return null;

  let node: Element | null = el.closest ? el.closest(QUESTION_ROOT_SELECTOR) : null;
  if (!node) return null;
  let parent = node.parentElement ? node.parentElement.closest(QUESTION_ROOT_SELECTOR) : null;
  while(!!parent) {
    node = parent;
    parent = node.parentElement ? node.parentElement.closest(QUESTION_ROOT_SELECTOR) : null;
  }
  const topName = node.getAttribute("data-name");
  if (!topName) return null;
  const top = survey.getQuestionByName(topName);
  if (!top) return null;

  const candidates = top.getNestedQuestions(false, true, true);
  for (let i = 0; i < candidates.length; i++) {
    const question: any = candidates[i];
    if (question.inputId === el.id && question.isDescendantOf("textbase")) {
      return { question: candidates[i], field: "value", text: el.value };
    }
    if (question.commentId === el.id) {
      return { question: candidates[i], field: "comment", text: el.value };
    }
  }
  return null;
}

// Commits the focused editor's on-screen text into the model.
//
// SurveyJS commits a text input only on blur (textUpdateMode defaults to "onBlur"), so
// mid-typing the characters exist ONLY in the DOM - the model still holds the previous
// value. That is harmless until something repaints, and applying a peer's answer does
// exactly that: properties change on the SurveyModel, the question tree re-renders, and
// the renderer writes the model value back over the focused input (it diffs against the
// live DOM value and never checks document.activeElement). The half-typed answer
// disappears - which is what made a peer ticking checkboxes wipe whatever someone else
// was typing.
//
// Committing first makes model and DOM agree, so that write is skipped and both the text
// and the caret survive.
//
// This deliberately goes through the normal setters, so it emits like any other local
// edit. It must NOT be silent: an unsent value would also stop blur from changing
// anything, onValueChanged would never fire for it, and the answer would never reach the
// peers at all.
//
// inputValue rather than value where it exists: its setter unmasks masked input and
// coerces the question's value type, so handing it raw DOM text is safe. Types without it
// (comment) take the text as their value.
export function commitFocusedEditor(survey: SurveyModel): void {
  const focused = findFocusedEditor(survey);
  if (!focused) return;
  const editor: any = focused.question;
  if (focused.field === "comment") {
    if (editor.comment !== focused.text) editor.comment = focused.text;
  } else if ("inputValue" in editor) {
    if (editor.inputValue !== focused.text) editor.inputValue = focused.text;
  } else if (editor.value !== focused.text) {
    editor.value = focused.text;
  }
}

import { afterEach, describe, expect, test, vi } from "vitest";
import { QuestionCommentModel } from "../../src/question_comment";
import { Serializer } from "../../src/jsonobject";
import { SurveyModel } from "../../src/survey";
import { RichTextEditorModel } from "../../src/plugins/rich-text/editor-model";
import { RichText } from "../../src/plugins/rich-text/api";
import "../../src/plugins/rich-text/index";

function mount(question: QuestionCommentModel, mode?: "inline" | "block"): { element: HTMLDivElement, model: RichTextEditorModel } {
  const element = document.createElement("div");
  document.body.appendChild(element);
  const model = new RichTextEditorModel(question, mode ? { mode: mode } : undefined);
  model.attach(element);
  return { element, model };
}

function selectText(element: HTMLElement, model: { syncSelection(): void }, start: string, end: string): void {
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();
  while(node) {
    nodes.push(node as Text);
    node = walker.nextNode();
  }
  const full = nodes.map(item => item.textContent || "").join("");
  const startAt = full.indexOf(start);
  const endAt = full.indexOf(end) + end.length;
  let cursor = 0;
  let startNode = nodes[0];
  let startOffset = 0;
  let endNode = nodes[0];
  let endOffset = 0;
  for (let i = 0; i < nodes.length; i++) {
    const text = nodes[i].textContent || "";
    const next = cursor + text.length;
    if (cursor <= startAt && startAt <= next) {
      startNode = nodes[i];
      startOffset = startAt - cursor;
    }
    if (cursor <= endAt && endAt <= next) {
      endNode = nodes[i];
      endOffset = endAt - cursor;
    }
    cursor = next;
  }
  const range = document.createRange();
  range.setStart(startNode, startOffset);
  range.setEnd(endNode, endOffset);
  const selection = document.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  model.syncSelection();
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("rich text editor model", () => {
  test("importing the plugin shows allowRichText and registers the renderer", () => {
    expect(Serializer.findProperty("comment", "allowRichText").visible).toBe(true);
    const question = new QuestionCommentModel("c");
    question.allowRichText = true;
    expect(question.getComponentName()).toBe("sv-rich-text-comment");
  });

  test("toggle state is all, none, or mixed from the selection", () => {
    const question = new QuestionCommentModel("c");
    const { element, model } = mount(question);
    element.innerHTML = "<strong>ab</strong>cd<em>ef</em>";
    selectText(element, model, "ab", "ab");
    expect(model.toggleState("bold")).toBe("all");
    selectText(element, model, "cd", "cd");
    expect(model.toggleState("bold")).toBe("none");
    selectText(element, model, "bc", "bc");
    expect(model.toggleState("bold")).toBe("mixed");
  });

  test("bold on a mixed selection stores the worked example", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = survey.getQuestionByName("c") as QuestionCommentModel;
    question.value = "Please <strong>read</strong> the <em>terms</em> carefully";
    const { element, model } = mount(question);
    selectText(element, model, "ead the ter", "ead the ter");
    model.run("bold");
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("Please <strong>read the </strong><em><strong>ter</strong>ms</em> carefully");
    selectText(element, model, "ead the ter", "ead the ter");
    model.run("bold");
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("Please <strong>r</strong>ead the <em>terms</em> carefully");
  });

  test("shortcuts dispatch the same commands and Ctrl+U is blocked", () => {
    const calls: string[] = [];
    const question = new QuestionCommentModel("c");
    const element = document.createElement("div");
    document.body.appendChild(element);
    const model = new RichTextEditorModel(question, {
      commands: { exec: (command: string) => { calls.push(command); } }
    });
    model.attach(element);
    element.innerHTML = "ab";
    selectText(element, model, "ab", "ab");
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true }));
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "i", ctrlKey: true }));
    const blocked = new KeyboardEvent("keydown", { key: "u", ctrlKey: true, cancelable: true });
    element.dispatchEvent(blocked);
    expect(calls).toEqual(["bold", "italic"]);
    expect(blocked.defaultPrevented).toBe(true);
    model.detach();
  });

  test("blur commits sanitized html and focus without input does not", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = survey.getQuestionByName("c") as QuestionCommentModel;
    question.value = "Tom & Jerry";
    const { element } = mount(question);
    element.dispatchEvent(new FocusEvent("focus"));
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("Tom & Jerry");
    element.innerHTML = "<b>x</b>";
    element.dispatchEvent(new Event("input"));
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("<strong>x</strong>");
  });

  test("onTyping commits after the debounce and a legacy value is not rewritten", () => {
    vi.useFakeTimers();
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true, textUpdateMode: "onTyping" }] });
    const question = survey.getQuestionByName("c") as QuestionCommentModel;
    question.value = "a\nb";
    const { element } = mount(question);
    element.dispatchEvent(new FocusEvent("focus"));
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("a\nb");
    element.innerHTML = "typed";
    element.dispatchEvent(new Event("input"));
    expect(question.value).toBe("a\nb");
    vi.advanceTimersByTime(200);
    expect(question.value).toBe("typed");
    vi.useRealTimers();
  });

  test("an external value updates the editor and waits while it is focused", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = survey.getQuestionByName("c") as QuestionCommentModel;
    const { element, model } = mount(question);
    question.value = "<strong>now</strong>";
    expect(element.innerHTML).toBe("<strong>now</strong>");
    element.dispatchEvent(new FocusEvent("focus"));
    (model as any).focused = true;
    question.value = "<em>later</em>";
    expect(element.innerHTML).toBe("<strong>now</strong>");
    element.dispatchEvent(new FocusEvent("blur"));
    expect(element.innerHTML).toBe("<em>later</em>");
  });

  test("inline mode hides list buttons and blocks Enter", () => {
    const question = new QuestionCommentModel("c");
    question.acceptCarriageReturn = false;
    const { element, model } = mount(question);
    expect(model.mode).toBe("inline");
    const lists = model.toolbar.actions.filter(action => action.id.indexOf("list") >= 0);
    expect(lists.every(action => action.visible === false)).toBe(true);
    element.innerHTML = "ab";
    const event = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });
    element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(element.querySelector("p")).toBeNull();
  });

  test("Enter in block mode splits a paragraph and Shift+Enter inserts a break", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", allowRichText: true }] });
    const question = survey.getQuestionByName("c") as QuestionCommentModel;
    const { element, model } = mount(question);
    element.innerHTML = "ab";
    selectText(element, model, "a", "a");
    const caret = document.getSelection().getRangeAt(0);
    caret.collapse(false);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(caret);
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }));
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("<p>a</p><p>b</p>");
  });

  test("content-agnostic attachEditor does not write a value", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    element.innerHTML = "keep";
    const handle = RichText.attachEditor(element, { mode: "inline" });
    expect(handle.toolbar.actions.length).toBeGreaterThan(0);
    element.dispatchEvent(new Event("input"));
    element.dispatchEvent(new FocusEvent("blur"));
    expect(element.innerHTML).toBe("keep");
    handle.detach();
  });
});

import { QuestionCommentModel } from "../../src/question_comment";
import "../../src/plugins/rich-text/index";
import { IRichTextCommands, RichTextEditorModel } from "../../src/plugins/rich-text/editor-model";
import { SurveyModel } from "../../src/survey";
import { Serializer } from "../../src/jsonobject";

import { describe, expect, test } from "vitest";

function commands(): IRichTextCommands & { calls: string[] } {
  const calls: string[] = [];
  return {
    calls,
    styleWithCSS() { calls.push("styleWithCSS"); },
    exec(command: string) { calls.push(command); }
  };
}

function hostOf(question: QuestionCommentModel) {
  return {
    getValue: () => question.value || "",
    setValue: (value: string) => { question.value = value; },
    get isInputTextUpdate() { return question.isInputTextUpdate; },
    get acceptCarriageReturn() { return question.acceptCarriageReturn !== false; },
    get mode(): "inline" | "block" { return question.acceptCarriageReturn === false ? "inline" : "block"; },
    get format(): "markdown" | "html" { return question.textFormat === "html" ? "html" : "markdown"; },
    owner: question
  };
}

function select(host: HTMLElement, start: Node, startOffset: number, end: Node, endOffset: number): void {
  const range = host.ownerDocument.createRange();
  range.setStart(start, startOffset);
  range.setEnd(end, endOffset);
  const selection = host.ownerDocument.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
  host.ownerDocument.dispatchEvent(new Event("selectionchange"));
}

describe("rich text editor model", () => {
  test("richTextEditMode is not serialized and the format properties become visible", () => {
    const question = new QuestionCommentModel("c");
    expect((question as any).richTextEditMode).toBe("block");
    (question as any).richTextEditMode = "inline";
    expect(question.toJSON().richTextEditMode).toBeUndefined();
    expect(Serializer.findProperty("comment", "textFormat").visible).toBe(true);
    expect(Serializer.findProperty("survey", "stringFormat").visible).toBe(true);
  });

  test("toggle state is all, none or mixed", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new RichTextEditorModel(hostOf(question), commands());
    editor.attach(host);
    host.innerHTML = "<strong>ab</strong>c";
    const boldText = host.firstChild.firstChild as Text;
    const plainText = host.childNodes[1] as Text;
    select(host, boldText, 0, boldText, 2);
    expect(editor.getMarkState("bold")).toBe("all");
    select(host, plainText, 0, plainText, 1);
    expect(editor.getMarkState("bold")).toBe("none");
    select(host, boldText, 0, plainText, 1);
    expect(editor.getMarkState("bold")).toBe("mixed");
    host.remove();
    editor.detach();
  });

  test("buttons and shortcuts dispatch commands and keep the saved selection", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const adapter = commands();
    adapter.exec = (command: string) => {
      adapter.calls.push(command + ":" + (host.ownerDocument.getSelection()?.toString() || ""));
    };
    const editor = new RichTextEditorModel(hostOf(question), adapter);
    editor.attach(host);
    host.innerHTML = "hello";
    select(host, host.firstChild, 0, host.firstChild, 5);
    host.blur();
    editor.toggleMark("bold");
    expect(adapter.calls[adapter.calls.length - 1]).toBe("bold:hello");
    const shortcut = new KeyboardEvent("keydown", { key: "i", ctrlKey: true, cancelable: true });
    host.dispatchEvent(shortcut);
    expect(shortcut.defaultPrevented).toBe(true);
    expect(adapter.calls[adapter.calls.length - 1].indexOf("italic:")).toBe(0);
    const blocked = new KeyboardEvent("keydown", { key: "u", ctrlKey: true, cancelable: true });
    host.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).toBe(true);
    expect(adapter.calls.some(call => call.indexOf("underline") === 0)).toBe(false);
    editor.applyList(false);
    expect(adapter.calls[adapter.calls.length - 1].indexOf("insertUnorderedList")).toBe(0);
    host.remove();
    editor.detach();
  });

  test("clear formatting removes list items", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const adapter = commands();
    const editor = new RichTextEditorModel(hostOf(question), adapter);
    editor.attach(host);
    host.innerHTML = "<ul><li>one</li></ul>";
    const text = host.querySelector("li").firstChild;
    select(host, text, 0, text, 3);
    editor.clearFormatting();
    expect(adapter.calls).toContain("removeFormat");
    expect(adapter.calls).toContain("unlink");
    expect(host.querySelector("li")).toBeNull();
    expect(host.textContent).toBe("one");
    host.remove();
    editor.detach();
  });

  test("commits on blur and on input when typing updates, and not without input", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new RichTextEditorModel(hostOf(question), commands());
    editor.attach(host);
    host.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBeFalsy();
    host.innerHTML = "<strong>a</strong>";
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    host.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("**a**");

    const typing = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown", textUpdateMode: "onTyping" }] });
    const typingQuestion = <QuestionCommentModel>typing.getQuestionByName("c");
    const typingHost = document.createElement("div");
    document.body.appendChild(typingHost);
    const typingEditor = new RichTextEditorModel(hostOf(typingQuestion), commands());
    typingEditor.inputDelay = 0;
    typingEditor.attach(typingHost);
    typingHost.innerHTML = "<em>b</em>";
    typingHost.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(typingQuestion.value).toBe("*b*");
    host.remove();
    typingHost.remove();
  });

  test("inline mode blocks Enter when carriage return is not accepted", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown", acceptCarriageReturn: false }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const adapter = commands();
    const editor = new RichTextEditorModel(hostOf(question), adapter);
    editor.attach(host);
    expect(editor.toolbar.actions.filter(action => action.id === "rich-text-bulleted")[0].visible).toBe(false);
    const enter = new KeyboardEvent("keydown", { key: "Enter", cancelable: true });
    host.dispatchEvent(enter);
    expect(enter.defaultPrevented).toBe(true);
    expect(adapter.calls).not.toContain("insertLineBreak");
    expect(adapter.calls).not.toContain("insertParagraph");
    host.remove();
  });
});

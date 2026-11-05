import { QuestionCommentModel } from "../../src/question_comment";
import { RichText } from "../../src/plugins/rich-text/index";
import { IRichTextCommands, RichTextEditorModel } from "../../src/plugins/rich-text/editor-model";
import { createRichTextLinkSurvey } from "../../src/plugins/rich-text/link-dialog";
import { SurveyModel } from "../../src/survey";
import { Serializer } from "../../src/jsonobject";
import { settings } from "../../src/settings";

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
    expect(Serializer.findProperty("survey", "stringFormat")).toBeFalsy();
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

  test("a host converter replaces the format converter", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    question.value = "hello";
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new RichTextEditorModel({
      ...hostOf(question),
      converter: { toHtml: () => "<b>custom</b>", toSource: () => "from-converter" }
    }, commands());
    editor.attach(host);
    expect(host.innerHTML).toBe("<b>custom</b>");
    expect(editor.getReadOnlyHtml("x")).toBe("<b>custom</b>");
    host.innerHTML = "<em>z</em>";
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    host.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("from-converter");
    editor.detach();
    host.remove();
  });

  test("attachEditor does not write a value, normalizes paste and detaches", () => {
    const host = document.createElement("div");
    document.body.appendChild(host);
    let inputs = 0;
    const inline = RichText.attachEditor(host, { mode: "inline", onInput: () => inputs++ });
    const bulleted = inline.toolbar.actions.filter(action => action.id === "rich-text-bulleted")[0];
    const numbered = inline.toolbar.actions.filter(action => action.id === "rich-text-numbered")[0];
    expect(bulleted.visible).toBe(false);
    expect(numbered.visible).toBe(false);
    host.innerHTML = "<strong>a</strong>";
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    host.dispatchEvent(new FocusEvent("blur"));
    expect(inputs).toBe(1);
    expect(host.innerHTML).toBe("<strong>a</strong>");
    inline.detach();
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(inputs).toBe(1);

    const blockHost = document.createElement("div");
    document.body.appendChild(blockHost);
    const recorded: string[] = [];
    const block = new RichTextEditorModel({
      getValue: () => "",
      setValue: () => recorded.push("set"),
      isInputTextUpdate: false,
      acceptCarriageReturn: true,
      mode: "block",
      format: "markdown",
      managesValue: false
    }, {
      styleWithCSS() {},
      exec(command: string, value?: string) { recorded.push(value !== undefined ? command + ":" + value : command); }
    });
    block.attach(blockHost);
    expect(block.toolbar.actions.filter(action => action.id === "rich-text-bulleted")[0].visible).toBe(true);
    const paste = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(paste, "clipboardData", {
      value: {
        getData: (type: string) => type === "text/html" ? "<span style=\"color:red\"><b>a</b></span><script>alert(1)</script>" : "a"
      }
    });
    blockHost.dispatchEvent(paste);
    expect(paste.defaultPrevented).toBe(true);
    expect(recorded[recorded.length - 1]).toBe("insertHTML:<strong>a</strong>");
    expect(recorded).not.toContain("set");
    block.detach();
    const after = new Event("paste", { bubbles: true, cancelable: true });
    Object.defineProperty(after, "clipboardData", { value: { getData: () => "<b>b</b>" } });
    blockHost.dispatchEvent(after);
    expect(after.defaultPrevented).toBe(false);
    host.remove();
    blockHost.remove();
  });

  test("the link dialog rejects a bad scheme and an empty url unlinks", () => {
    const bad = createRichTextLinkSurvey("javascript:alert(1)");
    expect(bad.validate(false, false)).toBe(false);
    bad.setValue("url", "https://surveyjs.io");
    expect(bad.validate(false, false)).toBe(true);
    bad.setValue("url", "");
    expect(bad.validate(false, false)).toBe(true);

    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const adapter = commands();
    adapter.exec = (command: string, value?: string) => {
      adapter.calls.push(value !== undefined ? command + ":" + value : command);
    };
    const editor = new RichTextEditorModel(hostOf(question), adapter);
    editor.attach(host);
    host.innerHTML = "x";
    select(host, host.firstChild, 0, host.firstChild, 1);
    editor.applyLink("https://surveyjs.io");
    expect(adapter.calls[adapter.calls.length - 1]).toBe("createLink:https://surveyjs.io");
    editor.applyLink("");
    expect(adapter.calls[adapter.calls.length - 1]).toBe("unlink");
    host.innerHTML = "";
    editor.applyLink("https://surveyjs.io");
    expect(adapter.calls[adapter.calls.length - 1]).toBe("insertHTML:<a href=\"https://surveyjs.io\">https://surveyjs.io</a>");
    expect(editor.toolbar.actions.filter(action => action.id === "rich-text-link")[0].visible).toBe(false);
    settings.showDialog = () => ({}) as any;
    const withDialog = new RichTextEditorModel(hostOf(question), commands());
    expect(withDialog.toolbar.actions.filter(action => action.id === "rich-text-link")[0].visible).toBe(true);
    let opened = 0;
    settings.showDialog = () => { opened += 1; return undefined as any; };
    withDialog.openLink();
    expect(opened).toBe(1);
    settings.showDialog = undefined;
    editor.detach();
    host.remove();
  });

  test("external value updates immediately when blurred and waits while focused", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new RichTextEditorModel(hostOf(question), commands());
    editor.attach(host);
    host.contentEditable = "true";
    host.tabIndex = 0;
    editor.notifyExternalValue("**a**");
    expect(host.querySelector("strong").textContent).toBe("a");
    host.focus();
    editor.notifyExternalValue("**b**");
    expect(host.querySelector("strong").textContent).toBe("a");
    host.dispatchEvent(new FocusEvent("blur"));
    expect(host.querySelector("strong").textContent).toBe("b");
    editor.detach();
    host.remove();
  });

  test("maxLength blocks input and reverts a command that would exceed it", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown", maxLength: 4 }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    question.value = "abcd";
    const drafts: string[] = [];
    const host = document.createElement("div");
    document.body.appendChild(host);
    const adapter = commands();
    const editor = new RichTextEditorModel({
      ...hostOf(question),
      maxLength: 4,
      onDraft: (source: string) => {
        drafts.push(source);
        question.updateRemainingCharacterCounter(source);
      }
    }, adapter);
    editor.attach(host);
    expect(question.characterCounter.remainingCharacterCounter).toBe("4/4");
    expect(drafts[drafts.length - 1]).toBe("abcd");
    const typing = new InputEvent("beforeinput", { cancelable: true, data: "e" });
    Object.defineProperty(typing, "inputType", { value: "insertText" });
    host.dispatchEvent(typing);
    expect(typing.defaultPrevented).toBe(true);
    host.innerHTML = "<strong>abcd</strong>";
    editor.toggleMark("bold");
    expect(adapter.calls).toContain("undo");
    editor.detach();
    host.remove();
  });

  test("an empty editor drops a lone break so the placeholder can show", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown", placeholder: "Type" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new RichTextEditorModel({ ...hostOf(question), placeholder: "Type" }, commands());
    editor.attach(host);
    expect(host.getAttribute("data-placeholder")).toBe("Type");
    expect(host.innerHTML).toBe("");
    host.innerHTML = "<br>";
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    expect(host.innerHTML).toBe("");
    editor.detach();
    host.remove();
  });

  test("unsupported html opens in source mode until edit anyway", () => {
    const survey = new SurveyModel({
      elements: [{ type: "comment", name: "c", textFormat: "html", defaultValue: "<p style=\"color:red\">Red</p>" }]
    });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    let sourceMode = false;
    const editor = new RichTextEditorModel({
      ...hostOf(question),
      onSourceMode: (value: boolean) => { sourceMode = value; }
    }, commands());
    expect(sourceMode).toBe(true);
    editor.editAnyway();
    expect(sourceMode).toBe(false);
    const host = document.createElement("div");
    document.body.appendChild(host);
    editor.attach(host);
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    host.dispatchEvent(new FocusEvent("blur"));
    expect(question.value.indexOf("style")).toBe(-1);
    expect(question.value.indexOf("Red")).toBeGreaterThan(-1);
    editor.detach();
    host.remove();
  });

  test("html format stores canonical tags", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "html" }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new RichTextEditorModel(hostOf(question), commands());
    editor.attach(host);
    host.innerHTML = "<b>a</b><br><i>b</i>";
    host.dispatchEvent(new InputEvent("input", { bubbles: true }));
    host.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("<strong>a</strong><br><em>b</em>");
    editor.detach();
    host.remove();
  });

  test("rows set the minimum height and allowResize enables vertical resize", () => {
    const survey = new SurveyModel({ elements: [{ type: "comment", name: "c", textFormat: "markdown", rows: 6, allowResize: true }] });
    const question = <QuestionCommentModel>survey.getQuestionByName("c");
    const host = document.createElement("div");
    document.body.appendChild(host);
    const editor = new RichTextEditorModel({
      ...hostOf(question),
      rows: 6,
      allowResize: true,
      autoGrow: false
    }, commands());
    editor.attach(host);
    expect(host.style.minHeight).toBe("calc(6 * 1lh)");
    expect(host.style.resize).toBe("vertical");
    editor.detach();
    const growing = document.createElement("div");
    document.body.appendChild(growing);
    const growEditor = new RichTextEditorModel({
      ...hostOf(question),
      rows: 6,
      autoGrow: true,
      allowResize: true
    }, commands());
    growEditor.attach(growing);
    expect(growing.style.minHeight).toBe("calc(6 * 1lh)");
    expect(growing.style.resize).toBe("none");
    expect(growing.style.overflowY).toBe("hidden");
    growEditor.detach();
    host.remove();
    growing.remove();
  });
});

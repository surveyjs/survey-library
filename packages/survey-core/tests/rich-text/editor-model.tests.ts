import { afterEach, describe, expect, test, vi } from "vitest";
import { Serializer } from "../../src/jsonobject";
import { SurveyModel } from "../../src/survey";
import { settings } from "../../src/settings";
import { RichTextEditorModel } from "../../src/plugins/rich-text/editor-model";
import { RichText } from "../../src/plugins/rich-text/api";
import { QuestionRichTextModel } from "../../src/plugins/rich-text/question";
import "../../src/plugins/rich-text/index";

function mount(question: QuestionRichTextModel, mode?: "inline" | "block"): { element: HTMLDivElement, model: RichTextEditorModel } {
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
  test("importing the plugin registers the richtext question and its renderer", () => {
    expect(Serializer.findProperty("comment", "allowRichText")).toBeFalsy();
    expect(Serializer.findProperty("comment", "richTextToolbarMode")).toBeFalsy();
    const question = new QuestionRichTextModel("c");
    expect(question.getType()).toBe("richtext");
    expect(question.getComponentName()).toBe("sv-rich-text");
    expect(question.richTextToolbarMode).toBe("static");
  });

  test("toggle state is all, none, or mixed from the selection", () => {
    const question = new QuestionRichTextModel("c");
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
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
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

  test("shortcuts dispatch the same commands", () => {
    const calls: string[] = [];
    const question = new QuestionRichTextModel("c");
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
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "u", ctrlKey: true }));
    expect(calls).toEqual(["bold", "italic", "underline"]);
    model.detach();
  });

  test("blur commits sanitized html and focus without input does not", () => {
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
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
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c", textUpdateMode: "onTyping" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
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
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
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
    const question = new QuestionRichTextModel("c");
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
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
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

  test("Enter at the end of a line keeps the line and moves the caret below it", () => {
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
    const { element, model } = mount(question);
    element.innerHTML = "ab";
    const caret = document.createRange();
    caret.selectNodeContents(element);
    caret.collapse(false);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(caret);
    model.syncSelection();
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", cancelable: true }));
    const blocks = element.children;
    expect(blocks.length).toBe(2);
    expect(blocks[0].textContent).toBe("ab");
    expect(blocks[1].innerHTML.toLowerCase()).toBe("<br>");
    const selection = document.getSelection().getRangeAt(0);
    expect(blocks[1] === selection.startContainer || blocks[1].contains(selection.startContainer)).toBe(true);
  });

  test("content-agnostic attachEditor does not write a value", () => {
    const element = document.createElement("div");
    document.body.appendChild(element);
    element.innerHTML = "keep";
    const handle = RichText.attachEditor(element, { mode: "inline" });
    expect(handle.toolbar.actions.length).toBeGreaterThan(0);
    expect(new RichTextEditorModel(undefined, { mode: "inline", contentAgnostic: true }).toolbarMode).toBe("onSelection");
    element.dispatchEvent(new Event("input"));
    element.dispatchEvent(new FocusEvent("blur"));
    expect(element.innerHTML).toBe("keep");
    handle.detach();
  });

  test("unsupported html stays in source mode until edit anyway, and a plain blur does not rewrite it", () => {
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
    question.value = "<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>";
    const model = new RichTextEditorModel(question);
    expect(model.sourceMode).toBe(true);
    model.editAnyway();
    expect(model.sourceMode).toBe(false);
    const element = document.createElement("div");
    document.body.appendChild(element);
    model.attach(element);
    element.dispatchEvent(new FocusEvent("focus"));
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("<p style=\"color:red\">Red</p><table><tr><td>cell</td></tr></table>");
    expect(model.sourceMode).toBe(true);
  });

  test("paste drops unsupported formatting and keeps the text", () => {
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
    const { element, model } = mount(question);
    element.focus();
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(true);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(range);
    model.syncSelection();
    const event = new Event("paste", { cancelable: true });
    Object.defineProperty(event, "clipboardData", {
      value: {
        getData: (type: string): string => type === "text/html"
          ? "<p style=\"color:red\">Hi</p><table><tr><td>cell</td></tr></table>"
          : "Hi cell"
      }
    });
    element.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(element.innerHTML.toLowerCase()).not.toContain("table");
    expect(element.innerHTML.toLowerCase()).not.toContain("color");
    expect(element.textContent).toContain("Hi");
    expect(element.textContent).toContain("cell");
  });

  test("the counter uses visible characters and typing stops at the limit", () => {
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c", maxLength: 3 }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
    const { element, model } = mount(question);
    element.innerHTML = "<strong>ab</strong>";
    element.dispatchEvent(new Event("input"));
    expect(question.characterCounter.remainingCharacterCounter).toBe("2/3");
    selectText(element, model, "ab", "ab");
    model.run("bold");
    expect(question.characterCounter.remainingCharacterCounter).toBe("2/3");
    const caret = document.createRange();
    caret.selectNodeContents(element);
    caret.collapse(false);
    document.getSelection().removeAllRanges();
    document.getSelection().addRange(caret);
    model.syncSelection();
    const blocked = new Event("beforeinput", { cancelable: true });
    Object.defineProperty(blocked, "inputType", { value: "insertText" });
    Object.defineProperty(blocked, "data", { value: "cd" });
    element.dispatchEvent(blocked);
    expect(blocked.defaultPrevented).toBe(true);
  });

  test("clear formatting turns list items into paragraphs", () => {
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
    question.value = "<ul><li>one</li><li>two</li></ul>";
    const { element, model } = mount(question);
    selectText(element, model, "one", "two");
    model.run("removeFormat");
    element.dispatchEvent(new FocusEvent("blur"));
    expect(question.value).toBe("<p>one</p><p>two</p>");
  });

  test("static is the default; none hides the toolbar and still runs shortcuts", () => {
    const question = new QuestionRichTextModel("c");
    expect(question.richTextToolbarMode).toBe("static");
    const calls: string[] = [];
    const element = document.createElement("div");
    document.body.appendChild(element);
    const model = new RichTextEditorModel(question, {
      commands: { exec: (command: string) => { calls.push(command); } }
    });
    model.attach(element);
    expect(model.toolbarMode).toBe("static");
    expect(model.hasToolbar).toBe(true);
    expect(model.toolbarOpen).toBe(false);
    question.richTextToolbarMode = "none";
    expect(model.toolbarMode).toBe("none");
    expect(model.hasToolbar).toBe(false);
    element.innerHTML = "ab";
    selectText(element, model, "ab", "ab");
    element.dispatchEvent(new KeyboardEvent("keydown", { key: "b", ctrlKey: true }));
    expect(calls).toEqual(["bold"]);
    expect(model.toolbarOpen).toBe(false);
    model.detach();
  });

  test("the static toolbar uses small actions and 24px icons; other modes stay at 16px", () => {
    const floating = new QuestionRichTextModel("floating");
    floating.richTextToolbarMode = "onFocus";
    const floatingModel = new RichTextEditorModel(floating);
    const floatingBold = floatingModel.toolbar.actions.filter(action => action.id === "rich-text-bold")[0];
    expect(floatingBold.iconSize).toBe(16);
    expect(floatingBold.iconName).toBe("icon-rich-text-bold-16x16");
    expect(floatingBold.getActionBarItemCss().split(" ")).toContain("sd-action--x-small");

    const question = new QuestionRichTextModel("c");
    const element = document.createElement("div");
    document.body.appendChild(element);
    const model = new RichTextEditorModel(question);
    model.attach(element);
    const bold = model.toolbar.actions.filter(action => action.id === "rich-text-bold")[0];
    expect(model.toolbarMode).toBe("static");
    expect(bold.iconSize).toBe(24);
    expect(bold.iconName).toBe("icon-rich-text-bold-24x24");
    expect(bold.getActionBarItemCss().split(" ")).toContain("sd-action--small");
    expect(model.toolbar.sizeMode).toBe("small");

    question.richTextToolbarMode = "onFocus";
    expect(bold.iconSize).toBe(16);
    expect(bold.iconName).toBe("icon-rich-text-bold-16x16");
    expect(bold.getActionBarItemCss().split(" ")).toContain("sd-action--x-small");
    model.detach();
  });

  test("onSelection opens the toolbar for a selection and keeps it for the toolbar and the link dialog", () => {
    const previous = settings.showDialog;
    let dialog: any;
    settings.showDialog = ((options: any): any => {
      dialog = options;
      return undefined;
    }) as any;
    const question = new QuestionRichTextModel("c");
    question.richTextToolbarMode = "onSelection";
    const box = document.createElement("div");
    box.className = "sd-rich-text sd-rich-text--toolbar-on-selection";
    const element = document.createElement("div");
    const button = document.createElement("button");
    box.appendChild(element);
    box.appendChild(button);
    document.body.appendChild(box);
    const model = new RichTextEditorModel(question);
    try {
      model.attach(element);
      element.innerHTML = "abcdef";
      expect(model.toolbarMode).toBe("onSelection");
      expect(model.toolbarOpen).toBe(false);

      selectText(element, model, "abc", "abc");
      expect(model.toolbarOpen).toBe(true);
      const caret = document.getSelection().getRangeAt(0);
      caret.collapse(false);
      document.getSelection().removeAllRanges();
      document.getSelection().addRange(caret);
      model.syncSelection();
      expect(model.toolbarOpen).toBe(false);

      selectText(element, model, "abc", "abc");
      element.dispatchEvent(new FocusEvent("blur", { relatedTarget: button }));
      document.getSelection().removeAllRanges();
      model.syncSelection();
      expect(model.toolbarOpen).toBe(true);
      box.dispatchEvent(new FocusEvent("focusout", { bubbles: true }));
      expect(model.toolbarOpen).toBe(false);

      selectText(element, model, "abc", "abc");
      model.run("createLink");
      document.getSelection().removeAllRanges();
      model.syncSelection();
      expect(model.toolbarOpen).toBe(true);
      element.focus();
      dialog.onHide();
      expect(model.toolbarOpen).toBe(false);
    } finally {
      settings.showDialog = previous;
      model.detach();
    }
  });

  test("the link dialog validates the url and stores a safe link", () => {
    const previous = settings.showDialog;
    const survey = new SurveyModel({ elements: [{ type: "richtext", name: "c" }] });
    const question = survey.getQuestionByName("c") as QuestionRichTextModel;
    question.value = "read this";
    let options: any;
    settings.showDialog = ((dialog: any): any => {
      options = dialog;
      return undefined;
    }) as any;
    try {
      const { element, model } = mount(question);
      expect(model.toolbar.actions.filter(action => action.id === "rich-text-link")[0].visible).toBe(true);
      selectText(element, model, "this", "this");
      model.run("createLink");
      const url = options.data.survey.getQuestionByName("url");
      url.value = "javascript:alert(1)";
      expect(options.onApply()).toBe(false);
      expect(url.errors.length).toBeGreaterThan(0);
      url.value = "https://surveyjs.io";
      expect(options.onApply()).toBe(true);
      element.dispatchEvent(new FocusEvent("blur"));
      expect(question.value).toBe("read <a href=\"https://surveyjs.io\" target=\"_blank\" rel=\"noopener noreferrer\">this</a>");
    } finally {
      settings.showDialog = previous;
    }
  });
});

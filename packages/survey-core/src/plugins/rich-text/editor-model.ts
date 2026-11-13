import { ActionContainer, DomDocumentHelper, DomWindowHelper, settings, SurveyModel } from "survey-core";
import { richTextCss } from "./defaultCss";
import { QuestionRichTextModel } from "./question";
import type { IDialogOptions } from "survey-core";
import DefaultLightPanelless from "../../themes/default-light-panelless";
import { getRichTextString } from "./rich-text-strings";
import { escapeHref, escapeText } from "./runs";
import { getDisallowedHtml, hrefScheme, sanitizeHtml, schemeAllowed } from "./sanitizer";
import { applyRichTextToolbarChrome, createRichTextToolbar, RichTextCommand } from "./toolbar";

export type ToggleState = "all" | "none" | "mixed";

export interface IRichTextCommandAdapter {
  exec(command: string, value?: string): void;
}

export interface IRichTextEditorOptions {
  mode?: "inline" | "block";
  contentAgnostic?: boolean;
  onInput?: () => void;
  commands?: IRichTextCommandAdapter;
}

const MARKS: { [command: string]: string[] } = {
  bold: ["strong", "b"],
  italic: ["em", "i"],
  underline: ["u"],
  strikeThrough: ["s", "strike", "del"]
};

export class RichTextEditorModel {
  public toolbar: ActionContainer;
  public readonly mode: "inline" | "block";
  private readonly question?: QuestionRichTextModel;
  private readonly contentAgnostic: boolean;
  private readonly onInputCallback?: () => void;
  private readonly commands?: IRichTextCommandAdapter;
  private element: HTMLElement | undefined;
  private saved: Range | undefined;
  private dirty = false;
  private focused = false;
  private writing = false;
  private lastCommitted: string | undefined;
  private deferred: string | undefined;
  private timer: any;
  private editAnywayFlag = false;
  private sourceValue: string | undefined;
  private sourceFlag = false;
  private normalizing = false;
  private selectionOpen = false;
  private toolbarHeld = false;
  private linkDialogOpen = false;
  private toolbarOpenState = false;
  private box: HTMLElement | undefined;
  public onState?: () => void;
  private onSelectionChange = (): void => this.rememberSelection();
  private onProperty = (sender: any, options: { name: string }): void => {
    if (options.name === "value")this.onExternalValue();
    if (options.name === "richTextToolbarMode")this.onToolbarMode();
  };
  private onBoxFocusOut = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (this.box && next && this.box.contains(next)) return;
    if (this.linkDialogOpen || !this.toolbarHeld) return;
    this.finishBlur();
  };
  private previousDesignMode: (() => void) | undefined;
  private designModeHandler: (() => void) | undefined;

  public constructor(question?: QuestionRichTextModel, options?: IRichTextEditorOptions) {
    this.question = question;
    this.contentAgnostic = !question || !!options?.contentAgnostic;
    this.mode = options?.mode || (question && question.acceptCarriageReturn === false ? "inline" : "block");
    this.onInputCallback = options?.onInput;
    this.commands = options?.commands;
    this.toolbar = createRichTextToolbar(this, this.mode);
    this.applyToolbarChrome();
    this.watchDesignMode();
  }

  public get isAttached(): boolean {
    return !!this.element;
  }

  public get isEditing(): boolean {
    if (this.contentAgnostic) return true;
    return !!this.question && !this.question.isInputReadOnly;
  }

  public get displayHtml(): string {
    const value = this.question ? this.question.value : "";
    if (!value) return "";
    return sanitizeHtml(String(value), { inline: this.inline });
  }

  public get sourceMode(): boolean {
    if (this.contentAgnostic || !this.isEditing || this.editAnywayFlag) return false;
    return this.sourceFor(this.currentValue());
  }

  public get sourceNotice(): string {
    return getRichTextString("richTextSourceMode");
  }

  public get editAnywayLabel(): string {
    return getRichTextString("richTextEditAnyway");
  }

  public get toolbarLabel(): string {
    return getRichTextString("richTextToolbar");
  }

  public get toolbarMode(): "none" | "onFocus" | "onSelection" | "static" {
    const mode = this.question ? this.question.richTextToolbarMode : undefined;
    if (mode === "none" || mode === "onFocus" || mode === "onSelection" || mode === "static") return mode;
    // A question with no mode uses the richtext default. The string editor has no question:
    // its toolbar appears when text is selected.
    return this.question ? "static" : "onSelection";
  }

  public get hasToolbar(): boolean {
    return this.toolbarMode !== "none";
  }

  // True while the on-selection toolbar should stay open: a non-collapsed selection
  // in the editor, focus in the toolbar, or the link dialog.
  public get toolbarOpen(): boolean {
    return this.toolbarOpenState;
  }

  public get placeholder(): string {
    return this.question && this.question.renderedPlaceholder ? this.question.renderedPlaceholder : "";
  }

  public get areaStyle(): { minHeight: string, height?: string, overflow?: string } {
    const rows = this.question && this.question.rows ? this.question.rows : 4;
    const minHeight = "calc(" + rows + " * 1lh)";
    const style: { minHeight: string, height?: string, overflow?: string } = { minHeight: minHeight };
    const grow = !!this.question && this.question.renderedAutoGrow;
    if (!grow) {
      style.height = minHeight;
      style.overflow = "auto";
    }
    return style;
  }

  public editAnyway(): void {
    this.editAnywayFlag = true;
    this.notify();
  }

  public attach(element: HTMLElement): void {
    this.detach();
    this.element = element;
    element.addEventListener("keydown", this.onKeyDown);
    element.addEventListener("beforeinput", this.onBeforeInput as any);
    element.addEventListener("input", this.onInput);
    element.addEventListener("paste", this.onPaste as any);
    element.addEventListener("focus", this.onFocus);
    element.addEventListener("blur", this.onBlur);
    if (DomDocumentHelper.isAvailable()) DomDocumentHelper.addEventListener("selectionchange", this.onSelectionChange);
    this.bindBox();
    if (this.question && !this.contentAgnostic) {
      const value = this.question.value;
      this.lastCommitted = value === undefined || value === null ? undefined : String(value);
      element.innerHTML = this.displayHtml;
      this.question.onPropertyChanged.add(this.onProperty);
      this.syncEmpty();
      this.updateCounter();
    }
    this.refreshLink();
  }

  public detach(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.element) {
      this.element.removeEventListener("keydown", this.onKeyDown);
      this.element.removeEventListener("beforeinput", this.onBeforeInput as any);
      this.element.removeEventListener("input", this.onInput);
      this.element.removeEventListener("paste", this.onPaste as any);
      this.element.removeEventListener("focus", this.onFocus);
      this.element.removeEventListener("blur", this.onBlur);
    }
    if (DomDocumentHelper.isAvailable()) DomDocumentHelper.removeEventListener("selectionchange", this.onSelectionChange);
    this.unbindBox();
    if (this.question)this.question.onPropertyChanged.remove(this.onProperty);
    this.element = undefined;
    this.saved = undefined;
  }

  public dispose(): void {
    this.detach();
    this.unwatchDesignMode();
  }

  public run(command: RichTextCommand): void {
    if (!this.element) return;
    const action = this.toolbar.actions.filter(item => item.id && item.id.indexOf(commandId(command)) >= 0)[0];
    if (action && action.visible === false) return;
    if (command === "createLink") {
      this.openLinkDialog();
      return;
    }
    this.restoreSelection();
    if (this.commands) {
      this.commands.exec(command);
    } else {
      this.apply(command);
    }
    this.afterEdit();
  }

  public toggleState(command: "bold" | "italic" | "underline" | "strikeThrough" | "insertUnorderedList" | "insertOrderedList"): ToggleState {
    if (!this.element || !this.saved) return "none";
    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      const tag = command === "insertUnorderedList" ? "ul" : "ol";
      return listToggleState(this.element, this.saved, tag);
    }
    return this.markState(this.saved, MARKS[command]);
  }

  public syncSelection(): void {
    this.rememberSelection();
  }

  public keepSelection = (event: any): void => {
    if (event && event.preventDefault) event.preventDefault();
  };

  private get inline(): boolean {
    return this.mode === "inline";
  }

  private onKeyDown = (event: KeyboardEvent): void => {
    const meta = event.ctrlKey || event.metaKey;
    const key = (event.key || "").toLowerCase();
    if (meta && key === "b") {
      event.preventDefault();
      this.run("bold");
      return;
    }
    if (meta && key === "i") {
      event.preventDefault();
      this.run("italic");
      return;
    }
    if (meta && key === "u") {
      event.preventDefault();
      this.run("underline");
      return;
    }
    if (key === "tab") return;
    if ((key === "backspace" || key === "delete") && !meta && !event.altKey && this.mode !== "inline" && this.element) {
      this.rememberSelection();
      if (this.saved && editListKey(this.element, this.saved, key)) {
        event.preventDefault();
        this.afterEdit();
        return;
      }
    }
    if (key !== "enter" || !this.element) return;
    if (this.mode === "inline") {
      const question = this.question as any;
      const advance = question && typeof question.isAutoAdvanceEnter === "function" && question.isAutoAdvanceEnter(event);
      event.preventDefault();
      if (advance && !question.isEmpty() && typeof question.requestAutoAdvance === "function") question.requestAutoAdvance();
      return;
    }
    event.preventDefault();
    // The caret is already in the editor. Restoring an older range would split somewhere else.
    this.rememberSelection();
    if (!this.saved) return;
    editEnter(this.element, this.saved, !!event.shiftKey);
    this.afterEdit();
  };

  private onBeforeInput = (event: any): void => {
    const max = this.limit();
    if (!max || !this.element) return;
    const type = event.inputType || "";
    if (type.indexOf("insert") !== 0) return;
    const current = this.currentVisible();
    const selected = this.saved ? Math.min(rangeVisibleLength(this.saved), current.length) : 0;
    const room = max - (current.length - selected);
    const data = event.data || "";
    if (room <= 0 || data && data.length > room) {
      if (event.preventDefault) event.preventDefault();
    }
  };

  private onPaste = (event: any): void => {
    if (!this.element) return;
    const data = event.clipboardData;
    if (!data || !data.getData) return;
    if (event.preventDefault) event.preventDefault();
    this.restoreSelection();
    const html = data.getData("text/html");
    const text = data.getData("text/plain") || "";
    if (html)this.insertHtml(this.clip(sanitizeHtml(html, { inline: this.inline, paste: true })));
    else this.insertPlain(this.clip(escapePlain(text)));
    this.afterEdit();
  };

  private onInput = (): void => {
    if (this.normalizing) return;
    this.afterEdit();
  };

  private onFocus = (): void => {
    this.focused = true;
    this.toolbarHeld = false;
    this.sourceValue = undefined;
    this.refreshLink();
    this.syncEmpty();
    this.refreshToolbarOpen();
  };

  private onBlur = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && this.element && dialogRoot(this.element).contains(next)) {
      this.toolbarHeld = true;
      this.refreshToolbarOpen();
      return;
    }
    this.finishBlur();
  };

  private finishBlur(): void {
    this.focused = false;
    this.toolbarHeld = false;
    this.selectionOpen = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    if (this.dirty)this.commit();
    this.dirty = false;
    this.editAnywayFlag = false;
    if (this.deferred !== undefined) {
      const next = this.deferred;
      this.deferred = undefined;
      this.renderValue(next);
    }
    if (this.sourceMode)this.notify();
    this.refreshToolbarOpen();
  }

  private scheduleCommit(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.timer = undefined;
      if (this.dirty)this.commit();
    }, 200);
  }

  private commit(): void {
    if (!this.element || !this.question || this.contentAgnostic) return;
    const html = sanitizeHtml(this.element.innerHTML, { inline: this.inline });
    const current = this.question.value === undefined || this.question.value === null ? "" : String(this.question.value);
    if (html === current || html === this.lastCommitted && current === html) return;
    if (html === current) return;
    this.lastCommitted = html;
    this.writing = true;
    this.question.value = html;
    this.writing = false;
    this.updateCounter();
  }

  private onExternalValue(): void {
    if (this.writing || !this.question) return;
    this.editAnywayFlag = false;
    this.sourceValue = undefined;
    const next = this.currentValue();
    if (next === this.lastCommitted) return;
    if (this.focused) {
      this.deferred = next;
      return;
    }
    this.renderValue(next);
    this.notify();
  }

  private renderValue(value: string): void {
    if (!this.element) return;
    this.lastCommitted = value;
    this.element.innerHTML = value ? sanitizeHtml(value, { inline: this.inline }) : "";
    this.dirty = false;
    this.syncEmpty();
    this.updateCounter();
  }

  private rememberSelection(): void {
    if (!this.element || !DomWindowHelper.isAvailable()) return;
    const selection = DomWindowHelper.getSelection();
    if (!selection || selection.rangeCount === 0) {
      this.selectionOpen = false;
      this.refreshToolbarOpen();
      return;
    }
    const range = selection.getRangeAt(0);
    if (!this.element.contains(range.commonAncestorContainer)) {
      this.selectionOpen = false;
      this.refreshToolbarOpen();
      return;
    }
    this.saved = range.cloneRange();
    this.updatePressed();
    this.selectionOpen = !range.collapsed;
    this.refreshToolbarOpen();
  }

  private restoreSelection(): void {
    if (!this.element || !this.saved) return;
    this.element.focus();
    selectRange(this.saved);
  }

  private updatePressed(): void {
    const commands: Array<"bold" | "italic" | "underline" | "strikeThrough" | "insertUnorderedList" | "insertOrderedList"> = [
      "bold", "italic", "underline", "strikeThrough", "insertUnorderedList", "insertOrderedList"
    ];
    for (let i = 0; i < this.toolbar.actions.length; i++) {
      const action = this.toolbar.actions[i];
      const command = commands.filter(item => action.id === commandId(item))[0];
      if (!command) continue;
      const pressed = this.toggleState(command) === "all";
      action.ariaPressed = pressed;
      action.active = pressed;
    }
  }

  private apply(command: RichTextCommand): void {
    if (!this.element || !this.saved) return;
    const range = this.saved;
    if (command === "bold" || command === "italic" || command === "underline" || command === "strikeThrough") {
      const tags = MARKS[command];
      const remove = this.markState(range, tags) === "all";
      replaceRange(range, markHtml(range, tags, remove));
    } else if (command === "insertUnorderedList" || command === "insertOrderedList") {
      if (this.mode === "inline") return;
      const tag = command === "insertUnorderedList" ? "ul" : "ol";
      applyListCommand(this.element, range, tag);
    } else if (command === "removeFormat") {
      const items = listItemsOverlapping(this.element, range);
      if (items.length) convertItemsToParagraphs(items);
      else replaceRange(range, clearHtml(range));
    }
    this.rememberSelection();
  }

  private markState(range: Range, tags: string[]): ToggleState {
    if (!this.element) return "none";
    if (range.collapsed) return closest(range.startContainer, this.element, tags) ? "all" : "none";
    const nodes = textNodes(this.element, range);
    if (nodes.length === 0) return "none";
    let all = true;
    let none = true;
    for (let i = 0; i < nodes.length; i++) {
      if (closest(nodes[i], this.element, tags)) none = false;
      else all = false;
    }
    if (all) return "all";
    if (none) return "none";
    return "mixed";
  }

  private afterEdit(): void {
    this.dirty = true;
    this.syncEmpty();
    this.updateCounter();
    this.rememberSelection();
    if (this.onInputCallback)this.onInputCallback();
    if (this.question && this.question.isInputTextUpdate)this.scheduleCommit();
  }

  private refreshLink(): void {
    const action = this.toolbar.actions.filter(item => item.id === "rich-text-link")[0];
    if (action) action.visible = typeof settings.showDialog === "function";
  }

  private openLinkDialog(): void {
    if (!this.element || typeof settings.showDialog !== "function") return;
    this.linkDialogOpen = true;
    this.refreshToolbarOpen();
    this.restoreSelection();
    const range = this.saved;
    const existing = range ? linkContaining(range, this.element) : undefined;
    const survey = new SurveyModel({
      showQuestionNumbers: "off",
      questionErrorLocation: "bottom",
      showNavigationButtons: "none",
      elements: [{ type: "text", name: "url", title: getRichTextString("richTextLinkUrl"), placeholder: getRichTextString("richTextLinkPlaceholder"), textUpdateMode: "onTyping" }]
    });
    survey.applyTheme(DefaultLightPanelless);
    const urlQuestion = survey.getQuestionByName("url");
    if (existing) urlQuestion.value = existing.getAttribute("href") || "";
    const root = dialogRoot(this.element);
    settings.showDialog(<IDialogOptions>{
      componentName: "survey",
      data: { model: survey, survey: survey },
      title: getRichTextString("richTextLink"),
      showCloseButton: true,
      displayMode: "popup",
      isFocusedContent: true,
      onApply: (): boolean => {
        const url = String(urlQuestion.value || "").trim();
        urlQuestion.clearErrors();
        if (url && !schemeAllowed(hrefScheme(url))) {
          urlQuestion.addError(getRichTextString("richTextLinkInvalid"));
          return false;
        }
        this.applyLink(url);
        return true;
      },
      onCancel: (): void => { this.restoreSelection(); },
      onHide: (): void => {
        this.linkDialogOpen = false;
        const doc = DomDocumentHelper.getDocument();
        const active = doc && doc.activeElement;
        if (!this.element || !active || !this.element.contains(active))this.finishBlur();
        else this.refreshToolbarOpen();
      }
    }, root);
  }

  private applyLink(url: string): void {
    if (!this.element) return;
    this.restoreSelection();
    const range = this.saved;
    if (!range) return;
    const link = linkContaining(range, this.element);
    if (!url) {
      if (link) unwrapElement(link);
      this.afterEdit();
      return;
    }
    if (link) {
      const start = textOffset(this.element, range.startContainer, range.startOffset);
      const end = textOffset(this.element, range.endContainer, range.endOffset);
      link.setAttribute("href", url);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      selectOffsets(this.element, start, end);
      this.afterEdit();
      return;
    }
    const label = range.collapsed ? url : range.toString();
    replaceRange(range, "<a href=\"" + escapeHref(url) + "\" target=\"_blank\" rel=\"noopener noreferrer\">" + escapePlain(label) + "</a>");
    this.afterEdit();
  }

  private insertHtml(html: string): void {
    if (!this.saved || !html) return;
    replaceRange(this.saved, html);
  }

  private insertPlain(html: string): void {
    if (!this.saved || !html) return;
    const doc = this.saved.startContainer.ownerDocument;
    if (!doc) return;
    selectRange(this.saved);
    const exec = (doc as any).execCommand;
    if (typeof exec === "function") {
      try {
        const text = html.replace(/<br>/g, "\n");
        if (exec.call(doc, "insertText", false, text)) return;
      } catch(e) {
        // jsdom has no editing host commands.
      }
    }
    replaceRange(this.saved, html);
  }

  private clip(html: string): string {
    const max = this.limit();
    if (!max || !this.element || !this.saved) return html;
    const current = this.currentVisible();
    const selected = Math.min(rangeVisibleLength(this.saved), current.length);
    const room = max - (current.length - selected);
    if (room <= 0) return "";
    const doc = this.element.ownerDocument;
    if (!doc) return html;
    const holder = doc.createElement("div");
    holder.innerHTML = html;
    if (isVisuallyEmpty(holder) || visibleText(holder).length <= room) return html;
    return escapePlain(visibleText(holder).slice(0, room));
  }

  private currentVisible(): string {
    if (!this.element || isVisuallyEmpty(this.element)) return "";
    return visibleText(this.element);
  }

  private syncEmpty(): void {
    if (this.normalizing || !this.element || !isVisuallyEmpty(this.element)) return;
    if (!this.element.innerHTML) return;
    // An empty list item is a place to type, not the placeholder break.
    if (this.element.querySelector("ul, ol")) return;
    this.normalizing = true;
    this.element.innerHTML = "";
    this.normalizing = false;
  }

  private updateCounter(): void {
    const max = this.limit();
    if (!max || !this.question) return;
    const text = this.element ? this.currentVisible() : "";
    this.question.characterCounter.updateRemainingCharacterCounter(text, max);
  }

  private limit(): number {
    if (!this.question || this.contentAgnostic) return 0;
    const max = this.question.getMaxLength();
    return typeof max === "number" && max > 0 ? max : 0;
  }

  private currentValue(): string {
    if (!this.question || this.question.value === undefined || this.question.value === null) return "";
    return String(this.question.value);
  }

  private sourceFor(value: string): boolean {
    if (this.sourceValue !== value) {
      this.sourceValue = value;
      this.sourceFlag = getDisallowedHtml(value).length > 0;
    }
    return this.sourceFlag;
  }

  private onToolbarMode(): void {
    this.applyToolbarChrome();
    this.toolbarOpenState = this.isToolbarOpen();
    this.notify();
  }

  private applyToolbarChrome(): void {
    applyRichTextToolbarChrome(this.toolbar, this.toolbarMode === "static" ? "static" : "floating");
  }

  private isToolbarOpen(): boolean {
    return this.toolbarMode === "onSelection" && (this.selectionOpen || this.toolbarHeld || this.linkDialogOpen);
  }

  private refreshToolbarOpen(): void {
    const open = this.isToolbarOpen();
    if (open === this.toolbarOpenState) return;
    this.toolbarOpenState = open;
    this.notify();
  }

  private bindBox(): void {
    this.unbindBox();
    if (!this.element || !this.element.closest) return;
    const box = this.element.closest("." + richTextCss.editor) as HTMLElement | null;
    if (!box) return;
    this.box = box;
    box.addEventListener("focusout", this.onBoxFocusOut);
  }

  private unbindBox(): void {
    if (!this.box) return;
    this.box.removeEventListener("focusout", this.onBoxFocusOut);
    this.box = undefined;
  }

  private notify(): void {
    if (!this.onState) return;
    const callback = this.onState;
    setTimeout(callback, 0);
  }

  private watchDesignMode(): void {
    const question = this.question;
    if (!question || this.designModeHandler) return;
    this.previousDesignMode = question.onDesignModeChanged;
    const handler = (): void => {
      if (this.previousDesignMode)this.previousDesignMode.call(question);
      this.notify();
    };
    this.designModeHandler = handler;
    question.onDesignModeChanged = handler;
  }

  private unwatchDesignMode(): void {
    const question = this.question;
    if (question && this.designModeHandler && question.onDesignModeChanged === this.designModeHandler) {
      question.onDesignModeChanged = this.previousDesignMode || ((): void => { });
    }
    this.designModeHandler = undefined;
    this.previousDesignMode = undefined;
  }
}

function commandId(command: string): string {
  if (command === "bold") return "rich-text-bold";
  if (command === "italic") return "rich-text-italic";
  if (command === "underline") return "rich-text-underline";
  if (command === "strikeThrough") return "rich-text-strikethrough";
  if (command === "createLink") return "rich-text-link";
  if (command === "insertUnorderedList") return "rich-text-list-bulleted";
  if (command === "insertOrderedList") return "rich-text-list-numbered";
  return "rich-text-clear";
}

function closest(node: Node, root: HTMLElement, tags: string[]): Element | undefined {
  let current: Node | null = node.nodeType === 1 ? node : node.parentNode;
  while(current && current !== root) {
    if (current.nodeType === 1 && tags.indexOf((current as Element).tagName.toLowerCase()) >= 0) return current as Element;
    current = current.parentNode;
  }
  return undefined;
}

function textNodes(root: HTMLElement, range: Range): Text[] {
  const doc = root.ownerDocument;
  if (!doc) return [];
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let node = walker.nextNode();
  while(node) {
    if (node.textContent && overlaps(range, node as Text)) nodes.push(node as Text);
    node = walker.nextNode();
  }
  return nodes;
}

function overlaps(range: Range, node: Text): boolean {
  if (range.startContainer === node || range.endContainer === node) {
    const length = (node.textContent || "").length;
    const start = range.startContainer === node ? range.startOffset : 0;
    const end = range.endContainer === node ? range.endOffset : length;
    return end > start;
  }
  try {
    return range.intersectsNode(node);
  } catch(e) {
    return false;
  }
}

function markHtml(range: Range, tags: string[], remove: boolean): string {
  const doc = range.startContainer.ownerDocument;
  const contents = range.extractContents();
  if (remove) unwrap(contents, tags);
  else {
    const wrapper = doc.createElement(tags[0]);
    wrapper.appendChild(contents);
    return wrapper.outerHTML;
  }
  return htmlOf(contents);
}

function clearHtml(range: Range): string {
  const contents = range.cloneContents();
  unwrap(contents, ["strong", "b", "em", "i", "u", "s", "strike", "del", "a", "ul", "ol", "li"]);
  return htmlOf(contents);
}

function unwrap(root: Node, tags: string[]): void {
  const doc = root.ownerDocument;
  if (!doc) return;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
  const found: Element[] = [];
  let node = walker.nextNode();
  while(node) {
    if (tags.indexOf((node as Element).tagName.toLowerCase()) >= 0) found.push(node as Element);
    node = walker.nextNode();
  }
  for (let i = found.length - 1; i >= 0; i--) {
    const element = found[i];
    const parent = element.parentNode;
    if (!parent) continue;
    while(element.firstChild) parent.insertBefore(element.firstChild, element);
    parent.removeChild(element);
  }
}

function htmlOf(node: Node): string {
  const doc = node.ownerDocument;
  const holder = doc.createElement("div");
  holder.appendChild(node);
  return holder.innerHTML;
}

function replaceRange(range: Range, html: string): void {
  const doc = range.startContainer.ownerDocument;
  selectRange(range);
  const exec = (doc as any).execCommand;
  if (typeof exec === "function") {
    try {
      exec.call(doc, "styleWithCSS", false, "false");
      if (exec.call(doc, "insertHTML", false, html)) return;
    } catch(e) {
      // jsdom has no editing host commands.
    }
  }
  range.deleteContents();
  const holder = doc.createElement("div");
  holder.innerHTML = html;
  const frag = doc.createDocumentFragment();
  while(holder.firstChild) frag.appendChild(holder.firstChild);
  range.insertNode(frag);
}

function selectRange(range: Range): void {
  if (!DomWindowHelper.isAvailable()) return;
  const selection = DomWindowHelper.getSelection();
  if (!selection) return;
  selection.removeAllRanges();
  selection.addRange(range);
}

interface DomPoint {
  node: Node;
  offset: number;
}
interface Locator {
  path: number[];
  text: number;
  br: number;
}
interface Line {
  html: string;
  text: string;
  empty: boolean;
  selected: boolean;
  caret: boolean;
}
interface Block {
  type: "para" | "list";
  listTag?: "ul" | "ol";
  listId?: number;
  wrap?: boolean;
  originalHtml?: string;
  lines: Line[];
}

// One insertHTML, so the browser records the change as a single undo step.
function commitCopy(root: HTMLElement, range: Range, mutate: (copy: HTMLElement, mapped: Range) => DomPoint): void {
  const doc = root.ownerDocument;
  const copy = doc.createElement("div");
  copy.innerHTML = root.innerHTML;
  const mapped = doc.createRange();
  const start = pointFromLocator(copy, locatorFrom(root, { node: range.startContainer, offset: range.startOffset }));
  const end = pointFromLocator(copy, locatorFrom(root, { node: range.endContainer, offset: range.endOffset }));
  mapped.setStart(start.node, start.offset);
  mapped.setEnd(end.node, end.offset);
  const point = mutate(copy, mapped);
  const caret = locatorFrom(copy, point);
  replaceElementContents(root, copy.innerHTML);
  const live = pointFromLocator(root, caret);
  const next = doc.createRange();
  next.setStart(live.node, Math.min(live.offset, nodeLength(live.node)));
  next.collapse(true);
  selectRange(next);
}

function editEnter(root: HTMLElement, range: Range, shift: boolean): void {
  commitCopy(root, range, (copy, mapped) => {
    if (!mapped.collapsed) {
      mapped.deleteContents();
      mapped.collapse(true);
    }
    if (shift) return insertBreakPoint(mapped);
    return splitBlockPoint(copy, mapped);
  });
}

function editListKey(root: HTMLElement, range: Range, key: string): boolean {
  if (!range.collapsed) {
    if (!closest(range.startContainer, root, ["li"]) && !closest(range.endContainer, root, ["li"])) return false;
    commitCopy(root, range, (copy, mapped) => {
      mapped.deleteContents();
      mapped.collapse(true);
      return { node: mapped.startContainer, offset: mapped.startOffset };
    });
    return true;
  }
  const item = closest(range.startContainer, root, ["li"]) as HTMLElement | undefined;
  if (!item) return false;
  if (key === "backspace" && atEdge(item, range, "start")) {
    commitCopy(root, range, (copy, mapped) => {
      const copyItem = closest(mapped.startContainer, copy, ["li"]) as HTMLElement;
      if (siblingItem(copyItem, "prev")) return joinWithPrevious(copyItem);
      return liftFirstItem(copyItem);
    });
    return true;
  }
  if (key === "delete" && atEdge(item, range, "end")) {
    const list = item.parentElement;
    if (!list || siblingItem(item, "next") || !paragraphAfter(list)) return false;
    commitCopy(root, range, (copy, mapped) => {
      const copyItem = closest(mapped.startContainer, copy, ["li"]) as HTMLElement;
      return joinNextParagraph(copyItem);
    });
    return true;
  }
  return false;
}

function applyListCommand(root: HTMLElement, range: Range, tag: "ul" | "ol"): void {
  const start = textOffset(root, range.startContainer, range.startOffset);
  const end = textOffset(root, range.endContainer, range.endOffset);
  const blocks = readBlocks(root, range);
  if (blocks.length === 0) {
    blocks.push({ type: "para", wrap: true, lines: [{ html: "", text: "", empty: true, selected: true, caret: true }] });
  }
  const state = listState(blocks, tag);
  const next = state === "all" ? removeList(blocks, tag) : applyList(blocks, tag);
  replaceElementContents(root, renderBlocks(mergeAdjacent(next)));
  const marker = root.querySelector("[data-rt-caret]");
  if (marker) {
    marker.removeAttribute("data-rt-caret");
    placeCaret(marker as HTMLElement);
    return;
  }
  selectOffsets(root, start, end);
}

function listToggleState(root: HTMLElement, range: Range, tag: "ul" | "ol"): ToggleState {
  return listState(readBlocks(root, range), tag);
}

function listState(blocks: Block[], tag: "ul" | "ol"): ToggleState {
  let selected = 0;
  let matched = 0;
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    for (let j = 0; j < block.lines.length; j++) {
      if (!block.lines[j].selected) continue;
      selected++;
      if (block.type === "list" && block.listTag === tag) matched++;
    }
  }
  if (selected === 0 || matched === 0) return "none";
  if (matched === selected) return "all";
  return "mixed";
}

function readBlocks(root: HTMLElement, range: Range): Block[] {
  let hasBlock = false;
  const children = root.childNodes;
  for (let i = 0; i < children.length; i++) {
    if (blockKind(children[i])) hasBlock = true;
  }
  if (!hasBlock) {
    if (!children.length) return [];
    return [{ type: "para", wrap: false, originalHtml: root.innerHTML, lines: linesIn(root, 0, children.length, range) }];
  }
  const blocks: Block[] = [];
  let loose: Node[] = [];
  let listId = 0;
  const flush = (): void => {
    if (!loose.length) return;
    const start = indexInParent(loose[0]);
    const end = indexInParent(loose[loose.length - 1]) + 1;
    blocks.push({
      type: "para",
      wrap: false,
      originalHtml: htmlOfNodes(loose),
      lines: linesIn(root, start, end, range)
    });
    loose = [];
  };
  for (let i = 0; i < children.length; i++) {
    const kind = blockKind(children[i]);
    if (!kind) {
      loose.push(children[i]);
      continue;
    }
    flush();
    const element = children[i] as HTMLElement;
    if (kind === "list") {
      listId++;
      blocks.push(listBlock(element, range, listId));
    } else {
      blocks.push({
        type: "para",
        wrap: true,
        originalHtml: element.outerHTML,
        lines: linesIn(element, 0, element.childNodes.length, range)
      });
    }
  }
  flush();
  return blocks;
}

function listBlock(list: HTMLElement, range: Range, listId: number): Block {
  const lines: Line[] = [];
  const items = list.children;
  for (let i = 0; i < items.length; i++) {
    if (items[i].tagName.toLowerCase() !== "li") continue;
    const item = items[i] as HTMLElement;
    const probe = item.ownerDocument.createRange();
    probe.selectNodeContents(item);
    const selected = touched(probe, range, true);
    lines.push({
      html: item.innerHTML,
      text: item.textContent || "",
      empty: !(item.textContent || "").trim(),
      selected: selected,
      caret: selected && range.collapsed
    });
  }
  return {
    type: "list",
    listTag: list.tagName.toLowerCase() === "ol" ? "ol" : "ul",
    listId: listId,
    originalHtml: list.outerHTML,
    lines: lines
  };
}

function linesIn(container: HTMLElement, start: number, end: number, range: Range): Line[] {
  const slice = container.ownerDocument.createRange();
  slice.setStart(container, start);
  slice.setEnd(container, end);
  const holder = container.ownerDocument.createElement("div");
  holder.appendChild(slice.cloneContents());
  // A block whose only content is a break is one empty line. The break holds the caret; it is not a line separator.
  if (!(holder.textContent || "").trim()) {
    const probe = container.ownerDocument.createRange();
    probe.setStart(container, start);
    probe.setEnd(container, end);
    const selected = touched(probe, range, true);
    return [{ html: holder.innerHTML, text: "", empty: true, selected: selected, caret: selected && range.collapsed }];
  }
  const ranges = lineRanges(container, start, end);
  const lines: Line[] = [];
  for (let i = 0; i < ranges.length; i++) {
    const frag = ranges[i].cloneContents();
    const text = frag.textContent || "";
    const html = htmlOf(frag);
    const empty = !text.trim();
    const selected = touched(ranges[i], range, i === ranges.length - 1);
    lines.push({ html: html, text: text, empty: empty, selected: selected, caret: selected && range.collapsed });
  }
  return lines;
}

function lineRanges(container: HTMLElement, start: number, end: number): Range[] {
  const doc = container.ownerDocument;
  const brs: HTMLElement[] = [];
  for (let i = start; i < end; i++) collectBrs(container.childNodes[i], brs);
  const ranges: Range[] = [];
  let fromNode: Node = container;
  let fromOffset = start;
  for (let i = 0; i < brs.length; i++) {
    const br = brs[i];
    const parent = br.parentNode;
    if (!parent) continue;
    const line = doc.createRange();
    line.setStart(fromNode, fromOffset);
    line.setEnd(parent, indexInParent(br));
    ranges.push(line);
    fromNode = parent;
    fromOffset = indexInParent(br) + 1;
  }
  const last = doc.createRange();
  last.setStart(fromNode, fromOffset);
  last.setEnd(container, end);
  ranges.push(last);
  return ranges;
}

function collectBrs(node: Node, brs: HTMLElement[]): void {
  if (node.nodeType !== 1) return;
  const element = node as HTMLElement;
  if (element.tagName.toLowerCase() === "br") {
    brs.push(element);
    return;
  }
  const children = element.childNodes;
  for (let i = 0; i < children.length; i++) collectBrs(children[i], brs);
}

// compareBoundaryPoints names the point on this range first and the point on the source range second:
// START_TO_END compares this end with the source start.
function comparePoints(a: Range, aEnd: boolean, b: Range, bEnd: boolean): number {
  if (!aEnd && !bEnd) return a.compareBoundaryPoints(Range.START_TO_START, b);
  if (!aEnd && bEnd) return a.compareBoundaryPoints(Range.END_TO_START, b);
  if (aEnd && !bEnd) return a.compareBoundaryPoints(Range.START_TO_END, b);
  return a.compareBoundaryPoints(Range.END_TO_END, b);
}

function touched(line: Range, selection: Range, isLast: boolean): boolean {
  const startVsEnd = comparePoints(selection, false, line, true);
  if (selection.collapsed) {
    const afterStart = comparePoints(selection, false, line, false) >= 0;
    return afterStart && (isLast ? startVsEnd <= 0 : startVsEnd < 0);
  }
  const startsBeforeEnd = startVsEnd < 0;
  const endsAfterStart = comparePoints(selection, true, line, false) > 0;
  return startsBeforeEnd && endsAfterStart;
}

function applyList(blocks: Block[], tag: "ul" | "ol"): Block[] {
  const selected = selectedLines(blocks);
  const multiple = selected.length > 1;
  const convert: number[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type !== "list" || block.listTag === tag || block.listId === undefined) continue;
    for (let j = 0; j < block.lines.length; j++) {
      if (block.lines[j].selected && convert.indexOf(block.listId) < 0) convert.push(block.listId);
    }
  }
  const out: Block[] = [];
  let pending: Line[] = [];
  const flush = (): void => {
    if (!pending.length) return;
    out.push({ type: "list", listTag: tag, lines: pending.slice() });
    pending = [];
  };
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "list") {
      const asTag = block.listTag === tag || (block.listId !== undefined && convert.indexOf(block.listId) >= 0);
      if (!asTag) {
        flush();
        out.push(block);
        continue;
      }
      for (let j = 0; j < block.lines.length; j++) pending.push(block.lines[j]);
      continue;
    }
    let any = false;
    for (let j = 0; j < block.lines.length; j++) if (block.lines[j].selected) any = true;
    if (!any) {
      flush();
      out.push(block);
      continue;
    }
    for (let j = 0; j < block.lines.length; j++) {
      const line = block.lines[j];
      if (line.selected && !(line.empty && multiple)) pending.push(line);
      else if (!(line.selected && line.empty)) {
        flush();
        out.push({ type: "para", wrap: true, lines: [line] });
      }
    }
  }
  flush();
  return out;
}

function removeList(blocks: Block[], tag: "ul" | "ol"): Block[] {
  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type !== "list" || block.listTag !== tag) {
      out.push(block);
      continue;
    }
    let group: Line[] = [];
    const flush = (): void => {
      if (!group.length) return;
      out.push({ type: "list", listTag: tag, lines: group.slice(), listId: block.listId });
      group = [];
    };
    for (let j = 0; j < block.lines.length; j++) {
      const line = block.lines[j];
      if (!line.selected) {
        group.push(line);
        continue;
      }
      flush();
      out.push({ type: "para", wrap: true, lines: [line] });
    }
    flush();
  }
  return out;
}

function selectedLines(blocks: Block[]): Line[] {
  const lines: Line[] = [];
  for (let i = 0; i < blocks.length; i++) {
    for (let j = 0; j < blocks[i].lines.length; j++) {
      if (blocks[i].lines[j].selected) lines.push(blocks[i].lines[j]);
    }
  }
  return lines;
}

function mergeAdjacent(blocks: Block[]): Block[] {
  const out: Block[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.type === "list" && block.lines.length === 0) continue;
    const prev = out[out.length - 1];
    if (block.type === "list" && prev && prev.type === "list" && prev.listTag === block.listTag) {
      prev.lines = prev.lines.concat(block.lines);
      prev.originalHtml = undefined;
      continue;
    }
    out.push(block);
  }
  return out;
}

function renderBlocks(blocks: Block[]): string {
  let html = "";
  for (let i = 0; i < blocks.length; i++) html += renderBlock(blocks[i]);
  return html;
}

function renderBlock(block: Block): string {
  const marked = caretLine(block);
  if (block.originalHtml !== undefined && !marked) return block.originalHtml;
  if (block.type === "list") {
    let html = "<" + block.listTag + ">";
    for (let i = 0; i < block.lines.length; i++) {
      const line = block.lines[i];
      html += "<li" + caretAttr(line) + ">" + lineInner(line) + "</li>";
    }
    return html + "</" + block.listTag + ">";
  }
  if (block.wrap === false && block.lines.length === 1 && !block.lines[0].caret) return block.lines[0].html;
  let inner = "";
  for (let i = 0; i < block.lines.length; i++) {
    if (i > 0) inner += "<br>";
    inner += lineInner(block.lines[i]);
  }
  const attr = block.lines.length === 1 ? caretAttr(block.lines[0]) : "";
  return "<p" + attr + ">" + inner + "</p>";
}

function caretLine(block: Block): Line | undefined {
  for (let i = 0; i < block.lines.length; i++) {
    if (block.lines[i].caret && block.lines[i].empty) return block.lines[i];
  }
  return undefined;
}

function caretAttr(line: Line): string {
  if (line.caret && line.empty) return " data-rt-caret=\"1\"";
  return "";
}

function lineInner(line: Line): string {
  if (line.empty) return "<br>";
  return line.html;
}

function replaceElementContents(root: HTMLElement, html: string): void {
  const doc = root.ownerDocument;
  const range = doc.createRange();
  range.selectNodeContents(root);
  replaceRange(range, html);
}

function insertBreakPoint(range: Range): DomPoint {
  const doc = range.startContainer.ownerDocument;
  const br = doc.createElement("br");
  range.insertNode(br);
  return { node: br.parentNode as Node, offset: indexInParent(br) + 1 };
}

function splitBlockPoint(root: HTMLElement, range: Range): DomPoint {
  const item = closest(range.startContainer, root, ["li"]);
  if (item) {
    if (!(item.textContent || "").trim()) return leaveListPoint(item as HTMLElement);
    return caretIn(splitElement(item as HTMLElement, range, "li"));
  }
  const block = closest(range.startContainer, root, ["p", "div"]);
  if (block) return caretIn(splitElement(block as HTMLElement, range, "p"));
  const doc = root.ownerDocument;
  const after = doc.createRange();
  after.selectNodeContents(root);
  after.setStart(range.endContainer, range.endOffset);
  const tail = after.extractContents();
  const before = doc.createElement("p");
  while(root.firstChild) before.appendChild(root.firstChild);
  const next = doc.createElement("p");
  next.appendChild(tail);
  root.appendChild(before);
  root.appendChild(next);
  ensureCaretLine(before);
  ensureCaretLine(next);
  return caretIn(next);
}

function splitElement(block: HTMLElement, range: Range, tag: string): HTMLElement {
  const doc = block.ownerDocument;
  const after = doc.createRange();
  after.selectNodeContents(block);
  after.setStart(range.endContainer, range.endOffset);
  const tail = after.extractContents();
  const next = doc.createElement(tag);
  next.appendChild(tail);
  if (block.parentNode) block.parentNode.insertBefore(next, block.nextSibling);
  ensureCaretLine(block);
  ensureCaretLine(next);
  return next;
}

function leaveListPoint(item: HTMLElement): DomPoint {
  const list = item.parentElement;
  const doc = item.ownerDocument;
  const paragraph = doc.createElement("p");
  paragraph.appendChild(doc.createElement("br"));
  if (list && list.parentNode) {
    const rest = doc.createElement(list.tagName.toLowerCase());
    let sibling = item.nextSibling;
    while(sibling) {
      const next = sibling.nextSibling;
      rest.appendChild(sibling);
      sibling = next;
    }
    list.parentNode.insertBefore(paragraph, list.nextSibling);
    if (rest.childNodes.length) list.parentNode.insertBefore(rest, paragraph.nextSibling);
    if (item.parentNode) item.parentNode.removeChild(item);
    if (!list.childNodes.length && list.parentNode) list.parentNode.removeChild(list);
  }
  return caretIn(paragraph);
}

function joinWithPrevious(item: HTMLElement): DomPoint {
  const prev = siblingItem(item, "prev") as HTMLElement;
  const cleared = !(prev.textContent || "").trim();
  const point = cleared ? { node: prev, offset: 0 } : endPoint(prev);
  if (cleared) while(prev.firstChild) prev.removeChild(prev.firstChild);
  while(item.firstChild) prev.appendChild(item.firstChild);
  if (item.parentNode) item.parentNode.removeChild(item);
  if (cleared) return caretIn(prev);
  return point;
}

function liftFirstItem(item: HTMLElement): DomPoint {
  const list = item.parentElement;
  const doc = item.ownerDocument;
  const paragraph = doc.createElement("p");
  while(item.firstChild) paragraph.appendChild(item.firstChild);
  if (!(paragraph.textContent || "").trim() && !paragraph.querySelector("br")) paragraph.appendChild(doc.createElement("br"));
  if (list && list.parentNode) list.parentNode.insertBefore(paragraph, list);
  if (item.parentNode) item.parentNode.removeChild(item);
  if (list && !list.childNodes.length && list.parentNode) list.parentNode.removeChild(list);
  return caretIn(paragraph);
}

function joinNextParagraph(item: HTMLElement): DomPoint {
  const list = item.parentElement;
  const para = list ? paragraphAfter(list) : undefined;
  if (!para) return caretIn(item);
  const cleared = !(item.textContent || "").trim();
  const point = cleared ? { node: item, offset: 0 } : endPoint(item);
  if (cleared) while(item.firstChild) item.removeChild(item.firstChild);
  while(para.firstChild) item.appendChild(para.firstChild);
  if (para.parentNode) para.parentNode.removeChild(para);
  if (cleared) return caretIn(item);
  return point;
}

function siblingItem(item: HTMLElement, dir: "prev" | "next"): HTMLElement | undefined {
  let node = dir === "prev" ? item.previousSibling : item.nextSibling;
  while(node) {
    if (node.nodeType === 1 && (node as HTMLElement).tagName.toLowerCase() === "li") return node as HTMLElement;
    if (node.nodeType === 1 || (node.nodeType === 3 && (node.textContent || "").trim())) return undefined;
    node = dir === "prev" ? node.previousSibling : node.nextSibling;
  }
  return undefined;
}

function paragraphAfter(list: HTMLElement): HTMLElement | undefined {
  let node = list.nextSibling;
  while(node && node.nodeType === 3 && !(node.textContent || "").trim()) node = node.nextSibling;
  if (!node || node.nodeType !== 1) return undefined;
  const tag = (node as HTMLElement).tagName.toLowerCase();
  if (tag === "p" || tag === "div") return node as HTMLElement;
  return undefined;
}

function atEdge(block: HTMLElement, range: Range, edge: "start" | "end"): boolean {
  if (!range.collapsed) return false;
  const doc = block.ownerDocument;
  const probe = doc.createRange();
  probe.selectNodeContents(block);
  if (edge === "start") probe.setEnd(range.startContainer, range.startOffset);
  else probe.setStart(range.startContainer, range.startOffset);
  if (probe.toString().length > 0) return false;
  const holder = doc.createElement("div");
  holder.appendChild(probe.cloneContents());
  return holder.querySelector("br") === null;
}

function endPoint(element: HTMLElement): DomPoint {
  const range = element.ownerDocument.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  return { node: range.startContainer, offset: range.startOffset };
}

function caretIn(element: HTMLElement): DomPoint {
  if ((element.textContent || "").trim()) {
    const text = firstText(element);
    if (text) return { node: text, offset: 0 };
  }
  const br = element.querySelector("br");
  if (br && br.parentNode) return { node: br.parentNode, offset: indexInParent(br) };
  return { node: element, offset: 0 };
}

function firstText(element: HTMLElement): Text | undefined {
  const walker = element.ownerDocument.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  let node = walker.nextNode() as Text;
  while(node) {
    if (node.textContent) return node;
    node = walker.nextNode() as Text;
  }
  return undefined;
}

function blockKind(node: Node): "list" | "para" | undefined {
  if (node.nodeType !== 1) return undefined;
  const tag = (node as HTMLElement).tagName.toLowerCase();
  if (tag === "ul" || tag === "ol") return "list";
  if (tag === "p" || tag === "div") return "para";
  return undefined;
}

function htmlOfNodes(nodes: Node[]): string {
  const doc = nodes[0].ownerDocument;
  if (!doc) return "";
  const holder = doc.createElement("div");
  for (let i = 0; i < nodes.length; i++) holder.appendChild(nodes[i].cloneNode(true));
  return holder.innerHTML;
}

function locatorFrom(root: HTMLElement, point: DomPoint): Locator {
  const scope = scopeElement(root, point.node);
  const doc = root.ownerDocument;
  const probe = doc.createRange();
  try {
    probe.selectNodeContents(scope);
    probe.setEnd(point.node, Math.min(point.offset, nodeLength(point.node)));
  } catch(e) {
    return { path: elementPath(root, scope), text: 0, br: 0 };
  }
  const holder = doc.createElement("div");
  holder.appendChild(probe.cloneContents());
  return { path: elementPath(root, scope), text: probe.toString().length, br: holder.querySelectorAll("br").length };
}

function pointFromLocator(root: HTMLElement, locator: Locator): DomPoint {
  const scope = elementFromPath(root, locator.path);
  const found = walkPoint(scope, locator, { text: 0, br: 0 });
  if (found) return found;
  return { node: scope, offset: scope.childNodes.length };
}

function walkPoint(node: Node, locator: Locator, seen: { text: number, br: number }): DomPoint | undefined {
  if (node.nodeType === 3) {
    const length = (node.textContent || "").length;
    if (seen.br === locator.br && seen.text + length >= locator.text) return { node: node, offset: locator.text - seen.text };
    seen.text += length;
    return undefined;
  }
  if (node.nodeType !== 1) return undefined;
  const element = node as HTMLElement;
  if (element.tagName.toLowerCase() === "br") {
    if (seen.br === locator.br && seen.text >= locator.text && element.parentNode) return { node: element.parentNode, offset: indexInParent(element) };
    seen.br += 1;
    return undefined;
  }
  const children = element.childNodes;
  for (let i = 0; i < children.length; i++) {
    const found = walkPoint(children[i], locator, seen);
    if (found) return found;
  }
  return undefined;
}

function scopeElement(root: HTMLElement, node: Node): HTMLElement {
  const item = closest(node, root, ["li"]);
  if (item) return item as HTMLElement;
  const block = closest(node, root, ["p", "div"]);
  if (block) return block as HTMLElement;
  return root;
}

function elementPath(root: HTMLElement, element: HTMLElement): number[] {
  const path: number[] = [];
  let current = element;
  while(current !== root) {
    const parent = current.parentElement;
    if (!parent) break;
    let index = 0;
    for (let i = 0; i < parent.children.length; i++) {
      if (parent.children[i] === current) {
        index = i;
        break;
      }
    }
    path.unshift(index);
    current = parent;
  }
  return path;
}

function elementFromPath(root: HTMLElement, path: number[]): HTMLElement {
  let current = root;
  for (let i = 0; i < path.length; i++) {
    const next = current.children[path[i]] as HTMLElement;
    if (!next) return current;
    current = next;
  }
  return current;
}

function indexInParent(node: Node): number {
  const parent = node.parentNode;
  if (!parent) return 0;
  for (let i = 0; i < parent.childNodes.length; i++) if (parent.childNodes[i] === node) return i;
  return 0;
}

function nodeLength(node: Node): number {
  return node.nodeType === 3 ? (node.textContent || "").length : node.childNodes.length;
}

function ensureCaretLine(element: HTMLElement): void {
  if ((element.textContent || "").trim()) return;
  const doc = element.ownerDocument;
  while(element.firstChild) element.removeChild(element.firstChild);
  element.appendChild(doc.createElement("br"));
}

function placeCaret(element: HTMLElement): void {
  const doc = element.ownerDocument;
  const range = doc.createRange();
  const br = !(element.textContent || "").trim() ? element.querySelector("br") : null;
  if (br) range.setStartBefore(br);
  else {
    range.selectNodeContents(element);
    range.collapse(true);
  }
  range.collapse(true);
  selectRange(range);
}

const BLOCK_TAGS: { [tag: string]: boolean } = { p: true, li: true, div: true, h1: true, h2: true, h3: true, h4: true, h5: true, h6: true };

function visibleText(root: HTMLElement): string {
  let out = "";
  const walk = (node: Node, isRoot: boolean): void => {
    if (node.nodeType === 3) {
      const text = node.textContent || "";
      if (!text) return;
      out += text;
      return;
    }
    if (node.nodeType !== 1) return;
    const tag = (node as Element).tagName.toLowerCase();
    if (tag === "br") {
      out += "\n";
      return;
    }
    if (!isRoot && BLOCK_TAGS[tag] && out) out += "\n";
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) walk(children[i], false);
  };
  walk(root, true);
  return out;
}

function isVisuallyEmpty(root: HTMLElement): boolean {
  return visibleText(root).replace(/\n/g, "").length === 0;
}

function rangeVisibleLength(range: Range): number {
  const doc = range.startContainer.ownerDocument;
  if (!doc) return 0;
  const holder = doc.createElement("div");
  holder.appendChild(range.cloneContents());
  if (isVisuallyEmpty(holder)) return 0;
  return visibleText(holder).length;
}

function escapePlain(text: string): string {
  const lines = text.split("\n");
  const encoded: string[] = [];
  for (let i = 0; i < lines.length; i++) {
    let line = "";
    for (let j = 0; j < lines[i].length; j++) line += escapeText(lines[i][j], lines[i][j + 1]);
    encoded.push(line);
  }
  return encoded.join("<br>");
}

function dialogRoot(element: HTMLElement): HTMLElement {
  const box = element.closest ? element.closest("." + richTextCss.editor) : null;
  if (box) return box as HTMLElement;
  return element.parentElement || element;
}

function linkContaining(range: Range, root: HTMLElement): HTMLAnchorElement | undefined {
  const start = closest(range.startContainer, root, ["a"]);
  const end = closest(range.endContainer, root, ["a"]);
  if (start && start === end) return start as HTMLAnchorElement;
  return undefined;
}

function listItemsOverlapping(root: HTMLElement, range: Range): HTMLElement[] {
  const found: HTMLElement[] = [];
  const items = root.querySelectorAll("li");
  for (let i = 0; i < items.length; i++) {
    const item = items[i] as HTMLElement;
    if (range.intersectsNode ? safeIntersects(range, item) : false) found.push(item);
  }
  return found;
}

function safeIntersects(range: Range, node: Node): boolean {
  try {
    return range.intersectsNode(node);
  } catch(e) {
    return false;
  }
}

function convertItemsToParagraphs(items: HTMLElement[]): void {
  for (let i = items.length - 1; i >= 0; i--) liftListItem(items[i]);
}

function liftListItem(item: HTMLElement): void {
  const list = item.parentElement;
  if (!list || !list.parentNode) return;
  const doc = item.ownerDocument;
  const paragraph = doc.createElement("p");
  while(item.firstChild) paragraph.appendChild(item.firstChild);
  unwrap(paragraph, ["strong", "b", "em", "i", "u", "s", "strike", "del", "a"]);
  const parent = list.parentNode;
  const rest = doc.createElement(list.tagName.toLowerCase());
  let sibling = item.nextSibling;
  while(sibling) {
    const next = sibling.nextSibling;
    rest.appendChild(sibling);
    sibling = next;
  }
  parent.insertBefore(paragraph, list.nextSibling);
  if (rest.childNodes.length) parent.insertBefore(rest, paragraph.nextSibling);
  if (item.parentNode) item.parentNode.removeChild(item);
  if (!list.childNodes.length && list.parentNode) list.parentNode.removeChild(list);
  if (!rest.childNodes.length && rest.parentNode) rest.parentNode.removeChild(rest);
}

function unwrapElement(element: Element): void {
  const parent = element.parentNode;
  if (!parent) return;
  while(element.firstChild) parent.insertBefore(element.firstChild, element);
  parent.removeChild(element);
}

function textOffset(root: Node, node: Node, offset: number): number {
  const doc = (root as HTMLElement).ownerDocument;
  if (!doc) return 0;
  const range = doc.createRange();
  range.selectNodeContents(root);
  try {
    range.setEnd(node, offset);
  } catch(e) {
    return 0;
  }
  return range.toString().length;
}

function selectOffsets(root: HTMLElement, start: number, end: number): void {
  const from = textPoint(root, start);
  const to = textPoint(root, end);
  if (!from || !to) return;
  const doc = root.ownerDocument;
  const range = doc.createRange();
  range.setStart(from.node, from.offset);
  range.setEnd(to.node, to.offset);
  selectRange(range);
}

function textPoint(root: HTMLElement, offset: number): { node: Text, offset: number } | undefined {
  const doc = root.ownerDocument;
  if (!doc) return undefined;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let seen = 0;
  let last: Text | undefined;
  let node = walker.nextNode() as Text;
  while(node) {
    last = node;
    const length = (node.textContent || "").length;
    if (seen + length >= offset) return { node: node, offset: offset - seen };
    seen += length;
    node = walker.nextNode() as Text;
  }
  if (last) return { node: last, offset: (last.textContent || "").length };
  return undefined;
}

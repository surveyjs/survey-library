import { ActionContainer, DomDocumentHelper, DomWindowHelper, QuestionCommentModel, settings, SurveyModel } from "survey-core";
import type { IDialogOptions } from "survey-core";
import DefaultLightPanelless from "../../themes/default-light-panelless";
import { getRichTextString } from "./rich-text-strings";
import { escapeHref, escapeText } from "./runs";
import { getDisallowedHtml, hrefScheme, sanitizeHtml, schemeAllowed } from "./sanitizer";
import { createRichTextToolbar, RichTextCommand } from "./toolbar";

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
  strikeThrough: ["s", "strike", "del"]
};

export class RichTextEditorModel {
  public toolbar: ActionContainer;
  public readonly mode: "inline" | "block";
  private readonly question?: QuestionCommentModel;
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
  public onState?: () => void;
  private onSelection = (): void => this.rememberSelection();
  private onProperty = (sender: any, options: { name: string }): void => {
    if (options.name === "value")this.onExternalValue();
  };
  private previousDesignMode: (() => void) | undefined;
  private designModeHandler: (() => void) | undefined;

  public constructor(question?: QuestionCommentModel, options?: IRichTextEditorOptions) {
    this.question = question;
    this.contentAgnostic = !question || !!options?.contentAgnostic;
    this.mode = options?.mode || (question && question.acceptCarriageReturn === false ? "inline" : "block");
    this.onInputCallback = options?.onInput;
    this.commands = options?.commands;
    this.toolbar = createRichTextToolbar(this, this.mode);
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

  public get placeholder(): string {
    return this.question && this.question.renderedPlaceholder ? this.question.renderedPlaceholder : "";
  }

  public get areaStyle(): { minHeight: string, height?: string, overflow?: string, resize?: string } {
    const rows = this.question && this.question.rows ? this.question.rows : 4;
    const minHeight = "calc(" + rows + " * 1lh)";
    const style: { minHeight: string, height?: string, overflow?: string, resize?: string } = { minHeight: minHeight };
    const grow = !!this.question && this.question.renderedAutoGrow;
    if (!grow) {
      style.height = minHeight;
      style.overflow = "auto";
    }
    if (this.question && this.question.renderedAllowResize) style.resize = "vertical";
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
    if (DomDocumentHelper.isAvailable()) DomDocumentHelper.addEventListener("selectionchange", this.onSelection);
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
    if (DomDocumentHelper.isAvailable()) DomDocumentHelper.removeEventListener("selectionchange", this.onSelection);
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

  public toggleState(command: "bold" | "italic" | "strikeThrough" | "insertUnorderedList" | "insertOrderedList"): ToggleState {
    if (!this.element || !this.saved) return "none";
    if (command === "insertUnorderedList" || command === "insertOrderedList") {
      const tag = command === "insertUnorderedList" ? "ul" : "ol";
      return this.saved.collapsed
        ? (closest(this.saved.startContainer, this.element, [tag]) ? "all" : "none")
        : (this.nodesAllHave(this.saved, [tag]) ? "all" : (this.nodesNoneHave(this.saved, [tag]) ? "none" : "mixed"));
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
      return;
    }
    if (key === "tab") return;
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
    if (event.shiftKey) insertBreak(this.saved);
    else splitBlock(this.element, this.saved);
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
    this.sourceValue = undefined;
    this.refreshLink();
    this.syncEmpty();
  };

  private onBlur = (event: FocusEvent): void => {
    const next = event.relatedTarget as Node | null;
    if (next && this.element && dialogRoot(this.element).contains(next)) return;
    this.finishBlur();
  };

  private finishBlur(): void {
    this.focused = false;
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
    if (!selection || selection.rangeCount === 0) return;
    const range = selection.getRangeAt(0);
    if (!this.element.contains(range.commonAncestorContainer)) return;
    this.saved = range.cloneRange();
    this.updatePressed();
  }

  private restoreSelection(): void {
    if (!this.element || !this.saved) return;
    this.element.focus();
    selectRange(this.saved);
  }

  private updatePressed(): void {
    const commands: Array<"bold" | "italic" | "strikeThrough" | "insertUnorderedList" | "insertOrderedList"> = [
      "bold", "italic", "strikeThrough", "insertUnorderedList", "insertOrderedList"
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
    if (command === "bold" || command === "italic" || command === "strikeThrough") {
      const tags = MARKS[command];
      const remove = this.markState(range, tags) === "all";
      replaceRange(range, markHtml(range, tags, remove));
    } else if (command === "insertUnorderedList" || command === "insertOrderedList") {
      const tag = command === "insertUnorderedList" ? "ul" : "ol";
      const remove = !!closest(range.startContainer, this.element, [tag]);
      replaceRange(range, listHtml(range, tag, remove));
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

  private nodesAllHave(range: Range, tags: string[]): boolean {
    return this.markState(range, tags) === "all";
  }

  private nodesNoneHave(range: Range, tags: string[]): boolean {
    return this.markState(range, tags) === "none";
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
        const doc = DomDocumentHelper.getDocument();
        const active = doc && doc.activeElement;
        if (!this.element || !active || !this.element.contains(active))this.finishBlur();
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

function listHtml(range: Range, tag: "ul" | "ol", remove: boolean): string {
  const doc = range.startContainer.ownerDocument;
  const contents = range.cloneContents();
  if (remove) {
    unwrap(contents, ["ul", "ol", "li"]);
    return htmlOf(contents);
  }
  const list = doc.createElement(tag);
  const item = doc.createElement("li");
  item.appendChild(contents);
  list.appendChild(item);
  return list.outerHTML;
}

function clearHtml(range: Range): string {
  const contents = range.cloneContents();
  unwrap(contents, ["strong", "b", "em", "i", "s", "strike", "del", "a", "ul", "ol", "li"]);
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

function insertBreak(range: Range): void {
  const doc = range.startContainer.ownerDocument;
  const br = doc.createElement("br");
  range.insertNode(br);
  const next = doc.createRange();
  next.setStartAfter(br);
  next.collapse(true);
  selectRange(next);
}

function splitBlock(root: HTMLElement, range: Range): void {
  const item = closest(range.startContainer, root, ["li"]);
  if (item) {
    if (!item.textContent) leaveList(item as HTMLElement);
    else splitElement(item as HTMLElement, range, "li");
    return;
  }
  const block = closest(range.startContainer, root, ["p", "div"]);
  if (block) {
    splitElement(block as HTMLElement, range, "p");
    return;
  }
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
  placeCaret(next);
}

function splitElement(block: HTMLElement, range: Range, tag: string): void {
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
  placeCaret(next);
}

function leaveList(item: HTMLElement): void {
  const list = item.parentElement;
  const doc = item.ownerDocument;
  const paragraph = doc.createElement("p");
  paragraph.appendChild(doc.createElement("br"));
  if (list && list.parentNode) {
    list.parentNode.insertBefore(paragraph, list.nextSibling);
    if (item.parentNode) item.parentNode.removeChild(item);
    if (!list.textContent && list.parentNode) list.parentNode.removeChild(list);
  }
  placeCaret(paragraph);
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
  const box = element.closest ? element.closest(".sd-rich-text") : null;
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
  unwrap(paragraph, ["strong", "b", "em", "i", "s", "strike", "del", "a"]);
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

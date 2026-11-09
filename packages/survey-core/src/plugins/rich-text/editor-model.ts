import { DomDocumentHelper, DomWindowHelper, QuestionCommentModel } from "survey-core";
import { sanitizeHtml } from "./sanitizer";
import { createRichTextToolbar, RichTextCommand } from "./toolbar";
import { ActionContainer } from "survey-core";

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
  private onSelection = (): void => this.rememberSelection();
  private onProperty = (sender: any, options: { name: string }): void => {
    if (options.name === "value")this.onExternalValue();
  };

  public constructor(question?: QuestionCommentModel, options?: IRichTextEditorOptions) {
    this.question = question;
    this.contentAgnostic = !question || !!options?.contentAgnostic;
    this.mode = options?.mode || (question && question.acceptCarriageReturn === false ? "inline" : "block");
    this.onInputCallback = options?.onInput;
    this.commands = options?.commands;
    this.toolbar = createRichTextToolbar(this, this.mode);
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

  public attach(element: HTMLElement): void {
    this.detach();
    this.element = element;
    element.addEventListener("keydown", this.onKeyDown);
    element.addEventListener("input", this.onInput);
    element.addEventListener("focus", this.onFocus);
    element.addEventListener("blur", this.onBlur);
    if (DomDocumentHelper.isAvailable()) DomDocumentHelper.addEventListener("selectionchange", this.onSelection);
    if (this.question && !this.contentAgnostic) {
      const value = this.question.value;
      this.lastCommitted = value === undefined || value === null ? undefined : String(value);
      element.innerHTML = this.displayHtml;
      this.question.onPropertyChanged.add(this.onProperty);
    }
  }

  public detach(): void {
    if (this.timer) clearTimeout(this.timer);
    if (this.element) {
      this.element.removeEventListener("keydown", this.onKeyDown);
      this.element.removeEventListener("input", this.onInput);
      this.element.removeEventListener("focus", this.onFocus);
      this.element.removeEventListener("blur", this.onBlur);
    }
    if (DomDocumentHelper.isAvailable()) DomDocumentHelper.removeEventListener("selectionchange", this.onSelection);
    if (this.question)this.question.onPropertyChanged.remove(this.onProperty);
    this.element = undefined;
    this.saved = undefined;
  }

  public run(command: RichTextCommand): void {
    if (!this.element) return;
    const action = this.toolbar.actions.filter(item => item.id && item.id.indexOf(commandId(command)) >= 0)[0];
    if (action && action.visible === false) return;
    this.restoreSelection();
    if (this.commands) {
      this.commands.exec(command);
    } else {
      this.apply(command);
    }
    this.dirty = true;
    this.rememberSelection();
    if (this.onInputCallback)this.onInputCallback();
    if (this.question && this.question.isInputTextUpdate)this.scheduleCommit();
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
    this.restoreSelection();
    if (!this.saved) return;
    if (event.shiftKey) insertBreak(this.saved);
    else splitBlock(this.element, this.saved);
    this.dirty = true;
    this.rememberSelection();
    if (this.question && this.question.isInputTextUpdate)this.scheduleCommit();
  };

  private onInput = (): void => {
    this.dirty = true;
    if (this.onInputCallback)this.onInputCallback();
    if (this.question && this.question.isInputTextUpdate)this.scheduleCommit();
  };

  private onFocus = (): void => {
    this.focused = true;
  };

  private onBlur = (): void => {
    this.focused = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = undefined;
    }
    if (this.dirty)this.commit();
    this.dirty = false;
    if (this.deferred !== undefined) {
      const next = this.deferred;
      this.deferred = undefined;
      this.renderValue(next);
    }
  };

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
  }

  private onExternalValue(): void {
    if (this.writing || !this.question) return;
    const next = this.question.value === undefined || this.question.value === null ? "" : String(this.question.value);
    if (next === this.lastCommitted) return;
    if (this.focused) {
      this.deferred = next;
      return;
    }
    this.renderValue(next);
  }

  private renderValue(value: string): void {
    if (!this.element) return;
    this.lastCommitted = value;
    this.element.innerHTML = value ? sanitizeHtml(value, { inline: this.inline }) : "";
    this.dirty = false;
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
      replaceRange(range, clearHtml(range));
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
}

function commandId(command: string): string {
  if (command === "bold") return "rich-text-bold";
  if (command === "italic") return "rich-text-italic";
  if (command === "strikeThrough") return "rich-text-strikethrough";
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

function placeCaret(element: HTMLElement): void {
  const doc = element.ownerDocument;
  const range = doc.createRange();
  range.selectNodeContents(element);
  range.collapse(true);
  selectRange(range);
}

import { ActionContainer, Base } from "survey-core";
import { IRichTextConverter, RichText } from "./api";
import { isRichTextBoldHidden } from "./edit-mode";
import { createDetachedElement } from "./runs";
import { createRichTextToolbar, IRichTextToolbarActions } from "./toolbar";

export type RichTextMark = "bold" | "italic" | "strike";
export type RichTextMarkState = "all" | "none" | "mixed";

export interface IRichTextCommands {
  styleWithCSS(value: boolean): void;
  exec(command: string, value?: string): void;
}

export interface IRichTextEditorHost {
  getValue(): string;
  setValue(value: string): void;
  readonly isInputTextUpdate: boolean;
  readonly acceptCarriageReturn: boolean;
  readonly mode: "inline" | "block";
  readonly format: "markdown" | "html";
  readonly owner?: Base;
  readonly converter?: IRichTextConverter;
  // false: toolbar and keys only. The caller owns the content (Creator string editor).
  readonly managesValue?: boolean;
  onInput?(): void;
}

const MARK_TAGS: { [key: string]: string[] } = {
  bold: ["b", "strong"],
  italic: ["i", "em"],
  strike: ["s", "strike", "del"],
  link: ["a"]
};

const COMMANDS: { [key: string]: string } = {
  bold: "bold",
  italic: "italic",
  strike: "strikeThrough"
};

export function createDocumentCommands(doc: Document): IRichTextCommands {
  const execCommand = (doc as any).execCommand;
  return {
    styleWithCSS(value: boolean): void {
      if (typeof execCommand !== "function") return;
      execCommand.call(doc, "styleWithCSS", false, value ? "true" : "false");
    },
    exec(command: string, value?: string): void {
      if (typeof execCommand !== "function") return;
      execCommand.call(doc, command, false, value);
    }
  };
}

export class RichTextEditorModel {
  public readonly toolbar: ActionContainer;
  public commands: IRichTextCommands;
  public inputDelay = 300;
  private readonly actions: IRichTextToolbarActions;
  private element: HTMLElement | null = null;
  private savedRange: Range | null = null;
  private dirty = false;
  private silent = false;
  private timer = 0;
  private detachDom: (() => void) | undefined;

  constructor(private host: IRichTextEditorHost, commands?: IRichTextCommands) {
    const built = createRichTextToolbar(this);
    this.toolbar = built.toolbar;
    this.actions = built.actions;
    this.commands = commands;
    if (this.host.mode === "inline") {
      this.actions.bulleted.visible = false;
      this.actions.numbered.visible = false;
    }
  }

  public get mode(): "inline" | "block" {
    return this.host.mode;
  }

  public attach(element: HTMLElement, commands?: IRichTextCommands): void {
    this.detach();
    this.element = element;
    this.commands = commands || this.commands || createDocumentCommands(element.ownerDocument);
    this.commands.styleWithCSS(false);
    if (isRichTextBoldHidden(element))this.actions.bold.visible = false;
    if (this.managesValue)this.renderValue(this.host.getValue());
    const doc = element.ownerDocument;
    const view = doc.defaultView;
    const onSelection = () => this.onSelectionChange();
    const onInput = () => this.onInput();
    const onKeyDown = (event: KeyboardEvent) => this.onKeyDown(event);
    const onBlur = () => { if (this.managesValue)this.commit(); };
    const onPaste = (event: ClipboardEvent) => this.onPaste(event);
    doc.addEventListener("selectionchange", onSelection);
    element.addEventListener("input", onInput);
    element.addEventListener("keydown", onKeyDown);
    element.addEventListener("blur", onBlur);
    if (!this.managesValue) element.addEventListener("paste", onPaste);
    this.detachDom = () => {
      doc.removeEventListener("selectionchange", onSelection);
      element.removeEventListener("input", onInput);
      element.removeEventListener("keydown", onKeyDown);
      element.removeEventListener("blur", onBlur);
      if (!this.managesValue) element.removeEventListener("paste", onPaste);
      if (view && this.timer) view.clearTimeout(this.timer);
    };
    this.updateToolbar();
  }

  public detach(): void {
    if (this.detachDom)this.detachDom();
    this.detachDom = undefined;
    this.element = null;
    this.savedRange = null;
  }

  public getSource(): string {
    if (!this.element) return this.host.getValue();
    return this.converter.toSource(this.element, this.context);
  }

  public getReadOnlyHtml(value: string): string {
    if (!value) return "";
    return this.converter.toHtml(value, this.context) || "";
  }

  public getMarkState(mark: RichTextMark): RichTextMarkState {
    return this.markState(mark);
  }

  public toggleMark(mark: RichTextMark): void {
    if (mark === "bold" && this.actions.bold.visible === false) return;
    this.restoreSelection();
    const state = this.markState(mark);
    this.commands.exec(COMMANDS[mark]);
    if (state === "mixed" && this.markState(mark) !== "all")this.commands.exec(COMMANDS[mark]);
    this.noteInput();
    this.updateToolbar();
  }

  public applyList(ordered: boolean): void {
    if (this.mode !== "block") return;
    this.restoreSelection();
    this.commands.exec(ordered ? "insertOrderedList" : "insertUnorderedList");
    this.noteInput();
    this.updateToolbar();
  }

  public clearFormatting(): void {
    this.restoreSelection();
    this.commands.exec("removeFormat");
    this.commands.exec("unlink");
    this.unwrapLists();
    this.noteInput();
    this.updateToolbar();
  }

  public handleKeyDown(event: KeyboardEvent): void {
    this.onKeyDown(event);
  }

  private get managesValue(): boolean {
    return this.host.managesValue !== false;
  }

  private get converter(): IRichTextConverter {
    return this.host.converter || RichText.getFormat(this.host.format);
  }

  private get context() {
    return { inline: this.mode === "inline", element: this.host.owner, name: "value" };
  }

  private renderValue(value: string): void {
    if (!this.element) return;
    const html = value ? this.converter.toHtml(value, this.context) : "";
    this.silent = true;
    this.element.innerHTML = html || "";
    this.silent = false;
  }

  private onInput(): void {
    if (this.silent) return;
    if (!this.managesValue) {
      if (this.host.onInput)this.host.onInput();
      return;
    }
    this.noteInput();
  }

  private onPaste(event: ClipboardEvent): void {
    const data = event.clipboardData;
    if (!data || !this.commands) return;
    const html = data.getData("text/html");
    const plain = data.getData("text/plain");
    event.preventDefault();
    this.restoreSelection();
    if (html) {
      const converter = RichText.getFormat("html");
      const fragment = createDetachedElement(html);
      const source = fragment ? converter.toSource(fragment, this.context) : "";
      this.commands.exec("insertHTML", converter.toHtml(source, this.context));
      return;
    }
    this.commands.exec("insertText", plain || "");
  }

  private noteInput(): void {
    this.dirty = true;
    if (!this.host.isInputTextUpdate || !this.element) return;
    const view = this.element.ownerDocument.defaultView;
    if (!view || this.inputDelay <= 0) {
      this.commit();
      return;
    }
    if (this.timer) view.clearTimeout(this.timer);
    this.timer = view.setTimeout(() => {
      this.timer = 0;
      this.commit();
    }, this.inputDelay);
  }

  private commit(): void {
    if (!this.dirty) return;
    this.dirty = false;
    const source = this.getSource();
    if (source !== (this.host.getValue() || ""))this.host.setValue(source);
  }

  private onKeyDown(event: KeyboardEvent): void {
    const mod = event.ctrlKey || event.metaKey;
    const key = event.key;
    if (mod && (key === "b" || key === "B")) {
      event.preventDefault();
      this.toggleMark("bold");
      return;
    }
    if (mod && (key === "i" || key === "I")) {
      event.preventDefault();
      this.toggleMark("italic");
      return;
    }
    if (mod && (key === "u" || key === "U")) {
      event.preventDefault();
      return;
    }
    if (key !== "Enter" || mod || event.altKey) return;
    if (this.mode === "inline") {
      event.preventDefault();
      if (this.host.acceptCarriageReturn) {
        this.restoreSelection();
        this.commands.exec("insertLineBreak");
        this.noteInput();
      }
      return;
    }
    event.preventDefault();
    this.restoreSelection();
    this.commands.exec(event.shiftKey ? "insertLineBreak" : "insertParagraph");
    this.noteInput();
  }

  private onSelectionChange(): void {
    const range = this.currentRange();
    if (range)this.savedRange = range.cloneRange();
    this.updateToolbar();
  }

  private currentRange(): Range | null {
    if (!this.element) return null;
    const selection = this.element.ownerDocument.getSelection?.();
    if (!selection || selection.rangeCount === 0) return null;
    const range = selection.getRangeAt(0);
    if (!this.element.contains(range.commonAncestorContainer)) return null;
    return range;
  }

  private restoreSelection(): void {
    if (!this.element) return;
    this.element.focus();
    const selection = this.element.ownerDocument.getSelection?.();
    if (!selection || !this.savedRange) return;
    selection.removeAllRanges();
    selection.addRange(this.savedRange);
  }

  private markState(mark: RichTextMark): RichTextMarkState {
    if (!this.element) return "none";
    const range = this.currentRange() || this.savedRange;
    if (!range) return "none";
    const nodes = textNodesInRange(this.element, range);
    if (nodes.length === 0) {
      const probe = range.startContainer.nodeType === 3 ? range.startContainer.parentNode : range.startContainer;
      return nodeHasMark(probe, this.element, mark) ? "all" : "none";
    }
    let marked = 0;
    for (let i = 0; i < nodes.length; i++) {
      if (nodeHasMark(nodes[i], this.element, mark)) marked++;
    }
    if (marked === 0) return "none";
    if (marked === nodes.length) return "all";
    return "mixed";
  }

  private updateToolbar(): void {
    this.setPressed(this.actions.bold, this.markState("bold"));
    this.setPressed(this.actions.italic, this.markState("italic"));
    this.setPressed(this.actions.strike, this.markState("strike"));
  }

  private setPressed(action: { active: boolean, ariaPressed: boolean }, state: RichTextMarkState): void {
    const pressed = state === "all";
    action.active = pressed;
    action.ariaPressed = pressed;
  }

  private unwrapLists(): void {
    if (!this.element) return;
    const range = this.currentRange() || this.savedRange;
    const items = Array.from(this.element.querySelectorAll("li")).filter(li => !range || range.intersectsNode(li));
    items.forEach(li => {
      const list = li.parentElement;
      if (!list) return;
      const paragraph = li.ownerDocument.createElement("div");
      while(li.firstChild) paragraph.appendChild(li.firstChild);
      list.parentElement?.insertBefore(paragraph, list);
      li.remove();
      if (!list.querySelector("li")) list.remove();
    });
  }
}

function textNodesInRange(root: HTMLElement, range: Range): Text[] {
  const doc = root.ownerDocument;
  const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let current = walker.nextNode();
  while(current) {
    const text = current as Text;
    if (text.textContent && rangeIntersects(range, text)) nodes.push(text);
    current = walker.nextNode();
  }
  return nodes;
}

function rangeIntersects(range: Range, node: Text): boolean {
  if (typeof range.intersectsNode === "function") return range.intersectsNode(node);
  return true;
}

function nodeHasMark(node: Node | null, root: HTMLElement, mark: RichTextMark): boolean {
  const tags = MARK_TAGS[mark];
  let current: Node | null = node;
  while(current && current !== root) {
    if (current.nodeType === 1) {
      const tag = (current as HTMLElement).tagName.toLowerCase();
      if (tags.indexOf(tag) >= 0) return true;
    }
    current = current.parentNode;
  }
  return false;
}

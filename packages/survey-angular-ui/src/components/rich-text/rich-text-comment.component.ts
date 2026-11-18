import { Component, ElementRef, ViewChild } from "@angular/core";
import { QuestionCommentModel, ResizeManager } from "survey-core";
import { QuestionAngular } from "../../question";
import { AngularComponentFactory } from "../../component-factory";

function editorModel(question: QuestionCommentModel): any {
  const host: any = typeof window !== "undefined" ? window : {};
  const Ctor = host.SurveyRichText && host.SurveyRichText.RichTextEditorModel;
  return Ctor ? new Ctor(question) : undefined;
}

@Component({
  selector: "sv-ng-rich-text",
  templateUrl: "./rich-text-comment.component.html"
})
export class RichTextCommentComponent extends QuestionAngular<QuestionCommentModel> {
  @ViewChild("grip") gripRef?: ElementRef<HTMLElement>;
  private hostElement?: ElementRef<HTMLElement>;
  private attachedHost?: HTMLElement;
  // *ngIf creates the editing host after the check that would otherwise attach it.
  @ViewChild("host")
  set hostRef(value: ElementRef<HTMLElement> | undefined) {
    this.hostElement = value;
    if (this.viewReady)this.syncHost();
  }
  get hostRef(): ElementRef<HTMLElement> | undefined {
    return this.hostElement;
  }
  private editor: any;
  private boundQuestion?: QuestionCommentModel;
  private resizeManager?: ResizeManager;
  private resizeTarget?: HTMLElement;
  private styledElement?: HTMLElement;
  private areaKey = "";
  private viewReady = false;
  private disposed = false;

  // The property grid keeps this component and swaps the question. The editor follows that question.
  public override onModelChanged(): void {
    this.bindQuestion();
  }

  public override ngAfterViewInit(): void {
    this.viewReady = true;
    this.syncHost();
    super.ngAfterViewInit();
  }

  public override ngAfterViewChecked(): void {
    super.ngAfterViewChecked();
    this.syncHost();
  }

  public override ngOnDestroy(): void {
    this.disposed = true;
    this.disposeSizer();
    this.disposeEditor();
    super.ngOnDestroy();
  }

  public get editing(): boolean {
    return !!this.editor && !!this.editor.isEditing;
  }
  public get sourceMode(): boolean {
    return this.editing && !!this.editor.sourceMode;
  }
  public get showEditor(): boolean {
    return this.editing && !this.sourceMode;
  }
  public get css(): any {
    return this.model ? this.model.cssClasses : {};
  }
  public get displayHtml(): string {
    return this.editor ? this.editor.displayHtml : "";
  }
  public get displayStyle(): any {
    return this.editor ? this.editor.areaStyle : null;
  }
  public get displayPlaceholder(): string | null {
    return !this.displayHtml && this.editor && this.editor.placeholder ? this.editor.placeholder : null;
  }
  public get displayClass(): string {
    return this.classes(this.model.getControlClass(), this.css.display);
  }
  public get areaClass(): string {
    return this.classes(this.model.getControlClass(), this.css.area);
  }
  public get editorClass(): string {
    return this.classes(this.model.getRootClass(), this.css.editor, this.toolbarModifierClass, this.openClass);
  }
  public get areaPlaceholder(): string | null {
    return this.editor && this.editor.placeholder ? this.editor.placeholder : null;
  }
  public get ariaMultiline(): true | null {
    return this.editor && this.editor.mode === "block" ? true : null;
  }
  public get staticToolbar(): boolean {
    return this.toolbarMode === "static";
  }
  public get hasToolbar(): boolean {
    return !!this.editor && !!this.editor.hasToolbar;
  }
  public get toolbar(): any {
    return this.editor ? this.editor.toolbar : undefined;
  }
  public get toolbarLabel(): string {
    return this.editor ? this.editor.toolbarLabel : "";
  }
  public get sourceNotice(): string {
    return this.editor ? this.editor.sourceNotice : "";
  }
  public get editAnywayLabel(): string {
    return this.editor ? this.editor.editAnywayLabel : "";
  }
  public get gripIconId(): string {
    return this.css.gripIconId || "";
  }
  public editAnyway(): void {
    if (this.editor)this.editor.editAnyway();
  }

  private get toolbarMode(): string {
    return this.editor && this.editor.toolbarMode ? this.editor.toolbarMode : "static";
  }
  private get toolbarModifierClass(): string {
    const css = this.css;
    const mode = this.toolbarMode;
    if (mode === "none") return css.toolbarNone;
    if (mode === "onSelection") return css.toolbarOnSelection;
    if (mode === "onFocus") return css.toolbarOnFocus;
    return css.toolbarStatic;
  }
  private get openClass(): string {
    return this.toolbarMode === "onSelection" && this.editor && this.editor.toolbarOpen ? this.css.toolbarOpen : "";
  }

  public classes(...names: Array<string | undefined | false>): string {
    return names.filter(name => !!name).join(" ");
  }

  private bindQuestion(): void {
    const question = this.model;
    if (!question || this.boundQuestion === question) return;
    this.disposeEditor();
    this.boundQuestion = question;
    this.areaKey = "";
    this.styledElement = undefined;
    this.editor = editorModel(question);
    if (this.editor) {
      this.editor.onState = (): void => {
        if (!this.disposed && this.viewReady)this.detectChanges();
      };
    }
  }

  private disposeEditor(): void {
    const editor = this.editor;
    this.editor = undefined;
    this.attachedHost = undefined;
    if (!editor) return;
    if (editor.dispose) editor.dispose();
    else editor.detach();
  }

  // read / edit / source are different hosts, so a mode switch replaces the contenteditable
  // instead of leaving the previous node in place.
  private syncHost(): void {
    const editor = this.editor;
    const host = this.hostRef ? this.hostRef.nativeElement : undefined;
    // A mode switch replaces the node. The editor can still be attached to the one that left the document.
    if (editor && editor.isAttached && this.attachedHost !== host) {
      editor.detach();
      this.attachedHost = undefined;
    }
    if (editor && host && !editor.isAttached) {
      editor.attach(host);
      this.attachedHost = host;
    }
    if (!host)this.attachedHost = undefined;
    if (host)this.applyEditorStyle(host);
    this.updateSizer();
  }

  // ResizeManager writes the height onto the element. Applying the model style on every
  // check would put that height back, so the grip could not move it.
  private applyEditorStyle(element: HTMLElement): void {
    const area = this.editor ? this.editor.areaStyle : undefined;
    const key = !area ? "" : area.minHeight + "|" + (area.height || "") + "|" + (area.overflow || "");
    if (this.styledElement === element && this.areaKey === key) return;
    this.styledElement = element;
    this.areaKey = key;
    if (!area) return;
    element.style.minHeight = area.minHeight;
    if (area.height) element.style.height = area.height;
    else element.style.removeProperty("height");
    if (area.overflow) element.style.overflow = area.overflow;
    else element.style.removeProperty("overflow");
  }

  // The comment's grip. It changes the height of the editing area and leaves the width alone.
  private updateSizer(): void {
    const question = this.model;
    const grip = this.gripRef ? this.gripRef.nativeElement : undefined;
    const target = this.hostRef ? this.hostRef.nativeElement : undefined;
    if (!question || question.resizeStyle === "none" || !grip || !target) {
      this.disposeSizer();
      return;
    }
    if (this.resizeManager && this.resizeTarget === target) return;
    this.disposeSizer();
    this.resizeTarget = target;
    this.resizeManager = new ResizeManager(grip, target, "vertical");
  }

  private disposeSizer(): void {
    if (this.resizeManager)this.resizeManager.dispose();
    this.resizeManager = undefined;
    this.resizeTarget = undefined;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-rich-text", RichTextCommentComponent);

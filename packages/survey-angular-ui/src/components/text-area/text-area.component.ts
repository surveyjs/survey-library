import { Component, ElementRef, Input, OnDestroy, ViewChild } from "@angular/core";
import { ResizeManager, TextAreaModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";

@Component({
  selector: "sv-text-area",
  templateUrl: "./text-area.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class TextAreaComponent extends EmbeddedViewContentComponent implements OnDestroy {
  @Input() model!: TextAreaModel;
  @ViewChild("contentElement") elementContentRef!: ElementRef<HTMLElement>;
  @ViewChild("anchorRef") anchorRef!: ElementRef<HTMLElement>;
  private resizeManager?: ResizeManager;
  get value() {
    return this.model.getTextValue() || "";
  }
  public onContainerClick(event: Event) {
    if (event.target == event.currentTarget) {
      this.elementContentRef?.nativeElement?.focus();
    }
  }
  public ngAfterViewInit(): void {
    if (this.anchorRef?.nativeElement && this.elementContentRef?.nativeElement && this.model.question.resizeStyle !== "none") {
      this.resizeManager = new ResizeManager(this.anchorRef.nativeElement, this.elementContentRef.nativeElement, this.model.question.resizeStyle);
    }
    if (!!this.model && !!this.elementContentRef?.nativeElement) {
      const element = this.elementContentRef.nativeElement;
      this.model.setElement(element as HTMLTextAreaElement);
    }
  }
  public ngOnDestroy(): void {
    this.resizeManager?.dispose();
    !!this.model && this.model.dispose();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-text-area", TextAreaComponent);
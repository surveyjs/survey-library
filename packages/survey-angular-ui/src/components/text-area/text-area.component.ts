import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { TextAreaModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";

@Component({
  selector: "sv-text-area",
  templateUrl: "./text-area.component.html"
})
export class TextAreaComponent extends EmbeddedViewContentComponent {
  @Input() model!: TextAreaModel;
  @ViewChild("contentElement") elementContentRef!: ElementRef<HTMLElement>;

  get value() {
    return this.model.getTextValue() || "";
  }

  public ngAfterViewInit(): void {
    if (!!this.model && !!this.elementContentRef?.nativeElement) {
      const element = this.elementContentRef.nativeElement;
      this.model.setElement(element as HTMLTextAreaElement);
    }
  }

  ngOnDestroy(): void {
    this.model.dispose();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-text-area", TextAreaComponent);
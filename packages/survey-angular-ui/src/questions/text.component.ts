import { Component, ElementRef, ViewChild } from "@angular/core";
import { QuestionAngular } from "../question";
import { Helpers, QuestionTextModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-text-question",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.scss"]
})
export class TextQuestionComponent extends QuestionAngular<QuestionTextModel> {
  @ViewChild("inputElement") inputElementRef!: ElementRef<HTMLDivElement>;

  get value(): string {
    return this.model.inputValue ?? "";
  }

  blur(event: any): void {
    this.model.onBlur(event);
    this.updateInputDomElement();
  }

  updateInputDomElement(): void {
    if (!!this.inputElementRef?.nativeElement) {
      const control: any = this.inputElementRef.nativeElement;
      if (!Helpers.isTwoValueEquals(this.value, control.value, false, true, false)) {
        control.value = this.value;
      }
    }
  }
}

AngularComponentFactory.Instance.registerComponent("text-question", TextQuestionComponent);
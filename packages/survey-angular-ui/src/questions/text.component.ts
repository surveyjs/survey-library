import { Component, ElementRef, ViewChild } from "@angular/core";
import { QuestionAngular } from "../question";
import { Helpers, QuestionTextModel } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-text-question",
  templateUrl: "./text.component.html",
  styles: [":host { display: contents; }"]
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

  // onTyping follows the input event. A value committed only on blur re-renders under the pointer
  // and the click that should apply it never reaches the button.
  onInput(event: any): void {
    if (this.model.isInputTextUpdate)this.model.onChange(event);
  }

  updateInputDomElement(): void {
    if (!!this.inputElementRef?.nativeElement) {
      const control: any = this.inputElementRef.nativeElement;
      if (!Helpers.checkIfValuesEqual(this.value, control.value, { ignoreOrder: false, caseSensitive: true, trimStrings: false })) {
        control.value = this.value;
      }
    }
  }
}

AngularComponentFactory.Instance.registerComponent("text-question", TextQuestionComponent);
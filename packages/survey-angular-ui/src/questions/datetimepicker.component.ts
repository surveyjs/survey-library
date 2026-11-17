import { AfterViewChecked, Component, ElementRef, QueryList, ViewChildren } from "@angular/core";
import { QuestionDateTimePickerModel } from "survey-core";
import { QuestionAngular } from "../question";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-datetimepicker-question",
  templateUrl: "./datetimepicker.component.html"
})
export class DateTimePickerQuestionComponent extends QuestionAngular<QuestionDateTimePickerModel> implements AfterViewChecked {
  @ViewChildren("input") inputs!: QueryList<ElementRef<HTMLInputElement>>;
  private renderedRange: boolean | undefined;

  public override ngAfterViewChecked(): void {
    this.syncInputs();
    if (this.renderedRange === this.model.range) return;
    const root = this.elementContentRef?.nativeElement;
    if (this.renderedRange !== undefined && !!root) {
      this.model.beforeDestroyQuestionElement(root);
      this.model.afterRenderQuestionElement(root);
    }
    this.renderedRange = this.model.range;
  }
  private renderedTexts(): Array<string> {
    return this.model.range
      ? [this.model.renderedStartInputValue, this.model.renderedEndInputValue]
      : [this.model.renderedInputValue];
  }
  private syncInputs(): void {
    const texts = this.renderedTexts();
    this.inputs?.forEach((inputRef, index) => {
      const input = inputRef.nativeElement;
      const isFocused = !!input && input.ownerDocument.activeElement === input;
      if (!!input && !isFocused && index < texts.length && input.value !== texts[index]) {
        input.value = texts[index];
      }
    });
  }
}

AngularComponentFactory.Instance.registerComponent("datetimepicker-question", DateTimePickerQuestionComponent);

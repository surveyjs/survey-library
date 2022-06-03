import { Component, Input } from "@angular/core";
import { LocalizableString, QuestionBooleanModel } from "survey-core";
@Component({
  selector: "sv-ng-boolean-radio-item",
  templateUrl: "boolean-radio-item.component.html",
})
export class BooleanRadioItemComponent {
  @Input() question!: QuestionBooleanModel;
  @Input() value!: boolean;
  @Input() locText!: LocalizableString;
  constructor() {

  }
}

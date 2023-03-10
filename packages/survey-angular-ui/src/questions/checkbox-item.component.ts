import { Component, Input } from "@angular/core";
import { ItemValue, QuestionCheckboxModel } from "survey-core";

@Component({
  selector: "sv-ng-checkbox-item, '[sv-ng-checkbox-item]'",
  templateUrl: "./checkbox-item.component.html",
  styleUrls: ["./checkbox-item.component.scss"]
  })
export class CheckboxItemComponent {
  @Input() question!: QuestionCheckboxModel;
  @Input() model!: ItemValue;
  constructor() {
  }
  onChange(event: any) {
    this.question["clickItemHandler"](this.model, event.target.checked);
  }
  onSelectAllChange(event: any) {
    this.question.toggleSelectAll();
  }
}

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
    var newValue = (<Array<string>>[]).concat(this.question.renderedValue || []);
    var index = newValue.indexOf(this.model.value);
    if (event.target.checked) {
      if (index < 0) {
        newValue.push(this.model.value);
      }
    } else {
      if (index > -1) {
        newValue.splice(index, 1);
      }
    }
    this.question.renderedValue = newValue;
  }
  onSelectAllChange(event: any) {
    this.question.toggleSelectAll();
  }
}

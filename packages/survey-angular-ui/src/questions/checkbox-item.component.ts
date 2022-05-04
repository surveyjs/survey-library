import { Component, Input } from "@angular/core";
import { QuestionCheckboxModel } from "survey-core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-checkbox-item",
  templateUrl: "./checkbox-item.component.html",
  styleUrls: ["./checkbox-item.component.scss"]
})
export class CheckboxItemComponent {
  @Input() question: any;
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}

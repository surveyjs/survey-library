import { Component, Input } from "@angular/core";
import { ItemValue, QuestionSelectBase } from "survey-core";

@Component({
  selector: "['sv-ng-selectbase-item'], sv-ng-selebase-item",
  templateUrl: "./selectbase-item.html",
  styleUrls: ["./radiogroup-item.component.scss"]
})
export class SelectBaseItemComponent {
  @Input() question!: any;
  @Input() model!: ItemValue | any;
  @Input() inputType!: string;
  constructor() {
  }
}

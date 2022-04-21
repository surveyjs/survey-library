import { Component, Input } from "@angular/core";
import { QuestionRadiogroupModel } from "survey-core";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-radiogroup-item",
  templateUrl: "./radiogroup-item.component.html",
  styleUrls: ["./radiogroup-item.component.scss"]
})
export class RadiogroupItemComponent {
  @Input() question: any;
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}

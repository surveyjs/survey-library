import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "dropdown-question",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"]
})
export class DropdownQuestionComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
  keyup(event: any) {
    if (!this.model.isInputTextUpdate) return;
    this.model.value = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent("dropdown-question", DropdownQuestionComponent);
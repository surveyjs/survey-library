import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-dropdown-question",
  templateUrl: "./dropdown.component.html",
  styleUrls: ["./dropdown.component.scss"]
})
export class DropdownQuestionComponent {
  @Input() model: any;
  constructor() {
  }
  keyup(event: any) {
    if (!this.model.isInputTextUpdate) return;
    this.model.value = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent("dropdown-question", DropdownQuestionComponent);
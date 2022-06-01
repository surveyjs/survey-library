import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-text-question",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.scss"]
})
export class TextQuestionComponent {
  @Input() model: any;
  keyup(event: any) {
    if (!this.model.isInputTextUpdate) return;
    this.model.value = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent("text-question", TextQuestionComponent);
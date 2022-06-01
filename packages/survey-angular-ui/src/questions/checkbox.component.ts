import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "sv-ng-checkbox-question",
  templateUrl: "./checkbox.component.html",
  styleUrls: ["./checkbox.component.scss"]
})
export class CheckboxComponent {
  @Input() model: any;
  constructor() {
  }
}

AngularComponentFactory.Instance.registerComponent("checkbox-question", CheckboxComponent);
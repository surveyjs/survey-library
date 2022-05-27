import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
import { ImplementorBase } from "../implementor-base";

@Component({
  selector: "sv-ng-text-question",
  templateUrl: "./html.component.html",
  styleUrls: []
})
export class HtmlQuestionComponent {
  @Input() model: any;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
}

AngularComponentFactory.Instance.registerComponent("html-question", HtmlQuestionComponent);
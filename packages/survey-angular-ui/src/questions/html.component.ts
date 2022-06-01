import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";
@Component({
  selector: "sv-ng-text-question",
  templateUrl: "./html.component.html",
  styleUrls: []
})
export class HtmlQuestionComponent {
  @Input() model: any;
}

AngularComponentFactory.Instance.registerComponent("html-question", HtmlQuestionComponent);
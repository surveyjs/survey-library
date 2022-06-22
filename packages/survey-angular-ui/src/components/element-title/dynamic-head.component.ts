import { Component, Input } from "@angular/core";
import { SurveyElement } from "survey-core";

@Component({
  selector: "sv-ng-dynamic-head",
  templateUrl: "./dynamic-head.component.html"
})
export class DynamicHeadComponent {
  @Input() tagName!: string;
  @Input() element!: SurveyElement;
  constructor() {
  }
  get ariaLabel(): string | null {
    return this.element.getType() !== "radiogroup" ? this.element.locTitle.renderedHtml : null;
  }
}
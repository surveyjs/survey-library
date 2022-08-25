import { Component, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { SurveyElement } from "survey-core";

@Component({
  selector: "sv-ng-dynamic-head",
  templateUrl: "./dynamic-head.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class DynamicHeadComponent extends EmbeddedViewContentComponent {
  @Input() tagName!: string;
  @Input() element!: SurveyElement;
  get ariaLabel(): string | null {
    return this.element.titleAriaLabel;
  }
}
import { Component, HostBinding, Input } from "@angular/core";
import { SurveyElement } from "survey-core";

@Component({
  templateUrl: "./errors.component.html",
  selector: "'[sv-ng-errors]'",
  host: {
    "role": "alert",
    "aria-live": "polite",
    "aria-atomic": "true"
  }
})
export class ErrorsComponent {
  @Input() element!: SurveyElement | any;
  @Input() location?: string;
  constructor() {}
  @HostBinding("id") get id(): string {
    return this.element.renderedId + "_errors";
  }
  @HostBinding("class") get class(): string {
    return this.element.cssError;
  }
}
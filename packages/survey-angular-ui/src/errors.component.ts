import { Component, HostBinding, Input } from "@angular/core";
import { SurveyElement } from "survey-core";

@Component({
  templateUrl: "./errors.component.html",
  selector: "'[sv-ng-errors]'"
})
export class ErrorsComponent {
  @Input() element!: SurveyElement | any;
  @Input() location?: String;
  constructor() {}
  @HostBinding("attr.role") get role (): string {
    return "alert";
  }
  @HostBinding("id") get id(): string {
    return this.element.id + "_errors";
  }
  @HostBinding("attr.aria-live") get ariaLive(): string {
    return "polite";
  }
  @HostBinding("class") get class(): string {
    return this.element.cssError;
  }
}
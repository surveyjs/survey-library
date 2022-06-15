import { Component, DoCheck, ElementRef, HostBinding, Input, OnDestroy, OnInit, ViewChild, ViewContainerRef } from "@angular/core";
import { Base, SurveyElement, TooltipManager } from "survey-core";

@Component({
  templateUrl: "./errors.component.html",
  selector: "'[sv-ng-errors]'"
})
export class ErrorsComponent implements OnDestroy, OnInit {
  @Input() element!: SurveyElement | any;
  @Input() location!: String;
  @ViewChild("errorsContainer", { static: true }) errorsContainerRef!: ElementRef<HTMLDivElement>;
  private tooltipManager!: TooltipManager;
  constructor(private viewContainerRef: ViewContainerRef) {}
  ngOnInit(): void {
    if (this.location == "tooltip") {
      this.tooltipManager = new TooltipManager(this.viewContainerRef.element.nativeElement);
    }
  }
  ngOnDestroy() {
    if (!!this.tooltipManager) {
      this.tooltipManager.dispose();
    }
  }
  @HostBinding("role") get role (): string {
    return "alert";
  }
  @HostBinding("id") get id(): string {
    return this.element.id + "_errors";
  }
  @HostBinding("aria-live") get ariaLive(): string {
    return "polite";
  }
  @HostBinding("class") get class(): string {
    return this.element.cssError;
  }
}
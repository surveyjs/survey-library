import { Component, HostBinding, HostListener, Input } from "@angular/core";

@Component({
  selector: "'[sv-ng-element-header]'",
  templateUrl: "./element-header.component.html"
})
export class ElementHeaderComponent {
  @Input() element: any;
  constructor() {
  }
  @HostBinding("class") get rootClass(): string {
    return this.element.cssHeader;
  }
  @HostListener("click", ["$event"]) click(e: MouseEvent): void {
    if (this.element.clickTitleFunction !== undefined) {
      this.element.clickTitleFunction(e);
    }
  }
}
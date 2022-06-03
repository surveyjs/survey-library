import { Component, Input } from "@angular/core";

@Component({
  selector: "sv-ng-dynamic-head",
  templateUrl: "./dynamic-head.component.html"
})
export class DynamicHeadComponent {
  @Input() tagName!: string;
  @Input() className!: string;
  constructor() {
  }
}
import { Component, Input } from "@angular/core";

@Component({
  selector: "sv-ng-element-header",
  templateUrl: "./element-header.component.html"
})
export class ElementHeaderComponent {
  @Input() element: any;
  constructor() {
  }
}
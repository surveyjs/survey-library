import { Component, Input } from "@angular/core";
import { NoRootComponent } from "../../no-root-component";

@Component({
  selector: "sv-ng-element-title",
  templateUrl: "./element-title.component.html"
})
export class ElementTitleComponent extends NoRootComponent {
  @Input() element: any;
}
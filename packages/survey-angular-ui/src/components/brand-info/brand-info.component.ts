import { Component } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
@Component({
  selector: "sv-brand-info",
  templateUrl: "./brand-info.component.html"
})
export class BrandInfoComponent {}
AngularComponentFactory.Instance.registerComponent("sv-brand-info", BrandInfoComponent);
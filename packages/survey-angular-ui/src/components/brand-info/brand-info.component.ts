import { Component } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
@Component({
  selector: "sv-brand-info",
  templateUrl: "./brand-info.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class BrandInfoComponent extends EmbeddedViewContentComponent {}
AngularComponentFactory.Instance.registerComponent("sv-brand-info", BrandInfoComponent);
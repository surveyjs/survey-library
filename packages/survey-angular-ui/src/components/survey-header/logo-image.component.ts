import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../../component-factory";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { SurveyModel } from "survey-core";
@Component({
  selector: "sv-logo-image",
  templateUrl: "./logo-image.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class LogoImageComponent extends EmbeddedViewContentComponent {
  @Input() data!: SurveyModel;
  get survey(): SurveyModel {
    return this.data;
  }
}
AngularComponentFactory.Instance.registerComponent("sv-logo-image", LogoImageComponent);
import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "survey-angular-ui";
import { LocalizableString } from "survey-core";

@Component({
  selector: "sv-new-item-content",
  templateUrl: "./itemContentTemplateComponent.html"
})
export class AngularItemContentTemplateComponent {
  @Input() text!: LocalizableString;
  @Input() cssClasses: any;
}

AngularComponentFactory.Instance.registerComponent("new-item-content", AngularItemContentTemplateComponent);
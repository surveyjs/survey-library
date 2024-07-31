import { Component, Input } from "@angular/core";
import { TextAreaModel } from "survey-core";
import { AngularComponentFactory } from "../../component-factory";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";

@Component({
  selector: "sv-text-area",
  templateUrl: "./text-area.component.html"
})
export class TextAreaComponent extends EmbeddedViewContentComponent {
  @Input() model!: TextAreaModel;

  get value() {
    return this.model.getTextValue();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-text-area", TextAreaComponent);
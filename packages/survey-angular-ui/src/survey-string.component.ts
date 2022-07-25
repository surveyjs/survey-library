import { Component, Input } from "@angular/core";
import { LocalizableString } from "survey-core";

@Component(
  {
    selector: "sv-ng-string, '[sv-ng-string]'",
    template: "<ng-template [component]='{ name: model.renderAs, data: { model: model.renderAsData } }'></ng-template>"
  }
)
export class SurveyStringComponent {
  @Input() model!: LocalizableString;
}
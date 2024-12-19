import { Component, Input } from "@angular/core";
import { LocalizableString } from "survey-core";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";

@Component(
  {
    selector: "sv-ng-string, '[sv-ng-string]'",
    template: "<ng-template [component]='{ name: model.renderAs, data: { model: model.renderAsData } }'></ng-template>",
    styleUrls: ["./hide-host.scss"]
  }
)
export class SurveyStringComponent extends EmbeddedViewContentComponent {
  @Input() model!: LocalizableString;
}
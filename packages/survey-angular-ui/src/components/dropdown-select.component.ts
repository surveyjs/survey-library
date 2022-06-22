
import { Component, Input } from "@angular/core";
import { AngularComponentFactory } from "../component-factory";

import { RendererFactory } from "survey-core";

@Component({
  selector: "sv-ng-dropdown-select-question",
  templateUrl: "./dropdown-select.component.html"
})
export class DropdownSelectComponent {
    @Input() model: any;

    click(e: any) {
      this.model.onClick(e);
    }

    clear(e:any) {
      this.model.onClear(e);
    }
}

AngularComponentFactory.Instance.registerComponent("dropdown-select-question", DropdownSelectComponent);
RendererFactory.Instance.registerRenderer("dropdown", "select", "dropdown-select-question");

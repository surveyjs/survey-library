import { Component, Input } from "@angular/core";
import { BaseAngular } from "../../../base-angular";
import { AngularComponentFactory } from "../../../component-factory";
import { SurveyBaseProviders } from "../../../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "sv-ng-dropdown-option-item, '[sv-ng-dropdown-option-item]'",
  template: '<ng-template #template><option [value]="item.value" [disabled]="!item.isEnabled">{{ item.text }}</option><ng-template>',
})
export class DropdownOptionItemComponent extends BaseAngular {
  @Input() item: any;
  protected override onModelChanged(): void {
    if (!this.item.locText) return;
    this.item.locText.onChanged = () => {
      this.update();
    };
  }
  protected getModel() {
    return this.item;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-dropdown-option-item", DropdownOptionItemComponent);
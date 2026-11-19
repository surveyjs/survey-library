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
    const prevItem: any = this.previousModel;
    if (!!prevItem?.locText) {
      prevItem.locText.onChanged = () => {};
    }
    if (!this.item.locText) return;
    this.item.locText.onChanged = () => {
      this.update();
    };
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (!!this.item?.locText) {
      this.item.locText.onChanged = () => {};
    }
  }
  protected getModel() {
    return this.item;
  }
}

AngularComponentFactory.Instance.registerComponent("sv-dropdown-option-item", DropdownOptionItemComponent);
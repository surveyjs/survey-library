import { Component } from "@angular/core";
import { ActionDropdownViewModel, filterChipComponentName } from "survey-core";
import { ActionBarItemComponent } from "../action-bar/action-bar-item.component";
import { AngularComponentFactory } from "../../component-factory";

// A chip of the Filter Control: the standard action button with a trailing chevron while it opens a
// popup, and the popup right after the button (the popup is placed against its previous sibling).
@Component({
  selector: "sv-ng-filter-chip",
  templateUrl: "./filter-chip.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterChipComponent extends ActionBarItemComponent {
  private viewModel?: ActionDropdownViewModel;
  override ngOnInit(): void {
    super.ngOnInit();
    if (!!this.model && !!this.model.popupModel) {
      this.viewModel = new ActionDropdownViewModel(this.model);
    }
  }
  override ngOnDestroy(): void {
    if (!!this.viewModel) {
      this.viewModel.dispose();
      this.viewModel = undefined;
    }
    super.ngOnDestroy();
  }
}

AngularComponentFactory.Instance.registerComponent(filterChipComponentName, FilterChipComponent);

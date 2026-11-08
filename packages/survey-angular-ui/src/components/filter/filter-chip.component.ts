import { Component, Input } from "@angular/core";
import { Action, ActionDropdownViewModel, filterChipComponentName } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

// A chip of the Filter Control: the standard action button (sv-action-bar-item; its trailing chevron
// is the item's markerIconName), and the popup right after the button (the popup is placed against
// its previous sibling). Not an ActionBarItemComponent: the inner item sets the item's input element,
// and that class's ngAfterViewInit here, with no button of its own, would set it to undefined after.
@Component({
  selector: "sv-ng-filter-chip",
  templateUrl: "./filter-chip.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterChipComponent extends BaseAngular<Action> {
  @Input() model?: Action;
  private viewModel?: ActionDropdownViewModel;
  protected getModel(): Action {
    return this.model as Action;
  }
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

import { Component, Input } from "@angular/core";
import { ActionDropdownViewModel, FilterChip, filterChipComponentName } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

// A chip of the Filter Control (FilterChip): the standard action button (sv-action-bar-item; its
// trailing chevron is the item's markerIconName) and, while the chip can be cleared, its cross - a
// button of its own, which the theme draws over the chip's end. Its popup is drawn by the control,
// outside the chips row (see QuestionFilterModel.popupChips); the chip only shows that the popup is
// open. Not an ActionBarItemComponent: the inner item sets the item's input element - the
// button the popup stands against - and that class's ngAfterViewInit here, with no button of its own,
// would set it to undefined after.
@Component({
  selector: "sv-ng-filter-chip",
  templateUrl: "./filter-chip.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterChipComponent extends BaseAngular<FilterChip> {
  @Input() model?: FilterChip;
  private viewModel?: ActionDropdownViewModel;
  protected getModel(): FilterChip {
    return this.model as FilterChip;
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

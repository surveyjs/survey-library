import { Component } from "@angular/core";
import { Base, FilterFieldPopup, filterFieldPopupComponentName } from "survey-core";
import { FilterHolderComponent } from "./filter-holder.component";
import { AngularComponentFactory } from "../../component-factory";

// A badge's popup of the Filter Control: the search box (a long list, or one a value can be typed
// into), the title row with its link, the list or the operator and value, and Apply.
@Component({
  selector: "sv-ng-filter-field-popup",
  templateUrl: "./filter-field-popup.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterFieldPopupComponent extends FilterHolderComponent {
  // The holder empties a slot before it disposes what it held: this is never a disposed popup.
  public get popup(): FilterFieldPopup {
    const holder = this.holder;
    return !!holder ? holder.fieldPopup : undefined as any;
  }
  protected getWatchedModels(): Array<Base | undefined> {
    const popup = this.popup;
    return !!popup ? [popup.headerToolbar, popup.footerToolbar, popup.list] : [];
  }
  public onSearchInput(event: any): void {
    this.popup.list.filterString = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent(filterFieldPopupComponentName, FilterFieldPopupComponent);

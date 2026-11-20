import { Component } from "@angular/core";
import { Base, FilterSaveAsPopup, filterSaveAsPopupComponentName } from "survey-core";
import { FilterHolderComponent } from "./filter-holder.component";
import { AngularComponentFactory } from "../../component-factory";

// "Save as..."'s popup of the Filter Control: the new preset's name and Save.
@Component({
  selector: "sv-ng-filter-save-as-popup",
  templateUrl: "./filter-save-as-popup.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterSaveAsPopupComponent extends FilterHolderComponent {
  // The holder empties a slot before it disposes what it held: this is never a disposed popup.
  public get popup(): FilterSaveAsPopup {
    const holder = this.holder;
    return !!holder ? holder.saveAsPopup : undefined as any;
  }
  protected getWatchedModels(): Array<Base | undefined> {
    const popup = this.popup;
    return !!popup ? [popup.footerToolbar] : [];
  }
}

AngularComponentFactory.Instance.registerComponent(filterSaveAsPopupComponentName, FilterSaveAsPopupComponent);

import { Component } from "@angular/core";
import { Base, FilterModal, filterModalComponentName } from "survey-core";
import { FilterHolderComponent } from "./filter-holder.component";
import { AngularComponentFactory } from "../../component-factory";

// The Filters dialog's content: Search in Filters, the presets with Add New and Edit Selected, the text
// of a preset that does not decompose with Edit..., "nothing found" and the fields; its footer is the
// dialog's own.
@Component({
  selector: "sv-ng-filter-modal",
  templateUrl: "./filter-modal.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterModalComponent extends FilterHolderComponent {
  // The holder empties a slot before it disposes what it held: this is never a disposed dialog.
  public get modal(): FilterModal {
    const holder = this.holder;
    return !!holder ? holder.modal : undefined as any;
  }
  protected getWatchedModels(): Array<Base | undefined> {
    const modal = this.modal;
    return !!modal ? [modal, modal.presetsToolbar, modal.expressionToolbar] : [];
  }
  public onSearchInput(event: any): void {
    this.modal.filterText = event.target.value;
  }
}

AngularComponentFactory.Instance.registerComponent(filterModalComponentName, FilterModalComponent);

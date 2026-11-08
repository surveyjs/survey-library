import { Component, Input } from "@angular/core";
import { Action, FilterFieldPopup, ListModel, filterListItemComponentName, filterUIStrings } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

// An entry of a checkbox list of the Filter Control: drawn checked by the entry's active flag
// (FilterFieldPopup keeps it), with a remove button for a value the respondent typed. The "Add"
// entry is its text alone.
@Component({
  selector: "sv-ng-filter-list-item",
  templateUrl: "./filter-list-item.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterListItemComponent extends BaseAngular<Action> {
  @Input() model!: Action;
  @Input() listModel!: ListModel;
  protected getModel(): Action {
    return this.model;
  }
  public get popup(): FilterFieldPopup {
    return !!this.model && !!this.model.data ? this.model.data.popup : undefined as any;
  }
  public get css(): any {
    return this.popup.cssClasses;
  }
  public get removeTitle(): string {
    return filterUIStrings.removeValue;
  }
  public remove(event: any): void {
    event.stopPropagation();
    this.popup.removeCustomItem(this.model);
  }
}

AngularComponentFactory.Instance.registerComponent(filterListItemComponentName, FilterListItemComponent);

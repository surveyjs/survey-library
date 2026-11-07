import { Component, Input } from "@angular/core";
import { Action, FilterFieldPopup, ListModel, filterListItemComponentName, filterUIStrings, toCssClasses } from "survey-core";
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
  // The checkbox question's checkbox: its classes, so it is drawn the way the question draws one. The
  // check is always there, transparent while the entry is not checked - as in the question.
  public get checkCss(): string {
    return toCssClasses(this.css.listItemCheck, !!this.model.active && this.css.listItemCheckChecked,
      this.popup.isReadOnly && this.css.listItemCheckReadOnly);
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

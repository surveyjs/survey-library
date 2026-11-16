import { Component } from "@angular/core";
import { Base, FilterPresetDialog, filterPresetDialogComponentName } from "survey-core";
import { FilterHolderComponent } from "./filter-holder.component";
import { AngularComponentFactory } from "../../component-factory";

// New Preset and Edit Preset: the form - the name and the tagbox of Contains, or the text - and the
// dialog's survey - the fields' editors in a frame and the AI description with its Create or Edit; the
// footer is the dialog's own.
@Component({
  selector: "sv-ng-filter-preset-dialog",
  templateUrl: "./filter-preset-dialog.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterPresetDialogComponent extends FilterHolderComponent {
  // The holder empties a slot before it disposes what it held: this is never a disposed dialog.
  public get dialog(): FilterPresetDialog {
    const holder = this.holder;
    return !!holder ? holder.presetDialog : undefined as any;
  }
  protected getWatchedModels(): Array<Base | undefined> {
    return [this.dialog];
  }
  // The page is empty with no field picked and no description (see hasSurveyContent).
  public get hasFields(): boolean {
    return this.dialog.hasSurveyContent;
  }
}

AngularComponentFactory.Instance.registerComponent(filterPresetDialogComponentName, FilterPresetDialogComponent);

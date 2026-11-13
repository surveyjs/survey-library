import { Component } from "@angular/core";
import { Base, FilterEditPresetsDialog, FilterPresetDialog, filterPresetDialogComponentName, filterUIStrings } from "survey-core";
import { FilterHolderComponent } from "./filter-holder.component";
import { AngularComponentFactory } from "../../component-factory";

// Add New Preset and Edit Presets: the tabs (Edit Presets only), the form, the dialog's survey - the
// fields' editors in a frame and, for an AI preset's tab, the description and Make Changes - and the
// preset's actions (Edit Presets only); the footer is the dialog's own.
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
  public get edit(): FilterEditPresetsDialog {
    const dialog = this.dialog;
    return dialog instanceof FilterEditPresetsDialog ? dialog : undefined as any;
  }
  protected getWatchedModels(): Array<Base | undefined> {
    const edit = this.edit;
    return [this.dialog, edit?.tabsToolbar, edit?.actionsToolbar];
  }
  // The page is empty with no field picked and no description (see hasSurveyContent).
  public get hasFields(): boolean {
    return this.dialog.hasSurveyContent;
  }
  public get actionsTitle(): string {
    return filterUIStrings.presetActions;
  }
}

AngularComponentFactory.Instance.registerComponent(filterPresetDialogComponentName, FilterPresetDialogComponent);

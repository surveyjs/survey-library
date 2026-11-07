import { Component } from "@angular/core";
import { Base, FilterEditPresetsDialog, FilterPresetDialog, filterPresetDialogComponentName, filterUIStrings, toCssClasses } from "survey-core";
import { FilterHolderComponent } from "./filter-holder.component";
import { AngularComponentFactory } from "../../component-factory";

// Add New Preset and Edit Presets: the tabs (Edit Presets only), the form, the fields' editors in a
// frame, the description of an AI preset and the preset's actions (Edit Presets only); the footer is
// the dialog's own.
@Component({
  selector: "sv-ng-filter-preset-dialog",
  templateUrl: "./filter-preset-dialog.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterPresetDialogComponent extends FilterHolderComponent {
  public get dialog(): FilterPresetDialog {
    const holder = this.holder;
    return !!holder && !!holder.presetDialog && !holder.presetDialog.isDisposed ? holder.presetDialog : undefined as any;
  }
  public get edit(): FilterEditPresetsDialog {
    const dialog = this.dialog;
    return dialog instanceof FilterEditPresetsDialog ? dialog : undefined as any;
  }
  protected getWatchedModels(): Array<Base | undefined> {
    const edit = this.edit;
    return [this.dialog, edit?.tabsToolbar, edit?.actionsToolbar];
  }
  public get css(): any {
    return this.holder.cssClasses;
  }
  public get contentCss(): string {
    return toCssClasses(this.css.modalContent, this.css.presetContent);
  }
  public get formCss(): string {
    return toCssClasses(this.css.editor, this.css.presetForm);
  }
  public get editorCss(): string {
    return toCssClasses(this.css.editor, this.css.modalEditor);
  }
  public get actionsTitle(): string {
    return filterUIStrings.presetActions;
  }
}

AngularComponentFactory.Instance.registerComponent(filterPresetDialogComponentName, FilterPresetDialogComponent);

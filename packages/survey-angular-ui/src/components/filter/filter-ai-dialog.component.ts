import { Component } from "@angular/core";
import { Base, FilterAIDialog, filterAIDialogComponentName, toCssClasses } from "survey-core";
import { FilterHolderComponent } from "./filter-holder.component";
import { AngularComponentFactory } from "../../component-factory";

// Create custom filter: the model's filter as the fields' editors, over the description and its
// button; the footer is the dialog's own. Its editors are made anew for every answer.
@Component({
  selector: "sv-ng-filter-ai-dialog",
  templateUrl: "./filter-ai-dialog.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class FilterAIDialogComponent extends FilterHolderComponent {
  public get dialog(): FilterAIDialog {
    const holder = this.holder;
    return !!holder && !!holder.aiDialog && !holder.aiDialog.isDisposed ? holder.aiDialog : undefined as any;
  }
  protected getWatchedModels(): Array<Base | undefined> {
    return [this.dialog];
  }
  public get css(): any {
    return this.holder.cssClasses;
  }
  public get contentCss(): string {
    return toCssClasses(this.css.modalContent, this.css.aiContent);
  }
  public get editorCss(): string {
    return toCssClasses(this.css.editor, this.css.modalEditor);
  }
}

AngularComponentFactory.Instance.registerComponent(filterAIDialogComponentName, FilterAIDialogComponent);

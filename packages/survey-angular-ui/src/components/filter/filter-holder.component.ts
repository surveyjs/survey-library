import { Component, Input } from "@angular/core";
import { Base, FilterEditorHolder } from "survey-core";
import { BaseAngular } from "../../base-angular";

// The content of a popup or a dialog of the Filter Control. Its model is the holder: an emptied
// holder unmounts the content before survey-core disposes what it held. What the content shows
// besides - the dialog itself and its toolbars - is watched too: BaseAngular watches one model.
@Component({
  template: ""
})
export abstract class FilterHolderComponent extends BaseAngular<FilterEditorHolder> {
  @Input() holder!: FilterEditorHolder;
  private watchedModels: Array<Base> = [];
  protected getModel(): FilterEditorHolder {
    return this.holder;
  }
  // The models whose properties the template reads, besides the holder.
  protected abstract getWatchedModels(): Array<Base | undefined>;
  private onWatchedModelChanged = (): void => {
    this.update();
  };
  private updateWatchedModels(): void {
    const models = <Array<Base>>this.getWatchedModels().filter((model: Base | undefined) => !!model && !model.isDisposed);
    this.watchedModels.filter((model: Base) => models.indexOf(model) < 0).forEach((model: Base) => this.unwatch(model));
    models.filter((model: Base) => this.watchedModels.indexOf(model) < 0).forEach((model: Base) => {
      model.addOnPropertyValueChangedCallback(this.onWatchedModelChanged);
      model.addOnArrayChangedCallback(this.onWatchedModelChanged);
    });
    this.watchedModels = models;
  }
  private unwatch(model: Base): void {
    model.removeOnPropertyValueChangedCallback(this.onWatchedModelChanged);
    model.removeOnArrayChangedCallback(this.onWatchedModelChanged);
  }
  override ngDoCheck(): void {
    super.ngDoCheck();
    this.updateWatchedModels();
  }
  protected override afterUpdate(isSync: boolean = false): void {
    super.afterUpdate(isSync);
    this.updateWatchedModels();
  }
  override ngOnDestroy(): void {
    this.watchedModels.forEach((model: Base) => this.unwatch(model));
    this.watchedModels = [];
    super.ngOnDestroy();
  }
}

import { ChangeDetectorRef, Component, DoCheck, OnDestroy, ViewContainerRef } from "@angular/core";
import { Base, IPropertyArrayValueChangedEvent, ISurvey } from "survey-core";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";
import { IPropertyValueChangedEvent } from "survey-core/typings/src/base";

@Component({
  template: ""
})
export abstract class BaseAngular<T extends Base = Base> extends EmbeddedViewContentComponent implements DoCheck, OnDestroy {
  constructor(protected changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef) {
    super(viewContainerRef);
  }
  protected get surveyModel(): ISurvey {
    return this.getModel().getSurvey();
  }
  protected abstract getModel(): T;
  protected previousModel?: T;
  private isModelSubsribed: boolean = false;

  public ngDoCheck(): void {
    if (this.previousModel !== this.getModel()) {
      this.unMakeBaseElementAngular(this.previousModel);
      this.makeBaseElementAngular(this.getModel());
      this.onModelChanged();
      this.previousModel = this.getModel();
    }
    this.setIsModelRendering(true);
  }

  protected onModelChanged() { }

  private setIsModelRendering(val: boolean) {
    const model = this.getModel();
    if (!!model) {
      (<any>model).isRendering = val;
    }
  }
  private getIsModelRendering(stateElement?: Base) {
    const model = stateElement ?? this.getModel();
    return !!model && !!(<any>model).isRendering;
  }
  private isDestroyed: boolean = false;
  ngOnDestroy() {
    this.isDestroyed = true;
    this.unMakeBaseElementAngular(this.getModel());
    this.previousModel = undefined;
  }
  protected isBaseElementSubsribed(stateElement: Base) {
    return !!(<any>stateElement).__ngImplemented;
  }
  private onArrayChangedCallback = (stateElement: Base, options: IPropertyArrayValueChangedEvent) => {
    this.update(options.name);
  };
  private onPropertyChangedCallback = (stateElement: Base, options: IPropertyValueChangedEvent) => {
    this.update(options.name);
  };
  private afterViewCheckedCallback?: () => void;
  private makeBaseElementAngular(stateElement: T) {
    if (!!stateElement && !this.getIsModelRendering(stateElement)) {
      this.isModelSubsribed = true;
      this.afterViewCheckedCallback = () => {
        delete (<any>stateElement).__ngImplementLock;
      };
      stateElement.addOnArrayChangedCallback(this.onArrayChangedCallback);
      stateElement.addOnPropertyValueChangedCallback(this.onPropertyChangedCallback);
      stateElement.enableOnElementRerenderedEvent();
    }
  }
  private unMakeBaseElementAngular(stateElement?: Base) {
    if (!!stateElement && this.isModelSubsribed) {
      this.isModelSubsribed = false;
      stateElement.removeOnPropertyValueChangedCallback(this.onPropertyChangedCallback);
      stateElement.removeOnArrayChangedCallback(this.onArrayChangedCallback);
      stateElement.disableOnElementRerenderedEvent();
    }
  }
  private isUpdatesBlocked: boolean = false;

  protected update(key?: string): void {
    if (this.getIsModelRendering() || this.isUpdatesBlocked) return;
    if (key && this.getPropertiesToUpdateSync().indexOf(key) > -1) {
      this.beforeUpdate();
      this.detectChanges();
      this.afterUpdate(true);
    } else {
      this.isUpdatesBlocked = true;
      queueMicrotask(() => {
        if (!this.isDestroyed) {
          this.isUpdatesBlocked = false;
          this.beforeUpdate();
          this.detectChanges();
          this.afterUpdate();
        }
      });
    }
  }
  private getChangeDetectorRef() {
    return this.embeddedView ? this.embeddedView : this.changeDetectorRef;
  }
  protected getPropertiesToUpdateSync(): Array<string> {
    return [];
  }
  protected detectChanges() {
    this.getChangeDetectorRef().detectChanges();
  }

  protected getShouldReattachChangeDetector(): boolean {
    return true;
  }

  protected beforeUpdate(): void {
    this.setIsModelRendering(true);
  }
  protected afterUpdate(isSync: boolean = false): void {
    this.setIsModelRendering(false);
    const model = this.getModel();
    if (model && !this.isDestroyed) {
      model.afterRerender();
    }
  }
  ngAfterViewChecked(): void {
    this.afterViewCheckedCallback && this.afterViewCheckedCallback();
    this.setIsModelRendering(false);
  }
}
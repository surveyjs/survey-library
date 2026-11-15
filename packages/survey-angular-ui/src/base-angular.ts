import { ChangeDetectorRef, Component, DoCheck, Inject, OnChanges, OnDestroy, Optional, SimpleChanges, ViewContainerRef } from "@angular/core";
import { Base, IPropertyArrayValueChangedEvent, ISurvey } from "survey-core";
import { EmbeddedViewContentComponent } from "./embedded-view-content.component";
import { IPropertyAccessTracker, PropertyAccessTracker } from "survey-core";
import { getUpdateManager, IUpdateTask } from "./update-manager";
import { COMPONENT_DEPTH, SurveyBaseProviders } from "./component-depth";

const wrappedHookKey = "__surveyRunWithUpdateAccess";
function wrapAfterViewInitHooks(instance: any): void {
  const resolvedHook = instance.ngAfterViewInit;
  if (typeof resolvedHook !== "function" || resolvedHook[wrappedHookKey]) return;
  let proto = Object.getPrototypeOf(instance);
  while(!!proto && proto !== Object.prototype) {
    if (Object.prototype.hasOwnProperty.call(proto, "ngAfterViewInit")) {
      const hook = proto.ngAfterViewInit;
      if (typeof hook === "function" && !hook[wrappedHookKey]) {
        const wrapped = function (this: any, ...args: Array<any>) {
          return Base.runWithUpdateAccess(() => hook.apply(this, args));
        };
        (<any>wrapped)[wrappedHookKey] = true;
        proto.ngAfterViewInit = wrapped;
      }
    }
    proto = Object.getPrototypeOf(proto);
  }
}

@Component({
  template: "",
  providers: SurveyBaseProviders
})
export class TrackingComponent extends EmbeddedViewContentComponent implements DoCheck, OnDestroy, OnChanges {
  protected readonly depth: number;
  protected updateTask: IUpdateTask;
  private propertyAccessTracker: IPropertyAccessTracker = new PropertyAccessTracker((model, options) => this.update(model, options));
  private hasInputChanges: boolean = true;
  constructor(protected changeDetectorRef: ChangeDetectorRef, viewContainerRef?: ViewContainerRef, @Optional() @Inject(COMPONENT_DEPTH) depth?: number | null) {
    super(viewContainerRef);
    wrapAfterViewInitHooks(this);
    this.changeDetectorRef.detach();
    this.depth = depth ?? 0;
    this.updateTask = {
      priority: this.depth,
      callback: () => this.detectChanges(false)
    };
  }
  protected update(model?: Base, options?: IPropertyArrayValueChangedEvent): void {
    const manger = getUpdateManager();
    if (manger.hasTask(this.updateTask)) return;
    manger.addTask(this.updateTask);
  }
  override ngOnInit() {
    super.ngOnInit();
    this.embeddedView?.detach();
  }
  protected detectChanges(isSync: boolean = true) {
    getUpdateManager().completeTask(this.updateTask);
    this.beforeUpdate();
    this.propertyAccessTracker.startTracking();
    this.embeddedView?.detectChanges();
    this.changeDetectorRef.detectChanges();
    this.propertyAccessTracker.stopTracking();
    this.propertyAccessTracker.subscribe();
    Base.runWithUpdateAccess(() => {
      this.afterUpdate(isSync);
    });
  }
  protected beforeUpdate(): void {
  }
  protected afterUpdate(isSync: boolean = false): void {}

  ngOnChanges(changes?: SimpleChanges): void {
    this.hasInputChanges = true;
  }
  public override ngDoCheck(): void {
    if (this.hasInputChanges) {
      this.hasInputChanges = false;
      this.detectChanges();
    }
  }
  ngOnDestroy() {
    getUpdateManager().removeTask(this.updateTask);
    this.propertyAccessTracker.unsubscribe();
  }
}

@Component({
  template: "",
  providers: SurveyBaseProviders
})
export abstract class BaseAngular<T extends Base = Base> extends TrackingComponent {
  protected abstract getModel(): T;
  protected previousModel?: T;
  private syncModel(): void {
    const model = this.getModel();
    if (this.previousModel === model) return;
    this.previousModel?.disableOnElementRerenderedEvent();
    this.getModel()?.enableOnElementRerenderedEvent();
    this.onModelChanged();
    this.previousModel = model;
  }
  protected onModelChanged() { }
  protected get surveyModel(): ISurvey {
    return this.getModel().getSurvey();
  }
  protected isBaseElementSubsribed(stateElement: Base) {
    return ((<any>stateElement).__ngImplementedCount ?? 0) > 0;
  }
  protected getPropertiesToUpdateSync(): Array<string> {
    return [];
  }
  protected override update(model?: Base, options?: IPropertyArrayValueChangedEvent): void {
    const manger = getUpdateManager();
    if (manger.hasTask(this.updateTask)) return;
    const key = options?.name;
    if (model === this.getModel() && key && this.getPropertiesToUpdateSync().indexOf(key) > -1) {
      this.detectChanges();
      this.getModel()?.afterRerender();
    } else {
      this.updateTask.after = this.getModel()?.afterRerenderCallback;
      manger.addTask(this.updateTask);
    }
  }
  public override ngDoCheck(): void {
    this.syncModel();
    super.ngDoCheck();
  }
  override ngOnDestroy() {
    super.ngOnDestroy();
    this.getModel()?.disableOnElementRerenderedEvent();
    this.previousModel = undefined;
  }
}
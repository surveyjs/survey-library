import { ApplicationRef, ChangeDetectorRef, Component, ComponentFactoryResolver, Injector, Input, ViewContainerRef } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { PopupBaseViewModel } from "survey-core";
import { PopupContainerComponent } from "./popup-container.component";
import { ComponentPortal, DomPortalOutlet } from "@angular/cdk/portal";

@Component({
  selector: "sv-ng-popup, '[sv-ng-popup]'",
  template: "<div></div>"
})

export class PopupComponent extends BaseAngular {
  @Input() popupModel: any;

  public model: any;
  private portal!: ComponentPortal<PopupContainerComponent>;
  private portalHost!: DomPortalOutlet;

  protected getModel() {
    return this.popupModel;
  }

  constructor(public viewContainerRef: ViewContainerRef, changeDetectorRef: ChangeDetectorRef, private applicationRef: ApplicationRef, private componentFactoryResolver: ComponentFactoryResolver, private injector: Injector) {
    super(changeDetectorRef);
  }

  ngOnInit() {
    this.model = new PopupBaseViewModel(this.popupModel, this.viewContainerRef.element.nativeElement.parentElement);
    this.model.initializePopupContainer();
    this.popupModel.onVisibilityChanged.add((sender: any, option: { isVisible: boolean }) => {
      if (option.isVisible) {
        this.model.updateOnShowing();
      }
    });

    this.portalHost = new DomPortalOutlet(this.model.container, this.componentFactoryResolver, this.applicationRef, this.injector);
    this.portal = new ComponentPortal(PopupContainerComponent);
    const componentRef = this.portalHost.attach(this.portal);
    componentRef.instance.model = this.model;
    componentRef.instance.createAndBindPopupContent();
  }

  override ngOnDestroy() {
    super.ngOnDestroy();
    this.portalHost.detach();
    (<HTMLElement>this.model.container).remove();
    this.model.unmountPopupContainer();
  }
}
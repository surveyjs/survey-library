import { ApplicationRef, ComponentFactoryResolver, Injectable, Injector, VERSION } from "@angular/core";
import { ComponentPortal, DomPortalOutlet } from "@angular/cdk/portal";
import { PopupBaseViewModel } from "survey-core";
import { PopupBaseContainerComponent } from "./popup-container.component";

@Injectable()
export class PopupService {
  constructor(private injector: Injector,
              private applicationRef: ApplicationRef,
              private componentFactoryResolver: ComponentFactoryResolver) {}

  createComponent(popupViewModel: PopupBaseViewModel): DomPortalOutlet {
    let portalHost: DomPortalOutlet;
    if (Number.parseInt(VERSION.major) > 19) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      portalHost = new DomPortalOutlet(popupViewModel.container, this.applicationRef, this.injector);
    } else {
      portalHost = new DomPortalOutlet(popupViewModel.container, this.componentFactoryResolver, this.applicationRef, this.injector);
    }
    const portal = new ComponentPortal(PopupBaseContainerComponent);
    const componentRef = portalHost.attach(portal);
    popupViewModel.setComponentElement(<HTMLElement>popupViewModel.container.children[0]);
    componentRef.instance.model = popupViewModel;
    componentRef.changeDetectorRef.detectChanges();
    return portalHost;
  }
}
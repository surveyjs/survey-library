import { ApplicationRef, Injectable, Injector, SimpleChange, VERSION } from "@angular/core";
import { ComponentPortal, DomPortalOutlet } from "@angular/cdk/portal";
import { PopupBaseViewModel } from "survey-core";
import { PopupBaseContainerComponent } from "./popup-container.component";
import { NgModuleRef } from "@angular/core";

@Injectable()
export class PopupService {
  constructor(private injector: Injector,
              private applicationRef: ApplicationRef) {}

  createComponent(popupViewModel: PopupBaseViewModel): DomPortalOutlet {
    let portalHost: DomPortalOutlet;
    if (Number.parseInt(VERSION.major) > 19) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      //@ts-ignore
      portalHost = new DomPortalOutlet(popupViewModel.container, this.applicationRef, this.injector);
    } else {
      const resolver = (this.injector.get(NgModuleRef) as any).componentFactoryResolver;
      portalHost = new DomPortalOutlet(popupViewModel.container, resolver, this.applicationRef, this.injector);
    }
    const portal = new ComponentPortal(PopupBaseContainerComponent);
    const componentRef = portalHost.attach(portal);
    popupViewModel.setComponentElement(<HTMLElement>popupViewModel.container.children[0]);
    const container = componentRef.instance;
    container.model = popupViewModel;
    // A component attached to ApplicationRef is a root component. Angular doesn't run its
    // ngOnChanges (the input is set directly) and, in Angular 12, doesn't run ngDoCheck either,
    // so reproduce the regular flow: ngOnChanges -> ngDoCheck -> view refresh and model subscription.
    container.ngOnChanges({ model: new SimpleChange(undefined, popupViewModel, true) });
    container.ngDoCheck();
    return portalHost;
  }
}
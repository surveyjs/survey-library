import { ScrollViewModel } from "survey-core";
import { Component, ElementRef, OnDestroy, ViewChild, AfterViewInit, ViewContainerRef, Input } from "@angular/core";
import { EmbeddedViewContentComponent } from "../../embedded-view-content.component";
import { AngularComponentFactory } from "./../../component-factory";

@Component({
  selector: "sv-scroll",
  templateUrl: "./scroll.component.html",
  styles: [":host { display: none; }"]
})
export class ScrollComponent extends EmbeddedViewContentComponent implements AfterViewInit, OnDestroy {
  public model!: ScrollViewModel;
  @Input() disabled?: boolean;
  @ViewChild("container") container: ElementRef<HTMLElement> | undefined;
  constructor(viewContainerRef?: ViewContainerRef) {
    super(viewContainerRef);
    this.model = new ScrollViewModel();
  }
  ngAfterViewInit() {
    this.model.setRootElement(this.container?.nativeElement as HTMLDivElement);
  }
  ngOnDestroy(): void {
    this.model.setRootElement(undefined as any);
    this.model.unsubscribeRootElement();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-scroll", ScrollComponent);
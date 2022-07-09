import { AfterViewInit, ChangeDetectorRef, Component, EmbeddedViewRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  template: "<ng-template #template> content </ng-template>",
  selector: "ng-no-root",
})

export class NoRootComponent implements OnInit {
  @ViewChild("template", { read: TemplateRef, static: true }) templateRef!: TemplateRef<HTMLElement>
  protected viewChangeDetector?: ChangeDetectorRef;
  protected embeddedView?: EmbeddedViewRef<HTMLElement>;
  constructor(protected viewContainerRef?: ViewContainerRef) {}

  ngOnInit(): void {
    if(!!this.templateRef) {
      this.embeddedView = this.viewContainerRef?.createEmbeddedView(this.templateRef);
    }
  }
}
import { Component, EmbeddedViewRef, OnInit, TemplateRef, ViewChild, ViewContainerRef } from "@angular/core";

@Component({
  template: "",
})

export class EmbeddedViewContentComponent implements OnInit {
  @ViewChild("template", { read: TemplateRef, static: true }) templateRef!: TemplateRef<HTMLElement>
  protected embeddedView?: EmbeddedViewRef<HTMLElement>;
  constructor(protected viewContainerRef?: ViewContainerRef) {}

  ngOnInit(): void {
    if(!!this.templateRef) {
      this.embeddedView = this.viewContainerRef?.createEmbeddedView(this.templateRef);
    }
  }
}
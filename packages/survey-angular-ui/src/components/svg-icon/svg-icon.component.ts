import { Component, HostBinding, Input, OnChanges, ViewContainerRef } from "@angular/core";
import * as Survey from "survey-core";

@Component({
  selector: "'[sv-ng-svg-icon]'",
  template: ""
})
export class SvgIconComponent implements OnChanges {
  @Input() size?: number | string;
  @Input() width?: number;
  @Input() height?: number;
  @Input() iconName!: string;
  @Input() partCss?: string;
  @Input() css?: string;
  @Input() title?: string;
  constructor(private viewContaierRef: ViewContainerRef) {
  }
  private createSvg() {
    if(!!this.iconName) {
      (Survey as any).createSvg(
        this.size,
        this.width,
        this.height,
        this.iconName,
        this.viewContaierRef.element.nativeElement,
        this.title
      );
    }
  }
  @HostBinding("class") get rootClass(): string {
    let className = "sv-svg-icon";
    if(!this.css && !!this.partCss) {
      className += " " + this.partCss;
    } else if(!!this.css) {
      className = this.css;
    }
    return className;
  }
  @HostBinding("[attr.role]") get rootRole(): string {
    return "img";
  }
  ngOnChanges(): void {
    const el = this.viewContaierRef.element.nativeElement;
    el.innerHTML = "";
    el.appendChild(document.createElementNS("http://www.w3.org/2000/svg", "use"));
    this.createSvg();
  }
}
import { SvgRegistry } from "survey-core";
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from "@angular/core";
@Component({
  selector: "sv-svg-bundle",
  template: "<svg id='sv-icon-holder-global-container' #svgContainer></svg>",
  styles: [":host { display: none; }"]
})
export class SvgBundleComponent implements OnInit, OnDestroy {
  @ViewChild("svgContainer", { static: true }) svgContainer!: ElementRef<SVGElement>;
  private onIconsChanged = () => {
    if (!!this.svgContainer?.nativeElement) {
      this.svgContainer.nativeElement.innerHTML = SvgRegistry.iconsRenderedHtml();
    }
  }
  ngOnInit(): void {
    this.onIconsChanged();
    SvgRegistry.onIconsChanged.add(this.onIconsChanged);
  }
  ngOnDestroy(): void {
    SvgRegistry.onIconsChanged.remove(this.onIconsChanged);
  }

}
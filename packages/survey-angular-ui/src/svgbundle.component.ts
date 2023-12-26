import { SvgRegistry } from "survey-core";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
@Component({
  selector: "sv-svg-bundle",
  template: "<svg id='sv-icon-holder-global-container' #svgContainer></svg>",
  styles: [":host { display: none; }"]
})
export class SvgBundleComponent implements OnInit {
  @ViewChild("svgContainer", { static: true }) svgContainer!: ElementRef<SVGElement>;
  ngOnInit(): void {
    this.svgContainer.nativeElement.innerHTML = SvgRegistry.iconsRenderedHtml();
  }
}
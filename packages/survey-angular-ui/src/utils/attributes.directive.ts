import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
  selector: "[attributesDirective]"
})

export class AttributesDirective implements OnChanges {
  constructor(private element: ElementRef) { }
  @Input("attributesDirective") attributes!: { [key: string]: any };

  ngOnChanges(changes: SimpleChanges): void {
    const attributes = this.attributes;
    if (!changes["attributes"] || !attributes) return;

    const nativeElement = this.element.nativeElement;
    for (const [key, value] of Object.entries(attributes)) {
      if (value !== null && typeof value !== "undefined") {
        nativeElement.setAttribute(key, value);
      }
    }
  }
}
import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from "@angular/core";

@Directive({
  selector: "[visible]"
})
export class VisibleDirective implements OnChanges {
  constructor(private el: ElementRef) { }
  @Input() visible?: boolean;
  ngOnChanges(changes: SimpleChanges): void {
    changes["visible"].currentValue ? this.show() : this.hide();
  }
  private hide() {
    this.el.nativeElement.style.display = "none";
  }
  private show() {
    this.el.nativeElement.style.display = "";
  }
}
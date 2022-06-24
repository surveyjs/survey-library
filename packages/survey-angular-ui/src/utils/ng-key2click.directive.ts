import { Directive, ElementRef, Input, SimpleChanges, } from "@angular/core";
import { doKey2ClickDown, doKey2ClickUp, doKey2ClickBlur } from "survey-core";

@Directive({
  selector: "[key2click]"
})
export class Key2ClickDirective {
  options?: { processEsc: boolean } = { processEsc: true };
  @Input() key2click?: { processEsc?: boolean };

  constructor(private el: ElementRef) {
    const element = this.el.nativeElement;
    // const options = this.key2click || { processEsc: true };
    // if (this.ngModel.model.disableTabStop) {
    //   element.tabIndex = -1;
    //   return;
    // }
    element.tabIndex = 0;
    element.onkeyup = (evt: any) => {
      evt.preventDefault();
      evt.stopPropagation();
      doKey2ClickUp(evt, this.options);
      return false;
    };
    element.onkeydown = (evt: any) => doKey2ClickDown(evt, this.options);
    element.onblur = (evt: any) => doKey2ClickBlur(evt);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.options = changes["key2click"].currentValue;
  }
}
import { Directive, ElementRef, Input, SimpleChanges, OnChanges, OnDestroy } from "@angular/core";
import { doKey2ClickDown, doKey2ClickUp, doKey2ClickBlur, IAttachKey2clickOptions } from "survey-core";

@Directive({
  selector: "[key2click]"
})
export class Key2ClickDirective implements OnChanges, OnDestroy {
  static defaultOptions: IAttachKey2clickOptions = { processEsc: true, disableTabStop: false };
  private isSubscribed = false;

  options?: IAttachKey2clickOptions = { ...Key2ClickDirective.defaultOptions };
  @Input() key2click?: IAttachKey2clickOptions;

  private onkeydown (evt: any) {
    doKey2ClickDown(evt, this.options);
  }
  private onkeyup = (evt: any) => {
    evt.preventDefault();
    evt.stopPropagation();
    doKey2ClickUp(evt, this.options);
    return false;
  }
  private blur (evt: any) {
    doKey2ClickBlur(evt);
  }
  constructor(private el: ElementRef) {
    this.subscribeEventListeners();
  }

  get element() {
    return this.el.nativeElement;
  }

  subscribeEventListeners() {
    if(this.isSubscribed) return;

    this.element.tabIndex = 0;
    this.element.addEventListener("keyup", this.onkeyup.bind(this));
    this.element.addEventListener("keydown", this.onkeydown.bind(this));
    this.element.addEventListener("blur", this.blur);

    this.isSubscribed = true;
  }
  unsubscribeEventListeners() {
    if(!this.isSubscribed) return;

    this.element.tabIndex = -1;
    this.element.removeEventListener("keyup", this.onkeyup.bind(this));
    this.element.removeEventListener("keydown", this.onkeydown.bind(this));
    this.element.removeEventListener("blur", this.blur);

    this.isSubscribed = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    const curValue = changes["key2click"].currentValue;
    if(curValue.disableTabStop) {
      this.unsubscribeEventListeners();
    } else {
      this.subscribeEventListeners();
    }
    this.options = Object.assign({}, Key2ClickDirective.defaultOptions, curValue);
  }

  ngOnDestroy(): void {
    this.unsubscribeEventListeners();
  }
}
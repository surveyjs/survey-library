import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Question } from "survey-core";
import { ImplementorBase } from "./implementor-base";

@Component({
  selector: "element, sv-ng-element, '[sv-ng-element]'",
  templateUrl: "./element.component.html",
  styleUrls: ["./element.component.scss"]
})
export class ElementComponent {
  @Input() model: any;
  @ViewChild("elementContainer") rootEl?: ElementRef<HTMLDivElement>;
  constructor() {
  }
  ngOnChanges(changes: any): void {
    new ImplementorBase(changes.model.currentValue);
  }
  ngAfterViewInit(): void {
    this.model?.isQuestion && (<Question>this.model).afterRender(this.rootEl?.nativeElement);
  }
}
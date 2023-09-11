import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { Action } from "survey-core";
import { BaseAngular } from "../../base-angular";
import { AngularComponentFactory } from "../../component-factory";

@Component({
  selector: "sv-ng-list, '[sv-ng-list]'",
  templateUrl: "./list.component.html",
  styleUrls: ["../../hide-host.scss"]
})
export class ListComponent extends BaseAngular implements AfterViewInit {
  @Input() model: any;
  @ViewChild("listContainerElement") listContainerElement!: ElementRef<HTMLDivElement>;

  trackItemBy = (_: any, item: Action) => {
    return item.id;
  }
  getModel() {
    return this.model;
  }
  onGoToItems(event: Event): void {
    this.model.goToItems(event);
  }
  onMouseDown(event: Event): void {
    event.preventDefault();
  }
  onKeyDown(event: Event): void {
    this.model.onKeyDown(event);
  }
  onMouseMove(event: Event): void {
    this.model.onMouseMove(event);
  }
  protected override getPropertiesToUpdateSync(): string[] {
    return ["renderElements"];
  }
  ngAfterViewInit(): void {
    if (!!this.listContainerElement?.nativeElement) {
      this.model.initListContainerHtmlElement(this.listContainerElement.nativeElement);
    }
  }
  override ngOnDestroy(): void {
    this.model.initListContainerHtmlElement(undefined as any);
    super.ngOnDestroy();
  }
}

AngularComponentFactory.Instance.registerComponent("sv-list", ListComponent);
import { AfterViewInit, Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { ItemValue } from "survey-core";
import { AngularComponentFactory } from "../component-factory";

@Component({
  selector: "['sv-ng-selectbase-item'], sv-ng-selebase-item",
  templateUrl: "./selectbase-item.html",
  styles: [":host { display: none; }"]
})
export class SelectBaseItemComponent extends BaseAngular<ItemValue> implements AfterViewInit {

  @Input() question!: any;
  @Input() model!: ItemValue | any;
  @Input() inputType!: string;
  @Input() showLabel: boolean = true;
  @ViewChild("container", { read: ElementRef }) container!: ElementRef<HTMLDivElement>
  protected getModel(): ItemValue {
    return this.model;
  }
  protected override onModelChanged(): void {
    super.onModelChanged();
    if(!this.question.isDesignMode) {
      if(this.previousModel) {
        this.previousModel.setRootElement(undefined as any);
      }
      if(this.model && this.container?.nativeElement) {
        this.model.setRootElement(this.container.nativeElement)
      }
    }
  }
  ngAfterViewInit(): void {
    if(this.model && this.container?.nativeElement && !this.question.isDesignMode) {
      this.model.setRootElement(this.container.nativeElement)
    }
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if(this.model && !this.question.isDesignMode) {
      this.model.setRootElement(undefined);
    }
  }
}

AngularComponentFactory.Instance.registerComponent("sv-ng-selectbase-item", SelectBaseItemComponent);
import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../base-angular";
import { ChoiceItem } from "survey-core";
import { AngularComponentFactory } from "../component-factory";
import { SurveyBaseProviders } from "../component-depth";

@Component({
  providers: SurveyBaseProviders,
  selector: "['sv-ng-selectbase-item'], sv-ng-selebase-item",
  templateUrl: "./selectbase-item.html",
  styles: [":host { display: none; }"]
})
export class SelectBaseItemComponent extends BaseAngular<ChoiceItem> {

  @Input() question!: any;
  @Input() model!: ChoiceItem | any;
  @Input() inputType!: string;
  @Input() showLabel: boolean = true;
  @Input() ariaLabel?: string;
  @ViewChild("container", { read: ElementRef }) container!: ElementRef<HTMLDivElement>;
  protected getModel(): ChoiceItem {
    return this.model;
  }
  protected override onModelChanged(): void {
    super.onModelChanged();
    if (!this.question.isDesignMode) {
      if (this.previousModel) {
        this.previousModel.setRootElement(undefined as any);
      }
      if (this.model && this.container?.nativeElement) {
        this.model.setRootElement(this.container.nativeElement);
      }
    }
  }
  protected override afterViewInit(): void {
    if (this.model && this.container?.nativeElement && !this.question.isDesignMode) {
      this.model.setRootElement(this.container.nativeElement);
    }
  }
  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.model && !this.question.isDesignMode) {
      this.model.setRootElement(undefined);
    }
  }
}

AngularComponentFactory.Instance.registerComponent("sv-ng-selectbase-item", SelectBaseItemComponent);
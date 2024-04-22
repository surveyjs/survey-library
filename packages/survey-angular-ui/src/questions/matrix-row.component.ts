import { Component, ElementRef, Input, ViewChild } from "@angular/core";
import { BaseAngular } from "../base-angular";
import {
  MatrixDropdownRowModelBase,
  QuestionMatrixDropdownModelBase,
  QuestionMatrixDropdownRenderedRow
} from "survey-core";

@Component({
  selector: "sv-ng-matrix-row",
  templateUrl: "./matrix-row.component.html",
  styles: [":host { display: none; }"]
})
export class MatrixRowComponent extends BaseAngular<QuestionMatrixDropdownRenderedRow> {
  @Input() model!: QuestionMatrixDropdownRenderedRow;
  @Input() question!: QuestionMatrixDropdownModelBase;
  @ViewChild("container", { static: false, read: ElementRef }) container!: ElementRef<HTMLTableRowElement>;
  protected getModel(): QuestionMatrixDropdownRenderedRow {
    return this.model;
  }
  public get row(): MatrixDropdownRowModelBase {
    return this.model.row;
  }
  public trackCellBy(_: number, cell: any): string {
    return cell.id;
  }
  protected override onModelChanged(): void {
    super.onModelChanged();
    if(this.previousModel) {
      this.previousModel.setRootElement(undefined as any)
    }
    if(this.model && this.container?.nativeElement) {
      this.model.setRootElement(this.container.nativeElement);
    }
  }
  public ngAfterViewInit(): void {
    if(this.model && this.container?.nativeElement) {
      this.model.setRootElement(this.container.nativeElement)
    }
  }
  public override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.model.setRootElement(undefined as any);
  }
}
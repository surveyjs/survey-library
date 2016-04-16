/// <reference path="../question_matrixdropdown.ts" />
module Survey {
    export class MatrixDropdownCell extends MatrixDropdownCellModel {
        private isValueUpdating = false;
        koValue: any;
        constructor(public column: MatrixDropdownColumn, public row: MatrixDropdownRowModel, data: IMatrixDropdownData, value: any) {
            super(column, row, data, value);
            this.koValue = ko.observable(this.value);
            var self = this;
            this.koValue.subscribe(function (newValue) {
                if (self.isValueUpdating) return;
                self.value = newValue;
            });
        }
        protected onValueChanged() {
            this.isValueUpdating = true;
            this.koValue(this.value);
            this.isValueUpdating = false;
        }
    }
    export class MatrixDropdownRow extends MatrixDropdownRowModel {
        constructor(public name: any, public text: string, data: IMatrixDropdownData, value: any) {
            super(name, text, data, value);
        }
        protected createCell(column: MatrixDropdownColumn, value: any): MatrixDropdownCellModel {
            return new MatrixDropdownCell(column, this, this.data, value);
        }
    }
    export class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementor(this);
        }
        protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModel {
            return new MatrixDropdownRow(name, text, this, value);
        }
    }

    JsonObject.metaData.overrideClassCreatore("matrixdropdown", function () { return new QuestionMatrixDropdown(""); });
    QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => { var q = new QuestionMatrixDropdown(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
}
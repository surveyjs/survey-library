/// <reference path="../question_matrixdropdown.ts" />
/// <reference path="../question_dropdown.ts" />
/// <reference path="../question_checkbox.ts" />
/// <reference path="../question_radiogroup.ts" />
/// <reference path="../question_text.ts" />
/// <reference path="../question_comment.ts" />
/// <reference path="koquestion_dropdown.ts" />
/// <reference path="koquestion_checkbox.ts" />
/// <reference path="koquestion_radiogroup.ts" />
/// <reference path="koquestion_text.ts" />
/// <reference path="koquestion_comment.ts" />

module Survey {
    export class MatrixDropdownCell extends MatrixDropdownCellModel {
        constructor(public column: MatrixDropdownColumn, public row: MatrixDropdownRowModel, data: IMatrixDropdownData, value: any) {
            super(column, row, data, value);
        }
        protected createText(name: string): QuestionTextModel {
            return new QuestionText(name);
        }
        protected createComment(name: string): QuestionCommentModel {
            return new QuestionComment(name);
        }
        protected createDropdownCore(name: string): QuestionDropdownModel {
            return new QuestionDropdown(name);
        }
        protected createCheckboxCore(name: string): QuestionCheckboxModel {
            return new QuestionCheckbox(name);
        }
        protected createRadiogroupCore(name: string): QuestionRadiogroupModel {
            return new QuestionRadiogroup(name);
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
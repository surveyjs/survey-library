/// <reference path="../question_matrix.ts" />
module Survey {
    export class MatrixRow extends MatrixRowModel {
        koValue: any;
        constructor(public name: any, public text: string, public fullName: string, data: IMatrixData, value: any) {
            super(name, text, fullName, data, value);
            this.koValue = ko.observable(this.rowValue);
            var self = this;
            this.koValue.subscribe(function (newValue) {
                self.value = newValue;
            });
        }
    }
    export class QuestionMatrix extends QuestionMatrixModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementor(this);
        }
        protected createMatrixRow(name: any, text: string, fullName: string, value: any) {
            return new MatrixRow(name, text, fullName, this, value);
        }
    }

    JsonObject.metaData.overrideClassCreatore("matrix", function () { return new QuestionMatrix(""); });
    QuestionFactory.Instance.registerQuestion("matrix", (name) => { var q = new QuestionMatrix(name); q.rows = ["Row 1", "Row 2"]; q.columns = ["Column 1", "Column 2", "Column 3"]; return q; });
}
/// <reference path="../question_matrix.ts" />
namespace Survey {
    export class MatrixRow extends MatrixRowModel {
        private isValueUpdating = false;
        koValue: any;
        constructor(public name: any, public text: string, public fullName: string, data: IMatrixData, value: any) {
            super(name, text, fullName, data, value);
            this.koValue = ko.observable(this.value);
            var self = this;
            this.koValue.subscribe(function (newValue) {
                if (self.isValueUpdating) true;
                self.value = newValue;
            });
        }
        protected onValueChanged() {
            this.isValueUpdating = true;
            this.koValue(this.value);
            this.isValueUpdating = false;
        }
    }
    export class QuestionMatrix extends QuestionMatrixModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementor(this);
        }
        protected createMatrixRow(name: any, text: string, fullName: string, value: any): MatrixRowModel {
            return new MatrixRow(name, text, fullName, this, value);
        }
    }

    JsonObject.metaData.overrideClassCreatore("matrix", function () { return new QuestionMatrix(""); });
    QuestionFactory.Instance.registerQuestion("matrix", (name) => { var q = new QuestionMatrix(name); q.rows = ["Row 1", "Row 2"]; q.columns = ["Column 1", "Column 2", "Column 3"]; return q; });
}
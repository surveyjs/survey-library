// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    interface IMatrixData {
        onMatrixRowChanged(row: MatrixRow);
    }
    export class MatrixRow extends Base {
        data: IMatrixData;
        protected rowValue: any;
        koValue: any;

        constructor(public name: string, public fullName: string, data: IMatrixData, value: any) {
            super();
            this.data = data;
            this.rowValue = value;
            if (this.isKO) {
                this.koValue = ko.observable(this.rowValue);
                var self = this;
                this.koValue.subscribe(function (newValue) {
                    self.value = newValue;
                });
            }
        }
        public get value() { return this.rowValue; }
        public set value(newValue: any) {
            this.rowValue = newValue;
            if (this.data) this.data.onMatrixRowChanged(this);
        }
    }
    export class QuestionMatrix extends Question implements IMatrixData {
        public columns: string[] = [];
        public rows: string[] = [];
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "matrix";
        }
        public get hasRows(): boolean {
            return this.rows.length > 0;
        }
        public get visibleRows(): Array<MatrixRow> {
            var result = new Array<MatrixRow>();
            var val = this.value;
            if (!val) val = {};
            for (var i = 0; i < this.rows.length; i++) {
                var rowName = this.rows[i];
                result.push(new MatrixRow(this.rows[i], this.name + '_' + rowName, this, val[rowName])); 
            }
            if (result.length == 0) {
                result.push(new MatrixRow("", this.name, this, val));
            }
            return result;
        }
        //IMatrixData
        onMatrixRowChanged(row: MatrixRow) {
            if (!this.hasRows) {
                this.value = row.value;
            } else {
                if (!this.value) {
                    this.value = {};
                }
                this.value[row.name] = row.value;
            }
        }
   }
    JsonObject.metaData.addClass("matrix", ["columns", "rows"], function () { return new QuestionMatrix(""); }, "question");
    QuestionFactory.Instance.registerQuestion("matrix", (name) => { return new QuestionMatrix(name); });
}
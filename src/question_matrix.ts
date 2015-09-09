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

        constructor(public name: any, public text: string, public fullName: string, data: IMatrixData, value: any) {
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
        public columnsValue: ItemValue[] = [];
        public rowsValue: ItemValue[] = [];
        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "matrix";
        }
        public get hasRows(): boolean {
            return this.rowsValue.length > 0;
        }
        get columns(): Array<any> { return this.columnsValue; }
        set columns(newValue: Array<any>) {
            ItemValue.setData(this.columnsValue, newValue);
        }
        get rows(): Array<any> { return this.rowsValue; }
        set rows(newValue: Array<any>) {
            ItemValue.setData(this.rowsValue, newValue);
        }

        public get visibleRows(): Array<MatrixRow> {
            var result = new Array<MatrixRow>();
            var val = this.value;
            if (!val) val = {};
            for (var i = 0; i < this.rows.length; i++) {
                if (!this.rows[i].value) continue;
                result.push(new MatrixRow(this.rows[i].value, this.rows[i].text, this.name + '_' + this.rows[i].value.toString(), this, val[this.rows[i].value])); 
            }
            if (result.length == 0) {
                result.push(new MatrixRow(null, "", this.name, this, val));
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
    JsonObject.metaData.setPropertyValues("matrix", "columns", null, null,
        function (obj: any) { return ItemValue.getData(obj.columns); },
        function (obj: any, value: any) { ItemValue.setData(obj.columns, value); });
    JsonObject.metaData.setPropertyValues("matrix", "rows", null, null,
        function (obj: any) { return ItemValue.getData(obj.rows); },
        function (obj: any, value: any) { ItemValue.setData(obj.rows, value); });
    QuestionFactory.Instance.registerQuestion("matrix", (name) => { return new QuestionMatrix(name); });
}
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="question_matrixdropdownbase.ts" />

module Survey {
    export class MatrixDropdownRowModel extends MatrixDropdownRowModelBase {
        constructor(public name: any, public text: string, data: IMatrixDropdownData, value: any) {
            super(data, value);
        }
        public get rowName() { return this.name; }
    }
    export class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
        private rowsValue: ItemValue[] = [];

        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "matrixdropdown";
        }
        public get rows(): Array<any> { return this.rowsValue; }
        public set rows(newValue: Array<any>) {
            ItemValue.setData(this.rowsValue, newValue);
        }
        protected generateRows(): Array<MatrixDropdownRowModel> {
            var result = new Array<MatrixDropdownRowModel>();
            if (!this.rows || this.rows.length === 0) return result;
            var val = this.value;
            if (!val) val = {};
            for (var i = 0; i < this.rows.length; i++) {
                if (!this.rows[i].value) continue;
                result.push(this.createMatrixRow(this.rows[i].value, this.rows[i].text, val[this.rows[i].value]));
            }
            return result;
        }
        protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModel {
            return new MatrixDropdownRowModel(name, text, this, value);
        }
    }
 
    JsonObject.metaData.addClass("matrixdropdown", ["rows:itemvalues"], function () { return new QuestionMatrixDropdownModel(""); }, "matrixdropdownbase");
    JsonObject.metaData.setPropertyValues("matrixdropdown", "rows", null, null,
        function (obj: any) { return ItemValue.getData(obj.rows); },
        function (obj: any, value: any) { obj.rows = value; });
 
    QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => { var q = new QuestionMatrixDropdownModel(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
}
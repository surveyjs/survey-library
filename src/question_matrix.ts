// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export interface IMatrixData {
        onMatrixRowChanged(row: MatrixRowModel);
    }
    export class MatrixRowModel extends Base {
        private data: IMatrixData;
        protected rowValue: any;

        constructor(public name: any, public text: string, public fullName: string, data: IMatrixData, value: any) {
            super();
            this.data = data;
            this.rowValue = value;
        }
        public get value() { return this.rowValue; }
        public set value(newValue: any) {
            this.rowValue = newValue;
            if (this.data) this.data.onMatrixRowChanged(this);
            this.onValueChanged();
        }
        protected onValueChanged() {
        }
    }
    export class QuestionMatrixModel extends Question implements IMatrixData {
        private columnsValue: ItemValue[] = [];
        private rowsValue: ItemValue[] = [];
        private isRowChanging = false;
        private generatedVisibleRows: Array<MatrixRowModel>;
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

        public get visibleRows(): Array<MatrixRowModel> {
            var result = new Array<MatrixRowModel>();
            var val = this.value;
            if (!val) val = {};
            for (var i = 0; i < this.rows.length; i++) {
                if (!this.rows[i].value) continue;
                result.push(this.createMatrixRow(this.rows[i].value, this.rows[i].text, this.name + '_' + this.rows[i].value.toString(), val[this.rows[i].value])); 
            }
            if (result.length == 0) {
                result.push(this.createMatrixRow(null, "", this.name, val));
            }
            this.generatedVisibleRows = result;
            return result;
        }
        protected createMatrixRow(name: any, text: string, fullName: string, value: any): MatrixRowModel {
            return new MatrixRowModel(name, text, fullName, this, value);
        }
        protected onValueChanged() {
            if (this.isRowChanging || !(this.generatedVisibleRows) || this.generatedVisibleRows.length == 0) return;
            this.isRowChanging = true;
            var val = this.value;
            if (!val) val = {};
            if (this.rows.length == 0) {
                this.generatedVisibleRows[0].value = val;
            } else {
                for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                    var row = this.generatedVisibleRows[i];
                    var rowVal = val[row.name] ? val[row.name] : null;
                    this.generatedVisibleRows[i].value = rowVal;
                }
            }
            this.isRowChanging = false;
        }
        //IMatrixData
        onMatrixRowChanged(row: MatrixRowModel) {
            if (this.isRowChanging) return;
            this.isRowChanging = true;
            if (!this.hasRows) {
                this.setNewValue(row.value);
            } else {
                var newValue = this.value;
                if (!newValue) {
                    newValue = {};
                }
                newValue[row.name] = row.value;
                this.setNewValue(newValue);
            }
            this.isRowChanging = false;
        }
   }
    JsonObject.metaData.addClass("matrix", [{ name: "columns:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.columns); }, onSetValue: function (obj: any, value: any) { obj.columns = value; }},
        { name: "rows:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.rows); }, onSetValue: function (obj: any, value: any) { obj.rows = value; } }],
        function () { return new QuestionMatrixModel(""); }, "question");
    QuestionFactory.Instance.registerQuestion("matrix", (name) => { var q = new QuestionMatrixModel(name); q.rows = ["Row 1", "Row 2"]; q.columns = ["Column 1", "Column 2", "Column 3"]; return q; });
}
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export interface IMatrixDropdownData {
        onCellChanged(cell: MatrixDropdownCellModel);
        columns: Array<MatrixDropdownColumn>;
        choices: Array<any>;
        optionsCaption: string;
    }
    export class MatrixDropdownColumn extends Base {
        private choicesValue: ItemValue[] = [];
        private titleValue: string;
        public optionsCaption: string;
        constructor(public name: string, title: string = null) {
            super();
        }
        public getType() { return "matrixdropdowncolumn" }
        public get title() { return this.titleValue ? this.titleValue : this.name; }
        public set title(value: string) { this.titleValue = value; }
        public get choices(): Array<any> { return this.choicesValue; }
        public set choices(newValue: Array<any>) {
            ItemValue.setData(this.choicesValue, newValue);
        }
    }
    export class MatrixDropdownCellModel {
        private data: IMatrixDropdownData
        private cellValue: any;
        constructor(public column: MatrixDropdownColumn, public row: MatrixDropdownRowModel, data: IMatrixDropdownData, value: any) {
            this.data = data;
            this.cellValue = value;
        }
        public get choices(): Array<any> { return this.column.choices && this.column.choices.length > 0 ? this.column.choices : this.data.choices; }
        public get optionsCaption(): string { return this.column.optionsCaption ? this.column.optionsCaption : this.data.optionsCaption; }
        public get value(): any { return this.cellValue; }
        public set value(value: any) {
            this.cellValue = value;
            this.data.onCellChanged(this);
        }
    }
    export class MatrixDropdownRowModel  {
        protected data: IMatrixDropdownData;
        protected rowValue: any;
        public cells: Array<MatrixDropdownCellModel> = [];

        constructor(public name: any, public text: string, data: IMatrixDropdownData, value: any) {
            this.data = data;
            this.rowValue = value;
            this.buildCells();
        }
        public get value() { return this.rowValue; }

        private buildCells() {
            var columns = this.data.columns;
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                this.cells.push(this.createCell(column, this.getCellValue(column)));
            }
        }
        protected createCell(column: MatrixDropdownColumn, value: any): MatrixDropdownCellModel {
            return new MatrixDropdownCellModel(column, this, this.data, value);
        }
        protected getCellValue(column: MatrixDropdownColumn): any {
            if (!this.rowValue) return null;
            return this.rowValue[column.name];
        }
    }
    export class QuestionMatrixDropdownModel extends Question implements IMatrixDropdownData {
        private columnsValue: Array<MatrixDropdownColumn> = [];
        private rowsValue: ItemValue[] = [];
        private choicesValue: ItemValue[] = [];
        private optionsCaptionValue: string;

        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "matrixdropdown";
        }
        public get columns(): Array<MatrixDropdownColumn> { return this.columnsValue; }
        public get rows(): Array<any> { return this.rowsValue; }
        public set rows(newValue: Array<any>) {
            ItemValue.setData(this.rowsValue, newValue);
        }
        public get choices(): Array<any> { return this.choicesValue; }
        public set choices(newValue: Array<any>) {
            ItemValue.setData(this.choicesValue, newValue);
        }
        public get optionsCaption() { return (this.optionsCaptionValue) ? this.optionsCaptionValue : surveyLocalization.getString("optionsCaption"); }
        public set optionsCaption(newValue: string) { this.optionsCaptionValue = newValue; }
        public addColumn(name: string, title: string = null): MatrixDropdownColumn {
            var column = new MatrixDropdownColumn(name, title);
            this.columnsValue.push(column);
            return column;
        }

        public get visibleRows(): Array<MatrixDropdownRowModel> {
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
        //IMatrixDropdownData
        onCellChanged(cell: MatrixDropdownCellModel) {
            var newValue = this.value;
            if (!newValue) {
                newValue = {};
            }
            var rowValue = newValue[cell.row.name];
            if (!rowValue) {
                rowValue = {};
                newValue[cell.row.name] = rowValue;
            }
            if (cell.value) {
                rowValue[cell.column.name] = cell.value;
            } else {
                delete rowValue[cell.column.name];
                if (Object.keys(rowValue).length == 0) {
                    delete newValue[cell.row.name];
                    if (Object.keys(newValue).length == 0) {
                        newValue = null;
                    }
                }
            }
            this.setNewValue(newValue);
        }
    }
    JsonObject.metaData.addClass("matrixdropdowncolumn", ["name", "title", "choices:itemvalues", "optionsCaption"], function () { return new MatrixDropdownColumn(""); });
    JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "title", null, null, function (obj: any) { return obj.titleValue; });
    JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { ItemValue.setData(obj.choices, value); });

    JsonObject.metaData.addClass("matrixdropdown", ["columns", "rows:itemvalues", "choices:itemvalues", "optionsCaption"], function () { return new QuestionMatrixDropdownModel(""); }, "question");
    JsonObject.metaData.setPropertyValues("matrixdropdown", "columns", "matrixdropdowncolumn");
    JsonObject.metaData.setPropertyValues("matrixdropdown", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { ItemValue.setData(obj.choices, value); });
    JsonObject.metaData.setPropertyValues("matrixdropdown", "rows", null, null,
        function (obj: any) { return ItemValue.getData(obj.rows); },
        function (obj: any, value: any) { ItemValue.setData(obj.rows, value); });
    JsonObject.metaData.setPropertyValues("matrixdropdown", "optionsCaption", null, null,
        function (obj: any) { return obj.optionsCaptionValue; });

    QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => { var q = new QuestionMatrixDropdownModel(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
}
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="question_dropdown.ts" />
/// <reference path="question_checkbox.ts" />
/// <reference path="question_radiogroup.ts" />
/// <reference path="question_text.ts" />
/// <reference path="question_comment.ts" />
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
        private cellTypeValue: string = "dropdown";
        private colCountValue: number = 0;
        constructor(public name: string, title: string = null) {
            super();
        }
        public getType() { return "matrixdropdowncolumn" }
        public get title() { return this.titleValue ? this.titleValue : this.name; }
        public set title(value: string) { this.titleValue = value; }
        public get choices(): Array<any> { return this.choicesValue; }
        public get cellType() { return this.cellTypeValue; }
        public set cellType(value: string) {
            this.cellTypeValue = value;
        }
        public get colCount(): number { return this.colCountValue; }
        public set colCount(value: number) {
            if (value < 0 || value > 4) return;
            this.colCountValue = value;
        }
        public set choices(newValue: Array<any>) {
            ItemValue.setData(this.choicesValue, newValue);
        }
    }
    export class MatrixDropdownCellModel {
        private data: IMatrixDropdownData
        private questionValue: Question;
        constructor(public column: MatrixDropdownColumn, public row: MatrixDropdownRowModel, data: IMatrixDropdownData, value: any) {
            this.data = data;
            this.questionValue = this.createQuestion();
            this.question.value = value;
            var self = this;
            var oldCallback = this.question.valueChangedCallback;
            this.question.valueChangedCallback = function () { self.data.onCellChanged(self); if (oldCallback) oldCallback(); };
        }
        public get choices(): Array<any> { return this.column.choices && this.column.choices.length > 0 ? this.column.choices : this.data.choices; }
        public get optionsCaption(): string { return this.column.optionsCaption ? this.column.optionsCaption : this.data.optionsCaption; }
        public get question(): Question { return this.questionValue; }
        public get value(): any { return this.question.value; }
        public set value(value: any) {
            this.question.value = value;
            this.onValueChanged();
        }
        protected onValueChanged() {
        }
        protected createQuestion(): Question {
            var cellType = this.column.cellType;
            var name = this.getQuestionName();
            if (cellType == "checkbox") return this.createCheckbox(name);
            if (cellType == "radiogroup") return this.createRadiogroup(name);
            if (cellType == "text") return this.createText(name);
            if (cellType == "comment") return this.createComment(name);
            return this.createDropdown(name);
        }
        protected createDropdown(name: string): QuestionDropdownModel {
            var q = this.createDropdownCore(name);
            q.choices = this.choices;
            q.optionsCaption = this.optionsCaption;
            return q;
        }
        protected createCheckbox(name: string): QuestionCheckboxModel {
            var q = this.createCheckboxCore(name);
            q.choices = this.choices;
            q.colCount = this.column.colCount;
            return q;
        }
        protected createRadiogroup(name: string): QuestionRadiogroupModel {
            var q = this.createRadiogroupCore(name);
            q.choices = this.choices;
            q.colCount = this.column.colCount;
            return q;
        }
        protected createText(name: string): QuestionTextModel {
            return new QuestionTextModel(name);
        }
        protected createComment(name: string): QuestionCommentModel {
            return new QuestionCommentModel(name);
        }
        protected createDropdownCore(name: string): QuestionDropdownModel {
            return new QuestionDropdownModel(name);
        }
        protected createCheckboxCore(name: string): QuestionCheckboxModel {
            return new QuestionCheckboxModel(name);
        }
        protected createRadiogroupCore(name: string): QuestionRadiogroupModel {
            return new QuestionRadiogroupModel(name);
        }
        protected getQuestionName(): string { return this.row.name + "_" + this.column.name; }
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
        public set value(value: any) {
            this.rowValue = value;
            for (var i = 0; i < this.cells.length; i++) {
                this.cells[i].value = this.getCellValue(this.cells[i].column);
            }
        }
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
        private isRowChanging = false;
        private generatedVisibleRows: Array<MatrixDropdownRowModel>;

        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "matrixdropdown";
        }
        public get columns(): Array<MatrixDropdownColumn> { return this.columnsValue; }
        public set columns(value: Array<MatrixDropdownColumn>) { this.columnsValue = value; }
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
            this.generatedVisibleRows = result;
            return result;
        }
        protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModel {
            return new MatrixDropdownRowModel(name, text, this, value);
        }
        protected onValueChanged() {
            if (this.isRowChanging || !(this.generatedVisibleRows) || this.generatedVisibleRows.length == 0) return;
            this.isRowChanging = true;
            var val = this.value;
            if (!val) val = {};
            for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                var row = this.generatedVisibleRows[i];
                var rowVal = val[row.name] ? val[row.name] : null;
                this.generatedVisibleRows[i].value = rowVal;
            }
            this.isRowChanging = false;
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
            this.isRowChanging = true;
            this.setNewValue(newValue);
            this.isRowChanging = false;
        }
    }
    JsonObject.metaData.addClass("matrixdropdowncolumn", ["name", "title", "choices:itemvalues", "optionsCaption", "cellType", "colCount"], function () { return new MatrixDropdownColumn(""); });
    JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "cellType", null, "dropdown");
    JsonObject.metaData.setPropertyChoices("matrixdropdowncolumn", "cellType", ["dropdown", "checkbox", "radiogroup", "text", "comment"]);
    JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "colCount", null, 0);
    JsonObject.metaData.setPropertyChoices("matrixdropdowncolumn", "colCount", [0, 1, 2, 3, 4]);
    JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "title", null, null, function (obj: any) { return obj.titleValue; });
    JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { obj.choices = value; });

    JsonObject.metaData.addClass("matrixdropdown", ["columns:matrixdropdowncolumns", "rows:itemvalues", "choices:itemvalues", "optionsCaption"], function () { return new QuestionMatrixDropdownModel(""); }, "question");
    JsonObject.metaData.setPropertyValues("matrixdropdown", "columns", "matrixdropdowncolumn");
    JsonObject.metaData.setPropertyValues("matrixdropdown", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { obj.choices = value; });
    JsonObject.metaData.setPropertyValues("matrixdropdown", "rows", null, null,
        function (obj: any) { return ItemValue.getData(obj.rows); },
        function (obj: any, value: any) { obj.rows = value; });
    JsonObject.metaData.setPropertyValues("matrixdropdown", "optionsCaption", null, null,
        function (obj: any) { return obj.optionsCaptionValue; });

    QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => { var q = new QuestionMatrixDropdownModel(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
}
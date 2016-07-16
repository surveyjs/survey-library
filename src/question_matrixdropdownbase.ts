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
        onCellChanged(cell: MatrixDropdownCell);
        columns: Array<MatrixDropdownColumn>;
        createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
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
    export class MatrixDropdownCell {
        private data: IMatrixDropdownData
        private questionValue: Question;
        constructor(public column: MatrixDropdownColumn, public row: MatrixDropdownRowModelBase, data: IMatrixDropdownData, value: any) {
            this.data = data;
            this.questionValue = this.data.createQuestion(this.row, this.column);
            this.question.value = value;
            var self = this;
            var oldCallback = this.question.valueChangedCallback;
            this.question.valueChangedCallback = function () { self.data.onCellChanged(self); if (oldCallback) oldCallback(); };
        }
        public get question(): Question { return this.questionValue; }
        public get value(): any { return this.question.value; }
        public set value(value: any) {
            this.question.value = value;
            this.onValueChanged();
        }
        protected onValueChanged() {
        }
    }
    export class MatrixDropdownRowModelBase {
        protected data: IMatrixDropdownData;
        protected rowValue: any;
        public cells: Array<MatrixDropdownCell> = [];

        constructor(data: IMatrixDropdownData, value: any) {
            this.data = data;
            this.rowValue = value;
            this.buildCells();
        }
        public get rowName() { return null; }
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
        protected createCell(column: MatrixDropdownColumn, value: any): MatrixDropdownCell {
            return new MatrixDropdownCell(column, this, this.data, value);
        }
        protected getCellValue(column: MatrixDropdownColumn): any {
            if (!this.rowValue) return null;
            return this.rowValue[column.name];
        }
    }
    export class QuestionMatrixDropdownModelBase extends Question implements IMatrixDropdownData {
        private columnsValue: Array<MatrixDropdownColumn> = [];
        private choicesValue: ItemValue[] = [];
        private optionsCaptionValue: string;
        private isRowChanging = false;
        protected generatedVisibleRows: Array<MatrixDropdownRowModelBase>;

        constructor(public name: string) {
            super(name);
        }
        public getType(): string {
            return "matrixdropdownbase";
        }
        public get columns(): Array<MatrixDropdownColumn> { return this.columnsValue; }
        public set columns(value: Array<MatrixDropdownColumn>) { this.columnsValue = value; }
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

        public get visibleRows(): Array<MatrixDropdownRowModelBase> {
            this.generatedVisibleRows = this.generateRows();
            return this.generatedVisibleRows;
        }
        protected generateRows(): Array<MatrixDropdownRowModelBase> { return null; }
        protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModelBase {
            return null;
        }
        protected createNewValue(curValue: any): any { return !curValue ? {} : curValue; }
        protected getRowValue(row: MatrixDropdownRowModelBase, questionValue: any, create: boolean = false): any {
            var result = questionValue[row.rowName] ? questionValue[row.rowName] : null;
            if (!result && create) {
                result = {};
                questionValue[row.rowName] = result;
            }
            return result;
        }
        protected onValueChanged() {
            if (this.isRowChanging || !(this.generatedVisibleRows) || this.generatedVisibleRows.length == 0) return;
            this.isRowChanging = true;
            var val = this.createNewValue(this.value);
            for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                var row = this.generatedVisibleRows[i];
                this.generatedVisibleRows[i].value = this.getRowValue(row, val);
            }
            this.isRowChanging = false;
        }
        //IMatrixDropdownData
        public createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question {
            var cellType = column.cellType;
            var name = this.getQuestionName(row, column);
            if (cellType == "checkbox") return this.createCheckbox(name, column);
            if (cellType == "radiogroup") return this.createRadiogroup(name, column);
            if (cellType == "text") return this.createText(name, column);
            if (cellType == "comment") return this.createComment(name, column);
            return this.createDropdown(name, column);
        }
        protected getQuestionName(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): string { return row.rowName + "_" + column.name; }
        protected getColumnChoices(column: MatrixDropdownColumn): Array<any> {
            return column.choices && column.choices.length > 0 ? column.choices : this.choices;
        }
        protected getColumnOptionsCaption(column: MatrixDropdownColumn): string {
            return column.optionsCaption ? column.optionsCaption : this.optionsCaption;
        }
        protected createDropdown(name: string, column: MatrixDropdownColumn): QuestionDropdownModel {
            var q = this.createDropdownCore(name);
            q.choices = this.getColumnChoices(column);
            q.optionsCaption = this.getColumnOptionsCaption(column);
            return q;
        }
        protected createCheckbox(name: string, column: MatrixDropdownColumn): QuestionCheckboxModel {
            var q = this.createCheckboxCore(name);
            q.choices = this.getColumnChoices(column);
            q.colCount = column.colCount;
            return q;
        }
        protected createRadiogroup(name: string, column: MatrixDropdownColumn): QuestionRadiogroupModel {
            var q = this.createRadiogroupCore(name);
            q.choices = this.getColumnChoices(column);
            q.colCount = column.colCount;
            return q;
        }
        protected createText(name: string, column: MatrixDropdownColumn): QuestionTextModel {
            return new QuestionTextModel(name);
        }
        protected createComment(name: string, column: MatrixDropdownColumn): QuestionCommentModel {
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
        protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any {
            delete newValue[row.rowName];
            return Object.keys(newValue).length == 0 ? null : newValue;
        }
        onCellChanged(cell: MatrixDropdownCell) {
            var newValue = this.createNewValue(this.value);
            var rowValue = this.getRowValue(cell.row, newValue, true);
            if (cell.value) {
                rowValue[cell.column.name] = cell.value;
            } else {
                delete rowValue[cell.column.name];
                if (Object.keys(rowValue).length == 0) {
                    newValue = this.deleteRowValue(newValue, cell.row);
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

    JsonObject.metaData.addClass("matrixdropdownbase", ["columns:matrixdropdowncolumns", "choices:itemvalues", "optionsCaption"], function () { return new QuestionMatrixDropdownModelBase(""); }, "question");
    JsonObject.metaData.setPropertyValues("matrixdropdownbase", "columns", "matrixdropdowncolumn");
    JsonObject.metaData.setPropertyValues("matrixdropdownbase", "choices", null, null,
        function (obj: any) { return ItemValue.getData(obj.choices); },
        function (obj: any, value: any) { obj.choices = value; });
    JsonObject.metaData.setPropertyValues("matrixdropdownbase", "optionsCaption", null, null,
        function (obj: any) { return obj.optionsCaptionValue; });
}
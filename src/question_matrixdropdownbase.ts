import {JsonObject} from "./jsonobject";
import {Question} from "./question";
import {Base, ItemValue, ISurveyData, HashTable} from "./base";
import {surveyLocalization} from "./surveyStrings";
import {QuestionSelectBase} from "./question_baseselect";
import {QuestionDropdownModel} from "./question_dropdown";
import {QuestionCheckboxModel} from "./question_checkbox";
import {QuestionRadiogroupModel} from "./question_radiogroup";
import {QuestionTextModel} from "./question_text";
import {QuestionCommentModel} from "./question_comment";
import {ChoicesRestfull} from "./choicesRestfull";
import {QuestionFactory} from "./questionfactory";

export interface IMatrixDropdownData {
    onRowChanged(cell: MatrixDropdownRowModelBase, newRowValue: any);
    columns: Array<MatrixDropdownColumn>;
    createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
}

export class MatrixDropdownColumn extends Base {
    private choicesValue: ItemValue[] = [];
    private titleValue: string;
    public optionsCaption: string;
    public isRequired: boolean = false;
    public hasOther: boolean = false;
    public minWidth: string = "";
    public cellType: string = "default";
    public inputType: string = "text";
    public placeHolder: string;
    public choicesOrder: string = "none";
    public choicesByUrl: ChoicesRestfull;
    private colCountValue: number = -1;
    constructor(public name: string, title: string = null) {
        super();
        this.choicesByUrl = new ChoicesRestfull();
    }
    public getType() { return "matrixdropdowncolumn" }
    public get title() { return this.titleValue ? this.titleValue : this.name; }
    public set title(value: string) { this.titleValue = value; }
    public get choices(): Array<any> { return this.choicesValue; }
    public get colCount(): number { return this.colCountValue; }
    public set colCount(value: number) {
        if (value < -1 || value > 4) return;
        this.colCountValue = value;
    }
    public set choices(newValue: Array<any>) {
        ItemValue.setData(this.choicesValue, newValue);
    }
}

export class MatrixDropdownCell {
    private questionValue: Question;
    constructor(public column: MatrixDropdownColumn, public row: MatrixDropdownRowModelBase, data: IMatrixDropdownData) {
        this.questionValue = data.createQuestion(this.row, this.column);
        this.questionValue.setData(row);
    }
    public get question(): Question { return this.questionValue; }
    public get value(): any { return this.question.value; }
    public set value(value: any) {
        this.question.value = value;
    }
}

export class MatrixDropdownRowModelBase implements ISurveyData {
    private static idCounter: number = 1;
    private static getId(): string { return "srow_" + MatrixDropdownRowModelBase.idCounter++; }
    protected data: IMatrixDropdownData;
    private rowValues: HashTable<any> = {};
    private rowComments: HashTable<any> = {};
    private isSettingValue: boolean = false;
    private idValue: string;

    public cells: Array<MatrixDropdownCell> = [];

    constructor(data: IMatrixDropdownData, value: any) {
        this.data = data;
        this.value = value;
        this.idValue = MatrixDropdownRowModelBase.getId();
        this.buildCells();
    }
    public get id(): string { return this.idValue; }
    public get rowName() { return null; }
    public get value() { return this.rowValues; }
    public set value(value: any) {
        this.isSettingValue = true;
        this.rowValues = {};
        if (value != null) {
            for (var key in value) {
                this.rowValues[key] = value[key];
            }
        }
        for (var i = 0; i < this.cells.length; i++) {
            this.cells[i].question.onSurveyValueChanged(this.getValue(this.cells[i].column.name));
        }
        this.isSettingValue = false;
    }
    public getValue(name: string): any {
        return this.rowValues[name];
    }
    public setValue(name: string, newValue: any) {
        if (this.isSettingValue) return;
        if (newValue === "") newValue = null;
        if (newValue != null) {
            this.rowValues[name] = newValue;
        } else {
            delete this.rowValues[name];
        }
        this.data.onRowChanged(this, this.value);
    }
    public getComment(name: string): string {
        return this.rowComments[name];
    }
    public setComment(name: string, newValue: string) {
        this.rowComments[name] = newValue;
    }
    public get isEmpty() {
        var val = this.value;
        if (!val) return true;
        for (var key in val) return false;
        return true;
    }
    private buildCells() {
        var columns = this.data.columns;
        for (var i = 0; i < columns.length; i++) {
            var column = columns[i];
            this.cells.push(this.createCell(column));
        }
    }
    protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell {
        return new MatrixDropdownCell(column, this, this.data);
    }
}

export class QuestionMatrixDropdownModelBase extends Question implements IMatrixDropdownData {
    private columnsValue: Array<MatrixDropdownColumn> = [];
    private choicesValue: ItemValue[] = [];
    private optionsCaptionValue: string;
    private isRowChanging = false;
    protected generatedVisibleRows: Array<MatrixDropdownRowModelBase>;
    private cellTypeValue: string = "dropdown";
    private columnColCountValue: number = 0;
    public columnMinWidth: string = "";
    public horizontalScroll: boolean = false;
    public columnsChangedCallback: () => void;
    public updateCellsCallbak: () => void;

    constructor(public name: string) {
        super(name);
        var self = this;
        this.columnsValue.push = function (value) {
            if (self.data != null) {
                self.fireCallback(self.columnsChangedCallback);
            }
            return Array.prototype.push.call(this, value);
        };
        
    }
    public getType(): string {
        return "matrixdropdownbase";
    }
    public get columns(): Array<MatrixDropdownColumn> { return this.columnsValue; }
    public set columns(value: Array<MatrixDropdownColumn>) {
        this.columnsValue = value;
        this.fireCallback(this.columnsChangedCallback);
    }
    public get cellType(): string { return this.cellTypeValue; }
    public set cellType(newValue: string) {
        if (this.cellType == newValue) return;
        this.cellTypeValue = newValue;
        this.fireCallback(this.updateCellsCallbak);
    }
    public get columnColCount(): number { return this.columnColCountValue; }
    public set columnColCount(value: number) {
        if (value < 0 || value > 4) return;
        this.columnColCountValue = value;
        this.fireCallback(this.updateCellsCallbak);
    }
    public getColumnTitle(column: MatrixDropdownColumn): string {
        var result = column.title;
        if (column.isRequired && this.survey) {
            var requireText = this.survey.requiredText;
            if (requireText) requireText += " ";
            result = requireText + result;
        }
        return result;
    }
    public getColumnWidth(column: MatrixDropdownColumn): string {
        return column.minWidth ? column.minWidth : this.columnMinWidth;
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
    protected onBeforeValueChanged(val: any) {
    }
    protected onValueChanged() {
        if (this.isRowChanging) return;
        this.onBeforeValueChanged(this.value);
        if(!(this.generatedVisibleRows) || this.generatedVisibleRows.length == 0) return;
        this.isRowChanging = true;
        var val = this.createNewValue(this.value);
        for (var i = 0; i < this.generatedVisibleRows.length; i++) {
            var row = this.generatedVisibleRows[i];
            this.generatedVisibleRows[i].value = this.getRowValue(row, val);
        }
        this.isRowChanging = false;
    }
    supportGoNextPageAutomatic() {
        var rows = this.generatedVisibleRows;
        if (!rows) rows = this.visibleRows;
        if (!rows) return true;
        for (var i = 0; i < rows.length; i++) {
            var cells = this.generatedVisibleRows[i].cells;
            if (!cells) continue;
            for (var colIndex = 0; colIndex < cells.length; colIndex++) {
                var question = cells[colIndex].question;
                if (question && (!question.supportGoNextPageAutomatic() || !question.value)) return false;
            }
        }
        return true;
    }
    public hasErrors(fireCallback: boolean = true): boolean {
        var errosInColumns = this.hasErrorInColumns(fireCallback);
        return super.hasErrors(fireCallback) || errosInColumns;
    }
    private hasErrorInColumns(fireCallback: boolean): boolean {
        if (!this.generatedVisibleRows) return false;
        var res = false;
        for (var colIndex = 0; colIndex < this.columns.length; colIndex++) {
            for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                var cells = this.generatedVisibleRows[i].cells;
                res = cells && cells[colIndex] && cells[colIndex].question && cells[colIndex].question.hasErrors(fireCallback) || res;
            }
        }
        return res;
    }
    protected getFirstInputElementId(): string {
        var question = this.getFirstCellQuestion(false);
        return question ? question.inputId : super.getFirstInputElementId();
    }
    protected getFirstErrorInputElementId(): string {
        var question = this.getFirstCellQuestion(true);
        return question ? question.inputId : super.getFirstErrorInputElementId();
    }
    protected getFirstCellQuestion(onError: boolean): Question {
        if (!this.generatedVisibleRows) return null;
        for (var i = 0; i < this.generatedVisibleRows.length; i++) {
            var cells = this.generatedVisibleRows[i].cells;
            for (var colIndex = 0; colIndex < this.columns.length; colIndex++) {
                if (!onError) return cells[colIndex].question;
                if (cells[colIndex].question.currentErrorCount > 0) return cells[colIndex].question
            }
        }
        return null;
    }
    //IMatrixDropdownData
    public createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question {
        var question = this.createQuestionCore(row, column);
        question.name = column.name;
        question.isRequired = column.isRequired;
        question.hasOther = column.hasOther;
        question.setData(this.survey);
        if (column.hasOther) {
            if (question instanceof QuestionSelectBase) {
                (<QuestionSelectBase>question).storeOthersAsComment = false;
            }
        }
        return question;
    }
    protected createQuestionCore(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question {
        var cellType = column.cellType == "default" ? this.cellType : column.cellType;
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
        var q = <QuestionDropdownModel>this.createCellQuestion("dropdown", name);
        this.setSelectBaseProperties(q, column);
        q.optionsCaption = this.getColumnOptionsCaption(column);
        return q;
    }
    protected createCheckbox(name: string, column: MatrixDropdownColumn): QuestionCheckboxModel {
        var q = <QuestionCheckboxModel>this.createCellQuestion("checkbox", name);
        this.setSelectBaseProperties(q, column);
        q.colCount = column.colCount > - 1 ? column.colCount : this.columnColCount;
        return q;
    }
    protected createRadiogroup(name: string, column: MatrixDropdownColumn): QuestionRadiogroupModel {
        var q = <QuestionRadiogroupModel>this.createCellQuestion("radiogroup", name);
        this.setSelectBaseProperties(q, column);
        q.colCount = column.colCount > - 1 ? column.colCount : this.columnColCount;
        return q;
    }
    protected setSelectBaseProperties(question: QuestionSelectBase, column: MatrixDropdownColumn) {
        question.choicesOrder = column.choicesOrder;
        question.choices = this.getColumnChoices(column);
        question.choicesByUrl.setData(column.choicesByUrl);
        if(!question.choicesByUrl.isEmpty) {
            question.choicesByUrl.run();
        }
    }
    protected createText(name: string, column: MatrixDropdownColumn): QuestionTextModel {
        var q = <QuestionTextModel>this.createCellQuestion("text", name);
        q.inputType = column.inputType;
        q.placeHolder = column.placeHolder;
        return q;
    }
    protected createComment(name: string, column: MatrixDropdownColumn): QuestionCommentModel {
        var q = <QuestionCommentModel>this.createCellQuestion("comment", name);
        q.placeHolder = column.placeHolder;
        return q;
    }
    protected createCellQuestion(questionType: string, name: string): Question {
        return <Question>QuestionFactory.Instance.createQuestion(questionType, name);
    }
    protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any {
        delete newValue[row.rowName];
        return Object.keys(newValue).length == 0 ? null : newValue;
    }
    onRowChanged(row: MatrixDropdownRowModelBase, newRowValue: any) {
        var newValue = this.createNewValue(this.value);
        var rowValue = this.getRowValue(row, newValue, true);
        for (var key in rowValue) delete rowValue[key];
        if (newRowValue) {
            newRowValue = JSON.parse(JSON.stringify(newRowValue));
            for (var key in newRowValue) rowValue[key] = newRowValue[key];
        }
        if (Object.keys(rowValue).length == 0) {
            newValue = this.deleteRowValue(newValue, row);
        }
        this.isRowChanging = true;
        this.setNewValue(newValue);
        this.isRowChanging = false;
    }
}

JsonObject.metaData.addClass("matrixdropdowncolumn", ["name", { name: "title", onGetValue: function (obj: any) { return obj.titleValue; } },
        { name: "choices:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.choices); }, onSetValue: function (obj: any, value: any) { obj.choices = value; }},
        "optionsCaption", { name: "cellType", default: "default", choices: ["default", "dropdown", "checkbox", "radiogroup", "text", "comment"] },
        { name: "colCount", default: -1, choices: [-1, 0, 1, 2, 3, 4] }, "isRequired:boolean", "hasOther:boolean", "minWidth", "placeHolder",
        { name: "choicesOrder", default: "none", choices: ["none", "asc", "desc", "random"] },
        { name: "choicesByUrl:restfull", className: "ChoicesRestfull", onGetValue: function (obj: any) { return obj.choicesByUrl.isEmpty ? null : obj.choicesByUrl; }, onSetValue: function (obj: any, value: any) { obj.choicesByUrl.setData(value); } },
        { name: "inputType", default: "text", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "tel", "text", "time", "url", "week"] }],
        
    function () { return new MatrixDropdownColumn(""); });

JsonObject.metaData.addClass("matrixdropdownbase", [{ name: "columns:matrixdropdowncolumns", className: "matrixdropdowncolumn"},
        "horizontalScroll:boolean",
        { name: "choices:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.choices); }, onSetValue: function (obj: any, value: any) { obj.choices = value; }},
        { name: "optionsCaption", onGetValue: function (obj: any) { return obj.optionsCaptionValue; } },
        { name: "cellType", default: "dropdown", choices: ["dropdown", "checkbox", "radiogroup", "text", "comment"] },
        { name: "columnColCount", default: 0, choices: [0, 1, 2, 3, 4] }, "columnMinWidth"],
    function () { return new QuestionMatrixDropdownModelBase(""); }, "question");
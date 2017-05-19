import {JsonObject} from "./jsonobject";
import {Question} from "./question";
import {Base, ISurveyData, HashTable} from "./base";
import {ItemValue} from "./itemvalue";
import {surveyLocalization} from "./surveyStrings";
import {QuestionSelectBase, QuestionCheckboxBase} from "./question_baseselect";
import {QuestionDropdownModel} from "./question_dropdown";
import {QuestionCheckboxModel} from "./question_checkbox";
import {QuestionRadiogroupModel} from "./question_radiogroup";
import {QuestionTextModel} from "./question_text";
import {QuestionCommentModel} from "./question_comment";
import {ChoicesRestfull} from "./choicesRestfull";
import {QuestionFactory} from "./questionfactory";
import {ILocalizableOwner, LocalizableString} from "./localizablestring";
import {SurveyValidator} from "./validator";
import {CustomWidgetCollection} from "./questionCustomWidgets";

export interface IMatrixDropdownData {
    onRowChanged(cell: MatrixDropdownRowModelBase, newRowValue: any);
    columns: Array<MatrixDropdownColumn>;
    createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
    getLocale(): string;
    getMarkdownHtml(text: string): string;
}

export interface IMatrixColumnOwner extends ILocalizableOwner {
    getRequiredText(): string;
    onColumnPropertiesChanged(column: MatrixDropdownColumn);
}

export class MatrixDropdownColumn extends Base implements ILocalizableOwner {
    private nameValue: string;
    private choicesValue: Array<ItemValue>;
    private locTitleValue: LocalizableString;
    private locOptionsCaptionValue: LocalizableString;
    private locPlaceHolderValue: LocalizableString;
    private isRequiredValue: boolean = false;
    private hasOtherValue: boolean = false;

    public minWidth: string = "";
    private cellTypeValue: string = "default";
    private inputTypeValue: string = "text";
    private choicesOrderValue: string = "none";
    public choicesByUrl: ChoicesRestfull;
    public colOwner: IMatrixColumnOwner = null;
    public validators: Array<SurveyValidator> = new Array<SurveyValidator>();
    private colCountValue: number = -1;
    constructor(name: string, title: string = null) {
        super();
        this.nameValue = name;
        this.choicesValue = ItemValue.createArray(this);
        this.locTitleValue = new LocalizableString(this, true);
        var self = this;
        this.locTitleValue.onRenderedHtmlCallback = function(text) { return self.getFullTitle(text); };
        this.locOptionsCaptionValue = new LocalizableString(this);
        this.locPlaceHolderValue = new LocalizableString(this);
        this.choicesByUrl = new ChoicesRestfull();
        if(title) this.title = title;
    }
    public getType() { return "matrixdropdowncolumn" }
    public get name() { return this.nameValue; }
    public set name(value: string) {
        if(value == this.name) return;
        this.nameValue = value;
        this.onPropertiesChanged();
    }

    public get choicesOrder(): string { return this.choicesOrderValue; }
    public set choicesOrder(newValue: string) {
        newValue = newValue.toLocaleLowerCase();
        if(this.choicesOrder == newValue) return;
        this.choicesOrderValue = newValue;
        this.onPropertiesChanged();
    }
    public get inputType(): string { return this.inputTypeValue; }
    public set inputType(newValue: string) {
        newValue = newValue.toLocaleLowerCase();
        if(this.inputTypeValue == newValue) return;
        this.inputTypeValue = newValue;
        this.onPropertiesChanged();
    }
    public get cellType(): string { return this.cellTypeValue; }
    public set cellType(newValue: string) {
        newValue = newValue.toLocaleLowerCase();
        if(this.cellTypeValue == newValue) return;
        this.cellTypeValue = newValue;
        this.onPropertiesChanged();
    }
    public get title(): string { return this.locTitle.text ? this.locTitle.text : this.name; }
    public set title(value: string) { this.locTitle.text = value; }
    public get fullTitle(): string { return this.getFullTitle(this.locTitle.textOrHtml); }
    public getFullTitle(str: string): string {
        if(!str) str = this.name;
        if (this.isRequired) {
            var requireText = this.colOwner? this.colOwner.getRequiredText() : "";
            if (requireText) requireText += " ";
            str = requireText + str;
        }
        return str;
    }
    public get locTitle() { return this.locTitleValue; }
    public get optionsCaption(): string { return this.locOptionsCaption.text;}
    public set optionsCaption(value: string){ 
        this.locOptionsCaption.text = value;
        this.onPropertiesChanged();
    }
    public get locOptionsCaption(): LocalizableString { return this.locOptionsCaptionValue; }
    public get placeHolder(): string { return this.locPlaceHolder.text; }
    public set placeHolder(value: string) { 
        this.locPlaceHolder.text = value; 
        this.onPropertiesChanged();
    }
    public get locPlaceHolder(): LocalizableString { return this.locPlaceHolderValue; }

    public get choices(): Array<any> { return this.choicesValue; }
    public set choices(newValue: Array<any>) {
        ItemValue.setData(this.choicesValue, newValue);
        this.onPropertiesChanged();
    }
    public get colCount(): number { return this.colCountValue; }
    public set colCount(value: number) {
        if (value < -1 || value > 4) return;
        this.colCountValue = value;
        this.onPropertiesChanged();
    }
    public get isRequired(): boolean { return this.isRequiredValue; }
    public set isRequired(value: boolean) {
        if(this.isRequired == value) return;
        this.isRequiredValue = value;
        this.onPropertiesChanged();
    }
    public get hasOther(): boolean { return this.hasOtherValue; }
    public set hasOther(value: boolean) {
        if(this.hasOther == value) return;
        this.hasOtherValue = value;
        this.onPropertiesChanged();
    }
    public getLocale() : string { return this.colOwner ? this.colOwner.getLocale() : ""; }
    public getMarkdownHtml(text: string)  { return this.colOwner ? this.colOwner.getMarkdownHtml(text) : null; }
    public onLocaleChanged() {
        this.locTitle.onChanged();
        this.locOptionsCaption.onChanged();
        ItemValue.NotifyArrayOnLocaleChanged(this.choices);
    }
    protected onPropertiesChanged() {
        if(this.colOwner != null) {
            this.colOwner.onColumnPropertiesChanged(this);
        }
    }
}

export class MatrixDropdownCell {
    private questionValue: Question;
    constructor(public column: MatrixDropdownColumn, public row: MatrixDropdownRowModelBase, data: IMatrixDropdownData) {
        this.questionValue = data.createQuestion(this.row, this.column);
        this.questionValue.setData(row);
        this.questionValue.customWidget = CustomWidgetCollection.Instance.getCustomWidget(this.questionValue);
    }
    public get question(): Question { return this.questionValue; }
    public get value(): any { return this.question.value; }
    public set value(value: any) {
        this.question.value = value;
    }
}

export class MatrixDropdownRowModelBase implements ISurveyData, ILocalizableOwner {
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
        for (var i = 0; i < this.data.columns.length; i++) {
            if(this.rowValues[this.data.columns[i].name] === undefined) {
                this.rowValues[this.data.columns[i].name] = null;
            }
        }
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
        if (Base.isValueEmpty(val)) return true;
        for (var key in val) {
            if (val[key] !== undefined && val[key] !== null) return false;
        }
        return true;
    }
    public getLocale(): string { return this.data ? this.data.getLocale() : "";}
    public getMarkdownHtml(text: string)  { return this.data ? this.data.getMarkdownHtml(text) : null; }
    public onLocaleChanged() {
        for(var i = 0; i < this.cells.length; i ++) {
            this.cells[i].question.onLocaleChanged();
        }
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

/**
 * A base class for matrix dropdown and matrix dynamic questions.
 */
export class QuestionMatrixDropdownModelBase extends Question implements IMatrixDropdownData {
    public static  addDefaultColumns(matrix: QuestionMatrixDropdownModelBase) {
        var colNames = QuestionFactory.DefaultColums;
        for(var i = 0; i < colNames.length; i ++)
            matrix.addColumn(colNames[i]);
    }
    private columnsValue: Array<MatrixDropdownColumn> = [];
    private choicesValue: Array<ItemValue>;
    private locOptionsCaptionValue: LocalizableString;
    private isRowChanging = false;
    protected generatedVisibleRows: Array<MatrixDropdownRowModelBase> = null;
    private cellTypeValue: string = "dropdown";
    private columnColCountValue: number = 0;
    /**
     * Use this property to set the mimimum column width.
     */
    public columnMinWidth: string = "";
    /**
     * Set this property to true to show the horizontal scroll.
     */
    public horizontalScroll: boolean = false;
    columnsChangedCallback: () => void;
    updateCellsCallback: () => void;

    constructor(public name: string) {
        super(name);
        this.choicesValue = ItemValue.createArray(this);
        this.locOptionsCaptionValue = new LocalizableString(this);
        this.overrideColumnsMethods();
    }
    public getType(): string {
        return "matrixdropdownbase";
    }
    /**
     * The list of matrix columns.
     */
    public get columns(): Array<MatrixDropdownColumn> { return this.columnsValue; }
    public set columns(value: Array<MatrixDropdownColumn>) {
        this.columnsValue = value;
        this.overrideColumnsMethods();
        this.fireCallback(this.columnsChangedCallback);
    }
    private overrideColumnsMethods() {
        var self = this;
        this.columnsValue.push = function (value) {
            var result = Array.prototype.push.call(this, value);
            self.generatedVisibleRows = null;
            value.colOwner = self;
            if (self.data != null) {
                self.fireCallback(self.columnsChangedCallback);
            }
            return result;
        };
        this.columnsValue.splice = function (start?: number, deleteCount?: number, ...items: MatrixDropdownColumn[]): MatrixDropdownColumn[] {
            var result = Array.prototype.splice.call(this, start, deleteCount, ... items);
            self.generatedVisibleRows = null;
            if(!items) items = [];
            for(var i = 0; i < items.length; i ++) {
                items[i].colOwner = self;
            }
            if (self.data != null) {
                self.fireCallback(self.columnsChangedCallback);
            }
            return result;
        };
    }
    /**
     * Use this property to change the default cell type.
     */
    public get cellType(): string { return this.cellTypeValue; }
    public set cellType(newValue: string) {
        newValue = newValue.toLowerCase();
        if (this.cellType == newValue) return;
        this.cellTypeValue = newValue;
        this.fireCallback(this.updateCellsCallback);
    }
    /**
     * The default column count for radiogroup and checkbox  cell types.
     */
    public get columnColCount(): number { return this.columnColCountValue; }
    public set columnColCount(value: number) {
        if (value < 0 || value > 4) return;
        this.columnColCountValue = value;
        this.fireCallback(this.updateCellsCallback);
    }
    public getRequiredText(): string { return this.survey ? this.survey.requiredText : ""; }
    onColumnPropertiesChanged(column: MatrixDropdownColumn) {
        if(!this.generatedVisibleRows) return;
        for(var i = 0; i < this.generatedVisibleRows.length; i ++) {
            var row = this.generatedVisibleRows[i];
            for(var j = 0; j < row.cells.length; j ++) {
                if(row.cells[j].column !== column) continue;
                this.setQuestionProperties(row.cells[j].question, column);
                break;
            }
        }
    }
    public onLocaleChanged() {
        super.onLocaleChanged();
        this.locOptionsCaption.onChanged();
        for(var i = 0; i < this.columns.length; i ++) {
            this.columns[i].onLocaleChanged();
        }
        var rows = this.visibleRows;
        for(var i = 0; i < rows.length; i ++) {
            rows[i].onLocaleChanged();
        }
        this.fireCallback(this.updateCellsCallback);
    }
    /**
     * Returns the column width.
     * @param column 
     */
    public getColumnWidth(column: MatrixDropdownColumn): string {
        return column.minWidth ? column.minWidth : this.columnMinWidth;
    }
    /**
     * The default choices for dropdown, checkbox and radiogroup cell types.
     */
    public get choices(): Array<any> { return this.choicesValue; }
    public set choices(newValue: Array<any>) {
        ItemValue.setData(this.choicesValue, newValue);
    }
    /**
     * The default options caption for dropdown cell type.
     */
    public get optionsCaption() { return this.locOptionsCaption.text ? this.locOptionsCaption.text : surveyLocalization.getString("optionsCaption"); }
    public set optionsCaption(newValue: string) { this.locOptionsCaption.text = newValue; }
    public get locOptionsCaption() { return this.locOptionsCaptionValue; }
    public addColumn(name: string, title: string = null): MatrixDropdownColumn {
        var column = new MatrixDropdownColumn(name, title);
        this.columnsValue.push(column);
        return column;
    }
    /**
     * Returns the rows model objects that used during rendering.
     */
    public get visibleRows(): Array<MatrixDropdownRowModelBase> {
        if(this.isLoadingFromJson) return;
        if(!this.generatedVisibleRows) {
            this.generatedVisibleRows = this.generateRows();
        }
        return this.generatedVisibleRows;
    }
    public onSurveyLoad() {
        this.generatedVisibleRows = null;
    }
    /**
     * Returns the row value. If the row value is empty, the object is empty: {}. 
     * @param rowIndex row index from 0 to visible row count - 1.
     */
    public getRowValue(rowIndex: number) {
        if(rowIndex < 0) return null;
        var visRows = this.visibleRows;
        if(rowIndex >= visRows.length) return null;
        var newValue = this.createNewValue(this.value);
        return this.getRowValueCore(visRows[rowIndex], newValue);
    }
    /**
     * Set the row value.
     * @param rowIndex row index from 0 to visible row count - 1.
     * @param rowValue an object {"column name": columnValue,... }
     */
    public setRowValue(rowIndex: number, rowValue: any) {
        if(rowIndex < 0) return null;
        var visRows = this.visibleRows;
        if(rowIndex >= visRows.length) return null;
        this.onRowChanged(visRows[rowIndex], rowValue);
        this.onValueChanged();
    }
    protected generateRows(): Array<MatrixDropdownRowModelBase> { return null; }
    protected createNewValue(curValue: any): any { return !curValue ? {} : curValue; }
    protected getRowValueCore(row: MatrixDropdownRowModelBase, questionValue: any, create: boolean = false): any {
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
            this.generatedVisibleRows[i].value = this.getRowValueCore(row, val);
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
        return this.createQuestionCore(row, column);
    }
    protected createQuestionCore(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question {
        var cellType = column.cellType == "default" ? this.cellType : column.cellType;
        var question = this.createCellQuestion(cellType, column.name);
        question.setData(this.survey);
        this.setQuestionProperties(question, column);
        return question;
    }
    protected getColumnChoices(column: MatrixDropdownColumn): Array<any> {
        return column.choices && column.choices.length > 0 ? column.choices : this.choices;
    }
    protected getColumnOptionsCaption(column: MatrixDropdownColumn): string {
        return column.optionsCaption ? column.optionsCaption : this.optionsCaption;
    }
    protected setQuestionProperties(question: Question, column: MatrixDropdownColumn) {
        if(!question) return;
        question.name = column.name;
        question.isRequired = column.isRequired;
        question.hasOther = column.hasOther;
        question.readOnly = this.readOnly;
        question.validators = column.validators;
        if (column.hasOther) {
            if (question instanceof QuestionSelectBase) {
                (<QuestionSelectBase>question).storeOthersAsComment = false;
            }
        }
        var t = question.getType();
        if(t == "checkbox" || t == "radiogroup") {
            (<QuestionCheckboxBase>question).colCount = column.colCount > - 1 ? column.colCount : this.columnColCount;
            this.setSelectBaseProperties(<QuestionSelectBase>question, column);
        }
        if(t == "dropdown") {
           (<QuestionDropdownModel>question).optionsCaption = this.getColumnOptionsCaption(column); 
           this.setSelectBaseProperties(<QuestionSelectBase>question, column);
        }
        if(t == "text") {
            (<QuestionTextModel>question).inputType = column.inputType;
            (<QuestionTextModel>question).placeHolder = column.placeHolder;
        }
        if(t == "comment") {
            (<QuestionCommentModel>question).placeHolder = column.placeHolder;
        }
    }
    protected setSelectBaseProperties(question: QuestionSelectBase, column: MatrixDropdownColumn) {
        question.choicesOrder = column.choicesOrder;
        question.choices = this.getColumnChoices(column);
        question.choicesByUrl.setData(column.choicesByUrl);
        if(!question.choicesByUrl.isEmpty) {
            question.choicesByUrl.run();
        }
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
        var rowValue = this.getRowValueCore(row, newValue, true);
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

JsonObject.metaData.addClass("matrixdropdowncolumn", ["name", { name: "title", serializationProperty: "locTitle" },
        { name: "choices:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.choices); }, onSetValue: function (obj: any, value: any) { obj.choices = value; }},
        { name: "optionsCaption", serializationProperty: "locOptionsCaption"} , { name: "cellType", default: "default", choices: ["default", "dropdown", "checkbox", "radiogroup", "text", "comment"] },
        { name: "colCount", default: -1, choices: [-1, 0, 1, 2, 3, 4] }, "isRequired:boolean", "hasOther:boolean", "minWidth", { name: "placeHolder", serializationProperty: "locPlaceHolder"},
        { name: "choicesOrder", default: "none", choices: ["none", "asc", "desc", "random"] },
        { name: "choicesByUrl:restfull", className: "ChoicesRestfull", onGetValue: function (obj: any) { return obj.choicesByUrl.isEmpty ? null : obj.choicesByUrl; }, onSetValue: function (obj: any, value: any) { obj.choicesByUrl.setData(value); } },
        { name: "inputType", default: "text", choices: ["color", "date", "datetime", "datetime-local", "email", "month", "number", "password", "range", "tel", "text", "time", "url", "week"] },
        { name: "validators:validators", baseClassName: "surveyvalidator", classNamePart: "validator" }],

    function () { return new MatrixDropdownColumn(""); });

JsonObject.metaData.addClass("matrixdropdownbase", [{ name: "columns:matrixdropdowncolumns", className: "matrixdropdowncolumn"},
        "horizontalScroll:boolean",
        { name: "choices:itemvalues", onGetValue: function (obj: any) { return ItemValue.getData(obj.choices); }, onSetValue: function (obj: any, value: any) { obj.choices = value; }},
        { name: "optionsCaption", serializationProperty: "locOptionsCaption" },
        { name: "cellType", default: "dropdown", choices: ["dropdown", "checkbox", "radiogroup", "text", "comment"] },
        { name: "columnColCount", default: 0, choices: [0, 1, 2, 3, 4] }, "columnMinWidth"],
    function () { return new QuestionMatrixDropdownModelBase(""); }, "question");

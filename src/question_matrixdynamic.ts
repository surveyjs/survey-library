import {QuestionMatrixDropdownModelBase,
    MatrixDropdownRowModelBase, IMatrixDropdownData
} from "./question_matrixdropdownbase";
import {JsonObject} from "./jsonobject";
import {QuestionFactory} from "./questionfactory";
import {surveyLocalization} from "./surveyStrings";
import {SurveyError} from "./base";
import {CustomError} from "./error";
import {LocalizableString} from "./localizablestring";

export class MatrixDynamicRowModel extends MatrixDropdownRowModelBase {
    constructor(public index: number, data: IMatrixDropdownData, value: any) {
        super(data, value);
    }
    public get rowName() { return this.id; }
}

/**
 * A Model for a matrix dymanic question. You may use a dropdown, checkbox, radiogroup, text and comment questions as a cell editors.
 * An end-user may dynamically add/remove rows, unlike in matrix dropdown question.
 */
export class QuestionMatrixDynamicModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
    static MaxRowCount = 100;
    private rowCounter = 0;
    private rowCountValue: number = 2;
    private locAddRowTextValue: LocalizableString;
    private locRemoveRowTextValue: LocalizableString;
    private minRowCountValue = 0;
    private maxRowCountValue = QuestionMatrixDynamicModel.MaxRowCount;
    rowCountChangedCallback: () => void;
    constructor(public name: string) {
        super(name);
        this.locAddRowTextValue = new LocalizableString(this);
        this.locRemoveRowTextValue = new LocalizableString(this);
    }
    public getType(): string {
        return "matrixdynamic";
    }
    /**
     * The number of rows in the matrix.
     * @see minRowCount
     * @see maxRowCount
     */
    public get rowCount(): number { return this.rowCountValue; }
    public set rowCount(val: number) {
        if (val < 0 || val > QuestionMatrixDynamicModel.MaxRowCount) return;
        var prevValue = this.rowCountValue;
        this.rowCountValue = val;
        if (this.value && this.value.length > val) {
            var qVal = this.value;
            qVal.splice(val);
            this.value = qVal;
        }
        if(this.generatedVisibleRows) {
            this.generatedVisibleRows.splice(val);            
            for(var i = prevValue; i < val; i ++) {
                this.generatedVisibleRows.push(this.createMatrixRow(null));
            }
        }
        this.fireCallback(this.rowCountChangedCallback);
    }
    /**
     * The minimum row count. A user could not delete a row if the rowCount equals to minRowCount
     * @see rowCount
     * @see maxRowCount
     */
    public get minRowCount() : number { return this.minRowCountValue; }
    public set minRowCount(value : number) {
        if(value < 0) value = 0;
        if(value == this.minRowCount || value > this.maxRowCount) return;
        this.minRowCountValue = value;
        if(this.rowCount < value) this.rowCount = value;
    }
    /**
     * The minimum row count. A user could not add a row if the rowCount equals to maxRowCount
     * @see rowCount
     * @see minRowCount
     */
    public get maxRowCount() : number { return this.maxRowCountValue; }
    public set maxRowCount(value : number) {
        if(value <= 0) return;
        if(value > QuestionMatrixDynamicModel.MaxRowCount) value = QuestionMatrixDynamicModel.MaxRowCount;
        if(value == this.maxRowCount || value < this.minRowCount) return;
        this.maxRowCountValue = value;
        if(this.rowCount > value) this.rowCount = value;
    }
    /**
     * Returns true, if a new row can be added.
     * @see maxRowCount
     * @see canRemoveRow
     * @see rowCount
     */
    public get canAddRow() : boolean { return this.rowCount < this.maxRowCount; }
    /**
     * Returns true, if a row can be removed.
     * @see minRowCount
     * @see canAddRow
     * @see rowCount
     */
    public get canRemoveRow() : boolean { return this.rowCount > this.minRowCount; }
    /**
     * Creates and add a new row.
     */
    public addRow() {
        if(!this.canAddRow) return;
        var prevRowCount = this.rowCount;
        this.rowCount = this.rowCount + 1;
        if(this.survey && (prevRowCount + 1 == this.rowCount)) this.survey.matrixRowAdded(this);
    }
    /**
     * Removes a row by it's index.
     * @param index a row index, from 0 to rowCount - 1
     */
    public removeRow(index: number) {
        if(!this.canRemoveRow) return;
        if (index < 0 || index >= this.rowCount) return;
        if (this.generatedVisibleRows && index < this.generatedVisibleRows.length) {
            this.generatedVisibleRows.splice(index, 1);
        }
        if (this.value) {
            var val = this.createNewValue(this.value);
            val.splice(index, 1);
            val = this.deleteRowValue(val, null);
            this.value = val;
        }
        this.rowCountValue--;
        this.fireCallback(this.rowCountChangedCallback);
    }
    /**
     * Use this property to change the default value of add row button text.
     */
    public get addRowText() { return this.locAddRowText.text ? this.locAddRowText.text : surveyLocalization.getString("addRow"); }
    public set addRowText(value: string) { this.locAddRowText.text = value; }
    get locAddRowText() { return this.locAddRowTextValue; }
    /**
     * Use this property to change the default value of remove row button text.
     */
    public get removeRowText() { return this.locRemoveRowText.text ? this.locRemoveRowText.text : surveyLocalization.getString("removeRow"); }
    public set removeRowText(value: string) { this.locRemoveRowText.text = value; }
    get locRemoveRowText() { return this.locRemoveRowTextValue; }
    public supportGoNextPageAutomatic() {   return false;  }
    protected onCheckForErrors(errors: Array<SurveyError>) {
        super.onCheckForErrors(errors);
        if (this.hasErrorInRows()) {
            errors.push(new CustomError(surveyLocalization.getString("minRowCountError")["format"](this.minRowCount)));
        }
    }
    private hasErrorInRows(): boolean {
        if (this.minRowCount <= 0 || !this.generatedVisibleRows) return false;
        var res = false;
        var setRowCount = 0;
        for (var rowIndex = 0; rowIndex < this.generatedVisibleRows.length; rowIndex++) {
            var row = this.generatedVisibleRows[rowIndex];
            if (!row.isEmpty) setRowCount++;
        }
        return setRowCount < this.minRowCount;
    }
    protected generateRows(): Array<MatrixDynamicRowModel> {
        var result = new Array<MatrixDynamicRowModel>();
        if (this.rowCount === 0) return result;
        var val = this.createNewValue(this.value);
        for (var i = 0; i < this.rowCount; i++) {
            result.push(this.createMatrixRow(this.getRowValueByIndex(val, i)));
        }
        return result;
    }
    protected createMatrixRow(value: any): MatrixDynamicRowModel {
        return new MatrixDynamicRowModel(this.rowCounter ++, this, value);
    }
    protected onBeforeValueChanged(val: any) {
        var newRowCount = val && Array.isArray(val) ? val.length : 0;
        if (newRowCount <= this.rowCount) return;
        this.rowCountValue = newRowCount;
        if (this.generatedVisibleRows) {
            this.generatedVisibleRows = this.visibleRows;
        }
    }
    protected createNewValue(curValue: any): any {
        var result = curValue;
        if (!result) result = [];
        var r = [];
        if (result.length > this.rowCount) result.splice(this.rowCount - 1);
        for (var i = result.length; i < this.rowCount; i++) {
            result.push({});
        }
        return result;
    }
    protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any {
        var isEmpty = true;
        for (var i = 0; i < newValue.length; i++) {
            if (Object.keys(newValue[i]).length > 0) {
                isEmpty = false;
                break;
            }
        }
        return isEmpty ? null : newValue;
    }

    private getRowValueByIndex(questionValue: any, index: number): any {
        return index >= 0 && index < questionValue.length ? questionValue[index] : null;
    }
    protected getRowValueCore(row: MatrixDropdownRowModelBase, questionValue: any, create: boolean = false): any {
        return this.getRowValueByIndex(questionValue, this.generatedVisibleRows.indexOf(row));
    }
}

JsonObject.metaData.addClass("matrixdynamic", [{ name: "rowCount:number", default: 2 }, { name: "minRowCount:number", default: 0 }, { name: "maxRowCount:number", default: QuestionMatrixDynamicModel.MaxRowCount },
        { name: "addRowText", serializationProperty: "locAddRowText" }, { name: "removeRowText", serializationProperty: "locRemoveRowText" }],
    function () { return new QuestionMatrixDynamicModel(""); }, "matrixdropdownbase");

QuestionFactory.Instance.registerQuestion("matrixdynamic", (name) => { var q = new QuestionMatrixDynamicModel(name); q.choices = [1, 2, 3, 4, 5]; QuestionMatrixDropdownModelBase.addDefaultColumns(q); return q; });

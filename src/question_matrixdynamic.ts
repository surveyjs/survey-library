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
    public get rowName() { return "row" + this.index; }
}

export class QuestionMatrixDynamicModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
    static MaxRowCount = 100;
    private rowCounter = 0;
    private rowCountValue: number = 2;
    private locAddRowTextValue: LocalizableString;
    private locRemoveRowTextValue: LocalizableString;
    private minRowCountValue = 0;
    private maxRowCountValue = QuestionMatrixDynamicModel.MaxRowCount;
    public rowCountChangedCallback: () => void;
    constructor(public name: string) {
        super(name);
        this.locAddRowTextValue = new LocalizableString(this);
        this.locRemoveRowTextValue = new LocalizableString(this);
    }
    public getType(): string {
        return "matrixdynamic";
    }
    public get rowCount(): number { return this.rowCountValue; }
    public set rowCount(val: number) {
        if (val < 0 || val > QuestionMatrixDynamicModel.MaxRowCount) return;
        this.rowCountValue = val;
        if (this.value && this.value.length > val) {
            var qVal = this.value;
            qVal.splice(val);
            this.value = qVal;
        }
        this.fireCallback(this.rowCountChangedCallback);
    }
    public get minRowCount() : number { return this.minRowCountValue; }
    public set minRowCount(value : number) {
        if(value < 0) value = 0;
        if(value == this.minRowCount || value > this.maxRowCount) return;
        this.minRowCountValue = value;
        if(this.rowCount < value) this.rowCount = value;
    }
    public get maxRowCount() : number { return this.maxRowCountValue; }
    public set maxRowCount(value : number) {
        if(value <= 0) return;
        if(value > QuestionMatrixDynamicModel.MaxRowCount) value = QuestionMatrixDynamicModel.MaxRowCount;
        if(value == this.maxRowCount || value < this.minRowCount) return;
        this.maxRowCountValue = value;
        if(this.rowCount > value) this.rowCount = value;
    }
    public get canAddRow() : boolean { return this.rowCount < this.maxRowCount; }
    public get canRemoveRow() : boolean { return this.rowCount > this.minRowCount; }
    public addRow() {
        if(!this.canAddRow) return;
        if (this.generatedVisibleRows) {
            this.generatedVisibleRows.push(this.createMatrixRow(null));
        }
        this.rowCount++;
    }
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
        this.rowCount--;
    }
    public get addRowText() { return this.locAddRowText.text ? this.locAddRowText.text : surveyLocalization.getString("addRow"); }
    public set addRowText(value: string) { this.locAddRowText.text = value; }
    public get locAddRowText() { return this.locAddRowTextValue; }
    public get removeRowText() { return this.locRemoveRowText.text ? this.locRemoveRowText.text : surveyLocalization.getString("removeRow"); }
    public set removeRowText(value: string) { this.locRemoveRowText.text = value; }
    public get locRemoveRowText() { return this.locRemoveRowTextValue; }
    public supportGoNextPageAutomatic() {   return false;  }
    public get cachedVisibleRows(): Array<MatrixDropdownRowModelBase> {
        if (this.generatedVisibleRows && this.generatedVisibleRows.length == this.rowCount) return this.generatedVisibleRows;
        return this.visibleRows;
    }
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
    protected getRowValue(row: MatrixDropdownRowModelBase, questionValue: any, create: boolean = false): any {
        return this.getRowValueByIndex(questionValue, this.generatedVisibleRows.indexOf(row));
    }
}

JsonObject.metaData.addClass("matrixdynamic", [{ name: "rowCount:number", default: 2 }, { name: "minRowCount:number", default: 0 }, { name: "maxRowCount:number", default: QuestionMatrixDynamicModel.MaxRowCount },
        { name: "addRowText", serializationProperty: "locAddRowText" }, { name: "removeRowText", serializationProperty: "locRemoveRowText" }],
    function () { return new QuestionMatrixDynamicModel(""); }, "matrixdropdownbase");

QuestionFactory.Instance.registerQuestion("matrixdynamic", (name) => { var q = new QuestionMatrixDynamicModel(name); q.choices = [1, 2, 3, 4, 5]; QuestionMatrixDropdownModelBase.addDefaultColumns(q); return q; });

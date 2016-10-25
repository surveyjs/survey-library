// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { QuestionMatrixDropdownModelBase, MatrixDropdownRowModelBase, IMatrixDropdownData } from "./question_matrixdropdownbase";
import { SurveyError } from "./base";
export declare class MatrixDynamicRowModel extends MatrixDropdownRowModelBase {
    index: number;
    constructor(index: number, data: IMatrixDropdownData, value: any);
    rowName: string;
}
export declare class QuestionMatrixDynamicModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
    name: string;
    static MaxRowCount: number;
    private rowCounter;
    private rowCountValue;
    private addRowTextValue;
    private removeRowTextValue;
    minRowCount: number;
    rowCountChangedCallback: () => void;
    constructor(name: string);
    getType(): string;
    rowCount: number;
    addRow(): void;
    removeRow(index: number): void;
    addRowText: string;
    removeRowText: string;
    cachedVisibleRows: Array<MatrixDropdownRowModelBase>;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    private hasErrorInRows();
    protected generateRows(): Array<MatrixDynamicRowModel>;
    protected createMatrixRow(value: any): MatrixDynamicRowModel;
    protected createNewValue(curValue: any): any;
    protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
    private getRowValueByIndex(questionValue, index);
    protected getRowValue(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
}

// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionMatrixDropdownModelBase, MatrixDropdownRowModelBase, IMatrixDropdownData } from "./question_matrixdropdownbase";
export declare class MatrixDropdownRowModel extends MatrixDropdownRowModelBase {
    name: any;
    text: string;
    constructor(name: any, text: string, data: IMatrixDropdownData, value: any);
    rowName: any;
}
export declare class QuestionMatrixDropdownModel extends QuestionMatrixDropdownModelBase implements IMatrixDropdownData {
    name: string;
    private rowsValue;
    constructor(name: string);
    getType(): string;
    rows: Array<any>;
    protected generateRows(): Array<MatrixDropdownRowModel>;
    protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModel;
}

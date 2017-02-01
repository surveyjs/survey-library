// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionMatrixModel, MatrixRowModel, IMatrixData } from "../question_matrix";
export declare class MatrixRow extends MatrixRowModel {
    name: any;
    text: string;
    fullName: string;
    private isValueUpdating;
    koValue: any;
    constructor(name: any, text: string, fullName: string, data: IMatrixData, value: any);
    protected onValueChanged(): void;
}
export declare class QuestionMatrix extends QuestionMatrixModel {
    name: string;
    constructor(name: string);
    protected createMatrixRow(name: any, text: string, fullName: string, value: any): MatrixRowModel;
}

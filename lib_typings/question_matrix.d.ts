// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Base } from "./base";
import { Question } from "./question";
import { SurveyError } from "./base";
export interface IMatrixData {
    onMatrixRowChanged(row: MatrixRowModel): any;
}
export declare class MatrixRowModel extends Base {
    name: any;
    text: string;
    fullName: string;
    private data;
    protected rowValue: any;
    constructor(name: any, text: string, fullName: string, data: IMatrixData, value: any);
    value: any;
    protected onValueChanged(): void;
}
export declare class QuestionMatrixModel extends Question implements IMatrixData {
    name: string;
    private columnsValue;
    private rowsValue;
    private isRowChanging;
    private generatedVisibleRows;
    isAllRowRequired: boolean;
    constructor(name: string);
    getType(): string;
    hasRows: boolean;
    columns: Array<any>;
    rows: Array<any>;
    visibleRows: Array<MatrixRowModel>;
    supportGoNextPageAutomatic(): boolean;
    protected onCheckForErrors(errors: Array<SurveyError>): void;
    private hasErrorInRows();
    private hasValuesInAllRows();
    protected createMatrixRow(name: any, text: string, fullName: string, value: any): MatrixRowModel;
    protected onValueChanged(): void;
    onMatrixRowChanged(row: MatrixRowModel): void;
}

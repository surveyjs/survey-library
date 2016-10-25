// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { QuestionImplementor } from "./koquestion";
import { QuestionMatrixDynamicModel } from "../question_matrixdynamic";
import { Question } from "../question";
import { MatrixDynamicRowModel } from "../question_matrixdynamic";
export declare class QuestionMatrixDynamicImplementor extends QuestionImplementor {
    koRows: any;
    koRecalc: any;
    koAddRowClick: any;
    koRemoveRowClick: any;
    koOverflowX: any;
    constructor(question: Question);
    protected onUpdateCells(): void;
    protected onColumnChanged(): void;
    protected onRowCountChanged(): void;
    protected addRow(): void;
    protected removeRow(row: MatrixDynamicRowModel): void;
}
export declare class QuestionMatrixDynamic extends QuestionMatrixDynamicModel {
    name: string;
    constructor(name: string);
}

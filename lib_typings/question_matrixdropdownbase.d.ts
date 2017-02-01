// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Question } from "./question";
import { Base, ISurveyData } from "./base";
import { QuestionDropdownModel } from "./question_dropdown";
import { QuestionCheckboxModel } from "./question_checkbox";
import { QuestionRadiogroupModel } from "./question_radiogroup";
import { QuestionTextModel } from "./question_text";
import { QuestionCommentModel } from "./question_comment";
export interface IMatrixDropdownData {
    onRowChanged(cell: MatrixDropdownRowModelBase, newRowValue: any): any;
    columns: Array<MatrixDropdownColumn>;
    createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
}
export declare class MatrixDropdownColumn extends Base {
    name: string;
    private choicesValue;
    private titleValue;
    optionsCaption: string;
    isRequired: boolean;
    hasOther: boolean;
    minWidth: string;
    cellType: string;
    private colCountValue;
    constructor(name: string, title?: string);
    getType(): string;
    title: string;
    choices: Array<any>;
    colCount: number;
}
export declare class MatrixDropdownCell {
    column: MatrixDropdownColumn;
    row: MatrixDropdownRowModelBase;
    private questionValue;
    constructor(column: MatrixDropdownColumn, row: MatrixDropdownRowModelBase, data: IMatrixDropdownData);
    question: Question;
    value: any;
}
export declare class MatrixDropdownRowModelBase implements ISurveyData {
    private static idCounter;
    private static getId();
    protected data: IMatrixDropdownData;
    private rowValues;
    private rowComments;
    private isSettingValue;
    private idValue;
    cells: Array<MatrixDropdownCell>;
    constructor(data: IMatrixDropdownData, value: any);
    id: string;
    rowName: any;
    value: any;
    getValue(name: string): any;
    setValue(name: string, newValue: any): void;
    getComment(name: string): string;
    setComment(name: string, newValue: string): void;
    isEmpty: boolean;
    private buildCells();
    protected createCell(column: MatrixDropdownColumn): MatrixDropdownCell;
}
export declare class QuestionMatrixDropdownModelBase extends Question implements IMatrixDropdownData {
    name: string;
    private columnsValue;
    private choicesValue;
    private optionsCaptionValue;
    private isRowChanging;
    protected generatedVisibleRows: Array<MatrixDropdownRowModelBase>;
    private cellTypeValue;
    private columnColCountValue;
    columnMinWidth: string;
    horizontalScroll: boolean;
    columnsChangedCallback: () => void;
    updateCellsCallbak: () => void;
    constructor(name: string);
    getType(): string;
    columns: Array<MatrixDropdownColumn>;
    cellType: string;
    columnColCount: number;
    getColumnTitle(column: MatrixDropdownColumn): string;
    getColumnWidth(column: MatrixDropdownColumn): string;
    choices: Array<any>;
    optionsCaption: string;
    addColumn(name: string, title?: string): MatrixDropdownColumn;
    visibleRows: Array<MatrixDropdownRowModelBase>;
    protected generateRows(): Array<MatrixDropdownRowModelBase>;
    protected createMatrixRow(name: any, text: string, value: any): MatrixDropdownRowModelBase;
    protected createNewValue(curValue: any): any;
    protected getRowValue(row: MatrixDropdownRowModelBase, questionValue: any, create?: boolean): any;
    protected onBeforeValueChanged(val: any): void;
    protected onValueChanged(): void;
    supportGoNextPageAutomatic(): boolean;
    hasErrors(fireCallback?: boolean): boolean;
    private hasErrorInColumns(fireCallback);
    protected getFirstInputElementId(): string;
    protected getFirstErrorInputElementId(): string;
    protected getFirstCellQuestion(onError: boolean): Question;
    createQuestion(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
    protected createQuestionCore(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): Question;
    protected getQuestionName(row: MatrixDropdownRowModelBase, column: MatrixDropdownColumn): string;
    protected getColumnChoices(column: MatrixDropdownColumn): Array<any>;
    protected getColumnOptionsCaption(column: MatrixDropdownColumn): string;
    protected createDropdown(name: string, column: MatrixDropdownColumn): QuestionDropdownModel;
    protected createCheckbox(name: string, column: MatrixDropdownColumn): QuestionCheckboxModel;
    protected createRadiogroup(name: string, column: MatrixDropdownColumn): QuestionRadiogroupModel;
    protected createText(name: string, column: MatrixDropdownColumn): QuestionTextModel;
    protected createComment(name: string, column: MatrixDropdownColumn): QuestionCommentModel;
    protected createCellQuestion(questionType: string, name: string): Question;
    protected deleteRowValue(newValue: any, row: MatrixDropdownRowModelBase): any;
    onRowChanged(row: MatrixDropdownRowModelBase, newRowValue: any): void;
}

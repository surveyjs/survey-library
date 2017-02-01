// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Base, IPage, IConditionRunner, ISurvey, IQuestion, HashTable } from "./base";
import { QuestionBase } from "./questionbase";
export declare class QuestionRowModel {
    page: PageModel;
    question: QuestionBase;
    private visibleValue;
    visibilityChangedCallback: () => void;
    constructor(page: PageModel, question: QuestionBase);
    questions: Array<QuestionBase>;
    visible: boolean;
    updateVisible(): void;
    addQuestion(q: QuestionBase): void;
    protected onVisibleChanged(): void;
    setWidth(): void;
    private onRowVisibilityChanged();
    private getVisibleCount();
    private isQuestionVisible(q);
    private calcVisible();
}
export declare class PageModel extends Base implements IPage, IConditionRunner {
    name: string;
    private static pageCounter;
    private static getPageId();
    private idValue;
    private rowValues;
    private conditionRunner;
    questions: Array<QuestionBase>;
    data: ISurvey;
    visibleIf: string;
    navigationButtonsVisibility: string;
    title: string;
    visibleIndex: number;
    private numValue;
    private visibleValue;
    constructor(name?: string);
    id: string;
    rows: Array<QuestionRowModel>;
    isActive: boolean;
    isQuestionVisible(question: QuestionBase): boolean;
    protected createRow(question: QuestionBase): QuestionRowModel;
    private isDesignMode;
    private buildRows();
    onRowVisibilityChanged(row: QuestionRowModel): void;
    processedTitle: string;
    num: number;
    visible: boolean;
    getType(): string;
    isVisible: boolean;
    getIsPageVisible(exceptionQuestion: IQuestion): boolean;
    addQuestion(question: QuestionBase, index?: number): void;
    addNewQuestion(questionType: string, name: string): QuestionBase;
    removeQuestion(question: QuestionBase): void;
    focusFirstQuestion(): void;
    focusFirstErrorQuestion(): void;
    scrollToTop(): void;
    hasErrors(fireCallback?: boolean, focuseOnFirstError?: boolean): boolean;
    addQuestionsToList(list: Array<IQuestion>, visibleOnly?: boolean): void;
    runCondition(values: HashTable<any>): void;
    protected onNumChanged(value: number): void;
}

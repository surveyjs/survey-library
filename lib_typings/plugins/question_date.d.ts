// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { Question } from "../question";
export default class QuestionDateModel extends Question {
    name: string;
    showOtherMonths: boolean;
    selectOtherMonths: boolean;
    showButtonPanel: boolean;
    changeMonth: boolean;
    changeYear: boolean;
    numberOfMonths: number;
    minDate: string;
    maxDate: string;
    constructor(name: string);
    getType(): string;
    getjQueryScript(selectorId: string): string;
    private getOptions();
    supportGoNextPageAutomatic(): boolean;
}

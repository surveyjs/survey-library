// Type definitions for Survey JavaScript library v0.10.0
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { Question } from "../../question";
export default class QuestionDateModel extends Question {
    name: string;
    constructor(name: string);
    getType(): string;
    isEmpty(): boolean;
    supportGoNextPageAutomatic(): boolean;
}

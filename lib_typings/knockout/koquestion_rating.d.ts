// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { QuestionRatingModel } from "../question_rating";
export declare class QuestionRating extends QuestionRatingModel {
    name: string;
    itemCss: string;
    constructor(name: string);
    protected onSetData(): void;
}

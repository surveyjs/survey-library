// Type definitions for Survey JavaScript library v0.10.4
// Project: http://surveyjs.org/
// Definitions by: tdHeader <https://github.com/surveyjs/>

import { QuestionRatingModel } from "../question_rating";
export declare class QuestionRating extends QuestionRatingModel {
    name: string;
    itemCss: string;
    constructor(name: string);
    protected onSetData(): void;
}

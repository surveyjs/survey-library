// Type definitions for Survey JavaScript library v0.9.12
// Project: http://surveyjs.org/
// Definitions by: Andrew Telnov <https://github.com/andrewtelnov/>

import { ItemValue } from "./base";
import { Question } from "./question";
export declare class QuestionRatingModel extends Question {
    name: string;
    static defaultRateValues: ItemValue[];
    private rates;
    mininumRateDescription: string;
    maximumRateDescription: string;
    rateValuesChangedCallback: () => void;
    constructor(name: string);
    rateValues: Array<any>;
    visibleRateValues: ItemValue[];
    getType(): string;
    supportComment(): boolean;
    supportOther(): boolean;
    supportGoNextPageAutomatic(): boolean;
}

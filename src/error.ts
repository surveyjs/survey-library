/// <reference path="base.ts" />
/// <reference path="surveyStrings.ts" />
module Survey {
    export class AnswerRequiredError extends SurveyError {
        constructor()  {
            super();
        }
        public getText(): string {
            return surveyLocalization.getString("requiredError");
        }
    }
    export class RequreNumericError extends SurveyError {
        constructor() {
            super();
        }
        public getText(): string {
            return surveyLocalization.getString("numericError");
        }
    }
    export class CustomError extends SurveyError {
        private text: string;
        constructor(text: string) {
            super();
            this.text = text;
        }
        public getText(): string {
            return this.text;
        }
    }
}
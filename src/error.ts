/// <reference path="base.ts" />
module Survey {
    export class AnswerRequiredError extends SurveyError {
        constructor()  {
            super();
        }
        public getText(): string {
            return "You should answer the question.";
        }
    }
    export class RequreNumericError extends SurveyError {
        constructor() {
            super();
        }
        public getText(): string {
            return "The value should be a numeric.";
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
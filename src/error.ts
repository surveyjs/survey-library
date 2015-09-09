module dxSurvey {
    export class SurveyError {
        public getText(): string {
            throw new Error('This method is abstract');
        }
    }
    export class AnswerRequiredError extends SurveyError {
        constructor()  {
            super();
        }
        public getText(): string {
            return "You should answer the question";
        }
    }
}
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class Page {
        questions: Array<Question> = new Array<Question>();
        public data: ISurveyData;
        
        constructor(public name: string) {
        }
        public addQuestion(question: Question) {
            if (question == null) return;
            question.data = this.data;
            this.questions.push(question);
        }
        public addNewQuestion(questionType: string, name: string): Question {
            var question = QuestionFactory.Instance.createQuestion(questionType, name);
            this.addQuestion(question);
            return question;
        }

    }
}
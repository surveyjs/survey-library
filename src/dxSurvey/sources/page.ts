/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
module dxSurvey {
    export class Page {
        questions: Array<Question> = new Array<Question>();
        public data: ISurveyData = null;
        
        constructor(public name: string) {
        }
        public addQuestion(question: Question) {
            if (question == null) return;
            if (this.data != null) {
                question.setData(this.data);
            }
            this.questions.push(question);
        }
        public addNewQuestion(questionType: string, name: string): Question {
            var question = QuestionFactory.Instance.createQuestion(questionType, name);
            this.addQuestion(question);
            return question;
        }
        public hasErrors(): boolean {
            var result = false;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i].hasErrors()) {
                    result = true;
                }
            }
            return result;
        }
        public addQuestionsToList(list: Array<IQuestion>) {
            for (var i: number = 0; i < this.questions.length; i++) {
                list.push(this.questions[i]);
            }
        }
    }
}
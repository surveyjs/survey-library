/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module dxSurvey {
    export class Page extends Base {
        questions: Array<Question> = new Array<Question>();
        public data: ISurveyData = null;
        
        constructor(public name: string) {
            super();
            var self = this;
            this.questions.push = function (value) {
                if (self.data != null) {
                    value.setData(self.data);
                }
                return Array.prototype.push.call(this, value);
            };
        }
        public getType(): string { return "page"; }

        public addQuestion(question: Question) {
            if (question == null) return;
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
    JsonObject.metaData.addClass("page", ["name", "questions"], function () { return new Page(""); });
}
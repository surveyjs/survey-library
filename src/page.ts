/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
module Survey {
    export class Page extends Base {
        questions: Array<Question> = new Array<Question>();
        public data: ISurveyData = null;
        public visible: boolean = true;
        public title: string = "";
        public visibleIndex: number = -1;
        private numValue: number = -1;
        koNo: any;
        
        constructor(public name: string = "") {
            super();
            var self = this;
            this.questions.push = function (value) {
                if (self.data != null) {
                    value.setData(self.data);
                }
                return Array.prototype.push.call(this, value);
            };
            if (this.isKO) {
                this.koNo = ko.observable("");
            }
        }
        public get num() { return this.numValue; }
        public set num(value: number) {
            if (this.numValue == value) return;
            this.numValue = value;
            if (this.isKO) {
                this.koNo(this.numValue > 0 ? this.numValue + ". " : "");
            }
        } 
        public getType(): string { return "page"; }
        public get isVisible(): boolean {
            if (!this.visible) return false;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i].visible) return true;
            }
            return false;
        }

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
                if (this.questions[i].visible && this.questions[i].hasErrors()) {
                    result = true;
                }
            }
            return result;
        }
        public addQuestionsToList(list: Array<IQuestion>, visibleOnly: boolean = false) {
            if (visibleOnly && !this.visible) return;
            for (var i: number = 0; i < this.questions.length; i++) {
                if (visibleOnly && !this.questions[i].visible) continue;
                list.push(this.questions[i]);
            }
        }
    }
    JsonObject.metaData.addClass("page", ["name", "questions", "visible", "title"], function () { return new Page(); });
    JsonObject.metaData.setPropertyValues("page", "visible", null, true);
    JsonObject.metaData.setPropertyClassInfo("page", "questions", "question");
 }
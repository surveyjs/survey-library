/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dragdrophelper.ts" />
module Survey {
    export class Page extends Base {
        questions: Array<Question> = new Array<Question>();
        public data: ISurvey = null;
        public visible: boolean = true;
        public title: string = "";
        public visibleIndex: number = -1;
        private numValue: number = -1;
        koNo: any; koDragging: any;
        dragEnter: any; dragLeave: any; dragDrop: any;
        private dragEnterCounter: number = 0;

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
                this.koDragging = ko.observable(-1);
                this.koDragging.subscribe(function (newValue) { if (newValue < 0) self.dragEnterCounter = 0; });
                this.dragEnter = function (e) { e.preventDefault(); self.dragEnterCounter++; if (self.koDragging() < 0) self.koDragging(self.questions.length); };
                this.dragLeave = function (e) { self.dragEnterCounter--; if (self.dragEnterCounter === 0) self.koDragging(-1); };
                this.dragDrop = function (e) { self.doDrop(e); };
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

        public addQuestion(question: Question, index: number = -1) {
            if (question == null) return;
            if (index < 0 || index >= this.questions.length) {
                this.questions.push(question);
            } else {
                this.questions.splice(index, 0, question);
            }
            if (this.data != null) {
                question.setData(this.data);
                this.data.questionAdded(question, index);
            }
        }
        public addNewQuestion(questionType: string, name: string): Question {
            var question = QuestionFactory.Instance.createQuestion(questionType, name);
            this.addQuestion(question);
            return question;
        }
        public removeQuestion(question: Question) {
            var index = this.questions.indexOf(question);
            if (index < 0) return;
            this.questions.splice(index, 1);
            if (this.data != null) this.data.questionRemoved(question);
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
        private doDrop(e) {
            new DragDropHelper(this.data).doDrop(e);
        }
    }
    JsonObject.metaData.addClass("page", ["name", "questions", "visible:boolean", "title"], function () { return new Page(); });
    JsonObject.metaData.setPropertyValues("page", "visible", null, true);
    JsonObject.metaData.setPropertyClassInfo("page", "questions", "question");
 }
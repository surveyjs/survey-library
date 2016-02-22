/// <reference path="base.ts" />
/// <reference path="question.ts" />
/// <reference path="survey.ts" />

module Survey {
    export class DragDropHelper {
        static dataStart: string = "surveyjs,";
        static dragData: string = "";
        static prevEvent = { question: null, x: -1, y: -1 };

        constructor(public data: ISurvey) {
        }
        public get survey(): Survey { return <Survey>this.data; }
        public startDragNewQuestion(event: DragEvent, questionType: string, questionName: string) {
            this.setData(event, DragDropHelper.dataStart + "questiontype:" + questionType + ",questionname:" + questionName);
        }
        public startDragQuestion(event: DragEvent, questionName: string) {
            this.setData(event, DragDropHelper.dataStart + "questionname:" + questionName);
        }
        public isSurveyDragging(event: DragEvent): boolean {
            if (!event) return false;
            var data = this.getData(event);
            return data && data.indexOf(DragDropHelper.dataStart) == 0;
        }
        public doDragDropOver(event: DragEvent, question: Question) {
            if (!question || !this.isSurveyDragging(event) || this.isSamePlace(event, question)) return;
            var index = this.getQuestionIndex(event, question);
            this.survey.currentPage.koDragging(index);
        }
        public doDrop(event: DragEvent, question: Question = null) {
            if (event.stopPropagation) {
                event.stopPropagation(); 
            }
            if (!this.isSurveyDragging(event)) return;
            this.survey.currentPage.koDragging(-1);
            var index = this.getQuestionIndex(event, question);
            var dataInfo = this.getDataInfo(event);
            this.clearData();
            if (!dataInfo) return;
            var targetQuestion = <Question>this.survey.getQuestionByName(dataInfo["questionname"]);
            if (!targetQuestion && dataInfo["questiontype"]) {
                targetQuestion = QuestionFactory.Instance.createQuestion(dataInfo["questiontype"], dataInfo["questionname"]);
            }
            if (!targetQuestion) return;
            this.moveQuestionTo(targetQuestion, index);
        }
        private getQuestionIndex(event: DragEvent, question: Question) {
            var page = this.survey.currentPage;
            if (!question) return page.questions.length;
            var index = page.questions.indexOf(question);
            var height = <number>event.currentTarget["clientHeight"];
            var y = event.offsetY;
            if (event.hasOwnProperty('layerX')) {
                y = event.layerY - <number>event.currentTarget["offsetTop"];
            }
            if (y > height / 2) index++
            return index;
        }
        private isSamePlace(event: DragEvent, question: Question): boolean {
            var prev = DragDropHelper.prevEvent;
            if (prev.question != question || Math.abs(event.clientX - prev.x) > 5 || Math.abs(event.clientY - prev.y) > 5) {
                prev.question = question;
                prev.x = event.clientX;
                prev.y = event.clientY;
                return false;
            }
            return true;
        }
        private moveQuestionTo(targetQuestion: Question, index: number) {
            if (targetQuestion == null) return;
            var page = this.survey.getPageByQuestion(targetQuestion);
            if (page) {
                page.removeQuestion(targetQuestion);
            }
            this.survey.currentPage.addQuestion(targetQuestion, index);
        }
        private getDataInfo(event: DragEvent): any {
            var data = this.getData(event);
            if (!data) return null;
            data = data.substr(DragDropHelper.dataStart.length);
            var array = data.split(',');
            var result = {};
            for (var i = 0; i < array.length; i++) {
                var item = array[i].split(':');
                result[item[0]] = item[1];
            }
            return result;
        }
        private getY(element: HTMLElement): number {
            var result = 0;

            while (element) {
                result += (element.offsetTop - element.scrollTop + element.clientTop);
                element = <HTMLElement>element.offsetParent;
            }
            return result;
        }
        private setData(event: DragEvent, data: string) {
            if (event.dataTransfer) {
                event.dataTransfer.setData("Text", data);
            }
            DragDropHelper.dragData = data;
        }
        private getData(event: DragEvent): string {
            if (event.dataTransfer) {
                var data = event.dataTransfer.getData("Text");
            }
            return data ? data : DragDropHelper.dragData;
        }
        private clearData() {
            DragDropHelper.dragData = "";
            var prev = DragDropHelper.prevEvent;
            prev.question = null;
            prev.x = -1;
            prev.y = -1;
        }
    }
}
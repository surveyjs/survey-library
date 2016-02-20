/// <reference path="base.ts" />
/// <reference path="question.ts" />
/// <reference path="survey.ts" />

module Survey {
    export class DragDropInfo {
        public isSurveyTarget: boolean = false;
        public position: string = "";
    }
    export class DragDropHelper {
        static dataStart: string = "surveyjs,";
        static dragData: string = "";
        constructor() {
        }
        public startDragNewQuestion(event: DragEvent, questionType: string, questionName: string) {
            this.setData(event, DragDropHelper.dataStart + "questiontype:" + questionType + ",questionname:" + questionName);
            event.dataTransfer.dropEffect = "copy";
        }
        public startDragQuestion(event: DragEvent, questionName: string) {
            this.setData(event, DragDropHelper.dataStart + "questionname:" + questionName);
            event.dataTransfer.dropEffect = "move";
        }
        public getDragDropInfo(event: DragEvent): DragDropInfo {
            var info = new DragDropInfo();
            if (!event || !event.dataTransfer) return info;
            var data = this.getData(event);
            if (!data) return info;
            info.isSurveyTarget = data.indexOf(DragDropHelper.dataStart) == 0;
            if (!info.isSurveyTarget || !event.currentTarget) return info;
            var height = <number>event.currentTarget["clientHeight"];
            var y = event.clientY - this.getY(<HTMLElement>event.currentTarget);
            info.position = y < height / 2 ? "up" : "down";
            return info;
        }
        public doDrop(event: DragEvent, data: ISurvey, question: Question = null) {
            if (event.stopPropagation) {
                event.stopPropagation(); 
            }
            var survey = <Survey>data;
            var info = this.getDragDropInfo(event);
            var dataInfo = this.getDataInfo(event);
            this.clearData();
            if (!info.isSurveyTarget || !dataInfo || !survey || !survey.currentPage) return;
            var targetQuestion = survey.getQuestionByName(dataInfo["questionname"]);
            if (!targetQuestion && dataInfo["questiontype"]) {
                targetQuestion = QuestionFactory.Instance.createQuestion(dataInfo["questiontype"], dataInfo["questionname"]);
            }
            if (!targetQuestion) return;
            survey.moveQuestionTo(targetQuestion, question, info.position == "up");
            survey.render();
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
            event.dataTransfer.setData("Text", data);
            DragDropHelper.dragData = data;
        }
        private getData(event: DragEvent): string {
            var data = event.dataTransfer.getData("Text");
            return data ? data : DragDropHelper.dragData;
        }
        private clearData() {
            DragDropHelper.dragData = "";
        }
    }
}
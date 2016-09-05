/// <reference path="../page.ts" />
module Survey {

    export class QuestionRow extends QuestionRowModel {
        koVisible: any; 
        constructor(public page: PageModel, public question: QuestionBase) {
            super(page, question);
            this.koVisible = ko.observable(this.visible);
        }
        protected onVisibleChanged() {
            this.koVisible(this.visible);
        }
        public koAfterRender(el, con) {
            for (var i = 0; i < el.length; i++) {
                var tEl = el[i];
                var nName = tEl.nodeName;
                if (nName == "#text") tEl.data = "";
            }
        }
    }

    export class Page extends PageModel {
        koNo: any; 
        constructor(name: string = "") {
            super(name);
            this.koNo = ko.observable("");
            this.onCreating();
        }        
        protected createRow(question: QuestionBase): QuestionRowModel { return new QuestionRow(this, question); }
        protected onCreating() { }
        protected onNumChanged(value: number) {
            this.koNo(value > 0 ? value + ". " : "");
        }
    }
    JsonObject.metaData.overrideClassCreatore("page", function () { return new Page(); });
}
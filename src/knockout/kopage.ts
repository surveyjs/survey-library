/// <reference path="../page.ts" />
module Survey {
    export class Page extends PageModel {
        koNo: any; 
        constructor(name: string = "") {
            super(name);
            this.koNo = ko.observable("");
            this.onCreating();
        }        
        protected onCreating() { }
        protected onNumChanged(value: number) {
            this.koNo(value > 0 ? value + ". " : "");
        }
    }
    JsonObject.metaData.overrideClassCreatore("page", function () { return new Page(); });
}
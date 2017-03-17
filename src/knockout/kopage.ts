import * as ko from "knockout";
import {PageModel, QuestionRowModel} from "../page";
import {JsonObject} from "../jsonobject";
import {QuestionBase} from "../questionbase";
import {SurveyElement} from "../base";

export class QuestionRow extends QuestionRowModel {
    koVisible: any;
    constructor(public panel: PageModel, public question: QuestionBase) {
        super(panel, question);
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
    koNo: any; koQuestionAfterRender: any;
    constructor(name: string = "") {
        super(name);
        this.koNo = ko.observable("");
        var self = this;
        this.koQuestionAfterRender = function (elements, con) {
            if (!self.data) return;
            var el = SurveyElement.GetFirstNonTextElement(elements);
            if (el) self.data.afterRenderQuestion(con, el);
        };
        this.onCreating();
    }
    protected createRow(question: QuestionBase): QuestionRowModel { return new QuestionRow(this, question); }
    protected onCreating() { }
    protected onNumChanged(value: number) {
        this.koNo(value > 0 ? value + ". " : "");
    }
}
JsonObject.metaData.overrideClassCreatore("page", function () { return new Page(); });
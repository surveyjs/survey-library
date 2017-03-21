import * as ko from "knockout";
import {PageModel} from "../page";
import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel";
import {JsonObject} from "../jsonobject";
import {QuestionBase} from "../questionbase";
import {SurveyElement, IElement} from "../base";

export class QuestionRow extends QuestionRowModel {
    koVisible: any; koElements: any;
    constructor(public panel: PanelModelBase) {
        super(panel);
        this.koVisible = ko.observable(this.visible);
        this.koElements = ko.observableArray();
    }
    protected onVisibleChanged() {
        this.koVisible(this.visible);
        this.koElements(this.questions);
    }
    public koAfterRender(el, con) {
        for (var i = 0; i < el.length; i++) {
            var tEl = el[i];
            var nName = tEl.nodeName;
            if (nName == "#text") tEl.data = "";
        }
    }
}

export class PanelImplementorBase {
    koRows: any;
    constructor(public panel: PanelModelBase) {
        var self = this;
        this.koRows = ko.observableArray();
        this.panel.rowsChangedCallback = function() {self.koRows(self.panel.rows); };
        this.panel["koQuestionAfterRender"] = function (el, con) { self.koQuestionAfterRender(el, con); };
        this.panel["koRows"] = this.koRows;
    }
    protected koQuestionAfterRender(elements, con) {
        if (!this.panel.data) return;
        var el = SurveyElement.GetFirstNonTextElement(elements);
        if (el) this.panel.data.afterRenderQuestion(con, el);
    }
}

export class PageImplementor extends PanelImplementorBase {
    koNo: any; 
    constructor(public panel: PanelModelBase) {
        super(panel);
        this.koNo = ko.observable("");
        this.panel["koNo"] = this.koNo;
    }
}

export class Panel extends PanelModel {
    constructor(name: string = "") {
        super(name);
        new PanelImplementorBase(this);
        this.onCreating();
    }
    protected createRow(): QuestionRowModel { return new QuestionRow(this); }
    protected onCreating() { }
    protected onNumChanged(value: number) {
        this["koNo"](value > 0 ? value + ". " : "");
    }
}


export class Page extends PageModel {
    constructor(name: string = "") {
        super(name);
        new PageImplementor(this);
        this.onCreating();
    }
    protected createRow(): QuestionRowModel { return new QuestionRow(this); }
    protected onCreating() { }
    protected onNumChanged(value: number) {
        this["koNo"](value > 0 ? value + ". " : "");
    }
}

JsonObject.metaData.overrideClassCreatore("panel", function () { return new Panel(); });
JsonObject.metaData.overrideClassCreatore("page", function () { return new Page(); });

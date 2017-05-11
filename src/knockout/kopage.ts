import * as ko from "knockout";
import {PageModel} from "../page";
import {PanelModelBase, PanelModel, QuestionRowModel} from "../panel";
import {JsonObject} from "../jsonobject";
import {QuestionBase} from "../questionbase";
import {SurveyElement, IElement} from "../base";
import {ElementFactory} from "../questionfactory";

export class QuestionRow extends QuestionRowModel {
    koVisible: any; koElements: any;
    constructor(public panel: PanelModelBase) {
        super(panel);
        this.koVisible = ko.observable(this.visible);
        this.koElements = ko.observableArray();
    }
    public addElement(q: IElement) {
        super.addElement(q);
        this.koElements(this.elements);
    }
    protected onVisibleChanged() {
        this.koVisible(this.visible);
        super.onVisibleChanged();
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
        this.panel["koPanelAfterRender"] = function (el, con) { self.koPanelAfterRender(el, con); };
        this.panel["koRows"] = this.koRows;
    }
    protected koQuestionAfterRender(elements, con) {
        if (!this.panel.data) return;
        var el = SurveyElement.GetFirstNonTextElement(elements);
        if (el) this.panel.data.afterRenderQuestion(con, el);
    }
    protected koPanelAfterRender(elements, con) {
        if (!this.panel.data) return;
        var el = SurveyElement.GetFirstNonTextElement(elements);
        if (el) this.panel.data.afterRenderPanel(con, el);
    }
}

export class Panel extends PanelModel {
    koVisible: any; koInnerMargin: any; koRenderWidth: any;
    constructor(name: string = "") {
        super(name);
        new PanelImplementorBase(this);
        this.onCreating();
        var self = this;
        this.koVisible = ko.observable(this.visible);
        this.koRenderWidth = ko.observable(this.renderWidth);
        this.renderWidthChangedCallback = function() { self.onRenderWidthChanged(); }
        this.koInnerMargin = ko.observable(this.getIndentSize(this.innerIndent));
    }
    protected createRow(): QuestionRowModel { return new QuestionRow(this); }
    protected onCreating() { }
    protected onNumChanged(value: number) {
        this.locTitle.onChanged();
    }
    protected onRenderWidthChanged() {
        this.koRenderWidth(this.renderWidth);
        this.koInnerMargin(this.getIndentSize(this.innerIndent));
    }
    protected onVisibleChanged() {
        super.onVisibleChanged();
        this.koVisible(this.visible);
    }
    private getIndentSize(indent: number): string {
        if (indent < 1) return "";
        if (!this.data) return "";
        var css = this.data["css"];
        if (!css) return "";
        return indent * css.question.indent + "px";
    }

}


export class Page extends PageModel {
    constructor(name: string = "") {
        super(name);
        new PanelImplementorBase(this);
        this.onCreating();
    }
    protected createRow(): QuestionRowModel { return new QuestionRow(this); }
    protected createNewPanel(name: string): PanelModel {
        return new Panel(name);
    }

    protected onCreating() { }
    protected onNumChanged(value: number) {
        this.locTitle.onChanged();
    }
}

JsonObject.metaData.overrideClassCreatore("panel", function () { return new Panel(); });
JsonObject.metaData.overrideClassCreatore("page", function () { return new Page(); });

ElementFactory.Instance.registerElement("panel", (name) => { return new Panel(name); });

import * as ko from "knockout";
import {JsonObject} from "../jsonobject";
import {QuestionFactory} from "../questionfactory";
import {QuestionImplementor} from "./koquestion";
import {QuestionPanelDynamicModel, QuestionPanelDynamicItem} from "../question_paneldynamic";
import {Question} from "../question";
import {PanelModel} from "../panel";
import {Panel} from "./kopage";

export class QuestionPanelDynamicImplementor extends QuestionImplementor {
    koPanels: any; koRecalc: any;
    koAddPanelClick: any; koRemovePanelClick: any; 
    koCanAddPanel: any; koCanRemovePanel: any;
    constructor(question: Question) {
        super(question);
        this.koRecalc = ko.observable(0);
        this.koPanels = ko.pureComputed(function () {
            this.koRecalc(); return (<QuestionPanelDynamic>this.question).panels;
        }, this);

        this.question["koPanels"] = this.koPanels;
        var self = this;
        this.koAddPanelClick = function () { self.addPanel(); }
        this.koRemovePanelClick = function (data) { self.removePanel(data); }
        this.koCanAddPanel = ko.pureComputed(function () { self.koRecalc(); return (<QuestionPanelDynamic>self.question).canAddPanel; });
        this.koCanRemovePanel = ko.pureComputed(function () { self.koRecalc(); return (<QuestionPanelDynamic>self.question).canRemovePanel; });
        this.question["koAddPanelClick"] = this.koAddPanelClick;
        this.question["koRemovePanelClick"] = this.koRemovePanelClick;
        this.question["koCanAddPanel"] = this.koCanAddPanel;
        this.question["koCanRemovePanel"] = this.koCanRemovePanel;
        (<QuestionPanelDynamic>this.question).panelCountChangedCallback = function () { self.onPanelCountChanged(); };
    }
    protected onPanelCountChanged() {
        this.koRecalc(this.koRecalc() + 1);
    }
    protected addPanel() {
        (<QuestionPanelDynamic>this.question).addPanel();
    }
    protected removePanel(val: any) {
        (<QuestionPanelDynamic>this.question).removePanel(val);
    }
}

export class QuestionPanelDynamic extends QuestionPanelDynamicModel {
    constructor(public name: string) {
        super(name);
        new QuestionPanelDynamicImplementor(this);
    }
    protected createNewPanelObject(): PanelModel {
        return new Panel();
    }

}

JsonObject.metaData.overrideClassCreatore("paneldynamic", function () { return new QuestionPanelDynamic(""); });

QuestionFactory.Instance.registerQuestion("paneldynamic", (name) => { var q = new QuestionPanelDynamic(name); q.template.addNewQuestion("text", "question1"); q.template.addNewQuestion("text", "question2"); return q; });

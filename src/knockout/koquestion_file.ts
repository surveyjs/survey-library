import * as ko from "knockout";
import {JsonObject} from "../jsonobject";
import {QuestionFactory} from "../questionfactory";
import {QuestionFileModel} from "../question_file";
import {QuestionImplementor} from "./koquestion";
import {Question} from "../question";

export class QuestionFileImplementor extends QuestionImplementor {
    koDataUpdater: any; koData: any; koHasValue: any;
    constructor(question: Question) {
        super(question);
        var self = this;
        this.koDataUpdater = ko.observable(0);
        this.koData = ko.computed(function () { self.koDataUpdater(); return (<QuestionFileModel>self.question).previewValue; });
        this.koHasValue = ko.observable(false);
        this.question["koData"] = this.koData;
        this.question["koHasValue"] = this.koHasValue;

        (<QuestionFileModel>this.question).previewValueLoadedCallback = function () { self.onLoadPreview(); };
        this.question["dochange"] = function (data, event) { var src = event.target || event.srcElement; self.onChange(src); };
    }
    private onChange(src: any) {
        if (!window["FileReader"]) return;
        if (!src || !src.files || src.files.length < 1) return;
        (<QuestionFileModel>this.question).loadFile(src.files[0]);
    }
    private onLoadPreview() {
        this.koDataUpdater(this.koDataUpdater() + 1);
        this.koHasValue(true);
    }
}
export class QuestionFile extends QuestionFileModel {
    constructor(public name: string) {
        super(name);
        new QuestionFileImplementor(this);
    }
}

JsonObject.metaData.overrideClassCreatore("file", function () { return new QuestionFile(""); });
QuestionFactory.Instance.registerQuestion("file", (name) => { return new QuestionFile(name); });

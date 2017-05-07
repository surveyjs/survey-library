import {QuestionMatrixDropdownModel} from "../question_matrixdropdown";
import {QuestionMatrixDropdownModelBase} from "../question_matrixdropdownbase";
import {JsonObject} from "../jsonobject";
import {QuestionFactory} from "../questionfactory";
import {QuestionImplementor} from "./koquestion";

export class QuestionMatrixDropdown extends QuestionMatrixDropdownModel {
    constructor(public name: string) {
        super(name);
        new QuestionImplementor(this);
    }
}

JsonObject.metaData.overrideClassCreatore("matrixdropdown", function () { return new QuestionMatrixDropdown(""); });

QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => { var q = new QuestionMatrixDropdown(name); q.choices = [1, 2, 3, 4, 5]; q.rows = QuestionFactory.DefaultRows;  QuestionMatrixDropdownModelBase.addDefaultColumns(q); return q; });

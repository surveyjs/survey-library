import {QuestionMatrixDropdownModel} from "../question_matrixdropdown";
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

QuestionFactory.Instance.registerQuestion("matrixdropdown", (name) => { var q = new QuestionMatrixDropdown(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
import { describe, test, expect } from "vitest";
import "../../src/questionnonvalue";
import "../../src/question_text";
import "../../src/question_comment";
import "../../src/question_expression";
import "../../src/question_html";
import "../../src/question_image";
import "../../src/question_empty";
import "../../src/question_checkbox";
import "../../src/question_radiogroup";
import "../../src/question_dropdown";
import "../../src/question_tagbox";
import "../../src/question_ranking";
import "../../src/question_buttongroup";
import "../../src/question_boolean";
import "../../src/question_rating";
import "../../src/question_slider";
import "../../src/question_file";
import "../../src/question_signaturepad";
import "../../src/question_imagepicker";
import "../../src/question_imagemap";
import "../../src/question_matrix";
import "../../src/question_multipletext";
import { Serializer } from "../../src/jsonobject";
import { Question } from "../../src/question";
import { PanelModel } from "../../src/panel";
import { QuestionMatrixDynamicModel } from "../../src/question_matrixdynamic";
import { QuestionMatrixDropdownModel } from "../../src/question_matrixdropdown";
import { QuestionPanelDynamicModel } from "../../src/question_paneldynamic";
import { ArrayDynamicDataSource, RowsDynamicDataSource, SurveyDataDynamicDataSource } from "../../src/dynamic-data/dynamic-data-sources";

// The protected and private members that other classes call by element access
// (question["getItemRecordIndex"](item)). The compiler checks the signature of such a call, but not
// that the member exists: a renamed or removed member still compiles. This list is the one place to
// update when a member reached this way is added or renamed.
// Each name is checked on every concrete class that inherits the class that declares it, so that an
// abstract member is checked where it is implemented. Every member reached today is a method: a
// method must be a function on the prototype (the lookup follows the chain).
const reachedMembers: Array<{ owner: string, members: Array<string>, classes: Array<{ name: string, prototype: any }> }> = [
  {
    owner: "QuestionRecordsModel",
    members: ["getItemRecordIndex", "getItemVisibleIndex", "getItemByVisibleIndex", "getItemByRecordIndex", "getExpressionItem",
      "syncPageSizeWithMode", "writeItemValue", "getRecordAddText", "addRecordFromUI", "isRecordKeyUnknown", "getItemPageVisibleIndex"],
    classes: [QuestionMatrixDynamicModel, QuestionMatrixDropdownModel, QuestionPanelDynamicModel]
  },
  {
    owner: "LocalDynamicDataSource",
    members: ["readRecordInAnswer", "createEmptyAnswer", "addRecordToAnswer", "getRecordSegment", "getRecordStateKey", "createAnswerAssignmentRemap",
      "claimPositionWriter", "releasePositionWriter", "isWrittenByAnotherWriter"],
    classes: [ArrayDynamicDataSource, SurveyDataDynamicDataSource, RowsDynamicDataSource]
  },
  {
    owner: "ArrayDynamicDataSource",
    members: ["padRecordsToMinCount"],
    classes: [ArrayDynamicDataSource, SurveyDataDynamicDataSource]
  },
  {
    // The matrix and the dynamic panel call it on their inner panels.
    owner: "Base",
    members: ["mergeLocalizationObj"],
    classes: [PanelModel]
  },
  {
    // The records question calls it on its template questions: every question type.
    owner: "Question",
    members: ["getAnswerCleanupAtComplete"],
    classes: Serializer.getChildrenClasses("question", true).map(cls => {
      const obj = Serializer.createClass(cls.name);
      return { name: cls.name, prototype: obj instanceof Question ? Object.getPrototypeOf(obj) : undefined };
    })
  }
];

describe("Members reached by element access exist", () => {
  reachedMembers.forEach(item => {
    test(item.owner + ": every listed member is a method of each concrete class", () => {
      expect(item.classes.length, "the list names concrete classes").toBeGreaterThan(0);
      const missing = new Array<string>();
      item.classes.forEach(cls => {
        item.members.forEach(name => {
          if (!cls.prototype || typeof cls.prototype[name] !== "function") missing.push(cls.name + "." + name);
        });
      });
      expect(missing).toEqual([]);
    });
  });
});

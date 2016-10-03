/// <reference path="../question_comment.ts" />
namespace Survey {
    export class QuestionComment extends QuestionCommentModel {
        constructor(public name: string) {
            super(name);
            new QuestionImplementor(this);
        }
    }

    JsonObject.metaData.overrideClassCreatore("comment", function () { return new QuestionComment(""); });
    QuestionFactory.Instance.registerQuestion("comment", (name) => { return new QuestionComment(name); });
}
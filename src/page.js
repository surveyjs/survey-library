var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(name) {
            _super.call(this);
            this.name = name;
            this.questions = new Array();
            this.data = null;
            var self = this;
            this.questions.push = function (value) {
                if (self.data != null) {
                    value.setData(self.data);
                }
                return Array.prototype.push.call(this, value);
            };
        }
        Page.prototype.getType = function () { return "page"; };
        Page.prototype.addQuestion = function (question) {
            if (question == null)
                return;
            this.questions.push(question);
        };
        Page.prototype.addNewQuestion = function (questionType, name) {
            var question = dxSurvey.QuestionFactory.Instance.createQuestion(questionType, name);
            this.addQuestion(question);
            return question;
        };
        Page.prototype.hasErrors = function () {
            var result = false;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i].hasErrors()) {
                    result = true;
                }
            }
            return result;
        };
        Page.prototype.addQuestionsToList = function (list) {
            for (var i = 0; i < this.questions.length; i++) {
                list.push(this.questions[i]);
            }
        };
        return Page;
    })(dxSurvey.Base);
    dxSurvey.Page = Page;
    dxSurvey.JsonObject.metaData.addClass("page", ["name", "questions"], function () { return new Page(""); });
})(dxSurvey || (dxSurvey = {}));

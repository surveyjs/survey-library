/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dxSurvey;
(function (dxSurvey) {
    var Survey = (function (_super) {
        __extends(Survey, _super);
        function Survey(jsonObj, renderedElement) {
            if (jsonObj === void 0) { jsonObj = null; }
            if (renderedElement === void 0) { renderedElement = null; }
            _super.call(this);
            this.title = "";
            this.pages = new Array();
            this.currentPage = null;
            this.valuesHash = {};
            this.commentsHash = {};
            this.onComplete = new dxSurvey.Event();
            this.onValueChanged = new dxSurvey.Event();
            this.onVisibleChanged = new dxSurvey.Event();
            var self = this;
            this.pages.push = function (value) {
                value.data = self;
                return Array.prototype.push.call(this, value);
            };
            if (jsonObj) {
                new dxSurvey.JsonObject().toObject(jsonObj, this);
            }
            if (renderedElement) {
                this.render(renderedElement);
            }
        }
        Survey.prototype.getType = function () { return "survey"; };
        Object.defineProperty(Survey.prototype, "data", {
            get: function () {
                var result = [];
                for (var key in this.valuesHash) {
                    var obj = {};
                    obj[key] = this.valuesHash[key];
                    result.push(obj);
                }
                return result;
            },
            set: function (data) {
                this.valuesHash = {};
                if (!data && data.constructor.toString().indexOf("Array") < 0)
                    return;
                for (var i = 0; i < data.length; i++) {
                    var value = data[i];
                    for (var key in value) {
                        if (key && value[key]) {
                            this.valuesHash[key] = value[key];
                        }
                    }
                }
                this.notifyAllQuestionsOnValueChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "PageCount", {
            get: function () {
                return this.pages.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "CurrentPage", {
            get: function () {
                if (this.currentPage != null) {
                    if (this.pages.indexOf(this.currentPage) < 0) {
                        this.currentPage = null;
                    }
                }
                if (this.currentPage == null && this.pages.length > 0) {
                    this.currentPage = this.pages[0];
                }
                return this.currentPage;
            },
            set: function (value) {
                if (value == null || this.pages.indexOf(value) < 0)
                    return;
                this.currentPage = value;
                this.applyBinding();
            },
            enumerable: true,
            configurable: true
        });
        Survey.prototype.nextPage = function () {
            if (this.isLastPage)
                return false;
            if (this.isCurrentPageHasErrors())
                return false;
            var index = this.pages.indexOf(this.CurrentPage);
            this.CurrentPage = this.pages[index + 1];
            return true;
        };
        Survey.prototype.isCurrentPageHasErrors = function () {
            if (this.CurrentPage == null)
                return true;
            return this.CurrentPage.hasErrors();
        };
        Survey.prototype.prevPage = function () {
            if (this.isFirstPage)
                return false;
            var index = this.pages.indexOf(this.CurrentPage);
            this.CurrentPage = this.pages[index - 1];
        };
        Survey.prototype.completeLastPage = function () {
            if (this.isCurrentPageHasErrors())
                return false;
            this.onComplete.fire(this, null);
            return true;
        };
        Object.defineProperty(Survey.prototype, "isFirstPage", {
            get: function () {
                if (this.CurrentPage == null)
                    return true;
                return this.pages.indexOf(this.CurrentPage) == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "isLastPage", {
            get: function () {
                if (this.CurrentPage == null)
                    return true;
                return this.pages.indexOf(this.CurrentPage) == this.pages.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        Survey.prototype.getPage = function (index) {
            return this.pages[index];
        };
        Survey.prototype.addPage = function (page) {
            if (page == null)
                return;
            this.pages.push(page);
        };
        Survey.prototype.addNewPage = function (name) {
            var page = new dxSurvey.Page(name);
            this.addPage(page);
            return page;
        };
        Survey.prototype.getQuestionByName = function (name) {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].name == name)
                    return questions[i];
            }
            return null;
        };
        Survey.prototype.getAllQuestions = function () {
            var result = new Array();
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].addQuestionsToList(result);
            }
            return result;
        };
        Survey.prototype.notifyQuestionOnValueChanged = function (name, newValue) {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].name != name)
                    continue;
                questions[i].onSurveyValueChanged(newValue);
            }
            this.onValueChanged.fire(this, { 'name': name, 'value': newValue });
        };
        Survey.prototype.notifyAllQuestionsOnValueChanged = function () {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                questions[i].onSurveyValueChanged(this.getValue(questions[i].name));
            }
        };
        Survey.prototype.render = function (element) {
            var self = this;
            this.renderedElement = element;
            this.onBeforeRender();
            if (this.isKO) {
                this.loadFile("/templates/dx.survey.ko.html", function (html) {
                    element.innerHTML = html;
                    self.applyBinding();
                }, function (errorResult) { element.innerHTML = "Knockout template could not be loaded. " + errorResult; });
            }
        };
        Survey.prototype.onBeforeRender = function () {
            this.updateVisibleIndexes();
        };
        Survey.prototype.loadFile = function (fileName, funcSuccess, funcError) {
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        funcSuccess(xmlhttp.responseText);
                    }
                    else
                        funcError(xmlhttp.responseText);
                }
            };
            xmlhttp.open("GET", fileName, true);
            xmlhttp.send();
        };
        Survey.prototype.applyBinding = function () {
            if (!this.isKO || this.renderedElement == null)
                return;
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
        };
        Survey.prototype.updateVisibleIndexes = function () {
            var index = 0;
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (!questions[i].visible)
                    continue;
                questions[i].setVisibleIndex(index++);
            }
        };
        //ISurvey data
        Survey.prototype.getValue = function (name) {
            return this.valuesHash[name];
        };
        Survey.prototype.setValue = function (name, newValue) {
            this.valuesHash[name] = newValue;
            this.notifyQuestionOnValueChanged(name, newValue);
        };
        Survey.prototype.getComment = function (name) {
            var result = this.commentsHash[name];
            if (result == null)
                result = "";
            return result;
        };
        Survey.prototype.setComment = function (name, newValue) {
            if (newValue == "" || newValue == null) {
                delete this.commentsHash[name];
            }
            else {
                this.commentsHash[name] = newValue;
            }
        };
        Survey.prototype.onQuestionVisibilityChanged = function (name, newValue) {
            this.updateVisibleIndexes();
            this.onVisibleChanged.fire(this, { 'name': name, 'visible': newValue });
        };
        return Survey;
    })(dxSurvey.Base);
    dxSurvey.Survey = Survey;
    dxSurvey.JsonObject.metaData.addClass("survey", ["title", "pages"]);
    dxSurvey.JsonObject.metaData.setPropertyValues("survey", "pages", "page");
})(dxSurvey || (dxSurvey = {}));

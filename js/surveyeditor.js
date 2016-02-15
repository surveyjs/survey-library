var SurveyEditor;
(function (SurveyEditor) {
    var SurveyObjectProperty = (function () {
        function SurveyObjectProperty(property, editorType, onPropertyChanged) {
            if (onPropertyChanged === void 0) { onPropertyChanged = null; }
            this.property = property;
            this.editorType = editorType;
            this.name = this.property.name;
            this.koValue = ko.observable();
            var self = this;
            this.itemValues = null;
            if (editorType == "itemvalues") {
                this.itemValues = new SurveyPropertyItemValue(function (newValue) {
                    self.koValue(newValue);
                });
            }
            this.koValue.subscribe(function (newValue) {
                if (self.object == null)
                    return;
                if (self.object[self.name] == newValue)
                    return;
                if (onPropertyChanged != null && !self.isValueUpdating)
                    onPropertyChanged(self, newValue);
            });
            this.koText = ko.computed(function () { return self.getValueText(self.koValue()); });
            this.koIsDefault = ko.computed(function () { return self.property.isDefaultValue(self.koValue()); });
        }
        Object.defineProperty(SurveyObjectProperty.prototype, "object", {
            get: function () { return this.objectValue; },
            set: function (value) {
                this.objectValue = value;
                this.updateValue();
            },
            enumerable: true,
            configurable: true
        });
        SurveyObjectProperty.prototype.updateValue = function () {
            this.isValueUpdating = true;
            this.koValue(this.object[this.name]);
            if (this.itemValues) {
                this.itemValues.value = this.koValue();
            }
            this.isValueUpdating = false;
        };
        SurveyObjectProperty.prototype.getValueText = function (value) {
            if (value != null && Array.isArray(value)) {
                return "[ Items: " + value.length + " ]";
            }
            return value;
        };
        return SurveyObjectProperty;
    })();
    SurveyEditor.SurveyObjectProperty = SurveyObjectProperty;
    var SurveyPropertyItemValue = (function () {
        function SurveyPropertyItemValue(onValueChanged) {
            this.onValueChanged = onValueChanged;
            this.koItems = ko.observableArray();
            this.koNewValue = ko.observable();
            this.koNewText = ko.observable();
            this.value_ = [];
            var self = this;
            self.onApplyClick = function () { self.Apply(); };
            self.onDeleteClick = function (item) { self.koItems.remove(item); };
            self.onAddClick = function () { self.AddItem(); };
        }
        Object.defineProperty(SurveyPropertyItemValue.prototype, "value", {
            get: function () { return this.value_; },
            set: function (value) {
                if (value == null || !Array.isArray(value))
                    value = [];
                this.value_ = value;
                var array = [];
                for (var i = 0; i < value.length; i++) {
                    var item = value[i];
                    array.push({ koValue: ko.observable(item.value), koText: ko.observable(item.text) });
                }
                this.koItems(array);
            },
            enumerable: true,
            configurable: true
        });
        SurveyPropertyItemValue.prototype.AddItem = function () {
            this.koItems.push({ koValue: ko.observable(this.koNewValue()), koText: ko.observable(this.koNewText()) });
            this.koNewValue(null);
            this.koNewText(null);
        };
        SurveyPropertyItemValue.prototype.Apply = function () {
            this.value_ = [];
            for (var i = 0; i < this.koItems().length; i++) {
                var item = this.koItems()[i];
                this.value_.push({ value: item.koValue(), text: item.koText() });
            }
            if (this.onValueChanged) {
                this.onValueChanged(this.value_);
            }
        };
        return SurveyPropertyItemValue;
    })();
    SurveyEditor.SurveyPropertyItemValue = SurveyPropertyItemValue;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectProperty.ts" />
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyObjectEditor = (function () {
        function SurveyObjectEditor() {
            this.onPropertyValueChanged = new Survey.Event();
            this.koProperties = ko.observableArray();
            this.koActiveProperty = ko.observable();
            this.koTitle = ko.observable("");
            this.koHasObject = ko.observable();
            this.koShowProperties = ko.observable();
        }
        Object.defineProperty(SurveyObjectEditor.prototype, "title", {
            get: function () { return this.koTitle(); },
            set: function (value) { this.koTitle(value); },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyObjectEditor.prototype, "selectedObject", {
            get: function () { return this.selectedObjectValue; },
            set: function (value) {
                if (this.selectedObjectValue == value)
                    return;
                this.koHasObject(value != null);
                this.selectedObjectValue = value;
                this.updateProperties();
                this.updatePropertiesObject();
            },
            enumerable: true,
            configurable: true
        });
        SurveyObjectEditor.prototype.getPropertyEditor = function (name) {
            var properties = this.koProperties();
            for (var i = 0; i < properties.length; i++) {
                if (properties[i].name == name)
                    return properties[i];
            }
            return null;
        };
        SurveyObjectEditor.prototype.changeActiveProperty = function (property) {
            this.koActiveProperty(property);
        };
        SurveyObjectEditor.prototype.ObjectChanged = function () {
            this.updatePropertiesObject();
        };
        SurveyObjectEditor.prototype.showProperties = function () {
            this.koShowProperties(!this.koShowProperties());
        };
        SurveyObjectEditor.prototype.updateProperties = function () {
            var _this = this;
            if (!this.selectedObject || !this.selectedObject.getType) {
                this.koProperties([]);
                this.koActiveProperty(null);
                return;
            }
            var properties = Survey.JsonObject.metaData.getProperties(this.selectedObject.getType());
            properties.sort(function (a, b) {
                if (a.name == b.name)
                    return 0;
                if (a.name > b.name)
                    return 1;
                return -1;
            });
            var objectProperties = [];
            var self = this;
            var propEvent = function (property, newValue) {
                self.onPropertyValueChanged.fire(_this, { property: property.property, object: property.object, newValue: newValue });
            };
            for (var i = 0; i < properties.length; i++) {
                if (!this.canShowProperty(properties[i]))
                    continue;
                var editorType = this.getPropertyEditorType(properties[i]);
                var objectProperty = new SurveyEditor.SurveyObjectProperty(properties[i], editorType, propEvent);
                if (editorType == "dropdown") {
                    objectProperty.choices = this.getPropertyEditorChoices(properties[i]);
                }
                objectProperties.push(objectProperty);
            }
            this.koProperties(objectProperties);
            this.koActiveProperty(this.getPropertyEditor("name"));
        };
        SurveyObjectEditor.prototype.getPropertyEditorType = function (property) {
            var name = property.name;
            if (name == "showQuestionNumbers" || name == "choicesOrder" || name == "colCount")
                return "dropdown";
            if (name == "choices" || name == "columns" || name == "rows" || name == "rateValues")
                return "itemvalues";
            if (name == "visible" || name.indexOf("is") == 0 || name.indexOf("has") == 0 || name.indexOf("show") == 0 || name == "sendResultOnPageNext")
                return "boolean";
            return "text";
        };
        SurveyObjectEditor.prototype.getPropertyEditorChoices = function (property) {
            var name = property.name;
            if (name == "showQuestionNumbers")
                return ["on", "onPage", "off"];
            if (name == "choicesOrder")
                return ["none", "asc", "desc", "random"];
            if (name == "colCount")
                return [1, 2, 3, 4];
            return [];
        };
        SurveyObjectEditor.prototype.canShowProperty = function (property) {
            var name = property.name;
            if (name == 'questions' || name == 'pages')
                return false;
            return true;
        };
        SurveyObjectEditor.prototype.updatePropertiesObject = function () {
            var properties = this.koProperties();
            for (var i = 0; i < properties.length; i++) {
                properties[i].object = this.selectedObject;
            }
        };
        return SurveyObjectEditor;
    })();
    SurveyEditor.SurveyObjectEditor = SurveyObjectEditor;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPagesEditor = (function () {
        function SurveyPagesEditor(onAddNewPageCallback, onSelectPageCallback) {
            if (onAddNewPageCallback === void 0) { onAddNewPageCallback = null; }
            if (onSelectPageCallback === void 0) { onSelectPageCallback = null; }
            this.koPages = ko.observableArray();
            this.koIsValid = ko.observable(false);
            this.onAddNewPageCallback = onAddNewPageCallback;
            this.onSelectPageCallback = onSelectPageCallback;
            var self = this;
            self.selectPageClick = function (pageItem) {
                if (self.onSelectPageCallback) {
                    self.onSelectPageCallback(pageItem.page);
                }
            };
        }
        Object.defineProperty(SurveyPagesEditor.prototype, "survey", {
            get: function () { return this.surveyValue; },
            set: function (value) {
                this.surveyValue = value;
                this.koIsValid(this.surveyValue != null);
                this.updatePages();
            },
            enumerable: true,
            configurable: true
        });
        SurveyPagesEditor.prototype.setSelectedPage = function (page) {
            var pages = this.koPages();
            for (var i = 0; i < pages.length; i++) {
                pages[i].koSelected(pages[i].page == page);
            }
        };
        SurveyPagesEditor.prototype.addNewPageClick = function () {
            if (this.onAddNewPageCallback) {
                this.onAddNewPageCallback();
            }
        };
        SurveyPagesEditor.prototype.removePage = function (page) {
            var pages = this.koPages();
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].page == page) {
                    this.koPages.splice(i, 1);
                    return;
                }
            }
        };
        SurveyPagesEditor.prototype.updatePages = function () {
            if (this.surveyValue == null) {
                this.koPages([]);
                return;
            }
            var pages = [];
            for (var i = 0; i < this.surveyValue.pages.length; i++) {
                pages.push({
                    title: 'Page ' + (i + 1), page: this.surveyValue.pages[i], koSelected: ko.observable(false)
                });
            }
            this.koPages(pages);
        };
        return SurveyPagesEditor;
    })();
    SurveyEditor.SurveyPagesEditor = SurveyPagesEditor;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var TextParserPropery = (function () {
        function TextParserPropery() {
        }
        return TextParserPropery;
    })();
    var SurveyTextWorker = (function () {
        function SurveyTextWorker(text) {
            this.text = text;
            this.errors = [];
            this.process();
        }
        Object.defineProperty(SurveyTextWorker.prototype, "survey", {
            get: function () { return this.surveyValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyTextWorker.prototype, "isJsonCorrect", {
            get: function () { return this.surveyValue && !this.surveyValue.isEmpty; },
            enumerable: true,
            configurable: true
        });
        SurveyTextWorker.prototype.process = function () {
            try {
                this.jsonValue = new SurveyEditor.SurveyJSON5(1).parse(this.text);
            }
            catch (error) {
                this.errors.push({ pos: { start: error.at, end: -1 }, text: error.message });
            }
            if (this.jsonValue != null) {
                this.updateJsonPositions(this.jsonValue);
                this.surveyValue = new Survey.Survey(this.jsonValue);
                if (this.surveyValue.jsonErrors != null) {
                    for (var i = 0; i < this.surveyValue.jsonErrors.length; i++) {
                        var error = this.surveyValue.jsonErrors[i];
                        this.errors.push({ pos: { start: error.at, end: -1 }, text: error.getFullDescription() });
                    }
                }
            }
            this.surveyObjects = this.createSurveyObjects();
            this.setEditorPositionByChartAt(this.surveyObjects);
            this.setEditorPositionByChartAt(this.errors);
        };
        SurveyTextWorker.prototype.updateJsonPositions = function (jsonObj) {
            jsonObj["pos"]["self"] = jsonObj;
            for (var key in jsonObj) {
                var obj = jsonObj[key];
                if (obj && obj["pos"]) {
                    jsonObj["pos"][key] = obj["pos"];
                    this.updateJsonPositions(obj);
                }
            }
        };
        SurveyTextWorker.prototype.createSurveyObjects = function () {
            var result = [];
            if (this.surveyValue == null)
                return result;
            this.isSurveyAsPage = false;
            for (var i = 0; i < this.surveyValue.pages.length; i++) {
                var page = this.surveyValue.pages[i];
                if (i == 0 && !page["pos"]) {
                    page["pos"] = this.surveyValue["pos"];
                    this.isSurveyAsPage = true;
                }
                result.push(page);
                for (var j = 0; j < page.questions.length; j++) {
                    result.push(page.questions[j]);
                }
            }
            return result;
        };
        SurveyTextWorker.prototype.setEditorPositionByChartAt = function (objects) {
            if (objects == null || objects.length == 0)
                return;
            var position = { row: 0, column: 0 };
            var atObjectsArray = this.getAtArray(objects);
            var startAt = 0;
            for (var i = 0; i < atObjectsArray.length; i++) {
                var at = atObjectsArray[i].at;
                position = this.getPostionByChartAt(position, startAt, at);
                var obj = atObjectsArray[i].obj;
                if (!obj.position)
                    obj.position = {};
                if (at == obj.pos.start) {
                    obj.position.start = position;
                }
                else {
                    if (at == obj.pos.end) {
                        obj.position.end = position;
                    }
                }
                startAt = at;
            }
        };
        SurveyTextWorker.prototype.getPostionByChartAt = function (startPosition, startAt, at) {
            var result = { row: startPosition.row, column: startPosition.column };
            var curChar = startAt;
            while (curChar < at) {
                if (this.text.charAt(curChar) == SurveyTextWorker.newLineChar) {
                    result.row++;
                    result.column = 0;
                }
                else {
                    result.column++;
                }
                curChar++;
            }
            return result;
        };
        SurveyTextWorker.prototype.getAtArray = function (objects) {
            var result = [];
            for (var i = 0; i < objects.length; i++) {
                var obj = objects[i];
                var pos = obj.pos;
                if (!pos)
                    continue;
                result.push({ at: pos.start, obj: obj });
                if (pos.end > 0) {
                    result.push({ at: pos.end, obj: obj });
                }
            }
            return result.sort(function (el1, el2) {
                if (el1.at > el2.at)
                    return 1;
                if (el1.at < el2.at)
                    return -1;
                return 0;
            });
        };
        return SurveyTextWorker;
    })();
    SurveyEditor.SurveyTextWorker = SurveyTextWorker;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectEditor.ts" />
/// <reference path="pagesEditor.ts" />
/// <reference path="textWorker.ts" />
var SurveyEditor;
(function (SurveyEditor_1) {
    var SurveyEditor = (function () {
        function SurveyEditor(renderedElement) {
            if (renderedElement === void 0) { renderedElement = null; }
            this.timeoutId = -1;
            this.questionTypes = Survey.QuestionFactory.Instance.getAllTypes();
            this.koSelectedQuestionType = ko.observable(this.questionTypes[0]);
            this.koCanDeleteObject = ko.observable(false);
            var self = this;
            this.koObjects = ko.observableArray();
            this.koSelectedObject = ko.observable();
            this.koSelectedObject.subscribe(function (newValue) { self.selectedObjectChanged(newValue != null ? newValue.value : null); });
            this.surveyObjects = new SurveyEditor_1.SurveyObjects(this.koObjects, this.koSelectedObject);
            this.selectedObjectEditor = new SurveyEditor_1.SurveyObjectEditor();
            this.selectedObjectEditor.title = "Survey";
            this.selectedObjectEditor.koShowProperties(true);
            this.selectedObjectEditor.onPropertyValueChanged.add(function (sender, options) {
                self.onPropertyValueChanged(options.property, options.object, options.newValue);
            });
            this.pagesEditor = new SurveyEditor_1.SurveyPagesEditor(function () { self.addPage(); }, function (page) { self.surveyObjects.selectObject(page); });
            this.koIsShowDesigner = ko.observable(true);
            this.selectDesignerClick = function () { self.showDesigner(); };
            this.selectEditorClick = function () { self.showJsonEditor(); };
            this.selectQuestionTypeClick = function (value) { self.koSelectedQuestionType(value); };
            this.runSurveyClick = function () { self.showLiveSurvey(); };
            this.deleteObjectClick = function () { self.deleteCurrentObject(); };
            if (renderedElement) {
                this.render(renderedElement);
            }
        }
        Object.defineProperty(SurveyEditor.prototype, "survey", {
            get: function () {
                return this.surveyValue;
            },
            enumerable: true,
            configurable: true
        });
        SurveyEditor.prototype.render = function (element) {
            if (element === void 0) { element = null; }
            var self = this;
            if (element && typeof element == "string") {
                element = document.getElementById(element);
            }
            if (element) {
                this.renderedElement = element;
            }
            element = this.renderedElement;
            if (!element)
                return;
            element.innerHTML = templateEditor.ko.html;
            self.applyBinding();
        };
        Object.defineProperty(SurveyEditor.prototype, "text", {
            get: function () {
                return this.jsonEditor != null ? this.jsonEditor.getValue() : "";
            },
            set: function (value) {
                this.setTextValue(value, 1);
            },
            enumerable: true,
            configurable: true
        });
        SurveyEditor.prototype.getTextAndProcess = function () {
            var text = this.text;
            if (this.timeoutId > 0) {
                clearTimeout(this.timeoutId);
                this.timeoutId = -1;
                this.processJson(text);
            }
            return text;
        };
        SurveyEditor.prototype.setText = function (value, findText) {
            this.isTextChangedFromDesigner = true;
            this.text = value;
            this.isTextChangedFromDesigner = false;
            this.jsonEditor.find(findText);
        };
        SurveyEditor.prototype.addPage = function () {
            var name = this.getNewName(this.survey.pages, "page");
            var page = this.surveyValue.addNewPage(name);
            this.pagesEditor.survey = this.surveyValue;
            this.surveyObjects.addPage(page);
            if (this.surveyjs != null) {
                this.surveyjs.focus();
            }
        };
        SurveyEditor.prototype.addQuestion = function () {
            var page = this.survey.currentPage;
            if (page == null)
                return;
            var name = this.getNewName(this.survey.getAllQuestions(), "question");
            var question = Survey.QuestionFactory.Instance.createQuestion(this.koSelectedQuestionType(), name);
            page.addQuestion(question);
            this.surveyObjects.addQuestion(question);
            this.surveyValue.render();
        };
        SurveyEditor.prototype.onPropertyValueChanged = function (property, object, newValue) {
            var isDefault = property.isDefaultValue(newValue);
            object[property.name] = newValue;
            this.surveyValue.render();
        };
        SurveyEditor.prototype.showDesigner = function () {
            if (!this.textWorker.isJsonCorrect) {
                alert("Please correct JSON!");
                return;
            }
            this.initSurvey(new Survey.JsonObject().toJsonObject(this.textWorker.survey));
            this.koIsShowDesigner(true);
        };
        SurveyEditor.prototype.showJsonEditor = function () {
            var json = new Survey.JsonObject().toJsonObject(this.survey);
            this.jsonEditor.setValue(new SurveyEditor_1.SurveyJSON5().stringify(json, null, 1));
            this.jsonEditor.focus();
            this.koIsShowDesigner(false);
        };
        SurveyEditor.prototype.selectedObjectChanged = function (obj) {
            var canDeleteObject = false;
            this.selectedObjectEditor.selectedObject = obj;
            if (obj != null && obj.getType() == "page") {
                this.survey.currentPage = obj;
                canDeleteObject = this.survey.pages.length > 1;
            }
            this.survey.selectedQuestion = obj != null && obj["koValue"] ? obj : null;
            canDeleteObject = canDeleteObject || this.survey.selectedQuestion != null;
            if (this.survey.selectedQuestion != null) {
                this.survey.currentPage = this.survey.getPageByQuestion(this.survey.selectedQuestion);
            }
            this.koCanDeleteObject(canDeleteObject);
        };
        SurveyEditor.prototype.setTextValue = function (value, position) {
            if (this.jsonEditor == null)
                return;
            this.isProcessingImmediately = true;
            this.jsonEditor.setValue(value, position);
            this.jsonEditor.renderer.updateFull(true);
            this.processJson(value);
            this.isProcessingImmediately = false;
        };
        SurveyEditor.prototype.applyBinding = function () {
            if (this.renderedElement == null)
                return;
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
            this.surveyjs = document.getElementById("surveyjs");
            this.jsonEditor = ace.edit("surveyjsEditor");
            this.surveyjsExample = document.getElementById("surveyjsExample");
            this.initSurvey(new SurveyEditor_1.SurveyJSON5().parse(SurveyEditor.defaultNewSurveyText));
            this.surveyValue.mode = "designer";
            this.surveyValue.render(this.surveyjs);
            this.initJsonEditor();
            SurveyEditor_1.SurveyTextWorker.newLineChar = this.jsonEditor.session.doc.getNewLineCharacter();
        };
        SurveyEditor.prototype.initJsonEditor = function () {
            var self = this;
            this.jsonEditor.setTheme("ace/theme/monokai");
            this.jsonEditor.session.setMode("ace/mode/json");
            this.jsonEditor.setShowPrintMargin(false);
            this.jsonEditor.getSession().on("change", function () {
                self.onJsonEditorChanged();
            });
            this.jsonEditor.getSession().setUseWorker(true);
        };
        SurveyEditor.prototype.initSurvey = function (json) {
            this.surveyValue = new Survey.Survey(json);
            this.survey.mode = "designer";
            this.survey.render(this.surveyjs);
            this.surveyObjects.survey = this.survey;
            this.pagesEditor.survey = this.survey;
            this.pagesEditor.setSelectedPage(this.survey.currentPage);
            var self = this;
            this.surveyValue.onSelectedQuestionChanged.add(function (sender, options) { self.surveyObjects.selectObject(sender.selectedQuestion); });
            this.surveyValue.onCurrentPageChanged.add(function (sender, options) { self.pagesEditor.setSelectedPage(sender.currentPage); });
        };
        SurveyEditor.prototype.onJsonEditorChanged = function () {
            if (this.timeoutId > -1) {
                clearTimeout(this.timeoutId);
            }
            if (this.isProcessingImmediately) {
                this.timeoutId = -1;
            }
            else {
                var self = this;
                this.timeoutId = setTimeout(function () {
                    self.timeoutId = -1;
                    self.processJson(self.text);
                }, SurveyEditor.updateTextTimeout);
            }
        };
        SurveyEditor.prototype.processJson = function (text) {
            this.textWorker = new SurveyEditor_1.SurveyTextWorker(text);
            this.jsonEditor.getSession().setAnnotations(this.createAnnotations(text, this.textWorker.errors));
        };
        SurveyEditor.prototype.deleteCurrentObject = function () {
            var obj = this.koSelectedObject().value;
            this.surveyObjects.removeObject(obj);
            if (obj.getType() == "page") {
                this.survey.removePage(obj);
                this.pagesEditor.removePage(obj);
            }
            else {
                this.survey.currentPage.removeQuestion(obj);
                this.survey.selectedQuestion = null;
                this.surveyObjects.selectObject(this.survey.currentPage);
            }
            this.survey.render();
        };
        SurveyEditor.prototype.showLiveSurvey = function () {
            if (!this.surveyjsExample)
                return;
            var json = null;
            if (this.koIsShowDesigner()) {
                json = new Survey.JsonObject().toJsonObject(this.survey);
            }
            else {
                if (this.textWorker.isJsonCorrect) {
                    json = new Survey.JsonObject().toJsonObject(this.textWorker.survey);
                }
            }
            if (json != null) {
                var survey = new Survey.Survey(json);
                var self = this;
                survey.onComplete.add(function (sender) { self.surveyjsExample.innerHTML = "Survey Result: " + new SurveyEditor_1.SurveyJSON5().stringify(survey.data); });
                survey.render(this.surveyjsExample);
            }
            else {
                this.surveyjsExample.innerHTML = "Please correct JSON!";
            }
        };
        SurveyEditor.prototype.createAnnotations = function (text, errors) {
            var annotations = new Array();
            for (var i = 0; i < errors.length; i++) {
                var error = errors[i];
                var annotation = { row: error.position.start.row, column: error.position.start.column, text: error.text, type: "error" };
                annotations.push(annotation);
            }
            return annotations;
        };
        SurveyEditor.prototype.getNewName = function (objs, baseName) {
            var hash = {};
            for (var i = 0; i < objs.length; i++) {
                hash[objs[i].name] = true;
            }
            var num = 1;
            while (true) {
                if (!hash[baseName + num.toString()])
                    break;
                num++;
            }
            return baseName + num.toString();
        };
        SurveyEditor.updateTextTimeout = 1000;
        SurveyEditor.defaultNewSurveyText = "{ pages: [ { name: 'page1', questions: [{ type: 'text', name: 'question1' }] }] }";
        return SurveyEditor;
    })();
    SurveyEditor_1.SurveyEditor = SurveyEditor;
})(SurveyEditor || (SurveyEditor = {}));

// This file is based on JSON5, http://json5.org/
// The modification for getting object and properties location 'at' were maden.
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyJSON5 = (function () {
        function SurveyJSON5(parseType) {
            if (parseType === void 0) { parseType = 0; }
            this.parseType = parseType;
        }
        SurveyJSON5.prototype.parse = function (source, reviver, startFrom, endAt) {
            if (reviver === void 0) { reviver = null; }
            if (startFrom === void 0) { startFrom = 0; }
            if (endAt === void 0) { endAt = -1; }
            var result;
            this.text = String(source);
            this.at = startFrom;
            this.endAt = endAt;
            this.ch = ' ';
            result = this.value();
            this.white();
            if (this.ch) {
                this.error("Syntax error");
            }
            // If there is a reviver function, we recursively walk the new structure,
            // passing each name/value pair to the reviver function for possible
            // transformation, starting with a temporary root object that holds the result
            // in an empty key. If there is not a reviver function, we simply return the
            // result.
            return typeof reviver === 'function' ? (function walk(holder, key) {
                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            }
                            else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }({ '': result }, '')) : result;
        };
        SurveyJSON5.prototype.error = function (m) {
            // Call error when something is wrong.
            var error = new SyntaxError();
            error.message = m;
            error["at"] = this.at;
            throw error;
        };
        SurveyJSON5.prototype.next = function (c) {
            if (c === void 0) { c = null; }
            // If a c parameter is provided, verify that it matches the current character.
            if (c && c !== this.ch) {
                this.error("Expected '" + c + "' instead of '" + this.ch + "'");
            }
            // Get the this.next character. When there are no more characters,
            // return the empty string.
            this.ch = this.chartAt();
            this.at += 1;
            return this.ch;
        };
        SurveyJSON5.prototype.peek = function () {
            // Get the this.next character without consuming it or
            // assigning it to the this.ch varaible.
            return this.chartAt();
        };
        SurveyJSON5.prototype.chartAt = function () {
            if (this.endAt > -1 && this.at >= this.endAt)
                return '';
            return this.text.charAt(this.at);
        };
        SurveyJSON5.prototype.identifier = function () {
            // Parse an identifier. Normally, reserved words are disallowed here, but we
            // only use this for unquoted object keys, where reserved words are allowed,
            // so we don't check for those here. References:
            // - http://es5.github.com/#x7.6
            // - https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Variables
            // - http://docstore.mik.ua/orelly/webprog/jscript/ch02_07.htm
            // TODO Identifiers can have Unicode "letters" in them; add support for those.
            var key = this.ch;
            // Identifiers must start with a letter, _ or $.
            if ((this.ch !== '_' && this.ch !== '$') &&
                (this.ch < 'a' || this.ch > 'z') &&
                (this.ch < 'A' || this.ch > 'Z')) {
                this.error("Bad identifier");
            }
            // Subsequent characters can contain digits.
            while (this.next() && (this.ch === '_' || this.ch === '$' ||
                (this.ch >= 'a' && this.ch <= 'z') ||
                (this.ch >= 'A' && this.ch <= 'Z') ||
                (this.ch >= '0' && this.ch <= '9'))) {
                key += this.ch;
            }
            return key;
        };
        SurveyJSON5.prototype.number = function () {
            // Parse a number value.
            var number, sign = '', string = '', base = 10;
            if (this.ch === '-' || this.ch === '+') {
                sign = this.ch;
                this.next(this.ch);
            }
            // support for Infinity (could tweak to allow other words):
            if (this.ch === 'I') {
                number = this.word();
                if (typeof number !== 'number' || isNaN(number)) {
                    this.error('Unexpected word for number');
                }
                return (sign === '-') ? -number : number;
            }
            // support for NaN
            if (this.ch === 'N') {
                number = this.word();
                if (!isNaN(number)) {
                    this.error('expected word to be NaN');
                }
                // ignore sign as -NaN also is NaN
                return number;
            }
            if (this.ch === '0') {
                string += this.ch;
                this.next();
                if (this.ch === 'x' || this.ch === 'X') {
                    string += this.ch;
                    this.next();
                    base = 16;
                }
                else if (this.ch >= '0' && this.ch <= '9') {
                    this.error('Octal literal');
                }
            }
            switch (base) {
                case 10:
                    while (this.ch >= '0' && this.ch <= '9') {
                        string += this.ch;
                        this.next();
                    }
                    if (this.ch === '.') {
                        string += '.';
                        while (this.next() && this.ch >= '0' && this.ch <= '9') {
                            string += this.ch;
                        }
                    }
                    if (this.ch === 'e' || this.ch === 'E') {
                        string += this.ch;
                        this.next();
                        if (this.ch === '-' || this.ch === '+') {
                            string += this.ch;
                            this.next();
                        }
                        while (this.ch >= '0' && this.ch <= '9') {
                            string += this.ch;
                            this.next();
                        }
                    }
                    break;
                case 16:
                    while (this.ch >= '0' && this.ch <= '9' || this.ch >= 'A' && this.ch <= 'F' || this.ch >= 'a' && this.ch <= 'f') {
                        string += this.ch;
                        this.next();
                    }
                    break;
            }
            if (sign === '-') {
                number = -string;
            }
            else {
                number = +string;
            }
            if (!isFinite(number)) {
                this.error("Bad number");
            }
            else {
                return number;
            }
        };
        SurveyJSON5.prototype.string = function () {
            // Parse a string value.
            var hex, i, string = '', delim, uffff;
            // When parsing for string values, we must look for ' or " and \ characters.
            if (this.ch === '"' || this.ch === "'") {
                delim = this.ch;
                while (this.next()) {
                    if (this.ch === delim) {
                        this.next();
                        return string;
                    }
                    else if (this.ch === '\\') {
                        this.next();
                        if (this.ch === 'u') {
                            uffff = 0;
                            for (i = 0; i < 4; i += 1) {
                                hex = parseInt(this.next(), 16);
                                if (!isFinite(hex)) {
                                    break;
                                }
                                uffff = uffff * 16 + hex;
                            }
                            string += String.fromCharCode(uffff);
                        }
                        else if (this.ch === '\r') {
                            if (this.peek() === '\n') {
                                this.next();
                            }
                        }
                        else if (typeof SurveyJSON5.escapee[this.ch] === 'string') {
                            string += SurveyJSON5.escapee[this.ch];
                        }
                        else {
                            break;
                        }
                    }
                    else if (this.ch === '\n') {
                        // unescaped newlines are invalid; see:
                        // https://github.com/aseemk/json5/issues/24
                        // TODO this feels special-cased; are there other
                        // invalid unescaped chars?
                        break;
                    }
                    else {
                        string += this.ch;
                    }
                }
            }
            this.error("Bad string");
        };
        SurveyJSON5.prototype.inlineComment = function () {
            // Skip an inline comment, assuming this is one. The current character should
            // be the second / character in the // pair that begins this inline comment.
            // To finish the inline comment, we look for a newline or the end of the text.
            if (this.ch !== '/') {
                this.error("Not an inline comment");
            }
            do {
                this.next();
                if (this.ch === '\n' || this.ch === '\r') {
                    this.next();
                    return;
                }
            } while (this.ch);
        };
        SurveyJSON5.prototype.blockComment = function () {
            // Skip a block comment, assuming this is one. The current character should be
            // the * character in the /* pair that begins this block comment.
            // To finish the block comment, we look for an ending */ pair of characters,
            // but we also watch for the end of text before the comment is terminated.
            if (this.ch !== '*') {
                this.error("Not a block comment");
            }
            do {
                this.next();
                while (this.ch === '*') {
                    this.next('*');
                    if (this.ch === '/') {
                        this.next('/');
                        return;
                    }
                }
            } while (this.ch);
            this.error("Unterminated block comment");
        };
        SurveyJSON5.prototype.comment = function () {
            // Skip a comment, whether inline or block-level, assuming this is one.
            // Comments always begin with a / character.
            if (this.ch !== '/') {
                this.error("Not a comment");
            }
            this.next('/');
            if (this.ch === '/') {
                this.inlineComment();
            }
            else if (this.ch === '*') {
                this.blockComment();
            }
            else {
                this.error("Unrecognized comment");
            }
        };
        SurveyJSON5.prototype.white = function () {
            // Skip whitespace and comments.
            // Note that we're detecting comments by only a single / character.
            // This works since regular expressions are not valid JSON(5), but this will
            // break if there are other valid values that begin with a / character!
            while (this.ch) {
                if (this.ch === '/') {
                    this.comment();
                }
                else if (SurveyJSON5.ws.indexOf(this.ch) >= 0) {
                    this.next();
                }
                else {
                    return;
                }
            }
        };
        SurveyJSON5.prototype.word = function () {
            // true, false, or null.
            switch (this.ch) {
                case 't':
                    this.next('t');
                    this.next('r');
                    this.next('u');
                    this.next('e');
                    return true;
                case 'f':
                    this.next('f');
                    this.next('a');
                    this.next('l');
                    this.next('s');
                    this.next('e');
                    return false;
                case 'n':
                    this.next('n');
                    this.next('u');
                    this.next('l');
                    this.next('l');
                    return null;
                case 'I':
                    this.next('I');
                    this.next('n');
                    this.next('f');
                    this.next('i');
                    this.next('n');
                    this.next('i');
                    this.next('t');
                    this.next('y');
                    return Infinity;
                case 'N':
                    this.next('N');
                    this.next('a');
                    this.next('N');
                    return NaN;
            }
            this.error("Unexpected '" + this.ch + "'");
        };
        SurveyJSON5.prototype.array = function () {
            // Parse an array value.
            var array = [];
            if (this.ch === '[') {
                this.next('[');
                this.white();
                while (this.ch) {
                    if (this.ch === ']') {
                        this.next(']');
                        return array; // Potentially empty array
                    }
                    // ES5 allows omitting elements in arrays, e.g. [,] and
                    // [,null]. We don't allow this in JSON5.
                    if (this.ch === ',') {
                        this.error("Missing array element");
                    }
                    else {
                        array.push(this.value());
                    }
                    this.white();
                    // If there's no comma after this value, this needs to
                    // be the end of the array.
                    if (this.ch !== ',') {
                        this.next(']');
                        return array;
                    }
                    this.next(',');
                    this.white();
                }
            }
            this.error("Bad array");
        };
        SurveyJSON5.prototype.object = function () {
            // Parse an object value.
            var key, start, isFirstProperty = true, object = {};
            if (this.parseType > 0) {
                object[SurveyJSON5.positionName] = { start: this.at - 1 };
            }
            if (this.ch === '{') {
                this.next('{');
                this.white();
                start = this.at - 1;
                while (this.ch) {
                    if (this.ch === '}') {
                        if (this.parseType > 0) {
                            object[SurveyJSON5.positionName].end = start;
                        }
                        this.next('}');
                        return object; // Potentially empty object
                    }
                    // Keys can be unquoted. If they are, they need to be
                    // valid JS identifiers.
                    if (this.ch === '"' || this.ch === "'") {
                        key = this.string();
                    }
                    else {
                        key = this.identifier();
                    }
                    this.white();
                    if (this.parseType > 1) {
                        object[SurveyJSON5.positionName][key] = { start: start, valueStart: this.at };
                    }
                    this.next(':');
                    object[key] = this.value();
                    if (this.parseType > 1) {
                        start = this.at - 1;
                        object[SurveyJSON5.positionName][key].valueEnd = start;
                        object[SurveyJSON5.positionName][key].end = start;
                    }
                    this.white();
                    // If there's no comma after this pair, this needs to be
                    // the end of the object.
                    if (this.ch !== ',') {
                        if (this.parseType > 1) {
                            object[SurveyJSON5.positionName][key].valueEnd--;
                            object[SurveyJSON5.positionName][key].end--;
                        }
                        if (this.parseType > 0) {
                            object[SurveyJSON5.positionName].end = this.at - 1;
                        }
                        this.next('}');
                        return object;
                    }
                    if (this.parseType > 1) {
                        object[SurveyJSON5.positionName][key].valueEnd--;
                        if (!isFirstProperty) {
                            object[SurveyJSON5.positionName][key].end--;
                        }
                    }
                    this.next(',');
                    this.white();
                    isFirstProperty = false;
                }
            }
            this.error("Bad object");
        };
        SurveyJSON5.prototype.value = function () {
            // Parse a JSON value. It could be an object, an array, a string, a number,
            // or a word.
            this.white();
            switch (this.ch) {
                case '{':
                    return this.object();
                case '[':
                    return this.array();
                case '"':
                case "'":
                    return this.string();
                case '-':
                case '+':
                case '.':
                    return this.number();
                default:
                    return this.ch >= '0' && this.ch <= '9' ? this.number() : this.word();
            }
        };
        SurveyJSON5.prototype.stringify = function (obj, replacer, space) {
            if (replacer === void 0) { replacer = null; }
            if (space === void 0) { space = null; }
            if (replacer && (typeof (replacer) !== "function" && !this.isArray(replacer))) {
                throw new Error('Replacer must be a function or an array');
            }
            this.replacer = replacer;
            this.indentStr = this.getIndent(space);
            this.objStack = [];
            // special case...when undefined is used inside of
            // a compound object/array, return null.
            // but when top-level, return undefined
            var topLevelHolder = { "": obj };
            if (obj === undefined) {
                return this.getReplacedValueOrUndefined(topLevelHolder, '', true);
            }
            return this.internalStringify(topLevelHolder, '', true);
        };
        SurveyJSON5.prototype.getIndent = function (space) {
            if (space) {
                if (typeof space === "string") {
                    return space;
                }
                else if (typeof space === "number" && space >= 0) {
                    return this.makeIndent(" ", space, true);
                }
            }
            return "";
        };
        SurveyJSON5.prototype.getReplacedValueOrUndefined = function (holder, key, isTopLevel) {
            var value = holder[key];
            // Replace the value with its toJSON value first, if possible
            if (value && value.toJSON && typeof value.toJSON === "function") {
                value = value.toJSON();
            }
            // If the user-supplied replacer if a function, call it. If it's an array, check objects' string keys for
            // presence in the array (removing the key/value pair from the resulting JSON if the key is missing).
            if (typeof (this.replacer) === "function") {
                return this.replacer.call(holder, key, value);
            }
            else if (this.replacer) {
                if (isTopLevel || this.isArray(holder) || this.replacer.indexOf(key) >= 0) {
                    return value;
                }
                else {
                    return undefined;
                }
            }
            else {
                return value;
            }
        };
        SurveyJSON5.prototype.isWordChar = function (char) {
            return (char >= 'a' && char <= 'z') ||
                (char >= 'A' && char <= 'Z') ||
                (char >= '0' && char <= '9') ||
                char === '_' || char === '$';
        };
        SurveyJSON5.prototype.isWordStart = function (char) {
            return (char >= 'a' && char <= 'z') ||
                (char >= 'A' && char <= 'Z') ||
                char === '_' || char === '$';
        };
        SurveyJSON5.prototype.isWord = function (key) {
            if (typeof key !== 'string') {
                return false;
            }
            if (!this.isWordStart(key[0])) {
                return false;
            }
            var i = 1, length = key.length;
            while (i < length) {
                if (!this.isWordChar(key[i])) {
                    return false;
                }
                i++;
            }
            return true;
        };
        // polyfills
        SurveyJSON5.prototype.isArray = function (obj) {
            if (Array.isArray) {
                return Array.isArray(obj);
            }
            else {
                return Object.prototype.toString.call(obj) === '[object Array]';
            }
        };
        SurveyJSON5.prototype.isDate = function (obj) {
            return Object.prototype.toString.call(obj) === '[object Date]';
        };
        SurveyJSON5.prototype.isNaN = function (val) {
            return typeof val === 'number' && val !== val;
        };
        SurveyJSON5.prototype.checkForCircular = function (obj) {
            for (var i = 0; i < this.objStack.length; i++) {
                if (this.objStack[i] === obj) {
                    throw new TypeError("Converting circular structure to JSON");
                }
            }
        };
        SurveyJSON5.prototype.makeIndent = function (str, num, noNewLine) {
            if (noNewLine === void 0) { noNewLine = false; }
            if (!str) {
                return "";
            }
            // indentation no more than 10 chars
            if (str.length > 10) {
                str = str.substring(0, 10);
            }
            var indent = noNewLine ? "" : "\n";
            for (var i = 0; i < num; i++) {
                indent += str;
            }
            return indent;
        };
        SurveyJSON5.prototype.escapeString = function (str) {
            // If the string contains no control characters, no quote characters, and no
            // backslash characters, then we can safely slap some quotes around it.
            // Otherwise we must also replace the offending characters with safe escape
            // sequences.
            SurveyJSON5.escapable.lastIndex = 0;
            return SurveyJSON5.escapable.test(str) ? '"' + str.replace(SurveyJSON5.escapable, function (a) {
                var c = SurveyJSON5.meta[a];
                return typeof c === 'string' ?
                    c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + str + '"';
        };
        // End
        SurveyJSON5.prototype.internalStringify = function (holder, key, isTopLevel) {
            var buffer, res;
            // Replace the value, if necessary
            var obj_part = this.getReplacedValueOrUndefined(holder, key, isTopLevel);
            if (obj_part && !this.isDate(obj_part)) {
                // unbox objects
                // don't unbox dates, since will turn it into number
                obj_part = obj_part.valueOf();
            }
            switch (typeof obj_part) {
                case "boolean":
                    return obj_part.toString();
                case "number":
                    if (isNaN(obj_part) || !isFinite(obj_part)) {
                        return "null";
                    }
                    return obj_part.toString();
                case "string":
                    return this.escapeString(obj_part.toString());
                case "object":
                    if (obj_part === null) {
                        return "null";
                    }
                    else if (this.isArray(obj_part)) {
                        this.checkForCircular(obj_part);
                        buffer = "[";
                        this.objStack.push(obj_part);
                        for (var i = 0; i < obj_part.length; i++) {
                            res = this.internalStringify(obj_part, i, false);
                            buffer += this.makeIndent(this.indentStr, this.objStack.length);
                            if (res === null || typeof res === "undefined") {
                                buffer += "null";
                            }
                            else {
                                buffer += res;
                            }
                            if (i < obj_part.length - 1) {
                                buffer += ",";
                            }
                            else if (this.indentStr) {
                                buffer += "\n";
                            }
                        }
                        this.objStack.pop();
                        buffer += this.makeIndent(this.indentStr, this.objStack.length, true) + "]";
                    }
                    else {
                        this.checkForCircular(obj_part);
                        buffer = "{";
                        var nonEmpty = false;
                        this.objStack.push(obj_part);
                        for (var prop in obj_part) {
                            if (obj_part.hasOwnProperty(prop)) {
                                var value = this.internalStringify(obj_part, prop, false);
                                isTopLevel = false;
                                if (typeof value !== "undefined" && value !== null) {
                                    buffer += this.makeIndent(this.indentStr, this.objStack.length);
                                    nonEmpty = true;
                                    var key = this.isWord(prop) ? prop : this.escapeString(prop);
                                    buffer += key + ":" + (this.indentStr ? ' ' : '') + value + ",";
                                }
                            }
                        }
                        this.objStack.pop();
                        if (nonEmpty) {
                            buffer = buffer.substring(0, buffer.length - 1) + this.makeIndent(this.indentStr, this.objStack.length) + "}";
                        }
                        else {
                            buffer = '{}';
                        }
                    }
                    return buffer;
                default:
                    // functions and undefined should be ignored
                    return undefined;
            }
        };
        SurveyJSON5.positionName = "pos";
        SurveyJSON5.escapee = {
            "'": "'",
            '"': '"',
            '\\': '\\',
            '/': '/',
            '\n': '',
            b: '\b',
            f: '\f',
            n: '\n',
            r: '\r',
            t: '\t'
        };
        SurveyJSON5.ws = [
            ' ',
            '\t',
            '\r',
            '\n',
            '\v',
            '\f',
            '\xA0',
            '\uFEFF'
        ];
        // Copied from Crokford's implementation of JSON
        // See https://github.com/douglascrockford/JSON-js/blob/e39db4b7e6249f04a195e7dd0840e610cc9e941e/json2.js#L195
        // Begin
        SurveyJSON5.cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        SurveyJSON5.escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
        SurveyJSON5.meta = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        return SurveyJSON5;
    })();
    SurveyEditor.SurveyJSON5 = SurveyJSON5;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var SurveyObjectItem = (function () {
        function SurveyObjectItem() {
        }
        return SurveyObjectItem;
    })();
    SurveyEditor.SurveyObjectItem = SurveyObjectItem;
    var SurveyObjects = (function () {
        function SurveyObjects(koObjects, koSelected) {
            this.koObjects = koObjects;
            this.koSelected = koSelected;
        }
        Object.defineProperty(SurveyObjects.prototype, "survey", {
            get: function () { return this.surveyValue; },
            set: function (value) {
                if (this.survey == value)
                    return;
                this.surveyValue = value;
                this.rebuild();
            },
            enumerable: true,
            configurable: true
        });
        SurveyObjects.prototype.addPage = function (page) {
            var item = this.createPage(page, this.survey.pages.length - 1);
            this.koObjects.push(item);
            this.koSelected(item);
        };
        SurveyObjects.prototype.addQuestion = function (question) {
            var item = this.createQuestion(question);
            this.koObjects.push(item);
            this.koSelected(item);
        };
        SurveyObjects.prototype.selectObject = function (obj) {
            var objs = this.koObjects();
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].value == obj) {
                    this.koSelected(objs[i]);
                    return;
                }
            }
        };
        SurveyObjects.prototype.removeObject = function (obj) {
            var index = this.getItemIndex(obj);
            if (index < 0)
                return;
            var countToRemove = 1;
            if (obj.getType() == 'page') {
                var page = obj;
                countToRemove += page.questions.length;
            }
            this.koObjects.splice(index, countToRemove);
        };
        SurveyObjects.prototype.rebuild = function () {
            var objs = [];
            if (this.survey == null) {
                this.koObjects(objs);
                this.koSelected(null);
                return;
            }
            objs.push(this.createItem(this.survey, "Survey"));
            for (var i = 0; i < this.survey.pages.length; i++) {
                var page = this.survey.pages[i];
                objs.push(this.createPage(page, i));
                for (var j = 0; j < page.questions.length; j++) {
                    objs.push(this.createQuestion(page.questions[j]));
                }
            }
            this.koObjects(objs);
            this.koSelected(this.survey);
        };
        SurveyObjects.prototype.createPage = function (page, pageIndex) {
            return this.createItem(page, SurveyObjects.intend + "Page " + (pageIndex + 1));
        };
        SurveyObjects.prototype.createQuestion = function (question) {
            return this.createItem(question, SurveyObjects.intend + SurveyObjects.intend + question.name);
        };
        SurveyObjects.prototype.createItem = function (value, text) {
            var item = new SurveyObjectItem();
            item.value = value;
            item.text = ko.observable(text);
            return item;
        };
        SurveyObjects.prototype.getItemIndex = function (value) {
            var objs = this.koObjects();
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].value == value)
                    return i;
            }
            return -1;
        };
        SurveyObjects.intend = "...";
        return SurveyObjects;
    })();
    SurveyEditor.SurveyObjects = SurveyObjects;
})(SurveyEditor || (SurveyEditor = {}));

var templateEditor;
(function (templateEditor) {
    var ko;
    (function (ko) {
        ko.html = '<nav class="navbar navbar-default">    <div class="container-fluid">        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">            <ul class="nav navbar-nav">                <li class="dropdown">                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span data-bind="text: koIsShowDesigner() ? \'Survey Designer\': \'JSON Editor\'"></span> <span class="caret"></span></a>                    <ul class="dropdown-menu">                        <li><a href="#" data-bind="click:selectDesignerClick">Use Survey Designer</a></li>                        <li><a href="#" data-bind="click:selectEditorClick">Use JSON Editor</a></li>                    </ul>                </li>            </ul>            <form class="navbar-form navbar-left">                <button type="button" class="btn btn-default" data-bind="click: runSurveyClick" data-toggle="modal" data-target="#myModal">Run Survey</button>            </form>        </div><!-- /.navbar-collapse -->    </div><!-- /.container-fluid --></nav><div class="panel" style="width:100%">    <div id="surveyjsEditor" data-bind="visible: !koIsShowDesigner()" style="height:450px;width:100%"></div>    <div class="row" data-bind="visible: koIsShowDesigner()">        <div class="col-xs-4 col-md-3">            <div class="panel panel-default" style="width:100%">                <div class="panel-heading">                    <div class="row">                        <select style="width:80%"  data-bind="options: koObjects, optionsText: \'text\', value: koSelectedObject"></select>                        <button type="button" data-bind="enable: koCanDeleteObject, click: deleteCurrentObject" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                    </div>                </div>                <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>            </div>        </div>        <div class="col-xs-12 col-sm-6 col-md-8">            <div data-bind="template: { name: \'pageeditor\', data: pagesEditor }"></div>            <div style="overflow-y: scroll;height:450px;">                <div id="surveyjs" style="width:100%"></div>            </div>            <nav class="navbar navbar-default">                <div class="collapse navbar-collapse">                    <form class="navbar-form navbar-left">                        <button type="button" class="btn btn-default" data-bind="click: addQuestion">Add Question</button>                    </form>                    <ul class="nav navbar-nav">                        <!-- ko foreach: questionTypes -->                        <li data-bind="css: {active: $parent.koSelectedQuestionType() == $data}, click: $parent.selectQuestionTypeClick($data)"><a><span data-bind="text:$data" style="cursor: pointer"></span></a></li>                        <!-- /ko  -->                    </ul>                </div>            </nav>        </div>    </div></div><!-- Modal --><div id="myModal" class="modal fade" role="dialog">    <div class="modal-dialog">        <!-- Modal content-->        <div class="modal-content">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal">&times;</button>                <h4 class="modal-title">Running survey</h4>            </div>            <div class="modal-body">                <div id="surveyjsExample"></div>            </div>        </div>    </div></div><script type="text/html" id="objecteditor">    <table class="table" data-bind="visible:koShowProperties">        <tbody data-bind="foreach: koProperties">            <tr data-bind="click: $parent.changeActiveProperty($data), style: {background: $parent.koActiveProperty() == $data ? \'lightgray\': \'\'}">                <td data-bind="text: name" width="50%"></td>                <td width="50%">                    <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data, attr: {title: koText}, style: {color: koIsDefault() ? \'gray\' : \'\'}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                    <div data-bind="visible: $parent.koActiveProperty() == $data">                        <!-- ko template: { name: \'propertyeditor-\' + editorType, data: $data } -->                        <!-- /ko -->                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="pageeditor">    <ul class="nav nav-tabs">        <!-- ko foreach: koPages -->        <li data-bind="css: {active: koSelected()}">             <a href="#" data-bind="click:$parent.selectPageClick">                <span data-bind="text: title"></span>            </a>        </li>        <!-- /ko  -->        <li><button type="button" class="btn btn-default" data-bind="click:addNewPageClick"><span class="glyphicon glyphicon-plus"></span></button></li>    </ul></script><script type="text/html" id="propertyeditor-boolean">    <input type="checkbox" data-bind="checked: koValue" /></script><script type="text/html" id="propertyeditor-dropdown">    <select data-bind="value: koValue, options: choices"  style="width:100%"></select></script><script type="text/html" id="propertyeditor-itemvalues">    <div data-bind="with: itemValues" style="position:absolute; z-index:100; top:parentOffset.top;left:parentOffset.left - 100;background-color:lightgray">        <table>            <thead>                <tr>                    <th>Value</th>                    <th>Text</th>                    <th></th>                </tr>            </thead>            <tbody>                <!-- ko foreach: koItems -->                <tr>                    <td><input type="text" data-bind="value:koValue" style="width:100px" /></td>                    <td><input type="text" data-bind="value:koText" style="width:100px" /></td>                    <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>                </tr>                <!-- /ko -->                <tr>                    <td><input type="text" data-bind="value:koNewValue" style="width:100px" /></td>                    <td><input type="text" data-bind="value:koNewText" style="width:100px" /></td>                    <td><input type="button" data-bind="click: onAddClick" value="Add" /></td>                </tr>            </tbody>        </table>        <input type="button" value="Apply" data-bind="click: onApplyClick" />    </div></script><script type="text/html" id="propertyeditor-text">    <input type="text" data-bind="value: koValue" style="width:100%" /></script>';
    })(ko = templateEditor.ko || (templateEditor.ko = {}));
})(templateEditor || (templateEditor = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdFByb3BlcnR5LnRzIiwib2JqZWN0RWRpdG9yLnRzIiwicGFnZXNFZGl0b3IudHMiLCJ0ZXh0V29ya2VyLnRzIiwiZWRpdG9yLnRzIiwianNvbjUudHMiLCJzdXJ2ZXlPYmplY3RzLnRzIiwidGVtcGxhdGVFZGl0b3Iua28uaHRtbC50cyJdLCJuYW1lcyI6WyJTdXJ2ZXlFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkub2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdFByb3BlcnR5LnVwZGF0ZVZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdFByb3BlcnR5LmdldFZhbHVlVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZS52YWx1ZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZS5BZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlLkFwcGx5IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLnRpdGxlIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5zZWxlY3RlZE9iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuZ2V0UHJvcGVydHlFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLmNoYW5nZUFjdGl2ZVByb3BlcnR5IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5PYmplY3RDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5zaG93UHJvcGVydGllcyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IudXBkYXRlUHJvcGVydGllcyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuZ2V0UHJvcGVydHlFZGl0b3JUeXBlIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5nZXRQcm9wZXJ0eUVkaXRvckNob2ljZXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLmNhblNob3dQcm9wZXJ0eSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IudXBkYXRlUHJvcGVydGllc09iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5zdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3Iuc2V0U2VsZWN0ZWRQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLmFkZE5ld1BhZ2VDbGljayIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5yZW1vdmVQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLnVwZGF0ZVBhZ2VzIiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5IiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5LmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5wcm9jZXNzIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIudXBkYXRlSnNvblBvc2l0aW9ucyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmNyZWF0ZVN1cnZleU9iamVjdHMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmdldFBvc3Rpb25CeUNoYXJ0QXQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5nZXRBdEFycmF5IiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IucmVuZGVyIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci50ZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5nZXRUZXh0QW5kUHJvY2VzcyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2V0VGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuYWRkUGFnZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuYWRkUXVlc3Rpb24iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnNob3dEZXNpZ25lciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2hvd0pzb25FZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnNlbGVjdGVkT2JqZWN0Q2hhbmdlZCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2V0VGV4dFZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5hcHBseUJpbmRpbmciLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmluaXRKc29uRWRpdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5pbml0U3VydmV5IiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5vbkpzb25FZGl0b3JDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5wcm9jZXNzSnNvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZGVsZXRlQ3VycmVudE9iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2hvd0xpdmVTdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmNyZWF0ZUFubm90YXRpb25zIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5nZXROZXdOYW1lIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnBhcnNlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnBhcnNlLndhbGsiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuZXJyb3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUubmV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5wZWVrIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmNoYXJ0QXQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaWRlbnRpZmllciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5udW1iZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuc3RyaW5nIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlubGluZUNvbW1lbnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuYmxvY2tDb21tZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmNvbW1lbnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUud2hpdGUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUud29yZCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5hcnJheSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5vYmplY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUudmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuc3RyaW5naWZ5IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmdldEluZGVudCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5nZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNXb3JkQ2hhciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5pc1dvcmRTdGFydCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5pc1dvcmQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNBcnJheSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5pc0RhdGUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNOYU4iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuY2hlY2tGb3JDaXJjdWxhciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5tYWtlSW5kZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmVzY2FwZVN0cmluZyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5pbnRlcm5hbFN0cmluZ2lmeSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEl0ZW0uY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuc3VydmV5IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuYWRkUGFnZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmFkZFF1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMucmVidWlsZCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmNyZWF0ZVBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5jcmVhdGVRdWVzdGlvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmNyZWF0ZUl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5nZXRJdGVtSW5kZXgiLCJ0ZW1wbGF0ZUVkaXRvciIsInRlbXBsYXRlRWRpdG9yLmtvIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFlBQVksQ0FvR2xCO0FBcEdELFdBQU8sWUFBWSxFQUFDLENBQUM7SUFJakJBO1FBVUlDLDhCQUFtQkEsUUFBbUNBLEVBQVNBLFVBQWtCQSxFQUFFQSxpQkFBeURBO1lBQXpEQyxpQ0FBeURBLEdBQXpEQSx3QkFBeURBO1lBQXpIQSxhQUFRQSxHQUFSQSxRQUFRQSxDQUEyQkE7WUFBU0EsZUFBVUEsR0FBVkEsVUFBVUEsQ0FBUUE7WUFDN0VBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBO1lBQy9CQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtZQUMvQkEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDaEJBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLENBQUNBO1lBQ3ZCQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxJQUFJQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDN0JBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLElBQUlBLHVCQUF1QkEsQ0FBQ0EsVUFBQ0EsUUFBb0JBO29CQUMvREEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEs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LENBQUNBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLElBQUlBLElBQUlBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUM1Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDNUJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNyREEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDekJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUN0Q0EsSUFBSUEsQ0FBQ0EsY0FBY0EsR0FBR0EsSUFBSUEsQ0FBQ0E7Z0JBQy9CQSxDQUFDQTtnQkFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDN0NBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNuQ0EsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FB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Z0NBQVVBLEdBQWxCQTtZQUNJUSxBQU9BQSw0RUFQNEVBO1lBQzVFQSw0RUFBNEVBO1lBQzVFQSxnREFBZ0RBO1lBQ2hEQSxnQ0FBZ0NBO1lBQ2hDQSxnR0FBZ0dBO1lBQ2hHQSw4REFBOERBO1lBQzlEQSw4RUFBOEVBO2dCQUMxRUEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFFbEJBLEFBQ0FBLGdEQURnREE7WUFDaERBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBO2dCQUNwQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0E7Z0JBQ2hDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbkNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsQ0FBQ0E7WUFDakNBLENBQUNBO1lBRURBLEFBQ0FBLDRDQUQ0Q0E7bUJBQ3JDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUNsQkEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0E7Z0JBQ2xDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxDQUFDQTtnQkFDbENBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBO2dCQUNsQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEs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QUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtnQkFDaENBLENBQUNBO1lBQ0xBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxLQUFLQSxFQUFFQTtvQkFDSEEsT0FBT0EsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3RDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDbEJBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO29CQUNoQkEsQ0FBQ0E7b0JBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNsQkEsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0E7d0JBQ2RBLE9BQU9BLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBOzRCQUNyREEsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ3RCQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyQ0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTt3QkFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3JDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQTs0QkFDbEJBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO3dCQUNoQkEsQ0FBQ0E7d0JBQ0RBLE9BQU9BLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBOzRCQUN0Q0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7NEJBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTt3QkFDaEJBLENBQUNBO29CQUNMQSxDQUFDQTtvQkFDREEsS0FBS0EsQ0FBQ0E7Z0JBQ1ZBLEtBQUtBLEVBQUVBO29CQUNIQSxPQUFPQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDOUdBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO3dCQUNsQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7b0JBQ2hCQSxDQUFDQTtvQkFDREEsS0FBS0EsQ0FBQ0E7WUFDZEEsQ0FBQ0E7WUFFREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2ZBLE1BQU1BLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBO1lBQ3JCQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDckJBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNwQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7WUFDN0JBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNsQkEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFDT1QsNEJBQU1BLEdBQWRBO1lBRUlVLHdCQUF3QkE7WUFFeEJBLElBQUlBLEdBQUdBLEVBQ0hBLENBQUNBLEVBQ0RBLE1BQU1BLEdBQUdBLEVBQUVBLEVBQ1hBLEtBQUtBLEVBQ0xBLEtBQUtBLENBQUNBO1lBRVZBLEFBRUFBLDRFQUY0RUE7WUFFNUVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQ0EsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7Z0JBQ2hCQSxPQUFPQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDakJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO3dCQUNwQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7d0JBQ1pBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO29CQUNsQkEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO3dCQUMxQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7d0JBQ1pBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBOzRCQUNsQkEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7NEJBQ1ZBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO2dDQUN4QkEsR0FBR0EsR0FBR0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0NBQ2hDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQ0FDakJBLEtBQUtBLENBQUNBO2dDQUNWQSxDQUFDQTtnQ0FDREEsS0FBS0EsR0FBR0EsS0FBS0EsR0FBR0EsRUFBRUEsR0FBR0EsR0FBR0EsQ0FBQ0E7NEJBQzdCQSxDQUFDQTs0QkFDREEsTUFBTUEsSUFBSUEsTUFBTUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pDQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQzFCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDdkJBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBOzRCQUNoQkEsQ0FBQ0E7d0JBQ0xBLENBQUNBO3dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxXQUFXQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxLQUFLQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDMURBLE1BQU1BLElBQUlBLFdBQVdBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBO3dCQUMzQ0EsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLENBQUNBOzRCQUNKQSxLQUFLQSxDQUFDQTt3QkFDVkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDMUJBLEFBSUFBLHVDQUp1Q0E7d0JBQ3ZDQSw0Q0FBNENBO3dCQUM1Q0EsaURBQWlEQTt3QkFDakRBLDJCQUEyQkE7d0JBQzNCQSxLQUFLQSxDQUFDQTtvQkFDVkEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQTtvQkFDdEJBLENBQUNBO2dCQUNMQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUM3QkEsQ0FBQ0E7UUFDT1YsbUNBQWFBLEdBQXJCQTtZQUVJVyw2RUFBNkVBO1lBQzdFQSw0RUFBNEVBO1lBQzVFQSw4RUFBOEVBO1lBRTlFQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbEJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLHVCQUF1QkEsQ0FBQ0EsQ0FBQ0E7WUFDeENBLENBQUNBO1lBRURBLEdBQUdBLENBQUNBO2dCQUNBQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtnQkFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsSUFBSUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3ZDQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtvQkFDWkEsTUFBTUEsQ0FBQ0E7Z0JBQ1hBLENBQUNBO1lBQ0xBLENBQUNBLFFBQVFBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBO1FBQ3RCQSxDQUFDQTtRQUNPWCxrQ0FBWUEsR0FBcEJBO1lBRUlZLDhFQUE4RUE7WUFDOUVBLGlFQUFpRUE7WUFDakVBLDRFQUE0RUE7WUFDNUVBLDBFQUEwRUE7WUFFMUVBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EscUJBQXFCQSxDQUFDQSxDQUFDQTtZQUN0Q0EsQ0FBQ0E7WUFFREEsR0FBR0EsQ0FBQ0E7Z0JBQ0FBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO2dCQUNaQSxPQUFPQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtvQkFDckJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNmQSxNQUFNQSxDQUFDQTtvQkFDWEEsQ0FBQ0E7Z0JBQ0xBLENBQUNBO1lBQ0xBLENBQUNBLFFBQVFBLElBQUlBLENBQUNBLEVBQUVBLEVBQUVBO1lBRWxCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSw0QkFBNEJBLENBQUNBLENBQUNBO1FBQzdDQSxDQUFDQTtRQUNPWiw2QkFBT0EsR0FBZkE7WUFFSWEsdUVBQXVFQTtZQUN2RUEsNENBQTRDQTtZQUU1Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtZQUNoQ0EsQ0FBQ0E7WUFFREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFZkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxJQUFJQSxDQUFDQSxhQUFhQSxFQUFFQSxDQUFDQTtZQUN6QkEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3pCQSxJQUFJQSxDQUFDQSxZQUFZQSxFQUFFQSxDQUFDQTtZQUN4QkEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0pBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLHNCQUFzQkEsQ0FBQ0EsQ0FBQ0E7WUFDdkNBLENBQUNBO1FBQ0xBLENBQUNBO1FBQ09iLDJCQUFLQSxHQUFiQTtZQUVJYyxnQ0FBZ0NBO1lBQ2hDQSxtRUFBbUVBO1lBQ25FQSw0RUFBNEVBO1lBQzVFQSx1RUFBdUVBO1lBRXZFQSxPQUFPQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2xCQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtnQkFDbkJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxXQUFXQSxDQUFDQSxFQUFFQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDOUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO2dCQUNoQkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNKQSxNQUFNQSxDQUFDQTtnQkFDWEEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFDT2QsMEJBQUlBLEdBQVpBO1lBRUllLHdCQUF3QkE7WUFFeEJBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNkQSxLQUFLQSxHQUFHQTtvQkFDSkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO2dCQUNoQkEsS0FBS0EsR0FBR0E7b0JBQ0pBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ2pCQSxLQUFLQSxHQUFHQTtvQkFDSkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO2dCQUNoQkEsS0FBS0EsR0FBR0E7b0JBQ0pBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQ3BCQSxLQUFLQSxHQUFHQTtvQkFDSkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0E7WUFDbkJBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLGNBQWNBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLEdBQUdBLENBQUNBLENBQUNBO1FBQy9DQSxDQUFDQTtRQUNPZiwyQkFBS0EsR0FBYkE7WUFFSWdCLHdCQUF3QkE7WUFFeEJBLElBQUlBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO1lBRWZBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2ZBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO2dCQUNiQSxPQUFPQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDZkEsTUFBTUEsQ0FBQ0EsS0FBS0EsRUFBSUEsMEJBQTBCQTtvQkFDOUNBLENBQUNBLEdBRGdCQTtvQkFFakJBLEFBRUFBLHVEQUZ1REE7b0JBQ3ZEQSx5Q0FBeUNBO29CQUN6Q0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2xCQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSx1QkFBdUJBLENBQUNBLENBQUNBO29CQUN4Q0EsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQSxDQUFDQTtvQkFDN0JBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtvQkFDYkEsQUFFQUEsc0RBRnNEQTtvQkFDdERBLDJCQUEyQkE7b0JBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNmQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtvQkFDakJBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtRQUM1QkEsQ0FBQ0E7UUFDT2hCLDRCQUFNQSxHQUFkQTtZQUVJaUIseUJBQXlCQTtZQUV6QkEsSUFBSUEsR0FBR0EsRUFDSEEsS0FBS0EsRUFDTEEsZUFBZUEsR0FBR0EsSUFBSUEsRUFDdEJBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO1lBQ2hCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckJBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLEdBQUdBLEVBQUVBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBO1lBQzlEQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbEJBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNmQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtnQkFDYkEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsRUFBRUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxPQUFPQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2xCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDckJBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBO3dCQUNqREEsQ0FBQ0E7d0JBQ0RBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNmQSxNQUFNQSxDQUFDQSxNQUFNQSxFQUFJQSwyQkFBMkJBO29CQUNoREEsQ0FBQ0EsR0FEaUJBO29CQUdsQkEsQUFFQUEscURBRnFEQTtvQkFDckRBLHdCQUF3QkE7b0JBQ3hCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO29CQUN4QkEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLENBQUNBO3dCQUNKQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQTtvQkFDNUJBLENBQUNBO29CQUVEQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtvQkFDYkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxLQUFLQSxFQUFFQSxLQUFLQSxFQUFFQSxVQUFVQSxFQUFFQSxJQUFJQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDbEZBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7b0JBQzNCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckJBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNwQkEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsR0FBR0EsS0FBS0EsQ0FBQ0E7d0JBQ3ZEQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxLQUFLQSxDQUFDQTtvQkFDdERBLENBQUNBO29CQUNEQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtvQkFDYkEsQUFFQUEsd0RBRndEQTtvQkFDeERBLHlCQUF5QkE7b0JBQ3pCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbEJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBOzRCQUNyQkEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7NEJBQ2pEQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDaERBLENBQUNBO3dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDckJBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO3dCQUN2REEsQ0FBQ0E7d0JBQ0RBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO3dCQUNmQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtvQkFDbEJBLENBQUNBO29CQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckJBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO3dCQUNqREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ25CQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDaERBLENBQUNBO29CQUNMQSxDQUFDQTtvQkFDREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO29CQUNiQSxlQUFlQSxHQUFHQSxLQUFLQSxDQUFDQTtnQkFDNUJBLENBQUNBO1lBQ0xBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1FBQzdCQSxDQUFDQTtRQUNPakIsMkJBQUtBLEdBQWJBO1lBRUlrQiwyRUFBMkVBO1lBQzNFQSxhQUFhQTtZQUViQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtZQUNiQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDZEEsS0FBS0EsR0FBR0E7b0JBQ0pBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO2dCQUN6QkEsS0FBS0EsR0FBR0E7b0JBQ0pBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO2dCQUN4QkEsS0FBS0EsR0FBR0EsQ0FBQ0E7Z0JBQ1RBLEtBQUtBLEdBQUdBO29CQUNKQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFDekJBLEtBQUtBLEdBQUdBLENBQUNBO2dCQUNUQSxLQUFLQSxHQUFHQSxDQUFDQTtnQkFDVEEsS0FBS0EsR0FBR0E7b0JBQ0pBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO2dCQUN6QkE7b0JBQ0lBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO1lBQzlFQSxDQUFDQTtRQUNMQSxDQUFDQTtRQU1NbEIsK0JBQVNBLEdBQWhCQSxVQUFpQkEsR0FBUUEsRUFBRUEsUUFBb0JBLEVBQUVBLEtBQWlCQTtZQUF2Q21CLHdCQUFvQkEsR0FBcEJBLGVBQW9CQTtZQUFFQSxxQkFBaUJBLEdBQWpCQSxZQUFpQkE7WUFDOURBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLFVBQVVBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1RUEsTUFBTUEsSUFBSUEsS0FBS0EsQ0FBQ0EseUNBQXlDQSxDQUFDQSxDQUFDQTtZQUMvREEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsUUFBUUEsQ0FBQ0E7WUFDekJBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQ3ZDQSxJQUFJQSxDQUFDQSxRQUFRQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNuQkEsQUFHQUEsa0RBSGtEQTtZQUNsREEsd0NBQXdDQTtZQUN4Q0EsdUNBQXVDQTtnQkFDbkNBLGNBQWNBLEdBQUdBLEVBQUVBLEVBQUVBLEVBQUVBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ2pDQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcEJBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLDJCQUEyQkEsQ0FBQ0EsY0FBY0EsRUFBRUEsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDdEVBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLGlCQUFpQkEsQ0FBQ0EsY0FBY0EsRUFBRUEsRUFBRUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDNURBLENBQUNBO1FBQ09uQiwrQkFBU0EsR0FBakJBLFVBQWtCQSxLQUFVQTtZQUN4Qm9CLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBO2dCQUNSQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxLQUFLQSxLQUFLQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO2dCQUNqQkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLEtBQUtBLEtBQUtBLFFBQVFBLElBQUlBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNqREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQzdDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQTtRQUNkQSxDQUFDQTtRQUNPcEIsaURBQTJCQSxHQUFuQ0EsVUFBb0NBLE1BQVdBLEVBQUVBLEdBQVFBLEVBQUVBLFVBQW1CQTtZQUMxRXFCLElBQUlBLEtBQUtBLEdBQUdBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBRXhCQSxBQUNBQSw2REFENkRBO1lBQzdEQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxLQUFLQSxDQUFDQSxNQUFNQSxJQUFJQSxPQUFPQSxLQUFLQSxDQUFDQSxNQUFNQSxLQUFLQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDOURBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBO1lBQzNCQSxDQUFDQTtZQUVEQSxBQUVBQSx5R0FGeUdBO1lBQ3pHQSxxR0FBcUdBO1lBQ3JHQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDeENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLEdBQUdBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1lBQ2xEQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdkJBLEVBQUVBLENBQUNBLENBQUNBLFVBQVVBLElBQUlBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUN4RUEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQTtnQkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7b0JBQ0pBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBO2dCQUNyQkEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0pBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ2pCQSxDQUFDQTtRQUNMQSxDQUFDQTtRQUVPckIsZ0NBQVVBLEdBQWxCQSxVQUFtQkEsSUFBU0E7WUFDeEJzQixNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQTtnQkFDL0JBLENBQUNBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBO2dCQUM1QkEsQ0FBQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0E7Z0JBQzVCQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxLQUFLQSxHQUFHQSxDQUFDQTtRQUNyQ0EsQ0FBQ0E7UUFFT3RCLGlDQUFXQSxHQUFuQkEsVUFBb0JBLElBQVNBO1lBQ3pCdUIsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0E7Z0JBQy9CQSxDQUFDQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQTtnQkFDNUJBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBO1FBQ3JDQSxDQUFDQTtRQUVPdkIsNEJBQU1BLEdBQWRBLFVBQWVBLEdBQVFBO1lBQ25Cd0IsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzFCQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNqQkEsQ0FBQ0E7WUFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzVCQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNqQkEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsTUFBTUEsR0FBR0EsR0FBR0EsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDL0JBLE9BQU9BLENBQUNBLEdBQUdBLE1BQU1BLEVBQUVBLENBQUNBO2dCQUNoQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzNCQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtnQkFDakJBLENBQUNBO2dCQUNEQSxDQUFDQSxFQUFFQSxDQUFDQTtZQUNSQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFDRHhCLFlBQVlBO1FBQ0pBLDZCQUFPQSxHQUFmQSxVQUFnQkEsR0FBUUE7WUFDcEJ5QixFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDaEJBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzlCQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsS0FBS0EsZ0JBQWdCQSxDQUFDQTtZQUNwRUEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFT3pCLDRCQUFNQSxHQUFkQSxVQUFlQSxHQUFRQTtZQUNuQjBCLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLGVBQWVBLENBQUNBO1FBQ25FQSxDQUFDQTtRQUVPMUIsMkJBQUtBLEdBQWJBLFVBQWNBLEdBQVFBO1lBQ2xCMkIsTUFBTUEsQ0FBQ0EsT0FBT0EsR0FBR0EsS0FBS0EsUUFBUUEsSUFBSUEsR0FBR0EsS0FBS0EsR0FBR0EsQ0FBQ0E7UUFDbERBLENBQUNBO1FBRU8zQixzQ0FBZ0JBLEdBQXhCQSxVQUF5QkEsR0FBUUE7WUFDN0I0QixHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDNUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQkEsTUFBTUEsSUFBSUEsU0FBU0EsQ0FBQ0EsdUNBQXVDQSxDQUFDQSxDQUFDQTtnQkFDakVBLENBQUNBO1lBQ0xBLENBQUNBO1FBQ0xBLENBQUNBO1FBQ081QixnQ0FBVUEsR0FBbEJBLFVBQW1CQSxHQUFXQSxFQUFFQSxHQUFXQSxFQUFFQSxTQUEwQkE7WUFBMUI2Qix5QkFBMEJBLEdBQTFCQSxpQkFBMEJBO1lBQ25FQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUEEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDZEEsQ0FBQ0E7WUFDREEsQUFDQUEsb0NBRG9DQTtZQUNwQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2xCQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQSxDQUFDQTtZQUMvQkEsQ0FBQ0E7WUFFREEsSUFBSUEsTUFBTUEsR0FBR0EsU0FBU0EsR0FBR0EsRUFBRUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDbkNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUMzQkEsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0E7WUFDbEJBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO1FBQ2xCQSxDQUFDQTtRQWdCTzdCLGtDQUFZQSxHQUFwQkEsVUFBcUJBLEdBQVdBO1lBRTVCOEIsQUFJQUEsNEVBSjRFQTtZQUM1RUEsdUVBQXVFQTtZQUN2RUEsMkVBQTJFQTtZQUMzRUEsYUFBYUE7WUFDYkEsV0FBV0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDcENBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFNBQVNBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLE9BQU9BLENBQUNBLFdBQVdBLENBQUNBLFNBQVNBLEVBQUVBLFVBQVVBLENBQUNBO2dCQUN6RixJQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO2dCQUM1QixNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssUUFBUTtvQkFDeEIsQ0FBQztvQkFDRCxLQUFLLEdBQUcsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQyxRQUFRLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNsRSxDQUFDLENBQUNBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBO1FBQy9CQSxDQUFDQTtRQUNEOUIsTUFBTUE7UUFFRUEsdUNBQWlCQSxHQUF6QkEsVUFBMEJBLE1BQVdBLEVBQUVBLEdBQVFBLEVBQUVBLFVBQW1CQTtZQUNoRStCLElBQUlBLE1BQU1BLEVBQUVBLEdBQUdBLENBQUNBO1lBRWhCQSxBQUNBQSxrQ0FEa0NBO2dCQUM5QkEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsMkJBQTJCQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFFQSxVQUFVQSxDQUFDQSxDQUFDQTtZQUV6RUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsUUFBUUEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JDQSxBQUVBQSxnQkFGZ0JBO2dCQUNoQkEsb0RBQW9EQTtnQkFDcERBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1lBQ2xDQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxDQUFDQSxPQUFPQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEJBLEtBQUtBLFNBQVNBO29CQUNWQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtnQkFFL0JBLEtBQUtBLFFBQVFBO29CQUNUQSxFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO29CQUNsQkEsQ0FBQ0E7b0JBQ0RBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBO2dCQUUvQkEsS0FBS0EsUUFBUUE7b0JBQ1RBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLENBQUNBO2dCQUVsREEsS0FBS0EsUUFBUUE7b0JBQ1RBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO3dCQUNwQkEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7b0JBQ2xCQSxDQUFDQTtvQkFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2hDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO3dCQUNoQ0EsTUFBTUEsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ2JBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO3dCQUU3QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0Es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LElBQUlBLEdBQUdBLEdBQUdBLEdBQUdBLEdBQUdBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBLEdBQUdBLEtBQUtBLEdBQUdBLEdBQUdBLENBQUNBO2dDQUNwRUEsQ0FBQ0E7NEJBQ0xBLENBQUNBO3dCQUNMQSxDQUFDQTt3QkFDREEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3BCQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDWEEsTUFBTUEsR0FBR0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsTUFBTUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsR0FBR0EsR0FBR0EsQ0FBQ0E7d0JBQ2xIQSxDQUFDQTt3QkFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7NEJBQ0pBLE1BQU1BLEdBQUdBLElBQUlBLENBQUNBO3dCQUNsQkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtnQkFDbEJBO29CQUNJQSxBQUNBQSw0Q0FENENBO29CQUM1Q0EsTUFBTUEsQ0FBQ0EsU0FBU0EsQ0FBQ0E7WUFDekJBLENBQUNBO1FBQ0xBLENBQUNBO1FBcnVCYS9CLHdCQUFZQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNwQkEsbUJBQU9BLEdBQUdBO1lBQ3JCQSxHQUFHQSxFQUFFQSxHQUFHQTtZQUNSQSxHQUFHQSxFQUFFQSxHQUFHQTtZQUNSQSxJQUFJQSxFQUFFQSxJQUFJQTtZQUNWQSxHQUFHQSxFQUFFQSxHQUFHQTtZQUNSQSxJQUFJQSxFQUFFQSxFQUFFQTtZQUNSQSxDQUFDQSxFQUFFQSxJQUFJQTtZQUNQQSxDQUFDQSxFQUFFQSxJQUFJQTtZQUNQQSxDQUFD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QUNBLENBQUNBLENBQUNBO2dCQUN0QkEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JCQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDdEJBLE1BQU1BLENBQUNBO1lBQ1hBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO1lBQ2xEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDaERBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNoQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDN0NBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0REEsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDckJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1FBQ2pDQSxDQUFDQTtRQUNPUCxrQ0FBVUEsR0FBbEJBLFVBQW1CQSxJQUFpQkEsRUFBRUEsU0FBaUJBO1lBQ25EUSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxFQUFFQSxhQUFhQSxDQUFDQSxNQUFNQSxHQUFHQSxPQUFPQSxHQUFHQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNuRkEsQ0FBQ0E7UUFDT1Isc0NBQWNBLEdBQXRCQSxVQUF1QkEsUUFBeUJBO1lBQzVDUyxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxRQUFRQSxFQUFFQSxhQUFhQSxDQUFDQSxNQUFNQSxHQUFHQSxhQUFhQSxDQUFDQSxNQUFNQSxHQUFHQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUNsR0EsQ0FBQ0E7UUFDT1Qsa0NBQVVBLEdBQWxCQSxVQUFtQkEsS0FBa0JBLEVBQUVBLElBQVlBO1lBQy9DVSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxnQkFBZ0JBLEVBQUVBLENBQUNBO1lBQ2xDQSxJQUFJQSxDQUFDQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQTtZQUNuQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDaENBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQUNPVixvQ0FBWUEsR0FBcEJBLFVBQXFCQSxLQUFrQkE7WUFDbkNXLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO1lBQzVCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDbkNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLEtBQUtBLENBQUNBO29CQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUN6Q0EsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUE1RWFYLG9CQUFNQSxHQUFXQSxLQUFLQSxDQUFDQTtRQTZFekNBLG9CQUFDQTtJQUFEQSxDQTlFQXBHLEFBOEVDb0csSUFBQXBHO0lBOUVZQSwwQkFBYUEsZ0JBOEV6QkEsQ0FBQUE7QUFDTEEsQ0FBQ0EsRUF0Rk0sWUFBWSxLQUFaLFlBQVksUUFzRmxCOztBQ3RGRCxJQUFPLGNBQWMsQ0FBb2xOO0FBQXptTixXQUFPLGNBQWM7SUFBQ2dILElBQUFBLEVBQUVBLENBQWlsTkE7SUFBbmxOQSxXQUFBQSxFQUFFQSxFQUFDQSxDQUFDQTtRQUFZQyxPQUFJQSxHQUFHQSwwak5BQTBqTkEsQ0FBQ0E7SUFBQUEsQ0FBQ0EsRUFBbmxORCxFQUFFQSxHQUFGQSxpQkFBRUEsS0FBRkEsaUJBQUVBLFFBQWlsTkE7QUFBREEsQ0FBQ0EsRUFBbG1OLGNBQWMsS0FBZCxjQUFjLFFBQW9sTiIsImZpbGUiOiJzdXJ2ZXllZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IChwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHksIG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBwcml2YXRlIG9iamVjdFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlVXBkYXRpbmc6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMga29WYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1RleHQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgaXRlbVZhbHVlczogU3VydmV5UHJvcGVydHlJdGVtVmFsdWU7XHJcbiAgICAgICAgcHVibGljIGtvSXNEZWZhdWx0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXM6IEFycmF5PHN0cmluZz47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgcHVibGljIGVkaXRvclR5cGU6IHN0cmluZywgb25Qcm9wZXJ0eUNoYW5nZWQ6IFN1cnZleU9uUHJvcGVydHlDaGFuZ2VkQ2FsbGJhY2sgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IHRoaXMucHJvcGVydHkubmFtZTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChlZGl0b3JUeXBlID09IFwiaXRlbXZhbHVlc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZXMgPSBuZXcgU3VydmV5UHJvcGVydHlJdGVtVmFsdWUoKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5rb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vYmplY3QgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub2JqZWN0W3NlbGYubmFtZV0gPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChvblByb3BlcnR5Q2hhbmdlZCAhPSBudWxsICYmICFzZWxmLmlzVmFsdWVVcGRhdGluZykgb25Qcm9wZXJ0eUNoYW5nZWQoc2VsZiwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1RleHQgPSBrby5jb21wdXRlZCgoKSA9PiB7IHJldHVybiBzZWxmLmdldFZhbHVlVGV4dChzZWxmLmtvVmFsdWUoKSk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNEZWZhdWx0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5wcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShzZWxmLmtvVmFsdWUoKSk7IH0pOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMub2JqZWN0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9iamVjdCh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JqZWN0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKHRoaXMub2JqZWN0W3RoaXMubmFtZV0pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pdGVtVmFsdWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZXMudmFsdWUgPSB0aGlzLmtvVmFsdWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiWyBJdGVtczogXCIrIHZhbHVlLmxlbmd0aCArIFwiIF1cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGRlY2xhcmUgdHlwZSBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZUNoYW5nZWRDYWxsYmFjayA9IChuZXdWYWx1ZTogQXJyYXk8YW55PikgPT4gdm9pZDtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZSB7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZV86IEFycmF5PGFueT47XHJcbiAgICAgICAgcHVibGljIGtvSXRlbXM6IGFueTtcclxuICAgICAgICBwdWJsaWMga29OZXdWYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb05ld1RleHQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQXBwbHlDbGljazogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IFN1cnZleVByb3BlcnR5SXRlbVZhbHVlQ2hhbmdlZENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvTmV3VmFsdWUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29OZXdUZXh0ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdOyBcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBzZWxmLm9uQXBwbHlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5BcHBseSgpOyB9XHJcbiAgICAgICAgICAgIHNlbGYub25EZWxldGVDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoaXRlbSk7IH1cclxuICAgICAgICAgICAgc2VsZi5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLkFkZEl0ZW0oKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnZhbHVlXzsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZhbHVlW2ldO1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCh7IGtvVmFsdWU6IGtvLm9ic2VydmFibGUoaXRlbS52YWx1ZSksIGtvVGV4dDoga28ub2JzZXJ2YWJsZShpdGVtLnRleHQpIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBZGRJdGVtKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMucHVzaCh7IGtvVmFsdWU6IGtvLm9ic2VydmFibGUodGhpcy5rb05ld1ZhbHVlKCkpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUodGhpcy5rb05ld1RleHQoKSkgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29OZXdWYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5rb05ld1RleHQobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBcHBseSgpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtvSXRlbXMoKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmtvSXRlbXMoKVtpXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVfLnB1c2goeyB2YWx1ZTogaXRlbS5rb1ZhbHVlKCksIHRleHQ6IGl0ZW0ua29UZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWx1ZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy52YWx1ZV8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5LnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEVkaXRvciB7XHJcbiAgICAgICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvUHJvcGVydGllczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb0FjdGl2ZVByb3BlcnR5OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvVGl0bGU6IGFueTtcclxuICAgICAgICBwdWJsaWMga29IYXNPYmplY3Q6IGFueTtcclxuICAgICAgICBwdWJsaWMga29TaG93UHJvcGVydGllczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvblByb3BlcnR5VmFsdWVDaGFuZ2VkOiBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5T2JqZWN0RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5T2JqZWN0RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVGl0bGUgPSBrby5vYnNlcnZhYmxlKFwiXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzT2JqZWN0ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2hvd1Byb3BlcnRpZXMgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMua29UaXRsZSgpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMua29UaXRsZSh2YWx1ZSk7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkT2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHNlbGVjdGVkT2JqZWN0KHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzT2JqZWN0KHZhbHVlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydHlFZGl0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5rb1Byb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2hhbmdlQWN0aXZlUHJvcGVydHkocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eShwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBPYmplY3RDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNob3dQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvU2hvd1Byb3BlcnRpZXMoIXRoaXMua29TaG93UHJvcGVydGllcygpKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRPYmplY3QgfHwgIXRoaXMuc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMoW10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyh0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGEubmFtZSA9PSBiLm5hbWUpIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGEubmFtZSA+IGIubmFtZSkgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBwcm9wRXZlbnQgPSAocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5LCBuZXdWYWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuZmlyZSh0aGlzLCB7IHByb3BlcnR5OiBwcm9wZXJ0eS5wcm9wZXJ0eSwgb2JqZWN0OiBwcm9wZXJ0eS5vYmplY3QsIG5ld1ZhbHVlOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2FuU2hvd1Byb3BlcnR5KHByb3BlcnRpZXNbaV0pKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBlZGl0b3JUeXBlID0gdGhpcy5nZXRQcm9wZXJ0eUVkaXRvclR5cGUocHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydHkgPSBuZXcgU3VydmV5T2JqZWN0UHJvcGVydHkocHJvcGVydGllc1tpXSwgZWRpdG9yVHlwZSwgcHJvcEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChlZGl0b3JUeXBlID09IFwiZHJvcGRvd25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BlcnR5LmNob2ljZXMgPSB0aGlzLmdldFByb3BlcnR5RWRpdG9yQ2hvaWNlcyhwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9iamVjdFByb3BlcnRpZXMucHVzaChvYmplY3RQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMob2JqZWN0UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSh0aGlzLmdldFByb3BlcnR5RWRpdG9yKFwibmFtZVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQcm9wZXJ0eUVkaXRvclR5cGUocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHByb3BlcnR5Lm5hbWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiIHx8IG5hbWUgPT0gXCJjaG9pY2VzT3JkZXJcIiB8fCBuYW1lID09IFwiY29sQ291bnRcIikgcmV0dXJuIFwiZHJvcGRvd25cIjtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJjaG9pY2VzXCIgfHwgbmFtZSA9PSBcImNvbHVtbnNcIiB8fCBuYW1lID09IFwicm93c1wiIHx8IG5hbWUgPT0gXCJyYXRlVmFsdWVzXCIpIHJldHVybiBcIml0ZW12YWx1ZXNcIjtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJ2aXNpYmxlXCIgfHwgbmFtZS5pbmRleE9mKFwiaXNcIikgPT0gMCB8fCBuYW1lLmluZGV4T2YoXCJoYXNcIikgPT0gMCB8fCBuYW1lLmluZGV4T2YoXCJzaG93XCIpID09IDAgfHwgbmFtZSA9PSBcInNlbmRSZXN1bHRPblBhZ2VOZXh0XCIpIHJldHVybiBcImJvb2xlYW5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQcm9wZXJ0eUVkaXRvckNob2ljZXMocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcInNob3dRdWVzdGlvbk51bWJlcnNcIikgcmV0dXJuIFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcImNob2ljZXNPcmRlclwiKSByZXR1cm4gW1wibm9uZVwiLCBcImFzY1wiLCBcImRlc2NcIiwgXCJyYW5kb21cIl07XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwiY29sQ291bnRcIikgcmV0dXJuIFsxLCAyLCAzLCA0XTtcclxuICAgICAgICAgICAgcmV0dXJuIFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY2FuU2hvd1Byb3BlcnR5KHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gcHJvcGVydHkubmFtZTtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gJ3F1ZXN0aW9ucycgfHwgbmFtZSA9PSAncGFnZXMnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlUHJvcGVydGllc09iamVjdCgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmtvUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbaV0ub2JqZWN0ID0gdGhpcy5zZWxlY3RlZE9iamVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGRlY2xhcmUgdHlwZSBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xyXG4gICAgZGVjbGFyZSB0eXBlIFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjayA9IChwYWdlOiBTdXJ2ZXkuUGFnZSkgPT4gdm9pZDtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQYWdlc0VkaXRvciB7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICAgICAga29QYWdlczogYW55O1xyXG4gICAgICAgIGtvSXNWYWxpZDogYW55O1xyXG4gICAgICAgIHNlbGVjdFBhZ2VDbGljazogYW55O1xyXG4gICAgICAgIG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgb25TZWxlY3RQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjaztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3Iob25BZGROZXdQYWdlQ2FsbGJhY2s6IFN1cnZleUFkZE5ld1BhZ2VDYWxsYmFjayA9IG51bGwsIG9uU2VsZWN0UGFnZUNhbGxiYWNrOiBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2sgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29QYWdlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNWYWxpZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrID0gb25BZGROZXdQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHRoaXMub25TZWxlY3RQYWdlQ2FsbGJhY2sgPSBvblNlbGVjdFBhZ2VDYWxsYmFjaztcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBzZWxmLnNlbGVjdFBhZ2VDbGljayA9IGZ1bmN0aW9uKHBhZ2VJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblNlbGVjdFBhZ2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2socGFnZUl0ZW0ucGFnZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzVmFsaWQodGhpcy5zdXJ2ZXlWYWx1ZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0U2VsZWN0ZWRQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlc1tpXS5rb1NlbGVjdGVkKHBhZ2VzW2ldLnBhZ2UgPT0gcGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZE5ld1BhZ2VDbGljaygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmtvUGFnZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2VzW2ldLnBhZ2UgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMua29QYWdlcy5zcGxpY2UoaSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQYWdlcygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1BhZ2VzKFtdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcGFnZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1BhZ2UgJyArIChpICsgMSksIHBhZ2U6IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbaV0sIGtvU2VsZWN0ZWQ6IGtvLm9ic2VydmFibGUoZmFsc2UpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMocGFnZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgY2xhc3MgVGV4dFBhcnNlclByb3Blcnkge1xyXG4gICAgICAgIGlzRm91bmQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJvcGVydGllc0NvdW50OiBudW1iZXI7XHJcbiAgICAgICAgc3RhcnQ6IG51bWJlcjtcclxuICAgICAgICBlbmQ6IG51bWJlcjtcclxuICAgICAgICB2YWx1ZVN0YXJ0OiBudW1iZXI7XHJcbiAgICAgICAgdmFsdWVFbmQ6IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VGV4dFdvcmtlciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBuZXdMaW5lQ2hhcjogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBlcnJvcnM6IEFycmF5PGFueT47XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcclxuICAgICAgICBwcml2YXRlIGpzb25WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5T2JqZWN0czogQXJyYXk8YW55PjtcclxuICAgICAgICBwcml2YXRlIGlzU3VydmV5QXNQYWdlOiBib29sZWFuO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2VzcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzSnNvbkNvcnJlY3QoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlICYmICF0aGlzLnN1cnZleVZhbHVlLmlzRW1wdHk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgcHJvY2VzcygpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuanNvblZhbHVlID0gbmV3IFN1cnZleUpTT041KDEpLnBhcnNlKHRoaXMudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHsgcG9zOiB7IHN0YXJ0OiBlcnJvci5hdCwgZW5kOiAtMSB9LCB0ZXh0OiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmpzb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUpzb25Qb3NpdGlvbnModGhpcy5qc29uVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkuU3VydmV5KHRoaXMuanNvblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9yc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7IHBvczogeyBzdGFydDogZXJyb3IuYXQsIGVuZDogLTEgfSwgdGV4dDogZXJyb3IuZ2V0RnVsbERlc2NyaXB0aW9uKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cyA9IHRoaXMuY3JlYXRlU3VydmV5T2JqZWN0cygpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KHRoaXMuc3VydmV5T2JqZWN0cyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQodGhpcy5lcnJvcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZUpzb25Qb3NpdGlvbnMoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGpzb25PYmpbXCJwb3NcIl1bXCJzZWxmXCJdID0ganNvbk9iajtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBqc29uT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqICYmIG9ialtcInBvc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb25PYmpbXCJwb3NcIl1ba2V5XSA9IG9ialtcInBvc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUpzb25Qb3NpdGlvbnMob2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVN1cnZleU9iamVjdHMoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgdGhpcy5pc1N1cnZleUFzUGFnZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDAgJiYgIXBhZ2VbXCJwb3NcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlW1wicG9zXCJdID0gdGhpcy5zdXJ2ZXlWYWx1ZVtcInBvc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VydmV5QXNQYWdlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhZ2UucXVlc3Rpb25zW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KG9iamVjdHM6IGFueVtdKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3RzID09IG51bGwgfHwgb2JqZWN0cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb24gPSB7IHJvdzogMCwgY29sdW1uOiAwIH07XHJcbiAgICAgICAgICAgIHZhciBhdE9iamVjdHNBcnJheSA9IHRoaXMuZ2V0QXRBcnJheShvYmplY3RzKTtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0QXQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXRPYmplY3RzQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdCA9IGF0T2JqZWN0c0FycmF5W2ldLmF0O1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLmdldFBvc3Rpb25CeUNoYXJ0QXQocG9zaXRpb24sIHN0YXJ0QXQsIGF0KTtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBhdE9iamVjdHNBcnJheVtpXS5vYmo7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9iai5wb3NpdGlvbikgb2JqLnBvc2l0aW9uID0ge307XHJcbiAgICAgICAgICAgICAgICBpZiAoYXQgPT0gb2JqLnBvcy5zdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5wb3NpdGlvbi5zdGFydCA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXQgPT0gb2JqLnBvcy5lbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLmVuZCA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXJ0QXQgPSBhdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFBvc3Rpb25CeUNoYXJ0QXQoc3RhcnRQb3NpdGlvbjogQWNlQWpheC5Qb3NpdGlvbiwgc3RhcnRBdDogbnVtYmVyLCBhdDogbnVtYmVyKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgcm93OiBzdGFydFBvc2l0aW9uLnJvdywgY29sdW1uOiBzdGFydFBvc2l0aW9uLmNvbHVtbiB9O1xyXG4gICAgICAgICAgICB2YXIgY3VyQ2hhciA9IHN0YXJ0QXQ7XHJcbiAgICAgICAgICAgIHdoaWxlIChjdXJDaGFyIDwgYXQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQuY2hhckF0KGN1ckNoYXIpID09IFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucm93Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5jb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1ckNoYXIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEF0QXJyYXkob2JqZWN0czogYW55W10pOiBhbnlbXSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gb2JqZWN0c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBvYmoucG9zO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwb3MpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBhdDogcG9zLnN0YXJ0LCBvYmo6IG9iaiB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MuZW5kID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgYXQ6IHBvcy5lbmQsIG9iajogb2JqIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuc29ydCgoZWwxLCBlbDIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbDEuYXQgPiBlbDIuYXQpIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsMS5hdCA8IGVsMi5hdCkgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RFZGl0b3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicGFnZXNFZGl0b3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidGV4dFdvcmtlci50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgdXBkYXRlVGV4dFRpbWVvdXQ6IG51bWJlciA9IDEwMDA7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBkZWZhdWx0TmV3U3VydmV5VGV4dDogc3RyaW5nID0gXCJ7IHBhZ2VzOiBbIHsgbmFtZTogJ3BhZ2UxJywgcXVlc3Rpb25zOiBbeyB0eXBlOiAndGV4dCcsIG5hbWU6ICdxdWVzdGlvbjEnIH1dIH1dIH1cIjtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlqczogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlqc0V4YW1wbGU6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgICAgICBwcml2YXRlIGpzb25FZGl0b3I6IEFjZUFqYXguRWRpdG9yO1xyXG4gICAgICAgIHByaXZhdGUgaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHk6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBpc1RleHRDaGFuZ2VkRnJvbURlc2lnbmVyOiBib29sZWFuO1xyXG4gICAgICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RFZGl0b3I6IFN1cnZleU9iamVjdEVkaXRvcjtcclxuICAgICAgICBwcml2YXRlIHBhZ2VzRWRpdG9yOiBTdXJ2ZXlQYWdlc0VkaXRvcjtcclxuICAgICAgICBwcml2YXRlIHN1cnZleU9iamVjdHM6IFN1cnZleU9iamVjdHM7XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0V29ya2VyOiBTdXJ2ZXlUZXh0V29ya2VyO1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvblR5cGVzOiBzdHJpbmdbXTtcclxuICAgICAgICBrb1NlbGVjdGVkUXVlc3Rpb25UeXBlOiBhbnk7XHJcbiAgICAgICAga29Jc1Nob3dEZXNpZ25lcjogYW55O1xyXG4gICAgICAgIGtvQ2FuRGVsZXRlT2JqZWN0OiBhbnk7XHJcbiAgICAgICAga29PYmplY3RzOiBhbnk7IGtvU2VsZWN0ZWRPYmplY3Q6IGFueTtcclxuICAgICAgICBzZWxlY3REZXNpZ25lckNsaWNrOiBhbnk7IHNlbGVjdEVkaXRvckNsaWNrOiBhbnk7XHJcbiAgICAgICAgc2VsZWN0UXVlc3Rpb25UeXBlQ2xpY2s6IGFueTsgcnVuU3VydmV5Q2xpY2s6IGFueTtcclxuICAgICAgICBkZWxldGVPYmplY3RDbGljazogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihyZW5kZXJlZEVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblR5cGVzID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5nZXRBbGxUeXBlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRRdWVzdGlvblR5cGUgPSBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb25UeXBlc1swXSk7XHJcbiAgICAgICAgICAgIHRoaXMua29DYW5EZWxldGVPYmplY3QgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZE9iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkT2JqZWN0LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdENoYW5nZWQobmV3VmFsdWUgIT0gbnVsbCA/IG5ld1ZhbHVlLnZhbHVlIDogbnVsbCk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMgPSBuZXcgU3VydmV5T2JqZWN0cyh0aGlzLmtvT2JqZWN0cywgdGhpcy5rb1NlbGVjdGVkT2JqZWN0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3IgPSBuZXcgU3VydmV5T2JqZWN0RWRpdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3IudGl0bGUgPSBcIlN1cnZleVwiO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLmtvU2hvd1Byb3BlcnRpZXModHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkKG9wdGlvbnMucHJvcGVydHksIG9wdGlvbnMub2JqZWN0LCBvcHRpb25zLm5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IgPSBuZXcgU3VydmV5UGFnZXNFZGl0b3IoKCkgPT4geyBzZWxmLmFkZFBhZ2UoKTsgfSwgKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB7IHNlbGYuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3QocGFnZSk7IH0pO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rb0lzU2hvd0Rlc2lnbmVyID0ga28ub2JzZXJ2YWJsZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3REZXNpZ25lckNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dEZXNpZ25lcigpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdEVkaXRvckNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dKc29uRWRpdG9yKCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0UXVlc3Rpb25UeXBlQ2xpY2sgPSBmdW5jdGlvbiAodmFsdWU6IHN0cmluZykgeyBzZWxmLmtvU2VsZWN0ZWRRdWVzdGlvblR5cGUodmFsdWUpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnJ1blN1cnZleUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dMaXZlU3VydmV5KCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlT2JqZWN0Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZGVsZXRlQ3VycmVudE9iamVjdCgpOyB9O1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlbmRlcmVkRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIocmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW5kZXIoZWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50ID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVkRWxlbWVudDtcclxuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVFZGl0b3Iua28uaHRtbDtcclxuICAgICAgICAgICAgc2VsZi5hcHBseUJpbmRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5qc29uRWRpdG9yICE9IG51bGwgPyB0aGlzLmpzb25FZGl0b3IuZ2V0VmFsdWUoKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGV4dEFuZFByb2Nlc3MoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRJZCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSnNvbih0ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZXh0VmFsdWUodmFsdWUsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0VGV4dCh2YWx1ZTogc3RyaW5nLCBmaW5kVGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNUZXh0Q2hhbmdlZEZyb21EZXNpZ25lciA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmlzVGV4dENoYW5nZWRGcm9tRGVzaWduZXIgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmZpbmQoZmluZFRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUGFnZSgpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldE5ld05hbWUodGhpcy5zdXJ2ZXkucGFnZXMsIFwicGFnZVwiKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleVZhbHVlLmFkZE5ld1BhZ2UobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3Iuc3VydmV5ID0gdGhpcy5zdXJ2ZXlWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLmFkZFBhZ2UocGFnZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleWpzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5anMuZm9jdXMoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgICAgIGlmIChwYWdlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldE5ld05hbWUodGhpcy5zdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zKCksIFwicXVlc3Rpb25cIik7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24odGhpcy5rb1NlbGVjdGVkUXVlc3Rpb25UeXBlKCksIG5hbWUpO1xyXG5cclxuICAgICAgICAgICAgcGFnZS5hZGRRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb2JqZWN0OiBhbnksIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGlzRGVmYXVsdCA9IHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgb2JqZWN0W3Byb3BlcnR5Lm5hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2hvd0Rlc2lnbmVyKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudGV4dFdvcmtlci5pc0pzb25Db3JyZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBjb3JyZWN0IEpTT04hXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN1cnZleShuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy50ZXh0V29ya2VyLnN1cnZleSkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNTaG93RGVzaWduZXIodHJ1ZSk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNob3dKc29uRWRpdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIganNvbiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLnN1cnZleSk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5zZXRWYWx1ZShuZXcgU3VydmV5SlNPTjUoKS5zdHJpbmdpZnkoanNvbiwgbnVsbCwgMSkpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IuZm9jdXMoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzU2hvd0Rlc2lnbmVyKGZhbHNlKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RDaGFuZ2VkKG9iajogU3VydmV5LkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIGNhbkRlbGV0ZU9iamVjdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLnNlbGVjdGVkT2JqZWN0ID0gb2JqO1xyXG4gICAgICAgICAgICBpZiAob2JqICE9IG51bGwgJiYgb2JqLmdldFR5cGUoKSA9PSBcInBhZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xyXG4gICAgICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5zZWxlY3RlZFF1ZXN0aW9uID0gb2JqICE9IG51bGwgJiYgb2JqW1wia29WYWx1ZVwiXSA/IDxTdXJ2ZXkuUXVlc3Rpb24+b2JqIDogbnVsbDtcclxuICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gY2FuRGVsZXRlT2JqZWN0IHx8IHRoaXMuc3VydmV5LnNlbGVjdGVkUXVlc3Rpb24gIT0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5LnNlbGVjdGVkUXVlc3Rpb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0aGlzLnN1cnZleS5zZWxlY3RlZFF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvQ2FuRGVsZXRlT2JqZWN0KGNhbkRlbGV0ZU9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0VGV4dFZhbHVlKHZhbHVlOiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuanNvbkVkaXRvciA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2V0VmFsdWUodmFsdWUsIHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnJlbmRlcmVyLnVwZGF0ZUZ1bGwodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0pzb24odmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXBwbHlCaW5kaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBrby5jbGVhbk5vZGUodGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNcIik7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvciA9IGFjZS5lZGl0KFwic3VydmV5anNFZGl0b3JcIik7ICAgXHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc0V4YW1wbGVcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleUpTT041KCkucGFyc2UoU3VydmV5RWRpdG9yLmRlZmF1bHROZXdTdXJ2ZXlUZXh0KSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUubW9kZSA9IFwiZGVzaWduZXJcIjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5yZW5kZXIodGhpcy5zdXJ2ZXlqcyk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgICAgICB0aGlzLmluaXRKc29uRWRpdG9yKCk7XHJcbiAgICAgICAgICAgIFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIgPSB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5kb2MuZ2V0TmV3TGluZUNoYXJhY3RlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGluaXRKc29uRWRpdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5zZXRUaGVtZShcImFjZS90aGVtZS9tb25va2FpXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvanNvblwiKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFNob3dQcmludE1hcmdpbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5nZXRTZXNzaW9uKCkub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkpzb25FZGl0b3JDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IuZ2V0U2Vzc2lvbigpLnNldFVzZVdvcmtlcih0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpbml0U3VydmV5KGpzb246IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkoanNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm1vZGUgPSBcImRlc2lnbmVyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSh0aGlzLnN1cnZleS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3Qoc2VuZGVyLnNlbGVjdGVkUXVlc3Rpb24pOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZShzZW5kZXIuY3VycmVudFBhZ2UpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB0aW1lb3V0SWQ6IG51bWJlciA9IC0xO1xyXG4gICAgICAgIHByaXZhdGUgb25Kc29uRWRpdG9yQ2hhbmdlZCgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50aW1lb3V0SWQgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcclxuICAgICAgICAgICAgfSAgIFxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Byb2Nlc3NpbmdJbW1lZGlhdGVseSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSAtMTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dElkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50aW1lb3V0SWQgPSAtMTtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnByb2Nlc3NKc29uKHNlbGYudGV4dCk7XHJcbiAgICAgICAgICAgICAgICB9LCBTdXJ2ZXlFZGl0b3IudXBkYXRlVGV4dFRpbWVvdXQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcHJvY2Vzc0pzb24odGV4dDogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0V29ya2VyID0gbmV3IFN1cnZleVRleHRXb3JrZXIodGV4dCk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5nZXRTZXNzaW9uKCkuc2V0QW5ub3RhdGlvbnModGhpcy5jcmVhdGVBbm5vdGF0aW9ucyh0ZXh0LCB0aGlzLnRleHRXb3JrZXIuZXJyb3JzKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZGVsZXRlQ3VycmVudE9iamVjdCgpIHtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IHRoaXMua29TZWxlY3RlZE9iamVjdCgpLnZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgICAgIGlmIChvYmouZ2V0VHlwZSgpID09IFwicGFnZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5yZW1vdmVQYWdlKG9iaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnJlbW92ZVBhZ2Uob2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLnJlbW92ZVF1ZXN0aW9uKG9iaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5zZWxlY3RlZFF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3QodGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNob3dMaXZlU3VydmV5KCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VydmV5anNFeGFtcGxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBqc29uID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMua29Jc1Nob3dEZXNpZ25lcigpKSB7XHJcbiAgICAgICAgICAgICAgICBqc29uID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuc3VydmV5KTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHRXb3JrZXIuaXNKc29uQ29ycmVjdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb24gPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy50ZXh0V29ya2VyLnN1cnZleSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGpzb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1cnZleSA9IG5ldyBTdXJ2ZXkuU3VydmV5KGpzb24pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXkpID0+IHsgc2VsZi5zdXJ2ZXlqc0V4YW1wbGUuaW5uZXJIVE1MID0gXCJTdXJ2ZXkgUmVzdWx0OiBcIiArIG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeShzdXJ2ZXkuZGF0YSk7IH0pO1xyXG4gICAgICAgICAgICAgICAgc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzRXhhbXBsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleWpzRXhhbXBsZS5pbm5lckhUTUwgPSBcIlBsZWFzZSBjb3JyZWN0IEpTT04hXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVBbm5vdGF0aW9ucyh0ZXh0OiBzdHJpbmcsIGVycm9yczogYW55W10pOiBBY2VBamF4LkFubm90YXRpb25bXSB7XHJcbiAgICAgICAgICAgIHZhciBhbm5vdGF0aW9ucyA9IG5ldyBBcnJheTxBY2VBamF4LkFubm90YXRpb24+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBlcnJvcnNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgYW5ub3RhdGlvbjogQWNlQWpheC5Bbm5vdGF0aW9uID0geyByb3c6IGVycm9yLnBvc2l0aW9uLnN0YXJ0LnJvdywgY29sdW1uOiBlcnJvci5wb3NpdGlvbi5zdGFydC5jb2x1bW4sIHRleHQ6IGVycm9yLnRleHQsIHR5cGU6IFwiZXJyb3JcIiB9O1xyXG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYW5ub3RhdGlvbnM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0TmV3TmFtZShvYmpzOiBBcnJheTxhbnk+LCBiYXNlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGhhc2ggPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBoYXNoW29ianNbaV0ubmFtZV0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBudW0gPSAxO1xyXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNoW2Jhc2VOYW1lICsgbnVtLnRvU3RyaW5nKCldKSBicmVhaztcclxuICAgICAgICAgICAgICAgIG51bSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiYXNlTmFtZSArIG51bS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGlzIGZpbGUgaXMgYmFzZWQgb24gSlNPTjUsIGh0dHA6Ly9qc29uNS5vcmcvXHJcbi8vIFRoZSBtb2RpZmljYXRpb24gZm9yIGdldHRpbmcgb2JqZWN0IGFuZCBwcm9wZXJ0aWVzIGxvY2F0aW9uICdhdCcgd2VyZSBtYWRlbi5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUpTT041IHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHBvc2l0aW9uTmFtZSA9IFwicG9zXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXNjYXBlZSA9IHtcclxuICAgICAgICAgICAgXCInXCI6IFwiJ1wiLFxyXG4gICAgICAgICAgICAnXCInOiAnXCInLFxyXG4gICAgICAgICAgICAnXFxcXCc6ICdcXFxcJyxcclxuICAgICAgICAgICAgJy8nOiAnLycsXHJcbiAgICAgICAgICAgICdcXG4nOiAnJywgICAgICAgLy8gUmVwbGFjZSBlc2NhcGVkIG5ld2xpbmVzIGluIHN0cmluZ3Mgdy8gZW1wdHkgc3RyaW5nXHJcbiAgICAgICAgICAgIGI6ICdcXGInLFxyXG4gICAgICAgICAgICBmOiAnXFxmJyxcclxuICAgICAgICAgICAgbjogJ1xcbicsXHJcbiAgICAgICAgICAgIHI6ICdcXHInLFxyXG4gICAgICAgICAgICB0OiAnXFx0J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgd3MgPSBbXHJcbiAgICAgICAgICAgICcgJyxcclxuICAgICAgICAgICAgJ1xcdCcsXHJcbiAgICAgICAgICAgICdcXHInLFxyXG4gICAgICAgICAgICAnXFxuJyxcclxuICAgICAgICAgICAgJ1xcdicsXHJcbiAgICAgICAgICAgICdcXGYnLFxyXG4gICAgICAgICAgICAnXFx4QTAnLFxyXG4gICAgICAgICAgICAnXFx1RkVGRidcclxuICAgICAgICBdO1xyXG4gICAgICAgIHByaXZhdGUgZW5kQXQ6IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIGF0OiBudW1iZXI7ICAgICAvLyBUaGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgY2hhcmFjdGVyXHJcbiAgICAgICAgcHJpdmF0ZSBjaDogYW55OyAgICAgLy8gVGhlIGN1cnJlbnQgY2hhcmFjdGVyXHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBwYXJzZVR5cGU6IG51bWJlcjsgLy8gMCAtIHN0YWRhcmQsIDEgLSBnZXQgaW5mb3JtYXRpb24gYWJvdXQgb2JqZWN0cywgMiAtIGdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgcHJvcGVydGllc1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhcnNlVHlwZTogbnVtYmVyID0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlVHlwZSA9IHBhcnNlVHlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHBhcnNlKHNvdXJjZTogYW55LCByZXZpdmVyOiBhbnkgPSBudWxsLCBzdGFydEZyb206IG51bWJlciA9IDAsIGVuZEF0OiBudW1iZXIgPSAtMSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBTdHJpbmcoc291cmNlKTtcclxuICAgICAgICAgICAgdGhpcy5hdCA9IHN0YXJ0RnJvbTtcclxuICAgICAgICAgICAgdGhpcy5lbmRBdCA9IGVuZEF0O1xyXG4gICAgICAgICAgICB0aGlzLmNoID0gJyAnO1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLnZhbHVlKCk7XHJcbiAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJTeW50YXggZXJyb3JcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcmV2aXZlciBmdW5jdGlvbiwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSxcclxuICAgICAgICAgICAgLy8gcGFzc2luZyBlYWNoIG5hbWUvdmFsdWUgcGFpciB0byB0aGUgcmV2aXZlciBmdW5jdGlvbiBmb3IgcG9zc2libGVcclxuICAgICAgICAgICAgLy8gdHJhbnNmb3JtYXRpb24sIHN0YXJ0aW5nIHdpdGggYSB0ZW1wb3Jhcnkgcm9vdCBvYmplY3QgdGhhdCBob2xkcyB0aGUgcmVzdWx0XHJcbiAgICAgICAgICAgIC8vIGluIGFuIGVtcHR5IGtleS4gSWYgdGhlcmUgaXMgbm90IGEgcmV2aXZlciBmdW5jdGlvbiwgd2Ugc2ltcGx5IHJldHVybiB0aGVcclxuICAgICAgICAgICAgLy8gcmVzdWx0LlxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nID8gKGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSAoeyAnJzogcmVzdWx0IH0sICcnKSkgOiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZXJyb3IobTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIENhbGwgZXJyb3Igd2hlbiBzb21ldGhpbmcgaXMgd3JvbmcuXHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IG5ldyBTeW50YXhFcnJvcigpO1xyXG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbTtcclxuICAgICAgICAgICAgZXJyb3JbXCJhdFwiXSA9IHRoaXMuYXQ7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5leHQoYzogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBJZiBhIGMgcGFyYW1ldGVyIGlzIHByb3ZpZGVkLCB2ZXJpZnkgdGhhdCBpdCBtYXRjaGVzIHRoZSBjdXJyZW50IGNoYXJhY3Rlci5cclxuICAgICAgICAgICAgaWYgKGMgJiYgYyAhPT0gdGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkICdcIiArIGMgKyBcIicgaW5zdGVhZCBvZiAnXCIgKyB0aGlzLmNoICsgXCInXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgdGhpcy5uZXh0IGNoYXJhY3Rlci4gV2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBjaGFyYWN0ZXJzLFxyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIGVtcHR5IHN0cmluZy5cclxuICAgICAgICAgICAgdGhpcy5jaCA9IHRoaXMuY2hhcnRBdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmF0ICs9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHBlZWsoKSB7XHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgdGhpcy5uZXh0IGNoYXJhY3RlciB3aXRob3V0IGNvbnN1bWluZyBpdCBvclxyXG4gICAgICAgICAgICAvLyBhc3NpZ25pbmcgaXQgdG8gdGhlIHRoaXMuY2ggdmFyYWlibGUuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYXJ0QXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGFydEF0KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbmRBdCA+IC0xICYmIHRoaXMuYXQgPj0gdGhpcy5lbmRBdCkgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0LmNoYXJBdCh0aGlzLmF0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmaWVyKCkge1xyXG4gICAgICAgICAgICAvLyBQYXJzZSBhbiBpZGVudGlmaWVyLiBOb3JtYWxseSwgcmVzZXJ2ZWQgd29yZHMgYXJlIGRpc2FsbG93ZWQgaGVyZSwgYnV0IHdlXHJcbiAgICAgICAgICAgIC8vIG9ubHkgdXNlIHRoaXMgZm9yIHVucXVvdGVkIG9iamVjdCBrZXlzLCB3aGVyZSByZXNlcnZlZCB3b3JkcyBhcmUgYWxsb3dlZCxcclxuICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgY2hlY2sgZm9yIHRob3NlIGhlcmUuIFJlZmVyZW5jZXM6XHJcbiAgICAgICAgICAgIC8vIC0gaHR0cDovL2VzNS5naXRodWIuY29tLyN4Ny42XHJcbiAgICAgICAgICAgIC8vIC0gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9HdWlkZS9Db3JlX0xhbmd1YWdlX0ZlYXR1cmVzI1ZhcmlhYmxlc1xyXG4gICAgICAgICAgICAvLyAtIGh0dHA6Ly9kb2NzdG9yZS5taWsudWEvb3JlbGx5L3dlYnByb2cvanNjcmlwdC9jaDAyXzA3Lmh0bVxyXG4gICAgICAgICAgICAvLyBUT0RPIElkZW50aWZpZXJzIGNhbiBoYXZlIFVuaWNvZGUgXCJsZXR0ZXJzXCIgaW4gdGhlbTsgYWRkIHN1cHBvcnQgZm9yIHRob3NlLlxyXG4gICAgICAgICAgICB2YXIga2V5ID0gdGhpcy5jaDtcclxuXHJcbiAgICAgICAgICAgIC8vIElkZW50aWZpZXJzIG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgXyBvciAkLlxyXG4gICAgICAgICAgICBpZiAoKHRoaXMuY2ggIT09ICdfJyAmJiB0aGlzLmNoICE9PSAnJCcpICYmXHJcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA8ICdhJyB8fCB0aGlzLmNoID4gJ3onKSAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2ggPCAnQScgfHwgdGhpcy5jaCA+ICdaJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgaWRlbnRpZmllclwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU3Vic2VxdWVudCBjaGFyYWN0ZXJzIGNhbiBjb250YWluIGRpZ2l0cy5cclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIChcclxuICAgICAgICAgICAgICAgIHRoaXMuY2ggPT09ICdfJyB8fCB0aGlzLmNoID09PSAnJCcgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoID49ICdhJyAmJiB0aGlzLmNoIDw9ICd6JykgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoID49ICdBJyAmJiB0aGlzLmNoIDw9ICdaJykgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JykpKSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBudW1iZXIoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXJzZSBhIG51bWJlciB2YWx1ZS5cclxuXHJcbiAgICAgICAgICAgIHZhciBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBzaWduID0gJycsXHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSAnJyxcclxuICAgICAgICAgICAgICAgIGJhc2UgPSAxMDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLScgfHwgdGhpcy5jaCA9PT0gJysnKSB7XHJcbiAgICAgICAgICAgICAgICBzaWduID0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCh0aGlzLmNoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc3VwcG9ydCBmb3IgSW5maW5pdHkgKGNvdWxkIHR3ZWFrIHRvIGFsbG93IG90aGVyIHdvcmRzKTpcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdJJykge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gdGhpcy53b3JkKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG51bWJlciAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtYmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgd29yZCBmb3IgbnVtYmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHNpZ24gPT09ICctJykgPyAtbnVtYmVyIDogbnVtYmVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzdXBwb3J0IGZvciBOYU5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdOJykge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gdGhpcy53b3JkKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG51bWJlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdleHBlY3RlZCB3b3JkIHRvIGJlIE5hTicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIHNpZ24gYXMgLU5hTiBhbHNvIGlzIE5hTlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcwJykge1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAneCcgfHwgdGhpcy5jaCA9PT0gJ1gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZSA9IDE2O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ09jdGFsIGxpdGVyYWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDEwOlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9ICcuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ2UnIHx8IHRoaXMuY2ggPT09ICdFJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLScgfHwgdGhpcy5jaCA9PT0gJysnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTY6XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknIHx8IHRoaXMuY2ggPj0gJ0EnICYmIHRoaXMuY2ggPD0gJ0YnIHx8IHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ2YnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzaWduID09PSAnLScpIHtcclxuICAgICAgICAgICAgICAgIG51bWJlciA9IC1zdHJpbmc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBudW1iZXIgPSArc3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlzRmluaXRlKG51bWJlcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHN0cmluZygpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGEgc3RyaW5nIHZhbHVlLlxyXG5cclxuICAgICAgICAgICAgdmFyIGhleCxcclxuICAgICAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSAnJyxcclxuICAgICAgICAgICAgICAgIGRlbGltLCAgICAgIC8vIGRvdWJsZSBxdW90ZSBvciBzaW5nbGUgcXVvdGVcclxuICAgICAgICAgICAgICAgIHVmZmZmO1xyXG5cclxuICAgICAgICAgICAgLy8gV2hlbiBwYXJzaW5nIGZvciBzdHJpbmcgdmFsdWVzLCB3ZSBtdXN0IGxvb2sgZm9yICcgb3IgXCIgYW5kIFxcIGNoYXJhY3RlcnMuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1wiJyB8fCB0aGlzLmNoID09PSBcIidcIikge1xyXG4gICAgICAgICAgICAgICAgZGVsaW0gPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09IGRlbGltKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xcXFwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3UnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGV4ID0gcGFyc2VJbnQodGhpcy5uZXh0KCksIDE2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmluaXRlKGhleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVmZmZmID0gdWZmZmYgKiAxNiArIGhleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHVmZmZmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGVlaygpID09PSAnXFxuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBTdXJ2ZXlKU09ONS5lc2NhcGVlW3RoaXMuY2hdID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xcbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5lc2NhcGVkIG5ld2xpbmVzIGFyZSBpbnZhbGlkOyBzZWU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2VlbWsvanNvbjUvaXNzdWVzLzI0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gdGhpcyBmZWVscyBzcGVjaWFsLWNhc2VkOyBhcmUgdGhlcmUgb3RoZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW52YWxpZCB1bmVzY2FwZWQgY2hhcnM/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpbmxpbmVDb21tZW50KCkge1xyXG5cclxuICAgICAgICAgICAgLy8gU2tpcCBhbiBpbmxpbmUgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGRcclxuICAgICAgICAgICAgLy8gYmUgdGhlIHNlY29uZCAvIGNoYXJhY3RlciBpbiB0aGUgLy8gcGFpciB0aGF0IGJlZ2lucyB0aGlzIGlubGluZSBjb21tZW50LlxyXG4gICAgICAgICAgICAvLyBUbyBmaW5pc2ggdGhlIGlubGluZSBjb21tZW50LCB3ZSBsb29rIGZvciBhIG5ld2xpbmUgb3IgdGhlIGVuZCBvZiB0aGUgdGV4dC5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYW4gaW5saW5lIGNvbW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcXG4nIHx8IHRoaXMuY2ggPT09ICdcXHInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLmNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBibG9ja0NvbW1lbnQoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIGEgYmxvY2sgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGQgYmVcclxuICAgICAgICAgICAgLy8gdGhlICogY2hhcmFjdGVyIGluIHRoZSAvKiBwYWlyIHRoYXQgYmVnaW5zIHRoaXMgYmxvY2sgY29tbWVudC5cclxuICAgICAgICAgICAgLy8gVG8gZmluaXNoIHRoZSBibG9jayBjb21tZW50LCB3ZSBsb29rIGZvciBhbiBlbmRpbmcgKi8gcGFpciBvZiBjaGFyYWN0ZXJzLFxyXG4gICAgICAgICAgICAvLyBidXQgd2UgYWxzbyB3YXRjaCBmb3IgdGhlIGVuZCBvZiB0ZXh0IGJlZm9yZSB0aGUgY29tbWVudCBpcyB0ZXJtaW5hdGVkLlxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcqJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhIGJsb2NrIGNvbW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPT09ICcqJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnKicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKHRoaXMuY2gpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVudGVybWluYXRlZCBibG9jayBjb21tZW50XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNvbW1lbnQoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIGEgY29tbWVudCwgd2hldGhlciBpbmxpbmUgb3IgYmxvY2stbGV2ZWwsIGFzc3VtaW5nIHRoaXMgaXMgb25lLlxyXG4gICAgICAgICAgICAvLyBDb21tZW50cyBhbHdheXMgYmVnaW4gd2l0aCBhIC8gY2hhcmFjdGVyLlxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhIGNvbW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubmV4dCgnLycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmxpbmVDb21tZW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJyonKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrQ29tbWVudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVucmVjb2duaXplZCBjb21tZW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgd2hpdGUoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIHdoaXRlc3BhY2UgYW5kIGNvbW1lbnRzLlxyXG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgd2UncmUgZGV0ZWN0aW5nIGNvbW1lbnRzIGJ5IG9ubHkgYSBzaW5nbGUgLyBjaGFyYWN0ZXIuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgd29ya3Mgc2luY2UgcmVndWxhciBleHByZXNzaW9ucyBhcmUgbm90IHZhbGlkIEpTT04oNSksIGJ1dCB0aGlzIHdpbGxcclxuICAgICAgICAgICAgLy8gYnJlYWsgaWYgdGhlcmUgYXJlIG90aGVyIHZhbGlkIHZhbHVlcyB0aGF0IGJlZ2luIHdpdGggYSAvIGNoYXJhY3RlciFcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFN1cnZleUpTT041LndzLmluZGV4T2YodGhpcy5jaCkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB3b3JkKCk6IGFueSB7XHJcblxyXG4gICAgICAgICAgICAvLyB0cnVlLCBmYWxzZSwgb3IgbnVsbC5cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd1Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdmJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2YnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2EnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3MnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjYXNlICduJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3UnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0knOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnSScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnaScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnaScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgneScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJbmZpbml0eTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ04nOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnTicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnYScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnTicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgJ1wiICsgdGhpcy5jaCArIFwiJ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcnJheSgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGFuIGFycmF5IHZhbHVlLlxyXG5cclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1snKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ1snKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICddJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ10nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5OyAgIC8vIFBvdGVudGlhbGx5IGVtcHR5IGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVTNSBhbGxvd3Mgb21pdHRpbmcgZWxlbWVudHMgaW4gYXJyYXlzLCBlLmcuIFssXSBhbmRcclxuICAgICAgICAgICAgICAgICAgICAvLyBbLG51bGxdLiBXZSBkb24ndCBhbGxvdyB0aGlzIGluIEpTT041LlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk1pc3NpbmcgYXJyYXkgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudmFsdWUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGNvbW1hIGFmdGVyIHRoaXMgdmFsdWUsIHRoaXMgbmVlZHMgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyBiZSB0aGUgZW5kIG9mIHRoZSBhcnJheS5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJywnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnXScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIGFycmF5XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9iamVjdCgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGFuIG9iamVjdCB2YWx1ZS5cclxuXHJcbiAgICAgICAgICAgIHZhciBrZXksXHJcbiAgICAgICAgICAgICAgICBzdGFydCxcclxuICAgICAgICAgICAgICAgIGlzRmlyc3RQcm9wZXJ0eSA9IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0gPSB7IHN0YXJ0OiB0aGlzLmF0IC0gMSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAneycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgneycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmF0IC0gMTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXS5lbmQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ30nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDsgICAvLyBQb3RlbnRpYWxseSBlbXB0eSBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEtleXMgY2FuIGJlIHVucXVvdGVkLiBJZiB0aGV5IGFyZSwgdGhleSBuZWVkIHRvIGJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFsaWQgSlMgaWRlbnRpZmllcnMuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcIicgfHwgdGhpcy5jaCA9PT0gXCInXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5zdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLmlkZW50aWZpZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0gPSB7IHN0YXJ0OiBzdGFydCwgdmFsdWVTdGFydDogdGhpcy5hdCB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJzonKTtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMudmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY29tbWEgYWZ0ZXIgdGhpcyBwYWlyLCB0aGlzIG5lZWRzIHRvIGJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGVuZCBvZiB0aGUgb2JqZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXS5lbmQgPSB0aGlzLmF0IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ30nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpc0ZpcnN0UHJvcGVydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIG9iamVjdFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZSgpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGFyc2UgYSBKU09OIHZhbHVlLiBJdCBjb3VsZCBiZSBhbiBvYmplY3QsIGFuIGFycmF5LCBhIHN0cmluZywgYSBudW1iZXIsXHJcbiAgICAgICAgICAgIC8vIG9yIGEgd29yZC5cclxuXHJcbiAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd7JzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1snOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFycmF5KCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdcIic6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiJ1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJy4nOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScgPyB0aGlzLm51bWJlcigpIDogdGhpcy53b3JkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVwbGFjZXI6IGFueTtcclxuICAgICAgICBwcml2YXRlIGluZGVudFN0cjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgb2JqU3RhY2s7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmdpZnkob2JqOiBhbnksIHJlcGxhY2VyOiBhbnkgPSBudWxsLCBzcGFjZTogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAocmVwbGFjZXIgJiYgKHR5cGVvZiAocmVwbGFjZXIpICE9PSBcImZ1bmN0aW9uXCIgJiYgIXRoaXMuaXNBcnJheShyZXBsYWNlcikpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcGxhY2VyIG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZXIgPSByZXBsYWNlcjtcclxuICAgICAgICAgICAgdGhpcy5pbmRlbnRTdHIgPSB0aGlzLmdldEluZGVudChzcGFjZSk7XHJcbiAgICAgICAgICAgIHRoaXMub2JqU3RhY2sgPSBbXTtcclxuICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlLi4ud2hlbiB1bmRlZmluZWQgaXMgdXNlZCBpbnNpZGUgb2ZcclxuICAgICAgICAgICAgLy8gYSBjb21wb3VuZCBvYmplY3QvYXJyYXksIHJldHVybiBudWxsLlxyXG4gICAgICAgICAgICAvLyBidXQgd2hlbiB0b3AtbGV2ZWwsIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgICAgICAgdmFyIHRvcExldmVsSG9sZGVyID0geyBcIlwiOiBvYmogfTtcclxuICAgICAgICAgICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQodG9wTGV2ZWxIb2xkZXIsICcnLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeSh0b3BMZXZlbEhvbGRlciwgJycsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEluZGVudChzcGFjZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwYWNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwibnVtYmVyXCIgJiYgc3BhY2UgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1ha2VJbmRlbnQoXCIgXCIsIHNwYWNlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQoaG9sZGVyOiBhbnksIGtleTogYW55LCBpc1RvcExldmVsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgd2l0aCBpdHMgdG9KU09OIHZhbHVlIGZpcnN0LCBpZiBwb3NzaWJsZVxyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUudG9KU09OICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXItc3VwcGxpZWQgcmVwbGFjZXIgaWYgYSBmdW5jdGlvbiwgY2FsbCBpdC4gSWYgaXQncyBhbiBhcnJheSwgY2hlY2sgb2JqZWN0cycgc3RyaW5nIGtleXMgZm9yXHJcbiAgICAgICAgICAgIC8vIHByZXNlbmNlIGluIHRoZSBhcnJheSAocmVtb3ZpbmcgdGhlIGtleS92YWx1ZSBwYWlyIGZyb20gdGhlIHJlc3VsdGluZyBKU09OIGlmIHRoZSBrZXkgaXMgbWlzc2luZykuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMucmVwbGFjZXIpID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlcGxhY2VyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUb3BMZXZlbCB8fCB0aGlzLmlzQXJyYXkoaG9sZGVyKSB8fCB0aGlzLnJlcGxhY2VyLmluZGV4T2Yoa2V5KSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzV29yZENoYXIoY2hhcjogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoY2hhciA+PSAnYScgJiYgY2hhciA8PSAneicpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2hhciA+PSAnQScgJiYgY2hhciA8PSAnWicpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2hhciA+PSAnMCcgJiYgY2hhciA8PSAnOScpIHx8XHJcbiAgICAgICAgICAgICAgICBjaGFyID09PSAnXycgfHwgY2hhciA9PT0gJyQnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc1dvcmRTdGFydChjaGFyOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykgfHxcclxuICAgICAgICAgICAgICAgIChjaGFyID49ICdBJyAmJiBjaGFyIDw9ICdaJykgfHxcclxuICAgICAgICAgICAgICAgIGNoYXIgPT09ICdfJyB8fCBjaGFyID09PSAnJCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzV29yZChrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNXb3JkU3RhcnQoa2V5WzBdKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpID0gMSwgbGVuZ3RoID0ga2V5Lmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1dvcmRDaGFyKGtleVtpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHBvbHlmaWxsc1xyXG4gICAgICAgIHByaXZhdGUgaXNBcnJheShvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc0RhdGUob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzTmFOKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiB2YWwgIT09IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZvckNpcmN1bGFyKG9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vYmpTdGFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2JqU3RhY2tbaV0gPT09IG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbWFrZUluZGVudChzdHI6IHN0cmluZywgbnVtOiBudW1iZXIsIG5vTmV3TGluZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbmRlbnRhdGlvbiBubyBtb3JlIHRoYW4gMTAgY2hhcnNcclxuICAgICAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCAxMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpbmRlbnQgPSBub05ld0xpbmUgPyBcIlwiIDogXCJcXG5cIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW07IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaW5kZW50ICs9IHN0cjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluZGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENvcGllZCBmcm9tIENyb2tmb3JkJ3MgaW1wbGVtZW50YXRpb24gb2YgSlNPTlxyXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvZTM5ZGI0YjdlNjI0OWYwNGExOTVlN2RkMDg0MGU2MTBjYzllOTQxZS9qc29uMi5qcyNMMTk1XHJcbiAgICAgICAgLy8gQmVnaW5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjeCA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGVzY2FwYWJsZSA9IC9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbWV0YSA9IHsgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcclxuICAgICAgICAgICAgJ1xcYic6ICdcXFxcYicsXHJcbiAgICAgICAgICAgICdcXHQnOiAnXFxcXHQnLFxyXG4gICAgICAgICAgICAnXFxuJzogJ1xcXFxuJyxcclxuICAgICAgICAgICAgJ1xcZic6ICdcXFxcZicsXHJcbiAgICAgICAgICAgICdcXHInOiAnXFxcXHInLFxyXG4gICAgICAgICAgICAnXCInOiAnXFxcXFwiJyxcclxuICAgICAgICAgICAgJ1xcXFwnOiAnXFxcXFxcXFwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcml2YXRlIGVzY2FwZVN0cmluZyhzdHI6IHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xyXG4gICAgICAgICAgICAvLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcclxuICAgICAgICAgICAgLy8gc2VxdWVuY2VzLlxyXG4gICAgICAgICAgICBTdXJ2ZXlKU09ONS5lc2NhcGFibGUubGFzdEluZGV4ID0gMDtcclxuICAgICAgICAgICAgcmV0dXJuIFN1cnZleUpTT041LmVzY2FwYWJsZS50ZXN0KHN0cikgPyAnXCInICsgc3RyLnJlcGxhY2UoU3VydmV5SlNPTjUuZXNjYXBhYmxlLCBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBTdXJ2ZXlKU09ONS5tZXRhW2FdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBjID09PSAnc3RyaW5nJyA/XHJcbiAgICAgICAgICAgICAgICAgICAgYyA6XHJcbiAgICAgICAgICAgICAgICAgICAgJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XHJcbiAgICAgICAgICAgIH0pICsgJ1wiJyA6ICdcIicgKyBzdHIgKyAnXCInO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmRcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbnRlcm5hbFN0cmluZ2lmeShob2xkZXI6IGFueSwga2V5OiBhbnksIGlzVG9wTGV2ZWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIGJ1ZmZlciwgcmVzO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUsIGlmIG5lY2Vzc2FyeVxyXG4gICAgICAgICAgICB2YXIgb2JqX3BhcnQgPSB0aGlzLmdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXIsIGtleSwgaXNUb3BMZXZlbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqX3BhcnQgJiYgIXRoaXMuaXNEYXRlKG9ial9wYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdW5ib3ggb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgdW5ib3ggZGF0ZXMsIHNpbmNlIHdpbGwgdHVybiBpdCBpbnRvIG51bWJlclxyXG4gICAgICAgICAgICAgICAgb2JqX3BhcnQgPSBvYmpfcGFydC52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2Ygb2JqX3BhcnQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ial9wYXJ0LnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihvYmpfcGFydCkgfHwgIWlzRmluaXRlKG9ial9wYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpfcGFydC50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lc2NhcGVTdHJpbmcob2JqX3BhcnQudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpfcGFydCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQXJyYXkob2JqX3BhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IFwiW1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnB1c2gob2JqX3BhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpfcGFydC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeShvYmpfcGFydCwgaSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcyA9PT0gbnVsbCB8fCB0eXBlb2YgcmVzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwibnVsbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBvYmpfcGFydC5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluZGVudFN0cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoLCB0cnVlKSArIFwiXVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IFwie1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9uRW1wdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wdXNoKG9ial9wYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmpfcGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ial9wYXJ0Lmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeShvYmpfcGFydCwgcHJvcCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVG9wTGV2ZWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiICYmIHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9uRW1wdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gdGhpcy5pc1dvcmQocHJvcCkgPyBwcm9wIDogdGhpcy5lc2NhcGVTdHJpbmcocHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBrZXkgKyBcIjpcIiArICh0aGlzLmluZGVudFN0ciA/ICcgJyA6ICcnKSArIHZhbHVlICsgXCIsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub25FbXB0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLCBidWZmZXIubGVuZ3RoIC0gMSkgKyB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKSArIFwifVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gJ3t9JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbnMgYW5kIHVuZGVmaW5lZCBzaG91bGQgYmUgaWdub3JlZFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0SXRlbSB7XHJcbiAgICAgICAgcHVibGljIHZhbHVlOiBTdXJ2ZXkuQmFzZTtcclxuICAgICAgICBwdWJsaWMgdGV4dDogYW55O1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RzIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGludGVuZDogc3RyaW5nID0gXCIuLi5cIjtcclxuICAgICAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGtvT2JqZWN0czogYW55LCBwdWJsaWMga29TZWxlY3RlZDogYW55KSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucmVidWlsZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlUGFnZShwYWdlLCB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGggLSAxKTtcclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKGl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZWxlY3RPYmplY3Qob2JqOiBTdXJ2ZXkuQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9ianNbaV0udmFsdWUgPT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG9ianNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlT2JqZWN0KG9iajogU3VydmV5LkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgY291bnRUb1JlbW92ZSA9IDE7XHJcbiAgICAgICAgICAgIGlmIChvYmouZ2V0VHlwZSgpID09ICdwYWdlJykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2U6IFN1cnZleS5QYWdlID0gPFN1cnZleS5QYWdlPm9iajtcclxuICAgICAgICAgICAgICAgIGNvdW50VG9SZW1vdmUgKz0gcGFnZS5xdWVzdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzLnNwbGljZShpbmRleCwgY291bnRUb1JlbW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVidWlsZCgpIHtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29PYmplY3RzKG9ianMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZUl0ZW0odGhpcy5zdXJ2ZXksIFwiU3VydmV5XCIpKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZVBhZ2UocGFnZSwgaSkpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZVF1ZXN0aW9uKHBhZ2UucXVlc3Rpb25zW2pdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMob2Jqcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCh0aGlzLnN1cnZleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSwgcGFnZUluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3JlYXRlSXRlbShwYWdlLCBTdXJ2ZXlPYmplY3RzLmludGVuZCArIFwiUGFnZSBcIiArIChwYWdlSW5kZXggKyAxKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVJdGVtKHF1ZXN0aW9uLCBTdXJ2ZXlPYmplY3RzLmludGVuZCArIFN1cnZleU9iamVjdHMuaW50ZW5kICsgcXVlc3Rpb24ubmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlSXRlbSh2YWx1ZTogU3VydmV5LkJhc2UsIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBTdXJ2ZXlPYmplY3RJdGVtKCk7XHJcbiAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaXRlbS50ZXh0ID0ga28ub2JzZXJ2YWJsZSh0ZXh0KTtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0SXRlbUluZGV4KHZhbHVlOiBTdXJ2ZXkuQmFzZSk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHZhciBvYmpzID0gdGhpcy5rb09iamVjdHMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2Jqc1tpXS52YWx1ZSA9PSB2YWx1ZSkgcmV0dXJuIGk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSB0ZW1wbGF0ZUVkaXRvci5rbyB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8bmF2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCI+ICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cImJzLWV4YW1wbGUtbmF2YmFyLWNvbGxhcHNlLTFcIj4gICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdlwiPiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb0lzU2hvd0Rlc2lnbmVyKCkgPyBcXCdTdXJ2ZXkgRGVzaWduZXJcXCc6IFxcJ0pTT04gRWRpdG9yXFwnXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPjwvYT4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3REZXNpZ25lckNsaWNrXCI+VXNlIFN1cnZleSBEZXNpZ25lcjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOnNlbGVjdEVkaXRvckNsaWNrXCI+VXNlIEpTT04gRWRpdG9yPC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8L3VsPiAgICAgICAgICAgICAgICA8L2xpPiAgICAgICAgICAgIDwvdWw+ICAgICAgICAgICAgPGZvcm0gY2xhc3M9XCJuYXZiYXItZm9ybSBuYXZiYXItbGVmdFwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOiBydW5TdXJ2ZXlDbGlja1wiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNteU1vZGFsXCI+UnVuIFN1cnZleTwvYnV0dG9uPiAgICAgICAgICAgIDwvZm9ybT4gICAgICAgIDwvZGl2PjwhLS0gLy5uYXZiYXItY29sbGFwc2UgLS0+ICAgIDwvZGl2PjwhLS0gLy5jb250YWluZXItZmx1aWQgLS0+PC9uYXY+PGRpdiBjbGFzcz1cInBhbmVsXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+ICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc0VkaXRvclwiIGRhdGEtYmluZD1cInZpc2libGU6ICFrb0lzU2hvd0Rlc2lnbmVyKClcIiBzdHlsZT1cImhlaWdodDo0NTBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb0lzU2hvd0Rlc2lnbmVyKClcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtNCBjb2wtbWQtM1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT1cIndpZHRoOjgwJVwiICBkYXRhLWJpbmQ9XCJvcHRpb25zOiBrb09iamVjdHMsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCB2YWx1ZToga29TZWxlY3RlZE9iamVjdFwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29DYW5EZWxldGVPYmplY3QsIGNsaWNrOiBkZWxldGVDdXJyZW50T2JqZWN0XCIgc3R5bGU9XCJ3aWR0aDoxNSVcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0ZWRpdG9yXFwnLCBkYXRhOiBzZWxlY3RlZE9iamVjdEVkaXRvciB9XCI+PC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wteHMtMTIgY29sLXNtLTYgY29sLW1kLThcIj4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3BhZ2VlZGl0b3JcXCcsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3ZlcmZsb3cteTogc2Nyb2xsO2hlaWdodDo0NTBweDtcIj4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleWpzXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPG5hdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCI+ICAgICAgICAgICAgICAgICAgICA8Zm9ybSBjbGFzcz1cIm5hdmJhci1mb3JtIG5hdmJhci1sZWZ0XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWJpbmQ9XCJjbGljazogYWRkUXVlc3Rpb25cIj5BZGQgUXVlc3Rpb248L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDwvZm9ybT4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cIm5hdiBuYXZiYXItbmF2XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvblR5cGVzIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6ICRwYXJlbnQua29TZWxlY3RlZFF1ZXN0aW9uVHlwZSgpID09ICRkYXRhfSwgY2xpY2s6ICRwYXJlbnQuc2VsZWN0UXVlc3Rpb25UeXBlQ2xpY2soJGRhdGEpXCI+PGE+PHNwYW4gZGF0YS1iaW5kPVwidGV4dDokZGF0YVwiIHN0eWxlPVwiY3Vyc29yOiBwb2ludGVyXCI+PC9zcGFuPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICAgICAgICAgIDwvdWw+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvbmF2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PjwvZGl2PjwhLS0gTW9kYWwgLS0+PGRpdiBpZD1cIm15TW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiByb2xlPVwiZGlhbG9nXCI+ICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gICAgICAgIDwhLS0gTW9kYWwgY29udGVudC0tPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5SdW5uaW5nIHN1cnZleTwvaDQ+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleWpzRXhhbXBsZVwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PjwvZGl2PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwib2JqZWN0ZWRpdG9yXCI+ICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb1Nob3dQcm9wZXJ0aWVzXCI+ICAgICAgICA8dGJvZHkgZGF0YS1iaW5kPVwiZm9yZWFjaDoga29Qcm9wZXJ0aWVzXCI+ICAgICAgICAgICAgPHRyIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50LmNoYW5nZUFjdGl2ZVByb3BlcnR5KCRkYXRhKSwgc3R5bGU6IHtiYWNrZ3JvdW5kOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YSA/IFxcJ2xpZ2h0Z3JheVxcJzogXFwnXFwnfVwiPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidGV4dDogbmFtZVwiIHdpZHRoPVwiNTAlXCI+PC90ZD4gICAgICAgICAgICAgICAgPHRkIHdpZHRoPVwiNTAlXCI+ICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHQsIHZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpICE9ICRkYXRhLCBhdHRyOiB7dGl0bGU6IGtvVGV4dH0sIHN0eWxlOiB7Y29sb3I6IGtvSXNEZWZhdWx0KCkgPyBcXCdncmF5XFwnIDogXFwnXFwnfVwiIHN0eWxlPVwidGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3c6aGlkZGVuXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YVwiPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItXFwnICsgZWRpdG9yVHlwZSwgZGF0YTogJGRhdGEgfSAtLT4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3Rib2R5PiAgICA8L3RhYmxlPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicGFnZWVkaXRvclwiPiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnNcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29QYWdlcyAtLT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6IGtvU2VsZWN0ZWQoKX1cIj4gICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazokcGFyZW50LnNlbGVjdFBhZ2VDbGlja1wiPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0aXRsZVwiPjwvc3Bhbj4gICAgICAgICAgICA8L2E+ICAgICAgICA8L2xpPiAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1iaW5kPVwiY2xpY2s6YWRkTmV3UGFnZUNsaWNrXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+PC9idXR0b24+PC9saT4gICAgPC91bD48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWJvb2xlYW5cIj4gICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6IGtvVmFsdWVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItZHJvcGRvd25cIj4gICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZSwgb3B0aW9uczogY2hvaWNlc1wiICBzdHlsZT1cIndpZHRoOjEwMCVcIj48L3NlbGVjdD48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWl0ZW12YWx1ZXNcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ3aXRoOiBpdGVtVmFsdWVzXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgei1pbmRleDoxMDA7IHRvcDpwYXJlbnRPZmZzZXQudG9wO2xlZnQ6cGFyZW50T2Zmc2V0LmxlZnQgLSAxMDA7YmFja2dyb3VuZC1jb2xvcjpsaWdodGdyYXlcIj4gICAgICAgIDx0YWJsZT4gICAgICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDx0aD5WYWx1ZTwvdGg+ICAgICAgICAgICAgICAgICAgICA8dGg+VGV4dDwvdGg+ICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8L3RoZWFkPiAgICAgICAgICAgIDx0Ym9keT4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0l0ZW1zIC0tPiAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29UZXh0XCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uRGVsZXRlQ2xpY2tcIiB2YWx1ZT1cIkRlbGV0ZVwiIC8+PC90ZD4gICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05ld1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05ld1RleHRcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQWRkQ2xpY2tcIiB2YWx1ZT1cIkFkZFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgPC90YWJsZT4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJBcHBseVwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFwcGx5Q2xpY2tcIiAvPiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXRleHRcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIiAvPjwvc2NyaXB0Pic7fSJdLCJzb3VyY2VSb290Ijoic3JjIn0=
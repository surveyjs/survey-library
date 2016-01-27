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
                return JSON.stringify(value);
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
            this.koShowProperties(true);
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
            if (name == "showQuestionNumbers" || name == "choicesOrder")
                return "dropdown";
            if (name == "choices" || name == "columns" || name == "rows" || name == "rateValues")
                return "itemvalues";
            if (name == "visible" || name.indexOf("is") == 0 || name.indexOf("has") == 0 || name.indexOf("show") == 0)
                return "boolean";
            return "text";
        };
        SurveyObjectEditor.prototype.getPropertyEditorChoices = function (property) {
            var name = property.name;
            if (name == "showQuestionNumbers")
                return ["on", "onPage", "off"];
            if (name == "choicesOrder")
                return ["none", "asc", "desc", "random"];
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
        SurveyTextWorker.prototype.addPage = function (newName) {
            if (this.surveyValue == null)
                return;
            var newText = "";
            var pageText = "{name: '" + newName + "', questions: []}";
            if (this.surveyValue.pages.length == 0) {
                newText = "{ pages: \n [" + pageText + "\n]}"; //todo
            }
            else {
                if (this.isSurveyAsPage) {
                    newText = "{ pages: \n [" + this.text + ",\n" + pageText + "]}";
                }
                else {
                    var pos = this.surveyValue.pages[this.surveyValue.pages.length - 1]["pos"].end;
                    newText = this.text.substr(0, pos) + ", \n" + pageText + this.text.substr(pos);
                }
            }
            this.text = newText;
        };
        SurveyTextWorker.prototype.addQuestion = function (page, newQuestion) {
            if (page == null)
                return;
            var questionText = this.getQuestionText(newQuestion);
            var newText = "";
            var pos = 0;
            if (page.questions.length > 0) {
                pos = page.questions[page.questions.length - 1]["pos"].end;
                newText = this.text.substr(0, pos) + ", \n" + questionText + this.text.substr(pos);
            }
            else {
                var questions = page["pos"]["questions"];
                if (questions) {
                    pos = questions.end - 1;
                    newText = this.text.substr(0, pos) + questionText + this.text.substr(pos);
                }
                else {
                    var pagePos = page["pos"];
                    var textPage = this.text.substr(pagePos.start, pagePos.end - pagePos.start - 1);
                    var commaText = textPage.trim() != "" ? ", " : "";
                    pos = pagePos.end - 1;
                    newText = this.text.substr(0, pos) + commaText + "questions: [" + questionText + "]" + this.text.substr(pos);
                }
            }
            this.text = newText;
        };
        SurveyTextWorker.prototype.changeProperty = function (obj, name, newValue, isDefault) {
            var pos = obj["pos"];
            if (!pos)
                return;
            var propertyPosInfo = this.getPropertyInfo(pos.start, pos.end, name);
            var newText = this.text;
            if (isDefault) {
                if (propertyPosInfo.isFound) {
                    newText = this.text.substr(0, propertyPosInfo.start) + this.text.substr(propertyPosInfo.end + 1);
                }
            }
            else {
                newValue = this.getValueText(newValue);
                if (!propertyPosInfo.isFound) {
                    newText = this.text.substr(0, pos.end - 1) + ", " + name + ": " + newValue + this.text.substr(pos.end - 1);
                }
                else {
                    newText = this.text.substr(0, propertyPosInfo.valueStart) + " " + newValue + this.text.substr(propertyPosInfo.end + 1);
                }
            }
            this.text = newText;
        };
        SurveyTextWorker.prototype.getCurrentSurveyObjects = function (row, column) {
            var result = [];
            if (!this.surveyObjects)
                return result;
            for (var i = 0; i < this.surveyObjects.length; i++) {
                var objPosition = this.surveyObjects[i].position;
                if (!objPosition)
                    continue;
                var start = objPosition.start;
                var end = objPosition.end;
                if ((start.row < row || (start.row == row && start.column <= column))
                    && (end.row > row || (end.row == row && end.column > column))) {
                    result.push(this.surveyObjects[i]);
                }
            }
            return result;
        };
        SurveyTextWorker.prototype.getPropertyInfo = function (start, end, name) {
            var result = new TextParserPropery();
            result.isFound = false;
            var obj = new SurveyEditor.SurveyJSON5(2).parse(this.text, null, start, end);
            if (!obj || !obj[SurveyEditor.SurveyJSON5.positionName] || !obj[SurveyEditor.SurveyJSON5.positionName][name])
                return result;
            var pos = obj[SurveyEditor.SurveyJSON5.positionName][name];
            result.isFound = true;
            result.start = pos.start;
            result.end = pos.end;
            result.valueStart = pos.valueStart;
            return result;
        };
        SurveyTextWorker.prototype.getQuestionText = function (question) {
            var jsonObj = new Survey.JsonObject().toJsonObject(question);
            jsonObj["type"] = question.getType();
            return this.stringify(jsonObj);
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
        SurveyTextWorker.prototype.getValueText = function (newValue) {
            return this.stringify(newValue);
        };
        SurveyTextWorker.prototype.stringify = function (obj) {
            return new SurveyEditor.SurveyJSON5().stringify(obj);
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
            this.koSelectedPage = ko.observable(null);
            this.koSelectedQuestion = ko.observable(null);
            this.questionTypes = Survey.QuestionFactory.Instance.getAllTypes();
            this.koSelectedQuestionType = ko.observable(this.questionTypes[0]);
            this.koShowLiveSurvey = ko.observable(false);
            var self = this;
            this.showLiveSurveyClick = function () { self.koShowLiveSurvey(!self.koShowLiveSurvey()); };
            this.koShowLiveSurvey.subscribe(function (newValue) { self.showLiveSurvey(newValue); });
            this.surveyEditor = new SurveyEditor_1.SurveyObjectEditor();
            this.surveyEditor.title = "Survey Properties";
            this.surveyEditor.koShowProperties(false);
            this.surveyEditor.onPropertyValueChanged.add(function (sender, options) {
                self.onPropertyValueChanged(options.property, options.object, options.newValue);
            });
            this.pageEditor = new SurveyEditor_1.SurveyObjectEditor();
            this.pageEditor.onPropertyValueChanged.add(function (sender, options) {
                self.onPropertyValueChanged(options.property, options.object, options.newValue);
            });
            this.questionEditor = new SurveyEditor_1.SurveyObjectEditor();
            this.questionEditor.onPropertyValueChanged.add(function (sender, options) {
                self.onPropertyValueChanged(options.property, options.object, options.newValue);
            });
            this.pagesEditor = new SurveyEditor_1.SurveyPagesEditor(function () { self.addPage(); }, function (page) { self.moveToObject(page); });
            if (renderedElement) {
                this.render(renderedElement);
            }
        }
        Object.defineProperty(SurveyEditor.prototype, "survey", {
            get: function () {
                return this.textWorker != null ? this.textWorker.survey : null;
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
            this.text = value;
            this.jsonEditor.find(findText);
        };
        SurveyEditor.prototype.addPage = function () {
            if (this.textWorker == null || !this.textWorker.isJsonCorrect)
                return;
            var name = this.getNewName(this.textWorker.survey.pages, "page");
            this.textWorker.addPage(name);
            this.setText(this.textWorker.text, name);
        };
        SurveyEditor.prototype.addQuestion = function () {
            var page = this.koSelectedPage();
            if (page == null)
                return;
            var name = this.getNewName(this.textWorker.survey.getAllQuestions(), "question");
            this.textWorker.addQuestion(page, Survey.QuestionFactory.Instance.createQuestion(this.koSelectedQuestionType(), name));
            this.setText(this.textWorker.text, name);
        };
        SurveyEditor.prototype.onPropertyValueChanged = function (property, object, newValue) {
            if (!object || !object["pos"])
                return;
            var isDefault = property.isDefaultValue(newValue);
            if (isDefault) {
                delete object[property.name];
            }
            else {
                object[property.name] = newValue;
            }
            this.textWorker.changeProperty(object, property.name, newValue, isDefault);
            this.setText(this.textWorker.text, object.name); //TODO
        };
        SurveyEditor.prototype.setTextValue = function (value, position) {
            if (this.jsonEditor == null)
                return;
            this.isProcessingImmediately = true;
            this.jsonEditor.setValue(value, position);
            this.processJson(value);
            this.isProcessingImmediately = false;
        };
        SurveyEditor.prototype.applyBinding = function () {
            if (this.renderedElement == null)
                return;
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
            this.jsonEditor = ace.edit("surveyjsEditor");
            this.surveyjsSelectedObj = document.getElementById("surveyjsSelectedObj");
            this.surveyjsExample = document.getElementById("surveyjsExample");
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
            this.jsonEditor.selection.on("changeCursor", function () {
                self.onJsonEditorCursorChanged();
            });
            this.jsonEditor.getSession().setUseWorker(true);
            this.setText(SurveyEditor.defaultNewSurveyText, "name: 'question1'");
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
        SurveyEditor.prototype.onJsonEditorCursorChanged = function () {
            if (this.textWorker == null || !this.textWorker.isJsonCorrect)
                return;
            var position = this.jsonEditor.getCursorPosition();
            var objs = this.textWorker.getCurrentSurveyObjects(position.row, position.column);
            var page = null;
            var question = null;
            for (var i = 0; i < objs.length; i++) {
                if (objs[i].getType() == "page")
                    page = objs[i];
                else
                    question = objs[i];
            }
            this.koSelectedPage(page);
            this.koSelectedQuestion(question);
            this.pageEditor.selectedObject = page;
            this.pagesEditor.setSelectedPage(page);
            if (page) {
                this.pageEditor.title = "Page properties: page" + (this.textWorker.survey.pages.indexOf(page) + 1);
            }
            this.questionEditor.selectedObject = question;
            if (question) {
                this.questionEditor.title = "Question properties: " + question.name;
            }
        };
        SurveyEditor.prototype.moveToObject = function (obj) {
            var pos = obj["position"];
            if (!pos)
                return;
            this.jsonEditor.moveCursorTo(pos.start.row, pos.start.column);
            this.jsonEditor.selection.clearSelection();
        };
        SurveyEditor.prototype.processJson = function (text) {
            this.textWorker = new SurveyEditor_1.SurveyTextWorker(text);
            this.showLiveSurvey(this.koShowLiveSurvey());
            this.surveyEditor.selectedObject = this.textWorker.survey;
            this.pagesEditor.survey = this.textWorker.survey;
            this.onJsonEditorCursorChanged();
            this.jsonEditor.getSession().setAnnotations(this.createAnnotations(text, this.textWorker.errors));
        };
        SurveyEditor.prototype.showLiveSurvey = function (showSurvey) {
            if (showSurvey && this.surveyjsExample) {
                if (this.textWorker.isJsonCorrect) {
                    this.textWorker.survey.render(this.surveyjsExample);
                }
                else {
                    this.surveyjsExample.innerText = "Please correct the survey JSON.";
                }
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
                        object[SurveyJSON5.positionName][key].end = start;
                    }
                    this.white();
                    // If there's no comma after this pair, this needs to be
                    // the end of the object.
                    if (this.ch !== ',') {
                        if (this.parseType > 1) {
                            object[SurveyJSON5.positionName][key].end--;
                        }
                        this.next('}');
                        if (this.parseType > 0) {
                            object[SurveyJSON5.positionName].end = this.at - 1;
                        }
                        return object;
                    }
                    if (this.parseType > 1 && !isFirstProperty) {
                        object[SurveyJSON5.positionName][key].end--;
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

var templateEditor;
(function (templateEditor) {
    var ko;
    (function (ko) {
        ko.html = '<script type="text/html" id="objecteditor">    <div  data-bind="visible:koHasObject" style="margin:10px;width:100%">        <div style="background-color:lightgray">            <a href="#" data-bind="click: showProperties">                <span data-bind="text: koShowProperties() ? \'Hide\': \'Show\'"></span>            </a>            <span data-bind="text: koTitle"></span>        </div>        <div>            <table data-bind="visible:koShowProperties">                <tbody data-bind="foreach: koProperties">                    <tr data-bind="click: $parent.changeActiveProperty($data), style: {background: $parent.koActiveProperty() == $data ? \'lightgray\': \'\'}">                        <td data-bind="text: name"></td>                        <td>                            <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data, attr: {title: koText}, style: {color: koIsDefault() ? \'gray\' : \'\'}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                            <!-- ko if: editorType == \'text\' -->                            <input type="text" data-bind="value: koValue, visible: $parent.koActiveProperty() == $data" />                            <!-- /ko -->                            <!-- ko if: editorType == \'boolean\' -->                            <input type="checkbox" data-bind="checked: koValue, visible: $parent.koActiveProperty() == $data" />                            <!-- /ko -->                            <!-- ko if: editorType == \'dropdown\' -->                            <select data-bind="value: koValue, visible: $parent.koActiveProperty() == $data, options: choices"></select>                            <!-- /ko -->                            <!-- ko if: editorType == \'itemvalues\' -->                            <div data-bind="visible: $parent.koActiveProperty() == $data, with: itemValues" style="position:absolute; z-index:100; top:parentOffset.top;left:parentOffset.left - 100;background-color:lightgray">                                <table>                                    <thead>                                        <tr>                                            <th>Value</th>                                            <th>Text</th>                                            <th></th>                                        </tr>                                    </thead>                                    <tbody>                                        <!-- ko foreach: koItems -->                                        <tr>                                            <td><input type="text" data-bind="value:koValue" style="width:100px" /></td>                                            <td><input type="text" data-bind="value:koText" style="width:100px" /></td>                                            <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>                                        </tr>                                        <!-- /ko -->                                        <tr>                                            <td><input type="text" data-bind="value:koNewValue" style="width:100px" /></td>                                            <td><input type="text" data-bind="value:koNewText" style="width:100px" /></td>                                            <td><input type="button" data-bind="click: onAddClick" value="Add" /></td>                                        </tr>                                    </tbody>                                </table>                                <input type="button" value="Apply" data-bind="click: onApplyClick" />                            </div>                            <!-- /ko -->                        </td>                    </tr>                </tbody>            </table>        </div>    </div></script><script type="text/html" id="pageeditor">    <div data-bind="visible:koIsValid">        <!-- ko foreach: koPages -->            <div data-bind="text: title, style: {background: koSelected() ? \'darkgray\' : \'lightgray\'},click:$parent.selectPageClick" style="padding:2px;display:table-cell;white-space:nowrap;cursor:pointer"></div>        <!-- /ko  -->        <div style="display:table-cell;padding:2px">            <input type="button" data-bind="click:addNewPageClick" value="Add New Page" />        </div>    </div></script><div style="overflow:hidden;position:relative;display:table">    <div id="surveyjsPanel" style="display:table-cell;vertical-align:top">        <div style="width:300px;height:400px;overflow-y:auto;overflow-x:hidden">            <div data-bind="template: { name: \'objecteditor\', data: surveyEditor }"></div>            <div data-bind="visible: koSelectedPage() != null">                <div data-bind="template: { name: \'objecteditor\', data: pageEditor }"></div>                <div data-bind="template: { name: \'objecteditor\', data: questionEditor }"></div>            </div>        </div>        <div  data-bind="visible: koSelectedPage() != null">            <select data-bind="options: questionTypes, value: koSelectedQuestionType"></select>            <input type="button" value="Add Question" data-bind="click: addQuestion" />        </div>    </div>    <div style="display:table-cell;width:100%">        <div id="surveyjsEditor" style="height:400px;width:100%">        </div>        <div data-bind="template: { name: \'pageeditor\', data: pagesEditor }" style="width:20px"></div>    </div></div><p><a href="#" data-bind="click: showLiveSurveyClick">    <span data-bind="text: koShowLiveSurvey() ? \'Hide Live Survey\': \'Show Live Survey\'"></span></a></p><div data-bind="visible: koShowLiveSurvey()">    <div id="surveyjsExample" style="height:400px;width:100%"></div></div>';
    })(ko = templateEditor.ko || (templateEditor.ko = {}));
})(templateEditor || (templateEditor = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm9iamVjdFByb3BlcnR5LnRzIiwib2JqZWN0RWRpdG9yLnRzIiwicGFnZXNFZGl0b3IudHMiLCJ0ZXh0V29ya2VyLnRzIiwiZWRpdG9yLnRzIiwianNvbjUudHMiLCJ0ZW1wbGF0ZUVkaXRvci5rby5odG1sLnRzIl0sIm5hbWVzIjpbIlN1cnZleUVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eS5vYmplY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkudXBkYXRlVmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkuZ2V0VmFsdWVUZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlLnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlLkFkZEl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlJdGVtVmFsdWUuQXBwbHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IudGl0bGUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLnNlbGVjdGVkT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5nZXRQcm9wZXJ0eUVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuY2hhbmdlQWN0aXZlUHJvcGVydHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLk9iamVjdENoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLnNob3dQcm9wZXJ0aWVzIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci51cGRhdGVQcm9wZXJ0aWVzIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5nZXRQcm9wZXJ0eUVkaXRvclR5cGUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLmdldFByb3BlcnR5RWRpdG9yQ2hvaWNlcyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuY2FuU2hvd1Byb3BlcnR5IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci51cGRhdGVQcm9wZXJ0aWVzT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5zZXRTZWxlY3RlZFBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3IuYWRkTmV3UGFnZUNsaWNrIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLnVwZGF0ZVBhZ2VzIiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5IiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5LmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5wcm9jZXNzIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIuYWRkUGFnZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmFkZFF1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIuY2hhbmdlUHJvcGVydHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5nZXRDdXJyZW50U3VydmV5T2JqZWN0cyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmdldFByb3BlcnR5SW5mbyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmdldFF1ZXN0aW9uVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLnVwZGF0ZUpzb25Qb3NpdGlvbnMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5jcmVhdGVTdXJ2ZXlPYmplY3RzIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5nZXRQb3N0aW9uQnlDaGFydEF0IiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIuZ2V0QXRBcnJheSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmdldFZhbHVlVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLnN0cmluZ2lmeSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnJlbmRlciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IudGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZ2V0VGV4dEFuZFByb2Nlc3MiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnNldFRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmFkZFBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmFkZFF1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zZXRUZXh0VmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmFwcGx5QmluZGluZyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuaW5pdEpzb25FZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm9uSnNvbkVkaXRvckNoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm9uSnNvbkVkaXRvckN1cnNvckNoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm1vdmVUb09iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IucHJvY2Vzc0pzb24iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnNob3dMaXZlU3VydmV5IiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5jcmVhdGVBbm5vdGF0aW9ucyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZ2V0TmV3TmFtZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5wYXJzZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5wYXJzZS53YWxrIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmVycm9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041Lm5leHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUucGVlayIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jaGFydEF0IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlkZW50aWZpZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUubnVtYmVyIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnN0cmluZyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5pbmxpbmVDb21tZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmJsb2NrQ29tbWVudCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jb21tZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LndoaXRlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LndvcmQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuYXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUub2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnN0cmluZ2lmeSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5nZXRJbmRlbnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzV29yZENoYXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNXb3JkU3RhcnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNXb3JkIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzQXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNEYXRlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzTmFOIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmNoZWNrRm9yQ2lyY3VsYXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUubWFrZUluZGVudCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5lc2NhcGVTdHJpbmciLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaW50ZXJuYWxTdHJpbmdpZnkiLCJ0ZW1wbGF0ZUVkaXRvciIsInRlbXBsYXRlRWRpdG9yLmtvIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFlBQVksQ0FrR2xCO0FBbEdELFdBQU8s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Q0FBQ0E7b0JBQzFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQTtnQkFDaENBLENBQUNBO1lBQ0xBLENBQUNBO1lBRURBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNYQSxLQUFLQSxFQUFFQTtvQkFDSEEsT0FBT0EsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQ3RDQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDbEJBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO29CQUNoQkEsQ0FBQ0E7b0JBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNsQkEsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0E7d0JBQ2RBLE9BQU9BLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBOzRCQUNyREEsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ3RCQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyQ0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTt3QkFDWkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFB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QUlBLEdBQVpBO1lBRUllLHdCQUF3QkE7WUFFeEJBLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNkQSxLQUFLQSxHQUFHQTtvQkFDSkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO2dCQUNoQkEsS0FBS0EsR0FBR0E7b0JBQ0pBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ2pCQSxLQUFLQSxHQUFHQTtvQkFDSkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBO2dCQUNoQkEsS0FBS0EsR0FBR0E7b0JBQ0pB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Q0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtvQkFDeEJBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7b0JBQzVCQSxDQUFDQTtvQkFFREEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7b0JBQ2JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyQkEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsRUFBRUEsS0FBS0EsRUFBRUEsVUFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ2xGQSxDQUFDQTtvQkFDREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO29CQUMzQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JCQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDcEJBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEdBQUdBLEtBQUtBLENBQUNBO29CQUN0REEsQ0FBQ0E7b0JBQ0RBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO29CQUNiQSxBQUVBQSx3REFGd0RBO29CQUN4REEseUJBQXlCQTtvQkFDekJBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO3dCQUNsQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3JCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDaERBLENBQUNBO3dCQUNEQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDZkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7NEJBQ3JCQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDdkRBLENBQUNBO3dCQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtvQkFDbEJBLENBQUNBO29CQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxlQUFlQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDekNBLE1BQU1BLENBQUNBLFdBQVdBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLEVBQUVBLENBQUNBO29CQUNoREEsQ0FBQ0E7b0JBQ0RBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtvQkFDYkEsZUFBZUEsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQzVCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUM3QkEsQ0FBQ0E7UUFDT2pCLDJCQUFLQSxHQUFiQTtZQUVJa0IsMkVBQTJFQTtZQUMzRUEsYUFBYUE7WUFFYkEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7WUFDYkEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2RBLEtBQUtBLEdBQUdBO29CQUNKQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFDekJBLEtBQUtBLEdBQUdBO29CQUNKQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxFQUFFQSxDQUFDQTtnQkFDeEJBLEtBQUtBLEdBQUdBLENBQUNBO2dCQUNUQSxLQUFLQSxHQUFHQTtvQkFDSkEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0E7Z0JBQ3pCQSxLQUFLQSxHQUFHQSxDQUFDQTtnQkFDVEEsS0FBS0EsR0FBR0EsQ0FBQ0E7Z0JBQ1RBLEtBQUtBLEdBQUdBO29CQUNKQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFDekJBO29CQUNJQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtZQUM5RUEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFNTWxCLCtCQUFTQSxHQUFoQkEsVUFBaUJBLEdBQVFBLEVBQUVBLFFBQW9CQSxFQUFFQSxLQUFpQkE7WUFBdkNtQix3QkFBb0JBLEdBQXBCQSxlQUFvQkE7WUFBRUEscUJBQWlCQSxHQUFqQkEsWUFBaUJBO1lBQzlEQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxVQUFVQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUVBLE1BQU1BLElBQUlBLEtBQUtBLENBQUNBLHlDQUF5Q0EsQ0FBQ0EsQ0FBQ0E7WUFDL0RBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBO1lBQ3pCQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUN2Q0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDbkJBLEFBR0FBLGtEQUhrREE7WUFDbERBLHdDQUF3Q0E7WUFDeENBLHVDQUF1Q0E7Z0JBQ25DQSxjQUFjQSxHQUFHQSxFQUFFQSxFQUFFQSxFQUFFQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNqQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSwyQkFBMkJBLENBQUNBLGNBQWNBLEVBQUVBLEVBQUVBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1lBQ3RFQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxpQkFBaUJBLENBQUNBLGNBQWNBLEVBQUVBLEVBQUVBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO1FBQzVEQSxDQUFDQTtRQUNPbkIsK0JBQVNBLEdBQWpCQSxVQUFrQkEsS0FBVUE7WUFDeEJvQixFQUFFQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDUkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsS0FBS0EsS0FBS0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQzVCQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtnQkFDakJBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxPQUFPQSxLQUFLQSxLQUFLQSxRQUFRQSxJQUFJQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDakRBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLEVBQUVBLEtBQUtBLEVBQUVBLElBQUlBLENBQUNBLENBQUNBO2dCQUM3Q0EsQ0FBQ0E7WUFDTEEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFDZEEsQ0FBQ0E7UUFDT3BCLGlEQUEyQkEsR0FBbkNBLFVBQW9DQSxNQUFXQSxFQUFFQSxHQUFRQSxFQUFFQSxVQUFtQkE7WUFDMUVxQixJQUFJQSxLQUFLQSxHQUFHQSxNQUFNQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUV4QkEsQUFDQUEsNkRBRDZEQTtZQUM3REEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsS0FBS0EsQ0FBQ0EsTUFBTUEsSUFBSUEsT0FBT0EsS0FBS0EsQ0FBQ0EsTUFBTUEsS0FBS0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzlEQSxLQUFLQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtZQUMzQkEsQ0FBQ0E7WUFFREEsQUFFQUEseUdBRnlHQTtZQUN6R0EscUdBQXFHQTtZQUNyR0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsVUFBVUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3hDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxHQUFHQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUNsREEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3ZCQSxFQUFFQSxDQUFDQSxDQUFDQSxVQUFVQSxJQUFJQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDeEVBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO2dCQUNqQkEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLENBQUNBO29CQUNKQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQTtnQkFDckJBLENBQUNBO1lBQ0xBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtZQUNqQkEsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFFT3JCLGdDQUFVQSxHQUFsQkEsVUFBbUJBLElBQVNBO1lBQ3hCc0IsTUFBTUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0E7Z0JBQy9CQSxDQUFDQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxJQUFJQSxHQUFHQSxDQUFDQTtnQkFDNUJBLENBQUNBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBO2dCQUM1QkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsS0FBS0EsR0FBR0EsQ0FBQ0E7UUFDckNBLENBQUNBO1FBRU90QixpQ0FBV0EsR0FBbkJBLFVBQW9CQSxJQUFTQTtZQUN6QnVCLE1BQU1BLENBQUNBLENBQUNBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLElBQUlBLEdBQUdBLENBQUNBO2dCQUMvQkEsQ0FBQ0EsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsSUFBSUEsR0FBR0EsQ0FBQ0E7Z0JBQzVCQSxJQUFJQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxLQUFLQSxHQUFHQSxDQUFDQTtRQUNyQ0EsQ0FBQ0E7UUFFT3ZCLDRCQUFNQSxHQUFkQSxVQUFlQSxHQUFRQTtZQUNuQndCLEVBQUVBLENBQUNBLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBO2dCQUMxQkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDakJBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM1QkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7WUFDakJBLENBQUNBO1lBQ0RBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLE1BQU1BLEdBQUdBLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBO1lBQy9CQSxPQUFPQSxDQUFDQSxHQUFHQSxNQUFNQSxFQUFFQSxDQUFDQTtnQkFDaEJBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUMzQkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQ2pCQSxDQUFDQTtnQkFDREEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7WUFDUkEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0E7UUFDaEJBLENBQUNBO1FBQ0R4QixZQUFZQTtRQUNKQSw2QkFBT0EsR0FBZkEsVUFBZ0JBLEdBQVFBO1lBQ3BCeUIsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hCQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUM5QkEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0pBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBLFNBQVNBLENBQUNBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLEtBQUtBLGdCQUFnQkEsQ0FBQ0E7WUFDcEVBLENBQUNBO1FBQ0xBLENBQUNBO1FBRU96Qiw0QkFBTUEsR0FBZEEsVUFBZUEsR0FBUUE7WUFDbkIwQixNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQSxTQUFTQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxlQUFlQSxDQUFDQTtRQUNuRUEsQ0FBQ0E7UUFFTzFCLDJCQUFLQSxHQUFiQSxVQUFjQSxHQUFRQTtZQUNsQjJCLE1BQU1BLENBQUNBLE9BQU9BLEdBQUdBLEtBQUtBLFFBQVFBLElBQUlBLEdBQUdBLEtBQUtBLEdBQUdBLENBQUNBO1FBQ2xEQSxDQUFDQTtRQUVPM0Isc0NBQWdCQSxHQUF4QkEsVUFBeUJBLEdBQVFBO1lBQzdCNEIsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQzVDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDM0JBLE1BQU1BLElBQUlBLFNBQVNBLENBQUNBLHVDQUF1Q0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2pFQSxDQUFDQTtZQUNMQSxDQUFDQTtRQUNMQSxDQUFDQTtRQUNPNUIsZ0NBQVVBLEdBQWxCQSxVQUFtQkEsR0FBV0EsRUFBRUEsR0FBV0EsRUFBRUEsU0FBMEJBO1lBQTFCNkIseUJBQTBCQSxHQUExQkEsaUJBQTBCQTtZQUNuRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ1BBLE1BQU1BLENBQUNBLEVBQUVBLENBQUNBO1lBQ2RBLENBQUNBO1lBQ0RBLEFBQ0FBLG9DQURvQ0E7WUFDcENBLEVBQUVBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBO2dCQUNsQkEsR0FBR0EsR0FBR0EsR0FBR0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLENBQUNBO1lBRURBLElBQUlBLE1BQU1BLEdBQUdBLFNBQVNBLEdBQUdBLEVBQUVBLEdBQUdBLElBQUlBLENBQUNBO1lBQ25DQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxHQUFHQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDM0JBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBO1lBQ2xCQSxDQUFDQTtZQUVEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFnQk83QixrQ0FBWUEsR0FBcEJBLFVBQXFCQSxHQUFXQTtZQUU1QjhCLEFBSUFBLDRFQUo0RUE7WUFDNUVBLHVFQUF1RUE7WUFDdkVBLDJFQUEyRUE7WUFDM0VBLGFBQWFBO1lBQ2JBLFdBQVdBLENBQUNBLFNBQVNBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBO1lBQ3BDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQSxPQUFPQSxDQUFDQSxXQUFXQSxDQUFDQSxTQUFTQSxFQUFFQSxVQUFVQSxDQUFDQTtnQkFDekYsSUFBSSxDQUFDLEdBQUcsV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDNUIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxLQUFLLFFBQVE7b0JBQ3hCLENBQUM7b0JBQ0QsS0FBSyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDbEUsQ0FBQyxDQUFDQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUMvQkEsQ0FBQ0E7UUFDRDlCLE1BQU1BO1FBRUVBLHVDQUFpQkEsR0FBekJBLFVBQTBCQSxNQUFXQSxFQUFFQSxHQUFRQSxFQUFFQSxVQUFtQkE7WUFDaEUrQixJQUFJQSxNQUFNQSxFQUFFQSxHQUFHQSxDQUFDQTtZQUVoQkEsQUFDQUEsa0NBRGtDQTtnQkFDOUJBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLDJCQUEyQkEsQ0FBQ0EsTUFBTUEsRUFBRUEsR0FBR0EsRUFBRUEsVUFBVUEsQ0FBQ0EsQ0FBQ0E7WUFFekVBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQ0EsQUFFQUEsZ0JBRmdCQTtnQkFDaEJBLG9EQUFvREE7Z0JBQ3BEQSxRQUFRQSxHQUFHQSxRQUFRQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQTtZQUNsQ0EsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsQ0FBQ0EsT0FBT0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RCQSxLQUFLQSxTQUFTQTtvQkFDVkEsTUFBTUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsRUFBRUEsQ0FBQ0E7Z0JBRS9CQSxLQUFLQSxRQUFRQTtvQkFDVEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3pDQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtvQkFDbEJBLENBQUNBO29CQUNEQSxNQUFNQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQTtnQkFFL0JBLEtBQUtBLFFBQVFBO29CQUNUQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxRQUFRQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFFbERBLEtBQUtBLFFBQVFBO29CQUNUQSxFQUFFQSxDQUFDQSxDQUFDQSxRQUFRQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDcEJBLE1BQU1BLENBQUNBLE1BQU1BLENBQUNBO29CQUNsQkEsQ0FBQ0E7b0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNoQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTt3QkFDaENBLE1BQU1BLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNiQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTt3QkFFN0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBOzRCQUN2Q0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTs0QkFDakRBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBOzRCQUNoRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsSUFBSUEsSUFBSUEsT0FBT0EsR0FBR0EsS0FBS0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzdDQSxNQUFNQSxJQUFJQSxNQUFNQSxDQUFDQTs0QkFDckJBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQ0FD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RUEsS0FBS0E7WUFDWEEsR0FBR0EsRUFBRUEsS0FBS0E7WUFDVkEsSUFBSUEsRUFBRUEsTUFBTUE7U0FDZkEsQ0FBQ0E7UUErRk5BLGtCQUFDQTtJQUFEQSxDQS90QkF0RSxBQSt0QkNzRSxJQUFBdEU7SUEvdEJZQSx3QkFBV0EsY0ErdEJ2QkEsQ0FBQUE7QUFDTEEsQ0FBQ0EsRUFqdUJNLFlBQVksS0FBWixZQUFZLFFBaXVCbEI7O0FDcHVCRCxJQUFPLGNBQWMsQ0FBK3FMO0FBQXBzTCxXQUFPLGNBQWM7SUFBQ3NHLElBQUFBLEVBQUVBLENBQTRxTEE7SUFBOXFMQSxXQUFBQSxFQUFFQSxFQUFDQSxDQUFDQTtRQUFZQyxPQUFJQSxHQUFHQSxxcExBQXFwTEEsQ0FBQ0E7SUFBQUEsQ0FBQ0EsRUFBOXFMRCxFQUFFQSxHQUFGQSxpQkFBRUEsS0FBRkEsaUJBQUVBLFFBQTRxTEE7QUFBREEsQ0FBQ0EsRUFBN3JMLGNBQWMsS0FBZCxjQUFjLFFBQStxTCIsImZpbGUiOiJzdXJ2ZXllZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IChwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHksIG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBwcml2YXRlIG9iamVjdFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlVXBkYXRpbmc6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMga29WYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1RleHQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgaXRlbVZhbHVlczogU3VydmV5UHJvcGVydHlJdGVtVmFsdWU7XHJcbiAgICAgICAgcHVibGljIGtvSXNEZWZhdWx0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXM6IEFycmF5PHN0cmluZz47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgcHVibGljIGVkaXRvclR5cGU6IHN0cmluZywgb25Qcm9wZXJ0eUNoYW5nZWQ6IFN1cnZleU9uUHJvcGVydHlDaGFuZ2VkQ2FsbGJhY2sgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IHRoaXMucHJvcGVydHkubmFtZTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChlZGl0b3JUeXBlID09IFwiaXRlbXZhbHVlc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZXMgPSBuZXcgU3VydmV5UHJvcGVydHlJdGVtVmFsdWUoKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5rb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob25Qcm9wZXJ0eUNoYW5nZWQgIT0gbnVsbCAmJiAhc2VsZi5pc1ZhbHVlVXBkYXRpbmcpIG9uUHJvcGVydHlDaGFuZ2VkKHNlbGYsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyByZXR1cm4gc2VsZi5nZXRWYWx1ZVRleHQoc2VsZi5rb1ZhbHVlKCkpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzRGVmYXVsdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYucHJvcGVydHkuaXNEZWZhdWx0VmFsdWUoc2VsZi5rb1ZhbHVlKCkpOyB9KTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLm9iamVjdFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBvYmplY3QodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLm9iamVjdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZVZhbHVlKCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLm9iamVjdFt0aGlzLm5hbWVdKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXRlbVZhbHVlcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWVzLnZhbHVlID0gdGhpcy5rb1ZhbHVlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFZhbHVlVGV4dCh2YWx1ZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeSh2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVDaGFuZ2VkQ2FsbGJhY2sgPSAobmV3VmFsdWU6IEFycmF5PGFueT4pID0+IHZvaWQ7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlJdGVtVmFsdWUge1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVfOiBBcnJheTxhbnk+O1xyXG4gICAgICAgIHB1YmxpYyBrb0l0ZW1zOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvTmV3VmFsdWU6IGFueTtcclxuICAgICAgICBwdWJsaWMga29OZXdUZXh0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BZGRDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFwcGx5Q2xpY2s6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG9uVmFsdWVDaGFuZ2VkOiBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZUNoYW5nZWRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb05ld1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvTmV3VGV4dCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTsgXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQXBwbHkoKTsgfVxyXG4gICAgICAgICAgICBzZWxmLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoaXRlbSkgeyBzZWxmLmtvSXRlbXMucmVtb3ZlKGl0ZW0pOyB9XHJcbiAgICAgICAgICAgIHNlbGYub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5BZGRJdGVtKCk7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goeyBrb1ZhbHVlOiBrby5vYnNlcnZhYmxlKGl0ZW0udmFsdWUpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUoaXRlbS50ZXh0KSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgQWRkSXRlbSgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2goeyBrb1ZhbHVlOiBrby5vYnNlcnZhYmxlKHRoaXMua29OZXdWYWx1ZSgpKSwga29UZXh0OiBrby5vYnNlcnZhYmxlKHRoaXMua29OZXdUZXh0KCkpIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvTmV3VmFsdWUobnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMua29OZXdUZXh0KG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgQXBwbHkoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rb0l0ZW1zKCkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5rb0l0ZW1zKClbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXy5wdXNoKHsgdmFsdWU6IGl0ZW0ua29WYWx1ZSgpLCB0ZXh0OiBpdGVtLmtvVGV4dCgpIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKHRoaXMudmFsdWVfKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eS50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RFZGl0b3Ige1xyXG4gICAgICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RWYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1Byb3BlcnRpZXM6IGFueTtcclxuICAgICAgICBwdWJsaWMga29BY3RpdmVQcm9wZXJ0eTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1RpdGxlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvSGFzT2JqZWN0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvU2hvd1Byb3BlcnRpZXM6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZDogU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleU9iamVjdEVkaXRvciwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleU9iamVjdEVkaXRvciwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1RpdGxlID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcclxuICAgICAgICAgICAgdGhpcy5rb0hhc09iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1Nob3dQcm9wZXJ0aWVzID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2hvd1Byb3BlcnRpZXModHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMua29UaXRsZSgpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMua29UaXRsZSh2YWx1ZSk7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkT2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHNlbGVjdGVkT2JqZWN0KHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzT2JqZWN0KHZhbHVlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydHlFZGl0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5rb1Byb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2hhbmdlQWN0aXZlUHJvcGVydHkocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eShwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBPYmplY3RDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNob3dQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvU2hvd1Byb3BlcnRpZXMoIXRoaXMua29TaG93UHJvcGVydGllcygpKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQcm9wZXJ0aWVzKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc2VsZWN0ZWRPYmplY3QgfHwgIXRoaXMuc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMoW10pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyh0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIHByb3BlcnRpZXMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGEubmFtZSA9PSBiLm5hbWUpIHJldHVybiAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKGEubmFtZSA+IGIubmFtZSkgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydGllcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHZhciBwcm9wRXZlbnQgPSAocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5LCBuZXdWYWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuZmlyZSh0aGlzLCB7IHByb3BlcnR5OiBwcm9wZXJ0eS5wcm9wZXJ0eSwgb2JqZWN0OiBwcm9wZXJ0eS5vYmplY3QsIG5ld1ZhbHVlOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuY2FuU2hvd1Byb3BlcnR5KHByb3BlcnRpZXNbaV0pKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBlZGl0b3JUeXBlID0gdGhpcy5nZXRQcm9wZXJ0eUVkaXRvclR5cGUocHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydHkgPSBuZXcgU3VydmV5T2JqZWN0UHJvcGVydHkocHJvcGVydGllc1tpXSwgZWRpdG9yVHlwZSwgcHJvcEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIGlmIChlZGl0b3JUeXBlID09IFwiZHJvcGRvd25cIikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFByb3BlcnR5LmNob2ljZXMgPSB0aGlzLmdldFByb3BlcnR5RWRpdG9yQ2hvaWNlcyhwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9iamVjdFByb3BlcnRpZXMucHVzaChvYmplY3RQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMob2JqZWN0UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSh0aGlzLmdldFByb3BlcnR5RWRpdG9yKFwibmFtZVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQcm9wZXJ0eUVkaXRvclR5cGUocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHByb3BlcnR5Lm5hbWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09IFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiIHx8IG5hbWUgPT0gXCJjaG9pY2VzT3JkZXJcIikgcmV0dXJuIFwiZHJvcGRvd25cIjtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJjaG9pY2VzXCIgfHwgbmFtZSA9PSBcImNvbHVtbnNcIiB8fCBuYW1lID09IFwicm93c1wiIHx8IG5hbWUgPT0gXCJyYXRlVmFsdWVzXCIpIHJldHVybiBcIml0ZW12YWx1ZXNcIjtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gXCJ2aXNpYmxlXCIgfHwgbmFtZS5pbmRleE9mKFwiaXNcIikgPT0gMCB8fCBuYW1lLmluZGV4T2YoXCJoYXNcIikgPT0gMCB8fCBuYW1lLmluZGV4T2YoXCJzaG93XCIpID09IDApIHJldHVybiBcImJvb2xlYW5cIjtcclxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRQcm9wZXJ0eUVkaXRvckNob2ljZXMocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcInNob3dRdWVzdGlvbk51bWJlcnNcIikgcmV0dXJuIFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSBcImNob2ljZXNPcmRlclwiKSByZXR1cm4gW1wibm9uZVwiLCBcImFzY1wiLCBcImRlc2NcIiwgXCJyYW5kb21cIl07XHJcbiAgICAgICAgICAgIHJldHVybiBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNhblNob3dQcm9wZXJ0eShwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IHByb3BlcnR5Lm5hbWU7XHJcbiAgICAgICAgICAgIGlmIChuYW1lID09ICdxdWVzdGlvbnMnIHx8IG5hbWUgPT0gJ3BhZ2VzJykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5rb1Byb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzW2ldLm9iamVjdCA9IHRoaXMuc2VsZWN0ZWRPYmplY3Q7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJcclxubW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrID0gKCkgPT4gdm9pZDtcclxuICAgIGRlY2xhcmUgdHlwZSBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2sgPSAocGFnZTogU3VydmV5LlBhZ2UpID0+IHZvaWQ7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UGFnZXNFZGl0b3Ige1xyXG4gICAgICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG4gICAgICAgIGtvUGFnZXM6IGFueTtcclxuICAgICAgICBrb0lzVmFsaWQ6IGFueTtcclxuICAgICAgICBzZWxlY3RQYWdlQ2xpY2s6IGFueTtcclxuICAgICAgICBvbkFkZE5ld1BhZ2VDYWxsYmFjazogU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrO1xyXG4gICAgICAgIG9uU2VsZWN0UGFnZUNhbGxiYWNrOiBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2s7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2sgPSBudWxsLCBvblNlbGVjdFBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5vbkFkZE5ld1BhZ2VDYWxsYmFjayA9IG9uQWRkTmV3UGFnZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0UGFnZUNhbGxiYWNrID0gb25TZWxlY3RQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi5zZWxlY3RQYWdlQ2xpY2sgPSBmdW5jdGlvbihwYWdlSXRlbSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLm9uU2VsZWN0UGFnZUNhbGxiYWNrKHBhZ2VJdGVtLnBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc1ZhbGlkKHRoaXMuc3VydmV5VmFsdWUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFNlbGVjdGVkUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmtvUGFnZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcGFnZXNbaV0ua29TZWxlY3RlZChwYWdlc1tpXS5wYWdlID09IHBhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGROZXdQYWdlQ2xpY2soKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZVBhZ2VzKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUGFnZXMoW10pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnUGFnZSAnICsgKGkgKyAxKSwgcGFnZTogdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlc1tpXSwga29TZWxlY3RlZDoga28ub2JzZXJ2YWJsZShmYWxzZSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29QYWdlcyhwYWdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBjbGFzcyBUZXh0UGFyc2VyUHJvcGVyeSB7XHJcbiAgICAgICAgaXNGb3VuZDogYm9vbGVhbjtcclxuICAgICAgICBzdGFydDogbnVtYmVyO1xyXG4gICAgICAgIGVuZDogbnVtYmVyO1xyXG4gICAgICAgIHZhbHVlU3RhcnQ6IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VGV4dFdvcmtlciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBuZXdMaW5lQ2hhcjogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBlcnJvcnM6IEFycmF5PGFueT47XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcclxuICAgICAgICBwcml2YXRlIGpzb25WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5T2JqZWN0czogQXJyYXk8YW55PjtcclxuICAgICAgICBwcml2YXRlIGlzU3VydmV5QXNQYWdlOiBib29sZWFuO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2VzcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzSnNvbkNvcnJlY3QoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlICYmICF0aGlzLnN1cnZleVZhbHVlLmlzRW1wdHk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgcHJvY2VzcygpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuanNvblZhbHVlID0gbmV3IFN1cnZleUpTT041KDEpLnBhcnNlKHRoaXMudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHsgcG9zOiB7IHN0YXJ0OiBlcnJvci5hdCwgZW5kOiAtMSB9LCB0ZXh0OiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmpzb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUpzb25Qb3NpdGlvbnModGhpcy5qc29uVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkuU3VydmV5KHRoaXMuanNvblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9yc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7IHBvczogeyBzdGFydDogZXJyb3IuYXQsIGVuZDogLTEgfSwgdGV4dDogZXJyb3IuZ2V0RnVsbERlc2NyaXB0aW9uKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cyA9IHRoaXMuY3JlYXRlU3VydmV5T2JqZWN0cygpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KHRoaXMuc3VydmV5T2JqZWN0cyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQodGhpcy5lcnJvcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUGFnZShuZXdOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgbmV3VGV4dCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBwYWdlVGV4dCA9IFwie25hbWU6ICdcIiArIG5ld05hbWUgKyBcIicsIHF1ZXN0aW9uczogW119XCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdUZXh0ID0gXCJ7IHBhZ2VzOiBcXG4gW1wiICsgcGFnZVRleHQgKyBcIlxcbl19XCI7IC8vdG9kb1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNTdXJ2ZXlBc1BhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICBuZXdUZXh0ID0gXCJ7IHBhZ2VzOiBcXG4gW1wiICsgdGhpcy50ZXh0ICsgXCIsXFxuXCIgKyBwYWdlVGV4dCArIFwiXX1cIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlcy5sZW5ndGggLSAxXVtcInBvc1wiXS5lbmQ7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgcG9zKSArIFwiLCBcXG5cIiArIHBhZ2VUZXh0ICsgdGhpcy50ZXh0LnN1YnN0cihwb3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IG5ld1RleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbihwYWdlOiBTdXJ2ZXkuUGFnZSwgbmV3UXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICBpZiAocGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvblRleHQgPSB0aGlzLmdldFF1ZXN0aW9uVGV4dChuZXdRdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHZhciBuZXdUZXh0ID0gXCJcIjtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IDA7XHJcbiAgICAgICAgICAgIGlmIChwYWdlLnF1ZXN0aW9ucy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBwb3MgPSBwYWdlLnF1ZXN0aW9uc1twYWdlLnF1ZXN0aW9ucy5sZW5ndGggLSAxXVtcInBvc1wiXS5lbmQ7XHJcbiAgICAgICAgICAgICAgICBuZXdUZXh0ID0gdGhpcy50ZXh0LnN1YnN0cigwLCBwb3MpICsgXCIsIFxcblwiICsgcXVlc3Rpb25UZXh0ICsgdGhpcy50ZXh0LnN1YnN0cihwb3MpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHBhZ2VbXCJwb3NcIl1bXCJxdWVzdGlvbnNcIl07XHJcbiAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb25zKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zID0gcXVlc3Rpb25zLmVuZCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgcG9zKSArIHF1ZXN0aW9uVGV4dCArIHRoaXMudGV4dC5zdWJzdHIocG9zKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHBhZ2VQb3MgPSBwYWdlW1wicG9zXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB0ZXh0UGFnZSA9IHRoaXMudGV4dC5zdWJzdHIocGFnZVBvcy5zdGFydCwgcGFnZVBvcy5lbmQgLSBwYWdlUG9zLnN0YXJ0IC0gMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbW1hVGV4dCA9IHRleHRQYWdlLnRyaW0oKSAhPSBcIlwiID8gXCIsIFwiIDogXCJcIjtcclxuICAgICAgICAgICAgICAgICAgICBwb3MgPSBwYWdlUG9zLmVuZCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgcG9zKSArIGNvbW1hVGV4dCArIFwicXVlc3Rpb25zOiBbXCIgKyBxdWVzdGlvblRleHQgKyBcIl1cIiArIHRoaXMudGV4dC5zdWJzdHIocG9zKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBuZXdUZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2hhbmdlUHJvcGVydHkob2JqOiBPYmplY3QsIG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSwgaXNEZWZhdWx0OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSBvYmpbXCJwb3NcIl07XHJcbiAgICAgICAgICAgIGlmICghcG9zKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eVBvc0luZm8gPSB0aGlzLmdldFByb3BlcnR5SW5mbyhwb3Muc3RhcnQsIHBvcy5lbmQsIG5hbWUpO1xyXG4gICAgICAgICAgICB2YXIgbmV3VGV4dCA9IHRoaXMudGV4dDtcclxuICAgICAgICAgICAgaWYgKGlzRGVmYXVsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5UG9zSW5mby5pc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgcHJvcGVydHlQb3NJbmZvLnN0YXJ0KSArIHRoaXMudGV4dC5zdWJzdHIocHJvcGVydHlQb3NJbmZvLmVuZCArIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB0aGlzLmdldFZhbHVlVGV4dChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5UG9zSW5mby5pc0ZvdW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgcG9zLmVuZCAtIDEpICsgXCIsIFwiICsgbmFtZSArIFwiOiBcIiArIG5ld1ZhbHVlICsgdGhpcy50ZXh0LnN1YnN0cihwb3MuZW5kIC0gMSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIG5ld1RleHQgPSB0aGlzLnRleHQuc3Vic3RyKDAsIHByb3BlcnR5UG9zSW5mby52YWx1ZVN0YXJ0KSArIFwiIFwiICsgbmV3VmFsdWUgKyB0aGlzLnRleHQuc3Vic3RyKHByb3BlcnR5UG9zSW5mby5lbmQgKyAxKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBuZXdUZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q3VycmVudFN1cnZleU9iamVjdHMocm93OiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKTogYW55W10ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXJ2ZXlPYmplY3RzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5T2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9ialBvc2l0aW9uID0gdGhpcy5zdXJ2ZXlPYmplY3RzW2ldLnBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvYmpQb3NpdGlvbikgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3RhcnQgPSBvYmpQb3NpdGlvbi5zdGFydDtcclxuICAgICAgICAgICAgICAgIHZhciBlbmQgPSBvYmpQb3NpdGlvbi5lbmQ7XHJcbiAgICAgICAgICAgICAgICBpZiAoKHN0YXJ0LnJvdyA8IHJvdyB8fCAoc3RhcnQucm93ID09IHJvdyAmJiBzdGFydC5jb2x1bW4gPD0gY29sdW1uKSlcclxuICAgICAgICAgICAgICAgICAgICAmJiAoZW5kLnJvdyA+cm93IHx8IChlbmQucm93ID09IHJvdyAmJiBlbmQuY29sdW1uID4gY29sdW1uKSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnN1cnZleU9iamVjdHNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UHJvcGVydHlJbmZvKHN0YXJ0OiBudW1iZXIsIGVuZDogbnVtYmVyLCBuYW1lOiBzdHJpbmcpOiBUZXh0UGFyc2VyUHJvcGVyeSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgVGV4dFBhcnNlclByb3BlcnkoKTtcclxuICAgICAgICAgICAgcmVzdWx0LmlzRm91bmQgPSBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIG9iaiA9IG5ldyBTdXJ2ZXlKU09ONSgyKS5wYXJzZSh0aGlzLnRleHQsIG51bGwsIHN0YXJ0LCBlbmQpO1xyXG4gICAgICAgICAgICBpZiAoIW9iaiB8fCAhb2JqW1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0gfHwgIW9ialtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW25hbWVdKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gb2JqW1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1bbmFtZV07XHJcbiAgICAgICAgICAgIHJlc3VsdC5pc0ZvdW5kID0gdHJ1ZTtcclxuICAgICAgICAgICAgcmVzdWx0LnN0YXJ0ID0gcG9zLnN0YXJ0O1xyXG4gICAgICAgICAgICByZXN1bHQuZW5kID0gcG9zLmVuZDtcclxuICAgICAgICAgICAgcmVzdWx0LnZhbHVlU3RhcnQgPSBwb3MudmFsdWVTdGFydDtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgZ2V0UXVlc3Rpb25UZXh0KHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIganNvbk9iaiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGpzb25PYmpbXCJ0eXBlXCJdID0gcXVlc3Rpb24uZ2V0VHlwZSgpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkoanNvbk9iaik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlSnNvblBvc2l0aW9ucyhqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAganNvbk9ialtcInBvc1wiXVtcInNlbGZcIl0gPSBqc29uT2JqO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGpzb25PYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChvYmogJiYgb2JqW1wicG9zXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAganNvbk9ialtcInBvc1wiXVtrZXldID0gb2JqW1wicG9zXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSnNvblBvc2l0aW9ucyhvYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU3VydmV5T2JqZWN0cygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB0aGlzLmlzU3VydmV5QXNQYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCAmJiAhcGFnZVtcInBvc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VbXCJwb3NcIl0gPSB0aGlzLnN1cnZleVZhbHVlW1wicG9zXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTdXJ2ZXlBc1BhZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZS5xdWVzdGlvbnNbal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQob2JqZWN0czogYW55W10pIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdHMgPT0gbnVsbCB8fCBvYmplY3RzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHsgcm93OiAwLCBjb2x1bW46IDAgfTtcclxuICAgICAgICAgICAgdmFyIGF0T2JqZWN0c0FycmF5ID0gdGhpcy5nZXRBdEFycmF5KG9iamVjdHMpO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRBdDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdE9iamVjdHNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0ID0gYXRPYmplY3RzQXJyYXlbaV0uYXQ7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuZ2V0UG9zdGlvbkJ5Q2hhcnRBdChwb3NpdGlvbiwgc3RhcnRBdCwgYXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGF0T2JqZWN0c0FycmF5W2ldLm9iajtcclxuICAgICAgICAgICAgICAgIGlmICghb2JqLnBvc2l0aW9uKSBvYmoucG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLnN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLnN0YXJ0ID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLmVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoucG9zaXRpb24uZW5kID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhcnRBdCA9IGF0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UG9zdGlvbkJ5Q2hhcnRBdChzdGFydFBvc2l0aW9uOiBBY2VBamF4LlBvc2l0aW9uLCBzdGFydEF0OiBudW1iZXIsIGF0OiBudW1iZXIpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0geyByb3c6IHN0YXJ0UG9zaXRpb24ucm93LCBjb2x1bW46IHN0YXJ0UG9zaXRpb24uY29sdW1uIH07XHJcbiAgICAgICAgICAgIHZhciBjdXJDaGFyID0gc3RhcnRBdDtcclxuICAgICAgICAgICAgd2hpbGUgKGN1ckNoYXIgPCBhdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dC5jaGFyQXQoY3VyQ2hhcikgPT0gU3VydmV5VGV4dFdvcmtlci5uZXdMaW5lQ2hhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3crKztcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuY29sdW1uID0gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmNvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VyQ2hhcisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0QXRBcnJheShvYmplY3RzOiBhbnlbXSk6IGFueVtdIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBvYmplY3RzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG9iai5wb3M7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBvcykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IGF0OiBwb3Muc3RhcnQsIG9iajogb2JqIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcy5lbmQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBhdDogcG9zLmVuZCwgb2JqOiBvYmogfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KChlbDEsIGVsMikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsMS5hdCA+IGVsMi5hdCkgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwxLmF0IDwgZWwyLmF0KSByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VmFsdWVUZXh0KG5ld1ZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmdpZnkobmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHN0cmluZ2lmeShvYmo6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3VydmV5SlNPTjUoKS5zdHJpbmdpZnkob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0RWRpdG9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInBhZ2VzRWRpdG9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRleHRXb3JrZXIudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5RWRpdG9yIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHVwZGF0ZVRleHRUaW1lb3V0OiBudW1iZXIgPSAxMDAwO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZGVmYXVsdE5ld1N1cnZleVRleHQ6IHN0cmluZyA9IFwieyBwYWdlczogWyB7IG5hbWU6ICdwYWdlMScsIHF1ZXN0aW9uczogW3sgdHlwZTogJ3RleHQnLCBuYW1lOiAncXVlc3Rpb24xJyB9XSB9XSB9XCI7XHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5anNTZWxlY3RlZE9iajogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlqc0V4YW1wbGU6IEhUTUxFbGVtZW50O1xyXG4gICAgICAgIHByaXZhdGUganNvbkVkaXRvcjogQWNlQWpheC5FZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1Byb2Nlc3NpbmdJbW1lZGlhdGVseTogYm9vbGVhbjtcclxuICAgICAgICBwcml2YXRlIHN1cnZleUVkaXRvcjogU3VydmV5T2JqZWN0RWRpdG9yO1xyXG4gICAgICAgIHByaXZhdGUgcGFnZUVkaXRvcjogU3VydmV5T2JqZWN0RWRpdG9yO1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25FZGl0b3I6IFN1cnZleU9iamVjdEVkaXRvcjtcclxuICAgICAgICBwcml2YXRlIHBhZ2VzRWRpdG9yOiBTdXJ2ZXlQYWdlc0VkaXRvcjtcclxuICAgICAgICBwcml2YXRlIHRleHRXb3JrZXI6IFN1cnZleVRleHRXb3JrZXI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvblR5cGVzOiBzdHJpbmdbXTtcclxuICAgICAgICBrb1NlbGVjdGVkUGFnZTogYW55O1xyXG4gICAgICAgIGtvU2VsZWN0ZWRRdWVzdGlvbjogYW55O1xyXG4gICAgICAgIGtvU2VsZWN0ZWRRdWVzdGlvblR5cGU6IGFueTtcclxuICAgICAgICBrb1Nob3dMaXZlU3VydmV5OiBhbnk7XHJcbiAgICAgICAgc2hvd0xpdmVTdXJ2ZXlDbGljazogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihyZW5kZXJlZEVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkUGFnZSA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZFF1ZXN0aW9uID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblR5cGVzID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5nZXRBbGxUeXBlcygpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRRdWVzdGlvblR5cGUgPSBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb25UeXBlc1swXSk7XHJcbiAgICAgICAgICAgIHRoaXMua29TaG93TGl2ZVN1cnZleSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd0xpdmVTdXJ2ZXlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb1Nob3dMaXZlU3VydmV5KCFzZWxmLmtvU2hvd0xpdmVTdXJ2ZXkoKSk7IH07XHJcbiAgICAgICAgICAgIHRoaXMua29TaG93TGl2ZVN1cnZleS5zdWJzY3JpYmUoKG5ld1ZhbHVlOiBhbnkpID0+IHsgc2VsZi5zaG93TGl2ZVN1cnZleShuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUVkaXRvciA9IG5ldyBTdXJ2ZXlPYmplY3RFZGl0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFZGl0b3IudGl0bGUgPSBcIlN1cnZleSBQcm9wZXJ0aWVzXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RWRpdG9yLmtvU2hvd1Byb3BlcnRpZXMoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQob3B0aW9ucy5wcm9wZXJ0eSwgb3B0aW9ucy5vYmplY3QsIG9wdGlvbnMubmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlRWRpdG9yID0gbmV3IFN1cnZleU9iamVjdEVkaXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkKG9wdGlvbnMucHJvcGVydHksIG9wdGlvbnMub2JqZWN0LCBvcHRpb25zLm5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25FZGl0b3IgPSBuZXcgU3VydmV5T2JqZWN0RWRpdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25FZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkKG9wdGlvbnMucHJvcGVydHksIG9wdGlvbnMub2JqZWN0LCBvcHRpb25zLm5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IgPSBuZXcgU3VydmV5UGFnZXNFZGl0b3IoKCkgPT4geyBzZWxmLmFkZFBhZ2UoKTsgfSwgKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB7IHNlbGYubW92ZVRvT2JqZWN0KHBhZ2UpO30pO1xyXG5cclxuICAgICAgICAgICAgaWYgKHJlbmRlcmVkRWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXIocmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dFdvcmtlciAhPSBudWxsID8gdGhpcy50ZXh0V29ya2VyLnN1cnZleSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW5kZXIoZWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50ICYmIHR5cGVvZiBlbGVtZW50ID09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVkRWxlbWVudDtcclxuICAgICAgICAgICAgaWYgKCFlbGVtZW50KSByZXR1cm47XHJcbiAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGVFZGl0b3Iua28uaHRtbDtcclxuICAgICAgICAgICAgc2VsZi5hcHBseUJpbmRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5qc29uRWRpdG9yICE9IG51bGwgPyB0aGlzLmpzb25FZGl0b3IuZ2V0VmFsdWUoKSA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGV4dEFuZFByb2Nlc3MoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRJZCA+IDApIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9jZXNzSnNvbih0ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZXh0VmFsdWUodmFsdWUsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0VGV4dCh2YWx1ZTogc3RyaW5nLCBmaW5kVGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IuZmluZChmaW5kVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRQYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0V29ya2VyID09IG51bGwgfHwgIXRoaXMudGV4dFdvcmtlci5pc0pzb25Db3JyZWN0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gdGhpcy5nZXROZXdOYW1lKHRoaXMudGV4dFdvcmtlci5zdXJ2ZXkucGFnZXMsIFwicGFnZVwiKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0V29ya2VyLmFkZFBhZ2UobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dCh0aGlzLnRleHRXb3JrZXIudGV4dCwgbmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbigpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmtvU2VsZWN0ZWRQYWdlKCk7XHJcbiAgICAgICAgICAgIGlmIChwYWdlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSB0aGlzLmdldE5ld05hbWUodGhpcy50ZXh0V29ya2VyLnN1cnZleS5nZXRBbGxRdWVzdGlvbnMoKSwgXCJxdWVzdGlvblwiKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0V29ya2VyLmFkZFF1ZXN0aW9uKHBhZ2UsIFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24odGhpcy5rb1NlbGVjdGVkUXVlc3Rpb25UeXBlKCksIG5hbWUpKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZXh0KHRoaXMudGV4dFdvcmtlci50ZXh0LCBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvblByb3BlcnR5VmFsdWVDaGFuZ2VkKHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvYmplY3Q6IGFueSwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIW9iamVjdCB8fCAhb2JqZWN0W1wicG9zXCJdKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpc0RlZmF1bHQgPSBwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIGlmIChpc0RlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSBvYmplY3RbcHJvcGVydHkubmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3RbcHJvcGVydHkubmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnRleHRXb3JrZXIuY2hhbmdlUHJvcGVydHkob2JqZWN0LCBwcm9wZXJ0eS5uYW1lLCBuZXdWYWx1ZSwgaXNEZWZhdWx0KTtcclxuICAgICAgICAgICAgdGhpcy5zZXRUZXh0KHRoaXMudGV4dFdvcmtlci50ZXh0LCBvYmplY3QubmFtZSk7IC8vVE9ET1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldFRleHRWYWx1ZSh2YWx1ZTogc3RyaW5nLCBwb3NpdGlvbjogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmpzb25FZGl0b3IgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFZhbHVlKHZhbHVlLCBwb3NpdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0pzb24odmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXBwbHlCaW5kaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBrby5jbGVhbk5vZGUodGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yID0gYWNlLmVkaXQoXCJzdXJ2ZXlqc0VkaXRvclwiKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlqc1NlbGVjdGVkT2JqID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc1NlbGVjdGVkT2JqXCIpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleWpzRXhhbXBsZSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNFeGFtcGxlXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmluaXRKc29uRWRpdG9yKCk7XHJcbiAgICAgICAgICAgIFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIgPSB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5kb2MuZ2V0TmV3TGluZUNoYXJhY3RlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGluaXRKc29uRWRpdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5zZXRUaGVtZShcImFjZS90aGVtZS9tb25va2FpXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvanNvblwiKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFNob3dQcmludE1hcmdpbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5nZXRTZXNzaW9uKCkub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkpzb25FZGl0b3JDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2VsZWN0aW9uLm9uKFwiY2hhbmdlQ3Vyc29yXCIsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Kc29uRWRpdG9yQ3Vyc29yQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5zZXRVc2VXb3JrZXIodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0VGV4dChTdXJ2ZXlFZGl0b3IuZGVmYXVsdE5ld1N1cnZleVRleHQsIFwibmFtZTogJ3F1ZXN0aW9uMSdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdGltZW91dElkOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBwcml2YXRlIG9uSnNvbkVkaXRvckNoYW5nZWQoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZW91dElkID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh0aGlzLnRpbWVvdXRJZCk7XHJcbiAgICAgICAgICAgIH0gICBcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dElkID0gLTE7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudGltZW91dElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5wcm9jZXNzSnNvbihzZWxmLnRleHQpO1xyXG4gICAgICAgICAgICAgICAgfSwgU3VydmV5RWRpdG9yLnVwZGF0ZVRleHRUaW1lb3V0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uSnNvbkVkaXRvckN1cnNvckNoYW5nZWQoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dFdvcmtlciA9PSBudWxsIHx8ICF0aGlzLnRleHRXb3JrZXIuaXNKc29uQ29ycmVjdCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb24gPSB0aGlzLmpzb25FZGl0b3IuZ2V0Q3Vyc29yUG9zaXRpb24oKTtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSB0aGlzLnRleHRXb3JrZXIuZ2V0Q3VycmVudFN1cnZleU9iamVjdHMocG9zaXRpb24ucm93LCBwb3NpdGlvbi5jb2x1bW4pO1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9ianNbaV0uZ2V0VHlwZSgpID09IFwicGFnZVwiKSBwYWdlID0gb2Jqc1tpXVxyXG4gICAgICAgICAgICAgICAgZWxzZSBxdWVzdGlvbiA9IG9ianNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkUXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VFZGl0b3Iuc2VsZWN0ZWRPYmplY3QgPSBwYWdlO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgaWYgKHBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZUVkaXRvci50aXRsZSA9IFwiUGFnZSBwcm9wZXJ0aWVzOiBwYWdlXCIgKyAodGhpcy50ZXh0V29ya2VyLnN1cnZleS5wYWdlcy5pbmRleE9mKHBhZ2UpICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbkVkaXRvci5zZWxlY3RlZE9iamVjdCA9IHF1ZXN0aW9uO1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25FZGl0b3IudGl0bGUgPSBcIlF1ZXN0aW9uIHByb3BlcnRpZXM6IFwiICsgcXVlc3Rpb24ubmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1vdmVUb09iamVjdChvYmo6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgcG9zID0gb2JqW1wicG9zaXRpb25cIl07XHJcbiAgICAgICAgICAgIGlmICghcG9zKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5tb3ZlQ3Vyc29yVG8ocG9zLnN0YXJ0LnJvdywgcG9zLnN0YXJ0LmNvbHVtbik7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5zZWxlY3Rpb24uY2xlYXJTZWxlY3Rpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwcm9jZXNzSnNvbih0ZXh0OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5zaG93TGl2ZVN1cnZleSh0aGlzLmtvU2hvd0xpdmVTdXJ2ZXkoKSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RWRpdG9yLnNlbGVjdGVkT2JqZWN0ID0gdGhpcy50ZXh0V29ya2VyLnN1cnZleTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5zdXJ2ZXkgPSB0aGlzLnRleHRXb3JrZXIuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLm9uSnNvbkVkaXRvckN1cnNvckNoYW5nZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5zZXRBbm5vdGF0aW9ucyh0aGlzLmNyZWF0ZUFubm90YXRpb25zKHRleHQsIHRoaXMudGV4dFdvcmtlci5lcnJvcnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93TGl2ZVN1cnZleShzaG93U3VydmV5OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmIChzaG93U3VydmV5ICYmIHRoaXMuc3VydmV5anNFeGFtcGxlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRleHRXb3JrZXIuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzRXhhbXBsZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlLmlubmVyVGV4dCA9IFwiUGxlYXNlIGNvcnJlY3QgdGhlIHN1cnZleSBKU09OLlwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlQW5ub3RhdGlvbnModGV4dDogc3RyaW5nLCBlcnJvcnM6IGFueVtdKTogQWNlQWpheC5Bbm5vdGF0aW9uW10ge1xyXG4gICAgICAgICAgICB2YXIgYW5ub3RhdGlvbnMgPSBuZXcgQXJyYXk8QWNlQWpheC5Bbm5vdGF0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gZXJyb3JzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFubm90YXRpb246IEFjZUFqYXguQW5ub3RhdGlvbiA9IHsgcm93OiBlcnJvci5wb3NpdGlvbi5zdGFydC5yb3csIGNvbHVtbjogZXJyb3IucG9zaXRpb24uc3RhcnQuY29sdW1uLCB0ZXh0OiBlcnJvci50ZXh0LCB0eXBlOiBcImVycm9yXCIgfTtcclxuICAgICAgICAgICAgICAgIGFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb25zO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldE5ld05hbWUob2JqczogQXJyYXk8YW55PiwgYmFzZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBoYXNoID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaGFzaFtvYmpzW2ldLm5hbWVdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbnVtID0gMTtcclxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaGFzaFtiYXNlTmFtZSArIG51bS50b1N0cmluZygpXSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBudW0rKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmFzZU5hbWUgKyBudW0udG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhpcyBmaWxlIGlzIGJhc2VkIG9uIEpTT041LCBodHRwOi8vanNvbjUub3JnL1xuLy8gVGhlIG1vZGlmaWNhdGlvbiBmb3IgZ2V0dGluZyBvYmplY3QgYW5kIHByb3BlcnRpZXMgbG9jYXRpb24gJ2F0JyB3ZXJlIG1hZGVuLlxyXG5cclxubW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5SlNPTjUge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcG9zaXRpb25OYW1lID0gXCJwb3NcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBlc2NhcGVlID0ge1xuICAgICAgICAgICAgXCInXCI6IFwiJ1wiLFxuICAgICAgICAgICAgJ1wiJzogJ1wiJyxcbiAgICAgICAgICAgICdcXFxcJzogJ1xcXFwnLFxuICAgICAgICAgICAgJy8nOiAnLycsXG4gICAgICAgICAgICAnXFxuJzogJycsICAgICAgIC8vIFJlcGxhY2UgZXNjYXBlZCBuZXdsaW5lcyBpbiBzdHJpbmdzIHcvIGVtcHR5IHN0cmluZ1xuICAgICAgICAgICAgYjogJ1xcYicsXG4gICAgICAgICAgICBmOiAnXFxmJyxcbiAgICAgICAgICAgIG46ICdcXG4nLFxuICAgICAgICAgICAgcjogJ1xccicsXG4gICAgICAgICAgICB0OiAnXFx0J1xuICAgICAgICB9O1xuICAgICAgICBwcml2YXRlIHN0YXRpYyB3cyA9IFtcbiAgICAgICAgICAgICcgJyxcbiAgICAgICAgICAgICdcXHQnLFxuICAgICAgICAgICAgJ1xccicsXG4gICAgICAgICAgICAnXFxuJyxcbiAgICAgICAgICAgICdcXHYnLFxuICAgICAgICAgICAgJ1xcZicsXG4gICAgICAgICAgICAnXFx4QTAnLFxuICAgICAgICAgICAgJ1xcdUZFRkYnXG4gICAgICAgIF07XG4gICAgICAgIHByaXZhdGUgZW5kQXQ6IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIGF0OiBudW1iZXI7ICAgICAvLyBUaGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgY2hhcmFjdGVyXG4gICAgICAgIHByaXZhdGUgY2g6IGFueTsgICAgIC8vIFRoZSBjdXJyZW50IGNoYXJhY3RlclxuICAgICAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcbiAgICAgICAgcHJpdmF0ZSBwYXJzZVR5cGU6IG51bWJlcjsgLy8gMCAtIHN0YWRhcmQsIDEgLSBnZXQgaW5mb3JtYXRpb24gYWJvdXQgb2JqZWN0cywgMiAtIGdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgcHJvcGVydGllc1xuICAgICAgICBjb25zdHJ1Y3RvcihwYXJzZVR5cGU6IG51bWJlciA9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZVR5cGUgPSBwYXJzZVR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBwYXJzZShzb3VyY2U6IGFueSwgcmV2aXZlcjogYW55ID0gbnVsbCwgc3RhcnRGcm9tOiBudW1iZXIgPSAwLCBlbmRBdDogbnVtYmVyID0gLTEpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xuXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBTdHJpbmcoc291cmNlKTtcbiAgICAgICAgICAgIHRoaXMuYXQgPSBzdGFydEZyb207XG4gICAgICAgICAgICB0aGlzLmVuZEF0ID0gZW5kQXQ7XG4gICAgICAgICAgICB0aGlzLmNoID0gJyAnO1xuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy52YWx1ZSgpO1xuICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiU3ludGF4IGVycm9yXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIG5ldyBzdHJ1Y3R1cmUsXG4gICAgICAgICAgICAvLyBwYXNzaW5nIGVhY2ggbmFtZS92YWx1ZSBwYWlyIHRvIHRoZSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZVxuICAgICAgICAgICAgLy8gdHJhbnNmb3JtYXRpb24sIHN0YXJ0aW5nIHdpdGggYSB0ZW1wb3Jhcnkgcm9vdCBvYmplY3QgdGhhdCBob2xkcyB0aGUgcmVzdWx0XG4gICAgICAgICAgICAvLyBpbiBhbiBlbXB0eSBrZXkuIElmIHRoZXJlIGlzIG5vdCBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHNpbXBseSByZXR1cm4gdGhlXG4gICAgICAgICAgICAvLyByZXN1bHQuXG5cbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJyA/IChmdW5jdGlvbiB3YWxrKGhvbGRlciwga2V5KSB7XG4gICAgICAgICAgICAgICAgdmFyIGssIHYsIHZhbHVlID0gaG9sZGVyW2tleV07XG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gdjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVba107XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcbiAgICAgICAgICAgIH0gKHsgJyc6IHJlc3VsdCB9LCAnJykpIDogcmVzdWx0O1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgZXJyb3IobTogc3RyaW5nKSB7XG4gICAgICAgICAgICAvLyBDYWxsIGVycm9yIHdoZW4gc29tZXRoaW5nIGlzIHdyb25nLlxuICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IFN5bnRheEVycm9yKCk7XG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbTtcbiAgICAgICAgICAgIGVycm9yW1wiYXRcIl0gPSB0aGlzLmF0O1xuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBuZXh0KGM6IGFueSA9IG51bGwpIHtcbiAgICAgICAgICAgIC8vIElmIGEgYyBwYXJhbWV0ZXIgaXMgcHJvdmlkZWQsIHZlcmlmeSB0aGF0IGl0IG1hdGNoZXMgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxuICAgICAgICAgICAgaWYgKGMgJiYgYyAhPT0gdGhpcy5jaCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCAnXCIgKyBjICsgXCInIGluc3RlYWQgb2YgJ1wiICsgdGhpcy5jaCArIFwiJ1wiKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIC8vIEdldCB0aGUgdGhpcy5uZXh0IGNoYXJhY3Rlci4gV2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBjaGFyYWN0ZXJzLFxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcuXG4gICAgICAgICAgICB0aGlzLmNoID0gdGhpcy5jaGFydEF0KCk7XG4gICAgICAgICAgICB0aGlzLmF0ICs9IDE7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaDtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIHBlZWsoKSB7XG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRoaXMubmV4dCBjaGFyYWN0ZXIgd2l0aG91dCBjb25zdW1pbmcgaXQgb3JcbiAgICAgICAgICAgIC8vIGFzc2lnbmluZyBpdCB0byB0aGUgdGhpcy5jaCB2YXJhaWJsZS5cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYXJ0QXQoKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGNoYXJ0QXQoKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5lbmRBdCA+IC0xICYmIHRoaXMuYXQgPj0gdGhpcy5lbmRBdCkgcmV0dXJuICcnO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5jaGFyQXQodGhpcy5hdCk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmaWVyKCkge1xuICAgICAgICAgICAgLy8gUGFyc2UgYW4gaWRlbnRpZmllci4gTm9ybWFsbHksIHJlc2VydmVkIHdvcmRzIGFyZSBkaXNhbGxvd2VkIGhlcmUsIGJ1dCB3ZVxuICAgICAgICAgICAgLy8gb25seSB1c2UgdGhpcyBmb3IgdW5xdW90ZWQgb2JqZWN0IGtleXMsIHdoZXJlIHJlc2VydmVkIHdvcmRzIGFyZSBhbGxvd2VkLFxuICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgY2hlY2sgZm9yIHRob3NlIGhlcmUuIFJlZmVyZW5jZXM6XG4gICAgICAgICAgICAvLyAtIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDcuNlxuICAgICAgICAgICAgLy8gLSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X0d1aWRlL0NvcmVfTGFuZ3VhZ2VfRmVhdHVyZXMjVmFyaWFibGVzXG4gICAgICAgICAgICAvLyAtIGh0dHA6Ly9kb2NzdG9yZS5taWsudWEvb3JlbGx5L3dlYnByb2cvanNjcmlwdC9jaDAyXzA3Lmh0bVxuICAgICAgICAgICAgLy8gVE9ETyBJZGVudGlmaWVycyBjYW4gaGF2ZSBVbmljb2RlIFwibGV0dGVyc1wiIGluIHRoZW07IGFkZCBzdXBwb3J0IGZvciB0aG9zZS5cbiAgICAgICAgICAgIHZhciBrZXkgPSB0aGlzLmNoO1xuXG4gICAgICAgICAgICAvLyBJZGVudGlmaWVycyBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIsIF8gb3IgJC5cbiAgICAgICAgICAgIGlmICgodGhpcy5jaCAhPT0gJ18nICYmIHRoaXMuY2ggIT09ICckJykgJiZcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA8ICdhJyB8fCB0aGlzLmNoID4gJ3onKSAmJlxuICAgICAgICAgICAgICAgICh0aGlzLmNoIDwgJ0EnIHx8IHRoaXMuY2ggPiAnWicpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBpZGVudGlmaWVyXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBTdWJzZXF1ZW50IGNoYXJhY3RlcnMgY2FuIGNvbnRhaW4gZGlnaXRzLlxuICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIChcbiAgICAgICAgICAgICAgICB0aGlzLmNoID09PSAnXycgfHwgdGhpcy5jaCA9PT0gJyQnIHx8XG4gICAgICAgICAgICAgICAgKHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ3onKSB8fFxuICAgICAgICAgICAgICAgICh0aGlzLmNoID49ICdBJyAmJiB0aGlzLmNoIDw9ICdaJykgfHxcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpKSkge1xuICAgICAgICAgICAgICAgIGtleSArPSB0aGlzLmNoO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4ga2V5O1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgbnVtYmVyKCkge1xuXG4gICAgICAgICAgICAvLyBQYXJzZSBhIG51bWJlciB2YWx1ZS5cblxuICAgICAgICAgICAgdmFyIG51bWJlcixcbiAgICAgICAgICAgICAgICBzaWduID0gJycsXG4gICAgICAgICAgICAgICAgc3RyaW5nID0gJycsXG4gICAgICAgICAgICAgICAgYmFzZSA9IDEwO1xuXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy0nIHx8IHRoaXMuY2ggPT09ICcrJykge1xuICAgICAgICAgICAgICAgIHNpZ24gPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCh0aGlzLmNoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gc3VwcG9ydCBmb3IgSW5maW5pdHkgKGNvdWxkIHR3ZWFrIHRvIGFsbG93IG90aGVyIHdvcmRzKTpcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnSScpIHtcbiAgICAgICAgICAgICAgICBudW1iZXIgPSB0aGlzLndvcmQoKTtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG51bWJlciAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtYmVyKSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHdvcmQgZm9yIG51bWJlcicpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXR1cm4gKHNpZ24gPT09ICctJykgPyAtbnVtYmVyIDogbnVtYmVyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBzdXBwb3J0IGZvciBOYU5cbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnTicpIHtcbiAgICAgICAgICAgICAgICBudW1iZXIgPSB0aGlzLndvcmQoKTtcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG51bWJlcikpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcignZXhwZWN0ZWQgd29yZCB0byBiZSBOYU4nKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIHNpZ24gYXMgLU5hTiBhbHNvIGlzIE5hTlxuICAgICAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnMCcpIHtcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3gnIHx8IHRoaXMuY2ggPT09ICdYJykge1xuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSAxNjtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ09jdGFsIGxpdGVyYWwnKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHN3aXRjaCAoYmFzZSkge1xuICAgICAgICAgICAgICAgIGNhc2UgMTA6XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gJy4nO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdlJyB8fCB0aGlzLmNoID09PSAnRScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy0nIHx8IHRoaXMuY2ggPT09ICcrJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxNjpcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknIHx8IHRoaXMuY2ggPj0gJ0EnICYmIHRoaXMuY2ggPD0gJ0YnIHx8IHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ2YnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoc2lnbiA9PT0gJy0nKSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyID0gLXN0cmluZztcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgbnVtYmVyID0gK3N0cmluZztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShudW1iZXIpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBudW1iZXJcIik7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiBudW1iZXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcoKSB7XG5cbiAgICAgICAgICAgIC8vIFBhcnNlIGEgc3RyaW5nIHZhbHVlLlxuXG4gICAgICAgICAgICB2YXIgaGV4LFxuICAgICAgICAgICAgICAgIGksXG4gICAgICAgICAgICAgICAgc3RyaW5nID0gJycsXG4gICAgICAgICAgICAgICAgZGVsaW0sICAgICAgLy8gZG91YmxlIHF1b3RlIG9yIHNpbmdsZSBxdW90ZVxuICAgICAgICAgICAgICAgIHVmZmZmO1xuXG4gICAgICAgICAgICAvLyBXaGVuIHBhcnNpbmcgZm9yIHN0cmluZyB2YWx1ZXMsIHdlIG11c3QgbG9vayBmb3IgJyBvciBcIiBhbmQgXFwgY2hhcmFjdGVycy5cblxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcIicgfHwgdGhpcy5jaCA9PT0gXCInXCIpIHtcbiAgICAgICAgICAgICAgICBkZWxpbSA9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSBkZWxpbSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXFxcJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3UnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWZmZmYgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA0OyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGV4ID0gcGFyc2VJbnQodGhpcy5uZXh0KCksIDE2KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShoZXgpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IHVmZmZmICogMTYgKyBoZXg7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHVmZmZmKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wZWVrKCkgPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXG4nKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1bmVzY2FwZWQgbmV3bGluZXMgYXJlIGludmFsaWQ7IHNlZTpcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2VlbWsvanNvbjUvaXNzdWVzLzI0XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHRoaXMgZmVlbHMgc3BlY2lhbC1jYXNlZDsgYXJlIHRoZXJlIG90aGVyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIHVuZXNjYXBlZCBjaGFycz9cbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIHN0cmluZ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGlubGluZUNvbW1lbnQoKSB7XG5cbiAgICAgICAgICAgIC8vIFNraXAgYW4gaW5saW5lIGNvbW1lbnQsIGFzc3VtaW5nIHRoaXMgaXMgb25lLiBUaGUgY3VycmVudCBjaGFyYWN0ZXIgc2hvdWxkXG4gICAgICAgICAgICAvLyBiZSB0aGUgc2Vjb25kIC8gY2hhcmFjdGVyIGluIHRoZSAvLyBwYWlyIHRoYXQgYmVnaW5zIHRoaXMgaW5saW5lIGNvbW1lbnQuXG4gICAgICAgICAgICAvLyBUbyBmaW5pc2ggdGhlIGlubGluZSBjb21tZW50LCB3ZSBsb29rIGZvciBhIG5ld2xpbmUgb3IgdGhlIGVuZCBvZiB0aGUgdGV4dC5cblxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcvJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYW4gaW5saW5lIGNvbW1lbnRcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1xcbicgfHwgdGhpcy5jaCA9PT0gJ1xccicpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLmNoKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGJsb2NrQ29tbWVudCgpIHtcblxuICAgICAgICAgICAgLy8gU2tpcCBhIGJsb2NrIGNvbW1lbnQsIGFzc3VtaW5nIHRoaXMgaXMgb25lLiBUaGUgY3VycmVudCBjaGFyYWN0ZXIgc2hvdWxkIGJlXG4gICAgICAgICAgICAvLyB0aGUgKiBjaGFyYWN0ZXIgaW4gdGhlIC8qIHBhaXIgdGhhdCBiZWdpbnMgdGhpcyBibG9jayBjb21tZW50LlxuICAgICAgICAgICAgLy8gVG8gZmluaXNoIHRoZSBibG9jayBjb21tZW50LCB3ZSBsb29rIGZvciBhbiBlbmRpbmcgKi8gcGFpciBvZiBjaGFyYWN0ZXJzLFxuICAgICAgICAgICAgLy8gYnV0IHdlIGFsc28gd2F0Y2ggZm9yIHRoZSBlbmQgb2YgdGV4dCBiZWZvcmUgdGhlIGNvbW1lbnQgaXMgdGVybWluYXRlZC5cblxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcqJykge1xuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYSBibG9jayBjb21tZW50XCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPT09ICcqJykge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJyonKTtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcvJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLmNoKTtcblxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVudGVybWluYXRlZCBibG9jayBjb21tZW50XCIpO1xuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgY29tbWVudCgpIHtcblxuICAgICAgICAgICAgLy8gU2tpcCBhIGNvbW1lbnQsIHdoZXRoZXIgaW5saW5lIG9yIGJsb2NrLWxldmVsLCBhc3N1bWluZyB0aGlzIGlzIG9uZS5cbiAgICAgICAgICAgIC8vIENvbW1lbnRzIGFsd2F5cyBiZWdpbiB3aXRoIGEgLyBjaGFyYWN0ZXIuXG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGEgY29tbWVudFwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhpcy5uZXh0KCcvJyk7XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmlubGluZUNvbW1lbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJyonKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja0NvbW1lbnQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVucmVjb2duaXplZCBjb21tZW50XCIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgd2hpdGUoKSB7XG5cbiAgICAgICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhbmQgY29tbWVudHMuXG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgd2UncmUgZGV0ZWN0aW5nIGNvbW1lbnRzIGJ5IG9ubHkgYSBzaW5nbGUgLyBjaGFyYWN0ZXIuXG4gICAgICAgICAgICAvLyBUaGlzIHdvcmtzIHNpbmNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgYXJlIG5vdCB2YWxpZCBKU09OKDUpLCBidXQgdGhpcyB3aWxsXG4gICAgICAgICAgICAvLyBicmVhayBpZiB0aGVyZSBhcmUgb3RoZXIgdmFsaWQgdmFsdWVzIHRoYXQgYmVnaW4gd2l0aCBhIC8gY2hhcmFjdGVyIVxuXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tZW50KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChTdXJ2ZXlKU09ONS53cy5pbmRleE9mKHRoaXMuY2gpID49IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIHdvcmQoKTogYW55IHtcblxuICAgICAgICAgICAgLy8gdHJ1ZSwgZmFsc2UsIG9yIG51bGwuXG5cbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5jaCkge1xuICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3QnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdyJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgY2FzZSAnZic6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZicpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2EnKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdsJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgncycpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIGNhc2UgJ24nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd1Jyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgY2FzZSAnSSc6XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnSScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdmJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnaScpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdpJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3knKTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xuICAgICAgICAgICAgICAgIGNhc2UgJ04nOlxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ04nKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdhJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnTicpO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgJ1wiICsgdGhpcy5jaCArIFwiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGFycmF5KCkge1xuXG4gICAgICAgICAgICAvLyBQYXJzZSBhbiBhcnJheSB2YWx1ZS5cblxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XG5cbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnWycpIHtcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ1snKTtcbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICddJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCddJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7ICAgLy8gUG90ZW50aWFsbHkgZW1wdHkgYXJyYXlcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvLyBFUzUgYWxsb3dzIG9taXR0aW5nIGVsZW1lbnRzIGluIGFycmF5cywgZS5nLiBbLF0gYW5kXG4gICAgICAgICAgICAgICAgICAgIC8vIFssbnVsbF0uIFdlIGRvbid0IGFsbG93IHRoaXMgaW4gSlNPTjUuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJNaXNzaW5nIGFycmF5IGVsZW1lbnRcIik7XG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudmFsdWUoKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGNvbW1hIGFmdGVyIHRoaXMgdmFsdWUsIHRoaXMgbmVlZHMgdG9cbiAgICAgICAgICAgICAgICAgICAgLy8gYmUgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnXScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBhcnJheVwiKTtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIG9iamVjdCgpIHtcblxuICAgICAgICAgICAgLy8gUGFyc2UgYW4gb2JqZWN0IHZhbHVlLlxuXG4gICAgICAgICAgICB2YXIga2V5LFxuICAgICAgICAgICAgICAgIHN0YXJ0LFxuICAgICAgICAgICAgICAgIGlzRmlyc3RQcm9wZXJ0eSA9IHRydWUsXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0ge307XG4gICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XG4gICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0gPSB7IHN0YXJ0OiB0aGlzLmF0IC0gMSB9O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd7Jykge1xuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgneycpO1xuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMuYXQgLSAxO1xuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnfScpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnfScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDsgICAvLyBQb3RlbnRpYWxseSBlbXB0eSBvYmplY3RcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIC8vIEtleXMgY2FuIGJlIHVucXVvdGVkLiBJZiB0aGV5IGFyZSwgdGhleSBuZWVkIHRvIGJlXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhbGlkIEpTIGlkZW50aWZpZXJzLlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1wiJyB8fCB0aGlzLmNoID09PSBcIidcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5zdHJpbmcoKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuaWRlbnRpZmllcigpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldID0geyBzdGFydDogc3RhcnQsIHZhbHVlU3RhcnQ6IHRoaXMuYXQgfTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJzonKTtcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB0aGlzLnZhbHVlKCk7XG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZCA9IHN0YXJ0O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBjb21tYSBhZnRlciB0aGlzIHBhaXIsIHRoaXMgbmVlZHMgdG8gYmVcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGVuZCBvZiB0aGUgb2JqZWN0LlxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJywnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQtLTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnfScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdLmVuZCA9IHRoaXMuYXQgLSAxO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxICYmICFpc0ZpcnN0UHJvcGVydHkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0uZW5kLS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcsJyk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcbiAgICAgICAgICAgICAgICAgICAgaXNGaXJzdFByb3BlcnR5ID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBvYmplY3RcIik7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSB2YWx1ZSgpOiBhbnkge1xuXG4gICAgICAgICAgICAvLyBQYXJzZSBhIEpTT04gdmFsdWUuIEl0IGNvdWxkIGJlIGFuIG9iamVjdCwgYW4gYXJyYXksIGEgc3RyaW5nLCBhIG51bWJlcixcbiAgICAgICAgICAgIC8vIG9yIGEgd29yZC5cblxuICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmNoKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAneyc6XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdCgpO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1snOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheSgpO1xuICAgICAgICAgICAgICAgIGNhc2UgJ1wiJzpcbiAgICAgICAgICAgICAgICBjYXNlIFwiJ1wiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmcoKTtcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcbiAgICAgICAgICAgICAgICBjYXNlICcuJzpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyKCk7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknID8gdGhpcy5udW1iZXIoKSA6IHRoaXMud29yZCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSByZXBsYWNlcjogYW55O1xuICAgICAgICBwcml2YXRlIGluZGVudFN0cjogc3RyaW5nO1xuICAgICAgICBwcml2YXRlIG9ialN0YWNrO1xuXG4gICAgICAgIHB1YmxpYyBzdHJpbmdpZnkob2JqOiBhbnksIHJlcGxhY2VyOiBhbnkgPSBudWxsLCBzcGFjZTogYW55ID0gbnVsbCkge1xuICAgICAgICAgICAgaWYgKHJlcGxhY2VyICYmICh0eXBlb2YgKHJlcGxhY2VyKSAhPT0gXCJmdW5jdGlvblwiICYmICF0aGlzLmlzQXJyYXkocmVwbGFjZXIpKSkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVwbGFjZXIgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5Jyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgICAgICAgICB0aGlzLmluZGVudFN0ciA9IHRoaXMuZ2V0SW5kZW50KHNwYWNlKTtcbiAgICAgICAgICAgIHRoaXMub2JqU3RhY2sgPSBbXTtcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZS4uLndoZW4gdW5kZWZpbmVkIGlzIHVzZWQgaW5zaWRlIG9mXG4gICAgICAgICAgICAvLyBhIGNvbXBvdW5kIG9iamVjdC9hcnJheSwgcmV0dXJuIG51bGwuXG4gICAgICAgICAgICAvLyBidXQgd2hlbiB0b3AtbGV2ZWwsIHJldHVybiB1bmRlZmluZWRcbiAgICAgICAgICAgIHZhciB0b3BMZXZlbEhvbGRlciA9IHsgXCJcIjogb2JqIH07XG4gICAgICAgICAgICBpZiAob2JqID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQodG9wTGV2ZWxIb2xkZXIsICcnLCB0cnVlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RyaW5naWZ5KHRvcExldmVsSG9sZGVyLCAnJywgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJpdmF0ZSBnZXRJbmRlbnQoc3BhY2U6IGFueSk6IHN0cmluZyB7XG4gICAgICAgICAgICBpZiAoc3BhY2UpIHtcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzcGFjZTtcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIiAmJiBzcGFjZSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1ha2VJbmRlbnQoXCIgXCIsIHNwYWNlLCB0cnVlKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcbiAgICAgICAgfVxuICAgICAgICBwcml2YXRlIGdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXI6IGFueSwga2V5OiBhbnksIGlzVG9wTGV2ZWw6IGJvb2xlYW4pIHtcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xuXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSB3aXRoIGl0cyB0b0pTT04gdmFsdWUgZmlyc3QsIGlmIHBvc3NpYmxlXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUudG9KU09OICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyLXN1cHBsaWVkIHJlcGxhY2VyIGlmIGEgZnVuY3Rpb24sIGNhbGwgaXQuIElmIGl0J3MgYW4gYXJyYXksIGNoZWNrIG9iamVjdHMnIHN0cmluZyBrZXlzIGZvclxuICAgICAgICAgICAgLy8gcHJlc2VuY2UgaW4gdGhlIGFycmF5IChyZW1vdmluZyB0aGUga2V5L3ZhbHVlIHBhaXIgZnJvbSB0aGUgcmVzdWx0aW5nIEpTT04gaWYgdGhlIGtleSBpcyBtaXNzaW5nKS5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMucmVwbGFjZXIpID09PSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVwbGFjZXIpIHtcbiAgICAgICAgICAgICAgICBpZiAoaXNUb3BMZXZlbCB8fCB0aGlzLmlzQXJyYXkoaG9sZGVyKSB8fCB0aGlzLnJlcGxhY2VyLmluZGV4T2Yoa2V5KSA+PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpc1dvcmRDaGFyKGNoYXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykgfHxcbiAgICAgICAgICAgICAgICAoY2hhciA+PSAnQScgJiYgY2hhciA8PSAnWicpIHx8XG4gICAgICAgICAgICAgICAgKGNoYXIgPj0gJzAnICYmIGNoYXIgPD0gJzknKSB8fFxuICAgICAgICAgICAgICAgIGNoYXIgPT09ICdfJyB8fCBjaGFyID09PSAnJCc7XG4gICAgICAgIH1cblxuICAgICAgICBwcml2YXRlIGlzV29yZFN0YXJ0KGNoYXI6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykgfHxcbiAgICAgICAgICAgICAgICAoY2hhciA+PSAnQScgJiYgY2hhciA8PSAnWicpIHx8XG4gICAgICAgICAgICAgICAgY2hhciA9PT0gJ18nIHx8IGNoYXIgPT09ICckJztcbiAgICAgICAgfVxuXG4gICAgICAgIHByaXZhdGUgaXNXb3JkKGtleTogYW55KTogYm9vbGVhbiB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNXb3JkU3RhcnQoa2V5WzBdKSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciBpID0gMSwgbGVuZ3RoID0ga2V5Lmxlbmd0aDtcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzV29yZENoYXIoa2V5W2ldKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGkrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIC8vIHBvbHlmaWxsc1xuICAgICAgICBwcml2YXRlIGlzQXJyYXkob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpc0RhdGUob2JqOiBhbnkpOiBib29sZWFuIHtcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpdmF0ZSBpc05hTih2YWw6IGFueSk6IGJvb2xlYW4ge1xuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmIHZhbCAhPT0gdmFsO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBwcml2YXRlIGNoZWNrRm9yQ2lyY3VsYXIob2JqOiBhbnkpIHtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vYmpTdGFjay5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9ialN0YWNrW2ldID09PSBvYmopIHtcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT05cIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHByaXZhdGUgbWFrZUluZGVudChzdHI6IHN0cmluZywgbnVtOiBudW1iZXIsIG5vTmV3TGluZTogYm9vbGVhbiA9IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiAoIXN0cikge1xuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaW5kZW50YXRpb24gbm8gbW9yZSB0aGFuIDEwIGNoYXJzXG4gICAgICAgICAgICBpZiAoc3RyLmxlbmd0aCA+IDEwKSB7XG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCAxMCk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBpbmRlbnQgPSBub05ld0xpbmUgPyBcIlwiIDogXCJcXG5cIjtcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpbmRlbnQgKz0gc3RyO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gaW5kZW50O1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQ29waWVkIGZyb20gQ3Jva2ZvcmQncyBpbXBsZW1lbnRhdGlvbiBvZiBKU09OXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvZTM5ZGI0YjdlNjI0OWYwNGExOTVlN2RkMDg0MGU2MTBjYzllOTQxZS9qc29uMi5qcyNMMTk1XG4gICAgICAgIC8vIEJlZ2luXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGN4ID0gL1tcXHUwMDAwXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIGVzY2FwYWJsZSA9IC9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1ldGEgPSB7IC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXG4gICAgICAgICAgICAnXFxiJzogJ1xcXFxiJyxcbiAgICAgICAgICAgICdcXHQnOiAnXFxcXHQnLFxuICAgICAgICAgICAgJ1xcbic6ICdcXFxcbicsXG4gICAgICAgICAgICAnXFxmJzogJ1xcXFxmJyxcbiAgICAgICAgICAgICdcXHInOiAnXFxcXHInLFxuICAgICAgICAgICAgJ1wiJzogJ1xcXFxcIicsXG4gICAgICAgICAgICAnXFxcXCc6ICdcXFxcXFxcXCdcbiAgICAgICAgfTtcbiAgICAgICAgcHJpdmF0ZSBlc2NhcGVTdHJpbmcoc3RyOiBzdHJpbmcpIHtcblxuICAgICAgICAgICAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xuICAgICAgICAgICAgLy8gYmFja3NsYXNoIGNoYXJhY3RlcnMsIHRoZW4gd2UgY2FuIHNhZmVseSBzbGFwIHNvbWUgcXVvdGVzIGFyb3VuZCBpdC5cbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxuICAgICAgICAgICAgLy8gc2VxdWVuY2VzLlxuICAgICAgICAgICAgU3VydmV5SlNPTjUuZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XG4gICAgICAgICAgICByZXR1cm4gU3VydmV5SlNPTjUuZXNjYXBhYmxlLnRlc3Qoc3RyKSA/ICdcIicgKyBzdHIucmVwbGFjZShTdXJ2ZXlKU09ONS5lc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XG4gICAgICAgICAgICAgICAgdmFyIGMgPSBTdXJ2ZXlKU09ONS5tZXRhW2FdO1xuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ3N0cmluZycgP1xuICAgICAgICAgICAgICAgICAgICBjIDpcbiAgICAgICAgICAgICAgICAgICAgJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XG4gICAgICAgICAgICB9KSArICdcIicgOiAnXCInICsgc3RyICsgJ1wiJztcbiAgICAgICAgfVxuICAgICAgICAvLyBFbmRcblxuICAgICAgICBwcml2YXRlIGludGVybmFsU3RyaW5naWZ5KGhvbGRlcjogYW55LCBrZXk6IGFueSwgaXNUb3BMZXZlbDogYm9vbGVhbikge1xuICAgICAgICAgICAgdmFyIGJ1ZmZlciwgcmVzO1xuXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSwgaWYgbmVjZXNzYXJ5XG4gICAgICAgICAgICB2YXIgb2JqX3BhcnQgPSB0aGlzLmdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXIsIGtleSwgaXNUb3BMZXZlbCk7XG5cbiAgICAgICAgICAgIGlmIChvYmpfcGFydCAmJiAhdGhpcy5pc0RhdGUob2JqX3BhcnQpKSB7XG4gICAgICAgICAgICAgICAgLy8gdW5ib3ggb2JqZWN0c1xuICAgICAgICAgICAgICAgIC8vIGRvbid0IHVuYm94IGRhdGVzLCBzaW5jZSB3aWxsIHR1cm4gaXQgaW50byBudW1iZXJcbiAgICAgICAgICAgICAgICBvYmpfcGFydCA9IG9ial9wYXJ0LnZhbHVlT2YoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIG9ial9wYXJ0KSB7XG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ial9wYXJ0LnRvU3RyaW5nKCk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihvYmpfcGFydCkgfHwgIWlzRmluaXRlKG9ial9wYXJ0KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpfcGFydC50b1N0cmluZygpO1xuXG4gICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lc2NhcGVTdHJpbmcob2JqX3BhcnQudG9TdHJpbmcoKSk7XG5cbiAgICAgICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpfcGFydCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBcnJheShvYmpfcGFydCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBcIltcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucHVzaChvYmpfcGFydCk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqX3BhcnQubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSB0aGlzLmludGVybmFsU3RyaW5naWZ5KG9ial9wYXJ0LCBpLCBmYWxzZSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMgPT09IG51bGwgfHwgdHlwZW9mIHJlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCJudWxsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHJlcztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBvYmpfcGFydC5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIixcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5kZW50U3RyKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIlxcblwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCwgdHJ1ZSkgKyBcIl1cIjtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBcIntcIjtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub25FbXB0eSA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wdXNoKG9ial9wYXJ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqX3BhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqX3BhcnQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeShvYmpfcGFydCwgcHJvcCwgZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1RvcExldmVsID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbkVtcHR5ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBrZXkgPSB0aGlzLmlzV29yZChwcm9wKSA/IHByb3AgOiB0aGlzLmVzY2FwZVN0cmluZyhwcm9wKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBrZXkgKyBcIjpcIiArICh0aGlzLmluZGVudFN0ciA/ICcgJyA6ICcnKSArIHZhbHVlICsgXCIsXCI7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnBvcCgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG5vbkVtcHR5KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLCBidWZmZXIubGVuZ3RoIC0gMSkgKyB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKSArIFwifVwiO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSAne30nO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBidWZmZXI7XG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgICAgICAgICAgLy8gZnVuY3Rpb25zIGFuZCB1bmRlZmluZWQgc2hvdWxkIGJlIGlnbm9yZWRcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn0iLCJtb2R1bGUgdGVtcGxhdGVFZGl0b3Iua28geyBleHBvcnQgdmFyIGh0bWwgPSAnPHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJvYmplY3RlZGl0b3JcIj4gICAgPGRpdiAgZGF0YS1iaW5kPVwidmlzaWJsZTprb0hhc09iamVjdFwiIHN0eWxlPVwibWFyZ2luOjEwcHg7d2lkdGg6MTAwJVwiPiAgICAgICAgPGRpdiBzdHlsZT1cImJhY2tncm91bmQtY29sb3I6bGlnaHRncmF5XCI+ICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazogc2hvd1Byb3BlcnRpZXNcIj4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDoga29TaG93UHJvcGVydGllcygpID8gXFwnSGlkZVxcJzogXFwnU2hvd1xcJ1wiPjwvc3Bhbj4gICAgICAgICAgICA8L2E+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDoga29UaXRsZVwiPjwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdj4gICAgICAgICAgICA8dGFibGUgZGF0YS1iaW5kPVwidmlzaWJsZTprb1Nob3dQcm9wZXJ0aWVzXCI+ICAgICAgICAgICAgICAgIDx0Ym9keSBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBrb1Byb3BlcnRpZXNcIj4gICAgICAgICAgICAgICAgICAgIDx0ciBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jaGFuZ2VBY3RpdmVQcm9wZXJ0eSgkZGF0YSksIHN0eWxlOiB7YmFja2dyb3VuZDogJHBhcmVudC5rb0FjdGl2ZVByb3BlcnR5KCkgPT0gJGRhdGEgPyBcXCdsaWdodGdyYXlcXCc6IFxcJ1xcJ31cIj4gICAgICAgICAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidGV4dDogbmFtZVwiPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHQsIHZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpICE9ICRkYXRhLCBhdHRyOiB7dGl0bGU6IGtvVGV4dH0sIHN0eWxlOiB7Y29sb3I6IGtvSXNEZWZhdWx0KCkgPyBcXCdncmF5XFwnIDogXFwnXFwnfVwiIHN0eWxlPVwidGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3c6aGlkZGVuXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGlmOiBlZGl0b3JUeXBlID09IFxcJ3RleHRcXCcgLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOiBrb1ZhbHVlLCB2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YVwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGlmOiBlZGl0b3JUeXBlID09IFxcJ2Jvb2xlYW5cXCcgLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJjaGVja2VkOiBrb1ZhbHVlLCB2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YVwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGlmOiBlZGl0b3JUeXBlID09IFxcJ2Ryb3Bkb3duXFwnIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cInZhbHVlOiBrb1ZhbHVlLCB2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YSwgb3B0aW9uczogY2hvaWNlc1wiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBpZjogZWRpdG9yVHlwZSA9PSBcXCdpdGVtdmFsdWVzXFwnIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpID09ICRkYXRhLCB3aXRoOiBpdGVtVmFsdWVzXCIgc3R5bGU9XCJwb3NpdGlvbjphYnNvbHV0ZTsgei1pbmRleDoxMDA7IHRvcDpwYXJlbnRPZmZzZXQudG9wO2xlZnQ6cGFyZW50T2Zmc2V0LmxlZnQgLSAxMDA7YmFja2dyb3VuZC1jb2xvcjpsaWdodGdyYXlcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5WYWx1ZTwvdGg+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+VGV4dDwvdGg+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0l0ZW1zIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29UZXh0XCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uRGVsZXRlQ2xpY2tcIiB2YWx1ZT1cIkRlbGV0ZVwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05ld1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05ld1RleHRcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQWRkQ2xpY2tcIiB2YWx1ZT1cIkFkZFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJBcHBseVwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFwcGx5Q2xpY2tcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgIDwvdGJvZHk+ICAgICAgICAgICAgPC90YWJsZT4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInBhZ2VlZGl0b3JcIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSXNWYWxpZFwiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb1BhZ2VzIC0tPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDogdGl0bGUsIHN0eWxlOiB7YmFja2dyb3VuZDoga29TZWxlY3RlZCgpID8gXFwnZGFya2dyYXlcXCcgOiBcXCdsaWdodGdyYXlcXCd9LGNsaWNrOiRwYXJlbnQuc2VsZWN0UGFnZUNsaWNrXCIgc3R5bGU9XCJwYWRkaW5nOjJweDtkaXNwbGF5OnRhYmxlLWNlbGw7d2hpdGUtc3BhY2U6bm93cmFwO2N1cnNvcjpwb2ludGVyXCI+PC9kaXY+ICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTp0YWJsZS1jZWxsO3BhZGRpbmc6MnB4XCI+ICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJjbGljazphZGROZXdQYWdlQ2xpY2tcIiB2YWx1ZT1cIkFkZCBOZXcgUGFnZVwiIC8+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PGRpdiBzdHlsZT1cIm92ZXJmbG93OmhpZGRlbjtwb3NpdGlvbjpyZWxhdGl2ZTtkaXNwbGF5OnRhYmxlXCI+ICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc1BhbmVsXCIgc3R5bGU9XCJkaXNwbGF5OnRhYmxlLWNlbGw7dmVydGljYWwtYWxpZ246dG9wXCI+ICAgICAgICA8ZGl2IHN0eWxlPVwid2lkdGg6MzAwcHg7aGVpZ2h0OjQwMHB4O292ZXJmbG93LXk6YXV0bztvdmVyZmxvdy14OmhpZGRlblwiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0ZWRpdG9yXFwnLCBkYXRhOiBzdXJ2ZXlFZGl0b3IgfVwiPjwvZGl2PiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZFBhZ2UoKSAhPSBudWxsXCI+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0ZWRpdG9yXFwnLCBkYXRhOiBwYWdlRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3RlZGl0b3JcXCcsIGRhdGE6IHF1ZXN0aW9uRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiAgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZFBhZ2UoKSAhPSBudWxsXCI+ICAgICAgICAgICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOiBxdWVzdGlvblR5cGVzLCB2YWx1ZToga29TZWxlY3RlZFF1ZXN0aW9uVHlwZVwiPjwvc2VsZWN0PiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJBZGQgUXVlc3Rpb25cIiBkYXRhLWJpbmQ9XCJjbGljazogYWRkUXVlc3Rpb25cIiAvPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IHN0eWxlPVwiZGlzcGxheTp0YWJsZS1jZWxsO3dpZHRoOjEwMCVcIj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc0VkaXRvclwiIHN0eWxlPVwiaGVpZ2h0OjQwMHB4O3dpZHRoOjEwMCVcIj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwYWdlZWRpdG9yXFwnLCBkYXRhOiBwYWdlc0VkaXRvciB9XCIgc3R5bGU9XCJ3aWR0aDoyMHB4XCI+PC9kaXY+ICAgIDwvZGl2PjwvZGl2PjxwPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6IHNob3dMaXZlU3VydmV5Q2xpY2tcIj4gICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDoga29TaG93TGl2ZVN1cnZleSgpID8gXFwnSGlkZSBMaXZlIFN1cnZleVxcJzogXFwnU2hvdyBMaXZlIFN1cnZleVxcJ1wiPjwvc3Bhbj48L2E+PC9wPjxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TaG93TGl2ZVN1cnZleSgpXCI+ICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc0V4YW1wbGVcIiBzdHlsZT1cImhlaWdodDo0MDBweDt3aWR0aDoxMDAlXCI+PC9kaXY+PC9kaXY+Jzt9Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==
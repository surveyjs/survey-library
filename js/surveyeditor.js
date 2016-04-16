var SurveyEditor;
(function (SurveyEditor) {
    var DragDropHelper = (function () {
        function DragDropHelper(data) {
            this.data = data;
        }
        Object.defineProperty(DragDropHelper.prototype, "survey", {
            get: function () { return this.data; },
            enumerable: true,
            configurable: true
        });
        DragDropHelper.prototype.startDragNewQuestion = function (event, questionType, questionName) {
            this.setData(event, DragDropHelper.dataStart + "questiontype:" + questionType + ",questionname:" + questionName);
        };
        DragDropHelper.prototype.startDragQuestion = function (event, questionName) {
            this.setData(event, DragDropHelper.dataStart + "questionname:" + questionName);
        };
        DragDropHelper.prototype.startDragCopiedQuestion = function (event, questionName, questionJson) {
            this.setData(event, DragDropHelper.dataStart + "questionname:" + questionName, questionJson);
        };
        DragDropHelper.prototype.isSurveyDragging = function (event) {
            if (!event)
                return false;
            var data = this.getData(event).text;
            return data && data.indexOf(DragDropHelper.dataStart) == 0;
        };
        DragDropHelper.prototype.doDragDropOver = function (event, question) {
            event = this.getEvent(event);
            if (!question || !this.isSurveyDragging(event) || this.isSamePlace(event, question))
                return;
            var index = this.getQuestionIndex(event, question);
            this.survey.currentPage["koDragging"](index);
        };
        DragDropHelper.prototype.doDrop = function (event, question) {
            if (question === void 0) { question = null; }
            if (event.stopPropagation) {
                event.stopPropagation();
            }
            if (!this.isSurveyDragging(event))
                return;
            this.survey.currentPage["koDragging"](-1);
            var index = this.getQuestionIndex(event, question);
            var dataInfo = this.getDataInfo(event);
            this.clearData();
            if (!dataInfo)
                return;
            var targetQuestion = null;
            var json = dataInfo["json"];
            if (json) {
                targetQuestion = Survey.QuestionFactory.Instance.createQuestion(json["type"], name);
                new Survey.JsonObject().toObject(json, targetQuestion);
                targetQuestion.name = dataInfo["questionname"];
            }
            if (!targetQuestion) {
                targetQuestion = this.survey.getQuestionByName(dataInfo["questionname"]);
            }
            if (!targetQuestion && dataInfo["questiontype"]) {
                targetQuestion = Survey.QuestionFactory.Instance.createQuestion(dataInfo["questiontype"], dataInfo["questionname"]);
            }
            if (!targetQuestion)
                return;
            this.moveQuestionTo(targetQuestion, index);
        };
        DragDropHelper.prototype.getQuestionIndex = function (event, question) {
            var page = this.survey.currentPage;
            if (!question)
                return page.questions.length;
            var index = page.questions.indexOf(question);
            event = this.getEvent(event);
            var height = event.currentTarget["clientHeight"];
            var y = event.offsetY;
            if (event.hasOwnProperty('layerX')) {
                y = event.layerY - event.currentTarget["offsetTop"];
            }
            if (y > height / 2)
                index++;
            return index;
        };
        DragDropHelper.prototype.isSamePlace = function (event, question) {
            var prev = DragDropHelper.prevEvent;
            if (prev.question != question || Math.abs(event.clientX - prev.x) > 5 || Math.abs(event.clientY - prev.y) > 5) {
                prev.question = question;
                prev.x = event.clientX;
                prev.y = event.clientY;
                return false;
            }
            return true;
        };
        DragDropHelper.prototype.getEvent = function (event) {
            return event["originalEvent"] ? event["originalEvent"] : event;
        };
        DragDropHelper.prototype.moveQuestionTo = function (targetQuestion, index) {
            if (targetQuestion == null)
                return;
            var page = this.survey.getPageByQuestion(targetQuestion);
            if (page) {
                page.removeQuestion(targetQuestion);
            }
            this.survey.currentPage.addQuestion(targetQuestion, index);
        };
        DragDropHelper.prototype.getDataInfo = function (event) {
            var data = this.getData(event);
            if (!data)
                return null;
            var text = data.text.substr(DragDropHelper.dataStart.length);
            var array = text.split(',');
            var result = { json: null };
            for (var i = 0; i < array.length; i++) {
                var item = array[i].split(':');
                result[item[0]] = item[1];
            }
            result.json = data.json;
            return result;
        };
        DragDropHelper.prototype.getY = function (element) {
            var result = 0;
            while (element) {
                result += (element.offsetTop - element.scrollTop + element.clientTop);
                element = element.offsetParent;
            }
            return result;
        };
        DragDropHelper.prototype.setData = function (event, text, json) {
            if (json === void 0) { json = null; }
            if (event["originalEvent"]) {
                event = event["originalEvent"];
            }
            if (event.dataTransfer) {
                event.dataTransfer.setData("Text", text);
                event.dataTransfer.effectAllowed = "copy";
            }
            DragDropHelper.dragData = { text: text, json: json };
        };
        DragDropHelper.prototype.getData = function (event) {
            if (event["originalEvent"]) {
                event = event["originalEvent"];
            }
            if (event.dataTransfer) {
                var text = event.dataTransfer.getData("Text");
                if (text) {
                    DragDropHelper.dragData.text = text;
                }
            }
            return DragDropHelper.dragData;
        };
        DragDropHelper.prototype.clearData = function () {
            DragDropHelper.dragData = { text: "", json: null };
            var prev = DragDropHelper.prevEvent;
            prev.question = null;
            prev.x = -1;
            prev.y = -1;
        };
        DragDropHelper.dataStart = "surveyjs,";
        DragDropHelper.dragData = { text: "", json: null };
        DragDropHelper.prevEvent = { question: null, x: -1, y: -1 };
        return DragDropHelper;
    }());
    SurveyEditor.DragDropHelper = DragDropHelper;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPropertyArray = (function () {
        function SurveyPropertyArray(onValueChanged) {
            this.onValueChanged = onValueChanged;
            this.object = null;
            this.title = ko.observable();
        }
        Object.defineProperty(SurveyPropertyArray.prototype, "value", {
            set: function (value) { },
            enumerable: true,
            configurable: true
        });
        return SurveyPropertyArray;
    }());
    SurveyEditor.SurveyPropertyArray = SurveyPropertyArray;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectPropertyArrays.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPropertyItemValues = (function (_super) {
        __extends(SurveyPropertyItemValues, _super);
        function SurveyPropertyItemValues(onValueChanged) {
            _super.call(this, onValueChanged);
            this.onValueChanged = onValueChanged;
            this.koItems = ko.observableArray();
            this.value_ = [];
            var self = this;
            self.onApplyClick = function () { self.Apply(); };
            self.onDeleteClick = function (item) { self.koItems.remove(item); };
            self.onClearClick = function (item) { self.koItems.removeAll(); };
            self.onAddClick = function () { self.AddItem(); };
        }
        Object.defineProperty(SurveyPropertyItemValues.prototype, "value", {
            get: function () { return this.value_; },
            set: function (value) {
                if (value == null || !Array.isArray(value))
                    value = [];
                this.value_ = value;
                var array = [];
                for (var i = 0; i < value.length; i++) {
                    var item = value[i];
                    var itemValue = item;
                    var itemText = null;
                    if (item.value) {
                        itemValue = item.value;
                        itemText = item.text;
                    }
                    array.push({ koValue: ko.observable(itemValue), koText: ko.observable(itemText), koHasError: ko.observable(false) });
                }
                this.koItems(array);
            },
            enumerable: true,
            configurable: true
        });
        SurveyPropertyItemValues.prototype.AddItem = function () {
            this.koItems.push({ koValue: ko.observable(), koText: ko.observable(), koHasError: ko.observable(false) });
        };
        SurveyPropertyItemValues.prototype.Apply = function () {
            if (this.hasError())
                return;
            this.value_ = [];
            for (var i = 0; i < this.koItems().length; i++) {
                var item = this.koItems()[i];
                if (item.koText()) {
                    this.value_.push({ value: item.koValue(), text: item.koText() });
                }
                else {
                    this.value_.push(item.koValue());
                }
            }
            if (this.onValueChanged) {
                this.onValueChanged(this.value_);
            }
        };
        SurveyPropertyItemValues.prototype.hasError = function () {
            var result = false;
            for (var i = 0; i < this.koItems().length; i++) {
                var item = this.koItems()[i];
                item.koHasError(!item.koValue());
                result = result || item.koHasError();
            }
            return result;
        };
        return SurveyPropertyItemValues;
    }(SurveyEditor.SurveyPropertyArray));
    SurveyEditor.SurveyPropertyItemValues = SurveyPropertyItemValues;
})(SurveyEditor || (SurveyEditor = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPropertyTriggers = (function (_super) {
        __extends(SurveyPropertyTriggers, _super);
        function SurveyPropertyTriggers(onValueChanged) {
            _super.call(this, onValueChanged);
            this.onValueChanged = onValueChanged;
            var self = this;
            this.koItems = ko.observableArray();
            this.koSelected = ko.observable(null);
            this.koPages = ko.observableArray();
            this.koQuestions = ko.observableArray();
            this.value_ = [];
            this.onDeleteClick = function () { self.koItems.remove(self.koSelected()); };
            this.onAddClick = function () { self.addItem(); };
            this.onApplyClick = function () { self.apply(); };
        }
        Object.defineProperty(SurveyPropertyTriggers.prototype, "value", {
            get: function () { return this.value_; },
            set: function (value) {
                if (value == null || !Array.isArray(value))
                    value = [];
                this.value_ = value;
                var array = [];
                if (this.object) {
                    this.koPages(this.getNames(this.object.pages));
                    this.koQuestions(this.getNames(this.object.getAllQuestions()));
                }
                for (var i = 0; i < value.length; i++) {
                    array.push(new SurveyPropertyTrigger(value[i], this.koPages, this.koQuestions));
                }
                this.koItems(array);
                this.koSelected(array.length > 0 ? array[0] : null);
            },
            enumerable: true,
            configurable: true
        });
        SurveyPropertyTriggers.prototype.apply = function () {
            this.value_ = [];
            var array = this.koItems();
            for (var i = 0; i < array.length; i++) {
                this.value_.push(array[i].createTrigger());
            }
            if (this.onValueChanged) {
                this.onValueChanged(this.value_);
            }
        };
        SurveyPropertyTriggers.prototype.getNames = function (items) {
            var names = [];
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item["name"]) {
                    names.push(item["name"]);
                }
            }
            return names;
        };
        SurveyPropertyTriggers.prototype.addItem = function () {
            var trigger = new SurveyPropertyTrigger(new Survey.SurveyTriggerVisible(), this.koPages, this.koQuestions);
            this.koItems.push(trigger);
            this.koSelected(trigger);
        };
        return SurveyPropertyTriggers;
    }(SurveyEditor.SurveyPropertyArray));
    SurveyEditor.SurveyPropertyTriggers = SurveyPropertyTriggers;
    var SurveyPropertyTrigger = (function () {
        function SurveyPropertyTrigger(trigger, koPages, koQuestions) {
            this.availableOperators = [
                { name: "empty", text: "is empty" }, { name: "notempty", text: "is not empty" },
                { name: "equal", text: "equals" }, { name: "notequal", text: "not equals" },
                { name: "contains", text: "contains" }, { name: "notcontains", text: "not contains" },
                { name: "greater", text: "greater" }, { name: "less", text: "less" },
                { name: "greaterorequal", text: "greater or equals" }, { name: "lessorequal", text: "Less or Equals" }];
            this.koName = ko.observable(trigger.name);
            this.koOperator = ko.observable(trigger.operator);
            this.koValue = ko.observable(trigger.value);
            this.pages = new SurveyPropertyTriggerObjects("Make pages visible:", koPages(), trigger.pages);
            this.questions = new SurveyPropertyTriggerObjects("Make questions visible:", koQuestions(), trigger.questions);
            var self = this;
            this.koRequireValue = ko.computed(function () { return self.koOperator() != "empty" && self.koOperator() != "notempty"; });
            this.koIsValid = ko.computed(function () { if (self.koName() && (!self.koRequireValue() || self.koValue()))
                return true; return false; });
            this.koText = ko.computed(function () { self.koName(); self.koOperator(); self.koValue(); return self.getText(); });
        }
        SurveyPropertyTrigger.prototype.createTrigger = function () {
            var trigger = new Survey.SurveyTriggerVisible();
            trigger.name = this.koName();
            trigger.operator = this.koOperator();
            trigger.value = this.koValue();
            trigger.pages = this.pages.koChoosen();
            trigger.questions = this.questions.koChoosen();
            return trigger;
        };
        SurveyPropertyTrigger.prototype.getText = function () {
            if (!this.koIsValid())
                return "The trigger is not set";
            return "Run if '" + this.koName() + "' " + this.getOperatorText() + this.getValueText();
        };
        SurveyPropertyTrigger.prototype.getOperatorText = function () {
            var op = this.koOperator();
            for (var i = 0; i < this.availableOperators.length; i++) {
                if (this.availableOperators[i].name == op)
                    return this.availableOperators[i].text;
            }
            return op;
        };
        SurveyPropertyTrigger.prototype.getValueText = function () {
            if (!this.koRequireValue())
                return "";
            return " " + this.koValue();
        };
        return SurveyPropertyTrigger;
    }());
    SurveyEditor.SurveyPropertyTrigger = SurveyPropertyTrigger;
    var SurveyPropertyTriggerObjects = (function () {
        function SurveyPropertyTriggerObjects(title, allObjects, choosenObjects) {
            this.title = title;
            this.koChoosen = ko.observableArray(choosenObjects);
            var array = [];
            for (var i = 0; i < allObjects.length; i++) {
                var item = allObjects[i];
                if (choosenObjects.indexOf(item) < 0) {
                    array.push(item);
                }
            }
            this.koObjects = ko.observableArray(array);
            this.koSelected = ko.observable();
            this.koChoosenSelected = ko.observable();
            var self = this;
            this.onDeleteClick = function () { self.deleteItem(); };
            this.onAddClick = function () { self.addItem(); };
        }
        SurveyPropertyTriggerObjects.prototype.deleteItem = function () {
            this.changeItems(this.koChoosenSelected(), this.koChoosen, this.koObjects);
        };
        SurveyPropertyTriggerObjects.prototype.addItem = function () {
            this.changeItems(this.koSelected(), this.koObjects, this.koChoosen);
        };
        SurveyPropertyTriggerObjects.prototype.changeItems = function (item, removedFrom, addTo) {
            removedFrom.remove(item);
            addTo.push(item);
            removedFrom.sort();
            addTo.sort();
        };
        return SurveyPropertyTriggerObjects;
    }());
    SurveyEditor.SurveyPropertyTriggerObjects = SurveyPropertyTriggerObjects;
})(SurveyEditor || (SurveyEditor = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPropertyValidators = (function (_super) {
        __extends(SurveyPropertyValidators, _super);
        function SurveyPropertyValidators(onValueChanged) {
            _super.call(this, onValueChanged);
            this.onValueChanged = onValueChanged;
            this.availableValidators = [];
            this.validatorsClasses = [];
            var self = this;
            this.selectedObjectEditor = new SurveyEditor.SurveyObjectEditor();
            this.selectedObjectEditor.onPropertyValueChanged.add(function (sender, options) {
                self.onPropertyValueChanged(options.property, options.object, options.newValue);
            });
            this.koItems = ko.observableArray();
            this.koSelected = ko.observable(null);
            this.koSelected.subscribe(function (newValue) { self.selectedObjectEditor.selectedObject = newValue != null ? newValue.validator : null; });
            this.validatorsClasses = Survey.JsonObject.metaData.getChildrenClasses("surveyvalidator", true);
            this.availableValidators = this.getAvailableValidators();
            this.value_ = [];
            this.onDeleteClick = function () { self.koItems.remove(self.koSelected()); };
            this.onAddClick = function (validatorType) { self.addItem(validatorType); };
            this.onApplyClick = function () { self.apply(); };
        }
        Object.defineProperty(SurveyPropertyValidators.prototype, "value", {
            get: function () { return this.value_; },
            set: function (value) {
                if (value == null || !Array.isArray(value))
                    value = [];
                this.value_ = value;
                var array = [];
                var jsonObj = new Survey.JsonObject();
                for (var i = 0; i < value.length; i++) {
                    var validator = Survey.JsonObject.metaData.createClass(value[i].getType());
                    jsonObj.toObject(value[i], validator);
                    array.push(new SurveyPropertyValidatorItem(validator));
                }
                this.koItems(array);
                this.koSelected(array.length > 0 ? array[0] : null);
            },
            enumerable: true,
            configurable: true
        });
        SurveyPropertyValidators.prototype.apply = function () {
            this.value_ = [];
            var array = this.koItems();
            for (var i = 0; i < array.length; i++) {
                this.value_.push(array[i].validator);
            }
            if (this.onValueChanged) {
                this.onValueChanged(this.value_);
            }
        };
        SurveyPropertyValidators.prototype.addItem = function (validatorType) {
            var newValidator = new SurveyPropertyValidatorItem(Survey.JsonObject.metaData.createClass(validatorType));
            this.koItems.push(newValidator);
            this.koSelected(newValidator);
        };
        SurveyPropertyValidators.prototype.getAvailableValidators = function () {
            var result = [];
            for (var i = 0; i < this.validatorsClasses.length; i++) {
                result.push(this.validatorsClasses[i].name);
            }
            return result;
        };
        SurveyPropertyValidators.prototype.onPropertyValueChanged = function (property, obj, newValue) {
            if (this.koSelected() == null)
                return;
            this.koSelected().validator[property.name] = newValue;
        };
        return SurveyPropertyValidators;
    }(SurveyEditor.SurveyPropertyArray));
    SurveyEditor.SurveyPropertyValidators = SurveyPropertyValidators;
    var SurveyPropertyValidatorItem = (function () {
        function SurveyPropertyValidatorItem(validator) {
            this.validator = validator;
            this.text = validator.getType();
        }
        return SurveyPropertyValidatorItem;
    }());
    SurveyEditor.SurveyPropertyValidatorItem = SurveyPropertyValidatorItem;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    (function (ObjType) {
        ObjType[ObjType["Unknown"] = 0] = "Unknown";
        ObjType[ObjType["Survey"] = 1] = "Survey";
        ObjType[ObjType["Page"] = 2] = "Page";
        ObjType[ObjType["Question"] = 3] = "Question";
    })(SurveyEditor.ObjType || (SurveyEditor.ObjType = {}));
    var ObjType = SurveyEditor.ObjType;
    var SurveyHelper = (function () {
        function SurveyHelper() {
        }
        SurveyHelper.getNewName = function (objs, baseName) {
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
        SurveyHelper.getObjectType = function (obj) {
            if (!obj || !obj["getType"])
                return ObjType.Unknown;
            if (obj.getType() == "page")
                return ObjType.Page;
            if (obj.getType() == "survey")
                return ObjType.Survey;
            if (obj["koValue"])
                return ObjType.Question;
            return ObjType.Unknown;
        };
        SurveyHelper.getObjectName = function (obj) {
            if (obj["name"])
                return obj["name"];
            var objType = SurveyHelper.getObjectType(obj);
            if (objType != ObjType.Page)
                return "";
            var data = obj.data;
            var index = data.pages.indexOf(obj);
            return "[Page " + (index + 1) + "]";
        };
        return SurveyHelper;
    }());
    SurveyEditor.SurveyHelper = SurveyHelper;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectPropertyArrays.ts" />
/// <reference path="surveyHelper.ts" />
/// <reference path="objectPropertyValidators.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPropertyTextItems = (function (_super) {
        __extends(SurveyPropertyTextItems, _super);
        function SurveyPropertyTextItems(onValueChanged) {
            _super.call(this, onValueChanged);
            this.onValueChanged = onValueChanged;
            this.koItems = ko.observableArray();
            this.value_ = [];
            var self = this;
            self.onApplyClick = function () { self.Apply(); };
            self.onDeleteClick = function (item) { self.koItems.remove(item); };
            self.onAddClick = function () { self.AddItem(); };
        }
        Object.defineProperty(SurveyPropertyTextItems.prototype, "value", {
            get: function () { return this.value_; },
            set: function (value) {
                if (value == null || !Array.isArray(value))
                    value = [];
                this.value_ = value;
                var array = [];
                for (var i = 0; i < value.length; i++) {
                    var item = value[i];
                    var editItem = { koName: ko.observable(item.name), koTitle: ko.observable(item.title) };
                    this.createValidatorsEditor(editItem, item.validators);
                    array.push(editItem);
                }
                this.koItems(array);
            },
            enumerable: true,
            configurable: true
        });
        SurveyPropertyTextItems.prototype.AddItem = function () {
            var objs = [];
            var array = this.koItems();
            for (var i = 0; i < array.length; i++) {
                objs.push({ name: array[i].koName() });
            }
            var editItem = { koName: ko.observable(SurveyEditor.SurveyHelper.getNewName(objs, "text")), koTitle: ko.observable() };
            this.createValidatorsEditor(editItem, []);
            this.koItems.push(editItem);
        };
        SurveyPropertyTextItems.prototype.Apply = function () {
            this.value_ = [];
            for (var i = 0; i < this.koItems().length; i++) {
                var item = this.koItems()[i];
                var itemText = new Survey.MultipleTextItem(item.koName(), item.koTitle());
                itemText.validators = item.validators;
                this.value_.push(itemText);
            }
            if (this.onValueChanged) {
                this.onValueChanged(this.value_);
            }
        };
        SurveyPropertyTextItems.prototype.createValidatorsEditor = function (item, validators) {
            item.validators = validators.slice();
            var onItemChanged = function (newValue) { item.validators = newValue; item.koText("[ Items: " + newValue.length + " ]"); };
            item.arrayEditor = new SurveyEditor.SurveyPropertyValidators(function (newValue) { onItemChanged(newValue); });
            item.arrayEditor.object = item;
            item.arrayEditor.title("Edit property 'Validators'");
            item.arrayEditor.value = item.validators;
            item.koText = ko.observable("[ Items: " + validators.length + " ]");
        };
        return SurveyPropertyTextItems;
    }(SurveyEditor.SurveyPropertyArray));
    SurveyEditor.SurveyPropertyTextItems = SurveyPropertyTextItems;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectPropertyItemValues.ts" />
/// <reference path="objectPropertyTriggers.ts" />
/// <reference path="objectPropertyValidators.ts" />
/// <reference path="objectPropertyTextItems.ts" />
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyObjectProperty = (function () {
        function SurveyObjectProperty(property, onPropertyChanged) {
            if (onPropertyChanged === void 0) { onPropertyChanged = null; }
            this.property = property;
            this.name = this.property.name;
            this.koValue = ko.observable();
            this.editorType = property.type;
            this.choices = property.choices;
            if (this.choices != null) {
                this.editorType = "dropdown";
            }
            var self = this;
            this.arrayEditor = null;
            var onItemChanged = function (newValue) { self.koValue(newValue); };
            this.modalName = "modelEditor" + this.editorType + this.name;
            this.modalNameTarget = "#" + this.modalName;
            if (this.editorType == "itemvalues") {
                this.arrayEditor = new SurveyEditor.SurveyPropertyItemValues(function (newValue) { onItemChanged(newValue); });
            }
            if (this.editorType == "triggers") {
                this.arrayEditor = new SurveyEditor.SurveyPropertyTriggers(function (newValue) { onItemChanged(newValue); });
            }
            if (this.editorType == "validators") {
                this.arrayEditor = new SurveyEditor.SurveyPropertyValidators(function (newValue) { onItemChanged(newValue); });
            }
            if (this.editorType == "textitems") {
                this.arrayEditor = new SurveyEditor.SurveyPropertyTextItems(function (newValue) { onItemChanged(newValue); });
            }
            this.baseEditorType = this.arrayEditor != null ? "array" : this.editorType;
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
            this.koValue(this.getValue());
            if (this.arrayEditor) {
                this.arrayEditor.object = this.object;
                this.arrayEditor.title("Edit property '" + this.property.name + "'");
                this.arrayEditor.value = this.koValue();
            }
            this.isValueUpdating = false;
        };
        SurveyObjectProperty.prototype.getValue = function () {
            if (this.property.hasToUseGetValue)
                return this.property.getValue(this.object);
            return this.object[this.name];
        };
        SurveyObjectProperty.prototype.getValueText = function (value) {
            if (value != null && Array.isArray(value)) {
                return "[ Items: " + value.length + " ]";
            }
            return value;
        };
        return SurveyObjectProperty;
    }());
    SurveyEditor.SurveyObjectProperty = SurveyObjectProperty;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectProperty.ts" />
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyObjectEditor = (function () {
        function SurveyObjectEditor() {
            this.onPropertyValueChanged = new Survey.Event();
            this.koProperties = ko.observableArray();
            this.koActiveProperty = ko.observable();
            this.koHasObject = ko.observable();
        }
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
                var objectProperty = new SurveyEditor.SurveyObjectProperty(properties[i], propEvent);
                objectProperties.push(objectProperty);
            }
            this.koProperties(objectProperties);
            this.koActiveProperty(this.getPropertyEditor("name"));
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
    }());
    SurveyEditor.SurveyObjectEditor = SurveyObjectEditor;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPagesEditor = (function () {
        function SurveyPagesEditor(onAddNewPageCallback, onSelectPageCallback, onMovePageCallback) {
            if (onAddNewPageCallback === void 0) { onAddNewPageCallback = null; }
            if (onSelectPageCallback === void 0) { onSelectPageCallback = null; }
            if (onMovePageCallback === void 0) { onMovePageCallback = null; }
            this.draggingPage = null;
            this.koPages = ko.observableArray();
            this.koIsValid = ko.observable(false);
            this.onAddNewPageCallback = onAddNewPageCallback;
            this.onSelectPageCallback = onSelectPageCallback;
            this.onMovePageCallback = onMovePageCallback;
            var self = this;
            this.selectPageClick = function (pageItem) {
                if (self.onSelectPageCallback) {
                    self.onSelectPageCallback(pageItem.page);
                }
            };
            this.dragStart = function (el) { self.draggingPage = el; };
            this.dragOver = function (el) { };
            this.dragEnd = function () { self.draggingPage = null; };
            this.dragDrop = function (el) { self.moveDraggingPageTo(el); };
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
            var index = this.getIndexByPage(page);
            if (index > -1) {
                this.koPages.splice(index, 1);
            }
        };
        SurveyPagesEditor.prototype.changeName = function (page) {
            var index = this.getIndexByPage(page);
            if (index > -1) {
                this.koPages()[index].title(SurveyEditor.SurveyHelper.getObjectName(page));
            }
        };
        SurveyPagesEditor.prototype.getIndexByPage = function (page) {
            var pages = this.koPages();
            for (var i = 0; i < pages.length; i++) {
                if (pages[i].page == page)
                    return i;
            }
            return -1;
        };
        SurveyPagesEditor.prototype.updatePages = function () {
            if (this.surveyValue == null) {
                this.koPages([]);
                return;
            }
            var pages = [];
            for (var i = 0; i < this.surveyValue.pages.length; i++) {
                var page = this.surveyValue.pages[i];
                pages.push({
                    title: ko.observable(SurveyEditor.SurveyHelper.getObjectName(page)), page: page, koSelected: ko.observable(false)
                });
            }
            this.koPages(pages);
        };
        SurveyPagesEditor.prototype.moveDraggingPageTo = function (toPage) {
            if (toPage == null || toPage == this.draggingPage) {
                this.draggingPage = null;
                return;
            }
            if (this.draggingPage == null)
                return;
            var index = this.koPages().indexOf(this.draggingPage);
            var indexTo = this.koPages().indexOf(toPage);
            if (this.onMovePageCallback) {
                this.onMovePageCallback(index, indexTo);
            }
        };
        return SurveyPagesEditor;
    }());
    SurveyEditor.SurveyPagesEditor = SurveyPagesEditor;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var TextParserPropery = (function () {
        function TextParserPropery() {
        }
        return TextParserPropery;
    }());
    var SurveyTextWorker = (function () {
        function SurveyTextWorker(text) {
            this.text = text;
            if (!this.text || this.text.trim() == "") {
                this.text = "{}";
            }
            this.errors = [];
            this.process();
        }
        Object.defineProperty(SurveyTextWorker.prototype, "survey", {
            get: function () { return this.surveyValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyTextWorker.prototype, "isJsonCorrect", {
            get: function () { return this.surveyValue != null; },
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
    }());
    SurveyEditor.SurveyTextWorker = SurveyTextWorker;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var SurveyEmbedingWindow = (function () {
        function SurveyEmbedingWindow() {
            this.surveyId = null;
            this.surveyPostId = null;
            var self = this;
            this.koShowAsWindow = ko.observable("page");
            this.koScriptUsing = ko.observable("bootstrap");
            this.koHasIds = ko.observable(false);
            this.koLoadSurvey = ko.observable(false);
            this.koShowAsWindow.subscribe(function (newValue) { self.surveyEmbedingJava.setValue(self.getJavaText()); });
            this.koScriptUsing.subscribe(function (newValue) { self.setHeadText(); });
            this.koLoadSurvey.subscribe(function (newValue) { self.surveyEmbedingJava.setValue(self.getJavaText()); });
            this.surveyEmbedingHead = null;
        }
        Object.defineProperty(SurveyEmbedingWindow.prototype, "json", {
            get: function () { return this.jsonValue; },
            set: function (value) { this.jsonValue = value; },
            enumerable: true,
            configurable: true
        });
        SurveyEmbedingWindow.prototype.show = function () {
            if (this.surveyEmbedingHead == null) {
                this.surveyEmbedingHead = this.createEditor("surveyEmbedingHead");
                this.setHeadText();
                var bodyEditor = this.createEditor("surveyEmbedingBody");
                bodyEditor.setValue("<div id= \"mySurveyJSName\" ></div>");
                this.surveyEmbedingJava = this.createEditor("surveyEmbedingJava");
            }
            this.koHasIds(this.surveyId && this.surveyPostId);
            this.surveyEmbedingJava.setValue(this.getJavaText());
        };
        SurveyEmbedingWindow.prototype.setHeadText = function () {
            var knockoutStr = "<script src=\"https://cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min.js\" ></script>\n";
            if (this.koScriptUsing() == "bootstrap") {
                this.surveyEmbedingHead.setValue(knockoutStr + "<script src=\"js/survey.bootstrap.min.js\"></script>");
            }
            else {
                this.surveyEmbedingHead.setValue(knockoutStr + "<script src=\"js/survey.min.js\"></script>\n<link href=\"css/survey.css\" type=\"text/css\" rel=\"stylesheet\" />");
            }
        };
        SurveyEmbedingWindow.prototype.createEditor = function (elementName) {
            var editor = ace.edit(elementName);
            editor.setTheme("ace/theme/monokai");
            editor.session.setMode("ace/mode/json");
            editor.setShowPrintMargin(false);
            editor.renderer.setShowGutter(false);
            editor.setReadOnly(true);
            return editor;
        };
        SurveyEmbedingWindow.prototype.getJavaText = function () {
            var isOnPage = this.koShowAsWindow() == "page";
            var text = isOnPage ? "var survey = new Survey.Survey(\n" : "var surveyWindow = new Survey.SurveyWindow(\n";
            text += this.getJsonText();
            text += ");\n";
            if (!isOnPage) {
                text += "surveyWindow.";
            }
            var saveFunc = "alert(\"The results are:\" + JSON.stringify(s.data));";
            if (this.koHasIds()) {
                saveFunc = "survey.sendResult('" + this.surveyPostId + "');";
            }
            text += "survey.onComplete.add(function (s) {\n" + saveFunc + "\n });\n";
            if (isOnPage) {
                text += "survey.render(\"mySurveyJSName\");";
            }
            else {
                text += "//By default Survey.title is used.\n";
                text += "//surveyWindow.title = \"My Survey Window Title.\";\n";
                text += "surveyWindow.show();";
            }
            return text;
        };
        SurveyEmbedingWindow.prototype.getJsonText = function () {
            if (this.koHasIds() && this.koLoadSurvey()) {
                return "{ surveyId: '" + this.surveyId + "'}";
            }
            return new SurveyEditor.SurveyJSON5().stringify(this.json);
        };
        return SurveyEmbedingWindow;
    }());
    SurveyEditor.SurveyEmbedingWindow = SurveyEmbedingWindow;
})(SurveyEditor || (SurveyEditor = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyVerbs = (function () {
        function SurveyVerbs() {
            this.koVerbs = ko.observableArray();
            this.koHasVerbs = ko.observable();
            var classes = Survey.JsonObject.metaData.getChildrenClasses("selectbase", true);
            this.choicesClasses = [];
            for (var i = 0; i < classes.length; i++) {
                this.choicesClasses.push(classes[i].name);
            }
        }
        Object.defineProperty(SurveyVerbs.prototype, "survey", {
            get: function () { return this.surveyValue; },
            set: function (value) {
                if (this.survey == value)
                    return;
                this.surveyValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyVerbs.prototype, "obj", {
            get: function () { return this.objValue; },
            set: function (value) {
                if (this.objValue == value)
                    return;
                this.objValue = value;
                this.buildVerbs();
            },
            enumerable: true,
            configurable: true
        });
        SurveyVerbs.prototype.buildVerbs = function () {
            var array = [];
            var objType = SurveyEditor.SurveyHelper.getObjectType(this.obj);
            if (objType == SurveyEditor.ObjType.Question) {
                var question = this.obj;
                if (this.survey.pages.length > 1) {
                    array.push(new SurveyVerbChangePageItem(this.survey, question));
                }
                if (this.choicesClasses.indexOf(question.getType()) > -1) {
                    array.push(new SurveyVerbChangeTypeItem(this.survey, question));
                }
            }
            this.koVerbs(array);
            this.koHasVerbs(array.length > 0);
        };
        return SurveyVerbs;
    }());
    SurveyEditor.SurveyVerbs = SurveyVerbs;
    var SurveyVerbItem = (function () {
        function SurveyVerbItem(survey, question) {
            this.survey = survey;
            this.question = question;
            this.koItems = ko.observableArray();
            this.koSelectedItem = ko.observable();
        }
        Object.defineProperty(SurveyVerbItem.prototype, "text", {
            get: function () { return ""; },
            enumerable: true,
            configurable: true
        });
        return SurveyVerbItem;
    }());
    SurveyEditor.SurveyVerbItem = SurveyVerbItem;
    var SurveyVerbChangeTypeItem = (function (_super) {
        __extends(SurveyVerbChangeTypeItem, _super);
        function SurveyVerbChangeTypeItem(survey, question) {
            _super.call(this, survey, question);
            this.survey = survey;
            this.question = question;
            var classes = Survey.JsonObject.metaData.getChildrenClasses("selectbase", true);
            var array = [];
            for (var i = 0; i < classes.length; i++) {
                array.push({ value: classes[i].name, text: classes[i].name });
            }
            this.koItems(array);
            this.koSelectedItem(question.getType());
            var self = this;
            this.koSelectedItem.subscribe(function (newValue) { self.changeType(newValue); });
        }
        Object.defineProperty(SurveyVerbChangeTypeItem.prototype, "text", {
            get: function () { return "Change type "; },
            enumerable: true,
            configurable: true
        });
        SurveyVerbChangeTypeItem.prototype.changeType = function (questionType) {
            if (questionType == this.question.getType())
                return;
            var page = this.survey.getPageByQuestion(this.question);
            var index = page.questions.indexOf(this.question);
            var newQuestion = Survey.QuestionFactory.Instance.createQuestion(questionType, this.question.name);
            var jsonObj = new Survey.JsonObject();
            var json = jsonObj.toJsonObject(this.question);
            jsonObj.toObject(json, newQuestion);
            page.removeQuestion(this.question);
            page.addQuestion(newQuestion, index);
        };
        return SurveyVerbChangeTypeItem;
    }(SurveyVerbItem));
    SurveyEditor.SurveyVerbChangeTypeItem = SurveyVerbChangeTypeItem;
    var SurveyVerbChangePageItem = (function (_super) {
        __extends(SurveyVerbChangePageItem, _super);
        function SurveyVerbChangePageItem(survey, question) {
            _super.call(this, survey, question);
            this.survey = survey;
            this.question = question;
            var array = [];
            for (var i = 0; i < this.survey.pages.length; i++) {
                var page = this.survey.pages[i];
                array.push({ value: page, text: SurveyEditor.SurveyHelper.getObjectName(page) });
            }
            this.koItems(array);
            this.prevPage = this.survey.getPageByQuestion(question);
            this.koSelectedItem(this.prevPage);
            var self = this;
            this.koSelectedItem.subscribe(function (newValue) { self.changePage(newValue); });
        }
        Object.defineProperty(SurveyVerbChangePageItem.prototype, "text", {
            get: function () { return "Change page "; },
            enumerable: true,
            configurable: true
        });
        SurveyVerbChangePageItem.prototype.changePage = function (newPage) {
            if (newPage == null || newPage == this.prevPage)
                return;
            this.prevPage.removeQuestion(this.question);
            newPage.addQuestion(this.question);
        };
        return SurveyVerbChangePageItem;
    }(SurveyVerbItem));
    SurveyEditor.SurveyVerbChangePageItem = SurveyVerbChangePageItem;
})(SurveyEditor || (SurveyEditor = {}));

var templateEditor;
(function (templateEditor) {
    var ko;
    (function (ko) {
        ko.html = '<div class="row nav-tabs">    <div class="col-md-3">        <nav class="navbar-default">            <ul class="nav nav-tabs no-borders">                <li data-bind="css: {active: koIsShowDesigner()}"><a href="#" data-bind="click:selectDesignerClick">Designer</a></li>                <li data-bind="css: {active: !koIsShowDesigner()}"><a href="#" data-bind="click:selectEditorClick">JSON Editor</a></li>            </ul>        </nav>    </div>    <div class="col-md-9 svd_navbarbuttons">        <nav class="navbar-default pull-right">            <div class="btn-toolbar" role="toolbar">                <button type="button" class="btn btn-default" data-bind="click: runSurveyClick" data-toggle="modal" data-target="#surveyExampleModal"><span class="glyphicon glyphicon-play" aria-hidden="true"></span>  Run Survey</button>                <button type="button" class="btn btn-default" data-bind="click: embedingSurveyClick" data-toggle="modal" data-target="#surveyEmbedingModal">Embed Survey</button>                <button type="button" class="btn btn-default" data-bind="visible: koShowSaveButton, click: saveButtonClick">Save Survey</button>            </div>        </nav>    </div></div><div class="panel" style="width:100%">    <div id="surveyjsEditor" data-bind="visible: !koIsShowDesigner()" style="height:450px;width:100%"></div>    <div class="row" data-bind="visible: koIsShowDesigner()">        <div class="row col-md-9">            <div class="col-md-3">                <div class="panel panel-default" style="width:100%">                    <div class="panel-heading">                        <b>Toolbox</b>                    </div>                    <div class="btn-group-vertical" style="width:100%;padding-right:2px">                        <!-- ko foreach: questionTypes -->                        <div class="btn btn-default" style="text-align:left; padding-left:10px; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickQuestion, event:{dragstart: function(el, e) { $parent.draggingQuestion($data, e); return true;}}">                            <span data-bind="text:$data"></span>                        </div>                        <!-- /ko  -->                        <!-- ko foreach: koCopiedQuestions -->                        <div class="btn btn-primary" style="text-align:left; padding-left:10px; margin:1px;width:100%" draggable="true" data-bind="click: $parent.clickCopiedQuestion, event:{dragstart: function(el, e) { $parent.draggingCopiedQuestion($data, e); return true;}}">                            <span data-bind="text:name"></span>                        </div>                        <!-- /ko  -->                    </div>                </div>            </div>            <div class="col-md-9">                <div data-bind="template: { name: \'pageeditor\', data: pagesEditor }"></div>                <div style="overflow-y: scroll;height:450px;">                    <div id="surveyjs" style="width:100%"></div>                </div>            </div>        </div>        <div class="col-md-3">            <div class="panel panel-default" style="width:100%">                <div class="panel-heading">                    <div class="input-group">                        <select class="form-control" data-bind="options: koObjects, optionsText: \'text\', value: koSelectedObject"></select>                        <span class="input-group-btn">                            <button class="btn btn-default" type="button" data-bind="enable: koCanDeleteObject, click: deleteCurrentObject" title="Delete selected object"><span class="glyphicon glyphicon-remove"></span></button>                        </span>                    </div>                </div>                <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                <div class="panel-footer" data-bind="visible:surveyVerbs.koHasVerbs">                    <div data-bind="template: { name: \'objectverbs\', data: surveyVerbs }"></div>                </div>            </div>        </div>    </div></div><div id="surveyExampleModal" class="modal fade" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal">&times;</button>                <h4 class="modal-title">Running survey</h4>            </div>            <div class="modal-body">                <div id="surveyjsExample"></div>            </div>        </div>    </div></div><div id="surveyEmbedingModal" class="modal fade" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal">&times;</button>                <h4 class="modal-title">Embed Survey</h4>            </div>            <div class="modal-body">                <div data-bind="template: { name: \'surveyembeding\', data: surveyEmbeding }"></div>            </div>        </div>    </div></div><script type="text/html" id="objecteditor">    <table class="table svd_table-nowrap">        <tbody data-bind="foreach: koProperties">            <tr data-bind="click: $parent.changeActiveProperty($data), css: {\'active\': $parent.koActiveProperty() == $data}">                <td data-bind="text: name" width="50%"></td>                <td width="50%">                    <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data, attr: {title: koText}, style: {color: koIsDefault() ? \'gray\' : \'\'}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                    <div data-bind="visible: $parent.koActiveProperty() == $data">                        <!-- ko template: { name: \'propertyeditor-\' + baseEditorType, data: $data } -->                        <!-- /ko -->                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="objectverbs">    <!-- ko foreach: koVerbs -->        <div class="row">            <div class="input-group">                <span  class="input-group-addon" data-bind="text:text"></span>                <select class="form-control" data-bind="options: koItems, optionsText: \'text\', optionsValue:\'value\', value: koSelectedItem"></select>            </div>        </div>    <!-- /ko  --></script><script type="text/html" id="pageeditor">    <ul class="nav nav-tabs">        <!-- ko foreach: koPages -->        <li data-bind="css: {active: koSelected()},event:{           dragstart:function(el, e){ $parent.dragStart(el); return true; },           dragover:function(el, e){ $parent.dragOver(el);},           dragend:function(el, e){ $parent.dragEnd();},           drop:function(el, e){ $parent.dragDrop(el);}         }">             <a href="#" data-bind="click:$parent.selectPageClick">                <span data-bind="text: title"></span>            </a>        </li>        <!-- /ko  -->        <li><button type="button" class="btn btn-default" data-bind="click:addNewPageClick"><span class="glyphicon glyphicon-plus"></span></button></li>    </ul></script><script type="text/html" id="propertyeditor-array">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-bind="attr: {\'data-target\' : modalNameTarget}">Edit</button>    </div>    <div data-bind="attr: {id : modalName}" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body svd_notopbottompaddings">                    <!-- ko template: { name: \'propertyeditor-\' + editorType, data: arrayEditor } -->                    <!-- /ko -->                </div>                <div class="modal-footer">                    <input type="button" value="Apply" data-bind="click: arrayEditor.onApplyClick" style="width:100px" />                    <input type="button" data-dismiss="modal" value="Close" style="width:100px" />                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-boolean">    <input type="checkbox" data-bind="checked: koValue" /></script><script type="text/html" id="propertyeditor-dropdown">    <select data-bind="value: koValue, options: choices"  style="width:100%"></select></script><script type="text/html" id="propertyeditor-itemvalues"><table class="table">    <thead>        <tr>            <th>Value</th>            <th>Text</th>            <th></th>        </tr>    </thead>    <tbody>        <!-- ko foreach: koItems -->        <tr>            <td>                <input type="text" data-bind="value:koValue" style="width:200px" />                <div class="alert alert-danger no-padding" role="alert" data-bind="visible:koHasError">Please, enter the value.</div>            </td>            <td><input type="text" data-bind="value:koText" style="width:200px" /></td>            <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>        </tr>        <!-- /ko -->        <tr>            <td colspan="3">                <div class="row btn-toolbar">                    <input type="button" data-bind="click: onAddClick" value="Add New" />                    <input type="button" data-bind="click: onClearClick" value="Remove All" />                </div>            </td>        </tr>    </tbody></table></script><script type="text/html" id="propertyeditor-number">    <input type="number" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-string">    <input type="text" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-textitems"><div class="panel">    <table class="table">        <thead>            <tr>                <th>Name</th>                <th>Title</th>                <th></th>            </tr>        </thead>        <tbody>            <!-- ko foreach: koItems -->            <tr>                <td><input type="text" data-bind="value:koName" style="width:200px" /></td>                <td><input type="text" data-bind="value:koTitle" style="width:200px" /></td>                <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>            </tr>            <!-- /ko -->            <tr>                <td colspan="4"><input type="button" data-bind="click: onAddClick" value="Add" /></td>            </tr>        </tbody>    </table></div></script><script type="text/html" id="propertyeditor-triggers"><div class="panel">    <div class="panel-heading">        <div class="row input-group">            <span class="input-group-btn">                <button type="button" data-bind="enable: koQuestions().length > 0, click: onAddClick" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>            </span>            <select class="form-control" data-bind="options: koItems, optionsText: \'koText\', value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>    </div>    <div data-bind="visible: koSelected() == null">        <div data-bind="visible: koQuestions().length == 0">            There is no any question in the survey.        </div>        <div data-bind="visible: koQuestions().length > 0">            Please create a trigger        </div>    </div>    <div data-bind="visible: koSelected() != null">        <div class="row" data-bind="with: koSelected">            <div class="form-inline col-sm-12">                <span>On </span><select class="form-control" data-bind="options:$parent.koQuestions, value: koName"></select> <span> </span>                <select class="form-control" data-bind="options:availableOperators, optionsValue: \'name\', optionsText: \'text\', value:koOperator"></select>                <input class="form-control" style="padding: 0" type="text" data-bind="visible: koRequireValue, value:koValue" />            </div>            <div class="row">                <div class="col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: pages } -->                    <!-- /ko -->                </div>                <div class="col-sm-6">                    <!-- ko template: { name: \'propertyeditor-triggersitems\', data: questions } -->                    <!-- /ko -->                </div>            </div>        </div>    </div></div></script><script type="text/html" id="propertyeditor-triggersitems">    <div class="panel no-margins no-padding">        <div class="panel-heading">            <span data-bind="text: title"></span>        </div>        <div class="input-group">            <select class="form-control" multiple="multiple" data-bind="options:koChoosen, value: koChoosenSelected"></select>            <span class="input-group-btn" style="vertical-align:top">                <button type="button" data-bind="enable: koChoosenSelected() != null, click: onDeleteClick" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>        <div class="input-group" style="margin-top:5px">            <select class="form-control" data-bind="options:koObjects, value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onAddClick" style="width:40px" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>            </span>        </div>    </div></script><script type="text/html" id="propertyeditor-validators"><div class="panel">    <div class="panel-heading">        <div class="row input-group">            <button type="button" class="dropdown-toggle input-group-addon" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                <span class="glyphicon glyphicon-plus"></span>            </button>            <ul class="dropdown-menu input-group">                <!-- ko foreach: availableValidators -->                <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                <!-- /ko  -->            </ul>            <select class="form-control" data-bind="options: koItems, optionsText: \'text\', value: koSelected"></select>            <span class="input-group-btn">                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>            </span>        </div>    </div>    <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div></div></script><script type="text/html" id="surveyembeding">    <div class="row">        <select data-bind="value:koScriptUsing">            <option value="bootstrap">For bootstrap framework</option>            <option value="standard">No bootstrap</option>        </select>        <select data-bind="value:koShowAsWindow">            <option value="page">Show survey on a page</option>            <option value="window">Show survey in a window</option>        </select>        <label class="checkbox-inline" data-bind="visible:koHasIds">            <input type="checkbox" data-bind="checked:koLoadSurvey" />            <span>Load Survey JSON from server</span>        </label>    </div>    <div class="panel">        <div class="panel-heading">Scripts and styles</div>        <div id="surveyEmbedingHead" style="height:70px;width:100%"></div>    </div>    <div class="panel" data-bind="visible: koShowAsWindow()==\'page\'">        <div class="panel-heading">HTML</div>        <div id="surveyEmbedingBody" style="height:30px;width:100%"></div>    </div>    <div class="panel">        <div class="panel-heading">JavaScript</div>        <div id="surveyEmbedingJava" style="height:300px;width:100%"></div>    </div></script>';
    })(ko = templateEditor.ko || (templateEditor.ko = {}));
})(templateEditor || (templateEditor = {}));

var template_page;
(function (template_page) {
    template_page.html = '<div data-bind="event:{           dragenter:function(el, e){ dragEnter(e);},           dragleave:function(el, e){ dragLeave(e);},           dragover:function(el, e){ return false;},           drop:function(el, e){ dragDrop(e);}}     ">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + title"></h4>    <!-- ko foreach: { data: questions, as: \'question\' } -->    <div class="svd_dragover" data-bind="visible:$parent.koDragging() == $index()"></div>    <!-- ko template: { name: \'survey-question\', data: question } -->    <!-- /ko -->    <!-- /ko -->    <div class="well" data-bind="visible:$root.isDesignMode && questions.length == 0">        <span>Please drop a question here.</span>    </div>    <div class="svd_dragover" data-bind="visible:koDragging() == questions.length"></div></div>';
})(template_page || (template_page = {}));

var template_question;
(function (template_question) {
    template_question.html = '<div class="well well-sm" data-bind="attr : {draggable: $root.isDesignMode}, visible: question.koVisible() || $root.isDesignMode, click: $root.isDesignMode ? koOnClick: null,          event:{           dragstart:function(el, e){ dragStart(e); return true; },           dragover:function(el, e){ dragOver(e);},           drop:function(el, e){ dragDrop(e);}         }, css:{svd_q_design_border: $root.isDesignMode, svd_q_selected : koIsSelected}">    <div class="svd_q_copybutton" data-bind="visible: koIsSelected">        <button class="btn btn-primary btn-xs" data-bind="click: $root.copyQuestionClick">Copy</button>    </div>    <div data-bind="css:{svd_q_design: $root.isDesignMode}">        <div class="alert alert-danger" role="alert" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div>                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>                <span data-bind="text:$data.getText()"></span>            </div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="text: question.koNo() +  (question.isRequired ? question.data.requiredText : \'\') + question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            Other (please describe)            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>    </div></div>';
})(template_question || (template_question = {}));

/// <reference path="objectEditor.ts" />
/// <reference path="pagesEditor.ts" />
/// <reference path="textWorker.ts" />
/// <reference path="surveyHelper.ts" />
/// <reference path="surveyEmbedingWindow.ts" />
/// <reference path="objectVerbs.ts" />
/// <reference path="dragdrophelper.ts" />
/// <reference path="templateEditor.ko.html.ts" />
/// <reference path="template_page.html.ts" />
/// <reference path="template_question.html.ts" />
var SurveyEditor;
(function (SurveyEditor_1) {
    var SurveyEditor = (function () {
        function SurveyEditor(renderedElement) {
            if (renderedElement === void 0) { renderedElement = null; }
            this.surveyId = null;
            this.surveyPostId = null;
            this.timeoutId = -1;
            this.questionTypes = Survey.QuestionFactory.Instance.getAllTypes();
            this.koCopiedQuestions = ko.observableArray();
            this.koCanDeleteObject = ko.observable(false);
            var self = this;
            this.koShowSaveButton = ko.observable(false);
            this.saveButtonClick = function () { if (self.saveSurveyFunc)
                self.saveSurveyFunc(); };
            this.koObjects = ko.observableArray();
            this.koSelectedObject = ko.observable();
            this.koSelectedObject.subscribe(function (newValue) { self.selectedObjectChanged(newValue != null ? newValue.value : null); });
            this.surveyObjects = new SurveyEditor_1.SurveyObjects(this.koObjects, this.koSelectedObject);
            this.surveyVerbs = new SurveyEditor_1.SurveyVerbs();
            this.selectedObjectEditor = new SurveyEditor_1.SurveyObjectEditor();
            this.selectedObjectEditor.onPropertyValueChanged.add(function (sender, options) {
                self.onPropertyValueChanged(options.property, options.object, options.newValue);
            });
            this.pagesEditor = new SurveyEditor_1.SurveyPagesEditor(function () { self.addPage(); }, function (page) { self.surveyObjects.selectObject(page); }, function (indexFrom, indexTo) { self.movePage(indexFrom, indexTo); });
            this.surveyEmbeding = new SurveyEditor_1.SurveyEmbedingWindow();
            this.koIsShowDesigner = ko.observable(true);
            this.selectDesignerClick = function () { self.showDesigner(); };
            this.selectEditorClick = function () { self.showJsonEditor(); };
            this.runSurveyClick = function () { self.showLiveSurvey(); };
            this.embedingSurveyClick = function () { self.showSurveyEmbeding(); };
            this.deleteObjectClick = function () { self.deleteCurrentObject(); };
            this.draggingQuestion = function (questionType, e) { self.doDraggingQuestion(questionType, e); };
            this.clickQuestion = function (questionType) { self.doClickQuestion(questionType); };
            this.draggingCopiedQuestion = function (item, e) { self.doDraggingCopiedQuestion(item.json, e); };
            this.clickCopiedQuestion = function (item) { self.doClickCopiedQuestion(item.json); };
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
        SurveyEditor.prototype.loadSurvey = function (surveyId) {
            var self = this;
            new Survey.dxSurveyService().loadSurvey(surveyId, function (success, result, response) {
                if (success && result) {
                    self.text = JSON.stringify(result);
                }
            });
        };
        Object.defineProperty(SurveyEditor.prototype, "text", {
            get: function () {
                if (this.koIsShowDesigner())
                    return this.getSurveyTextFromDesigner();
                return this.jsonEditor != null ? this.jsonEditor.getValue() : "";
            },
            set: function (value) {
                this.textWorker = new SurveyEditor_1.SurveyTextWorker(value);
                if (this.textWorker.isJsonCorrect) {
                    this.showDesigner();
                }
                else {
                    this.setTextValue(value);
                    this.koIsShowDesigner(false);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyEditor.prototype, "saveSurveyFunc", {
            get: function () { return this.saveSurveyFuncValue; },
            set: function (value) {
                this.saveSurveyFuncValue = value;
                this.koShowSaveButton(value != null);
            },
            enumerable: true,
            configurable: true
        });
        SurveyEditor.prototype.setTextValue = function (value) {
            if (this.jsonEditor == null)
                return;
            this.isProcessingImmediately = true;
            this.jsonEditor.setValue(value);
            this.jsonEditor.renderer.updateFull(true);
            this.processJson(value);
            this.isProcessingImmediately = false;
        };
        SurveyEditor.prototype.addPage = function () {
            var name = SurveyEditor_1.SurveyHelper.getNewName(this.survey.pages, "page");
            var page = this.surveyValue.addNewPage(name);
            this.addPageToUI(page);
        };
        SurveyEditor.prototype.movePage = function (indexFrom, indexTo) {
            var page = this.survey.pages[indexFrom];
            this.deleteObject(page);
            this.survey.pages.splice(indexTo, 0, page);
            this.addPageToUI(page);
        };
        SurveyEditor.prototype.addPageToUI = function (page) {
            this.pagesEditor.survey = this.surveyValue;
            this.surveyObjects.addPage(page);
        };
        SurveyEditor.prototype.onQuestionAdded = function (question) {
            var page = this.survey.getPageByQuestion(question);
            this.surveyObjects.addQuestion(page, question);
            this.survey.render();
        };
        SurveyEditor.prototype.onQuestionRemoved = function (question) {
            this.surveyObjects.removeObject(question);
            this.survey.render();
        };
        SurveyEditor.prototype.onPropertyValueChanged = function (property, obj, newValue) {
            var isDefault = property.isDefaultValue(newValue);
            obj[property.name] = newValue;
            if (property.name == "name") {
                this.surveyObjects.nameChanged(obj);
                if (SurveyEditor_1.SurveyHelper.getObjectType(obj) == SurveyEditor_1.ObjType.Page) {
                    this.pagesEditor.changeName(obj);
                }
            }
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
            this.jsonEditor.setValue(this.getSurveyTextFromDesigner());
            this.jsonEditor.focus();
            this.koIsShowDesigner(false);
        };
        SurveyEditor.prototype.getSurveyTextFromDesigner = function () {
            var json = new Survey.JsonObject().toJsonObject(this.survey);
            return new SurveyEditor_1.SurveyJSON5().stringify(json, null, 1);
        };
        SurveyEditor.prototype.selectedObjectChanged = function (obj) {
            var canDeleteObject = false;
            this.selectedObjectEditor.selectedObject = obj;
            this.surveyVerbs.obj = obj;
            var objType = SurveyEditor_1.SurveyHelper.getObjectType(obj);
            if (objType == SurveyEditor_1.ObjType.Page) {
                this.survey.currentPage = obj;
                canDeleteObject = this.survey.pages.length > 1;
            }
            if (objType == SurveyEditor_1.ObjType.Question) {
                this.survey["setselectedQuestion"](obj);
                canDeleteObject = true;
                this.survey.currentPage = this.survey.getPageByQuestion(this.survey["selectedQuestionValue"]);
            }
            else {
                this.survey["setselectedQuestion"](null);
            }
            this.koCanDeleteObject(canDeleteObject);
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
            if (this.surveyValue.isEmpty) {
                this.surveyValue = new Survey.Survey(new SurveyEditor_1.SurveyJSON5().parse(SurveyEditor.defaultNewSurveyText));
            }
            this.survey.mode = "designer";
            this.survey.render(this.surveyjs);
            this.surveyObjects.survey = this.survey;
            this.pagesEditor.survey = this.survey;
            this.pagesEditor.setSelectedPage(this.survey.currentPage);
            this.surveyVerbs.survey = this.survey;
            var self = this;
            this.surveyValue["onSelectedQuestionChanged"].add(function (sender, options) { self.surveyObjects.selectObject(sender["selectedQuestionValue"]); });
            this.surveyValue["onCopyQuestion"].add(function (sender, options) { self.copyQuestion(self.koSelectedObject().value); });
            this.surveyValue.onCurrentPageChanged.add(function (sender, options) { self.pagesEditor.setSelectedPage(sender.currentPage); });
            this.surveyValue.onQuestionAdded.add(function (sender, options) { self.onQuestionAdded(options.question); });
            this.surveyValue.onQuestionRemoved.add(function (sender, options) { self.onQuestionRemoved(options.question); });
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
        SurveyEditor.prototype.doDraggingQuestion = function (questionType, e) {
            var name = SurveyEditor_1.SurveyHelper.getNewName(this.survey.getAllQuestions(), "question");
            new SurveyEditor_1.DragDropHelper(this.survey).startDragNewQuestion(e, questionType, name);
        };
        SurveyEditor.prototype.doDraggingCopiedQuestion = function (json, e) {
            var name = SurveyEditor_1.SurveyHelper.getNewName(this.survey.getAllQuestions(), "question");
            new SurveyEditor_1.DragDropHelper(this.survey).startDragCopiedQuestion(e, name, json);
        };
        SurveyEditor.prototype.doClickQuestion = function (questionType) {
            var name = SurveyEditor_1.SurveyHelper.getNewName(this.survey.getAllQuestions(), "question");
            this.doClickQuestionCore(Survey.QuestionFactory.Instance.createQuestion(questionType, name));
        };
        SurveyEditor.prototype.doClickCopiedQuestion = function (json) {
            var name = SurveyEditor_1.SurveyHelper.getNewName(this.survey.getAllQuestions(), "question");
            var question = Survey.QuestionFactory.Instance.createQuestion(json["type"], name);
            new Survey.JsonObject().toObject(json, question);
            question.name = name;
            this.doClickQuestionCore(question);
        };
        SurveyEditor.prototype.doClickQuestionCore = function (question) {
            var page = this.survey.currentPage;
            var index = -1;
            if (this.survey["selectedQuestionValue"] != null) {
                index = page.questions.indexOf(this.survey["selectedQuestionValue"]) + 1;
            }
            page.addQuestion(question, index);
        };
        SurveyEditor.prototype.deleteCurrentObject = function () {
            this.deleteObject(this.koSelectedObject().value);
        };
        SurveyEditor.prototype.copyQuestion = function (question) {
            var objType = SurveyEditor_1.SurveyHelper.getObjectType(question);
            if (objType != SurveyEditor_1.ObjType.Question)
                return;
            var json = new Survey.JsonObject().toJsonObject(question);
            json.type = question.getType();
            var item = this.getCopiedQuestionByName(question.name);
            if (item) {
                item.json = json;
            }
            else {
                this.koCopiedQuestions.push({ name: question.name, json: json });
            }
            if (this.koCopiedQuestions().length > 3) {
                this.koCopiedQuestions.splice(0, 1);
            }
        };
        SurveyEditor.prototype.getCopiedQuestionByName = function (name) {
            var items = this.koCopiedQuestions();
            for (var i = 0; i < items.length; i++) {
                if (items[i].name == name)
                    return items[i];
            }
            return null;
        };
        SurveyEditor.prototype.deleteObject = function (obj) {
            this.surveyObjects.removeObject(obj);
            var objType = SurveyEditor_1.SurveyHelper.getObjectType(obj);
            if (objType == SurveyEditor_1.ObjType.Page) {
                this.survey.removePage(obj);
                this.pagesEditor.removePage(obj);
            }
            if (objType == SurveyEditor_1.ObjType.Question) {
                this.survey.currentPage.removeQuestion(obj);
                this.survey["setselectedQuestion"](null);
                this.surveyObjects.selectObject(this.survey.currentPage);
            }
            this.survey.render();
        };
        SurveyEditor.prototype.showLiveSurvey = function () {
            if (!this.surveyjsExample)
                return;
            var json = this.getSurveyJSON();
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
        SurveyEditor.prototype.showSurveyEmbeding = function () {
            var json = this.getSurveyJSON();
            this.surveyEmbeding.json = json;
            this.surveyEmbeding.surveyId = this.surveyId;
            this.surveyEmbeding.surveyPostId = this.surveyPostId;
            this.surveyEmbeding.show();
        };
        SurveyEditor.prototype.getSurveyJSON = function () {
            if (this.koIsShowDesigner())
                return new Survey.JsonObject().toJsonObject(this.survey);
            if (this.textWorker.isJsonCorrect)
                return new Survey.JsonObject().toJsonObject(this.textWorker.survey);
            return null;
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
        SurveyEditor.updateTextTimeout = 1000;
        SurveyEditor.defaultNewSurveyText = "{ pages: [ { name: 'page1'}] }";
        return SurveyEditor;
    }());
    SurveyEditor_1.SurveyEditor = SurveyEditor;
    new Survey.SurveyTemplateText().replaceText(template_page.html, "page");
    new Survey.SurveyTemplateText().replaceText(template_question.html, "question");
    Survey.Survey.prototype["onCreating"] = function () {
        this.selectedQuestionValue = null;
        this.onSelectedQuestionChanged = new Survey.Event();
        this.onCopyQuestion = new Survey.Event();
        var self = this;
        this.copyQuestionClick = function () { self.onCopyQuestion.fire(self); };
    };
    Survey.Survey.prototype["setselectedQuestion"] = function (value) {
        if (value == this.selectedQuestionValue)
            return;
        var oldValue = this.selectedQuestionValue;
        this.selectedQuestionValue = value;
        if (oldValue != null) {
            oldValue["onSelectedQuestionChanged"]();
        }
        if (this.selectedQuestionValue != null) {
            this.selectedQuestionValue["onSelectedQuestionChanged"]();
        }
        this.onSelectedQuestionChanged.fire(this, { 'oldSelectedQuestion': oldValue, 'newSelectedQuestion': value });
    };
    Survey.Page.prototype["onCreating"] = function () {
        var self = this;
        this.dragEnterCounter = 0;
        this.koDragging = ko.observable(-1);
        this.koDragging.subscribe(function (newValue) { if (newValue < 0)
            self.dragEnterCounter = 0; });
        this.dragEnter = function (e) { e.preventDefault(); self.dragEnterCounter++; self.doDragEnter(e); };
        this.dragLeave = function (e) { self.dragEnterCounter--; if (self.dragEnterCounter === 0)
            self.koDragging(-1); };
        this.dragDrop = function (e) { self.doDrop(e); };
    };
    Survey.Page.prototype["doDrop"] = function (e) {
        new SurveyEditor_1.DragDropHelper(this.data).doDrop(e);
    };
    Survey.Page.prototype["doDragEnter"] = function (e) {
        if (this.questions.length > 0 || this.koDragging() > 0)
            return;
        if (new SurveyEditor_1.DragDropHelper(this.data).isSurveyDragging(e)) {
            this.koDragging(this.questions.length);
        }
    };
    Survey.QuestionBase.prototype["onCreating"] = function () {
        var self = this;
        this.dragDropHelperValue = null;
        this.dragDropHelper = function () {
            if (this.dragDropHelperValue == null)
                this.dragDropHelperValue = new SurveyEditor_1.DragDropHelper(this.data);
            return this.dragDropHelperValue;
        };
        this.dragOver = function (e) { self.dragDropHelper().doDragDropOver(e, self); };
        this.dragDrop = function (e) { self.dragDropHelper().doDrop(e, self); };
        this.dragStart = function (e) { self.dragDropHelper().startDragQuestion(e, self.name); };
        this.koIsSelected = ko.observable(false);
        this.koOnClick = function () {
            if (self.data == null)
                return;
            self.data["setselectedQuestion"](this);
        };
    };
    Survey.QuestionBase.prototype["onSelectedQuestionChanged"] = function () {
        if (this.data == null)
            return;
        this.koIsSelected(this.data["selectedQuestionValue"] == this);
    };
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
            var hex, i, string = '', delim, // double quote or single quote
            uffff;
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
                                    var propKey = this.isWord(prop) ? prop : this.escapeString(prop);
                                    buffer += propKey + ":" + (this.indentStr ? ' ' : '') + value + ",";
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
    }());
    SurveyEditor.SurveyJSON5 = SurveyJSON5;
})(SurveyEditor || (SurveyEditor = {}));

var SurveyEditor;
(function (SurveyEditor) {
    var SurveyObjectItem = (function () {
        function SurveyObjectItem() {
        }
        return SurveyObjectItem;
    }());
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
            var pageItem = this.createPage(page);
            var index = this.survey.pages.indexOf(page);
            if (index > 0) {
                var prevPage = this.survey.pages[index - 1];
                index = this.getItemIndex(prevPage) + 1;
                index += prevPage.questions.length;
            }
            else {
                index = 1; //0 - Survey
            }
            this.addItem(pageItem, index);
            index++;
            for (var i = 0; i < page.questions.length; i++) {
                var item = this.createQuestion(page.questions[i]);
                this.addItem(item, index + i);
            }
            this.koSelected(pageItem);
        };
        SurveyObjects.prototype.addQuestion = function (page, question) {
            var index = this.getItemIndex(page);
            if (index < 0)
                return;
            var questionIndex = page.questions.indexOf(question) + 1;
            index += questionIndex;
            var item = this.createQuestion(question);
            this.addItem(item, index);
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
            if (SurveyEditor.SurveyHelper.getObjectType(obj) == SurveyEditor.ObjType.Page) {
                var page = obj;
                countToRemove += page.questions.length;
            }
            this.koObjects.splice(index, countToRemove);
        };
        SurveyObjects.prototype.nameChanged = function (obj) {
            var index = this.getItemIndex(obj);
            if (index < 0)
                return;
            this.koObjects()[index].text(this.getText(obj));
        };
        SurveyObjects.prototype.addItem = function (item, index) {
            if (index > this.koObjects().length) {
                this.koObjects.push(item);
            }
            else {
                this.koObjects.splice(index, 0, item);
            }
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
                objs.push(this.createPage(page));
                for (var j = 0; j < page.questions.length; j++) {
                    objs.push(this.createQuestion(page.questions[j]));
                }
            }
            this.koObjects(objs);
            this.koSelected(this.survey);
        };
        SurveyObjects.prototype.createPage = function (page) {
            return this.createItem(page, this.getText(page));
        };
        SurveyObjects.prototype.createQuestion = function (question) {
            return this.createItem(question, this.getText(question));
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
        SurveyObjects.prototype.getText = function (obj) {
            var intend = SurveyObjects.intend;
            if (SurveyEditor.SurveyHelper.getObjectType(obj) != SurveyEditor.ObjType.Page) {
                intend += SurveyObjects.intend;
            }
            return intend + SurveyEditor.SurveyHelper.getObjectName(obj);
        };
        SurveyObjects.intend = "...";
        return SurveyObjects;
    }());
    SurveyEditor.SurveyObjects = SurveyObjects;
})(SurveyEditor || (SurveyEditor = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyYWdkcm9waGVscGVyLnRzIiwib2JqZWN0UHJvcGVydHlBcnJheXMudHMiLCJvYmplY3RQcm9wZXJ0eUl0ZW1WYWx1ZXMudHMiLCJvYmplY3RQcm9wZXJ0eVRyaWdnZXJzLnRzIiwib2JqZWN0UHJvcGVydHlWYWxpZGF0b3JzLnRzIiwic3VydmV5SGVscGVyLnRzIiwib2JqZWN0UHJvcGVydHlUZXh0SXRlbXMudHMiLCJvYmplY3RQcm9wZXJ0eS50cyIsIm9iamVjdEVkaXRvci50cyIsInBhZ2VzRWRpdG9yLnRzIiwidGV4dFdvcmtlci50cyIsInN1cnZleUVtYmVkaW5nV2luZG93LnRzIiwib2JqZWN0VmVyYnMudHMiLCJ0ZW1wbGF0ZUVkaXRvci5rby5odG1sLnRzIiwidGVtcGxhdGVfcGFnZS5odG1sLnRzIiwidGVtcGxhdGVfcXVlc3Rpb24uaHRtbC50cyIsImVkaXRvci50cyIsImpzb241LnRzIiwic3VydmV5T2JqZWN0cy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFlBQVksQ0E2SWxCO0FBN0lELFdBQU8sWUFBWSxFQUFDLENBQUM7SUFDakI7UUFLSSx3QkFBbUIsSUFBb0I7WUFBcEIsU0FBSSxHQUFKLElBQUksQ0FBZ0I7UUFDdkMsQ0FBQztRQUNELHNCQUFXLGtDQUFNO2lCQUFqQixjQUFxQyxNQUFNLENBQWdCLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDOzs7V0FBQTtRQUNoRSw2Q0FBb0IsR0FBM0IsVUFBNEIsS0FBZ0IsRUFBRSxZQUFvQixFQUFFLFlBQW9CO1lBQ3BGLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxTQUFTLEdBQUcsZUFBZSxHQUFHLFlBQVksR0FBRyxnQkFBZ0IsR0FBRyxZQUFZLENBQUMsQ0FBQztRQUNySCxDQUFDO1FBQ00sMENBQWlCLEdBQXhCLFVBQXlCLEtBQWdCLEVBQUUsWUFBb0I7WUFDM0QsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLEVBQUUsY0FB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LENBQUMsRUExSE0sWUFBWSxLQUFaLFlBQVksUUEwSGxCIiwiZmlsZSI6InN1cnZleWVkaXRvci5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIERyYWdEcm9wSGVscGVyIHtcclxuICAgICAgICBzdGF0aWMgZGF0YVN0YXJ0OiBzdHJpbmcgPSBcInN1cnZleWpzLFwiO1xyXG4gICAgICAgIHN0YXRpYyBkcmFnRGF0YTogYW55ID0ge3RleHQ6IFwiXCIsIGpzb246IG51bGwgfTtcclxuICAgICAgICBzdGF0aWMgcHJldkV2ZW50ID0geyBxdWVzdGlvbjogbnVsbCwgeDogLTEsIHk6IC0xIH07XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBkYXRhOiBTdXJ2ZXkuSVN1cnZleSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIDxTdXJ2ZXkuU3VydmV5PnRoaXMuZGF0YTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdGFydERyYWdOZXdRdWVzdGlvbihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25OYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGV2ZW50LCBEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQgKyBcInF1ZXN0aW9udHlwZTpcIiArIHF1ZXN0aW9uVHlwZSArIFwiLHF1ZXN0aW9ubmFtZTpcIiArIHF1ZXN0aW9uTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGFydERyYWdRdWVzdGlvbihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbk5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZXZlbnQsIERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCArIFwicXVlc3Rpb25uYW1lOlwiICsgcXVlc3Rpb25OYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXJ0RHJhZ0NvcGllZFF1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uTmFtZTogc3RyaW5nLCBxdWVzdGlvbkpzb246IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZXZlbnQsIERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCArIFwicXVlc3Rpb25uYW1lOlwiICsgcXVlc3Rpb25OYW1lLCBxdWVzdGlvbkpzb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNTdXJ2ZXlEcmFnZ2luZyhldmVudDogRHJhZ0V2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghZXZlbnQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoZXZlbnQpLnRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuaW5kZXhPZihEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQpID09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkb0RyYWdEcm9wT3ZlcihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICBldmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uIHx8ICF0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpIHx8IHRoaXMuaXNTYW1lUGxhY2UoZXZlbnQsIHF1ZXN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldFF1ZXN0aW9uSW5kZXgoZXZlbnQsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRvRHJvcChldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSA9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LnN0b3BQcm9wYWdhdGlvbikge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1N1cnZleURyYWdnaW5nKGV2ZW50KSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZVtcImtvRHJhZ2dpbmdcIl0oLTEpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldFF1ZXN0aW9uSW5kZXgoZXZlbnQsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIGRhdGFJbmZvID0gdGhpcy5nZXREYXRhSW5mbyhldmVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xlYXJEYXRhKCk7XHJcbiAgICAgICAgICAgIGlmICghZGF0YUluZm8pIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHRhcmdldFF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSBkYXRhSW5mb1tcImpzb25cIl07XHJcbiAgICAgICAgICAgIGlmIChqc29uKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24oanNvbltcInR5cGVcIl0sIG5hbWUpO1xyXG4gICAgICAgICAgICAgICAgbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9PYmplY3QoanNvbiwgdGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24ubmFtZSA9IGRhdGFJbmZvW1wicXVlc3Rpb25uYW1lXCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0UXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFF1ZXN0aW9uID0gPFN1cnZleS5RdWVzdGlvbkJhc2U+dGhpcy5zdXJ2ZXkuZ2V0UXVlc3Rpb25CeU5hbWUoZGF0YUluZm9bXCJxdWVzdGlvbm5hbWVcIl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0UXVlc3Rpb24gJiYgZGF0YUluZm9bXCJxdWVzdGlvbnR5cGVcIl0pIHtcclxuICAgICAgICAgICAgICAgIHRhcmdldFF1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihkYXRhSW5mb1tcInF1ZXN0aW9udHlwZVwiXSwgZGF0YUluZm9bXCJxdWVzdGlvbm5hbWVcIl0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGFyZ2V0UXVlc3Rpb24pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5tb3ZlUXVlc3Rpb25Ubyh0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFF1ZXN0aW9uSW5kZXgoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbikgcmV0dXJuIHBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gdGhpcy5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSA8bnVtYmVyPmV2ZW50LmN1cnJlbnRUYXJnZXRbXCJjbGllbnRIZWlnaHRcIl07XHJcbiAgICAgICAgICAgIHZhciB5ID0gZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lmhhc093blByb3BlcnR5KCdsYXllclgnKSkge1xyXG4gICAgICAgICAgICAgICAgeSA9IGV2ZW50LmxheWVyWSAtIDxudW1iZXI+ZXZlbnQuY3VycmVudFRhcmdldFtcIm9mZnNldFRvcFwiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeSA+IGhlaWdodCAvIDIpIGluZGV4KytcclxuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzU2FtZVBsYWNlKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBwcmV2ID0gRHJhZ0Ryb3BIZWxwZXIucHJldkV2ZW50O1xyXG4gICAgICAgICAgICBpZiAocHJldi5xdWVzdGlvbiAhPSBxdWVzdGlvbiB8fCBNYXRoLmFicyhldmVudC5jbGllbnRYIC0gcHJldi54KSA+IDUgfHwgTWF0aC5hYnMoZXZlbnQuY2xpZW50WSAtIHByZXYueSkgPiA1KSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2LnF1ZXN0aW9uID0gcXVlc3Rpb247XHJcbiAgICAgICAgICAgICAgICBwcmV2LnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgICAgICAgICAgcHJldi55ID0gZXZlbnQuY2xpZW50WTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRFdmVudChldmVudDogRHJhZ0V2ZW50KTogRHJhZ0V2ZW50IHtcclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXSA/IGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXSA6IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1vdmVRdWVzdGlvblRvKHRhcmdldFF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0YXJnZXRRdWVzdGlvbiA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24odGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAocGFnZSkge1xyXG4gICAgICAgICAgICAgICAgcGFnZS5yZW1vdmVRdWVzdGlvbih0YXJnZXRRdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UuYWRkUXVlc3Rpb24odGFyZ2V0UXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXREYXRhSW5mbyhldmVudDogRHJhZ0V2ZW50KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGRhdGEudGV4dC5zdWJzdHIoRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IHRleHQuc3BsaXQoJywnKTtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHtqc29uOiBudWxsfTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXS5zcGxpdCgnOicpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2l0ZW1bMF1dID0gaXRlbVsxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXN1bHQuanNvbiA9IGRhdGEuanNvbjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRZKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IChlbGVtZW50Lm9mZnNldFRvcCAtIGVsZW1lbnQuc2Nyb2xsVG9wICsgZWxlbWVudC5jbGllbnRUb3ApO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IDxIVE1MRWxlbWVudD5lbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldERhdGEoZXZlbnQ6IERyYWdFdmVudCwgdGV4dDogc3RyaW5nLCBqc29uOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudFtcIm9yaWdpbmFsRXZlbnRcIl0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50ID0gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiVGV4dFwiLCB0ZXh0KTtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5lZmZlY3RBbGxvd2VkID0gXCJjb3B5XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSB7IHRleHQ6IHRleHQsIGpzb246IGpzb24gfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXREYXRhKGV2ZW50OiBEcmFnRXZlbnQpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudCA9IGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiVGV4dFwiKTtcclxuICAgICAgICAgICAgICAgIGlmICh0ZXh0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIERyYWdEcm9wSGVscGVyLmRyYWdEYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNsZWFyRGF0YSgpIHtcclxuICAgICAgICAgICAgRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGEgPSB7dGV4dDogXCJcIiwganNvbjogbnVsbH07XHJcbiAgICAgICAgICAgIHZhciBwcmV2ID0gRHJhZ0Ryb3BIZWxwZXIucHJldkV2ZW50O1xyXG4gICAgICAgICAgICBwcmV2LnF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgcHJldi54ID0gLTE7XHJcbiAgICAgICAgICAgIHByZXYueSA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGRlY2xhcmUgdHlwZSBTdXJ2ZXlQcm9wZXJ0eVZhbHVlQ2hhbmdlZENhbGxiYWNrID0gKG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlBcnJheSB7XHJcbiAgICAgICAgcHVibGljIG9iamVjdDogYW55ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IFN1cnZleVByb3BlcnR5VmFsdWVDaGFuZ2VkQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7IH1cclxuICAgIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0UHJvcGVydHlBcnJheXMudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5SXRlbVZhbHVlcyBleHRlbmRzIFN1cnZleVByb3BlcnR5QXJyYXl7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZV86IEFycmF5PGFueT47XHJcbiAgICAgICAgcHVibGljIGtvSXRlbXM6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQ2xlYXJDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFwcGx5Q2xpY2s6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG9uVmFsdWVDaGFuZ2VkOiBTdXJ2ZXlQcm9wZXJ0eVZhbHVlQ2hhbmdlZENhbGxiYWNrKSAge1xyXG4gICAgICAgICAgICBzdXBlcihvblZhbHVlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHNlbGYub25BcHBseUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLkFwcGx5KCk7IH07XHJcbiAgICAgICAgICAgIHNlbGYub25EZWxldGVDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoaXRlbSk7IH07XHJcbiAgICAgICAgICAgIHNlbGYub25DbGVhckNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZUFsbCgpOyB9O1xyXG4gICAgICAgICAgICBzZWxmLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQWRkSXRlbSgpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnZhbHVlXzsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZhbHVlW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1WYWx1ZSA9IGl0ZW07XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVRleHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0udmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSBpdGVtLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1UZXh0ID0gaXRlbS50ZXh0O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCh7IGtvVmFsdWU6IGtvLm9ic2VydmFibGUoaXRlbVZhbHVlKSwga29UZXh0OiBrby5vYnNlcnZhYmxlKGl0ZW1UZXh0KSwga29IYXNFcnJvcjoga28ub2JzZXJ2YWJsZShmYWxzZSkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIEFkZEl0ZW0oKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcy5wdXNoKHsga29WYWx1ZToga28ub2JzZXJ2YWJsZSgpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUoKSwga29IYXNFcnJvcjoga28ub2JzZXJ2YWJsZShmYWxzZSkgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBcHBseSgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzRXJyb3IoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMua29JdGVtcygpLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMua29JdGVtcygpW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0ua29UZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXy5wdXNoKHsgdmFsdWU6IGl0ZW0ua29WYWx1ZSgpLCB0ZXh0OiBpdGVtLmtvVGV4dCgpIH0pO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXy5wdXNoKGl0ZW0ua29WYWx1ZSgpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vblZhbHVlQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlXyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGhhc0Vycm9yKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rb0l0ZW1zKCkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5rb0l0ZW1zKClbaV07XHJcbiAgICAgICAgICAgICAgICBpdGVtLmtvSGFzRXJyb3IoIWl0ZW0ua29WYWx1ZSgpKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCB8fCBpdGVtLmtvSGFzRXJyb3IoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzIGV4dGVuZHMgU3VydmV5UHJvcGVydHlBcnJheSB7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZV86IEFycmF5PGFueT47XHJcbiAgICAgICAgcHVibGljIGtvSXRlbXM6IGFueTtcclxuICAgICAgICBrb1F1ZXN0aW9uczogYW55OyBrb1BhZ2VzOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvU2VsZWN0ZWQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQXBwbHlDbGljazogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IFN1cnZleVByb3BlcnR5VmFsdWVDaGFuZ2VkQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgc3VwZXIob25WYWx1ZUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1F1ZXN0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoc2VsZi5rb1NlbGVjdGVkKCkpOyB9XHJcbiAgICAgICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hZGRJdGVtKCk7IH1cclxuICAgICAgICAgICAgdGhpcy5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwbHkoKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUGFnZXModGhpcy5nZXROYW1lcygoPFN1cnZleS5TdXJ2ZXk+dGhpcy5vYmplY3QpLnBhZ2VzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUXVlc3Rpb25zKHRoaXMuZ2V0TmFtZXMoKDxTdXJ2ZXkuU3VydmV5PnRoaXMub2JqZWN0KS5nZXRBbGxRdWVzdGlvbnMoKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlcig8U3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlPnZhbHVlW2ldLCB0aGlzLmtvUGFnZXMsIHRoaXMua29RdWVzdGlvbnMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5WzBdIDogbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXBwbHkoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IHRoaXMua29JdGVtcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXy5wdXNoKGFycmF5W2ldLmNyZWF0ZVRyaWdnZXIoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWx1ZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy52YWx1ZV8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0TmFtZXMoaXRlbXM6IEFycmF5PGFueT4pOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIG5hbWVzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVtcIm5hbWVcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lcy5wdXNoKGl0ZW1bXCJuYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmFtZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkSXRlbSgpIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyKG5ldyBTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUoKSwgdGhpcy5rb1BhZ2VzLCB0aGlzLmtvUXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2godHJpZ2dlcik7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCh0cmlnZ2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VHJpZ2dlciB7XHJcbiAgICAgICAgYXZhaWxhYmxlT3BlcmF0b3JzID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZW1wdHlcIiwgdGV4dDogXCJpcyBlbXB0eVwiIH0sIHsgbmFtZTogXCJub3RlbXB0eVwiLCB0ZXh0OiBcImlzIG5vdCBlbXB0eVwiIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJlcXVhbFwiLCB0ZXh0OiBcImVxdWFsc1wiIH0sIHsgbmFtZTogXCJub3RlcXVhbFwiLCB0ZXh0OiBcIm5vdCBlcXVhbHNcIiB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiY29udGFpbnNcIiwgdGV4dDogXCJjb250YWluc1wiIH0sIHsgbmFtZTogXCJub3Rjb250YWluc1wiLCB0ZXh0OiBcIm5vdCBjb250YWluc1wiIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJncmVhdGVyXCIsIHRleHQ6IFwiZ3JlYXRlclwiIH0sIHsgbmFtZTogXCJsZXNzXCIsIHRleHQ6IFwibGVzc1wiIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJncmVhdGVyb3JlcXVhbFwiLCB0ZXh0OiBcImdyZWF0ZXIgb3IgZXF1YWxzXCIgfSwgeyBuYW1lOiBcImxlc3NvcmVxdWFsXCIsIHRleHQ6IFwiTGVzcyBvciBFcXVhbHNcIiB9XVxyXG4gICAgICAgIGtvTmFtZTogYW55OyBrb09wZXJhdG9yOiBhbnk7IGtvVmFsdWU6IGFueTtcclxuICAgICAgICBrb1RleHQ6IGFueTsga29Jc1ZhbGlkOiBhbnk7IGtvUmVxdWlyZVZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIHBhZ2VzOiBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzO1xyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvbnM6IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHM7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHRyaWdnZXI6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSwga29QYWdlczogYW55LCBrb1F1ZXN0aW9uczogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29OYW1lID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLm5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvT3BlcmF0b3IgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIub3BlcmF0b3IpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIudmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMoXCJNYWtlIHBhZ2VzIHZpc2libGU6XCIsIGtvUGFnZXMoKSwgdHJpZ2dlci5wYWdlcyk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMoXCJNYWtlIHF1ZXN0aW9ucyB2aXNpYmxlOlwiLCBrb1F1ZXN0aW9ucygpLCB0cmlnZ2VyLnF1ZXN0aW9ucyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb1JlcXVpcmVWYWx1ZSA9IGtvLmNvbXB1dGVkKCgpID0+IHsgcmV0dXJuIHNlbGYua29PcGVyYXRvcigpICE9IFwiZW1wdHlcIiAmJiBzZWxmLmtvT3BlcmF0b3IoKSAhPSBcIm5vdGVtcHR5XCI7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNWYWxpZCA9IGtvLmNvbXB1dGVkKCgpID0+IHsgaWYgKHNlbGYua29OYW1lKCkgJiYgKCFzZWxmLmtvUmVxdWlyZVZhbHVlKCkgfHwgc2VsZi5rb1ZhbHVlKCkpKSByZXR1cm4gdHJ1ZTsgcmV0dXJuIGZhbHNlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1RleHQgPSBrby5jb21wdXRlZCgoKSA9PiB7IHNlbGYua29OYW1lKCk7IHNlbGYua29PcGVyYXRvcigpOyBzZWxmLmtvVmFsdWUoKTsgcmV0dXJuIHNlbGYuZ2V0VGV4dCgpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNyZWF0ZVRyaWdnZXIoKTogU3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBuZXcgU3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlKCk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIubmFtZSA9IHRoaXMua29OYW1lKCk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIub3BlcmF0b3IgPSB0aGlzLmtvT3BlcmF0b3IoKTtcclxuICAgICAgICAgICAgdHJpZ2dlci52YWx1ZSA9IHRoaXMua29WYWx1ZSgpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnBhZ2VzID0gdGhpcy5wYWdlcy5rb0Nob29zZW4oKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5xdWVzdGlvbnMgPSB0aGlzLnF1ZXN0aW9ucy5rb0Nob29zZW4oKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRyaWdnZXI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMua29Jc1ZhbGlkKCkpIHJldHVybiBcIlRoZSB0cmlnZ2VyIGlzIG5vdCBzZXRcIjtcclxuICAgICAgICAgICAgcmV0dXJuIFwiUnVuIGlmICdcIiArIHRoaXMua29OYW1lKCkgKyBcIicgXCIgKyB0aGlzLmdldE9wZXJhdG9yVGV4dCgpICsgdGhpcy5nZXRWYWx1ZVRleHQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRPcGVyYXRvclRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIG9wID0gdGhpcy5rb09wZXJhdG9yKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5hdmFpbGFibGVPcGVyYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmF2YWlsYWJsZU9wZXJhdG9yc1tpXS5uYW1lID09IG9wKSByZXR1cm4gdGhpcy5hdmFpbGFibGVPcGVyYXRvcnNbaV0udGV4dDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gb3A7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VmFsdWVUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5rb1JlcXVpcmVWYWx1ZSgpKSByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIFwiIFwiICsgdGhpcy5rb1ZhbHVlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMge1xyXG4gICAgICAgIGtvT2JqZWN0czogYW55O1xyXG4gICAgICAgIGtvQ2hvb3NlbjogYW55O1xyXG4gICAgICAgIGtvU2VsZWN0ZWQ6IGFueTtcclxuICAgICAgICBrb0Nob29zZW5TZWxlY3RlZDogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGl0bGU6IHN0cmluZywgYWxsT2JqZWN0czogQXJyYXk8c3RyaW5nPiwgY2hvb3Nlbk9iamVjdHM6IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICAgICAgdGhpcy5rb0Nob29zZW4gPSBrby5vYnNlcnZhYmxlQXJyYXkoY2hvb3Nlbk9iamVjdHMpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhbGxPYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGFsbE9iamVjdHNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoY2hvb3Nlbk9iamVjdHMuaW5kZXhPZihpdGVtKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KGFycmF5KTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvQ2hvb3NlblNlbGVjdGVkID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMub25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kZWxldGVJdGVtKCk7IH1cclxuICAgICAgICAgICAgdGhpcy5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmFkZEl0ZW0oKTsgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGRlbGV0ZUl0ZW0oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlSXRlbXModGhpcy5rb0Nob29zZW5TZWxlY3RlZCgpLCB0aGlzLmtvQ2hvb3NlbiwgdGhpcy5rb09iamVjdHMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZEl0ZW0oKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY2hhbmdlSXRlbXModGhpcy5rb1NlbGVjdGVkKCksIHRoaXMua29PYmplY3RzLCB0aGlzLmtvQ2hvb3Nlbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlSXRlbXMoaXRlbTogc3RyaW5nLCByZW1vdmVkRnJvbTogYW55LCBhZGRUbzogYW55KSB7XHJcbiAgICAgICAgICAgIHJlbW92ZWRGcm9tLnJlbW92ZShpdGVtKTtcclxuICAgICAgICAgICAgYWRkVG8ucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgcmVtb3ZlZEZyb20uc29ydCgpO1xyXG4gICAgICAgICAgICBhZGRUby5zb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VmFsaWRhdG9ycyBleHRlbmRzIFN1cnZleVByb3BlcnR5QXJyYXkge1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVfOiBBcnJheTxhbnk+O1xyXG4gICAgICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RFZGl0b3I6IFN1cnZleU9iamVjdEVkaXRvcjtcclxuICAgICAgICBwdWJsaWMga29JdGVtczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1NlbGVjdGVkOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGF2YWlsYWJsZVZhbGlkYXRvcnM6IEFycmF5PHN0cmluZz4gPSBbXTtcclxuICAgICAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQXBwbHlDbGljazogYW55O1xyXG4gICAgICAgIHByaXZhdGUgdmFsaWRhdG9yc0NsYXNzZXM6IEFycmF5PFN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcz4gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG9uVmFsdWVDaGFuZ2VkOiBTdXJ2ZXlQcm9wZXJ0eVZhbHVlQ2hhbmdlZENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9uVmFsdWVDaGFuZ2VkKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yID0gbmV3IFN1cnZleU9iamVjdEVkaXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChvcHRpb25zLnByb3BlcnR5LCBvcHRpb25zLm9iamVjdCwgb3B0aW9ucy5uZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkID0ga28ub2JzZXJ2YWJsZShudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdEVkaXRvci5zZWxlY3RlZE9iamVjdCA9IG5ld1ZhbHVlICE9IG51bGwgPyBuZXdWYWx1ZS52YWxpZGF0b3IgOiBudWxsOyB9KTtcclxuICAgICAgICAgICAgdGhpcy52YWxpZGF0b3JzQ2xhc3NlcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhcInN1cnZleXZhbGlkYXRvclwiLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5hdmFpbGFibGVWYWxpZGF0b3JzID0gdGhpcy5nZXRBdmFpbGFibGVWYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHRoaXMub25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShzZWxmLmtvU2VsZWN0ZWQoKSk7IH1cclxuICAgICAgICAgICAgdGhpcy5vbkFkZENsaWNrID0gZnVuY3Rpb24gKHZhbGlkYXRvclR5cGUpIHsgc2VsZi5hZGRJdGVtKHZhbGlkYXRvclR5cGUpOyB9XHJcbiAgICAgICAgICAgIHRoaXMub25BcHBseUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmFwcGx5KCk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMudmFsdWVfOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8ICFBcnJheS5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSB2YWx1ZTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3IgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh2YWx1ZVtpXS5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICAgICAganNvbk9iai50b09iamVjdCh2YWx1ZVtpXSwgdmFsaWRhdG9yKTtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSh2YWxpZGF0b3IpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5WzBdIDogbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXBwbHkoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IHRoaXMua29JdGVtcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXy5wdXNoKGFycmF5W2ldLnZhbGlkYXRvcik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWx1ZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy52YWx1ZV8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkSXRlbSh2YWxpZGF0b3JUeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIG5ld1ZhbGlkYXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0oU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3ModmFsaWRhdG9yVHlwZSkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMucHVzaChuZXdWYWxpZGF0b3IpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQobmV3VmFsaWRhdG9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRBdmFpbGFibGVWYWxpZGF0b3JzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy52YWxpZGF0b3JzQ2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy52YWxpZGF0b3JzQ2xhc3Nlc1tpXS5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHksIG9iajogYW55LCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtvU2VsZWN0ZWQoKSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCgpLnZhbGlkYXRvcltwcm9wZXJ0eS5uYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtIHtcclxuICAgICAgICBwdWJsaWMgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWxpZGF0b3I6IFN1cnZleS5TdXJ2ZXlWYWxpZGF0b3IpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdmFsaWRhdG9yLmdldFR5cGUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgZW51bSBPYmpUeXBlIHsgVW5rbm93biwgU3VydmV5LCBQYWdlLCBRdWVzdGlvbiB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5SGVscGVyIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldE5ld05hbWUob2JqczogQXJyYXk8YW55PiwgYmFzZU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBoYXNoID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaGFzaFtvYmpzW2ldLm5hbWVdID0gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgbnVtID0gMTtcclxuICAgICAgICAgICAgd2hpbGUgKHRydWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICghaGFzaFtiYXNlTmFtZSArIG51bS50b1N0cmluZygpXSkgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBudW0rKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYmFzZU5hbWUgKyBudW0udG9TdHJpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3RUeXBlKG9iajogYW55KTogT2JqVHlwZSB7XHJcbiAgICAgICAgICAgIGlmICghb2JqIHx8ICFvYmpbXCJnZXRUeXBlXCJdKSByZXR1cm4gT2JqVHlwZS5Vbmtub3duO1xyXG4gICAgICAgICAgICBpZiAob2JqLmdldFR5cGUoKSA9PSBcInBhZ2VcIikgcmV0dXJuIE9ialR5cGUuUGFnZTtcclxuICAgICAgICAgICAgaWYgKG9iai5nZXRUeXBlKCkgPT0gXCJzdXJ2ZXlcIikgcmV0dXJuIE9ialR5cGUuU3VydmV5O1xyXG4gICAgICAgICAgICBpZiAob2JqW1wia29WYWx1ZVwiXSkgcmV0dXJuIE9ialR5cGUuUXVlc3Rpb247XHJcbiAgICAgICAgICAgIHJldHVybiBPYmpUeXBlLlVua25vd247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqZWN0TmFtZShvYmo6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChvYmpbXCJuYW1lXCJdKSByZXR1cm4gb2JqW1wibmFtZVwiXTtcclxuICAgICAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopO1xyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSAhPSBPYmpUeXBlLlBhZ2UpIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IDxTdXJ2ZXkuU3VydmV5Pig8U3VydmV5LlBhZ2U+b2JqKS5kYXRhO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBkYXRhLnBhZ2VzLmluZGV4T2YoPFN1cnZleS5QYWdlPm9iaik7XHJcbiAgICAgICAgICAgIHJldHVybiBcIltQYWdlIFwiICsgKGluZGV4ICsgMSkgKyBcIl1cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0UHJvcGVydHlBcnJheXMudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VydmV5SGVscGVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5VmFsaWRhdG9ycy50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUZXh0SXRlbXMgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUFycmF5IHtcclxuICAgICAgICBwcml2YXRlIHZhbHVlXzogQXJyYXk8YW55PjtcclxuICAgICAgICBwdWJsaWMga29JdGVtczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BcHBseUNsaWNrOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvblZhbHVlQ2hhbmdlZDogU3VydmV5UHJvcGVydHlWYWx1ZUNoYW5nZWRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICBzdXBlcihvblZhbHVlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHNlbGYub25BcHBseUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLkFwcGx5KCk7IH07XHJcbiAgICAgICAgICAgIHNlbGYub25EZWxldGVDbGljayA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoaXRlbSk7IH07XHJcbiAgICAgICAgICAgIHNlbGYub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5BZGRJdGVtKCk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMudmFsdWVfOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8ICFBcnJheS5pc0FycmF5KHZhbHVlKSkgdmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSB2YWx1ZTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdmFsdWVbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgZWRpdEl0ZW0gPSB7IGtvTmFtZToga28ub2JzZXJ2YWJsZShpdGVtLm5hbWUpLCBrb1RpdGxlOiBrby5vYnNlcnZhYmxlKGl0ZW0udGl0bGUpIH07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoZWRpdEl0ZW0sIGl0ZW0udmFsaWRhdG9ycyk7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKGVkaXRJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgQWRkSXRlbSgpIHtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5rb0l0ZW1zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIG9ianMucHVzaCh7IG5hbWU6IGFycmF5W2ldLmtvTmFtZSgpIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBlZGl0SXRlbSA9IHsga29OYW1lOiBrby5vYnNlcnZhYmxlKFN1cnZleUhlbHBlci5nZXROZXdOYW1lKG9ianMsIFwidGV4dFwiKSksIGtvVGl0bGU6IGtvLm9ic2VydmFibGUoKSB9O1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoZWRpdEl0ZW0sIFtdKTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2goZWRpdEl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgQXBwbHkoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rb0l0ZW1zKCkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5rb0l0ZW1zKClbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVRleHQgPSBuZXcgU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0oaXRlbS5rb05hbWUoKSwgaXRlbS5rb1RpdGxlKCkpO1xyXG4gICAgICAgICAgICAgICAgaXRlbVRleHQudmFsaWRhdG9ycyA9IGl0ZW0udmFsaWRhdG9ycztcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVfLnB1c2goaXRlbVRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKHRoaXMudmFsdWVfKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVZhbGlkYXRvcnNFZGl0b3IoaXRlbTogYW55LCB2YWxpZGF0b3JzOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIGl0ZW0udmFsaWRhdG9ycyA9IHZhbGlkYXRvcnMuc2xpY2UoKTtcclxuICAgICAgICAgICAgdmFyIG9uSXRlbUNoYW5nZWQgPSBmdW5jdGlvbiAobmV3VmFsdWU6IGFueSkgeyBpdGVtLnZhbGlkYXRvcnMgPSBuZXdWYWx1ZTsgaXRlbS5rb1RleHQoXCJbIEl0ZW1zOiBcIiArIG5ld1ZhbHVlLmxlbmd0aCArIFwiIF1cIik7IH07XHJcbiAgICAgICAgICAgIGl0ZW0uYXJyYXlFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzKChuZXdWYWx1ZTogYW55KSA9PiB7IG9uSXRlbUNoYW5nZWQobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICAgICAgaXRlbS5hcnJheUVkaXRvci5vYmplY3QgPSBpdGVtO1xyXG4gICAgICAgICAgICBpdGVtLmFycmF5RWRpdG9yLnRpdGxlKFwiRWRpdCBwcm9wZXJ0eSAnVmFsaWRhdG9ycydcIik7XHJcbiAgICAgICAgICAgIGl0ZW0uYXJyYXlFZGl0b3IudmFsdWUgPSBpdGVtLnZhbGlkYXRvcnM7XHJcbiAgICAgICAgICAgIGl0ZW0ua29UZXh0ID0ga28ub2JzZXJ2YWJsZShcIlsgSXRlbXM6IFwiICsgdmFsaWRhdG9ycy5sZW5ndGggKyBcIiBdXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eUl0ZW1WYWx1ZXMudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0UHJvcGVydHlUcmlnZ2Vycy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eVZhbGlkYXRvcnMudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0UHJvcGVydHlUZXh0SXRlbXMudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZGVjbGFyZSB0eXBlIFN1cnZleU9uUHJvcGVydHlDaGFuZ2VkQ2FsbGJhY2sgPSAocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5LCBuZXdWYWx1ZTogYW55KSA9PiB2b2lkO1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgcHJpdmF0ZSBvYmplY3RWYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZVVwZGF0aW5nOiBib29sZWFuO1xyXG4gICAgICAgIHB1YmxpYyBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGtvVmFsdWU6IGFueTtcclxuICAgICAgICBwdWJsaWMga29UZXh0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGFycmF5RWRpdG9yOiBTdXJ2ZXlQcm9wZXJ0eUFycmF5O1xyXG4gICAgICAgIHB1YmxpYyBtb2RhbE5hbWU6IHN0cmluZzsgXHJcbiAgICAgICAgcHVibGljIG1vZGFsTmFtZVRhcmdldDogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBrb0lzRGVmYXVsdDogYW55O1xyXG4gICAgICAgIHB1YmxpYyBlZGl0b3JUeXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGJhc2VFZGl0b3JUeXBlOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXM6IEFycmF5PGFueT47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb25Qcm9wZXJ0eUNoYW5nZWQ6IFN1cnZleU9uUHJvcGVydHlDaGFuZ2VkQ2FsbGJhY2sgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMubmFtZSA9IHRoaXMucHJvcGVydHkubmFtZTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmVkaXRvclR5cGUgPSBwcm9wZXJ0eS50eXBlO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXMgPSBwcm9wZXJ0eS5jaG9pY2VzO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZWRpdG9yVHlwZSA9IFwiZHJvcGRvd25cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIgb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChuZXdWYWx1ZTogYW55KSB7IHNlbGYua29WYWx1ZShuZXdWYWx1ZSk7IH07XHJcbiAgICAgICAgICAgIHRoaXMubW9kYWxOYW1lID0gXCJtb2RlbEVkaXRvclwiICsgdGhpcy5lZGl0b3JUeXBlICsgdGhpcy5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLm1vZGFsTmFtZVRhcmdldCA9IFwiI1wiICsgdGhpcy5tb2RhbE5hbWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvclR5cGUgPT0gXCJpdGVtdmFsdWVzXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzKChuZXdWYWx1ZTogYW55KSA9PiB7IG9uSXRlbUNoYW5nZWQobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JUeXBlID09IFwidHJpZ2dlcnNcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzKChuZXdWYWx1ZTogYW55KSA9PiB7IG9uSXRlbUNoYW5nZWQobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JUeXBlID09IFwidmFsaWRhdG9yc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5RWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9ycygobmV3VmFsdWU6IGFueSkgPT4geyBvbkl0ZW1DaGFuZ2VkKG5ld1ZhbHVlKTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZWRpdG9yVHlwZSA9PSBcInRleHRpdGVtc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5RWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VGV4dEl0ZW1zKChuZXdWYWx1ZTogYW55KSA9PiB7IG9uSXRlbUNoYW5nZWQobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmJhc2VFZGl0b3JUeXBlID0gdGhpcy5hcnJheUVkaXRvciAhPSBudWxsID8gXCJhcnJheVwiIDogdGhpcy5lZGl0b3JUeXBlO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub2JqZWN0ID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9iamVjdFtzZWxmLm5hbWVdID09IG5ld1ZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZiAob25Qcm9wZXJ0eUNoYW5nZWQgIT0gbnVsbCAmJiAhc2VsZi5pc1ZhbHVlVXBkYXRpbmcpIG9uUHJvcGVydHlDaGFuZ2VkKHNlbGYsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyByZXR1cm4gc2VsZi5nZXRWYWx1ZVRleHQoc2VsZi5rb1ZhbHVlKCkpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzRGVmYXVsdCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgcmV0dXJuIHNlbGYucHJvcGVydHkuaXNEZWZhdWx0VmFsdWUoc2VsZi5rb1ZhbHVlKCkpOyB9KTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLm9iamVjdFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBvYmplY3QodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLm9iamVjdFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmFsdWUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZVZhbHVlKCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLmdldFZhbHVlKCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcnJheUVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvci5vYmplY3QgPSB0aGlzLm9iamVjdDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IudGl0bGUoXCJFZGl0IHByb3BlcnR5ICdcIiArIHRoaXMucHJvcGVydHkubmFtZSArIFwiJ1wiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IudmFsdWUgPSB0aGlzLmtvVmFsdWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0VmFsdWUoKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucHJvcGVydHkuaGFzVG9Vc2VHZXRWYWx1ZSkgcmV0dXJuIHRoaXMucHJvcGVydHkuZ2V0VmFsdWUodGhpcy5vYmplY3QpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3RbdGhpcy5uYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFZhbHVlVGV4dCh2YWx1ZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlsgSXRlbXM6IFwiKyB2YWx1ZS5sZW5ndGggKyBcIiBdXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eS50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlPYmplY3RFZGl0b3Ige1xyXG4gICAgICAgIHByaXZhdGUgc2VsZWN0ZWRPYmplY3RWYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1Byb3BlcnRpZXM6IGFueTtcclxuICAgICAgICBwdWJsaWMga29BY3RpdmVQcm9wZXJ0eTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb0hhc09iamVjdDogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvblByb3BlcnR5VmFsdWVDaGFuZ2VkOiBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5T2JqZWN0RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5T2JqZWN0RWRpdG9yLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzT2JqZWN0ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNlbGVjdGVkT2JqZWN0KCk6IGFueSB7IHJldHVybiB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHNlbGVjdGVkT2JqZWN0KHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzT2JqZWN0KHZhbHVlICE9IG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydHlFZGl0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5rb1Byb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY2hhbmdlQWN0aXZlUHJvcGVydHkocHJvcGVydHk6IFN1cnZleU9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eShwcm9wZXJ0eSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBPYmplY3RDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXNPYmplY3QoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZVByb3BlcnRpZXMoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zZWxlY3RlZE9iamVjdCB8fCAhdGhpcy5zZWxlY3RlZE9iamVjdC5nZXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUHJvcGVydGllcyhbXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkobnVsbCk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKHRoaXMuc2VsZWN0ZWRPYmplY3QuZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgcHJvcGVydGllcy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS5uYW1lID09IGIubmFtZSkgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS5uYW1lID4gYi5uYW1lKSByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHZhciBvYmplY3RQcm9wZXJ0aWVzID0gW107XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdmFyIHByb3BFdmVudCA9IChwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHksIG5ld1ZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgcHJvcGVydHk6IHByb3BlcnR5LnByb3BlcnR5LCBvYmplY3Q6IHByb3BlcnR5Lm9iamVjdCwgbmV3VmFsdWU6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5jYW5TaG93UHJvcGVydHkocHJvcGVydGllc1tpXSkpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iamVjdFByb3BlcnR5ID0gbmV3IFN1cnZleU9iamVjdFByb3BlcnR5KHByb3BlcnRpZXNbaV0sIHByb3BFdmVudCk7XHJcbiAgICAgICAgICAgICAgICBvYmplY3RQcm9wZXJ0aWVzLnB1c2gob2JqZWN0UHJvcGVydHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzKG9iamVjdFByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkodGhpcy5nZXRQcm9wZXJ0eUVkaXRvcihcIm5hbWVcIikpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY2FuU2hvd1Byb3BlcnR5KHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gcHJvcGVydHkubmFtZTtcclxuICAgICAgICAgICAgaWYgKG5hbWUgPT0gJ3F1ZXN0aW9ucycgfHwgbmFtZSA9PSAncGFnZXMnKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlUHJvcGVydGllc09iamVjdCgpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmtvUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXNbaV0ub2JqZWN0ID0gdGhpcy5zZWxlY3RlZE9iamVjdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIlxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGRlY2xhcmUgdHlwZSBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2sgPSAoKSA9PiB2b2lkO1xyXG4gICAgZGVjbGFyZSB0eXBlIFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjayA9IChwYWdlOiBTdXJ2ZXkuUGFnZSkgPT4gdm9pZDtcclxuICAgIGRlY2xhcmUgdHlwZSBTdXJ2ZXlNb3ZlUGFnZUNhbGxiYWNrID0gKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpID0+IHZvaWQ7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UGFnZXNFZGl0b3Ige1xyXG4gICAgICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG4gICAgICAgIGtvUGFnZXM6IGFueTtcclxuICAgICAgICBrb0lzVmFsaWQ6IGFueTtcclxuICAgICAgICBzZWxlY3RQYWdlQ2xpY2s6IGFueTtcclxuICAgICAgICBvbkFkZE5ld1BhZ2VDYWxsYmFjazogU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrO1xyXG4gICAgICAgIG9uU2VsZWN0UGFnZUNhbGxiYWNrOiBTdXJ2ZXlTZWxlY3RQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgb25Nb3ZlUGFnZUNhbGxiYWNrOiBTdXJ2ZXlNb3ZlUGFnZUNhbGxiYWNrO1xyXG4gICAgICAgIGRyYWdnaW5nUGFnZTogU3VydmV5LlBhZ2UgPSBudWxsO1xyXG4gICAgICAgIGRyYWdTdGFydDogYW55OyBkcmFnT3ZlcjogYW55OyBkcmFnRW5kOiBhbnk7IGRyYWdEcm9wOiBhbnk7IFxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihvbkFkZE5ld1BhZ2VDYWxsYmFjazogU3VydmV5QWRkTmV3UGFnZUNhbGxiYWNrID0gbnVsbCwgb25TZWxlY3RQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjayA9IG51bGwsXHJcbiAgICAgICAgICAgIG9uTW92ZVBhZ2VDYWxsYmFjazogU3VydmV5TW92ZVBhZ2VDYWxsYmFjayA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1BhZ2VzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc1ZhbGlkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2sgPSBvbkFkZE5ld1BhZ2VDYWxsYmFjaztcclxuICAgICAgICAgICAgdGhpcy5vblNlbGVjdFBhZ2VDYWxsYmFjayA9IG9uU2VsZWN0UGFnZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICB0aGlzLm9uTW92ZVBhZ2VDYWxsYmFjayA9IG9uTW92ZVBhZ2VDYWxsYmFjaztcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdFBhZ2VDbGljayA9IGZ1bmN0aW9uKHBhZ2VJdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vblNlbGVjdFBhZ2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYub25TZWxlY3RQYWdlQ2FsbGJhY2socGFnZUl0ZW0ucGFnZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kcmFnU3RhcnQgPSBmdW5jdGlvbiAoZWw6IFN1cnZleS5QYWdlKSB7IHNlbGYuZHJhZ2dpbmdQYWdlID0gZWw7IH07XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ092ZXIgPSBmdW5jdGlvbiAoZWw6IFN1cnZleS5QYWdlKSB7ICB9O1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdFbmQgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZHJhZ2dpbmdQYWdlID0gbnVsbDsgfTtcclxuICAgICAgICAgICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlbDogU3VydmV5LlBhZ2UpIHsgc2VsZi5tb3ZlRHJhZ2dpbmdQYWdlVG8oZWwpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc1ZhbGlkKHRoaXMuc3VydmV5VmFsdWUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFNlbGVjdGVkUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFnZXMgPSB0aGlzLmtvUGFnZXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcGFnZXNbaV0ua29TZWxlY3RlZChwYWdlc1tpXS5wYWdlID09IHBhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGROZXdQYWdlQ2xpY2soKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQWRkTmV3UGFnZUNhbGxiYWNrKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbW92ZVBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5UGFnZShwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29QYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGFuZ2VOYW1lKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SW5kZXhCeVBhZ2UocGFnZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUGFnZXMoKVtpbmRleF0udGl0bGUoU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUocGFnZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRJbmRleEJ5UGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZXNbaV0ucGFnZSA9PSBwYWdlKSByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQYWdlcygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1BhZ2VzKFtdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcGFnZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZToga28ub2JzZXJ2YWJsZShTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSksIHBhZ2U6IHBhZ2UsIGtvU2VsZWN0ZWQ6IGtvLm9ic2VydmFibGUoZmFsc2UpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMocGFnZXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1vdmVEcmFnZ2luZ1BhZ2VUbyh0b1BhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIGlmICh0b1BhZ2UgPT0gbnVsbCB8fCB0b1BhZ2UgPT0gdGhpcy5kcmFnZ2luZ1BhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmdQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnZ2luZ1BhZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmtvUGFnZXMoKS5pbmRleE9mKHRoaXMuZHJhZ2dpbmdQYWdlKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4VG8gPSB0aGlzLmtvUGFnZXMoKS5pbmRleE9mKHRvUGFnZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uTW92ZVBhZ2VDYWxsYmFjaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbk1vdmVQYWdlQ2FsbGJhY2soaW5kZXgsIGluZGV4VG8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBjbGFzcyBUZXh0UGFyc2VyUHJvcGVyeSB7XHJcbiAgICAgICAgaXNGb3VuZDogYm9vbGVhbjtcclxuICAgICAgICBwcm9wZXJ0aWVzQ291bnQ6IG51bWJlcjtcclxuICAgICAgICBzdGFydDogbnVtYmVyO1xyXG4gICAgICAgIGVuZDogbnVtYmVyO1xyXG4gICAgICAgIHZhbHVlU3RhcnQ6IG51bWJlcjtcclxuICAgICAgICB2YWx1ZUVuZDogbnVtYmVyO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUZXh0V29ya2VyIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIG5ld0xpbmVDaGFyOiBzdHJpbmc7XHJcbiAgICAgICAgcHVibGljIGVycm9yczogQXJyYXk8YW55PjtcclxuICAgICAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG4gICAgICAgIHByaXZhdGUganNvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlPYmplY3RzOiBBcnJheTxhbnk+O1xyXG4gICAgICAgIHByaXZhdGUgaXNTdXJ2ZXlBc1BhZ2U6IGJvb2xlYW47XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRleHQgfHwgdGhpcy50ZXh0LnRyaW0oKSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSBcInt9XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNKc29uQ29ycmVjdCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWUgIT0gbnVsbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBwcm9jZXNzKCkge1xyXG4gICAgICAgICAgICB0cnkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qc29uVmFsdWUgPSBuZXcgU3VydmV5SlNPTjUoMSkucGFyc2UodGhpcy50ZXh0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goeyBwb3M6IHsgc3RhcnQ6IGVycm9yLmF0LCBlbmQ6IC0xIH0sIHRleHQ6IGVycm9yLm1lc3NhZ2UgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuanNvblZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSnNvblBvc2l0aW9ucyh0aGlzLmpzb25WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkodGhpcy5qc29uVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9ycyAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHsgcG9zOiB7IHN0YXJ0OiBlcnJvci5hdCwgZW5kOiAtMSB9LCB0ZXh0OiBlcnJvci5nZXRGdWxsRGVzY3JpcHRpb24oKSB9KTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzID0gdGhpcy5jcmVhdGVTdXJ2ZXlPYmplY3RzKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQodGhpcy5zdXJ2ZXlPYmplY3RzKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCh0aGlzLmVycm9ycyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlSnNvblBvc2l0aW9ucyhqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAganNvbk9ialtcInBvc1wiXVtcInNlbGZcIl0gPSBqc29uT2JqO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGpzb25PYmpba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmIChvYmogJiYgb2JqW1wicG9zXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAganNvbk9ialtcInBvc1wiXVtrZXldID0gb2JqW1wicG9zXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlSnNvblBvc2l0aW9ucyhvYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlU3VydmV5T2JqZWN0cygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB0aGlzLmlzU3VydmV5QXNQYWdlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPT0gMCAmJiAhcGFnZVtcInBvc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBhZ2VbXCJwb3NcIl0gPSB0aGlzLnN1cnZleVZhbHVlW1wicG9zXCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaXNTdXJ2ZXlBc1BhZ2UgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gocGFnZS5xdWVzdGlvbnNbal0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQob2JqZWN0czogYW55W10pIHtcclxuICAgICAgICAgICAgaWYgKG9iamVjdHMgPT0gbnVsbCB8fCBvYmplY3RzLmxlbmd0aCA9PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwb3NpdGlvbiA9IHsgcm93OiAwLCBjb2x1bW46IDAgfTtcclxuICAgICAgICAgICAgdmFyIGF0T2JqZWN0c0FycmF5ID0gdGhpcy5nZXRBdEFycmF5KG9iamVjdHMpO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRBdDogbnVtYmVyID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhdE9iamVjdHNBcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGF0ID0gYXRPYmplY3RzQXJyYXlbaV0uYXQ7XHJcbiAgICAgICAgICAgICAgICBwb3NpdGlvbiA9IHRoaXMuZ2V0UG9zdGlvbkJ5Q2hhcnRBdChwb3NpdGlvbiwgc3RhcnRBdCwgYXQpO1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IGF0T2JqZWN0c0FycmF5W2ldLm9iajtcclxuICAgICAgICAgICAgICAgIGlmICghb2JqLnBvc2l0aW9uKSBvYmoucG9zaXRpb24gPSB7fTtcclxuICAgICAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLnN0YXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLnN0YXJ0ID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChhdCA9PSBvYmoucG9zLmVuZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmoucG9zaXRpb24uZW5kID0gcG9zaXRpb247XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgc3RhcnRBdCA9IGF0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UG9zdGlvbkJ5Q2hhcnRBdChzdGFydFBvc2l0aW9uOiBBY2VBamF4LlBvc2l0aW9uLCBzdGFydEF0OiBudW1iZXIsIGF0OiBudW1iZXIpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0geyByb3c6IHN0YXJ0UG9zaXRpb24ucm93LCBjb2x1bW46IHN0YXJ0UG9zaXRpb24uY29sdW1uIH07XHJcbiAgICAgICAgICAgIHZhciBjdXJDaGFyID0gc3RhcnRBdDtcclxuICAgICAgICAgICAgd2hpbGUgKGN1ckNoYXIgPCBhdCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudGV4dC5jaGFyQXQoY3VyQ2hhcikgPT0gU3VydmV5VGV4dFdvcmtlci5uZXdMaW5lQ2hhcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5yb3crKztcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuY29sdW1uID0gMDtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmNvbHVtbisrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgY3VyQ2hhcisrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0QXRBcnJheShvYmplY3RzOiBhbnlbXSk6IGFueVtdIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBvYmplY3RzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBvcyA9IG9iai5wb3M7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXBvcykgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IGF0OiBwb3Muc3RhcnQsIG9iajogb2JqIH0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBvcy5lbmQgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBhdDogcG9zLmVuZCwgb2JqOiBvYmogfSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KChlbDEsIGVsMikgPT4ge1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsMS5hdCA+IGVsMi5hdCkgcmV0dXJuIDE7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwxLmF0IDwgZWwyLmF0KSByZXR1cm4gLTE7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5RW1iZWRpbmdXaW5kb3cge1xyXG4gICAgICAgIHByaXZhdGUganNvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0hlYWQ6IEFjZUFqYXguRWRpdG9yO1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5RW1iZWRpbmdKYXZhOiBBY2VBamF4LkVkaXRvcjtcclxuICAgICAgICBwdWJsaWMgc3VydmV5SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHN1cnZleVBvc3RJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBrb1Nob3dBc1dpbmRvdzogYW55O1xyXG4gICAgICAgIGtvU2NyaXB0VXNpbmc6IGFueTtcclxuICAgICAgICBrb0hhc0lkczogYW55O1xyXG4gICAgICAgIGtvTG9hZFN1cnZleTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29TaG93QXNXaW5kb3cgPSBrby5vYnNlcnZhYmxlKFwicGFnZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nID0ga28ub2JzZXJ2YWJsZShcImJvb3RzdHJhcFwiKTtcclxuICAgICAgICAgICAgdGhpcy5rb0hhc0lkcyA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmtvTG9hZFN1cnZleSA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2hvd0FzV2luZG93LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zdXJ2ZXlFbWJlZGluZ0phdmEuc2V0VmFsdWUoc2VsZi5nZXRKYXZhVGV4dCgpKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29TY3JpcHRVc2luZy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2V0SGVhZFRleHQoKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Mb2FkU3VydmV5LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zdXJ2ZXlFbWJlZGluZ0phdmEuc2V0VmFsdWUoc2VsZi5nZXRKYXZhVGV4dCgpKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID0gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBqc29uKCk6IGFueSB7IHJldHVybiB0aGlzLmpzb25WYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQganNvbih2YWx1ZTogYW55KSB7IHRoaXMuanNvblZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2hvdygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkID0gdGhpcy5jcmVhdGVFZGl0b3IoXCJzdXJ2ZXlFbWJlZGluZ0hlYWRcIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldEhlYWRUZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgYm9keUVkaXRvciA9IHRoaXMuY3JlYXRlRWRpdG9yKFwic3VydmV5RW1iZWRpbmdCb2R5XCIpO1xyXG4gICAgICAgICAgICAgICAgYm9keUVkaXRvci5zZXRWYWx1ZShcIjxkaXYgaWQ9IFxcXCJteVN1cnZleUpTTmFtZVxcXCIgPjwvZGl2PlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdKYXZhID0gdGhpcy5jcmVhdGVFZGl0b3IoXCJzdXJ2ZXlFbWJlZGluZ0phdmFcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb0hhc0lkcyh0aGlzLnN1cnZleUlkICYmIHRoaXMuc3VydmV5UG9zdElkKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEuc2V0VmFsdWUodGhpcy5nZXRKYXZhVGV4dCgpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZXRIZWFkVGV4dCgpIHtcclxuICAgICAgICAgICAgdmFyIGtub2Nrb3V0U3RyID0gXCI8c2NyaXB0IHNyYz1cXFwiaHR0cHM6Ly9jZG5qcy5jbG91ZGZsYXJlLmNvbS9hamF4L2xpYnMva25vY2tvdXQvMy4zLjAva25vY2tvdXQtbWluLmpzXFxcIiA+PC9zY3JpcHQ+XFxuXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtvU2NyaXB0VXNpbmcoKSA9PSBcImJvb3RzdHJhcFwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSGVhZC5zZXRWYWx1ZShrbm9ja291dFN0ciArIFwiPHNjcmlwdCBzcmM9XFxcImpzL3N1cnZleS5ib290c3RyYXAubWluLmpzXFxcIj48L3NjcmlwdD5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSGVhZC5zZXRWYWx1ZShrbm9ja291dFN0ciArIFwiPHNjcmlwdCBzcmM9XFxcImpzL3N1cnZleS5taW4uanNcXFwiPjwvc2NyaXB0PlxcbjxsaW5rIGhyZWY9XFxcImNzcy9zdXJ2ZXkuY3NzXFxcIiB0eXBlPVxcXCJ0ZXh0L2Nzc1xcXCIgcmVsPVxcXCJzdHlsZXNoZWV0XFxcIiAvPlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZUVkaXRvcihlbGVtZW50TmFtZTogc3RyaW5nKTogQWNlQWpheC5FZGl0b3Ige1xyXG4gICAgICAgICAgICB2YXIgZWRpdG9yID0gYWNlLmVkaXQoZWxlbWVudE5hbWUpO1xyXG4gICAgICAgICAgICBlZGl0b3Iuc2V0VGhlbWUoXCJhY2UvdGhlbWUvbW9ub2thaVwiKTtcclxuICAgICAgICAgICAgZWRpdG9yLnNlc3Npb24uc2V0TW9kZShcImFjZS9tb2RlL2pzb25cIik7XHJcbiAgICAgICAgICAgIGVkaXRvci5zZXRTaG93UHJpbnRNYXJnaW4oZmFsc2UpO1xyXG4gICAgICAgICAgICBlZGl0b3IucmVuZGVyZXIuc2V0U2hvd0d1dHRlcihmYWxzZSk7XHJcbiAgICAgICAgICAgIGVkaXRvci5zZXRSZWFkT25seSh0cnVlKTtcclxuICAgICAgICAgICAgcmV0dXJuIGVkaXRvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRKYXZhVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgaXNPblBhZ2UgPSB0aGlzLmtvU2hvd0FzV2luZG93KCkgPT0gXCJwYWdlXCI7XHJcbiAgICAgICAgICAgIHZhciB0ZXh0ID0gaXNPblBhZ2UgPyBcInZhciBzdXJ2ZXkgPSBuZXcgU3VydmV5LlN1cnZleShcXG5cIiA6IFwidmFyIHN1cnZleVdpbmRvdyA9IG5ldyBTdXJ2ZXkuU3VydmV5V2luZG93KFxcblwiO1xyXG4gICAgICAgICAgICB0ZXh0ICs9IHRoaXMuZ2V0SnNvblRleHQoKTtcclxuICAgICAgICAgICAgdGV4dCArPSBcIik7XFxuXCI7XHJcbiAgICAgICAgICAgIGlmICghaXNPblBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gXCJzdXJ2ZXlXaW5kb3cuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNhdmVGdW5jID0gXCJhbGVydChcXFwiVGhlIHJlc3VsdHMgYXJlOlxcXCIgKyBKU09OLnN0cmluZ2lmeShzLmRhdGEpKTtcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMua29IYXNJZHMoKSkge1xyXG4gICAgICAgICAgICAgICAgc2F2ZUZ1bmMgPSBcInN1cnZleS5zZW5kUmVzdWx0KCdcIiArIHRoaXMuc3VydmV5UG9zdElkICsgXCInKTtcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0ZXh0ICs9IFwic3VydmV5Lm9uQ29tcGxldGUuYWRkKGZ1bmN0aW9uIChzKSB7XFxuXCIgKyBzYXZlRnVuYyArIFwiXFxuIH0pO1xcblwiO1xyXG4gICAgICAgICAgICBpZiAoaXNPblBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gXCJzdXJ2ZXkucmVuZGVyKFxcXCJteVN1cnZleUpTTmFtZVxcXCIpO1wiO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSBcIi8vQnkgZGVmYXVsdCBTdXJ2ZXkudGl0bGUgaXMgdXNlZC5cXG5cIlxyXG4gICAgICAgICAgICAgICAgdGV4dCArPSBcIi8vc3VydmV5V2luZG93LnRpdGxlID0gXFxcIk15IFN1cnZleSBXaW5kb3cgVGl0bGUuXFxcIjtcXG5cIjtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gXCJzdXJ2ZXlXaW5kb3cuc2hvdygpO1wiO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRKc29uVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5rb0hhc0lkcygpICYmIHRoaXMua29Mb2FkU3VydmV5KCkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcInsgc3VydmV5SWQ6ICdcIiArIHRoaXMuc3VydmV5SWQgKyBcIid9XCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeSh0aGlzLmpzb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJzIHtcclxuICAgICAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG4gICAgICAgIHByaXZhdGUgb2JqVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNDbGFzc2VzOiBBcnJheTxzdHJpbmc+O1xyXG4gICAgICAgIGtvVmVyYnM6IGFueTtcclxuICAgICAgICBrb0hhc1ZlcmJzOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WZXJicyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzVmVyYnMgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHZhciBjbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic2VsZWN0YmFzZVwiLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzQ2xhc3NlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hvaWNlc0NsYXNzZXMucHVzaChjbGFzc2VzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb2JqKCk6IGFueSB7IHJldHVybiB0aGlzLm9ialZhbHVlIH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9iaih2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9ialZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMub2JqVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZFZlcmJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYnVpbGRWZXJicygpIHtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUodGhpcy5vYmopO1xyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uQmFzZT50aGlzLm9iajtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc0NsYXNzZXMuaW5kZXhPZihxdWVzdGlvbi5nZXRUeXBlKCkpID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKG5ldyBTdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0odGhpcy5zdXJ2ZXksIHF1ZXN0aW9uKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb1ZlcmJzKGFycmF5KTtcclxuICAgICAgICAgICAgdGhpcy5rb0hhc1ZlcmJzKGFycmF5Lmxlbmd0aCA+IDApO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJiSXRlbSB7XHJcbiAgICAgICAga29JdGVtczogYW55O1xyXG4gICAgICAgIGtvU2VsZWN0ZWRJdGVtOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHN1cnZleTogU3VydmV5LlN1cnZleSwgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0gZXh0ZW5kcyBTdXJ2ZXlWZXJiSXRlbSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHN1cnZleTogU3VydmV5LlN1cnZleSwgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgY2xhc3NlcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhcInNlbGVjdGJhc2VcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goeyB2YWx1ZTogY2xhc3Nlc1tpXS5uYW1lLCB0ZXh0OiBjbGFzc2VzW2ldLm5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbShxdWVzdGlvbi5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVR5cGUobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIkNoYW5nZSB0eXBlIFwiOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGFuZ2VUeXBlKHF1ZXN0aW9uVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvblR5cGUgPT0gdGhpcy5xdWVzdGlvbi5nZXRUeXBlKCkpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZih0aGlzLnF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIG5ld1F1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIHRoaXMucXVlc3Rpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIHZhciBqc29uID0ganNvbk9iai50b0pzb25PYmplY3QodGhpcy5xdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGpzb25PYmoudG9PYmplY3QoanNvbiwgbmV3UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBwYWdlLnJlbW92ZVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBwYWdlLmFkZFF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbSBleHRlbmRzIFN1cnZleVZlcmJJdGVtIHtcclxuICAgICAgICBwcml2YXRlIHByZXZQYWdlOiBTdXJ2ZXkuUGFnZTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5LnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCh7IHZhbHVlOiBwYWdlLCB0ZXh0OiBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZQYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbSh0aGlzLnByZXZQYWdlKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5jaGFuZ2VQYWdlKG5ld1ZhbHVlKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gXCJDaGFuZ2UgcGFnZSBcIjsgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlUGFnZShuZXdQYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICBpZiAobmV3UGFnZSA9PSBudWxsIHx8IG5ld1BhZ2UgPT0gdGhpcy5wcmV2UGFnZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZQYWdlLnJlbW92ZVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBuZXdQYWdlLmFkZFF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSB0ZW1wbGF0ZUVkaXRvci5rbyB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwicm93IG5hdi10YWJzXCI+ICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtM1wiPiAgICAgICAgPG5hdiBjbGFzcz1cIm5hdmJhci1kZWZhdWx0XCI+ICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdi10YWJzIG5vLWJvcmRlcnNcIj4gICAgICAgICAgICAgICAgPGxpIGRhdGEtYmluZD1cImNzczoge2FjdGl2ZToga29Jc1Nob3dEZXNpZ25lcigpfVwiPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0RGVzaWduZXJDbGlja1wiPkRlc2lnbmVyPC9hPjwvbGk+ICAgICAgICAgICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6ICFrb0lzU2hvd0Rlc2lnbmVyKCl9XCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3RFZGl0b3JDbGlja1wiPkpTT04gRWRpdG9yPC9hPjwvbGk+ICAgICAgICAgICAgPC91bD4gICAgICAgIDwvbmF2PiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cImNvbC1tZC05IHN2ZF9uYXZiYXJidXR0b25zXCI+ICAgICAgICA8bmF2IGNsYXNzPVwibmF2YmFyLWRlZmF1bHQgcHVsbC1yaWdodFwiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4tdG9vbGJhclwiIHJvbGU9XCJ0b29sYmFyXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1iaW5kPVwiY2xpY2s6IHJ1blN1cnZleUNsaWNrXCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI3N1cnZleUV4YW1wbGVNb2RhbFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbGF5XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiAgUnVuIFN1cnZleTwvYnV0dG9uPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOiBlbWJlZGluZ1N1cnZleUNsaWNrXCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI3N1cnZleUVtYmVkaW5nTW9kYWxcIj5FbWJlZCBTdXJ2ZXk8L2J1dHRvbj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1Nob3dTYXZlQnV0dG9uLCBjbGljazogc2F2ZUJ1dHRvbkNsaWNrXCI+U2F2ZSBTdXJ2ZXk8L2J1dHRvbj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvbmF2PiAgICA8L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwicGFuZWxcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj4gICAgPGRpdiBpZD1cInN1cnZleWpzRWRpdG9yXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogIWtvSXNTaG93RGVzaWduZXIoKVwiIHN0eWxlPVwiaGVpZ2h0OjQ1MHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPGRpdiBjbGFzcz1cInJvd1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXIoKVwiPiAgICAgICAgPGRpdiBjbGFzcz1cInJvdyBjb2wtbWQtOVwiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtM1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwgcGFuZWwtZGVmYXVsdFwiIHN0eWxlPVwid2lkdGg6MTAwJVwiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgICAgICAgICAgICAgICAgICA8Yj5Ub29sYm94PC9iPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwLXZlcnRpY2FsXCIgc3R5bGU9XCJ3aWR0aDoxMDAlO3BhZGRpbmctcmlnaHQ6MnB4XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvblR5cGVzIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDsgcGFkZGluZy1sZWZ0OjEwcHg7IG1hcmdpbjoxcHg7d2lkdGg6MTAwJVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jbGlja1F1ZXN0aW9uLCBldmVudDp7ZHJhZ3N0YXJ0OiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdnaW5nUXVlc3Rpb24oJGRhdGEsIGUpOyByZXR1cm4gdHJ1ZTt9fVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvQ29waWVkUXVlc3Rpb25zIC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJidG4gYnRuLXByaW1hcnlcIiBzdHlsZT1cInRleHQtYWxpZ246bGVmdDsgcGFkZGluZy1sZWZ0OjEwcHg7IG1hcmdpbjoxcHg7d2lkdGg6MTAwJVwiIGRyYWdnYWJsZT1cInRydWVcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jbGlja0NvcGllZFF1ZXN0aW9uLCBldmVudDp7ZHJhZ3N0YXJ0OiBmdW5jdGlvbihlbCwgZSkgeyAkcGFyZW50LmRyYWdnaW5nQ29waWVkUXVlc3Rpb24oJGRhdGEsIGUpOyByZXR1cm4gdHJ1ZTt9fVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0Om5hbWVcIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtOVwiPiAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3BhZ2VlZGl0b3JcXCcsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBzdHlsZT1cIm92ZXJmbG93LXk6IHNjcm9sbDtoZWlnaHQ6NDUwcHg7XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwic3VydmV5anNcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj48L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2wtbWQtM1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbCBwYW5lbC1kZWZhdWx0XCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29PYmplY3RzLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRPYmplY3RcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29DYW5EZWxldGVPYmplY3QsIGNsaWNrOiBkZWxldGVDdXJyZW50T2JqZWN0XCIgdGl0bGU9XCJEZWxldGUgc2VsZWN0ZWQgb2JqZWN0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgICAgICA8L3NwYW4+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0ZWRpdG9yXFwnLCBkYXRhOiBzZWxlY3RlZE9iamVjdEVkaXRvciB9XCI+PC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1mb290ZXJcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOnN1cnZleVZlcmJzLmtvSGFzVmVyYnNcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnb2JqZWN0dmVyYnNcXCcsIGRhdGE6IHN1cnZleVZlcmJzIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9kaXY+PGRpdiBpZD1cInN1cnZleUV4YW1wbGVNb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiIHJvbGU9XCJkaWFsb2dcIj4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5SdW5uaW5nIHN1cnZleTwvaDQ+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleWpzRXhhbXBsZVwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PjwvZGl2PjxkaXYgaWQ9XCJzdXJ2ZXlFbWJlZGluZ01vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiPiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JnRpbWVzOzwvYnV0dG9uPiAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiPkVtYmVkIFN1cnZleTwvaDQ+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXllbWJlZGluZ1xcJywgZGF0YTogc3VydmV5RW1iZWRpbmcgfVwiPjwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PjwvZGl2PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwib2JqZWN0ZWRpdG9yXCI+ICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlIHN2ZF90YWJsZS1ub3dyYXBcIj4gICAgICAgIDx0Ym9keSBkYXRhLWJpbmQ9XCJmb3JlYWNoOiBrb1Byb3BlcnRpZXNcIj4gICAgICAgICAgICA8dHIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQuY2hhbmdlQWN0aXZlUHJvcGVydHkoJGRhdGEpLCBjc3M6IHtcXCdhY3RpdmVcXCc6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpID09ICRkYXRhfVwiPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidGV4dDogbmFtZVwiIHdpZHRoPVwiNTAlXCI+PC90ZD4gICAgICAgICAgICAgICAgPHRkIHdpZHRoPVwiNTAlXCI+ICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHQsIHZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpICE9ICRkYXRhLCBhdHRyOiB7dGl0bGU6IGtvVGV4dH0sIHN0eWxlOiB7Y29sb3I6IGtvSXNEZWZhdWx0KCkgPyBcXCdncmF5XFwnIDogXFwnXFwnfVwiIHN0eWxlPVwidGV4dC1vdmVyZmxvdzplbGxpcHNpczt3aGl0ZS1zcGFjZTpub3dyYXA7b3ZlcmZsb3c6aGlkZGVuXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YVwiPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItXFwnICsgYmFzZUVkaXRvclR5cGUsIGRhdGE6ICRkYXRhIH0gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cIm9iamVjdHZlcmJzXCI+ICAgIDwhLS0ga28gZm9yZWFjaDoga29WZXJicyAtLT4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICAgICAgPHNwYW4gIGNsYXNzPVwiaW5wdXQtZ3JvdXAtYWRkb25cIiBkYXRhLWJpbmQ9XCJ0ZXh0OnRleHRcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDxzZWxlY3QgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOiBrb0l0ZW1zLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgb3B0aW9uc1ZhbHVlOlxcJ3ZhbHVlXFwnLCB2YWx1ZToga29TZWxlY3RlZEl0ZW1cIj48L3NlbGVjdD4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8IS0tIC9rbyAgLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwYWdlZWRpdG9yXCI+ICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFic1wiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb1BhZ2VzIC0tPiAgICAgICAgPGxpIGRhdGEtYmluZD1cImNzczoge2FjdGl2ZToga29TZWxlY3RlZCgpfSxldmVudDp7ICAgICAgICAgICBkcmFnc3RhcnQ6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdTdGFydChlbCk7IHJldHVybiB0cnVlOyB9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdPdmVyKGVsKTt9LCAgICAgICAgICAgZHJhZ2VuZDpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQuZHJhZ0VuZCgpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnRHJvcChlbCk7fSAgICAgICAgIH1cIj4gICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazokcGFyZW50LnNlbGVjdFBhZ2VDbGlja1wiPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0aXRsZVwiPjwvc3Bhbj4gICAgICAgICAgICA8L2E+ICAgICAgICA8L2xpPiAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1iaW5kPVwiY2xpY2s6YWRkTmV3UGFnZUNsaWNrXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+PC9idXR0b24+PC9saT4gICAgPC91bD48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWFycmF5XCI+ICAgIDxkaXY+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHRcIj48L3NwYW4+ICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7XFwnZGF0YS10YXJnZXRcXCcgOiBtb2RhbE5hbWVUYXJnZXR9XCI+RWRpdDwvYnV0dG9uPiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJhdHRyOiB7aWQgOiBtb2RhbE5hbWV9XCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgZGF0YS1iaW5kPVwidGV4dDphcnJheUVkaXRvci50aXRsZVwiPjwvaDQ+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keSBzdmRfbm90b3Bib3R0b21wYWRkaW5nc1wiPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1cXCcgKyBlZGl0b3JUeXBlLCBkYXRhOiBhcnJheUVkaXRvciB9IC0tPiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZm9vdGVyXCI+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiQXBwbHlcIiBkYXRhLWJpbmQ9XCJjbGljazogYXJyYXlFZGl0b3Iub25BcHBseUNsaWNrXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgdmFsdWU9XCJDbG9zZVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWJvb2xlYW5cIj4gICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6IGtvVmFsdWVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItZHJvcGRvd25cIj4gICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZSwgb3B0aW9uczogY2hvaWNlc1wiICBzdHlsZT1cIndpZHRoOjEwMCVcIj48L3NlbGVjdD48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWl0ZW12YWx1ZXNcIj48dGFibGUgY2xhc3M9XCJ0YWJsZVwiPiAgICA8dGhlYWQ+ICAgICAgICA8dHI+ICAgICAgICAgICAgPHRoPlZhbHVlPC90aD4gICAgICAgICAgICA8dGg+VGV4dDwvdGg+ICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICA8L3RyPiAgICA8L3RoZWFkPiAgICA8dGJvZHk+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvSXRlbXMgLS0+ICAgICAgICA8dHI+ICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXIgbm8tcGFkZGluZ1wiIHJvbGU9XCJhbGVydFwiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNFcnJvclwiPlBsZWFzZSwgZW50ZXIgdGhlIHZhbHVlLjwvZGl2PiAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVGV4dFwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25EZWxldGVDbGlja1wiIHZhbHVlPVwiRGVsZXRlXCIgLz48L3RkPiAgICAgICAgPC90cj4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPHRyPiAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiM1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93IGJ0bi10b29sYmFyXCI+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFkZENsaWNrXCIgdmFsdWU9XCJBZGQgTmV3XCIgLz4gICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQ2xlYXJDbGlja1wiIHZhbHVlPVwiUmVtb3ZlIEFsbFwiIC8+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvdGQ+ICAgICAgICA8L3RyPiAgICA8L3Rib2R5PjwvdGFibGU+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1udW1iZXJcIj4gICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1zdHJpbmdcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdGV4dGl0ZW1zXCI+PGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+ICAgICAgICAgICAgICAgIDx0aD5UaXRsZTwvdGg+ICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3RoZWFkPiAgICAgICAgPHRib2R5PiAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29JdGVtcyAtLT4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05hbWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29UaXRsZVwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uRGVsZXRlQ2xpY2tcIiB2YWx1ZT1cIkRlbGV0ZVwiIC8+PC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJjbGljazogb25BZGRDbGlja1wiIHZhbHVlPVwiQWRkXCIgLz48L3RkPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3Rib2R5PiAgICA8L3RhYmxlPjwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdHJpZ2dlcnNcIj48ZGl2IGNsYXNzPVwicGFuZWxcIj4gICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJlbmFibGU6IGtvUXVlc3Rpb25zKCkubGVuZ3RoID4gMCwgY2xpY2s6IG9uQWRkQ2xpY2tcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ2tvVGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJlbmFibGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25EZWxldGVDbGlja1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICA8L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZCgpID09IG51bGxcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29RdWVzdGlvbnMoKS5sZW5ndGggPT0gMFwiPiAgICAgICAgICAgIFRoZXJlIGlzIG5vIGFueSBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LiAgICAgICAgPC9kaXY+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvUXVlc3Rpb25zKCkubGVuZ3RoID4gMFwiPiAgICAgICAgICAgIFBsZWFzZSBjcmVhdGUgYSB0cmlnZ2VyICAgICAgICA8L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZCgpICE9IG51bGxcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIiBkYXRhLWJpbmQ9XCJ3aXRoOiBrb1NlbGVjdGVkXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cImZvcm0taW5saW5lIGNvbC1zbS0xMlwiPiAgICAgICAgICAgICAgICA8c3Bhbj5PbiA8L3NwYW4+PHNlbGVjdCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cIm9wdGlvbnM6JHBhcmVudC5rb1F1ZXN0aW9ucywgdmFsdWU6IGtvTmFtZVwiPjwvc2VsZWN0PiA8c3Bhbj4gPC9zcGFuPiAgICAgICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczphdmFpbGFibGVPcGVyYXRvcnMsIG9wdGlvbnNWYWx1ZTogXFwnbmFtZVxcJywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOmtvT3BlcmF0b3JcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgc3R5bGU9XCJwYWRkaW5nOiAwXCIgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1JlcXVpcmVWYWx1ZSwgdmFsdWU6a29WYWx1ZVwiIC8+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTZcIj4gICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1xcJywgZGF0YTogcGFnZXMgfSAtLT4gICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+ICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLXRyaWdnZXJzaXRlbXNcXCcsIGRhdGE6IHF1ZXN0aW9ucyB9IC0tPiAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PjwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1wiPiAgICA8ZGl2IGNsYXNzPVwicGFuZWwgbm8tbWFyZ2lucyBuby1wYWRkaW5nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IHRpdGxlXCI+PC9zcGFuPiAgICAgICAgPC9kaXY+ICAgICAgICA8ZGl2IGNsYXNzPVwiaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgbXVsdGlwbGU9XCJtdWx0aXBsZVwiIGRhdGEtYmluZD1cIm9wdGlvbnM6a29DaG9vc2VuLCB2YWx1ZToga29DaG9vc2VuU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImlucHV0LWdyb3VwLWJ0blwiIHN0eWxlPVwidmVydGljYWwtYWxpZ246dG9wXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29DaG9vc2VuU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25EZWxldGVDbGlja1wiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICA8L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgICAgIDxkaXYgY2xhc3M9XCJpbnB1dC1ncm91cFwiIHN0eWxlPVwibWFyZ2luLXRvcDo1cHhcIj4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczprb09iamVjdHMsIHZhbHVlOiBrb1NlbGVjdGVkXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uQWRkQ2xpY2tcIiBzdHlsZT1cIndpZHRoOjQwcHhcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgIDwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXZhbGlkYXRvcnNcIj48ZGl2IGNsYXNzPVwicGFuZWxcIj4gICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJyb3cgaW5wdXQtZ3JvdXBcIj4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZSBpbnB1dC1ncm91cC1hZGRvblwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiPjwvc3Bhbj4gICAgICAgICAgICA8L2J1dHRvbj4gICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51IGlucHV0LWdyb3VwXCI+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogYXZhaWxhYmxlVmFsaWRhdG9ycyAtLT4gICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25BZGRDbGljaygkZGF0YSlcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhXCI+PC9zcGFuPjwvYT48L2xpPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICAgICAgPC91bD4gICAgICAgICAgICA8c2VsZWN0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOiBrb1NlbGVjdGVkXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpbnB1dC1ncm91cC1idG5cIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uRGVsZXRlQ2xpY2tcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgPC9zcGFuPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ29iamVjdGVkaXRvclxcJywgZGF0YTogc2VsZWN0ZWRPYmplY3RFZGl0b3IgfVwiPjwvZGl2PjwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5ZW1iZWRpbmdcIj4gICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1NjcmlwdFVzaW5nXCI+ICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJvb3RzdHJhcFwiPkZvciBib290c3RyYXAgZnJhbWV3b3JrPC9vcHRpb24+ICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInN0YW5kYXJkXCI+Tm8gYm9vdHN0cmFwPC9vcHRpb24+ICAgICAgICA8L3NlbGVjdD4gICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6a29TaG93QXNXaW5kb3dcIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGFnZVwiPlNob3cgc3VydmV5IG9uIGEgcGFnZTwvb3B0aW9uPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3aW5kb3dcIj5TaG93IHN1cnZleSBpbiBhIHdpbmRvdzwvb3B0aW9uPiAgICAgICAgPC9zZWxlY3Q+ICAgICAgICA8bGFiZWwgY2xhc3M9XCJjaGVja2JveC1pbmxpbmVcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOmtvSGFzSWRzXCI+ICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6a29Mb2FkU3VydmV5XCIgLz4gICAgICAgICAgICA8c3Bhbj5Mb2FkIFN1cnZleSBKU09OIGZyb20gc2VydmVyPC9zcGFuPiAgICAgICAgPC9sYWJlbD4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5TY3JpcHRzIGFuZCBzdHlsZXM8L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlFbWJlZGluZ0hlYWRcIiBzdHlsZT1cImhlaWdodDo3MHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvU2hvd0FzV2luZG93KCk9PVxcJ3BhZ2VcXCdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+SFRNTDwvZGl2PiAgICAgICAgPGRpdiBpZD1cInN1cnZleUVtYmVkaW5nQm9keVwiIHN0eWxlPVwiaGVpZ2h0OjMwcHg7d2lkdGg6MTAwJVwiPjwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPkphdmFTY3JpcHQ8L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlFbWJlZGluZ0phdmFcIiBzdHlsZT1cImhlaWdodDozMDBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0Pic7fSIsIm1vZHVsZSB0ZW1wbGF0ZV9wYWdlIHsgZXhwb3J0IHZhciBodG1sID0gJzxkaXYgZGF0YS1iaW5kPVwiZXZlbnQ6eyAgICAgICAgICAgZHJhZ2VudGVyOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0VudGVyKGUpO30sICAgICAgICAgICBkcmFnbGVhdmU6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnTGVhdmUoZSk7fSwgICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgcmV0dXJuIGZhbHNlO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fX0gICAgIFwiPiAgICA8aDQgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHRpdGxlXCI+PC9oND4gICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnIH0gLS0+ICAgIDxkaXYgY2xhc3M9XCJzdmRfZHJhZ292ZXJcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiRwYXJlbnQua29EcmFnZ2luZygpID09ICRpbmRleCgpXCI+PC9kaXY+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSAva28gLS0+ICAgIDxkaXYgY2xhc3M9XCJ3ZWxsXCIgZGF0YS1iaW5kPVwidmlzaWJsZTokcm9vdC5pc0Rlc2lnbk1vZGUgJiYgcXVlc3Rpb25zLmxlbmd0aCA9PSAwXCI+ICAgICAgICA8c3Bhbj5QbGVhc2UgZHJvcCBhIHF1ZXN0aW9uIGhlcmUuPC9zcGFuPiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInN2ZF9kcmFnb3ZlclwiIGRhdGEtYmluZD1cInZpc2libGU6a29EcmFnZ2luZygpID09IHF1ZXN0aW9ucy5sZW5ndGhcIj48L2Rpdj48L2Rpdj4nO30iLCJtb2R1bGUgdGVtcGxhdGVfcXVlc3Rpb24geyBleHBvcnQgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIndlbGwgd2VsbC1zbVwiIGRhdGEtYmluZD1cImF0dHIgOiB7ZHJhZ2dhYmxlOiAkcm9vdC5pc0Rlc2lnbk1vZGV9LCB2aXNpYmxlOiBxdWVzdGlvbi5rb1Zpc2libGUoKSB8fCAkcm9vdC5pc0Rlc2lnbk1vZGUsIGNsaWNrOiAkcm9vdC5pc0Rlc2lnbk1vZGUgPyBrb09uQ2xpY2s6IG51bGwsICAgICAgICAgIGV2ZW50OnsgICAgICAgICAgIGRyYWdzdGFydDpmdW5jdGlvbihlbCwgZSl7IGRyYWdTdGFydChlKTsgcmV0dXJuIHRydWU7IH0sICAgICAgICAgICBkcmFnb3ZlcjpmdW5jdGlvbihlbCwgZSl7IGRyYWdPdmVyKGUpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fSAgICAgICAgIH0sIGNzczp7c3ZkX3FfZGVzaWduX2JvcmRlcjogJHJvb3QuaXNEZXNpZ25Nb2RlLCBzdmRfcV9zZWxlY3RlZCA6IGtvSXNTZWxlY3RlZH1cIj4gICAgPGRpdiBjbGFzcz1cInN2ZF9xX2NvcHlidXR0b25cIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb0lzU2VsZWN0ZWRcIj4gICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4gYnRuLXByaW1hcnkgYnRuLXhzXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRyb290LmNvcHlRdWVzdGlvbkNsaWNrXCI+Q29weTwvYnV0dG9uPiAgICA8L2Rpdj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJjc3M6e3N2ZF9xX2Rlc2lnbjogJHJvb3QuaXNEZXNpZ25Nb2RlfVwiPiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvRXJyb3JzKCkubGVuZ3RoID4gMCwgZm9yZWFjaDoga29FcnJvcnNcIj4gICAgICAgICAgICA8ZGl2PiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZXhjbGFtYXRpb24tc2lnblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDokZGF0YS5nZXRUZXh0KClcIj48L3NwYW4+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0ga28gaWY6IHF1ZXN0aW9uLmhhc1RpdGxlIC0tPiAgICAgICAgPGg1IGRhdGEtYmluZD1cInRleHQ6IHF1ZXN0aW9uLmtvTm8oKSArICAocXVlc3Rpb24uaXNSZXF1aXJlZCA/IHF1ZXN0aW9uLmRhdGEucmVxdWlyZWRUZXh0IDogXFwnXFwnKSArIHF1ZXN0aW9uLnRpdGxlXCI+PC9oNT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgcXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc0NvbW1lbnRcIj4gICAgICAgICAgICBPdGhlciAocGxlYXNlIGRlc2NyaWJlKSAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHRydWUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9kaXY+Jzt9IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdEVkaXRvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJwYWdlc0VkaXRvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZXh0V29ya2VyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cnZleUhlbHBlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlFbWJlZGluZ1dpbmRvdy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RWZXJicy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkcmFnZHJvcGhlbHBlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZUVkaXRvci5rby5odG1sLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRlbXBsYXRlX3BhZ2UuaHRtbC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZV9xdWVzdGlvbi5odG1sLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUVkaXRvciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1cGRhdGVUZXh0VGltZW91dDogbnVtYmVyID0gMTAwMDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHROZXdTdXJ2ZXlUZXh0OiBzdHJpbmcgPSBcInsgcGFnZXM6IFsgeyBuYW1lOiAncGFnZTEnfV0gfVwiO1xyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyZWRFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgICAgICBwcml2YXRlIHN1cnZleWpzOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBwcml2YXRlIHN1cnZleWpzRXhhbXBsZTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUganNvbkVkaXRvcjogQWNlQWpheC5FZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1Byb2Nlc3NpbmdJbW1lZGlhdGVseTogYm9vbGVhbjtcclxuICAgICAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0RWRpdG9yOiBTdXJ2ZXlPYmplY3RFZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBwYWdlc0VkaXRvcjogU3VydmV5UGFnZXNFZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZzogU3VydmV5RW1iZWRpbmdXaW5kb3dcclxuICAgICAgICBwcml2YXRlIHN1cnZleU9iamVjdHM6IFN1cnZleU9iamVjdHM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlWZXJiczogU3VydmV5VmVyYnM7XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0V29ya2VyOiBTdXJ2ZXlUZXh0V29ya2VyO1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICAgICAgcHJpdmF0ZSBzYXZlU3VydmV5RnVuY1ZhbHVlOiBhbnk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvblR5cGVzOiBzdHJpbmdbXTtcclxuICAgICAgICBwdWJsaWMga29Db3BpZWRRdWVzdGlvbnM6IGFueTtcclxuICAgICAgICBcclxuICAgICAgICBrb0lzU2hvd0Rlc2lnbmVyOiBhbnk7XHJcbiAgICAgICAga29DYW5EZWxldGVPYmplY3Q6IGFueTtcclxuICAgICAgICBrb09iamVjdHM6IGFueTsga29TZWxlY3RlZE9iamVjdDogYW55O1xyXG4gICAgICAgIGtvU2hvd1NhdmVCdXR0b246IGFueTtcclxuICAgICAgICBzZWxlY3REZXNpZ25lckNsaWNrOiBhbnk7IHNlbGVjdEVkaXRvckNsaWNrOiBhbnk7XHJcbiAgICAgICAgZGVsZXRlT2JqZWN0Q2xpY2s6IGFueTtcclxuICAgICAgICBydW5TdXJ2ZXlDbGljazogYW55OyBlbWJlZGluZ1N1cnZleUNsaWNrOiBhbnk7XHJcbiAgICAgICAgc2F2ZUJ1dHRvbkNsaWNrOiBhbnk7XHJcbiAgICAgICAgZHJhZ2dpbmdRdWVzdGlvbjogYW55OyBjbGlja1F1ZXN0aW9uOiBhbnk7XHJcbiAgICAgICAgZHJhZ2dpbmdDb3BpZWRRdWVzdGlvbjogYW55OyBjbGlja0NvcGllZFF1ZXN0aW9uOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVkRWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVHlwZXMgPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmdldEFsbFR5cGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29Db3BpZWRRdWVzdGlvbnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0NhbkRlbGV0ZU9iamVjdCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG5cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rb1Nob3dTYXZlQnV0dG9uID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZUJ1dHRvbkNsaWNrID0gZnVuY3Rpb24gKCkgeyBpZiAoc2VsZi5zYXZlU3VydmV5RnVuYykgc2VsZi5zYXZlU3VydmV5RnVuYygpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRPYmplY3QgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZE9iamVjdC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2VsZWN0ZWRPYmplY3RDaGFuZ2VkKG5ld1ZhbHVlICE9IG51bGwgPyBuZXdWYWx1ZS52YWx1ZSA6IG51bGwpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzID0gbmV3IFN1cnZleU9iamVjdHModGhpcy5rb09iamVjdHMsIHRoaXMua29TZWxlY3RlZE9iamVjdCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZlcmJzID0gbmV3IFN1cnZleVZlcmJzKCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yID0gbmV3IFN1cnZleU9iamVjdEVkaXRvcigpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkT2JqZWN0RWRpdG9yLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQuYWRkKChzZW5kZXIsIG9wdGlvbnMpID0+IHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChvcHRpb25zLnByb3BlcnR5LCBvcHRpb25zLm9iamVjdCwgb3B0aW9ucy5uZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yID0gbmV3IFN1cnZleVBhZ2VzRWRpdG9yKCgpID0+IHsgc2VsZi5hZGRQYWdlKCk7IH0sIChwYWdlOiBTdXJ2ZXkuUGFnZSkgPT4geyBzZWxmLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHBhZ2UpOyB9LFxyXG4gICAgICAgICAgICAgICAgKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpID0+IHsgc2VsZi5tb3ZlUGFnZShpbmRleEZyb20sIGluZGV4VG8pOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZyA9IG5ldyBTdXJ2ZXlFbWJlZGluZ1dpbmRvdygpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5rb0lzU2hvd0Rlc2lnbmVyID0ga28ub2JzZXJ2YWJsZSh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3REZXNpZ25lckNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dEZXNpZ25lcigpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdEVkaXRvckNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dKc29uRWRpdG9yKCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMucnVuU3VydmV5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0xpdmVTdXJ2ZXkoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5lbWJlZGluZ1N1cnZleUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dTdXJ2ZXlFbWJlZGluZygpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRlbGV0ZUN1cnJlbnRPYmplY3QoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5kcmFnZ2luZ1F1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9uVHlwZSwgZSkgeyBzZWxmLmRvRHJhZ2dpbmdRdWVzdGlvbihxdWVzdGlvblR5cGUsIGUpOyB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tRdWVzdGlvbiA9IGZ1bmN0aW9uIChxdWVzdGlvblR5cGUpIHsgc2VsZi5kb0NsaWNrUXVlc3Rpb24ocXVlc3Rpb25UeXBlKTsgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nQ29waWVkUXVlc3Rpb24gPSBmdW5jdGlvbiAoaXRlbSwgZSkgeyBzZWxmLmRvRHJhZ2dpbmdDb3BpZWRRdWVzdGlvbihpdGVtLmpzb24sIGUpOyB9XHJcbiAgICAgICAgICAgIHRoaXMuY2xpY2tDb3BpZWRRdWVzdGlvbiA9IGZ1bmN0aW9uIChpdGVtKSB7IHNlbGYuZG9DbGlja0NvcGllZFF1ZXN0aW9uKGl0ZW0uanNvbik7IH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJlZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1cnZleVZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlZEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlRWRpdG9yLmtvLmh0bWw7XHJcbiAgICAgICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgU3VydmV5LmR4U3VydmV5U2VydmljZSgpLmxvYWRTdXJ2ZXkoc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50ZXh0ID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGV4dCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMua29Jc1Nob3dEZXNpZ25lcigpKSByZXR1cm4gdGhpcy5nZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmpzb25FZGl0b3IgIT0gbnVsbCA/IHRoaXMuanNvbkVkaXRvci5nZXRWYWx1ZSgpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0V29ya2VyID0gbmV3IFN1cnZleVRleHRXb3JrZXIodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Rlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRleHRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvSXNTaG93RGVzaWduZXIoZmFsc2UpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNhdmVTdXJ2ZXlGdW5jKCkgeyByZXR1cm4gdGhpcy5zYXZlU3VydmV5RnVuY1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBzYXZlU3VydmV5RnVuYyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN1cnZleUZ1bmNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2hvd1NhdmVCdXR0b24odmFsdWUgIT0gbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0VGV4dFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuanNvbkVkaXRvciA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IucmVuZGVyZXIudXBkYXRlRnVsbCh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzSnNvbih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gU3VydmV5SGVscGVyLmdldE5ld05hbWUodGhpcy5zdXJ2ZXkucGFnZXMsIFwicGFnZVwiKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXlWYWx1ZS5hZGROZXdQYWdlKG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFBhZ2VUb1VJKHBhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1vdmVQYWdlKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSA8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkucGFnZXNbaW5kZXhGcm9tXTtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVPYmplY3QocGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnBhZ2VzLnNwbGljZShpbmRleFRvLCAwLCBwYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRQYWdlVG9VSShwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRQYWdlVG9VSShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uUXVlc3Rpb25BZGRlZChxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IDxTdXJ2ZXkuUGFnZT50aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRRdWVzdGlvbihwYWdlLCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uUXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5yZW1vdmVPYmplY3QocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvblByb3BlcnR5VmFsdWVDaGFuZ2VkKHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvYmo6IGFueSwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgaXNEZWZhdWx0ID0gcHJvcGVydHkuaXNEZWZhdWx0VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICBvYmpbcHJvcGVydHkubmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5Lm5hbWUgPT0gXCJuYW1lXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5uYW1lQ2hhbmdlZChvYmopO1xyXG4gICAgICAgICAgICAgICAgaWYgKFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5jaGFuZ2VOYW1lKDxTdXJ2ZXkuUGFnZT5vYmopO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2hvd0Rlc2lnbmVyKCkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudGV4dFdvcmtlci5pc0pzb25Db3JyZWN0KSB7XHJcbiAgICAgICAgICAgICAgICBhbGVydChcIlBsZWFzZSBjb3JyZWN0IEpTT04hXCIpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN1cnZleShuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy50ZXh0V29ya2VyLnN1cnZleSkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNTaG93RGVzaWduZXIodHJ1ZSk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNob3dKc29uRWRpdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2V0VmFsdWUodGhpcy5nZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyKCkpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IuZm9jdXMoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzU2hvd0Rlc2lnbmVyKGZhbHNlKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0U3VydmV5VGV4dEZyb21EZXNpZ25lcigpIHtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5zdXJ2ZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1cnZleUpTT041KCkuc3RyaW5naWZ5KGpzb24sIG51bGwsIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0Q2hhbmdlZChvYmo6IFN1cnZleS5CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBjYW5EZWxldGVPYmplY3QgPSBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5zZWxlY3RlZE9iamVjdCA9IG9iajtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWZXJicy5vYmogPSBvYmo7XHJcbiAgICAgICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKTtcclxuICAgICAgICAgICAgaWYgKG9ialR5cGUgPT0gT2JqVHlwZS5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSA9IDxTdXJ2ZXkuUGFnZT5vYmo7XHJcbiAgICAgICAgICAgICAgICBjYW5EZWxldGVPYmplY3QgPSB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGggPiAxO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShvYmopO1xyXG4gICAgICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlID0gdGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24odGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29DYW5EZWxldGVPYmplY3QoY2FuRGVsZXRlT2JqZWN0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcHBseUJpbmRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJlbmRlcmVkRWxlbWVudCA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGtvLmNsZWFuTm9kZSh0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleWpzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc1wiKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yID0gYWNlLmVkaXQoXCJzdXJ2ZXlqc0VkaXRvclwiKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlqc0V4YW1wbGUgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInN1cnZleWpzRXhhbXBsZVwiKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdFN1cnZleShuZXcgU3VydmV5SlNPTjUoKS5wYXJzZShTdXJ2ZXlFZGl0b3IuZGVmYXVsdE5ld1N1cnZleVRleHQpKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5tb2RlID0gXCJkZXNpZ25lclwiO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlLnJlbmRlcih0aGlzLnN1cnZleWpzKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuaW5pdEpzb25FZGl0b3IoKTtcclxuICAgICAgICAgICAgU3VydmV5VGV4dFdvcmtlci5uZXdMaW5lQ2hhciA9IHRoaXMuanNvbkVkaXRvci5zZXNzaW9uLmRvYy5nZXROZXdMaW5lQ2hhcmFjdGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaW5pdEpzb25FZGl0b3IoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFRoZW1lKFwiYWNlL3RoZW1lL21vbm9rYWlcIik7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5zZXNzaW9uLnNldE1vZGUoXCJhY2UvbW9kZS9qc29uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5vbihcImNoYW5nZVwiLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uSnNvbkVkaXRvckNoYW5nZWQoKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5nZXRTZXNzaW9uKCkuc2V0VXNlV29ya2VyKHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGluaXRTdXJ2ZXkoanNvbjogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSBuZXcgU3VydmV5LlN1cnZleShqc29uKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUuaXNFbXB0eSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkuU3VydmV5KG5ldyBTdXJ2ZXlKU09ONSgpLnBhcnNlKFN1cnZleUVkaXRvci5kZWZhdWx0TmV3U3VydmV5VGV4dCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm1vZGUgPSBcImRlc2lnbmVyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSg8U3VydmV5LlBhZ2U+dGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZlcmJzLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3Qoc2VuZGVyW1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWVbXCJvbkNvcHlRdWVzdGlvblwiXS5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLmNvcHlRdWVzdGlvbihzZWxmLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm9uQ3VycmVudFBhZ2VDaGFuZ2VkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYucGFnZXNFZGl0b3Iuc2V0U2VsZWN0ZWRQYWdlKDxTdXJ2ZXkuUGFnZT5zZW5kZXIuY3VycmVudFBhZ2UpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vblF1ZXN0aW9uQWRkZWQuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5vblF1ZXN0aW9uQWRkZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm9uUXVlc3Rpb25SZW1vdmVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvblJlbW92ZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHRpbWVvdXRJZDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBvbkpzb25FZGl0b3JDaGFuZ2VkKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRJZCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xyXG4gICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc0pzb24oc2VsZi50ZXh0KTtcclxuICAgICAgICAgICAgICAgIH0sIFN1cnZleUVkaXRvci51cGRhdGVUZXh0VGltZW91dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwcm9jZXNzSnNvbih0ZXh0OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5zZXRBbm5vdGF0aW9ucyh0aGlzLmNyZWF0ZUFubm90YXRpb25zKHRleHQsIHRoaXMudGV4dFdvcmtlci5lcnJvcnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb0RyYWdnaW5nUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIGUpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZSh0aGlzLnN1cnZleS5nZXRBbGxRdWVzdGlvbnMoKSwgXCJxdWVzdGlvblwiKTtcclxuICAgICAgICAgICAgbmV3IERyYWdEcm9wSGVscGVyKDxTdXJ2ZXkuSVN1cnZleT50aGlzLnN1cnZleSkuc3RhcnREcmFnTmV3UXVlc3Rpb24oZSwgcXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb0RyYWdnaW5nQ29waWVkUXVlc3Rpb24oanNvbjogYW55LCBlKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gU3VydmV5SGVscGVyLmdldE5ld05hbWUodGhpcy5zdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zKCksIFwicXVlc3Rpb25cIik7XHJcbiAgICAgICAgICAgIG5ldyBEcmFnRHJvcEhlbHBlcig8U3VydmV5LklTdXJ2ZXk+dGhpcy5zdXJ2ZXkpLnN0YXJ0RHJhZ0NvcGllZFF1ZXN0aW9uKGUsIG5hbWUsIGpzb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGRvQ2xpY2tRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IFN1cnZleUhlbHBlci5nZXROZXdOYW1lKHRoaXMuc3VydmV5LmdldEFsbFF1ZXN0aW9ucygpLCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmRvQ2xpY2tRdWVzdGlvbkNvcmUoU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb0NsaWNrQ29waWVkUXVlc3Rpb24oanNvbjogYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gU3VydmV5SGVscGVyLmdldE5ld05hbWUodGhpcy5zdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zKCksIFwicXVlc3Rpb25cIik7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24oanNvbltcInR5cGVcIl0sIG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b09iamVjdChqc29uLCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLm5hbWUgPSBuYW1lO1xyXG4gICAgICAgICAgICB0aGlzLmRvQ2xpY2tRdWVzdGlvbkNvcmUocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGRvQ2xpY2tRdWVzdGlvbkNvcmUocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVtcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBwYWdlLmFkZFF1ZXN0aW9uKHF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZGVsZXRlQ3VycmVudE9iamVjdCgpIHtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVPYmplY3QodGhpcy5rb1NlbGVjdGVkT2JqZWN0KCkudmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY29weVF1ZXN0aW9uKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSAhPSBPYmpUeXBlLlF1ZXN0aW9uKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBqc29uID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAganNvbi50eXBlID0gcXVlc3Rpb24uZ2V0VHlwZSgpO1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuZ2V0Q29waWVkUXVlc3Rpb25CeU5hbWUocXVlc3Rpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChpdGVtKSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmpzb24gPSBqc29uO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NvcGllZFF1ZXN0aW9ucy5wdXNoKHsgbmFtZTogcXVlc3Rpb24ubmFtZSwganNvbjoganNvbiB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5rb0NvcGllZFF1ZXN0aW9ucygpLmxlbmd0aCA+IDMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Db3BpZWRRdWVzdGlvbnMuc3BsaWNlKDAsIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0Q29waWVkUXVlc3Rpb25CeU5hbWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtcyA9IHRoaXMua29Db3BpZWRRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW1zW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGRlbGV0ZU9iamVjdChvYmo6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0KG9iaik7XHJcbiAgICAgICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKTtcclxuICAgICAgICAgICAgaWYgKG9ialR5cGUgPT0gT2JqVHlwZS5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5yZW1vdmVQYWdlKG9iaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnJlbW92ZVBhZ2Uob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5yZW1vdmVRdWVzdGlvbihvYmopO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdCh0aGlzLnN1cnZleS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2hvd0xpdmVTdXJ2ZXkoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXJ2ZXlqc0V4YW1wbGUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSB0aGlzLmdldFN1cnZleUpTT04oKTtcclxuICAgICAgICAgICAgaWYgKGpzb24gIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHN1cnZleSA9IG5ldyBTdXJ2ZXkuU3VydmV5KGpzb24pO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXkpID0+IHsgc2VsZi5zdXJ2ZXlqc0V4YW1wbGUuaW5uZXJIVE1MID0gXCJTdXJ2ZXkgUmVzdWx0OiBcIiArIG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeShzdXJ2ZXkuZGF0YSk7IH0pO1xyXG4gICAgICAgICAgICAgICAgc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzRXhhbXBsZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleWpzRXhhbXBsZS5pbm5lckhUTUwgPSBcIlBsZWFzZSBjb3JyZWN0IEpTT04hXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93U3VydmV5RW1iZWRpbmcoKSB7XHJcbiAgICAgICAgICAgIHZhciBqc29uID0gdGhpcy5nZXRTdXJ2ZXlKU09OKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuanNvbiA9IGpzb247XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc3VydmV5SWQgPSB0aGlzLnN1cnZleUlkO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nLnN1cnZleVBvc3RJZCA9IHRoaXMuc3VydmV5UG9zdElkO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nLnNob3coKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRTdXJ2ZXlKU09OKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtvSXNTaG93RGVzaWduZXIoKSkgIHJldHVybiBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy5zdXJ2ZXkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHJldHVybiBuZXcgU3VydmV5Lkpzb25PYmplY3QoKS50b0pzb25PYmplY3QodGhpcy50ZXh0V29ya2VyLnN1cnZleSk7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZUFubm90YXRpb25zKHRleHQ6IHN0cmluZywgZXJyb3JzOiBhbnlbXSk6IEFjZUFqYXguQW5ub3RhdGlvbltdIHtcclxuICAgICAgICAgICAgdmFyIGFubm90YXRpb25zID0gbmV3IEFycmF5PEFjZUFqYXguQW5ub3RhdGlvbj4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IGVycm9yc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBhbm5vdGF0aW9uOiBBY2VBamF4LkFubm90YXRpb24gPSB7IHJvdzogZXJyb3IucG9zaXRpb24uc3RhcnQucm93LCBjb2x1bW46IGVycm9yLnBvc2l0aW9uLnN0YXJ0LmNvbHVtbiwgdGV4dDogZXJyb3IudGV4dCwgdHlwZTogXCJlcnJvclwiIH07XHJcbiAgICAgICAgICAgICAgICBhbm5vdGF0aW9ucy5wdXNoKGFubm90YXRpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhbm5vdGF0aW9ucztcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgbmV3IFN1cnZleS5TdXJ2ZXlUZW1wbGF0ZVRleHQoKS5yZXBsYWNlVGV4dCh0ZW1wbGF0ZV9wYWdlLmh0bWwsIFwicGFnZVwiKTtcclxuICAgIG5ldyBTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0KCkucmVwbGFjZVRleHQodGVtcGxhdGVfcXVlc3Rpb24uaHRtbCwgXCJxdWVzdGlvblwiKTtcclxuXHJcbiAgICBTdXJ2ZXkuU3VydmV5LnByb3RvdHlwZVtcIm9uQ3JlYXRpbmdcIl0gPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMub25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZCA9IG5ldyBTdXJ2ZXkuRXZlbnQ8KHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICB0aGlzLm9uQ29weVF1ZXN0aW9uID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmNvcHlRdWVzdGlvbkNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uQ29weVF1ZXN0aW9uLmZpcmUoc2VsZik7IH07XHJcbiAgICB9XHJcbiAgICBTdXJ2ZXkuU3VydmV5LnByb3RvdHlwZVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0gPSBmdW5jdGlvbih2YWx1ZTogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgb2xkVmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlW1wib25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZFwiXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRTZWxlY3RlZFF1ZXN0aW9uJzogb2xkVmFsdWUsICduZXdTZWxlY3RlZFF1ZXN0aW9uJzogdmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBTdXJ2ZXkuUGFnZS5wcm90b3R5cGVbXCJvbkNyZWF0aW5nXCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmRyYWdFbnRlckNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMua29EcmFnZ2luZyA9IGtvLm9ic2VydmFibGUoLTEpO1xyXG4gICAgICAgIHRoaXMua29EcmFnZ2luZy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IGlmIChuZXdWYWx1ZSA8IDApIHNlbGYuZHJhZ0VudGVyQ291bnRlciA9IDA7IH0pO1xyXG4gICAgICAgIHRoaXMuZHJhZ0VudGVyID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZWxmLmRyYWdFbnRlckNvdW50ZXIrKzsgc2VsZi5kb0RyYWdFbnRlcihlKTsgfTtcclxuICAgICAgICB0aGlzLmRyYWdMZWF2ZSA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0VudGVyQ291bnRlci0tOyBpZiAoc2VsZi5kcmFnRW50ZXJDb3VudGVyID09PSAwKSBzZWxmLmtvRHJhZ2dpbmcoLTEpOyB9O1xyXG4gICAgICAgIHRoaXMuZHJhZ0Ryb3AgPSBmdW5jdGlvbiAoZSkgeyBzZWxmLmRvRHJvcChlKTsgfTtcclxuICAgIH1cclxuICAgIFN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJvcFwiXSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbmV3IERyYWdEcm9wSGVscGVyKHRoaXMuZGF0YSkuZG9Ecm9wKGUpO1xyXG4gICAgfVxyXG4gICAgU3VydmV5LlBhZ2UucHJvdG90eXBlW1wiZG9EcmFnRW50ZXJcIl0gPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zLmxlbmd0aCA+IDAgfHwgdGhpcy5rb0RyYWdnaW5nKCkgPiAwKSByZXR1cm47XHJcbiAgICAgICAgaWYgKG5ldyBEcmFnRHJvcEhlbHBlcih0aGlzLmRhdGEpLmlzU3VydmV5RHJhZ2dpbmcoZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0RyYWdnaW5nKHRoaXMucXVlc3Rpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFN1cnZleS5RdWVzdGlvbkJhc2UucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlID09IG51bGwpIHRoaXMuZHJhZ0Ryb3BIZWxwZXJWYWx1ZSA9IG5ldyBEcmFnRHJvcEhlbHBlcih0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmRvRHJhZ0Ryb3BPdmVyKGUsIHNlbGYpOyB9XHJcbiAgICAgICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5kb0Ryb3AoZSwgc2VsZik7IH1cclxuICAgICAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5zdGFydERyYWdRdWVzdGlvbihlLCBzZWxmLm5hbWUpOyB9XHJcbiAgICAgICAgdGhpcy5rb0lzU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvT25DbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuZGF0YSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHNlbGYuZGF0YVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0odGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgU3VydmV5LlF1ZXN0aW9uQmFzZS5wcm90b3R5cGVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGF0YSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgdGhpcy5rb0lzU2VsZWN0ZWQodGhpcy5kYXRhW1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdID09IHRoaXMpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8vIFRoaXMgZmlsZSBpcyBiYXNlZCBvbiBKU09ONSwgaHR0cDovL2pzb241Lm9yZy9cclxuLy8gVGhlIG1vZGlmaWNhdGlvbiBmb3IgZ2V0dGluZyBvYmplY3QgYW5kIHByb3BlcnRpZXMgbG9jYXRpb24gJ2F0JyB3ZXJlIG1hZGVuLlxyXG5cclxubW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5SlNPTjUge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgcG9zaXRpb25OYW1lID0gXCJwb3NcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBlc2NhcGVlID0ge1xyXG4gICAgICAgICAgICBcIidcIjogXCInXCIsXHJcbiAgICAgICAgICAgICdcIic6ICdcIicsXHJcbiAgICAgICAgICAgICdcXFxcJzogJ1xcXFwnLFxyXG4gICAgICAgICAgICAnLyc6ICcvJyxcclxuICAgICAgICAgICAgJ1xcbic6ICcnLCAgICAgICAvLyBSZXBsYWNlIGVzY2FwZWQgbmV3bGluZXMgaW4gc3RyaW5ncyB3LyBlbXB0eSBzdHJpbmdcclxuICAgICAgICAgICAgYjogJ1xcYicsXHJcbiAgICAgICAgICAgIGY6ICdcXGYnLFxyXG4gICAgICAgICAgICBuOiAnXFxuJyxcclxuICAgICAgICAgICAgcjogJ1xccicsXHJcbiAgICAgICAgICAgIHQ6ICdcXHQnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB3cyA9IFtcclxuICAgICAgICAgICAgJyAnLFxyXG4gICAgICAgICAgICAnXFx0JyxcclxuICAgICAgICAgICAgJ1xccicsXHJcbiAgICAgICAgICAgICdcXG4nLFxyXG4gICAgICAgICAgICAnXFx2JyxcclxuICAgICAgICAgICAgJ1xcZicsXHJcbiAgICAgICAgICAgICdcXHhBMCcsXHJcbiAgICAgICAgICAgICdcXHVGRUZGJ1xyXG4gICAgICAgIF07XHJcbiAgICAgICAgcHJpdmF0ZSBlbmRBdDogbnVtYmVyO1xyXG4gICAgICAgIHByaXZhdGUgYXQ6IG51bWJlcjsgICAgIC8vIFRoZSBpbmRleCBvZiB0aGUgY3VycmVudCBjaGFyYWN0ZXJcclxuICAgICAgICBwcml2YXRlIGNoOiBhbnk7ICAgICAvLyBUaGUgY3VycmVudCBjaGFyYWN0ZXJcclxuICAgICAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHBhcnNlVHlwZTogbnVtYmVyOyAvLyAwIC0gc3RhZGFyZCwgMSAtIGdldCBpbmZvcm1hdGlvbiBhYm91dCBvYmplY3RzLCAyIC0gZ2V0IGluZm9ybWF0aW9uIGFib3V0IGFsbCBwcm9wZXJ0aWVzXHJcbiAgICAgICAgY29uc3RydWN0b3IocGFyc2VUeXBlOiBudW1iZXIgPSAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFyc2VUeXBlID0gcGFyc2VUeXBlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcGFyc2Uoc291cmNlOiBhbnksIHJldml2ZXI6IGFueSA9IG51bGwsIHN0YXJ0RnJvbTogbnVtYmVyID0gMCwgZW5kQXQ6IG51bWJlciA9IC0xKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdDtcclxuXHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IFN0cmluZyhzb3VyY2UpO1xyXG4gICAgICAgICAgICB0aGlzLmF0ID0gc3RhcnRGcm9tO1xyXG4gICAgICAgICAgICB0aGlzLmVuZEF0ID0gZW5kQXQ7XHJcbiAgICAgICAgICAgIHRoaXMuY2ggPSAnICc7XHJcbiAgICAgICAgICAgIHJlc3VsdCA9IHRoaXMudmFsdWUoKTtcclxuICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIlN5bnRheCBlcnJvclwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlcmUgaXMgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSByZWN1cnNpdmVseSB3YWxrIHRoZSBuZXcgc3RydWN0dXJlLFxyXG4gICAgICAgICAgICAvLyBwYXNzaW5nIGVhY2ggbmFtZS92YWx1ZSBwYWlyIHRvIHRoZSByZXZpdmVyIGZ1bmN0aW9uIGZvciBwb3NzaWJsZVxyXG4gICAgICAgICAgICAvLyB0cmFuc2Zvcm1hdGlvbiwgc3RhcnRpbmcgd2l0aCBhIHRlbXBvcmFyeSByb290IG9iamVjdCB0aGF0IGhvbGRzIHRoZSByZXN1bHRcclxuICAgICAgICAgICAgLy8gaW4gYW4gZW1wdHkga2V5LiBJZiB0aGVyZSBpcyBub3QgYSByZXZpdmVyIGZ1bmN0aW9uLCB3ZSBzaW1wbHkgcmV0dXJuIHRoZVxyXG4gICAgICAgICAgICAvLyByZXN1bHQuXHJcblxyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHJldml2ZXIgPT09ICdmdW5jdGlvbicgPyAoZnVuY3Rpb24gd2Fsayhob2xkZXIsIGtleSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGssIHYsIHZhbHVlID0gaG9sZGVyW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsdWUgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAoayBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHZhbHVlLCBrKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdiA9IHdhbGsodmFsdWUsIGspO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHYgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlW2tdID0gdjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW2tdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHJldml2ZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9ICh7ICcnOiByZXN1bHQgfSwgJycpKSA6IHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBlcnJvcihtOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgLy8gQ2FsbCBlcnJvciB3aGVuIHNvbWV0aGluZyBpcyB3cm9uZy5cclxuICAgICAgICAgICAgdmFyIGVycm9yID0gbmV3IFN5bnRheEVycm9yKCk7XHJcbiAgICAgICAgICAgIGVycm9yLm1lc3NhZ2UgPSBtO1xyXG4gICAgICAgICAgICBlcnJvcltcImF0XCJdID0gdGhpcy5hdDtcclxuICAgICAgICAgICAgdGhyb3cgZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbmV4dChjOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIC8vIElmIGEgYyBwYXJhbWV0ZXIgaXMgcHJvdmlkZWQsIHZlcmlmeSB0aGF0IGl0IG1hdGNoZXMgdGhlIGN1cnJlbnQgY2hhcmFjdGVyLlxyXG4gICAgICAgICAgICBpZiAoYyAmJiBjICE9PSB0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiRXhwZWN0ZWQgJ1wiICsgYyArIFwiJyBpbnN0ZWFkIG9mICdcIiArIHRoaXMuY2ggKyBcIidcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0aGlzLm5leHQgY2hhcmFjdGVyLiBXaGVuIHRoZXJlIGFyZSBubyBtb3JlIGNoYXJhY3RlcnMsXHJcbiAgICAgICAgICAgIC8vIHJldHVybiB0aGUgZW1wdHkgc3RyaW5nLlxyXG4gICAgICAgICAgICB0aGlzLmNoID0gdGhpcy5jaGFydEF0KCk7XHJcbiAgICAgICAgICAgIHRoaXMuYXQgKz0gMTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2g7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcGVlaygpIHtcclxuICAgICAgICAgICAgLy8gR2V0IHRoZSB0aGlzLm5leHQgY2hhcmFjdGVyIHdpdGhvdXQgY29uc3VtaW5nIGl0IG9yXHJcbiAgICAgICAgICAgIC8vIGFzc2lnbmluZyBpdCB0byB0aGUgdGhpcy5jaCB2YXJhaWJsZS5cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hhcnRBdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoYXJ0QXQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVuZEF0ID4gLTEgJiYgdGhpcy5hdCA+PSB0aGlzLmVuZEF0KSByZXR1cm4gJyc7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHQuY2hhckF0KHRoaXMuYXQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlkZW50aWZpZXIoKSB7XHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGFuIGlkZW50aWZpZXIuIE5vcm1hbGx5LCByZXNlcnZlZCB3b3JkcyBhcmUgZGlzYWxsb3dlZCBoZXJlLCBidXQgd2VcclxuICAgICAgICAgICAgLy8gb25seSB1c2UgdGhpcyBmb3IgdW5xdW90ZWQgb2JqZWN0IGtleXMsIHdoZXJlIHJlc2VydmVkIHdvcmRzIGFyZSBhbGxvd2VkLFxyXG4gICAgICAgICAgICAvLyBzbyB3ZSBkb24ndCBjaGVjayBmb3IgdGhvc2UgaGVyZS4gUmVmZXJlbmNlczpcclxuICAgICAgICAgICAgLy8gLSBodHRwOi8vZXM1LmdpdGh1Yi5jb20vI3g3LjZcclxuICAgICAgICAgICAgLy8gLSBodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi9Db3JlX0phdmFTY3JpcHRfMS41X0d1aWRlL0NvcmVfTGFuZ3VhZ2VfRmVhdHVyZXMjVmFyaWFibGVzXHJcbiAgICAgICAgICAgIC8vIC0gaHR0cDovL2RvY3N0b3JlLm1pay51YS9vcmVsbHkvd2VicHJvZy9qc2NyaXB0L2NoMDJfMDcuaHRtXHJcbiAgICAgICAgICAgIC8vIFRPRE8gSWRlbnRpZmllcnMgY2FuIGhhdmUgVW5pY29kZSBcImxldHRlcnNcIiBpbiB0aGVtOyBhZGQgc3VwcG9ydCBmb3IgdGhvc2UuXHJcbiAgICAgICAgICAgIHZhciBrZXkgPSB0aGlzLmNoO1xyXG5cclxuICAgICAgICAgICAgLy8gSWRlbnRpZmllcnMgbXVzdCBzdGFydCB3aXRoIGEgbGV0dGVyLCBfIG9yICQuXHJcbiAgICAgICAgICAgIGlmICgodGhpcy5jaCAhPT0gJ18nICYmIHRoaXMuY2ggIT09ICckJykgJiZcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoIDwgJ2EnIHx8IHRoaXMuY2ggPiAneicpICYmXHJcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA8ICdBJyB8fCB0aGlzLmNoID4gJ1onKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBpZGVudGlmaWVyXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBTdWJzZXF1ZW50IGNoYXJhY3RlcnMgY2FuIGNvbnRhaW4gZGlnaXRzLlxyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkgJiYgKFxyXG4gICAgICAgICAgICAgICAgdGhpcy5jaCA9PT0gJ18nIHx8IHRoaXMuY2ggPT09ICckJyB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ3onKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2ggPj0gJ0EnICYmIHRoaXMuY2ggPD0gJ1onKSB8fFxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSkpIHtcclxuICAgICAgICAgICAgICAgIGtleSArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4ga2V5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG51bWJlcigpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGEgbnVtYmVyIHZhbHVlLlxyXG5cclxuICAgICAgICAgICAgdmFyIG51bWJlcixcclxuICAgICAgICAgICAgICAgIHNpZ24gPSAnJyxcclxuICAgICAgICAgICAgICAgIHN0cmluZyA9ICcnLFxyXG4gICAgICAgICAgICAgICAgYmFzZSA9IDEwO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICctJyB8fCB0aGlzLmNoID09PSAnKycpIHtcclxuICAgICAgICAgICAgICAgIHNpZ24gPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KHRoaXMuY2gpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzdXBwb3J0IGZvciBJbmZpbml0eSAoY291bGQgdHdlYWsgdG8gYWxsb3cgb3RoZXIgd29yZHMpOlxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ0knKSB7XHJcbiAgICAgICAgICAgICAgICBudW1iZXIgPSB0aGlzLndvcmQoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgbnVtYmVyICE9PSAnbnVtYmVyJyB8fCBpc05hTihudW1iZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcignVW5leHBlY3RlZCB3b3JkIGZvciBudW1iZXInKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiAoc2lnbiA9PT0gJy0nKSA/IC1udW1iZXIgOiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgZm9yIE5hTlxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ04nKSB7XHJcbiAgICAgICAgICAgICAgICBudW1iZXIgPSB0aGlzLndvcmQoKTtcclxuICAgICAgICAgICAgICAgIGlmICghaXNOYU4obnVtYmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ2V4cGVjdGVkIHdvcmQgdG8gYmUgTmFOJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyBpZ25vcmUgc2lnbiBhcyAtTmFOIGFsc28gaXMgTmFOXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtYmVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJzAnKSB7XHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd4JyB8fCB0aGlzLmNoID09PSAnWCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICBiYXNlID0gMTY7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcignT2N0YWwgbGl0ZXJhbCcpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKGJhc2UpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgMTA6XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gJy4nO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkgJiYgdGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnZScgfHwgdGhpcy5jaCA9PT0gJ0UnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICctJyB8fCB0aGlzLmNoID09PSAnKycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxNjpcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScgfHwgdGhpcy5jaCA+PSAnQScgJiYgdGhpcy5jaCA8PSAnRicgfHwgdGhpcy5jaCA+PSAnYScgJiYgdGhpcy5jaCA8PSAnZicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHNpZ24gPT09ICctJykge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gLXN0cmluZztcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG51bWJlciA9ICtzdHJpbmc7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICghaXNGaW5pdGUobnVtYmVyKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBudW1iZXJcIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVtYmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc3RyaW5nKCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGFyc2UgYSBzdHJpbmcgdmFsdWUuXHJcblxyXG4gICAgICAgICAgICB2YXIgaGV4LFxyXG4gICAgICAgICAgICAgICAgaSxcclxuICAgICAgICAgICAgICAgIHN0cmluZyA9ICcnLFxyXG4gICAgICAgICAgICAgICAgZGVsaW0sICAgICAgLy8gZG91YmxlIHF1b3RlIG9yIHNpbmdsZSBxdW90ZVxyXG4gICAgICAgICAgICAgICAgdWZmZmY7XHJcblxyXG4gICAgICAgICAgICAvLyBXaGVuIHBhcnNpbmcgZm9yIHN0cmluZyB2YWx1ZXMsIHdlIG11c3QgbG9vayBmb3IgJyBvciBcIiBhbmQgXFwgY2hhcmFjdGVycy5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnXCInIHx8IHRoaXMuY2ggPT09IFwiJ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBkZWxpbSA9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gZGVsaW0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBzdHJpbmc7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxcXCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAndScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVmZmZmID0gMDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCA0OyBpICs9IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBoZXggPSBwYXJzZUludCh0aGlzLm5leHQoKSwgMTYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaW5pdGUoaGV4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdWZmZmYgPSB1ZmZmZiAqIDE2ICsgaGV4O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IFN0cmluZy5mcm9tQ2hhckNvZGUodWZmZmYpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXHInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wZWVrKCkgPT09ICdcXG4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF0gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gU3VydmV5SlNPTjUuZXNjYXBlZVt0aGlzLmNoXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB1bmVzY2FwZWQgbmV3bGluZXMgYXJlIGludmFsaWQ7IHNlZTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2FzZWVtay9qc29uNS9pc3N1ZXMvMjRcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVE9ETyB0aGlzIGZlZWxzIHNwZWNpYWwtY2FzZWQ7IGFyZSB0aGVyZSBvdGhlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBpbnZhbGlkIHVuZXNjYXBlZCBjaGFycz9cclxuICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgc3RyaW5nXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlubGluZUNvbW1lbnQoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIGFuIGlubGluZSBjb21tZW50LCBhc3N1bWluZyB0aGlzIGlzIG9uZS4gVGhlIGN1cnJlbnQgY2hhcmFjdGVyIHNob3VsZFxyXG4gICAgICAgICAgICAvLyBiZSB0aGUgc2Vjb25kIC8gY2hhcmFjdGVyIGluIHRoZSAvLyBwYWlyIHRoYXQgYmVnaW5zIHRoaXMgaW5saW5lIGNvbW1lbnQuXHJcbiAgICAgICAgICAgIC8vIFRvIGZpbmlzaCB0aGUgaW5saW5lIGNvbW1lbnQsIHdlIGxvb2sgZm9yIGEgbmV3bGluZSBvciB0aGUgZW5kIG9mIHRoZSB0ZXh0LlxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhbiBpbmxpbmUgY29tbWVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1xcbicgfHwgdGhpcy5jaCA9PT0gJ1xccicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKHRoaXMuY2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGJsb2NrQ29tbWVudCgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFNraXAgYSBibG9jayBjb21tZW50LCBhc3N1bWluZyB0aGlzIGlzIG9uZS4gVGhlIGN1cnJlbnQgY2hhcmFjdGVyIHNob3VsZCBiZVxyXG4gICAgICAgICAgICAvLyB0aGUgKiBjaGFyYWN0ZXIgaW4gdGhlIC8qIHBhaXIgdGhhdCBiZWdpbnMgdGhpcyBibG9jayBjb21tZW50LlxyXG4gICAgICAgICAgICAvLyBUbyBmaW5pc2ggdGhlIGJsb2NrIGNvbW1lbnQsIHdlIGxvb2sgZm9yIGFuIGVuZGluZyAqLyBwYWlyIG9mIGNoYXJhY3RlcnMsXHJcbiAgICAgICAgICAgIC8vIGJ1dCB3ZSBhbHNvIHdhdGNoIGZvciB0aGUgZW5kIG9mIHRleHQgYmVmb3JlIHRoZSBjb21tZW50IGlzIHRlcm1pbmF0ZWQuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJyonKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGEgYmxvY2sgY29tbWVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZG8ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA9PT0gJyonKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcqJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJy8nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSB3aGlsZSAodGhpcy5jaCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiVW50ZXJtaW5hdGVkIGJsb2NrIGNvbW1lbnRcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY29tbWVudCgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFNraXAgYSBjb21tZW50LCB3aGV0aGVyIGlubGluZSBvciBibG9jay1sZXZlbCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuXHJcbiAgICAgICAgICAgIC8vIENvbW1lbnRzIGFsd2F5cyBiZWdpbiB3aXRoIGEgLyBjaGFyYWN0ZXIuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGEgY29tbWVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdGhpcy5uZXh0KCcvJyk7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlubGluZUNvbW1lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnKicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYmxvY2tDb21tZW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiVW5yZWNvZ25pemVkIGNvbW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB3aGl0ZSgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFNraXAgd2hpdGVzcGFjZSBhbmQgY29tbWVudHMuXHJcbiAgICAgICAgICAgIC8vIE5vdGUgdGhhdCB3ZSdyZSBkZXRlY3RpbmcgY29tbWVudHMgYnkgb25seSBhIHNpbmdsZSAvIGNoYXJhY3Rlci5cclxuICAgICAgICAgICAgLy8gVGhpcyB3b3JrcyBzaW5jZSByZWd1bGFyIGV4cHJlc3Npb25zIGFyZSBub3QgdmFsaWQgSlNPTig1KSwgYnV0IHRoaXMgd2lsbFxyXG4gICAgICAgICAgICAvLyBicmVhayBpZiB0aGVyZSBhcmUgb3RoZXIgdmFsaWQgdmFsdWVzIHRoYXQgYmVnaW4gd2l0aCBhIC8gY2hhcmFjdGVyIVxyXG5cclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmNvbW1lbnQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAoU3VydmV5SlNPTjUud3MuaW5kZXhPZih0aGlzLmNoKSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHdvcmQoKTogYW55IHtcclxuXHJcbiAgICAgICAgICAgIC8vIHRydWUsIGZhbHNlLCBvciBudWxsLlxyXG5cclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd0JzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3QnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3InKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3UnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ2YnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnYScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgncycpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ24nOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnSSc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdJJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdmJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdpJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd5Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEluZmluaXR5O1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnTic6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdOJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdOJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIE5hTjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiVW5leHBlY3RlZCAnXCIgKyB0aGlzLmNoICsgXCInXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFycmF5KCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGFyc2UgYW4gYXJyYXkgdmFsdWUuXHJcblxyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnWycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnWycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ10nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnXScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7ICAgLy8gUG90ZW50aWFsbHkgZW1wdHkgYXJyYXlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gRVM1IGFsbG93cyBvbWl0dGluZyBlbGVtZW50cyBpbiBhcnJheXMsIGUuZy4gWyxdIGFuZFxyXG4gICAgICAgICAgICAgICAgICAgIC8vIFssbnVsbF0uIFdlIGRvbid0IGFsbG93IHRoaXMgaW4gSlNPTjUuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcsJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiTWlzc2luZyBhcnJheSBlbGVtZW50XCIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2godGhpcy52YWx1ZSgpKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY29tbWEgYWZ0ZXIgdGhpcyB2YWx1ZSwgdGhpcyBuZWVkcyB0b1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGJlIHRoZSBlbmQgb2YgdGhlIGFycmF5LlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCddJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgYXJyYXlcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb2JqZWN0KCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGFyc2UgYW4gb2JqZWN0IHZhbHVlLlxyXG5cclxuICAgICAgICAgICAgdmFyIGtleSxcclxuICAgICAgICAgICAgICAgIHN0YXJ0LFxyXG4gICAgICAgICAgICAgICAgaXNGaXJzdFByb3BlcnR5ID0gdHJ1ZSxcclxuICAgICAgICAgICAgICAgIG9iamVjdCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXSA9IHsgc3RhcnQ6IHRoaXMuYXQgLSAxIH07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd7Jykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd7Jyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMuYXQgLSAxO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ30nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdLmVuZCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0OyAgIC8vIFBvdGVudGlhbGx5IGVtcHR5IG9iamVjdFxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gS2V5cyBjYW4gYmUgdW5xdW90ZWQuIElmIHRoZXkgYXJlLCB0aGV5IG5lZWQgdG8gYmVcclxuICAgICAgICAgICAgICAgICAgICAvLyB2YWxpZCBKUyBpZGVudGlmaWVycy5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1wiJyB8fCB0aGlzLmNoID09PSBcIidcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLnN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuaWRlbnRpZmllcigpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XSA9IHsgc3RhcnQ6IHN0YXJ0LCB2YWx1ZVN0YXJ0OiB0aGlzLmF0IH07XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnOicpO1xyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gdGhpcy52YWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmF0IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZCA9IHN0YXJ0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBjb21tYSBhZnRlciB0aGlzIHBhaXIsIHRoaXMgbmVlZHMgdG8gYmVcclxuICAgICAgICAgICAgICAgICAgICAvLyB0aGUgZW5kIG9mIHRoZSBvYmplY3QuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcsJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdLmVuZCA9IHRoaXMuYXQgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnfScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqZWN0O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0ZpcnN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0uZW5kLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlzRmlyc3RQcm9wZXJ0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgb2JqZWN0XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZhbHVlKCk6IGFueSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXJzZSBhIEpTT04gdmFsdWUuIEl0IGNvdWxkIGJlIGFuIG9iamVjdCwgYW4gYXJyYXksIGEgc3RyaW5nLCBhIG51bWJlcixcclxuICAgICAgICAgICAgLy8gb3IgYSB3b3JkLlxyXG5cclxuICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3snOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm9iamVjdCgpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnWyc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuYXJyYXkoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1wiJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgXCInXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICctJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJysnOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnLic6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubnVtYmVyKCk7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JyA/IHRoaXMubnVtYmVyKCkgOiB0aGlzLndvcmQoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZXBsYWNlcjogYW55O1xyXG4gICAgICAgIHByaXZhdGUgaW5kZW50U3RyOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBvYmpTdGFjaztcclxuXHJcbiAgICAgICAgcHVibGljIHN0cmluZ2lmeShvYmo6IGFueSwgcmVwbGFjZXI6IGFueSA9IG51bGwsIHNwYWNlOiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXBsYWNlciAmJiAodHlwZW9mIChyZXBsYWNlcikgIT09IFwiZnVuY3Rpb25cIiAmJiAhdGhpcy5pc0FycmF5KHJlcGxhY2VyKSkpIHtcclxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignUmVwbGFjZXIgbXVzdCBiZSBhIGZ1bmN0aW9uIG9yIGFuIGFycmF5Jyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5yZXBsYWNlciA9IHJlcGxhY2VyO1xyXG4gICAgICAgICAgICB0aGlzLmluZGVudFN0ciA9IHRoaXMuZ2V0SW5kZW50KHNwYWNlKTtcclxuICAgICAgICAgICAgdGhpcy5vYmpTdGFjayA9IFtdO1xyXG4gICAgICAgICAgICAvLyBzcGVjaWFsIGNhc2UuLi53aGVuIHVuZGVmaW5lZCBpcyB1c2VkIGluc2lkZSBvZlxyXG4gICAgICAgICAgICAvLyBhIGNvbXBvdW5kIG9iamVjdC9hcnJheSwgcmV0dXJuIG51bGwuXHJcbiAgICAgICAgICAgIC8vIGJ1dCB3aGVuIHRvcC1sZXZlbCwgcmV0dXJuIHVuZGVmaW5lZFxyXG4gICAgICAgICAgICB2YXIgdG9wTGV2ZWxIb2xkZXIgPSB7IFwiXCI6IG9iaiB9O1xyXG4gICAgICAgICAgICBpZiAob2JqID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZCh0b3BMZXZlbEhvbGRlciwgJycsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmludGVybmFsU3RyaW5naWZ5KHRvcExldmVsSG9sZGVyLCAnJywgdHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0SW5kZW50KHNwYWNlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoc3BhY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwic3RyaW5nXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3BhY2U7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJudW1iZXJcIiAmJiBzcGFjZSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMubWFrZUluZGVudChcIiBcIiwgc3BhY2UsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXI6IGFueSwga2V5OiBhbnksIGlzVG9wTGV2ZWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gaG9sZGVyW2tleV07XHJcblxyXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSB3aXRoIGl0cyB0b0pTT04gdmFsdWUgZmlyc3QsIGlmIHBvc3NpYmxlXHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB2YWx1ZS50b0pTT04gJiYgdHlwZW9mIHZhbHVlLnRvSlNPTiA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHZhbHVlLnRvSlNPTigpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGUgdXNlci1zdXBwbGllZCByZXBsYWNlciBpZiBhIGZ1bmN0aW9uLCBjYWxsIGl0LiBJZiBpdCdzIGFuIGFycmF5LCBjaGVjayBvYmplY3RzJyBzdHJpbmcga2V5cyBmb3JcclxuICAgICAgICAgICAgLy8gcHJlc2VuY2UgaW4gdGhlIGFycmF5IChyZW1vdmluZyB0aGUga2V5L3ZhbHVlIHBhaXIgZnJvbSB0aGUgcmVzdWx0aW5nIEpTT04gaWYgdGhlIGtleSBpcyBtaXNzaW5nKS5cclxuICAgICAgICAgICAgaWYgKHR5cGVvZiAodGhpcy5yZXBsYWNlcikgPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZXIuY2FsbChob2xkZXIsIGtleSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMucmVwbGFjZXIpIHtcclxuICAgICAgICAgICAgICAgIGlmIChpc1RvcExldmVsIHx8IHRoaXMuaXNBcnJheShob2xkZXIpIHx8IHRoaXMucmVwbGFjZXIuaW5kZXhPZihrZXkpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaXNXb3JkQ2hhcihjaGFyOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykgfHxcclxuICAgICAgICAgICAgICAgIChjaGFyID49ICdBJyAmJiBjaGFyIDw9ICdaJykgfHxcclxuICAgICAgICAgICAgICAgIChjaGFyID49ICcwJyAmJiBjaGFyIDw9ICc5JykgfHxcclxuICAgICAgICAgICAgICAgIGNoYXIgPT09ICdfJyB8fCBjaGFyID09PSAnJCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzV29yZFN0YXJ0KGNoYXI6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKGNoYXIgPj0gJ2EnICYmIGNoYXIgPD0gJ3onKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNoYXIgPj0gJ0EnICYmIGNoYXIgPD0gJ1onKSB8fFxyXG4gICAgICAgICAgICAgICAgY2hhciA9PT0gJ18nIHx8IGNoYXIgPT09ICckJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaXNXb3JkKGtleTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Yga2V5ICE9PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1dvcmRTdGFydChrZXlbMF0pKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGkgPSAxLCBsZW5ndGggPSBrZXkubGVuZ3RoO1xyXG4gICAgICAgICAgICB3aGlsZSAoaSA8IGxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmlzV29yZENoYXIoa2V5W2ldKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGkrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gcG9seWZpbGxzXHJcbiAgICAgICAgcHJpdmF0ZSBpc0FycmF5KG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmIChBcnJheS5pc0FycmF5KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBBcnJheV0nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzRGF0ZShvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IERhdGVdJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaXNOYU4odmFsOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiB2YWwgPT09ICdudW1iZXInICYmIHZhbCAhPT0gdmFsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBcclxuICAgICAgICBwcml2YXRlIGNoZWNrRm9yQ2lyY3VsYXIob2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLm9ialN0YWNrLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5vYmpTdGFja1tpXSA9PT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNvbnZlcnRpbmcgY2lyY3VsYXIgc3RydWN0dXJlIHRvIEpTT05cIik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBtYWtlSW5kZW50KHN0cjogc3RyaW5nLCBudW06IG51bWJlciwgbm9OZXdMaW5lOiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKCFzdHIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIGluZGVudGF0aW9uIG5vIG1vcmUgdGhhbiAxMCBjaGFyc1xyXG4gICAgICAgICAgICBpZiAoc3RyLmxlbmd0aCA+IDEwKSB7XHJcbiAgICAgICAgICAgICAgICBzdHIgPSBzdHIuc3Vic3RyaW5nKDAsIDEwKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGluZGVudCA9IG5vTmV3TGluZSA/IFwiXCIgOiBcIlxcblwiO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG51bTsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRlbnQgKz0gc3RyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gaW5kZW50O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gQ29waWVkIGZyb20gQ3Jva2ZvcmQncyBpbXBsZW1lbnRhdGlvbiBvZiBKU09OXHJcbiAgICAgICAgLy8gU2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9kb3VnbGFzY3JvY2tmb3JkL0pTT04tanMvYmxvYi9lMzlkYjRiN2U2MjQ5ZjA0YTE5NWU3ZGQwODQwZTYxMGNjOWU5NDFlL2pzb24yLmpzI0wxOTVcclxuICAgICAgICAvLyBCZWdpblxyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGN4ID0gL1tcXHUwMDAwXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXNjYXBhYmxlID0gL1tcXFxcXFxcIlxceDAwLVxceDFmXFx4N2YtXFx4OWZcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtZXRhID0geyAvLyB0YWJsZSBvZiBjaGFyYWN0ZXIgc3Vic3RpdHV0aW9uc1xyXG4gICAgICAgICAgICAnXFxiJzogJ1xcXFxiJyxcclxuICAgICAgICAgICAgJ1xcdCc6ICdcXFxcdCcsXHJcbiAgICAgICAgICAgICdcXG4nOiAnXFxcXG4nLFxyXG4gICAgICAgICAgICAnXFxmJzogJ1xcXFxmJyxcclxuICAgICAgICAgICAgJ1xccic6ICdcXFxccicsXHJcbiAgICAgICAgICAgICdcIic6ICdcXFxcXCInLFxyXG4gICAgICAgICAgICAnXFxcXCc6ICdcXFxcXFxcXCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByaXZhdGUgZXNjYXBlU3RyaW5nKHN0cjogc3RyaW5nKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGUgc3RyaW5nIGNvbnRhaW5zIG5vIGNvbnRyb2wgY2hhcmFjdGVycywgbm8gcXVvdGUgY2hhcmFjdGVycywgYW5kIG5vXHJcbiAgICAgICAgICAgIC8vIGJhY2tzbGFzaCBjaGFyYWN0ZXJzLCB0aGVuIHdlIGNhbiBzYWZlbHkgc2xhcCBzb21lIHF1b3RlcyBhcm91bmQgaXQuXHJcbiAgICAgICAgICAgIC8vIE90aGVyd2lzZSB3ZSBtdXN0IGFsc28gcmVwbGFjZSB0aGUgb2ZmZW5kaW5nIGNoYXJhY3RlcnMgd2l0aCBzYWZlIGVzY2FwZVxyXG4gICAgICAgICAgICAvLyBzZXF1ZW5jZXMuXHJcbiAgICAgICAgICAgIFN1cnZleUpTT041LmVzY2FwYWJsZS5sYXN0SW5kZXggPSAwO1xyXG4gICAgICAgICAgICByZXR1cm4gU3VydmV5SlNPTjUuZXNjYXBhYmxlLnRlc3Qoc3RyKSA/ICdcIicgKyBzdHIucmVwbGFjZShTdXJ2ZXlKU09ONS5lc2NhcGFibGUsIGZ1bmN0aW9uIChhKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYyA9IFN1cnZleUpTT041Lm1ldGFbYV07XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGMgPT09ICdzdHJpbmcnID9cclxuICAgICAgICAgICAgICAgICAgICBjIDpcclxuICAgICAgICAgICAgICAgICAgICAnXFxcXHUnICsgKCcwMDAwJyArIGEuY2hhckNvZGVBdCgwKS50b1N0cmluZygxNikpLnNsaWNlKC00KTtcclxuICAgICAgICAgICAgfSkgKyAnXCInIDogJ1wiJyArIHN0ciArICdcIic7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIEVuZFxyXG5cclxuICAgICAgICBwcml2YXRlIGludGVybmFsU3RyaW5naWZ5KGhvbGRlcjogYW55LCBrZXk6IGFueSwgaXNUb3BMZXZlbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB2YXIgYnVmZmVyLCByZXM7XHJcblxyXG4gICAgICAgICAgICAvLyBSZXBsYWNlIHRoZSB2YWx1ZSwgaWYgbmVjZXNzYXJ5XHJcbiAgICAgICAgICAgIHZhciBvYmpfcGFydCA9IHRoaXMuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKGhvbGRlciwga2V5LCBpc1RvcExldmVsKTtcclxuXHJcbiAgICAgICAgICAgIGlmIChvYmpfcGFydCAmJiAhdGhpcy5pc0RhdGUob2JqX3BhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICAvLyB1bmJveCBvYmplY3RzXHJcbiAgICAgICAgICAgICAgICAvLyBkb24ndCB1bmJveCBkYXRlcywgc2luY2Ugd2lsbCB0dXJuIGl0IGludG8gbnVtYmVyXHJcbiAgICAgICAgICAgICAgICBvYmpfcGFydCA9IG9ial9wYXJ0LnZhbHVlT2YoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzd2l0Y2ggKHR5cGVvZiBvYmpfcGFydCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSBcImJvb2xlYW5cIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqX3BhcnQudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwibnVtYmVyXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGlzTmFOKG9ial9wYXJ0KSB8fCAhaXNGaW5pdGUob2JqX3BhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ial9wYXJ0LnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBcInN0cmluZ1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmVzY2FwZVN0cmluZyhvYmpfcGFydC50b1N0cmluZygpKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwib2JqZWN0XCI6XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9ial9wYXJ0ID09PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBcIm51bGxcIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaXNBcnJheShvYmpfcGFydCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckNpcmN1bGFyKG9ial9wYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gXCJbXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucHVzaChvYmpfcGFydCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ial9wYXJ0Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXMgPSB0aGlzLmludGVybmFsU3RyaW5naWZ5KG9ial9wYXJ0LCBpLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAocmVzID09PSBudWxsIHx8IHR5cGVvZiByZXMgPT09IFwidW5kZWZpbmVkXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSByZXM7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoaSA8IG9ial9wYXJ0Lmxlbmd0aCAtIDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCIsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuaW5kZW50U3RyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwiXFxuXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgsIHRydWUpICsgXCJdXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja0ZvckNpcmN1bGFyKG9ial9wYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gXCJ7XCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBub25FbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnB1c2gob2JqX3BhcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBwcm9wIGluIG9ial9wYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAob2JqX3BhcnQuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB0aGlzLmludGVybmFsU3RyaW5naWZ5KG9ial9wYXJ0LCBwcm9wLCBmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaXNUb3BMZXZlbCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09IFwidW5kZWZpbmVkXCIgJiYgdmFsdWUgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBub25FbXB0eSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwcm9wS2V5ID0gdGhpcy5pc1dvcmQocHJvcCkgPyBwcm9wIDogdGhpcy5lc2NhcGVTdHJpbmcocHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBwcm9wS2V5ICsgXCI6XCIgKyAodGhpcy5pbmRlbnRTdHIgPyAnICcgOiAnJykgKyB2YWx1ZSArIFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9uRW1wdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCwgYnVmZmVyLmxlbmd0aCAtIDEpICsgdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCkgKyBcIn1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9ICd7fSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZnVuY3Rpb25zIGFuZCB1bmRlZmluZWQgc2hvdWxkIGJlIGlnbm9yZWRcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEl0ZW0ge1xyXG4gICAgICAgIHB1YmxpYyB2YWx1ZTogU3VydmV5LkJhc2U7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0cyB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnRlbmQ6IHN0cmluZyA9IFwiLi4uXCI7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBrb09iamVjdHM6IGFueSwgcHVibGljIGtvU2VsZWN0ZWQ6IGFueSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2VJdGVtID0gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnN1cnZleS5wYWdlcy5pbmRleE9mKHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChwcmV2UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gcHJldlBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMTsgLy8wIC0gU3VydmV5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKHBhZ2VJdGVtLCBpbmRleCk7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihwYWdlLnF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaXRlbSwgaW5kZXggKyBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQocGFnZUl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocGFnZTogU3VydmV5LlBhZ2UsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbkluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbikgKyAxO1xyXG4gICAgICAgICAgICBpbmRleCArPSBxdWVzdGlvbkluZGV4O1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IHRoaXMuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaXRlbSwgaW5kZXgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoaXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZWxlY3RPYmplY3Qob2JqOiBTdXJ2ZXkuQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgb2JqcyA9IHRoaXMua29PYmplY3RzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2Jqcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKG9ianNbaV0udmFsdWUgPT0gb2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG9ianNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlT2JqZWN0KG9iajogU3VydmV5LkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgY291bnRUb1JlbW92ZSA9IDE7XHJcbiAgICAgICAgICAgIGlmIChTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2U6IFN1cnZleS5QYWdlID0gPFN1cnZleS5QYWdlPm9iajtcclxuICAgICAgICAgICAgICAgIGNvdW50VG9SZW1vdmUgKz0gcGFnZS5xdWVzdGlvbnMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzLnNwbGljZShpbmRleCwgY291bnRUb1JlbW92ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBuYW1lQ2hhbmdlZChvYmo6IFN1cnZleS5CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0SXRlbUluZGV4KG9iaik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMoKVtpbmRleF0udGV4dCh0aGlzLmdldFRleHQob2JqKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkSXRlbShpdGVtOiBTdXJ2ZXlPYmplY3RJdGVtLCBpbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IHRoaXMua29PYmplY3RzKCkubGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvT2JqZWN0cy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCAwLCBpdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHJlYnVpbGQoKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmpzID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvT2JqZWN0cyhvYmpzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZChudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBvYmpzLnB1c2godGhpcy5jcmVhdGVJdGVtKHRoaXMuc3VydmV5LCBcIlN1cnZleVwiKSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gPFN1cnZleS5QYWdlPnRoaXMuc3VydmV5LnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgb2Jqcy5wdXNoKHRoaXMuY3JlYXRlUGFnZShwYWdlKSk7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBqID0gMDsgaiA8IHBhZ2UucXVlc3Rpb25zLmxlbmd0aDsgaisrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2Jqcy5wdXNoKHRoaXMuY3JlYXRlUXVlc3Rpb24ocGFnZS5xdWVzdGlvbnNbal0pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cyhvYmpzKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKHRoaXMuc3VydmV5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNyZWF0ZUl0ZW0ocGFnZSwgdGhpcy5nZXRUZXh0KHBhZ2UpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVRdWVzdGlvbihxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uQmFzZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVJdGVtKHF1ZXN0aW9uLCB0aGlzLmdldFRleHQocXVlc3Rpb24pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVJdGVtKHZhbHVlOiBTdXJ2ZXkuQmFzZSwgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IFN1cnZleU9iamVjdEl0ZW0oKTtcclxuICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpdGVtLnRleHQgPSBrby5vYnNlcnZhYmxlKHRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRJdGVtSW5kZXgodmFsdWU6IFN1cnZleS5CYXNlKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSB0aGlzLmtvT2JqZWN0cygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmpzW2ldLnZhbHVlID09IHZhbHVlKSByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGV4dChvYmo6IFN1cnZleS5CYXNlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGludGVuZCA9IFN1cnZleU9iamVjdHMuaW50ZW5kO1xyXG4gICAgICAgICAgICBpZiAoU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSAhPSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGludGVuZCArPSBTdXJ2ZXlPYmplY3RzLmludGVuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW50ZW5kICsgU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6InNyYyJ9
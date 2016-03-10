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
        DragDropHelper.prototype.isSurveyDragging = function (event) {
            if (!event)
                return false;
            var data = this.getData(event);
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
            var targetQuestion = this.survey.getQuestionByName(dataInfo["questionname"]);
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
            data = data.substr(DragDropHelper.dataStart.length);
            var array = data.split(',');
            var result = {};
            for (var i = 0; i < array.length; i++) {
                var item = array[i].split(':');
                result[item[0]] = item[1];
            }
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
        DragDropHelper.prototype.setData = function (event, data) {
            if (event.dataTransfer) {
                event.dataTransfer.setData("Text", data);
            }
            DragDropHelper.dragData = data;
        };
        DragDropHelper.prototype.getData = function (event) {
            if (event.dataTransfer) {
                var data = event.dataTransfer.getData("Text");
            }
            return data ? data : DragDropHelper.dragData;
        };
        DragDropHelper.prototype.clearData = function () {
            DragDropHelper.dragData = "";
            var prev = DragDropHelper.prevEvent;
            prev.question = null;
            prev.x = -1;
            prev.y = -1;
        };
        DragDropHelper.dataStart = "surveyjs,";
        DragDropHelper.dragData = "";
        DragDropHelper.prevEvent = { question: null, x: -1, y: -1 };
        return DragDropHelper;
    })();
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
    })();
    SurveyEditor.SurveyPropertyArray = SurveyPropertyArray;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectPropertyArrays.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var SurveyEditor;
(function (SurveyEditor) {
    var SurveyPropertyItemValues = (function (_super) {
        __extends(SurveyPropertyItemValues, _super);
        function SurveyPropertyItemValues(onValueChanged) {
            _super.call(this, onValueChanged);
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
        Object.defineProperty(SurveyPropertyItemValues.prototype, "value", {
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
        SurveyPropertyItemValues.prototype.AddItem = function () {
            this.koItems.push({ koValue: ko.observable(this.koNewValue()), koText: ko.observable(this.koNewText()) });
            this.koNewValue(null);
            this.koNewText(null);
        };
        SurveyPropertyItemValues.prototype.Apply = function () {
            this.value_ = [];
            for (var i = 0; i < this.koItems().length; i++) {
                var item = this.koItems()[i];
                this.value_.push({ value: item.koValue(), text: item.koText() });
            }
            if (this.onValueChanged) {
                this.onValueChanged(this.value_);
            }
        };
        return SurveyPropertyItemValues;
    })(SurveyEditor.SurveyPropertyArray);
    SurveyEditor.SurveyPropertyItemValues = SurveyPropertyItemValues;
})(SurveyEditor || (SurveyEditor = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(SurveyEditor.SurveyPropertyArray);
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
    })();
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
    })();
    SurveyEditor.SurveyPropertyTriggerObjects = SurveyPropertyTriggerObjects;
})(SurveyEditor || (SurveyEditor = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(SurveyEditor.SurveyPropertyArray);
    SurveyEditor.SurveyPropertyValidators = SurveyPropertyValidators;
    var SurveyPropertyValidatorItem = (function () {
        function SurveyPropertyValidatorItem(validator) {
            this.validator = validator;
            this.text = validator.getType();
        }
        return SurveyPropertyValidatorItem;
    })();
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
    })();
    SurveyEditor.SurveyHelper = SurveyHelper;
})(SurveyEditor || (SurveyEditor = {}));

/// <reference path="objectPropertyArrays.ts" />
/// <reference path="surveyHelper.ts" />
/// <reference path="objectPropertyValidators.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })(SurveyEditor.SurveyPropertyArray);
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
            if (this.arrayEditor) {
                this.arrayEditor.object = this.object;
                this.arrayEditor.title("Edit property '" + this.property.name + "'");
                this.arrayEditor.value = this.koValue();
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
    })();
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
    })();
    SurveyEditor.SurveyEmbedingWindow = SurveyEmbedingWindow;
})(SurveyEditor || (SurveyEditor = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
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
    })();
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
    })();
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
    })(SurveyVerbItem);
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
    })(SurveyVerbItem);
    SurveyEditor.SurveyVerbChangePageItem = SurveyVerbChangePageItem;
})(SurveyEditor || (SurveyEditor = {}));

var templateEditor;
(function (templateEditor) {
    var ko;
    (function (ko) {
        ko.html = '<nav class="navbar navbar-default">    <div class="container-fluid">        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">            <ul class="nav navbar-nav">                <li class="dropdown">                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span data-bind="text: koIsShowDesigner() ? \'Survey Designer\': \'JSON Editor\'"></span> <span class="caret"></span></a>                    <ul class="dropdown-menu">                        <li><a href="#" data-bind="click:selectDesignerClick">Use Survey Designer</a></li>                        <li><a href="#" data-bind="click:selectEditorClick">Use JSON Editor</a></li>                    </ul>                </li>            </ul>            <form class="navbar-form navbar-left">                <button type="button" class="btn btn-default" data-bind="click: runSurveyClick" data-toggle="modal" data-target="#surveyExampleModal">Run Survey</button>                <button type="button" class="btn btn-default" data-bind="click: embedingSurveyClick" data-toggle="modal" data-target="#surveyEmbedingModal">Embeding Survey to Your Page</button>                <button type="button" class="btn btn-default" data-bind="visible: koShowSaveButton, click: saveButtonClick" >Save Survey</button>            </form>        </div><!-- /.navbar-collapse -->    </div><!-- /.container-fluid --></nav><div class="panel" style="width:100%">    <div id="surveyjsEditor" data-bind="visible: !koIsShowDesigner()" style="height:450px;width:100%"></div>    <div class="row" data-bind="visible: koIsShowDesigner()">        <div class="col-xs-4 col-md-3">            <div class="panel panel-default" style="width:100%">                <div class="panel-heading">                    <div class="row">                        <select style="width:80%"  data-bind="options: koObjects, optionsText: \'text\', value: koSelectedObject"></select>                        <button type="button" data-bind="enable: koCanDeleteObject, click: deleteCurrentObject" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                    </div>                </div>                <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                <div class="panel-footer" data-bind="visible:surveyVerbs.koHasVerbs">                    <div data-bind="template: { name: \'objectverbs\', data: surveyVerbs }"></div>                </div>            </div>        </div>        <div class="col-xs-12 col-sm-6 col-md-8">            <nav class="navbar navbar-default">                <form class="navbar-form">                    <!-- ko foreach: questionTypes -->                    <button class="btn" type="button" draggable="true" data-bind="click: $parent.clickQuestion, event:{dragstart: function(el, e) { $parent.draggingQuestion($data, e); return true;}}">                        <span data-bind="text:$data"></span>                    </button>                    <!-- /ko  -->                </form>            </nav>            <div data-bind="template: { name: \'pageeditor\', data: pagesEditor }"></div>            <div style="overflow-y: scroll;height:450px;">                <div id="surveyjs" style="width:100%"></div>            </div></div>    </div></div><div id="surveyExampleModal" class="modal fade" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal">&times;</button>                <h4 class="modal-title">Running survey</h4>            </div>            <div class="modal-body">                <div id="surveyjsExample"></div>            </div>        </div>    </div></div><div id="surveyEmbedingModal" class="modal fade" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal">&times;</button>                <h4 class="modal-title">Embeding survey</h4>            </div>            <div class="modal-body">                <div data-bind="template: { name: \'surveyembeding\', data: surveyEmbeding }"></div>            </div>        </div>    </div></div><script type="text/html" id="objecteditor">    <table class="table svd_table-nowrap">        <tbody data-bind="foreach: koProperties">            <tr data-bind="click: $parent.changeActiveProperty($data), css: {\'active\': $parent.koActiveProperty() == $data}">                <td data-bind="text: name" width="50%"></td>                <td width="50%">                    <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data, attr: {title: koText}, style: {color: koIsDefault() ? \'gray\' : \'\'}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                    <div data-bind="visible: $parent.koActiveProperty() == $data">                        <!-- ko template: { name: \'propertyeditor-\' + editorType, data: $data } -->                        <!-- /ko -->                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="objectverbs">    <!-- ko foreach: koVerbs -->        <div>            <span data-bind="text:text"></span>            <select style="width:50%" data-bind="options: koItems, optionsText: \'text\', optionsValue:\'value\', value: koSelectedItem"></select>            <!-- ko if: ($index() != ($parent.koVerbs().length - 1)) -->            <p></p>            <!-- /ko -->          </div>    <!-- /ko  --></script><script type="text/html" id="pageeditor">    <ul class="nav nav-tabs">        <!-- ko foreach: koPages -->        <li data-bind="css: {active: koSelected()},event:{           dragstart:function(el, e){ $parent.dragStart(el); return true; },           dragover:function(el, e){ $parent.dragOver(el);},           dragend:function(el, e){ $parent.dragEnd();},           drop:function(el, e){ $parent.dragDrop(el);}         }">             <a href="#" data-bind="click:$parent.selectPageClick">                <span data-bind="text: title"></span>            </a>        </li>        <!-- /ko  -->        <li><button type="button" class="btn btn-default" data-bind="click:addNewPageClick"><span class="glyphicon glyphicon-plus"></span></button></li>    </ul></script><script type="text/html" id="propertyeditor-boolean">    <input type="checkbox" data-bind="checked: koValue" /></script><script type="text/html" id="propertyeditor-dropdown">    <select data-bind="value: koValue, options: choices"  style="width:100%"></select></script><script type="text/html" id="propertyeditor-itemvalues">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorItemValuesModal">Edit</button>    </div>    <div id="propertyEditorItemValuesModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <table class="table">                            <thead>                                <tr>                                    <th>Value</th>                                    <th>Text</th>                                    <th></th>                                </tr>                            </thead>                            <tbody>                                <!-- ko foreach: koItems -->                                <tr>                                    <td><input type="text" data-bind="value:koValue" style="width:200px" /></td>                                    <td><input type="text" data-bind="value:koText" style="width:200px" /></td>                                    <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>                                </tr>                                <!-- /ko -->                                <tr>                                    <td><input type="text" data-bind="value:koNewValue" style="width:200px" /></td>                                    <td><input type="text" data-bind="value:koNewText" style="width:200px" /></td>                                    <td><input type="button" data-bind="click: onAddClick" value="Add" /></td>                                </tr>                            </tbody>                        </table>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-number">    <input type="number" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-string">    <input type="text" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-textitems">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorTextItemsModal">Edit</button>    </div>    <div id="propertyEditorTextItemsModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <table class="table">                            <thead>                                <tr>                                    <th>Name</th>                                    <th>Title</th>                                    <th></th>                                </tr>                            </thead>                            <tbody>                                <!-- ko foreach: koItems -->                                <tr>                                    <td><input type="text" data-bind="value:koName" style="width:200px" /></td>                                    <td><input type="text" data-bind="value:koTitle" style="width:200px" /></td>                                    <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>                                </tr>                                <!-- /ko -->                                <tr>                                    <td colspan="4"><input type="button" data-bind="click: onAddClick" value="Add" /></td>                                </tr>                            </tbody>                        </table>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-triggers">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorTriggersModal">Edit</button>    </div>    <div id="propertyEditorTriggersModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <div class="panel-heading">                            <div class="row">                                <select style="width:65%" data-bind="options: koItems, optionsText: \'koText\', value: koSelected"></select>                                <button type="button" data-bind="enable: koQuestions().length > 0, click: onAddClick" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>                                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                            </div>                        </div>                        <div data-bind="visible: koSelected() == null">                            <div data-bind="visible: koQuestions().length == 0">                                There is no any question in the survey.                            </div>                            <div data-bind="visible: koQuestions().length > 0">                                Please create a trigger                            </div>                        </div>                        <div data-bind="visible: koSelected() != null">                            <div data-bind="with: koSelected">                                <span>On </span><select data-bind="options:$parent.koQuestions, value: koName"></select> <span> </span>                                <select data-bind="options:availableOperators, optionsValue: \'name\', optionsText: \'text\', value:koOperator"></select>                                <input type="text" data-bind="visible: koRequireValue, value:koValue" />                                <div class="row">                                    <div class="col-sm-6">                                        <!-- ko template: { name: \'propertyeditor-triggersitems\', data: pages } -->                                        <!-- /ko -->                                    </div>                                    <div class="col-sm-6">                                        <!-- ko template: { name: \'propertyeditor-triggersitems\', data: questions } -->                                        <!-- /ko -->                                    </div>                                </div>                            </div>                        </div>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-triggersitems">    <div class="panel">        <div class="panel-heading">            <span data-bind="text: title"></span>        </div>        <select multiple="multiple" data-bind="options:koChoosen, value: koChoosenSelected" style="width:200px;"></select>        <button type="button" data-bind="enable: koChoosenSelected() != null, click: onDeleteClick" style="width:40px; vertical-align:top" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>        <div>            <select data-bind="options:koObjects, value: koSelected" style="width:200px;"></select>            <button type="button" data-bind="enable: koSelected() != null, click: onAddClick" style="width:40px" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>        </div>    </div></script><script type="text/html" id="propertyeditor-validators">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorValidatorsModal">Edit</button>    </div>    <div id="propertyEditorValidatorsModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <div class="panel-heading">                            <div class="row">                                <select style="width:65%" data-bind="options: koItems, optionsText: \'text\', value: koSelected"></select>                                <div class="btn-group">                                    <button type="button" class="glyphicon glyphicon-plus dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                                     <span class="caret"></span>                                    </button>                                    <ul class="dropdown-menu" >                                        <!-- ko foreach: availableValidators -->                                        <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                                        <!-- /ko  -->                                    </ul>                                </div>                                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                            </div>                        </div>                        <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="surveyembeding">    <div class="row">        <select data-bind="value:koScriptUsing">            <option value="bootstrap">For bootstrap framework</option>            <option value="standard">No bootstrap</option>        </select>        <select data-bind="value:koShowAsWindow">            <option value="page">Use Survey Inside a Page</option>            <option value="window">Use Survey as a Window</option>        </select>        <label class="checkbox-inline" data-bind="visible:koHasIds">            <input type="checkbox" data-bind="checked:koLoadSurvey" />            <span>Load Survey from server</span>        </label>    </div>    <div class="panel">        <div class="panel-heading">Scripts and styles</div>        <div id="surveyEmbedingHead" style="height:70px;width:100%"></div>    </div>    <div class="panel" data-bind="visible: koShowAsWindow()==\'page\'">        <div class="panel-heading">HTML part</div>        <div id="surveyEmbedingBody" style="height:30px;width:100%"></div>    </div>    <div class="panel">        <div class="panel-heading">Java Script</div>        <div id="surveyEmbedingJava" style="height:300px;width:100%"></div>    </div></script>';
    })(ko = templateEditor.ko || (templateEditor.ko = {}));
})(templateEditor || (templateEditor = {}));

var template_page;
(function (template_page) {
    template_page.html = '<div data-bind="event:{           dragenter:function(el, e){ dragEnter(e);},           dragleave:function(el, e){ dragLeave(e);},           dragover:function(el, e){ return false;},           drop:function(el, e){ dragDrop(e);}}     ">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + title"></h4>    <!-- ko foreach: { data: questions, as: \'question\' } -->    <div class="svd_dragover" data-bind="visible:$parent.koDragging() == $index()"></div>    <!-- ko template: { name: \'survey-question\', data: question } -->    <!-- /ko -->    <!-- /ko -->    <div class="well" data-bind="visible:$root.isDesignMode && questions.length == 0">        <span>Please drop a question here.</span>    </div>    <div class="svd_dragover" data-bind="visible:koDragging() == questions.length"></div></div>';
})(template_page || (template_page = {}));

var template_question;
(function (template_question) {
    template_question.html = '<div class="well well-sm" data-bind="attr : {draggable: $root.isDesignMode}, visible: question.koVisible() || $root.isDesignMode, click: $root.isDesignMode ? koOnClick: null, css: {svd_q_selected : koIsSelected},         event:{           dragstart:function(el, e){ dragStart(e); return true; },           dragover:function(el, e){ dragOver(e);},           drop:function(el, e){ dragDrop(e);}         }">    <div data-bind="css:{svd_q_design: $root.isDesignMode}">        <div class="alert alert-danger" role="alert" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div>                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>                <span data-bind="text:$data.getText()"></span>            </div>        </div>        <h5 data-bind="text: question.koNo() +  (question.isRequired ? question.data.requiredText : \'\') + question.title"></h5>        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            Other (please describe)            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>    </div></div>';
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
            this.survey.mode = "designer";
            this.survey.render(this.surveyjs);
            this.surveyObjects.survey = this.survey;
            this.pagesEditor.survey = this.survey;
            this.pagesEditor.setSelectedPage(this.survey.currentPage);
            this.surveyVerbs.survey = this.survey;
            var self = this;
            this.surveyValue["onSelectedQuestionChanged"].add(function (sender, options) { self.surveyObjects.selectObject(sender["selectedQuestionValue"]); });
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
        SurveyEditor.prototype.doClickQuestion = function (questionType) {
            var name = SurveyEditor_1.SurveyHelper.getNewName(this.survey.getAllQuestions(), "question");
            var page = this.survey.currentPage;
            var index = -1;
            if (this.survey["selectedQuestionValue"] != null) {
                index = page.questions.indexOf(this.survey["selectedQuestionValue"]) + 1;
            }
            var question = Survey.QuestionFactory.Instance.createQuestion(questionType, name);
            page.addQuestion(question, index);
        };
        SurveyEditor.prototype.deleteCurrentObject = function () {
            this.deleteObject(this.koSelectedObject().value);
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
    })();
    SurveyEditor_1.SurveyEditor = SurveyEditor;
    new Survey.SurveyTemplateText().replaceText(template_page.html, "page");
    new Survey.SurveyTemplateText().replaceText(template_question.html, "question");
    Survey.Survey.prototype["onCreating"] = function () {
        this.selectedQuestionValue = null;
        this.onSelectedQuestionChanged = new Survey.Event();
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
    Survey.Question.prototype["onCreating"] = function () {
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
    Survey.Question.prototype["onSelectedQuestionChanged"] = function () {
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
    })();
    SurveyEditor.SurveyObjects = SurveyObjects;
})(SurveyEditor || (SurveyEditor = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyYWdkcm9waGVscGVyLnRzIiwib2JqZWN0UHJvcGVydHlBcnJheXMudHMiLCJvYmplY3RQcm9wZXJ0eUl0ZW1WYWx1ZXMudHMiLCJvYmplY3RQcm9wZXJ0eVRyaWdnZXJzLnRzIiwib2JqZWN0UHJvcGVydHlWYWxpZGF0b3JzLnRzIiwic3VydmV5SGVscGVyLnRzIiwib2JqZWN0UHJvcGVydHlUZXh0SXRlbXMudHMiLCJvYmplY3RQcm9wZXJ0eS50cyIsIm9iamVjdEVkaXRvci50cyIsInBhZ2VzRWRpdG9yLnRzIiwidGV4dFdvcmtlci50cyIsInN1cnZleUVtYmVkaW5nV2luZG93LnRzIiwib2JqZWN0VmVyYnMudHMiLCJ0ZW1wbGF0ZUVkaXRvci5rby5odG1sLnRzIiwidGVtcGxhdGVfcGFnZS5odG1sLnRzIiwidGVtcGxhdGVfcXVlc3Rpb24uaHRtbC50cyIsImVkaXRvci50cyIsImpzb241LnRzIiwic3VydmV5T2JqZWN0cy50cyJdLCJuYW1lcyI6WyJTdXJ2ZXlFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuc3VydmV5IiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ05ld1F1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ1F1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLmlzU3VydmV5RHJhZ2dpbmciLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZG9EcmFnRHJvcE92ZXIiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZG9Ecm9wIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLmdldFF1ZXN0aW9uSW5kZXgiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuaXNTYW1lUGxhY2UiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZ2V0RXZlbnQiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIubW92ZVF1ZXN0aW9uVG8iLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZ2V0RGF0YUluZm8iLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZ2V0WSIsIlN1cnZleUVkaXRvci5EcmFnRHJvcEhlbHBlci5zZXREYXRhIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLmdldERhdGEiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuY2xlYXJEYXRhIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5QXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlBcnJheS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUFycmF5LnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlcyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXMuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzLnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlcy5BZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlcy5BcHBseSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlcnMuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2Vycy52YWx1ZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzLmFwcGx5IiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlcnMuZ2V0TmFtZXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2Vycy5hZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyLmNyZWF0ZVRyaWdnZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyLmdldFRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyLmdldE9wZXJhdG9yVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIuZ2V0VmFsdWVUZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cy5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzLmRlbGV0ZUl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cy5hZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMuY2hhbmdlSXRlbXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnMudmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzLmFwcGx5IiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5hZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5nZXRBdmFpbGFibGVWYWxpZGF0b3JzIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5vblByb3BlcnR5VmFsdWVDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0uY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuT2JqVHlwZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlIZWxwZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SGVscGVyLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUhlbHBlci5nZXROZXdOYW1lIiwiU3VydmV5RWRpdG9yLlN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlIiwiU3VydmV5RWRpdG9yLlN1cnZleUhlbHBlci5nZXRPYmplY3ROYW1lIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zLnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zLkFkZEl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUZXh0SXRlbXMuQXBwbHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUZXh0SXRlbXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eS5vYmplY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkudXBkYXRlVmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkuZ2V0VmFsdWVUZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLnNlbGVjdGVkT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5nZXRQcm9wZXJ0eUVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuY2hhbmdlQWN0aXZlUHJvcGVydHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLk9iamVjdENoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLnVwZGF0ZVByb3BlcnRpZXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLmNhblNob3dQcm9wZXJ0eSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IudXBkYXRlUHJvcGVydGllc09iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5zdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3Iuc2V0U2VsZWN0ZWRQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLmFkZE5ld1BhZ2VDbGljayIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5yZW1vdmVQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLmNoYW5nZU5hbWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3IuZ2V0SW5kZXhCeVBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3IudXBkYXRlUGFnZXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3IubW92ZURyYWdnaW5nUGFnZVRvIiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5IiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5LmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5wcm9jZXNzIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIudXBkYXRlSnNvblBvc2l0aW9ucyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmNyZWF0ZVN1cnZleU9iamVjdHMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmdldFBvc3Rpb25CeUNoYXJ0QXQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5nZXRBdEFycmF5IiwiU3VydmV5RWRpdG9yLlN1cnZleUVtYmVkaW5nV2luZG93IiwiU3VydmV5RWRpdG9yLlN1cnZleUVtYmVkaW5nV2luZG93LmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUVtYmVkaW5nV2luZG93Lmpzb24iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RW1iZWRpbmdXaW5kb3cuc2hvdyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFbWJlZGluZ1dpbmRvdy5zZXRIZWFkVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFbWJlZGluZ1dpbmRvdy5jcmVhdGVFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RW1iZWRpbmdXaW5kb3cuZ2V0SmF2YVRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RW1iZWRpbmdXaW5kb3cuZ2V0SnNvblRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYnMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYnMuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYnMuc3VydmV5IiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJzLm9iaiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJicy5idWlsZFZlcmJzIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJJdGVtLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJJdGVtLnRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJDaGFuZ2VUeXBlSXRlbS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0udGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0uY2hhbmdlVHlwZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiQ2hhbmdlUGFnZUl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbS50ZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbS5jaGFuZ2VQYWdlIiwidGVtcGxhdGVFZGl0b3IiLCJ0ZW1wbGF0ZUVkaXRvci5rbyIsInRlbXBsYXRlX3BhZ2UiLCJ0ZW1wbGF0ZV9xdWVzdGlvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnJlbmRlciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IubG9hZFN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IudGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2F2ZVN1cnZleUZ1bmMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnNldFRleHRWYWx1ZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuYWRkUGFnZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IubW92ZVBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmFkZFBhZ2VUb1VJIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5vblF1ZXN0aW9uQWRkZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm9uUXVlc3Rpb25SZW1vdmVkIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zaG93RGVzaWduZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnNob3dKc29uRWRpdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5nZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zZWxlY3RlZE9iamVjdENoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmFwcGx5QmluZGluZyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuaW5pdEpzb25FZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmluaXRTdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm9uSnNvbkVkaXRvckNoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnByb2Nlc3NKc29uIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5kb0RyYWdnaW5nUXVlc3Rpb24iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmRvQ2xpY2tRdWVzdGlvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZGVsZXRlQ3VycmVudE9iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZGVsZXRlT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zaG93TGl2ZVN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2hvd1N1cnZleUVtYmVkaW5nIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5nZXRTdXJ2ZXlKU09OIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5jcmVhdGVBbm5vdGF0aW9ucyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5wYXJzZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5wYXJzZS53YWxrIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmVycm9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041Lm5leHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUucGVlayIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jaGFydEF0IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlkZW50aWZpZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUubnVtYmVyIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnN0cmluZyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5pbmxpbmVDb21tZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmJsb2NrQ29tbWVudCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jb21tZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LndoaXRlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LndvcmQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuYXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUub2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnN0cmluZ2lmeSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5nZXRJbmRlbnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzV29yZENoYXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNXb3JkU3RhcnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNXb3JkIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzQXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNEYXRlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzTmFOIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmNoZWNrRm9yQ2lyY3VsYXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUubWFrZUluZGVudCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5lc2NhcGVTdHJpbmciLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaW50ZXJuYWxTdHJpbmdpZnkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0SXRlbSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RJdGVtLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmFkZFBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5hZGRRdWVzdGlvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLnJlbW92ZU9iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLm5hbWVDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuYWRkSXRlbSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLnJlYnVpbGQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5jcmVhdGVQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuY3JlYXRlUXVlc3Rpb24iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5jcmVhdGVJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuZ2V0SXRlbUluZGV4IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuZ2V0VGV4dCJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxZQUFZLENBc0hsQjtBQXRIRCxXQUFPLFlBQVksRUFBQyxDQUFDO0lBQ2pCQTtRQUtJQyx3QkFBbUJBLElBQW9CQTtZQUFwQkMsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBZ0JBO1FBQ3ZDQSxDQUFDQTtRQUNERCxzQkFBV0Esa0NBQU1BO2lCQUFqQkEsY0FBcUNFLE1BQU1BLENBQWdCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTs7O1dBQUFGO1FBQ2hFQSw2Q0FBb0JBLEdBQTNCQSxVQUE0QkEsS0FBZ0JBLEVBQUVBLFlBQW9CQSxFQUFFQSxZQUFvQkE7WUFDcEZHLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLEVBQUVBLGNBQWNBLENBQUNBLFNBQVNBLEdBQUdBLGVBQWVBLEdBQUdBLFlBQVlBLEdBQUdBLGdCQUFnQkEsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDckhBLENBQUNBO1FBQ01ILDBDQUFpQkEsR0FBeEJBLFVBQXlCQSxLQUFnQkEsRUFBRUEsWUFBb0JBO1lBQzNESSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFFQSxjQUFjQSxDQUFDQSxTQUFTQSxHQUFHQSxlQUFlQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUNuRkEsQ0FBQ0E7UUFDTUoseUNBQWdCQSxHQUF2QkEsVUFBd0JBLEtBQWdCQTtZQUNwQ0ssRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ3pCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFP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QUNoQ1ksSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUN2QkEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDcERBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzVCQSxJQUFJQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNoQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ3BDQSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDL0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzlCQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFDT1osNkJBQUlBLEdBQVpBLFVBQWFBLE9BQW9CQTtZQUM3QmEsSUFBSUEsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFZkEsT0FBT0EsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0JBQ2JBLE1BQU1BLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO2dCQUN0RUEsT0FBT0EsR0FBZ0JB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LEVBQUVBLENBQUNBO29CQUNaQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDZEEsQ0FBQ0E7Z0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO29CQUMxQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUVEQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsS0FBS0EsRUFBRUE7b0JBQ0hBLE9BQU9BLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO3dCQUN0Q0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtvQkFDaEJBLENBQUNBO29CQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbEJBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBO3dCQUNkQSxPQUFPQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTs0QkFDckRBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO3dCQUN0QkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO3dCQUNsQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7d0JBQ1pBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBOzRCQUNyQ0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7NEJBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTt3QkFDaEJBLENBQUNBO3dCQUNEQSxPQUFPQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTs0QkFDdENBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBOzRCQUNsQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7d0JBQ2hCQSxDQUFDQTtvQkFDTEEsQ0FBQ0E7b0JBQ0RBLEtBQUtBLENBQUNBO2dCQUNWQSxLQUFLQSxFQUFFQTtvQkFDSEEsT0FBT0EsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7d0JBQzlHQSxNQUFNQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQTt3QkFDbEJBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO29CQUNoQkEsQ0FBQ0E7b0JBQ0RBLEtBQUtBLENBQUNBO1lBQ2RBLENBQUNBO1lBRURBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNmQSxNQUFNQSxHQUFHQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNyQkEsQ0FBQ0E7WUFBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ0pBLE1BQU1BLEdBQUdBLENBQUNBLE1BQU1BLENBQUNBO1lBQ3JCQSxDQUFDQTtZQUVEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcEJBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBO1lBQzdCQSxDQUFDQTtZQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDSkEsTUFBTUEsQ0FBQ0EsTUFBTUEsQ0FBQ0E7WUFDbEJBLENBQUNBO1FBQ0xBLENBQUNBO1FBQ09ULDRCQUFNQSxHQUFkQTtZQUVJVSx3QkFBd0JBO1lBRXhCQSxJQUFJQSxHQUFHQSxFQUNIQSxDQUFDQSxFQUNEQSxNQUFNQSxHQUFHQSxFQUFFQSxFQUNYQSxLQUFLQSxFQUNMQSxLQUFLQSxDQUFDQTtZQUVWQSxBQUVBQSw0RUFGNEVBO1lBRTVFQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDckNBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO2dCQUNoQkEsT0FBT0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDcEJBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO3dCQUNaQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtvQkFDbEJBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDMUJBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLENBQUNBO3dCQUNaQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTs0QkFDbEJBLEtBQUtBLEdBQUdBLENBQUNBLENBQUNBOzRCQUNWQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQTtnQ0FDeEJBLEdBQUdBLEdBQUdBLFFBQVFBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEVBQUVBLEVBQUVBLENBQUNBLENBQUNBO2dDQUNoQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0NBQ2pCQSxLQUFLQSxDQUFDQTtnQ0FDVkEsQ0FBQ0E7Z0NBQ0RBLEtBQUtBLEdBQUdBLEtBQUtBLEdBQUdBLEVBQUVBLEdBQUdBLEdBQUdBLENBQUNBOzRCQUM3QkEsQ0FBQ0E7NEJBQ0RBLE1BQU1BLElBQUlBLE1BQU1BLENBQUNBLFlBQVlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO3dCQUN6Q0EsQ0FBQ0E7d0JBQUNBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLElBQUlBLENBQUNBLENBQUNBLENBQUNBOzRCQUMxQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsS0FBS0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQ3ZCQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTs0QkFDaEJBLENBQUNBO3dCQUNMQSxDQUFDQTt3QkFBQ0EsSUFB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QUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDaEJBLEtBQUtBLEdBQUdBO29CQUNKQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBO2dCQUNwQkEsS0FBS0EsR0FBR0E7b0JBQ0pBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBO1lBQ25CQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxjQUFjQSxHQUFHQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxHQUFHQSxDQUFDQSxDQUFDQTtRQUMvQ0EsQ0FBQ0E7UUFD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QUNBLENBQUNBLENBQUNBO3dCQUNoQ0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTt3QkFDaENBLE1BQU1BLEdBQUdBLEdBQUdBLENBQUNBO3dCQUNiQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxDQUFDQTt3QkFFN0JBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBOzRCQUN2Q0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTs0QkFDakRBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBOzRCQUNoRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsSUFBSUEsSUFBSUEsT0FBT0EsR0FBR0EsS0FBS0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzdDQSxNQUFNQSxJQUFJQSxNQUFNQSxDQUFDQTs0QkFDckJBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQ0FDSkEsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0E7NEJBQ2xCQSxDQUFDQTs0QkFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzFCQSxNQUFNQSxJQUFJQSxHQUFHQSxDQUFDQTs0QkFDbEJBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDeEJB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SVMsSUFBSUEsSUFBSUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDckJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUN0QkEsTUFBTUEsQ0FBQ0E7WUFDWEEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbERBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNoREEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDakNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUM3Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3REQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUNyQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7UUFDakNBLENBQUNBO1FBQ09ULGtDQUFVQSxHQUFsQkEsVUFBbUJBLElBQWlCQTtZQUNoQ1UsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDckRBLENBQUNBO1FBQ09WLHNDQUFjQSxHQUF0QkEsVUFBdUJBLFFBQXlCQTtZQUM1Q1csTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsUUFBUUEsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7UUFDN0RBLENBQUNBO1FBQ09YLGtDQUFVQSxHQUFsQkEsVUFBbUJBLEtBQWtCQSxFQUFFQSxJQUFZQTtZQUMvQ1ksSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsZ0JBQWdCQSxFQUFFQSxDQUFDQTtZQUNsQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7WUFDbkJBLElBQUlBLENBQUNBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ2hDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFDT1osb0NBQVlBLEdBQXBCQSxVQUFxQkEsS0FBa0JBO1lBQ25DYSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxTQUFTQSxFQUFFQSxDQUFDQTtZQUM1QkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ25DQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxJQUFJQSxLQUFLQSxDQUFDQTtvQkFBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDekNBLENBQUNBO1lBQ0RBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1FBQ2RBLENBQUNBO1FBQ09iLCtCQUFPQSxHQUFmQSxVQUFnQkEsR0FBZ0JBO1lBQzVCYyxJQUFJQSxNQUFNQSxHQUFHQSxhQUFhQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUNsQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EseUJBQVlBLENBQUNBLGFBQWFBLENBQUNBLEdBQUdBLENBQUNBLElBQUlBLG9CQUFPQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDbERBLE1BQU1BLElBQUlBLGFBQWFBLENBQUNBLE1BQU1BLENBQUNBO1lBQ25DQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSx5QkFBWUEsQ0FBQ0EsYUFBYUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7UUFDcERBLENBQUNBO1FBaEhhZCxvQkFBTUEsR0FBV0EsS0FBS0EsQ0FBQ0E7UUFpSHpDQSxvQkFBQ0E7SUFBREEsQ0FsSEFqTSxBQWtIQ2lNLElBQUFqTTtJQWxIWUEsMEJBQWFBLGdCQWtIekJBLENBQUFBO0FBQ0xBLENBQUNBLEVBMUhNLFlBQVksS0FBWixZQUFZLFFBMEhsQiIsImZpbGUiOiJzdXJ2ZXllZGl0b3IuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBjbGFzcyBEcmFnRHJvcEhlbHBlciB7XHJcbiAgICAgICAgc3RhdGljIGRhdGFTdGFydDogc3RyaW5nID0gXCJzdXJ2ZXlqcyxcIjtcclxuICAgICAgICBzdGF0aWMgZHJhZ0RhdGE6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgc3RhdGljIHByZXZFdmVudCA9IHsgcXVlc3Rpb246IG51bGwsIHg6IC0xLCB5OiAtMSB9O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgZGF0YTogU3VydmV5LklTdXJ2ZXkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiA8U3VydmV5LlN1cnZleT50aGlzLmRhdGE7IH1cclxuICAgICAgICBwdWJsaWMgc3RhcnREcmFnTmV3UXVlc3Rpb24oZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb25UeXBlOiBzdHJpbmcsIHF1ZXN0aW9uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShldmVudCwgRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0ICsgXCJxdWVzdGlvbnR5cGU6XCIgKyBxdWVzdGlvblR5cGUgKyBcIixxdWVzdGlvbm5hbWU6XCIgKyBxdWVzdGlvbk5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhcnREcmFnUXVlc3Rpb24oZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb25OYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXREYXRhKGV2ZW50LCBEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQgKyBcInF1ZXN0aW9ubmFtZTpcIiArIHF1ZXN0aW9uTmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBpc1N1cnZleURyYWdnaW5nKGV2ZW50OiBEcmFnRXZlbnQpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCFldmVudCkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YShldmVudCk7XHJcbiAgICAgICAgICAgIHJldHVybiBkYXRhICYmIGRhdGEuaW5kZXhPZihEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQpID09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBkb0RyYWdEcm9wT3ZlcihldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gdGhpcy5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgICAgIGlmICghcXVlc3Rpb24gfHwgIXRoaXMuaXNTdXJ2ZXlEcmFnZ2luZyhldmVudCkgfHwgdGhpcy5pc1NhbWVQbGFjZShldmVudCwgcXVlc3Rpb24pKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UXVlc3Rpb25JbmRleChldmVudCwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZVtcImtvRHJhZ2dpbmdcIl0oaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZG9Ecm9wKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24gPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5zdG9wUHJvcGFnYXRpb24pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNTdXJ2ZXlEcmFnZ2luZyhldmVudCkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKC0xKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRRdWVzdGlvbkluZGV4KGV2ZW50LCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHZhciBkYXRhSW5mbyA9IHRoaXMuZ2V0RGF0YUluZm8oZXZlbnQpO1xyXG4gICAgICAgICAgICB0aGlzLmNsZWFyRGF0YSgpO1xyXG4gICAgICAgICAgICBpZiAoIWRhdGFJbmZvKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciB0YXJnZXRRdWVzdGlvbiA9IDxTdXJ2ZXkuUXVlc3Rpb24+dGhpcy5zdXJ2ZXkuZ2V0UXVlc3Rpb25CeU5hbWUoZGF0YUluZm9bXCJxdWVzdGlvbm5hbWVcIl0pO1xyXG4gICAgICAgICAgICBpZiAoIXRhcmdldFF1ZXN0aW9uICYmIGRhdGFJbmZvW1wicXVlc3Rpb250eXBlXCJdKSB7XHJcbiAgICAgICAgICAgICAgICB0YXJnZXRRdWVzdGlvbiA9IFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24oZGF0YUluZm9bXCJxdWVzdGlvbnR5cGVcIl0sIGRhdGFJbmZvW1wicXVlc3Rpb25uYW1lXCJdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRhcmdldFF1ZXN0aW9uKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMubW92ZVF1ZXN0aW9uVG8odGFyZ2V0UXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRRdWVzdGlvbkluZGV4KGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZTtcclxuICAgICAgICAgICAgaWYgKCFxdWVzdGlvbikgcmV0dXJuIHBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGV2ZW50ID0gdGhpcy5nZXRFdmVudChldmVudCk7XHJcbiAgICAgICAgICAgIHZhciBoZWlnaHQgPSA8bnVtYmVyPmV2ZW50LmN1cnJlbnRUYXJnZXRbXCJjbGllbnRIZWlnaHRcIl07XHJcbiAgICAgICAgICAgIHZhciB5ID0gZXZlbnQub2Zmc2V0WTtcclxuICAgICAgICAgICAgaWYgKGV2ZW50Lmhhc093blByb3BlcnR5KCdsYXllclgnKSkge1xyXG4gICAgICAgICAgICAgICAgeSA9IGV2ZW50LmxheWVyWSAtIDxudW1iZXI+ZXZlbnQuY3VycmVudFRhcmdldFtcIm9mZnNldFRvcFwiXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoeSA+IGhlaWdodCAvIDIpIGluZGV4KytcclxuICAgICAgICAgICAgcmV0dXJuIGluZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzU2FtZVBsYWNlKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIHByZXYgPSBEcmFnRHJvcEhlbHBlci5wcmV2RXZlbnQ7XHJcbiAgICAgICAgICAgIGlmIChwcmV2LnF1ZXN0aW9uICE9IHF1ZXN0aW9uIHx8IE1hdGguYWJzKGV2ZW50LmNsaWVudFggLSBwcmV2LngpID4gNSB8fCBNYXRoLmFicyhldmVudC5jbGllbnRZIC0gcHJldi55KSA+IDUpIHtcclxuICAgICAgICAgICAgICAgIHByZXYucXVlc3Rpb24gPSBxdWVzdGlvbjtcclxuICAgICAgICAgICAgICAgIHByZXYueCA9IGV2ZW50LmNsaWVudFg7XHJcbiAgICAgICAgICAgICAgICBwcmV2LnkgPSBldmVudC5jbGllbnRZO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEV2ZW50KGV2ZW50OiBEcmFnRXZlbnQpOiBEcmFnRXZlbnQge1xyXG4gICAgICAgICAgICByZXR1cm4gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdID8gZXZlbnRbXCJvcmlnaW5hbEV2ZW50XCJdIDogZXZlbnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbW92ZVF1ZXN0aW9uVG8odGFyZ2V0UXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbiwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGFyZ2V0UXVlc3Rpb24gPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgaWYgKHBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHBhZ2UucmVtb3ZlUXVlc3Rpb24odGFyZ2V0UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLmFkZFF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0RGF0YUluZm8oZXZlbnQ6IERyYWdFdmVudCk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gdGhpcy5nZXREYXRhKGV2ZW50KTtcclxuICAgICAgICAgICAgaWYgKCFkYXRhKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgZGF0YSA9IGRhdGEuc3Vic3RyKERyYWdEcm9wSGVscGVyLmRhdGFTdGFydC5sZW5ndGgpO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBkYXRhLnNwbGl0KCcsJyk7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBhcnJheVtpXS5zcGxpdCgnOicpO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W2l0ZW1bMF1dID0gaXRlbVsxXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFkoZWxlbWVudDogSFRNTEVsZW1lbnQpOiBudW1iZXIge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gMDtcclxuXHJcbiAgICAgICAgICAgIHdoaWxlIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gKGVsZW1lbnQub2Zmc2V0VG9wIC0gZWxlbWVudC5zY3JvbGxUb3AgKyBlbGVtZW50LmNsaWVudFRvcCk7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gPEhUTUxFbGVtZW50PmVsZW1lbnQub2Zmc2V0UGFyZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0RGF0YShldmVudDogRHJhZ0V2ZW50LCBkYXRhOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmRhdGFUcmFuc2Zlcikge1xyXG4gICAgICAgICAgICAgICAgZXZlbnQuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJUZXh0XCIsIGRhdGEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIERyYWdEcm9wSGVscGVyLmRyYWdEYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXREYXRhKGV2ZW50OiBEcmFnRXZlbnQpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuZGF0YVRyYW5zZmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZGF0YSA9IGV2ZW50LmRhdGFUcmFuc2Zlci5nZXREYXRhKFwiVGV4dFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZGF0YSA/IGRhdGEgOiBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjbGVhckRhdGEoKSB7XHJcbiAgICAgICAgICAgIERyYWdEcm9wSGVscGVyLmRyYWdEYXRhID0gXCJcIjtcclxuICAgICAgICAgICAgdmFyIHByZXYgPSBEcmFnRHJvcEhlbHBlci5wcmV2RXZlbnQ7XHJcbiAgICAgICAgICAgIHByZXYucXVlc3Rpb24gPSBudWxsO1xyXG4gICAgICAgICAgICBwcmV2LnggPSAtMTtcclxuICAgICAgICAgICAgcHJldi55ID0gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgZGVjbGFyZSB0eXBlIFN1cnZleVByb3BlcnR5VmFsdWVDaGFuZ2VkQ2FsbGJhY2sgPSAobmV3VmFsdWU6IGFueSkgPT4gdm9pZDtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eUFycmF5IHtcclxuICAgICAgICBwdWJsaWMgb2JqZWN0OiBhbnkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyB0aXRsZTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvblZhbHVlQ2hhbmdlZDogU3VydmV5UHJvcGVydHlWYWx1ZUNoYW5nZWRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHsgfVxyXG4gICAgfVxyXG59XHJcbiIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eUFycmF5cy50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzIGV4dGVuZHMgU3VydmV5UHJvcGVydHlBcnJheXtcclxuICAgICAgICBwcml2YXRlIHZhbHVlXzogQXJyYXk8YW55PjtcclxuICAgICAgICBwdWJsaWMga29JdGVtczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb05ld1ZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvTmV3VGV4dDogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BcHBseUNsaWNrOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvblZhbHVlQ2hhbmdlZDogU3VydmV5UHJvcGVydHlWYWx1ZUNoYW5nZWRDYWxsYmFjaykgIHtcclxuICAgICAgICAgICAgc3VwZXIob25WYWx1ZUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb05ld1ZhbHVlID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvTmV3VGV4dCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBzZWxmLm9uQXBwbHlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5BcHBseSgpOyB9O1xyXG4gICAgICAgICAgICBzZWxmLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoaXRlbSkgeyBzZWxmLmtvSXRlbXMucmVtb3ZlKGl0ZW0pOyB9O1xyXG4gICAgICAgICAgICBzZWxmLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQWRkSXRlbSgpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnZhbHVlXzsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IHZhbHVlW2ldO1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCh7IGtvVmFsdWU6IGtvLm9ic2VydmFibGUoaXRlbS52YWx1ZSksIGtvVGV4dDoga28ub2JzZXJ2YWJsZShpdGVtLnRleHQpIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBZGRJdGVtKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMucHVzaCh7IGtvVmFsdWU6IGtvLm9ic2VydmFibGUodGhpcy5rb05ld1ZhbHVlKCkpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUodGhpcy5rb05ld1RleHQoKSkgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29OZXdWYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgdGhpcy5rb05ld1RleHQobnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBcHBseSgpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtvSXRlbXMoKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmtvSXRlbXMoKVtpXTtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVfLnB1c2goeyB2YWx1ZTogaXRlbS5rb1ZhbHVlKCksIHRleHQ6IGl0ZW0ua29UZXh0KCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWx1ZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy52YWx1ZV8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VHJpZ2dlcnMgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUFycmF5IHtcclxuICAgICAgICBwcml2YXRlIHZhbHVlXzogQXJyYXk8YW55PjtcclxuICAgICAgICBwdWJsaWMga29JdGVtczogYW55O1xyXG4gICAgICAgIGtvUXVlc3Rpb25zOiBhbnk7IGtvUGFnZXM6IGFueTtcclxuICAgICAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BcHBseUNsaWNrOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvblZhbHVlQ2hhbmdlZDogU3VydmV5UHJvcGVydHlWYWx1ZUNoYW5nZWRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICBzdXBlcihvblZhbHVlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMua29QYWdlcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvUXVlc3Rpb25zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHRoaXMub25EZWxldGVDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShzZWxmLmtvU2VsZWN0ZWQoKSk7IH1cclxuICAgICAgICAgICAgdGhpcy5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmFkZEl0ZW0oKTsgfVxyXG4gICAgICAgICAgICB0aGlzLm9uQXBwbHlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hcHBseSgpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnZhbHVlXzsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vYmplY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29QYWdlcyh0aGlzLmdldE5hbWVzKCg8U3VydmV5LlN1cnZleT50aGlzLm9iamVjdCkucGFnZXMpKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29RdWVzdGlvbnModGhpcy5nZXROYW1lcygoPFN1cnZleS5TdXJ2ZXk+dGhpcy5vYmplY3QpLmdldEFsbFF1ZXN0aW9ucygpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyKDxTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGU+dmFsdWVbaV0sIHRoaXMua29QYWdlcywgdGhpcy5rb1F1ZXN0aW9ucykpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZChhcnJheS5sZW5ndGggPiAwID8gYXJyYXlbMF0gOiBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcHBseSgpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5rb0l0ZW1zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVfLnB1c2goYXJyYXlbaV0uY3JlYXRlVHJpZ2dlcigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vblZhbHVlQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlXyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXROYW1lcyhpdGVtczogQXJyYXk8YW55Pik6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgbmFtZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtW1wibmFtZVwiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG5hbWVzLnB1c2goaXRlbVtcIm5hbWVcIl0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRJdGVtKCkge1xyXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIobmV3IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSgpLCB0aGlzLmtvUGFnZXMsIHRoaXMua29RdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMucHVzaCh0cmlnZ2VyKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKHRyaWdnZXIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUcmlnZ2VyIHtcclxuICAgICAgICBhdmFpbGFibGVPcGVyYXRvcnMgPSBbXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJlbXB0eVwiLCB0ZXh0OiBcImlzIGVtcHR5XCIgfSwgeyBuYW1lOiBcIm5vdGVtcHR5XCIsIHRleHQ6IFwiaXMgbm90IGVtcHR5XCIgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImVxdWFsXCIsIHRleHQ6IFwiZXF1YWxzXCIgfSwgeyBuYW1lOiBcIm5vdGVxdWFsXCIsIHRleHQ6IFwibm90IGVxdWFsc1wiIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJjb250YWluc1wiLCB0ZXh0OiBcImNvbnRhaW5zXCIgfSwgeyBuYW1lOiBcIm5vdGNvbnRhaW5zXCIsIHRleHQ6IFwibm90IGNvbnRhaW5zXCIgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImdyZWF0ZXJcIiwgdGV4dDogXCJncmVhdGVyXCIgfSwgeyBuYW1lOiBcImxlc3NcIiwgdGV4dDogXCJsZXNzXCIgfSxcclxuICAgICAgICAgICAgeyBuYW1lOiBcImdyZWF0ZXJvcmVxdWFsXCIsIHRleHQ6IFwiZ3JlYXRlciBvciBlcXVhbHNcIiB9LCB7IG5hbWU6IFwibGVzc29yZXF1YWxcIiwgdGV4dDogXCJMZXNzIG9yIEVxdWFsc1wiIH1dXHJcbiAgICAgICAga29OYW1lOiBhbnk7IGtvT3BlcmF0b3I6IGFueTsga29WYWx1ZTogYW55O1xyXG4gICAgICAgIGtvVGV4dDogYW55OyBrb0lzVmFsaWQ6IGFueTsga29SZXF1aXJlVmFsdWU6IGFueTtcclxuICAgICAgICBwdWJsaWMgcGFnZXM6IFN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHM7XHJcbiAgICAgICAgcHVibGljIHF1ZXN0aW9uczogU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cztcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IodHJpZ2dlcjogU3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlLCBrb1BhZ2VzOiBhbnksIGtvUXVlc3Rpb25zOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb05hbWUgPSBrby5vYnNlcnZhYmxlKHRyaWdnZXIubmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29PcGVyYXRvciA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5vcGVyYXRvcik7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci52YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMgPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cyhcIk1ha2UgcGFnZXMgdmlzaWJsZTpcIiwga29QYWdlcygpLCB0cmlnZ2VyLnBhZ2VzKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMgPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cyhcIk1ha2UgcXVlc3Rpb25zIHZpc2libGU6XCIsIGtvUXVlc3Rpb25zKCksIHRyaWdnZXIucXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmtvUmVxdWlyZVZhbHVlID0ga28uY29tcHV0ZWQoKCkgPT4geyByZXR1cm4gc2VsZi5rb09wZXJhdG9yKCkgIT0gXCJlbXB0eVwiICYmIHNlbGYua29PcGVyYXRvcigpICE9IFwibm90ZW1wdHlcIjsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc1ZhbGlkID0ga28uY29tcHV0ZWQoKCkgPT4geyBpZiAoc2VsZi5rb05hbWUoKSAmJiAoIXNlbGYua29SZXF1aXJlVmFsdWUoKSB8fCBzZWxmLmtvVmFsdWUoKSkpIHJldHVybiB0cnVlOyByZXR1cm4gZmFsc2U7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvVGV4dCA9IGtvLmNvbXB1dGVkKCgpID0+IHsgc2VsZi5rb05hbWUoKTsgc2VsZi5rb09wZXJhdG9yKCk7IHNlbGYua29WYWx1ZSgpOyByZXR1cm4gc2VsZi5nZXRUZXh0KCk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlVHJpZ2dlcigpOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUge1xyXG4gICAgICAgICAgICB2YXIgdHJpZ2dlciA9IG5ldyBTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUoKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5uYW1lID0gdGhpcy5rb05hbWUoKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5vcGVyYXRvciA9IHRoaXMua29PcGVyYXRvcigpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnZhbHVlID0gdGhpcy5rb1ZhbHVlKCk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIucGFnZXMgPSB0aGlzLnBhZ2VzLmtvQ2hvb3NlbigpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLnF1ZXN0aW9ucyA9IHRoaXMucXVlc3Rpb25zLmtvQ2hvb3NlbigpO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJpZ2dlcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5rb0lzVmFsaWQoKSkgcmV0dXJuIFwiVGhlIHRyaWdnZXIgaXMgbm90IHNldFwiO1xyXG4gICAgICAgICAgICByZXR1cm4gXCJSdW4gaWYgJ1wiICsgdGhpcy5rb05hbWUoKSArIFwiJyBcIiArIHRoaXMuZ2V0T3BlcmF0b3JUZXh0KCkgKyB0aGlzLmdldFZhbHVlVGV4dCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldE9wZXJhdG9yVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgb3AgPSB0aGlzLmtvT3BlcmF0b3IoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmF2YWlsYWJsZU9wZXJhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuYXZhaWxhYmxlT3BlcmF0b3JzW2ldLm5hbWUgPT0gb3ApIHJldHVybiB0aGlzLmF2YWlsYWJsZU9wZXJhdG9yc1tpXS50ZXh0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBvcDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRWYWx1ZVRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmtvUmVxdWlyZVZhbHVlKCkpIHJldHVybiBcIlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gXCIgXCIgKyB0aGlzLmtvVmFsdWUoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cyB7XHJcbiAgICAgICAga29PYmplY3RzOiBhbnk7XHJcbiAgICAgICAga29DaG9vc2VuOiBhbnk7XHJcbiAgICAgICAga29TZWxlY3RlZDogYW55O1xyXG4gICAgICAgIGtvQ2hvb3NlblNlbGVjdGVkOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BZGRDbGljazogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0aXRsZTogc3RyaW5nLCBhbGxPYmplY3RzOiBBcnJheTxzdHJpbmc+LCBjaG9vc2VuT2JqZWN0czogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgICAgICAgICB0aGlzLmtvQ2hvb3NlbiA9IGtvLm9ic2VydmFibGVBcnJheShjaG9vc2VuT2JqZWN0cyk7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFsbE9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYWxsT2JqZWN0c1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChjaG9vc2VuT2JqZWN0cy5pbmRleE9mKGl0ZW0pIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29DaG9vc2VuU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmRlbGV0ZUl0ZW0oKTsgfVxyXG4gICAgICAgICAgICB0aGlzLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuYWRkSXRlbSgpOyB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZGVsZXRlSXRlbSgpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VJdGVtcyh0aGlzLmtvQ2hvb3NlblNlbGVjdGVkKCksIHRoaXMua29DaG9vc2VuLCB0aGlzLmtvT2JqZWN0cyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkSXRlbSgpIHtcclxuICAgICAgICAgICAgdGhpcy5jaGFuZ2VJdGVtcyh0aGlzLmtvU2VsZWN0ZWQoKSwgdGhpcy5rb09iamVjdHMsIHRoaXMua29DaG9vc2VuKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGFuZ2VJdGVtcyhpdGVtOiBzdHJpbmcsIHJlbW92ZWRGcm9tOiBhbnksIGFkZFRvOiBhbnkpIHtcclxuICAgICAgICAgICAgcmVtb3ZlZEZyb20ucmVtb3ZlKGl0ZW0pO1xyXG4gICAgICAgICAgICBhZGRUby5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICByZW1vdmVkRnJvbS5zb3J0KCk7XHJcbiAgICAgICAgICAgIGFkZFRvLnNvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzIGV4dGVuZHMgU3VydmV5UHJvcGVydHlBcnJheSB7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZV86IEFycmF5PGFueT47XHJcbiAgICAgICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdEVkaXRvcjogU3VydmV5T2JqZWN0RWRpdG9yO1xyXG4gICAgICAgIHB1YmxpYyBrb0l0ZW1zOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvU2VsZWN0ZWQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgYXZhaWxhYmxlVmFsaWRhdG9yczogQXJyYXk8c3RyaW5nPiA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBvbkRlbGV0ZUNsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQWRkQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BcHBseUNsaWNrOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWxpZGF0b3JzQ2xhc3NlczogQXJyYXk8U3VydmV5Lkpzb25NZXRhZGF0YUNsYXNzPiA9IFtdO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IFN1cnZleVByb3BlcnR5VmFsdWVDaGFuZ2VkQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgc3VwZXIob25WYWx1ZUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3IgPSBuZXcgU3VydmV5T2JqZWN0RWRpdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkKG9wdGlvbnMucHJvcGVydHksIG9wdGlvbnMub2JqZWN0LCBvcHRpb25zLm5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNlbGVjdGVkT2JqZWN0RWRpdG9yLnNlbGVjdGVkT2JqZWN0ID0gbmV3VmFsdWUgIT0gbnVsbCA/IG5ld1ZhbHVlLnZhbGlkYXRvciA6IG51bGw7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnZhbGlkYXRvcnNDbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic3VydmV5dmFsaWRhdG9yXCIsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmF2YWlsYWJsZVZhbGlkYXRvcnMgPSB0aGlzLmdldEF2YWlsYWJsZVZhbGlkYXRvcnMoKTtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLmtvSXRlbXMucmVtb3ZlKHNlbGYua29TZWxlY3RlZCgpKTsgfVxyXG4gICAgICAgICAgICB0aGlzLm9uQWRkQ2xpY2sgPSBmdW5jdGlvbiAodmFsaWRhdG9yVHlwZSkgeyBzZWxmLmFkZEl0ZW0odmFsaWRhdG9yVHlwZSk7IH1cclxuICAgICAgICAgICAgdGhpcy5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwbHkoKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgdmFyIGpzb25PYmogPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZhbGlkYXRvciA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKHZhbHVlW2ldLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgICAgICBqc29uT2JqLnRvT2JqZWN0KHZhbHVlW2ldLCB2YWxpZGF0b3IpO1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtKHZhbGlkYXRvcikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZChhcnJheS5sZW5ndGggPiAwID8gYXJyYXlbMF0gOiBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcHBseSgpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gdGhpcy5rb0l0ZW1zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVfLnB1c2goYXJyYXlbaV0udmFsaWRhdG9yKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5vblZhbHVlQ2hhbmdlZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlXyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRJdGVtKHZhbGlkYXRvclR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsaWRhdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbShTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyh2YWxpZGF0b3JUeXBlKSk7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcy5wdXNoKG5ld1ZhbGlkYXRvcik7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZChuZXdWYWxpZGF0b3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEF2YWlsYWJsZVZhbGlkYXRvcnMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnZhbGlkYXRvcnNDbGFzc2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnZhbGlkYXRvcnNDbGFzc2VzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb2JqOiBhbnksIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMua29TZWxlY3RlZCgpID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKCkudmFsaWRhdG9yW3Byb3BlcnR5Lm5hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0ge1xyXG4gICAgICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHZhbGlkYXRvcjogU3VydmV5LlN1cnZleVZhbGlkYXRvcikge1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB2YWxpZGF0b3IuZ2V0VHlwZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbn0iLCJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBlbnVtIE9ialR5cGUgeyBVbmtub3duLCBTdXJ2ZXksIFBhZ2UsIFF1ZXN0aW9uIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlIZWxwZXIge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0TmV3TmFtZShvYmpzOiBBcnJheTxhbnk+LCBiYXNlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGhhc2ggPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBoYXNoW29ianNbaV0ubmFtZV0gPSB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBudW0gPSAxO1xyXG4gICAgICAgICAgICB3aGlsZSAodHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFoYXNoW2Jhc2VOYW1lICsgbnVtLnRvU3RyaW5nKCldKSBicmVhaztcclxuICAgICAgICAgICAgICAgIG51bSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBiYXNlTmFtZSArIG51bS50b1N0cmluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldE9iamVjdFR5cGUob2JqOiBhbnkpOiBPYmpUeXBlIHtcclxuICAgICAgICAgICAgaWYgKCFvYmogfHwgIW9ialtcImdldFR5cGVcIl0pIHJldHVybiBPYmpUeXBlLlVua25vd247XHJcbiAgICAgICAgICAgIGlmIChvYmouZ2V0VHlwZSgpID09IFwicGFnZVwiKSByZXR1cm4gT2JqVHlwZS5QYWdlO1xyXG4gICAgICAgICAgICBpZiAob2JqLmdldFR5cGUoKSA9PSBcInN1cnZleVwiKSByZXR1cm4gT2JqVHlwZS5TdXJ2ZXk7XHJcbiAgICAgICAgICAgIGlmIChvYmpbXCJrb1ZhbHVlXCJdKSByZXR1cm4gT2JqVHlwZS5RdWVzdGlvbjtcclxuICAgICAgICAgICAgcmV0dXJuIE9ialR5cGUuVW5rbm93bjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXRPYmplY3ROYW1lKG9iajogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKG9ialtcIm5hbWVcIl0pIHJldHVybiBvYmpbXCJuYW1lXCJdO1xyXG4gICAgICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XHJcbiAgICAgICAgICAgIGlmIChvYmpUeXBlICE9IE9ialR5cGUuUGFnZSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0gPFN1cnZleS5TdXJ2ZXk+KDxTdXJ2ZXkuUGFnZT5vYmopLmRhdGE7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IGRhdGEucGFnZXMuaW5kZXhPZig8U3VydmV5LlBhZ2U+b2JqKTtcclxuICAgICAgICAgICAgcmV0dXJuIFwiW1BhZ2UgXCIgKyAoaW5kZXggKyAxKSArIFwiXVwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eUFycmF5cy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlIZWxwZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0UHJvcGVydHlWYWxpZGF0b3JzLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRleHRJdGVtcyBleHRlbmRzIFN1cnZleVByb3BlcnR5QXJyYXkge1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVfOiBBcnJheTxhbnk+O1xyXG4gICAgICAgIHB1YmxpYyBrb0l0ZW1zOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BZGRDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFwcGx5Q2xpY2s6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG9uVmFsdWVDaGFuZ2VkOiBTdXJ2ZXlQcm9wZXJ0eVZhbHVlQ2hhbmdlZENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9uVmFsdWVDaGFuZ2VkKTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQXBwbHkoKTsgfTtcclxuICAgICAgICAgICAgc2VsZi5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShpdGVtKTsgfTtcclxuICAgICAgICAgICAgc2VsZi5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLkFkZEl0ZW0oKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgIHZhciBlZGl0SXRlbSA9IHsga29OYW1lOiBrby5vYnNlcnZhYmxlKGl0ZW0ubmFtZSksIGtvVGl0bGU6IGtvLm9ic2VydmFibGUoaXRlbS50aXRsZSkgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihlZGl0SXRlbSwgaXRlbS52YWxpZGF0b3JzKTtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goZWRpdEl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBZGRJdGVtKCkge1xyXG4gICAgICAgICAgICB2YXIgb2JqcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmtvSXRlbXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgb2Jqcy5wdXNoKHsgbmFtZTogYXJyYXlbaV0ua29OYW1lKCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVkaXRJdGVtID0geyBrb05hbWU6IGtvLm9ic2VydmFibGUoU3VydmV5SGVscGVyLmdldE5ld05hbWUob2JqcywgXCJ0ZXh0XCIpKSwga29UaXRsZToga28ub2JzZXJ2YWJsZSgpIH07XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihlZGl0SXRlbSwgW10pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMucHVzaChlZGl0SXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBcHBseSgpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtvSXRlbXMoKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmtvSXRlbXMoKVtpXTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtVGV4dCA9IG5ldyBTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbShpdGVtLmtvTmFtZSgpLCBpdGVtLmtvVGl0bGUoKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtVGV4dC52YWxpZGF0b3JzID0gaXRlbS52YWxpZGF0b3JzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZV8ucHVzaChpdGVtVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWx1ZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy52YWx1ZV8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihpdGVtOiBhbnksIHZhbGlkYXRvcnM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgaXRlbS52YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5zbGljZSgpO1xyXG4gICAgICAgICAgICB2YXIgb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChuZXdWYWx1ZTogYW55KSB7IGl0ZW0udmFsaWRhdG9ycyA9IG5ld1ZhbHVlOyBpdGVtLmtvVGV4dChcIlsgSXRlbXM6IFwiICsgbmV3VmFsdWUubGVuZ3RoICsgXCIgXVwiKTsgfTtcclxuICAgICAgICAgICAgaXRlbS5hcnJheUVkaXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICBpdGVtLmFycmF5RWRpdG9yLm9iamVjdCA9IGl0ZW07XHJcbiAgICAgICAgICAgIGl0ZW0uYXJyYXlFZGl0b3IudGl0bGUoXCJFZGl0IHByb3BlcnR5ICdWYWxpZGF0b3JzJ1wiKTtcclxuICAgICAgICAgICAgaXRlbS5hcnJheUVkaXRvci52YWx1ZSA9IGl0ZW0udmFsaWRhdG9ycztcclxuICAgICAgICAgICAgaXRlbS5rb1RleHQgPSBrby5vYnNlcnZhYmxlKFwiWyBJdGVtczogXCIgKyB2YWxpZGF0b3JzLmxlbmd0aCArIFwiIF1cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5SXRlbVZhbHVlcy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eVRyaWdnZXJzLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5VmFsaWRhdG9ycy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eVRleHRJdGVtcy50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IChwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHksIG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBwcml2YXRlIG9iamVjdFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlVXBkYXRpbmc6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMga29WYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1RleHQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgYXJyYXlFZGl0b3I6IFN1cnZleVByb3BlcnR5QXJyYXk7XHJcbiAgICAgICAgcHVibGljIGtvSXNEZWZhdWx0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGVkaXRvclR5cGU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgY2hvaWNlczogQXJyYXk8YW55PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvblByb3BlcnR5Q2hhbmdlZDogU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wcm9wZXJ0eS5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yVHlwZSA9IHByb3BlcnR5LnR5cGU7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlcyA9IHByb3BlcnR5LmNob2ljZXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZXMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3JUeXBlID0gXCJkcm9wZG93blwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvciA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBvbkl0ZW1DaGFuZ2VkID0gZnVuY3Rpb24gKG5ld1ZhbHVlOiBhbnkpIHsgc2VsZi5rb1ZhbHVlKG5ld1ZhbHVlKTsgfTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWRpdG9yVHlwZSA9PSBcIml0ZW12YWx1ZXNcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvclR5cGUgPT0gXCJ0cmlnZ2Vyc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5RWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlcnMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvclR5cGUgPT0gXCJ2YWxpZGF0b3JzXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzKChuZXdWYWx1ZTogYW55KSA9PiB7IG9uSXRlbUNoYW5nZWQobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JUeXBlID09IFwidGV4dGl0ZW1zXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlUZXh0SXRlbXMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vYmplY3QgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub2JqZWN0W3NlbGYubmFtZV0gPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChvblByb3BlcnR5Q2hhbmdlZCAhPSBudWxsICYmICFzZWxmLmlzVmFsdWVVcGRhdGluZykgb25Qcm9wZXJ0eUNoYW5nZWQoc2VsZiwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1RleHQgPSBrby5jb21wdXRlZCgoKSA9PiB7IHJldHVybiBzZWxmLmdldFZhbHVlVGV4dChzZWxmLmtvVmFsdWUoKSk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNEZWZhdWx0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5wcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShzZWxmLmtvVmFsdWUoKSk7IH0pOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMub2JqZWN0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9iamVjdCh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JqZWN0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKHRoaXMub2JqZWN0W3RoaXMubmFtZV0pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcnJheUVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvci5vYmplY3QgPSB0aGlzLm9iamVjdDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IudGl0bGUoXCJFZGl0IHByb3BlcnR5ICdcIiArIHRoaXMucHJvcGVydHkubmFtZSArIFwiJ1wiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IudmFsdWUgPSB0aGlzLmtvVmFsdWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiWyBJdGVtczogXCIrIHZhbHVlLmxlbmd0aCArIFwiIF1cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5LnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEVkaXRvciB7XHJcbiAgICAgICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvUHJvcGVydGllczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb0FjdGl2ZVByb3BlcnR5OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvSGFzT2JqZWN0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQ6IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUHJvcGVydGllcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29IYXNPYmplY3QgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRPYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWRPYmplY3QodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE9iamVjdFZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMua29IYXNPYmplY3QodmFsdWUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQcm9wZXJ0eUVkaXRvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmtvUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGFuZ2VBY3RpdmVQcm9wZXJ0eShwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KHByb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIE9iamVjdENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlUHJvcGVydGllcygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkT2JqZWN0IHx8ICF0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzKFtdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eShudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXModGhpcy5zZWxlY3RlZE9iamVjdC5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhLm5hbWUgPT0gYi5uYW1lKSByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIGlmIChhLm5hbWUgPiBiLm5hbWUpIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIG9iamVjdFByb3BlcnRpZXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgcHJvcEV2ZW50ID0gKHByb3BlcnR5OiBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSwgbmV3VmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmZpcmUodGhpcywgeyBwcm9wZXJ0eTogcHJvcGVydHkucHJvcGVydHksIG9iamVjdDogcHJvcGVydHkub2JqZWN0LCBuZXdWYWx1ZTogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhblNob3dQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldKSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydHkgPSBuZXcgU3VydmV5T2JqZWN0UHJvcGVydHkocHJvcGVydGllc1tpXSwgcHJvcEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIG9iamVjdFByb3BlcnRpZXMucHVzaChvYmplY3RQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMob2JqZWN0UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSh0aGlzLmdldFByb3BlcnR5RWRpdG9yKFwibmFtZVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjYW5TaG93UHJvcGVydHkocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSAncXVlc3Rpb25zJyB8fCBuYW1lID09ICdwYWdlcycpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMua29Qcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1tpXS5vYmplY3QgPSB0aGlzLnNlbGVjdGVkT2JqZWN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZGVjbGFyZSB0eXBlIFN1cnZleUFkZE5ld1BhZ2VDYWxsYmFjayA9ICgpID0+IHZvaWQ7XHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB2b2lkO1xyXG4gICAgZGVjbGFyZSB0eXBlIFN1cnZleU1vdmVQYWdlQ2FsbGJhY2sgPSAoaW5kZXhGcm9tOiBudW1iZXIsIGluZGV4VG86IG51bWJlcikgPT4gdm9pZDtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQYWdlc0VkaXRvciB7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICAgICAga29QYWdlczogYW55O1xyXG4gICAgICAgIGtvSXNWYWxpZDogYW55O1xyXG4gICAgICAgIHNlbGVjdFBhZ2VDbGljazogYW55O1xyXG4gICAgICAgIG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgb25TZWxlY3RQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjaztcclxuICAgICAgICBvbk1vdmVQYWdlQ2FsbGJhY2s6IFN1cnZleU1vdmVQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgZHJhZ2dpbmdQYWdlOiBTdXJ2ZXkuUGFnZSA9IG51bGw7XHJcbiAgICAgICAgZHJhZ1N0YXJ0OiBhbnk7IGRyYWdPdmVyOiBhbnk7IGRyYWdFbmQ6IGFueTsgZHJhZ0Ryb3A6IGFueTsgXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2sgPSBudWxsLCBvblNlbGVjdFBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCxcclxuICAgICAgICAgICAgb25Nb3ZlUGFnZUNhbGxiYWNrOiBTdXJ2ZXlNb3ZlUGFnZUNhbGxiYWNrID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5vbkFkZE5ld1BhZ2VDYWxsYmFjayA9IG9uQWRkTmV3UGFnZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0UGFnZUNhbGxiYWNrID0gb25TZWxlY3RQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrID0gb25Nb3ZlUGFnZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0UGFnZUNsaWNrID0gZnVuY3Rpb24ocGFnZUl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uU2VsZWN0UGFnZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vblNlbGVjdFBhZ2VDYWxsYmFjayhwYWdlSXRlbS5wYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlbDogU3VydmV5LlBhZ2UpIHsgc2VsZi5kcmFnZ2luZ1BhZ2UgPSBlbDsgfTtcclxuICAgICAgICAgICAgdGhpcy5kcmFnT3ZlciA9IGZ1bmN0aW9uIChlbDogU3VydmV5LlBhZ2UpIHsgIH07XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0VuZCA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kcmFnZ2luZ1BhZ2UgPSBudWxsOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGVsOiBTdXJ2ZXkuUGFnZSkgeyBzZWxmLm1vdmVEcmFnZ2luZ1BhZ2VUbyhlbCk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzVmFsaWQodGhpcy5zdXJ2ZXlWYWx1ZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0U2VsZWN0ZWRQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlc1tpXS5rb1NlbGVjdGVkKHBhZ2VzW2ldLnBhZ2UgPT0gcGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZE5ld1BhZ2VDbGljaygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4QnlQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1BhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNoYW5nZU5hbWUocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5UGFnZShwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29QYWdlcygpW2luZGV4XS50aXRsZShTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0TmFtZShwYWdlKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldEluZGV4QnlQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2VzID0gdGhpcy5rb1BhZ2VzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwYWdlc1tpXS5wYWdlID09IHBhZ2UpIHJldHVybiBpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAtMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHVwZGF0ZVBhZ2VzKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUGFnZXMoW10pO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIHBhZ2VzLnB1c2goe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBrby5vYnNlcnZhYmxlKFN1cnZleUhlbHBlci5nZXRPYmplY3ROYW1lKHBhZ2UpKSwgcGFnZTogcGFnZSwga29TZWxlY3RlZDoga28ub2JzZXJ2YWJsZShmYWxzZSlcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29QYWdlcyhwYWdlcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbW92ZURyYWdnaW5nUGFnZVRvKHRvUGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgaWYgKHRvUGFnZSA9PSBudWxsIHx8IHRvUGFnZSA9PSB0aGlzLmRyYWdnaW5nUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kcmFnZ2luZ1BhZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdnaW5nUGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMua29QYWdlcygpLmluZGV4T2YodGhpcy5kcmFnZ2luZ1BhZ2UpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXhUbyA9IHRoaXMua29QYWdlcygpLmluZGV4T2YodG9QYWdlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uTW92ZVBhZ2VDYWxsYmFjayhpbmRleCwgaW5kZXhUbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGNsYXNzIFRleHRQYXJzZXJQcm9wZXJ5IHtcclxuICAgICAgICBpc0ZvdW5kOiBib29sZWFuO1xyXG4gICAgICAgIHByb3BlcnRpZXNDb3VudDogbnVtYmVyO1xyXG4gICAgICAgIHN0YXJ0OiBudW1iZXI7XHJcbiAgICAgICAgZW5kOiBudW1iZXI7XHJcbiAgICAgICAgdmFsdWVTdGFydDogbnVtYmVyO1xyXG4gICAgICAgIHZhbHVlRW5kOiBudW1iZXI7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRleHRXb3JrZXIge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgbmV3TGluZUNoYXI6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgZXJyb3JzOiBBcnJheTxhbnk+O1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICAgICAgcHJpdmF0ZSBqc29uVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIHN1cnZleU9iamVjdHM6IEFycmF5PGFueT47XHJcbiAgICAgICAgcHJpdmF0ZSBpc1N1cnZleUFzUGFnZTogYm9vbGVhbjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnByb2Nlc3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0pzb25Db3JyZWN0KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZSAmJiAhdGhpcy5zdXJ2ZXlWYWx1ZS5pc0VtcHR5OyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHByb2Nlc3MoKSB7XHJcbiAgICAgICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb25WYWx1ZSA9IG5ldyBTdXJ2ZXlKU09ONSgxKS5wYXJzZSh0aGlzLnRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7IHBvczogeyBzdGFydDogZXJyb3IuYXQsIGVuZDogLTEgfSwgdGV4dDogZXJyb3IubWVzc2FnZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5qc29uVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVKc29uUG9zaXRpb25zKHRoaXMuanNvblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSBuZXcgU3VydmV5LlN1cnZleSh0aGlzLmpzb25WYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnNbaV07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goeyBwb3M6IHsgc3RhcnQ6IGVycm9yLmF0LCBlbmQ6IC0xIH0sIHRleHQ6IGVycm9yLmdldEZ1bGxEZXNjcmlwdGlvbigpIH0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMgPSB0aGlzLmNyZWF0ZVN1cnZleU9iamVjdHMoKTtcclxuICAgICAgICAgICAgdGhpcy5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCh0aGlzLnN1cnZleU9iamVjdHMpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KHRoaXMuZXJyb3JzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVKc29uUG9zaXRpb25zKGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBqc29uT2JqW1wicG9zXCJdW1wic2VsZlwiXSA9IGpzb25PYmo7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0ganNvbk9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKG9iaiAmJiBvYmpbXCJwb3NcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBqc29uT2JqW1wicG9zXCJdW2tleV0gPSBvYmpbXCJwb3NcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVKc29uUG9zaXRpb25zKG9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVTdXJ2ZXlPYmplY3RzKCk6IEFycmF5PGFueT4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlID09IG51bGwpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTdXJ2ZXlBc1BhZ2UgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA9PSAwICYmICFwYWdlW1wicG9zXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGFnZVtcInBvc1wiXSA9IHRoaXMuc3VydmV5VmFsdWVbXCJwb3NcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5pc1N1cnZleUFzUGFnZSA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChwYWdlKTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBqKyspIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChwYWdlLnF1ZXN0aW9uc1tqXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdChvYmplY3RzOiBhbnlbXSkge1xyXG4gICAgICAgICAgICBpZiAob2JqZWN0cyA9PSBudWxsIHx8IG9iamVjdHMubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHBvc2l0aW9uID0geyByb3c6IDAsIGNvbHVtbjogMCB9O1xyXG4gICAgICAgICAgICB2YXIgYXRPYmplY3RzQXJyYXkgPSB0aGlzLmdldEF0QXJyYXkob2JqZWN0cyk7XHJcbiAgICAgICAgICAgIHZhciBzdGFydEF0OiBudW1iZXIgPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGF0T2JqZWN0c0FycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXQgPSBhdE9iamVjdHNBcnJheVtpXS5hdDtcclxuICAgICAgICAgICAgICAgIHBvc2l0aW9uID0gdGhpcy5nZXRQb3N0aW9uQnlDaGFydEF0KHBvc2l0aW9uLCBzdGFydEF0LCBhdCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gYXRPYmplY3RzQXJyYXlbaV0ub2JqO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFvYmoucG9zaXRpb24pIG9iai5wb3NpdGlvbiA9IHt9O1xyXG4gICAgICAgICAgICAgICAgaWYgKGF0ID09IG9iai5wb3Muc3RhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmoucG9zaXRpb24uc3RhcnQgPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGF0ID09IG9iai5wb3MuZW5kKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iai5wb3NpdGlvbi5lbmQgPSBwb3NpdGlvbjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBzdGFydEF0ID0gYXQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRQb3N0aW9uQnlDaGFydEF0KHN0YXJ0UG9zaXRpb246IEFjZUFqYXguUG9zaXRpb24sIHN0YXJ0QXQ6IG51bWJlciwgYXQ6IG51bWJlcik6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7IHJvdzogc3RhcnRQb3NpdGlvbi5yb3csIGNvbHVtbjogc3RhcnRQb3NpdGlvbi5jb2x1bW4gfTtcclxuICAgICAgICAgICAgdmFyIGN1ckNoYXIgPSBzdGFydEF0O1xyXG4gICAgICAgICAgICB3aGlsZSAoY3VyQ2hhciA8IGF0KSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50ZXh0LmNoYXJBdChjdXJDaGFyKSA9PSBTdXJ2ZXlUZXh0V29ya2VyLm5ld0xpbmVDaGFyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnJvdysrO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5jb2x1bW4gPSAwO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQuY29sdW1uKys7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBjdXJDaGFyKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRBdEFycmF5KG9iamVjdHM6IGFueVtdKTogYW55W10ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG9iaiA9IG9iamVjdHNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcG9zID0gb2JqLnBvcztcclxuICAgICAgICAgICAgICAgIGlmICghcG9zKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgYXQ6IHBvcy5zdGFydCwgb2JqOiBvYmogfSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocG9zLmVuZCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IGF0OiBwb3MuZW5kLCBvYmo6IG9iaiB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNvcnQoKGVsMSwgZWwyKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBpZiAoZWwxLmF0ID4gZWwyLmF0KSByZXR1cm4gMTtcclxuICAgICAgICAgICAgICAgIGlmIChlbDEuYXQgPCBlbDIuYXQpIHJldHVybiAtMTtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlFbWJlZGluZ1dpbmRvdyB7XHJcbiAgICAgICAgcHJpdmF0ZSBqc29uVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIHN1cnZleUVtYmVkaW5nSGVhZDogQWNlQWpheC5FZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0phdmE6IEFjZUFqYXguRWRpdG9yO1xyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIGtvU2hvd0FzV2luZG93OiBhbnk7XHJcbiAgICAgICAga29TY3JpcHRVc2luZzogYW55O1xyXG4gICAgICAgIGtvSGFzSWRzOiBhbnk7XHJcbiAgICAgICAga29Mb2FkU3VydmV5OiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb1Nob3dBc1dpbmRvdyA9IGtvLm9ic2VydmFibGUoXCJwYWdlXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2NyaXB0VXNpbmcgPSBrby5vYnNlcnZhYmxlKFwiYm9vdHN0cmFwXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzSWRzID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Mb2FkU3VydmV5ID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29TaG93QXNXaW5kb3cuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnN1cnZleUVtYmVkaW5nSmF2YS5zZXRWYWx1ZShzZWxmLmdldEphdmFUZXh0KCkpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZXRIZWFkVGV4dCgpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0xvYWRTdXJ2ZXkuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnN1cnZleUVtYmVkaW5nSmF2YS5zZXRWYWx1ZShzZWxmLmdldEphdmFUZXh0KCkpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPSBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGpzb24oKTogYW55IHsgcmV0dXJuIHRoaXMuanNvblZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBqc29uKHZhbHVlOiBhbnkpIHsgdGhpcy5qc29uVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzaG93KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSGVhZFwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SGVhZFRleHQoKTtcclxuICAgICAgICAgICAgICAgIHZhciBib2R5RWRpdG9yID0gdGhpcy5jcmVhdGVFZGl0b3IoXCJzdXJ2ZXlFbWJlZGluZ0JvZHlcIik7XHJcbiAgICAgICAgICAgICAgICBib2R5RWRpdG9yLnNldFZhbHVlKFwiPGRpdiBpZD0gXFxcIm15U3VydmV5SlNOYW1lXFxcIiA+PC9kaXY+XCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0phdmEgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nSmF2YVwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSGFzSWRzKHRoaXMuc3VydmV5SWQgJiYgdGhpcy5zdXJ2ZXlQb3N0SWQpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSmF2YS5zZXRWYWx1ZSh0aGlzLmdldEphdmFUZXh0KCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEhlYWRUZXh0KCkge1xyXG4gICAgICAgICAgICB2YXIga25vY2tvdXRTdHIgPSBcIjxzY3JpcHQgc3JjPVxcXCJodHRwczovL2NkbmpzLmNsb3VkZmxhcmUuY29tL2FqYXgvbGlicy9rbm9ja291dC8zLjMuMC9rbm9ja291dC1taW4uanNcXFwiID48L3NjcmlwdD5cXG5cIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMua29TY3JpcHRVc2luZygpID09IFwiYm9vdHN0cmFwXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkLnNldFZhbHVlKGtub2Nrb3V0U3RyICsgXCI8c2NyaXB0IHNyYz1cXFwianMvc3VydmV5LmJvb3RzdHJhcC5taW4uanNcXFwiPjwvc2NyaXB0PlwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdIZWFkLnNldFZhbHVlKGtub2Nrb3V0U3RyICsgXCI8c2NyaXB0IHNyYz1cXFwianMvc3VydmV5Lm1pbi5qc1xcXCI+PC9zY3JpcHQ+XFxuPGxpbmsgaHJlZj1cXFwiY3NzL3N1cnZleS5jc3NcXFwiIHR5cGU9XFxcInRleHQvY3NzXFxcIiByZWw9XFxcInN0eWxlc2hlZXRcXFwiIC8+XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlRWRpdG9yKGVsZW1lbnROYW1lOiBzdHJpbmcpOiBBY2VBamF4LkVkaXRvciB7XHJcbiAgICAgICAgICAgIHZhciBlZGl0b3IgPSBhY2UuZWRpdChlbGVtZW50TmFtZSk7XHJcbiAgICAgICAgICAgIGVkaXRvci5zZXRUaGVtZShcImFjZS90aGVtZS9tb25va2FpXCIpO1xyXG4gICAgICAgICAgICBlZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvanNvblwiKTtcclxuICAgICAgICAgICAgZWRpdG9yLnNldFNob3dQcmludE1hcmdpbihmYWxzZSk7XHJcbiAgICAgICAgICAgIGVkaXRvci5yZW5kZXJlci5zZXRTaG93R3V0dGVyKGZhbHNlKTtcclxuICAgICAgICAgICAgZWRpdG9yLnNldFJlYWRPbmx5KHRydWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gZWRpdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEphdmFUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBpc09uUGFnZSA9IHRoaXMua29TaG93QXNXaW5kb3coKSA9PSBcInBhZ2VcIjtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSBpc09uUGFnZSA/IFwidmFyIHN1cnZleSA9IG5ldyBTdXJ2ZXkuU3VydmV5KFxcblwiIDogXCJ2YXIgc3VydmV5V2luZG93ID0gbmV3IFN1cnZleS5TdXJ2ZXlXaW5kb3coXFxuXCI7XHJcbiAgICAgICAgICAgIHRleHQgKz0gdGhpcy5nZXRKc29uVGV4dCgpO1xyXG4gICAgICAgICAgICB0ZXh0ICs9IFwiKTtcXG5cIjtcclxuICAgICAgICAgICAgaWYgKCFpc09uUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSBcInN1cnZleVdpbmRvdy5cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2F2ZUZ1bmMgPSBcImFsZXJ0KFxcXCJUaGUgcmVzdWx0cyBhcmU6XFxcIiArIEpTT04uc3RyaW5naWZ5KHMuZGF0YSkpO1wiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5rb0hhc0lkcygpKSB7XHJcbiAgICAgICAgICAgICAgICBzYXZlRnVuYyA9IFwic3VydmV5LnNlbmRSZXN1bHQoJ1wiICsgdGhpcy5zdXJ2ZXlQb3N0SWQgKyBcIicpO1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHQgKz0gXCJzdXJ2ZXkub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKHMpIHtcXG5cIiArIHNhdmVGdW5jICsgXCJcXG4gfSk7XFxuXCI7XHJcbiAgICAgICAgICAgIGlmIChpc09uUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSBcInN1cnZleS5yZW5kZXIoXFxcIm15U3VydmV5SlNOYW1lXFxcIik7XCI7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IFwiLy9CeSBkZWZhdWx0IFN1cnZleS50aXRsZSBpcyB1c2VkLlxcblwiXHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IFwiLy9zdXJ2ZXlXaW5kb3cudGl0bGUgPSBcXFwiTXkgU3VydmV5IFdpbmRvdyBUaXRsZS5cXFwiO1xcblwiO1xyXG4gICAgICAgICAgICAgICAgdGV4dCArPSBcInN1cnZleVdpbmRvdy5zaG93KCk7XCI7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEpzb25UZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmtvSGFzSWRzKCkgJiYgdGhpcy5rb0xvYWRTdXJ2ZXkoKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwieyBzdXJ2ZXlJZDogJ1wiICsgdGhpcy5zdXJ2ZXlJZCArIFwiJ31cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1cnZleUpTT041KCkuc3RyaW5naWZ5KHRoaXMuanNvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmVyYnMge1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICAgICAgcHJpdmF0ZSBvYmpWYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc0NsYXNzZXM6IEFycmF5PHN0cmluZz47XHJcbiAgICAgICAga29WZXJiczogYW55O1xyXG4gICAgICAgIGtvSGFzVmVyYnM6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1ZlcmJzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29IYXNWZXJicyA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdmFyIGNsYXNzZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoXCJzZWxlY3RiYXNlXCIsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXNDbGFzc2VzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jaG9pY2VzQ2xhc3Nlcy5wdXNoKGNsYXNzZXNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBzdXJ2ZXkodmFsdWU6IFN1cnZleS5TdXJ2ZXkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvYmooKTogYW55IHsgcmV0dXJuIHRoaXMub2JqVmFsdWUgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb2JqKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqVmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vYmpWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmJ1aWxkVmVyYnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBidWlsZFZlcmJzKCkge1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZSh0aGlzLm9iaik7XHJcbiAgICAgICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IDxTdXJ2ZXkuUXVlc3Rpb24+dGhpcy5vYmo7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IFN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbSh0aGlzLnN1cnZleSwgcXVlc3Rpb24pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZXNDbGFzc2VzLmluZGV4T2YocXVlc3Rpb24uZ2V0VHlwZSgpKSA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChuZXcgU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtKHRoaXMuc3VydmV5LCBxdWVzdGlvbikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29WZXJicyhhcnJheSk7XHJcbiAgICAgICAgICAgIHRoaXMua29IYXNWZXJicyhhcnJheS5sZW5ndGggPiAwKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmVyYkl0ZW0ge1xyXG4gICAgICAgIGtvSXRlbXM6IGFueTtcclxuICAgICAgICBrb1NlbGVjdGVkSXRlbTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0gZXh0ZW5kcyBTdXJ2ZXlWZXJiSXRlbSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHN1cnZleTogU3VydmV5LlN1cnZleSwgcHVibGljIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIoc3VydmV5LCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHZhciBjbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic2VsZWN0YmFzZVwiLCB0cnVlKTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2xhc3Nlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgYXJyYXkucHVzaCh7IHZhbHVlOiBjbGFzc2VzW2ldLm5hbWUsIHRleHQ6IGNsYXNzZXNbaV0ubmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtKHF1ZXN0aW9uLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuY2hhbmdlVHlwZShuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIFwiQ2hhbmdlIHR5cGUgXCI7IH1cclxuICAgICAgICBwcml2YXRlIGNoYW5nZVR5cGUocXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSA9PSB0aGlzLnF1ZXN0aW9uLmdldFR5cGUoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgbmV3UXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgdGhpcy5xdWVzdGlvbi5uYW1lKTtcclxuICAgICAgICAgICAgdmFyIGpzb25PYmogPSBuZXcgU3VydmV5Lkpzb25PYmplY3QoKTtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSBqc29uT2JqLnRvSnNvbk9iamVjdCh0aGlzLnF1ZXN0aW9uKTtcclxuICAgICAgICAgICAganNvbk9iai50b09iamVjdChqc29uLCBuZXdRdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHBhZ2UucmVtb3ZlUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHBhZ2UuYWRkUXVlc3Rpb24obmV3UXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtIGV4dGVuZHMgU3VydmV5VmVyYkl0ZW0ge1xyXG4gICAgICAgIHByaXZhdGUgcHJldlBhZ2U6IFN1cnZleS5QYWdlO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goeyB2YWx1ZTogcGFnZSwgdGV4dDogU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUocGFnZSkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcclxuICAgICAgICAgICAgdGhpcy5wcmV2UGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbSh0aGlzLnByZXZQYWdlKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5jaGFuZ2VQYWdlKG5ld1ZhbHVlKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gXCJDaGFuZ2UgcGFnZSBcIjsgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlUGFnZShuZXdQYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICBpZiAobmV3UGFnZSA9PSBudWxsIHx8IG5ld1BhZ2UgPT0gdGhpcy5wcmV2UGFnZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZQYWdlLnJlbW92ZVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBuZXdQYWdlLmFkZFF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSB0ZW1wbGF0ZUVkaXRvci5rbyB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8bmF2IGNsYXNzPVwibmF2YmFyIG5hdmJhci1kZWZhdWx0XCI+ICAgIDxkaXYgY2xhc3M9XCJjb250YWluZXItZmx1aWRcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJjb2xsYXBzZSBuYXZiYXItY29sbGFwc2VcIiBpZD1cImJzLWV4YW1wbGUtbmF2YmFyLWNvbGxhcHNlLTFcIj4gICAgICAgICAgICA8dWwgY2xhc3M9XCJuYXYgbmF2YmFyLW5hdlwiPiAgICAgICAgICAgICAgICA8bGkgY2xhc3M9XCJkcm9wZG93blwiPiAgICAgICAgICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBjbGFzcz1cImRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiByb2xlPVwiYnV0dG9uXCIgYXJpYS1oYXNwb3B1cD1cInRydWVcIiBhcmlhLWV4cGFuZGVkPVwiZmFsc2VcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb0lzU2hvd0Rlc2lnbmVyKCkgPyBcXCdTdXJ2ZXkgRGVzaWduZXJcXCc6IFxcJ0pTT04gRWRpdG9yXFwnXCI+PC9zcGFuPiA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPjwvYT4gICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIj4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3REZXNpZ25lckNsaWNrXCI+VXNlIFN1cnZleSBEZXNpZ25lcjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgICAgIDxsaT48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOnNlbGVjdEVkaXRvckNsaWNrXCI+VXNlIEpTT04gRWRpdG9yPC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICA8L3VsPiAgICAgICAgICAgICAgICA8L2xpPiAgICAgICAgICAgIDwvdWw+ICAgICAgICAgICAgPGZvcm0gY2xhc3M9XCJuYXZiYXItZm9ybSBuYXZiYXItbGVmdFwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOiBydW5TdXJ2ZXlDbGlja1wiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNzdXJ2ZXlFeGFtcGxlTW9kYWxcIj5SdW4gU3VydmV5PC9idXR0b24+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1iaW5kPVwiY2xpY2s6IGVtYmVkaW5nU3VydmV5Q2xpY2tcIiBkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgZGF0YS10YXJnZXQ9XCIjc3VydmV5RW1iZWRpbmdNb2RhbFwiPkVtYmVkaW5nIFN1cnZleSB0byBZb3VyIFBhZ2U8L2J1dHRvbj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1Nob3dTYXZlQnV0dG9uLCBjbGljazogc2F2ZUJ1dHRvbkNsaWNrXCIgPlNhdmUgU3VydmV5PC9idXR0b24+ICAgICAgICAgICAgPC9mb3JtPiAgICAgICAgPC9kaXY+PCEtLSAvLm5hdmJhci1jb2xsYXBzZSAtLT4gICAgPC9kaXY+PCEtLSAvLmNvbnRhaW5lci1mbHVpZCAtLT48L25hdj48ZGl2IGNsYXNzPVwicGFuZWxcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj4gICAgPGRpdiBpZD1cInN1cnZleWpzRWRpdG9yXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogIWtvSXNTaG93RGVzaWduZXIoKVwiIHN0eWxlPVwiaGVpZ2h0OjQ1MHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPGRpdiBjbGFzcz1cInJvd1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXIoKVwiPiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy00IGNvbC1tZC0zXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IHN0eWxlPVwid2lkdGg6ODAlXCIgIGRhdGEtYmluZD1cIm9wdGlvbnM6IGtvT2JqZWN0cywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOiBrb1NlbGVjdGVkT2JqZWN0XCI+PC9zZWxlY3Q+ICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb0NhbkRlbGV0ZU9iamVjdCwgY2xpY2s6IGRlbGV0ZUN1cnJlbnRPYmplY3RcIiBzdHlsZT1cIndpZHRoOjE1JVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3RlZGl0b3JcXCcsIGRhdGE6IHNlbGVjdGVkT2JqZWN0RWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWZvb3RlclwiIGRhdGEtYmluZD1cInZpc2libGU6c3VydmV5VmVyYnMua29IYXNWZXJic1wiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3R2ZXJic1xcJywgZGF0YTogc3VydmV5VmVyYnMgfVwiPjwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMiBjb2wtc20tNiBjb2wtbWQtOFwiPiAgICAgICAgICAgIDxuYXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIj4gICAgICAgICAgICAgICAgPGZvcm0gY2xhc3M9XCJuYXZiYXItZm9ybVwiPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvblR5cGVzIC0tPiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiIHR5cGU9XCJidXR0b25cIiBkcmFnZ2FibGU9XCJ0cnVlXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQuY2xpY2tRdWVzdGlvbiwgZXZlbnQ6e2RyYWdzdGFydDogZnVuY3Rpb24oZWwsIGUpIHsgJHBhcmVudC5kcmFnZ2luZ1F1ZXN0aW9uKCRkYXRhLCBlKTsgcmV0dXJuIHRydWU7fX1cIj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICAgICAgICAgIDwvZm9ybT4gICAgICAgICAgICA8L25hdj4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3BhZ2VlZGl0b3JcXCcsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3ZlcmZsb3cteTogc2Nyb2xsO2hlaWdodDo0NTBweDtcIj4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleWpzXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PC9kaXY+ICAgICAgICAgICAgPC9kaXY+PC9kaXY+ICAgIDwvZGl2PjwvZGl2PjxkaXYgaWQ9XCJzdXJ2ZXlFeGFtcGxlTW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiByb2xlPVwiZGlhbG9nXCI+ICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4mdGltZXM7PC9idXR0b24+ICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+UnVubmluZyBzdXJ2ZXk8L2g0PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+ICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc0V4YW1wbGVcIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj48ZGl2IGlkPVwic3VydmV5RW1iZWRpbmdNb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiIHJvbGU9XCJkaWFsb2dcIj4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5FbWJlZGluZyBzdXJ2ZXk8L2g0PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5ZW1iZWRpbmdcXCcsIGRhdGE6IHN1cnZleUVtYmVkaW5nIH1cIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cIm9iamVjdGVkaXRvclwiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZSBzdmRfdGFibGUtbm93cmFwXCI+ICAgICAgICA8dGJvZHkgZGF0YS1iaW5kPVwiZm9yZWFjaDoga29Qcm9wZXJ0aWVzXCI+ICAgICAgICAgICAgPHRyIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50LmNoYW5nZUFjdGl2ZVByb3BlcnR5KCRkYXRhKSwgY3NzOiB7XFwnYWN0aXZlXFwnOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSA9PSAkZGF0YX1cIj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6IG5hbWVcIiB3aWR0aD1cIjUwJVwiPjwvdGQ+ICAgICAgICAgICAgICAgIDx0ZCB3aWR0aD1cIjUwJVwiPiAgICAgICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDoga29UZXh0LCB2aXNpYmxlOiAkcGFyZW50LmtvQWN0aXZlUHJvcGVydHkoKSAhPSAkZGF0YSwgYXR0cjoge3RpdGxlOiBrb1RleHR9LCBzdHlsZToge2NvbG9yOiBrb0lzRGVmYXVsdCgpID8gXFwnZ3JheVxcJyA6IFxcJ1xcJ31cIiBzdHlsZT1cInRleHQtb3ZlcmZsb3c6ZWxsaXBzaXM7d2hpdGUtc3BhY2U6bm93cmFwO292ZXJmbG93OmhpZGRlblwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogJHBhcmVudC5rb0FjdGl2ZVByb3BlcnR5KCkgPT0gJGRhdGFcIj4gICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3Byb3BlcnR5ZWRpdG9yLVxcJyArIGVkaXRvclR5cGUsIGRhdGE6ICRkYXRhIH0gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC90ZD4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cIm9iamVjdHZlcmJzXCI+ICAgIDwhLS0ga28gZm9yZWFjaDoga29WZXJicyAtLT4gICAgICAgIDxkaXY+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDp0ZXh0XCI+PC9zcGFuPiAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9XCJ3aWR0aDo1MCVcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOiBrb0l0ZW1zLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgb3B0aW9uc1ZhbHVlOlxcJ3ZhbHVlXFwnLCB2YWx1ZToga29TZWxlY3RlZEl0ZW1cIj48L3NlbGVjdD4gICAgICAgICAgICA8IS0tIGtvIGlmOiAoJGluZGV4KCkgIT0gKCRwYXJlbnQua29WZXJicygpLmxlbmd0aCAtIDEpKSAtLT4gICAgICAgICAgICA8cD48L3A+ICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgIDwvZGl2PiAgICA8IS0tIC9rbyAgLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwYWdlZWRpdG9yXCI+ICAgIDx1bCBjbGFzcz1cIm5hdiBuYXYtdGFic1wiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb1BhZ2VzIC0tPiAgICAgICAgPGxpIGRhdGEtYmluZD1cImNzczoge2FjdGl2ZToga29TZWxlY3RlZCgpfSxldmVudDp7ICAgICAgICAgICBkcmFnc3RhcnQ6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdTdGFydChlbCk7IHJldHVybiB0cnVlOyB9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdPdmVyKGVsKTt9LCAgICAgICAgICAgZHJhZ2VuZDpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQuZHJhZ0VuZCgpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnRHJvcChlbCk7fSAgICAgICAgIH1cIj4gICAgICAgICAgICAgPGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazokcGFyZW50LnNlbGVjdFBhZ2VDbGlja1wiPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0aXRsZVwiPjwvc3Bhbj4gICAgICAgICAgICA8L2E+ICAgICAgICA8L2xpPiAgICAgICAgPCEtLSAva28gIC0tPiAgICAgICAgPGxpPjxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1iaW5kPVwiY2xpY2s6YWRkTmV3UGFnZUNsaWNrXCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+PC9idXR0b24+PC9saT4gICAgPC91bD48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWJvb2xlYW5cIj4gICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGRhdGEtYmluZD1cImNoZWNrZWQ6IGtvVmFsdWVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItZHJvcGRvd25cIj4gICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZSwgb3B0aW9uczogY2hvaWNlc1wiICBzdHlsZT1cIndpZHRoOjEwMCVcIj48L3NlbGVjdD48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWl0ZW12YWx1ZXNcIj4gICAgPGRpdj4gICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtvVGV4dFwiPjwvc3Bhbj4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI3Byb3BlcnR5RWRpdG9ySXRlbVZhbHVlc01vZGFsXCI+RWRpdDwvYnV0dG9uPiAgICA8L2Rpdj4gICAgPGRpdiBpZD1cInByb3BlcnR5RWRpdG9ySXRlbVZhbHVlc01vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgZGF0YS1iaW5kPVwidGV4dDphcnJheUVkaXRvci50aXRsZVwiPjwvaDQ+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsXCIgZGF0YS1iaW5kPVwid2l0aDogYXJyYXlFZGl0b3JcIj4gICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlZhbHVlPC90aD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+VGV4dDwvdGg+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RoZWFkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IGtvSXRlbXMgLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1RleHRcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImNsaWNrOiAkcGFyZW50Lm9uRGVsZXRlQ2xpY2tcIiB2YWx1ZT1cIkRlbGV0ZVwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29OZXdWYWx1ZVwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvTmV3VGV4dFwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQWRkQ2xpY2tcIiB2YWx1ZT1cIkFkZFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+ICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJBcHBseVwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFwcGx5Q2xpY2tcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInB1bGwtcmlnaHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIHZhbHVlPVwiY2xvc2VcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLW51bWJlclwiPiAgICA8aW5wdXQgdHlwZT1cIm51bWJlclwiIGRhdGEtYmluZD1cInZhbHVlOiBrb1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXN0cmluZ1wiPiAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci10ZXh0aXRlbXNcIj4gICAgPGRpdj4gICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtvVGV4dFwiPjwvc3Bhbj4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI3Byb3BlcnR5RWRpdG9yVGV4dEl0ZW1zTW9kYWxcIj5FZGl0PC9idXR0b24+ICAgIDwvZGl2PiAgICA8ZGl2IGlkPVwicHJvcGVydHlFZGl0b3JUZXh0SXRlbXNNb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiIHJvbGU9XCJkaWFsb2dcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+ICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4mdGltZXM7PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiIGRhdGEtYmluZD1cInRleHQ6YXJyYXlFZGl0b3IudGl0bGVcIj48L2g0PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGRhdGEtYmluZD1cIndpdGg6IGFycmF5RWRpdG9yXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5OYW1lPC90aD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+VGl0bGU8L3RoPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0l0ZW1zIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05hbWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1RpdGxlXCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkRlbGV0ZUNsaWNrXCIgdmFsdWU9XCJEZWxldGVcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGNvbHNwYW49XCI0XCI+PGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJjbGljazogb25BZGRDbGlja1wiIHZhbHVlPVwiQWRkXCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT4gICAgICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1mb290ZXJcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkFwcGx5XCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQXBwbHlDbGlja1wiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicHVsbC1yaWdodFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgdmFsdWU9XCJjbG9zZVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdHJpZ2dlcnNcIj4gICAgPGRpdj4gICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtvVGV4dFwiPjwvc3Bhbj4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI3Byb3BlcnR5RWRpdG9yVHJpZ2dlcnNNb2RhbFwiPkVkaXQ8L2J1dHRvbj4gICAgPC9kaXY+ICAgIDxkaXYgaWQ9XCJwcm9wZXJ0eUVkaXRvclRyaWdnZXJzTW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiByb2xlPVwiZGlhbG9nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JnRpbWVzOzwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIiBkYXRhLWJpbmQ9XCJ0ZXh0OmFycmF5RWRpdG9yLnRpdGxlXCI+PC9oND4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWxcIiBkYXRhLWJpbmQ9XCJ3aXRoOiBhcnJheUVkaXRvclwiPiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3Qgc3R5bGU9XCJ3aWR0aDo2NSVcIiBkYXRhLWJpbmQ9XCJvcHRpb25zOiBrb0l0ZW1zLCBvcHRpb25zVGV4dDogXFwna29UZXh0XFwnLCB2YWx1ZToga29TZWxlY3RlZFwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1F1ZXN0aW9ucygpLmxlbmd0aCA+IDAsIGNsaWNrOiBvbkFkZENsaWNrXCIgc3R5bGU9XCJ3aWR0aDoxNSVcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uRGVsZXRlQ2xpY2tcIiBzdHlsZT1cIndpZHRoOjE1JVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1NlbGVjdGVkKCkgPT0gbnVsbFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvUXVlc3Rpb25zKCkubGVuZ3RoID09IDBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFRoZXJlIGlzIG5vIGFueSBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1F1ZXN0aW9ucygpLmxlbmd0aCA+IDBcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFBsZWFzZSBjcmVhdGUgYSB0cmlnZ2VyICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZCgpICE9IG51bGxcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ3aXRoOiBrb1NlbGVjdGVkXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5PbiA8L3NwYW4+PHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOiRwYXJlbnQua29RdWVzdGlvbnMsIHZhbHVlOiBrb05hbWVcIj48L3NlbGVjdD4gPHNwYW4+IDwvc3Bhbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwib3B0aW9uczphdmFpbGFibGVPcGVyYXRvcnMsIG9wdGlvbnNWYWx1ZTogXFwnbmFtZVxcJywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOmtvT3BlcmF0b3JcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvUmVxdWlyZVZhbHVlLCB2YWx1ZTprb1ZhbHVlXCIgLz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTZcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zXFwnLCBkYXRhOiBwYWdlcyB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiY29sLXNtLTZcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zXFwnLCBkYXRhOiBxdWVzdGlvbnMgfSAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWZvb3RlclwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiQXBwbHlcIiBkYXRhLWJpbmQ9XCJjbGljazogb25BcHBseUNsaWNrXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJwdWxsLXJpZ2h0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiB2YWx1ZT1cImNsb3NlXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci10cmlnZ2Vyc2l0ZW1zXCI+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiB0aXRsZVwiPjwvc3Bhbj4gICAgICAgIDwvZGl2PiAgICAgICAgPHNlbGVjdCBtdWx0aXBsZT1cIm11bHRpcGxlXCIgZGF0YS1iaW5kPVwib3B0aW9uczprb0Nob29zZW4sIHZhbHVlOiBrb0Nob29zZW5TZWxlY3RlZFwiIHN0eWxlPVwid2lkdGg6MjAwcHg7XCI+PC9zZWxlY3Q+ICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJlbmFibGU6IGtvQ2hvb3NlblNlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uRGVsZXRlQ2xpY2tcIiBzdHlsZT1cIndpZHRoOjQwcHg7IHZlcnRpY2FsLWFsaWduOnRvcFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgIDxkaXY+ICAgICAgICAgICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOmtvT2JqZWN0cywgdmFsdWU6IGtvU2VsZWN0ZWRcIiBzdHlsZT1cIndpZHRoOjIwMHB4O1wiPjwvc2VsZWN0PiAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkFkZENsaWNrXCIgc3R5bGU9XCJ3aWR0aDo0MHB4XCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXZhbGlkYXRvcnNcIj4gICAgPGRpdj4gICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtvVGV4dFwiPjwvc3Bhbj4gICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI3Byb3BlcnR5RWRpdG9yVmFsaWRhdG9yc01vZGFsXCI+RWRpdDwvYnV0dG9uPiAgICA8L2Rpdj4gICAgPGRpdiBpZD1cInByb3BlcnR5RWRpdG9yVmFsaWRhdG9yc01vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgZGF0YS1iaW5kPVwidGV4dDphcnJheUVkaXRvci50aXRsZVwiPjwvaDQ+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsXCIgZGF0YS1iaW5kPVwid2l0aDogYXJyYXlFZGl0b3JcIj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IHN0eWxlPVwid2lkdGg6NjUlXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOiBrb1NlbGVjdGVkXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXMgZHJvcGRvd24tdG9nZ2xlXCIgZGF0YS10b2dnbGU9XCJkcm9wZG93blwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiY2FyZXRcIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHVsIGNsYXNzPVwiZHJvcGRvd24tbWVudVwiID4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBhdmFpbGFibGVWYWxpZGF0b3JzIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkFkZENsaWNrKCRkYXRhKVwiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6JGRhdGFcIj48L3NwYW4+PC9hPjwvbGk+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3VsPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJlbmFibGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25EZWxldGVDbGlja1wiIHN0eWxlPVwid2lkdGg6MTUlXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcmVtb3ZlXCI+PC9zcGFuPjwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ29iamVjdGVkaXRvclxcJywgZGF0YTogc2VsZWN0ZWRPYmplY3RFZGl0b3IgfVwiPjwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1mb290ZXJcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkFwcGx5XCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQXBwbHlDbGlja1wiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicHVsbC1yaWdodFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgdmFsdWU9XCJjbG9zZVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5ZW1iZWRpbmdcIj4gICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1NjcmlwdFVzaW5nXCI+ICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJvb3RzdHJhcFwiPkZvciBib290c3RyYXAgZnJhbWV3b3JrPC9vcHRpb24+ICAgICAgICAgICAgPG9wdGlvbiB2YWx1ZT1cInN0YW5kYXJkXCI+Tm8gYm9vdHN0cmFwPC9vcHRpb24+ICAgICAgICA8L3NlbGVjdD4gICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6a29TaG93QXNXaW5kb3dcIj4gICAgICAgICAgICA8b3B0aW9uIHZhbHVlPVwicGFnZVwiPlVzZSBTdXJ2ZXkgSW5zaWRlIGEgUGFnZTwvb3B0aW9uPiAgICAgICAgICAgIDxvcHRpb24gdmFsdWU9XCJ3aW5kb3dcIj5Vc2UgU3VydmV5IGFzIGEgV2luZG93PC9vcHRpb24+ICAgICAgICA8L3NlbGVjdD4gICAgICAgIDxsYWJlbCBjbGFzcz1cImNoZWNrYm94LWlubGluZVwiIGRhdGEtYmluZD1cInZpc2libGU6a29IYXNJZHNcIj4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgZGF0YS1iaW5kPVwiY2hlY2tlZDprb0xvYWRTdXJ2ZXlcIiAvPiAgICAgICAgICAgIDxzcGFuPkxvYWQgU3VydmV5IGZyb20gc2VydmVyPC9zcGFuPiAgICAgICAgPC9sYWJlbD4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5TY3JpcHRzIGFuZCBzdHlsZXM8L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlFbWJlZGluZ0hlYWRcIiBzdHlsZT1cImhlaWdodDo3MHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvU2hvd0FzV2luZG93KCk9PVxcJ3BhZ2VcXCdcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+SFRNTCBwYXJ0PC9kaXY+ICAgICAgICA8ZGl2IGlkPVwic3VydmV5RW1iZWRpbmdCb2R5XCIgc3R5bGU9XCJoZWlnaHQ6MzBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwicGFuZWxcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+SmF2YSBTY3JpcHQ8L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlFbWJlZGluZ0phdmFcIiBzdHlsZT1cImhlaWdodDozMDBweDt3aWR0aDoxMDAlXCI+PC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0Pic7fSIsIm1vZHVsZSB0ZW1wbGF0ZV9wYWdlIHsgZXhwb3J0IHZhciBodG1sID0gJzxkaXYgZGF0YS1iaW5kPVwiZXZlbnQ6eyAgICAgICAgICAgZHJhZ2VudGVyOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0VudGVyKGUpO30sICAgICAgICAgICBkcmFnbGVhdmU6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnTGVhdmUoZSk7fSwgICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgcmV0dXJuIGZhbHNlO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fX0gICAgIFwiPiAgICA8aDQgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHRpdGxlXCI+PC9oND4gICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnIH0gLS0+ICAgIDxkaXYgY2xhc3M9XCJzdmRfZHJhZ292ZXJcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiRwYXJlbnQua29EcmFnZ2luZygpID09ICRpbmRleCgpXCI+PC9kaXY+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSAva28gLS0+ICAgIDxkaXYgY2xhc3M9XCJ3ZWxsXCIgZGF0YS1iaW5kPVwidmlzaWJsZTokcm9vdC5pc0Rlc2lnbk1vZGUgJiYgcXVlc3Rpb25zLmxlbmd0aCA9PSAwXCI+ICAgICAgICA8c3Bhbj5QbGVhc2UgZHJvcCBhIHF1ZXN0aW9uIGhlcmUuPC9zcGFuPiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInN2ZF9kcmFnb3ZlclwiIGRhdGEtYmluZD1cInZpc2libGU6a29EcmFnZ2luZygpID09IHF1ZXN0aW9ucy5sZW5ndGhcIj48L2Rpdj48L2Rpdj4nO30iLCJtb2R1bGUgdGVtcGxhdGVfcXVlc3Rpb24geyBleHBvcnQgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIndlbGwgd2VsbC1zbVwiIGRhdGEtYmluZD1cImF0dHIgOiB7ZHJhZ2dhYmxlOiAkcm9vdC5pc0Rlc2lnbk1vZGV9LCB2aXNpYmxlOiBxdWVzdGlvbi5rb1Zpc2libGUoKSB8fCAkcm9vdC5pc0Rlc2lnbk1vZGUsIGNsaWNrOiAkcm9vdC5pc0Rlc2lnbk1vZGUgPyBrb09uQ2xpY2s6IG51bGwsIGNzczoge3N2ZF9xX3NlbGVjdGVkIDoga29Jc1NlbGVjdGVkfSwgICAgICAgICBldmVudDp7ICAgICAgICAgICBkcmFnc3RhcnQ6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnU3RhcnQoZSk7IHJldHVybiB0cnVlOyB9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnT3ZlcihlKTt9LCAgICAgICAgICAgZHJvcDpmdW5jdGlvbihlbCwgZSl7IGRyYWdEcm9wKGUpO30gICAgICAgICB9XCI+ICAgIDxkaXYgZGF0YS1iaW5kPVwiY3NzOntzdmRfcV9kZXNpZ246ICRyb290LmlzRGVzaWduTW9kZX1cIj4gICAgICAgIDxkaXYgY2xhc3M9XCJhbGVydCBhbGVydC1kYW5nZXJcIiByb2xlPVwiYWxlcnRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb0Vycm9ycygpLmxlbmd0aCA+IDAsIGZvcmVhY2g6IGtvRXJyb3JzXCI+ICAgICAgICAgICAgPGRpdj4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLWV4Y2xhbWF0aW9uLXNpZ25cIiBhcmlhLWhpZGRlbj1cInRydWVcIj48L3NwYW4+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6JGRhdGEuZ2V0VGV4dCgpXCI+PC9zcGFuPiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgICAgICA8aDUgZGF0YS1iaW5kPVwidGV4dDogcXVlc3Rpb24ua29ObygpICsgIChxdWVzdGlvbi5pc1JlcXVpcmVkID8gcXVlc3Rpb24uZGF0YS5yZXF1aXJlZFRleHQgOiBcXCdcXCcpICsgcXVlc3Rpb24udGl0bGVcIj48L2g1PiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgcXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc0NvbW1lbnRcIj4gICAgICAgICAgICBPdGhlciAocGxlYXNlIGRlc2NyaWJlKSAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHRydWUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9kaXY+Jzt9IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdEVkaXRvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJwYWdlc0VkaXRvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZXh0V29ya2VyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cnZleUhlbHBlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlFbWJlZGluZ1dpbmRvdy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RWZXJicy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJkcmFnZHJvcGhlbHBlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZUVkaXRvci5rby5odG1sLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRlbXBsYXRlX3BhZ2UuaHRtbC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZV9xdWVzdGlvbi5odG1sLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUVkaXRvciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1cGRhdGVUZXh0VGltZW91dDogbnVtYmVyID0gMTAwMDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHROZXdTdXJ2ZXlUZXh0OiBzdHJpbmcgPSBcInsgcGFnZXM6IFsgeyBuYW1lOiAncGFnZTEnfV0gfVwiO1xyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyZWRFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgICAgICBwcml2YXRlIHN1cnZleWpzOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBwcml2YXRlIHN1cnZleWpzRXhhbXBsZTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUganNvbkVkaXRvcjogQWNlQWpheC5FZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1Byb2Nlc3NpbmdJbW1lZGlhdGVseTogYm9vbGVhbjtcclxuICAgICAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0RWRpdG9yOiBTdXJ2ZXlPYmplY3RFZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBwYWdlc0VkaXRvcjogU3VydmV5UGFnZXNFZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZzogU3VydmV5RW1iZWRpbmdXaW5kb3dcclxuICAgICAgICBwcml2YXRlIHN1cnZleU9iamVjdHM6IFN1cnZleU9iamVjdHM7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlWZXJiczogU3VydmV5VmVyYnM7XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0V29ya2VyOiBTdXJ2ZXlUZXh0V29ya2VyO1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICAgICAgcHJpdmF0ZSBzYXZlU3VydmV5RnVuY1ZhbHVlOiBhbnk7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBxdWVzdGlvblR5cGVzOiBzdHJpbmdbXTtcclxuICAgICAgICBcclxuICAgICAgICBrb0lzU2hvd0Rlc2lnbmVyOiBhbnk7XHJcbiAgICAgICAga29DYW5EZWxldGVPYmplY3Q6IGFueTtcclxuICAgICAgICBrb09iamVjdHM6IGFueTsga29TZWxlY3RlZE9iamVjdDogYW55O1xyXG4gICAgICAgIGtvU2hvd1NhdmVCdXR0b246IGFueTtcclxuICAgICAgICBzZWxlY3REZXNpZ25lckNsaWNrOiBhbnk7IHNlbGVjdEVkaXRvckNsaWNrOiBhbnk7XHJcbiAgICAgICAgZGVsZXRlT2JqZWN0Q2xpY2s6IGFueTtcclxuICAgICAgICBydW5TdXJ2ZXlDbGljazogYW55OyBlbWJlZGluZ1N1cnZleUNsaWNrOiBhbnk7XHJcbiAgICAgICAgc2F2ZUJ1dHRvbkNsaWNrOiBhbnk7XHJcbiAgICAgICAgZHJhZ2dpbmdRdWVzdGlvbjogYW55OyBjbGlja1F1ZXN0aW9uOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVkRWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVHlwZXMgPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmdldEFsbFR5cGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29DYW5EZWxldGVPYmplY3QgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMua29TaG93U2F2ZUJ1dHRvbiA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB0aGlzLnNhdmVCdXR0b25DbGljayA9IGZ1bmN0aW9uICgpIHsgaWYgKHNlbGYuc2F2ZVN1cnZleUZ1bmMpIHNlbGYuc2F2ZVN1cnZleUZ1bmMoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkT2JqZWN0ID0ga28ub2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRPYmplY3Quc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNlbGVjdGVkT2JqZWN0Q2hhbmdlZChuZXdWYWx1ZSAhPSBudWxsID8gbmV3VmFsdWUudmFsdWUgOiBudWxsKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cyA9IG5ldyBTdXJ2ZXlPYmplY3RzKHRoaXMua29PYmplY3RzLCB0aGlzLmtvU2VsZWN0ZWRPYmplY3QpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWZXJicyA9IG5ldyBTdXJ2ZXlWZXJicygpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvciA9IG5ldyBTdXJ2ZXlPYmplY3RFZGl0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQob3B0aW9ucy5wcm9wZXJ0eSwgb3B0aW9ucy5vYmplY3QsIG9wdGlvbnMubmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc0VkaXRvciA9IG5ldyBTdXJ2ZXlQYWdlc0VkaXRvcigoKSA9PiB7IHNlbGYuYWRkUGFnZSgpOyB9LCAocGFnZTogU3VydmV5LlBhZ2UpID0+IHsgc2VsZi5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChwYWdlKTsgfSxcclxuICAgICAgICAgICAgICAgIChpbmRleEZyb206IG51bWJlciwgaW5kZXhUbzogbnVtYmVyKSA9PiB7IHNlbGYubW92ZVBhZ2UoaW5kZXhGcm9tLCBpbmRleFRvKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcgPSBuZXcgU3VydmV5RW1iZWRpbmdXaW5kb3coKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMua29Jc1Nob3dEZXNpZ25lciA9IGtvLm9ic2VydmFibGUodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0RGVzaWduZXJDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93RGVzaWduZXIoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RFZGl0b3JDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93SnNvbkVkaXRvcigpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnJ1blN1cnZleUNsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLnNob3dMaXZlU3VydmV5KCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMuZW1iZWRpbmdTdXJ2ZXlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93U3VydmV5RW1iZWRpbmcoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5kZWxldGVPYmplY3RDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kZWxldGVDdXJyZW50T2JqZWN0KCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ2dpbmdRdWVzdGlvbiA9IGZ1bmN0aW9uIChxdWVzdGlvblR5cGUsIGUpIHsgc2VsZi5kb0RyYWdnaW5nUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBlKTsgfVxyXG4gICAgICAgICAgICB0aGlzLmNsaWNrUXVlc3Rpb24gPSBmdW5jdGlvbiAocXVlc3Rpb25UeXBlKSB7IHNlbGYuZG9DbGlja1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZSk7IH1cclxuXHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJlZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5LlN1cnZleSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnN1cnZleVZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlZEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmICghZWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IHRlbXBsYXRlRWRpdG9yLmtvLmh0bWw7XHJcbiAgICAgICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBsb2FkU3VydmV5KHN1cnZleUlkOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgU3VydmV5LmR4U3VydmV5U2VydmljZSgpLmxvYWRTdXJ2ZXkoc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi50ZXh0ID0gSlNPTi5zdHJpbmdpZnkocmVzdWx0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGV4dCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMua29Jc1Nob3dEZXNpZ25lcigpKSByZXR1cm4gdGhpcy5nZXRTdXJ2ZXlUZXh0RnJvbURlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmpzb25FZGl0b3IgIT0gbnVsbCA/IHRoaXMuanNvbkVkaXRvci5nZXRWYWx1ZSgpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0V29ya2VyID0gbmV3IFN1cnZleVRleHRXb3JrZXIodmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2hvd0Rlc2lnbmVyKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNldFRleHRWYWx1ZSh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvSXNTaG93RGVzaWduZXIoZmFsc2UpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNhdmVTdXJ2ZXlGdW5jKCkgeyByZXR1cm4gdGhpcy5zYXZlU3VydmV5RnVuY1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBzYXZlU3VydmV5RnVuYyh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2F2ZVN1cnZleUZ1bmNWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2hvd1NhdmVCdXR0b24odmFsdWUgIT0gbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0VGV4dFZhbHVlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuanNvbkVkaXRvciA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2V0VmFsdWUodmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IucmVuZGVyZXIudXBkYXRlRnVsbCh0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5wcm9jZXNzSnNvbih2YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIHZhciBuYW1lID0gU3VydmV5SGVscGVyLmdldE5ld05hbWUodGhpcy5zdXJ2ZXkucGFnZXMsIFwicGFnZVwiKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleVZhbHVlLmFkZE5ld1BhZ2UobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZVRvVUkocGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbW92ZVBhZ2UoaW5kZXhGcm9tOiBudW1iZXIsIGluZGV4VG86IG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LnBhZ2VzW2luZGV4RnJvbV07XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlT2JqZWN0KHBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5wYWdlcy5zcGxpY2UoaW5kZXhUbywgMCwgcGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZVRvVUkocGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkUGFnZVRvVUkocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgdGhpcy5wYWdlc0VkaXRvci5zdXJ2ZXkgPSB0aGlzLnN1cnZleVZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuYWRkUGFnZShwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvblF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLmFkZFF1ZXN0aW9uKHBhZ2UsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25RdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0KHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucmVuZGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZChwcm9wZXJ0eTogU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSwgb2JqOiBhbnksIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIGlzRGVmYXVsdCA9IHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgb2JqW3Byb3BlcnR5Lm5hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5uYW1lID09IFwibmFtZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMubmFtZUNoYW5nZWQob2JqKTtcclxuICAgICAgICAgICAgICAgIGlmIChTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IuY2hhbmdlTmFtZSg8U3VydmV5LlBhZ2U+b2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlLnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNob3dEZXNpZ25lcigpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnRleHRXb3JrZXIuaXNKc29uQ29ycmVjdCkge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJQbGVhc2UgY29ycmVjdCBKU09OIVwiKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMudGV4dFdvcmtlci5zdXJ2ZXkpKTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzU2hvd0Rlc2lnbmVyKHRydWUpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93SnNvbkVkaXRvcigpIHtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFZhbHVlKHRoaXMuZ2V0U3VydmV5VGV4dEZyb21EZXNpZ25lcigpKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmZvY3VzKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc1Nob3dEZXNpZ25lcihmYWxzZSk7IFxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFN1cnZleVRleHRGcm9tRGVzaWduZXIoKSB7XHJcbiAgICAgICAgICAgIHZhciBqc29uID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuc3VydmV5KTtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeShqc29uLCBudWxsLCAxKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdENoYW5nZWQob2JqOiBTdXJ2ZXkuQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgY2FuRGVsZXRlT2JqZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iuc2VsZWN0ZWRPYmplY3QgPSBvYmo7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmVyYnMub2JqID0gb2JqO1xyXG4gICAgICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XHJcbiAgICAgICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xyXG4gICAgICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0ob2JqKTtcclxuICAgICAgICAgICAgICAgIGNhbkRlbGV0ZU9iamVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRoaXMuc3VydmV5W1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvQ2FuRGVsZXRlT2JqZWN0KGNhbkRlbGV0ZU9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXBwbHlCaW5kaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBrby5jbGVhbk5vZGUodGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNcIik7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvciA9IGFjZS5lZGl0KFwic3VydmV5anNFZGl0b3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc0V4YW1wbGVcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleUpTT041KCkucGFyc2UoU3VydmV5RWRpdG9yLmRlZmF1bHROZXdTdXJ2ZXlUZXh0KSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUubW9kZSA9IFwiZGVzaWduZXJcIjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5yZW5kZXIodGhpcy5zdXJ2ZXlqcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluaXRKc29uRWRpdG9yKCk7XHJcbiAgICAgICAgICAgIFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIgPSB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5kb2MuZ2V0TmV3TGluZUNoYXJhY3RlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGluaXRKc29uRWRpdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5zZXRUaGVtZShcImFjZS90aGVtZS9tb25va2FpXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvanNvblwiKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFNob3dQcmludE1hcmdpbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5nZXRTZXNzaW9uKCkub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkpzb25FZGl0b3JDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IuZ2V0U2Vzc2lvbigpLnNldFVzZVdvcmtlcih0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpbml0U3VydmV5KGpzb246IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkoanNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm1vZGUgPSBcImRlc2lnbmVyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSh0aGlzLnN1cnZleS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmVyYnMuc3VydmV5ID0gdGhpcy5zdXJ2ZXk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChzZW5kZXJbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZShzZW5kZXIuY3VycmVudFBhZ2UpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vblF1ZXN0aW9uQWRkZWQuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5vblF1ZXN0aW9uQWRkZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm9uUXVlc3Rpb25SZW1vdmVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvblJlbW92ZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHRpbWVvdXRJZDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBvbkpzb25FZGl0b3JDaGFuZ2VkKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRJZCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xyXG4gICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc0pzb24oc2VsZi50ZXh0KTtcclxuICAgICAgICAgICAgICAgIH0sIFN1cnZleUVkaXRvci51cGRhdGVUZXh0VGltZW91dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwcm9jZXNzSnNvbih0ZXh0OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5zZXRBbm5vdGF0aW9ucyh0aGlzLmNyZWF0ZUFubm90YXRpb25zKHRleHQsIHRoaXMudGV4dFdvcmtlci5lcnJvcnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb0RyYWdnaW5nUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIGUpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZSh0aGlzLnN1cnZleS5nZXRBbGxRdWVzdGlvbnMoKSwgXCJxdWVzdGlvblwiKTtcclxuICAgICAgICAgICAgbmV3IERyYWdEcm9wSGVscGVyKDxTdXJ2ZXkuSVN1cnZleT50aGlzLnN1cnZleSkuc3RhcnREcmFnTmV3UXVlc3Rpb24oZSwgcXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb0NsaWNrUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZSh0aGlzLnN1cnZleS5nZXRBbGxRdWVzdGlvbnMoKSwgXCJxdWVzdGlvblwiKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVtcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgICAgIHBhZ2UuYWRkUXVlc3Rpb24ocXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkZWxldGVDdXJyZW50T2JqZWN0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdCh0aGlzLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZGVsZXRlT2JqZWN0KG9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5yZW1vdmVPYmplY3Qob2JqKTtcclxuICAgICAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopO1xyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbW92ZVBhZ2Uob2JqKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IucmVtb3ZlUGFnZShvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLnJlbW92ZVF1ZXN0aW9uKG9iaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93TGl2ZVN1cnZleSgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cnZleWpzRXhhbXBsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIganNvbiA9IHRoaXMuZ2V0U3VydmV5SlNPTigpO1xyXG4gICAgICAgICAgICBpZiAoanNvbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5TdXJ2ZXkoanNvbik7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBzdXJ2ZXkub25Db21wbGV0ZS5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSkgPT4geyBzZWxmLnN1cnZleWpzRXhhbXBsZS5pbm5lckhUTUwgPSBcIlN1cnZleSBSZXN1bHQ6IFwiICsgbmV3IFN1cnZleUpTT041KCkuc3RyaW5naWZ5KHN1cnZleS5kYXRhKTsgfSk7XHJcbiAgICAgICAgICAgICAgICBzdXJ2ZXkucmVuZGVyKHRoaXMuc3VydmV5anNFeGFtcGxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlLmlubmVySFRNTCA9IFwiUGxlYXNlIGNvcnJlY3QgSlNPTiFcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNob3dTdXJ2ZXlFbWJlZGluZygpIHtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSB0aGlzLmdldFN1cnZleUpTT04oKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5qc29uID0ganNvbjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5zdXJ2ZXlJZCA9IHRoaXMuc3VydmV5SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc3VydmV5UG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmcuc2hvdygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFN1cnZleUpTT04oKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMua29Jc1Nob3dEZXNpZ25lcigpKSAgcmV0dXJuIG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLnN1cnZleSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHRXb3JrZXIuaXNKc29uQ29ycmVjdCkgcmV0dXJuIG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLnRleHRXb3JrZXIuc3VydmV5KTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlQW5ub3RhdGlvbnModGV4dDogc3RyaW5nLCBlcnJvcnM6IGFueVtdKTogQWNlQWpheC5Bbm5vdGF0aW9uW10ge1xyXG4gICAgICAgICAgICB2YXIgYW5ub3RhdGlvbnMgPSBuZXcgQXJyYXk8QWNlQWpheC5Bbm5vdGF0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gZXJyb3JzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIGFubm90YXRpb246IEFjZUFqYXguQW5ub3RhdGlvbiA9IHsgcm93OiBlcnJvci5wb3NpdGlvbi5zdGFydC5yb3csIGNvbHVtbjogZXJyb3IucG9zaXRpb24uc3RhcnQuY29sdW1uLCB0ZXh0OiBlcnJvci50ZXh0LCB0eXBlOiBcImVycm9yXCIgfTtcclxuICAgICAgICAgICAgICAgIGFubm90YXRpb25zLnB1c2goYW5ub3RhdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGFubm90YXRpb25zO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBuZXcgU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCgpLnJlcGxhY2VUZXh0KHRlbXBsYXRlX3BhZ2UuaHRtbCwgXCJwYWdlXCIpO1xyXG4gICAgbmV3IFN1cnZleS5TdXJ2ZXlUZW1wbGF0ZVRleHQoKS5yZXBsYWNlVGV4dCh0ZW1wbGF0ZV9xdWVzdGlvbi5odG1sLCBcInF1ZXN0aW9uXCIpO1xyXG5cclxuICAgIFN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgdGhpcy5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG5cclxuICAgIH1cclxuICAgIFN1cnZleS5TdXJ2ZXkucHJvdG90eXBlW1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXSA9IGZ1bmN0aW9uKHZhbHVlOiBTdXJ2ZXkuUXVlc3Rpb24pIHtcclxuICAgICAgICBpZiAodmFsdWUgPT0gdGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWUpIHJldHVybjtcclxuICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZTtcclxuICAgICAgICB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIGlmIChvbGRWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIG9sZFZhbHVlW1wib25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZFwiXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5zZWxlY3RlZFF1ZXN0aW9uVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0oKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkLmZpcmUodGhpcywgeyAnb2xkU2VsZWN0ZWRRdWVzdGlvbic6IG9sZFZhbHVlLCAnbmV3U2VsZWN0ZWRRdWVzdGlvbic6IHZhbHVlIH0pO1xyXG4gICAgfVxyXG4gICAgU3VydmV5LlBhZ2UucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kcmFnRW50ZXJDb3VudGVyID0gMDtcclxuICAgICAgICB0aGlzLmtvRHJhZ2dpbmcgPSBrby5vYnNlcnZhYmxlKC0xKTtcclxuICAgICAgICB0aGlzLmtvRHJhZ2dpbmcuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBpZiAobmV3VmFsdWUgPCAwKSBzZWxmLmRyYWdFbnRlckNvdW50ZXIgPSAwOyB9KTtcclxuICAgICAgICB0aGlzLmRyYWdFbnRlciA9IGZ1bmN0aW9uIChlKSB7IGUucHJldmVudERlZmF1bHQoKTsgc2VsZi5kcmFnRW50ZXJDb3VudGVyKys7IHNlbGYuZG9EcmFnRW50ZXIoZSk7IH07XHJcbiAgICAgICAgdGhpcy5kcmFnTGVhdmUgPSBmdW5jdGlvbiAoZSkgeyBzZWxmLmRyYWdFbnRlckNvdW50ZXItLTsgaWYgKHNlbGYuZHJhZ0VudGVyQ291bnRlciA9PT0gMCkgc2VsZi5rb0RyYWdnaW5nKC0xKTsgfTtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kb0Ryb3AoZSk7IH07XHJcbiAgICB9XHJcbiAgICBTdXJ2ZXkuUGFnZS5wcm90b3R5cGVbXCJkb0Ryb3BcIl0gPSBmdW5jdGlvbiAoZSkge1xyXG4gICAgICAgIG5ldyBEcmFnRHJvcEhlbHBlcih0aGlzLmRhdGEpLmRvRHJvcChlKTtcclxuICAgIH1cclxuICAgIFN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJhZ0VudGVyXCJdID0gZnVuY3Rpb24oZSkge1xyXG4gICAgICAgIGlmICh0aGlzLnF1ZXN0aW9ucy5sZW5ndGggPiAwIHx8IHRoaXMua29EcmFnZ2luZygpID4gMCkgcmV0dXJuO1xyXG4gICAgICAgIGlmIChuZXcgRHJhZ0Ryb3BIZWxwZXIodGhpcy5kYXRhKS5pc1N1cnZleURyYWdnaW5nKGUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29EcmFnZ2luZyh0aGlzLnF1ZXN0aW9ucy5sZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBTdXJ2ZXkuUXVlc3Rpb24ucHJvdG90eXBlW1wib25DcmVhdGluZ1wiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgdGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlID0gbnVsbDtcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlID09IG51bGwpIHRoaXMuZHJhZ0Ryb3BIZWxwZXJWYWx1ZSA9IG5ldyBEcmFnRHJvcEhlbHBlcih0aGlzLmRhdGEpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmRyYWdPdmVyID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmRvRHJhZ0Ryb3BPdmVyKGUsIHNlbGYpOyB9XHJcbiAgICAgICAgdGhpcy5kcmFnRHJvcCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5kb0Ryb3AoZSwgc2VsZik7IH1cclxuICAgICAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0Ryb3BIZWxwZXIoKS5zdGFydERyYWdRdWVzdGlvbihlLCBzZWxmLm5hbWUpOyB9XHJcbiAgICAgICAgdGhpcy5rb0lzU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICB0aGlzLmtvT25DbGljayA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgaWYgKHNlbGYuZGF0YSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHNlbGYuZGF0YVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0odGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgU3VydmV5LlF1ZXN0aW9uLnByb3RvdHlwZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICBpZiAodGhpcy5kYXRhID09IG51bGwpIHJldHVybjtcclxuICAgICAgICB0aGlzLmtvSXNTZWxlY3RlZCh0aGlzLmRhdGFbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0gPT0gdGhpcyk7XHJcbiAgICB9XHJcbn1cclxuIiwiLy8gVGhpcyBmaWxlIGlzIGJhc2VkIG9uIEpTT041LCBodHRwOi8vanNvbjUub3JnL1xyXG4vLyBUaGUgbW9kaWZpY2F0aW9uIGZvciBnZXR0aW5nIG9iamVjdCBhbmQgcHJvcGVydGllcyBsb2NhdGlvbiAnYXQnIHdlcmUgbWFkZW4uXHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlKU09ONSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBwb3NpdGlvbk5hbWUgPSBcInBvc1wiO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGVzY2FwZWUgPSB7XHJcbiAgICAgICAgICAgIFwiJ1wiOiBcIidcIixcclxuICAgICAgICAgICAgJ1wiJzogJ1wiJyxcclxuICAgICAgICAgICAgJ1xcXFwnOiAnXFxcXCcsXHJcbiAgICAgICAgICAgICcvJzogJy8nLFxyXG4gICAgICAgICAgICAnXFxuJzogJycsICAgICAgIC8vIFJlcGxhY2UgZXNjYXBlZCBuZXdsaW5lcyBpbiBzdHJpbmdzIHcvIGVtcHR5IHN0cmluZ1xyXG4gICAgICAgICAgICBiOiAnXFxiJyxcclxuICAgICAgICAgICAgZjogJ1xcZicsXHJcbiAgICAgICAgICAgIG46ICdcXG4nLFxyXG4gICAgICAgICAgICByOiAnXFxyJyxcclxuICAgICAgICAgICAgdDogJ1xcdCdcclxuICAgICAgICB9O1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHdzID0gW1xyXG4gICAgICAgICAgICAnICcsXHJcbiAgICAgICAgICAgICdcXHQnLFxyXG4gICAgICAgICAgICAnXFxyJyxcclxuICAgICAgICAgICAgJ1xcbicsXHJcbiAgICAgICAgICAgICdcXHYnLFxyXG4gICAgICAgICAgICAnXFxmJyxcclxuICAgICAgICAgICAgJ1xceEEwJyxcclxuICAgICAgICAgICAgJ1xcdUZFRkYnXHJcbiAgICAgICAgXTtcclxuICAgICAgICBwcml2YXRlIGVuZEF0OiBudW1iZXI7XHJcbiAgICAgICAgcHJpdmF0ZSBhdDogbnVtYmVyOyAgICAgLy8gVGhlIGluZGV4IG9mIHRoZSBjdXJyZW50IGNoYXJhY3RlclxyXG4gICAgICAgIHByaXZhdGUgY2g6IGFueTsgICAgIC8vIFRoZSBjdXJyZW50IGNoYXJhY3RlclxyXG4gICAgICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgcGFyc2VUeXBlOiBudW1iZXI7IC8vIDAgLSBzdGFkYXJkLCAxIC0gZ2V0IGluZm9ybWF0aW9uIGFib3V0IG9iamVjdHMsIDIgLSBnZXQgaW5mb3JtYXRpb24gYWJvdXQgYWxsIHByb3BlcnRpZXNcclxuICAgICAgICBjb25zdHJ1Y3RvcihwYXJzZVR5cGU6IG51bWJlciA9IDApIHtcclxuICAgICAgICAgICAgdGhpcy5wYXJzZVR5cGUgPSBwYXJzZVR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBwYXJzZShzb3VyY2U6IGFueSwgcmV2aXZlcjogYW55ID0gbnVsbCwgc3RhcnRGcm9tOiBudW1iZXIgPSAwLCBlbmRBdDogbnVtYmVyID0gLTEpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0O1xyXG5cclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gU3RyaW5nKHNvdXJjZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXQgPSBzdGFydEZyb207XHJcbiAgICAgICAgICAgIHRoaXMuZW5kQXQgPSBlbmRBdDtcclxuICAgICAgICAgICAgdGhpcy5jaCA9ICcgJztcclxuICAgICAgICAgICAgcmVzdWx0ID0gdGhpcy52YWx1ZSgpO1xyXG4gICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiU3ludGF4IGVycm9yXCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBJZiB0aGVyZSBpcyBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHJlY3Vyc2l2ZWx5IHdhbGsgdGhlIG5ldyBzdHJ1Y3R1cmUsXHJcbiAgICAgICAgICAgIC8vIHBhc3NpbmcgZWFjaCBuYW1lL3ZhbHVlIHBhaXIgdG8gdGhlIHJldml2ZXIgZnVuY3Rpb24gZm9yIHBvc3NpYmxlXHJcbiAgICAgICAgICAgIC8vIHRyYW5zZm9ybWF0aW9uLCBzdGFydGluZyB3aXRoIGEgdGVtcG9yYXJ5IHJvb3Qgb2JqZWN0IHRoYXQgaG9sZHMgdGhlIHJlc3VsdFxyXG4gICAgICAgICAgICAvLyBpbiBhbiBlbXB0eSBrZXkuIElmIHRoZXJlIGlzIG5vdCBhIHJldml2ZXIgZnVuY3Rpb24sIHdlIHNpbXBseSByZXR1cm4gdGhlXHJcbiAgICAgICAgICAgIC8vIHJlc3VsdC5cclxuXHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgcmV2aXZlciA9PT0gJ2Z1bmN0aW9uJyA/IChmdW5jdGlvbiB3YWxrKGhvbGRlciwga2V5KSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaywgdiwgdmFsdWUgPSBob2xkZXJba2V5XTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yIChrIGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIGspKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2ID0gd2Fsayh2YWx1ZSwgayk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodiAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVba10gPSB2O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkZWxldGUgdmFsdWVba107XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmV2aXZlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gKHsgJyc6IHJlc3VsdCB9LCAnJykpIDogcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGVycm9yKG06IHN0cmluZykge1xyXG4gICAgICAgICAgICAvLyBDYWxsIGVycm9yIHdoZW4gc29tZXRoaW5nIGlzIHdyb25nLlxyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBuZXcgU3ludGF4RXJyb3IoKTtcclxuICAgICAgICAgICAgZXJyb3IubWVzc2FnZSA9IG07XHJcbiAgICAgICAgICAgIGVycm9yW1wiYXRcIl0gPSB0aGlzLmF0O1xyXG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBuZXh0KGM6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgLy8gSWYgYSBjIHBhcmFtZXRlciBpcyBwcm92aWRlZCwgdmVyaWZ5IHRoYXQgaXQgbWF0Y2hlcyB0aGUgY3VycmVudCBjaGFyYWN0ZXIuXHJcbiAgICAgICAgICAgIGlmIChjICYmIGMgIT09IHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJFeHBlY3RlZCAnXCIgKyBjICsgXCInIGluc3RlYWQgb2YgJ1wiICsgdGhpcy5jaCArIFwiJ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRoaXMubmV4dCBjaGFyYWN0ZXIuIFdoZW4gdGhlcmUgYXJlIG5vIG1vcmUgY2hhcmFjdGVycyxcclxuICAgICAgICAgICAgLy8gcmV0dXJuIHRoZSBlbXB0eSBzdHJpbmcuXHJcbiAgICAgICAgICAgIHRoaXMuY2ggPSB0aGlzLmNoYXJ0QXQoKTtcclxuICAgICAgICAgICAgdGhpcy5hdCArPSAxO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwZWVrKCkge1xyXG4gICAgICAgICAgICAvLyBHZXQgdGhlIHRoaXMubmV4dCBjaGFyYWN0ZXIgd2l0aG91dCBjb25zdW1pbmcgaXQgb3JcclxuICAgICAgICAgICAgLy8gYXNzaWduaW5nIGl0IHRvIHRoZSB0aGlzLmNoIHZhcmFpYmxlLlxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jaGFydEF0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhcnRBdCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZW5kQXQgPiAtMSAmJiB0aGlzLmF0ID49IHRoaXMuZW5kQXQpIHJldHVybiAnJztcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dC5jaGFyQXQodGhpcy5hdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaWRlbnRpZmllcigpIHtcclxuICAgICAgICAgICAgLy8gUGFyc2UgYW4gaWRlbnRpZmllci4gTm9ybWFsbHksIHJlc2VydmVkIHdvcmRzIGFyZSBkaXNhbGxvd2VkIGhlcmUsIGJ1dCB3ZVxyXG4gICAgICAgICAgICAvLyBvbmx5IHVzZSB0aGlzIGZvciB1bnF1b3RlZCBvYmplY3Qga2V5cywgd2hlcmUgcmVzZXJ2ZWQgd29yZHMgYXJlIGFsbG93ZWQsXHJcbiAgICAgICAgICAgIC8vIHNvIHdlIGRvbid0IGNoZWNrIGZvciB0aG9zZSBoZXJlLiBSZWZlcmVuY2VzOlxyXG4gICAgICAgICAgICAvLyAtIGh0dHA6Ly9lczUuZ2l0aHViLmNvbS8jeDcuNlxyXG4gICAgICAgICAgICAvLyAtIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuL0NvcmVfSmF2YVNjcmlwdF8xLjVfR3VpZGUvQ29yZV9MYW5ndWFnZV9GZWF0dXJlcyNWYXJpYWJsZXNcclxuICAgICAgICAgICAgLy8gLSBodHRwOi8vZG9jc3RvcmUubWlrLnVhL29yZWxseS93ZWJwcm9nL2pzY3JpcHQvY2gwMl8wNy5odG1cclxuICAgICAgICAgICAgLy8gVE9ETyBJZGVudGlmaWVycyBjYW4gaGF2ZSBVbmljb2RlIFwibGV0dGVyc1wiIGluIHRoZW07IGFkZCBzdXBwb3J0IGZvciB0aG9zZS5cclxuICAgICAgICAgICAgdmFyIGtleSA9IHRoaXMuY2g7XHJcblxyXG4gICAgICAgICAgICAvLyBJZGVudGlmaWVycyBtdXN0IHN0YXJ0IHdpdGggYSBsZXR0ZXIsIF8gb3IgJC5cclxuICAgICAgICAgICAgaWYgKCh0aGlzLmNoICE9PSAnXycgJiYgdGhpcy5jaCAhPT0gJyQnKSAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2ggPCAnYScgfHwgdGhpcy5jaCA+ICd6JykgJiZcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoIDwgJ0EnIHx8IHRoaXMuY2ggPiAnWicpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIGlkZW50aWZpZXJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIFN1YnNlcXVlbnQgY2hhcmFjdGVycyBjYW4gY29udGFpbiBkaWdpdHMuXHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLm5leHQoKSAmJiAoXHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoID09PSAnXycgfHwgdGhpcy5jaCA9PT0gJyQnIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA+PSAnYScgJiYgdGhpcy5jaCA8PSAneicpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA+PSAnQScgJiYgdGhpcy5jaCA8PSAnWicpIHx8XHJcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpKSkge1xyXG4gICAgICAgICAgICAgICAga2V5ICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBrZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbnVtYmVyKCkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGFyc2UgYSBudW1iZXIgdmFsdWUuXHJcblxyXG4gICAgICAgICAgICB2YXIgbnVtYmVyLFxyXG4gICAgICAgICAgICAgICAgc2lnbiA9ICcnLFxyXG4gICAgICAgICAgICAgICAgc3RyaW5nID0gJycsXHJcbiAgICAgICAgICAgICAgICBiYXNlID0gMTA7XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy0nIHx8IHRoaXMuY2ggPT09ICcrJykge1xyXG4gICAgICAgICAgICAgICAgc2lnbiA9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQodGhpcy5jaCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIHN1cHBvcnQgZm9yIEluZmluaXR5IChjb3VsZCB0d2VhayB0byBhbGxvdyBvdGhlciB3b3Jkcyk6XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnSScpIHtcclxuICAgICAgICAgICAgICAgIG51bWJlciA9IHRoaXMud29yZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBudW1iZXIgIT09ICdudW1iZXInIHx8IGlzTmFOKG51bWJlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdVbmV4cGVjdGVkIHdvcmQgZm9yIG51bWJlcicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIChzaWduID09PSAnLScpID8gLW51bWJlciA6IG51bWJlcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc3VwcG9ydCBmb3IgTmFOXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnTicpIHtcclxuICAgICAgICAgICAgICAgIG51bWJlciA9IHRoaXMud29yZCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFpc05hTihudW1iZXIpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcignZXhwZWN0ZWQgd29yZCB0byBiZSBOYU4nKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vIGlnbm9yZSBzaWduIGFzIC1OYU4gYWxzbyBpcyBOYU5cclxuICAgICAgICAgICAgICAgIHJldHVybiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnMCcpIHtcclxuICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3gnIHx8IHRoaXMuY2ggPT09ICdYJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJhc2UgPSAxNjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdPY3RhbCBsaXRlcmFsJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAoYmFzZSkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAxMDpcclxuICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSAnLic7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLm5leHQoKSAmJiB0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdlJyB8fCB0aGlzLmNoID09PSAnRScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy0nIHx8IHRoaXMuY2ggPT09ICcrJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDE2OlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JyB8fCB0aGlzLmNoID49ICdBJyAmJiB0aGlzLmNoIDw9ICdGJyB8fCB0aGlzLmNoID49ICdhJyAmJiB0aGlzLmNoIDw9ICdmJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoc2lnbiA9PT0gJy0nKSB7XHJcbiAgICAgICAgICAgICAgICBudW1iZXIgPSAtc3RyaW5nO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gK3N0cmluZztcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShudW1iZXIpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIG51bWJlclwiKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudW1iZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzdHJpbmcoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXJzZSBhIHN0cmluZyB2YWx1ZS5cclxuXHJcbiAgICAgICAgICAgIHZhciBoZXgsXHJcbiAgICAgICAgICAgICAgICBpLFxyXG4gICAgICAgICAgICAgICAgc3RyaW5nID0gJycsXHJcbiAgICAgICAgICAgICAgICBkZWxpbSwgICAgICAvLyBkb3VibGUgcXVvdGUgb3Igc2luZ2xlIHF1b3RlXHJcbiAgICAgICAgICAgICAgICB1ZmZmZjtcclxuXHJcbiAgICAgICAgICAgIC8vIFdoZW4gcGFyc2luZyBmb3Igc3RyaW5nIHZhbHVlcywgd2UgbXVzdCBsb29rIGZvciAnIG9yIFwiIGFuZCBcXCBjaGFyYWN0ZXJzLlxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcIicgfHwgdGhpcy5jaCA9PT0gXCInXCIpIHtcclxuICAgICAgICAgICAgICAgIGRlbGltID0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLm5leHQoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSBkZWxpbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN0cmluZztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXFxcJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd1Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdWZmZmYgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IDQ7IGkgKz0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGhleCA9IHBhcnNlSW50KHRoaXMubmV4dCgpLCAxNik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCFpc0Zpbml0ZShoZXgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IHVmZmZmICogMTYgKyBoZXg7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gU3RyaW5nLmZyb21DaGFyQ29kZSh1ZmZmZik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xccicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBlZWsoKSA9PT0gJ1xcbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgU3VydmV5SlNPTjUuZXNjYXBlZVt0aGlzLmNoXSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSBTdXJ2ZXlKU09ONS5lc2NhcGVlW3RoaXMuY2hdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICdcXG4nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHVuZXNjYXBlZCBuZXdsaW5lcyBhcmUgaW52YWxpZDsgc2VlOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBodHRwczovL2dpdGh1Yi5jb20vYXNlZW1rL2pzb241L2lzc3Vlcy8yNFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUT0RPIHRoaXMgZmVlbHMgc3BlY2lhbC1jYXNlZDsgYXJlIHRoZXJlIG90aGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGludmFsaWQgdW5lc2NhcGVkIGNoYXJzP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBzdHJpbmdcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaW5saW5lQ29tbWVudCgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFNraXAgYW4gaW5saW5lIGNvbW1lbnQsIGFzc3VtaW5nIHRoaXMgaXMgb25lLiBUaGUgY3VycmVudCBjaGFyYWN0ZXIgc2hvdWxkXHJcbiAgICAgICAgICAgIC8vIGJlIHRoZSBzZWNvbmQgLyBjaGFyYWN0ZXIgaW4gdGhlIC8vIHBhaXIgdGhhdCBiZWdpbnMgdGhpcyBpbmxpbmUgY29tbWVudC5cclxuICAgICAgICAgICAgLy8gVG8gZmluaXNoIHRoZSBpbmxpbmUgY29tbWVudCwgd2UgbG9vayBmb3IgYSBuZXdsaW5lIG9yIHRoZSBlbmQgb2YgdGhlIHRleHQuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9yKFwiTm90IGFuIGlubGluZSBjb21tZW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnXFxuJyB8fCB0aGlzLmNoID09PSAnXFxyJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSB3aGlsZSAodGhpcy5jaCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYmxvY2tDb21tZW50KCkge1xyXG5cclxuICAgICAgICAgICAgLy8gU2tpcCBhIGJsb2NrIGNvbW1lbnQsIGFzc3VtaW5nIHRoaXMgaXMgb25lLiBUaGUgY3VycmVudCBjaGFyYWN0ZXIgc2hvdWxkIGJlXHJcbiAgICAgICAgICAgIC8vIHRoZSAqIGNoYXJhY3RlciBpbiB0aGUgLyogcGFpciB0aGF0IGJlZ2lucyB0aGlzIGJsb2NrIGNvbW1lbnQuXHJcbiAgICAgICAgICAgIC8vIFRvIGZpbmlzaCB0aGUgYmxvY2sgY29tbWVudCwgd2UgbG9vayBmb3IgYW4gZW5kaW5nICovIHBhaXIgb2YgY2hhcmFjdGVycyxcclxuICAgICAgICAgICAgLy8gYnV0IHdlIGFsc28gd2F0Y2ggZm9yIHRoZSBlbmQgb2YgdGV4dCBiZWZvcmUgdGhlIGNvbW1lbnQgaXMgdGVybWluYXRlZC5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnKicpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYSBibG9jayBjb21tZW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBkbyB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID09PSAnKicpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJyonKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLycpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLmNoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJVbnRlcm1pbmF0ZWQgYmxvY2sgY29tbWVudFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjb21tZW50KCkge1xyXG5cclxuICAgICAgICAgICAgLy8gU2tpcCBhIGNvbW1lbnQsIHdoZXRoZXIgaW5saW5lIG9yIGJsb2NrLWxldmVsLCBhc3N1bWluZyB0aGlzIGlzIG9uZS5cclxuICAgICAgICAgICAgLy8gQ29tbWVudHMgYWx3YXlzIGJlZ2luIHdpdGggYSAvIGNoYXJhY3Rlci5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYSBjb21tZW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB0aGlzLm5leHQoJy8nKTtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaW5saW5lQ29tbWVudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHRoaXMuY2ggPT09ICcqJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5ibG9ja0NvbW1lbnQoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJVbnJlY29nbml6ZWQgY29tbWVudFwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHdoaXRlKCkge1xyXG5cclxuICAgICAgICAgICAgLy8gU2tpcCB3aGl0ZXNwYWNlIGFuZCBjb21tZW50cy5cclxuICAgICAgICAgICAgLy8gTm90ZSB0aGF0IHdlJ3JlIGRldGVjdGluZyBjb21tZW50cyBieSBvbmx5IGEgc2luZ2xlIC8gY2hhcmFjdGVyLlxyXG4gICAgICAgICAgICAvLyBUaGlzIHdvcmtzIHNpbmNlIHJlZ3VsYXIgZXhwcmVzc2lvbnMgYXJlIG5vdCB2YWxpZCBKU09OKDUpLCBidXQgdGhpcyB3aWxsXHJcbiAgICAgICAgICAgIC8vIGJyZWFrIGlmIHRoZXJlIGFyZSBvdGhlciB2YWxpZCB2YWx1ZXMgdGhhdCBiZWdpbiB3aXRoIGEgLyBjaGFyYWN0ZXIhXHJcblxyXG4gICAgICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmIChTdXJ2ZXlKU09ONS53cy5pbmRleE9mKHRoaXMuY2gpID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgd29yZCgpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgLy8gdHJ1ZSwgZmFsc2UsIG9yIG51bGwuXHJcblxyXG4gICAgICAgICAgICBzd2l0Y2ggKHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ3QnOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgncicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnZic6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdmJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdhJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdzJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnbic6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCduJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd1Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdsJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdJJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ0knKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2YnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2knKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2knKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3QnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3knKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gSW5maW5pdHk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdOJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ04nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2EnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ04nKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gTmFOO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJVbmV4cGVjdGVkICdcIiArIHRoaXMuY2ggKyBcIidcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXJyYXkoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXJzZSBhbiBhcnJheSB2YWx1ZS5cclxuXHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdbJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdbJyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnXScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCddJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhcnJheTsgICAvLyBQb3RlbnRpYWxseSBlbXB0eSBhcnJheVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAvLyBFUzUgYWxsb3dzIG9taXR0aW5nIGVsZW1lbnRzIGluIGFycmF5cywgZS5nLiBbLF0gYW5kXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gWyxudWxsXS4gV2UgZG9uJ3QgYWxsb3cgdGhpcyBpbiBKU09ONS5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJywnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJNaXNzaW5nIGFycmF5IGVsZW1lbnRcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaCh0aGlzLnZhbHVlKCkpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gSWYgdGhlcmUncyBubyBjb21tYSBhZnRlciB0aGlzIHZhbHVlLCB0aGlzIG5lZWRzIHRvXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gYmUgdGhlIGVuZCBvZiB0aGUgYXJyYXkuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcsJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ10nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJywnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBhcnJheVwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvYmplY3QoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXJzZSBhbiBvYmplY3QgdmFsdWUuXHJcblxyXG4gICAgICAgICAgICB2YXIga2V5LFxyXG4gICAgICAgICAgICAgICAgc3RhcnQsXHJcbiAgICAgICAgICAgICAgICBpc0ZpcnN0UHJvcGVydHkgPSB0cnVlLFxyXG4gICAgICAgICAgICAgICAgb2JqZWN0ID0ge307XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDApIHtcclxuICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdID0geyBzdGFydDogdGhpcy5hdCAtIDEgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3snKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3snKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XHJcbiAgICAgICAgICAgICAgICB3aGlsZSAodGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnfScpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0uZW5kID0gc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd9Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7ICAgLy8gUG90ZW50aWFsbHkgZW1wdHkgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvLyBLZXlzIGNhbiBiZSB1bnF1b3RlZC4gSWYgdGhleSBhcmUsIHRoZXkgbmVlZCB0byBiZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHZhbGlkIEpTIGlkZW50aWZpZXJzLlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnXCInIHx8IHRoaXMuY2ggPT09IFwiJ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGtleSA9IHRoaXMuc3RyaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5pZGVudGlmaWVyKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldID0geyBzdGFydDogc3RhcnQsIHZhbHVlU3RhcnQ6IHRoaXMuYXQgfTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCc6Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0W2tleV0gPSB0aGlzLnZhbHVlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdGFydCA9IHRoaXMuYXQgLSAxO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kID0gc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0uZW5kID0gc3RhcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGNvbW1hIGFmdGVyIHRoaXMgcGFpciwgdGhpcyBuZWVkcyB0byBiZVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIHRoZSBlbmQgb2YgdGhlIG9iamVjdC5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJywnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0uZW5kLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0uZW5kID0gdGhpcy5hdCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd9Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmplY3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhcnNlVHlwZSA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmlyc3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJywnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgaXNGaXJzdFByb3BlcnR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIkJhZCBvYmplY3RcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdmFsdWUoKTogYW55IHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGEgSlNPTiB2YWx1ZS4gSXQgY291bGQgYmUgYW4gb2JqZWN0LCBhbiBhcnJheSwgYSBzdHJpbmcsIGEgbnVtYmVyLFxyXG4gICAgICAgICAgICAvLyBvciBhIHdvcmQuXHJcblxyXG4gICAgICAgICAgICB0aGlzLndoaXRlKCk7XHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAneyc6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMub2JqZWN0KCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdbJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5hcnJheSgpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnXCInOlxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIidcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5zdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJy0nOlxyXG4gICAgICAgICAgICAgICAgY2FzZSAnKyc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICcuJzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5udW1iZXIoKTtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknID8gdGhpcy5udW1iZXIoKSA6IHRoaXMud29yZCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIHJlcGxhY2VyOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpbmRlbnRTdHI6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIG9ialN0YWNrO1xyXG5cclxuICAgICAgICBwdWJsaWMgc3RyaW5naWZ5KG9iajogYW55LCByZXBsYWNlcjogYW55ID0gbnVsbCwgc3BhY2U6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHJlcGxhY2VyICYmICh0eXBlb2YgKHJlcGxhY2VyKSAhPT0gXCJmdW5jdGlvblwiICYmICF0aGlzLmlzQXJyYXkocmVwbGFjZXIpKSkge1xyXG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZXBsYWNlciBtdXN0IGJlIGEgZnVuY3Rpb24gb3IgYW4gYXJyYXknKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlcGxhY2VyID0gcmVwbGFjZXI7XHJcbiAgICAgICAgICAgIHRoaXMuaW5kZW50U3RyID0gdGhpcy5nZXRJbmRlbnQoc3BhY2UpO1xyXG4gICAgICAgICAgICB0aGlzLm9ialN0YWNrID0gW107XHJcbiAgICAgICAgICAgIC8vIHNwZWNpYWwgY2FzZS4uLndoZW4gdW5kZWZpbmVkIGlzIHVzZWQgaW5zaWRlIG9mXHJcbiAgICAgICAgICAgIC8vIGEgY29tcG91bmQgb2JqZWN0L2FycmF5LCByZXR1cm4gbnVsbC5cclxuICAgICAgICAgICAgLy8gYnV0IHdoZW4gdG9wLWxldmVsLCByZXR1cm4gdW5kZWZpbmVkXHJcbiAgICAgICAgICAgIHZhciB0b3BMZXZlbEhvbGRlciA9IHsgXCJcIjogb2JqIH07XHJcbiAgICAgICAgICAgIGlmIChvYmogPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKHRvcExldmVsSG9sZGVyLCAnJywgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuaW50ZXJuYWxTdHJpbmdpZnkodG9wTGV2ZWxIb2xkZXIsICcnLCB0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRJbmRlbnQoc3BhY2U6IGFueSk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChzcGFjZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBzcGFjZSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzcGFjZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIHNwYWNlID09PSBcIm51bWJlclwiICYmIHNwYWNlID49IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5tYWtlSW5kZW50KFwiIFwiLCBzcGFjZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkKGhvbGRlcjogYW55LCBrZXk6IGFueSwgaXNUb3BMZXZlbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBob2xkZXJba2V5XTtcclxuXHJcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlIHdpdGggaXRzIHRvSlNPTiB2YWx1ZSBmaXJzdCwgaWYgcG9zc2libGVcclxuICAgICAgICAgICAgaWYgKHZhbHVlICYmIHZhbHVlLnRvSlNPTiAmJiB0eXBlb2YgdmFsdWUudG9KU09OID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9KU09OKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZSB1c2VyLXN1cHBsaWVkIHJlcGxhY2VyIGlmIGEgZnVuY3Rpb24sIGNhbGwgaXQuIElmIGl0J3MgYW4gYXJyYXksIGNoZWNrIG9iamVjdHMnIHN0cmluZyBrZXlzIGZvclxyXG4gICAgICAgICAgICAvLyBwcmVzZW5jZSBpbiB0aGUgYXJyYXkgKHJlbW92aW5nIHRoZSBrZXkvdmFsdWUgcGFpciBmcm9tIHRoZSByZXN1bHRpbmcgSlNPTiBpZiB0aGUga2V5IGlzIG1pc3NpbmcpLlxyXG4gICAgICAgICAgICBpZiAodHlwZW9mICh0aGlzLnJlcGxhY2VyKSA9PT0gXCJmdW5jdGlvblwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlci5jYWxsKGhvbGRlciwga2V5LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5yZXBsYWNlcikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGlzVG9wTGV2ZWwgfHwgdGhpcy5pc0FycmF5KGhvbGRlcikgfHwgdGhpcy5yZXBsYWNlci5pbmRleE9mKGtleSkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc1dvcmRDaGFyKGNoYXI6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKGNoYXIgPj0gJ2EnICYmIGNoYXIgPD0gJ3onKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNoYXIgPj0gJ0EnICYmIGNoYXIgPD0gJ1onKSB8fFxyXG4gICAgICAgICAgICAgICAgKGNoYXIgPj0gJzAnICYmIGNoYXIgPD0gJzknKSB8fFxyXG4gICAgICAgICAgICAgICAgY2hhciA9PT0gJ18nIHx8IGNoYXIgPT09ICckJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaXNXb3JkU3RhcnQoY2hhcjogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoY2hhciA+PSAnYScgJiYgY2hhciA8PSAneicpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2hhciA+PSAnQScgJiYgY2hhciA8PSAnWicpIHx8XHJcbiAgICAgICAgICAgICAgICBjaGFyID09PSAnXycgfHwgY2hhciA9PT0gJyQnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc1dvcmQoa2V5OiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkgIT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzV29yZFN0YXJ0KGtleVswXSkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgaSA9IDEsIGxlbmd0aCA9IGtleS5sZW5ndGg7XHJcbiAgICAgICAgICAgIHdoaWxlIChpIDwgbGVuZ3RoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMuaXNXb3JkQ2hhcihrZXlbaV0pKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaSsrO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBwb2x5ZmlsbHNcclxuICAgICAgICBwcml2YXRlIGlzQXJyYXkob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KG9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEFycmF5XSc7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgaXNEYXRlKG9iajogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRGF0ZV0nO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc05hTih2YWw6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdHlwZW9mIHZhbCA9PT0gJ251bWJlcicgJiYgdmFsICE9PSB2YWw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIFxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tGb3JDaXJjdWxhcihvYmo6IGFueSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMub2JqU3RhY2subGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm9ialN0YWNrW2ldID09PSBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ29udmVydGluZyBjaXJjdWxhciBzdHJ1Y3R1cmUgdG8gSlNPTlwiKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1ha2VJbmRlbnQoc3RyOiBzdHJpbmcsIG51bTogbnVtYmVyLCBub05ld0xpbmU6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoIXN0cikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy8gaW5kZW50YXRpb24gbm8gbW9yZSB0aGFuIDEwIGNoYXJzXHJcbiAgICAgICAgICAgIGlmIChzdHIubGVuZ3RoID4gMTApIHtcclxuICAgICAgICAgICAgICAgIHN0ciA9IHN0ci5zdWJzdHJpbmcoMCwgMTApO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaW5kZW50ID0gbm9OZXdMaW5lID8gXCJcIiA6IFwiXFxuXCI7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbnVtOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGluZGVudCArPSBzdHI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBpbmRlbnQ7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBDb3BpZWQgZnJvbSBDcm9rZm9yZCdzIGltcGxlbWVudGF0aW9uIG9mIEpTT05cclxuICAgICAgICAvLyBTZWUgaHR0cHM6Ly9naXRodWIuY29tL2RvdWdsYXNjcm9ja2ZvcmQvSlNPTi1qcy9ibG9iL2UzOWRiNGI3ZTYyNDlmMDRhMTk1ZTdkZDA4NDBlNjEwY2M5ZTk0MWUvanNvbjIuanMjTDE5NVxyXG4gICAgICAgIC8vIEJlZ2luXHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgY3ggPSAvW1xcdTAwMDBcXHUwMGFkXFx1MDYwMC1cXHUwNjA0XFx1MDcwZlxcdTE3YjRcXHUxN2I1XFx1MjAwYy1cXHUyMDBmXFx1MjAyOC1cXHUyMDJmXFx1MjA2MC1cXHUyMDZmXFx1ZmVmZlxcdWZmZjAtXFx1ZmZmZl0vZztcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBlc2NhcGFibGUgPSAvW1xcXFxcXFwiXFx4MDAtXFx4MWZcXHg3Zi1cXHg5ZlxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1ldGEgPSB7IC8vIHRhYmxlIG9mIGNoYXJhY3RlciBzdWJzdGl0dXRpb25zXHJcbiAgICAgICAgICAgICdcXGInOiAnXFxcXGInLFxyXG4gICAgICAgICAgICAnXFx0JzogJ1xcXFx0JyxcclxuICAgICAgICAgICAgJ1xcbic6ICdcXFxcbicsXHJcbiAgICAgICAgICAgICdcXGYnOiAnXFxcXGYnLFxyXG4gICAgICAgICAgICAnXFxyJzogJ1xcXFxyJyxcclxuICAgICAgICAgICAgJ1wiJzogJ1xcXFxcIicsXHJcbiAgICAgICAgICAgICdcXFxcJzogJ1xcXFxcXFxcJ1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJpdmF0ZSBlc2NhcGVTdHJpbmcoc3RyOiBzdHJpbmcpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZSBzdHJpbmcgY29udGFpbnMgbm8gY29udHJvbCBjaGFyYWN0ZXJzLCBubyBxdW90ZSBjaGFyYWN0ZXJzLCBhbmQgbm9cclxuICAgICAgICAgICAgLy8gYmFja3NsYXNoIGNoYXJhY3RlcnMsIHRoZW4gd2UgY2FuIHNhZmVseSBzbGFwIHNvbWUgcXVvdGVzIGFyb3VuZCBpdC5cclxuICAgICAgICAgICAgLy8gT3RoZXJ3aXNlIHdlIG11c3QgYWxzbyByZXBsYWNlIHRoZSBvZmZlbmRpbmcgY2hhcmFjdGVycyB3aXRoIHNhZmUgZXNjYXBlXHJcbiAgICAgICAgICAgIC8vIHNlcXVlbmNlcy5cclxuICAgICAgICAgICAgU3VydmV5SlNPTjUuZXNjYXBhYmxlLmxhc3RJbmRleCA9IDA7XHJcbiAgICAgICAgICAgIHJldHVybiBTdXJ2ZXlKU09ONS5lc2NhcGFibGUudGVzdChzdHIpID8gJ1wiJyArIHN0ci5yZXBsYWNlKFN1cnZleUpTT041LmVzY2FwYWJsZSwgZnVuY3Rpb24gKGEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjID0gU3VydmV5SlNPTjUubWV0YVthXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eXBlb2YgYyA9PT0gJ3N0cmluZycgP1xyXG4gICAgICAgICAgICAgICAgICAgIGMgOlxyXG4gICAgICAgICAgICAgICAgICAgICdcXFxcdScgKyAoJzAwMDAnICsgYS5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDE2KSkuc2xpY2UoLTQpO1xyXG4gICAgICAgICAgICB9KSArICdcIicgOiAnXCInICsgc3RyICsgJ1wiJztcclxuICAgICAgICB9XHJcbiAgICAgICAgLy8gRW5kXHJcblxyXG4gICAgICAgIHByaXZhdGUgaW50ZXJuYWxTdHJpbmdpZnkoaG9sZGVyOiBhbnksIGtleTogYW55LCBpc1RvcExldmVsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBidWZmZXIsIHJlcztcclxuXHJcbiAgICAgICAgICAgIC8vIFJlcGxhY2UgdGhlIHZhbHVlLCBpZiBuZWNlc3NhcnlcclxuICAgICAgICAgICAgdmFyIG9ial9wYXJ0ID0gdGhpcy5nZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQoaG9sZGVyLCBrZXksIGlzVG9wTGV2ZWwpO1xyXG5cclxuICAgICAgICAgICAgaWYgKG9ial9wYXJ0ICYmICF0aGlzLmlzRGF0ZShvYmpfcGFydCkpIHtcclxuICAgICAgICAgICAgICAgIC8vIHVuYm94IG9iamVjdHNcclxuICAgICAgICAgICAgICAgIC8vIGRvbid0IHVuYm94IGRhdGVzLCBzaW5jZSB3aWxsIHR1cm4gaXQgaW50byBudW1iZXJcclxuICAgICAgICAgICAgICAgIG9ial9wYXJ0ID0gb2JqX3BhcnQudmFsdWVPZigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHN3aXRjaCAodHlwZW9mIG9ial9wYXJ0KSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiYm9vbGVhblwiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpfcGFydC50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgXCJudW1iZXJcIjpcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaXNOYU4ob2JqX3BhcnQpIHx8ICFpc0Zpbml0ZShvYmpfcGFydCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gb2JqX3BhcnQudG9TdHJpbmcoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBjYXNlIFwic3RyaW5nXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuZXNjYXBlU3RyaW5nKG9ial9wYXJ0LnRvU3RyaW5nKCkpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgXCJvYmplY3RcIjpcclxuICAgICAgICAgICAgICAgICAgICBpZiAob2JqX3BhcnQgPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIFwibnVsbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pc0FycmF5KG9ial9wYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQ2lyY3VsYXIob2JqX3BhcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBcIltcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wdXNoKG9ial9wYXJ0KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgb2JqX3BhcnQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJlcyA9IHRoaXMuaW50ZXJuYWxTdHJpbmdpZnkob2JqX3BhcnQsIGksIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXMgPT09IG51bGwgfHwgdHlwZW9mIHJlcyA9PT0gXCJ1bmRlZmluZWRcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIm51bGxcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHJlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpIDwgb2JqX3BhcnQubGVuZ3RoIC0gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIixcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5pbmRlbnRTdHIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gXCJcXG5cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCwgdHJ1ZSkgKyBcIl1cIjtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmNoZWNrRm9yQ2lyY3VsYXIob2JqX3BhcnQpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgPSBcIntcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIG5vbkVtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucHVzaChvYmpfcGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAodmFyIHByb3AgaW4gb2JqX3BhcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvYmpfcGFydC5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHRoaXMuaW50ZXJuYWxTdHJpbmdpZnkob2JqX3BhcnQsIHByb3AsIGZhbHNlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpc1RvcExldmVsID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB2YWx1ZSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vbkVtcHR5ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGtleSA9IHRoaXMuaXNXb3JkKHByb3ApID8gcHJvcCA6IHRoaXMuZXNjYXBlU3RyaW5nKHByb3ApO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0ga2V5ICsgXCI6XCIgKyAodGhpcy5pbmRlbnRTdHIgPyAnICcgOiAnJykgKyB2YWx1ZSArIFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnBvcCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobm9uRW1wdHkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IGJ1ZmZlci5zdWJzdHJpbmcoMCwgYnVmZmVyLmxlbmd0aCAtIDEpICsgdGhpcy5tYWtlSW5kZW50KHRoaXMuaW5kZW50U3RyLCB0aGlzLm9ialN0YWNrLmxlbmd0aCkgKyBcIn1cIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9ICd7fSc7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGJ1ZmZlcjtcclxuICAgICAgICAgICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gZnVuY3Rpb25zIGFuZCB1bmRlZmluZWQgc2hvdWxkIGJlIGlnbm9yZWRcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEl0ZW0ge1xyXG4gICAgICAgIHB1YmxpYyB2YWx1ZTogU3VydmV5LkJhc2U7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0cyB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnRlbmQ6IHN0cmluZyA9IFwiLi4uXCI7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBrb09iamVjdHM6IGFueSwgcHVibGljIGtvU2VsZWN0ZWQ6IGFueSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2VJdGVtID0gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnN1cnZleS5wYWdlcy5pbmRleE9mKHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChwcmV2UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gcHJldlBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMTsgLy8wIC0gU3VydmV5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKHBhZ2VJdGVtLCBpbmRleCk7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihwYWdlLnF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaXRlbSwgaW5kZXggKyBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQocGFnZUl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocGFnZTogU3VydmV5LlBhZ2UsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgocGFnZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uSW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKSArIDE7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IHF1ZXN0aW9uSW5kZXg7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNlbGVjdE9iamVjdChvYmo6IFN1cnZleS5CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmpzID0gdGhpcy5rb09iamVjdHMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2Jqc1tpXS52YWx1ZSA9PSBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQob2Jqc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVPYmplY3Qob2JqOiBTdXJ2ZXkuQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChvYmopO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBjb3VudFRvUmVtb3ZlID0gMTtcclxuICAgICAgICAgICAgaWYgKFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZTogU3VydmV5LlBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xyXG4gICAgICAgICAgICAgICAgY291bnRUb1JlbW92ZSArPSBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCBjb3VudFRvUmVtb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG5hbWVDaGFuZ2VkKG9iajogU3VydmV5LkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cygpW2luZGV4XS50ZXh0KHRoaXMuZ2V0VGV4dChvYmopKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRJdGVtKGl0ZW06IFN1cnZleU9iamVjdEl0ZW0sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5rb09iamVjdHMoKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29PYmplY3RzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVidWlsZCgpIHtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29PYmplY3RzKG9ianMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZUl0ZW0odGhpcy5zdXJ2ZXksIFwiU3VydmV5XCIpKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZVBhZ2UocGFnZSkpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZVF1ZXN0aW9uKHBhZ2UucXVlc3Rpb25zW2pdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMob2Jqcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCh0aGlzLnN1cnZleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVJdGVtKHBhZ2UsIHRoaXMuZ2V0VGV4dChwYWdlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVJdGVtKHF1ZXN0aW9uLCB0aGlzLmdldFRleHQocXVlc3Rpb24pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVJdGVtKHZhbHVlOiBTdXJ2ZXkuQmFzZSwgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IFN1cnZleU9iamVjdEl0ZW0oKTtcclxuICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpdGVtLnRleHQgPSBrby5vYnNlcnZhYmxlKHRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRJdGVtSW5kZXgodmFsdWU6IFN1cnZleS5CYXNlKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSB0aGlzLmtvT2JqZWN0cygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmpzW2ldLnZhbHVlID09IHZhbHVlKSByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGV4dChvYmo6IFN1cnZleS5CYXNlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGludGVuZCA9IFN1cnZleU9iamVjdHMuaW50ZW5kO1xyXG4gICAgICAgICAgICBpZiAoU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSAhPSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGludGVuZCArPSBTdXJ2ZXlPYmplY3RzLmludGVuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW50ZW5kICsgU3VydmV5SGVscGVyLmdldE9iamVjdE5hbWUob2JqKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iXSwic291cmNlUm9vdCI6InNyYyJ9
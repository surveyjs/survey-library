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
                this.koPages()[index].title(page.name);
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
                    title: ko.observable(page.name), page: page, koSelected: ko.observable(false)
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
                array.push({ value: page, text: page.name });
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
/// <reference path="objectVerbs.ts" />
/// <reference path="dragdrophelper.ts" />
/// <reference path="template_page.html.ts" />
/// <reference path="template_question.html.ts" />
var SurveyEditor;
(function (SurveyEditor_1) {
    var SurveyEditor = (function () {
        function SurveyEditor(renderedElement) {
            if (renderedElement === void 0) { renderedElement = null; }
            this.timeoutId = -1;
            this.questionTypes = Survey.QuestionFactory.Instance.getAllTypes();
            this.koCanDeleteObject = ko.observable(false);
            var self = this;
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
            var json = new Survey.JsonObject().toJsonObject(this.survey);
            this.jsonEditor.setValue(new SurveyEditor_1.SurveyJSON5().stringify(json, null, 1));
            this.jsonEditor.focus();
            this.koIsShowDesigner(false);
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
    var SurveyEmbedingWindow = (function () {
        function SurveyEmbedingWindow() {
            var self = this;
            this.koShowAsWindow = ko.observable("page");
            this.koScriptUsing = ko.observable("bootstrap");
            this.koShowAsWindow.subscribe(function (newValue) { self.surveyEmbedingJava.setValue(self.getJavaText()); });
            this.koScriptUsing.subscribe(function (newValue) { self.setHeadText(); });
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
            text += "survey.onComplete.add(function (s) {\n alert(\"The results are:\" + JSON.stringify(s.data)); \n });\n";
            if (isOnPage) {
                text += "survey.render(\"mySurveyJSName\");";
            }
            else {
                text += "//surveyWindow.title = \"My Survey Window Title.\"; //By default Survey.title is used.\n";
                text += "surveyWindow.show();";
            }
            return text;
        };
        SurveyEmbedingWindow.prototype.getJsonText = function () {
            return new SurveyEditor.SurveyJSON5().stringify(this.json);
        };
        return SurveyEmbedingWindow;
    })();
    SurveyEditor.SurveyEmbedingWindow = SurveyEmbedingWindow;
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
            return intend + obj["name"];
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
        ko.html = '<nav class="navbar navbar-default">    <div class="container-fluid">        <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-1">            <ul class="nav navbar-nav">                <li class="dropdown">                    <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span data-bind="text: koIsShowDesigner() ? \'Survey Designer\': \'JSON Editor\'"></span> <span class="caret"></span></a>                    <ul class="dropdown-menu">                        <li><a href="#" data-bind="click:selectDesignerClick">Use Survey Designer</a></li>                        <li><a href="#" data-bind="click:selectEditorClick">Use JSON Editor</a></li>                    </ul>                </li>            </ul>            <form class="navbar-form navbar-left">                <button type="button" class="btn btn-default" data-bind="click: runSurveyClick" data-toggle="modal" data-target="#surveyExampleModal">Run Survey</button>                <button type="button" class="btn btn-default" data-bind="click: embedingSurveyClick" data-toggle="modal" data-target="#surveyEmbedingModal">Embeding Survey to Your Page</button>            </form>        </div><!-- /.navbar-collapse -->    </div><!-- /.container-fluid --></nav><div class="panel" style="width:100%">    <div id="surveyjsEditor" data-bind="visible: !koIsShowDesigner()" style="height:450px;width:100%"></div>    <div class="row" data-bind="visible: koIsShowDesigner()">        <div class="col-xs-4 col-md-3">            <div class="panel panel-default" style="width:100%">                <div class="panel-heading">                    <div class="row">                        <select style="width:80%"  data-bind="options: koObjects, optionsText: \'text\', value: koSelectedObject"></select>                        <button type="button" data-bind="enable: koCanDeleteObject, click: deleteCurrentObject" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                    </div>                </div>                <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                <div class="panel-footer" data-bind="visible:surveyVerbs.koHasVerbs">                    <div data-bind="template: { name: \'objectverbs\', data: surveyVerbs }"></div>                </div>            </div>        </div>        <div class="col-xs-12 col-sm-6 col-md-8">            <nav class="navbar navbar-default">                <form class="navbar-form">                    <!-- ko foreach: questionTypes -->                    <button class="btn" type="button" draggable="true" data-bind="click: $parent.clickQuestion, event:{dragstart: function(el, e) { $parent.draggingQuestion($data, e); return true;}}">                        <span data-bind="text:$data"></span>                    </button>                    <!-- /ko  -->                </form>            </nav>            <div data-bind="template: { name: \'pageeditor\', data: pagesEditor }"></div>            <div style="overflow-y: scroll;height:450px;">                <div id="surveyjs" style="width:100%"></div>            </div></div>    </div></div><div id="surveyExampleModal" class="modal fade" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal">&times;</button>                <h4 class="modal-title">Running survey</h4>            </div>            <div class="modal-body">                <div id="surveyjsExample"></div>            </div>        </div>    </div></div><div id="surveyEmbedingModal" class="modal fade" role="dialog">    <div class="modal-dialog">        <div class="modal-content">            <div class="modal-header">                <button type="button" class="close" data-dismiss="modal">&times;</button>                <h4 class="modal-title">Embeding survey</h4>            </div>            <div class="modal-body">                <div data-bind="template: { name: \'surveyembeding\', data: surveyEmbeding }"></div>            </div>        </div>    </div></div><script type="text/html" id="objecteditor">    <table class="table">        <tbody data-bind="foreach: koProperties">            <tr data-bind="click: $parent.changeActiveProperty($data), css: {\'active\': $parent.koActiveProperty() == $data}">                <td data-bind="text: name" width="50%"></td>                <td width="50%">                    <span data-bind="text: koText, visible: $parent.koActiveProperty() != $data, attr: {title: koText}, style: {color: koIsDefault() ? \'gray\' : \'\'}" style="text-overflow:ellipsis;white-space:nowrap;overflow:hidden"></span>                    <div data-bind="visible: $parent.koActiveProperty() == $data">                        <!-- ko template: { name: \'propertyeditor-\' + editorType, data: $data } -->                        <!-- /ko -->                    </div>                </td>            </tr>        </tbody>    </table></script><script type="text/html" id="objectverbs">    <!-- ko foreach: koVerbs -->        <div>            <span data-bind="text:text"></span>            <select style="width:50%" data-bind="options: koItems, optionsText: \'text\', optionsValue:\'value\', value: koSelectedItem"></select>            <!-- ko if: ($index() != ($parent.koVerbs().length - 1)) -->            <p/>            <!-- /ko -->          </div>    <!-- /ko  --></script><script type="text/html" id="pageeditor">    <ul class="nav nav-tabs">        <!-- ko foreach: koPages -->        <li data-bind="css: {active: koSelected()},event:{           dragstart:function(el, e){ $parent.dragStart(el); return true; },           dragover:function(el, e){ $parent.dragOver(el);},           dragend:function(el, e){ $parent.dragEnd();},           drop:function(el, e){ $parent.dragDrop(el);}         }">             <a href="#" data-bind="click:$parent.selectPageClick">                <span data-bind="text: title"></span>            </a>        </li>        <!-- /ko  -->        <li><button type="button" class="btn btn-default" data-bind="click:addNewPageClick"><span class="glyphicon glyphicon-plus"></span></button></li>    </ul></script><script type="text/html" id="propertyeditor-boolean">    <input type="checkbox" data-bind="checked: koValue" /></script><script type="text/html" id="propertyeditor-dropdown">    <select data-bind="value: koValue, options: choices"  style="width:100%"></select></script><script type="text/html" id="propertyeditor-itemvalues">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorItemValuesModal">Edit</button>    </div>    <div id="propertyEditorItemValuesModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <table class="table">                            <thead>                                <tr>                                    <th>Value</th>                                    <th>Text</th>                                    <th></th>                                </tr>                            </thead>                            <tbody>                                <!-- ko foreach: koItems -->                                <tr>                                    <td><input type="text" data-bind="value:koValue" style="width:200px" /></td>                                    <td><input type="text" data-bind="value:koText" style="width:200px" /></td>                                    <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>                                </tr>                                <!-- /ko -->                                <tr>                                    <td><input type="text" data-bind="value:koNewValue" style="width:200px" /></td>                                    <td><input type="text" data-bind="value:koNewText" style="width:200px" /></td>                                    <td><input type="button" data-bind="click: onAddClick" value="Add" /></td>                                </tr>                            </tbody>                        </table>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-number">    <input type="number" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-string">    <input type="text" data-bind="value: koValue" style="width:100%" /></script><script type="text/html" id="propertyeditor-textitems">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorTextItemsModal">Edit</button>    </div>    <div id="propertyEditorTextItemsModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <table class="table">                            <thead>                                <tr>                                    <th>Name</th>                                    <th>Title</th>                                    <th></th>                                </tr>                            </thead>                            <tbody>                                <!-- ko foreach: koItems -->                                <tr>                                    <td><input type="text" data-bind="value:koName" style="width:200px" /></td>                                    <td><input type="text" data-bind="value:koTitle" style="width:200px" /></td>                                    <td><input type="button" data-bind="click: $parent.onDeleteClick" value="Delete" /></td>                                </tr>                                <!-- /ko -->                                <tr>                                    <td colspan="4"><input type="button" data-bind="click: onAddClick" value="Add" /></td>                                </tr>                            </tbody>                        </table>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-triggers">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorTriggersModal">Edit</button>    </div>    <div id="propertyEditorTriggersModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <div class="panel-heading">                            <div class="row">                                <select style="width:65%" data-bind="options: koItems, optionsText: \'koText\', value: koSelected"></select>                                <button type="button" data-bind="enable: koQuestions().length > 0, click: onAddClick" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>                                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                            </div>                        </div>                        <div data-bind="visible: koSelected() == null">                            <div data-bind="visible: koQuestions().length == 0">                                There is no any question in the survey.                            </div>                            <div data-bind="visible: koQuestions().length > 0">                                Please create a trigger                            </div>                        </div>                        <div data-bind="visible: koSelected() != null">                            <div data-bind="with: koSelected">                                <span>On </span><select data-bind="options:$parent.koQuestions, value: koName"></select> <span> </span>                                <select data-bind="options:availableOperators, optionsValue: \'name\', optionsText: \'text\', value:koOperator"></select>                                <input type="text" data-bind="visible: koRequireValue, value:koValue" />                                <div class="row">                                    <div class="col-sm-6">                                        <!-- ko template: { name: \'propertyeditor-triggersitems\', data: pages } -->                                        <!-- /ko -->                                    </div>                                    <div class="col-sm-6">                                        <!-- ko template: { name: \'propertyeditor-triggersitems\', data: questions } -->                                        <!-- /ko -->                                    </div>                                </div>                            </div>                        </div>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="propertyeditor-triggersitems">    <div class="panel">        <div class="panel-heading">            <span data-bind="text: title"></span>        </div>        <select multiple="multiple" data-bind="options:koChoosen, value: koChoosenSelected" style="width:200px;"></select>        <button type="button" data-bind="enable: koChoosenSelected() != null, click: onDeleteClick" style="width:40px; vertical-align:top" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>        <div>            <select data-bind="options:koObjects, value: koSelected" style="width:200px;"></select>            <button type="button" data-bind="enable: koSelected() != null, click: onAddClick" style="width:40px" class="btn btn-default"><span class="glyphicon glyphicon-plus"></span></button>        </div>    </div></script><script type="text/html" id="propertyeditor-validators">    <div>        <span data-bind="text: koText"></span>        <button type="button" class="btn btn-default" data-toggle="modal" data-target="#propertyEditorValidatorsModal">Edit</button>    </div>    <div id="propertyEditorValidatorsModal" class="modal fade" role="dialog">        <div class="modal-dialog">            <div class="modal-content">                <div class="modal-header">                    <button type="button" class="close" data-dismiss="modal">&times;</button>                    <h4 class="modal-title" data-bind="text:arrayEditor.title"></h4>                </div>                <div class="modal-body">                    <div class="panel" data-bind="with: arrayEditor">                        <div class="panel-heading">                            <div class="row">                                <select style="width:65%" data-bind="options: koItems, optionsText: \'text\', value: koSelected"></select>                                <div class="btn-group">                                    <button type="button" class="glyphicon glyphicon-plus dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">                                     <span class="caret"></span>                                    </button>                                    <ul class="dropdown-menu" >                                        <!-- ko foreach: availableValidators -->                                        <li><a href="#" data-bind="click: $parent.onAddClick($data)"><span data-bind="text:$data"></span></a></li>                                        <!-- /ko  -->                                    </ul>                                </div>                                <button type="button" data-bind="enable: koSelected() != null, click: onDeleteClick" style="width:15%" class="btn btn-default"><span class="glyphicon glyphicon-remove"></span></button>                            </div>                        </div>                        <div data-bind="template: { name: \'objecteditor\', data: selectedObjectEditor }"></div>                        <div class="panel-footer">                            <input type="button" value="Apply" data-bind="click: onApplyClick" style="width:100px" />                            <input type="button" class="pull-right" data-dismiss="modal" value="close" style="width:100px" />                        </div>                    </div>                </div>            </div>        </div>    </div></script><script type="text/html" id="surveyembeding">    <select data-bind="value:koScriptUsing">        <option value="bootstrap">For bootstrap framework</option>        <option value="standard">No bootstrap</option>    </select>    <select data-bind="value:koShowAsWindow">        <option value="page">Use Survey Inside a Page</option>        <option value="window">Use Survey as a Window</option>    </select>    <div class="panel">        <div class="panel-heading">Scripts and styles</div>        <div id="surveyEmbedingHead" style="height:70px;width:100%"></div>    </div>    <div class="panel" data-bind="visible: koShowAsWindow()==\'page\'">        <div class="panel-heading">HTML part</div>        <div id="surveyEmbedingBody" style="height:30px;width:100%"></div>    </div>    <div class="panel">        <div class="panel-heading">Java Script</div>        <div id="surveyEmbedingJava" style="height:300px;width:100%"></div>    </div></script>';
    })(ko = templateEditor.ko || (templateEditor.ko = {}));
})(templateEditor || (templateEditor = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyYWdkcm9waGVscGVyLnRzIiwib2JqZWN0UHJvcGVydHlBcnJheXMudHMiLCJvYmplY3RQcm9wZXJ0eUl0ZW1WYWx1ZXMudHMiLCJvYmplY3RQcm9wZXJ0eVRyaWdnZXJzLnRzIiwib2JqZWN0UHJvcGVydHlWYWxpZGF0b3JzLnRzIiwic3VydmV5SGVscGVyLnRzIiwib2JqZWN0UHJvcGVydHlUZXh0SXRlbXMudHMiLCJvYmplY3RQcm9wZXJ0eS50cyIsIm9iamVjdEVkaXRvci50cyIsInBhZ2VzRWRpdG9yLnRzIiwidGV4dFdvcmtlci50cyIsIm9iamVjdFZlcmJzLnRzIiwidGVtcGxhdGVfcGFnZS5odG1sLnRzIiwidGVtcGxhdGVfcXVlc3Rpb24uaHRtbC50cyIsImVkaXRvci50cyIsImpzb241LnRzIiwic3VydmV5RW1iZWRpbmdXaW5kb3cudHMiLCJzdXJ2ZXlPYmplY3RzLnRzIiwidGVtcGxhdGVFZGl0b3Iua28uaHRtbC50cyJdLCJuYW1lcyI6WyJTdXJ2ZXlFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuc3VydmV5IiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ05ld1F1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLnN0YXJ0RHJhZ1F1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLmlzU3VydmV5RHJhZ2dpbmciLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZG9EcmFnRHJvcE92ZXIiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZG9Ecm9wIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLmdldFF1ZXN0aW9uSW5kZXgiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuaXNTYW1lUGxhY2UiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZ2V0RXZlbnQiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIubW92ZVF1ZXN0aW9uVG8iLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZ2V0RGF0YUluZm8iLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuZ2V0WSIsIlN1cnZleUVkaXRvci5EcmFnRHJvcEhlbHBlci5zZXREYXRhIiwiU3VydmV5RWRpdG9yLkRyYWdEcm9wSGVscGVyLmdldERhdGEiLCJTdXJ2ZXlFZGl0b3IuRHJhZ0Ryb3BIZWxwZXIuY2xlYXJEYXRhIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5QXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlBcnJheS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUFycmF5LnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlcyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXMuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlJdGVtVmFsdWVzLnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlcy5BZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5SXRlbVZhbHVlcy5BcHBseSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlcnMuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2Vycy52YWx1ZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzLmFwcGx5IiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlcnMuZ2V0TmFtZXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2Vycy5hZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyLmNyZWF0ZVRyaWdnZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyLmdldFRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyLmdldE9wZXJhdG9yVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXIuZ2V0VmFsdWVUZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cy5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzLmRlbGV0ZUl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cy5hZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VHJpZ2dlck9iamVjdHMuY2hhbmdlSXRlbXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnMudmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzLmFwcGx5IiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5hZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5nZXRBdmFpbGFibGVWYWxpZGF0b3JzIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ycy5vblByb3BlcnR5VmFsdWVDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0uY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuT2JqVHlwZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlIZWxwZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SGVscGVyLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUhlbHBlci5nZXROZXdOYW1lIiwiU3VydmV5RWRpdG9yLlN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zLnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleVByb3BlcnR5VGV4dEl0ZW1zLkFkZEl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUZXh0SXRlbXMuQXBwbHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UHJvcGVydHlUZXh0SXRlbXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RQcm9wZXJ0eS5vYmplY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkudXBkYXRlVmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0UHJvcGVydHkuZ2V0VmFsdWVUZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLnNlbGVjdGVkT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEVkaXRvci5nZXRQcm9wZXJ0eUVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IuY2hhbmdlQWN0aXZlUHJvcGVydHkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLk9iamVjdENoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLnVwZGF0ZVByb3BlcnRpZXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0RWRpdG9yLmNhblNob3dQcm9wZXJ0eSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RFZGl0b3IudXBkYXRlUHJvcGVydGllc09iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5zdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3Iuc2V0U2VsZWN0ZWRQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLmFkZE5ld1BhZ2VDbGljayIsIlN1cnZleUVkaXRvci5TdXJ2ZXlQYWdlc0VkaXRvci5yZW1vdmVQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleVBhZ2VzRWRpdG9yLmNoYW5nZU5hbWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3IuZ2V0SW5kZXhCeVBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3IudXBkYXRlUGFnZXMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5UGFnZXNFZGl0b3IubW92ZURyYWdnaW5nUGFnZVRvIiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5IiwiU3VydmV5RWRpdG9yLlRleHRQYXJzZXJQcm9wZXJ5LmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5wcm9jZXNzIiwiU3VydmV5RWRpdG9yLlN1cnZleVRleHRXb3JrZXIudXBkYXRlSnNvblBvc2l0aW9ucyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmNyZWF0ZVN1cnZleU9iamVjdHMiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5zZXRFZGl0b3JQb3NpdGlvbkJ5Q2hhcnRBdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlUZXh0V29ya2VyLmdldFBvc3Rpb25CeUNoYXJ0QXQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VGV4dFdvcmtlci5nZXRBdEFycmF5IiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJzIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJzLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJzLnN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJicy5vYmoiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYnMuYnVpbGRWZXJicyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiSXRlbSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiSXRlbS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiSXRlbS50ZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJDaGFuZ2VUeXBlSXRlbSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiQ2hhbmdlVHlwZUl0ZW0uY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtLnRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtLmNoYW5nZVR5cGUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5VmVyYkNoYW5nZVBhZ2VJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiQ2hhbmdlUGFnZUl0ZW0udGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlWZXJiQ2hhbmdlUGFnZUl0ZW0uY2hhbmdlUGFnZSIsInRlbXBsYXRlX3BhZ2UiLCJ0ZW1wbGF0ZV9xdWVzdGlvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnJlbmRlciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IudGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZ2V0VGV4dEFuZFByb2Nlc3MiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnNldFRleHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmFkZFBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm1vdmVQYWdlIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5hZGRQYWdlVG9VSSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iub25RdWVzdGlvbkFkZGVkIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5vblF1ZXN0aW9uUmVtb3ZlZCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2hvd0Rlc2lnbmVyIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zaG93SnNvbkVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2VsZWN0ZWRPYmplY3RDaGFuZ2VkIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zZXRUZXh0VmFsdWUiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmFwcGx5QmluZGluZyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuaW5pdEpzb25FZGl0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmluaXRTdXJ2ZXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLm9uSnNvbkVkaXRvckNoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLnByb2Nlc3NKc29uIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5kb0RyYWdnaW5nUXVlc3Rpb24iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RWRpdG9yLmRvQ2xpY2tRdWVzdGlvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZGVsZXRlQ3VycmVudE9iamVjdCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3IuZGVsZXRlT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5zaG93TGl2ZVN1cnZleSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFZGl0b3Iuc2hvd1N1cnZleUVtYmVkaW5nIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5nZXRTdXJ2ZXlKU09OIiwiU3VydmV5RWRpdG9yLlN1cnZleUVkaXRvci5jcmVhdGVBbm5vdGF0aW9ucyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jb25zdHJ1Y3RvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5wYXJzZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5wYXJzZS53YWxrIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmVycm9yIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041Lm5leHQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUucGVlayIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jaGFydEF0IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlkZW50aWZpZXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUubnVtYmVyIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnN0cmluZyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5pbmxpbmVDb21tZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmJsb2NrQ29tbWVudCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5jb21tZW50IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LndoaXRlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LndvcmQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuYXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUub2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnZhbHVlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LnN0cmluZ2lmeSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5nZXRJbmRlbnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuZ2V0UmVwbGFjZWRWYWx1ZU9yVW5kZWZpbmVkIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzV29yZENoYXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNXb3JkU3RhcnQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNXb3JkIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzQXJyYXkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaXNEYXRlIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmlzTmFOIiwiU3VydmV5RWRpdG9yLlN1cnZleUpTT041LmNoZWNrRm9yQ2lyY3VsYXIiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUubWFrZUluZGVudCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlKU09ONS5lc2NhcGVTdHJpbmciLCJTdXJ2ZXlFZGl0b3IuU3VydmV5SlNPTjUuaW50ZXJuYWxTdHJpbmdpZnkiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RW1iZWRpbmdXaW5kb3ciLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RW1iZWRpbmdXaW5kb3cuY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5RW1iZWRpbmdXaW5kb3cuanNvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFbWJlZGluZ1dpbmRvdy5zaG93IiwiU3VydmV5RWRpdG9yLlN1cnZleUVtYmVkaW5nV2luZG93LnNldEhlYWRUZXh0IiwiU3VydmV5RWRpdG9yLlN1cnZleUVtYmVkaW5nV2luZG93LmNyZWF0ZUVkaXRvciIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFbWJlZGluZ1dpbmRvdy5nZXRKYXZhVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlFbWJlZGluZ1dpbmRvdy5nZXRKc29uVGV4dCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdEl0ZW0uY29uc3RydWN0b3IiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cyIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmNvbnN0cnVjdG9yIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuc3VydmV5IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuYWRkUGFnZSIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmFkZFF1ZXN0aW9uIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMucmVtb3ZlT2JqZWN0IiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMubmFtZUNoYW5nZWQiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5hZGRJdGVtIiwiU3VydmV5RWRpdG9yLlN1cnZleU9iamVjdHMucmVidWlsZCIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmNyZWF0ZVBhZ2UiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5jcmVhdGVRdWVzdGlvbiIsIlN1cnZleUVkaXRvci5TdXJ2ZXlPYmplY3RzLmNyZWF0ZUl0ZW0iLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5nZXRJdGVtSW5kZXgiLCJTdXJ2ZXlFZGl0b3IuU3VydmV5T2JqZWN0cy5nZXRUZXh0IiwidGVtcGxhdGVFZGl0b3IiLCJ0ZW1wbGF0ZUVkaXRvci5rbyJdLCJtYXBwaW5ncyI6IkFBQUEsSUFBTyxZQUFZLENBc0hsQjtBQXRIRCxXQUFPLFlBQVksRUFBQyxDQUFDO0lBQ2pCQTtRQUtJQyx3QkFBbUJBLElBQW9CQTtZQUFwQkMsU0FBSUEsR0FBSkEsSUFBSUEsQ0FBZ0JBO1FBQ3ZDQSxDQUFDQTtRQUNERCxzQkFBV0Esa0NBQU1BO2lCQUFqQkEsY0FBcUNFLE1BQU1BLENBQWdCQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTs7O1dBQUFGO1FBQ2hFQSw2Q0FBb0JBLEdBQTNCQSxVQUE0QkEsS0FBZ0JBLEVBQUVBLFlBQW9CQSxFQUFFQSxZQUFvQkE7WUFDcEZHLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLEVBQUVBLGNBQWNBLENBQUNBLFNBQVNBLEdBQUdBLGVBQWVBLEdBQUdBLFlBQVlBLEdBQUdBLGdCQUFnQkEsR0FBR0EsWUFBWUEsQ0FBQ0EsQ0FBQ0E7UUFDckhBLENBQUNBO1FBQ01ILDBDQUFpQkEsR0FBeEJBLFVBQXlCQSxLQUFnQkEsRUFBRUEsWUFBb0JBO1lBQzNESSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxFQUFFQSxjQUFjQSxDQUFDQSxTQUFTQSxHQUFHQSxlQUFlQSxHQUFHQSxZQUFZQSxDQUFDQSxDQUFDQTtRQUNuRkEsQ0FBQ0E7UUFDTUoseUNBQWdCQSxHQUF2QkEsVUFBd0JBLEtBQWdCQTtZQUNwQ0ssRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ3pCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUMvQkEsTUFBTUEsQ0FBQ0EsSUFBSUEsSUFBSUEsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsY0FBY0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7UUFDL0RBLENBQUNBO1FBQ01MLHVDQUFjQSxHQUFyQkEsVUFBc0JBLEtBQWdCQSxFQUFFQSxRQUF5QkE7WUFDN0RNLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQzdCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLEtBQUtBLENBQUNBLElBQUlBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLEtBQUtBLEVBQUVBLFFBQVFBLENBQUNBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQTtZQUM1RkEsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUNuREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDakRBLENBQUNBO1FBQ01OLCtCQUFNQSxHQUFiQSxVQUFjQSxLQUFnQkEsRUFBRUEsUUFBZ0NBO1lBQWhDTyx3QkFBZ0NBLEdBQWhDQSxlQUFnQ0E7WUFDNURBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLGVBQWVBLENBQUNBLENBQUNBLENBQUNBO2dCQUN4QkEsS0FBS0EsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7WUFDNUJBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGdCQUFnQkEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBO1lBQzFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxXQUFXQSxDQUFDQSxZQUFZQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUMxQ0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQSxLQUFLQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtZQUNuREEsSUFBSUEsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDdkNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLENBQUNBO1lBQ2pCQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxRQUFRQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0E7WUFDdEJBLElBQUlBLGNBQWNBLEdBQW9CQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxpQkFBaUJBLENBQUNBLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO1lBQzlGQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxjQUFjQSxJQUFJQSxRQUFRQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDOUNBLGNBQWNBLEdBQUdBLE1BQU1BLENBQUNBLGVBQWVBLENBQUNBLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLEVBQUVBLFFBQVFBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3hIQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxjQUFjQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0E7WUFDNUJBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLGNBQWNBLEVBQUVBLEtBQUtBLENBQUNBLENBQUNBO1FBQy9DQSxDQUFDQTtRQUNPUCx5Q0FBZ0JBLEdBQXhCQSxVQUF5QkEsS0FBZ0JBLEVBQUVBLFFBQXlCQTtZQUNoRVEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0E7WUFDbkNBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxNQUFNQSxDQUFDQTtZQUM1Q0EsSUFBSUEsS0FBS0EsR0FBR0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQzdCQSxJQUFJQSxNQUFNQSxHQUFXQSxLQUFLQSxDQUFDQSxhQUFhQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUN6REEsSUFBSUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7WUFDdEJBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLGNBQWNBLENBQUNBLFFBQVFBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUNqQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBV0EsS0FBS0EsQ0FBQ0EsYUFBYUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsQ0FBQ0E7WUFDaEVBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLE1BQU1BLEdBQUdBLENBQUNBLENBQUNBO2dCQUFDQSxLQUFLQSxFQUFFQSxDQUFBQTtZQUMzQkEsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0E7UUFDakJBLENBQUNBO1FBQ09SLG9DQUFXQSxHQUFuQkEsVUFBb0JBLEtBQWdCQSxFQUFFQSxRQUF5QkE7WUFDM0RTLElBQUlBLElBQUlBLEdBQUdBLGNBQWNBLENBQUNBLFNBQVNBLENBQUNBO1lBQ3BDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxRQUFRQSxJQUFJQSxRQUFRQSxJQUFJQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxJQUFJQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxLQUFLQSxDQUFDQSxPQUFPQSxHQUFHQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDNUdBLElBQUlBLENBQUNBLFFBQVFBLEdBQUdBLFFBQVFBLENBQUNBO2dCQUN6QkEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQ3ZCQSxJQUFJQSxDQUFDQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxPQUFPQSxDQUFDQTtnQkFDdkJBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO1lBQ2pCQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtRQUNoQkEsQ0FBQ0E7UUFDT1QsaUNBQVFBLEdBQWhCQSxVQUFpQkEsS0FBZ0JBO1lBQzdCVSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQSxlQUFlQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxlQUFlQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQTtRQUNuRUEsQ0FBQ0E7UUFDT1YsdUNBQWNBLEdBQXRCQSxVQUF1QkEsY0FBK0JBLEVBQUVBLEtBQWFBO1lBQ2pFVyxFQUFFQSxDQUFDQSxDQUFDQSxjQUFjQSxJQUFJQSxJQUFJQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0E7WUFDbkNBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLGlCQUFpQkEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsQ0FBQ0E7WUFDekRBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNQQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQTtZQUN4Q0EsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsV0FBV0EsQ0FBQ0EsY0FBY0EsRUFBRUEsS0FBS0EsQ0FBQ0EsQ0FBQ0E7UUFDL0RBLENBQUNBO1FBQ09YLG9DQUFXQSxHQUFuQkEsVUFBb0JBLEtBQWdCQTtZQUNoQ1ksSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7WUFDL0JBLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLElBQUlBLENBQUNBO2dCQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtZQUN2QkEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDcERBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO1lBQzVCQSxJQUFJQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNoQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ3BDQSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtnQkFDL0JBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQzlCQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFDT1osNkJBQUlBLEdBQVpBLFVBQWFBLE9BQW9CQTtZQUM3QmEsSUFBSUEsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFFZkEsT0FBT0EsT0FBT0EsRUFBRUEsQ0FBQ0E7Z0JBQ2JBLE1BQU1BLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLE9BQU9BLENBQUNBLFNBQVNBLEdBQUdBLE9BQU9BLENBQUNBLFNBQVNBLENBQUNBLENBQUNBO2dCQUN0RUEsT0FBT0EsR0FBZ0JBLE9BQU9BLENBQUNBLFlBQVlBLENBQUNBO1lBQ2hEQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxDQUFDQTtRQUNsQkEsQ0FBQ0E7UUFDT2IsZ0NBQU9BLEdBQWZBLFVBQWdCQSxLQUFnQkEsRUFBRUEsSUFBWUE7WUFDMUNjLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLFlBQVlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQkEsS0FBS0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDN0NBLENBQUNBO1lBQ0RBLGNBQWNBLENBQUNBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBO1FBQ25DQSxDQUFDQTtRQUNPZCxnQ0FBT0EsR0FBZkEsVUFBZ0JBLEtBQWdCQTtZQUM1QmUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3JCQSxJQUFJQSxJQUFJQSxHQUFHQSxLQUFLQSxDQUFDQSxZQUFZQSxDQUFDQSxPQUFPQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtZQUNsREEsQ0FBQ0E7WUFDREEsTUFBTUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsR0FBR0EsY0FBY0EsQ0FBQ0EsUUFBUUEsQ0FBQ0E7UUFDakRBLENBQUNBO1FBQ09mLGtDQUFTQSxHQUFqQkE7WUFDSWdCLGNBQWNBLENBQUNBLFFBQVFBLEdBQUdBLEVBQUVBLENBQUNBO1lBQzdCQSxJQUFJQSxJQUFJQSxHQUFHQSxjQUFjQSxDQUFDQSxTQUFTQSxDQUFDQTtZQUNwQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDckJBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1lBQ1pBLElBQUlBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBO1FBQ2hCQSxDQUFDQTtRQWxITWhCLHdCQUFTQSxHQUFXQSxXQUFXQSxDQUFDQTtRQUNoQ0EsdUJBQVFBLEdBQVdBLEVBQUVBLENBQUNBO1FBQ3RCQSx3QkFBU0EsR0FBR0EsRUFBRUEsUUFBUUEsRUFBRUEsSUFBSUEsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsRUFBRUEsQ0FBQ0E7UUFpSHhEQSxxQkFBQ0E7SUFBREEsQ0FwSEFELEFBb0hDQyxJQUFBRDtJQXBIWUEsMkJBQWNBLGlCQW9IMUJBLENBQUFBO0FBQ0xBLENBQUNBLEVBdEhNLFlBQVksS0FBWixZQUFZLFFBc0hsQjs7QUN0SEQsSUFBTyxZQUFZLENBVWxCO0FBVkQsV0FBTyxZQUFZLEVBQUMsQ0FBQztJQUVqQkE7UUFHSWtCLDZCQUFtQkEsY0FBa0RBO1lBQWxEQyxtQkFBY0EsR0FBZEEsY0FBY0EsQ0FBb0NBO1lBRjlEQSxXQUFNQSxHQUFRQSxJQUFJQSxDQUFDQTtZQUd0QkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7UUFDakNBLENBQUNBO1FBQ0RELHNCQUFXQSxzQ0FBS0E7aUJBQWhCQSxVQUFpQkEsS0FBVUEsSUFBSUUsQ0FBQ0E7OztXQUFBRjtRQUNwQ0EsMEJBQUNBO0lBQURBLENBUEFsQixBQU9Da0IsSUFBQWxCO0lBUFlBLGdDQUFtQkEsc0JBTy9CQSxDQUFBQTtBQUNMQSxDQUFDQSxFQVZNLFlBQVksS0FBWixZQUFZLFFBVWxCOztBQ1ZELGdEQUFnRDs7Ozs7OztBQUVoRCxJQUFPLFlBQVksQ0FpRGxCO0FBakRELFdBQU8sWUFBWSxFQUFDLENBQUM7SUFFakJBO1FBQThDcUIsNENBQW1CQTtRQVM3REEsa0NBQW1CQSxjQUFrREE7WUFDakVDLGtCQUFNQSxjQUFjQSxDQUFDQSxDQUFDQTtZQURQQSxtQkFBY0EsR0FBZEEsY0FBY0EsQ0FBb0NBO1lBRWpFQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQTtZQUNwQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7WUFDbENBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLEVBQUVBLENBQUNBLFVBQVVBLEVBQUVBLENBQUNBO1lBQ2pDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNqQkEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDaEJBLElBQUlBLENBQUNBLFlBQVlBLEdBQUdBLGNBQWMsSUFBSSxDQUFDLEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDQTtZQUNsREEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsVUFBVUEsSUFBSUEsSUFBSSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQ0E7WUFDcEVBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLGNBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDQTtRQUN0REEsQ0FBQ0E7UUFDREQsc0JBQVdBLDJDQUFLQTtpQkFBaEJBLGNBQTBCRSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQTtpQkFDL0NGLFVBQWlCQSxLQUFVQTtnQkFDdkJFLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLElBQUlBLElBQUlBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO29CQUFDQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDdkRBLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEtBQUtBLENBQUNBO2dCQUNwQkEsSUFBSUEsS0FBS0EsR0FBR0EsRUFBRUEsQ0FBQ0E7Z0JBQ2ZBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUNwQ0EsSUFBSUEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3BCQSxLQUFLQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxPQUFPQSxFQUFFQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxFQUFFQSxNQUFNQSxFQUFFQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQTtnQkFDekZBLENBQUNBO2dCQUNEQSxJQUFJQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUN4QkEsQ0FBQ0E7OztXQVY4Q0Y7UUFXckNBLDBDQUFPQSxHQUFqQkE7WUFDSUcsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsT0FBT0EsRUFBRUEsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0EsRUFBRUEsTUFBTUEsRUFBRUEsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsRUFBRUEsQ0FBQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDMUdBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO1lBQ3RCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtRQUN6QkEsQ0FBQ0E7UUFDU0gsd0NBQUtBLEdBQWZBO1lBQ0lJLElBQUlBLENBQUNBLE1BQU1BLEdBQUdBLEVBQUVBLENBQUNBO1lBQ2pCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDN0NBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO2dCQUM3QkEsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsRUFBRUEsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsRUFBRUEsSUFBSUEsRUFBRUEsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0E7WUFDckVBLENBQUNBO1lBQ0RBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLENBQUNBLENBQUNBO2dCQUN0QkEsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7WUFDckNBLENBQUNBO1FBQ0xBLENBQUNBO1FBQ0xKLCtCQUFDQTtJQUFEQSxDQTlDQXJCLEFBOENDcUIsRUE5QzZDckIsZ0NBQW1CQSxFQThDaEVBO0lBOUNZQSxxQ0FBd0JBLDJCQThDcENBLENBQUFBO0FBQ0xBLENBQUNBLEVBakRNLFlBQVksS0FBWixZQUFZLFFBaURsQjs7Ozs7Ozs7QUNuREQsSUFBTyxZQUFZLENBb0psQjtBQXBKRCxXQUFPLFlBQVksRUFBQyxDQUFDO0lBRWpCQTtRQUE0QzBCLDBDQUFtQkE7UUFTM0RBLGdDQUFtQkEsY0FBa0RBO1lBQ2pFQyxrQkFBTUEsY0FBY0EsQ0FBQ0EsQ0FBQ0E7WUFEUEEsbUJBQWNBLEdBQWRBLGNBQWNBLENBQW9DQTtZQUVqRUEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDaEJBLElBQUlBLENBQUNBLE9BQU9BLEdBQUdBLEVBQUVBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1lBQ3BDQSxJQUFJQSxDQUFDQSxVQUFVQSxHQUFHQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtZQUN0Q0EsSUFBSUEsQ0FBQ0EsT0FBT0EsR0FBR0EsRUFBRUEsQ0FBQ0EsZUFBZUEsRUFBRUEsQ0FBQ0E7WUFDcENBLElBQUlBLENBQUNBLFdBQVdBLEdBQUdBLEVBQUVBLENBQUNBLGVBQWVBLEVBQUVBLENBQUNBO1lBQ3hDQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNqQkEsSUFBSUEsQ0FBQ0EsYUFBYUEsR0FBR0EsY0FBYyxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQUE7WUFDNUVBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLGNBQWMsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFBQTtZQUNqREEsSUFBSUEsQ0FBQ0EsWUFBWUEsR0FBR0EsY0FBYyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUNBO1FBQ3REQSxDQUFDQTtRQUNERCxzQkFBV0EseUNBQUtBO2lCQUFoQkEsY0FBMEJFLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO2lCQUMvQ0YsVUFBaUJBLEtBQVVBO2dCQUN2QkUsRUFBRUEsQ0FBQ0EsQ0FBQ0EsS0FBS0EsSUFBSUEsSUFBSUEsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0E7b0JBQUNBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUN2REEsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsS0FBS0EsQ0FBQ0E7Z0JBQ3BCQSxJQUFJQSxLQUFLQSxHQUFHQSxFQUFFQSxDQUFDQTtnQkFDZkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2RBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQWlCQSxJQUFJQSxDQUFDQSxNQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDaEVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLENBQUNBLFFBQVFBLENBQWlCQSxJQUFJQSxDQUFDQSxNQUFPQSxDQUFDQSxlQUFlQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDcEZBLENBQUNBO2dCQUNEQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtvQkFDcENBLEtBQUtBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLHFCQUFxQkEsQ0FBOEJBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLEVBQUVBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLENBQUNBLENBQUNBO2dCQUNqSEEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLENBQUNBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO2dCQUNwQkEsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDeERBLENBQUNBOzs7V0FkOENGO1FBZXZDQSxzQ0FBS0EsR0FBYkE7WUFDSUcsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0E7WUFDakJBLElBQUlBLEtBQUtBLEdBQUdBLElBQUlBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBO1lBQzNCQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxHQUFHQSxDQUFDQSxFQUFFQSxDQUFDQSxHQUFHQSxLQUFLQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxFQUFFQSxFQUFFQSxDQUFDQTtnQkFDcENBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLGFBQWFBLEVBQUVBLENBQUNBLENBQUNBO1lBQy9DQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxjQUFjQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEJBLElBQUlBLENBQUNBLGNBQWNBLENBQUNBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBO1lBQ3JDQSxDQUFDQTtRQUNMQSxDQUFDQTtRQUNPSCx5Q0FBUUEsR0FBaEJBLFVBQWlCQSxLQUFpQkE7WUFDOUJJLElBQUlBLEtBQUtBLEdBQUdBLEVBQUVBLENBQUNBO1lBQ2ZBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNwQ0EsSUFBSUEsSUFBSUEsR0FBR0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3BCQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDZkEsS0FBS0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQzdCQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxLQUFLQSxDQUFDQTtRQUNqQkEsQ0FBQ0E7UUFDT0osd0NBQU9BLEdBQWZBO1lBQ0lLLElBQUlBLE9BQU9BLEdBQUdBLElBQUlBLHFCQUFxQkEsQ0FBQ0EsSUFBSUEsTUFBTUEsQ0FBQ0Esb0JBQW9CQSxFQUFFQSxFQUFFQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxJQUFJQSxDQUFDQSxXQUFXQSxDQUFDQSxDQUFDQTtZQUMzR0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0E7WUFDM0JBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBO1FBQzdCQSxDQUFDQTtRQUNMTCw2QkFBQ0E7SUFBREEsQ0E3REExQixBQTZEQzBCLEVBN0QyQzFCLGdDQUFtQkEsRUE2RDlEQTtJQTdEWUEsbUNBQXNCQSx5QkE2RGxDQSxDQUFBQTtJQUVEQTtRQVdJZ0MsK0JBQVlBLE9BQW9DQSxFQUFFQSxPQUFZQSxFQUFFQSxXQUFnQkE7WUFWaEZDLHVCQUFrQkEsR0FBR0E7Z0JBQ2pCQSxFQUFFQSxJQUFJQSxFQUFFQSxPQUFPQSxFQUFFQSxJQUFJQSxFQUFFQSxVQUFVQSxFQUFFQSxFQUFFQSxFQUFFQSxJQUFJQSxFQUFFQSxVQUFVQSxFQUFFQSxJQUFJQSxFQUFFQSxjQUFjQSxFQUFFQTtnQkFDL0VBLEVBQUVBLElBQUlBLEVBQUVBLE9BQU9BLEVBQUVBLElBQUlBLEVBQUVBLFFBQVFBLEVBQUVBLEVBQUVBLEVBQUVBLElBQUlBLEVBQUVBLFVBQVVBLEVBQUVBLElBQUlBLEVBQUVBLFlBQVlBLEVBQUVBO2dCQUMzRUEsRUFBRUEsSUFBSUEsRUFBRUEsU0FBU0EsRUFBRUEsSUFBSUEsRUFBRUEsU0FBU0EsRUFBRUEsRUFBRUEsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsRUFBRUEsSUFBSUEsRUFBRUEsTUFBTUEsRUFBRUE7Z0JBQ3BFQSxFQUFFQSxJQUFJQSxFQUFFQSxnQkFBZ0JBLEVBQUVBLElBQUlBLEVBQUVBLG1CQUFtQkEsRUFBRUEsRUFBRUEsRUFBRUEsSUFBSUEsRUFBRUEsYUFBYUEsRUFBRUEsSUFBSUEsRUFBRUEsZ0JBQWdCQSxFQUFFQSxDQUFDQSxDQUFBQTtZQU92R0EsSUFBSUEsQ0FBQ0EsTUFBTUEsR0FBR0EsRUFBRUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsT0FBT0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDMUNBLElBQUlBLENBQUNBLFVBQVVBLEdBQUdBLEVBQUVBLENBQUNBLFVBQVVBLENBQUNBLE9BQU9BLENBQUNBLFFBQVFBLENBQUNBLENBQUNBO1lBQ2xEQSxJQUFJQSxDQUFDQSxPQUFPQSxHQUFHQSxFQUFFQSxDQUFDQSxVQUFVQSxDQUFDQSxPQUFPQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQTtZQUM1Q0EsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsSUFBSUEsNEJBQTRCQSxDQUFDQSxxQkFBcUJBLEVBQUVBLE9BQU9BLEVBQUVBLEVBQUVBLE9BQU9BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBO1lBQy9GQSxJQUFJQSxDQUFDQSxTQUFTQSxHQUFHQSxJQUFJQSw0QkFBNEJBLENBQUNBLHlCQUF5QkEsRUFBRUEsV0FBV0EsRUFBRUEsRUFBRUEsT0FBT0EsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0E7WUFDL0dBLElBQUlBLElBQUlBLEdBQUdBLElBQUlBLENBQUNBO1lBQ2hCQSxJQUFJQSxDQUFDQSxjQUFjQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxjQUFRQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxJQUFJQSxPQUFPQSxJQUFJQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxJQUFJQSxVQUFVQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtZQUNySEEsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsRUFBRUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsY0FBUUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsRUFBRUEsSUFBSUEsSUFBSUEsQ0FBQ0EsT0FBT0EsRUFBRUEsQ0FBQ0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBLElBQUlBLENBQUNBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO1lBQ3BJQSxJQUFJQSxDQUFDQSxNQUFNQSxHQUFHQSxFQUFFQSxDQUFDQSxRQUFRQSxDQUFDQSxjQUFRQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxPQUFPQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtRQUNsSEEsQ0FBQ0E7UUFDTUQsNkNBQWFBLEdBQXBCQTtZQUNJRSxJQUFJQSxPQUFPQSxHQUFHQSxJQUFJQSxNQUFNQSxDQUFDQSxvQkFBb0JBLEVBQUVBLENB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QUNBO29CQUMxQ0EsSUFBSUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsZUFBZUEsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUVEQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDWEEsS0FBS0EsRUFBRUE7b0JBQ0hBLE9BQU9BLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLElBQUlBLEdBQUdBLEVBQUVBLENBQUNBO3dCQUN0Q0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsQ0FBQ0E7d0JBQ2xCQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxDQUFDQTtvQkFDaEJBLENBQUNBO29CQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDbEJBLE1BQU1BLElBQUlBLEdBQUdBLENBQUNBO3dCQUNkQSxPQUFPQSxJQUFJQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxJQUFJQSxHQUFHQSxFQUFFQSxDQUFDQTs0QkFDckRBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO3dCQUN0QkEsQ0FBQ0E7b0JBQ0xBLENBQUNBO29CQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxJQUFJQSxJQUFJQSxDQUFDQSxFQUFFQSxLQUFLQSxHQUFHQSxDQUFDQSxDQUFDQSxDQUFDQTt3QkFDckNBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLEVBQUVBLENBQUNBO3dCQUNsQkEsSUFBSUEsQ0FBQ0EsSUFBSUEsRUFBRUEsQ0FBQ0E7d0JBQ1pBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLEVBQUVBLEtBQUtBLEdBQUdBLElBQUlBLElBQUlBLENBQUNBLEVBQUVB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QSxHQUFaQTtZQUVJZSx3QkFBd0JBO1lBRXhCQSxNQUFNQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDZEEsS0FBS0EsR0FBR0E7b0JBQ0pBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDaEJBLEtBQUtBLEdBQUdBO29CQUNKQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBO2dCQUNqQkEsS0FBS0EsR0FBR0E7b0JBQ0pBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTtvQkFDZkEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLElBQUlBLENBQUNBLElBQUlBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBO29CQUNmQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQTtnQkFDaEJBLEtBQUtBLEdBQUdBO29CQUNKQSxJ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QSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQTt3QkFDZkEsTUFBTUEsQ0FBQ0EsTUFBTUEsRUFBSUEsMkJBQTJCQTtvQkFDaERBLENBQUNBLEdBRGlCQTtvQkFHbEJBLEFBRUFBLHFEQUZxREE7b0JBQ3JEQSx3QkFBd0JBO29CQUN4QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsSUFBSUEsSUFBSUEsQ0FBQ0EsRUFBRUEsS0FBS0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JDQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxNQUFNQSxFQUFFQSxDQUFDQTtvQkFDeEJBLENBQUNBO29CQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTt3QkFDSkEsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsVUFBVUEsRUFBRUEsQ0FBQ0E7b0JBQzVCQSxDQUFDQTtvQkFFREEsSUFBSUEsQ0FBQ0EsS0FBS0EsRUFBRUEsQ0FBQ0E7b0JBQ2JBLEVBQUVBLENBQUNBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEdBQUdBLENBQUNBLENBQUNBLENBQUNBLENBQUNBO3dCQUNyQkEsTUFBTUEsQ0FBQ0EsV0FBV0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsRUFBRUEsS0FBS0EsRUFBRUEsS0FBS0EsRUFBRUEsVUFBVUEsRUFBRUEsSUFBSUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ2xGQSxDQUFDQTtvQkFDREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ2ZBLE1BQU1BLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLEVBQUVBLENBQUNBO29CQUMzQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ3JCQSxLQUFLQSxHQUFHQSxJQUFJQSxDQUFDQSxFQUFFQSxHQUFHQSxDQUFD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LENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLFFBQVFBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBOzRCQUN2Q0EsR0FBR0EsR0FBR0EsSUFBSUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxFQUFFQSxDQUFDQSxFQUFFQSxLQUFLQSxDQUFDQSxDQUFDQTs0QkFDakRBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBOzRCQUNoRUEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsS0FBS0EsSUFBSUEsSUFBSUEsT0FBT0EsR0FBR0EsS0FBS0EsV0FBV0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzdDQSxNQUFNQSxJQUFJQSxNQUFNQSxDQUFDQTs0QkFDckJBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQ0FDSkEsTUFBTUEsSUFBSUEsR0FBR0EsQ0FBQ0E7NEJBQ2xCQSxDQUFDQTs0QkFDREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsUUFBUUEsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0NBQzFCQSxNQUFNQSxJQUFJQSxHQUFHQSxDQUFDQTs0QkFDbEJBLENBQUNBOzRCQUFDQSxJQUFJQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxDQUFDQSxDQUFDQTtnQ0FDeEJBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBOzRCQUNuQkEsQ0FBQ0E7d0JBQ0xBLENBQUNBO3dCQUNEQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTt3QkFDcEJBLE1BQU1BLElBQUlBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLFNBQVNBLEVBQUVBLElBQUlB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WUFDZEEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsSUFBSUEsSUFBSUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RCQSxJQUFJQSxDQUFDQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDckJBLElBQUlBLENBQUNBLFVBQVVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUN0QkEsTUFBTUEsQ0FBQ0E7WUFDWEEsQ0FBQ0E7WUFDREEsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsVUFBVUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7WUFDbERBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLE1BQU1BLENBQUNBLEtBQUtBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNoREEsSUFBSUEsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2hDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxVQUFVQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDakNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLElBQUlBLENBQUNBLFNBQVNBLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO29CQUM3Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsY0FBY0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsU0FBU0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3REQSxDQUFDQTtZQUNMQSxDQUFDQTtZQUNEQSxJQUFJQSxDQUFDQSxT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IFN1cnZleUVkaXRvciB7XHJcbiAgICBleHBvcnQgY2xhc3MgRHJhZ0Ryb3BIZWxwZXIge1xyXG4gICAgICAgIHN0YXRpYyBkYXRhU3RhcnQ6IHN0cmluZyA9IFwic3VydmV5anMsXCI7XHJcbiAgICAgICAgc3RhdGljIGRyYWdEYXRhOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHN0YXRpYyBwcmV2RXZlbnQgPSB7IHF1ZXN0aW9uOiBudWxsLCB4OiAtMSwgeTogLTEgfTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGRhdGE6IFN1cnZleS5JU3VydmV5KSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gPFN1cnZleS5TdXJ2ZXk+dGhpcy5kYXRhOyB9XHJcbiAgICAgICAgcHVibGljIHN0YXJ0RHJhZ05ld1F1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbk5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldERhdGEoZXZlbnQsIERyYWdEcm9wSGVscGVyLmRhdGFTdGFydCArIFwicXVlc3Rpb250eXBlOlwiICsgcXVlc3Rpb25UeXBlICsgXCIscXVlc3Rpb25uYW1lOlwiICsgcXVlc3Rpb25OYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXJ0RHJhZ1F1ZXN0aW9uKGV2ZW50OiBEcmFnRXZlbnQsIHF1ZXN0aW9uTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RGF0YShldmVudCwgRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0ICsgXCJxdWVzdGlvbm5hbWU6XCIgKyBxdWVzdGlvbk5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNTdXJ2ZXlEcmFnZ2luZyhldmVudDogRHJhZ0V2ZW50KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghZXZlbnQpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmdldERhdGEoZXZlbnQpO1xyXG4gICAgICAgICAgICByZXR1cm4gZGF0YSAmJiBkYXRhLmluZGV4T2YoRHJhZ0Ryb3BIZWxwZXIuZGF0YVN0YXJ0KSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZG9EcmFnRHJvcE92ZXIoZXZlbnQ6IERyYWdFdmVudCwgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICBldmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgICAgICBpZiAoIXF1ZXN0aW9uIHx8ICF0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpIHx8IHRoaXMuaXNTYW1lUGxhY2UoZXZlbnQsIHF1ZXN0aW9uKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldFF1ZXN0aW9uSW5kZXgoZXZlbnQsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2VbXCJrb0RyYWdnaW5nXCJdKGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGRvRHJvcChldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoZXZlbnQuc3RvcFByb3BhZ2F0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzU3VydmV5RHJhZ2dpbmcoZXZlbnQpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlW1wia29EcmFnZ2luZ1wiXSgtMSk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuZ2V0UXVlc3Rpb25JbmRleChldmVudCwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgZGF0YUluZm8gPSB0aGlzLmdldERhdGFJbmZvKGV2ZW50KTtcclxuICAgICAgICAgICAgdGhpcy5jbGVhckRhdGEoKTtcclxuICAgICAgICAgICAgaWYgKCFkYXRhSW5mbykgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgdGFyZ2V0UXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uPnRoaXMuc3VydmV5LmdldFF1ZXN0aW9uQnlOYW1lKGRhdGFJbmZvW1wicXVlc3Rpb25uYW1lXCJdKTtcclxuICAgICAgICAgICAgaWYgKCF0YXJnZXRRdWVzdGlvbiAmJiBkYXRhSW5mb1tcInF1ZXN0aW9udHlwZVwiXSkge1xyXG4gICAgICAgICAgICAgICAgdGFyZ2V0UXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKGRhdGFJbmZvW1wicXVlc3Rpb250eXBlXCJdLCBkYXRhSW5mb1tcInF1ZXN0aW9ubmFtZVwiXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCF0YXJnZXRRdWVzdGlvbikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm1vdmVRdWVzdGlvblRvKHRhcmdldFF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UXVlc3Rpb25JbmRleChldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2U7XHJcbiAgICAgICAgICAgIGlmICghcXVlc3Rpb24pIHJldHVybiBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHBhZ2UucXVlc3Rpb25zLmluZGV4T2YocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBldmVudCA9IHRoaXMuZ2V0RXZlbnQoZXZlbnQpO1xyXG4gICAgICAgICAgICB2YXIgaGVpZ2h0ID0gPG51bWJlcj5ldmVudC5jdXJyZW50VGFyZ2V0W1wiY2xpZW50SGVpZ2h0XCJdO1xyXG4gICAgICAgICAgICB2YXIgeSA9IGV2ZW50Lm9mZnNldFk7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5oYXNPd25Qcm9wZXJ0eSgnbGF5ZXJYJykpIHtcclxuICAgICAgICAgICAgICAgIHkgPSBldmVudC5sYXllclkgLSA8bnVtYmVyPmV2ZW50LmN1cnJlbnRUYXJnZXRbXCJvZmZzZXRUb3BcIl07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHkgPiBoZWlnaHQgLyAyKSBpbmRleCsrXHJcbiAgICAgICAgICAgIHJldHVybiBpbmRleDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1NhbWVQbGFjZShldmVudDogRHJhZ0V2ZW50LCBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciBwcmV2ID0gRHJhZ0Ryb3BIZWxwZXIucHJldkV2ZW50O1xyXG4gICAgICAgICAgICBpZiAocHJldi5xdWVzdGlvbiAhPSBxdWVzdGlvbiB8fCBNYXRoLmFicyhldmVudC5jbGllbnRYIC0gcHJldi54KSA+IDUgfHwgTWF0aC5hYnMoZXZlbnQuY2xpZW50WSAtIHByZXYueSkgPiA1KSB7XHJcbiAgICAgICAgICAgICAgICBwcmV2LnF1ZXN0aW9uID0gcXVlc3Rpb247XHJcbiAgICAgICAgICAgICAgICBwcmV2LnggPSBldmVudC5jbGllbnRYO1xyXG4gICAgICAgICAgICAgICAgcHJldi55ID0gZXZlbnQuY2xpZW50WTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRFdmVudChldmVudDogRHJhZ0V2ZW50KTogRHJhZ0V2ZW50IHtcclxuICAgICAgICAgICAgcmV0dXJuIGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXSA/IGV2ZW50W1wib3JpZ2luYWxFdmVudFwiXSA6IGV2ZW50O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1vdmVRdWVzdGlvblRvKHRhcmdldFF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRhcmdldFF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0YXJnZXRRdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGlmIChwYWdlKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlLnJlbW92ZVF1ZXN0aW9uKHRhcmdldFF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZS5hZGRRdWVzdGlvbih0YXJnZXRRdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldERhdGFJbmZvKGV2ZW50OiBEcmFnRXZlbnQpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZ2V0RGF0YShldmVudCk7XHJcbiAgICAgICAgICAgIGlmICghZGF0YSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGRhdGEgPSBkYXRhLnN1YnN0cihEcmFnRHJvcEhlbHBlci5kYXRhU3RhcnQubGVuZ3RoKTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gZGF0YS5zcGxpdCgnLCcpO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gYXJyYXlbaV0uc3BsaXQoJzonKTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtpdGVtWzBdXSA9IGl0ZW1bMV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRZKGVsZW1lbnQ6IEhUTUxFbGVtZW50KTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IDA7XHJcblxyXG4gICAgICAgICAgICB3aGlsZSAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IChlbGVtZW50Lm9mZnNldFRvcCAtIGVsZW1lbnQuc2Nyb2xsVG9wICsgZWxlbWVudC5jbGllbnRUb3ApO1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IDxIVE1MRWxlbWVudD5lbGVtZW50Lm9mZnNldFBhcmVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldERhdGEoZXZlbnQ6IERyYWdFdmVudCwgZGF0YTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChldmVudC5kYXRhVHJhbnNmZXIpIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50LmRhdGFUcmFuc2Zlci5zZXREYXRhKFwiVGV4dFwiLCBkYXRhKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YSA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0RGF0YShldmVudDogRHJhZ0V2ZW50KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKGV2ZW50LmRhdGFUcmFuc2Zlcikge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSBldmVudC5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcIlRleHRcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGRhdGEgPyBkYXRhIDogRHJhZ0Ryb3BIZWxwZXIuZHJhZ0RhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2xlYXJEYXRhKCkge1xyXG4gICAgICAgICAgICBEcmFnRHJvcEhlbHBlci5kcmFnRGF0YSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHZhciBwcmV2ID0gRHJhZ0Ryb3BIZWxwZXIucHJldkV2ZW50O1xyXG4gICAgICAgICAgICBwcmV2LnF1ZXN0aW9uID0gbnVsbDtcclxuICAgICAgICAgICAgcHJldi54ID0gLTE7XHJcbiAgICAgICAgICAgIHByZXYueSA9IC0xO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGRlY2xhcmUgdHlwZSBTdXJ2ZXlQcm9wZXJ0eVZhbHVlQ2hhbmdlZENhbGxiYWNrID0gKG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5UHJvcGVydHlBcnJheSB7XHJcbiAgICAgICAgcHVibGljIG9iamVjdDogYW55ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IFN1cnZleVByb3BlcnR5VmFsdWVDaGFuZ2VkQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7IH1cclxuICAgIH1cclxufVxyXG4iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0UHJvcGVydHlBcnJheXMudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5SXRlbVZhbHVlcyBleHRlbmRzIFN1cnZleVByb3BlcnR5QXJyYXl7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZV86IEFycmF5PGFueT47XHJcbiAgICAgICAgcHVibGljIGtvSXRlbXM6IGFueTtcclxuICAgICAgICBwdWJsaWMga29OZXdWYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb05ld1RleHQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQXBwbHlDbGljazogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IFN1cnZleVByb3BlcnR5VmFsdWVDaGFuZ2VkQ2FsbGJhY2spICB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9uVmFsdWVDaGFuZ2VkKTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29OZXdWYWx1ZSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb05ld1RleHQgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQXBwbHkoKTsgfTtcclxuICAgICAgICAgICAgc2VsZi5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShpdGVtKTsgfTtcclxuICAgICAgICAgICAgc2VsZi5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLkFkZEl0ZW0oKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goeyBrb1ZhbHVlOiBrby5vYnNlcnZhYmxlKGl0ZW0udmFsdWUpLCBrb1RleHQ6IGtvLm9ic2VydmFibGUoaXRlbS50ZXh0KSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgQWRkSXRlbSgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2goeyBrb1ZhbHVlOiBrby5vYnNlcnZhYmxlKHRoaXMua29OZXdWYWx1ZSgpKSwga29UZXh0OiBrby5vYnNlcnZhYmxlKHRoaXMua29OZXdUZXh0KCkpIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvTmV3VmFsdWUobnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMua29OZXdUZXh0KG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgQXBwbHkoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5rb0l0ZW1zKCkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5rb0l0ZW1zKClbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXy5wdXNoKHsgdmFsdWU6IGl0ZW0ua29WYWx1ZSgpLCB0ZXh0OiBpdGVtLmtvVGV4dCgpIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKHRoaXMudmFsdWVfKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJzIGV4dGVuZHMgU3VydmV5UHJvcGVydHlBcnJheSB7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZV86IEFycmF5PGFueT47XHJcbiAgICAgICAgcHVibGljIGtvSXRlbXM6IGFueTtcclxuICAgICAgICBrb1F1ZXN0aW9uczogYW55OyBrb1BhZ2VzOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvU2VsZWN0ZWQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uQXBwbHlDbGljazogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IFN1cnZleVByb3BlcnR5VmFsdWVDaGFuZ2VkQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgc3VwZXIob25WYWx1ZUNoYW5nZWQpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQgPSBrby5vYnNlcnZhYmxlKG51bGwpO1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1F1ZXN0aW9ucyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoc2VsZi5rb1NlbGVjdGVkKCkpOyB9XHJcbiAgICAgICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hZGRJdGVtKCk7IH1cclxuICAgICAgICAgICAgdGhpcy5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuYXBwbHkoKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMub2JqZWN0KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUGFnZXModGhpcy5nZXROYW1lcygoPFN1cnZleS5TdXJ2ZXk+dGhpcy5vYmplY3QpLnBhZ2VzKSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvUXVlc3Rpb25zKHRoaXMuZ2V0TmFtZXMoKDxTdXJ2ZXkuU3VydmV5PnRoaXMub2JqZWN0KS5nZXRBbGxRdWVzdGlvbnMoKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlcig8U3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlPnZhbHVlW2ldLCB0aGlzLmtvUGFnZXMsIHRoaXMua29RdWVzdGlvbnMpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoYXJyYXkubGVuZ3RoID4gMCA/IGFycmF5WzBdIDogbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXBwbHkoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IHRoaXMua29JdGVtcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFycmF5Lmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlXy5wdXNoKGFycmF5W2ldLmNyZWF0ZVRyaWdnZXIoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWx1ZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy52YWx1ZV8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0TmFtZXMoaXRlbXM6IEFycmF5PGFueT4pOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIG5hbWVzID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAoaXRlbVtcIm5hbWVcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBuYW1lcy5wdXNoKGl0ZW1bXCJuYW1lXCJdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbmFtZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkSXRlbSgpIHtcclxuICAgICAgICAgICAgdmFyIHRyaWdnZXIgPSBuZXcgU3VydmV5UHJvcGVydHlUcmlnZ2VyKG5ldyBTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUoKSwgdGhpcy5rb1BhZ2VzLCB0aGlzLmtvUXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2godHJpZ2dlcik7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCh0cmlnZ2VyKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VHJpZ2dlciB7XHJcbiAgICAgICAgYXZhaWxhYmxlT3BlcmF0b3JzID0gW1xyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZW1wdHlcIiwgdGV4dDogXCJpcyBlbXB0eVwiIH0sIHsgbmFtZTogXCJub3RlbXB0eVwiLCB0ZXh0OiBcImlzIG5vdCBlbXB0eVwiIH0sXHJcbiAgICAgICAgICAgIHsgbmFtZTogXCJlcXVhbFwiLCB0ZXh0OiBcImVxdWFsc1wiIH0sIHsgbmFtZTogXCJub3RlcXVhbFwiLCB0ZXh0OiBcIm5vdCBlcXVhbHNcIiB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZ3JlYXRlclwiLCB0ZXh0OiBcImdyZWF0ZXJcIiB9LCB7IG5hbWU6IFwibGVzc1wiLCB0ZXh0OiBcImxlc3NcIiB9LFxyXG4gICAgICAgICAgICB7IG5hbWU6IFwiZ3JlYXRlcm9yZXF1YWxcIiwgdGV4dDogXCJncmVhdGVyIG9yIGVxdWFsc1wiIH0sIHsgbmFtZTogXCJsZXNzb3JlcXVhbFwiLCB0ZXh0OiBcIkxlc3Mgb3IgRXF1YWxzXCIgfV1cclxuICAgICAgICBrb05hbWU6IGFueTsga29PcGVyYXRvcjogYW55OyBrb1ZhbHVlOiBhbnk7XHJcbiAgICAgICAga29UZXh0OiBhbnk7IGtvSXNWYWxpZDogYW55OyBrb1JlcXVpcmVWYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogU3VydmV5UHJvcGVydHlUcmlnZ2VyT2JqZWN0cztcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25zOiBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcih0cmlnZ2VyOiBTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUsIGtvUGFnZXM6IGFueSwga29RdWVzdGlvbnM6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmtvTmFtZSA9IGtvLm9ic2VydmFibGUodHJpZ2dlci5uYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5rb09wZXJhdG9yID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLm9wZXJhdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSh0cmlnZ2VyLnZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5wYWdlcyA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzKFwiTWFrZSBwYWdlcyB2aXNpYmxlOlwiLCBrb1BhZ2VzKCksIHRyaWdnZXIucGFnZXMpO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucyA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzKFwiTWFrZSBxdWVzdGlvbnMgdmlzaWJsZTpcIiwga29RdWVzdGlvbnMoKSwgdHJpZ2dlci5xdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29SZXF1aXJlVmFsdWUgPSBrby5jb21wdXRlZCgoKSA9PiB7IHJldHVybiBzZWxmLmtvT3BlcmF0b3IoKSAhPSBcImVtcHR5XCIgJiYgc2VsZi5rb09wZXJhdG9yKCkgIT0gXCJub3RlbXB0eVwiOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5jb21wdXRlZCgoKSA9PiB7IGlmIChzZWxmLmtvTmFtZSgpICYmICghc2VsZi5rb1JlcXVpcmVWYWx1ZSgpIHx8IHNlbGYua29WYWx1ZSgpKSkgcmV0dXJuIHRydWU7IHJldHVybiBmYWxzZTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMua29UZXh0ID0ga28uY29tcHV0ZWQoKCkgPT4geyBzZWxmLmtvTmFtZSgpOyBzZWxmLmtvT3BlcmF0b3IoKTsgc2VsZi5rb1ZhbHVlKCk7IHJldHVybiBzZWxmLmdldFRleHQoKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjcmVhdGVUcmlnZ2VyKCk6IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSB7XHJcbiAgICAgICAgICAgIHZhciB0cmlnZ2VyID0gbmV3IFN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSgpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLm5hbWUgPSB0aGlzLmtvTmFtZSgpO1xyXG4gICAgICAgICAgICB0cmlnZ2VyLm9wZXJhdG9yID0gdGhpcy5rb09wZXJhdG9yKCk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIudmFsdWUgPSB0aGlzLmtvVmFsdWUoKTtcclxuICAgICAgICAgICAgdHJpZ2dlci5wYWdlcyA9IHRoaXMucGFnZXMua29DaG9vc2VuKCk7XHJcbiAgICAgICAgICAgIHRyaWdnZXIucXVlc3Rpb25zID0gdGhpcy5xdWVzdGlvbnMua29DaG9vc2VuKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cmlnZ2VyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmtvSXNWYWxpZCgpKSByZXR1cm4gXCJUaGUgdHJpZ2dlciBpcyBub3Qgc2V0XCI7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlJ1biBpZiAnXCIgKyB0aGlzLmtvTmFtZSgpICsgXCInIFwiICsgdGhpcy5nZXRPcGVyYXRvclRleHQoKSArIHRoaXMuZ2V0VmFsdWVUZXh0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0T3BlcmF0b3JUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBvcCA9IHRoaXMua29PcGVyYXRvcigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuYXZhaWxhYmxlT3BlcmF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5hdmFpbGFibGVPcGVyYXRvcnNbaV0ubmFtZSA9PSBvcCkgcmV0dXJuIHRoaXMuYXZhaWxhYmxlT3BlcmF0b3JzW2ldLnRleHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG9wO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFZhbHVlVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMua29SZXF1aXJlVmFsdWUoKSkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiBcIiBcIiArIHRoaXMua29WYWx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRyaWdnZXJPYmplY3RzIHtcclxuICAgICAgICBrb09iamVjdHM6IGFueTtcclxuICAgICAgICBrb0Nob29zZW46IGFueTtcclxuICAgICAgICBrb1NlbGVjdGVkOiBhbnk7XHJcbiAgICAgICAga29DaG9vc2VuU2VsZWN0ZWQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25EZWxldGVDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFkZENsaWNrOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHRpdGxlOiBzdHJpbmcsIGFsbE9iamVjdHM6IEFycmF5PHN0cmluZz4sIGNob29zZW5PYmplY3RzOiBBcnJheTxzdHJpbmc+KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29DaG9vc2VuID0ga28ub2JzZXJ2YWJsZUFycmF5KGNob29zZW5PYmplY3RzKTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYWxsT2JqZWN0cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBhbGxPYmplY3RzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGNob29zZW5PYmplY3RzLmluZGV4T2YoaXRlbSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyYXkucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cyA9IGtvLm9ic2VydmFibGVBcnJheShhcnJheSk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0Nob29zZW5TZWxlY3RlZCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZGVsZXRlSXRlbSgpOyB9XHJcbiAgICAgICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hZGRJdGVtKCk7IH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkZWxldGVJdGVtKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUl0ZW1zKHRoaXMua29DaG9vc2VuU2VsZWN0ZWQoKSwgdGhpcy5rb0Nob29zZW4sIHRoaXMua29PYmplY3RzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRJdGVtKCkge1xyXG4gICAgICAgICAgICB0aGlzLmNoYW5nZUl0ZW1zKHRoaXMua29TZWxlY3RlZCgpLCB0aGlzLmtvT2JqZWN0cywgdGhpcy5rb0Nob29zZW4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoYW5nZUl0ZW1zKGl0ZW06IHN0cmluZywgcmVtb3ZlZEZyb206IGFueSwgYWRkVG86IGFueSkge1xyXG4gICAgICAgICAgICByZW1vdmVkRnJvbS5yZW1vdmUoaXRlbSk7XHJcbiAgICAgICAgICAgIGFkZFRvLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIHJlbW92ZWRGcm9tLnNvcnQoKTtcclxuICAgICAgICAgICAgYWRkVG8uc29ydCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnMgZXh0ZW5kcyBTdXJ2ZXlQcm9wZXJ0eUFycmF5IHtcclxuICAgICAgICBwcml2YXRlIHZhbHVlXzogQXJyYXk8YW55PjtcclxuICAgICAgICBwcml2YXRlIHNlbGVjdGVkT2JqZWN0RWRpdG9yOiBTdXJ2ZXlPYmplY3RFZGl0b3I7XHJcbiAgICAgICAgcHVibGljIGtvSXRlbXM6IGFueTtcclxuICAgICAgICBwdWJsaWMga29TZWxlY3RlZDogYW55O1xyXG4gICAgICAgIHB1YmxpYyBhdmFpbGFibGVWYWxpZGF0b3JzOiBBcnJheTxzdHJpbmc+ID0gW107XHJcbiAgICAgICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BZGRDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFwcGx5Q2xpY2s6IGFueTtcclxuICAgICAgICBwcml2YXRlIHZhbGlkYXRvcnNDbGFzc2VzOiBBcnJheTxTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3M+ID0gW107XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBvblZhbHVlQ2hhbmdlZDogU3VydmV5UHJvcGVydHlWYWx1ZUNoYW5nZWRDYWxsYmFjaykge1xyXG4gICAgICAgICAgICBzdXBlcihvblZhbHVlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvciA9IG5ldyBTdXJ2ZXlPYmplY3RFZGl0b3IoKTtcclxuICAgICAgICAgICAgdGhpcy5zZWxlY3RlZE9iamVjdEVkaXRvci5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmFkZCgoc2VuZGVyLCBvcHRpb25zKSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uUHJvcGVydHlWYWx1ZUNoYW5nZWQob3B0aW9ucy5wcm9wZXJ0eSwgb3B0aW9ucy5vYmplY3QsIG9wdGlvbnMubmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCA9IGtvLm9ic2VydmFibGUobnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc2VsZWN0ZWRPYmplY3RFZGl0b3Iuc2VsZWN0ZWRPYmplY3QgPSBuZXdWYWx1ZSAhPSBudWxsID8gbmV3VmFsdWUudmFsaWRhdG9yIDogbnVsbDsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsaWRhdG9yc0NsYXNzZXMgPSBTdXJ2ZXkuSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYXZhaWxhYmxlVmFsaWRhdG9ycyA9IHRoaXMuZ2V0QXZhaWxhYmxlVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9uRGVsZXRlQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYua29JdGVtcy5yZW1vdmUoc2VsZi5rb1NlbGVjdGVkKCkpOyB9XHJcbiAgICAgICAgICAgIHRoaXMub25BZGRDbGljayA9IGZ1bmN0aW9uICh2YWxpZGF0b3JUeXBlKSB7IHNlbGYuYWRkSXRlbSh2YWxpZGF0b3JUeXBlKTsgfVxyXG4gICAgICAgICAgICB0aGlzLm9uQXBwbHlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5hcHBseSgpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCk6IGFueSB7IHJldHVybiB0aGlzLnZhbHVlXzsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gbnVsbCB8fCAhQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHZhbHVlID0gW107XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICB2YXIganNvbk9iaiA9IG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3ModmFsdWVbaV0uZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgICAgIGpzb25PYmoudG9PYmplY3QodmFsdWVbaV0sIHZhbGlkYXRvcik7XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvckl0ZW0odmFsaWRhdG9yKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKGFycmF5Lmxlbmd0aCA+IDAgPyBhcnJheVswXSA6IG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFwcGx5KCkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmtvSXRlbXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZV8ucHVzaChhcnJheVtpXS52YWxpZGF0b3IpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsdWVDaGFuZ2VkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKHRoaXMudmFsdWVfKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZEl0ZW0odmFsaWRhdG9yVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdWYWxpZGF0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JJdGVtKFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKHZhbGlkYXRvclR5cGUpKTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zLnB1c2gobmV3VmFsaWRhdG9yKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG5ld1ZhbGlkYXRvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0QXZhaWxhYmxlVmFsaWRhdG9ycygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMudmFsaWRhdG9yc0NsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMudmFsaWRhdG9yc0NsYXNzZXNbaV0ubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvblByb3BlcnR5VmFsdWVDaGFuZ2VkKHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvYmo6IGFueSwgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5rb1NlbGVjdGVkKCkgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQoKS52YWxpZGF0b3JbcHJvcGVydHkubmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVByb3BlcnR5VmFsaWRhdG9ySXRlbSB7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdmFsaWRhdG9yOiBTdXJ2ZXkuU3VydmV5VmFsaWRhdG9yKSB7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHZhbGlkYXRvci5nZXRUeXBlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGVudW0gT2JqVHlwZSB7IFVua25vd24sIFN1cnZleSwgUGFnZSwgUXVlc3Rpb24gfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUhlbHBlciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXROZXdOYW1lKG9ianM6IEFycmF5PGFueT4sIGJhc2VOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgaGFzaCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGhhc2hbb2Jqc1tpXS5uYW1lXSA9IHRydWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIG51bSA9IDE7XHJcbiAgICAgICAgICAgIHdoaWxlICh0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWhhc2hbYmFzZU5hbWUgKyBudW0udG9TdHJpbmcoKV0pIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgbnVtKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGJhc2VOYW1lICsgbnVtLnRvU3RyaW5nKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0T2JqZWN0VHlwZShvYmo6IGFueSk6IE9ialR5cGUge1xyXG4gICAgICAgICAgICBpZiAoIW9iaiB8fCAhb2JqW1wiZ2V0VHlwZVwiXSkgcmV0dXJuIE9ialR5cGUuVW5rbm93bjtcclxuICAgICAgICAgICAgaWYgKG9iai5nZXRUeXBlKCkgPT0gXCJwYWdlXCIpIHJldHVybiBPYmpUeXBlLlBhZ2U7XHJcbiAgICAgICAgICAgIGlmIChvYmouZ2V0VHlwZSgpID09IFwic3VydmV5XCIpIHJldHVybiBPYmpUeXBlLlN1cnZleTtcclxuICAgICAgICAgICAgaWYgKG9ialtcImtvVmFsdWVcIl0pIHJldHVybiBPYmpUeXBlLlF1ZXN0aW9uO1xyXG4gICAgICAgICAgICByZXR1cm4gT2JqVHlwZS5Vbmtub3duO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eUFycmF5cy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlIZWxwZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0UHJvcGVydHlWYWxpZGF0b3JzLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQcm9wZXJ0eVRleHRJdGVtcyBleHRlbmRzIFN1cnZleVByb3BlcnR5QXJyYXkge1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVfOiBBcnJheTxhbnk+O1xyXG4gICAgICAgIHB1YmxpYyBrb0l0ZW1zOiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uRGVsZXRlQ2xpY2s6IGFueTtcclxuICAgICAgICBwdWJsaWMgb25BZGRDbGljazogYW55O1xyXG4gICAgICAgIHB1YmxpYyBvbkFwcGx5Q2xpY2s6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG9uVmFsdWVDaGFuZ2VkOiBTdXJ2ZXlQcm9wZXJ0eVZhbHVlQ2hhbmdlZENhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG9uVmFsdWVDaGFuZ2VkKTtcclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVfID0gW107XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgc2VsZi5vbkFwcGx5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuQXBwbHkoKTsgfTtcclxuICAgICAgICAgICAgc2VsZi5vbkRlbGV0ZUNsaWNrID0gZnVuY3Rpb24gKGl0ZW0pIHsgc2VsZi5rb0l0ZW1zLnJlbW92ZShpdGVtKTsgfTtcclxuICAgICAgICAgICAgc2VsZi5vbkFkZENsaWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLkFkZEl0ZW0oKTsgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy52YWx1ZV87IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgIUFycmF5LmlzQXJyYXkodmFsdWUpKSB2YWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlXyA9IHZhbHVlO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB2YWx1ZVtpXTtcclxuICAgICAgICAgICAgICAgIHZhciBlZGl0SXRlbSA9IHsga29OYW1lOiBrby5vYnNlcnZhYmxlKGl0ZW0ubmFtZSksIGtvVGl0bGU6IGtvLm9ic2VydmFibGUoaXRlbS50aXRsZSkgfTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihlZGl0SXRlbSwgaXRlbS52YWxpZGF0b3JzKTtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goZWRpdEl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29JdGVtcyhhcnJheSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBZGRJdGVtKCkge1xyXG4gICAgICAgICAgICB2YXIgb2JqcyA9IFtdO1xyXG4gICAgICAgICAgICB2YXIgYXJyYXkgPSB0aGlzLmtvSXRlbXMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBhcnJheS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgb2Jqcy5wdXNoKHsgbmFtZTogYXJyYXlbaV0ua29OYW1lKCkgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIGVkaXRJdGVtID0geyBrb05hbWU6IGtvLm9ic2VydmFibGUoU3VydmV5SGVscGVyLmdldE5ld05hbWUob2JqcywgXCJ0ZXh0XCIpKSwga29UaXRsZToga28ub2JzZXJ2YWJsZSgpIH07XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihlZGl0SXRlbSwgW10pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMucHVzaChlZGl0SXRlbSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBBcHBseSgpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZV8gPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLmtvSXRlbXMoKS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSB0aGlzLmtvSXRlbXMoKVtpXTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtVGV4dCA9IG5ldyBTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbShpdGVtLmtvTmFtZSgpLCBpdGVtLmtvVGl0bGUoKSk7XHJcbiAgICAgICAgICAgICAgICBpdGVtVGV4dC52YWxpZGF0b3JzID0gaXRlbS52YWxpZGF0b3JzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZV8ucHVzaChpdGVtVGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWx1ZUNoYW5nZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQodGhpcy52YWx1ZV8pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlVmFsaWRhdG9yc0VkaXRvcihpdGVtOiBhbnksIHZhbGlkYXRvcnM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgaXRlbS52YWxpZGF0b3JzID0gdmFsaWRhdG9ycy5zbGljZSgpO1xyXG4gICAgICAgICAgICB2YXIgb25JdGVtQ2hhbmdlZCA9IGZ1bmN0aW9uIChuZXdWYWx1ZTogYW55KSB7IGl0ZW0udmFsaWRhdG9ycyA9IG5ld1ZhbHVlOyBpdGVtLmtvVGV4dChcIlsgSXRlbXM6IFwiICsgbmV3VmFsdWUubGVuZ3RoICsgXCIgXVwiKTsgfTtcclxuICAgICAgICAgICAgaXRlbS5hcnJheUVkaXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eVZhbGlkYXRvcnMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICBpdGVtLmFycmF5RWRpdG9yLm9iamVjdCA9IGl0ZW07XHJcbiAgICAgICAgICAgIGl0ZW0uYXJyYXlFZGl0b3IudGl0bGUoXCJFZGl0IHByb3BlcnR5ICdWYWxpZGF0b3JzJ1wiKTtcclxuICAgICAgICAgICAgaXRlbS5hcnJheUVkaXRvci52YWx1ZSA9IGl0ZW0udmFsaWRhdG9ycztcclxuICAgICAgICAgICAgaXRlbS5rb1RleHQgPSBrby5vYnNlcnZhYmxlKFwiWyBJdGVtczogXCIgKyB2YWxpZGF0b3JzLmxlbmd0aCArIFwiIF1cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5SXRlbVZhbHVlcy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eVRyaWdnZXJzLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5VmFsaWRhdG9ycy50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJvYmplY3RQcm9wZXJ0eVRleHRJdGVtcy50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuXHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IChwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHksIG5ld1ZhbHVlOiBhbnkpID0+IHZvaWQ7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBwcml2YXRlIG9iamVjdFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlVXBkYXRpbmc6IGJvb2xlYW47XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMga29WYWx1ZTogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb1RleHQ6IGFueTtcclxuICAgICAgICBwdWJsaWMgYXJyYXlFZGl0b3I6IFN1cnZleVByb3BlcnR5QXJyYXk7XHJcbiAgICAgICAgcHVibGljIGtvSXNEZWZhdWx0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGVkaXRvclR5cGU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgY2hvaWNlczogQXJyYXk8YW55PjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5OiBTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LCBvblByb3BlcnR5Q2hhbmdlZDogU3VydmV5T25Qcm9wZXJ0eUNoYW5nZWRDYWxsYmFjayA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5uYW1lID0gdGhpcy5wcm9wZXJ0eS5uYW1lO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMuZWRpdG9yVHlwZSA9IHByb3BlcnR5LnR5cGU7XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlcyA9IHByb3BlcnR5LmNob2ljZXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNob2ljZXMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lZGl0b3JUeXBlID0gXCJkcm9wZG93blwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvciA9IG51bGw7XHJcbiAgICAgICAgICAgIHZhciBvbkl0ZW1DaGFuZ2VkID0gZnVuY3Rpb24gKG5ld1ZhbHVlOiBhbnkpIHsgc2VsZi5rb1ZhbHVlKG5ld1ZhbHVlKTsgfTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZWRpdG9yVHlwZSA9PSBcIml0ZW12YWx1ZXNcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvciA9IG5ldyBTdXJ2ZXlQcm9wZXJ0eUl0ZW1WYWx1ZXMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvclR5cGUgPT0gXCJ0cmlnZ2Vyc1wiKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFycmF5RWRpdG9yID0gbmV3IFN1cnZleVByb3BlcnR5VHJpZ2dlcnMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVkaXRvclR5cGUgPT0gXCJ2YWxpZGF0b3JzXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlWYWxpZGF0b3JzKChuZXdWYWx1ZTogYW55KSA9PiB7IG9uSXRlbUNoYW5nZWQobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5lZGl0b3JUeXBlID09IFwidGV4dGl0ZW1zXCIpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IgPSBuZXcgU3VydmV5UHJvcGVydHlUZXh0SXRlbXMoKG5ld1ZhbHVlOiBhbnkpID0+IHsgb25JdGVtQ2hhbmdlZChuZXdWYWx1ZSk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5vYmplY3QgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYub2JqZWN0W3NlbGYubmFtZV0gPT0gbmV3VmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIGlmIChvblByb3BlcnR5Q2hhbmdlZCAhPSBudWxsICYmICFzZWxmLmlzVmFsdWVVcGRhdGluZykgb25Qcm9wZXJ0eUNoYW5nZWQoc2VsZiwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb1RleHQgPSBrby5jb21wdXRlZCgoKSA9PiB7IHJldHVybiBzZWxmLmdldFZhbHVlVGV4dChzZWxmLmtvVmFsdWUoKSk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNEZWZhdWx0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5wcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShzZWxmLmtvVmFsdWUoKSk7IH0pOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMub2JqZWN0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9iamVjdCh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMub2JqZWN0VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWYWx1ZSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlVmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKHRoaXMub2JqZWN0W3RoaXMubmFtZV0pO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5hcnJheUVkaXRvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hcnJheUVkaXRvci5vYmplY3QgPSB0aGlzLm9iamVjdDtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IudGl0bGUoXCJFZGl0IHByb3BlcnR5ICdcIiArIHRoaXMucHJvcGVydHkubmFtZSArIFwiJ1wiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuYXJyYXlFZGl0b3IudmFsdWUgPSB0aGlzLmtvVmFsdWUoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0VmFsdWVUZXh0KHZhbHVlOiBhbnkpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFwiWyBJdGVtczogXCIrIHZhbHVlLmxlbmd0aCArIFwiIF1cIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFByb3BlcnR5LnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEVkaXRvciB7XHJcbiAgICAgICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdFZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvUHJvcGVydGllczogYW55O1xyXG4gICAgICAgIHB1YmxpYyBrb0FjdGl2ZVByb3BlcnR5OiBhbnk7XHJcbiAgICAgICAgcHVibGljIGtvSGFzT2JqZWN0OiBhbnk7XHJcbiAgICAgICAgcHVibGljIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQ6IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IFN1cnZleS5FdmVudDwoc2VuZGVyOiBTdXJ2ZXlPYmplY3RFZGl0b3IsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUHJvcGVydGllcyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvQWN0aXZlUHJvcGVydHkgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29IYXNPYmplY3QgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc2VsZWN0ZWRPYmplY3QoKTogYW55IHsgcmV0dXJuIHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc2VsZWN0ZWRPYmplY3QodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZWxlY3RlZE9iamVjdFZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMua29IYXNPYmplY3QodmFsdWUgIT0gbnVsbCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVByb3BlcnRpZXMoKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQcm9wZXJ0eUVkaXRvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmtvUHJvcGVydGllcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGFuZ2VBY3RpdmVQcm9wZXJ0eShwcm9wZXJ0eTogU3VydmV5T2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0FjdGl2ZVByb3BlcnR5KHByb3BlcnR5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIE9iamVjdENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUHJvcGVydGllc09iamVjdCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdXBkYXRlUHJvcGVydGllcygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnNlbGVjdGVkT2JqZWN0IHx8ICF0aGlzLnNlbGVjdGVkT2JqZWN0LmdldFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Qcm9wZXJ0aWVzKFtdKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eShudWxsKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXModGhpcy5zZWxlY3RlZE9iamVjdC5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICBwcm9wZXJ0aWVzLnNvcnQoKGEsIGIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChhLm5hbWUgPT0gYi5uYW1lKSByZXR1cm4gMDtcclxuICAgICAgICAgICAgICAgIGlmIChhLm5hbWUgPiBiLm5hbWUpIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdmFyIG9iamVjdFByb3BlcnRpZXMgPSBbXTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB2YXIgcHJvcEV2ZW50ID0gKHByb3BlcnR5OiBTdXJ2ZXlPYmplY3RQcm9wZXJ0eSwgbmV3VmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkLmZpcmUodGhpcywgeyBwcm9wZXJ0eTogcHJvcGVydHkucHJvcGVydHksIG9iamVjdDogcHJvcGVydHkub2JqZWN0LCBuZXdWYWx1ZTogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLmNhblNob3dQcm9wZXJ0eShwcm9wZXJ0aWVzW2ldKSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqZWN0UHJvcGVydHkgPSBuZXcgU3VydmV5T2JqZWN0UHJvcGVydHkocHJvcGVydGllc1tpXSwgcHJvcEV2ZW50KTtcclxuICAgICAgICAgICAgICAgIG9iamVjdFByb3BlcnRpZXMucHVzaChvYmplY3RQcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb1Byb3BlcnRpZXMob2JqZWN0UHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29BY3RpdmVQcm9wZXJ0eSh0aGlzLmdldFByb3BlcnR5RWRpdG9yKFwibmFtZVwiKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjYW5TaG93UHJvcGVydHkocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBwcm9wZXJ0eS5uYW1lO1xyXG4gICAgICAgICAgICBpZiAobmFtZSA9PSAncXVlc3Rpb25zJyB8fCBuYW1lID09ICdwYWdlcycpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQcm9wZXJ0aWVzT2JqZWN0KCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMua29Qcm9wZXJ0aWVzKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllc1tpXS5vYmplY3QgPSB0aGlzLnNlbGVjdGVkT2JqZWN0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZGVjbGFyZSB0eXBlIFN1cnZleUFkZE5ld1BhZ2VDYWxsYmFjayA9ICgpID0+IHZvaWQ7XHJcbiAgICBkZWNsYXJlIHR5cGUgU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB2b2lkO1xyXG4gICAgZGVjbGFyZSB0eXBlIFN1cnZleU1vdmVQYWdlQ2FsbGJhY2sgPSAoaW5kZXhGcm9tOiBudW1iZXIsIGluZGV4VG86IG51bWJlcikgPT4gdm9pZDtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlQYWdlc0VkaXRvciB7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcbiAgICAgICAga29QYWdlczogYW55O1xyXG4gICAgICAgIGtvSXNWYWxpZDogYW55O1xyXG4gICAgICAgIHNlbGVjdFBhZ2VDbGljazogYW55O1xyXG4gICAgICAgIG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgb25TZWxlY3RQYWdlQ2FsbGJhY2s6IFN1cnZleVNlbGVjdFBhZ2VDYWxsYmFjaztcclxuICAgICAgICBvbk1vdmVQYWdlQ2FsbGJhY2s6IFN1cnZleU1vdmVQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgZHJhZ2dpbmdQYWdlOiBTdXJ2ZXkuUGFnZSA9IG51bGw7XHJcbiAgICAgICAgZHJhZ1N0YXJ0OiBhbnk7IGRyYWdPdmVyOiBhbnk7IGRyYWdFbmQ6IGFueTsgZHJhZ0Ryb3A6IGFueTsgXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKG9uQWRkTmV3UGFnZUNhbGxiYWNrOiBTdXJ2ZXlBZGROZXdQYWdlQ2FsbGJhY2sgPSBudWxsLCBvblNlbGVjdFBhZ2VDYWxsYmFjazogU3VydmV5U2VsZWN0UGFnZUNhbGxiYWNrID0gbnVsbCxcclxuICAgICAgICAgICAgb25Nb3ZlUGFnZUNhbGxiYWNrOiBTdXJ2ZXlNb3ZlUGFnZUNhbGxiYWNrID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvUGFnZXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzVmFsaWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgdGhpcy5vbkFkZE5ld1BhZ2VDYWxsYmFjayA9IG9uQWRkTmV3UGFnZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICB0aGlzLm9uU2VsZWN0UGFnZUNhbGxiYWNrID0gb25TZWxlY3RQYWdlQ2FsbGJhY2s7XHJcbiAgICAgICAgICAgIHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrID0gb25Nb3ZlUGFnZUNhbGxiYWNrO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0UGFnZUNsaWNrID0gZnVuY3Rpb24ocGFnZUl0ZW0pIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLm9uU2VsZWN0UGFnZUNhbGxiYWNrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vblNlbGVjdFBhZ2VDYWxsYmFjayhwYWdlSXRlbS5wYWdlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRyYWdTdGFydCA9IGZ1bmN0aW9uIChlbDogU3VydmV5LlBhZ2UpIHsgc2VsZi5kcmFnZ2luZ1BhZ2UgPSBlbDsgfTtcclxuICAgICAgICAgICAgdGhpcy5kcmFnT3ZlciA9IGZ1bmN0aW9uIChlbDogU3VydmV5LlBhZ2UpIHsgIH07XHJcbiAgICAgICAgICAgIHRoaXMuZHJhZ0VuZCA9IGZ1bmN0aW9uICgpIHsgc2VsZi5kcmFnZ2luZ1BhZ2UgPSBudWxsOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGVsOiBTdXJ2ZXkuUGFnZSkgeyBzZWxmLm1vdmVEcmFnZ2luZ1BhZ2VUbyhlbCk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzVmFsaWQodGhpcy5zdXJ2ZXlWYWx1ZSAhPSBudWxsKTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0U2VsZWN0ZWRQYWdlKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBwYWdlc1tpXS5rb1NlbGVjdGVkKHBhZ2VzW2ldLnBhZ2UgPT0gcGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZE5ld1BhZ2VDbGljaygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25BZGROZXdQYWdlQ2FsbGJhY2soKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEluZGV4QnlQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1BhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNoYW5nZU5hbWUocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJbmRleEJ5UGFnZShwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29QYWdlcygpW2luZGV4XS50aXRsZShwYWdlLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRJbmRleEJ5UGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlcyA9IHRoaXMua29QYWdlcygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZXNbaV0ucGFnZSA9PSBwYWdlKSByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVQYWdlcygpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1BhZ2VzKFtdKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcGFnZXMgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleVZhbHVlLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuc3VydmV5VmFsdWUucGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICBwYWdlcy5wdXNoKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZToga28ub2JzZXJ2YWJsZShwYWdlLm5hbWUpLCBwYWdlOiBwYWdlLCBrb1NlbGVjdGVkOiBrby5vYnNlcnZhYmxlKGZhbHNlKVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb1BhZ2VzKHBhZ2VzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBtb3ZlRHJhZ2dpbmdQYWdlVG8odG9QYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICBpZiAodG9QYWdlID09IG51bGwgfHwgdG9QYWdlID09IHRoaXMuZHJhZ2dpbmdQYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRyYWdnaW5nUGFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZHJhZ2dpbmdQYWdlID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5rb1BhZ2VzKCkuaW5kZXhPZih0aGlzLmRyYWdnaW5nUGFnZSk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleFRvID0gdGhpcy5rb1BhZ2VzKCkuaW5kZXhPZih0b1BhZ2UpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vbk1vdmVQYWdlQ2FsbGJhY2spIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25Nb3ZlUGFnZUNhbGxiYWNrKGluZGV4LCBpbmRleFRvKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgY2xhc3MgVGV4dFBhcnNlclByb3Blcnkge1xyXG4gICAgICAgIGlzRm91bmQ6IGJvb2xlYW47XHJcbiAgICAgICAgcHJvcGVydGllc0NvdW50OiBudW1iZXI7XHJcbiAgICAgICAgc3RhcnQ6IG51bWJlcjtcclxuICAgICAgICBlbmQ6IG51bWJlcjtcclxuICAgICAgICB2YWx1ZVN0YXJ0OiBudW1iZXI7XHJcbiAgICAgICAgdmFsdWVFbmQ6IG51bWJlcjtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VGV4dFdvcmtlciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBuZXdMaW5lQ2hhcjogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBlcnJvcnM6IEFycmF5PGFueT47XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlWYWx1ZTogU3VydmV5LlN1cnZleTtcclxuICAgICAgICBwcml2YXRlIGpzb25WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5T2JqZWN0czogQXJyYXk8YW55PjtcclxuICAgICAgICBwcml2YXRlIGlzU3VydmV5QXNQYWdlOiBib29sZWFuO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2VzcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzSnNvbkNvcnJlY3QoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlICYmICF0aGlzLnN1cnZleVZhbHVlLmlzRW1wdHk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgcHJvY2VzcygpIHtcclxuICAgICAgICAgICAgdHJ5IHtcclxuICAgICAgICAgICAgICAgIHRoaXMuanNvblZhbHVlID0gbmV3IFN1cnZleUpTT041KDEpLnBhcnNlKHRoaXMudGV4dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHsgcG9zOiB7IHN0YXJ0OiBlcnJvci5hdCwgZW5kOiAtMSB9LCB0ZXh0OiBlcnJvci5tZXNzYWdlIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmpzb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUpzb25Qb3NpdGlvbnModGhpcy5qc29uVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkuU3VydmV5KHRoaXMuanNvblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVZhbHVlLmpzb25FcnJvcnMgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXlWYWx1ZS5qc29uRXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuc3VydmV5VmFsdWUuanNvbkVycm9yc1tpXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7IHBvczogeyBzdGFydDogZXJyb3IuYXQsIGVuZDogLTEgfSwgdGV4dDogZXJyb3IuZ2V0RnVsbERlc2NyaXB0aW9uKCkgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cyA9IHRoaXMuY3JlYXRlU3VydmV5T2JqZWN0cygpO1xyXG4gICAgICAgICAgICB0aGlzLnNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KHRoaXMuc3VydmV5T2JqZWN0cyk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0RWRpdG9yUG9zaXRpb25CeUNoYXJ0QXQodGhpcy5lcnJvcnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZUpzb25Qb3NpdGlvbnMoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGpzb25PYmpbXCJwb3NcIl1bXCJzZWxmXCJdID0ganNvbk9iajtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBqc29uT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICBpZiAob2JqICYmIG9ialtcInBvc1wiXSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGpzb25PYmpbXCJwb3NcIl1ba2V5XSA9IG9ialtcInBvc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZUpzb25Qb3NpdGlvbnMob2JqKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZVN1cnZleU9iamVjdHMoKTogQXJyYXk8YW55PiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5VmFsdWUgPT0gbnVsbCkgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgdGhpcy5pc1N1cnZleUFzUGFnZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuc3VydmV5VmFsdWUucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXlWYWx1ZS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpID09IDAgJiYgIXBhZ2VbXCJwb3NcIl0pIHtcclxuICAgICAgICAgICAgICAgICAgICBwYWdlW1wicG9zXCJdID0gdGhpcy5zdXJ2ZXlWYWx1ZVtcInBvc1wiXTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmlzU3VydmV5QXNQYWdlID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHBhZ2UucXVlc3Rpb25zW2pdKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEVkaXRvclBvc2l0aW9uQnlDaGFydEF0KG9iamVjdHM6IGFueVtdKSB7XHJcbiAgICAgICAgICAgIGlmIChvYmplY3RzID09IG51bGwgfHwgb2JqZWN0cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcG9zaXRpb24gPSB7IHJvdzogMCwgY29sdW1uOiAwIH07XHJcbiAgICAgICAgICAgIHZhciBhdE9iamVjdHNBcnJheSA9IHRoaXMuZ2V0QXRBcnJheShvYmplY3RzKTtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0QXQ6IG51bWJlciA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXRPYmplY3RzQXJyYXkubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBhdCA9IGF0T2JqZWN0c0FycmF5W2ldLmF0O1xyXG4gICAgICAgICAgICAgICAgcG9zaXRpb24gPSB0aGlzLmdldFBvc3Rpb25CeUNoYXJ0QXQocG9zaXRpb24sIHN0YXJ0QXQsIGF0KTtcclxuICAgICAgICAgICAgICAgIHZhciBvYmogPSBhdE9iamVjdHNBcnJheVtpXS5vYmo7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW9iai5wb3NpdGlvbikgb2JqLnBvc2l0aW9uID0ge307XHJcbiAgICAgICAgICAgICAgICBpZiAoYXQgPT0gb2JqLnBvcy5zdGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9iai5wb3NpdGlvbi5zdGFydCA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoYXQgPT0gb2JqLnBvcy5lbmQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqLnBvc2l0aW9uLmVuZCA9IHBvc2l0aW9uO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHN0YXJ0QXQgPSBhdDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFBvc3Rpb25CeUNoYXJ0QXQoc3RhcnRQb3NpdGlvbjogQWNlQWpheC5Qb3NpdGlvbiwgc3RhcnRBdDogbnVtYmVyLCBhdDogbnVtYmVyKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgcm93OiBzdGFydFBvc2l0aW9uLnJvdywgY29sdW1uOiBzdGFydFBvc2l0aW9uLmNvbHVtbiB9O1xyXG4gICAgICAgICAgICB2YXIgY3VyQ2hhciA9IHN0YXJ0QXQ7XHJcbiAgICAgICAgICAgIHdoaWxlIChjdXJDaGFyIDwgYXQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnRleHQuY2hhckF0KGN1ckNoYXIpID09IFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucm93Kys7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LmNvbHVtbiA9IDA7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5jb2x1bW4rKztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGN1ckNoYXIrKztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEF0QXJyYXkob2JqZWN0czogYW55W10pOiBhbnlbXSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0gb2JqZWN0c1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBwb3MgPSBvYmoucG9zO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwb3MpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goeyBhdDogcG9zLnN0YXJ0LCBvYmo6IG9iaiB9KTtcclxuICAgICAgICAgICAgICAgIGlmIChwb3MuZW5kID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgYXQ6IHBvcy5lbmQsIG9iajogb2JqIH0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuc29ydCgoZWwxLCBlbDIpID0+IHtcclxuICAgICAgICAgICAgICAgIGlmIChlbDEuYXQgPiBlbDIuYXQpIHJldHVybiAxO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVsMS5hdCA8IGVsMi5hdCkgcmV0dXJuIC0xO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJzIHtcclxuICAgICAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG4gICAgICAgIHByaXZhdGUgb2JqVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNDbGFzc2VzOiBBcnJheTxzdHJpbmc+O1xyXG4gICAgICAgIGtvVmVyYnM6IGFueTtcclxuICAgICAgICBrb0hhc1ZlcmJzOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WZXJicyA9IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzVmVyYnMgPSBrby5vYnNlcnZhYmxlKCk7XHJcbiAgICAgICAgICAgIHZhciBjbGFzc2VzID0gU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKFwic2VsZWN0YmFzZVwiLCB0cnVlKTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzQ2xhc3NlcyA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2hvaWNlc0NsYXNzZXMucHVzaChjbGFzc2VzW2ldLm5hbWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkgeyByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgc3VydmV5KHZhbHVlOiBTdXJ2ZXkuU3VydmV5KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb2JqKCk6IGFueSB7IHJldHVybiB0aGlzLm9ialZhbHVlIH1cclxuICAgICAgICBwdWJsaWMgc2V0IG9iaih2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9ialZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMub2JqVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5idWlsZFZlcmJzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYnVpbGRWZXJicygpIHtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgICAgIHZhciBvYmpUeXBlID0gU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUodGhpcy5vYmopO1xyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSA8U3VydmV5LlF1ZXN0aW9uPnRoaXMub2JqO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5LnBhZ2VzLmxlbmd0aCA+IDEpIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKG5ldyBTdXJ2ZXlWZXJiQ2hhbmdlUGFnZUl0ZW0odGhpcy5zdXJ2ZXksIHF1ZXN0aW9uKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaG9pY2VzQ2xhc3Nlcy5pbmRleE9mKHF1ZXN0aW9uLmdldFR5cGUoKSkgPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFycmF5LnB1c2gobmV3IFN1cnZleVZlcmJDaGFuZ2VUeXBlSXRlbSh0aGlzLnN1cnZleSwgcXVlc3Rpb24pKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvVmVyYnMoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSGFzVmVyYnMoYXJyYXkubGVuZ3RoID4gMCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJJdGVtIHtcclxuICAgICAgICBrb0l0ZW1zOiBhbnk7XHJcbiAgICAgICAga29TZWxlY3RlZEl0ZW06IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbSA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmVyYkNoYW5nZVR5cGVJdGVtIGV4dGVuZHMgU3VydmV5VmVyYkl0ZW0ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBzdXJ2ZXk6IFN1cnZleS5TdXJ2ZXksIHB1YmxpYyBxdWVzdGlvbjogU3VydmV5LlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHN1cnZleSwgcXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB2YXIgY2xhc3NlcyA9IFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhcInNlbGVjdGJhc2VcIiwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHZhciBhcnJheSA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNsYXNzZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFycmF5LnB1c2goeyB2YWx1ZTogY2xhc3Nlc1tpXS5uYW1lLCB0ZXh0OiBjbGFzc2VzW2ldLm5hbWUgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb0l0ZW1zKGFycmF5KTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkSXRlbShxdWVzdGlvbi5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVR5cGUobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIkNoYW5nZSB0eXBlIFwiOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGFuZ2VUeXBlKHF1ZXN0aW9uVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvblR5cGUgPT0gdGhpcy5xdWVzdGlvbi5nZXRUeXBlKCkpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbih0aGlzLnF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gcGFnZS5xdWVzdGlvbnMuaW5kZXhPZih0aGlzLnF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIG5ld1F1ZXN0aW9uID0gU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIHRoaXMucXVlc3Rpb24ubmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBqc29uT2JqID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIHZhciBqc29uID0ganNvbk9iai50b0pzb25PYmplY3QodGhpcy5xdWVzdGlvbik7XHJcbiAgICAgICAgICAgIGpzb25PYmoudG9PYmplY3QoanNvbiwgbmV3UXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBwYWdlLnJlbW92ZVF1ZXN0aW9uKHRoaXMucXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBwYWdlLmFkZFF1ZXN0aW9uKG5ld1F1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZlcmJDaGFuZ2VQYWdlSXRlbSBleHRlbmRzIFN1cnZleVZlcmJJdGVtIHtcclxuICAgICAgICBwcml2YXRlIHByZXZQYWdlOiBTdXJ2ZXkuUGFnZTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgc3VydmV5OiBTdXJ2ZXkuU3VydmV5LCBwdWJsaWMgcXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihzdXJ2ZXksIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXkucGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHsgdmFsdWU6IHBhZ2UsIHRleHQ6IHBhZ2UubmFtZSB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvSXRlbXMoYXJyYXkpO1xyXG4gICAgICAgICAgICB0aGlzLnByZXZQYWdlID0gdGhpcy5zdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWRJdGVtKHRoaXMucHJldlBhZ2UpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZEl0ZW0uc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLmNoYW5nZVBhZ2UobmV3VmFsdWUpOyB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIkNoYW5nZSBwYWdlIFwiOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGFuZ2VQYWdlKG5ld1BhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdQYWdlID09IG51bGwgfHwgbmV3UGFnZSA9PSB0aGlzLnByZXZQYWdlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucHJldlBhZ2UucmVtb3ZlUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XHJcbiAgICAgICAgICAgIG5ld1BhZ2UuYWRkUXVlc3Rpb24odGhpcy5xdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIHRlbXBsYXRlX3BhZ2UgeyBleHBvcnQgdmFyIGh0bWwgPSAnPGRpdiBkYXRhLWJpbmQ9XCJldmVudDp7ICAgICAgICAgICBkcmFnZW50ZXI6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnRW50ZXIoZSk7fSwgICAgICAgICAgIGRyYWdsZWF2ZTpmdW5jdGlvbihlbCwgZSl7IGRyYWdMZWF2ZShlKTt9LCAgICAgICAgICAgZHJhZ292ZXI6ZnVuY3Rpb24oZWwsIGUpeyByZXR1cm4gZmFsc2U7fSwgICAgICAgICAgIGRyb3A6ZnVuY3Rpb24oZWwsIGUpeyBkcmFnRHJvcChlKTt9fSAgICAgXCI+ICAgIDxoNCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAodGl0bGUubGVuZ3RoID4gMCkgJiYgZGF0YS5zaG93UGFnZVRpdGxlcywgdGV4dDoga29ObygpICsgdGl0bGVcIj48L2g0PiAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb25zLCBhczogXFwncXVlc3Rpb25cXCcgfSAtLT4gICAgPGRpdiBjbGFzcz1cInN2ZF9kcmFnb3ZlclwiIGRhdGEtYmluZD1cInZpc2libGU6JHBhcmVudC5rb0RyYWdnaW5nKCkgPT0gJGluZGV4KClcIj48L2Rpdj4gICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb25cXCcsIGRhdGE6IHF1ZXN0aW9uIH0gLS0+ICAgIDwhLS0gL2tvIC0tPiAgICA8IS0tIC9rbyAtLT4gICAgPGRpdiBjbGFzcz1cIndlbGxcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiRyb290LmlzRGVzaWduTW9kZSAmJiBxdWVzdGlvbnMubGVuZ3RoID09IDBcIj4gICAgICAgIDxzcGFuPlBsZWFzZSBkcm9wIGEgcXVlc3Rpb24gaGVyZS48L3NwYW4+ICAgIDwvZGl2PiAgICA8ZGl2IGNsYXNzPVwic3ZkX2RyYWdvdmVyXCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb0RyYWdnaW5nKCkgPT0gcXVlc3Rpb25zLmxlbmd0aFwiPjwvZGl2PjwvZGl2Pic7fSIsIm1vZHVsZSB0ZW1wbGF0ZV9xdWVzdGlvbiB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwid2VsbCB3ZWxsLXNtXCIgZGF0YS1iaW5kPVwiYXR0ciA6IHtkcmFnZ2FibGU6ICRyb290LmlzRGVzaWduTW9kZX0sIHZpc2libGU6IHF1ZXN0aW9uLmtvVmlzaWJsZSgpIHx8ICRyb290LmlzRGVzaWduTW9kZSwgY2xpY2s6ICRyb290LmlzRGVzaWduTW9kZSA/IGtvT25DbGljazogbnVsbCwgY3NzOiB7c3ZkX3Ffc2VsZWN0ZWQgOiBrb0lzU2VsZWN0ZWR9LCAgICAgICAgIGV2ZW50OnsgICAgICAgICAgIGRyYWdzdGFydDpmdW5jdGlvbihlbCwgZSl7IGRyYWdTdGFydChlKTsgcmV0dXJuIHRydWU7IH0sICAgICAgICAgICBkcmFnb3ZlcjpmdW5jdGlvbihlbCwgZSl7IGRyYWdPdmVyKGUpO30sICAgICAgICAgICBkcm9wOmZ1bmN0aW9uKGVsLCBlKXsgZHJhZ0Ryb3AoZSk7fSAgICAgICAgIH1cIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJjc3M6e3N2ZF9xX2Rlc2lnbjogJHJvb3QuaXNEZXNpZ25Nb2RlfVwiPiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvRXJyb3JzKCkubGVuZ3RoID4gMCwgZm9yZWFjaDoga29FcnJvcnNcIj4gICAgICAgICAgICA8ZGl2PiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZXhjbGFtYXRpb24tc2lnblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDokZGF0YS5nZXRUZXh0KClcIj48L3NwYW4+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDxoNSBkYXRhLWJpbmQ9XCJ0ZXh0OiBxdWVzdGlvbi5rb05vKCkgKyAgKHF1ZXN0aW9uLmlzUmVxdWlyZWQgPyBxdWVzdGlvbi5kYXRhLnJlcXVpcmVkVGV4dCA6IFxcJ1xcJykgKyBxdWVzdGlvbi50aXRsZVwiPjwvaDU+ICAgICAgICA8IS0tIGtvIHRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1xdWVzdGlvbi1cXCcgKyBxdWVzdGlvbi5nZXRUeXBlKCksIGRhdGE6IHF1ZXN0aW9uIH0gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzQ29tbWVudFwiPiAgICAgICAgICAgIE90aGVyIChwbGVhc2UgZGVzY3JpYmUpICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogdHJ1ZSB9IH1cIj48L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj4nO30iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwib2JqZWN0RWRpdG9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInBhZ2VzRWRpdG9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRleHRXb3JrZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwic3VydmV5SGVscGVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIm9iamVjdFZlcmJzLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImRyYWdkcm9waGVscGVyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRlbXBsYXRlX3BhZ2UuaHRtbC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZV9xdWVzdGlvbi5odG1sLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUVkaXRvciB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyB1cGRhdGVUZXh0VGltZW91dDogbnVtYmVyID0gMTAwMDtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGRlZmF1bHROZXdTdXJ2ZXlUZXh0OiBzdHJpbmcgPSBcInsgcGFnZXM6IFsgeyBuYW1lOiAncGFnZTEnfV0gfVwiO1xyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyZWRFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuICAgICAgICBwcml2YXRlIHN1cnZleWpzOiBIVE1MRWxlbWVudDtcclxuICAgICAgICBwcml2YXRlIHN1cnZleWpzRXhhbXBsZTogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHByaXZhdGUganNvbkVkaXRvcjogQWNlQWpheC5FZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1Byb2Nlc3NpbmdJbW1lZGlhdGVseTogYm9vbGVhbjtcclxuICAgICAgICBwcml2YXRlIGlzVGV4dENoYW5nZWRGcm9tRGVzaWduZXI6IGJvb2xlYW47XHJcbiAgICAgICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdEVkaXRvcjogU3VydmV5T2JqZWN0RWRpdG9yO1xyXG4gICAgICAgIHByaXZhdGUgcGFnZXNFZGl0b3I6IFN1cnZleVBhZ2VzRWRpdG9yO1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5RW1iZWRpbmc6IFN1cnZleUVtYmVkaW5nV2luZG93XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlPYmplY3RzOiBTdXJ2ZXlPYmplY3RzO1xyXG4gICAgICAgIHByaXZhdGUgc3VydmV5VmVyYnM6IFN1cnZleVZlcmJzO1xyXG4gICAgICAgIHByaXZhdGUgdGV4dFdvcmtlcjogU3VydmV5VGV4dFdvcmtlcjtcclxuICAgICAgICBwcml2YXRlIHN1cnZleVZhbHVlOiBTdXJ2ZXkuU3VydmV5O1xyXG5cclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25UeXBlczogc3RyaW5nW107XHJcbiAgICAgICAga29Jc1Nob3dEZXNpZ25lcjogYW55O1xyXG4gICAgICAgIGtvQ2FuRGVsZXRlT2JqZWN0OiBhbnk7XHJcbiAgICAgICAga29PYmplY3RzOiBhbnk7IGtvU2VsZWN0ZWRPYmplY3Q6IGFueTtcclxuICAgICAgICBzZWxlY3REZXNpZ25lckNsaWNrOiBhbnk7IHNlbGVjdEVkaXRvckNsaWNrOiBhbnk7XHJcbiAgICAgICAgZGVsZXRlT2JqZWN0Q2xpY2s6IGFueTtcclxuICAgICAgICBydW5TdXJ2ZXlDbGljazogYW55OyBlbWJlZGluZ1N1cnZleUNsaWNrOiBhbnk7XHJcbiAgICAgICAgZHJhZ2dpbmdRdWVzdGlvbjogYW55OyBjbGlja1F1ZXN0aW9uOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHJlbmRlcmVkRWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uVHlwZXMgPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmdldEFsbFR5cGVzKCk7XHJcbiAgICAgICAgICAgIHRoaXMua29DYW5EZWxldGVPYmplY3QgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgICAgIHRoaXMua29PYmplY3RzID0ga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZE9iamVjdCA9IGtvLm9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkT2JqZWN0LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHsgc2VsZi5zZWxlY3RlZE9iamVjdENoYW5nZWQobmV3VmFsdWUgIT0gbnVsbCA/IG5ld1ZhbHVlLnZhbHVlIDogbnVsbCk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMgPSBuZXcgU3VydmV5T2JqZWN0cyh0aGlzLmtvT2JqZWN0cywgdGhpcy5rb1NlbGVjdGVkT2JqZWN0KTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmVyYnMgPSBuZXcgU3VydmV5VmVyYnMoKTtcclxuXHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3IgPSBuZXcgU3VydmV5T2JqZWN0RWRpdG9yKCk7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iub25Qcm9wZXJ0eVZhbHVlQ2hhbmdlZC5hZGQoKHNlbmRlciwgb3B0aW9ucykgPT4ge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vblByb3BlcnR5VmFsdWVDaGFuZ2VkKG9wdGlvbnMucHJvcGVydHksIG9wdGlvbnMub2JqZWN0LCBvcHRpb25zLm5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IgPSBuZXcgU3VydmV5UGFnZXNFZGl0b3IoKCkgPT4geyBzZWxmLmFkZFBhZ2UoKTsgfSwgKHBhZ2U6IFN1cnZleS5QYWdlKSA9PiB7IHNlbGYuc3VydmV5T2JqZWN0cy5zZWxlY3RPYmplY3QocGFnZSk7IH0sXHJcbiAgICAgICAgICAgICAgICAoaW5kZXhGcm9tOiBudW1iZXIsIGluZGV4VG86IG51bWJlcikgPT4geyBzZWxmLm1vdmVQYWdlKGluZGV4RnJvbSwgaW5kZXhUbyk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nID0gbmV3IFN1cnZleUVtYmVkaW5nV2luZG93KCk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmtvSXNTaG93RGVzaWduZXIgPSBrby5vYnNlcnZhYmxlKHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNlbGVjdERlc2lnbmVyQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0Rlc2lnbmVyKCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0RWRpdG9yQ2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd0pzb25FZGl0b3IoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5ydW5TdXJ2ZXlDbGljayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5zaG93TGl2ZVN1cnZleSgpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmVtYmVkaW5nU3VydmV5Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuc2hvd1N1cnZleUVtYmVkaW5nKCk7IH07XHJcbiAgICAgICAgICAgIHRoaXMuZGVsZXRlT2JqZWN0Q2xpY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYuZGVsZXRlQ3VycmVudE9iamVjdCgpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmRyYWdnaW5nUXVlc3Rpb24gPSBmdW5jdGlvbiAocXVlc3Rpb25UeXBlLCBlKSB7IHNlbGYuZG9EcmFnZ2luZ1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgZSk7IH1cclxuICAgICAgICAgICAgdGhpcy5jbGlja1F1ZXN0aW9uID0gZnVuY3Rpb24gKHF1ZXN0aW9uVHlwZSkgeyBzZWxmLmRvQ2xpY2tRdWVzdGlvbihxdWVzdGlvblR5cGUpOyB9XHJcblxyXG4gICAgICAgICAgICBpZiAocmVuZGVyZWRFbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleS5TdXJ2ZXkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5zdXJ2ZXlWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbmRlcihlbGVtZW50OiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQpIHJldHVybjtcclxuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZUVkaXRvci5rby5odG1sO1xyXG4gICAgICAgICAgICBzZWxmLmFwcGx5QmluZGluZygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmpzb25FZGl0b3IgIT0gbnVsbCA/IHRoaXMuanNvbkVkaXRvci5nZXRWYWx1ZSgpIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRUZXh0QW5kUHJvY2VzcygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMudGV4dDtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGltZW91dElkID4gMCkge1xyXG4gICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHRoaXMudGltZW91dElkKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGltZW91dElkID0gLTE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb2Nlc3NKc29uKHRleHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRleHQodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldFRleHRWYWx1ZSh2YWx1ZSwgMSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRUZXh0KHZhbHVlOiBzdHJpbmcsIGZpbmRUZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1RleHRDaGFuZ2VkRnJvbURlc2lnbmVyID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNUZXh0Q2hhbmdlZEZyb21EZXNpZ25lciA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IuZmluZChmaW5kVGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRQYWdlKCkge1xyXG4gICAgICAgICAgICB2YXIgbmFtZSA9IFN1cnZleUhlbHBlci5nZXROZXdOYW1lKHRoaXMuc3VydmV5LnBhZ2VzLCBcInBhZ2VcIik7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gdGhpcy5zdXJ2ZXlWYWx1ZS5hZGROZXdQYWdlKG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFBhZ2VUb1VJKHBhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG1vdmVQYWdlKGluZGV4RnJvbTogbnVtYmVyLCBpbmRleFRvOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpbmRleEZyb21dO1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdChwYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXkucGFnZXMuc3BsaWNlKGluZGV4VG8sIDAsIHBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFBhZ2VUb1VJKHBhZ2UpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZFBhZ2VUb1VJKHBhZ2U6IFN1cnZleS5QYWdlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3Iuc3VydmV5ID0gdGhpcy5zdXJ2ZXlWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLmFkZFBhZ2UocGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25RdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5nZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5hZGRRdWVzdGlvbihwYWdlLCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uUXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnJlbW92ZU9iamVjdChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uUHJvcGVydHlWYWx1ZUNoYW5nZWQocHJvcGVydHk6IFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHksIG9iajogYW55LCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBpc0RlZmF1bHQgPSBwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIG9ialtwcm9wZXJ0eS5uYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkubmFtZSA9PSBcIm5hbWVcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLm5hbWVDaGFuZ2VkKG9iaik7XHJcbiAgICAgICAgICAgICAgICBpZiAoU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSA9PSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLmNoYW5nZU5hbWUoPFN1cnZleS5QYWdlPm9iaik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93RGVzaWduZXIoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy50ZXh0V29ya2VyLmlzSnNvbkNvcnJlY3QpIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiUGxlYXNlIGNvcnJlY3QgSlNPTiFcIik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pbml0U3VydmV5KG5ldyBTdXJ2ZXkuSnNvbk9iamVjdCgpLnRvSnNvbk9iamVjdCh0aGlzLnRleHRXb3JrZXIuc3VydmV5KSk7XHJcbiAgICAgICAgICAgIHRoaXMua29Jc1Nob3dEZXNpZ25lcih0cnVlKTsgXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2hvd0pzb25FZGl0b3IoKSB7XHJcbiAgICAgICAgICAgIHZhciBqc29uID0gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuc3VydmV5KTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFZhbHVlKG5ldyBTdXJ2ZXlKU09ONSgpLnN0cmluZ2lmeShqc29uLCBudWxsLCAxKSk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5mb2N1cygpO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNTaG93RGVzaWduZXIoZmFsc2UpOyBcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZWxlY3RlZE9iamVjdENoYW5nZWQob2JqOiBTdXJ2ZXkuQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgY2FuRGVsZXRlT2JqZWN0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRPYmplY3RFZGl0b3Iuc2VsZWN0ZWRPYmplY3QgPSBvYmo7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmVyYnMub2JqID0gb2JqO1xyXG4gICAgICAgICAgICB2YXIgb2JqVHlwZSA9IFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaik7XHJcbiAgICAgICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXkuY3VycmVudFBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xyXG4gICAgICAgICAgICAgICAgY2FuRGVsZXRlT2JqZWN0ID0gdGhpcy5zdXJ2ZXkucGFnZXMubGVuZ3RoID4gMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0ob2JqKTtcclxuICAgICAgICAgICAgICAgIGNhbkRlbGV0ZU9iamVjdCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleS5jdXJyZW50UGFnZSA9IHRoaXMuc3VydmV5LmdldFBhZ2VCeVF1ZXN0aW9uKHRoaXMuc3VydmV5W1wic2VsZWN0ZWRRdWVzdGlvblZhbHVlXCJdKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5W1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXShudWxsKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvQ2FuRGVsZXRlT2JqZWN0KGNhbkRlbGV0ZU9iamVjdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0VGV4dFZhbHVlKHZhbHVlOiBzdHJpbmcsIHBvc2l0aW9uOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuanNvbkVkaXRvciA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaXNQcm9jZXNzaW5nSW1tZWRpYXRlbHkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2V0VmFsdWUodmFsdWUsIHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnJlbmRlcmVyLnVwZGF0ZUZ1bGwodHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMucHJvY2Vzc0pzb24odmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYXBwbHlCaW5kaW5nKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBrby5jbGVhbk5vZGUodGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlqcyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3VydmV5anNcIik7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvciA9IGFjZS5lZGl0KFwic3VydmV5anNFZGl0b3JcIik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzdXJ2ZXlqc0V4YW1wbGVcIik7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluaXRTdXJ2ZXkobmV3IFN1cnZleUpTT041KCkucGFyc2UoU3VydmV5RWRpdG9yLmRlZmF1bHROZXdTdXJ2ZXlUZXh0KSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUubW9kZSA9IFwiZGVzaWduZXJcIjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5yZW5kZXIodGhpcy5zdXJ2ZXlqcyk7XHJcblxyXG4gICAgICAgICAgICB0aGlzLmluaXRKc29uRWRpdG9yKCk7XHJcbiAgICAgICAgICAgIFN1cnZleVRleHRXb3JrZXIubmV3TGluZUNoYXIgPSB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5kb2MuZ2V0TmV3TGluZUNoYXJhY3RlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGluaXRKc29uRWRpdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5zZXRUaGVtZShcImFjZS90aGVtZS9tb25va2FpXCIpO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3Iuc2Vzc2lvbi5zZXRNb2RlKFwiYWNlL21vZGUvanNvblwiKTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLnNldFNob3dQcmludE1hcmdpbihmYWxzZSk7XHJcbiAgICAgICAgICAgIHRoaXMuanNvbkVkaXRvci5nZXRTZXNzaW9uKCkub24oXCJjaGFuZ2VcIiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi5vbkpzb25FZGl0b3JDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FZGl0b3IuZ2V0U2Vzc2lvbigpLnNldFVzZVdvcmtlcih0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpbml0U3VydmV5KGpzb246IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gbmV3IFN1cnZleS5TdXJ2ZXkoanNvbik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm1vZGUgPSBcImRlc2lnbmVyXCI7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcih0aGlzLnN1cnZleWpzKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlPYmplY3RzLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnN1cnZleSA9IHRoaXMuc3VydmV5O1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZSh0aGlzLnN1cnZleS5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmVyYnMuc3VydmV5ID0gdGhpcy5zdXJ2ZXk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZVtcIm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWRcIl0uYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5zdXJ2ZXlPYmplY3RzLnNlbGVjdE9iamVjdChzZW5kZXJbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSwgb3B0aW9ucykgPT4geyBzZWxmLnBhZ2VzRWRpdG9yLnNldFNlbGVjdGVkUGFnZShzZW5kZXIuY3VycmVudFBhZ2UpOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZS5vblF1ZXN0aW9uQWRkZWQuYWRkKChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnMpID0+IHsgc2VsZi5vblF1ZXN0aW9uQWRkZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlLm9uUXVlc3Rpb25SZW1vdmVkLmFkZCgoc2VuZGVyOiBTdXJ2ZXkuU3VydmV5LCBvcHRpb25zKSA9PiB7IHNlbGYub25RdWVzdGlvblJlbW92ZWQob3B0aW9ucy5xdWVzdGlvbik7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHRpbWVvdXRJZDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBvbkpzb25FZGl0b3JDaGFuZ2VkKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRpbWVvdXRJZCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICBjbGVhclRpbWVvdXQodGhpcy50aW1lb3V0SWQpO1xyXG4gICAgICAgICAgICB9ICAgXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUHJvY2Vzc2luZ0ltbWVkaWF0ZWx5KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy50aW1lb3V0SWQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnRpbWVvdXRJZCA9IC0xO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucHJvY2Vzc0pzb24oc2VsZi50ZXh0KTtcclxuICAgICAgICAgICAgICAgIH0sIFN1cnZleUVkaXRvci51cGRhdGVUZXh0VGltZW91dCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBwcm9jZXNzSnNvbih0ZXh0OiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHRXb3JrZXIgPSBuZXcgU3VydmV5VGV4dFdvcmtlcih0ZXh0KTtcclxuICAgICAgICAgICAgdGhpcy5qc29uRWRpdG9yLmdldFNlc3Npb24oKS5zZXRBbm5vdGF0aW9ucyh0aGlzLmNyZWF0ZUFubm90YXRpb25zKHRleHQsIHRoaXMudGV4dFdvcmtlci5lcnJvcnMpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb0RyYWdnaW5nUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIGUpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZSh0aGlzLnN1cnZleS5nZXRBbGxRdWVzdGlvbnMoKSwgXCJxdWVzdGlvblwiKTtcclxuICAgICAgICAgICAgbmV3IERyYWdEcm9wSGVscGVyKDxTdXJ2ZXkuSVN1cnZleT50aGlzLnN1cnZleSkuc3RhcnREcmFnTmV3UXVlc3Rpb24oZSwgcXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkb0NsaWNrUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIG5hbWUgPSBTdXJ2ZXlIZWxwZXIuZ2V0TmV3TmFtZSh0aGlzLnN1cnZleS5nZXRBbGxRdWVzdGlvbnMoKSwgXCJxdWVzdGlvblwiKTtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5jdXJyZW50UGFnZTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVtcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpbmRleCA9IHBhZ2UucXVlc3Rpb25zLmluZGV4T2YodGhpcy5zdXJ2ZXlbXCJzZWxlY3RlZFF1ZXN0aW9uVmFsdWVcIl0pICsgMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgICAgIHBhZ2UuYWRkUXVlc3Rpb24ocXVlc3Rpb24sIGluZGV4KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBkZWxldGVDdXJyZW50T2JqZWN0KCkge1xyXG4gICAgICAgICAgICB0aGlzLmRlbGV0ZU9iamVjdCh0aGlzLmtvU2VsZWN0ZWRPYmplY3QoKS52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZGVsZXRlT2JqZWN0KG9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5T2JqZWN0cy5yZW1vdmVPYmplY3Qob2JqKTtcclxuICAgICAgICAgICAgdmFyIG9ialR5cGUgPSBTdXJ2ZXlIZWxwZXIuZ2V0T2JqZWN0VHlwZShvYmopO1xyXG4gICAgICAgICAgICBpZiAob2JqVHlwZSA9PSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbW92ZVBhZ2Uob2JqKTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNFZGl0b3IucmVtb3ZlUGFnZShvYmopO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChvYmpUeXBlID09IE9ialR5cGUuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlLnJlbW92ZVF1ZXN0aW9uKG9iaik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleVtcInNldHNlbGVjdGVkUXVlc3Rpb25cIl0obnVsbCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleU9iamVjdHMuc2VsZWN0T2JqZWN0KHRoaXMuc3VydmV5LmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzaG93TGl2ZVN1cnZleSgpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cnZleWpzRXhhbXBsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIganNvbiA9IHRoaXMuZ2V0U3VydmV5SlNPTigpO1xyXG4gICAgICAgICAgICBpZiAoanNvbiAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5TdXJ2ZXkoanNvbik7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICBzdXJ2ZXkub25Db21wbGV0ZS5hZGQoKHNlbmRlcjogU3VydmV5LlN1cnZleSkgPT4geyBzZWxmLnN1cnZleWpzRXhhbXBsZS5pbm5lckhUTUwgPSBcIlN1cnZleSBSZXN1bHQ6IFwiICsgbmV3IFN1cnZleUpTT041KCkuc3RyaW5naWZ5KHN1cnZleS5kYXRhKTsgfSk7XHJcbiAgICAgICAgICAgICAgICBzdXJ2ZXkucmVuZGVyKHRoaXMuc3VydmV5anNFeGFtcGxlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5anNFeGFtcGxlLmlubmVySFRNTCA9IFwiUGxlYXNlIGNvcnJlY3QgSlNPTiFcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNob3dTdXJ2ZXlFbWJlZGluZygpIHtcclxuICAgICAgICAgICAgdmFyIGpzb24gPSB0aGlzLmdldFN1cnZleUpTT04oKTtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5qc29uID0ganNvbjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZy5zaG93KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0U3VydmV5SlNPTigpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5rb0lzU2hvd0Rlc2lnbmVyKCkpICByZXR1cm4gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMuc3VydmV5KTtcclxuICAgICAgICAgICAgaWYgKHRoaXMudGV4dFdvcmtlci5pc0pzb25Db3JyZWN0KSByZXR1cm4gbmV3IFN1cnZleS5Kc29uT2JqZWN0KCkudG9Kc29uT2JqZWN0KHRoaXMudGV4dFdvcmtlci5zdXJ2ZXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVBbm5vdGF0aW9ucyh0ZXh0OiBzdHJpbmcsIGVycm9yczogYW55W10pOiBBY2VBamF4LkFubm90YXRpb25bXSB7XHJcbiAgICAgICAgICAgIHZhciBhbm5vdGF0aW9ucyA9IG5ldyBBcnJheTxBY2VBamF4LkFubm90YXRpb24+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSBlcnJvcnNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgYW5ub3RhdGlvbjogQWNlQWpheC5Bbm5vdGF0aW9uID0geyByb3c6IGVycm9yLnBvc2l0aW9uLnN0YXJ0LnJvdywgY29sdW1uOiBlcnJvci5wb3NpdGlvbi5zdGFydC5jb2x1bW4sIHRleHQ6IGVycm9yLnRleHQsIHR5cGU6IFwiZXJyb3JcIiB9O1xyXG4gICAgICAgICAgICAgICAgYW5ub3RhdGlvbnMucHVzaChhbm5vdGF0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYW5ub3RhdGlvbnM7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIG5ldyBTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0KCkucmVwbGFjZVRleHQodGVtcGxhdGVfcGFnZS5odG1sLCBcInBhZ2VcIik7XHJcbiAgICBuZXcgU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCgpLnJlcGxhY2VUZXh0KHRlbXBsYXRlX3F1ZXN0aW9uLmh0bWwsIFwicXVlc3Rpb25cIik7XHJcblxyXG4gICAgU3VydmV5LlN1cnZleS5wcm90b3R5cGVbXCJvbkNyZWF0aW5nXCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlID0gbnVsbDtcclxuICAgICAgICB0aGlzLm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWQgPSBuZXcgU3VydmV5LkV2ZW50PChzZW5kZXI6IFN1cnZleS5TdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcblxyXG4gICAgfVxyXG4gICAgU3VydmV5LlN1cnZleS5wcm90b3R5cGVbXCJzZXRzZWxlY3RlZFF1ZXN0aW9uXCJdID0gZnVuY3Rpb24odmFsdWU6IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgIGlmICh2YWx1ZSA9PSB0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlO1xyXG4gICAgICAgIHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgaWYgKG9sZFZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgb2xkVmFsdWVbXCJvblNlbGVjdGVkUXVlc3Rpb25DaGFuZ2VkXCJdKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLnNlbGVjdGVkUXVlc3Rpb25WYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2VsZWN0ZWRRdWVzdGlvblZhbHVlW1wib25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZFwiXSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uU2VsZWN0ZWRRdWVzdGlvbkNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRTZWxlY3RlZFF1ZXN0aW9uJzogb2xkVmFsdWUsICduZXdTZWxlY3RlZFF1ZXN0aW9uJzogdmFsdWUgfSk7XHJcbiAgICB9XHJcbiAgICBTdXJ2ZXkuUGFnZS5wcm90b3R5cGVbXCJvbkNyZWF0aW5nXCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmRyYWdFbnRlckNvdW50ZXIgPSAwO1xyXG4gICAgICAgIHRoaXMua29EcmFnZ2luZyA9IGtvLm9ic2VydmFibGUoLTEpO1xyXG4gICAgICAgIHRoaXMua29EcmFnZ2luZy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IGlmIChuZXdWYWx1ZSA8IDApIHNlbGYuZHJhZ0VudGVyQ291bnRlciA9IDA7IH0pO1xyXG4gICAgICAgIHRoaXMuZHJhZ0VudGVyID0gZnVuY3Rpb24gKGUpIHsgZS5wcmV2ZW50RGVmYXVsdCgpOyBzZWxmLmRyYWdFbnRlckNvdW50ZXIrKzsgc2VsZi5kb0RyYWdFbnRlcihlKTsgfTtcclxuICAgICAgICB0aGlzLmRyYWdMZWF2ZSA9IGZ1bmN0aW9uIChlKSB7IHNlbGYuZHJhZ0VudGVyQ291bnRlci0tOyBpZiAoc2VsZi5kcmFnRW50ZXJDb3VudGVyID09PSAwKSBzZWxmLmtvRHJhZ2dpbmcoLTEpOyB9O1xyXG4gICAgICAgIHRoaXMuZHJhZ0Ryb3AgPSBmdW5jdGlvbiAoZSkgeyBzZWxmLmRvRHJvcChlKTsgfTtcclxuICAgIH1cclxuICAgIFN1cnZleS5QYWdlLnByb3RvdHlwZVtcImRvRHJvcFwiXSA9IGZ1bmN0aW9uIChlKSB7XHJcbiAgICAgICAgbmV3IERyYWdEcm9wSGVscGVyKHRoaXMuZGF0YSkuZG9Ecm9wKGUpO1xyXG4gICAgfVxyXG4gICAgU3VydmV5LlBhZ2UucHJvdG90eXBlW1wiZG9EcmFnRW50ZXJcIl0gPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zLmxlbmd0aCA+IDAgfHwgdGhpcy5rb0RyYWdnaW5nKCkgPiAwKSByZXR1cm47XHJcbiAgICAgICAgaWYgKG5ldyBEcmFnRHJvcEhlbHBlcih0aGlzLmRhdGEpLmlzU3VydmV5RHJhZ2dpbmcoZSkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb0RyYWdnaW5nKHRoaXMucXVlc3Rpb25zLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIFN1cnZleS5RdWVzdGlvbi5wcm90b3R5cGVbXCJvbkNyZWF0aW5nXCJdID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICB0aGlzLmRyYWdEcm9wSGVscGVyVmFsdWUgPSBudWxsO1xyXG4gICAgICAgIHRoaXMuZHJhZ0Ryb3BIZWxwZXIgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRyYWdEcm9wSGVscGVyVmFsdWUgPT0gbnVsbCkgdGhpcy5kcmFnRHJvcEhlbHBlclZhbHVlID0gbmV3IERyYWdEcm9wSGVscGVyKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRyYWdEcm9wSGVscGVyVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHRoaXMuZHJhZ092ZXIgPSBmdW5jdGlvbiAoZSkgeyBzZWxmLmRyYWdEcm9wSGVscGVyKCkuZG9EcmFnRHJvcE92ZXIoZSwgc2VsZik7IH1cclxuICAgICAgICB0aGlzLmRyYWdEcm9wID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLmRvRHJvcChlLCBzZWxmKTsgfVxyXG4gICAgICAgIHRoaXMuZHJhZ1N0YXJ0ID0gZnVuY3Rpb24gKGUpIHsgc2VsZi5kcmFnRHJvcEhlbHBlcigpLnN0YXJ0RHJhZ1F1ZXN0aW9uKGUsIHNlbGYubmFtZSk7IH1cclxuICAgICAgICB0aGlzLmtvSXNTZWxlY3RlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgIHRoaXMua29PbkNsaWNrID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICBpZiAoc2VsZi5kYXRhID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgc2VsZi5kYXRhW1wic2V0c2VsZWN0ZWRRdWVzdGlvblwiXSh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBTdXJ2ZXkuUXVlc3Rpb24ucHJvdG90eXBlW1wib25TZWxlY3RlZFF1ZXN0aW9uQ2hhbmdlZFwiXSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIGlmICh0aGlzLmRhdGEgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgIHRoaXMua29Jc1NlbGVjdGVkKHRoaXMuZGF0YVtcInNlbGVjdGVkUXVlc3Rpb25WYWx1ZVwiXSA9PSB0aGlzKTtcclxuICAgIH1cclxufVxyXG4iLCIvLyBUaGlzIGZpbGUgaXMgYmFzZWQgb24gSlNPTjUsIGh0dHA6Ly9qc29uNS5vcmcvXHJcbi8vIFRoZSBtb2RpZmljYXRpb24gZm9yIGdldHRpbmcgb2JqZWN0IGFuZCBwcm9wZXJ0aWVzIGxvY2F0aW9uICdhdCcgd2VyZSBtYWRlbi5cclxuXHJcbm1vZHVsZSBTdXJ2ZXlFZGl0b3Ige1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUpTT041IHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHBvc2l0aW9uTmFtZSA9IFwicG9zXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgZXNjYXBlZSA9IHtcclxuICAgICAgICAgICAgXCInXCI6IFwiJ1wiLFxyXG4gICAgICAgICAgICAnXCInOiAnXCInLFxyXG4gICAgICAgICAgICAnXFxcXCc6ICdcXFxcJyxcclxuICAgICAgICAgICAgJy8nOiAnLycsXHJcbiAgICAgICAgICAgICdcXG4nOiAnJywgICAgICAgLy8gUmVwbGFjZSBlc2NhcGVkIG5ld2xpbmVzIGluIHN0cmluZ3Mgdy8gZW1wdHkgc3RyaW5nXHJcbiAgICAgICAgICAgIGI6ICdcXGInLFxyXG4gICAgICAgICAgICBmOiAnXFxmJyxcclxuICAgICAgICAgICAgbjogJ1xcbicsXHJcbiAgICAgICAgICAgIHI6ICdcXHInLFxyXG4gICAgICAgICAgICB0OiAnXFx0J1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgd3MgPSBbXHJcbiAgICAgICAgICAgICcgJyxcclxuICAgICAgICAgICAgJ1xcdCcsXHJcbiAgICAgICAgICAgICdcXHInLFxyXG4gICAgICAgICAgICAnXFxuJyxcclxuICAgICAgICAgICAgJ1xcdicsXHJcbiAgICAgICAgICAgICdcXGYnLFxyXG4gICAgICAgICAgICAnXFx4QTAnLFxyXG4gICAgICAgICAgICAnXFx1RkVGRidcclxuICAgICAgICBdO1xyXG4gICAgICAgIHByaXZhdGUgZW5kQXQ6IG51bWJlcjtcclxuICAgICAgICBwcml2YXRlIGF0OiBudW1iZXI7ICAgICAvLyBUaGUgaW5kZXggb2YgdGhlIGN1cnJlbnQgY2hhcmFjdGVyXHJcbiAgICAgICAgcHJpdmF0ZSBjaDogYW55OyAgICAgLy8gVGhlIGN1cnJlbnQgY2hhcmFjdGVyXHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBwYXJzZVR5cGU6IG51bWJlcjsgLy8gMCAtIHN0YWRhcmQsIDEgLSBnZXQgaW5mb3JtYXRpb24gYWJvdXQgb2JqZWN0cywgMiAtIGdldCBpbmZvcm1hdGlvbiBhYm91dCBhbGwgcHJvcGVydGllc1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHBhcnNlVHlwZTogbnVtYmVyID0gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnBhcnNlVHlwZSA9IHBhcnNlVHlwZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHBhcnNlKHNvdXJjZTogYW55LCByZXZpdmVyOiBhbnkgPSBudWxsLCBzdGFydEZyb206IG51bWJlciA9IDAsIGVuZEF0OiBudW1iZXIgPSAtMSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQ7XHJcblxyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSBTdHJpbmcoc291cmNlKTtcclxuICAgICAgICAgICAgdGhpcy5hdCA9IHN0YXJ0RnJvbTtcclxuICAgICAgICAgICAgdGhpcy5lbmRBdCA9IGVuZEF0O1xyXG4gICAgICAgICAgICB0aGlzLmNoID0gJyAnO1xyXG4gICAgICAgICAgICByZXN1bHQgPSB0aGlzLnZhbHVlKCk7XHJcbiAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2gpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJTeW50YXggZXJyb3JcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIC8vIElmIHRoZXJlIGlzIGEgcmV2aXZlciBmdW5jdGlvbiwgd2UgcmVjdXJzaXZlbHkgd2FsayB0aGUgbmV3IHN0cnVjdHVyZSxcclxuICAgICAgICAgICAgLy8gcGFzc2luZyBlYWNoIG5hbWUvdmFsdWUgcGFpciB0byB0aGUgcmV2aXZlciBmdW5jdGlvbiBmb3IgcG9zc2libGVcclxuICAgICAgICAgICAgLy8gdHJhbnNmb3JtYXRpb24sIHN0YXJ0aW5nIHdpdGggYSB0ZW1wb3Jhcnkgcm9vdCBvYmplY3QgdGhhdCBob2xkcyB0aGUgcmVzdWx0XHJcbiAgICAgICAgICAgIC8vIGluIGFuIGVtcHR5IGtleS4gSWYgdGhlcmUgaXMgbm90IGEgcmV2aXZlciBmdW5jdGlvbiwgd2Ugc2ltcGx5IHJldHVybiB0aGVcclxuICAgICAgICAgICAgLy8gcmVzdWx0LlxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiByZXZpdmVyID09PSAnZnVuY3Rpb24nID8gKGZ1bmN0aW9uIHdhbGsoaG9sZGVyLCBrZXkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBrLCB2LCB2YWx1ZSA9IGhvbGRlcltrZXldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh2YWx1ZSwgaykpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHYgPSB3YWxrKHZhbHVlLCBrKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZVtrXSA9IHY7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRlbGV0ZSB2YWx1ZVtrXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiByZXZpdmVyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSAoeyAnJzogcmVzdWx0IH0sICcnKSkgOiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZXJyb3IobTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIC8vIENhbGwgZXJyb3Igd2hlbiBzb21ldGhpbmcgaXMgd3JvbmcuXHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IG5ldyBTeW50YXhFcnJvcigpO1xyXG4gICAgICAgICAgICBlcnJvci5tZXNzYWdlID0gbTtcclxuICAgICAgICAgICAgZXJyb3JbXCJhdFwiXSA9IHRoaXMuYXQ7XHJcbiAgICAgICAgICAgIHRocm93IGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5leHQoYzogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICAvLyBJZiBhIGMgcGFyYW1ldGVyIGlzIHByb3ZpZGVkLCB2ZXJpZnkgdGhhdCBpdCBtYXRjaGVzIHRoZSBjdXJyZW50IGNoYXJhY3Rlci5cclxuICAgICAgICAgICAgaWYgKGMgJiYgYyAhPT0gdGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIkV4cGVjdGVkICdcIiArIGMgKyBcIicgaW5zdGVhZCBvZiAnXCIgKyB0aGlzLmNoICsgXCInXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgdGhpcy5uZXh0IGNoYXJhY3Rlci4gV2hlbiB0aGVyZSBhcmUgbm8gbW9yZSBjaGFyYWN0ZXJzLFxyXG4gICAgICAgICAgICAvLyByZXR1cm4gdGhlIGVtcHR5IHN0cmluZy5cclxuICAgICAgICAgICAgdGhpcy5jaCA9IHRoaXMuY2hhcnRBdCgpO1xyXG4gICAgICAgICAgICB0aGlzLmF0ICs9IDE7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHBlZWsoKSB7XHJcbiAgICAgICAgICAgIC8vIEdldCB0aGUgdGhpcy5uZXh0IGNoYXJhY3RlciB3aXRob3V0IGNvbnN1bWluZyBpdCBvclxyXG4gICAgICAgICAgICAvLyBhc3NpZ25pbmcgaXQgdG8gdGhlIHRoaXMuY2ggdmFyYWlibGUuXHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNoYXJ0QXQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGFydEF0KCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lbmRBdCA+IC0xICYmIHRoaXMuYXQgPj0gdGhpcy5lbmRBdCkgcmV0dXJuICcnO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0LmNoYXJBdCh0aGlzLmF0KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpZGVudGlmaWVyKCkge1xyXG4gICAgICAgICAgICAvLyBQYXJzZSBhbiBpZGVudGlmaWVyLiBOb3JtYWxseSwgcmVzZXJ2ZWQgd29yZHMgYXJlIGRpc2FsbG93ZWQgaGVyZSwgYnV0IHdlXHJcbiAgICAgICAgICAgIC8vIG9ubHkgdXNlIHRoaXMgZm9yIHVucXVvdGVkIG9iamVjdCBrZXlzLCB3aGVyZSByZXNlcnZlZCB3b3JkcyBhcmUgYWxsb3dlZCxcclxuICAgICAgICAgICAgLy8gc28gd2UgZG9uJ3QgY2hlY2sgZm9yIHRob3NlIGhlcmUuIFJlZmVyZW5jZXM6XHJcbiAgICAgICAgICAgIC8vIC0gaHR0cDovL2VzNS5naXRodWIuY29tLyN4Ny42XHJcbiAgICAgICAgICAgIC8vIC0gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4vQ29yZV9KYXZhU2NyaXB0XzEuNV9HdWlkZS9Db3JlX0xhbmd1YWdlX0ZlYXR1cmVzI1ZhcmlhYmxlc1xyXG4gICAgICAgICAgICAvLyAtIGh0dHA6Ly9kb2NzdG9yZS5taWsudWEvb3JlbGx5L3dlYnByb2cvanNjcmlwdC9jaDAyXzA3Lmh0bVxyXG4gICAgICAgICAgICAvLyBUT0RPIElkZW50aWZpZXJzIGNhbiBoYXZlIFVuaWNvZGUgXCJsZXR0ZXJzXCIgaW4gdGhlbTsgYWRkIHN1cHBvcnQgZm9yIHRob3NlLlxyXG4gICAgICAgICAgICB2YXIga2V5ID0gdGhpcy5jaDtcclxuXHJcbiAgICAgICAgICAgIC8vIElkZW50aWZpZXJzIG11c3Qgc3RhcnQgd2l0aCBhIGxldHRlciwgXyBvciAkLlxyXG4gICAgICAgICAgICBpZiAoKHRoaXMuY2ggIT09ICdfJyAmJiB0aGlzLmNoICE9PSAnJCcpICYmXHJcbiAgICAgICAgICAgICAgICAodGhpcy5jaCA8ICdhJyB8fCB0aGlzLmNoID4gJ3onKSAmJlxyXG4gICAgICAgICAgICAgICAgKHRoaXMuY2ggPCAnQScgfHwgdGhpcy5jaCA+ICdaJykpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgaWRlbnRpZmllclwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gU3Vic2VxdWVudCBjaGFyYWN0ZXJzIGNhbiBjb250YWluIGRpZ2l0cy5cclxuICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIChcclxuICAgICAgICAgICAgICAgIHRoaXMuY2ggPT09ICdfJyB8fCB0aGlzLmNoID09PSAnJCcgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoID49ICdhJyAmJiB0aGlzLmNoIDw9ICd6JykgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoID49ICdBJyAmJiB0aGlzLmNoIDw9ICdaJykgfHxcclxuICAgICAgICAgICAgICAgICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5JykpKSB7XHJcbiAgICAgICAgICAgICAgICBrZXkgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGtleTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBudW1iZXIoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBQYXJzZSBhIG51bWJlciB2YWx1ZS5cclxuXHJcbiAgICAgICAgICAgIHZhciBudW1iZXIsXHJcbiAgICAgICAgICAgICAgICBzaWduID0gJycsXHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSAnJyxcclxuICAgICAgICAgICAgICAgIGJhc2UgPSAxMDtcclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLScgfHwgdGhpcy5jaCA9PT0gJysnKSB7XHJcbiAgICAgICAgICAgICAgICBzaWduID0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCh0aGlzLmNoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gc3VwcG9ydCBmb3IgSW5maW5pdHkgKGNvdWxkIHR3ZWFrIHRvIGFsbG93IG90aGVyIHdvcmRzKTpcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdJJykge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gdGhpcy53b3JkKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIG51bWJlciAhPT0gJ251bWJlcicgfHwgaXNOYU4obnVtYmVyKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ1VuZXhwZWN0ZWQgd29yZCBmb3IgbnVtYmVyJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKHNpZ24gPT09ICctJykgPyAtbnVtYmVyIDogbnVtYmVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvLyBzdXBwb3J0IGZvciBOYU5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdOJykge1xyXG4gICAgICAgICAgICAgICAgbnVtYmVyID0gdGhpcy53b3JkKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWlzTmFOKG51bWJlcikpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9yKCdleHBlY3RlZCB3b3JkIHRvIGJlIE5hTicpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gaWdub3JlIHNpZ24gYXMgLU5hTiBhbHNvIGlzIE5hTlxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcwJykge1xyXG4gICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAneCcgfHwgdGhpcy5jaCA9PT0gJ1gnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgYmFzZSA9IDE2O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoJ09jdGFsIGxpdGVyYWwnKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgc3dpdGNoIChiYXNlKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDEwOlxyXG4gICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9ICcuJztcclxuICAgICAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpICYmIHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ2UnIHx8IHRoaXMuY2ggPT09ICdFJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLScgfHwgdGhpcy5jaCA9PT0gJysnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHJpbmcgKz0gdGhpcy5jaDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoID49ICcwJyAmJiB0aGlzLmNoIDw9ICc5Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IHRoaXMuY2g7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgMTY6XHJcbiAgICAgICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPj0gJzAnICYmIHRoaXMuY2ggPD0gJzknIHx8IHRoaXMuY2ggPj0gJ0EnICYmIHRoaXMuY2ggPD0gJ0YnIHx8IHRoaXMuY2ggPj0gJ2EnICYmIHRoaXMuY2ggPD0gJ2YnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmIChzaWduID09PSAnLScpIHtcclxuICAgICAgICAgICAgICAgIG51bWJlciA9IC1zdHJpbmc7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBudW1iZXIgPSArc3RyaW5nO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiAoIWlzRmluaXRlKG51bWJlcikpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJCYWQgbnVtYmVyXCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG51bWJlcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHN0cmluZygpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGEgc3RyaW5nIHZhbHVlLlxyXG5cclxuICAgICAgICAgICAgdmFyIGhleCxcclxuICAgICAgICAgICAgICAgIGksXHJcbiAgICAgICAgICAgICAgICBzdHJpbmcgPSAnJyxcclxuICAgICAgICAgICAgICAgIGRlbGltLCAgICAgIC8vIGRvdWJsZSBxdW90ZSBvciBzaW5nbGUgcXVvdGVcclxuICAgICAgICAgICAgICAgIHVmZmZmO1xyXG5cclxuICAgICAgICAgICAgLy8gV2hlbiBwYXJzaW5nIGZvciBzdHJpbmcgdmFsdWVzLCB3ZSBtdXN0IGxvb2sgZm9yICcgb3IgXCIgYW5kIFxcIGNoYXJhY3RlcnMuXHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1wiJyB8fCB0aGlzLmNoID09PSBcIidcIikge1xyXG4gICAgICAgICAgICAgICAgZGVsaW0gPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMubmV4dCgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09IGRlbGltKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gc3RyaW5nO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xcXFwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ3UnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1ZmZmZiA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgNDsgaSArPSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaGV4ID0gcGFyc2VJbnQodGhpcy5uZXh0KCksIDE2KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAoIWlzRmluaXRlKGhleCkpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVmZmZmID0gdWZmZmYgKiAxNiArIGhleDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKHVmZmZmKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmNoID09PSAnXFxyJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGVlaygpID09PSAnXFxuJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBTdXJ2ZXlKU09ONS5lc2NhcGVlW3RoaXMuY2hdID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3RyaW5nICs9IFN1cnZleUpTT041LmVzY2FwZWVbdGhpcy5jaF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJ1xcbicpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gdW5lc2NhcGVkIG5ld2xpbmVzIGFyZSBpbnZhbGlkOyBzZWU6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGh0dHBzOi8vZ2l0aHViLmNvbS9hc2VlbWsvanNvbjUvaXNzdWVzLzI0XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIFRPRE8gdGhpcyBmZWVscyBzcGVjaWFsLWNhc2VkOyBhcmUgdGhlcmUgb3RoZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gaW52YWxpZCB1bmVzY2FwZWQgY2hhcnM/XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmluZyArPSB0aGlzLmNoO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIHN0cmluZ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpbmxpbmVDb21tZW50KCkge1xyXG5cclxuICAgICAgICAgICAgLy8gU2tpcCBhbiBpbmxpbmUgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGRcclxuICAgICAgICAgICAgLy8gYmUgdGhlIHNlY29uZCAvIGNoYXJhY3RlciBpbiB0aGUgLy8gcGFpciB0aGF0IGJlZ2lucyB0aGlzIGlubGluZSBjb21tZW50LlxyXG4gICAgICAgICAgICAvLyBUbyBmaW5pc2ggdGhlIGlubGluZSBjb21tZW50LCB3ZSBsb29rIGZvciBhIG5ld2xpbmUgb3IgdGhlIGVuZCBvZiB0aGUgdGV4dC5cclxuXHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZXJyb3IoXCJOb3QgYW4gaW5saW5lIGNvbW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcXG4nIHx8IHRoaXMuY2ggPT09ICdcXHInKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IHdoaWxlICh0aGlzLmNoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBibG9ja0NvbW1lbnQoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIGEgYmxvY2sgY29tbWVudCwgYXNzdW1pbmcgdGhpcyBpcyBvbmUuIFRoZSBjdXJyZW50IGNoYXJhY3RlciBzaG91bGQgYmVcclxuICAgICAgICAgICAgLy8gdGhlICogY2hhcmFjdGVyIGluIHRoZSAvKiBwYWlyIHRoYXQgYmVnaW5zIHRoaXMgYmxvY2sgY29tbWVudC5cclxuICAgICAgICAgICAgLy8gVG8gZmluaXNoIHRoZSBibG9jayBjb21tZW50LCB3ZSBsb29rIGZvciBhbiBlbmRpbmcgKi8gcGFpciBvZiBjaGFyYWN0ZXJzLFxyXG4gICAgICAgICAgICAvLyBidXQgd2UgYWxzbyB3YXRjaCBmb3IgdGhlIGVuZCBvZiB0ZXh0IGJlZm9yZSB0aGUgY29tbWVudCBpcyB0ZXJtaW5hdGVkLlxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcqJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhIGJsb2NrIGNvbW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGRvIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2ggPT09ICcqJykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnKicpO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLycpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCcvJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gd2hpbGUgKHRoaXMuY2gpO1xyXG5cclxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVudGVybWluYXRlZCBibG9jayBjb21tZW50XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNvbW1lbnQoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIGEgY29tbWVudCwgd2hldGhlciBpbmxpbmUgb3IgYmxvY2stbGV2ZWwsIGFzc3VtaW5nIHRoaXMgaXMgb25lLlxyXG4gICAgICAgICAgICAvLyBDb21tZW50cyBhbHdheXMgYmVnaW4gd2l0aCBhIC8gY2hhcmFjdGVyLlxyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggIT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk5vdCBhIGNvbW1lbnRcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHRoaXMubmV4dCgnLycpO1xyXG5cclxuICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICcvJykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5pbmxpbmVDb21tZW50KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodGhpcy5jaCA9PT0gJyonKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmJsb2NrQ29tbWVudCgpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVucmVjb2duaXplZCBjb21tZW50XCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgd2hpdGUoKSB7XHJcblxyXG4gICAgICAgICAgICAvLyBTa2lwIHdoaXRlc3BhY2UgYW5kIGNvbW1lbnRzLlxyXG4gICAgICAgICAgICAvLyBOb3RlIHRoYXQgd2UncmUgZGV0ZWN0aW5nIGNvbW1lbnRzIGJ5IG9ubHkgYSBzaW5nbGUgLyBjaGFyYWN0ZXIuXHJcbiAgICAgICAgICAgIC8vIFRoaXMgd29ya3Mgc2luY2UgcmVndWxhciBleHByZXNzaW9ucyBhcmUgbm90IHZhbGlkIEpTT04oNSksIGJ1dCB0aGlzIHdpbGxcclxuICAgICAgICAgICAgLy8gYnJlYWsgaWYgdGhlcmUgYXJlIG90aGVyIHZhbGlkIHZhbHVlcyB0aGF0IGJlZ2luIHdpdGggYSAvIGNoYXJhY3RlciFcclxuXHJcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJy8nKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb21tZW50KCk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYgKFN1cnZleUpTT041LndzLmluZGV4T2YodGhpcy5jaCkgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB3b3JkKCk6IGFueSB7XHJcblxyXG4gICAgICAgICAgICAvLyB0cnVlLCBmYWxzZSwgb3IgbnVsbC5cclxuXHJcbiAgICAgICAgICAgIHN3aXRjaCAodGhpcy5jaCkge1xyXG4gICAgICAgICAgICAgICAgY2FzZSAndCc6XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd0Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdyJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCd1Jyk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5uZXh0KCdlJyk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdmJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2YnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2EnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3MnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2UnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICBjYXNlICduJzpcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ24nKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ3UnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ2wnKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ0knOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnSScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnZicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnaScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnbicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnaScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgndCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgneScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBJbmZpbml0eTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ04nOlxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnTicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnYScpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnTicpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBOYU47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcihcIlVuZXhwZWN0ZWQgJ1wiICsgdGhpcy5jaCArIFwiJ1wiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcnJheSgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGFuIGFycmF5IHZhbHVlLlxyXG5cclxuICAgICAgICAgICAgdmFyIGFycmF5ID0gW107XHJcblxyXG4gICAgICAgICAgICBpZiAodGhpcy5jaCA9PT0gJ1snKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ1snKTtcclxuICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICddJykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ10nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGFycmF5OyAgIC8vIFBvdGVudGlhbGx5IGVtcHR5IGFycmF5XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEVTNSBhbGxvd3Mgb21pdHRpbmcgZWxlbWVudHMgaW4gYXJyYXlzLCBlLmcuIFssXSBhbmRcclxuICAgICAgICAgICAgICAgICAgICAvLyBbLG51bGxdLiBXZSBkb24ndCBhbGxvdyB0aGlzIGluIEpTT041LlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcihcIk1pc3NpbmcgYXJyYXkgZWxlbWVudFwiKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHRoaXMudmFsdWUoKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICAvLyBJZiB0aGVyZSdzIG5vIGNvbW1hIGFmdGVyIHRoaXMgdmFsdWUsIHRoaXMgbmVlZHMgdG9cclxuICAgICAgICAgICAgICAgICAgICAvLyBiZSB0aGUgZW5kIG9mIHRoZSBhcnJheS5cclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5jaCAhPT0gJywnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnXScpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIGFycmF5XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9iamVjdCgpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIFBhcnNlIGFuIG9iamVjdCB2YWx1ZS5cclxuXHJcbiAgICAgICAgICAgIHZhciBrZXksXHJcbiAgICAgICAgICAgICAgICBzdGFydCxcclxuICAgICAgICAgICAgICAgIGlzRmlyc3RQcm9wZXJ0eSA9IHRydWUsXHJcbiAgICAgICAgICAgICAgICBvYmplY3QgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMCkge1xyXG4gICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV0gPSB7IHN0YXJ0OiB0aGlzLmF0IC0gMSB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNoID09PSAneycpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMubmV4dCgneycpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgc3RhcnQgPSB0aGlzLmF0IC0gMTtcclxuICAgICAgICAgICAgICAgIHdoaWxlICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICd9Jykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXS5lbmQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ30nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDsgICAvLyBQb3RlbnRpYWxseSBlbXB0eSBvYmplY3RcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEtleXMgY2FuIGJlIHVucXVvdGVkLiBJZiB0aGV5IGFyZSwgdGhleSBuZWVkIHRvIGJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFsaWQgSlMgaWRlbnRpZmllcnMuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuY2ggPT09ICdcIicgfHwgdGhpcy5jaCA9PT0gXCInXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAga2V5ID0gdGhpcy5zdHJpbmcoKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBrZXkgPSB0aGlzLmlkZW50aWZpZXIoKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0gPSB7IHN0YXJ0OiBzdGFydCwgdmFsdWVTdGFydDogdGhpcy5hdCB9O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJzonKTtcclxuICAgICAgICAgICAgICAgICAgICBvYmplY3Rba2V5XSA9IHRoaXMudmFsdWUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0YXJ0ID0gdGhpcy5hdCAtIDE7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9iamVjdFtTdXJ2ZXlKU09ONS5wb3NpdGlvbk5hbWVdW2tleV0udmFsdWVFbmQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQgPSBzdGFydDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy53aGl0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIElmIHRoZXJlJ3Mgbm8gY29tbWEgYWZ0ZXIgdGhpcyBwYWlyLCB0aGlzIG5lZWRzIHRvIGJlXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdGhlIGVuZCBvZiB0aGUgb2JqZWN0LlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0aGlzLmNoICE9PSAnLCcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS52YWx1ZUVuZC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JqZWN0W1N1cnZleUpTT041LnBvc2l0aW9uTmFtZV1ba2V5XS5lbmQtLTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodGhpcy5wYXJzZVR5cGUgPiAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXS5lbmQgPSB0aGlzLmF0IC0gMTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm5leHQoJ30nKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9iamVjdDtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMucGFyc2VUeXBlID4gMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLnZhbHVlRW5kLS07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghaXNGaXJzdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYmplY3RbU3VydmV5SlNPTjUucG9zaXRpb25OYW1lXVtrZXldLmVuZC0tO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMubmV4dCgnLCcpO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBpc0ZpcnN0UHJvcGVydHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9yKFwiQmFkIG9iamVjdFwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZSgpOiBhbnkge1xyXG5cclxuICAgICAgICAgICAgLy8gUGFyc2UgYSBKU09OIHZhbHVlLiBJdCBjb3VsZCBiZSBhbiBvYmplY3QsIGFuIGFycmF5LCBhIHN0cmluZywgYSBudW1iZXIsXHJcbiAgICAgICAgICAgIC8vIG9yIGEgd29yZC5cclxuXHJcbiAgICAgICAgICAgIHRoaXMud2hpdGUoKTtcclxuICAgICAgICAgICAgc3dpdGNoICh0aGlzLmNoKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlICd7JzpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5vYmplY3QoKTtcclxuICAgICAgICAgICAgICAgIGNhc2UgJ1snOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmFycmF5KCk7XHJcbiAgICAgICAgICAgICAgICBjYXNlICdcIic6XHJcbiAgICAgICAgICAgICAgICBjYXNlIFwiJ1wiOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnN0cmluZygpO1xyXG4gICAgICAgICAgICAgICAgY2FzZSAnLSc6XHJcbiAgICAgICAgICAgICAgICBjYXNlICcrJzpcclxuICAgICAgICAgICAgICAgIGNhc2UgJy4nOlxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm51bWJlcigpO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5jaCA+PSAnMCcgJiYgdGhpcy5jaCA8PSAnOScgPyB0aGlzLm51bWJlcigpIDogdGhpcy53b3JkKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByaXZhdGUgcmVwbGFjZXI6IGFueTtcclxuICAgICAgICBwcml2YXRlIGluZGVudFN0cjogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgb2JqU3RhY2s7XHJcblxyXG4gICAgICAgIHB1YmxpYyBzdHJpbmdpZnkob2JqOiBhbnksIHJlcGxhY2VyOiBhbnkgPSBudWxsLCBzcGFjZTogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAocmVwbGFjZXIgJiYgKHR5cGVvZiAocmVwbGFjZXIpICE9PSBcImZ1bmN0aW9uXCIgJiYgIXRoaXMuaXNBcnJheShyZXBsYWNlcikpKSB7XHJcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlcGxhY2VyIG11c3QgYmUgYSBmdW5jdGlvbiBvciBhbiBhcnJheScpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVwbGFjZXIgPSByZXBsYWNlcjtcclxuICAgICAgICAgICAgdGhpcy5pbmRlbnRTdHIgPSB0aGlzLmdldEluZGVudChzcGFjZSk7XHJcbiAgICAgICAgICAgIHRoaXMub2JqU3RhY2sgPSBbXTtcclxuICAgICAgICAgICAgLy8gc3BlY2lhbCBjYXNlLi4ud2hlbiB1bmRlZmluZWQgaXMgdXNlZCBpbnNpZGUgb2ZcclxuICAgICAgICAgICAgLy8gYSBjb21wb3VuZCBvYmplY3QvYXJyYXksIHJldHVybiBudWxsLlxyXG4gICAgICAgICAgICAvLyBidXQgd2hlbiB0b3AtbGV2ZWwsIHJldHVybiB1bmRlZmluZWRcclxuICAgICAgICAgICAgdmFyIHRvcExldmVsSG9sZGVyID0geyBcIlwiOiBvYmogfTtcclxuICAgICAgICAgICAgaWYgKG9iaiA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQodG9wTGV2ZWxIb2xkZXIsICcnLCB0cnVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeSh0b3BMZXZlbEhvbGRlciwgJycsIHRydWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEluZGVudChzcGFjZTogYW55KTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHNwYWNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHNwYWNlID09PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHNwYWNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2Ygc3BhY2UgPT09IFwibnVtYmVyXCIgJiYgc3BhY2UgPj0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLm1ha2VJbmRlbnQoXCIgXCIsIHNwYWNlLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRSZXBsYWNlZFZhbHVlT3JVbmRlZmluZWQoaG9sZGVyOiBhbnksIGtleTogYW55LCBpc1RvcExldmVsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IGhvbGRlcltrZXldO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUgd2l0aCBpdHMgdG9KU09OIHZhbHVlIGZpcnN0LCBpZiBwb3NzaWJsZVxyXG4gICAgICAgICAgICBpZiAodmFsdWUgJiYgdmFsdWUudG9KU09OICYmIHR5cGVvZiB2YWx1ZS50b0pTT04gPT09IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0pTT04oKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIHVzZXItc3VwcGxpZWQgcmVwbGFjZXIgaWYgYSBmdW5jdGlvbiwgY2FsbCBpdC4gSWYgaXQncyBhbiBhcnJheSwgY2hlY2sgb2JqZWN0cycgc3RyaW5nIGtleXMgZm9yXHJcbiAgICAgICAgICAgIC8vIHByZXNlbmNlIGluIHRoZSBhcnJheSAocmVtb3ZpbmcgdGhlIGtleS92YWx1ZSBwYWlyIGZyb20gdGhlIHJlc3VsdGluZyBKU09OIGlmIHRoZSBrZXkgaXMgbWlzc2luZykuXHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgKHRoaXMucmVwbGFjZXIpID09PSBcImZ1bmN0aW9uXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2VyLmNhbGwoaG9sZGVyLCBrZXksIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLnJlcGxhY2VyKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaXNUb3BMZXZlbCB8fCB0aGlzLmlzQXJyYXkoaG9sZGVyKSB8fCB0aGlzLnJlcGxhY2VyLmluZGV4T2Yoa2V5KSA+PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzV29yZENoYXIoY2hhcjogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoY2hhciA+PSAnYScgJiYgY2hhciA8PSAneicpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2hhciA+PSAnQScgJiYgY2hhciA8PSAnWicpIHx8XHJcbiAgICAgICAgICAgICAgICAoY2hhciA+PSAnMCcgJiYgY2hhciA8PSAnOScpIHx8XHJcbiAgICAgICAgICAgICAgICBjaGFyID09PSAnXycgfHwgY2hhciA9PT0gJyQnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc1dvcmRTdGFydChjaGFyOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIChjaGFyID49ICdhJyAmJiBjaGFyIDw9ICd6JykgfHxcclxuICAgICAgICAgICAgICAgIChjaGFyID49ICdBJyAmJiBjaGFyIDw9ICdaJykgfHxcclxuICAgICAgICAgICAgICAgIGNoYXIgPT09ICdfJyB8fCBjaGFyID09PSAnJCc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzV29yZChrZXk6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGtleSAhPT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNXb3JkU3RhcnQoa2V5WzBdKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBpID0gMSwgbGVuZ3RoID0ga2V5Lmxlbmd0aDtcclxuICAgICAgICAgICAgd2hpbGUgKGkgPCBsZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5pc1dvcmRDaGFyKGtleVtpXSkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpKys7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIHBvbHlmaWxsc1xyXG4gICAgICAgIHByaXZhdGUgaXNBcnJheShvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkob2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpc0RhdGUob2JqOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvYmopID09PSAnW29iamVjdCBEYXRlXSc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcml2YXRlIGlzTmFOKHZhbDogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0eXBlb2YgdmFsID09PSAnbnVtYmVyJyAmJiB2YWwgIT09IHZhbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgXHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZvckNpcmN1bGFyKG9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5vYmpTdGFjay5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMub2JqU3RhY2tbaV0gPT09IG9iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDb252ZXJ0aW5nIGNpcmN1bGFyIHN0cnVjdHVyZSB0byBKU09OXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbWFrZUluZGVudChzdHI6IHN0cmluZywgbnVtOiBudW1iZXIsIG5vTmV3TGluZTogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICghc3RyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvLyBpbmRlbnRhdGlvbiBubyBtb3JlIHRoYW4gMTAgY2hhcnNcclxuICAgICAgICAgICAgaWYgKHN0ci5sZW5ndGggPiAxMCkge1xyXG4gICAgICAgICAgICAgICAgc3RyID0gc3RyLnN1YnN0cmluZygwLCAxMCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBpbmRlbnQgPSBub05ld0xpbmUgPyBcIlwiIDogXCJcXG5cIjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBudW07IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaW5kZW50ICs9IHN0cjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGluZGVudDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIENvcGllZCBmcm9tIENyb2tmb3JkJ3MgaW1wbGVtZW50YXRpb24gb2YgSlNPTlxyXG4gICAgICAgIC8vIFNlZSBodHRwczovL2dpdGh1Yi5jb20vZG91Z2xhc2Nyb2NrZm9yZC9KU09OLWpzL2Jsb2IvZTM5ZGI0YjdlNjI0OWYwNGExOTVlN2RkMDg0MGU2MTBjYzllOTQxZS9qc29uMi5qcyNMMTk1XHJcbiAgICAgICAgLy8gQmVnaW5cclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBjeCA9IC9bXFx1MDAwMFxcdTAwYWRcXHUwNjAwLVxcdTA2MDRcXHUwNzBmXFx1MTdiNFxcdTE3YjVcXHUyMDBjLVxcdTIwMGZcXHUyMDI4LVxcdTIwMmZcXHUyMDYwLVxcdTIwNmZcXHVmZWZmXFx1ZmZmMC1cXHVmZmZmXS9nO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIGVzY2FwYWJsZSA9IC9bXFxcXFxcXCJcXHgwMC1cXHgxZlxceDdmLVxceDlmXFx1MDBhZFxcdTA2MDAtXFx1MDYwNFxcdTA3MGZcXHUxN2I0XFx1MTdiNVxcdTIwMGMtXFx1MjAwZlxcdTIwMjgtXFx1MjAyZlxcdTIwNjAtXFx1MjA2ZlxcdWZlZmZcXHVmZmYwLVxcdWZmZmZdL2c7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbWV0YSA9IHsgLy8gdGFibGUgb2YgY2hhcmFjdGVyIHN1YnN0aXR1dGlvbnNcclxuICAgICAgICAgICAgJ1xcYic6ICdcXFxcYicsXHJcbiAgICAgICAgICAgICdcXHQnOiAnXFxcXHQnLFxyXG4gICAgICAgICAgICAnXFxuJzogJ1xcXFxuJyxcclxuICAgICAgICAgICAgJ1xcZic6ICdcXFxcZicsXHJcbiAgICAgICAgICAgICdcXHInOiAnXFxcXHInLFxyXG4gICAgICAgICAgICAnXCInOiAnXFxcXFwiJyxcclxuICAgICAgICAgICAgJ1xcXFwnOiAnXFxcXFxcXFwnXHJcbiAgICAgICAgfTtcclxuICAgICAgICBwcml2YXRlIGVzY2FwZVN0cmluZyhzdHI6IHN0cmluZykge1xyXG5cclxuICAgICAgICAgICAgLy8gSWYgdGhlIHN0cmluZyBjb250YWlucyBubyBjb250cm9sIGNoYXJhY3RlcnMsIG5vIHF1b3RlIGNoYXJhY3RlcnMsIGFuZCBub1xyXG4gICAgICAgICAgICAvLyBiYWNrc2xhc2ggY2hhcmFjdGVycywgdGhlbiB3ZSBjYW4gc2FmZWx5IHNsYXAgc29tZSBxdW90ZXMgYXJvdW5kIGl0LlxyXG4gICAgICAgICAgICAvLyBPdGhlcndpc2Ugd2UgbXVzdCBhbHNvIHJlcGxhY2UgdGhlIG9mZmVuZGluZyBjaGFyYWN0ZXJzIHdpdGggc2FmZSBlc2NhcGVcclxuICAgICAgICAgICAgLy8gc2VxdWVuY2VzLlxyXG4gICAgICAgICAgICBTdXJ2ZXlKU09ONS5lc2NhcGFibGUubGFzdEluZGV4ID0gMDtcclxuICAgICAgICAgICAgcmV0dXJuIFN1cnZleUpTT041LmVzY2FwYWJsZS50ZXN0KHN0cikgPyAnXCInICsgc3RyLnJlcGxhY2UoU3VydmV5SlNPTjUuZXNjYXBhYmxlLCBmdW5jdGlvbiAoYSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGMgPSBTdXJ2ZXlKU09ONS5tZXRhW2FdO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHR5cGVvZiBjID09PSAnc3RyaW5nJyA/XHJcbiAgICAgICAgICAgICAgICAgICAgYyA6XHJcbiAgICAgICAgICAgICAgICAgICAgJ1xcXFx1JyArICgnMDAwMCcgKyBhLmNoYXJDb2RlQXQoMCkudG9TdHJpbmcoMTYpKS5zbGljZSgtNCk7XHJcbiAgICAgICAgICAgIH0pICsgJ1wiJyA6ICdcIicgKyBzdHIgKyAnXCInO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvLyBFbmRcclxuXHJcbiAgICAgICAgcHJpdmF0ZSBpbnRlcm5hbFN0cmluZ2lmeShob2xkZXI6IGFueSwga2V5OiBhbnksIGlzVG9wTGV2ZWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIGJ1ZmZlciwgcmVzO1xyXG5cclxuICAgICAgICAgICAgLy8gUmVwbGFjZSB0aGUgdmFsdWUsIGlmIG5lY2Vzc2FyeVxyXG4gICAgICAgICAgICB2YXIgb2JqX3BhcnQgPSB0aGlzLmdldFJlcGxhY2VkVmFsdWVPclVuZGVmaW5lZChob2xkZXIsIGtleSwgaXNUb3BMZXZlbCk7XHJcblxyXG4gICAgICAgICAgICBpZiAob2JqX3BhcnQgJiYgIXRoaXMuaXNEYXRlKG9ial9wYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgLy8gdW5ib3ggb2JqZWN0c1xyXG4gICAgICAgICAgICAgICAgLy8gZG9uJ3QgdW5ib3ggZGF0ZXMsIHNpbmNlIHdpbGwgdHVybiBpdCBpbnRvIG51bWJlclxyXG4gICAgICAgICAgICAgICAgb2JqX3BhcnQgPSBvYmpfcGFydC52YWx1ZU9mKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc3dpdGNoICh0eXBlb2Ygb2JqX3BhcnQpIHtcclxuICAgICAgICAgICAgICAgIGNhc2UgXCJib29sZWFuXCI6XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG9ial9wYXJ0LnRvU3RyaW5nKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm51bWJlclwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpc05hTihvYmpfcGFydCkgfHwgIWlzRmluaXRlKG9ial9wYXJ0KSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBvYmpfcGFydC50b1N0cmluZygpO1xyXG5cclxuICAgICAgICAgICAgICAgIGNhc2UgXCJzdHJpbmdcIjpcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5lc2NhcGVTdHJpbmcob2JqX3BhcnQudG9TdHJpbmcoKSk7XHJcblxyXG4gICAgICAgICAgICAgICAgY2FzZSBcIm9iamVjdFwiOlxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvYmpfcGFydCA9PT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gXCJudWxsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmlzQXJyYXkob2JqX3BhcnQpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IFwiW1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm9ialN0YWNrLnB1c2gob2JqX3BhcnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpfcGFydC5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmVzID0gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeShvYmpfcGFydCwgaSwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IHRoaXMubWFrZUluZGVudCh0aGlzLmluZGVudFN0ciwgdGhpcy5vYmpTdGFjay5sZW5ndGgpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHJlcyA9PT0gbnVsbCB8fCB0eXBlb2YgcmVzID09PSBcInVuZGVmaW5lZFwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwibnVsbFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBidWZmZXIgKz0gcmVzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKGkgPCBvYmpfcGFydC5sZW5ndGggLSAxKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyICs9IFwiLFwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmICh0aGlzLmluZGVudFN0cikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBcIlxcblwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoLCB0cnVlKSArIFwiXVwiO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tGb3JDaXJjdWxhcihvYmpfcGFydCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciA9IFwie1wiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgbm9uRW1wdHkgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5vYmpTdGFjay5wdXNoKG9ial9wYXJ0KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgcHJvcCBpbiBvYmpfcGFydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYgKG9ial9wYXJ0Lmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gdGhpcy5pbnRlcm5hbFN0cmluZ2lmeShvYmpfcGFydCwgcHJvcCwgZmFsc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlzVG9wTGV2ZWwgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSBcInVuZGVmaW5lZFwiICYmIHZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm9uRW1wdHkgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIga2V5ID0gdGhpcy5pc1dvcmQocHJvcCkgPyBwcm9wIDogdGhpcy5lc2NhcGVTdHJpbmcocHJvcCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlciArPSBrZXkgKyBcIjpcIiArICh0aGlzLmluZGVudFN0ciA/ICcgJyA6ICcnKSArIHZhbHVlICsgXCIsXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMub2JqU3RhY2sucG9wKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChub25FbXB0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gYnVmZmVyLnN1YnN0cmluZygwLCBidWZmZXIubGVuZ3RoIC0gMSkgKyB0aGlzLm1ha2VJbmRlbnQodGhpcy5pbmRlbnRTdHIsIHRoaXMub2JqU3RhY2subGVuZ3RoKSArIFwifVwiO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyID0gJ3t9JztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gYnVmZmVyO1xyXG4gICAgICAgICAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgICAgICAgICAvLyBmdW5jdGlvbnMgYW5kIHVuZGVmaW5lZCBzaG91bGQgYmUgaWdub3JlZFxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5RWRpdG9yIHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlFbWJlZGluZ1dpbmRvdyB7XHJcbiAgICAgICAgcHJpdmF0ZSBqc29uVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIHN1cnZleUVtYmVkaW5nSGVhZDogQWNlQWpheC5FZGl0b3I7XHJcbiAgICAgICAgcHJpdmF0ZSBzdXJ2ZXlFbWJlZGluZ0phdmE6IEFjZUFqYXguRWRpdG9yO1xyXG4gICAgICAgIGtvU2hvd0FzV2luZG93OiBhbnk7XHJcbiAgICAgICAga29TY3JpcHRVc2luZzogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29TaG93QXNXaW5kb3cgPSBrby5vYnNlcnZhYmxlKFwicGFnZVwiKTtcclxuICAgICAgICAgICAgdGhpcy5rb1NjcmlwdFVzaW5nID0ga28ub2JzZXJ2YWJsZShcImJvb3RzdHJhcFwiKTtcclxuICAgICAgICAgICAgdGhpcy5rb1Nob3dBc1dpbmRvdy5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7IHNlbGYuc3VydmV5RW1iZWRpbmdKYXZhLnNldFZhbHVlKHNlbGYuZ2V0SmF2YVRleHQoKSk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvU2NyaXB0VXNpbmcuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkgeyBzZWxmLnNldEhlYWRUZXh0KCk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSGVhZCA9IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQganNvbigpOiBhbnkgeyByZXR1cm4gdGhpcy5qc29uVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGpzb24odmFsdWU6IGFueSkgeyB0aGlzLmpzb25WYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleUVtYmVkaW5nSGVhZCA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSGVhZCA9IHRoaXMuY3JlYXRlRWRpdG9yKFwic3VydmV5RW1iZWRpbmdIZWFkXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRIZWFkVGV4dCgpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGJvZHlFZGl0b3IgPSB0aGlzLmNyZWF0ZUVkaXRvcihcInN1cnZleUVtYmVkaW5nQm9keVwiKTtcclxuICAgICAgICAgICAgICAgIGJvZHlFZGl0b3Iuc2V0VmFsdWUoXCI8ZGl2IGlkPSBcXFwibXlTdXJ2ZXlKU05hbWVcXFwiID48L2Rpdj5cIik7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleUVtYmVkaW5nSmF2YSA9IHRoaXMuY3JlYXRlRWRpdG9yKFwic3VydmV5RW1iZWRpbmdKYXZhXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5RW1iZWRpbmdKYXZhLnNldFZhbHVlKHRoaXMuZ2V0SmF2YVRleHQoKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0SGVhZFRleHQoKSB7XHJcbiAgICAgICAgICAgIHZhciBrbm9ja291dFN0ciA9IFwiPHNjcmlwdCBzcmM9XFxcImh0dHBzOi8vY2RuanMuY2xvdWRmbGFyZS5jb20vYWpheC9saWJzL2tub2Nrb3V0LzMuMy4wL2tub2Nrb3V0LW1pbi5qc1xcXCIgPjwvc2NyaXB0PlxcblwiO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5rb1NjcmlwdFVzaW5nKCkgPT0gXCJib290c3RyYXBcIikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQuc2V0VmFsdWUoa25vY2tvdXRTdHIgKyBcIjxzY3JpcHQgc3JjPVxcXCJqcy9zdXJ2ZXkuYm9vdHN0cmFwLm1pbi5qc1xcXCI+PC9zY3JpcHQ+XCIpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zdXJ2ZXlFbWJlZGluZ0hlYWQuc2V0VmFsdWUoa25vY2tvdXRTdHIgKyBcIjxzY3JpcHQgc3JjPVxcXCJqcy9zdXJ2ZXkubWluLmpzXFxcIj48L3NjcmlwdD5cXG48bGluayBocmVmPVxcXCJjc3Mvc3VydmV5LmNzc1xcXCIgdHlwZT1cXFwidGV4dC9jc3NcXFwiIHJlbD1cXFwic3R5bGVzaGVldFxcXCIgLz5cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVFZGl0b3IoZWxlbWVudE5hbWU6IHN0cmluZyk6IEFjZUFqYXguRWRpdG9yIHtcclxuICAgICAgICAgICAgdmFyIGVkaXRvciA9IGFjZS5lZGl0KGVsZW1lbnROYW1lKTtcclxuICAgICAgICAgICAgZWRpdG9yLnNldFRoZW1lKFwiYWNlL3RoZW1lL21vbm9rYWlcIik7XHJcbiAgICAgICAgICAgIGVkaXRvci5zZXNzaW9uLnNldE1vZGUoXCJhY2UvbW9kZS9qc29uXCIpO1xyXG4gICAgICAgICAgICBlZGl0b3Iuc2V0U2hvd1ByaW50TWFyZ2luKGZhbHNlKTtcclxuICAgICAgICAgICAgZWRpdG9yLnJlbmRlcmVyLnNldFNob3dHdXR0ZXIoZmFsc2UpO1xyXG4gICAgICAgICAgICBlZGl0b3Iuc2V0UmVhZE9ubHkodHJ1ZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBlZGl0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0SmF2YVRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGlzT25QYWdlID0gdGhpcy5rb1Nob3dBc1dpbmRvdygpID09IFwicGFnZVwiO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IGlzT25QYWdlID8gXCJ2YXIgc3VydmV5ID0gbmV3IFN1cnZleS5TdXJ2ZXkoXFxuXCIgOiBcInZhciBzdXJ2ZXlXaW5kb3cgPSBuZXcgU3VydmV5LlN1cnZleVdpbmRvdyhcXG5cIjtcclxuICAgICAgICAgICAgdGV4dCArPSB0aGlzLmdldEpzb25UZXh0KCk7XHJcbiAgICAgICAgICAgIHRleHQgKz0gXCIpO1xcblwiO1xyXG4gICAgICAgICAgICBpZiAoIWlzT25QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IFwic3VydmV5V2luZG93LlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRleHQgKz0gXCJzdXJ2ZXkub25Db21wbGV0ZS5hZGQoZnVuY3Rpb24gKHMpIHtcXG4gYWxlcnQoXFxcIlRoZSByZXN1bHRzIGFyZTpcXFwiICsgSlNPTi5zdHJpbmdpZnkocy5kYXRhKSk7IFxcbiB9KTtcXG5cIjtcclxuICAgICAgICAgICAgaWYgKGlzT25QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB0ZXh0ICs9IFwic3VydmV5LnJlbmRlcihcXFwibXlTdXJ2ZXlKU05hbWVcXFwiKTtcIjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gXCIvL3N1cnZleVdpbmRvdy50aXRsZSA9IFxcXCJNeSBTdXJ2ZXkgV2luZG93IFRpdGxlLlxcXCI7IC8vQnkgZGVmYXVsdCBTdXJ2ZXkudGl0bGUgaXMgdXNlZC5cXG5cIjtcclxuICAgICAgICAgICAgICAgIHRleHQgKz0gXCJzdXJ2ZXlXaW5kb3cuc2hvdygpO1wiO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRKc29uVGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1cnZleUpTT041KCkuc3RyaW5naWZ5KHRoaXMuanNvbik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIFN1cnZleUVkaXRvciB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU9iamVjdEl0ZW0ge1xyXG4gICAgICAgIHB1YmxpYyB2YWx1ZTogU3VydmV5LkJhc2U7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IGFueTtcclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5T2JqZWN0cyB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBpbnRlbmQ6IHN0cmluZyA9IFwiLi4uXCI7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleS5TdXJ2ZXk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBrb09iamVjdHM6IGFueSwgcHVibGljIGtvU2VsZWN0ZWQ6IGFueSkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHN1cnZleSgpOiBTdXJ2ZXkuU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHN1cnZleSh2YWx1ZTogU3VydmV5LlN1cnZleSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXkgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnJlYnVpbGQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZFBhZ2UocGFnZTogU3VydmV5LlBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2VJdGVtID0gdGhpcy5jcmVhdGVQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnN1cnZleS5wYWdlcy5pbmRleE9mKHBhZ2UpO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJldlBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChwcmV2UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICAgICAgaW5kZXggKz0gcHJldlBhZ2UucXVlc3Rpb25zLmxlbmd0aDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGluZGV4ID0gMTsgLy8wIC0gU3VydmV5XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5hZGRJdGVtKHBhZ2VJdGVtLCBpbmRleCk7XHJcbiAgICAgICAgICAgIGluZGV4Kys7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcGFnZS5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihwYWdlLnF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZEl0ZW0oaXRlbSwgaW5kZXggKyBpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQocGFnZUl0ZW0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocGFnZTogU3VydmV5LlBhZ2UsIHF1ZXN0aW9uOiBTdXJ2ZXkuUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgocGFnZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uSW5kZXggPSBwYWdlLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKSArIDE7XHJcbiAgICAgICAgICAgIGluZGV4ICs9IHF1ZXN0aW9uSW5kZXg7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkSXRlbShpdGVtLCBpbmRleCk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZChpdGVtKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNlbGVjdE9iamVjdChvYmo6IFN1cnZleS5CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBvYmpzID0gdGhpcy5rb09iamVjdHMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmpzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAob2Jqc1tpXS52YWx1ZSA9PSBvYmopIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmtvU2VsZWN0ZWQob2Jqc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVPYmplY3Qob2JqOiBTdXJ2ZXkuQmFzZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLmdldEl0ZW1JbmRleChvYmopO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBjb3VudFRvUmVtb3ZlID0gMTtcclxuICAgICAgICAgICAgaWYgKFN1cnZleUhlbHBlci5nZXRPYmplY3RUeXBlKG9iaikgPT0gT2JqVHlwZS5QYWdlKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZTogU3VydmV5LlBhZ2UgPSA8U3VydmV5LlBhZ2U+b2JqO1xyXG4gICAgICAgICAgICAgICAgY291bnRUb1JlbW92ZSArPSBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMuc3BsaWNlKGluZGV4LCBjb3VudFRvUmVtb3ZlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIG5hbWVDaGFuZ2VkKG9iajogU3VydmV5LkJhc2UpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5nZXRJdGVtSW5kZXgob2JqKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmtvT2JqZWN0cygpW2luZGV4XS50ZXh0KHRoaXMuZ2V0VGV4dChvYmopKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRJdGVtKGl0ZW06IFN1cnZleU9iamVjdEl0ZW0sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gdGhpcy5rb09iamVjdHMoKS5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29PYmplY3RzLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvT2JqZWN0cy5zcGxpY2UoaW5kZXgsIDAsIGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgcmVidWlsZCgpIHtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5ID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29PYmplY3RzKG9ianMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1NlbGVjdGVkKG51bGwpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZUl0ZW0odGhpcy5zdXJ2ZXksIFwiU3VydmV5XCIpKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnN1cnZleS5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnN1cnZleS5wYWdlc1tpXTtcclxuICAgICAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZVBhZ2UocGFnZSkpO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBwYWdlLnF1ZXN0aW9ucy5sZW5ndGg7IGorKykge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ianMucHVzaCh0aGlzLmNyZWF0ZVF1ZXN0aW9uKHBhZ2UucXVlc3Rpb25zW2pdKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5rb09iamVjdHMob2Jqcyk7XHJcbiAgICAgICAgICAgIHRoaXMua29TZWxlY3RlZCh0aGlzLnN1cnZleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUGFnZShwYWdlOiBTdXJ2ZXkuUGFnZSkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVJdGVtKHBhZ2UsIHRoaXMuZ2V0VGV4dChwYWdlKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb246IFN1cnZleS5RdWVzdGlvbikge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jcmVhdGVJdGVtKHF1ZXN0aW9uLCB0aGlzLmdldFRleHQocXVlc3Rpb24pKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVJdGVtKHZhbHVlOiBTdXJ2ZXkuQmFzZSwgdGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IFN1cnZleU9iamVjdEl0ZW0oKTtcclxuICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpdGVtLnRleHQgPSBrby5vYnNlcnZhYmxlKHRleHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBnZXRJdGVtSW5kZXgodmFsdWU6IFN1cnZleS5CYXNlKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgdmFyIG9ianMgPSB0aGlzLmtvT2JqZWN0cygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9ianMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChvYmpzW2ldLnZhbHVlID09IHZhbHVlKSByZXR1cm4gaTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0VGV4dChvYmo6IFN1cnZleS5CYXNlKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIGludGVuZCA9IFN1cnZleU9iamVjdHMuaW50ZW5kO1xyXG4gICAgICAgICAgICBpZiAoU3VydmV5SGVscGVyLmdldE9iamVjdFR5cGUob2JqKSAhPSBPYmpUeXBlLlBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIGludGVuZCArPSBTdXJ2ZXlPYmplY3RzLmludGVuZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gaW50ZW5kICsgb2JqW1wibmFtZVwiXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgdGVtcGxhdGVFZGl0b3Iua28geyBleHBvcnQgdmFyIGh0bWwgPSAnPG5hdiBjbGFzcz1cIm5hdmJhciBuYXZiYXItZGVmYXVsdFwiPiAgICA8ZGl2IGNsYXNzPVwiY29udGFpbmVyLWZsdWlkXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwiY29sbGFwc2UgbmF2YmFyLWNvbGxhcHNlXCIgaWQ9XCJicy1leGFtcGxlLW5hdmJhci1jb2xsYXBzZS0xXCI+ICAgICAgICAgICAgPHVsIGNsYXNzPVwibmF2IG5hdmJhci1uYXZcIj4gICAgICAgICAgICAgICAgPGxpIGNsYXNzPVwiZHJvcGRvd25cIj4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgY2xhc3M9XCJkcm9wZG93bi10b2dnbGVcIiBkYXRhLXRvZ2dsZT1cImRyb3Bkb3duXCIgcm9sZT1cImJ1dHRvblwiIGFyaWEtaGFzcG9wdXA9XCJ0cnVlXCIgYXJpYS1leHBhbmRlZD1cImZhbHNlXCI+PHNwYW4gZGF0YS1iaW5kPVwidGV4dDoga29Jc1Nob3dEZXNpZ25lcigpID8gXFwnU3VydmV5IERlc2lnbmVyXFwnOiBcXCdKU09OIEVkaXRvclxcJ1wiPjwvc3Bhbj4gPHNwYW4gY2xhc3M9XCJjYXJldFwiPjwvc3Bhbj48L2E+ICAgICAgICAgICAgICAgICAgICA8dWwgY2xhc3M9XCJkcm9wZG93bi1tZW51XCI+ICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6c2VsZWN0RGVzaWduZXJDbGlja1wiPlVzZSBTdXJ2ZXkgRGVzaWduZXI8L2E+PC9saT4gICAgICAgICAgICAgICAgICAgICAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpzZWxlY3RFZGl0b3JDbGlja1wiPlVzZSBKU09OIEVkaXRvcjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgPC91bD4gICAgICAgICAgICAgICAgPC9saT4gICAgICAgICAgICA8L3VsPiAgICAgICAgICAgIDxmb3JtIGNsYXNzPVwibmF2YmFyLWZvcm0gbmF2YmFyLWxlZnRcIj4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWJpbmQ9XCJjbGljazogcnVuU3VydmV5Q2xpY2tcIiBkYXRhLXRvZ2dsZT1cIm1vZGFsXCIgZGF0YS10YXJnZXQ9XCIjc3VydmV5RXhhbXBsZU1vZGFsXCI+UnVuIFN1cnZleTwvYnV0dG9uPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOiBlbWJlZGluZ1N1cnZleUNsaWNrXCIgZGF0YS10b2dnbGU9XCJtb2RhbFwiIGRhdGEtdGFyZ2V0PVwiI3N1cnZleUVtYmVkaW5nTW9kYWxcIj5FbWJlZGluZyBTdXJ2ZXkgdG8gWW91ciBQYWdlPC9idXR0b24+ICAgICAgICAgICAgPC9mb3JtPiAgICAgICAgPC9kaXY+PCEtLSAvLm5hdmJhci1jb2xsYXBzZSAtLT4gICAgPC9kaXY+PCEtLSAvLmNvbnRhaW5lci1mbHVpZCAtLT48L25hdj48ZGl2IGNsYXNzPVwicGFuZWxcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj4gICAgPGRpdiBpZD1cInN1cnZleWpzRWRpdG9yXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogIWtvSXNTaG93RGVzaWduZXIoKVwiIHN0eWxlPVwiaGVpZ2h0OjQ1MHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPGRpdiBjbGFzcz1cInJvd1wiIGRhdGEtYmluZD1cInZpc2libGU6IGtvSXNTaG93RGVzaWduZXIoKVwiPiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy00IGNvbC1tZC0zXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsIHBhbmVsLWRlZmF1bHRcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJyb3dcIj4gICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IHN0eWxlPVwid2lkdGg6ODAlXCIgIGRhdGEtYmluZD1cIm9wdGlvbnM6IGtvT2JqZWN0cywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIHZhbHVlOiBrb1NlbGVjdGVkT2JqZWN0XCI+PC9zZWxlY3Q+ICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb0NhbkRlbGV0ZU9iamVjdCwgY2xpY2s6IGRlbGV0ZUN1cnJlbnRPYmplY3RcIiBzdHlsZT1cIndpZHRoOjE1JVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3RlZGl0b3JcXCcsIGRhdGE6IHNlbGVjdGVkT2JqZWN0RWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWZvb3RlclwiIGRhdGEtYmluZD1cInZpc2libGU6c3VydmV5VmVyYnMua29IYXNWZXJic1wiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3R2ZXJic1xcJywgZGF0YTogc3VydmV5VmVyYnMgfVwiPjwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cImNvbC14cy0xMiBjb2wtc20tNiBjb2wtbWQtOFwiPiAgICAgICAgICAgIDxuYXYgY2xhc3M9XCJuYXZiYXIgbmF2YmFyLWRlZmF1bHRcIj4gICAgICAgICAgICAgICAgPGZvcm0gY2xhc3M9XCJuYXZiYXItZm9ybVwiPiAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvblR5cGVzIC0tPiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0blwiIHR5cGU9XCJidXR0b25cIiBkcmFnZ2FibGU9XCJ0cnVlXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQuY2xpY2tRdWVzdGlvbiwgZXZlbnQ6e2RyYWdzdGFydDogZnVuY3Rpb24oZWwsIGUpIHsgJHBhcmVudC5kcmFnZ2luZ1F1ZXN0aW9uKCRkYXRhLCBlKTsgcmV0dXJuIHRydWU7fX1cIj4gICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhXCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgPC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICAgICAgICAgIDwvZm9ybT4gICAgICAgICAgICA8L25hdj4gICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3BhZ2VlZGl0b3JcXCcsIGRhdGE6IHBhZ2VzRWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICA8ZGl2IHN0eWxlPVwib3ZlcmZsb3cteTogc2Nyb2xsO2hlaWdodDo0NTBweDtcIj4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInN1cnZleWpzXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PC9kaXY+ICAgICAgICAgICAgPC9kaXY+PC9kaXY+ICAgIDwvZGl2PjwvZGl2PjxkaXYgaWQ9XCJzdXJ2ZXlFeGFtcGxlTW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiByb2xlPVwiZGlhbG9nXCI+ICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4mdGltZXM7PC9idXR0b24+ICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCI+UnVubmluZyBzdXJ2ZXk8L2g0PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+ICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlqc0V4YW1wbGVcIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj48ZGl2IGlkPVwic3VydmV5RW1iZWRpbmdNb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiIHJvbGU9XCJkaWFsb2dcIj4gICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+ICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIj5FbWJlZGluZyBzdXJ2ZXk8L2g0PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+ICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5ZW1iZWRpbmdcXCcsIGRhdGE6IHN1cnZleUVtYmVkaW5nIH1cIj48L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L2Rpdj48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cIm9iamVjdGVkaXRvclwiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPiAgICAgICAgPHRib2R5IGRhdGEtYmluZD1cImZvcmVhY2g6IGtvUHJvcGVydGllc1wiPiAgICAgICAgICAgIDx0ciBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5jaGFuZ2VBY3RpdmVQcm9wZXJ0eSgkZGF0YSksIGNzczoge1xcJ2FjdGl2ZVxcJzogJHBhcmVudC5rb0FjdGl2ZVByb3BlcnR5KCkgPT0gJGRhdGF9XCI+ICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OiBuYW1lXCIgd2lkdGg9XCI1MCVcIj48L3RkPiAgICAgICAgICAgICAgICA8dGQgd2lkdGg9XCI1MCVcIj4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGtvVGV4dCwgdmlzaWJsZTogJHBhcmVudC5rb0FjdGl2ZVByb3BlcnR5KCkgIT0gJGRhdGEsIGF0dHI6IHt0aXRsZToga29UZXh0fSwgc3R5bGU6IHtjb2xvcjoga29Jc0RlZmF1bHQoKSA/IFxcJ2dyYXlcXCcgOiBcXCdcXCd9XCIgc3R5bGU9XCJ0ZXh0LW92ZXJmbG93OmVsbGlwc2lzO3doaXRlLXNwYWNlOm5vd3JhcDtvdmVyZmxvdzpoaWRkZW5cIj48L3NwYW4+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6ICRwYXJlbnQua29BY3RpdmVQcm9wZXJ0eSgpID09ICRkYXRhXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdwcm9wZXJ0eWVkaXRvci1cXCcgKyBlZGl0b3JUeXBlLCBkYXRhOiAkZGF0YSB9IC0tPiAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGJvZHk+ICAgIDwvdGFibGU+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJvYmplY3R2ZXJic1wiPiAgICA8IS0tIGtvIGZvcmVhY2g6IGtvVmVyYnMgLS0+ICAgICAgICA8ZGl2PiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6dGV4dFwiPjwvc3Bhbj4gICAgICAgICAgICA8c2VsZWN0IHN0eWxlPVwid2lkdGg6NTAlXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIG9wdGlvbnNWYWx1ZTpcXCd2YWx1ZVxcJywgdmFsdWU6IGtvU2VsZWN0ZWRJdGVtXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgPCEtLSBrbyBpZjogKCRpbmRleCgpICE9ICgkcGFyZW50LmtvVmVyYnMoKS5sZW5ndGggLSAxKSkgLS0+ICAgICAgICAgICAgPHAvPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICA8L2Rpdj4gICAgPCEtLSAva28gIC0tPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicGFnZWVkaXRvclwiPiAgICA8dWwgY2xhc3M9XCJuYXYgbmF2LXRhYnNcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29QYWdlcyAtLT4gICAgICAgIDxsaSBkYXRhLWJpbmQ9XCJjc3M6IHthY3RpdmU6IGtvU2VsZWN0ZWQoKX0sZXZlbnQ6eyAgICAgICAgICAgZHJhZ3N0YXJ0OmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnU3RhcnQoZWwpOyByZXR1cm4gdHJ1ZTsgfSwgICAgICAgICAgIGRyYWdvdmVyOmZ1bmN0aW9uKGVsLCBlKXsgJHBhcmVudC5kcmFnT3ZlcihlbCk7fSwgICAgICAgICAgIGRyYWdlbmQ6ZnVuY3Rpb24oZWwsIGUpeyAkcGFyZW50LmRyYWdFbmQoKTt9LCAgICAgICAgICAgZHJvcDpmdW5jdGlvbihlbCwgZSl7ICRwYXJlbnQuZHJhZ0Ryb3AoZWwpO30gICAgICAgICB9XCI+ICAgICAgICAgICAgIDxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6JHBhcmVudC5zZWxlY3RQYWdlQ2xpY2tcIj4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdGl0bGVcIj48L3NwYW4+ICAgICAgICAgICAgPC9hPiAgICAgICAgPC9saT4gICAgICAgIDwhLS0gL2tvICAtLT4gICAgICAgIDxsaT48YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtYmluZD1cImNsaWNrOmFkZE5ld1BhZ2VDbGlja1wiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzXCI+PC9zcGFuPjwvYnV0dG9uPjwvbGk+ICAgIDwvdWw+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1ib29sZWFuXCI+ICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJjaGVja2VkOiBrb1ZhbHVlXCIgLz48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLWRyb3Bkb3duXCI+ICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWUsIG9wdGlvbnM6IGNob2ljZXNcIiAgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PC9zZWxlY3Q+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1pdGVtdmFsdWVzXCI+ICAgIDxkaXY+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHRcIj48L3NwYW4+ICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNwcm9wZXJ0eUVkaXRvckl0ZW1WYWx1ZXNNb2RhbFwiPkVkaXQ8L2J1dHRvbj4gICAgPC9kaXY+ICAgIDxkaXYgaWQ9XCJwcm9wZXJ0eUVkaXRvckl0ZW1WYWx1ZXNNb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiIHJvbGU9XCJkaWFsb2dcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+ICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4mdGltZXM7PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiIGRhdGEtYmluZD1cInRleHQ6YXJyYXlFZGl0b3IudGl0bGVcIj48L2g0PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGRhdGEtYmluZD1cIndpdGg6IGFycmF5RWRpdG9yXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoZWFkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD5WYWx1ZTwvdGg+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlRleHQ8L3RoPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90aGVhZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRib2R5PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBrb0l0ZW1zIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb1ZhbHVlXCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29UZXh0XCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJjbGljazogJHBhcmVudC5vbkRlbGV0ZUNsaWNrXCIgdmFsdWU9XCJEZWxldGVcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmtvTmV3VmFsdWVcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTprb05ld1RleHRcIiBzdHlsZT1cIndpZHRoOjIwMHB4XCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFkZENsaWNrXCIgdmFsdWU9XCJBZGRcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWZvb3RlclwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiQXBwbHlcIiBkYXRhLWJpbmQ9XCJjbGljazogb25BcHBseUNsaWNrXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJwdWxsLXJpZ2h0XCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIiB2YWx1ZT1cImNsb3NlXCIgc3R5bGU9XCJ3aWR0aDoxMDBweFwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1udW1iZXJcIj4gICAgPGlucHV0IHR5cGU9XCJudW1iZXJcIiBkYXRhLWJpbmQ9XCJ2YWx1ZToga29WYWx1ZVwiIHN0eWxlPVwid2lkdGg6MTAwJVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci1zdHJpbmdcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IGtvVmFsdWVcIiBzdHlsZT1cIndpZHRoOjEwMCVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdGV4dGl0ZW1zXCI+ICAgIDxkaXY+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHRcIj48L3NwYW4+ICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNwcm9wZXJ0eUVkaXRvclRleHRJdGVtc01vZGFsXCI+RWRpdDwvYnV0dG9uPiAgICA8L2Rpdj4gICAgPGRpdiBpZD1cInByb3BlcnR5RWRpdG9yVGV4dEl0ZW1zTW9kYWxcIiBjbGFzcz1cIm1vZGFsIGZhZGVcIiByb2xlPVwiZGlhbG9nXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtZGlhbG9nXCI+ICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWhlYWRlclwiPiAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJjbG9zZVwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+JnRpbWVzOzwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgPGg0IGNsYXNzPVwibW9kYWwtdGl0bGVcIiBkYXRhLWJpbmQ9XCJ0ZXh0OmFycmF5RWRpdG9yLnRpdGxlXCI+PC9oND4gICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCI+ICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWxcIiBkYXRhLWJpbmQ9XCJ3aXRoOiBhcnJheUVkaXRvclwiPiAgICAgICAgICAgICAgICAgICAgICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0aGVhZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+TmFtZTwvdGg+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRoPlRpdGxlPC90aD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGhlYWQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0Ym9keT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDoga29JdGVtcyAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29OYW1lXCIgc3R5bGU9XCJ3aWR0aDoyMDBweFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6a29UaXRsZVwiIHN0eWxlPVwid2lkdGg6MjAwcHhcIiAvPjwvdGQ+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25EZWxldGVDbGlja1wiIHZhbHVlPVwiRGVsZXRlXCIgLz48L3RkPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiNFwiPjxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQWRkQ2xpY2tcIiB2YWx1ZT1cIkFkZFwiIC8+PC90ZD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+ICAgICAgICAgICAgICAgICAgICAgICAgPC90YWJsZT4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJBcHBseVwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFwcGx5Q2xpY2tcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInB1bGwtcmlnaHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIHZhbHVlPVwiY2xvc2VcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInByb3BlcnR5ZWRpdG9yLXRyaWdnZXJzXCI+ICAgIDxkaXY+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHRcIj48L3NwYW4+ICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNwcm9wZXJ0eUVkaXRvclRyaWdnZXJzTW9kYWxcIj5FZGl0PC9idXR0b24+ICAgIDwvZGl2PiAgICA8ZGl2IGlkPVwicHJvcGVydHlFZGl0b3JUcmlnZ2Vyc01vZGFsXCIgY2xhc3M9XCJtb2RhbCBmYWRlXCIgcm9sZT1cImRpYWxvZ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWRpYWxvZ1wiPiAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1jb250ZW50XCI+ICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXJcIj4gICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPiZ0aW1lczs8L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgIDxoNCBjbGFzcz1cIm1vZGFsLXRpdGxlXCIgZGF0YS1iaW5kPVwidGV4dDphcnJheUVkaXRvci50aXRsZVwiPjwvaDQ+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiPiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsXCIgZGF0YS1iaW5kPVwid2l0aDogYXJyYXlFZGl0b3JcIj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IHN0eWxlPVwid2lkdGg6NjUlXCIgZGF0YS1iaW5kPVwib3B0aW9uczoga29JdGVtcywgb3B0aW9uc1RleHQ6IFxcJ2tvVGV4dFxcJywgdmFsdWU6IGtvU2VsZWN0ZWRcIj48L3NlbGVjdD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29RdWVzdGlvbnMoKS5sZW5ndGggPiAwLCBjbGljazogb25BZGRDbGlja1wiIHN0eWxlPVwid2lkdGg6MTUlXCIgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIj48c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tcGx1c1wiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGRhdGEtYmluZD1cImVuYWJsZToga29TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXCIgc3R5bGU9XCJ3aWR0aDoxNSVcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29TZWxlY3RlZCgpID09IG51bGxcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1F1ZXN0aW9ucygpLmxlbmd0aCA9PSAwXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBUaGVyZSBpcyBubyBhbnkgcXVlc3Rpb24gaW4gdGhlIHN1cnZleS4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZToga29RdWVzdGlvbnMoKS5sZW5ndGggPiAwXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBQbGVhc2UgY3JlYXRlIGEgdHJpZ2dlciAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwid2l0aDoga29TZWxlY3RlZFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+T24gPC9zcGFuPjxzZWxlY3QgZGF0YS1iaW5kPVwib3B0aW9uczokcGFyZW50LmtvUXVlc3Rpb25zLCB2YWx1ZToga29OYW1lXCI+PC9zZWxlY3Q+IDxzcGFuPiA8L3NwYW4+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c2VsZWN0IGRhdGEtYmluZD1cIm9wdGlvbnM6YXZhaWxhYmxlT3BlcmF0b3JzLCBvcHRpb25zVmFsdWU6IFxcJ25hbWVcXCcsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCB2YWx1ZTprb09wZXJhdG9yXCI+PC9zZWxlY3Q+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBrb1JlcXVpcmVWYWx1ZSwgdmFsdWU6a29WYWx1ZVwiIC8+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicm93XCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1xcJywgZGF0YTogcGFnZXMgfSAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImNvbC1zbS02XCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwncHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1xcJywgZGF0YTogcXVlc3Rpb25zIH0gLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1mb290ZXJcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkFwcGx5XCIgZGF0YS1iaW5kPVwiY2xpY2s6IG9uQXBwbHlDbGlja1wiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwicHVsbC1yaWdodFwiIGRhdGEtZGlzbWlzcz1cIm1vZGFsXCIgdmFsdWU9XCJjbG9zZVwiIHN0eWxlPVwid2lkdGg6MTAwcHhcIiAvPiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgIDwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwicHJvcGVydHllZGl0b3ItdHJpZ2dlcnNpdGVtc1wiPiAgICA8ZGl2IGNsYXNzPVwicGFuZWxcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCI+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogdGl0bGVcIj48L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgICAgIDxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiIGRhdGEtYmluZD1cIm9wdGlvbnM6a29DaG9vc2VuLCB2YWx1ZToga29DaG9vc2VuU2VsZWN0ZWRcIiBzdHlsZT1cIndpZHRoOjIwMHB4O1wiPjwvc2VsZWN0PiAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb0Nob29zZW5TZWxlY3RlZCgpICE9IG51bGwsIGNsaWNrOiBvbkRlbGV0ZUNsaWNrXCIgc3R5bGU9XCJ3aWR0aDo0MHB4OyB2ZXJ0aWNhbC1hbGlnbjp0b3BcIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiPjxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1yZW1vdmVcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICA8ZGl2PiAgICAgICAgICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwib3B0aW9uczprb09iamVjdHMsIHZhbHVlOiBrb1NlbGVjdGVkXCIgc3R5bGU9XCJ3aWR0aDoyMDBweDtcIj48L3NlbGVjdD4gICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBkYXRhLWJpbmQ9XCJlbmFibGU6IGtvU2VsZWN0ZWQoKSAhPSBudWxsLCBjbGljazogb25BZGRDbGlja1wiIHN0eWxlPVwid2lkdGg6NDBweFwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXBsdXNcIj48L3NwYW4+PC9idXR0b24+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJwcm9wZXJ0eWVkaXRvci12YWxpZGF0b3JzXCI+ICAgIDxkaXY+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBrb1RleHRcIj48L3NwYW4+ICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0biBidG4tZGVmYXVsdFwiIGRhdGEtdG9nZ2xlPVwibW9kYWxcIiBkYXRhLXRhcmdldD1cIiNwcm9wZXJ0eUVkaXRvclZhbGlkYXRvcnNNb2RhbFwiPkVkaXQ8L2J1dHRvbj4gICAgPC9kaXY+ICAgIDxkaXYgaWQ9XCJwcm9wZXJ0eUVkaXRvclZhbGlkYXRvcnNNb2RhbFwiIGNsYXNzPVwibW9kYWwgZmFkZVwiIHJvbGU9XCJkaWFsb2dcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1kaWFsb2dcIj4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiPiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+ICAgICAgICAgICAgICAgICAgICA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImNsb3NlXCIgZGF0YS1kaXNtaXNzPVwibW9kYWxcIj4mdGltZXM7PC9idXR0b24+ICAgICAgICAgICAgICAgICAgICA8aDQgY2xhc3M9XCJtb2RhbC10aXRsZVwiIGRhdGEtYmluZD1cInRleHQ6YXJyYXlFZGl0b3IudGl0bGVcIj48L2g0PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cIm1vZGFsLWJvZHlcIj4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiIGRhdGEtYmluZD1cIndpdGg6IGFycmF5RWRpdG9yXCI+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cInJvd1wiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBzdHlsZT1cIndpZHRoOjY1JVwiIGRhdGEtYmluZD1cIm9wdGlvbnM6IGtvSXRlbXMsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCB2YWx1ZToga29TZWxlY3RlZFwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1wbHVzIGRyb3Bkb3duLXRvZ2dsZVwiIGRhdGEtdG9nZ2xlPVwiZHJvcGRvd25cIiBhcmlhLWhhc3BvcHVwPVwidHJ1ZVwiIGFyaWEtZXhwYW5kZWQ9XCJmYWxzZVwiPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImNhcmV0XCI+PC9zcGFuPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvYnV0dG9uPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx1bCBjbGFzcz1cImRyb3Bkb3duLW1lbnVcIiA+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogYXZhaWxhYmxlVmFsaWRhdG9ycyAtLT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGxpPjxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6ICRwYXJlbnQub25BZGRDbGljaygkZGF0YSlcIj48c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhXCI+PC9zcGFuPjwvYT48L2xpPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8IS0tIC9rbyAgLS0+ICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC91bD4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwiZW5hYmxlOiBrb1NlbGVjdGVkKCkgIT0gbnVsbCwgY2xpY2s6IG9uRGVsZXRlQ2xpY2tcIiBzdHlsZT1cIndpZHRoOjE1JVwiIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCI+PHNwYW4gY2xhc3M9XCJnbHlwaGljb24gZ2x5cGhpY29uLXJlbW92ZVwiPjwvc3Bhbj48L2J1dHRvbj4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+ICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdvYmplY3RlZGl0b3JcXCcsIGRhdGE6IHNlbGVjdGVkT2JqZWN0RWRpdG9yIH1cIj48L2Rpdj4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCI+ICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJBcHBseVwiIGRhdGEtYmluZD1cImNsaWNrOiBvbkFwcGx5Q2xpY2tcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cInB1bGwtcmlnaHRcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiIHZhbHVlPVwiY2xvc2VcIiBzdHlsZT1cIndpZHRoOjEwMHB4XCIgLz4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICAgICAgICAgIDwvZGl2PiAgICAgICAgICAgICAgICA8L2Rpdj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleWVtYmVkaW5nXCI+ICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6a29TY3JpcHRVc2luZ1wiPiAgICAgICAgPG9wdGlvbiB2YWx1ZT1cImJvb3RzdHJhcFwiPkZvciBib290c3RyYXAgZnJhbWV3b3JrPC9vcHRpb24+ICAgICAgICA8b3B0aW9uIHZhbHVlPVwic3RhbmRhcmRcIj5ObyBib290c3RyYXA8L29wdGlvbj4gICAgPC9zZWxlY3Q+ICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwidmFsdWU6a29TaG93QXNXaW5kb3dcIj4gICAgICAgIDxvcHRpb24gdmFsdWU9XCJwYWdlXCI+VXNlIFN1cnZleSBJbnNpZGUgYSBQYWdlPC9vcHRpb24+ICAgICAgICA8b3B0aW9uIHZhbHVlPVwid2luZG93XCI+VXNlIFN1cnZleSBhcyBhIFdpbmRvdzwvb3B0aW9uPiAgICA8L3NlbGVjdD4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiPlNjcmlwdHMgYW5kIHN0eWxlczwvZGl2PiAgICAgICAgPGRpdiBpZD1cInN1cnZleUVtYmVkaW5nSGVhZFwiIHN0eWxlPVwiaGVpZ2h0OjcwcHg7d2lkdGg6MTAwJVwiPjwvZGl2PiAgICA8L2Rpdj4gICAgPGRpdiBjbGFzcz1cInBhbmVsXCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29TaG93QXNXaW5kb3coKT09XFwncGFnZVxcJ1wiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5IVE1MIHBhcnQ8L2Rpdj4gICAgICAgIDxkaXYgaWQ9XCJzdXJ2ZXlFbWJlZGluZ0JvZHlcIiBzdHlsZT1cImhlaWdodDozMHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJwYW5lbFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInBhbmVsLWhlYWRpbmdcIj5KYXZhIFNjcmlwdDwvZGl2PiAgICAgICAgPGRpdiBpZD1cInN1cnZleUVtYmVkaW5nSmF2YVwiIHN0eWxlPVwiaGVpZ2h0OjMwMHB4O3dpZHRoOjEwMCVcIj48L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+Jzt9Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==
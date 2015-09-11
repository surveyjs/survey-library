var dxSurvey;
(function (dxSurvey) {
    var ItemValue = (function () {
        function ItemValue(value, text) {
            if (text === void 0) { text = null; }
            this.text = text;
            this.value = value;
        }
        ItemValue.setData = function (items, values) {
            items.length = 0;
            for (var i = 0; i < values.length; i++) {
                var value = values[i];
                var item = new ItemValue(null);
                if (value["value"]) {
                    item.text = value["text"];
                    item.value = value["value"];
                }
                else {
                    item.value = value;
                }
                items.push(item);
            }
        };
        ItemValue.getData = function (items) {
            var result = new Array();
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.hasText) {
                    result.push({ value: item.value, text: item.text });
                }
                else {
                    result.push(item.value);
                }
            }
            return result;
        };
        ItemValue.prototype.getType = function () { return "itemvalue"; };
        Object.defineProperty(ItemValue.prototype, "value", {
            get: function () { return this.itemValue; },
            set: function (newValue) {
                this.itemValue = newValue;
                if (!this.itemValue)
                    return;
                var str = this.itemValue.toString();
                var index = str.indexOf(ItemValue.Separator);
                if (index > -1) {
                    this.itemValue = str.slice(0, index);
                    this.text = str.slice(index + 1);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemValue.prototype, "hasText", {
            get: function () { return this.itemText ? true : false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemValue.prototype, "text", {
            get: function () {
                if (this.hasText)
                    return this.itemText;
                if (this.value)
                    return this.value.toString();
                return null;
            },
            set: function (newText) {
                this.itemText = newText;
            },
            enumerable: true,
            configurable: true
        });
        ItemValue.Separator = '|';
        return ItemValue;
    })();
    dxSurvey.ItemValue = ItemValue;
    var Base = (function () {
        function Base() {
            this.isKO = typeof ko !== 'undefined';
        }
        Base.prototype.getType = function () {
            throw new Error('This method is abstract');
        };
        return Base;
    })();
    dxSurvey.Base = Base;
    var Event = (function () {
        function Event() {
        }
        Event.prototype.fire = function (sender, options) {
            if (this.callbacks == null)
                return;
            for (var i = 0; i < this.callbacks.length; i++) {
                this.callbacks[i](sender, options);
            }
        };
        Event.prototype.add = function (func) {
            if (this.callbacks == null) {
                this.callbacks = new Array();
            }
            this.callbacks.push(func);
        };
        Event.prototype.remove = function (func) {
            if (this.callbacks == null)
                return;
            var index = this.callbacks.indexOf(func, 0);
            if (index != undefined) {
                this.callbacks.splice(index, 1);
            }
        };
        return Event;
    })();
    dxSurvey.Event = Event;
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var dxSurvey;
(function (dxSurvey) {
    var SurveyError = (function () {
        function SurveyError() {
        }
        SurveyError.prototype.getText = function () {
            throw new Error('This method is abstract');
        };
        return SurveyError;
    })();
    dxSurvey.SurveyError = SurveyError;
    var AnswerRequiredError = (function (_super) {
        __extends(AnswerRequiredError, _super);
        function AnswerRequiredError() {
            _super.call(this);
        }
        AnswerRequiredError.prototype.getText = function () {
            return "You should answer the question";
        };
        return AnswerRequiredError;
    })(SurveyError);
    dxSurvey.AnswerRequiredError = AnswerRequiredError;
})(dxSurvey || (dxSurvey = {}));

/// <reference path="base.ts" />
var dxSurvey;
(function (dxSurvey) {
    var JsonObjectProperty = (function () {
        function JsonObjectProperty(name) {
            this.name = name;
            this.className = null;
            this.defaultValue = null;
            this.onGetValue = null;
        }
        Object.defineProperty(JsonObjectProperty.prototype, "hasToUseGetValue", {
            get: function () { return this.onGetValue; },
            enumerable: true,
            configurable: true
        });
        JsonObjectProperty.prototype.isDefaultValue = function (value) {
            return (this.defaultValue) ? (this.defaultValue == value) : !(value);
        };
        JsonObjectProperty.prototype.getValue = function (obj) {
            if (this.onGetValue)
                return this.onGetValue(obj);
            return null;
        };
        Object.defineProperty(JsonObjectProperty.prototype, "hasToUseSetValue", {
            get: function () { return this.onSetValue; },
            enumerable: true,
            configurable: true
        });
        JsonObjectProperty.prototype.setValue = function (obj, value) {
            if (this.onSetValue) {
                this.onSetValue(obj, value);
            }
        };
        return JsonObjectProperty;
    })();
    dxSurvey.JsonObjectProperty = JsonObjectProperty;
    var JsonMetadataClass = (function () {
        function JsonMetadataClass(name, propertiesNames, creator, parentName) {
            if (creator === void 0) { creator = null; }
            if (parentName === void 0) { parentName = null; }
            this.name = name;
            this.creator = creator;
            this.parentName = parentName;
            this.properties = null;
            this.properties = new Array();
            for (var i = 0; i < propertiesNames.length; i++) {
                this.properties.push(new JsonObjectProperty(propertiesNames[i]));
            }
        }
        JsonMetadataClass.prototype.find = function (name) {
            for (var i = 0; i < this.properties.length; i++) {
                if (this.properties[i].name == name)
                    return this.properties[i];
            }
            return null;
        };
        return JsonMetadataClass;
    })();
    var JsonMetadata = (function () {
        function JsonMetadata() {
            this.classes = {};
            this.classProperties = {};
        }
        JsonMetadata.prototype.addClass = function (name, propertiesNames, creator, parentName) {
            if (creator === void 0) { creator = null; }
            if (parentName === void 0) { parentName = null; }
            var metaDataClass = new JsonMetadataClass(name, propertiesNames, creator, parentName);
            this.classes[name] = metaDataClass;
            return metaDataClass;
        };
        JsonMetadata.prototype.setCreator = function (name, creator) {
            var metaDataClass = this.classes[name];
            if (!metaDataClass)
                return;
            metaDataClass.creator = creator;
        };
        JsonMetadata.prototype.setPropertyValues = function (name, propertyName, propertyClassName, defaultValue, onGetValue, onSetValue) {
            if (defaultValue === void 0) { defaultValue = null; }
            if (onGetValue === void 0) { onGetValue = null; }
            if (onSetValue === void 0) { onSetValue = null; }
            var property = this.findProperty(name, propertyName);
            if (!property)
                return;
            property.className = propertyClassName;
            property.defaultValue = defaultValue;
            property.onGetValue = onGetValue;
            property.onSetValue = onSetValue;
        };
        JsonMetadata.prototype.getProperties = function (name) {
            var properties = this.classProperties[name];
            if (!properties) {
                properties = new Array();
                this.fillProperties(name, properties);
                this.classProperties[name] = properties;
            }
            return properties;
        };
        JsonMetadata.prototype.createClass = function (name) {
            var metaDataClass = this.classes[name];
            if (!metaDataClass)
                return null;
            return metaDataClass.creator();
        };
        JsonMetadata.prototype.findProperty = function (name, propertyName) {
            var metaDataClass = this.classes[name];
            return metaDataClass ? metaDataClass.find(propertyName) : null;
        };
        JsonMetadata.prototype.fillProperties = function (name, list) {
            var metaDataClass = this.classes[name];
            if (!metaDataClass)
                return;
            if (metaDataClass.parentName) {
                this.fillProperties(metaDataClass.parentName, list);
            }
            for (var i = 0; i < metaDataClass.properties.length; i++) {
                this.addProperty(metaDataClass.properties[i], list, list.length);
            }
        };
        JsonMetadata.prototype.addProperty = function (property, list, endIndex) {
            var index = -1;
            for (var i = 0; i < endIndex; i++) {
                if (list[i].name == property.name) {
                    index = i;
                    break;
                }
            }
            if (index < 0) {
                list.push(property);
            }
            else {
                list[index] = property;
            }
        };
        return JsonMetadata;
    })();
    dxSurvey.JsonMetadata = JsonMetadata;
    var JsonObject = (function () {
        function JsonObject() {
        }
        Object.defineProperty(JsonObject, "metaData", {
            get: function () { return JsonObject.metaDataValue; },
            enumerable: true,
            configurable: true
        });
        JsonObject.prototype.toJsonObject = function (obj) {
            return this.toJsonObjectCore(obj, null);
        };
        JsonObject.prototype.toObject = function (jsonObj, obj) {
            if (!jsonObj)
                return;
            var properties = null;
            if (obj.getType) {
                properties = JsonObject.metaData.getProperties(obj.getType());
            }
            for (var key in jsonObj) {
                this.valueToObj(jsonObj[key], obj, key, this.findProperty(properties, key));
            }
        };
        JsonObject.prototype.toJsonObjectCore = function (obj, property) {
            if (!obj.getType)
                return obj;
            var result = {};
            if (property != null && (!property.className)) {
                result[JsonObject.typePropertyName] = obj.getType();
            }
            var properties = JsonObject.metaData.getProperties(obj.getType());
            for (var i = 0; i < properties.length; i++) {
                this.valueToJson(obj, result, properties[i]);
            }
            return result;
        };
        JsonObject.prototype.valueToJson = function (obj, result, property) {
            var value = null;
            if (property.hasToUseGetValue) {
                value = property.getValue(obj);
            }
            else {
                value = obj[property.name];
            }
            if (property.isDefaultValue(value))
                return;
            if (this.isValueArray(value)) {
                var arrValue = [];
                for (var i = 0; i < value.length; i++) {
                    arrValue.push(this.toJsonObjectCore(value[i], property));
                }
                value = arrValue.length > 0 ? arrValue : null;
            }
            else {
                value = this.toJsonObjectCore(value, property);
            }
            if (!property.isDefaultValue(value)) {
                result[property.name] = value;
            }
        };
        JsonObject.prototype.valueToObj = function (value, obj, key, property) {
            if (property != null && property.hasToUseSetValue) {
                property.setValue(obj, value);
                return;
            }
            if (this.isValueArray(value)) {
                this.valueToArray(value, obj, key, property);
                return;
            }
            var newObj = this.createNewObj(value, property);
            if (newObj) {
                this.toObject(value, newObj);
                value = newObj;
            }
            obj[key] = value;
        };
        JsonObject.prototype.isValueArray = function (value) { return value.constructor.toString().indexOf("Array") > -1; };
        JsonObject.prototype.createNewObj = function (value, property) {
            var className = value[JsonObject.typePropertyName];
            if (className) {
                delete value[JsonObject.typePropertyName];
            }
            else {
                if (property != null && property.className) {
                    className = property.className;
                }
            }
            return (className) ? JsonObject.metaData.createClass(className) : null;
        };
        JsonObject.prototype.valueToArray = function (value, obj, key, property) {
            if (!this.isValueArray(obj[key])) {
                obj[key] = [];
            }
            for (var i = 0; i < value.length; i++) {
                var newValue = this.createNewObj(value[i], property);
                if (newValue) {
                    obj[key].push(newValue);
                    this.toObject(value[i], newValue);
                }
                else {
                    obj[key].push(value[i]);
                }
            }
        };
        JsonObject.prototype.findProperty = function (properties, key) {
            if (!properties)
                return null;
            for (var i = 0; i < properties.length; i++) {
                if (properties[i].name == key)
                    return properties[i];
            }
            return null;
        };
        JsonObject.typePropertyName = "type";
        JsonObject.metaDataValue = new JsonMetadata();
        return JsonObject;
    })();
    dxSurvey.JsonObject = JsonObject;
})(dxSurvey || (dxSurvey = {}));

/// <reference path="question.ts" />
/// <reference path="base.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionFactory = (function () {
        function QuestionFactory() {
            this.creatorHash = {};
        }
        QuestionFactory.prototype.registerQuestion = function (questionType, questionCreator) {
            this.creatorHash[questionType] = questionCreator;
        };
        QuestionFactory.prototype.createQuestion = function (questionType, name) {
            var creator = this.creatorHash[questionType];
            if (creator == null)
                return null;
            return creator(name);
        };
        QuestionFactory.Instance = new QuestionFactory();
        return QuestionFactory;
    })();
    dxSurvey.QuestionFactory = QuestionFactory;
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var Question = (function (_super) {
        __extends(Question, _super);
        function Question(name) {
            _super.call(this);
            this.name = name;
            this.titleValue = null;
            this.isRequiredValue = false;
            this.hasCommentValue = false;
            this.hasOtherValue = false;
            this.visibleValue = true;
            this.visibleIndexValue = -1;
            this.errors = [];
            this.isValueChangedInSurvey = false;
            if (this.isKO) {
                this.koValue = this.createkoValue();
                this.koComment = ko.observable(this.comment);
                this.koErrors = ko.observableArray(this.errors);
                this.dummyObservable = ko.observable(0);
                var self = this;
                this.koVisible = ko.computed(function () { self.dummyObservable(); return self.visibleValue; });
                this.koNo = ko.computed(function () { self.dummyObservable(); return self.visibleIndexValue + 1; });
                this.koValue.subscribe(function (newValue) {
                    self.setNewValue(newValue);
                });
                this.koComment.subscribe(function (newValue) {
                    self.setNewComment(newValue);
                });
            }
        }
        Question.prototype.createkoValue = function () { return ko.observable(this.value); };
        Question.prototype.setkoValue = function (newValue) {
            this.koValue(newValue);
        };
        Object.defineProperty(Question.prototype, "title", {
            get: function () { return (this.titleValue) ? this.titleValue : this.name; },
            set: function (newValue) { this.titleValue = newValue; },
            enumerable: true,
            configurable: true
        });
        Question.prototype.supportComment = function () { return false; };
        Question.prototype.supportOther = function () { return false; };
        Object.defineProperty(Question.prototype, "isRequired", {
            get: function () { return this.isRequiredValue; },
            set: function (val) { this.isRequiredValue = val; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "visible", {
            get: function () { return this.visibleValue; },
            set: function (val) {
                if (val == this.visible)
                    return;
                this.visibleValue = val;
                if (this.isKO) {
                    this.dummyObservable(this.dummyObservable() + 1);
                }
                if (this.data) {
                    this.data.onQuestionVisibilityChanged(this.name, this.visible);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "visibleIndex", {
            get: function () { return this.visibleIndexValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "hasComment", {
            get: function () { return this.hasCommentValue; },
            set: function (val) {
                if (!this.supportComment())
                    return;
                this.hasCommentValue = val;
                if (this.hasComment)
                    this.hasOther = false;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "hasOther", {
            get: function () { return this.hasOtherValue; },
            set: function (val) {
                if (!this.supportOther())
                    return;
                this.hasOtherValue = val;
                if (this.hasOther)
                    this.hasComment = false;
            },
            enumerable: true,
            configurable: true
        });
        Question.prototype.setData = function (newValue) {
            this.data = newValue;
            this.onSurveyValueChanged(this.value);
        };
        Object.defineProperty(Question.prototype, "value", {
            get: function () {
                if (this.data != null)
                    return this.data.getValue(this.name);
                return this.questionValue;
            },
            set: function (newValue) {
                this.setNewValue(newValue);
                if (this.isKO) {
                    this.setkoValue(this.value);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "comment", {
            get: function () { return this.data != null ? this.data.getComment(this.name) : ""; },
            set: function (newValue) {
                this.setNewComment(newValue);
                if (this.isKO) {
                    this.koComment(this.comment);
                }
            },
            enumerable: true,
            configurable: true
        });
        Question.prototype.isEmpty = function () { return this.value == null; };
        Question.prototype.hasErrors = function () {
            this.checkForErrors();
            return this.errors.length > 0;
        };
        Question.prototype.checkForErrors = function () {
            this.errors = [];
            if (this.isRequired) {
                if (this.isEmpty()) {
                    this.errors.push(new dxSurvey.AnswerRequiredError());
                }
            }
            if (this.isKO) {
                this.koErrors(this.errors);
            }
        };
        Question.prototype.setNewValue = function (newValue) {
            if (this.isValueChangedInSurvey)
                return;
            if (this.data != null) {
                this.data.setValue(this.name, newValue);
            }
            this.questionValue = newValue;
        };
        Question.prototype.setNewComment = function (newValue) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            }
        };
        //IQuestion
        Question.prototype.onSurveyValueChanged = function (newValue) {
            this.isValueChangedInSurvey = true;
            this.value = newValue;
            this.isValueChangedInSurvey = false;
        };
        Question.prototype.setVisibleIndex = function (value) {
            if (this.visibleIndexValue == value)
                return;
            this.visibleIndexValue = value;
            if (this.isKO) {
                this.dummyObservable(this.dummyObservable() + 1);
            }
        };
        return Question;
    })(dxSurvey.Base);
    dxSurvey.Question = Question;
    dxSurvey.JsonObject.metaData.addClass("question", ["name", "title", "isRequired", "hasComment", "hasOther", "visible"]);
    dxSurvey.JsonObject.metaData.setPropertyValues("question", "visible", null, true);
    dxSurvey.JsonObject.metaData.setPropertyValues("question", "title", null, null, function (obj) { return obj.titleValue; });
})(dxSurvey || (dxSurvey = {}));

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

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionSelectBase = (function (_super) {
        __extends(QuestionSelectBase, _super);
        function QuestionSelectBase(name) {
            _super.call(this, name);
            this.otherItem = new dxSurvey.ItemValue("other", "Other (describe)");
            this.choicesValues = new Array();
            if (this.isKO) {
                var self = this;
                this.koOtherVisible = ko.computed(function () { return self.iskoOtherVisible(); });
            }
        }
        QuestionSelectBase.prototype.iskoOtherVisible = function () {
            return this.koValue() == this.otherItem.value;
        };
        Object.defineProperty(QuestionSelectBase.prototype, "choices", {
            get: function () { return this.choicesValues; },
            set: function (newValue) {
                dxSurvey.ItemValue.setData(this.choicesValues, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionSelectBase.prototype, "visibleChoices", {
            get: function () {
                if (!this.hasOther)
                    return this.choices;
                var result = this.choices.slice();
                result.push(this.otherItem);
                return result;
            },
            enumerable: true,
            configurable: true
        });
        QuestionSelectBase.prototype.supportComment = function () { return true; };
        QuestionSelectBase.prototype.supportOther = function () { return true; };
        return QuestionSelectBase;
    })(dxSurvey.Question);
    dxSurvey.QuestionSelectBase = QuestionSelectBase;
    dxSurvey.JsonObject.metaData.addClass("selectbase", ["choices"], null, "question");
    dxSurvey.JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null, function (obj) { return dxSurvey.ItemValue.getData(obj.choices); }, function (obj, value) { dxSurvey.ItemValue.setData(obj.choices, value); });
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionCheckbox = (function (_super) {
        __extends(QuestionCheckbox, _super);
        function QuestionCheckbox(name) {
            _super.call(this, name);
            this.name = name;
        }
        QuestionCheckbox.prototype.createkoValue = function () { return ko.observableArray(this.value); };
        QuestionCheckbox.prototype.setkoValue = function (newValue) {
            this.koValue([].concat(newValue));
        };
        QuestionCheckbox.prototype.iskoOtherVisible = function () {
            return this.koValue.indexOf(this.otherItem.value) >= 0;
        };
        QuestionCheckbox.prototype.getType = function () {
            return "checkbox";
        };
        return QuestionCheckbox;
    })(dxSurvey.QuestionSelectBase);
    dxSurvey.QuestionCheckbox = QuestionCheckbox;
    dxSurvey.JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckbox(""); }, "selectbase");
    dxSurvey.QuestionFactory.Instance.registerQuestion("checkbox", function (name) { return new QuestionCheckbox(name); });
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionComment = (function (_super) {
        __extends(QuestionComment, _super);
        function QuestionComment(name) {
            _super.call(this, name);
            this.name = name;
            this.rows = 3;
        }
        QuestionComment.prototype.getType = function () {
            return "comment";
        };
        QuestionComment.prototype.isEmpty = function () {
            return _super.prototype.isEmpty.call(this) || this.value == "";
        };
        return QuestionComment;
    })(dxSurvey.Question);
    dxSurvey.QuestionComment = QuestionComment;
    dxSurvey.JsonObject.metaData.addClass("comment", ["rows"], function () { return new QuestionComment(""); }, "question");
    dxSurvey.JsonObject.metaData.setPropertyValues("comment", "rows", null, 3);
    dxSurvey.QuestionFactory.Instance.registerQuestion("comment", function (name) { return new QuestionComment(name); });
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionDropdown = (function (_super) {
        __extends(QuestionDropdown, _super);
        function QuestionDropdown(name) {
            _super.call(this, name);
            this.name = name;
        }
        QuestionDropdown.prototype.getType = function () {
            return "dropdown";
        };
        return QuestionDropdown;
    })(dxSurvey.QuestionSelectBase);
    dxSurvey.QuestionDropdown = QuestionDropdown;
    dxSurvey.JsonObject.metaData.addClass("dropdown", [], function () { return new QuestionDropdown(""); }, "selectbase");
    dxSurvey.QuestionFactory.Instance.registerQuestion("dropdown", function (name) { return new QuestionDropdown(name); });
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var MatrixRow = (function (_super) {
        __extends(MatrixRow, _super);
        function MatrixRow(name, text, fullName, data, value) {
            _super.call(this);
            this.name = name;
            this.text = text;
            this.fullName = fullName;
            this.data = data;
            this.rowValue = value;
            if (this.isKO) {
                this.koValue = ko.observable(this.rowValue);
                var self = this;
                this.koValue.subscribe(function (newValue) {
                    self.value = newValue;
                });
            }
        }
        Object.defineProperty(MatrixRow.prototype, "value", {
            get: function () { return this.rowValue; },
            set: function (newValue) {
                this.rowValue = newValue;
                if (this.data)
                    this.data.onMatrixRowChanged(this);
            },
            enumerable: true,
            configurable: true
        });
        return MatrixRow;
    })(dxSurvey.Base);
    dxSurvey.MatrixRow = MatrixRow;
    var QuestionMatrix = (function (_super) {
        __extends(QuestionMatrix, _super);
        function QuestionMatrix(name) {
            _super.call(this, name);
            this.name = name;
            this.columnsValue = [];
            this.rowsValue = [];
        }
        QuestionMatrix.prototype.getType = function () {
            return "matrix";
        };
        Object.defineProperty(QuestionMatrix.prototype, "hasRows", {
            get: function () {
                return this.rowsValue.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrix.prototype, "columns", {
            get: function () { return this.columnsValue; },
            set: function (newValue) {
                dxSurvey.ItemValue.setData(this.columnsValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrix.prototype, "rows", {
            get: function () { return this.rowsValue; },
            set: function (newValue) {
                dxSurvey.ItemValue.setData(this.rowsValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrix.prototype, "visibleRows", {
            get: function () {
                var result = new Array();
                var val = this.value;
                if (!val)
                    val = {};
                for (var i = 0; i < this.rows.length; i++) {
                    if (!this.rows[i].value)
                        continue;
                    result.push(new MatrixRow(this.rows[i].value, this.rows[i].text, this.name + '_' + this.rows[i].value.toString(), this, val[this.rows[i].value]));
                }
                if (result.length == 0) {
                    result.push(new MatrixRow(null, "", this.name, this, val));
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        //IMatrixData
        QuestionMatrix.prototype.onMatrixRowChanged = function (row) {
            if (!this.hasRows) {
                this.value = row.value;
            }
            else {
                if (!this.value) {
                    this.value = {};
                }
                this.value[row.name] = row.value;
            }
        };
        return QuestionMatrix;
    })(dxSurvey.Question);
    dxSurvey.QuestionMatrix = QuestionMatrix;
    dxSurvey.JsonObject.metaData.addClass("matrix", ["columns", "rows"], function () { return new QuestionMatrix(""); }, "question");
    dxSurvey.JsonObject.metaData.setPropertyValues("matrix", "columns", null, null, function (obj) { return dxSurvey.ItemValue.getData(obj.columns); }, function (obj, value) { dxSurvey.ItemValue.setData(obj.columns, value); });
    dxSurvey.JsonObject.metaData.setPropertyValues("matrix", "rows", null, null, function (obj) { return dxSurvey.ItemValue.getData(obj.rows); }, function (obj, value) { dxSurvey.ItemValue.setData(obj.rows, value); });
    dxSurvey.QuestionFactory.Instance.registerQuestion("matrix", function (name) { return new QuestionMatrix(name); });
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionRadiogroup = (function (_super) {
        __extends(QuestionRadiogroup, _super);
        function QuestionRadiogroup(name) {
            _super.call(this, name);
            this.name = name;
        }
        QuestionRadiogroup.prototype.getType = function () {
            return "radiogroup";
        };
        return QuestionRadiogroup;
    })(dxSurvey.QuestionSelectBase);
    dxSurvey.QuestionRadiogroup = QuestionRadiogroup;
    dxSurvey.JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroup(""); }, "selectbase");
    dxSurvey.QuestionFactory.Instance.registerQuestion("radiogroup", function (name) { return new QuestionRadiogroup(name); });
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionRating = (function (_super) {
        __extends(QuestionRating, _super);
        function QuestionRating(name) {
            _super.call(this, name);
            this.name = name;
            this.rates = [];
            this.mininumRateDescription = null;
            this.maximumRateDescription = null;
            if (this.isKO) {
                var self = this;
                this.koVisibleRateValues = ko.computed(function () {
                    return self.visibleRateValues;
                });
            }
        }
        Object.defineProperty(QuestionRating.prototype, "rateValues", {
            get: function () { return this.rates; },
            set: function (newValue) {
                dxSurvey.ItemValue.setData(this.rates, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionRating.prototype, "visibleRateValues", {
            get: function () {
                if (this.rateValues.length > 0)
                    return this.rateValues;
                return QuestionRating.defaultRateValues;
            },
            enumerable: true,
            configurable: true
        });
        QuestionRating.prototype.getType = function () {
            return "rating";
        };
        QuestionRating.prototype.supportComment = function () { return true; };
        QuestionRating.prototype.supportOther = function () { return true; };
        QuestionRating.defaultRateValues = [];
        return QuestionRating;
    })(dxSurvey.Question);
    dxSurvey.QuestionRating = QuestionRating;
    dxSurvey.ItemValue.setData(QuestionRating.defaultRateValues, [1, 2, 3, 4, 5]);
    dxSurvey.JsonObject.metaData.addClass("rating", ["rateValues", "mininumRateDescription", "maximumRateDescription"], function () { return new QuestionRating(""); }, "question");
    dxSurvey.JsonObject.metaData.setPropertyValues("rating", "rateValues", null, null, function (obj) { return dxSurvey.ItemValue.getData(obj.rateValues); }, function (obj, value) { dxSurvey.ItemValue.setData(obj.rateValues, value); });
    dxSurvey.QuestionFactory.Instance.registerQuestion("rating", function (name) { return new QuestionRating(name); });
})(dxSurvey || (dxSurvey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var dxSurvey;
(function (dxSurvey) {
    var QuestionText = (function (_super) {
        __extends(QuestionText, _super);
        function QuestionText(name) {
            _super.call(this, name);
            this.name = name;
        }
        QuestionText.prototype.getType = function () {
            return "text";
        };
        QuestionText.prototype.isEmpty = function () {
            return _super.prototype.isEmpty.call(this) || this.value == "";
        };
        return QuestionText;
    })(dxSurvey.Question);
    dxSurvey.QuestionText = QuestionText;
    dxSurvey.JsonObject.metaData.addClass("text", [], function () { return new QuestionText(""); }, "question");
    dxSurvey.QuestionFactory.Instance.registerQuestion("text", function (name) { return new QuestionText(name); });
})(dxSurvey || (dxSurvey = {}));

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
            this.currentPageValue = null;
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
            if (ko) {
                this.dummyObservable = ko.observable(0);
                this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
                this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
                this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
            }
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
        Object.defineProperty(Survey.prototype, "currentPage", {
            get: function () {
                if (this.currentPageValue != null) {
                    if (this.pages.indexOf(this.currentPageValue) < 0) {
                        this.currentPage = null;
                    }
                }
                if (this.currentPageValue == null && this.pages.length > 0) {
                    this.currentPage = this.pages[0];
                }
                return this.currentPageValue;
            },
            set: function (value) {
                if (value != null && this.pages.indexOf(value) < 0)
                    return;
                if (value == this.currentPageValue)
                    return;
                this.currentPageValue = value;
                this.updateKoCurrentPage();
            },
            enumerable: true,
            configurable: true
        });
        Survey.prototype.updateKoCurrentPage = function () {
            if (this.isKO) {
                this.dummyObservable(this.dummyObservable() + 1);
            }
        };
        Survey.prototype.nextPage = function () {
            if (this.isLastPage)
                return false;
            if (this.isCurrentPageHasErrors())
                return false;
            var index = this.pages.indexOf(this.currentPage);
            this.currentPage = this.pages[index + 1];
            return true;
        };
        Survey.prototype.isCurrentPageHasErrors = function () {
            if (this.currentPage == null)
                return true;
            return this.currentPage.hasErrors();
        };
        Survey.prototype.prevPage = function () {
            if (this.isFirstPage)
                return false;
            var index = this.pages.indexOf(this.currentPage);
            this.currentPage = this.pages[index - 1];
        };
        Survey.prototype.completeLastPage = function () {
            if (this.isCurrentPageHasErrors())
                return false;
            this.onComplete.fire(this, null);
            return true;
        };
        Object.defineProperty(Survey.prototype, "isFirstPage", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                return this.pages.indexOf(this.currentPage) == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "isLastPage", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                return this.pages.indexOf(this.currentPage) == this.pages.length - 1;
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
                this.loadFile("templates/dx.survey.ko.html", function (html) {
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
            this.updateKoCurrentPage();
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudHMiLCJlcnJvci50cyIsImpzb25vYmplY3QudHMiLCJxdWVzdGlvbmZhY3RvcnkudHMiLCJxdWVzdGlvbi50cyIsInBhZ2UudHMiLCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzIiwicXVlc3Rpb25fY2hlY2tib3gudHMiLCJxdWVzdGlvbl9jb21tZW50LnRzIiwicXVlc3Rpb25fZHJvcGRvd24udHMiLCJxdWVzdGlvbl9tYXRyaXgudHMiLCJxdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwicXVlc3Rpb25fcmF0aW5nLnRzIiwicXVlc3Rpb25fdGV4dC50cyIsInN1cnZleS50cyJdLCJuYW1lcyI6WyJkeFN1cnZleSIsImR4U3VydmV5Lkl0ZW1WYWx1ZSIsImR4U3VydmV5Lkl0ZW1WYWx1ZS5jb25zdHJ1Y3RvciIsImR4U3VydmV5Lkl0ZW1WYWx1ZS5zZXREYXRhIiwiZHhTdXJ2ZXkuSXRlbVZhbHVlLmdldERhdGEiLCJkeFN1cnZleS5JdGVtVmFsdWUuZ2V0VHlwZSIsImR4U3VydmV5Lkl0ZW1WYWx1ZS52YWx1ZSIsImR4U3VydmV5Lkl0ZW1WYWx1ZS5oYXNUZXh0IiwiZHhTdXJ2ZXkuSXRlbVZhbHVlLnRleHQiLCJkeFN1cnZleS5CYXNlIiwiZHhTdXJ2ZXkuQmFzZS5jb25zdHJ1Y3RvciIsImR4U3VydmV5LkJhc2UuZ2V0VHlwZSIsImR4U3VydmV5LkV2ZW50IiwiZHhTdXJ2ZXkuRXZlbnQuY29uc3RydWN0b3IiLCJkeFN1cnZleS5FdmVudC5maXJlIiwiZHhTdXJ2ZXkuRXZlbnQuYWRkIiwiZHhTdXJ2ZXkuRXZlbnQucmVtb3ZlIiwiZHhTdXJ2ZXkuU3VydmV5RXJyb3IiLCJkeFN1cnZleS5TdXJ2ZXlFcnJvci5jb25zdHJ1Y3RvciIsImR4U3VydmV5LlN1cnZleUVycm9yLmdldFRleHQiLCJkeFN1cnZleS5BbnN3ZXJSZXF1aXJlZEVycm9yIiwiZHhTdXJ2ZXkuQW5zd2VyUmVxdWlyZWRFcnJvci5jb25zdHJ1Y3RvciIsImR4U3VydmV5LkFuc3dlclJlcXVpcmVkRXJyb3IuZ2V0VGV4dCIsImR4U3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSIsImR4U3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5jb25zdHJ1Y3RvciIsImR4U3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlIiwiZHhTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmlzRGVmYXVsdFZhbHVlIiwiZHhTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmdldFZhbHVlIiwiZHhTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5Lmhhc1RvVXNlU2V0VmFsdWUiLCJkeFN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuc2V0VmFsdWUiLCJkeFN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcyIsImR4U3VydmV5Lkpzb25NZXRhZGF0YUNsYXNzLmNvbnN0cnVjdG9yIiwiZHhTdXJ2ZXkuSnNvbk1ldGFkYXRhQ2xhc3MuZmluZCIsImR4U3VydmV5Lkpzb25NZXRhZGF0YSIsImR4U3VydmV5Lkpzb25NZXRhZGF0YS5jb25zdHJ1Y3RvciIsImR4U3VydmV5Lkpzb25NZXRhZGF0YS5hZGRDbGFzcyIsImR4U3VydmV5Lkpzb25NZXRhZGF0YS5zZXRDcmVhdG9yIiwiZHhTdXJ2ZXkuSnNvbk1ldGFkYXRhLnNldFByb3BlcnR5VmFsdWVzIiwiZHhTdXJ2ZXkuSnNvbk1ldGFkYXRhLmdldFByb3BlcnRpZXMiLCJkeFN1cnZleS5Kc29uTWV0YWRhdGEuY3JlYXRlQ2xhc3MiLCJkeFN1cnZleS5Kc29uTWV0YWRhdGEuZmluZFByb3BlcnR5IiwiZHhTdXJ2ZXkuSnNvbk1ldGFkYXRhLmZpbGxQcm9wZXJ0aWVzIiwiZHhTdXJ2ZXkuSnNvbk1ldGFkYXRhLmFkZFByb3BlcnR5IiwiZHhTdXJ2ZXkuSnNvbk9iamVjdCIsImR4U3VydmV5Lkpzb25PYmplY3QuY29uc3RydWN0b3IiLCJkeFN1cnZleS5Kc29uT2JqZWN0Lm1ldGFEYXRhIiwiZHhTdXJ2ZXkuSnNvbk9iamVjdC50b0pzb25PYmplY3QiLCJkeFN1cnZleS5Kc29uT2JqZWN0LnRvT2JqZWN0IiwiZHhTdXJ2ZXkuSnNvbk9iamVjdC50b0pzb25PYmplY3RDb3JlIiwiZHhTdXJ2ZXkuSnNvbk9iamVjdC52YWx1ZVRvSnNvbiIsImR4U3VydmV5Lkpzb25PYmplY3QudmFsdWVUb09iaiIsImR4U3VydmV5Lkpzb25PYmplY3QuaXNWYWx1ZUFycmF5IiwiZHhTdXJ2ZXkuSnNvbk9iamVjdC5jcmVhdGVOZXdPYmoiLCJkeFN1cnZleS5Kc29uT2JqZWN0LnZhbHVlVG9BcnJheSIsImR4U3VydmV5Lkpzb25PYmplY3QuZmluZFByb3BlcnR5IiwiZHhTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5IiwiZHhTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5LmNvbnN0cnVjdG9yIiwiZHhTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5LnJlZ2lzdGVyUXVlc3Rpb24iLCJkeFN1cnZleS5RdWVzdGlvbkZhY3RvcnkuY3JlYXRlUXVlc3Rpb24iLCJkeFN1cnZleS5RdWVzdGlvbiIsImR4U3VydmV5LlF1ZXN0aW9uLmNvbnN0cnVjdG9yIiwiZHhTdXJ2ZXkuUXVlc3Rpb24uY3JlYXRla29WYWx1ZSIsImR4U3VydmV5LlF1ZXN0aW9uLnNldGtvVmFsdWUiLCJkeFN1cnZleS5RdWVzdGlvbi50aXRsZSIsImR4U3VydmV5LlF1ZXN0aW9uLnN1cHBvcnRDb21tZW50IiwiZHhTdXJ2ZXkuUXVlc3Rpb24uc3VwcG9ydE90aGVyIiwiZHhTdXJ2ZXkuUXVlc3Rpb24uaXNSZXF1aXJlZCIsImR4U3VydmV5LlF1ZXN0aW9uLnZpc2libGUiLCJkeFN1cnZleS5RdWVzdGlvbi52aXNpYmxlSW5kZXgiLCJkeFN1cnZleS5RdWVzdGlvbi5oYXNDb21tZW50IiwiZHhTdXJ2ZXkuUXVlc3Rpb24uaGFzT3RoZXIiLCJkeFN1cnZleS5RdWVzdGlvbi5zZXREYXRhIiwiZHhTdXJ2ZXkuUXVlc3Rpb24udmFsdWUiLCJkeFN1cnZleS5RdWVzdGlvbi5jb21tZW50IiwiZHhTdXJ2ZXkuUXVlc3Rpb24uaXNFbXB0eSIsImR4U3VydmV5LlF1ZXN0aW9uLmhhc0Vycm9ycyIsImR4U3VydmV5LlF1ZXN0aW9uLmNoZWNrRm9yRXJyb3JzIiwiZHhTdXJ2ZXkuUXVlc3Rpb24uc2V0TmV3VmFsdWUiLCJkeFN1cnZleS5RdWVzdGlvbi5zZXROZXdDb21tZW50IiwiZHhTdXJ2ZXkuUXVlc3Rpb24ub25TdXJ2ZXlWYWx1ZUNoYW5nZWQiLCJkeFN1cnZleS5RdWVzdGlvbi5zZXRWaXNpYmxlSW5kZXgiLCJkeFN1cnZleS5QYWdlIiwiZHhTdXJ2ZXkuUGFnZS5jb25zdHJ1Y3RvciIsImR4U3VydmV5LlBhZ2UuZ2V0VHlwZSIsImR4U3VydmV5LlBhZ2UuYWRkUXVlc3Rpb24iLCJkeFN1cnZleS5QYWdlLmFkZE5ld1F1ZXN0aW9uIiwiZHhTdXJ2ZXkuUGFnZS5oYXNFcnJvcnMiLCJkeFN1cnZleS5QYWdlLmFkZFF1ZXN0aW9uc1RvTGlzdCIsImR4U3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZSIsImR4U3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5jb25zdHJ1Y3RvciIsImR4U3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5pc2tvT3RoZXJWaXNpYmxlIiwiZHhTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLmNob2ljZXMiLCJkeFN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2UudmlzaWJsZUNob2ljZXMiLCJkeFN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uuc3VwcG9ydENvbW1lbnQiLCJkeFN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uuc3VwcG9ydE90aGVyIiwiZHhTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveCIsImR4U3VydmV5LlF1ZXN0aW9uQ2hlY2tib3guY29uc3RydWN0b3IiLCJkeFN1cnZleS5RdWVzdGlvbkNoZWNrYm94LmNyZWF0ZWtvVmFsdWUiLCJkeFN1cnZleS5RdWVzdGlvbkNoZWNrYm94LnNldGtvVmFsdWUiLCJkeFN1cnZleS5RdWVzdGlvbkNoZWNrYm94Lmlza29PdGhlclZpc2libGUiLCJkeFN1cnZleS5RdWVzdGlvbkNoZWNrYm94LmdldFR5cGUiLCJkeFN1cnZleS5RdWVzdGlvbkNvbW1lbnQiLCJkeFN1cnZleS5RdWVzdGlvbkNvbW1lbnQuY29uc3RydWN0b3IiLCJkeFN1cnZleS5RdWVzdGlvbkNvbW1lbnQuZ2V0VHlwZSIsImR4U3VydmV5LlF1ZXN0aW9uQ29tbWVudC5pc0VtcHR5IiwiZHhTdXJ2ZXkuUXVlc3Rpb25Ecm9wZG93biIsImR4U3VydmV5LlF1ZXN0aW9uRHJvcGRvd24uY29uc3RydWN0b3IiLCJkeFN1cnZleS5RdWVzdGlvbkRyb3Bkb3duLmdldFR5cGUiLCJkeFN1cnZleS5NYXRyaXhSb3ciLCJkeFN1cnZleS5NYXRyaXhSb3cuY29uc3RydWN0b3IiLCJkeFN1cnZleS5NYXRyaXhSb3cudmFsdWUiLCJkeFN1cnZleS5RdWVzdGlvbk1hdHJpeCIsImR4U3VydmV5LlF1ZXN0aW9uTWF0cml4LmNvbnN0cnVjdG9yIiwiZHhTdXJ2ZXkuUXVlc3Rpb25NYXRyaXguZ2V0VHlwZSIsImR4U3VydmV5LlF1ZXN0aW9uTWF0cml4Lmhhc1Jvd3MiLCJkeFN1cnZleS5RdWVzdGlvbk1hdHJpeC5jb2x1bW5zIiwiZHhTdXJ2ZXkuUXVlc3Rpb25NYXRyaXgucm93cyIsImR4U3VydmV5LlF1ZXN0aW9uTWF0cml4LnZpc2libGVSb3dzIiwiZHhTdXJ2ZXkuUXVlc3Rpb25NYXRyaXgub25NYXRyaXhSb3dDaGFuZ2VkIiwiZHhTdXJ2ZXkuUXVlc3Rpb25SYWRpb2dyb3VwIiwiZHhTdXJ2ZXkuUXVlc3Rpb25SYWRpb2dyb3VwLmNvbnN0cnVjdG9yIiwiZHhTdXJ2ZXkuUXVlc3Rpb25SYWRpb2dyb3VwLmdldFR5cGUiLCJkeFN1cnZleS5RdWVzdGlvblJhdGluZyIsImR4U3VydmV5LlF1ZXN0aW9uUmF0aW5nLmNvbnN0cnVjdG9yIiwiZHhTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcucmF0ZVZhbHVlcyIsImR4U3VydmV5LlF1ZXN0aW9uUmF0aW5nLnZpc2libGVSYXRlVmFsdWVzIiwiZHhTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcuZ2V0VHlwZSIsImR4U3VydmV5LlF1ZXN0aW9uUmF0aW5nLnN1cHBvcnRDb21tZW50IiwiZHhTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcuc3VwcG9ydE90aGVyIiwiZHhTdXJ2ZXkuUXVlc3Rpb25UZXh0IiwiZHhTdXJ2ZXkuUXVlc3Rpb25UZXh0LmNvbnN0cnVjdG9yIiwiZHhTdXJ2ZXkuUXVlc3Rpb25UZXh0LmdldFR5cGUiLCJkeFN1cnZleS5RdWVzdGlvblRleHQuaXNFbXB0eSIsImR4U3VydmV5LlN1cnZleSIsImR4U3VydmV5LlN1cnZleS5jb25zdHJ1Y3RvciIsImR4U3VydmV5LlN1cnZleS5nZXRUeXBlIiwiZHhTdXJ2ZXkuU3VydmV5LmRhdGEiLCJkeFN1cnZleS5TdXJ2ZXkuUGFnZUNvdW50IiwiZHhTdXJ2ZXkuU3VydmV5LmN1cnJlbnRQYWdlIiwiZHhTdXJ2ZXkuU3VydmV5LnVwZGF0ZUtvQ3VycmVudFBhZ2UiLCJkeFN1cnZleS5TdXJ2ZXkubmV4dFBhZ2UiLCJkeFN1cnZleS5TdXJ2ZXkuaXNDdXJyZW50UGFnZUhhc0Vycm9ycyIsImR4U3VydmV5LlN1cnZleS5wcmV2UGFnZSIsImR4U3VydmV5LlN1cnZleS5jb21wbGV0ZUxhc3RQYWdlIiwiZHhTdXJ2ZXkuU3VydmV5LmlzRmlyc3RQYWdlIiwiZHhTdXJ2ZXkuU3VydmV5LmlzTGFzdFBhZ2UiLCJkeFN1cnZleS5TdXJ2ZXkuZ2V0UGFnZSIsImR4U3VydmV5LlN1cnZleS5hZGRQYWdlIiwiZHhTdXJ2ZXkuU3VydmV5LmFkZE5ld1BhZ2UiLCJkeFN1cnZleS5TdXJ2ZXkuZ2V0UXVlc3Rpb25CeU5hbWUiLCJkeFN1cnZleS5TdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zIiwiZHhTdXJ2ZXkuU3VydmV5Lm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQiLCJkeFN1cnZleS5TdXJ2ZXkubm90aWZ5QWxsUXVlc3Rpb25zT25WYWx1ZUNoYW5nZWQiLCJkeFN1cnZleS5TdXJ2ZXkucmVuZGVyIiwiZHhTdXJ2ZXkuU3VydmV5Lm9uQmVmb3JlUmVuZGVyIiwiZHhTdXJ2ZXkuU3VydmV5LmxvYWRGaWxlIiwiZHhTdXJ2ZXkuU3VydmV5LmFwcGx5QmluZGluZyIsImR4U3VydmV5LlN1cnZleS51cGRhdGVWaXNpYmxlSW5kZXhlcyIsImR4U3VydmV5LlN1cnZleS5nZXRWYWx1ZSIsImR4U3VydmV5LlN1cnZleS5zZXRWYWx1ZSIsImR4U3VydmV5LlN1cnZleS5nZXRDb21tZW50IiwiZHhTdXJ2ZXkuU3VydmV5LnNldENvbW1lbnQiLCJkeFN1cnZleS5TdXJ2ZXkub25RdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkIl0sIm1hcHBpbmdzIjoiQUFBQSxJQUFPLFFBQVEsQ0F3R2Q7QUF4R0QsV0FBTyxRQUFRLEVBQUMsQ0FBQztJQWtCYkE7UUE4QklDLG1CQUFZQSxLQUFVQSxFQUFFQSxJQUFtQkE7WUFBbkJDLG9CQUFtQkEsR0FBbkJBLFdBQW1CQTtZQUN2Q0EsSUFBSUEsQ0FBQ0EsSUFBSUEsR0FBR0EsSUFBSUEsQ0FBQ0E7WUFDakJBLElBQUlBLENBQUNBLEtBQUtBLEdBQUdBLEtBQUtBLENBQUNBO1FBQ3ZCQSxDQUFDQTtRQS9CYUQsaUJBQU9BLEdBQXJCQSxVQUFzQkEsS0FBdUJBLEVBQUVBLE1BQWtCQTtZQUM3REUsS0FBS0EsQ0FBQ0EsTUFBTUEsR0FBR0EsQ0FBQ0EsQ0FBQ0E7WUFDakJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEVBQUVBLENBQUNBLEdBQUdBLE1BQU1BLENBQUNBLE1BQU1BLEVBQUVBLENBQUNBLEVBQUVBLEVBQUVBLENBQUNBO2dCQUNyQ0EsSUFBSUEsS0FBS0EsR0FBR0EsTUFBTUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ3RCQSxJQUFJQSxJQUFJQSxHQUFHQSxJQUFJQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtnQkFDL0JBLEVBQUVBLENBQUNBLENBQUNBLEtBQUtBLENBQUNBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBLENBQUNBO29CQUNqQkEsSUFBSUEsQ0FBQ0EsSUFB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O1dBSGdETDtRQUtqREEsc0JBQVdBLHVDQUFXQTtpQkFBdEJBO2dCQUNJTSxJQUFJQSxNQUFNQSxHQUFHQSxJQUFJQSxLQUFLQSxFQUFhQSxDQUFDQTtnQkFDcENBLElBQUlBLEdBQUdBLEdBQUdBLElBQUlBLENBQUNBLEtBQUtBLENBQUNBO2dCQUNyQkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0E7b0JBQUNBLEdBQUdBLEdBQUdBLEVBQUVBLENBQUNBO2dCQUNuQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsSUFBSUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7b0JBQ3hDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQTt3QkFBQ0EsUUFBUUEsQ0FBQ0E7b0JBQ2xDQSxNQUFNQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxTQUFTQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxJQUFJQSxFQUFFQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxHQUFHQSxHQUFHQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxRQUFRQSxFQUFFQSxFQUFFQSxJQUFJQSxFQUFFQSxHQUFHQSxDQUFDQSxJQUFJQSxDQUFDQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtnQkFDdEpBLENBQUNBO2dCQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxNQUFNQSxDQUFDQSxNQUFNQSxJQUFJQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtv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LFFBQVFBLElBQUlBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2dCQUNyQ0EsT0FBT0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsSUFBSUEsQ0FBQ0EsQ0FBQ0E7WUFDbkNBLENBQUNBO1lBQUNBLElBQUlBLENBQUNBLENBQUNBO2dCQUNKQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxJQUFJQSxDQUFDQSxHQUFHQSxRQUFRQSxDQUFDQTtZQUN2Q0EsQ0FBQ0E7UUFDTEEsQ0FBQ0E7UUFDRDVCLDRDQUEyQkEsR0FBM0JBLFVBQTRCQSxJQUFZQSxFQUFFQSxRQUFpQkE7WUFDdkQ2QixJQUFJQSxDQUFDQSxvQkFBb0JBLEVBQUVBLENBQUNBO1lBQzVCQSxJQUFJQSxDQUFDQSxnQkFBZ0JBLENBQUNBLElBQUlBLENBQUNBLElBQUlBLEVBQUVBLEVBQUVBLE1BQU1BLEVBQUVBLElBQUlBLEVBQUVBLFNBQVNBLEVBQUVBLFFBQVFBLEVBQUVBLENBQUNBLENBQUNBO1FBQzVFQSxDQUFDQTtRQUNMN0IsYUFBQ0E7SUFBREEsQ0EzTkFySSxBQTJOQ3FJLEVBM04yQnJJLGFBQUlBLEVBMk4vQkE7SUEzTllBLGVBQU1BLFNBMk5sQkEsQ0FBQUE7SUFFREEsbUJBQVVBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLENBQUNBLFFBQVFBLEVBQUVBLENBQUNBLE9BQU9BLEVBQUVBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO0lBQzNEQSxtQkFBVUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsaUJBQWlCQSxDQUFDQSxRQUFRQSxFQUFFQSxPQUFPQSxFQUFFQSxNQUFNQSxDQUFDQSxDQUFDQTtBQUNyRUEsQ0FBQ0EsRUFoT00sUUFBUSxLQUFSLFFBQVEsUUFnT2QiLCJmaWxlIjoiZHguc3VydmV5LmpzIiwic291cmNlc0NvbnRlbnQiOlsibW9kdWxlIGR4U3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSGFzaFRhYmxlPFQ+IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBUO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5RGF0YSB7XHJcbiAgICAgICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSk7XHJcbiAgICAgICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpO1xyXG4gICAgICAgIG9uUXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBib29sZWFuKTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVF1ZXN0aW9uIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgICAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcik7XHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEl0ZW1WYWx1ZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTZXBhcmF0b3IgPSAnfCc7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWx1ZXM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgaXRlbXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IEl0ZW1WYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWx1ZVtcInZhbHVlXCJdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50ZXh0ID0gdmFsdWVbXCJ0ZXh0XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZVtcInZhbHVlXCJdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0RGF0YShpdGVtczogQXJyYXk8SXRlbVZhbHVlPik6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmhhc1RleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IHZhbHVlOiBpdGVtLnZhbHVlLCB0ZXh0OiBpdGVtLnRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXRlbVZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtVGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIHRleHQ6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJpdGVtdmFsdWVcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuaXRlbVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pdGVtVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0cjogc3RyaW5nID0gdGhpcy5pdGVtVmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gc3RyLmluZGV4T2YoSXRlbVZhbHVlLlNlcGFyYXRvcik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZSA9IHN0ci5zbGljZSgwLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSBzdHIuc2xpY2UoaW5kZXggKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RleHQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLml0ZW1UZXh0ID8gdHJ1ZSA6IGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1RleHQpIHJldHVybiB0aGlzLml0ZW1UZXh0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSkgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGV4dChuZXdUZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVGV4dCA9IG5ld1RleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlIHtcclxuICAgICAgICBpc0tPID0gdHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJztcclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgbWV0aG9kIGlzIGFic3RyYWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmVudDxUIGV4dGVuZHMgRnVuY3Rpb24sIE9wdGlvbnM+ICB7XHJcbiAgICAgICAgcHJpdmF0ZSBjYWxsYmFja3M6IEFycmF5PFQ+O1xyXG4gICAgICAgIHB1YmxpYyBmaXJlKHNlbmRlcjogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja3MubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNhbGxiYWNrc1tpXShzZW5kZXIsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGQoZnVuYzogVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgQXJyYXk8VD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlKGZ1bmM6IFQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jYWxsYmFja3MuaW5kZXhPZihmdW5jLCAwKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBkeFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgQW5zd2VyUmVxdWlyZWRFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpICB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIllvdSBzaG91bGQgYW5zd2VyIHRoZSBxdWVzdGlvblwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIGR4U3VydmV5IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55KSA9PiBhbnlcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlR2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uR2V0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgaXNEZWZhdWx0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuZGVmYXVsdFZhbHVlKSA/ICh0aGlzLmRlZmF1bHRWYWx1ZSA9PSB2YWx1ZSkgOiAhKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFZhbHVlKG9iajogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25HZXRWYWx1ZSkgcmV0dXJuIHRoaXMub25HZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUb1VzZVNldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vblNldFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldFZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TZXRWYWx1ZShvYmosIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGNsYXNzIEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICBwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+ID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nLCBwcm9wZXJ0aWVzTmFtZXM6IEFycmF5PHN0cmluZz4sIHB1YmxpYyBjcmVhdG9yOiAoKSA9PiBhbnkgPSBudWxsLCBwdWJsaWMgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMgPSBuZXcgQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXNOYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnB1c2gobmV3IEpzb25PYmplY3RQcm9wZXJ0eShwcm9wZXJ0aWVzTmFtZXNbaV0pKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmluZChuYW1lOiBzdHJpbmcpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcGVydGllc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NlczogSGFzaFRhYmxlPEpzb25NZXRhZGF0YUNsYXNzPiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NQcm9wZXJ0aWVzOiBIYXNoVGFibGU8QXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pj4gPSB7fTtcclxuICAgICAgICBwdWJsaWMgYWRkQ2xhc3MobmFtZTogc3RyaW5nLCBwcm9wZXJ0aWVzTmFtZXM6IEFycmF5PHN0cmluZz4sIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHBhcmVudE5hbWU6IHN0cmluZyA9IG51bGwpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gbmV3IEpzb25NZXRhZGF0YUNsYXNzKG5hbWUsIHByb3BlcnRpZXNOYW1lcywgY3JlYXRvciwgcGFyZW50TmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2xhc3Nlc1tuYW1lXSA9IG1ldGFEYXRhQ2xhc3M7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0Q3JlYXRvcihuYW1lOiBzdHJpbmcsIGNyZWF0b3I6ICgpID0+IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgICAgIG1ldGFEYXRhQ2xhc3MuY3JlYXRvciA9IGNyZWF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRQcm9wZXJ0eVZhbHVlcyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eUNsYXNzTmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwsIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbCwgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55KSA9PiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KG5hbWUsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHJldHVybjtcclxuICAgICAgICAgICAgcHJvcGVydHkuY2xhc3NOYW1lID0gcHJvcGVydHlDbGFzc05hbWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmRlZmF1bHRWYWx1ZSA9IGRlZmF1bHRWYWx1ZTtcclxuICAgICAgICAgICAgcHJvcGVydHkub25HZXRWYWx1ZSA9IG9uR2V0VmFsdWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5Lm9uU2V0VmFsdWUgPSBvblNldFZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjcmVhdGVDbGFzcyhuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MuY3JlYXRvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmNsYXNzZXNbbmFtZV07XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzID8gbWV0YURhdGFDbGFzcy5maW5kKHByb3BlcnR5TmFtZSkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pikge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eShtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXNbaV0sIGxpc3QsIGxpc3QubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZFByb3BlcnR5KHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHksIGxpc3Q6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGVuZEluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kSW5kZXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RbaV0ubmFtZSA9PSBwcm9wZXJ0eS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gocHJvcGVydHkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W2luZGV4XSA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25PYmplY3Qge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHR5cGVQcm9wZXJ0eU5hbWUgPSBcInR5cGVcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtZXRhRGF0YVZhbHVlID0gbmV3IEpzb25NZXRhZGF0YSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IG1ldGFEYXRhKCkgeyByZXR1cm4gSnNvbk9iamVjdC5tZXRhRGF0YVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHRvSnNvbk9iamVjdChvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvSnNvbk9iamVjdENvcmUob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHRvT2JqZWN0KGpzb25PYmo6IGFueSwgb2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFqc29uT2JqKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG9iai5nZXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9PYmooanNvbk9ialtrZXldLCBvYmosIGtleSwgdGhpcy5maW5kUHJvcGVydHkocHJvcGVydGllcywga2V5KSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHRvSnNvbk9iamVjdENvcmUob2JqOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW9iai5nZXRUeXBlKSByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmICghcHJvcGVydHkuY2xhc3NOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV0gPSBvYmouZ2V0VHlwZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvSnNvbihvYmosIHJlc3VsdCwgcHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9Kc29uKG9iajogYW55LCByZXN1bHQ6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaGFzVG9Vc2VHZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwcm9wZXJ0eS5nZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyVmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJWYWx1ZS5wdXNoKHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZVtpXSwgcHJvcGVydHkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyVmFsdWUubGVuZ3RoID4gMCA/IGFyclZhbHVlIDogbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wZXJ0eS5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvT2JqKHZhbHVlOiBhbnksIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5oYXNUb1VzZVNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eS5zZXRWYWx1ZShvYmosIHZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9BcnJheSh2YWx1ZSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWUsIG5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld09iajtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IudG9TdHJpbmcoKS5pbmRleE9mKFwiQXJyYXlcIikgPiAtMTsgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlTmV3T2JqKHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gdmFsdWVbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKGNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHZhbHVlW0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIChjbGFzc05hbWUpID8gSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyhjbGFzc05hbWUpIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZVRvQXJyYXkodmFsdWU6IEFycmF5PGFueT4sIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUFycmF5KG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZVtpXSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZVtpXSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKHZhbHVlW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBrZXk6IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBrZXkpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIGR4U3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkZhY3Rvcnkge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSW5zdGFuY2U6IFF1ZXN0aW9uRmFjdG9yeSA9IG5ldyBRdWVzdGlvbkZhY3RvcnkoKTtcclxuICAgICAgICBwcml2YXRlIGNyZWF0b3JIYXNoOiBIYXNoVGFibGU8KG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb24+ID0ge307XHJcblxyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlclF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbkNyZWF0b3I6IChuYW1lOiBzdHJpbmcpID0+IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXSA9IHF1ZXN0aW9uQ3JlYXRvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBjcmVhdG9yID0gdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdO1xyXG4gICAgICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0b3IobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJlcnJvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIGR4U3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbiBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJUXVlc3Rpb24ge1xyXG4gICAgICAgIHByb3RlY3RlZCBkYXRhOiBJU3VydmV5RGF0YTtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1JlcXVpcmVkVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc0NvbW1lbnRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgaGFzT3RoZXJWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVJbmRleFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPiA9IFtdO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTsga29Db21tZW50OiBhbnk7IGtvRXJyb3JzOiBhbnk7IGtvVmlzaWJsZTogYW55OyBrb05vOiBhbnk7IGR1bW15T2JzZXJ2YWJsZTogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IHRoaXMuY3JlYXRla29WYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQgPSBrby5vYnNlcnZhYmxlKHRoaXMuY29tbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvRXJyb3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KHRoaXMuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29WaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi52aXNpYmxlVmFsdWU7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb05vID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi52aXNpYmxlSW5kZXhWYWx1ZSArIDE7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0TmV3Q29tbWVudChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZWtvVmFsdWUoKTogYW55IHsgcmV0dXJuIGtvLm9ic2VydmFibGUodGhpcy52YWx1ZSk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0a29WYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7IHJldHVybiAodGhpcy50aXRsZVZhbHVlKSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgZ2V0IGlzUmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzUmVxdWlyZWRWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBpc1JlcXVpcmVkKHZhbDogYm9vbGVhbikgeyB0aGlzLmlzUmVxdWlyZWRWYWx1ZSA9IHZhbDsgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEub25RdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHRoaXMubmFtZSwgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnZpc2libGVJbmRleFZhbHVlOyB9XHJcbiAgICAgICAgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0NvbW1lbnRWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBoYXNDb21tZW50KHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydENvbW1lbnQoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NvbW1lbnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29tbWVudCkgdGhpcy5oYXNPdGhlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaGFzT3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc090aGVyVmFsdWU7IH1cclxuICAgICAgICBzZXQgaGFzT3RoZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0T3RoZXIoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc090aGVyVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB0aGlzLmhhc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShuZXdWYWx1ZTogSVN1cnZleURhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2YWx1ZSgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHJldHVybiB0aGlzLmRhdGEuZ2V0VmFsdWUodGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb25WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0a29WYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY29tbWVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEuZ2V0Q29tbWVudCh0aGlzLm5hbWUpIDogXCJcIjsgfVxyXG4gICAgICAgIHNldCBjb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQodGhpcy5jb21tZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52YWx1ZSA9PSBudWxsOyB9XHJcbiAgICAgICAgcHVibGljIGhhc0Vycm9ycygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvckVycm9ycygpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZvckVycm9ycygpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQW5zd2VyUmVxdWlyZWRFcnJvcigpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy5lcnJvcnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgc2V0TmV3VmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5KSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldFZhbHVlKHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldE5ld0NvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRDb21tZW50KHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVF1ZXN0aW9uXHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVJbmRleFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJxdWVzdGlvblwiLCBbXCJuYW1lXCIsIFwidGl0bGVcIiwgXCJpc1JlcXVpcmVkXCIsIFwiaGFzQ29tbWVudFwiLCBcImhhc090aGVyXCIsIFwidmlzaWJsZVwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicXVlc3Rpb25cIiwgXCJ2aXNpYmxlXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInF1ZXN0aW9uXCIsIFwidGl0bGVcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBkeFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZSBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb24+ID0gbmV3IEFycmF5PFF1ZXN0aW9uPigpO1xyXG4gICAgICAgIHB1YmxpYyBkYXRhOiBJU3VydmV5RGF0YSA9IG51bGw7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnNldERhdGEoc2VsZi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicGFnZVwiOyB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGROZXdRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVzdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGhhc0Vycm9ycygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IGZhbHNlO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5xdWVzdGlvbnNbaV0uaGFzRXJyb3JzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbnNUb0xpc3QobGlzdDogQXJyYXk8SVF1ZXN0aW9uPikge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLnF1ZXN0aW9uc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicGFnZVwiLCBbXCJuYW1lXCIsIFwicXVlc3Rpb25zXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUGFnZShcIlwiKTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIGR4U3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblNlbGVjdEJhc2UgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgb3RoZXJJdGVtOiBJdGVtVmFsdWUgPSBuZXcgSXRlbVZhbHVlKFwib3RoZXJcIiwgXCJPdGhlciAoZGVzY3JpYmUpXCIpO1xyXG4gICAgICAgIGNob2ljZXNWYWx1ZXM6IEFycmF5PEl0ZW1WYWx1ZT4gPSBuZXcgQXJyYXk8SXRlbVZhbHVlPigpO1xyXG4gICAgICAgIGtvT3RoZXJWaXNpYmxlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvT3RoZXJWaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyByZXR1cm4gc2VsZi5pc2tvT3RoZXJWaXNpYmxlKCk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBpc2tvT3RoZXJWaXNpYmxlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5rb1ZhbHVlKCkgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWVzOyB9XHJcbiAgICAgICAgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlQ2hvaWNlcygpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc090aGVyKSByZXR1cm4gdGhpcy5jaG9pY2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5jaG9pY2VzLnNsaWNlKCk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMub3RoZXJJdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic2VsZWN0YmFzZVwiLCBbXCJjaG9pY2VzXCJdLCBudWxsLCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInNlbGVjdGJhc2VcIiwgXCJjaG9pY2VzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IEl0ZW1WYWx1ZS5zZXREYXRhKG9iai5jaG9pY2VzLCB2YWx1ZSk7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fYmFzZXNlbGVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBkeFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveCBleHRlbmRzIFF1ZXN0aW9uU2VsZWN0QmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZWtvVmFsdWUoKTogYW55IHsgcmV0dXJuIGtvLm9ic2VydmFibGVBcnJheSh0aGlzLnZhbHVlKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRrb1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKFtdLmNvbmNhdChuZXdWYWx1ZSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgaXNrb090aGVyVmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMua29WYWx1ZS5pbmRleE9mKHRoaXMub3RoZXJJdGVtLnZhbHVlKSA+PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2hlY2tib3hcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNoZWNrYm94KFwiXCIpOyB9LCBcInNlbGVjdGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImNoZWNrYm94XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25DaGVja2JveChuYW1lKTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBkeFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50IGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHB1YmxpYyByb3dzOiBudW1iZXIgPSAzO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNvbW1lbnRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNvbW1lbnRcIiwgW1wicm93c1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJjb21tZW50XCIsIFwicm93c1wiLCBudWxsLCAzKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChuYW1lKTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9zZWxlY3RiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIGR4U3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkRyb3Bkb3duIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJkcm9wZG93blwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJkcm9wZG93blwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uRHJvcGRvd24oXCJcIik7IH0sIFwic2VsZWN0YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkRyb3Bkb3duKG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIGR4U3VydmV5IHtcclxuICAgIGludGVyZmFjZSBJTWF0cml4RGF0YSB7XHJcbiAgICAgICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93KTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhSb3cgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBkYXRhOiBJTWF0cml4RGF0YTtcclxuICAgICAgICBwcm90ZWN0ZWQgcm93VmFsdWU6IGFueTtcclxuICAgICAgICBrb1ZhbHVlOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnksIHB1YmxpYyB0ZXh0OiBzdHJpbmcsIHB1YmxpYyBmdWxsTmFtZTogc3RyaW5nLCBkYXRhOiBJTWF0cml4RGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUodGhpcy5yb3dWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLnJvd1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSkgdGhpcy5kYXRhLm9uTWF0cml4Um93Q2hhbmdlZCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXggZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEYXRhIHtcclxuICAgICAgICBwdWJsaWMgY29sdW1uc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyByb3dzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93c1ZhbHVlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjb2x1bW5zKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgICAgICBzZXQgY29sdW1ucyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNvbHVtbnNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICAgICAgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yb3dzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4Um93PiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4Um93PigpO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3NbaV0udmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IE1hdHJpeFJvdyh0aGlzLnJvd3NbaV0udmFsdWUsIHRoaXMucm93c1tpXS50ZXh0LCB0aGlzLm5hbWUgKyAnXycgKyB0aGlzLnJvd3NbaV0udmFsdWUudG9TdHJpbmcoKSwgdGhpcywgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IE1hdHJpeFJvdyhudWxsLCBcIlwiLCB0aGlzLm5hbWUsIHRoaXMsIHZhbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSU1hdHJpeERhdGFcclxuICAgICAgICBvbk1hdHJpeFJvd0NoYW5nZWQocm93OiBNYXRyaXhSb3cpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSByb3cudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlW3Jvdy5uYW1lXSA9IHJvdy52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeFwiLCBbXCJjb2x1bW5zXCIsIFwicm93c1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4KFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeFwiLCBcImNvbHVtbnNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jb2x1bW5zKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgSXRlbVZhbHVlLnNldERhdGEob2JqLmNvbHVtbnMsIHZhbHVlKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4XCIsIFwicm93c1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBJdGVtVmFsdWUuc2V0RGF0YShvYmoucm93cywgdmFsdWUpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXgobmFtZSk7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fc2VsZWN0YmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBkeFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25SYWRpb2dyb3VwIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYWRpb2dyb3VwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhZGlvZ3JvdXBcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXAoXCJcIik7IH0sIFwic2VsZWN0YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cChuYW1lKTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBkeFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25SYXRpbmcgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRSYXRlVmFsdWVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgcmF0ZXM6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHVibGljIG1pbmludW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG1heGltdW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgIGtvVmlzaWJsZVJhdGVWYWx1ZXM6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1Zpc2libGVSYXRlVmFsdWVzID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnZpc2libGVSYXRlVmFsdWVzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHJhdGVWYWx1ZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJhdGVzOyB9XHJcbiAgICAgICAgc2V0IHJhdGVWYWx1ZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yYXRlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZVJhdGVWYWx1ZXMoKTogSXRlbVZhbHVlW10ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5yYXRlVmFsdWVzLmxlbmd0aCA+IDApIHJldHVybiB0aGlzLnJhdGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHJldHVybiBRdWVzdGlvblJhdGluZy5kZWZhdWx0UmF0ZVZhbHVlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmF0aW5nXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgSXRlbVZhbHVlLnNldERhdGEoUXVlc3Rpb25SYXRpbmcuZGVmYXVsdFJhdGVWYWx1ZXMsIFsxLCAyLCAzLCA0LCA1XSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmF0aW5nXCIsIFtcInJhdGVWYWx1ZXNcIiwgXCJtaW5pbnVtUmF0ZURlc2NyaXB0aW9uXCIsIFwibWF4aW11bVJhdGVEZXNjcmlwdGlvblwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInJhdGluZ1wiLCBcInJhdGVWYWx1ZXNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yYXRlVmFsdWVzKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgSXRlbVZhbHVlLnNldERhdGEob2JqLnJhdGVWYWx1ZXMsIHZhbHVlKTsgfSk7XHJcblxyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZyhuYW1lKTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBkeFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25UZXh0IGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHRcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHQoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInRleHRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHQobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcblxyXG5tb2R1bGUgZHhTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleSBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJU3VydmV5RGF0YSB7XHJcbiAgICAgICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogQXJyYXk8UGFnZT4gPSBuZXcgQXJyYXk8UGFnZT4oKTtcclxuICAgICAgICBwcml2YXRlIGN1cnJlbnRQYWdlVmFsdWU6IFBhZ2UgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGNvbW1lbnRzSGFzaDogSGFzaFRhYmxlPHN0cmluZz4gPSB7fTtcclxuXHJcbiAgICAgICAgcHJpdmF0ZSByZW5kZXJlZEVsZW1lbnQ6IEhUTUxFbGVtZW50O1xyXG5cclxuICAgICAgICBwdWJsaWMgb25Db21wbGV0ZTogRXZlbnQ8KHNlbmRlcjogU3VydmV5KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblZpc2libGVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuXHJcbiAgICAgICAga29DdXJyZW50UGFnZTogYW55OyBrb0lzRmlyc3RQYWdlOiBhbnk7IGtvSXNMYXN0UGFnZTogYW55OyBkdW1teU9ic2VydmFibGU6IGFueTsgXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSA9IG51bGwsIHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5wYWdlcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5kYXRhID0gc2VsZjtcclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKGtvKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvQ3VycmVudFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmN1cnJlbnRQYWdlOyB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Jc0ZpcnN0UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuaXNGaXJzdFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0lzTGFzdFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmlzTGFzdFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBuZXcgSnNvbk9iamVjdCgpLnRvT2JqZWN0KGpzb25PYmosIHRoaXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZW5kZXJlZEVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyKHJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwic3VydmV5XCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgb2JqID0ge307XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gob2JqKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IGRhdGEoZGF0YTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAoIWRhdGEgJiYgZGF0YS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLmluZGV4T2YoXCJBcnJheVwiKSA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBkYXRhLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBkYXRhW2ldO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGtleSAmJiB2YWx1ZVtrZXldKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtrZXldID0gdmFsdWVba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgUGFnZUNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGN1cnJlbnRQYWdlKCk6IFBhZ2Uge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZVZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IG51bGwgJiYgdGhpcy5wYWdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdGhpcy5wYWdlc1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZVZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2UpIHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdGhpcy5wYWdlcy5pbmRleE9mKHZhbHVlKSA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlS29DdXJyZW50UGFnZSgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG5leHRQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0xhc3RQYWdlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMoKSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnBhZ2VzW2luZGV4ICsgMV07XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpc0N1cnJlbnRQYWdlSGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2UuaGFzRXJyb3JzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByZXZQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0ZpcnN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnBhZ2VzW2luZGV4IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBsZXRlTGFzdFBhZ2UoKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKCkpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaXNGaXJzdFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBpc0xhc3RQYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSB0aGlzLnBhZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFBhZ2UoaW5kZXg6IG51bWJlcik6IFBhZ2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlc1tpbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZFBhZ2UocGFnZTogUGFnZSkge1xyXG4gICAgICAgICAgICBpZiAocGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMucHVzaChwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSBuZXcgUGFnZShuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uQnlOYW1lKG5hbWU6IHN0cmluZyk6IElRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZihxdWVzdGlvbnNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldEFsbFF1ZXN0aW9ucygpOiBBcnJheTxJUXVlc3Rpb24+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxJUXVlc3Rpb24+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLmFkZFF1ZXN0aW9uc1RvTGlzdChyZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0ubmFtZSAhPSBuYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5vblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ25hbWUnOiBuYW1lLCAndmFsdWUnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLmdldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbmRlcihlbGVtZW50OiBIVE1MRWxlbWVudCkge1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgdGhpcy5vbkJlZm9yZVJlbmRlcigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmxvYWRGaWxlKFwidGVtcGxhdGVzL2R4LnN1cnZleS5rby5odG1sXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24gKGh0bWw6IHN0cmluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50LmlubmVySFRNTCA9IGh0bWw7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBmdW5jdGlvbiAoZXJyb3JSZXN1bHQ6IHN0cmluZykgeyBlbGVtZW50LmlubmVySFRNTCA9IFwiS25vY2tvdXQgdGVtcGxhdGUgY291bGQgbm90IGJlIGxvYWRlZC4gXCIgKyBlcnJvclJlc3VsdDsgfVxyXG4gICAgICAgICAgICAgICAgICAgICk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb25CZWZvcmVSZW5kZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBsb2FkRmlsZShmaWxlTmFtZTogc3RyaW5nLCBmdW5jU3VjY2VzczogRnVuY3Rpb24sIGZ1bmNFcnJvcjogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgdmFyIHhtbGh0dHAgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeG1saHR0cC5vbnJlYWR5c3RhdGVjaGFuZ2UgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoeG1saHR0cC5yZWFkeVN0YXRlID09IDQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoeG1saHR0cC5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZ1bmNTdWNjZXNzKHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2UgZnVuY0Vycm9yKHhtbGh0dHAucmVzcG9uc2VUZXh0KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB4bWxodHRwLm9wZW4oXCJHRVRcIiwgZmlsZU5hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICB4bWxodHRwLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcHBseUJpbmRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0tPIHx8IHRoaXMucmVuZGVyZWRFbGVtZW50ID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgICAgIGtvLmNsZWFuTm9kZSh0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVZpc2libGVJbmRleGVzKCkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghcXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLnNldFZpc2libGVJbmRleChpbmRleCsrKTtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JU3VydmV5IGRhdGFcclxuICAgICAgICBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuY29tbWVudHNIYXNoW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAocmVzdWx0ID09IG51bGwpIHJlc3VsdCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLmNvbW1lbnRzSGFzaFtuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY29tbWVudHNIYXNoW25hbWVdID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb25RdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICduYW1lJzogbmFtZSwgJ3Zpc2libGUnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleVwiLCBbXCJ0aXRsZVwiLCBcInBhZ2VzXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJwYWdlc1wiLCBcInBhZ2VcIik7XHJcbn0iXSwic291cmNlUm9vdCI6InNyYyJ9
var Survey;
(function (Survey) {
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
                if (typeof (value.value) !== 'undefined') {
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
    Survey.ItemValue = ItemValue;
    var Base = (function () {
        function Base() {
            this.isKO = typeof ko !== 'undefined';
        }
        Base.prototype.getType = function () {
            throw new Error('This method is abstract');
        };
        return Base;
    })();
    Survey.Base = Base;
    var SurveyError = (function () {
        function SurveyError() {
        }
        SurveyError.prototype.getText = function () {
            throw new Error('This method is abstract');
        };
        return SurveyError;
    })();
    Survey.SurveyError = SurveyError;
    var Event = (function () {
        function Event() {
        }
        Object.defineProperty(Event.prototype, "isEmpty", {
            get: function () { return this.callbacks == null || this.callbacks.length == 0; },
            enumerable: true,
            configurable: true
        });
        Event.prototype.fire = function (sender, options) {
            if (this.callbacks == null)
                return;
            for (var i = 0; i < this.callbacks.length; i++) {
                var callResult = this.callbacks[i](sender, options);
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
    Survey.Event = Event;
})(Survey || (Survey = {}));

var Survey;
(function (Survey) {
    var dxSurveyService = (function () {
        //public static serviceUrl: string = "http://localhost:49891/api/Survey";
        function dxSurveyService() {
        }
        dxSurveyService.prototype.loadSurvey = function (surveyId, onLoad) {
            var xhr = new XMLHttpRequest();
            xhr.open('GET', dxSurveyService.serviceUrl + '/getSurvey?surveyId=' + surveyId);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onload = function () {
                var result = JSON.parse(xhr.response);
                onLoad(xhr.status == 200, result, xhr.response);
            };
            xhr.send();
        };
        dxSurveyService.prototype.sendResult = function (postId, result, onSendResult, clientId, isPartialCompleted) {
            if (clientId === void 0) { clientId = null; }
            if (isPartialCompleted === void 0) { isPartialCompleted = false; }
            var xhr = new XMLHttpRequest();
            xhr.open('POST', dxSurveyService.serviceUrl + '/post/');
            xhr.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
            var data = { postId: postId, surveyResult: JSON.stringify(result) };
            if (clientId)
                data['clientId'] = clientId;
            if (isPartialCompleted)
                data['isPartialCompleted'] = true;
            var dataStringify = JSON.stringify(data);
            xhr.setRequestHeader('Content-Length', dataStringify.length.toString());
            var self = this;
            xhr.onload = function () {
                onSendResult(xhr.status == 200, xhr.response);
            };
            xhr.send(dataStringify);
        };
        dxSurveyService.prototype.getResult = function (resultId, name, onGetResult) {
            var xhr = new XMLHttpRequest();
            var data = 'resultId=' + resultId + '&name=' + name;
            xhr.open('GET', dxSurveyService.serviceUrl + '/getResult?' + data);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var self = this;
            xhr.onload = function () {
                var result = null;
                var list = null;
                if (xhr.status == 200) {
                    result = JSON.parse(xhr.response);
                    list = [];
                    for (var key in result.QuestionResult) {
                        var el = { name: key, value: result.QuestionResult[key] };
                        list.push(el);
                    }
                }
                onGetResult(xhr.status == 200, result, list, xhr.response);
            };
            xhr.send();
        };
        dxSurveyService.prototype.isCompleted = function (resultId, clientId, onIsCompleted) {
            var xhr = new XMLHttpRequest();
            var data = 'resultId=' + resultId + '&clientId=' + clientId;
            xhr.open('GET', dxSurveyService.serviceUrl + '/isCompleted?' + data);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            var self = this;
            xhr.onload = function () {
                var result = null;
                if (xhr.status == 200) {
                    result = JSON.parse(xhr.response);
                }
                onIsCompleted(xhr.status == 200, result, xhr.response);
            };
            xhr.send();
        };
        dxSurveyService.serviceUrl = "https://dxsurvey.azurewebsites.net/api/Survey";
        return dxSurveyService;
    })();
    Survey.dxSurveyService = dxSurveyService;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="base.ts" />
var Survey;
(function (Survey) {
    var AnswerRequiredError = (function (_super) {
        __extends(AnswerRequiredError, _super);
        function AnswerRequiredError() {
            _super.call(this);
        }
        AnswerRequiredError.prototype.getText = function () {
            return "You should answer the question.";
        };
        return AnswerRequiredError;
    })(Survey.SurveyError);
    Survey.AnswerRequiredError = AnswerRequiredError;
    var RequreNumericError = (function (_super) {
        __extends(RequreNumericError, _super);
        function RequreNumericError() {
            _super.call(this);
        }
        RequreNumericError.prototype.getText = function () {
            return "The value should be a numeric.";
        };
        return RequreNumericError;
    })(Survey.SurveyError);
    Survey.RequreNumericError = RequreNumericError;
    var CustomError = (function (_super) {
        __extends(CustomError, _super);
        function CustomError(text) {
            _super.call(this);
            this.text = text;
        }
        CustomError.prototype.getText = function () {
            return this.text;
        };
        return CustomError;
    })(Survey.SurveyError);
    Survey.CustomError = CustomError;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="base.ts" />
var Survey;
(function (Survey) {
    var JsonObjectProperty = (function () {
        function JsonObjectProperty(name) {
            this.name = name;
            this.typeValue = null;
            this.className = null;
            this.classNamePart = null;
            this.baseClassName = null;
            this.defaultValue = null;
            this.choices = null;
            this.onGetValue = null;
        }
        Object.defineProperty(JsonObjectProperty.prototype, "type", {
            get: function () { return this.typeValue ? this.typeValue : "string"; },
            set: function (value) { this.typeValue = value; },
            enumerable: true,
            configurable: true
        });
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
        JsonObjectProperty.prototype.setValue = function (obj, value, jsonConv) {
            if (this.onSetValue) {
                this.onSetValue(obj, value, jsonConv);
            }
        };
        JsonObjectProperty.prototype.getObjType = function (objType) {
            if (!this.classNamePart)
                return objType;
            return objType.replace(this.classNamePart, "");
        };
        JsonObjectProperty.prototype.getClassName = function (className) {
            return (this.classNamePart && className.indexOf(this.classNamePart) < 0) ? className + this.classNamePart : className;
        };
        return JsonObjectProperty;
    })();
    Survey.JsonObjectProperty = JsonObjectProperty;
    var JsonMetadataClass = (function () {
        function JsonMetadataClass(name, propertiesNames, creator, parentName) {
            if (creator === void 0) { creator = null; }
            if (parentName === void 0) { parentName = null; }
            this.name = name;
            this.creator = creator;
            this.parentName = parentName;
            this.properties = null;
            this.requiredProperties = null;
            this.properties = new Array();
            for (var i = 0; i < propertiesNames.length; i++) {
                var propertyName = propertiesNames[i];
                var propertyType = null;
                var typeIndex = propertyName.indexOf(JsonMetadataClass.typeSymbol);
                if (typeIndex > -1) {
                    propertyType = propertyName.substring(typeIndex + 1);
                    propertyName = propertyName.substring(0, typeIndex);
                }
                var propertyName = this.getPropertyName(propertyName);
                var prop = new JsonObjectProperty(propertyName);
                if (propertyType) {
                    prop.type = propertyType;
                }
                this.properties.push(prop);
            }
        }
        JsonMetadataClass.prototype.find = function (name) {
            for (var i = 0; i < this.properties.length; i++) {
                if (this.properties[i].name == name)
                    return this.properties[i];
            }
            return null;
        };
        JsonMetadataClass.prototype.getPropertyName = function (propertyName) {
            if (propertyName.length == 0 || propertyName[0] != JsonMetadataClass.requiredSymbol)
                return propertyName;
            propertyName = propertyName.slice(1);
            if (!this.requiredProperties) {
                this.requiredProperties = new Array();
            }
            this.requiredProperties.push(propertyName);
            return propertyName;
        };
        JsonMetadataClass.requiredSymbol = '!';
        JsonMetadataClass.typeSymbol = ':';
        return JsonMetadataClass;
    })();
    Survey.JsonMetadataClass = JsonMetadataClass;
    var JsonMetadata = (function () {
        function JsonMetadata() {
            this.classes = {};
            this.childrenClasses = {};
            this.classProperties = {};
            this.classRequiredProperties = {};
        }
        JsonMetadata.prototype.addClass = function (name, propertiesNames, creator, parentName) {
            if (creator === void 0) { creator = null; }
            if (parentName === void 0) { parentName = null; }
            var metaDataClass = new JsonMetadataClass(name, propertiesNames, creator, parentName);
            this.classes[name] = metaDataClass;
            if (parentName) {
                var children = this.childrenClasses[parentName];
                if (!children) {
                    this.childrenClasses[parentName] = [];
                }
                this.childrenClasses[parentName].push(metaDataClass);
            }
            return metaDataClass;
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
        JsonMetadata.prototype.setPropertyChoices = function (name, propertyName, choices) {
            var property = this.findProperty(name, propertyName);
            if (!property)
                return;
            property.choices = choices;
        };
        JsonMetadata.prototype.setPropertyClassInfo = function (name, propertyName, baseClassName, classNamePart) {
            if (classNamePart === void 0) { classNamePart = null; }
            var property = this.findProperty(name, propertyName);
            if (!property)
                return;
            property.baseClassName = baseClassName;
            property.classNamePart = classNamePart;
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
            var metaDataClass = this.findClass(name);
            if (!metaDataClass)
                return null;
            return metaDataClass.creator();
        };
        JsonMetadata.prototype.getChildrenClasses = function (name, canBeCreated) {
            if (canBeCreated === void 0) { canBeCreated = false; }
            var result = [];
            this.fillChildrenClasses(name, canBeCreated, result);
            return result;
        };
        JsonMetadata.prototype.getRequiredProperties = function (name) {
            var properties = this.classRequiredProperties[name];
            if (!properties) {
                properties = new Array();
                this.fillRequiredProperties(name, properties);
                this.classRequiredProperties[name] = properties;
            }
            return properties;
        };
        JsonMetadata.prototype.fillChildrenClasses = function (name, canBeCreated, result) {
            var children = this.childrenClasses[name];
            if (!children)
                return;
            for (var i = 0; i < children.length; i++) {
                if (!canBeCreated || children[i].creator) {
                    result.push(children[i]);
                }
                this.fillChildrenClasses(children[i].name, canBeCreated, result);
            }
        };
        JsonMetadata.prototype.findClass = function (name) {
            return this.classes[name];
        };
        JsonMetadata.prototype.findProperty = function (name, propertyName) {
            var metaDataClass = this.findClass(name);
            return metaDataClass ? metaDataClass.find(propertyName) : null;
        };
        JsonMetadata.prototype.fillProperties = function (name, list) {
            var metaDataClass = this.findClass(name);
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
        JsonMetadata.prototype.fillRequiredProperties = function (name, list) {
            var metaDataClass = this.findClass(name);
            if (!metaDataClass)
                return;
            if (metaDataClass.requiredProperties) {
                Array.prototype.push.apply(list, metaDataClass.requiredProperties);
            }
            if (metaDataClass.parentName) {
                this.fillRequiredProperties(metaDataClass.parentName, list);
            }
        };
        return JsonMetadata;
    })();
    Survey.JsonMetadata = JsonMetadata;
    var JsonError = (function () {
        function JsonError(type, message) {
            this.type = type;
            this.message = message;
            this.description = "";
            this.at = -1;
        }
        JsonError.prototype.getFullDescription = function () {
            return this.message + (this.description ? "\n" + this.description : "");
        };
        return JsonError;
    })();
    Survey.JsonError = JsonError;
    var JsonUnknownPropertyError = (function (_super) {
        __extends(JsonUnknownPropertyError, _super);
        function JsonUnknownPropertyError(propertyName, className) {
            _super.call(this, "unknownproperty", "The property '" + propertyName + "' in class '" + className + "' is unknown.");
            this.propertyName = propertyName;
            this.className = className;
            var properties = JsonObject.metaData.getProperties(className);
            if (properties) {
                this.description = "The list of available properties are: ";
                for (var i = 0; i < properties.length; i++) {
                    if (i > 0)
                        this.description += ", ";
                    this.description += properties[i].name;
                }
                this.description += '.';
            }
        }
        return JsonUnknownPropertyError;
    })(JsonError);
    Survey.JsonUnknownPropertyError = JsonUnknownPropertyError;
    var JsonMissingTypeErrorBase = (function (_super) {
        __extends(JsonMissingTypeErrorBase, _super);
        function JsonMissingTypeErrorBase(baseClassName, type, message) {
            _super.call(this, type, message);
            this.baseClassName = baseClassName;
            this.type = type;
            this.message = message;
            this.description = "The following types are available: ";
            var types = JsonObject.metaData.getChildrenClasses(baseClassName, true);
            for (var i = 0; i < types.length; i++) {
                if (i > 0)
                    this.description += ", ";
                this.description += "'" + types[i].name + "'";
            }
            this.description += ".";
        }
        return JsonMissingTypeErrorBase;
    })(JsonError);
    Survey.JsonMissingTypeErrorBase = JsonMissingTypeErrorBase;
    var JsonMissingTypeError = (function (_super) {
        __extends(JsonMissingTypeError, _super);
        function JsonMissingTypeError(propertyName, baseClassName) {
            _super.call(this, baseClassName, "missingtypeproperty", "The property type is missing in the object. Please take a look at property: '" + propertyName + "'.");
            this.propertyName = propertyName;
            this.baseClassName = baseClassName;
        }
        return JsonMissingTypeError;
    })(JsonMissingTypeErrorBase);
    Survey.JsonMissingTypeError = JsonMissingTypeError;
    var JsonIncorrectTypeError = (function (_super) {
        __extends(JsonIncorrectTypeError, _super);
        function JsonIncorrectTypeError(propertyName, baseClassName) {
            _super.call(this, baseClassName, "incorrecttypeproperty", "The property type is incorrect in the object. Please take a look at property: '" + propertyName + "'.");
            this.propertyName = propertyName;
            this.baseClassName = baseClassName;
        }
        return JsonIncorrectTypeError;
    })(JsonMissingTypeErrorBase);
    Survey.JsonIncorrectTypeError = JsonIncorrectTypeError;
    var JsonRequiredPropertyError = (function (_super) {
        __extends(JsonRequiredPropertyError, _super);
        function JsonRequiredPropertyError(propertyName, className) {
            _super.call(this, "requiredproperty", "The property '" + propertyName + "' is required in class '" + className + "'.");
            this.propertyName = propertyName;
            this.className = className;
        }
        return JsonRequiredPropertyError;
    })(JsonError);
    Survey.JsonRequiredPropertyError = JsonRequiredPropertyError;
    var JsonObject = (function () {
        function JsonObject() {
            this.errors = new Array();
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
            if (!properties)
                return;
            for (var key in jsonObj) {
                if (key == JsonObject.typePropertyName)
                    continue;
                if (key == JsonObject.positionPropertyName) {
                    obj[key] = jsonObj[key];
                    continue;
                }
                var property = this.findProperty(properties, key);
                if (!property) {
                    this.addNewError(new JsonUnknownPropertyError(key.toString(), obj.getType()), jsonObj);
                    continue;
                }
                this.valueToObj(jsonObj[key], obj, key, property);
            }
        };
        JsonObject.prototype.toJsonObjectCore = function (obj, property) {
            if (!obj.getType)
                return obj;
            var result = {};
            if (property != null && (!property.className)) {
                result[JsonObject.typePropertyName] = property.getObjType(obj.getType());
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
                property.setValue(obj, value, this);
                return;
            }
            if (this.isValueArray(value)) {
                this.valueToArray(value, obj, key, property);
                return;
            }
            var newObj = this.createNewObj(value, property);
            if (newObj.newObj) {
                this.toObject(value, newObj.newObj);
                value = newObj.newObj;
            }
            if (!newObj.error) {
                obj[key] = value;
            }
        };
        JsonObject.prototype.isValueArray = function (value) { return value.constructor.toString().indexOf("Array") > -1; };
        JsonObject.prototype.createNewObj = function (value, property) {
            var result = { newObj: null, error: null };
            var className = value[JsonObject.typePropertyName];
            if (!className && property != null && property.className) {
                className = property.className;
            }
            className = property.getClassName(className);
            result.newObj = (className) ? JsonObject.metaData.createClass(className) : null;
            result.error = this.checkNewObjectOnErrors(result.newObj, value, property, className);
            return result;
        };
        JsonObject.prototype.checkNewObjectOnErrors = function (newObj, value, property, className) {
            var error = null;
            if (newObj) {
                var requiredProperties = JsonObject.metaData.getRequiredProperties(className);
                if (requiredProperties) {
                    for (var i = 0; i < requiredProperties.length; i++) {
                        if (!value[requiredProperties[i]]) {
                            error = new JsonRequiredPropertyError(requiredProperties[i], className);
                            break;
                        }
                    }
                }
            }
            else {
                if (property.baseClassName) {
                    if (!className) {
                        error = new JsonMissingTypeError(property.name, property.baseClassName);
                    }
                    else {
                        error = new JsonIncorrectTypeError(property.name, property.baseClassName);
                    }
                }
            }
            if (error) {
                this.addNewError(error, value);
            }
            return error;
        };
        JsonObject.prototype.addNewError = function (error, jsonObj) {
            if (jsonObj && jsonObj[JsonObject.positionPropertyName]) {
                error.at = jsonObj[JsonObject.positionPropertyName].start;
            }
            this.errors.push(error);
        };
        JsonObject.prototype.valueToArray = function (value, obj, key, property) {
            if (!this.isValueArray(obj[key])) {
                obj[key] = [];
            }
            for (var i = 0; i < value.length; i++) {
                var newValue = this.createNewObj(value[i], property);
                if (newValue.newObj) {
                    obj[key].push(newValue.newObj);
                    this.toObject(value[i], newValue.newObj);
                }
                else {
                    if (!newValue.error) {
                        obj[key].push(value[i]);
                    }
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
        JsonObject.positionPropertyName = "pos";
        JsonObject.metaDataValue = new JsonMetadata();
        return JsonObject;
    })();
    Survey.JsonObject = JsonObject;
})(Survey || (Survey = {}));

/// <reference path="question.ts" />
/// <reference path="base.ts" />
var Survey;
(function (Survey) {
    var QuestionFactory = (function () {
        function QuestionFactory() {
            this.creatorHash = {};
        }
        QuestionFactory.prototype.registerQuestion = function (questionType, questionCreator) {
            this.creatorHash[questionType] = questionCreator;
        };
        QuestionFactory.prototype.getAllTypes = function () {
            var result = new Array();
            for (var key in this.creatorHash) {
                result.push(key);
            }
            return result.sort();
        };
        QuestionFactory.prototype.createQuestion = function (questionType, name) {
            var creator = this.creatorHash[questionType];
            if (creator == null)
                return null;
            return creator(name);
        };
        QuestionFactory.Instance = new QuestionFactory();
        QuestionFactory.DefaultChoices = ["one", "two|second value", { value: 3, text: "third value" }];
        return QuestionFactory;
    })();
    Survey.QuestionFactory = QuestionFactory;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="base.ts" />
/// <reference path="error.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var ValidatorResult = (function () {
        function ValidatorResult(value, error) {
            if (error === void 0) { error = null; }
            this.value = value;
            this.error = error;
        }
        return ValidatorResult;
    })();
    Survey.ValidatorResult = ValidatorResult;
    var SurveyValidator = (function (_super) {
        __extends(SurveyValidator, _super);
        function SurveyValidator() {
            _super.call(this);
            this.text = null;
        }
        SurveyValidator.prototype.getErrorText = function (name) {
            if (this.text)
                return this.text;
            return this.getDefaultErrorText(name);
        };
        SurveyValidator.prototype.getDefaultErrorText = function (name) {
            return "";
        };
        SurveyValidator.prototype.validate = function (value, name) {
            if (name === void 0) { name = null; }
            return null;
        };
        return SurveyValidator;
    })(Survey.Base);
    Survey.SurveyValidator = SurveyValidator;
    var ValidatorRunner = (function () {
        function ValidatorRunner() {
        }
        ValidatorRunner.prototype.run = function (owner) {
            for (var i = 0; i < owner.validators.length; i++) {
                var validatorResult = owner.validators[i].validate(owner.value, owner.getValidatorTitle());
                if (validatorResult != null) {
                    if (validatorResult.error)
                        return validatorResult.error;
                    if (validatorResult.value) {
                        owner.value = validatorResult.value;
                    }
                }
            }
            return null;
        };
        return ValidatorRunner;
    })();
    Survey.ValidatorRunner = ValidatorRunner;
    var NumericValidator = (function (_super) {
        __extends(NumericValidator, _super);
        function NumericValidator(minValue, maxValue) {
            if (minValue === void 0) { minValue = null; }
            if (maxValue === void 0) { maxValue = null; }
            _super.call(this);
            this.minValue = minValue;
            this.maxValue = maxValue;
        }
        NumericValidator.prototype.getType = function () { return "numericvalidator"; };
        NumericValidator.prototype.validate = function (value, name) {
            if (name === void 0) { name = null; }
            if (!value || !this.isNumber(value)) {
                return new ValidatorResult(null, new Survey.RequreNumericError());
            }
            var result = new ValidatorResult(parseFloat(value));
            if (this.minValue && this.minValue > result.value) {
                result.error = new Survey.CustomError(this.getErrorText(name));
                return result;
            }
            if (this.maxValue && this.maxValue < result.value) {
                result.error = new Survey.CustomError(this.getErrorText(name));
                return result;
            }
            return (typeof value === 'number') ? null : result;
        };
        NumericValidator.prototype.getDefaultErrorText = function (name) {
            var vName = name ? name : "value";
            var result = "The '" + vName + "' should be ";
            if (this.minValue) {
                result += "equal or more than " + this.minValue;
            }
            if (this.maxValue) {
                if (this.minValue) {
                    result += " and ";
                }
                result += " equal or less than " + this.maxValue;
            }
            return result;
        };
        NumericValidator.prototype.isNumber = function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        };
        return NumericValidator;
    })(SurveyValidator);
    Survey.NumericValidator = NumericValidator;
    var TextValidator = (function (_super) {
        __extends(TextValidator, _super);
        function TextValidator(minLength) {
            if (minLength === void 0) { minLength = 0; }
            _super.call(this);
            this.minLength = minLength;
        }
        TextValidator.prototype.getType = function () { return "textvalidator"; };
        TextValidator.prototype.validate = function (value, name) {
            if (name === void 0) { name = null; }
            if (this.minLength <= 0)
                return;
            if (value.length < this.minLength) {
                return new ValidatorResult(null, new Survey.CustomError(this.getErrorText(name)));
            }
            return null;
        };
        TextValidator.prototype.getDefaultErrorText = function (name) {
            return "Please enter at least " + this.minLength + " symblos.";
        };
        return TextValidator;
    })(SurveyValidator);
    Survey.TextValidator = TextValidator;
    var AnswerCountValidator = (function (_super) {
        __extends(AnswerCountValidator, _super);
        function AnswerCountValidator(minCount, maxCount) {
            if (minCount === void 0) { minCount = null; }
            if (maxCount === void 0) { maxCount = null; }
            _super.call(this);
            this.minCount = minCount;
            this.maxCount = maxCount;
        }
        AnswerCountValidator.prototype.getType = function () { return "answercountvalidator"; };
        AnswerCountValidator.prototype.validate = function (value, name) {
            if (name === void 0) { name = null; }
            if (value == null || value.constructor != Array)
                return null;
            var count = value.length;
            if (this.minCount && count < this.minCount) {
                return new ValidatorResult(null, new Survey.CustomError(this.getErrorText("Please select at least " + this.minCount + " variants.")));
            }
            if (this.maxCount && count > this.maxCount) {
                return new ValidatorResult(null, new Survey.CustomError(this.getErrorText("Please select not more than " + this.maxCount + " variants.")));
            }
            return null;
        };
        AnswerCountValidator.prototype.getDefaultErrorText = function (name) {
            return name;
        };
        return AnswerCountValidator;
    })(SurveyValidator);
    Survey.AnswerCountValidator = AnswerCountValidator;
    Survey.JsonObject.metaData.addClass("surveyvalidator", ["text"]);
    Survey.JsonObject.metaData.addClass("numericvalidator", ["minValue:number", "maxValue:number"], function () { return new NumericValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("textvalidator", ["minLength:number"], function () { return new TextValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("answercountvalidator", ["minCount:number", "maxCount:number"], function () { return new AnswerCountValidator(); }, "surveyvalidator");
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
/// <reference path="validator.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
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
            this.validators = new Array();
            this.width = "100%";
            this.isValueChangedInSurvey = false;
            if (this.isKO) {
                this.koValue = this.createkoValue();
                this.koComment = ko.observable(this.comment);
                this.koErrors = ko.observableArray(this.errors);
                this.dummyObservable = ko.observable(0);
                var self = this;
                this.koVisible = ko.computed(function () { self.dummyObservable(); return self.visibleValue; });
                this.koNo = ko.computed(function () { self.dummyObservable(); return self.visibleIndexValue > -1 ? self.visibleIndexValue + 1 + ". " : ""; });
                this.koValue.subscribe(function (newValue) {
                    self.setNewValue(newValue);
                });
                this.koComment.subscribe(function (newValue) {
                    self.setNewComment(newValue);
                });
                this.onCreating();
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
                    this.data.questionVisibilityChanged(this, this.visible);
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
            this.onCheckForErrors(this.errors);
            if (this.errors.length == 0) {
                var error = this.runValidators();
                if (error) {
                    this.errors.push(error);
                }
            }
            if (this.data && this.errors.length == 0) {
                var error = this.data.validateQuestion(this.name);
                if (error) {
                    this.errors.push(error);
                }
            }
            if (this.isKO) {
                this.koErrors(this.errors);
            }
        };
        Question.prototype.onCheckForErrors = function (errors) {
            if (this.isRequired) {
                if (this.isEmpty()) {
                    this.errors.push(new Survey.AnswerRequiredError());
                }
            }
        };
        Question.prototype.runValidators = function () {
            return new Survey.ValidatorRunner().run(this);
        };
        Question.prototype.setNewValue = function (newValue) {
            if (this.isValueChangedInSurvey)
                return;
            if (this.data != null) {
                this.data.setValue(this.name, newValue);
            }
            this.questionValue = newValue;
            this.onValueChanged();
        };
        Question.prototype.onValueChanged = function () { };
        Question.prototype.setNewComment = function (newValue) {
            if (this.data != null) {
                this.data.setComment(this.name, newValue);
            }
        };
        Question.prototype.onCreating = function () { };
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
        //IValidatorOwner
        Question.prototype.getValidatorTitle = function () { return null; };
        return Question;
    })(Survey.Base);
    Survey.Question = Question;
    Survey.JsonObject.metaData.addClass("question", ["!name", "title", "isRequired:boolean", "visible:boolean", "validators:validators", "width"]);
    Survey.JsonObject.metaData.setPropertyValues("question", "visible", null, true);
    Survey.JsonObject.metaData.setPropertyValues("question", "title", null, null, function (obj) { return obj.titleValue; });
    Survey.JsonObject.metaData.setPropertyValues("question", "width", null, "100%");
    Survey.JsonObject.metaData.setPropertyClassInfo("question", "validators", "surveyvalidator", "validator");
})(Survey || (Survey = {}));

/// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Survey;
(function (Survey) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(name) {
            if (name === void 0) { name = ""; }
            _super.call(this);
            this.name = name;
            this.questions = new Array();
            this.data = null;
            this.visible = true;
            this.title = "";
            this.visibleIndex = -1;
            this.numValue = -1;
            var self = this;
            this.questions.push = function (value) {
                if (self.data != null) {
                    value.setData(self.data);
                }
                return Array.prototype.push.call(this, value);
            };
            if (this.isKO) {
                this.koNo = ko.observable("");
                this.onCreating();
            }
        }
        Object.defineProperty(Page.prototype, "num", {
            get: function () { return this.numValue; },
            set: function (value) {
                if (this.numValue == value)
                    return;
                this.numValue = value;
                if (this.isKO) {
                    this.koNo(this.numValue > 0 ? this.numValue + ". " : "");
                }
            },
            enumerable: true,
            configurable: true
        });
        Page.prototype.getType = function () { return "page"; };
        Object.defineProperty(Page.prototype, "isVisible", {
            get: function () {
                if (!this.visible)
                    return false;
                for (var i = 0; i < this.questions.length; i++) {
                    if (this.questions[i].visible)
                        return true;
                }
                return false;
            },
            enumerable: true,
            configurable: true
        });
        Page.prototype.addQuestion = function (question, index) {
            if (index === void 0) { index = -1; }
            if (question == null)
                return;
            if (index < 0 || index >= this.questions.length) {
                this.questions.push(question);
            }
            else {
                this.questions.splice(index, 0, question);
            }
            if (this.data != null) {
                question.setData(this.data);
                this.data.questionAdded(question, index);
            }
        };
        Page.prototype.addNewQuestion = function (questionType, name) {
            var question = Survey.QuestionFactory.Instance.createQuestion(questionType, name);
            this.addQuestion(question);
            return question;
        };
        Page.prototype.removeQuestion = function (question) {
            var index = this.questions.indexOf(question);
            if (index < 0)
                return;
            this.questions.splice(index, 1);
            if (this.data != null)
                this.data.questionRemoved(question);
        };
        Page.prototype.hasErrors = function () {
            var result = false;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i].visible && this.questions[i].hasErrors()) {
                    result = true;
                }
            }
            return result;
        };
        Page.prototype.addQuestionsToList = function (list, visibleOnly) {
            if (visibleOnly === void 0) { visibleOnly = false; }
            if (visibleOnly && !this.visible)
                return;
            for (var i = 0; i < this.questions.length; i++) {
                if (visibleOnly && !this.questions[i].visible)
                    continue;
                list.push(this.questions[i]);
            }
        };
        Page.prototype.onCreating = function () { };
        return Page;
    })(Survey.Base);
    Survey.Page = Page;
    Survey.JsonObject.metaData.addClass("page", ["name", "questions", "visible:boolean", "title"], function () { return new Page(); });
    Survey.JsonObject.metaData.setPropertyValues("page", "visible", null, true);
    Survey.JsonObject.metaData.setPropertyClassInfo("page", "questions", "question");
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionSelectBase = (function (_super) {
        __extends(QuestionSelectBase, _super);
        function QuestionSelectBase(name) {
            _super.call(this, name);
            this.otherItem = new Survey.ItemValue("other", QuestionSelectBase.otherItemText);
            this.choicesValues = new Array();
            this.otherErrorText = null;
            this.choicesOrderValue = "none";
            if (this.isKO) {
                var self = this;
                this.koOtherVisible = ko.computed(function () { self.koValue(); return self.isOtherSelected(); });
            }
        }
        QuestionSelectBase.prototype.isOtherSelected = function () {
            return this.value == this.otherItem.value;
        };
        Object.defineProperty(QuestionSelectBase.prototype, "choices", {
            get: function () { return this.choicesValues; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.choicesValues, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionSelectBase.prototype, "choicesOrder", {
            get: function () { return this.choicesOrderValue; },
            set: function (newValue) {
                if (newValue == this.choicesOrderValue)
                    return;
                this.choicesOrderValue = newValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionSelectBase.prototype, "otherText", {
            get: function () { return this.otherItem.text; },
            set: function (value) { this.otherItem.text = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionSelectBase.prototype, "visibleChoices", {
            get: function () {
                if (!this.hasOther && this.choicesOrder == "none")
                    return this.choices;
                var result = this.sortVisibleChoices(this.choices.slice());
                if (this.hasOther) {
                    result.push(this.otherItem);
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        QuestionSelectBase.prototype.supportComment = function () { return true; };
        QuestionSelectBase.prototype.supportOther = function () { return true; };
        QuestionSelectBase.prototype.onCheckForErrors = function (errors) {
            _super.prototype.onCheckForErrors.call(this, errors);
            if (!this.isOtherSelected() || this.comment)
                return;
            var text = this.otherErrorText;
            if (!text) {
                text = "Please enter the others value.";
            }
            errors.push(new Survey.CustomError(text));
        };
        QuestionSelectBase.prototype.sortVisibleChoices = function (array) {
            var order = this.choicesOrder.toLowerCase();
            if (order == "asc")
                return this.sortArray(array, 1);
            if (order == "desc")
                return this.sortArray(array, -1);
            if (order == "random")
                return this.randomizeArray(array);
            return array;
        };
        QuestionSelectBase.prototype.sortArray = function (array, mult) {
            return array.sort(function (a, b) {
                if (a.text < b.text)
                    return -1 * mult;
                if (a.text > b.text)
                    return 1 * mult;
                return 0;
            });
        };
        QuestionSelectBase.prototype.randomizeArray = function (array) {
            for (var i = array.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var temp = array[i];
                array[i] = array[j];
                array[j] = temp;
            }
            return array;
        };
        QuestionSelectBase.otherItemText = "Other (describe)";
        return QuestionSelectBase;
    })(Survey.Question);
    Survey.QuestionSelectBase = QuestionSelectBase;
    var QuestionCheckboxBase = (function (_super) {
        __extends(QuestionCheckboxBase, _super);
        function QuestionCheckboxBase(name) {
            _super.call(this, name);
            this.name = name;
            this.colCountValue = 1;
            if (this.isKO) {
                var self = this;
                this.koWidth = ko.computed(function () { self.dummyObservable(); return self.colCount > 0 ? (100 / self.colCount) + '%' : ""; });
            }
        }
        Object.defineProperty(QuestionCheckboxBase.prototype, "colCount", {
            get: function () { return this.colCountValue; },
            set: function (value) {
                if (value < 0 || value > 4)
                    return;
                this.colCountValue = value;
                if (this.isKO) {
                    this.dummyObservable(this.dummyObservable() + 1);
                }
            },
            enumerable: true,
            configurable: true
        });
        QuestionCheckboxBase.prototype.koAfterRender = function (el, con) {
            var tEl = el[0];
            if (tEl.nodeName == "#text")
                tEl.data = "";
            tEl = el[el.length - 1];
            if (tEl.nodeName == "#text")
                tEl.data = "";
        };
        return QuestionCheckboxBase;
    })(QuestionSelectBase);
    Survey.QuestionCheckboxBase = QuestionCheckboxBase;
    Survey.JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean", "!choices:itemvalues", "choicesOrder", "otherText", "otherErrorText"], null, "question");
    Survey.JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null, function (obj) { return Survey.ItemValue.getData(obj.choices); }, function (obj, value) { Survey.ItemValue.setData(obj.choices, value); });
    Survey.JsonObject.metaData.setPropertyValues("selectbase", "choicesOrder", null, "none");
    Survey.JsonObject.metaData.setPropertyChoices("selectbase", "choicesOrder", ["none", "asc", "desc", "random"]);
    Survey.JsonObject.metaData.setPropertyValues("selectbase", "otherText", null, QuestionSelectBase.otherItemText);
    Survey.JsonObject.metaData.addClass("checkboxbase", ["colCount:number"], null, "selectbase");
    Survey.JsonObject.metaData.setPropertyValues("checkboxbase", "colCount", null, 1);
    Survey.JsonObject.metaData.setPropertyChoices("checkboxbase", "colCount", [0, 1, 2, 3, 4]);
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionCheckbox = (function (_super) {
        __extends(QuestionCheckbox, _super);
        function QuestionCheckbox(name) {
            _super.call(this, name);
            this.name = name;
        }
        QuestionCheckbox.prototype.createkoValue = function () {
            return this.value ? ko.observableArray(this.value) : ko.observableArray();
        };
        QuestionCheckbox.prototype.setkoValue = function (newValue) {
            if (newValue) {
                this.koValue([].concat(newValue));
            }
            else {
                this.koValue([]);
            }
        };
        QuestionCheckbox.prototype.isOtherSelected = function () {
            if (!this.value)
                return false;
            return this.value.indexOf(this.otherItem.value) >= 0;
        };
        QuestionCheckbox.prototype.getType = function () {
            return "checkbox";
        };
        return QuestionCheckbox;
    })(Survey.QuestionCheckboxBase);
    Survey.QuestionCheckbox = QuestionCheckbox;
    Survey.JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckbox(""); }, "checkboxbase");
    Survey.QuestionFactory.Instance.registerQuestion("checkbox", function (name) { var q = new QuestionCheckbox(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionComment = (function (_super) {
        __extends(QuestionComment, _super);
        function QuestionComment(name) {
            _super.call(this, name);
            this.name = name;
            this.rows = 4;
            this.cols = 50;
        }
        QuestionComment.prototype.getType = function () {
            return "comment";
        };
        QuestionComment.prototype.isEmpty = function () {
            return _super.prototype.isEmpty.call(this) || this.value == "";
        };
        return QuestionComment;
    })(Survey.Question);
    Survey.QuestionComment = QuestionComment;
    Survey.JsonObject.metaData.addClass("comment", ["cols:number", "rows:number"], function () { return new QuestionComment(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("comment", "cols", null, 50);
    Survey.JsonObject.metaData.setPropertyValues("comment", "rows", null, 4);
    Survey.QuestionFactory.Instance.registerQuestion("comment", function (name) { return new QuestionComment(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
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
    })(Survey.QuestionSelectBase);
    Survey.QuestionDropdown = QuestionDropdown;
    Survey.JsonObject.metaData.addClass("dropdown", [], function () { return new QuestionDropdown(""); }, "selectbase");
    Survey.QuestionFactory.Instance.registerQuestion("dropdown", function (name) { var q = new QuestionDropdown(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
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
    })(Survey.Base);
    Survey.MatrixRow = MatrixRow;
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
                Survey.ItemValue.setData(this.columnsValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrix.prototype, "rows", {
            get: function () { return this.rowsValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.rowsValue, newValue);
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
    })(Survey.Question);
    Survey.QuestionMatrix = QuestionMatrix;
    Survey.JsonObject.metaData.addClass("matrix", ["columns:itemvalues", "rows:itemvalues"], function () { return new QuestionMatrix(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("matrix", "columns", null, null, function (obj) { return Survey.ItemValue.getData(obj.columns); }, function (obj, value) { Survey.ItemValue.setData(obj.columns, value); });
    Survey.JsonObject.metaData.setPropertyValues("matrix", "rows", null, null, function (obj) { return Survey.ItemValue.getData(obj.rows); }, function (obj, value) { Survey.ItemValue.setData(obj.rows, value); });
    Survey.QuestionFactory.Instance.registerQuestion("matrix", function (name) { var q = new QuestionMatrix(name); q.rows = ["Row 1", "Row 2"]; q.columns = ["Column 1", "Column 2", "Column 3"]; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var MultipleTextItem = (function (_super) {
        __extends(MultipleTextItem, _super);
        function MultipleTextItem(name, title) {
            if (name === void 0) { name = null; }
            if (title === void 0) { title = null; }
            _super.call(this);
            this.name = name;
            this.isKOValueUpdating = false;
            this.validators = new Array();
            this.title = title;
            if (this.isKO) {
                this.koValue = ko.observable(this.value);
                var self = this;
                this.koValue.subscribe(function (newValue) {
                    if (!self.isKOValueUpdating) {
                        self.value = newValue;
                    }
                });
            }
        }
        MultipleTextItem.prototype.getType = function () {
            return "multipletextitem";
        };
        MultipleTextItem.prototype.setData = function (data) {
            this.data = data;
        };
        Object.defineProperty(MultipleTextItem.prototype, "title", {
            get: function () { return this.titleValue ? this.titleValue : this.name; },
            set: function (newText) { this.titleValue = newText; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultipleTextItem.prototype, "value", {
            get: function () {
                return this.data ? this.data.getMultipleTextValue(this.name) : null;
            },
            set: function (value) {
                if (this.data != null) {
                    this.data.setMultipleTextValue(this.name, value);
                }
            },
            enumerable: true,
            configurable: true
        });
        MultipleTextItem.prototype.onValueChanged = function (newValue) {
            if (this.isKO) {
                this.isKOValueUpdating = true;
                this.koValue(newValue);
                this.isKOValueUpdating = false;
            }
        };
        //IValidatorOwner
        MultipleTextItem.prototype.getValidatorTitle = function () { return this.title; };
        return MultipleTextItem;
    })(Survey.Base);
    Survey.MultipleTextItem = MultipleTextItem;
    var QuestionMultipleText = (function (_super) {
        __extends(QuestionMultipleText, _super);
        function QuestionMultipleText(name) {
            _super.call(this, name);
            this.name = name;
            this.itemSize = 25;
            this.items = new Array();
            this.isMultipleItemValueChanging = false;
            var self = this;
            this.items.push = function (value) {
                value.setData(self);
                return Array.prototype.push.call(this, value);
            };
        }
        QuestionMultipleText.prototype.getType = function () {
            return "multipletext";
        };
        QuestionMultipleText.prototype.AddItem = function (name, title) {
            if (title === void 0) { title = null; }
            var item = new MultipleTextItem(name, title);
            this.items.push(item);
            return item;
        };
        QuestionMultipleText.prototype.onValueChanged = function () {
            _super.prototype.onValueChanged.call(this);
            this.onItemValueChanged();
        };
        QuestionMultipleText.prototype.setkoValue = function (newValue) {
            _super.prototype.setkoValue.call(this, newValue);
            this.onItemValueChanged();
        };
        QuestionMultipleText.prototype.onItemValueChanged = function () {
            if (this.isMultipleItemValueChanging)
                return;
            for (var i = 0; i < this.items.length; i++) {
                var itemValue = null;
                if (this.value && (this.items[i].name in this.value)) {
                    itemValue = this.value[this.items[i].name];
                }
                this.items[i].onValueChanged(itemValue);
            }
        };
        QuestionMultipleText.prototype.runValidators = function () {
            var error = _super.prototype.runValidators.call(this);
            if (error != null)
                return error;
            for (var i = 0; i < this.items.length; i++) {
                error = new Survey.ValidatorRunner().run(this.items[i]);
                if (error != null)
                    return error;
            }
            return null;
        };
        //IMultipleTextData
        QuestionMultipleText.prototype.getMultipleTextValue = function (name) {
            if (!this.value)
                return null;
            return this.value[name];
        };
        QuestionMultipleText.prototype.setMultipleTextValue = function (name, value) {
            this.isMultipleItemValueChanging = true;
            if (!this.value) {
                this.value = {};
            }
            this.value[name] = value;
            this.isMultipleItemValueChanging = false;
        };
        return QuestionMultipleText;
    })(Survey.Question);
    Survey.QuestionMultipleText = QuestionMultipleText;
    Survey.JsonObject.metaData.addClass("multipletextitem", ["name", "title", "validators:validators"], function () { return new MultipleTextItem(""); });
    Survey.JsonObject.metaData.setPropertyClassInfo("multipletextitem", "validators", "surveyvalidator", "validator");
    Survey.JsonObject.metaData.setPropertyValues("multipletextitem", "title", null, null, function (obj) { return obj.titleValue; });
    Survey.JsonObject.metaData.addClass("multipletext", ["!items:textitems", "itemSize:number"], function () { return new QuestionMultipleText(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("multipletext", "items", "multipletextitem");
    Survey.JsonObject.metaData.setPropertyValues("multipletext", "itemSize", null, 25);
    Survey.QuestionFactory.Instance.registerQuestion("multipletext", function (name) { var q = new QuestionMultipleText(name); q.AddItem("text1"); q.AddItem("text2"); return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
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
    })(Survey.QuestionCheckboxBase);
    Survey.QuestionRadiogroup = QuestionRadiogroup;
    Survey.JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroup(""); }, "checkboxbase");
    Survey.QuestionFactory.Instance.registerQuestion("radiogroup", function (name) { var q = new QuestionRadiogroup(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
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
                    self.dummyObservable();
                    return self.visibleRateValues;
                });
            }
        }
        Object.defineProperty(QuestionRating.prototype, "rateValues", {
            get: function () { return this.rates; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.rates, newValue);
                if (this.isKO) {
                    this.dummyObservable(this.dummyObservable() + 1);
                }
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
    })(Survey.Question);
    Survey.QuestionRating = QuestionRating;
    Survey.ItemValue.setData(QuestionRating.defaultRateValues, [1, 2, 3, 4, 5]);
    Survey.JsonObject.metaData.addClass("rating", ["hasComment:boolean", "rateValues:itemvalues", "mininumRateDescription", "maximumRateDescription"], function () { return new QuestionRating(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("rating", "rateValues", null, null, function (obj) { return Survey.ItemValue.getData(obj.rateValues); }, function (obj, value) { Survey.ItemValue.setData(obj.rateValues, value); });
    Survey.QuestionFactory.Instance.registerQuestion("rating", function (name) { return new QuestionRating(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionText = (function (_super) {
        __extends(QuestionText, _super);
        function QuestionText(name) {
            _super.call(this, name);
            this.name = name;
            this.size = 25;
        }
        QuestionText.prototype.getType = function () {
            return "text";
        };
        QuestionText.prototype.isEmpty = function () {
            return _super.prototype.isEmpty.call(this) || this.value == "";
        };
        return QuestionText;
    })(Survey.Question);
    Survey.QuestionText = QuestionText;
    Survey.JsonObject.metaData.addClass("text", ["size:number"], function () { return new QuestionText(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("text", "size", null, 25);
    Survey.QuestionFactory.Instance.registerQuestion("text", function (name) { return new QuestionText(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var Trigger = (function (_super) {
        __extends(Trigger, _super);
        function Trigger() {
            _super.call(this);
            this.opValue = "equal";
        }
        Object.defineProperty(Trigger, "operators", {
            get: function () {
                if (Trigger.operatorsValue != null)
                    return Trigger.operatorsValue;
                Trigger.operatorsValue = {
                    empty: function (value, expectedValue) { return !value; },
                    notempty: function (value, expectedValue) { return !(!value); },
                    equal: function (value, expectedValue) { return value == expectedValue; },
                    notequal: function (value, expectedValue) { return value != expectedValue; },
                    greater: function (value, expectedValue) { return value > expectedValue; },
                    less: function (value, expectedValue) { return value < expectedValue; },
                    greaterorequal: function (value, expectedValue) { return value >= expectedValue; },
                    lessorequal: function (value, expectedValue) { return value <= expectedValue; }
                };
                return Trigger.operatorsValue;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Trigger.prototype, "operator", {
            get: function () { return this.opValue; },
            set: function (value) {
                if (!value)
                    return;
                value = value.toLowerCase();
                if (!Trigger.operators[value])
                    return;
                this.opValue = value;
            },
            enumerable: true,
            configurable: true
        });
        Trigger.prototype.check = function (value) {
            if (Trigger.operators[this.operator](value, this.value)) {
                this.onSuccess();
            }
            else {
                this.onFailure();
            }
        };
        Trigger.prototype.onSuccess = function () { };
        Trigger.prototype.onFailure = function () { };
        Trigger.operatorsValue = null;
        return Trigger;
    })(Survey.Base);
    Survey.Trigger = Trigger;
    var SurveyTrigger = (function (_super) {
        __extends(SurveyTrigger, _super);
        function SurveyTrigger() {
            _super.call(this);
            this.pages = [];
            this.questions = [];
            this.owner = null;
        }
        SurveyTrigger.prototype.setOwner = function (owner) {
            this.owner = owner;
        };
        SurveyTrigger.prototype.onSuccess = function () { this.onTrigger(this.onItemSuccess); };
        SurveyTrigger.prototype.onFailure = function () { this.onTrigger(this.onItemFailure); };
        SurveyTrigger.prototype.onTrigger = function (func) {
            if (!this.owner)
                return;
            var objects = this.owner.getObjects(this.pages, this.questions);
            for (var i = 0; i < objects.length; i++) {
                func(objects[i]);
            }
        };
        SurveyTrigger.prototype.onItemSuccess = function (item) { };
        SurveyTrigger.prototype.onItemFailure = function (item) { };
        return SurveyTrigger;
    })(Trigger);
    Survey.SurveyTrigger = SurveyTrigger;
    var SurveyTriggerVisible = (function (_super) {
        __extends(SurveyTriggerVisible, _super);
        function SurveyTriggerVisible() {
            _super.call(this);
        }
        SurveyTriggerVisible.prototype.getType = function () { return "visibletrigger"; };
        SurveyTriggerVisible.prototype.onItemSuccess = function (item) { item.visible = true; };
        SurveyTriggerVisible.prototype.onItemFailure = function (item) { item.visible = false; };
        return SurveyTriggerVisible;
    })(SurveyTrigger);
    Survey.SurveyTriggerVisible = SurveyTriggerVisible;
    Survey.JsonObject.metaData.addClass("trigger", ["operator", "!value"]);
    Survey.JsonObject.metaData.addClass("surveytrigger", ["!name", "pages", "questions"], null, "trigger");
    Survey.JsonObject.metaData.addClass("visibletrigger", [], function () { return new SurveyTriggerVisible(); }, "surveytrigger");
})(Survey || (Survey = {}));

var template;
(function (template) {
    var ko;
    (function (ko) {
        ko.html = '<script type="text/html" id="survey-comment">  <input class="form-control" data-bind="value:$data.question.koComment, visible:$data.visible" /></script><div class="panel-heading" data-bind="visible: (title.length > 0) && showTitle">    <h3 data-bind="text:title"></h3></div><!-- ko if: koCurrentPage() --><div class="panel-body" data-bind="template: { name: \'survey-page\', data: koCurrentPage }"></div><div class="panel-footer" data-bind="visible: showNavigationButtons && !isDesignMode">    <input type="button" class="button" data-bind="value: pagePrevText, click: prevPage, visible: !koIsFirstPage()" />    <input type="button" class="button" value="Next" data-bind="value: pageNextText, click: nextPage, visible: !koIsLastPage()" />    <input type="button" class="button" value="Submit" data-bind="value: completeText, click: completeLastPage, visible: koIsLastPage()" /></div><!-- /ko --><!-- ko if: koCurrentPage() == null --><div class="panel-body">    There is no any visible page or visible question in the survey.</div><!-- /ko --><script type="text/html" id="survey-page">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + title"></h4>    <!-- ko foreach: { data: questions, as: \'question\' } -->    <!-- ko template: { name: \'survey-question\', data: question } -->    <!-- /ko -->    <!-- /ko --></script><script type="text/html" id="survey-question-checkbox">    <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->    <label class="checkbox-inline" style="margin:0" data-bind="style:{width: question.koWidth}">        <input type="checkbox"               data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />        <span data-bind="text: item.text"></span>    </label>    <!-- /ko -->    <div data-bind="visible:question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-comment">    <textarea type="text" class="form-control" data-bind="attr: {cols: question.cols, rows: question.rows}, value:question.koValue" /></script><script type="text/html" id="survey-question-dropdown">    <select data-bind="options: question.visibleChoices, optionsText: \'text\', optionsValue: \'value\', value: question.koValue, optionsCaption: \'Choose...\'"></select>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-matrix">    <table class="table">        <thead>            <tr>                <th data-bind="visible: question.hasRows"></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="visible: question.hasRows, text:row.text"></td>                <!-- ko foreach: question.columns -->                <td>                    <input type="radio" data-bind="attr: {name: row.fullName, value: $data.value}, checked: row.koValue"/>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-multipletext">    <table class="table" data-bind="foreach: { data:  question.items, as: \'item\' }">        <tr>            <td data-bind="text: item.title"></td>            <td><input type="text" class="form-control" data-bind="attr: {size: question.itemSize}, value: item.koValue" /></td>        </tr>    </table></script><script type="text/html" id="survey-question-radiogroup">    <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->    <label class="radio-inline" style="margin:0" data-bind="style:{width: question.koWidth}">        <input type="radio"                data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />        <span data-bind="text: item.text"></span>    </label>    <!-- /ko -->    <div data-bind="visible:question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-rating">    <div class="btn-group" data-toggle="buttons">        <!-- ko foreach: question.koVisibleRateValues -->        <label class="btn btn-default" data-bind="css:{active: $data.value == question.koValue()}">            <input type="radio"                    data-bind="attr: {name: question.name, id: question.name + $index(), value: $data.value}, checked: question.koValue" />            <span data-bind="visible: $index() == 0, text: question.mininumRateDescription"></span>            <span data-bind="text: $data.text"></span>            <span data-bind="visible: $index() == (question.koVisibleRateValues().length-1), text: question.maximumRateDescription"></span>        </label>        <!-- /ko -->    </div></script><script type="text/html" id="survey-question-text">    <input type="text" class="form-control" data-bind="attr: {size: question.size}, value:question.koValue"/></script><script type="text/html" id="survey-question">    <div class="well well-sm" data-bind="visible: question.koVisible()">        <div class="alert alert-danger" role="alert" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div>                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>                <span data-bind="text:$data.getText()"></span>            </div>        </div>        <h5 data-bind="text: question.koNo() +  (question.isRequired ? question.data.requiredText : \'\') + question.title"></h5>        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            Other (please describe)            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>    </div></script>';
    })(ko = template.ko || (template.ko = {}));
})(template || (template = {}));

/// <reference path="base.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="template.ko.html.ts" />
/// <reference path="dxSurveyService.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Survey;
(function (Survey_1) {
    var Survey = (function (_super) {
        __extends(Survey, _super);
        function Survey(jsonObj, renderedElement) {
            if (jsonObj === void 0) { jsonObj = null; }
            if (renderedElement === void 0) { renderedElement = null; }
            _super.call(this);
            this.surveyId = null;
            this.surveyPostId = null;
            this.clientId = null;
            this.sendResultOnPageNext = false;
            this.commentPrefix = "-Comment";
            this.title = "";
            this.showNavigationButtons = true;
            this.showTitle = true;
            this.showPageTitles = true;
            this.showPageNumbers = false;
            this.showQuestionNumbers = "on";
            this.requiredText = "* ";
            this.pagePrevText = "Previous";
            this.pageNextText = "Next";
            this.completeText = "Complete";
            //public showProgressBar: boolean = false; TODO
            this.pages = new Array();
            this.triggers = new Array();
            this.currentPageValue = null;
            this.valuesHash = {};
            this.onComplete = new Survey_1.Event();
            this.onRendered = new Survey_1.Event();
            this.onCurrentPageChanged = new Survey_1.Event();
            this.onValueChanged = new Survey_1.Event();
            this.onVisibleChanged = new Survey_1.Event();
            this.onQuestionAdded = new Survey_1.Event();
            this.onQuestionRemoved = new Survey_1.Event();
            this.onValidateQuestion = new Survey_1.Event();
            this.onSendResult = new Survey_1.Event();
            this.onGetResult = new Survey_1.Event();
            this.jsonErrors = null;
            this.mode = "normal";
            var self = this;
            this.pages.push = function (value) {
                value.data = self;
                return Array.prototype.push.call(this, value);
            };
            this.triggers.push = function (value) {
                value.setOwner(self);
                return Array.prototype.push.call(this, value);
            };
            if (ko) {
                this.dummyObservable = ko.observable(0);
                this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
                this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
                this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
            }
            if (jsonObj) {
                this.setJsonObject(jsonObj);
                if (this.surveyId) {
                    this.loadSurveyFromService(this.surveyId, renderedElement);
                }
            }
            this.onCreating();
            this.render(renderedElement);
        }
        Survey.prototype.getType = function () { return "survey"; };
        Object.defineProperty(Survey.prototype, "data", {
            get: function () {
                var result = {};
                for (var key in this.valuesHash) {
                    result[key] = this.valuesHash[key];
                }
                return result;
            },
            set: function (data) {
                this.valuesHash = {};
                if (data) {
                    for (var key in data) {
                        this.valuesHash[key] = data[key];
                        this.checkTriggers(key, data[key]);
                    }
                }
                this.notifyAllQuestionsOnValueChanged();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "comments", {
            get: function () {
                var result = {};
                for (var key in this.valuesHash) {
                    if (typeof key.endsWith === 'function' && key.endsWith(this.commentPrefix)) {
                        result[key] = this.valuesHash[key];
                    }
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "visiblePages", {
            get: function () {
                if (this.isDesignMode)
                    return this.pages;
                var result = new Array();
                for (var i = 0; i < this.pages.length; i++) {
                    if (this.pages[i].isVisible) {
                        result.push(this.pages[i]);
                    }
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "isEmpty", {
            get: function () { return this.pages.length == 0; },
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
        Object.defineProperty(Survey.prototype, "visiblePageCount", {
            get: function () {
                return this.visiblePages.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "currentPage", {
            get: function () {
                var vPages = this.visiblePages;
                if (this.currentPageValue != null) {
                    if (vPages.indexOf(this.currentPageValue) < 0) {
                        this.currentPage = null;
                    }
                }
                if (this.currentPageValue == null && vPages.length > 0) {
                    this.currentPage = vPages[0];
                }
                return this.currentPageValue;
            },
            set: function (value) {
                var vPages = this.visiblePages;
                if (value != null && vPages.indexOf(value) < 0)
                    return;
                if (value == this.currentPageValue)
                    return;
                var oldValue = this.currentPageValue;
                this.currentPageValue = value;
                this.updateKoCurrentPage();
                this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': value });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "isDesignMode", {
            get: function () { return this.mode == "designer"; },
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
            if (this.isCurrentPageHasErrors)
                return false;
            if (this.sendResultOnPageNext && this.clientId) {
                this.sendResult(this.surveyPostId, this.clientId, true);
            }
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage);
            this.currentPage = vPages[index + 1];
            return true;
        };
        Object.defineProperty(Survey.prototype, "isCurrentPageHasErrors", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                return this.currentPage.hasErrors();
            },
            enumerable: true,
            configurable: true
        });
        Survey.prototype.prevPage = function () {
            if (this.isFirstPage)
                return false;
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage);
            this.currentPage = vPages[index - 1];
        };
        Survey.prototype.completeLastPage = function () {
            if (this.isCurrentPageHasErrors)
                return false;
            this.onComplete.fire(this, null);
            if (this.surveyPostId) {
                this.sendResult();
            }
            return true;
        };
        Object.defineProperty(Survey.prototype, "isFirstPage", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                return this.visiblePages.indexOf(this.currentPage) == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Survey.prototype, "isLastPage", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                var vPages = this.visiblePages;
                return vPages.indexOf(this.currentPage) == vPages.length - 1;
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
            var page = new Survey_1.Page(name);
            this.addPage(page);
            return page;
        };
        Survey.prototype.removePage = function (page) {
            var index = this.pages.indexOf(page);
            if (index < 0)
                return;
            this.pages.splice(index, 1);
            if (this.currentPageValue == page) {
                this.currentPage = this.pages.length > 0 ? this.pages[0] : null;
            }
        };
        Survey.prototype.getQuestionByName = function (name) {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].name == name)
                    return questions[i];
            }
            return null;
        };
        Survey.prototype.getQuestionsByNames = function (names) {
            var result = [];
            if (!names)
                return result;
            for (var i = 0; i < names.length; i++) {
                if (!names[i])
                    continue;
                var question = this.getQuestionByName(names[i]);
                if (question)
                    result.push(question);
            }
            return result;
        };
        Survey.prototype.getPageByQuestion = function (question) {
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if (page.questions.indexOf(question) > -1)
                    return page;
            }
            return null;
        };
        Survey.prototype.getPageByName = function (name) {
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].name == name)
                    return this.pages[i];
            }
            return null;
        };
        Survey.prototype.getPagesByNames = function (names) {
            var result = [];
            if (!names)
                return result;
            for (var i = 0; i < names.length; i++) {
                if (!names[i])
                    continue;
                var page = this.getPageByName(names[i]);
                if (page)
                    result.push(page);
            }
            return result;
        };
        Survey.prototype.getAllQuestions = function (visibleOnly) {
            if (visibleOnly === void 0) { visibleOnly = false; }
            var result = new Array();
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].addQuestionsToList(result, visibleOnly);
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
        Survey.prototype.checkTriggers = function (name, newValue) {
            for (var i = 0; i < this.triggers.length; i++) {
                if (this.triggers[i].name == name) {
                    this.triggers[i].check(newValue);
                }
            }
        };
        Survey.prototype.render = function (element) {
            if (element === void 0) { element = null; }
            var self = this;
            if (element && typeof element == "string") {
                element = document.getElementById(element);
            }
            if (element) {
                this.renderedElement = element;
            }
            element = this.renderedElement;
            if (!element || this.isEmpty)
                return;
            this.onBeforeRender();
            if (this.isKO) {
                element.innerHTML = template.ko.html;
                self.applyBinding();
            }
            self.onRendered.fire(self, {});
        };
        Survey.prototype.sendResult = function (postId, clientId, isPartialCompleted) {
            if (postId === void 0) { postId = null; }
            if (clientId === void 0) { clientId = null; }
            if (isPartialCompleted === void 0) { isPartialCompleted = false; }
            if (postId) {
                this.surveyPostId = postId;
            }
            if (clientId) {
                this.clientId = clientId;
            }
            var self = this;
            new Survey_1.dxSurveyService().sendResult(this.surveyPostId, this.data, function (success, response) {
                self.onSendResult.fire(self, { success: success, response: response });
            }, this.clientId, isPartialCompleted);
        };
        Survey.prototype.getResult = function (resultId, name) {
            var self = this;
            new Survey_1.dxSurveyService().getResult(resultId, name, function (success, data, dataList, response) {
                self.onGetResult.fire(self, { success: success, data: data, dataList: dataList, response: response });
            });
        };
        Survey.prototype.loadSurveyFromService = function (surveyId, element) {
            if (surveyId === void 0) { surveyId = null; }
            if (element === void 0) { element = null; }
            if (surveyId) {
                this.surveyId = surveyId;
            }
            var self = this;
            new Survey_1.dxSurveyService().loadSurvey(this.surveyId, function (success, result, response) {
                if (success && result) {
                    self.setJsonObject(result);
                    self.render(element);
                }
            });
        };
        Survey.prototype.onBeforeRender = function () {
            this.updateVisibleIndexes();
        };
        Survey.prototype.applyBinding = function () {
            if (!this.isKO || this.renderedElement == null)
                return;
            this.updateKoCurrentPage();
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
        };
        Survey.prototype.updateVisibleIndexes = function () {
            this.updatePageVisibleIndexes(this.showPageNumbers);
            if (this.showQuestionNumbers == "onPage") {
                var visPages = this.visiblePages;
                for (var i = 0; i < visPages.length; i++) {
                    this.updateQuestionVisibleIndexes(visPages[i].questions, true);
                }
            }
            else {
                this.updateQuestionVisibleIndexes(this.getAllQuestions(false), this.showQuestionNumbers == "on");
            }
        };
        Survey.prototype.updatePageVisibleIndexes = function (showIndex) {
            var index = 0;
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].visibleIndex = this.pages[i].visible ? (index++) : -1;
                this.pages[i].num = showIndex && this.pages[i].visible ? this.pages[i].visibleIndex + 1 : -1;
            }
        };
        Survey.prototype.updateQuestionVisibleIndexes = function (questions, showIndex) {
            var index = 0;
            for (var i = 0; i < questions.length; i++) {
                questions[i].setVisibleIndex(showIndex && questions[i].visible ? (index++) : -1);
            }
        };
        Survey.prototype.setJsonObject = function (jsonObj) {
            if (!jsonObj)
                return;
            this.jsonErrors = null;
            var jsonConverter = new Survey_1.JsonObject();
            jsonConverter.toObject(jsonObj, this);
            if (jsonConverter.errors.length > 0) {
                this.jsonErrors = jsonConverter.errors;
            }
        };
        Survey.prototype.onCreating = function () { };
        //ISurvey data
        Survey.prototype.getValue = function (name) {
            if (!name || name.length == 0)
                return null;
            return this.valuesHash[name];
        };
        Survey.prototype.setValue = function (name, newValue) {
            if (newValue == "" || newValue == null) {
                delete this.valuesHash[name];
            }
            else {
                this.valuesHash[name] = newValue;
            }
            this.notifyQuestionOnValueChanged(name, newValue);
            this.checkTriggers(name, newValue);
        };
        Survey.prototype.getComment = function (name) {
            var result = this.data[name + this.commentPrefix];
            if (result == null)
                result = "";
            return result;
        };
        Survey.prototype.setComment = function (name, newValue) {
            name = name + this.commentPrefix;
            if (newValue == "" || newValue == null) {
                delete this.valuesHash[name];
            }
            else {
                this.valuesHash[name] = newValue;
            }
        };
        Survey.prototype.questionVisibilityChanged = function (question, newValue) {
            this.updateVisibleIndexes();
            this.onVisibleChanged.fire(this, { 'question': question, 'name': question.name, 'visible': newValue });
        };
        Survey.prototype.questionAdded = function (question, index) {
            this.onQuestionAdded.fire(this, { 'question': question, 'name': question.name, 'index': index });
        };
        Survey.prototype.questionRemoved = function (question) {
            this.onQuestionRemoved.fire(this, { 'question': question, 'name': question.name });
        };
        Survey.prototype.validateQuestion = function (name) {
            if (this.onValidateQuestion.isEmpty)
                return null;
            var options = { name: name, value: this.getValue(name), error: null };
            this.onValidateQuestion.fire(this, options);
            return options.error ? new Survey_1.CustomError(options.error) : null;
        };
        //ISurveyTriggerOwner
        Survey.prototype.getObjects = function (pages, questions) {
            var result = [];
            Array.prototype.push.apply(result, this.getPagesByNames(pages));
            Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
            return result;
        };
        return Survey;
    })(Survey_1.Base);
    Survey_1.Survey = Survey;
    Survey_1.JsonObject.metaData.addClass("survey", ["title", "pages", "questions", "triggers:triggers", "surveyId", "surveyPostId", "sendResultOnPageNext:boolean",
        "showNavigationButtons:boolean", "showTitle:boolean", "showPageTitles:boolean", "showPageNumbers:boolean", "showQuestionNumbers",
        "requiredText", "pagePrevText", "pageNextText", "completeText"]);
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "pages", "page");
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "questions", null, null, function (obj) { return null; }, function (obj, value, jsonConverter) {
        var page = obj.addNewPage("");
        jsonConverter.toObject({ questions: value }, page);
    });
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "showNavigationButtons", null, true);
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "showTitle", null, true);
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "showPageTitles", null, true);
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "showQuestionNumbers", null, "on");
    Survey_1.JsonObject.metaData.setPropertyChoices("survey", "showQuestionNumbers", ["on", "onPage", "off"]);
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "requiredText", null, "* ");
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "pagePrevText", null, "Previous");
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "pageNextText", null, "Next");
    Survey_1.JsonObject.metaData.setPropertyValues("survey", "completeText", null, "Complete");
    Survey_1.JsonObject.metaData.setPropertyClassInfo("survey", "triggers", "surveytrigger", "trigger");
    Survey_1.JsonObject.metaData.setPropertyClassInfo("survey", "questions", "question");
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Survey;
(function (Survey) {
    var SurveyWindow = (function (_super) {
        __extends(SurveyWindow, _super);
        function SurveyWindow(jsonObj) {
            _super.call(this);
            var self = this;
            this.surveyValue = new Survey.Survey(jsonObj);
            this.surveyValue.showTitle = false;
            this.survey.onComplete.add(function (sender) { self.onComplete(); });
            this.windowElement = document.createElement("div");
            if (this.isKO) {
                this.koExpanded = ko.observable(false);
                this.doExpand = function () { self.changeExpanded(); };
            }
        }
        SurveyWindow.prototype.getType = function () { return "window"; };
        Object.defineProperty(SurveyWindow.prototype, "survey", {
            get: function () { return this.surveyValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyWindow.prototype, "isShowing", {
            get: function () { return this.isShowingValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyWindow.prototype, "isExpanded", {
            get: function () { return this.isExpandedValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyWindow.prototype, "title", {
            get: function () { return this.titleValue ? this.titleValue : this.survey.title; },
            set: function (value) { this.titleValue = value; },
            enumerable: true,
            configurable: true
        });
        SurveyWindow.prototype.show = function () {
            this.windowElement.innerHTML = this.template;
            if (this.isKO) {
                ko.cleanNode(this.windowElement);
                ko.applyBindings(this, this.windowElement);
            }
            document.body.appendChild(this.windowElement);
            this.survey.render(SurveyWindow.surveyElementName);
            this.isShowingValue = true;
        };
        SurveyWindow.prototype.hide = function () {
            document.body.removeChild(this.windowElement);
            this.windowElement.innerHTML = "";
            this.isShowingValue = false;
        };
        SurveyWindow.prototype.expand = function () {
            this.expandcollapse(true);
        };
        SurveyWindow.prototype.collapse = function () {
            this.expandcollapse(false);
        };
        Object.defineProperty(SurveyWindow.prototype, "template", {
            get: function () { return this.templateValue ? this.templateValue : template.window.ko.html; },
            set: function (value) { this.templateValue = value; },
            enumerable: true,
            configurable: true
        });
        SurveyWindow.prototype.expandcollapse = function (value) {
            this.isExpandedValue = value;
            if (this.isKO) {
                this.koExpanded(this.isExpandedValue);
            }
        };
        SurveyWindow.prototype.changeExpanded = function () {
            this.expandcollapse(!this.isExpanded);
        };
        SurveyWindow.prototype.onComplete = function () {
            this.hide();
        };
        SurveyWindow.surveyElementName = "windowSurveyJS";
        return SurveyWindow;
    })(Survey.Base);
    Survey.SurveyWindow = SurveyWindow;
})(Survey || (Survey = {}));

var template;
(function (template) {
    var window;
    (function (window) {
        var ko;
        (function (ko) {
            ko.html = '<div class="modal-content" style="position: fixed; bottom: 3px; right: 10px;">    <div class="modal-header"><a href="#" data-bind="click:doExpand" style="width:100%"><span data-bind="text:title"></span></a></div>    <div class="modal-body" data-bind="visible:koExpanded">        <div class="sv_window_content" id="windowSurveyJS"></div>    </div></div>';
        })(ko = window.ko || (window.ko = {}));
    })(window = template.window || (template.window = {}));
})(template || (template = {}));

/// <reference path="template.ko.html.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Survey;
(function (Survey) {
    var SurveyTemplateTextBase = (function () {
        function SurveyTemplateTextBase() {
        }
        SurveyTemplateTextBase.prototype.replaceText = function (replaceText, id, questionType) {
            if (questionType === void 0) { questionType = null; }
            id = this.getId(id, questionType);
            var pos = this.text.indexOf(id);
            if (pos < 0)
                return;
            pos = this.text.indexOf('>', pos);
            if (pos < 0)
                return;
            var startPos = pos + 1;
            var endString = "</script>";
            pos = this.text.indexOf(endString, startPos);
            if (pos < 0)
                return;
            this.text = this.text.substr(0, startPos) + replaceText + this.text.substr(pos);
        };
        SurveyTemplateTextBase.prototype.getId = function (id, questionType) {
            var result = 'id="survey-' + id;
            if (questionType) {
                result += "-" + questionType;
            }
            return result + '"';
        };
        Object.defineProperty(SurveyTemplateTextBase.prototype, "text", {
            get: function () { return ""; },
            set: function (value) { },
            enumerable: true,
            configurable: true
        });
        return SurveyTemplateTextBase;
    })();
    Survey.SurveyTemplateTextBase = SurveyTemplateTextBase;
    var SurveyTemplateText = (function (_super) {
        __extends(SurveyTemplateText, _super);
        function SurveyTemplateText() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(SurveyTemplateText.prototype, "text", {
            get: function () { return template.ko.html; },
            set: function (value) { template.ko.html = value; },
            enumerable: true,
            configurable: true
        });
        return SurveyTemplateText;
    })(SurveyTemplateTextBase);
    Survey.SurveyTemplateText = SurveyTemplateText;
})(Survey || (Survey = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudHMiLCJkeFN1cnZleVNlcnZpY2UudHMiLCJlcnJvci50cyIsImpzb25vYmplY3QudHMiLCJxdWVzdGlvbmZhY3RvcnkudHMiLCJ2YWxpZGF0b3IudHMiLCJxdWVzdGlvbi50cyIsInBhZ2UudHMiLCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzIiwicXVlc3Rpb25fY2hlY2tib3gudHMiLCJxdWVzdGlvbl9jb21tZW50LnRzIiwicXVlc3Rpb25fZHJvcGRvd24udHMiLCJxdWVzdGlvbl9tYXRyaXgudHMiLCJxdWVzdGlvbl9tdWx0aXBsZXRleHQudHMiLCJxdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwicXVlc3Rpb25fcmF0aW5nLnRzIiwicXVlc3Rpb25fdGV4dC50cyIsInRyaWdnZXIudHMiLCJ0ZW1wbGF0ZS5rby5odG1sLnRzIiwic3VydmV5LnRzIiwic3VydmV5V2luZG93LnRzIiwidGVtcGxhdGUud2luZG93LmtvLmh0bWwudHMiLCJ0ZW1wbGF0ZVRleHQudHMiXSwibmFtZXMiOlsiU3VydmV5IiwiU3VydmV5Lkl0ZW1WYWx1ZSIsIlN1cnZleS5JdGVtVmFsdWUuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSXRlbVZhbHVlLnNldERhdGEiLCJTdXJ2ZXkuSXRlbVZhbHVlLmdldERhdGEiLCJTdXJ2ZXkuSXRlbVZhbHVlLmdldFR5cGUiLCJTdXJ2ZXkuSXRlbVZhbHVlLnZhbHVlIiwiU3VydmV5Lkl0ZW1WYWx1ZS5oYXNUZXh0IiwiU3VydmV5Lkl0ZW1WYWx1ZS50ZXh0IiwiU3VydmV5LkJhc2UiLCJTdXJ2ZXkuQmFzZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5CYXNlLmdldFR5cGUiLCJTdXJ2ZXkuU3VydmV5RXJyb3IiLCJTdXJ2ZXkuU3VydmV5RXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5RXJyb3IuZ2V0VGV4dCIsIlN1cnZleS5FdmVudCIsIlN1cnZleS5FdmVudC5jb25zdHJ1Y3RvciIsIlN1cnZleS5FdmVudC5pc0VtcHR5IiwiU3VydmV5LkV2ZW50LmZpcmUiLCJTdXJ2ZXkuRXZlbnQuYWRkIiwiU3VydmV5LkV2ZW50LnJlbW92ZSIsIlN1cnZleS5keFN1cnZleVNlcnZpY2UiLCJTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiU3VydmV5LmR4U3VydmV5U2VydmljZS5sb2FkU3VydmV5IiwiU3VydmV5LmR4U3VydmV5U2VydmljZS5zZW5kUmVzdWx0IiwiU3VydmV5LmR4U3VydmV5U2VydmljZS5nZXRSZXN1bHQiLCJTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlLmlzQ29tcGxldGVkIiwiU3VydmV5LkFuc3dlclJlcXVpcmVkRXJyb3IiLCJTdXJ2ZXkuQW5zd2VyUmVxdWlyZWRFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5BbnN3ZXJSZXF1aXJlZEVycm9yLmdldFRleHQiLCJTdXJ2ZXkuUmVxdXJlTnVtZXJpY0Vycm9yIiwiU3VydmV5LlJlcXVyZU51bWVyaWNFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5SZXF1cmVOdW1lcmljRXJyb3IuZ2V0VGV4dCIsIlN1cnZleS5DdXN0b21FcnJvciIsIlN1cnZleS5DdXN0b21FcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5DdXN0b21FcnJvci5nZXRUZXh0IiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LnR5cGUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5Lmhhc1RvVXNlR2V0VmFsdWUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmlzRGVmYXVsdFZhbHVlIiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5nZXRWYWx1ZSIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuaGFzVG9Vc2VTZXRWYWx1ZSIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuc2V0VmFsdWUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmdldE9ialR5cGUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmdldENsYXNzTmFtZSIsIlN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcyIsIlN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcy5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcy5maW5kIiwiU3VydmV5Lkpzb25NZXRhZGF0YUNsYXNzLmdldFByb3BlcnR5TmFtZSIsIlN1cnZleS5Kc29uTWV0YWRhdGEiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5hZGRDbGFzcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuc2V0UHJvcGVydHlWYWx1ZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLnNldFByb3BlcnR5Q2hvaWNlcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8iLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmdldFByb3BlcnRpZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmNyZWF0ZUNsYXNzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmdldFJlcXVpcmVkUHJvcGVydGllcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZmlsbENoaWxkcmVuQ2xhc3NlcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZmluZENsYXNzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5maW5kUHJvcGVydHkiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmZpbGxQcm9wZXJ0aWVzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5hZGRQcm9wZXJ0eSIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZmlsbFJlcXVpcmVkUHJvcGVydGllcyIsIlN1cnZleS5Kc29uRXJyb3IiLCJTdXJ2ZXkuSnNvbkVycm9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25FcnJvci5nZXRGdWxsRGVzY3JpcHRpb24iLCJTdXJ2ZXkuSnNvblVua25vd25Qcm9wZXJ0eUVycm9yIiwiU3VydmV5Lkpzb25Vbmtub3duUHJvcGVydHlFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uTWlzc2luZ1R5cGVFcnJvckJhc2UiLCJTdXJ2ZXkuSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25NaXNzaW5nVHlwZUVycm9yIiwiU3VydmV5Lkpzb25NaXNzaW5nVHlwZUVycm9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25JbmNvcnJlY3RUeXBlRXJyb3IiLCJTdXJ2ZXkuSnNvbkluY29ycmVjdFR5cGVFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yIiwiU3VydmV5Lkpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSnNvbk9iamVjdCIsIlN1cnZleS5Kc29uT2JqZWN0LmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEiLCJTdXJ2ZXkuSnNvbk9iamVjdC50b0pzb25PYmplY3QiLCJTdXJ2ZXkuSnNvbk9iamVjdC50b09iamVjdCIsIlN1cnZleS5Kc29uT2JqZWN0LnRvSnNvbk9iamVjdENvcmUiLCJTdXJ2ZXkuSnNvbk9iamVjdC52YWx1ZVRvSnNvbiIsIlN1cnZleS5Kc29uT2JqZWN0LnZhbHVlVG9PYmoiLCJTdXJ2ZXkuSnNvbk9iamVjdC5pc1ZhbHVlQXJyYXkiLCJTdXJ2ZXkuSnNvbk9iamVjdC5jcmVhdGVOZXdPYmoiLCJTdXJ2ZXkuSnNvbk9iamVjdC5jaGVja05ld09iamVjdE9uRXJyb3JzIiwiU3VydmV5Lkpzb25PYmplY3QuYWRkTmV3RXJyb3IiLCJTdXJ2ZXkuSnNvbk9iamVjdC52YWx1ZVRvQXJyYXkiLCJTdXJ2ZXkuSnNvbk9iamVjdC5maW5kUHJvcGVydHkiLCJTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5IiwiU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbkZhY3RvcnkucmVnaXN0ZXJRdWVzdGlvbiIsIlN1cnZleS5RdWVzdGlvbkZhY3RvcnkuZ2V0QWxsVHlwZXMiLCJTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5LmNyZWF0ZVF1ZXN0aW9uIiwiU3VydmV5LlZhbGlkYXRvclJlc3VsdCIsIlN1cnZleS5WYWxpZGF0b3JSZXN1bHQuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5VmFsaWRhdG9yIiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlWYWxpZGF0b3IuZ2V0RXJyb3JUZXh0IiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci5nZXREZWZhdWx0RXJyb3JUZXh0IiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5WYWxpZGF0b3JSdW5uZXIiLCJTdXJ2ZXkuVmFsaWRhdG9yUnVubmVyLmNvbnN0cnVjdG9yIiwiU3VydmV5LlZhbGlkYXRvclJ1bm5lci5ydW4iLCJTdXJ2ZXkuTnVtZXJpY1ZhbGlkYXRvciIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lk51bWVyaWNWYWxpZGF0b3IuZ2V0VHlwZSIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLnZhbGlkYXRlIiwiU3VydmV5Lk51bWVyaWNWYWxpZGF0b3IuZ2V0RGVmYXVsdEVycm9yVGV4dCIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLmlzTnVtYmVyIiwiU3VydmV5LlRleHRWYWxpZGF0b3IiLCJTdXJ2ZXkuVGV4dFZhbGlkYXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5UZXh0VmFsaWRhdG9yLmdldFR5cGUiLCJTdXJ2ZXkuVGV4dFZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5UZXh0VmFsaWRhdG9yLmdldERlZmF1bHRFcnJvclRleHQiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IuZ2V0VHlwZSIsIlN1cnZleS5BbnN3ZXJDb3VudFZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5BbnN3ZXJDb3VudFZhbGlkYXRvci5nZXREZWZhdWx0RXJyb3JUZXh0IiwiU3VydmV5LlF1ZXN0aW9uIiwiU3VydmV5LlF1ZXN0aW9uLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uLmNyZWF0ZWtvVmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24uc2V0a29WYWx1ZSIsIlN1cnZleS5RdWVzdGlvbi50aXRsZSIsIlN1cnZleS5RdWVzdGlvbi5zdXBwb3J0Q29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5zdXBwb3J0T3RoZXIiLCJTdXJ2ZXkuUXVlc3Rpb24uaXNSZXF1aXJlZCIsIlN1cnZleS5RdWVzdGlvbi52aXNpYmxlIiwiU3VydmV5LlF1ZXN0aW9uLnZpc2libGVJbmRleCIsIlN1cnZleS5RdWVzdGlvbi5oYXNDb21tZW50IiwiU3VydmV5LlF1ZXN0aW9uLmhhc090aGVyIiwiU3VydmV5LlF1ZXN0aW9uLnNldERhdGEiLCJTdXJ2ZXkuUXVlc3Rpb24udmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24uY29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5pc0VtcHR5IiwiU3VydmV5LlF1ZXN0aW9uLmhhc0Vycm9ycyIsIlN1cnZleS5RdWVzdGlvbi5jaGVja0ZvckVycm9ycyIsIlN1cnZleS5RdWVzdGlvbi5vbkNoZWNrRm9yRXJyb3JzIiwiU3VydmV5LlF1ZXN0aW9uLnJ1blZhbGlkYXRvcnMiLCJTdXJ2ZXkuUXVlc3Rpb24uc2V0TmV3VmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24ub25WYWx1ZUNoYW5nZWQiLCJTdXJ2ZXkuUXVlc3Rpb24uc2V0TmV3Q29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5vbkNyZWF0aW5nIiwiU3VydmV5LlF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkIiwiU3VydmV5LlF1ZXN0aW9uLnNldFZpc2libGVJbmRleCIsIlN1cnZleS5RdWVzdGlvbi5nZXRWYWxpZGF0b3JUaXRsZSIsIlN1cnZleS5QYWdlIiwiU3VydmV5LlBhZ2UuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUGFnZS5udW0iLCJTdXJ2ZXkuUGFnZS5nZXRUeXBlIiwiU3VydmV5LlBhZ2UuaXNWaXNpYmxlIiwiU3VydmV5LlBhZ2UuYWRkUXVlc3Rpb24iLCJTdXJ2ZXkuUGFnZS5hZGROZXdRdWVzdGlvbiIsIlN1cnZleS5QYWdlLnJlbW92ZVF1ZXN0aW9uIiwiU3VydmV5LlBhZ2UuaGFzRXJyb3JzIiwiU3VydmV5LlBhZ2UuYWRkUXVlc3Rpb25zVG9MaXN0IiwiU3VydmV5LlBhZ2Uub25DcmVhdGluZyIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2UiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5pc090aGVyU2VsZWN0ZWQiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLmNob2ljZXMiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLmNob2ljZXNPcmRlciIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uub3RoZXJUZXh0IiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS52aXNpYmxlQ2hvaWNlcyIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uuc3VwcG9ydENvbW1lbnQiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLnN1cHBvcnRPdGhlciIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uub25DaGVja0ZvckVycm9ycyIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uuc29ydFZpc2libGVDaG9pY2VzIiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5zb3J0QXJyYXkiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLnJhbmRvbWl6ZUFycmF5IiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlLmNvbENvdW50IiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlLmtvQWZ0ZXJSZW5kZXIiLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveCIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94LmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3guY3JlYXRla29WYWx1ZSIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94LnNldGtvVmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveC5pc090aGVyU2VsZWN0ZWQiLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uQ29tbWVudCIsIlN1cnZleS5RdWVzdGlvbkNvbW1lbnQuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25Db21tZW50LmdldFR5cGUiLCJTdXJ2ZXkuUXVlc3Rpb25Db21tZW50LmlzRW1wdHkiLCJTdXJ2ZXkuUXVlc3Rpb25Ecm9wZG93biIsIlN1cnZleS5RdWVzdGlvbkRyb3Bkb3duLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uRHJvcGRvd24uZ2V0VHlwZSIsIlN1cnZleS5NYXRyaXhSb3ciLCJTdXJ2ZXkuTWF0cml4Um93LmNvbnN0cnVjdG9yIiwiU3VydmV5Lk1hdHJpeFJvdy52YWx1ZSIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeCIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uTWF0cml4Lmhhc1Jvd3MiLCJTdXJ2ZXkuUXVlc3Rpb25NYXRyaXguY29sdW1ucyIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5yb3dzIiwiU3VydmV5LlF1ZXN0aW9uTWF0cml4LnZpc2libGVSb3dzIiwiU3VydmV5LlF1ZXN0aW9uTWF0cml4Lm9uTWF0cml4Um93Q2hhbmdlZCIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0uY29uc3RydWN0b3IiLCJTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbS5nZXRUeXBlIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0uc2V0RGF0YSIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtLnRpdGxlIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0udmFsdWUiLCJTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbS5vblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtLmdldFZhbGlkYXRvclRpdGxlIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0IiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LmdldFR5cGUiLCJTdXJ2ZXkuUXVlc3Rpb25NdWx0aXBsZVRleHQuQWRkSXRlbSIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5vblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5zZXRrb1ZhbHVlIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0Lm9uSXRlbVZhbHVlQ2hhbmdlZCIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5ydW5WYWxpZGF0b3JzIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LmdldE11bHRpcGxlVGV4dFZhbHVlIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LnNldE11bHRpcGxlVGV4dFZhbHVlIiwiU3VydmV5LlF1ZXN0aW9uUmFkaW9ncm91cCIsIlN1cnZleS5RdWVzdGlvblJhZGlvZ3JvdXAuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25SYWRpb2dyb3VwLmdldFR5cGUiLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmciLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcucmF0ZVZhbHVlcyIsIlN1cnZleS5RdWVzdGlvblJhdGluZy52aXNpYmxlUmF0ZVZhbHVlcyIsIlN1cnZleS5RdWVzdGlvblJhdGluZy5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uUmF0aW5nLnN1cHBvcnRDb21tZW50IiwiU3VydmV5LlF1ZXN0aW9uUmF0aW5nLnN1cHBvcnRPdGhlciIsIlN1cnZleS5RdWVzdGlvblRleHQiLCJTdXJ2ZXkuUXVlc3Rpb25UZXh0LmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uVGV4dC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uVGV4dC5pc0VtcHR5IiwiU3VydmV5LlRyaWdnZXIiLCJTdXJ2ZXkuVHJpZ2dlci5jb25zdHJ1Y3RvciIsIlN1cnZleS5UcmlnZ2VyLm9wZXJhdG9ycyIsIlN1cnZleS5UcmlnZ2VyLm9wZXJhdG9yIiwiU3VydmV5LlRyaWdnZXIuY2hlY2siLCJTdXJ2ZXkuVHJpZ2dlci5vblN1Y2Nlc3MiLCJTdXJ2ZXkuVHJpZ2dlci5vbkZhaWx1cmUiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlciIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyLmNvbnN0cnVjdG9yIiwiU3VydmV5LlN1cnZleVRyaWdnZXIuc2V0T3duZXIiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vblN1Y2Nlc3MiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vbkZhaWx1cmUiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vblRyaWdnZXIiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vbkl0ZW1TdWNjZXNzIiwiU3VydmV5LlN1cnZleVRyaWdnZXIub25JdGVtRmFpbHVyZSIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZS5nZXRUeXBlIiwiU3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlLm9uSXRlbVN1Y2Nlc3MiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUub25JdGVtRmFpbHVyZSIsInRlbXBsYXRlIiwidGVtcGxhdGUua28iLCJTdXJ2ZXkuU3VydmV5IiwiU3VydmV5LlN1cnZleS5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXkuZ2V0VHlwZSIsIlN1cnZleS5TdXJ2ZXkuZGF0YSIsIlN1cnZleS5TdXJ2ZXkuY29tbWVudHMiLCJTdXJ2ZXkuU3VydmV5LnZpc2libGVQYWdlcyIsIlN1cnZleS5TdXJ2ZXkuaXNFbXB0eSIsIlN1cnZleS5TdXJ2ZXkuUGFnZUNvdW50IiwiU3VydmV5LlN1cnZleS52aXNpYmxlUGFnZUNvdW50IiwiU3VydmV5LlN1cnZleS5jdXJyZW50UGFnZSIsIlN1cnZleS5TdXJ2ZXkuaXNEZXNpZ25Nb2RlIiwiU3VydmV5LlN1cnZleS51cGRhdGVLb0N1cnJlbnRQYWdlIiwiU3VydmV5LlN1cnZleS5uZXh0UGFnZSIsIlN1cnZleS5TdXJ2ZXkuaXNDdXJyZW50UGFnZUhhc0Vycm9ycyIsIlN1cnZleS5TdXJ2ZXkucHJldlBhZ2UiLCJTdXJ2ZXkuU3VydmV5LmNvbXBsZXRlTGFzdFBhZ2UiLCJTdXJ2ZXkuU3VydmV5LmlzRmlyc3RQYWdlIiwiU3VydmV5LlN1cnZleS5pc0xhc3RQYWdlIiwiU3VydmV5LlN1cnZleS5nZXRQYWdlIiwiU3VydmV5LlN1cnZleS5hZGRQYWdlIiwiU3VydmV5LlN1cnZleS5hZGROZXdQYWdlIiwiU3VydmV5LlN1cnZleS5yZW1vdmVQYWdlIiwiU3VydmV5LlN1cnZleS5nZXRRdWVzdGlvbkJ5TmFtZSIsIlN1cnZleS5TdXJ2ZXkuZ2V0UXVlc3Rpb25zQnlOYW1lcyIsIlN1cnZleS5TdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24iLCJTdXJ2ZXkuU3VydmV5LmdldFBhZ2VCeU5hbWUiLCJTdXJ2ZXkuU3VydmV5LmdldFBhZ2VzQnlOYW1lcyIsIlN1cnZleS5TdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zIiwiU3VydmV5LlN1cnZleS5ub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkIiwiU3VydmV5LlN1cnZleS5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5TdXJ2ZXkuY2hlY2tUcmlnZ2VycyIsIlN1cnZleS5TdXJ2ZXkucmVuZGVyIiwiU3VydmV5LlN1cnZleS5zZW5kUmVzdWx0IiwiU3VydmV5LlN1cnZleS5nZXRSZXN1bHQiLCJTdXJ2ZXkuU3VydmV5LmxvYWRTdXJ2ZXlGcm9tU2VydmljZSIsIlN1cnZleS5TdXJ2ZXkub25CZWZvcmVSZW5kZXIiLCJTdXJ2ZXkuU3VydmV5LmFwcGx5QmluZGluZyIsIlN1cnZleS5TdXJ2ZXkudXBkYXRlVmlzaWJsZUluZGV4ZXMiLCJTdXJ2ZXkuU3VydmV5LnVwZGF0ZVBhZ2VWaXNpYmxlSW5kZXhlcyIsIlN1cnZleS5TdXJ2ZXkudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyIsIlN1cnZleS5TdXJ2ZXkuc2V0SnNvbk9iamVjdCIsIlN1cnZleS5TdXJ2ZXkub25DcmVhdGluZyIsIlN1cnZleS5TdXJ2ZXkuZ2V0VmFsdWUiLCJTdXJ2ZXkuU3VydmV5LnNldFZhbHVlIiwiU3VydmV5LlN1cnZleS5nZXRDb21tZW50IiwiU3VydmV5LlN1cnZleS5zZXRDb21tZW50IiwiU3VydmV5LlN1cnZleS5xdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkIiwiU3VydmV5LlN1cnZleS5xdWVzdGlvbkFkZGVkIiwiU3VydmV5LlN1cnZleS5xdWVzdGlvblJlbW92ZWQiLCJTdXJ2ZXkuU3VydmV5LnZhbGlkYXRlUXVlc3Rpb24iLCJTdXJ2ZXkuU3VydmV5LmdldE9iamVjdHMiLCJTdXJ2ZXkuU3VydmV5V2luZG93IiwiU3VydmV5LlN1cnZleVdpbmRvdy5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuZ2V0VHlwZSIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuc3VydmV5IiwiU3VydmV5LlN1cnZleVdpbmRvdy5pc1Nob3dpbmciLCJTdXJ2ZXkuU3VydmV5V2luZG93LmlzRXhwYW5kZWQiLCJTdXJ2ZXkuU3VydmV5V2luZG93LnRpdGxlIiwiU3VydmV5LlN1cnZleVdpbmRvdy5zaG93IiwiU3VydmV5LlN1cnZleVdpbmRvdy5oaWRlIiwiU3VydmV5LlN1cnZleVdpbmRvdy5leHBhbmQiLCJTdXJ2ZXkuU3VydmV5V2luZG93LmNvbGxhcHNlIiwiU3VydmV5LlN1cnZleVdpbmRvdy50ZW1wbGF0ZSIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuZXhwYW5kY29sbGFwc2UiLCJTdXJ2ZXkuU3VydmV5V2luZG93LmNoYW5nZUV4cGFuZGVkIiwiU3VydmV5LlN1cnZleVdpbmRvdy5vbkNvbXBsZXRlIiwidGVtcGxhdGUud2luZG93IiwidGVtcGxhdGUud2luZG93LmtvIiwiU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dEJhc2UiLCJTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0QmFzZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlUZW1wbGF0ZVRleHRCYXNlLnJlcGxhY2VUZXh0IiwiU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dEJhc2UuZ2V0SWQiLCJTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0QmFzZS50ZXh0IiwiU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCIsIlN1cnZleS5TdXJ2ZXlUZW1wbGF0ZVRleHQuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0LnRleHQiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sTUFBTSxDQW1IWjtBQW5IRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBc0JYQTtRQThCSUMsbUJBQVlBLEtBQVVBLEVBQUVBLElBQW1CQTtZQUFuQkMsb0JBQW1CQSxHQUFuQkEsV0FBbUJBO1lBQ3ZDQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNqQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDdkJBLENBQUNBO1FBL0JhRCxpQkFBT0EsR0FBckJBLFVBQXNCQSxLQUF1QkEsRUFBRUEsTUFBa0JBO1lBQzdERSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNqQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFB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QSxFQUFFQSxHQUFRQTtZQUNsQ0ksRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBO1lBQ3JCQSxJQUFJQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUN0QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2RBLFVBQVVBLEdBQUdBLFVBQVVBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLENBQUNBO1lBQ2xFQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0E7WUFDeEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUN0QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtvQkFBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQ2pEQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxVQUFVQSxDQUFDQSxvQkFBb0JBLENBQUNBLENBQUNBLENBQUNBO29CQUN6Q0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3hCQSxRQUFRQSxDQUFDQTtnQkFDYkEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNsREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1pBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLHdCQUF3QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsRUFBRUEsR0FBR0EsQ0FBQ0Es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QkEsQ0FBQ0E7UUFDT1gsaUNBQVlBLEdBQXBCQSxVQUFxQkEsS0FBaUJBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLFFBQTRCQTtZQUNwRlksRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9CQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNsQkEsQ0FBQ0E7WUFDREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ3BDQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDckRBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO29CQUNsQkEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQy9CQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDN0NBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2xCQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLENB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UUFDcEZBLENBQUNBO1FBQ1NGLHNDQUFLQSxHQUFmQSxVQUFnQkEsRUFBVUEsRUFBRUEsWUFBb0JBO1lBQzVDRyxJQUFJQSxNQUFNQSxHQUFHQSxhQUFhQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNoQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2ZBLE1BQU1BLElBQUlBLEdBQUdBLEdBQUdBLFlBQVlBLENBQUNBO1lBQ2pDQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7UUFDREgsc0JBQWNBLHdDQUFJQTtpQkFBbEJBLGNBQStCSSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtpQkFDM0NKLFVBQW1CQSxLQUFhQSxJQUFLSSxDQUFDQTs7O1dBREtKO1FBRS9DQSw2QkFBQ0E7SUFBREEsQ0F4QkFyVSxBQXdCQ3FVLElBQUFyVTtJQXhCWUEsNkJBQXNCQSx5QkF3QmxDQSxDQUFBQTtJQUNEQTtRQUF3QzBVLHNDQUFzQkE7UUFBOURBO1lBQXdDQyw4QkFBc0JBO1FBRzlEQSxDQUFDQTtRQUZHRCxzQkFBY0Esb0NBQUlBO2lCQUFsQkEsY0FBK0JFLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2lCQUN6REYsVUFBbUJBLEtBQWFBLElBQUlFLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBOzs7V0FETkY7UUFFN0RBLHlCQUFDQTtJQUFEQSxDQUhBMVUsQUFHQzBVLEVBSHVDMVUsc0JBQXNCQSxFQUc3REE7SUFIWUEseUJBQWtCQSxxQkFHOUJBLENBQUFBO0FBQ0xBLENBQUNBLEVBOUJNLE1BQU0sS0FBTixNQUFNLFFBOEJaIiwiZmlsZSI6InN1cnZleS5ib290c3RyYXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSGFzaFRhYmxlPFQ+IHtcclxuICAgICAgICBba2V5OiBzdHJpbmddOiBUO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5IHtcclxuICAgICAgICBnZXRWYWx1ZShuYW1lOiBzdHJpbmcpOiBhbnk7XHJcbiAgICAgICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KTtcclxuICAgICAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZztcclxuICAgICAgICBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZyk7XHJcbiAgICAgICAgcXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBuZXdWYWx1ZTogYm9vbGVhbik7XHJcbiAgICAgICAgcXVlc3Rpb25BZGRlZChxdWVzdGlvbjogSVF1ZXN0aW9uLCBpbmRleDogbnVtYmVyKTtcclxuICAgICAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbik7XHJcbiAgICAgICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvcjtcclxuICAgICAgICBpc0Rlc2lnbk1vZGU6IGJvb2xlYW47XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElRdWVzdGlvbiB7XHJcbiAgICAgICAgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICAgICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpO1xyXG4gICAgICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBJdGVtVmFsdWUge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgU2VwYXJhdG9yID0gJ3wnO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2V0RGF0YShpdGVtczogQXJyYXk8SXRlbVZhbHVlPiwgdmFsdWVzOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIGl0ZW1zLmxlbmd0aCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSB2YWx1ZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBJdGVtVmFsdWUobnVsbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mICh2YWx1ZS52YWx1ZSkgIT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS50ZXh0ID0gdmFsdWVbXCJ0ZXh0XCJdO1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZVtcInZhbHVlXCJdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0RGF0YShpdGVtczogQXJyYXk8SXRlbVZhbHVlPik6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXkoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW0gPSBpdGVtc1tpXTtcclxuICAgICAgICAgICAgICAgIGlmIChpdGVtLmhhc1RleHQpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh7IHZhbHVlOiBpdGVtLnZhbHVlLCB0ZXh0OiBpdGVtLnRleHQgfSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGl0ZW0udmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXRlbVZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtVGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHZhbHVlOiBhbnksIHRleHQ6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJpdGVtdmFsdWVcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKTogYW55IHsgcmV0dXJuIHRoaXMuaXRlbVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pdGVtVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0cjogc3RyaW5nID0gdGhpcy5pdGVtVmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gc3RyLmluZGV4T2YoSXRlbVZhbHVlLlNlcGFyYXRvcik7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA+IC0xKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1WYWx1ZSA9IHN0ci5zbGljZSgwLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRleHQgPSBzdHIuc2xpY2UoaW5kZXggKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RleHQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLml0ZW1UZXh0ID8gdHJ1ZSA6IGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0ZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc1RleHQpIHJldHVybiB0aGlzLml0ZW1UZXh0O1xyXG4gICAgICAgICAgICBpZiAodGhpcy52YWx1ZSkgcmV0dXJuIHRoaXMudmFsdWUudG9TdHJpbmcoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGV4dChuZXdUZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVGV4dCA9IG5ld1RleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBCYXNlIHtcclxuICAgICAgICBpc0tPID0gdHlwZW9mIGtvICE9PSAndW5kZWZpbmVkJztcclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgbWV0aG9kIGlzIGFic3RyYWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1RoaXMgbWV0aG9kIGlzIGFic3RyYWN0Jyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBFdmVudDxUIGV4dGVuZHMgRnVuY3Rpb24sIE9wdGlvbnM+ICB7XHJcbiAgICAgICAgcHJpdmF0ZSBjYWxsYmFja3M6IEFycmF5PFQ+O1xyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuY2FsbGJhY2tzID09IG51bGwgfHwgdGhpcy5jYWxsYmFja3MubGVuZ3RoID09IDA7IH1cclxuICAgICAgICBwdWJsaWMgZmlyZShzZW5kZXI6IGFueSwgb3B0aW9uczogT3B0aW9ucykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuY2FsbGJhY2tzLmxlbmd0aDsgaSArKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNhbGxSZXN1bHQgPSB0aGlzLmNhbGxiYWNrc1tpXShzZW5kZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkKGZ1bmM6IFQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzID0gbmV3IEFycmF5PFQ+KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MucHVzaChmdW5jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbW92ZShmdW5jOiBUKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMuY2FsbGJhY2tzLmluZGV4T2YoZnVuYywgMCk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FsbGJhY2tzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBkeFN1cnZleVNlcnZpY2Uge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwczovL2R4c3VydmV5LmF6dXJld2Vic2l0ZXMubmV0L2FwaS9TdXJ2ZXlcIjtcclxuICAgICAgICAvL3B1YmxpYyBzdGF0aWMgc2VydmljZVVybDogc3RyaW5nID0gXCJodHRwOi8vbG9jYWxob3N0OjQ5ODkxL2FwaS9TdXJ2ZXlcIjtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXkoc3VydmV5SWQ6IHN0cmluZywgb25Mb2FkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFN1cnZleT9zdXJ2ZXlJZD0nICsgc3VydmV5SWQpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIG9uTG9hZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZywgcmVzdWx0OiBKU09OLCBvblNlbmRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KT0+IHZvaWQsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdQT1NUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL3Bvc3QvJyk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCcpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHsgcG9zdElkOiBwb3N0SWQsIHN1cnZleVJlc3VsdDogSlNPTi5zdHJpbmdpZnkocmVzdWx0KSB9O1xyXG4gICAgICAgICAgICBpZiAoY2xpZW50SWQpIGRhdGFbJ2NsaWVudElkJ10gPSBjbGllbnRJZDtcclxuICAgICAgICAgICAgaWYgKGlzUGFydGlhbENvbXBsZXRlZCkgZGF0YVsnaXNQYXJ0aWFsQ29tcGxldGVkJ10gPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgZGF0YVN0cmluZ2lmeTogc3RyaW5nID0gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LUxlbmd0aCcsIGRhdGFTdHJpbmdpZnkubGVuZ3RoLnRvU3RyaW5nKCkpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICBvblNlbmRSZXN1bHQoeGhyLnN0YXR1cyA9PSAyMDAsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKGRhdGFTdHJpbmdpZnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVzdWx0KHJlc3VsdElkOiBzdHJpbmcsIG5hbWU6IHN0cmluZywgb25HZXRSZXN1bHQ6IChzdWNjZXNzOiBib29sZWFuLCBkYXRhOiBhbnksIGRhdGFMaXN0OiBBcnJheTxhbnk+LCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZuYW1lPScgKyBuYW1lO1xyXG4gICAgICAgICAgICB4aHIub3BlbignR0VUJywgZHhTdXJ2ZXlTZXJ2aWNlLnNlcnZpY2VVcmwgKyAnL2dldFJlc3VsdD8nICsgZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgdmFyIGxpc3QgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIGxpc3QgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gcmVzdWx0LlF1ZXN0aW9uUmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBlbCA9IHsgbmFtZToga2V5LCB2YWx1ZTogcmVzdWx0LlF1ZXN0aW9uUmVzdWx0W2tleV0gfTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbGlzdC5wdXNoKGVsKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBvbkdldFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCBsaXN0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaXNDb21wbGV0ZWQocmVzdWx0SWQ6IHN0cmluZywgY2xpZW50SWQ6IHN0cmluZywgb25Jc0NvbXBsZXRlZDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3VsdDogc3RyaW5nLCByZXNwb25zZTogYW55KSA9PiB2b2lkKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgdmFyIGRhdGEgPSAncmVzdWx0SWQ9JyArIHJlc3VsdElkICsgJyZjbGllbnRJZD0nICsgY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvaXNDb21wbGV0ZWQ/JyArIGRhdGEpO1xyXG4gICAgICAgICAgICB4aHIuc2V0UmVxdWVzdEhlYWRlcignQ29udGVudC1UeXBlJywgJ2FwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZCcpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh4aHIuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCA9IEpTT04ucGFyc2UoeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9uSXNDb21wbGV0ZWQoeGhyLnN0YXR1cyA9PSAyMDAsIHJlc3VsdCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIEFuc3dlclJlcXVpcmVkRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSAge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJZb3Ugc2hvdWxkIGFuc3dlciB0aGUgcXVlc3Rpb24uXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFJlcXVyZU51bWVyaWNFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiVGhlIHZhbHVlIHNob3VsZCBiZSBhIG51bWVyaWMuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEN1c3RvbUVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHByaXZhdGUgdGV4dDogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHRleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgcHJpdmF0ZSB0eXBlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lUGFydDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjaG9pY2VzOiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgb25HZXRWYWx1ZTogKG9iajogYW55KSA9PiBhbnkgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBvblNldFZhbHVlOiAob2JqOiBhbnksIHZhbHVlOiBhbnksIGpzb25Db252OiBKc29uT2JqZWN0KSA9PiBhbnlcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudHlwZVZhbHVlID8gdGhpcy50eXBlVmFsdWUgOiBcInN0cmluZ1wiOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0eXBlKHZhbHVlOiBzdHJpbmcpIHsgdGhpcy50eXBlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVG9Vc2VHZXRWYWx1ZSgpIHsgcmV0dXJuIHRoaXMub25HZXRWYWx1ZTsgfSBcclxuICAgICAgICBwdWJsaWMgaXNEZWZhdWx0VmFsdWUodmFsdWU6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuZGVmYXVsdFZhbHVlKSA/ICh0aGlzLmRlZmF1bHRWYWx1ZSA9PSB2YWx1ZSkgOiAhKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFZhbHVlKG9iajogYW55KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25HZXRWYWx1ZSkgcmV0dXJuIHRoaXMub25HZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUb1VzZVNldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vblNldFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldFZhbHVlKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vblNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uU2V0VmFsdWUob2JqLCB2YWx1ZSwganNvbkNvbnYpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRPYmpUeXBlKG9ialR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuY2xhc3NOYW1lUGFydCkgcmV0dXJuIG9ialR5cGU7XHJcbiAgICAgICAgICAgIHJldHVybiBvYmpUeXBlLnJlcGxhY2UodGhpcy5jbGFzc05hbWVQYXJ0LCBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENsYXNzTmFtZShjbGFzc05hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5jbGFzc05hbWVQYXJ0ICYmIGNsYXNzTmFtZS5pbmRleE9mKHRoaXMuY2xhc3NOYW1lUGFydCkgPCAwKSA/IGNsYXNzTmFtZSArIHRoaXMuY2xhc3NOYW1lUGFydCA6IGNsYXNzTmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgIHN0YXRpYyByZXF1aXJlZFN5bWJvbCA9ICchJztcclxuICAgICAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgICAgICBwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+ID0gbnVsbDtcclxuICAgICAgICByZXF1aXJlZFByb3BlcnRpZXM6IEFycmF5PHN0cmluZz4gPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgcHVibGljIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydGllc05hbWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZUluZGV4ID0gcHJvcGVydHlOYW1lLmluZGV4T2YoSnNvbk1ldGFkYXRhQ2xhc3MudHlwZVN5bWJvbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKHR5cGVJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHJpbmcoMCwgdHlwZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBuZXcgSnNvbk9iamVjdFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUubGVuZ3RoID09IDAgfHwgcHJvcGVydHlOYW1lWzBdICE9IEpzb25NZXRhZGF0YUNsYXNzLnJlcXVpcmVkU3ltYm9sKSByZXR1cm4gcHJvcGVydHlOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NZXRhZGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc2VzOiBIYXNoVGFibGU8SnNvbk1ldGFkYXRhQ2xhc3M+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc1Byb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NSZXF1aXJlZFByb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxzdHJpbmc+PiA9IHt9O1xyXG4gICAgICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllc05hbWVzLCBjcmVhdG9yLCBwYXJlbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0UHJvcGVydHlWYWx1ZXMobmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHJvcGVydHlDbGFzc05hbWU6IHN0cmluZywgZGVmYXVsdFZhbHVlOiBhbnkgPSBudWxsLCBvbkdldFZhbHVlOiAob2JqOiBhbnkpID0+IGFueSA9IG51bGwsIG9uU2V0VmFsdWU6IChvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpID0+IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkobmFtZSwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5jbGFzc05hbWUgPSBwcm9wZXJ0eUNsYXNzTmFtZTtcclxuICAgICAgICAgICAgcHJvcGVydHkuZGVmYXVsdFZhbHVlID0gZGVmYXVsdFZhbHVlO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5vbkdldFZhbHVlID0gb25HZXRWYWx1ZTtcclxuICAgICAgICAgICAgcHJvcGVydHkub25TZXRWYWx1ZSA9IG9uU2V0VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRQcm9wZXJ0eUNob2ljZXMobmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgY2hvaWNlczogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmNob2ljZXMgPSBjaG9pY2VzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0UHJvcGVydHlDbGFzc0luZm8obmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZywgYmFzZUNsYXNzTmFtZTogc3RyaW5nLCBjbGFzc05hbWVQYXJ0OiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KG5hbWUsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHJldHVybjtcclxuICAgICAgICAgICAgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSA9IGJhc2VDbGFzc05hbWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmNsYXNzTmFtZVBhcnQgPSBjbGFzc05hbWVQYXJ0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjcmVhdGVDbGFzcyhuYW1lOiBzdHJpbmcpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcy5jcmVhdG9yKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSB0aGlzLmNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXSA9IHByb3BlcnRpZXM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnRpZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiwgcmVzdWx0OiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4pIHtcclxuICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbkNsYXNzZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghY2hpbGRyZW4pIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjYW5CZUNyZWF0ZWQgfHwgY2hpbGRyZW5baV0uY3JlYXRvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGNoaWxkcmVuW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhjaGlsZHJlbltpXS5uYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaW5kQ2xhc3MobmFtZTogc3RyaW5nKTogSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jbGFzc2VzW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MgPyBtZXRhRGF0YUNsYXNzLmZpbmQocHJvcGVydHlOYW1lKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkUHJvcGVydHkobWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzW2ldLCBsaXN0LCBsaXN0Lmxlbmd0aCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGRQcm9wZXJ0eShwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBsaXN0OiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBlbmRJbmRleDogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IC0xO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGVuZEluZGV4OyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChsaXN0W2ldLm5hbWUgPT0gcHJvcGVydHkubmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGluZGV4ID0gaTtcclxuICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkge1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHByb3BlcnR5KVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgbGlzdFtpbmRleF0gPSBwcm9wZXJ0eTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nLCBsaXN0OiBBcnJheTxzdHJpbmc+KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KGxpc3QsIG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBkZXNjcmlwdGlvbjogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgYXQ6IE51bWJlciA9IC0xO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEZ1bGxEZXNjcmlwdGlvbigpIDogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMubWVzc2FnZSArICh0aGlzLmRlc2NyaXB0aW9uID8gXCJcXG5cIiArIHRoaXMuZGVzY3JpcHRpb24gOiBcIlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcInVua25vd25wcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInIGlzIHVua25vd24uXCIpO1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGxpc3Qgb2YgYXZhaWxhYmxlIHByb3BlcnRpZXMgYXJlOiBcIjtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChpID4gMCkgdGhpcy5kZXNjcmlwdGlvbiArPSBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBwcm9wZXJ0aWVzW2ldLm5hbWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9ICcuJztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2UgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcsIHB1YmxpYyB0eXBlOiBzdHJpbmcsIHB1YmxpYyBtZXNzYWdlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIodHlwZSwgbWVzc2FnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBmb2xsb3dpbmcgdHlwZXMgYXJlIGF2YWlsYWJsZTogXCI7XHJcbiAgICAgICAgICAgIHZhciB0eXBlcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0Q2hpbGRyZW5DbGFzc2VzKGJhc2VDbGFzc05hbWUsIHRydWUpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHR5cGVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIidcIiArIHR5cGVzW2ldLm5hbWUgKyBcIidcIjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWlzc2luZ1R5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwibWlzc2luZ3R5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIG1pc3NpbmcgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uSW5jb3JyZWN0VHlwZUVycm9yIGV4dGVuZHMgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoYmFzZUNsYXNzTmFtZSwgXCJpbmNvcnJlY3R0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBpbmNvcnJlY3QgaW4gdGhlIG9iamVjdC4gUGxlYXNlIHRha2UgYSBsb29rIGF0IHByb3BlcnR5OiAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihcInJlcXVpcmVkcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGlzIHJlcXVpcmVkIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uT2JqZWN0IHtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyB0eXBlUHJvcGVydHlOYW1lID0gXCJ0eXBlXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgcG9zaXRpb25Qcm9wZXJ0eU5hbWUgPSBcInBvc1wiO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIG1ldGFEYXRhVmFsdWUgPSBuZXcgSnNvbk1ldGFkYXRhKCk7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXQgbWV0YURhdGEoKSB7IHJldHVybiBKc29uT2JqZWN0Lm1ldGFEYXRhVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZXJyb3JzID0gbmV3IEFycmF5PEpzb25FcnJvcj4oKTtcclxuICAgICAgICBwdWJsaWMgdG9Kc29uT2JqZWN0KG9iajogYW55KTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudG9Kc29uT2JqZWN0Q29yZShvYmosIG51bGwpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdG9PYmplY3QoanNvbk9iajogYW55LCBvYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAob2JqLmdldFR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBqc29uT2JqKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5ID09IEpzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XSA9IGpzb25PYmpba2V5XTtcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KHByb3BlcnRpZXMsIGtleSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihuZXcgSnNvblVua25vd25Qcm9wZXJ0eUVycm9yKGtleS50b1N0cmluZygpLCBvYmouZ2V0VHlwZSgpKSwganNvbk9iaik7IFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvT2JqKGpzb25PYmpba2V5XSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdG9Kc29uT2JqZWN0Q29yZShvYmo6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghb2JqLmdldFR5cGUpIHJldHVybiBvYmo7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgKCFwcm9wZXJ0eS5jbGFzc05hbWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXSA9IHByb3BlcnR5LmdldE9ialR5cGUob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMob2JqLmdldFR5cGUoKSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9Kc29uKG9iaiwgcmVzdWx0LCBwcm9wZXJ0aWVzW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb0pzb24ob2JqOiBhbnksIHJlc3VsdDogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIHZhciB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5oYXNUb1VzZUdldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHByb3BlcnR5LmdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG9ialtwcm9wZXJ0eS5uYW1lXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaXNEZWZhdWx0VmFsdWUodmFsdWUpKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBhcnJWYWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIGFyclZhbHVlLnB1c2godGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlW2ldLCBwcm9wZXJ0eSkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBhcnJWYWx1ZS5sZW5ndGggPiAwID8gYXJyVmFsdWUgOiBudWxsO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSB0aGlzLnRvSnNvbk9iamVjdENvcmUodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W3Byb3BlcnR5Lm5hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9PYmoodmFsdWU6IGFueSwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5Lmhhc1RvVXNlU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnR5LnNldFZhbHVlKG9iaiwgdmFsdWUsIHRoaXMpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVBcnJheSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb0FycmF5KHZhbHVlLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICB2YXIgbmV3T2JqID0gdGhpcy5jcmVhdGVOZXdPYmoodmFsdWUsIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgaWYgKG5ld09iai5uZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWUsIG5ld09iai5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBuZXdPYmoubmV3T2JqO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghbmV3T2JqLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZUFycmF5KHZhbHVlOiBhbnkpOiBib29sZWFuIHsgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yLnRvU3RyaW5nKCkuaW5kZXhPZihcIkFycmF5XCIpID4gLTE7IH1cclxuICAgICAgICBwcml2YXRlIGNyZWF0ZU5ld09iaih2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHsgbmV3T2JqOiBudWxsLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgICAgICB2YXIgY2xhc3NOYW1lID0gdmFsdWVbSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjbGFzc05hbWUgJiYgcHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5jbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmNsYXNzTmFtZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5nZXRDbGFzc05hbWUoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgcmVzdWx0Lm5ld09iaiA9IChjbGFzc05hbWUpID8gSnNvbk9iamVjdC5tZXRhRGF0YS5jcmVhdGVDbGFzcyhjbGFzc05hbWUpIDogbnVsbDtcclxuICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gdGhpcy5jaGVja05ld09iamVjdE9uRXJyb3JzKHJlc3VsdC5uZXdPYmosIHZhbHVlLCBwcm9wZXJ0eSwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja05ld09iamVjdE9uRXJyb3JzKG5ld09iajogYW55LCB2YWx1ZTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5LCBjbGFzc05hbWU6IHN0cmluZyk6IEpzb25FcnJvciB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChuZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXF1aXJlZFByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFJlcXVpcmVkUHJvcGVydGllcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcmVxdWlyZWRQcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICghdmFsdWVbcmVxdWlyZWRQcm9wZXJ0aWVzW2ldXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvcihyZXF1aXJlZFByb3BlcnRpZXNbaV0sIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFjbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbk1pc3NpbmdUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgSnNvbkluY29ycmVjdFR5cGVFcnJvcihwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZE5ld0Vycm9yKGVycm9yLCB2YWx1ZSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBlcnJvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhZGROZXdFcnJvcihlcnJvcjogSnNvbkVycm9yLCBqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKGpzb25PYmogJiYganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXSkge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IuYXQgPSBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdLnN0YXJ0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHZhbHVlVG9BcnJheSh2YWx1ZTogQXJyYXk8YW55Piwgb2JqOiBhbnksIGtleTogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc1ZhbHVlQXJyYXkob2JqW2tleV0pKSB7XHJcbiAgICAgICAgICAgICAgICBvYmpba2V5XSA9IFtdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlW2ldLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICBpZiAobmV3VmFsdWUubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaChuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudG9PYmplY3QodmFsdWVbaV0sIG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghbmV3VmFsdWUuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0ucHVzaCh2YWx1ZVtpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmluZFByb3BlcnR5KHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGtleTogYW55KTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydGllc1tpXS5uYW1lID09IGtleSkgcmV0dXJuIHByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkZhY3Rvcnkge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgSW5zdGFuY2U6IFF1ZXN0aW9uRmFjdG9yeSA9IG5ldyBRdWVzdGlvbkZhY3RvcnkoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIERlZmF1bHRDaG9pY2VzID0gW1wib25lXCIsIFwidHdvfHNlY29uZCB2YWx1ZVwiLCB7IHZhbHVlOiAzLCB0ZXh0OiBcInRoaXJkIHZhbHVlXCIgfV07XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdG9ySGFzaDogSGFzaFRhYmxlPChuYW1lOiBzdHJpbmcpID0+IFF1ZXN0aW9uPiA9IHt9O1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLmNyZWF0b3JIYXNoW3F1ZXN0aW9uVHlwZV0gPSBxdWVzdGlvbkNyZWF0b3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRBbGxUeXBlcygpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIHRoaXMuY3JlYXRvckhhc2gpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKGtleSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdC5zb3J0KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgY3JlYXRvciA9IHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXTtcclxuICAgICAgICAgICAgaWYgKGNyZWF0b3IgPT0gbnVsbCkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBjcmVhdG9yKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImVycm9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB2YWx1ZTogYW55LCBwdWJsaWMgZXJyb3I6IFN1cnZleUVycm9yID0gbnVsbCkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVZhbGlkYXRvciBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHB1YmxpYyB0ZXh0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykgOiBzdHJpbmcge1xyXG4gICAgICAgICAgICBpZiAodGhpcy50ZXh0KSByZXR1cm4gdGhpcy50ZXh0O1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0RXJyb3JUZXh0KG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPjtcclxuICAgICAgICB2YWx1ZTogYW55O1xyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZztcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBWYWxpZGF0b3JSdW5uZXIge1xyXG4gICAgICAgIHB1YmxpYyBydW4ob3duZXI6IElWYWxpZGF0b3JPd25lcik6IFN1cnZleUVycm9yIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvd25lci52YWxpZGF0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdG9yUmVzdWx0ID0gb3duZXIudmFsaWRhdG9yc1tpXS52YWxpZGF0ZShvd25lci52YWx1ZSwgb3duZXIuZ2V0VmFsaWRhdG9yVGl0bGUoKSk7XHJcbiAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0ICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRhdG9yUmVzdWx0LmVycm9yKSByZXR1cm4gdmFsaWRhdG9yUmVzdWx0LmVycm9yO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgb3duZXIudmFsdWUgPSB2YWxpZGF0b3JSZXN1bHQudmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgTnVtZXJpY1ZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pblZhbHVlOiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4VmFsdWU6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwibnVtZXJpY3ZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlIHx8ICF0aGlzLmlzTnVtYmVyKHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IFJlcXVyZU51bWVyaWNFcnJvcigpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IFZhbGlkYXRvclJlc3VsdChwYXJzZUZsb2F0KHZhbHVlKSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlICYmIHRoaXMubWluVmFsdWUgPiByZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFZhbHVlICYmIHRoaXMubWF4VmFsdWUgPCByZXN1bHQudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiAodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJykgPyBudWxsIDogcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHZOYW1lID0gbmFtZSA/IG5hbWUgOiBcInZhbHVlXCI7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBcIlRoZSAnXCIgKyB2TmFtZSArIFwiJyBzaG91bGQgYmUgXCI7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCJlcXVhbCBvciBtb3JlIHRoYW4gXCIgKyB0aGlzLm1pblZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1heFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5taW5WYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIiBhbmQgXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gXCIgZXF1YWwgb3IgbGVzcyB0aGFuIFwiICsgdGhpcy5tYXhWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzTnVtYmVyKHZhbHVlKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAhaXNOYU4ocGFyc2VGbG9hdCh2YWx1ZSkpICYmIGlzRmluaXRlKHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFRleHRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5MZW5ndGg6IG51bWJlciA9IDApIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidGV4dHZhbGlkYXRvclwiOyB9XHJcbiAgICAgICAgcHVibGljIHZhbGlkYXRlKHZhbHVlOiBhbnksIG5hbWU6IHN0cmluZyA9IG51bGwpOiBWYWxpZGF0b3JSZXN1bHQge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5MZW5ndGggPD0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUubGVuZ3RoIDwgdGhpcy5taW5MZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChuYW1lKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiUGxlYXNlIGVudGVyIGF0IGxlYXN0IFwiICsgdGhpcy5taW5MZW5ndGggKyBcIiBzeW1ibG9zLlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQW5zd2VyQ291bnRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5Db3VudDogbnVtYmVyID0gbnVsbCwgcHVibGljIG1heENvdW50OiBudW1iZXIgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImFuc3dlcmNvdW50dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlLmNvbnN0cnVjdG9yICE9IEFycmF5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGNvdW50ID0gdmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5Db3VudCAmJiBjb3VudCA8IHRoaXMubWluQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChcIlBsZWFzZSBzZWxlY3QgYXQgbGVhc3QgXCIgKyB0aGlzLm1pbkNvdW50ICsgXCIgdmFyaWFudHMuXCIpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4Q291bnQgJiYgY291bnQgPiB0aGlzLm1heENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQoXCJQbGVhc2Ugc2VsZWN0IG5vdCBtb3JlIHRoYW4gXCIgKyB0aGlzLm1heENvdW50ICsgXCIgdmFyaWFudHMuXCIpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gbmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgW1widGV4dFwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibnVtZXJpY3ZhbGlkYXRvclwiLCBbXCJtaW5WYWx1ZTpudW1iZXJcIiwgXCJtYXhWYWx1ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBOdW1lcmljVmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHR2YWxpZGF0b3JcIiwgW1wibWluTGVuZ3RoOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFRleHRWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIiwgW1wibWluQ291bnQ6bnVtYmVyXCIsIFwibWF4Q291bnQ6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgQW5zd2VyQ291bnRWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiBcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXJyb3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidmFsaWRhdG9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbiBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJUXVlc3Rpb24sIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICAgICAgcHJvdGVjdGVkIGRhdGE6IElTdXJ2ZXk7XHJcbiAgICAgICAgcHJpdmF0ZSB0aXRsZVZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgcXVlc3Rpb25WYWx1ZTogYW55O1xyXG4gICAgICAgIHByaXZhdGUgaXNSZXF1aXJlZFZhbHVlOiBib29sZWFuID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBoYXNDb21tZW50VmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc090aGVyVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlSW5kZXhWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4gPSBbXTtcclxuICAgICAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+ID0gbmV3IEFycmF5PFN1cnZleVZhbGlkYXRvcj4oKTtcclxuICAgICAgICBwdWJsaWMgd2lkdGg6IHN0cmluZyA9IFwiMTAwJVwiO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTsga29Db21tZW50OiBhbnk7IGtvRXJyb3JzOiBhbnk7IGtvVmlzaWJsZTogYW55OyBrb05vOiBhbnk7IGR1bW15T2JzZXJ2YWJsZTogYW55O1xyXG4gICAgICAgIGtvSXNTZWxlY3RlZDogYW55OyBcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSB0aGlzLmNyZWF0ZWtvVmFsdWUoKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Db21tZW50ID0ga28ub2JzZXJ2YWJsZSh0aGlzLmNvbW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0Vycm9ycyA9IGtvLm9ic2VydmFibGVBcnJheSh0aGlzLmVycm9ycyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmlzaWJsZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYudmlzaWJsZVZhbHVlOyB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29ObyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYudmlzaWJsZUluZGV4VmFsdWUgPiAtMSA/IHNlbGYudmlzaWJsZUluZGV4VmFsdWUgKyAxICsgXCIuIFwiIDogXCJcIjsgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvQ29tbWVudC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXROZXdDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZWtvVmFsdWUoKTogYW55IHsgcmV0dXJuIGtvLm9ic2VydmFibGUodGhpcy52YWx1ZSk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0a29WYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7IHJldHVybiAodGhpcy50aXRsZVZhbHVlKSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIGZhbHNlOyB9XHJcbiAgICAgICAgZ2V0IGlzUmVxdWlyZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzUmVxdWlyZWRWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBpc1JlcXVpcmVkKHZhbDogYm9vbGVhbikgeyB0aGlzLmlzUmVxdWlyZWRWYWx1ZSA9IHZhbDsgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBzZXQgdmlzaWJsZSh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKHZhbCA9PSB0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZCg8SVF1ZXN0aW9uPnRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVJbmRleCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy52aXNpYmxlSW5kZXhWYWx1ZTsgfVxyXG4gICAgICAgIGdldCBoYXNDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNDb21tZW50VmFsdWU7IH1cclxuICAgICAgICBzZXQgaGFzQ29tbWVudCh2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRDb21tZW50KCkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5oYXNDb21tZW50VmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc0NvbW1lbnQpIHRoaXMuaGFzT3RoZXIgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGhhc090aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNPdGhlclZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGhhc090aGVyKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydE90aGVyKCkpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5oYXNPdGhlclZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikgdGhpcy5oYXNDb21tZW50ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25TdXJ2ZXlWYWx1ZUNoYW5nZWQodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2YWx1ZSgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHJldHVybiB0aGlzLmRhdGEuZ2V0VmFsdWUodGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb25WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0a29WYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY29tbWVudCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5kYXRhICE9IG51bGwgPyB0aGlzLmRhdGEuZ2V0Q29tbWVudCh0aGlzLm5hbWUpIDogXCJcIjsgfVxyXG4gICAgICAgIHNldCBjb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQodGhpcy5jb21tZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52YWx1ZSA9PSBudWxsOyB9XHJcbiAgICAgICAgcHVibGljIGhhc0Vycm9ycygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgdGhpcy5jaGVja0ZvckVycm9ycygpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID4gMDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja0ZvckVycm9ycygpIHtcclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuICAgICAgICAgICAgdGhpcy5vbkNoZWNrRm9yRXJyb3JzKHRoaXMuZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLnJ1blZhbGlkYXRvcnMoKTtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgJiYgdGhpcy5lcnJvcnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMuZGF0YS52YWxpZGF0ZVF1ZXN0aW9uKHRoaXMubmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy5lcnJvcnMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUmVxdWlyZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLmlzRW1wdHkoKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2gobmV3IEFuc3dlclJlcXVpcmVkRXJyb3IoKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHByb3RlY3RlZCBydW5WYWxpZGF0b3JzKCk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSdW5uZXIoKS5ydW4odGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgc2V0TmV3VmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5KSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldFZhbHVlKHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHt9XHJcbiAgICAgICAgcHJpdmF0ZSBzZXROZXdDb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0Q29tbWVudCh0aGlzLm5hbWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DcmVhdGluZygpIHsgfVxyXG4gICAgICAgIC8vSVF1ZXN0aW9uXHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVJbmRleFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lWYWxpZGF0b3JPd25lclxyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZyB7IHJldHVybiBudWxsOyB9XHJcbiAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJxdWVzdGlvblwiLCBbXCIhbmFtZVwiLCBcInRpdGxlXCIsIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIFwidmlzaWJsZTpib29sZWFuXCIsIFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCIsIFwid2lkdGhcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInF1ZXN0aW9uXCIsIFwidmlzaWJsZVwiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJxdWVzdGlvblwiLCBcInRpdGxlXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicXVlc3Rpb25cIiwgXCJ3aWR0aFwiLCBudWxsLCBcIjEwMCVcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwicXVlc3Rpb25cIiwgXCJ2YWxpZGF0b3JzXCIsIFwic3VydmV5dmFsaWRhdG9yXCIsIFwidmFsaWRhdG9yXCIpO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2UgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBxdWVzdGlvbnM6IEFycmF5PFF1ZXN0aW9uPiA9IG5ldyBBcnJheTxRdWVzdGlvbj4oKTtcclxuICAgICAgICBwdWJsaWMgZGF0YTogSVN1cnZleSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHZpc2libGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgdmlzaWJsZUluZGV4OiBudW1iZXIgPSAtMTtcclxuICAgICAgICBwcml2YXRlIG51bVZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBrb05vOiBhbnk7IFxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nID0gXCJcIikge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzZWxmLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlLnNldERhdGEoc2VsZi5kYXRhKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJldHVybiBBcnJheS5wcm90b3R5cGUucHVzaC5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb05vID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgbnVtKCkgeyByZXR1cm4gdGhpcy5udW1WYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgbnVtKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMubnVtVmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5udW1WYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvTm8odGhpcy5udW1WYWx1ZSA+IDAgPyB0aGlzLm51bVZhbHVlICsgXCIuIFwiIDogXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwicGFnZVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc1Zpc2libGUoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52aXNpYmxlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uLCBpbmRleDogbnVtYmVyID0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnF1ZXN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAwLCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5zZXREYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucXVlc3Rpb25BZGRlZChxdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGROZXdRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UuY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlLCBuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRRdWVzdGlvbihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHJldHVybiBxdWVzdGlvbjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbW92ZVF1ZXN0aW9uKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnF1ZXN0aW9ucy5pbmRleE9mKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHRoaXMuZGF0YS5xdWVzdGlvblJlbW92ZWQocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnF1ZXN0aW9uc1tpXS52aXNpYmxlICYmIHRoaXMucXVlc3Rpb25zW2ldLmhhc0Vycm9ycygpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgYWRkUXVlc3Rpb25zVG9MaXN0KGxpc3Q6IEFycmF5PElRdWVzdGlvbj4sIHZpc2libGVPbmx5OiBib29sZWFuID0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHZpc2libGVPbmx5ICYmICF0aGlzLnZpc2libGUpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgbGlzdC5wdXNoKHRoaXMucXVlc3Rpb25zW2ldKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DcmVhdGluZygpIHsgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInBhZ2VcIiwgW1wibmFtZVwiLCBcInF1ZXN0aW9uc1wiLCBcInZpc2libGU6Ym9vbGVhblwiLCBcInRpdGxlXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUGFnZSgpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJwYWdlXCIsIFwidmlzaWJsZVwiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8oXCJwYWdlXCIsIFwicXVlc3Rpb25zXCIsIFwicXVlc3Rpb25cIik7XHJcbiB9IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uU2VsZWN0QmFzZSBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBzdGF0aWMgb3RoZXJJdGVtVGV4dDogc3RyaW5nID0gXCJPdGhlciAoZGVzY3JpYmUpXCI7XHJcbiAgICAgICAgb3RoZXJJdGVtOiBJdGVtVmFsdWUgPSBuZXcgSXRlbVZhbHVlKFwib3RoZXJcIiwgUXVlc3Rpb25TZWxlY3RCYXNlLm90aGVySXRlbVRleHQpO1xyXG4gICAgICAgIHB1YmxpYyBjaG9pY2VzVmFsdWVzOiBBcnJheTxJdGVtVmFsdWU+ID0gbmV3IEFycmF5PEl0ZW1WYWx1ZT4oKTtcclxuICAgICAgICBwdWJsaWMgb3RoZXJFcnJvclRleHQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgY2hvaWNlc09yZGVyVmFsdWU6IHN0cmluZyA9IFwibm9uZVwiO1xyXG4gICAgICAgIGtvT3RoZXJWaXNpYmxlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvT3RoZXJWaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvVmFsdWUoKTsgcmV0dXJuIHNlbGYuaXNPdGhlclNlbGVjdGVkKCk7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBpc090aGVyU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlID09IHRoaXMub3RoZXJJdGVtLnZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlczsgfVxyXG4gICAgICAgIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY2hvaWNlc1ZhbHVlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY2hvaWNlc09yZGVyKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNob2ljZXNPcmRlclZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGNob2ljZXNPcmRlcihuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSB0aGlzLmNob2ljZXNPcmRlclZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY2hvaWNlc09yZGVyVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IG90aGVyVGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vdGhlckl0ZW0udGV4dDsgfVxyXG4gICAgICAgIHNldCBvdGhlclRleHQodmFsdWU6IHN0cmluZykgeyB0aGlzLm90aGVySXRlbS50ZXh0ID0gdmFsdWU7IH1cclxuICAgICAgICBnZXQgdmlzaWJsZUNob2ljZXMoKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNPdGhlciAmJiB0aGlzLmNob2ljZXNPcmRlciA9PSBcIm5vbmVcIikgcmV0dXJuIHRoaXMuY2hvaWNlcztcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuc29ydFZpc2libGVDaG9pY2VzKHRoaXMuY2hvaWNlcy5zbGljZSgpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3RoZXIpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMub3RoZXJJdGVtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgICAgICBzdXBlci5vbkNoZWNrRm9yRXJyb3JzKGVycm9ycyk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc090aGVyU2VsZWN0ZWQoKSB8fCB0aGlzLmNvbW1lbnQpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHRleHQgPSB0aGlzLm90aGVyRXJyb3JUZXh0O1xyXG4gICAgICAgICAgICBpZiAoIXRleHQpIHtcclxuICAgICAgICAgICAgICAgIHRleHQgPSBcIlBsZWFzZSBlbnRlciB0aGUgb3RoZXJzIHZhbHVlLlwiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVycm9ycy5wdXNoKG5ldyBDdXN0b21FcnJvcih0ZXh0KSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNvcnRWaXNpYmxlQ2hvaWNlcyhhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICB2YXIgb3JkZXIgPSB0aGlzLmNob2ljZXNPcmRlci50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJhc2NcIikgcmV0dXJuIHRoaXMuc29ydEFycmF5KGFycmF5LCAxKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwiZGVzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIC0xKTtcclxuICAgICAgICAgICAgaWYgKG9yZGVyID09IFwicmFuZG9tXCIpIHJldHVybiB0aGlzLnJhbmRvbWl6ZUFycmF5KGFycmF5KTtcclxuICAgICAgICAgICAgcmV0dXJuIGFycmF5O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzb3J0QXJyYXkoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4sIG11bHQ6IG51bWJlcik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXkuc29ydChmdW5jdGlvbiAoYSwgYikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGEudGV4dCA8IGIudGV4dCkgcmV0dXJuIC0xICogbXVsdDtcclxuICAgICAgICAgICAgICAgIGlmIChhLnRleHQgPiBiLnRleHQpIHJldHVybiAxICogbXVsdDtcclxuICAgICAgICAgICAgICAgIHJldHVybiAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmFuZG9taXplQXJyYXkoYXJyYXk6IEFycmF5PEl0ZW1WYWx1ZT4pOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IGFycmF5Lmxlbmd0aCAtIDE7IGkgPiAwOyBpLS0pIHtcclxuICAgICAgICAgICAgICAgIHZhciBqID0gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKGkgKyAxKSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdGVtcCA9IGFycmF5W2ldO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbaV0gPSBhcnJheVtqXTtcclxuICAgICAgICAgICAgICAgIGFycmF5W2pdID0gdGVtcDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94QmFzZSBleHRlbmRzIFF1ZXN0aW9uU2VsZWN0QmFzZSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb2xDb3VudFZhbHVlOiBudW1iZXIgPSAxO1xyXG4gICAgICAgIGtvV2lkdGg6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvV2lkdGggPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmNvbENvdW50ID4gMCA/ICgxMDAgLyBzZWxmLmNvbENvdW50KSArICclJyA6IFwiXCI7IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29sQ291bnQoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMuY29sQ291bnRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgY29sQ291bnQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPCAwIHx8IHZhbHVlID4gNCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNvbENvdW50VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGtvQWZ0ZXJSZW5kZXIoZWwsIGNvbikge1xyXG4gICAgICAgICAgICB2YXIgdEVsID0gZWxbMF07XHJcbiAgICAgICAgICAgIGlmICh0RWwubm9kZU5hbWUgPT0gXCIjdGV4dFwiKSB0RWwuZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRFbCA9IGVsW2VsLmxlbmd0aCAtIDFdO1xyXG4gICAgICAgICAgICBpZiAodEVsLm5vZGVOYW1lID09IFwiI3RleHRcIikgdEVsLmRhdGEgPSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzZWxlY3RiYXNlXCIsIFtcImhhc0NvbW1lbnQ6Ym9vbGVhblwiLCBcImhhc090aGVyOmJvb2xlYW5cIiwgXCIhY2hvaWNlczppdGVtdmFsdWVzXCIsIFwiY2hvaWNlc09yZGVyXCIsIFwib3RoZXJUZXh0XCIsIFwib3RoZXJFcnJvclRleHRcIl0sIG51bGwsIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic2VsZWN0YmFzZVwiLCBcImNob2ljZXNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jaG9pY2VzKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgSXRlbVZhbHVlLnNldERhdGEob2JqLmNob2ljZXMsIHZhbHVlKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic2VsZWN0YmFzZVwiLCBcImNob2ljZXNPcmRlclwiLCBudWxsLCBcIm5vbmVcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2hvaWNlcyhcInNlbGVjdGJhc2VcIiwgXCJjaG9pY2VzT3JkZXJcIiwgW1wibm9uZVwiLCBcImFzY1wiLCBcImRlc2NcIiwgXCJyYW5kb21cIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInNlbGVjdGJhc2VcIiwgXCJvdGhlclRleHRcIiwgbnVsbCwgUXVlc3Rpb25TZWxlY3RCYXNlLm90aGVySXRlbVRleHQpO1xyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjaGVja2JveGJhc2VcIiwgW1wiY29sQ291bnQ6bnVtYmVyXCJdLCBudWxsLCBcInNlbGVjdGJhc2VcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwiY2hlY2tib3hiYXNlXCIsIFwiY29sQ291bnRcIiwgbnVsbCwgMSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2hvaWNlcyhcImNoZWNrYm94YmFzZVwiLCBcImNvbENvdW50XCIsIFswLCAxLCAyLCAzLCA0XSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94IGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVrb1ZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlID8ga28ub2JzZXJ2YWJsZUFycmF5KHRoaXMudmFsdWUpIDoga28ub2JzZXJ2YWJsZUFycmF5KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRrb1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUoW10uY29uY2F0KG5ld1ZhbHVlKSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUoW10pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBpc090aGVyU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZS5pbmRleE9mKHRoaXMub3RoZXJJdGVtLnZhbHVlKSA+PSAwO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY2hlY2tib3hcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNoZWNrYm94KFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ29tbWVudCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBwdWJsaWMgcm93czogbnVtYmVyID0gNDtcclxuICAgICAgICBwdWJsaWMgY29sczogbnVtYmVyID0gNTA7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiY29tbWVudFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaXNFbXB0eSgpIHx8IHRoaXMudmFsdWUgPT0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY29tbWVudFwiLCBbXCJjb2xzOm51bWJlclwiLCBcInJvd3M6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50KFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcImNvbW1lbnRcIiwgXCJjb2xzXCIsIG51bGwsIDUwKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJjb21tZW50XCIsIFwicm93c1wiLCBudWxsLCA0KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudChuYW1lKTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9zZWxlY3RiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Ecm9wZG93biBleHRlbmRzIFF1ZXN0aW9uU2VsZWN0QmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwiZHJvcGRvd25cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiZHJvcGRvd25cIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkRyb3Bkb3duKFwiXCIpOyB9LCBcInNlbGVjdGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uRHJvcGRvd24obmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERhdGEge1xyXG4gICAgICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvdyk7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4Um93IGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgZGF0YTogSU1hdHJpeERhdGE7XHJcbiAgICAgICAgcHJvdGVjdGVkIHJvd1ZhbHVlOiBhbnk7XHJcbiAgICAgICAga29WYWx1ZTogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZywgZGF0YTogSU1hdHJpeERhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRoaXMucm93VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5yb3dWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHRoaXMuZGF0YS5vbk1hdHJpeFJvd0NoYW5nZWQodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4IGV4dGVuZHMgUXVlc3Rpb24gaW1wbGVtZW50cyBJTWF0cml4RGF0YSB7XHJcbiAgICAgICAgcHVibGljIGNvbHVtbnNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgcm93c1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm1hdHJpeFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1Jvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvd3NWYWx1ZS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY29sdW1ucygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY29sdW1uc1ZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGNvbHVtbnMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jb2x1bW5zVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHJvd3MoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJvd3NWYWx1ZTsgfVxyXG4gICAgICAgIHNldCByb3dzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucm93c1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeFJvdz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PE1hdHJpeFJvdz4oKTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghdGhpcy5yb3dzW2ldLnZhbHVlKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBNYXRyaXhSb3codGhpcy5yb3dzW2ldLnZhbHVlLCB0aGlzLnJvd3NbaV0udGV4dCwgdGhpcy5uYW1lICsgJ18nICsgdGhpcy5yb3dzW2ldLnZhbHVlLnRvU3RyaW5nKCksIHRoaXMsIHZhbFt0aGlzLnJvd3NbaV0udmFsdWVdKSk7IFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKG5ldyBNYXRyaXhSb3cobnVsbCwgXCJcIiwgdGhpcy5uYW1lLCB0aGlzLCB2YWwpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lNYXRyaXhEYXRhXHJcbiAgICAgICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93KSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5oYXNSb3dzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0gcm93LnZhbHVlO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVtyb3cubmFtZV0gPSByb3cudmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhcIiwgW1wiY29sdW1uczppdGVtdmFsdWVzXCIsIFwicm93czppdGVtdmFsdWVzXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NYXRyaXgoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4XCIsIFwiY29sdW1uc1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNvbHVtbnMpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBJdGVtVmFsdWUuc2V0RGF0YShvYmouY29sdW1ucywgdmFsdWUpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtYXRyaXhcIiwgXCJyb3dzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucm93cyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IEl0ZW1WYWx1ZS5zZXREYXRhKG9iai5yb3dzLCB2YWx1ZSk7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NYXRyaXgobmFtZSk7IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuY29sdW1ucyA9IFtcIkNvbHVtbiAxXCIsIFwiQ29sdW1uIDJcIiwgXCJDb2x1bW4gM1wiXTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueTtcclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBNdWx0aXBsZVRleHRJdGVtIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElWYWxpZGF0b3JPd25lciB7XHJcbiAgICAgICAgcHJpdmF0ZSBkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YTtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGlzS09WYWx1ZVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAga29WYWx1ZTogYW55O1xyXG4gICAgICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlLnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIXNlbGYuaXNLT1ZhbHVlVXBkYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2VsZi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dGl0ZW1cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShkYXRhOiBJTXVsdGlwbGVUZXh0RGF0YSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUobmV3VGV4dDogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IG5ld1RleHQ7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5kYXRhID8gdGhpcy5kYXRhLmdldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgb25WYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzS09WYWx1ZVVwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmlzS09WYWx1ZVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JVmFsaWRhdG9yT3duZXJcclxuICAgICAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZTsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk11bHRpcGxlVGV4dCBleHRlbmRzIFF1ZXN0aW9uIGltcGxlbWVudHMgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgICAgIHB1YmxpYyBpdGVtU2l6ZTogbnVtYmVyID0gMjU7XHJcbiAgICAgICAgcHVibGljIGl0ZW1zOiBBcnJheTxNdWx0aXBsZVRleHRJdGVtPiA9IG5ldyBBcnJheTxNdWx0aXBsZVRleHRJdGVtPigpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtdWx0aXBsZXRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEFkZEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE11bHRpcGxlVGV4dEl0ZW0ge1xyXG4gICAgICAgICAgICB2YXIgaXRlbSA9IG5ldyBNdWx0aXBsZVRleHRJdGVtKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG4gICAgICAgICAgICByZXR1cm4gaXRlbTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgb25WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25JdGVtVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRrb1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIuc2V0a29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMub25JdGVtVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1WYWx1ZUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZykgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtVmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudmFsdWUgJiYgKHRoaXMuaXRlbXNbaV0ubmFtZSBpbiB0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW1WYWx1ZSA9IHRoaXMudmFsdWVbdGhpcy5pdGVtc1tpXS5uYW1lXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbXNbaV0ub25WYWx1ZUNoYW5nZWQoaXRlbVZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgcnVuVmFsaWRhdG9ycygpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIHZhciBlcnJvciA9IHN1cGVyLnJ1blZhbGlkYXRvcnMoKTtcclxuICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBWYWxpZGF0b3JSdW5uZXIoKS5ydW4odGhpcy5pdGVtc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgIC8vSU11bHRpcGxlVGV4dERhdGFcclxuICAgICAgICBnZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWVbbmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBbXCJuYW1lXCIsIFwidGl0bGVcIiwgXCJ2YWxpZGF0b3JzOnZhbGlkYXRvcnNcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtKFwiXCIpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8oXCJtdWx0aXBsZXRleHRpdGVtXCIsIFwidmFsaWRhdG9yc1wiLCBcInN1cnZleXZhbGlkYXRvclwiLCBcInZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtdWx0aXBsZXRleHRpdGVtXCIsIFwidGl0bGVcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9KTtcclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwibXVsdGlwbGV0ZXh0XCIsIFtcIiFpdGVtczp0ZXh0aXRlbXNcIiwgXCJpdGVtU2l6ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtdWx0aXBsZXRleHRcIiwgXCJpdGVtc1wiLCBcIm11bHRpcGxldGV4dGl0ZW1cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibXVsdGlwbGV0ZXh0XCIsIFwiaXRlbVNpemVcIiwgbnVsbCwgMjUpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtdWx0aXBsZXRleHRcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHQobmFtZSk7IHEuQWRkSXRlbShcInRleHQxXCIpOyBxLkFkZEl0ZW0oXCJ0ZXh0MlwiKTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25SYWRpb2dyb3VwIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJhZGlvZ3JvdXBcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmFkaW9ncm91cFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxO30pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhdGluZyBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBzdGF0aWMgZGVmYXVsdFJhdGVWYWx1ZXM6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSByYXRlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgbWluaW51bVJhdGVEZXNjcmlwdGlvbjogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgbWF4aW11bVJhdGVEZXNjcmlwdGlvbjogc3RyaW5nID0gbnVsbDtcclxuXHJcbiAgICAgICAga29WaXNpYmxlUmF0ZVZhbHVlczogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmlzaWJsZVJhdGVWYWx1ZXMgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5kdW1teU9ic2VydmFibGUoKTtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VsZi52aXNpYmxlUmF0ZVZhbHVlcztcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCByYXRlVmFsdWVzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5yYXRlczsgfVxyXG4gICAgICAgIHNldCByYXRlVmFsdWVzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucmF0ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUmF0ZVZhbHVlcygpOiBJdGVtVmFsdWVbXSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnJhdGVWYWx1ZXMubGVuZ3RoID4gMCkgcmV0dXJuIHRoaXMucmF0ZVZhbHVlcztcclxuICAgICAgICAgICAgcmV0dXJuIFF1ZXN0aW9uUmF0aW5nLmRlZmF1bHRSYXRlVmFsdWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYXRpbmdcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfSBcclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgfVxyXG4gICAgSXRlbVZhbHVlLnNldERhdGEoUXVlc3Rpb25SYXRpbmcuZGVmYXVsdFJhdGVWYWx1ZXMsIFsxLCAyLCAzLCA0LCA1XSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmF0aW5nXCIsIFtcImhhc0NvbW1lbnQ6Ym9vbGVhblwiLCBcInJhdGVWYWx1ZXM6aXRlbXZhbHVlc1wiLCBcIm1pbmludW1SYXRlRGVzY3JpcHRpb25cIiwgXCJtYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmcoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicmF0aW5nXCIsIFwicmF0ZVZhbHVlc1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJhdGVWYWx1ZXMpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBJdGVtVmFsdWUuc2V0RGF0YShvYmoucmF0ZVZhbHVlcywgdmFsdWUpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmF0aW5nXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmcobmFtZSk7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHQgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHVibGljIHNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHRcIiwgW1wic2l6ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHQoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwidGV4dFwiLCBcInNpemVcIiwgbnVsbCwgMjUpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJ0ZXh0XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0KG5hbWUpOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBUcmlnZ2VyIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgc3RhdGljIG9wZXJhdG9yc1ZhbHVlOiBIYXNoVGFibGU8RnVuY3Rpb24+ID0gbnVsbDtcclxuICAgICAgICBzdGF0aWMgZ2V0IG9wZXJhdG9ycygpIHtcclxuICAgICAgICAgICAgaWYgKFRyaWdnZXIub3BlcmF0b3JzVmFsdWUgIT0gbnVsbCkgcmV0dXJuIFRyaWdnZXIub3BlcmF0b3JzVmFsdWU7XHJcbiAgICAgICAgICAgIFRyaWdnZXIub3BlcmF0b3JzVmFsdWUgPSB7XHJcbiAgICAgICAgICAgICAgICBlbXB0eTogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiAhdmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBub3RlbXB0eTogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiAhKCF2YWx1ZSk7IH0sXHJcbiAgICAgICAgICAgICAgICBlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA9PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgIT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPiBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPD0gZXhwZWN0ZWRWYWx1ZTsgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFUcmlnZ2VyLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGVjayh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25GYWlsdXJlKCkgeyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyIGV4dGVuZHMgVHJpZ2dlciB7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgcGFnZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgcHVibGljIHF1ZXN0aW9uczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldE93bmVyKG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1TdWNjZXNzKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgICAgICBvblRyaWdnZXIoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvYmplY3RzID0gdGhpcy5vd25lci5nZXRPYmplY3RzKHRoaXMucGFnZXMsIHRoaXMucXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jKG9iamVjdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbUZhaWx1cmUoaXRlbTogYW55KSB7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlclZpc2libGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidmlzaWJsZXRyaWdnZXJcIjsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyBpdGVtLnZpc2libGUgPSB0cnVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbUZhaWx1cmUoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRyaWdnZXJcIiwgW1wib3BlcmF0b3JcIiwgXCIhdmFsdWVcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIiwgXCJwYWdlc1wiLCBcInF1ZXN0aW9uc1wiXSwgbnVsbCwgXCJ0cmlnZ2VyXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInZpc2libGV0cmlnZ2VyXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlclZpc2libGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG59IiwibW9kdWxlIHRlbXBsYXRlLmtvIHsgZXhwb3J0IHZhciBodG1sID0gJzxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LWNvbW1lbnRcIj4gIDxpbnB1dCBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cInZhbHVlOiRkYXRhLnF1ZXN0aW9uLmtvQ29tbWVudCwgdmlzaWJsZTokZGF0YS52aXNpYmxlXCIgLz48L3NjcmlwdD48ZGl2IGNsYXNzPVwicGFuZWwtaGVhZGluZ1wiIGRhdGEtYmluZD1cInZpc2libGU6ICh0aXRsZS5sZW5ndGggPiAwKSAmJiBzaG93VGl0bGVcIj4gICAgPGgzIGRhdGEtYmluZD1cInRleHQ6dGl0bGVcIj48L2gzPjwvZGl2PjwhLS0ga28gaWY6IGtvQ3VycmVudFBhZ2UoKSAtLT48ZGl2IGNsYXNzPVwicGFuZWwtYm9keVwiIGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1wYWdlXFwnLCBkYXRhOiBrb0N1cnJlbnRQYWdlIH1cIj48L2Rpdj48ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd05hdmlnYXRpb25CdXR0b25zICYmICFpc0Rlc2lnbk1vZGVcIj4gICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ1dHRvblwiIGRhdGEtYmluZD1cInZhbHVlOiBwYWdlUHJldlRleHQsIGNsaWNrOiBwcmV2UGFnZSwgdmlzaWJsZTogIWtvSXNGaXJzdFBhZ2UoKVwiIC8+ICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidXR0b25cIiB2YWx1ZT1cIk5leHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogcGFnZU5leHRUZXh0LCBjbGljazogbmV4dFBhZ2UsIHZpc2libGU6ICFrb0lzTGFzdFBhZ2UoKVwiIC8+ICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidXR0b25cIiB2YWx1ZT1cIlN1Ym1pdFwiIGRhdGEtYmluZD1cInZhbHVlOiBjb21wbGV0ZVRleHQsIGNsaWNrOiBjb21wbGV0ZUxhc3RQYWdlLCB2aXNpYmxlOiBrb0lzTGFzdFBhZ2UoKVwiIC8+PC9kaXY+PCEtLSAva28gLS0+PCEtLSBrbyBpZjoga29DdXJyZW50UGFnZSgpID09IG51bGwgLS0+PGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4gICAgVGhlcmUgaXMgbm8gYW55IHZpc2libGUgcGFnZSBvciB2aXNpYmxlIHF1ZXN0aW9uIGluIHRoZSBzdXJ2ZXkuPC9kaXY+PCEtLSAva28gLS0+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcGFnZVwiPiAgICA8aDQgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHRpdGxlXCI+PC9oND4gICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnIH0gLS0+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tY2hlY2tib3hcIj4gICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVDaG9pY2VzLCBhczogXFwnaXRlbVxcJywgYWZ0ZXJSZW5kZXI6IHF1ZXN0aW9uLmtvQWZ0ZXJSZW5kZXJ9ICAtLT4gICAgPGxhYmVsIGNsYXNzPVwiY2hlY2tib3gtaW5saW5lXCIgc3R5bGU9XCJtYXJnaW46MFwiIGRhdGEtYmluZD1cInN0eWxlOnt3aWR0aDogcXVlc3Rpb24ua29XaWR0aH1cIj4gICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAgICAgICAgICAgICAgIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiBxdWVzdGlvbi5uYW1lLCB2YWx1ZTogaXRlbS52YWx1ZX0sIGNoZWNrZWQ6IHF1ZXN0aW9uLmtvVmFsdWVcIiAvPiAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDogaXRlbS50ZXh0XCI+PC9zcGFuPiAgICA8L2xhYmVsPiAgICA8IS0tIC9rbyAtLT4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOnF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uLCBcXCd2aXNpYmxlXFwnOiBxdWVzdGlvbi5rb090aGVyVmlzaWJsZSB9IH1cIj48L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tY29tbWVudFwiPiAgICA8dGV4dGFyZWEgdHlwZT1cInRleHRcIiBjbGFzcz1cImZvcm0tY29udHJvbFwiIGRhdGEtYmluZD1cImF0dHI6IHtjb2xzOiBxdWVzdGlvbi5jb2xzLCByb3dzOiBxdWVzdGlvbi5yb3dzfSwgdmFsdWU6cXVlc3Rpb24ua29WYWx1ZVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tZHJvcGRvd25cIj4gICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIG9wdGlvbnNWYWx1ZTogXFwndmFsdWVcXCcsIHZhbHVlOiBxdWVzdGlvbi5rb1ZhbHVlLCBvcHRpb25zQ2FwdGlvbjogXFwnQ2hvb3NlLi4uXFwnXCI+PC9zZWxlY3Q+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tYXRyaXhcIj4gICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIj4gICAgICAgIDx0aGVhZD4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNSb3dzXCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDokZGF0YS50ZXh0XCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGhlYWQ+ICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVSb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzUm93cywgdGV4dDpyb3cudGV4dFwiPjwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiByb3cuZnVsbE5hbWUsIHZhbHVlOiAkZGF0YS52YWx1ZX0sIGNoZWNrZWQ6IHJvdy5rb1ZhbHVlXCIvPiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tdWx0aXBsZXRleHRcIj4gICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiB7IGRhdGE6ICBxdWVzdGlvbi5pdGVtcywgYXM6IFxcJ2l0ZW1cXCcgfVwiPiAgICAgICAgPHRyPiAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRpdGxlXCI+PC90ZD4gICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7c2l6ZTogcXVlc3Rpb24uaXRlbVNpemV9LCB2YWx1ZTogaXRlbS5rb1ZhbHVlXCIgLz48L3RkPiAgICAgICAgPC90cj4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYWRpb2dyb3VwXCI+ICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgYXM6IFxcJ2l0ZW1cXCcsIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb0FmdGVyUmVuZGVyfSAgLS0+ICAgIDxsYWJlbCBjbGFzcz1cInJhZGlvLWlubGluZVwiIHN0eWxlPVwibWFyZ2luOjBcIiBkYXRhLWJpbmQ9XCJzdHlsZTp7d2lkdGg6IHF1ZXN0aW9uLmtvV2lkdGh9XCI+ICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgICAgICAgICAgICAgICAgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHF1ZXN0aW9uLm5hbWUsIHZhbHVlOiBpdGVtLnZhbHVlfSwgY2hlY2tlZDogcXVlc3Rpb24ua29WYWx1ZVwiIC8+ICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRleHRcIj48L3NwYW4+ICAgIDwvbGFiZWw+ICAgIDwhLS0gL2tvIC0tPiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6cXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYXRpbmdcIj4gICAgPGRpdiBjbGFzcz1cImJ0bi1ncm91cFwiIGRhdGEtdG9nZ2xlPVwiYnV0dG9uc1wiPiAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5rb1Zpc2libGVSYXRlVmFsdWVzIC0tPiAgICAgICAgPGxhYmVsIGNsYXNzPVwiYnRuIGJ0bi1kZWZhdWx0XCIgZGF0YS1iaW5kPVwiY3NzOnthY3RpdmU6ICRkYXRhLnZhbHVlID09IHF1ZXN0aW9uLmtvVmFsdWUoKX1cIj4gICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgICAgICAgICAgICAgICAgICAgIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiBxdWVzdGlvbi5uYW1lLCBpZDogcXVlc3Rpb24ubmFtZSArICRpbmRleCgpLCB2YWx1ZTogJGRhdGEudmFsdWV9LCBjaGVja2VkOiBxdWVzdGlvbi5rb1ZhbHVlXCIgLz4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkaW5kZXgoKSA9PSAwLCB0ZXh0OiBxdWVzdGlvbi5taW5pbnVtUmF0ZURlc2NyaXB0aW9uXCI+PC9zcGFuPiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRkYXRhLnRleHRcIj48L3NwYW4+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogJGluZGV4KCkgPT0gKHF1ZXN0aW9uLmtvVmlzaWJsZVJhdGVWYWx1ZXMoKS5sZW5ndGgtMSksIHRleHQ6IHF1ZXN0aW9uLm1heGltdW1SYXRlRGVzY3JpcHRpb25cIj48L3NwYW4+ICAgICAgICA8L2xhYmVsPiAgICAgICAgPCEtLSAva28gLS0+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXRleHRcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7c2l6ZTogcXVlc3Rpb24uc2l6ZX0sIHZhbHVlOnF1ZXN0aW9uLmtvVmFsdWVcIi8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb25cIj4gICAgPGRpdiBjbGFzcz1cIndlbGwgd2VsbC1zbVwiIGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmtvVmlzaWJsZSgpXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwiYWxlcnQgYWxlcnQtZGFuZ2VyXCIgcm9sZT1cImFsZXJ0XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29FcnJvcnMoKS5sZW5ndGggPiAwLCBmb3JlYWNoOiBrb0Vycm9yc1wiPiAgICAgICAgICAgIDxkaXY+ICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiZ2x5cGhpY29uIGdseXBoaWNvbi1leGNsYW1hdGlvbi1zaWduXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+PC9zcGFuPiAgICAgICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhLmdldFRleHQoKVwiPjwvc3Bhbj4gICAgICAgICAgICA8L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPGg1IGRhdGEtYmluZD1cInRleHQ6IHF1ZXN0aW9uLmtvTm8oKSArICAocXVlc3Rpb24uaXNSZXF1aXJlZCA/IHF1ZXN0aW9uLmRhdGEucmVxdWlyZWRUZXh0IDogXFwnXFwnKSArIHF1ZXN0aW9uLnRpdGxlXCI+PC9oNT4gICAgICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uLVxcJyArIHF1ZXN0aW9uLmdldFR5cGUoKSwgZGF0YTogcXVlc3Rpb24gfSAtLT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNDb21tZW50XCI+ICAgICAgICAgICAgT3RoZXIgKHBsZWFzZSBkZXNjcmliZSkgICAgICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInRlbXBsYXRlOiB7IG5hbWU6IFxcJ3N1cnZleS1jb21tZW50XFwnLCBkYXRhOiB7XFwncXVlc3Rpb25cXCc6IHF1ZXN0aW9uLCBcXCd2aXNpYmxlXFwnOiB0cnVlIH0gfVwiPjwvZGl2PiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0Pic7fSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRyaWdnZXIudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZS5rby5odG1sLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImR4U3VydmV5U2VydmljZS50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVN1cnZleSwgSVN1cnZleVRyaWdnZXJPd25lciB7XHJcbiAgICAgICAgcHVibGljIHN1cnZleUlkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlQb3N0SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGNsaWVudElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0T25QYWdlTmV4dDogYm9vbGVhbiA9IGZhbHNlO1xyXG5cclxuICAgICAgICBwdWJsaWMgY29tbWVudFByZWZpeDogc3RyaW5nID0gXCItQ29tbWVudFwiO1xyXG4gICAgICAgIHB1YmxpYyB0aXRsZTogc3RyaW5nID0gXCJcIjtcclxuICAgICAgICBwdWJsaWMgc2hvd05hdmlnYXRpb25CdXR0b25zOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgc2hvd1RpdGxlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgc2hvd1BhZ2VUaXRsZXM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBzaG93UGFnZU51bWJlcnM6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwdWJsaWMgc2hvd1F1ZXN0aW9uTnVtYmVyczogc3RyaW5nID0gXCJvblwiO1xyXG4gICAgICAgIHB1YmxpYyByZXF1aXJlZFRleHQ6IHN0cmluZyA9IFwiKiBcIjtcclxuICAgICAgICBwdWJsaWMgcGFnZVByZXZUZXh0OiBzdHJpbmcgPSBcIlByZXZpb3VzXCI7XHJcbiAgICAgICAgcHVibGljIHBhZ2VOZXh0VGV4dDogc3RyaW5nID0gXCJOZXh0XCI7XHJcbiAgICAgICAgcHVibGljIGNvbXBsZXRlVGV4dDogc3RyaW5nID0gXCJDb21wbGV0ZVwiO1xyXG4gICAgICAgIC8vcHVibGljIHNob3dQcm9ncmVzc0JhcjogYm9vbGVhbiA9IGZhbHNlOyBUT0RPXHJcbiAgICAgICAgcHVibGljIHBhZ2VzOiBBcnJheTxQYWdlPiA9IG5ldyBBcnJheTxQYWdlPigpO1xyXG4gICAgICAgIHB1YmxpYyB0cmlnZ2VyczogQXJyYXk8U3VydmV5VHJpZ2dlcj4gPSBuZXcgQXJyYXk8U3VydmV5VHJpZ2dlcj4oKTtcclxuICAgICAgICBwcml2YXRlIGN1cnJlbnRQYWdlVmFsdWU6IFBhZ2UgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgdmFsdWVzSGFzaDogSGFzaFRhYmxlPGFueT4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNvbXBsZXRlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblJlbmRlcmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvbkN1cnJlbnRQYWdlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uVmFsdWVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUXVlc3Rpb25BZGRlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUXVlc3Rpb25SZW1vdmVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWxpZGF0ZVF1ZXN0aW9uOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25TZW5kUmVzdWx0OiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25HZXRSZXN1bHQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBqc29uRXJyb3JzOiBBcnJheTxKc29uRXJyb3I+ID0gbnVsbDtcclxuXHJcbiAgICAgICAgcHVibGljIG1vZGU6IHN0cmluZyA9IFwibm9ybWFsXCI7XHJcblxyXG4gICAgICAgIGtvQ3VycmVudFBhZ2U6IGFueTsga29Jc0ZpcnN0UGFnZTogYW55OyBrb0lzTGFzdFBhZ2U6IGFueTsgZHVtbXlPYnNlcnZhYmxlOiBhbnk7IFxyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkgPSBudWxsLCByZW5kZXJlZEVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLmRhdGEgPSBzZWxmO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLnNldE93bmVyKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAoa28pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29DdXJyZW50UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuY3VycmVudFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0lzRmlyc3RQYWdlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5pc0ZpcnN0UGFnZTsgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvSXNMYXN0UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuaXNMYXN0UGFnZTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGpzb25PYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SnNvbk9iamVjdChqc29uT2JqKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU3VydmV5RnJvbVNlcnZpY2UodGhpcy5zdXJ2ZXlJZCwgcmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICAgICAgdGhpcy5yZW5kZXIocmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwic3VydmV5XCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGRhdGEoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgZGF0YShkYXRhOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoID0ge307XHJcbiAgICAgICAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtrZXldID0gZGF0YVtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhrZXksIGRhdGFba2V5XSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbW1lbnRzKCk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7fTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMudmFsdWVzSGFzaCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBrZXkuZW5kc1dpdGggPT09ICdmdW5jdGlvbicgJiYga2V5LmVuZHNXaXRoKHRoaXMuY29tbWVudFByZWZpeCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZT4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0Rlc2lnbk1vZGUpIHJldHVybiB0aGlzLnBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PFBhZ2U+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucGFnZXNbaV0uaXNWaXNpYmxlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5wYWdlc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aCA9PSAwOyB9XHJcbiAgICAgICAgZ2V0IFBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUGFnZUNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2libGVQYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjdXJyZW50UGFnZSgpOiBQYWdlIHtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGlmICh2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIDwgMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gbnVsbCAmJiB2UGFnZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1swXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZVZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgY3VycmVudFBhZ2UodmFsdWU6IFBhZ2UpIHtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgIT0gbnVsbCAmJiB2UGFnZXMuaW5kZXhPZih2YWx1ZSkgPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSB0aGlzLmN1cnJlbnRQYWdlVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG9sZFZhbHVlID0gdGhpcy5jdXJyZW50UGFnZVZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgICAgIHRoaXMub25DdXJyZW50UGFnZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdvbGRDdXJyZW50UGFnZSc6IG9sZFZhbHVlLCAnbmV3Q3VycmVudFBhZ2UnOiB2YWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0Rlc2lnbk1vZGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLm1vZGUgPT0gXCJkZXNpZ25lclwiOyB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVLb0N1cnJlbnRQYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSh0aGlzLmR1bW15T2JzZXJ2YWJsZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgbmV4dFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGFzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZW5kUmVzdWx0T25QYWdlTmV4dCAmJiB0aGlzLmNsaWVudElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRSZXN1bHQodGhpcy5zdXJ2ZXlQb3N0SWQsIHRoaXMuY2xpZW50SWQsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbaW5kZXggKyAxXTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBpc0N1cnJlbnRQYWdlSGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2UuaGFzRXJyb3JzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByZXZQYWdlKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0ZpcnN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzW2luZGV4IC0gMV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbXBsZXRlTGFzdFBhZ2UoKSA6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMub25Db21wbGV0ZS5maXJlKHRoaXMsIG51bGwpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zdXJ2ZXlQb3N0SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaXNGaXJzdFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaXNMYXN0UGFnZSgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgcmV0dXJuIHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IHZQYWdlcy5sZW5ndGggLSAxO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXRQYWdlKGluZGV4OiBudW1iZXIpOiBQYWdlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucGFnZXNbaW5kZXhdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBhZGRQYWdlKHBhZ2U6IFBhZ2UpIHtcclxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2gocGFnZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZE5ld1BhZ2UobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gbmV3IFBhZ2UobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbW92ZVBhZ2UocGFnZTogUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnBhZ2VzLmluZGV4T2YocGFnZSk7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5wYWdlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IHBhZ2UpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB0aGlzLnBhZ2VzLmxlbmd0aCA+IDAgPyB0aGlzLnBhZ2VzWzBdIDogbnVsbDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UXVlc3Rpb25CeU5hbWUobmFtZTogc3RyaW5nKTogSVF1ZXN0aW9uIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmKHF1ZXN0aW9uc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiBxdWVzdGlvbnNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRRdWVzdGlvbnNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSk6IElRdWVzdGlvbltdIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gdGhpcy5nZXRRdWVzdGlvbkJ5TmFtZShuYW1lc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocXVlc3Rpb24pIHJlc3VsdC5wdXNoKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZUJ5UXVlc3Rpb24ocXVlc3Rpb246IElRdWVzdGlvbik6IFBhZ2Uge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UucXVlc3Rpb25zLmluZGV4T2YoPFF1ZXN0aW9uPnF1ZXN0aW9uKSA+IC0xKSByZXR1cm4gcGFnZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFBhZ2VCeU5hbWUobmFtZTogc3RyaW5nKTogUGFnZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZXNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSk6IFBhZ2VbXXtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBpZiAoIW5hbWVzKSByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgbmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghbmFtZXNbaV0pIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmdldFBhZ2VCeU5hbWUobmFtZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UpIHJlc3VsdC5wdXNoKHBhZ2UpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRBbGxRdWVzdGlvbnModmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSk6IEFycmF5PElRdWVzdGlvbj4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PElRdWVzdGlvbj4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0uYWRkUXVlc3Rpb25zVG9MaXN0KHJlc3VsdCwgdmlzaWJsZU9ubHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgbm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbnNbaV0ubmFtZSAhPSBuYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5vblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5vblZhbHVlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ25hbWUnOiBuYW1lLCAndmFsdWUnOiBuZXdWYWx1ZSB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9ucyA9IHRoaXMuZ2V0QWxsUXVlc3Rpb25zKCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLmdldFZhbHVlKHF1ZXN0aW9uc1tpXS5uYW1lKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBjaGVja1RyaWdnZXJzKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy50cmlnZ2Vycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMudHJpZ2dlcnNbaV0ubmFtZSA9PSBuYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50cmlnZ2Vyc1tpXS5jaGVjayhuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlbmRlcihlbGVtZW50OiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQgJiYgdHlwZW9mIGVsZW1lbnQgPT0gXCJzdHJpbmdcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChlbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPSBlbGVtZW50O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGVsZW1lbnQgPSB0aGlzLnJlbmRlcmVkRWxlbWVudDtcclxuICAgICAgICAgICAgaWYgKCFlbGVtZW50IHx8IHRoaXMuaXNFbXB0eSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlUmVuZGVyKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQuaW5uZXJIVE1MID0gdGVtcGxhdGUua28uaHRtbDtcclxuICAgICAgICAgICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgc2VsZi5vblJlbmRlcmVkLmZpcmUoc2VsZiwge30pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZyA9IG51bGwsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAocG9zdElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleVBvc3RJZCA9IHBvc3RJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xpZW50SWQgPSBjbGllbnRJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5zZW5kUmVzdWx0KHRoaXMuc3VydmV5UG9zdElkLCB0aGlzLmRhdGEsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uU2VuZFJlc3VsdC5maXJlKHNlbGYsIHsgc3VjY2Vzczogc3VjY2VzcywgcmVzcG9uc2U6IHJlc3BvbnNlfSk7XHJcbiAgICAgICAgICAgIH0sIHRoaXMuY2xpZW50SWQsIGlzUGFydGlhbENvbXBsZXRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbmV3IGR4U3VydmV5U2VydmljZSgpLmdldFJlc3VsdChyZXN1bHRJZCwgbmFtZSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIGRhdGE6IGFueSwgZGF0YUxpc3Q6IGFueVtdLCByZXNwb25zZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLm9uR2V0UmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCBkYXRhOiBkYXRhLCBkYXRhTGlzdDogZGF0YUxpc3QsIHJlc3BvbnNlOiByZXNwb25zZSB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBsb2FkU3VydmV5RnJvbVNlcnZpY2Uoc3VydmV5SWQ6IHN0cmluZyA9IG51bGwsIGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgaWYgKHN1cnZleUlkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnN1cnZleUlkID0gc3VydmV5SWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkubG9hZFN1cnZleSh0aGlzLnN1cnZleUlkLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGlmIChzdWNjZXNzICYmIHJlc3VsdCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYuc2V0SnNvbk9iamVjdChyZXN1bHQpO1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYucmVuZGVyKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgb25CZWZvcmVSZW5kZXIoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBhcHBseUJpbmRpbmcoKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5pc0tPIHx8IHRoaXMucmVuZGVyZWRFbGVtZW50ID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgICAgIGtvLmNsZWFuTm9kZSh0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy5yZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVZpc2libGVJbmRleGVzKCkge1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVBhZ2VWaXNpYmxlSW5kZXhlcyh0aGlzLnNob3dQYWdlTnVtYmVycyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNob3dRdWVzdGlvbk51bWJlcnMgPT0gXCJvblBhZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHZpc1BhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZpc1BhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHZpc1BhZ2VzW2ldLnF1ZXN0aW9ucywgdHJ1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXModGhpcy5nZXRBbGxRdWVzdGlvbnMoZmFsc2UpLCB0aGlzLnNob3dRdWVzdGlvbk51bWJlcnMgPT0gXCJvblwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVBhZ2VWaXNpYmxlSW5kZXhlcyhzaG93SW5kZXg6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLnZpc2libGVJbmRleCA9IHRoaXMucGFnZXNbaV0udmlzaWJsZSA/IChpbmRleCsrKSA6IC0xO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5udW0gPSBzaG93SW5kZXggJiYgdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggKyAxIDogLTE7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHF1ZXN0aW9uczogSVF1ZXN0aW9uW10sIHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLnNldFZpc2libGVJbmRleChzaG93SW5kZXggJiYgcXVlc3Rpb25zW2ldLnZpc2libGUgPyAoaW5kZXgrKykgOiAtMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBzZXRKc29uT2JqZWN0KGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIWpzb25PYmopIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5qc29uRXJyb3JzID0gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGpzb25Db252ZXJ0ZXIgPSBuZXcgSnNvbk9iamVjdCgpO1xyXG4gICAgICAgICAgICBqc29uQ29udmVydGVyLnRvT2JqZWN0KGpzb25PYmosIHRoaXMpO1xyXG4gICAgICAgICAgICBpZiAoanNvbkNvbnZlcnRlci5lcnJvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5qc29uRXJyb3JzID0ganNvbkNvbnZlcnRlci5lcnJvcnM7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICAvL0lTdXJ2ZXkgZGF0YVxyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmRhdGFbbmFtZSArIHRoaXMuY29tbWVudFByZWZpeF07XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXg7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXN0aW9uQWRkZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICdpbmRleCc6IGluZGV4IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvblJlbW92ZWQocXVlc3Rpb246IElRdWVzdGlvbikge1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlc3Rpb25SZW1vdmVkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFsaWRhdGVRdWVzdGlvbihuYW1lOiBzdHJpbmcpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5pc0VtcHR5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIG9wdGlvbnMgPSB7IG5hbWU6IG5hbWUsIHZhbHVlOiB0aGlzLmdldFZhbHVlKG5hbWUpLCBlcnJvcjogbnVsbCB9O1xyXG4gICAgICAgICAgICB0aGlzLm9uVmFsaWRhdGVRdWVzdGlvbi5maXJlKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgICAgICAgICByZXR1cm4gb3B0aW9ucy5lcnJvciA/IG5ldyBDdXN0b21FcnJvcihvcHRpb25zLmVycm9yKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVN1cnZleVRyaWdnZXJPd25lclxyXG4gICAgICAgIGdldE9iamVjdHMocGFnZXM6IHN0cmluZ1tdLCBxdWVzdGlvbnM6IHN0cmluZ1tdKTogYW55W117XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFBhZ2VzQnlOYW1lcyhwYWdlcykpO1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UXVlc3Rpb25zQnlOYW1lcyhxdWVzdGlvbnMpKTtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleVwiLCBbXCJ0aXRsZVwiLCBcInBhZ2VzXCIsIFwicXVlc3Rpb25zXCIsIFwidHJpZ2dlcnM6dHJpZ2dlcnNcIiwgXCJzdXJ2ZXlJZFwiLCBcInN1cnZleVBvc3RJZFwiLCBcInNlbmRSZXN1bHRPblBhZ2VOZXh0OmJvb2xlYW5cIixcclxuICAgICAgICBcInNob3dOYXZpZ2F0aW9uQnV0dG9uczpib29sZWFuXCIsIFwic2hvd1RpdGxlOmJvb2xlYW5cIiwgXCJzaG93UGFnZVRpdGxlczpib29sZWFuXCIsIFwic2hvd1BhZ2VOdW1iZXJzOmJvb2xlYW5cIiwgXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsXHJcbiAgICAgICAgXCJyZXF1aXJlZFRleHRcIiwgXCJwYWdlUHJldlRleHRcIiwgXCJwYWdlTmV4dFRleHRcIiwgXCJjb21wbGV0ZVRleHRcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInBhZ2VzXCIsIFwicGFnZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJxdWVzdGlvbnNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBudWxsOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmosIHZhbHVlLCBqc29uQ29udmVydGVyKSB7XHJcbiAgICAgICAgICAgIHZhciBwYWdlID0gb2JqLmFkZE5ld1BhZ2UoXCJcIik7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoeyBxdWVzdGlvbnM6IHZhbHVlIH0sIHBhZ2UpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInNob3dOYXZpZ2F0aW9uQnV0dG9uc1wiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJzaG93VGl0bGVcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1BhZ2VUaXRsZXNcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBudWxsLCBcIm9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJzdXJ2ZXlcIiwgXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIFtcIm9uXCIsIFwib25QYWdlXCIsIFwib2ZmXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJyZXF1aXJlZFRleHRcIiwgbnVsbCwgXCIqIFwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJwYWdlUHJldlRleHRcIiwgbnVsbCwgXCJQcmV2aW91c1wiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJwYWdlTmV4dFRleHRcIiwgbnVsbCwgXCJOZXh0XCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcImNvbXBsZXRlVGV4dFwiLCBudWxsLCBcIkNvbXBsZXRlXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcInN1cnZleVwiLCBcInRyaWdnZXJzXCIsIFwic3VydmV5dHJpZ2dlclwiLCBcInRyaWdnZXJcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwic3VydmV5XCIsIFwicXVlc3Rpb25zXCIsIFwicXVlc3Rpb25cIik7XHJcbn0iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlXaW5kb3cgZXh0ZW5kcyBCYXNlICB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzdXJ2ZXlFbGVtZW50TmFtZSA9IFwid2luZG93U3VydmV5SlNcIjtcclxuICAgICAgICBzdXJ2ZXlWYWx1ZTogU3VydmV5O1xyXG4gICAgICAgIHdpbmRvd0VsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICAgIGlzU2hvd2luZ1ZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIGlzRXhwYW5kZWRWYWx1ZTogYm9vbGVhbjtcclxuICAgICAgICB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgdGVtcGxhdGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGtvRXhwYW5kZWQ6IGFueTtcclxuICAgICAgICBkb0V4cGFuZDogYW55O1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUgPSBuZXcgU3VydmV5KGpzb25PYmopO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlLnNob3dUaXRsZSA9IGZhbHNlO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyOiBTdXJ2ZXkpID0+IHsgc2VsZi5vbkNvbXBsZXRlKCk7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd0VsZW1lbnQgPSA8SFRNTERpdkVsZW1lbnQ+ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0V4cGFuZGVkID0ga28ub2JzZXJ2YWJsZShmYWxzZSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRvRXhwYW5kID0gZnVuY3Rpb24gKCkgeyBzZWxmLmNoYW5nZUV4cGFuZGVkKCk7IH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpIDogc3RyaW5nIHsgcmV0dXJuIFwid2luZG93XCIgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleSB7IHJldHVybiB0aGlzLnN1cnZleVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc1Nob3dpbmcoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzU2hvd2luZ1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBpc0V4cGFuZGVkKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5pc0V4cGFuZGVkVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRpdGxlVmFsdWUgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLnN1cnZleS50aXRsZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdGl0bGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzaG93KCkge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd0VsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICBrby5hcHBseUJpbmRpbmdzKHRoaXMsIHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd0VsZW1lbnQpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5yZW5kZXIoU3VydmV5V2luZG93LnN1cnZleUVsZW1lbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5pc1Nob3dpbmdWYWx1ZSA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBoaWRlKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd2luZ1ZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBleHBhbmQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UodHJ1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjb2xsYXBzZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZShmYWxzZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgdGVtcGxhdGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGVtcGxhdGVWYWx1ZSA/IHRoaXMudGVtcGxhdGVWYWx1ZSA6IHRlbXBsYXRlLndpbmRvdy5rby5odG1sOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldCB0ZW1wbGF0ZSh2YWx1ZTogc3RyaW5nKSB7ICB0aGlzLnRlbXBsYXRlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHByaXZhdGUgZXhwYW5kY29sbGFwc2UodmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy5pc0V4cGFuZGVkVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0V4cGFuZGVkKHRoaXMuaXNFeHBhbmRlZFZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoYW5nZUV4cGFuZGVkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKCF0aGlzLmlzRXhwYW5kZWQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9uQ29tcGxldGUoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaGlkZSgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSB0ZW1wbGF0ZS53aW5kb3cua28geyBleHBvcnQgdmFyIGh0bWwgPSAnPGRpdiBjbGFzcz1cIm1vZGFsLWNvbnRlbnRcIiBzdHlsZT1cInBvc2l0aW9uOiBmaXhlZDsgYm90dG9tOiAzcHg7IHJpZ2h0OiAxMHB4O1wiPiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtaGVhZGVyXCI+PGEgaHJlZj1cIiNcIiBkYXRhLWJpbmQ9XCJjbGljazpkb0V4cGFuZFwiIHN0eWxlPVwid2lkdGg6MTAwJVwiPjxzcGFuIGRhdGEtYmluZD1cInRleHQ6dGl0bGVcIj48L3NwYW4+PC9hPjwvZGl2PiAgICA8ZGl2IGNsYXNzPVwibW9kYWwtYm9keVwiIGRhdGEtYmluZD1cInZpc2libGU6a29FeHBhbmRlZFwiPiAgICAgICAgPGRpdiBjbGFzcz1cInN2X3dpbmRvd19jb250ZW50XCIgaWQ9XCJ3aW5kb3dTdXJ2ZXlKU1wiPjwvZGl2PiAgICA8L2Rpdj48L2Rpdj4nO30iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwidGVtcGxhdGUua28uaHRtbC50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUZW1wbGF0ZVRleHRCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlcGxhY2VUZXh0KHJlcGxhY2VUZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIHF1ZXN0aW9uVHlwZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZCA9IHRoaXMuZ2V0SWQoaWQsIHF1ZXN0aW9uVHlwZSk7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLnRleHQuaW5kZXhPZihpZCk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKCc+JywgcG9zKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0UG9zID0gcG9zICsgMTtcclxuICAgICAgICAgICAgdmFyIGVuZFN0cmluZyA9IFwiPC9zY3JpcHQ+XCI7XHJcbiAgICAgICAgICAgIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKGVuZFN0cmluZywgc3RhcnRQb3MpO1xyXG4gICAgICAgICAgICBpZiAocG9zIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0aGlzLnRleHQuc3Vic3RyKDAsIHN0YXJ0UG9zKSArIHJlcGxhY2VUZXh0ICsgdGhpcy50ZXh0LnN1YnN0cihwb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0SWQoaWQ6IHN0cmluZywgcXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICdpZD1cInN1cnZleS0nICsgaWQ7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvblR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIi1cIiArIHF1ZXN0aW9uVHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ICsgJ1wiJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHsgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUZW1wbGF0ZVRleHQgZXh0ZW5kcyBTdXJ2ZXlUZW1wbGF0ZVRleHRCYXNlIHtcclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRlbXBsYXRlLmtvLmh0bWw7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHRleHQodmFsdWU6IHN0cmluZykgeyB0ZW1wbGF0ZS5rby5odG1sID0gdmFsdWU7IH1cclxuICAgIH1cclxufVxyXG4iXSwic291cmNlUm9vdCI6InNyYyJ9
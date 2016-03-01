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
        ko.html = '<script type="text/html" id="survey-comment">  <input data-bind="value:$data.question.koComment, visible:$data.visible" /></script><div class="sv_main">    <h2 data-bind="visible: (title.length > 0) && showTitle, text: title"></h2>    <!-- ko if: koCurrentPage() -->    <div data-bind="template: { name: \'survey-page\', data: koCurrentPage }"></div>    <p />    <div class="sv_nav" data-bind="visible: showNavigationButtons && !isDesignMode">        <input type="button" data-bind="value: pagePrevText, click: prevPage, visible: !koIsFirstPage()" />  <input type="button" value="Next" data-bind="value: pageNextText, click: nextPage, visible: !koIsLastPage()" />  <input type="button" value="Submit" data-bind="value: completeText, click: completeLastPage, visible: koIsLastPage()" />    </div>    <!-- /ko -->    <!-- ko if: koCurrentPage() == null -->    There is no any visible page or visible question in the survey.    <!-- /ko --></div><script type="text/html" id="survey-page">    <div class="sv_p_title" data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + title"></div>    <!-- ko foreach: { data: questions, as: \'question\' } -->        <!-- ko template: { name: \'survey-question\', data: question } -->        <!-- /ko -->    <!-- /ko --></script><script type="text/html" id="survey-question-checkbox">    <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->    <div class="sv_qcbc"  data-bind="style:{width: question.koWidth}">            <label class="sv_q_checkbox">                <input type="checkbox"                       data-bind="value: item.value, checked: question.koValue" />                <span data-bind="text: item.text"></span>            </label>    </div>    <!-- /ko -->    <div data-bind="if:question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-comment">    <textarea type="text" data-bind="attr: {cols: question.cols, rows: question.rows}, value:question.koValue" /></script><script type="text/html" id="survey-question-dropdown">    <select data-bind="options: question.visibleChoices, optionsText: \'text\', optionsValue: \'value\', value: question.koValue, optionsCaption: \'Choose...\'"></select>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-matrix">    <table class="sv_q_matrix">        <thead>            <tr>                <th data-bind="visible: question.hasRows"></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="visible: question.hasRows, text:row.text"></td>                <!-- ko foreach: question.columns -->                <td>                    <input type="radio" data-bind="attr: {name: row.fullName, value: $data.value}, checked: row.koValue"/>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-multipletext">    <table data-bind="foreach: { data:  question.items, as: \'item\' }">        <tr>            <td data-bind="text: item.title"></td>            <td><input type="text" data-bind="attr: {size: question.itemSize}, value: item.koValue" /></td>        </tr>    </table></script><script type="text/html" id="survey-question-radiogroup">    <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->    <div class="sv_qcbc"  data-bind="style:{width: question.koWidth}">        <label class="sv_q_radiogroup">            <input type="radio" data-bind="name: question.name, attr: {value: item.value}, checked: question.koValue" />            <span data-bind="text: item.text"></span>        </label>    </div>    <!-- /ko -->    <div data-bind="if:question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-rating">    <table class="sv_q_rating">        <thead>            <tr>                <th></th>                <!-- ko foreach: question.koVisibleRateValues -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->                <th></th>            </tr>        </thead>        <tbody>            <tr>                <td data-bind="text:question.mininumRateDescription"></td>                <!-- ko foreach: question.koVisibleRateValues -->                <td>                    <input type="radio" data-bind="attr: {name: question.name, value: $data.value}, checked: question.koValue" />                </td>                <!-- /ko -->                <td data-bind="text:question.maximumRateDescription"></td>            </tr>        </tbody>    </table>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question } }"></div>    </div></script><script type="text/html" id="survey-question-text">    <input type="text" data-bind="attr: {size: question.size}, value:question.koValue"/></script><script type="text/html" id="survey-question">    <div class="sv_q" data-bind="visible: question.koVisible()">        <div class="sv_q_erbox" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div data-bind="text:$data.getText()"></div>        </div>        <div class="sv_q_title" data-bind="text: question.koNo() +  (question.isRequired ? question.data.requiredText : \'\') + question.title"></div>        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            Other (please describe)            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>    </div></script>';
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
            ko.html = '<div class="sv_window">    <div class="sv_window_title"><a href="#" data-bind="click:doExpand" style="width:100%"><span data-bind="text:title"></span></a></div>    <div data-bind="visible:koExpanded">        <div class="sv_window_content" id="windowSurveyJS"></div>    </div></div>';
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

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2UudHMiLCJkeFN1cnZleVNlcnZpY2UudHMiLCJlcnJvci50cyIsImpzb25vYmplY3QudHMiLCJxdWVzdGlvbmZhY3RvcnkudHMiLCJ2YWxpZGF0b3IudHMiLCJxdWVzdGlvbi50cyIsInBhZ2UudHMiLCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzIiwicXVlc3Rpb25fY2hlY2tib3gudHMiLCJxdWVzdGlvbl9jb21tZW50LnRzIiwicXVlc3Rpb25fZHJvcGRvd24udHMiLCJxdWVzdGlvbl9tYXRyaXgudHMiLCJxdWVzdGlvbl9tdWx0aXBsZXRleHQudHMiLCJxdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwicXVlc3Rpb25fcmF0aW5nLnRzIiwicXVlc3Rpb25fdGV4dC50cyIsInRyaWdnZXIudHMiLCJ0ZW1wbGF0ZS5rby5odG1sLnRzIiwic3VydmV5LnRzIiwic3VydmV5V2luZG93LnRzIiwidGVtcGxhdGUud2luZG93LmtvLmh0bWwudHMiLCJ0ZW1wbGF0ZVRleHQudHMiXSwibmFtZXMiOlsiU3VydmV5IiwiU3VydmV5Lkl0ZW1WYWx1ZSIsIlN1cnZleS5JdGVtVmFsdWUuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSXRlbVZhbHVlLnNldERhdGEiLCJTdXJ2ZXkuSXRlbVZhbHVlLmdldERhdGEiLCJTdXJ2ZXkuSXRlbVZhbHVlLmdldFR5cGUiLCJTdXJ2ZXkuSXRlbVZhbHVlLnZhbHVlIiwiU3VydmV5Lkl0ZW1WYWx1ZS5oYXNUZXh0IiwiU3VydmV5Lkl0ZW1WYWx1ZS50ZXh0IiwiU3VydmV5LkJhc2UiLCJTdXJ2ZXkuQmFzZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5CYXNlLmdldFR5cGUiLCJTdXJ2ZXkuU3VydmV5RXJyb3IiLCJTdXJ2ZXkuU3VydmV5RXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5RXJyb3IuZ2V0VGV4dCIsIlN1cnZleS5FdmVudCIsIlN1cnZleS5FdmVudC5jb25zdHJ1Y3RvciIsIlN1cnZleS5FdmVudC5pc0VtcHR5IiwiU3VydmV5LkV2ZW50LmZpcmUiLCJTdXJ2ZXkuRXZlbnQuYWRkIiwiU3VydmV5LkV2ZW50LnJlbW92ZSIsIlN1cnZleS5keFN1cnZleVNlcnZpY2UiLCJTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlLmNvbnN0cnVjdG9yIiwiU3VydmV5LmR4U3VydmV5U2VydmljZS5sb2FkU3VydmV5IiwiU3VydmV5LmR4U3VydmV5U2VydmljZS5zZW5kUmVzdWx0IiwiU3VydmV5LmR4U3VydmV5U2VydmljZS5nZXRSZXN1bHQiLCJTdXJ2ZXkuZHhTdXJ2ZXlTZXJ2aWNlLmlzQ29tcGxldGVkIiwiU3VydmV5LkFuc3dlclJlcXVpcmVkRXJyb3IiLCJTdXJ2ZXkuQW5zd2VyUmVxdWlyZWRFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5BbnN3ZXJSZXF1aXJlZEVycm9yLmdldFRleHQiLCJTdXJ2ZXkuUmVxdXJlTnVtZXJpY0Vycm9yIiwiU3VydmV5LlJlcXVyZU51bWVyaWNFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5SZXF1cmVOdW1lcmljRXJyb3IuZ2V0VGV4dCIsIlN1cnZleS5DdXN0b21FcnJvciIsIlN1cnZleS5DdXN0b21FcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5DdXN0b21FcnJvci5nZXRUZXh0IiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eSIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LnR5cGUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5Lmhhc1RvVXNlR2V0VmFsdWUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmlzRGVmYXVsdFZhbHVlIiwiU3VydmV5Lkpzb25PYmplY3RQcm9wZXJ0eS5nZXRWYWx1ZSIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuaGFzVG9Vc2VTZXRWYWx1ZSIsIlN1cnZleS5Kc29uT2JqZWN0UHJvcGVydHkuc2V0VmFsdWUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmdldE9ialR5cGUiLCJTdXJ2ZXkuSnNvbk9iamVjdFByb3BlcnR5LmdldENsYXNzTmFtZSIsIlN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcyIsIlN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcy5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uTWV0YWRhdGFDbGFzcy5maW5kIiwiU3VydmV5Lkpzb25NZXRhZGF0YUNsYXNzLmdldFByb3BlcnR5TmFtZSIsIlN1cnZleS5Kc29uTWV0YWRhdGEiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5hZGRDbGFzcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuc2V0UHJvcGVydHlWYWx1ZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLnNldFByb3BlcnR5Q2hvaWNlcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8iLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmdldFByb3BlcnRpZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmNyZWF0ZUNsYXNzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmdldFJlcXVpcmVkUHJvcGVydGllcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZmlsbENoaWxkcmVuQ2xhc3NlcyIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZmluZENsYXNzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5maW5kUHJvcGVydHkiLCJTdXJ2ZXkuSnNvbk1ldGFkYXRhLmZpbGxQcm9wZXJ0aWVzIiwiU3VydmV5Lkpzb25NZXRhZGF0YS5hZGRQcm9wZXJ0eSIsIlN1cnZleS5Kc29uTWV0YWRhdGEuZmlsbFJlcXVpcmVkUHJvcGVydGllcyIsIlN1cnZleS5Kc29uRXJyb3IiLCJTdXJ2ZXkuSnNvbkVycm9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25FcnJvci5nZXRGdWxsRGVzY3JpcHRpb24iLCJTdXJ2ZXkuSnNvblVua25vd25Qcm9wZXJ0eUVycm9yIiwiU3VydmV5Lkpzb25Vbmtub3duUHJvcGVydHlFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uTWlzc2luZ1R5cGVFcnJvckJhc2UiLCJTdXJ2ZXkuSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25NaXNzaW5nVHlwZUVycm9yIiwiU3VydmV5Lkpzb25NaXNzaW5nVHlwZUVycm9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25JbmNvcnJlY3RUeXBlRXJyb3IiLCJTdXJ2ZXkuSnNvbkluY29ycmVjdFR5cGVFcnJvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5Kc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yIiwiU3VydmV5Lkpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuSnNvbk9iamVjdCIsIlN1cnZleS5Kc29uT2JqZWN0LmNvbnN0cnVjdG9yIiwiU3VydmV5Lkpzb25PYmplY3QubWV0YURhdGEiLCJTdXJ2ZXkuSnNvbk9iamVjdC50b0pzb25PYmplY3QiLCJTdXJ2ZXkuSnNvbk9iamVjdC50b09iamVjdCIsIlN1cnZleS5Kc29uT2JqZWN0LnRvSnNvbk9iamVjdENvcmUiLCJTdXJ2ZXkuSnNvbk9iamVjdC52YWx1ZVRvSnNvbiIsIlN1cnZleS5Kc29uT2JqZWN0LnZhbHVlVG9PYmoiLCJTdXJ2ZXkuSnNvbk9iamVjdC5pc1ZhbHVlQXJyYXkiLCJTdXJ2ZXkuSnNvbk9iamVjdC5jcmVhdGVOZXdPYmoiLCJTdXJ2ZXkuSnNvbk9iamVjdC5jaGVja05ld09iamVjdE9uRXJyb3JzIiwiU3VydmV5Lkpzb25PYmplY3QuYWRkTmV3RXJyb3IiLCJTdXJ2ZXkuSnNvbk9iamVjdC52YWx1ZVRvQXJyYXkiLCJTdXJ2ZXkuSnNvbk9iamVjdC5maW5kUHJvcGVydHkiLCJTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5IiwiU3VydmV5LlF1ZXN0aW9uRmFjdG9yeS5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbkZhY3RvcnkucmVnaXN0ZXJRdWVzdGlvbiIsIlN1cnZleS5RdWVzdGlvbkZhY3RvcnkuZ2V0QWxsVHlwZXMiLCJTdXJ2ZXkuUXVlc3Rpb25GYWN0b3J5LmNyZWF0ZVF1ZXN0aW9uIiwiU3VydmV5LlZhbGlkYXRvclJlc3VsdCIsIlN1cnZleS5WYWxpZGF0b3JSZXN1bHQuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5VmFsaWRhdG9yIiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlWYWxpZGF0b3IuZ2V0RXJyb3JUZXh0IiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci5nZXREZWZhdWx0RXJyb3JUZXh0IiwiU3VydmV5LlN1cnZleVZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5WYWxpZGF0b3JSdW5uZXIiLCJTdXJ2ZXkuVmFsaWRhdG9yUnVubmVyLmNvbnN0cnVjdG9yIiwiU3VydmV5LlZhbGlkYXRvclJ1bm5lci5ydW4iLCJTdXJ2ZXkuTnVtZXJpY1ZhbGlkYXRvciIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLmNvbnN0cnVjdG9yIiwiU3VydmV5Lk51bWVyaWNWYWxpZGF0b3IuZ2V0VHlwZSIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLnZhbGlkYXRlIiwiU3VydmV5Lk51bWVyaWNWYWxpZGF0b3IuZ2V0RGVmYXVsdEVycm9yVGV4dCIsIlN1cnZleS5OdW1lcmljVmFsaWRhdG9yLmlzTnVtYmVyIiwiU3VydmV5LlRleHRWYWxpZGF0b3IiLCJTdXJ2ZXkuVGV4dFZhbGlkYXRvci5jb25zdHJ1Y3RvciIsIlN1cnZleS5UZXh0VmFsaWRhdG9yLmdldFR5cGUiLCJTdXJ2ZXkuVGV4dFZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5UZXh0VmFsaWRhdG9yLmdldERlZmF1bHRFcnJvclRleHQiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IuY29uc3RydWN0b3IiLCJTdXJ2ZXkuQW5zd2VyQ291bnRWYWxpZGF0b3IuZ2V0VHlwZSIsIlN1cnZleS5BbnN3ZXJDb3VudFZhbGlkYXRvci52YWxpZGF0ZSIsIlN1cnZleS5BbnN3ZXJDb3VudFZhbGlkYXRvci5nZXREZWZhdWx0RXJyb3JUZXh0IiwiU3VydmV5LlF1ZXN0aW9uIiwiU3VydmV5LlF1ZXN0aW9uLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uLmNyZWF0ZWtvVmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24uc2V0a29WYWx1ZSIsIlN1cnZleS5RdWVzdGlvbi50aXRsZSIsIlN1cnZleS5RdWVzdGlvbi5zdXBwb3J0Q29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5zdXBwb3J0T3RoZXIiLCJTdXJ2ZXkuUXVlc3Rpb24uaXNSZXF1aXJlZCIsIlN1cnZleS5RdWVzdGlvbi52aXNpYmxlIiwiU3VydmV5LlF1ZXN0aW9uLnZpc2libGVJbmRleCIsIlN1cnZleS5RdWVzdGlvbi5oYXNDb21tZW50IiwiU3VydmV5LlF1ZXN0aW9uLmhhc090aGVyIiwiU3VydmV5LlF1ZXN0aW9uLnNldERhdGEiLCJTdXJ2ZXkuUXVlc3Rpb24udmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24uY29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5pc0VtcHR5IiwiU3VydmV5LlF1ZXN0aW9uLmhhc0Vycm9ycyIsIlN1cnZleS5RdWVzdGlvbi5jaGVja0ZvckVycm9ycyIsIlN1cnZleS5RdWVzdGlvbi5vbkNoZWNrRm9yRXJyb3JzIiwiU3VydmV5LlF1ZXN0aW9uLnJ1blZhbGlkYXRvcnMiLCJTdXJ2ZXkuUXVlc3Rpb24uc2V0TmV3VmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb24ub25WYWx1ZUNoYW5nZWQiLCJTdXJ2ZXkuUXVlc3Rpb24uc2V0TmV3Q29tbWVudCIsIlN1cnZleS5RdWVzdGlvbi5vbkNyZWF0aW5nIiwiU3VydmV5LlF1ZXN0aW9uLm9uU3VydmV5VmFsdWVDaGFuZ2VkIiwiU3VydmV5LlF1ZXN0aW9uLnNldFZpc2libGVJbmRleCIsIlN1cnZleS5RdWVzdGlvbi5nZXRWYWxpZGF0b3JUaXRsZSIsIlN1cnZleS5QYWdlIiwiU3VydmV5LlBhZ2UuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUGFnZS5udW0iLCJTdXJ2ZXkuUGFnZS5nZXRUeXBlIiwiU3VydmV5LlBhZ2UuaXNWaXNpYmxlIiwiU3VydmV5LlBhZ2UuYWRkUXVlc3Rpb24iLCJTdXJ2ZXkuUGFnZS5hZGROZXdRdWVzdGlvbiIsIlN1cnZleS5QYWdlLnJlbW92ZVF1ZXN0aW9uIiwiU3VydmV5LlBhZ2UuaGFzRXJyb3JzIiwiU3VydmV5LlBhZ2UuYWRkUXVlc3Rpb25zVG9MaXN0IiwiU3VydmV5LlBhZ2Uub25DcmVhdGluZyIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2UiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5pc090aGVyU2VsZWN0ZWQiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLmNob2ljZXMiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLmNob2ljZXNPcmRlciIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uub3RoZXJUZXh0IiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS52aXNpYmxlQ2hvaWNlcyIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uuc3VwcG9ydENvbW1lbnQiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLnN1cHBvcnRPdGhlciIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uub25DaGVja0ZvckVycm9ycyIsIlN1cnZleS5RdWVzdGlvblNlbGVjdEJhc2Uuc29ydFZpc2libGVDaG9pY2VzIiwiU3VydmV5LlF1ZXN0aW9uU2VsZWN0QmFzZS5zb3J0QXJyYXkiLCJTdXJ2ZXkuUXVlc3Rpb25TZWxlY3RCYXNlLnJhbmRvbWl6ZUFycmF5IiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlLmNvbENvdW50IiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3hCYXNlLmtvQWZ0ZXJSZW5kZXIiLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveCIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94LmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uQ2hlY2tib3guY3JlYXRla29WYWx1ZSIsIlN1cnZleS5RdWVzdGlvbkNoZWNrYm94LnNldGtvVmFsdWUiLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveC5pc090aGVyU2VsZWN0ZWQiLCJTdXJ2ZXkuUXVlc3Rpb25DaGVja2JveC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uQ29tbWVudCIsIlN1cnZleS5RdWVzdGlvbkNvbW1lbnQuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25Db21tZW50LmdldFR5cGUiLCJTdXJ2ZXkuUXVlc3Rpb25Db21tZW50LmlzRW1wdHkiLCJTdXJ2ZXkuUXVlc3Rpb25Ecm9wZG93biIsIlN1cnZleS5RdWVzdGlvbkRyb3Bkb3duLmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uRHJvcGRvd24uZ2V0VHlwZSIsIlN1cnZleS5NYXRyaXhSb3ciLCJTdXJ2ZXkuTWF0cml4Um93LmNvbnN0cnVjdG9yIiwiU3VydmV5Lk1hdHJpeFJvdy52YWx1ZSIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeCIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5jb25zdHJ1Y3RvciIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uTWF0cml4Lmhhc1Jvd3MiLCJTdXJ2ZXkuUXVlc3Rpb25NYXRyaXguY29sdW1ucyIsIlN1cnZleS5RdWVzdGlvbk1hdHJpeC5yb3dzIiwiU3VydmV5LlF1ZXN0aW9uTWF0cml4LnZpc2libGVSb3dzIiwiU3VydmV5LlF1ZXN0aW9uTWF0cml4Lm9uTWF0cml4Um93Q2hhbmdlZCIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0uY29uc3RydWN0b3IiLCJTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbS5nZXRUeXBlIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0uc2V0RGF0YSIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtLnRpdGxlIiwiU3VydmV5Lk11bHRpcGxlVGV4dEl0ZW0udmFsdWUiLCJTdXJ2ZXkuTXVsdGlwbGVUZXh0SXRlbS5vblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5NdWx0aXBsZVRleHRJdGVtLmdldFZhbGlkYXRvclRpdGxlIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0IiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LmdldFR5cGUiLCJTdXJ2ZXkuUXVlc3Rpb25NdWx0aXBsZVRleHQuQWRkSXRlbSIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5vblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5zZXRrb1ZhbHVlIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0Lm9uSXRlbVZhbHVlQ2hhbmdlZCIsIlN1cnZleS5RdWVzdGlvbk11bHRpcGxlVGV4dC5ydW5WYWxpZGF0b3JzIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LmdldE11bHRpcGxlVGV4dFZhbHVlIiwiU3VydmV5LlF1ZXN0aW9uTXVsdGlwbGVUZXh0LnNldE11bHRpcGxlVGV4dFZhbHVlIiwiU3VydmV5LlF1ZXN0aW9uUmFkaW9ncm91cCIsIlN1cnZleS5RdWVzdGlvblJhZGlvZ3JvdXAuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25SYWRpb2dyb3VwLmdldFR5cGUiLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmciLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcuY29uc3RydWN0b3IiLCJTdXJ2ZXkuUXVlc3Rpb25SYXRpbmcucmF0ZVZhbHVlcyIsIlN1cnZleS5RdWVzdGlvblJhdGluZy52aXNpYmxlUmF0ZVZhbHVlcyIsIlN1cnZleS5RdWVzdGlvblJhdGluZy5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uUmF0aW5nLnN1cHBvcnRDb21tZW50IiwiU3VydmV5LlF1ZXN0aW9uUmF0aW5nLnN1cHBvcnRPdGhlciIsIlN1cnZleS5RdWVzdGlvblRleHQiLCJTdXJ2ZXkuUXVlc3Rpb25UZXh0LmNvbnN0cnVjdG9yIiwiU3VydmV5LlF1ZXN0aW9uVGV4dC5nZXRUeXBlIiwiU3VydmV5LlF1ZXN0aW9uVGV4dC5pc0VtcHR5IiwiU3VydmV5LlRyaWdnZXIiLCJTdXJ2ZXkuVHJpZ2dlci5jb25zdHJ1Y3RvciIsIlN1cnZleS5UcmlnZ2VyLm9wZXJhdG9ycyIsIlN1cnZleS5UcmlnZ2VyLm9wZXJhdG9yIiwiU3VydmV5LlRyaWdnZXIuY2hlY2siLCJTdXJ2ZXkuVHJpZ2dlci5vblN1Y2Nlc3MiLCJTdXJ2ZXkuVHJpZ2dlci5vbkZhaWx1cmUiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlciIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyLmNvbnN0cnVjdG9yIiwiU3VydmV5LlN1cnZleVRyaWdnZXIuc2V0T3duZXIiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vblN1Y2Nlc3MiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vbkZhaWx1cmUiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vblRyaWdnZXIiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlci5vbkl0ZW1TdWNjZXNzIiwiU3VydmV5LlN1cnZleVRyaWdnZXIub25JdGVtRmFpbHVyZSIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZSIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlUcmlnZ2VyVmlzaWJsZS5nZXRUeXBlIiwiU3VydmV5LlN1cnZleVRyaWdnZXJWaXNpYmxlLm9uSXRlbVN1Y2Nlc3MiLCJTdXJ2ZXkuU3VydmV5VHJpZ2dlclZpc2libGUub25JdGVtRmFpbHVyZSIsInRlbXBsYXRlIiwidGVtcGxhdGUua28iLCJTdXJ2ZXkuU3VydmV5IiwiU3VydmV5LlN1cnZleS5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXkuZ2V0VHlwZSIsIlN1cnZleS5TdXJ2ZXkuZGF0YSIsIlN1cnZleS5TdXJ2ZXkuY29tbWVudHMiLCJTdXJ2ZXkuU3VydmV5LnZpc2libGVQYWdlcyIsIlN1cnZleS5TdXJ2ZXkuaXNFbXB0eSIsIlN1cnZleS5TdXJ2ZXkuUGFnZUNvdW50IiwiU3VydmV5LlN1cnZleS52aXNpYmxlUGFnZUNvdW50IiwiU3VydmV5LlN1cnZleS5jdXJyZW50UGFnZSIsIlN1cnZleS5TdXJ2ZXkuaXNEZXNpZ25Nb2RlIiwiU3VydmV5LlN1cnZleS51cGRhdGVLb0N1cnJlbnRQYWdlIiwiU3VydmV5LlN1cnZleS5uZXh0UGFnZSIsIlN1cnZleS5TdXJ2ZXkuaXNDdXJyZW50UGFnZUhhc0Vycm9ycyIsIlN1cnZleS5TdXJ2ZXkucHJldlBhZ2UiLCJTdXJ2ZXkuU3VydmV5LmNvbXBsZXRlTGFzdFBhZ2UiLCJTdXJ2ZXkuU3VydmV5LmlzRmlyc3RQYWdlIiwiU3VydmV5LlN1cnZleS5pc0xhc3RQYWdlIiwiU3VydmV5LlN1cnZleS5nZXRQYWdlIiwiU3VydmV5LlN1cnZleS5hZGRQYWdlIiwiU3VydmV5LlN1cnZleS5hZGROZXdQYWdlIiwiU3VydmV5LlN1cnZleS5yZW1vdmVQYWdlIiwiU3VydmV5LlN1cnZleS5nZXRRdWVzdGlvbkJ5TmFtZSIsIlN1cnZleS5TdXJ2ZXkuZ2V0UXVlc3Rpb25zQnlOYW1lcyIsIlN1cnZleS5TdXJ2ZXkuZ2V0UGFnZUJ5UXVlc3Rpb24iLCJTdXJ2ZXkuU3VydmV5LmdldFBhZ2VCeU5hbWUiLCJTdXJ2ZXkuU3VydmV5LmdldFBhZ2VzQnlOYW1lcyIsIlN1cnZleS5TdXJ2ZXkuZ2V0QWxsUXVlc3Rpb25zIiwiU3VydmV5LlN1cnZleS5ub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkIiwiU3VydmV5LlN1cnZleS5ub3RpZnlBbGxRdWVzdGlvbnNPblZhbHVlQ2hhbmdlZCIsIlN1cnZleS5TdXJ2ZXkuY2hlY2tUcmlnZ2VycyIsIlN1cnZleS5TdXJ2ZXkucmVuZGVyIiwiU3VydmV5LlN1cnZleS5zZW5kUmVzdWx0IiwiU3VydmV5LlN1cnZleS5nZXRSZXN1bHQiLCJTdXJ2ZXkuU3VydmV5LmxvYWRTdXJ2ZXlGcm9tU2VydmljZSIsIlN1cnZleS5TdXJ2ZXkub25CZWZvcmVSZW5kZXIiLCJTdXJ2ZXkuU3VydmV5LmFwcGx5QmluZGluZyIsIlN1cnZleS5TdXJ2ZXkudXBkYXRlVmlzaWJsZUluZGV4ZXMiLCJTdXJ2ZXkuU3VydmV5LnVwZGF0ZVBhZ2VWaXNpYmxlSW5kZXhlcyIsIlN1cnZleS5TdXJ2ZXkudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyIsIlN1cnZleS5TdXJ2ZXkuc2V0SnNvbk9iamVjdCIsIlN1cnZleS5TdXJ2ZXkub25DcmVhdGluZyIsIlN1cnZleS5TdXJ2ZXkuZ2V0VmFsdWUiLCJTdXJ2ZXkuU3VydmV5LnNldFZhbHVlIiwiU3VydmV5LlN1cnZleS5nZXRDb21tZW50IiwiU3VydmV5LlN1cnZleS5zZXRDb21tZW50IiwiU3VydmV5LlN1cnZleS5xdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkIiwiU3VydmV5LlN1cnZleS5xdWVzdGlvbkFkZGVkIiwiU3VydmV5LlN1cnZleS5xdWVzdGlvblJlbW92ZWQiLCJTdXJ2ZXkuU3VydmV5LnZhbGlkYXRlUXVlc3Rpb24iLCJTdXJ2ZXkuU3VydmV5LmdldE9iamVjdHMiLCJTdXJ2ZXkuU3VydmV5V2luZG93IiwiU3VydmV5LlN1cnZleVdpbmRvdy5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuZ2V0VHlwZSIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuc3VydmV5IiwiU3VydmV5LlN1cnZleVdpbmRvdy5pc1Nob3dpbmciLCJTdXJ2ZXkuU3VydmV5V2luZG93LmlzRXhwYW5kZWQiLCJTdXJ2ZXkuU3VydmV5V2luZG93LnRpdGxlIiwiU3VydmV5LlN1cnZleVdpbmRvdy5zaG93IiwiU3VydmV5LlN1cnZleVdpbmRvdy5oaWRlIiwiU3VydmV5LlN1cnZleVdpbmRvdy5leHBhbmQiLCJTdXJ2ZXkuU3VydmV5V2luZG93LmNvbGxhcHNlIiwiU3VydmV5LlN1cnZleVdpbmRvdy50ZW1wbGF0ZSIsIlN1cnZleS5TdXJ2ZXlXaW5kb3cuZXhwYW5kY29sbGFwc2UiLCJTdXJ2ZXkuU3VydmV5V2luZG93LmNoYW5nZUV4cGFuZGVkIiwiU3VydmV5LlN1cnZleVdpbmRvdy5vbkNvbXBsZXRlIiwidGVtcGxhdGUud2luZG93IiwidGVtcGxhdGUud2luZG93LmtvIiwiU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dEJhc2UiLCJTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0QmFzZS5jb25zdHJ1Y3RvciIsIlN1cnZleS5TdXJ2ZXlUZW1wbGF0ZVRleHRCYXNlLnJlcGxhY2VUZXh0IiwiU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dEJhc2UuZ2V0SWQiLCJTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0QmFzZS50ZXh0IiwiU3VydmV5LlN1cnZleVRlbXBsYXRlVGV4dCIsIlN1cnZleS5TdXJ2ZXlUZW1wbGF0ZVRleHQuY29uc3RydWN0b3IiLCJTdXJ2ZXkuU3VydmV5VGVtcGxhdGVUZXh0LnRleHQiXSwibWFwcGluZ3MiOiJBQUFBLElBQU8sTUFBTSxDQW1IWjtBQW5IRCxXQUFPLE1BQU0sRUFBQyxDQUFDO0lBc0JYQTtRQThCSUMsbUJBQVlBLEtBQVVBLEVBQUVBLElBQW1CQTtZQUFuQkMsb0JBQW1CQSxHQUFuQkEsV0FBbUJBO1lBQ3ZDQSxJQUFJQSxDQUFDQSxJQUFJQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUNqQkEsSUFBSUEsQ0FBQ0EsS0FBS0EsR0FBR0EsS0FBS0EsQ0FBQ0E7UUFDdkJBLENBQUNBO1FBL0JhRCxpQkFBT0EsR0FBckJBLFVBQXNCQSxLQUF1QkEsRUFBRUEsTUFBa0JBO1lBQzdERSxLQUFLQSxDQUFDQSxNQUFNQSxHQUFHQSxDQUFDQSxDQUFDQTtZQUNqQkEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsTUFB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QSxFQUFFQSxHQUFRQTtZQUNsQ0ksRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsT0FBT0EsQ0FBQ0E7Z0JBQUNBLE1BQU1BLENBQUNBO1lBQ3JCQSxJQUFJQSxVQUFVQSxHQUFHQSxJQUFJQSxDQUFDQTtZQUN0QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsT0FBT0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2RBLFVBQVVBLEdBQUdBLFVBQVVBLENBQUNBLFFBQVFBLENBQUNBLGFBQWFBLENBQUNBLEdBQUdBLENBQUNBLE9BQU9BLEVBQUVBLENBQUNBLENBQUNBO1lBQ2xFQSxDQUFDQTtZQUNEQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQSxVQUFVQSxDQUFDQTtnQkFBQ0EsTUFBTUEsQ0FBQ0E7WUFDeEJBLEdBQUdBLENBQUNBLENBQUNBLEdBQUdBLENBQUNBLEdBQUdBLElBQUlBLE9BQU9BLENBQUNBLENBQUNBLENBQUNBO2dCQUN0QkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsR0FBR0EsSUFBSUEsVUFBVUEsQ0FBQ0EsZ0JBQWdCQSxDQUFDQTtvQkFBQ0EsUUFBUUEsQ0FBQ0E7Z0JBQ2pEQSxFQUFFQSxDQUFDQSxDQUFDQSxHQUFHQSxJQUFJQSxVQUFVQSxDQUFDQSxvQkFBb0JBLENBQUNBLENBQUNBLENBQUNBO29CQUN6Q0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsT0FBT0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0E7b0JBQ3hCQSxRQUFRQSxDQUFDQTtnQkFDYkEsQ0FBQ0E7Z0JBQ0RBLElBQUlBLFFBQVFBLEdBQUdBLElBQUlBLENBQUNBLFlBQVlBLENBQUNBLFVBQVVBLEVBQUVBLEdBQUdBLENBQUNBLENBQUNBO2dCQUNsREEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7b0JBQ1pBLElBQUlBLENBQUNBLFdBQVdBLENBQUNBLElBQUlBLHdCQUF3QkEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsUUFBUUEsRUFBRUEsRUFBRUEsR0FBR0EsQ0FBQ0Es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QkEsQ0FBQ0E7UUFDT1gsaUNBQVlBLEdBQXBCQSxVQUFxQkEsS0FBaUJBLEVBQUVBLEdBQVFBLEVBQUVBLEdBQVFBLEVBQUVBLFFBQTRCQTtZQUNwRlksRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsWUFBWUEsQ0FBQ0EsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQy9CQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNsQkEsQ0FBQ0E7WUFDREEsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsRUFBRUEsQ0FBQ0EsR0FBR0EsS0FBS0EsQ0FBQ0EsTUFBTUEsRUFBRUEsQ0FBQ0EsRUFBRUEsRUFBRUEsQ0FBQ0E7Z0JBQ3BDQSxJQUFJQSxRQUFRQSxHQUFHQSxJQUFJQSxDQUFDQSxZQUFZQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxRQUFRQSxDQUFDQSxDQUFDQTtnQkFDckRBLEVBQUVBLENBQUNBLENBQUNBLFFBQVFBLENBQUNBLE1BQU1BLENBQUNBLENBQUNBLENBQUNBO29CQUNsQkEsR0FBR0EsQ0FBQ0EsR0FBR0EsQ0FBQ0EsQ0FBQ0EsSUFBSUEsQ0FBQ0EsUUFBUUEsQ0FBQ0EsTUFBTUEsQ0FBQ0EsQ0FBQ0E7b0JBQy9CQSxJQUFJQSxDQUFDQSxRQUFRQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxFQUFFQSxRQUFRQSxDQUFDQSxNQUFNQSxDQUFDQSxDQUFDQTtnQkFDN0NBLENBQUNBO2dCQUFDQSxJQUFJQSxDQUFDQSxDQUFDQTtvQkFDSkEsRUFBRUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0EsUUFBUUEsQ0FBQ0EsS0FBS0EsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7d0JBQ2xCQSxHQUFHQSxDQUFDQSxHQUFHQSxDQUFDQSxDQUFDQSxJQUFJQSxDQUFDQSxLQUFLQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQSxDQUFDQTtvQkFDNUJBLENB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UUFDcEZBLENBQUNBO1FBQ1NGLHNDQUFLQSxHQUFmQSxVQUFnQkEsRUFBVUEsRUFBRUEsWUFBb0JBO1lBQzVDRyxJQUFJQSxNQUFNQSxHQUFHQSxhQUFhQSxHQUFHQSxFQUFFQSxDQUFDQTtZQUNoQ0EsRUFBRUEsQ0FBQ0EsQ0FBQ0EsWUFBWUEsQ0FBQ0EsQ0FBQ0EsQ0FBQ0E7Z0JBQ2ZBLE1BQU1BLElBQUlBLEdBQUdBLEdBQUdBLFlBQVlBLENBQUNBO1lBQ2pDQSxDQUFDQTtZQUNEQSxNQUFNQSxDQUFDQSxNQUFNQSxHQUFHQSxHQUFHQSxDQUFDQTtRQUN4QkEsQ0FBQ0E7UUFDREgsc0JBQWNBLHdDQUFJQTtpQkFBbEJBLGNBQStCSSxNQUFNQSxDQUFDQSxFQUFFQSxDQUFDQSxDQUFDQSxDQUFDQTtpQkFDM0NKLFVBQW1CQSxLQUFhQSxJQUFLSSxDQUFDQTs7O1dBREtKO1FBRS9DQSw2QkFBQ0E7SUFBREEsQ0F4QkFyVSxBQXdCQ3FVLElBQUFyVTtJQXhCWUEsNkJBQXNCQSx5QkF3QmxDQSxDQUFBQTtJQUNEQTtRQUF3QzBVLHNDQUFzQkE7UUFBOURBO1lBQXdDQyw4QkFBc0JBO1FBRzlEQSxDQUFDQTtRQUZHRCxzQkFBY0Esb0NBQUlBO2lCQUFsQkEsY0FBK0JFLE1BQU1BLENBQUNBLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLENBQUNBLENBQUNBLENBQUNBO2lCQUN6REYsVUFBbUJBLEtBQWFBLElBQUlFLFFBQVFBLENBQUNBLEVBQUVBLENBQUNBLElBQUlBLEdBQUdBLEtBQUtBLENBQUNBLENBQUNBLENBQUNBOzs7V0FETkY7UUFFN0RBLHlCQUFDQTtJQUFEQSxDQUhBMVUsQUFHQzBVLEVBSHVDMVUsc0JBQXNCQSxFQUc3REE7SUFIWUEseUJBQWtCQSxxQkFHOUJBLENBQUFBO0FBQ0xBLENBQUNBLEVBOUJNLE1BQU0sS0FBTixNQUFNLFFBOEJaIiwiZmlsZSI6InN1cnZleS5qcyIsInNvdXJjZXNDb250ZW50IjpbIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBIYXNoVGFibGU8VD4ge1xyXG4gICAgICAgIFtrZXk6IHN0cmluZ106IFQ7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdXJ2ZXkge1xyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueTtcclxuICAgICAgICBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpO1xyXG4gICAgICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nO1xyXG4gICAgICAgIHNldENvbW1lbnQobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogc3RyaW5nKTtcclxuICAgICAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKTtcclxuICAgICAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpO1xyXG4gICAgICAgIHF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogSVF1ZXN0aW9uKTtcclxuICAgICAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yO1xyXG4gICAgICAgIGlzRGVzaWduTW9kZTogYm9vbGVhbjtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVF1ZXN0aW9uIHtcclxuICAgICAgICBuYW1lOiBzdHJpbmc7XHJcbiAgICAgICAgdmlzaWJsZTogYm9vbGVhbjtcclxuICAgICAgICBzZXRWaXNpYmxlSW5kZXgodmFsdWU6IG51bWJlcik7XHJcbiAgICAgICAgb25TdXJ2ZXlWYWx1ZUNoYW5nZWQobmV3VmFsdWU6IGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEl0ZW1WYWx1ZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTZXBhcmF0b3IgPSAnfCc7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWx1ZXM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgaXRlbXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IEl0ZW1WYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlLnZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB2YWx1ZVtcInRleHRcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlW1widmFsdWVcIl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaGFzVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgdmFsdWU6IGl0ZW0udmFsdWUsIHRleHQ6IGl0ZW0udGV4dCB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIGl0ZW1UZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgdGV4dDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIml0ZW12YWx1ZVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5pdGVtVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RyOiBzdHJpbmcgPSB0aGlzLml0ZW1WYWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzdHIuaW5kZXhPZihJdGVtVmFsdWUuU2VwYXJhdG9yKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gc3RyLnNsaWNlKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHN0ci5zbGljZShpbmRleCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVGV4dCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXRlbVRleHQgPyB0cnVlIDogZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzVGV4dCkgcmV0dXJuIHRoaXMuaXRlbVRleHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlKSByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KG5ld1RleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1UZXh0ID0gbmV3VGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2Uge1xyXG4gICAgICAgIGlzS08gPSB0eXBlb2Yga28gIT09ICd1bmRlZmluZWQnO1xyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50PFQgZXh0ZW5kcyBGdW5jdGlvbiwgT3B0aW9ucz4gIHtcclxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrczogQXJyYXk8VD47XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5jYWxsYmFja3MgPT0gbnVsbCB8fCB0aGlzLmNhbGxiYWNrcy5sZW5ndGggPT0gMDsgfVxyXG4gICAgICAgIHB1YmxpYyBmaXJlKHNlbmRlcjogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja3MubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbFJlc3VsdCA9IHRoaXMuY2FsbGJhY2tzW2ldKHNlbmRlciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGQoZnVuYzogVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgQXJyYXk8VD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlKGZ1bmM6IFQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jYWxsYmFja3MuaW5kZXhPZihmdW5jLCAwKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIGR4U3VydmV5U2VydmljZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHBzOi8vZHhzdXJ2ZXkuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL1N1cnZleVwiO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6NDk4OTEvYXBpL1N1cnZleVwiO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbG9hZFN1cnZleShzdXJ2ZXlJZDogc3RyaW5nLCBvbkxvYWQ6IChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0U3VydmV5P3N1cnZleUlkPScgKyBzdXJ2ZXlJZCk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgb25Mb2FkKHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nLCByZXN1bHQ6IEpTT04sIG9uU2VuZFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpPT4gdm9pZCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvcG9zdC8nKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0geyBwb3N0SWQ6IHBvc3RJZCwgc3VydmV5UmVzdWx0OiBKU09OLnN0cmluZ2lmeShyZXN1bHQpIH07XHJcbiAgICAgICAgICAgIGlmIChjbGllbnRJZCkgZGF0YVsnY2xpZW50SWQnXSA9IGNsaWVudElkO1xyXG4gICAgICAgICAgICBpZiAoaXNQYXJ0aWFsQ29tcGxldGVkKSBkYXRhWydpc1BhcnRpYWxDb21wbGV0ZWQnXSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBkYXRhU3RyaW5naWZ5OiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZGF0YVN0cmluZ2lmeS5sZW5ndGgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIG9uU2VuZFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoZGF0YVN0cmluZ2lmeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBvbkdldFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIGRhdGE6IGFueSwgZGF0YUxpc3Q6IEFycmF5PGFueT4sIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJm5hbWU9JyArIG5hbWU7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0UmVzdWx0PycgKyBkYXRhKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXN1bHQuUXVlc3Rpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0geyBuYW1lOiBrZXksIHZhbHVlOiByZXN1bHQuUXVlc3Rpb25SZXN1bHRba2V5XSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9uR2V0UmVzdWx0KHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIGxpc3QsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBpc0NvbXBsZXRlZChyZXN1bHRJZDogc3RyaW5nLCBjbGllbnRJZDogc3RyaW5nLCBvbklzQ29tcGxldGVkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJmNsaWVudElkPScgKyBjbGllbnRJZDtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9pc0NvbXBsZXRlZD8nICsgZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb25Jc0NvbXBsZXRlZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgQW5zd2VyUmVxdWlyZWRFcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpICB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIllvdSBzaG91bGQgYW5zd2VyIHRoZSBxdWVzdGlvbi5cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUmVxdXJlTnVtZXJpY0Vycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VGV4dCgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJUaGUgdmFsdWUgc2hvdWxkIGJlIGEgbnVtZXJpYy5cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgQ3VzdG9tRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgcHJpdmF0ZSB0ZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IodGV4dDogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICBwcml2YXRlIHR5cGVWYWx1ZTogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGFzc05hbWVQYXJ0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXM6IEFycmF5PGFueT4gPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBvbkdldFZhbHVlOiAob2JqOiBhbnkpID0+IGFueSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG9uU2V0VmFsdWU6IChvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpID0+IGFueVxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50eXBlVmFsdWUgPyB0aGlzLnR5cGVWYWx1ZSA6IFwic3RyaW5nXCI7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHR5cGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnR5cGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBoYXNUb1VzZUdldFZhbHVlKCkgeyByZXR1cm4gdGhpcy5vbkdldFZhbHVlOyB9IFxyXG4gICAgICAgIHB1YmxpYyBpc0RlZmF1bHRWYWx1ZSh2YWx1ZTogYW55KTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAodGhpcy5kZWZhdWx0VmFsdWUpID8gKHRoaXMuZGVmYXVsdFZhbHVlID09IHZhbHVlKSA6ICEodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VmFsdWUob2JqOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vbkdldFZhbHVlKSByZXR1cm4gdGhpcy5vbkdldFZhbHVlKG9iaik7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlU2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uU2V0VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0VmFsdWUob2JqOiBhbnksIHZhbHVlOiBhbnksIGpzb25Db252OiBKc29uT2JqZWN0KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uU2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TZXRWYWx1ZShvYmosIHZhbHVlLCBqc29uQ29udik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldE9ialR5cGUob2JqVHlwZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5jbGFzc05hbWVQYXJ0KSByZXR1cm4gb2JqVHlwZTtcclxuICAgICAgICAgICAgcmV0dXJuIG9ialR5cGUucmVwbGFjZSh0aGlzLmNsYXNzTmFtZVBhcnQsIFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q2xhc3NOYW1lKGNsYXNzTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmNsYXNzTmFtZVBhcnQgJiYgY2xhc3NOYW1lLmluZGV4T2YodGhpcy5jbGFzc05hbWVQYXJ0KSA8IDApID8gY2xhc3NOYW1lICsgdGhpcy5jbGFzc05hbWVQYXJ0IDogY2xhc3NOYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgc3RhdGljIHJlcXVpcmVkU3ltYm9sID0gJyEnO1xyXG4gICAgICAgIHN0YXRpYyB0eXBlU3ltYm9sID0gJzonO1xyXG4gICAgICAgIHByb3BlcnRpZXM6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4gPSBudWxsO1xyXG4gICAgICAgIHJlcXVpcmVkUHJvcGVydGllczogQXJyYXk8c3RyaW5nPiA9IG51bGw7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZywgcHJvcGVydGllc05hbWVzOiBBcnJheTxzdHJpbmc+LCBwdWJsaWMgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcHVibGljIHBhcmVudE5hbWU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzID0gbmV3IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzTmFtZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0aWVzTmFtZXNbaV07XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlUeXBlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIHZhciB0eXBlSW5kZXggPSBwcm9wZXJ0eU5hbWUuaW5kZXhPZihKc29uTWV0YWRhdGFDbGFzcy50eXBlU3ltYm9sKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlSW5kZXggPiAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5VHlwZSA9IHByb3BlcnR5TmFtZS5zdWJzdHJpbmcodHlwZUluZGV4ICsgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcGVydHlOYW1lID0gcHJvcGVydHlOYW1lLnN1YnN0cmluZygwLCB0eXBlSW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5TmFtZSA9IHRoaXMuZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcCA9IG5ldyBKc29uT2JqZWN0UHJvcGVydHkocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0eVR5cGUpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wLnR5cGUgPSBwcm9wZXJ0eVR5cGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnByb3BlcnRpZXMucHVzaChwcm9wKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZmluZChuYW1lOiBzdHJpbmcpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucHJvcGVydGllc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnByb3BlcnRpZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZ2V0UHJvcGVydHlOYW1lKHByb3BlcnR5TmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5TmFtZS5sZW5ndGggPT0gMCB8fCBwcm9wZXJ0eU5hbWVbMF0gIT0gSnNvbk1ldGFkYXRhQ2xhc3MucmVxdWlyZWRTeW1ib2wpIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zbGljZSgxKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzLnB1c2gocHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHByb3BlcnR5TmFtZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhIHtcclxuICAgICAgICBwcml2YXRlIGNsYXNzZXM6IEhhc2hUYWJsZTxKc29uTWV0YWRhdGFDbGFzcz4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGNoaWxkcmVuQ2xhc3NlczogSGFzaFRhYmxlPEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPj4gPSB7fTtcclxuICAgICAgICBwcml2YXRlIGNsYXNzUHJvcGVydGllczogSGFzaFRhYmxlPEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc1JlcXVpcmVkUHJvcGVydGllczogSGFzaFRhYmxlPEFycmF5PHN0cmluZz4+ID0ge307XHJcbiAgICAgICAgcHVibGljIGFkZENsYXNzKG5hbWU6IHN0cmluZywgcHJvcGVydGllc05hbWVzOiBBcnJheTxzdHJpbmc+LCBjcmVhdG9yOiAoKSA9PiBhbnkgPSBudWxsLCBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKTogSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IG5ldyBKc29uTWV0YWRhdGFDbGFzcyhuYW1lLCBwcm9wZXJ0aWVzTmFtZXMsIGNyZWF0b3IsIHBhcmVudE5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNsYXNzZXNbbmFtZV0gPSBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgICAgICBpZiAocGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNoaWxkcmVuID0gdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGlsZHJlbkNsYXNzZXNbcGFyZW50TmFtZV0gPSBbXTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdLnB1c2gobWV0YURhdGFDbGFzcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3M7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRQcm9wZXJ0eVZhbHVlcyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eUNsYXNzTmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwsIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbCwgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmNsYXNzTmFtZSA9IHByb3BlcnR5Q2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5Lm9uR2V0VmFsdWUgPSBvbkdldFZhbHVlO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5vblNldFZhbHVlID0gb25TZXRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFByb3BlcnR5Q2hvaWNlcyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBjaG9pY2VzOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0eSA9IHRoaXMuZmluZFByb3BlcnR5KG5hbWUsIHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHJldHVybjtcclxuICAgICAgICAgICAgcHJvcGVydHkuY2hvaWNlcyA9IGNob2ljZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRQcm9wZXJ0eUNsYXNzSW5mbyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcsIGNsYXNzTmFtZVBhcnQ6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkobmFtZSwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lID0gYmFzZUNsYXNzTmFtZTtcclxuICAgICAgICAgICAgcHJvcGVydHkuY2xhc3NOYW1lUGFydCA9IGNsYXNzTmFtZVBhcnQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZyk6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4ge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NQcm9wZXJ0aWVzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHByb3BlcnRpZXMgPSBuZXcgQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PigpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUHJvcGVydGllcyhuYW1lLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NQcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydGllcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNyZWF0ZUNsYXNzKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICghbWV0YURhdGFDbGFzcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzLmNyZWF0b3IoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldENoaWxkcmVuQ2xhc3NlcyhuYW1lOiBzdHJpbmcsIGNhbkJlQ3JlYXRlZDogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLmZpbGxDaGlsZHJlbkNsYXNzZXMobmFtZSwgY2FuQmVDcmVhdGVkLCByZXN1bHQpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZyk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxzdHJpbmc+KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxSZXF1aXJlZFByb3BlcnRpZXMobmFtZSwgcHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsYXNzUmVxdWlyZWRQcm9wZXJ0aWVzW25hbWVdID0gcHJvcGVydGllcztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcHJvcGVydGllcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaWxsQ2hpbGRyZW5DbGFzc2VzKG5hbWU6IHN0cmluZywgY2FuQmVDcmVhdGVkOiBib29sZWFuLCByZXN1bHQ6IEFycmF5PEpzb25NZXRhZGF0YUNsYXNzPikge1xyXG4gICAgICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIWNhbkJlQ3JlYXRlZCB8fCBjaGlsZHJlbltpXS5jcmVhdG9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goY2hpbGRyZW5baV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsQ2hpbGRyZW5DbGFzc2VzKGNoaWxkcmVuW2ldLm5hbWUsIGNhbkJlQ3JlYXRlZCwgcmVzdWx0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRDbGFzcyhuYW1lOiBzdHJpbmcpOiBKc29uTWV0YWRhdGFDbGFzcyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmNsYXNzZXNbbmFtZV07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmluZFByb3BlcnR5KG5hbWU6IHN0cmluZywgcHJvcGVydHlOYW1lOiBzdHJpbmcpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gbWV0YURhdGFDbGFzcyA/IG1ldGFEYXRhQ2xhc3MuZmluZChwcm9wZXJ0eU5hbWUpIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaWxsUHJvcGVydGllcyhuYW1lOiBzdHJpbmcsIGxpc3Q6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4pIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFByb3BlcnRpZXMobWV0YURhdGFDbGFzcy5wYXJlbnROYW1lLCBsaXN0KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1ldGFEYXRhQ2xhc3MucHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGRQcm9wZXJ0eShtZXRhRGF0YUNsYXNzLnByb3BlcnRpZXNbaV0sIGxpc3QsIGxpc3QubGVuZ3RoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZFByb3BlcnR5KHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHksIGxpc3Q6IEFycmF5PEpzb25PYmplY3RQcm9wZXJ0eT4sIGVuZEluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gLTE7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZW5kSW5kZXg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGxpc3RbaV0ubmFtZSA9PSBwcm9wZXJ0eS5uYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaW5kZXggPSBpO1xyXG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IFxyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2gocHJvcGVydHkpXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBsaXN0W2luZGV4XSA9IHByb3BlcnR5O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmlsbFJlcXVpcmVkUHJvcGVydGllcyhuYW1lOiBzdHJpbmcsIGxpc3Q6IEFycmF5PHN0cmluZz4pIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkobGlzdCwgbWV0YURhdGFDbGFzcy5yZXF1aXJlZFByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFJlcXVpcmVkUHJvcGVydGllcyhtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUsIGxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25FcnJvciB7XHJcbiAgICAgICAgcHVibGljIGRlc2NyaXB0aW9uOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBhdDogTnVtYmVyID0gLTE7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0RnVsbERlc2NyaXB0aW9uKCkgOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5tZXNzYWdlICsgKHRoaXMuZGVzY3JpcHRpb24gPyBcIlxcblwiICsgdGhpcy5kZXNjcmlwdGlvbiA6IFwiXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uVW5rbm93blByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwidW5rbm93bnByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBpbiBjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicgaXMgdW5rbm93bi5cIik7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJUaGUgbGlzdCBvZiBhdmFpbGFibGUgcHJvcGVydGllcyBhcmU6IFwiO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLCBcIjtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IHByb3BlcnRpZXNbaV0ubmFtZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gJy4nO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZywgcHVibGljIHR5cGU6IHN0cmluZywgcHVibGljIG1lc3NhZ2U6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcih0eXBlLCBtZXNzYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiA9IFwiVGhlIGZvbGxvd2luZyB0eXBlcyBhcmUgYXZhaWxhYmxlOiBcIjtcclxuICAgICAgICAgICAgdmFyIHR5cGVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRDaGlsZHJlbkNsYXNzZXMoYmFzZUNsYXNzTmFtZSwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdHlwZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChpID4gMCkgdGhpcy5kZXNjcmlwdGlvbiArPSBcIiwgXCI7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uICs9IFwiJ1wiICsgdHlwZXNbaV0ubmFtZSArIFwiJ1wiO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NaXNzaW5nVHlwZUVycm9yIGV4dGVuZHMgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcHJvcGVydHlOYW1lOiBzdHJpbmcsIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoYmFzZUNsYXNzTmFtZSwgXCJtaXNzaW5ndHlwZXByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5IHR5cGUgaXMgbWlzc2luZyBpbiB0aGUgb2JqZWN0LiBQbGVhc2UgdGFrZSBhIGxvb2sgYXQgcHJvcGVydHk6ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25JbmNvcnJlY3RUeXBlRXJyb3IgZXh0ZW5kcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcImluY29ycmVjdHR5cGVwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSB0eXBlIGlzIGluY29ycmVjdCBpbiB0aGUgb2JqZWN0LiBQbGVhc2UgdGFrZSBhIGxvb2sgYXQgcHJvcGVydHk6ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJy5cIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IgZXh0ZW5kcyBKc29uRXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKFwicmVxdWlyZWRwcm9wZXJ0eVwiLCBcIlRoZSBwcm9wZXJ0eSAnXCIgKyBwcm9wZXJ0eU5hbWUgKyBcIicgaXMgcmVxdWlyZWQgaW4gY2xhc3MgJ1wiICsgY2xhc3NOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25PYmplY3Qge1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHR5cGVQcm9wZXJ0eU5hbWUgPSBcInR5cGVcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBwb3NpdGlvblByb3BlcnR5TmFtZSA9IFwicG9zXCI7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgbWV0YURhdGFWYWx1ZSA9IG5ldyBKc29uTWV0YWRhdGEoKTtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIGdldCBtZXRhRGF0YSgpIHsgcmV0dXJuIEpzb25PYmplY3QubWV0YURhdGFWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBlcnJvcnMgPSBuZXcgQXJyYXk8SnNvbkVycm9yPigpO1xyXG4gICAgICAgIHB1YmxpYyB0b0pzb25PYmplY3Qob2JqOiBhbnkpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy50b0pzb25PYmplY3RDb3JlKG9iaiwgbnVsbCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyB0b09iamVjdChqc29uT2JqOiBhbnksIG9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IG51bGw7XHJcbiAgICAgICAgICAgIGlmIChvYmouZ2V0VHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIGpzb25PYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gSnNvbk9iamVjdC50eXBlUHJvcGVydHlOYW1lKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIGlmIChrZXkgPT0gSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldID0ganNvbk9ialtrZXldO1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkocHJvcGVydGllcywga2V5KTtcclxuICAgICAgICAgICAgICAgIGlmICghcHJvcGVydHkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmFkZE5ld0Vycm9yKG5ldyBKc29uVW5rbm93blByb3BlcnR5RXJyb3Ioa2V5LnRvU3RyaW5nKCksIG9iai5nZXRUeXBlKCkpLCBqc29uT2JqKTsgXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9PYmooanNvbk9ialtrZXldLCBvYmosIGtleSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB0b0pzb25PYmplY3RDb3JlKG9iajogYW55LCBwcm9wZXJ0eTogSnNvbk9iamVjdFByb3BlcnR5KTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFvYmouZ2V0VHlwZSkgcmV0dXJuIG9iajtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiAoIXByb3BlcnR5LmNsYXNzTmFtZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWVdID0gcHJvcGVydHkuZ2V0T2JqVHlwZShvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgcHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UHJvcGVydGllcyhvYmouZ2V0VHlwZSgpKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb0pzb24ob2JqLCByZXN1bHQsIHByb3BlcnRpZXNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvSnNvbihvYmo6IGFueSwgcmVzdWx0OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5Lmhhc1RvVXNlR2V0VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gcHJvcGVydHkuZ2V0VmFsdWUob2JqKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gb2JqW3Byb3BlcnR5Lm5hbWVdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUFycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGFyclZhbHVlID0gW107XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXJyVmFsdWUucHVzaCh0aGlzLnRvSnNvbk9iamVjdENvcmUodmFsdWVbaV0sIHByb3BlcnR5KSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IGFyclZhbHVlLmxlbmd0aCA+IDAgPyBhcnJWYWx1ZSA6IG51bGw7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydHkuaXNEZWZhdWx0VmFsdWUodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHRbcHJvcGVydHkubmFtZV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgdmFsdWVUb09iaih2YWx1ZTogYW55LCBvYmo6IGFueSwga2V5OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkuaGFzVG9Vc2VTZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydHkuc2V0VmFsdWUob2JqLCB2YWx1ZSwgdGhpcyk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNWYWx1ZUFycmF5KHZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvQXJyYXkodmFsdWUsIG9iaiwga2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIHZhciBuZXdPYmogPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICBpZiAobmV3T2JqLm5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZSwgbmV3T2JqLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZSA9IG5ld09iai5uZXdPYmo7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFuZXdPYmouZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIG9ialtrZXldID0gdmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQXJyYXkodmFsdWU6IGFueSk6IGJvb2xlYW4geyByZXR1cm4gdmFsdWUuY29uc3RydWN0b3IudG9TdHJpbmcoKS5pbmRleE9mKFwiQXJyYXlcIikgPiAtMTsgfVxyXG4gICAgICAgIHByaXZhdGUgY3JlYXRlTmV3T2JqKHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0geyBuZXdPYmo6IG51bGwsIGVycm9yOiBudWxsIH07XHJcbiAgICAgICAgICAgIHZhciBjbGFzc05hbWUgPSB2YWx1ZVtKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNsYXNzTmFtZSAmJiBwcm9wZXJ0eSAhPSBudWxsICYmIHByb3BlcnR5LmNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgY2xhc3NOYW1lID0gcHJvcGVydHkuY2xhc3NOYW1lO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGNsYXNzTmFtZSA9IHByb3BlcnR5LmdldENsYXNzTmFtZShjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICByZXN1bHQubmV3T2JqID0gKGNsYXNzTmFtZSkgPyBKc29uT2JqZWN0Lm1ldGFEYXRhLmNyZWF0ZUNsYXNzKGNsYXNzTmFtZSkgOiBudWxsO1xyXG4gICAgICAgICAgICByZXN1bHQuZXJyb3IgPSB0aGlzLmNoZWNrTmV3T2JqZWN0T25FcnJvcnMocmVzdWx0Lm5ld09iaiwgdmFsdWUsIHByb3BlcnR5LCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrTmV3T2JqZWN0T25FcnJvcnMobmV3T2JqOiBhbnksIHZhbHVlOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHksIGNsYXNzTmFtZTogc3RyaW5nKTogSnNvbkVycm9yIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlcXVpcmVkUHJvcGVydGllcyA9IEpzb25PYmplY3QubWV0YURhdGEuZ2V0UmVxdWlyZWRQcm9wZXJ0aWVzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCByZXF1aXJlZFByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKCF2YWx1ZVtyZXF1aXJlZFByb3BlcnRpZXNbaV1dKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uUmVxdWlyZWRQcm9wZXJ0eUVycm9yKHJlcXVpcmVkUHJvcGVydGllc1tpXSwgY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnR5LmJhc2VDbGFzc05hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIWNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uTWlzc2luZ1R5cGVFcnJvcihwcm9wZXJ0eS5uYW1lLCBwcm9wZXJ0eS5iYXNlQ2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBlcnJvciA9IG5ldyBKc29uSW5jb3JyZWN0VHlwZUVycm9yKHByb3BlcnR5Lm5hbWUsIHByb3BlcnR5LmJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IoZXJyb3IsIHZhbHVlKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFkZE5ld0Vycm9yKGVycm9yOiBKc29uRXJyb3IsIGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoanNvbk9iaiAmJiBqc29uT2JqW0pzb25PYmplY3QucG9zaXRpb25Qcm9wZXJ0eU5hbWVdKSB7XHJcbiAgICAgICAgICAgICAgICBlcnJvci5hdCA9IGpzb25PYmpbSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZV0uc3RhcnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdmFsdWVUb0FycmF5KHZhbHVlOiBBcnJheTxhbnk+LCBvYmo6IGFueSwga2V5OiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzVmFsdWVBcnJheShvYmpba2V5XSkpIHtcclxuICAgICAgICAgICAgICAgIG9ialtrZXldID0gW107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIG5ld1ZhbHVlID0gdGhpcy5jcmVhdGVOZXdPYmoodmFsdWVbaV0sIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdWYWx1ZS5uZXdPYmopIHtcclxuICAgICAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKG5ld1ZhbHVlLm5ld09iaik7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy50b09iamVjdCh2YWx1ZVtpXSwgbmV3VmFsdWUubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKCFuZXdWYWx1ZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvYmpba2V5XS5wdXNoKHZhbHVlW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaW5kUHJvcGVydHkocHJvcGVydGllczogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Piwga2V5OiBhbnkpOiBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnRpZXMpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmIChwcm9wZXJ0aWVzW2ldLm5hbWUgPT0ga2V5KSByZXR1cm4gcHJvcGVydGllc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogUXVlc3Rpb25GYWN0b3J5ID0gbmV3IFF1ZXN0aW9uRmFjdG9yeSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRGVmYXVsdENob2ljZXMgPSBbXCJvbmVcIiwgXCJ0d298c2Vjb25kIHZhbHVlXCIsIHsgdmFsdWU6IDMsIHRleHQ6IFwidGhpcmQgdmFsdWVcIiB9XTtcclxuICAgICAgICBwcml2YXRlIGNyZWF0b3JIYXNoOiBIYXNoVGFibGU8KG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb24+ID0ge307XHJcblxyXG4gICAgICAgIHB1YmxpYyByZWdpc3RlclF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBxdWVzdGlvbkNyZWF0b3I6IChuYW1lOiBzdHJpbmcpID0+IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuY3JlYXRvckhhc2hbcXVlc3Rpb25UeXBlXSA9IHF1ZXN0aW9uQ3JlYXRvcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEFsbFR5cGVzKCk6IEFycmF5PHN0cmluZz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgZm9yKHZhciBrZXkgaW4gdGhpcy5jcmVhdG9ySGFzaCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0LnNvcnQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBjcmVhdG9yID0gdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdO1xyXG4gICAgICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0b3IobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXJyb3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBhbnksIHB1YmxpYyBlcnJvcjogU3VydmV5RXJyb3IgPSBudWxsKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmFsaWRhdG9yIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRFcnJvclRleHQobmFtZTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHQpIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRFcnJvclRleHQobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+O1xyXG4gICAgICAgIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJ1bm5lciB7XHJcbiAgICAgICAgcHVibGljIHJ1bihvd25lcjogSVZhbGlkYXRvck93bmVyKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG93bmVyLnZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3JSZXN1bHQgPSBvd25lci52YWxpZGF0b3JzW2ldLnZhbGlkYXRlKG93bmVyLnZhbHVlLCBvd25lci5nZXRWYWxpZGF0b3JUaXRsZSgpKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQuZXJyb3IpIHJldHVybiB2YWxpZGF0b3JSZXN1bHQuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lci52YWx1ZSA9IHZhbGlkYXRvclJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBOdW1lcmljVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluVmFsdWU6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1lcmljdmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgIXRoaXMuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgUmVxdXJlTnVtZXJpY0Vycm9yKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgVmFsaWRhdG9yUmVzdWx0KHBhcnNlRmxvYXQodmFsdWUpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5taW5WYWx1ZSA+IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4VmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSA8IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSA/IG51bGwgOiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgdk5hbWUgPSBuYW1lID8gbmFtZSA6IFwidmFsdWVcIjtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFwiVGhlICdcIiArIHZOYW1lICsgXCInIHNob3VsZCBiZSBcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcImVxdWFsIG9yIG1vcmUgdGhhbiBcIiArIHRoaXMubWluVmFsdWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiIGFuZCBcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIiBlcXVhbCBvciBsZXNzIHRoYW4gXCIgKyB0aGlzLm1heFZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNOdW1iZXIodmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSkgJiYgaXNGaW5pdGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pbkxlbmd0aDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0ZXh0dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbkxlbmd0aCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgXCIgKyB0aGlzLm1pbkxlbmd0aCArIFwiIHN5bWJsb3MuXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBBbnN3ZXJDb3VudFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pbkNvdW50OiBudW1iZXIgPSBudWxsLCBwdWJsaWMgbWF4Q291bnQ6IG51bWJlciA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwiYW5zd2VyY291bnR2YWxpZGF0b3JcIjsgfVxyXG4gICAgICAgIHB1YmxpYyB2YWxpZGF0ZSh2YWx1ZTogYW55LCBuYW1lOiBzdHJpbmcgPSBudWxsKTogVmFsaWRhdG9yUmVzdWx0IHtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IG51bGwgfHwgdmFsdWUuY29uc3RydWN0b3IgIT0gQXJyYXkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgY291bnQgPSB2YWx1ZS5sZW5ndGg7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbkNvdW50ICYmIGNvdW50IDwgdGhpcy5taW5Db3VudCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KFwiUGxlYXNlIHNlbGVjdCBhdCBsZWFzdCBcIiArIHRoaXMubWluQ291bnQgKyBcIiB2YXJpYW50cy5cIikpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5tYXhDb3VudCAmJiBjb3VudCA+IHRoaXMubWF4Q291bnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChcIlBsZWFzZSBzZWxlY3Qgbm90IG1vcmUgdGhhbiBcIiArIHRoaXMubWF4Q291bnQgKyBcIiB2YXJpYW50cy5cIikpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRFcnJvclRleHQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBuYW1lO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXZhbGlkYXRvclwiLCBbXCJ0ZXh0XCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJudW1lcmljdmFsaWRhdG9yXCIsIFtcIm1pblZhbHVlOm51bWJlclwiLCBcIm1heFZhbHVlOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE51bWVyaWNWYWxpZGF0b3IoKTsgfSwgXCJzdXJ2ZXl2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidGV4dHZhbGlkYXRvclwiLCBbXCJtaW5MZW5ndGg6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgVGV4dFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJhbnN3ZXJjb3VudHZhbGlkYXRvclwiLCBbXCJtaW5Db3VudDpudW1iZXJcIiwgXCJtYXhDb3VudDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBBbnN3ZXJDb3VudFZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuIFxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJlcnJvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ2YWxpZGF0b3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElRdWVzdGlvbiwgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICBwcm90ZWN0ZWQgZGF0YTogSVN1cnZleTtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1JlcXVpcmVkVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc0NvbW1lbnRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgaGFzT3RoZXJWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgdmlzaWJsZVZhbHVlOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVJbmRleFZhbHVlOiBudW1iZXIgPSAtMTtcclxuICAgICAgICBlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPiA9IFtdO1xyXG4gICAgICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG4gICAgICAgIHB1YmxpYyB3aWR0aDogc3RyaW5nID0gXCIxMDAlXCI7XHJcbiAgICAgICAga29WYWx1ZTogYW55OyBrb0NvbW1lbnQ6IGFueTsga29FcnJvcnM6IGFueTsga29WaXNpYmxlOiBhbnk7IGtvTm86IGFueTsgZHVtbXlPYnNlcnZhYmxlOiBhbnk7XHJcbiAgICAgICAga29Jc1NlbGVjdGVkOiBhbnk7IFxyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IHRoaXMuY3JlYXRla29WYWx1ZSgpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQgPSBrby5vYnNlcnZhYmxlKHRoaXMuY29tbWVudCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvRXJyb3JzID0ga28ub2JzZXJ2YWJsZUFycmF5KHRoaXMuZXJyb3JzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlID0ga28ub2JzZXJ2YWJsZSgwKTtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29WaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi52aXNpYmxlVmFsdWU7IH0pO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb05vID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi52aXNpYmxlSW5kZXhWYWx1ZSA+IC0xID8gc2VsZi52aXNpYmxlSW5kZXhWYWx1ZSArIDEgKyBcIi4gXCIgOiBcIlwiOyB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXROZXdWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Db21tZW50LnN1YnNjcmliZShmdW5jdGlvbiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRla29WYWx1ZSgpOiBhbnkgeyByZXR1cm4ga28ub2JzZXJ2YWJsZSh0aGlzLnZhbHVlKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXRrb1ZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpIHsgcmV0dXJuICh0aGlzLnRpdGxlVmFsdWUpID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZShuZXdWYWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IG5ld1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBnZXQgaXNSZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZFZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGlzUmVxdWlyZWQodmFsOiBib29sZWFuKSB7IHRoaXMuaXNSZXF1aXJlZFZhbHVlID0gdmFsOyB9XHJcbiAgICAgICAgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgICAgIHNldCB2aXNpYmxlKHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsID09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5xdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKDxJUXVlc3Rpb24+dGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgdmlzaWJsZUluZGV4KCk6IG51bWJlciB7IHJldHVybiB0aGlzLnZpc2libGVJbmRleFZhbHVlOyB9XHJcbiAgICAgICAgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc0NvbW1lbnRWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBoYXNDb21tZW50KHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydENvbW1lbnQoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NvbW1lbnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29tbWVudCkgdGhpcy5oYXNPdGhlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaGFzT3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmhhc090aGVyVmFsdWU7IH1cclxuICAgICAgICBzZXQgaGFzT3RoZXIodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5zdXBwb3J0T3RoZXIoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc090aGVyVmFsdWUgPSB2YWw7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB0aGlzLmhhc0NvbW1lbnQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0RGF0YShuZXdWYWx1ZTogSVN1cnZleSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZhbHVlKCk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkgcmV0dXJuIHRoaXMuZGF0YS5nZXRWYWx1ZSh0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvblZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRrb1ZhbHVlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjb21tZW50KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRDb21tZW50KHRoaXMubmFtZSkgOiBcIlwiOyB9XHJcbiAgICAgICAgc2V0IGNvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld0NvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvQ29tbWVudCh0aGlzLmNvbW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZhbHVlID09IG51bGw7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yRXJyb3JzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrRm9yRXJyb3JzKCkge1xyXG4gICAgICAgICAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ2hlY2tGb3JFcnJvcnModGhpcy5lcnJvcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5lcnJvcnMubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgIHZhciBlcnJvciA9IHRoaXMucnVuVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAmJiB0aGlzLmVycm9ycy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5kYXRhLnZhbGlkYXRlUXVlc3Rpb24odGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goZXJyb3IpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgdGhpcy5rb0Vycm9ycyh0aGlzLmVycm9ycyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSZXF1aXJlZCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuaXNFbXB0eSgpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChuZXcgQW5zd2VyUmVxdWlyZWRFcnJvcigpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJ1bm5lcigpLnJ1bih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBzZXROZXdWYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEuc2V0VmFsdWUodGhpcy5uYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvblZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge31cclxuICAgICAgICBwcml2YXRlIHNldE5ld0NvbW1lbnQobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRDb21tZW50KHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgLy9JUXVlc3Rpb25cclxuICAgICAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldFZpc2libGVJbmRleCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZpc2libGVJbmRleFZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIG51bGw7IH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uXCIsIFtcIiFuYW1lXCIsIFwidGl0bGVcIiwgXCJpc1JlcXVpcmVkOmJvb2xlYW5cIiwgXCJ2aXNpYmxlOmJvb2xlYW5cIiwgXCJ2YWxpZGF0b3JzOnZhbGlkYXRvcnNcIiwgXCJ3aWR0aFwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwicXVlc3Rpb25cIiwgXCJ2aXNpYmxlXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInF1ZXN0aW9uXCIsIFwidGl0bGVcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai50aXRsZVZhbHVlOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJxdWVzdGlvblwiLCBcIndpZHRoXCIsIG51bGwsIFwiMTAwJVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8oXCJxdWVzdGlvblwiLCBcInZhbGlkYXRvcnNcIiwgXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgXCJ2YWxpZGF0b3JcIik7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUGFnZSBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb24+ID0gbmV3IEFycmF5PFF1ZXN0aW9uPigpO1xyXG4gICAgICAgIHB1YmxpYyBkYXRhOiBJU3VydmV5ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgdmlzaWJsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyB2aXNpYmxlSW5kZXg6IG51bWJlciA9IC0xO1xyXG4gICAgICAgIHByaXZhdGUgbnVtVmFsdWU6IG51bWJlciA9IC0xO1xyXG4gICAgICAgIGtvTm86IGFueTsgXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvTm8gPSBrby5vYnNlcnZhYmxlKFwiXCIpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBudW0oKSB7IHJldHVybiB0aGlzLm51bVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBudW0odmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5udW1WYWx1ZSA9PSB2YWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm51bVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Obyh0aGlzLm51bVZhbHVlID4gMCA/IHRoaXMubnVtVmFsdWUgKyBcIi4gXCIgOiBcIlwiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJwYWdlXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb24sIGluZGV4OiBudW1iZXIgPSAtMSkge1xyXG4gICAgICAgICAgICBpZiAocXVlc3Rpb24gPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwIHx8IGluZGV4ID49IHRoaXMucXVlc3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnF1ZXN0aW9ucy5zcGxpY2UoaW5kZXgsIDAsIHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uLnNldERhdGEodGhpcy5kYXRhKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5xdWVzdGlvbkFkZGVkKHF1ZXN0aW9uLCBpbmRleCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGFkZE5ld1F1ZXN0aW9uKHF1ZXN0aW9uVHlwZTogc3RyaW5nLCBuYW1lOiBzdHJpbmcpOiBRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5jcmVhdGVRdWVzdGlvbihxdWVzdGlvblR5cGUsIG5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmFkZFF1ZXN0aW9uKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgcmV0dXJuIHF1ZXN0aW9uO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlUXVlc3Rpb24ocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucXVlc3Rpb25zLmluZGV4T2YocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkgdGhpcy5kYXRhLnF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUgJiYgdGhpcy5xdWVzdGlvbnNbaV0uaGFzRXJyb3JzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbnNUb0xpc3QobGlzdDogQXJyYXk8SVF1ZXN0aW9uPiwgdmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlT25seSAmJiAhdGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5xdWVzdGlvbnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNyZWF0aW5nKCkgeyB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicGFnZVwiLCBbXCJuYW1lXCIsIFwicXVlc3Rpb25zXCIsIFwidmlzaWJsZTpib29sZWFuXCIsIFwidGl0bGVcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQYWdlKCk7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInBhZ2VcIiwgXCJ2aXNpYmxlXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcInBhZ2VcIiwgXCJxdWVzdGlvbnNcIiwgXCJxdWVzdGlvblwiKTtcclxuIH0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25TZWxlY3RCYXNlIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHN0YXRpYyBvdGhlckl0ZW1UZXh0OiBzdHJpbmcgPSBcIk90aGVyIChkZXNjcmliZSlcIjtcclxuICAgICAgICBvdGhlckl0ZW06IEl0ZW1WYWx1ZSA9IG5ldyBJdGVtVmFsdWUoXCJvdGhlclwiLCBRdWVzdGlvblNlbGVjdEJhc2Uub3RoZXJJdGVtVGV4dCk7XHJcbiAgICAgICAgcHVibGljIGNob2ljZXNWYWx1ZXM6IEFycmF5PEl0ZW1WYWx1ZT4gPSBuZXcgQXJyYXk8SXRlbVZhbHVlPigpO1xyXG4gICAgICAgIHB1YmxpYyBvdGhlckVycm9yVGV4dDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBjaG9pY2VzT3JkZXJWYWx1ZTogc3RyaW5nID0gXCJub25lXCI7XHJcbiAgICAgICAga29PdGhlclZpc2libGU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29PdGhlclZpc2libGUgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYua29WYWx1ZSgpOyByZXR1cm4gc2VsZi5pc090aGVyU2VsZWN0ZWQoKTsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPT0gdGhpcy5vdGhlckl0ZW0udmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWVzOyB9XHJcbiAgICAgICAgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWVzLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjaG9pY2VzT3JkZXIoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuY2hvaWNlc09yZGVyVmFsdWU7IH1cclxuICAgICAgICBzZXQgY2hvaWNlc09yZGVyKG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IHRoaXMuY2hvaWNlc09yZGVyVmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgb3RoZXJUZXh0KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLm90aGVySXRlbS50ZXh0OyB9XHJcbiAgICAgICAgc2V0IG90aGVyVGV4dCh2YWx1ZTogc3RyaW5nKSB7IHRoaXMub3RoZXJJdGVtLnRleHQgPSB2YWx1ZTsgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlQ2hvaWNlcygpOiBBcnJheTxJdGVtVmFsdWU+IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc090aGVyICYmIHRoaXMuY2hvaWNlc09yZGVyID09IFwibm9uZVwiKSByZXR1cm4gdGhpcy5jaG9pY2VzO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gdGhpcy5zb3J0VmlzaWJsZUNob2ljZXModGhpcy5jaG9pY2VzLnNsaWNlKCkpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5oYXNPdGhlcikge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5vdGhlckl0ZW0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydE90aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNoZWNrRm9yRXJyb3JzKGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+KSB7XHJcbiAgICAgICAgICAgIHN1cGVyLm9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzKTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzT3RoZXJTZWxlY3RlZCgpIHx8IHRoaXMuY29tbWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMub3RoZXJFcnJvclRleHQ7XHJcbiAgICAgICAgICAgIGlmICghdGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCA9IFwiUGxlYXNlIGVudGVyIHRoZSBvdGhlcnMgdmFsdWUuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHRleHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc29ydFZpc2libGVDaG9pY2VzKGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIHZhciBvcmRlciA9IHRoaXMuY2hvaWNlc09yZGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmIChvcmRlciA9PSBcImFzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIDEpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJkZXNjXCIpIHJldHVybiB0aGlzLnNvcnRBcnJheShhcnJheSwgLTEpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJyYW5kb21cIikgcmV0dXJuIHRoaXMucmFuZG9taXplQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNvcnRBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPiwgbXVsdDogbnVtYmVyKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS50ZXh0IDwgYi50ZXh0KSByZXR1cm4gLTEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgaWYgKGEudGV4dCA+IGIudGV4dCkgcmV0dXJuIDEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByYW5kb21pemVBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbal0gPSB0ZW1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGNvbENvdW50VmFsdWU6IG51bWJlciA9IDE7XHJcbiAgICAgICAga29XaWR0aDogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29XaWR0aCA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuY29sQ291bnQgPiAwID8gKDEwMCAvIHNlbGYuY29sQ291bnQpICsgJyUnIDogXCJcIjsgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSh0aGlzLmR1bW15T2JzZXJ2YWJsZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAga29BZnRlclJlbmRlcihlbCwgY29uKSB7XHJcbiAgICAgICAgICAgIHZhciB0RWwgPSBlbFswXTtcclxuICAgICAgICAgICAgaWYgKHRFbC5ub2RlTmFtZSA9PSBcIiN0ZXh0XCIpIHRFbC5kYXRhID0gXCJcIjtcclxuICAgICAgICAgICAgdEVsID0gZWxbZWwubGVuZ3RoIC0gMV07XHJcbiAgICAgICAgICAgIGlmICh0RWwubm9kZU5hbWUgPT0gXCIjdGV4dFwiKSB0RWwuZGF0YSA9IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInNlbGVjdGJhc2VcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIFwiaGFzT3RoZXI6Ym9vbGVhblwiLCBcIiFjaG9pY2VzOml0ZW12YWx1ZXNcIiwgXCJjaG9pY2VzT3JkZXJcIiwgXCJvdGhlclRleHRcIiwgXCJvdGhlckVycm9yVGV4dFwiXSwgbnVsbCwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzZWxlY3RiYXNlXCIsIFwiY2hvaWNlc1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLmNob2ljZXMpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBJdGVtVmFsdWUuc2V0RGF0YShvYmouY2hvaWNlcywgdmFsdWUpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzZWxlY3RiYXNlXCIsIFwiY2hvaWNlc09yZGVyXCIsIG51bGwsIFwibm9uZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDaG9pY2VzKFwic2VsZWN0YmFzZVwiLCBcImNob2ljZXNPcmRlclwiLCBbXCJub25lXCIsIFwiYXNjXCIsIFwiZGVzY1wiLCBcInJhbmRvbVwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic2VsZWN0YmFzZVwiLCBcIm90aGVyVGV4dFwiLCBudWxsLCBRdWVzdGlvblNlbGVjdEJhc2Uub3RoZXJJdGVtVGV4dCk7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94YmFzZVwiLCBbXCJjb2xDb3VudDpudW1iZXJcIl0sIG51bGwsIFwic2VsZWN0YmFzZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJjaGVja2JveGJhc2VcIiwgXCJjb2xDb3VudFwiLCBudWxsLCAxKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDaG9pY2VzKFwiY2hlY2tib3hiYXNlXCIsIFwiY29sQ291bnRcIiwgWzAsIDEsIDIsIDMsIDRdKTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25fYmFzZXNlbGVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ2hlY2tib3ggZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZWtvVmFsdWUoKTogYW55IHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUgPyBrby5vYnNlcnZhYmxlQXJyYXkodGhpcy52YWx1ZSkgOiBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldGtvVmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZShbXS5jb25jYXQobmV3VmFsdWUpKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZShbXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGlzT3RoZXJTZWxlY3RlZCgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZhbHVlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlLmluZGV4T2YodGhpcy5vdGhlckl0ZW0udmFsdWUpID49IDA7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjaGVja2JveFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjaGVja2JveFwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ2hlY2tib3goXCJcIik7IH0sIFwiY2hlY2tib3hiYXNlXCIpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjaGVja2JveFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbkNoZWNrYm94KG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50IGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHB1YmxpYyByb3dzOiBudW1iZXIgPSA0O1xyXG4gICAgICAgIHB1YmxpYyBjb2xzOiBudW1iZXIgPSA1MDtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJjb21tZW50XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlzRW1wdHkoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXBlci5pc0VtcHR5KCkgfHwgdGhpcy52YWx1ZSA9PSBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJjb21tZW50XCIsIFtcImNvbHM6bnVtYmVyXCIsIFwicm93czpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNvbW1lbnQoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwiY29tbWVudFwiLCBcImNvbHNcIiwgbnVsbCwgNTApO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcImNvbW1lbnRcIiwgXCJyb3dzXCIsIG51bGwsIDQpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjb21tZW50XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50KG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX3NlbGVjdGJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkRyb3Bkb3duIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJkcm9wZG93blwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJkcm9wZG93blwiLCBbXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uRHJvcGRvd24oXCJcIik7IH0sIFwic2VsZWN0YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25Ecm9wZG93bihuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTWF0cml4RGF0YSB7XHJcbiAgICAgICAgb25NYXRyaXhSb3dDaGFuZ2VkKHJvdzogTWF0cml4Um93KTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhSb3cgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBkYXRhOiBJTWF0cml4RGF0YTtcclxuICAgICAgICBwcm90ZWN0ZWQgcm93VmFsdWU6IGFueTtcclxuICAgICAgICBrb1ZhbHVlOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnksIHB1YmxpYyB0ZXh0OiBzdHJpbmcsIHB1YmxpYyBmdWxsTmFtZTogc3RyaW5nLCBkYXRhOiBJTWF0cml4RGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUodGhpcy5yb3dWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7IHJldHVybiB0aGlzLnJvd1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucm93VmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSkgdGhpcy5kYXRhLm9uTWF0cml4Um93Q2hhbmdlZCh0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXggZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEYXRhIHtcclxuICAgICAgICBwdWJsaWMgY29sdW1uc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyByb3dzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4XCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzUm93cygpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93c1ZhbHVlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBjb2x1bW5zKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jb2x1bW5zVmFsdWU7IH1cclxuICAgICAgICBzZXQgY29sdW1ucyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNvbHVtbnNWYWx1ZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICAgICAgc2V0IHJvd3MobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yb3dzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4Um93PiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4Um93PigpO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnJvd3NbaV0udmFsdWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IE1hdHJpeFJvdyh0aGlzLnJvd3NbaV0udmFsdWUsIHRoaXMucm93c1tpXS50ZXh0LCB0aGlzLm5hbWUgKyAnXycgKyB0aGlzLnJvd3NbaV0udmFsdWUudG9TdHJpbmcoKSwgdGhpcywgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2gobmV3IE1hdHJpeFJvdyhudWxsLCBcIlwiLCB0aGlzLm5hbWUsIHRoaXMsIHZhbCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSU1hdHJpeERhdGFcclxuICAgICAgICBvbk1hdHJpeFJvd0NoYW5nZWQocm93OiBNYXRyaXhSb3cpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWUgPSByb3cudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlW3Jvdy5uYW1lXSA9IHJvdy52YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeFwiLCBbXCJjb2x1bW5zOml0ZW12YWx1ZXNcIiwgXCJyb3dzOml0ZW12YWx1ZXNcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtYXRyaXhcIiwgXCJjb2x1bW5zXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY29sdW1ucyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IEl0ZW1WYWx1ZS5zZXREYXRhKG9iai5jb2x1bW5zLCB2YWx1ZSk7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeFwiLCBcInJvd3NcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5yb3dzKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgSXRlbVZhbHVlLnNldERhdGEob2JqLnJvd3MsIHZhbHVlKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm1hdHJpeFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeChuYW1lKTsgcS5yb3dzID0gW1wiUm93IDFcIiwgXCJSb3cgMlwiXTsgcS5jb2x1bW5zID0gW1wiQ29sdW1uIDFcIiwgXCJDb2x1bW4gMlwiLCBcIkNvbHVtbiAzXCJdOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk7XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIE11bHRpcGxlVGV4dEl0ZW0gZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICBwcml2YXRlIGRhdGE6IElNdWx0aXBsZVRleHREYXRhO1xyXG4gICAgICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgaXNLT1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICBrb1ZhbHVlOiBhbnk7XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBhbnkgPSBudWxsLCB0aXRsZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gdGl0bGU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMua29WYWx1ZSA9IGtvLm9ic2VydmFibGUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghc2VsZi5pc0tPVmFsdWVVcGRhdGluZykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxmLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibXVsdGlwbGV0ZXh0aXRlbVwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXREYXRhKGRhdGE6IElNdWx0aXBsZVRleHREYXRhKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKSB7IHJldHVybiB0aGlzLnRpdGxlVmFsdWUgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLm5hbWU7ICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZShuZXdUZXh0OiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gbmV3VGV4dDsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmFsdWUoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmRhdGEgPyB0aGlzLmRhdGEuZ2V0TXVsdGlwbGVUZXh0VmFsdWUodGhpcy5uYW1lKSA6IG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5zZXRNdWx0aXBsZVRleHRWYWx1ZSh0aGlzLm5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBvblZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNLT1ZhbHVlVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXNLT1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lWYWxpZGF0b3JPd25lclxyXG4gICAgICAgIGdldFZhbGlkYXRvclRpdGxlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnRpdGxlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0IGV4dGVuZHMgUXVlc3Rpb24gaW1wbGVtZW50cyBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICAgICAgcHVibGljIGl0ZW1TaXplOiBudW1iZXIgPSAyNTtcclxuICAgICAgICBwdWJsaWMgaXRlbXM6IEFycmF5PE11bHRpcGxlVGV4dEl0ZW0+ID0gbmV3IEFycmF5PE11bHRpcGxlVGV4dEl0ZW0+KCk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLnNldERhdGEoc2VsZik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm11bHRpcGxldGV4dFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgQWRkSXRlbShuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKTogTXVsdGlwbGVUZXh0SXRlbSB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IE11bHRpcGxlVGV4dEl0ZW0obmFtZSwgdGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIHJldHVybiBpdGVtO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgc3VwZXIub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICAgICAgdGhpcy5vbkl0ZW1WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldGtvVmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlci5zZXRrb1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5vbkl0ZW1WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbVZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGl0ZW1WYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy52YWx1ZSAmJiAodGhpcy5pdGVtc1tpXS5uYW1lIGluIHRoaXMudmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbVZhbHVlID0gdGhpcy52YWx1ZVt0aGlzLml0ZW1zW2ldLm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5pdGVtc1tpXS5vblZhbHVlQ2hhbmdlZChpdGVtVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBydW5WYWxpZGF0b3JzKCk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICAgICAgdmFyIGVycm9yID0gc3VwZXIucnVuVmFsaWRhdG9ycygpO1xyXG4gICAgICAgICAgICBpZiAoZXJyb3IgIT0gbnVsbCkgcmV0dXJuIGVycm9yO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IFZhbGlkYXRvclJ1bm5lcigpLnJ1bih0aGlzLml0ZW1zW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgLy9JTXVsdGlwbGVUZXh0RGF0YVxyXG4gICAgICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZVtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy52YWx1ZVtuYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRpdGVtXCIsIFtcIm5hbWVcIiwgXCJ0aXRsZVwiLCBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE11bHRpcGxlVGV4dEl0ZW0oXCJcIik7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcIm11bHRpcGxldGV4dGl0ZW1cIiwgXCJ2YWxpZGF0b3JzXCIsIFwic3VydmV5dmFsaWRhdG9yXCIsIFwidmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm11bHRpcGxldGV4dGl0ZW1cIiwgXCJ0aXRsZVwiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLnRpdGxlVmFsdWU7IH0pO1xyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRcIiwgW1wiIWl0ZW1zOnRleHRpdGVtc1wiLCBcIml0ZW1TaXplOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTXVsdGlwbGVUZXh0KFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm11bHRpcGxldGV4dFwiLCBcIml0ZW1zXCIsIFwibXVsdGlwbGV0ZXh0aXRlbVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtdWx0aXBsZXRleHRcIiwgXCJpdGVtU2l6ZVwiLCBudWxsLCAyNSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm11bHRpcGxldGV4dFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChuYW1lKTsgcS5BZGRJdGVtKFwidGV4dDFcIik7IHEuQWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhZGlvZ3JvdXAgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmFkaW9ncm91cFwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJyYWRpb2dyb3VwXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwKFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmFkaW9ncm91cFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvblJhZGlvZ3JvdXAobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7fSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmF0aW5nIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIHN0YXRpYyBkZWZhdWx0UmF0ZVZhbHVlczogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHJhdGVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHB1YmxpYyBtaW5pbnVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBtYXhpbXVtUmF0ZURlc2NyaXB0aW9uOiBzdHJpbmcgPSBudWxsO1xyXG5cclxuICAgICAgICBrb1Zpc2libGVSYXRlVmFsdWVzOiBhbnk7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgICAgIHRoaXMua29WaXNpYmxlUmF0ZVZhbHVlcyA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWxmLnZpc2libGVSYXRlVmFsdWVzO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHJhdGVWYWx1ZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJhdGVzOyB9XHJcbiAgICAgICAgc2V0IHJhdGVWYWx1ZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5yYXRlcywgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSh0aGlzLmR1bW15T2JzZXJ2YWJsZSgpICsgMSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVSYXRlVmFsdWVzKCk6IEl0ZW1WYWx1ZVtdIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmF0ZVZhbHVlcy5sZW5ndGggPiAwKSByZXR1cm4gdGhpcy5yYXRlVmFsdWVzO1xyXG4gICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25SYXRpbmcuZGVmYXVsdFJhdGVWYWx1ZXM7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInJhdGluZ1wiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9IFxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICB9XHJcbiAgICBJdGVtVmFsdWUuc2V0RGF0YShRdWVzdGlvblJhdGluZy5kZWZhdWx0UmF0ZVZhbHVlcywgWzEsIDIsIDMsIDQsIDVdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJyYXRpbmdcIiwgW1wiaGFzQ29tbWVudDpib29sZWFuXCIsIFwicmF0ZVZhbHVlczppdGVtdmFsdWVzXCIsIFwibWluaW51bVJhdGVEZXNjcmlwdGlvblwiLCBcIm1heGltdW1SYXRlRGVzY3JpcHRpb25cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZyhcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJyYXRpbmdcIiwgXCJyYXRlVmFsdWVzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucmF0ZVZhbHVlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IEl0ZW1WYWx1ZS5zZXREYXRhKG9iai5yYXRlVmFsdWVzLCB2YWx1ZSk7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZyhuYW1lKTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uVGV4dCBleHRlbmRzIFF1ZXN0aW9uIHtcclxuICAgICAgICBwdWJsaWMgc2l6ZTogbnVtYmVyID0gMjU7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwidGV4dFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpc0VtcHR5KCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VwZXIuaXNFbXB0eSgpIHx8IHRoaXMudmFsdWUgPT0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidGV4dFwiLCBbXCJzaXplOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJ0ZXh0XCIsIFwic2l6ZVwiLCBudWxsLCAyNSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInRleHRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHQobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFRyaWdnZXIgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBzdGF0aWMgb3BlcmF0b3JzVmFsdWU6IEhhc2hUYWJsZTxGdW5jdGlvbj4gPSBudWxsO1xyXG4gICAgICAgIHN0YXRpYyBnZXQgb3BlcmF0b3JzKCkge1xyXG4gICAgICAgICAgICBpZiAoVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZSAhPSBudWxsKSByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICAgICAgVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZSA9IHtcclxuICAgICAgICAgICAgICAgIGVtcHR5OiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICF2YWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVtcHR5OiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuICEoIXZhbHVlKTsgfSxcclxuICAgICAgICAgICAgICAgIGVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlID09IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBub3RlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAhPSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgZ3JlYXRlcjogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBsZXNzOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlIDwgZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXJvcmVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlID49IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBsZXNzb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8PSBleHBlY3RlZFZhbHVlOyB9XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHJldHVybiBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG9wVmFsdWU6IHN0cmluZyA9IFwiZXF1YWxcIjtcclxuICAgICAgICBwdWJsaWMgdmFsdWU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBvcGVyYXRvcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5vcFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBvcGVyYXRvcih2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS50b0xvd2VyQ2FzZSgpO1xyXG4gICAgICAgICAgICBpZiAoIVRyaWdnZXIub3BlcmF0b3JzW3ZhbHVlXSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLm9wVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNoZWNrKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKFRyaWdnZXIub3BlcmF0b3JzW3RoaXMub3BlcmF0b3JdKHZhbHVlLCB0aGlzLnZhbHVlKSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblN1Y2Nlc3MoKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25GYWlsdXJlKCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElTdXJ2ZXlUcmlnZ2VyT3duZXIge1xyXG4gICAgICAgIGdldE9iamVjdHMocGFnZXM6IHN0cmluZ1tdLCBxdWVzdGlvbnM6IHN0cmluZ1tdKTogYW55W107XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRyaWdnZXIgZXh0ZW5kcyBUcmlnZ2VyIHtcclxuICAgICAgICBwdWJsaWMgbmFtZTogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBwYWdlczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBwdWJsaWMgcXVlc3Rpb25zOiBzdHJpbmdbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgb3duZXI6IElTdXJ2ZXlUcmlnZ2VyT3duZXIgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2V0T3duZXIob3duZXI6IElTdXJ2ZXlUcmlnZ2VyT3duZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5vd25lciA9IG93bmVyO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TdWNjZXNzKCkgeyB0aGlzLm9uVHJpZ2dlcih0aGlzLm9uSXRlbVN1Y2Nlc3MpOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uRmFpbHVyZSgpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1GYWlsdXJlKTsgfVxyXG4gICAgICAgIG9uVHJpZ2dlcihmdW5jOiBGdW5jdGlvbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMub3duZXIpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIG9iamVjdHMgPSB0aGlzLm93bmVyLmdldE9iamVjdHModGhpcy5wYWdlcywgdGhpcy5xdWVzdGlvbnMpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG9iamVjdHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGZ1bmMob2JqZWN0c1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbVN1Y2Nlc3MoaXRlbTogYW55KSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtRmFpbHVyZShpdGVtOiBhbnkpIHsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSBleHRlbmRzIFN1cnZleVRyaWdnZXIge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ2aXNpYmxldHJpZ2dlclwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbVN1Y2Nlc3MoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IHRydWU7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtRmFpbHVyZShpdGVtOiBhbnkpIHsgaXRlbS52aXNpYmxlID0gZmFsc2U7IH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidHJpZ2dlclwiLCBbXCJvcGVyYXRvclwiLCBcIiF2YWx1ZVwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5dHJpZ2dlclwiLCBbXCIhbmFtZVwiLCBcInBhZ2VzXCIsIFwicXVlc3Rpb25zXCJdLCBudWxsLCBcInRyaWdnZXJcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwidmlzaWJsZXRyaWdnZXJcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBTdXJ2ZXlUcmlnZ2VyVmlzaWJsZSgpOyB9LCBcInN1cnZleXRyaWdnZXJcIik7XHJcbn0iLCJtb2R1bGUgdGVtcGxhdGUua28geyBleHBvcnQgdmFyIGh0bWwgPSAnPHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktY29tbWVudFwiPiAgPGlucHV0IGRhdGEtYmluZD1cInZhbHVlOiRkYXRhLnF1ZXN0aW9uLmtvQ29tbWVudCwgdmlzaWJsZTokZGF0YS52aXNpYmxlXCIgLz48L3NjcmlwdD48ZGl2IGNsYXNzPVwic3ZfbWFpblwiPiAgICA8aDIgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIHNob3dUaXRsZSwgdGV4dDogdGl0bGVcIj48L2gyPiAgICA8IS0tIGtvIGlmOiBrb0N1cnJlbnRQYWdlKCkgLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXBhZ2VcXCcsIGRhdGE6IGtvQ3VycmVudFBhZ2UgfVwiPjwvZGl2PiAgICA8cCAvPiAgICA8ZGl2IGNsYXNzPVwic3ZfbmF2XCIgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd05hdmlnYXRpb25CdXR0b25zICYmICFpc0Rlc2lnbk1vZGVcIj4gICAgICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgZGF0YS1iaW5kPVwidmFsdWU6IHBhZ2VQcmV2VGV4dCwgY2xpY2s6IHByZXZQYWdlLCB2aXNpYmxlOiAha29Jc0ZpcnN0UGFnZSgpXCIgLz4gIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJOZXh0XCIgZGF0YS1iaW5kPVwidmFsdWU6IHBhZ2VOZXh0VGV4dCwgY2xpY2s6IG5leHRQYWdlLCB2aXNpYmxlOiAha29Jc0xhc3RQYWdlKClcIiAvPiAgPGlucHV0IHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIlN1Ym1pdFwiIGRhdGEtYmluZD1cInZhbHVlOiBjb21wbGV0ZVRleHQsIGNsaWNrOiBjb21wbGV0ZUxhc3RQYWdlLCB2aXNpYmxlOiBrb0lzTGFzdFBhZ2UoKVwiIC8+ICAgIDwvZGl2PiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSBrbyBpZjoga29DdXJyZW50UGFnZSgpID09IG51bGwgLS0+ICAgIFRoZXJlIGlzIG5vIGFueSB2aXNpYmxlIHBhZ2Ugb3IgdmlzaWJsZSBxdWVzdGlvbiBpbiB0aGUgc3VydmV5LiAgICA8IS0tIC9rbyAtLT48L2Rpdj48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1wYWdlXCI+ICAgIDxkaXYgY2xhc3M9XCJzdl9wX3RpdGxlXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHRpdGxlXCI+PC9kaXY+ICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbnMsIGFzOiBcXCdxdWVzdGlvblxcJyB9IC0tPiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb25cXCcsIGRhdGE6IHF1ZXN0aW9uIH0gLS0+ICAgICAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tY2hlY2tib3hcIj4gICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVDaG9pY2VzLCBhczogXFwnaXRlbVxcJywgYWZ0ZXJSZW5kZXI6IHF1ZXN0aW9uLmtvQWZ0ZXJSZW5kZXJ9ICAtLT4gICAgPGRpdiBjbGFzcz1cInN2X3FjYmNcIiAgZGF0YS1iaW5kPVwic3R5bGU6e3dpZHRoOiBxdWVzdGlvbi5rb1dpZHRofVwiPiAgICAgICAgICAgIDxsYWJlbCBjbGFzcz1cInN2X3FfY2hlY2tib3hcIj4gICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiICAgICAgICAgICAgICAgICAgICAgICBkYXRhLWJpbmQ9XCJ2YWx1ZTogaXRlbS52YWx1ZSwgY2hlY2tlZDogcXVlc3Rpb24ua29WYWx1ZVwiIC8+ICAgICAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGV4dFwiPjwvc3Bhbj4gICAgICAgICAgICA8L2xhYmVsPiAgICA8L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwiaWY6cXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1jb21tZW50XCI+ICAgIDx0ZXh0YXJlYSB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cImF0dHI6IHtjb2xzOiBxdWVzdGlvbi5jb2xzLCByb3dzOiBxdWVzdGlvbi5yb3dzfSwgdmFsdWU6cXVlc3Rpb24ua29WYWx1ZVwiIC8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb24tZHJvcGRvd25cIj4gICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgb3B0aW9uc1RleHQ6IFxcJ3RleHRcXCcsIG9wdGlvbnNWYWx1ZTogXFwndmFsdWVcXCcsIHZhbHVlOiBxdWVzdGlvbi5rb1ZhbHVlLCBvcHRpb25zQ2FwdGlvbjogXFwnQ2hvb3NlLi4uXFwnXCI+PC9zZWxlY3Q+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tYXRyaXhcIj4gICAgPHRhYmxlIGNsYXNzPVwic3ZfcV9tYXRyaXhcIj4gICAgICAgIDx0aGVhZD4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNSb3dzXCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDokZGF0YS50ZXh0XCI+PC90aD4gICAgICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGhlYWQ+ICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9uLnZpc2libGVSb3dzLCBhczogXFwncm93XFwnIH0gLS0+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzUm93cywgdGV4dDpyb3cudGV4dFwiPjwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogcXVlc3Rpb24uY29sdW1ucyAtLT4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJyYWRpb1wiIGRhdGEtYmluZD1cImF0dHI6IHtuYW1lOiByb3cuZnVsbE5hbWUsIHZhbHVlOiAkZGF0YS52YWx1ZX0sIGNoZWNrZWQ6IHJvdy5rb1ZhbHVlXCIvPiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tdWx0aXBsZXRleHRcIj4gICAgPHRhYmxlIGRhdGEtYmluZD1cImZvcmVhY2g6IHsgZGF0YTogIHF1ZXN0aW9uLml0ZW1zLCBhczogXFwnaXRlbVxcJyB9XCI+ICAgICAgICA8dHI+ICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6IGl0ZW0udGl0bGVcIj48L3RkPiAgICAgICAgICAgIDx0ZD48aW5wdXQgdHlwZT1cInRleHRcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7c2l6ZTogcXVlc3Rpb24uaXRlbVNpemV9LCB2YWx1ZTogaXRlbS5rb1ZhbHVlXCIgLz48L3RkPiAgICAgICAgPC90cj4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYWRpb2dyb3VwXCI+ICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgYXM6IFxcJ2l0ZW1cXCcsIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb0FmdGVyUmVuZGVyfSAgLS0+ICAgIDxkaXYgY2xhc3M9XCJzdl9xY2JjXCIgIGRhdGEtYmluZD1cInN0eWxlOnt3aWR0aDogcXVlc3Rpb24ua29XaWR0aH1cIj4gICAgICAgIDxsYWJlbCBjbGFzcz1cInN2X3FfcmFkaW9ncm91cFwiPiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiBkYXRhLWJpbmQ9XCJuYW1lOiBxdWVzdGlvbi5uYW1lLCBhdHRyOiB7dmFsdWU6IGl0ZW0udmFsdWV9LCBjaGVja2VkOiBxdWVzdGlvbi5rb1ZhbHVlXCIgLz4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRleHRcIj48L3NwYW4+ICAgICAgICA8L2xhYmVsPiAgICA8L2Rpdj4gICAgPCEtLSAva28gLS0+ICAgIDxkaXYgZGF0YS1iaW5kPVwiaWY6cXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYXRpbmdcIj4gICAgPHRhYmxlIGNsYXNzPVwic3ZfcV9yYXRpbmdcIj4gICAgICAgIDx0aGVhZD4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0aD48L3RoPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmtvVmlzaWJsZVJhdGVWYWx1ZXMgLS0+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhLnRleHRcIj48L3RoPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgPHRoPjwvdGg+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGhlYWQ+ICAgICAgICA8dGJvZHk+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGQgZGF0YS1iaW5kPVwidGV4dDpxdWVzdGlvbi5taW5pbnVtUmF0ZURlc2NyaXB0aW9uXCI+PC90ZD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5rb1Zpc2libGVSYXRlVmFsdWVzIC0tPiAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHF1ZXN0aW9uLm5hbWUsIHZhbHVlOiAkZGF0YS52YWx1ZX0sIGNoZWNrZWQ6IHF1ZXN0aW9uLmtvVmFsdWVcIiAvPiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6cXVlc3Rpb24ubWF4aW11bVJhdGVEZXNjcmlwdGlvblwiPjwvdGQ+ICAgICAgICAgICAgPC90cj4gICAgICAgIDwvdGJvZHk+ICAgIDwvdGFibGU+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24gfSB9XCI+PC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXRleHRcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgZGF0YS1iaW5kPVwiYXR0cjoge3NpemU6IHF1ZXN0aW9uLnNpemV9LCB2YWx1ZTpxdWVzdGlvbi5rb1ZhbHVlXCIvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uXCI+ICAgIDxkaXYgY2xhc3M9XCJzdl9xXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24ua29WaXNpYmxlKClcIj4gICAgICAgIDxkaXYgY2xhc3M9XCJzdl9xX2VyYm94XCIgZGF0YS1iaW5kPVwidmlzaWJsZToga29FcnJvcnMoKS5sZW5ndGggPiAwLCBmb3JlYWNoOiBrb0Vycm9yc1wiPiAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGV4dDokZGF0YS5nZXRUZXh0KClcIj48L2Rpdj4gICAgICAgIDwvZGl2PiAgICAgICAgPGRpdiBjbGFzcz1cInN2X3FfdGl0bGVcIiBkYXRhLWJpbmQ9XCJ0ZXh0OiBxdWVzdGlvbi5rb05vKCkgKyAgKHF1ZXN0aW9uLmlzUmVxdWlyZWQgPyBxdWVzdGlvbi5kYXRhLnJlcXVpcmVkVGV4dCA6IFxcJ1xcJykgKyBxdWVzdGlvbi50aXRsZVwiPjwvZGl2PiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgcXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc0NvbW1lbnRcIj4gICAgICAgICAgICBPdGhlciAocGxlYXNlIGRlc2NyaWJlKSAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHRydWUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+Jzt9IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwidHJpZ2dlci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRlbXBsYXRlLmtvLmh0bWwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZHhTdXJ2ZXlTZXJ2aWNlLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleSBleHRlbmRzIEJhc2UgaW1wbGVtZW50cyBJU3VydmV5LCBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBwdWJsaWMgc3VydmV5SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHN1cnZleVBvc3RJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xpZW50SWQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIHNlbmRSZXN1bHRPblBhZ2VOZXh0OiBib29sZWFuID0gZmFsc2U7XHJcblxyXG4gICAgICAgIHB1YmxpYyBjb21tZW50UHJlZml4OiBzdHJpbmcgPSBcIi1Db21tZW50XCI7XHJcbiAgICAgICAgcHVibGljIHRpdGxlOiBzdHJpbmcgPSBcIlwiO1xyXG4gICAgICAgIHB1YmxpYyBzaG93TmF2aWdhdGlvbkJ1dHRvbnM6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBzaG93VGl0bGU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIHB1YmxpYyBzaG93UGFnZVRpdGxlczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dQYWdlTnVtYmVyczogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHB1YmxpYyBzaG93UXVlc3Rpb25OdW1iZXJzOiBzdHJpbmcgPSBcIm9uXCI7XHJcbiAgICAgICAgcHVibGljIHJlcXVpcmVkVGV4dDogc3RyaW5nID0gXCIqIFwiO1xyXG4gICAgICAgIHB1YmxpYyBwYWdlUHJldlRleHQ6IHN0cmluZyA9IFwiUHJldmlvdXNcIjtcclxuICAgICAgICBwdWJsaWMgcGFnZU5leHRUZXh0OiBzdHJpbmcgPSBcIk5leHRcIjtcclxuICAgICAgICBwdWJsaWMgY29tcGxldGVUZXh0OiBzdHJpbmcgPSBcIkNvbXBsZXRlXCI7XHJcbiAgICAgICAgLy9wdWJsaWMgc2hvd1Byb2dyZXNzQmFyOiBib29sZWFuID0gZmFsc2U7IFRPRE9cclxuICAgICAgICBwdWJsaWMgcGFnZXM6IEFycmF5PFBhZ2U+ID0gbmV3IEFycmF5PFBhZ2U+KCk7XHJcbiAgICAgICAgcHVibGljIHRyaWdnZXJzOiBBcnJheTxTdXJ2ZXlUcmlnZ2VyPiA9IG5ldyBBcnJheTxTdXJ2ZXlUcmlnZ2VyPigpO1xyXG4gICAgICAgIHByaXZhdGUgY3VycmVudFBhZ2VWYWx1ZTogUGFnZSA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZXNIYXNoOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgcmVuZGVyZWRFbGVtZW50OiBIVE1MRWxlbWVudDtcclxuXHJcbiAgICAgICAgcHVibGljIG9uQ29tcGxldGU6IEV2ZW50PChzZW5kZXI6IFN1cnZleSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uUmVuZGVyZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uQ3VycmVudFBhZ2VDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblZpc2libGVDaGFuZ2VkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25RdWVzdGlvbkFkZGVkOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25RdWVzdGlvblJlbW92ZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblZhbGlkYXRlUXVlc3Rpb246IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblNlbmRSZXN1bHQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleSwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvbkdldFJlc3VsdDogRXZlbnQ8KHNlbmRlcjogU3VydmV5LCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXksIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIGpzb25FcnJvcnM6IEFycmF5PEpzb25FcnJvcj4gPSBudWxsO1xyXG5cclxuICAgICAgICBwdWJsaWMgbW9kZTogc3RyaW5nID0gXCJub3JtYWxcIjtcclxuXHJcbiAgICAgICAga29DdXJyZW50UGFnZTogYW55OyBrb0lzRmlyc3RQYWdlOiBhbnk7IGtvSXNMYXN0UGFnZTogYW55OyBkdW1teU9ic2VydmFibGU6IGFueTsgXHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSA9IG51bGwsIHJlbmRlcmVkRWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuZGF0YSA9IHNlbGY7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHRoaXMudHJpZ2dlcnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUuc2V0T3duZXIoc2VsZik7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gQXJyYXkucHJvdG90eXBlLnB1c2guY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGlmIChrbykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUgPSBrby5vYnNlcnZhYmxlKDApO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb0N1cnJlbnRQYWdlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5jdXJyZW50UGFnZTsgfSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvSXNGaXJzdFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmlzRmlyc3RQYWdlOyB9KTtcclxuICAgICAgICAgICAgICAgIHRoaXMua29Jc0xhc3RQYWdlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5pc0xhc3RQYWdlOyB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoanNvbk9iaikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZXRKc29uT2JqZWN0KGpzb25PYmopO1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmxvYWRTdXJ2ZXlGcm9tU2VydmljZSh0aGlzLnN1cnZleUlkLCByZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMub25DcmVhdGluZygpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJzdXJ2ZXlcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgZGF0YSgpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnZhbHVlc0hhc2gpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCBkYXRhKGRhdGE6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2ggPSB7fTtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW2tleV0gPSBkYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKGtleSwgZGF0YVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tbWVudHMoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZW9mIGtleS5lbmRzV2l0aCA9PT0gJ2Z1bmN0aW9uJyAmJiBrZXkuZW5kc1dpdGgodGhpcy5jb21tZW50UHJlZml4KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVQYWdlcygpOiBBcnJheTxQYWdlPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGVzaWduTW9kZSkgcmV0dXJuIHRoaXMucGFnZXM7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8UGFnZT4oKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5pc1Zpc2libGUpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLnBhZ2VzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZXMubGVuZ3RoID09IDA7IH1cclxuICAgICAgICBnZXQgUGFnZUNvdW50KCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhZ2VzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVQYWdlQ291bnQoKTogbnVtYmVyIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmlzaWJsZVBhZ2VzLmxlbmd0aDtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGN1cnJlbnRQYWdlKCk6IFBhZ2Uge1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHZQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgPCAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9PSBudWxsICYmIHZQYWdlcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gdlBhZ2VzWzBdO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmN1cnJlbnRQYWdlVmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldCBjdXJyZW50UGFnZSh2YWx1ZTogUGFnZSkge1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSAhPSBudWxsICYmIHZQYWdlcy5pbmRleE9mKHZhbHVlKSA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKHZhbHVlID09IHRoaXMuY3VycmVudFBhZ2VWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgb2xkVmFsdWUgPSB0aGlzLmN1cnJlbnRQYWdlVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ29sZEN1cnJlbnRQYWdlJzogb2xkVmFsdWUsICduZXdDdXJyZW50UGFnZSc6IHZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRGVzaWduTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImRlc2lnbmVyXCI7IH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZUtvQ3VycmVudFBhZ2UoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzS08pIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZHVtbXlPYnNlcnZhYmxlKHRoaXMuZHVtbXlPYnNlcnZhYmxlKCkgKyAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBuZXh0UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNMYXN0UGFnZSkgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0N1cnJlbnRQYWdlSGFzRXJyb3JzKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnNlbmRSZXN1bHRPblBhZ2VOZXh0ICYmIHRoaXMuY2xpZW50SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2VuZFJlc3VsdCh0aGlzLnN1cnZleVBvc3RJZCwgdGhpcy5jbGllbnRJZCwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCArIDFdO1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGlzQ3VycmVudFBhZ2VIYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5jdXJyZW50UGFnZS5oYXNFcnJvcnMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJldlBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRmlyc3RQYWdlKSByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbaW5kZXggLSAxXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29tcGxldGVMYXN0UGFnZSgpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBpc0ZpcnN0UGFnZSgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpID09IDA7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBpc0xhc3RQYWdlKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICByZXR1cm4gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgPT0gdlBhZ2VzLmxlbmd0aCAtIDE7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFBhZ2UoaW5kZXg6IG51bWJlcik6IFBhZ2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlc1tpbmRleF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGFkZFBhZ2UocGFnZTogUGFnZSkge1xyXG4gICAgICAgICAgICBpZiAocGFnZSA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucGFnZXMucHVzaChwYWdlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSBuZXcgUGFnZShuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5hZGRQYWdlKHBhZ2UpO1xyXG4gICAgICAgICAgICByZXR1cm4gcGFnZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmVtb3ZlUGFnZShwYWdlOiBQYWdlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucGFnZXMuaW5kZXhPZihwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoID4gMCA/IHRoaXMucGFnZXNbMF0gOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRRdWVzdGlvbkJ5TmFtZShuYW1lOiBzdHJpbmcpOiBJUXVlc3Rpb24ge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYocXVlc3Rpb25zW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHF1ZXN0aW9uc1tpXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdKTogSVF1ZXN0aW9uW10ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcXVlc3Rpb24gPSB0aGlzLmdldFF1ZXN0aW9uQnlOYW1lKG5hbWVzW2ldKTtcclxuICAgICAgICAgICAgICAgIGlmIChxdWVzdGlvbikgcmVzdWx0LnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlQnlRdWVzdGlvbihxdWVzdGlvbjogSVF1ZXN0aW9uKTogUGFnZSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMucGFnZXNbaV07XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZS5xdWVzdGlvbnMuaW5kZXhPZig8UXVlc3Rpb24+cXVlc3Rpb24pID4gLTEpIHJldHVybiBwYWdlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZUJ5TmFtZShuYW1lOiBzdHJpbmcpOiBQYWdlIHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VzW2ldLm5hbWUgPT0gbmFtZSkgcmV0dXJuIHRoaXMucGFnZXNbaV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlc0J5TmFtZXMobmFtZXM6IHN0cmluZ1tdKTogUGFnZVtde1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZ2V0UGFnZUJ5TmFtZShuYW1lc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZSkgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEFsbFF1ZXN0aW9ucyh2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SVF1ZXN0aW9uPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8SVF1ZXN0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5hZGRRdWVzdGlvbnNUb0xpc3QocmVzdWx0LCB2aXNpYmxlT25seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5uYW1lICE9IG5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkLmZpcmUodGhpcywgeyAnbmFtZSc6IG5hbWUsICd2YWx1ZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5VmFsdWVDaGFuZ2VkKHRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrVHJpZ2dlcnMobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnRyaWdnZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlnZ2Vyc1tpXS5uYW1lID09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJzW2ldLmNoZWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnJlbmRlcmVkRWxlbWVudCA9IGVsZW1lbnQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZWxlbWVudCA9IHRoaXMucmVuZGVyZWRFbGVtZW50O1xyXG4gICAgICAgICAgICBpZiAoIWVsZW1lbnQgfHwgdGhpcy5pc0VtcHR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMub25CZWZvcmVSZW5kZXIoKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNLTykge1xyXG4gICAgICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0ZW1wbGF0ZS5rby5odG1sO1xyXG4gICAgICAgICAgICAgICAgc2VsZi5hcHBseUJpbmRpbmcoKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBzZWxmLm9uUmVuZGVyZWQuZmlyZShzZWxmLCB7fSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nID0gbnVsbCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmIChwb3N0SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5UG9zdElkID0gcG9zdElkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjbGllbnRJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGllbnRJZCA9IGNsaWVudElkO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgbmV3IGR4U3VydmV5U2VydmljZSgpLnNlbmRSZXN1bHQodGhpcy5zdXJ2ZXlQb3N0SWQsIHRoaXMuZGF0YSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25TZW5kUmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCByZXNwb25zZTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuZ2V0UmVzdWx0KHJlc3VsdElkLCBuYW1lLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogYW55W10sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25HZXRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGE6IGRhdGEsIGRhdGFMaXN0OiBkYXRhTGlzdCwgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCwgZWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5SWQgPSBzdXJ2ZXlJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5sb2FkU3VydmV5KHRoaXMuc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRKc29uT2JqZWN0KHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5yZW5kZXIoZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvbkJlZm9yZVJlbmRlcigpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFwcGx5QmluZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmlzS08gfHwgdGhpcy5yZW5kZXJlZEVsZW1lbnQgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlVmlzaWJsZUluZGV4ZXMoKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHRoaXMuc2hvd1BhZ2VOdW1iZXJzKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uUGFnZVwiKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmlzUGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmlzUGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXModmlzUGFnZXNbaV0ucXVlc3Rpb25zLCB0cnVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh0aGlzLmdldEFsbFF1ZXN0aW9ucyhmYWxzZSksIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVycyA9PSBcIm9uXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUGFnZVZpc2libGVJbmRleGVzKHNob3dJbmRleDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAwO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0udmlzaWJsZUluZGV4ID0gdGhpcy5wYWdlc1tpXS52aXNpYmxlID8gKGluZGV4KyspIDogLTE7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnBhZ2VzW2ldLm51bSA9IHNob3dJbmRleCAmJiB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyB0aGlzLnBhZ2VzW2ldLnZpc2libGVJbmRleCArIDEgOiAtMTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHVwZGF0ZVF1ZXN0aW9uVmlzaWJsZUluZGV4ZXMocXVlc3Rpb25zOiBJUXVlc3Rpb25bXSwgc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbnNbaV0uc2V0VmlzaWJsZUluZGV4KHNob3dJbmRleCAmJiBxdWVzdGlvbnNbaV0udmlzaWJsZSA/IChpbmRleCsrKSA6IC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEpzb25PYmplY3QoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIganNvbkNvbnZlcnRlciA9IG5ldyBKc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoanNvbk9iaiwgdGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChqc29uQ29udmVydGVyLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBqc29uQ29udmVydGVyLmVycm9ycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DcmVhdGluZygpIHsgfVxyXG4gICAgICAgIC8vSVN1cnZleSBkYXRhXHJcbiAgICAgICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCFuYW1lIHx8IG5hbWUubGVuZ3RoID09IDApIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZXNIYXNoW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRWYWx1ZShuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IFwiXCIgfHwgbmV3VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMubm90aWZ5UXVlc3Rpb25PblZhbHVlQ2hhbmdlZChuYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY2hlY2tUcmlnZ2VycyhuYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldENvbW1lbnQobmFtZTogc3RyaW5nKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHRoaXMuZGF0YVtuYW1lICsgdGhpcy5jb21tZW50UHJlZml4XTtcclxuICAgICAgICAgICAgaWYgKHJlc3VsdCA9PSBudWxsKSByZXN1bHQgPSBcIlwiO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRDb21tZW50KG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBuYW1lID0gbmFtZSArIHRoaXMuY29tbWVudFByZWZpeDtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlID09IFwiXCIgfHwgbmV3VmFsdWUgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgZGVsZXRlIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVzSGFzaFtuYW1lXSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uVmlzaWJsZUNoYW5nZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUsICd2aXNpYmxlJzogbmV3VmFsdWUgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IElRdWVzdGlvbiwgaW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlc3Rpb25BZGRlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSwgJ2luZGV4JzogaW5kZXggfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25RdWVzdGlvblJlbW92ZWQuZmlyZSh0aGlzLCB7ICdxdWVzdGlvbic6IHF1ZXN0aW9uLCAnbmFtZSc6IHF1ZXN0aW9uLm5hbWUgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YWxpZGF0ZVF1ZXN0aW9uKG5hbWU6IHN0cmluZyk6IFN1cnZleUVycm9yIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25WYWxpZGF0ZVF1ZXN0aW9uLmlzRW1wdHkpIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB2YXIgb3B0aW9ucyA9IHsgbmFtZTogbmFtZSwgdmFsdWU6IHRoaXMuZ2V0VmFsdWUobmFtZSksIGVycm9yOiBudWxsIH07XHJcbiAgICAgICAgICAgIHRoaXMub25WYWxpZGF0ZVF1ZXN0aW9uLmZpcmUodGhpcywgb3B0aW9ucyk7XHJcbiAgICAgICAgICAgIHJldHVybiBvcHRpb25zLmVycm9yID8gbmV3IEN1c3RvbUVycm9yKG9wdGlvbnMuZXJyb3IpIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JU3VydmV5VHJpZ2dlck93bmVyXHJcbiAgICAgICAgZ2V0T2JqZWN0cyhwYWdlczogc3RyaW5nW10sIHF1ZXN0aW9uczogc3RyaW5nW10pOiBhbnlbXXtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IFtdO1xyXG4gICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShyZXN1bHQsIHRoaXMuZ2V0UGFnZXNCeU5hbWVzKHBhZ2VzKSk7XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdCwgdGhpcy5nZXRRdWVzdGlvbnNCeU5hbWVzKHF1ZXN0aW9ucykpO1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5XCIsIFtcInRpdGxlXCIsIFwicGFnZXNcIiwgXCJxdWVzdGlvbnNcIiwgXCJ0cmlnZ2Vyczp0cmlnZ2Vyc1wiLCBcInN1cnZleUlkXCIsIFwic3VydmV5UG9zdElkXCIsIFwic2VuZFJlc3VsdE9uUGFnZU5leHQ6Ym9vbGVhblwiLFxyXG4gICAgICAgIFwic2hvd05hdmlnYXRpb25CdXR0b25zOmJvb2xlYW5cIiwgXCJzaG93VGl0bGU6Ym9vbGVhblwiLCBcInNob3dQYWdlVGl0bGVzOmJvb2xlYW5cIiwgXCJzaG93UGFnZU51bWJlcnM6Ym9vbGVhblwiLCBcInNob3dRdWVzdGlvbk51bWJlcnNcIixcclxuICAgICAgICBcInJlcXVpcmVkVGV4dFwiLCBcInBhZ2VQcmV2VGV4dFwiLCBcInBhZ2VOZXh0VGV4dFwiLCBcImNvbXBsZXRlVGV4dFwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwicGFnZXNcIiwgXCJwYWdlXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInF1ZXN0aW9uc1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIG51bGw7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iaiwgdmFsdWUsIGpzb25Db252ZXJ0ZXIpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSBvYmouYWRkTmV3UGFnZShcIlwiKTtcclxuICAgICAgICAgICAganNvbkNvbnZlcnRlci50b09iamVjdCh7IHF1ZXN0aW9uczogdmFsdWUgfSwgcGFnZSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd05hdmlnYXRpb25CdXR0b25zXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInNob3dUaXRsZVwiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJzaG93UGFnZVRpdGxlc1wiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJzaG93UXVlc3Rpb25OdW1iZXJzXCIsIG51bGwsIFwib25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2hvaWNlcyhcInN1cnZleVwiLCBcInNob3dRdWVzdGlvbk51bWJlcnNcIiwgW1wib25cIiwgXCJvblBhZ2VcIiwgXCJvZmZcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInJlcXVpcmVkVGV4dFwiLCBudWxsLCBcIiogXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInBhZ2VQcmV2VGV4dFwiLCBudWxsLCBcIlByZXZpb3VzXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInBhZ2VOZXh0VGV4dFwiLCBudWxsLCBcIk5leHRcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwiY29tcGxldGVUZXh0XCIsIG51bGwsIFwiQ29tcGxldGVcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwic3VydmV5XCIsIFwidHJpZ2dlcnNcIiwgXCJzdXJ2ZXl0cmlnZ2VyXCIsIFwidHJpZ2dlclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8oXCJzdXJ2ZXlcIiwgXCJxdWVzdGlvbnNcIiwgXCJxdWVzdGlvblwiKTtcclxufSIsIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVdpbmRvdyBleHRlbmRzIEJhc2UgIHtcclxuICAgICAgICBwdWJsaWMgc3RhdGljIHN1cnZleUVsZW1lbnROYW1lID0gXCJ3aW5kb3dTdXJ2ZXlKU1wiO1xyXG4gICAgICAgIHN1cnZleVZhbHVlOiBTdXJ2ZXk7XHJcbiAgICAgICAgd2luZG93RWxlbWVudDogSFRNTERpdkVsZW1lbnQ7XHJcbiAgICAgICAgaXNTaG93aW5nVmFsdWU6IGJvb2xlYW47XHJcbiAgICAgICAgaXNFeHBhbmRlZFZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIHRpdGxlVmFsdWU6IHN0cmluZztcclxuICAgICAgICB0ZW1wbGF0ZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAga29FeHBhbmRlZDogYW55O1xyXG4gICAgICAgIGRvRXhwYW5kOiBhbnk7XHJcbiAgICAgICAgXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5zdXJ2ZXlWYWx1ZSA9IG5ldyBTdXJ2ZXkoanNvbk9iaik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUuc2hvd1RpdGxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5Lm9uQ29tcGxldGUuYWRkKChzZW5kZXI6IFN1cnZleSkgPT4geyBzZWxmLm9uQ29tcGxldGUoKTsgfSk7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvRXhwYW5kZWQgPSBrby5vYnNlcnZhYmxlKGZhbHNlKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZG9FeHBhbmQgPSBmdW5jdGlvbiAoKSB7IHNlbGYuY2hhbmdlRXhwYW5kZWQoKTsgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCkgOiBzdHJpbmcgeyByZXR1cm4gXCJ3aW5kb3dcIiB9XHJcbiAgICAgICAgcHVibGljIGdldCBzdXJ2ZXkoKTogU3VydmV5IHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzU2hvd2luZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNTaG93aW5nVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzRXhwYW5kZWRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMuc3VydmV5LnRpdGxlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNob3coKSB7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLnRlbXBsYXRlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICBrby5jbGVhbk5vZGUodGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5LnJlbmRlcihTdXJ2ZXlXaW5kb3cuc3VydmV5RWxlbWVudE5hbWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd2luZ1ZhbHVlID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGhpZGUoKSB7XHJcbiAgICAgICAgICAgIGRvY3VtZW50LmJvZHkucmVtb3ZlQ2hpbGQodGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICAgICAgdGhpcy53aW5kb3dFbGVtZW50LmlubmVySFRNTCA9IFwiXCI7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93aW5nVmFsdWUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGV4cGFuZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNvbGxhcHNlKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0ZW1wbGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZVZhbHVlID8gdGhpcy50ZW1wbGF0ZVZhbHVlIDogdGVtcGxhdGUud2luZG93LmtvLmh0bWw7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHRlbXBsYXRlKHZhbHVlOiBzdHJpbmcpIHsgIHRoaXMudGVtcGxhdGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBleHBhbmRjb2xsYXBzZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICB0aGlzLmlzRXhwYW5kZWRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc0tPKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmtvRXhwYW5kZWQodGhpcy5pc0V4cGFuZGVkVmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlRXhwYW5kZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoIXRoaXMuaXNFeHBhbmRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25Db21wbGV0ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIHRlbXBsYXRlLndpbmRvdy5rbyB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwic3Zfd2luZG93XCI+ICAgIDxkaXYgY2xhc3M9XCJzdl93aW5kb3dfdGl0bGVcIj48YSBocmVmPVwiI1wiIGRhdGEtYmluZD1cImNsaWNrOmRvRXhwYW5kXCIgc3R5bGU9XCJ3aWR0aDoxMDAlXCI+PHNwYW4gZGF0YS1iaW5kPVwidGV4dDp0aXRsZVwiPjwvc3Bhbj48L2E+PC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTprb0V4cGFuZGVkXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwic3Zfd2luZG93X2NvbnRlbnRcIiBpZD1cIndpbmRvd1N1cnZleUpTXCI+PC9kaXY+ICAgIDwvZGl2PjwvZGl2Pic7fSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZS5rby5odG1sLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRlbXBsYXRlVGV4dEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVwbGFjZVRleHQocmVwbGFjZVRleHQ6IHN0cmluZywgaWQ6IHN0cmluZywgcXVlc3Rpb25UeXBlOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIGlkID0gdGhpcy5nZXRJZChpZCwgcXVlc3Rpb25UeXBlKTtcclxuICAgICAgICAgICAgdmFyIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKGlkKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgcG9zID0gdGhpcy50ZXh0LmluZGV4T2YoJz4nLCBwb3MpO1xyXG4gICAgICAgICAgICBpZiAocG9zIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RhcnRQb3MgPSBwb3MgKyAxO1xyXG4gICAgICAgICAgICB2YXIgZW5kU3RyaW5nID0gXCI8L3NjcmlwdD5cIjtcclxuICAgICAgICAgICAgcG9zID0gdGhpcy50ZXh0LmluZGV4T2YoZW5kU3RyaW5nLCBzdGFydFBvcyk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudGV4dCA9IHRoaXMudGV4dC5zdWJzdHIoMCwgc3RhcnRQb3MpICsgcmVwbGFjZVRleHQgKyB0aGlzLnRleHQuc3Vic3RyKHBvcyk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRJZChpZDogc3RyaW5nLCBxdWVzdGlvblR5cGU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gJ2lkPVwic3VydmV5LScgKyBpZDtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uVHlwZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0ICs9IFwiLVwiICsgcXVlc3Rpb25UeXBlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQgKyAnXCInO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IHRleHQoKTogc3RyaW5nIHsgcmV0dXJuIFwiXCI7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0IHRleHQodmFsdWU6IHN0cmluZykgeyAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRlbXBsYXRlVGV4dCBleHRlbmRzIFN1cnZleVRlbXBsYXRlVGV4dEJhc2Uge1xyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGVtcGxhdGUua28uaHRtbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7IHRlbXBsYXRlLmtvLmh0bWwgPSB2YWx1ZTsgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=
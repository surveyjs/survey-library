/*!
* surveyjs - Survey JavaScript library v0.9.3
* (c) Andrew Telnov - http://surveyjs.org/
* License: MIT (http://www.opensource.org/licenses/mit-license.php)
*/

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
    }());
    Survey.ItemValue = ItemValue;
    var Base = (function () {
        function Base() {
        }
        Base.prototype.getType = function () {
            throw new Error('This method is abstract');
        };
        return Base;
    }());
    Survey.Base = Base;
    var SurveyError = (function () {
        function SurveyError() {
        }
        SurveyError.prototype.getText = function () {
            throw new Error('This method is abstract');
        };
        return SurveyError;
    }());
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
    }());
    Survey.Event = Event;
})(Survey || (Survey = {}));

var Survey;
(function (Survey) {
    var dxSurveyService = (function () {
        //public static serviceUrl: string = "http://localhost:50488/api/Survey";
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
        dxSurveyService.serviceUrl = "https://dxsurveyapi.azurewebsites.net/api/Survey";
        return dxSurveyService;
    }());
    Survey.dxSurveyService = dxSurveyService;
})(Survey || (Survey = {}));

var Survey;
(function (Survey) {
    Survey.surveyLocalization = {
        currentLocale: "",
        locales: {},
        getString: function (strName) {
            var loc = this.currentLocale ? this.locales[this.currentLocale] : Survey.surveyStrings;
            if (!loc || !loc[strName])
                loc = Survey.surveyStrings;
            return loc[strName];
        },
        getLocales: function () {
            var res = [];
            res.push("");
            for (var key in this.locales) {
                res.push(key);
            }
            return res;
        }
    };
    Survey.surveyStrings = {
        pagePrevText: "Previous",
        pageNextText: "Next",
        completeText: "Complete",
        otherItemText: "Other (describe)",
        progressText: "Page {0} of {1}",
        optionsCaption: "Choose...",
        requiredError: "Please answer the question.",
        numericError: "The value should be a numeric.",
        textMinLength: "Please enter at least {0} symbols.",
        minSelectError: "Please select at least {0} variants.",
        maxSelectError: "Please select not more than {0} variants.",
        numericMinMax: "The '{0}' should be equal or more than {1} and equal or less than {2}",
        numericMin: "The '{0}' should be equal or more than {1}",
        numericMax: "The '{0}' should be equal or less than {1}"
    };
    Survey.surveyLocalization.locales["en"] = Survey.surveyStrings;
    if (!String.prototype["format"]) {
        String.prototype["format"] = function () {
            var args = arguments;
            return this.replace(/{(\d+)}/g, function (match, number) {
                return typeof args[number] != 'undefined'
                    ? args[number]
                    : match;
            });
        };
    }
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
/// <reference path="surveyStrings.ts" />
var Survey;
(function (Survey) {
    var AnswerRequiredError = (function (_super) {
        __extends(AnswerRequiredError, _super);
        function AnswerRequiredError() {
            _super.call(this);
        }
        AnswerRequiredError.prototype.getText = function () {
            return Survey.surveyLocalization.getString("requiredError");
        };
        return AnswerRequiredError;
    }(Survey.SurveyError));
    Survey.AnswerRequiredError = AnswerRequiredError;
    var RequreNumericError = (function (_super) {
        __extends(RequreNumericError, _super);
        function RequreNumericError() {
            _super.call(this);
        }
        RequreNumericError.prototype.getText = function () {
            return Survey.surveyLocalization.getString("numericError");
        };
        return RequreNumericError;
    }(Survey.SurveyError));
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
    }(Survey.SurveyError));
    Survey.CustomError = CustomError;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
var Survey;
(function (Survey) {
    var JsonObjectProperty = (function () {
        function JsonObjectProperty(name) {
            this.name = name;
            this.typeValue = null;
            this.choicesValue = null;
            this.choicesfunc = null;
            this.className = null;
            this.classNamePart = null;
            this.baseClassName = null;
            this.defaultValue = null;
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
        Object.defineProperty(JsonObjectProperty.prototype, "choices", {
            get: function () {
                if (this.choicesValue != null)
                    return this.choicesValue;
                if (this.choicesfunc != null)
                    return this.choicesfunc();
                return null;
            },
            enumerable: true,
            configurable: true
        });
        JsonObjectProperty.prototype.setChoices = function (value, valueFunc) {
            this.choicesValue = value;
            this.choicesfunc = valueFunc;
        };
        return JsonObjectProperty;
    }());
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
    }());
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
        JsonMetadata.prototype.overrideClassCreatore = function (name, creator) {
            var metaDataClass = this.findClass(name);
            if (metaDataClass) {
                metaDataClass.creator = creator;
            }
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
        JsonMetadata.prototype.setPropertyChoices = function (name, propertyName, choices, choicesFunc) {
            if (choicesFunc === void 0) { choicesFunc = null; }
            var property = this.findProperty(name, propertyName);
            if (!property)
                return;
            property.setChoices(choices, choicesFunc);
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
    }());
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
    }());
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
    }(JsonError));
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
    }(JsonError));
    Survey.JsonMissingTypeErrorBase = JsonMissingTypeErrorBase;
    var JsonMissingTypeError = (function (_super) {
        __extends(JsonMissingTypeError, _super);
        function JsonMissingTypeError(propertyName, baseClassName) {
            _super.call(this, baseClassName, "missingtypeproperty", "The property type is missing in the object. Please take a look at property: '" + propertyName + "'.");
            this.propertyName = propertyName;
            this.baseClassName = baseClassName;
        }
        return JsonMissingTypeError;
    }(JsonMissingTypeErrorBase));
    Survey.JsonMissingTypeError = JsonMissingTypeError;
    var JsonIncorrectTypeError = (function (_super) {
        __extends(JsonIncorrectTypeError, _super);
        function JsonIncorrectTypeError(propertyName, baseClassName) {
            _super.call(this, baseClassName, "incorrecttypeproperty", "The property type is incorrect in the object. Please take a look at property: '" + propertyName + "'.");
            this.propertyName = propertyName;
            this.baseClassName = baseClassName;
        }
        return JsonIncorrectTypeError;
    }(JsonMissingTypeErrorBase));
    Survey.JsonIncorrectTypeError = JsonIncorrectTypeError;
    var JsonRequiredPropertyError = (function (_super) {
        __extends(JsonRequiredPropertyError, _super);
        function JsonRequiredPropertyError(propertyName, className) {
            _super.call(this, "requiredproperty", "The property '" + propertyName + "' is required in class '" + className + "'.");
            this.propertyName = propertyName;
            this.className = className;
        }
        return JsonRequiredPropertyError;
    }(JsonError));
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
    }());
    Survey.JsonObject = JsonObject;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="base.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionBase = (function (_super) {
        __extends(QuestionBase, _super);
        function QuestionBase(name) {
            _super.call(this);
            this.name = name;
            this.visibleValue = true;
            this.visibleIndexValue = -1;
            this.width = "100%";
            this.onCreating();
        }
        Object.defineProperty(QuestionBase.prototype, "visible", {
            get: function () { return this.visibleValue; },
            set: function (val) {
                if (val == this.visible)
                    return;
                this.visibleValue = val;
                this.fireCallback(this.visibilityChangedCallback);
                if (this.data) {
                    this.data.questionVisibilityChanged(this, this.visible);
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionBase.prototype, "visibleIndex", {
            get: function () { return this.visibleIndexValue; },
            enumerable: true,
            configurable: true
        });
        QuestionBase.prototype.hasErrors = function () { return false; };
        Object.defineProperty(QuestionBase.prototype, "hasTitle", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionBase.prototype, "hasComment", {
            get: function () { return false; },
            enumerable: true,
            configurable: true
        });
        QuestionBase.prototype.setData = function (newValue) {
            this.data = newValue;
            this.onSetData();
        };
        QuestionBase.prototype.fireCallback = function (callback) {
            if (callback)
                callback();
        };
        QuestionBase.prototype.onSetData = function () { };
        QuestionBase.prototype.onCreating = function () { };
        //IQuestion
        QuestionBase.prototype.onSurveyValueChanged = function (newValue) {
        };
        QuestionBase.prototype.setVisibleIndex = function (value) {
            if (this.visibleIndexValue == value)
                return;
            this.visibleIndexValue = value;
            this.fireCallback(this.visibleIndexChangedCallback);
        };
        return QuestionBase;
    }(Survey.Base));
    Survey.QuestionBase = QuestionBase;
    Survey.JsonObject.metaData.addClass("questionbase", ["!name", "visible:boolean", "width"]);
    Survey.JsonObject.metaData.setPropertyValues("questionbase", "visible", null, true);
    Survey.JsonObject.metaData.setPropertyValues("questionbase", "width", null, "100%");
})(Survey || (Survey = {}));

/// <reference path="questionbase.ts" />
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
    }());
    Survey.QuestionFactory = QuestionFactory;
})(Survey || (Survey = {}));

/// <reference path="questionbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Survey;
(function (Survey) {
    var PageModel = (function (_super) {
        __extends(PageModel, _super);
        function PageModel(name) {
            if (name === void 0) { name = ""; }
            _super.call(this);
            this.name = name;
            this.questions = new Array();
            this.data = null;
            this.title = "";
            this.visibleIndex = -1;
            this.numValue = -1;
            this.visibleValue = true;
            var self = this;
            this.questions.push = function (value) {
                if (self.data != null) {
                    value.setData(self.data);
                }
                return Array.prototype.push.call(this, value);
            };
        }
        Object.defineProperty(PageModel.prototype, "num", {
            get: function () { return this.numValue; },
            set: function (value) {
                if (this.numValue == value)
                    return;
                this.numValue = value;
                this.onNumChanged(value);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PageModel.prototype, "visible", {
            get: function () { return this.visibleValue; },
            set: function (value) {
                if (value === this.visible)
                    return;
                this.visibleValue = value;
                if (this.data != null) {
                    this.data.pageVisibilityChanged(this, this.visible);
                }
            },
            enumerable: true,
            configurable: true
        });
        PageModel.prototype.getType = function () { return "page"; };
        Object.defineProperty(PageModel.prototype, "isVisible", {
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
        PageModel.prototype.addQuestion = function (question, index) {
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
        PageModel.prototype.addNewQuestion = function (questionType, name) {
            var question = Survey.QuestionFactory.Instance.createQuestion(questionType, name);
            this.addQuestion(question);
            return question;
        };
        PageModel.prototype.removeQuestion = function (question) {
            var index = this.questions.indexOf(question);
            if (index < 0)
                return;
            this.questions.splice(index, 1);
            if (this.data != null)
                this.data.questionRemoved(question);
        };
        PageModel.prototype.hasErrors = function () {
            var result = false;
            for (var i = 0; i < this.questions.length; i++) {
                if (this.questions[i].visible && this.questions[i].hasErrors()) {
                    result = true;
                }
            }
            return result;
        };
        PageModel.prototype.addQuestionsToList = function (list, visibleOnly) {
            if (visibleOnly === void 0) { visibleOnly = false; }
            if (visibleOnly && !this.visible)
                return;
            for (var i = 0; i < this.questions.length; i++) {
                if (visibleOnly && !this.questions[i].visible)
                    continue;
                list.push(this.questions[i]);
            }
        };
        PageModel.prototype.onNumChanged = function (value) {
        };
        return PageModel;
    }(Survey.Base));
    Survey.PageModel = PageModel;
    Survey.JsonObject.metaData.addClass("page", ["name", "questions", "visible:boolean", "title"], function () { return new PageModel(); });
    Survey.JsonObject.metaData.setPropertyValues("page", "visible", null, true);
    Survey.JsonObject.metaData.setPropertyClassInfo("page", "questions", "question");
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
    }());
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
    }(Survey.Base));
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
    }());
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
            if (this.minValue && this.maxValue) {
                return Survey.surveyLocalization.getString("numericMinMax")["format"](vName, this.minValue, this.maxValue);
            }
            else {
                if (this.minValue) {
                    return Survey.surveyLocalization.getString("numericMin")["format"](vName, this.minValue);
                }
                return Survey.surveyLocalization.getString("numericMax")["format"](vName, this.maxValue);
            }
        };
        NumericValidator.prototype.isNumber = function (value) {
            return !isNaN(parseFloat(value)) && isFinite(value);
        };
        return NumericValidator;
    }(SurveyValidator));
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
            return Survey.surveyLocalization.getString("textMinLength")["format"](this.minLength);
        };
        return TextValidator;
    }(SurveyValidator));
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
                return new ValidatorResult(null, new Survey.CustomError(this.getErrorText(Survey.surveyLocalization.getString("minSelectError")["format"](this.minCount))));
            }
            if (this.maxCount && count > this.maxCount) {
                return new ValidatorResult(null, new Survey.CustomError(this.getErrorText(Survey.surveyLocalization.getString("maxSelectError")["format"](this.maxCount))));
            }
            return null;
        };
        AnswerCountValidator.prototype.getDefaultErrorText = function (name) {
            return name;
        };
        return AnswerCountValidator;
    }(SurveyValidator));
    Survey.AnswerCountValidator = AnswerCountValidator;
    Survey.JsonObject.metaData.addClass("surveyvalidator", ["text"]);
    Survey.JsonObject.metaData.addClass("numericvalidator", ["minValue:number", "maxValue:number"], function () { return new NumericValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("textvalidator", ["minLength:number"], function () { return new TextValidator(); }, "surveyvalidator");
    Survey.JsonObject.metaData.addClass("answercountvalidator", ["minCount:number", "maxCount:number"], function () { return new AnswerCountValidator(); }, "surveyvalidator");
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="questionfactory.ts" />
/// <reference path="error.ts" />
/// <reference path="validator.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="questionbase.ts" />
var Survey;
(function (Survey) {
    var Question = (function (_super) {
        __extends(Question, _super);
        function Question(name) {
            _super.call(this, name);
            this.name = name;
            this.titleValue = null;
            this.isRequiredValue = false;
            this.hasCommentValue = false;
            this.hasOtherValue = false;
            this.errors = [];
            this.validators = new Array();
            this.isValueChangedInSurvey = false;
        }
        Object.defineProperty(Question.prototype, "hasTitle", {
            get: function () { return true; },
            enumerable: true,
            configurable: true
        });
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
        Question.prototype.onSetData = function () {
            _super.prototype.onSetData.call(this);
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
                this.fireCallback(this.valueChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Question.prototype, "comment", {
            get: function () { return this.data != null ? this.data.getComment(this.name) : ""; },
            set: function (newValue) {
                this.setNewComment(newValue);
                this.fireCallback(this.commentChangedCallback);
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
            var errorLength = this.errors ? this.errors.length : 0;
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
            if (errorLength != this.errors.length || errorLength > 0) {
                this.fireCallback(this.errorsChangedCallback);
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
            if (!this.isValueChangedInSurvey && this.data != null) {
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
        //IQuestion
        Question.prototype.onSurveyValueChanged = function (newValue) {
            this.isValueChangedInSurvey = true;
            this.value = newValue;
            this.isValueChangedInSurvey = false;
        };
        //IValidatorOwner
        Question.prototype.getValidatorTitle = function () { return null; };
        return Question;
    }(Survey.QuestionBase));
    Survey.Question = Question;
    Survey.JsonObject.metaData.addClass("question", ["title", "isRequired:boolean", "validators:validators"], null, "questionbase");
    Survey.JsonObject.metaData.setPropertyValues("question", "title", null, null, function (obj) { return obj.titleValue; });
    Survey.JsonObject.metaData.setPropertyClassInfo("question", "validators", "surveyvalidator", "validator");
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="surveystrings.ts" />
var Survey;
(function (Survey) {
    var QuestionSelectBase = (function (_super) {
        __extends(QuestionSelectBase, _super);
        function QuestionSelectBase(name) {
            _super.call(this, name);
            this.otherItem = new Survey.ItemValue("other", Survey.surveyLocalization.getString("otherItemText"));
            this.choicesValues = new Array();
            this.otherErrorText = null;
            this.choicesOrderValue = "none";
        }
        Object.defineProperty(QuestionSelectBase.prototype, "isOtherSelected", {
            get: function () {
                return this.value == this.otherItem.value;
            },
            enumerable: true,
            configurable: true
        });
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
            if (!this.isOtherSelected || this.comment)
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
        return QuestionSelectBase;
    }(Survey.Question));
    Survey.QuestionSelectBase = QuestionSelectBase;
    var QuestionCheckboxBase = (function (_super) {
        __extends(QuestionCheckboxBase, _super);
        function QuestionCheckboxBase(name) {
            _super.call(this, name);
            this.name = name;
            this.colCountValue = 1;
        }
        Object.defineProperty(QuestionCheckboxBase.prototype, "colCount", {
            get: function () { return this.colCountValue; },
            set: function (value) {
                if (value < 0 || value > 4)
                    return;
                this.colCountValue = value;
                this.fireCallback(this.colCountChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        return QuestionCheckboxBase;
    }(QuestionSelectBase));
    Survey.QuestionCheckboxBase = QuestionCheckboxBase;
    Survey.JsonObject.metaData.addClass("selectbase", ["hasComment:boolean", "hasOther:boolean", "!choices:itemvalues", "choicesOrder", "otherText", "otherErrorText"], null, "question");
    Survey.JsonObject.metaData.setPropertyValues("selectbase", "choices", null, null, function (obj) { return Survey.ItemValue.getData(obj.choices); }, function (obj, value) { Survey.ItemValue.setData(obj.choices, value); });
    Survey.JsonObject.metaData.setPropertyValues("selectbase", "choicesOrder", null, "none");
    Survey.JsonObject.metaData.setPropertyChoices("selectbase", "choicesOrder", ["none", "asc", "desc", "random"]);
    Survey.JsonObject.metaData.setPropertyValues("selectbase", "otherText", null, Survey.surveyLocalization.getString("otherItemText"));
    Survey.JsonObject.metaData.addClass("checkboxbase", ["colCount:number"], null, "selectbase");
    Survey.JsonObject.metaData.setPropertyValues("checkboxbase", "colCount", null, 1);
    Survey.JsonObject.metaData.setPropertyChoices("checkboxbase", "colCount", [0, 1, 2, 3, 4]);
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionCheckboxModel = (function (_super) {
        __extends(QuestionCheckboxModel, _super);
        function QuestionCheckboxModel(name) {
            _super.call(this, name);
            this.name = name;
        }
        Object.defineProperty(QuestionCheckboxModel.prototype, "isOtherSelected", {
            get: function () {
                if (!this.value)
                    return false;
                return this.value.indexOf(this.otherItem.value) >= 0;
            },
            enumerable: true,
            configurable: true
        });
        QuestionCheckboxModel.prototype.getType = function () {
            return "checkbox";
        };
        return QuestionCheckboxModel;
    }(Survey.QuestionCheckboxBase));
    Survey.QuestionCheckboxModel = QuestionCheckboxModel;
    Survey.JsonObject.metaData.addClass("checkbox", [], function () { return new QuestionCheckboxModel(""); }, "checkboxbase");
    Survey.QuestionFactory.Instance.registerQuestion("checkbox", function (name) { var q = new QuestionCheckboxModel(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionCommentModel = (function (_super) {
        __extends(QuestionCommentModel, _super);
        function QuestionCommentModel(name) {
            _super.call(this, name);
            this.name = name;
            this.rows = 4;
            this.cols = 50;
        }
        QuestionCommentModel.prototype.getType = function () {
            return "comment";
        };
        QuestionCommentModel.prototype.isEmpty = function () {
            return _super.prototype.isEmpty.call(this) || this.value == "";
        };
        return QuestionCommentModel;
    }(Survey.Question));
    Survey.QuestionCommentModel = QuestionCommentModel;
    Survey.JsonObject.metaData.addClass("comment", ["cols:number", "rows:number"], function () { return new QuestionCommentModel(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("comment", "cols", null, 50);
    Survey.JsonObject.metaData.setPropertyValues("comment", "rows", null, 4);
    Survey.QuestionFactory.Instance.registerQuestion("comment", function (name) { return new QuestionCommentModel(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question_selectbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionDropdownModel = (function (_super) {
        __extends(QuestionDropdownModel, _super);
        function QuestionDropdownModel(name) {
            _super.call(this, name);
            this.name = name;
        }
        Object.defineProperty(QuestionDropdownModel.prototype, "optionsCaption", {
            get: function () { return (this.optionsCaptionValue) ? this.optionsCaptionValue : Survey.surveyLocalization.getString("optionsCaption"); },
            set: function (newValue) { this.optionsCaptionValue = newValue; },
            enumerable: true,
            configurable: true
        });
        QuestionDropdownModel.prototype.getType = function () {
            return "dropdown";
        };
        return QuestionDropdownModel;
    }(Survey.QuestionSelectBase));
    Survey.QuestionDropdownModel = QuestionDropdownModel;
    Survey.JsonObject.metaData.addClass("dropdown", ["optionsCaption"], function () { return new QuestionDropdownModel(""); }, "selectbase");
    Survey.JsonObject.metaData.setPropertyValues("dropdown", "optionsCaption", null, null, function (obj) { return obj.optionsCaptionValue; });
    Survey.QuestionFactory.Instance.registerQuestion("dropdown", function (name) { var q = new QuestionDropdownModel(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="questionbase.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionHtmlModel = (function (_super) {
        __extends(QuestionHtmlModel, _super);
        function QuestionHtmlModel(name) {
            _super.call(this, name);
            this.name = name;
        }
        QuestionHtmlModel.prototype.getType = function () {
            return "html";
        };
        Object.defineProperty(QuestionHtmlModel.prototype, "html", {
            get: function () { return this.htmlValue; },
            set: function (value) {
                this.htmlValue = value;
            },
            enumerable: true,
            configurable: true
        });
        return QuestionHtmlModel;
    }(Survey.QuestionBase));
    Survey.QuestionHtmlModel = QuestionHtmlModel;
    Survey.JsonObject.metaData.addClass("html", ["html"], function () { return new QuestionHtmlModel(""); }, "questionbase");
    Survey.QuestionFactory.Instance.registerQuestion("html", function (name) { return new QuestionHtmlModel(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var MatrixRowModel = (function (_super) {
        __extends(MatrixRowModel, _super);
        function MatrixRowModel(name, text, fullName, data, value) {
            _super.call(this);
            this.name = name;
            this.text = text;
            this.fullName = fullName;
            this.data = data;
            this.rowValue = value;
        }
        Object.defineProperty(MatrixRowModel.prototype, "value", {
            get: function () { return this.rowValue; },
            set: function (newValue) {
                this.rowValue = newValue;
                if (this.data)
                    this.data.onMatrixRowChanged(this);
                this.onValueChanged();
            },
            enumerable: true,
            configurable: true
        });
        MatrixRowModel.prototype.onValueChanged = function () {
        };
        return MatrixRowModel;
    }(Survey.Base));
    Survey.MatrixRowModel = MatrixRowModel;
    var QuestionMatrixModel = (function (_super) {
        __extends(QuestionMatrixModel, _super);
        function QuestionMatrixModel(name) {
            _super.call(this, name);
            this.name = name;
            this.columnsValue = [];
            this.rowsValue = [];
            this.isRowChanging = false;
        }
        QuestionMatrixModel.prototype.getType = function () {
            return "matrix";
        };
        Object.defineProperty(QuestionMatrixModel.prototype, "hasRows", {
            get: function () {
                return this.rowsValue.length > 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixModel.prototype, "columns", {
            get: function () { return this.columnsValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.columnsValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixModel.prototype, "rows", {
            get: function () { return this.rowsValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.rowsValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixModel.prototype, "visibleRows", {
            get: function () {
                var result = new Array();
                var val = this.value;
                if (!val)
                    val = {};
                for (var i = 0; i < this.rows.length; i++) {
                    if (!this.rows[i].value)
                        continue;
                    result.push(this.createMatrixRow(this.rows[i].value, this.rows[i].text, this.name + '_' + this.rows[i].value.toString(), val[this.rows[i].value]));
                }
                if (result.length == 0) {
                    result.push(this.createMatrixRow(null, "", this.name, val));
                }
                this.generatedVisibleRows = result;
                return result;
            },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixModel.prototype.createMatrixRow = function (name, text, fullName, value) {
            return new MatrixRowModel(name, text, fullName, this, value);
        };
        QuestionMatrixModel.prototype.onValueChanged = function () {
            if (this.isRowChanging || !(this.generatedVisibleRows) || this.generatedVisibleRows.length == 0)
                return;
            this.isRowChanging = true;
            var val = this.value;
            if (!val)
                val = {};
            if (this.rows.length == 0) {
                this.generatedVisibleRows[0].value = val;
            }
            else {
                for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                    var row = this.generatedVisibleRows[i];
                    var rowVal = val[row.name] ? val[row.name] : null;
                    this.generatedVisibleRows[i].value = rowVal;
                }
            }
            this.isRowChanging = false;
        };
        //IMatrixData
        QuestionMatrixModel.prototype.onMatrixRowChanged = function (row) {
            if (this.isRowChanging)
                return;
            this.isRowChanging = true;
            if (!this.hasRows) {
                this.setNewValue(row.value);
            }
            else {
                var newValue = this.value;
                if (!newValue) {
                    newValue = {};
                }
                newValue[row.name] = row.value;
                this.setNewValue(newValue);
            }
            this.isRowChanging = false;
        };
        return QuestionMatrixModel;
    }(Survey.Question));
    Survey.QuestionMatrixModel = QuestionMatrixModel;
    Survey.JsonObject.metaData.addClass("matrix", ["columns:itemvalues", "rows:itemvalues"], function () { return new QuestionMatrixModel(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("matrix", "columns", null, null, function (obj) { return Survey.ItemValue.getData(obj.columns); }, function (obj, value) { obj.columns = value; });
    Survey.JsonObject.metaData.setPropertyValues("matrix", "rows", null, null, function (obj) { return Survey.ItemValue.getData(obj.rows); }, function (obj, value) { obj.rows = value; });
    Survey.QuestionFactory.Instance.registerQuestion("matrix", function (name) { var q = new QuestionMatrixModel(name); q.rows = ["Row 1", "Row 2"]; q.columns = ["Column 1", "Column 2", "Column 3"]; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var MatrixDropdownColumn = (function (_super) {
        __extends(MatrixDropdownColumn, _super);
        function MatrixDropdownColumn(name, title) {
            if (title === void 0) { title = null; }
            _super.call(this);
            this.name = name;
            this.choicesValue = [];
        }
        MatrixDropdownColumn.prototype.getType = function () { return "matrixdropdowncolumn"; };
        Object.defineProperty(MatrixDropdownColumn.prototype, "title", {
            get: function () { return this.titleValue ? this.titleValue : this.name; },
            set: function (value) { this.titleValue = value; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatrixDropdownColumn.prototype, "choices", {
            get: function () { return this.choicesValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.choicesValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        return MatrixDropdownColumn;
    }(Survey.Base));
    Survey.MatrixDropdownColumn = MatrixDropdownColumn;
    var MatrixDropdownCellModel = (function () {
        function MatrixDropdownCellModel(column, row, data, value) {
            this.column = column;
            this.row = row;
            this.data = data;
            this.cellValue = value;
        }
        Object.defineProperty(MatrixDropdownCellModel.prototype, "choices", {
            get: function () { return this.column.choices && this.column.choices.length > 0 ? this.column.choices : this.data.choices; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatrixDropdownCellModel.prototype, "optionsCaption", {
            get: function () { return this.column.optionsCaption ? this.column.optionsCaption : this.data.optionsCaption; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MatrixDropdownCellModel.prototype, "value", {
            get: function () { return this.cellValue; },
            set: function (value) {
                this.cellValue = value;
                this.data.onCellChanged(this);
                this.onValueChanged();
            },
            enumerable: true,
            configurable: true
        });
        MatrixDropdownCellModel.prototype.onValueChanged = function () {
        };
        return MatrixDropdownCellModel;
    }());
    Survey.MatrixDropdownCellModel = MatrixDropdownCellModel;
    var MatrixDropdownRowModel = (function () {
        function MatrixDropdownRowModel(name, text, data, value) {
            this.name = name;
            this.text = text;
            this.cells = [];
            this.data = data;
            this.rowValue = value;
            this.buildCells();
        }
        Object.defineProperty(MatrixDropdownRowModel.prototype, "value", {
            get: function () { return this.rowValue; },
            set: function (value) {
                this.rowValue = value;
                for (var i = 0; i < this.cells.length; i++) {
                    this.cells[i].value = this.getCellValue(this.cells[i].column);
                }
            },
            enumerable: true,
            configurable: true
        });
        MatrixDropdownRowModel.prototype.buildCells = function () {
            var columns = this.data.columns;
            for (var i = 0; i < columns.length; i++) {
                var column = columns[i];
                this.cells.push(this.createCell(column, this.getCellValue(column)));
            }
        };
        MatrixDropdownRowModel.prototype.createCell = function (column, value) {
            return new MatrixDropdownCellModel(column, this, this.data, value);
        };
        MatrixDropdownRowModel.prototype.getCellValue = function (column) {
            if (!this.rowValue)
                return null;
            return this.rowValue[column.name];
        };
        return MatrixDropdownRowModel;
    }());
    Survey.MatrixDropdownRowModel = MatrixDropdownRowModel;
    var QuestionMatrixDropdownModel = (function (_super) {
        __extends(QuestionMatrixDropdownModel, _super);
        function QuestionMatrixDropdownModel(name) {
            _super.call(this, name);
            this.name = name;
            this.columnsValue = [];
            this.rowsValue = [];
            this.choicesValue = [];
            this.isRowChanging = false;
        }
        QuestionMatrixDropdownModel.prototype.getType = function () {
            return "matrixdropdown";
        };
        Object.defineProperty(QuestionMatrixDropdownModel.prototype, "columns", {
            get: function () { return this.columnsValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDropdownModel.prototype, "rows", {
            get: function () { return this.rowsValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.rowsValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDropdownModel.prototype, "choices", {
            get: function () { return this.choicesValue; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.choicesValue, newValue);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionMatrixDropdownModel.prototype, "optionsCaption", {
            get: function () { return (this.optionsCaptionValue) ? this.optionsCaptionValue : Survey.surveyLocalization.getString("optionsCaption"); },
            set: function (newValue) { this.optionsCaptionValue = newValue; },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDropdownModel.prototype.addColumn = function (name, title) {
            if (title === void 0) { title = null; }
            var column = new MatrixDropdownColumn(name, title);
            this.columnsValue.push(column);
            return column;
        };
        Object.defineProperty(QuestionMatrixDropdownModel.prototype, "visibleRows", {
            get: function () {
                var result = new Array();
                if (!this.rows || this.rows.length === 0)
                    return result;
                var val = this.value;
                if (!val)
                    val = {};
                for (var i = 0; i < this.rows.length; i++) {
                    if (!this.rows[i].value)
                        continue;
                    result.push(this.createMatrixRow(this.rows[i].value, this.rows[i].text, val[this.rows[i].value]));
                }
                this.generatedVisibleRows = result;
                return result;
            },
            enumerable: true,
            configurable: true
        });
        QuestionMatrixDropdownModel.prototype.createMatrixRow = function (name, text, value) {
            return new MatrixDropdownRowModel(name, text, this, value);
        };
        QuestionMatrixDropdownModel.prototype.onValueChanged = function () {
            if (this.isRowChanging || !(this.generatedVisibleRows) || this.generatedVisibleRows.length == 0)
                return;
            this.isRowChanging = true;
            var val = this.value;
            if (!val)
                val = {};
            for (var i = 0; i < this.generatedVisibleRows.length; i++) {
                var row = this.generatedVisibleRows[i];
                var rowVal = val[row.name] ? val[row.name] : null;
                this.generatedVisibleRows[i].value = rowVal;
            }
            this.isRowChanging = false;
        };
        //IMatrixDropdownData
        QuestionMatrixDropdownModel.prototype.onCellChanged = function (cell) {
            var newValue = this.value;
            if (!newValue) {
                newValue = {};
            }
            var rowValue = newValue[cell.row.name];
            if (!rowValue) {
                rowValue = {};
                newValue[cell.row.name] = rowValue;
            }
            if (cell.value) {
                rowValue[cell.column.name] = cell.value;
            }
            else {
                delete rowValue[cell.column.name];
                if (Object.keys(rowValue).length == 0) {
                    delete newValue[cell.row.name];
                    if (Object.keys(newValue).length == 0) {
                        newValue = null;
                    }
                }
            }
            this.isRowChanging = true;
            this.setNewValue(newValue);
            this.isRowChanging = false;
        };
        return QuestionMatrixDropdownModel;
    }(Survey.Question));
    Survey.QuestionMatrixDropdownModel = QuestionMatrixDropdownModel;
    Survey.JsonObject.metaData.addClass("matrixdropdowncolumn", ["name", "title", "choices:itemvalues", "optionsCaption"], function () { return new MatrixDropdownColumn(""); });
    Survey.JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "title", null, null, function (obj) { return obj.titleValue; });
    Survey.JsonObject.metaData.setPropertyValues("matrixdropdowncolumn", "choices", null, null, function (obj) { return Survey.ItemValue.getData(obj.choices); }, function (obj, value) { obj.choices = value; });
    Survey.JsonObject.metaData.addClass("matrixdropdown", ["columns", "rows:itemvalues", "choices:itemvalues", "optionsCaption"], function () { return new QuestionMatrixDropdownModel(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("matrixdropdown", "columns", "matrixdropdowncolumn");
    Survey.JsonObject.metaData.setPropertyValues("matrixdropdown", "choices", null, null, function (obj) { return Survey.ItemValue.getData(obj.choices); }, function (obj, value) { obj.choices = value; });
    Survey.JsonObject.metaData.setPropertyValues("matrixdropdown", "rows", null, null, function (obj) { return Survey.ItemValue.getData(obj.rows); }, function (obj, value) { obj.rows = value; });
    Survey.JsonObject.metaData.setPropertyValues("matrixdropdown", "optionsCaption", null, null, function (obj) { return obj.optionsCaptionValue; });
    Survey.QuestionFactory.Instance.registerQuestion("matrixdropdown", function (name) { var q = new QuestionMatrixDropdownModel(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var MultipleTextItemModel = (function (_super) {
        __extends(MultipleTextItemModel, _super);
        function MultipleTextItemModel(name, title) {
            if (name === void 0) { name = null; }
            if (title === void 0) { title = null; }
            _super.call(this);
            this.name = name;
            this.validators = new Array();
            this.title = title;
        }
        MultipleTextItemModel.prototype.getType = function () {
            return "multipletextitem";
        };
        MultipleTextItemModel.prototype.setData = function (data) {
            this.data = data;
        };
        Object.defineProperty(MultipleTextItemModel.prototype, "title", {
            get: function () { return this.titleValue ? this.titleValue : this.name; },
            set: function (newText) { this.titleValue = newText; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(MultipleTextItemModel.prototype, "value", {
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
        MultipleTextItemModel.prototype.onValueChanged = function (newValue) {
        };
        //IValidatorOwner
        MultipleTextItemModel.prototype.getValidatorTitle = function () { return this.title; };
        return MultipleTextItemModel;
    }(Survey.Base));
    Survey.MultipleTextItemModel = MultipleTextItemModel;
    var QuestionMultipleTextModel = (function (_super) {
        __extends(QuestionMultipleTextModel, _super);
        function QuestionMultipleTextModel(name) {
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
        QuestionMultipleTextModel.prototype.getType = function () {
            return "multipletext";
        };
        QuestionMultipleTextModel.prototype.AddItem = function (name, title) {
            if (title === void 0) { title = null; }
            var item = this.createTextItem(name, title);
            this.items.push(item);
            return item;
        };
        QuestionMultipleTextModel.prototype.onValueChanged = function () {
            _super.prototype.onValueChanged.call(this);
            this.onItemValueChanged();
        };
        QuestionMultipleTextModel.prototype.createTextItem = function (name, title) {
            return new MultipleTextItemModel(name, title);
        };
        QuestionMultipleTextModel.prototype.onItemValueChanged = function () {
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
        QuestionMultipleTextModel.prototype.runValidators = function () {
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
        QuestionMultipleTextModel.prototype.getMultipleTextValue = function (name) {
            if (!this.value)
                return null;
            return this.value[name];
        };
        QuestionMultipleTextModel.prototype.setMultipleTextValue = function (name, value) {
            this.isMultipleItemValueChanging = true;
            var newValue = this.value;
            if (!newValue) {
                newValue = {};
            }
            newValue[name] = value;
            this.setNewValue(newValue);
            this.isMultipleItemValueChanging = false;
        };
        return QuestionMultipleTextModel;
    }(Survey.Question));
    Survey.QuestionMultipleTextModel = QuestionMultipleTextModel;
    Survey.JsonObject.metaData.addClass("multipletextitem", ["name", "title", "validators:validators"], function () { return new MultipleTextItemModel(""); });
    Survey.JsonObject.metaData.setPropertyClassInfo("multipletextitem", "validators", "surveyvalidator", "validator");
    Survey.JsonObject.metaData.setPropertyValues("multipletextitem", "title", null, null, function (obj) { return obj.titleValue; });
    Survey.JsonObject.metaData.addClass("multipletext", ["!items:textitems", "itemSize:number"], function () { return new QuestionMultipleTextModel(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("multipletext", "items", "multipletextitem");
    Survey.JsonObject.metaData.setPropertyValues("multipletext", "itemSize", null, 25);
    Survey.QuestionFactory.Instance.registerQuestion("multipletext", function (name) { var q = new QuestionMultipleTextModel(name); q.AddItem("text1"); q.AddItem("text2"); return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
// <reference path="question_baseselect.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionRadiogroupModel = (function (_super) {
        __extends(QuestionRadiogroupModel, _super);
        function QuestionRadiogroupModel(name) {
            _super.call(this, name);
            this.name = name;
        }
        QuestionRadiogroupModel.prototype.getType = function () {
            return "radiogroup";
        };
        return QuestionRadiogroupModel;
    }(Survey.QuestionCheckboxBase));
    Survey.QuestionRadiogroupModel = QuestionRadiogroupModel;
    Survey.JsonObject.metaData.addClass("radiogroup", [], function () { return new QuestionRadiogroupModel(""); }, "checkboxbase");
    Survey.QuestionFactory.Instance.registerQuestion("radiogroup", function (name) { var q = new QuestionRadiogroupModel(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionRatingModel = (function (_super) {
        __extends(QuestionRatingModel, _super);
        function QuestionRatingModel(name) {
            _super.call(this, name);
            this.name = name;
            this.rates = [];
            this.mininumRateDescription = null;
            this.maximumRateDescription = null;
        }
        Object.defineProperty(QuestionRatingModel.prototype, "rateValues", {
            get: function () { return this.rates; },
            set: function (newValue) {
                Survey.ItemValue.setData(this.rates, newValue);
                this.fireCallback(this.rateValuesChangedCallback);
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(QuestionRatingModel.prototype, "visibleRateValues", {
            get: function () {
                if (this.rateValues.length > 0)
                    return this.rateValues;
                return QuestionRatingModel.defaultRateValues;
            },
            enumerable: true,
            configurable: true
        });
        QuestionRatingModel.prototype.getType = function () {
            return "rating";
        };
        QuestionRatingModel.prototype.supportComment = function () { return true; };
        QuestionRatingModel.prototype.supportOther = function () { return true; };
        QuestionRatingModel.defaultRateValues = [];
        return QuestionRatingModel;
    }(Survey.Question));
    Survey.QuestionRatingModel = QuestionRatingModel;
    Survey.ItemValue.setData(QuestionRatingModel.defaultRateValues, [1, 2, 3, 4, 5]);
    Survey.JsonObject.metaData.addClass("rating", ["hasComment:boolean", "rateValues:itemvalues", "mininumRateDescription", "maximumRateDescription"], function () { return new QuestionRatingModel(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("rating", "rateValues", null, null, function (obj) { return Survey.ItemValue.getData(obj.rateValues); }, function (obj, value) { obj.rateValues = value; });
    Survey.QuestionFactory.Instance.registerQuestion("rating", function (name) { return new QuestionRatingModel(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
// <reference path="question.ts" />
/// <reference path="questionfactory.ts" />
/// <reference path="jsonobject.ts" />
var Survey;
(function (Survey) {
    var QuestionTextModel = (function (_super) {
        __extends(QuestionTextModel, _super);
        function QuestionTextModel(name) {
            _super.call(this, name);
            this.name = name;
            this.size = 25;
        }
        QuestionTextModel.prototype.getType = function () {
            return "text";
        };
        QuestionTextModel.prototype.isEmpty = function () {
            return _super.prototype.isEmpty.call(this) || this.value == "";
        };
        return QuestionTextModel;
    }(Survey.Question));
    Survey.QuestionTextModel = QuestionTextModel;
    Survey.JsonObject.metaData.addClass("text", ["size:number"], function () { return new QuestionTextModel(""); }, "question");
    Survey.JsonObject.metaData.setPropertyValues("text", "size", null, 25);
    Survey.QuestionFactory.Instance.registerQuestion("text", function (name) { return new QuestionTextModel(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
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
                    contains: function (value, expectedValue) { return value && value["indexOf"] && value.indexOf(expectedValue) > -1; },
                    notcontains: function (value, expectedValue) { return !value || !value["indexOf"] || value.indexOf(expectedValue) == -1; },
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
    }(Survey.Base));
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
    }(Trigger));
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
    }(SurveyTrigger));
    Survey.SurveyTriggerVisible = SurveyTriggerVisible;
    Survey.JsonObject.metaData.addClass("trigger", ["operator", "!value"]);
    Survey.JsonObject.metaData.addClass("surveytrigger", ["!name", "pages", "questions"], null, "trigger");
    Survey.JsonObject.metaData.addClass("visibletrigger", [], function () { return new SurveyTriggerVisible(); }, "surveytrigger");
})(Survey || (Survey = {}));

/// <reference path="base.ts" />
/// <reference path="page.ts" />
/// <reference path="trigger.ts" />
/// <reference path="jsonobject.ts" />
/// <reference path="dxSurveyService.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Survey;
(function (Survey) {
    var SurveyModel = (function (_super) {
        __extends(SurveyModel, _super);
        function SurveyModel(jsonObj, renderedElement) {
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
            this.requiredText = "* ";
            this.showProgressBar = "off";
            this.pages = new Array();
            this.triggers = new Array();
            this.currentPageValue = null;
            this.valuesHash = {};
            this.showPageNumbersValue = false;
            this.showQuestionNumbersValue = "on";
            this.localeValue = "";
            this.onComplete = new Survey.Event();
            this.onCurrentPageChanged = new Survey.Event();
            this.onValueChanged = new Survey.Event();
            this.onVisibleChanged = new Survey.Event();
            this.onPageVisibleChanged = new Survey.Event();
            this.onQuestionAdded = new Survey.Event();
            this.onQuestionRemoved = new Survey.Event();
            this.onValidateQuestion = new Survey.Event();
            this.onSendResult = new Survey.Event();
            this.onGetResult = new Survey.Event();
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
            this.onBeforeCreating();
            if (jsonObj) {
                this.setJsonObject(jsonObj);
                if (this.surveyId) {
                    this.loadSurveyFromService(this.surveyId, renderedElement);
                }
            }
            this.onCreating();
        }
        SurveyModel.prototype.getType = function () { return "survey"; };
        Object.defineProperty(SurveyModel.prototype, "locale", {
            get: function () { return this.localeValue; },
            set: function (value) {
                this.localeValue = value;
                Survey.surveyLocalization.currentLocale = value;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "pagePrevText", {
            get: function () { return (this.pagePrevTextValue) ? this.pagePrevTextValue : Survey.surveyLocalization.getString("pagePrevText"); },
            set: function (newValue) { this.pagePrevTextValue = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "pageNextText", {
            get: function () { return (this.pageNextTextValue) ? this.pageNextTextValue : Survey.surveyLocalization.getString("pageNextText"); },
            set: function (newValue) { this.pageNextTextValue = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "completeText", {
            get: function () { return (this.completeTextValue) ? this.completeTextValue : Survey.surveyLocalization.getString("completeText"); },
            set: function (newValue) { this.completeTextValue = newValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "showPageNumbers", {
            get: function () { return this.showPageNumbersValue; },
            set: function (value) {
                if (value === this.showPageNumbers)
                    return;
                this.showPageNumbersValue = value;
                this.updateVisibleIndexes();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "showQuestionNumbers", {
            get: function () { return this.showQuestionNumbersValue; },
            set: function (value) {
                if (value === this.showQuestionNumbers)
                    return;
                this.showQuestionNumbersValue = value;
                this.updateVisibleIndexes();
            },
            enumerable: true,
            configurable: true
        });
        ;
        ;
        Object.defineProperty(SurveyModel.prototype, "data", {
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
        Object.defineProperty(SurveyModel.prototype, "comments", {
            get: function () {
                var result = {};
                for (var key in this.valuesHash) {
                    if (key.indexOf(this.commentPrefix) > 0) {
                        result[key] = this.valuesHash[key];
                    }
                }
                return result;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "visiblePages", {
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
        Object.defineProperty(SurveyModel.prototype, "isEmpty", {
            get: function () { return this.pages.length == 0; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "PageCount", {
            get: function () {
                return this.pages.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "visiblePageCount", {
            get: function () {
                return this.visiblePages.length;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "currentPage", {
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
                this.currentPageChanged(value, oldValue);
            },
            enumerable: true,
            configurable: true
        });
        SurveyModel.prototype.currentPageChanged = function (newValue, oldValue) {
            this.onCurrentPageChanged.fire(this, { 'oldCurrentPage': oldValue, 'newCurrentPage': newValue });
        };
        Object.defineProperty(SurveyModel.prototype, "isDesignMode", {
            get: function () { return this.mode == "designer"; },
            enumerable: true,
            configurable: true
        });
        SurveyModel.prototype.nextPage = function () {
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
        Object.defineProperty(SurveyModel.prototype, "isCurrentPageHasErrors", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                return this.currentPage.hasErrors();
            },
            enumerable: true,
            configurable: true
        });
        SurveyModel.prototype.prevPage = function () {
            if (this.isFirstPage)
                return false;
            var vPages = this.visiblePages;
            var index = vPages.indexOf(this.currentPage);
            this.currentPage = vPages[index - 1];
        };
        SurveyModel.prototype.completeLastPage = function () {
            if (this.isCurrentPageHasErrors)
                return false;
            this.onComplete.fire(this, null);
            if (this.surveyPostId) {
                this.sendResult();
            }
            return true;
        };
        Object.defineProperty(SurveyModel.prototype, "isFirstPage", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                return this.visiblePages.indexOf(this.currentPage) == 0;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "isLastPage", {
            get: function () {
                if (this.currentPage == null)
                    return true;
                var vPages = this.visiblePages;
                return vPages.indexOf(this.currentPage) == vPages.length - 1;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyModel.prototype, "progressText", {
            get: function () {
                if (this.currentPage == null)
                    return "";
                var vPages = this.visiblePages;
                var index = vPages.indexOf(this.currentPage) + 1;
                return Survey.surveyLocalization.getString("progressText")["format"](index, vPages.length);
            },
            enumerable: true,
            configurable: true
        });
        SurveyModel.prototype.getPage = function (index) {
            return this.pages[index];
        };
        SurveyModel.prototype.addPage = function (page) {
            if (page == null)
                return;
            this.pages.push(page);
            this.updateVisibleIndexes();
        };
        SurveyModel.prototype.addNewPage = function (name) {
            var page = this.createNewPage(name);
            this.addPage(page);
            return page;
        };
        SurveyModel.prototype.removePage = function (page) {
            var index = this.pages.indexOf(page);
            if (index < 0)
                return;
            this.pages.splice(index, 1);
            if (this.currentPageValue == page) {
                this.currentPage = this.pages.length > 0 ? this.pages[0] : null;
            }
            this.updateVisibleIndexes();
        };
        SurveyModel.prototype.getQuestionByName = function (name) {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].name == name)
                    return questions[i];
            }
            return null;
        };
        SurveyModel.prototype.getQuestionsByNames = function (names) {
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
        SurveyModel.prototype.getPageByQuestion = function (question) {
            for (var i = 0; i < this.pages.length; i++) {
                var page = this.pages[i];
                if (page.questions.indexOf(question) > -1)
                    return page;
            }
            return null;
        };
        SurveyModel.prototype.getPageByName = function (name) {
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].name == name)
                    return this.pages[i];
            }
            return null;
        };
        SurveyModel.prototype.getPagesByNames = function (names) {
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
        SurveyModel.prototype.getAllQuestions = function (visibleOnly) {
            if (visibleOnly === void 0) { visibleOnly = false; }
            var result = new Array();
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].addQuestionsToList(result, visibleOnly);
            }
            return result;
        };
        SurveyModel.prototype.createNewPage = function (name) { return new Survey.PageModel(name); };
        SurveyModel.prototype.notifyQuestionOnValueChanged = function (name, newValue) {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                if (questions[i].name != name)
                    continue;
                questions[i].onSurveyValueChanged(newValue);
            }
            this.onValueChanged.fire(this, { 'name': name, 'value': newValue });
        };
        SurveyModel.prototype.notifyAllQuestionsOnValueChanged = function () {
            var questions = this.getAllQuestions();
            for (var i = 0; i < questions.length; i++) {
                questions[i].onSurveyValueChanged(this.getValue(questions[i].name));
            }
        };
        SurveyModel.prototype.checkTriggers = function (name, newValue) {
            for (var i = 0; i < this.triggers.length; i++) {
                if (this.triggers[i].name == name) {
                    this.triggers[i].check(newValue);
                }
            }
        };
        SurveyModel.prototype.sendResult = function (postId, clientId, isPartialCompleted) {
            if (postId === void 0) { postId = null; }
            if (clientId === void 0) { clientId = null; }
            if (isPartialCompleted === void 0) { isPartialCompleted = false; }
            if (!postId && this.surveyPostId) {
                postId = this.surveyPostId;
            }
            if (!postId)
                return;
            if (clientId) {
                this.clientId = clientId;
            }
            var self = this;
            new Survey.dxSurveyService().sendResult(postId, this.data, function (success, response) {
                self.onSendResult.fire(self, { success: success, response: response });
            }, this.clientId, isPartialCompleted);
        };
        SurveyModel.prototype.getResult = function (resultId, name) {
            var self = this;
            new Survey.dxSurveyService().getResult(resultId, name, function (success, data, dataList, response) {
                self.onGetResult.fire(self, { success: success, data: data, dataList: dataList, response: response });
            });
        };
        SurveyModel.prototype.loadSurveyFromService = function (surveyId, element) {
            if (surveyId === void 0) { surveyId = null; }
            if (element === void 0) { element = null; }
            if (surveyId) {
                this.surveyId = surveyId;
            }
            var self = this;
            new Survey.dxSurveyService().loadSurvey(this.surveyId, function (success, result, response) {
                if (success && result) {
                    self.setJsonObject(result);
                    self.onLoadSurveyFromService(element);
                }
            });
        };
        SurveyModel.prototype.onLoadSurveyFromService = function (element) {
        };
        SurveyModel.prototype.updateVisibleIndexes = function () {
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
        SurveyModel.prototype.updatePageVisibleIndexes = function (showIndex) {
            var index = 0;
            for (var i = 0; i < this.pages.length; i++) {
                this.pages[i].visibleIndex = this.pages[i].visible ? (index++) : -1;
                this.pages[i].num = showIndex && this.pages[i].visible ? this.pages[i].visibleIndex + 1 : -1;
            }
        };
        SurveyModel.prototype.updateQuestionVisibleIndexes = function (questions, showIndex) {
            var index = 0;
            for (var i = 0; i < questions.length; i++) {
                questions[i].setVisibleIndex(showIndex && questions[i].visible && questions[i].hasTitle ? (index++) : -1);
            }
        };
        SurveyModel.prototype.setJsonObject = function (jsonObj) {
            if (!jsonObj)
                return;
            this.jsonErrors = null;
            var jsonConverter = new Survey.JsonObject();
            jsonConverter.toObject(jsonObj, this);
            if (jsonConverter.errors.length > 0) {
                this.jsonErrors = jsonConverter.errors;
            }
            this.updateVisibleIndexes();
        };
        SurveyModel.prototype.onBeforeCreating = function () { };
        SurveyModel.prototype.onCreating = function () { };
        //ISurvey data
        SurveyModel.prototype.getValue = function (name) {
            if (!name || name.length == 0)
                return null;
            return this.valuesHash[name];
        };
        SurveyModel.prototype.setValue = function (name, newValue) {
            if (newValue == "" || newValue == null) {
                delete this.valuesHash[name];
            }
            else {
                this.valuesHash[name] = newValue;
            }
            this.notifyQuestionOnValueChanged(name, newValue);
            this.checkTriggers(name, newValue);
        };
        SurveyModel.prototype.getComment = function (name) {
            var result = this.data[name + this.commentPrefix];
            if (result == null)
                result = "";
            return result;
        };
        SurveyModel.prototype.setComment = function (name, newValue) {
            name = name + this.commentPrefix;
            if (newValue == "" || newValue == null) {
                delete this.valuesHash[name];
            }
            else {
                this.valuesHash[name] = newValue;
            }
        };
        SurveyModel.prototype.questionVisibilityChanged = function (question, newValue) {
            this.updateVisibleIndexes();
            this.onVisibleChanged.fire(this, { 'question': question, 'name': question.name, 'visible': newValue });
        };
        SurveyModel.prototype.pageVisibilityChanged = function (page, newValue) {
            this.updateVisibleIndexes();
            this.onPageVisibleChanged.fire(this, { 'page': page, 'visible': newValue });
        };
        SurveyModel.prototype.questionAdded = function (question, index) {
            this.updateVisibleIndexes();
            this.onQuestionAdded.fire(this, { 'question': question, 'name': question.name, 'index': index });
        };
        SurveyModel.prototype.questionRemoved = function (question) {
            this.updateVisibleIndexes();
            this.onQuestionRemoved.fire(this, { 'question': question, 'name': question.name });
        };
        SurveyModel.prototype.validateQuestion = function (name) {
            if (this.onValidateQuestion.isEmpty)
                return null;
            var options = { name: name, value: this.getValue(name), error: null };
            this.onValidateQuestion.fire(this, options);
            return options.error ? new Survey.CustomError(options.error) : null;
        };
        //ISurveyTriggerOwner
        SurveyModel.prototype.getObjects = function (pages, questions) {
            var result = [];
            Array.prototype.push.apply(result, this.getPagesByNames(pages));
            Array.prototype.push.apply(result, this.getQuestionsByNames(questions));
            return result;
        };
        return SurveyModel;
    }(Survey.Base));
    Survey.SurveyModel = SurveyModel;
    Survey.JsonObject.metaData.addClass("survey", ["locale", "title", "pages", "questions", "triggers:triggers", "surveyId", "surveyPostId", "sendResultOnPageNext:boolean",
        "showNavigationButtons:boolean", "showTitle:boolean", "showPageTitles:boolean", "showPageNumbers:boolean", "showQuestionNumbers", "showProgressBar",
        "requiredText", "pagePrevText", "pageNextText", "completeText"]);
    Survey.JsonObject.metaData.setPropertyValues("survey", "pages", "page");
    Survey.JsonObject.metaData.setPropertyValues("survey", "questions", null, null, function (obj) { return null; }, function (obj, value, jsonConverter) {
        var page = obj.addNewPage("");
        jsonConverter.toObject({ questions: value }, page);
    });
    Survey.JsonObject.metaData.setPropertyValues("survey", "showNavigationButtons", null, true);
    Survey.JsonObject.metaData.setPropertyValues("survey", "showTitle", null, true);
    Survey.JsonObject.metaData.setPropertyValues("survey", "showPageTitles", null, true);
    Survey.JsonObject.metaData.setPropertyValues("survey", "showQuestionNumbers", null, "on");
    Survey.JsonObject.metaData.setPropertyChoices("survey", "showQuestionNumbers", ["on", "onPage", "off"]);
    Survey.JsonObject.metaData.setPropertyValues("survey", "showProgressBar", null, "off");
    Survey.JsonObject.metaData.setPropertyChoices("survey", "showProgressBar", ["off", "top", "bottom"]);
    Survey.JsonObject.metaData.setPropertyValues("survey", "requiredText", null, "* ");
    Survey.JsonObject.metaData.setPropertyValues("survey", "pagePrevText", null, null, function (obj) { return obj.pagePrevTextValue; });
    Survey.JsonObject.metaData.setPropertyValues("survey", "pageNextText", null, null, function (obj) { return obj.pageNextTextValue; });
    Survey.JsonObject.metaData.setPropertyValues("survey", "completeText", null, null, function (obj) { return obj.completeTextValue; });
    Survey.JsonObject.metaData.setPropertyClassInfo("survey", "triggers", "surveytrigger", "trigger");
    Survey.JsonObject.metaData.setPropertyClassInfo("survey", "questions", "question");
    Survey.JsonObject.metaData.setPropertyChoices("survey", "locale", null, function () { return Survey.surveyLocalization.getLocales(); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var Survey;
(function (Survey) {
    var SurveyWindowModel = (function (_super) {
        __extends(SurveyWindowModel, _super);
        function SurveyWindowModel(jsonObj) {
            _super.call(this);
            this.surveyValue = this.createSurvey(jsonObj);
            this.surveyValue.showTitle = false;
            this.windowElement = document.createElement("div");
        }
        SurveyWindowModel.prototype.getType = function () { return "window"; };
        Object.defineProperty(SurveyWindowModel.prototype, "survey", {
            get: function () { return this.surveyValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyWindowModel.prototype, "isShowing", {
            get: function () { return this.isShowingValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyWindowModel.prototype, "isExpanded", {
            get: function () { return this.isExpandedValue; },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(SurveyWindowModel.prototype, "title", {
            get: function () { return this.titleValue ? this.titleValue : this.survey.title; },
            set: function (value) { this.titleValue = value; },
            enumerable: true,
            configurable: true
        });
        SurveyWindowModel.prototype.expand = function () {
            this.expandcollapse(true);
        };
        SurveyWindowModel.prototype.collapse = function () {
            this.expandcollapse(false);
        };
        SurveyWindowModel.prototype.createSurvey = function (jsonObj) {
            return new Survey.SurveyModel(jsonObj);
        };
        SurveyWindowModel.prototype.expandcollapse = function (value) {
            this.isExpandedValue = value;
        };
        SurveyWindowModel.surveyElementName = "windowSurveyJS";
        return SurveyWindowModel;
    }(Survey.Base));
    Survey.SurveyWindowModel = SurveyWindowModel;
})(Survey || (Survey = {}));

/// <reference path="..//surveyStrings.ts" />
var Survey;
(function (Survey) {
    var germanSurveyStrings = {
        pagePrevText: "Zurück",
        pageNextText: "Weiter",
        completeText: "Fertig",
        progressText: "Seite {0} von {1}",
        otherItemText: "Andere (beschreiben)",
        optionsCaption: "Wählen...",
        requiredError: "Bitte antworten Sie auf die Frage.",
        numericError: "Der Wert sollte eine Zahl sein.",
        textMinLength: "Bitte geben Sie mindestens {0} Symbole.",
        minSelectError: "Bitte wählen Sie mindestens {0} Varianten.",
        maxSelectError: "Bitte wählen Sie nicth mehr als {0} Varianten.",
        numericMinMax: "'{0}' solte gleich oder größer sein als {1} und gleich oder kleiner als {2}",
        numericMin: "'{0}' solte gleich oder größer sein als {1}",
        numericMax: "'{0}' solte gleich oder kleiner als {1}"
    };
    Survey.surveyLocalization.locales["de"] = germanSurveyStrings;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../page.ts" />
var Survey;
(function (Survey) {
    var Page = (function (_super) {
        __extends(Page, _super);
        function Page(name) {
            if (name === void 0) { name = ""; }
            _super.call(this, name);
            this.koNo = ko.observable("");
            this.onCreating();
        }
        Page.prototype.onCreating = function () { };
        Page.prototype.onNumChanged = function (value) {
            this.koNo(value > 0 ? value + ". " : "");
        };
        return Page;
    }(Survey.PageModel));
    Survey.Page = Page;
    Survey.JsonObject.metaData.overrideClassCreatore("page", function () { return new Page(); });
})(Survey || (Survey = {}));

/// <reference path="../questionbase.ts" />
var Survey;
(function (Survey) {
    var QuestionImplementorBase = (function () {
        function QuestionImplementorBase(question) {
            this.question = question;
            var self = this;
            question.visibilityChangedCallback = function () { self.onVisibilityChanged(); };
            question.visibleIndexChangedCallback = function () { self.onVisibleIndexChanged(); };
            this.koVisible = ko.observable(this.question.visible);
            this.koErrors = ko.observableArray();
            this.koNo = ko.observable(this.getNo());
            this.question["koVisible"] = this.koVisible;
            this.question["koNo"] = this.koNo;
            this.question["koErrors"] = this.koErrors;
        }
        QuestionImplementorBase.prototype.onVisibilityChanged = function () {
            this.koVisible(this.question.visible);
        };
        QuestionImplementorBase.prototype.onVisibleIndexChanged = function () {
            this.koNo(this.getNo());
        };
        QuestionImplementorBase.prototype.getNo = function () {
            return this.question.visibleIndex > -1 ? this.question.visibleIndex + 1 + ". " : "";
        };
        return QuestionImplementorBase;
    }());
    Survey.QuestionImplementorBase = QuestionImplementorBase;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question.ts" />
/// <reference path="koquestionbase.ts" />
var Survey;
(function (Survey) {
    var QuestionImplementor = (function (_super) {
        __extends(QuestionImplementor, _super);
        function QuestionImplementor(question) {
            _super.call(this, question);
            this.question = question;
            this.isUpdating = false;
            var self = this;
            question.valueChangedCallback = function () { self.onValueChanged(); };
            question.commentChangedCallback = function () { self.onCommentChanged(); };
            question.errorsChangedCallback = function () { self.onErrorsChanged(); };
            this.koValue = this.createkoValue();
            this.koComment = ko.observable(this.question.comment);
            this.koErrors(this.question.errors);
            this.koValue.subscribe(function (newValue) {
                self.updateValue(newValue);
            });
            this.koComment.subscribe(function (newValue) {
                self.updateComment(newValue);
            });
            this.question["koValue"] = this.koValue;
            this.question["koComment"] = this.koComment;
        }
        QuestionImplementor.prototype.onValueChanged = function () {
            if (this.isUpdating)
                return;
            this.setkoValue(this.question.value);
        };
        QuestionImplementor.prototype.onCommentChanged = function () {
            if (this.isUpdating)
                return;
            this.koComment(this.question.comment);
        };
        QuestionImplementor.prototype.onVisibilityChanged = function () {
            this.koVisible(this.question.visible);
        };
        QuestionImplementor.prototype.onVisibleIndexChanged = function () {
            this.koNo(this.getNo());
        };
        QuestionImplementor.prototype.onErrorsChanged = function () {
            this.koErrors(this.question.errors);
        };
        QuestionImplementor.prototype.createkoValue = function () { return ko.observable(this.question.value); };
        QuestionImplementor.prototype.setkoValue = function (newValue) {
            this.koValue(newValue);
        };
        QuestionImplementor.prototype.updateValue = function (newValue) {
            this.isUpdating = true;
            this.question.value = newValue;
            this.isUpdating = false;
        };
        QuestionImplementor.prototype.updateComment = function (newValue) {
            this.isUpdating = true;
            this.question.comment = newValue;
            this.isUpdating = false;
        };
        QuestionImplementor.prototype.getNo = function () {
            return this.question.visibleIndex > -1 ? this.question.visibleIndex + 1 + ". " : "";
        };
        return QuestionImplementor;
    }(Survey.QuestionImplementorBase));
    Survey.QuestionImplementor = QuestionImplementor;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="koquestion.ts" />
var Survey;
(function (Survey) {
    var QuestionSelectBaseImplementor = (function (_super) {
        __extends(QuestionSelectBaseImplementor, _super);
        function QuestionSelectBaseImplementor(question) {
            _super.call(this, question);
            var self = this;
            this.koOtherVisible = ko.computed(function () { self.koValue(); return self.isOtherSelected; });
            this.question["koOtherVisible"] = this.koOtherVisible;
        }
        Object.defineProperty(QuestionSelectBaseImplementor.prototype, "isOtherSelected", {
            get: function () {
                return this.question.isOtherSelected;
            },
            enumerable: true,
            configurable: true
        });
        return QuestionSelectBaseImplementor;
    }(Survey.QuestionImplementor));
    Survey.QuestionSelectBaseImplementor = QuestionSelectBaseImplementor;
    var QuestionCheckboxBaseImplementor = (function (_super) {
        __extends(QuestionCheckboxBaseImplementor, _super);
        function QuestionCheckboxBaseImplementor(question) {
            _super.call(this, question);
            this.koWidth = ko.observable(this.colWidth);
            this.question["koWidth"] = this.koWidth;
            this.question["koAfterRender"] = this.koAfterRender;
            var self = this;
            this.question.colCountChangedCallback = function () { self.onColCountChanged(); };
        }
        QuestionCheckboxBaseImplementor.prototype.onColCountChanged = function () {
            this.question["koWidth"] = ko.observable(this.colWidth);
        };
        Object.defineProperty(QuestionCheckboxBaseImplementor.prototype, "colWidth", {
            get: function () {
                var colCount = this.question.colCount;
                return colCount > 0 ? (100 / colCount) + '%' : "";
            },
            enumerable: true,
            configurable: true
        });
        QuestionCheckboxBaseImplementor.prototype.koAfterRender = function (el, con) {
            var tEl = el[0];
            if (tEl.nodeName == "#text")
                tEl.data = "";
            tEl = el[el.length - 1];
            if (tEl.nodeName == "#text")
                tEl.data = "";
        };
        return QuestionCheckboxBaseImplementor;
    }(QuestionSelectBaseImplementor));
    Survey.QuestionCheckboxBaseImplementor = QuestionCheckboxBaseImplementor;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_checkbox.ts" />
/// <reference path="koquestion_baseselect.ts" />
var Survey;
(function (Survey) {
    var QuestionCheckboxImplementor = (function (_super) {
        __extends(QuestionCheckboxImplementor, _super);
        function QuestionCheckboxImplementor(question) {
            _super.call(this, question);
        }
        QuestionCheckboxImplementor.prototype.createkoValue = function () {
            return this.question.value ? ko.observableArray(this.question.value) : ko.observableArray();
        };
        QuestionCheckboxImplementor.prototype.setkoValue = function (newValue) {
            if (newValue) {
                this.koValue([].concat(newValue));
            }
            else {
                this.koValue([]);
            }
        };
        return QuestionCheckboxImplementor;
    }(Survey.QuestionCheckboxBaseImplementor));
    var QuestionCheckbox = (function (_super) {
        __extends(QuestionCheckbox, _super);
        function QuestionCheckbox(name) {
            _super.call(this, name);
            this.name = name;
            new QuestionCheckboxImplementor(this);
        }
        return QuestionCheckbox;
    }(Survey.QuestionCheckboxModel));
    Survey.QuestionCheckbox = QuestionCheckbox;
    Survey.JsonObject.metaData.overrideClassCreatore("checkbox", function () { return new QuestionCheckbox(""); });
    Survey.QuestionFactory.Instance.registerQuestion("checkbox", function (name) { var q = new QuestionCheckbox(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_comment.ts" />
var Survey;
(function (Survey) {
    var QuestionComment = (function (_super) {
        __extends(QuestionComment, _super);
        function QuestionComment(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionImplementor(this);
        }
        return QuestionComment;
    }(Survey.QuestionCommentModel));
    Survey.QuestionComment = QuestionComment;
    Survey.JsonObject.metaData.overrideClassCreatore("comment", function () { return new QuestionComment(""); });
    Survey.QuestionFactory.Instance.registerQuestion("comment", function (name) { return new QuestionComment(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_dropdown.ts" />
var Survey;
(function (Survey) {
    var QuestionDropdown = (function (_super) {
        __extends(QuestionDropdown, _super);
        function QuestionDropdown(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionSelectBaseImplementor(this);
        }
        return QuestionDropdown;
    }(Survey.QuestionDropdownModel));
    Survey.QuestionDropdown = QuestionDropdown;
    Survey.JsonObject.metaData.overrideClassCreatore("dropdown", function () { return new QuestionDropdown(""); });
    Survey.QuestionFactory.Instance.registerQuestion("dropdown", function (name) { var q = new QuestionDropdown(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_html.ts" />
/// <reference path="koquestionbase.ts" />
var Survey;
(function (Survey) {
    var QuestionHtml = (function (_super) {
        __extends(QuestionHtml, _super);
        function QuestionHtml(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionImplementorBase(this);
        }
        return QuestionHtml;
    }(Survey.QuestionHtmlModel));
    Survey.QuestionHtml = QuestionHtml;
    Survey.JsonObject.metaData.overrideClassCreatore("html", function () { return new QuestionHtml(""); });
    Survey.QuestionFactory.Instance.registerQuestion("html", function (name) { return new QuestionHtml(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_matrix.ts" />
var Survey;
(function (Survey) {
    var MatrixRow = (function (_super) {
        __extends(MatrixRow, _super);
        function MatrixRow(name, text, fullName, data, value) {
            _super.call(this, name, text, fullName, data, value);
            this.name = name;
            this.text = text;
            this.fullName = fullName;
            this.isValueUpdating = false;
            this.koValue = ko.observable(this.value);
            var self = this;
            this.koValue.subscribe(function (newValue) {
                if (self.isValueUpdating)
                    true;
                self.value = newValue;
            });
        }
        MatrixRow.prototype.onValueChanged = function () {
            this.isValueUpdating = true;
            this.koValue(this.value);
            this.isValueUpdating = false;
        };
        return MatrixRow;
    }(Survey.MatrixRowModel));
    Survey.MatrixRow = MatrixRow;
    var QuestionMatrix = (function (_super) {
        __extends(QuestionMatrix, _super);
        function QuestionMatrix(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionImplementor(this);
        }
        QuestionMatrix.prototype.createMatrixRow = function (name, text, fullName, value) {
            return new MatrixRow(name, text, fullName, this, value);
        };
        return QuestionMatrix;
    }(Survey.QuestionMatrixModel));
    Survey.QuestionMatrix = QuestionMatrix;
    Survey.JsonObject.metaData.overrideClassCreatore("matrix", function () { return new QuestionMatrix(""); });
    Survey.QuestionFactory.Instance.registerQuestion("matrix", function (name) { var q = new QuestionMatrix(name); q.rows = ["Row 1", "Row 2"]; q.columns = ["Column 1", "Column 2", "Column 3"]; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_matrixdropdown.ts" />
var Survey;
(function (Survey) {
    var MatrixDropdownCell = (function (_super) {
        __extends(MatrixDropdownCell, _super);
        function MatrixDropdownCell(column, row, data, value) {
            _super.call(this, column, row, data, value);
            this.column = column;
            this.row = row;
            this.isValueUpdating = false;
            this.koValue = ko.observable(this.value);
            var self = this;
            this.koValue.subscribe(function (newValue) {
                if (self.isValueUpdating)
                    return;
                self.value = newValue;
            });
        }
        MatrixDropdownCell.prototype.onValueChanged = function () {
            this.isValueUpdating = true;
            this.koValue(this.value);
            this.isValueUpdating = false;
        };
        return MatrixDropdownCell;
    }(Survey.MatrixDropdownCellModel));
    Survey.MatrixDropdownCell = MatrixDropdownCell;
    var MatrixDropdownRow = (function (_super) {
        __extends(MatrixDropdownRow, _super);
        function MatrixDropdownRow(name, text, data, value) {
            _super.call(this, name, text, data, value);
            this.name = name;
            this.text = text;
        }
        MatrixDropdownRow.prototype.createCell = function (column, value) {
            return new MatrixDropdownCell(column, this, this.data, value);
        };
        return MatrixDropdownRow;
    }(Survey.MatrixDropdownRowModel));
    Survey.MatrixDropdownRow = MatrixDropdownRow;
    var QuestionMatrixDropdown = (function (_super) {
        __extends(QuestionMatrixDropdown, _super);
        function QuestionMatrixDropdown(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionImplementor(this);
        }
        QuestionMatrixDropdown.prototype.createMatrixRow = function (name, text, value) {
            return new MatrixDropdownRow(name, text, this, value);
        };
        return QuestionMatrixDropdown;
    }(Survey.QuestionMatrixDropdownModel));
    Survey.QuestionMatrixDropdown = QuestionMatrixDropdown;
    Survey.JsonObject.metaData.overrideClassCreatore("matrixdropdown", function () { return new QuestionMatrixDropdown(""); });
    Survey.QuestionFactory.Instance.registerQuestion("matrixdropdown", function (name) { var q = new QuestionMatrixDropdown(name); q.choices = [1, 2, 3, 4, 5]; q.rows = ["Row 1", "Row 2"]; q.addColumn("Column 1"); q.addColumn("Column 2"); q.addColumn("Column 3"); return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_multipletext.ts" />
var Survey;
(function (Survey) {
    var MultipleTextItem = (function (_super) {
        __extends(MultipleTextItem, _super);
        function MultipleTextItem(name, title) {
            if (name === void 0) { name = null; }
            if (title === void 0) { title = null; }
            _super.call(this, name, title);
            this.name = name;
            this.isKOValueUpdating = false;
            this.koValue = ko.observable(this.value);
            var self = this;
            this.koValue.subscribe(function (newValue) {
                if (!self.isKOValueUpdating) {
                    self.value = newValue;
                }
            });
        }
        MultipleTextItem.prototype.onValueChanged = function (newValue) {
            this.isKOValueUpdating = true;
            this.koValue(newValue);
            this.isKOValueUpdating = false;
        };
        return MultipleTextItem;
    }(Survey.MultipleTextItemModel));
    Survey.MultipleTextItem = MultipleTextItem;
    var QuestionMultipleText = (function (_super) {
        __extends(QuestionMultipleText, _super);
        function QuestionMultipleText(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionImplementor(this);
        }
        QuestionMultipleText.prototype.createTextItem = function (name, title) {
            return new MultipleTextItem(name, title);
        };
        return QuestionMultipleText;
    }(Survey.QuestionMultipleTextModel));
    Survey.QuestionMultipleText = QuestionMultipleText;
    Survey.JsonObject.metaData.overrideClassCreatore("multipletextitem", function () { return new MultipleTextItem(""); });
    Survey.JsonObject.metaData.overrideClassCreatore("multipletext", function () { return new QuestionMultipleText(""); });
    Survey.QuestionFactory.Instance.registerQuestion("multipletext", function (name) { var q = new QuestionMultipleText(name); q.AddItem("text1"); q.AddItem("text2"); return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_radiogroup.ts" />
var Survey;
(function (Survey) {
    var QuestionRadiogroup = (function (_super) {
        __extends(QuestionRadiogroup, _super);
        function QuestionRadiogroup(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionCheckboxBaseImplementor(this);
        }
        return QuestionRadiogroup;
    }(Survey.QuestionRadiogroupModel));
    Survey.QuestionRadiogroup = QuestionRadiogroup;
    Survey.JsonObject.metaData.overrideClassCreatore("radiogroup", function () { return new QuestionRadiogroup(""); });
    Survey.QuestionFactory.Instance.registerQuestion("radiogroup", function (name) { var q = new QuestionRadiogroup(name); q.choices = Survey.QuestionFactory.DefaultChoices; return q; });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_rating.ts" />
var Survey;
(function (Survey) {
    var QuestionRatingImplementor = (function (_super) {
        __extends(QuestionRatingImplementor, _super);
        function QuestionRatingImplementor(question) {
            _super.call(this, question);
            this.koVisibleRateValues = ko.observableArray(this.question.visibleRateValues);
            this.question["koVisibleRateValues"] = this.koVisibleRateValues;
            var self = this;
            this.koChange = function (val) { self.koValue(val.itemValue); };
            this.question["koChange"] = this.koChange;
            this.question.rateValuesChangedCallback = function () { self.onRateValuesChanged(); };
        }
        QuestionRatingImplementor.prototype.onRateValuesChanged = function () {
            this.koVisibleRateValues(this.question.visibleRateValues);
        };
        return QuestionRatingImplementor;
    }(Survey.QuestionImplementor));
    var QuestionRating = (function (_super) {
        __extends(QuestionRating, _super);
        function QuestionRating(name) {
            _super.call(this, name);
            this.name = name;
            new QuestionRatingImplementor(this);
        }
        return QuestionRating;
    }(Survey.QuestionRatingModel));
    Survey.QuestionRating = QuestionRating;
    Survey.JsonObject.metaData.overrideClassCreatore("rating", function () { return new QuestionRating(""); });
    Survey.QuestionFactory.Instance.registerQuestion("rating", function (name) { return new QuestionRating(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../question_text.ts" />
var Survey;
(function (Survey) {
    var QuestionText = (function (_super) {
        __extends(QuestionText, _super);
        function QuestionText(name) {
            _super.call(this, name);
            this.name = name;
            new Survey.QuestionImplementor(this);
        }
        return QuestionText;
    }(Survey.QuestionTextModel));
    Survey.QuestionText = QuestionText;
    Survey.JsonObject.metaData.overrideClassCreatore("text", function () { return new QuestionText(""); });
    Survey.QuestionFactory.Instance.registerQuestion("text", function (name) { return new QuestionText(name); });
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../survey.ts" />
var Survey;
(function (Survey) {
    var SurveyBase = (function (_super) {
        __extends(SurveyBase, _super);
        function SurveyBase(jsonObj, renderedElement) {
            if (jsonObj === void 0) { jsonObj = null; }
            if (renderedElement === void 0) { renderedElement = null; }
            _super.call(this, jsonObj, renderedElement);
            this.onRendered = new Survey.Event();
            if (typeof ko === 'undefined')
                throw new Error('knockoutjs library is not loaded.');
            this.render(renderedElement);
        }
        SurveyBase.prototype.render = function (element) {
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
            element.innerHTML = this.getTemplate();
            self.applyBinding();
            self.onRendered.fire(self, {});
        };
        SurveyBase.prototype.createNewPage = function (name) { return new Survey.Page(name); };
        SurveyBase.prototype.getTemplate = function () { throw new Error("Please override this method"); };
        SurveyBase.prototype.onBeforeCreating = function () {
            var self = this;
            this.dummyObservable = ko.observable(0);
            this.koCurrentPage = ko.computed(function () { self.dummyObservable(); return self.currentPage; });
            this.koIsFirstPage = ko.computed(function () { self.dummyObservable(); return self.isFirstPage; });
            this.koIsLastPage = ko.computed(function () { self.dummyObservable(); return self.isLastPage; });
            this.koProgressText = ko.computed(function () { self.dummyObservable(); return self.progressText; });
            this.koProgress = ko.computed(function () { self.dummyObservable(); return self.getProgress(); });
        };
        SurveyBase.prototype.currentPageChanged = function (newValue, oldValue) {
            this.updateKoCurrentPage();
            _super.prototype.currentPageChanged.call(this, newValue, oldValue);
        };
        SurveyBase.prototype.onLoadSurveyFromService = function (element) {
            this.render(element);
        };
        SurveyBase.prototype.applyBinding = function () {
            if (!this.renderedElement)
                return;
            this.updateKoCurrentPage();
            ko.cleanNode(this.renderedElement);
            ko.applyBindings(this, this.renderedElement);
        };
        SurveyBase.prototype.updateKoCurrentPage = function () {
            this.dummyObservable(this.dummyObservable() + 1);
        };
        SurveyBase.prototype.getProgress = function () {
            if (this.currentPage == null)
                return 0;
            var index = this.visiblePages.indexOf(this.currentPage) + 1;
            return Math.ceil((index * 100 / this.visiblePageCount));
        };
        return SurveyBase;
    }(Survey.SurveyModel));
    Survey.SurveyBase = SurveyBase;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../surveywindow.ts" />
/// <reference path="kosurvey.ts" />
var Survey;
(function (Survey) {
    var SurveyWindowBase = (function (_super) {
        __extends(SurveyWindowBase, _super);
        function SurveyWindowBase(jsonObj) {
            _super.call(this, jsonObj);
            this.koExpanded = ko.observable(false);
            var self = this;
            this.doExpand = function () { self.changeExpanded(); };
            this.survey.onComplete.add(function (sender) { self.onComplete(); });
        }
        SurveyWindowBase.prototype.createSurvey = function (jsonObj) {
            return new Survey.SurveyBase(jsonObj);
        };
        SurveyWindowBase.prototype.expandcollapse = function (value) {
            _super.prototype.expandcollapse.call(this, value);
            this.koExpanded(this.isExpandedValue);
        };
        Object.defineProperty(SurveyWindowBase.prototype, "template", {
            get: function () { return this.templateValue ? this.templateValue : this.getDefaultTemplate(); },
            set: function (value) { this.templateValue = value; },
            enumerable: true,
            configurable: true
        });
        SurveyWindowBase.prototype.show = function () {
            this.windowElement.innerHTML = this.template;
            ko.cleanNode(this.windowElement);
            ko.applyBindings(this, this.windowElement);
            document.body.appendChild(this.windowElement);
            this.survey.render(Survey.SurveyWindow.surveyElementName);
            this.isShowingValue = true;
        };
        SurveyWindowBase.prototype.getDefaultTemplate = function () { throw new Error("Please override this method"); };
        SurveyWindowBase.prototype.hide = function () {
            document.body.removeChild(this.windowElement);
            this.windowElement.innerHTML = "";
            this.isShowingValue = false;
        };
        SurveyWindowBase.prototype.changeExpanded = function () {
            this.expandcollapse(!this.isExpanded);
        };
        SurveyWindowBase.prototype.onComplete = function () {
            this.hide();
        };
        return SurveyWindowBase;
    }(Survey.SurveyWindowModel));
    Survey.SurveyWindowBase = SurveyWindowBase;
})(Survey || (Survey = {}));

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
    }());
    Survey.SurveyTemplateTextBase = SurveyTemplateTextBase;
})(Survey || (Survey = {}));

var template;
(function (template) {
    var ko;
    (function (ko) {
        ko.html = '<script type="text/html" id="survey-comment">  <input class="form-control" data-bind="value:$data.question.koComment, visible:$data.visible" /></script><div class="panel-heading" data-bind="visible: (title.length > 0) && showTitle">    <h3 data-bind="text:title"></h3></div><!-- ko if: koCurrentPage() --><div  class="panel-body">    <div data-bind="visible: showProgressBar ==\'top\', template: { name: \'survey-progress\', data: $data }"></div>    <div data-bind="template: { name: \'survey-page\', data: koCurrentPage }"></div>    <div style="margin-top:10px" data-bind="visible: showProgressBar ==\'bottom\', template: { name: \'survey-progress\', data: $data }"></div></div><div class="panel-footer" data-bind="visible: showNavigationButtons && !isDesignMode">    <input type="button" class="button" data-bind="value: pagePrevText, click: prevPage, visible: !koIsFirstPage()" />    <input type="button" class="button" value="Next" data-bind="value: pageNextText, click: nextPage, visible: !koIsLastPage()" />    <input type="button" class="button" value="Submit" data-bind="value: completeText, click: completeLastPage, visible: koIsLastPage()" /></div><!-- /ko --><!-- ko if: koCurrentPage() == null --><div class="panel-body">    There is no any visible page or visible question in the survey.</div><!-- /ko --><script type="text/html" id="survey-page">    <h4 data-bind="visible: (title.length > 0) && data.showPageTitles, text: koNo() + title"></h4>    <!-- ko foreach: { data: questions, as: \'question\' } -->    <!-- ko template: { name: \'survey-question\', data: question } -->    <!-- /ko -->    <!-- /ko --></script><script type="text/html" id="survey-progress">    <div class="progress center-block" style="width:60%;">        <div data-bind="style:{width: koProgress() + \'%\'}"             class="progress-bar" role="progressbar" aria-valuemin="0"             aria-valuemax="100">            <span data-bind="text:koProgressText"></span>        </div>    </div></script><script type="text/html" id="survey-question-checkbox">    <form class="form-inline">        <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div class="checkbox" data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}">            <input type="checkbox"                   data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />            <span data-bind="text: item.text"></span>        </div>        <!-- /ko -->        <div data-bind="visible:question.hasOther">            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>        </div>    </form></script><script type="text/html" id="survey-question-comment">    <textarea type="text" class="form-control" data-bind="attr: {cols: question.cols, rows: question.rows}, value:question.koValue" /></script><script type="text/html" id="survey-question-dropdown">    <select data-bind="options: question.visibleChoices, optionsText: \'text\', optionsValue: \'value\', value: question.koValue, optionsCaption: question.optionsCaption"></select>    <div data-bind="visible: question.hasOther">        <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>    </div></script><script type="text/html" id="survey-question-html">    <div data-bind="html: question.html"></div></script><script type="text/html" id="survey-question-matrix">    <table class="table">        <thead>            <tr>                <th data-bind="visible: question.hasRows"></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.text"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="visible: question.hasRows, text:row.text"></td>                <!-- ko foreach: question.columns -->                <td>                    <input type="radio" data-bind="attr: {name: row.fullName, value: $data.value}, checked: row.koValue"/>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-matrixdropdown">    <table class="table">        <thead>            <tr>                <th></th>                <!-- ko foreach: question.columns -->                <th data-bind="text:$data.title"></th>                <!-- /ko -->            </tr>        </thead>        <tbody>            <!-- ko foreach: { data: question.visibleRows, as: \'row\' } -->            <tr>                <td data-bind="text:row.text"></td>                <!-- ko foreach: row.cells -->                <td>                    <select data-bind="options: $data.choices, optionsText: \'text\', optionsValue: \'value\', value: $data.koValue, optionsCaption: $data.optionsCaption"></select>                </td>                <!-- /ko -->            </tr>            <!-- /ko -->        </tbody>    </table></script><script type="text/html" id="survey-question-multipletext">    <table class="table" data-bind="foreach: { data:  question.items, as: \'item\' }">        <tr>            <td data-bind="text: item.title"></td>            <td><input type="text" class="form-control" data-bind="attr: {size: question.itemSize}, value: item.koValue" /></td>        </tr>    </table></script><script type="text/html" id="survey-question-radiogroup">    <form class="form-inline">        <!-- ko foreach: { data: question.visibleChoices, as: \'item\', afterRender: question.koAfterRender}  -->        <div class="radio" data-bind="style:{width: question.koWidth, \'margin-right\': question.colCount == 0 ? \'5px\': \'0px\'}">            <input type="radio"                   data-bind="attr: {name: question.name, value: item.value}, checked: question.koValue" />            <span data-bind="text: item.text"></span>        </div>        <!-- /ko -->        <div data-bind="visible:question.hasOther">            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': question.koOtherVisible } }"></div>        </div>    </form></script><script type="text/html" id="survey-question-rating">    <div class="btn-group" data-toggle="buttons">        <!-- ko foreach: question.koVisibleRateValues -->        <label class="btn btn-default" data-bind="css:{active: $data.value == question.koValue()}">            <input type="radio"                    data-bind="attr: {name: question.name, id: question.name + $index(), value: $data.value}, event: { change: question.koChange}" />            <span data-bind="visible: $index() == 0, text: question.mininumRateDescription"></span>            <span data-bind="text: $data.text"></span>            <span data-bind="visible: $index() == (question.koVisibleRateValues().length-1), text: question.maximumRateDescription"></span>        </label>        <!-- /ko -->    </div></script><script type="text/html" id="survey-question-text">    <input type="text" class="form-control" data-bind="attr: {size: question.size}, value:question.koValue"/></script><script type="text/html" id="survey-question">    <div data-bind="visible: question.koVisible()">        <div class="alert alert-danger" role="alert" data-bind="visible: koErrors().length > 0, foreach: koErrors">            <div>                <span class="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>                <span data-bind="text:$data.getText()"></span>            </div>        </div>        <!-- ko if: question.hasTitle -->        <h5 data-bind="text: question.koNo() +  (question.isRequired ? question.data.requiredText : \'\') + question.title"></h5>        <!-- /ko -->        <!-- ko template: { name: \'survey-question-\' + question.getType(), data: question } -->        <!-- /ko -->        <div data-bind="visible: question.hasComment">            Other (please describe)            <div data-bind="template: { name: \'survey-comment\', data: {\'question\': question, \'visible\': true } }"></div>        </div>    </div></script>';
    })(ko = template.ko || (template.ko = {}));
})(template || (template = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="template.ko.html.ts" />
/// <reference path="../kosurvey.ts" />
var Survey;
(function (Survey_1) {
    var Survey = (function (_super) {
        __extends(Survey, _super);
        function Survey(jsonObj, renderedElement) {
            if (jsonObj === void 0) { jsonObj = null; }
            if (renderedElement === void 0) { renderedElement = null; }
            _super.call(this, jsonObj, renderedElement);
        }
        Survey.prototype.getTemplate = function () { return template.ko.html; };
        return Survey;
    }(Survey_1.SurveyBase));
    Survey_1.Survey = Survey;
})(Survey || (Survey = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="../kosurveywindow.ts" />
/// <reference path="kosurveybootstrap.ts" />
var Survey;
(function (Survey) {
    var SurveyWindow = (function (_super) {
        __extends(SurveyWindow, _super);
        function SurveyWindow(jsonObj) {
            _super.call(this, jsonObj);
        }
        SurveyWindow.prototype.createSurvey = function (jsonObj) {
            return new Survey.Survey(jsonObj);
        };
        SurveyWindow.prototype.getDefaultTemplate = function () { return template.window.ko.html; };
        return SurveyWindow;
    }(Survey.SurveyWindowBase));
    Survey.SurveyWindow = SurveyWindow;
})(Survey || (Survey = {}));

var template;
(function (template) {
    var window;
    (function (window) {
        var ko;
        (function (ko) {
            ko.html = '<div class="modal-content" style="position: fixed; bottom: 3px; right: 10px;">    <div class="modal-header panel-title">        <a href="#" data-bind="click:doExpand" style="width:100%">            <span class="pull-left" style="padding-right:10px" data-bind="text:title"></span>            <span class="glyphicon pull-right" aria-hidden="true" data-bind="css:{\'glyphicon-chevron-down\': koExpanded(), \'glyphicon-chevron-up\': !koExpanded()}"></span>        </a>    </div>    <div class="modal-body" data-bind="visible:koExpanded">        <div class="sv_window_content" id="windowSurveyJS"></div>    </div></div>';
        })(ko = window.ko || (window.ko = {}));
    })(window = template.window || (template.window = {}));
})(template || (template = {}));

var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/// <reference path="template.ko.html.ts" />
/// <reference path="../templateText.ts" />
var Survey;
(function (Survey) {
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
    }(Survey.SurveyTemplateTextBase));
    Survey.SurveyTemplateText = SurveyTemplateText;
})(Survey || (Survey = {}));

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInN1cnZleS5ib290c3RyYXAuanMiLCJiYXNlLnRzIiwiZHhTdXJ2ZXlTZXJ2aWNlLnRzIiwic3VydmV5U3RyaW5ncy50cyIsImVycm9yLnRzIiwianNvbm9iamVjdC50cyIsInF1ZXN0aW9uYmFzZS50cyIsInF1ZXN0aW9uZmFjdG9yeS50cyIsInBhZ2UudHMiLCJ2YWxpZGF0b3IudHMiLCJxdWVzdGlvbi50cyIsInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJxdWVzdGlvbl9jaGVja2JveC50cyIsInF1ZXN0aW9uX2NvbW1lbnQudHMiLCJxdWVzdGlvbl9kcm9wZG93bi50cyIsInF1ZXN0aW9uX2h0bWwudHMiLCJxdWVzdGlvbl9tYXRyaXgudHMiLCJxdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50cyIsInF1ZXN0aW9uX211bHRpcGxldGV4dC50cyIsInF1ZXN0aW9uX3JhZGlvZ3JvdXAudHMiLCJxdWVzdGlvbl9yYXRpbmcudHMiLCJxdWVzdGlvbl90ZXh0LnRzIiwidHJpZ2dlci50cyIsInN1cnZleS50cyIsInN1cnZleVdpbmRvdy50cyIsImxvY2FsaXphdGlvbi9nZXJtYW4udHMiLCJrbm9ja291dC9rb3BhZ2UudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uYmFzZS50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb24udHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX2Jhc2VzZWxlY3QudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX2NoZWNrYm94LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9jb21tZW50LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9kcm9wZG93bi50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25faHRtbC50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbWF0cml4LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50cyIsImtub2Nrb3V0L2tvcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9yYWRpb2dyb3VwLnRzIiwia25vY2tvdXQva29xdWVzdGlvbl9yYXRpbmcudHMiLCJrbm9ja291dC9rb3F1ZXN0aW9uX3RleHQudHMiLCJrbm9ja291dC9rb3N1cnZleS50cyIsImtub2Nrb3V0L2tvU3VydmV5V2luZG93LnRzIiwia25vY2tvdXQvdGVtcGxhdGVUZXh0LnRzIiwia25vY2tvdXQvYm9vdHN0cmFwL3RlbXBsYXRlLmtvLmh0bWwudHMiLCJrbm9ja291dC9ib290c3RyYXAva29TdXJ2ZXlib290c3RyYXAudHMiLCJrbm9ja291dC9ib290c3RyYXAva29TdXJ2ZXlXaW5kb3dib290c3RyYXAudHMiLCJrbm9ja291dC9ib290c3RyYXAvdGVtcGxhdGUud2luZG93LmtvLmh0bWwudHMiLCJrbm9ja291dC9ib290c3RyYXAvdGVtcGxhdGVUZXh0Ym9vdHN0cmFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEFDTkEsSUFBTyxNQUFNLENBdUhaO0FBdkhELFdBQU8sTUFBTSxFQUFDLENBQUM7SUEyQlg7UUE4QkksbUJBQVksS0FBVSxFQUFFLElBQW1CO1lBQW5CLG9CQUFtQixHQUFuQixXQUFtQjtZQUN2QyxJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztZQUNqQixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztRQUN2QixDQUFDO1FBL0JhLGlCQUFPLEdBQXJCLFVBQXNCLEtBQXVCLEVBQUUsTUFBa0I7WUFDN0QsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7WUFDakIsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7Z0JBQ3JDLElBQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDdEIsSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JB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USxLQUFSLFFBQVEsUUFBeW9COzs7Ozs7O0FDQXhwQiw0Q0FBNEM7QUFDNUMsMkNBQTJDO0FBQzNDLElBQU8sTUFBTSxDQUtaO0FBTEQsV0FBTyxNQUFNLEVBQUMsQ0FBQztJQUNYO1FBQXdDLHNDQUFzQjtRQUE5RDtZQUF3Qyw4QkFBc0I7UUFHOUQsQ0FBQztRQUZHLHNCQUFjLG9DQUFJO2lCQUFsQixjQUErQixNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO2lCQUN6RCxVQUFtQixLQUFhLElBQUksUUFBUSxDQUFDLEVBQUUsQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLENBQUMsQ0FBQzs7O1dBRE47UUFFN0QseUJBQUM7SUFBRCxDQUhBLEFBR0MsQ0FIdUMsNkJBQXNCLEdBRzdEO0lBSFkseUJBQWtCLHFCQUc5QixDQUFBO0FBQ0wsQ0FBQyxFQUxNLE1BQU0sS0FBTixNQUFNLFFBS1oiLCJmaWxlIjoic3VydmV5LmJvb3RzdHJhcC5qcyIsInNvdXJjZXNDb250ZW50IjpbbnVsbCwibW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIEhhc2hUYWJsZTxUPiB7XHJcbiAgICAgICAgW2tleTogc3RyaW5nXTogVDtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVN1cnZleSB7XHJcbiAgICAgICAgZ2V0VmFsdWUobmFtZTogc3RyaW5nKTogYW55O1xyXG4gICAgICAgIHNldFZhbHVlKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSk7XHJcbiAgICAgICAgZ2V0Q29tbWVudChuYW1lOiBzdHJpbmcpOiBzdHJpbmc7XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpO1xyXG4gICAgICAgIHBhZ2VWaXNpYmlsaXR5Q2hhbmdlZChwYWdlOiBJUGFnZSwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uVmlzaWJpbGl0eUNoYW5nZWQocXVlc3Rpb246IElRdWVzdGlvbiwgbmV3VmFsdWU6IGJvb2xlYW4pO1xyXG4gICAgICAgIHF1ZXN0aW9uQWRkZWQocXVlc3Rpb246IElRdWVzdGlvbiwgaW5kZXg6IG51bWJlcik7XHJcbiAgICAgICAgcXVlc3Rpb25SZW1vdmVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24pO1xyXG4gICAgICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3I7XHJcbiAgICAgICAgaXNEZXNpZ25Nb2RlOiBib29sZWFuO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJUXVlc3Rpb24ge1xyXG4gICAgICAgIG5hbWU6IHN0cmluZztcclxuICAgICAgICB2aXNpYmxlOiBib29sZWFuO1xyXG4gICAgICAgIGhhc1RpdGxlOiBib29sZWFuO1xyXG4gICAgICAgIHNldFZpc2libGVJbmRleCh2YWx1ZTogbnVtYmVyKTtcclxuICAgICAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KTtcclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVBhZ2Uge1xyXG4gICAgICAgIHZpc2libGU6IGJvb2xlYW47XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEl0ZW1WYWx1ZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBTZXBhcmF0b3IgPSAnfCc7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+LCB2YWx1ZXM6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgaXRlbXMubGVuZ3RoID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tpXTtcclxuICAgICAgICAgICAgICAgIHZhciBpdGVtID0gbmV3IEl0ZW1WYWx1ZShudWxsKTtcclxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgKHZhbHVlLnZhbHVlKSAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtLnRleHQgPSB2YWx1ZVtcInRleHRcIl07XHJcbiAgICAgICAgICAgICAgICAgICAgaXRlbS52YWx1ZSA9IHZhbHVlW1widmFsdWVcIl07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGl0ZW0udmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2goaXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBnZXREYXRhKGl0ZW1zOiBBcnJheTxJdGVtVmFsdWU+KTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG5ldyBBcnJheSgpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbSA9IGl0ZW1zW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKGl0ZW0uaGFzVGV4dCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHsgdmFsdWU6IGl0ZW0udmFsdWUsIHRleHQ6IGl0ZW0udGV4dCB9KTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0LnB1c2goaXRlbS52YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBpdGVtVmFsdWU6IGFueTtcclxuICAgICAgICBwcml2YXRlIGl0ZW1UZXh0OiBzdHJpbmc7XHJcbiAgICAgICAgY29uc3RydWN0b3IodmFsdWU6IGFueSwgdGV4dDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0ZXh0O1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcIml0ZW12YWx1ZVwiOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5pdGVtVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pdGVtVmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLml0ZW1WYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgc3RyOiBzdHJpbmcgPSB0aGlzLml0ZW1WYWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSBzdHIuaW5kZXhPZihJdGVtVmFsdWUuU2VwYXJhdG9yKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuaXRlbVZhbHVlID0gc3RyLnNsaWNlKDAsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGV4dCA9IHN0ci5zbGljZShpbmRleCArIDEpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVGV4dCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXRlbVRleHQgPyB0cnVlIDogZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzVGV4dCkgcmV0dXJuIHRoaXMuaXRlbVRleHQ7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlKSByZXR1cm4gdGhpcy52YWx1ZS50b1N0cmluZygpO1xyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB0ZXh0KG5ld1RleHQ6IHN0cmluZykge1xyXG4gICAgICAgICAgICB0aGlzLml0ZW1UZXh0ID0gbmV3VGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEJhc2Uge1xyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignVGhpcyBtZXRob2QgaXMgYWJzdHJhY3QnKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIEV2ZW50PFQgZXh0ZW5kcyBGdW5jdGlvbiwgT3B0aW9ucz4gIHtcclxuICAgICAgICBwcml2YXRlIGNhbGxiYWNrczogQXJyYXk8VD47XHJcbiAgICAgICAgcHVibGljIGdldCBpc0VtcHR5KCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5jYWxsYmFja3MgPT0gbnVsbCB8fCB0aGlzLmNhbGxiYWNrcy5sZW5ndGggPT0gMDsgfVxyXG4gICAgICAgIHB1YmxpYyBmaXJlKHNlbmRlcjogYW55LCBvcHRpb25zOiBPcHRpb25zKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmNhbGxiYWNrcyA9PSBudWxsKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jYWxsYmFja3MubGVuZ3RoOyBpICsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgY2FsbFJlc3VsdCA9IHRoaXMuY2FsbGJhY2tzW2ldKHNlbmRlciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGQoZnVuYzogVCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jYWxsYmFja3MgPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3MgPSBuZXcgQXJyYXk8VD4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmNhbGxiYWNrcy5wdXNoKGZ1bmMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVtb3ZlKGZ1bmM6IFQpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2FsbGJhY2tzID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jYWxsYmFja3MuaW5kZXhPZihmdW5jLCAwKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4ICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jYWxsYmFja3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIGR4U3VydmV5U2VydmljZSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHBzOi8vZHhzdXJ2ZXlhcGkuYXp1cmV3ZWJzaXRlcy5uZXQvYXBpL1N1cnZleVwiO1xyXG4gICAgICAgIC8vcHVibGljIHN0YXRpYyBzZXJ2aWNlVXJsOiBzdHJpbmcgPSBcImh0dHA6Ly9sb2NhbGhvc3Q6NTA0ODgvYXBpL1N1cnZleVwiO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgbG9hZFN1cnZleShzdXJ2ZXlJZDogc3RyaW5nLCBvbkxvYWQ6IChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkgPT4gdm9pZCkge1xyXG4gICAgICAgICAgICB2YXIgeGhyID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0U3VydmV5P3N1cnZleUlkPScgKyBzdXJ2ZXlJZCk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHhoci5vbmxvYWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgb25Mb2FkKHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZW5kUmVzdWx0KHBvc3RJZDogc3RyaW5nLCByZXN1bHQ6IEpTT04sIG9uU2VuZFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpPT4gdm9pZCwgY2xpZW50SWQ6IHN0cmluZyA9IG51bGwsIGlzUGFydGlhbENvbXBsZXRlZDogYm9vbGVhbiA9IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIHZhciB4aHIgPSBuZXcgWE1MSHR0cFJlcXVlc3QoKTtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ1BPU1QnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvcG9zdC8nKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04Jyk7XHJcbiAgICAgICAgICAgIHZhciBkYXRhID0geyBwb3N0SWQ6IHBvc3RJZCwgc3VydmV5UmVzdWx0OiBKU09OLnN0cmluZ2lmeShyZXN1bHQpIH07XHJcbiAgICAgICAgICAgIGlmIChjbGllbnRJZCkgZGF0YVsnY2xpZW50SWQnXSA9IGNsaWVudElkO1xyXG4gICAgICAgICAgICBpZiAoaXNQYXJ0aWFsQ29tcGxldGVkKSBkYXRhWydpc1BhcnRpYWxDb21wbGV0ZWQnXSA9IHRydWU7XHJcbiAgICAgICAgICAgIHZhciBkYXRhU3RyaW5naWZ5OiBzdHJpbmcgPSBKU09OLnN0cmluZ2lmeShkYXRhKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtTGVuZ3RoJywgZGF0YVN0cmluZ2lmeS5sZW5ndGgudG9TdHJpbmcoKSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIG9uU2VuZFJlc3VsdCh4aHIuc3RhdHVzID09IDIwMCwgeGhyLnJlc3BvbnNlKTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgeGhyLnNlbmQoZGF0YVN0cmluZ2lmeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRSZXN1bHQocmVzdWx0SWQ6IHN0cmluZywgbmFtZTogc3RyaW5nLCBvbkdldFJlc3VsdDogKHN1Y2Nlc3M6IGJvb2xlYW4sIGRhdGE6IGFueSwgZGF0YUxpc3Q6IEFycmF5PGFueT4sIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJm5hbWU9JyArIG5hbWU7XHJcbiAgICAgICAgICAgIHhoci5vcGVuKCdHRVQnLCBkeFN1cnZleVNlcnZpY2Uuc2VydmljZVVybCArICcvZ2V0UmVzdWx0PycgKyBkYXRhKTtcclxuICAgICAgICAgICAgeGhyLnNldFJlcXVlc3RIZWFkZXIoJ0NvbnRlbnQtVHlwZScsICdhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWQnKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB4aHIub25sb2FkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIHJlc3VsdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgbGlzdCA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICBpZiAoeGhyLnN0YXR1cyA9PSAyMDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSBKU09OLnBhcnNlKHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgbGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiByZXN1bHQuUXVlc3Rpb25SZXN1bHQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGVsID0geyBuYW1lOiBrZXksIHZhbHVlOiByZXN1bHQuUXVlc3Rpb25SZXN1bHRba2V5XSB9O1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBsaXN0LnB1c2goZWwpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG9uR2V0UmVzdWx0KHhoci5zdGF0dXMgPT0gMjAwLCByZXN1bHQsIGxpc3QsIHhoci5yZXNwb25zZSk7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIHhoci5zZW5kKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBpc0NvbXBsZXRlZChyZXN1bHRJZDogc3RyaW5nLCBjbGllbnRJZDogc3RyaW5nLCBvbklzQ29tcGxldGVkOiAoc3VjY2VzczogYm9vbGVhbiwgcmVzdWx0OiBzdHJpbmcsIHJlc3BvbnNlOiBhbnkpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgdmFyIHhociA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9ICdyZXN1bHRJZD0nICsgcmVzdWx0SWQgKyAnJmNsaWVudElkPScgKyBjbGllbnRJZDtcclxuICAgICAgICAgICAgeGhyLm9wZW4oJ0dFVCcsIGR4U3VydmV5U2VydmljZS5zZXJ2aWNlVXJsICsgJy9pc0NvbXBsZXRlZD8nICsgZGF0YSk7XHJcbiAgICAgICAgICAgIHhoci5zZXRSZXF1ZXN0SGVhZGVyKCdDb250ZW50LVR5cGUnLCAnYXBwbGljYXRpb24veC13d3ctZm9ybS11cmxlbmNvZGVkJyk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgeGhyLm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHQgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgaWYgKHhoci5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmVzdWx0ID0gSlNPTi5wYXJzZSh4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgb25Jc0NvbXBsZXRlZCh4aHIuc3RhdHVzID09IDIwMCwgcmVzdWx0LCB4aHIucmVzcG9uc2UpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB4aHIuc2VuZCgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IHZhciBzdXJ2ZXlMb2NhbGl6YXRpb24gPSB7XHJcbiAgICAgICAgY3VycmVudExvY2FsZTogXCJcIixcclxuICAgICAgICBsb2NhbGVzOiB7fSxcclxuICAgICAgICBnZXRTdHJpbmc6IGZ1bmN0aW9uIChzdHJOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIGxvYyA9IHRoaXMuY3VycmVudExvY2FsZSA/IHRoaXMubG9jYWxlc1t0aGlzLmN1cnJlbnRMb2NhbGVdIDogc3VydmV5U3RyaW5ncztcclxuICAgICAgICAgICAgaWYgKCFsb2MgfHwgIWxvY1tzdHJOYW1lXSkgbG9jID0gc3VydmV5U3RyaW5ncztcclxuICAgICAgICAgICAgcmV0dXJuIGxvY1tzdHJOYW1lXTtcclxuICAgICAgICB9LFxyXG4gICAgICAgIGdldExvY2FsZXM6IGZ1bmN0aW9uICgpOiBBcnJheTxzdHJpbmc+IHtcclxuICAgICAgICAgICAgdmFyIHJlcyA9IFtdO1xyXG4gICAgICAgICAgICByZXMucHVzaChcIlwiKTtcclxuICAgICAgICAgICAgZm9yICh2YXIga2V5IGluIHRoaXMubG9jYWxlcykge1xyXG4gICAgICAgICAgICAgICAgcmVzLnB1c2goa2V5KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzO1xyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICBleHBvcnQgdmFyIHN1cnZleVN0cmluZ3MgPSB7XHJcbiAgICAgICAgcGFnZVByZXZUZXh0OiBcIlByZXZpb3VzXCIsXHJcbiAgICAgICAgcGFnZU5leHRUZXh0OiBcIk5leHRcIixcclxuICAgICAgICBjb21wbGV0ZVRleHQ6IFwiQ29tcGxldGVcIixcclxuICAgICAgICBvdGhlckl0ZW1UZXh0OiBcIk90aGVyIChkZXNjcmliZSlcIixcclxuICAgICAgICBwcm9ncmVzc1RleHQ6IFwiUGFnZSB7MH0gb2YgezF9XCIsXHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IFwiQ2hvb3NlLi4uXCIsXHJcbiAgICAgICAgcmVxdWlyZWRFcnJvcjogXCJQbGVhc2UgYW5zd2VyIHRoZSBxdWVzdGlvbi5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiVGhlIHZhbHVlIHNob3VsZCBiZSBhIG51bWVyaWMuXCIsXHJcbiAgICAgICAgdGV4dE1pbkxlbmd0aDogXCJQbGVhc2UgZW50ZXIgYXQgbGVhc3QgezB9IHN5bWJvbHMuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwiUGxlYXNlIHNlbGVjdCBhdCBsZWFzdCB7MH0gdmFyaWFudHMuXCIsXHJcbiAgICAgICAgbWF4U2VsZWN0RXJyb3I6IFwiUGxlYXNlIHNlbGVjdCBub3QgbW9yZSB0aGFuIHswfSB2YXJpYW50cy5cIixcclxuICAgICAgICBudW1lcmljTWluTWF4OiBcIlRoZSAnezB9JyBzaG91bGQgYmUgZXF1YWwgb3IgbW9yZSB0aGFuIHsxfSBhbmQgZXF1YWwgb3IgbGVzcyB0aGFuIHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiVGhlICd7MH0nIHNob3VsZCBiZSBlcXVhbCBvciBtb3JlIHRoYW4gezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCJUaGUgJ3swfScgc2hvdWxkIGJlIGVxdWFsIG9yIGxlc3MgdGhhbiB7MX1cIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJlblwiXSA9IHN1cnZleVN0cmluZ3M7XHJcblxyXG4gICAgaWYgKCFTdHJpbmcucHJvdG90eXBlW1wiZm9ybWF0XCJdKSB7XHJcbiAgICAgICAgU3RyaW5nLnByb3RvdHlwZVtcImZvcm1hdFwiXSA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL3soXFxkKyl9L2csIGZ1bmN0aW9uIChtYXRjaCwgbnVtYmVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdHlwZW9mIGFyZ3NbbnVtYmVyXSAhPSAndW5kZWZpbmVkJ1xyXG4gICAgICAgICAgICAgICAgICAgID8gYXJnc1tudW1iZXJdXHJcbiAgICAgICAgICAgICAgICAgICAgOiBtYXRjaFxyXG4gICAgICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInN1cnZleVN0cmluZ3MudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBBbnN3ZXJSZXF1aXJlZEVycm9yIGV4dGVuZHMgU3VydmV5RXJyb3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKCkgIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJyZXF1aXJlZEVycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBSZXF1cmVOdW1lcmljRXJyb3IgZXh0ZW5kcyBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUZXh0KCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibnVtZXJpY0Vycm9yXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBDdXN0b21FcnJvciBleHRlbmRzIFN1cnZleUVycm9yIHtcclxuICAgICAgICBwcml2YXRlIHRleHQ6IHN0cmluZztcclxuICAgICAgICBjb25zdHJ1Y3Rvcih0ZXh0OiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy50ZXh0ID0gdGV4dDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFRleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudGV4dDtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBKc29uT2JqZWN0UHJvcGVydHkge1xyXG4gICAgICAgIHByaXZhdGUgdHlwZVZhbHVlOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNmdW5jOiAoKSA9PiBBcnJheTxhbnk+ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGFzc05hbWVQYXJ0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBiYXNlQ2xhc3NOYW1lOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0eXBlKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLnR5cGVWYWx1ZSA/IHRoaXMudHlwZVZhbHVlIDogXCJzdHJpbmdcIjsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdHlwZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudHlwZVZhbHVlID0gdmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RvVXNlR2V0VmFsdWUoKSB7IHJldHVybiB0aGlzLm9uR2V0VmFsdWU7IH0gXHJcbiAgICAgICAgcHVibGljIGlzRGVmYXVsdFZhbHVlKHZhbHVlOiBhbnkpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICh0aGlzLmRlZmF1bHRWYWx1ZSkgPyAodGhpcy5kZWZhdWx0VmFsdWUgPT0gdmFsdWUpIDogISh2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRWYWx1ZShvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm9uR2V0VmFsdWUpIHJldHVybiB0aGlzLm9uR2V0VmFsdWUob2JqKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVG9Vc2VTZXRWYWx1ZSgpIHsgcmV0dXJuIHRoaXMub25TZXRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRWYWx1ZShvYmo6IGFueSwgdmFsdWU6IGFueSwganNvbkNvbnY6IEpzb25PYmplY3QpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMub25TZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5vblNldFZhbHVlKG9iaiwgdmFsdWUsIGpzb25Db252KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0T2JqVHlwZShvYmpUeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmNsYXNzTmFtZVBhcnQpIHJldHVybiBvYmpUeXBlO1xyXG4gICAgICAgICAgICByZXR1cm4gb2JqVHlwZS5yZXBsYWNlKHRoaXMuY2xhc3NOYW1lUGFydCwgXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRDbGFzc05hbWUoY2xhc3NOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gKHRoaXMuY2xhc3NOYW1lUGFydCAmJiBjbGFzc05hbWUuaW5kZXhPZih0aGlzLmNsYXNzTmFtZVBhcnQpIDwgMCkgPyBjbGFzc05hbWUgKyB0aGlzLmNsYXNzTmFtZVBhcnQgOiBjbGFzc05hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc1ZhbHVlICE9IG51bGwpIHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY2hvaWNlc2Z1bmMgIT0gbnVsbCkgcmV0dXJuIHRoaXMuY2hvaWNlc2Z1bmMoKTtcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRDaG9pY2VzKHZhbHVlOiBBcnJheTxhbnk+LCB2YWx1ZUZ1bmM6ICgpID0+IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5jaG9pY2VzZnVuYyA9IHZhbHVlRnVuYztcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1ldGFkYXRhQ2xhc3Mge1xyXG4gICAgICAgIHN0YXRpYyByZXF1aXJlZFN5bWJvbCA9ICchJztcclxuICAgICAgICBzdGF0aWMgdHlwZVN5bWJvbCA9ICc6JztcclxuICAgICAgICBwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+ID0gbnVsbDtcclxuICAgICAgICByZXF1aXJlZFByb3BlcnRpZXM6IEFycmF5PHN0cmluZz4gPSBudWxsO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgcHVibGljIGNyZWF0b3I6ICgpID0+IGFueSA9IG51bGwsIHB1YmxpYyBwYXJlbnROYW1lOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllc05hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHlOYW1lID0gcHJvcGVydGllc05hbWVzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3BlcnR5VHlwZSA9IG51bGw7XHJcbiAgICAgICAgICAgICAgICB2YXIgdHlwZUluZGV4ID0gcHJvcGVydHlOYW1lLmluZGV4T2YoSnNvbk1ldGFkYXRhQ2xhc3MudHlwZVN5bWJvbCk7XHJcbiAgICAgICAgICAgICAgICBpZiAodHlwZUluZGV4ID4gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICBwcm9wZXJ0eVR5cGUgPSBwcm9wZXJ0eU5hbWUuc3Vic3RyaW5nKHR5cGVJbmRleCArIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZSA9IHByb3BlcnR5TmFtZS5zdWJzdHJpbmcoMCwgdHlwZUluZGV4KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhciBwcm9wZXJ0eU5hbWUgPSB0aGlzLmdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICAgICAgdmFyIHByb3AgPSBuZXcgSnNvbk9iamVjdFByb3BlcnR5KHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHlUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcHJvcC50eXBlID0gcHJvcGVydHlUeXBlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5wcm9wZXJ0aWVzLnB1c2gocHJvcCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGZpbmQobmFtZTogc3RyaW5nKTogSnNvbk9iamVjdFByb3BlcnR5IHtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnByb3BlcnRpZXNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gdGhpcy5wcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb3BlcnR5TmFtZShwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eU5hbWUubGVuZ3RoID09IDAgfHwgcHJvcGVydHlOYW1lWzBdICE9IEpzb25NZXRhZGF0YUNsYXNzLnJlcXVpcmVkU3ltYm9sKSByZXR1cm4gcHJvcGVydHlOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eU5hbWUgPSBwcm9wZXJ0eU5hbWUuc2xpY2UoMSk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVxdWlyZWRQcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnJlcXVpcmVkUHJvcGVydGllcy5wdXNoKHByb3BlcnR5TmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0eU5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25NZXRhZGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc2VzOiBIYXNoVGFibGU8SnNvbk1ldGFkYXRhQ2xhc3M+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjaGlsZHJlbkNsYXNzZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4+ID0ge307XHJcbiAgICAgICAgcHJpdmF0ZSBjbGFzc1Byb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgY2xhc3NSZXF1aXJlZFByb3BlcnRpZXM6IEhhc2hUYWJsZTxBcnJheTxzdHJpbmc+PiA9IHt9O1xyXG4gICAgICAgIHB1YmxpYyBhZGRDbGFzcyhuYW1lOiBzdHJpbmcsIHByb3BlcnRpZXNOYW1lczogQXJyYXk8c3RyaW5nPiwgY3JlYXRvcjogKCkgPT4gYW55ID0gbnVsbCwgcGFyZW50TmFtZTogc3RyaW5nID0gbnVsbCk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSBuZXcgSnNvbk1ldGFkYXRhQ2xhc3MobmFtZSwgcHJvcGVydGllc05hbWVzLCBjcmVhdG9yLCBwYXJlbnROYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5jbGFzc2VzW25hbWVdID0gbWV0YURhdGFDbGFzcztcclxuICAgICAgICAgICAgaWYgKHBhcmVudE5hbWUpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFjaGlsZHJlbikge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY2hpbGRyZW5DbGFzc2VzW3BhcmVudE5hbWVdID0gW107XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNoaWxkcmVuQ2xhc3Nlc1twYXJlbnROYW1lXS5wdXNoKG1ldGFEYXRhQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgb3ZlcnJpZGVDbGFzc0NyZWF0b3JlKG5hbWU6IHN0cmluZywgY3JlYXRvcjogKCkgPT4gYW55KSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChtZXRhRGF0YUNsYXNzKSB7XHJcbiAgICAgICAgICAgICAgICBtZXRhRGF0YUNsYXNzLmNyZWF0b3IgPSBjcmVhdG9yO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzZXRQcm9wZXJ0eVZhbHVlcyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwcm9wZXJ0eUNsYXNzTmFtZTogc3RyaW5nLCBkZWZhdWx0VmFsdWU6IGFueSA9IG51bGwsIG9uR2V0VmFsdWU6IChvYmo6IGFueSkgPT4gYW55ID0gbnVsbCwgb25TZXRWYWx1ZTogKG9iajogYW55LCB2YWx1ZTogYW55LCBqc29uQ29udjogSnNvbk9iamVjdCkgPT4gYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmNsYXNzTmFtZSA9IHByb3BlcnR5Q2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5kZWZhdWx0VmFsdWUgPSBkZWZhdWx0VmFsdWU7XHJcbiAgICAgICAgICAgIHByb3BlcnR5Lm9uR2V0VmFsdWUgPSBvbkdldFZhbHVlO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5vblNldFZhbHVlID0gb25TZXRWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFByb3BlcnR5Q2hvaWNlcyhuYW1lOiBzdHJpbmcsIHByb3BlcnR5TmFtZTogc3RyaW5nLCBjaG9pY2VzOiBBcnJheTxhbnk+LCBjaG9pY2VzRnVuYzogKCkgPT4gQXJyYXk8YW55PiA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnR5ID0gdGhpcy5maW5kUHJvcGVydHkobmFtZSwgcHJvcGVydHlOYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5zZXRDaG9pY2VzKGNob2ljZXMsIGNob2ljZXNGdW5jKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldFByb3BlcnR5Q2xhc3NJbmZvKG5hbWU6IHN0cmluZywgcHJvcGVydHlOYW1lOiBzdHJpbmcsIGJhc2VDbGFzc05hbWU6IHN0cmluZywgY2xhc3NOYW1lUGFydDogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShuYW1lLCBwcm9wZXJ0eU5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIXByb3BlcnR5KSByZXR1cm47XHJcbiAgICAgICAgICAgIHByb3BlcnR5LmJhc2VDbGFzc05hbWUgPSBiYXNlQ2xhc3NOYW1lO1xyXG4gICAgICAgICAgICBwcm9wZXJ0eS5jbGFzc05hbWVQYXJ0ID0gY2xhc3NOYW1lUGFydDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5jbGFzc1Byb3BlcnRpZXNbbmFtZV07XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykge1xyXG4gICAgICAgICAgICAgICAgcHJvcGVydGllcyA9IG5ldyBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+KCk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxQcm9wZXJ0aWVzKG5hbWUsIHByb3BlcnRpZXMpO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jbGFzc1Byb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlQ2xhc3MobmFtZTogc3RyaW5nKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIG1ldGFEYXRhQ2xhc3MgPSB0aGlzLmZpbmRDbGFzcyhuYW1lKTtcclxuICAgICAgICAgICAgaWYgKCFtZXRhRGF0YUNsYXNzKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIG1ldGFEYXRhQ2xhc3MuY3JlYXRvcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0Q2hpbGRyZW5DbGFzc2VzKG5hbWU6IHN0cmluZywgY2FuQmVDcmVhdGVkOiBib29sZWFuID0gZmFsc2UpOiBBcnJheTxKc29uTWV0YWRhdGFDbGFzcz4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIHRoaXMuZmlsbENoaWxkcmVuQ2xhc3NlcyhuYW1lLCBjYW5CZUNyZWF0ZWQsIHJlc3VsdCk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRSZXF1aXJlZFByb3BlcnRpZXMobmFtZTogc3RyaW5nKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gdGhpcy5jbGFzc1JlcXVpcmVkUHJvcGVydGllc1tuYW1lXTtcclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gbmV3IEFycmF5PHN0cmluZz4oKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlsbFJlcXVpcmVkUHJvcGVydGllcyhuYW1lLCBwcm9wZXJ0aWVzKTtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2xhc3NSZXF1aXJlZFByb3BlcnRpZXNbbmFtZV0gPSBwcm9wZXJ0aWVzO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBwcm9wZXJ0aWVzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxDaGlsZHJlbkNsYXNzZXMobmFtZTogc3RyaW5nLCBjYW5CZUNyZWF0ZWQ6IGJvb2xlYW4sIHJlc3VsdDogQXJyYXk8SnNvbk1ldGFkYXRhQ2xhc3M+KSB7XHJcbiAgICAgICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMuY2hpbGRyZW5DbGFzc2VzW25hbWVdO1xyXG4gICAgICAgICAgICBpZiAoIWNoaWxkcmVuKSByZXR1cm47XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY2hpbGRyZW4ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICghY2FuQmVDcmVhdGVkIHx8IGNoaWxkcmVuW2ldLmNyZWF0b3IpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQucHVzaChjaGlsZHJlbltpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLmZpbGxDaGlsZHJlbkNsYXNzZXMoY2hpbGRyZW5baV0ubmFtZSwgY2FuQmVDcmVhdGVkLCByZXN1bHQpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgZmluZENsYXNzKG5hbWU6IHN0cmluZyk6IEpzb25NZXRhZGF0YUNsYXNzIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2xhc3Nlc1tuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaW5kUHJvcGVydHkobmFtZTogc3RyaW5nLCBwcm9wZXJ0eU5hbWU6IHN0cmluZyk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIHZhciBtZXRhRGF0YUNsYXNzID0gdGhpcy5maW5kQ2xhc3MobmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiBtZXRhRGF0YUNsYXNzID8gbWV0YURhdGFDbGFzcy5maW5kKHByb3BlcnR5TmFtZSkgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbGxQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5Pikge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUHJvcGVydGllcyhtZXRhRGF0YUNsYXNzLnBhcmVudE5hbWUsIGxpc3QpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbWV0YURhdGFDbGFzcy5wcm9wZXJ0aWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFByb3BlcnR5KG1ldGFEYXRhQ2xhc3MucHJvcGVydGllc1tpXSwgbGlzdCwgbGlzdC5sZW5ndGgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkUHJvcGVydHkocHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgbGlzdDogQXJyYXk8SnNvbk9iamVjdFByb3BlcnR5PiwgZW5kSW5kZXg6IG51bWJlcikge1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSAtMTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBlbmRJbmRleDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAobGlzdFtpXS5uYW1lID09IHByb3BlcnR5Lm5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICBpbmRleCA9IGk7XHJcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IDApIHtcclxuICAgICAgICAgICAgICAgIGxpc3QucHVzaChwcm9wZXJ0eSlcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGxpc3RbaW5kZXhdID0gcHJvcGVydHk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBmaWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG5hbWU6IHN0cmluZywgbGlzdDogQXJyYXk8c3RyaW5nPikge1xyXG4gICAgICAgICAgICB2YXIgbWV0YURhdGFDbGFzcyA9IHRoaXMuZmluZENsYXNzKG5hbWUpO1xyXG4gICAgICAgICAgICBpZiAoIW1ldGFEYXRhQ2xhc3MpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucmVxdWlyZWRQcm9wZXJ0aWVzKSB7XHJcbiAgICAgICAgICAgICAgICBBcnJheS5wcm90b3R5cGUucHVzaC5hcHBseShsaXN0LCBtZXRhRGF0YUNsYXNzLnJlcXVpcmVkUHJvcGVydGllcyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5maWxsUmVxdWlyZWRQcm9wZXJ0aWVzKG1ldGFEYXRhQ2xhc3MucGFyZW50TmFtZSwgbGlzdCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbkVycm9yIHtcclxuICAgICAgICBwdWJsaWMgZGVzY3JpcHRpb246IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIGF0OiBOdW1iZXIgPSAtMTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRGdWxsRGVzY3JpcHRpb24oKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLm1lc3NhZ2UgKyAodGhpcy5kZXNjcmlwdGlvbiA/IFwiXFxuXCIgKyB0aGlzLmRlc2NyaXB0aW9uIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIEpzb25Vbmtub3duUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJ1bmtub3ducHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgJ1wiICsgcHJvcGVydHlOYW1lICsgXCInIGluIGNsYXNzICdcIiArIGNsYXNzTmFtZSArIFwiJyBpcyB1bmtub3duLlwiKTtcclxuICAgICAgICAgICAgdmFyIHByb3BlcnRpZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgaWYgKHByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gPSBcIlRoZSBsaXN0IG9mIGF2YWlsYWJsZSBwcm9wZXJ0aWVzIGFyZTogXCI7XHJcbiAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BlcnRpZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoaSA+IDApIHRoaXMuZGVzY3JpcHRpb24gKz0gXCIsIFwiO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gcHJvcGVydGllc1tpXS5uYW1lO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSAnLic7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3JCYXNlIGV4dGVuZHMgSnNvbkVycm9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nLCBwdWJsaWMgdHlwZTogc3RyaW5nLCBwdWJsaWMgbWVzc2FnZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHR5cGUsIG1lc3NhZ2UpO1xyXG4gICAgICAgICAgICB0aGlzLmRlc2NyaXB0aW9uID0gXCJUaGUgZm9sbG93aW5nIHR5cGVzIGFyZSBhdmFpbGFibGU6IFwiO1xyXG4gICAgICAgICAgICB2YXIgdHlwZXMgPSBKc29uT2JqZWN0Lm1ldGFEYXRhLmdldENoaWxkcmVuQ2xhc3NlcyhiYXNlQ2xhc3NOYW1lLCB0cnVlKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0eXBlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB0aGlzLmRlc2NyaXB0aW9uICs9IFwiLCBcIjtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGVzY3JpcHRpb24gKz0gXCInXCIgKyB0eXBlc1tpXS5uYW1lICsgXCInXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5kZXNjcmlwdGlvbiArPSBcIi5cIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk1pc3NpbmdUeXBlRXJyb3IgZXh0ZW5kcyBKc29uTWlzc2luZ1R5cGVFcnJvckJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBwcm9wZXJ0eU5hbWU6IHN0cmluZywgcHVibGljIGJhc2VDbGFzc05hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihiYXNlQ2xhc3NOYW1lLCBcIm1pc3Npbmd0eXBlcHJvcGVydHlcIiwgXCJUaGUgcHJvcGVydHkgdHlwZSBpcyBtaXNzaW5nIGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbkluY29ycmVjdFR5cGVFcnJvciBleHRlbmRzIEpzb25NaXNzaW5nVHlwZUVycm9yQmFzZSB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgYmFzZUNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGJhc2VDbGFzc05hbWUsIFwiaW5jb3JyZWN0dHlwZXByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5IHR5cGUgaXMgaW5jb3JyZWN0IGluIHRoZSBvYmplY3QuIFBsZWFzZSB0YWtlIGEgbG9vayBhdCBwcm9wZXJ0eTogJ1wiICsgcHJvcGVydHlOYW1lICsgXCInLlwiKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgSnNvblJlcXVpcmVkUHJvcGVydHlFcnJvciBleHRlbmRzIEpzb25FcnJvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHByb3BlcnR5TmFtZTogc3RyaW5nLCBwdWJsaWMgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIoXCJyZXF1aXJlZHByb3BlcnR5XCIsIFwiVGhlIHByb3BlcnR5ICdcIiArIHByb3BlcnR5TmFtZSArIFwiJyBpcyByZXF1aXJlZCBpbiBjbGFzcyAnXCIgKyBjbGFzc05hbWUgKyBcIicuXCIpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgSnNvbk9iamVjdCB7XHJcbiAgICAgICAgcHJpdmF0ZSBzdGF0aWMgdHlwZVByb3BlcnR5TmFtZSA9IFwidHlwZVwiO1xyXG4gICAgICAgIHByaXZhdGUgc3RhdGljIHBvc2l0aW9uUHJvcGVydHlOYW1lID0gXCJwb3NcIjtcclxuICAgICAgICBwcml2YXRlIHN0YXRpYyBtZXRhRGF0YVZhbHVlID0gbmV3IEpzb25NZXRhZGF0YSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgZ2V0IG1ldGFEYXRhKCkgeyByZXR1cm4gSnNvbk9iamVjdC5tZXRhRGF0YVZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGVycm9ycyA9IG5ldyBBcnJheTxKc29uRXJyb3I+KCk7XHJcbiAgICAgICAgcHVibGljIHRvSnNvbk9iamVjdChvYmo6IGFueSk6IGFueSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRvSnNvbk9iamVjdENvcmUob2JqLCBudWxsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHRvT2JqZWN0KGpzb25PYmo6IGFueSwgb2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgaWYgKCFqc29uT2JqKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gbnVsbDtcclxuICAgICAgICAgICAgaWYgKG9iai5nZXRUeXBlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4ganNvbk9iaikge1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnR5cGVQcm9wZXJ0eU5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgaWYgKGtleSA9PSBKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgb2JqW2tleV0gPSBqc29uT2JqW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvcGVydHkgPSB0aGlzLmZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzLCBrZXkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuYWRkTmV3RXJyb3IobmV3IEpzb25Vbmtub3duUHJvcGVydHlFcnJvcihrZXkudG9TdHJpbmcoKSwgb2JqLmdldFR5cGUoKSksIGpzb25PYmopOyBcclxuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHRoaXMudmFsdWVUb09iaihqc29uT2JqW2tleV0sIG9iaiwga2V5LCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHRvSnNvbk9iamVjdENvcmUob2JqOiBhbnksIHByb3BlcnR5OiBKc29uT2JqZWN0UHJvcGVydHkpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAoIW9iai5nZXRUeXBlKSByZXR1cm4gb2JqO1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGlmIChwcm9wZXJ0eSAhPSBudWxsICYmICghcHJvcGVydHkuY2xhc3NOYW1lKSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0W0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eS5nZXRPYmpUeXBlKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciBwcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRQcm9wZXJ0aWVzKG9iai5nZXRUeXBlKCkpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy52YWx1ZVRvSnNvbihvYmosIHJlc3VsdCwgcHJvcGVydGllc1tpXSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHZhbHVlVG9Kc29uKG9iajogYW55LCByZXN1bHQ6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICB2YXIgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkuaGFzVG9Vc2VHZXRWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBwcm9wZXJ0eS5nZXRWYWx1ZShvYmopO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdmFsdWUgPSBvYmpbcHJvcGVydHkubmFtZV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHByb3BlcnR5LmlzRGVmYXVsdFZhbHVlKHZhbHVlKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgYXJyVmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdmFsdWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJWYWx1ZS5wdXNoKHRoaXMudG9Kc29uT2JqZWN0Q29yZSh2YWx1ZVtpXSwgcHJvcGVydHkpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZhbHVlID0gYXJyVmFsdWUubGVuZ3RoID4gMCA/IGFyclZhbHVlIDogbnVsbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdGhpcy50b0pzb25PYmplY3RDb3JlKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwcm9wZXJ0eS5pc0RlZmF1bHRWYWx1ZSh2YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtwcm9wZXJ0eS5uYW1lXSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB2YWx1ZVRvT2JqKHZhbHVlOiBhbnksIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAocHJvcGVydHkgIT0gbnVsbCAmJiBwcm9wZXJ0eS5oYXNUb1VzZVNldFZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBwcm9wZXJ0eS5zZXRWYWx1ZShvYmosIHZhbHVlLCB0aGlzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1ZhbHVlQXJyYXkodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlVG9BcnJheSh2YWx1ZSwgb2JqLCBrZXksIHByb3BlcnR5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybjtcclxuICAgICAgICAgICAgfSBcclxuICAgICAgICAgICAgdmFyIG5ld09iaiA9IHRoaXMuY3JlYXRlTmV3T2JqKHZhbHVlLCBwcm9wZXJ0eSk7XHJcbiAgICAgICAgICAgIGlmIChuZXdPYmoubmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlLCBuZXdPYmoubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gbmV3T2JqLm5ld09iajtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAoIW5ld09iai5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSB2YWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVBcnJheSh2YWx1ZTogYW55KTogYm9vbGVhbiB7IHJldHVybiB2YWx1ZS5jb25zdHJ1Y3Rvci50b1N0cmluZygpLmluZGV4T2YoXCJBcnJheVwiKSA+IC0xOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBjcmVhdGVOZXdPYmoodmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSk6IGFueSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB7IG5ld09iajogbnVsbCwgZXJyb3I6IG51bGwgfTtcclxuICAgICAgICAgICAgdmFyIGNsYXNzTmFtZSA9IHZhbHVlW0pzb25PYmplY3QudHlwZVByb3BlcnR5TmFtZV07XHJcbiAgICAgICAgICAgIGlmICghY2xhc3NOYW1lICYmIHByb3BlcnR5ICE9IG51bGwgJiYgcHJvcGVydHkuY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUgPSBwcm9wZXJ0eS5jbGFzc05hbWU7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgY2xhc3NOYW1lID0gcHJvcGVydHkuZ2V0Q2xhc3NOYW1lKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHJlc3VsdC5uZXdPYmogPSAoY2xhc3NOYW1lKSA/IEpzb25PYmplY3QubWV0YURhdGEuY3JlYXRlQ2xhc3MoY2xhc3NOYW1lKSA6IG51bGw7XHJcbiAgICAgICAgICAgIHJlc3VsdC5lcnJvciA9IHRoaXMuY2hlY2tOZXdPYmplY3RPbkVycm9ycyhyZXN1bHQubmV3T2JqLCB2YWx1ZSwgcHJvcGVydHksIGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hlY2tOZXdPYmplY3RPbkVycm9ycyhuZXdPYmo6IGFueSwgdmFsdWU6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSwgY2xhc3NOYW1lOiBzdHJpbmcpOiBKc29uRXJyb3Ige1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBudWxsO1xyXG4gICAgICAgICAgICBpZiAobmV3T2JqKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcmVxdWlyZWRQcm9wZXJ0aWVzID0gSnNvbk9iamVjdC5tZXRhRGF0YS5nZXRSZXF1aXJlZFByb3BlcnRpZXMoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXF1aXJlZFByb3BlcnRpZXMpIHtcclxuICAgICAgICAgICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHJlcXVpcmVkUHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIXZhbHVlW3JlcXVpcmVkUHJvcGVydGllc1tpXV0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25SZXF1aXJlZFByb3BlcnR5RXJyb3IocmVxdWlyZWRQcm9wZXJ0aWVzW2ldLCBjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBpZiAocHJvcGVydHkuYmFzZUNsYXNzTmFtZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICghY2xhc3NOYW1lKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25NaXNzaW5nVHlwZUVycm9yKHByb3BlcnR5Lm5hbWUsIHByb3BlcnR5LmJhc2VDbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVycm9yID0gbmV3IEpzb25JbmNvcnJlY3RUeXBlRXJyb3IocHJvcGVydHkubmFtZSwgcHJvcGVydHkuYmFzZUNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChlcnJvcikge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hZGROZXdFcnJvcihlcnJvciwgdmFsdWUpOyBcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgYWRkTmV3RXJyb3IoZXJyb3I6IEpzb25FcnJvciwganNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChqc29uT2JqICYmIGpzb25PYmpbSnNvbk9iamVjdC5wb3NpdGlvblByb3BlcnR5TmFtZV0pIHtcclxuICAgICAgICAgICAgICAgIGVycm9yLmF0ID0ganNvbk9ialtKc29uT2JqZWN0LnBvc2l0aW9uUHJvcGVydHlOYW1lXS5zdGFydDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZVRvQXJyYXkodmFsdWU6IEFycmF5PGFueT4sIG9iajogYW55LCBrZXk6IGFueSwgcHJvcGVydHk6IEpzb25PYmplY3RQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUFycmF5KG9ialtrZXldKSkge1xyXG4gICAgICAgICAgICAgICAgb2JqW2tleV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZhbHVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLmNyZWF0ZU5ld09iaih2YWx1ZVtpXSwgcHJvcGVydHkpO1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld1ZhbHVlLm5ld09iaikge1xyXG4gICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2gobmV3VmFsdWUubmV3T2JqKTtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRvT2JqZWN0KHZhbHVlW2ldLCBuZXdWYWx1ZS5uZXdPYmopO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9ialtrZXldLnB1c2godmFsdWVbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGZpbmRQcm9wZXJ0eShwcm9wZXJ0aWVzOiBBcnJheTxKc29uT2JqZWN0UHJvcGVydHk+LCBrZXk6IGFueSk6IEpzb25PYmplY3RQcm9wZXJ0eSB7XHJcbiAgICAgICAgICAgIGlmICghcHJvcGVydGllcykgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcGVydGllcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHByb3BlcnRpZXNbaV0ubmFtZSA9PSBrZXkpIHJldHVybiBwcm9wZXJ0aWVzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJiYXNlLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkJhc2UgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVF1ZXN0aW9uIHtcclxuICAgICAgICBwcm90ZWN0ZWQgZGF0YTogSVN1cnZleTtcclxuICAgICAgICBwcml2YXRlIHZpc2libGVWYWx1ZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlSW5kZXhWYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHVibGljIHdpZHRoOiBzdHJpbmcgPSBcIjEwMCVcIjtcclxuICAgICAgICB2aXNpYmlsaXR5Q2hhbmdlZENhbGxiYWNrOiAoKSA9PiB2b2lkO1xyXG4gICAgICAgIHZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy52aXNpYmxlVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZpc2libGUodmFsOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWwgPT0gdGhpcy52aXNpYmxlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMudmlzaWJsZVZhbHVlID0gdmFsO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2liaWxpdHlDaGFuZ2VkQ2FsbGJhY2spO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucXVlc3Rpb25WaXNpYmlsaXR5Q2hhbmdlZCg8SVF1ZXN0aW9uPnRoaXMsIHRoaXMudmlzaWJsZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2aXNpYmxlSW5kZXgoKTogbnVtYmVyIHsgcmV0dXJuIHRoaXMudmlzaWJsZUluZGV4VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1RpdGxlKCk6IGJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc0NvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHNldERhdGEobmV3VmFsdWU6IElTdXJ2ZXkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMub25TZXREYXRhKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBmaXJlQ2FsbGJhY2soY2FsbGJhY2s6ICgpID0+IHZvaWQpIHtcclxuICAgICAgICAgICAgaWYgKGNhbGxiYWNrKSBjYWxsYmFjaygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICAvL0lRdWVzdGlvblxyXG4gICAgICAgIG9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmlzaWJsZUluZGV4KHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMudmlzaWJsZUluZGV4VmFsdWUgPT0gdmFsdWUpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy52aXNpYmxlSW5kZXhWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uYmFzZVwiLCBbXCIhbmFtZVwiLCBcInZpc2libGU6Ym9vbGVhblwiLCBcIndpZHRoXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJxdWVzdGlvbmJhc2VcIiwgXCJ2aXNpYmxlXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInF1ZXN0aW9uYmFzZVwiLCBcIndpZHRoXCIsIG51bGwsIFwiMTAwJVwiKTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRmFjdG9yeSB7XHJcbiAgICAgICAgcHVibGljIHN0YXRpYyBJbnN0YW5jZTogUXVlc3Rpb25GYWN0b3J5ID0gbmV3IFF1ZXN0aW9uRmFjdG9yeSgpO1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgRGVmYXVsdENob2ljZXMgPSBbXCJvbmVcIiwgXCJ0d298c2Vjb25kIHZhbHVlXCIsIHsgdmFsdWU6IDMsIHRleHQ6IFwidGhpcmQgdmFsdWVcIiB9XTtcclxuICAgICAgICBwcml2YXRlIGNyZWF0b3JIYXNoOiBIYXNoVGFibGU8KG5hbWU6IHN0cmluZykgPT4gUXVlc3Rpb25CYXNlPiA9IHt9O1xyXG5cclxuICAgICAgICBwdWJsaWMgcmVnaXN0ZXJRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgcXVlc3Rpb25DcmVhdG9yOiAobmFtZTogc3RyaW5nKSA9PiBRdWVzdGlvbkJhc2UpIHtcclxuICAgICAgICAgICAgdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdID0gcXVlc3Rpb25DcmVhdG9yO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0QWxsVHlwZXMoKTogQXJyYXk8c3RyaW5nPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8c3RyaW5nPigpO1xyXG4gICAgICAgICAgICBmb3IodmFyIGtleSBpbiB0aGlzLmNyZWF0b3JIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaChrZXkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQuc29ydCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY3JlYXRlUXVlc3Rpb24ocXVlc3Rpb25UeXBlOiBzdHJpbmcsIG5hbWU6IHN0cmluZyk6IFF1ZXN0aW9uQmFzZSB7XHJcbiAgICAgICAgICAgIHZhciBjcmVhdG9yID0gdGhpcy5jcmVhdG9ySGFzaFtxdWVzdGlvblR5cGVdO1xyXG4gICAgICAgICAgICBpZiAoY3JlYXRvciA9PSBudWxsKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIGNyZWF0b3IobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcblxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBQYWdlTW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVBhZ2Uge1xyXG4gICAgICAgIHF1ZXN0aW9uczogQXJyYXk8UXVlc3Rpb25CYXNlPiA9IG5ldyBBcnJheTxRdWVzdGlvbkJhc2U+KCk7XHJcbiAgICAgICAgcHVibGljIGRhdGE6IElTdXJ2ZXkgPSBudWxsO1xyXG5cclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHZpc2libGVJbmRleDogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSBudW1WYWx1ZTogbnVtYmVyID0gLTE7XHJcbiAgICAgICAgcHJpdmF0ZSB2aXNpYmxlVmFsdWU6IGJvb2xlYW4gPSB0cnVlO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcgPSBcIlwiKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMucHVzaCA9IGZ1bmN0aW9uICh2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUuc2V0RGF0YShzZWxmLmRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG51bSgpIHsgcmV0dXJuIHRoaXMubnVtVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IG51bSh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm51bVZhbHVlID09IHZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMubnVtVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5vbk51bUNoYW5nZWQodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGUoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZpc2libGVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmlzaWJsZSh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnZpc2libGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZGF0YS5wYWdlVmlzaWJpbGl0eUNoYW5nZWQodGhpcywgdGhpcy52aXNpYmxlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJwYWdlXCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzVmlzaWJsZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnZpc2libGUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb25CYXNlLCBpbmRleDogbnVtYmVyID0gLTEpIHtcclxuICAgICAgICAgICAgaWYgKHF1ZXN0aW9uID09IG51bGwpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCB8fCBpbmRleCA+PSB0aGlzLnF1ZXN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnB1c2gocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5xdWVzdGlvbnMuc3BsaWNlKGluZGV4LCAwLCBxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMuZGF0YSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBxdWVzdGlvbi5zZXREYXRhKHRoaXMuZGF0YSk7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmRhdGEucXVlc3Rpb25BZGRlZChxdWVzdGlvbiwgaW5kZXgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGROZXdRdWVzdGlvbihxdWVzdGlvblR5cGU6IHN0cmluZywgbmFtZTogc3RyaW5nKTogUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICAgICAgdmFyIHF1ZXN0aW9uID0gUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLmNyZWF0ZVF1ZXN0aW9uKHF1ZXN0aW9uVHlwZSwgbmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUXVlc3Rpb24ocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICByZXR1cm4gcXVlc3Rpb247XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyByZW1vdmVRdWVzdGlvbihxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucXVlc3Rpb25zLmluZGV4T2YocXVlc3Rpb24pO1xyXG4gICAgICAgICAgICBpZiAoaW5kZXggPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkgdGhpcy5kYXRhLnF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBoYXNFcnJvcnMoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBmYWxzZTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLnF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHRoaXMucXVlc3Rpb25zW2ldLnZpc2libGUgJiYgdGhpcy5xdWVzdGlvbnNbaV0uaGFzRXJyb3JzKCkpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRRdWVzdGlvbnNUb0xpc3QobGlzdDogQXJyYXk8SVF1ZXN0aW9uPiwgdmlzaWJsZU9ubHk6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodmlzaWJsZU9ubHkgJiYgIXRoaXMudmlzaWJsZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5xdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh2aXNpYmxlT25seSAmJiAhdGhpcy5xdWVzdGlvbnNbaV0udmlzaWJsZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBsaXN0LnB1c2godGhpcy5xdWVzdGlvbnNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbk51bUNoYW5nZWQodmFsdWU6IG51bWJlcikge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJwYWdlXCIsIFtcIm5hbWVcIiwgXCJxdWVzdGlvbnNcIiwgXCJ2aXNpYmxlOmJvb2xlYW5cIiwgXCJ0aXRsZVwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFBhZ2VNb2RlbCgpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJwYWdlXCIsIFwidmlzaWJsZVwiLCBudWxsLCB0cnVlKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8oXCJwYWdlXCIsIFwicXVlc3Rpb25zXCIsIFwicXVlc3Rpb25cIik7XHJcbiB9IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZXJyb3IudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIHZhbHVlOiBhbnksIHB1YmxpYyBlcnJvcjogU3VydmV5RXJyb3IgPSBudWxsKSB7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VmFsaWRhdG9yIGV4dGVuZHMgQmFzZSB7XHJcbiAgICAgICAgcHVibGljIHRleHQ6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRFcnJvclRleHQobmFtZTogc3RyaW5nKSA6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnRleHQpIHJldHVybiB0aGlzLnRleHQ7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRFcnJvclRleHQobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICB2YWxpZGF0b3JzOiBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+O1xyXG4gICAgICAgIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nO1xyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFZhbGlkYXRvclJ1bm5lciB7XHJcbiAgICAgICAgcHVibGljIHJ1bihvd25lcjogSVZhbGlkYXRvck93bmVyKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG93bmVyLnZhbGlkYXRvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciB2YWxpZGF0b3JSZXN1bHQgPSBvd25lci52YWxpZGF0b3JzW2ldLnZhbGlkYXRlKG93bmVyLnZhbHVlLCBvd25lci5nZXRWYWxpZGF0b3JUaXRsZSgpKTtcclxuICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZGF0b3JSZXN1bHQuZXJyb3IpIHJldHVybiB2YWxpZGF0b3JSZXN1bHQuZXJyb3I7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHZhbGlkYXRvclJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBvd25lci52YWx1ZSA9IHZhbGlkYXRvclJlc3VsdC52YWx1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBOdW1lcmljVmFsaWRhdG9yIGV4dGVuZHMgU3VydmV5VmFsaWRhdG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbWluVmFsdWU6IG51bWJlciA9IG51bGwsIHB1YmxpYyBtYXhWYWx1ZTogbnVtYmVyID0gbnVsbCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJudW1lcmljdmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICghdmFsdWUgfHwgIXRoaXMuaXNOdW1iZXIodmFsdWUpKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgUmVxdXJlTnVtZXJpY0Vycm9yKCkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgVmFsaWRhdG9yUmVzdWx0KHBhcnNlRmxvYXQodmFsdWUpKTtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5taW5WYWx1ZSA+IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4VmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSA8IHJlc3VsdC52YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LmVycm9yID0gbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuICh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInKSA/IG51bGwgOiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICB2YXIgdk5hbWUgPSBuYW1lID8gbmFtZSA6IFwidmFsdWVcIjtcclxuICAgICAgICAgICAgaWYgKHRoaXMubWluVmFsdWUgJiYgdGhpcy5tYXhWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljTWluTWF4XCIpW1wiZm9ybWF0XCJdKHZOYW1lLCB0aGlzLm1pblZhbHVlLCB0aGlzLm1heFZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLm1pblZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJudW1lcmljTWluXCIpW1wiZm9ybWF0XCJdKHZOYW1lLCB0aGlzLm1pblZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm51bWVyaWNNYXhcIilbXCJmb3JtYXRcIl0odk5hbWUsIHRoaXMubWF4VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNOdW1iZXIodmFsdWUpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuICFpc05hTihwYXJzZUZsb2F0KHZhbHVlKSkgJiYgaXNGaW5pdGUodmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgVGV4dFZhbGlkYXRvciBleHRlbmRzIFN1cnZleVZhbGlkYXRvciB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG1pbkxlbmd0aDogbnVtYmVyID0gMCkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcgeyByZXR1cm4gXCJ0ZXh0dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLm1pbkxlbmd0aCA8PSAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZS5sZW5ndGggPCB0aGlzLm1pbkxlbmd0aCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5ldyBWYWxpZGF0b3JSZXN1bHQobnVsbCwgbmV3IEN1c3RvbUVycm9yKHRoaXMuZ2V0RXJyb3JUZXh0KG5hbWUpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXREZWZhdWx0RXJyb3JUZXh0KG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInRleHRNaW5MZW5ndGhcIilbXCJmb3JtYXRcIl0odGhpcy5taW5MZW5ndGgpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgQW5zd2VyQ291bnRWYWxpZGF0b3IgZXh0ZW5kcyBTdXJ2ZXlWYWxpZGF0b3Ige1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBtaW5Db3VudDogbnVtYmVyID0gbnVsbCwgcHVibGljIG1heENvdW50OiBudW1iZXIgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7IHJldHVybiBcImFuc3dlcmNvdW50dmFsaWRhdG9yXCI7IH1cclxuICAgICAgICBwdWJsaWMgdmFsaWRhdGUodmFsdWU6IGFueSwgbmFtZTogc3RyaW5nID0gbnVsbCk6IFZhbGlkYXRvclJlc3VsdCB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PSBudWxsIHx8IHZhbHVlLmNvbnN0cnVjdG9yICE9IEFycmF5KSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgdmFyIGNvdW50ID0gdmFsdWUubGVuZ3RoO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5taW5Db3VudCAmJiBjb3VudCA8IHRoaXMubWluQ291bnQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUmVzdWx0KG51bGwsIG5ldyBDdXN0b21FcnJvcih0aGlzLmdldEVycm9yVGV4dChzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwibWluU2VsZWN0RXJyb3JcIilbXCJmb3JtYXRcIl0odGhpcy5taW5Db3VudCkpKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHRoaXMubWF4Q291bnQgJiYgY291bnQgPiB0aGlzLm1heENvdW50KSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gbmV3IFZhbGlkYXRvclJlc3VsdChudWxsLCBuZXcgQ3VzdG9tRXJyb3IodGhpcy5nZXRFcnJvclRleHQoc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcIm1heFNlbGVjdEVycm9yXCIpW1wiZm9ybWF0XCJdKHRoaXMubWF4Q291bnQpKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdEVycm9yVGV4dChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5hbWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic3VydmV5dmFsaWRhdG9yXCIsIFtcInRleHRcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm51bWVyaWN2YWxpZGF0b3JcIiwgW1wibWluVmFsdWU6bnVtYmVyXCIsIFwibWF4VmFsdWU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTnVtZXJpY1ZhbGlkYXRvcigpOyB9LCBcInN1cnZleXZhbGlkYXRvclwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJ0ZXh0dmFsaWRhdG9yXCIsIFtcIm1pbkxlbmd0aDpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBUZXh0VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImFuc3dlcmNvdW50dmFsaWRhdG9yXCIsIFtcIm1pbkNvdW50Om51bWJlclwiLCBcIm1heENvdW50Om51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IEFuc3dlckNvdW50VmFsaWRhdG9yKCk7IH0sIFwic3VydmV5dmFsaWRhdG9yXCIpO1xyXG4gXHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImVycm9yLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInZhbGlkYXRvci50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uIGV4dGVuZHMgUXVlc3Rpb25CYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICBwcml2YXRlIHRpdGxlVmFsdWU6IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSBxdWVzdGlvblZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHJpdmF0ZSBpc1JlcXVpcmVkVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGhhc0NvbW1lbnRWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIHByaXZhdGUgaGFzT3RoZXJWYWx1ZTogYm9vbGVhbiA9IGZhbHNlO1xyXG4gICAgICAgIGVycm9yczogQXJyYXk8U3VydmV5RXJyb3I+ID0gW107XHJcbiAgICAgICAgdmFsaWRhdG9yczogQXJyYXk8U3VydmV5VmFsaWRhdG9yPiA9IG5ldyBBcnJheTxTdXJ2ZXlWYWxpZGF0b3I+KCk7XHJcbiAgICAgICAgdmFsdWVDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgY29tbWVudENoYW5nZWRDYWxsYmFjazogKCkgPT4gdm9pZDtcclxuICAgICAgICBlcnJvcnNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzVGl0bGUoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gKHRoaXMudGl0bGVWYWx1ZSkgPyB0aGlzLnRpdGxlVmFsdWUgOiB0aGlzLm5hbWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKG5ld1ZhbHVlOiBzdHJpbmcpIHsgdGhpcy50aXRsZVZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc3VwcG9ydENvbW1lbnQoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiBmYWxzZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNSZXF1aXJlZCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNSZXF1aXJlZFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBpc1JlcXVpcmVkKHZhbDogYm9vbGVhbikgeyB0aGlzLmlzUmVxdWlyZWRWYWx1ZSA9IHZhbDsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaGFzQ29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaGFzQ29tbWVudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBoYXNDb21tZW50KHZhbDogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuc3VwcG9ydENvbW1lbnQoKSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmhhc0NvbW1lbnRWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzQ29tbWVudCkgdGhpcy5oYXNPdGhlciA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc090aGVyKCk6IGJvb2xlYW4geyByZXR1cm4gdGhpcy5oYXNPdGhlclZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBoYXNPdGhlcih2YWw6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnN1cHBvcnRPdGhlcigpKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuaGFzT3RoZXJWYWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaGFzT3RoZXIpIHRoaXMuaGFzQ29tbWVudCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25TZXREYXRhKCkge1xyXG4gICAgICAgICAgICBzdXBlci5vblNldERhdGEoKTtcclxuICAgICAgICAgICAgdGhpcy5vblN1cnZleVZhbHVlQ2hhbmdlZCh0aGlzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICE9IG51bGwpIHJldHVybiB0aGlzLmRhdGEuZ2V0VmFsdWUodGhpcy5uYW1lKTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb25WYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLnZhbHVlQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb21tZW50KCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmRhdGEgIT0gbnVsbCA/IHRoaXMuZGF0YS5nZXRDb21tZW50KHRoaXMubmFtZSkgOiBcIlwiOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb21tZW50KG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXROZXdDb21tZW50KG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5jb21tZW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGlzRW1wdHkoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLnZhbHVlID09IG51bGw7IH1cclxuICAgICAgICBwdWJsaWMgaGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrRm9yRXJyb3JzKCk7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrRm9yRXJyb3JzKCkge1xyXG4gICAgICAgICAgICB2YXIgZXJyb3JMZW5ndGggPSB0aGlzLmVycm9ycyA/IHRoaXMuZXJyb3JzLmxlbmd0aCA6IDA7XHJcbiAgICAgICAgICAgIHRoaXMuZXJyb3JzID0gW107XHJcbiAgICAgICAgICAgIHRoaXMub25DaGVja0ZvckVycm9ycyh0aGlzLmVycm9ycyk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmVycm9ycy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGVycm9yID0gdGhpcy5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgICAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKGVycm9yKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5kYXRhICYmIHRoaXMuZXJyb3JzLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgZXJyb3IgPSB0aGlzLmRhdGEudmFsaWRhdGVRdWVzdGlvbih0aGlzLm5hbWUpO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5lcnJvcnMucHVzaChlcnJvcik7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVycm9yTGVuZ3RoICE9IHRoaXMuZXJyb3JzLmxlbmd0aCB8fCBlcnJvckxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuZmlyZUNhbGxiYWNrKHRoaXMuZXJyb3JzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25DaGVja0ZvckVycm9ycyhlcnJvcnM6IEFycmF5PFN1cnZleUVycm9yPikge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1JlcXVpcmVkKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5pc0VtcHR5KCkpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKG5ldyBBbnN3ZXJSZXF1aXJlZEVycm9yKCkpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwcm90ZWN0ZWQgcnVuVmFsaWRhdG9ycygpOiBTdXJ2ZXlFcnJvciB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVDaGFuZ2VkSW5TdXJ2ZXkgPSBmYWxzZTtcclxuICAgICAgICBwcm90ZWN0ZWQgc2V0TmV3VmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSAmJiB0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldFZhbHVlKHRoaXMubmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25WYWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHsgfVxyXG4gICAgICAgIHByaXZhdGUgc2V0TmV3Q29tbWVudChuZXdWYWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldENvbW1lbnQodGhpcy5uYW1lLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JUXVlc3Rpb25cclxuICAgICAgICBvblN1cnZleVZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZUNoYW5nZWRJblN1cnZleSA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlQ2hhbmdlZEluU3VydmV5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vSVZhbGlkYXRvck93bmVyXHJcbiAgICAgICAgZ2V0VmFsaWRhdG9yVGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIG51bGw7IH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInF1ZXN0aW9uXCIsIFtcInRpdGxlXCIsIFwiaXNSZXF1aXJlZDpib29sZWFuXCIsIFwidmFsaWRhdG9yczp2YWxpZGF0b3JzXCJdLCBudWxsLCBcInF1ZXN0aW9uYmFzZVwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJxdWVzdGlvblwiLCBcInRpdGxlXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwicXVlc3Rpb25cIiwgXCJ2YWxpZGF0b3JzXCIsIFwic3VydmV5dmFsaWRhdG9yXCIsIFwidmFsaWRhdG9yXCIpO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJzdXJ2ZXlzdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25TZWxlY3RCYXNlIGV4dGVuZHMgUXVlc3Rpb24ge1xyXG4gICAgICAgIG90aGVySXRlbTogSXRlbVZhbHVlID0gbmV3IEl0ZW1WYWx1ZShcIm90aGVyXCIsIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpKTtcclxuICAgICAgICBwdWJsaWMgY2hvaWNlc1ZhbHVlczogQXJyYXk8SXRlbVZhbHVlPiA9IG5ldyBBcnJheTxJdGVtVmFsdWU+KCk7XHJcbiAgICAgICAgcHVibGljIG90aGVyRXJyb3JUZXh0OiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIGNob2ljZXNPcmRlclZhbHVlOiBzdHJpbmcgPSBcIm5vbmVcIjtcclxuICAgICAgICBjb25zdHJ1Y3RvcihuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNPdGhlclNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52YWx1ZSA9PSB0aGlzLm90aGVySXRlbS52YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGNob2ljZXMoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLmNob2ljZXNWYWx1ZXM7IH1cclxuICAgICAgICBzZXQgY2hvaWNlcyhuZXdWYWx1ZTogQXJyYXk8YW55Pikge1xyXG4gICAgICAgICAgICBJdGVtVmFsdWUuc2V0RGF0YSh0aGlzLmNob2ljZXNWYWx1ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IGNob2ljZXNPcmRlcigpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZTsgfVxyXG4gICAgICAgIHNldCBjaG9pY2VzT3JkZXIobmV3VmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWUgPT0gdGhpcy5jaG9pY2VzT3JkZXJWYWx1ZSkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmNob2ljZXNPcmRlclZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBvdGhlclRleHQoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3RoZXJJdGVtLnRleHQ7IH1cclxuICAgICAgICBzZXQgb3RoZXJUZXh0KHZhbHVlOiBzdHJpbmcpIHsgdGhpcy5vdGhlckl0ZW0udGV4dCA9IHZhbHVlOyB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVDaG9pY2VzKCk6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaGFzT3RoZXIgJiYgdGhpcy5jaG9pY2VzT3JkZXIgPT0gXCJub25lXCIpIHJldHVybiB0aGlzLmNob2ljZXM7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLnNvcnRWaXNpYmxlQ2hvaWNlcyh0aGlzLmNob2ljZXMuc2xpY2UoKSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmhhc090aGVyKSB7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLm90aGVySXRlbSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRDb21tZW50KCk6IGJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0T3RoZXIoKTogYm9vbGVhbiB7IHJldHVybiB0cnVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ2hlY2tGb3JFcnJvcnMoZXJyb3JzOiBBcnJheTxTdXJ2ZXlFcnJvcj4pIHtcclxuICAgICAgICAgICAgc3VwZXIub25DaGVja0ZvckVycm9ycyhlcnJvcnMpO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMuaXNPdGhlclNlbGVjdGVkIHx8IHRoaXMuY29tbWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB2YXIgdGV4dCA9IHRoaXMub3RoZXJFcnJvclRleHQ7XHJcbiAgICAgICAgICAgIGlmICghdGV4dCkge1xyXG4gICAgICAgICAgICAgICAgdGV4dCA9IFwiUGxlYXNlIGVudGVyIHRoZSBvdGhlcnMgdmFsdWUuXCI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZXJyb3JzLnB1c2gobmV3IEN1c3RvbUVycm9yKHRleHQpKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc29ydFZpc2libGVDaG9pY2VzKGFycmF5OiBBcnJheTxJdGVtVmFsdWU+KTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIHZhciBvcmRlciA9IHRoaXMuY2hvaWNlc09yZGVyLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIGlmIChvcmRlciA9PSBcImFzY1wiKSByZXR1cm4gdGhpcy5zb3J0QXJyYXkoYXJyYXksIDEpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJkZXNjXCIpIHJldHVybiB0aGlzLnNvcnRBcnJheShhcnJheSwgLTEpO1xyXG4gICAgICAgICAgICBpZiAob3JkZXIgPT0gXCJyYW5kb21cIikgcmV0dXJuIHRoaXMucmFuZG9taXplQXJyYXkoYXJyYXkpO1xyXG4gICAgICAgICAgICByZXR1cm4gYXJyYXk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNvcnRBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPiwgbXVsdDogbnVtYmVyKTogQXJyYXk8SXRlbVZhbHVlPiB7XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheS5zb3J0KGZ1bmN0aW9uIChhLCBiKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoYS50ZXh0IDwgYi50ZXh0KSByZXR1cm4gLTEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgaWYgKGEudGV4dCA+IGIudGV4dCkgcmV0dXJuIDEgKiBtdWx0O1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByYW5kb21pemVBcnJheShhcnJheTogQXJyYXk8SXRlbVZhbHVlPik6IEFycmF5PEl0ZW1WYWx1ZT4ge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gYXJyYXkubGVuZ3RoIC0gMTsgaSA+IDA7IGktLSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGogPSBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoaSArIDEpKTtcclxuICAgICAgICAgICAgICAgIHZhciB0ZW1wID0gYXJyYXlbaV07XHJcbiAgICAgICAgICAgICAgICBhcnJheVtpXSA9IGFycmF5W2pdO1xyXG4gICAgICAgICAgICAgICAgYXJyYXlbal0gPSB0ZW1wO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBhcnJheTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIGV4dGVuZHMgUXVlc3Rpb25TZWxlY3RCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGNvbENvdW50VmFsdWU6IG51bWJlciA9IDE7XHJcbiAgICAgICAgY29sQ291bnRDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2xDb3VudCgpOiBudW1iZXIgeyByZXR1cm4gdGhpcy5jb2xDb3VudFZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb2xDb3VudCh2YWx1ZTogbnVtYmVyKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA8IDAgfHwgdmFsdWUgPiA0KSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuY29sQ291bnRWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICB0aGlzLmZpcmVDYWxsYmFjayh0aGlzLmNvbENvdW50Q2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwic2VsZWN0YmFzZVwiLCBbXCJoYXNDb21tZW50OmJvb2xlYW5cIiwgXCJoYXNPdGhlcjpib29sZWFuXCIsIFwiIWNob2ljZXM6aXRlbXZhbHVlc1wiLCBcImNob2ljZXNPcmRlclwiLCBcIm90aGVyVGV4dFwiLCBcIm90aGVyRXJyb3JUZXh0XCJdLCBudWxsLCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInNlbGVjdGJhc2VcIiwgXCJjaG9pY2VzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IEl0ZW1WYWx1ZS5zZXREYXRhKG9iai5jaG9pY2VzLCB2YWx1ZSk7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInNlbGVjdGJhc2VcIiwgXCJjaG9pY2VzT3JkZXJcIiwgbnVsbCwgXCJub25lXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJzZWxlY3RiYXNlXCIsIFwiY2hvaWNlc09yZGVyXCIsIFtcIm5vbmVcIiwgXCJhc2NcIiwgXCJkZXNjXCIsIFwicmFuZG9tXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzZWxlY3RiYXNlXCIsIFwib3RoZXJUZXh0XCIsIG51bGwsIHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvdGhlckl0ZW1UZXh0XCIpKTtcclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwiY2hlY2tib3hiYXNlXCIsIFtcImNvbENvdW50Om51bWJlclwiXSwgbnVsbCwgXCJzZWxlY3RiYXNlXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcImNoZWNrYm94YmFzZVwiLCBcImNvbENvdW50XCIsIG51bGwsIDEpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJjaGVja2JveGJhc2VcIiwgXCJjb2xDb3VudFwiLCBbMCwgMSwgMiwgMywgNF0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25DaGVja2JveE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveEJhc2Uge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNPdGhlclNlbGVjdGVkKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMudmFsdWUpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWUuaW5kZXhPZih0aGlzLm90aGVySXRlbS52YWx1ZSkgPj0gMDtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNoZWNrYm94XCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNoZWNrYm94XCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKFwiXCIpOyB9LCBcImNoZWNrYm94YmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveE1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25Db21tZW50TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHVibGljIHJvd3M6IG51bWJlciA9IDQ7XHJcbiAgICAgICAgcHVibGljIGNvbHM6IG51bWJlciA9IDUwO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImNvbW1lbnRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImNvbW1lbnRcIiwgW1wiY29sczpudW1iZXJcIiwgXCJyb3dzOm51bWJlclwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcImNvbW1lbnRcIiwgXCJjb2xzXCIsIG51bGwsIDUwKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJjb21tZW50XCIsIFwicm93c1wiLCBudWxsLCA0KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY29tbWVudFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uQ29tbWVudE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX3NlbGVjdGJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgb3B0aW9uc0NhcHRpb25WYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3B0aW9uc0NhcHRpb24oKSB7IHJldHVybiAodGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlKSA/IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvcHRpb25zQ2FwdGlvblwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3B0aW9uc0NhcHRpb24obmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImRyb3Bkb3duXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImRyb3Bkb3duXCIsIFtcIm9wdGlvbnNDYXB0aW9uXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Ecm9wZG93bk1vZGVsKFwiXCIpOyB9LCBcInNlbGVjdGJhc2VcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwiZHJvcGRvd25cIiwgXCJvcHRpb25zQ2FwdGlvblwiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLm9wdGlvbnNDYXB0aW9uVmFsdWU7IH0pO1xyXG5cclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25Ecm9wZG93bk1vZGVsKG5hbWUpOyBxLmNob2ljZXMgPSBRdWVzdGlvbkZhY3RvcnkuRGVmYXVsdENob2ljZXM7IHJldHVybiBxOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uSHRtbE1vZGVsIGV4dGVuZHMgUXVlc3Rpb25CYXNlIHtcclxuICAgICAgICBwcml2YXRlIGh0bWxWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcImh0bWxcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBodG1sKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmh0bWxWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgaHRtbCh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaHRtbFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcImh0bWxcIiwgW1wiaHRtbFwiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uYmFzZVwiKTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiaHRtbFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbE1vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgaW50ZXJmYWNlIElNYXRyaXhEYXRhIHtcclxuICAgICAgICBvbk1hdHJpeFJvd0NoYW5nZWQocm93OiBNYXRyaXhSb3dNb2RlbCk7XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4Um93TW9kZWwgZXh0ZW5kcyBCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGRhdGE6IElNYXRyaXhEYXRhO1xyXG4gICAgICAgIHByb3RlY3RlZCByb3dWYWx1ZTogYW55O1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZywgZGF0YTogSU1hdHJpeERhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5yb3dWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5yb3dWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUobmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEpIHRoaXMuZGF0YS5vbk1hdHJpeFJvd0NoYW5nZWQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeE1vZGVsIGV4dGVuZHMgUXVlc3Rpb24gaW1wbGVtZW50cyBJTWF0cml4RGF0YSB7XHJcbiAgICAgICAgcHJpdmF0ZSBjb2x1bW5zVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSByb3dzVmFsdWU6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHJpdmF0ZSBpc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJpdmF0ZSBnZW5lcmF0ZWRWaXNpYmxlUm93czogQXJyYXk8TWF0cml4Um93TW9kZWw+O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcIm1hdHJpeFwiO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGhhc1Jvd3MoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnJvd3NWYWx1ZS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXQgY29sdW1ucygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY29sdW1uc1ZhbHVlOyB9XHJcbiAgICAgICAgc2V0IGNvbHVtbnMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jb2x1bW5zVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHJvd3MoKTogQXJyYXk8YW55PiB7IHJldHVybiB0aGlzLnJvd3NWYWx1ZTsgfVxyXG4gICAgICAgIHNldCByb3dzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucm93c1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBwdWJsaWMgZ2V0IHZpc2libGVSb3dzKCk6IEFycmF5PE1hdHJpeFJvd01vZGVsPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8TWF0cml4Um93TW9kZWw+KCk7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucm93c1tpXS52YWx1ZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyh0aGlzLnJvd3NbaV0udmFsdWUsIHRoaXMucm93c1tpXS50ZXh0LCB0aGlzLm5hbWUgKyAnXycgKyB0aGlzLnJvd3NbaV0udmFsdWUudG9TdHJpbmcoKSwgdmFsW3RoaXMucm93c1tpXS52YWx1ZV0pKTsgXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKHJlc3VsdC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgcmVzdWx0LnB1c2godGhpcy5jcmVhdGVNYXRyaXhSb3cobnVsbCwgXCJcIiwgdGhpcy5uYW1lLCB2YWwpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzID0gcmVzdWx0O1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCBmdWxsTmFtZTogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4Um93TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IE1hdHJpeFJvd01vZGVsKG5hbWUsIHRleHQsIGZ1bGxOYW1lLCB0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNSb3dDaGFuZ2luZyB8fCAhKHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MpIHx8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoID09IDApIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdmFyIHZhbCA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghdmFsKSB2YWwgPSB7fTtcclxuICAgICAgICAgICAgaWYgKHRoaXMucm93cy5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1swXS52YWx1ZSA9IHZhbDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByb3dWYWwgPSB2YWxbcm93Lm5hbWVdID8gdmFsW3Jvdy5uYW1lXSA6IG51bGw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93c1tpXS52YWx1ZSA9IHJvd1ZhbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JTWF0cml4RGF0YVxyXG4gICAgICAgIG9uTWF0cml4Um93Q2hhbmdlZChyb3c6IE1hdHJpeFJvd01vZGVsKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzUm93Q2hhbmdpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLmhhc1Jvd3MpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUocm93LnZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSB7fTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlW3Jvdy5uYW1lXSA9IHJvdy52YWx1ZTtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuaXNSb3dDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeFwiLCBbXCJjb2x1bW5zOml0ZW12YWx1ZXNcIiwgXCJyb3dzOml0ZW12YWx1ZXNcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeE1vZGVsKFwiXCIpOyB9LCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeFwiLCBcImNvbHVtbnNcIiwgbnVsbCwgbnVsbCxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIEl0ZW1WYWx1ZS5nZXREYXRhKG9iai5jb2x1bW5zKTsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqOiBhbnksIHZhbHVlOiBhbnkpIHsgb2JqLmNvbHVtbnMgPSB2YWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4XCIsIFwicm93c1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucm93cyA9IHZhbHVlOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4TW9kZWwobmFtZSk7IHEucm93cyA9IFtcIlJvdyAxXCIsIFwiUm93IDJcIl07IHEuY29sdW1ucyA9IFtcIkNvbHVtbiAxXCIsIFwiQ29sdW1uIDJcIiwgXCJDb2x1bW4gM1wiXTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU1hdHJpeERyb3Bkb3duRGF0YSB7XHJcbiAgICAgICAgb25DZWxsQ2hhbmdlZChjZWxsOiBNYXRyaXhEcm9wZG93bkNlbGxNb2RlbCk7XHJcbiAgICAgICAgY29sdW1uczogQXJyYXk8TWF0cml4RHJvcGRvd25Db2x1bW4+O1xyXG4gICAgICAgIGNob2ljZXM6IEFycmF5PGFueT47XHJcbiAgICAgICAgb3B0aW9uc0NhcHRpb246IHN0cmluZztcclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93bkNvbHVtbiBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHByaXZhdGUgY2hvaWNlc1ZhbHVlOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHB1YmxpYyBvcHRpb25zQ2FwdGlvbjogc3RyaW5nO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcsIHRpdGxlOiBzdHJpbmcgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCkgeyByZXR1cm4gXCJtYXRyaXhkcm9wZG93bmNvbHVtblwiIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHRpdGxlKCkgeyByZXR1cm4gdGhpcy50aXRsZVZhbHVlID8gdGhpcy50aXRsZVZhbHVlIDogdGhpcy5uYW1lOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jaG9pY2VzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IGNob2ljZXMobmV3VmFsdWU6IEFycmF5PGFueT4pIHtcclxuICAgICAgICAgICAgSXRlbVZhbHVlLnNldERhdGEodGhpcy5jaG9pY2VzVmFsdWUsIG5ld1ZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgTWF0cml4RHJvcGRvd25DZWxsTW9kZWwge1xyXG4gICAgICAgIHByaXZhdGUgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YVxyXG4gICAgICAgIHByaXZhdGUgY2VsbFZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHB1YmxpYyByb3c6IE1hdHJpeERyb3Bkb3duUm93TW9kZWwsIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjaG9pY2VzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5jb2x1bW4uY2hvaWNlcyAmJiB0aGlzLmNvbHVtbi5jaG9pY2VzLmxlbmd0aCA+IDAgPyB0aGlzLmNvbHVtbi5jaG9pY2VzIDogdGhpcy5kYXRhLmNob2ljZXM7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IG9wdGlvbnNDYXB0aW9uKCk6IHN0cmluZyB7IHJldHVybiB0aGlzLmNvbHVtbi5vcHRpb25zQ2FwdGlvbiA/IHRoaXMuY29sdW1uLm9wdGlvbnNDYXB0aW9uIDogdGhpcy5kYXRhLm9wdGlvbnNDYXB0aW9uOyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpOiBhbnkgeyByZXR1cm4gdGhpcy5jZWxsVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHZhbHVlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5jZWxsVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5kYXRhLm9uQ2VsbENoYW5nZWQodGhpcyk7XHJcbiAgICAgICAgICAgIHRoaXMub25WYWx1ZUNoYW5nZWQoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBNYXRyaXhEcm9wZG93blJvd01vZGVsICB7XHJcbiAgICAgICAgcHJvdGVjdGVkIGRhdGE6IElNYXRyaXhEcm9wZG93bkRhdGE7XHJcbiAgICAgICAgcHJvdGVjdGVkIHJvd1ZhbHVlOiBhbnk7XHJcbiAgICAgICAgcHVibGljIGNlbGxzOiBBcnJheTxNYXRyaXhEcm9wZG93bkNlbGxNb2RlbD4gPSBbXTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBkYXRhO1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuYnVpbGRDZWxscygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHZhbHVlKCkgeyByZXR1cm4gdGhpcy5yb3dWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgdmFsdWUodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnJvd1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5jZWxscy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jZWxsc1tpXS52YWx1ZSA9IHRoaXMuZ2V0Q2VsbFZhbHVlKHRoaXMuY2VsbHNbaV0uY29sdW1uKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGJ1aWxkQ2VsbHMoKSB7XHJcbiAgICAgICAgICAgIHZhciBjb2x1bW5zID0gdGhpcy5kYXRhLmNvbHVtbnM7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgY29sdW1ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbHVtbiA9IGNvbHVtbnNbaV07XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNlbGxzLnB1c2godGhpcy5jcmVhdGVDZWxsKGNvbHVtbiwgdGhpcy5nZXRDZWxsVmFsdWUoY29sdW1uKSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHZhbHVlOiBhbnkpOiBNYXRyaXhEcm9wZG93bkNlbGxNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25DZWxsTW9kZWwoY29sdW1uLCB0aGlzLCB0aGlzLmRhdGEsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldENlbGxWYWx1ZShjb2x1bW46IE1hdHJpeERyb3Bkb3duQ29sdW1uKTogYW55IHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJvd1ZhbHVlKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucm93VmFsdWVbY29sdW1uLm5hbWVdO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiBpbXBsZW1lbnRzIElNYXRyaXhEcm9wZG93bkRhdGEge1xyXG4gICAgICAgIHByaXZhdGUgY29sdW1uc1ZhbHVlOiBBcnJheTxNYXRyaXhEcm9wZG93bkNvbHVtbj4gPSBbXTtcclxuICAgICAgICBwcml2YXRlIHJvd3NWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIGNob2ljZXNWYWx1ZTogSXRlbVZhbHVlW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIG9wdGlvbnNDYXB0aW9uVmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIGlzUm93Q2hhbmdpbmcgPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIGdlbmVyYXRlZFZpc2libGVSb3dzOiBBcnJheTxNYXRyaXhEcm9wZG93blJvd01vZGVsPjtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWF0cml4ZHJvcGRvd25cIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBjb2x1bW5zKCk6IEFycmF5PE1hdHJpeERyb3Bkb3duQ29sdW1uPiB7IHJldHVybiB0aGlzLmNvbHVtbnNWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgcm93cygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMucm93c1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCByb3dzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucm93c1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY2hvaWNlcygpOiBBcnJheTxhbnk+IHsgcmV0dXJuIHRoaXMuY2hvaWNlc1ZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjaG9pY2VzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMuY2hvaWNlc1ZhbHVlLCBuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3B0aW9uc0NhcHRpb24oKSB7IHJldHVybiAodGhpcy5vcHRpb25zQ2FwdGlvblZhbHVlKSA/IHRoaXMub3B0aW9uc0NhcHRpb25WYWx1ZSA6IHN1cnZleUxvY2FsaXphdGlvbi5nZXRTdHJpbmcoXCJvcHRpb25zQ2FwdGlvblwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3B0aW9uc0NhcHRpb24obmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLm9wdGlvbnNDYXB0aW9uVmFsdWUgPSBuZXdWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBhZGRDb2x1bW4obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE1hdHJpeERyb3Bkb3duQ29sdW1uIHtcclxuICAgICAgICAgICAgdmFyIGNvbHVtbiA9IG5ldyBNYXRyaXhEcm9wZG93bkNvbHVtbihuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY29sdW1uc1ZhbHVlLnB1c2goY29sdW1uKTtcclxuICAgICAgICAgICAgcmV0dXJuIGNvbHVtbjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVJvd3MoKTogQXJyYXk8TWF0cml4RHJvcGRvd25Sb3dNb2RlbD4ge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gbmV3IEFycmF5PE1hdHJpeERyb3Bkb3duUm93TW9kZWw+KCk7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5yb3dzIHx8IHRoaXMucm93cy5sZW5ndGggPT09IDApIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIHZhciB2YWwgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIXZhbCkgdmFsID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5yb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMucm93c1tpXS52YWx1ZSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLmNyZWF0ZU1hdHJpeFJvdyh0aGlzLnJvd3NbaV0udmFsdWUsIHRoaXMucm93c1tpXS50ZXh0LCB2YWxbdGhpcy5yb3dzW2ldLnZhbHVlXSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MgPSByZXN1bHQ7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVNYXRyaXhSb3cobmFtZTogYW55LCB0ZXh0OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiBNYXRyaXhEcm9wZG93blJvd01vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhEcm9wZG93blJvd01vZGVsKG5hbWUsIHRleHQsIHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1Jvd0NoYW5naW5nIHx8ICEodGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cykgfHwgdGhpcy5nZW5lcmF0ZWRWaXNpYmxlUm93cy5sZW5ndGggPT0gMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdmFsID0gdGhpcy52YWx1ZTtcclxuICAgICAgICAgICAgaWYgKCF2YWwpIHZhbCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHZhciByb3cgPSB0aGlzLmdlbmVyYXRlZFZpc2libGVSb3dzW2ldO1xyXG4gICAgICAgICAgICAgICAgdmFyIHJvd1ZhbCA9IHZhbFtyb3cubmFtZV0gPyB2YWxbcm93Lm5hbWVdIDogbnVsbDtcclxuICAgICAgICAgICAgICAgIHRoaXMuZ2VuZXJhdGVkVmlzaWJsZVJvd3NbaV0udmFsdWUgPSByb3dWYWw7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvL0lNYXRyaXhEcm9wZG93bkRhdGFcclxuICAgICAgICBvbkNlbGxDaGFuZ2VkKGNlbGw6IE1hdHJpeERyb3Bkb3duQ2VsbE1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBuZXdWYWx1ZSA9IHRoaXMudmFsdWU7XHJcbiAgICAgICAgICAgIGlmICghbmV3VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIG5ld1ZhbHVlID0ge307XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHJvd1ZhbHVlID0gbmV3VmFsdWVbY2VsbC5yb3cubmFtZV07XHJcbiAgICAgICAgICAgIGlmICghcm93VmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHJvd1ZhbHVlID0ge307XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZVtjZWxsLnJvdy5uYW1lXSA9IHJvd1ZhbHVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmIChjZWxsLnZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICByb3dWYWx1ZVtjZWxsLmNvbHVtbi5uYW1lXSA9IGNlbGwudmFsdWU7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBkZWxldGUgcm93VmFsdWVbY2VsbC5jb2x1bW4ubmFtZV07XHJcbiAgICAgICAgICAgICAgICBpZiAoT2JqZWN0LmtleXMocm93VmFsdWUpLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5ld1ZhbHVlW2NlbGwucm93Lm5hbWVdO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChPYmplY3Qua2V5cyhuZXdWYWx1ZSkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3VmFsdWUgPSBudWxsO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLmlzUm93Q2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLnNldE5ld1ZhbHVlKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5pc1Jvd0NoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIsIFtcIm5hbWVcIiwgXCJ0aXRsZVwiLCBcImNob2ljZXM6aXRlbXZhbHVlc1wiLCBcIm9wdGlvbnNDYXB0aW9uXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25Db2x1bW4oXCJcIik7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeGRyb3Bkb3duY29sdW1uXCIsIFwidGl0bGVcIiwgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIiwgXCJjaG9pY2VzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH0pO1xyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtYXRyaXhkcm9wZG93blwiLCBbXCJjb2x1bW5zXCIsIFwicm93czppdGVtdmFsdWVzXCIsIFwiY2hvaWNlczppdGVtdmFsdWVzXCIsIFwib3B0aW9uc0NhcHRpb25cIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwoXCJcIik7IH0sIFwicXVlc3Rpb25cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4ZHJvcGRvd25cIiwgXCJjb2x1bW5zXCIsIFwibWF0cml4ZHJvcGRvd25jb2x1bW5cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibWF0cml4ZHJvcGRvd25cIiwgXCJjaG9pY2VzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmouY2hvaWNlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5jaG9pY2VzID0gdmFsdWU7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcIm1hdHJpeGRyb3Bkb3duXCIsIFwicm93c1wiLCBudWxsLCBudWxsLFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gSXRlbVZhbHVlLmdldERhdGEob2JqLnJvd3MpOyB9LFxyXG4gICAgICAgIGZ1bmN0aW9uIChvYmo6IGFueSwgdmFsdWU6IGFueSkgeyBvYmoucm93cyA9IHZhbHVlOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtYXRyaXhkcm9wZG93blwiLCBcIm9wdGlvbnNDYXB0aW9uXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoub3B0aW9uc0NhcHRpb25WYWx1ZTsgfSk7XHJcblxyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtYXRyaXhkcm9wZG93blwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFsxLCAyLCAzLCA0LCA1XTsgcS5yb3dzID0gW1wiUm93IDFcIiwgXCJSb3cgMlwiXTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMVwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gMlwiKTsgcS5hZGRDb2x1bW4oXCJDb2x1bW4gM1wiKTsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb24udHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBpbnRlcmZhY2UgSU11bHRpcGxlVGV4dERhdGEge1xyXG4gICAgICAgIGdldE11bHRpcGxlVGV4dFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueTtcclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBNdWx0aXBsZVRleHRJdGVtTW9kZWwgZXh0ZW5kcyBCYXNlIGltcGxlbWVudHMgSVZhbGlkYXRvck93bmVyIHtcclxuICAgICAgICBwcml2YXRlIGRhdGE6IElNdWx0aXBsZVRleHREYXRhO1xyXG4gICAgICAgIHByaXZhdGUgdGl0bGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHZhbGlkYXRvcnM6IEFycmF5PFN1cnZleVZhbGlkYXRvcj4gPSBuZXcgQXJyYXk8U3VydmV5VmFsaWRhdG9yPigpO1xyXG5cclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdGhpcy50aXRsZSA9IHRpdGxlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtdWx0aXBsZXRleHRpdGVtXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHNldERhdGEoZGF0YTogSU11bHRpcGxlVGV4dERhdGEpIHtcclxuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCB0aXRsZSgpIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMubmFtZTsgIH1cclxuICAgICAgICBwdWJsaWMgc2V0IHRpdGxlKG5ld1RleHQ6IHN0cmluZykgeyB0aGlzLnRpdGxlVmFsdWUgPSBuZXdUZXh0OyB9XHJcbiAgICAgICAgcHVibGljIGdldCB2YWx1ZSgpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZGF0YSA/IHRoaXMuZGF0YS5nZXRNdWx0aXBsZVRleHRWYWx1ZSh0aGlzLm5hbWUpIDogbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCB2YWx1ZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmRhdGEgIT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5kYXRhLnNldE11bHRpcGxlVGV4dFZhbHVlKHRoaXMubmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIG9uVmFsdWVDaGFuZ2VkKG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgLy9JVmFsaWRhdG9yT3duZXJcclxuICAgICAgICBnZXRWYWxpZGF0b3JUaXRsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50aXRsZTsgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk11bHRpcGxlVGV4dE1vZGVsIGV4dGVuZHMgUXVlc3Rpb24gaW1wbGVtZW50cyBJTXVsdGlwbGVUZXh0RGF0YSB7XHJcbiAgICAgICAgcHVibGljIGl0ZW1TaXplOiBudW1iZXIgPSAyNTtcclxuICAgICAgICBwdWJsaWMgaXRlbXM6IEFycmF5PE11bHRpcGxlVGV4dEl0ZW1Nb2RlbD4gPSBuZXcgQXJyYXk8TXVsdGlwbGVUZXh0SXRlbU1vZGVsPigpO1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5pdGVtcy5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICB2YWx1ZS5zZXREYXRhKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtdWx0aXBsZXRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIEFkZEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nID0gbnVsbCk6IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7XHJcbiAgICAgICAgICAgIHZhciBpdGVtID0gdGhpcy5jcmVhdGVUZXh0SXRlbShuYW1lLCB0aXRsZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuICAgICAgICAgICAgcmV0dXJuIGl0ZW07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgaXNNdWx0aXBsZUl0ZW1WYWx1ZUNoYW5naW5nID0gZmFsc2U7XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBzdXBlci5vblZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgICAgICB0aGlzLm9uSXRlbVZhbHVlQ2hhbmdlZCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtTW9kZWwobmFtZSwgdGl0bGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25JdGVtVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB0aGlzLml0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgaXRlbVZhbHVlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnZhbHVlICYmICh0aGlzLml0ZW1zW2ldLm5hbWUgaW4gdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgICAgICBpdGVtVmFsdWUgPSB0aGlzLnZhbHVlW3RoaXMuaXRlbXNbaV0ubmFtZV07XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB0aGlzLml0ZW1zW2ldLm9uVmFsdWVDaGFuZ2VkKGl0ZW1WYWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHJ1blZhbGlkYXRvcnMoKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICB2YXIgZXJyb3IgPSBzdXBlci5ydW5WYWxpZGF0b3JzKCk7XHJcbiAgICAgICAgICAgIGlmIChlcnJvciAhPSBudWxsKSByZXR1cm4gZXJyb3I7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5pdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgZXJyb3IgPSBuZXcgVmFsaWRhdG9yUnVubmVyKCkucnVuKHRoaXMuaXRlbXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKGVycm9yICE9IG51bGwpIHJldHVybiBlcnJvcjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICB9XHJcbiAgICAgICAvL0lNdWx0aXBsZVRleHREYXRhXHJcbiAgICAgICAgZ2V0TXVsdGlwbGVUZXh0VmFsdWUobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICghdGhpcy52YWx1ZSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnZhbHVlW25hbWVdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBzZXRNdWx0aXBsZVRleHRWYWx1ZShuYW1lOiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc011bHRpcGxlSXRlbVZhbHVlQ2hhbmdpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgbmV3VmFsdWUgPSB0aGlzLnZhbHVlO1xyXG4gICAgICAgICAgICBpZiAoIW5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdWYWx1ZSA9IHt9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG5ld1ZhbHVlW25hbWVdID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0TmV3VmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzTXVsdGlwbGVJdGVtVmFsdWVDaGFuZ2luZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJtdWx0aXBsZXRleHRpdGVtXCIsIFtcIm5hbWVcIiwgXCJ0aXRsZVwiLCBcInZhbGlkYXRvcnM6dmFsaWRhdG9yc1wiXSwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IE11bHRpcGxlVGV4dEl0ZW1Nb2RlbChcIlwiKTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5Q2xhc3NJbmZvKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBcInZhbGlkYXRvcnNcIiwgXCJzdXJ2ZXl2YWxpZGF0b3JcIiwgXCJ2YWxpZGF0b3JcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibXVsdGlwbGV0ZXh0aXRlbVwiLCBcInRpdGxlXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoudGl0bGVWYWx1ZTsgfSk7XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcIm11bHRpcGxldGV4dFwiLCBbXCIhaXRlbXM6dGV4dGl0ZW1zXCIsIFwiaXRlbVNpemU6bnVtYmVyXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJtdWx0aXBsZXRleHRcIiwgXCJpdGVtc1wiLCBcIm11bHRpcGxldGV4dGl0ZW1cIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwibXVsdGlwbGV0ZXh0XCIsIFwiaXRlbVNpemVcIiwgbnVsbCwgMjUpO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJtdWx0aXBsZXRleHRcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NdWx0aXBsZVRleHRNb2RlbChuYW1lKTsgcS5BZGRJdGVtKFwidGV4dDFcIik7IHEuQWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uX2Jhc2VzZWxlY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicXVlc3Rpb25mYWN0b3J5LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbCBleHRlbmRzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJyYWRpb2dyb3VwXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInJhZGlvZ3JvdXBcIiwgW10sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXBNb2RlbChcIlwiKTsgfSwgXCJjaGVja2JveGJhc2VcIik7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInJhZGlvZ3JvdXBcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25SYWRpb2dyb3VwTW9kZWwobmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7fSk7XHJcbn0iLCIvLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbi50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJxdWVzdGlvbmZhY3RvcnkudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwianNvbm9iamVjdC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmF0aW5nTW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgc3RhdGljIGRlZmF1bHRSYXRlVmFsdWVzOiBJdGVtVmFsdWVbXSA9IFtdO1xyXG4gICAgICAgIHByaXZhdGUgcmF0ZXM6IEl0ZW1WYWx1ZVtdID0gW107XHJcbiAgICAgICAgcHVibGljIG1pbmludW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcbiAgICAgICAgcHVibGljIG1heGltdW1SYXRlRGVzY3JpcHRpb246IHN0cmluZyA9IG51bGw7XHJcblxyXG4gICAgICAgIHJhdGVWYWx1ZXNDaGFuZ2VkQ2FsbGJhY2s6ICgpID0+IHZvaWQ7XHJcblxyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCByYXRlVmFsdWVzKCk6IEFycmF5PGFueT4geyByZXR1cm4gdGhpcy5yYXRlczsgfVxyXG4gICAgICAgIHNldCByYXRlVmFsdWVzKG5ld1ZhbHVlOiBBcnJheTxhbnk+KSB7XHJcbiAgICAgICAgICAgIEl0ZW1WYWx1ZS5zZXREYXRhKHRoaXMucmF0ZXMsIG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5maXJlQ2FsbGJhY2sodGhpcy5yYXRlVmFsdWVzQ2hhbmdlZENhbGxiYWNrKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZ2V0IHZpc2libGVSYXRlVmFsdWVzKCk6IEl0ZW1WYWx1ZVtdIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMucmF0ZVZhbHVlcy5sZW5ndGggPiAwKSByZXR1cm4gdGhpcy5yYXRlVmFsdWVzO1xyXG4gICAgICAgICAgICByZXR1cm4gUXVlc3Rpb25SYXRpbmdNb2RlbC5kZWZhdWx0UmF0ZVZhbHVlcztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwicmF0aW5nXCI7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBzdXBwb3J0Q29tbWVudCgpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH0gXHJcbiAgICAgICAgcHVibGljIHN1cHBvcnRPdGhlcigpOiBib29sZWFuIHsgcmV0dXJuIHRydWU7IH1cclxuICAgIH1cclxuICAgIEl0ZW1WYWx1ZS5zZXREYXRhKFF1ZXN0aW9uUmF0aW5nTW9kZWwuZGVmYXVsdFJhdGVWYWx1ZXMsIFsxLCAyLCAzLCA0LCA1XSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLmFkZENsYXNzKFwicmF0aW5nXCIsIFtcImhhc0NvbW1lbnQ6Ym9vbGVhblwiLCBcInJhdGVWYWx1ZXM6aXRlbXZhbHVlc1wiLCBcIm1pbmludW1SYXRlRGVzY3JpcHRpb25cIiwgXCJtYXhpbXVtUmF0ZURlc2NyaXB0aW9uXCJdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmdNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJyYXRpbmdcIiwgXCJyYXRlVmFsdWVzXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBJdGVtVmFsdWUuZ2V0RGF0YShvYmoucmF0ZVZhbHVlcyk7IH0sXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iajogYW55LCB2YWx1ZTogYW55KSB7IG9iai5yYXRlVmFsdWVzID0gdmFsdWU7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYXRpbmdcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhdGluZ01vZGVsKG5hbWUpOyB9KTtcclxufSIsIi8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cInF1ZXN0aW9uZmFjdG9yeS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25UZXh0TW9kZWwgZXh0ZW5kcyBRdWVzdGlvbiB7XHJcbiAgICAgICAgcHVibGljIHNpemU6IG51bWJlciA9IDI1O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRUeXBlKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHJldHVybiBcInRleHRcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgaXNFbXB0eSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgcmV0dXJuIHN1cGVyLmlzRW1wdHkoKSB8fCB0aGlzLnZhbHVlID09IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRleHRcIiwgW1wic2l6ZTpudW1iZXJcIl0sIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHRNb2RlbChcIlwiKTsgfSwgXCJxdWVzdGlvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJ0ZXh0XCIsIFwic2l6ZVwiLCBudWxsLCAyNSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcInRleHRcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvblRleHRNb2RlbChuYW1lKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiYmFzZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJqc29ub2JqZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgVHJpZ2dlciBleHRlbmRzIEJhc2Uge1xyXG4gICAgICAgIHN0YXRpYyBvcGVyYXRvcnNWYWx1ZTogSGFzaFRhYmxlPEZ1bmN0aW9uPiA9IG51bGw7XHJcbiAgICAgICAgc3RhdGljIGdldCBvcGVyYXRvcnMoKSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlICE9IG51bGwpIHJldHVybiBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlO1xyXG4gICAgICAgICAgICBUcmlnZ2VyLm9wZXJhdG9yc1ZhbHVlID0ge1xyXG4gICAgICAgICAgICAgICAgZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90ZW1wdHk6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gISghdmFsdWUpOyB9LFxyXG4gICAgICAgICAgICAgICAgZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPT0gZXhwZWN0ZWRWYWx1ZTsgfSxcclxuICAgICAgICAgICAgICAgIG5vdGVxdWFsOiBmdW5jdGlvbiAodmFsdWUsIGV4cGVjdGVkVmFsdWUpIHsgcmV0dXJuIHZhbHVlICE9IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBjb250YWluczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSAmJiB2YWx1ZVtcImluZGV4T2ZcIl0gJiYgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA+IC0xOyB9LFxyXG4gICAgICAgICAgICAgICAgbm90Y29udGFpbnM6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gIXZhbHVlIHx8ICF2YWx1ZVtcImluZGV4T2ZcIl0gfHwgdmFsdWUuaW5kZXhPZihleHBlY3RlZFZhbHVlKSA9PSAtMTsgfSxcclxuICAgICAgICAgICAgICAgIGdyZWF0ZXI6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPiBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzczogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA8IGV4cGVjdGVkVmFsdWU7IH0sXHJcbiAgICAgICAgICAgICAgICBncmVhdGVyb3JlcXVhbDogZnVuY3Rpb24gKHZhbHVlLCBleHBlY3RlZFZhbHVlKSB7IHJldHVybiB2YWx1ZSA+PSBleHBlY3RlZFZhbHVlOyB9LFxyXG4gICAgICAgICAgICAgICAgbGVzc29yZXF1YWw6IGZ1bmN0aW9uICh2YWx1ZSwgZXhwZWN0ZWRWYWx1ZSkgeyByZXR1cm4gdmFsdWUgPD0gZXhwZWN0ZWRWYWx1ZTsgfVxyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICByZXR1cm4gVHJpZ2dlci5vcGVyYXRvcnNWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBvcFZhbHVlOiBzdHJpbmcgPSBcImVxdWFsXCI7XHJcbiAgICAgICAgcHVibGljIHZhbHVlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgb3BlcmF0b3IoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMub3BWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgb3BlcmF0b3IodmFsdWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBpZiAoIXZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhbHVlID0gdmFsdWUudG9Mb3dlckNhc2UoKTtcclxuICAgICAgICAgICAgaWYgKCFUcmlnZ2VyLm9wZXJhdG9yc1t2YWx1ZV0pIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5vcFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBjaGVjayh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChUcmlnZ2VyLm9wZXJhdG9yc1t0aGlzLm9wZXJhdG9yXSh2YWx1ZSwgdGhpcy52YWx1ZSkpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMub25TdWNjZXNzKCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLm9uRmFpbHVyZSgpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblN1Y2Nlc3MoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25GYWlsdXJlKCkgeyB9XHJcbiAgICB9XHJcblxyXG4gICAgZXhwb3J0IGludGVyZmFjZSBJU3VydmV5VHJpZ2dlck93bmVyIHtcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtdO1xyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUcmlnZ2VyIGV4dGVuZHMgVHJpZ2dlciB7XHJcbiAgICAgICAgcHVibGljIG5hbWU6IHN0cmluZztcclxuICAgICAgICBwdWJsaWMgcGFnZXM6IHN0cmluZ1tdID0gW107XHJcbiAgICAgICAgcHVibGljIHF1ZXN0aW9uczogc3RyaW5nW10gPSBbXTtcclxuICAgICAgICBwcml2YXRlIG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyID0gbnVsbDtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldE93bmVyKG93bmVyOiBJU3VydmV5VHJpZ2dlck93bmVyKSB7XHJcbiAgICAgICAgICAgIHRoaXMub3duZXIgPSBvd25lcjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uU3VjY2VzcygpIHsgdGhpcy5vblRyaWdnZXIodGhpcy5vbkl0ZW1TdWNjZXNzKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkZhaWx1cmUoKSB7IHRoaXMub25UcmlnZ2VyKHRoaXMub25JdGVtRmFpbHVyZSk7IH1cclxuICAgICAgICBvblRyaWdnZXIoZnVuYzogRnVuY3Rpb24pIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm93bmVyKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvYmplY3RzID0gdGhpcy5vd25lci5nZXRPYmplY3RzKHRoaXMucGFnZXMsIHRoaXMucXVlc3Rpb25zKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBvYmplY3RzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBmdW5jKG9iamVjdHNbaV0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbUZhaWx1cmUoaXRlbTogYW55KSB7IH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5VHJpZ2dlclZpc2libGUgZXh0ZW5kcyBTdXJ2ZXlUcmlnZ2VyIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwidmlzaWJsZXRyaWdnZXJcIjsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkl0ZW1TdWNjZXNzKGl0ZW06IGFueSkgeyBpdGVtLnZpc2libGUgPSB0cnVlOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uSXRlbUZhaWx1cmUoaXRlbTogYW55KSB7IGl0ZW0udmlzaWJsZSA9IGZhbHNlOyB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInRyaWdnZXJcIiwgW1wib3BlcmF0b3JcIiwgXCIhdmFsdWVcIl0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInN1cnZleXRyaWdnZXJcIiwgW1wiIW5hbWVcIiwgXCJwYWdlc1wiLCBcInF1ZXN0aW9uc1wiXSwgbnVsbCwgXCJ0cmlnZ2VyXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5hZGRDbGFzcyhcInZpc2libGV0cmlnZ2VyXCIsIFtdLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgU3VydmV5VHJpZ2dlclZpc2libGUoKTsgfSwgXCJzdXJ2ZXl0cmlnZ2VyXCIpO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cImJhc2UudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwicGFnZS50c1wiIC8+XHJcbi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0cmlnZ2VyLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImpzb25vYmplY3QudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiZHhTdXJ2ZXlTZXJ2aWNlLnRzXCIgLz5cclxuXHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleU1vZGVsIGV4dGVuZHMgQmFzZSBpbXBsZW1lbnRzIElTdXJ2ZXksIElTdXJ2ZXlUcmlnZ2VyT3duZXIge1xyXG4gICAgICAgIHB1YmxpYyBzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc3VydmV5UG9zdElkOiBzdHJpbmcgPSBudWxsO1xyXG4gICAgICAgIHB1YmxpYyBjbGllbnRJZDogc3RyaW5nID0gbnVsbDtcclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdE9uUGFnZU5leHQ6IGJvb2xlYW4gPSBmYWxzZTtcclxuXHJcbiAgICAgICAgcHVibGljIGNvbW1lbnRQcmVmaXg6IHN0cmluZyA9IFwiLUNvbW1lbnRcIjtcclxuICAgICAgICBwdWJsaWMgdGl0bGU6IHN0cmluZyA9IFwiXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dOYXZpZ2F0aW9uQnV0dG9uczogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dUaXRsZTogYm9vbGVhbiA9IHRydWU7XHJcbiAgICAgICAgcHVibGljIHNob3dQYWdlVGl0bGVzOiBib29sZWFuID0gdHJ1ZTtcclxuICAgICAgICBwdWJsaWMgcmVxdWlyZWRUZXh0OiBzdHJpbmcgPSBcIiogXCI7XHJcbiAgICAgICAgcHVibGljIHNob3dQcm9ncmVzc0Jhcjogc3RyaW5nID0gXCJvZmZcIjtcclxuICAgICAgICBwdWJsaWMgcGFnZXM6IEFycmF5PFBhZ2VNb2RlbD4gPSBuZXcgQXJyYXk8UGFnZU1vZGVsPigpO1xyXG4gICAgICAgIHB1YmxpYyB0cmlnZ2VyczogQXJyYXk8U3VydmV5VHJpZ2dlcj4gPSBuZXcgQXJyYXk8U3VydmV5VHJpZ2dlcj4oKTtcclxuICAgICAgICBwcml2YXRlIGN1cnJlbnRQYWdlVmFsdWU6IFBhZ2VNb2RlbCA9IG51bGw7XHJcbiAgICAgICAgcHJpdmF0ZSB2YWx1ZXNIYXNoOiBIYXNoVGFibGU8YW55PiA9IHt9O1xyXG4gICAgICAgIHByaXZhdGUgcGFnZVByZXZUZXh0VmFsdWU6IHN0cmluZztcclxuICAgICAgICBwcml2YXRlIHBhZ2VOZXh0VGV4dFZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgcHJpdmF0ZSBjb21wbGV0ZVRleHRWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIHByaXZhdGUgc2hvd1BhZ2VOdW1iZXJzVmFsdWU6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBwcml2YXRlIHNob3dRdWVzdGlvbk51bWJlcnNWYWx1ZTogc3RyaW5nID0gXCJvblwiO1xyXG4gICAgICAgIHByaXZhdGUgbG9jYWxlVmFsdWU6IHN0cmluZyA9IFwiXCI7XHJcblxyXG4gICAgICAgIHB1YmxpYyBvbkNvbXBsZXRlOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25DdXJyZW50UGFnZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWx1ZUNoYW5nZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblBhZ2VWaXNpYmxlQ2hhbmdlZDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvblF1ZXN0aW9uQWRkZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25RdWVzdGlvblJlbW92ZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PiA9IG5ldyBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4oKTtcclxuICAgICAgICBwdWJsaWMgb25WYWxpZGF0ZVF1ZXN0aW9uOiBFdmVudDwoc2VuZGVyOiBTdXJ2ZXlNb2RlbCwgb3B0aW9uczogYW55KSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+KCk7XHJcbiAgICAgICAgcHVibGljIG9uU2VuZFJlc3VsdDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBvbkdldFJlc3VsdDogRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwsIG9wdGlvbnM6IGFueSkgPT4gYW55LCBhbnk+ID0gbmV3IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsLCBvcHRpb25zOiBhbnkpID0+IGFueSwgYW55PigpO1xyXG4gICAgICAgIHB1YmxpYyBqc29uRXJyb3JzOiBBcnJheTxKc29uRXJyb3I+ID0gbnVsbDtcclxuXHJcbiAgICAgICAgcHVibGljIG1vZGU6IHN0cmluZyA9IFwibm9ybWFsXCI7XHJcblxyXG5cclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkgPSBudWxsLCByZW5kZXJlZEVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLmRhdGEgPSBzZWxmO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLnRyaWdnZXJzLnB1c2ggPSBmdW5jdGlvbiAodmFsdWUpIHtcclxuICAgICAgICAgICAgICAgIHZhbHVlLnNldE93bmVyKHNlbGYpO1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIEFycmF5LnByb3RvdHlwZS5wdXNoLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB0aGlzLm9uQmVmb3JlQ3JlYXRpbmcoKTtcclxuICAgICAgICAgICAgaWYgKGpzb25PYmopIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc2V0SnNvbk9iamVjdChqc29uT2JqKTtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleUlkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5sb2FkU3VydmV5RnJvbVNlcnZpY2UodGhpcy5zdXJ2ZXlJZCwgcmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uQ3JlYXRpbmcoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFR5cGUoKTogc3RyaW5nIHsgcmV0dXJuIFwic3VydmV5XCI7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGxvY2FsZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy5sb2NhbGVWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzZXQgbG9jYWxlKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdGhpcy5sb2NhbGVWYWx1ZSA9IHZhbHVlO1xyXG4gICAgICAgICAgICBzdXJ2ZXlMb2NhbGl6YXRpb24uY3VycmVudExvY2FsZSA9IHZhbHVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHBhZ2VQcmV2VGV4dCgpIHsgcmV0dXJuICh0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlKSA/IHRoaXMucGFnZVByZXZUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGFnZVByZXZUZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBwYWdlUHJldlRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnBhZ2VQcmV2VGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHBhZ2VOZXh0VGV4dCgpIHsgcmV0dXJuICh0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlKSA/IHRoaXMucGFnZU5leHRUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwicGFnZU5leHRUZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBwYWdlTmV4dFRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLnBhZ2VOZXh0VGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGNvbXBsZXRlVGV4dCgpIHsgcmV0dXJuICh0aGlzLmNvbXBsZXRlVGV4dFZhbHVlKSA/IHRoaXMuY29tcGxldGVUZXh0VmFsdWUgOiBzdXJ2ZXlMb2NhbGl6YXRpb24uZ2V0U3RyaW5nKFwiY29tcGxldGVUZXh0XCIpOyB9XHJcbiAgICAgICAgcHVibGljIHNldCBjb21wbGV0ZVRleHQobmV3VmFsdWU6IHN0cmluZykgeyB0aGlzLmNvbXBsZXRlVGV4dFZhbHVlID0gbmV3VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNob3dQYWdlTnVtYmVycygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgc2V0IHNob3dQYWdlTnVtYmVycyh2YWx1ZTogYm9vbGVhbikge1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IHRoaXMuc2hvd1BhZ2VOdW1iZXJzKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1BhZ2VOdW1iZXJzVmFsdWUgPSB2YWx1ZTtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IHNob3dRdWVzdGlvbk51bWJlcnMoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlOyB9O1xyXG4gICAgICAgIHB1YmxpYyBzZXQgc2hvd1F1ZXN0aW9uTnVtYmVycyh2YWx1ZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIGlmICh2YWx1ZSA9PT0gdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2hvd1F1ZXN0aW9uTnVtYmVyc1ZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9O1xyXG4gICAgICAgIHB1YmxpYyBnZXQgZGF0YSgpOiBhbnkge1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiB0aGlzLnZhbHVlc0hhc2gpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdFtrZXldID0gdGhpcy52YWx1ZXNIYXNoW2tleV07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCBkYXRhKGRhdGE6IGFueSkge1xyXG4gICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2ggPSB7fTtcclxuICAgICAgICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGZvciAodmFyIGtleSBpbiBkYXRhKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy52YWx1ZXNIYXNoW2tleV0gPSBkYXRhW2tleV07XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jaGVja1RyaWdnZXJzKGtleSwgZGF0YVtrZXldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgY29tbWVudHMoKTogYW55IHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9IHt9O1xyXG4gICAgICAgICAgICBmb3IgKHZhciBrZXkgaW4gdGhpcy52YWx1ZXNIYXNoKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoa2V5LmluZGV4T2YodGhpcy5jb21tZW50UHJlZml4KSA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IHRoaXMudmFsdWVzSGFzaFtrZXldO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCB2aXNpYmxlUGFnZXMoKTogQXJyYXk8UGFnZU1vZGVsPiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzRGVzaWduTW9kZSkgcmV0dXJuIHRoaXMucGFnZXM7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8UGFnZU1vZGVsPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHRoaXMucGFnZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGlmICh0aGlzLnBhZ2VzW2ldLmlzVmlzaWJsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKHRoaXMucGFnZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNFbXB0eSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMucGFnZXMubGVuZ3RoID09IDA7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IFBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wYWdlcy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdmlzaWJsZVBhZ2VDb3VudCgpOiBudW1iZXIge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGN1cnJlbnRQYWdlKCk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2VWYWx1ZSAhPSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZVZhbHVlKSA8IDApIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRQYWdlID0gbnVsbDtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZVZhbHVlID09IG51bGwgJiYgdlBhZ2VzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbMF07XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHNldCBjdXJyZW50UGFnZSh2YWx1ZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgaWYgKHZhbHVlICE9IG51bGwgJiYgdlBhZ2VzLmluZGV4T2YodmFsdWUpIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICBpZiAodmFsdWUgPT0gdGhpcy5jdXJyZW50UGFnZVZhbHVlKSByZXR1cm47XHJcbiAgICAgICAgICAgIHZhciBvbGRWYWx1ZSA9IHRoaXMuY3VycmVudFBhZ2VWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZVZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2VDaGFuZ2VkKHZhbHVlLCBvbGRWYWx1ZSk7XHJcbiAgICAgICAgICAgIFxyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlOiBQYWdlTW9kZWwsIG9sZFZhbHVlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy5vbkN1cnJlbnRQYWdlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ29sZEN1cnJlbnRQYWdlJzogb2xkVmFsdWUsICduZXdDdXJyZW50UGFnZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRGVzaWduTW9kZSgpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMubW9kZSA9PSBcImRlc2lnbmVyXCI7IH1cclxuICAgICAgICBwdWJsaWMgbmV4dFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzTGFzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNDdXJyZW50UGFnZUhhc0Vycm9ycykgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zZW5kUmVzdWx0T25QYWdlTmV4dCAmJiB0aGlzLmNsaWVudElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnNlbmRSZXN1bHQodGhpcy5zdXJ2ZXlQb3N0SWQsIHRoaXMuY2xpZW50SWQsIHRydWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMuY3VycmVudFBhZ2UgPSB2UGFnZXNbaW5kZXggKyAxXTtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldCBpc0N1cnJlbnRQYWdlSGFzRXJyb3JzKCk6IGJvb2xlYW4ge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5jdXJyZW50UGFnZSA9PSBudWxsKSByZXR1cm4gdHJ1ZTtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMuY3VycmVudFBhZ2UuaGFzRXJyb3JzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBwcmV2UGFnZSgpOiBib29sZWFuIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuaXNGaXJzdFBhZ2UpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdmFyIHZQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKTtcclxuICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHZQYWdlc1tpbmRleCAtIDFdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgY29tcGxldGVMYXN0UGFnZSgpIDogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzQ3VycmVudFBhZ2VIYXNFcnJvcnMpIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdGhpcy5vbkNvbXBsZXRlLmZpcmUodGhpcywgbnVsbCk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5zZW5kUmVzdWx0KCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgaXNGaXJzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy52aXNpYmxlUGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSAwO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzTGFzdFBhZ2UoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiB0cnVlO1xyXG4gICAgICAgICAgICB2YXIgdlBhZ2VzID0gdGhpcy52aXNpYmxlUGFnZXM7XHJcbiAgICAgICAgICAgIHJldHVybiB2UGFnZXMuaW5kZXhPZih0aGlzLmN1cnJlbnRQYWdlKSA9PSB2UGFnZXMubGVuZ3RoIC0gMTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldCBwcm9ncmVzc1RleHQoKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgaWYgKHRoaXMuY3VycmVudFBhZ2UgPT0gbnVsbCkgcmV0dXJuIFwiXCI7XHJcbiAgICAgICAgICAgIHZhciB2UGFnZXMgPSB0aGlzLnZpc2libGVQYWdlcztcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdlBhZ2VzLmluZGV4T2YodGhpcy5jdXJyZW50UGFnZSkgKyAxO1xyXG4gICAgICAgICAgICByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldFN0cmluZyhcInByb2dyZXNzVGV4dFwiKVtcImZvcm1hdFwiXShpbmRleCwgdlBhZ2VzLmxlbmd0aCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGdldFBhZ2UoaW5kZXg6IG51bWJlcik6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnBhZ2VzW2luZGV4XTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkUGFnZShwYWdlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgaWYgKHBhZ2UgPT0gbnVsbCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYWRkTmV3UGFnZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLmNyZWF0ZU5ld1BhZ2UobmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuYWRkUGFnZShwYWdlKTtcclxuICAgICAgICAgICAgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJlbW92ZVBhZ2UocGFnZTogUGFnZU1vZGVsKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHRoaXMucGFnZXMuaW5kZXhPZihwYWdlKTtcclxuICAgICAgICAgICAgaWYgKGluZGV4IDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnBhZ2VzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlVmFsdWUgPT0gcGFnZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jdXJyZW50UGFnZSA9IHRoaXMucGFnZXMubGVuZ3RoID4gMCA/IHRoaXMucGFnZXNbMF0gOiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFF1ZXN0aW9uQnlOYW1lKG5hbWU6IHN0cmluZyk6IElRdWVzdGlvbiB7XHJcbiAgICAgICAgICAgIHZhciBxdWVzdGlvbnMgPSB0aGlzLmdldEFsbFF1ZXN0aW9ucygpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgcXVlc3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZihxdWVzdGlvbnNbaV0ubmFtZSA9PSBuYW1lKSByZXR1cm4gcXVlc3Rpb25zW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UXVlc3Rpb25zQnlOYW1lcyhuYW1lczogc3RyaW5nW10pOiBJUXVlc3Rpb25bXSB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBbXTtcclxuICAgICAgICAgICAgaWYgKCFuYW1lcykgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IG5hbWVzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5hbWVzW2ldKSBjb250aW51ZTtcclxuICAgICAgICAgICAgICAgIHZhciBxdWVzdGlvbiA9IHRoaXMuZ2V0UXVlc3Rpb25CeU5hbWUobmFtZXNbaV0pO1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uKSByZXN1bHQucHVzaChxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFBhZ2VCeVF1ZXN0aW9uKHF1ZXN0aW9uOiBJUXVlc3Rpb24pOiBQYWdlTW9kZWwge1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdmFyIHBhZ2UgPSB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICAgICAgaWYgKHBhZ2UucXVlc3Rpb25zLmluZGV4T2YoPFF1ZXN0aW9uQmFzZT5xdWVzdGlvbikgPiAtMSkgcmV0dXJuIHBhZ2U7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHB1YmxpYyBnZXRQYWdlQnlOYW1lKG5hbWU6IHN0cmluZyk6IFBhZ2VNb2RlbCB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnBhZ2VzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5wYWdlc1tpXS5uYW1lID09IG5hbWUpIHJldHVybiB0aGlzLnBhZ2VzW2ldO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0UGFnZXNCeU5hbWVzKG5hbWVzOiBzdHJpbmdbXSk6IFBhZ2VNb2RlbFtde1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIGlmICghbmFtZXMpIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCBuYW1lcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKCFuYW1lc1tpXSkgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFnZSA9IHRoaXMuZ2V0UGFnZUJ5TmFtZShuYW1lc1tpXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFnZSkgcmVzdWx0LnB1c2gocGFnZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldEFsbFF1ZXN0aW9ucyh2aXNpYmxlT25seTogYm9vbGVhbiA9IGZhbHNlKTogQXJyYXk8SVF1ZXN0aW9uPiB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSBuZXcgQXJyYXk8SVF1ZXN0aW9uPigpO1xyXG4gICAgICAgICAgICBmb3IgKHZhciBpOiBudW1iZXIgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS5hZGRRdWVzdGlvbnNUb0xpc3QocmVzdWx0LCB2aXNpYmxlT25seSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1BhZ2UobmFtZTogc3RyaW5nKSB7IHJldHVybiBuZXcgUGFnZU1vZGVsKG5hbWUpOyB9XHJcbiAgICAgICAgcHJpdmF0ZSBub3RpZnlRdWVzdGlvbk9uVmFsdWVDaGFuZ2VkKG5hbWU6IHN0cmluZywgbmV3VmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgaWYgKHF1ZXN0aW9uc1tpXS5uYW1lICE9IG5hbWUpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5VmFsdWVDaGFuZ2VkKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm9uVmFsdWVDaGFuZ2VkLmZpcmUodGhpcywgeyAnbmFtZSc6IG5hbWUsICd2YWx1ZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIG5vdGlmeUFsbFF1ZXN0aW9uc09uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB2YXIgcXVlc3Rpb25zID0gdGhpcy5nZXRBbGxRdWVzdGlvbnMoKTtcclxuICAgICAgICAgICAgZm9yICh2YXIgaTogbnVtYmVyID0gMDsgaSA8IHF1ZXN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgcXVlc3Rpb25zW2ldLm9uU3VydmV5VmFsdWVDaGFuZ2VkKHRoaXMuZ2V0VmFsdWUocXVlc3Rpb25zW2ldLm5hbWUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGNoZWNrVHJpZ2dlcnMobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk6IG51bWJlciA9IDA7IGkgPCB0aGlzLnRyaWdnZXJzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAodGhpcy50cmlnZ2Vyc1tpXS5uYW1lID09IG5hbWUpIHtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnRyaWdnZXJzW2ldLmNoZWNrKG5ld1ZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgc2VuZFJlc3VsdChwb3N0SWQ6IHN0cmluZyA9IG51bGwsIGNsaWVudElkOiBzdHJpbmcgPSBudWxsLCBpc1BhcnRpYWxDb21wbGV0ZWQ6IGJvb2xlYW4gPSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAoIXBvc3RJZCAmJiB0aGlzLnN1cnZleVBvc3RJZCkge1xyXG4gICAgICAgICAgICAgICAgcG9zdElkID0gdGhpcy5zdXJ2ZXlQb3N0SWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKCFwb3N0SWQpIHJldHVybjtcclxuICAgICAgICAgICAgaWYgKGNsaWVudElkKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmNsaWVudElkID0gY2xpZW50SWQ7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuc2VuZFJlc3VsdChwb3N0SWQsIHRoaXMuZGF0YSwgZnVuY3Rpb24gKHN1Y2Nlc3M6IGJvb2xlYW4sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25TZW5kUmVzdWx0LmZpcmUoc2VsZiwgeyBzdWNjZXNzOiBzdWNjZXNzLCByZXNwb25zZTogcmVzcG9uc2V9KTtcclxuICAgICAgICAgICAgfSwgdGhpcy5jbGllbnRJZCwgaXNQYXJ0aWFsQ29tcGxldGVkKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGdldFJlc3VsdChyZXN1bHRJZDogc3RyaW5nLCBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBuZXcgZHhTdXJ2ZXlTZXJ2aWNlKCkuZ2V0UmVzdWx0KHJlc3VsdElkLCBuYW1lLCBmdW5jdGlvbiAoc3VjY2VzczogYm9vbGVhbiwgZGF0YTogYW55LCBkYXRhTGlzdDogYW55W10sIHJlc3BvbnNlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIHNlbGYub25HZXRSZXN1bHQuZmlyZShzZWxmLCB7IHN1Y2Nlc3M6IHN1Y2Nlc3MsIGRhdGE6IGRhdGEsIGRhdGFMaXN0OiBkYXRhTGlzdCwgcmVzcG9uc2U6IHJlc3BvbnNlIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGxvYWRTdXJ2ZXlGcm9tU2VydmljZShzdXJ2ZXlJZDogc3RyaW5nID0gbnVsbCwgZWxlbWVudDogYW55ID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZiAoc3VydmV5SWQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuc3VydmV5SWQgPSBzdXJ2ZXlJZDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIG5ldyBkeFN1cnZleVNlcnZpY2UoKS5sb2FkU3VydmV5KHRoaXMuc3VydmV5SWQsIGZ1bmN0aW9uIChzdWNjZXNzOiBib29sZWFuLCByZXN1bHQ6IHN0cmluZywgcmVzcG9uc2U6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHN1Y2Nlc3MgJiYgcmVzdWx0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5zZXRKc29uT2JqZWN0KHJlc3VsdCk7XHJcbiAgICAgICAgICAgICAgICAgICAgc2VsZi5vbkxvYWRTdXJ2ZXlGcm9tU2VydmljZShlbGVtZW50KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkxvYWRTdXJ2ZXlGcm9tU2VydmljZShlbGVtZW50OiBhbnkpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVWaXNpYmxlSW5kZXhlcygpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXModGhpcy5zaG93UGFnZU51bWJlcnMpO1xyXG4gICAgICAgICAgICBpZiAodGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25QYWdlXCIpIHtcclxuICAgICAgICAgICAgICAgIHZhciB2aXNQYWdlcyA9IHRoaXMudmlzaWJsZVBhZ2VzO1xyXG4gICAgICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCB2aXNQYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyh2aXNQYWdlc1tpXS5xdWVzdGlvbnMsIHRydWUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVRdWVzdGlvblZpc2libGVJbmRleGVzKHRoaXMuZ2V0QWxsUXVlc3Rpb25zKGZhbHNlKSwgdGhpcy5zaG93UXVlc3Rpb25OdW1iZXJzID09IFwib25cIik7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSB1cGRhdGVQYWdlVmlzaWJsZUluZGV4ZXMoc2hvd0luZGV4OiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IDA7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdGhpcy5wYWdlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5wYWdlc1tpXS52aXNpYmxlSW5kZXggPSB0aGlzLnBhZ2VzW2ldLnZpc2libGUgPyAoaW5kZXgrKykgOiAtMTtcclxuICAgICAgICAgICAgICAgIHRoaXMucGFnZXNbaV0ubnVtID0gc2hvd0luZGV4ICYmIHRoaXMucGFnZXNbaV0udmlzaWJsZSA/IHRoaXMucGFnZXNbaV0udmlzaWJsZUluZGV4ICsgMSA6IC0xO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlUXVlc3Rpb25WaXNpYmxlSW5kZXhlcyhxdWVzdGlvbnM6IElRdWVzdGlvbltdLCBzaG93SW5kZXg6IGJvb2xlYW4pIHtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gMDtcclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWVzdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIHF1ZXN0aW9uc1tpXS5zZXRWaXNpYmxlSW5kZXgoc2hvd0luZGV4ICYmIHF1ZXN0aW9uc1tpXS52aXNpYmxlICYmIHF1ZXN0aW9uc1tpXS5oYXNUaXRsZSA/IChpbmRleCsrKSA6IC0xKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIHNldEpzb25PYmplY3QoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIGlmICghanNvbk9iaikgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBudWxsO1xyXG4gICAgICAgICAgICB2YXIganNvbkNvbnZlcnRlciA9IG5ldyBKc29uT2JqZWN0KCk7XHJcbiAgICAgICAgICAgIGpzb25Db252ZXJ0ZXIudG9PYmplY3QoanNvbk9iaiwgdGhpcyk7XHJcbiAgICAgICAgICAgIGlmIChqc29uQ29udmVydGVyLmVycm9ycy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmpzb25FcnJvcnMgPSBqc29uQ29udmVydGVyLmVycm9ycztcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZVZpc2libGVJbmRleGVzKCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkJlZm9yZUNyZWF0aW5nKCkgeyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICAvL0lTdXJ2ZXkgZGF0YVxyXG4gICAgICAgIGdldFZhbHVlKG5hbWU6IHN0cmluZyk6IGFueSB7XHJcbiAgICAgICAgICAgIGlmICghbmFtZSB8fCBuYW1lLmxlbmd0aCA9PSAwKSByZXR1cm4gbnVsbDtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMudmFsdWVzSGFzaFtuYW1lXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0VmFsdWUobmFtZTogc3RyaW5nLCBuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB0aGlzLm5vdGlmeVF1ZXN0aW9uT25WYWx1ZUNoYW5nZWQobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmNoZWNrVHJpZ2dlcnMobmFtZSwgbmV3VmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBnZXRDb21tZW50KG5hbWU6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSB0aGlzLmRhdGFbbmFtZSArIHRoaXMuY29tbWVudFByZWZpeF07XHJcbiAgICAgICAgICAgIGlmIChyZXN1bHQgPT0gbnVsbCkgcmVzdWx0ID0gXCJcIjtcclxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgICB9XHJcbiAgICAgICAgc2V0Q29tbWVudChuYW1lOiBzdHJpbmcsIG5ld1ZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgbmFtZSA9IG5hbWUgKyB0aGlzLmNvbW1lbnRQcmVmaXg7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSA9PSBcIlwiIHx8IG5ld1ZhbHVlID09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIGRlbGV0ZSB0aGlzLnZhbHVlc0hhc2hbbmFtZV07XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnZhbHVlc0hhc2hbbmFtZV0gPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvblZpc2liaWxpdHlDaGFuZ2VkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIG5ld1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblZpc2libGVDaGFuZ2VkLmZpcmUodGhpcywgeyAncXVlc3Rpb24nOiBxdWVzdGlvbiwgJ25hbWUnOiBxdWVzdGlvbi5uYW1lLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwYWdlVmlzaWJpbGl0eUNoYW5nZWQocGFnZTogSVBhZ2UsIG5ld1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblBhZ2VWaXNpYmxlQ2hhbmdlZC5maXJlKHRoaXMsIHsgJ3BhZ2UnOiBwYWdlLCAndmlzaWJsZSc6IG5ld1ZhbHVlIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBxdWVzdGlvbkFkZGVkKHF1ZXN0aW9uOiBJUXVlc3Rpb24sIGluZGV4OiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVWaXNpYmxlSW5kZXhlcygpO1xyXG4gICAgICAgICAgICB0aGlzLm9uUXVlc3Rpb25BZGRlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSwgJ2luZGV4JzogaW5kZXggfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHF1ZXN0aW9uUmVtb3ZlZChxdWVzdGlvbjogSVF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMudXBkYXRlVmlzaWJsZUluZGV4ZXMoKTtcclxuICAgICAgICAgICAgdGhpcy5vblF1ZXN0aW9uUmVtb3ZlZC5maXJlKHRoaXMsIHsgJ3F1ZXN0aW9uJzogcXVlc3Rpb24sICduYW1lJzogcXVlc3Rpb24ubmFtZSB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhbGlkYXRlUXVlc3Rpb24obmFtZTogc3RyaW5nKTogU3VydmV5RXJyb3Ige1xyXG4gICAgICAgICAgICBpZiAodGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uaXNFbXB0eSkgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgICAgIHZhciBvcHRpb25zID0geyBuYW1lOiBuYW1lLCB2YWx1ZTogdGhpcy5nZXRWYWx1ZShuYW1lKSwgZXJyb3I6IG51bGwgfTtcclxuICAgICAgICAgICAgdGhpcy5vblZhbGlkYXRlUXVlc3Rpb24uZmlyZSh0aGlzLCBvcHRpb25zKTtcclxuICAgICAgICAgICAgcmV0dXJuIG9wdGlvbnMuZXJyb3IgPyBuZXcgQ3VzdG9tRXJyb3Iob3B0aW9ucy5lcnJvcikgOiBudWxsO1xyXG4gICAgICAgIH1cclxuICAgICAgICAvL0lTdXJ2ZXlUcmlnZ2VyT3duZXJcclxuICAgICAgICBnZXRPYmplY3RzKHBhZ2VzOiBzdHJpbmdbXSwgcXVlc3Rpb25zOiBzdHJpbmdbXSk6IGFueVtde1xyXG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gW107XHJcbiAgICAgICAgICAgIEFycmF5LnByb3RvdHlwZS5wdXNoLmFwcGx5KHJlc3VsdCwgdGhpcy5nZXRQYWdlc0J5TmFtZXMocGFnZXMpKTtcclxuICAgICAgICAgICAgQXJyYXkucHJvdG90eXBlLnB1c2guYXBwbHkocmVzdWx0LCB0aGlzLmdldFF1ZXN0aW9uc0J5TmFtZXMocXVlc3Rpb25zKSk7XHJcbiAgICAgICAgICAgIHJldHVybiByZXN1bHQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuYWRkQ2xhc3MoXCJzdXJ2ZXlcIiwgW1wibG9jYWxlXCIsIFwidGl0bGVcIiwgXCJwYWdlc1wiLCBcInF1ZXN0aW9uc1wiLCBcInRyaWdnZXJzOnRyaWdnZXJzXCIsIFwic3VydmV5SWRcIiwgXCJzdXJ2ZXlQb3N0SWRcIiwgXCJzZW5kUmVzdWx0T25QYWdlTmV4dDpib29sZWFuXCIsXHJcbiAgICAgICAgXCJzaG93TmF2aWdhdGlvbkJ1dHRvbnM6Ym9vbGVhblwiLCBcInNob3dUaXRsZTpib29sZWFuXCIsIFwic2hvd1BhZ2VUaXRsZXM6Ym9vbGVhblwiLCBcInNob3dQYWdlTnVtYmVyczpib29sZWFuXCIsIFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBcInNob3dQcm9ncmVzc0JhclwiLFxyXG4gICAgICAgIFwicmVxdWlyZWRUZXh0XCIsIFwicGFnZVByZXZUZXh0XCIsIFwicGFnZU5leHRUZXh0XCIsIFwiY29tcGxldGVUZXh0XCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJwYWdlc1wiLCBcInBhZ2VcIik7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwicXVlc3Rpb25zXCIsIG51bGwsIG51bGwsXHJcbiAgICAgICAgZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gbnVsbDsgfSxcclxuICAgICAgICBmdW5jdGlvbiAob2JqLCB2YWx1ZSwganNvbkNvbnZlcnRlcikge1xyXG4gICAgICAgICAgICB2YXIgcGFnZSA9IG9iai5hZGROZXdQYWdlKFwiXCIpO1xyXG4gICAgICAgICAgICBqc29uQ29udmVydGVyLnRvT2JqZWN0KHsgcXVlc3Rpb25zOiB2YWx1ZSB9LCBwYWdlKTtcclxuICAgICAgICB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJzaG93TmF2aWdhdGlvbkJ1dHRvbnNcIiwgbnVsbCwgdHJ1ZSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1RpdGxlXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInNob3dQYWdlVGl0bGVzXCIsIG51bGwsIHRydWUpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInNob3dRdWVzdGlvbk51bWJlcnNcIiwgbnVsbCwgXCJvblwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDaG9pY2VzKFwic3VydmV5XCIsIFwic2hvd1F1ZXN0aW9uTnVtYmVyc1wiLCBbXCJvblwiLCBcIm9uUGFnZVwiLCBcIm9mZlwiXSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwic2hvd1Byb2dyZXNzQmFyXCIsIG51bGwsIFwib2ZmXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJzdXJ2ZXlcIiwgXCJzaG93UHJvZ3Jlc3NCYXJcIiwgW1wib2ZmXCIsIFwidG9wXCIsIFwiYm90dG9tXCJdKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJyZXF1aXJlZFRleHRcIiwgbnVsbCwgXCIqIFwiKTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlWYWx1ZXMoXCJzdXJ2ZXlcIiwgXCJwYWdlUHJldlRleHRcIiwgbnVsbCwgbnVsbCwgZnVuY3Rpb24gKG9iajogYW55KSB7IHJldHVybiBvYmoucGFnZVByZXZUZXh0VmFsdWU7IH0pO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eVZhbHVlcyhcInN1cnZleVwiLCBcInBhZ2VOZXh0VGV4dFwiLCBudWxsLCBudWxsLCBmdW5jdGlvbiAob2JqOiBhbnkpIHsgcmV0dXJuIG9iai5wYWdlTmV4dFRleHRWYWx1ZTsgfSk7XHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLnNldFByb3BlcnR5VmFsdWVzKFwic3VydmV5XCIsIFwiY29tcGxldGVUZXh0XCIsIG51bGwsIG51bGwsIGZ1bmN0aW9uIChvYmo6IGFueSkgeyByZXR1cm4gb2JqLmNvbXBsZXRlVGV4dFZhbHVlOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEuc2V0UHJvcGVydHlDbGFzc0luZm8oXCJzdXJ2ZXlcIiwgXCJ0cmlnZ2Vyc1wiLCBcInN1cnZleXRyaWdnZXJcIiwgXCJ0cmlnZ2VyXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNsYXNzSW5mbyhcInN1cnZleVwiLCBcInF1ZXN0aW9uc1wiLCBcInF1ZXN0aW9uXCIpO1xyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5zZXRQcm9wZXJ0eUNob2ljZXMoXCJzdXJ2ZXlcIiwgXCJsb2NhbGVcIiwgbnVsbCwgKCkgPT4geyByZXR1cm4gc3VydmV5TG9jYWxpemF0aW9uLmdldExvY2FsZXMoKSB9KTtcclxufSIsIm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVdpbmRvd01vZGVsIGV4dGVuZHMgQmFzZSAge1xyXG4gICAgICAgIHB1YmxpYyBzdGF0aWMgc3VydmV5RWxlbWVudE5hbWUgPSBcIndpbmRvd1N1cnZleUpTXCI7XHJcbiAgICAgICAgc3VydmV5VmFsdWU6IFN1cnZleU1vZGVsO1xyXG4gICAgICAgIHdpbmRvd0VsZW1lbnQ6IEhUTUxEaXZFbGVtZW50O1xyXG4gICAgICAgIGlzU2hvd2luZ1ZhbHVlOiBib29sZWFuO1xyXG4gICAgICAgIGlzRXhwYW5kZWRWYWx1ZTogYm9vbGVhbjtcclxuICAgICAgICB0aXRsZVZhbHVlOiBzdHJpbmc7XHJcbiAgICAgICAgdGVtcGxhdGVWYWx1ZTogc3RyaW5nO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGNvbnN0cnVjdG9yKGpzb25PYmo6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcigpO1xyXG4gICAgICAgICAgICB0aGlzLnN1cnZleVZhbHVlID0gdGhpcy5jcmVhdGVTdXJ2ZXkoanNvbk9iaik7XHJcbiAgICAgICAgICAgIHRoaXMuc3VydmV5VmFsdWUuc2hvd1RpdGxlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudCA9IDxIVE1MRGl2RWxlbWVudD5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgZ2V0VHlwZSgpIDogc3RyaW5nIHsgcmV0dXJuIFwid2luZG93XCIgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgc3VydmV5KCk6IFN1cnZleU1vZGVsIHsgcmV0dXJuIHRoaXMuc3VydmV5VmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzU2hvd2luZygpOiBib29sZWFuIHsgcmV0dXJuIHRoaXMuaXNTaG93aW5nVmFsdWU7IH1cclxuICAgICAgICBwdWJsaWMgZ2V0IGlzRXhwYW5kZWQoKTogYm9vbGVhbiB7IHJldHVybiB0aGlzLmlzRXhwYW5kZWRWYWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBnZXQgdGl0bGUoKTogc3RyaW5nIHsgcmV0dXJuIHRoaXMudGl0bGVWYWx1ZSA/IHRoaXMudGl0bGVWYWx1ZSA6IHRoaXMuc3VydmV5LnRpdGxlOyB9XHJcbiAgICAgICAgcHVibGljIHNldCB0aXRsZSh2YWx1ZTogc3RyaW5nKSB7IHRoaXMudGl0bGVWYWx1ZSA9IHZhbHVlOyB9XHJcbiAgICAgICAgcHVibGljIGV4cGFuZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5leHBhbmRjb2xsYXBzZSh0cnVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIGNvbGxhcHNlKCkge1xyXG4gICAgICAgICAgICB0aGlzLmV4cGFuZGNvbGxhcHNlKGZhbHNlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZVN1cnZleShqc29uT2JqOiBhbnkpOiBTdXJ2ZXlNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgU3VydmV5TW9kZWwoanNvbk9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGV4cGFuZGNvbGxhcHNlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNFeHBhbmRlZFZhbHVlID0gdmFsdWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uLy9zdXJ2ZXlTdHJpbmdzLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICB2YXIgZ2VybWFuU3VydmV5U3RyaW5ncyA9IHtcclxuICAgICAgICBwYWdlUHJldlRleHQ6IFwiWnVyw7xja1wiLFxyXG4gICAgICAgIHBhZ2VOZXh0VGV4dDogXCJXZWl0ZXJcIixcclxuICAgICAgICBjb21wbGV0ZVRleHQ6IFwiRmVydGlnXCIsXHJcbiAgICAgICAgcHJvZ3Jlc3NUZXh0OiBcIlNlaXRlIHswfSB2b24gezF9XCIsXHJcbiAgICAgICAgb3RoZXJJdGVtVGV4dDogXCJBbmRlcmUgKGJlc2NocmVpYmVuKVwiLFxyXG4gICAgICAgIG9wdGlvbnNDYXB0aW9uOiBcIlfDpGhsZW4uLi5cIixcclxuICAgICAgICByZXF1aXJlZEVycm9yOiBcIkJpdHRlIGFudHdvcnRlbiBTaWUgYXVmIGRpZSBGcmFnZS5cIixcclxuICAgICAgICBudW1lcmljRXJyb3I6IFwiRGVyIFdlcnQgc29sbHRlIGVpbmUgWmFobCBzZWluLlwiLFxyXG4gICAgICAgIHRleHRNaW5MZW5ndGg6IFwiQml0dGUgZ2ViZW4gU2llIG1pbmRlc3RlbnMgezB9IFN5bWJvbGUuXCIsXHJcbiAgICAgICAgbWluU2VsZWN0RXJyb3I6IFwiQml0dGUgd8OkaGxlbiBTaWUgbWluZGVzdGVucyB7MH0gVmFyaWFudGVuLlwiLFxyXG4gICAgICAgIG1heFNlbGVjdEVycm9yOiBcIkJpdHRlIHfDpGhsZW4gU2llIG5pY3RoIG1laHIgYWxzIHswfSBWYXJpYW50ZW4uXCIsXHJcbiAgICAgICAgbnVtZXJpY01pbk1heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBncsO2w59lciBzZWluIGFscyB7MX0gdW5kIGdsZWljaCBvZGVyIGtsZWluZXIgYWxzIHsyfVwiLFxyXG4gICAgICAgIG51bWVyaWNNaW46IFwiJ3swfScgc29sdGUgZ2xlaWNoIG9kZXIgZ3LDtsOfZXIgc2VpbiBhbHMgezF9XCIsXHJcbiAgICAgICAgbnVtZXJpY01heDogXCInezB9JyBzb2x0ZSBnbGVpY2ggb2RlciBrbGVpbmVyIGFscyB7MX1cIlxyXG4gICAgfVxyXG4gICAgc3VydmV5TG9jYWxpemF0aW9uLmxvY2FsZXNbXCJkZVwiXSA9IGdlcm1hblN1cnZleVN0cmluZ3M7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcGFnZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFBhZ2UgZXh0ZW5kcyBQYWdlTW9kZWwge1xyXG4gICAgICAgIGtvTm86IGFueTsgXHJcbiAgICAgICAgY29uc3RydWN0b3IobmFtZTogc3RyaW5nID0gXCJcIikge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgdGhpcy5rb05vID0ga28ub2JzZXJ2YWJsZShcIlwiKTtcclxuICAgICAgICAgICAgdGhpcy5vbkNyZWF0aW5nKCk7XHJcbiAgICAgICAgfSAgICAgICAgXHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ3JlYXRpbmcoKSB7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25OdW1DaGFuZ2VkKHZhbHVlOiBudW1iZXIpIHtcclxuICAgICAgICAgICAgdGhpcy5rb05vKHZhbHVlID4gMCA/IHZhbHVlICsgXCIuIFwiIDogXCJcIik7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJwYWdlXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBQYWdlKCk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uYmFzZS50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uSW1wbGVtZW50b3JCYXNlIHtcclxuICAgICAgICBrb1Zpc2libGU6IGFueTsga29ObzogYW55OyBrb0Vycm9yczogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBxdWVzdGlvbjogUXVlc3Rpb25CYXNlKSB7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgcXVlc3Rpb24udmlzaWJpbGl0eUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZpc2liaWxpdHlDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgICAgIHF1ZXN0aW9uLnZpc2libGVJbmRleENoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZpc2libGVJbmRleENoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGUgPSBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb24udmlzaWJsZSk7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnMgPSBrby5vYnNlcnZhYmxlQXJyYXkoKTtcclxuICAgICAgICAgICAgdGhpcy5rb05vID0ga28ub2JzZXJ2YWJsZSh0aGlzLmdldE5vKCkpO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29WaXNpYmxlXCJdID0gdGhpcy5rb1Zpc2libGU7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb05vXCJdID0gdGhpcy5rb05vO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29FcnJvcnNcIl0gPSB0aGlzLmtvRXJyb3JzO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25WaXNpYmlsaXR5Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGUodGhpcy5xdWVzdGlvbi52aXNpYmxlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmlzaWJsZUluZGV4Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb05vKHRoaXMuZ2V0Tm8oKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRObygpOiBzdHJpbmcge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvbi52aXNpYmxlSW5kZXggPiAtMSA/IHRoaXMucXVlc3Rpb24udmlzaWJsZUluZGV4ICsgMSArIFwiLiBcIiA6IFwiXCI7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvcXVlc3Rpb25iYXNlLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25JbXBsZW1lbnRvciBleHRlbmRzIFF1ZXN0aW9uSW1wbGVtZW50b3JCYXNlIHtcclxuICAgICAgICBwcml2YXRlIGlzVXBkYXRpbmc6IGJvb2xlYW4gPSBmYWxzZTtcclxuICAgICAgICBrb1ZhbHVlOiBhbnk7IGtvQ29tbWVudDogYW55OyBcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgcXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBxdWVzdGlvbi52YWx1ZUNoYW5nZWRDYWxsYmFjayA9IGZ1bmN0aW9uICgpIHsgc2VsZi5vblZhbHVlQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgICAgICBxdWVzdGlvbi5jb21tZW50Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uQ29tbWVudENoYW5nZWQoKTsgfTtcclxuICAgICAgICAgICAgcXVlc3Rpb24uZXJyb3JzQ2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uRXJyb3JzQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSB0aGlzLmNyZWF0ZWtvVmFsdWUoKTtcclxuICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQgPSBrby5vYnNlcnZhYmxlKHRoaXMucXVlc3Rpb24uY29tbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMua29FcnJvcnModGhpcy5xdWVzdGlvbi5lcnJvcnMpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgc2VsZi51cGRhdGVWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvQ29tbWVudC5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBzZWxmLnVwZGF0ZUNvbW1lbnQobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmFsdWVcIl0gPSB0aGlzLmtvVmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb0NvbW1lbnRcIl0gPSB0aGlzLmtvQ29tbWVudDtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICBpZiAodGhpcy5pc1VwZGF0aW5nKSByZXR1cm47XHJcbiAgICAgICAgICAgIHRoaXMuc2V0a29WYWx1ZSh0aGlzLnF1ZXN0aW9uLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uQ29tbWVudENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmlzVXBkYXRpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgdGhpcy5rb0NvbW1lbnQodGhpcy5xdWVzdGlvbi5jb21tZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmlzaWJpbGl0eUNoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WaXNpYmxlKHRoaXMucXVlc3Rpb24udmlzaWJsZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZpc2libGVJbmRleENoYW5nZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMua29Obyh0aGlzLmdldE5vKCkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25FcnJvcnNDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmtvRXJyb3JzKHRoaXMucXVlc3Rpb24uZXJyb3JzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZWtvVmFsdWUoKTogYW55IHsgcmV0dXJuIGtvLm9ic2VydmFibGUodGhpcy5xdWVzdGlvbi52YWx1ZSk7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0a29WYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZShuZXdWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVWYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb24udmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgdGhpcy5pc1VwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCB1cGRhdGVDb21tZW50KG5ld1ZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1VwZGF0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbi5jb21tZW50ID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgIHRoaXMuaXNVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0Tm8oKTogc3RyaW5nIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRoaXMucXVlc3Rpb24udmlzaWJsZUluZGV4ID4gLTEgPyB0aGlzLnF1ZXN0aW9uLnZpc2libGVJbmRleCArIDEgKyBcIi4gXCIgOiBcIlwiO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJrb3F1ZXN0aW9uLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25TZWxlY3RCYXNlSW1wbGVtZW50b3IgZXh0ZW5kcyBRdWVzdGlvbkltcGxlbWVudG9ye1xyXG4gICAgICAgIGtvT3RoZXJWaXNpYmxlOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IocXVlc3Rpb246IFF1ZXN0aW9uKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKHF1ZXN0aW9uKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmtvT3RoZXJWaXNpYmxlID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmtvVmFsdWUoKTsgcmV0dXJuIHNlbGYuaXNPdGhlclNlbGVjdGVkOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvT3RoZXJWaXNpYmxlXCJdID0gdGhpcy5rb090aGVyVmlzaWJsZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCBpc090aGVyU2VsZWN0ZWQoKTogYm9vbGVhbiB7XHJcbiAgICAgICAgICAgIHJldHVybiAoPFF1ZXN0aW9uU2VsZWN0QmFzZT50aGlzLnF1ZXN0aW9uKS5pc090aGVyU2VsZWN0ZWQ7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ2hlY2tib3hCYXNlSW1wbGVtZW50b3IgZXh0ZW5kcyBRdWVzdGlvblNlbGVjdEJhc2VJbXBsZW1lbnRvciB7XHJcbiAgICAgICAga29XaWR0aDogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMua29XaWR0aCA9IGtvLm9ic2VydmFibGUodGhpcy5jb2xXaWR0aCk7XHJcbiAgICAgICAgICAgIHRoaXMucXVlc3Rpb25bXCJrb1dpZHRoXCJdID0gdGhpcy5rb1dpZHRoO1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29BZnRlclJlbmRlclwiXSA9IHRoaXMua29BZnRlclJlbmRlcjtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICAoPFF1ZXN0aW9uQ2hlY2tib3hCYXNlPnRoaXMucXVlc3Rpb24pLmNvbENvdW50Q2hhbmdlZENhbGxiYWNrID0gZnVuY3Rpb24gKCkgeyBzZWxmLm9uQ29sQ291bnRDaGFuZ2VkKCk7IH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvbkNvbENvdW50Q2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvV2lkdGhcIl0gPSBrby5vYnNlcnZhYmxlKHRoaXMuY29sV2lkdGgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0IGNvbFdpZHRoKCk6IHN0cmluZyB7XHJcbiAgICAgICAgICAgIHZhciBjb2xDb3VudCA9ICg8UXVlc3Rpb25DaGVja2JveEJhc2U+dGhpcy5xdWVzdGlvbikuY29sQ291bnQ7XHJcbiAgICAgICAgICAgIHJldHVybiBjb2xDb3VudCA+IDAgPyAoMTAwIC8gY29sQ291bnQpICsgJyUnIDogXCJcIjtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJpdmF0ZSBrb0FmdGVyUmVuZGVyKGVsLCBjb24pIHtcclxuICAgICAgICAgICAgdmFyIHRFbCA9IGVsWzBdO1xyXG4gICAgICAgICAgICBpZiAodEVsLm5vZGVOYW1lID09IFwiI3RleHRcIikgdEVsLmRhdGEgPSBcIlwiO1xyXG4gICAgICAgICAgICB0RWwgPSBlbFtlbC5sZW5ndGggLSAxXTtcclxuICAgICAgICAgICAgaWYgKHRFbC5ub2RlTmFtZSA9PSBcIiN0ZXh0XCIpIHRFbC5kYXRhID0gXCJcIjtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fY2hlY2tib3gudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwia29xdWVzdGlvbl9iYXNlc2VsZWN0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBjbGFzcyBRdWVzdGlvbkNoZWNrYm94SW1wbGVtZW50b3IgZXh0ZW5kcyBRdWVzdGlvbkNoZWNrYm94QmFzZUltcGxlbWVudG9yIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihxdWVzdGlvbjogUXVlc3Rpb24pIHtcclxuICAgICAgICAgICAgc3VwZXIocXVlc3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRla29WYWx1ZSgpOiBhbnkge1xyXG4gICAgICAgICAgICByZXR1cm4gdGhpcy5xdWVzdGlvbi52YWx1ZSA/IGtvLm9ic2VydmFibGVBcnJheSh0aGlzLnF1ZXN0aW9uLnZhbHVlKSA6IGtvLm9ic2VydmFibGVBcnJheSgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgc2V0a29WYWx1ZShuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKFtdLmNvbmNhdChuZXdWYWx1ZSkpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5rb1ZhbHVlKFtdKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH1cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkNoZWNrYm94IGV4dGVuZHMgUXVlc3Rpb25DaGVja2JveE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25DaGVja2JveEltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImNoZWNrYm94XCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNoZWNrYm94KFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwiY2hlY2tib3hcIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25DaGVja2JveChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fY29tbWVudC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uQ29tbWVudCBleHRlbmRzIFF1ZXN0aW9uQ29tbWVudE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25JbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJjb21tZW50XCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbkNvbW1lbnQoXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJjb21tZW50XCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25Db21tZW50KG5hbWUpOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9kcm9wZG93bi50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uRHJvcGRvd24gZXh0ZW5kcyBRdWVzdGlvbkRyb3Bkb3duTW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvblNlbGVjdEJhc2VJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJkcm9wZG93blwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25Ecm9wZG93bihcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImRyb3Bkb3duXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uRHJvcGRvd24obmFtZSk7IHEuY2hvaWNlcyA9IFF1ZXN0aW9uRmFjdG9yeS5EZWZhdWx0Q2hvaWNlczsgcmV0dXJuIHE7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX2h0bWwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwia29xdWVzdGlvbmJhc2UudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbkh0bWwgZXh0ZW5kcyBRdWVzdGlvbkh0bWxNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3JCYXNlKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcImh0bWxcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uSHRtbChcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcImh0bWxcIiwgKG5hbWUpID0+IHsgcmV0dXJuIG5ldyBRdWVzdGlvbkh0bWwobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX21hdHJpeC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeFJvdyBleHRlbmRzIE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55LCBwdWJsaWMgdGV4dDogc3RyaW5nLCBwdWJsaWMgZnVsbE5hbWU6IHN0cmluZywgZGF0YTogSU1hdHJpeERhdGEsIHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSwgdGV4dCwgZnVsbE5hbWUsIGRhdGEsIHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5rb1ZhbHVlID0ga28ub2JzZXJ2YWJsZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUuc3Vic2NyaWJlKGZ1bmN0aW9uIChuZXdWYWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKHNlbGYuaXNWYWx1ZVVwZGF0aW5nKSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgc2VsZi52YWx1ZSA9IG5ld1ZhbHVlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIG9uVmFsdWVDaGFuZ2VkKCkge1xyXG4gICAgICAgICAgICB0aGlzLmlzVmFsdWVVcGRhdGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZSh0aGlzLnZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlVXBkYXRpbmcgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25NYXRyaXggZXh0ZW5kcyBRdWVzdGlvbk1hdHJpeE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25JbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU1hdHJpeFJvdyhuYW1lOiBhbnksIHRleHQ6IHN0cmluZywgZnVsbE5hbWU6IHN0cmluZywgdmFsdWU6IGFueSk6IE1hdHJpeFJvd01vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXhSb3cobmFtZSwgdGV4dCwgZnVsbE5hbWUsIHRoaXMsIHZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJtYXRyaXhcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uTWF0cml4KFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4XCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uTWF0cml4KG5hbWUpOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmNvbHVtbnMgPSBbXCJDb2x1bW4gMVwiLCBcIkNvbHVtbiAyXCIsIFwiQ29sdW1uIDNcIl07IHJldHVybiBxOyB9KTtcclxufSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCIuLi9xdWVzdGlvbl9tYXRyaXhkcm9wZG93bi50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duQ2VsbCBleHRlbmRzIE1hdHJpeERyb3Bkb3duQ2VsbE1vZGVsIHtcclxuICAgICAgICBwcml2YXRlIGlzVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgY29sdW1uOiBNYXRyaXhEcm9wZG93bkNvbHVtbiwgcHVibGljIHJvdzogTWF0cml4RHJvcGRvd25Sb3dNb2RlbCwgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihjb2x1bW4sIHJvdywgZGF0YSwgdmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5pc1ZhbHVlVXBkYXRpbmcpIHJldHVybjtcclxuICAgICAgICAgICAgICAgIHNlbGYudmFsdWUgPSBuZXdWYWx1ZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBvblZhbHVlQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5pc1ZhbHVlVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUodGhpcy52YWx1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNWYWx1ZVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIE1hdHJpeERyb3Bkb3duUm93IGV4dGVuZHMgTWF0cml4RHJvcGRvd25Sb3dNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IGFueSwgcHVibGljIHRleHQ6IHN0cmluZywgZGF0YTogSU1hdHJpeERyb3Bkb3duRGF0YSwgdmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lLCB0ZXh0LCBkYXRhLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVDZWxsKGNvbHVtbjogTWF0cml4RHJvcGRvd25Db2x1bW4sIHZhbHVlOiBhbnkpOiBNYXRyaXhEcm9wZG93bkNlbGxNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25DZWxsKGNvbHVtbiwgdGhpcywgdGhpcy5kYXRhLCB2YWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uTWF0cml4RHJvcGRvd24gZXh0ZW5kcyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duTW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvbkltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlTWF0cml4Um93KG5hbWU6IGFueSwgdGV4dDogc3RyaW5nLCB2YWx1ZTogYW55KTogTWF0cml4RHJvcGRvd25Sb3dNb2RlbCB7XHJcbiAgICAgICAgICAgIHJldHVybiBuZXcgTWF0cml4RHJvcGRvd25Sb3cobmFtZSwgdGV4dCwgdGhpcywgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBKc29uT2JqZWN0Lm1ldGFEYXRhLm92ZXJyaWRlQ2xhc3NDcmVhdG9yZShcIm1hdHJpeGRyb3Bkb3duXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk1hdHJpeERyb3Bkb3duKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwibWF0cml4ZHJvcGRvd25cIiwgKG5hbWUpID0+IHsgdmFyIHEgPSBuZXcgUXVlc3Rpb25NYXRyaXhEcm9wZG93bihuYW1lKTsgcS5jaG9pY2VzID0gWzEsIDIsIDMsIDQsIDVdOyBxLnJvd3MgPSBbXCJSb3cgMVwiLCBcIlJvdyAyXCJdOyBxLmFkZENvbHVtbihcIkNvbHVtbiAxXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAyXCIpOyBxLmFkZENvbHVtbihcIkNvbHVtbiAzXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fbXVsdGlwbGV0ZXh0LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgTXVsdGlwbGVUZXh0SXRlbSBleHRlbmRzIE11bHRpcGxlVGV4dEl0ZW1Nb2RlbCB7XHJcbiAgICAgICAgcHJpdmF0ZSBpc0tPVmFsdWVVcGRhdGluZyA9IGZhbHNlO1xyXG4gICAgICAgIGtvVmFsdWU6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogYW55ID0gbnVsbCwgdGl0bGU6IHN0cmluZyA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSwgdGl0bGUpO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUgPSBrby5vYnNlcnZhYmxlKHRoaXMudmFsdWUpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMua29WYWx1ZS5zdWJzY3JpYmUoZnVuY3Rpb24gKG5ld1ZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIXNlbGYuaXNLT1ZhbHVlVXBkYXRpbmcpIHtcclxuICAgICAgICAgICAgICAgICAgICBzZWxmLnZhbHVlID0gbmV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBvblZhbHVlQ2hhbmdlZChuZXdWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXNLT1ZhbHVlVXBkYXRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICB0aGlzLmtvVmFsdWUobmV3VmFsdWUpO1xyXG4gICAgICAgICAgICB0aGlzLmlzS09WYWx1ZVVwZGF0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvbk11bHRpcGxlVGV4dCBleHRlbmRzIFF1ZXN0aW9uTXVsdGlwbGVUZXh0TW9kZWwge1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHB1YmxpYyBuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgc3VwZXIobmFtZSk7XHJcbiAgICAgICAgICAgIG5ldyBRdWVzdGlvbkltcGxlbWVudG9yKHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlVGV4dEl0ZW0obmFtZTogc3RyaW5nLCB0aXRsZTogc3RyaW5nKTogTXVsdGlwbGVUZXh0SXRlbU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtKG5hbWUsIHRpdGxlKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJtdWx0aXBsZXRleHRpdGVtXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBNdWx0aXBsZVRleHRJdGVtKFwiXCIpOyB9KTtcclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwibXVsdGlwbGV0ZXh0XCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChcIlwiKTsgfSk7XHJcbiAgICBRdWVzdGlvbkZhY3RvcnkuSW5zdGFuY2UucmVnaXN0ZXJRdWVzdGlvbihcIm11bHRpcGxldGV4dFwiLCAobmFtZSkgPT4geyB2YXIgcSA9IG5ldyBRdWVzdGlvbk11bHRpcGxlVGV4dChuYW1lKTsgcS5BZGRJdGVtKFwidGV4dDFcIik7IHEuQWRkSXRlbShcInRleHQyXCIpOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fcmFkaW9ncm91cC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFF1ZXN0aW9uUmFkaW9ncm91cCBleHRlbmRzIFF1ZXN0aW9uUmFkaW9ncm91cE1vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25DaGVja2JveEJhc2VJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJyYWRpb2dyb3VwXCIsIGZ1bmN0aW9uICgpIHsgcmV0dXJuIG5ldyBRdWVzdGlvblJhZGlvZ3JvdXAoXCJcIik7IH0pO1xyXG4gICAgUXVlc3Rpb25GYWN0b3J5Lkluc3RhbmNlLnJlZ2lzdGVyUXVlc3Rpb24oXCJyYWRpb2dyb3VwXCIsIChuYW1lKSA9PiB7IHZhciBxID0gbmV3IFF1ZXN0aW9uUmFkaW9ncm91cChuYW1lKTsgcS5jaG9pY2VzID0gUXVlc3Rpb25GYWN0b3J5LkRlZmF1bHRDaG9pY2VzOyByZXR1cm4gcTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vcXVlc3Rpb25fcmF0aW5nLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBjbGFzcyBRdWVzdGlvblJhdGluZ0ltcGxlbWVudG9yIGV4dGVuZHMgUXVlc3Rpb25JbXBsZW1lbnRvciB7XHJcbiAgICAgICAga29WaXNpYmxlUmF0ZVZhbHVlczogYW55OyBrb0NoYW5nZTogYW55O1xyXG4gICAgICAgIGNvbnN0cnVjdG9yKHF1ZXN0aW9uOiBRdWVzdGlvbikge1xyXG4gICAgICAgICAgICBzdXBlcihxdWVzdGlvbik7XHJcbiAgICAgICAgICAgIHRoaXMua29WaXNpYmxlUmF0ZVZhbHVlcyA9IGtvLm9ic2VydmFibGVBcnJheSgoPFF1ZXN0aW9uUmF0aW5nPnRoaXMucXVlc3Rpb24pLnZpc2libGVSYXRlVmFsdWVzKTtcclxuICAgICAgICAgICAgdGhpcy5xdWVzdGlvbltcImtvVmlzaWJsZVJhdGVWYWx1ZXNcIl0gPSB0aGlzLmtvVmlzaWJsZVJhdGVWYWx1ZXM7XHJcbiAgICAgICAgICAgIHZhciBzZWxmID0gdGhpcztcclxuICAgICAgICAgICAgdGhpcy5rb0NoYW5nZSA9IGZ1bmN0aW9uICh2YWwpIHsgc2VsZi5rb1ZhbHVlKHZhbC5pdGVtVmFsdWUpOyB9O1xyXG4gICAgICAgICAgICB0aGlzLnF1ZXN0aW9uW1wia29DaGFuZ2VcIl0gPSB0aGlzLmtvQ2hhbmdlO1xyXG4gICAgICAgICAgICAoPFF1ZXN0aW9uUmF0aW5nPnRoaXMucXVlc3Rpb24pLnJhdGVWYWx1ZXNDaGFuZ2VkQ2FsbGJhY2sgPSBmdW5jdGlvbiAoKSB7IHNlbGYub25SYXRlVmFsdWVzQ2hhbmdlZCgpOyB9O1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25SYXRlVmFsdWVzQ2hhbmdlZCgpIHtcclxuICAgICAgICAgICAgdGhpcy5rb1Zpc2libGVSYXRlVmFsdWVzKCg8UXVlc3Rpb25SYXRpbmc+dGhpcy5xdWVzdGlvbikudmlzaWJsZVJhdGVWYWx1ZXMpO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBleHBvcnQgY2xhc3MgUXVlc3Rpb25SYXRpbmcgZXh0ZW5kcyBRdWVzdGlvblJhdGluZ01vZGVsIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcihwdWJsaWMgbmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKG5hbWUpO1xyXG4gICAgICAgICAgICBuZXcgUXVlc3Rpb25SYXRpbmdJbXBsZW1lbnRvcih0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgSnNvbk9iamVjdC5tZXRhRGF0YS5vdmVycmlkZUNsYXNzQ3JlYXRvcmUoXCJyYXRpbmdcIiwgZnVuY3Rpb24gKCkgeyByZXR1cm4gbmV3IFF1ZXN0aW9uUmF0aW5nKFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwicmF0aW5nXCIsIChuYW1lKSA9PiB7IHJldHVybiBuZXcgUXVlc3Rpb25SYXRpbmcobmFtZSk7IH0pO1xyXG59IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3F1ZXN0aW9uX3RleHQudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBRdWVzdGlvblRleHQgZXh0ZW5kcyBRdWVzdGlvblRleHRNb2RlbCB7XHJcbiAgICAgICAgY29uc3RydWN0b3IocHVibGljIG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgICAgICBzdXBlcihuYW1lKTtcclxuICAgICAgICAgICAgbmV3IFF1ZXN0aW9uSW1wbGVtZW50b3IodGhpcyk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIEpzb25PYmplY3QubWV0YURhdGEub3ZlcnJpZGVDbGFzc0NyZWF0b3JlKFwidGV4dFwiLCBmdW5jdGlvbiAoKSB7IHJldHVybiBuZXcgUXVlc3Rpb25UZXh0KFwiXCIpOyB9KTtcclxuICAgIFF1ZXN0aW9uRmFjdG9yeS5JbnN0YW5jZS5yZWdpc3RlclF1ZXN0aW9uKFwidGV4dFwiLCAobmFtZSkgPT4geyByZXR1cm4gbmV3IFF1ZXN0aW9uVGV4dChuYW1lKTsgfSk7XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5QmFzZSBleHRlbmRzIFN1cnZleU1vZGVsIHtcclxuICAgICAgICBwcml2YXRlIHJlbmRlcmVkRWxlbWVudDogSFRNTEVsZW1lbnQ7XHJcbiAgICAgICAgcHVibGljIG9uUmVuZGVyZWQ6IEV2ZW50PChzZW5kZXI6IFN1cnZleU1vZGVsKSA9PiBhbnksIGFueT4gPSBuZXcgRXZlbnQ8KHNlbmRlcjogU3VydmV5TW9kZWwpID0+IGFueSwgYW55PigpO1xyXG5cclxuICAgICAgICBrb0N1cnJlbnRQYWdlOiBhbnk7IGtvSXNGaXJzdFBhZ2U6IGFueTsga29Jc0xhc3RQYWdlOiBhbnk7IGR1bW15T2JzZXJ2YWJsZTogYW55O1xyXG4gICAgICAgIGtvUHJvZ3Jlc3M6IGFueTsga29Qcm9ncmVzc1RleHQ6IGFueTtcclxuXHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55ID0gbnVsbCwgcmVuZGVyZWRFbGVtZW50OiBhbnkgPSBudWxsKSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGpzb25PYmosIHJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2Yga28gPT09ICd1bmRlZmluZWQnKSB0aHJvdyBuZXcgRXJyb3IoJ2tub2Nrb3V0anMgbGlicmFyeSBpcyBub3QgbG9hZGVkLicpO1xyXG4gICAgICAgICAgICB0aGlzLnJlbmRlcihyZW5kZXJlZEVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwdWJsaWMgcmVuZGVyKGVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICBpZiAoZWxlbWVudCAmJiB0eXBlb2YgZWxlbWVudCA9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICAgICAgICAgIHRoaXMucmVuZGVyZWRFbGVtZW50ID0gZWxlbWVudDtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBlbGVtZW50ID0gdGhpcy5yZW5kZXJlZEVsZW1lbnQ7XHJcbiAgICAgICAgICAgIGlmICghZWxlbWVudCB8fCB0aGlzLmlzRW1wdHkpIHJldHVybjtcclxuICAgICAgICAgICAgZWxlbWVudC5pbm5lckhUTUwgPSB0aGlzLmdldFRlbXBsYXRlKCk7XHJcbiAgICAgICAgICAgIHNlbGYuYXBwbHlCaW5kaW5nKCk7XHJcbiAgICAgICAgICAgIHNlbGYub25SZW5kZXJlZC5maXJlKHNlbGYsIHt9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGNyZWF0ZU5ld1BhZ2UobmFtZTogc3RyaW5nKSB7IHJldHVybiBuZXcgUGFnZShuYW1lKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBnZXRUZW1wbGF0ZSgpOiBzdHJpbmcgeyB0aHJvdyBuZXcgRXJyb3IoXCJQbGVhc2Ugb3ZlcnJpZGUgdGhpcyBtZXRob2RcIik7IH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25CZWZvcmVDcmVhdGluZygpIHtcclxuICAgICAgICAgICAgdmFyIHNlbGYgPSB0aGlzO1xyXG4gICAgICAgICAgICB0aGlzLmR1bW15T2JzZXJ2YWJsZSA9IGtvLm9ic2VydmFibGUoMCk7XHJcbiAgICAgICAgICAgIHRoaXMua29DdXJyZW50UGFnZSA9IGtvLmNvbXB1dGVkKGZ1bmN0aW9uICgpIHsgc2VsZi5kdW1teU9ic2VydmFibGUoKTsgcmV0dXJuIHNlbGYuY3VycmVudFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvSXNGaXJzdFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmlzRmlyc3RQYWdlOyB9KTtcclxuICAgICAgICAgICAgdGhpcy5rb0lzTGFzdFBhZ2UgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmlzTGFzdFBhZ2U7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvUHJvZ3Jlc3NUZXh0ID0ga28uY29tcHV0ZWQoZnVuY3Rpb24gKCkgeyBzZWxmLmR1bW15T2JzZXJ2YWJsZSgpOyByZXR1cm4gc2VsZi5wcm9ncmVzc1RleHQ7IH0pO1xyXG4gICAgICAgICAgICB0aGlzLmtvUHJvZ3Jlc3MgPSBrby5jb21wdXRlZChmdW5jdGlvbiAoKSB7IHNlbGYuZHVtbXlPYnNlcnZhYmxlKCk7IHJldHVybiBzZWxmLmdldFByb2dyZXNzKCk7IH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3VycmVudFBhZ2VDaGFuZ2VkKG5ld1ZhbHVlOiBQYWdlTW9kZWwsIG9sZFZhbHVlOiBQYWdlTW9kZWwpIHtcclxuICAgICAgICAgICAgdGhpcy51cGRhdGVLb0N1cnJlbnRQYWdlKCk7XHJcbiAgICAgICAgICAgIHN1cGVyLmN1cnJlbnRQYWdlQ2hhbmdlZChuZXdWYWx1ZSwgb2xkVmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgb25Mb2FkU3VydmV5RnJvbVNlcnZpY2UoZWxlbWVudDogYW55KSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVuZGVyKGVsZW1lbnQpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGFwcGx5QmluZGluZygpIHtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLnJlbmRlcmVkRWxlbWVudCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnVwZGF0ZUtvQ3VycmVudFBhZ2UoKTtcclxuICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMucmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICAgICAga28uYXBwbHlCaW5kaW5ncyh0aGlzLCB0aGlzLnJlbmRlcmVkRWxlbWVudCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgdXBkYXRlS29DdXJyZW50UGFnZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5kdW1teU9ic2VydmFibGUodGhpcy5kdW1teU9ic2VydmFibGUoKSArIDEpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcml2YXRlIGdldFByb2dyZXNzKCk6IG51bWJlciB7XHJcbiAgICAgICAgICAgIGlmICh0aGlzLmN1cnJlbnRQYWdlID09IG51bGwpIHJldHVybiAwO1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB0aGlzLnZpc2libGVQYWdlcy5pbmRleE9mKHRoaXMuY3VycmVudFBhZ2UpICsgMTtcclxuICAgICAgICAgICAgcmV0dXJuIE1hdGguY2VpbCgoaW5kZXggKiAxMDAgLyB0aGlzLnZpc2libGVQYWdlQ291bnQpKTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbn0iLCIvLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4vc3VydmV5d2luZG93LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvc3VydmV5LnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5V2luZG93QmFzZSBleHRlbmRzIFN1cnZleVdpbmRvd01vZGVsIHtcclxuICAgICAgICBrb0V4cGFuZGVkOiBhbnk7XHJcbiAgICAgICAgZG9FeHBhbmQ6IGFueTtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkpIHtcclxuICAgICAgICAgICAgc3VwZXIoanNvbk9iaik7XHJcbiAgICAgICAgICAgIHRoaXMua29FeHBhbmRlZCA9IGtvLm9ic2VydmFibGUoZmFsc2UpO1xyXG4gICAgICAgICAgICB2YXIgc2VsZiA9IHRoaXM7XHJcbiAgICAgICAgICAgIHRoaXMuZG9FeHBhbmQgPSBmdW5jdGlvbiAoKSB7IHNlbGYuY2hhbmdlRXhwYW5kZWQoKTsgfVxyXG4gICAgICAgICAgICB0aGlzLnN1cnZleS5vbkNvbXBsZXRlLmFkZCgoc2VuZGVyOiBTdXJ2ZXlNb2RlbCkgPT4geyBzZWxmLm9uQ29tcGxldGUoKTsgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByb3RlY3RlZCBjcmVhdGVTdXJ2ZXkoanNvbk9iajogYW55KTogU3VydmV5TW9kZWwge1xyXG4gICAgICAgICAgICByZXR1cm4gbmV3IFN1cnZleUJhc2UoanNvbk9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGV4cGFuZGNvbGxhcHNlKHZhbHVlOiBib29sZWFuKSB7XHJcbiAgICAgICAgICAgIHN1cGVyLmV4cGFuZGNvbGxhcHNlKHZhbHVlKTtcclxuICAgICAgICAgICAgdGhpcy5rb0V4cGFuZGVkKHRoaXMuaXNFeHBhbmRlZFZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0ZW1wbGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGhpcy50ZW1wbGF0ZVZhbHVlID8gdGhpcy50ZW1wbGF0ZVZhbHVlIDogdGhpcy5nZXREZWZhdWx0VGVtcGxhdGUoKTsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXQgdGVtcGxhdGUodmFsdWU6IHN0cmluZykgeyB0aGlzLnRlbXBsYXRlVmFsdWUgPSB2YWx1ZTsgfVxyXG4gICAgICAgIHB1YmxpYyBzaG93KCkge1xyXG4gICAgICAgICAgICB0aGlzLndpbmRvd0VsZW1lbnQuaW5uZXJIVE1MID0gdGhpcy50ZW1wbGF0ZTtcclxuICAgICAgICAgICAga28uY2xlYW5Ob2RlKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIGtvLmFwcGx5QmluZGluZ3ModGhpcywgdGhpcy53aW5kb3dFbGVtZW50KTtcclxuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLndpbmRvd0VsZW1lbnQpO1xyXG4gICAgICAgICAgICAoPFN1cnZleT50aGlzLnN1cnZleSkucmVuZGVyKFN1cnZleVdpbmRvdy5zdXJ2ZXlFbGVtZW50TmFtZSk7XHJcbiAgICAgICAgICAgIHRoaXMuaXNTaG93aW5nVmFsdWUgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0RGVmYXVsdFRlbXBsYXRlKCk6IHN0cmluZyB7IHRocm93IG5ldyBFcnJvcihcIlBsZWFzZSBvdmVycmlkZSB0aGlzIG1ldGhvZFwiKTsgfVxyXG4gICAgICAgIHB1YmxpYyBoaWRlKCkge1xyXG4gICAgICAgICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKHRoaXMud2luZG93RWxlbWVudCk7XHJcbiAgICAgICAgICAgIHRoaXMud2luZG93RWxlbWVudC5pbm5lckhUTUwgPSBcIlwiO1xyXG4gICAgICAgICAgICB0aGlzLmlzU2hvd2luZ1ZhbHVlID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgY2hhbmdlRXhwYW5kZWQoKSB7XHJcbiAgICAgICAgICAgIHRoaXMuZXhwYW5kY29sbGFwc2UoIXRoaXMuaXNFeHBhbmRlZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHByaXZhdGUgb25Db21wbGV0ZSgpIHtcclxuICAgICAgICAgICAgdGhpcy5oaWRlKCk7XHJcbiAgICAgICAgfVxyXG4gICB9XHJcbn0iLCJtb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXlUZW1wbGF0ZVRleHRCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHVibGljIHJlcGxhY2VUZXh0KHJlcGxhY2VUZXh0OiBzdHJpbmcsIGlkOiBzdHJpbmcsIHF1ZXN0aW9uVHlwZTogc3RyaW5nID0gbnVsbCkge1xyXG4gICAgICAgICAgICBpZCA9IHRoaXMuZ2V0SWQoaWQsIHF1ZXN0aW9uVHlwZSk7XHJcbiAgICAgICAgICAgIHZhciBwb3MgPSB0aGlzLnRleHQuaW5kZXhPZihpZCk7XHJcbiAgICAgICAgICAgIGlmIChwb3MgPCAwKSByZXR1cm47XHJcbiAgICAgICAgICAgIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKCc+JywgcG9zKTtcclxuICAgICAgICAgICAgaWYgKHBvcyA8IDApIHJldHVybjtcclxuICAgICAgICAgICAgdmFyIHN0YXJ0UG9zID0gcG9zICsgMTtcclxuICAgICAgICAgICAgdmFyIGVuZFN0cmluZyA9IFwiPC9zY3JpcHQ+XCI7XHJcbiAgICAgICAgICAgIHBvcyA9IHRoaXMudGV4dC5pbmRleE9mKGVuZFN0cmluZywgc3RhcnRQb3MpO1xyXG4gICAgICAgICAgICBpZiAocG9zIDwgMCkgcmV0dXJuO1xyXG4gICAgICAgICAgICB0aGlzLnRleHQgPSB0aGlzLnRleHQuc3Vic3RyKDAsIHN0YXJ0UG9zKSArIHJlcGxhY2VUZXh0ICsgdGhpcy50ZXh0LnN1YnN0cihwb3MpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgZ2V0SWQoaWQ6IHN0cmluZywgcXVlc3Rpb25UeXBlOiBzdHJpbmcpIHtcclxuICAgICAgICAgICAgdmFyIHJlc3VsdCA9ICdpZD1cInN1cnZleS0nICsgaWQ7XHJcbiAgICAgICAgICAgIGlmIChxdWVzdGlvblR5cGUpIHtcclxuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBcIi1cIiArIHF1ZXN0aW9uVHlwZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzdWx0ICsgJ1wiJztcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldCB0ZXh0KCk6IHN0cmluZyB7IHJldHVybiBcIlwiOyB9XHJcbiAgICAgICAgcHJvdGVjdGVkIHNldCB0ZXh0KHZhbHVlOiBzdHJpbmcpIHsgIH1cclxuICAgIH1cclxufVxyXG4iLCJtb2R1bGUgdGVtcGxhdGUua28geyBleHBvcnQgdmFyIGh0bWwgPSAnPHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktY29tbWVudFwiPiAgPGlucHV0IGNsYXNzPVwiZm9ybS1jb250cm9sXCIgZGF0YS1iaW5kPVwidmFsdWU6JGRhdGEucXVlc3Rpb24ua29Db21tZW50LCB2aXNpYmxlOiRkYXRhLnZpc2libGVcIiAvPjwvc2NyaXB0PjxkaXYgY2xhc3M9XCJwYW5lbC1oZWFkaW5nXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIHNob3dUaXRsZVwiPiAgICA8aDMgZGF0YS1iaW5kPVwidGV4dDp0aXRsZVwiPjwvaDM+PC9kaXY+PCEtLSBrbyBpZjoga29DdXJyZW50UGFnZSgpIC0tPjxkaXYgIGNsYXNzPVwicGFuZWwtYm9keVwiPiAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHNob3dQcm9ncmVzc0JhciA9PVxcJ3RvcFxcJywgdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXByb2dyZXNzXFwnLCBkYXRhOiAkZGF0YSB9XCI+PC9kaXY+ICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXBhZ2VcXCcsIGRhdGE6IGtvQ3VycmVudFBhZ2UgfVwiPjwvZGl2PiAgICA8ZGl2IHN0eWxlPVwibWFyZ2luLXRvcDoxMHB4XCIgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd1Byb2dyZXNzQmFyID09XFwnYm90dG9tXFwnLCB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcHJvZ3Jlc3NcXCcsIGRhdGE6ICRkYXRhIH1cIj48L2Rpdj48L2Rpdj48ZGl2IGNsYXNzPVwicGFuZWwtZm9vdGVyXCIgZGF0YS1iaW5kPVwidmlzaWJsZTogc2hvd05hdmlnYXRpb25CdXR0b25zICYmICFpc0Rlc2lnbk1vZGVcIj4gICAgPGlucHV0IHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ1dHRvblwiIGRhdGEtYmluZD1cInZhbHVlOiBwYWdlUHJldlRleHQsIGNsaWNrOiBwcmV2UGFnZSwgdmlzaWJsZTogIWtvSXNGaXJzdFBhZ2UoKVwiIC8+ICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidXR0b25cIiB2YWx1ZT1cIk5leHRcIiBkYXRhLWJpbmQ9XCJ2YWx1ZTogcGFnZU5leHRUZXh0LCBjbGljazogbmV4dFBhZ2UsIHZpc2libGU6ICFrb0lzTGFzdFBhZ2UoKVwiIC8+ICAgIDxpbnB1dCB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidXR0b25cIiB2YWx1ZT1cIlN1Ym1pdFwiIGRhdGEtYmluZD1cInZhbHVlOiBjb21wbGV0ZVRleHQsIGNsaWNrOiBjb21wbGV0ZUxhc3RQYWdlLCB2aXNpYmxlOiBrb0lzTGFzdFBhZ2UoKVwiIC8+PC9kaXY+PCEtLSAva28gLS0+PCEtLSBrbyBpZjoga29DdXJyZW50UGFnZSgpID09IG51bGwgLS0+PGRpdiBjbGFzcz1cInBhbmVsLWJvZHlcIj4gICAgVGhlcmUgaXMgbm8gYW55IHZpc2libGUgcGFnZSBvciB2aXNpYmxlIHF1ZXN0aW9uIGluIHRoZSBzdXJ2ZXkuPC9kaXY+PCEtLSAva28gLS0+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcGFnZVwiPiAgICA8aDQgZGF0YS1iaW5kPVwidmlzaWJsZTogKHRpdGxlLmxlbmd0aCA+IDApICYmIGRhdGEuc2hvd1BhZ2VUaXRsZXMsIHRleHQ6IGtvTm8oKSArIHRpdGxlXCI+PC9oND4gICAgPCEtLSBrbyBmb3JlYWNoOiB7IGRhdGE6IHF1ZXN0aW9ucywgYXM6IFxcJ3F1ZXN0aW9uXFwnIH0gLS0+ICAgIDwhLS0ga28gdGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LXF1ZXN0aW9uXFwnLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICA8IS0tIC9rbyAtLT4gICAgPCEtLSAva28gLS0+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcHJvZ3Jlc3NcIj4gICAgPGRpdiBjbGFzcz1cInByb2dyZXNzIGNlbnRlci1ibG9ja1wiIHN0eWxlPVwid2lkdGg6NjAlO1wiPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJzdHlsZTp7d2lkdGg6IGtvUHJvZ3Jlc3MoKSArIFxcJyVcXCd9XCIgICAgICAgICAgICAgY2xhc3M9XCJwcm9ncmVzcy1iYXJcIiByb2xlPVwicHJvZ3Jlc3NiYXJcIiBhcmlhLXZhbHVlbWluPVwiMFwiICAgICAgICAgICAgIGFyaWEtdmFsdWVtYXg9XCIxMDBcIj4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OmtvUHJvZ3Jlc3NUZXh0XCI+PC9zcGFuPiAgICAgICAgPC9kaXY+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWNoZWNrYm94XCI+ICAgIDxmb3JtIGNsYXNzPVwiZm9ybS1pbmxpbmVcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgYXM6IFxcJ2l0ZW1cXCcsIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb0FmdGVyUmVuZGVyfSAgLS0+ICAgICAgICA8ZGl2IGNsYXNzPVwiY2hlY2tib3hcIiBkYXRhLWJpbmQ9XCJzdHlsZTp7d2lkdGg6IHF1ZXN0aW9uLmtvV2lkdGgsIFxcJ21hcmdpbi1yaWdodFxcJzogcXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFxcJzVweFxcJzogXFwnMHB4XFwnfVwiPiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAgICAgICAgICAgICAgICAgICBkYXRhLWJpbmQ9XCJhdHRyOiB7bmFtZTogcXVlc3Rpb24ubmFtZSwgdmFsdWU6IGl0ZW0udmFsdWV9LCBjaGVja2VkOiBxdWVzdGlvbi5rb1ZhbHVlXCIgLz4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRleHRcIj48L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOnF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogcXVlc3Rpb24ua29PdGhlclZpc2libGUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9mb3JtPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWNvbW1lbnRcIj4gICAgPHRleHRhcmVhIHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7Y29sczogcXVlc3Rpb24uY29scywgcm93czogcXVlc3Rpb24ucm93c30sIHZhbHVlOnF1ZXN0aW9uLmtvVmFsdWVcIiAvPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLWRyb3Bkb3duXCI+ICAgIDxzZWxlY3QgZGF0YS1iaW5kPVwib3B0aW9uczogcXVlc3Rpb24udmlzaWJsZUNob2ljZXMsIG9wdGlvbnNUZXh0OiBcXCd0ZXh0XFwnLCBvcHRpb25zVmFsdWU6IFxcJ3ZhbHVlXFwnLCB2YWx1ZTogcXVlc3Rpb24ua29WYWx1ZSwgb3B0aW9uc0NhcHRpb246IHF1ZXN0aW9uLm9wdGlvbnNDYXB0aW9uXCI+PC9zZWxlY3Q+ICAgIDxkaXYgZGF0YS1iaW5kPVwidmlzaWJsZTogcXVlc3Rpb24uaGFzT3RoZXJcIj4gICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHF1ZXN0aW9uLmtvT3RoZXJWaXNpYmxlIH0gfVwiPjwvZGl2PiAgICA8L2Rpdj48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1odG1sXCI+ICAgIDxkaXYgZGF0YS1iaW5kPVwiaHRtbDogcXVlc3Rpb24uaHRtbFwiPjwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLW1hdHJpeFwiPiAgICA8dGFibGUgY2xhc3M9XCJ0YWJsZVwiPiAgICAgICAgPHRoZWFkPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRoIGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc1Jvd3NcIj48L3RoPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmNvbHVtbnMgLS0+ICAgICAgICAgICAgICAgIDx0aCBkYXRhLWJpbmQ9XCJ0ZXh0OiRkYXRhLnRleHRcIj48L3RoPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgPC90aGVhZD4gICAgICAgIDx0Ym9keT4gICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHsgZGF0YTogcXVlc3Rpb24udmlzaWJsZVJvd3MsIGFzOiBcXCdyb3dcXCcgfSAtLT4gICAgICAgICAgICA8dHI+ICAgICAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5oYXNSb3dzLCB0ZXh0OnJvdy50ZXh0XCI+PC90ZD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICA8dGQ+ICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHJvdy5mdWxsTmFtZSwgdmFsdWU6ICRkYXRhLnZhbHVlfSwgY2hlY2tlZDogcm93LmtvVmFsdWVcIi8+ICAgICAgICAgICAgICAgIDwvdGQ+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvdHI+ICAgICAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8L3Rib2R5PiAgICA8L3RhYmxlPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLW1hdHJpeGRyb3Bkb3duXCI+ICAgIDx0YWJsZSBjbGFzcz1cInRhYmxlXCI+ICAgICAgICA8dGhlYWQ+ICAgICAgICAgICAgPHRyPiAgICAgICAgICAgICAgICA8dGg+PC90aD4gICAgICAgICAgICAgICAgPCEtLSBrbyBmb3JlYWNoOiBxdWVzdGlvbi5jb2x1bW5zIC0tPiAgICAgICAgICAgICAgICA8dGggZGF0YS1iaW5kPVwidGV4dDokZGF0YS50aXRsZVwiPjwvdGg+ICAgICAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgICAgIDwvdHI+ICAgICAgICA8L3RoZWFkPiAgICAgICAgPHRib2R5PiAgICAgICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlUm93cywgYXM6IFxcJ3Jvd1xcJyB9IC0tPiAgICAgICAgICAgIDx0cj4gICAgICAgICAgICAgICAgPHRkIGRhdGEtYmluZD1cInRleHQ6cm93LnRleHRcIj48L3RkPiAgICAgICAgICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHJvdy5jZWxscyAtLT4gICAgICAgICAgICAgICAgPHRkPiAgICAgICAgICAgICAgICAgICAgPHNlbGVjdCBkYXRhLWJpbmQ9XCJvcHRpb25zOiAkZGF0YS5jaG9pY2VzLCBvcHRpb25zVGV4dDogXFwndGV4dFxcJywgb3B0aW9uc1ZhbHVlOiBcXCd2YWx1ZVxcJywgdmFsdWU6ICRkYXRhLmtvVmFsdWUsIG9wdGlvbnNDYXB0aW9uOiAkZGF0YS5vcHRpb25zQ2FwdGlvblwiPjwvc2VsZWN0PiAgICAgICAgICAgICAgICA8L3RkPiAgICAgICAgICAgICAgICA8IS0tIC9rbyAtLT4gICAgICAgICAgICA8L3RyPiAgICAgICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPC90Ym9keT4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1tdWx0aXBsZXRleHRcIj4gICAgPHRhYmxlIGNsYXNzPVwidGFibGVcIiBkYXRhLWJpbmQ9XCJmb3JlYWNoOiB7IGRhdGE6ICBxdWVzdGlvbi5pdGVtcywgYXM6IFxcJ2l0ZW1cXCcgfVwiPiAgICAgICAgPHRyPiAgICAgICAgICAgIDx0ZCBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRpdGxlXCI+PC90ZD4gICAgICAgICAgICA8dGQ+PGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7c2l6ZTogcXVlc3Rpb24uaXRlbVNpemV9LCB2YWx1ZTogaXRlbS5rb1ZhbHVlXCIgLz48L3RkPiAgICAgICAgPC90cj4gICAgPC90YWJsZT48L3NjcmlwdD48c2NyaXB0IHR5cGU9XCJ0ZXh0L2h0bWxcIiBpZD1cInN1cnZleS1xdWVzdGlvbi1yYWRpb2dyb3VwXCI+ICAgIDxmb3JtIGNsYXNzPVwiZm9ybS1pbmxpbmVcIj4gICAgICAgIDwhLS0ga28gZm9yZWFjaDogeyBkYXRhOiBxdWVzdGlvbi52aXNpYmxlQ2hvaWNlcywgYXM6IFxcJ2l0ZW1cXCcsIGFmdGVyUmVuZGVyOiBxdWVzdGlvbi5rb0FmdGVyUmVuZGVyfSAgLS0+ICAgICAgICA8ZGl2IGNsYXNzPVwicmFkaW9cIiBkYXRhLWJpbmQ9XCJzdHlsZTp7d2lkdGg6IHF1ZXN0aW9uLmtvV2lkdGgsIFxcJ21hcmdpbi1yaWdodFxcJzogcXVlc3Rpb24uY29sQ291bnQgPT0gMCA/IFxcJzVweFxcJzogXFwnMHB4XFwnfVwiPiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiAgICAgICAgICAgICAgICAgICBkYXRhLWJpbmQ9XCJhdHRyOiB7bmFtZTogcXVlc3Rpb24ubmFtZSwgdmFsdWU6IGl0ZW0udmFsdWV9LCBjaGVja2VkOiBxdWVzdGlvbi5rb1ZhbHVlXCIgLz4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ0ZXh0OiBpdGVtLnRleHRcIj48L3NwYW4+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOnF1ZXN0aW9uLmhhc090aGVyXCI+ICAgICAgICAgICAgPGRpdiBkYXRhLWJpbmQ9XCJ0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktY29tbWVudFxcJywgZGF0YToge1xcJ3F1ZXN0aW9uXFwnOiBxdWVzdGlvbiwgXFwndmlzaWJsZVxcJzogcXVlc3Rpb24ua29PdGhlclZpc2libGUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9mb3JtPjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXJhdGluZ1wiPiAgICA8ZGl2IGNsYXNzPVwiYnRuLWdyb3VwXCIgZGF0YS10b2dnbGU9XCJidXR0b25zXCI+ICAgICAgICA8IS0tIGtvIGZvcmVhY2g6IHF1ZXN0aW9uLmtvVmlzaWJsZVJhdGVWYWx1ZXMgLS0+ICAgICAgICA8bGFiZWwgY2xhc3M9XCJidG4gYnRuLWRlZmF1bHRcIiBkYXRhLWJpbmQ9XCJjc3M6e2FjdGl2ZTogJGRhdGEudmFsdWUgPT0gcXVlc3Rpb24ua29WYWx1ZSgpfVwiPiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwicmFkaW9cIiAgICAgICAgICAgICAgICAgICAgZGF0YS1iaW5kPVwiYXR0cjoge25hbWU6IHF1ZXN0aW9uLm5hbWUsIGlkOiBxdWVzdGlvbi5uYW1lICsgJGluZGV4KCksIHZhbHVlOiAkZGF0YS52YWx1ZX0sIGV2ZW50OiB7IGNoYW5nZTogcXVlc3Rpb24ua29DaGFuZ2V9XCIgLz4gICAgICAgICAgICA8c3BhbiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiAkaW5kZXgoKSA9PSAwLCB0ZXh0OiBxdWVzdGlvbi5taW5pbnVtUmF0ZURlc2NyaXB0aW9uXCI+PC9zcGFuPiAgICAgICAgICAgIDxzcGFuIGRhdGEtYmluZD1cInRleHQ6ICRkYXRhLnRleHRcIj48L3NwYW4+ICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidmlzaWJsZTogJGluZGV4KCkgPT0gKHF1ZXN0aW9uLmtvVmlzaWJsZVJhdGVWYWx1ZXMoKS5sZW5ndGgtMSksIHRleHQ6IHF1ZXN0aW9uLm1heGltdW1SYXRlRGVzY3JpcHRpb25cIj48L3NwYW4+ICAgICAgICA8L2xhYmVsPiAgICAgICAgPCEtLSAva28gLS0+ICAgIDwvZGl2Pjwvc2NyaXB0PjxzY3JpcHQgdHlwZT1cInRleHQvaHRtbFwiIGlkPVwic3VydmV5LXF1ZXN0aW9uLXRleHRcIj4gICAgPGlucHV0IHR5cGU9XCJ0ZXh0XCIgY2xhc3M9XCJmb3JtLWNvbnRyb2xcIiBkYXRhLWJpbmQ9XCJhdHRyOiB7c2l6ZTogcXVlc3Rpb24uc2l6ZX0sIHZhbHVlOnF1ZXN0aW9uLmtvVmFsdWVcIi8+PC9zY3JpcHQ+PHNjcmlwdCB0eXBlPVwidGV4dC9odG1sXCIgaWQ9XCJzdXJ2ZXktcXVlc3Rpb25cIj4gICAgPGRpdiBkYXRhLWJpbmQ9XCJ2aXNpYmxlOiBxdWVzdGlvbi5rb1Zpc2libGUoKVwiPiAgICAgICAgPGRpdiBjbGFzcz1cImFsZXJ0IGFsZXJ0LWRhbmdlclwiIHJvbGU9XCJhbGVydFwiIGRhdGEtYmluZD1cInZpc2libGU6IGtvRXJyb3JzKCkubGVuZ3RoID4gMCwgZm9yZWFjaDoga29FcnJvcnNcIj4gICAgICAgICAgICA8ZGl2PiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBnbHlwaGljb24tZXhjbGFtYXRpb24tc2lnblwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPjwvc3Bhbj4gICAgICAgICAgICAgICAgPHNwYW4gZGF0YS1iaW5kPVwidGV4dDokZGF0YS5nZXRUZXh0KClcIj48L3NwYW4+ICAgICAgICAgICAgPC9kaXY+ICAgICAgICA8L2Rpdj4gICAgICAgIDwhLS0ga28gaWY6IHF1ZXN0aW9uLmhhc1RpdGxlIC0tPiAgICAgICAgPGg1IGRhdGEtYmluZD1cInRleHQ6IHF1ZXN0aW9uLmtvTm8oKSArICAocXVlc3Rpb24uaXNSZXF1aXJlZCA/IHF1ZXN0aW9uLmRhdGEucmVxdWlyZWRUZXh0IDogXFwnXFwnKSArIHF1ZXN0aW9uLnRpdGxlXCI+PC9oNT4gICAgICAgIDwhLS0gL2tvIC0tPiAgICAgICAgPCEtLSBrbyB0ZW1wbGF0ZTogeyBuYW1lOiBcXCdzdXJ2ZXktcXVlc3Rpb24tXFwnICsgcXVlc3Rpb24uZ2V0VHlwZSgpLCBkYXRhOiBxdWVzdGlvbiB9IC0tPiAgICAgICAgPCEtLSAva28gLS0+ICAgICAgICA8ZGl2IGRhdGEtYmluZD1cInZpc2libGU6IHF1ZXN0aW9uLmhhc0NvbW1lbnRcIj4gICAgICAgICAgICBPdGhlciAocGxlYXNlIGRlc2NyaWJlKSAgICAgICAgICAgIDxkaXYgZGF0YS1iaW5kPVwidGVtcGxhdGU6IHsgbmFtZTogXFwnc3VydmV5LWNvbW1lbnRcXCcsIGRhdGE6IHtcXCdxdWVzdGlvblxcJzogcXVlc3Rpb24sIFxcJ3Zpc2libGVcXCc6IHRydWUgfSB9XCI+PC9kaXY+ICAgICAgICA8L2Rpdj4gICAgPC9kaXY+PC9zY3JpcHQ+Jzt9IiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cInRlbXBsYXRlLmtvLmh0bWwudHNcIiAvPlxyXG4vLy8gPHJlZmVyZW5jZSBwYXRoPVwiLi4va29zdXJ2ZXkudHNcIiAvPlxyXG5tb2R1bGUgU3VydmV5IHtcclxuICAgIGV4cG9ydCBjbGFzcyBTdXJ2ZXkgZXh0ZW5kcyBTdXJ2ZXlCYXNlIHtcclxuICAgICAgICBjb25zdHJ1Y3Rvcihqc29uT2JqOiBhbnkgPSBudWxsLCByZW5kZXJlZEVsZW1lbnQ6IGFueSA9IG51bGwpIHtcclxuICAgICAgICAgICAgc3VwZXIoanNvbk9iaiwgcmVuZGVyZWRFbGVtZW50KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldFRlbXBsYXRlKCk6IHN0cmluZyB7IHJldHVybiB0ZW1wbGF0ZS5rby5odG1sOyB9XHJcbiAgICB9XHJcbn1cclxuIiwiLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL2tvc3VydmV5d2luZG93LnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cImtvc3VydmV5Ym9vdHN0cmFwLnRzXCIgLz5cclxubW9kdWxlIFN1cnZleSB7XHJcbiAgICBleHBvcnQgY2xhc3MgU3VydmV5V2luZG93IGV4dGVuZHMgU3VydmV5V2luZG93QmFzZSB7XHJcbiAgICAgICAga29FeHBhbmRlZDogYW55O1xyXG4gICAgICAgIGRvRXhwYW5kOiBhbnk7XHJcbiAgICAgICAgY29uc3RydWN0b3IoanNvbk9iajogYW55KSB7XHJcbiAgICAgICAgICAgIHN1cGVyKGpzb25PYmopO1xyXG4gICAgICAgIH1cclxuICAgICAgICBwcm90ZWN0ZWQgY3JlYXRlU3VydmV5KGpzb25PYmo6IGFueSk6IFN1cnZleU1vZGVsIHtcclxuICAgICAgICAgICAgcmV0dXJuIG5ldyBTdXJ2ZXkoanNvbk9iailcclxuICAgICAgICB9XHJcbiAgICAgICAgcHJvdGVjdGVkIGdldERlZmF1bHRUZW1wbGF0ZSgpOiBzdHJpbmcgeyByZXR1cm4gdGVtcGxhdGUud2luZG93LmtvLmh0bWwgfVxyXG4gICAgfVxyXG59IiwibW9kdWxlIHRlbXBsYXRlLndpbmRvdy5rbyB7IGV4cG9ydCB2YXIgaHRtbCA9ICc8ZGl2IGNsYXNzPVwibW9kYWwtY29udGVudFwiIHN0eWxlPVwicG9zaXRpb246IGZpeGVkOyBib3R0b206IDNweDsgcmlnaHQ6IDEwcHg7XCI+ICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1oZWFkZXIgcGFuZWwtdGl0bGVcIj4gICAgICAgIDxhIGhyZWY9XCIjXCIgZGF0YS1iaW5kPVwiY2xpY2s6ZG9FeHBhbmRcIiBzdHlsZT1cIndpZHRoOjEwMCVcIj4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cInB1bGwtbGVmdFwiIHN0eWxlPVwicGFkZGluZy1yaWdodDoxMHB4XCIgZGF0YS1iaW5kPVwidGV4dDp0aXRsZVwiPjwvc3Bhbj4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImdseXBoaWNvbiBwdWxsLXJpZ2h0XCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZGF0YS1iaW5kPVwiY3NzOntcXCdnbHlwaGljb24tY2hldnJvbi1kb3duXFwnOiBrb0V4cGFuZGVkKCksIFxcJ2dseXBoaWNvbi1jaGV2cm9uLXVwXFwnOiAha29FeHBhbmRlZCgpfVwiPjwvc3Bhbj4gICAgICAgIDwvYT4gICAgPC9kaXY+ICAgIDxkaXYgY2xhc3M9XCJtb2RhbC1ib2R5XCIgZGF0YS1iaW5kPVwidmlzaWJsZTprb0V4cGFuZGVkXCI+ICAgICAgICA8ZGl2IGNsYXNzPVwic3Zfd2luZG93X2NvbnRlbnRcIiBpZD1cIndpbmRvd1N1cnZleUpTXCI+PC9kaXY+ICAgIDwvZGl2PjwvZGl2Pic7fSIsIi8vLyA8cmVmZXJlbmNlIHBhdGg9XCJ0ZW1wbGF0ZS5rby5odG1sLnRzXCIgLz5cclxuLy8vIDxyZWZlcmVuY2UgcGF0aD1cIi4uL3RlbXBsYXRlVGV4dC50c1wiIC8+XHJcbm1vZHVsZSBTdXJ2ZXkge1xyXG4gICAgZXhwb3J0IGNsYXNzIFN1cnZleVRlbXBsYXRlVGV4dCBleHRlbmRzIFN1cnZleVRlbXBsYXRlVGV4dEJhc2Uge1xyXG4gICAgICAgIHByb3RlY3RlZCBnZXQgdGV4dCgpOiBzdHJpbmcgeyByZXR1cm4gdGVtcGxhdGUua28uaHRtbDsgfVxyXG4gICAgICAgIHByb3RlY3RlZCBzZXQgdGV4dCh2YWx1ZTogc3RyaW5nKSB7IHRlbXBsYXRlLmtvLmh0bWwgPSB2YWx1ZTsgfVxyXG4gICAgfVxyXG59XHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=
